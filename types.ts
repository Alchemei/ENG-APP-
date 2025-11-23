export interface Word {
  en: string;
  tr: string;
  ctx: string;
}

export type Tab = 'learn' | 'quests' | 'quiz' | 'shop' | 'profile';

export type TaskType = 'learn' | 'xp' | 'quiz' | 'shop';

export interface Task {
  id: string;
  text: string;
  target: number;
  progress: number;
  reward: number;
  type: TaskType;
  claimed: boolean;
}

export interface ActiveItems {
  freeze: boolean;
  doubleXP: number;
}

export interface AppState {
  xp: number;
  coins: number;
  streak: number;
  learned: string[];
  favs: string[];
  wordIndex: number;
  lastLogin: string;
  tasks: Task[];
  activeItems: ActiveItems;
  history: Record<string, number>;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}