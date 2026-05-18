import { useTranslation } from 'react-i18next'
import { BODY_PARTS } from '../constants/options'
import { OptionGrid } from './OptionGrid'

/**
 * Lets the user pick the body part the tattoo is designed for.
 */
export function BodyPartSelector({
  value,
  onChange,
}: {
  value: string | null
  onChange: (value: string) => void
}) {
  const { t } = useTranslation()

  const options = BODY_PARTS.map((part) => ({
    value: part,
    label: t(`bodyParts.${part}`),
  }))

  return (
    <OptionGrid
      options={options}
      value={value}
      onChange={onChange}
      columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    />
  )
}
