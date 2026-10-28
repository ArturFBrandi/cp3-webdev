import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppProviders } from '@/app/AppProviders'
import { i18n } from '@/app/i18n'
import { createTestQueryClient } from '@/test/renderRoute'
import { ContactForm } from './ContactForm'

function renderForm() {
  return render(
    <AppProviders queryClient={createTestQueryClient()}>
      <ContactForm />
    </AppProviders>,
  )
}

function mockFetch(implementation: () => Promise<Response>) {
  const fetchMock = vi.fn<typeof fetch>(implementation)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message'), 'I would like to talk about a project.')
}

describe('ContactForm validation', () => {
  it('shows a specific message for each empty field and sends nothing', async () => {
    const fetchMock = mockFetch(() => Promise.resolve(Response.json({ ok: true })))
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByText('Enter your name')).toBeInTheDocument()
    expect(screen.getByText('Enter your e-mail')).toBeInTheDocument()
    expect(screen.getByText('Write a message')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('explains an invalid e-mail and a short message, linked to the fields', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('E-mail'), 'ada@')
    await user.type(screen.getByLabelText('Message'), 'Too short')
    await user.tab()

    const email = screen.getByLabelText('E-mail')
    expect(await screen.findByText('Invalid e-mail')).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Invalid e-mail')
    expect(screen.getByText('Message must have at least 20 characters')).toBeInTheDocument()
  })

  it('shows the messages in portuguese', async () => {
    const user = userEvent.setup()
    await act(() => i18n.changeLanguage('pt'))
    renderForm()

    await user.type(screen.getByLabelText('E-mail'), 'invalido')
    await user.type(screen.getByLabelText('Mensagem'), 'curta')
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))

    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
    expect(screen.getByText('Mensagem com no mínimo 20 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Informe seu nome')).toBeInTheDocument()
  })
})

describe('ContactForm submission', () => {
  it('blocks the button while sending, then confirms and clears the form', async () => {
    let respond: (response: Response) => void = () => {}
    const fetchMock = mockFetch(() => new Promise((resolve) => (respond = resolve)))
    const user = userEvent.setup()
    renderForm()

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    const sending = await screen.findByRole('button', { name: 'Sending…' })
    expect(sending).toBeDisabled()
    await user.click(sending)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' }),
    )

    respond(Response.json({ ok: true }))

    expect(await screen.findByText(/your message was sent/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled()
  })

  it('shows an error and keeps the text when sending fails', async () => {
    mockFetch(() => Promise.resolve(Response.json({ error: 'server' }, { status: 500 })))
    const user = userEvent.setup()
    renderForm()

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't be sent/)
    expect(screen.getByLabelText('Name')).toHaveValue('Ada Lovelace')
  })
})
