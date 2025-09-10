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
import { PlusCircle, Sparkles, Loader2, Trash2 } from 'lucide-react';
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


export default function NotesPage() {
  const { notes, setNotes } = useContext(AppContext);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const { toast } = useToast();
  const isPro = true; // Mock value

  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    }
  }, [notes, selectedNote]);

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
      title: 'Nova Nota',
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
              <Button className="w-full" onClick={handleAddNewNote}>
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
                    <p className="text-sm text-muted-foreground truncate">{note.content || 'Nenhum conteúdo'}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>
          <main className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full">
            {selectedNote ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <Input
                            value={selectedNote.title}
                            onChange={(e) => handleNoteChange('title', e.target.value)}
                            className="text-2xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                        />
                         <p className="text-sm text-muted-foreground">Criado em {new Date(selectedNote.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua nota.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteNote(selectedNote.id)}>Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                   <Textarea
                      value={selectedNote.content}
                      onChange={(e) => handleNoteChange('content', e.target.value)}
                      className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                      placeholder="Comece a escrever..."
                    />
                </div>
                <div className="p-4 border-t mt-auto flex justify-between">
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
                 <div className="text-center">
                    <p className="text-muted-foreground">Selecione uma nota para visualizar ou crie uma nova.</p>
                    <Button className="mt-4" onClick={handleAddNewNote}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Criar Primeira Nota
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
            <DialogTitle>Resumo da Nota</DialogTitle>
            <DialogDescription>
              Aqui está um resumo da sua nota gerado por IA.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p>{summary}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSummaryDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
