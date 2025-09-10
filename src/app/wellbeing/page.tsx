'use client';

import { useState, useMemo, useContext } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame, Laugh, Meh, Frown, Smile as SmileIcon, Angry, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Habit } from '@/lib/types';
import { AddHabitDialog } from '@/components/wellbeing/add-habit-dialog';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function WellbeingPage() {
  const {
    selectedMood,
    setSelectedMood,
    habits,
    setHabits,
    completedHabits,
    setCompletedHabits,
    locale,
  } = useContext(AppContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const moods = [
    { name: t('Happy', locale), icon: Laugh, key: 'Happy' },
    { name: t('Good', locale), icon: SmileIcon, key: 'Good' },
    { name: t('Ok', locale), icon: Meh, key: 'Ok' },
    { name: t('Sad', locale), icon: Frown, key: 'Sad' },
    { name: t('Angry', locale), icon: Angry, key: 'Angry' },
  ];

  const daysOfWeek = useMemo(() => [
    { id: 'seg', name: t('Monday', locale), short: t('Mon', locale) },
    { id: 'ter', name: t('Tuesday', locale), short: t('Tue', locale) },
    { id: 'qua', name: t('Wednesday', locale), short: t('Wed', locale) },
    { id: 'qui', name: t('Thursday', locale), short: t('Thu', locale) },
    { id: 'sex', name: t('Friday', locale), short: t('Fri', locale) },
    { id: 'sab', name: t('Saturday', locale), short: t('Sat', locale) },
    { id: 'dom', name: t('Sunday', locale), short: t('Sun', locale) },
  ], [locale]);

  const dayIndexToId = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  
  const today = useMemo(() => {
    const todayIndex = new Date().getDay();
    return dayIndexToId[todayIndex];
  }, []);

  const todaysHabits = habits.filter(habit => habit.days.includes(today));

  const addHabit = (habitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      ...habitData,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletedHabits(prev => {
        const newCompleted = new Set(prev);
        newCompleted.delete(habitId);
        return Array.from(newCompleted); // Convert back to array for Firestore
    });
  };

  const handleHabitToggle = (habitId: string) => {
    setCompletedHabits(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(habitId)) {
        newCompleted.delete(habitId);
      } else {
        newCompleted.add(habitId);
      }
      return Array.from(newCompleted); // Convert to array for Firestore
    });
  };
  
  const completedHabitsSet = useMemo(() => new Set(completedHabits), [completedHabits]);

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title={t('Well-being', locale)} />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('How are you feeling today?', locale)}</CardTitle>
              <CardDescription>{t('Log your mood to track your well-being over time.', locale)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {moods.map(mood => (
                <Button 
                  key={mood.key} 
                  variant={selectedMood === mood.key ? 'secondary' : 'outline'}
                  size="lg" 
                  className="flex-col h-24 w-24 gap-2"
                  onClick={() => setSelectedMood(mood.key)}
                >
                  <mood.icon className="h-8 w-8" />
                  <span>{mood.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('Weekly Habits', locale)}</CardTitle>
                  <CardDescription>{t('Create and track your habits for each day of the week.', locale)}</CardDescription>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('Add Habit', locale)}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="font-semibold text-lg">{t('Today\'s Habits ({day})', locale, { day: daysOfWeek.find(d => d.id === today)?.name || '' })}</h3>
              {todaysHabits.length > 0 ? (
                todaysHabits.map(habit => {
                  const isDone = completedHabitsSet.has(habit.id);
                  return (
                    <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className={cn("flex items-center gap-3", isDone && "text-muted-foreground line-through")}>
                        <Flame className={cn("h-5 w-5", isDone ? "text-muted-foreground" : "text-primary")} />
                        <span className="font-medium">{habit.name}</span>
                      </div>
                      <Button 
                        variant={isDone ? "secondary" : "outline"}
                        size="icon"
                        onClick={() => handleHabitToggle(habit.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                 <p className="text-sm text-muted-foreground">{t('No habits for today. Add a new one!', locale)}</p>
              )}

              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">{t('All Habits', locale)}</h3>
                <div className="space-y-2">
                  {habits.map(habit => (
                    <div key={habit.id} className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <div className="flex gap-2 mt-2">
                          {daysOfWeek.map(day => (
                            <span key={day.id} className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              habit.days.includes(day.id) ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              {day.short}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteHabit(habit.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {habits.length === 0 && (
                    <p className="text-sm text-muted-foreground">{t('You haven\'t created any habits yet.', locale)}</p>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
      <AddHabitDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddHabit={addHabit}
      />
    </>
  );
}
