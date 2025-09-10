
'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame, Laugh, Meh, Frown, Smile as SmileIcon, Angry } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const moods = [
  { name: 'Feliz', icon: Laugh },
  { name: 'Bem', icon: SmileIcon },
  { name: 'Ok', icon: Meh },
  { name: 'Triste', icon: Frown },
  { name: 'Irritado', icon: Angry },
];

const initialHabits = [
  { id: '1', name: 'Beber 8 copos de água', goal: 8, current: 0, done: false },
  { id: '2', name: 'Ler por 30 minutos', goal: 1, current: 0, done: false },
  { id: '3', name: 'Meditação matinal', goal: 1, current: 0, done: false },
  { id: '4', name: 'Ir para uma corrida', goal: 1, current: 0, done: false },
];

export default function WellbeingPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [habits, setHabits] = useState(initialHabits);

  const handleHabitToggle = (habitId: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newDoneState = !habit.done;
          return {
            ...habit,
            done: newDoneState,
            current: newDoneState ? habit.goal : 0,
          };
        }
        return habit;
      })
    );
  };


  return (
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
            <CardTitle>Hábitos Diários</CardTitle>
            <CardDescription>Mantenha-se no caminho certo com seus objetivos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {habits.map(habit => (
              <div key={habit.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={cn("flex items-center gap-2", habit.done && "text-muted-foreground line-through")}>
                    <Flame className={cn("h-5 w-5", habit.done ? "text-muted-foreground" : "text-destructive")} />
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <Button 
                    variant={habit.done ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => handleHabitToggle(habit.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={(habit.current / habit.goal) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
