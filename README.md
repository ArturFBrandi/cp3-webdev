# Artur Brandi — Portfolio

Personal portfolio built in React for the CP3 assignment (FIAP — Web Development). It lists my GitHub projects through the GitHub API, has a contact form that emails me and stores the message, and an owner dashboard behind a login. The site is available in Portuguese and English.

- **Plan and stack decisions:** [`docs/PLAN.md`](docs/PLAN.md)
- **Architecture diagrams** (system, data flow, routes, branch → deploy): [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Features

- A curated list of my GitHub repos (`portfolioRepos` in `src/content/shared.ts`), loaded live from the GitHub API and cached, with a detail page per repo (`/projects/:name`) that renders its README
- Featured projects on the home page, chosen in the dashboard; the first is the main focus and the rest of the list expands on demand
- Contact form with per-field validation; each message is stored in Supabase and e-mailed to me
- Owner dashboard behind a login: read messages, mark them as answered, choose featured projects
- Portuguese and English, light and dark theme, both remembered between visits
- Friendly 404 and error pages; loading, error and empty states for every API call

## Tech stack

| Area         | Tools                                                         |
| ------------ | ------------------------------------------------------------- |
| Build & UI   | Vite, React, TypeScript (strict), CSS Modules                 |
| Routing      | React Router                                                  |
| Server state | TanStack Query                                                |
| Forms        | React Hook Form + Zod                                         |
| i18n         | react-i18next (PT / EN)                                       |
| Backend      | Supabase (Auth + Postgres), Vercel Functions (`api/`), Resend |
| Tests        | Vitest + Testing Library                                      |
| Code quality | oxlint, Prettier, Husky, lint-staged, commitlint              |
| CI / Deploy  | GitHub Actions (checks on every PR), Vercel (auto-deploy)     |

## Running locally

Requirements: Node 22+ and npm.

```sh
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:5173
```

`npm run dev` serves the front end only. To run the contact API (`api/contact.ts`) locally as well, use the Vercel CLI: `npx vercel dev`.

| Script               | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the dev server                |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Serve the production build          |
| `npm run typecheck`  | Run the TypeScript compiler         |
| `npm run lint`       | Lint with oxlint (warnings fail)    |
| `npm run format`     | Format everything with Prettier     |
| `npm test`           | Run the test suite once             |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run analyze`    | Build and open a bundle size map    |

### Environment variables

See [`.env.example`](.env.example). Variables prefixed with `VITE_` are bundled into the browser and must only hold public values. Server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) are read only by functions in `api/`.

`.env` is git-ignored.

### First-time setup (Supabase, Resend, Vercel)

1. **Database:** run the files in `supabase/migrations/` in order (Supabase SQL editor or `npx supabase db push`). They create `featured_projects` and `messages`, and add the row-level security policies.
2. **Owner account:** in Supabase → Authentication, create the owner user (the e-mail in `public.is_owner()`) and turn off **Allow new users to sign up**.
3. **E-mail:** create a Resend API key. Without a verified domain, Resend only delivers to the e-mail of the Resend account, so use that address as `CONTACT_TO_EMAIL`.
4. **Vercel:** import the repository, then set the variables from `.env.example` under Settings → Environment Variables. Every push to `main` deploys to production, and every pull request gets a preview URL.

## Project structure

```
api/                 Vercel Functions (server side)
src/
  app/               App shell, router, providers, i18n setup
  pages/             One component per route
  components/
    ui/              Reusable visual primitives (Button, Card, Tag, Skeleton...)
    layout/          Header, Footer, ThemeToggle, LanguageSwitcher, ProtectedRoute
    sections/        Home page sections (Hero, Skills, Experience...)
    projects/        Project cards and grids
    dashboard/       Owner dashboard pieces
  hooks/             Custom hooks (data fetching via TanStack Query, auth, theme) and queryKeys.ts
  services/          API clients (GitHub, Supabase, contact)
  schemas/           Zod schemas, shared with api/
  contexts/          React contexts (theme, auth)
  content/en|pt/     Long static content per language
  locales/           UI strings per language (en.json, pt.json)
  styles/            Design tokens and global CSS
  types/             Shared TypeScript types
  test/              Test setup and helpers
```

## Conventions

### Architecture

- Components never call `fetch` or Supabase directly. Data flows **service → hook → page/section → UI component**.
- `components/ui` components are presentational: they receive props and hold no data logic.
- No hardcoded user-facing text in components. Use `t()` for UI strings and `useContent()` for long content, and add every key to **both** `en.json` and `pt.json`.
- Import from `src` through the `@/` alias (e.g. `import { Button } from '@/components/ui/Button'`).

### Naming

| Kind              | Convention                       | Example                   |
| ----------------- | -------------------------------- | ------------------------- |
| Components, pages | `PascalCase.tsx`, named export   | `ProjectCard.tsx`         |
| Component styles  | `PascalCase.module.css`          | `ProjectCard.module.css`  |
| Hooks             | `useCamelCase.ts`                | `useRepos.ts`             |
| Services, schemas | `camelCase.ts`                   | `github.ts`, `contact.ts` |
| Tests             | next to the file, `*.test.ts(x)` | `ContactForm.test.tsx`    |
| Types             | `PascalCase` type names          | `Repo`, `Message`         |

### Commits — Conventional Commits

Format: `type(scope): description`, in the imperative mood and lower case. Enforced by commitlint on every commit.

- **Types:** `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`, `perf`, `build`, `ci`
- **Scopes:** `setup`, `harness`, `layout`, `theme`, `i18n`, `routing`, `github`, `contact`, `auth`, `dashboard`, `perf`, `deps`, `docs`, `ci`

Examples: `feat(contact): add per-field validation`, `fix(routing): show 404 for unknown repo`.

### Branches — GitHub Flow

- `main` is always deployable. Vercel deploys it automatically, and nobody commits to it directly.
- Each piece of work gets its own branch from `main`: `feature/<name>`, `fix/<name>`, `chore/<name>`, `test/<name>`, `perf/<name>`.
- Open a pull request into `main`. GitHub Actions runs typecheck, lint, format check, tests and build, and Vercel builds a preview deploy. Merge only when CI is green.

### Automated checks

- **pre-commit** (Husky + lint-staged): oxlint `--fix` and Prettier on staged files.
- **commit-msg** (Husky + commitlint): rejects messages that aren't Conventional Commits.
- **CI** (`.github/workflows/ci.yml`): the same checks plus the full test suite and a production build, on every pull request and push to `main`.

## AI harness

This project is developed with Claude Code. The instructions and tooling the AI uses live in the repository so they are versioned with the code:

| File                                      | Purpose                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`                               | Project instructions loaded in every session: architecture, i18n, naming and git rules            |
| `.claude/settings.json`                   | Permissions (safe commands allowed, push/PR/install ask first, `.env` unreadable) and hooks       |
| `.claude/hooks/guard-git.mjs`             | Blocks commits on `main`, pushes to `main` and `--no-verify`                                      |
| `.claude/hooks/format-and-lint.mjs`       | Runs Prettier and oxlint on every file the AI edits and sends lint errors back to it              |
| `.claude/skills/new-feature/`             | Workflow: branch → layered implementation → tests → Conventional Commits → review → PR            |
| `.claude/skills/new-component/`           | Folder choice, naming, CSS Module, i18n and accessibility checklist for components                |
| `.claude/agents/architecture-reviewer.md` | Read-only subagent that checks a branch diff against the rules before a PR                        |
| `.mcp.json`                               | MCP servers: Context7 (current library docs), Supabase (schema and RLS), Vercel (deploys and env) |

The same rules are enforced for humans and the AI: the git hooks (lint-staged, commitlint) run on every commit, no matter who made it.
