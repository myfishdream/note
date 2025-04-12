import DefaultTheme from 'vitepress/theme'
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'

import './style.css'
import './custom.css'

// 图片处理
import { useRoute } from 'vitepress';
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
        
        // 全局图片错误处理
        const handleImageError = (event) => {
            console.log('图片加载失败，使用默认图片')
            event.target.src = '/images/loading-error.png'
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
