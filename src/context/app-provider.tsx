'use client';

import { createContext, useState, ReactNode, useEffect, useContext, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import type { Task, Habit, AppContextType, Note, Event, UserProfile, Locale, Transaction, MoodLog, CompletedHabit, ScheduleItem, Feedback } from '@/lib/types';
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
  scheduleItems: [],
  setScheduleItems: () => {},
  transactions: [],
  setTransactions: () => {},
  moodLogs: [],
  setMoodLogs: () => {},
  habits: [],
  setHabits: () => {},
  completedHabits: [],
  setCompletedHabits: () => {},
  feedback: undefined,
  setFeedback: () => {},
  handleHabitToggle: () => {},
  locale: 'pt-BR',
  setLocale: () => {},
  formatCurrency: () => '',
  loading: true,
  newItems: { tasks: false, wellbeing: false, notes: false, news: false },
  setNewItemBadge: () => {},
  clearNewItemBadge: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<CompletedHabit[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null | undefined>(undefined);
  const [locale, setLocale] = useState<Locale>('pt-BR');
  const [newItems, setNewItems] = useState({ tasks: false, wellbeing: false, notes: false, news: false });
  
  const debouncedSaveData = useDebouncedCallback(
    async (userId: string, data: any) => {
      try {
        // We only save if the profile is not null, to avoid overwriting good data with empty data during hydration
        if (data.profile) {
          const docRef = doc(db, 'users', userId);
          await setDoc(docRef, data, { merge: true });
        }
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
        scheduleItems,
        transactions,
        moodLogs,
        habits,
        completedHabits,
        feedback: feedback === undefined ? null : feedback,
        locale,
      });
    }
  }, [profile, tasks, notes, events, scheduleItems, transactions, moodLogs, habits, completedHabits, feedback, locale, user, loading, debouncedSaveData]);


  // Effect to load data from Firestore on user login
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (user) {
      setLoading(true);
      const docRef = doc(db, 'users', user.uid);
      
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ensure profile is at least an empty object if it doesn't exist, to stop loading state
          setProfile(data.profile || { firstName: '', lastName: '', email: user.email || '' });
          setTasks(data.tasks || []);
          setNotes(data.notes || []);
          setEvents(data.events || []);
          setScheduleItems(data.scheduleItems || []);
          setTransactions(data.transactions || []);
          setMoodLogs(data.moodLogs || []);
          setHabits(data.habits || []);
          setCompletedHabits(data.completedHabits || []);
          setFeedback(data.feedback || null);
          setLocale(data.locale || 'pt-BR');
        } else {
          // New user, document doesn't exist yet, but we can set up a default profile
          const initialProfile = { firstName: '', lastName: '', email: user.email || '' };
          setProfile(initialProfile);
          setTasks([]);
          setNotes([]);
          setEvents([]);
          setScheduleItems([]);
          setTransactions([]);
          setMoodLogs([]);
          setHabits([]);
          setCompletedHabits([]);
          setFeedback(null);
          setLocale('pt-BR');
           // Save the initial empty state for the new user
          setDoc(docRef, { 
            profile: initialProfile,
            tasks: [],
            notes: [],
            events: [],
            scheduleItems: [],
            transactions: [],
            moodLogs: [],
            habits: [],
            completedHabits: [],
            feedback: null,
            locale: 'pt-BR',
          });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });

    } else {
      // No user, clear all data and don't show loading screen
      if (window.location.pathname === '/' || window.location.pathname === '/register') {
        setLoading(false);
      }
      setProfile(null);
      setTasks([]);
      setNotes([]);
      setEvents([]);
      setScheduleItems([]);
      setTransactions([]);
      setMoodLogs([]);
      setHabits([]);
      setCompletedHabits([]);
      setFeedback(undefined);
      setLocale('pt-BR');
    }
    
    return () => unsubscribe(); // Cleanup snapshot listener on component unmount or user change
  }, [user]);

  const handleHabitToggle = (habitId: string) => {
    const todayISO = new Date().toISOString().split('T')[0];
    setCompletedHabits(prev => {
      const existingIndex = prev.findIndex(ch => ch.date === todayISO && ch.habitId === habitId);
      if (existingIndex > -1) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, { date: todayISO, habitId }];
      }
    });
  };

  const setNewItemBadge = (key: keyof typeof newItems) => {
    setNewItems(prev => ({ ...prev, [key]: true }));
  };

  const clearNewItemBadge = (key: keyof typeof newItems) => {
    setNewItems(prev => ({ ...prev, [key]: false }));
  };
  
  const formatCurrency = useCallback((amount: number) => {
    const currency = locale === 'pt-BR' ? 'EUR' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }, [locale]);

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
        scheduleItems,
        setScheduleItems,
        transactions,
        setTransactions,
        moodLogs,
        setMoodLogs,
        habits,
        setHabits,
        completedHabits,
        setCompletedHabits,
        feedback,
        setFeedback: setFeedback as Dispatch<SetStateAction<Feedback | null>>,
        handleHabitToggle,
        locale,
        setLocale,
        formatCurrency,
        loading,
        newItems,
        setNewItemBadge,
        clearNewItemBadge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Add a hook to use the context easily
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
