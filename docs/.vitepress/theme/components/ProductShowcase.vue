<script setup lang="ts">
/**
 * 三个成品：用 CSS 画的示意界面，不依赖截图资源。
 * 均为闭源产品，这里只做生态展示，页面不提供源码或构建入口。
 */
</script>

<template>
  <section class="at-section at-products">
    <div class="at-reveal">
      <p class="at-section__eyebrow">PRODUCTS</p>
      <h2 class="at-section__title">三个已经跑起来的产品</h2>
      <p class="at-section__desc">
        框架之上是完整的应用，也是这套生态真正的使用者。
        三个产品均闭源，这里只做展示 —— 它们反过来验证了下面这些库能撑住真实产品。
      </p>
    </div>

    <div class="at-products__list">
      <!-- Lumine -->
      <article class="at-product at-product--lumine at-reveal">
        <div class="at-product__body">
          <div class="at-product__meta">
            <span class="at-product__badge">DESKTOP</span>
            <span class="at-product__status">可用</span>
          </div>
          <h3 class="at-product__name">
            荧的炼金工房
            <span>Atelier Lumine</span>
          </h3>
          <p class="at-product__desc">
            原神配装与配队助手。角色库、圣遗物、多套配装和队伍编排都在本地，
            配装问题交给 Agent 回答 —— 同一份内核既是给人用的界面，也是给 AI 用的 MCP 服务。
          </p>
          <ul class="at-product__points">
            <li>cjxt 驱动的 Web 界面，另有 CangHui 桌面版</li>
            <li>同进程暴露 11 个 MCP 工具，任意客户端可接</li>
            <li>游戏数据与存档全部落在本地</li>
          </ul>
          <a class="at-product__link" href="/products/lumine">了解产品 <span>→</span></a>
        </div>

        <div class="at-product__visual" aria-hidden="true">
          <div class="at-shot at-shot--lumine">
            <div class="at-shot__bar">
              <span class="at-shot__dot" /><span class="at-shot__dot" /><span class="at-shot__dot" />
              <span class="at-shot__title">荧的炼金工房</span>
            </div>
            <div class="at-shot__body">
              <div class="at-shot__side">
                <span class="is-on">胡桃</span>
                <span>钟离</span>
                <span>雷电将军</span>
                <span>夜兰</span>
                <span>芙宁娜</span>
              </div>
              <div class="at-shot__main">
                <div class="at-shot__hero">
                  <div class="at-shot__avatar" />
                  <div>
                    <b>胡桃</b>
                    <i>火 · 长柄武器 · ★5</i>
                  </div>
                </div>
                <div class="at-shot__slots">
                  <span v-for="i in 5" :key="i" class="at-shot__slot" />
                </div>
                <div class="at-shot__row">
                  <span class="at-shot__weapon" />
                  <span class="at-shot__chip">护摩之杖 · R1</span>
                </div>
                <div class="at-shot__msg">这套配装的元素精通够吗？</div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Yggdrasil -->
      <article class="at-product at-product--yggdrasil at-reveal">
        <div class="at-product__body">
          <div class="at-product__meta">
            <span class="at-product__badge">HOST PLATFORM</span>
            <span class="at-product__status is-dev">私有 · Phase 4</span>
          </div>
          <h3 class="at-product__name">
            世界树
            <span>Atelier Yggdrasil</span>
          </h3>
          <p class="at-product__desc">
            DeepSeek Harness（dsh）的仓颉实现：把 Agent 内核、插件内核与界面层融成「一切皆插件」的宿主平台。
            每个插件独立进程运行，可热卸载、崩溃自愈，按 profile 声明依赖拓扑完成装配。
          </p>
          <ul class="at-product__points">
            <li>主干是宿主，枝干是插件，树液是事件总线</li>
            <li>插件注入拓扑 llm → tools → session → agent</li>
            <li>远程适配器让 Agent 内核零改动地服务化</li>
          </ul>
          <a class="at-product__link" href="/products/yggdrasil">了解产品 <span>→</span></a>
        </div>

        <div class="at-product__visual" aria-hidden="true">
          <div class="at-shot at-shot--tree">
            <div class="at-tree">
              <div class="at-tree__host">
                <b>YGGDRASIL</b>
                <i>host · profile 装配</i>
              </div>
              <div class="at-tree__bus">
                <span>event bus</span>
              </div>
              <div class="at-tree__plugins">
                <span>llm</span>
                <span>tools</span>
                <span>session</span>
                <span>agent</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Starline -->
      <article class="at-product at-product--starline at-reveal">
        <div class="at-product__body">
          <div class="at-product__meta">
            <span class="at-product__badge">LIVE DESKTOP</span>
            <span class="at-product__status is-dev">重构中</span>
          </div>
          <h3 class="at-product__name">
            星痕的炼金工房
            <span>Atelier Starline</span>
          </h3>
          <p class="at-product__desc">
            人机共享的常驻桌面：一块屏上摆着一组浮动窗口，人和 LLM 看同一块屏、改同一份数据。
            对话只是其中一块面板，与其它面板平权。
          </p>
          <ul class="at-product__points">
            <li>面板即数据库：render 是查询，工具是写命令</li>
            <li>Router + 多 Worker，切换项目即改变注意力</li>
            <li>纯仓颉单体，界面由 cjxt 服务端渲染</li>
          </ul>
          <a class="at-product__link" href="/products/starline">了解产品 <span>→</span></a>
        </div>

        <div class="at-product__visual" aria-hidden="true">
          <div class="at-shot at-shot--starline">
            <div class="at-shot__win at-shot__win--a">
              <span class="at-shot__wtitle">待办</span>
              <i /><i /><i />
            </div>
            <div class="at-shot__win at-shot__win--b">
              <span class="at-shot__wtitle">会话</span>
              <em class="is-user" />
              <em class="is-ai" />
              <em class="is-user short" />
            </div>
            <div class="at-shot__win at-shot__win--c">
              <span class="at-shot__wtitle">时间线</span>
              <i /><i /><i /><i />
            </div>
            <div class="at-shot__dock">
              <span>＋</span><span class="is-on">◧</span><span>◫</span><span>◪</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.at-products__list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.at-product {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
  padding: clamp(24px, 3.4vw, 44px);
  border: 1px solid var(--at-line);
  border-radius: 18px;
  background:
    radial-gradient(600px 300px at 100% 0%, rgba(34, 230, 255, 0.07), transparent 68%),
    linear-gradient(160deg, rgba(14, 20, 33, 0.9), rgba(6, 9, 16, 0.94));
  overflow: hidden;
}

