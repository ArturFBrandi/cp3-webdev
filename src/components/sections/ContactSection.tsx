import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/Section'
import { Skeleton } from '@/components/ui/Skeleton'
import styles from './ContactSection.module.css'

// The form (React Hook Form + Zod) is below the fold: load it after first paint.
const ContactForm = lazy(() =>
  import('./ContactForm').then((module) => ({ default: module.ContactForm })),
)

export function ContactSection() {
  const { t } = useTranslation()

  return (
    <Section id="contact" title={t('sections.contact')}>
      <p className={styles.intro}>{t('contact.intro')}</p>
      <Suspense fallback={<Skeleton className={styles.formSkeleton} />}>
        <ContactForm />
      </Suspense>
    </Section>
  )
}
