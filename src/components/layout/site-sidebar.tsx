'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, LayoutDashboard, Notebook, Calendar, Smile, Settings, LogOut, Zap, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-provider';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

interface SiteSidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void; // Callback to close mobile menu
}

export function SiteSidebar({ isMobile = false, onLinkClick }: SiteSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { locale } = useContext(AppContext);

  const navItems = [
    { href: '/dashboard', label: t('Dashboard', locale), icon: LayoutDashboard },
    { href: '/tasks', label: t('Tasks', locale), icon: CheckSquare },
    { href: '/calendar', label: t('Calendar', locale), icon: Calendar },
    { href: '/wellbeing', label: t('Well-being', locale), icon: Smile },
    { href: '/notes', label: t('Notes', locale), icon: Notebook },
  ];

  const proItem = { href: '/upgrade', label: t('Upgrade to Pro', locale), icon: Zap };
  const settingsItem = { href: '/settings', label: t('Settings', locale), icon: Settings };

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };
  
  const handleLogout = () => {
    handleLinkClick();
    logout();
  }

  const sidebarClasses = cn(
    'flex flex-col h-full',
    {
      'md:flex w-64 bg-card border-r fixed': !isMobile,
      'bg-card': isMobile,
    }
  );
  
  const navContainerClasses = cn(
    'hidden',
    {
      'md:flex flex-col': !isMobile
    }
  );

  return (
    <aside className={cn(sidebarClasses, { [navContainerClasses]: !isMobile })}>
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
            >
              <proItem.icon className="mr-2 h-4 w-4" />
              {proItem.label}
            </Button>
          </Link>
      </nav>
      <div className="p-4 mt-auto">
        <Separator className="my-2" />
        <Link href={settingsItem.href} passHref>
            <Button 
                variant={pathname === settingsItem.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={handleLinkClick}
            >
                <settingsItem.icon className="mr-2 h-4 w-4" />
                {settingsItem.label}
            </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('Logout', locale)}
        </Button>
      </div>
    </aside>
  );
}
