import type { MarketAsset } from '../data/assets';
import { findCurrency, type Currency } from '../data/currencies';
import { lastYear, valueInYear, type HistoricalSeries } from '../data/series';

/** Annual returns and inflation as seen by an investor holding a given currency. */
export interface MarketData {
  returns: HistoricalSeries;
  inflation: HistoricalSeries;
}

/**
 * How much 1 unit of `from` gained or lost against `to` during `year` (1.10 = +10%).
 * Uses year-end rates expressed per 1 USD, so any pair can be crossed through the dollar.
 */
export function exchangeFactor(from: Currency, to: Currency, year: number): number {
  if (from === to) return 1;
  const fromRates = findCurrency(from).perUsd;
  const toRates = findCurrency(to).perUsd;
  const priceAt = (y: number) => valueInYear(toRates, y) / valueInYear(fromRates, y);
  return priceAt(year) / priceAt(year - 1);
}

/** Converts an annual return (in %) earned in `from` into the return seen in `to`. */
export function convertReturn(rate: number, from: Currency, to: Currency, year: number): number {
  return ((1 + rate / 100) * exchangeFactor(from, to, year) - 1) * 100;
}

/** Years for which exchange rates exist for both the start and the end of the year. */
function exchangeYears(from: Currency, to: Currency): [number, number] {
  const a = findCurrency(from).perUsd;
  const b = findCurrency(to).perUsd;
  return [Math.max(a.firstYear, b.firstYear) + 1, Math.min(lastYear(a), lastYear(b))];
}

/**
 * The asset's returns converted into the investor's currency, paired with that currency's inflation.
 * Without a currency change the original series is returned unchanged.
 */
export function marketDataFor(asset: MarketAsset, investorCurrency: Currency): MarketData {
  const inflation = findCurrency(investorCurrency).inflation;
  if (asset.currency === investorCurrency) return { returns: asset.returns, inflation };

  const [fxFrom, fxTo] = exchangeYears(asset.currency, investorCurrency);
  const firstYear = Math.max(asset.returns.firstYear, fxFrom);
  const last = Math.min(lastYear(asset.returns), fxTo);
  const values: number[] = [];
  for (let year = firstYear; year <= last; year++) {
    values.push(convertReturn(valueInYear(asset.returns, year), asset.currency, investorCurrency, year));
  }
  return {
    returns: {
      id: `${asset.returns.id}-${investorCurrency}`,
      source: `${asset.returns.source}; converted ${asset.currency}→${investorCurrency}`,
      firstYear,
      values,
    },
    inflation,
  };
}
