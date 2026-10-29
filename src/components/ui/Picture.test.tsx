import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Picture } from './Picture'

const picture: ImagePicture = {
  sources: {
    avif: 'a-480.avif 480w, a-800.avif 800w',
    webp: 'a-480.webp 480w',
    jpg: 'a-480.jpg 480w',
  },
  img: { src: 'a-1200.jpg', w: 1200, h: 675 },
}

describe('Picture', () => {
  it('offers AVIF and WebP sources and lazy-loads a sized fallback image', () => {
    const { container } = render(<Picture picture={picture} alt="Preview" sizes="100vw" />)

    const types = [...container.querySelectorAll('source')].map((source) => source.type)
    expect(types).toEqual(['image/avif', 'image/webp'])

    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('width', '1200')
    expect(img).toHaveAttribute('height', '675')
    expect(img).toHaveAttribute('alt', 'Preview')
  })

  it('loads eagerly when above the fold', () => {
    const { container } = render(<Picture picture={picture} alt="" sizes="100vw" eager />)
    expect(container.querySelector('img')).toHaveAttribute('loading', 'eager')
  })
})
