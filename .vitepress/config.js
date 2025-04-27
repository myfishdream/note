import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import timeline from "vitepress-markdown-timeline";
import { RssPlugin } from 'vitepress-plugin-rss'
import { fileURLToPath, URL } from 'node:url'
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
    titleTemplate: "YuMeng's :title",
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
        // ["link", { rel: "icon", href: "/logo.png" }],
        ["link", { rel: "alternate", type: "application/rss+xml", title: "RSS Feed", href: "/feed.xml" }],  // 使浏览器能够自动发现 RSS 源
        // ["link", { rel: "stylesheet", href: "https://blog.yumeng.icu/static/css/fancybox.css" },],// //全局控制图片放大样式
        // ["script", { src: "https://blog.yumeng.icu/static/js/fancybox.umd.js" }],  //全局控制图片放大交互
    ],
    themeConfig: {
        // logo: '/logo.png',
        externalLinkIcon: true,
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
            // {text:'Filter',items:[
            //     { text: 'Category', link: '/pages/category' },
            //     { text: 'Tags', link: '/pages/tags' },
            //     { text: 'Archives', link: '/pages/archives' },
            // ]},
            { text: 'Category', link: '/pages/category' },
            { text: 'Tags', link: '/pages/tags' },
            { text: 'Archives', link: '/pages/archives' },
            { text: 'Site', link: '/pages/site' },
            // { text: 'About', link: '/pages/about' },
        ],
        search: {
            provider: 'local',
        },
        outline: {
            label: '文章摘要'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/yumengjh' },
            // { icon: {
            //     svg:'<svg t="1745023741758" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25369" width="32" height="32"><path d="M228.017489 834.038726h441.963773a37.800375 37.800375 0 0 0 0-75.47283H228.017489c-21.106808 0-37.736415 17.269207-37.736415 37.736415-0.6396 20.467208 16.629606 37.736415 37.736415 37.736415zM415.420362 687.570269c1.2792 2.558401 3.198001 4.477202 4.477202 6.396002l1.918801 3.198001 1.918801 1.279201c3.837601 3.198001 8.314803 5.756402 13.431605 7.675203l2.558401 0.6396 3.837601 0.6396h10.233604l2.558401-0.6396h0.639601l3.198001-0.6396c4.477202-1.2792 8.954403-3.837601 12.792005-7.675203l3.198001-3.198001c1.918801-1.918801 3.837601-4.477202 4.477202-7.035603l157.341661-273.109307c10.233604-17.908807 4.477202-41.574016-14.071205-51.80762-8.954403-5.116802-19.188007-6.396002-28.782012-3.837602-8.314803 2.558401-15.990006 8.954403-21.106808 17.908807L448.679575 593.549032 323.957527 377.364147a37.992255 37.992255 0 0 0-65.878826 37.736415l157.341661 272.469707z" p-id="25370"></path><path d="M764.642099 126.640849H132.717052c-38.376015 0-69.716427 31.340412-69.716427 69.716428v757.926296c0 38.376015 31.340412 69.716427 69.716427 69.716427h631.925047c38.376015 0 69.716427-31.340412 69.716427-69.716427V195.717676c0-38.376015-31.340412-69.076827-69.716427-69.076827z m-6.396003 75.47283v745.134291H139.113054V202.113679h619.133042z" p-id="25371"></path><path d="M891.282948 0H228.017489c-21.106808 0-38.376015 17.269207-38.376015 37.736415s17.269207 37.736415 37.736415 37.736414h656.869456v783.510307a37.800375 37.800375 0 0 0 75.47283 0V69.716427C960.359775 31.340412 929.658963 0 891.282948 0z" p-id="25372"></path></svg>'
            // }, link: '/changelog' },
        ],
        website: {
            copyrightLink: '/pages/about',
            showJumpBtn: false,  // 是否开启跳页按钮
            showPrevNextBtn: false,     // 上一頁/下一页按钮是否显示
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
        },
        resolve: {
            alias: [
                {
                    find: /^.*\/VPSwitchAppearance\.vue$/,
                    replacement: fileURLToPath(
                        new URL('./theme/components/CustomSwitchAppearance.vue', import.meta.url)
                    )
                }
            ]
        }
    },
    // 重写路由
    // rewrites: {
    //     'posts/:article': '/:article',
    //     'pages/:page': '/:page'
    // }
}) 