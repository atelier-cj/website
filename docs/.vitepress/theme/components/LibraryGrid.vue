<script setup lang="ts">
/**
 * 库卡片网格。鼠标位置写入 --mx/--my，让高光跟随指针，
 * 是纯 CSS 实现，不触发重排。
 */
interface Lib {
  code: string
  name: string
  pkg: string
  desc: string
  tags: string[]
  href: string
  layer: 'framework' | 'protocol' | 'base'
}

const libs: Lib[] = [
  {
    code: 'HARNESS',
    name: 'Atelier',
    pkg: 'atelier',
    desc: '可嵌入的 Agent 脚手架：推理循环、工具系统、会话树、多协议接入，装一个装配束就能跑。',
    tags: ['Lib', 'HTTP', 'CLI'],
    href: '/libs/atelier',
    layer: 'framework',
  },
  {
    code: 'PLUGIN',
    name: 'Cordis',
    pkg: 'cordis',
    desc: '微内核 + 进程隔离的插件系统：插件以子进程运行，卸载即回收全部资源。',
    tags: ['stdio', 'UDS'],
    href: '/libs/cordis',
    layer: 'framework',
  },
  {
    code: 'RUNTIME',
    name: 'UHP Server',
    pkg: 'uhp-server',
    desc: '把多个 harness 收成一个 UHP 端点：一个 base URL，按 harness_id 派任务。',
    tags: ['SSE', '多 harness'],
    href: '/libs/uhp-server',
    layer: 'framework',
  },
  {
    code: 'MCP',
    name: 'mcp-cj',
    pkg: 'mcp',
    desc: 'Model Context Protocol 的服务端与客户端，覆盖 2025-11-25 版本。',
    tags: ['stdio', 'Streamable HTTP'],
    href: '/libs/mcp',
    layer: 'protocol',
  },
  {
    code: 'A2A',
    name: 'a2a-cj',
    pkg: 'a2a',
    desc: 'Agent2Agent v1.0：Agent Card 发现、任务生命周期、SSE 流式与推送。',
    tags: ['JSON-RPC', 'HTTP+JSON'],
    href: '/libs/a2a',
    layer: 'protocol',
  },
  {
    code: 'ACP',
    name: 'acp-cj',
    pkg: 'acp',
    desc: 'Agent Client Protocol v1：作为子进程被 Zed、opencode 这类宿主拉起。',
    tags: ['Agent', 'Client'],
    href: '/libs/acp',
    layer: 'protocol',
  },
  {
    code: 'UHP',
    name: 'uhp',
    pkg: 'uhp',
    desc: 'Unified Harness Protocol：官方一致性套件 core / extended / full 三档全过。',
    tags: ['CONFORMANT'],
    href: '/libs/uhp',
    layer: 'protocol',
  },
  {
    code: 'BASE',
    name: 'JSON-RPC',
    pkg: 'ystyle::jsonrpc',
    desc: '通用 JSON-RPC 2.0 框架，五种传输：stdio、TCP、Unix、HTTP、WebSocket。',
    tags: ['5 种传输'],
    href: '/libs/json-rpc',
    layer: 'base',
  },
  {
    code: 'LLM',
    name: 'LLM API',
    pkg: 'llm_api',
    desc: '轻量模型封装：OpenAI 兼容、Anthropic、Ollama 一套接口通吃，含流式与多模态。',
    tags: ['流式', '多模态'],
    href: '/libs/llm-api',
    layer: 'base',
  },
]

const layerLabel: Record<Lib['layer'], string> = {
  framework: '框架层',
  protocol: '协议层',
  base: '基础层',
}

function onMove(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <section class="at-section at-libs">
    <div class="at-reveal">
      <p class="at-section__eyebrow">LIBRARIES</p>
      <h2 class="at-section__title">九个库，各自做好一件事</h2>
      <p class="at-section__desc">
        每个库都能单独使用：只想接 MCP 就装 mcp，只想调模型就装 llm_api。
        它们共享同一套传输与类型约定，组合起来就是完整生态。
      </p>
    </div>

    <div class="at-libs__grid">
      <a
        v-for="lib in libs"
        :key="lib.pkg"
        class="at-lib at-reveal"
        :class="`at-lib--${lib.layer}`"
        :href="lib.href"
        @mousemove="onMove"
      >
        <span class="at-lib__glow" aria-hidden="true" />
        <div class="at-lib__top">
          <span class="at-lib__code">{{ lib.code }}</span>
          <span class="at-lib__layer">{{ layerLabel[lib.layer] }}</span>
        </div>
        <h3 class="at-lib__name">{{ lib.name }}</h3>
        <p class="at-lib__pkg">{{ lib.pkg }}</p>
        <p class="at-lib__desc">{{ lib.desc }}</p>
        <div class="at-lib__tags">
          <span v-for="tag in lib.tags" :key="tag">{{ tag }}</span>
        </div>
        <span class="at-lib__arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.at-libs__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: 16px;
}

.at-lib {
  --mx: 50%;
  --my: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 20px 18px;
  border: 1px solid var(--at-line);
  border-radius: var(--at-radius);
  background: linear-gradient(165deg, rgba(15, 21, 35, 0.86), rgba(7, 10, 18, 0.92));
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.28s cubic-bezier(0.2, 0.7, 0.2, 1), border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.at-lib__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    260px 160px at var(--mx) var(--my),
    rgba(34, 230, 255, 0.16),
    transparent 68%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.at-lib:hover {
  transform: translateY(-4px);
  border-color: rgba(34, 230, 255, 0.42);
  box-shadow: 0 24px 54px -30px rgba(34, 230, 255, 0.8);
}

.at-lib:hover .at-lib__glow {
  opacity: 1;
}

.at-lib--framework:hover {
  border-color: rgba(139, 107, 255, 0.45);
  box-shadow: 0 24px 54px -30px rgba(139, 107, 255, 0.85);
}
.at-lib--framework .at-lib__glow {
  background: radial-gradient(260px 160px at var(--mx) var(--my), rgba(139, 107, 255, 0.18), transparent 68%);
}

.at-lib__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.at-lib__code {
  font-family: var(--at-mono);
  font-size: 9.5px;
  letter-spacing: 0.24em;
  color: var(--at-cyan);
}

.at-lib--framework .at-lib__code { color: var(--at-violet); }
.at-lib--base .at-lib__code { color: var(--at-gold); }

.at-lib__layer {
  font-size: 10.5px;
  letter-spacing: 0.14em;
  color: var(--at-dimmer);
}

.at-lib__name {
  margin: 4px 0 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--at-text);
  letter-spacing: 0.01em;
}

.at-lib__pkg {
  margin: 0;
  font-family: var(--at-mono);
  font-size: 11.5px;
  color: var(--at-dim);
}

.at-lib__desc {
  margin: 6px 0 0;
  font-size: 12.8px;
  line-height: 1.75;
  color: var(--at-dim);
}

.at-lib__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 14px;
}

.at-lib__tags span {
  padding: 3px 8px;
  border: 1px solid var(--at-line);
  border-radius: 5px;
  font-family: var(--at-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--at-dim);
  background: rgba(255, 255, 255, 0.02);
}

.at-lib__arrow {
  position: absolute;
  right: 18px;
  bottom: 16px;
  font-size: 16px;
  color: var(--at-cyan);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.at-lib:hover .at-lib__arrow {
  opacity: 1;
  transform: none;
}
</style>
