import { MAX_YEARS, periodRanges } from '../domain/plan';
import type { Period, ReturnsMode } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { NumberInput } from './NumberInput';

interface Props {
  periods: Period[];
  mode: ReturnsMode;
  contributionLabel: string;
  randomSpread: number;
  onChange: (id: number, changes: Partial<Period>) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onRandomize: () => void;
  onClearOverrides: () => void;
}

export function PeriodsCard({
  periods, mode, contributionLabel, randomSpread, onChange, onAdd, onRemove, onRandomize, onClearOverrides,
}: Props) {
  const { t } = useI18n();
  const ranges = periodRanges(periods);
  const historical = mode === 'historical';

  return (
    <section className="card">
      <h2>{t.periods.title}</h2>
      <p className="hint">{historical ? t.periods.hintHistorical : t.periods.hintOwn}</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.periods.years}</th>
              <th>{t.periods.yearCount}</th>
              <th>{contributionLabel}</th>
              <th>{t.periods.rate}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {periods.map((period, i) => (
              <tr key={period.id}>
                <td>{ranges[i][0]}–{ranges[i][1]}</td>
                <td>
                  <NumberInput
                    aria-label={t.periods.yearCountOf(i + 1)}
                    min={1} max={MAX_YEARS} step={1} value={period.years}
                    onChange={years => onChange(period.id, { years: clampYears(years) })}
                  />
                </td>
                <td>
                  <NumberInput
                    aria-label={t.periods.contributionOf(i + 1)}
                    min={0} step={50} value={period.contribution}
                    onChange={contribution => onChange(period.id, { contribution })}
                  />
                </td>
                <td>
                  <NumberInput
                    aria-label={t.periods.rateOf(i + 1)}
                    step={0.1} value={period.rate} disabled={historical}
                    title={historical ? t.periods.rateFromData : undefined}
                    onChange={rate => onChange(period.id, { rate })}
                  />
                </td>
                <td>
                  <button
                    className="icon" title={t.periods.remove} aria-label={t.periods.remove}
                    disabled={periods.length === 1} onClick={() => onRemove(period.id)}
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
        <button onClick={onAdd}>{t.periods.add}</button>
        {!historical && (
          <>
            <button className="ghost" onClick={onRandomize}>{t.periods.randomize(randomSpread)}</button>
            <button className="ghost" onClick={onClearOverrides}>{t.periods.clearOverrides}</button>
          </>
        )}
      </div>
    </section>
  );
}

const clampYears = (years: number) => Math.max(1, Math.min(MAX_YEARS, Math.round(years)));
