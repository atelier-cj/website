# 生态全景

这套生态由十来个仓颉仓组成，分三层：协议层负责和外部世界说话，框架层把协议与模型装配成可交付的 Agent，成品层是能直接跑的应用。协议层内部共用 `json-rpc` 做消息底座，再往下是基础库（`llm_api` 负责模型访问、`jsonvalue` 提供通用 JSON）。本页只讲结构与依赖方向，各库的 API 见[库索引](/libs/)。

## 三层结构

```
┌──────────────────────────────────────────────────────────────────────┐
│ 成品   荧的炼金工房（Lumine）      星痕的炼金工房（Starline）           │
│        原神 AI 配装 · Web/桌面     人机共享常驻桌面 · cjxt              │
└────────────────────────┬─────────────────────────────────────────────┘
                         │ 装配（不复制内核）
┌────────────────────────┴─────────────────────────────────────────────┐
│ 框架   atelier        可嵌入 Agent Harness（循环/工具/压缩/会话/信任） │
│        cordis         微内核 + 进程隔离插件系统                        │
│        uhp-server     多 harness 合成一个 UHP 常驻端点                 │
└────────────────────────┬─────────────────────────────────────────────┘
                         │ 调用
┌────────────────────────┴─────────────────────────────────────────────┐
│ 协议   mcp   工具与上下文        a2a   Agent 之间                      │
│        acp   编辑器接入 Agent    uhp   常驻 harness                    │
│        json-rpc   消息/请求/分帧底座（stdio / TCP / Unix / HTTP / WS）  │
└────────────────────────┬─────────────────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────────────────┐
│ 基础   llm_api   OpenAI / Anthropic / Ollama 一套接口                  │
│        jsonvalue 通用 JSON 值（外部中心仓依赖，全生态共用）             │
└──────────────────────────────────────────────────────────────────────┘
```

层间只有一条规矩：**依赖只向下**。协议层不认识框架层，框架层不复制协议实现，成品层不重写内核。这让「换模型」「换协议」「换产品形态」各自独立——也是这套东西能同时长出桌面应用和常驻服务的原因。

## 协议层：一套底座，四种语义

`ystyle::jsonrpc` 提供消息类型、编解码、分帧与五种传输。`mcp` / `a2a` / `acp` 都建在它上面，因此代码形状高度一致：`Server` 注册 handler、`Client` 发请求、消息类型实现 `stdx.encoding.json.stream` 的序列化接口；`uhp` 是例外，只依赖 stdx，形状是 HTTP 资源模型。

- [mcp](/libs/mcp) 2.4.0 —— 工具 / 资源 / 提示词；stdio 与 Streamable HTTP；协议 2025-11-25 是推荐线。
- [a2a](/libs/a2a) 0.1.1 —— Agent Card 发现、九个任务状态、SSE、推送；官方 TCK 可执行 MUST 全过。
- [acp](/libs/acp) 0.3.0 —— 子进程 + stdio，被 Zed / opencode 拉起；含 `terminal/*`、`fs/*` 反向调用。
- [uhp](/libs/uhp) 0.1.1 —— 常驻 harness 协议；一致性套件 core / extended / full 三档全过。

四者不互相依赖。选哪个看对面是谁，见[协议选型](/guide/protocols)。

## 框架层：把协议与模型装配成产品

- [atelier](/libs/atelier) 0.1.15 —— 核心 Harness：Agent 循环、工具系统、树形会话、上下文压缩、信任闸门、Skill、子 Agent。同时实现 MCP / A2A / ACP / UHP 四个端，一个 Agent 可以既被编辑器拉起、又对外提供 A2A、又作为远端 harness 被派活。
- [cordis](/libs/cordis) 0.3.2 —— 与 Agent 无关的通用组合框架：插件跑在独立进程，卸载即杀进程回收资源，配置声明期望状态、调和器 diff 执行。
- [uhp-server](/libs/uhp-server) 0.1.0 —— 产品（不发中心仓）：一份 TOML 声明 token 与 harness，一个端口对外，可选把适配器放进 cordis 托管的插件进程。

模型访问在更下面：[llm_api](/libs/llm-api) 1.4.2 只做「和模型说话」——同步 `chat()`、流式 `chatStreaming()`、工具调用增量、推理内容、多模态。上层不该自己拼 HTTP。

## 成品层：两个已经能用的应用

