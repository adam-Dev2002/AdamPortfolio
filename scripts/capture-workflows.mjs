import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

// Render only node labels, types and connections. Workflow parameters,
// credential references and personal addresses never enter public assets.
const root = resolve('../..')
const chat = JSON.parse(await readFile(resolve(root, 'Gemini Gmail Assistant with Chat Memory.json'), 'utf8'))
const jobs = JSON.parse(await readFile(resolve(root, 'PH WFH Job Search + Auto Gemini Gmail Drafts - Fixed (1).json'), 'utf8'))
const stages = [
  {
    file: 'gmail-assistant', workflow: chat, title: 'Gemini Gmail assistant', subtitle: 'Natural-language requests, session memory, and an email tool.',
    layout: {
      'When chat message received': [80, 180], 'Gemini Email Assistant': [700, 180],
      'Google Gemini Chat Model': [100, 510], 'Simple Memory': [480, 510], 'Gmail - Send Email': [870, 510],
    },
  },
  {
    file: 'job-discovery', workflow: jobs, title: '01 / Discover and track remote jobs', subtitle: 'Manual or scheduled runs fetch, rank, deduplicate, and save job listings.',
    layout: {
      'Manual Run': [50, 180], 'Every Morning at 8': [50, 470], 'Fetch Free Remote Jobs': [350, 300],
      'Filter WFH and Rank Matches': [650, 300], 'Google Sheets - Existing Jobs': [950, 300],
      'Keep Only Untracked Jobs': [650, 590], 'Google Sheets - Append New Jobs': [950, 590],
    },
  },
  {
    file: 'application-writing', workflow: jobs, title: '02 / Prepare application emails', subtitle: 'Read eligible tracker rows and use Gemini to produce a subject and message.',
    layout: {
      'Manual Run': [50, 180], 'Every Morning at 8': [50, 470], 'Google Sheets - Read Rows to Draft': [350, 300],
      'Choose One Row to Draft': [650, 300], 'Gemini AI - Write Application Email': [950, 300],
      'Google Gemini Chat Model - Free Tier': [950, 590], 'Parse Gemini Email JSON': [650, 590],
    },
  },
  {
    file: 'resume-drafts', workflow: jobs, title: '03 / Attach the resume and save a draft', subtitle: 'Validate the PDF, create a Gmail draft, and record its ID in the tracker.',
    layout: {
      'Parse Gemini Email JSON': [50, 260], 'Google Drive - Resume for Draft': [350, 260],
      'Validate Resume PDF - Draft': [650, 260], 'Gmail - Create Resume Draft': [950, 260],
      'Google Sheets - Save Draft ID': [950, 590],
    },
  },
]
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character])
function lines(text, max = 18) {
  const result = ['']
  for (const word of text.replaceAll(' - ', ' ').split(' ')) {
    if ((result.at(-1) + ' ' + word).trim().length > max) result.push(word)
    else result[result.length - 1] += `${result.at(-1) ? ' ' : ''}${word}`
  }
  return result
}
function platform(node) {
  if (node.type.includes('Gemini')) return ['Gemini', '✦', '#8b6be8']
  if (node.type.includes('agent') || node.type.includes('chainLlm')) return ['AI', '✦', '#8b6be8']
  if (node.type.includes('gmail')) return ['Gmail', 'M', '#d95745']
  if (node.type.includes('googleSheets')) return ['Sheets', 'S', '#27956a']
  if (node.type.includes('googleDrive')) return ['Drive', '△', '#d4a636']
  if (node.type.includes('code')) return ['Code', '{}', '#e78440']
  if (node.type.includes('memory')) return ['Memory', '≋', '#418cca']
  if (node.type.includes('http')) return ['HTTP', '↗', '#418cca']
  return ['Trigger', '↯', '#e78440']
}
function svg(stage) {
  const width = 1240, height = 840, nodeWidth = 230, nodeHeight = 150
  let edges = ''
  for (const [source, groups] of Object.entries(stage.workflow.connections)) {
    if (!stage.layout[source]) continue
    for (const [kind, ports] of Object.entries(groups)) for (const port of ports) for (const edge of port) {
      if (!stage.layout[edge.node]) continue
      const [sx, sy] = stage.layout[source], [tx, ty] = stage.layout[edge.node]
      const ai = kind.startsWith('ai_')
      let d
      if (ai) {
        const x1=sx+nodeWidth/2, y1=sy, x2=tx+nodeWidth/2, y2=ty+nodeHeight
        d=`M${x1} ${y1} C${x1} ${y1-100} ${x2} ${y2+100} ${x2} ${y2}`
      } else if (ty > sy + 200 && tx <= sx) {
        const x1=sx+nodeWidth/2, y1=sy+nodeHeight, x2=tx+nodeWidth/2, y2=ty
        d=`M${x1} ${y1} C${x1} ${y1+60} ${x2} ${y2-60} ${x2} ${y2}`
      } else {
        const x1=sx+nodeWidth, y1=sy+nodeHeight/2, x2=tx, y2=ty+nodeHeight/2
        d=`M${x1} ${y1} C${x1+45} ${y1} ${x2-45} ${y2} ${x2} ${y2}`
      }
      edges += `<path d="${d}" fill="none" stroke="${ai ? '#9e82db' : '#7496a4'}" stroke-width="3" ${ai ? 'stroke-dasharray="7 7"' : ''} marker-end="url(#arrow)"/>`
    }
  }
  const nodes = Object.entries(stage.layout).map(([name, [x,y]]) => {
    const node = stage.workflow.nodes.find(n => n.name === name)
    if (!node) throw new Error(`Missing source node: ${name}`)
    const [badge, mark, accent] = platform(node)
    const label = lines(name)
    return `<g transform="translate(${x} ${y})"><rect width="${nodeWidth}" height="${nodeHeight}" rx="18" fill="#202c3d" stroke="#465870" stroke-width="1.5"/><rect x="16" y="16" width="42" height="42" rx="12" fill="${accent}"/><text x="37" y="45" text-anchor="middle" font-size="25" font-weight="700" fill="white">${mark}</text><text x="72" y="42" fill="#a8b9ce" font-size="17" font-weight="600">${badge}</text><text x="17" y="84" fill="#f4f6fa" font-size="18" font-weight="600">${label.map((line,i) => `<tspan x="17" dy="${i ? 24 : 0}">${escape(line)}</tspan>`).join('')}</text></g>`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Arial, sans-serif"><defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#3a4657"/></pattern><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10" fill="#91a6bb"/></marker></defs><rect width="100%" height="100%" fill="#121b28"/><rect width="100%" height="100%" fill="url(#grid)"/><text x="50" y="43" fill="#ff9770" font-size="16" font-weight="700" letter-spacing="2">n8n / AUTOMATION WORKFLOW</text><text x="50" y="88" fill="#f4f6fa" font-size="32" font-weight="700">${escape(stage.title)}</text><text x="50" y="121" fill="#a8b9ce" font-size="18">${escape(stage.subtitle)}</text>${edges}${nodes}<text x="50" y="808" fill="#8ea0b8" font-size="15">Exported workflow structure · Solid: workflow steps · Dashed: AI connections</text></svg>`
}
await mkdir('public/images/workflows', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1240, height: 840 }, deviceScaleFactor: 2 })
  for (const stage of stages) {
    const markup = svg(stage)
    await writeFile(`public/images/workflows/${stage.file}.svg`, markup)
    await page.setContent(`<html><body style="margin:0">${markup}</body></html>`)
    await page.screenshot({ path: `public/images/workflows/${stage.file}.png` })
    console.log(`${stage.file}: ${Object.keys(stage.layout).length} source nodes, 2480 × 1680 screenshot`)
  }
} finally {
  await browser.close()
}
