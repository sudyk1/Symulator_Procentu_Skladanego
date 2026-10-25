import type { HistoricalSeries } from '../data/series';
import { valueInYear } from '../data/series';
import type { Period, RateOverrides, YearPlan } from './types';

export const MAX_YEARS = 100;

export function totalYears(periods: Period[]): number {
  return periods.reduce((sum, period) => sum + period.years, 0);
}

/** Year ranges of the periods, numbered from 1, e.g. [[1, 10], [11, 15]]. */
export function periodRanges(periods: Period[]): [number, number][] {
  let from = 1;
  return periods.map(period => {
    const range: [number, number] = [from, from + period.years - 1];
    from += period.years;
    return range;
  });
}

/** Period index for a year (from 0). Years past the last period belong to the last period. */
export function periodIndexForYear(periods: Period[], yearIndex: number): number {
  let end = 0;
  for (let i = 0; i < periods.length; i++) {
    end += periods[i].years;
    if (yearIndex < end) return i;
  }
  return periods.length - 1;
}

/** Own mode: each year takes the contribution and return of its period, unless the return is overridden. */
export function buildOwnPlan(periods: Period[], overrides: RateOverrides, inflation: number): YearPlan[] {
  const plan: YearPlan[] = [];
  periods.forEach((period, periodIndex) => {
    for (let i = 0; i < period.years && plan.length < MAX_YEARS; i++) {
      const yearIndex = plan.length;
      const overridden = yearIndex in overrides;
      plan.push({
        periodIndex,
        contribution: period.contribution,
        rate: overridden ? overrides[yearIndex] : period.rate,
        inflation,
        overridden,
      });
    }
  });
  return plan;
}

export interface HistoricalWindow {
  returns: HistoricalSeries;
  inflation: HistoricalSeries;
  firstYear: number;
  years: number;
}

/**
 * Historical mode: returns and inflation come from the data, periods only set the contributions.
 * The number of years follows the selected window, not the sum of the periods.
 */
export function buildHistoricalPlan(periods: Period[], window: HistoricalWindow): YearPlan[] {
  return Array.from({ length: window.years }, (_, yearIndex) => {
    const calendarYear = window.firstYear + yearIndex;
    const periodIndex = periodIndexForYear(periods, yearIndex);
    return {
      periodIndex,
      contribution: periods[periodIndex].contribution,
      rate: valueInYear(window.returns, calendarYear),
      inflation: valueInYear(window.inflation, calendarYear),
      calendarYear,
      overridden: false,
    };
  });
}

/** Drops overrides of years that fell outside the range after the periods were shortened. */
export function pruneOverrides(overrides: RateOverrides, years: number): RateOverrides {
  return Object.fromEntries(Object.entries(overrides).filter(([year]) => Number(year) < years));
}

/** Randomises each year's return within ±spread percentage points of its period's return. */
export function randomOverrides(plan: YearPlan[], spread: number, random = Math.random): RateOverrides {
  return Object.fromEntries(plan.map((year, i) => {
    const rate = year.rate + (random() * 2 - 1) * spread;
    return [i, Math.round(rate * 10) / 10];
  }));
}
