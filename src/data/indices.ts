import { plInflation, usInflation } from './inflation';
import type { HistoricalSeries } from './series';

export interface MarketIndex {
  returns: HistoricalSeries;
  currency: 'USD' | 'PLN';
  /** Inflacja kraju, w którego walucie liczony jest indeks. */
  inflation: HistoricalSeries;
}

// Roczne stopy zwrotu z dywidendami (total return), w %, w walucie indeksu.
// Dane przybliżone. Wartości za 2025 r. sprawdzone u źródeł, wcześniejsze warto zweryfikować.

const sp500: HistoricalSeries = {
  id: 'sp500',
  name: 'S&P 500 (USA)',
  source: 'S&P Dow Jones Indices, total return',
  firstYear: 1986,
  values: [
    18.67, 5.25, 16.61, 31.69, -3.10, 30.47, 7.62, 10.08, 1.32, 37.58,      // 1986–1995
    22.96, 33.36, 28.58, 21.04, -9.10, -11.89, -22.10, 28.68, 10.88, 4.91,  // 1996–2005
    15.79, 5.49, -37.00, 26.46, 15.06, 2.11, 16.00, 32.39, 13.69, 1.38,     // 2006–2015
    11.96, 21.83, -4.38, 31.49, 18.40, 28.71, -18.11, 26.29, 25.02, 17.88,  // 2016–2025
  ],
};

const msciWorld: HistoricalSeries = {
  id: 'msciworld',
  name: 'MSCI World (kraje rozwinięte)',
  source: 'MSCI, net total return USD',
  firstYear: 1986,
  values: [
    41.9, 16.2, 23.3, 16.6, -17.0, 18.3, -5.2, 22.5, 5.1, 20.7,     // 1986–1995
    13.5, 15.8, 24.3, 24.9, -13.2, -16.8, -19.9, 33.1, 14.7, 9.5,   // 1996–2005
    20.1, 9.0, -40.7, 30.0, 11.8, -5.5, 15.8, 26.7, 4.9, -0.9,      // 2006–2015
    7.5, 22.4, -8.7, 27.7, 15.9, 21.8, -18.1, 23.8, 18.7, 21.1,     // 2016–2025
  ],
};

const wig: HistoricalSeries = {
  id: 'wig',
  name: 'WIG (Polska)',
  source: 'GPW, indeks dochodowy WIG',
  firstYear: 1995,
  values: [
    1.4, 89.1, 2.3, -12.8, 41.3, -1.3, -22.0, 3.2, 44.9, 27.9,     // 1995–2004
    33.7, 41.6, 10.4, -51.1, 46.9, 18.8, -20.8, 26.2, 8.1, 0.3,    // 2005–2014
    -9.6, 11.4, 23.2, -9.5, 0.2, -1.4, 22.5, -16.7, 36.5, 1.4,     // 2015–2024
    47.3,                                                          // 2025
  ],
};

export const MARKET_INDICES: MarketIndex[] = [
  { returns: sp500, currency: 'USD', inflation: usInflation },
  { returns: msciWorld, currency: 'USD', inflation: usInflation },
  { returns: wig, currency: 'PLN', inflation: plInflation },
];

export function findIndex(id: string): MarketIndex {
  return MARKET_INDICES.find(index => index.returns.id === id) ?? MARKET_INDICES[0];
}
