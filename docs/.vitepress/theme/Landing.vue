<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Starfield from './components/Starfield.vue'
import TerminalDemo from './components/TerminalDemo.vue'
import EcosystemMap from './components/EcosystemMap.vue'
import LibraryGrid from './components/LibraryGrid.vue'
import ProductShowcase from './components/ProductShowcase.vue'
import SiteFooter from './components/SiteFooter.vue'

const stuck = ref(false)
const menuOpen = ref(false)
let io: IntersectionObserver | null = null

function onScroll() {
  stuck.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  if (typeof IntersectionObserver === 'undefined') {
    document.querySelectorAll('.at-reveal').forEach((el) => el.classList.add('is-in'))
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        io?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  )
  document.querySelectorAll('.at-reveal').forEach((el) => io?.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  io?.disconnect()
})
</script>

<template>
  <div class="at-landing">
    <Starfield class="at-bg-layer" />
    <div class="at-bg-layer at-bg-layer--vignette" aria-hidden="true" />
    <div class="at-scanlines" aria-hidden="true" />

    <header class="at-nav" :class="{ 'is-stuck': stuck }">
      <a class="at-nav__brand" href="/">
        <img src="/logo.svg" alt="Atelier" />
        <span>ATELIER<em>_</em></span>
      </a>
      <nav class="at-nav__links">
        <div class="at-nav__item">
          <a href="/libs/atelier">生态<i class="at-nav__caret" /></a>
          <div class="at-nav__drop">
            <a href="/ecosystem/">生态全景</a>
            <span class="at-nav__drop-sep" />
            <a href="/products/lumine">荧的炼金工房</a>
            <a href="/products/yggdrasil">世界树</a>
            <a href="/products/starline">星痕的炼金工房</a>
          </div>
        </div>

        <a href="/guide/">文档</a>

        <div class="at-nav__item">
          <a href="/libs/">库<i class="at-nav__caret" /></a>
          <div class="at-nav__drop">
            <a href="/libs/mcp">MCP · 模型上下文</a>
            <a href="/libs/a2a">A2A · Agent 互联</a>
            <a href="/libs/acp">ACP · 编辑器接入</a>
            <a href="/libs/uhp">UHP · 常驻 Harness</a>
            <span class="at-nav__drop-sep" />
            <a href="/libs/">库索引</a>
          </div>
        </div>

        <a href="/products/">产品</a>
        <a class="at-nav__cta" href="https://github.com/atelier-cj" target="_blank" rel="noreferrer">
          GITHUB ↗
        </a>
      </nav>
      <button
        class="at-nav__menu"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="打开菜单"
        @click="menuOpen = !menuOpen"
      >
        <span :class="{ 'is-x': menuOpen }" /><span :class="{ 'is-x': menuOpen }" /><span
          :class="{ 'is-x': menuOpen }"
        />
      </button>
    </header>

    <Transition name="at-drawer">
      <div v-if="menuOpen" class="at-drawer" @click="menuOpen = false">
        <p class="at-drawer__group">生态</p>
        <a href="/libs/atelier">Atelier · Agent Harness</a>
        <a href="/ecosystem/">生态全景</a>
        <a href="/products/lumine">荧的炼金工房</a>
        <a href="/products/yggdrasil">世界树</a>
        <a href="/products/starline">星痕的炼金工房</a>

        <p class="at-drawer__group">库</p>
        <a href="/libs/">库索引</a>
        <a href="/libs/mcp">MCP · 模型上下文</a>
        <a href="/libs/a2a">A2A · Agent 互联</a>
        <a href="/libs/acp">ACP · 编辑器接入</a>
        <a href="/libs/uhp">UHP · 常驻 Harness</a>

        <p class="at-drawer__group">其它</p>
        <a href="/guide/">文档</a>
        <a href="/products/">产品</a>
        <a href="/about">关于</a>
        <a class="at-drawer__cta" href="https://github.com/atelier-cj" target="_blank" rel="noreferrer">
          GITHUB ↗
        </a>
      </div>
    </Transition>

    <main>
      <!-- ── HERO ─────────────────────────────────────── -->
      <section class="at-hero">
        <div class="at-hero__floor" aria-hidden="true" />
        <div class="at-hero__aura" aria-hidden="true" />

        <div class="at-hero__inner">
          <p class="at-hero__eyebrow">
            <span class="at-hero__dot" />
            CANGJIE · AGENT ECOSYSTEM
          </p>

          <h1 class="at-hero__title">
            <span class="at-hero__title-glow" aria-hidden="true">ATELIER</span>
            <span class="at-hero__title-main">ATELIER</span>
          </h1>

          <p class="at-hero__sub">仓颉语言上的 Agent 工坊</p>

          <p class="at-hero__lead">
            从 JSON-RPC 传输到 MCP / A2A / ACP / UHP 协议，从 Agent Harness 到常驻桌面 ——
            一整套纯仓颉实现的生态，让「把模型变成 Agent」只需要装配，不必从零编写。
          </p>

          <div class="at-hero__actions">
            <a class="at-btn at-btn--primary" href="/guide/">进入文档 <span aria-hidden="true">→</span></a>
            <a
              class="at-btn at-btn--ghost"
              href="https://github.com/atelier-cj"
              target="_blank"
              rel="noreferrer"
            >
              查看源码
            </a>
          </div>

          <dl class="at-hero__stats">
            <div>
              <dt>9<em>+</em></dt>
              <dd>开源库</dd>
            </div>
            <div>
              <dt>5</dt>
              <dd>协议实现</dd>
            </div>
            <div>
              <dt>3</dt>
              <dd>闭源产品</dd>
            </div>
          </dl>
        </div>

        <a class="at-hero__scroll" href="#terminal" aria-label="继续向下">
          <span>SCROLL</span>
          <i />
        </a>
      </section>

      <!-- ── 终端演示 ─────────────────────────────────── -->
      <TerminalDemo id="terminal" />

      <!-- ── 生态图谱 ─────────────────────────────────── -->
      <EcosystemMap />

      <!-- ── 库 ──────────────────────────────────────── -->
      <LibraryGrid />

      <!-- ── 产品 ─────────────────────────────────────── -->
      <ProductShowcase />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.at-hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 120px clamp(20px, 5vw, 48px) 96px;
  overflow: clip;
  perspective: 520px;
  perspective-origin: 50% -10%;
}

