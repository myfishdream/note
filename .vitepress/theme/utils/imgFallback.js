// 定义图片备用CDN源
const cdnSources = [
    // GitHub Pages
    {
        pattern: /https:\/\/([^.]+)\.github\.io\/([^/]+)\/(.+)/,
        generate: (owner, repo, path) => `https://${owner}.github.io/${repo}/${path}`
    },
    // GitHub Raw
    {
        pattern: /https:\/\/github\.com\/([^/]+)\/([^/]+)\/raw\/([^/]+)\/(.+)/,
        generate: (owner, repo, branch, path) => `https://github.com/${owner}/${repo}/raw/${branch}/${path}`
    },
    // jsDelivr
    {
        pattern: /https:\/\/cdn\.jsdelivr\.net\/gh\/([^/]+)\/([^@]+)@([^/]+)\/(.+)/,
        generate: (owner, repo, branch, path) => `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`
    },
    // Statically
    {
        pattern: /https:\/\/cdn\.statically\.io\/gh\/([^/]+)\/([^@]+)@([^/]+)\/(.+)/,
        generate: (owner, repo, branch, path) => `https://cdn.statically.io/gh/${owner}/${repo}@${branch}/${path}`
    },
    // ChinaJsDelivr
    {
        pattern: /https:\/\/jsd\.cdn\.zzko\.cn\/gh\/([^/]+)\/([^@]+)@([^/]+)\/(.+)/,
        generate: (owner, repo, branch, path) => `https://jsd.cdn.zzko.cn/gh/${owner}/${repo}@${branch}/${path}`
    }
];

// 图片加载超时设置（毫秒）- 作为最大超时使用
const MAX_TIMEOUT = 5000;

// 是否开启调试
const debug = true;

// 存储组件实例标识，避免重复初始化
let isInitialized = false;

