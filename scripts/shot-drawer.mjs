import puppeteer from 'puppeteer-core'
const base = process.env.SITE_URL || 'http://127.0.0.1:5173'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox','--disable-gpu','--hide-scrollbars'], headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await p.goto(base + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))
await p.click('.at-nav__menu')
await new Promise(r => setTimeout(r, 600))
await p.evaluate(() => { const el = document.querySelector('.at-drawer'); el.scrollTop = el.scrollHeight })
await new Promise(r => setTimeout(r, 400))
await p.screenshot({ path: '.shots/drawer-cta.png' })
await b.close()
console.log('ok')
