import React, { useState } from 'react';
import { useDailyData, useResidentConfig } from '../hooks/useDataSubscriptions';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Activity, Plus, FileText, CheckSquare, ListPlus, Pill, Coffee, History, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addObjectToSubcollection } from '../lib/dataHelpers';
import { EventLog, VitalReading, MealLog, MedicationLog } from '../lib/models';
import { getDateString } from '../lib/api';

export default function DailySummary() {
  const { vitals, meals, medLogs, checklistLogs, events } = useDailyData();
  const { medications, checklists } = useResidentConfig();
  const { activeResident, selectedDate } = useData();
  const { profile } = useAuth();

  const [showMealModal, setShowMealModal] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [mealFood, setMealFood] = useState('');
  const [mealDrinks, setMealDrinks] = useState('');
  
  if (!activeResident) return <div className="p-8">Please select a resident from the sidebar.</div>;

  const totalDipers = events.filter(e => e.type === 'diaper').length;
  const bms = events.filter(e => e.type === 'bm');
  const recentEvents = [...events, ...meals, ...vitals, ...medLogs, ...checklistLogs]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const givenMedsCount = medLogs.length;
  const totalMeds = medications.length;

  const dateStr = getDateString(selectedDate);

  const addVital = async () => {
    if (!profile) return;
    const sys = parseInt(prompt('Systolic:') || '0');
    const dia = parseInt(prompt('Diastolic:') || '0');
    const pulse = parseInt(prompt('Pulse:') || '0');
    const period = prompt('Period (morning/afternoon):', 'morning') as 'morning' | 'afternoon';
    
    if (sys && dia && pulse && period) {
      const obj: Omit<VitalReading, 'id'> = {
        systolic: sys,
        diastolic: dia,
        pulse,
        period,
        timestamp: Date.now(),
        authorId: profile.id || ''
      };
      await addObjectToSubcollection(activeResident.id!, dateStr, 'vitals', obj);
    }
  };

  const submitMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    if (mealFood || mealDrinks) {
      const obj: Omit<MealLog, 'id'> = {
        type: mealType,
        food: mealFood,
        drinks: mealDrinks,
        timestamp: Date.now(),
        authorId: profile.id || ''
      };
      try {
        await addObjectToSubcollection(activeResident.id!, dateStr, 'meals', obj);
        setShowMealModal(false);
        setMealFood('');
        setMealDrinks('');
        setMealType('lunch');
      } catch(err) {
        console.error("Failed to add meal", err);
      }
    }
  };

  const logMedication = async () => {
    if (!profile || medications.length === 0) {
      alert("No medications configured for this resident.");
      return;
    }
    const medList = medications.map((m, i) => `${i + 1}: ${m.name}`).join('\n');
    const selected = parseInt(prompt(`Select medication (#):\n${medList}`) || '0');
    if (selected > 0 && selected <= medications.length) {
      const med = medications[selected - 1];
      const notes = prompt(`Notes for ${med.name} (optional):`) || '';
      const obj: Omit<MedicationLog, 'id'> = {
        medicationId: med.id!,
        medicationName: med.name,
        notes,
        timestamp: Date.now(),
        authorId: profile.id || ''
      };
      await addObjectToSubcollection(activeResident.id!, dateStr, 'medications', obj);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Daily Summary - {activeResident.name}</h1>
        <div className="flex gap-2">
           <LogEventButton type="bm" label="Log BM" icon={Activity} />
           <LogEventButton type="diaper" label="Log Diaper" icon={ListPlus} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Vitals Summary */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              <h2 className="font-bold text-zinc-800 tracking-tight">Vitals</h2>
            </div>
            <button onClick={() => addVital()} className="p-1 text-zinc-400 hover:text-action hover:bg-action/10 rounded-full transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {vitals.length === 0 ? (
            <p className="text-sm text-zinc-500 font-medium">No vitals recorded today.</p>
          ) : (
            <div className="space-y-3">
              {vitals.map(v => (
                <div key={v.id} className="flex justify-between items-center text-sm border-b border-black/5 pb-2 last:border-0">
                  <span className="capitalize font-semibold text-zinc-600">{v.period}</span>
                  <span className="font-mono text-zinc-800 bg-white/50 px-2 py-1 rounded-md shadow-sm border border-white/20">
                    {v.systolic}/{v.diastolic} <span className="text-zinc-400">|</span> {v.pulse} bpm
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meals Summary */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-zinc-800 tracking-tight">Meals & Snacks</h2>
            </div>
            <button onClick={() => setShowMealModal(true)} className="p-1 text-zinc-400 hover:text-action hover:bg-action/10 rounded-full transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {meals.length === 0 ? (
            <p className="text-sm text-zinc-500 font-medium">No meals recorded today.</p>
          ) : (
            <div className="space-y-3">
              {meals.map(m => (
                <div key={m.id} className="text-sm border-b border-black/5 pb-2 last:border-0 hover:bg-white/40 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="flex justify-between font-semibold text-zinc-700 capitalize pt-1">
                    <span>{m.type}</span>
                    <span className="text-xs text-zinc-500 flex items-center font-medium">{new Date(m.timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                  </div>
                  <div className="text-zinc-600 mt-0.5 line-clamp-1 text-xs pb-1">{m.food}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medications Summary */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-zinc-800 tracking-tight">Medications</h2>
            </div>
            <button onClick={() => logMedication()} className="p-1 text-zinc-400 hover:text-action hover:bg-action/10 rounded-full transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold mb-1.5 text-zinc-600 tracking-wide">
              <span>Given: {givenMedsCount}</span>
              <span>Total: {totalMeds}</span>
            </div>
            <div className="h-2 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary to-action rounded-full transition-all duration-500"
                style={{ width: totalMeds === 0 ? '0%' : `${(givenMedsCount / totalMeds) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {medications.map(m => {
              const given = medLogs.some(l => l.medicationId === m.id);
              return (
                <span 
                  key={m.id} 
                  className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide border shadow-sm ${
                    given 
                      ? 'bg-action/10 border-action/20 text-action-dark' 
                      : 'bg-white/50 border-white/40 text-zinc-500'
                  }`}
                >
                  {m.name}
                </span>
              );
            })}
            {medications.length === 0 && <span className="text-xs text-zinc-500 font-medium tracking-wide">No meds configured</span>}
          </div>
        </div>

        {/* Diapers & BMs */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <ListPlus className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-zinc-800 tracking-tight">Bathroom</h2>
          </div>
          
          <div className="flex items-center justify-between bg-white/40 shadow-sm p-3 rounded-xl border border-white/20 mb-4">
             <span className="text-sm font-semibold text-zinc-700">Diaper Changes</span>
             <span className="text-lg font-bold text-action bg-action/10 px-3 py-0.5 rounded-lg border border-action/20">{totalDipers}</span>
          </div>

          <div>
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Bowel Movements ({bms.length})</span>
             <div className="space-y-2">
                {bms.map(b => (
                  <div key={b.id} className="text-sm border-l-2 border-action pl-3 py-1">
                    <span className="text-xs text-zinc-500 font-medium block mb-0.5">{new Date(b.timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                    <span className="text-zinc-700 font-medium">{b.notes || 'No description provided'}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Recent Activity Mini-log */}
        <div className="glass-panel p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-zinc-500" />
              <h2 className="font-bold text-zinc-800 tracking-tight">Recent Activity</h2>
            </div>
            <Link to="/activities" className="text-sm font-bold text-action hover:text-action-light transition-colors">View Full Log &rarr;</Link>
          </div>
          
          <div className="space-y-3">
             {recentEvents.length === 0 ? <p className="text-sm text-zinc-500 font-medium">No activity yet today.</p> : null}
             {recentEvents.map(ev => {
               // generic renderer
               let title = '';
               let desc = '';
               if ('systolic' in ev) { title = 'Vitals Checked'; desc = `${ev.systolic}/${ev.diastolic} pulse ${ev.pulse}`; }
               else if ('food' in ev) { title = `${ev.type} Logged`; desc = ev.food; }
               else if ('medicationName' in ev) { title = 'Medication Given'; desc = ev.medicationName; }
               else if ('task' in ev) { title = 'Checklist Task Done'; desc = ev.task; }
               else if ('type' in ev) { title = ev.type === 'bm' ? 'Bowel Movement' : ev.type === 'diaper' ? 'Diaper Changed' : 'Manual Note'; desc = ev.notes; }
               
               return (
                 <div key={ev.id} className="flex gap-4 text-sm items-start hover:bg-white/40 p-2.5 -mx-2 rounded-xl transition-colors">
                    <div className="text-[11px] font-bold tracking-wide text-zinc-400 w-16 pt-0.5 shrink-0 uppercase">
                      {new Date(ev.timestamp!).toLocaleTimeString([], {timeStyle: 'short'})}
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-800 block tracking-tight">{title}</span>
                      <span className="text-zinc-500 text-xs line-clamp-1 mt-0.5 font-medium">{desc}</span>
                    </div>
                 </div>
               )
             })}
          </div>
        </div>

      </div>

      {showMealModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-bold text-zinc-900 tracking-tight text-lg">Log Meal & Drinks</h3>
              <button onClick={() => setShowMealModal(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={submitMeal} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold tracking-wide text-zinc-700 mb-1.5 uppercase text-[11px]">Meal Type</label>
                <select 
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-action/50 focus:border-action outline-none transition-all font-semibold text-zinc-800"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold tracking-wide text-zinc-700 mb-1.5 uppercase text-[11px]">Food Details</label>
                <textarea 
                  value={mealFood}
                  onChange={(e) => setMealFood(e.target.value)}
                  placeholder="E.g., Chicken soup, crackers, apple slices..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-action/50 focus:border-action outline-none transition-all font-medium text-zinc-800 min-h-[80px] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold tracking-wide text-zinc-700 mb-1.5 uppercase text-[11px]">Drinks</label>
                <input 
                  type="text"
                  value={mealDrinks}
                  onChange={(e) => setMealDrinks(e.target.value)}
                  placeholder="E.g., 8oz Water, 1 cup orange juice"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-action/50 focus:border-action outline-none transition-all font-medium text-zinc-800"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowMealModal(false)}
                  className="flex-1 bg-white border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-action text-white px-4 py-2.5 rounded-xl font-bold hover:bg-action-dark hover:shadow-lg hover:shadow-action/30 transition-all active:scale-95"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LogEventButton({ type, label, icon: Icon }: { type: 'bm'|'diaper', label: string, icon: any }) {
  const { activeResident, selectedDate } = useData();
  const { profile } = useAuth();
  
  const handleAdd = async () => {
    if (!activeResident || !profile) return;
    const notes = window.prompt(`Add notes for ${label} (optional):`);
    if (notes === null) return;
    
    const obj: Omit<EventLog, 'id'> = {
      type,
      notes,
      timestamp: Date.now(),
      authorId: profile.id || ''
    };
    try {
      await addObjectToSubcollection(activeResident.id!, getDateString(selectedDate), 'events', obj);
    } catch (e) {
      console.error(e);
      alert('Failed to add event');
    }
  }

  return (
    <button 
      onClick={handleAdd}
      className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
