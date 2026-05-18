import { useTranslation } from 'react-i18next'
import { SIZE_CM_MAX, SIZE_CM_MIN, SIZE_PRESETS } from '../constants/options'

/**
 * One labelled centimetre input (width or height).
 */
function CmField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={SIZE_CM_MIN}
          max={SIZE_CM_MAX}
          step={0.5}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
          cm
        </span>
      </div>
    </div>
  )
}

/**
 * Lets the user enter the real-world size of the tattoo on their body
 * (width × height in centimetres), with a few quick-pick presets.
 */
export function SizeSelector({
  widthCm,
  heightCm,
  onChange,
}: {
  widthCm: number
  heightCm: number
  onChange: (widthCm: number, heightCm: number) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('size.hint')}</p>

      <div className="flex items-end gap-3">
        <CmField
          id="tattoo-width"
          label={t('size.widthLabel')}
          value={widthCm}
          onChange={(value) => onChange(value, heightCm)}
        />
        <span className="pb-2 text-sm text-zinc-400">×</span>
        <CmField
          id="tattoo-height"
          label={t('size.heightLabel')}
          value={heightCm}
          onChange={(value) => onChange(widthCm, value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SIZE_PRESETS.map((preset) => {
          const isActive = preset.widthCm === widthCm && preset.heightCm === heightCm
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => onChange(preset.widthCm, preset.heightCm)}
              aria-pressed={isActive}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-brand-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-brand-700'
              }`}
            >
              {t(`sizePresets.${preset.key}`)} · {preset.widthCm}×{preset.heightCm} cm
            </button>
          )
        })}
      </div>
    </div>
  )
}
