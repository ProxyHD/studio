'use client';

import { usePathname } from 'next/navigation';
import { SiteSidebar } from '@/components/layout/site-sidebar';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !['/', '/register'].includes(pathname);

  return (
    <>
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
    </>
  );
}
