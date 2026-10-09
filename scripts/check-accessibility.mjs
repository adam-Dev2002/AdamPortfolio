import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  const viewports = [{ width: 1865, height: 955 }, { width: 1440, height: 900 }, { width: 1100, height: 768 }, { width: 390, height: 844 }]
  for (const viewport of viewports.filter(viewport => !process.argv.includes('--mobile-only') || viewport.width === 390)) {
    const page = await browser.newPage({ viewport })
    page.on('pageerror', error => errors.push(error.message))
    const openMenu = async () => {
      if (viewport.width >= 1100) await page.getByRole('button', { name: 'Accessibility options', exact: true }).click()
      else {
        await page.getByRole('button', { name: 'Theme and accessibility', exact: true }).click()
        await page.getByRole('button', { name: 'Accessibility', exact: true }).click()
      }
    }
    const assertNoOverflow = async label => {
      const overflow = await page.evaluate(() => {
        const panel = document.getElementById('main-content')
        return { document: document.documentElement.scrollWidth > innerWidth + 2, panel: innerWidth >= 1100 && panel.scrollWidth > panel.clientWidth + 2 }
      })
      assert(!overflow.document && !overflow.panel, `${label}: horizontal overflow ${JSON.stringify(overflow)}`)
    }
    await page.goto('http://127.0.0.1:5178/', { waitUntil: 'networkidle' })
    await page.waitForFunction(() => !document.documentElement.classList.contains('is-intro'))
    await openMenu()
    await page.getByRole('button', { name: 'Reduce motion', exact: false }).click()
    assert.equal(await page.locator('html').getAttribute('data-a11y-motion'), 'true')
    assert.equal(await page.locator('.hero-canvas').count(), 0, 'Reduce motion must remove the animated background immediately')
    await page.getByRole('button', { name: 'High contrast', exact: false }).click()
    await page.getByRole('button', { name: 'Underline links', exact: false }).click()
    await page.getByRole('button', { name: 'Close accessibility options', exact: true }).click()
    for (const size of ['Default text size', 'Larger text', 'Largest text']) {
      await openMenu()
      await page.getByRole('button', { name: size, exact: true }).click()
      await page.getByRole('button', { name: 'Close accessibility options', exact: true }).click()
      await page.locator('.tools-marquee img').evaluateAll(async images => { await Promise.all(images.map(img => img.decode())) })
      assert.equal(await page.locator('.tools-marquee__item').count(), 7)
      await page.locator('.tools-marquee__item').filter({ hasText: 'Vercel' }).waitFor()
      await assertNoOverflow(`${viewport.width}px ${size}`)
      if (viewport.width < 1100) {
        const avatar = await page.locator('.hprofile__avatar').boundingBox()
        assert(Math.abs(avatar.width - avatar.height) < 1, 'Profile photo must retain a circular aspect ratio')
      }
      const issues = await page.locator('.home .bento__card').evaluateAll(cards => cards.flatMap(card => {
        const head = card.querySelector('.bento__head').getBoundingClientRect()
        const media = card.querySelector('.bento__media').getBoundingClientRect()
        const result = []
        if (head.bottom > media.top + 2 && head.right > media.left + 2) result.push('Header overlaps media')
        const rows = [...card.querySelectorAll('.bento__offer')].map(row => row.getBoundingClientRect())
        if (rows.some((row, i) => i && row.top < rows[i - 1].bottom - 1)) result.push('Skill rows overlap')
        const photo = card.querySelector('.bento__photo')?.getBoundingClientRect()
        if (photo && (photo.top < media.top - 2 || photo.bottom > media.bottom + 2)) result.push('Photo escapes media')
        return result
      }))
      assert.deepEqual(issues, [], `${viewport.width}px ${size}: card layout`)
      assert(await page.locator('.tools-marquee__track').evaluate(track => getComputedStyle(track).animationName === 'none'))
    }
    await page.screenshot({ path: `docs/screenshots/a11y-${viewport.width}-xl-home.png`, fullPage: viewport.width < 1100 })
    await page.reload({ waitUntil: 'networkidle' })
    await page.locator('h1').waitFor()
    assert.equal(await page.locator('html').getAttribute('data-a11y-text'), 'xl', 'Text size must survive reload')
    assert.equal(await page.locator('.hero-canvas').count(), 0)
    for (const route of ['projects', 'showcase', 'about', 'contact', 'services', 'testimonials']) {
      await page.goto(`http://127.0.0.1:5178/${route}`, { waitUntil: 'networkidle' })
      await page.locator('h1').waitFor()
      await assertNoOverflow(`${viewport.width}px A++ /${route}`)
    }
    await page.goto('http://127.0.0.1:5178/', { waitUntil: 'networkidle' })
    await page.locator('h1').waitFor()
    await openMenu()
    await page.getByRole('button', { name: 'Reset to default', exact: true }).click()
    assert.equal(await page.locator('html').getAttribute('data-a11y-text'), null)
    assert.equal(await page.locator('html').getAttribute('data-a11y-motion'), null)
    await page.getByRole('button', { name: 'Close accessibility options', exact: true }).click()
    await assertNoOverflow(`${viewport.width}px reset`)
    console.log(`${viewport.width}px: all text sizes, high contrast, motion, links, persistence, reset, and route layouts passed`)
    await page.close()
  }
  assert.deepEqual(errors, [], 'No browser runtime errors')
} finally {
  await browser.close()
}
