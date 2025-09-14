'use client';

import { useEffect, useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';

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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/types';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

const eventSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório.'),
  date: z.date({
    required_error: 'A data é obrigatória.',
  }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  guests: z.array(z.object({
    email: z.string().email('Por favor, insira um e-mail válido.'),
  })).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface AddEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveEvent: (event: Omit<Event, 'id'>) => void;
  selectedDate?: Date;
  event?: Event | null;
}

export function AddEventDialog({ isOpen, onOpenChange, onSaveEvent, selectedDate, event }: AddEventDialogProps) {
  const { locale } = useContext(AppContext);
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;
  const isEditing = !!event;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: selectedDate || new Date(),
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      guests: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  useEffect(() => {
    if (event) {
      form.reset({
        ...event,
        date: typeof event.date === 'string' ? parseISO(event.date) : event.date,
      });
    } else {
      form.reset({
        title: '',
        date: selectedDate || new Date(),
        startTime: '',
        endTime: '',
        description: '',
        location: '',
        guests: [],
      });
    }
  }, [event, selectedDate, isOpen, form]);


  const onSubmit = (data: EventFormValues) => {
    onSaveEvent(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('Edit Event', locale) : t('Add New Event', locale)}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('Update the details for your event.', locale)
              : t('Fill in the details for your new event. Click save when you\'re done.', locale)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Title', locale)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e.g., Meeting with the team', locale)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('Date', locale)}</FormLabel>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Description', locale)}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('Event details...', locale)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {t('Location', locale)}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('e.g., Office', locale)} 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel className="flex items-center gap-2 mb-2">
                {t('Guests', locale)}
              </FormLabel>
              <div className="space-y-2">
                {fields.map((field, index) => (
                   <FormField
                    key={field.id}
                    control={form.control}
                    name={`guests.${index}.email`}
                    render={({ field: guestField }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                           <Input 
                            {...guestField}
                            placeholder={t('email@example.com', locale)}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
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
                  onClick={() => append({ email: "" })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('Add Guest', locale)}
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit">{t('Save', locale)}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
