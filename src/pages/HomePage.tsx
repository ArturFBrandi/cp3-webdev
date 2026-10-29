import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { InDevelopment } from '@/components/sections/InDevelopment'
import { Skills } from '@/components/sections/Skills'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()
  useDocumentTitle(t('meta.home'))

  return (
    <>
      <Hero />
      <InDevelopment />
      <Skills />
      <Experience />
    </>
  )
}
