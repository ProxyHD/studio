'use client';

import { SiteHeader } from '@/components/layout/site-header';
import { ThemeForm } from '@/components/settings/theme-form';

export default function SettingsPage() {

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Configurações" />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <ThemeForm />
      </div>
    </div>
  );
}
