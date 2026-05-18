import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { tattoosApi } from '../api/tattoos'
import { getApiErrorMessage, resolveImageUrl } from '../api/client'
import { downloadImage } from '../lib/download'
import type { Tattoo } from '../types'
import { PageLoader } from '../components/PageLoader'
import { FormError } from '../components/AuthCard'
import { DownloadIcon, ExpandIcon, ImageIcon, TrashIcon } from '../components/icons'
import { Spinner } from '../components/Spinner'
import { TattooDetailModal } from '../components/TattooDetailModal'

/**
 * A single tattoo tile in the gallery grid.
 */
function HistoryCard({
  tattoo,
  onDelete,
  onView,
}: {
  tattoo: Tattoo
  onDelete: (id: number) => void
  onView: (tattoo: Tattoo) => void
}) {
  const { t } = useTranslation()
  const imageUrl = resolveImageUrl(tattoo.imageUrl)
  const [downloading, setDownloading] = useState(false)

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
        onClick={() => onView(tattoo)}
        aria-label={t('history.viewHint')}
        className="group relative block w-full"
      >
        <img
          src={imageUrl}
          alt={tattoo.description}
          className="aspect-square w-full bg-zinc-100 object-cover dark:bg-zinc-950"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
          <ExpandIcon className="h-7 w-7 text-white" />
        </span>
      </button>
      <div className="p-3">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
          {t(`styles.${tattoo.style}`)} · {t(`bodyParts.${tattoo.bodyPart}`)}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
          {tattoo.description}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => void handleDownload()}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-300 px-2 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {downloading ? <Spinner className="h-3.5 w-3.5" /> : <DownloadIcon className="h-3.5 w-3.5" />}
            {t('history.download')}
          </button>
          <button
            type="button"
            onClick={() => onDelete(tattoo.id)}
            aria-label={t('history.delete')}
            className="flex items-center justify-center rounded-lg border border-red-200 px-2.5 py-1.5 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * The user's gallery of previously generated tattoo sketches.
 */
export function HistoryPage() {
  const { t } = useTranslation()
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Tattoo | null>(null)

  useEffect(() => {
    tattoosApi
      .list()
      .then(setTattoos)
      .catch(() => setError('network'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('history.confirmDelete'))) {
      return
    }
    try {
      await tattoosApi.remove(id)
      setTattoos((current) => current.filter((tattoo) => tattoo.id !== id))
    } catch (err) {
      setError(getApiErrorMessage(err) ?? 'network')
    }
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
          {t('history.title')}
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t('history.subtitle')}</p>
      </header>

      {error && (
        <div className="mb-6">
          <FormError message={error === 'network' ? t('errors.network') : error} />
        </div>
      )}

      {tattoos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <ImageIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <p className="mt-4 font-semibold text-zinc-900 dark:text-white">{t('history.empty')}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t('history.emptyText')}</p>
          <Link
            to="/generate"
            className="mt-5 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t('history.emptyCta')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tattoos.map((tattoo) => (
            <HistoryCard
              key={tattoo.id}
              tattoo={tattoo}
              onDelete={handleDelete}
              onView={setSelected}
            />
          ))}
        </div>
      )}

      <TattooDetailModal tattoo={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
