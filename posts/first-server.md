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

先在另一个终端测试一下：
```bash
curl http://localhost:3000
```

## 开放外网访

```bash
# 开放防火墙（Ubuntu）
ufw allow 3000/tcp
ufw enable
```

在云平台控制台：找到服务器 -> 防火墙/安全组，添加入站规则：允许TCP 3000端口

此时在外网即可通过`http://你的服务器IP:3000`访问了

为了保持进程运行：
```bash
npm install pm2 -g
pm2 start app.js --name "my-app"
pm2 save
pm2 startup  # 设置开机自启
```

## 踩坑

### 防护墙

**盲目的开启防护墙可能导致中断SSH连接**

使用`ufw enable`启用防护墙的时候可能会中断 **当前的SSH连接**

先确保SSH端口已允许（例如22端口）`ufw status`，如果输出中包含 `22/tcp ALLOW`，就可以正常启用防护墙了

但是**未放行SSH端口**，**先开放SSH端口**，再启用防火墙

```bash
ufw allow 22/tcp  # 如果是自定义端口，替换为实际端口号
ufw enable
# 应该输出（有22端口即可）

To         Action  From
--         ------  -----
22/tcp     ALLOW   Anywhere
3000/tcp   ALLOW   Anywhere
22/tcp (v6) ALLOW  Anywhere (v6)
3000/tcp (v6) ALLOW Anywhere (v6)


ufw enable  # 此时才可安全输入y
```

否则只能通过**VNC登录**重新连接执行
```bash
ufw allow 22/tcp
ufw enable
```

如果使用`ufw status`显示 `Status: inactive`（防火墙未启用）,添加规则后状态仍为 `inactive`（规则未真正加载）

可能因为UFW防火墙处于 **未激活状态**，导致所有规则配置无效或者系统可能残留旧的iptables规则冲突

**强制激活防火墙**

```bash
# 先清理旧规则和锁文件
sudo ufw --force reset

# 重新放行SSH端口（避免被锁）
sudo ufw allow 22/tcp

# 强制启用防火墙（关键步骤！）
sudo ufw --force enable
```

**验证防火墙状态**

```bash
sudo ufw status verbose

# 输出
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)
```

 **检查底层iptables规则**

```bash
sudo iptables -L -n | grep 22

# 输出
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:22
```

## 拉取代码

在ssh上写代码属实有点猫饼，所以通常都是从代码托管平台拉取代码

先在服务器上**安装**`Git`

```bash
sudo apt install git -y
git --version  # 验证安装
```

 **配置Git身份**

```bash
git config --global user.name "YourGitHubUsername"
git config --global user.email "your@email.com"
```

创建一个文件夹

```bash
mkdir 文件夹名称
cd 文件夹名称
```

**HTTPS协议**（公开仓库）

```bash

git clone https://github.com/你的用户名/仓库名.git
cd 仓库名
```

**SSH协议**（私有仓库）

```bash
# 生成SSH密钥（如果已有可跳过）
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub  # 复制公钥到GitHub的SSH Keys设置

# 克隆仓库
git clone git@github.com:你的用户名/仓库名.git
cd 仓库名
```

安装依赖后运行

```bash
npm i
npm start
# node app.js
```

**用PM2管理新项目**

```bash
# 停止旧进程（如果存在）
pm2 delete all

# 启动新项目
pm2 start app.js --name "my-api"

# 设置开机自启
pm2 save
pm2 startup
```

**手动更新代码流程**

```bash
cd ~/仓库名
git pull origin main  # 假设分支是main
npm install  # 如果package.json有变更
pm2 restart my-api
```

**自动更新代码流程**

通过Webhook，在服务器安装`github-webhook`

```bash
npm install -g github-webhook
```

创建Webhook脚本 `deploy.sh`

```bash
#!/bin/bash
cd ~/仓库名
git pull
npm install
pm2 restart my-api
```

注意添加权限：

```bash
chmod +x deploy.sh
```

验证权限：

```bash
ls -l deploy.sh

# 输出
# -rwxr-xr-x 1 root root 123 May 2 12:34 deploy.sh
```

在GitHub仓库设置 → Webhooks → 添加Payload URL

```bash
http://你的服务器IP:9000/webhook
```

> [!TIP]
>
> 通过`pm2 logs` 查看错误日志。

> [!TIP]
>
> `pm2`最好不要使用特殊字符，比如`&`，否则要转义或者加引号

如果要重命名**pm2应用**：

```bash
pm2 delete my-app&api    # 先删除旧应用
pm2 start app.js --name "my-app-api"  # 使用无特殊字符的名称
pm2 save
```

**示例文件**

```bash
#!/bin/bash

# 进入项目目录
cd /home/simple-server/

# 拉取最新代码
git fetch --all
git reset --hard origin/main  # 或你的分支名（如master）

# 安装依赖（如果用yarn请替换）
npm install --production

# 重启PM2进程
pm2 restart "my-app-api"  # 替换为你的PM2应用名

# 可选：记录部署时间
echo "Deployed at $(date)" >> deploy.log
```

**配置Github**

在 GitHub 中配置自动化部署（Webhook），使代码推送时自动触发服务器的 `deploy.sh` 脚本