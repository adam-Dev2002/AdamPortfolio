import { chromium } from 'playwright'
import { mkdir, writeFile, access } from 'node:fs/promises'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  await mkdir('public/images/plumbing', { recursive: true })
  await mkdir('.preview-tools', { recursive: true })
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  })
  const queue = ['https://5splumbing.com/']
  const seen = new Set(queue)
  const pages = []
  for (let index = 0; index < queue.length; index++) {
    if (queue.length > 30)
      throw new Error('Unexpected number of public pages; review discovered URLs')
    const url = queue[index]
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    if (!response.ok()) {
      console.log(`Skipped unavailable page: ${response.status()} ${url}`)
      continue
    }
    const links = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((a) => a.href))
    for (const link of links) {
      const candidate = new URL(link)
      if (candidate.origin !== 'https://5splumbing.com' || candidate.search || candidate.hash)
        continue
      candidate.hash = ''
      if (/wp-|\.(?:jpg|png|pdf|svg|webp)|checkout|cart|my-account/i.test(candidate.pathname))
        continue
      if (!seen.has(candidate.href)) {
        seen.add(candidate.href)
        queue.push(candidate.href)
      }
    }
    const slug = new URL(url).pathname.replaceAll('/', '') || 'home'
    const file = `/images/plumbing/${slug}.jpg`
    const exists =
      process.argv.includes('--resume') &&
      (await access(`public${file}`).then(
        () => true,
        () => false,
      ))
    if (!exists) {
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
      // Scroll through the page to load the images used by full-page screenshots.
      await page.evaluate(async () => {
        await document.fonts.ready
        for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight) {
          window.scrollTo(0, top)
          await new Promise((resolve) => setTimeout(resolve, 150))
        }
        document.querySelectorAll('img').forEach((img) => {
          img.loading = 'eager'
        })
        await Promise.race([
          Promise.all([...document.images].map((img) => img.decode().catch(() => {}))),
          new Promise((resolve) => setTimeout(resolve, 8000)),
        ])
        window.scrollTo(0, 0)
      })
      await page.screenshot({ path: `public${file}`, type: 'jpeg', quality: 90, fullPage: true })
      if (index === 0)
        await page.screenshot({ path: 'public/images/5s-plumbing.jpg', type: 'jpeg', quality: 90 })
    }
    const text = (await page.locator('body').innerText()).slice(0, 4000)
    const title = await page.title()
    pages.push({ url, file, title })
    await writeFile('.preview-tools/plumbing-pages.json', JSON.stringify(pages, null, 2))
    console.log(JSON.stringify({ url, file, title, text }))
  }
  await writeFile('.preview-tools/plumbing-pages.json', JSON.stringify(pages, null, 2))
  console.log(`Captured ${pages.length} public pages at 3840 pixels wide.`)
} finally {
  await browser.close()
}
