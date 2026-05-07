import React, { useState } from 'react';
import { useResidentConfig, useDailyData } from '../hooks/useDataSubscriptions';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { CheckSquare, Square, FileEdit, Plus, Trash2 } from 'lucide-react';
import { addObjectToSubcollection } from '../lib/dataHelpers';
import { getDateString } from '../lib/api';
import { ChecklistLog } from '../lib/models';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function Checklist() {
  const { activeResident, selectedDate } = useData();
  const { profile } = useAuth();
  const { checklists } = useResidentConfig();
  const { checklistLogs } = useDailyData();

  if (!activeResident) return <div className="p-8">Please select a resident.</div>;

  const periods = ['morning', 'afternoon', 'evening'] as const;

  const handleToggle = async (task: any, log: ChecklistLog | undefined) => {
    if (!profile) return;
    const dateStr = getDateString(selectedDate);
    
    if (log) {
      // Uncheck
      try {
        const path = `residents/${activeResident.id}/dailyLogs/${dateStr}/checklistLogs/${log.id}`;
        await deleteDoc(doc(db, path));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `checklistLogs`);
      }
    } else {
      // Check
      const notes = window.prompt(`Notes for "${task.task}" (optional):`) || '';
      const obj: Omit<ChecklistLog, 'id'> = {
        checklistId: task.id,
        task: task.task,
        notes,
        timestamp: Date.now(),
        authorId: profile.id || ''
      };
      await addObjectToSubcollection(activeResident.id!, dateStr, 'checklistLogs', obj);
    }
  };

  const handleEditTask = async (taskId: string, currentTask: string, currentPeriod: string) => {
    if (profile?.role !== 'admin') {
      alert('Only admins can edit checklist tasks.');
      return;
    }
    const newTask = window.prompt('Edit task:', currentTask);
    if (!newTask) return;
    try {
      await updateDoc(doc(db, `residents/${activeResident.id}/checklists`, taskId), {
        task: newTask
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'checklists');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (profile?.role !== 'admin') {
      alert('Only admins can delete checklist tasks.');
      return;
    }
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteDoc(doc(db, `residents/${activeResident.id}/checklists`, taskId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'checklists');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary-dark">Daily Checklist - {activeResident.name}</h1>
      </div>

      <div className="space-y-6">
        {periods.map(period => {
          const tasks = checklists.filter(c => c.period === period);
          if (tasks.length === 0) return null;

          return (
            <div key={period} className="glass-panel overflow-hidden">
              <div className="bg-white/40 border-b border-black/5 px-6 py-4">
                <h2 className="font-bold text-zinc-900 tracking-tight capitalize">{period}</h2>
              </div>
              <div className="divide-y divide-black/5">
                {tasks.map(task => {
                  const log = checklistLogs.find(l => l.checklistId === task.id);
                  const isCompleted = !!log;

                  return (
                    <div key={task.id} className={cn("p-6 flex items-start gap-5 transition-colors group", isCompleted ? "bg-action/5" : "hover:bg-white/40")}>
                      <button 
                        onClick={() => handleToggle(task, log)}
                        className={cn("mt-0.5 shrink-0 transition-colors", isCompleted ? "text-action" : "text-zinc-400 hover:text-action-light")}
                      >
                        {isCompleted ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                      </button>
                      <div className="flex-1">
                        <p className={cn("font-bold text-base mb-1 tracking-tight", isCompleted ? "text-zinc-500 line-through" : "text-zinc-800")}>
                          {task.task}
                        </p>
                        {isCompleted && log.notes && (
                          <p className="text-sm text-zinc-700 font-medium bg-white/60 border border-white/50 shadow-sm px-4 py-2 rounded-lg inline-block">
                            Note: {log.notes}
                          </p>
                        )}
                        {isCompleted && (
                          <p className="text-xs text-zinc-500 font-medium mt-2">
                            Completed at {new Date(log.timestamp).toLocaleTimeString([], {timeStyle: 'short'})}
                          </p>
                        )}
                      </div>
                      {profile?.role === 'admin' && (
                        <div className="flex items-center gap-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditTask(task.id!, task.task, task.period)} className="p-2 text-zinc-400 hover:text-primary bg-white/50 shadow-sm border border-white/40 rounded-lg transition-colors">
                            <FileEdit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTask(task.id!)} className="p-2 text-rose-400 hover:text-white bg-white/50 hover:bg-rose-500 shadow-sm border border-white/40 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
