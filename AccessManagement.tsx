import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../lib/api';
import { Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AccessManagement() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));
    return () => unsub();
  }, [profile]);

  const handleApprove = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'standard',
        updatedAt: Date.now()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'pending',
        updatedAt: Date.now()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'admin',
        updatedAt: Date.now()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  };

  if (profile?.role !== 'admin') return <div>Access Denied</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary-dark mb-8">Access Management</h1>
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/40 border-b border-black/5">
            <tr>
              <th className="px-6 py-4 font-bold text-zinc-600 tracking-wider uppercase text-xs">Email</th>
              <th className="px-6 py-4 font-bold text-zinc-600 tracking-wider uppercase text-xs">Role</th>
              <th className="px-6 py-4 font-bold text-zinc-600 tracking-wider uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-zinc-800">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border shadow-sm ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    u.role === 'standard' ? 'bg-action/10 text-action-dark border-action/20' :
                    'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  {u.role === 'pending' && (
                    <button onClick={() => handleApprove(u.id!)} className="text-action hover:text-action-light font-bold text-xs uppercase tracking-wider transition-colors">Approve</button>
                  )}
                  {u.role === 'standard' && (
                    <>
                      <button onClick={() => handleRevoke(u.id!)} className="text-amber-600 hover:text-amber-500 font-bold text-xs uppercase tracking-wider transition-colors">Revoke</button>
                      <button onClick={() => handleMakeAdmin(u.id!)} className="text-purple-600 hover:text-purple-500 font-bold text-xs uppercase tracking-wider ml-3 transition-colors">Make Admin</button>
                    </>
                  )}
                  {u.role === 'admin' && profile.id !== u.id && (
                    <button onClick={() => handleRevoke(u.id!)} className="text-amber-600 hover:text-amber-500 font-bold text-xs uppercase tracking-wider transition-colors">Revoke Admin</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
