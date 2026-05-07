import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface UserProfile {
  id?: string;
  email: string;
  role: 'admin' | 'standard' | 'pending';
  createdAt: number;
  updatedAt: number;
}

export interface Resident {
  id?: string;
  name: string;
  createdAt: number;
}

// Subscribe to residents
export function subscribeToResidents(cb: (residents: Resident[]) => void, onError: (err: any) => void) {
  const path = 'residents';
  return onSnapshot(collection(db, path), (snapshot) => {
    cb(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Resident)));
  }, (err) => {
    try { handleFirestoreError(err, OperationType.GET, path); } catch (e) { onError(e); }
  });
}

export function getDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

