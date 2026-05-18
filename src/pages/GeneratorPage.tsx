import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { tattoosApi } from '../api/tattoos'
import { getApiErrorMessage } from '../api/client'
import {
  DEFAULT_HEIGHT_CM,
  DEFAULT_WIDTH_CM,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  SIZE_CM_MAX,
  SIZE_CM_MIN,
} from '../constants/options'
import type { Tattoo } from '../types'
import { BodyPartSelector } from '../components/BodyPartSelector'
import { StyleSelector } from '../components/StyleSelector'
import { SizeSelector } from '../components/SizeSelector'
import { ResultCard } from '../components/ResultCard'
import { TattooEditModal } from '../components/TattooEditModal'
import { FormError } from '../components/AuthCard'
import { Spinner } from '../components/Spinner'
import { ImageIcon, SparklesIcon } from '../components/icons'

/**
 * A numbered step card wrapping one part of the generator form.
 */
function Section({
  index,
  title,
  action,
  children,
}: {
  index: number
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            {index}
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

/**
 * The core feature: pick a body part, style and size, describe the tattoo and
 * generate an AI sketch.
 */
export function GeneratorPage() {
  const { t } = useTranslation()

  const [bodyPart, setBodyPart] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [widthCm, setWidthCm] = useState(DEFAULT_WIDTH_CM)
  const [heightCm, setHeightCm] = useState(DEFAULT_HEIGHT_CM)
  const [description, setDescription] = useState('')

  const [generating, setGenerating] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [result, setResult] = useState<Tattoo | null>(null)
  const [editing, setEditing] = useState<Tattoo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isCm = (value: number) =>
    Number.isFinite(value) && value >= SIZE_CM_MIN && value <= SIZE_CM_MAX
  const sizeValid = isCm(widthCm) && isCm(heightCm)
  const descriptionValid = description.trim().length >= DESCRIPTION_MIN
  const selectionValid = Boolean(bodyPart && style && sizeValid)

  const canSuggest = selectionValid && !suggesting && !generating
  const canGenerate = selectionValid && descriptionValid && !generating && !suggesting

  const handleSizeChange = (nextWidth: number, nextHeight: number) => {
    setWidthCm(nextWidth)
    setHeightCm(nextHeight)
  }

  const handleSuggest = async () => {
    if (!bodyPart || !style || !sizeValid) {
      setError(t('generator.incomplete'))
      return
    }

    setError(null)
    setSuggesting(true)
    try {
      const suggestion = await tattoosApi.suggestPrompt({ bodyPart, style, widthCm, heightCm })
      setDescription(suggestion)
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setSuggesting(false)
    }
  }

  const handleGenerate = async () => {
    if (!bodyPart || !style || !sizeValid || !descriptionValid) {
      setError(t('generator.incomplete'))
      return
    }

    setError(null)
    setGenerating(true)
    try {
      const tattoo = await tattoosApi.generate({
        bodyPart,
        style,
        widthCm,
        heightCm,
        description: description.trim(),
      })
      setResult(tattoo)
      // Auto-open the edit dialog so the user can refine the fresh sketch.
      setEditing(tattoo)
    } catch (err) {
      setError(getApiErrorMessage(err) ?? t('errors.network'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
          {t('generator.title')}
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t('generator.subtitle')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <div className="space-y-4">
          <Section index={1} title={t('generator.bodyPartStep')}>
            <BodyPartSelector value={bodyPart} onChange={setBodyPart} />
          </Section>

          <Section index={2} title={t('generator.styleStep')}>
            <StyleSelector value={style} onChange={setStyle} />
          </Section>

          <Section index={3} title={t('generator.sizeStep')}>
            <SizeSelector widthCm={widthCm} heightCm={heightCm} onChange={handleSizeChange} />
          </Section>

          <Section
            index={4}
            title={t('generator.describeStep')}
            action={
              <button
                type="button"
                onClick={() => void handleSuggest()}
                disabled={!canSuggest}
                title={!selectionValid ? t('generator.suggestNeedsSelection') : undefined}
                className="flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
              >
                {suggesting ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <SparklesIcon className="h-3.5 w-3.5" />
                )}
                {suggesting ? t('generator.suggesting') : t('generator.suggest')}
              </button>
            }
          >
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t('generator.descriptionPlaceholder')}
              maxLength={DESCRIPTION_MAX}
              rows={4}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t('generator.suggestHint')}
              </p>
              <p className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                {t('generator.descriptionHint', {
                  count: description.trim().length,
                  max: DESCRIPTION_MAX,
                })}
              </p>
            </div>
          </Section>

          {error && <FormError message={error} />}

          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={!canGenerate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {generating ? <Spinner className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
            {generating ? t('generator.generating') : t('generator.generate')}
          </button>
        </div>

        {/* Result panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {generating ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <span className="text-brand-500">
                <Spinner className="h-10 w-10" />
              </span>
              <p className="mt-4 font-semibold text-zinc-900 dark:text-white">
                {t('generator.generating')}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t('generator.generatingHint')}
              </p>
            </div>
          ) : result ? (
            <ResultCard
              tattoo={result}
              onRegenerate={() => void handleGenerate()}
              onEdit={() => setEditing(result)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <ImageIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-4 font-semibold text-zinc-900 dark:text-white">
                {t('generator.placeholderTitle')}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t('generator.placeholderText')}
              </p>
            </div>
          )}
        </div>
      </div>

      <TattooEditModal
        tattoo={editing}
        onClose={() => setEditing(null)}
        onUpdated={(updated) => {
          setResult(updated)
          setEditing(updated)
        }}
      />
    </div>
  )
}
