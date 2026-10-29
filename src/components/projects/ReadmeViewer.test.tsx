import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeRepo } from '@/test/fixtures'
import { ReadmeViewer } from './ReadmeViewer'

const repo = makeRepo({ name: 'demo' })

describe('ReadmeViewer', () => {
  it('renders markdown with GFM tables and resolves relative URLs', () => {
    render(
      <ReadmeViewer
        repo={repo}
        markdown={
          '# Demo\n\n| a | b |\n| - | - |\n| 1 | 2 |\n\n![shot](docs/shot.png)\n\n[schema](db/schema.sql)'
        }
      />,
    )
    expect(screen.getByRole('heading', { name: 'Demo' })).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'shot' })).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/ArturFBrandi/demo/main/docs/shot.png',
    )
    expect(screen.getByRole('img', { name: 'shot' })).toHaveAttribute('loading', 'lazy')
    expect(screen.getByRole('link', { name: 'schema' })).toHaveAttribute('target', '_blank')
  })

  it('does not render raw HTML from the README', () => {
    render(<ReadmeViewer repo={repo} markdown={'<script>alert(1)</script><b>bold</b>'} />)
    expect(document.querySelector('script')).toBeNull()
    expect(screen.queryByText('bold', { selector: 'b' })).not.toBeInTheDocument()
  })
})
