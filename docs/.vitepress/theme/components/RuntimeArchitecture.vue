<script setup lang="ts">
/**
 * 运行时架构图：静态 PNG 由 archify 生成（暗色 2×），
 * 点击可打开可交互版本（缩放、悬停高亮、动效）。
 */
</script>

<template>
  <section class="at-section at-runtime">
    <div class="at-reveal">
      <p class="at-section__eyebrow">RUNTIME</p>
      <h2 class="at-section__title">一个回合里，这些模块在干活</h2>
      <p class="at-section__desc">
        接入方式各不相同，进到 Harness 之后走的是同一条循环：
        模型推理、调工具、看结果、压上下文，需要你拍板时停在审批闸门上。
        这些模块就是「不用自己写」的那部分。
      </p>
    </div>

    <figure class="at-runtime__figure at-reveal">
      <a
        class="at-runtime__frame"
        href="/architecture/atelier-runtime.html"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/architecture/atelier-runtime.svg"
          width="1216"
          height="532"
          loading="lazy"
          alt="Atelier Harness 运行时架构图：CLI、HTTP、ACP、A2A 四个入口进入 Harness 边界，边界内是 Agent 循环、工具系统、会话树、上下文压缩、信任闸门与 Skill 注入，对外连接 LLM Provider、MCP 服务器与子 Agent"
        />
        <span class="at-runtime__hint">打开交互版 ↗</span>
      </a>
      <figcaption>
        图中模块名对应 <code>atelier</code> 仓的包结构。
        点击图可打开交互版 —— 支持缩放、悬停高亮与路径追踪。
      </figcaption>
    </figure>
  </section>
</template>

<style scoped>
/* 架构图需要宽度：比其他模块的 1200 更宽，接近图的本尺寸 */
.at-runtime {
  max-width: 1380px;
}

.at-runtime__figure {
  margin: 0;
}

.at-runtime__frame {
  position: relative;
  display: block;
  border: 1px solid var(--at-line);
  border-radius: var(--at-radius);
  background: #0a0e18;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.at-runtime__frame:hover {
  border-color: var(--at-line-strong);
  box-shadow: 0 30px 70px -46px rgba(34, 230, 255, 0.9);
}

.at-runtime__frame img {
  display: block;
  width: 100%;
  height: auto;
}

.at-runtime__hint {
  position: absolute;
  right: 14px;
  bottom: 14px;
  padding: 6px 12px;
  border: 1px solid var(--at-line-strong);
  border-radius: 999px;
  background: rgba(6, 10, 18, 0.9);
  backdrop-filter: blur(8px);
  font-family: var(--at-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  color: var(--at-cyan);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.at-runtime__frame:hover .at-runtime__hint {
  opacity: 1;
  transform: none;
}

.at-runtime__figure figcaption {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin-top: 14px;
  font-size: 11.8px;
  line-height: 1.7;
  color: var(--at-dimmer);
}

.at-runtime__figure figcaption code {
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(34, 230, 255, 0.08);
  color: #a9e9f7;
  font-family: var(--at-mono);
  font-size: 11px;
}

</style>
