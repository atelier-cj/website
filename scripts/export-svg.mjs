/**
 * 导出自包含 SVG。
 *
 * archify 的图把所有颜色、线宽、字体都写在页面级 CSS 里（还带 [data-theme] 变体），
 * 直接抽 <svg> 出来会丢样式，只剩黑块和默认字体。
 * 这里在浏览器里按暗色模式取每个元素的 computed style，逐个写成内联属性，
 * 得到的 SVG 不依赖任何外部 CSS，用 <img> 引用时又不会污染宿主页面。
 */
import puppeteer from 'puppeteer-core'
import { writeFile } from 'node:fs/promises'

const [,, htmlPath, outPath] = process.argv
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  headless: 'new',
})
const page = await browser.newPage()
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
await page.setViewport({ width: 1500, height: 1100, deviceScaleFactor: 1 })
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1800))

const result = await page.evaluate(() => {
  const svg = document.querySelector('.diagram-container svg')
  if (!svg) return null

  // 只对「会画出来」的元素内联：容器上写 fill 会让整棵子树继承黑色
  const SHAPES = new Set(['rect', 'path', 'circle', 'ellipse', 'line', 'polygon', 'polyline'])
  const TEXTS = new Set(['text', 'tspan'])
  const SHAPE_PROPS = [
    'fill', 'fill-opacity', 'stroke', 'stroke-opacity', 'stroke-width',
    'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'paint-order',
  ]
  const TEXT_PROPS = [
    'fill', 'fill-opacity', 'font-family', 'font-size', 'font-weight', 'font-style',
    'letter-spacing', 'text-anchor', 'dominant-baseline', 'opacity',
  ]

  function inline(el) {
    if (!(el instanceof Element)) return
    const tag = el.tagName.toLowerCase()
    const props = SHAPES.has(tag) ? SHAPE_PROPS : TEXTS.has(tag) ? TEXT_PROPS : null
    if (props) {
      const cs = getComputedStyle(el)
      for (const p of props) {
        const v = cs.getPropertyValue(p)
        if (v) el.setAttribute(p, v)
      }
    }
    for (const child of el.children) inline(child)
  }

  // clone 未挂载，getComputedStyle 拿不到值：直接改原树再序列化
  inline(svg)

  const bg = '#0b1220'
  const vb = svg.getAttribute('viewBox').split(/\s+/)
  const w = Number(vb[2])
  const h = Number(vb[3])

  const out = svg.cloneNode(true)
  out.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  out.setAttribute('width', String(w))
  out.setAttribute('height', String(h))

  // 去掉页面级 <style>：样式已经全部内联
  out.querySelectorAll('style').forEach((s) => s.remove())

  // 装饰层：动效光带、波纹、背景点阵 pattern —— 固化成静态后会变成黑块/绿粗线
  const DECOR = '[class*="ambient"], [class*="wake"], [class*="glow"], [class*="halo"], ' +
    '[class*="tail"], [class*="ripple"], [class*="flow-head"], [class*="flow-tail"], ' +
    '[class*="hit-target"], [class*="hit-rail"], [class*="focus-rail"]'
  out.querySelectorAll(DECOR).forEach((el) => el.remove())
  out.querySelectorAll('[class*="mask"]').forEach((el) => el.remove())
  out.querySelectorAll('pattern').forEach((el) => el.remove())
  // 连线标签在深色底上偏暗，统一提亮
  out.querySelectorAll('[class*="edge-label"], [class*="t-edge"]').forEach((el) => {
    if (el.tagName.toLowerCase() === 'text' || el.tagName.toLowerCase() === 'tspan') {
      el.setAttribute('fill', '#8aa0bb')
    }
  })
  out.querySelectorAll('[fill^="url(#"], [stroke^="url(#"]').forEach((el) => el.remove())

  // 补一层底：原背景画在容器上，不在 SVG 里
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '0')
  rect.setAttribute('y', '0')
  rect.setAttribute('width', String(w))
  rect.setAttribute('height', String(h))
  rect.setAttribute('fill', bg)
  out.insertBefore(rect, out.firstChild)

  return { html: out.outerHTML, bg, w, h }
})

await writeFile(outPath, result.html)
console.log(JSON.stringify({ out: outPath, bg: result.bg, size: [result.w, result.h], bytes: result.html.length }))
await browser.close()
