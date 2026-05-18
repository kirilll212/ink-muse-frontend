import axios from 'axios'

/** localStorage key under which the access token is persisted. */
export const TOKEN_STORAGE_KEY = 'auth_token'

/** Base URL of the backend; falls back to the local dev server. */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

/**
 * Shared axios instance. Every request is automatically authenticated with the
 * stored bearer token (when present).
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Turn a relative image path from the API into an absolute URL the browser
 * can load directly inside an `<img>` tag.
 */
export function resolveImageUrl(path: string): string {
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`
}

/**
 * Extract a human-readable error message from a failed API call. The backend
 * returns errors as `{ errors: [{ message }] }`.
 */
export function getApiErrorMessage(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { errors?: { message?: string }[]; message?: string }
      | undefined

    return data?.errors?.[0]?.message ?? data?.message
  }
  return undefined
}
