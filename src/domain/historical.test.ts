import { describe, expect, it } from 'vitest';
import { findIndex, MARKET_INDICES } from '../data/indices';
import { lastYear } from '../data/series';
import { availableLengths, availableRange, availableStartYears } from './historical';
import { buildHistoricalPlan } from './plan';
import { averageReturn } from './simulate';

describe('dane historyczne', () => {
  it.each(MARKET_INDICES.map(index => [index.returns.id, index] as const))(
    '%s: zwroty i inflacja kończą się w tym samym roku',
    (_, index) => {
      expect(lastYear(index.returns)).toBe(lastYear(index.inflation));
      expect(index.inflation.firstYear).toBeLessThanOrEqual(index.returns.firstYear);
    },
  );

  it('S&P 500 1986–2025: średni zwrot ok. 11,5% rocznie', () => {
    const sp500 = findIndex('sp500');
    expect(availableRange(sp500)).toEqual([1986, 2025]);
    expect(averageReturn(sp500.returns.values)).toBeCloseTo(11.47, 1);
  });
});

describe('wybór zakresu', () => {
  it('WIG ma dane od 1995, więc zamiast 40 lat jest cały zakres 31 lat', () => {
    expect(availableLengths(findIndex('wig'))).toEqual([20, 30, 31]);
  });

  it('S&P 500 ma pełne 40 lat', () => {
    expect(availableLengths(findIndex('sp500'))).toEqual([20, 30, 40]);
  });

  it('lata startu idą od najnowszego i mieszczą się w danych', () => {
    const sp500 = findIndex('sp500');
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
