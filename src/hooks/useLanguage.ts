import { useTranslation } from 'react-i18next'
import { languages, localeTags, type Language } from '@/app/i18n'

function toLanguage(value: string | undefined): Language {
  return languages.find((lng) => lng === value) ?? 'en'
}

export function useLanguage() {
  const { i18n } = useTranslation()
  const language = toLanguage(i18n.resolvedLanguage)

  return {
    language,
    locale: localeTags[language],
    languages,
    setLanguage: (next: Language) => i18n.changeLanguage(next),
  }
}
