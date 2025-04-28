import DefaultTheme from 'vitepress/theme'
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'

// 代码块折叠
// https://github.com/T-miracle/vitepress-plugin-codeblocks-fold/blob/main/README_zh.md
import codeblocksFold from 'vitepress-plugin-codeblocks-fold'; // 导入方法
import 'vitepress-plugin-codeblocks-fold/style/index.css'; // 导入样式

// 进度条
import vitepressNprogress from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'

// 时间轴
import "vitepress-markdown-timeline/dist/theme/index.css";

import './custom.css'

// 图片处理
import { useRoute, useData } from 'vitepress';
import { onMounted, watch, nextTick } from 'vue';
import mediumZoom from 'medium-zoom';
// import { setupImgFallback } from './utils/imgFallback';     // 图片自动切换源

export default {
    ...DefaultTheme,
    Layout: NewLayout,
    enhanceApp(ctx) {
        vitepressNprogress(ctx)
        ctx.app.component('Tags', Tags)
        ctx.app.component('Category', Category)
        ctx.app.component('Archives', Archives)
        ctx.app.component('Page', Page)
    },
    setup() {
        const route = useRoute();
        const { isDark, frontmatter } = useData();  // 使用 useData 获取主题状态和frontmatter
        codeblocksFold({ route, frontmatter }, true, 200);
        // 根据主题获取对应的错误图片
        const getErrorImage = () => {
            return isDark.value ? '/images/loading-error-dark.png' : '/images/loading-error-light.png';
        }

        // 初始化图片处理
        const initImages = () => {
            // 为所有图片添加错误处理
            document.querySelectorAll('img').forEach(img => {
                if (!img.onerror) {
                    img.onerror = (event) => {
                        event.target.setAttribute('loading-error', '');
                        event.target.src = getErrorImage();
                    };
                }
            });
        }

        const initZoom = () => {
            // 全局图片使用
            if (frontmatter.value.zoomable !== false) {
                mediumZoom('.main img:not([no-zoomable])', { background: 'rgba(0,0,0,0.2)' });
            }
        };

        // 更新错误图片
        const updateErrorImages = () => {
            const errorSrc = getErrorImage();
            document.querySelectorAll('img').forEach(img => {
                if (img.src.includes('loading-error')) {
                    img.src = errorSrc;
                }
            });
        }

        watch(isDark, () => {
            updateErrorImages();
            
            // 检查是否启用格子纸背景，如果启用则根据主题调整代码块样式
            const mainElement = document.querySelector('.VPContent');
            if (mainElement && mainElement.classList.contains('grid-paper-bg')) {
                if (isDark.value) {
                    document.documentElement.style.setProperty('--vp-code-block-bg', 'rgba(30, 30, 32, 0.8)');
                    document.documentElement.style.setProperty('--vp-c-bg-alt', 'rgba(30, 30, 32, 0.8)');
                } else {
                    document.documentElement.style.setProperty('--vp-code-block-bg', 'rgba(245, 245, 245, 0.8)');
                    document.documentElement.style.setProperty('--vp-c-bg-alt', 'rgba(245, 245, 245, 0.8)');
                }
            }
        });

        // 处理格子纸背景
        const setupGridPaperBg = () => {
            nextTick(() => {
                const mainElement = document.querySelector('.VPContent');
                if (!mainElement) return;
                
                // 检查frontmatter中是否启用格子纸背景
                const gridPaperEnabled = frontmatter.value.gridPaper === true;
                
                if (gridPaperEnabled) {
                    mainElement.classList.add('grid-paper-bg');
                    // 设置大纲竖线变量
                    document.documentElement.style.setProperty('--content-border-left', 'transparent');
                    document.documentElement.style.setProperty('--outline-marker-width', '5px');
                    
                    // 优化代码块在格子纸背景下的样式
                    document.documentElement.style.setProperty('--vp-code-block-bg', 'rgba(245, 245, 245, 0.8)');
                    document.documentElement.style.setProperty('--vp-c-bg-alt', 'rgba(245, 245, 245, 0.8)');
                    
                    // 为代码块添加纸质感和阴影
                    const codeBlocks = document.querySelectorAll('div[class*="language-"]');
                    codeBlocks.forEach(block => {
                        block.style.borderRadius = '6px';
                        block.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
                        block.style.border = '1px solid rgba(0, 0, 0, 0.1)';
                        block.classList.add('grid-paper-code-block');
                    });
                    
                    // 黑暗模式下的特殊处理
                    if (isDark.value) {
                        document.documentElement.style.setProperty('--vp-code-block-bg', 'rgba(30, 30, 32, 0.8)');
                        document.documentElement.style.setProperty('--vp-c-bg-alt', 'rgba(30, 30, 32, 0.8)');
                    }
                } else {
                    mainElement.classList.remove('grid-paper-bg');
                    document.documentElement.style.setProperty('--content-border-left', 'var(--vp-c-divider)');
                    document.documentElement.style.setProperty('--outline-marker-width', '2px');
                    
                    // 恢复默认代码块样式
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
            });
        };

        onMounted(() => {
            // 初始化原有的图片功能
            initImages();

            // 设置图片自动切换功能
            // setupImgFallback();

            // 初始化原有的图片功能
            initZoom();
            
            // 设置格子纸背景
            setupGridPaperBg();
        });

        watch(
            () => route.path,
            () => nextTick(() => {
                // setupImgFallback(); // 在路由变化时重新初始化图片自动切换功能
                initImages();
                initZoom();
                setupGridPaperBg(); // 路由变化时重新检查格子纸背景设置
            })
        );
        
        // 监听frontmatter变化
        watch(
            () => frontmatter.value,
            () => {
                setupGridPaperBg();
            }
        );
    }
}

// 如果需要去除图片自动切换功能，请将setupImgFallback();注释掉
// initImages();还原