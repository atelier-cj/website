# MCP · 模型上下文协议

模型要调用外部工具，得先知道有什么工具、参数长什么样、结果怎么读——MCP（Model Context Protocol）把这套约定标准化。`mcp` 包同时提供**服务端**（暴露工具 / 资源 / 提示词）与**客户端**（连别人的 MCP 服务器），基于 `ystyle::jsonrpc` 分层实现。

## 能力

- **双端完整**：`McpServer` 注册工具、资源、提示模板；`McpClient` 连接、握手、列举与调用
- **四种传输**：stdio、Session Streamable HTTP、Stateless Streamable HTTP、HTTP+SSE（已废弃，仅兼容老客户端）
- **协议版本**：最新 `2026-07-28`（无 session，支持 `subscriptions/listen`）、推荐 `2025-11-25`（带 session，支持 opencode / Cherry Studio / Inspector）
- **协议方法**：`initialize` / `ping`、`tools/*`、`resources/*`（含模板）、`prompts/*` 全覆盖
- **双向通知**：`notifications/cancelled`、`notifications/progress`、`*/list_changed`、`notifications/message`（日志）
- **并发安全**：HTTP 服务端按 JSON-RPC `id` 路由响应，同一 `id` 多请求 FIFO 配对；等待超 `requestTimeout`（默认 5 分钟）返回带原 `id` 的 `-32001` 错误
- **请求级 SSE**：stateless 传输下每条流带独立身份 token，收尾只摘自己
- **Header 校验**：`MCP-Protocol-Version` / `Mcp-Method` / `Mcp-Name`（stateless 传输）

## 安装

```toml
[dependencies]
  mcp = "2.4.0"
```

```bash
eval "$(cjvs stdx-env zsh)"   # 设置 stdx 环境变量
cjpm build
```

## 最小示例

服务端：注册一个 `hello` 工具（摘自仓库 README）。

```cangjie
package mcp.examples.basic

import jsonvalue.*
import mcp.*
import mcp.transport.*
import std.collection.HashMap

main() {
    let transport = StdioServerTransport()
    let server = McpServer("my-server", "1.0.0", transport)

    let schema = ToolInputSchema("object", HashMap<String, JsonValue>(), [])
    schema.addField("name", "string", "Name to greet", required: true)

    let tool = Tool("hello", "Say hello", schema)
    server.addTool(tool, { params =>
        let name = match (params.arguments.get("name")) {
            case Some(JsonValue.String(n)) => n
            case _ => "World"
        }
        CallToolResult.text("Hello, ${name}!")
    })

    server.serve()
}
```

客户端：连接、握手、调用工具。

```cangjie
let transport = StdioServerTransport()
let client = McpClient(transport)

let info = Implementation("my-client", "1.0.0")
match (client.connect(info)) {
    case Result.Ok(init) =>
        println("Connected: ${init.serverInfo.name}")
    case Result.Err(e) =>
        println("Failed: ${e}")
}

// 调用工具
let args = HashMap<String, JsonValue>()
args.add("name", JsonValue.String("World"))
match (client.callTool("hello", arguments: args)) {
    case Result.Ok(r) => // handle result
    case Result.Err(e) => println("Error: ${e}")
}

client.close()
```

要走 HTTP，把传输换成 Streamable HTTP（2025-11-25，推荐）并挂到既有 `stdx.net.http` 服务上：

```cangjie
import stdx.net.http.*

let httpServer = ServerBuilder()
    .addr("127.0.0.1").port(8080).build()

let transport = SessionHttpServerTransport()
transport.registerRoutes(httpServer.distributor)

let server = McpServer("my-server", "1.0.0", transport)
// ... 注册工具、资源等 ...
server.start()
httpServer.serve()
```

客户端侧对应 `McpClient(SessionHttpClientTransport("http://127.0.0.1:8080"))`。

## 相关

- 源码：[https://atomgit.com/ystyle/mcp-cj](https://atomgit.com/ystyle/mcp-cj)
- 底座：[/libs/json-rpc](/libs/json-rpc)
- 在 Agent 里使用 MCP 工具：[/libs/atelier](/libs/atelier)
- 协议选型对比：[/guide/protocols](/guide/protocols)
