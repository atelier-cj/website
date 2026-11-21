---
pageClass: atelier-docs
---

# Atelier 完整文档

[Atelier](/libs/atelier) 的文档跟着代码走，正文不在这个站上——这一页是导航：按「想解决什么」分组，点进去就是仓库里的最新版本，不会出现站上抄了一份、仓里改过没同步的情况。

> 主仓 [atomgit.com/ystyle/atelier](https://atomgit.com/ystyle/atelier) · 镜像 [github.com/atelier-cj/atelier](https://github.com/atelier-cj/atelier)
> 文档在仓库的 `docs/` 目录下，随业务代码同版本演进。

## 入门

| 文档 | 讲什么 |
|---|---|
| [集成指南](https://atomgit.com/ystyle/atelier/blob/master/docs/integration.md) | 六种嵌入场景（库 / HTTP 挂载 / 独立服务 / CLI / Docker / 自建应用）、快速装配（`Harness.open` / `HarnessSpec`）、ACP 子进程与 A2A 网络侧两种对外形态 |
| [配置参考](https://atomgit.com/ystyle/atelier/blob/master/docs/configuration.md) | `~/.atelier.toml` 的全部字段与 `AgentConfig` |

## 核心概念

| 文档 | 讲什么 |
|---|---|
| [消息模型](https://atomgit.com/ystyle/atelier/blob/master/docs/messages.md) | `Message` 密封接口、4 种角色、`ContentBlock` |
| [事件流](https://atomgit.com/ystyle/atelier/blob/master/docs/events.md) | 14 种 `AgentEvent`（含 Suspend 挂起）与 `EventStream` 的消费方式 |
| [工具](https://atomgit.com/ystyle/atelier/blob/master/docs/tools.md) | `Tool` 接口、内置工具、自定义工具、MCP 接入、Agent-as-Tool |
| [Provider](https://atomgit.com/ystyle/atelier/blob/master/docs/providers.md) | `Provider` 接口、OpenAI / Anthropic / Ollama 适配、上下文窗口怎么声明 |
| [Hook](https://atomgit.com/ystyle/atelier/blob/master/docs/hooks.md) | 决策型拦截器：6 个相位观察 / 改写 / 短路 Agent 生命周期 |
| [SDK 可替换点](https://atomgit.com/ystyle/atelier/blob/master/docs/extensibility.md) | 换掉整套策略：信任判定、上下文压缩、Agent 循环 |

## 进阶功能

| 文档 | 讲什么 |
|---|---|
| [会话管理](https://atomgit.com/ystyle/atelier/blob/master/docs/sessions.md) | 树形数据模型（Entry + ParentID）、bstorm 持久化、fork / clone、导出 |
| [信任闸门](https://atomgit.com/ystyle/atelier/blob/master/docs/trust.md) | 三态权限、目录继承、结构化审批提问 |
| [Skill](https://atomgit.com/ystyle/atelier/blob/master/docs/skills.md) | AgentSkills 规范的声明式技能注入 |
| [子 Agent](https://atomgit.com/ystyle/atelier/blob/master/docs/subagents.md) | 可持续子 Agent：双向 `send_message`、父端调度工具 |

## 接口参考

| 文档 | 讲什么 |
|---|---|
| [HTTP API](https://atomgit.com/ystyle/atelier/blob/master/docs/http-api.md) | 全部端点与 curl 示例 |
| [CLI](https://atomgit.com/ystyle/atelier/blob/master/docs/cli.md) | `serve` / `tui` / `run` / `acp` / `a2a` 子命令与斜杠命令 |
| [ACP 接入](https://atomgit.com/ystyle/atelier/blob/master/docs/acp.md) | ACP v1 Agent 侧：能力矩阵、elicitation 表单提问、Session Config Options |
| [A2A 接入](https://atomgit.com/ystyle/atelier/blob/master/docs/a2a.md) | A2A v1 双向：服务端能力矩阵、流式产物语义、反向提问、远端子 Agent、部署 |

## 架构

| 文档 | 讲什么 |
|---|---|
| [架构设计](https://atomgit.com/ystyle/atelier/blob/master/docs/design.md) | 总体设计、模块依赖、路线图 |

## 相关

- 回 [Atelier 概览](/libs/atelier)
- 只想跑起来：先看 [搭建一个 Agent](/guide/agent-stack)
- 选协议：看 [协议选型](/guide/protocols)
