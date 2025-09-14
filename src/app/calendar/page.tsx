
'use client';

import { useState, useContext } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Dot, MapPin, Users, Trash2, Pencil } from 'lucide-react';
import { AddEventDialog } from '@/components/calendar/add-event-dialog';
import { WeeklySchedule } from '@/components/calendar/weekly-schedule';
import type { Event } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CalendarPage() {
  const { events, setEvents, scheduleItems, setScheduleItems, locale } = useContext(AppContext);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;

  // Helper to safely parse dates, which are now stored as ISO strings from Firestore
  const parseEventDate = (event: Event): Date => {
    if (typeof event.date === 'string') {
      return parseISO(event.date);
    }
    // This part is for dates that might still be Date objects locally before being saved
    return event.date as Date;
  };

  const selectedDayEvents = date
    ? events.filter(
        (event) => format(parseEventDate(event), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    : [];

  const handleOpenAddDialog = () => {
    setEditingEvent(null);
    setIsAddEventDialogOpen(true);
  };

  const handleOpenEditDialog = (event: Event) => {
    setEditingEvent(event);
    setIsAddEventDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      const updatedEvent: Event = { 
        ...editingEvent, 
        ...eventData,
        date: (eventData.date as Date).toISOString() 
      };
      setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e));
    } else {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...eventData,
        // Store date as ISO string for Firestore compatibility
        date: (eventData.date as Date).toISOString(),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title={t('Calendar', locale)} />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0 sm:p-4 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={dateLocale}
                      components={{
                        DayContent: ({ date }) => {
                          const hasEvent = events.some(
                            (event) => format(parseEventDate(event), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                          );
                          return (
                            <div className="relative h-full w-full flex items-center justify-center">
                              <span>{date.getDate()}</span>
                              {hasEvent && (
                                <Dot className="absolute bottom-0 right-0 h-6 w-6 text-primary" />
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
                          {date ? format(date, "d 'de' MMMM", { locale: dateLocale }) : t('Select a day', locale)}
                        </CardTitle>
                      </div>
                      <Button size="sm" onClick={handleOpenAddDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('Event', locale)}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] lg:h-auto">
                      <div className="space-y-4 pr-4">
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
                                        ? t('At {time}', locale, { time: event.startTime })
                                        : t('All day', locale)}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditDialog(event)}>
                                      <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEvent(event.id)}>
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
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
                                      <p className="font-medium">{t('Guests:', locale)}</p>
                                      <ul className="list-disc list-inside">
                                        {event.guests.map(guest => <li key={guest.email}>{guest.email}</li>)}
                                      </ul>
                                    </div>
                                  </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground h-[200px] flex items-center justify-center">{t('No events for this day.', locale)}</p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </aside>
            </div>
            <WeeklySchedule
              scheduleItems={scheduleItems}
              setScheduleItems={setScheduleItems}
              locale={locale}
            />
          </div>
        </div>
      </div>
      <AddEventDialog
        isOpen={isAddEventDialogOpen}
        onOpenChange={setIsAddEventDialogOpen}
        onSaveEvent={handleSaveEvent}
        selectedDate={date}
        event={editingEvent}
      />
    </>
  );
}
