---
title: 快速上手Node.js的基础知识，开发中小型服务器
date: 2024-11-03
category: Note
tags:
    - Node.js
description: 路由模块化，Express，监听请求，中间件，JWT，身份验证，数据库操作，MySQL
outline: [2,6]
---

## 控制台文字格式化

### 颜色

`npm install ansi-colors`

```javascript
const colors = require('ansi-colors');

console.log(colors.red('这是一个红色的文本'));
console.log(colors.blue('这是一个蓝色的文本'));
console.log(colors.green('这是一个绿色的文本'));
console.log(colors.yellow('这是一个黄色的文本'));
console.log(colors.bgCyan('这是一个青色背景的文本'));
console.log(colors.bold('这是一个加粗的文本'));
console.log(colors.underline('这是一个带有下划线的文本'));
```

### 清屏

`npm install clear`

```javascript
const clear = require('clear');
clear(); // 清屏
```

### 符号

```JavaScript
// 输出箭头符号
console.log('→');

// 输出勾选符号
console.log('✔');

// 输出错误符号
console.log('✖');

// 输出信息符号
console.log('ℹ');

// 输出警告符号
console.log('⚠');

// 输出其他符号
console.log('★'); // 星号
console.log('♥'); // 心形
console.log('☀'); // 太阳
```

`可以`使用Tab键快速补全文件名(路径)

`fs.readFile()`方法，用于读取指定文件的内容
`fs.writeFile()`方法，用于向指定文件写入内容

```javascript
const fs = require('fs'); // 导入fs模块
```

fs.readFile( 文件路径 , 编码格式(可选) , 回调函数 )

```javascript
const fs = require('fs');
fs.readFile('1.txt','utf-8',function(err,data){ // err代表失败结果，data代表成功结果
console.log(err);
console.log('----------------');
console.log(data);
})
```

fs.writeFile( 文件路径，写入内容，格式（可选），回调函数)

```javascript
const fs = require('fs');
fs.writeFile('1.txt','Hello World!','utf-8',function(err){
console.log(err);
})
```

 `\r\n`代表换行

**使用绝对路径时候注意 一个斜线在JavaScript中代表转译，所以使用两个斜线即可**

`__dirname`表示当前文件所处的目录

  `path.join()`方法，用来将多个路径片段拼接成一个完整的路径字符串

```JavaScript
const path = require('path') // 导入Path模块

const path = require("path")
const pathStr = path.join('/a','/b/c','../','./d','e') // ../代表抵消前一个路径，(返回)
console.log(pathStr); // \a\b\d\e
const pathStr2 = path.join(__dirname,'1.txt')
console.log(pathStr2); // 输出当前文件所处的目录
```

`path.basename()`方法，用来从字符串中，将文件名解析出来

```javascript
const path1 = "Y:\百日工作\Node.js";
const fullNmae = path.basename(path1);
console.log(fullNmae); // node.js

const fullNmae1 = path.basename(path1,'.js');
console.log(fullNmae1); // node
//传入参数有扩展名时，返回值将省略扩展名
```

`path.extname()`方法，可以获取路径中的扩展名部分

```JavaScript
const fpath = 'a/b/c/index/index.html';
const fext = path.extname(fpath)
console.log(fext); // .html
```

**HTTP**

```javascript
const http = require('http') // 导入http模块
```

```JavaScript
const http = require('http')
const server = http.createServer() // 创建web服务器实例
server.on("request",function(req,res){
    console.log("Someone visit our web server"); // 为服务器实例绑定request事件，监听客户端请求
}) 
server.listen(8080,function(){
console.log("server runing at http://127.0.0.1:8080"); // 启动服务器
})
```

**req请求对象**中存储了与客户端相关的数据或者属性

`req.url`客户端请求的URL地址

`req.method`客户端的method请求类型

## req

```javascript
const http = require('http')
const server = http.createServer()
server.on("request",function(req,res){
    console.log("Someone visit our web server");
    const url = req.url;
    const method = req.method;
    const str = `请求地址:${url},请求类型${method}`
    console.log(str);
})
server.listen(8080,function(){
console.log("server runing at http://127.0.0.1:8080");
})
//http://127.0.0.1:8080/index.html
// /index.html
// GET
```

## res


访问与服务器相关的数据或者属性

```javascript
res.end(str) // 方法用于向客户端发送指定内容，并结束本次请求的处理过程
```

### 解决中文乱码问题

设置响应头content-Type的值为text/html：charset=utf-8

Content-Type表示以什么编码格式解析返回的内容

```javascript
   res.setHeader('Content-Type','text/html; charset=utf-8')
```

**根据不同的url地址响应不同的html内容**

```javascript
const http = require('http')
const server = http.createServer()
server.on("request", function (req, res) {
    console.log("Someone visit our web server");
    const url = req.url;
    const method = req.method;
    let content = '<  h1>404 Not found!<  /h1>';
    if (url === '/' || url === '/index.html') {
        content = '<  h1>首页<  /h1>'
    }
    else if (url === '/about.html') {
        content = '<  h1>关于<  /h1>'
    }
    const str = `\r\n请求地址:${url},请求方式:${method}`
    console.log(str);
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(content)
})
server.listen(8080, function () {
    console.log("server runing at http://127.0.0.1:8080");
})
```

## 模块化

**模块化**指的是在解决一个复杂问题的时候，自顶向下逐层把系统划分成若干模块的过程，对于系统来说，模块化是**可组合**，**可分解**和**可更换**的单元。

编程领域中的模块化，就是遵守固定的规则，把一个大文件拆分成独立并且互相依赖的多个小模块。

好处：提高复用性，可维护性，以及按需加载

### 模块化规范

例如：

以什么样的语法格式来引入模块
在模块中使用什么样的语法格式来向外暴露成员

Node.js中的模块根据来源的不同，将模块分为3大类，分别是：

内置模块（内置模块是由Node官方提供的，例如：fs，path，http等）
自定义模块（用户创建的每个JS文件，都是自定义模块）
第三方模块（由第三方开发出来的模块，并非官方提供的内置模块，也不是用户创建的自定义模块，并且使用第三方模块需要下载）

**注意**：使用require()方法加载其他模块的时候，会执行被加载模块的代码

在使用require()加载自定义模块时可以省略后缀名

### 模块作用域

 和函数作用域类似，在自定义模块中定义的变量，方法等成员，只能在当前模块内被访问，这种模块级别的访问限制，叫做**模块作用域**

**作用**：用于防止全局变量污染的问题

### 共享模块成员

#### module对象

在每个`.js`自定义模块中都有一个`module`对象，它里面存储了和当前模块有关的信息

module.exports对象，将模块内的成员共享出去，提供给外界使用

外界用require()方法导入自定义模块时，得到的就是module.exports所指向的对象。

```javascript
module.exports.username='zs'; //向module.exports对象上挂载username属性
module.exports.sayHello= function(){ // ...
    console.log("Hello World!");
}

const user = require('./user')
console.log(user); // { username: 'zs', sayHello: [Function (anonymous)] }
```

注意：使用require()方法导入模块时，导入的结果，永远以module.exports**指向的对象为准**

```javascript
module.exports.username='zs'; //向module.exports对象上挂载username属性
module.exports.sayHello= function(){ // ...
    console.log("Hello World!");
}

module.exports={
    name:'bill',
    say(){
        console.log("Hi!");
    }
}
```

