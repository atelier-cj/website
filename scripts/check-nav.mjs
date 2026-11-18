/**
 * 导航交互巡检：hover 截图 + 点击后校验落点。
 * 用法：node scripts/check-nav.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://127.0.0.1:5273'
const out = new URL('../.shots/', import.meta.url).pathname
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  headless: 'new',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

// ---- 首页导航 ----
await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await sleep(1800)

const items = await page.$$('.at-nav__item')
if (items[0]) {
  await items[0].hover()
  await sleep(500)
  await page.screenshot({ path: out + 'nav-home-eco.png', clip: { x: 700, y: 0, width: 740, height: 300 } })
}
if (items[1]) {
  await items[1].hover()
  await sleep(500)
  await page.screenshot({ path: out + 'nav-home-libs.png', clip: { x: 700, y: 0, width: 740, height: 300 } })
}

// 首页库九宫格
await page.evaluate(() => {
  const el = document.querySelector('.at-libs__grid')
  el?.scrollIntoView({ block: 'center' })
})
await sleep(1200)
await page.screenshot({ path: out + 'libs-grid.png' })

// 首页点击「生态」应直达 /libs/atelier
const ecoHref = await page.$eval('.at-nav__item > a', (a) => a.getAttribute('href'))
console.log('首页生态入口 href =', ecoHref)

// ---- 文档页导航 ----
await page.goto(base + '/guide/', { waitUntil: 'networkidle0', timeout: 60000 })
await sleep(1200)

const groupBtn = await page.$('.VPNavBarMenuGroup button.button')
if (groupBtn) {
  await groupBtn.hover()
  await sleep(600)
  await page.screenshot({ path: out + 'nav-doc-eco.png', clip: { x: 700, y: 0, width: 740, height: 320 } })
  await groupBtn.click()
  await sleep(1200)
  console.log('点击「生态」后 URL =', page.url())
}

await browser.close()
console.log('done')
