# CP3 Migration Plan — portifolio → cp3-webdev (React)

Goal: rebuild [ArturFBrandi/portifolio](https://github.com/ArturFBrandi/portifolio) (static HTML/CSS/JS) as a React app in this repo, keeping its content and visual identity, and meeting all 12 CP3 requirements plus the repo and video rules.

**Deadline:** 03/11/2026. **Deliverables:** GitHub link, Vercel link, unlisted YouTube link (≤ 8 min, face + screen).

---

## 1. Stack decisions

| Concern              | Choice                                                    | Alternatives considered                                         | Why / trade-off                                                                                                                                                                                                                                                     |
| -------------------- | --------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build / framework    | **Vite + React + TypeScript**                             | Next.js, CRA                                                    | SPA is enough (no SEO-critical SSR); fast dev server; we accept configuring the SPA rewrite and code splitting ourselves                                                                                                                                            |
| Routing              | **React Router**                                          | TanStack Router, wouter                                         | Most documented, `lazy()` routes, nested layouts for the dashboard; less type-safe than TanStack Router                                                                                                                                                             |
| Server state / cache | **TanStack Query**                                        | SWR, manual `useEffect`                                         | Cache shared across pages (req. 8: no repeated GitHub calls), loading/error states built in, `persistQueryClient` to survive reloads; adds ~13 kB                                                                                                                   |
| Forms                | **React Hook Form + Zod**                                 | Formik + Yup, manual                                            | Per-field errors, low re-renders, **one Zod schema shared by the form and the API function**                                                                                                                                                                        |
| Backend / auth / DB  | **Supabase**                                              | Firebase, PocketBase, own Node                                  | Postgres + Auth + Row Level Security in one free service; vendor lock-in accepted                                                                                                                                                                                   |
| Email                | **Vercel Function `api/contact.ts` + Resend**             | EmailJS, Formspree                                              | Keeps secrets server-side, validates again with Zod, saves to DB _and_ emails in one place; EmailJS would be simpler but exposes the flow to the client                                                                                                             |
| Styling              | **CSS Modules + global tokens (ported from `style.css`)** | Tailwind, MUI                                                   | Preserves the existing design 1:1 with no rewrite; no utility-class migration                                                                                                                                                                                       |
| Theme                | **Context + localStorage + `data-theme` on `<html>`**     | Zustand, next-themes                                            | Tiny, no dependency; inline script in `index.html` sets the theme before paint (no flash / CLS)                                                                                                                                                                     |
| i18n (PT / EN)       | **react-i18next + i18next-browser-languagedetector**      | Custom Context + dictionaries, LinguiJS, URL prefix (`/pt/...`) | Standard library with interpolation and plurals; the detector handles first visit (`navigator.language`) and persistence (localStorage) for free. Language is a preference, not part of the URL, so we accept that a shared link opens in the viewer's own language |
| Tests                | **Vitest + Testing Library** (+ optional Playwright)      | Jest                                                            | Native to Vite, same config                                                                                                                                                                                                                                         |
| Code quality         | **oxlint + Prettier + Husky + lint-staged + commitlint**  | ESLint + typescript-eslint, Biome                               | oxlint is the Vite template default and runs in milliseconds; typescript-eslint depends on the TypeScript JS API that TS 7 (native Go compiler) no longer ships. We accept a smaller plugin ecosystem than ESLint                                                   |
| Deploy               | **Vercel** (Git integration)                              | Netlify, GitHub Actions                                         | Auto-deploy on push to `main` + preview deploy per PR with zero config                                                                                                                                                                                              |

---

## 2. Content migration map

All static text from the old `index.html` moves to typed data files in `src/content/{en,pt}/`, so components only render data (logic and content separated from presentation). The existing English text is ported as-is to `content/en/`, and `content/pt/` is a Portuguese translation with the same TypeScript type, so a missing field fails the build. A `useContent()` hook returns the object for the current language.

Short UI strings (nav, buttons, form labels, validation errors, loading/empty/error messages, 404) go to `src/locales/{en,pt}.json` and are read with `t()`.

| Old section (`index.html`)                           | New location                                                            | Data source                                                                                                |
| ---------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `<header>` logo "AB" + nav                           | `components/layout/Header.tsx` (+ `ThemeToggle`, `LanguageSwitcher`)    | Nav → router `<NavLink>`s: Home, Projects, About, Experience, Contact (labels from `locales/`)             |
| Hero (eyebrow, name, lede, buttons, GitHub/LinkedIn) | `components/sections/Hero.tsx`                                          | `content/{en,pt}/profile.ts`                                                                               |
| "Selected work" — AI Hardcore Engineer card          | **Home → Featured projects** (GitHub API + featured list from Supabase) | GitHub repo `ai-hardcore-engineer`                                                                         |
| "Selected work" — Farmoria card                      | `components/sections/InDevelopment.tsx` (static)                        | `content/{en,pt}/inDevelopment.ts` — the repo is private, so the API cannot return it. Say so in the video |
| "What I work with" skills grid                       | `components/sections/Skills.tsx`                                        | `content/{en,pt}/skills.ts`                                                                                |
| Experience timeline (RWS, FIAP, CS106A/B/107 links)  | `components/sections/Experience.tsx`                                    | `content/{en,pt}/experience.ts` (dates formatted with `Intl.DateTimeFormat` per locale)                    |
| Footer "Let's talk" + links + year                   | `components/layout/Footer.tsx` + **new** `ContactSection` with the form | `content/{en,pt}/profile.ts`                                                                               |
| `js/main.js` (sets year)                             | inline `new Date().getFullYear()` in Footer                             | —                                                                                                          |
| `assets/favicon.svg`                                 | `public/favicon.svg` (copy as-is)                                       | —                                                                                                          |

### Content that must move _to GitHub_ (manual, do first)

Every public repo currently has `description: null`, and the cards must show a description.

- [ ] Add descriptions on GitHub to the repos you want shown (at least `ai-hardcore-engineer`, `ai-hardcore-engineer-v2`, `smartlar-manager`, `RetroPalette`, `aseprite-compiler`, `CS106A/B/107` if moved/forked here, `cp*` projects).
- [ ] Add topics (they become the card tags, replacing the hardcoded `project-tags`). Example for `ai-hardcore-engineer`: `python langgraph fastapi rag qdrant postgresql docker`.
- [ ] Set the repo **Website** field for `ai-hardcore-engineer` to the YouTube walkthrough. The card renders `homepage` as a link, replacing "Watch walkthrough ↗".
- [ ] Move the long project paragraph into that repo's README. The detail page `/projects/:name` renders the README.

**Repo list filter (in `services/github.ts`, not manual registration):** exclude forks, archived repos, the profile repo `ArturFBrandi`, and empty repos (`size === 0`). Sort by `pushed_at` desc.

**GitHub content and language:** repo descriptions and READMEs come from GitHub in a single language (write them in English), so they don't change with the switcher. Everything around them does: labels, the "updated 3 days ago" text (`Intl.RelativeTimeFormat`), and the empty, error and rate-limit messages. Mention this limitation in the video.

---

## 3. Style migration

`css/style.css` (364 lines) splits into:

- `src/styles/tokens.css`: the `:root` variables. **Change:** the dark palette moves from `@media (prefers-color-scheme: dark)` to `:root[data-theme="dark"]`, and the media query is used only for the first-visit default.
- `src/styles/global.css`: reset, `body`, headings, links, `.skip-link`, `main/footer` container widths.
- One `*.module.css` per component, each taking its rule block:
  - `.btn`, `.btn-primary`, `.btn-ghost` → `ui/Button.module.css`
  - `.project-card`, `.project-body`, `.project-status`, `.project-links` → `ui/Card.module.css` + `ProjectCard.module.css`
  - `.project-tags li` → `ui/Tag.module.css`
  - `.skills-grid`, `.skill-group` → `Skills.module.css`
  - `.timeline-*`, `.bullets`, `.achievements` → `Experience.module.css`
  - header/nav/logo → `Header.module.css`; footer → `Footer.module.css`
- **New** components in the same visual language: `Skeleton` (uses `--tag-bg` with a shimmer), `Spinner`, `ErrorState`, `EmptyState`, `FormField`, `ThemeToggle`, `LanguageSwitcher` (compact "PT | EN" toggle next to the theme toggle, same style as the nav links). Portuguese strings are longer, so check the nav and buttons don't wrap at 375 px.
- **Fonts:** replace the Google Fonts `<link>` with self-hosted `@fontsource-variable/inter` and `@fontsource-variable/fraunces` (`font-display: swap`). This removes render-blocking CSS and helps the Lighthouse mobile score.
- **Identity extra (optional, last):** a lazy-loaded React Three Fiber "AB" monogram in the hero that tilts with the mouse. It is code-split and replaced by the flat logo on `prefers-reduced-motion` or while loading.

---

## 4. Target architecture

```
api/
  contact.ts              # Vercel Function: Zod validate → insert Supabase → send Resend email
src/
  app/                    # App.tsx, router.tsx, providers.tsx (QueryClient, Theme, Auth), i18n.ts
  pages/                  # HomePage, ProjectsPage, ProjectDetailPage, LoginPage,
                          # NotFoundPage, ErrorPage, dashboard/{DashboardLayout,MessagesPage,FeaturedPage}
  components/
    ui/                   # Button, Card, Tag, Skeleton, Spinner, ErrorState, EmptyState, FormField
    layout/               # Header, Footer, ThemeToggle, LanguageSwitcher, ProtectedRoute
    sections/             # Hero, FeaturedProjects, InDevelopment, Skills, Experience, ContactSection
    projects/             # ProjectCard, ProjectCardSkeleton, ProjectGrid
  hooks/                  # useRepos, useRepo, useReadme, useFeatured, useMessages, useAuth, useTheme, useContent
  services/               # github.ts, supabase.ts, messages.ts, featured.ts, contact.ts
  schemas/                # contact.ts (Zod, shared with api/)
  contexts/               # ThemeContext, AuthContext
  content/
    en/ pt/               # profile, skills, experience, inDevelopment (ported static text, same type per locale)
  locales/                # en.json, pt.json (UI strings for t())
  styles/                 # tokens.css, global.css
  types/                  # Repo, Message, FeaturedProject
  test/                   # setup + test utils
```

Rules (also written in README and `CLAUDE.md`):

- Components never call `fetch` or Supabase directly. Pages and sections use hooks, and hooks use services.
- Naming: components and pages in `PascalCase.tsx`, hooks `useX.ts`, services `camelCase.ts`, CSS Modules `Component.module.css`, tests `*.test.tsx` next to the file.
- Import alias `@/` → `src/`.
- No hardcoded user-facing text in components. Use `t()` for UI strings and `useContent()` for long content, and add every new key to **both** `en.json` and `pt.json`.

### Routes

| Path                   | Page                                           | Notes                                                                |
| ---------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| `/`                    | HomePage                                       | Hero, featured projects, in development, skills, experience, contact |
| `/projects`            | ProjectsPage                                   | All filtered repos; skeleton / error / empty states                  |
| `/projects/:name`      | ProjectDetailPage                              | Repo data + rendered README; unknown repo → NotFound                 |
| `/login`               | LoginPage                                      | Supabase email + password                                            |
| `/dashboard`           | lazy `DashboardLayout` behind `ProtectedRoute` | Redirects to `/login?redirect=/dashboard`                            |
| `/dashboard/messages`  | MessagesPage                                   | List + "mark as answered"                                            |
| `/dashboard/featured`  | FeaturedPage                                   | Checkbox list of repos → `featured_projects`                         |
| `*`                    | NotFoundPage                                   | Friendly 404                                                         |
| (route `errorElement`) | ErrorPage                                      | API or render failure with a "Try again" button                      |

`vercel.json`: rewrite every non-`/api` path to `/index.html`, so deep links work and survive a refresh.

### Data

**Supabase tables**

- `messages(id uuid pk, name text, email text, message text, answered bool default false, answered_at timestamptz, created_at timestamptz default now())`
  RLS: no anon access; authenticated owner can `select` and `update`. Inserts happen only from `api/contact.ts` with the service-role key.
- `featured_projects(repo_name text pk, position int)`
  RLS: anon `select`; authenticated owner `insert`, `update` and `delete`.
- Auth: create your one user in the dashboard and **disable sign-ups**.

**GitHub API**: unauthenticated (60 req/h per IP). Mitigations: `staleTime` 10 min, `persistQueryClient` to localStorage, and one `useRepos` query reused by Home, Projects and Dashboard (the detail page reads from that cache before fetching). On `403` with `x-ratelimit-remaining: 0`, show a specific ErrorState that includes the reset time.

**`.env.example`**

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GITHUB_USER=ArturFBrandi
SUPABASE_SERVICE_ROLE_KEY=   # server only (api/)
RESEND_API_KEY=              # server only (api/)
CONTACT_TO_EMAIL=
```

---

## 5. Requirement checklist → where it's satisfied

| #   | Requirement         | Implementation                                                                                                                                                                                                                                                                                                                               |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Routes              | React Router, `/projects/:name`, `NotFoundPage`, `ErrorPage`, `vercel.json` rewrite                                                                                                                                                                                                                                                          |
| 2   | Loading states      | `ProjectCardSkeleton` with fixed card height, `ErrorState`, `EmptyState` on every query; `Spinner` and `disabled={isSubmitting}` on the form                                                                                                                                                                                                 |
| 3   | GitHub              | `services/github.ts` → `useRepos`; card shows description, language, `pushed_at` (relative), topics, stars                                                                                                                                                                                                                                   |
| 4   | Contact form        | RHF + Zod; the schema returns message **keys** (`errors.email.invalid`, `errors.message.min`) that the form translates ("E-mail inválido" / "Invalid email", "Mensagem com no mínimo 20 caracteres" / "Message must be at least 20 characters"), so the same schema works in `api/`; `api/contact.ts` saves and emails; success/error banner |
| 5   | Dashboard           | `ProtectedRoute` + `AuthContext`; messages list with answered toggle; featured picker                                                                                                                                                                                                                                                        |
| 6   | Visitor preferences | Theme: `ThemeContext` + localStorage + pre-paint inline script. Language: i18next detector (localStorage, falling back to `navigator.language`, then `en`), `<html lang>` updated on change                                                                                                                                                  |
| 7   | UI                  | Ported design, shared `Button`/`Card`/`Tag`, responsive (tested at 375 px and 1280 px), optional 3D                                                                                                                                                                                                                                          |
| 8   | Performance         | `React.lazy` for dashboard, login and 3D; self-hosted fonts; avatar photo as AVIF/WebP `<picture>` with `width`/`height` + `loading="lazy"` (via `vite-imagetools`); skeletons sized like cards (no CLS); query cache; check with `rollup-plugin-visualizer` and Lighthouse mobile ≥ 80                                                      |
| 9   | Tests               | `ContactForm.test.tsx` (each field error in both languages, valid submit, button disabled while sending); `ProtectedRoute.test.tsx` (redirects without session, renders with session); bonus: `github.test.ts` filter/mapper, `locales.test.ts` (`en.json` and `pt.json` have the same keys)                                                 |
| 10  | Deploy              | Vercel linked to the repo, env vars set in Vercel, auto-deploy on `main` and previews on PRs                                                                                                                                                                                                                                                 |
| 11  | Versioning          | Conventional Commits enforced by commitlint (Husky `commit-msg`); GitHub Flow: `feature/*`, `fix/*`, `chore/*` → PR → squash or merge into `main`; branch protection on `main`                                                                                                                                                               |
| 12  | Architecture        | Folder structure above; hooks/services separation; oxlint + Prettier via Husky `pre-commit` + lint-staged; TypeScript strict                                                                                                                                                                                                                 |

**Note:** the old site has no images, but req. 8 requires optimized images. Add at least a profile photo, and optionally a screenshot per project in the detail page.

---

## 6. AI harness (versioned, shown in the video)

| File                                      | Purpose                                                                                                                                                                                                                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`                               | Project brief, stack, folder rules, naming, "components don't fetch", "no hardcoded text, add keys to both locales", commit and branch rules, commands (`npm run dev/test/lint`), definition of done (lint + tests pass, PR opened) |
| `.claude/settings.json`                   | Allowed commands (npm, git, gh); hook: `PostToolUse` on Edit/Write runs Prettier + oxlint on the changed file; deny hook blocking commits directly on `main`                                                                        |
| `.claude/skills/new-feature/SKILL.md`     | Workflow: create `feature/<name>` → implement following CLAUDE.md → write tests → Conventional Commit → `gh pr create`                                                                                                              |
| `.claude/skills/new-component/SKILL.md`   | Scaffold `Component.tsx` + `.module.css` + test in the right folder with the naming rules                                                                                                                                           |
| `.claude/agents/architecture-reviewer.md` | Read-only subagent that checks a diff against the architecture rules (no fetch in components, naming, folder placement) before a PR                                                                                                 |
| `.mcp.json`                               | Supabase MCP (schema, RLS policies, queries); Vercel plugin for deploy and env management; Chrome MCP for Lighthouse and responsive checks                                                                                          |

Tool and model: Claude Code with Claude Opus 5.5. Be ready to explain why this model, and how `CLAUDE.md`, the hooks, commitlint and the reviewer agent together enforce the rules.

---

## 7. Decisions made

- **Site language:** Portuguese and English with a switcher in the header; the choice is saved between visits. Routes stay in English (`/projects`) for both languages.
- **Old repo:** `portifolio` stays as-is on GitHub Pages.
