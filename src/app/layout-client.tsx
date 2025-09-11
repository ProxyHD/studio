'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SiteSidebar } from '@/components/layout/site-sidebar';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { PageLoading } from '@/components/layout/page-loading';
import { AppProvider } from '@/context/app-provider';
import { AuthProvider } from '@/context/auth-provider';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const showSidebar = !['/', '/register'].includes(pathname);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 segundos de tela de carregamento inicial

    return () => clearTimeout(timer);
  }, []);

  // Effect to handle page transition loading
  useEffect(() => {
    // We don't want to show the page loader on the initial load
    if (isLoading) return;

    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500); // Meio segundo de loading entre páginas

    return () => clearTimeout(timer);
  }, [pathname, isLoading]);


  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <AppProvider>
        {isPageLoading && <PageLoading />}
        {showSidebar ? (
          <div className="flex min-h-screen">
            <SiteSidebar />
            <main className="flex-1 md:pl-64">
              {children}
            </main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </AppProvider>
    </AuthProvider>
  );
}
