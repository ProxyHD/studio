'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const registerSchema = z.object({
  firstName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  lastName: z.string().min(3, 'O sobrenome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.').min(1, 'O e-mail é obrigatório.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Sucesso!',
        description: 'Cadastro realizado com sucesso. Agora você pode fazer login.',
      });
      router.push('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      let description = 'Não foi possível concluir o cadastro. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/configuration-not-found') {
        description = 'Erro de configuração do Firebase. Ative o login por E-mail/Senha no Console do Firebase.';
      }
      toast({
        title: 'Erro de Cadastro',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <LifeBuoy className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
          <CardDescription className="text-center">
            Crie sua conta LifeHub para começar a organizar sua vida
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" suppressHydrationWarning>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Max" {...field} />
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
                        <Input placeholder="Robinson" {...field} />
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
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Criar conta
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
