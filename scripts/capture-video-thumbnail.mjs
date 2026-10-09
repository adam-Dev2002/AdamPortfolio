import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage()
  for (const name of ['maxresdefault', 'sddefault', 'hqdefault']) {
    const response = await page.request.get(`https://img.youtube.com/vi/Q8s3rW9jc6Q/${name}.jpg`)
    if (!response.ok()) continue
    await writeFile('public/images/fu-media.jpg', await response.body())
    console.log(`Saved video thumbnail: ${name}`)
    break
  }
} finally {
  await browser.close()
}
