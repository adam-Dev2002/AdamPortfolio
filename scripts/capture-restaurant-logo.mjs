import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const bytes = await readFile('public/images/designs/restaurant-logo-source.png')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ deviceScaleFactor: 3 })
  await page.setContent(`<html><body style="margin:0;background:#fbf8f3"><img src="data:image/png;base64,${bytes.toString('base64')}" /></body></html>`)
  const bounds = await page.locator('img').evaluate(async img => {
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    let left = canvas.width, top = canvas.height, right = 0, bottom = 0
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 12) {
        left = Math.min(left, x); right = Math.max(right, x)
        top = Math.min(top, y); bottom = Math.max(bottom, y)
      }
    }
    return { left, top, width: right - left + 1, height: bottom - top + 1 }
  })
  const padding = 28
  await page.setViewportSize({ width: bounds.width + padding * 2, height: bounds.height + padding * 2 })
  await page.locator('img').evaluate((img, { left, top, padding }) => {
    img.style.position = 'absolute'
    img.style.left = `${padding - left}px`
    img.style.top = `${padding - top}px`
  }, { ...bounds, padding })
  await page.screenshot({ path: 'public/images/designs/restaurant-logo-thumbnail.png' })
  console.log('Saved a close-up screenshot of the original Todokeru Restaurant logo.')
} finally {
  await browser.close()
}
