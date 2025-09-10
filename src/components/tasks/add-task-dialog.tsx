'use client';

import { useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

const taskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório.'),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  project: z.string().optional(),
  subtasks: z.array(z.object({
    title: z.string().min(1, 'O título da sub-tarefa é obrigatório.'),
  })).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
}

export function AddTaskDialog({ isOpen, onOpenChange, onAddTask }: AddTaskDialogProps) {
  const { locale } = useContext(AppContext);
  const isPlusUser = true; // Mock value, would come from user session
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      priority: 'medium',
      project: '',
      subtasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  const onSubmit = (data: TaskFormValues) => {
    onAddTask({
      ...data,
      dueDate: data.dueDate ? format(data.dueDate, 'dd/MM/yyyy') : undefined,
      subtasks: data.subtasks?.map(st => ({ id: crypto.randomUUID(), title: st.title, done: false })),
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Add New Task', locale)}</DialogTitle>
          <DialogDescription>
            {t('Fill in the details of your new task. Click save when you\'re done.', locale)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Title', locale)}</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Comprar mantimentos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Priority', locale)}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select priority', locale)} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">{t('Low', locale)}</SelectItem>
                      <SelectItem value="medium">{t('Medium', locale)}</SelectItem>
                      <SelectItem value="high">{t('High', locale)}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('Due Date', locale)}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: dateLocale })
                          ) : (
                            <span>{t('Pick a date', locale)}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Plus Feature: Project */}
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {t('Project', locale)}
                    {!isPlusUser && <Zap className="h-4 w-4 text-accent" />}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('e.g., Work, Personal', locale)}
                      {...field}
                      disabled={!isPlusUser} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plus Feature: Sub-tasks */}
            <div>
              <FormLabel className="flex items-center gap-2 mb-2">
                {t('Sub-tasks', locale)}
                {!isPlusUser && <Zap className="h-4 w-4 text-accent" />}
              </FormLabel>
              <div className="space-y-2">
                {fields.map((field, index) => (
                   <FormField
                    key={field.id}
                    control={form.control}
                    name={`subtasks.${index}.title`}
                    render={({ field: subtaskField }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                           <Input 
                            {...subtaskField}
                            placeholder={t('e.g., Research the topic', locale)}
                            disabled={!isPlusUser}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={!isPlusUser}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ title: "" })}
                  disabled={!isPlusUser}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('Add Sub-task', locale)}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">{t('Save Task', locale)}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
