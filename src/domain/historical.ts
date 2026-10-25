import type { MarketAsset } from '../data/assets';
import { lastYear } from '../data/series';

const PRESET_LENGTHS = [10, 20, 30, 40];

/** Years for which both the asset's returns and the matching inflation are available. */
export function availableRange(asset: MarketAsset): [number, number] {
  const from = Math.max(asset.returns.firstYear, asset.inflation.firstYear);
  const to = Math.min(lastYear(asset.returns), lastYear(asset.inflation));
  return [from, to];
}

/** Selectable lengths: 10, 20, 30, 40 years where the data allows it, plus the full range. */
export function availableLengths(asset: MarketAsset): number[] {
  const [from, to] = availableRange(asset);
  const max = to - from + 1;
  return [...PRESET_LENGTHS.filter(length => length < max), max];
}

/** Possible start years for a given length, most recent first. */
export function availableStartYears(asset: MarketAsset, length: number): number[] {
  const [from, to] = availableRange(asset);
  const latest = to - length + 1;
  const years: number[] = [];
  for (let year = latest; year >= from; year--) years.push(year);
  return years;
}

/** Whether the asset has data for every year from `firstYear` over `years` years. */
export function coversWindow(asset: MarketAsset, firstYear: number, years: number): boolean {
  const [from, to] = availableRange(asset);
  return firstYear >= from && firstYear + years - 1 <= to;
}
