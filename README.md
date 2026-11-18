# Atelier 官网

仓颉语言 Agent 生态的官方网站：<https://atelier-ai.top>

- 首页：自定义 VitePress 主题（`layout: landing`），Canvas 星场 + 透视网格 + 滚动入场
- 文档：VitePress 默认主题，Markdown 编写
- 部署：GitHub Actions → GitHub Pages，自定义域名 `atelier-ai.top`

## 本地开发

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产物在 docs/.vitepress/dist
npm run preview    # 预览构建产物
```

截图巡检（需要本机 Chrome）：

```bash
npm run dev &
node scripts/shot.mjs http://127.0.0.1:5173/
# 产物在 .shots/
```

## 站点结构

```
docs/
├── index.md                  # 首页（frontmatter: layout: landing）
├── ecosystem/index.md        # 生态全景
├── guide/                    # 上手文档
├── libs/                     # 九个库的文档页
├── products/                 # 两个成品
├── about.md
├── public/                   # 静态资源（CNAME、logo、favicon 由此产出）
└── .vitepress/
    ├── config.mts            # 导航、侧栏、SEO
    └── theme/
        ├── index.ts          # 继承 DefaultTheme
        ├── Layout.vue        # 路由分发：landing 走自定义首页，其余走默认布局
        ├── Landing.vue       # 首页装配 + Hero
        ├── components/       # 首页分区组件
        └── styles/landing.css
```

**首页定制原理**：`Layout.vue` 读取当前页 frontmatter，`layout === 'landing'` 时渲染 `Landing.vue`（完全脱离默认主题，不含右侧大纲、不含默认导航），否则渲染 `DefaultTheme.Layout`。所以首页可以随便写 Vue，文档页仍然是标准 VitePress 体验。

**SSR 注意**：构建时组件在 Node 里预渲染，任何 `window` / `document` / Canvas 访问都必须放在 `onMounted` 内。`Starfield.vue` 与 `TerminalDemo.vue` 都是这个模式。

## 部署到 GitHub Pages

仓库推到 `github.com/atelier-cj/website` 后：

1. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**（不要选 "Deploy from a branch"）
2. 推送到 `main` 自动触发 `.github/workflows/deploy.yml`
3. **Settings → Pages → Custom domain** 填 `atelier-ai.top`，勾选 **Enforce HTTPS**

`docs/public/CNAME` 已写好域名，构建时会带进产物。

## 域名 DNS（阿里云）

`atelier-ai.top` 是顶级域名，GitHub Pages 要求用 A 记录指向其 IP（`*.atelier-ai.top` 这种子域才用 CNAME）：

| 记录类型 | 主机记录 | 记录值 |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `atelier-cj.github.io` |

验证：

```bash
dig +short atelier-ai.top A
curl -I https://atelier-ai.top
```

DNS 生效后 GitHub 才会签发 HTTPS 证书（Let's Encrypt），第一次可能要等几分钟到几十分钟。

## 内容约定

- 库页面从各仓 `README.md` / `docs/` 提炼，不复制上游全文；API 与版本号必须与仓库一致
- 首页数据（库数量、协议数量）在 `Landing.vue` 里，新增库时同步更新
- 所有首页动效在 `prefers-reduced-motion: reduce` 下会关闭
