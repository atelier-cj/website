<script setup lang="ts">
/**
 * 星场背景：极坐标 warp 星流 + 鼠标视差。
 * 纯 Canvas 2D，无第三方依赖；SSR 阶段不触碰 window，只在 onMounted 启动。
 */
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let dpr = 1

interface Star {
  angle: number
  radius: number
  speed: number
  size: number
  hue: number
  alpha: number
}

let stars: Star[] = []
const pointer = { x: 0.5, y: 0.5 }

const STAR_COUNT = 260

function spawn(star: Star, initial: boolean) {
  star.angle = Math.random() * Math.PI * 2
  star.radius = initial ? Math.random() * Math.max(width, height) * 0.7 + 4 : Math.random() * 18 + 4
  star.speed = 0.16 + Math.random() * 0.62
  star.size = Math.random() * 1.5 + 0.5
  star.hue = Math.random()
  star.alpha = 0.45 + Math.random() * 0.55
}

function resize() {
  const el = canvas.value
  if (!el) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = el.clientWidth
  height = el.clientHeight
  el.width = Math.floor(width * dpr)
  el.height = Math.floor(height * dpr)
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  const cx = width * (0.5 + (pointer.x - 0.5) * 0.12)
  const cy = height * (0.5 + (pointer.y - 0.5) * 0.12)
  const maxR = Math.hypot(width, height) * 0.62

  for (const star of stars) {
    const prevRadius = star.radius
    star.radius += star.speed * (0.55 + star.radius / 130)
    if (star.radius > maxR) {
      spawn(star, false)
      continue
    }

    const cos = Math.cos(star.angle)
    const sin = Math.sin(star.angle)
    const x1 = cx + cos * prevRadius
    const y1 = cy + sin * prevRadius
    const x2 = cx + cos * star.radius
    const y2 = cy + sin * star.radius

    const depth = star.radius / maxR
    const fade = Math.min(1, depth * 2.4) * star.alpha

    // 少量星点染色，其余保持冷白，避免画面过花
    const color =
      star.hue < 0.1
        ? `rgba(255, 46, 136, ${fade * 0.8})`
        : star.hue < 0.34
          ? `rgba(139, 107, 255, ${fade * 0.85})`
          : `rgba(205, 245, 255, ${fade})`

    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(0.55, star.size * (0.4 + depth * 1.2))
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  raf = requestAnimationFrame(draw)
}

function onPointerMove(event: PointerEvent) {
  pointer.x = event.clientX / Math.max(window.innerWidth, 1)
  pointer.y = event.clientY / Math.max(window.innerHeight, 1)
}

let onResize: (() => void) | null = null

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  resize()

  stars = Array.from({ length: STAR_COUNT }, () => {
    const star = {} as Star
    spawn(star, true)
    return star
  })

  if (reduce) {
    draw()
    cancelAnimationFrame(raf)
    return
  }

  onResize = () => {
    resize()
  }
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  raf = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  if (onResize) window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true" />
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.95;
}
</style>
