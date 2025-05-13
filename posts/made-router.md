---
title: 手搓轻量级路由
date: 2025-05-05
category: other
tags: 
    - 路由
    - JavaScript
    - 手搓
description: 手搓一个用在纯原生代码上的路由，实现SPA(单页面应用)，动态加载页面，路由模式，动态路由，404页面等，各个页面使用html即可，参考了Vue Router的标签
draft: false
outline: [2,3]
sticky: false
done: false
gridPaper: false
handwriting: false
cbf: true
zoomable: true
publish: true
---

# 手搓轻量级路由

## 前言

使用[`Rollup`](https://cn.rollupjs.org/)打包后体积仅为4kb，在html中引入后即可使用，渲染位置使用`<router-view>`标签，使用`<router-link to="/">`标签进行跳转，和[`Vue Router`](https://router.vuejs.org/zh/)一样，当然也有编程式跳转(`push`、`replace`、`go`)。

## 介绍

### 自述

我曾经开发了一个轻量级JavaScript前端路由器，用于将传统的多页面应用（MPA）模式转换为单页面应用（SPA）模式，这个路由器支持`Hash`和`History`两种路由模式，实现了 push、replace、go 等核心 API，并内置了页面跳转的进度条逻辑，提升用户体验。

除此之外，我还设计了 `<router-link>` 和 `<router-view>` 两个自定义组件，实现了组件级导航和渲染。路由支持静态匹配，也支持 `/post/:id` 这样的动态路由解析，能够根据参数加载对应内容，比如渲染文章详情页。

在性能上，我做了页面懒加载、路由视图缓存、DOM 清理、事件解绑等优化，确保没有内存泄漏。最终我把它部署在 Netlify 上，并配套搭建了一个小型博客作为实际使用场景。

这个项目帮助我深入理解了 Vue Router 的设计原理，也提升了我对 Web 应用架构的掌控力。

### **关于什么是MPA和SPA**？

**MPA（Multi-Page Application，多页应用）**

每次页面跳转都向服务器发起请求，加载一个新的 HTML 页面，浏览器会完全刷新。

**例子：** 传统的新闻网站、早期的淘宝、京东等。

**SPA（Single Page Application，单页应用）**

整个网站只有一个 HTML 文件。用户与页面的交互是通过 JavaScript 动态切换内容完成的，而不是重新加载整个页面。

**例子：** 微信网页版、后台管理系统、Vue/React 项目等。

|    项目    |             MPA             |                     SPA                     |
| :--------: | :-------------------------: | :-----------------------------------------: |
|  页面结构  |  多个 HTML 页面，互相独立   |        一个 HTML 页面，内容动态切换         |
|  页面跳转  |    每次跳转刷新整个页面     |    页面跳转不刷新，基于前端路由切换内容     |
|  首屏速度  | 通常较快，HTML 首屏立即返回 | 首屏慢（需加载 JS、组件），但后续导航更流畅 |
|  SEO 支持  | 非常好，爬虫能抓取每个页面  |    天生不利，需要服务端渲染或预渲染优化     |
| 开发复杂度 | 低，页面独立，适合简单项目  |      高，涉及路由、状态管理、模块化等       |
|  用户体验  | 跳转卡顿、闪白（重新加载）  |      类似原生应用，过渡平滑，无刷新感       |

 **MPA 的缺点：**

- **页面跳转卡顿（白屏）**：每次跳转都重新加载整个 HTML。
- **重复资源加载**：每个页面都要重复加载 CSS、JS、图片等。
- **用户体验不连贯**：每次跳转都要等待响应。

**解决方案：**

- 通过缓存资源、优化服务端响应时间、使用 Pjax/Turbolinks 之类的技术来“假 SPA 化”。
- 用 Webpack 等工具打包公共资源减少重复加载。

**SPA 的缺点：**

- **首屏加载慢**：JS 文件大，影响加载速度。
- **SEO 差**：搜索引擎无法抓取动态内容。
- **浏览器前进/后退依赖前端路由处理**。

 **解决方案：**

- 首屏懒加载、按需加载、Skeleton 骨架屏、NProgress 进度条。
- 使用 SSR（服务端渲染，如 Nuxt、Next）或预渲染（如 VitePress、VuePress）。
- 配置好前端路由系统来响应浏览器行为。

>「我了解 MPA 和 SPA 各自的结构和特性。传统网站多采用 MPA 模式，用户跳转页面时浏览器会重新加载内容，虽然首屏加载快，但整体体验不佳。而 SPA 模式通过前端路由进行内容切换，体验更流畅。我自己开发的前端路由器就能将原本静态的多页面结构转化为 SPA 模式，并支持进度条、动态路由参数等，提升整体的交互感受和性能。」

### **什么是 SSR 和 CSR？**

**服务器端渲染（SSR, Server-Side Rendering）**

- 在服务端就把**完整的 HTML 页面生成好并返回**给浏览器。
- 浏览器接收到的是“成品”，能立刻展示内容，JS 负责后续交互。

**代表技术：**

- Vue + Nuxt.js
- React + Next.js
- 传统服务端语言模板（PHP、JSP、Python 等）

**客户端渲染（CSR, Client-Side Rendering）**

- 浏览器先加载一个空壳 HTML，然后再加载 JS 脚本，JS 再“拼出”页面结构。
- 页面展示必须等 JS 执行完。

**代表技术：**

- Vue、React、Angular 等现代前端框架的默认模式。

|    特性    |          SSR（服务器端渲染）          |          CSR（客户端渲染）          |
| :--------: | :-----------------------------------: | :---------------------------------: |
|  首屏速度  |         快，HTML 已经生成好了         |     慢，需要等待 JS 加载和执行      |
|  SEO 优化  |   好，搜索引擎能抓到完整 HTML 内容    |   差，爬虫可能抓不到渲染后的内容    |
|  用户体验  | 首屏直出快，后续交互需要 hydrate 补水 |    页面切换更流畅，但首屏加载慢     |
| 服务端压力 |       高，需要频繁生成页面内容        |          低，前端负责渲染           |
| 开发复杂度 |     高，需要服务端配合，配置复杂      |          低，单纯前端开发           |
|  适合场景  |  博客、电商首页、新闻、需 SEO 的页面  | 管理后台、社交工具、工具类 Web 应用 |

**常见用法**:

SSR 适用于 **内容导向型、SEO 要求高** 的站点（比如博客、商品列表页）。

CSR 适用于 **交互性强、登录用户可见** 的站点（比如后台管理系统、聊天工具等）。

**现代主流方案**：使用 SSR + CSR 混合渲染，即首屏 SSR，后续页面 CSR（如 Nuxt、Next）。

>“我了解 SSR 和 CSR 各自的优缺点。SSR 的优势在于首屏速度和 SEO，适合内容展示类项目，而 CSR 则更适合前后端分离、交互频繁的应用。比如我开发博客时，考虑到搜索引擎抓取问题，我预渲染了部分静态页面来弥补 CSR 的 SEO 缺陷；如果项目升级为 Nuxt 这种 SSR 框架，可以在提升 SEO 的同时保持 Vue 的开发体验。”

## 实现

### v1.0.0

```js
// 路由模式枚举
const RouterMode = {
    HASH: 'hash',
    HISTORY: 'history'
};

// 是否启用调试日志
const DEBUG = true;
const log = (...args) => DEBUG && console.log('[Router]', ...args);

class Router {
    constructor(options) {
        this.routes = options.routes || [];
        this.mode = options.mode || RouterMode.HASH;
        this.base = options.base || '/';
        this.currentPath = '';
        this.params = {};
        this._view = null;
        this._refreshHandler = this.refresh.bind(this);

        this.init();
        this.initProgressBar();
    }

    init() {
        this.refresh(); // 初次刷新

        const type = this.mode === RouterMode.HASH ? 'hashchange' : 'popstate';
        window.addEventListener(type, this._refreshHandler);

        this.initCustomElements();
    }
    
    // 销毁路由
    destroy() {
        const type = this.mode === RouterMode.HASH ? 'hashchange' : 'popstate';
        window.removeEventListener(type, this._refreshHandler);
    }

    initCustomElements() {
        if (!customElements.get('router-link')) {
            customElements.define('router-link', class extends HTMLElement {
                constructor() {
                    super();
                    this._onClick = null;
                }

                connectedCallback() {
                    const to = this.getAttribute('to');
                    const router = document.querySelector('router-view')?._router;

                    const link = document.createElement('a');
                    link.href = (router?.mode === RouterMode.HISTORY) ? to : '#' + to;

                    this._onClick = (e) => {
                        e.preventDefault();
                        router?.push(to);
                    };
                    link.addEventListener('click', this._onClick);

                    link.innerHTML = this.innerHTML;
                    this.innerHTML = '';
                    this.appendChild(link);
                }

                disconnectedCallback() {
                    const link = this.querySelector('a');
                    if (link && this._onClick) {
                        log('清理 router-link 事件监听器');
                        link.removeEventListener('click', this._onClick);
                    }
                    this._onClick = null;
                }
            });
        }

        if (!customElements.get('router-view')) {
            customElements.define('router-view', class extends HTMLElement {
                constructor() {
                    super();
                    this._router = null;
                    this._currentComponent = null;
                }

                connectedCallback() {
                    this._router = window.__appRouter__ || null;
                    if (this._router) {
                        this._router._view = this;
                        this.render();
                    }
                }

                disconnectedCallback() {
                    this.clear();
                }

                render() {
                    if (!this._router) return;

                    const route = this._router.getMatchedRoute();
                    if (!route || !route.component) return;

                    this.clear();

                    const component = route.component;
                    this._currentComponent = typeof component === 'function'
                        ? component()
                        : component;

                    if (typeof this._currentComponent === 'string') {
                        this.innerHTML = this._currentComponent;
                    } else if (this._currentComponent instanceof HTMLElement) {
                        this.appendChild(this._currentComponent);
                    }
                }

                clear() {
                    this.innerHTML = '';
                    this._currentComponent = null;
                }
            });
        }
    }

    initProgressBar() {
        if (!document.getElementById('router-progress')) {
            const bar = document.createElement('div');
            bar.id = 'router-progress';
            bar.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0;
                height: 2px;
                background: linear-gradient(90deg, #4a90e2, #42b983);
                width: 0;
                z-index: 9999;
                transition: width 0.3s;
            `;
            document.body.appendChild(bar);
        }
    }

    showProgressBar() {
        const bar = document.getElementById('router-progress');
        if (bar) {
            bar.style.width = '80%';
            bar.style.opacity = '1';
        }
    }

    hideProgressBar() {
        const bar = document.getElementById('router-progress');
        if (bar) {
            bar.style.width = '100%';
            setTimeout(() => {
                bar.style.opacity = '0';
                bar.style.width = '0';
            }, 300);
        }
    }

    normalizePath(path) {
        path = path.replace(/^\.\//, '');
        return path.startsWith('/') ? path : '/' + path;
    }

    async loadHTML(url) {
        const normalizedUrl = this.normalizePath(url);
        this.showProgressBar();

        try {
            const response = await fetch(normalizedUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body.innerHTML;
        } catch (error) {
            console.error('[Router] 加载页面失败:', error);
            return await this.loadHTML('./view/404.html');
        } finally {
            this.hideProgressBar();
        }
    }

    getPath() {
        return this.mode === RouterMode.HASH
            ? window.location.hash.slice(1) || '/'
            : window.location.pathname || '/';
    }

    parseParams(routePath, currentPath) {
        const routeParts = routePath.split('/');
        const currentParts = currentPath.split('/');
        const params = {};

        if (routeParts.length !== currentParts.length) return null;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                const key = routeParts[i].slice(1);
                params[key] = currentParts[i];
            } else if (routeParts[i] !== currentParts[i]) {
                return null;
            }
        }

        return params;
    }

    matchRoute(routePath, currentPath) {
        const params = this.parseParams(routePath, currentPath);
        if (params !== null) {
            this.params = params;
            return true;
        }
        return routePath === currentPath;
    }

    getMatchedRoute() {
        const path = this.getPath();
        return this.routes.find(route => this.matchRoute(route.path, path));
    }

    async refresh() {
        this.currentPath = this.getPath();
        const routerView = document.querySelector('router-view');
        if (!routerView) {
            console.warn('[Router] 未找到 <router-view> 元素');
            return;
        }

        routerView._router = this;

        const matchedRoute = this.getMatchedRoute();
        if (matchedRoute) {
            try {
                const componentPath = typeof matchedRoute.component === 'function'
                    ? matchedRoute.component(this.params)
                    : matchedRoute.component;

                const content = await this.loadHTML(componentPath);
                routerView.replaceChildren(
                    document.createRange().createContextualFragment(content)
                );
            } catch (err) {
                console.error('[Router] 页面加载失败:', err);
                routerView.innerHTML = 'Error loading page content';
            }
        } else {
            routerView.replaceChildren(
                document.createRange().createContextualFragment(await this.loadHTML('./view/404.html'))
            );
        }
    }

    async navigate(path, method = 'push') {
        if (typeof path !== 'string' || !path.trim()) {
            console.warn('[Router.navigate] 无效路径:', path);
            return;
        }

        if (this.mode === RouterMode.HASH) {
            const hashPath = path.startsWith('#') ? path : '#' + path;
            if (method === 'replace') {
                const href = window.location.href;
                const i = href.indexOf('#');
                window.location.replace(href.slice(0, i >= 0 ? i : href.length) + hashPath);
            } else {
                window.location.hash = path;
            }
        } else {
            if (method === 'replace') {
                history.replaceState(null, '', path);
            } else {
                history.pushState(null, '', path);
            }
            await this.refresh();
        }
    }

    async push(path) {
        await this.navigate(path, 'push');
    }

    async replace(path) {
        await this.navigate(path, 'replace');
    }

    go(n) {
        history.go(n);
    }

    getParams() {
        return this.params;
    }
}

