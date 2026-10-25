import { lastYear } from '../data/series';
import type { MarketData } from './currency';

const PRESET_LENGTHS = [10, 20, 30, 40];

/** Years for which both the returns and the inflation are available. */
export function availableRange(data: MarketData): [number, number] {
  const from = Math.max(data.returns.firstYear, data.inflation.firstYear);
  const to = Math.min(lastYear(data.returns), lastYear(data.inflation));
  return [from, to];
}

/** Selectable lengths: 10, 20, 30, 40 years where the data allows it, plus the full range. */
export function availableLengths(data: MarketData): number[] {
  const [from, to] = availableRange(data);
  const max = to - from + 1;
  return [...PRESET_LENGTHS.filter(length => length < max), max];
}

/** Possible start years for a given length, most recent first. */
export function availableStartYears(data: MarketData, length: number): number[] {
  const [from, to] = availableRange(data);
  const latest = to - length + 1;
  const years: number[] = [];
  for (let year = latest; year >= from; year--) years.push(year);
  return years;
}

/**
 * Adjusts a requested window to what the data allows: an unavailable length becomes the full range,
 * an unavailable start year becomes the most recent one.
 */
export function fitWindow(data: MarketData, years: number, firstYear: number): { years: number; firstYear: number } {
  const lengths = availableLengths(data);
  const fittedYears = lengths.includes(years) ? years : lengths.at(-1)!;
  const starts = availableStartYears(data, fittedYears);
  return { years: fittedYears, firstYear: starts.includes(firstYear) ? firstYear : starts[0] };
}

/** Whether the data covers every year from `firstYear` over `years` years. */
export function coversWindow(data: MarketData, firstYear: number, years: number): boolean {
  const [from, to] = availableRange(data);
  return firstYear >= from && firstYear + years - 1 <= to;
}
