/**
 * Annual data series (returns or inflation, in %), one value per calendar year from `firstYear`.
 * Display names live in the translations (`src/i18n/messages.ts`), keyed by `id`.
 */
export interface HistoricalSeries {
  id: string;
  firstYear: number;
  values: number[];
  source: string;
}

export function lastYear(series: HistoricalSeries): number {
  return series.firstYear + series.values.length - 1;
}

export function valueInYear(series: HistoricalSeries, year: number): number {
  const value = series.values[year - series.firstYear];
  if (value === undefined) throw new RangeError(`No ${series.id} data for year ${year}`);
  return value;
}
