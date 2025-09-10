'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
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

  // Load state from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) setTasks(JSON.parse(storedTasks));

    const storedMood = localStorage.getItem('selectedMood');
    if (storedMood) setSelectedMood(JSON.parse(storedMood));

    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) setHabits(JSON.parse(storedHabits));

    const storedCompletedHabits = localStorage.getItem('completedHabits');
    if (storedCompletedHabits) setCompletedHabits(new Set(JSON.parse(storedCompletedHabits)));
    
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('selectedMood', JSON.stringify(selectedMood));
  }, [selectedMood]);
  
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('completedHabits', JSON.stringify(Array.from(completedHabits)));
  }, [completedHabits]);


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
