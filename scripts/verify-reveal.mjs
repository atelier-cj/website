// 回归：hover 触发重渲染后，入场状态不能被抹掉
import puppeteer from 'puppeteer-core'
const base = process.env.SITE_URL || 'http://127.0.0.1:5173'
const b = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox','--disable-gpu','--hide-scrollbars',
    '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4'],
  headless: 'new',
})
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto(base + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))

const read = (label) => p.evaluate((l) => {
  const stack = document.querySelector('.at-eco__stack')
  const layers = [...document.querySelectorAll('.at-eco__layer')].map(el => getComputedStyle(el).opacity)
  return {
    label: l,
    revealed: stack.dataset.revealed || null,
    stackOpacity: getComputedStyle(stack).opacity,
    layers,
  }
}, label)

await p.evaluate(() => document.querySelector('.at-eco').scrollIntoView({ block: 'center' }))
await new Promise(r => setTimeout(r, 1200))
console.log(JSON.stringify(await read('滚动进入')))

const layers = await p.$$('.at-eco__layer')
await layers[1].hover()
await new Promise(r => setTimeout(r, 600))
console.log(JSON.stringify(await read('hover 中间层')))
await p.screenshot({ path: '.shots/eco-hover-fixed.png' })

await p.mouse.move(30, 30)
await new Promise(r => setTimeout(r, 600))
console.log(JSON.stringify(await read('移出')))
await p.screenshot({ path: '.shots/eco-after-fixed.png' })
await b.close()
