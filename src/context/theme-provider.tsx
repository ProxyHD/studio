'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import type { ColorPalette, Theme, ThemeContextType } from '@/lib/types';

const defaultPalette: ColorPalette = {
  name: 'default',
  primary: '231 48% 48%',
  secondary: '231 48% 88%',
  accent: '261 44% 62%',
  background: '233 50% 94%',
  darkBackground: '224 71% 4%',
};

const palettes: ColorPalette[] = [
  defaultPalette,
  {
    name: 'forest',
    primary: '158 41% 42%',
    secondary: '158 20% 82%',
    accent: '158 29% 62%',
    background: '158 10% 94%',
    darkBackground: '158 40% 10%',
  },
  {
    name: 'ocean',
    primary: '205 51% 42%',
    secondary: '205 30% 82%',
    accent: '205 39% 62%',
    background: '205 20% 94%',
    darkBackground: '205 50% 10%',
  },
  {
    name: 'sunset',
    primary: '25 80% 52%',
    secondary: '25 40% 88%',
    accent: '15 70% 62%',
    background: '25 30% 95%',
    darkBackground: '25 50% 12%',
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemesProvider>
  );
}

function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  const [palette, setPalette] = useState<ColorPalette>(defaultPalette);
  const isPlusUser = true; // Mock value - in a real app, this would come from user session/context

  const applyColors = useCallback((selectedPalette: ColorPalette) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', selectedPalette.primary);
    root.style.setProperty('--secondary', selectedPalette.secondary);
    root.style.setProperty('--accent', selectedPalette.accent);
    
    if (nextTheme === 'dark') {
      root.style.setProperty('--background', selectedPalette.darkBackground);
    } else {
      root.style.setProperty('--background', selectedPalette.background);
    }
  }, [nextTheme]);

  useEffect(() => {
    try {
      const storedPalette = localStorage.getItem('custom-palette');
      if (storedPalette) {
        const parsedPalette = JSON.parse(storedPalette);
        setPalette(parsedPalette);
        applyColors(parsedPalette);
      } else {
        const storedPaletteName = localStorage.getItem('color-palette') || 'default';
        const initialPalette = palettes.find(p => p.name === storedPaletteName) || defaultPalette;
        setPalette(initialPalette);
        applyColors(initialPalette);
      }
    } catch (error) {
        console.error("Failed to parse palette from localStorage", error);
        setPalette(defaultPalette);
        applyColors(defaultPalette);
    }
  }, [applyColors]);
  
  useEffect(() => {
    applyColors(palette);
  }, [nextTheme, palette, applyColors]);

  const setTheme = (theme: Theme) => {
    setNextTheme(theme);
  };

  const setColorPalette = (paletteName: string) => {
    if (!isPlusUser) return;
    const newPalette = palettes.find(p => p.name === paletteName) || defaultPalette;
    setPalette(newPalette);
    localStorage.setItem('color-palette', paletteName);
    localStorage.removeItem('custom-palette'); // Remove custom palette when a preset is chosen
    applyColors(newPalette);
  };

  const setCustomColor = (colorName: 'primary' | 'secondary' | 'accent', value: string) => {
    if (!isPlusUser) return;
    const newPalette = {
        ...palette,
        name: 'custom',
        [colorName]: value,
    };
    setPalette(newPalette);
    localStorage.setItem('custom-palette', JSON.stringify(newPalette));
    localStorage.setItem('color-palette', 'custom');
    applyColors(newPalette);
  };

  const resetPalette = () => {
    if (!isPlusUser) return;
    setColorPalette('default');
  };

  const value = {
    theme: (nextTheme as Theme) || 'light',
    setTheme,
    palette,
    setPalette: setColorPalette,
    palettes,
    isPlusUser,
    setCustomColor,
    resetPalette,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
