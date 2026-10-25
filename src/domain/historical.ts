import type { MarketIndex } from '../data/indices';
import { lastYear } from '../data/series';

const PRESET_LENGTHS = [20, 30, 40];

/** Lata, za które są zarówno zwroty indeksu, jak i inflacja. */
export function availableRange(index: MarketIndex): [number, number] {
  const from = Math.max(index.returns.firstYear, index.inflation.firstYear);
  const to = Math.min(lastYear(index.returns), lastYear(index.inflation));
  return [from, to];
}

/** Długości do wyboru: 20, 30, 40 lat, o ile mieszczą się w danych, plus cały zakres. */
export function availableLengths(index: MarketIndex): number[] {
  const [from, to] = availableRange(index);
  const max = to - from + 1;
  return [...PRESET_LENGTHS.filter(length => length < max), max];
}

/** Możliwe lata startu dla danej długości, od najnowszego. */
export function availableStartYears(index: MarketIndex, length: number): number[] {
  const [from, to] = availableRange(index);
  const latest = to - length + 1;
  const years: number[] = [];
  for (let year = latest; year >= from; year--) years.push(year);
  return years;
}
