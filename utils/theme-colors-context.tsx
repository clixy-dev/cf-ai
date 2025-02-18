'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeColors } from '@/types/theme';

interface ThemeColorsContextType {
  updateThemeColors: (colors: ThemeColors) => void;
  currentColors: ThemeColors;
}

const defaultThemeColors: ThemeColors = {
  primary: '#4A90E2',    // Bright blue - represents technology/innovation
  secondary: '#7B61FF'   // Purple - represents AI/intelligence
};

const STORAGE_KEY = 'theme-colors';

const ThemeColorsContext = createContext<ThemeColorsContextType | undefined>(undefined);

export function ThemeColorsProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [currentColors, setCurrentColors] = useState<ThemeColors>(defaultThemeColors);

  // Only run on client-side after hydration
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem(STORAGE_KEY);
      if (savedColors) {
        const colors = JSON.parse(savedColors);
        setCurrentColors(colors);
      }
    } catch (error) {
      console.error('Failed to load theme colors:', error);
    }
    setMounted(true);
  }, []);

  // Apply colors to document only after mounting
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    // Updated color scheme with proper foreground colors
    root.style.setProperty('--primary-color', currentColors.primary);
    root.style.setProperty('--primary-foreground-color', '#FFFFFF');
    root.style.setProperty('--secondary-color', currentColors.secondary);
    root.style.setProperty('--secondary-foreground-color', '#FFFFFF');

    // Additional theme colors for AI/tech aesthetic
    root.style.setProperty('--accent-color', '#FF5A5F');     // Bright accent for CTAs
    root.style.setProperty('--success-color', '#00B2A9');    // Teal for success states
    root.style.setProperty('--warning-color', '#FFB800');    // Amber for warnings
    root.style.setProperty('--info-color', '#00A3FF');       // Light blue for info
    
    // Dark mode optimized colors
    if (document.documentElement.classList.contains('dark')) {
      root.style.setProperty('--primary-color', '#5B9FE8');    // Lighter blue for dark mode
      root.style.setProperty('--secondary-color', '#8E78FF');  // Lighter purple for dark mode
    }
  }, [mounted, currentColors]);

  const updateThemeColors = (colors: ThemeColors) => {
    if (!mounted) return;
    
    try {
      setCurrentColors(colors);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    } catch (error) {
      console.error('Failed to update theme colors:', error);
    }
  };

  return (
    <ThemeColorsContext.Provider value={{ updateThemeColors, currentColors }}>
      {children}
    </ThemeColorsContext.Provider>
  );
}

export function useThemeColors() {
  const context = useContext(ThemeColorsContext);
  if (!context) {
    throw new Error('useThemeColors must be used within a ThemeColorsProvider');
  }
  return context;
} 