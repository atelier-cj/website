/**
 * 单页截图：node scripts/shot-page.mjs <path> <out.png> [width] [height]
 * 默认打本地 preview（4173）。
 */
import puppeteer from 'puppeteer-core'

const [, , path = '/', out = '.shots/page.png', w = '1440', h = '1200'] = process.argv
const base = process.env.SITE_URL || 'http://127.0.0.1:4173'

const args = ['--no-sandbox', '--disable-gpu', '--hide-scrollbars']
if (process.env.CHROME_PROXY) args.push(`--proxy-server=${process.env.CHROME_PROXY}`)

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  args,
  headless: 'new',
})

const page = await browser.newPage()
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 })
await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: out })
await browser.close()
console.log('ok', out)
