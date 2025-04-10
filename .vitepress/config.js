import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import mdItCustomAttrs from 'markdown-it-custom-attrs'
import { withMermaid } from 'vitepress-plugin-mermaid'

//每页的文章数量
const pageSize = 10

export default withMermaid({
    title: 'YuMeng',
    titleTemplate: ':title',
    base: '/',
    cacheDir: './node_modules/vitepress_cache',
    description: 'vitepress,blog,blog-theme',
    ignoreDeadLinks: true,
    lastUpdated: true,
    cleanUrls: true,    
    markdown: {
        config: (md) => {
            // use more markdown-it plugins!
            md.use(mdItCustomAttrs, 'image', {
                'data-fancybox': "gallery"
            })
        },
        image: {
            lazyLoading: true,
        }
    },
    head: [
        ["link", { rel: "icon", href: "https://blog.yumeng.icu/logo.png" }],
        ["link", { rel: "stylesheet", href: "https://blog.yumeng.icu/static/css/fancybox.css" },],// //全局控制图片放大样式
        ["script", { src: "https://blog.yumeng.icu/static/js/fancybox.umd.js" }],  //全局控制图片放大交互
    ],
    mermaid: {
        // Mermaid 配置，参考文档: https://mermaid.nodejs.cn/config/theming.html
        theme: 'default', // 亮色模式使用的主题
        darkTheme: 'dark', // 暗色模式使用的主题
        // 其他可用主题: default, neutral, dark, forest, base
        // 支持自定义主题颜色，可以修改以下配置
        themeVariables: {
            // 主要颜色配置
            primaryColor: '#1f2020',
            primaryTextColor: '#fff',
            primaryBorderColor: '#7C0200',
            // 次要颜色
            secondaryColor: '#006100',
            secondaryBorderColor: '#006100',
            // 其他定制颜色...
        }
    },
    mermaidPlugin: {
        class: 'mermaid-diagram', // 给生成的 mermaid 容器添加的 CSS 类名
    },
    themeConfig: {
        // logo: 'https://blog.yumeng.icu/logo.png',
        externalLinkIcon: true,
        lastUpdated: {
            text: '最后更新时间',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'short'
            }
        },
        posts: await getPosts(pageSize),
        website: '/pages/about', //copyright link
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Category', link: '/pages/category' },
            { text: 'Tags', link: '/pages/tags' },
            { text: 'Archives', link: '/pages/archives' },
            { text: 'About', link: '/pages/about' },
        ],
        search: {
            provider: 'local',
        },
        outline: {
            label: '文章摘要'
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/myfishdream' }]
    },
    srcExclude: ['README.md'], // exclude the README.md , needn't to compiler

    vite: {
        server: { port: 5000 }
    }
}) 