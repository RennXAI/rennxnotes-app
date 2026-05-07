import React, { useState } from 'react';
import { useDailyData } from '../hooks/useDataSubscriptions';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Edit2, FileText } from 'lucide-react';
import { getDateString } from '../lib/api';
import { EventLog } from '../lib/models';
import { addObjectToSubcollection } from '../lib/dataHelpers';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';

export default function Activities() {
  const { activeResident, selectedDate } = useData();
  const { profile } = useAuth();
  const { events, vitals, meals, medLogs, checklistLogs } = useDailyData();

  if (!activeResident) return <div className="p-8">Please select a resident.</div>;

  const dateStr = getDateString(selectedDate);
  const allActivities = [...events, ...vitals, ...meals, ...medLogs, ...checklistLogs]
    .sort((a, b) => b.timestamp - a.timestamp);

  const handleManualEvent = async () => {
    if (!profile) return;
    const notes = window.prompt("Enter manual activity note:");
    if (!notes) return;

    const timeStr = window.prompt("Enter time (e.g., 08:30) or leave blank for now:");
    let timestamp = Date.now();
    if (timeStr) {
       const [hours, minutes] = timeStr.split(':').map(Number);
       if (!isNaN(hours) && !isNaN(minutes)) {
         const d = new Date(selectedDate);
         d.setHours(hours, minutes, 0, 0);
         timestamp = d.getTime();
       }
    }

    const obj: Omit<EventLog, 'id'> = {
      type: 'manual',
      notes,
      timestamp,
      authorId: profile.id || ''
    };
    await addObjectToSubcollection(activeResident.id!, dateStr, 'events', obj);
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm("Delete this log entry?")) return;
    try {
      await deleteDoc(doc(db, `residents/${activeResident.id}/dailyLogs/${dateStr}/${collectionName}`, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, collectionName);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">Activity Log</h1>
          <p className="text-zinc-600 mt-1 font-medium">{format(selectedDate, 'EEEE, MMMM do, yyyy')} • {activeResident.name}</p>
        </div>
        <button 
          onClick={handleManualEvent}
          className="flex items-center gap-2 bg-action text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-action-dark hover:shadow-lg hover:shadow-action/30 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Manual Entry
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        {allActivities.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-medium">
            No activities recorded for this date.
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {allActivities.map((item) => {
              let title = '';
              let desc = '';
              let badge = '';
              let badgeColor = '';
              let collectionName = '';

              if ('systolic' in item) { 
                title = 'Vitals Checked'; 
                desc = `${item.systolic}/${item.diastolic} BP, ${item.pulse} BPM`; 
                badge = 'Vitals';
                badgeColor = 'bg-rose-100 text-rose-700 border-rose-200';
                collectionName = 'vitals';
              }
              else if ('food' in item) { 
                title = `${item.type} Logged`; 
                desc = `Food: ${item.food} | Drinks: ${item.drinks}`; 
                badge = 'Meal';
                badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
                collectionName = 'meals';
              }
              else if ('medicationName' in item) { 
                title = 'Medication Given'; 
                desc = item.medicationName + (item.notes ? ` - ${item.notes}` : ''); 
                badge = 'Medication';
                badgeColor = 'bg-indigo-100 text-indigo-700 border-indigo-200';
                collectionName = 'medications';
              }
              else if ('task' in item) { 
                title = 'Checklist Task Done'; 
                desc = item.task + (item.notes ? ` - ${item.notes}` : ''); 
                badge = 'Checklist';
                badgeColor = 'bg-action-light/20 text-action-dark border-action/20';
                collectionName = 'checklistLogs';
              }
              else if ('type' in item) { 
                title = item.type === 'bm' ? 'Bowel Movement' : item.type === 'diaper' ? 'Diaper Changed' : 'Manual Note'; 
                desc = item.notes || ''; 
                badge = item.type === 'manual' ? 'Manual' : 'Bathroom';
                badgeColor = item.type === 'manual' ? 'bg-zinc-200 text-zinc-700 border-zinc-300' : 'bg-primary/10 text-primary-dark border-primary/20';
                collectionName = 'events';
              }

              return (
                <div key={item.id} className="p-5 flex items-start gap-5 hover:bg-white/40 transition-colors group">
                  <div className="w-24 pt-1 shrink-0 text-right">
                    <span className="text-sm font-bold tracking-tight text-zinc-800">
                      {format(new Date(item.timestamp), 'h:mm a')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-bold text-zinc-800 tracking-tight">{title}</span>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                        {badge}
                      </span>
                    </div>
                    {desc && <p className="text-sm text-zinc-600 whitespace-pre-wrap font-medium leading-relaxed">{desc}</p>}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleDelete(collectionName, item.id!)}
                      className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
