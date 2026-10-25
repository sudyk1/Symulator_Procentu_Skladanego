/** Roczny szereg danych (stopy zwrotu albo inflacja w %), rok po roku od `firstYear`. */
export interface HistoricalSeries {
  id: string;
  name: string;
  firstYear: number;
  values: number[];
  source: string;
}

export function lastYear(series: HistoricalSeries): number {
  return series.firstYear + series.values.length - 1;
}

export function valueInYear(series: HistoricalSeries, year: number): number {
  const value = series.values[year - series.firstYear];
  if (value === undefined) throw new RangeError(`Brak danych ${series.id} za rok ${year}`);
  return value;
}
