import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from './Navbar'

/**
 * App shell: sticky navbar, routed page content and a footer.
 */
export function Layout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>
          {t('common.appName')} — {t('footer.builtWith')}
        </p>
      </footer>
    </div>
  )
}
