import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { resolveImageUrl } from '../api/client'
import { downloadImage } from '../lib/download'
import type { Tattoo } from '../types'
import { CloseIcon, DownloadIcon } from './icons'
import { Spinner } from './Spinner'

/**
 * Full-screen detail view for a single tattoo sketch: an enlarged image plus
 * all of its metadata. Rendered as an overlay; pass `tattoo = null` to hide it.
 */
export function TattooDetailModal({
  tattoo,
  onClose,
}: {
  tattoo: Tattoo | null
  onClose: () => void
}) {
  const { t, i18n } = useTranslation()
  const [downloading, setDownloading] = useState(false)

  // Close on Escape and lock background scrolling while the modal is open.
  useEffect(() => {
    if (!tattoo) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [tattoo, onClose])

  if (!tattoo) {
    return null
  }

  const imageUrl = resolveImageUrl(tattoo.imageUrl)
  const created = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(tattoo.createdAt))

  const rows: [string, string][] = [
    [t('detail.style'), t(`styles.${tattoo.style}`)],
    [t('detail.bodyPart'), t(`bodyParts.${tattoo.bodyPart}`)],
    [t('detail.tattooSize'), `${tattoo.widthCm} × ${tattoo.heightCm} cm`],
    [t('detail.imageSize'), `${tattoo.width} × ${tattoo.height} px`],
    [t('detail.seed'), String(tattoo.seed)],
    [t('detail.created'), created],
  ]

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadImage(imageUrl, `inkmuse-tattoo-${tattoo.id}.jpg`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            {t('detail.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('detail.close')}
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="bg-zinc-100 p-4 dark:bg-zinc-950">
            <img
              src={imageUrl}
              alt={tattoo.description}
              className="mx-auto block max-h-[55vh] w-auto rounded-xl"
            />
          </div>

          <div className="space-y-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                {t('detail.description')}
              </p>
              <p className="mt-1 text-sm italic text-zinc-700 dark:text-zinc-300">
                “{tattoo.description}”
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-sm text-zinc-800 dark:text-zinc-100">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {downloading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <DownloadIcon className="h-4 w-4" />
              )}
              {t('detail.download')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