由于module.exports单词写起来比较复杂，为了简化向外共享成员的代码，node提供了exports对象，**默认情况下，exports和module.exports指向同一个对象**，**最终共享的结果，还是以module.exports指向的对象为准**

```javascript
console.log(exports);
console.log(module.exports);
console.log(exports === module.exports); // true
```

#### module.exports和exports的使用误区

注意：require()模块时，得到的永远是**module.exports**指向的对象

为了防止混乱，建议在一个模块中不要**同时使用**exports和module.exports

#### 模块化规范

Node.js遵循了`CommonJS`模块化的规范，`CommonsJS`规定了模块化的特性和各模块之间的如何相互依赖

每个模块内部，module变量代表当前模块
module变量是一个对象，它的exports属性（即module.exports）是对外的接口
加载某个模块，其实是加载模块的module.exports属性，require()方法用于加载模块

#### 包

Node中的**第三方模块**又叫做**包**

作用：

由于Node内置模块提供了一些底层的API，导致在基于内置模块进行开发项目中，效率很低

**包是基于内置模块封装出来的，**提供了更高级，更方便的API，极大的提高了开发效率

全球最大的包共享平台：https://www.npmjs.com/

下载地址：https://registy.npmjs.org/

**package-lock.json配置文件**用于记录node_modules目录下的每一个包的下载信息，例如包的名字，版本号，下载地址等

包的**语义化规范**：

例如：2.24.0

第一位数字：大版本

第二位数字：功能版本

第三问数字：Bug修复版本

版本提升规则：只要前面的版本号增加了，则后面版本号归零。

**package.json配置文件**记录配置信息，如

项目的名称，版本号，描述等
**项目中使用了哪些包**
开发期间使用的包
部署时需要的包

注意：在项目开发中，要把node_modules文件夹添加到**.gitignore忽略文件**中。

使用`npm init -y`命令快速创建package.json文件

注意：上述命令只能在英文目录下成功运行！即项目文件夹名称一定要使用英文名称，不要有**空格**。

`npm install`命令会一次性把所有依赖的包安装

`npm uninstall`卸载包

如果某些包只在**项目开发阶段**会用到，在**项目上线之后就用不到了**，则建议把这些包记录到`devDependencies`节点中，如果**开发**和**上线**都要用到，则记录到`dependencies`节点中。

//安装指定包，并记录到`devDependencies`节点中

`npm i 包名 -D`

完整写法：`npm install 包名 --save-dev`

查看当前的下载镜像地址：`npm config get registry`

切换镜像源地址：`npm config set registry=https://registry.npm.taobao.org/`

#### nrm

为了更方便的切换下包的镜像源，可以安装nrm工具。

`npm i nrm -g` // 全局安装

`nrm ls`查看所有可用的镜像源

`nrm use <  name>`切换地址

##### 分类

使用npm包管理工具下载的包，分为两大类：

项目包
  开发依赖包（记录在devDependencies中）
  核心依赖包（记录在dependencies中）


全局包
  `npm i <  name> -g`
  `npm uninstall <  name> -g`
  只有**工具性质**的包，才有全局安装的必要性
  `npm root -g`查看全局包路径

#### i5ting_toc

i5ting_toc是一个可以把md文件转化成html页面的工具

`npm install -g i5ting_toc` // 全局安装

`i5ting_toc -f <  文件路径> -o` // 使用

-f代表要转换的文件路径 -o转换完成后自动打开浏览器

注意：转换失败使用**管理员cmd**即可

#### 包结构

一个规范的包，组成结构必须符合：

包必须以单独的目录而存在

包的顶级目录下必须包含**package.json**这个包管理配置文件

**package.json**必须包含name，version，main这三个属性，分别代表名字，版本号，包的入口（require加载的文件）

## Express

Express是基于Node.js平台，快速，开放，极速的**Web开发框架**

通俗理解：Express的作用和Node.js内置http模块类似，是专门用来**创建web服务器的**

本质是一个第三方的包  **地址**：http://www.expressjs.com.cn/

安装：`npm i express@4.17.1`

```javascript
const express = require("express") // 导入Express
const app = express() // 创建Web服务器
app.listen(8080,()=>{ // 调用app.listen(端口号，回调函数)来启动服务器
    console.log("Express server running at http://127.0.0.1");
})
```

### 监听GET请求

```javascript
app.get("请求URL",function(req,res){/*处理函数*/})
//req：请求对象，包含了与请求相关的属性和方法
//res：响应对象，包含了与响应相关的属性与方法
```

### 监听POST请求

```javascript
app.post("请求URL",function(req,res){/*处理函数*/})
//req：请求对象，包含了与请求相关的属性和方法
//res：响应对象，包含了与响应相关的属性与方法
```

### 内容响应

```javascript
res.send({
    name:"as",
    age:12,
    sex:'boy'
})

```

### 获取参数

获取URL中携带的查询参数

通过`req.query`对象，可以访问到客户端通过查询字符串的形式，发送到服务器的参数

```javascript
app.get("/", function (req, res) {/*处理函数*/
    console.log(req.query);
    res.send(req.query)
    
})
//http://127.0.0.1:8080/?name=zs&age=18
```

#### 动态参数

通过`req.params`对象，可以访问到URL中，通过**：**匹配到的动态参数

```javascript
app.get("/user/:id", function (req, res) { // 动态参数id
    res.send(req.params)
})

//http://127.0.0.1:8080/user/12
//{"id":":12"}

app.get("/user/:id/:name", function (req, res) {/*处理函数*/
    res.send(req.params)
    console.log(req.params);
})
//http://127.0.0.1:8080/user/2/23
//{"id":"2","name":"23"}
```

### 托管静态资源

express.static()

用于创建一个静态资源服务器，例如：通过以下代码就可以将public目录下的图片，css文件，JS文件对外开放了

```javascript
app.use(express.static("pubilc"))
//现在外界就可以访问public的所有文件
```

注意：express在指定的静态目录中查找文件，并对外提供资源的访问路径，因此，**存放静态文件的目录名不会出现在URL中**

http://localhost:3000/images/1.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/index.js

```javascript
app.use(express.static(path.join(__dirname,'home')))
console.log(path.join(__dirname,'home'));

//http://127.0.0.1:8080/index.html
//http://127.0.0.1:8080/css/main.css
```

#### 托管多个静态目录

**多次调用即可**

注意：当外界访问两个文件夹中相同文件（名）时，会根据调用顺序返回文件

#### 挂载路径前缀

```javascript
app.use('/public',express.static(path.join(__dirname,'home')))
//需要通过指定前缀才能访问到文件
//http://127.0.0.1:8080/public/index.html
```

### nodemon

在编写和调试Node的时候，如果修改了代码需要手动关闭然后再启动，太繁琐

它可以监听项目文件的变动，当代码修改后，nodemon会**自动重启项目**，极大提升开发效率

#### 安装nodemon

`npm install -g nodemon`

#### 使用Nodemon

`nodemon <  name.js>`

### Express路由

路由指**映射关系**

例子：

按键1-业务查询
按键2-手机充值
按键3-业务办理
按键4-人工客服

路由是**按键**和**服务**之间的**映射关系**

所以：

在express中，路由指的是**客户端请求**与**服务器处理函数**之间的**映射关系**

共有三个部分组成：

请求类型 (method)
请求URL (path)
处理函数 (handlek)

