import type { Dispatch, SetStateAction } from 'react';

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

export type DayOfWeek = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export type Habit = {
  id: string;
  name: string;
  days: DayOfWeek[];
};

export interface AppContextType {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  selectedMood: string | null;
  setSelectedMood: Dispatch<SetStateAction<string | null>>;
  habits: Habit[];
  setHabits: Dispatch<SetStateAction<Habit[]>>;
  completedHabits: string[];
  setCompletedHabits: Dispatch<SetStateAction<string[]>>;
  loading: boolean;
}
