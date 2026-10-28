// PreToolUse hook (Bash): enforces the branch rules from CLAUDE.md.
// Exit code 2 blocks the command and sends stderr back to Claude.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8'))
const command = input.tool_input?.command ?? ''

function block(reason) {
  console.error(`Blocked by .claude/hooks/guard-git.mjs: ${reason}`)
  process.exit(2)
}

if (!/\bgit\b/.test(command)) process.exit(0)

if (/--no-verify\b/.test(command) || /\bgit\s+commit\b.*\s-n\b/.test(command)) {
  block('--no-verify skips lint, format and commitlint. Fix the reported problem instead.')
}

if (/\bgit\s+push\b.*[\s:]main(\s|$)/.test(command)) {
  block('pushing to main is not allowed. Push the feature branch and open a pull request.')
}

if (/\bgit\s+(commit|push|merge)\b/.test(command)) {
  let branch = ''
  try {
    branch = execSync('git branch --show-current', { cwd: input.cwd, encoding: 'utf8' }).trim()
  } catch {
    process.exit(0)
  }
  if (branch === 'main') {
    block(
      'you are on main. Create a branch first: git switch -c feature/<name> (or fix/, chore/, test/, perf/, docs/).',
    )
  }
}

process.exit(0)
