import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createFormatters, type Formatters } from '../lib/format';
import { LANGUAGES, MESSAGES, type Language, type Messages } from './messages';

const STORAGE_KEY = 'language';

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Messages;
  format: Formatters;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Saved choice first, then the browser language; English is the fallback. */
function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pl') return saved;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) – fall through to detection.
  }
  return navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    const t = MESSAGES[language];
    document.documentElement.lang = language;
    document.title = t.appTitle;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Not critical: the choice just won't survive a reload.
    }
  }, [language]);

  const value = useMemo(() => {
    const locale = LANGUAGES.find(l => l.code === language)!.locale;
    return { language, setLanguage, t: MESSAGES[language], format: createFormatters(locale) };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}
