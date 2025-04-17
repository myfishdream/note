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


import './style.css'
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
        const { isDark, frontmatter } = useData();  // 使用 useData 获取主题状态
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
                        event.target.src = getErrorImage();
                    };
                }
            });
        }

        const initZoom = () => {
            // 只有在Markdown中![](path/to/file.jpg){data-zoomable}
            // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' });

            // 全局图片使用
            mediumZoom('.main img', { background: 'rgba(0,0,0,0.2)' });
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
        });

        onMounted(() => {
            // 初始化原有的图片功能
            initImages();

            // 设置图片自动切换功能
            // setupImgFallback();

            // 初始化原有的图片功能
            initZoom();
        });

        watch(
            () => route.path,
            () => nextTick(() => {
                // setupImgFallback(); // 在路由变化时重新初始化图片自动切换功能
                initImages();
                initZoom();
            })
        );
    }
}

// 如果需要去除图片自动切换功能，请将setupImgFallback();注释掉
// initImages();还原