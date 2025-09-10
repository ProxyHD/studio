import { Activity, CheckCircle, DollarSign, Heart } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { TasksPreview } from '@/components/dashboard/tasks-preview';
import { RoutineSuggester } from '@/components/dashboard/routine-suggester';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Painel" />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Tarefas Concluídas" value="12 / 20" icon={CheckCircle} />
          <SummaryCard title="Humor Atual" value="Feliz" icon={Heart} />
          <SummaryCard title="Despesas" value="€1,250" icon={DollarSign} />
          <SummaryCard title="Sequência de Hábitos" value="5 dias" icon={Activity} />
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