// 路由配置和初始化
const router = new Router({
    mode: RouterMode.HASH,
    base: '/',
    routes: [
        { path: '/', component: './view/home.html' },
        { path: '/tag', component: './view/tag.html' },
        { path: '/post', component: './view/post.html' },
        { path: '/about', component: './view/about.html' },
        {
            path: '/post/:id',
            component: (params) => {
                log('动态路由参数:', params);
                return `./post/${params.id}.html`;
            }
        }
    ]
});

window.__appRouter__ = router;
export default router;


```

### v1.0.1

```js
// 路由模式枚举
const RouterMode = {
    HASH: 'hash',
    HISTORY: 'history'
};

// 是否启用调试日志
const DEBUG = true;
const log = (...args) => DEBUG && console.log('[Router]', ...args);

class Router {
    constructor(options) {
        this.routes = options.routes || [];
        this.mode = options.mode || RouterMode.HASH;
        this.base = options.base || '/';
        this.currentPath = '';
        this.params = {};
        this._view = null;
        this._refreshHandler = this.refresh.bind(this);

        this.init();
        this.initProgressBar();
    }

    init() {
        this.refresh(); // 初次刷新

        const type = this.mode === RouterMode.HASH ? 'hashchange' : 'popstate';
        window.addEventListener(type, this._refreshHandler);

        this.initCustomElements();
    }
    
