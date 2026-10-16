import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright'

// Run a local-only Closeby web build with EXPO_NO_DOTENV=1, then:
// node scripts/capture-closeby.mjs [http://127.0.0.1:8085]
// Real app pixels are captured below. The overview arranges those captures in CSS.
// Map/history are original, unedited repository captures because Google Maps web
// needs a configured browser key; provenance is saved alongside the PNGs.
const overviewOnly = process.argv.includes('--overview-only')
const origin = process.argv.slice(2).find(argument => !argument.startsWith('--')) || 'http://127.0.0.1:8085'
const target = new URL(origin)
if (!['localhost', '127.0.0.1', '[::1]'].includes(target.hostname)) {
  throw new Error('Capture a local Closeby preview to avoid real accounts and locations.')
}
const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const output = resolve(projectRoot, 'public/images/closeby')
const revision = '926b13689a0ba86a7a0d8d0a7e944f2eeb22bf2e'
const repository = 'https://github.com/adam-Dev2002/closeby'
const sourceImages = {
  'closeby-map.png': 'docs/screenshots/map-android.png',
  'closeby-history.png': 'docs/activity-history-web.png',
}
const sourceRecords = []
await mkdir(output, { recursive: true })
for (const [filename, path] of overviewOnly ? [] : Object.entries(sourceImages)) {
  const response = await fetch(`https://raw.githubusercontent.com/adam-Dev2002/closeby/${revision}/${path}`)
  if (!response.ok) throw new Error(`Could not retrieve original ${path}: ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  await writeFile(join(output, filename), bytes)
  sourceRecords.push({
    filename, kind: 'original-repository-capture', sourceCommit: revision,
    sourceUrl: `${repository}/blob/${revision}/${path}`,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  })
}

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true })
const captures = []
try {
  if (!overviewOnly) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    timezoneId: 'Asia/Manila', locale: 'en-US', colorScheme: 'dark',
    permissions: ['geolocation'],
    geolocation: { latitude: 14.55, longitude: 121.02, accuracy: 5 },
  })
  // Cloud authentication/database endpoints stay blocked throughout this run.
  await context.route('**/*', route => {
    const host = new URL(route.request().url()).hostname
    if (/firestore\.googleapis\.com$|identitytoolkit\.googleapis\.com$|securetoken\.googleapis\.com$|firebaseio\.com$|firebaseapp\.com$|cloudfunctions\.net$/.test(host)) {
      return route.abort()
    }
    return route.continue()
  })
  await context.addInitScript(() => {
    // Browser-only test fixes. These never read the computer's actual location.
    const fix = () => ({ timestamp: Date.now(), coords: {
      latitude: 14.55, longitude: 121.02, accuracy: 5,
      altitude: null, altitudeAccuracy: null, speed: 0, heading: null,
    } })
    const watches = new Map()
    let nextId = 0
    navigator.geolocation.getCurrentPosition = next => setTimeout(() => next(fix()), 10)
    navigator.geolocation.watchPosition = next => {
      const id = ++nextId
      setTimeout(() => next(fix()), 10)
      watches.set(id, setInterval(() => next(fix()), 3000))
      return id
    }
    navigator.geolocation.clearWatch = id => { clearInterval(watches.get(id)); watches.delete(id) }
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 120000 })
  const localMode = page.getByRole('button', { name: /Use this device.s GPS/ })
  if (await localMode.isVisible().catch(() => false)) await localMode.click()
  await page.getByRole('tab', { name: 'Spaces', exact: true }).waitFor({ timeout: 90000 })
  async function capture(tab, filename) {
    await page.getByRole('tab', { name: tab, exact: true }).click()
    await page.waitForTimeout(450)
    await page.screenshot({ path: join(output, filename), animations: 'disabled' })
    captures.push(filename)
  }
  await capture('Spaces', 'closeby-spaces.png')
  await page.getByRole('tab', { name: 'Safety', exact: true }).click()
  const enableGPS = page.getByRole('button', { name: 'Enable GPS for speed', exact: true })
  if (await enableGPS.isVisible()) await enableGPS.click()
  await page.getByLabel('0 kilometres per hour', { exact: true }).waitFor()
  await capture('Safety', 'closeby-safety.png')
  await capture('Settings', 'closeby-settings.png')
  await page.getByText('Profile', { exact: true }).click()
  await page.getByRole('button', { name: 'Continue with Google', exact: true }).waitFor()
  await page.waitForTimeout(300)
  await page.screenshot({ path: join(output, 'closeby-sign-in.png'), animations: 'disabled' })
  captures.push('closeby-sign-in.png')
  if (errors.length) throw new Error(`Closeby browser errors: ${errors.join('; ')}`)
  await context.close()
  }

  const dataURI = async name => `data:image/png;base64,${(await readFile(join(output, name))).toString('base64')}`
  const [map, history, safety] = await Promise.all(['closeby-map.png', 'closeby-history.png', 'closeby-safety.png'].map(dataURI))
  const overview = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
  await overview.setContent(`<!doctype html><html><head><style>
    *{box-sizing:border-box}body{margin:0;width:1600px;height:1000px;overflow:hidden;background:#060d14;color:#edf4ff;font-family:Arial,sans-serif}
    body:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,#15394b 0,transparent 60%),radial-gradient(ellipse at 10% 90%,#0b2b41 0,transparent 50%)}
    .copy{position:absolute;left:92px;top:270px;width:420px}.kicker{font-size:17px;color:#62b8ff;letter-spacing:4px;font-weight:bold}h1{font-size:93px;letter-spacing:-6px;margin:24px 0 25px;line-height:1}h2{font-size:31px;line-height:1.35;font-weight:500;margin:0 0 25px}p{font-size:20px;line-height:1.6;color:#91a9bf;margin:0}
    .tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:37px}.tags span{padding:11px 15px;border:1px solid #29435a;border-radius:30px;font-size:14px;color:#b5d1ec;background:#102030}
    .phone{position:absolute;top:89px;width:333px;height:735px;border-radius:36px;padding:8px;background:#142535;border:1px solid #476079;box-shadow:0 28px 65px #0009;overflow:hidden}.phone img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:29px;display:block}
    .map{left:563px;top:205px;width:350px;height:614px;transform:rotate(-6deg);z-index:2}.history{left:904px;top:74px;transform:rotate(3deg);z-index:3}.safety{left:1230px;top:170px;transform:rotate(8deg);z-index:1}
    .map img{object-fit:contain}.label{position:absolute;bottom:66px;left:92px;color:#647f98;font-size:13px;letter-spacing:1px}.dot{display:inline-block;width:9px;height:9px;border-radius:100%;background:#3dd9a0;margin-right:10px}
  </style></head><body><div class="copy"><div class="kicker">MOBILE APP / LOCATION SHARING</div><h1>closeby</h1><h2>Stay close to<br>what matters.</h2><p>GPS tracking, shared spaces<br>and location history.</p><div class="tags"><span>React Native</span><span>Expo</span><span>Firebase</span></div></div><div class="phone map"><img src="${map}"></div><div class="phone history"><img src="${history}"></div><div class="phone safety"><img src="${safety}"></div><div class="label"><span class="dot"></span>ACTUAL APP CAPTURES · LOCAL TEST DATA · SCREENSHOT COMPOSITION</div></body></html>`)
  await overview.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await overview.screenshot({ path: join(output, 'closeby-overview.png') })
  await overview.close()
  console.log(overviewOnly ? 'Refreshed closeby-overview.png; original captures preserved.' : `Saved ${captures.length} fresh app captures, 2 original repository captures, and overview to public/images/closeby.`)
} finally {
  await browser.close()
}

if (!overviewOnly) await writeFile(join(output, 'sources.json'), JSON.stringify({
  repository, sourceCommit: revision,
  browserCaptures: {
    sourceCommit: revision, source: 'Unmodified isolated checkout, local Expo web preview',
    files: captures, viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
    mode: 'Local device only; no account; Firebase endpoints blocked',
    gps: { synthetic: true, latitude: 14.55, longitude: 121.02, speed: 0, accuracy: 5 },
  },
  originalCaptures: sourceRecords,
  overview: { filename: 'closeby-overview.png', width: 1600, height: 1000,
    kind: 'CSS composition of real app screenshots',
    inputs: ['closeby-map.png', 'closeby-history.png', 'closeby-safety.png'],
  },
}, null, 2) + '\n')

if (!overviewOnly) await writeFile(join(output, 'SOURCES.md'), `# Closeby screenshot provenance\n\nProject: ${repository}\nSource revision: ${revision}\n\n- closeby-map.png: original repository capture, ${repository}/blob/${revision}/docs/screenshots/map-android.png. Android emulator screenshot, 720 x 1280. Generic My Phone profile and synthetic emulator GPS; no personal account. Original image bytes retained, including Google attribution.\n- closeby-history.png: original repository capture, ${repository}/blob/${revision}/docs/activity-history-web.png. Browser screenshot, 390 x 1000. Local test account Alice, synthetic routes and stops. Original image bytes retained, including map attribution.\n- closeby-spaces.png: fresh local browser capture of the private-space onboarding screen; no signed-in account or members.\n- closeby-safety.png: fresh local browser capture of Safety & speed, synthetic stationary GPS (0 km/h), no emergency alerts sent.\n- closeby-settings.png: fresh local browser capture of Settings, local mode with location sharing off.\n- closeby-sign-in.png: fresh local browser capture of sign-in UI, no account entered and Firebase setup pending.\n- closeby-overview.png: 1600 x 1000 CSS composition using the real map, history and safety screenshots above. Copy/layout around the phone screens is presentation, not app UI.\n\nFresh browser captures use 390 x 844 CSS pixels at device scale 2 (780 x 1688 output), Asia/Manila timezone. Browser GPS is fixed at 14.55, 121.02 for local testing. Firebase authentication/database endpoints are blocked. No production account, real device location, or cloud data writes are used. The current Google web renderer needs a browser API key, so map/history use the project's published captures rather than a fabricated or incomplete basemap.\n\nRegenerate: run a local-only Closeby web preview with EXPO_NO_DOTENV=1, then run node scripts/capture-closeby.mjs [http://127.0.0.1:8085]. The script retrieves the two original captures from the pinned source revision and generates the other screenshots using Playwright/Chrome.\n`)
