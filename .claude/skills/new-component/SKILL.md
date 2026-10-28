---
name: new-component
description: Create a React component in this portfolio with the right folder, naming, CSS Module, i18n and test. Use when adding any new component, button, card, section or layout piece.
---

# New component

## 1. Check for reuse first

List `src/components/ui/`. If an existing component can do the job with a new prop or variant, extend it instead of creating a new one.

## 2. Pick the folder

| The component...                                    | Folder                     |
| --------------------------------------------------- | -------------------------- |
| is a generic visual primitive (no domain knowledge) | `src/components/ui/`       |
| is part of the page frame (header, footer, toggles) | `src/components/layout/`   |
| is a section of the home page                       | `src/components/sections/` |
| renders projects/repositories                       | `src/components/projects/` |
| is a whole route                                    | `src/pages/`               |

## 3. Create the files

For a component named `ProjectCard`:

```
ProjectCard.tsx          named export, props typed with an interface
ProjectCard.module.css   uses only variables from src/styles/tokens.css
ProjectCard.test.tsx     behavior tests (only when it has behavior or states)
```

Template:

```tsx
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  title: string
}

export function ProjectCard({ title }: ProjectCardProps) {
  return <article className={styles.card}>{title}</article>
}
```

## 4. Rules to check before finishing

- No `fetch`, Supabase or GitHub calls. Data arrives through props or a hook from `src/hooks/`.
- `ui/` components get all text through props. Other components use `t()` or `useContent()`. Nothing user-facing is hardcoded, and new keys exist in both `en.json` and `pt.json`.
- Accessible: semantic elements, `alt` on images, labels on inputs, `aria-*` only when the semantics aren't enough.
- Images: explicit `width`/`height`, `loading="lazy"` below the fold, AVIF/WebP sources.
- No inline styles or hardcoded colors; it must look right in light and dark themes.
