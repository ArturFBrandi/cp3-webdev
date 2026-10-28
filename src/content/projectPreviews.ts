import aiHardcoreEngineer from '@/assets/projects/ai-hardcore-engineer.jpg?w=480;800;1200&format=avif;webp;jpg&as=picture'
import smartlarManager from '@/assets/projects/smartlar-manager.png?w=480;800;1200&format=avif;webp;png&as=picture'

/**
 * Optional preview images for repositories, keyed by repo name. The project list itself still
 * comes from the GitHub API; this only adds artwork GitHub doesn't provide.
 * Images are converted to AVIF/WebP in 3 widths at build time (vite-imagetools).
 */
export const projectPreviews: Record<string, ImagePicture> = {
  'ai-hardcore-engineer': aiHardcoreEngineer,
  'smartlar-manager': smartlarManager,
}
