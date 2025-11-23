import React from 'react';
import { AppState, UserProfile, Word } from '../types';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

interface ProfileViewProps {
  appState: AppState;
  user: UserProfile | null;
  totalWords: number;
  words: Word[];
  onLogin: () => void;
  onLogout: () => void;
  onReset: () => void;
  onRemoveFav: (w: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ appState, user, totalWords, words, onLogin, onLogout, onReset, onRemoveFav }) => {
  const learnedCount = appState.learned.length;
  const pct = Math.min(100, (learnedCount / totalWords) * 100);
  const lvl = Math.floor(appState.xp / 100) + 1;
  const strokeDash = 339.292;
  const strokeOffset = strokeDash - (pct / 100) * strokeDash;

  let title = "Stajyer";
  if (lvl > 2) title = "Çırak"; 
  if (lvl > 10) title = "Uzman"; 
  if (lvl > 30) title = "Üstat";

  // Prepare chart data
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const offset = d.getTimezoneOffset() * 60000;
    const key = new Date(d.getTime() - offset).toISOString().split('T')[0];
    return {
      name: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
      xp: appState.history[key] || 0,
      isToday: i === 6
    };
  });

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mt-5 mb-8">
        <div className="relative w-[120px] h-[120px] mx-auto mb-5">
           <svg className="w-full h-full -rotate-90">
             <circle className="text-white/5 stroke-current" strokeWidth="8" fill="transparent" r="54" cx="60" cy="60" />
             <circle 
                className="text-neon-green stroke-current transition-all duration-1000 ease-out drop-shadow-[0_0_4px_rgba(52,211,153,1)]" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                fill="transparent" r="54" cx="60" cy="60" 
             />
           </svg>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
             <div className="text-2xl font-extrabold text-neon-green">{Math.floor(pct)}%</div>
             <div className="text-[10px] text-white/70 tracking-widest">MASTERY</div>
           </div>
        </div>

        <h2 className="text-2xl m-0">Profilim</h2>
        <div className="text-neon-blue font-mono mt-1.5 text-lg">Lvl {lvl} • {user?.displayName || title}</div>
        {user?.email && <div className="text-xs text-white/70 mt-1">{user.email}</div>}
      </div>

      <div className="mb-8">
        {!user || user.isAnonymous ? (
           <button onClick={onLogin} className="w-full p-4 bg-white text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2.5 active:scale-98 transition">
             <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/><path fill="#EA4335" d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             Google ile Giriş Yap
           </button>
        ) : (
          <button onClick={onLogout} className="w-full p-4 bg-red-500/10 text-neon-red border border-red-500/30 rounded-2xl font-bold active:scale-98 transition">
            Çıkış Yap
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-5 text-center shadow-lg">
           <div className="text-3xl font-extrabold text-neon-blue">{appState.xp}</div>
           <div className="text-xs text-white/70">Toplam XP</div>
        </div>
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-5 text-center shadow-lg">
           <div className="text-3xl font-extrabold text-neon-green">{learnedCount}</div>
           <div className="text-xs text-white/70">Öğrenilen (Total)</div>
        </div>
      </div>

      <h3 className="font-light mb-4 text-lg">Haftalık Aktivite</h3>
      <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-4 mb-8 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
             <Bar dataKey="xp" radius={[4, 4, 0, 0]} fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="font-light border-b border-white/10 pb-2.5 mb-4 text-lg">Favoriler</h3>
      <div className="mb-8 min-h-[50px]">
        {appState.favs.length === 0 ? (
          <div className="text-white/70 text-sm text-center">Liste boş.</div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {appState.favs.map(f => {
              const w = words.find(x => x.en === f);
              if (!w) return null;
              return (
                <div key={f} className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold">{w.en}</div>
                    <div className="text-sm text-white/70">{w.tr}</div>
                  </div>
                  <button onClick={() => onRemoveFav(f)} className="text-neon-red bg-transparent p-2">✕</button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={onReset} className="w-full p-4 bg-red-500/15 text-neon-red border border-red-500/30 rounded-2xl font-bold">
        Verileri Sıfırla
      </button>

    </div>
  );
};

export default ProfileView;