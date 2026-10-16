import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

// Local-only presentation covers. Original project screenshots and Figma exports
// remain untouched; CSS supplies the canvas, framing, crops, and perspective.
// Regenerate with: node scripts/capture-project-overviews.mjs
const root = fileURLToPath(new URL('../', import.meta.url))
const output = resolve(root, 'public/images/overviews')
const width = 1600
const height = 1000
const assets = new Map()
const usedAssets = new Map()
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

async function source(path) {
  if (!assets.has(path)) {
    const mime = path.endsWith('.svg') ? 'image/svg+xml' : path.endsWith('.jpg') ? 'image/jpeg' : 'image/png'
    assets.set(path, `data:${mime};base64,${(await readFile(join(root, 'public/images', path))).toString('base64')}`)
  }
  return assets.get(path)
}

async function picture(path, className = '', style = '') {
  usedAssets.get(currentProject).add(path)
  return `<img class="${className}" style="${style}" alt="" src="${await source(path)}">`
}

// Crop coordinates refer to existing source pixels, never redrawn UI.
async function board({ path, label, left, top, w, crop, angle = -4, layer = 1, browser = false }) {
  const scale = (w - 16) / crop[2]
  const h = crop[3] * scale
  const img = await picture(path, '', `width:${crop[4] * scale}px;height:${crop[5] * scale}px;left:${-crop[0] * scale}px;top:${-crop[1] * scale}px`)
  return `<div class="board ${browser ? 'browser' : ''}" style="left:${left}px;top:${top}px;width:${w}px;transform:rotate(${angle}deg);z-index:${layer}"><div class="bar"><i></i><i></i><i></i><span>${escape(label)}</span></div><div class="crop" style="height:${h}px">${img}</div></div>`
}

async function phone(path, left, top, w, angle, layer) {
  return `<div class="phone" style="left:${left}px;top:${top}px;width:${w}px;height:${(w - 16) * 812 / 375 + 16}px;transform:rotate(${angle}deg);z-index:${layer}">${await picture(path)}</div>`
}

