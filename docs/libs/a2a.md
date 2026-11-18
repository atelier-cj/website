# A2A · Agent 互联

A2A（Agent2Agent）解决的是「两个 Agent 怎么互相派活」：谁能被调用、任务进行到哪、产物在哪、中断了怎么续。`a2a` 包把任意 Agent 暴露成 A2A v1.0 兼容的远端 Agent，也提供客户端去发现和驱动别人的 Agent。

## 能力

- **协议版本**：A2A v1.0（`A2A-Version: 1.x`）
- **双绑定**：`JSONRPC`（POST 根路径）与 `HTTP+JSON`（`/message:send` 等资源路径），绑定层只做编解码，语义统一收敛到 `RequestHandler`
- **方法**：`SendMessage` · `SendStreamingMessage` · `GetTask` · `ListTasks` · `CancelTask` · `SubscribeToTask` · `GetExtendedAgentCard` · 4 个 `TaskPushNotificationConfig`
- **流式**：SSE（`text/event-stream`），任务快照 → 状态 / 产物更新 → 终态关流；多订阅者按序广播，关一条不影响其它
- **任务状态**：全部 9 个 `TaskState`，终态 `COMPLETED` / `FAILED` / `CANCELED` / `REJECTED`，中断态 `INPUT_REQUIRED` / `AUTH_REQUIRED`
- **错误模型**：`google.rpc.ErrorInfo` 载体；JSON-RPC `-32001..-32009`；HTTP+JSON 用 AIP-193 错误体
- **发现**：`/.well-known/agent-card.json`，带 `ETag` / `Last-Modified` / `Cache-Control` 条件请求
- **认证**：`Bearer` 或 `API-Key`（静态 token 表、恒定时间比较），公共卡匿名可读
- **扩展协商**：`A2A-Extensions` 头；`required: true` 的扩展未声明时返回 `-32008`
- **不做 gRPC**：仓颉 gRPC 生态尚不成熟，不声明即不会被要求（代价是与「只提供 gRPC」的对端无法互通）

## 安装

```toml
[dependencies]
  "a2a" = "0.1.1"
```

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
cjpm build
```

## 最小示例

服务端：实现一个 executor，把任务状态推进写进 `EventQueue`（摘自仓库 README）。

```cangjie
import a2a.*

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

main() {
    let card = buildAgentCard("my-agent", "描述", "1.0.0",
        "http://localhost:9999",
        bindings: ArrayList<String>([BindingJsonRpc, BindingHttpJson]),
        streaming: true)
    A2aServer(card, MyExecutor(), options: ServerOptions.of(streaming: true))
        .serve("0.0.0.0", 9999)
}
```

已有 HTTP 服务时，不必另起端口：

```cangjie
server.distributor.register("/a2a", a2aServer.handler())
```

客户端：发现卡片 → 发消息 → 消费 SSE。

```cangjie
import a2a.*

let card = A2aClient.discover("http://localhost:9999")
let client = A2aClient(card)
let resp = client.sendMessage(SendMessageRequest(Message.user("m-1", "你好")))
client.sendStreamingMessage(SendMessageRequest(Message.user("m-2", "讲个故事"))) { ev =>
    match (ev.statusUpdate) {
        case Some(s) => println(s.status.state)
        case None => ()
    }
    true
}
```

## 相关

- 源码：[https://atomgit.com/ystyle/a2a-cj](https://atomgit.com/ystyle/a2a-cj)
- 底座：[/libs/json-rpc](/libs/json-rpc)
- 把 Agent 直接暴露成 A2A 端点：[/libs/atelier](/libs/atelier)（`cli.app a2a`）
- 另外两种接入方式：[/libs/mcp](/libs/mcp)、[/libs/acp](/libs/acp)
- 协议选型：[/guide/protocols](/guide/protocols)
