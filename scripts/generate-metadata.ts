import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { crawlFiles, injectMetadata, metadataPaths, origin, pageMetadata } from '../src/app/metadata'

const html = readFileSync('dist/index.html', 'utf8')
for (const path of metadataPaths) {
  const directory = resolve('dist', path.slice(1))
  mkdirSync(directory, { recursive: true })
  writeFileSync(resolve(directory, 'index.html'), injectMetadata(html, pageMetadata(path)))
}
for (const [file, text] of Object.entries(crawlFiles())) writeFileSync(resolve('dist', file), text)

console.log(`Initial metadata generated for ${metadataPaths.length} routes; production origin ${origin ?? 'unset (no canonical/absolute OG, robots.txt or sitemap.xml)'}.`)
