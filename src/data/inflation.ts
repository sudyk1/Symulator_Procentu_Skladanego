import type { HistoricalSeries } from './series';

/** US inflation: CPI-U, December over December, in %. */
export const usInflation: HistoricalSeries = {
  id: 'us-cpi',
  source: 'BLS, CPI-U December/December',
  firstYear: 1986,
  values: [
    1.1, 4.4, 4.4, 4.6, 6.1, 3.1, 2.9, 2.7, 2.7, 2.5, // 1986–1995
    3.3, 1.7, 1.6, 2.7, 3.4, 1.6, 2.4, 1.9, 3.3, 3.4, // 1996–2005
    2.5, 4.1, 0.1, 2.7, 1.5, 3.0, 1.7, 1.5, 0.8, 0.7, // 2006–2015
    2.1, 2.1, 1.9, 2.3, 1.4, 7.0, 6.5, 3.4, 2.9, 2.7, // 2016–2025
  ],
};

/** Polish inflation: CPI annual average, in %. */
export const plInflation: HistoricalSeries = {
  id: 'pl-cpi',
  source: 'Statistics Poland (GUS), CPI annual average',
  firstYear: 1995,
  values: [
    27.8, 19.9, 14.9, 11.8, 7.3, 10.1, 5.5, 1.9, 0.8, 3.5, // 1995–2004
    2.1, 1.0, 2.5, 4.2, 3.5, 2.6, 4.3, 3.7, 0.9, 0.0,      // 2005–2014
    -0.9, -0.6, 2.0, 1.6, 2.3, 3.4, 5.1, 14.4, 11.4, 3.6,  // 2015–2024
    3.6,                                                   // 2025
  ],
};

/** Euro area inflation: consumer prices, annual average, in %. */
export const euroInflation: HistoricalSeries = {
  id: 'ea-cpi',
  source: 'World Bank via FRED (FPCPITOTLZGEMU), consumer prices annual %',
  firstYear: 1986,
  values: [
    2.7, 3.2, 2.7, 4.1, 4.5, 4.3, 5.6, 4.6, 4.7, 4.2, // 1986–1995
    3.1, 2.3, 2.4, 2.1, 3.0, 2.9, 2.5, 2.1, 2.2, 2.6, // 1996–2005
    2.8, 2.5, 4.2, 0.5, 1.5, 3.3, 2.6, 1.2, 0.2, -0.1, // 2006–2015
    0.1, 1.4, 1.7, 1.4, 0.2, 2.5, 8.5, 5.9, 2.3, 2.5, // 2016–2025
  ],
};

/** UK inflation: consumer prices, annual average, in %. */
export const ukInflation: HistoricalSeries = {
  id: 'uk-cpi',
  source: 'World Bank via FRED (FPCPITOTLZGGBR), consumer prices annual %',
  firstYear: 1986,
  values: [
    3.4, 4.1, 4.2, 5.8, 8.1, 7.5, 4.6, 2.6, 2.2, 2.7, // 1986–1995
    2.9, 2.2, 1.8, 1.8, 1.2, 1.5, 1.5, 1.4, 1.4, 2.1, // 1996–2005
    2.5, 2.4, 3.5, 2.0, 2.5, 3.9, 2.6, 2.3, 1.5, 0.4, // 2006–2015
    1.0, 2.6, 2.3, 1.7, 1.0, 2.5, 7.9, 6.8, 3.3, 3.9, // 2016–2025
  ],
};
