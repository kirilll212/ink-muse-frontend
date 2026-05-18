/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the AdonisJS backend, e.g. http://localhost:3333 */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
