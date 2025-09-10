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
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';

const profileSchema = z.object({
  firstName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  lastName: z.string().min(2, 'O sobrenome deve ter pelo menos 2 caracteres.'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { profile, setProfile, loading } = useContext(AppContext);
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

  if (loading) {
    return (
        <div className="flex flex-col h-full">
            <SiteHeader title="Configurações" />
            <div className="p-8">Carregando...</div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Configurações" />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <Card className="max-w-2xl mx-auto">
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
      </div>
    </div>
  );
}
