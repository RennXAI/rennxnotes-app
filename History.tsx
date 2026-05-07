import React from 'react';
import { useData } from '../contexts/DataContext';
import { format, subDays, startOfToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

export default function History() {
  const { setSelectedDate } = useData();
  const navigate = useNavigate();

  const today = startOfToday();
  const pastDays = Array.from({ length: 30 }).map((_, i) => subDays(today, i));

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary-dark">History</h1>
        <p className="text-zinc-600 mt-1 font-medium">Browse activity logs from the past 30 days.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="divide-y divide-black/5">
          {pastDays.map(date => {
            const isToday = date.getTime() === today.getTime();
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleSelectDate(date)}
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/40 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/50 border border-white/40 flex items-center justify-center text-zinc-500 group-hover:bg-action/10 group-hover:text-action-dark group-hover:border-action/20 transition-all shadow-sm">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-800 tracking-tight">
                      {isToday ? 'Today' : format(date, 'EEEE, MMMM do, yyyy')}
                    </h3>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-action transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
