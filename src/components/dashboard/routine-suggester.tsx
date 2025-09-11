'use client';

import { useState, useContext } from 'react';
import { getSmartSuggestions } from '@/ai/flows/smart-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Zap, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import type { Task, Habit, Note } from '@/lib/types';

export function RoutineSuggester() {
  const { locale, setTasks, setHabits, setNotes, setNewItemBadge } = useContext(AppContext);
  const [userData, setUserData] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isPro = true; // Mock value, would come from user session

  const handleGenerate = async () => {
    if (!isPro) {
      toast({
        title: t('Upgrade to Pro', locale),
        description: t('Describe your goals and current habits to get an AI-generated routine.', locale),
        variant: 'destructive',
      });
      return;
    }

    if (!userData.trim()) {
      toast({
        title: t('Description', locale),
        description: t('Describe your goals and current habits to get an AI-generated routine.', locale),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestionText('');
    try {
      const result = await getSmartSuggestions({ userData, locale });
      setSuggestionText(result.suggestionText);
      
      let createdItemsMessage = '';

      if (result.createdTasks && result.createdTasks.length > 0) {
        const newTasks: Task[] = result.createdTasks.map(task => ({
            id: crypto.randomUUID(),
            status: 'todo',
            ...task
        }));
        setTasks(prev => [...prev, ...newTasks]);
        setNewItemBadge('tasks');
        createdItemsMessage += `${newTasks.length} ${t('task(s) created', locale)}. `;
      }

      if (result.createdHabits && result.createdHabits.length > 0) {
        const newHabits: Habit[] = result.createdHabits.map(habit => ({
            id: crypto.randomUUID(),
            ...habit
        }));
        setHabits(prev => [...prev, ...newHabits]);
        setNewItemBadge('wellbeing');
        createdItemsMessage += `${newHabits.length} ${t('habit(s) created', locale)}. `;
      }
      
      if (result.createdNotes && result.createdNotes.length > 0) {
        const newNotes: Note[] = result.createdNotes.map(note => ({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...note
        }));
        setNotes(prev => [...prev, ...newNotes]);
        setNewItemBadge('notes');
        createdItemsMessage += `${newNotes.length} ${t('note(s) created', locale)}. `;
      }
      
      if(createdItemsMessage) {
        toast({
            title: t('Success', locale),
            description: createdItemsMessage.trim(),
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: t('Error', locale),
        description: t('Failed to generate suggestions. Please try again.', locale),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>{t('Smart Suggestions', locale)}</CardTitle>
            <Badge variant="outline" className="border-accent text-accent">
                <Zap className="mr-2 h-4 w-4"/>
                {t('Pro', locale)}
            </Badge>
        </div>
        <CardDescription>{t('Ask for suggestions or ask to create tasks, habits, and notes.', locale)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          placeholder={t('ex: Create a high priority task to call the doctor tomorrow.', locale)}
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
          className="flex-grow"
          disabled={!isPro}
        />
        {suggestionText && (
          <div className="p-4 bg-muted/50 rounded-md border text-sm prose prose-sm max-w-none">
            <h4 className="font-semibold mb-2">{t('AI Response:', locale)}</h4>
            <p className="whitespace-pre-wrap">{suggestionText}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} className="w-full" disabled={isLoading || !isPro}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isPro ? (
            <Sparkles className="mr-2 h-4 w-4" />
          ) : (
            <Lock className="mr-2 h-4 w-4" />
          )}
          {isPro ? (isLoading ? t('Generating...', locale) : t('Generate with AI', locale)) : t('Upgrade to Generate', locale)}
        </Button>
      </CardFooter>
    </Card>
  );
}
