
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Habit, DayOfWeek } from '@/lib/types';
import { cn } from '@/lib/utils';

const habitSchema = z.object({
  name: z.string().min(1, 'O nome do hábito é obrigatório.'),
  days: z.array(z.string()).min(1, 'Selecione pelo menos um dia da semana.'),
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface AddHabitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
}

const daysOfWeek: { id: DayOfWeek, name: string }[] = [
    { id: 'seg', name: 'S' },
    { id: 'ter', name: 'T' },
    { id: 'qua', name: 'Q' },
    { id: 'qui', name: 'Q' },
    { id: 'sex', name: 'S' },
    { id: 'sab', name: 'S' },
    { id: 'dom', name: 'D' },
];


export function AddHabitDialog({ isOpen, onOpenChange, onAddHabit }: AddHabitDialogProps) {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      days: [],
    },
  });

  const onSubmit = (data: HabitFormValues) => {
    onAddHabit({ name: data.name, days: data.days as DayOfWeek[] });
    form.reset({ name: '', days: [] });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Hábito</DialogTitle>
          <DialogDescription>
            Defina um novo hábito e escolha os dias para praticá-lo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Hábito</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ler por 30 minutos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetir em</FormLabel>
                  <FormControl>
                    <ToggleGroup 
                        type="multiple" 
                        variant="outline"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-7 gap-1"
                    >
                        {daysOfWeek.map(day => (
                            <ToggleGroupItem 
                                key={day.id} 
                                value={day.id} 
                                aria-label={`Toggle ${day.name}`}
                                className="h-10 w-10"
                            >
                                {day.name}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit">Salvar Hábito</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
