import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'auth.errors.emailRequired')
    .pipe(z.email('auth.errors.emailInvalid')),
  password: z.string().min(1, 'auth.errors.passwordRequired'),
})

export type LoginInput = z.input<typeof loginSchema>
