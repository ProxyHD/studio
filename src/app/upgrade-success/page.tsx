'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function UpgradeSuccessPage() {
  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Upgrade Successful" />
      <div className="flex-1 flex items-center justify-center p-4 pt-6 md:p-8">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="mt-4">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for upgrading your plan. Your new features are now active. It may take a few moments for the changes to apply to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