```javascript
app.method(path,handlek)
// method:get post ...
// path:...
// handlek:...
```

```javascript
app.post("/user", function (req, res) {/*处理函数*/
    res.send("请求成功")
})
```

### 模块化路由

为了方便对路由进行模块化管理，Express不建议将路由直接挂载到app上，而是推荐将路由**抽离为单独的模块**。

1. 创建路由模块对于的`.js`文件
2. 调用express.Router()函数来创建路由对象
3. 向路由对象上挂载具体的路由
4. 使用module.exports向外共享路由对象
5. 使用app.use()函数注册路由模块

```javascript
// 创建路由模块
const express = require("express")
const router = express.Router() //  创建路由对象

router.get("/", function (req, res) {
    res.send("Get Success!")
    console.log("Get!");
})
router.post("/", function (req, res) {
    console.log("Post!");
    res.send("Post Success!")
})

module.exports = router // 向外导出路由对象
```

```javascript
// 注册路由模块
const express = require('express');
const app = express()

const userRouter = require('./Router') // 导入路由模块
app.use(userRouter) // 注册路由模块

app.listen(8080, () => {
    console.log("express server running at http://127.0.0.1:8080");
})
```

app.use()函数的作用，就是来**注册全局中间件的**

#### 路由模块前缀

```javascript
app.use('/api',userRouter)
```

## 中间件

中间件，特指**业务流程**的中间**处理环节**

express中间件的调用流程：
当一个请求到达express服务器后，可以连续调用多个中间件，从而对这次请求进行**预处理**

express的中间件本质就是一个function处理函数，express格式如下：
注意：中间件函数的形参列表中**必须包含next函数**，而路由处理函数**只有包含req和res**

```javascript
app.get('/'.function(req,res,next){
        next();
})
app.listen(3000)
```

**next函数**是实现**多个中间件连续调用**的关键，它表示把流转关系**转交**给下一个**中间件**或者**路由**

```javascript
//常量mw所指向的就是一个中间件函数
const mw = function (req, res, next) {
    console.log("中间件函数");
    next()
    //注意：在当前中间件业务处理完毕后必须调用next()函数表示把流转关系转交给下一个中间件或者路由
}
```

#####  **全局生效**的中间件

客户端发起的任何请求，到达服务器后，**都会触发中间件**，叫做全局生效的中间件

通过调用app.use(中间件函数)，即可定义一个全局生效的中间件

```javascript
app.use((req, res, next) => {
    next()
})
```

中间件的作用：

多个中间件之间，共享同一份req和res，基于这样的特性，我们可以在**上游**的中间件中，统一为req和res对象添加**自定义的属性和方法**，供**下游**的中间件或者路由使用

```javascript
app.use((req, res, next) => {
    const time = Date.now()
    req.time= time // 为req对象挂载一个自定义属性，从而把时间共享给所有的路由或者中间件
    next()
})
app.get('/', (req, res) => {
    res.send("Home pags"+req.time)
})

```

##### 定义多个全局中间件

```javascript
app.use((req, res, next) => {
    const time = Date.now()
    req.time= time // 为req对象挂载一个自定义属性，从而把时间共享给所有的路由或者中间件
    console.log('中间件1');
    next()
})
app.use((req, res, next) => {
    console.log('中间件2');
    
    next()
})
app.get('/', (req, res) => {
    res.send("Home pags"+req.time)
})

```

#####  局部**生效**的中间件

不使用app.use()定义的中间件，叫做局部生效的中间件

```javascript
const mw = function (req, res, next) {
    console.log("局部中间件函数");
    next()
}
app.get('/qwe',mw,function(req,res){
    res.send('zjj');
    console.log('局部中间件log');
})
```

##### 定义多个局部中间件

```javascript
const mw1 = function (req, res, next) {
    console.log("局部中间件函数1");
    next()
}
const mw2 = function (req, res, next) {
    console.log("局部中间件函数2");
    next()
}
app.get('/qwe',mw1,mw2,function(req,res){
    res.send('zjj')
    console.log('局部中间件log');
})
app.get('/qwe',[mw1,mw2],function(req,res){
    res.send('zjj')
    console.log('局部中间件log');
})
```

##### 中间件的注意事项

一定要在路由之前注册中间件

客户端发送过来的请求，**可以连续调用多个**中间件进行处理

执行完中间件业务代码后，**不要忘记调用next()函数**

为了**防止代码逻辑混乱**，调用next()函数后**不要再了写额外代码**

连续调用多个中间件的时，多个中间件之间，共享req和res对象

##### 中间件分类

应用级别的中间件

  通过app.use()或者app.get()或者app.post()，**绑定到app实例上的中间件**，叫做应用级别中间件

路由级别的中间件

  绑定到Express.Router()实例上的中间件，叫做路由级别的中间件，它的用法和应用级别的中间件没有任何区别，只不过，应用级别的中间件是绑定到app实例的，路由级别的中间件绑定到router实例上的

错误级别的中间件

  作用：专门捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题 -

  格式：错误中间件的function处理函数中，必须有4个形参，分别为（err,req,res,next）

  注意：错误级别中间件**必须注册在所有路由之后**

 ```javascript
    app.get('/', (req, res) => {
        throw new Error("error")
        res.send("Home pags"+req.time)
    })
    app.use(function(err,req,res,next){
        console.log('错误:',err.message);
        res.send('错误:',err.message)
    })
    //定义错误级别的中间件，用于捕获整个项目的异常错误，防止程序的崩溃/停止
 ```

​    

Express内置的中间件

  Express内置了**三个常用的中间件**，极大提高开发效率和体验

  express.static快速托管静态资源的内置中间件，例如：HTML，图片，css文件等

  express.json解析JSON格式的请求体数据类型（有兼容性，仅在4.16.0+使用）

  express.urlencoded解析 URL-encoded格式的请求体数据 （有兼容性）

  ```JavaScript
    // app.use(express.json)
    //  app.use(express.urlencoded({extended:false}))
    // 在服务器，可以使用req.body这个属性，来接收客户端发送过来的请求数据
    // 默认情况下，如果不配置解析表单数据的中间件，则req.body默认等于undefined
    // 除了错误级别中间件，其他的中间件必须在路由之间配置

    //JSON
    app.use(express.json)
    app.post('/data', function (req, res) {
        console.log(req.body);
        res.send("Success")
    })

    //URL
    app.use(express.urlencoded({ extended: false }))
    app.post('/book', function (req, res) {
        console.log(req.body);
        res.send("Success")
    })
  ```

第三方中间件

  非Express官方内置的，而是由第三方开发出来的中间件，在项目中，按需下载并配置第三方中间件，从而提高项目的开发效率

  例如：body-parser，这个中间件来解析请求体数据

    1. 运行npm install body-parser安装中间件
    2. 使用require导入中间件
    3. 调用app.use()注册并且使用中间件

  **注意**：Express内置的中间件，就是基于body-parser这个中间件进一步封装的

  ```javascript
    const express = require('express')

    const app = express()

    const parser = require('body-parser')
    app.use(parser.urlencoded({extended:false}))

    app.post('/user',(req,res)=>{
        console.log(req.body);
        res.send("OK")
    })

    app.listen(99,function(){
        console.log("http://127.0.0.1:99");
    })
  ```

##### 自定义中间件

