'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Zap, PlusCircle, Trash2 } from 'lucide-react';

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
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  selectedDate?: Date;
}

export function AddEventDialog({ isOpen, onOpenChange, onAddEvent, selectedDate }: AddEventDialogProps) {
  const isProUser = true; // Mock value, would come from user session

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
    if (selectedDate) {
      form.setValue('date', selectedDate);
    }
  }, [selectedDate, form]);

  const onSubmit = (data: EventFormValues) => {
    onAddEvent(data);
    form.reset({
      title: '',
      date: selectedDate || new Date(),
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      guests: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Evento</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do seu novo evento. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Reunião com a equipe" {...field} />
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
                  <FormLabel>Data</FormLabel>
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
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
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
                    <FormLabel>Hora de Início</FormLabel>
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
                    <FormLabel>Hora de Fim</FormLabel>
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes do evento..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pro Feature: Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Localização
                    {!isProUser && <Zap className="h-4 w-4 text-accent" />}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Escritório" 
                      {...field}
                      disabled={!isProUser} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pro Feature: Guests */}
            <div>
              <FormLabel className="flex items-center gap-2 mb-2">
                Convidados
                {!isProUser && <Zap className="h-4 w-4 text-accent" />}
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
                            placeholder="email@exemplo.com"
                            disabled={!isProUser}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={!isProUser}
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
                  disabled={!isProUser}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Convidado
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit">Salvar Evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
