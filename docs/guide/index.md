# 开始之前

这一节准备三件事：仓颉工具链怎么装、这套生态怎么分层、以及该按什么顺序读。全是能立刻执行的东西，不解释设计动机——那些在[生态全景](/ecosystem/)里。

## 工具链：cjc、cjpm、stdx

仓颉的构建工具是 `cjpm`（包管理 + 编译），`stdx` 是扩展库（HTTP、TLS、加解密、序列化都在这里）。两者版本独立，由 [`cjvs`](https://github.com/ystyle/cjvs) 统一管理。

```bash
# Arch Linux
paru -S cjvs-bin

# 其他发行版：用已有的仓颉工具链装（版本号以 cjvs Release 为准）
cjpm install cjvs-0.4.2
```

装完版本与 stdx：

```bash
cjvs rls sts                        # 列出可装的官方版本（sts / lts 两个频道）
cjvs install 1.1.3                  # 装（具体版本号以 rls 输出为准）
cjvs default 1.1.3                  # 设为默认

cjvs stdx install 1.1.3.1           # stdx 在线安装（省略 zip 时自动下载当前平台制品）
cjvs stdx default 1.1.3.1 static    # 设为默认，并选静态库
```

每个新 shell 都要加载两套环境变量：

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
```

第二条不能省。`cjpm` 读不了符号链接，`CANGJIE_STDX_PATH` 必须由 `cjvs stdx-env` 输出真实路径；只加载第一条时，`cjpm build` 会找不到 `stdx.net.http` 这类包。

## 本生态要求什么编译器版本

各仓在 `cjpm.toml` 里用自己的 `cjc-version` 声明，并不统一。要同时跑全部仓，按最高者准备：

| 仓 | 主要包名 | 声明版本 |
|---|---|---|
| [json-rpc](/libs/json-rpc) | `ystyle::jsonrpc` | 1.0.0 |
| [llm_api](/libs/llm-api) | `llm_api` | 1.1.0 |
| [mcp-cj](/libs/mcp) | `mcp` | 1.1.0 |
| [a2a-cj](/libs/a2a) | `a2a` | 1.1.0 |
| [acp-cj](/libs/acp) | `acp` | 1.1.0 |
| [atelier](/libs/atelier) | `atelier` | 1.1.0（`cli` 成员是 1.1.3） |
| [cordis-cj](/libs/cordis) | `cordis_*` | 1.1.3 |
| [uhp](/libs/uhp) | `uhp` | 1.2.0 |
| [uhp-server](/libs/uhp-server) | 不发中心仓 | 1.2.0 |

只写一个 MCP 服务器或一个 ACP Agent 的话，1.1.3 起步就够；要用 `uhp` / `uhp-server`，装 1.2.0。

## 生态怎么分层

依赖只向下，从上往下三层，外加一层底座：

| 层 | 干什么 | 有哪些 |
|---|---|---|
| 成品 | 能直接跑的应用 | 荧的炼金工房、星痕的炼金工房 |
| 框架 | 把模型与协议装配成可交付的 Agent | `atelier`、`cordis`、`uhp-server` |
| 协议 | 和外部世界说话（模型、工具、其它 Agent、编辑器） | `mcp` / `a2a` / `acp` / `uhp`，共用 `jsonrpc` 底座 |
| 基础 | 只和模型说话 | `llm_api` |

分层不是为了好看，是为了判断「这个需求该往哪一层加」：换模型不动 Agent 代码（基础层已封装），换协议不动业务（协议层是独立包），换产品形态不动内核（成品只是装配）。

## 按什么顺序读

1. **本节** —— 工具链能跑起来。
2. [搭建一个 Agent](/guide/agent-stack) —— 从 `llm_api` 的一次调用，走到 `atelier` 的完整 Agent。
3. [协议选型](/guide/protocols) —— MCP / A2A / ACP / UHP 各解决什么问题，怎么组合。
4. [生态全景](/ecosystem/) —— 各库之间的真实依赖关系。
5. [库索引](/libs/) —— 具体要用哪个包、怎么写代码。
6. [产品](/products/) —— 这些库拼出来的两个成品。

## 常用命令与三个坑

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"

cjpm build -j 16                # 编译（单模块包）
cjpm test --no-run -j 4         # 只编测试
cjpm test -j 4 --no-progress    # 跑测试
cjpm clean                      # 换编译器版本后必做
```

- **并发度看仓形态**：单模块包 `-j 16`；多成员 workspace（`atelier`、`cordis-cj`、`uhp`）带子进程 e2e 的用 `-j 4`，`-j 10` 以上会像死锁。
- **`--filter` 是通配符不是正则**：`'*keyword*'` 好用；`'Class.*'` 只匹配「类名.方法名」风格的用例，顶层 `@Test func` 一个都选不中，现象是 `PASSED: 0` 全 SKIPPED。
- **LSP 报错先编译**：`cjpm build`（源码）/ `cjpm test --no-run`（测试）过了还报才是真问题。

下一步：[搭建一个 Agent](/guide/agent-stack)。
