import React, { createContext, useContext, useEffect, useState } from 'react';
import { Resident, subscribeToResidents } from '../lib/api';
import { useAuth } from './AuthContext';
import { startOfToday, format } from 'date-fns';

interface DataState {
  residents: Resident[];
  activeResident: Resident | null;
  setActiveResident: (r: Resident | null) => void;
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
}

const DataContext = createContext<DataState>({
  residents: [],
  activeResident: null,
  setActiveResident: () => {},
  selectedDate: startOfToday(),
  setSelectedDate: () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [activeResident, setActiveResident] = useState<Resident | null>(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  useEffect(() => {
    if (!user || !profile || profile.role === 'pending') {
       setResidents([]);
       return;
    }
    
    const unsub = subscribeToResidents((res) => {
      setResidents(res);
      if (res.length > 0 && !activeResident) {
        setActiveResident(res[0]);
      }
    }, (err) => {
      console.error(err);
    });

    return () => unsub();
  }, [user, profile, activeResident]);

  return (
    <DataContext.Provider value={{ residents, activeResident, setActiveResident, selectedDate, setSelectedDate }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
