import type { ReturnsMode, YearPlan, YearResult } from '../domain/types';
import { formatPLN, signClass } from '../lib/format';
import { NumberInput } from './NumberInput';

interface Props {
  plan: YearPlan[];
  results: YearResult[];
  mode: ReturnsMode;
  contributionLabel: string;
  /** Zmiana zwrotu pojedynczego roku (indeks od 0). */
  onRateChange: (yearIndex: number, rate: number) => void;
}

export function YearlyTable({ plan, results, mode, contributionLabel, onRateChange }: Props) {
  const editable = mode === 'own';
  return (
    <section className="card">
      <h2>Rok po roku</h2>
      {editable && (
        <p className="hint">
          Zwrot pojedynczego roku można nadpisać (np. rok krachu). Nadpisane pola są podświetlone.
        </p>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rok</th>
              <th>Okres</th>
              <th>{contributionLabel}</th>
              <th>Zwrot (%)</th>
              <th>Inflacja (%)</th>
              <th>Wpłaty w roku</th>
              <th>Zysk w roku</th>
              <th>Suma wpłat</th>
              <th>Wartość na koniec</th>
              <th>Po inflacji</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((year, i) => {
              const result = results[i];
              const periodStart = i > 0 && year.periodIndex !== plan[i - 1].periodIndex;
              return (
                <tr key={i} className={periodStart ? 'period-start' : undefined}>
                  <td>
                    {i + 1}
                    {year.calendarYear !== undefined && <span className="calendar-year"> {year.calendarYear}</span>}
                  </td>
                  <td>{year.periodIndex + 1}</td>
                  <td>{formatPLN(year.contribution)}</td>
                  <td>
                    {editable ? (
                      <NumberInput
                        step={0.1} value={year.rate} className={year.overridden ? 'override' : undefined}
                        onChange={rate => onRateChange(i, rate)}
                      />
                    ) : (
                      <span className={signClass(year.rate)}>{year.rate.toFixed(1)}</span>
                    )}
                  </td>
                  <td>{year.inflation.toFixed(1)}</td>
                  <td>{formatPLN(result.paidInYear)}</td>
                  <td className={signClass(result.gainInYear)}>{formatPLN(result.gainInYear)}</td>
                  <td>{formatPLN(result.totalPaid)}</td>
                  <td><strong>{formatPLN(result.value)}</strong></td>
                  <td>{formatPLN(result.realValue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
