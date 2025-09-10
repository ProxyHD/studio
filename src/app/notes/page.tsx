'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notes as initialNotes } from '@/lib/data';
import type { Note } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { summarizeNotes } from '@/ai/flows/summarize-notes';
import { useToast } from '@/hooks/use-toast';


export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const { toast } = useToast();
  const isPro = true; // Mock value

  const handleNoteChange = (content: string) => {
    if (selectedNote) {
      const newNote = { ...selectedNote, content };
      setSelectedNote(newNote);
      setNotes(notes.map(n => n.id === newNote.id ? newNote : n));
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
        title: 'Erro',
        description: 'Falha ao gerar resumo. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen max-h-screen overflow-hidden">
        <SiteHeader title="Notas" />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-hidden">
          <aside className="hidden md:flex flex-col border-r h-full">
            <div className="p-4 space-y-4">
              <Input placeholder="Buscar notas..." />
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Nota
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {notes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={cn(
                      "w-full text-left p-2 rounded-md",
                      selectedNote?.id === note.id ? "bg-secondary" : "hover:bg-muted"
                    )}
                  >
                    <h3 className="font-semibold truncate">{note.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>
          <main className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full">
            {selectedNote ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                  <p className="text-sm text-muted-foreground">Criado em {selectedNote.createdAt}</p>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                   <Textarea
                      value={selectedNote.content}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                      placeholder="Comece a escrever..."
                    />
                </div>
                <div className="p-4 border-t mt-auto">
                   <Button onClick={handleSummarize} disabled={!isPro || isSummaryLoading}>
                      {isSummaryLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isSummaryLoading ? 'Resumindo...' : 'Resumir com IA'}
                   </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Selecione uma nota para visualizar ou crie uma nova.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resumo da Nota</DialogTitle>
            <DialogDescription>
              Aqui está um resumo da sua nota gerado por IA.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p>{summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
