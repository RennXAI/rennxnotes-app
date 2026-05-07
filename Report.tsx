import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getDateString } from '../lib/api';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { FileEdit, RefreshCw, Save, Share } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { format } from 'date-fns';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Report() {
  const { selectedDate, activeResident, residents } = useData();
  const { profile } = useAuth();
  
  const [report, setReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  const dateStr = getDateString(selectedDate);

  // Load existing report
  useEffect(() => {
    if (!activeResident) return;
    async function loadReport() {
      try {
        const d = await getDoc(doc(db, `residents/${activeResident?.id}/dailyLogs/${dateStr}`));
        if (d.exists() && d.data().reportText) {
          setReport(d.data().reportText);
        } else {
          setReport('');
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadReport();
  }, [activeResident, dateStr]);

  const fetchAllDataForDay = async () => {
    let combinedData = '';
    for (const res of residents) {
      combinedData += `\n--- Resident: ${res.name} ---\n`;
      const path = `residents/${res.id}/dailyLogs/${dateStr}`;
      
      const [vitals, meals, meds, events, checklists] = await Promise.all([
        getDocs(collection(db, `${path}/vitals`)),
        getDocs(collection(db, `${path}/meals`)),
        getDocs(collection(db, `${path}/medications`)),
        getDocs(collection(db, `${path}/events`)),
        getDocs(collection(db, `${path}/checklistLogs`)),
      ]);

      const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], {timeStyle: 'short'});

      combinedData += `Vitals: ` + vitals.docs.map(d => {
        const v = d.data();
        return `${formatTime(v.timestamp)} - ${v.period}: ${v.systolic}/${v.diastolic} BP, ${v.pulse} bpm`;
      }).join('; ') + '\n';

      combinedData += `Meals: ` + meals.docs.map(d => {
        const m = d.data();
        return `${formatTime(m.timestamp)} - ${m.type}: Food: ${m.food}, Drinks: ${m.drinks}`;
      }).join('; ') + '\n';

      combinedData += `Medications: ` + meds.docs.map(d => {
        const m = d.data();
        return `${formatTime(m.timestamp)} - ${m.medicationName}`;
      }).join('; ') + '\n';

      combinedData += `Bathroom/Events: ` + events.docs.map(d => {
        const e = d.data();
        return `${formatTime(e.timestamp)} - ${e.type} - Notes: ${e.notes || 'none'}`;
      }).join('; ') + '\n';

      combinedData += `Checklist Completed: ` + checklists.docs.map(d => {
        const c = d.data();
        return `${formatTime(c.timestamp)} - ${c.task}`;
      }).join('; ') + '\n';
    }
    return combinedData;
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const rawData = await fetchAllDataForDay();
      
      const prompt = `
You are a professional caregiver writing a daily summary report for the family.
Date: ${format(selectedDate, 'EEEE, MMMM do, yyyy')}

Here is the raw data captured today:
${rawData}

Please write a warm, professional, and clear daily report summarizing the care for all residents.
Include sections for:
- Overall Summary
- Vitals
- Meals & Nutrition
- Medications
- Bathroom & Hygiene
- Activities & Notes

Keep it concise but detailed enough for the family to know exactly how the day went.
Output as nice Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setReport(response.text || '');
    } catch (err) {
      console.error(err);
      alert('Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveReport = async () => {
    if (!activeResident) return;
    setIsSaving(true);
    try {
      const ref = doc(db, `residents/${activeResident.id}/dailyLogs/${dateStr}`);
      await setDoc(ref, { reportText: report, updatedAt: Date.now() }, { merge: true });
      setLastSaved(Date.now());
    } catch (err) {
       handleFirestoreError(err, OperationType.UPDATE, `dailyLogs`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">Daily Report</h1>
          <p className="text-zinc-600 mt-1 font-medium">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-white/60 border border-white/50 backdrop-blur-md text-primary-dark px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : report ? 'Regenerate' : 'Generate AI Report'}
          </button>
          
          <button 
            onClick={saveReport}
            disabled={isSaving || !report}
            className="flex items-center gap-2 bg-action text-white px-5 py-2.5 rounded-xl font-bold hover:bg-action-dark hover:shadow-lg hover:shadow-action/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Report'}
          </button>
        </div>
      </div>

      <div className="glass-panel flex-1 flex flex-col overflow-hidden min-h-[400px]">
        {report ? (
          <textarea
            className="flex-1 w-full bg-transparent p-8 resize-none outline-none text-zinc-800 font-sans leading-relaxed tracking-wide font-medium"
            value={report}
            onChange={(e) => setReport(e.target.value)}
            placeholder="Report content..."
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-white/20">
            <FileEdit className="w-16 h-16 mb-4 opacity-30 text-primary" />
            <p className="font-bold text-lg text-primary-dark mb-1">No report generated yet</p>
            <p className="text-sm font-medium">Click "Generate AI Report" to create a summary based on today's logs.</p>
          </div>
        )}
      </div>
      
      {lastSaved && (
        <p className="text-right text-xs font-bold text-zinc-500 mt-2 uppercase tracking-widest">
          Last saved at {new Date(lastSaved).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
