import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { plans } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function UpgradePage() {
  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Planos e Preços" />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline">Encontre o Plano Perfeito</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Desbloqueie seu potencial com o LifeHub. Escolha o plano que melhor se adapta à sua vida e aos seus objetivos.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn("flex flex-col", plan.accent && "border-primary ring-2 ring-primary shadow-lg")}
            >
              {plan.accent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">Mais Popular</Badge>
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
                <Button
                  className="w-full"
                  variant={plan.accent ? 'default' : 'outline'}
                  disabled={plan.isCurrent}
                  asChild
                >
                  <Link href="/dashboard">{plan.isCurrent ? "Plano Atual" : "Escolher Plano"}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
