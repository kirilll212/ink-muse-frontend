import { useTranslation } from 'react-i18next'
import { useTheme, type Theme } from '../contexts/ThemeContext'
import { MoonIcon, MonitorIcon, SunIcon } from './icons'

/**
 * Segmented control for picking the light / dark / system theme.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  const options: { value: Theme; icon: typeof SunIcon; label: string }[] = [
    { value: 'light', icon: SunIcon, label: t('theme.light') },
    { value: 'dark', icon: MoonIcon, label: t('theme.dark') },
    { value: 'system', icon: MonitorIcon, label: t('theme.system') },
  ]

  return (
    <div
      role="group"
      aria-label={t('theme.label')}
      className="flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 dark:border-zinc-700 dark:bg-zinc-800/80"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          title={label}
          aria-label={label}
          aria-pressed={theme === value}
          className={`rounded-md p-1.5 transition ${
            theme === value
              ? 'bg-white text-brand-600 shadow-sm dark:bg-zinc-950 dark:text-brand-400'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
