import type { ContributionFrequency } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { NumberInput } from './NumberInput';

interface Props {
  initialAmount: number;
  frequency: ContributionFrequency;
  onInitialAmountChange: (amount: number) => void;
  onFrequencyChange: (frequency: ContributionFrequency) => void;
}

export function SettingsCard({ initialAmount, frequency, onInitialAmountChange, onFrequencyChange }: Props) {
  const { t } = useI18n();
  return (
    <section className="card">
      <div className="grid">
        <label>
          {t.settings.initialAmount}
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
