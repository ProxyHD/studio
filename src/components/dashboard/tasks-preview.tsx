import { tasks } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function TasksPreview() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
        <CardDescription>You have {tasks.filter(t => t.status !== 'done').length} tasks pending.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <Checkbox id={`task-${task.id}`} checked={task.status === 'done'} />
              <div className="flex-1">
                <label
                  htmlFor={`task-${task.id}`}
                  className={cn("font-medium", task.status === 'done' && 'line-through text-muted-foreground')}
                >
                  {task.title}
                </label>
              </div>
              <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
