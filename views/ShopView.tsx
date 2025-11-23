import React from 'react';
import { ActiveItems } from '../types';

interface ShopViewProps {
  coins: number;
  activeItems: ActiveItems;
  onBuy: (item: 'freeze' | 'double', cost: number) => void;
}

const ShopView: React.FC<ShopViewProps> = ({ coins, activeItems, onBuy }) => {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
       <div className="flex justify-between items-end mb-5">
        <h1 className="m-0 text-3xl font-light">Market</h1>
        <div className="text-xs uppercase tracking-[1.5px] text-white/70 font-semibold mb-1">Buffs</div>
      </div>

      <div className="mb-5 flex gap-2 flex-wrap">
        {activeItems.freeze && (
          <div className="bg-white/10 px-2.5 py-1 rounded-full text-xs inline-block">❄️ Korumada</div>
        )}
        {activeItems.doubleXP > 0 && (
          <div className="bg-blue-500/20 text-neon-blue px-2.5 py-1 rounded-full text-xs inline-block">⚡ 2x Aktif ({activeItems.doubleXP})</div>
        )}
      </div>

      <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-5 mb-4 flex justify-between items-center shadow-lg">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl text-neon-blue">❄️</div>
          <div>
            <div className="font-bold text-lg">Streak Freeze</div>
            <div className="text-sm text-white/70">Seri Koruma</div>
          </div>
        </div>
        <button 
          onClick={() => onBuy('freeze', 200)}
          disabled={activeItems.freeze || coins < 200}
          className={`px-6 py-2.5 rounded-full font-bold border transition ${activeItems.freeze ? 'opacity-50 cursor-not-allowed bg-transparent text-white border-transparent' : 'bg-amber-500/10 text-neon-orange border-amber-500/30 hover:bg-amber-500/20'}`}
        >
          {activeItems.freeze ? 'Aktif' : '200'}
        </button>
      </div>

      <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[18px] p-5 mb-4 flex justify-between items-center shadow-lg">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl text-neon-purple">⚡</div>
          <div>
            <div className="font-bold text-lg">Double XP</div>
            <div className="text-sm text-white/70">20x Soru Bonusu</div>
          </div>
        </div>
        <button 
          onClick={() => onBuy('double', 350)}
          disabled={coins < 350}
          className={`px-6 py-2.5 rounded-full font-bold border transition ${coins < 350 ? 'opacity-50 cursor-not-allowed' : 'bg-amber-500/10 text-neon-orange border-amber-500/30 hover:bg-amber-500/20'}`}
        >
          350
        </button>
      </div>

    </div>
  );
};

export default ShopView;