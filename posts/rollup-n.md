---
title: Rollup打包工具参数解析，通俗易懂的解释其用法，场景等
date: 2025-04-07
category: Note
tags:
    - Rollup
description: 学习Rollup的一些笔记，通俗易懂的解释其用法，场景等，适合初学者，大佬勿喷。
draft: false
outline: [2,3]
sticky: true
done: true
---

# rollup.js

## 核心功能{#core}

::: details 现状😂

![bukanwendang](https://fish81.github.io/picx-images-hosting/20250414/bukanwendang.77dqud641r.png)

:::

### external

`external`配置项用于告诉`Rollup`，这些模块不要打包到最终的`bundle`中，让它们保持外部引用。

Me: `这些模块别打包，我自有安排`

<span style="font-weight:bold;">通俗理解：</span>

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
		plugins: [terser()],// [!code focus]
	}]
});

```

### plugins

不错的插件集合 [the Rollup Awesome List](https://github.com/rollup/awesome)

## 进阶功能{#cdvanced}

### cache

cache属性用于提升构建性能，主要用于在监视模式或多次构建时复用前一次构建的结果。

#### 演示实例

```js
const rollup = require('rollup'); //使用 Rollup 的 API 进行打包操作
let cache; // 用于存储 Rollup 的构建缓存 undefined

async function buildWithCache() {
	const bundle = await rollup.rollup({
		cache // 如果值为假，则忽略，不使用缓存，有则使用缓存
		// ... 其他输入项(配置项) 
	});
	cache = bundle.cache; // 保存之前构建的缓存对象，bundle.cache是返回的缓存对象，包含模块图和其它信息
	return bundle;
}

buildWithCache()
	.then(bundle => {
		// ... 操作 bundle
	})
	.then(() => buildWithCache()) // 将使用之前构建的缓存
	.then(bundle => {
		// ... 操作 bundle
	});
```

1. **首次构建**：没有缓存，完整构建
2. **后续构建**：使用 `bundle.cache` 加速，Rollup 只会重新处理**有变化的文件**
3. **缓存内容**：包括模块依赖图、AST 等信息，避免重复解析和构建未更改的模块

### logLevel

用于指定哪些日志将被处理，默认为`info`，意味着 info 和 warning 日志将被处理，而 debug 日志将被忽略，

**logLevel的不同级别**：

#### info

（默认级别），适合**开发环境**，获取最**详细的信息**

- 显示所有日志信息
- 包括普通信息、警告和错误
- 适合开发环境使用

#### warn

适合**测试环境**，关注**潜在问题**

- 只显示警告和错误

- 忽略普通信息日志

- 适合想要关注潜在问题的场景

#### error

适合**生产环境**，只关注**严重问题**

- 只显示错误信息

- 忽略警告和普通信息

- 适合只想看到严重问题的场景

#### silent

适合**CI/CD环境**，减少日志输出

- 不显示任何日志信息

- 完全安静模式

- 适合在自动化脚本中使用

- 除了构建结果外不显示任何信息

#### 示例

创建一个测试插件来生成不同级别的日志

```js
function createTestPlugin(level) {
	return {
		name: 'test-plugin',
		buildStart() {
			console.log(`[${level}] 开始构建...`);
			if (level !== 'silent') {
				console.log(`[${level}] 这是一条普通日志消息`);
				if (level !== 'error') {
					this.warn(`[${level}] 这是一条警告消息`);
					if (level === 'info') {
						console.debug(`[${level}] 这是一条调试消息`);
					}
				}
			}
		}
	};
}
```

导出多个配置，每个使用不同的日志级别

::: code-group

```js [info]
// 默认日志级别（info）
	defineConfig({
		input: 'src/main.js',
		output: {
			file: 'dist/bundle.info.js',
			format: 'iife',
			name: 'myBundle',
		},
		plugins: [createTestPlugin('INFO')],
		logLevel: 'info',  // 显示所有日志（默认值） [!code highlight]
	}),
