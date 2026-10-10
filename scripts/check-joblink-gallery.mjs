import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    await page.goto('http://127.0.0.1:5178/projects', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Preview Joblink Tracker', exact: true }).click()
    const dialog = page.locator('dialog.project-preview')
    const views = dialog.locator('.project-preview__tabs button')
    assert.equal(await views.count(), 12)
    for (let index = 0; index < (await views.count()); index++) {
      await views.nth(index).click()
      await dialog.locator('img').evaluate((img) => img.decode())
      if (index < 10) {
        const size = await dialog
          .locator('img')
          .evaluate((img) => [img.naturalWidth, img.naturalHeight])
        assert.equal(size[0], 3840)
        assert(size[1] >= 2160)
      }
      assert((await dialog.locator('.project-preview__footer p').innerText()).length > 50)
      assert(
        await dialog.locator('.project-preview__stage').evaluate((el) => el.clientHeight > 180),
        'Tabs must leave room for screenshots',
      )
      assert(
        await dialog.evaluate((el) => el.getBoundingClientRect().right <= innerWidth),
        'Gallery must fit the viewport',
      )
    }
    assert.equal(
      await dialog.getByRole('link', { name: 'Visit Joblink Tracker' }).getAttribute('href'),
      'https://joblink-tracker-c8zm.vercel.app/',
    )
    await views.nth(0).click()
    await page.screenshot({
      path: `docs/screenshots/joblink-complete-${viewport.width}-preview.png`,
    })
    await dialog.getByRole('button', { name: 'Close preview' }).click()
    console.log(
      `${viewport.width}px: all 12 gallery views, 10 four-K images, captions, layout, and live link passed`,
    )
    await page.close()
  }
} finally {
  await browser.close()
}
