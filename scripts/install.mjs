import { spawnSync } from 'node:child_process'
import { delimiter, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Invoked by `npm run setup` using the pinned Node package, before dependencies
// exist. npm must itself run on Node 24 to install modern native optional tools.
if (Number(process.versions.node.split('.')[0]) !== 24 || !process.env.npm_execpath) {
  console.error('Use npm run setup to install the project with Node 24.')
  process.exit(1)
}

const result = spawnSync(process.execPath, [process.env.npm_execpath, 'ci'], {
  cwd: fileURLToPath(new URL('../', import.meta.url)),
  env: { ...process.env, PATH: `${dirname(process.execPath)}${delimiter}${process.env.PATH ?? ''}` },
  stdio: 'inherit',
})
if (result.error) console.error(result.error.message)
process.exit(result.status ?? 1)
