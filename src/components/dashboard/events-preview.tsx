'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { format, isToday, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

export function EventsPreview() {
  const { events, locale } = useContext(AppContext);

  const todayEvents = events.filter(event => {
    const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
    return isToday(eventDate);
  }).slice(0, 3); // Show max 3 events

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t('Today\'s Events', locale)}</CardTitle>
        <CardDescription>{t('Your schedule for the day.', locale)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[220px]">
          <div className="space-y-3 pr-4">
            {todayEvents.length > 0 ? (
              todayEvents.map(event => (
                <div key={event.id} className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.startTime && event.endTime
                        ? `${event.startTime} - ${event.endTime}`
                        : event.startTime
                        ? t('At {time}', locale, { time: event.startTime })
                        : t('All day', locale)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full py-8">
                <p className="text-sm text-muted-foreground">{t('No events for today.', locale)}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/calendar">
            {t('Go to Calendar', locale)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
