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
        const initZoom = () => {
            // 只有在Markdown中![](path/to/file.jpg){data-zoomable}
            // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' });

            // 全局图片使用
            mediumZoom('.main img', { background: 'rgba(0,0,0,0.2)' });
        };
        onMounted(() => {
            initZoom();
        });
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        );
    }
}
