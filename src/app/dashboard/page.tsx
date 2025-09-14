'use client';

import { useContext, useMemo, useEffect, useState } from 'react';
import { Activity, CheckCircle, Heart, Wallet } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { TasksPreview } from '@/components/dashboard/tasks-preview';
import { RoutineSuggester } from '@/components/dashboard/routine-suggester';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { EventsPreview } from '@/components/dashboard/events-preview';
import { HabitsPreview } from '@/components/dashboard/habits-preview';
import { FinancePreview } from '@/components/dashboard/finance-preview';
import { FeedbackDialog } from '@/components/dashboard/feedback-dialog';
import type { Feedback } from '@/lib/types';
import { useAuth } from '@/context/auth-provider';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';


export default function DashboardPage() {
  const { tasks, moodLogs, transactions, locale, formatCurrency, feedback, setFeedback } = useContext(AppContext);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  
  // Placeholder for habit streak logic
  const habitStreak = 0;

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const selectedMood = useMemo(() => {
    const todayLog = moodLogs.find(log => log.date === todayISO);
    return todayLog ? todayLog.mood : null;
  }, [moodLogs, todayISO]);

  const balance = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expenses;
  }, [transactions]);

  useEffect(() => {
    // Only show feedback dialog if it hasn't been submitted yet
    if (feedback === null) {
      const timer = setTimeout(() => {
        setIsFeedbackDialogOpen(true);
      }, 15000); // 15 seconds

      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleFeedbackSubmit = async (newFeedback: Omit<Feedback, 'submittedAt'>) => {
    if (!user) return;

    const feedbackToSave: Feedback = {
      ...newFeedback,
      submittedAt: new Date().toISOString(),
    };
    
    // 1. Save to the user's document so we don't ask them again
    setFeedback(feedbackToSave);
    
    try {
      // 2. Add a new document to the top-level 'feedbacks' collection
      await addDoc(collection(db, "feedbacks"), {
        ...feedbackToSave,
        userId: user.uid, // Add user ID to know who sent it
      });
    } catch (error) {
       console.error("Error saving feedback to public collection:", error);
       toast({
        title: t('Error', locale),
        description: "Could not save feedback. Please try again.",
        variant: 'destructive',
       });
    }

    setIsFeedbackDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title={t('Dashboard', locale)} />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard 
              title={t('Completed Tasks', locale)} 
              value={`${completedTasks} / ${totalTasks}`} 
              icon={CheckCircle} 
            />
            <SummaryCard 
              title={t('Current Mood', locale)}
              value={selectedMood ? t(selectedMood, locale) : t('N/A', locale)}
              icon={Heart} 
            />
            <SummaryCard 
              title={t('Habit Streak', locale)} 
              value={`${habitStreak} ${t('days', locale)}`}
              icon={Activity} 
            />
            <SummaryCard 
              title={t('Current Balance', locale)}
              value={formatCurrency(balance)}
              icon={Wallet} 
            />
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
               <TasksPreview />
               <EventsPreview />
               <HabitsPreview />
               <FinancePreview />
            </div>
            <div className="xl:col-span-1">
              <RoutineSuggester />
            </div>
          </div>

        </div>
      </div>
      <FeedbackDialog
        isOpen={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
}
