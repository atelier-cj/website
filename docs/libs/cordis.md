# Cordis · 插件系统

静态语言编译进二进制的模块没法卸载，想让插件真正热插拔，就得让插件跑在独立进程里——Cordis 就是这么做的：**微内核 + 进程隔离**，插件卸载即杀进程，操作系统回收全部资源。语义对标 DeepSeek Harness 的 Cordis 插件框架，仓颉实现。

## 能力

- **进程隔离**：插件以独立子进程运行，崩溃不影响宿主，卸载由操作系统兜底
- **双传输**：stdio（管道，默认，换行帧）或 UDS（Unix Domain Socket，Content-Length 帧），由配置 `transport` 全局切换，插件侧 `PluginRuntime.run` 自动检测
- **声明式配置**：TOML / JSON 定义期望状态，调和器 diff 后执行 Add / Remove / Update
- **服务注入**：插件声明 `inject` / `provide`，宿主按依赖拓扑启动，崩溃自动重启
- **零样板宏**：`@Plugin[]` / `@Provide["key"]` / `@Inject["key"]` 自动生成 main、握手与路由注册
- **脚本插件**：插件可以是 xisp（Lisp）脚本，`cordis_xisp` 把 ctx 能力注入脚本环境，无需编译
- **事件总线**：`ctx.on` / `ctx.emit` 解耦插件间通信，宿主扇出；另有 `serial` / `bail` / `waterfall` 派发语义
- **类型安全**：`invoke<T, R>` / `registerHandler<T, R>` 泛型 API 自动序列化 / 反序列化
- **可逆效果**：`ctx.effect` / `effectAsync` 与 `Service` 基类，卸载时逆序撤销
- **配置校验**：`ConfigSchema` 支持宽松 / 严格校验，错误带完整路径

### 包划分

| 包 | 职责 |
|---|---|
| `ystyle::cordis_core` | 协议消息类、统一 TOML/JSON 配置加载 |
| `ystyle::cordis_host` | 进程管理（`PluginManager`）、调和器（`PluginHost` / `Reconciler`） |
| `ystyle::cordis_plugin` | 插件 SDK（`PluginRuntime` / `ServiceRegistry`）与宏 |
| `ystyle::cordis_xisp` | xisp 脚本插件运行时 |

## 安装

```toml
[dependencies]
  "ystyle::cordis_core" = "0.3.2"
  "ystyle::cordis_host" = "0.3.2"
  "ystyle::cordis_plugin" = "0.3.2"
  # 写 xisp 脚本插件时再加
  # "ystyle::cordis_xisp" = "0.3.2"
  "jsonvalue" = "1.1.1"
```

```bash
eval "$(cjvs env zsh)" && eval "$(cjvs stdx-env zsh)"
cjpm build -j 16
```

## 最小示例

插件侧：显式 API 写法（推荐外部插件作者，不受宏跨模块缺陷影响），`run()` 自动在 stdio / UDS 之间选择，`main` 不用接收参数。

```cangjie
// my_plugin/src/main.cj（独立模块）
import ystyle::cordis_plugin.*
import jsonvalue.*

main(): Int64 {
    let handler = { ctx: PluginContext =>
        ctx.registerHandler("echo", { method, args =>
            if (args.size > 0) { args[0] } else { JsonValue.Null }
        })
        ctx.log("info", "plugin ready")
    }
    // run 自动选择传输：宿主 uds 模式传 --uds <path>（getCommandLine 获取），否则 stdio
    PluginRuntime.run("my-plugin", [], ["echo"], handler)
    return 0
}
```

宿主侧：加载配置、起调谐循环，剩下（拉起、握手、拓扑排序、崩溃重启、热调整）都由 `PluginHost` 完成。注意 `ConfigLoader` 定义在 `ystyle::cordis_core`，实际项目里要一并 `import`。

```cangjie
import ystyle::cordis_host.*

main() {
    let cfg = ConfigLoader.load("cordis.toml")
    // 按服务参数选择传输模式：uds → PluginManager(uds_path)；默认 stdio → PluginManager()
    let manager = if (cfg.transport == "uds") {
        PluginManager(cfg.udsPath)
    } else {
        PluginManager()
    }
    let host = PluginHost(manager)
    // 启动调谐循环（spawn 后台线程，每 interval 秒一轮）
    spawn {
        while (true) {
            host.reconcile("cordis.toml")
            sleep(5 * Duration.second)
        }
    }
    // 阻塞主进程
    while (true) { sleep(Duration.hour) }
}
```

配套的 `cordis.toml`：

```toml
interval = 5          # 调谐周期（秒）
ping_interval = 30    # 探活周期（秒）
transport = "stdio"   # "stdio"（管道，默认）| "uds"（Unix Domain Socket）
uds_path = ""         # UDS 模式下的监听 socket 路径

[[plugins]]
id = "my-plugin"
source = "./target/release/bin/my_plugin"
provide = ["echo"]
enabled = true
```

## 相关

- 源码：[https://atomgit.com/ystyle/cordis-cj](https://atomgit.com/ystyle/cordis-cj)
- 用 Cordis 托管适配器插件的产品：[/libs/uhp-server](/libs/uhp-server)
- 返回库索引：[/libs/](/libs/)
- 生态全景：[/ecosystem/](/ecosystem/)