    // 销毁路由
    destroy() {
        const type = this.mode === RouterMode.HASH ? 'hashchange' : 'popstate';
        window.removeEventListener(type, this._refreshHandler);
    }

    initCustomElements() {
        if (!customElements.get('router-link')) {
            customElements.define('router-link', class extends HTMLElement {
                constructor() {
                    super();
                    this._onClick = null;
                }

                connectedCallback() {
                    const to = this.getAttribute('to');
                    const router = document.querySelector('router-view')?._router;

                    const link = document.createElement('a');
                    link.href = (router?.mode === RouterMode.HISTORY) ? to : '#' + to;

                    this._onClick = (e) => {
                        e.preventDefault();
                        router?.push(to);
                    };
                    link.addEventListener('click', this._onClick);

                    link.innerHTML = this.innerHTML;
                    this.innerHTML = '';
                    this.appendChild(link);
                }

                disconnectedCallback() {
                    const link = this.querySelector('a');
                    if (link && this._onClick) {
                        log('清理 router-link 事件监听器');
                        link.removeEventListener('click', this._onClick);
                    }
                    this._onClick = null;
                }
            });
        }

        if (!customElements.get('router-view')) {
            customElements.define('router-view', class extends HTMLElement {
                constructor() {
                    super();
                    this._router = null;
                    this._currentComponent = null;
                }

                connectedCallback() {
                    this._router = window.__appRouter__ || null;
                    if (this._router) {
                        this._router._view = this;
                        this.render();
                    }
                }

                disconnectedCallback() {
                    this.clear();
                }

                render() {
                    if (!this._router) return;

                    const route = this._router.getMatchedRoute();
                    if (!route || !route.component) return;

                    this.clear();

                    const component = route.component;
                    this._currentComponent = typeof component === 'function'
                        ? component()
                        : component;

                    if (typeof this._currentComponent === 'string') {
                        this.innerHTML = this._currentComponent;
                    } else if (this._currentComponent instanceof HTMLElement) {
                        this.appendChild(this._currentComponent);
                    }
                }

                clear() {
                    this.innerHTML = '';
                    this._currentComponent = null;
                }
            });
        }
    }

