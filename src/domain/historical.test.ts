import { describe, expect, it } from 'vitest';
import { findAsset, MARKET_ASSETS } from '../data/assets';
import { lastYear } from '../data/series';
import { MESSAGES } from '../i18n/messages';
import { availableLengths, availableRange, availableStartYears, coversWindow } from './historical';
import { buildHistoricalPlan } from './plan';
import { averageReturn } from './simulate';

describe('historical data', () => {
  it.each(MARKET_ASSETS.map(asset => [asset.returns.id, asset] as const))(
    '%s: returns and inflation end in the same year',
    (_, asset) => {
      expect(lastYear(asset.returns)).toBe(lastYear(asset.inflation));
      expect(asset.inflation.firstYear).toBeLessThanOrEqual(asset.returns.firstYear);
    },
  );

  it.each(Object.entries(MESSAGES))('every series has a display name in "%s"', (_, messages) => {
    for (const asset of MARKET_ASSETS) {
      expect(messages.series[asset.returns.id]).toBeTruthy();
      expect(messages.inflation[asset.inflation.id]).toBeTruthy();
    }
  });

  it('S&P 500 1986–2025 averages about 11.5% a year', () => {
    const sp500 = findAsset('sp500');
    expect(availableRange(sp500)).toEqual([1986, 2025]);
    expect(averageReturn(sp500.returns.values)).toBeCloseTo(11.47, 1);
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
    expect(availableLengths(findAsset('wig'))).toEqual([10, 20, 30, 31]);
  });

  it('S&P 500 has a full 40 years', () => {
    expect(availableLengths(findAsset('sp500'))).toEqual([10, 20, 30, 40]);
  });

  it('IWDA, listed since 2010, offers 10 years or the full 16-year range', () => {
    expect(availableLengths(findAsset('iwda'))).toEqual([10, 16]);
  });

  it('coversWindow checks that the data spans the whole window', () => {
    expect(coversWindow(findAsset('iwda'), 2010, 16)).toBe(true);
    expect(coversWindow(findAsset('iwda'), 2006, 20)).toBe(false);
    expect(coversWindow(findAsset('spy'), 1994, 32)).toBe(true);
  });

  it('lists start years newest first, all within the data', () => {
    const sp500 = findAsset('sp500');
    const starts = availableStartYears(sp500, 30);
    expect(starts[0]).toBe(1996);
    expect(starts.at(-1)).toBe(1986);
    for (const firstYear of starts) {
      expect(() => buildHistoricalPlan(
        [{ id: 1, years: 30, contribution: 0, rate: 0 }],
        { returns: sp500.returns, inflation: sp500.inflation, firstYear, years: 30 },
      )).not.toThrow();
    }
  });
});
