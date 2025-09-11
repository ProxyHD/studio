'use client';

import { useContext, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Flame } from 'lucide-react';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import type { DayOfWeek } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export function HabitsPreview() {
  const { habits, completedHabits, handleHabitToggle, locale } = useContext(AppContext);

  const dayIndexToId: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = useMemo(() => dayIndexToId[new Date().getDay()], []);
  
  const todaysHabits = habits.filter(habit => habit.days.includes(today)).slice(0, 4);

  const todayISO = new Date().toISOString().split('T')[0];
  const completedHabitsToday = useMemo(() => 
    new Set(completedHabits.filter(ch => ch.date === todayISO).map(ch => ch.habitId)), 
    [completedHabits, todayISO]
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t('Today\'s Habits', locale)}</CardTitle>
        <CardDescription>{t('Your habits for today.', locale)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[220px]">
          <div className="space-y-3 pr-4">
            {todaysHabits.length > 0 ? (
              todaysHabits.map(habit => {
                const isDone = completedHabitsToday.has(habit.id);
                return (
                  <div key={habit.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div className={cn("flex items-center gap-3", isDone && "text-muted-foreground line-through")}>
                      <Flame className={cn("h-5 w-5", isDone ? "text-muted-foreground" : "text-primary")} />
                      <span className="font-medium">{habit.name}</span>
                    </div>
                    <Button
                      variant={isDone ? "secondary" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleHabitToggle(habit.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full py-8">
                <p className="text-sm text-muted-foreground">{t('No habits for today. Add a new one!', locale)}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/wellbeing">
            {t('View All Habits', locale)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
