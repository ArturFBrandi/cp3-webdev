import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Repo } from '@/types/github'
import { resolveReadmeUrl } from '@/utils/readmeUrl'
import styles from './ReadmeViewer.module.css'

interface ReadmeViewerProps {
  markdown: string
  repo: Repo
}

const components: Components = {
  a: ({ node: _node, href, children, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
  img: ({ node: _node, alt, ...props }) => (
    <img alt={alt ?? ''} loading="lazy" decoding="async" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <div className={styles.tableWrapper}>
      <table {...props} />
    </div>
  ),
}

export function ReadmeViewer({ markdown, repo }: ReadmeViewerProps) {
  return (
    <div className={styles.readme}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={components}
        urlTransform={(url, key) => resolveReadmeUrl(url, key, repo)}
      >
        {markdown}
      </Markdown>
    </div>
  )
}
