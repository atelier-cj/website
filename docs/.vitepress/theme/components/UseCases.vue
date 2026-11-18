<script setup lang="ts">
/**
 * 使用场景：回答「我为什么要用它」。
 * 两个主场景方向相反（加能力 vs 做产品），但共用同一套运行时；
 * 末尾给一条边界说明，避免只是要调一次模型的人也来装 Agent。
 */
</script>

<template>
  <section class="at-section at-use">
    <div class="at-reveal">
      <p class="at-section__eyebrow">WHEN TO USE</p>
      <h2 class="at-section__title">两种用法，一套运行时</h2>
      <p class="at-section__desc">
        Atelier 省掉的是「自建 Agent」那一整套脚手架 —— 循环、上下文压缩、工具系统、
        权限判定、会话持久化、多协议接入。落到具体场景，两个方向相反，但都成立。
      </p>
    </div>

    <div class="at-use__cards">
      <article class="at-use__card at-reveal">
        <span class="at-use__no">01</span>
        <h3 class="at-use__title">给已有产品加一个 Agent</h3>
        <p class="at-use__text">
          你已经有了产品，现在想让它自己干活：用户在对话框里说一句，
          程序自己去读文件、查数据、跑命令、改东西。
        </p>
        <ul class="at-use__list">
          <li>接一个现成运行时，而不是从零写循环、压缩和工具调度</li>
          <li>ACP / A2A 两个出口，直接接进已有宿主或远端 Agent</li>
        </ul>
      </article>

      <article class="at-use__card at-reveal">
        <span class="at-use__no">02</span>
        <h3 class="at-use__title">直接基于 Agent 做一个新产品</h3>
        <p class="at-use__text">
          Agent 本身就是产品核心。这时自研的代价更明显：循环、压缩、工具、权限、
          会话、协议六块每块都要做，做完还得让它们互相配合。
        </p>
        <ul class="at-use__list">
          <li>六块直接跳过去，时间花在产品真正不一样的地方</li>
          <li>用装配束声明式定义 Agent，形态不被写死</li>
        </ul>
      </article>
    </div>

    <div class="at-use__more at-reveal">
      <div>
        <p class="at-use__more-title">除这两种之外，也适合</p>
        <ul class="at-use__more-list">
          <li>想要一个能自己调工具干活的 Agent，而不是一问一答</li>
          <li>已经在仓颉生态里 —— 存储与协议层都是仓颉项目</li>
          <li>需要可替换的组件：换模型、换会话存储、换压缩策略、换权限闸门</li>
          <li>需要同一个 Agent 被不同宿主拉起：终端 / HTTP / 编辑器 / 别的 Agent</li>
        </ul>
      </div>

      <p class="at-use__limit">
        <span class="at-use__limit-tag">边界</span>
        反过来，如果只是「发一次模型请求、收一段回复」，用
        <a href="/libs/llm-api">LLM API</a> 就够，不必引入 Agent 概念。
      </p>
    </div>
  </section>
</template>

<style scoped>
.at-use__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 800px) {
  .at-use__cards {
    grid-template-columns: 1fr;
  }
}

.at-use__card {
  position: relative;
  padding: clamp(22px, 3vw, 34px);
  border: 1px solid var(--at-line);
  border-radius: var(--at-radius);
  background:
    linear-gradient(165deg, rgba(15, 21, 35, 0.86), rgba(7, 10, 18, 0.92));
  overflow: hidden;
  transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
}

.at-use__card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--at-cyan), transparent);
  opacity: 0.55;
}

.at-use__card:nth-child(2)::before {
  background: linear-gradient(90deg, transparent, var(--at-violet), transparent);
}

.at-use__card:hover {
  transform: translateY(-4px);
  border-color: var(--at-line-strong);
  box-shadow: 0 24px 54px -34px rgba(34, 230, 255, 0.8);
}

.at-use__card:nth-child(2):hover {
  box-shadow: 0 24px 54px -34px rgba(139, 107, 255, 0.85);
}

.at-use__no {
  display: block;
  font-family: var(--at-mono);
  font-size: 11px;
  letter-spacing: 0.3em;
  color: var(--at-cyan);
  opacity: 0.75;
}

.at-use__card:nth-child(2) .at-use__no {
  color: var(--at-violet);
}

.at-use__title {
  margin: 14px 0 12px;
  font-size: clamp(18px, 2.1vw, 23px);
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fff;
}

.at-use__text {
  margin: 0 0 18px;
  font-size: 13.6px;
  line-height: 1.85;
  color: var(--at-dim);
}

.at-use__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.at-use__list li {
  position: relative;
  padding-left: 18px;
  font-size: 12.8px;
  line-height: 1.7;
  color: var(--at-dim);
}

.at-use__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 5px;
  height: 5px;
  border-radius: 1px;
  background: var(--at-cyan);
  box-shadow: 0 0 8px var(--at-cyan);
  transform: rotate(45deg);
}

.at-use__card:nth-child(2) .at-use__list li::before {
  background: var(--at-violet);
  box-shadow: 0 0 8px var(--at-violet);
}

.at-use__more {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(20px, 4vw, 48px);
  margin-top: 34px;
  padding-top: 30px;
  border-top: 1px solid var(--at-line);
  align-items: start;
}

@media (max-width: 880px) {
  .at-use__more {
    grid-template-columns: 1fr;
  }
}

.at-use__more-title {
  margin: 0 0 14px;
  font-family: var(--at-mono);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--at-dimmer);
}

.at-use__more-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 24px;
}

@media (max-width: 640px) {
  .at-use__more-list {
    grid-template-columns: 1fr;
  }
}

.at-use__more-list li {
  position: relative;
  padding-left: 16px;
  font-size: 12.8px;
  line-height: 1.7;
  color: var(--at-dim);
}

.at-use__more-list li::before {
  content: "·";
  position: absolute;
  left: 2px;
  top: -2px;
  color: var(--at-cyan);
  font-weight: 700;
}

.at-use__limit {
  margin: 0;
  padding: 18px 20px;
  border: 1px dashed rgba(120, 215, 255, 0.26);
  border-radius: 12px;
  font-size: 12.8px;
  line-height: 1.8;
  color: var(--at-dim);
  background: rgba(10, 15, 26, 0.5);
}

.at-use__limit-tag {
  display: inline-block;
  margin-right: 8px;
  padding: 1px 7px;
  border: 1px solid rgba(255, 200, 87, 0.4);
  border-radius: 4px;
  font-family: var(--at-mono);
  font-size: 9.5px;
  letter-spacing: 0.18em;
  color: var(--at-gold);
  vertical-align: middle;
}

.at-use__limit a {
  color: var(--at-cyan);
  text-decoration: none;
  white-space: nowrap;
  border-bottom: 1px solid rgba(34, 230, 255, 0.35);
}

.at-use__limit a:hover {
  border-color: var(--at-cyan);
}
</style>
