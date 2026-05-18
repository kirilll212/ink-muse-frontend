import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../api/client'
import { AuthCard, FormError } from '../components/AuthCard'
import { TextField } from '../components/TextField'
import { Spinner } from '../components/Spinner'

/**
 * Account registration page.
 */
export function RegisterPage() {
  const { t } = useTranslation()
  const { register, status } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to="/generate" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register({ fullName, email, password })
      navigate('/generate')
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title={t('auth.registerTitle')} subtitle={t('auth.registerSubtitle')}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <FormError message={error} />}

        <TextField
          id="fullName"
          label={t('auth.fullName')}
          placeholder={t('auth.fullNamePlaceholder')}
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
          required
        />
        <TextField
          id="email"
          type="email"
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <TextField
          id="password"
          type="password"
          label={t('auth.password')}
          placeholder={t('auth.passwordPlaceholder')}
          hint={t('auth.passwordHint')}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting && <Spinner className="h-4 w-4" />}
          {submitting ? t('auth.submitting') : t('auth.signUp')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {t('auth.goLogin')}
        </Link>
      </p>
    </AuthCard>
  )
}
