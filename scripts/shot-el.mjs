import puppeteer from 'puppeteer-core'
const [, , path = '/', sel = '.at-product--yggdrasil', out = '.shots/el.png', w = '1440', h = '900'] = process.argv
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox','--disable-gpu','--hide-scrollbars'], headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 })
await p.goto('' + (process.env.SITE_URL || 'http://127.0.0.1:5173') + '' + path, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))
await p.evaluate((s) => { const el = document.querySelector(s); el?.scrollIntoView({ block: 'center' }); }, sel)
await new Promise(r => setTimeout(r, 1500))
await p.screenshot({ path: out })
await b.close()
console.log('ok', out)
