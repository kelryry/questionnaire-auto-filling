### 🤖 多平台问卷AI自动填写 (Multi-Platform Questionnaire AI Auto-Filler)

> **打破平台限制，让大模型（LLM）帮你像真人一样思考并填写所有网页表单。**

## 📖 背景与痛点

你是否遇到过以下情况？

- 需要填写的问卷**不是**常见的"问卷星"或"腾讯文档"，而是公司内部系统、学校自建网页或不知名的小众平台。
- 市面上的脚本大多是**瞎填/随机填**，逻辑不通，一眼假（比如：年龄选了3岁，学历却选了博士）。
- 网页使用了 React/Vue 等现代框架，普通脚本填进去的值在提交时**变为空白**。

为了解决这些问题，我开发了这套**通用性极强**的 AI 填表系统。它不依赖特定的平台规则，而是像人眼一样"看"网页结构，像人脑一样"思考"答案，最后模拟人手进行操作。

---

## 🎯 特别推荐：问卷星 (WJX) 专用版

本脚本主打**全网通用**，适合处理各种杂七杂八的问卷平台。

但如果你主要的使用场景是 **【问卷星】(wjx.cn / wjx.top)**，强烈建议使用我的另一个项目！
那个项目同样**基于 AI 大模型**，但针对问卷星的题目结构、反爬机制和逻辑跳转进行了**深度专项调优**，速度更快，准确率更高，稳定性更强。

