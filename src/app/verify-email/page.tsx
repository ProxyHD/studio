
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function VerifyEmailPage() {
  const { locale } = useContext(AppContext);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">{t('Verify Your Email', locale)}</CardTitle>
            <CardDescription>
                {t('A verification link has been sent to your email address. Please check your inbox (and spam folder) to complete your registration.', locale)}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
                {t('After verifying, you can log in to your account.', locale)}
            </p>
            <Button asChild>
              <Link href="/">{t('Back to Login', locale)}</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
