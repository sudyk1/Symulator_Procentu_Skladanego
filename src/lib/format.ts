import type { Currency } from '../data/currencies';

const CURRENCY_SYMBOLS: Record<Currency, string> = { PLN: 'zł', EUR: '€', USD: '$', GBP: '£' };

/** Short symbol for labels, e.g. "zł" or "€". */
export const currencySymbol = (currency: Currency) => CURRENCY_SYMBOLS[currency];

export interface Formatters {
  /** Amount without decimals in the selected currency, e.g. "293 900 zł" or "€293,900". */
  currency: (amount: number) => string;
  /** Short number for chart axes, e.g. "320 tys." or "320K". */
  compact: (amount: number) => string;
  /** Signed percentage, e.g. "+7.00%". The argument is in percent, not a fraction. */
  percent: (percent: number) => string;
  /** Signed difference in percentage points, e.g. "+0.12 pp". */
  points: (points: number) => string;
  /** Plain number with one decimal place, e.g. "-37.0". */
  decimal: (value: number) => string;
}

export function createFormatters(locale: string, currencyCode: Currency): Formatters {
  const currency = new Intl.NumberFormat(locale, {
    style: 'currency', currency: currencyCode, maximumFractionDigits: 0,
  });
  const compact = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 });
  const signed = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always',
  });
  const decimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return {
    currency: amount => currency.format(amount),
    compact: amount => compact.format(amount),
    percent: percent => `${signed.format(percent)}%`,
    points: points => `${signed.format(points)} pp`,
    decimal: value => decimal.format(value),
  };
}

/** CSS class for colouring a positive or negative amount. */
export const signClass = (amount: number) => (amount >= 0 ? 'gain' : 'loss');
