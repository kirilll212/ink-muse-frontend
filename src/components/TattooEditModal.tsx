import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { resolveImageUrl, getApiErrorMessage } from '../api/client'
import { tattoosApi } from '../api/tattoos'
import { DESCRIPTION_MAX, DESCRIPTION_MIN } from '../constants/options'
import type { Tattoo } from '../types'
import { CloseIcon, SparklesIcon } from './icons'
import { Spinner } from './Spinner'

/**
 * Dialog shown right after a sketch is generated. It displays the image and a
 * text field; the user describes the changes they want and the AI redraws the
 * tattoo, updating the same record. Pass `tattoo = null` to hide it.
 */
export function TattooEditModal({
  tattoo,
  onClose,
  onUpdated,
}: {
  tattoo: Tattoo | null
  onClose: () => void
  onUpdated: (tattoo: Tattoo) => void
}) {
  const { t } = useTranslation()
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync the field whenever a new (or freshly edited) tattoo is shown.
  useEffect(() => {
    if (tattoo) {
      setDescription(tattoo.description)
      setError(null)
    }
  }, [tattoo?.id, tattoo?.description])

  // Close on Escape and lock background scrolling while open.
  useEffect(() => {
    if (!tattoo) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [tattoo, saving, onClose])

  if (!tattoo) {
    return null
  }

  const imageUrl = resolveImageUrl(tattoo.imageUrl)
  const trimmed = description.trim()
  const canApply = trimmed.length >= DESCRIPTION_MIN && !saving

  const handleApply = async () => {
    if (!canApply) {
      return
    }
    setError(null)
    setSaving(true)
    try {
      const updated = await tattoosApi.edit(tattoo.id, trimmed)
      onUpdated(updated)
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !saving && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              {t('edit.title')}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('edit.subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label={t('detail.close')}
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="relative bg-zinc-100 p-4 dark:bg-zinc-950">
            <img
              src={imageUrl}
              alt={tattoo.description}
              className="mx-auto block max-h-[45vh] w-auto rounded-xl"
            />
            {saving && (
              <div className="absolute inset-4 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/55">
                <Spinner className="h-8 w-8 text-white" />
                <span className="text-sm font-medium text-white">{t('edit.applying')}</span>
              </div>
            )}
          </div>

          <div className="space-y-3 p-5">
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              {t('edit.descriptionLabel')}
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={saving}
              maxLength={DESCRIPTION_MAX}
              rows={4}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <p className="text-right text-xs text-zinc-500 dark:text-zinc-400">
              {t('generator.descriptionHint', { count: trimmed.length, max: DESCRIPTION_MAX })}
            </p>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {t('edit.done')}
              </button>
              <button
                type="button"
                onClick={() => void handleApply()}
                disabled={!canApply}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Spinner className="h-4 w-4" /> : <SparklesIcon className="h-4 w-4" />}
                {saving ? t('edit.applying') : t('edit.apply')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
