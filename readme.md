##🤖 多平台问卷AI自动填写 (Multi-Platform Questionnaire AI Auto-Filler)

> **拒绝随机乱填，让 AI 帮你像真人一样回答问题。**
> **Stop filling randomly. Let AI answer like a human.**

## 📖 背景与简介 (Background)

许多时候，我们需要快速填写各类问卷。虽然市面上已有许多自动脚本，但它们大多数只是**随机点击**，生成的答案逻辑混乱，一眼假。而且，一旦遇到公司内部、学校自建或小众的问卷平台，市面上的通用脚本往往失效，每次都为一个小平台专门写代码适配又太费时费力。

因此，我开发了这套**基于大语言模型（LLM）的通用填表系统**。它不是简单的规则匹配，而是提取页面 DOM 结构，发送给 **Google Gemini AI** 进行语义分析。它能“读懂”题目的含义，并根据你预设的“用户画像”生成合理的答案。

虽然无法覆盖所有极端复杂的交互，但对于绝大多数基于 HTML 的表单，它都能帮你节省大量时间！🚀

### 🎯 特别推荐：问卷星 (WJX) 专用版

本脚本主打**基于大模型的全平台通用**能力。但如果你主要的使用场景是**【问卷星】(wjx.cn / wjx.top)**，并且追求极致的速度、稳定性和抗检测能力，请移步我的另一个专项开源项目：