🔥 **项目地址：[WJX-Auto-Sniper (问卷星AI狙击手)](https://github.com/kelryry/wjx-auto-sniper)**

**如何选择？**

- 填 **问卷星** 👉 去隔壁 [WJX-Auto-Sniper](https://github.com/kelryry/wjx-auto-sniper)
- 填 **腾讯文档/飞书/自建站/其他所有平台** 👉 用本项目

---

## ✨ 核心特性 Features

- 🧠 **真·AI 语义理解**：支持 **OpenAI 兼容 API**（OpenAI、DeepSeek、Moonshot 等）、**Google Gemini** 和 **Anthropic Claude**。AI 理解题目语义，根据你的设定生成合乎逻辑的答案，彻底告别随机乱填。
- 🌐 **全平台通用 (Universal)**：不再局限于特定网站。只要是 HTML 网页，它都能提取 DOM 结构进行分析。
- 📝 **启发式题目分组**：自动识别题号前缀、radio 分组、ARIA 语义标记，在发送给 AI 的内容中插入题目分组标记，帮助 AI 更准确地理解题目边界。
- 🎭 **自定义用户画像 (Persona)**：在配置中写入你的身份（如：大学生、程序员、全职妈妈），AI 会全程扮演该角色。
  - *例：题目问"你的收入"，AI 会根据你设定的职业自动估算一个合理的区间。*
- ⚛️ **框架穿透技术**：专为 React / Vue / Angular 等现代前端框架优化。通过模拟原生 Prototype 事件，解决"填了但没存进去"的顽疾。
- ⏰ **定时狙击模式**：支持毫秒级定时启动。设置好时间，脚本会自动倒计时，适合抢讲座名额、抢活动报名等场景。
- 🔄 **自动重试**：API 调用失败后自动重试，可配置重试次数和间隔。
- 💭 **思考链控制**：Gemini 和 Anthropic 支持配置思考链长度，OpenAI 兼容 API 支持自定义参数。
- ✅ **执行验证**：填写后自动验证 input 值是否生效，点击后检查 radio/checkbox 是否成功选中，并在控制台报告异常。
- ⚠️ **Token 截断检测**：自动检测 AI 响应是否被截断（超出 token 上限），调试模式下显示 token 用量统计。
- 📄 **多轮分页填写**：支持多页问卷自动翻页，填写后通过 DOM 快照对比检测新出现的题目。
- 🌍 **代理兼容 (Proxy-Friendly)**：采用双策略网络请求——优先使用浏览器原生 `fetch()`（自动走浏览器/扩展代理），若因 CORS 失败则自动回退到 `GM_xmlhttpRequest`。无需额外配置，对需要代理访问 API 的用户（如中国大陆）开箱即用。

## 🚀 Quick Start (快速演示)

百闻不如一见，安装脚本后，点击下方链接体验 AI 填表全过程：
👉 **[点击这里体验 AI 填表 (演示问卷)](https://v.wjx.cn/vm/Pp4nDfs.aspx)**

*(注：进入页面后，请留意右上角浮窗状态，AI 分析页面通常需要 1-3 秒)*

---

## 🛠️ 安装指南 (Installation)

### 第一步：安装脚本管理器

本脚本需要配合浏览器扩展使用，请根据你的浏览器选择：

#### 🟢 Chrome / Edge / Brave (推荐)

1. 安装 **Tampermonkey (油猴)** 扩展：[Chrome 商店链接](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. 安装完成后，点击扩展栏的油猴图标，选择"添加新脚本"。

#### 🦊 Firefox (火狐)

1. 前往 Firefox Add-ons 商店安装 **Tampermonkey**：[Firefox 商店链接](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/)
  - *注意：虽然 Greasemonkey 也可以，但 Tampermonkey 对跨域请求（GM_xmlhttpRequest）的支持更稳定，强烈推荐使用 Tampermonkey。*
2. 安装后点击右上角扩展图标，选择"新建用户脚本"。

### 第二步：导入脚本

1. 将本项目中的 JS 代码完整复制。
2. 粘贴到新建脚本的编辑器中。
3. 按 `Ctrl + S` 保存。

---

## ⚙️ 配置说明 (Configuration) - 必读！

脚本无法直接运行，你需要配置 **API 提供商**、**API Key** 和 **目标网址**。请在脚本代码顶部的 `CONFIG` 区域进行修改：

### 1. 选择 API 提供商

本脚本支持三种 API 提供商，通过 `apiProvider` 数字选择：

| 值 | 提供商 | 默认 URL | 默认模型 | 说明 |
|---|---|---|---|---|
| `1` | **OpenAI 兼容** | `https://api.openai.com/v1` | `gpt-5.2` | 兼容所有 OpenAI 格式 API（DeepSeek、Moonshot、智谱等），只需填基础 URL，`/chat/completions` 自动追加 |
| `2` | **Google Gemini** | `https://generativelanguage.googleapis.com/v1beta` | `gemini-3-flash-preview` | Gemini 原生 API |
| `3` | **Anthropic Claude** | `https://api.anthropic.com/v1/messages` | `claude-opus-4.6` | Anthropic 原生 API |

### 2. 获取 API Key

- **OpenAI**：前往 [platform.openai.com](https://platform.openai.com/) 创建密钥
- **Google Gemini (免费)**：前往 [Google AI Studio](https://aistudio.google.com/) → "Get API key" → "Create API key"
- **Anthropic**：前往 [console.anthropic.com](https://console.anthropic.com/) 创建密钥

### 3. 修改代码配置

```javascript
const CONFIG = {
    // 【必填】API 提供商：1 = OpenAI 兼容, 2 = Gemini, 3 = Anthropic
    apiProvider: 1,

    // 【必填】API Key
    apiKey: "sk-xxxx...",

    // 【可选】自定义 API URL（留空则使用默认 URL，填写则覆盖默认）
    // 对于 OpenAI 兼容 API：只需填基础 URL，/chat/completions 自动追加
    // 例如使用 DeepSeek: "https://api.deepseek.com/v1"
    // 例如使用智谱: "https://open.bigmodel.cn/api/paas/v4"
    apiUrl: "",

    // 【可选】模型名称（留空则使用默认模型）
    modelName: "",

    // 思考链长度（仅 Gemini 和 Anthropic 有效，0 = 关闭，大于 0 = 启用）
    thinkingBudget: 0,

    // 自定义参数（仅 OpenAI 兼容有效，会合并到请求体中）
    // 例如: { "temperature": 0.7, "reasoning_effort": "high" }
    customParams: {},

    // 重试配置
    retryCount: 1,       // 失败后重试次数（0 = 不重试）
    retryDelayMs: 1000,  // 重试间隔(毫秒)

    // 【核心】用户画像：告诉 AI 你是谁，它会按这个设定答题
    userProfile: `
        姓名: 李四
        身份: 在校大学生
        专业: 计算机科学
        性格: 积极向上，喜欢尝试新事物
        其他: 同意所有服务条款，遇到简答题请多写一点字数
    `,

    // 多轮填写（适用于多页问卷或有条件逻辑的问卷）
    maxRounds: 2,

    // 是否自动提交 (建议先设为 false，人工检查后再提交)
    autoSubmit: false,

    // 定时执行
    targetTime: "2025-12-03 15:00:00",

    // 调试模式（开启后在控制台显示发送给 AI 的内容、token 用量等）
    debug: false
};
```

### 4. 思考链与自定义参数说明

**Gemini / Anthropic 的思考链控制：**

将 `thinkingBudget` 设为大于 0 的值即可启用模型的深度思考能力：
- **Gemini**：对应 `thinkingConfig.thinkingBudget`，建议值 `1024` ~ `8192`
- **Anthropic**：对应 `thinking.budget_tokens`，建议值 `1024` ~ `8192`

**OpenAI 兼容 API 的自定义参数：**

由于各家 OpenAI 兼容 API 对思考链的控制方式不同，使用 `customParams` 来传递提供商特有的参数：

```javascript
// 示例：OpenAI reasoning_effort
customParams: { "reasoning_effort": "high" }

// 示例：调整 temperature
customParams: { "temperature": 0.5 }
```

### 5. 设置匹配网址 (Match URL)

在脚本顶部的注释区域，找到 `// @match`，添加你需要填写的问卷网址：

```javascript
// @match        https://www.wjx.cn/*
// @match        https://docs.qq.com/*
// @match        https://你的目标小众问卷网.com/*  <-- 在这里添加
```

---

## 🔬 原理揭秘 (How it works)

为了让您用得放心，这里简单介绍一下本脚本的黑科技流程：

1. **DOM 萃取**：脚本运行后，会遍历当前页面的 HTML 树，提取出所有"可交互元素"（输入框、按钮、选项）及其对应的"标签文字"。
2. **结构轻量化 + 启发式题目分组**：为了节省 Token，脚本将复杂 HTML 压缩成简化描述，并用启发式算法（题号前缀、radio name 分组、ARIA 语义标记）插入题目分组标记 `--- Q ---`，帮助 AI 识别题目边界。
3. **大模型推理**：将"页面结构" + "你的用户画像"打包发送给所选 AI 提供商。AI 可以选择 `fill`（填写）、`click`（点击）或 `skip`（跳过无法确定的题目）。
4. **双策略网络请求**：优先使用 `fetch()`（遵循代理设置），若 CORS 失败则回退到 `GM_xmlhttpRequest`。
5. **生成行动计划**：AI 返回 JSON 操作列表，脚本自动检测 token 截断、解析包裹对象（如 `{"actions": [...]}`），并验证每个步骤的有效性。
6. **仿真执行**：模拟人类事件流（`focus` → `input` → `blur`），确保数据被前端框架正确捕获。填写后验证 value 是否生效，点击后检查 radio/checkbox 是否选中。
7. **多轮分页**：填写完成后，通过 DOM 快照对比检测是否有新题目出现（条件逻辑触发或翻页），自动进入下一轮填写。
8. **自动重试**：API 调用失败后根据配置自动重试。

---

## ⚖️ 免责声明 (Disclaimer)

1. **仅供学习交流**：本脚本旨在展示大语言模型（LLM）在自动化操作与语义理解方面的应用潜力。请勿用于恶意刷票、攻击服务器或任何违反问卷平台服务条款的行为。
2. **数据隐私**：
  - 您的 API Key 和用户画像数据仅保存在您本地的脚本管理器中。
  - 脚本仅与您所选的 AI 提供商官方 API 通信（OpenAI / Google / Anthropic 或您自定义的 API 地址），**不会**将数据发送给作者或任何第三方服务器。
  - 网络请求优先通过浏览器原生 `fetch()` 发送（遵循您的代理设置），CORS 受阻时回退到 `GM_xmlhttpRequest`。
3. **结果准确性**：虽然 AI 很智能，但不可避免会出现"幻觉"（Hallucination）。作者不对因填写错误导致的任何损失负责。建议在重要场景下务必开启 `autoSubmit: false` 进行人工复核。
4. **账号安全**：短时间内高频使用自动化工具可能会导致您的 IP 或账号被目标平台封禁，请理性使用，控制请求频率。

---

## 🌟 求 Star (Support)

开发维护不易，如果这个脚本帮到了您，哪怕只是帮您省下了 5 分钟的时间，也希望您：

1. 在 GitHub 上点亮右上角的 **Star** ⭐
2. 推荐给你的朋友或同事

你的支持是我持续更新的最大动力！💪

Happy Auto-Filling! 🎉

<br>
<br>

---

---

<br>
<br>

# 🤖 Multi-Platform Questionnaire AI Auto-Filler

> **Break through platform limitations and let Large Language Models (LLM) think and fill out all web forms for you just like a real person.**

## 📖 Background & Pain Points

Have you ever encountered the following situations?

- The questionnaire you need to fill out is **not** on common platforms like "WJX" or "Tencent Docs," but on internal company systems, school-built websites, or obscure niche platforms.
- Most scripts on the market just **fill blindly/randomly**, resulting in illogical answers that look fake (e.g., choosing "3 years old" for age but "PhD" for education).
- The webpage uses modern frameworks like React/Vue, causing values filled by ordinary scripts to **become blank** upon submission.

To solve these problems, I developed this **highly universal** AI form-filling system. It does not rely on specific platform rules; instead, it "sees" the page structure like human eyes, "thinks" about answers like a human brain, and finally simulates human hands to perform operations.

---

## 🎯 Special Recommendation: WJX Edition

This script is designed for **universal compatibility**, suitable for handling various miscellaneous questionnaire platforms.

However, if your main use case is **[WJX] (wjx.cn / wjx.top)**, I strongly recommend using my other project!
That project is also **based on AI Large Models**, but it has been **deeply tuned** specifically for WJX's question structures, anti-crawling mechanisms, and logic jumps. It is faster, more accurate, and more stable.

🔥 **Project Link: [WJX-Auto-Sniper](https://github.com/kelryry/wjx-auto-sniper)**

**How to choose?**

- Filling **WJX (问卷星)** 👉 Go to [WJX-Auto-Sniper](https://github.com/kelryry/wjx-auto-sniper)
- Filling **Tencent Docs/Lark/Self-hosted sites/All other platforms** 👉 Use this project

---

## ✨ Features

- 🧠 **True AI Semantic Understanding**: Supports **OpenAI-compatible APIs** (OpenAI, DeepSeek, Moonshot, etc.), **Google Gemini**, and **Anthropic Claude**. The AI understands question semantics and generates logical answers based on your settings — no more random inputs.
- 🌐 **Universal Compatibility**: No longer limited to specific websites. As long as it is an HTML webpage, it can extract the DOM structure for analysis.
- 📝 **Heuristic Question Grouping**: Automatically detects question number prefixes, radio name groups, and ARIA semantic markers, inserting question-boundary hints (`--- Q ---`) to help the AI better identify question scope.
- 🎭 **Custom User Persona**: Define your identity in the configuration (e.g., college student, programmer, full-time mom), and the AI will role-play throughout the process.
  - *Example: If the question asks for "Income," the AI will automatically estimate a reasonable range based on your set profession.*
- ⚛️ **Framework Penetration Technology**: Optimized for modern frontend frameworks like React / Vue / Angular. It solves the issue of "filled but not saved" by simulating native Prototype events.
- ⏰ **Timer/Sniper Mode**: Supports millisecond-level scheduled starts. Set the time, and the script will count down automatically—perfect for grabbing spots in lectures or event registrations.
- 🔄 **Auto Retry**: Automatically retries on API failure with configurable retry count and delay.
- 💭 **Thinking Chain Control**: Configure thinking/reasoning depth for Gemini and Anthropic; use custom parameters for OpenAI-compatible APIs.
- ✅ **Execution Verification**: Automatically verifies that input values took effect after filling, checks radio/checkbox checked state after clicking, and reports anomalies in the console.
- ⚠️ **Token Truncation Detection**: Automatically detects if AI response was truncated (exceeded token limit); shows token usage statistics in debug mode.
- 📄 **Multi-Round Pagination**: Supports auto-navigation for multi-page questionnaires, detecting newly appeared questions via DOM snapshot comparison.
- 🌍 **Proxy-Friendly**: Dual-strategy networking—first tries native `fetch()` (follows browser/extension proxy settings), then falls back to `GM_xmlhttpRequest` (bypasses CORS) if needed. Works out-of-the-box for users who need proxies to access APIs (e.g., users in mainland China).

## 🚀 Quick Start

Seeing is believing. After installing the script, click the link below to experience the AI form-filling process:
👉 **[Click here to experience AI Auto-Filling (Demo Survey)](https://v.wjx.cn/vm/Pp4nDfs.aspx)**

*(Note: After entering the page, please pay attention to the floating window status in the top right corner. AI analysis usually takes 1-3 seconds.)*

---

## 🛠️ Installation

### Step 1: Install Script Manager

This script requires a browser extension. Please choose according to your browser:

#### 🟢 Chrome / Edge / Brave (Recommended)

1. Install the **Tampermonkey** extension: [Chrome Web Store Link](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. After installation, click the Tampermonkey icon in the extension bar and select "Create a new script".

#### 🦊 Firefox

1. Go to the Firefox Add-ons store and install **Tampermonkey**: [Firefox Add-ons Link](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/)
  - *Note: Although Greasemonkey works, Tampermonkey has more stable support for cross-origin requests (GM_xmlhttpRequest), so Tampermonkey is strongly recommended.*
2. After installation, click the extension icon in the top right corner and select "Create a new user script".

### Step 2: Import Script

1. Copy the complete JS code from this project.
2. Paste it into the editor of the new script.
3. Press `Ctrl + S` to save.

---

## ⚙️ Configuration - Must Read!

The script cannot run directly; you need to configure the **API Provider**, **API Key**, and **Target URL**. Please modify the `CONFIG` area at the top of the script code:

### 1. Choose API Provider

This script supports three API providers, selected via the `apiProvider` number:

| Value | Provider | Default URL | Default Model | Description |
|---|---|---|---|---|
| `1` | **OpenAI-compatible** | `https://api.openai.com/v1` | `gpt-5.2` | Compatible with all OpenAI-format APIs (DeepSeek, Moonshot, ZhipuAI, etc.). Provide base URL only, `/chat/completions` is appended automatically |
| `2` | **Google Gemini** | `https://generativelanguage.googleapis.com/v1beta` | `gemini-3-flash-preview` | Gemini native API |
| `3` | **Anthropic Claude** | `https://api.anthropic.com/v1/messages` | `claude-opus-4.6` | Anthropic native API |

### 2. Get API Key

- **OpenAI**: Go to [platform.openai.com](https://platform.openai.com/) to create a key
- **Google Gemini (Free)**: Go to [Google AI Studio](https://aistudio.google.com/) → "Get API key" → "Create API key"
- **Anthropic**: Go to [console.anthropic.com](https://console.anthropic.com/) to create a key

### 3. Modify Code Configuration

```javascript
const CONFIG = {
    // [REQUIRED] API Provider: 1 = OpenAI-compatible, 2 = Gemini, 3 = Anthropic
    apiProvider: 1,

    // [REQUIRED] API Key
    apiKey: "sk-xxxx...",

    // [OPTIONAL] Custom API URL (leave empty for default, or set to override)
    // For OpenAI-compatible: provide BASE URL only, /chat/completions is appended automatically
    // Example for DeepSeek: "https://api.deepseek.com/v1"
    // Example for ZhipuAI: "https://open.bigmodel.cn/api/paas/v4"
    apiUrl: "",

    // [OPTIONAL] Model name (leave empty for default)
    modelName: "",

    // Thinking budget (Gemini & Anthropic only, 0 = disabled, >0 = enabled)
    thinkingBudget: 0,

    // Custom parameters (OpenAI-compatible only, merged into request body)
    // Example: { "temperature": 0.7, "reasoning_effort": "high" }
    customParams: {},

    // Retry configuration
    retryCount: 1,       // retries after failure (0 = no retry)
    retryDelayMs: 1000,  // delay between retries in ms

    // Multi-round filling (for multi-page forms or conditional logic)
    maxRounds: 2,

    // [CORE] User Profile: Tell AI who you are
    userProfile: `
        Name: John Doe
        Identity: College Student
        Major: Computer Science
        Personality: Positive, likes trying new things
        Others: Agree to all terms of service
    `,

    autoSubmit: false,
    targetTime: "2025-12-03 15:00:00",

    // Debug mode (shows DOM payload, token usage, etc. in console)
    debug: false
};
```

### 4. Thinking Chain & Custom Parameters

**Thinking chain for Gemini / Anthropic:**

Set `thinkingBudget` to a value greater than 0 to enable extended thinking:
- **Gemini**: Maps to `thinkingConfig.thinkingBudget`, recommended `1024` ~ `8192`
- **Anthropic**: Maps to `thinking.budget_tokens`, recommended `1024` ~ `8192`

**Custom parameters for OpenAI-compatible APIs:**

Since each OpenAI-compatible provider implements reasoning differently, use `customParams` to pass provider-specific parameters:

```javascript
// Example: OpenAI reasoning_effort
customParams: { "reasoning_effort": "high" }

// Example: Adjust temperature
customParams: { "temperature": 0.5 }
```

### 5. Set Match URL

In the comment area at the top of the script, find `// @match` and add the URL of the questionnaire you need to fill:

```javascript
// @match        https://www.wjx.cn/*
// @match        https://docs.qq.com/*
// @match        https://your-target-niche-site.com/*  <-- Add here
```

---

## 🔬 How it works

To ensure you can use this with confidence, here is a brief introduction to the underlying technology:

1. **DOM Extraction**: After the script runs, it traverses the HTML tree of the current page and extracts all "interactive elements" (inputs, buttons, options) and their corresponding "label text."
2. **Structure Simplification + Heuristic Question Grouping**: To save tokens, the script compresses complex HTML into a simplified description. It then uses heuristic algorithms (question number prefixes, radio name groups, ARIA semantic markers) to insert `--- Q ---` question-boundary markers, helping the AI identify question scope.
3. **LLM Inference**: Packages the "Page Structure" + "Your User Profile" and sends it to your chosen AI provider. The AI can choose to `fill`, `click`, or `skip` (for uncertain questions).
4. **Dual-Strategy Networking**: First tries browser-native `fetch()` (respects proxy settings). If blocked by CORS, automatically falls back to `GM_xmlhttpRequest`.
5. **Action Plan Generation**: The AI returns a JSON operation list. The script automatically detects token truncation, unwraps wrapper objects (e.g., `{"actions": [...]}`), and validates each step.
6. **Simulation Execution**: Simulates the human event flow (`focus` → `input` → `blur`) to ensure data is correctly captured by frontend frameworks. Verifies that input values took effect and checks radio/checkbox checked state after clicking.
7. **Multi-Round Pagination**: After filling, compares DOM snapshots to detect newly appeared questions (from conditional logic or page navigation) and proceeds to the next round automatically.
8. **Auto Retry**: If the API call fails, the script automatically retries according to your configuration.

---

## ⚖️ Disclaimer

1. **For Learning & Exchange Only**: This script aims to demonstrate the potential of Large Language Models (LLM) in automated operations and semantic understanding. Please do not use it for malicious voting, attacking servers, or any behavior that violates the terms of service of questionnaire platforms.
2. **Data Privacy**:
  - Your API Key and user profile data are saved *only* in your local script manager.
  - The script communicates *only* with your chosen AI provider's official API (OpenAI / Google / Anthropic, or your custom API endpoint) and **will not** send data to the author or any third-party servers.
  - Network requests are sent via browser-native `fetch()` first (follows your proxy settings); falls back to `GM_xmlhttpRequest` when CORS blocks the request.
3. **Accuracy**: While AI is intelligent, "hallucinations" can inevitably occur. The author is not responsible for any losses caused by filling errors. It is recommended to enable `autoSubmit: false` for manual verification in important scenarios.
4. **Account Safety**: Frequent use of automation tools in a short period may lead to your IP or account being banned by the target platform. Please use rationally and control the request frequency.

---

## 🌟 Support

Development and maintenance are not easy. If this script has helped you, even if it just saved you 5 minutes, I hope you will:

1. Light up the **Star** ⭐ in the upper right corner on GitHub.
2. Recommend it to your friends or colleagues.

Your support is my greatest motivation for continuous updates! 💪

Happy Auto-Filling! 🎉
