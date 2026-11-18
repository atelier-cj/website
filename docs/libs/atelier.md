# Atelier · Agent Harness

模型只会输出文本。要让它读文件、跑命令、多轮对话、被编辑器拉起来，中间那层脚手架——推理循环、上下文压缩、工具系统、权限判定、会话持久化——就是 Atelier。纯仓颉实现，既能嵌进已有产品，也能直接当产品本体。

## 能力

- **三种形态**：核心库 `atelier`、HTTP 服务库 `server`、终端产品 `cli.app`，共用同一份装配束
- **ACP 兼容**：`cli.app acp` 以 ACP v1 Agent 身份被 Zed / opencode 等宿主拉起（stdio）
- **A2A 双向**：`cli.app a2a` 把 Agent 暴露成 A2A v1 Agent —— JSON-RPC 与 HTTP+JSON 双绑定、SSE 流式、推送通知、Bearer/API Key 认证；反向也能把远端 A2A Agent 接入子 Agent 体系
- **运行时动态**：Agent 在运行时由 TOML 或代码定义，改配置不用重编译
- **多模型**：OpenAI / Anthropic / Ollama 三种 Provider
- **MCP 工具**：通过 `ystyle::mcp` 接入任意 MCP 服务器（stdio / Streamable HTTP）
- **树形会话**：Entry + ParentID 树模型，支持 fork / clone / JSONL 持久化
- **信任闸门**：目录级权限控制，状态为 `Undecided` 时发出结构化审批（允许本次 / 总是允许 / 拒绝）
- **Skill 系统**：按 AgentSkills 规范的声明式技能注入
- **上下文压缩**：dsh 口径阈值 + 超窗恢复 + 工具结果修剪 + 摘要复用主对话前缀（吃 provider 缓存）+ 手动 `/compact`
- **钩子系统**：6 个生命周期钩子（`beforeRun` ~ `afterTool`）
- **Agent-as-Tool**：子 Agent 委派模式，同进程隔离上下文
- **可持续子 Agent**：常驻子 Agent + 双向 `send_message`（汇报 / 提问 / 唤醒取代单向 report）
- **统一提问原语**：审批 / 选择 / 表单收敛成 `UserRequest` → `UserAnswer`，TUI、ACP、AG-UI、HTTP 四端各自接线

## 安装

仓库是 monorepo（一个 cjpm 工作区，三成员 lockstep 同一版本）：`atelier/` 是核心库，`server/` 是 HTTP 服务库，`cli/` 是终端产品。**只有核心库发中心仓**，`cli` / `server` 只在仓库内构建成二进制。

```toml
[dependencies]
atelier = "0.1.15"
```

从源码构建整个工作区：

```bash
git clone https://atomgit.com/ystyle/atelier
cd atelier
cjpm build -j 16          # 产物：target/release/bin/cli.app
```

CLI 的五个入口：

```bash
cli.app serve 8080          # HTTP 服务
cli.app tui                 # 交互式终端
cli.app run "你好"           # 单次执行
cli.app acp                 # 作为 ACP v1 Agent 跑在 stdio
cli.app a2a default 8931    # 作为 A2A v1 Agent 提供服务（[agent] [port]）
```

## 最小示例

零配置：内置工具 + 内存会话 + 环境变量里的 provider（摘自仓库 README）。

```cangjie
import atelier.agent.*

// 零配置：内置工具 + 内存会话 + 环境变量里的 provider
let h = Harness.open()
println(h.run("你好"))
h.close()
```

要换组件就派生装配束 —— 每个组件都是接口，`with*` 只影响这一份：

```cangjie
let spec = HarnessSpec.default()
    .withProvider("default", OpenAIProvider("default", baseUrl, apiKey))  // 换模型服务
    .withStore(StormSessionStore("./sessions"))                           // 换会话存储
    .withTool(SqlTool())                                                  // 加/换工具（同名覆盖）
    .withHook(AuditHook())                                                // 横切钩子
    .withModelContext("deepseek", "deepseek-chat", 65536)                 // 声明端点上的模型窗口
    // askFn：(UserRequest) -> UserAnswer —— 审批/选择/表单的宿主侧入口。
    // 不挂 = 没有提问通道：需要用户拍板的地方按「取消」处理（等同拒绝）
    .withAsk({ req => myApprovalUi(req) })

let h = Harness.open(spec)
```

需要会话 id、事件流、取消、子 Agent 时，从同一份装配束下钻到运行时（没有第二套配置）：

```cangjie
let runtime = AgentRuntime(spec, cfg)          // cfg: AgentConfig
let stream = runtime.chatWithSessionId(sid, msgs, env)
for (event in stream) { ... }
runtime.cancelSession(sid)
```

## 相关

- 源码：[https://atomgit.com/ystyle/atelier](https://atomgit.com/ystyle/atelier)
- 它依赖的协议层：[/libs/mcp](/libs/mcp)、[/libs/a2a](/libs/a2a)、[/libs/acp](/libs/acp)、[/libs/uhp](/libs/uhp)
- 它依赖的模型封装：[/libs/llm-api](/libs/llm-api)
- 用 Atelier 做的产品：[/products/](/products/)
- 从零搭一个 Agent 的走法：[/guide/agent-stack](/guide/agent-stack)
