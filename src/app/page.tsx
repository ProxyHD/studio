'use client';

import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LifeBuoy, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, getAdditionalUserInfo } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { useAuth } from '@/context/auth-provider';
import { ResetPasswordDialog } from '@/components/auth/reset-password-dialog';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useAppContext();
  const { user, loading } = useAuth();
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const getLoginSchema = (locale: 'pt-BR' | 'en-US') => z.object({
    email: z.string().email(t('Please enter a valid email.', locale)).min(1, t('Email is required.', locale)),
    password: z.string().min(1, t('Password is required.', locale)),
  });

  const [loginSchema, setLoginSchema] = useState(getLoginSchema(locale));

  useEffect(() => {
    setLoginSchema(getLoginSchema(locale));
  }, [locale]);

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    form.trigger();
  }, [locale, form]);


  async function onSubmit(data: LoginFormValues) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (error: any) {
      let description = t('An error occurred while logging in. Try again.', locale);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = t('Invalid email or password.', locale);
      } else if (error.code === 'auth/configuration-not-found') {
        description = `${t('Firebase configuration error.', locale)} ${t('Enable Email/Password login in the Firebase Console.', locale)}`;
      }
      toast({
        title: t('Login Error', locale),
        description,
        variant: 'destructive',
      });
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const additionalUserInfo = getAdditionalUserInfo(result);

      if (additionalUserInfo?.isNewUser) {
        const userDocRef = doc(db, 'users', user.uid);
        const displayName = user.displayName || 'New User';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');
        
        await setDoc(userDocRef, {
          profile: {
            firstName: firstName || '',
            lastName: lastName || '',
            email: user.email,
          },
          tasks: [],
          notes: [],
          events: [],
          transactions: [],
          habits: [],
          completedHabits: [],
          moodLogs: [],
        });
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      let description = t('An error occurred while logging in. Try again.', locale);
       if (error.code === 'auth/popup-blocked') {
        description = t('Login popup was blocked by the browser.', locale);
      } else if (error.code === 'auth/configuration-not-found') {
        description = `${t('Firebase configuration error.', locale)} ${t('Enable Google login in the Firebase Console.', locale)}`;
      }
      toast({
        title: t('Error', locale),
        description,
        variant: 'destructive',
      });
    }
  };
  
  // Do not render the login form if the user is already logged in and redirection is imminent
  if (loading || user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <LifeBuoy className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">{t('Login', locale)}</CardTitle>
            <CardDescription className="text-center">
              {t('Enter your email below to login to your LifeHub account', locale)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" suppressHydrationWarning>
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
                      <div className="flex items-center">
                        <FormLabel>{t('Password', locale)}</FormLabel>
                        <button
                          type="button"
                          onClick={() => setIsResetPasswordDialogOpen(true)}
                          className="ml-auto inline-block text-sm underline"
                        >
                          {t('Forgot your password?', locale)}
                        </button>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {t('Login', locale)}
                </Button>
              </form>
            </Form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('Or continue with', locale)}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <Chrome className="mr-2 h-4 w-4" />
              {t('Login with Google', locale)}
            </Button>
            <div className="mt-4 text-center text-sm">
              {t('Don\'t have an account?', locale)}{' '}
              <Link href="/register" className="underline">
                {t('Sign up', locale)}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <ResetPasswordDialog
        isOpen={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
        initialEmail={form.getValues('email')}
      />
    </>
  );
}