```

```js [warn]
// 仅显示警告和错误
	defineConfig({
		input: 'src/main.js',
		output: {
			file: 'dist/bundle.warn.js',
			format: 'iife',
			name: 'myBundle',
		},
		plugins: [createTestPlugin('WARN')],
		logLevel: 'warn',  // 只显示警告和错误[!code highlight]
	}),
```

```js [error]
// 仅显示错误
	defineConfig({
		input: 'src/main.js',
		output: {
			file: 'dist/bundle.error.js',
			format: 'iife',
			name: 'myBundle',
		},
		plugins: [createTestPlugin('ERROR')],
		logLevel: 'error',  // 只显示错误[!code highlight]
	}),
```

```js [silent]
// 静默模式
	defineConfig({
		input: 'src/main.js',
		output: {
			file: 'dist/bundle.silent.js',
			format: 'iife',
			name: 'myBundle',
		},
		plugins: [createTestPlugin('SILENT')],
		logLevel: 'silent',  // 不显示任何日志[!code highlight]
	})
```

:::

### makeAbsoluteExternalsRelative

用于控制如何处理绝对路径的外部依赖

当设置为 `true` 时，会将绝对路径的**外部依赖**转换为相对路径，转换后的相对路径是相对于输出文件的位置计算的

**适用场景**：

- 当你使用绝对路径指定外部依赖时
- 希望输出文件在不同目录结构下都能正常工作
- 构建可移植的库或应用

### maxParallelFileOps

`maxParallelFileOps` 是 Rollup 的一个性能优化配置项，用于控制文件操作的并发数量。

可以在构建速度和系统资源消耗之间取得平衡，特别是在大型项目或资源受限的环境中尤为有用。

### onLog

`onLog` 是 Rollup 提供的一个强大的日志拦截和自定义处理机制，允许开发者完全控制 Rollup 的日志输出行为，如果不提供，日志将统一打印到控制台

```js
 onLog: (level, log, handler) => {}
```

- **level**: 'info' | 'warn' | 'error' | 'debug'
- **log**: 日志对象
-  **handler**: 默认日志处理器

**日志对象包含**：

```js
{
  code: 'UNRESOLVED_IMPORT',  // 日志代码
  message: 'Could not resolve...', // 原始消息
  frame: '\n  > 1 | import...',   // 代码帧
  loc: { file: 'src/main.js', line: 1, column: 8 }, // 位置
  plugin: 'typescript',       // 来源插件
  meta: { /* 附加元数据 */ }
}
```

::: details 完整配置示例

```js
// rollup.config.js
export default {
  input: 'src/main.js',
  output: { file: 'dist/bundle.js', format: 'es' },
  onLog: (level, log, handler) => {
    // 1. 过滤特定日志
    if (log.code === 'CIRCULAR_DEPENDENCY') {
      console.warn(`🔄 发现循环依赖: ${log.ids.join(' → ')}`);
      return; // 阻止默认输出
    }

    // 2. 重写日志消息
    if (log.code === 'UNRESOLVED_IMPORT') {
      log.message = `无法解析模块: ${log.source}`;
    }

    // 3. 日志级别转换
    if (log.code === 'MISSING_NAME_OPTION') {
      handler('warn', log); // 将error降级为warn
      return;
    }

    // 4. 添加额外信息
    if (level === 'error') {
      log.message = `[构建错误] ${log.message}`;
    }

    // 5. 默认处理
    handler(level, log);
  }
};
```

:::

::: details 高级用法 - 日志收集

```js
// 收集所有日志用于分析
const buildLogs = [];

export default {
  // ...
  onLog: (level, log, handler) => {
    // 记录日志
    buildLogs.push({
      timestamp: new Date(),
      level,
      ...log
    });
    
    // 只显示错误
    if (level === 'error') {
      handler(level, log);
    }
  },
  
  // 插件形式获取最终日志
  plugins: [{
    name: 'log-collector',
    buildEnd() {
      fs.writeFileSync(
        'build-logs.json', 
        JSON.stringify(buildLogs, null, 2)
      );
    }
  }]
};
```

:::

::: details **日志聚合分析**

```js
const stats = { warnings: 0, errors: 0 };

