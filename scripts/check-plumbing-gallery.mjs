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
    await page.getByRole('button', { name: 'Preview 5S Plumbing', exact: true }).click()
    const dialog = page.locator('dialog.project-preview')
    const views = dialog.locator('.project-preview__tabs button')
    assert.equal(await views.count(), 12)
    for (let index = 0; index < (await views.count()); index++) {
      await views.nth(index).click()
      await dialog.locator('img').evaluate((img) => img.decode())
      const size = await dialog
        .locator('img')
        .evaluate((img) => [img.naturalWidth, img.naturalHeight])
      assert(size[0] >= 3840, 'Full-page images must retain at least 4K width')
      assert(size[1] >= 2160, 'Full-page screenshots should include content below the first screen')
      assert((await dialog.locator('.project-preview__footer p').innerText()).length > 30)
      const stage = dialog.locator('.project-preview__stage')
      assert(
        await stage.evaluate((el) => el.clientHeight > 180 && el.scrollHeight > el.clientHeight),
        'Full pages must have a usable scrolling area',
      )
      await stage.evaluate((el) => {
        el.scrollTop = 200
        el.scrollLeft = 100
      })
      assert(await stage.evaluate((el) => el.scrollTop > 0))
      assert(await dialog.evaluate((el) => el.getBoundingClientRect().right <= innerWidth))
    }
    assert.equal(
      await dialog.getByRole('link', { name: 'Visit 5S Plumbing' }).getAttribute('href'),
      'https://5splumbing.com/',
    )
    await views.nth(0).click()
    await dialog.getByRole('button', { name: 'Open fullscreen' }).click()
    const fullscreen = page.locator('dialog.image-lightbox')
    await fullscreen.getByRole('button', { name: 'Zoom in', exact: true }).click()
    await fullscreen.locator('.image-lightbox__percentage').filter({ hasText: '125%' }).waitFor()
    await fullscreen.getByRole('button', { name: 'Fit width', exact: true }).click()
    await fullscreen.getByRole('button', { name: 'Close fullscreen image', exact: true }).click()
    await page.screenshot({ path: `docs/screenshots/plumbing-${viewport.width}-gallery.png` })
    await dialog.getByRole('button', { name: 'Close preview' }).click()
    console.log(
      `${viewport.width}px: 12 full-page 4K images, captions, scrolling, zoom, and live link passed`,
    )
    await page.close()
  }
} finally {
  await browser.close()
}
