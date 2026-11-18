import { defineConfig } from 'vitepress'
import cangjieGrammar from './grammars/cangjie.tmLanguage.json'

const ORG = 'https://github.com/atelier-cj'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Atelier',
  titleTemplate: ':title · Atelier',
  description: '仓颉语言的 Agent 生态：协议、框架与成品。',
  cleanUrls: true,
  appearance: 'dark',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'canonical', href: 'https://atelier-ai.top/' }],
    ['meta', { name: 'theme-color', content: '#05060a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Atelier · 仓颉 Agent 生态' }],
    ['meta', { property: 'og:description', content: '协议、框架与成品：用仓颉语言搭建 Agent 生态。' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // 百度统计
    [
      'script',
      {},
      `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?69da7f3976ba6a2c28a6cfc291f5b218";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`,
    ],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Atelier',
    nav: [
      { text: '首页', link: '/' },
      {
        // 点击进入 Atelier 介绍，悬停展开生态成员
        text: '生态',
        activeMatch: '/(libs/atelier|products/)',
        items: [
          { text: '生态全景', link: '/ecosystem/' },
          { text: '荧的炼金工房', link: '/products/lumine' },
          { text: '世界树 · Yggdrasil', link: '/products/yggdrasil' },
          { text: '星痕的炼金工房', link: '/products/starline' },
        ],
      },
      { text: '文档', link: '/guide/' },
      {
        // 点击进入库索引，悬停展开协议层（底层库不占位）
        text: '库',
        activeMatch: '/(libs/)',
        items: [
          { text: 'MCP · 模型上下文', link: '/libs/mcp' },
          { text: 'A2A · Agent 互联', link: '/libs/a2a' },
          { text: 'ACP · 编辑器接入', link: '/libs/acp' },
          { text: 'UHP · 常驻 Harness', link: '/libs/uhp' },
          { text: '库索引', link: '/libs/' },
        ],
      },
      { text: '产品', link: '/products/' },
      { text: '关于', link: '/about' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '上手',
          items: [
            { text: '开始之前', link: '/guide/' },
            { text: '搭建一个 Agent', link: '/guide/agent-stack' },
            { text: '协议选型', link: '/guide/protocols' },
          ],
        },
        {
          text: '深入',
          items: [{ text: '生态全景', link: '/ecosystem/' }],
        },
      ],
      '/libs/': [
        {
          text: '框架层',
          items: [
            { text: '库索引', link: '/libs/' },
            { text: 'Atelier · Agent Harness', link: '/libs/atelier' },
            { text: 'Cordis · 插件系统', link: '/libs/cordis' },
            { text: 'UHP Server · 常驻服务', link: '/libs/uhp-server' },
          ],
        },
        {
          text: '协议层',
          items: [
            { text: 'JSON-RPC · 传输底座', link: '/libs/json-rpc' },
            { text: 'MCP · 模型上下文', link: '/libs/mcp' },
            { text: 'A2A · Agent 互联', link: '/libs/a2a' },
            { text: 'ACP · 编辑器接入', link: '/libs/acp' },
            { text: 'UHP · 常驻 Harness', link: '/libs/uhp' },
          ],
        },
        {
          text: '基础层',
          items: [{ text: 'LLM API · 模型封装', link: '/libs/llm-api' }],
        },
      ],
      '/products/': [
        {
          text: '成品',
          items: [
            { text: '产品概览', link: '/products/' },
            { text: '荧的炼金工房', link: '/products/lumine' },
            { text: '世界树 · Yggdrasil', link: '/products/yggdrasil' },
            { text: '星痕的炼金工房', link: '/products/starline' },
          ],
        },
      ],
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    footer: {
      message: '以仓颉语言构建的 Agent 生态',
      copyright: '© 2026 Atelier · <a href="' + ORG + '">GitHub</a> · <a href="https://atomgit.com/ystyle">AtomGit</a>',
    },
    socialLinks: [{ icon: 'github', link: ORG }],
    search: { provider: 'local' },
  },
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    // 仓颉官方没有现成的 TextMate 语法，这里自带一份精简定义
    languages: [cangjieGrammar as any],
  },
})
