import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format, addDays, subDays, isToday } from 'date-fns';

export default function Header() {
  const { selectedDate, setSelectedDate } = useData();

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  return (
    <header className="h-16 bg-transparent border-b border-white/40 flex items-center justify-between px-6 shrink-0 relative z-10 transition-all">
      <div className="flex items-center gap-4">
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={handlePrevDay}
          className="p-2 hover:bg-white/50 rounded-full transition-colors text-zinc-600 hover:text-primary"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-lg shadow-sm border border-white/50">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-zinc-800 w-32 text-center tracking-tight">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
          </span>
        </div>

        <button 
          onClick={handleNextDay}
          className="p-2 hover:bg-white/50 rounded-full transition-colors text-zinc-600 hover:text-primary"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {!isToday(selectedDate) && (
          <button 
            onClick={handleToday}
            className="text-xs font-semibold text-action hover:text-action-dark px-2 py-1 ml-2 transition-colors"
          >
            Back to Today
          </button>
        )}
      </div>
    </header>
  );
}
