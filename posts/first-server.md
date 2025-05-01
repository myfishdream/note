---
title: 记录在硅云购买服务器并部署一个简单nodejs
date: 2025-05-01
category: other
tags: 
    - 服务器
    - Node.js
description: 在硅云花了26买了一台服务器
draft: false
outline: [2,3]
sticky: false
done: false
gridPaper: false
---

# 从购买服务器到部署应用

## 购买

选择一个合适的服务器购买，在买的时候会**设置密码**，完成后等待一会服务器启动就可以连接了，可以使用浏览器的**VNC控制台**，但是推荐自己本地电脑下一个SSH工具，因为浏览器的控制台是在太卡了😂

推荐使用：堡塔SSH终端软件https://www.bt.cn/new/product_ssh.html

当然**PuTTY**也行：https://www.putty.org/

## 环境搭建

**更新系统软件**

```bash
apt update && apt upgrade -y
```

**安装 Node.js**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
```

在安装的时候出现了**软件包依赖冲突**，导致安装不了 Node.js 18.x，我的系统是Ubuntu 24.04

网上说因为系统中有多个软件包版本冲突（如 libcurl4、gnupg、libc6 等），或者Ubuntu 24.04 默认软件源可能不完全兼容 Node.js 18.x 的依赖

修复的办法是：

**修复损坏的依赖关系**，

```bash
apt --fix-broken install
apt update
apt upgrade -y
```

**清理冲突的软件包**

```bash
apt autoremove
apt purge libcurl4 gnupg libc6-dev
apt install -f
```

**改用 NodeSource 的 Ubuntu 24.04 专用源**

```bash
# 先卸载旧版本Node.js（如有）
apt remove --purge nodejs npm

# 安装Node.js 18.x（兼容Ubuntu 24.04）
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

**验证安装**

```bash
node -v
npm -v
```

**即可解决**

## Node.js 环境

```bash
mkdir my-node-app
cd my-node-app

npm init -y          # 生成 package.json
npm install express  # 安装 Express 框架
```

用命令行创建文件 `app.js`

```bash
nano app.js
```

```js
const express = require('express');
const app = express();
const port = 3000;

// 返回一个网页
app.get('/', (req, res) => {
  res.send(`
    <h1>Hello World! 🚀</h1>
    <p>这是我的第一个Node.js网站</p>
    <a href="/api">点我访问API</a>
  `);
});

// 返回JSON数据
app.get('/api', (req, res) => {
  res.json({ message: "你好，这是API！", status: 200 });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
```

按 `Ctrl + X` → 输入 `Y` → 回车保存。

```bash
node app.js
```

## 开放外网访问