    initProgressBar() {
        if (!document.getElementById('router-progress')) {
            const bar = document.createElement('div');
            bar.id = 'router-progress';
            bar.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0;
                height: 2px;
                background: linear-gradient(90deg, #4a90e2, #42b983);
                width: 0;
                z-index: 9999;
                transition: width 0.3s;
            `;
            document.body.appendChild(bar);
        }
    }

    showProgressBar() {
        const bar = document.getElementById('router-progress');
        if (bar) {
            bar.style.width = '80%';
            bar.style.opacity = '1';
        }
    }

    hideProgressBar() {
        const bar = document.getElementById('router-progress');
        if (bar) {
            bar.style.width = '100%';
            setTimeout(() => {
                bar.style.opacity = '0';
                bar.style.width = '0';
            }, 300);
        }
    }

    normalizePath(path) {
        path = path.replace(/^\.\//, '');
        return path.startsWith('/') ? path : '/' + path;
    }

    async loadHTML(url) {
        const normalizedUrl = this.normalizePath(url);
        this.showProgressBar();

        try {
            const response = await fetch(normalizedUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body.innerHTML;
        } catch (error) {
            console.error('[Router] 加载页面失败:', error);
            return await this.loadHTML('./view/404.html');
        } finally {
            this.hideProgressBar();
        }
    }

    getPath() {
        return this.mode === RouterMode.HASH
            ? window.location.hash.slice(1) || '/'
            : window.location.pathname || '/';
    }

    parseParams(routePath, currentPath) {
        const routeParts = routePath.split('/');
        const currentParts = currentPath.split('/');
        const params = {};

        if (routeParts.length !== currentParts.length) return null;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                const key = routeParts[i].slice(1);
                params[key] = currentParts[i];
            } else if (routeParts[i] !== currentParts[i]) {
                return null;
            }
        }

        return params;
    }

    matchRoute(routePath, currentPath) {
        const params = this.parseParams(routePath, currentPath);
        if (params !== null) {
            this.params = params;
            return true;
        }
        return routePath === currentPath;
    }

    getMatchedRoute() {
        const path = this.getPath();
        return this.routes.find(route => this.matchRoute(route.path, path));
    }

    async refresh() {
        this.currentPath = this.getPath();
        const routerView = document.querySelector('router-view');
        if (!routerView) {
            console.warn('[Router] 未找到 <router-view> 元素');
            return;
        }

        routerView._router = this;

        const matchedRoute = this.getMatchedRoute();
        if (matchedRoute) {
            try {
                const componentPath = typeof matchedRoute.component === 'function'
                    ? matchedRoute.component(this.params)
                    : matchedRoute.component;

                const content = await this.loadHTML(componentPath);
                routerView.replaceChildren(
                    document.createRange().createContextualFragment(content)
                );

                // 更新页面标题，处理动态路由
                if (typeof matchedRoute.title === 'function') {
                    document.title = 'Yumeng | ' + matchedRoute.title(this.params);
                } else {
                    document.title = 'Yumeng | ' + (matchedRoute.title || 'Default Title');
                }
            } catch (err) {
                console.error('[Router] 页面加载失败:', err);
                routerView.innerHTML = 'Error loading page content';
            }
        } else {
            routerView.replaceChildren(
                document.createRange().createContextualFragment(await this.loadHTML('./view/404.html'))
            );
            document.title = '404 Not Found';
        }
    }

    async navigate(path, method = 'push') {
        if (typeof path !== 'string' || !path.trim()) {
            console.warn('[Router.navigate] 无效路径:', path);
            return;
        }

        if (this.mode === RouterMode.HASH) {
            const hashPath = path.startsWith('#') ? path : '#' + path;
            if (method === 'replace') {
                const href = window.location.href;
                const i = href.indexOf('#');
                window.location.replace(href.slice(0, i >= 0 ? i : href.length) + hashPath);
            } else {
                window.location.hash = path;
            }
        } else {
            if (method === 'replace') {
                history.replaceState(null, '', path);
            } else {
                history.pushState(null, '', path);
            }
            await this.refresh();
        }
    }

    async push(path) {
        await this.navigate(path, 'push');
    }

    async replace(path) {
        await this.navigate(path, 'replace');
    }

    go(n) {
        history.go(n);
    }

    getParams() {
        return this.params;
    }
}

// 路由配置和初始化
const router = new Router({
    mode: RouterMode.HASH,
    base: '/',
    routes: [
        { path: '/', component: './view/home.html', title: 'Blog' },
        { path: '/tag', component: './view/tag.html', title: 'Tag' },
        { path: '/post', component: './view/post.html', title: 'Post' },
        { path: '/about', component: './view/about.html', title: 'About' },
        {
            path: '/post/:id',
            component: (params) => {
                log('动态路由参数:', params);
                return `./post/${params.id}.html`;
            },
            title: (params) => {
                return `Post ${params.id}`;
            }
        }
    ]
});

window.__appRouter__ = router;
export default router;
```

