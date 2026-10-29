import { zodResolver } from '@hookform/resolvers/zod'
import type { ParseKeys } from 'i18next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { loginSchema, type LoginInput } from '@/schemas/login'
import { InvalidCredentialsError } from '@/services/auth'
import { safeRedirect } from '@/utils/redirect'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('meta.login'))
  const { status, signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = safeRedirect(searchParams.get('redirect'))
  const [submitError, setSubmitError] = useState<ParseKeys | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })

  if (status === 'loading') return <Spinner label={t('auth.checking')} />
  if (status === 'authenticated') return <Navigate to={redirectTo} replace />

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setSubmitError(null)
    try {
      await signIn(email, password)
      await navigate(redirectTo, { replace: true })
    } catch (error) {
      setSubmitError(
        error instanceof InvalidCredentialsError
          ? 'auth.errors.invalidCredentials'
          : 'auth.errors.generic',
      )
    }
  })

  const errorText = (field: keyof LoginInput) => {
    const key = errors[field]?.message
    return key ? t(key as ParseKeys) : undefined
  }

  return (
    <section className={styles.page} aria-labelledby="login-title">
      <h1 id="login-title" className={styles.title}>
        {t('auth.title')}
      </h1>
      <p className={styles.description}>{t('auth.description')}</p>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <FormField id="login-email" label={t('auth.email')} error={errorText('email')}>
          {(control) => (
            <input {...control} type="email" autoComplete="username" {...register('email')} />
          )}
        </FormField>
        <FormField id="login-password" label={t('auth.password')} error={errorText('password')}>
          {(control) => (
            <input
              {...control}
              type="password"
              autoComplete="current-password"
              {...register('password')}
            />
          )}
        </FormField>
        {submitError && <Alert tone="error">{t(submitError)}</Alert>}
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? t('auth.submitting') : t('auth.submit')}
        </Button>
      </form>
    </section>
  )
}
