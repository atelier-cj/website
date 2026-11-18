# 库索引

九个仓颉库，按依赖方向分三层：**基础层**负责和模型说话，**协议层**负责和外面的世界说话，**框架层**把它们组装成能交付的产品。MCP / A2A / ACP 三个协议层库共用同一套 JSON-RPC 底座（UHP 自己基于 stdx 实现 HTTP），所以选型时先看「对面要什么协议」，再决定拉哪个包。

| 库 | 包名 | 层 | 一句话 | 版本 |
|---|---|---|---|---|
| [Atelier](/libs/atelier) | `atelier` | 框架层 | 可嵌入的 Agent Harness：推理循环、工具、上下文压缩、信任闸门都已实现 | 0.1.15 |
| [Cordis](/libs/cordis) | `ystyle::cordis_core` / `cordis_host` / `cordis_plugin` | 框架层 | 微内核 + 进程隔离的插件系统，热插拔、崩溃自愈 | 0.3.2 |
| [UHP Server](/libs/uhp-server) | 不发中心仓（二进制产品） | 框架层 | 把多个 harness 收敛成一个 UHP 常驻端点 | 0.1.0 |
| [JSON-RPC](/libs/json-rpc) | `ystyle::jsonrpc` + 5 个传输层包 | 协议层 | JSON-RPC 2.0 框架，协议层的消息底座 | 0.7.9 |
| [MCP](/libs/mcp) | `mcp` | 协议层 | Model Context Protocol 的客户端与服务端 | 2.4.0 |
| [A2A](/libs/a2a) | `a2a` | 协议层 | A2A v1.0 双向实现：Agent 之间互相调用 | 0.1.1 |
| [ACP](/libs/acp) | `acp` | 协议层 | ACP v1 双向实现：编辑器接入 Agent | 0.3.0 |
| [UHP](/libs/uhp) | `uhp`（+ `uhp_acp` / `uhp_opencode`） | 协议层 | Unified Harness Protocol 的 SDK 与两个现成适配器 | 0.1.1 |
| [LLM API](/libs/llm-api) | `llm_api` | 基础层 | OpenAI / Anthropic / Ollama 一套接口打通 | 1.4.2 |

> 版本号取自各库的 `cjpm.toml`（monorepo 取子成员里的那一份）；实际能拉取的版本以中心仓为准。

## 基础层：模型访问

把「发一次请求、收流式增量、解析工具调用」封装成统一接口，屏蔽三家协议差异。上层框架不该直接写 HTTP。

- [llm_api](/libs/llm-api) —— 同步 `chat()` + 流式 `chatStreaming()`，五种消息角色、工具调用、推理内容、图片输入。

## 协议层：和外部世界说话

同一个底座（[json-rpc](/libs/json-rpc)）+ 各自协议的语义层，因此这几个库的用法形状高度相似：`Server` 注册 handler、`Client` 发请求，类型都实现 `stdx.encoding.json.stream` 的序列化接口。

- [json-rpc](/libs/json-rpc) —— 纯消息层，不绑定任何协议语义；stdio / TCP / Unix Socket / HTTP / WebSocket 五种传输。
- [mcp](/libs/mcp) —— 把工具、资源、提示词暴露给模型侧，也支持反向作为客户端连别的 MCP 服务器；推荐 Streamable HTTP（2025-11-25）。
- [a2a](/libs/a2a) —— Agent 与 Agent 互通：Agent Card 发现、任务生命周期、SSE 流式、推送通知；JSON-RPC 与 HTTP+JSON 双绑定。
- [acp](/libs/acp) —— 编辑器接入：以子进程 + stdio 被 Zed / opencode 拉起，`session/prompt` 流式回包。
- [uhp](/libs/uhp) —— 常驻 Harness 协议：把「一个能被反复调用的 agent 端点」标准化，自带 opencode 2.x 与 ACP 两个适配器。

## 框架层：组装成产品

协议层给出「怎么说话」，框架层给出「说什么、记住什么、允不允许」。

- [atelier](/libs/atelier) —— 全栈 Harness：Agent 循环 + 工具系统 + 会话树 + 上下文压缩 + 信任闸门，并同时实现 MCP / A2A / ACP / UHP 四端。
- [cordis](/libs/cordis) —— 不绑定 Agent 的通用组合框架：插件独立进程运行，卸载即杀进程，用声明式配置做调和。
- [uhp-server](/libs/uhp-server) —— 把 UHP 协议做成常驻服务的成品，可选把适配器放进 cordis 托管的独立进程。

## 依赖关系

```
llm_api ──▶ atelier
json-rpc ──▶ mcp / a2a / acp / cordis
mcp / a2a / acp / uhp ──▶ atelier
uhp ──▶ uhp-server ◀── cordis
```

链路很短，所以按需拉包就行：只写一个 MCP 服务器，装 `mcp` 一个包即可；要完整 Agent，装 `atelier` 会把协议层一起带进来。

## 接着读

- 不知道选哪个协议：[/guide/protocols](/guide/protocols)
- 想从零搭一个能跑的 Agent：[/guide/agent-stack](/guide/agent-stack)
- 想看这些库拼起来的产品：[/products/](/products/)
