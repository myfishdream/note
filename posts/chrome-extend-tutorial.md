---
title: 开发一个Chrome插件的完整流程有哪些，manifest.json是什么，通信怎么实现
date: 2025-04-24
category: Exploitation
tags: 
    - Chrome
    - 插件
description: 比如开发一个广告拦截插件，主题切换插件，选中翻译插件，总有你需要的插件
draft: false
outline: [2,3]
# sticky: true
done: false
gridPaper: false
---

## **核心文件**

一个 Chrome 扩展主要由以下几个部分组成：

1. **`manifest.json`** - 配置文件（必须）
2. **`background.js`** - 后台脚本（可选，用于长期运行的任务）
3. **`content_scripts.js`** - 内容脚本（可选，注入到网页中）
4. **`popup.html` + `popup.js`** - 弹出窗口（可选，点击扩展图标时显示）
5. **`options.html`** - 选项页面（可选，配置扩展设置）

### manifest.json

```json
{
    "manifest_version": 3,  // 必须，推荐用 v3（最新版）
    "name": "我的第一个扩展",
    "version": "1.0",
    "description": "一个简单的 Chrome 扩展示例",
    "action": {
        "default_popup": "popup.html",  // 点击图标时弹出的页面
        "default_icon": "icon.png"      // 扩展图标
    },
    "icons": {
        "16": "images/icon16.png",
        ...
    },
        "permissions": [
            "activeTab"  // 请求权限（可选）
        ],
        "content_scripts": [	// 内容脚本
            {
                "matches": ["<all_urls>"],
                "js": ["content.js"]
            }
        ],
        "background": {		// 后台脚本
            "service_worker": "background.js"
        }
    }
```

**获取当前标签页**

```js
 let [tab] = await chrome.tabs.query({ active: true,currentWindow: true });
```

**在当前标签页执行脚本**

```js
chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: 脚本名,
  });
});
```

**chrome.tabs.query** 获取当前激活的标签页。

**chrome.scripting.executeScript**向网页注入 JS 代码

> [!TIP]  注意
>
> `changePageBackgroundColor` 是在**目标网页**的上下文中执行的，而不是扩展的上下文！

**content_scripts**会在匹配的网页加载时自动执行脚本	

**permissions**声明所需要的权限

```json
{
  "permissions": ["storage"]
}
```

```js
// 存数据
await chrome.storage.local.set({ key: "value" });

// 取数据
const data = await chrome.storage.local.get("key");
console.log(data.key); // "value"
```

## **通信**

**`popup` ↔ `content_script` ↔ `background`**

**`popup` 发送消息给 `content_script`**

```js
// popup.js
chrome.tabs.sendMessage(tabId, { action: "doSomething" });

// content_script.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "doSomething") {
    console.log("收到消息！");
  }
});
```

## **完整项目模版**

GitHub 模板：https://github.com/GoogleChrome/chrome-extensions-samples

## 开发攻略

https://github.com/sxei/chrome-plugin-demo

## **开发工具**

**Chrome Extension CLI**
快速生成扩展模板：https://github.com/dutiyesh/chrome-extension-cli

**CRXJS**
支持用 React/Vue 开发扩展：https://github.com/crxjs/chrome-extension-tools
