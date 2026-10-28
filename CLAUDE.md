# CLAUDE.md

Personal portfolio in React (FIAP CP3). Bilingual (PT/EN), projects from the GitHub API, contact form that saves to Supabase and emails via Resend, and an owner dashboard behind Supabase Auth. Deployed on Vercel.

- `docs/PLAN.md` — the implementation plan and the reasoning for every stack choice. Read the relevant section before starting a feature.
- `README.md` — the public version of the conventions below. Keep both in sync when a convention changes.

## Commands

```sh
npm run dev          # dev server
npm run typecheck    # tsc -b
npm run lint         # oxlint, warnings fail
npm test             # vitest run
npm run build        # typecheck + production build
```

A change is **done** only when `typecheck`, `lint` and `test` pass.

## Stack

Vite, React 19, TypeScript 7 (strict), React Router, TanStack Query, React Hook Form + Zod, react-i18next, Supabase (Auth + Postgres), Vercel Functions in `api/`, Resend, CSS Modules, Vitest + Testing Library, oxlint + Prettier.

Library APIs change quickly. Look up current docs (Context7 MCP) instead of relying on memory for React Router, TanStack Query, Vite, Vitest, Supabase and i18next.

Do not add a dependency that isn't in the plan without asking first.

## Architecture rules

```
api/              Vercel Functions (server only; may use secrets)
src/app/          App shell, router, providers, i18n setup
src/pages/        One component per route; composes sections and hooks (dashboard routes in pages/dashboard/)
src/components/ui/        Presentational primitives: Button, Card, Tag, Skeleton, Spinner, ErrorState, EmptyState, FormField
src/components/layout/    Header, Footer, ThemeToggle, LanguageSwitcher, ProtectedRoute
src/components/sections/  Home page sections
src/components/projects/  Project cards and grids
src/components/dashboard/ Owner dashboard pieces (lazy-loaded with the dashboard)
src/hooks/        Custom hooks (TanStack Query wrappers, auth, theme, content) + queryKeys.ts (all query keys)
src/services/     The only place that calls fetch / Supabase / GitHub
src/schemas/      Zod schemas (shared with api/)
src/contexts/     Theme and Auth contexts
src/content/en|pt Long static content, one typed object per locale
src/locales/      en.json, pt.json (UI strings)
src/styles/       tokens.css (design tokens), global.css
src/types/        Shared types
```

1. **Data flow is service → hook → page/section → UI component.** Components never call `fetch`, Supabase or GitHub. If a component needs data, write or reuse a hook.
2. **`components/ui` is presentational.** Props in, JSX out. No hooks that fetch, no i18n lookups of business content, no knowledge of routes.
3. **Reuse before creating.** Check `components/ui` before writing a new button, card, tag, skeleton or state message.
4. **Every async view handles loading, error and empty** with `Skeleton`/`Spinner`, `ErrorState` and `EmptyState`.
5. **Styling:** CSS Modules only, using variables from `src/styles/tokens.css`. No inline styles, no hardcoded colors, no new global classes.
6. **Imports** use the `@/` alias. Use `import type` for types.
7. **Secrets:** only `VITE_*` variables reach the browser. Never read `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` outside `api/`. Never read or print `.env`; add new variables to `.env.example`.

## i18n rules

- No user-facing text hardcoded in JSX. Short UI strings use `t('namespace.key')` from `src/locales/*.json`. Long content uses `useContent()` from `src/content/{en,pt}`.
- Every new key goes into **both** `en.json` and `pt.json` in the same change. `content/en` and `content/pt` share one TypeScript type.
- Zod schemas return message **keys** (e.g. `errors.email.invalid`), and the UI translates them.
- Dates and numbers use `Intl` with the current language. Never format them by hand.

## Naming

- Components and pages: `PascalCase.tsx`, **named exports** (`export function ProjectCard`). No default exports, except where a tool requires one (config files, `React.lazy` targets).
- Styles: `PascalCase.module.css` next to the component.
- Hooks: `useCamelCase.ts`. Services and schemas: `camelCase.ts`.
- Tests: `*.test.ts(x)` next to the file under test. Use Testing Library queries by role or label, not by class name.

## Git workflow

- **Never commit to `main` and never use `--no-verify`.** A hook blocks both.
- One branch per piece of work, created from up-to-date `main`: `feature/<name>`, `fix/<name>`, `chore/<name>`, `test/<name>`, `perf/<name>`, `docs/<name>`.
- Commits follow Conventional Commits, enforced by commitlint: `type(scope): imperative lower-case description`.
  - Types: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`, `perf`, `build`, `ci`.
  - Scopes: `setup`, `harness`, `layout`, `theme`, `i18n`, `routing`, `github`, `contact`, `auth`, `dashboard`, `perf`, `deps`, `docs`, `ci`.
- Keep commits small and focused: one logical change each.
- Finish a branch by opening a PR into `main` with `gh pr create`. Ask the user before pushing or opening the PR.

For a full feature, follow the `new-feature` skill. Run the `architecture-reviewer` agent on the diff before opening a PR.
