import DefaultTheme from 'vitepress/theme'
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'

import './style.css'
import './custom.css'

// 图片处理
import { useRoute, useData } from 'vitepress';
import { onMounted, watch, nextTick } from 'vue';
import mediumZoom from 'medium-zoom';

export default {
    ...DefaultTheme,
    Layout: NewLayout,
    enhanceApp({ app }) {
        app.component('Tags', Tags)
        app.component('Category', Category)
        app.component('Archives', Archives)
        app.component('Page', Page)
    },
    setup() {
        const route = useRoute();
        const { isDark } = useData();  // 使用 useData 获取主题状态
        
        // 根据主题获取对应的错误图片
        const getErrorImage = () => {
            return isDark.value ? '/images/loading-error-dark.png' : '/images/loading-error-light.png';
        }

        // 全局图片错误处理
        const handleImageError = (event) => {
            // console.log('图片加载失败，使用默认图片')
            event.target.src = getErrorImage()
            event.target.onerror = null // 防止无限循环
        }

        // 初始化图片处理
        const initImages = () => {
            // 为所有图片添加错误处理
            document.querySelectorAll('img').forEach(img => {
                if (!img.onerror) {
                    img.onerror = handleImageError
                }
            })
        }

        const initZoom = () => {
            // 只有在Markdown中![](path/to/file.jpg){data-zoomable}
            // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' });

            // 全局图片使用
            mediumZoom('.main img', { background: 'rgba(0,0,0,0.2)' });
        };

        // 在 setup() 函数内添加
        const updateErrorImages = () => {
            const errorSrc = getErrorImage()
            document.querySelectorAll('img').forEach(img => {
                if (img.src.includes('loading-error')) {
                    img.src = errorSrc
                }
            })
        }

        // 监听主题变化（可以删除，因为 isDark 是响应式的）
        watch(isDark, () => {
            updateErrorImages();
        });
        
        onMounted(() => {
            initImages();
            initZoom();
        });

        watch(
            () => route.path,
            () => nextTick(() => {
                initImages();
                initZoom();
            })
        );
    }
}
