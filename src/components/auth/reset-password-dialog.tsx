'use client';

import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
}

export function ResetPasswordDialog({ isOpen, onOpenChange, initialEmail }: ResetPasswordDialogProps) {
  const { locale } = useContext(AppContext);
  const { toast } = useToast();

  const getResetSchema = (locale: 'pt-BR' | 'en-US') => z.object({
    email: z.string().email(t('Please enter a valid email.', locale)).min(1, t('Email is required.', locale)),
  });

  const [resetSchema, setResetSchema] = useState(getResetSchema(locale));
  
  useEffect(() => {
    setResetSchema(getResetSchema(locale));
  }, [locale]);
  
  type ResetFormValues = z.infer<typeof resetSchema>;

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: initialEmail || '',
    },
  });
  
  useEffect(() => {
    if (initialEmail) {
      form.setValue('email', initialEmail);
    }
  }, [initialEmail, form]);

  useEffect(() => {
    form.trigger('email');
  }, [locale, form]);

  const onSubmit = async (data: ResetFormValues) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: t('Password reset email sent', locale),
        description: t('Please check your inbox to reset your password.', locale),
      });
      onOpenChange(false);
    } catch (error: any) {
      let description = t('Could not send reset email. Please try again.', locale);
      if (error.code === 'auth/user-not-found') {
        description = t('No account found with this email address.', locale);
      }
      toast({
        title: t('Error', locale),
        description,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Reset Password', locale)}</DialogTitle>
          <DialogDescription>
            {t('Enter your email address and we will send you a link to reset your password.', locale)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t('Cancel', locale)}</Button>
              <Button type="submit">{t('Send Reset Link', locale)}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
