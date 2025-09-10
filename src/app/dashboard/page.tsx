'use client';

import { useContext } from 'react';
import { Activity, CheckCircle, DollarSign, Heart } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { TasksPreview } from '@/components/dashboard/tasks-preview';
import { RoutineSuggester } from '@/components/dashboard/routine-suggester';
import { AppContext } from '@/context/app-provider';

export default function DashboardPage() {
  const { tasks, selectedMood } = useContext(AppContext);

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  
  // Placeholder for habit streak logic
  const habitStreak = 0;

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Painel" />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard 
            title="Tarefas Concluídas" 
            value={`${completedTasks} / ${totalTasks}`} 
            icon={CheckCircle} 
          />
          <SummaryCard 
            title="Humor Atual" 
            value={selectedMood || 'N/A'}
            icon={Heart} 
          />
          <SummaryCard title="Despesas" value="€0" icon={DollarSign} />
          <SummaryCard 
            title="Sequência de Hábitos" 
            value={`${habitStreak} dias`}
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