| 产品 | 形态 | 用它上面的什么 |
|---|---|---|
| [荧的炼金工房](/products/lumine) | 原神 AI 配装助手；Web + MCP 服务、Windows 桌面版 | `atelier`（Agent + 工具 + Skill）、`mcp`（对外暴露 11 个工具）、`cjxt`（服务端渲染 UI） |
| [星痕的炼金工房](/products/starline) | 人机共享的常驻桌面；cjxt 服务端渲染 + 11 个面板 | `atelier`（内核）、`cjxt`（UI）、`tsdb`（分层时间记忆）、`bstorm`（配置库） |

两个成品的形态差别来自「Agent 在界面里的位置」：Lumine 是「应用 + 一个 AI 助手」，Starline 是「AI 与人共用同一块工作面」。

## 谁基于谁

按 `cjpm.toml` 的真实依赖声明整理（外部通用库只列影响结构的几个）：

| 库 | 直接依赖 | 被谁依赖 |
|---|---|---|
| `jsonvalue` | 无（通用 JSON） | 全部仓颉库与成品 |
| `ystyle::jsonrpc` | `jsonvalue`、`gjson` | `mcp`、`a2a`、`acp`、`cordis_host`、`cordis_plugin`、`atelier`、`uhp_acp`、`uhp-server` |
| `llm_api` | `jsonvalue` | `atelier`、`starline` |
| `mcp` | `jsonrpc`、`jsonvalue`、`sonyflake` | `atelier`、`lumine` |
| `a2a` | `jsonrpc`、`jsonvalue`、`sonyflake` | `atelier` |
| `acp` | `jsonrpc`、`jsonvalue`、`sonyflake` | `atelier`、`uhp_acp` |
| `uhp` | 仅 stdx | `atelier`、`uhp_acp`、`uhp_opencode`、`uhp-server` |
| `cordis_core` / `cordis_host` / `cordis_plugin` | `cordis_core`：`jsonvalue`、`tomlcj`；`host` / `plugin` 另加 `jsonrpc`（+`jsonrpc_stdio` / `jsonrpc_unix`） | `uhp-server`（适配器进程隔离） |
| `cordis_xisp` | `cordis_core/plugin`、`ystyle::xisp` | 独立使用 |
| `atelier` | `mcp`、`a2a`、`acp`、`uhp`、`llm_api`、`bstorm`、`xisp`、`tomlcj`、`jsonrpc` | `lumine`、`starline` |
| `uhp-server` | `uhp`、`uhp_acp`、`uhp_opencode`、`cordis_*`、`tomlcj` | 产品，无下游 |

箭头方向 = 依赖方向（左边被右边依赖）：

```
jsonvalue ──▶ json-rpc ──▶ mcp
   │               ├─────▶ a2a
   │               ├─────▶ acp
   │               ├─────▶ cordis_host / cordis_plugin
   │               └─────▶ uhp_acp
   │
   └──▶ llm_api ──▶ atelier ◀── mcp / a2a / acp / uhp

uhp ──▶ uhp-server ◀── cordis_core / cordis_host / cordis_plugin / uhp_acp / uhp_opencode

atelier ──▶ lumine
atelier ──▶ starline
```

读法：`atelier` 是全生态的重心——协议层与基础层都汇到它，成品都从它长出。所以「只用一个包」的答案通常是 `atelier`（它把协议层一起带进来）；反过来，只写一个 MCP 服务器时不要引入 `atelier`，装 `mcp` 一个包即可。

## 一条链路看全貌

从下往上走一遍，能看到每层的边界在哪：

1. `llm_api` 发一次请求，返回流式增量。
2. `atelier` 在它上面跑循环：把工具 schema 塞进请求、解析 `tool_calls`、执行工具、回填结果，上下文涨到阈值就压缩。
3. 工具来自三处：内置（文件/命令/搜索）、自定义 `Tool`、MCP 服务器（`ystyle::mcp` 客户端）。
4. 这个 Agent 需要对外时，`atelier` 提供 ACP / A2A / UHP 三种身份；需要常驻与多后端时交给 `uhp-server`。
5. 成品只是把上面的东西装配起来，再加自己的数据与界面：Lumine 加原神数据与配装规则，Starline 加面板、分层时间记忆与常驻调度。

接着读：[库索引](/libs/) 看每个包的 API，[搭建一个 Agent](/guide/agent-stack) 看这条路怎么走。
