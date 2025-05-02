---
title: 在服务器上安装数据库
date: 2025-05-02
category: other
tags: 
    - 服务器
    - MySQL
description: 在一台Ubuntu服务器上安装MySQL，并且配置
draft: false
outline: [2,3]
sticky: false
done: false
gridPaper: false
cbf: false
zoomable: true
publish: true
---

## 安装MySQL

```bash
sudo apt update
sudo apt install mysql-server
```

## 配置MySQL

```bash
sudo mysql_secure_installation
```

- 设置 root 密码（可选）

- 移除匿名用户（Y）

- 禁止远程 root 登录（Y）

- 删除测试数据库（Y）

- 重新加载权限表（Y）


## 检查 MySQL 服务状态

```bash
sudo systemctl status mysql
```

如果未启动，运行：

```bash
sudo systemctl start mysql
sudo systemctl enable mysql  # 开机自启
```

## 登录 MySQL

```bash
sudo mysql -u root -p
```

## 修改密码

**使用** `mysql_secure_installation`

```bash
sudo mysql_secure_installation
```

按提示设置 root 密码，并完成安全配置。

**手动修改密码**

```bash
# 登录 MySQL（无密码时）
sudo mysql -u root

# 修改 root 密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的新密码';
FLUSH PRIVILEGES;
```

## 退出 MySQL Shell

```bash
exit;
```

或按快捷键 **Ctrl + D**。

## 连接数据库

在**nodejs**连接数据库，首先要在nodejs中安装`mysql12`驱动

```bash
npm install mysql2
```

```js
const mysql = require('mysql2/promise'); // 使用 Promise 接口

async function connectMySQL() {
  const connection = await mysql.createConnection({
    host: 'localhost',     // 数据库地址
    user: 'root',          // 用户名
    password: '你的密码',   // 密码
    database: 'test_db'    // 数据库名（可选）
  });

  // 执行查询
  const [rows] = await connection.execute('SELECT * FROM articles');
  console.log(rows);

  // 关闭连接
  await connection.end();
}

connectMySQL().catch(console.error);
```

使用**连接池**(推荐)

```js
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '你的密码',
  database: 'test_db',
  waitForConnections: true,
  connectionLimit: 10      // 连接池大小
});

async function query() {
  const [rows] = await pool.query('SELECT * FROM articles');
  console.log(rows);
}

query();
```

## 在VSCode中链接数据库

安装`MySQL`插件[MySQL Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2)

连接失败常见原因

**MySQL默认只监听** `127.0.0.1`，**拒绝外部连接，**

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

找到 `bind-address` 并修改为：

```ini
bind-address = 0.0.0.0  # 允许所有IP访问
```

重启MySQL：

```bash
sudo systemctl restart mysql
```

**防火墙/安全组拦截**

检查Ubuntu防火墙：

```bash
sudo ufw status  # 查看状态
sudo ufw allow 3306/tcp  # 放行MySQL端口
```

云服务器安全组

登录控制台 → 安全组 → 添加 **入站规则**

```
协议: TCP  
端口: 3306  
来源: 0.0.0.0/0（或你的IP）
```

**MySQL用户权限不足**

在配置的时候可能设置了禁止远程root登录

```sql
SELECT User, Host FROM mysql.user;
```

创建新远程用户

```sql
-- 创建新用户并允许从任意IP访问（更安全）
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

然后在Vscode中使用**用户名**：`remote_user`，**密码**：`StrongPassword123!`登录即可

