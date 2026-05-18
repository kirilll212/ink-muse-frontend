import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { resolveImageUrl } from '../api/client'
import { downloadImage } from '../lib/download'
import type { Tattoo } from '../types'
import { DownloadIcon, EditIcon, ExpandIcon, SparklesIcon } from './icons'
import { Spinner } from './Spinner'
import { TattooDetailModal } from './TattooDetailModal'

/**
 * Displays a freshly generated tattoo sketch with edit / download / regenerate
 * actions. Tapping the image opens a full detail view.
 */
export function ResultCard({
  tattoo,
  onRegenerate,
  onEdit,
}: {
  tattoo: Tattoo
  onRegenerate: () => void
  onEdit: () => void
}) {
  const { t } = useTranslation()
  const [downloading, setDownloading] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const imageUrl = resolveImageUrl(tattoo.imageUrl)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadImage(imageUrl, `inkmuse-tattoo-${tattoo.id}.jpg`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setShowDetail(true)}
        aria-label={t('history.viewHint')}
        className="group relative block w-full bg-zinc-100 p-3 dark:bg-zinc-950"
      >
        <img
          src={imageUrl}
          alt={tattoo.description}
          className="mx-auto block w-full max-w-md rounded-xl"
        />
        <span className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-xl bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
          <ExpandIcon className="h-7 w-7 text-white" />
        </span>
      </button>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            {t('generator.resultTitle')}
          </h3>
          <p className="text-sm capitalize text-zinc-500 dark:text-zinc-400">
            {t('generator.resultMeta', {
              style: t(`styles.${tattoo.style}`),
              bodyPart: t(`bodyParts.${tattoo.bodyPart}`),
              size: `${tattoo.widthCm}×${tattoo.heightCm} cm`,
            })}
          </p>
        </div>

        <p className="rounded-lg bg-zinc-50 p-3 text-sm italic text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
          “{tattoo.description}”
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <EditIcon className="h-4 w-4" />
            {t('edit.open')}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {downloading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <DownloadIcon className="h-4 w-4" />
              )}
              {t('generator.download')}
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <SparklesIcon className="h-4 w-4" />
              {t('generator.regenerate')}
            </button>
          </div>
        </div>
      </div>

      <TattooDetailModal
        tattoo={showDetail ? tattoo : null}
        onClose={() => setShowDetail(false)}
      />
    </div>
  )
}
