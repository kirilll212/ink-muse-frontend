import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { STYLES, type Style } from '../constants/options'
import { CloseIcon } from './icons'
import { Spinner } from './Spinner'

/**
 * Path of the pre-rendered preview shipped in `public/style-examples/`.
 *
 * Each preview uses an iconic subject for its style (e.g. a Sailor Jerry
 * swallow for Traditional, a koi for Japanese) — generated once and committed,
 * so the dialog opens instantly and looks the same every time.
 */
function sampleUrl(style: Style): string {
  return `/style-examples/${style}.jpg`
}

/** One tile in the style grid, with a skeleton until the image loads. */
function ExampleTile({
  style,
  selectable,
  onSelect,
}: {
  style: Style
  selectable: boolean
  onSelect: (style: Style) => void
}) {
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  const Tag = selectable ? 'button' : 'div'

  return (
    <Tag
      type={selectable ? 'button' : undefined}
      onClick={selectable ? () => onSelect(style) : undefined}
      className={
        'group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-left dark:border-zinc-800 dark:bg-zinc-950' +
        (selectable
          ? ' cursor-pointer transition hover:border-brand-400 hover:shadow-md dark:hover:border-brand-500'
          : '')
      }
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {!loaded && !errored && (
          <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
            <Spinner className="h-6 w-6 text-zinc-400" />
          </div>
        )}
        {errored && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-fuchsia-50 dark:from-brand-500/10 dark:via-zinc-900 dark:to-fuchsia-500/10">
            <span className="text-3xl font-black uppercase tracking-tight text-zinc-300 dark:text-zinc-700">
              {t(`styles.${style}`)}
            </span>
          </div>
        )}
        <img
          src={sampleUrl(style)}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={
            'h-full w-full object-cover transition-opacity duration-300 group-hover:scale-[1.02] ' +
            (loaded ? 'opacity-100' : 'opacity-0')
          }
        />
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
          {t(`styles.${style}`)}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-zinc-500 dark:text-zinc-400">
          {t(`styleDescriptions.${style}`)}
        </p>
      </div>
    </Tag>
  )
}

/**
 * A reference dialog showing one pre-rendered example per style. Clicking a
 * card selects that style and closes the modal.
 */
export function StyleExamplesModal({
  open,
  onClose,
  onPick,
}: {
  open: boolean
  onClose: () => void
  onPick?: (style: Style) => void
}) {
  const { t } = useTranslation()

  // Close on Escape; lock background scroll while open.
  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  const handleSelect = (picked: Style) => {
    onPick?.(picked)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="style-examples-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <div>
            <h2
              id="style-examples-title"
              className="font-semibold text-zinc-900 dark:text-white"
            >
              {t('styleExamples.title')}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t('styleExamples.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('detail.close')}
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {STYLES.map((style) => (
              <ExampleTile
                key={style}
                style={style}
                selectable={Boolean(onPick)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
