'use client';

import { useContext } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function FinancesPage() {
  const { locale } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title={t('Finances', locale)} />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>{t('Financial Control', locale)}</CardTitle>
                <CardDescription>{t('This section is under construction.', locale)}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{t('Soon you will be able to manage your finances here.', locale)}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