onLog: (level) => {
  if (level === 'warn') stats.warnings++;
  if (level === 'error') stats.errors++;
  handler(level, log);
}
```

:::

**常见日志代码**

| 代码                | 描述           |
| :------------------ | :------------- |
| CIRCULAR_DEPENDENCY | 循环依赖       |
| UNRESOLVED_IMPORT   | 无法解析的导入 |
| MISSING_EXPORT      | 缺少导出       |
| EMPTY_BUNDLE        | 生成的包为空   |
| EVAL                | 使用了 eval    |
| PLUGIN_WARNING      | 插件产生的警告 |

### onwarn

一个函数，用于拦截警告信息。它与 [`onLog`](#onlog) 非常相似，但只接收警告。如果调用默认处理程序，日志将被处理为警告。如果提供了 `onLog` 和 `onwarn` 处理程序，只有当 `onLog` 调用其默认处理程序时，`onwarn` 处理程序才会被调用，且 `level` 为 `warn`。

> https://cn.rollupjs.org/configuration-options/#onwarn

### output.assetFileNames

用于控制生成的资源文件（如图片、字体、CSS等）命名规则的配置项。

```js
export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'es',
    assetFileNames: '[name].[hash][extname]'
  }
}
```

#### 可用占位符

| 占位符      | 说明                              | 示例               |
| :---------- | :-------------------------------- | :----------------- |
| `[name]`    | 资源文件原名（不含扩展名）        | `logo`             |
| `[extname]` | 包含点的扩展名                    | `.png`             |
| `[ext]`     | 不包含点的扩展名                  | `png`              |
| `[hash]`    | 基于文件内容的哈希值（默认8字符） | `e4ca327f`         |
| `[hash:16]` | 指定哈希长度                      | `e4ca327f5b6a8d9c` |

::: code-group
```js [基本哈希命名]
assetFileNames: '[name].[hash][extname]'
// logo.e4ca327f.png
```

```ts [按类型分类]
assetFileNames: 'assets/[ext]/[name]-[hash:8][extname]'
//assets/images/logo-e4ca327f.png
//assets/fonts/inter-3b2a7c.woff2
```
:::

::: details 完整示例

```js
// rollup.config.js
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'es',
    assetFileNames: ({name}) => {
      // 自定义命名函数
      if (name && name.endsWith('.css')) {
        return 'css/[name].[hash][extname]';
      }
      return 'assets/[hash][extname]';
    }
  },
  plugins: [
    image(),
    postcss({
      extract: true // 提取CSS为单独文件
    })
  ]
};
```

:::

### 	output.compact

用于控制生成的 bundle 代码的紧凑程度。

```js
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    compact: true  // 启用紧凑模式
  }
}
```

启用后的效果：

1. **移除空白字符**：
   - 删除不必要的空格
   - 删除换行符
   - 删除缩进
2. **缩短标识符**：
   - 局部变量重命名为短名称
   - 保持导出名称不变
3. **简化表达式**：

```js
// 转换前
if (condition) {
  return true;
} else {
  return false;
}

