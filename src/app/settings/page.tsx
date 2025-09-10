'use client';

import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppContext } from '@/context/app-provider';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  firstName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  lastName: z.string().min(2, 'O sobrenome deve ter pelo menos 2 caracteres.'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { profile, setProfile, loading } = useContext(AppContext);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  const onSubmit = (data: ProfileFormValues) => {
    setProfile(data as UserProfile);
    toast({
      title: 'Sucesso!',
      description: 'Seu perfil foi atualizado.',
    });
  };
  
  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: 'Erro',
        description: 'Não foi possível encontrar o seu e-mail para redefinir a senha.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao enviar e-mail de redefinição de senha. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col h-full">
            <SiteHeader title="Configurações" />
            <div className="flex-1 p-4 pt-6 md:p-8 flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Configurações" />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
            <Card>
            <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Gerencie as informações da sua conta.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                      />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sobrenome</FormLabel>
                            <FormControl>
                            <Input placeholder="Seu sobrenome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                            <Input type="email" readOnly disabled {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit">Salvar Alterações</Button>
                </CardFooter>
                </form>
            </Form>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Gerencie sua senha.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Para alterar sua senha, enviaremos um link de redefinição seguro para o seu e-mail.
                    </p>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button variant="outline" onClick={handlePasswordReset}>Redefinir Senha</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
