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

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
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
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      })
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

        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="firstName"
            label={t('auth.firstName')}
            placeholder={t('auth.firstNamePlaceholder')}
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
            required
          />
          <TextField
            id="lastName"
            label={t('auth.lastName')}
            placeholder={t('auth.lastNamePlaceholder')}
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
            required
          />
        </div>
        <TextField
          id="username"
          label={t('auth.username')}
          placeholder={t('auth.usernamePlaceholder')}
          hint={t('auth.usernameHint')}
          value={username}
          onChange={setUsername}
          autoComplete="username"
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
