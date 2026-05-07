import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DailySummary from './pages/DailySummary';
import Activities from './pages/Activities';
import Checklist from './pages/Checklist';
import Report from './pages/Report';
import History from './pages/History';
import Settings from './pages/Settings';
import AccessManagement from './pages/AccessManagement';

export default function App() {
  const { user, profile, loading, login } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-900 font-sans relative overflow-hidden bg-[#f4f8fc]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[80vw] h-[80vw] bg-action/10 blur-[120px] rounded-full top-[-20vw] left-[-20vw] animate-mesh-1"></div>
          <div className="absolute w-[60vw] h-[60vw] bg-primary/10 blur-[150px] rounded-full bottom-[-10vw] right-[-10vw] animate-mesh-2"></div>
        </div>
        
        <div className="glass shadow-2xl rounded-3xl p-12 flex flex-col items-center justify-center z-10 max-w-md w-full mx-4 relative border-white/60">
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 pointer-events-none rounded-3xl"></div>
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 shadow-inner relative z-10">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-primary-dark mb-4 text-center relative z-10">RX-Notes</h1>
          <p className="text-zinc-600 mb-10 text-center font-medium relative z-10 tracking-wide">Secure comprehensive caregiver tracking and daily reporting.</p>
          
          <button 
            onClick={login}
            className="w-full relative z-10 flex items-center justify-center gap-3 bg-white text-zinc-800 px-6 py-4 rounded-xl font-bold hover:bg-zinc-50 hover:text-primary transition-all shadow-md border border-zinc-200 hover:shadow-xl active:scale-95 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (profile?.role === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-900 font-sans relative overflow-hidden bg-[#f4f8fc]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[80vw] h-[80vw] bg-action/10 blur-[120px] rounded-full top-[-20vw] left-[-20vw] animate-mesh-1"></div>
          <div className="absolute w-[60vw] h-[60vw] bg-primary/10 blur-[150px] rounded-full bottom-[-10vw] right-[-10vw] animate-mesh-2"></div>
        </div>
        
        <div className="glass shadow-2xl rounded-3xl p-12 flex flex-col items-center justify-center z-10 max-w-md w-full mx-4 text-center border-white/60">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 border border-amber-200/50 shadow-inner">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight text-zinc-800">Access Pending</h2>
          <p className="text-zinc-600 mb-6 font-medium">Your account is waiting for administrator approval. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden text-zinc-900 relative">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#f4f8fc]">
        <div className="absolute w-[60vw] h-[60vw] bg-action/10 blur-[100px] rounded-full top-[-10vw] left-[-10vw] animate-mesh-1"></div>
        <div className="absolute w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full bottom-[-10vw] right-[-10vw] animate-mesh-2"></div>
        <div className="absolute w-[40vw] h-[40vw] bg-action-light/10 blur-[100px] rounded-full top-[20vw] right-[20vw] animate-mesh-3"></div>
      </div>
      
      <div className="flex w-full h-full p-4 lg:p-6 gap-6 relative z-10">
        <div className="h-full glass rounded-2xl flex flex-col overflow-hidden w-64 shrink-0 transition-all z-20">
          <Sidebar />
        </div>
        <div className="flex-1 h-full glass rounded-2xl flex flex-col overflow-hidden relative z-10 shadow-2xl">
          <Header />
          <main className="flex-1 overflow-y-auto p-8 relative">
            <Routes>
              <Route path="/" element={<DailySummary />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/report" element={<Report />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/access" element={<AccessManagement />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
