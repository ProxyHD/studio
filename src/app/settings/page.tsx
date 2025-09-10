'use client';

import { useContext } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeForm } from '@/components/settings/theme-form';
import { ColorForm } from '@/components/settings/color-form';
import { LanguageForm } from '@/components/settings/language-form';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function SettingsPage() {
  const { locale } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title={t('Settings', locale)} />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <LanguageForm />
          <ThemeForm />
          <ColorForm />
        </div>
      </div>
    </div>
  );
}
