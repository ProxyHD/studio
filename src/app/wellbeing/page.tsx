import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame, Laugh, Meh, Frown, Smile as SmileIcon, Angry } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const moods = [
  { name: 'Happy', icon: Laugh },
  { name: 'Good', icon: SmileIcon },
  { name: 'Okay', icon: Meh },
  { name: 'Sad', icon: Frown },
  { name: 'Angry', icon: Angry },
];

const habits = [
  { name: 'Drink 8 glasses of water', goal: 8, current: 6, done: false },
  { name: 'Read for 30 minutes', goal: 1, current: 1, done: true },
  { name: 'Morning meditation', goal: 1, current: 0, done: false },
  { name: 'Go for a run', goal: 1, current: 1, done: true },
];

export default function WellbeingPage() {
  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Well-being" />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>Log your mood to track your well-being over time.</CardDescription>
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
            <CardTitle>Daily Habits</CardTitle>
            <CardDescription>Stay on track with your goals.</CardDescription>
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
