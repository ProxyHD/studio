'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, LayoutDashboard, Notebook, Calendar, Smile, Gem, Settings, LogOut, Zap, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/wellbeing', label: 'Well-being', icon: Smile },
  { href: '/notes', label: 'Notes', icon: Notebook },
];

const proItem = { href: '/upgrade', label: 'Upgrade to Pro', icon: Zap };

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r fixed h-screen">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LifeBuoy className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">LifeHub</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
        <Link href={proItem.href} passHref>
            <Button
              variant={pathname === proItem.href ? 'default' : 'ghost'}
              className={cn("w-full justify-start", pathname !== proItem.href && "text-primary hover:bg-primary/10 hover:text-primary")}
            >
              <proItem.icon className="mr-2 h-4 w-4" />
              {proItem.label}
            </Button>
          </Link>
      </nav>
      <div className="p-4 mt-auto">
        <Separator className="my-2" />
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Link>
        </Button>
      </div>
    </aside>
  );
}
