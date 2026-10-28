import { contactSchema, type ContactMessage } from '../../src/schemas/contact.js'

export interface ContactDeps {
  saveMessage: (message: ContactMessage) => Promise<void>
  sendEmail: (message: ContactMessage) => Promise<void>
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

/**
 * Validates a contact request, stores it and emails the owner.
 * Storing is required; if only the email fails, the message is still in the dashboard.
 */
export async function handleContact(request: Request, deps: ContactDeps): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    const fields = Object.fromEntries(
      parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
    )
    return json({ error: 'validation', fields }, 400)
  }

  // Honeypot filled: pretend it worked so bots don't retry.
  if (parsed.data.website) return json({ ok: true }, 200)

  try {
    await deps.saveMessage(parsed.data)
  } catch (error) {
    console.error('contact: failed to save message', error)
    return json({ error: 'server' }, 500)
  }

  try {
    await deps.sendEmail(parsed.data)
  } catch (error) {
    console.error('contact: message saved but email failed', error)
  }

  return json({ ok: true }, 200)
}
