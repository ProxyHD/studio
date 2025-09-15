
'use client';

import { createContext, useState, ReactNode, useEffect, useContext, useCallback, Dispatch, SetStateAction, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import type { Task, Habit, AppContextType, Note, Event, UserProfile, Locale, Transaction, MoodLog, CompletedHabit, ScheduleItem, Feedback, NewItemBadges, SaveStatus } from '@/lib/types';
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
  newItems: { dashboard: false, tasks: false, calendar: false, wellbeing: false, notes: false, finances: false, news: false },
  setNewItemBadge: () => {},
  clearNewItemBadge: () => {},
  saveStatus: 'idle',
});

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const dataLoadedRef = useRef(false);
  const isSavingRef = useRef(false);

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
  const [newItems, setNewItems] = useState<NewItemBadges>({ dashboard: false, tasks: false, calendar: false, wellbeing: false, notes: false, finances: false, news: false });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  
  const debouncedSaveData = useDebouncedCallback(
    async (userId: string, data: any) => {
      try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, data, { merge: true });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error("Error saving user data:", error);
        setSaveStatus('idle');
      } finally {
        isSavingRef.current = false;
      }
    },
    1500
  );

  // Effect to save all data to Firestore when it changes
  useEffect(() => {
    if (!dataLoadedRef.current || !user || isSavingRef.current) {
      return;
    }
    
    isSavingRef.current = true;
    setSaveStatus('saving');

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
  }, [profile, tasks, notes, events, scheduleItems, transactions, moodLogs, habits, completedHabits, feedback, locale, user, debouncedSaveData]);


  // Effect to load data from Firestore on user login
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (user) {
      setLoading(true);
      dataLoadedRef.current = false;
      const docRef = doc(db, 'users', user.uid);
      
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const userProfile: UserProfile = {
             firstName: data.profile?.firstName || '',
             lastName: data.profile?.lastName || '',
             email: data.profile?.email || user.email || '',
             plan: data.profile?.plan || 'free',
          };
          setProfile(userProfile);
          setTasks(data.tasks || []);
          setNotes(data.notes || []);
          setEvents(data.events || []);
          setScheduleItems(data.scheduleItems || []);
          setTransactions(data.transactions || []);
          setMoodLogs(data.moodLogs || []);
          setHabits(data.habits || []);
          setCompletedHabits(data.completedHabits || []);
          setFeedback(data.feedback === undefined ? null : data.feedback);
          setLocale(data.locale || 'pt-BR');
        } else {
          // Document doesn't exist, likely a new user registration in progress.
          // The registration process will create the document.
          // We can set defaults here to ensure the app is usable while that happens.
          const initialProfile: UserProfile = {
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            plan: 'free',
          };
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
        }
        setLoading(false);
        dataLoadedRef.current = true;
      }, (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
        dataLoadedRef.current = true;
      });

    } else {
      // No user, clear all data and don't show loading screen
      setLoading(false);
      dataLoadedRef.current = false;
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

  const setNewItemBadge = (key: keyof NewItemBadges) => {
    setNewItems(prev => ({ ...prev, [key]: true }));
  };

  const clearNewItemBadge = (key: keyof NewItemBadges) => {
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
        saveStatus,
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
