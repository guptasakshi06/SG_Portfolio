import test from 'node:test'
import assert from 'node:assert/strict'
import { content } from '../src/content'
import { crawlFiles, metadataEntries, metadataHtml, metadataPaths, origin, pageMetadata, productionOrigin } from '../src/app/metadata'

test('all page and project routes have grounded initial and client metadata; unknown routes are noindex', () => {
  assert.equal(metadataPaths.length, 8 + content.projects.length)
  const titles = new Set<string>()
  for (const path of metadataPaths) {
    const meta = pageMetadata(path)
    assert.equal(meta.found, true)
    assert.ok(meta.title.includes('SG') && meta.description.length > 40)
    assert.equal(pageMetadata(path + '/').path, path)
    assert.match(metadataHtml(meta), /og:title/)
    titles.add(meta.title)
  }
  assert.equal(titles.size, metadataPaths.length)
  for (const path of ['/missing', '/projects/missing']) {
    const meta = pageMetadata(path)
    assert.equal(meta.found, false)
    assert.match(metadataHtml(meta, 'https://fixture.invalid'), /noindex, nofollow/)
    assert.doesNotMatch(metadataHtml(meta, 'https://fixture.invalid'), /canonical|og:url/)
  }
})

test('unset production origin omits invented absolute addresses and crawl files; configured origin derives all URLs', () => {
  assert.equal(origin, null)
  assert.equal(productionOrigin(null), null)
  assert.deepEqual(crawlFiles(), {})
  for (const bad of ['', 'https://example.com', 'https://sub.example.org', 'https://localhost', 'https://a.test', 'http://portfolio.site', '//portfolio.site', 'https://user:secret@portfolio.site', 'https://portfolio.site/path', 'https://portfolio.site?q=1', 'https://portfolio.site#h', 'https://portfolio.site:8443']) assert.throws(() => productionOrigin(bad))
  assert.equal(productionOrigin('https://portfolio.site/'), 'https://portfolio.site')
  const meta = pageMetadata('/projects/loan-analysis-dashboard')
  assert.doesNotMatch(metadataHtml(meta), /canonical|og:url|og:image|https:\/\//)
  const fixtureOrigin = 'https://fixture.invalid'
  const configured = metadataHtml(meta, fixtureOrigin)
  assert.match(configured, /rel="canonical" href="https:\/\/fixture.invalid\/projects\/loan-analysis-dashboard"/)
  assert.match(configured, /og:image" content="https:\/\/fixture.invalid\/og-image.png"/)
  const files = crawlFiles(fixtureOrigin)
  assert.match(files['robots.txt'], /Sitemap: https:\/\/fixture.invalid\/sitemap.xml/)
  assert.equal((files['sitemap.xml'].match(/<url>/g) ?? []).length, metadataPaths.length)
  assert.equal(metadataEntries(meta, fixtureOrigin).find(item => item.key === 'robots')?.value, 'index, follow')
})

test('metadata serialization escapes HTML rather than executing owner text', () => {
  const html = metadataHtml({ title: '<script>alert(1)</script>', description: '" onload="bad & <text>', path: '/contact', found: true })
  assert.doesNotMatch(html, /<script>|content="" onload=/)
  assert.match(html, /&lt;script&gt;/)
  assert.match(html, /&quot; onload=&quot;bad &amp; &lt;text&gt;/)
})
