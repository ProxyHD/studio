
'use client';

import { useState, useContext } from 'react';
import { getSmartSuggestions } from '@/ai/flows/smart-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import type { Task, Habit, Note, Event, ScheduleItem, Transaction } from '@/lib/types';

export function RoutineSuggester() {
  const { 
    locale, 
    profile,
    setTasks, 
    setHabits, 
    setNotes, 
    setEvents,
    setScheduleItems,
    setTransactions,
    setNewItemBadge 
  } = useContext(AppContext);
  const [userData, setUserData] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isProUser = profile?.plan?.toLowerCase() === 'pro';

  const handleGenerate = async () => {
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

      if (result.createdEvents && result.createdEvents.length > 0) {
        const newEvents: Event[] = result.createdEvents.map(event => ({
            id: crypto.randomUUID(),
            ...event
        }));
        setEvents(prev => [...prev, ...newEvents]);
        setNewItemBadge('calendar');
        createdItemsMessage += `${newEvents.length} ${t('event(s) created', locale)}. `;
      }
      
      if (result.createdScheduleItems && result.createdScheduleItems.length > 0) {
        const newScheduleItems: ScheduleItem[] = result.createdScheduleItems.map(item => ({
            id: crypto.randomUUID(),
            ...item
        }));
        setScheduleItems(prev => [...prev, ...newScheduleItems]);
        setNewItemBadge('calendar');
        createdItemsMessage += `${newScheduleItems.length} ${t('schedule item(s) created', locale)}. `;
      }

      if (result.createdTransactions && result.createdTransactions.length > 0) {
        const newTransactions: Transaction[] = result.createdTransactions.map(item => ({
            id: crypto.randomUUID(),
            ...item
        }));
        setTransactions(prev => [...prev, ...newTransactions]);
        setNewItemBadge('finances');
        createdItemsMessage += `${newTransactions.length} ${t('transaction(s) created', locale)}. `;
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
    <Card className="h-full flex flex-col relative">
      <CardHeader>
        <CardTitle>{t('Smart Suggestions', locale)}</CardTitle>
        <CardDescription>{t('Ask for suggestions or ask to create tasks, habits, and notes.', locale)}</CardDescription>
      </CardHeader>
      <fieldset disabled={!isProUser} className="group flex-grow flex flex-col gap-4">
        <CardContent className="flex-grow flex flex-col gap-4">
          <Textarea
            placeholder={t('ex: Create a high priority task to call the doctor tomorrow.', locale)}
            value={userData}
            onChange={(e) => setUserData(e.target.value)}
            className="flex-grow"
          />
          {suggestionText && (
            <div className="p-4 bg-muted/50 rounded-md border text-sm prose prose-sm max-w-none">
              <h4 className="font-semibold mb-2">{t('AI Response:', locale)}</h4>
              <p className="whitespace-pre-wrap">{suggestionText}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? t('Generating...', locale) : t('Generate with AI', locale)}
          </Button>
        </CardFooter>
      </fieldset>
      {!isProUser && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg cursor-not-allowed">
            <div className="text-center p-4">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">{t('Upgrade to Pro', locale)}</p>
                <p className="text-sm text-muted-foreground">{t('Unlock AI-powered suggestions!', locale)}</p>
            </div>
        </div>
      )}
    </Card>
  );
}
