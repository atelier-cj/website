# 关于

Atelier 是一套用仓颉语言写的 Agent 生态：协议、框架与成品，全部纯仓颉实现，不依赖其它语言的运行时。这一页说明它想做什么、名字怎么来的、源码在哪。

## 理念：成品工坊，不是编排框架

大多数 Agent 框架把自己定位成「积木盒」：给你抽象、给你接口，循环、状态、上下文要自己拼。Atelier 的定位相反——**成品工坊**：装一个装配束就得到完整的可运行 Agent，时间花在真正不一样的地方。

| | 编排框架 | Atelier |
|---|---|---|
| 定位 | 积木盒：抽象与接口 | Agent Harness：开箱即用的成品 |
| 开发者要做的事 | 组装链条、实现循环、管理状态 | 挂载工具、配置 Skills、选择存储 |
| 交付形态 | 库，需二次开发 | 库 + HTTP 服务 + CLI |
| Agent 定义 | 代码里构建 | 运行时动态定义，不重新编译 |
| 目标用户 | 框架作者、高级工程师 | 业务工程师、应用集成者 |

这条取舍是有代价的：Atelier 不会帮你做成「任意流程都能编排」的万能系统。它假定你缺的是**一个能干活、能记住、能被外部拉起的 Agent**，而不是一套让你自己搭 Agent 的乐高。

同一套理念往下推，就是分层的理由：协议层只负责「和外面说话」，所以换协议不动业务；框架层只负责「循环与状态」，所以换产品形态不动内核。成品因此可以共用一条内核长出完全不同的样子——一个是应用里的助手，一个是人机共用的桌面。

## 命名体系

### Atelier

`atelier` 是法语「工坊」——把零件装配成成品的地方，而不是零件本身。这个词同时用在两处：

- **框架层**：`atelier` 仓 = Agent Harness，那个装配台。
- **成品层**：`Atelier Lumine` / `Atelier Starline` = 从这个装配台出来的作品。

### 炼金工房

成品命名沿用 Gust《炼金工房》系列的格式「〈主角名〉的炼金工房」，主角位是产品自己的角色：

| 产品 | 主角 | 形态 |
|---|---|---|
| [荧的炼金工房](/products/lumine)（Atelier Lumine） | 旅行者 · 荧 | 原神 AI 配装助手 |
| [星痕的炼金工房](/products/starline)（Atelier Starline） | 星痕 | 人机共享的常驻桌面 |

读法很简单：**成品用品牌名，构架用描述性名字**。所以 `atelier-starline` 这个仓里，`liveboard` 指的是它的构架层（将来要单独提取发布，包名与二进制至今仍叫 `liveboard`），不是另一个产品。

### 包名规则

包名跟「东西的性质」走，不跟仓库走：

| 层 | 规则 | 例子 |
|---|---|---|
| 协议 | 直接用协议名小写；多传输的拆子包 | `mcp` · `a2a` · `acp` · `uhp` · `ystyle::jsonrpc` + `jsonrpc_stdio/tcp/unix/http/websocket` |
| 框架 | 带 organization 的按成员拆包，或短包名 | `atelier` · `ystyle::cordis_core` / `cordis_host` / `cordis_plugin` · `ystyle::cordis_xisp` |
| 基础 | 职能直述 | `llm_api` · `jsonvalue` · `tomlcj` |
| 成品 | 独立仓，成员包名带产品前缀 | `atelier_lumine`（内核）· `atelier_lumine_web` / `_mcp` / `_desktop` · `liveboard` |

monorepo 的产品版本 lockstep：一个 `[workspace]` 视为一个产品，任一成员有实质变更就整体推进一个版本；测试包与示例包不参与发布。

## 源码地址

库全部开源，按仓拆分：

| 仓 | 包名 | 主仓 | GitHub 镜像 |
|---|---|---|---|
| atelier | `atelier` | [atomgit.com/ystyle/atelier](https://atomgit.com/ystyle/atelier) | [atelier-cj/atelier](https://github.com/atelier-cj/atelier) |
| mcp-cj | `mcp` | [atomgit.com/ystyle/mcp-cj](https://atomgit.com/ystyle/mcp-cj) | [atelier-cj/mcp-cj](https://github.com/atelier-cj/mcp-cj) |
| a2a-cj | `a2a` | [atomgit.com/ystyle/a2a-cj](https://atomgit.com/ystyle/a2a-cj) | [atelier-cj/a2a-cj](https://github.com/atelier-cj/a2a-cj) |
| acp-cj | `acp` | [atomgit.com/ystyle/acp-cj](https://atomgit.com/ystyle/acp-cj) | [atelier-cj/acp-cj](https://github.com/atelier-cj/acp-cj) |
| uhp | `uhp` / `uhp_acp` / `uhp_opencode` | [atomgit.com/ystyle/uhp](https://atomgit.com/ystyle/uhp) | [atelier-cj/uhp](https://github.com/atelier-cj/uhp) |
| uhp-server | 二进制产品 | [atomgit.com/ystyle/uhp-server](https://atomgit.com/ystyle/uhp-server) | [atelier-cj/uhp-server](https://github.com/atelier-cj/uhp-server) |
| cordis-cj | `ystyle::cordis_*` | [atomgit.com/ystyle/cordis-cj](https://atomgit.com/ystyle/cordis-cj) | [atelier-cj/cordis-cj](https://github.com/atelier-cj/cordis-cj) |
| llm_api | `llm_api` | [atomgit.com/ystyle/llm-api](https://atomgit.com/ystyle/llm-api) | [atelier-cj/llm-api](https://github.com/atelier-cj/llm-api) |
| json-rpc | `ystyle::jsonrpc` | [gitcode.com/ystyle/json-rpc](https://gitcode.com/ystyle/json-rpc) | [atelier-cj/json-rpc](https://github.com/atelier-cj/json-rpc) |

GitHub 侧是**只读镜像**，`git push` 请提到主仓；镜像随主仓手动/定时同步。

两个成品是私有仓（内网 Gitea），源码暂未公开；本站在 [github.com/atelier-cj](https://github.com/atelier-cj) 发布。

库都能直接从仓颉中心仓按版本装，不必 clone：

```toml
[dependencies]
atelier = "0.1.15"
"mcp" = "2.4.0"
"ystyle::jsonrpc" = "0.7.9"
```

（版本号取自各仓 `cjpm.toml`，实际可拉取的版本以中心仓索引为准。）

## 许可

| 许可 | 仓 |
|---|---|
| MIT | `atelier`、`cordis-cj`、`json-rpc`、`llm_api` |
| 木兰宽松许可证 第 2 版（MulanPSL-2.0） | `mcp-cj`、`a2a-cj`、`acp-cj`、`uhp`、`uhp-server` |

以各仓 `LICENSE` 与 `cjpm.toml` 的 `license` 字段为准。
