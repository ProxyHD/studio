'use client';

import { useTheme } from '@/context/theme-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap, Check } from 'lucide-react';
import Link from 'next/link';

export function ColorForm() {
  const { palette, setPalette, palettes, isPlusUser } = useTheme();

  return (
    <Card className={cn(!isPlusUser && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>Paleta de Cores</CardTitle>
            {!isPlusUser && (
                <Button size="sm" asChild>
                    <Link href="/upgrade">
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade para Plus
                    </Link>
                </Button>
            )}
        </div>
        <CardDescription>
          Personalize a aparência do aplicativo. Requer o plano Plus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {palettes.map((p) => (
            <button
              key={p.name}
              onClick={() => setPalette(p.name)}
              disabled={!isPlusUser}
              className={cn(
                "h-24 w-full rounded-lg flex flex-col items-center justify-center text-center p-2 relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                !isPlusUser && "cursor-not-allowed opacity-50"
              )}
              style={{
                backgroundColor: `hsl(${p.background})`,
                color: `hsl(${p.primary})`,
              }}
            >
              <div className="flex gap-2 mb-2">
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: `hsl(${p.primary})` }}></div>
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: `hsl(${p.secondary})` }}></div>
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: `hsl(${p.accent})` }}></div>
              </div>
              <span className="text-sm font-medium capitalize">{p.name === 'default' ? 'Padrão' : p.name}</span>
              {palette.name === p.name && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `hsl(${p.primary})`, color: `hsl(${p.background})`}}>
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
