---
title: 通过香港服务器搭建代理
date: 2025-05-14
category: 教程
tags: 
    - 代理
    - 服务器
    - Ubuntu
description: 通过香港服务器搭建代理
outline: [2,3]
draft: false
sticky: false
done: false
gridPaper: false
handwriting: false
cbf: false
zoomable: true
publish: true
AutoAnchor: false
---

# 自建代理服务器

##  购买香港服务器

首先需要购买一台香港（或者其他地区）服务器，在哪里买就自己找了，我是在[硅云](https://www.vpsor.cn/)买的。

##  配置服务器

我购买的服务器的系统是Ubuntu的，登录服务器等操作参考我之前的一篇文章[记录在硅云购买服务器并部署一个简单nodejs](/posts/first-server)。

###  安装 Shadowsocks-libev

```bash
sudo apt-get update
sudo apt-get install shadowsocks-libev

# 或者 sudo apt update && sudo apt install -y shadowsocks-libev
```

###  编辑配置文件

```bash
sudo nano /etc/shadowsocks-libev/config.json
```

**内容示例**（替换 `密码` 和 `端口`）：

```json
{
    "server": "0.0.0.0",
    "server_port": 4202,
    "password": "你的强密码",
    "method": "aes-256-gcm",
    "mode": "tcp_and_udp",
    "fast_open": true
}
```

- **`server`: `0.0.0.0`**（允许所有 IP 连接，关键！）
- **`server_port`**: 自定义端口（如 `7002`、`443`）。
- **`method`**: 推荐 `aes-256-gcm` 或 `chacha20-ietf-poly1305`。

### 启动服务

```bash
sudo systemctl start shadowsocks-libev
sudo systemctl enable shadowsocks-libev
```

### 检查服务状态

```bash
sudo systemctl status shadowsocks-libev  # 确认状态为 "active (running)"
ss -tulnp | grep ss-server              # 检查端口是否监听
```

## 服务器防火墙 & 安全组

### 开放端口（Ubuntu）

```bash
sudo ufw allow 4202/tcp
sudo ufw allow 4202/udp
sudo ufw enable
# 你填写的端口
```

###  云服务器安全组（关键！）

- **阿里云/腾讯云/AWS 控制台** → 安全组规则 → 放行 `TCP:4202` 和 `UDP:4202`。

## 客户端配置

### **下载客户端**

- **Windows**: [Shadowsocks-Windows](https://github.com/shadowsocks/shadowsocks-windows/releases)
- **Mac**: [ShadowsocksX-NG](https://github.com/shadowsocks/ShadowsocksX-NG/releases)
- **Android**: [Shadowsocks-Android](https://github.com/shadowsocks/shadowsocks-android/releases)
- **iOS**: 需非国区 Apple ID 下载 `Shadowrocket` 或 `Potatso Lite`。

### **填写服务器信息**

- **服务器 IP**: 香港服务器的公网 IP（如 `101.101.267.148`）。
- **端口**: `4202`（与服务器配置一致）。
- **密码**: 与 `config.json` 中的密码一致。
- **加密方式**: `aes-256-gcm`。

### 启动代理

- 选择 **全局模式** 或 **PAC 模式**（推荐 PAC 自动代理）。

##  优化与高级设置

### 开启 BBR 加速（提升速度）

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

**验证：**

```bash
lsmod | grep bbr  # 看到 "tcp_bbr" 即成功
```

### 流量混淆（防封锁）

具体教程请自行搜索，这里就不赘述了。

使用 `v2ray-plugin` 伪装成 HTTPS 流量：

```bash
wget https://github.com/shadowsocks/v2ray-plugin/releases/download/v1.3.2/v2ray-plugin-linux-amd64-v1.3.2.tar.gz
tar -xzf v2ray-plugin-*.tar.gz
mv v2ray-plugin_linux_amd64 /usr/bin/v2ray-plugin
```

修改 `config.json`：

```json
{
    "server": "0.0.0.0",
    "server_port": 443,
    "password": "你的密码",
    "method": "aes-256-gcm",
    "plugin": "v2ray-plugin",
    "plugin_opts": "server;tls;host=your-domain.com"
}
```

## 测试与故障排除

### 检查代理是否生效

- 访问 [IP Checker](https://www.iplocation.net/) → 应显示 **香港服务器 IP**。
- 访问 [YouTube](https://www.youtube.com/) 或 [Google](https://www.google.com/) → 确认可打开。

## 最终建议

1. **定期更换端口**（如每月换一次 `server_port`）。
2. **推荐使用 V2Ray**（比 Shadowsocks 更抗封锁）。
3. 如果 IP 被封锁，可绑定域名 + CDN（如 Cloudflare）。

## 完成！

你现在已拥有一个 **稳定、高速的代理服务**。

## 常用命令

```bash
# 启动服务
sudo systemctl start shadowsocks-libev

# 设置开机自启动
sudo systemctl enable shadowsocks-libev
```

```bash
# 重启服务
sudo systemctl restart shadowsocks-libev
```

```bash
# 重新加载服务
sudo systemctl daemon-reload
```

```bash
# 查看状态
sudo systemctl status shadowsocks-libev
```
