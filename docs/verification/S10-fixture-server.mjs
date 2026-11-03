// Local QA only: proxy the production preview while simulating an absent PDF.
// No owner files, content configuration or deployment is modified.
import { createServer } from 'node:http'
const mode = process.argv[2] ?? 'missing'
if (!['missing', 'html'].includes(mode)) throw new Error('Use missing or html')
const port = mode === 'missing' ? 4174 : 4175
createServer(async (request, response) => {
  if (request.url?.startsWith('/resume/')) {
    response.writeHead(mode === 'missing' ? 404 : 200, { 'content-type': mode === 'missing' ? 'text/plain' : 'text/html' })
    response.end(mode === 'missing' ? 'S10 isolated missing-file fixture' : '<!doctype html><title>S10 HTML fallback fixture</title>Not a PDF')
    return
  }
  try {
    const upstream = await fetch(`http://127.0.0.1:4173${request.url}`, { redirect: 'manual' })
    const headers = Object.fromEntries(upstream.headers)
    delete headers['content-encoding']; delete headers['content-length']; delete headers['transfer-encoding']
    response.writeHead(upstream.status, headers)
    response.end(Buffer.from(await upstream.arrayBuffer()))
  } catch { response.writeHead(502); response.end('Production preview must be running on port 4173') }
}).listen(port, '127.0.0.1', () => console.log(`S10 ${mode} fixture: http://127.0.0.1:${port}`))
