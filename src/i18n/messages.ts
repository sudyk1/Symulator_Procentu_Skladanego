import type { Currency } from '../data/currencies';

export type Language = 'en' | 'pl';

export const LANGUAGES: { code: Language; label: string; locale: string }[] = [
  { code: 'en', label: 'English', locale: 'en-US' },
  { code: 'pl', label: 'Polski', locale: 'pl-PL' },
];

/** English plural of "year". */
const enYears = (n: number) => `${n} ${n === 1 ? 'year' : 'years'}`;

const en = {
  appTitle: 'ETF Investment Simulator',
  appSubtitle: 'Compound interest with regular contributions. Monthly compounding.',
  appDescription: 'Free compound interest and ETF investment calculator: regular contributions, '
    + 'historical returns of the S&P 500, MSCI World and WIG, inflation-adjusted results in PLN, EUR, USD or GBP.',
  languageSwitcher: 'Language',

  settings: {
    currency: 'Currency',
    initialAmount: (symbol: string) => `Initial amount (${symbol})`,
    frequency: 'Contribution frequency',
    monthly: 'Monthly',
    yearly: 'Yearly',
  },

  currencies: {
    PLN: 'Polish złoty (PLN)',
    EUR: 'Euro (EUR)',
    USD: 'US dollar (USD)',
    GBP: 'British pound (GBP)',
  } as Record<Currency, string>,

  contribution: {
    month: (symbol: string) => `Contribution / month (${symbol})`,
    year: (symbol: string) => `Contribution / year (${symbol})`,
  },

  returns: {
    title: 'Returns',
    modeOwn: 'Own assumptions',
    modeHistorical: 'Historical markets and ETFs',
    inflation: 'Annual inflation (%)',
    asset: 'Index or ETF',
    years: 'Number of years',
    yearsOption: (years: number, isFullRange: boolean) => `${years} years${isFullRange ? ' (full range)' : ''}`,
    firstYear: 'First year',
    compareWith: 'Compare with',
    noComparison: '— no comparison —',
    groups: { index: 'Stock market indices', etf: 'ETFs' },
    note: (currency: string, inflationName: string, from: number, to: number) =>
      `Returns with dividends in ${currency}, ${inflationName}. Annual data ${from}–${to}, approximate.`,
    noteEtf: 'ETF results are already net of fund costs.',
    noteConverted: (from: string, to: string) =>
      `Returns converted from ${from} to ${to} at historical exchange rates (December averages), `
      + 'so currency gains and losses are included.',
    noteExtended: (periodYears: number, remaining: number) =>
      `Contribution periods cover ${enYears(periodYears)} – the last period's contribution continues for the remaining ${enYears(remaining)}.`,
    noteTruncated: (periodYears: number, years: number) =>
      `Contribution periods cover ${enYears(periodYears)} – the simulation ends after ${enYears(years)}.`,
    noteNoComparison: 'No other data covers this range of years.',
  },

  periods: {
    title: 'Contribution periods',
    hintOwn: 'Each period is a run of consecutive years with the same contribution and return. '
      + 'The total number of years is the sum of all periods.',
    hintHistorical: 'In historical mode periods only set the contributions. '
      + 'Each year\'s return and inflation come from the index data.',
    years: 'Years',
    yearCount: 'Number of years',
    rate: 'Annual return (%)',
    rateFromData: 'In historical mode the return comes from the index data',
    remove: 'Remove period',
    add: '+ Add period',
    randomize: (spread: number) => `Random years (±${spread}% volatility)`,
    clearOverrides: 'Clear single-year changes',
    // Accessible names of the table inputs, read out by screen readers
    yearCountOf: (period: number) => `Period ${period}: number of years`,
    contributionOf: (period: number) => `Period ${period}: contribution`,
    rateOf: (period: number) => `Period ${period}: annual return (%)`,
  },

  stats: {
    title: 'Result',
    totalPaid: 'You paid in',
    totalPaidNote: (years: number) => `initial amount + contributions over ${enYears(years)}`,
    finalValue: 'Final value',
    finalValueNote: 'what the portfolio is worth at the end',
    profit: 'Profit',
    profitNote: (percent: string) => `${percent} on what you paid in`,
    averageReturn: 'Average annual return',
    realValue: 'Final value after inflation',
    realProfit: 'Profit after inflation',
    realHint: '“After inflation” amounts are in prices from the start of the investment. '
      + 'Profit after inflation is the value after inflation minus contributions converted to starting prices.',
  },

  comparison: {
    title: 'Comparison with the same contributions',
    difference: 'Difference',
    finalValue: 'Final value',
    realValue: 'Value after inflation',
    profit: 'Profit',
    averageReturn: 'Average annual return',
  },

  priceChart: {
    title: (name: string) => `Price: ${name}`,
    subtitle: (start: number, currency: string) =>
      `Value of ${start} ${currency} invested once at the start, with dividends reinvested, in ${currency}.`,
    logScale: 'Logarithmic scale',
    growth: 'Total growth',
    bestYear: 'Best year',
    worstYear: 'Worst year',
    maxDrawdown: 'Largest fall from a peak',
    annualNote: 'Based on annual returns: falls within a year (e.g. March 2020) are not visible. '
      + 'The shaded area marks the largest fall.',
  },

  chart: {
    value: 'Portfolio value',
    paid: 'Contributed capital',
    real: 'Value after inflation',
    endOfYear: (label: string | number) => `End of year ${label}`,
  },

  yearly: {
    title: 'Year by year',
    hint: 'You can override the return of a single year (e.g. a crash year). Overridden fields are highlighted.',
    year: 'Year',
    period: 'Period',
    rate: 'Return (%)',
    inflation: 'Inflation (%)',
    paidInYear: 'Paid in year',
    gainInYear: 'Gain in year',
    totalPaid: 'Total paid',
    value: 'Value at year end',
    realValue: 'After inflation',
    rateOf: (year: number) => `Year ${year}: return (%)`,
  },

  /** Display names of market data series, by series id. */
  series: {
    sp500: 'S&P 500 (USA)',
    msciworld: 'MSCI World (developed markets)',
    wig: 'WIG (Poland)',
    spy: 'SPDR S&P 500 ETF (SPY)',
    iwda: 'iShares Core MSCI World UCITS (IWDA)',
  } as Record<string, string>,

  /** Display names of inflation series, by series id. */
  inflation: {
    'us-cpi': 'US inflation',
    'pl-cpi': 'Polish inflation',
    'ea-cpi': 'euro area inflation',
    'uk-cpi': 'UK inflation',
  } as Record<string, string>,
};

