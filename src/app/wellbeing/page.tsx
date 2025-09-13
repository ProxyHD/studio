'use client';

import { useState, useMemo, useContext, useEffect } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame, Laugh, Meh, Frown, Smile as SmileIcon, Angry, PlusCircle, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Habit, MoodLog } from '@/lib/types';
import { AddHabitDialog } from '@/components/wellbeing/add-habit-dialog';
import { WellbeingChart } from '@/components/wellbeing/wellbeing-chart';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { format, subDays, isSameDay } from 'date-fns';

export default function WellbeingPage() {
  const {
    moodLogs,
    setMoodLogs,
    habits,
    setHabits,
    completedHabits,
    setCompletedHabits,
    handleHabitToggle,
    locale,
  } = useContext(AppContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

  const selectedMood = useMemo(() => {
    const todayLog = moodLogs.find(log => log.date === todayISO);
    return todayLog ? todayLog.mood : null;
  }, [moodLogs, todayISO]);

  const moods = [
    { name: t('Happy', locale), icon: Laugh, key: 'Happy' },
    { name: t('Good', locale), icon: SmileIcon, key: 'Good' },
    { name: t('Ok', locale), icon: Meh, key: 'Ok' },
    { name: t('Sad', locale), icon: Frown, key: 'Sad' },
    { name: t('Angry', locale), icon: Angry, key: 'Angry' },
  ];

  const daysOfWeek = useMemo(() => [
    { id: 'sun', name: t('Sunday', locale), short: t('Sun', locale) },
    { id: 'mon', name: t('Monday', locale), short: t('Mon', locale) },
    { id: 'tue', name: t('Tuesday', locale), short: t('Tue', locale) },
    { id: 'wed', name: t('Wednesday', locale), short: t('Wed', locale) },
    { id: 'thu', name: t('Thursday', locale), short: t('Thu', locale) },
    { id: 'fri', name: t('Friday', locale), short: t('Fri', locale) },
    { id: 'sat', name: t('Saturday', locale), short: t('Sat', locale) },
  ], [locale]);

  const dayIndexToId = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = useMemo(() => dayIndexToId[new Date().getDay()], []);
  
  const todaysHabits = habits.filter(habit => habit.days.includes(today));

  const handleOpenAddDialog = () => {
    setEditingHabit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (habit: Habit) => {
    setEditingHabit(habit);
    setIsDialogOpen(true);
  };
  
  const handleSaveHabit = (habitData: Omit<Habit, 'id'>) => {
    if (editingHabit) {
      const updatedHabit: Habit = { ...editingHabit, ...habitData };
      setHabits(habits.map(h => h.id === editingHabit.id ? updatedHabit : h));
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        ...habitData,
      };
      setHabits(prev => [...prev, newHabit]);
    }
    setEditingHabit(null);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletedHabits(prev => prev.filter(ch => ch.habitId !== habitId));
  };
  
  const setSelectedMood = (mood: string) => {
    setMoodLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.date === todayISO);
      const newLog: MoodLog = { date: todayISO, mood };
      if (existingLogIndex > -1) {
        // If the same mood is clicked, unselect it
        if (prevLogs[existingLogIndex].mood === mood) {
          return prevLogs.filter((_, index) => index !== existingLogIndex);
        }
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = newLog;
        return updatedLogs;
      } else {
        return [...prevLogs, newLog];
      }
    });
  };

  const completedHabitsToday = useMemo(() => 
    new Set(completedHabits.filter(ch => ch.date === todayISO).map(ch => ch.habitId)), 
    [completedHabits, todayISO]
  );
  
  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title={t('Well-being', locale)} />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('How are you feeling today?', locale)}</CardTitle>
                <CardDescription>{t('Log your mood to track your well-being over time.', locale)}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                {moods.map(mood => (
                  <Button
                    key={mood.key}
                    variant={selectedMood === mood.key ? 'secondary' : 'outline'}
                    size="lg"
                    className="flex-col h-20 w-20 sm:h-24 sm:w-24 gap-2"
                    onClick={() => setSelectedMood(mood.key)}
                  >
                    <mood.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    <span className="text-xs sm:text-base">{mood.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
            <WellbeingChart />
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>{t('Weekly Habits', locale)}</CardTitle>
                  <CardDescription>{t('Create and track your habits for each day of the week.', locale)}</CardDescription>
                </div>
                <Button onClick={handleOpenAddDialog} className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('Add Habit', locale)}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="font-semibold text-lg">{t('Today\'s Habits ({day})', locale, { day: daysOfWeek.find(d => d.id === today)?.name || '' })}</h3>
              {todaysHabits.length > 0 ? (
                todaysHabits.map(habit => {
                  const isDone = completedHabitsToday.has(habit.id);
                  return (
                    <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className={cn("flex items-center gap-3", isDone && "text-muted-foreground line-through")}>
                        <Flame className={cn("h-5 w-5", isDone ? "text-muted-foreground" : "text-primary")} />
                        <span className="font-medium">{habit.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Button
                          variant={isDone ? "secondary" : "outline"}
                          size="icon"
                          onClick={() => handleHabitToggle(habit.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
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
                        <div className="flex gap-1 sm:gap-2 mt-2 flex-wrap">
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
                       <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(habit)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteHabit(habit.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
        onSaveHabit={handleSaveHabit}
        habit={editingHabit}
      />
    </>
  );
}
