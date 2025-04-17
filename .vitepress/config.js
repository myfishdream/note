import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
//     "markdown-it-custom-attrs": "^1.0.2",
// import mdItCustomAttrs from 'markdown-it-custom-attrs'

//每页的文章数量
const pageSize = 10

export default defineConfig({
    title: 'YuMeng',
    titleTemplate: ':title - YuMeng',
    base: '/',
    cacheDir: './node_modules/vitepress_cache',
    description: 'vitepress,blog,blog-theme',
    ignoreDeadLinks: true,
    lastUpdated: true,
    cleanUrls: true,
    markdown: {
        // lineNumbers: true,
        config: (md) => {
            // use more markdown-it plugins!
            // md.use(mdItCustomAttrs, 'image', {
            //     'data-fancybox': "gallery"
            // })
        },
        image: {
            lazyLoading: true,
        }
    },
    head: [
        ["link", { rel: "icon", href: "/logo.png" }],
        // ["link", { rel: "stylesheet", href: "https://blog.yumeng.icu/static/css/fancybox.css" },],// //全局控制图片放大样式
        // ["script", { src: "https://blog.yumeng.icu/static/js/fancybox.umd.js" }],  //全局控制图片放大交互
    ],
    themeConfig: {
        // logo: '/logo.png',
        externalLinkIcon: false,
        lastUpdated: {
            text: 'Last updated',
            formatOptions: {
                dateStyle: 'short', // full, long, medium, short
                timeStyle: 'medium'
            }
        },
        posts: await getPosts(pageSize),
        website: '/pages/about', //copyright link
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Category', link: '/pages/category' },
            { text: 'Tags', link: '/pages/tags' },
            { text: 'Archives', link: '/pages/archives' },
            { text: 'Tool', items: [
                { text: 'Site', link: '/pages/site' },
                // { text: 'Tool2', link: '/pages/tool2' },
                // { text: 'Tool3', link: '/pages/tool3' },
            ] },
            { text: 'About', link: '/pages/about' },
        ],
        search: {
            provider: 'local',
        },
        outline: {
            label: '文章摘要'
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/yumengjh' }]
    },
    srcExclude: ['README.md'], // 排除README.md文件，不需要编译

    vite: {
        server: { port: 5000 }
    },
    // 重写路由
    rewrites: {
        // 'posts/:article': '/:article',
        // 'pages/:page': '/:page'
    }
}) 