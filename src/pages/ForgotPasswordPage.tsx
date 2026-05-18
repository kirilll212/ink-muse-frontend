import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../api/auth'
import { getApiErrorMessage } from '../api/client'
import { AuthCard, FormError } from '../components/AuthCard'
import { TextField } from '../components/TextField'
import { Spinner } from '../components/Spinner'

/**
 * Password reset flow.
 *
 * Step 1 — the user enters their email and the API returns a reset code (this
 * project has no email delivery, so the code is shown on screen).
 * Step 2 — the user confirms the code and picks a new password.
 */
export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const { status } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [expiresInMinutes, setExpiresInMinutes] = useState(15)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to="/generate" replace />
  }

  const handleRequest = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await authApi.forgotPassword(email)
      setCode(result.code)
      setExpiresInMinutes(result.expiresInMinutes)
      setStep('reset')
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authApi.resetPassword({ email, code, password })
      navigate('/login')
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setSubmitting(false)
    }
  }

  const submitButton = (label: string) => (
    <button
      type="submit"
      disabled={submitting}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {submitting && <Spinner className="h-4 w-4" />}
      {submitting ? t('forgotPassword.submitting') : label}
    </button>
  )

  const backToLogin = (
    <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
      <Link
        to="/login"
        className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
      >
        {t('forgotPassword.backToLogin')}
      </Link>
    </p>
  )

  if (step === 'email') {
    return (
      <AuthCard title={t('forgotPassword.title')} subtitle={t('forgotPassword.subtitle')}>
        <form onSubmit={handleRequest} className="space-y-4" noValidate>
          {error && <FormError message={error} />}
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
          {submitButton(t('forgotPassword.emailStepButton'))}
        </form>
        {backToLogin}
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={t('forgotPassword.codeTitle')}
      subtitle={t('forgotPassword.codeSubtitle')}
    >
      <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 p-3 text-center dark:border-brand-500/30 dark:bg-brand-500/10">
        <p className="text-xs font-medium text-brand-700 dark:text-brand-300">
          {t('forgotPassword.codeIssued')}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-[0.3em] text-brand-700 dark:text-brand-200">
          {code}
        </p>
        <p className="mt-1 text-xs text-brand-600/80 dark:text-brand-300/70">
          {t('forgotPassword.codeNote', { minutes: expiresInMinutes })}
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4" noValidate>
        {error && <FormError message={error} />}
        <TextField
          id="code"
          label={t('forgotPassword.codeLabel')}
          value={code}
          onChange={setCode}
          required
        />
        <TextField
          id="new-password"
          type="password"
          label={t('forgotPassword.newPassword')}
          placeholder={t('auth.passwordPlaceholder')}
          hint={t('auth.passwordHint')}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={8}
          required
        />
        {submitButton(t('forgotPassword.resetButton'))}
      </form>
      {backToLogin}
    </AuthCard>
  )
}
