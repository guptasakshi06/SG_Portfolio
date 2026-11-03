import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { content } from '../src/content'
import { ProfileAction } from '../src/components/layout/ProfileAction'
import { ResumeContext } from '../src/features/contact/resume-context'
import { checkResume, profileActionHref } from '../src/features/contact/actions'

const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')

test('all public action kinds use safe owner configuration and deliberate missing states', () => {
  const profile = structuredClone(content.profile)
  assert.equal(profileActionHref(profile, 'email', 'available'), 'mailto:guptasak06%40gmail.com')
  for (const kind of ['github', 'linkedin'] as const) assert.equal(profileActionHref(profile, kind, 'available'), profile.socials[kind])
  assert.equal(profileActionHref(profile, 'resume', 'available'), profileActionHref(profile, 'resume-open', 'available'))
  for (const state of ['checking', 'unavailable'] as const) assert.equal(profileActionHref(profile, 'resume', state), null)
  for (const bad of ['javascript:alert(1)', '//host.invalid', 'https://user:secret@host.invalid', 'http://host.invalid', ' https://host.invalid', 'https://git\nhub.com']) {
    profile.socials.github = bad
    assert.equal(profileActionHref(profile, 'github', 'available'), null)
  }
  profile.email = 'bad\r\nBcc:another@host.invalid'
  assert.equal(profileActionHref(profile, 'email', 'available'), null)
  profile.resume!.path = '/unsafe.html'
  assert.equal(profileActionHref(profile, 'resume', 'available'), null)
  profile.resume!.path = '/resume/safe.pdf'
  profile.resume!.downloadName = '../unsafe.pdf'
  assert.equal(profileActionHref(profile, 'resume', 'available'), null)
  profile.resume = null; profile.email = null; profile.socials = { github: null, linkedin: null }
  for (const kind of ['email', 'github', 'linkedin', 'resume', 'resume-open'] as const) assert.equal(profileActionHref(profile, kind, 'available'), null)
})

test('shared action rendering distinguishes read/download/new-tab semantics and removes unavailable hrefs', () => {
  for (const state of ['available', 'checking', 'unavailable'] as const) {
    for (const kind of ['email', 'github', 'linkedin', 'resume', 'resume-open'] as const) {
      const html = renderToStaticMarkup(createElement(ResumeContext, { value: state }, createElement(ProfileAction, { kind })))
      if (kind.startsWith('resume') && state !== 'available') {
        assert.doesNotMatch(html, /href=|<a\b|download=/)
        assert.match(html, /aria-disabled="true"/)
      } else {
        assert.match(html, /href=/)
        if (kind === 'resume') { assert.match(html, /download="Sakshi_Gupta_Resume.pdf"/); assert.doesNotMatch(html, /target=/) }
        if (kind === 'resume-open' || kind === 'github' || kind === 'linkedin') { assert.match(html, /target="_blank"/); assert.match(html, /rel="noopener noreferrer"/) }
      }
    }
  }
})

test('resume probes reject HTML fallbacks, non-PDF data, redirects, errors and cancellation', async () => {
  for (const response of [new Response('missing', { status: 404 }), new Response('<html>SPA fallback</html>', { headers: { 'content-type': 'text/html' } }), new Response('<html>mislabelled</html>', { headers: { 'content-type': 'application/pdf' } }), new Response('%PDF-1.7', { headers: { 'content-type': 'text/plain' } })]) {
    assert.equal(await checkResume('/test.pdf', undefined, async () => response), false)
  }
  assert.equal(await checkResume('/test.pdf', undefined, async () => { throw new Error('offline') }), false)
  const controller = new AbortController(); controller.abort()
  assert.equal(await checkResume('http://127.0.0.1:1/test.pdf', controller.signal), false)
})

test('isolated stable-path replacement changes version/hash and serves new PDF bytes; missing files fail safely', async () => {
  const original = await readFile('public/resume/sakshi-gupta-resume.pdf')
  const temporary = await mkdtemp(join(tmpdir(), 'sg-s10-resume-'))
  const asset = join(temporary, 'resume.pdf')
  const requests: string[] = []
  const server = createServer(async (request, response) => {
    requests.push(request.url ?? '')
    if (request.url === '/redirect.pdf') { response.writeHead(302, { location: '/resume.pdf' }); response.end(); return }
    try { const bytes = await readFile(asset); response.writeHead(200, { 'content-type': 'application/pdf' }); response.end(bytes) }
    catch { response.writeHead(404); response.end('missing') }
  })
  try {
    await writeFile(asset, original)
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    const address = server.address()
    assert.ok(address && typeof address !== 'string')
    const base = `http://127.0.0.1:${address.port}`
    const fixture = structuredClone(content.profile)
    const before = profileActionHref(fixture, 'resume', 'available')!
    assert.equal(await checkResume(base + before), true)
    assert.equal(await checkResume(base + '/redirect.pdf'), false)
    // A valid trailing PDF comment changes only the isolated copy, never the owner asset.
    const replacement = Buffer.concat([original, Buffer.from('\n% S10 isolated replacement check only\n')])
    await writeFile(asset, replacement)
    fixture.resume!.sha256 = hash(replacement)
    fixture.resume!.version = `fixture-${fixture.resume!.sha256.slice(0, 12)}`
    const after = profileActionHref(fixture, 'resume', 'available')!
    assert.notEqual(after, before)
    assert.equal(after.split('?')[0], before.split('?')[0])
    assert.equal(profileActionHref(fixture, 'resume-open', 'available'), after)
    assert.equal(await checkResume(base + after), true)
    assert.equal(hash(new Uint8Array(await (await fetch(base + after)).arrayBuffer())), fixture.resume!.sha256)
    assert.ok(requests.includes(before) && requests.includes(after))
    await rm(asset)
    assert.equal(await checkResume(base + after), false)
    assert.equal(hash(await readFile('public/resume/sakshi-gupta-resume.pdf')), hash(original))
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); await rm(temporary, { recursive: true, force: true }) }
})
