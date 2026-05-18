import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRightIcon, SparklesIcon } from '../components/icons'

/**
 * Marketing landing page: hero with a call-to-action and a 3-step explainer.
 */
export function HomePage() {
  const { t } = useTranslation()
  const { status } = useAuth()
  const isAuthenticated = status === 'authenticated'

  const steps = [
    { title: t('home.step1Title'), text: t('home.step1Text') },
    { title: t('home.step2Title'), text: t('home.step2Text') },
    { title: t('home.step3Title'), text: t('home.step3Text') },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
            <SparklesIcon className="h-3.5 w-3.5" />
            {t('home.badge')}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            {t('home.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-300">
            {t('home.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:opacity-90"
            >
              {t('home.ctaPrimary')}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to={isAuthenticated ? '/history' : '/login'}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {isAuthenticated ? t('home.ctaSecondary') : t('nav.login')}
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-24 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              {index + 1}
            </span>
            <h2 className="mt-4 font-semibold text-zinc-900 dark:text-white">{step.title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{step.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
