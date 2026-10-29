import { createClient } from '@supabase/supabase-js'
import type { ContactMessage } from '../../src/schemas/contact.js'
import type { ContactDeps } from './handleContact.js'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

async function saveMessage({ name, email, message }: ContactMessage) {
  const supabase = createClient(
    process.env.SUPABASE_URL ?? requireEnv('VITE_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } },
  )
  const { error } = await supabase.from('messages').insert({ name, email, message })
  if (error) throw new Error(error.message)
}

async function sendEmail({ name, email, message }: ContactMessage) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
      to: [requireEnv('CONTACT_TO_EMAIL')],
      reply_to: email,
      subject: `New portfolio message from ${name}`,
      // Plain text only: visitor input is never interpreted as HTML.
      text: `${message}\n\n— ${name} <${email}>`,
    }),
  })
  if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`)
}

export const contactDeps: ContactDeps = { saveMessage, sendEmail }
