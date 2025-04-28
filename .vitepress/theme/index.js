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

// 工具函数导入
import { useRoute, useData } from 'vitepress';
import { onMounted, watch, nextTick } from 'vue';
import { 
    initImages, 
    initZoom, 
    updateErrorImages, 
    setupGridPaperBg 
} from './functions';

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
        
        // 初始化代码块折叠功能
        codeblocksFold({ route, frontmatter }, true, 200);
        
        // 主题切换监听
        watch(isDark, () => {
            // 更新错误图片
            updateErrorImages(isDark.value);
            
            // 检查并更新格子纸背景相关样式
            setupGridPaperBg(frontmatter.value, isDark.value);
        });
        
        // 组件挂载后执行
        onMounted(() => {
            // 初始化图片处理
            initImages(isDark.value);
            
            // 初始化图片缩放
            initZoom(frontmatter.value);
            
            // 设置格子纸背景
            setupGridPaperBg(frontmatter.value, isDark.value);
        });
        
        // 路由变化监听
        watch(
            () => route.path,
            () => nextTick(() => {
                // 路由变化时重新初始化图片处理
                initImages(isDark.value);
                initZoom(frontmatter.value);
                setupGridPaperBg(frontmatter.value, isDark.value);
            })
        );
        
        // frontmatter变化监听
        watch(
            () => frontmatter.value,
            () => {
                setupGridPaperBg(frontmatter.value, isDark.value);
            }
        );
    }
}

// 如果需要去除图片自动切换功能，请将setupImgFallback();注释掉
// initImages();还原