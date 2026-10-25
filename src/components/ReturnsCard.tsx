import type { MarketAsset } from '../data/assets';
import type { MarketData } from '../domain/currency';
import { availableLengths, availableRange, availableStartYears, fitWindow } from '../domain/historical';
import type { ReturnsMode } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { NumberInput } from './NumberInput';

export interface HistoricalChoice {
  assetId: string;
  years: number;
  firstYear: number;
}

/** An asset together with its data in the investor's currency. */
export interface AssetOption {
  asset: MarketAsset;
  data: MarketData;
}

interface Props {
  mode: ReturnsMode;
  ownInflation: number;
  historical: HistoricalChoice;
  /** All assets, with data already converted into the selected currency. */
  options: AssetOption[];
  selected: AssetOption;
  /** Assets that have data for the whole selected range of years. */
  compareCandidates: AssetOption[];
  compareId: string | null;
  /** Total years covered by contribution periods – used to explain extension or truncation. */
  periodYears: number;
  onModeChange: (mode: ReturnsMode) => void;
  onOwnInflationChange: (inflation: number) => void;
  onHistoricalChange: (choice: HistoricalChoice) => void;
  onCompareChange: (id: string | null) => void;
}

export function ReturnsCard(props: Props) {
  const { mode, ownInflation, onModeChange, onOwnInflationChange } = props;
  const { t } = useI18n();
  return (
    <section className="card">
      <h2>{t.returns.title}</h2>
      <div className="segmented" role="group">
        <button className={mode === 'own' ? 'on' : ''} onClick={() => onModeChange('own')}>
          {t.returns.modeOwn}
        </button>
        <button className={mode === 'historical' ? 'on' : ''} onClick={() => onModeChange('historical')}>
          {t.returns.modeHistorical}
        </button>
      </div>

      {mode === 'own' ? (
        <div className="grid">
          <label>
            {t.returns.inflation}
            <NumberInput step={0.1} value={ownInflation} onChange={onOwnInflationChange} />
          </label>
        </div>
      ) : (
        <HistoricalPicker {...props} />
      )}
    </section>
  );
}

/** Options grouped into indices and ETFs. */
function AssetOptions({ options }: { options: AssetOption[] }) {
  const { t } = useI18n();
  return (
    <>
      {(['index', 'etf'] as const).map(kind => {
        const group = options.filter(({ asset }) => asset.kind === kind);
        if (group.length === 0) return null;
        return (
          <optgroup key={kind} label={t.returns.groups[kind]}>
            {group.map(({ asset, data }) => {
              const [first, last] = availableRange(data);
              return (
                <option key={asset.returns.id} value={asset.returns.id}>
                  {t.series[asset.returns.id]}, {first}–{last}
                </option>
              );
            })}
          </optgroup>
        );
      })}
    </>
  );
}

function HistoricalPicker({
  historical, options, selected, compareCandidates, compareId, periodYears, onHistoricalChange, onCompareChange,
}: Props) {
  const { t, currency } = useI18n();
  const { asset, data } = selected;
  const lengths = availableLengths(data);
  const maxLength = lengths.at(-1);
  const startYears = availableStartYears(data, historical.years);
  const [from, to] = availableRange(data);

  // When the asset or length changes, keep the current selection if it is still possible
  const changeAsset = (assetId: string) => {
    const next = options.find(option => option.asset.returns.id === assetId)!;
    onHistoricalChange({ assetId, ...fitWindow(next.data, historical.years, historical.firstYear) });
  };
  const changeYears = (years: number) =>
    onHistoricalChange({ ...historical, ...fitWindow(data, years, historical.firstYear) });

  const notes = [
    t.returns.note(currency, t.inflation[data.inflation.id], from, to),
    asset.currency !== currency && t.returns.noteConverted(asset.currency, currency),
    asset.kind === 'etf' && t.returns.noteEtf,
    periodYears < historical.years && t.returns.noteExtended(periodYears, historical.years - periodYears),
    periodYears > historical.years && t.returns.noteTruncated(periodYears, historical.years),
    compareCandidates.length === 0 && t.returns.noteNoComparison,
  ];

  return (
    <>
      <div className="grid">
        <label>
          {t.returns.asset}
          <select value={historical.assetId} onChange={e => changeAsset(e.target.value)}>
            <AssetOptions options={options} />
          </select>
        </label>
        <label>
          {t.returns.years}
          <select value={historical.years} onChange={e => changeYears(Number(e.target.value))}>
            {lengths.map(length => (
              <option key={length} value={length}>{t.returns.yearsOption(length, length === maxLength)}</option>
            ))}
          </select>
        </label>
        <label>
          {t.returns.firstYear}
          <select
            value={historical.firstYear}
            onChange={e => onHistoricalChange({ ...historical, firstYear: Number(e.target.value) })}
          >
            {startYears.map(year => (
              <option key={year} value={year}>{year}–{year + historical.years - 1}</option>
            ))}
          </select>
        </label>
        <label>
          {t.returns.compareWith}
          <select value={compareId ?? ''} onChange={e => onCompareChange(e.target.value || null)}>
            <option value="">{t.returns.noComparison}</option>
            <AssetOptions options={compareCandidates} />
          </select>
        </label>
      </div>
      <p className="hint spaced">{notes.filter(Boolean).join(' ')}</p>
    </>
  );
}
