# 世界树

> Atelier Yggdrasil · 插件化 Agent 宿主平台
>
> **DeepSeek Harness（dsh）的仓颉实现** · 闭源产品<br>
> 本站仅作生态展示，源码未公开。

把 [Atelier](/libs/atelier)（Agent 内核）、[Cordis](/libs/cordis)（插件内核：进程隔离 / 热卸载 / 事件总线）与 cjxt（服务端驱动 UI）融合成一个「everything is a plugin」的宿主平台。

它要回答的问题是：**dsh 那套「一切皆插件」的 harness 形态，能不能整条链换成仓颉。** 形态对齐 dsh——profile 驱动装配、web / run / repl 三入口、跨进程通信走 ACP（JSON-RPC over stdio）；内核全部落在仓颉生态里：Agent 内核是 Atelier，插件内核是 Cordis（cordis-js 的仓颉实现），界面是 cjxt。整条链没有 Node 运行时，也没有 TypeScript。

## 名字

取北欧神话里连接九界的巨树，每个部件对应树的部位：

| 树的部位 | 对应 |
|---|---|
| 主干 | 宿主进程：插件生命周期、事件桥、UI |
| 枝干 | 插件：模型、工具、会话、Agent、面板各成一个进程 |
| 树液 | 事件总线：插件 emit → 宿主路由 → UI 推送 |
| 生长 | profile：一份 TOML 声明要长成什么样，按依赖拓扑装配 |

`harness` 这个词归 `atelier` 自己（Agent Harness），所以本平台的包与类型一律用 `yggdrasil` 前缀——它不是一个更大的 Harness，而是**装 Harness 的宿主**。

## 它解决什么问题

单体 Agent 的边界是进程：想换一个模型适配、想换会话存储、想让某个能力崩了不带走整个服务，只能重启。插件化把每个 seam 拆成独立进程：

- **换组件不改主程序**：Provider、工具表、会话存储都是插件，配置里换一行就换一套。
- **崩一个不塌全部**：插件在独立进程里跑，崩溃能被宿主感知并重启，卸载即杀进程、操作系统回收资源。
- **能力可以第三方提供**：插件只依赖协议与 seam，不依赖宿主的内部类型。

代价是跨进程调用与调试成本，所以它面向的是「要长期跑、要换组件、要多形态装配」的场景，不是单机小工具。

## 架构

```
宿主进程
├── cordis host      插件生命周期 · 进程隔离 · 热卸载 · 崩溃自愈
├── 事件桥           插件事件 → 事件路由表 → UI 推送
└── cjxt UI          聊天页 · 面板页
        │  invoke / emit（子进程 · stdio）
        ▼
插件进程（每个都可单独重启 / 卸载）
├── llm_plugin       Provider seam（模型适配）
├── tools_plugin     工具表 seam
├── session_plugin   会话存储 seam（持久化优先，不可写降级内存）
├── agent_plugin     注入 llm + tools + session，把 atelier 服务化
└── panel_plugin     面板数据 seam（兼容层示例）
```

**四插件依赖拓扑**：`llm → tools → session → agent`。agent 插件声明 `inject = ["llm", "tools", "session"]`，宿主按拓扑先起依赖、再起 agent，依赖不满足时 agent 不会握手成功。

## 关键机制

**profile 驱动装配**。一份 TOML 声明宿主参数与插件清单（`[server]` / `[cli]` / `[[plugins]]`），`loadProfile` 按 `inject` 做依赖拓扑装配。同一套二进制可以长出三种形态：

| 形态 | 跑成什么 |
|---|---|
| web | 带界面的宿主：聊天页 + 面板页 + 事件桥 + 授权弹窗 |
| run | 无界面，单次提问后打印结果 |
| repl | 无界面，逐行交互 |

**远程适配器模式**。agent 插件实现 `atelier` 的 `Provider` / `SessionStore` / `Tool` 接口，内部经 cordis invoke 转发到对应插件——**`atelier` 核心零改动**就完成了服务化。高频内置工具留在 agent 进程内直调，不付跨进程的税。

**流式跨进程**。模型插件一边跑一边 emit 增量事件（按请求 id 路由），agent 侧的远程 Provider 订阅后回灌成 `EventStream`，上层看到的流式接口与进程内完全一致。

**信任闸门跨进程**。Agent 需要用户拍板时 emit 一个提问事件 → 宿主事件桥 → 界面上弹窗 → 用户回答回填给等待中的 Agent。安全边界没有被「拆进程」这件事冲掉。

**多会话运行面**。会话池 + LRU 驱逐 + 固定机制；同一会话并发改为**插话**（steer）而不是两个 loop 抢历史；事件按会话归档，切换会话不丢内容；新增运行状态查询。这是「常驻助手」与「一次性对话」的分水岭。

## 成员构成

| 成员 | 干什么 |
|---|---|
| `yggdrasil_core` | 协议 DTO（聊天 / 模型 / 工具 / 会话 / 提问）+ profile 配置解析 |
| `yggdrasil_host` | 宿主：cordis 宿主 + 事件桥 + cjxt 界面 + 三种入口 |
| `agent_plugin` | 把 atelier 服务化（三个远程适配器 + 提问队列） |
| `llm_plugin` / `tools_plugin` / `session_plugin` | 三个 seam 的实现 |
| `panel_plugin` | 面板数据 seam，也是兼容层的示例 |

## 范围边界

世界树是**通用插件宿主**：提供机制，不绑具体产品形态。插件生命周期、进程隔离、事件总线、协议 seam、多会话运行面在这里；渠道接入、多端投递、隔离部署这类「某个产品才成立」的事情留给产品层。

判据很直接：dsh 自己也没有渠道体系，跨进程通信走 ACP（JSON-RPC over stdio），渠道与部署都由上层决定。把渠道塞进宿主，它就退化成「只服务一个产品的宿主」。

## 当前状态

- **Phase 1–3 已完成**：最小闭环（界面 → 宿主 → agent 插件 → 模型 → 事件流回界面）、seam 拆分（llm / tools / session / agent 四插件拓扑）、对齐 dsh 形态（profile 装配 + web / run / repl 三入口）。
- **多会话运行面已落地**：会话池、插话、按会话归档事件、运行状态查询。
- **Phase 4（cjxt 插件兼容层）规划中**：让页面以接近原生的方式消费插件能力（插件上下文 + 插件信号），消除每页手写事件桥与推送的样板。
- **闭源**：私有项目，未发布中心仓，后续发版口径待定；本站仅作生态展示。

## 相关

- 用到生态里的：[Atelier](/libs/atelier)（Agent 内核）· [Cordis](/libs/cordis)（插件内核）
- 其它产品：[荧的炼金工房](/products/lumine) · [星痕的炼金工房](/products/starline)
