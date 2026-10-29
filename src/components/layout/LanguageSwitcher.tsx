import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import styles from './LanguageSwitcher.module.css'

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const { language, languages, setLanguage } = useLanguage()

  return (
    <fieldset className={styles.group}>
      <legend className="visually-hidden">{t('language.label')}</legend>
      {languages.map((lng) => (
        <button
          key={lng}
          type="button"
          lang={lng}
          className={styles.option}
          aria-pressed={lng === language}
          aria-label={t('language.switchTo', { language: t(`language.${lng}`) })}
          onClick={() => void setLanguage(lng)}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </fieldset>
  )
}
