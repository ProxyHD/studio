'use client';

import { SiteHeader } from '@/components/layout/site-header';
import { ThemeForm } from '@/components/settings/theme-form';
import { ColorForm } from '@/components/settings/color-form';
import { LanguageForm } from '@/components/settings/language-form';

export default function SettingsPage() {

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Configurações" />
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
