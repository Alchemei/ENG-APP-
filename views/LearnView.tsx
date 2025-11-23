import React, { useState, useEffect } from 'react';
import { Word, AppState } from '../types';

interface LearnViewProps {
  words: Word[];
  appState: AppState;
  onVote: (known: boolean) => void;
  onToggleFav: () => void;
  currentWord: Word;
}

const LearnView: React.FC<LearnViewProps> = ({ words, appState, onVote, onToggleFav, currentWord }) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [currentWord]);

  const playTTS = (e: React.MouseEvent) => {
    e.stopPropagation();
    const t = new SpeechSynthesisUtterance(currentWord.en);
    t.lang = 'en-US';
    speechSynthesis.speak(t);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFav();
  };

  const isFav = appState.favs.includes(currentWord.en);

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-end mb-5">
        <div>
          <div className="text-xs uppercase tracking-[1.5px] text-white/70 font-semibold mb-1">Daily Session</div>
          <h1 className="m-0 text-3xl font-light">Learn</h1>
        </div>
        <div className="font-mono text-neon-blue font-bold text-lg">
          {appState.learned.length} / {words.length}
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="perspective-[1200px] h-[380px] w-full cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className={`absolute w-full h-full backface-hidden rounded-[28px] bg-[linear-gradient(145deg,#1e293b,#0f172a)] border border-white/10 flex flex-col justify-center items-center p-8 text-center shadow-xl overflow-hidden ${flipped ? 'z-0' : 'z-10'}`}>
            <div className="text-5xl font-extrabold mb-4 text-white drop-shadow-md">{currentWord.en}</div>
            <div className="text-lg text-slate-300 italic mb-8 max-w-[90%] leading-relaxed">{currentWord.ctx}</div>
            
            <div className="flex gap-5 z-20 mt-5">
              <button onClick={playTTS} className="w-12 h-12 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 10.93a10 10 0 0 1 0 2.14"></path></svg>
              </button>
              <button onClick={handleFav} className={`w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition ${isFav ? 'text-neon-red' : 'text-white'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>
            <div className="mt-auto text-xs tracking-widest font-bold uppercase opacity-60">Tap to reveal</div>
          </div>

          {/* Back */}
          <div className={`absolute w-full h-full backface-hidden rounded-[28px] bg-[linear-gradient(145deg,#4c1d95,#0f172a)] border border-neon-purple flex flex-col justify-center items-center p-8 text-center shadow-xl rotate-y-180 ${flipped ? 'z-10' : 'z-0'}`}>
             <div className="text-4xl font-bold text-white drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]">{currentWord.tr}</div>
          </div>

        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => onVote(false)}
          className="flex-1 py-4 rounded-[20px] text-lg uppercase tracking-wider font-extrabold shadow-lg bg-red-300 text-red-900 active:scale-95 transition-transform"
        >
          Tekrar
        </button>
        <button 
          onClick={() => onVote(true)}
          className="flex-1 py-4 rounded-[20px] text-lg uppercase tracking-wider font-extrabold shadow-lg bg-emerald-300 text-emerald-900 active:scale-95 transition-transform"
        >
          Biliyorum
        </button>
      </div>
    </div>
  );
};

export default LearnView;