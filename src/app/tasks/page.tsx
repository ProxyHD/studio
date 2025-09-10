import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { tasks } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Tarefas" />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Quadro de Tarefas</h2>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <TaskColumn title="A Fazer" tasks={todoTasks} />
          <TaskColumn title="Em Progresso" tasks={inProgressTasks} />
          <TaskColumn title="Concluído" tasks={doneTasks} />
        </div>
      </div>
    </div>
  );
}

function TaskColumn({ title, tasks: taskItems }: { title: string, tasks: typeof tasks }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {taskItems.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4 flex items-start gap-4">
              <Checkbox id={`task-${task.id}`} checked={task.status === 'done'} className="mt-1" />
              <div className="flex-1 space-y-1">
                <label htmlFor={`task-${task.id}`} className={cn("font-medium", task.status === 'done' && 'line-through text-muted-foreground')}>
                  {task.title}
                </label>
                <p className="text-xs text-muted-foreground">{task.dueDate}</p>
              </div>
              <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                {task.priority === 'high' ? 'alta' : task.priority === 'medium' ? 'média' : 'baixa'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
