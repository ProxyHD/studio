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
        title: 'Faça upgrade para o Pro',
        description: 'Obtenha sugestões de rotina personalizadas com nosso assistente de IA.',
        variant: 'destructive',
      });
      return;
    }

    if (!userData.trim()) {
      toast({
        title: 'Entrada necessária',
        description: 'Por favor, descreva seus objetivos e hábitos.',
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
        title: 'Erro',
        description: 'Falha ao gerar sugestões. Por favor, tente novamente.',
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
            <CardTitle>Sugestões Inteligentes</CardTitle>
            <Badge variant="outline" className="border-accent text-accent">
                <Zap className="mr-2 h-4 w-4"/>
                Pro
            </Badge>
        </div>
        <CardDescription>Descreva seus objetivos e hábitos atuais para obter uma rotina gerada por IA.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          placeholder="ex: Eu quero acordar mais cedo, me exercitar 3 vezes por semana e ler mais livros."
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
          className="flex-grow"
          disabled={!isPro}
        />
        {suggestions && (
          <div className="p-4 bg-muted/50 rounded-md border text-sm prose prose-sm max-w-none">
            <h4 className="font-semibold mb-2">Rotina Sugerida:</h4>
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
          {isPro ? (isLoading ? 'Gerando...' : 'Gerar Rotina') : 'Faça Upgrade para Gerar'}
        </Button>
      </CardFooter>
    </Card>
  );
}
