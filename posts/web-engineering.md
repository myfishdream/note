---
title: 传统前端开发到现代前端开发
date: 2025-04-11
category: Note
tags:
    - JavaScript
    - CSS
    - 工程化
description: 工程化开发的意义是什么，模块化，包管理，JS与CSS的工具链，构建工具与脚手架
outline: [2,4]
---

# 前端工程化

工程化的定义：前端开发的管理工具，降本增效

## 模块化


**全局污染**：当一个 html 中引入的两个 JS 文件的代码有重复声明

**依赖混乱**：当一个文件分解后要聚合的时候，文件之间的依赖关系将变得复杂，将要考虑 Js 的引入顺序

**模块化**解决的就是**文件分解和聚合**的问题

`CJS`是**运行时**，而``ESM`是**编译时**  

**运行时**：只有运行到表达式的时候才能确定依赖关系

```js
if(条件){
    const a1 = require('./a1.js');
}
else{
    const a2 = require('./a2.js');
}
// 只有在运行后才能确定依赖的关系
```

**编译时**：在运行之前就确定依赖关系，而不用去运行代码才能确定依赖关系

## 包管理

一个包依赖多个模块，像Vue就是一个包，或者说是一个框架或者库

**框架的定义**：能够约束底代码的结构，比如vue的单文件组件

**库**： 其本身有自己的结构，用到的时候使用其中的功能，是一个调用的关系

## JS工具链

**编译**：把一种代码转换为另一种代码 

### API兼容

当一个API不兼容的时候，写一个就好了。

```js
Array.prototype.flatMap = function(callback, thisArg) {
}
const result = [1,2].flatMap(x => [x, x * 2]);
console.log(result); // [1, 2, 2, 4]
```

这个过程叫做`polyfill`，中文意思是填充物的意思，

但是自己去做这些API会降低开发效率，可以使用一些工具完成，比如`core-js`， 其内部把所有的函数都写了一遍

```js
require('core-js/modules/es.array.flat-map.js');
```

### 语法兼容

 ```js
 // source.js
 async function test(params) {
     return await Promise.resolve(params);   
 }
 (async ()=>{
     const r = await test("test");
     console.log(r); // test
 })()
 ```

假如浏览器不支持上述语法，需要处理语法兼容问题，对于语法兼容的处理是**转换**而不是填充

比如将`async-await`语法进行转换，需要使用一个工具`regenerator`，提供了一些函数用于转换

```js
const regenerator = require("regenerator");
const fs = require("fs");
const path = require("path");

const soucePath = path.join(__dirname, "source.js");
const sourceCode = fs.readFileSync(soucePath, "utf-8");

const result = regenerator.compile(sourceCode, {
    includeRuntime: true
})

const targetPath = path.join(__dirname, "target.js");
fs.writeFileSync(targetPath, result.code, "utf-8");
console.log("编译成功！"); // 输出编译后的代码
```

转换后的代码就没有`await-async`语法了

但是，语法兼容工具并不一定在做语法兼容，还可以做**语法增强**，

### 代码集成转换工具

主流的代码集成转换工具就是`babel`，处理兼容性是使用它的一个主要目的，但是功能并不仅限于此

它就像搭建了一个舞台，把那些代码转换工具都可以集成进来