```javascript
// 注册路由模块
const express = require('express');
const colors = require('ansi-colors')
const clear = require('clear')
const qs = require('querystring')
const app = express()
clear()
app.use((req, res, next) => { // 监听req对象的data事件，获取客户端发送到服务器的数据
    let str = '';
    req.on('data', (chuck) => {
        str += chuck
    })
    req.on('end',()=>{ //当数据接收完毕后，会自动触发req的end事件
        const body = qs.parse(str)
        console.log(body); // 完整的请求体
        req.body=body
        next()
    })
})

app.post("/user",(req,res)=>{
    res.send(req.body)
})


app.listen(9090, () => {
    console.log("express server running at:", colors.green('http://127.0.0.1:9090'));
})   
```

### 接口

#### 创建API路由模块

```javascript
const express = require("express")
const colors = require('ansi-colors')

const router = express.Router() //  创建路由对象

router.get("/get", function (req, res) {
    const query = req.query // 获取客户端通过查询字符串，发送到服务器的数据
    res.send({
        status:0,   // 状态码，0表示成功，1表示失败
        msg:'GET Success', // 状态描述
        data:query // 响应给客户端的具体数据
    })
    console.log(colors.green('✔ Get!'));
})



// 注意：如果要获取URL-encoded格式的数据，必须配置中间件app.use(express.urlencoded({extended.false}))
router.post("/post", function (req, res) {
    const body = req.body
    console.log("Post!");
    res.send({
        status:0,   // 状态码，0表示成功，1表示失败
        msg:'POST Success', // 状态描述
        data:body // 响应给客户端的具体数据
    })
})

module.exports = router // 向外导出路由对象 


//------------------------------------
// 注册路由模块
const express = require('express');
const colors = require('ansi-colors')
const clear = require('clear')
const app = express()
clear()

const router = require('./Router')
// app.use(express.json)
app.use(express.urlencoded({extended:false}))
app.use('/api',router)

app.listen(9090, () => {
    console.log("express server running at:", colors.green('http://127.0.0.1:9090'));
})   


```

#### CORS跨域资源共享

协议不同导致无法访问

解决方案：

CORS（主流的解决方案）

JSONP（有缺陷的解决方案，指支持GET）

##### 使用CORS中间件解决跨域问题

CORS是Express的一个第三方中间件，通过安装和配置CORS中间件，可以很方便的解决跨域问题

1. 运行`npm install cors` 安装中间件
2. 使用`const cors = require('cors')`导入中间件
3. 在路由之间调用`app.use(cors())`配置中间件

```javascript
//一定要在路由之间调用app.use(cors())配置中间件！！！
var cors = require('cors')
app.use(cors())
```

```javascript
// 完整HTML代码
<  !DOCTYPE html>
<   html lang="en">

<   head>
    <   meta charset="UTF-8">
    <   meta name="viewport" content="width=device-width, initial-scale=1.0">
    <   title>Document<   /title>
    <   script src="https://cdn.staticfile.net/jquery/3.4.1/jquery.min.js"><   /script>

<   /head>

<   body>
    <   button id="btnget">Get<   /button>
    <   button id="btnpost">Post<   /button>
    <   script>
        $(function () {
            $('#btnget').on('click', function () {
                $.ajax({
                    type: 'GET',
                    url: 'http://127.0.0.1:9090/api/get',
                    data: {
                        name: "张三",
                        age: 20,
                        Sex: '男',
                    },
                    success: function (res) {
                        console.log(res);
                    },
                })
            })

            $(function () {
                $('#btnpost').on('click', function () {
                    $.ajax({
                        type: 'POST',
                        url: 'http://127.0.0.1:9090/api/post',
                        data: {
                            name: "李四",
                            age: 20,
                            Sex: '女',

                        },
                        success: function (res) {
                            console.log(res);
                        }
                    })
                })
            })
        })
    <   /script>
<   /body>

<   /html>
```

##### 什么是CORS

指**跨资源共享**，由一系列的**HTTP响应头**组成，**这些HTTP响应头决定了浏览器是否阻止前端JavaScript代码跨域获取资源**

浏览器的**同源安全策略**默认会阻止网页跨域获取资源，但如果接口**配置了CORS相关的HTTP响应头**，就了可以**解决浏览器的跨域访问限制**

> 响应的结果被浏览器拦截，网页无法获取到跨域响应的数据

注意事项：

CORS主要在**服务器端**进行配置，**客户端浏览器无需做任何额外的配置**，即可开启CORS的接口

CORS在浏览器中有兼容性问题，只有支持XMLHttpRequest Level 2的浏览器，才能正常访问CORS的服务端接口（例如：IE10+,Chrome4+,FireFox3.5+）

##### CORS响应头

Access-Control-Allow-**Origin**

响应头中可以携带一个Access-Control-Allow-Origin字段 语法:

Access-Control-Allow-Origin: <   Origin> | *

例如：下面的字段值将**只允许**来自Http://itcast.cn的请求

```javascript
res.setHeader("Access-Control-Allow-Origin",'Http://itcast.cn')
// 表示我们的服务器只支持这个域名下所有网页的跨域请求
```

通过Access-Control-Allow-Origin响应头可以控制允许哪些网页或者网站来请求我们的服务器接口

如果指定Access-Control-Allow-Origin字段的值为通配符 *，表示允许来自任何域的请求

```javascript
res.setHeader("Access-Control-Allow-Origin",'*')
```

Access-Control-Allow-Headers

默认情况下，CORS**仅**支持**客户端向服务器**发送如下的**9个请求头**

略...

如果客户端向服务器发送了**额外的请求头信息**，则需要在**服务器端**，通过Access-Control-Allow-Header**对额外的请求头进行申明**，否则这次请求失败！

```javascript
res.setHeader('Access-Control-Allow-Header','Content-Type','X-Custon-Header')
//手动设置响应头 允许使用Content-Type请求头，也允许使用X-Custon-Header请求头
```

Access-Control-Allow-Methods

默认情况下，CORS仅支持客户端发起GET，POST，HEAD，请求

如果客户端希望通过**PUT，DELETE**等方式请求服务器资源，则需要在服务器端，通过Access-Control-Allow-Methods来**指明实际请求所允许使用的HTTP方法**

```javascript
// 只允许 POST，GET , PUT , HEAD 请求方式
res.setHeader('Access-Control-Allow-Methods','POST','GET','HEAD','DELETE')
// 允许所有HTTP请求方式
res.setHeader('Access-Control-Allow-Methods','*')
```

CORS请求的分类

客户端在请求CORS接口时，根据**请求方式**和**请求头**的不同，可以将CORS的请求分为**两大类**

简单请求

  *同时满足以下*
  **请求方式**：GET,POST,HEAD三者之一
  **http头部信息**不超过以下几种字段：无自定义头部字段，Accept,Accept-Language,Content-Language,DPR,Downlink,Sava-Data,Viewport-Width,Content-Type（只有三个值application/x-www-form-URL encoded,multipart/form-data.text/pain）

预检请求

  *符合以下其一*
  **请求方式**：GET,POST,HEAD**之外**的请求Method类型
  请求头中包含了**自定义头部字段**
  向服务器发送了application/JSON格式的数据

  在浏览器与服务器正式通信之前，浏览器会**先发送OPTION请求进行预检**，**以获知服务器是否允许该实际请求**，所以这一次的OPTION请求被称为“预检请求“。**服务器成功响应预检请求后，才会发送真正的请求，并且携带真实的数据**

