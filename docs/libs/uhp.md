# UHP · 常驻 Harness 协议

A2A 管一次任务的分发，ACP 管一个子进程的生命周期，而 UHP（Unified Harness Protocol）管的是「一个 agent 作为常驻服务被反复调用」：会话、回合、事件流、文件与产物、两轮问答、取消，全都落在同一个 HTTP 端点上。`uhp` 是这个协议的仓颉 SDK —— 协议类型层 + 客户端 + 服务端骨架。

## 能力

- **完整协议面**：类型 / 序列化、错误模型、能力门控、SSE 事件、任务状态机
- **官方一致性套件三档全过**：core 41/41 · extended 50/50 · full 104/104（CONFORMANT）
- **HarnessDriver SPI**：SDK 与 agent 之间唯一的接缝，实现 5 个方法就能接入任意 agent
- **开箱即用适配器**：`uhp-opencode`（opencode 2.x，HTTP + SSE）与 `uhp-acp`（任何 ACP agent：dsh / pi / claude-code，stdio JSON-RPC）
- **双端**：`UhpClient` 消费远端端点，`UhpHttpServer` + `Engine` 提供端点
- **宿主生命周期（可选）**：`HarnessLifecycle`、`addHarness` / `removeHarness` / `releaseSession`，用于持有子进程或长连接的 driver
- **纯仓颉**：只依赖 stdx，无第三方依赖

### 成员

| 成员 | 包名 | 说明 |
|---|---|---|
| `uhp/` | `uhp` | SDK：客户端 + 服务端骨架 + `HarnessDriver` 接缝 |
| `uhp-opencode/` | `uhp_opencode` | opencode 2.x 适配器（HTTP + SSE） |
| `uhp-acp/` | `uhp_acp` | ACP 通用适配器（stdio JSON-RPC） |

## 安装

三个成员 lockstep 同一版本，按需拉：

```toml
[dependencies]
  "uhp" = "0.1.1"

  # 要直接接 opencode 2.x 或 ACP agent 时再加
  # "uhp_opencode" = "0.1.1"
  # "uhp_acp" = "0.1.1"
```

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
bash scripts/build.sh   # 构建三个成员
```

## 最小示例

起一个服务端（摘自 SDK 使用教程）：注册一个 `scripted` harness，它不接模型，用来验证协议链路。

```cangjie
import std.collection.HashMap
import stdx.net.http.*
import uhp.server.*
import uhp.types.generated.*

main() {
    let driver = ScriptedHarness([ScriptStep.Text("hello")], TurnOutcome.Completed(None))
    let harness = ConfiguredHarness("chrn_1", "Scripted", "scripted", "scripted-model", driver)
    let engine = Engine([harness])

    let tokens = HashMap<String, String>()
    tokens["dev-token"] = "alice"
    let uhp = UhpHttpServer(engine, Authenticator(tokens))
    let server = ServerBuilder().addr("127.0.0.1").port(8471)
        .distributor(uhp.distributor()).build()
    server.serve()
}
```

`GET /v1/uhp` 免鉴权（用于发现与版本协商），其余请求带 `Authorization: Bearer <token>`。

写自己的 driver —— SDK 负责「说得对、答得对」，driver 负责「干得好」：

```cangjie
class MyDriver <: HarnessDriver {
    public func base(): String { "my-agent" }
    public func baseLabel(): String { "My Agent" }
    public func models(): Array<Model> { [] }
    public func capabilities(): HarnessCapabilities { HarnessCapabilities(false, false) }

    public func run(ctx: TurnContext, sink: TurnSink, cancel: CancelToken): TurnOutcome {
        // 把 agent 的输出翻译成 sink 调用：
        sink.textDelta("thinking...")
        let callId = sink.toolCall("shell", "{\"command\":\"ls\"}")
        sink.toolResult(callId, "file.txt")
        // 需要人确认时：sink.ask(...) 后返回 Incomplete(InputRequired)，答案在下一轮 ctx.answers
        TurnOutcome.Completed(None)
    }
}
```

客户端侧：

```cangjie
import uhp.client.*
import uhp.transport.*
import uhp.types.generated.*

main() {
    let client = UhpClient("http://127.0.0.1:8471", "dev-token",
        StdHttpTransport("http://127.0.0.1:8471"))
    client.discover()

    let req = CreateResponseRequest()
    req.input = "\"hello\""
    let resp = client.createTask(req)          // 非流式，阻塞到终态
    let stream = client.createTaskStream(req)  // 流式：SSE 事件 + 终态
}
```

## 相关

- 源码：[https://atomgit.com/ystyle/uhp](https://atomgit.com/ystyle/uhp)
- 服务端成品（多 harness 一个端点、TOML 配置、Docker）：[/libs/uhp-server](/libs/uhp-server)
- ACP 适配器依赖的协议层：[/libs/acp](/libs/acp)
- 另一种把 Agent 挂上网的方式：[/libs/a2a](/libs/a2a)
- 协议选型：[/guide/protocols](/guide/protocols)