// 初始化图片自动切换功能
export function setupImgFallback(frontmatterData) {
    if (typeof window === 'undefined') return;
    
    // 清理之前的初始化状态
    if (isInitialized) {
        clearImgFallbackState();
    }
    
    // 优先使用传入的frontmatter，其次尝试从window中获取
    const pageData = frontmatterData || window?.__VitePress__?.page?.frontmatter;
    // console.log('imgFallback State:', pageData.imgFallback || '默认开启');
    // 检查当前页面是否开启自动切换功能
    const checkPageConfig = () => {
        // 明确设置为 false 才禁用，默认开启
        if (pageData && pageData.imgFallback === false) {
            if (debug) console.log('当前页面禁用了图片CDN自动切换功能', pageData);
            return false;
        }
        return true;
    };

    // 如果页面配置禁用了该功能，则不执行
    if (!checkPageConfig()) {
        return;
    }

    // 标记为已初始化
    isInitialized = true;
    
    // 添加全局CSS样式
    function addGlobalStyles() {
        if (document.getElementById('img-fallback-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'img-fallback-styles';
        styleElement.textContent = `
            /* 图片容器样式 */
            .vp-img-with-title {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 16px 0;
            }
            
            /* 图片标题样式 */
            .vp-img-title {
                margin-top: 8px;
                font-size: 0.9em;
                color: var(--vp-c-text-2);
                text-align: center;
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    let debugPanel = null;
    
    // 网络状况评估
    const networkMonitor = {
        // 保存最近的加载时间记录
        loadTimes: [],
        // 添加加载时间记录
        addLoadTime(time) {
            this.loadTimes.push(time);
            // 只保留最近10条记录
            if (this.loadTimes.length > 10) {
                this.loadTimes.shift();
            }
        },
        // 获取动态超时时间
        getDynamicTimeout() {
            if (this.loadTimes.length === 0) return MAX_TIMEOUT;
            
            // 计算平均加载时间
            const avgTime = this.loadTimes.reduce((sum, time) => sum + time, 0) / this.loadTimes.length;
            // 动态超时 = 平均时间 * 2 + 1000ms缓冲，但不超过最大超时
            const dynamicTimeout = Math.min(Math.round(avgTime * 2 + 1000), MAX_TIMEOUT);
            
            return dynamicTimeout;
        }
    };
    
    // 创建调试面板
    function createDebugPanel() {
        if (document.querySelector('.img-debug-panel')) {
            return document.querySelector('.img-debug-panel');
        }
        
        const panel = document.createElement('div');
        panel.className = 'img-debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <span class="debug-title">图片CDN切换调试面板</span>
                <button class="debug-close">×</button>
            </div>
            <div class="debug-logs"></div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .img-debug-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 360px;
                max-height: 300px;
                background: var(--vp-c-bg);
                border: 1px solid var(--vp-c-divider);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                overflow: hidden;
                font-size: 12px;
                font-family: monospace;
            }
            
            .debug-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: var(--vp-c-brand);
                color: white;
            }
            
            .debug-title {
                font-weight: bold;
                font-size: 14px;
            }
            
            .debug-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0 4px;
            }
            
            .debug-logs {
                max-height: 260px;
                overflow-y: auto;
                padding: 8px;
            }
            
            .debug-log {
                margin-bottom: 6px;
                padding: 6px;
                border-radius: 4px;
                word-break: break-all;
            }
            
            .debug-log.success {
                background: rgba(0, 200, 0, 0.1);
            }
            
            .debug-log.error {
                background: rgba(255, 0, 0, 0.1);
            }
            
            .debug-log.trying {
                background: rgba(255, 150, 0, 0.1);
            }
            
            .debug-log.info {
                background: rgba(0, 150, 255, 0.1);
            }
            
            .debug-url {
                color: var(--vp-c-brand);
                text-decoration: underline;
                cursor: pointer;
            }
            
            .debug-time {
                color: var(--vp-c-text-2);
                font-size: 10px;
                margin-left: 4px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(panel);
        
        // 添加关闭按钮事件
        panel.querySelector('.debug-close').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        return panel;
    }
    
    // 添加日志到调试面板
    function addDebugLog(type, message, url = '') {
        if (!debug) return;
        
        if (!debugPanel) {
            debugPanel = createDebugPanel();
        }
        
        const logs = debugPanel.querySelector('.debug-logs');
        const time = new Date().toLocaleTimeString();
        
        const log = document.createElement('div');
        log.className = `debug-log ${type}`;
        
        if (url) {
            log.innerHTML = `
                ${message} 
                <span class="debug-url" onclick="navigator.clipboard.writeText('${url}')">${url.length > 50 ? url.substring(0, 50) + '...' : url}</span>
                <span class="debug-time">${time}</span>
            `;
        } else {
            log.innerHTML = `
                ${message}
                <span class="debug-time">${time}</span>
            `;
        }
        
        logs.appendChild(log);
        logs.scrollTop = logs.scrollHeight;
    }

    // 获取错误图片地址
    const getErrorImage = () => {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '/images/loading-error-dark.png' : '/images/loading-error-light.png';
    };

    // 清理图片自动切换状态
    function clearImgFallbackState() {
        // 移除调试面板
        const panel = document.querySelector('.img-debug-panel');
        if (panel) {
            panel.remove();
        }
        
        // 重置已初始化的标记
        document.querySelectorAll('img[data-fallback-initialized]').forEach(img => {
            img.removeAttribute('data-fallback-initialized');
            img.removeAttribute('data-original-src');
        });
        
        // 重置初始化标志
        isInitialized = false;
    }
    
    // 解析图片标题
    function parseImageTitle(img) {
        // 检查是否已有标题容器
        if (img.parentNode && img.parentNode.classList.contains('vp-img-with-title')) {
            return;
        }
        
        // 从data-title属性获取标题
        let title = img.getAttribute('data-title');
        
        // 从元素上的title属性获取
        if (!title) {
            title = img.getAttribute('title');
        }
        
        // 如果找到标题，则添加到图片下方
        if (title) {
            // 创建父容器
            const container = document.createElement('div');
            container.className = 'vp-img-with-title';
            
            // 插入容器到DOM
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);
            
            // 创建标题元素
            const titleElement = document.createElement('div');
            titleElement.className = 'vp-img-title';
            titleElement.textContent = title;
            container.appendChild(titleElement);
        }
    }

    // 解析URL参数
    function parseUrl(url) {
        for (const source of cdnSources) {
            const match = url.match(source.pattern);
            if (match) {
                // 去掉第一个元素（完整匹配）
                const params = match.slice(1);
                return {
                    source,
                    params
                };
            }
        }
        return null;
    }

    // 生成所有备用URL
    function generateFallbackUrls(originalUrl) {
        // 检查是否使用 | 手动分隔的多个URL
        if (originalUrl.includes('|')) {
            return originalUrl.split('|').map(url => url.trim());
        }

        // 解析URL
        const parsed = parseUrl(originalUrl);
        if (!parsed) return [originalUrl];

        // 生成所有备用URL
        return cdnSources.map(source => {
            try {
                return source.generate(...parsed.params);
            } catch (e) {
                console.error(`生成备用URL出错:`, e);
                return null;
            }
        }).filter(url => url !== null);
    }

    // 使用动态超时控制的图片加载
    function loadImageWithTimeout(img, url, fallbackUrls, currentIndex) {
        const startTime = Date.now();
        // 获取动态超时时间
        const dynamicTimeout = networkMonitor.getDynamicTimeout();
        
        if (debug && currentIndex === 0) {
            addDebugLog('info', `当前动态超时设置: ${dynamicTimeout}ms`);
        }
        
        // 设置加载超时计时器
        const timeoutTimer = setTimeout(() => {
            // 超时后，取消加载并尝试下一个URL
            addDebugLog('error', `图片加载超时(${dynamicTimeout}ms)，尝试下一个地址`);
            tryNextUrl(img, fallbackUrls, currentIndex);
        }, dynamicTimeout);

        // 设置图片地址前先绑定事件
        // 成功时清除计时器
        const originalOnload = img.onload;
        img.onload = function(event) {
            clearTimeout(timeoutTimer);
            
            // 记录加载时间
            const loadTime = Date.now() - startTime;
            networkMonitor.addLoadTime(loadTime);
            
            if (originalOnload) originalOnload.call(this, event);
            
            // 解析并处理图片标题
            parseImageTitle(img);
            
            if (!img.src.includes('loading-error')) {
                if (currentIndex === 0) {
                    addDebugLog('success', `图片加载成功 (${loadTime}ms):`, img.src);
                } else {
                    addDebugLog('success', `备用地址(${currentIndex + 1}/${fallbackUrls.length})加载成功 (${loadTime}ms):`, img.src);
                }
            }
        };
        
        // 错误时清除计时器并尝试下一个URL
        img.onerror = function() {
            clearTimeout(timeoutTimer);
            tryNextUrl(img, fallbackUrls, currentIndex);
        };
        
        // 开始加载图片
        img.src = url;
    }
    
    // 尝试下一个URL
    function tryNextUrl(img, fallbackUrls, currentIndex) {
        // 检查是否还有下一个URL
        if (currentIndex < fallbackUrls.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextUrl = fallbackUrls[nextIndex];
            
            addDebugLog('trying', `尝试备用地址(${nextIndex + 1}/${fallbackUrls.length}):`, nextUrl);
            
            // 使用超时控制加载下一个URL
            loadImageWithTimeout(img, nextUrl, fallbackUrls, nextIndex);
        } else {
            // 所有URL都失败，使用错误图片
            addDebugLog('error', '所有备用地址均加载失败，使用默认错误图片');
            img.src = getErrorImage();
            img.onerror = null; // 防止无限循环
        }
    }

    // 处理图片加载错误
    function handleImageError(event) {
        const img = event.target;
        
        // 获取原始URL
        const originalUrl = img.getAttribute('data-original-src') || img.src;
        
        // 生成备用URL列表
        const fallbackUrls = generateFallbackUrls(originalUrl);
        
        // 开始尝试加载第一个URL（如果当前就是第一个URL，则尝试第二个）
        const currentIndex = fallbackUrls.findIndex(url => url === img.src);
        if (currentIndex === 0) {
            tryNextUrl(img, fallbackUrls, 0);
        } else {
            // 如果找不到当前URL或是其他情况，从第一个开始尝试
            loadImageWithTimeout(img, fallbackUrls[0], fallbackUrls, 0);
        }
    }
    
    // 处理Markdown中的图片标题
    function processImageTitles() {
        const markdownImages = document.querySelectorAll('.vp-doc img');
        markdownImages.forEach(img => {
            // 查找Markdown格式中的{title: xxx}部分
            const parent = img.parentElement;
            if (parent && parent.nodeName === 'P') {
                const text = parent.innerHTML;
                const titleRegex = /{title:\s*([^}]+)}/i;
                const match = text.match(titleRegex);
                
                if (match) {
                    // 提取标题
                    const title = match[1].trim();
                    img.setAttribute('data-title', title);
                    
                    // 从文本中移除标题部分
                    parent.innerHTML = text.replace(titleRegex, '');
                    
                    // 直接应用标题
                    parseImageTitle(img);
                }
            }
        });
    }

    // 处理页面上的所有图片
    function processImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 跳过已处理和特殊图片
            if (img.hasAttribute('data-fallback-initialized') || 
                img.src.includes('data:image') || 
                img.src.includes('loading-error')) {
                return;
            }

            // 保存原始URL
            const originalUrl = img.src;
            img.setAttribute('data-original-src', originalUrl);
            img.setAttribute('data-fallback-initialized', 'true');
            
            // 生成备用URL列表
            const fallbackUrls = generateFallbackUrls(originalUrl);
            
            // 使用超时控制加载第一个URL
            loadImageWithTimeout(img, fallbackUrls[0], fallbackUrls, 0);
        });
    }

    // 监听DOM变化，处理新添加的图片
    function observeImages() {
        const observer = new MutationObserver((mutations) => {
            let hasNewImages = false;
            let hasNewContent = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    const images = mutation.target.querySelectorAll('img');
                    if (images.length > 0) {
                        hasNewImages = true;
                    }
                    
                    // 检查是否有新内容添加
                    if (mutation.addedNodes.length > 0) {
                        hasNewContent = true;
                    }
                }
            });
            
            if (hasNewImages) {
                processImages();
            }
            
            if (hasNewContent) {
                processImageTitles();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始调用
    setTimeout(() => {
        // 添加全局样式
        addGlobalStyles();
        
        if (debug) {
            debugPanel = createDebugPanel();
            addDebugLog('success', '初始化图片CDN自动切换功能成功');
            addDebugLog('success', `最大超时设置: ${MAX_TIMEOUT}ms (动态调整)`);
            
            // 在调试模式下显示前置元数据信息
            if (pageData) {
                addDebugLog('info', `页面配置: imgFallback=${pageData.imgFallback !== false ? 'true (默认)' : 'false'}`);
            }
        }
        
        // 处理页面图片
        processImages();
        
        // 处理图片标题
        processImageTitles();
        
        // 监听DOM变化
        observeImages();
    }, 0);
} 