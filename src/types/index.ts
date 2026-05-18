/**
 * Shared API types mirrored from the backend responses.
 */

export interface User {
  id: number
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Tattoo {
  id: number
  bodyPart: string
  style: string
  /** Real-world tattoo width on the body, in centimetres. */
  widthCm: number
  /** Real-world tattoo height on the body, in centimetres. */
  heightCm: number
  description: string
  /** Relative image path returned by the API (e.g. /api/tattoos/images/xxx.jpg). */
  imageUrl: string
  /** Pixel width of the generated image. */
  width: number
  /** Pixel height of the generated image. */
  height: number
  seed: number
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

/** The body part / style / physical size the user has selected. */
export interface TattooSelection {
  bodyPart: string
  style: string
  widthCm: number
  heightCm: number
}

export type GenerateTattooInput = TattooSelection & {
  description: string
}

export type SuggestPromptInput = TattooSelection
