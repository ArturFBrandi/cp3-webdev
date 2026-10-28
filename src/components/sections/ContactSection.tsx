import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/Section'
import { ContactForm } from './ContactForm'
import styles from './ContactSection.module.css'

export function ContactSection() {
  const { t } = useTranslation()

  return (
    <Section id="contact" title={t('sections.contact')}>
      <p className={styles.intro}>{t('contact.intro')}</p>
      <ContactForm />
    </Section>
  )
}
