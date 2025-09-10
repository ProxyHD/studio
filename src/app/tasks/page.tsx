'use client';

import { useState, useContext } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Folder, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function TasksPage() {
  const { tasks, setTasks, locale } = useContext(AppContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      status: 'todo',
      ...task,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  
  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: task.status === 'done' ? 'todo' : 'done' };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks?.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask
          ),
        };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };


  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title={t('Tasks', locale)} />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{t('Task Board', locale)}</h2>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('Add Task', locale)}
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <TaskColumn title={t('To Do', locale)} tasks={todoTasks} onToggleTask={toggleTask} onToggleSubtask={toggleSubtask} onDeleteTask={deleteTask} locale={locale} />
            <TaskColumn title={t('In Progress', locale)} tasks={inProgressTasks} onToggleTask={toggleTask} onToggleSubtask={toggleSubtask} onDeleteTask={deleteTask} locale={locale} />
            <TaskColumn title={t('Done', locale)} tasks={doneTasks} onToggleTask={toggleTask} onToggleSubtask={toggleSubtask} onDeleteTask={deleteTask} locale={locale} />
          </div>
        </div>
      </div>
      <AddTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddTask={addTask}
      />
    </>
  );
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  locale: 'pt-BR' | 'en-US';
}

function TaskColumn({ title, tasks, onToggleTask, onToggleSubtask, onDeleteTask, locale }: TaskColumnProps) {
  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    if (priority === 'high') return t('High', locale);
    if (priority === 'medium') return t('Medium', locale);
    return t('Low', locale);
  };
  
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <Checkbox 
                  id={`task-${task.id}`} 
                  checked={task.status === 'done'} 
                  onCheckedChange={() => onToggleTask(task.id)}
                  className="mt-1" 
                />
                <div className="flex-1 space-y-1">
                  <label htmlFor={`task-${task.id}`} className={cn("font-medium", task.status === 'done' && 'line-through text-muted-foreground')}>
                    {task.title}
                  </label>
                  {task.dueDate && <p className="text-xs text-muted-foreground">{task.dueDate}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                    {getPriorityText(task.priority)}
                  </Badge>
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </div>
               {task.project && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Folder className="h-3 w-3" />
                  <span>{task.project}</span>
                </div>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="pl-6 space-y-2 border-l ml-2">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`subtask-${subtask.id}`}
                        checked={subtask.done}
                        onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                      />
                      <label 
                        htmlFor={`subtask-${subtask.id}`}
                        className={cn("text-sm", subtask.done && 'line-through text-muted-foreground')}
                      >
                        {subtask.title}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">{t('No tasks here.', locale)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