🔥 **[WJX-Auto-Sniper (问卷星狙击手)](https://github.com/kelryry/wjx-auto-sniper)**

* **区别**：本项目适合处理各种结构未知的通用/小众平台；WJX-Auto-Sniper 则是针对问卷星底层逻辑开发，速度更快，效果更好。

---

## ✨ 核心特性 (Features)

* 🧠 **真·AI 语义理解**：使用 Gemini 模型，不仅能做选择题，还能根据人设自动撰写简答题。
* 🌐 **超强通用性**：不再局限于特定平台。只要是网页表单，它都能尝试解析并填写。
* 🎭 **自定义用户画像**：在代码中配置你的身份（姓名、职业、偏好），AI 会严格扮演该角色填表。
* ⚛️ **穿透现代框架**：专门针对 React/Vue/Angular 等现代前端框架优化，模拟原生输入事件，防止“填了却没提交上”的问题。
* ⏰ **定时狙击模式**：支持设置 `targetTime`，在指定时间毫秒级启动。

## 🚀 快速演示 (Quick Start)

想看看 AI 是如何工作的？请安装脚本后，访问下方测试问卷：
👉 **[点击这里体验 AI 填表 (Demo Link)](https://v.wjx.cn/vm/Pp4nDfs.aspx)**

*(注：进入页面后，你会看到右上角出现 AI 状态栏，通常几秒钟内即可完成填写)*

## 🛠️ 使用方法 (Usage)

### 1. 安装插件

你需要先在浏览器安装脚本管理器，推荐使用 **Tampermonkey (油猴)**。

* [Chrome/Edge 安装地址](https://www.tampermonkey.net/)

### 2. 获取 API Key

本脚本基于 Google Gemini，你需要一个免费的 API Key。

* 前往 [Google AI Studio](https://aistudio.google.com/) 获取 API Key。

### 3. 安装与配置脚本

1. 在油猴中点击“添加新脚本”，将本仓库的代码完整复制进去。
2. **⚠️ 重要：修改代码顶部的 `CONFIG` 区域！**

你需要根据自己的需求修改以下几行：

```javascript
const CONFIG = {
    // 1. [必填] 你的 Gemini API Key
    apiKey: "在此处粘贴你的API_KEY",

    // 2. 模型选择：推荐 flash-lite 速度最快
    modelName: "gemini-2.5-flash-lite",

    // 3. 是否自动点击提交按钮 (true/false)
    autoSubmit: false, 

    // 4. 定时执行时间 (如果是过去的时间则立即执行)
    targetTime: "2025-12-03 15:00:00",

    // 5. 用户画像 (让 AI 知道你是谁)
    userProfile: `
        Name: John Doe
        Occupation: Developer
        Note: I agree to all terms.
    `,
};
```

### 4. 设置匹配网站

在脚本头部的 `// @match` 区域，添加你需要填写的问卷网址。

```javascript
// @match        https://docs.qq.com/form/*
// @match        https://你的目标问卷网站.com/*
```

## 🌟 求 Star (Support)

开发不易，如果你觉得这个脚本帮你节省了时间，请在 GitHub 上点亮右上角的 **Star** ⭐！
你的支持是我更新的最大动力！

---

---

# 🇬🇧 English Documentation

## 📖 Background

Often, we need to fill out questionnaires quickly. While there are many auto-filling scripts available, most of them rely on **random clicking**. This results in illogical answers that are easily detected as bots. Furthermore, if you encounter a niche survey platform (internal company forms, self-hosted school surveys), most specific scripts (like those for WJX) stop working.

Developing a specific script for every small platform is exhausting. That's why I created this **LLM-based Universal Auto-Filler**.

It extracts the DOM structure of the page, sends it to **Google Gemini AI** for semantic analysis, and simulates human input. It "reads" the questions and generates reasonable answers based on your defined "User Profile".

### 🎯 Special Recommendation: WJX Specific Version

This script focuses on **Universal Compatibility** using AI. However, if your main target is specifically **[WJX (问卷星)](https://www.wjx.cn)**, and you need extreme speed and stability:

🔥 **Please check my other project: [WJX-Auto-Sniper](https://github.com/kelryry/wjx-auto-sniper)**

* **Difference**: This project uses AI for unknown/general platforms. `WJX-Auto-Sniper` is reverse-engineered specifically for WJX, runs faster, and has better anti-detection logic.

## ✨ Features

* 🧠 **AI Semantic Understanding**: Uses Gemini models to answer multiple-choice and open-ended questions logically.
* 🌐 **Universal Compatibility**: Works on most HTML forms, not just big platforms.
* 🎭 **Custom User Persona**: Define who you are (Name, Job, Preferences) in the config, and the AI will act as that character.
* ⚛️ **Modern Framework Support**: Optimized for React/Vue/Angular. It handles state hijacking issues to ensure values are actually registered by the browser.
* ⏰ **Scheduled Execution**: Set a `targetTime` to start filling exactly when needed.

## 🚀 Quick Start

Want to see how it works? Install the script and visit the demo link below:
👉 **[Click Here to Test (Demo Link)](https://v.wjx.cn/vm/Pp4nDfs.aspx)**

*(Note: A status bar will appear in the top right corner. The AI usually finishes filling in a few seconds)*

## 🛠️ How to Use

### 1. Install Tampermonkey

You need a userscript manager extension.

* [Download Tampermonkey](https://www.tampermonkey.net/)

### 2. Get an API Key

This script relies on Google Gemini. You can get a free key here:

* [Google AI Studio](https://aistudio.google.com/)

### 3. Configure the Script

1. Create a new script in Tampermonkey and paste the code from this repository.
2. **⚠️ IMPORTANT: Edit the `CONFIG` section at the top of the code!**

```javascript
const CONFIG = {
    // 1. [Required] Your Gemini API Key
    apiKey: "PASTE_YOUR_API_KEY_HERE",

    // 2. Model Selection: "gemini-2.5-flash-lite" is recommended for speed
    modelName: "gemini-2.5-flash-lite",

    // 3. Auto Submit? (true/false)
    autoSubmit: false, 

    // 4. Scheduled Time (Runs immediately if set to a past date)
    targetTime: "2025-12-03 15:00:00",

    // 5. User Profile (Tell AI who you are)
    userProfile: `
        Name: John Doe
        Phone: 1234567890
        Occupation: Developer
        Preferences: I like coding and coffee.
    `,
};
```

### 4. Add Target URLs

Add the URLs you want to autofill in the `// @match` section header.

```javascript
// @match        https://example.com/form/*
// @match        https://docs.google.com/forms/*
```

## 🌟 Support

If this script saves your time, please give this repository a **Star** ⭐!
It motivates me to keep updating the project. Happy Filling! 🎉
