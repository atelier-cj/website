# UHP Server · 常驻服务

常驻助手这类客户端不想知道后端跑的是 opencode、dsh 还是 pi，只想面对一个 base URL。UHP Server 就是把多个 harness 统一暴露成一个 UHP 端点的常驻服务：`GET /v1/harnesses` 看有哪些 harness，`POST /v1/responses` 按 `metadata.harness_id` 派任务，SSE 收流，两轮问答回答审批。

## 能力

- **一个端点多个 harness**：`Engine` 里注册 N 个 harness，协议面按 `harness_id` 路由；适配器可选 `scripted`（自检，不接模型）/ `opencode`（opencode serve 的 HTTP API）/ `acp`（任何 ACP agent）
- **配置即部署清单**：一份 TOML 声明 token 与 harness，启动时严格校验（未知 kind / 缺字段 / 重复 id 直接失败）
- **完整 UHP 协议面**：响应 / 会话 / 事件流 / 取消 / 文件与产物 / 记忆由 SDK 提供，Conformance `full`
- **适配器可进程隔离**：`isolate = true` 时适配器跑在独立插件进程里（cordis-cj 托管），一个 harness 崩了只丢这一路
- **单二进制**：仓颉运行时静态链入，运行镜像只需 glibc + libstdc++
- **无模型也能自检**：`kind = "scripted"` 的 harness 让部署验证不依赖任何凭据
- **自己写适配器不改本仓**：实现一个几十行的插件进程，写进配置就能和其它 harness 一起跑

## 安装

本仓是**产品，不发中心仓**（当前 `cjpm.toml` 版本 `0.1.0`）。从源码构建：

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
cjpm build -j 8
cp config/uhp-server.example.toml uhp-server.toml   # 改端口 / token / harness
./target/release/bin/uhp_server --config uhp-server.toml
```

或者用发布镜像：

```bash
docker pull ghcr.io/ystyle/uhp-server:latest
docker run --rm -p 8488:8488 \
  -v "$PWD/uhp-server.toml:/app/uhp-server.toml:ro" \
  ghcr.io/ystyle/uhp-server:latest
```

配置的最小骨架（harness 段摘自仓库 `config/uhp-server.example.toml`）：

```toml
[server]
bind = "127.0.0.1"
port = 8488

[[tokens]]
token = "dev-token"
principal = "my-client"

# 自检用：不接模型，固定文本返回
[[harnesses]]
id = "echo"
name = "echo（自检用）"
kind = "scripted"
default_model = "auto"
reply = "hello from uhp-server"

# 任何 ACP agent（dsh / pi / opencode acp …）
[[harnesses]]
id = "dsh"
name = "DSH"
kind = "acp"
default_model = "auto"
command = "dsh"
args = ["--profile", "acp"]
cwd = "/work/ws"
session_mode = "parallel"
timeout_seconds = 600
permission_timeout_seconds = 600
```

## 最小示例

本仓是二进制服务、不提供库 API，所以示例是「起服务 + 调用」两条命令（摘自仓库 README）。部署验证用 scripted harness，不需要任何模型凭据：

```bash
# discovery（免鉴权）
curl -s http://127.0.0.1:8488/v1/uhp

# 有哪些 harness
curl -s -H 'Authorization: Bearer dev-token' \
  http://127.0.0.1:8488/v1/harnesses

# 派一个任务
curl -s -H 'Authorization: Bearer dev-token' \
  -H 'UHP-Version: 2026-10-19' \
  -H 'Content-Type: application/json' \
  -d '{"input":"hi","metadata":{"harness_id":"echo"}}' \
  http://127.0.0.1:8488/v1/responses
```

接一个真 agent 做链路冒烟（默认本机 opencode）：

```bash
bash scripts/real-smoke.sh
AGENT_CMD="dsh --profile acp" bash scripts/real-smoke.sh
```

## 相关

- 源码：[https://atomgit.com/ystyle/uhp-server](https://atomgit.com/ystyle/uhp-server)
- 协议与 SDK：[/libs/uhp](/libs/uhp)
- 进程隔离用的插件框架：[/libs/cordis](/libs/cordis)
- ACP 适配器背后的协议：[/libs/acp](/libs/acp)
- 搭一套完整 Agent 栈：[/guide/agent-stack](/guide/agent-stack)
