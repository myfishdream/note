---
title: JavaScript 核心知识点小记 (下)
date: 2025-05-07
category: Note
tags: 
    - JavaScript
description: 从异步操作到DOM事件，涵盖异步编程、事件处理、DOM操作等关键知识点。
draft: false
outline: [2,3]
sticky: false
done: false
gridPaper: false
handwriting: false
cbf: true
zoomable: true
---

# JavaScript 核心知识点小记 (下)

## 异步操作

### 单线程模型

**单线程模型**指的是，JavaScript 只在一个线程上运行。也就是说，JavaScript 同时只能执行一个任务，其他任务都必须在后面排队等待。

**注意**：JavaScript 只在一个线程上运行，不代表 JavaScript 引擎只有一个线程。

事实上，JavaScript 引擎有多个线程，单个脚本只能在一个线程上运行（称为主线程），其他线程都是在后台配合。

JavaScript 之所以采用单线程，而不是多线程，跟历史有关系。JavaScript 从诞生起就是单线程，原因是不想让浏览器变得太复杂，因为多线程需要共享资源、且有可能修改彼此的运行结果，对于一种网页脚本语言来说，这就太复杂了。如果 JavaScript 同时有两个线程，一个线程在网页 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？是不是还要有锁机制？所以，为了避免复杂性，JavaScript 一开始就是单线程，这已经成了这门语言的核心特征，将来也不会改变。
