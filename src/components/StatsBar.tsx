import type { Summary } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { signClass } from '../lib/format';

export function StatsBar({ summary }: { summary: Summary }) {
  const { t, format } = useI18n();
  return (
    <>
      <section className="stats">
        <Stat label={t.stats.finalValue} value={format.currency(summary.finalValue)} />
        <Stat label={t.stats.totalPaid} value={format.currency(summary.totalPaid)} />
        <Stat label={t.stats.profit} value={format.currency(summary.profit)} className={signClass(summary.profit)} />
        <Stat label={t.stats.averageReturn} value={format.percent(summary.averageReturn)} />
        <Stat label={t.stats.realValue} value={format.currency(summary.realValue)} real />
        <Stat
          label={t.stats.realProfit} value={format.currency(summary.realProfit)}
          className={signClass(summary.realProfit)} real
        />
      </section>
      <p className="hint spaced">{t.stats.realHint}</p>
    </>
  );
}

interface StatProps {
  label: string;
  value: string;
  className?: string;
  real?: boolean;
}

function Stat({ label, value, className = '', real = false }: StatProps) {
  return (
    <div className={`stat${real ? ' real' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${className}`}>{value}</div>
    </div>
  );
}
