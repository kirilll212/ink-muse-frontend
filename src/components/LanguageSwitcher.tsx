import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n'

/**
 * Segmented control for switching the UI language (English / Ukrainian).
 */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800/80"
    >
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current.startsWith(lng)}
          className={`rounded-md px-2 py-1 uppercase transition ${
            current.startsWith(lng)
              ? 'bg-white text-brand-600 shadow-sm dark:bg-zinc-950 dark:text-brand-400'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  )
}
