'use client';

import { useState, useEffect, useContext, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { locale } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setError(t('Invalid or missing password reset code.', locale));
      setLoading(false);
      return;
    }

    const verifyCode = async () => {
      try {
        await verifyPasswordResetCode(auth, oobCode);
        setLoading(false);
      } catch (err) {
        setError(t('The password reset link is invalid or has expired.', locale));
        setLoading(false);
      }
    };
    verifyCode();
  }, [oobCode, locale]);

  const getResetSchema = (locale: 'pt-BR' | 'en-US') => z.object({
    newPassword: z.string().min(6, t('Password must be at least 6 characters.', locale)),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: t('Passwords do not match.', locale),
    path: ['confirmPassword'],
  });

  const [resetSchema, setResetSchema] = useState(getResetSchema(locale));

  useEffect(() => {
    setResetSchema(getResetSchema(locale));
  }, [locale]);

  type ResetFormValues = z.infer<typeof resetSchema>;

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: ResetFormValues) {
    if (!oobCode) return;
    try {
      await confirmPasswordReset(auth, oobCode, data.newPassword);
      toast({
        title: t('Password Reset Successful', locale),
        description: t('You can now log in with your new password.', locale),
      });
      router.push('/');
    } catch (err: any) {
      toast({
        title: t('Error Reseting Password', locale),
        description: t('An error occurred. Please try again.', locale),
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <p>{t('Verifying reset link...', locale)}</p>;
  }

  if (error) {
    return (
       <Card className="mx-auto max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl text-center">{t('Error', locale)}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-destructive text-center">{error}</p>
        </CardContent>
       </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <LifeBuoy className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">{t('Create New Password', locale)}</CardTitle>
        <CardDescription className="text-center">
          {t('Please enter your new password below.', locale)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('New Password', locale)}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Confirm New Password', locale)}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t('Save New Password', locale)}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
