import type { Dispatch, SetStateAction } from 'react';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  project?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Stored as ISO string
};

export type Plan = {
  id: 'free' | 'plus' | 'pro';
  name: string;
  price: string;
  priceFrequency: string;
  features: string[];
  isCurrent?: boolean;
  cta: string;
  accent?: boolean;
};

export type Event = {
  id: string;
  title: string;
  date: Date | string; // Allow string for Firestore compatibility
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  guests?: { email: string }[];
};

export type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export type Habit = {
  id: string;
  name: string;
  days: DayOfWeek[];
};

export type CompletedHabit = {
  date: string; // YYYY-MM-DD
  habitId: string;
};

export type MoodLog = {
  date: string; // YYYY-MM-DD
  mood: string;
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // Stored as ISO string
};

export type Locale = 'pt-BR' | 'en-US';

export interface AppContextType {
  profile: UserProfile | null;
  setProfile: Dispatch<SetStateAction<UserProfile | null>>;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  moodLogs: MoodLog[];
  setMoodLogs: Dispatch<SetStateAction<MoodLog[]>>;
  habits: Habit[];
  setHabits: Dispatch<SetStateAction<Habit[]>>;
  completedHabits: CompletedHabit[];
  setCompletedHabits: Dispatch<SetStateAction<CompletedHabit[]>>;
  handleHabitToggle: (habitId: string) => void;
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
  loading: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export type ColorPalette = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  darkBackground: string;
};

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  palette: ColorPalette;
  setPalette: (paletteName: string) => void;
  palettes: ColorPalette[];
  isPlusUser: boolean;
  setCustomColor: (colorName: 'primary' | 'secondary' | 'accent', value: string) => void;
  resetPalette: () => void;
};
