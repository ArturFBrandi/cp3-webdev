import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces/opsz.css'
import '@/styles/tokens.css'
import '@/styles/global.css'
import '@/app/i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
