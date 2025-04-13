# 更新历史
## 2025-04-07 美化URL地址
生成html页面的时候不带有后缀，添加Vitepress配置`cleanUrls: true`，用于生成干净的URL，不带有 .html 后缀。

## 2025-04-11 增强标签选中交互

## 2025-04-12 添加置顶功能 + 全局图片错误处理

## 2025-04-12 自定义404页面

## 2025-04-13 添加自动生成新文章脚本  

## ~~2025-04-13 添加重写路由~~
```js
  rewrites: {
        'posts/:article': '/:article',
        'pages/:page': '/:page'
    }
```
访问的URL将自动重写为：
```
/posts/my-post -> /my-post
/pages/about -> /about
```
更简洁的URL

只是在页面内的URL美化，但是复制链接在页面外访问时，没有具体路径还是无法找到页面