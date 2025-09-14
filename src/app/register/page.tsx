'use client';

import { useContext, useEffect, useState } from 'react';
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
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { useAuth } from '@/context/auth-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useAppContext();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  const getRegisterSchema = (locale: 'pt-BR' | 'en-US') => z.object({
    firstName: z.string().min(3, t('First name must be at least 3 characters.', locale)),
    lastName: z.string().min(3, t('Last name must be at least 3 characters.', locale)),
    email: z.string().email(t('Please enter a valid email.', locale)).min(1, t('Email is required.', locale)),
    password: z.string().min(6, t('Password must be at least 6 characters.', locale)),
  });

  const [registerSchema, setRegisterSchema] = useState(getRegisterSchema(locale));

  useEffect(() => {
    setRegisterSchema(getRegisterSchema(locale));
  }, [locale]);
  
  type RegisterFormValues = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    form.trigger();
  }, [locale, form]);


  async function onSubmit(data: RegisterFormValues) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
        tasks: [],
        notes: [],
        events: [],
        transactions: [],
        habits: [],
        completedHabits: [],
        moodLogs: [],
      });

      toast({
        title: t('Registration successful. You can now log in.', locale),
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      let description = t('Could not complete registration. Try again.', locale);
      if (error.code === 'auth/email-already-in-use') {
        description = t('This email is already in use.', locale);
      } else if (error.code === 'auth/configuration-not-found') {
        description = `${t('Firebase configuration error.', locale)} ${t('Enable Email/Password login in the Firebase Console.', locale)}`;
      }
      toast({
        title: t('Registration Error', locale),
        description,
        variant: 'destructive',
      });
    }
  }
  
  // Do not render the registration form if the user is already logged in and redirection is imminent
  if (loading || user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <LifeBuoy className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">{t('Register', locale)}</CardTitle>
          <CardDescription className="text-center">
            {t('Create your LifeHub account to start organizing your life', locale)}
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
                      <FormLabel>{t('First Name', locale)}</FormLabel>
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
                      <FormLabel>{t('Last Name', locale)}</FormLabel>
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
                    <FormLabel>{t('Email', locale)}</FormLabel>
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
                    <FormLabel>{t('Password', locale)}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t('Create account', locale)}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {t('Already have an account?', locale)}{' '}
            <Link href="/" className="underline">
              {t('Login', locale)}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
