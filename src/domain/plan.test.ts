import { describe, expect, it } from 'vitest';
import { findAsset } from '../data/assets';
import {
  buildHistoricalPlan, buildOwnPlan, periodIndexForYear, periodRanges, pruneOverrides, randomOverrides,
} from './plan';
import type { Period } from './types';

const periods: Period[] = [
  { id: 1, years: 3, contribution: 500, rate: 7 },
  { id: 2, years: 2, contribution: 2000, rate: 5 },
];

describe('periods', () => {
  it('have contiguous year ranges numbered from 1', () => {
    expect(periodRanges(periods)).toEqual([[1, 3], [4, 5]]);
  });

  it('assign years past the end to the last period', () => {
    expect(periodIndexForYear(periods, 2)).toBe(0);
    expect(periodIndexForYear(periods, 3)).toBe(1);
    expect(periodIndexForYear(periods, 10)).toBe(1);
  });
});

describe('buildOwnPlan', () => {
  it('expands periods into years and applies overrides', () => {
    const plan = buildOwnPlan(periods, { 1: -30 }, 3);
    expect(plan.map(y => y.contribution)).toEqual([500, 500, 500, 2000, 2000]);
    expect(plan.map(y => y.rate)).toEqual([7, -30, 7, 5, 5]);
    expect(plan[1].overridden).toBe(true);
    expect(plan.every(y => y.inflation === 3)).toBe(true);
  });
});

describe('buildHistoricalPlan', () => {
  const sp500 = findAsset('sp500');

  it('takes returns and inflation from the data for consecutive calendar years', () => {
    const plan = buildHistoricalPlan(periods, {
      returns: sp500.returns, inflation: sp500.inflation, firstYear: 2008, years: 2,
    });
    expect(plan.map(y => y.calendarYear)).toEqual([2008, 2009]);
    expect(plan.map(y => y.rate)).toEqual([-37.0, 26.46]);
    expect(plan.map(y => y.inflation)).toEqual([0.1, 2.7]);
  });

  it('extends the last period\'s contribution when periods are shorter', () => {
    const plan = buildHistoricalPlan(periods, {
      returns: sp500.returns, inflation: sp500.inflation, firstYear: 2000, years: 8,
    });
    expect(plan.map(y => y.contribution)).toEqual([500, 500, 500, 2000, 2000, 2000, 2000, 2000]);
  });

  it('truncates periods longer than the selected window', () => {
    const plan = buildHistoricalPlan(periods, {
      returns: sp500.returns, inflation: sp500.inflation, firstYear: 2000, years: 2,
    });
    expect(plan).toHaveLength(2);
  });
});

describe('overrides', () => {
  it('pruneOverrides drops years out of range', () => {
    expect(pruneOverrides({ 0: 1, 4: 2, 7: 3 }, 5)).toEqual({ 0: 1, 4: 2 });
  });

  it('randomOverrides stays within ±spread', () => {
    const plan = buildOwnPlan(periods, {}, 0);
    expect(randomOverrides(plan, 15, () => 0)).toEqual({ 0: -8, 1: -8, 2: -8, 3: -10, 4: -10 });
    expect(randomOverrides(plan, 15, () => 1)).toEqual({ 0: 22, 1: 22, 2: 22, 3: 20, 4: 20 });
  });
});
