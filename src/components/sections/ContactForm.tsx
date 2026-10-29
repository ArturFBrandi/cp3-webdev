import { zodResolver } from '@hookform/resolvers/zod'
import type { ParseKeys } from 'i18next'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { owner } from '@/content/shared'
import { useSendContactMessage } from '@/hooks/useSendContactMessage'
import { contactSchema, type ContactInput, type ContactMessage } from '@/schemas/contact'
import styles from './ContactForm.module.css'

export function ContactForm() {
  const { t } = useTranslation()
  const sendMessage = useSendContactMessage()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactMessage>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', message: '', website: '' },
  })

  const errorText = (field: keyof ContactInput) => {
    const key = errors[field]?.message
    return key ? t(key as ParseKeys) : undefined
  }

  const onSubmit = handleSubmit((values) => {
    sendMessage.mutate(values, { onSuccess: () => reset() })
  })

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <FormField id="contact-name" label={t('contact.fields.name')} error={errorText('name')}>
          {(control) => (
            <input {...control} type="text" autoComplete="name" {...register('name')} />
          )}
        </FormField>
        <FormField id="contact-email" label={t('contact.fields.email')} error={errorText('email')}>
          {(control) => (
            <input
              {...control}
              type="email"
              autoComplete="email"
              inputMode="email"
              {...register('email')}
            />
          )}
        </FormField>
      </div>
      <FormField
        id="contact-message"
        label={t('contact.fields.message')}
        hint={t('contact.fields.messageHint')}
        error={errorText('message')}
      >
        {(control) => <textarea {...control} rows={6} {...register('message')} />}
      </FormField>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">{t('contact.honeypot')}</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      {sendMessage.isSuccess && <Alert tone="success">{t('contact.success')}</Alert>}
      {sendMessage.isError && (
        <Alert tone="error">{t('contact.failure', { email: owner.email })}</Alert>
      )}

      <div className={styles.actions}>
        <Button type="submit" loading={sendMessage.isPending}>
          {sendMessage.isPending ? t('contact.sending') : t('contact.submit')}
        </Button>
      </div>
    </form>
  )
}
