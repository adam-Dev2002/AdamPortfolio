import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })
  const response = await page.goto('https://joblink-tracker-c8zm.vercel.app/', { waitUntil: 'networkidle', timeout: 60000 })
  console.log('HTTP:', response.status())
  console.log((await page.locator('body').innerText()).slice(0, 12000))
  await mkdir('public/images/joblink', { recursive: true })
  await page.screenshot({ path: 'public/images/joblink/joblink-desktop.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: 'public/images/joblink/joblink-mobile.png', fullPage: true })
} finally { await browser.close() }
