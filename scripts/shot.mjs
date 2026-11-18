/**
 * 首页视觉巡检脚本：用系统 Chrome 把各分区截成图，便于逐段比对。
 * 用法：node scripts/shot.mjs [url]
 */
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || 'http://127.0.0.1:5273/'
const outDir = new URL('../.shots/', import.meta.url).pathname
const CHROME = '/usr/bin/google-chrome-stable'

await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
  headless: 'new',
})

async function capture(width, height, tag) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  // 等入场动画落定
  await new Promise((r) => setTimeout(r, 2200))

  await page.screenshot({ path: `${outDir}${tag}-hero.png` })

  const sections = await page.$$eval('main > section', (nodes) =>
    nodes.map((node, i) => ({
      i,
      name: String(node.className).split(/\s+/).find((c) => c !== 'at-section') || `s${i}`,
      top: node.offsetTop,
    })),
  )
  for (const section of sections) {
    await page.evaluate((top) => window.scrollTo(0, top - 40), section.top)
    await new Promise((r) => setTimeout(r, 1400))
    await page.screenshot({ path: `${outDir}${tag}-${section.name}.png` })
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: `${outDir}${tag}-footer.png` })
  await page.close()
}

await capture(1440, 900, 'desk')
await capture(390, 844, 'mob')

await browser.close()
console.log('shots written to', outDir)
