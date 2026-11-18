/**
 * 把 archify 生成的交互图导出为暗色 2 倍 PNG（只取图本体，不含 viewer 外壳）。
 * 用法：node scripts/export-arch-png.mjs <html路径> <输出png> [scale]
 */
import puppeteer from 'puppeteer-core'

const [,, htmlPath, outPath, scale = '2'] = process.argv
const url = 'file://' + htmlPath

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  headless: 'new',
})
const page = await browser.newPage()
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
await page.setViewport({ width: 1500, height: 1100, deviceScaleFactor: Number(scale) })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2200))

// 隐藏 viewer 的覆盖层（工具栏、透镜、搜索、指引），它们叠在画布上会被一起截进来
await page.evaluate(() => {
  document.querySelectorAll('.no-print, [class*="toolbar"], [class*="legend"], [class*="guide"]').forEach((el) => {
    el.style.setProperty('display', 'none', 'important')
  })
})

// 让动效停在完整状态再截
await page.evaluate(() => {
  document.querySelectorAll('[data-animation]').forEach((el) => {
    el.style.setProperty('animation', 'none', 'important')
    el.querySelectorAll('*').forEach((child) => child.style.setProperty('animation', 'none', 'important'))
  })
})
await new Promise((r) => setTimeout(r, 600))

const svg = await page.$('.diagram-container svg')
if (!svg) throw new Error('svg not found')
await svg.screenshot({ path: outPath })
const box = await svg.boundingBox()
console.log(JSON.stringify({ path: outPath, css: { w: Math.round(box.width), h: Math.round(box.height) }, scale: Number(scale) }))
await browser.close()
