# 搭建一个 Agent

从一条模型调用走到一个能干活、能记住会话、能被外部拉起的 Agent。每一层都能单独用，也都可被替换——按需停在任何一层。代码与签名取自仓库 README 与 `docs/`。

## 第 0 层：直接调模型（`llm_api`）

只需要「发一次请求、收流式增量」时到这一层就够，不必引入 Agent 概念。

```toml
[dependencies]
llm_api = "1.4.2"
```

```cangjie
import llm_api.*
import std.collection.*

main() {
    let provider = OpenAIProvider("deepseek", "https://api.deepseek.com", "sk-xxx")
    let msgs = ArrayList<Message>()
    msgs.add(UserMessage(ContentList.ofText("用一句话介绍仓颉"), 0))
    let req = ChatRequest("deepseek-chat", msgs, 0.7, 1024, None, ArrayList<OpenAITool>())
    let resp = provider.chat(req)
    for (block in resp.message.content.blocks()) {
        match (block) {
            case ContentBlock.TextBlock(t) => println(t)
            case _ => ()
        }
    }
}
```

流式换成 `provider.chatStreaming(req)`，得到 `EventStream<ChatDelta, AssistantMessage>`。三种 Provider 接口一致，换服务只换构造。见 [LLM API](/libs/llm-api)。

## 第 1 层：把模型变成 Agent（零配置）

Agent 与「一次模型调用」的差别在循环：调工具、看结果、再决定下一步；上下文会涨所以要压缩；会话要能存能取。这些由 `atelier` 提供。

```toml
[dependencies]
atelier = "0.1.15"
```

```cangjie
import atelier.agent.*

main() {
    let h = Harness.open()          // 内置工具 + 内存会话 + 环境变量里的 provider
    println(h.run("你好"))
    h.close()
}
```

`Harness.open()` 即 `Harness.open(HarnessSpec.default())`：注册内置工具（`bash` / `read_file` / `write_file` / `edit_file` / `grep` / `glob` / `todo` / `ask_user`）、给一个内存会话存储、在环境里有 `OPENAI_API_KEY` 时挂一个名为 `default` 的 Provider（`OPENAI_BASE_URL` 缺省 `https://api.openai.com/v1`）。

```bash
export OPENAI_API_KEY="sk-xxx"
export OPENAI_BASE_URL="https://api.deepseek.com"
```

## 第 2 层：换掉不该默认的组件（装配束）

换模型服务、会话存储、工具、钩子，都通过派生**装配束**（`HarnessSpec`）完成。`with*` 是值语义，只影响这一份，不写穿共享组件：

```cangjie
import atelier.agent.*
import atelier.provider.*   // OpenAIProvider 等
import atelier.session.*    // StormSessionStore

main() {
    let spec = HarnessSpec.default()
        .withProvider("default", OpenAIProvider("default", baseUrl, apiKey))  // 换模型服务
        .withStore(StormSessionStore("./sessions"))                           // 换会话存储
        .withTool(SqlTool())                                                  // 加/换工具（同名覆盖）
        .withHook(AuditHook())                                                // 横切钩子
        .withModelContext("deepseek", "deepseek-chat", 65536)                 // 声明端点上的模型窗口
        // askFn：(UserRequest) -> UserAnswer。不挂 = 没有提问通道，
        // 需要用户拍板的地方按「取消」处理（等同拒绝）
        .withAsk({ req => myApprovalUi(req) })

    let h = Harness.open(spec)
}
```

上下文窗口属于 `(provider, model)` 这一对（同名模型走官方端点和走截断过的代理可以不同），所以声明在 provider 下。`AgentConfig.provider` 找不到 provider 会明确报错，不会静默退化。

## 第 3 层：写自己的工具

工具是 Agent 与业务之间唯一的接口：

```cangjie
interface Tool {
    func name(): String
    func description(): String
    func schema(): JsonValue
    func execute(ctx: ToolContext, args: JsonValue): ToolResult
    func executionMode(): ToolExecutionMode
}
```

- `schema()` 用 `SchemaBuilder().addString("city", "城市名称", required: true).build()` 这类构造器拼 JSON Schema。
- `execute` 返回 `ToolResult(text, details, isError, terminate)`；参数缺就用 `isError = true` 返回，不要抛异常。
- `executionMode` 决定并发语义：只读工具报 `Parallel`，有副作用（写文件、执行命令）必须 `Sequential`。

注册是 `reg.register(WeatherTool())` 或 `.withTool(...)`，但**工具名还要出现在 agent 的 `tools` 列表里**才会被模型看见。完整自定义工具示例见 [Atelier](/libs/atelier)。

## 第 4 层：会话与事件流

需要会话 id、逐事件展示、取消时，从同一个装配束下钻到运行时，没有第二套配置（import 同上）：

```cangjie
main() {
    let runtime = AgentRuntime(HarnessSpec.default(), AgentConfig.default())
    let msgs = ArrayList<Message>()
    msgs.add(UserMessage(ContentList.ofText("列出当前目录"), 0))

    let stream = runtime.chatWithSessionId("sess-1", msgs, SessionEnvironment())
    for (event in stream) {
        match (event) {
            case u: MessageUpdateEvent => print(u.delta)
            case _: AgentEndEvent => println("\n--- 完成 ---")
            case _ => ()
        }
    }
    let result = stream.result()
}
```

`AgentRuntime` 是**无状态**的：历史从入参 `messages` 读，落盘交给 `SessionStore`，所以全局一个就够，隔离靠 `sessionId` + store。压缩会改写历史，落库要整份重写（`store.save`），不能追加。

## 接 MCP 与对外入口

MCP 工具不用写代码，配置里列出来即可（经 `ystyle::mcp` 接入，stdio 与 Streamable HTTP 都支持）：

```toml
[[mcpServer]]
name = "playwright"
transport = "stdio"
command = "npx @playwright/mcp"
```

同一份装配束换启动方式就能对外：

```bash
cli.app tui                          # 交互式终端
cli.app run "你好，介绍一下你自己"    # 单次对话
cli.app serve 8080                   # HTTP 服务 + OpenAI 兼容 API
cli.app acp                          # 作为 ACP v1 Agent 被 Zed/opencode 拉起（stdio）
cli.app a2a default 8931             # 作为 A2A v1 Agent 对外提供（HTTP）
```

`serve` 与 `a2a` 可共用端口（`[a2a].mountToServer = true`）。四种入口怎么选见[协议选型](/guide/protocols)。

## 什么时候不该继续往上写

只要一个能反复调用的 harness 端点、且挂在多个 harness 后面 → [UHP Server](/libs/uhp-server)；要插件独立进程与崩溃自愈 → [Cordis](/libs/cordis)；只做一个 MCP 服务器给别人用 → 直接看 [MCP](/libs/mcp)，不必引入 Harness。
