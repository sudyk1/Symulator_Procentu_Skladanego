import { useMemo, useState } from 'react';
import { ComparisonCard } from './components/ComparisonCard';
import { GrowthChart } from './components/GrowthChart';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PeriodsCard } from './components/PeriodsCard';
import { ReturnsCard, type HistoricalChoice } from './components/ReturnsCard';
import { SettingsCard } from './components/SettingsCard';
import { StatsBar } from './components/StatsBar';
import { YearlyTable } from './components/YearlyTable';
import { findAsset, MARKET_ASSETS, type MarketAsset } from './data/assets';
import { availableLengths, availableStartYears, coversWindow } from './domain/historical';
import {
  buildHistoricalPlan, buildOwnPlan, pruneOverrides, randomOverrides, totalYears,
} from './domain/plan';
import { simulate, summarize } from './domain/simulate';
import type { ContributionFrequency, Period, RateOverrides, ReturnsMode } from './domain/types';
import { useI18n } from './i18n/I18nProvider';

const RANDOM_SPREAD = 15;
const DEFAULT_HISTORICAL_YEARS = 20;

let nextPeriodId = 1;
const newPeriod = (fields: Omit<Period, 'id'>): Period => ({ id: nextPeriodId++, ...fields });

function defaultHistoricalChoice(): HistoricalChoice {
  const asset = findAsset('sp500');
  const lengths = availableLengths(asset);
  const years = lengths.includes(DEFAULT_HISTORICAL_YEARS) ? DEFAULT_HISTORICAL_YEARS : lengths[0];
  return { assetId: asset.returns.id, years, firstYear: availableStartYears(asset, years)[0] };
}

const historicalPlan = (periods: Period[], asset: MarketAsset, choice: HistoricalChoice) =>
  buildHistoricalPlan(periods, {
    returns: asset.returns,
    inflation: asset.inflation,
    firstYear: choice.firstYear,
    years: choice.years,
  });

export function App() {
  const { t } = useI18n();
  const [initialAmount, setInitialAmount] = useState(10000);
  const [frequency, setFrequency] = useState<ContributionFrequency>('month');
  const [mode, setMode] = useState<ReturnsMode>('own');
  const [ownInflation, setOwnInflation] = useState(3.5);
  const [historical, setHistorical] = useState(defaultHistoricalChoice);
  const [periods, setPeriods] = useState(() => [newPeriod({ years: 20, contribution: 500, rate: 7 })]);
  const [overrides, setOverrides] = useState<RateOverrides>({});
  const [compareId, setCompareId] = useState<string | null>(null);

  const asset = findAsset(historical.assetId);

  const plan = useMemo(() => mode === 'own'
    ? buildOwnPlan(periods, overrides, ownInflation)
    : historicalPlan(periods, asset, historical),
  [mode, periods, overrides, ownInflation, asset, historical]);

  const results = useMemo(() => simulate(plan, { initialAmount, frequency }), [plan, initialAmount, frequency]);
  const summary = summarize(plan, results, initialAmount);

  // Comparison: only assets with data for the whole selected range of years
  const compareCandidates = MARKET_ASSETS.filter(candidate =>
    candidate !== asset && coversWindow(candidate, historical.firstYear, historical.years));
  const compareAsset = mode === 'historical'
    ? compareCandidates.find(candidate => candidate.returns.id === compareId)
    : undefined;
  const comparison = useMemo(() => {
    if (!compareAsset) return undefined;
    const comparePlan = historicalPlan(periods, compareAsset, historical);
    const compareResults = simulate(comparePlan, { initialAmount, frequency });
    return {
      id: compareAsset.returns.id,
      results: compareResults,
      summary: summarize(comparePlan, compareResults, initialAmount),
    };
  }, [compareAsset, periods, historical, initialAmount, frequency]);

  const contributionLabel = t.contribution[frequency];

  // Changing periods may shorten the simulation – overrides of years out of range are dropped
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
      <header className="page-header">
        <div>
          <h1>{t.appTitle}</h1>
          <p className="subtitle">{t.appSubtitle}</p>
        </div>
        <LanguageSwitcher />
      </header>

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
        asset={asset}
        compareCandidates={compareCandidates}
        compareId={compareAsset ? compareId : null}
        periodYears={totalYears(periods)}
        onModeChange={setMode}
        onOwnInflationChange={setOwnInflation}
        onHistoricalChange={setHistorical}
        onCompareChange={setCompareId}
      />

      <PeriodsCard
        periods={periods}
        mode={mode}
        contributionLabel={contributionLabel}
        randomSpread={RANDOM_SPREAD}
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

      {comparison && (
        <ComparisonCard
          mainName={t.series[asset.returns.id]}
          compareName={t.series[comparison.id]}
          main={summary}
          compare={comparison.summary}
        />
      )}

      <GrowthChart
        plan={plan}
        results={results}
        initialAmount={initialAmount}
        comparison={comparison && { name: t.series[comparison.id], results: comparison.results }}
      />

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
