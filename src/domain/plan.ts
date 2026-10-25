import type { HistoricalSeries } from '../data/series';
import { valueInYear } from '../data/series';
import type { Period, RateOverrides, YearPlan } from './types';

export const MAX_YEARS = 100;

export function totalYears(periods: Period[]): number {
  return periods.reduce((sum, period) => sum + period.years, 0);
}

/** Zakresy lat okresów, numerowane od 1, np. [[1, 10], [11, 15]]. */
export function periodRanges(periods: Period[]): [number, number][] {
  let from = 1;
  return periods.map(period => {
    const range: [number, number] = [from, from + period.years - 1];
    from += period.years;
    return range;
  });
}

/** Indeks okresu dla roku (od 0). Lata po końcu okresów należą do ostatniego okresu. */
export function periodIndexForYear(periods: Period[], yearIndex: number): number {
  let end = 0;
  for (let i = 0; i < periods.length; i++) {
    end += periods[i].years;
    if (yearIndex < end) return i;
  }
  return periods.length - 1;
}

/** Tryb własny: każdy rok bierze wpłatę i zwrot ze swojego okresu, chyba że zwrot nadpisano. */
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
 * Tryb historyczny: zwrot i inflacja pochodzą z danych, okresy wyznaczają tylko wpłaty.
 * Liczba lat wynika z wybranego zakresu, nie z sumy okresów.
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

/** Usuwa nadpisania lat, które wypadły poza zakres po skróceniu okresów. */
export function pruneOverrides(overrides: RateOverrides, years: number): RateOverrides {
  return Object.fromEntries(Object.entries(overrides).filter(([year]) => Number(year) < years));
}

/** Losuje zwrot każdego roku w zakresie ±spread punktów procentowych od zwrotu okresu. */
export function randomOverrides(plan: YearPlan[], spread: number, random = Math.random): RateOverrides {
  return Object.fromEntries(plan.map((year, i) => {
    const rate = year.rate + (random() * 2 - 1) * spread;
    return [i, Math.round(rate * 10) / 10];
  }));
}
