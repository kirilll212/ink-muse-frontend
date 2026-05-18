import { CheckIcon } from './icons'

export interface OptionItem {
  value: string
  label: string
  description?: string
}

interface OptionGridProps {
  options: OptionItem[]
  value: string | null
  onChange: (value: string) => void
  /** Tailwind grid-cols utility classes controlling the layout. */
  columns?: string
}

/**
 * Reusable grid of single-select cards. Used by every option picker on the
 * generator page (body part, style, size).
 */
export function OptionGrid({
  options,
  value,
  onChange,
  columns = 'grid-cols-2 sm:grid-cols-3',
}: OptionGridProps) {
  return (
    <div className={`grid gap-2 ${columns}`}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`relative rounded-xl border p-3 text-left transition ${
              isActive
                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/40 dark:bg-brand-500/10'
                : 'border-zinc-200 bg-white hover:border-brand-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-brand-700'
            }`}
          >
            <span
              className={`block text-sm font-semibold ${
                isActive
                  ? 'text-brand-700 dark:text-brand-300'
                  : 'text-zinc-800 dark:text-zinc-100'
              }`}
            >
              {option.label}
            </span>
            {option.description && (
              <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                {option.description}
              </span>
            )}
            {isActive && (
              <CheckIcon className="absolute right-2 top-2 h-4 w-4 text-brand-500" />
            )}
          </button>
        )
      })}
    </div>
  )
}
