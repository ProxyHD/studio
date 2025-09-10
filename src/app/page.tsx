import { Activity, CheckCircle, DollarSign, Heart, Lightbulb } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { TasksPreview } from '@/components/dashboard/tasks-preview';
import { RoutineSuggester } from '@/components/dashboard/routine-suggester';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Dashboard" />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Tasks Completed" value="12 / 20" icon={CheckCircle} />
          <SummaryCard title="Current Mood" value="Happy" icon={Heart} />
          <SummaryCard title="Expenses" value="$1,250" icon={DollarSign} />
          <SummaryCard title="Habit Streak" value="5 days" icon={Activity} />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <TasksPreview />
          </div>
          <div className="lg:col-span-3">
            <RoutineSuggester />
          </div>
        </div>
      </div>
    </div>
  );
}
