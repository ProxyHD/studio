import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteSidebar } from '@/components/layout/site-sidebar';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'LifeFlow',
  description: 'Your life, organized.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <div className="relative flex min-h-screen">
          <SiteSidebar />
          <div className="flex-1 md:pl-64">
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
