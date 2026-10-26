import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_CURRENCY, type Currency } from '../data/currencies';
import { createFormatters, type Formatters } from '../lib/format';
import { LANGUAGES, MESSAGES, type Language, type Messages } from './messages';

const LANGUAGE_KEY = 'language';
const CURRENCY_KEY = 'currency';

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: Messages;
  format: Formatters;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readStored<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const saved = localStorage.getItem(key);
    return allowed.includes(saved as T) ? (saved as T) : null;
  } catch {
    return null; // Storage can be unavailable (private mode, blocked cookies)
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not critical: the choice just won't survive a reload.
  }
}

/** Saved choice first, then the browser language; English is the fallback. */
function initialLanguage(): Language {
  return readStored(LANGUAGE_KEY, ['en', 'pl'] as const)
    ?? (navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en');
}

/** Language and currency of the interface, with formatters that follow both. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [currency, setCurrency] = useState<Currency>(
    () => readStored(CURRENCY_KEY, ['PLN', 'EUR', 'USD', 'GBP'] as const) ?? DEFAULT_CURRENCY,
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = MESSAGES[language].appTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', MESSAGES[language].appDescription);
    store(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => store(CURRENCY_KEY, currency), [currency]);

  const value = useMemo(() => {
    const locale = LANGUAGES.find(l => l.code === language)!.locale;
    return {
      language, setLanguage, currency, setCurrency,
      t: MESSAGES[language],
      format: createFormatters(locale, currency),
    };
  }, [language, currency]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}
