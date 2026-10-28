# Artur Brandi — Portfolio

Personal portfolio built in React for the CP3 assignment (FIAP — Web Development). It lists my GitHub projects through the GitHub API, has a contact form that emails me and stores the message, and an owner dashboard behind a login. The site is available in Portuguese and English.

The implementation plan, with the reasoning behind each choice, is in [`docs/PLAN.md`](docs/PLAN.md).

## Tech stack

| Area         | Tools                                                           |
| ------------ | --------------------------------------------------------------- |
| Build & UI   | Vite, React, TypeScript (strict), CSS Modules                   |
| Routing      | React Router                                                    |
| Server state | TanStack Query                                                  |
| Forms        | React Hook Form + Zod                                           |
| i18n         | react-i18next (PT / EN)                                         |
| Backend      | Supabase (Auth + Postgres), Vercel Functions (`api/`), Resend   |
| Tests        | Vitest + Testing Library                                        |
| Code quality | oxlint, Prettier, Husky, lint-staged, commitlint                |
| Deploy       | Vercel (auto-deploy on `main`, preview deploy on pull requests) |

## Running locally

Requirements: Node 22+ and npm.

```sh
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:5173
```

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

### Environment variables

See [`.env.example`](.env.example). Variables prefixed with `VITE_` are bundled into the browser and must only hold public values. Server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) are read only by functions in `api/`. `.env` is git-ignored.

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
  hooks/             Custom hooks (data fetching via TanStack Query, auth, theme)
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
- **Scopes:** `setup`, `harness`, `layout`, `theme`, `i18n`, `routing`, `github`, `contact`, `auth`, `dashboard`, `perf`, `deps`, `docs`

Examples: `feat(contact): add per-field validation`, `fix(routing): show 404 for unknown repo`.

### Branches — GitHub Flow

- `main` is always deployable. Vercel deploys it automatically, and nobody commits to it directly.
- Each piece of work gets its own branch from `main`: `feature/<name>`, `fix/<name>`, `chore/<name>`, `test/<name>`, `perf/<name>`.
- Open a pull request into `main`. Vercel builds a preview deploy for it. Merge once lint, type-check and tests pass.

### Automated checks

- **pre-commit** (Husky + lint-staged): oxlint `--fix` and Prettier on staged files.
- **commit-msg** (Husky + commitlint): rejects messages that aren't Conventional Commits.

## AI harness

This project is developed with Claude Code. The instructions and tooling the AI uses live in the repository so they are versioned with the code:

| File                    | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `CLAUDE.md`             | Project instructions: architecture, naming, i18n, git rules       |
| `.claude/settings.json` | Permissions and hooks (format + lint after edits, protect `main`) |
| `.claude/skills/`       | Repeatable workflows (new feature, new component)                 |
| `.claude/agents/`       | Architecture reviewer subagent                                    |
| `.mcp.json`             | MCP servers available to the AI                                   |
