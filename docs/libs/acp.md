# ACP · 编辑器接入

编辑器或 IDE 想把本地 Agent 当成一个子进程来用，需要一个双方都认的 stdio 协议——这就是 ACP（Agent Client Protocol）。`acp` 包同时实现 **Agent 侧**（被 Zed / opencode 拉起）与 **Client 侧**（去连任意 ACP Agent），传输复用 `jsonrpc` 的换行分帧。

## 能力

- **双端**：`AcpAgent`（服务端框架，可双工反向调用 Client）与 `AcpClient`（客户端框架）
- **会话生命周期**：`session/new`、`session/prompt` + `session/update` 流式通知、`session/cancel`
- **可选能力**：`session/close` / `list` / `delete` / `load` / `resume`、`set_mode`、`set_config_option`、`authenticate` / `logout`
- **反向调用**：`session/request_permission`、`terminal/*`、`fs/*`（Agent → Client，双端类型化封装）
- **扩展方法**：`_*` 请求 / 通知双向（`registerExtensionMethod` / `extensionCall` / `onNotification`）
- **Elicitation**：`elicitation/create` · `elicitation/complete`，form / url 双模式 + 能力门控
- **通知类型齐全**：`user_message_chunk`、`agent_message_chunk`、`agent_thought_chunk`、`tool_call`、`tool_call_update`、`plan`、`available_commands_update`、`current_mode_update`、`config_option_update`、`session_info_update`、`usage_update`
- **传输**：`StdioTransport`（Agent 侧绑 stdio）、`SubprocessTransport`（Client 侧 spawn 子进程），`\n` 帧

## 安装

```toml
[dependencies]
  acp = "0.3.0"
```

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
cjpm build
```

## 最小示例

实现一个 ACP Agent：注册提示处理器，`serve()` 阻塞监听 stdin（摘自仓库 README）。

```cangjie
import acp.*
import acp.types.*
import acp.transport.*

main() {
    let agent = AcpAgent(StdioTransport(), "my-agent", "1.0.0")
    agent.setPromptHandler({ ctx =>
        ctx.emit(SessionUpdate.agentMessage("你好！你说了：" + ctx.getText()))
        PromptResponse(StopReasonEndTurn)
    })
    agent.serve()   // 阻塞监听 stdin（ACP Client 通过 stdio 连接）
}
```

从客户端连一个真实 Agent（这里以 `opencode acp` 为例）：

```cangjie
import acp.*
import acp.types.*
import acp.transport.*
import std.collection.ArrayList

main() {
    let client = AcpClient(SubprocessTransport("opencode", args: ["acp"]))

    client.setOnSessionUpdate({ sid, update =>
        // 流式输出
        if (update.sessionUpdate == SessionUpdateAgentMessageChunk) {
            match (update.content) {
                case Some(c) => print(c.text ?? "")
                case None => ()
            }
        }
    })

    client.connect(Implementation("my-client", "1.0.0"), ClientCapabilities())
    let newResp = client.newSession("/path/to/project")  // Result<NewSessionResponse>
    let sessionId = newResp.getOrThrow().sessionId
    let blocks = ArrayList<ContentBlock>()
    blocks.add(ContentBlock.ofText("你好"))
    let resp = client.prompt(sessionId, blocks)  // Result<PromptResponse>，阻塞到回合结束
    println(resp.getOrThrow().stopReason)
}
```

宿主侧接入只要把命令配成这个二进制：Zed 的 `settings.json` 里 `"command": "my-agent"`；opencode 侧把 agent 命令指过来即可。stdout 只输出 ACP 帧，日志走 stderr。

## 相关

- 源码：[https://atomgit.com/ystyle/acp-cj](https://atomgit.com/ystyle/acp-cj)
- 底座：[/libs/json-rpc](/libs/json-rpc)
- 现成的 ACP Agent 实现：[/libs/atelier](/libs/atelier)（`cli.app acp`）
- 用 ACP Agent 当 UHP 适配器：[/libs/uhp](/libs/uhp)（`uhp-acp`）
- 协议选型：[/guide/protocols](/guide/protocols)
