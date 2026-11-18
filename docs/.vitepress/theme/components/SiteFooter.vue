<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="at-footer">
    <div class="at-footer__inner">
      <div class="at-footer__brand">
        <a class="at-nav__brand" href="/">
          <img src="/logo.svg" alt="Atelier" />
          <span>ATELIER<em>_</em></span>
        </a>
        <p>仓颉语言上的 Agent 生态：协议、框架与成品。全部开源，纯仓颉实现。</p>
      </div>

      <div>
        <h4>生态</h4>
        <a href="/ecosystem/">全景图</a>
        <a href="/libs/">库索引</a>
        <a href="/products/">产品</a>
      </div>

      <div>
        <h4>文档</h4>
        <a href="/guide/">开始之前</a>
        <a href="/guide/agent-stack">搭建 Agent</a>
        <a href="/guide/protocols">协议选型</a>
      </div>

      <div>
        <h4>链接</h4>
        <a href="https://github.com/atelier-cj" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://atomgit.com/ystyle" target="_blank" rel="noreferrer">AtomGit</a>
        <a href="/about">关于</a>
      </div>
    </div>

    <div class="at-footer__bottom">
      <span>© {{ year }} ATELIER · CANGJIE AGENT ECOSYSTEM</span>
      <span>BUILT WITH VITEPRESS · DEPLOYED ON GITHUB PAGES</span>
    </div>
  </footer>
</template>

<style scoped>
.at-footer__brand .at-nav__brand {
  margin: 0 0 4px;
}
</style>
