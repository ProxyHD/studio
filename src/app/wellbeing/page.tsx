import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame, Laugh, Meh, Frown, Smile as SmileIcon, Angry } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const moods = [
  { name: 'Feliz', icon: Laugh },
  { name: 'Bem', icon: SmileIcon },
  { name: 'Ok', icon: Meh },
  { name: 'Triste', icon: Frown },
  { name: 'Irritado', icon: Angry },
];

const habits = [
  { name: 'Beber 8 copos de água', goal: 8, current: 6, done: false },
  { name: 'Ler por 30 minutos', goal: 1, current: 1, done: true },
  { name: 'Meditação matinal', goal: 1, current: 0, done: false },
  { name: 'Ir para uma corrida', goal: 1, current: 1, done: true },
];

export default function WellbeingPage() {
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
              <Button key={mood.name} variant="outline" size="lg" className="flex-col h-24 w-24 gap-2">
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
              <div key={habit.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-destructive" />
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <Button variant={habit.done ? "secondary" : "outline"} size="icon">
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
