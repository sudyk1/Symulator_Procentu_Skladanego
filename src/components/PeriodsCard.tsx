import { MAX_YEARS, periodRanges } from '../domain/plan';
import type { Period, ReturnsMode } from '../domain/types';
import { NumberInput } from './NumberInput';

interface Props {
  periods: Period[];
  mode: ReturnsMode;
  contributionLabel: string;
  onChange: (id: number, changes: Partial<Period>) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onRandomize: () => void;
  onClearOverrides: () => void;
}

export function PeriodsCard({
  periods, mode, contributionLabel, onChange, onAdd, onRemove, onRandomize, onClearOverrides,
}: Props) {
  const ranges = periodRanges(periods);
  const historical = mode === 'historical';

  return (
    <section className="card">
      <h2>Okresy wpłat</h2>
      <p className="hint">
        {historical
          ? 'W trybie historycznym okresy ustalają tylko wpłaty. Zwrot i inflacja każdego roku pochodzą z danych indeksu.'
          : 'Każdy okres to kilka kolejnych lat z tą samą wpłatą i zwrotem. Łączna liczba lat to suma okresów.'}
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lata</th>
              <th>Liczba lat</th>
              <th>{contributionLabel}</th>
              <th>Zwrot roczny (%)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {periods.map((period, i) => (
              <tr key={period.id}>
                <td>{ranges[i][0]}–{ranges[i][1]}</td>
                <td>
                  <NumberInput
                    min={1} max={MAX_YEARS} step={1} value={period.years}
                    onChange={years => onChange(period.id, { years: clampYears(years) })}
                  />
                </td>
                <td>
                  <NumberInput
                    min={0} step={50} value={period.contribution}
                    onChange={contribution => onChange(period.id, { contribution })}
                  />
                </td>
                <td>
                  <NumberInput
                    step={0.1} value={period.rate} disabled={historical}
                    title={historical ? 'W trybie historycznym zwrot pochodzi z danych indeksu' : undefined}
                    onChange={rate => onChange(period.id, { rate })}
                  />
                </td>
                <td>
                  <button
                    className="icon" title="Usuń okres" disabled={periods.length === 1}
                    onClick={() => onRemove(period.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="actions">
        <button onClick={onAdd}>+ Dodaj okres</button>
        {!historical && (
          <>
            <button className="ghost" onClick={onRandomize}>Losowe lata (zmienność ±15%)</button>
            <button className="ghost" onClick={onClearOverrides}>Wyczyść zmiany pojedynczych lat</button>
          </>
        )}
      </div>
    </section>
  );
}

const clampYears = (years: number) => Math.max(1, Math.min(MAX_YEARS, Math.round(years)));
