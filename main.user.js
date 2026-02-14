// ==UserScript==
// @name         Multi-Platform Questionnaire AI Auto-Filler
// @name:zh-CN   多平台问卷AI自动填写
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Extracts DOM structure with heuristic question-group detection, sends it to an AI LLM for semantic analysis, and simulates human input to fill forms. Supports OpenAI-compatible APIs, Google Gemini, and Anthropic Claude. Features: token truncation detection, click verification, multi-round pagination with DOM change tracking, and a "skip" action for uncertain questions. Dual-strategy networking (fetch + GM_xmlhttpRequest fallback) for proxy and CORS compatibility.
// @description:zh-CN 提取页面DOM结构并进行启发式题目分组，发送给AI大模型进行语义分析，模拟人类输入填表。支持OpenAI兼容API、Google Gemini和Anthropic Claude。特性：token截断检测、点击验证、多轮分页DOM变化追踪、不确定题目跳过。双策略网络请求兼容代理与跨域环境。
// @author       AI-Assistant
// @match        https://example.com/replace-this-with-your-target-url/*
// @match        https://docs.qq.com/form/*
// @match        https://*.wjx.cn/*
// @match        https://*.wjx.top/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      *
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // [USER CONFIGURATION] - MUST BE CONFIGURED BEFORE USE
    // 用户配置区 - 使用前必须配置
    // =========================================================================
    const CONFIG = {
        // 1. API Provider Selection / API 提供商选择
        //    1 = OpenAI-compatible (兼容 OpenAI 格式的 API，如 OpenAI、DeepSeek、Moonshot、智谱 等)
        //        - Default URL: https://api.openai.com/v1
        //        - /chat/completions will be appended automatically
        //        - User-provided URL will override the default
        //    2 = Google Gemini API
        //        - Default URL: https://generativelanguage.googleapis.com/v1beta
        //        - User-provided URL will override the default
        //    3 = Anthropic Claude API
        //        - Default URL: https://api.anthropic.com/v1/messages
        //        - User-provided URL will override the default
        apiProvider: 1,

        // 2. API Key (Required / 必填)
        //    For provider 1 (OpenAI-compatible): Your API key, e.g. "sk-..."
        //    For provider 2 (Gemini): Get yours at https://aistudio.google.com/, e.g. "AIza..."
        //    For provider 3 (Anthropic): Get yours at https://console.anthropic.com/, e.g. "sk-ant-..."
        apiKey: "YOUR_API_KEY_HERE",

        // 3. API URL (Optional / 可选)
        //    Leave empty "" to use the default URL for the selected provider.
        //    Set a custom URL to override, e.g. for a proxy or third-party OpenAI-compatible service.
        //    留空则使用所选提供商的默认 URL，填写自定义 URL 可覆盖默认值。
        //    For OpenAI-compatible (provider 1): provide the BASE URL only,
        //    "/chat/completions" will be appended automatically.
        //    对于 OpenAI 兼容 API (提供商 1)：只需填写基础 URL，"/chat/completions" 会自动追加。
        //    Examples:
        //      OpenAI:            "https://api.openai.com/v1"
        //      DeepSeek:          "https://api.deepseek.com/v1"
        //      智谱 (ZhipuAI):    "https://open.bigmodel.cn/api/paas/v4"
        //      Moonshot:          "https://api.moonshot.cn/v1"
        //      Gemini proxy:      "https://my-proxy.example.com/v1beta"
        //      Anthropic proxy:   "https://my-proxy.example.com/v1/messages"
        apiUrl: "",

        // 4. Model Name (Optional / 可选)
        //    Leave empty "" to use the default model for the selected provider.
        //    留空则使用默认模型。
        //    Defaults: provider 1 → "gpt-5.2", provider 2 → "gemini-3-flash-preview", provider 3 → "claude-opus-4.6"
        modelName: "",

        // 5. Thinking Budget / 思考链长度 (Providers 2 & 3 only / 仅适用于 Gemini 和 Anthropic)
        //    Controls extended thinking / chain-of-thought length.
        //    Set to 0 to disable (default). Set to a positive integer (e.g. 1024, 4096) to enable.
        //    For Gemini: maps to thinkingConfig.thinkingBudget
        //    For Anthropic: maps to thinking.budget_tokens
        //    NOTE: For OpenAI-compatible APIs (provider 1), use customParams instead,
        //          since each provider implements reasoning/thinking differently.
        //    注意：对于 OpenAI 兼容 API（提供商 1），请使用 customParams 来控制思考链，
        //          因为各家对思考链的控制方式不同。
        thinkingBudget: 0,

        // 6. Custom Parameters / 自定义参数 (Provider 1 / OpenAI-compatible only)
        //    Extra parameters merged into the request body. Useful for provider-specific
        //    features like reasoning_effort, temperature, etc.
        //    会被合并到请求体中。适用于各 OpenAI 兼容提供商的特有参数，如 reasoning_effort、temperature 等。
        //    Example: { "temperature": 0.7, "reasoning_effort": "high" }
        customParams: {},

        // 7. Retry Configuration / 重试配置
        //    retryCount: Number of retries after an API call failure (0 = no retry).
        //                API 调用失败后的重试次数（0 = 不重试）。
        //    retryDelayMs: Delay in milliseconds between retries.
        //                  重试之间的间隔毫秒数。
        retryCount: 1,
        retryDelayMs: 1000,

        // 8. Auto Submit Configuration / 自动提交配置
        //    autoSubmit: If true, clicks the submit button automatically.
        //    submitDelay: Delay in milliseconds before clicking submit.
        autoSubmit: false,
        submitDelay: 1000,

        // 9. Scheduled Execution / 定时执行
        //    targetTime: Format "YYYY-MM-DD HH:MM:SS". If in the past, runs immediately.
        //    preLoadOffset: Milliseconds to start scanning before the target time.
        targetTime: "2025-12-03 15:00:00",
        preLoadOffset: 500,

        // 10. User Profile / 用户画像
        //     The AI will use this information to answer questions.
        //     AI 将根据此信息回答问题。
        userProfile: `
            Name: John Doe
            Phone: 13800138000
            ID Card: 110101199001011234
            Email: test@example.com
            Address: Chaoyang District, Beijing
            Education: Bachelor
            Occupation: Developer
            Note: None
            Agree to Terms: Yes/Agree
        `,

        // 11. Multi-Round / Pagination / 多轮填写与分页
        //     maxRounds: Maximum number of rounds to scan and fill.
        //               Useful for multi-page forms or forms with conditional logic.
        //               设置最大扫描填写轮数，适用于多页问卷或有条件逻辑的问卷。
        maxRounds: 2,

        // 12. Debug Mode / 调试模式
        //     If true, prints the HTML payload and AI plan to the console.
        debug: true
    };

    // =========================================================================
    // [PROVIDER DEFAULTS] - Do not modify unless you know what you're doing
    // 提供商默认值 - 除非你清楚在做什么，否则不要修改
    // =========================================================================
    const PROVIDER_DEFAULTS = {
        1: { // OpenAI-compatible (base URL, /chat/completions is appended automatically)
            url: "https://api.openai.com/v1",
            model: "gpt-5.2"
        },
        2: { // Gemini
            url: "https://generativelanguage.googleapis.com/v1beta",
            model: "gemini-3-flash-preview"
        },
        3: { // Anthropic
            url: "https://api.anthropic.com/v1/messages",
            model: "claude-opus-4.6"
        }
    };

    // Resolve effective values
    function getEffectiveUrl() {
        return CONFIG.apiUrl || PROVIDER_DEFAULTS[CONFIG.apiProvider]?.url || "";
    }
    function getEffectiveModel() {
        return CONFIG.modelName || PROVIDER_DEFAULTS[CONFIG.apiProvider]?.model || "";
    }

    // =========================================================================
    // [UI & STATUS MANAGEMENT]
    // =========================================================================
    let statusDiv = null;
    let elementMap = new Map();

    function initUI() {
        if (statusDiv) return;
        statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 2147483647;
            background: rgba(0,0,0,0.8); color: #00ff00; padding: 8px 12px;
            border-radius: 4px; font-family: sans-serif; font-size: 12px;
            pointer-events: none; user-select: none; transition: all 0.2s;
        `;
        statusDiv.innerText = '🤖 AI: Standby';
        document.body.appendChild(statusDiv);
    }

    function updateStatus(text, color = '#00ff00') {
        if (!statusDiv) initUI();
        statusDiv.style.color = color;
        statusDiv.innerText = `🤖 ${text}`;
        console.log(`[AI Auto-Filler] ${text}`);
    }

    // =========================================================================
    // [CORE UTILS: INPUT SIMULATION]
    // Handles React/Vue/Angular state hijacking issues
    // =========================================================================

    function simulateInput(element, value) {
        if (!element) return;
        element.focus();

        const tag = element.tagName.toLowerCase();
        let proto;

        if (tag === 'textarea') {
            proto = window.HTMLTextAreaElement.prototype;
        } else if (tag === 'select') {
            proto = window.HTMLSelectElement.prototype;
        } else {
            proto = window.HTMLInputElement.prototype;
        }

        try {
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
            if (nativeSetter) {
                nativeSetter.call(element, value);
            } else {
                element.value = value;
            }
        } catch (e) {
            console.warn(`Native setter failed for ${tag}, fallback to direct assignment.`, e);
            element.value = value;
        }

        const eventTypes = ['input', 'change', 'blur', 'focusout'];
        eventTypes.forEach(type => {
            element.dispatchEvent(new Event(type, { bubbles: true }));
        });
    }

    function simulateClick(element) {
        if (!element) return;
        try {
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
            // Correct user interaction order: pointer/mouse down → up → click
            element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
            element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            element.click();
        } catch (e) {
            console.error("Click failed", e);
        }
    }

    // =========================================================================
    // [DOM EXTRACTION]
    // Converts HTML to a simplified format for the LLM to save tokens.
    // After extraction, heuristic question-group markers ("--- Q ---") are
    // inserted to help the AI identify question boundaries.
    // =========================================================================

    function isInteractive(el) {
        const tag = el.tagName.toLowerCase();
        if (['input', 'textarea', 'select', 'button', 'option'].includes(tag)) return true;
        // Semantic role-based detection instead of cursor:pointer to reduce noise
        const role = el.getAttribute('role');
        if (role && ['button', 'option', 'radio', 'checkbox', 'menuitem',
            'menuitemradio', 'menuitemcheckbox', 'tab', 'switch', 'combobox',
            'listbox', 'slider', 'spinbutton'].includes(role)) return true;
        // Also check for elements with click handlers via common data attributes
        if (el.getAttribute('data-value') !== null ||
            el.getAttribute('data-index') !== null) return true;
        return false;
    }

    /**
     * Find the best root element for form extraction.
     * Tries platform-specific containers first, then <form>, then body.
     */
    function findFormRoot() {
        // Platform-specific selectors (ordered by specificity)
        const platformSelectors = [
            // 问卷星 (wjx.cn / wjx.top)
            '#divQuestion', '.fieldset_container', '#contentDiv',
            // 腾讯问卷 (docs.qq.com/form)
            '.question-list', '.survey-body', '.render-content',
            // Generic form fallback
            'form[action]', 'form'
        ];
        for (const sel of platformSelectors) {
            const el = document.querySelector(sel);
            if (el && el.querySelector('input, textarea, select, [role="radio"], [role="checkbox"]')) {
                if (CONFIG.debug) console.log(`[AI Auto-Filler] Form root: ${sel}`);
                return el;
            }
        }
        if (CONFIG.debug) console.log('[AI Auto-Filler] Form root: document.body (fallback)');
        return document.body;
    }

    function generateSimplifiedDOM(root) {
        elementMap.clear();
        let idCounter = 0;
        let output = [];

        function traverse(node, depth) {
            if (!node || node.nodeType !== 1 ||
                (node.offsetWidth <= 0 && node.offsetHeight <= 0 && node.tagName !== 'OPTION')) {
                return;
            }

            const tag = node.tagName.toLowerCase();
            if (['script', 'style', 'svg', 'path', 'noscript', 'meta', 'link', 'img', 'iframe'].includes(tag)) return;

            let directText = "";
            node.childNodes.forEach(child => {
                if (child.nodeType === 3) directText += child.textContent.trim() + " ";
            });
            directText = directText.trim();

            const placeholder = node.getAttribute('placeholder');
            const ariaLabel = node.getAttribute('aria-label');
            const type = node.getAttribute('type');
            const name = node.getAttribute('name');
            const forAttr = node.getAttribute('for');
            const role = node.getAttribute('role');
            const isRequired = node.hasAttribute('required') ||
                node.getAttribute('aria-required') === 'true' ||
                node.hasAttribute('data-required');
            const isDisabled = node.hasAttribute('disabled');

            const interactive = isInteractive(node);

            if (interactive || directText || placeholder || ariaLabel || tag === 'label') {
                const myId = `el_${idCounter++}`;
                elementMap.set(myId, node);

                const indent = "  ".repeat(depth);
                let line = `${indent}<${tag}`;

                if (interactive) line += ` _ai_id="${myId}"`;
                if (type) line += ` type="${type}"`;
                if (name) line += ` name="${name}"`;
                if (placeholder) line += ` placeholder="${placeholder}"`;
                if (ariaLabel) line += ` label="${ariaLabel}"`;
                if (forAttr) line += ` for="${forAttr}"`;
                if (role) line += ` role="${role}"`;
                if (isRequired) line += ` required`;
                if (isDisabled) line += ` disabled`;

                line += ">";
                if (directText) line += ` ${directText}`;

                // Show current value / state for interactive elements
                if (tag === 'input' && (type === 'radio' || type === 'checkbox')) {
                    line += node.checked ? " [CHECKED]" : "";
                } else if (tag === 'option') {
                    if (node.selected) line += " [SELECTED]";
                    const val = node.getAttribute('value');
                    if (val !== null && val !== directText) line += ` value="${val}"`;
                } else if ((tag === 'input' || tag === 'textarea') && node.value) {
                    line += ` [current="${node.value}"]`;
                } else if (tag === 'select' && node.value) {
                    const selectedOption = node.options?.[node.selectedIndex];
                    const selectedText = selectedOption?.textContent?.trim() || node.value;
                    line += ` [current="${selectedText}"]`;
                }

                output.push(line);
            }

            Array.from(node.children).forEach(child => traverse(child, depth + 1));
        }

        traverse(root, 0);
        return injectQuestionGroupMarkers(output).join("\n");
    }

    /**
     * Heuristic question group detection.
     * Inserts "--- Q ---" markers between detected question groups.
     * Best-effort & platform-agnostic: if no heuristics match, output is unchanged.
     */
    function injectQuestionGroupMarkers(lines) {
        if (lines.length < 2) return lines;

        const result = [];
        let lastRadioName = null;
        let hasInsertedAny = false;

        // Patterns for question number/title prefixes (platform-agnostic)
        const questionNumRe = /^(?:\d{1,3}[\.)、．）]\s*|Q\d{1,3}[\s.:：]|第.{1,4}[题问]\s*|[一二三四五六七八九十]{1,2}[、．.]\s*|\(\d{1,3}\)\s*|[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮])/i;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const indent = (line.match(/^(\s*)/) || ['', ''])[1].length;
            let shouldMark = false;

            // Extract text content after the HTML ">"
            const textAfterTag = line.match(/>\s*(.+)/);
            const text = textAfterTag ? textAfterTag[1].replace(/\s*\[.*$/, '').trim() : '';

            // Heuristic 1: Question number prefix at shallow depth
            if (text && indent <= 4 && questionNumRe.test(text)) {
                shouldMark = true;
            }

            // Heuristic 2: Semantic group markers (ARIA / HTML5)
            if (/role="(?:group|radiogroup)"/.test(line) || /<fieldset\b/.test(line)) {
                shouldMark = true;
            }

            // Heuristic 3: New radio/checkbox name group
            const nameMatch = line.match(/name="([^"]+)"/);
            const isCheckable = /type="(?:radio|checkbox)"/.test(line) ||
                /role="(?:radio|checkbox)"/.test(line);
            if (nameMatch && isCheckable) {
                if (lastRadioName !== null && nameMatch[1] !== lastRadioName) {
                    shouldMark = true;
                }
                lastRadioName = nameMatch[1];
            } else if (!isCheckable && line.includes('_ai_id=')) {
                // Non-checkable interactive element after a radio group → likely new question
                if (lastRadioName !== null) {
                    shouldMark = true;
                    lastRadioName = null;
                }
            }

            // Insert marker (avoid consecutive duplicates)
            if (shouldMark && result.length > 0 && result[result.length - 1] !== '--- Q ---') {
                result.push('--- Q ---');
                hasInsertedAny = true;
            }

            result.push(line);
        }

        // Only return marked output if heuristics found at least one boundary
        return hasInsertedAny ? result : lines;
    }

    // =========================================================================
    // [MULTI-PROVIDER API LOGIC]
    // Supports: 1 = OpenAI-compatible, 2 = Gemini, 3 = Anthropic
    // 支持：1 = OpenAI 兼容格式, 2 = Gemini, 3 = Anthropic
    // =========================================================================

    /**
     * Smart fetch: tries native fetch() first (follows browser/extension proxy),
     * falls back to GM_xmlhttpRequest (bypasses CORS) if fetch fails.
     * 智能请求：优先使用 fetch()（遵循浏览器/扩展代理设置），
     * 若因 CORS 等原因失败则回退到 GM_xmlhttpRequest（绕过跨域限制）。
     */
    async function gmFetch(url, options) {
        // Strategy 1: Try native fetch() - follows browser & extension proxy settings
        try {
            const response = await fetch(url, options);
            if (CONFIG.debug) console.log('[AI Auto-Filler] fetch() succeeded');
            return response;
        } catch (fetchError) {
            if (CONFIG.debug) {
                console.log('[AI Auto-Filler] fetch() failed, falling back to GM_xmlhttpRequest:', fetchError.message);
            }
        }

        // Strategy 2: Fall back to GM_xmlhttpRequest - bypasses CORS
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                data: options.body || undefined,
                responseType: 'json',
                onload: function (response) {
                    resolve({
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        json: () => Promise.resolve(typeof response.response === 'string' ? JSON.parse(response.response) : response.response),
                        text: () => Promise.resolve(response.responseText)
                    });
                },
                onerror: function (error) {
                    reject(new Error(`Network error (GM_xmlhttpRequest): ${error.statusText || 'Request failed'}. Check proxy settings.`));
                },
                ontimeout: function () {
                    reject(new Error('Request timed out'));
                }
            });
        });
    }

    /**
     * Build the API request (url + fetch options) for the configured provider.
     * Accepts { systemPrompt, userPrompt } for proper role separation.
     * 根据配置的提供商构建 API 请求（URL + fetch 选项）。
     */
    function buildApiRequest({ systemPrompt, userPrompt }) {
        const provider = CONFIG.apiProvider;
        const model = getEffectiveModel();
        const baseUrl = getEffectiveUrl();

        switch (provider) {
            // -----------------------------------------------------------------
            // Provider 1: OpenAI-compatible
            // -----------------------------------------------------------------
            case 1: {
                const body = {
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    response_format: { type: "json_object" },
                    ...CONFIG.customParams  // Merge user-defined extra params (e.g. temperature, reasoning_effort)
                };
                // Auto-append /chat/completions to the base URL
                const apiEndpoint = baseUrl.replace(/\/+$/, '') + '/chat/completions';
                return {
                    url: apiEndpoint,
                    options: {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${CONFIG.apiKey}`
                        },
                        body: JSON.stringify(body)
                    }
                };
            }

            // -----------------------------------------------------------------
            // Provider 2: Google Gemini
            // -----------------------------------------------------------------
            case 2: {
                const url = `${baseUrl}/models/${model}:generateContent?key=${CONFIG.apiKey}`;
                const generationConfig = {
                    responseMimeType: "application/json"
                };
                // Thinking chain support for Gemini
                if (CONFIG.thinkingBudget > 0) {
                    generationConfig.thinkingConfig = { thinkingBudget: CONFIG.thinkingBudget };
                }
                const body = {
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ parts: [{ text: userPrompt }] }],
                    generationConfig: generationConfig
                };
                return {
                    url: url,
                    options: {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    }
                };
            }

            // -----------------------------------------------------------------
            // Provider 3: Anthropic Claude
            // -----------------------------------------------------------------
            case 3: {
                const body = {
                    model: model,
                    max_tokens: 4096,
                    system: systemPrompt,
                    messages: [
                        { role: "user", content: userPrompt }
                    ]
                };
                // Thinking chain support for Anthropic (extended thinking)
                if (CONFIG.thinkingBudget > 0) {
                    body.thinking = {
                        type: "enabled",
                        budget_tokens: CONFIG.thinkingBudget
                    };
                }
                return {
                    url: baseUrl,
                    options: {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': CONFIG.apiKey,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify(body)
                    }
                };
            }

            default:
                throw new Error(`Unknown API provider: ${provider}. Use 1 (OpenAI), 2 (Gemini), or 3 (Anthropic).`);
        }
    }

    /**
     * Parse the API response to extract the JSON text content.
     * 解析 API 响应，提取 JSON 文本内容。
     */
    function parseApiResponse(data) {
        const provider = CONFIG.apiProvider;

        // Detect token truncation
        const truncationChecks = {
            1: () => data.choices?.[0]?.finish_reason === 'length',
            2: () => data.candidates?.[0]?.finishReason === 'MAX_TOKENS',
            3: () => data.stop_reason === 'max_tokens'
        };
        if (truncationChecks[provider]?.()) {
            console.warn('[AI Auto-Filler] ⚠️ Response truncated (token limit hit). Output may be incomplete.');
        }

        // Log token usage in debug mode
        if (CONFIG.debug) {
            try {
                const usageStr = {
                    1: () => data.usage && `Tokens: ${data.usage.prompt_tokens} in → ${data.usage.completion_tokens} out (${data.usage.total_tokens} total)`,
                    2: () => data.usageMetadata && `Tokens: ${data.usageMetadata.promptTokenCount} in → ${data.usageMetadata.candidatesTokenCount} out (${data.usageMetadata.totalTokenCount} total)`,
                    3: () => data.usage && `Tokens: ${data.usage.input_tokens} in → ${data.usage.output_tokens} out`
                }[provider]?.();
                if (usageStr) console.log(`[AI Auto-Filler] ${usageStr}`);
            } catch (_) { /* ignore usage parsing errors */ }
        }

        switch (provider) {
            case 1: {
                // OpenAI-compatible: data.choices[0].message.content
                if (data.error) {
                    throw new Error(data.error.message || JSON.stringify(data.error));
                }
                if (!data.choices || !data.choices[0]) {
                    throw new Error("Invalid OpenAI response: no choices returned");
                }
                return data.choices[0].message.content;
            }

            case 2: {
                // Gemini: data.candidates[0].content.parts[N].text (skip thinking parts)
                if (data.error) {
                    throw new Error(data.error.message || JSON.stringify(data.error));
                }
                if (!data.candidates || !data.candidates[0]) {
                    throw new Error("Invalid Gemini response: no candidates returned");
                }
                const parts = data.candidates[0].content.parts;
                // Find the text part (skip thinking parts if present)
                for (const part of parts) {
                    if (part.text !== undefined && !part.thought) {
                        return part.text;
                    }
                }
                // Fallback: return the last part's text
                return parts[parts.length - 1].text;
            }

            case 3: {
                // Anthropic: data.content[] -> find block with type === "text"
                if (data.error) {
                    throw new Error(data.error.message || JSON.stringify(data.error));
                }
                if (!data.content || !Array.isArray(data.content)) {
                    throw new Error("Invalid Anthropic response: no content array returned");
                }
                const textBlock = data.content.find(block => block.type === "text");
                if (!textBlock) {
                    throw new Error("Invalid Anthropic response: no text block found");
                }
                return textBlock.text;
            }

            default:
                throw new Error(`Unknown API provider: ${provider}`);
        }
    }

    /**
     * Get the provider display name for status messages.
     */
    function getProviderName() {
        switch (CONFIG.apiProvider) {
            case 1: return "OpenAI";
            case 2: return "Gemini";
            case 3: return "Anthropic";
            default: return "AI";
        }
    }

    // =========================================================================
    // [JSON EXTRACTION & VALIDATION]
    // =========================================================================

    /**
     * Extract JSON from LLM response text, tolerating markdown fences and extra text.
     */
    function extractJSON(text) {
        if (!text || typeof text !== 'string') throw new Error('Empty response from AI');
        text = text.trim();

        // Unwrap common wrapper objects (e.g. {"actions": [...]})
        function unwrap(parsed) {
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object') {
                for (const key of ['actions', 'plan', 'steps', 'data', 'results']) {
                    if (Array.isArray(parsed[key])) return parsed[key];
                }
                return [parsed];
            }
            return [parsed];
        }

        // 1. Try direct parse
        try { return unwrap(JSON.parse(text)); } catch (_) { /* continue */ }

        // 2. Try extracting from ```json ... ``` or ``` ... ``` fences
        const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            try { return unwrap(JSON.parse(fenceMatch[1].trim())); } catch (_) { /* continue */ }
        }

        // 3. Try finding [ ... ] array block
        const bracketMatch = text.match(/(\[\s*\{[\s\S]*\}\s*\])/);
        if (bracketMatch) {
            try { return JSON.parse(bracketMatch[1]); } catch (_) { /* continue */ }
        }

        // 4. Try finding { ... } object block (greedy, for wrapper objects)
        const objectMatch = text.match(/(\{[\s\S]*\})/);
        if (objectMatch) {
            try { return unwrap(JSON.parse(objectMatch[1])); } catch (_) { /* continue */ }
        }

        throw new Error(`Failed to extract JSON from AI response. Raw text: ${text.substring(0, 300)}`);
    }

    /**
     * Validate and filter the AI plan, keeping only valid steps.
     */
    function validatePlan(plan) {
        if (!Array.isArray(plan)) {
            if (plan && typeof plan === 'object') plan = [plan];
            else throw new Error('AI plan is not an array or object');
        }

        const valid = [];
        for (let i = 0; i < plan.length; i++) {
            const step = plan[i];
            if (!step || typeof step !== 'object') {
                console.warn(`[AI Auto-Filler] Skipping invalid step ${i}: not an object`);
                continue;
            }
            if (typeof step.id !== 'string' || !step.id.startsWith('el_')) {
                console.warn(`[AI Auto-Filler] Skipping step ${i}: invalid id "${step.id}"`);
                continue;
            }
            if (step.action !== 'fill' && step.action !== 'click' && step.action !== 'skip') {
                console.warn(`[AI Auto-Filler] Skipping step ${i}: invalid action "${step.action}"`);
                continue;
            }
            if (step.action === 'fill' && (step.value === undefined || step.value === null)) {
                console.warn(`[AI Auto-Filler] Skipping step ${i} (${step.id}): fill action missing value`);
                continue;
            }
            valid.push(step);
        }

        if (valid.length === 0 && plan.length > 0) {
            console.error('[AI Auto-Filler] All steps were invalid! Original plan:', plan);
        }

        return valid;
    }

    /**
     * Wait for DOM to stabilize (no mutations for a period).
     * Used after page navigation or conditional logic triggers.
     */
    function waitForDOMStable(stableMs = 500, timeoutMs = 5000) {
        return new Promise(resolve => {
            let timer = null;
            const observer = new MutationObserver(() => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    observer.disconnect();
                    resolve(true);
                }, stableMs);
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
            // Initial timer in case DOM is already stable
            timer = setTimeout(() => {
                observer.disconnect();
                resolve(true);
            }, stableMs);
            // Hard timeout
            setTimeout(() => {
                observer.disconnect();
                resolve(false);
            }, timeoutMs);
        });
    }

    // =========================================================================
    // [AI AGENT LOGIC]
    // =========================================================================

    async function runAgent(round = 1) {
        const providerName = getProviderName();
        updateStatus("Scanning Page...", "yellow");

        // 1. Snapshot DOM from the best form root
        const formRoot = findFormRoot();
        const simplifiedHTML = generateSimplifiedDOM(formRoot);

        if (CONFIG.debug) {
            console.log("--- Payload Sent to AI ---");
            console.log(simplifiedHTML);
        }

        // 2. Construct System + User Prompts (separated for proper role handling)
        const systemPrompt = `You are a questionnaire auto-fill agent. Analyze the simplified HTML and output a JSON action plan.

## Actions
- "fill": Set value of <input>/<textarea>/<select>. Requires "value" field.
- "click": Click radio/checkbox/option elements.
- "skip": Explicitly skip a question you cannot confidently answer. Optional "reason" field.

## Rules
1. Match questions to inputs by DOM hierarchy and \`for\`/\`name\` attributes. Lines marked "--- Q ---" are heuristic question-boundary hints.
2. Use the User Profile for personal info (name, phone, email, etc.).
3. For opinion/attitude scales: pick a moderately positive option (e.g. 4/5, "比较满意"). Avoid extremes.
4. For unknown preference questions: choose the most common or neutral answer.
5. For agreements/consent: always accept.
6. For matrix/grid questions: fill each sub-item as a separate action.
7. For <select>: use "fill" with the option text. For radio/checkbox: use "click" on the matching element.
8. Skip [disabled] elements. Always fill [required] elements.
9. Do NOT click submit/next-page buttons — handled separately.
10. Elements with [CHECKED] or [current=...] are already answered — skip unless incorrect.

## Output
JSON array only. No markdown, no explanation.
{"id": "<_ai_id>", "action": "fill"|"click"|"skip", "value": "<for fill only>", "reason": "<for skip only>"}

Example:
  <label> 性别
    <div _ai_id="el_5" role="radio"> 男
    <div _ai_id="el_6" role="radio"> 女
→ [{"id":"el_5","action":"click"}]`;

        const roundInfo = round > 1
            ? `\nNote: This is round ${round}. Elements with [CHECKED] or [current=...] were filled in previous rounds — only handle new or unfilled elements.\n`
            : '';
        const userPrompt = `User Profile:
${CONFIG.userProfile}
${roundInfo}
Form HTML:
${simplifiedHTML}

Output your JSON action plan.`;

        updateStatus(`${providerName} Thinking...`, "#00ffff");

        // 3. Build request and call API with retry
        const maxAttempts = 1 + Math.max(0, CONFIG.retryCount);
        let lastError = null;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                if (attempt > 1) {
                    updateStatus(`Retry ${attempt - 1}/${CONFIG.retryCount}...`, "orange");
                    await new Promise(r => setTimeout(r, CONFIG.retryDelayMs));
                }

                const { url, options } = buildApiRequest({ systemPrompt, userPrompt });

                if (CONFIG.debug) {
                    console.log(`--- API Request (attempt ${attempt}/${maxAttempts}) ---`);
                    console.log("URL:", url);
                    console.log("Body:", options.body);
                }

                const response = await gmFetch(url, options);

                // Check HTTP status before parsing
                if (!response.ok) {
                    let errMsg = `HTTP ${response.status} ${response.statusText}`;
                    try {
                        const errData = await response.json();
                        errMsg += `: ${errData.error?.message || errData.error || JSON.stringify(errData)}`;
                    } catch (_) {
                        const errText = await response.text();
                        if (errText) errMsg += `: ${errText.substring(0, 200)}`;
                    }
                    throw new Error(errMsg);
                }

                const data = await response.json();

                if (CONFIG.debug) {
                    console.log("--- API Response ---");
                    console.log(JSON.stringify(data, null, 2));
                }

                const planText = parseApiResponse(data);
                const plan = validatePlan(extractJSON(planText));

                console.log(`${providerName} Plan:`, plan);
                const result = await executePlan(plan);
                return { ...result, domSnapshot: simplifiedHTML }; // Include DOM for multi-round comparison

            } catch (e) {
                lastError = e;
                console.error(`[AI Auto-Filler] Attempt ${attempt}/${maxAttempts} failed:`, e);

                if (attempt < maxAttempts) {
                    console.log(`[AI Auto-Filler] Will retry in ${CONFIG.retryDelayMs}ms...`);
                }
            }
        }

        // All attempts failed
        updateStatus(`Error: ${lastError.message}`, "red");
        return { filled: 0, clicked: 0, skipped: 0, submitBtn: null, domSnapshot: '' };
    }

    async function executePlan(plan) {
        updateStatus(`Executing ${plan.length} actions...`, "#00ff00");

        let submitBtn = null;
        let nextPageBtn = null;
        let filled = 0, clicked = 0, skipped = 0, fillFailed = 0, clickFailed = 0, aiSkipped = 0;
        const submitKeywords = ['提交', 'submit', '下一步', '完成', '结束', 'next', '下一页'];

        for (const step of plan) {
            const el = elementMap.get(step.id);
            if (!el) {
                skipped++;
                if (CONFIG.debug) console.warn(`[AI Auto-Filler] Element not found: ${step.id}`);
                continue;
            }

            const text = (el.innerText || el.value || "").toLowerCase();

            // Detect submit buttons
            if (step.action === 'click' && submitKeywords.some(kw => text.includes(kw))) {
                // Distinguish next-page vs final submit
                if (text.includes('下一步') || text.includes('next') || text.includes('下一页')) {
                    nextPageBtn = el;
                } else {
                    submitBtn = el;
                }
                continue;
            }

            if (step.action === 'fill') {
                simulateInput(el, step.value);
                // Verify the fill took effect
                if (el.value !== String(step.value)) {
                    fillFailed++;
                    if (CONFIG.debug) console.warn(`[AI Auto-Filler] Fill verification failed for ${step.id}: expected "${step.value}", got "${el.value}"`);
                }
                filled++;
            } else if (step.action === 'click') {
                simulateClick(el);
                // Verify click for checkable elements
                const checkable = el.type === 'radio' || el.type === 'checkbox' ||
                    el.getAttribute('role') === 'radio' || el.getAttribute('role') === 'checkbox';
                if (checkable && !el.checked && el.getAttribute('aria-checked') !== 'true') {
                    clickFailed++;
                    if (CONFIG.debug) console.warn(`[AI Auto-Filler] Click verify failed for ${step.id}`);
                }
                clicked++;
            } else if (step.action === 'skip') {
                aiSkipped++;
                if (CONFIG.debug) console.log(`[AI Auto-Filler] AI skipped ${step.id}: ${step.reason || ''}`);
            }

            await new Promise(r => setTimeout(r, 50));
        }

        const statsMsg = `Done: ${filled} filled, ${clicked} clicked, ${skipped} skipped` +
            (aiSkipped > 0 ? `, ${aiSkipped} AI-skipped` : '') +
            (fillFailed > 0 ? `, ${fillFailed} fill-verify-failed` : '') +
            (clickFailed > 0 ? `, ${clickFailed} click-verify-failed` : '');
        console.log(`[AI Auto-Filler] ${statsMsg}`);
        updateStatus(statsMsg, skipped > 0 || fillFailed > 0 || clickFailed > 0 ? 'orange' : '#00ff00');

        return { filled, clicked, skipped, submitBtn, nextPageBtn };
    }

    function finalize(submitBtn) {
        // Check for missing required fields (native + custom attributes)
        const requiredSelectors = [
            'input[required]', 'textarea[required]', 'select[required]',
            '[aria-required="true"]', '[data-required]'
        ];
        const inputs = document.querySelectorAll(requiredSelectors.join(', '));
        let missing = false;
        inputs.forEach(el => {
            if (!el.value) {
                el.style.boxShadow = "0 0 10px red";
                el.style.border = "2px solid red";
                missing = true;
            }
        });

        if (missing) {
            updateStatus("Found missing fields!", "red");
            return;
        }

        if (submitBtn) {
            if (CONFIG.autoSubmit) {
                updateStatus(`Submitting in ${CONFIG.submitDelay}ms...`, "orange");
                setTimeout(() => submitBtn.click(), CONFIG.submitDelay);
            } else {
                submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                submitBtn.style.border = "4px solid #00ff00";
                updateStatus("Ready to Submit", "white");
            }
        } else {
            updateStatus("Finished (No submit btn)", "white");
        }
    }

    // =========================================================================
    // [ENTRY POINT]
    // =========================================================================

    /**
     * Multi-round agent loop: runs runAgent, handles pagination and conditional logic.
     * After each round, if a next-page button is found, clicks it and re-scans.
     */
    async function runMultiRound() {
        const maxRounds = Math.max(1, CONFIG.maxRounds || 1);
        let lastSubmitBtn = null;

        for (let round = 1; round <= maxRounds; round++) {
            if (round > 1) {
                updateStatus(`Round ${round}/${maxRounds}: Scanning...`, "yellow");
            }

            const result = await runAgent(round);

            if (result.submitBtn) lastSubmitBtn = result.submitBtn;

            // If there's a next-page button, click it and continue to next round
            if (result.nextPageBtn) {
                updateStatus(`Navigating to next page...`, "#00ffff");
                simulateClick(result.nextPageBtn);
                // Wait for DOM to stabilize after page navigation
                await waitForDOMStable(800, 5000);
                continue;
            }

            // If this round produced actions but no next-page, check if DOM changed
            // (conditional logic may have revealed new questions)
            if (result.filled > 0 || result.clicked > 0) {
                const domChanged = await waitForDOMStable(500, 2000);
                // Quick re-scan: check if DOM has actually changed
                const newFormRoot = findFormRoot();
                const newDOM = generateSimplifiedDOM(newFormRoot);
                const hasNewContent = newDOM !== result.domSnapshot;
                // If DOM has changed (new elements appeared), do another round
                if (hasNewContent && round < maxRounds) {
                    // Check if there are unfilled required fields
                    const requiredFields = newFormRoot.querySelectorAll(
                        'input[required]:not([disabled]), textarea[required]:not([disabled]), select[required]:not([disabled]), [aria-required="true"]:not([disabled])');
                    const hasUnfilled = Array.from(requiredFields).some(el => !el.value);
                    if (hasUnfilled) {
                        console.log(`[AI Auto-Filler] Round ${round}: Found unfilled required fields, continuing...`);
                        continue;
                    }
                }
            }

            // No next page and no new fields, done
            break;
        }

        finalize(lastSubmitBtn);
    }

    function main() {
        initUI();

        // Pre-warm connection based on provider
        try {
            if (CONFIG.apiProvider === 2) {
                const baseUrl = getEffectiveUrl();
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: `${baseUrl}/models/${getEffectiveModel()}?key=${CONFIG.apiKey}`,
                    onerror: () => { }
                });
            }
        } catch (e) { /* ignore pre-warm errors */ }

        const now = Date.now();
        const target = new Date(CONFIG.targetTime).getTime();

        if (target > now) {
            const waitTime = target - now - CONFIG.preLoadOffset;
            updateStatus(`Wait ${(waitTime / 1000).toFixed(1)}s`, "white");

            const timer = setInterval(() => {
                const n = Date.now();
                if (n >= target - CONFIG.preLoadOffset) {
                    clearInterval(timer);
                    runMultiRound();
                } else {
                    statusDiv.innerText = `🤖 Wait: ${((target - CONFIG.preLoadOffset - n) / 1000).toFixed(1)}s`;
                }
            }, 100);
        } else {
            runMultiRound();
        }
    }

    GM_registerMenuCommand("🚀 Run Auto-Filler", main);
    window.addEventListener('load', main);

})();