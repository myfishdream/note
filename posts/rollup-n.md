---
title: Rollup打包工具参数解析，通俗易懂的解释其用法，场景等
date: 2025-04-07
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

![image-20250408134406929](https://yumengjh.github.io/picx-images-hosting/20250408/IMG_0500.2ks3kvqf63.jpeg)

将一组文件转换为另一种格式，并同时保持**文件结构**和**导出签名**，推荐的方法是**将每个文件变成一个入口文件**

> **Rollup官网示例** https://cn.rollupjs.org/configuration-options/#input

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

new URL(file, import.meta.url) // 创建一个基于当前模块URL的新的URL对象。

fileURLToPath(...)	// 将这个URL转换为文件系统路径，例如：src/main/eoo.js变成/project/src/main/eoo.js
```

```js
format: 'es'	// 指定输出的格式为ES模块（ESM)
dir: 'dist'	// 指定输出的目录为dist
```

**总结**：这段代码的作用是，使用`globSync`查找`src`目录下的所有的`.js`文件，将这些文件路径转换为相对于`src`目录的路径，并且去掉文件扩展名，再**将这些相对路径作为键，对应的绝对路径作为值**，生成一个对象作为`input`的参数，让这些文件打包到`dist`目录中，配置了`output`输出为ES模块格式。

### jsx

**什么是JSX？**

JSX是一种语法扩展，主要用于React框架中，它允许开发者在JavaScript中直接编写类似HTML的结构，

JSX最终会被编译为标准的JavaScript代码。

通常是`React.createElement()`调用，用来方便的构建UI组件

**jsx.mode**

该选项将决定如何处理 JSX

- `preserve`：将在输出中保持 JSX 语法
- `classic`：将执行 JSX 转换，旧版本的 React 或其他框架，例如 [Preact](https://preactjs.com)
- `automatic`：将使用 React 17 引入的 [新版 JSX 转换](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) 执行 JSX 转换

**jsx.factory**

当rollup在`classic`模式或`automatic`模式的回退中用来创建JSX元素的函数

对于`React`，通常是`React.createElement`，对于其他框架，则可能为 `h`

**jsx.fragment**

用于创建JSX片段的元素函数

**jsx.importSource**

导入**元素工厂函数**及**片段元素**的位置

**jsx.jsxImportSource**

当使用 `automatic` 模式时，将指定从哪里导入进行该转换所需的 `jsx`、`jsxs` 和 `Fragment` 辅助函数，这些是无法从全局变量获取的。

**jsx.preset**

允许选择上述预设中的一个，同时覆盖一些选项。

### output.dir

用于指定所有生成的**chunk**被放置在哪个目录中。如果生成的**chunk**个数是一个以上，那么该选项是必须的，**否则使用`file`选项代替**。

### output.file

用于指定要写入的文件，如果适用的话，也可以用于生成 **sourcemap**。只有在生成的 chunk 不超过一个的情况下才可以使用。

### output.format 

用于指定生成的bundle的格式

`amd` 异步模块加载，适用于require.js等模块加载器

`cjs` commonjs，适用于Node环境和其他打包工具

`es`    将bundle保留为ES模块文件，适用于其他打包工具，及支持`<script type=module>`的浏览器（别名：`esm`，`module`）

`iife` 自执行函数，适用于`<script>`标签，为你的应用程序创建 bundle，`iife` 表示：“自执行 [函数表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)”

`umd` 通用模块定义规范，同时支持`amd`，`cjs`，`iife`

`system` SystemJS模块加载器的原生格式

### output.globals

用于在`umd` / `iife` bundle 中，使用 `id: variableName` 键值对指定外部依赖

```js
import $ from 'jquery';
```

告诉 Rollup `jquery` 是外部依赖，`jquery` 模块的 ID 为全局变量 `$`：

```js
export default {
// ...
external: ['jquery'],
output: {
format: 'iife',
name: 'MyBundle',
globals: {
jquery: '$'
}
}
};

/*
var MyBundle = (function ($) {
  // 这里编辑代码
}($));
*/
```

或者，可以提供一个函数，将外部模块的 ID 变成一个**全局变量名**。

当要用全局变量替换本地文件时，需要使用一个绝对路径的 ID。

```js
// rollup.config.js
import { fileURLToPath } from 'node:url';
const externalId = fileURLToPath(
new URL(
'src/some-local-file-that-should-not-be-bundled.js',
import.meta.url
)
);

export default {
//...,
external: [externalId],
output: {
format: 'iife',
name: 'MyBundle',
globals: {
[externalId]: 'globalVariable'
}
}
};
```

### output.name 

在输出格式为`iife`和`umd`的bundle的时候，如果想要**使用全局变量名来表示bundle时**，该选项是必须的

可以让同一页面上的其他脚本使用这个变量名来访问你的 bundle 输出

> [!NOTE]
>
> 它让你的库可以在浏览器环境中通过一个全局变量名访问。
>
> - 当你的库需要在不支持模块系统的旧浏览器中使用
> - 当你想要通过`script`标签直接引入你的库
> - 当你的库需要和其他使用全局变量的库交互

**命名空间**

...

### output.plugins

指定输出使用的插件，**从包中引入的插件，使用的时候要<u>调用</u>**

使用压缩插件例子

```js
import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';
export default defineConfig({
	input: 'src/main.js',
	output: [{
		file: 'dist/bundle.js',
		format: 'iife',
		name: 'myBundle',
	}, {
		file: 'dist/bundle.min.js',
		format: 'iife',
		name: 'myBundle',
		plugins: [terser()],
	}]
});

```

### plugins

不错的插件集合 [the Rollup Awesome List](https://github.com/rollup/awesome)

## 进阶功能{#cdvanced}

### cache

cache属性用于提升构建性能，主要用于在监视模式或多次构建时复用前一次构建的结果。
