'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { tr, Translations } from './tr';
import { de } from './de';

type Locale = 'tr' | 'de';

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  toggleLanguage: () => void;
  setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('tr');

  useEffect(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('kasse_locale') as Locale;
    if (saved === 'tr' || saved === 'de') {
      setLocaleState(saved);
    } else {
      // Auto-detect browser language if none saved
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'de') {
        setLocaleState('de');
      }
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLocaleState(lang);
    localStorage.setItem('kasse_locale', lang);
  };

  const toggleLanguage = () => {
    setLanguage(locale === 'tr' ? 'de' : 'tr');
  };

  // Get current dictionary
  const t = locale === 'tr' ? tr : de;

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
