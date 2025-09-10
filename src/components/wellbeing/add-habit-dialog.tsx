'use client';

import { useContext, useMemo } from 'react';
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
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';


const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required.'),
  days: z.array(z.string()).min(1, 'Select at least one day of the week.'),
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface AddHabitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
}

export function AddHabitDialog({ isOpen, onOpenChange, onAddHabit }: AddHabitDialogProps) {
  const { locale } = useContext(AppContext);
  
  const daysOfWeek = useMemo(() => [
    { id: 'seg', name: t('M', locale) },
    { id: 'ter', name: t('T', locale) },
    { id: 'qua', name: t('W', locale) },
    { id: 'qui', name: t('Th', locale) },
    { id: 'sex', name: t('F', locale) },
    { id: 'sab', name: t('S', locale) },
    { id: 'dom', name: t('Su', locale) },
  ], [locale]);
  
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
          <DialogTitle>{t('Add New Habit', locale)}</DialogTitle>
          <DialogDescription>
            {t('Define a new habit and choose the days to practice it.', locale)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Habit Name', locale)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e.g., Read for 30 minutes', locale)} {...field} />
                  </FormControl>
                  <FormMessage>{t('Habit name is required.', locale)}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Repeat on', locale)}</FormLabel>
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
                   <FormMessage>{t('Select at least one day of the week.', locale)}</FormMessage>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit">{t('Save Habit', locale)}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
