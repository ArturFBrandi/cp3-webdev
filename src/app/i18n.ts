import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import pt from '@/locales/pt.json'

export const languages = ['en', 'pt'] as const
export type Language = (typeof languages)[number]

/** BCP 47 tags used for `<html lang>` and `Intl` formatting. */
export const localeTags: Record<Language, string> = { en: 'en-US', pt: 'pt-BR' }

export const LANGUAGE_STORAGE_KEY = 'lang'

export const resources = {
  en: { translation: en },
  pt: { translation: pt },
} as const

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = localeTags[lng as Language] ?? localeTags.en
})

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: languages,
    fallbackLng: 'en',
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      convertDetectedLanguage: (lng) => lng.split('-')[0] ?? lng,
    },
  })

export { i18n }
