---
title: Vue路由相关知识
date: 2025-04-25
category: other
tags: 
    - Vue
    - Vue Router
description: 从简单路由到嵌套路由再到路由守卫
draft: false
outline: [2,3]
# sticky: true
done: true
gridPaper: false
---

# 路由

## 路由链接高亮显示

### 内置样式名

在路由导航中，选中的链接中有`router-link-active`和`router-link-exact-active`，**vue-router**模块的内置样式

## 激活属性类名
```vue
<router-link to="/home" active-class="active">Home</router-link>
```

可以使用`liveActiceClass`全局配置配置路由链接高亮显示的类名

```js {9}
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            component: Home
        }
    ],
    liveActiceClass: 'active'
})
```

###### 更新中...