'use client';

import { LifeBuoy } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
      <div className="relative flex items-center justify-center">
        <LifeBuoy className="h-24 w-24 animate-spin-slow" />
        <div className="absolute h-16 w-16 bg-background rounded-full"></div>
         <LifeBuoy className="h-8 w-8 absolute" />
      </div>
      <p className="mt-4 text-lg font-semibold tracking-widest uppercase">LifeHub</p>
      <p className="text-sm text-muted-foreground">Sua vida, organizada.</p>
    </div>
  );
}