.at-hero__floor {
  position: absolute;
  left: -25%;
  right: -25%;
  bottom: -6%;
  height: 46%;
  transform-origin: 50% 100%;
  transform: rotateX(72deg);
  background-image:
    repeating-linear-gradient(
      to right,
      rgba(34, 230, 255, 0.5) 0 1px,
      transparent 1px 84px
    ),
    repeating-linear-gradient(
      to bottom,
      rgba(34, 230, 255, 0.5) 0 1px,
      transparent 1px 84px
    );
  mask-image: linear-gradient(to top, #000 12%, rgba(0, 0, 0, 0.4) 58%, transparent 92%);
  -webkit-mask-image: linear-gradient(to top, #000 12%, rgba(0, 0, 0, 0.4) 58%, transparent 92%);
  animation: at-floor-scroll 5.5s linear infinite;
  pointer-events: none;
  opacity: 0.62;
}

.at-hero__floor::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 230, 255, 0.9), transparent);
  box-shadow: 0 0 34px 4px rgba(34, 230, 255, 0.45);
}

@keyframes at-floor-scroll {
  to {
    background-position: 0 84px, 0 84px;
  }
}

.at-hero__aura {
  position: absolute;
  left: 50%;
  top: 42%;
  width: min(1100px, 130vw);
  aspect-ratio: 1.6;
  transform: translate(-50%, -50%);
  background: radial-gradient(closest-side, rgba(34, 230, 255, 0.16), transparent 72%);
  filter: blur(30px);
  pointer-events: none;
}

.at-hero__inner {
  position: relative;
  z-index: 2;
  max-width: 960px;
  text-align: center;
}

.at-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 28px;
  padding: 7px 16px;
  border: 1px solid var(--at-line);
  border-radius: 999px;
  background: rgba(6, 10, 18, 0.6);
  font-family: var(--at-mono);
  font-size: 11.5px;
  letter-spacing: 0.28em;
  color: var(--at-cyan);
  animation: at-fade-up 0.9s 0.05s both;
}

.at-hero__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--at-cyan);
  box-shadow: 0 0 10px var(--at-cyan);
  animation: at-pulse 2.2s ease-in-out infinite;
}

@keyframes at-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.72); }
}

