import React, { useState, useEffect } from 'react';
import { Word } from '../types';

interface QuizViewProps {
  words: Word[];
  onFinishQuiz: (score: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ words, onFinishQuiz }) => {
  const [currentQ, setCurrentQ] = useState(1);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [target, setTarget] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const TOTAL_Q = 20;

  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateQuestion = () => {
    const t = words[Math.floor(Math.random() * words.length)];
    const others = words.filter(w => w.en !== t.en).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.tr);
    const opts = [...others, t.tr].sort(() => 0.5 - Math.random());
    setTarget(t);
    setOptions(opts);
    setSelected(null);
  };

  const handleAnswer = (ans: string) => {
    if (selected || !target) return;
    setSelected(ans);
    const isCorrect = ans === target.tr;
    
    if (isCorrect) {
      setScore(s => s + 1);
      // Trigger confetti externally if we wanted, but logic is handled by result
    } else {
      if (navigator.vibrate) navigator.vibrate(200);
    }

    setTimeout(() => {
      if (currentQ < TOTAL_Q) {
        setCurrentQ(c => c + 1);
        generateQuestion();
      } else {
        setFinished(true);
        // Defer parent update slightly to show result screen first if needed, 
        // but here we just show result view locally.
      }
    }, 1200);
  };

  if (finished) {
    return (
      <div className="animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-10 text-center shadow-2xl">
          <h2 className="text-3xl font-bold m-0">Tamamlandı</h2>
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="text-xs text-white/70">Doğru</div>
              <div className="text-3xl font-bold text-neon-green">{score}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
               <div className="text-xs text-white/70">Toplam Soru</div>
               <div className="text-3xl font-bold text-neon-blue">{TOTAL_Q}</div>
            </div>
          </div>
          <button 
            onClick={() => onFinishQuiz(score)}
            className="w-full py-4 bg-neon-blue text-white rounded-2xl font-bold active:scale-95 transition-transform"
          >
            Ödülü Al & Bitir
          </button>
        </div>
      </div>
    );
  }

  if (!target) return null;

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-end mb-5">
        <h1 className="m-0 text-3xl font-light">Quiz</h1>
        <span className="bg-blue-500/15 text-neon-blue px-3 py-1.5 rounded-full font-mono border border-blue-500/20 text-sm">
          {currentQ} / {TOTAL_Q}
        </span>
      </div>
      
      <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-10 text-center shadow-2xl">
         <div className="text-white/70 mb-4 text-lg">Bu kelimenin anlamı?</div>
         <h1 className="text-white m-0 mb-8 text-4xl font-extrabold drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
           {target.en}
         </h1>
         <div className="flex flex-col gap-3">
           {options.map((opt, i) => {
             let btnClass = "w-full p-5 bg-slate-800/60 border border-white/10 rounded-[18px] text-white text-left font-medium transition-all active:bg-white/10";
             
             if (selected) {
               if (opt === target.tr) btnClass = "w-full p-5 bg-emerald-500/40 border border-neon-green rounded-[18px] text-white text-left font-medium";
               else if (opt === selected) btnClass = "w-full p-5 bg-red-500/40 border border-neon-red rounded-[18px] text-white text-left font-medium";
               else btnClass = "w-full p-5 bg-slate-800/60 border border-white/10 rounded-[18px] text-white/50 text-left font-medium";
             }

             return (
               <button 
                key={i} 
                className={btnClass}
                onClick={() => handleAnswer(opt)}
                disabled={selected !== null}
               >
                 {opt}
               </button>
             );
           })}
         </div>
      </div>
    </div>
  );
};

export default QuizView;