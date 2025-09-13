'use client';

import { useState, useEffect, useContext } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Note } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlusCircle, Sparkles, Loader2, Trash2, Pencil, Share2, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { summarizeNotes } from '@/ai/flows/summarize-notes';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function NotesPage() {
  const { notes, setNotes, locale } = useContext(AppContext);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const { toast } = useToast();
  const isPro = true; // Mock value

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (filteredNotes.length > 0 && !selectedNote) {
      // On desktop, select the first note by default
      if (window.innerWidth >= 768) {
        setSelectedNote(filteredNotes[0]);
      }
    } else if (filteredNotes.length === 0) {
      setSelectedNote(null);
    }
  }, [notes, selectedNote, filteredNotes]);

  const handleNoteChange = (key: 'title' | 'content', value: string) => {
    if (selectedNote) {
      const newNote = { ...selectedNote, [key]: value };
      setSelectedNote(newNote);
      setNotes(notes.map(n => n.id === newNote.id ? newNote : n));
    }
  };

  const handleAddNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: t('New Note', locale),
      content: '',
      createdAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };
  
  const handleDeleteNote = (noteId: string) => {
    const newNotes = notes.filter(n => n.id !== noteId);
    setNotes(newNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(newNotes[0] || null);
    }
  };

  const handleSummarize = async () => {
    if (!selectedNote || !isPro) return;

    setIsSummaryLoading(true);
    setSummary('');
    try {
      const result = await summarizeNotes({ notes: selectedNote.content });
      setSummary(result.summary);
      setIsSummaryDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast({
        title: t('Error', locale),
        description: t('Failed to generate summary. Please try again.', locale),
        variant: 'destructive',
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedNote) return;

    const shareData = {
      title: selectedNote.title,
      text: selectedNote.content,
    };

    const isSecure = window.isSecureContext;

    // Web Share API is preferred, but only works in secure contexts (HTTPS)
    if (isSecure && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard if sharing is cancelled or fails
        console.error('Error sharing, falling back to clipboard:', error);
        copyToClipboard();
      }
    } else {
      // Fallback for non-secure contexts (like http://localhost) or unsupported browsers
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    if (!selectedNote) return;
    try {
      await navigator.clipboard.writeText(`${selectedNote.title}\n\n${selectedNote.content}`);
      toast({
        title: t('Copied to clipboard', locale),
        description: t('Note content copied to clipboard.', locale),
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: t('Error', locale),
        description: t('Could not copy note to clipboard.', locale),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen max-h-screen overflow-hidden">
        <SiteHeader title={t('Notes', locale)} />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-hidden">
          <aside className={cn(
            "flex flex-col border-r h-full",
            selectedNote ? 'hidden md:flex' : 'flex'
          )}>
            <div className="p-4 space-y-4">
              <Input 
                placeholder={t('Search notes...', locale)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="w-full" onClick={handleAddNewNote}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('New Note', locale)}
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredNotes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={cn(
                      "w-full text-left p-2 rounded-md",
                      selectedNote?.id === note.id ? "bg-secondary" : "hover:bg-muted"
                    )}
                  >
                    <h3 className="font-semibold truncate">{note.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{note.content || t('No content', locale)}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>
          <main className={cn(
              "col-span-1 md:col-span-2 lg:col-span-3 flex-col h-full",
              selectedNote ? 'flex' : 'hidden md:flex'
          )}>
            {selectedNote ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedNote(null)}>
                            <ArrowLeft className="h-4 w-4" />
                         </Button>
                        <div>
                            <Input
                                value={selectedNote.title}
                                onChange={(e) => handleNoteChange('title', e.target.value)}
                                className="text-xl sm:text-2xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                            />
                             <p className="text-sm text-muted-foreground">{t('Created on {date}', locale, { date: new Date(selectedNote.createdAt).toLocaleDateString(locale) })}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('Are you sure?', locale)}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('This action cannot be undone. This will permanently delete your note.', locale)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('Cancel', locale)}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteNote(selectedNote.id)}>{t('Continue', locale)}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                   <Textarea
                      value={selectedNote.content}
                      onChange={(e) => handleNoteChange('content', e.target.value)}
                      className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                      placeholder={t('Start writing...', locale)}
                    />
                </div>
                <div className="p-4 border-t mt-auto flex justify-between">
                   <Button onClick={handleSummarize} disabled={!isPro || isSummaryLoading}>
                      {isSummaryLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isSummaryLoading ? t('Summarizing...', locale) : t('Summarize with AI', locale)}
                   </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                 <div className="text-center">
                    <p className="text-muted-foreground">{t('Select a note to view or create a new one.', locale)}</p>
                    <Button className="mt-4" onClick={handleAddNewNote}>
                        <PlusCircle className="mr-2 h-4 w-4" /> {t('Create First Note', locale)}
                    </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Note Summary', locale)}</DialogTitle>
            <DialogDescription>
              {t('Here is a summary of your note generated by AI.', locale)}
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p>{summary}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSummaryDialogOpen(false)}>{t('Close', locale)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
