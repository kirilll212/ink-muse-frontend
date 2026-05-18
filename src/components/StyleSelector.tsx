import { useTranslation } from 'react-i18next'
import { STYLES } from '../constants/options'
import { OptionGrid } from './OptionGrid'

/**
 * Lets the user pick the artistic style of the tattoo sketch.
 */
export function StyleSelector({
  value,
  onChange,
}: {
  value: string | null
  onChange: (value: string) => void
}) {
  const { t } = useTranslation()

  const options = STYLES.map((style) => ({
    value: style,
    label: t(`styles.${style}`),
  }))

  return (
    <OptionGrid
      options={options}
      value={value}
      onChange={onChange}
      columns="grid-cols-2 sm:grid-cols-3"
    />
  )
}
