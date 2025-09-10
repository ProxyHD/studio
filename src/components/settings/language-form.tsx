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
import { t } from '@/lib/translations';

export function LanguageForm() {
  const { locale, setLocale } = useContext(AppContext);

  const handleLocaleChange = (value: string) => {
    setLocale(value as Locale);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Language and Region', locale)}</CardTitle>
        <CardDescription>
          {t('Change the application language and currency.', locale)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="language">{t('Language', locale)}</Label>
          <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger id="language" className="w-[220px]">
              <SelectValue placeholder={t('Select language', locale)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">{t('Portuguese (Brazil)', locale)}</SelectItem>
              <SelectItem value="en-US">{t('English (United States)', locale)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
