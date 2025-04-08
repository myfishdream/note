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

**数组**：

```js
input: ["src/index.js", "src/log.js"]
```

指定了多个入口文件，每个文件都会被视为一个独立的模块进行打包，最终生成**对应**的**多个输出文件**，需要配合`output.dir`配置项使用。

> [!important]
>
> 文件名通常由`Rollup`根据入口文件路径自动生成，但可以通过额外配置进行定制

**对象**：

```js
input: {
    a: "src/index.js",
    "b/index": "src/log.js"
}
```

指定了多个入口，并为每个入口指定一个**名称（键名）**，这样在输出的文件名中的可以使用这些名称来区分不同的模块。

> [!important]
>
> 对象的键表示打包后的文件名
>
> 可以是**相对路径**或**自定义名称**，值则是对应的入口文件**路径**

> [!important]
>
> 当选项的值使用对象形式时，可以通过在名称中添加 `/` 来将入口文件放入不同的子文件夹。

**示例:**

```js
export default {
  input: {
    main: 'src/main.js', // 将 src/main.js 打包为 main.js
    'utils/index': 'src/app.js' // 将 src/app.js 打包为 index.js
  },
  output: {
    dir: 'dist', // 输出目录
    format: 'esm', // 输出格式
entryFileNames: 'tree-[name].js'
  }
};

```

**输出结果:**

![image-20250408134406929](https://github.com/yumengjh/picx-images-hosting/raw/master/20250408/IMG_0500.8ojvn6zhmn.JPEG)

将一组文件转换为另一种格式，并同时保持**文件结构**和**导出签名**，推荐的方法是**将每个文件变成一个入口文件**

> **Rollup官网示例**

```js
// @filename: glob.d.ts
declare module 'glob' {
export function globSync(pattern: string): string[];
}

// @filename: index.js
// ---cut---
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default {
input: Object.fromEntries(
globSync('src/**/*.js').map(file => [
// 这里将删除 `src/` 以及每个文件的扩展名。
// 因此，例如 src/nested/foo.js 会变成 nested/foo
path.relative(
'src',
file.slice(0, file.length - path.extname(file).length)
),
// 这里可以将相对路径扩展为绝对路径，例如
// src/nested/foo 会变成 /project/src/nested/foo.js
fileURLToPath(new URL(file, import.meta.url))
])
),
output: {
format: 'es',
dir: 'dist'
}
};
```

**逐行解析**：

```js
import { globSync } from 'glob'; // 从 glob 库中导入的同步方法，用于匹配文件路径模式。
import path from 'node:path'; // Node.js 内置模块，用于处理和转换文件路径。
import { fileURLToPath } from 'node:url'; // 从 node:url 模块中导入的方法，用于将文件 URL 转换为文件系统路径。
```

```js
input: Object.fromEntries(); // 将键值对数组转换为对象。

globSync('src/**/*.js') // 使用 globSync 方法同步地查找所有匹配 src/**/*.js 模式的文件，即 src 目录下的所有 .js 文件（包括子目录中的文件）。

map(file => [ ... ]) //对每一个找到的文件路径进行映射操作，生成一个包含两个元素的数组。
```

```js
path.relative('src', file.slice(0, file.length - path.extname(file).length))

file.slice(0, file.length - path.extname(file).length) // 去掉文件的扩展名。例如src/nested/foo.js 变成 src/nested/foo。

path.relative('src', ...) // 计算相对于 src 目录的路径。例如，src/nested/foo 变成nested/foo。
```

```js
fileURLToPath(new URL(file, import.meta.url))


```
