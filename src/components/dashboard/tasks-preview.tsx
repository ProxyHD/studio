'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function TasksPreview() {
  const { tasks, setTasks, locale } = useContext(AppContext);
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const recentTasks = [...tasks].sort((a, b) => (a.status === 'done' ? 1 : -1) - (b.status === 'done' ? 1 : -1)).slice(0, 5);


  const handleToggle = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
        : task
    ));
  };
  
  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    if (priority === 'high') return t('High', locale);
    if (priority === 'medium') return t('Medium', locale);
    return t('Low', locale);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t('Today\'s Tasks', locale)}</CardTitle>
        <CardDescription>{t('You have {count} pending {task, plural, one {task} other {tasks}}.', locale, { count: pendingTasks.length, task: 'task' })}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted">
              <Checkbox 
                id={`task-preview-${task.id}`} 
                checked={task.status === 'done'} 
                onCheckedChange={() => handleToggle(task.id)}
              />
              <div className="flex-1 flex justify-between items-center">
                <label
                  htmlFor={`task-preview-${task.id}`}
                  className={cn("font-medium", task.status === 'done' && 'line-through text-muted-foreground')}
                >
                  {task.title}
                </label>
                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="capitalize">
                  {getPriorityText(task.priority)}
                </Badge>
              </div>
            </div>
          ))}
            {tasks.length === 0 && (
            <div className="flex items-center justify-center h-full py-8">
              <p className="text-sm text-muted-foreground">{t('No tasks for today.', locale)}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/tasks">
            {t('View All Tasks', locale)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
