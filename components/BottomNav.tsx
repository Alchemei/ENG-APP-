import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  onSwitch: (t: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSwitch }) => {
  const NavItem = ({ tab, icon }: { tab: Tab; icon: React.ReactNode }) => (
    <button 
      onClick={() => onSwitch(tab)}
      className={`relative p-0 bg-transparent border-none cursor-pointer flex items-center justify-center transition-colors duration-300 ${currentTab === tab ? 'text-neon-blue' : 'text-white/40'}`}
    >
      {icon}
      {currentTab === tab && (
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-neon-blue rounded-full shadow-[0_0_10px] shadow-neon-blue" />
      )}
    </button>
  );

  return (
    <div className="fixed bottom-8 left-0 w-full flex justify-center pointer-events-none z-50">
      <nav className="pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-white/15 px-6 h-[65px] rounded-full flex gap-6 items-center shadow-[0_15px_50px_rgba(0,0,0,0.7)]">
        
        {/* Learn */}
        <NavItem tab="learn" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>
        } />
        
        {/* Quests */}
        <NavItem tab="quests" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
        } />

        {/* Quiz */}
        <NavItem tab="quiz" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="12" y2="12"></line><line x1="8" x2="8" y1="10" y2="14"></line><line x1="15" x2="15.01" y1="13" y2="13"></line><line x1="18" x2="18.01" y1="11" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>
        } />

        {/* Shop */}
        <NavItem tab="shop" icon={
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        } />

        {/* Profile */}
        <NavItem tab="profile" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        } />
      </nav>
    </div>
  );
};

export default BottomNav;