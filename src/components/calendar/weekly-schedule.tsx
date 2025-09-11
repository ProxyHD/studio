'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Clock, MapPin } from 'lucide-react';
import type { DayOfWeek, ScheduleItem } from '@/lib/types';
import { AddScheduleItemDialog } from './add-schedule-item-dialog';
import { t } from '@/lib/translations';

interface WeeklyScheduleProps {
  scheduleItems: ScheduleItem[];
  setScheduleItems: (items: ScheduleItem[] | ((prev: ScheduleItem[]) => ScheduleItem[])) => void;
  locale: 'pt-BR' | 'en-US';
}

export function WeeklySchedule({ scheduleItems, setScheduleItems, locale }: WeeklyScheduleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const daysOfWeek: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const dayNames = {
    mon: t('Monday', locale),
    tue: t('Tuesday', locale),
    wed: t('Wednesday', locale),
    thu: t('Thursday', locale),
    fri: t('Friday', locale),
    sat: t('Saturday', locale),
    sun: t('Sunday', locale),
  };

  const groupedItems = useMemo(() => {
    const group: Record<DayOfWeek, ScheduleItem[]> = {
      mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
    };
    scheduleItems.forEach(item => {
      group[item.dayOfWeek].push(item);
    });
    // Sort items within each day by start time
    for (const day in group) {
      group[day as DayOfWeek].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return group;
  }, [scheduleItems]);

  const addScheduleItem = (itemData: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      id: crypto.randomUUID(),
      ...itemData,
    };
    setScheduleItems(prev => [...prev, newItem]);
  };

  const deleteScheduleItem = (itemId: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('Weekly Schedule', locale)}</CardTitle>
              <CardDescription>{t('Your recurring weekly timetable.', locale)}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('Add to Schedule', locale)}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {daysOfWeek.map(day => (
              <div key={day} className="p-3 bg-muted/50 rounded-lg space-y-3">
                <h3 className="font-semibold text-center">{dayNames[day]}</h3>
                <div className="space-y-2">
                  {groupedItems[day].length > 0 ? (
                    groupedItems[day].map(item => (
                      <div key={item.id} className="p-2 bg-card rounded-md shadow-sm text-sm">
                        <div className="flex justify-between items-start">
                          <p className="font-medium flex-1 truncate pr-2">{item.title}</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => deleteScheduleItem(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-muted-foreground mt-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span>{item.startTime} - {item.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center pt-4">{t('No items scheduled.', locale)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <AddScheduleItemDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddItem={addScheduleItem}
      />
    </>
  );
}
