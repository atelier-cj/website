import puppeteer from 'puppeteer-core'
const base = process.env.SITE_URL || 'http://127.0.0.1:5173'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox','--disable-gpu','--hide-scrollbars'], headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 300, deviceScaleFactor: 2 })
await p.goto(base + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))
await p.screenshot({ path: '.shots/nav-github.png', clip: { x: 900, y: 0, width: 540, height: 70 } })
// hover 状态
const cta = await p.$('.at-nav__cta')
if (cta) { await cta.hover(); await new Promise(r => setTimeout(r, 500)); await p.screenshot({ path: '.shots/nav-github-hover.png', clip: { x: 900, y: 0, width: 540, height: 70 } }) }
await b.close()
console.log('ok')
