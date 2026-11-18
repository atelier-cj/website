# JSON-RPC · 传输底座

协议层的四个库（MCP / A2A / ACP / Cordis）都要在同一件事上达成一致：消息怎么编、帧怎么切、请求和响应怎么配对。`ystyle::jsonrpc` 就是这层底座——纯 JSON-RPC 2.0，不带任何协议语义，上层自己定义方法名与参数。

## 能力

- **消息层完整**：`Request` / `Response` / `Notification` / `JsonRpcError` 均实现序列化接口，`parseMessage` 支持批处理分类
- **两种分帧**：`ContentLengthFraming`（默认，LSP 标准）与 `NewlineFraming`（换行，ACP / 管道场景）
- **五种传输**：stdio、TCP、Unix Socket、HTTP POST、WebSocket，另有 `Transport` 接口可自定义
- **双向 RPC（双工）**：同一连接两端都能主动发请求 / 通知并回复对方，服务端有 `request<T, R>` 与 `notify`
- **处理器三档**：`register`（同步）、`registerAsync`（handler 内 spawn 后 `complete` 回包）、`registerAsyncErr`（带错误回调）
- **中间件**：`use(middleware)` 洋葱模型，可在 handler 前后插逻辑
- **类型化调用**：`call<T, R>(method, params, timeout)` 返回 `Result<R>`
- **服务端复用**：`copyHandlersFrom` / `copyMiddlewaresFrom`，便于多连接共用一套注册表

### 传输层包

| 包 | 类 | 用途 |
|---|---|---|
| `ystyle::jsonrpc_stdio` | `StdioTransport` | LSP、进程管道 |
| `ystyle::jsonrpc_tcp` | `TcpClientTransport` / `TcpServerTransport` | 网络服务 |
| `ystyle::jsonrpc_unix` | `UnixClientTransport` / `UnixServerTransport` | 本地高性能通信 |
| `ystyle::jsonrpc_http` | `HttpClientTransport` / `HttpRpcHandler` | HTTP POST 短连接 |
| `ystyle::jsonrpc_websocket` | `WebSocketClientTransport` / `WebSocketServerHandler` | WebSocket 长连接 |

## 安装

```toml
[dependencies]
  "ystyle::jsonrpc" = "0.7.9"
  # 按需选择传输层
  "ystyle::jsonrpc_stdio" = "0.7.9"
```

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
cjpm build
```

## 最小示例

服务端（stdio，摘自仓库 README）：

```cangjie
import ystyle::jsonrpc.*
import ystyle::jsonrpc_stdio.*

main() {
    let transport = StdioTransport()
    let server = JsonRpcServer(transport)

    server.register("echo", { ctx =>
        HandlerResult.ok(ctx.getRawParams() ?? JsonValue.Null)
    })

    server.start()
}
```

客户端：

```cangjie
import ystyle::jsonrpc.*
import ystyle::jsonrpc_stdio.*

main() {
    let transport = StdioTransport()
    let client = JsonRpcClient(transport)
    client.start()

    let result = client.call<JsonValue, JsonValue>("echo",
        params: Some(JsonValue.Map(HashMap<String, JsonValue>())))
    match (result) {
        case Ok(v) => println(v.stringify())
        case Err(e) => println("错误: ${e}")
    }

    client.close()
}
```

要双向就两端都注册处理器：JSON-RPC 2.0 本身是对等模型，服务端也能主动发请求。

```cangjie
// ── 对等端 A：注册本地服务 + 处理对端请求 + 订阅通知
let a = JsonRpcClient(StdioTransport())
a.registerRequestHandler("ping", { req => Some(JsonValue.Bool(true)) })
a.setNotificationCallback({ notif => println("A got notify: ${notif.method}") })
a.start()

// ── 对等端 B：注册本地服务，并主动向 A 发请求 / 通知
let b = JsonRpcServer(StdioTransport())
b.register("echo", { ctx => HandlerResult.ok(ctx.getRawParams() ?? JsonValue.Null) })
b.start()

// 服务端主动发起请求（B → A）
let r = b.request<JsonValue, JsonValue>("ping", params: None)
```

换成 TCP / Unix Socket，只需要把 `StdioTransport()` 换成对应传输层的 `*Transport`，其余代码不变。

## 相关

- 源码：[https://atomgit.com/ystyle/json-rpc](https://atomgit.com/ystyle/json-rpc)
- 依赖它的上层：[/libs/mcp](/libs/mcp)、[/libs/a2a](/libs/a2a)、[/libs/acp](/libs/acp)、[/libs/cordis](/libs/cordis)
- 返回库索引：[/libs/](/libs/)