区别：

  简单请求的特点：客户端与服务器之间只会发生一次请求
  预检请求的特点：客户端与服务器之间会发生两次请求，OPTION预检请求成功后，才会发起真正的请求

```javascript
// 路由模块 所有代码
const express = require("express")
const colors = require('ansi-colors')

const router = express.Router() //  创建路由对象

router.get("/get", function (req, res) {
    const query = req.query // 获取客户端通过查询字符串，发送到服务器的数据
    res.send({
        status:0,   // 状态码，0表示成功，1表示失败
        msg:'GET Success', // 状态描述
        data:query // 响应给客户端的具体数据
    })
    console.log(colors.green('✔ Get!'));
})



// 注意：如果要获取URL-encoded格式的数据，必须配置中间件app.use(express.urlencoded({extended.false}))
router.post("/post", function (req, res) {
    const body = req.body
    console.log("Post!");
    res.send({
        status:0,   // 状态码，0表示成功，1表示失败
        msg:'POST Success', // 状态描述
        data:body // 响应给客户端的具体数据
    })
})

router.delete('/delete',function(req,res){
    res.send({
        status:0,   // 状态码，0表示成功，1表示失败
        msg:'DELETE Success', // 状态描述
    })
})
module.exports = router // 向外导出路由对象 

```



```javascript
// 主服务器端 所有代码
// 注册路由模块
const express = require('express');
const colors = require('ansi-colors')
const clear = require('clear')
const app = express()
clear()

// app.use(express.json)

app.use(express.urlencoded({ extended: false }))
var cors = require('cors')
app.use(cors())

const router = require('./Router')
app.use('/api', router)

app.listen(9090, () => {
    console.log("express server running at:", colors.green('http://127.0.0.1:9090'));
})


```



```javascript
// 测试网页
<   !DOCTYPE html>
<   html lang="en">

<   head>
    <   meta charset="UTF-8">
    <   meta name="viewport" content="width=device-width, initial-scale=1.0">
    <   title>Document<   /title>
    <   script src="https://cdn.staticfile.net/jquery/3.4.1/jquery.min.js"><   /script>

<   /head>

<   body>
    <   button id="btnget">Get<   /button>
    <   button id="btnpost">Post<   /button>
    <  button id="btndelete">Delete<  /button>
    <  script>
        $(function () {
            $('#btnget').on('click', function () {
                $.ajax({
                    type: 'GET',
                    url: 'http://127.0.0.1:9090/api/get',
                    data: {
                        name: "张三",
                        age: 20,
                        Sex: '男',
                    },
                    success: function (res) {
                        console.log(res);
                    },
                })
            })
            $('#btndelete').on('click', function () {
                $.ajax({
                    type: 'DELETE',
                    url: 'http://127.0.0.1:9090/api/delete',
                    success: function (res) {
                        console.log(res);
                    },
                })
            })
            $(function () {
                $('#btnpost').on('click', function () {
                    $.ajax({
                        type: 'POST',
                        url: 'http://127.0.0.1:9090/api/post',
                        data: {
                            name: "李四",
                            age: 20,
                            Sex: '女',

                        },
                        success: function (res) {
                            console.log(res);
                        }
                    })
                })
            })
        })
    <  /script>
<  /body>

<  /html>
```

**注意**：建议在火狐浏览器中测试，Chrome浏览器中存在问题（无法演示预检请求）

## JSONP

概念：浏览器通过<  script>标签的src属性，请求服务器上的数据，同时，服务器返回一个函数的引用。这种请求数据的方式叫 JSONP

特点：

JSONP不属于真正的Ajax请求，因为它没有使用`XMLHttpRequest`这个对象
JSONP仅支持GET请求，其他POST，PUT，DELETE不支持

创建JSONP接口注意事项：

如果项目中已经配置了CORS跨域资源共享，为了**防止冲突**，**必须在配置CORS中间件之前申明JSONP的接口**，否则JSONP接口会被处理成开启了CORS的接口。

```javascript
// 优先创建JSONP接口，即这个接口不会被处理成CORS接口
app.use('api/jsonp',(req.res)=>{...})
// 再配置CORS中间件，后续所有接口都会被处理成CORS接口
app.use(cors())
```

### 实现JSONP

1. **获取**客户端发送过来的**回调函数的名字**
2. 得到要通过JSONP形式**发送给客户端的数据**
3. 根据前两步得到的数据，**拼接出一个函数调用的字符串**
4. 把上一步拼接得到的字符串，响应给客户端的<  script>标签进行解析

 原理：客户端通过Script标签，把一个函数的名发送给服务器，然后希望服务器返回这个函数的调用，在调用期间把数据传进来就行了

```javascript
// 服务端
app.get('/api/jsonp', (req, res) => {
    // 获取客户端发送过来的回调函数的名字
    const funName = req.query.callback
    // 得到要通过 JSONP形式发送给客户端的数据
    const data = { name: 'zs', age: 33 }
    // 根据前两步得到的数据，拼接一个函数调用的字符串
    const scriptStr = `${funName}(${JSON.stringify(data)})`
    // 将拼接得到的字符串响应给客户端的<  script>标签进行解析
    res.send(scriptStr)
})
```



```javascript
// 客户端 

//    <  button id="btnJSONP">JSONP<  /button>

 $('#btnJSONP').on('click', function () {
                $.ajax({
                    type: 'GET',
                    url: 'http://127.0.0.1:9090/api/jsonp',
                    dataType:'jsonp', // 请求数据类型
                    success: function (res) {
                        console.log(res);
                    },
                })
            })
```

## 数据库与身份认证

MySQL Server :**专门来提供数据存储和服务的软件**

MySQL Workbench：**可视化的MySQL管理工具**，通过它，可以方便的操作存储在MySQL Server中的数据

### 基本使用

DataType数据类型：

int整数
varchar(len)字符串
tinyint(1)布尔值

字段的特殊标识：

PK (Primary Key) 主键-唯一表示
NN (Not Null) 值不允许为空
UQ  (Unique) 值唯一
AI (Auto Increment) 值自动增长

#### 写入数据

右键表选择第一个选项

注意：

ID不需要手动输入，因为它是**自增字段**

status也不需要输入，因为默认值是0，表示状态正常

写入完后，点击Apply保存

```javascript
// 从FROM指定的表中，查询除所有的数据，*表示所有项
select * from <  表名>
// 从FROM指定的表中查询出列名称（字段）的数据
select 列名称 FROM 表名称
```

注意：SQL语句中的**关键字**对大小写不敏感，SELECT等于select

使用`--`注释语句，记得加空格

```javascript
// INSERT INTO 语句用于向数据表中插入新的数据行
// 向指定的表中，插入如下几列数据，列的值通过values一一指定
// 注意：列和值要一一对应，多个列和多个值之间，使用英文的逗号分隔
INSERT INTO table_name(列1,列2...) values(值1,值2...)
//例句：
insert into users(username,password) values('tony stark','098123')
```

```javascript
// Update 语句用于修改表中的数据
// 用UPDATE指定要更新哪个表中的数据
// 用SET指定列对应的值
// 用WHERE 指定更新的条件
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
// 例如：
UPDATE users set password = '888888' where id = 4
//把用户id为4的密码修改为'888888'
update users set password = 'admin123' , status = '1' where id = 2
// 修改多个数据
```

