<script setup lang="ts">
/**
 * 终端演示：用打字机把一次真实的 harness 回合「播」出来。
 * 初始为空、挂载后由 IntersectionObserver 触发，避免首屏之前就跑完。
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Segment {
  cls: 'cmd' | 'meta' | 'agent' | 'tool' | 'ok'
  text: string
}

const segments: Segment[] = [
  { cls: 'cmd', text: '$ atelier run "把这个仓的 MCP 工具接进来，再跑一次自检"\n' },
  { cls: 'meta', text: '⟳ harness 装配  tools=4  provider=openai\n' },
  { cls: 'agent', text: '◈ agent  先看一下工程结构\n' },
  { cls: 'tool', text: '  ├─ fs.list    src/  cli/  server/  cjpm.toml\n' },
  { cls: 'agent', text: '◈ agent  接入 MCP 服务器需要改装配束，我来改配置\n' },
  { cls: 'tool', text: '  ├─ fs.read    cjpm.toml\n' },
  { cls: 'tool', text: '  ├─ fs.edit    cjpm.toml   +[mcp.servers.filesystem]\n' },
  { cls: 'tool', text: '  └─ mcp.reload → 新增 11 个工具\n' },
  { cls: 'agent', text: '◈ agent  工具已挂载，跑自检\n' },
  { cls: 'tool', text: '  └─ shell      cjpm test -j 4  →  PASSED 128  SKIPPED 0\n' },
  { cls: 'ok', text: '✔ done  3.8s · 2 轮 · 15 个工具调用\n' },
]

const fullLength = segments.reduce((sum, s) => sum + s.text.length, 0)
const visible = ref(0)
const started = ref(false)
const done = computed(() => visible.value >= fullLength)

const rendered = computed(() => {
  let budget = visible.value
  return segments
    .map((segment) => {
      const take = Math.max(0, Math.min(segment.text.length, budget))
      budget -= take
      return { cls: segment.cls, text: segment.text.slice(0, take) }
    })
    .filter((segment) => segment.text.length > 0)
})

const root = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | null = null
let observer: IntersectionObserver | null = null

function start() {
  if (started.value) return
  started.value = true
  timer = setInterval(() => {
    // 越靠后越快，模拟流式输出收尾时的加速感
    const step = visible.value > fullLength * 0.72 ? 5 : 3
    visible.value = Math.min(fullLength, visible.value + step)
    if (visible.value >= fullLength && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 22)
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    visible.value = fullLength
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        start()
        observer?.disconnect()
      }
    },
    { threshold: 0.25 },
  )
  if (root.value) observer.observe(root.value)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <section ref="root" class="at-section at-term">
    <div class="at-reveal">
      <p class="at-section__eyebrow">RUNTIME</p>
      <h2 class="at-section__title">一个回合，从指令到自检</h2>
      <p class="at-section__desc">
        Atelier 把推理循环、工具调度、审批与上下文压缩都收进 harness。
        这是它跑完一个真实任务时的样子 —— 你只需要描述目标。
      </p>
    </div>

    <div class="at-term__window at-reveal">
      <div class="at-term__bar">
        <span class="at-term__dots" aria-hidden="true"><i /><i /><i /></span>
        <span class="at-term__name">atelier — zsh — 132×36</span>
        <span class="at-term__badge">live</span>
      </div>
      <pre class="at-term__body" aria-live="polite"><code><span
        v-for="(segment, index) in rendered"
        :key="index"
        :class="'seg-' + segment.cls"
      >{{ segment.text }}</span><span v-if="!done" class="at-term__caret" /></code></pre>
    </div>
  </section>
</template>

<style scoped>
.at-term__window {
  position: relative;
  border: 1px solid var(--at-line);
  border-radius: var(--at-radius);
  background:
    linear-gradient(180deg, rgba(10, 15, 26, 0.96), rgba(6, 9, 16, 0.98));
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 40px 90px -50px rgba(34, 230, 255, 0.5),
    0 30px 60px -40px rgba(0, 0, 0, 0.9);
  overflow: hidden;
}

.at-term__window::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(700px 240px at 50% 0%, rgba(34, 230, 255, 0.1), transparent 70%);
}

.at-term__bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--at-line);
  background: rgba(255, 255, 255, 0.02);
}

.at-term__dots {
  display: inline-flex;
  gap: 6px;
}

.at-term__dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #2b3446;
}
.at-term__dots i:nth-child(1) { background: #ff5f57; }
.at-term__dots i:nth-child(2) { background: #febc2e; }
.at-term__dots i:nth-child(3) { background: #28c840; }

.at-term__name {
  font-family: var(--at-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--at-dimmer);
}

.at-term__badge {
  margin-left: auto;
  padding: 2px 9px;
  border: 1px solid rgba(40, 200, 64, 0.4);
  border-radius: 999px;
  font-family: var(--at-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  color: #4ade80;
  background: rgba(40, 200, 64, 0.08);
}

.at-term__body {
  margin: 0;
  padding: 22px 20px 26px;
  min-height: 300px;
  font-family: var(--at-mono);
  font-size: 12.8px;
  line-height: 1.95;
  color: #c7d6ea;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}

.seg-cmd { color: #7dd3fc; }
.seg-meta { color: var(--at-violet); }
.seg-agent { color: #e8eef8; }
.seg-tool { color: #9fb3cc; }
.seg-ok { color: #4ade80; }

.at-term__caret {
  display: inline-block;
  width: 8px;
  height: 15px;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--at-cyan);
  box-shadow: 0 0 10px var(--at-cyan);
  animation: at-caret 1s steps(2) infinite;
}

@keyframes at-caret {
  50% { opacity: 0; }
}

@media (max-width: 640px) {
  .at-term__body {
    font-size: 11.2px;
    padding: 16px 14px 20px;
  }
}
</style>
