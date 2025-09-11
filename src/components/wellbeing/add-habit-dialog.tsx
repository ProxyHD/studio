'use client';

import { useContext, useMemo, useEffect } from 'react';
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
  onSaveHabit: (habit: Omit<Habit, 'id'>) => void;
  habit?: Habit | null;
}

export function AddHabitDialog({ isOpen, onOpenChange, onSaveHabit, habit }: AddHabitDialogProps) {
  const { locale } = useContext(AppContext);
  const isEditing = !!habit;
  
  const daysOfWeek = useMemo(() => [
    { id: 'sun', name: t('Su', locale) },
    { id: 'mon', name: t('M', locale) },
    { id: 'tue', name: t('T', locale) },
    { id: 'wed', name: t('W', locale) },
    { id: 'thu', name: t('Th', locale) },
    { id: 'fri', name: t('F', locale) },
    { id: 'sat', name: t('S', locale) },
  ], [locale]);
  
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      days: [],
    },
  });

  useEffect(() => {
    if (habit) {
      form.reset(habit);
    } else {
      form.reset({ name: '', days: [] });
    }
  }, [habit, isOpen, form]);

  const onSubmit = (data: HabitFormValues) => {
    onSaveHabit({ name: data.name, days: data.days as DayOfWeek[] });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('Edit Habit', locale) : t('Add New Habit', locale)}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('Update the details for your habit.', locale)
              : t('Define a new habit and choose the days to practice it.', locale)}
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
              <Button type="submit">{t('Save', locale)}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
