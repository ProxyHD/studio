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

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type ScheduleItem = {
  id: string;
  dayOfWeek: DayOfWeek;
  title: string;
  startTime: string;
  endTime: string;
  location: string; // For room number, etc.
};

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

export type NewsItem = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imageHint: string;
};

export type Locale = 'pt-BR' | 'en-US';

export type NewItemBadges = {
  tasks: boolean;
  wellbeing: boolean;
  notes: boolean;
  news: boolean;
};

export interface AppContextType {
  profile: UserProfile | null;
  setProfile: Dispatch<SetStateAction<UserProfile | null>>;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  scheduleItems: ScheduleItem[];
  setScheduleItems: Dispatch<SetStateAction<ScheduleItem[]>>;
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
  newItems: NewItemBadges;
  setNewItemBadge: (key: keyof NewItemBadges) => void;
  clearNewItemBadge: (key: keyof NewItemBadges) => void;
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
