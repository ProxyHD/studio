'use client';

import { createContext, useState, ReactNode } from 'react';
import type { Task, Habit, AppContextType } from '@/lib/types';

export const AppContext = createContext<AppContextType>({
  tasks: [],
  setTasks: () => {},
  selectedMood: null,
  setSelectedMood: () => {},
  habits: [],
  setHabits: () => {},
  completedHabits: new Set(),
  setCompletedHabits: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        selectedMood,
        setSelectedMood,
        habits,
        setHabits,
        completedHabits,
        setCompletedHabits,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
