'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { SiteHeader } from '@/components/layout/site-header';
import { getPlans } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-provider';

// Load the Stripe.js script
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function UpgradePage() {
  const { locale } = useContext(AppContext);
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const planPriceIds: Record<string, string> = {
    plus: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID || '',
    pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
  };

  const plans = getPlans(locale);

  const handleUpgradeClick = async (planId: 'plus' | 'pro') => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upgrade.',
        variant: 'destructive',
      });
      return;
    }

    const priceId = planPriceIds[planId];
    if (!priceId) {
      console.error(`Price ID for plan "${planId}" is not configured in your .env file.`);
      toast({
        title: t('Error', locale),
        description: `Price ID for plan "${planId}" is not configured in your .env file.`,
        variant: 'destructive',
      });
      return;
    }

    setLoadingPlanId(planId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, userEmail: user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error: any) {
      toast({
        title: t('Error', locale),
        description: error.message || 'Could not initiate the payment process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title={t('Plans & Pricing', locale)} />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline">{t('Find the Perfect Plan', locale)}</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('Unlock your potential with LifeHub. Choose the plan that best suits your life and goals.', locale)}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn("flex flex-col", plan.accent && "border-primary ring-2 ring-primary shadow-lg")}
            >
              {plan.accent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">{t('Most Popular', locale)}</Badge>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.priceFrequency}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === 'free' ? (
                  <Button className="w-full" variant="outline" disabled>{plan.cta}</Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.accent ? 'default' : 'outline'}
                    onClick={() => handleUpgradeClick(plan.id as 'plus' | 'pro')}
                    disabled={loadingPlanId === plan.id}
                  >
                    {loadingPlanId === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                       <Zap className="mr-2 h-4 w-4" />
                    )}
                    {plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
