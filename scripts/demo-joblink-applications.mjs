import { chromium } from 'playwright'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

// Explicit demo records for the user's authorized portfolio demonstration.
// Re-running this script skips existing demo titles; it never removes records.
const demos = [
  [
    'DEMO - IT Support Specialist',
    'Demo Northstar Support',
    'Saved',
    'PHP 30,000 - 40,000',
    '2026-10-11',
  ],
  [
    'DEMO - Customer Support Associate',
    'Demo Harbor Services',
    'Application opened',
    'PHP 28,000 - 35,000',
    '2026-10-10',
  ],
  [
    'DEMO - Virtual Assistant',
    'Demo Maple Operations',
    'Applied',
    'PHP 32,000 - 42,000',
    '2026-10-09',
  ],
  [
    'DEMO - Frontend Developer',
    'Demo Brightline Studio',
    'Interview',
    'PHP 45,000 - 60,000',
    '2026-10-08',
  ],
  ['DEMO - QA Tester', 'Demo Cloudbridge Labs', 'Offer', 'PHP 38,000 - 50,000', '2026-10-07'],
  [
    'DEMO - Automation Assistant',
    'Demo Orbit Workflows',
    'Rejected',
    'PHP 35,000 - 45,000',
    '2026-10-06',
  ],
  [
    'DEMO - Technical Support Agent',
    'Demo Pine Remote',
    'Ghosted',
    'PHP 30,000 - 38,000',
    '2026-10-05',
  ],
  [
    'DEMO - Junior Web Designer',
    'Demo Lantern Creative',
    'Applied',
    'PHP 32,000 - 44,000',
    '2026-10-04',
  ],
]
const directory = resolve('.preview-tools/joblink-exports')
await mkdir(directory, { recursive: true })
await mkdir('docs/exports', { recursive: true })
const context = await chromium.launchPersistentContext(
  resolve('.preview-tools/joblink-capture-profile'),
  {
    channel: 'chrome',
    headless: false,
    acceptDownloads: true,
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  },
)
try {
  const page = context.pages()[0] ?? (await context.newPage())
  await page.goto('https://joblink-tracker-c8zm.vercel.app/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor({ timeout: 600000 })
  await page.getByText('Applications', { exact: true }).first().click()
  await page.getByRole('heading', { name: 'Job application tracker', exact: true }).waitFor()
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
  await page.locator('tbody tr').first().waitFor()
  for (const [title, company, status, salary, date] of demos) {
    if (await page.getByText(title, { exact: true }).count()) {
      console.log(`Already present: ${title}`)
      continue
    }
    await page.getByRole('button', { name: 'Add application', exact: true }).click()
    await page.locator('#entry-title').fill(title)
    await page.locator('#entry-company').fill(company)
    await page
      .locator('#entry-url')
      .fill(`https://example.com/demo-jobs/${demos.findIndex((row) => row[0] === title) + 1}`)
    await page.locator('#entry-salary').fill(salary)
    await page.locator('#entry-status').selectOption(status)
    await page.locator('#entry-date').fill(date)
    await page
      .locator('#entry-notes')
      .fill(
        'DEMO DATA: Fictional application for the portfolio showcase; no real application submitted.',
      )
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await page.getByText(title, { exact: true }).waitFor()
    console.log(`Added ${title}: ${status}`)
  }
  await page.reload({ waitUntil: 'networkidle' })
  for (const [title] of demos) await page.getByText(title, { exact: true }).waitFor()
  await page.addStyleTag({
    content: 'html { scrollbar-width: none; } html::-webkit-scrollbar { display: none; }',
  })
  await page.evaluate(async () => {
    await document.fonts.ready
    window.scrollTo(0, 0)
  })
  await page.screenshot({ path: 'public/images/joblink/joblink-applications.png', fullPage: true })
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export CSV', exact: true }).click()
  const download = await downloadPromise
  const filename = download.suggestedFilename()
  const csvPath = resolve(directory, filename)
  await download.saveAs(csvPath)
  assert.equal(await download.failure(), null)
  const csv = (await readFile(csvPath, 'utf8')).replace(/^\uFEFF/, '')
  const rows = parseCsv(csv)
  const header = rows.shift()
  const exportedDemos = rows.filter((row) => row.some((value) => value.startsWith('DEMO - ')))
  assert.equal(exportedDemos.length, demos.length, 'Export must include every demo application')
  for (const [title, company, status] of demos) {
    assert(
      exportedDemos.some(
        (row) => row.includes(title) && row.includes(company) && row.includes(status),
      ),
    )
  }
  const cleanCsv = [header, ...exportedDemos]
    .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
    .join('\r\n')
  await writeFile('docs/exports/joblink-demo-applications.csv', cleanCsv)
  console.log(
    `Export verified: ${filename}; ${rows.length} total records, ${exportedDemos.length} demo records; headers: ${header.join(', ')}`,
  )
  console.log(`Actual download saved to ${csvPath}`)
  const preview = await context.newPage()
  await preview.setContent(`<!doctype html><html><head><style>
    *{box-sizing:border-box}body{margin:0;padding:48px;background:#f3f6fc;color:#152c45;font:16px Arial,sans-serif}h1{font-size:40px;margin:16px 0}.eyebrow{color:#0875d1;font-size:14px;font-weight:bold;letter-spacing:2px}.meta{display:flex;gap:24px;margin:28px 0}.meta div{background:white;border:1px solid #dce5ef;border-radius:12px;padding:20px;flex:1}.meta b{display:block;font-size:24px;margin-bottom:8px}table{border-collapse:collapse;width:100%;background:white;table-layout:fixed}th{background:#e5effb;text-align:left;color:#0766b3}th,td{border:1px solid #dce5ef;padding:15px;word-break:break-word;font-size:14px;line-height:1.45}p{color:#5c7087;line-height:1.6}
  </style></head><body><span class="eyebrow">JOBLINK / VERIFIED CSV EXPORT</span><h1>Application tracker export</h1><p>Preview rendered from the CSV downloaded using Joblink's Export CSV button.</p><div class="meta"><div><b>Download successful</b>${escape(filename)}</div><div><b>${exportedDemos.length} demo applications</b>All demo records and their statuses verified</div><div><b>Fictional showcase data</b>Existing personal records omitted from this preview</div></div><table><thead><tr>${header.map((value) => `<th>${escape(value)}</th>`).join('')}</tr></thead><tbody>${exportedDemos.map((row) => `<tr>${row.map((value) => `<td>${escape(value)}</td>`).join('')}</tr>`).join('')}</tbody></table><p>Demo companies, roles, salaries, and outcomes are fictional. This is a CSV preview, not an Excel or Google Sheets screenshot.</p></body></html>`)
  await preview.addStyleTag({
    content: 'html { scrollbar-width: none; } html::-webkit-scrollbar { display: none; }',
  })
  await preview.screenshot({ path: 'public/images/joblink/joblink-export.png', fullPage: true })
  await page.getByText('Dashboard', { exact: true }).first().click()
  await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor()
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
  await page.screenshot({ path: 'public/images/joblink/joblink-dashboard.png' })
  console.log('Populated tracker, refreshed dashboard, and export preview captured.')
} finally {
  await context.close()
}

function escape(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
}
function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"'
        i++
      } else quoted = !quoted
    } else if (c === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((c === '\r' || c === '\n') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(value)
      if (row.some(Boolean)) rows.push(row)
      row = []
      value = ''
    } else value += c
  }
  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }
  return rows
}
