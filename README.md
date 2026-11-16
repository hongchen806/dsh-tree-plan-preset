<div align="center">

**[中文](#中文) · [English](#english)**

</div>

---

## 中文

# 树状规划（PTC）· DSH agent 预设

> 让 agent 先给你一棵**可编辑的目标树**，你改完、点了「开始运行」，它才动手。

面向 [DeepSeek Harness](https://deepseek.com) 桌面版 **44.7.0**（Windows）。当前版本 **2.1.0-stable**。

### 它解决什么问题

大多数 agent 出问题，不是因为不会做，而是因为**太早开始做**：你还在描述需求，它已经在扫目录、改文件了。这个预设把动手从默认动作改成需要你批准的动作：

1. **首轮只出树**——不给工具、不读文件、不跑命令，只输出一棵 5–15 个节点的需求—目标树；
2. **你在树上改**——每个节点有稳定 ID（G/D/S/C/P/V/Q），可以直接在「目标树」视图里改，也能按 ID 回话；
3. **你点「开始运行」才算授权**——它把当前编辑后的完整树通过会话发给 agent，这时才真正执行。

### 2.1 的三件事

**缓存优先**。PTC 执行器是唯一的直接工具面，实际工具收敛为读、写、编辑、运行四个；不挂时间上下文、不注入每轮变化的时间戳、不启用工具结果裁剪、会话保持只追加。目的是让 prompt 前缀尽量稳定，把缓存打满、成本压低。PTC 子调用并行上限 20。

**目标是可操作的图，不是一段文本**。内联编辑、撤销栈、缩放、右键平移、自由拖拽、节点合并/拆分都在客户端完成；布局与分组做记忆化，拖拽期间直接改 DOM，不触发整树重渲染。

**执行状态是持久的**。点过「开始运行」之后，切到别的视图再回来，树仍然标着「已发送启动 / 执行中 / 已执行」。目标树独占自己的消息位，不会把对话正文刷满。

### 装法（三步）

1. 从 [Releases](https://github.com/hongchen806/dsh-tree-plan-preset/releases) 下载 `dsh-tree-plan-preset-2.1.0-stable.zip`，**完整解压**（别在压缩包里直接双击脚本）。
2. 解压目录里右键 `安装.ps1` → **使用 PowerShell 运行**。被策略拦住就用：

```powershell
powershell -ExecutionPolicy Bypass -File .\安装.ps1
```

3. **完全退出 DSH**（含托盘图标），再重新打开。

脚本做三件事：把插件复制到 `%USERPROFILE%\.dsh\local-plugins\`、在 profile 的 `package.json` 里登记依赖与 `dsh.profile.bundles`、在 `node_modules\@local\` 建链接；原文件备份为 `package.json.bak-tree-plan`。不碰你的模型设置、密钥、主题和对话记录。

### 懒人版：把 zip 丢给 AI 帮你装

不想自己点脚本，可以把 `dsh-tree-plan-preset-2.1.0-stable.zip` 交给你的 AI 助手（DSH 里的 agent 也行），配一句话：

> 帮我把这个 DSH 预设装上：解压到本地，运行 `安装.ps1`，然后检查 profile 的 `package.json` 里 `dsh.profile.bundles` 有没有 `"@local/dsh-tree-plan-preset"`，最后告诉我需要重启什么。

它需要能读到你解压后的目录、并且能执行 PowerShell；装完自己核一遍 bundles 里有没有那行注册，就是装好了。

卸载：右键 `卸载.ps1` 跑一遍，重启 DSH，配置复原。

### 装完怎么验

新建会话选预设「树状规划（PTC）」，然后：

| 你发 | 应该发生 |
| --- | --- |
| 「帮我把下周的出差安排理一下」 | 只出一棵树，界面里没有工具调用 |
| 在「目标树」视图里改某个节点 | 树就地更新，可以撤销 |
| 直接回「Q1 改为：只排高铁」 | 重发完整新树 + 一句变更摘要，仍不动手 |
| 点「开始运行」 | 树被发出去，状态转「执行中」，这才开始干活 |

### 已知局限

- 只适配 DSH 桌面版 **44.7.0 / Windows**；其他版本 `dsh.profile.bundles` 结构可能不同。
- 「目标树」视图依赖同版本客户端组件；组件不匹配时**预设本身仍生效**，树是纯文本，照常可读可改。
- 它是提示词约束，不是硬沙箱：模型仍可能偏离。上一版（2.0）的实测里出现过两次偏离——含糊表态被当成授权开工、强指令下首轮偶尔直接动手；2.1 改写了提示词，但**尚未重新测过**这两项。

### 目录

```
plugin/                预设本体
  cordis.patch.yml     预设声明：persona 与工具组成
  index.js             Host 侧：把 goal-tree 围栏解析成会话投影
  client.js            Web 侧：目标树视图、编辑与交互
  tree-parser.js       纯文本树解析
安装.ps1 / 卸载.ps1
LICENSE  .gitignore
```

---

## English

# Tree Planning (PTC) — a DSH agent preset

> Give the agent a **reviewable goal tree** first. It only starts working after you edit the tree and hit **Start run**.

For [DeepSeek Harness](https://deepseek.com) desktop **44.7.0** on Windows. Current version **2.1.0-stable**.

### The problem it solves

Most agent failures are not failures of capability but of **timing**: the agent starts editing files while you are still describing the task. This preset turns execution from a default into an approved action:

1. **First turn is planning only** — no tools, no file reads, no shell. It emits a single 5–15 node requirement/goal tree.
2. **You edit the tree** — every node has a stable ID (G/D/S/C/P/V/Q). Edit inline in the dedicated **Goal tree** view, or reply by node ID.
3. **Clicking Start run is the authorization** — the edited tree is sent back to the agent through the session, and only then does work begin.

### What 2.1 changes

**Cache-first.** The PTC executor is the only direct tool surface; the real toolset collapses to read, write, edit, run. No time context is mounted, no per-turn timestamps are injected, tool-result pruning is off and the session stays append-only — so the prompt prefix stays stable and cache hits stay high. PTC sub-calls are capped at 20 in parallel.

**The tree is an operable object, not a wall of text.** Inline editing, an undo stack, zoom, right-drag panning, free dragging and node merge/split all happen client-side. Layout and grouping are memoized and drags mutate the DOM directly, so the whole tree is not re-rendered on every frame.

**Execution state persists.** After Start run, the tree keeps its 「sent / running / done」 badge across view switches. The goal tree occupies its own message slot instead of flooding the transcript.

### Install

1. Download `dsh-tree-plan-preset-2.1.0-stable.zip` from [Releases](https://github.com/hongchen806/dsh-tree-plan-preset/releases) and **fully extract** it (do not double-click the script inside the archive).
2. Right-click `安装.ps1` → **Run with PowerShell**. If execution policy blocks it:

```powershell
powershell -ExecutionPolicy Bypass -File .\安装.ps1
```

3. **Quit DSH completely** (including the tray icon) and start it again.

The script copies the plugin to `%USERPROFILE%\.dsh\local-plugins\`, registers the dependency and `dsh.profile.bundles` entry in your profile's `package.json`, links it under `node_modules\@local\`, and backs the original up as `package.json.bak-tree-plan`. It never touches your model settings, credentials, theme or transcripts.

### Let an AI install it for you

Hand the zip to any AI assistant that can read files and run PowerShell (a DSH agent works) with this instruction:

> Install this DSH preset: extract it locally, run `安装.ps1`, then check that `dsh.profile.bundles` in the profile's `package.json` contains `"@local/dsh-tree-plan-preset"`, and tell me what needs restarting.

Verify by yourself afterwards: if that bundle entry is present, it is installed.

Uninstall: run `卸载.ps1` and restart DSH; the profile is restored.

### Verify it works

Start a new session with the **Tree planning (PTC)** preset:

| You send | Expected |
| --- | --- |
| "Plan my business trip next week" | One tree is shown, no tool calls appear |
| Edit a node in the Goal tree view | The tree updates in place and can be undone |
| Reply "change Q1 to: train only" | The full tree is re-sent with a one-line changelog; still no execution |
| Click **Start run** | The tree is sent, the badge turns to running, work begins |

### Known limitations

- Only validated against DSH desktop **44.7.0 on Windows**; other versions may use a different `dsh.profile.bundles` layout.
- The Goal tree view depends on matching client components. If they mismatch, **the preset still works** — the tree is plain text and remains readable and editable.
- This is a prompt-level guardrail, not a sandbox. The model can still drift: two deviations showed up while testing 2.0 (vague approval treated as authorization, and the first turn occasionally acting under strong instructions). 2.1 rewrites the prompt but **has not been re-tested** on those two cases.

### Layout

```
plugin/                preset source
  cordis.patch.yml     preset declaration: persona and tool composition
  index.js             host side: parses goal-tree fences into a session projection
  client.js            web side: goal tree view, editing and interaction
  tree-parser.js       plain-text tree parser
安装.ps1 / 卸载.ps1
LICENSE  .gitignore
```

## License

MIT
