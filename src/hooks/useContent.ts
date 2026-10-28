import type { Language } from '@/app/i18n'
import { content as en } from '@/content/en'
import { content as pt } from '@/content/pt'
import type { Content } from '@/types/content'
import { useLanguage } from './useLanguage'

const contentByLanguage: Record<Language, Content> = { en, pt }

export function useContent(): Content {
  const { language } = useLanguage()
  return contentByLanguage[language]
}
