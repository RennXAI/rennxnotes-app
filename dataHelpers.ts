import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export async function addObjectToSubcollection(residentId: string, dateStr: string, sub: string, data: any) {
  try {
    const path = `residents/${residentId}/dailyLogs/${dateStr}`;
    // Ensure daily log doc exists
    await setDoc(doc(db, path), { updatedAt: Date.now() }, { merge: true });
    // Add subcollection
    await addDoc(collection(db, `${path}/${sub}`), data);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `residents/${residentId}/dailyLogs/${dateStr}/${sub}`);
  }
}
