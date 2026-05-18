/**
 * Tattoo generation options. The keys are stable identifiers sent to the API;
 * their human-readable labels are resolved through i18n (see locale files).
 *
 * These lists must stay in sync with the backend constants in
 * `backend/app/constants/tattoo_options.ts`.
 */

export const BODY_PARTS = [
  'arm',
  'forearm',
  'shoulder',
  'chest',
  'back',
  'leg',
  'calf',
  'ankle',
  'wrist',
  'hand',
  'neck',
  'ribs',
] as const

export const STYLES = [
  'line-art',
  'minimalist',
  'geometric',
  'traditional',
  'neo-traditional',
  'realistic',
  'blackwork',
  'dotwork',
  'tribal',
  'watercolor',
  'japanese',
  'new-school',
  'sketch',
  'ornamental',
  'surrealism',
  'engraving',
  'biomechanical',
  'trash-polka',
] as const

export type BodyPart = (typeof BODY_PARTS)[number]
export type Style = (typeof STYLES)[number]

/** Allowed range, in centimetres, for the physical tattoo size. */
export const SIZE_CM_MIN = 1
export const SIZE_CM_MAX = 60

/** Default physical tattoo size shown when the generator opens. */
export const DEFAULT_WIDTH_CM = 8
export const DEFAULT_HEIGHT_CM = 5

/**
 * Quick-pick presets for the size step: `[label, widthCm, heightCm]`.
 * Labels are resolved through i18n (`sizePresets.*`).
 */
export const SIZE_PRESETS = [
  { key: 'tiny', widthCm: 4, heightCm: 4 },
  { key: 'small', widthCm: 8, heightCm: 5 },
  { key: 'medium', widthCm: 15, heightCm: 12 },
  { key: 'large', widthCm: 25, heightCm: 20 },
] as const

/** Minimum / maximum length accepted for the description field. */
export const DESCRIPTION_MIN = 3
export const DESCRIPTION_MAX = 500
