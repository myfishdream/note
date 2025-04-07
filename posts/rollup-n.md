---
title: Rollup随记
date: 2025-4-7
category: Note
tags:
    - Rollup
description: 学习Rollup的一些笔记
draft: false
outline: [2,3]
---

# rollup.js

## 核心功能{#core}

### external

`external`配置项用于告诉`Rollup`，这些模块不要打包到最终的`bundle`中，让它们保持外部引用。

Me: `这些模块别打包，我自有安排`

<span style="font-weight:bold; color:#009900;">通俗理解：</span>

**某些依赖不打包，让它们在运行时从外部获取。**

**场景**：

**使用CDN引入库的时候**，比如在 HTML 中通过 `<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>` 引入了 lodash，就应该把 lodash 设为 external。

**当某些库会被其他方式提供时**，比如你的代码运行在 Node.js 环境，Node.js 本身会提供像 `fs`、`path` 这样的内置模块。<u>当你的运行环境提供了你运行时需要的库</u>。

**避免重复打包大型库**，如果你有多个 bundle 都用了 React，可以把 React 设为 external，然后通过 CDN 引入一次，而不是每个 bundle 都包含一份 React。

```js
// rollup.config.js
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  external: ['lodash', 'jquery'] // 这里列出不打包的模块名
};
```

**实际场景**：

假设你的代码中使用了 lodash，但你想通过 CDN 提供它：

配置 rollup.config.js

```js
external: ['lodash']
```

在 HTML 中：

```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
<script src="bundle.js"></script>
```

在你的代码中正常使用

```js
import * from 'lodash'; // Rollup 不会打包它，但运行时能从全局变量获取
```

未打包在一起的模块通常以下方式获取：

- 库会通过 CDN 引入
- 库是环境内置的
- 避免重复打包大型库

官方文档：https://cn.rollupjs.org/configuration-options/#external

### input
