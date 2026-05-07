import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, CheckSquare, Activity, FileText, History, Settings, Users, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { profile, logout } = useAuth();
  const { residents, activeResident, setActiveResident } = useData();

  const navItems = [
    { name: 'Daily Summary', path: '/', icon: ClipboardList },
    { name: 'Checklist', path: '/checklist', icon: CheckSquare },
    { name: 'Activity Log', path: '/activities', icon: Activity },
    { name: 'Report', path: '/report', icon: FileText },
    { name: 'History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ name: 'Access', path: '/access', icon: Users });
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className="p-6">
        <h1 className="text-primary-dark font-bold text-xl tracking-tight">Caregiver Log</h1>
      </div>

      <div className="px-4 mb-6">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Resident</p>
        <div className="space-y-1">
          {residents.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveResident(r)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeResident?.id === r.id 
                  ? "bg-action text-white shadow-md shadow-action/20" 
                  : "text-zinc-600 hover:bg-white/50 hover:text-primary-dark"
              )}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 mt-4">Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary-dark" 
                : "text-zinc-600 hover:bg-white/50 hover:text-primary-dark"
            )}
          >
            <item.icon className={cn("w-4 h-4", window.location.pathname === item.path ? "text-primary" : "text-zinc-400")} />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-zinc-500 hover:text-rose-600 hover:bg-rose-50/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
