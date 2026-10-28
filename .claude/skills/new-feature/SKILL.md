---
name: new-feature
description: Implement a feature of this portfolio end to end following the project workflow — branch, plan check, implementation that respects the architecture and i18n rules, tests, Conventional Commits, review and pull request. Use when the user asks to build, add or implement a feature, page, section or integration.
---

# New feature workflow

Follow these steps in order. Don't skip one without telling the user why.

## 1. Understand

1. Read the matching section of `docs/PLAN.md` (stack choice, routes, data, requirement checklist).
2. Identify which of the 12 CP3 requirements this feature satisfies, and list their acceptance points as a checklist.
3. If anything is ambiguous, ask the user before writing code.

## 2. Branch

```sh
git switch main && git pull --ff-only   # skip pull if there is no remote yet
git switch -c feature/<kebab-name>      # or fix/, chore/, test/, perf/, docs/
```

## 3. Implement, layer by layer

Work bottom-up so each layer stays within its responsibility (see CLAUDE.md, "Architecture rules"):

1. **Types** in `src/types/`.
2. **Schemas** in `src/schemas/` (Zod; error messages are i18n keys).
3. **Services** in `src/services/`: the only code that calls `fetch`, Supabase or GitHub. Return typed data and throw typed errors.
4. **Hooks** in `src/hooks/`: wrap services with TanStack Query (`useQuery` / `useMutation`). Query keys go in one place per service.
5. **UI**: reuse `src/components/ui` first, and use the `new-component` skill for anything new.
6. **Pages and sections**: compose hooks + components, and handle loading, error and empty states.
7. **i18n**: add every new string to both `src/locales/en.json` and `pt.json`, and long content to both `src/content/en` and `pt`.

Commit after each meaningful step instead of one commit at the end, e.g.:

```
feat(github): add github service with repo filter
feat(github): add useRepos hook with cached query
feat(github): render project cards with skeleton states
test(github): cover repo filter rules
```

## 4. Test

- Add tests next to the code: services (pure logic), hooks or components (behavior through Testing Library).
- Run `npm run typecheck && npm run lint && npm test`. All three must pass.

## 5. Review

Run the `architecture-reviewer` agent on `git diff main...HEAD` and fix what it reports.

## 6. Hand off

1. Summarize what changed and which requirement points are now covered.
2. Ask the user before `git push -u origin <branch>` and `gh pr create`.
3. PR title is a Conventional Commit; the body lists the requirement points covered and how to test them.
