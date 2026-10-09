import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })
  await page.goto('https://5splumbing.com/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(4000)
  await page.screenshot({ path: 'public/images/5s-plumbing.jpg', type: 'jpeg', quality: 88 })
  console.log('Saved 5S Plumbing homepage screenshot.')
} finally {
  await browser.close()
}