.at-product--yggdrasil {
  background:
    radial-gradient(600px 300px at 100% 0%, rgba(139, 107, 255, 0.1), transparent 68%),
    linear-gradient(160deg, rgba(14, 20, 33, 0.9), rgba(6, 9, 16, 0.94));
}

.at-product--starline {
  background:
    radial-gradient(600px 300px at 100% 0%, rgba(255, 200, 87, 0.07), transparent 68%),
    linear-gradient(160deg, rgba(14, 20, 33, 0.9), rgba(6, 9, 16, 0.94));
}

@media (max-width: 880px) {
  .at-product {
    grid-template-columns: 1fr;
  }
  .at-product__visual {
    order: -1;
  }
}

.at-product__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.at-product__badge {
  padding: 3px 10px;
  border: 1px solid var(--at-line-strong);
  border-radius: 5px;
  font-family: var(--at-mono);
  font-size: 9.5px;
  letter-spacing: 0.22em;
  color: var(--at-cyan);
}

.at-product__status {
  font-size: 11.5px;
  letter-spacing: 0.1em;
  color: #4ade80;
}

.at-product__status.is-dev {
  color: var(--at-gold);
}

.at-product__name {
  margin: 0 0 14px;
  font-size: clamp(23px, 2.6vw, 31px);
  font-weight: 750;
  letter-spacing: 0.01em;
  color: #fff;
}

.at-product__name span {
  display: block;
  margin-top: 6px;
  font-family: var(--at-mono);
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: 0.26em;
  color: var(--at-dimmer);
}

