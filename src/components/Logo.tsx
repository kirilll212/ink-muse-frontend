import { SparklesIcon } from './icons'

/**
 * The InkMuse brand mark — a gradient badge with the wordmark.
 */
export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30">
        <SparklesIcon className="h-5 w-5" />
      </span>
      {withText && (
        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          Ink<span className="text-brand-500">Muse</span>
        </span>
      )}
    </span>
  )
}
