# 协议选型

四套协议不是四选一，它们解决四个方向的连接问题：给 Agent 装工具（MCP）、让 Agent 之间互相调用（A2A）、让编辑器拉起 Agent（ACP）、把远端 harness 统一成端点（UHP）。先看「对面是谁」，再决定拉哪个包。

## 一张表分清

| 协议 | 谁和谁说话 | 解决的问题 | 传输 | 库 |
|---|---|---|---|---|
| MCP | Agent ↔ 工具 / 数据源 | 能力怎么被模型看见和调用 | stdio、Streamable HTTP | [mcp](/libs/mcp) |
| A2A | Agent ↔ Agent | 跨进程、跨组织的任务交接 | JSON-RPC、HTTP+JSON、SSE | [a2a](/libs/a2a) |
| ACP | 编辑器 / 宿主 ↔ Agent 子进程 | 把 Agent 接进别人的产品 | stdio（`\n` 帧） | [acp](/libs/acp) |
| UHP | 客户端 ↔ 远端 harness | 常驻 harness 的调用标准化 | HTTP + SSE | [uhp](/libs/uhp) |
| JSON-RPC | 任意两端 | 消息与请求/响应底座，不绑定语义 | stdio / TCP / Unix / HTTP / WS | [json-rpc](/libs/json-rpc) |

MCP / A2A / ACP 三套都建在 `ystyle::jsonrpc` 上，所以用法形状相似：`Server` 注册 handler、`Client` 发请求、类型实现 `stdx.encoding.json.stream` 的序列化接口。UHP 是例外——它只依赖 stdx，形状是 HTTP 资源模型（`/v1/responses` + SSE），不套 JSON-RPC。

## MCP：给 Agent 装能力

面向「工具与上下文」：工具、资源、提示模板三类原语。有两个方向——把你的能力暴露给任意 MCP 客户端（Claude Desktop、opencode、Cherry Studio），或者给你的 Agent 挂别人的 MCP 服务器（`atelier` 的 `[[mcpServer]]` 就是这么做的）。

```cangjie
let transport = StdioServerTransport()
let server = McpServer("my-server", "1.0.0", transport)

let schema = ToolInputSchema("object", HashMap<String, JsonValue>(), [])
schema.addField("name", "string", "Name to greet", required: true)
server.addTool(Tool("hello", "Say hello", schema), { params =>
    CallToolResult.text("Hello!")
})
server.serve()
```

传输选型：`StdioServerTransport` 最通用；`SessionHttpServerTransport`（协议 2025-11-25）是推荐的服务端形态，opencode / Cherry Studio / Inspector 都能接；`StatelessHttpServerTransport`（2026-07-28 RC）无 session、支持 `subscriptions/listen`；`HttpSseServerTransport`（2024-11-05）已废弃，只为兼容老客户端。

**别用它做的事**：MCP 没有任务状态机、没有 Agent Card、没有跨端任务生命周期。让另一个 Agent 接着干一件长任务，那不是 MCP 的语义。

## A2A：把 Agent 交给别人用

面向「Agent 之间」：`/.well-known/agent-card.json` 发现能力，九个任务状态（含 `INPUT_REQUIRED` / `AUTH_REQUIRED` 中断态），SSE 流式与推送通知，Bearer / API-Key 认证。两种协议绑定共用一个语义层：`JSONRPC`（POST 根路径）与 `HTTP+JSON`（`/message:send` 这类资源路径）。

```cangjie
class MyExecutor <: A2aExecutor {
    public func execute(ctx: RequestContext, queue: EventQueue): Unit {
        queue.status(TaskState.Working)
        let parts = ArrayList<Part>()
        parts.add(Part.ofText("echo: ${ctx.clientText()}"))
        queue.artifact(Artifact("art-${ctx.taskId}", parts), lastChunk: true)
        queue.status(TaskState.Completed)
    }
    public func cancel(ctx: RequestContext, queue: EventQueue): Unit {}
}
```

入口要么 `A2aServer(card, executor).serve("0.0.0.0", 9999)`，要么挂进宿主已有的 HTTP 服务：`server.distributor.register("/a2a", a2aServer.handler())`。

