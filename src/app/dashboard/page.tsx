'use client';

import { useContext, useMemo } from 'react';
import { Activity, CheckCircle, Heart } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { TasksPreview } from '@/components/dashboard/tasks-preview';
import { RoutineSuggester } from '@/components/dashboard/routine-suggester';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function DashboardPage() {
  const { tasks, moodLogs, locale } = useContext(AppContext);

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  
  // Placeholder for habit streak logic
  const habitStreak = 0;

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const selectedMood = useMemo(() => {
    const todayLog = moodLogs.find(log => log.date === todayISO);
    return todayLog ? todayLog.mood : null;
  }, [moodLogs, todayISO]);

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title={t('Dashboard', locale)} />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TasksPreview />
          </div>
          <div className="lg:col-span-1">
            <RoutineSuggester />
          </div>
        </div>
      </div>
    </div>
  );
}
