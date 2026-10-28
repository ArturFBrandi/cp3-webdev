import { z } from 'zod'

// Shared by the contact form (src/) and the Vercel Function (api/).
// Error messages are i18n keys from src/locales; the form translates them.

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  messageMin: 20,
  messageMax: 2000,
} as const

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'contact.errors.nameRequired')
    .min(CONTACT_LIMITS.nameMin, 'contact.errors.nameMin')
    .max(CONTACT_LIMITS.nameMax, 'contact.errors.nameMax'),
  email: z
    .string()
    .trim()
    .min(1, 'contact.errors.emailRequired')
    .max(CONTACT_LIMITS.emailMax, 'contact.errors.emailInvalid')
    .pipe(z.email('contact.errors.emailInvalid')),
  message: z
    .string()
    .trim()
    .min(1, 'contact.errors.messageRequired')
    .min(CONTACT_LIMITS.messageMin, 'contact.errors.messageMin')
    .max(CONTACT_LIMITS.messageMax, 'contact.errors.messageMax'),
  /** Honeypot: hidden from people, bots tend to fill it. */
  website: z.string().optional(),
})

export type ContactInput = z.input<typeof contactSchema>
export type ContactMessage = z.output<typeof contactSchema>
