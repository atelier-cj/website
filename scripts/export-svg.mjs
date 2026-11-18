import puppeteer from 'puppeteer-core'
import { writeFile } from 'node:fs/promises'

const [,, url, out] = process.argv
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox','--disable-gpu','--hide-scrollbars'], headless: 'new' })
const p = await b.newPage()
await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
await p.setViewport({ width: 1500, height: 1100, deviceScaleFactor: 1 })
await p.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))

const svg = await p.evaluate(() => {
  const el = document.querySelector('.diagram-container svg')
  if (!el) return null
  const clone = el.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return {
    html: clone.outerHTML,
    hasStyle: !!clone.querySelector('style'),
    styleCount: clone.querySelectorAll('style').length,
    w: clone.getAttribute('width'), h: clone.getAttribute('height'), vb: clone.getAttribute('viewBox'),
  }
})
await writeFile(out, svg.html.replace('width="1406"', '').replace('height="615"', ''))
console.log(JSON.stringify({ hasStyle: svg.hasStyle, styleCount: svg.styleCount, w: svg.w, h: svg.h, vb: svg.vb, bytes: svg.html.length }))
await b.close()
