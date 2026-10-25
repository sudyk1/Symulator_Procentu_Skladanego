import { useMemo, useState } from 'react';
import { GrowthChart } from './components/GrowthChart';
import { PeriodsCard } from './components/PeriodsCard';
import { ReturnsCard, type HistoricalChoice } from './components/ReturnsCard';
import { SettingsCard } from './components/SettingsCard';
import { StatsBar } from './components/StatsBar';
import { YearlyTable } from './components/YearlyTable';
import { findIndex } from './data/indices';
import { availableLengths, availableStartYears } from './domain/historical';
import {
  buildHistoricalPlan, buildOwnPlan, pruneOverrides, randomOverrides, totalYears,
} from './domain/plan';
import { simulate, summarize } from './domain/simulate';
import type { ContributionFrequency, Period, RateOverrides, ReturnsMode } from './domain/types';

const RANDOM_SPREAD = 15;

let nextPeriodId = 1;
const newPeriod = (fields: Omit<Period, 'id'>): Period => ({ id: nextPeriodId++, ...fields });

function defaultHistoricalChoice(): HistoricalChoice {
  const index = findIndex('sp500');
  const years = availableLengths(index)[0];
  return { indexId: index.returns.id, years, firstYear: availableStartYears(index, years)[0] };
}

export function App() {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [frequency, setFrequency] = useState<ContributionFrequency>('month');
  const [mode, setMode] = useState<ReturnsMode>('own');
  const [ownInflation, setOwnInflation] = useState(3.5);
  const [historical, setHistorical] = useState(defaultHistoricalChoice);
  const [periods, setPeriods] = useState(() => [newPeriod({ years: 20, contribution: 500, rate: 7 })]);
  const [overrides, setOverrides] = useState<RateOverrides>({});

  const marketIndex = findIndex(historical.indexId);

  const plan = useMemo(() => mode === 'own'
    ? buildOwnPlan(periods, overrides, ownInflation)
    : buildHistoricalPlan(periods, {
      returns: marketIndex.returns,
      inflation: marketIndex.inflation,
      firstYear: historical.firstYear,
      years: historical.years,
    }),
  [mode, periods, overrides, ownInflation, marketIndex, historical]);

  const results = useMemo(() => simulate(plan, { initialAmount, frequency }), [plan, initialAmount, frequency]);
  const summary = summarize(plan, results, initialAmount);
  const contributionLabel = frequency === 'month' ? 'Wpłata / mies. (zł)' : 'Wpłata / rok (zł)';

  // Zmiana okresów może skrócić symulację – wtedy znikają nadpisania lat spoza zakresu
  const updatePeriods = (next: Period[]) => {
    setPeriods(next);
    setOverrides(current => pruneOverrides(current, totalYears(next)));
  };

  const changeYearRate = (yearIndex: number, rate: number) => {
    const periodRate = periods[plan[yearIndex].periodIndex].rate;
    setOverrides(current => {
      const { [yearIndex]: _, ...rest } = current;
      return rate === periodRate ? rest : { ...rest, [yearIndex]: rate };
    });
  };

  return (
    <main>
      <h1>Symulator inwestycji ETF</h1>
      <p className="subtitle">Procent składany z regularnymi wpłatami. Kapitalizacja miesięczna.</p>

      <SettingsCard
        initialAmount={initialAmount}
        frequency={frequency}
        onInitialAmountChange={setInitialAmount}
        onFrequencyChange={setFrequency}
      />

      <ReturnsCard
        mode={mode}
        ownInflation={ownInflation}
        historical={historical}
        marketIndex={marketIndex}
        periodYears={totalYears(periods)}
        onModeChange={setMode}
        onOwnInflationChange={setOwnInflation}
        onHistoricalChange={setHistorical}
      />

      <PeriodsCard
        periods={periods}
        mode={mode}
        contributionLabel={contributionLabel}
        onChange={(id, changes) => updatePeriods(periods.map(p => (p.id === id ? { ...p, ...changes } : p)))}
        onAdd={() => {
          const last = periods[periods.length - 1];
          updatePeriods([...periods, newPeriod({ years: 5, contribution: last.contribution, rate: last.rate })]);
        }}
        onRemove={id => updatePeriods(periods.filter(p => p.id !== id))}
        onRandomize={() => setOverrides(randomOverrides(buildOwnPlan(periods, {}, ownInflation), RANDOM_SPREAD))}
        onClearOverrides={() => setOverrides({})}
      />

      <StatsBar summary={summary} />

      <GrowthChart plan={plan} results={results} initialAmount={initialAmount} />

      <YearlyTable
        plan={plan}
        results={results}
        mode={mode}
        contributionLabel={contributionLabel}
        onRateChange={changeYearRate}
      />
    </main>
  );
}