.at-hero__title {
  position: relative;
  margin: 0;
  line-height: 0.92;
  font-weight: 800;
  font-size: clamp(44px, 10.4vw, 136px);
  letter-spacing: 0.12em;
  text-indent: 0.12em;
  animation: at-fade-up 1s 0.12s both;
}

.at-hero__title-main {
  position: relative;
  display: block;
  background: linear-gradient(172deg, #ffffff 8%, #cfe6ff 38%, #59ddff 62%, #8b6bff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 70px rgba(34, 230, 255, 0.25);
}

.at-hero__title-glow {
  position: absolute;
  inset: 0;
  display: block;
  color: rgba(34, 230, 255, 0.32);
  filter: blur(26px);
  z-index: -1;
  pointer-events: none;
}

.at-hero__sub {
  margin: 20px 0 0;
  font-size: clamp(17px, 2.6vw, 26px);
  font-weight: 600;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: #dce9ff;
  animation: at-fade-up 1s 0.2s both;
}

.at-hero__lead {
  margin: 26px auto 0;
  max-width: 620px;
  font-size: 15px;
  line-height: 1.95;
  color: var(--at-dim);
  animation: at-fade-up 1s 0.28s both;
}

.at-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  margin-top: 38px;
  animation: at-fade-up 1s 0.36s both;
}

.at-hero__stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(24px, 6vw, 64px);
  margin: 58px 0 0;
  animation: at-fade-up 1s 0.46s both;
}

.at-hero__stats > div {
  text-align: center;
}

.at-hero__stats dt {
  font-family: var(--at-mono);
  font-size: clamp(26px, 3.4vw, 38px);
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
}

.at-hero__stats dt em {
  font-style: normal;
  color: var(--at-cyan);
}

.at-hero__stats dd {
  margin: 6px 0 0;
  font-size: 12px;
  letter-spacing: 0.22em;
  color: var(--at-dimmer);
}

.at-hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: var(--at-mono);
  font-size: 10px;
  letter-spacing: 0.34em;
  color: var(--at-dimmer);
  text-decoration: none;
  z-index: 2;
}

.at-hero__scroll i {
  width: 1px;
  height: 42px;
  background: linear-gradient(to bottom, var(--at-cyan), transparent);
  animation: at-drop 2s ease-in-out infinite;
}

@keyframes at-drop {
  0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
  50% { transform: scaleY(1); opacity: 1; }
}

@keyframes at-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* 移动端菜单 */
.at-nav__menu {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  padding: 0 8px;
  border: 1px solid var(--at-line);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
}

.at-nav__menu span {
  display: block;
  height: 1.5px;
  width: 100%;
  background: var(--at-text);
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.at-nav__menu span.is-x:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.at-nav__menu span.is-x:nth-child(2) { opacity: 0; }
.at-nav__menu span.is-x:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

.at-drawer {
  position: fixed;
  inset: 64px 0 auto;
  z-index: 55;
  display: flex;
  flex-direction: column;
  padding: 18px clamp(20px, 6vw, 40px) 28px;
  background: rgba(5, 7, 13, 0.97);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--at-line);
}

.at-drawer a {
  padding: 15px 2px;
  border-bottom: 1px solid rgba(120, 215, 255, 0.08);
  font-size: 16px;
  color: var(--at-text);
  text-decoration: none;
}

.at-drawer a:last-child {
  border-bottom: none;
}

.at-drawer__cta {
  margin-top: 12px;
  padding: 13px 2px !important;
  text-align: center;
  border: 1px solid var(--at-line-strong) !important;
  border-radius: 10px;
  color: var(--at-cyan) !important;
  font-family: var(--at-mono);
  font-size: 13px !important;
  letter-spacing: 0.1em;
}

.at-drawer-enter-active,
.at-drawer-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.at-drawer-enter-from,
.at-drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 720px) {
  .at-nav__menu {
    display: flex;
  }
  .at-hero {
    padding-top: 104px;
  }
  .at-hero__title {
    letter-spacing: 0.08em;
    text-indent: 0.08em;
  }
  .at-hero__sub {
    letter-spacing: 0.16em;
    text-indent: 0.16em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .at-hero__eyebrow,
  .at-hero__title,
  .at-hero__sub,
  .at-hero__lead,
  .at-hero__actions,
  .at-hero__stats {
    animation: none;
  }
  .at-hero__floor,
  .at-hero__dot,
  .at-hero__scroll i {
    animation: none;
  }
}
</style>