一致性：官方 TCK 最近一轮 175 passed / 0 failed / 90 skipped，**所有可执行的 MUST 全部通过**（跳过的多数是 gRPC 未声明——仓颉 gRPC 生态不成熟，本实现有意不做 gRPC 绑定）。取舍见 [A2A](/libs/a2a)。

## ACP：让编辑器拉起你的 Agent

面向「宿主 ↔ Agent」：Zed、opencode 这类 ACP Client 通过 stdio 拉起你的进程，`session/new` → `session/prompt` → `session/update` 流式回包。反方向还有一组反向调用：`terminal/*`、`fs/*`、`session/request_permission`、`elicitation/create`。

```cangjie
main() {
    let agent = AcpAgent(StdioTransport(), "my-agent", "1.0.0")
    agent.setPromptHandler({ ctx =>
        ctx.emit(SessionUpdate.agentMessage("你好！你说了：" + ctx.getText()))
        PromptResponse(StopReasonEndTurn)
    })
    agent.serve()   // 阻塞监听 stdin（ACP Client 通过 stdio 连接）
}
```

关键差别：ACP 的**生命周期由宿主掌握**（宿主拉起、宿主关会话、宿主决定什么时候问权限）。所以它不适合拿来做对外服务端——那是 A2A 的形状。`atelier` 的 `cli.app acp` 就是把自己伪装成一个 ACP Agent 交给编辑器。

## UHP：把远端 harness 标准化

面向「客户端 ↔ harness」：harness 是自带 session、容器、文件、记忆的执行环境（opencode、dsh、pi 这类）。UHP 把「派一次任务、收事件流、回答审批、拿产物」固定成资源模型，客户端只面对一个 base URL。

单库 `uhp` 是 SDK（协议面 + 服务端骨架 + `HarnessDriver` 接缝），一致性套件 core 41/41 · extended 50/50 · full 104/104。成品是 [UHP Server](/libs/uhp-server)：配置里声明若干 harness（`kind = scripted | opencode | acp`），`GET /v1/harnesses` 列出、`POST /v1/responses` 按 `metadata.harness_id` 派活、SSE 收流。

**别指望它做的事**：UHP 没有 mid-run steer，只能 cancel 或等本轮结束。`atelier` 的远端 UHP 子 Agent 把这条写成了能力事实，不假装支持。

## 怎么组合

真实产品里通常同时用三套，各管一个方向：

| 场景 | 入 | 出 | 横向 |
|---|---|---|---|
| 编辑器里的 Agent | ACP（被拉起） | MCP（调工具） | A2A（找别的 Agent 干活） |
| 常驻助手 | 自己的 UI / IM | MCP | UHP（派给远端 harness）、ACP、A2A |
| 多 harness 网关 | HTTP（自有 API） | — | ACP（拉起 dsh/pi/opencode）+ UHP（对外统一） |

`atelier` 把「子 Agent 在哪里执行」抽象成四种位置，协议就是它们的接线方式：本地子 Agent、ACP 远程子、A2A 远程子（`remote_a2a_subagent`）、UHP 远端子（`remote_uhp_subagent`）。父侧 `subagent_*` 工具不用改，换个执行位置就换个句柄。

## 选型决策

1. 对面是编辑器 / IDE / 别人的 CLI 宿主 → **ACP**。
2. 对面是另一个 Agent 或另一个团队的服务 → **A2A**。
3. 你要让模型能用上某个能力 → **MCP**。
4. 对面是 harness（自带环境），且要统一端点 / 常驻 → **UHP**。
5. 只是两条进程之间要说话，与 Agent 无关 → **JSON-RPC**，不要为了「协议」引入语义层。

## 常见误用

- **用 MCP 做任务交接**：MCP 是工具面，没有任务状态与推送，长任务只能靠客户端自己轮询。
- **用 A2A 传工具**：为了调一个函数就要维护 Agent Card、任务 id、订阅流，成本远高于 MCP。
- **用 ACP 做服务端**：宿主退出即断开，无法长期对外服务。
- **在 UHP 上期待 steer / 中途插话**：协议没有这条路径，取消后重派才是对的用法。
