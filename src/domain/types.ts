/** Jak często dokonywana jest wpłata. */
export type ContributionFrequency = 'month' | 'year';

/** Skąd biorą się roczne stopy zwrotu. */
export type ReturnsMode = 'own' | 'historical';

/** Okres: kilka kolejnych lat z tą samą wpłatą i (w trybie własnym) tym samym zwrotem. */
export interface Period {
  id: number;
  years: number;
  /** Wpłata w zł – miesięczna albo roczna, zależnie od częstotliwości. */
  contribution: number;
  /** Roczna stopa zwrotu w %. Używana tylko w trybie własnym. */
  rate: number;
}

/** Nadpisane stopy zwrotu pojedynczych lat: indeks roku (od 0) → stopa w %. */
export type RateOverrides = Record<number, number>;

/** Ustawienia jednego roku symulacji, gotowe do przeliczenia. */
export interface YearPlan {
  /** Indeks okresu, z którego pochodzi wpłata. */
  periodIndex: number;
  contribution: number;
  /** Roczna stopa zwrotu w %. */
  rate: number;
  /** Roczna inflacja w %. */
  inflation: number;
  /** Rok kalendarzowy – tylko w trybie historycznym. */
  calendarYear?: number;
  overridden: boolean;
}

/** Wynik jednego roku symulacji. Kwoty nominalne w zł. */
export interface YearResult {
  paidInYear: number;
  gainInYear: number;
  totalPaid: number;
  value: number;
  /** Wartość portfela w cenach z początku inwestycji. */
  realValue: number;
  /** Suma wpłat przeliczona na ceny z początku inwestycji. */
  realPaid: number;
}

export interface SimulationSettings {
  initialAmount: number;
  frequency: ContributionFrequency;
}

export interface Summary {
  finalValue: number;
  totalPaid: number;
  profit: number;
  /** Średnia geometryczna rocznych stóp zwrotu w %. */
  averageReturn: number;
  realValue: number;
  realProfit: number;
}
