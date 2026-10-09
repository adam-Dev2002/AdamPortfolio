import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const failures = []
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1100, height: 768 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    page.on('pageerror', error => failures.push(error.message))
    const routes = process.argv.includes('--dark-only') ? ['/about'] : ['/', '/projects', '/about', '/showcase', '/testimonials', '/services', '/contact']
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:5178${route}`, { waitUntil: 'networkidle' })
      await page.locator('h1').waitFor()
      await page.locator('img').evaluateAll(async images => {
        images.forEach(img => { img.loading = 'eager' })
        await Promise.all(images.map(img => img.decode().catch(() => {})))
      })
      const broken = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).map(img => img.src))
      if (broken.length) failures.push(`${viewport.width} ${route}: broken images ${broken.join(', ')}`)
      const layout = await page.evaluate(() => {
        const panel = document.querySelector('.shell__panel')
        return { overflow: document.documentElement.scrollWidth > innerWidth, clipped: panel.dataset.fixed === 'true' && panel.scrollHeight > panel.clientHeight + 2 }
      })
      if (layout.overflow || layout.clipped) failures.push(`${viewport.width} ${route}: ${JSON.stringify(layout)}`)
      if (viewport.width !== 1100 && ['/', '/projects', '/about', '/showcase'].includes(route)) {
        await page.screenshot({ path: `docs/screenshots/adam-${viewport.width}-${route.slice(1) || 'home'}.png`, fullPage: viewport.width < 1100 })
      }
      if (route === '/showcase') {
        const src = await page.locator('iframe').getAttribute('src')
        if (src !== 'https://www.youtube-nocookie.com/embed/Q8s3rW9jc6Q') failures.push('Wrong video embed')
      }
      if (route === '/about') {
        const href = await page.getByRole('link', { name: 'Download my resume' }).getAttribute('href')
        const response = await page.request.get(`http://127.0.0.1:5178${href}`)
        if (!response.ok() || !response.headers()['content-type']?.includes('application/pdf')) failures.push('Resume download failed')
      }
      console.log(`${viewport.width}px ${route} checked`)
    }
    await page.goto('http://127.0.0.1:5178/about', { waitUntil: 'networkidle' })
    await page.locator('h1').waitFor()
    await page.locator('.agrid__portrait img').evaluate(img => img.decode())
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark' })
    await page.waitForTimeout(350)
    await page.screenshot({ path: `docs/screenshots/adam-${viewport.width}-about-dark.png`, fullPage: viewport.width < 1100 })
    await page.close()
  }
} finally {
  await browser.close()
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1 }
else console.log('All routes, images, layouts, video embed, and resume download passed.')
