'use client';

import { useContext, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ScheduleItem } from '@/lib/types';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

const scheduleItemSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  dayOfWeek: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], {
    required_error: 'Day of the week is required.',
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format.'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format.'),
  location: z.string().optional(),
}).refine(data => data.startTime < data.endTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
});

type ScheduleItemFormValues = z.infer<typeof scheduleItemSchema>;

interface AddScheduleItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveItem: (item: Omit<ScheduleItem, 'id'>) => void;
  item?: ScheduleItem | null;
}

export function AddScheduleItemDialog({ isOpen, onOpenChange, onSaveItem, item }: AddScheduleItemDialogProps) {
  const { locale } = useContext(AppContext);
  const isEditing = !!item;

  const daysOfWeek = [
    { id: 'mon', name: t('Monday', locale) },
    { id: 'tue', name: t('Tuesday', locale) },
    { id: 'wed', name: t('Wednesday', locale) },
    { id: 'thu', name: t('Thursday', locale) },
    { id: 'fri', name: t('Friday', locale) },
    { id: 'sat', name: t('Saturday', locale) },
    { id: 'sun', name: t('Sunday', locale) },
  ];

  const form = useForm<ScheduleItemFormValues>({
    resolver: zodResolver(scheduleItemSchema),
    defaultValues: {
      title: '',
      startTime: '',
      endTime: '',
      location: '',
    },
  });
  
  useEffect(() => {
    if (item) {
      form.reset(item);
    } else {
      form.reset({
        title: '',
        dayOfWeek: undefined,
        startTime: '',
        endTime: '',
        location: '',
      });
    }
  }, [item, isOpen, form]);

  const onSubmit = (data: ScheduleItemFormValues) => {
    onSaveItem(data as Omit<ScheduleItem, 'id'>);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('Edit Item', locale) : t('Add to Schedule', locale)}</DialogTitle>
          <DialogDescription>
             {isEditing 
                ? t('Update the details for your schedule item.', locale)
                : t('Fill in the details for your new schedule item.', locale)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Name (e.g., Subject)', locale)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e.g., Mathematics', locale)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Day of Week', locale)}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select a day', locale)} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysOfWeek.map(day => (
                        <SelectItem key={day.id} value={day.id}>{day.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Start Time', locale)}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('End Time', locale)}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Sub-name (e.g., Room)', locale)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e.g., Room 1C', locale)} {...field} />
                  </FormControl>
                  <FormMessage />
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
