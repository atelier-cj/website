# LLM API · 模型封装

OpenAI 兼容端点、Anthropic、Ollama 的请求体与流式事件各不相同，直接写 HTTP 会把差异漏进业务代码。`llm_api` 把它们收敛成同一套接口：一个 `Provider`、两种调用方式（同步 / 流式）、一种消息模型。

## 能力

- **统一接口**：同步 `chat()` 与流式 `chatStreaming()` 两套 API
- **三种内置 Provider**：OpenAI 兼容（`/chat/completions`）、Anthropic（`/v1/messages`）、Ollama（`/api/chat`）
- **消息模型**：User / Assistant / ToolResult / Compaction / Archive 五种角色
- **工具调用**：function calling 与 tool use 的发起、增量合并、结果回传
- **推理内容**：透传 reasoning content / thinking 增量（`ChatDelta.reasoningDelta`），开启思考模式只需 `reasoningEffort`
- **多模态图片**：`ImageBlock(data, mime[, detail])` / `ImageFileBlock(file_id)` 随 user 消息发送，自动适配三家协议
- **流式事件**：`EventStream<T, R>` 提供 emit / receive / result / error 语义
- **Provider 注册表**：工厂注册 + 按配置创建，便于多服务管理
- **参数透传**：`extra` 字段直达请求体（固定字段优先）
- **可配置**：自定义 headers、`readTimeout`（默认 300s）、连接级重试次数、是否复用连接、`skipTlsVerify`
- **不信任服务端 keep-alive**：默认每请求带 `Connection: close`，连接级失败换新连接重试一次

## 安装

```toml
[dependencies]
  llm_api = "1.4.2"
```

`jsonvalue` 作为传递依赖自动引入，无需手动添加。

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
cjpm build
```

## 最小示例

同步对话（摘自仓库 README）：

```cangjie
import llm_api.*
import std.collection.*

func main() {
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

流式对话：`receive` 逐增量取，`result()` 拿最终消息。

```cangjie
func main() {
    let provider = OpenAIProvider("deepseek", "https://api.deepseek.com", "sk-xxx")
    let msgs = ArrayList<Message>()
    msgs.add(UserMessage(ContentList.ofText("数到 5"), 0))
    let req = ChatRequest("deepseek-chat", msgs, 0.7, 1024, None, ArrayList<OpenAITool>())

    let stream = provider.chatStreaming(req)
    while (true) {
        match (stream.receive(30 * Duration.second)) {
            case Some(delta) =>
                print(delta.delta)
                match (delta.finishReason) {
                    case Some(_) => break
                    case None => ()
                }
            case None => break
        }
    }
    let result = stream.result()
}
```

注册表管理多个服务：

```cangjie
func main() {
    let reg = ProviderRegistry.default()
    let cfg = ProviderConfig("openai", "main", "https://api.deepseek.com",
        "sk-xxx", ArrayList<String>(), HashMap<String, JsonValue>())
    let provider = reg.create(cfg)       // 按 type 查找工厂创建
    reg.register("default", provider)    // 或直接注册实例
}
```

## 相关

- 源码：[https://atomgit.com/ystyle/llm-api](https://atomgit.com/ystyle/llm-api)
- 在 Agent 里用它做模型层：[/libs/atelier](/libs/atelier)
- 返回库索引：[/libs/](/libs/)
- 从零搭 Agent 栈：[/guide/agent-stack](/guide/agent-stack)
