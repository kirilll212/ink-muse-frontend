import { useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useAuth } from '../contexts/AuthContext'
import { profileApi } from '../api/profile'
import { getApiErrorMessage } from '../api/client'
import { TextField } from '../components/TextField'
import { Avatar } from '../components/Avatar'
import { FormError } from '../components/AuthCard'
import { Spinner } from '../components/Spinner'

/**
 * Profile editing page — name, username, phone and avatar.
 */
export function ProfilePage() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [phone, setPhone] = useState<string | undefined>(user?.phone ?? undefined)

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  if (!user) {
    return null
  }

  const handleAvatarPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    setError(null)
    setUploading(true)
    try {
      updateUser(await profileApi.uploadAvatar(file))
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSaved(false)

    if (phone && !isValidPhoneNumber(phone)) {
      setError(t('profile.invalidPhone'))
      return
    }

    setSaving(true)
    try {
      const updated = await profileApi.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        phone: phone ?? null,
      })
      updateUser(updated)
      setSaved(true)
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t('profile.subtitle')}
        </p>
      </header>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar user={{ firstName, lastName, username, avatarUrl: user.avatarUrl }} size={72} />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Spinner className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {uploading ? t('profile.uploading') : t('profile.changeAvatar')}
            </button>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t('profile.avatarHint')}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => void handleAvatarPick(event)}
          />
        </div>

        {error && <FormError message={error} />}
        {saved && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {t('profile.saved')}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="firstName"
            label={t('auth.firstName')}
            value={firstName}
            onChange={setFirstName}
            required
          />
          <TextField
            id="lastName"
            label={t('auth.lastName')}
            value={lastName}
            onChange={setLastName}
            required
          />
        </div>

        <TextField
          id="username"
          label={t('auth.username')}
          hint={t('auth.usernameHint')}
          value={username}
          onChange={setUsername}
          required
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {t('auth.phone')}
          </label>
          <div className="inkmuse-phone rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
            <PhoneInput
              international
              defaultCountry="UA"
              value={phone}
              onChange={setPhone}
              placeholder={t('profile.phonePlaceholder')}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {t('auth.email')}
          </label>
          <input
            value={user.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t('profile.emailNote')}
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {saving && <Spinner className="h-4 w-4" />}
          {saving ? t('profile.saving') : t('profile.save')}
        </button>
      </form>
    </div>
  )
}
