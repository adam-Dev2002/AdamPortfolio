import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createHash } from 'node:crypto'

// Only labels, node types, positions, and connections enter these public diagrams.
// Parameters, prompts, account details, and credential references stay in the source export.
if (!process.argv[2]) throw new Error('Usage: node scripts/capture-customer-support.mjs <workflow.json>')
const sourceBytes = await readFile(resolve(process.argv[2]))
const source = JSON.parse(sourceBytes.toString('utf8'))
const nodes = source.nodes.filter(node => !node.type.endsWith('.stickyNote'))
const byName = new Map(nodes.map(node => [node.name, node]))
const out = resolve('public/images/workflows')
await mkdir(out, { recursive: true })
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c])
function wrap(value, length = 22) {
  const lines = ['']
  for (const word of value.split(/\s+/)) {
    if ((lines.at(-1) + ' ' + word).trim().length > length) lines.push(word)
    else lines[lines.length - 1] += `${lines.at(-1) ? ' ' : ''}${word}`
  }
  return lines
}
const text = (x, y, content, size = 20, color = '#eef3fa', weight = 500, length = 26, lineHeight = size * 1.3) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${wrap(content, length).map((line, i) => `<tspan x="${x}" dy="${i ? lineHeight : 0}">${escape(line)}</tspan>`).join('')}</text>`
function shell(width, height, title, subtitle, body, footer) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" font-family="Arial, sans-serif"><defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#29364a"/></pattern><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 10 5 0 10" fill="#788da8"/></marker></defs><rect width="100%" height="100%" fill="#101a2a"/><rect width="100%" height="100%" fill="url(#grid)"/>${text(55, 52, 'n8n / CUSTOMER EXPERIENCE AUTOMATION', 17, '#ffab84', 700, 80)}${text(55, 110, title, 42, '#f4f7fc', 700, 100)}${text(55, 152, subtitle, 20, '#a8b8cf', 400, 150)}${body}${text(55, height - 30, footer, 16, '#9cabbe', 400, 190)}</svg>`
}
function icon(type, name) {
  if (type.endsWith('.httpRequest') && /Gemini/.test(name)) return ['AI', '✦', '#b399ff']
  if (type.endsWith('.httpRequest') && /^(?:Read (?:sending )?Gmail|Check Gmail|Update Gmail|Save confirmed Gmail|Send confirmed Gmail)/.test(name)) return ['Gmail API', 'M', '#ff998c']
  if (type.endsWith('.gmail')) return ['Gmail', 'M', '#ff998c']
  if (type.endsWith('.googleSheets')) return ['Sheets', 'S', '#71d3ad']
  if (type.endsWith('.if')) return ['Condition', '?', '#ffc183']
  if (type.endsWith('.scheduleTrigger')) return ['Schedule', '◷', '#93baff']
  if (type.endsWith('.formTrigger')) return ['Form', '≡', '#71d3ad']
  if (type.endsWith('.manualTrigger')) return ['Manual', '↯', '#93baff']
  if (type.endsWith('.code') || type.endsWith('.set')) return ['Logic', '{}', '#ffc183']
  if (type.endsWith('.httpRequest')) return ['API', '↗', '#93baff']
  return ['n8n', '→', '#93baff']
}
function graph({ title, subtitle, layout, width = 1800, height = 1110, compact = false }) {
  const w = compact ? 176 : 244, h = compact ? 116 : 144
  let edges = ''
  for (const [name, connection] of Object.entries(source.connections)) {
    if (!layout[name]) continue
    for (const ports of Object.values(connection)) for (const [portIndex, port] of ports.entries()) for (const edge of port) {
      if (!layout[edge.node]) continue
      const [sx, sy] = layout[name], [tx, ty] = layout[edge.node]
      const y1 = sy + h / 2 + (portIndex ? 18 : 0), y2 = ty + h / 2
      let path
      if (tx >= sx + w) path = `M${sx + w} ${y1} C${sx + w + 35} ${y1} ${tx - 35} ${y2} ${tx} ${y2}`
      else if (ty > sy + h) path = `M${sx + w / 2} ${sy + h} C${sx + w / 2} ${sy + h + 35} ${tx + w / 2} ${ty - 35} ${tx + w / 2} ${ty}`
      else path = `M${sx} ${y1} C${sx - 40} ${y1} ${tx + w + 40} ${y2} ${tx + w} ${y2}`
      edges += `<path d="${path}" fill="none" stroke="#788da8" stroke-width="${compact ? 2 : 3}" marker-end="url(#arrow)"/>`
    }
  }
  const cards = Object.entries(layout).map(([name, [x, y]]) => {
    const node = byName.get(name)
    if (!node) throw new Error(`Missing source node: ${name}`)
    const [label, mark, color] = icon(node.type, name)
    const displayName = name.replace(/^[A-Z]+(?:\s[A-Z]+)* — /, '').replace(/^Gmail — /, '')
    return `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="14" fill="#1d2a3d" stroke="#43516b"/><rect x="13" y="13" width="30" height="30" rx="9" fill="${color}"/>${text(19, 35, mark, 18, '#152136', 700)}${text(54, 34, label, compact ? 12 : 15, color, 600)}${text(13, 65, displayName, compact ? 13 : 17, '#eef3fa', 600, compact ? 21 : 24, compact ? 16 : 20)}</g>`
  }).join('')
  return shell(width, height, title, subtitle, edges + cards, `Rendered from the supplied n8n export · ${Object.keys(layout).length} source nodes · Connections reflect the export`)
}
function overview() {
  const lanes = [
    { y: 230, index: '01', color: '#b399ff', title: 'Support replies', benefit: 'Prepare a helpful response.', steps: [['Gmail inbox', 'Screen incoming inquiries', 'M'], ['Gemini AI', 'Prepare a suggested reply', '✦'], ['Gmail drafts', 'Keep the reply for review', 'M'], ['Dashboard event', 'Publish inquiry & draft', '↗']] },
    { y: 455, index: '02', color: '#71d3ad', title: 'Lead capture', benefit: 'Keep inquiries organized.', steps: [['Customer form', 'Collect inquiry & consent', '≡'], ['Check & classify', 'Validate, dedupe, optional AI', '{}'], ['Sheets + dashboard', 'Save and publish the lead', 'S'], ['Notifications', 'Respect email preferences', 'M']] },
    { y: 680, index: '03', color: '#93baff', title: 'Owner dashboard', benefit: 'Review and choose next steps.', steps: [['Next.js frontend', 'Manage leads & reply reviews', '↗'], ['One-minute bridge', 'Sync owner changes to Sheets', 'S'], ['Owner confirms', 'Queue a separate send action', '?'], ['Gmail result', 'Confirm the delivery outcome', 'M']] },
    { y: 905, index: '04', color: '#ffc183', title: 'Follow-ups', benefit: 'Follow up with permission.', steps: [['Hourly check', 'Find due, consenting leads', '◷'], ['Reviewed email', 'Claim approved follow-up', '?'], ['Gmail delivery', 'Send the reserved follow-up', 'M'], ['Result events', 'Update Sheets & dashboard', '↗']] },
  ]
  let body = `<rect x="55" y="184" width="1490" height="1" fill="#35445c"/>`
  for (const lane of lanes) {
    body += `${text(55, lane.y + 20, lane.index, 18, lane.color, 700)}${text(55, lane.y + 62, lane.title, 27, '#f4f7fc', 700, 24)}${text(55, lane.y + 101, lane.benefit, 17, '#a8b8cf', 400, 26)}`
    lane.steps.forEach(([title, description, mark], i) => {
      const x = 370 + i * 294, y = lane.y
      if (i < 3) body += `<path d="M${x + 246} ${y + 69} H${x + 282}" stroke="#788da8" stroke-width="3" marker-end="url(#arrow)"/>`
      body += `<g transform="translate(${x} ${y})"><rect width="246" height="156" rx="18" fill="#1d2a3d" stroke="#43516b"/><rect x="16" y="16" width="34" height="34" rx="10" fill="${lane.color}"/>${text(22, 40, mark, 22, '#152136', 700)}${text(16, 83, title, 19, '#f4f7fc', 700, 24)}${text(16, 111, description, 15, '#a8b8cf', 400, 28, 20)}</g>`
    })
  }
  return shell(1600, 1200, 'AI Customer Support & Lead CRM', 'Next.js owner dashboard + n8n + Gemini + Gmail + Google Sheets. One connected customer support project.', body, 'Supplied ClearFlow export · 118 automation nodes + 10 notes · Approval and sending are separate · Diagram, not a live execution')
}
const positions = rows => Object.fromEntries(rows.flatMap((row, r) => row.map((name, c) => [name, [55 + c * 294, 220 + r * 204]])))
const stages = [
  ['customer-support-overview', overview(), 1600, 1200],
  ['customer-support-drafts', graph({ title: '01 / Prepare support replies for review', subtitle: 'Shared business settings, Gemini suggestions, a manual-review fallback, and dashboard result events.', height: 1320, layout: positions([
    ['START — Every 5 Minutes', 'Read shared email configuration', 'CONFIG — BUSINESS, FAQ & AI MODELS', 'Gmail — List Labels', 'Verify Gmail Labels', 'Gmail — Find Unhandled Customer Emails'],
    ['LOOP — One Email At A Time', 'Gmail — Read Full Email', 'Prepare Email + Safety Screen', 'IF — Eligible Customer Email?', 'Gmail — Lock For Processing', 'CHECK — Email AI Enabled?'],
    ['Compose Trusted AI Prompt', 'AI — Gemini Primary', 'Parse Gemini Result', 'Review AI & Route', 'IF — Create Customer Draft?', 'Gmail — Create Draft (NEVER SEND)'],
    ['Prepare manual email review', 'Gmail — Mark Skipped', 'Gmail — Label No-Draft Outcome', 'Gmail — Label Draft Outcome', 'Gmail — Remove Processing Lock', 'END — Batch Complete'],
    ['Email support processed', 'Publish Email support processed', 'Email screening result', 'Publish Email screening result', 'Email inquiry without draft', 'Publish Email inquiry without draft'],
  ]) }), 1800, 1320],
  ['customer-support-leads', graph({ title: '02 / Capture leads in Sheets and the dashboard', subtitle: 'Validate, deduplicate, optionally classify with Gemini, and respect independent notification preferences.', height: 1320, layout: positions([
    ['FORM — Customer Inquiry', 'TAG — Form Submission', 'Keep inquiry context', 'Read shared CRM configuration', 'CONFIG — BUSINESS SETTINGS (EDIT HERE)', 'ROUTE — Is Customer Form?'],
    ['VALIDATE — Format & Check Lead', 'CHECK — Is Lead Valid?', 'SHEETS — Read for Duplicate Check', 'DEDUPE — Same Inquiry Within 15 Min', 'CHECK — Not Duplicate?', 'LEADS — AI Classification Enabled?'],
    ['LEADS — Prepare Gemini Lead Prompt', 'LEADS — Gemini Classify (Optional)', 'LEADS — Parse AI or Safe Default', 'SHEETS — Append Customer Lead', 'Form Captured', 'Publish Form captured'],
    ['LEADS — Without AI (Free Mode)', 'CHECK — Customer Emails Enabled?', 'CHECK — Customer Acknowledgement Enabled?', 'GMAIL — Acknowledge Inquiry', 'Record acknowledgement result', 'CHECK — Owner Alerts Enabled?'],
    ['GMAIL — Alert Business Owner', 'Record owner alert result', 'SHEETS — Save Initial Email Results', 'Initial email results', 'Publish Initial email results'],
  ]) }), 1800, 1320],
  ['customer-support-followups', graph({ title: '03 / Deliver a reviewed, consented follow-up', subtitle: 'The hourly route checks eligibility and claims approved content before reservation and delivery.', height: 900, layout: positions([
    ['SCHEDULE — Check Open Leads Hourly', 'TAG — Scheduled Review', 'Keep inquiry context', 'Read shared CRM configuration', 'CONFIG — BUSINESS SETTINGS (EDIT HERE)', 'ROUTE — Is Customer Form?'],
    ['SHEETS — Read Open Leads', 'FILTER — Pending Consented Follow-Ups', 'Claim consented follow-up', 'Follow-up claimed?', 'SHEETS — Reserve Follow-Up', 'Follow-up reserved'],
    ['Publish Follow-up reserved', 'GMAIL — Send Consented Follow-Up', 'SHEETS — Log Follow-Up Outcome', 'Follow-up outcome', 'Publish Follow-up outcome'],
  ]) }), 1800, 900],
  ['customer-support-sync', graph({ title: '04 / Synchronize owner changes', subtitle: 'A one-minute bridge applies lead edits and reply reviews. Updating an existing draft never sends it.', layout: positions([
    ['Poll every minute', 'Bridge settings', 'Read owner changes', 'Each change', 'Loop changes', 'Lead change?'],
    ['Read existing lead', 'Merge owner fields', 'Lead row valid?', 'Save shared lead', 'Lead acknowledgement', 'Confirm external result'],
    ['Prepare review row', 'Save reply review', 'Update existing Gmail draft?', 'Read Gmail draft', 'Prepare Gmail update', 'Gmail update valid?'],
    ['Update Gmail draft — never send', 'Gmail acknowledgement', 'Review acknowledgement', 'Guard acknowledgement'],
  ]) }), 1800, 1110],
  ['customer-support-delivery', graph({ title: '05 / Send a separately confirmed reply', subtitle: 'Owner-confirmed queue → claim → prepare and record a Gmail draft → send → confirm the Gmail result.', height: 900, layout: positions([
    ['Check queued replies every minute', 'Read sending Gmail account', 'Claim approved reply', 'Reply waiting?', 'Read Gmail reply context', 'Build confirmed Gmail draft'],
    ['Draft ready to save?', 'Save confirmed Gmail draft', 'Draft saved?', 'Record prepared draft', 'Send confirmed Gmail draft', 'Gmail delivery result'],
    ['Preparation needs review', 'Confirm Gmail delivery'],
  ]) }), 1800, 900],
]
const minX = Math.min(...nodes.map(node => node.position[0]))
const minY = Math.min(...nodes.map(node => node.position[1]))
const fullLayout = Object.fromEntries(nodes.map(node => [node.name, [55 + (node.position[0] - minX) * 1.1, 215 + (node.position[1] - minY) * 1.1]]))
const fullWidth = Math.ceil(Math.max(...Object.values(fullLayout).map(([x]) => x)) + 235)
const fullHeight = Math.ceil(Math.max(...Object.values(fullLayout).map(([, y]) => y)) + 190)
stages.push(['customer-support-full', graph({ title: 'AI Customer Support & Lead CRM / Full workflow', subtitle: `${nodes.length} automation nodes from the ClearFlow Gemini-only export (${source.nodes.length} including notes). Original positions and connections; not a live execution.`, layout: fullLayout, width: fullWidth, height: fullHeight, compact: true }), fullWidth, fullHeight])
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  for (const [name, svg, width, height] of stages) {
    await writeFile(resolve(out, `${name}.svg`), svg)
    await page.setViewportSize({ width, height })
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`)
    await page.screenshot({ path: resolve(out, `${name}.png`) })
    console.log(`${name}: ${width} × ${height}`)
  }
  console.log(`Full workflow: ${nodes.length} automation nodes; private source data excluded.`)
} finally { await browser.close() }
await writeFile(resolve(out, 'customer-support-provenance.json'), JSON.stringify({
  sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
  totalNodes: source.nodes.length,
  automationNodes: nodes.length,
  noteNodes: source.nodes.length - nodes.length,
  publishedFields: ['node name', 'node type', 'position', 'connection'],
  diagrams: stages.map(([name, , width, height]) => ({ name, width, height })),
}, null, 2) + '\n')
