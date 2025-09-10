'use client';

import { useContext } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { AppContext } from '@/context/app-provider';
import { ProfileForm } from '@/components/settings/profile-form';
import type { UserProfile } from '@/lib/types';

export default function SettingsPage() {
  const { loading, profile, setProfile } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Configurações" />
      <div className="flex-1 p-4 pt-6 md:p-8">
        {loading || !profile ? (
          <div className="flex items-center justify-center h-full">
            <p>Carregando perfil...</p>
          </div>
        ) : (
          <ProfileForm profile={profile} onSave={setProfile} />
        )}
      </div>
    </div>
  );
}
