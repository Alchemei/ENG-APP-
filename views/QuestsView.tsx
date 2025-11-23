import React from 'react';
import { Task } from '../types';

interface QuestsViewProps {
  tasks: Task[];
  onClaim: (id: string) => void;
}

const QuestsView: React.FC<QuestsViewProps> = ({ tasks, onClaim }) => {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-end mb-5">
        <h1 className="m-0 text-3xl font-light">Quests</h1>
        <div className="text-xs uppercase tracking-[1.5px] text-white/70 font-semibold mb-1">Reset 00:00</div>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.map((t) => {
          const isDone = t.progress >= t.target;
          const pct = Math.min(100, (t.progress / t.target) * 100);
          
          return (
            <div 
              key={t.id} 
              className={`bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-5 border-l-4 shadow-lg flex flex-col gap-3 ${isDone ? 'border-l-neon-green bg-gradient-to-r from-emerald-900/20 to-slate-900/85' : 'border-l-transparent'}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{t.text}</span>
                <span className="bg-amber-500/15 text-neon-orange px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-500/20">+{t.reward}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-green transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                {isDone && !t.claimed ? (
                  <button 
                    onClick={() => onClaim(t.id)}
                    className="bg-neon-green text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-400 active:scale-95 transition"
                  >
                    Al
                  </button>
                ) : t.claimed ? (
                   <span className="text-neon-green text-xs font-bold">Tamamlandı</span>
                ) : (
                  <span className="text-xs text-white/70">{t.progress}/{t.target}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestsView;