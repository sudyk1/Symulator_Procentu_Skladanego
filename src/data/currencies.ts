import { euroInflation, plInflation, ukInflation, usInflation } from './inflation';
import type { HistoricalSeries } from './series';

export type Currency = 'PLN' | 'EUR' | 'USD' | 'GBP';

export interface CurrencyInfo {
  code: Currency;
  /** Inflation used for real (inflation-adjusted) results of an investor in this currency. */
  inflation: HistoricalSeries;
  /** Units of this currency per 1 USD at the end of each year. */
  perUsd: HistoricalSeries;
}

// Exchange rates: OECD monthly averages for December, via FRED, as units of currency per 1 USD.
// The December average is used as the year-end rate. Euro values before 1999 are OECD's synthetic euro.

const plnPerUsd: HistoricalSeries = {
  id: 'fx-pln',
  source: 'OECD via FRED (CCUSMA02PLM618N), December average',
  firstYear: 1994,
  values: [
    2.4311,                                                                         // 1994
    2.5154, 2.8590, 3.5320, 3.4836, 4.1743, 4.3320, 4.0217, 3.9268, 3.7957, 3.0909, // 1995–2004
    3.2376, 2.8908, 2.4726, 2.9714, 2.8410, 3.0204, 3.4016, 3.1158, 3.0482, 3.4270, // 2005–2014
    3.9424, 4.2041, 3.5507, 3.7678, 3.8446, 3.6814, 4.0845, 4.4224, 3.9696, 4.0791, // 2015–2024
    3.6074,                                                                         // 2025
  ],
};

const eurPerUsd: HistoricalSeries = {
  id: 'fx-eur',
  source: 'OECD via FRED (CCUSMA02EZM618N), December average',
  firstYear: 1985,
  values: [
    1.1457,                                                                         // 1985
    0.9574, 0.7914, 0.8440, 0.8565, 0.7320, 0.7681, 0.8072, 0.8858, 0.8228, 0.7666, // 1986–1995
    0.7997, 0.8998, 0.8530, 0.9882, 1.1108, 1.1199, 0.9817, 0.8131, 0.7454, 0.8432, // 1996–2005
    0.7577, 0.6868, 0.7448, 0.6863, 0.7568, 0.7606, 0.7618, 0.7297, 0.8122, 0.9185, // 2006–2015
    0.9489, 0.8453, 0.8787, 0.9000, 0.8219, 0.8848, 0.9446, 0.9163, 0.9557, 0.8535, // 2016–2025
  ],
};

const gbpPerUsd: HistoricalSeries = {
  id: 'fx-gbp',
  source: 'OECD via FRED (CCUSMA02GBM618N), December average',
  firstYear: 1985,
  values: [
    0.6913,                                                                         // 1985
    0.6954, 0.5473, 0.5474, 0.6269, 0.5194, 0.5478, 0.6443, 0.6709, 0.6416, 0.6492, // 1986–1995
    0.6008, 0.6028, 0.5986, 0.6198, 0.6820, 0.6937, 0.6304, 0.5710, 0.5181, 0.5730, // 1996–2005
    0.5096, 0.4960, 0.6730, 0.6167, 0.6420, 0.6416, 0.6195, 0.6105, 0.6397, 0.6678, // 2006–2015
    0.8021, 0.7464, 0.7895, 0.7635, 0.7445, 0.7511, 0.8218, 0.7901, 0.7915, 0.7466, // 2016–2025
  ],
};

const usdPerUsd: HistoricalSeries = {
  id: 'fx-usd',
  source: 'Base currency',
  firstYear: 1985,
  values: Array.from({ length: 2025 - 1985 + 1 }, () => 1),
};

/** Ordered for a Polish user: złoty first. */
export const CURRENCIES: CurrencyInfo[] = [
  { code: 'PLN', inflation: plInflation, perUsd: plnPerUsd },
  { code: 'EUR', inflation: euroInflation, perUsd: eurPerUsd },
  { code: 'USD', inflation: usInflation, perUsd: usdPerUsd },
  { code: 'GBP', inflation: ukInflation, perUsd: gbpPerUsd },
];

export const DEFAULT_CURRENCY: Currency = 'PLN';

export function findCurrency(code: Currency): CurrencyInfo {
  return CURRENCIES.find(currency => currency.code === code)!;
}
