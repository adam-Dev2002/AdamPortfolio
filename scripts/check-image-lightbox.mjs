import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('http://127.0.0.1:5178/projects', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Preview Joblink Tracker', exact: true }).click()
    const gallery = page.locator('dialog.project-preview')
    const trigger = gallery.getByRole('button', {
      name: 'Open Dashboard image fullscreen',
      exact: true,
    })
    await trigger.click()
    const viewer = page.locator('dialog.image-lightbox')
    await viewer.locator('img').evaluate((img) => img.decode())
    assert.equal(await gallery.locator('.project-preview__panel').evaluate(el => getComputedStyle(el).display), 'none', 'Fullscreen must hide the previous gallery image immediately')
    const bounds = await viewer.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        background: getComputedStyle(el).backgroundColor,
        backdrop: getComputedStyle(el, '::backdrop').backgroundColor,
      }
    })
    assert.equal(bounds.x, 0)
    assert.equal(bounds.y, 0)
    assert.equal(bounds.width, viewport.width)
    assert.equal(bounds.height, viewport.height)
    assert.equal(bounds.background, 'rgba(0, 0, 0, 0)')
    assert(bounds.backdrop.includes('0.64'), 'Backdrop must keep the page visible behind it')
    await viewer.getByRole('button', { name: 'Zoom in', exact: true }).click()
    assert.equal(await viewer.locator('.image-lightbox__percentage').innerText(), '125%')
    await viewer.getByRole('button', { name: 'Fit width', exact: true }).click()
    const wheel = await viewer.locator('.image-lightbox__stage').evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const event = new WheelEvent('wheel', {
        deltaY: -160,
        ctrlKey: true,
        clientX: rect.left + rect.width * 0.6,
        clientY: rect.top + rect.height * 0.5,
        bubbles: true,
        cancelable: true,
      })
      el.dispatchEvent(event)
      return event.defaultPrevented
    })
    assert(wheel, 'Ctrl+scroll should zoom the image instead of the browser')
    await page.waitForFunction(
      () => document.querySelector('.image-lightbox__percentage').textContent !== '100%',
    )
    await viewer.getByRole('button', { name: 'Fit width', exact: true }).click()
    await viewer.getByRole('button', { name: 'Zoom in', exact: true }).click()
    await viewer.getByRole('button', { name: 'Zoom in', exact: true }).click()
    const stage = viewer.locator('.image-lightbox__stage')
    const initial = await stage.evaluate((el) => ({ left: el.scrollLeft, top: el.scrollTop }))
    const imageBox = await viewer.locator('img').boundingBox()
    const startY = Math.min(imageBox.y + imageBox.height - 30, viewport.height * 0.6)
    await page.mouse.move(viewport.width * 0.75, startY)
    await page.mouse.down()
    await page.mouse.move(viewport.width * 0.4, startY - 60, { steps: 8 })
    await page.mouse.up()
    assert(await viewer.evaluate((el) => el.open), 'Dragging the image must not dismiss it')
    const after = await stage.evaluate((el) => ({ left: el.scrollLeft, top: el.scrollTop }))
    assert(
      after.left > initial.left || after.top > initial.top,
      'Drag should move the enlarged image',
    )
    await page.screenshot({ path: `docs/screenshots/fullscreen-${viewport.width}-image.png` })
    await page.keyboard.press('Escape')
    await viewer.waitFor({ state: 'detached' })
    assert(await gallery.evaluate((el) => el.open), 'Escape should return to the project gallery')
    assert(
      await trigger.evaluate((el) => el === document.activeElement),
      'Close must restore image-button focus',
    )
    await gallery.getByRole('button', { name: 'Applications', exact: true }).click()
    await gallery.getByRole('button', { name: 'Open fullscreen', exact: true }).click()
    await viewer.locator('img').evaluate((img) => img.decode())
    assert((await viewer.locator('img').getAttribute('src')).endsWith('joblink-applications.png'))
    assert.equal(await viewer.locator('.image-lightbox__percentage').innerText(), '100%')
    await viewer.getByRole('button', { name: 'Close fullscreen image', exact: true }).click()
    await gallery.getByRole('button', { name: 'Close preview', exact: true }).click()
    assert.deepEqual(errors, [])
    console.log(
      `${viewport.width}px: fullscreen, transparency, buttons, Ctrl+wheel, drag, Escape, frame selection, and focus passed`,
    )
    await page.close()
  }
} finally {
  await browser.close()
}
