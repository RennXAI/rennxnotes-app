import { useState, useEffect } from 'react';
import { subscribeSubcollection, VitalReading, MealLog, MedicationLog, ChecklistLog, EventLog, Medication, ChecklistItem } from '../lib/models';
import { getDateString } from '../lib/api';
import { useData } from '../contexts/DataContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export function useDailyData() {
  const { activeResident, selectedDate } = useData();
  
  const [vitals, setVitals] = useState<VitalReading[]>([]);
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [medLogs, setMedLogs] = useState<MedicationLog[]>([]);
  const [checklistLogs, setChecklistLogs] = useState<ChecklistLog[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);

  useEffect(() => {
    if (!activeResident) return;
    const ds = getDateString(selectedDate);
    const id = activeResident.id!;

    const unsub1 = subscribeSubcollection<VitalReading>(id, ds, 'vitals', setVitals);
    const unsub2 = subscribeSubcollection<MealLog>(id, ds, 'meals', setMeals);
    const unsub3 = subscribeSubcollection<MedicationLog>(id, ds, 'medications', setMedLogs);
    const unsub4 = subscribeSubcollection<ChecklistLog>(id, ds, 'checklistLogs', setChecklistLogs);
    const unsub5 = subscribeSubcollection<EventLog>(id, ds, 'events', setEvents);

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); };
  }, [activeResident, selectedDate]);

  return { vitals, meals, medLogs, checklistLogs, events };
}

export function useResidentConfig() {
  const { activeResident } = useData();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (!activeResident) return;
    const id = activeResident.id!;
    
    const unsubs = [
      onSnapshot(query(collection(db, `residents/${id}/medications`), orderBy('createdAt', 'asc')), (snap) => {
        setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Medication)));
      }, err => handleFirestoreError(err, OperationType.LIST, `residents/${id}/medications`)),
      onSnapshot(query(collection(db, `residents/${id}/checklists`), orderBy('createdAt', 'asc')), (snap) => {
        setChecklists(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChecklistItem)));
      }, err => handleFirestoreError(err, OperationType.LIST, `residents/${id}/checklists`))
    ];
    return () => unsubs.forEach(u => u());
  }, [activeResident]);

  return { medications, checklists };
}
