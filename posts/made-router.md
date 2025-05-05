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
cbf: false
zoomable: true
publish: true
---

# 手搓轻量级路由

## 前言

使用[`Rollup`](https://cn.rollupjs.org/)打包后体积仅为4kb，在html中引入后即可使用，渲染位置使用`<router-view>`标签，使用`<router-link to="/">`标签进行跳转，和[`Vue Router`](https://router.vuejs.org/zh/)一样，当然也有编程式跳转(`push`、`replace`、`go`)。

## 实现

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