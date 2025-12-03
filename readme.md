### 🤖 多平台问卷AI自动填写 (Multi-Platform Questionnaire AI Auto-Filler)

> **打破平台限制，让大模型（LLM）帮你像真人一样思考并填写所有网页表单。**

## 📖 背景与痛点

你是否遇到过以下情况？

- 需要填写的问卷**不是**常见的“问卷星”或“腾讯文档”，而是公司内部系统、学校自建网页或不知名的小众平台。
- 市面上的脚本大多是**瞎填/随机填**，逻辑不通，一眼假（比如：年龄选了3岁，学历却选了博士）。
- 网页使用了 React/Vue 等现代框架，普通脚本填进去的值在提交时**变为空白**。

为了解决这些问题，我开发了这套**通用性极强**的 AI 填表系统。它不依赖特定的平台规则，而是像人眼一样“看”网页结构，像人脑一样“思考”答案，最后模拟人手进行操作。

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

- 🧠 **真·AI 语义理解**：基于 Google Gemini 2.5 大模型。它能理解题目是问“联系方式”还是“对产品的建议”，并根据你的设定生成合乎逻辑的文本，彻底告别随机乱填。
- 🌐 **全平台通用 (Universal)**：不再局限于特定网站。只要是 HTML 网页，它都能提取 DOM 结构进行分析。
- 🎭 **自定义用户画像 (Persona)**：在配置中写入你的身份（如：大学生、程序员、全职妈妈），AI 会全程扮演该角色。
  - *例：题目问“你的收入”，AI 会根据你设定的职业自动估算一个合理的区间。*
- ⚛️ **框架穿透技术**：专为 React / Vue / Angular 等现代前端框架优化。通过模拟原生 Prototype 事件，解决“填了但没存进去”的顽疾。
- ⏰ **定时狙击模式**：支持毫秒级定时启动。设置好时间，脚本会自动倒计时，适合抢讲座名额、抢活动报名等场景。
- ⚡ **智能流控**：支持在“极速模式 (Flash-Lite)”和“深度思考模式 (Thinking)”之间切换。

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
2. 安装完成后，点击扩展栏的油猴图标，选择“添加新脚本”。

#### 🦊 Firefox (火狐)

1. 前往 Firefox Add-ons 商店安装 **Tampermonkey**：[Firefox 商店链接](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/)
  - *注意：虽然 Greasemonkey 也可以，但 Tampermonkey 对跨域请求（GM_xmlhttpRequest）的支持更稳定，强烈推荐使用 Tampermonkey。*
2. 安装后点击右上角扩展图标，选择“新建用户脚本”。

### 第二步：导入脚本

1. 将本项目中的 JS 代码完整复制。
2. 粘贴到新建脚本的编辑器中。
3. 按 `Ctrl + S` 保存。

---

## ⚙️ 配置说明 (Configuration) - 必读！

脚本无法直接运行，你需要配置 **API Key** 和 **目标网址**。请在脚本代码顶部的 `CONFIG` 区域进行修改：

### 1. 获取免费 API Key

本脚本使用 Google Gemini 模型（免费且强大）。

