import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import mdItCustomAttrs from 'markdown-it-custom-attrs'
import type MarkdownIt from 'markdown-it'
import type { UserConfig } from 'vitepress'
import type { ThemeConfig } from 'vitepress'

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
    markdown: {
        config: (md: MarkdownIt) => {
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
        ["link", { rel: "stylesheet", href: "https://blog.yumeng.icu/static/css/fancybox.css" },], // //全局控制图片放大样式
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
        // 评论的仓库地址
        comment: {
            repo: 'airene/vitepress-blog-pure',
            themes: 'github-light',
            issueTerm: 'pathname'
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Category', link: '/pages/category' },
            { text: 'Archives', link: '/pages/archives' },
            { text: 'Tags', link: '/pages/tags' },
            { text: 'About', link: '/pages/about' },
        ],
        search: {
            provider: 'local',
        },
        //outline:[2,3],
        outline: {
            label: '文章摘要'
        },
        socialLinks: [{ icon: 'github' as const, link: 'https://github.com/myfishdream' }]
    } satisfies ThemeConfig,
    srcExclude: ['README.md'], // exclude the README.md , needn't to compiler

    vite: {
        //build: { minify: false }
        server: { port: 5000 }
    }
} satisfies UserConfig)
