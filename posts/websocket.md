---
title: WebSocket技术开发多人在线聊天
date: 2025-03-23
category: Note
tags:
    - JavaScript
    - Node.js
description: 使用WebSocket技术开发如在线多人聊天，简易代码模版
outline: [2,4]
---

# WebSocket

## 后端

### 技术栈

- **Express**: 用于创建Web服务器
- **Socket**.io: 提供WebSocket功能
- **nodemon**: 开发时自动重启服务器

### 实现

```js
// 引入必要的模块
const express = require('express'); // Express 框架，用于处理 HTTP 请求
const http = require('http'); // Node.js 内置的 HTTP 模块，用于创建 HTTP 服务器
const path = require('path'); // Node.js 内置的路径处理模块
const socketIO = require('socket.io'); // Socket.IO 库，用于处理 WebSocket 通信
```

```js
// 创建 Express 应用实例
const app = express();
```

> [!IMPORTANT]
>
> **注意：虽然 Express 可以直接启动服务器，但 Socket.IO 需要原始的 HTTP 服务器实例**

```js
// 创建 HTTP 服务器，并将 Express 应用作为请求处理器
const server = http.createServer(app);
```

```js
// 初始化 Socket.IO，将 HTTP 服务器实例传递给它
// 这样 Socket.IO 可以监听同一个端口上的 WebSocket 连接
const io = socketIO(server);
```

```js
// 设置静态文件目录，Express 将直接提供该目录下的文件
// 例如：public/index.html 将通过 http://localhost:3000/index.html 访问
app.use(express.static(path.join(__dirname, 'public')));
```

```js
// 设置服务器端口，从环境变量获取或使用默认的 3000 端口
const PORT = process.env.PORT || 3000;
```

```js
// 存储用户数据的对象，键为 socket.id，值为用户名
const users = {};
```

```js
// 当客户端通过 WebSocket 连接到服务器时触发 'connection' 事件
io.on('connection', (socket) => {
    console.log('新用户已连接，Socket ID:', socket.id);

    // 监听客户端发送的 'join' 事件（用户加入聊天室）
    socket.on('join', (username) => {
        console.log(`用户 ${username} 加入了聊天室`);
        
        // 将用户名与socket.id关联存储
        users[socket.id] = username;
        
        // 向该用户发送欢迎消息
        socket.emit('message', {
            user: '系统',
            text: `欢迎加入聊天室，${username}！`,
            timestamp: new Date().toISOString()
        });
        
        // 向所有其他用户广播新用户加入的消息
        socket.broadcast.emit('message', {
            user: '系统',
            text: `${username} 加入了聊天室`,
            timestamp: new Date().toISOString()
        });
        
        // 更新所有客户端的用户列表
        io.emit('updateUserList', Object.values(users));
    });

    // 监听客户端发送的 'sendMessage' 事件（发送消息）
    socket.on('sendMessage', (message) => {
        console.log(`收到来自 ${users[socket.id]} 的消息: ${message}`);
        
        // 获取发送消息的用户名
        const username = users[socket.id];
        
        // 将消息广播给所有用户（包括发送者自己）
        io.emit('message', {
            user: username,
            text: message,
            timestamp: new Date().toISOString()
        });
    });

    // 监听用户正在输入事件
    socket.on('typing', (isTyping) => {
        // 向除了发送者之外的所有客户端发送打字状态
        socket.broadcast.emit('userTyping', {
            username: users[socket.id],
            isTyping: isTyping
        });
    });

    // 监听客户端断开连接事件
    socket.on('disconnect', () => {
        // 如果断开连接的用户在用户列表中
        if (users[socket.id]) {
            console.log(`用户 ${users[socket.id]} 离开了聊天室`);
            
            // 向所有其他用户广播该用户离开的消息
            socket.broadcast.emit('message', {
                user: '系统',
                text: `${users[socket.id]} 离开了聊天室`,
                timestamp: new Date().toISOString()
            });
            
            // 从用户列表中删除该用户
            delete users[socket.id];
            
            // 更新所有客户端的用户列表
            io.emit('updateUserList', Object.values(users));
        }
    });
});
```

