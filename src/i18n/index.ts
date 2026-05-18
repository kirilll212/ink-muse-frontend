import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import uk from './locales/uk.json'

/** Languages the UI is translated into. */
export const SUPPORTED_LANGUAGES = ['en', 'uk'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

/** localStorage key under which the chosen language is persisted. */
export const LANGUAGE_STORAGE_KEY = 'language'

/**
 * Resolve the initial language: a previously saved choice, otherwise English.
 */
function getInitialLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return stored === 'uk' || stored === 'en' ? stored : 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

// Keep the <html lang> attribute in sync with the active language.
document.documentElement.lang = i18n.language
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng)
})

export default i18n
