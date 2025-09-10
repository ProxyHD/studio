import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import RootLayoutClient from './layout-client';
import { ThemeProvider } from '@/context/theme-provider';

export const metadata: Metadata = {
  title: 'LifeHub',
  description: 'Sua vida, organizada.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <RootLayoutClient>{children}</RootLayoutClient>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
