'use client';

import { useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AppContext } from '@/context/app-provider';
import type { Locale } from '@/lib/types';

export function LanguageForm() {
  const { locale, setLocale } = useContext(AppContext);

  const handleLocaleChange = (value: string) => {
    setLocale(value as Locale);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Idioma e Região</CardTitle>
        <CardDescription>
          Altere o idioma e a moeda do aplicativo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="language">Idioma</Label>
          <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger id="language" className="w-[180px]">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (United States)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
