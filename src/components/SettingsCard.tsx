import { CURRENCIES, type Currency } from '../data/currencies';
import type { ContributionFrequency } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { currencySymbol } from '../lib/format';
import { NumberInput } from './NumberInput';

interface Props {
  initialAmount: number;
  frequency: ContributionFrequency;
  onInitialAmountChange: (amount: number) => void;
  onFrequencyChange: (frequency: ContributionFrequency) => void;
}

export function SettingsCard({ initialAmount, frequency, onInitialAmountChange, onFrequencyChange }: Props) {
  const { t, currency, setCurrency } = useI18n();
  return (
    <section className="card">
      <div className="grid">
        <label>
          {t.settings.currency}
          <select value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
            {CURRENCIES.map(({ code }) => <option key={code} value={code}>{t.currencies[code]}</option>)}
          </select>
        </label>
        <label>
          {t.settings.initialAmount(currencySymbol(currency))}
          <NumberInput min={0} step={100} value={initialAmount} onChange={onInitialAmountChange} />
        </label>
        <label>
          {t.settings.frequency}
          <select value={frequency} onChange={e => onFrequencyChange(e.target.value as ContributionFrequency)}>
            <option value="month">{t.settings.monthly}</option>
            <option value="year">{t.settings.yearly}</option>
          </select>
        </label>
      </div>
    </section>
  );
}
