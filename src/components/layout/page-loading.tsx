'use client';

import { LifeBuoy } from 'lucide-react';

export function PageLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300">
      <div className="relative flex items-center justify-center">
        <LifeBuoy className="h-24 w-24 animate-spin-slow text-primary" />
        <div className="absolute h-16 w-16 bg-transparent rounded-full"></div>
        <LifeBuoy className="h-8 w-8 absolute text-primary" />
      </div>
    </div>
  );
}
