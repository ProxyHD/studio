import { tasks } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TasksPreview() {
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Tarefas de Hoje</CardTitle>
        <CardDescription>Você tem {pendingTasks.length} {pendingTasks.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'}.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-80">
          <div className="space-y-4 pr-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted">
                <Checkbox id={`task-preview-${task.id}`} checked={task.status === 'done'} />
                <div className="flex-1 flex justify-between items-center">
                  <label
                    htmlFor={`task-preview-${task.id}`}
                    className={cn("font-medium", task.status === 'done' && 'line-through text-muted-foreground')}
                  >
                    {task.title}
                  </label>
                  <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="capitalize">
                    {task.priority === 'high' ? 'alta' : task.priority === 'medium' ? 'média' : 'baixa'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
