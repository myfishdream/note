import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import mdItCustomAttrs from 'markdown-it-custom-attrs'

//每页的文章数量
const pageSize = 10

export default defineConfig({
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
    themeConfig: {
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