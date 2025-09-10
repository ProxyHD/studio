'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import type { Task, Habit, AppContextType, Note, Event, UserProfile } from '@/lib/types';
import { useDebouncedCallback } from 'use-debounce';

export const AppContext = createContext<AppContextType>({
  profile: null,
  setProfile: () => {},
  tasks: [],
  setTasks: () => {},
  notes: [],
  setNotes: () => {},
  events: [],
  setEvents: () => {},
  selectedMood: null,
  setSelectedMood: () => {},
  habits: [],
  setHabits: () => {},
  completedHabits: [],
  setCompletedHabits: () => {},
  loading: true,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  
  const debouncedSaveData = useDebouncedCallback(
    async (userId: string, data: any) => {
      try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, data, { merge: true });
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    },
    1000 // 1 second debounce delay
  );

  // Effect to save all data to Firestore when it changes
  useEffect(() => {
    if (user && !loading) {
      debouncedSaveData(user.uid, {
        profile,
        tasks,
        notes,
        events,
        selectedMood,
        habits,
        completedHabits,
      });
    }
  }, [profile, tasks, notes, events, selectedMood, habits, completedHabits, user, loading, debouncedSaveData]);


  // Effect to load data from Firestore on user login
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (user) {
      setLoading(true);
      const docRef = doc(db, 'users', user.uid);
      
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data.profile || null)
          setTasks(data.tasks || []);
          setNotes(data.notes || []);
          setEvents(data.events || []);
          setSelectedMood(data.selectedMood || null);
          setHabits(data.habits || []);
          setCompletedHabits(data.completedHabits || []);
        } else {
          // No data yet, initialize with empty state
          setProfile(null);
          setTasks([]);
          setNotes([]);
          setEvents([]);
          setSelectedMood(null);
          setHabits([]);
          setCompletedHabits([]);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });

    } else {
      // No user, clear all data
      setProfile(null);
      setTasks([]);
      setNotes([]);
      setEvents([]);
      setSelectedMood(null);
      setHabits([]);
      setCompletedHabits([]);
      setLoading(false);
    }
    
    return () => unsubscribe(); // Cleanup snapshot listener on component unmount or user change
  }, [user]);
  
  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        tasks,
        setTasks,
        notes,
        setNotes,
        events,
        setEvents,
        selectedMood,
        setSelectedMood,
        habits,
        setHabits,
        completedHabits,
        setCompletedHabits,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