const projects = [
  {
    id: 'customer-support', kicker: 'WORKFLOW / CUSTOMER SUPPORT', title: 'AI Support<br>& Lead CRM', titleSize: 70,
    headline: 'Reply faster.<br>Keep leads moving.', description: 'Email drafts, organized leads<br>and consent-based follow-ups.',
    tags: ['n8n', 'Gemini', 'Gmail · Sheets'], accent: '#bba2ff', glow: '#282448',
    provenance: 'EXPORTED WORKFLOW DIAGRAMS',
    render: async () => [
      await board({ path: 'workflows/customer-support-overview.png', label: 'Support replies · Lead capture · Follow-ups', left: 620, top: 192, w: 890, crop: [25, 211, 1540, 683, 1600, 980] }),
      await board({ path: 'workflows/customer-support-drafts.png', label: 'Support drafts / workflow detail', left: 888, top: 610, w: 610, crop: [25, 190, 1750, 805, 1800, 1110], angle: 5, layer: 2 }),
    ].join(''),
  },
  {
    id: 'gmail-assistant', kicker: 'WORKFLOW / EMAIL ASSISTANT', title: 'Gemini Gmail<br>Assistant', titleSize: 70,
    headline: 'Your inbox,<br>in conversation.', description: 'Chat, session memory<br>and email on request.',
    tags: ['n8n', 'Gemini', 'Gmail'], accent: '#ac9bff', glow: '#25204a',
    provenance: 'EXPORTED WORKFLOW DIAGRAM',
    render: async () => [
      await board({ path: 'workflows/gmail-assistant.png', label: 'A conversation connected to your email', left: 625, top: 218, w: 905, crop: [100, 330, 2215, 1040, 2480, 1680], angle: -4 }),
      await board({ path: 'workflows/gmail-assistant.png', label: 'Gemini model', left: 748, top: 683, w: 340, crop: [170, 1000, 510, 340, 2480, 1680], angle: -7, layer: 2 }),
      await board({ path: 'workflows/gmail-assistant.png', label: 'Gmail tool', left: 1165, top: 648, w: 340, crop: [1720, 1000, 500, 320, 2480, 1680], angle: 6, layer: 3 }),
    ].join(''),
  },
  {
    id: 'job-finder', kicker: 'WORKFLOW / REMOTE JOB SEARCH', title: 'PH WFH<br>Job Finder', titleSize: 80,
    headline: 'Find remote roles.<br>Prepare your next step.', description: 'Discover jobs, track matches<br>and prepare Gmail drafts.',
    tags: ['n8n', 'Gemini', 'Google Sheets'], accent: '#66d9b8', glow: '#123c3a',
    provenance: 'EXPORTED WORKFLOW DIAGRAMS',
    render: async () => [
      await board({ path: 'workflows/job-discovery.png', label: 'Discover / Three sources, one tracker', left: 625, top: 198, w: 895, crop: [70, 330, 2325, 1070, 2480, 1680] }),
      await board({ path: 'workflows/application-writing.png', label: 'Prepare / Application email drafts', left: 886, top: 612, w: 620, crop: [70, 330, 2325, 1070, 2480, 1680], angle: 5, layer: 2 }),
    ].join(''),
  },
  {
    id: 'joblink', kicker: 'WEB APP / JOB SEARCH WORKSPACE', title: 'Joblink<br>Tracker', titleSize: 84,
    headline: 'Your next opportunity,<br>all in one workspace.', description: 'Find roles, track applications<br>and plan what comes next.',
    tags: ['Job search', 'Applications', 'Planning'], accent: '#62b8ff', glow: '#15394b',
    provenance: 'ACTUAL APP CAPTURES · DEMO APPLICATIONS',
    render: async () => [
      await board({ path: 'joblink/joblink-dashboard.png', label: 'Joblink / Dashboard', left: 620, top: 181, w: 900, crop: [0, 0, 3840, 2160, 3840, 2160], browser: true }),
      await board({ path: 'joblink/joblink-applications.png', label: 'Joblink / Applications', left: 922, top: 578, w: 585, crop: [0, 0, 3840, 2160, 3840, 2160], angle: 5, layer: 2, browser: true }),
    ].join(''),
  },
  {
    id: 'plumbing', kicker: 'BUSINESS WEBSITE / FREELANCE', title: '5S<br>Plumbing', titleSize: 84,
    headline: 'Clear services.<br>A simpler way to enquire.', description: 'Service pages, customer reviews<br>and quote requests.',
    tags: ['WordPress', 'GoDaddy'], accent: '#68d5c6', glow: '#143b3b',
    provenance: 'ACTUAL WEBSITE CAPTURES',
    render: async () => [
      await board({ path: '5s-plumbing.jpg', label: '5S Plumbing / Home', left: 620, top: 180, w: 900, crop: [0, 0, 3840, 2160, 3840, 2160], browser: true }),
      await board({ path: 'plumbing/home.jpg', label: '5S Plumbing / Services', left: 922, top: 578, w: 585, crop: [0, 3420, 3840, 2120, 3840, 9660], angle: 5, layer: 2, browser: true }),
    ].join(''),
  },
  {
    id: 'fu-media', kicker: 'CAPSTONE / MEDIA MANAGEMENT', title: 'FU<br>Media', titleSize: 84,
    headline: 'Find your files.<br>See what’s inside.', description: 'AI classification, automatic tags<br>and keyword search.',
    tags: ['Python', 'OpenCV', 'YOLO'], accent: '#f2a1ad', glow: '#3d263e',
    provenance: 'EXISTING PROJECT DEMO STILL',
    render: async () => `${await board({ path: 'fu-media.jpg', label: 'FU Media / Project demo', left: 620, top: 225, w: 900, crop: [0, 0, 1280, 720, 1280, 720], angle: -4 })}<div class="art-caption" style="left:680px;top:814px">FILE MANAGEMENT <b>+</b> MEDIA STREAMING</div>`,
  },
  {
    id: 'restaurant', kicker: 'FIGMA / MOBILE APP CONCEPT', title: 'Restaurant<br>App', titleSize: 76,
    headline: 'A taste of<br>thoughtful design.', description: 'From the main menu<br>to the perfect dish.',
    tags: ['Figma', 'UI design'], accent: '#f6b48d', glow: '#493329',
    provenance: 'ORIGINAL FIGMA SCREEN EXPORTS',
    render: async () => [
      await phone('designs/restaurant-menu.svg', 605, 221, 294, -7, 2),
      await phone('designs/restaurant-sushi.svg', 916, 103, 310, 2, 3),
      await phone('designs/restaurant-ramen.svg', 1232, 215, 287, 8, 1),
    ].join(''),
  },
  {
    id: 'pet-shop', kicker: 'FIGMA / GRAPHIC DESIGN', title: 'Pet Shop<br>Business Card', titleSize: 68,
    headline: 'Small format.<br>A friendly first impression.', description: 'A two-sided business card<br>and a little brand personality.',
    tags: ['Figma', 'Print design'], accent: '#e7b982', glow: '#43332a',
    provenance: 'ORIGINAL FIGMA CARD EXPORTS',
    render: async () => `<div class="card front">${await picture('designs/pet-shop-front.svg')}</div><div class="card back">${await picture('designs/pet-shop-back.svg')}</div>`,
  },
]

