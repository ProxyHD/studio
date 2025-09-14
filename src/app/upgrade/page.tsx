
'use client';

import { useContext, useState } from 'react';
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
import type { Plan } from '@/lib/types';

export default function UpgradePage() {
  const { locale, profile, setProfile } = useContext(AppContext);
  const { toast } = useToast();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const plans = getPlans(locale);

  const handleUpgradeClick = (plan: Plan) => {
    if (!profile) return;

    setLoadingPlanId(plan.id);

    // Simulate a network request to update the plan in Firestore
    setTimeout(() => {
      if (setProfile) {
        setProfile({
          ...profile,
          plan: plan.id as 'free' | 'plus' | 'pro',
        });
      }
      toast({
        title: t('Success', locale),
        description: `${t('You are now on the {planName} plan.', locale, { planName: plan.name })}`,
      });
      setLoadingPlanId(null);
    }, 1000);
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
              className={cn(
                "flex flex-col",
                plan.accent && "border-primary ring-2 ring-primary shadow-lg",
                profile?.plan?.toLowerCase() === plan.id && "bg-muted"
              )}
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
                {profile?.plan?.toLowerCase() === plan.id ? (
                  <Button className="w-full" variant="outline" disabled>{t('Current Plan', locale)}</Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.accent ? 'default' : 'outline'}
                    onClick={() => handleUpgradeClick(plan)}
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
