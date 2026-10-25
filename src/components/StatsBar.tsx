import type { Summary } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { signClass } from '../lib/format';

interface Props {
  summary: Summary;
  years: number;
}

/**
 * The result at a glance: what was paid in, what it is worth and the profit – large,
 * with the secondary figures (average return, after-inflation values) below in smaller type.
 */
export function StatsBar({ summary, years }: Props) {
  const { t, format } = useI18n();
  const profitPercent = summary.totalPaid > 0 ? (summary.profit / summary.totalPaid) * 100 : 0;

  return (
    <section className="card result" aria-labelledby="result-title">
      <h2 id="result-title">{t.stats.title}</h2>

      <div className="result-main">
        <KeyFigure
          label={t.stats.totalPaid}
          value={format.currency(summary.totalPaid)}
          note={t.stats.totalPaidNote(years)}
        />
        <KeyFigure
          label={t.stats.finalValue}
          value={format.currency(summary.finalValue)}
          note={t.stats.finalValueNote}
          emphasis
        />
        <KeyFigure
          label={t.stats.profit}
          value={format.currency(summary.profit)}
          note={t.stats.profitNote(format.percent(profitPercent))}
          className={signClass(summary.profit)}
        />
      </div>

      <dl className="result-secondary">
        <div>
          <dt>{t.stats.averageReturn}</dt>
          <dd>{format.percent(summary.averageReturn)}</dd>
        </div>
        <div className="real">
          <dt>{t.stats.realValue}</dt>
          <dd>{format.currency(summary.realValue)}</dd>
        </div>
        <div className="real">
          <dt>{t.stats.realProfit}</dt>
          <dd className={signClass(summary.realProfit)}>{format.currency(summary.realProfit)}</dd>
        </div>
      </dl>
      <p className="hint">{t.stats.realHint}</p>
    </section>
  );
}

interface KeyFigureProps {
  label: string;
  value: string;
  note: string;
  className?: string;
  emphasis?: boolean;
}

function KeyFigure({ label, value, note, className = '', emphasis = false }: KeyFigureProps) {
  return (
    <div className={`key-figure${emphasis ? ' emphasis' : ''}`}>
      <div className="key-figure-label">{label}</div>
      <div className={`key-figure-value ${className}`}>{value}</div>
      <div className="key-figure-note">{note}</div>
    </div>
  );
}
