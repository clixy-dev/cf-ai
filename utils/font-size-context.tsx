'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const STORAGE_KEY = 'font-size';
const defaultFontSize: FontSize = 'medium';

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

function setDocumentFontSize(size: FontSize) {
  if (typeof document === 'undefined') return;
  
  // Set the data attribute on the root element only
  document.documentElement.setAttribute('data-font-size', size);
}

function getInitialFontSize(): FontSize {
  if (typeof window === 'undefined') return defaultFontSize;
  
  const savedSize = localStorage.getItem(STORAGE_KEY);
  if (savedSize && ['small', 'medium', 'large'].includes(savedSize)) {
    return savedSize as FontSize;
  }
  return defaultFontSize;
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(getInitialFontSize);

  // Initialize font size on mount and update when fontSize changes
  useEffect(() => {
    setDocumentFontSize(fontSize);
    try {
      localStorage.setItem(STORAGE_KEY, fontSize);
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  }, [fontSize]);

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}