// 转换后
return condition?true:false
```

通常与其它**压缩工具**配合，比如**terser()**，`import { terser } from 'rollup-plugin-terser';`

### output.dynamicImportInCjs

用于控制 CommonJS 输出格式中动态导入(`import()`)行为的配置项。

决定在 CommonJS 输出格式中如何处理动态 `import()` 表达式。

**适用场景**：

- 当输出格式为 `cjs` (CommonJS) 时
- 代码中包含动态 `import()` 表达式
- 需要控制动态导入的转换方式

| 值             | 行为                                            |
| :------------- | :---------------------------------------------- |
| `false` (默认) | 将动态导入转换为 `Promise.resolve(require(id))` |
| `true`         | 保留原生的 `import()` 表达式                    |

```js
// src/main.js
async function loadModule() {
  const module = await import('./module.js');
  console.log(module);
}
```

输出：

::: code-group
```js [false]
// dist/bundle.cjs.js
async function loadModule() {
  const module = await Promise.resolve(require('./module.js'));
  console.log(module);
}
```

```ts [true]
// dist/bundle.cjs.js
async function loadModule() {
  const module = await import('./module.js');
  console.log(module);
}
```
:::

使用场景：

#### 使用 `true` 的情况

1. 运行环境支持原生动态导入 (Node.js 12+)
2. 需要真正的 ESM 动态导入行为
3. 依赖的模块是 ESM 格式

#### 使用 `false` (默认) 的情况

1. 需要兼容旧版 Node.js
2. 目标环境不支持原生 `import()`
3. 依赖的模块是 CommonJS 格式

::: details Node.js 双模式包

```js
// package.json
{
  "type": "module",
  "exports": {
    "require": "./dist/bundle.cjs",
    "import": "./dist/bundle.mjs"
  }
}

// rollup.config.js
export default {
  output: [
    {
      file: 'dist/bundle.cjs',
      format: 'cjs',
      dynamicImportInCjs: true // Node.js 12+
    },
    {
      file: 'dist/bundle.mjs',
      format: 'es'
    }
  ]
}
```

:::

### output.entryFileNames

用于控制入口 chunk 文件命名规则的配置项，特别适用于多入口项目或代码拆分场景。

```js
export default {
  input: ['src/main.js', 'src/other.js'],
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name]-[hash].js' // 入口文件命名规则
  }
}
```

#### 可用占位符

| 占位符      | 说明                              | 示例               |
| :---------- | :-------------------------------- | :----------------- |
| `[name]`    | 入口名称（基于输入配置）          | `main` `other`     |
| `[hash]`    | 基于文件内容的哈希值（默认8字符） | `e4ca327f`         |
| `[hash:16]` | 指定哈希长度                      | `e4ca327f5b6a8d9c` |
| `[format]`  | 输出格式（如 `es`、`cjs`）        | `es` `cjs`         |

::: code-group
```js [基础命名模式]
entryFileNames: 'entries/[name].js'
```

```js [输出]
dist/entries/main.js
dist/entries/other.js
```
:::

::: code-group
```js [带哈希版本控制]
entryFileNames: '[name]-[hash:8].js'
```

```js [输出]
dist/main-e4ca327f.js
dist/other-3b2a7c9d.js
```
:::

::: code-group
```js [按格式分类]
entryFileNames: '[format]/[name].js'
```

```ts [输出]
dist/es/main.js
dist/es/other.js
```
:::

::: code-group
```js [多页面应用]
input: {
  home: 'src/pages/home.js',
  about: 'src/pages/about.js',
  contact: 'src/pages/contact.js'
},
output: {
  dir: 'dist',
  entryFileNames: 'pages/[name]/bundle.js'
}
```

```ts 输出]
dist/
  pages/
    home/
      bundle.js
    about/
      bundle.js
    contact/
      bundle.js
```
:::

### output.extend

用于控制 **UMD/IIFE** 格式输出的全局变量扩展行为的配置项

**作用**：当设置为 `true` 时，如果全局变量已存在，Rollup 会将输出**扩展**到现有变量而**不是替换**它。

**注意：**适用于**umd**和**iife**

- 主要用于向现有的全局命名空间**添加功能**
- 开发可扩展的库
- 避免覆盖现有的全局变量

```js
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'MyLibrary', // 必须指定全局变量名
    extend: true       // 启用扩展模式
  }
}
```

::: code-group
```js [输入代码]
// src/main.js
export const version = '1.0.0';
export function greet() {
  console.log('Hello!');
}
```

```js [false(默认)]
// 输出 (会完全替换 MyLibrary)
var MyLibrary = (function() {
  const version = '1.0.0';
  function greet() {
    console.log('Hello!');
  }
  return {
    version: version,
    greet: greet
  };
})();
```
```js [true]
// 输出 (会扩展 MyLibrary)
var MyLibrary = MyLibrary || {};
MyLibrary.version = '1.0.0';
MyLibrary.greet = function() {
  console.log('Hello!');
};
```

:::

**渐进增强**

```js
// 主库
var MyLib = { plugins: {} };

