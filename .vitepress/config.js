import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import timeline from "vitepress-markdown-timeline";
import { RssPlugin } from 'vitepress-plugin-rss'
//每页的文章数量
const pageSize = 12

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
        ["link", { rel: "alternate", type: "application/rss+xml", title: "RSS Feed", href: "/feed.xml" }],  // 使浏览器能够自动发现 RSS 源
    ],
    themeConfig: {
        logo: '/favicon.ico',
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
            { text: '首页', link: '/' },
            // { text: 'Category', link: '/pages/category' },
            { text: '标签', link: '/pages/tags' },
            { text: '归档', link: '/pages/archives' },
            { text: '站点', link: '/pages/site' },
            { text: '关于我', link: '/pages/about' },
        ],
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: '搜索',
                        buttonAriaLabel: '搜索'
                    },
                    modal: {
                        noResultsText: '无法找到相关结果',
                        resetButtonTitle: '清除查询条件',
                        footer: {
                            selectText: '选择',
                            navigateText: '切换',
                            closeText: '关闭'
                        }
                    }
                }
            }
        },
        outline: {
            label: '本页目录'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/yumengjh' },
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
    },
}) 