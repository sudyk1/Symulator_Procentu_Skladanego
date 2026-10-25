import type { HistoricalSeries } from './series';

/** Inflacja w USA: CPI-U, grudzień do grudnia, w %. */
export const usInflation: HistoricalSeries = {
  id: 'us-cpi',
  name: 'inflacja w USA',
  source: 'BLS, CPI-U grudzień/grudzień',
  firstYear: 1986,
  values: [
    1.1, 4.4, 4.4, 4.6, 6.1, 3.1, 2.9, 2.7, 2.7, 2.5, // 1986–1995
    3.3, 1.7, 1.6, 2.7, 3.4, 1.6, 2.4, 1.9, 3.3, 3.4, // 1996–2005
    2.5, 4.1, 0.1, 2.7, 1.5, 3.0, 1.7, 1.5, 0.8, 0.7, // 2006–2015
    2.1, 2.1, 1.9, 2.3, 1.4, 7.0, 6.5, 3.4, 2.9, 2.7, // 2016–2025
  ],
};

/** Inflacja w Polsce: CPI średnioroczna, w %. */
export const plInflation: HistoricalSeries = {
  id: 'pl-cpi',
  name: 'inflacja w Polsce',
  source: 'GUS, CPI średnioroczna',
  firstYear: 1995,
  values: [
    27.8, 19.9, 14.9, 11.8, 7.3, 10.1, 5.5, 1.9, 0.8, 3.5, // 1995–2004
    2.1, 1.0, 2.5, 4.2, 3.5, 2.6, 4.3, 3.7, 0.9, 0.0,      // 2005–2014
    -0.9, -0.6, 2.0, 1.6, 2.3, 3.4, 5.1, 14.4, 11.4, 3.6,  // 2015–2024
    3.6,                                                   // 2025
  ],
};