const css = `
  *{box-sizing:border-box}body{margin:0;width:1600px;height:1000px;overflow:hidden;background:#060d14;color:#edf4ff;font-family:Arial,sans-serif}
  body:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 73% 48%,var(--glow) 0,transparent 61%),radial-gradient(ellipse at 7% 95%,#0b2b41 0,transparent 52%)}
  .copy{position:absolute;left:92px;top:235px;width:465px;z-index:5}.kicker{font-size:15px;color:var(--accent);letter-spacing:3px;font-weight:bold;line-height:1.6;white-space:nowrap}h1{font-size:var(--title-size);letter-spacing:-3.8px;margin:27px 0 25px;line-height:1.02}h2{font-size:31px;line-height:1.35;font-weight:500;margin:0 0 25px;letter-spacing:-.6px}p{font-size:20px;line-height:1.6;color:#91a9bf;margin:0}
  .tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:36px}.tags span{padding:11px 15px;border:1px solid #29435a;border-radius:30px;font-size:14px;color:#b5d1ec;background:#102030}
  .board{position:absolute;padding:7px;border:1px solid #476079;border-radius:20px;background:#142535;box-shadow:0 28px 65px #0009;overflow:hidden;transform-origin:center}.bar{height:33px;display:flex;align-items:center;gap:6px;padding:0 10px 7px;color:#a5b9ca;font-size:12px;letter-spacing:.5px}.bar i{display:block;width:6px;height:6px;border-radius:50%;background:#476079;flex:none}.bar i:first-child{background:var(--accent)}.bar span{margin-left:10px}.crop{position:relative;width:100%;overflow:hidden;border-radius:0 0 11px 11px;background:#0e1929}.crop img{position:absolute;max-width:none;display:block}.browser .crop{background:#fff}
  .phone{position:absolute;border-radius:36px;padding:8px;background:#142535;border:1px solid #476079;box-shadow:0 28px 65px #0009;overflow:hidden}.phone img{width:100%;height:100%;object-fit:contain;border-radius:27px;display:block;background:white}
  .card{position:absolute;padding:0;border:1px solid #6f6457;border-radius:14px;overflow:hidden;background:white;box-shadow:0 28px 65px #0009}.card img{display:block;width:100%;height:100%;object-fit:contain}.front{left:688px;top:188px;width:745px;height:425px;transform:rotate(-8deg);z-index:1}.back{left:810px;top:503px;width:690px;height:394px;transform:rotate(6deg);z-index:2}
  .art-caption{position:absolute;color:#91a9bf;font-size:15px;letter-spacing:3px}.art-caption b{color:var(--accent);font-weight:400;padding:0 14px}.label{position:absolute;bottom:66px;left:92px;color:#647f98;font-size:13px;letter-spacing:1px;z-index:6}.dot{display:inline-block;width:9px;height:9px;border-radius:100%;background:var(--accent);margin-right:10px}
`

await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true })
let currentProject
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  // The composition must be reproducible with repository files alone.
  await page.route(/^https?:/, route => route.abort())
  for (const project of projects) {
    currentProject = project.id
    usedAssets.set(currentProject, new Set())
    const artwork = await project.render()
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body style="--accent:${project.accent};--glow:${project.glow};--title-size:${project.titleSize}px"><div class="copy"><div class="kicker">${escape(project.kicker)}</div><h1>${project.title}</h1><h2>${project.headline}</h2><p>${project.description}</p><div class="tags">${project.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div></div>${artwork}<div class="label"><span class="dot"></span>${escape(project.provenance)} · PRESENTATION COMPOSITION</div></body></html>`)
    await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
    const issues = await page.locator('.copy').evaluate(copy => {
      const children = [...copy.children]
      return children.filter(child => child.scrollWidth > child.clientWidth + 1 || child.getBoundingClientRect().bottom > 880).map(child => child.tagName)
    })
    if (issues.length) throw new Error(`${project.id}: copy overflow in ${issues.join(', ')}`)
    const clippedFrames = await page.locator('.board,.phone,.card').evaluateAll(frames => frames.filter(frame => {
      const bounds = frame.getBoundingClientRect()
      return bounds.left < 0 || bounds.top < 0 || bounds.right > 1600 || bounds.bottom > 1000
    }).length)
    if (clippedFrames) throw new Error(`${project.id}: ${clippedFrames} frame(s) outside the cover`)
    await page.screenshot({ path: join(output, `${project.id}.png`), animations: 'disabled' })
    console.log(`Saved ${project.id}.png (${width} × ${height})`)
  }
  await page.close()
} finally {
  await browser.close()
}

await writeFile(join(output, 'README.md'), `# Project overview covers\n\nEight 1600 × 1000 PNG presentation covers follow the existing Closeby overview: a dark navy canvas, left-aligned copy, tool or capability tags, and framed project imagery. Layout and frames are CSS presentation, not application UI. All visible project imagery comes from existing repository files; original assets are unchanged. No external requests are used.\n\nRegenerate from the repository root with:\n\n\`\`\`sh\nnode scripts/capture-project-overviews.mjs\n\`\`\`\n\nThe script uses installed Playwright with Chrome (or PLAYWRIGHT_CHANNEL). Copy is based on src/data/portfolio.ts, workflows.ts, and plumbing.ts. Joblink badges describe capabilities because its stack is not documented there. Workflow images depict exported structure rather than live executions; Joblink screenshots contain labeled fictional demo applications. FU Media uses the existing demo still. Restaurant and pet shop images are original Figma SVG exports.\n\n| Cover | Existing source assets under public/images |\n| --- | --- |\n${projects.map(project => `| ${project.id}.png | ${[...usedAssets.get(project.id)].map(path => `\`${path}\``).join(', ')} |`).join('\n')}\n`)