```js
// 启动 HTTP 服务器，开始监听指定端口
server.listen(PORT, () => {
    console.log(`服务器已启动，正在监听端口 ${PORT}`);
    console.log(`在浏览器中访问 http://localhost:${PORT}`);
}); 
```

## 前端

```js
  // 建立Socket.io连接
  // 当不传入参数时，io()会自动连接到提供当前页面的服务器地址
  // 例如如果页面地址是 http://localhost:3000，则会连接到 ws://localhost:3000
  const socket = io();
  // 如果要手动指定服务器地址和端口，可以这样写:
  // const socket = io('http://localhost:3000');
```

`io()` 函数可以接受一个配置对象，用于自定义连接行为。

```js
const socket = io('http://localhost:3000', {
    transports: ['websocket'], // 只使用 WebSocket 传输
    reconnection: true, // 启用自动重连
    reconnectionAttempts: 5, // 最多重连 5 次
    reconnectionDelay: 1000, // 重连延迟 1 秒
});
```

> [!IMPORTANT]
>
> `io()` 是 Socket.IO 客户端库提供的一个函数，用于创建与 Socket.IO 服务器的连接，
>
> 并不是**内置**的

> [!IMPORTANT]
>
> 在html中为`  <script src="/socket.io/socket.io.js"></script>`
>
>  实际请求地址: http://localhost:3000/socket.io/socket.io.js

```html (13)
	
  <!-- 
    这个文件实际存在于 node_modules/socket.io/client-dist/socket.io.js
    
    当我们访问 /socket.io/socket.io.js 时:
    1. 请求首先到达 Express 服务器
    2. Socket.IO 在服务器端设置了一个特殊的路由
    3. 这个路由会自动返回 node_modules 里的 socket.io.js 文件内容
    
    所以虽然在 public 文件夹下看不到这个文件
    但是服务器会自动处理这个请求并返回正确的文件
  -->
  <script src="/socket.io/socket.io.js"></script>
  <script src="script.js"></script>
```



**index.html**

将页面通过静态资源托管以便访问

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>简易实时聊天</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <!-- 登录部分 -->
    <div class="login-container" id="login-container">
      <h1>欢迎加入聊天室</h1>
      <div class="login-form">
        <input type="text" id="username-input" placeholder="请输入您的用户名" maxlength="20" />
        <button id="join-btn">加入聊天</button>
      </div>
    </div>

    <!-- 聊天部分 -->
    <div class="chat-container" id="chat-container" style="display: none;">
      <div class="chat-header">
        <h2>实时多人聊天室</h2>
        <div class="user-info">
          当前用户：<span id="current-user"></span>
        </div>
      </div>
      
      <div class="chat-main">
        <div class="users-list-container">
          <h3>在线用户</h3>
          <ul id="users-list"></ul>
        </div>
        
        <div class="messages-container">
          <div id="messages" class="messages-content"></div>
          
          <div class="typing-indicator" id="typing-indicator">
            <span id="typing-username"></span> 正在输入...
          </div>
        </div>
      </div>
      
      <div class="message-input-container">
        <input type="text" id="message-input" placeholder="输入消息..." />
        <button id="send-btn">发送</button>
      </div>
    </div>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="script.js"></script>
</body>
</html> 
```

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

body {
  background-color: #f5f5f5;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 90%;
  max-width: 800px;
  height: 80vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 登录部分 */
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-container h1 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
}

.login-form input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
}

.login-form button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

/* 聊天部分 */
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  background-color: #4caf50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.users-list-container {
  width: 25%;
  background-color: #f8f8f8;
  padding: 15px;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.users-list-container h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

#users-list {
  list-style-type: none;
}

#users-list li {
  padding: 8px 5px;
  border-radius: 4px;
  margin-bottom: 5px;
}

#users-list li.current-user {
  font-weight: bold;
  background-color: rgba(76, 175, 80, 0.1);
}

.messages-container {
  width: 75%;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  overflow: hidden;
}

.messages-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 5px;
  max-width: 80%;
  position: relative;
}

.message.received {
  background-color: #e6e6e6;
  align-self: flex-start;
}

.message.sent {
  background-color: #dcf8c6;
  align-self: flex-end;
  margin-left: auto;
}

