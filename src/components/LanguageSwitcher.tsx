import { useI18n } from '../i18n/I18nProvider';
import { LANGUAGES, type Language } from '../i18n/messages';

/** Flag buttons for switching the interface language. */
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  return (
    <div className="language-switcher" role="group" aria-label={t.languageSwitcher}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          className={code === language ? 'on' : ''}
          aria-pressed={code === language}
          title={label}
          onClick={() => setLanguage(code)}
        >
          <Flag language={code} />
          <span className="visually-hidden">{label}</span>
        </button>
      ))}
    </div>
  );
}

// Inline SVG flags: emoji flags are not rendered on Windows.
function Flag({ language }: { language: Language }) {
  if (language === 'pl') {
    return (
      <svg viewBox="0 0 16 10" aria-hidden="true">
        <rect width="16" height="5" fill="#fff" />
        <rect y="5" width="16" height="5" fill="#dc143c" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true">
      <clipPath id="flag-gb-clip">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#flag-gb-clip)" stroke="#c8102e" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}