// 插件1 
var MyLib = MyLib || {};
MyLib.plugins.analytics = function() { /*...*/ };

// 插件2 
var MyLib = MyLib || {};
MyLib.plugins.charts = function() { /*...*/ };
```

### output.externalImportAttributes

用于控制如何处理导入声明中的导入属性

...

### output.generatedCode

用于精细控制生成代码风格的配置选项，可以精确控制 Rollup 如何生成输出代码的各种语法特性

```js
export default {
  output: {
    generatedCode: {
      // 可配置选项将在这里
    }
  }
}
```

其参数可以是一个预设，也可以是一对象https://cn.rollupjs.org/configuration-options/#output-generatedcode

### output.hashCharacters

用于控制生成哈希值所用字符集的配置选项，它影响所有使用哈希的地方（如 `[hash]` 占位符）

```js
export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'es',
    assetFileNames: '[name]-[hash][extname]',
    hashCharacters: 'base36' // 指定哈希字符集
  }
}
```

| 选项值     | 字符集              | 示例哈希          |
| :--------- | :------------------ | :---------------- |
| `'base64'` | A-Z, a-z, 0-9, +, / | `Fj8+3Dp/`        |
| `'base36'` | 0-9, a-z            | `4f9k2z`          |
| `'hex'`    | 0-9, a-f            | `e4ca327f` (默认) |

### output.hoistTransitiveImports

用于控制是否**提升**(hoist)**传递性导入**(transitive imports)的配置选项，主要影响代码拆分时的导入组织方式。

#### 基本概念

**传递性导入**：指模块A导入模块B，模块B又导入模块C，那么模块C就是模块A的传递性导入。

**提升(Hoisting)**：将传递性导入从原始位置移动到更高层级，通常是入口文件或共享chunk中。

| 值            | 行为                      |
| :------------ | :------------------------ |
| `true` (默认) | 提升传递性导入到共享chunk |
| `false`       | 保持传递性导入在原始位置  |

::: code-group
```js [结构]
src/
├── main.js (入口)
├── moduleA.js
└── moduleB.js
```

```js [代码]
// src/main.js
import { a } from './moduleA';

// src/moduleA.js
import { b } from './moduleB';
export const a = b + 1;

// src/moduleB.js
export const b = 42;
```
```js [true]
dist/
├── main.js (包含moduleB的代码)
└── moduleA.js
```

```js [false]
dist/
├── main.js
├── moduleA.js (包含moduleB的代码)
└── moduleB.js
```

:::

**使用场景**：

使用 `false` 的情况

1. 需要保持严格的模块依赖关系
2. 调试时希望看到原始导入结构
3. 某些特殊代码拆分需求

使用 `true` (默认) 的情况

1. 希望减少重复代码
2. 优化加载性能
3. 大多数常规应用场景

### output.importAttributesKey

用于控制导入属性(Import Attributes)语法中使用的关键字。这个配置主要影响代码中如何处理模块导入的类型断言。

...

### output.inlineDynamicImports

用于控制动态导入（`import()`）行为的配置选项，它决定是否将动态导入的模块内联到主 bundle 中。

**动态导入**：使用 `import()` 语法在运行时按需加载模块。

**内联（Inlining）**：将动态导入的模块直接包含在主 bundle 中，而不是生成单独的 chunk。

| 值             | 行为                               |
| :------------- | :--------------------------------- |
| `false` (默认) | 为动态导入创建单独的 chunk         |
| `true`         | 将动态导入的模块内联到主 bundle 中 |

使用 `true` 的情况

1. 构建单文件库时
2. 动态导入的模块很小，不值得拆分
3. 需要减少HTTP请求数量
4. 目标环境不支持代码拆分

使用 `false` (默认) 的情况

1. 需要利用代码拆分优化加载性能
2. 动态导入的模块较大
3. 构建多页面应用
4. 需要按需加载功能
