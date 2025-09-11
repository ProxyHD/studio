'use client';

import { useState, useContext, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Menu, Search, CheckSquare, Notebook, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
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
import { useDebounce } from 'use-debounce';

interface SiteHeaderProps {
  title: string;
}

export function SiteHeader({ title }: SiteHeaderProps) {
  const { locale, tasks, notes, events } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const userAvatarPlaceholder = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const { user, logout } = useAuth();
  
  const userAvatar = user?.photoURL || userAvatarPlaceholder?.imageUrl;

  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery) {
      return { tasks: [], notes: [], events: [] };
    }
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(lowercasedQuery));
    const filteredNotes = notes.filter(note => note.title.toLowerCase().includes(lowercasedQuery) || note.content.toLowerCase().includes(lowercasedQuery));
    const filteredEvents = events.filter(event => event.title.toLowerCase().includes(lowercasedQuery));
    return { tasks: filteredTasks, notes: filteredNotes, events: filteredEvents };
  }, [debouncedSearchQuery, tasks, notes, events]);
  
  const hasResults = searchResults.tasks.length > 0 || searchResults.notes.length > 0 || searchResults.events.length > 0;

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [debouncedSearchQuery]);

  const handleResultClick = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(path);
  }

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
        <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DropdownMenuTrigger asChild>
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('Search...', locale)}
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (debouncedSearchQuery) setIsSearchOpen(true); }}
              />
            </div>
          </DropdownMenuTrigger>
          {hasResults && (
            <DropdownMenuContent className="w-[300px] lg:w-[300px]" align="start">
              {searchResults.tasks.length > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center gap-2"><CheckSquare className="h-4 w-4" /> {t('Tasks', locale)}</DropdownMenuLabel>
                  {searchResults.tasks.map(task => (
                    <DropdownMenuItem key={task.id} onSelect={() => handleResultClick('/tasks')}>
                      {task.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}
              {searchResults.notes.length > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center gap-2"><Notebook className="h-4 w-4" /> {t('Notes', locale)}</DropdownMenuLabel>
                  {searchResults.notes.map(note => (
                    <DropdownMenuItem key={note.id} onSelect={() => handleResultClick('/notes')}>
                      {note.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}
               {searchResults.events.length > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> {t('Events', locale)}</DropdownMenuLabel>
                  {searchResults.events.map(event => (
                    <DropdownMenuItem key={event.id} onSelect={() => handleResultClick('/calendar')}>
                      {event.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Alternar notificações</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {userAvatar && (
                <Image
                  src={userAvatar}
                  width={36}
                  height={36}
                  alt="Avatar do Usuário"
                  data-ai-hint={userAvatarPlaceholder?.imageHint}
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
            <DropdownMenuItem asChild>
              <a href="mailto:support@lifehub.com">{t('Support', locale)}</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>{t('Logout', locale)}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
