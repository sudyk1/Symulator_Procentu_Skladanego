import { plInflation, usInflation } from './inflation';
import type { HistoricalSeries } from './series';

/** Something you can invest in: a stock market index or an ETF tracking one. */
export interface MarketAsset {
  /** Index: theoretical returns without costs. ETF: real fund results, net of fees and tracking error. */
  kind: 'index' | 'etf';
  returns: HistoricalSeries;
  currency: 'USD' | 'PLN';
  /** Inflation of the country whose currency the asset is quoted in. */
  inflation: HistoricalSeries;
}

// Annual total returns (dividends reinvested), in %, in the asset's currency.
// Approximate data: 2025 values were checked against sources, earlier years are worth re-verifying.

const sp500: HistoricalSeries = {
  id: 'sp500',
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
  source: 'Warsaw Stock Exchange (GPW), WIG total return index',
  firstYear: 1995,
  values: [
    1.4, 89.1, 2.3, -12.8, 41.3, -1.3, -22.0, 3.2, 44.9, 27.9,     // 1995–2004
    33.7, 41.6, 10.4, -51.1, 46.9, 18.8, -20.8, 26.2, 8.1, 0.3,    // 2005–2014
    -9.6, 11.4, 23.2, -9.5, 0.2, -1.4, 22.5, -16.7, 36.5, 1.4,     // 2015–2024
    47.3,                                                          // 2025
  ],
};

// ETFs: market results with dividends reinvested, i.e. already net of the fund's fee (TER)
// and tracking error. Data starts with the first full calendar year of trading.

const spy: HistoricalSeries = {
  id: 'spy',
  source: 'totalrealreturns.com, total return with dividends reinvested; TER 0.09%',
  firstYear: 1994,
  values: [
    0.40, 38.04, 22.56, 33.48, 28.69, 20.39, -9.74, -11.76, -21.58, 28.18,  // 1994–2003
    10.70, 4.83, 15.85, 5.15, -36.79, 26.35, 15.06, 1.89, 15.99, 32.31,     // 2004–2013
    13.46, 1.23, 12.00, 21.71, -4.57, 31.22, 18.33, 28.73, -18.18, 26.18,   // 2014–2023
    24.89, 17.72,                                                           // 2024–2025
  ],
};

const iwda: HistoricalSeries = {
  id: 'iwda',
  source: 'Yahoo Finance / alphacubator.com, USD (Acc) share class, market price; TER 0.20%',
  firstYear: 2010,
  values: [
    13.01, -6.42, 17.07, 26.05, 6.15, -1.13, 7.51, 22.75, -9.01, 27.13,     // 2010–2019
    16.06, 22.19, -18.11, 24.27, 19.11, 21.03,                              // 2020–2025
  ],
};

export const MARKET_ASSETS: MarketAsset[] = [
  { kind: 'index', returns: sp500, currency: 'USD', inflation: usInflation },
  { kind: 'index', returns: msciWorld, currency: 'USD', inflation: usInflation },
  { kind: 'index', returns: wig, currency: 'PLN', inflation: plInflation },
  { kind: 'etf', returns: spy, currency: 'USD', inflation: usInflation },
  { kind: 'etf', returns: iwda, currency: 'USD', inflation: usInflation },
];

export function findAsset(id: string): MarketAsset {
  return MARKET_ASSETS.find(asset => asset.returns.id === id) ?? MARKET_ASSETS[0];
}
