'use client';

import { useState } from 'react';
import { getRoutineSuggestions } from '@/ai/flows/routine-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Zap, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function RoutineSuggester() {
  const [userData, setUserData] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isPro = true; // Mock value, would come from user session

  const handleGenerate = async () => {
    if (!isPro) {
      toast({
        title: 'Upgrade to Pro',
        description: 'Get personalized routine suggestions with our AI assistant.',
        variant: 'destructive',
      });
      return;
    }

    if (!userData.trim()) {
      toast({
        title: 'Input required',
        description: 'Please describe your goals and habits.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions('');
    try {
      const result = await getRoutineSuggestions({ userData });
      setSuggestions(result.routineSuggestions);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
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
            <CardTitle>Smart Suggestions</CardTitle>
            <Badge variant="outline" className="border-accent text-accent">
                <Zap className="mr-2 h-4 w-4"/>
                Pro
            </Badge>
        </div>
        <CardDescription>Describe your goals and current habits to get an AI-generated routine.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          placeholder="e.g., I want to wake up earlier, exercise 3 times a week, and read more books."
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
          className="flex-grow"
          disabled={!isPro}
        />
        {suggestions && (
          <div className="p-4 bg-muted/50 rounded-md border text-sm prose prose-sm max-w-none">
            <h4 className="font-semibold mb-2">Suggested Routine:</h4>
            <p className="whitespace-pre-wrap">{suggestions}</p>
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
          {isPro ? (isLoading ? 'Generating...' : 'Generate Routine') : 'Upgrade to Generate'}
        </Button>
      </CardFooter>
    </Card>
  );
}