.at-product__desc {
  margin: 0 0 18px;
  font-size: 14px;
  line-height: 1.9;
  color: var(--at-dim);
}

.at-product__points {
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.at-product__points li {
  position: relative;
  padding-left: 18px;
  font-size: 12.8px;
  line-height: 1.65;
  color: var(--at-dim);
}

.at-product__points li::before {
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

.at-product--yggdrasil .at-product__points li::before {
  background: var(--at-violet);
  box-shadow: 0 0 8px var(--at-violet);
}

.at-product--starline .at-product__points li::before {
  background: var(--at-gold);
  box-shadow: 0 0 8px var(--at-gold);
}

.at-product__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--at-cyan);
  text-decoration: none;
  border-bottom: 1px solid rgba(34, 230, 255, 0.3);
  padding-bottom: 3px;
  transition: gap 0.2s ease, border-color 0.2s ease;
}

.at-product__link:hover {
  gap: 14px;
  border-color: var(--at-cyan);
}

/* ── 示意界面 ─────────────────────────────────── */
.at-product__visual {
  position: relative;
  min-height: 260px;
  display: grid;
  place-items: center;
}

.at-shot {
  position: relative;
  width: 100%;
  max-width: 468px;
  border: 1px solid rgba(120, 215, 255, 0.2);
  border-radius: 12px;
  background: linear-gradient(170deg, #0c1220, #070a12);
  box-shadow:
    0 30px 70px -40px rgba(0, 0, 0, 0.95),
    0 0 60px -30px rgba(34, 230, 255, 0.4);
  overflow: hidden;
  transform: perspective(900px) rotateY(-6deg) rotateX(2deg);
  transition: transform 0.5s ease;
}

.at-product--lumine:hover .at-shot--lumine {
  transform: perspective(900px) rotateY(-1deg) rotateX(0deg) translateY(-4px);
}

.at-shot__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-bottom: 1px solid rgba(120, 215, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
}

.at-shot__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2b3446;
}

