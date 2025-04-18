import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import timeline from "vitepress-markdown-timeline";
import { RssPlugin } from 'vitepress-plugin-rss'
//     "markdown-it-custom-attrs": "^1.0.2",
// import mdItCustomAttrs from 'markdown-it-custom-attrs'

//每页的文章数量
const pageSize = 10

// RSS 配置
const baseUrl = 'https://yumeng.icu'
const RSS = {
    title: 'YuMeng',
    baseUrl,
    copyright: 'Copyright (c) 2025-present, YuMeng',
    filename: 'feed.xml',
    description: '鱼梦江湖的个人博客，记录生活，分享技术。',
    language: 'zh-CN',
    pubDate: new Date(),
    lastUpdated: new Date(),
    outDir: '.vitepress/dist',
    includes: ['posts/*.md'],
    excludes: ['pages/*'],
    count: 20
}

export default defineConfig({
    title: 'YuMeng',
    titleTemplate: ':title - YuMeng',
    base: '/',
    cacheDir: './node_modules/vitepress_cache',
    description: '鱼梦江湖的个人博客，记录生活，分享技术。',
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
            md.use(timeline);
        },
        image: {
            lazyLoading: true,
        }
    },
    head: [
        ["link", { rel: "icon", href: "/logo.png" }],
        ["link", { rel: "alternate", type: "application/rss+xml", title: "RSS Feed", href: "/feed.xml" }],  // 使浏览器能够自动发现 RSS 源
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
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Category', link: '/pages/category' },
            { text: 'Tags', link: '/pages/tags' },
            { text: 'Archives', link: '/pages/archives' },
            { text: 'Tool', link: '/pages/site' },
            { text: 'About', link: '/pages/about' },
        ],
        search: {
            provider: 'local',
        },
        outline: {
            label: '文章摘要'
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/yumengjh' },],
        website: {
            copyrightLink: '/pages/about',
            showLantern: false,
            lanternText: ['康'],
        }
    },
    srcExclude: ['README.md'], // 排除README.md文件，不需要编译

    vite: {
        server: { port: 5000 },
        plugins: [RssPlugin(RSS)],
        optimizeDeps: {
            exclude: [
                'vitepress-plugin-rss'
            ]
        },
        ssr: {
            noExternal: [
                'vitepress-plugin-rss'
            ]
        }
    },
    // 重写路由
    rewrites: {
        // 'posts/:article': '/:article',
        // 'pages/:page': '/:page'
    }
}) 