```javascript
//DELETE语句用于删除表中的行
//从指定的表中，根据WHERE条件，删除对应的行
//DELETE FROM 表名称 WHERE 列名称 = 值

```

WHERE（where）语句用于限定选择的标准，在select，update，delete语句中，皆可使用where语句来限定选择标准

`=`等于
`<  >`不等于
`>`大于
`<  `小于
`>=`大于等于
`<  =`小于等于
`BETWEEN`在某个范围
`LIKE`搜索某种模式

注意：在某些版本的SQL中，操作符`<  >`可以写成`!=`

```javascript
select * from users where username<  >'ls'

```

AND和OR可在WHERE语句中把两个或者多个条件结合起来

```javascript
select * from users where status = 0 and id > 1
```

ORDER BY语句用于**根据指定的列**队结果进行排序

默认安按照升序**ASC**，如果要使用降序可以使用**DESC**关键字

```javascript
select * from users order by status DESC
select * from users order by status ASC
```

多重排序

对users表中的数据，先按照status字段进行降序排序，再按照username的字母进行升序排序

```javascript
select * from users order by status DESC ,username ASC
```

Count(*)函数用于返回**查询结果的总数据条数**

```javascript
SELECT COUNT(*) FROM 表名称

```

使用AS为列**设置别名**

```javascript
SELECT COUNT(*) AS TOTAL FROM users where status=0
             
select username as 用户名,password as 密码 from users             
```

### 在项目中操作MySQL

步骤：

1. 安装操作MySQL数据库的第三方模块(MySQL)
2. 通过MYSQL模块连接到MySQL数据库
3. 通过MySQL模块执行SQL语句

安装MySQL模块`npm install mysql`

```javascript

```

调用`db.query()`函数，指定要执行的SQL语句，通过回调函数拿到执行的结果

```javascript
// 检测MYSQL是否能正常工作
db.query("SELECT 1", (err, results)=> {
    if (err) return console.log(err.message);
    // 只要打印出[RowDataPacket {'1':1}] 的结果，就证明数据库连接正常
    console.log(results);
})
```

#### 查询数据

```javascript
db.query("select * from users",(err,results)=>{
    if(err) return console.log(err.message);
    console.log(results);
})
// 注意：如果执行的是select查询语句，则执行的结果是数组
// 结果：
[
  RowDataPacket {        
    id: 1,
    username: 'zs',      
    password: '123456',  
    status: 0
  },
  RowDataPacket {        
    id: 2,
    username: 'ls',      
    password: 'admin123',
    status: 1
  },
  RowDataPacket {
    id: 3,
    username: 'xh',
    password: '654321',
    status: 0
  }
]
```

#### 插入数据

```javascript
// 向users表中新增数据，其中username为Spider-Man ，password为pcc1234

// 要插入到users表中的对象
const user = { username: "spider-Man", password: 'spcc1122' }
// 待执行的sql语句，其中英文的？表示占位符
const sqlStr = 'insert into users (username,password) values (?,?)'
// 使用数组的样式，依次为？占位符指定的值
db.query(sqlStr,[user.username,user.password],(err,results)=>{
    if(err) return console.log(err.message);
    if(results.affectedRows === 1) {
        console.log("插入成功!");
    }
})
```

**注意**：id具有唯一性，只要这个id曾经被别人占用过，哪怕把对应的数据删除了，那这个id也不能被重复占用(使用)

##### 便捷方式

插入数据的便捷方式

向表中新增数据时，如果数据**对象的每个属性和数据表中的字段一一对应**，则可以通过下列方式快速插入数据 

```javascript
const user = { username: "李四", password: 'nbgls2333' }
const sqlStr = 'insert into users set ?'
db.query(sqlStr, user, (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        // console.log(results);
        console.log("插入成功!");
    }
})
```

#### 更新数据

```javascript
// 要更新的数据对象
const user = { id: 1, username: 'aaa', password: '000' }
// 待执行的SQL语句
const sqlStr = 'update users set username=?,password=? where id?'
// 调用db.query()执行SQL语句，同时使用数组依次为占位符指定具体的值
db.query(sqlStr, [user.username, user.password, user.id], (err, results) => {
    if (err) return console.log(err.message);
    // 注意： 执行了update语句之后，执行的结果也是一个对象，可以通过affectedRows判断成功与否
    if (results.affectedRows === 1) {
        console.log('更新数据成功！');
    }
})
```

##### 便捷方式

```javascript
// 要更新的数据对象
const user = { id: 7, username: 'bbb', password: '000' }
// 待执行的SQL语句
const sqlStr = 'update users set ? where id=?'
// 调用db.query()执行SQL语句，同时使用数组依次为占位符指定具体的值
db.query(sqlStr, [user,user.id], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('更新数据成功！');
    }
})
```

#### 删除数据

推荐使用ID这样的唯一标识来删除对应的数据

```javascript
//要执行的语句
const sqlStr = 'delete from users where id=?'
// 为了占位符指定具体的值
// 注意：如果SQL语句中有多个占位符，则必须使用数组每个占位符指定具体的值
// 如果只有一个值，则可以省略数组
db.query(sqlStr, 7, (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('删除数据成功！');
    }
})
```

##### 标记删除

使用delete语句，会真的把数据从表中删除，为了保险起见，**推荐使用**标记删除的形式，来**模拟删除的动作**

所谓标记删除就是在表中设置类似status这样的**状态字段**，来**标记**当前这条数据是否被删除

```javascript
db.query('update users set status = 1 where id=?', 6, (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('标记删除数据成功！');
    }
})

```

## 身份认证

### web开发模式

基于**服务端渲染**的传统Web开发模式

  服务器发送给客户端的HTML页面，是在**服务器通过字符串拼接，动态生成**的。因从，客户端不需要Ajax这样的技术额外请求页面的数据

  优点：

    **前端耗时少**，因为服务端负责生成HTML内容，浏览器只需要直接渲染即可，尤其是移动端，更省电
    **有利于SEO**，因为服务器响应的是完整的HTML页面内容，所以爬虫更容易爬取信息，更利于SEO搜索引擎

  缺点：

    **占用服务器资源**，即服务器端完成HTML页面的拼接，如果请求过多，会对服务器造成一定的访问压力
    **不利于前后端分离，开发效率低**。**无法进行分工合作**，尤其是对于前端复杂度高的项目，不利于开发效率

  ```javascript
    app.get('./', (req, res) => {
        const user = { name: 'ee', age: 11 }
        const html = `<  h1>姓名:${user.name},年龄：${user.age}<  /h1>`
        res.send(html)
    })
  ```

​    

基于**前后端分离**的新型Web开发模式

  依赖于**Ajax技术**的广泛应用，就是**后端只负责提供API接口**，前端使用**Ajax调用接口**的开发模式
  优点：
    开发体验好，前端专注UI页面开发，后端专注API的开发，且前端有更多的选择性
    用户体验好，Ajax的应用，极大提高了用户的体验，可以轻松的实现页面局部刷新
  缺点：
    不利于SEO，因为完整的HTML页面信息需要在客户端通过JS动态拼接完成，所以爬虫无法爬取页面有效信息（可以使用Vue，react等框架的SSR(server side render)技术能很好的解决SEO问题）

如何选择开发模式？

**不谈业务场景而盲目选择使用何种开发模式都是在耍流氓**

