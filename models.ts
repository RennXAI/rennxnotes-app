import { collection, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface VitalReading {
  id?: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  period: 'morning' | 'afternoon';
  timestamp: number;
  authorId: string;
}

export interface MealLog {
  id?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: string;
  drinks: string;
  timestamp: number;
  authorId: string;
}

export interface Medication {
  id?: string;
  name: string;
  instructions: string;
  period: 'morning' | 'afternoon' | 'evening';
  createdAt: number;
}

export interface MedicationLog {
  id?: string;
  medicationId: string;
  medicationName: string;
  notes: string;
  timestamp: number;
  authorId: string;
}

export interface ChecklistItem {
  id?: string;
  task: string;
  period: 'morning' | 'afternoon' | 'evening';
  createdAt: number;
}

export interface ChecklistLog {
  id?: string;
  checklistId: string;
  task: string;
  notes: string;
  timestamp: number;
  authorId: string;
}

export interface EventLog {
  id?: string;
  type: 'bm' | 'diaper' | 'manual';
  notes: string;
  timestamp: number;
  authorId: string;
}

export interface DailyLog {
  notes?: string;
  reportText?: string;
  updatedAt: number;
}

// Helpers for reading real-time subcollections
export function subscribeSubcollection<T>(residentId: string, dateString: string, sub: string, cb: (data: T[]) => void) {
  const path = `residents/${residentId}/dailyLogs/${dateString}/${sub}`;
  const q = query(collection(db, path), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)));
  }, err => handleFirestoreError(err, OperationType.LIST, path));
}
