import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'

// A rendered workbook excerpt, not a screenshot of the Google Sheets application.
// Only job metadata is included; email addresses and application text are omitted.
const rows = JSON.parse((await readFile(join(tmpdir(), 'portfolio-jobtracker-preview.json'), 'utf8')).replace(/^\uFEFF/, ''))
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })
  await page.setContent(`<!doctype html><html><head><style>
    *{box-sizing:border-box}body{margin:0;background:#f3f6f5;color:#172c26;font:16px Arial,sans-serif;padding:52px}
    .tag{color:#188251;font-weight:bold;letter-spacing:2px;font-size:14px}h1{font-size:42px;margin:20px 0 12px}p{color:#586c63;line-height:1.6}
    .stats{display:flex;gap:20px;margin:30px 0}.stats div{background:white;border:1px solid #d8e4de;border-radius:16px;padding:22px;width:25%}.stats b{display:block;font-size:32px;margin-bottom:8px}
    .sheet{background:white;border:1px solid #d8e4de;border-radius:16px;overflow:hidden}table{border-collapse:collapse;width:100%;table-layout:fixed}th{text-align:left;background:#e4f2e9;color:#196e45;padding:18px}td{padding:18px;border-top:1px solid #e5ece7;line-height:1.4;word-break:break-word;font-size:14px}th:first-child{width:30%}th:nth-child(2){width:20%}th:nth-child(3){width:18%}
    .tabs{border-top:1px solid #d8e4de;padding:20px;display:flex;gap:36px;color:#63766b}.tabs b{color:#188251}.note{font-size:14px}
  </style></head><body><span class="tag">n8n / SPREADSHEET AUTOMATION</span><h1>JOBHACK2026 — Job Tracker</h1><p>Actual workbook excerpt · Snapshot from the supplied XLSX · 19 tracking columns</p>
  <div class="stats"><div><b>207</b>Tracked jobs</div><div><b>193</b>New</div><div><b>1</b>Ready to Draft</div><div><b>13</b>Draft Ready</div></div>
  <div class="sheet"><table><thead><tr>${['Job Title','Company','Location','Source','Match Score','Status'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${Object.values(row).map(x=>`<td>${escape(x)}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="tabs"><b>Job Tracker</b><span>Workflow Guide</span><span>Status Summary</span></div></div>
  <p class="note">Rendered workbook excerpt. Employer email, application messages, and Gmail draft IDs are excluded from this public preview.</p></body></html>`)
  await page.screenshot({ path: 'public/images/workflows/job-tracker-sheet.png', fullPage: true })
} finally { await browser.close() }
