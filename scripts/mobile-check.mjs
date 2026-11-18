/**
 * 移动端巡检：在多个窄屏宽度下检查横向溢出，并逐分区截图。
 * 用法：node scripts/mobile-check.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] || 'http://127.0.0.1:5173'
const outDir = new URL('../.shots/mobile/', import.meta.url).pathname
await mkdir(outDir, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  headless: 'new',
})

const WIDTHS = [320, 390, 430]

for (const width of WIDTHS) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: 844, deviceScaleFactor: 1 })
  await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 60000 })
  await sleep(1800)

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    const wide = []
    if (doc.scrollWidth > doc.clientWidth) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.right > doc.clientWidth + 1 || r.left < -1) {
          const style = getComputedStyle(el)
          if (style.position === 'fixed' || style.visibility === 'hidden') continue
          wide.push({
            tag: el.tagName.toLowerCase(),
            cls: String(el.className).slice(0, 60),
            left: Math.round(r.left),
            right: Math.round(r.right),
          })
        }
      }
    }
    return {
      docScrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowing: doc.scrollWidth > doc.clientWidth,
      offenders: wide.slice(0, 12),
    }
  })
  console.log(`\n[${width}px] 横向溢出: ${overflow.overflowing} (${overflow.docScrollWidth} > ${overflow.clientWidth})`)
  if (overflow.offenders.length) console.log('  溢出元素:', JSON.stringify(overflow.offenders, null, 1))

  await page.screenshot({ path: `${outDir}${width}-hero.png` })

  const sections = await page.$$eval('main > section', (nodes) =>
    nodes.map((n, i) => ({
      i,
      name: String(n.className).split(/\s+/).find((c) => c !== 'at-section') || `s${i}`,
      top: n.offsetTop,
      height: n.offsetHeight,
    })),
  )
  for (const s of sections) {
    await page.evaluate((top) => window.scrollTo(0, top - 20), s.top)
    await sleep(900)
    await page.screenshot({ path: `${outDir}${width}-${s.name}.png` })
  }

  // 抽屉菜单
  if (width === 390) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await sleep(400)
    const btn = await page.$('.at-nav__menu')
    if (btn) {
      await btn.click()
      await sleep(700)
      await page.screenshot({ path: `${outDir}drawer.png` })
    }
    // 文档页
    await page.goto(base + '/libs/mcp', { waitUntil: 'networkidle0', timeout: 60000 })
    await sleep(1200)
    await page.screenshot({ path: `${outDir}doc-page.png` })
    const docOverflow = await page.evaluate(() => ({
      w: document.documentElement.scrollWidth,
      c: document.documentElement.clientWidth,
    }))
    console.log(`[文档页] 横向: ${docOverflow.w} > ${docOverflow.c} → ${docOverflow.w > docOverflow.c}`)
  }

  await page.close()
}

await browser.close()
console.log('\ndone →', outDir)
