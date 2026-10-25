export type Language = 'en' | 'pl';

export const LANGUAGES: { code: Language; label: string; locale: string }[] = [
  { code: 'en', label: 'English', locale: 'en-US' },
  { code: 'pl', label: 'Polski', locale: 'pl-PL' },
];

const en = {
  appTitle: 'ETF Investment Simulator',
  appSubtitle: 'Compound interest with regular contributions. Monthly compounding.',
  languageSwitcher: 'Language',

  settings: {
    initialAmount: 'Initial amount (PLN)',
    frequency: 'Contribution frequency',
    monthly: 'Monthly',
    yearly: 'Yearly',
  },

  contribution: {
    month: 'Contribution / month (PLN)',
    year: 'Contribution / year (PLN)',
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
    noteFx: 'USD/PLN exchange rate changes are ignored.',
    noteExtended: (periodYears: number, remaining: number) =>
      `Contribution periods cover ${periodYears} years – the last period's contribution continues for the remaining ${remaining} years.`,
    noteTruncated: (periodYears: number, years: number) =>
      `Contribution periods cover ${periodYears} years – the simulation ends after ${years} years.`,
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
  },

  stats: {
    finalValue: 'Final value',
    totalPaid: 'Total contributions (incl. initial)',
    profit: 'Profit',
    averageReturn: 'Average annual return (CAGR of rates)',
    realValue: 'Value after inflation',
    realProfit: 'Real profit',
    realHint: '“After inflation” amounts are in prices from the start of the investment. '
      + 'Real profit is the value after inflation minus contributions converted to starting prices.',
  },

  comparison: {
    title: 'Comparison with the same contributions',
    difference: 'Difference',
    finalValue: 'Final value',
    realValue: 'Value after inflation',
    profit: 'Profit',
    averageReturn: 'Average annual return',
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
  } as Record<string, string>,
};

export type Messages = typeof en;

const pl: Messages = {
  appTitle: 'Symulator inwestycji ETF',
  appSubtitle: 'Procent składany z regularnymi wpłatami. Kapitalizacja miesięczna.',
  languageSwitcher: 'Język',

  settings: {
    initialAmount: 'Kwota startowa (zł)',
    frequency: 'Częstotliwość wpłat',
    monthly: 'Co miesiąc',
    yearly: 'Co rok',
  },

  contribution: {
    month: 'Wpłata / mies. (zł)',
    year: 'Wpłata / rok (zł)',
  },

  returns: {
    title: 'Zwroty',
    modeOwn: 'Własne założenia',
    modeHistorical: 'Historyczne wyniki giełd i ETF',
    inflation: 'Inflacja roczna (%)',
    asset: 'Indeks lub ETF',
    years: 'Liczba lat',
    yearsOption: (years, isFullRange) => `${years} lat${isFullRange ? ' (cały zakres)' : ''}`,
    firstYear: 'Pierwszy rok',
    compareWith: 'Porównaj z',
    noComparison: '— bez porównania —',
    groups: { index: 'Indeksy giełdowe', etf: 'Fundusze ETF' },
    note: (currency, inflationName, from, to) =>
      `Zwroty z dywidendami w ${currency}, ${inflationName}. Dane roczne ${from}–${to}, przybliżone.`,
    noteEtf: 'Wyniki ETF są już pomniejszone o koszty funduszu.',
    noteFx: 'Pomijamy zmiany kursu USD/PLN.',
    noteExtended: (periodYears, remaining) =>
      `Okresy wpłat obejmują ${periodYears} lat – przez pozostałe ${remaining} lat działa wpłata z ostatniego okresu.`,
    noteTruncated: (periodYears, years) =>
      `Okresy wpłat obejmują ${periodYears} lat – symulacja kończy się po ${years} latach.`,
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
  },

  stats: {
    finalValue: 'Wartość końcowa',
    totalPaid: 'Suma wpłat (ze startem)',
    profit: 'Zysk',
    averageReturn: 'Średni zwrot roczny (CAGR stóp)',
    realValue: 'Wartość po inflacji',
    realProfit: 'Zysk realny',
    realHint: 'Kwoty „po inflacji” są w cenach z początku inwestycji. '
      + 'Zysk realny to wartość po inflacji minus wpłaty przeliczone na ceny z początku.',
  },

  comparison: {
    title: 'Porównanie przy tych samych wpłatach',
    difference: 'Różnica',
    finalValue: 'Wartość końcowa',
    realValue: 'Wartość po inflacji',
    profit: 'Zysk',
    averageReturn: 'Średni zwrot roczny',
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
  },
};

export const MESSAGES: Record<Language, Messages> = { en, pl };
