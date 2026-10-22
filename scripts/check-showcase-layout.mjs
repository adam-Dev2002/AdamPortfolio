import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const baseURL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:5173'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
await mkdir('.preview-tools', { recursive: true })
try {
  for (const width of [1920, 1440, 1100, 1024, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${baseURL}/projects`, { waitUntil: 'networkidle' })
    await page.waitForURL(`${baseURL}/showcase`)
    await page.getByRole('heading', { name: 'A closer look at my work.' }).waitFor()
    assert.equal(new URL(page.url()).pathname, '/showcase', 'Old project URLs must redirect to Showcase')
    assert.equal(await page.locator('a[href="/projects"]').count(), 0, 'The duplicate navigation destination must be removed')
    const navigation = width >= 1100 ? page.locator('.rail__nav') : page.locator('.tabbar')
    await navigation.locator('a[href="/showcase"][aria-current="page"]').waitFor()
    assert.equal(await navigation.getByRole('link', { name: 'Showcase', exact: true }).getAttribute('aria-current'), 'page')
    assert.equal(await page.locator('.portfolio-card').count(), 9)
    await page.locator('.portfolio-card img').evaluateAll(async images => {
      images.forEach(img => { img.loading = 'eager' })
      await Promise.all(images.map(img => img.decode()))
    })
    const layout = await page.locator('.portfolio-cards').evaluate(grid => {
      const box = grid.getBoundingClientRect()
      const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length
      const cards = [...grid.children].map(card => {
        const { left, top, width, height } = card.getBoundingClientRect()
        const media = card.querySelector('.portfolio-card__media').getBoundingClientRect()
        return { left, top, width, height, mediaRatio: media.width / media.height }
      })
      return { width: box.width, columns, cards }
    })
    const rows = new Map()
    for (const card of layout.cards) {
      const key = Math.round(card.top)
      rows.set(key, [...(rows.get(key) || []), card])
      assert(Math.abs(card.mediaRatio - 1.6) < 0.01, 'Every cover retains the same 8:5 ratio')
    }
    for (const row of rows.values()) {
      if (row.length === 1 && layout.columns === 2) {
        assert(Math.abs(row[0].width - layout.width) < 2, 'A single featured card must fill the tablet row')
      } else {
        assert.equal(row.length, layout.columns, 'Each project row must fill all columns')
        assert(Math.max(...row.map(card => card.height)) - Math.min(...row.map(card => card.height)) < 2, 'Cards in a row must have equal heights')
        assert(Math.max(...row.map(card => card.width)) - Math.min(...row.map(card => card.width)) < 2, 'Cards in a row must have equal widths')
      }
    }
    if (layout.columns === 3) assert(Math.max(...layout.cards.map(card => card.height)) - Math.min(...layout.cards.map(card => card.height)) < 2, 'All desktop project cards must have equal heights across rows')
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'The page must fit the viewport')
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark' })
    await page.locator('.portfolio-card').first().scrollIntoViewIfNeeded()
    await page.screenshot({ path: `.preview-tools/showcase-top-${width}.png` })
    await page.locator('.portfolio-card').last().scrollIntoViewIfNeeded()
    await page.screenshot({ path: `.preview-tools/showcase-bottom-${width}.png` })
    await page.goto(baseURL, { waitUntil: 'networkidle' })
    assert.equal(await page.locator('a[href="/projects"]').count(), 0, 'Home must link directly to Showcase')
    console.log(`${width}px: ${layout.columns} columns, complete rows, equal card sizes, consistent covers, navigation and redirect passed`)
    await page.close()
  }
  assert.deepEqual(errors, [], 'No browser runtime errors')
} finally { await browser.close() }
