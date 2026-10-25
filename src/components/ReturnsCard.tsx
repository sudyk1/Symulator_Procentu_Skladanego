import { MARKET_INDICES, type MarketIndex } from '../data/indices';
import { availableLengths, availableRange, availableStartYears } from '../domain/historical';
import type { ReturnsMode } from '../domain/types';
import { NumberInput } from './NumberInput';

export interface HistoricalChoice {
  indexId: string;
  years: number;
  firstYear: number;
}

interface Props {
  mode: ReturnsMode;
  ownInflation: number;
  historical: HistoricalChoice;
  marketIndex: MarketIndex;
  /** Łączna liczba lat w okresach wpłat – do podpowiedzi o przedłużaniu lub ucinaniu. */
  periodYears: number;
  onModeChange: (mode: ReturnsMode) => void;
  onOwnInflationChange: (inflation: number) => void;
  onHistoricalChange: (choice: HistoricalChoice) => void;
}

export function ReturnsCard(props: Props) {
  const { mode, ownInflation, onModeChange, onOwnInflationChange } = props;
  return (
    <section className="card">
      <h2>Zwroty</h2>
      <div className="segmented" role="group">
        <button className={mode === 'own' ? 'on' : ''} onClick={() => onModeChange('own')}>
          Własne założenia
        </button>
        <button className={mode === 'historical' ? 'on' : ''} onClick={() => onModeChange('historical')}>
          Historyczne wyniki giełd
        </button>
      </div>

      {mode === 'own' ? (
        <div className="grid">
          <label>
            Inflacja roczna (%)
            <NumberInput step={0.1} value={ownInflation} onChange={onOwnInflationChange} />
          </label>
        </div>
      ) : (
        <HistoricalPicker {...props} />
      )}
    </section>
  );
}

function HistoricalPicker({ historical, marketIndex, periodYears, onHistoricalChange }: Props) {
  const lengths = availableLengths(marketIndex);
  const maxLength = lengths.at(-1);
  const startYears = availableStartYears(marketIndex, historical.years);
  const [from, to] = availableRange(marketIndex);

  // Przy zmianie indeksu lub długości zachowujemy wybór, jeśli nadal jest możliwy
  const changeIndex = (indexId: string) => {
    const index = MARKET_INDICES.find(i => i.returns.id === indexId)!;
    const indexLengths = availableLengths(index);
    const years = indexLengths.includes(historical.years) ? historical.years : indexLengths[0];
    onHistoricalChange({ indexId, years, firstYear: keepStart(index, years, historical.firstYear) });
  };
  const changeYears = (years: number) =>
    onHistoricalChange({ ...historical, years, firstYear: keepStart(marketIndex, years, historical.firstYear) });

  return (
    <>
      <div className="grid">
        <label>
          Indeks
          <select value={historical.indexId} onChange={e => changeIndex(e.target.value)}>
            {MARKET_INDICES.map(index => {
              const [first, last] = availableRange(index);
              return (
                <option key={index.returns.id} value={index.returns.id}>
                  {index.returns.name}, {first}–{last}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          Liczba lat
          <select value={historical.years} onChange={e => changeYears(Number(e.target.value))}>
            {lengths.map(length => (
              <option key={length} value={length}>
                {length} lat{length === maxLength ? ' (cały zakres)' : ''}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pierwszy rok
          <select
            value={historical.firstYear}
            onChange={e => onHistoricalChange({ ...historical, firstYear: Number(e.target.value) })}
          >
            {startYears.map(year => (
              <option key={year} value={year}>{year}–{year + historical.years - 1}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="hint spaced">
        Zwroty z dywidendami w {marketIndex.currency}, {marketIndex.inflation.name}. Dane roczne {from}–{to},
        przybliżone.
        {marketIndex.currency !== 'PLN' && ' Pomijamy zmiany kursu USD/PLN.'}
        {periodYears < historical.years &&
          ` Okresy wpłat obejmują ${periodYears} lat – przez pozostałe ${historical.years - periodYears} lat działa wpłata z ostatniego okresu.`}
        {periodYears > historical.years &&
          ` Okresy wpłat obejmują ${periodYears} lat – symulacja kończy się po ${historical.years} latach.`}
      </p>
    </>
  );
}

function keepStart(index: MarketIndex, years: number, firstYear: number): number {
  const starts = availableStartYears(index, years);
  return starts.includes(firstYear) ? firstYear : starts[0];
}
