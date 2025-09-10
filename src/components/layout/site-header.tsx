'use client';

import { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/context/auth-provider';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { SiteSidebar } from './site-sidebar';

interface SiteHeaderProps {
  title: string;
}

export function SiteHeader({ title }: SiteHeaderProps) {
  const { locale } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-20 px-4 md:px-8 border-b bg-card">
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
             <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Main navigation links for the application.</SheetDescription>
            </SheetHeader>
            {/* Pass a function to close the menu on item click */}
            <SiteSidebar onLinkClick={() => setIsMobileMenuOpen(false)} isMobile />
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('Search...', locale)}
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Alternar notificações</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {userAvatar && (
                <Image
                  src={userAvatar.imageUrl}
                  width={36}
                  height={36}
                  alt="Avatar do Usuário"
                  data-ai-hint={userAvatar.imageHint}
                  className="rounded-full"
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('My Account', locale)}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">{t('Settings', locale)}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>{t('Support', locale)}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>{t('Logout', locale)}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
