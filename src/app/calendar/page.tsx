'use client';

import { useState, useEffect } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Dot, MapPin, Users, Trash2 } from 'lucide-react';
import { AddEventDialog } from '@/components/calendar/add-event-dialog';
import type { Event } from '@/lib/types';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      // Dates need to be parsed back into Date objects
      const parsedEvents = JSON.parse(storedEvents).map((event: Event) => ({
        ...event,
        date: parse(event.date as unknown as string, 'yyyy-MM-dd', new Date()),
      }));
      setEvents(parsedEvents);
    }
  }, []);
  
  useEffect(() => {
    // When saving, convert Date objects to a storable format like 'yyyy-MM-dd'
    const storableEvents = events.map(event => ({
        ...event,
        date: format(event.date, 'yyyy-MM-dd'),
    }));
    localStorage.setItem('events', JSON.stringify(storableEvents));
  }, [events]);

  const selectedDayEvents = date
    ? events.filter(
        (event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    : [];
  
  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      ...eventData,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title="Calendário" />
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 pt-6 md:p-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-2 md:p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="p-0 w-full"
                  locale={ptBR}
                  classNames={{
                    months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
                    month: 'space-y-4 w-full',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex w-full',
                    head_cell: 'text-muted-foreground rounded-md w-full font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2',
                    cell: 'h-16 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: 'h-16 w-full p-1 font-normal aria-selected:opacity-100',
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      const hasEvent = events.some(
                        (event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                      );
                      return (
                        <div className="relative h-full w-full flex items-center justify-center">
                          <span>{date.getDate()}</span>
                          {hasEvent && (
                            <Dot className="absolute bottom-1 right-1 h-6 w-6 text-primary" />
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {date ? format(date, "d 'de' MMMM", { locale: ptBR }) : 'Selecione um dia'}
                    </CardTitle>
                  </div>
                  <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Evento
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map(event => (
                    <div key={event.id} className="p-3 bg-secondary/50 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                            {event.startTime && event.endTime
                                ? `${event.startTime} - ${event.endTime}`
                                : event.startTime
                                ? `Às ${event.startTime}`
                                : 'O dia todo'}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                       {event.description && <p className="text-sm mt-1">{event.description}</p>}
                       {event.location && (
                         <div className="flex items-center gap-2 text-sm">
                           <MapPin className="h-4 w-4 text-muted-foreground" />
                           <span>{event.location}</span>
                         </div>
                       )}
                       {event.guests && event.guests.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Convidados:</p>
                              <ul className="list-disc list-inside">
                                {event.guests.map(guest => <li key={guest.email}>{guest.email}</li>)}
                              </ul>
                            </div>
                          </div>
                       )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum evento para este dia.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      <AddEventDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddEvent={addEvent}
        selectedDate={date}
      />
    </>
  );
}
