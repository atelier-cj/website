<script setup lang="ts">
/**
 * 生态图谱：三层结构（协议 / 框架 / 成品）。
 * 鼠标悬停某一层时提升该层亮度、压低其它层，突出层与层之间的依赖方向。
 */
import { ref } from 'vue'

interface Node {
  name: string
  code: string
  desc: string
  href: string
}

interface Layer {
  id: string
  label: string
  en: string
  note: string
  nodes: Node[]
}

const layers: Layer[] = [
  {
    id: 'products',
    label: '成品',
    en: 'PRODUCTS',
    note: '可以直接用的应用',
    nodes: [
      { name: '荧的炼金工房', code: 'LUMINE', desc: '原神配装助手 · Web + 桌面', href: '/products/lumine' },
      { name: '世界树', code: 'YGGDRASIL', desc: '插件化 Agent 宿主 · dsh 仓颉实现', href: '/products/yggdrasil' },
      { name: '星痕的炼金工房', code: 'STARLINE', desc: '人机共享的常驻桌面', href: '/products/starline' },
    ],
  },
  {
    id: 'framework',
    label: '框架',
    en: 'FRAMEWORK',
    note: '把模型组装成 Agent',
    nodes: [
      { name: 'Atelier', code: 'HARNESS', desc: '可嵌入的 Agent 脚手架', href: '/libs/atelier' },
      { name: 'Cordis', code: 'PLUGIN', desc: 'cordis-js 的仓颉实现', href: '/libs/cordis' },
      { name: 'UHP Server', code: 'RUNTIME', desc: '多 harness 常驻端点', href: '/libs/uhp-server' },
    ],
  },
  {
    id: 'protocol',
    label: '协议',
    en: 'PROTOCOL',
    note: 'Agent 对外接口',
    nodes: [
      { name: 'MCP', code: 'MODEL', desc: '模型上下文协议', href: '/libs/mcp' },
      { name: 'A2A', code: 'AGENT', desc: 'Agent 之间互联', href: '/libs/a2a' },
      { name: 'ACP', code: 'EDITOR', desc: '编辑器接入 Agent', href: '/libs/acp' },
      { name: 'UHP', code: 'HARNESS', desc: '常驻 harness 协议', href: '/libs/uhp' },
      { name: 'JSON-RPC', code: 'BASE', desc: '通用传输底座', href: '/libs/json-rpc' },
    ],
  },
]

const active = ref<string | null>(null)
</script>

<template>
  <section class="at-section at-eco">
    <div class="at-reveal">
      <p class="at-section__eyebrow">ARCHITECTURE</p>
      <h2 class="at-section__title">三层生态，一套底座</h2>
      <p class="at-section__desc">
        自下而上：JSON-RPC 承担传输，五套协议对接模型、Agent、编辑器与常驻服务；
        框架层把协议和能力装配成可运行的 Agent；最上层是可以直接使用的成品。
      </p>
    </div>

    <div
      class="at-eco__stack at-reveal"
      :class="active ? 'is-focused' : ''"
      @mouseleave="active = null"
    >
      <div
        v-for="layer in layers"
        :key="layer.id"
        class="at-eco__layer"
        :class="[`is-${layer.id}`, { 'is-active': active === layer.id, 'is-dim': active && active !== layer.id }]"
        @mouseenter="active = layer.id"
      >
        <div class="at-eco__label">
          <span class="at-eco__label-cn">{{ layer.label }}</span>
          <span class="at-eco__label-en">{{ layer.en }}</span>
          <span class="at-eco__label-note">{{ layer.note }}</span>
        </div>

        <div class="at-eco__nodes">
          <a
            v-for="node in layer.nodes"
            :key="node.code"
            class="at-eco__node"
            :href="node.href"
          >
            <span class="at-eco__node-code">{{ node.code }}</span>
            <span class="at-eco__node-name">{{ node.name }}</span>
            <span class="at-eco__node-desc">{{ node.desc }}</span>
          </a>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.at-eco__stack {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 54px;
}

/* 中轴：把三层串成一条结构线 */
.at-eco__stack::before {
  content: "";
  position: absolute;
  left: 146px;
  top: 18px;
  bottom: 18px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--at-line-strong) 10%,
    var(--at-line-strong) 90%,
    transparent
  );
  opacity: 0.55;
}

@media (max-width: 760px) {
  .at-eco__stack::before {
    display: none;
  }
}

.at-eco__layer {
  position: relative;
  display: grid;
  grid-template-columns: 124px 1fr;
  gap: 22px;
  align-items: start;
  transition: opacity 0.35s ease, filter 0.35s ease;
}

@media (max-width: 760px) {
  .at-eco__layer {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

/* 聚焦只做轻微衰减：压到 0.42 时整层看着像「消失了」 */
.at-eco__layer.is-dim {
  opacity: 0.72;
  filter: saturate(0.85);
}

.at-eco__layer.is-active .at-eco__node {
  border-color: var(--at-line-strong);
}

/* 触摸设备没有真正的 hover，点一下就让别的层一直发暗，直接不启用 */
@media (hover: none) {
  .at-eco__layer.is-dim {
    opacity: 1;
    filter: none;
  }
}

.at-eco__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
}

.at-eco__label-cn {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--at-text);
}

.at-eco__label-en {
  font-family: var(--at-mono);
  font-size: 10px;
  letter-spacing: 0.26em;
  color: var(--at-dimmer);
}

.at-eco__label-note {
  margin-top: 4px;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--at-dim);
}

.at-eco__nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.at-eco__node {
  position: relative;
  flex: 1 1 0;
  min-width: 148px;
  max-width: 232px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 16px 18px;
  border: 1px solid var(--at-line);
  border-radius: 12px;
  background: linear-gradient(160deg, rgba(16, 23, 38, 0.9), rgba(8, 12, 21, 0.82));
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.at-eco__node::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(220px 120px at 50% 0%, rgba(34, 230, 255, 0.16), transparent 72%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.at-eco__node:hover {
  transform: translateY(-3px);
  border-color: var(--at-line-strong);
  box-shadow: 0 16px 40px -24px rgba(34, 230, 255, 0.9);
}

.at-eco__node:hover::before {
  opacity: 1;
}

.at-eco__node-code {
  position: relative;
  font-family: var(--at-mono);
  font-size: 9.5px;
  letter-spacing: 0.24em;
  color: var(--at-cyan);
  opacity: 0.85;
}

.at-eco__node-name {
  position: relative;
  font-size: 14.5px;
  font-weight: 650;
  color: var(--at-text);
}

.at-eco__node-desc {
  position: relative;
  font-size: 11.8px;
  line-height: 1.55;
  color: var(--at-dim);
}

.at-eco__layer.is-products .at-eco__node-code { color: var(--at-gold); }
.at-eco__layer.is-framework .at-eco__node-code { color: var(--at-violet); }

@media (max-width: 760px) {
  .at-eco__node { max-width: none; }
}
</style>
