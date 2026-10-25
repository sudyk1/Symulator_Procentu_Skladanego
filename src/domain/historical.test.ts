import { describe, expect, it } from 'vitest';
import { findAsset, MARKET_ASSETS } from '../data/assets';
import { CURRENCIES } from '../data/currencies';
import { MESSAGES } from '../i18n/messages';
import { marketDataFor } from './currency';
import { availableLengths, availableRange, availableStartYears, coversWindow } from './historical';
import { buildHistoricalPlan } from './plan';
import { averageReturn } from './simulate';

const inUsd = (id: string) => marketDataFor(findAsset(id), 'USD');
const inPln = (id: string) => marketDataFor(findAsset(id), 'PLN');

describe('historical data', () => {
  it.each(Object.entries(MESSAGES))('every asset and inflation series has a display name in "%s"', (_, messages) => {
    for (const asset of MARKET_ASSETS) expect(messages.series[asset.returns.id]).toBeTruthy();
    for (const currency of CURRENCIES) expect(messages.inflation[currency.inflation.id]).toBeTruthy();
  });

  it('S&P 500 1986–2025 averages about 11.5% a year in dollars', () => {
    expect(availableRange(inUsd('sp500'))).toEqual([1986, 2025]);
    expect(averageReturn(findAsset('sp500').returns.values)).toBeCloseTo(11.47, 1);
  });

  it('an S&P 500 ETF (SPY) earns slightly less than the index – the fund\'s costs', () => {
    const sp500 = findAsset('sp500').returns;
    const spy = findAsset('spy').returns;
    const indexSince1994 = sp500.values.slice(spy.firstYear - sp500.firstYear);
    const gap = averageReturn(spy.values) - averageReturn(indexSince1994);
    expect(gap).toBeLessThan(0);
    expect(gap).toBeGreaterThan(-0.3);
  });
});

describe('window selection', () => {
  it('WIG has data from 1995, so instead of 40 years the full range is 31 years', () => {
    expect(availableLengths(inPln('wig'))).toEqual([10, 20, 30, 31]);
  });

  it('S&P 500 has a full 40 years in dollars, but 31 in złoty (Polish data starts in 1995)', () => {
    expect(availableLengths(inUsd('sp500'))).toEqual([10, 20, 30, 40]);
    expect(availableLengths(inPln('sp500'))).toEqual([10, 20, 30, 31]);
  });

  it('IWDA, listed since 2010, offers 10 years or the full 16-year range', () => {
    expect(availableLengths(inPln('iwda'))).toEqual([10, 16]);
  });

  it('coversWindow checks that the data spans the whole window', () => {
    expect(coversWindow(inPln('iwda'), 2010, 16)).toBe(true);
    expect(coversWindow(inPln('iwda'), 2006, 20)).toBe(false);
    expect(coversWindow(inUsd('spy'), 1994, 32)).toBe(true);
  });

  it('lists start years newest first, all within the data', () => {
    const data = inUsd('sp500');
    const starts = availableStartYears(data, 30);
    expect(starts[0]).toBe(1996);
    expect(starts.at(-1)).toBe(1986);
    for (const firstYear of starts) {
      expect(() => buildHistoricalPlan(
        [{ id: 1, years: 30, contribution: 0, rate: 0 }],
        { ...data, firstYear, years: 30 },
      )).not.toThrow();
    }
  });
});
