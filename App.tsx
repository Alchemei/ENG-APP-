import React, { useState, useEffect, useCallback } from 'react';
import { RAW_WORD_DATA, INITIAL_STATE, TASK_TEMPLATES } from './constants';
import { Word, AppState, Tab, TaskType, UserProfile, Task } from './types';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import TopHud from './components/TopHud';
import Toast from './components/Toast';
import Confetti from './components/ui/Confetti';
import LearnView from './views/LearnView';
import QuestsView from './views/QuestsView';
import QuizView from './views/QuizView';
import ShopView from './views/ShopView';
import ProfileView from './views/ProfileView';
import * as firebaseService from './services/firebaseService';

export type SyncStatus = 'active' | 'done' | 'error' | 'idle';

const App: React.FC = () => {
  // --- STATE ---
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);
  const [words, setWords] = useState<Word[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>('learn');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [toastMsg, setToastMsg] = useState('');
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // --- HELPERS ---
  const showToast = (msg: string) => setToastMsg(msg);
  const triggerConfetti = () => setConfettiTrigger(c => c + 1);

  const getLocalKey = (dateObj: Date) => {
    const offset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - offset).toISOString().split('T')[0];
  };

  const updateHistory = (amount: number, currentState: AppState) => {
    const key = getLocalKey(new Date());
    const newHistory = { ...currentState.history };
    newHistory[key] = (newHistory[key] || 0) + amount;
    return newHistory;
  };

  // Pure helper to update task list
  const updateTasksList = (tasks: Task[], type: TaskType, amt: number) => {
    let updated = false;
    const currentTasks = tasks || []; // Safety fallback
    const newTasks = currentTasks.map(t => {
      if (t.type === type && !t.claimed && t.progress < t.target) {
        const newProgress = Math.min(t.progress + amt, t.target);
        if (newProgress === t.target && t.progress !== t.target) {
          showToast(`Görev: ${t.text}`);
        }
        updated = true;
        return { ...t, progress: newProgress };
      }
      return t;
    });
    return updated ? newTasks : currentTasks;
  };

  // --- PERSISTENCE ---
  const saveLocal = (state: AppState) => {
    localStorage.setItem('engApp_v60', JSON.stringify(state));
  };

  const saveCloud = async (state: AppState) => {
    if (!user || user.isAnonymous) return;
    setSyncStatus('active');
    const success = await firebaseService.saveCloudData(user.uid, state);
    setSyncStatus(success ? 'done' : 'error');
  };

  const updateState = (updater: (prev: AppState) => AppState) => {
    setAppState(prev => {
      const next = updater(prev);
      saveLocal(next);
      return next;
    });
  };

  // Debounced cloud save
  useEffect(() => {
    const t = setTimeout(() => saveCloud(appState), 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Parse Words
    const parsedWords = RAW_WORD_DATA.split(';').map(s => {
      const parts = s.split('|');
      return { en: parts[0], tr: parts[1], ctx: parts[2] };
    });
    setWords(parsedWords);

    // Load Local
    const saved = localStorage.getItem('engApp_v60');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppState(prev => {
           // Ensure tasks exist in migrated state
           let tasks = parsed.tasks;
           if(!tasks || !Array.isArray(tasks) || tasks.length === 0) {
             tasks = TASK_TEMPLATES.map(t => ({...t}));
           }
           return { ...prev, ...parsed, tasks };
        });
      } catch (e) { console.error(e); }
    } else {
      // Ensure initial tasks are set
      setAppState(prev => ({
        ...prev,
        tasks: TASK_TEMPLATES.map(t => ({...t}))
      }));
    }

    // Init Auth
    firebaseService.initAuthListener(async (u) => {
      if (u) {
        setUser({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          isAnonymous: u.isAnonymous
        });
        
        if (!u.isAnonymous) {
          setSyncStatus('active');
          const cloudData = await firebaseService.loadCloudData(u.uid);
          if (cloudData) {
            // Merge strategy: Cloud usually wins on login, but we respect higher XP if local played offline
            setAppState(prev => {
              const newState = (cloudData.xp > prev.xp) ? cloudData : prev;
              // Re-verify tasks
              if (!newState.tasks || newState.tasks.length === 0) {
                 newState.tasks = TASK_TEMPLATES.map(t => ({...t}));
              }
              return newState;
            });
            setSyncStatus('done');
          } else {
            // New cloud user, sync local to cloud
            saveCloud(appState);
          }
        }
      } else {
         setUser(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Daily Check (Streak & Tasks)
  useEffect(() => {
    const today = new Date().toDateString();
    if (appState.lastLogin !== today) {
      updateState(prev => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let newStreak = prev.streak;
        let freezeUsed = false;
        
        if (prev.lastLogin === yesterday.toDateString()) {
          newStreak++;
        } else {
          if (prev.activeItems.freeze) {
             freezeUsed = true;
             showToast("❄️ Seri Korundu!");
          } else {
             newStreak = 1;
          }
        }

        return {
          ...prev,
          lastLogin: today,
          streak: newStreak,
          tasks: TASK_TEMPLATES.map(t => ({ ...t })), // Reset daily quests
          activeItems: {
            ...prev.activeItems,
            freeze: freezeUsed ? false : prev.activeItems.freeze
          }
        };
      });
    }
  }, [appState.lastLogin]);

  // --- HANDLERS ---
  
  const handleVote = useCallback((known: boolean) => {
    let gainedXP = 10;
    
    updateState(prev => {
      let nextState = { ...prev };
      
      if (known) {
        if (prev.activeItems.doubleXP > 0) {
          gainedXP *= 2;
          nextState.activeItems = { ...prev.activeItems, doubleXP: prev.activeItems.doubleXP - 1 };
        }

        nextState.xp += gainedXP;
        nextState.coins += 5;
        nextState.history = updateHistory(gainedXP, prev);
        
        // Add to learned if new
        const w = words[prev.wordIndex];
        if (w && !prev.learned.includes(w.en)) {
          nextState.learned = [...prev.learned, w.en];
          nextState.tasks = updateTasksList(nextState.tasks, 'learn', 1);
        }

        nextState.tasks = updateTasksList(nextState.tasks, 'xp', gainedXP);
        triggerConfetti();
        showToast(`+${gainedXP} XP`);
      }

      // Find next word
      let nextIndex = prev.wordIndex;
      for (let i = 0; i < words.length; i++) {
        let idx = (prev.wordIndex + 1 + i) % words.length;
        if (!nextState.learned.includes(words[idx].en)) {
          nextIndex = idx;
          break;
        }
      }
      // If all learned, random
      if (nextIndex === prev.wordIndex) nextIndex = Math.floor(Math.random() * words.length);

      nextState.wordIndex = nextIndex;
      return nextState;
    });
  }, [words]);

  const handleToggleFav = useCallback(() => {
    updateState(prev => {
      const w = words[prev.wordIndex].en;
      const isFav = prev.favs.includes(w);
      const newFavs = isFav ? prev.favs.filter(f => f !== w) : [...prev.favs, w];
      if (!isFav) showToast("Favorilere eklendi");
      return { ...prev, favs: newFavs };
    });
  }, [words]);

  const handleBuy = useCallback((item: 'freeze' | 'double', cost: number) => {
    updateState(prev => {
      if (prev.coins < cost) {
        showToast("Yetersiz Bakiye");
        return prev;
      }
      
      const nextState = { ...prev, coins: prev.coins - cost };
      
      if (item === 'freeze') {
        if (prev.activeItems.freeze) {
          showToast("Zaten Aktif!");
          return prev;
        }
        nextState.activeItems.freeze = true;
      } else if (item === 'double') {
        nextState.activeItems.doubleXP += 20;
      }
      
      nextState.tasks = updateTasksList(nextState.tasks, 'shop', 1);
      triggerConfetti();
      showToast("Satın Alındı! 🎉");
      return nextState;
    });
  }, []);

  const handleFinishQuiz = useCallback((score: number) => {
    updateState(prev => {
      let earnedXP = score * 5;
      const nextState = { ...prev };

      if (prev.activeItems.doubleXP > 0) {
        earnedXP *= 2;
        nextState.activeItems.doubleXP = Math.max(0, prev.activeItems.doubleXP - 20); // Consume chunks
      }

      nextState.xp += earnedXP;
      nextState.history = updateHistory(earnedXP, prev);
      nextState.tasks = updateTasksList(nextState.tasks, 'quiz', 1);
      nextState.tasks = updateTasksList(nextState.tasks, 'xp', earnedXP);
      
      return nextState;
    });
    setCurrentTab('learn'); // Go back to learn after finish
    showToast("Quiz Tamamlandı! +XP");
  }, []);

  const handleClaimTask = useCallback((id: string) => {
    updateState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task || task.claimed || task.progress < task.target) return prev;

      const newTasks = prev.tasks.map(t => t.id === id ? { ...t, claimed: true } : t);
      
      triggerConfetti();
      showToast(`+${task.reward} Altın!`);

      return {
        ...prev,
        coins: prev.coins + task.reward,
        xp: prev.xp + 10,
        tasks: newTasks
      };
    });
  }, []);

  const handleRemoveFav = useCallback((w: string) => {
    updateState(prev => ({
       ...prev,
       favs: prev.favs.filter(f => f !== w)
    }));
  }, []);

  const handleReset = useCallback(() => {
    if (confirm("Tüm verileri sıfırla?")) {
       setAppState(INITIAL_STATE);
       saveLocal(INITIAL_STATE);
       if(user && !user.isAnonymous) {
          firebaseService.saveCloudData(user.uid, INITIAL_STATE);
       }
       location.reload();
    }
  }, [user]);

  // --- RENDER ---
  return (
    <Layout>
      <Confetti trigger={confettiTrigger} />
      <Toast message={toastMsg} onClear={() => setToastMsg('')} />
      
      <TopHud 
        streak={appState.streak} 
        coins={appState.coins} 
        xp={appState.xp} 
        syncStatus={syncStatus}
        onRetrySync={() => saveCloud(appState)}
      />

      <div className="mt-5">
        {currentTab === 'learn' && words.length > 0 && (
          <LearnView 
            words={words} 
            appState={appState} 
            currentWord={words[appState.wordIndex]}
            onVote={handleVote}
            onToggleFav={handleToggleFav}
          />
        )}

        {currentTab === 'quests' && (
          <QuestsView 
            tasks={appState.tasks} 
            onClaim={handleClaimTask} 
          />
        )}

        {currentTab === 'quiz' && (
          <QuizView 
            words={words} 
            onFinishQuiz={handleFinishQuiz} 
          />
        )}

        {currentTab === 'shop' && (
          <ShopView 
            coins={appState.coins} 
            activeItems={appState.activeItems} 
            onBuy={handleBuy} 
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView 
            appState={appState} 
            user={user} 
            totalWords={words.length}
            words={words}
            onLogin={firebaseService.loginGoogle}
            onLogout={firebaseService.logoutGoogle}
            onReset={handleReset}
            onRemoveFav={handleRemoveFav}
          />
        )}
      </div>

      <BottomNav currentTab={currentTab} onSwitch={setCurrentTab} />
    </Layout>
  );
};

export default App;