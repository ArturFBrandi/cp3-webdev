import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/Section'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function ProjectsPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('meta.projects'))

  return (
    <Section id="projects" title={t('projectsPage.title')}>
      <p>{t('projectsPage.description')}</p>
    </Section>
  )
}
