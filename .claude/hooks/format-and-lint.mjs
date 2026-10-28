// PostToolUse hook (Edit|Write): formats the edited file and lints it.
// Lint errors exit with code 2 so Claude sees them and fixes them right away.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { extname, relative } from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8'))
const filePath = input.tool_input?.file_path
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd

if (!filePath || relative(projectDir, filePath).startsWith('..')) process.exit(0)

const ext = extname(filePath)
const formattable = ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.css', '.json', '.md', '.html']
const lintable = ['.ts', '.tsx', '.js', '.mjs', '.cjs']
const run = (args) =>
  spawnSync('npx', args, { cwd: projectDir, encoding: 'utf8', shell: process.platform === 'win32' })

if (formattable.includes(ext)) run(['prettier', '--write', '--ignore-unknown', filePath])

if (lintable.includes(ext)) {
  const result = run(['oxlint', '--fix', '--deny-warnings', filePath])
  if (result.status !== 0) {
    console.error(
      `oxlint found problems in ${relative(projectDir, filePath)}:\n${result.stdout}${result.stderr}`,
    )
    process.exit(2)
  }
}

process.exit(0)