比如企业级网站，主要功能是展示而没有复杂的交互，并且需要良好的SEO，则推荐使用服务器端渲染（SSR）
而类似后台管理项目，交互性强，不需要考虑SEO，则推荐使用前后端分离（CSR）

另外：具体使用何种模式不是绝对的，为了同时兼顾了首页的渲染速度和前后端分离的开发效率，一些网站采用了**首屏服务器端渲染+其他页面前后端分离**的开发模式

### 概念

身份认证又称身份验证，鉴权，是指通过一定的手段，完成对用户身份的确认

对于服务端渲染和前后端分离的 这个两种开发模式，分别有着不同的身份认证方案

服务端渲染推荐使用**Session认证机制**
前后端分离推荐使用**JWT认证机制**

#### Session

http协议的**无状态性**

指的是客户端的**每次HTTP请求都是独立的**，连续多个请求之间没有直接关系，**服务器不会主动保留每次HTTP请求的状态**

如何突破HTTP无状态的限制？

比如：对于超市来说。为了方便收银员在进行结算的时候给VIP客户打折，超市会为每个VIP用户发放会员卡

对于客户端和服务器 之间同理

注意：现实生活中的**会员卡身份认证方式**，在Web开发中的**专业术语**叫做**Cookie**



当客户端用户登录成功后，服务器会向客户端发送一个Cookie（身份认证标识）

之后如果再进行登录，客户端把cookie发送给服务器，来进行客户端身份认证

通过Cookie即可突破http协议无状态限制

##### Cookie

Cookie是存储在用户浏览器中的**一段不超过4kb的字符串**。

它有一个**名称**（name），一个**值**（values）和其他几个用于控制Cookie**有效期，安全性，使用范围**的可选属性组成。

不通域名下的Cookie各自独立，每当客户端发起请求时，会**自动**把**当前域名下**所有**未过期的Cookie**一同发送到服务器

特性：

自动发送
域名独立
过期时限
4kb限制

cookie在身份认证中的作用

客户端在第一次请求服务器的时候，服务器**通过响应头的形式**，向客户端发送了一个身份证的Cookie，客户端会自动把Cookie保存在浏览器中

随后，当客户端浏览器每次请求服务器的时候，浏览器会**自动**把身份认证相关的cookie，**通过请求头的形式**发送给服务器，服务器即可验证客户端的身份

Cookie**不具有**安全性

由于Cookie是存储在浏览器的，而且**浏览器也提供了读写Cookie的API**，因此**Cookie很容易伪造**，不具有安全性，因此不建议服务器将重要的隐私数据，通过Cookie的形式发送给浏览器

 **注意**：**千万不要使用Cookie存储重要的隐私数据！**比如用户的身份信息，密码等

**提高**身份认证的**安全性**

为了防止客户伪造会员卡，收银员在拿到客户出示的会员卡后，可以**在收银机上进行刷卡认证**，只有收银机确认存在的会员卡，才能被正常使用

##### 原理

Session的工作原理

...将登录后的用户信息存储在服务器的内存中，同时生成对应的Cookie

后续服务器会根据请求头中携带的Cookie，从内存中查找对应的信息

##### 安装

安装Express-session中间件

`npm install express-session`

配置express-session中间件

中间件安装成功之后，需要通过app.use()来注册session中间件

```javascript
const session = require('express-session')
app.use(session({
  secret: 'item',
  resave: false,
  saveUninitialized: true
}))

```

当Express-session中间件配置完成后，即可通过**req.session**来访问和使用session对象，从而存储用户的关键信息

```javascript
req.session.user = req.body // 将用户的信息存储到session
req.session.islogin = true // 将用户的状态存储到Session
```

从session中取数据

可以直接从req.session对象上获取之前存储的数据

```javascript
 if (!req.session.islogin) {
    return res.send({ status: 1, msg: 'fail' })
  }
  res.send({ status: 0, msg: 'success', username: req.session.user.username })
```

清空session

调用**req.session.destory()**函数，即可清空服务器的保存的session信息

```javascript
req.session.destroy()
```

##### 代码

```JavaScript
// 完整代码
// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// TODO_01：请配置 Session 中间件
const session = require('express-session')
app.use(session({
  secret: 'item',
  resave: false,
  saveUninitialized: true
}))

// 托管静态页面
app.use(express.static('./pages'))
// 解析 POST 提交过来的表单数据
app.use(express.urlencoded({ extended: false }))

// 登录的 API 接口
app.post('/api/login', (req, res) => {
  // 判断用户提交的登录信息是否正确
  if (req.body.username !== 'admin' || req.body.password !== '000000') {
    return res.send({ status: 1, msg: '登录失败' })
  }

  // TODO_02：请将登录成功后的用户信息，保存到 Session 中
  req.session.user = req.body // 将用户的信息存储到session
  req.session.islogin = true // 将用户的状态存储到Session
  res.send({ status: 0, msg: '登录成功' })
})

// 获取用户姓名的接口
app.get('/api/username', (req, res) => {
  // TODO_03：请从 Session 中获取用户的名称，响应给客户端
  if (!req.session.islogin) {
    return res.send({ status: 1, msg: 'fail' })
  }
  res.send({ status: 0, msg: 'success', username: req.session.user.username })
})

// 退出登录的接口
app.post('/api/logout', (req, res) => {
  // TODO_04：清空 Session 信息
  req.session.destroy()
  res.send({
    status:0,
    msg:"退出登录成功"
  })
})


// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8080, function () {
  console.log('Express server running at http://127.0.0.1:8080')
})
```

```html
// index.html
<  !DOCTYPE html>
<  html lang="en">

<  head>
  <  meta charset="UTF-8">
  <  meta name="viewport" content="width=device-width, initial-scale=1.0">
  <  title>Document<  /title>
  <  script src="./jquery.js"><  /script>
<  /head>

<  body>
  <  h1>首页<  /h1>

  <  button id="btnLogout">退出登录<  /button>

  <  script>
    $(function () {

      // 页面加载完成后，自动发起请求，获取用户姓名
      $.get('/api/username', function (res) {
        // status 为 0 表示获取用户名称成功；否则表示获取用户名称失败！
        if (res.status !== 0) {
          alert('您尚未登录，请登录后再执行此操作！')
          location.href = './login.html'
        } else {
          alert('欢迎您：' + res.username)
        }
      })

      // 点击按钮退出登录
      $('#btnLogout').on('click', function () {
        // 发起 POST 请求，退出登录
        $.post('/api/logout', function (res) {
          if (res.status === 0) {
            // 如果 status 为 0，则表示退出成功，重新跳转到登录页面
            location.href = './login.html'
          }
        })
      })
    })
  <  /script>
<  /body>

<  /html>
```

```html
// login.html
<  !DOCTYPE html>
<  html lang="en">

<  head>
  <  meta charset="UTF-8">
  <  meta name="viewport" content="width=device-width, initial-scale=1.0">
  <  title>Document<  /title>
  <  script src="./jquery.js"><  /script>
<  /head>

<  body>
  <  !-登录表单 -->
  <  form id="form1">
    <  div>账号：<  input type="text" name="username" /><  /div>
    <  div>密码：<  input type="password" name="password" /><  /div>
    <  button>登录<  /button>
  <  /form>

  <  script>
    $(function () {
      // 监听表单的提交事件
      $('#form1').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发起 POST 登录请求
        $.post('/api/login', $(this).serialize(), function (res) {
          // status 为 0 表示登录成功；否则表示登录失败！
          if (res.status === 0) {
            location.href = './index.html'
          } else {
            alert('登录失败！')
          }
        })
      })
    })
  <  /script>
<  /body>

<  /html>
```



