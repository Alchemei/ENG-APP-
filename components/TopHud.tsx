import React from 'react';
import { SyncStatus } from '../App';

interface TopHudProps {
  streak: number;
  coins: number;
  xp: number;
  syncStatus: SyncStatus;
  onRetrySync: () => void;
}

const TopHud: React.FC<TopHudProps> = ({ streak, coins, xp, syncStatus, onRetrySync }) => {
  const getSyncIconClass = () => {
    switch(syncStatus) {
      case 'active': return 'text-neon-blue animate-pulse-sync opacity-100';
      case 'done': return 'text-neon-green opacity-100';
      case 'error': return 'text-neon-red border-neon-red opacity-100';
      default: return 'text-white/70 opacity-100';
    }
  };

  return (
    <header className="p-5 z-10 shrink-0 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2.5 items-center">
          {/* Streak Badge */}
          <div className="bg-slate-900/80 border border-white/10 px-3.5 h-[34px] rounded-full text-sm font-bold flex items-center gap-1.5 backdrop-blur-sm shadow-sm text-neon-orange">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
             <span>{streak}</span>
          </div>
          {/* Coins Badge */}
          <div className="bg-slate-900/80 border border-white/10 px-3.5 h-[34px] rounded-full text-sm font-bold flex items-center gap-1.5 backdrop-blur-sm shadow-sm text-neon-green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9l4-6z"></path></svg>
            <span>{coins}</span>
          </div>
        </div>

        {/* Sync Status */}
        <div 
          onClick={onRetrySync}
          className={`w-[34px] h-[34px] rounded-full flex items-center justify-center bg-slate-900/80 border border-white/10 transition-colors cursor-pointer ${getSyncIconClass()}`}
          title="Cloud Sync"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>
        </div>
      </div>

      {/* XP Track */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_15px_#a78bfa] transition-all duration-500 ease-out"
          style={{ width: `${xp % 100}%` }}
        />
      </div>
    </header>
  );
};

export default TopHud;