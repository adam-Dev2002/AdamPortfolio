import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

// Fetch actual application captures already made with isolated fictional records.
// The authenticated production workspace is never opened or modified.
const repository = 'adam-Dev2002/AI-Customer-Lead-CRM-System'
const revision = '72638e8e2c955014d989d99fe44a45e47bcf3bca'
const base = `https://raw.githubusercontent.com/${repository}/${revision}`
const output = fileURLToPath(new URL('../public/images/customer-support/', import.meta.url))
const views = [
  ['dashboard', '/'],
  ['leads', '/leads'],
  ['inbox', '/inbox'],
  ['reply-review', '/inbox?view=replies'],
  ['follow-ups', '/follow-ups'],
  ['settings', '/settings'],
]

const screenshots = await Promise.all(views.map(async ([name, route]) => {
  const source = `${base}/docs/images/setup/${name}.png`
  const response = await fetch(source, { signal: AbortSignal.timeout(60000) })
  assert(response.ok, `${name}: screenshot download failed (${response.status})`)
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name}: expected a PNG`)
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20)
  assert.equal(width, 1440)
  assert.equal(height, 1000)
  return { name, route, source, bytes, width, height, sha256: createHash('sha256').update(bytes).digest('hex') }
}))

await mkdir(output, { recursive: true })
for (const shot of screenshots) {
  await writeFile(join(output, `${shot.name}.png`), shot.bytes)
  console.log(`Saved ${shot.name}.png (${shot.width} × ${shot.height}, fictional demo data)`)
}
const provenance = {
  repository: `https://github.com/${repository}`,
  revision,
  captureScript: `${base}/scripts/capture-setup-docs.mjs`,
  sourceNotes: `${base}/docs/images/setup/README.md`,
  workflowSha256: '13c6167752c025c00971a1c34c24976ddebd2ece0baede8a153bb5c1de2d2773',
  data: 'ClearFlow Demo Plumbing; 16 fictional sample leads; example.com addresses; mock QA Owner; no live integrations.',
  screenshots: screenshots.map(({ bytes, ...metadata }) => metadata),
}
await writeFile(join(output, 'provenance.json'), JSON.stringify(provenance, null, 2) + '\n')
await writeFile(join(output, 'README.md'), `# AI Customer Support & Lead CRM screenshots

These are actual 1440 × 1000 application captures fetched from [the project repository](https://github.com/${repository}/tree/${revision}/docs/images/setup), pinned to commit \`${revision}\`.

The repository's [capture script](${provenance.captureScript}) creates an isolated local workspace with mock authentication, ClearFlow Demo Plumbing, 16 fictional sample leads, and \`example.com\` email addresses. Customers are marked Sample in the interface. Counts, approval states, and delivery labels are illustrative. No production customer records or real email delivery appear in these images.

The supplied ClearFlow Gemini workflow matches the repository's documented source SHA-256. Its 128 nodes include 118 automation nodes and 10 notes. The portfolio renders diagrams from that private export without publishing its parameters or account bindings.

Refresh these pinned screenshots with \`node scripts/fetch-customer-support.mjs\`. To create fresh captures after frontend changes, use the upstream capture script in an isolated checkout, review its fictional output, and then update the pinned revision. \`provenance.json\` records each source URL, route, dimensions, and SHA-256.

| Image | Application view |
| --- | --- |
${views.map(([name, route]) => `| ${name}.png | \`${route}\` |`).join('\n')}
`)