#### JWT

Session的认证的局限性

session认证机制**需要配合Cookie才能实现**，由于Cookie默认不支持跨域访问，所以，当**涉及到跨域请求后端接口的时候**，**需要做很多额外的配置**，才能实现跨域Session认证

**注意**：当前端请求后端接口不存在跨域请求的时候，推荐使用session认证机制，反之则推荐使用JWT认证机制

##### 概念

JWT时目前**最流行**的**跨域认证解决方案**

JWT通常由三部分组成，分别是Header（头部），Payload（有效荷载），Signature（签名），三者之间使用英文 ‘.‘分隔

`Header.Payload.Signature`

**Payload**部分才是**真正的用户信息**，它是用户信息经过加密之后生成的字符串

**header**和**Signature**是**安全性相关**的信息，只是为了保证Token的安全性

##### 认证机制

客户端收到服务器返回的JWT之后，通常会将它存储到**localStorage**或者**sessionStorage**中

此后，客户端每次与服务器通信，都会带上这个JWT字符串，从而进行身份认证，推荐的做法是**把JWT放在HTTP请求头的Authorization字段中**

##### 安装

`npm install jsonwebtoken express-jwt`

**jsonwebtoken**用于生成JWT字符串

**express-jwt**用于将JWT字符串解析还原成JSON对象

##### 导入

使用require函数分别导入JWT相关的包

```javascript
const jwt = require('jsonwebtoken') // 用于生成JWT的字符串的包
const expressJWT = require('express-jwt') //用于解析客户端发送来的JWT字符串，还原成JSON对象
```

##### 密钥

定义secret密钥

为了**保证JWT字符串的安全性**，防止JWT字符串在网络传输过程中被别人破解，我们需要专门定义一个用于**加密**和**解密**的secret的密钥

当生成JWT字符串的时候，需要使用secret密钥对用户的信息**进行加密**，最终得到加密好的JWT字符串
当把JWT字符串解析还原成JSON对象的时候，需要使用secret密钥**进行解密**

```javascript
const secretKey = 'qwertyuiop'
// 密钥的本质就是一个字符串,越复杂越好	
```

##### 生成

生成JWT字符串，在用户登录成功后，进行生成JWT字符串

调用**jsonwebtoken**包提供的**sign()**方法，将用户的信息加密成JWT字符串，响应给客户端

```javascript
res.send({
    status:200,
    message:'logn success',
    // 调用jwt.sign()生成JWT字符串，三个参数分别是，用户的信息对象，加密密钥，配置对象
    token: jwt.sjgn({username:userinfo.username},secretKey,{expiresIn:'30s'})
    // expiresIn属性表示token字符串的有效期 
})
```

##### 还原

将JWT字符串还原成JSON对象

客户端每次在访问那些有权限的接口的时候，都需要主动通过请求头的**Authorization**字段，将token字符串发送到服务器进行身份验证

此时，通过**express-jwt**中间件，自动将token解析成**JSON**

```javascript
// expressJWT({secret: secretKey })就是用来解析TOKEN的中间件
// .unless({path:[/^\/api\//]}) 用来指定哪些接口不需要访问权限
app.use(expressJWT({secret: secretKey}).unless({path:[/^\/api\//]}))
// 使用正则表达式匹配不需要访问权限的接口
```

**注意**：只要配置了成功了express-jwt这个中间件，就可以把解析出来的用户信息挂载到**req.uers**属性上 

```javascript
console.log(req.user)
```

```JavaScript
//http://127.0.0.1:8888/api/login
// username:admin
// password:000000
{
    "status": 200,
    "message": "登录成功！",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzMzODI2NDM1LCJleHAiOjE3MzM4MjY0OTV9.3tWej8V6Oq7gqBwQaHaP2qgJphlMKAFTmBrOiCVAc3Y"
}

//http://127.0.0.1:8888/admin/getinfo
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzMzODI2NDM1LCJleHAiOjE3MzM4MjY0OTV9.3tWej8V6Oq7gqBwQaHaP2qgJphlMKAFTmBrOiCVAc3Y

{
    "status": 200,
    "message": "获取用户信息成功！",
    "data": {
        "username": "admin"
    }
}
```

注意：请求头的值记得加Bearer

**遵循HTTP标准**：根据W3C的HTTP 1.0规范，Authorization头的值格式是

`<  type> <  credentials>`，其中`<  type>`是授权类型，`<  credentials>`是具体的凭证信息。在JWT认证中，“Bearer”是一种常见的授权类型，用于指示后续的字符串是一个**令牌**（token），而不是用户名和密码等其他类型的凭证

##### 捕获失败

解析JWT失败后产生的错误

当使用express-jwt解析Token字符串时，如果客户端发送的Token是过**期或者不合法**，会产生一个**解析失败的错误**，影响项目的正常运行，我们可以通过**Express的错误中间件**，捕获这个错误并进行处理

```javascript

// TODO_06：使用全局错误处理中间件，捕获解析 JWT 失败后产生的错误
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.send({ status: 401, message: '无效的token' })
  }
  // 其他错误
  res.send({ status: 500, message: '未知错误' })
})
```

##### 代码

```javascript
// 完整代码
// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// TODO_01：安装并导入 JWT 相关的两个包，分别是 jsonwebtoken 和 express-jwt
const jwt = require('jsonwebtoken')
const expressJwt = require("express-jwt");

// 允许跨域资源共享
const cors = require('cors')
app.use(cors())

// 解析 post 表单数据的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// TODO_02：定义 secret 密钥，建议将密钥命名为 secretKey
const secretKey = 'qwertyuiop!@#$%^&*('
// TODO_04：注册将 JWT 字符串解析还原成 JSON 对象的中间件
app.use(
  expressJwt.expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api\//],
  })
);
// 登录接口
app.post('/api/login', function (req, res) {
  // 将 req.body 请求体中的数据，转存为 userinfo 常量
  const userinfo = req.body
  // 登录失败
  if (userinfo.username !== 'admin' || userinfo.password !== '000000') {
    return res.send({
      status: 400,
      message: '登录失败！'
    })
  }
  // 登录成功
  // TODO_03：在登录成功之后，调用 jwt.sign() 方法生成 JWT 字符串。并通过 token 属性发送给客户端
  const tokenStr = jwt.sign({ username: userinfo.username }, secretKey, { expiresIn: '60s' })
  res.send({
    status: 200,
    message: '登录成功！',
    token: tokenStr // 要发送给客户端的 token 字符串
  })
})

// 这是一个有权限的 API 接口
app.get('/admin/getinfo', function (req, res) {
  // TODO_05：使用 req.user 获取用户信息，并使用 data 属性将用户信息发送给客户端
  let name = req.auth.username
  res.send({
    status: 200,
    message: '获取用户信息成功！',
    data: {
      username: name
    } // 要发送给客户端的用户信息
  })
})

// TODO_06：使用全局错误处理中间件，捕获解析 JWT 失败后产生的错误
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.send({ status: 401, message: '无效的token' })
  }
  // 其他错误
  res.send({ status: 500, message: '未知错误' })
})
// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8888, function () {
  console.log('Express server running at http://127.0.0.1:8888')
})

```