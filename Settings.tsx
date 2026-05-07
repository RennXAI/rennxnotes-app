import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Medication, ChecklistItem } from '../lib/models';
import { Plus, Trash2 } from 'lucide-react';

export default function Settings() {
  const { profile } = useAuth();
  const { residents, activeResident } = useData();
  const [twilioToNumber, setTwilioToNumber] = useState('');
  const [notificationTime, setNotificationTime] = useState('');
  const [newResidentName, setNewResidentName] = useState('');

  const [meds, setMeds] = useState<Medication[]>([]);
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'global'));
        if (snap.exists()) {
          setTwilioToNumber(snap.data().twilioToNumber || '');
          setNotificationTime(snap.data().notificationTime || '');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'settings/global');
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!activeResident) return;
    const unsub1 = onSnapshot(query(collection(db, `residents/${activeResident.id}/medications`)), (snap) => {
      setMeds(snap.docs.map(d => ({ id: d.id, ...d.data() } as Medication)));
    }, err => handleFirestoreError(err, OperationType.LIST, 'medications'));
    
    const unsub2 = onSnapshot(query(collection(db, `residents/${activeResident.id}/checklists`)), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChecklistItem)));
    }, err => handleFirestoreError(err, OperationType.LIST, 'checklists'));
    
    return () => { unsub1(); unsub2(); };
  }, [activeResident]);

  const saveSettings = async () => {
    if (profile?.role !== 'admin') return;
    try {
      const ref = doc(db, 'settings', 'global');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, {
          twilioToNumber,
          notificationTime,
          updatedAt: Date.now()
        });
      } else {
        await setDoc(ref, {
          twilioToNumber,
          notificationTime,
          updatedAt: Date.now()
        });
      }
      alert('Settings saved!');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/global');
    }
  };

  const addResident = async () => {
    if (!newResidentName.trim() || profile?.role !== 'admin') return;
    try {
      const id = newResidentName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await setDoc(doc(db, 'residents', id), {
        name: newResidentName.trim(),
        createdAt: Date.now()
      });
      setNewResidentName('');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'residents');
    }
  };

  const addMedication = async () => {
    if (!activeResident || profile?.role !== 'admin') return;
    const name = prompt('Medication Name:');
    if (!name) return;
    const instructions = prompt('Instructions (e.g., take with food):') || '';
    const period = prompt('Period (morning/afternoon/evening):', 'morning') as any;
    
    if (['morning', 'afternoon', 'evening'].includes(period)) {
       try {
         await addDoc(collection(db, `residents/${activeResident.id}/medications`), {
           name, instructions, period, createdAt: Date.now()
         });
       } catch (err) {
         handleFirestoreError(err, OperationType.CREATE, 'medications');
       }
    }
  };

  const addTask = async () => {
    if (!activeResident || profile?.role !== 'admin') return;
    const task = prompt('Task (e.g., Change bedding):');
    if (!task) return;
    const period = prompt('Period (morning/afternoon/evening):', 'morning') as any;
    
    if (['morning', 'afternoon', 'evening'].includes(period)) {
       try {
         await addDoc(collection(db, `residents/${activeResident.id}/checklists`), {
           task, period, createdAt: Date.now()
         });
       } catch (err) {
         handleFirestoreError(err, OperationType.CREATE, 'checklists');
       }
    }
  };

  const deleteResource = async (collectionName: string, id: string) => {
     if (!window.confirm("Are you sure?")) return;
     try {
       await deleteDoc(doc(db, `residents/${activeResident?.id}/${collectionName}`, id));
     } catch (err) {
       handleFirestoreError(err, OperationType.DELETE, collectionName);
     }
  };

  if (profile?.role !== 'admin') return <div className="p-8">Only administrators can modify settings.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 mb-12">
      <h1 className="text-3xl font-bold tracking-tight text-primary-dark mb-8">Settings</h1>
      
      <div className="glass-panel p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 text-zinc-900 tracking-tight">Twilio SMS Report Configuration</h2>
        <div className="grid gap-5 max-w-sm">
          <div>
            <label className="block text-sm font-bold tracking-wide text-zinc-700 mb-2 uppercase">Send Reports To</label>
            <input 
              type="text" 
              value={twilioToNumber}
              onChange={(e) => setTwilioToNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full bg-white/50 border border-white/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-action/50 focus:border-action outline-none transition-all shadow-sm font-medium placeholder:text-zinc-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold tracking-wide text-zinc-700 mb-2 uppercase">Scheduled Time</label>
            <input 
              type="time" 
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              className="w-full bg-white/50 border border-white/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-action/50 focus:border-action outline-none transition-all shadow-sm font-medium"
            />
          </div>
          <button 
            onClick={saveSettings}
            className="bg-action text-white px-5 py-3 rounded-xl font-bold hover:bg-action-dark hover:shadow-lg hover:shadow-action/30 transition-all active:scale-95 mt-2"
          >
            Save Settings
          </button>
        </div>
      </div>

      <div className="glass-panel p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 text-zinc-900 tracking-tight">Residents</h2>
        <ul className="mb-6 divide-y divide-black/5 bg-white/20 rounded-xl border border-white/30 px-2 py-1">
          {residents.map(r => (
            <li key={r.id} className="py-3 px-2 text-sm text-zinc-800 font-bold">{r.name}</li>
          ))}
          {residents.length === 0 && <li className="py-4 px-2 text-sm text-zinc-500 font-medium">No residents configured.</li>}
        </ul>
        <div className="flex gap-3 max-w-sm">
          <input 
            type="text" 
            value={newResidentName}
            onChange={(e) => setNewResidentName(e.target.value)}
            placeholder="Resident Name"
            className="flex-1 bg-white/50 border border-white/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-action/50 focus:border-action outline-none transition-all shadow-sm font-medium placeholder:text-zinc-400"
          />
          <button 
            onClick={addResident}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      {activeResident && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 tracking-tight">Medications ({activeResident.name})</h2>
            <button onClick={addMedication} className="mb-6 text-xs font-bold uppercase tracking-wider text-action bg-action/10 hover:bg-action/20 border border-action/20 px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors">
               <Plus className="w-4 h-4" /> Add Medication
            </button>
            <ul className="divide-y divide-black/5 bg-white/30 rounded-xl border border-white/40 shadow-sm p-2">
              {meds.map(m => (
                <li key={m.id} className="py-3 px-2 text-sm text-zinc-800 flex items-start justify-between group rounded-lg hover:bg-white/50 transition-colors">
                  <div>
                    <span className="font-bold">{m.name}</span> <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-2 bg-white/50 px-2 py-0.5 rounded-md border border-white/40">{m.period}</span>
                    {m.instructions && <p className="text-xs text-zinc-600 mt-1 font-medium">{m.instructions}</p>}
                  </div>
                  <button onClick={() => deleteResource('medications', m.id!)} className="text-zinc-400 hover:text-white hover:bg-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
              {meds.length === 0 && <li className="py-4 text-center text-sm text-zinc-500 font-medium">No medications.</li>}
            </ul>
          </div>

          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 tracking-tight">Checklist ({activeResident.name})</h2>
            <button onClick={addTask} className="mb-6 text-xs font-bold uppercase tracking-wider text-action bg-action/10 hover:bg-action/20 border border-action/20 px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors">
               <Plus className="w-4 h-4" /> Add Task
            </button>
            <ul className="divide-y divide-black/5 bg-white/30 rounded-xl border border-white/40 shadow-sm p-2">
              {tasks.map(t => (
                <li key={t.id} className="py-3 px-2 text-sm text-zinc-800 flex items-start justify-between group rounded-lg hover:bg-white/50 transition-colors">
                  <div className="pr-4">
                     <span className="font-bold block mb-1">{t.task}</span>
                     <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded-md border border-white/40">{t.period}</span>
                  </div>
                  <button onClick={() => deleteResource('checklists', t.id!)} className="text-zinc-400 hover:text-white hover:bg-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
              {tasks.length === 0 && <li className="py-4 text-center text-sm text-zinc-500 font-medium">No tasks.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