- 前往 [Google AI Studio](https://aistudio.google.com/)。
- 点击 "Get API key" -> "Create API key"。
- 复制那一串以 `AIza` 开头的字符。

### 2. 修改代码配置

```javascript
const CONFIG = {
    // 【必填】在此填入你申请的 API Key
    apiKey: "AIzaSyDxxxxxxxxx...", 

    // 模型选择：推荐 'gemini-2.5-flash-lite' (速度快) 或 'gemini-2.5-flash' (更智能)
    modelName: "gemini-2.5-flash-lite",

    // 【核心】用户画像：告诉 AI 你是谁，它会按这个设定答题
    userProfile: `
        姓名: 李四
        身份: 在校大学生
        专业: 计算机科学
        性格: 积极向上，喜欢尝试新事物
        其他: 同意所有服务条款，遇到简答题请多写一点字数
    `,

    // 是否自动提交 (建议先设为 false，人工检查后再提交)
    autoSubmit: false,

    // 定时执行：设置一个未来的时间，脚本会倒计时；如果是过去时间则立即执行
    targetTime: "2025-12-03 15:00:00",

    // ...其他配置保持默认
};
```

### 3. 设置匹配网址 (Match URL)

在脚本顶部的注释区域，找到 `// @match`，添加你需要填写的问卷网址：

```javascript
// @match        https://www.wjx.cn/*
// @match        https://docs.qq.com/*
// @match        https://你的目标小众问卷网.com/*  <-- 在这里添加
```

---

## 🔬 原理揭秘 (How it works)

为了让您用得放心，这里简单介绍一下本脚本的黑科技流程：

1. **DOM 萃取**：脚本运行后，会遍历当前页面的 HTML 树，提取出所有“可交互元素”（输入框、按钮、选项）及其对应的“标签文字”。
2. **结构轻量化**：为了节省 Token 和提高速度，脚本会将复杂的 HTML 压缩成 AI 能看懂的简化描述语言。
3. **大模型推理**：将“页面结构” + “你的用户画像”打包发送给 Google Gemini。
4. **生成行动计划**：AI 返回一个 JSON 格式的操作列表（例如：`[{"id": "input_1", "action": "fill", "value": "张三"}, ...]`）。
5. **仿真执行**：脚本接管浏览器，模拟人类的 `focus` -> `input` -> `blur` 事件流，确保数据被前端框架正确捕获。

---

## ⚖️ 免责声明 (Disclaimer)

1. **仅供学习交流**：本脚本旨在展示大语言模型（LLM）在自动化操作与语义理解方面的应用潜力。请勿用于恶意刷票、攻击服务器或任何违反问卷平台服务条款的行为。
2. **数据隐私**：
  - 您的 API Key 和用户画像数据仅保存在您本地的脚本管理器中。
  - 脚本仅与 Google 官方 API (`generativelanguage.googleapis.com`) 通信，**不会**将数据发送给作者或任何第三方服务器。
3. **结果准确性**：虽然 AI 很智能，但不可避免会出现“幻觉”（Hallucination）。作者不对因填写错误导致的任何损失负责。建议在重要场景下务必开启 `autoSubmit: false` 进行人工复核。
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

- 🧠 **True AI Semantic Understanding**: Based on the Google Gemini 2.5 model. It understands whether a question asks for "contact info" or "product suggestions" and generates logical text based on your settings, saying goodbye to random inputs.
- 🌐 **Universal Compatibility**: No longer limited to specific websites. As long as it is an HTML webpage, it can extract the DOM structure for analysis.
- 🎭 **Custom User Persona**: Define your identity in the configuration (e.g., college student, programmer, full-time mom), and the AI will role-play throughout the process.
  - *Example: If the question asks for "Income," the AI will automatically estimate a reasonable range based on your set profession.*
- ⚛️ **Framework Penetration Technology**: Optimized for modern frontend frameworks like React / Vue / Angular. It solves the issue of "filled but not saved" by simulating native Prototype events.
- ⏰ **Timer/Sniper Mode**: Supports millisecond-level scheduled starts. Set the time, and the script will count down automatically—perfect for grabbing spots in lectures or event registrations.
- ⚡ **Smart Flow Control**: Supports switching between "Flash-Lite Mode" and "Thinking Mode."

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

The script cannot run directly; you need to configure the **API Key** and **Target URL**. Please modify the `CONFIG` area at the top of the script code:

### 1. Get Free API Key

This script uses the Google Gemini model (free and powerful).

- Go to [Google AI Studio](https://aistudio.google.com/).
- Click "Get API key" -> "Create API key".
- Copy the string starting with `AIza`.

### 2. Modify Code Configuration

```javascript
const CONFIG = {
    // [REQUIRED] Enter your API Key here
    apiKey: "AIzaSyDxxxxxxxxx...", 

    // Model selection: Recommend 'gemini-2.5-flash-lite' (Fast) or 'gemini-2.5-flash' (Smarter)
    modelName: "gemini-2.5-flash-lite",

    // [CORE] User Profile: Tell AI who you are, it will answer based on this persona
    userProfile: `
        Name: John Doe
        Identity: College Student
        Major: Computer Science
        Personality: Positive, likes trying new things
        Others: Agree to all terms of service, write more words for open-ended questions
    `,

    // Auto submit? (Recommend setting to false first, verify manually then submit)
    autoSubmit: false,

    // Scheduled Execution: Set a future time, script will countdown; executes immediately if time is past
    targetTime: "2025-12-03 15:00:00",

    // ...keep other configs as default
};
```

### 3. Set Match URL

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
2. **Structure Simplification**: To save Tokens and improve speed, the script compresses complex HTML into a simplified description language that the AI can understand.
3. **LLM Inference**: Packages the "Page Structure" + "Your User Profile" and sends it to Google Gemini.
4. **Action Plan Generation**: The AI returns an operation list in JSON format (e.g., `[{"id": "input_1", "action": "fill", "value": "John Doe"}, ...]`).
5. **Simulation Execution**: The script takes over the browser, simulating the human event flow of `focus` -> `input` -> `blur` to ensure data is correctly captured by frontend frameworks.

---

## ⚖️ Disclaimer

1. **For Learning & Exchange Only**: This script aims to demonstrate the potential of Large Language Models (LLM) in automated operations and semantic understanding. Please do not use it for malicious voting, attacking servers, or any behavior that violates the terms of service of questionnaire platforms.
2. **Data Privacy**:
  - Your API Key and user profile data are saved *only* in your local script manager.
  - The script communicates *only* with the official Google API (`generativelanguage.googleapis.com`) and **will not** send data to the author or any third-party servers.
3. **Accuracy**: While AI is intelligent, "hallucinations" can inevitably occur. The author is not responsible for any losses caused by filling errors. It is recommended to enable `autoSubmit: false` for manual verification in important scenarios.
4. **Account Safety**: Frequent use of automation tools in a short period may lead to your IP or account being banned by the target platform. Please use rationally and control the request frequency.

---

## 🌟 Support

Development and maintenance are not easy. If this script has helped you, even if it just saved you 5 minutes, I hope you will:

1. Light up the **Star** ⭐ in the upper right corner on GitHub.
2. Recommend it to your friends or colleagues.

Your support is my greatest motivation for continuous updates! 💪

Happy Auto-Filling! 🎉