export type Messages = typeof en;

/** Polish plural of "year": 1 rok, 2–4 lata (but 12–14 lat), otherwise lat. */
function plYears(n: number): string {
  if (n === 1) return '1 rok';
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  return `${n} ${lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'lata' : 'lat'}`;
}

const pl: Messages = {
  appTitle: 'Symulator inwestycji ETF',
  appSubtitle: 'Procent składany z regularnymi wpłatami. Kapitalizacja miesięczna.',
  appDescription: 'Darmowy kalkulator procentu składanego i inwestycji w ETF: regularne wpłaty, '
    + 'historyczne zwroty S&P 500, MSCI World i WIG, wynik po inflacji w PLN, EUR, USD lub GBP.',
  languageSwitcher: 'Język',

  settings: {
    currency: 'Waluta',
    initialAmount: symbol => `Kwota startowa (${symbol})`,
    frequency: 'Częstotliwość wpłat',
    monthly: 'Co miesiąc',
    yearly: 'Co rok',
  },

  currencies: {
    PLN: 'Złoty polski (PLN)',
    EUR: 'Euro (EUR)',
    USD: 'Dolar amerykański (USD)',
    GBP: 'Funt brytyjski (GBP)',
  },

  contribution: {
    month: symbol => `Wpłata / mies. (${symbol})`,
    year: symbol => `Wpłata / rok (${symbol})`,
  },

  returns: {
    title: 'Zwroty',
    modeOwn: 'Własne założenia',
    modeHistorical: 'Historyczne wyniki giełd i ETF',
    inflation: 'Inflacja roczna (%)',
    asset: 'Indeks lub ETF',
    years: 'Liczba lat',
    yearsOption: (years, isFullRange) => `${plYears(years)}${isFullRange ? ' (cały zakres)' : ''}`,
    firstYear: 'Pierwszy rok',
    compareWith: 'Porównaj z',
    noComparison: '— bez porównania —',
    groups: { index: 'Indeksy giełdowe', etf: 'Fundusze ETF' },
    note: (currency, inflationName, from, to) =>
      `Zwroty z dywidendami w ${currency}, ${inflationName}. Dane roczne ${from}–${to}, przybliżone.`,
    noteEtf: 'Wyniki ETF są już pomniejszone o koszty funduszu.',
    noteConverted: (from, to) =>
      `Zwroty przeliczone z ${from} na ${to} po historycznych kursach (średnie z grudnia), `
      + 'więc uwzględniają zyski i straty na walucie.',
    noteExtended: (periodYears, remaining) =>
      `Okresy wpłat obejmują ${plYears(periodYears)} – przez pozostałe ${plYears(remaining)} działa wpłata z ostatniego okresu.`,
    noteTruncated: (periodYears, years) =>
      `Okresy wpłat obejmują ${plYears(periodYears)} – symulacja kończy się po ${years} latach.`,
    noteNoComparison: 'Dla tego zakresu lat nie ma innych danych do porównania.',
  },

  periods: {
    title: 'Okresy wpłat',
    hintOwn: 'Każdy okres to kilka kolejnych lat z tą samą wpłatą i zwrotem. Łączna liczba lat to suma okresów.',
    hintHistorical: 'W trybie historycznym okresy ustalają tylko wpłaty. '
      + 'Zwrot i inflacja każdego roku pochodzą z danych indeksu.',
    years: 'Lata',
    yearCount: 'Liczba lat',
    rate: 'Zwrot roczny (%)',
    rateFromData: 'W trybie historycznym zwrot pochodzi z danych indeksu',
    remove: 'Usuń okres',
    add: '+ Dodaj okres',
    randomize: spread => `Losowe lata (zmienność ±${spread}%)`,
    clearOverrides: 'Wyczyść zmiany pojedynczych lat',
    yearCountOf: period => `Okres ${period}: liczba lat`,
    contributionOf: period => `Okres ${period}: wpłata`,
    rateOf: period => `Okres ${period}: zwrot roczny (%)`,
  },

  stats: {
    title: 'Wynik',
    totalPaid: 'Wpłacono',
    totalPaidNote: years => `kwota startowa + wpłaty przez ${plYears(years)}`,
    finalValue: 'Wartość końcowa',
    finalValueNote: 'tyle jest wart portfel na koniec',
    profit: 'Zysk',
    profitNote: percent => `${percent} w stosunku do wpłat`,
    averageReturn: 'Średni zwrot roczny',
    realValue: 'Wartość końcowa po inflacji',
    realProfit: 'Zysk po inflacji',
    realHint: 'Kwoty „po inflacji” są w cenach z początku inwestycji. '
      + 'Zysk po inflacji to wartość po inflacji minus wpłaty przeliczone na ceny z początku.',
  },

  comparison: {
    title: 'Porównanie przy tych samych wpłatach',
    difference: 'Różnica',
    finalValue: 'Wartość końcowa',
    realValue: 'Wartość po inflacji',
    profit: 'Zysk',
    averageReturn: 'Średni zwrot roczny',
  },

  priceChart: {
    title: name => `Kurs: ${name}`,
    subtitle: (start, currency) =>
      `Wartość ${start} ${currency} zainwestowanych jednorazowo na starcie, z reinwestycją dywidend, w ${currency}.`,
    logScale: 'Skala logarytmiczna',
    growth: 'Łączny wzrost',
    bestYear: 'Najlepszy rok',
    worstYear: 'Najgorszy rok',
    maxDrawdown: 'Największy spadek od szczytu',
    annualNote: 'Na podstawie rocznych zwrotów: spadki w trakcie roku (np. marzec 2020) nie są widoczne. '
      + 'Zacieniony obszar to największy spadek.',
  },

  chart: {
    value: 'Wartość portfela',
    paid: 'Wpłacony kapitał',
    real: 'Wartość po inflacji',
    endOfYear: label => `Koniec roku ${label}`,
  },

  yearly: {
    title: 'Rok po roku',
    hint: 'Zwrot pojedynczego roku można nadpisać (np. rok krachu). Nadpisane pola są podświetlone.',
    year: 'Rok',
    period: 'Okres',
    rate: 'Zwrot (%)',
    inflation: 'Inflacja (%)',
    paidInYear: 'Wpłaty w roku',
    gainInYear: 'Zysk w roku',
    totalPaid: 'Suma wpłat',
    value: 'Wartość na koniec',
    realValue: 'Po inflacji',
    rateOf: year => `Rok ${year}: zwrot (%)`,
  },

  series: {
    sp500: 'S&P 500 (USA)',
    msciworld: 'MSCI World (kraje rozwinięte)',
    wig: 'WIG (Polska)',
    spy: 'SPDR S&P 500 ETF (SPY)',
    iwda: 'iShares Core MSCI World UCITS (IWDA)',
  },

  inflation: {
    'us-cpi': 'inflacja w USA',
    'pl-cpi': 'inflacja w Polsce',
    'ea-cpi': 'inflacja w strefie euro',
    'uk-cpi': 'inflacja w Wielkiej Brytanii',
  },
};

export const MESSAGES: Record<Language, Messages> = { en, pl };
