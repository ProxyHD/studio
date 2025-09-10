'use client';

import { useTheme } from '@/context/theme-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap, Check, Palette, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function ColorForm() {
  const { palette, setPalette, palettes, isPlusUser, setCustomColor, resetPalette } = useTheme();

  // Helper to convert HSL string to HEX color for the color input
  const hslToHex = (hsl: string) => {
    const [h, s, l] = hsl.split(' ').map(parseFloat);
    const s_norm = s / 100;
    const l_norm = l / 100;
    const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l_norm - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (60 <= h && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (120 <= h && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (180 <= h && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (240 <= h && h < 300) {
      [r, g, b] = [x, 0, c];
    } else if (300 <= h && h < 360) {
      [r, g, b] = [c, 0, x];
    }

    const toHex = (c: number) => {
      const hex = Math.round((c + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
   // Helper to convert HEX color to HSL string
  const hexToHsl = (hex: string): string => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };


  return (
    <Card className={cn(!isPlusUser && 'bg-muted/30 border-dashed')}>
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
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-medium mb-4 text-sm text-muted-foreground">Predefinições</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {palettes.map((p) => (
              <button
                key={p.name}
                onClick={() => setPalette(p.name)}
                disabled={!isPlusUser}
                className={cn(
                  'h-24 w-full rounded-lg flex flex-col items-center justify-center text-center p-2 relative',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
                  !isPlusUser && 'cursor-not-allowed opacity-50'
                )}
                style={{
                  backgroundColor: `hsl(${p.background})`,
                  color: `hsl(${p.primary})`,
                }}
              >
                <div className="flex gap-2 mb-2">
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: `hsl(${p.primary})` }}
                  ></div>
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: `hsl(${p.secondary})` }}
                  ></div>
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: `hsl(${p.accent})` }}
                  ></div>
                </div>
                <span className="text-sm font-medium capitalize">
                  {p.name === 'default' ? 'Padrão' : p.name}
                </span>
                {palette.name === p.name && (
                  <div
                    className="absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `hsl(${p.primary})`,
                      color: `hsl(${p.background})`,
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
         <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Cores Personalizadas
            </h4>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetPalette} 
                disabled={!isPlusUser}
            >
                <RotateCcw className="mr-2 h-4 w-4" />
                Redefinir
            </Button>
          </div>
          <fieldset disabled={!isPlusUser} className="grid grid-cols-2 md:grid-cols-4 gap-4 disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="space-y-2">
                <Label htmlFor="primaryColor">Primária</Label>
                <Input 
                    id="primaryColor"
                    type="color"
                    className="p-1 h-10 w-full" 
                    value={hslToHex(palette.primary)}
                    onChange={(e) => setCustomColor('primary', hexToHsl(e.target.value))}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secundária</Label>
                <Input 
                    id="secondaryColor"
                    type="color"
                    className="p-1 h-10 w-full" 
                    value={hslToHex(palette.secondary)}
                    onChange={(e) => setCustomColor('secondary', hexToHsl(e.target.value))}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="accentColor">Destaque</Label>
                <Input 
                    id="accentColor"
                    type="color"
                    className="p-1 h-10 w-full" 
                    value={hslToHex(palette.accent)}
                    onChange={(e) => setCustomColor('accent', hexToHsl(e.target.value))}
                />
            </div>
          </fieldset>
        </div>
      </CardContent>
    </Card>
  );
}
