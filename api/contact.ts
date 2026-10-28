import { contactDeps } from './_lib/contactDeps.js'
import { handleContact } from './_lib/handleContact.js'

// Vercel Function: POST /api/contact. Other methods get 405 from the platform.
export function POST(request: Request): Promise<Response> {
  return handleContact(request, contactDeps)
}
