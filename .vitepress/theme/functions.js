// 导入模块
import mediumZoom from 'medium-zoom';

// 初始化标签
export function initTags(posts) {
    const data = {}
    posts.forEach((post) => {
        post.frontMatter.tags?.forEach((tag) => {
            data[tag] = data[tag] || []
            data[tag].push(post)
        })
    })
    // 按标签数量降序排序
    return Object.fromEntries(Object.entries(data).sort(([, posts1], [, posts2]) => posts2.length - posts1.length))
}

// 初始化分类
export function initCategory(posts) {
    const data = {}
    for (let index = 0; index < posts.length; index++) {
        const element = posts[index]
        const category = element.frontMatter.category
        if (category) {
            if (data[category]) {
                data[category].push(element)
            } else {
                data[category] = []
                data[category].push(element)
            }
        }
    }
    return data
}

// 年份排序
export function useYearSort(post) {
    const data = []
    let year = '0'
    let num = -1
    for (let index = 0; index < post.length; index++) {
        const element = post[index]
        if (element.frontMatter.date) {
            const y = element.frontMatter.date.split('-')[0]
            if (y === year) {
                data[num].push(element)
            } else {
                num++
                data[num] = []
                data[num].push(element)
                year = y
            }
        }
    }
    return data
}

// 图片处理相关功能
// ---------------------------------------------

/**
 * 获取对应主题的错误图片路径
 * @param {boolean} isDark - 是否为深色模式
 * @returns {string} - 错误图片路径
 */
export function getErrorImage(isDark) {
    return isDark ? '/images/loading-error-dark.png' : '/images/loading-error-light.png';
}

/**
 * 初始化图片错误处理
 * @param {boolean} isDark - 是否为深色模式
 */
export function initImages(isDark) {
    // 为所有图片添加错误处理
    document.querySelectorAll('img').forEach(img => {
        if (!img.onerror) {
            img.onerror = (event) => {
                event.target.setAttribute('loading-error', '');
                event.target.src = getErrorImage(isDark);
            };
        }
    });
}

/**
 * 初始化图片缩放功能
 * @param {Object} frontmatter - 页面的frontmatter数据
 */
export function initZoom(frontmatter) {
    // 判断是否禁用了缩放功能
    if (frontmatter.zoomable !== false) {
        // 使用medium-zoom库为图片添加缩放功能
        mediumZoom('.main img:not([no-zoomable])', { background: 'rgba(0,0,0,0.2)' });
    }
}

/**
 * 更新错误图片的源
 * @param {boolean} isDark - 是否为深色模式
 */
export function updateErrorImages(isDark) {
    const errorSrc = getErrorImage(isDark);
    document.querySelectorAll('img').forEach(img => {
        if (img.src.includes('loading-error')) {
            img.src = errorSrc;
        }
    });
}

// 格子纸背景相关功能
// ---------------------------------------------

/**
 * 设置格子纸背景效果
 * @param {Object} frontmatter - 页面的frontmatter数据
 * @param {boolean} isDark - 是否为深色模式
 */
export function setupGridPaperBg(frontmatter, isDark) {
    const mainElement = document.querySelector('.VPContent');
    if (!mainElement) return;
    
    // 检查frontmatter中是否启用格子纸背景
    const gridPaperEnabled = frontmatter.gridPaper === true;
    
    if (gridPaperEnabled) {
        mainElement.classList.add('grid-paper-bg');
        // 设置大纲竖线变量
        document.documentElement.style.setProperty('--content-border-left', 'transparent');
        document.documentElement.style.setProperty('--outline-marker-width', '5px');
        
        // 优化代码块在格子纸背景下的样式
        setupCodeBlockStyleForGridPaper(isDark);
    } else {
        mainElement.classList.remove('grid-paper-bg');
        document.documentElement.style.setProperty('--content-border-left', 'var(--vp-c-divider)');
        document.documentElement.style.setProperty('--outline-marker-width', '2px');
        
        // 恢复默认代码块样式
        resetCodeBlockStyle();
    }
}

/**
 * 为格子纸背景设置代码块样式
 * @param {boolean} isDark - 是否为深色模式
 */
export function setupCodeBlockStyleForGridPaper(isDark) {
    if (isDark) {
        document.documentElement.style.setProperty('--vp-code-block-bg', 'rgba(30, 30, 32, 0.8)');
        document.documentElement.style.setProperty('--vp-c-bg-alt', 'rgba(30, 30, 32, 0.8)');
    } else {
        document.documentElement.style.setProperty('--vp-code-block-bg', 'rgba(245, 245, 245, 0.8)');
        document.documentElement.style.setProperty('--vp-c-bg-alt', 'rgba(245, 245, 245, 0.8)');
    }
    
    // 为代码块添加纸质感和阴影
    const codeBlocks = document.querySelectorAll('div[class*="language-"]');
    codeBlocks.forEach(block => {
        block.style.borderRadius = '6px';
        block.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
        block.style.border = '1px solid rgba(0, 0, 0, 0.1)';
        block.classList.add('grid-paper-code-block');
    });
}

/**
 * 重置代码块样式为默认值
 */
export function resetCodeBlockStyle() {
    document.documentElement.style.removeProperty('--vp-code-block-bg');
    document.documentElement.style.removeProperty('--vp-c-bg-alt');
    
    // 移除代码块特殊样式
    const codeBlocks = document.querySelectorAll('div[class*="language-"]');
    codeBlocks.forEach(block => {
        block.style.borderRadius = '';
        block.style.boxShadow = '';
        block.style.border = '';
        block.classList.remove('grid-paper-code-block');
    });
} 