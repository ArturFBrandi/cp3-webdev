import styles from './Picture.module.css'

interface PictureProps {
  picture: ImagePicture
  alt: string
  /** CSS `sizes` hint so the browser picks the smallest fitting width. */
  sizes: string
  /** Above-the-fold images should load eagerly; everything else waits until visible. */
  eager?: boolean
  className?: string
}

/** Responsive AVIF/WebP image in a fixed 16:9 frame (reserves space: no layout shift). */
export function Picture({ picture, alt, sizes, eager = false, className }: PictureProps) {
  const formats = Object.entries(picture.sources).filter(
    ([format]) => format !== 'jpg' && format !== 'png',
  )
  return (
    <div className={[styles.frame, className].filter(Boolean).join(' ')}>
      <picture>
        {formats.map(([format, srcSet]) => (
          <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
        ))}
        <img
          className={styles.image}
          src={picture.img.src}
          width={picture.img.w}
          height={picture.img.h}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
    </div>
  )
}
