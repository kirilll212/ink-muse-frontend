import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Fallback page shown for unknown routes.
 */
export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
        {t('notFound.title')}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t('notFound.text')}</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {t('notFound.cta')}
      </Link>
    </div>
  )
}
