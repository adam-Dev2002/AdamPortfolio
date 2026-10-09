import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  for (const viewport of [{ width: 1865, height: 955 }, { width: 1440, height: 900 }, { width: 1100, height: 768 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://127.0.0.1:5178/', { waitUntil: 'networkidle' })
    await page.locator('.home__title').waitFor()
    const intro = await page.locator('.home__title').innerText()
    const body = await page.locator('.home__lede').textContent()
    if (viewport.width >= 1100) {
      const heights = await page.locator('.home .bento__card').evaluateAll(cards => cards.map(card => card.getBoundingClientRect().height))
      assert(heights.every(height => height < 390), 'Home cards should not stretch to the full project image stack')
      await page.locator('.bento__card--about').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `docs/screenshots/bento-${viewport.width}-home.png` })
    }
    for (const size of ['md', 'xl']) {
      await page.evaluate(size => {
        localStorage.setItem('kv-a11y', JSON.stringify({ text: size, contrast: false, motion: true, links: false }))
      }, size)
      await page.goto('http://127.0.0.1:5178/about', { waitUntil: 'networkidle' })
      await page.locator('.about-intro__title').waitFor()
      await page.locator('.about-portrait__frame img').evaluate(img => img.decode())
      assert.equal((await page.locator('.about-intro__title').innerText()).replace(/\s+/g, ' ').trim(), intro.replace(/\s+/g, ' ').trim(), 'About headline must match Home')
      assert.equal(await page.locator('.about-intro__body').textContent(), body, 'About introduction must match Home')
      const geometry = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('.about-card')]
        const boxes = cards.map(card => card.getBoundingClientRect())
        const overlaps = boxes.some((a, i) => boxes.some((b, j) => j > i && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1))
        const escapes = cards.some(card => {
          const parent = card.getBoundingClientRect()
          return [...card.children].some(child => {
            const rect = child.getBoundingClientRect()
            return rect.top < parent.top - 1 || rect.bottom > parent.bottom + 1 || rect.left < parent.left - 1 || rect.right > parent.right + 1
          })
        })
        return { overlaps, escapes, horizontal: document.documentElement.scrollWidth > innerWidth + 2 }
      })
      assert.deepEqual(geometry, { overlaps: false, escapes: false, horizontal: false }, `${viewport.width}px ${size}: About content must stay inside its bento cards`)
      const download = await page.request.get('http://127.0.0.1:5178/Adam-Resume-2026.pdf')
      assert(download.ok())
      await page.screenshot({ path: `docs/screenshots/bento-${viewport.width}-${size}-about.png`, fullPage: viewport.width < 1100 })
    }
    await page.getByRole('link', { name: 'Start a conversation', exact: true }).click()
    await page.getByRole('heading', { name: 'Let’s talk about your next project.' }).waitFor()
    console.log(`${viewport.width}px: matching intro, compact Home cards, About bounds, larger text, resume, and contact navigation passed`)
    await page.close()
  }
  assert.deepEqual(errors, [])
} finally {
  await browser.close()
}
