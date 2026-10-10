import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

// Dedicated, ignored profile: sign in interactively; never read the user's
// normal Chrome profile or export cookies and credentials.
await mkdir('public/images/joblink', { recursive: true })
const context = await chromium.launchPersistentContext(resolve('.preview-tools/joblink-capture-profile'), {
  channel: 'chrome', headless: false,
  viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2,
})
try {
  const page = context.pages()[0] ?? await context.newPage()
  await page.goto('https://joblink-tracker-c8zm.vercel.app/', { waitUntil: 'domcontentloaded' })
  console.log('Capture window opened. Waiting for interactive sign-in to the Joblink dashboard.')
  await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor({ timeout: 600000 })
  async function capture(file) {
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
    await page.evaluate(async () => {
      await document.fonts.ready
      const visibleImages = [...document.images].filter(img => {
        const box = img.getBoundingClientRect()
        return box.top < innerHeight && box.bottom > 0
      })
      visibleImages.forEach(img => { img.loading = 'eager' })
      await Promise.race([
        Promise.all(visibleImages.map(img => img.decode().catch(() => {}))),
        new Promise(resolve => setTimeout(resolve, 10000)),
      ])
      window.scrollTo(0, 0)
    })
    await page.screenshot({ path: `public/images/joblink/${file}.png` })
    console.log(`Captured ${file}: 3840 x 2160 pixels`)
  }
  await capture('joblink-dashboard')
  await page.getByText('Explore jobs', { exact: true }).first().click()
  await page.getByRole('heading', { name: 'Find work', exact: true }).waitFor()
  await capture('joblink-jobs')
  await page.getByText('News & events', { exact: true }).first().click()
  await page.getByText('Ideas for your next chapter.', { exact: true }).waitFor()
  await capture('joblink-news')
  console.log('All authenticated Joblink screenshots captured successfully.')
} finally {
  await context.close()
}