.message.system {
  background-color: #fff3cd;
  width: 100%;
  text-align: center;
  font-style: italic;
  color: #856404;
}

.message-info {
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
}

.message-text {
  word-wrap: break-word;
}

.typing-indicator {
  padding: 8px;
  margin-top: 5px;
  display: none;
  font-size: 14px;
  color: #888;
  font-style: italic;
}

.message-input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

#message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
}

#send-btn {
  padding: 0 15px;
  margin-left: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
} 
```

```js
document.addEventListener('DOMContentLoaded', () => {
  // DOM元素
  const loginContainer = document.getElementById('login-container');
  const chatContainer = document.getElementById('chat-container');
  const usernameInput = document.getElementById('username-input');
  const joinBtn = document.getElementById('join-btn');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const messagesContainer = document.getElementById('messages');
  const usersList = document.getElementById('users-list');
  const currentUserSpan = document.getElementById('current-user');
  const typingIndicator = document.getElementById('typing-indicator');
  const typingUsername = document.getElementById('typing-username');
  
  let username = '';
  let typingTimeout = null;
  
  // 建立Socket.io连接
  // 这里创建了一个Socket.io客户端实例，连接到当前服务器
  const socket = io();
  
  // 处理用户登录
  // 当用户点击"加入聊天"按钮时，发送join事件到服务器
  joinBtn.addEventListener('click', joinChat);
  usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinChat();
  });
  
  function joinChat() {
    username = usernameInput.value.trim();
    if (username) {
      // 发送'join'事件到服务器，传递用户名
      socket.emit('join', username);
      
      // 隐藏登录界面，显示聊天界面
      loginContainer.style.display = 'none';
      chatContainer.style.display = 'flex';
      currentUserSpan.textContent = username;
      
      // 自动聚焦到消息输入框
      messageInput.focus();
    }
  }
  
  // 处理发送消息
  // 当用户点击"发送"按钮时，发送sendMessage事件到服务器
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      // 发送'sendMessage'事件到服务器，传递消息内容
      socket.emit('sendMessage', message);
      messageInput.value = '';
      
      // 取消打字状态
      socket.emit('typing', false);
    }
  }
  
  // 监听键盘输入，发送打字状态
  // 当用户正在输入消息时，发送typing事件到服务器
  messageInput.addEventListener('input', () => {
    // 如果有内容，发送打字状态
    if (messageInput.value.trim().length > 0) {
      if (!typingTimeout) {
        socket.emit('typing', true);
      }
      
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit('typing', false);
        typingTimeout = null;
      }, 2000); // 2秒后自动取消打字状态
    } else {
      // 如果没有内容，取消打字状态
      clearTimeout(typingTimeout);
      socket.emit('typing', false);
      typingTimeout = null;
    }
  });
  
  // 接收消息并显示
  // 监听服务器发送的'message'事件
  socket.on('message', (message) => {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // 根据消息类型添加不同的样式
    if (message.user === '系统' || message.user === 'System') {
      messageElement.classList.add('system');
    } else if (message.user === username) {
      messageElement.classList.add('sent');
    } else {
      messageElement.classList.add('received');
    }
    
    // 格式化时间
    const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 设置消息内容
    messageElement.innerHTML = `
      <div class="message-info">
        <strong>${message.user}</strong> <span>${messageTime}</span>
      </div>
      <div class="message-text">
        ${message.text}
      </div>
    `;
    
    // 添加到消息容器
    messagesContainer.appendChild(messageElement);
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
  
  // 处理打字状态
  // 监听服务器发送的'userTyping'事件
  socket.on('userTyping', (data) => {
    if (data.isTyping && data.username !== username) {
      // 显示某用户正在输入
      typingUsername.textContent = data.username;
      typingIndicator.style.display = 'block';
    } else {
      // 隐藏打字状态
      typingIndicator.style.display = 'none';
    }
  });
  
  // 更新用户列表
  // 监听服务器发送的'updateUserList'事件
  socket.on('updateUserList', (users) => {
    usersList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      if (user === username) {
        li.classList.add('current-user');
        li.textContent = `${user} (你)`;
      } else {
        li.textContent = user;
      }
      usersList.appendChild(li);
    });
  });
}); 
```