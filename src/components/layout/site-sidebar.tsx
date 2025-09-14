'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, LayoutDashboard, Notebook, Calendar, Smile, Settings, LogOut, LifeBuoy, Wallet, Megaphone, Zap } from 'lucide-react';
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
  const { locale, newItems, clearNewItemBadge } = useContext(AppContext);

  const navGroups = [
    {
      title: t('Main', locale),
      items: [
        { href: '/dashboard', label: t('Dashboard', locale), icon: LayoutDashboard, badgeKey: 'dashboard' },
        { href: '/tasks', label: t('Tasks', locale), icon: CheckSquare, badgeKey: 'tasks' },
        { href: '/calendar', label: t('Calendar', locale), icon: Calendar, badgeKey: 'calendar' },
      ]
    },
    {
      title: t('Tools', locale),
      items: [
        { href: '/wellbeing', label: t('Well-being', locale), icon: Smile, badgeKey: 'wellbeing' },
        { href: '/notes', label: t('Notes', locale), icon: Notebook, badgeKey: 'notes' },
        { href: '/finances', label: t('Finances', locale), icon: Wallet, badgeKey: 'finances' },
        { href: '/news', label: t('News', locale), icon: Megaphone, badgeKey: 'news' },
      ]
    }
  ];

  const settingsItem = { href: '/settings', label: t('Settings', locale), icon: Settings };
  const upgradeItem = { href: '/upgrade', label: t('Upgrade to Pro', locale), icon: Zap };

  const handleLinkClick = (key?: keyof typeof newItems) => {
    if (key) {
      clearNewItemBadge(key);
    }
    if (onLinkClick) {
      onLinkClick();
    }
  };
  
  const handleLogout = () => {
    if (onLinkClick) onLinkClick();
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
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => handleLinkClick('dashboard')}>
          <LifeBuoy className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">LifeHub</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h2 className="px-2 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{group.title}</h2>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start relative"
                    onClick={() => handleLinkClick(item.badgeKey as keyof typeof newItems)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                    {newItems[item.badgeKey as keyof typeof newItems] && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 mt-auto">
        <Link href={upgradeItem.href} passHref>
          <Button
            variant="outline"
            className="w-full justify-center mb-2"
            onClick={() => handleLinkClick()}
          >
            <upgradeItem.icon className="mr-2 h-4 w-4 text-yellow-500" />
            {upgradeItem.label}
          </Button>
        </Link>
        <Separator className="my-2" />
        <Link href={settingsItem.href} passHref>
            <Button 
                variant={pathname === settingsItem.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handleLinkClick()}
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
