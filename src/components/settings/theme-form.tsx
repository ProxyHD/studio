'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeForm() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>
            Selecione o tema para a aparência do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="h-24 flex-col gap-2"
            >
              <Sun className="h-6 w-6" />
              Claro
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="h-24 flex-col gap-2"
            >
              <Moon className="h-6 w-6" />
              Escuro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