.at-shot__dot:nth-child(1) { background: #ff5f57; }
.at-shot__dot:nth-child(2) { background: #febc2e; }
.at-shot__dot:nth-child(3) { background: #28c840; }

.at-shot__title {
  margin-left: 6px;
  font-family: var(--at-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--at-dimmer);
}

.at-shot__body {
  display: grid;
  grid-template-columns: 108px 1fr;
  min-height: 238px;
}

.at-shot__side {
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(120, 215, 255, 0.1);
  padding: 10px 8px;
  gap: 2px;
}

.at-shot__side span {
  padding: 6px 9px;
  border-radius: 5px;
  font-size: 10.5px;
  color: var(--at-dim);
}

.at-shot__side span.is-on {
  background: rgba(34, 230, 255, 0.1);
  color: var(--at-cyan);
}

.at-shot__main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.at-shot__hero {
  display: flex;
  align-items: center;
  gap: 10px;
}

.at-shot__avatar {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: linear-gradient(140deg, rgba(255, 46, 136, 0.55), rgba(139, 107, 255, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.at-shot__hero b {
  display: block;
  font-size: 12.5px;
  color: #fff;
}

.at-shot__hero i {
  display: block;
  font-style: normal;
  font-size: 9.5px;
  color: var(--at-dimmer);
  margin-top: 2px;
}

.at-shot__slots {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.at-shot__slot {
  aspect-ratio: 1;
  border-radius: 7px;
  border: 1px solid rgba(255, 200, 87, 0.28);
  background: linear-gradient(160deg, rgba(255, 200, 87, 0.14), rgba(255, 200, 87, 0.02));
}

.at-shot__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.at-shot__weapon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid rgba(34, 230, 255, 0.3);
  background: rgba(34, 230, 255, 0.09);
}

.at-shot__chip {
  font-size: 9.5px;
  color: var(--at-dim);
}

.at-shot__msg {
  margin-top: auto;
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(139, 107, 255, 0.28);
  background: rgba(139, 107, 255, 0.09);
  font-size: 10.5px;
  color: #cfd8ea;
}

/* 世界树：宿主 + 插件树 */
.at-shot--tree {
  height: 262px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(320px 180px at 50% 40%, rgba(139, 107, 255, 0.16), transparent 72%),
    linear-gradient(170deg, #0b1020, #06080f);
  transform: none;
}

.at-product--yggdrasil:hover .at-shot--tree {
  transform: translateY(-4px);
}

.at-tree {
  width: 100%;
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.at-tree__host {
  position: relative;
  padding: 12px 22px;
  border: 1px solid rgba(139, 107, 255, 0.5);
  border-radius: 10px;
  background: rgba(139, 107, 255, 0.12);
  text-align: center;
  box-shadow: 0 0 26px -6px rgba(139, 107, 255, 0.7);
}

.at-tree__host b {
  display: block;
  font-family: var(--at-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  color: #d9d0ff;
}

.at-tree__host i {
  display: block;
  margin-top: 3px;
  font-style: normal;
  font-size: 9.5px;
  color: var(--at-dimmer);
}

.at-tree__bus {
  position: relative;
  width: 82%;
  height: 34px;
  display: grid;
  place-items: center;
}

.at-tree__bus::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    rgba(34, 230, 255, 0.55) 0 5px,
    transparent 5px 10px
  );
}

.at-tree__bus span {
  position: relative;
  padding: 1px 8px;
  background: #080b14;
  font-family: var(--at-mono);
  font-size: 8.5px;
  letter-spacing: 0.18em;
  color: var(--at-cyan);
}

.at-tree__plugins {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.at-tree__plugins span {
  flex: 1 1 0;
  max-width: 84px;
  padding: 9px 0;
  border: 1px solid rgba(120, 215, 255, 0.24);
  border-radius: 7px;
  background: rgba(10, 15, 26, 0.9);
  text-align: center;
  font-family: var(--at-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  color: #a9c6e4;
}

/* Starline：浮动窗口 */
.at-shot--starline {
  height: 250px;
  background:
    radial-gradient(400px 200px at 50% 30%, rgba(255, 200, 87, 0.08), transparent 70%),
    linear-gradient(170deg, #0b1020, #06080f);
  transform: none;
}

.at-product--starline:hover .at-shot--starline {
  transform: translateY(-4px);
}

.at-shot__win {
  position: absolute;
  padding: 9px 10px;
  border: 1px solid rgba(120, 215, 255, 0.22);
  border-radius: 9px;
  background: rgba(12, 18, 30, 0.94);
  box-shadow: 0 18px 34px -22px rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.at-shot__win--a {
  left: 18px;
  top: 20px;
  width: 132px;
}

.at-shot__win--b {
  right: 18px;
  top: 44px;
  width: 158px;
  z-index: 2;
}

.at-shot__win--c {
  left: 46px;
  bottom: 34px;
  width: 150px;
  z-index: 3;
}

.at-shot__wtitle {
  font-family: var(--at-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
  color: var(--at-gold);
  opacity: 0.85;
}

.at-shot__win i {
  display: block;
  height: 6px;
  border-radius: 3px;
  background: rgba(150, 180, 220, 0.16);
}

.at-shot__win i:nth-child(3) { width: 78%; }
.at-shot__win i:nth-child(4) { width: 56%; }

.at-shot__win em {
  display: block;
  height: 15px;
  border-radius: 5px;
  background: rgba(150, 180, 220, 0.13);
}

.at-shot__win em.is-user {
  width: 72%;
  background: rgba(34, 230, 255, 0.16);
}

.at-shot__win em.is-ai {
  width: 92%;
  background: rgba(139, 107, 255, 0.18);
}

.at-shot__win em.short {
  width: 48%;
}

.at-shot__dock {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  padding: 5px 7px;
  border: 1px solid rgba(120, 215, 255, 0.16);
  border-radius: 999px;
  background: rgba(8, 12, 20, 0.9);
}

.at-shot__dock span {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 10px;
  color: var(--at-dim);
}

.at-shot__dock span.is-on {
  color: #06121a;
  background: var(--at-gold);
}
</style>
