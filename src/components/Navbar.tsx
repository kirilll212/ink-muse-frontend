import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from './Logo'
import { Avatar } from './Avatar'
import { ThemeSwitcher } from './ThemeSwitcher'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LogoutIcon } from './icons'

/**
 * Active/inactive styling for the primary navigation links.
 */
function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
  }`
}

/**
 * Sticky top navigation: brand, page links, language/theme switchers and the
 * authentication area.
 */
export function Navbar() {
  const { t } = useTranslation()
  const { user, status, logout } = useAuth()
  const isAuthenticated = status === 'authenticated'

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <Link to="/" className="shrink-0" aria-label={t('common.appName')}>
          <Logo />
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/generate" className={navLinkClass}>
            {t('nav.generate')}
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/history" className={navLinkClass}>
              {t('nav.history')}
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />

          {isAuthenticated ? (
            <div className="flex items-center gap-2 border-l border-zinc-200 pl-2 dark:border-zinc-700">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label={t('nav.profile')}
              >
                {user && <Avatar user={user} size={28} />}
                <span className="hidden max-w-[8rem] truncate text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:inline">
                  {user?.fullName}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <LogoutIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-zinc-200 pl-2 dark:border-zinc-700">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
