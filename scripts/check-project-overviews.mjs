import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const baseURL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:5173'
const provenance = JSON.parse(await readFile(new URL('../public/images/customer-support/provenance.json', import.meta.url), 'utf8'))
const workflow = JSON.parse(await readFile(new URL('../public/images/workflows/customer-support-provenance.json', import.meta.url), 'utf8'))
assert.equal(workflow.sourceSha256, provenance.workflowSha256, 'Screenshots and diagrams must reference the same reviewed ClearFlow export')
assert.equal(workflow.automationNodes, 118)
assert.equal(workflow.totalNodes, 128)
for (const screenshot of provenance.screenshots) {
  const image = await readFile(new URL(`../public/images/customer-support/${screenshot.name}.png`, import.meta.url))
  assert.equal(createHash('sha256').update(image).digest('hex'), screenshot.sha256, 'Application screenshots must match the pinned fictional captures')
}

const projects = [
  { title: 'AI Customer Support & Lead CRM', cover: 'customer-support', tabs: ['Overview', 'Dashboard', 'Leads', 'Inbox', 'Reply review', 'Follow-ups', 'Settings', 'At a glance', 'Support drafts', 'Lead capture', 'Follow-up route', 'Dashboard sync', 'Confirmed sending', 'Full workflow'] },
  { title: 'Gemini Gmail Assistant', cover: 'gmail-assistant', tabs: ['Overview', 'Email assistant'] },
  { title: 'PH WFH Job Finder', cover: 'job-finder', tabs: ['Overview', 'Full workflow', 'Search schedule', 'Discover jobs', 'Write applications', 'Attach & save', 'Tracker datasheet'] },
  { title: 'Closeby', src: '/images/closeby/closeby-overview.png', tabs: ['Overview', 'Android map', 'Activity history', 'Spaces', 'Safety', 'Settings', 'Sign in'] },
  { title: 'Joblink Tracker', cover: 'joblink', tabs: ['Overview', 'Dashboard', 'Explore jobs', 'News & events', 'Applications', 'CSV export', 'Task board', 'Calendar', 'Links', 'Sheet', 'Settings', 'Desktop', 'Mobile'] },
  { title: '5S Plumbing', cover: 'plumbing', tabs: ['Overview', 'Home', 'About', 'Services', 'Contact', 'Testimonials', 'FAQ', 'Drain cleaning', 'Gas lines', 'Plumbing', 'Heating & cooling', 'Commercial', 'Remodeling'] },
  { title: 'FU Media', cover: 'fu-media', tabs: ['Overview', 'Demo video'] },
  { title: 'Restaurant App', cover: 'restaurant', tabs: ['Overview', 'Main menu', 'Sushi menu', 'Dish details'] },
  { title: 'Pet Shop Business Card', cover: 'pet-shop', tabs: ['Overview', 'Front side', 'Back side'] },
]
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    page.on('pageerror', error => errors.push(`${viewport.width}px: ${error.message}`))
    for (const route of ['/projects', '/showcase']) {
      await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
      await page.locator('h1').waitFor()
      assert.equal(await page.locator('.portfolio-card').count(), projects.length)
      await page.locator('.portfolio-card img').evaluateAll(async images => {
        images.forEach(img => { img.loading = 'eager' })
        await Promise.all(images.map(img => img.decode()))
      })
      const ratios = await page.locator('.portfolio-card__media').evaluateAll(elements => elements.map(el => {
        const { width, height } = el.getBoundingClientRect()
        return width / height
      }))
      assert(ratios.every(ratio => Math.abs(ratio - 1.6) < 0.01), 'All project cards must use the same 8:5 presentation ratio')
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'The page must fit the viewport')
      for (const project of projects) {
        const src = project.src ?? `/images/overviews/${project.cover}.png`
        const card = page.getByRole('button', { name: new RegExp(`^Preview ${project.title}`) })
        assert.equal(await card.count(), 1)
        assert.equal(await card.locator('img').getAttribute('src'), src, `${project.title} card must use its overview`)
        await card.click()
        const dialog = page.locator('dialog.project-preview')
        const tabs = dialog.locator('.project-preview__tabs button')
        assert.deepEqual(await tabs.allTextContents(), project.tabs, `${project.title} must retain its original views after Overview`)
        assert.equal(await tabs.first().getAttribute('aria-pressed'), 'true')
        const image = dialog.locator('.project-preview__image img')
        assert.equal(await image.getAttribute('src'), src, `${project.title} must open on Overview`)
        await image.evaluate(img => img.decode())
        if (project.cover) {
          assert.deepEqual(await image.evaluate(img => [img.naturalWidth, img.naturalHeight]), [1600, 1000])
        }
        const layout = await dialog.locator('.project-preview__stage').evaluate(stage => {
          const box = stage.getBoundingClientRect()
          const image = stage.querySelector('img').getBoundingClientRect()
          return {
            horizontalOverflow: stage.scrollWidth > stage.clientWidth + 1,
            imageFits: image.left >= box.left - 1 && image.right <= box.right + 1 && image.top >= box.top - 1 && image.bottom <= box.bottom + 1,
          }
        })
        assert(!layout.horizontalOverflow && layout.imageFits, `${project.title} overview must fit the gallery stage at ${viewport.width}px`)
        assert(await dialog.evaluate(el => {
          const box = el.getBoundingClientRect()
          return box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight
        }), 'The preview dialog must fit the viewport')
        if (project.cover === 'customer-support') {
          assert.equal(await dialog.getByRole('link', { name: 'Visit live dashboard' }).getAttribute('href'), 'https://ai-customer-lead-crm-system-1hmk.vercel.app/leads')
          assert.equal(await dialog.getByRole('link', { name: 'GitHub source' }).getAttribute('href'), 'https://github.com/adam-Dev2002/AI-Customer-Lead-CRM-System')
          for (const tab of project.tabs.slice(1)) {
            await dialog.getByRole('button', { name: tab, exact: true }).click()
            await image.evaluate(img => img.decode())
            if (['Dashboard', 'Leads', 'Inbox', 'Reply review', 'Follow-ups', 'Settings'].includes(tab)) {
              assert.deepEqual(await image.evaluate(img => [img.naturalWidth, img.naturalHeight]), [1440, 1000])
              assert(await dialog.locator('.project-preview__stage').evaluate(stage => stage.scrollWidth <= stage.clientWidth + 1), 'Dashboard screenshots must fit the preview width')
            }
          }
          await dialog.getByRole('button', { name: 'Leads', exact: true }).click()
          await image.click()
          const lightbox = page.locator('.image-lightbox')
          await lightbox.waitFor({ state: 'visible' })
          await lightbox.locator('img').evaluate(img => img.decode())
          assert.equal(await lightbox.locator('img').getAttribute('src'), '/images/customer-support/leads.png')
          await page.keyboard.press('Escape')
          await lightbox.waitFor({ state: 'hidden' })
          assert.equal(await dialog.getByRole('button', { name: 'Leads', exact: true }).getAttribute('aria-pressed'), 'true')
        }
        if (project.cover === 'fu-media') {
          assert.equal(await dialog.locator('iframe').count(), 0, 'Opening the overview must not load the video')
          await dialog.getByRole('button', { name: 'Demo video', exact: true }).click()
          assert.equal(await dialog.locator('iframe').getAttribute('src'), 'https://www.youtube-nocookie.com/embed/Q8s3rW9jc6Q')
          assert.equal(await dialog.getByRole('button', { name: 'Open fullscreen', exact: true }).count(), 0, 'Image fullscreen controls must be hidden for video')
          await dialog.getByRole('button', { name: 'Overview', exact: true }).click()
          await image.evaluate(img => img.decode())
          assert.equal(await image.getAttribute('src'), src)
          assert.equal(await dialog.locator('iframe').count(), 0, 'Returning to Overview must remove the video')
        }
        await dialog.getByRole('button', { name: 'Close preview', exact: true }).click()
      }
      console.log(`${viewport.width}px ${route}: all nine overview cards, preview defaults, original tabs, image decoding, stage fit, and video round-trip passed`)
    }
    await page.close()
  }
  assert.deepEqual(errors, [], 'No browser runtime errors')
} finally {
  await browser.close()
}
