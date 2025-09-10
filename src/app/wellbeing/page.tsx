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

const moods = [
  { name: 'Feliz', icon: Laugh },
  { name: 'Bem', icon: SmileIcon },
  { name: 'Ok', icon: Meh },
  { name: 'Triste', icon: Frown },
  { name: 'Irritado', icon: Angry },
];

const daysOfWeek = [
  { id: 'seg', name: 'Segunda' },
  { id: 'ter', name: 'Terça' },
  { id: 'qua', name: 'Quarta' },
  { id: 'qui', name: 'Quinta' },
  { id: 'sex', name: 'Sexta' },
  { id: 'sab', name: 'Sábado' },
  { id: 'dom', name: 'Domingo' },
];

const dayIndexToId = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

export default function WellbeingPage() {
  const {
    selectedMood,
    setSelectedMood,
    habits,
    setHabits,
    completedHabits,
    setCompletedHabits,
  } = useContext(AppContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
    });
  };

  const handleHabitToggle = (habitId: string) => {
    setCompletedHabits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title="Bem-estar" />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Como você está se sentindo hoje?</CardTitle>
              <CardDescription>Registre seu humor para acompanhar seu bem-estar ao longo do tempo.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {moods.map(mood => (
                <Button 
                  key={mood.name} 
                  variant={selectedMood === mood.name ? 'secondary' : 'outline'}
                  size="lg" 
                  className="flex-col h-24 w-24 gap-2"
                  onClick={() => setSelectedMood(mood.name)}
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
                  <CardTitle>Hábitos da Semana</CardTitle>
                  <CardDescription>Crie e acompanhe seus hábitos para cada dia da semana.</CardDescription>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Hábito
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="font-semibold text-lg">Hábitos de Hoje ({daysOfWeek.find(d => d.id === today)?.name})</h3>
              {todaysHabits.length > 0 ? (
                todaysHabits.map(habit => {
                  const isDone = completedHabits.has(habit.id);
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
                 <p className="text-sm text-muted-foreground">Nenhum hábito para hoje. Adicione um novo!</p>
              )}

              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Todos os Hábitos</h3>
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
                              {day.name.substring(0, 3)}
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
                    <p className="text-sm text-muted-foreground">Você ainda não criou nenhum hábito.</p>
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
