import { globby } from 'globby'     // globby 是一个用于文件路径匹配的库，可以用于获取指定目录下的所有文件路径
import matter from 'gray-matter'     // gray-matter 是一个用于解析markdown文件的库，可以用于解析markdown文件的frontmatter
import fs from 'fs-extra'            // fs-extra 是一个用于文件操作的库，可以用于读取和写入文件
import { resolve } from 'path'        // resolve 是一个用于解析文件路径的库，可以用于解析文件路径
import dayjs from 'dayjs'            // dayjs 是一个轻量级的日期处理库
import relativeTime from 'dayjs/plugin/relativeTime'  // 相对时间插件
import customParseFormat from 'dayjs/plugin/customParseFormat'  // 自定义格式解析插件
import isBetween from 'dayjs/plugin/isBetween'  // 日期比较插件
import zhCN from 'dayjs/locale/zh-cn'  // 中文语言包
import enUS from 'dayjs/locale/en'  // 英文语言包
// 注册 dayjs 插件
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

// 设置中文语言
// dayjs.locale('zh-cn')
dayjs.locale('en')

// 待发布文档的标识
const DRAFT_FLAG = 'draft: true'

async function getPosts(pageSize) {
    let paths = await globby(['posts/**.md'])   // 获取posts目录下的所有md文件

    // 过滤掉待发布的文档
    let validPaths = []
    for (const path of paths) {
        const content = await fs.readFile(path, 'utf-8')
        const { data } = matter(content)
        
        // 检查是否包含待发布标识
        if (!data.draft) {
            validPaths.push(path)
        } else {
            console.log(`跳过待发布文档: ${path}`)
        }
    }

    //生成分页页面markdown
    await generatePaginationPages(validPaths.length, pageSize)

    let posts = await Promise.all(
        validPaths.map(async (item) => {
            const content = await fs.readFile(item, 'utf-8')
            const { data } = matter(content)
            // 保存原始日期字符串
            const originalDate = data.date
            // 转换日期格式
            data.date = _convertDate(data.date)
            // 添加相对时间，使用原始日期字符串
            data.relativeTime = _getRelativeTime(originalDate)  // TODO: 当输入时间带秒好像有点问题，需要优化
            // 添加是否在一周内的标记，使用原始日期字符串
            data.isWithinWeek = _isWithinWeek(originalDate)
            return {
                frontMatter: data,
                regularPath: `/${item.replace('.md', '')}`
            }
        })
    )
    posts.sort(_compareDate)
    return posts
}

async function generatePaginationPages(total, pageSize) {
    //  pagesNum
    let pagesNum = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1
    const paths = resolve('./')
    if (total > 0) {
        for (let i = 1; i < pagesNum + 1; i++) {
            const page = `
---
page: true
title: ${i === 1 ? 'Home' : 'Page ' + i}
aside: false
lastUpdated: false
comments: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i})
</script>
<Page :posts="posts" :pageCurrent="${i}" :pagesNum="${pagesNum}" />
`.trim()
            const file = paths + `/page_${i}.md`
            await fs.writeFile(file, page)
        }
    }
    // rename page_1 to index for homepage
    await fs.move(paths + '/page_1.md', paths + '/index.md', { overwrite: true })
}

function _convertDate(date = new Date().toString()) {
    // 使用 dayjs 解析日期
    const parsedDate = dayjs(date)
    
    // 检查日期是否有效
    if (!parsedDate.isValid()) {
        console.warn(`无效的日期格式: ${date}，使用当前日期代替`)
        return dayjs().format('YYYY-MM-DD')
    }
    
    // 返回标准格式的日期字符串 YYYY-MM-DD
    return parsedDate.format('YYYY-MM-DD')
}

// 添加相对时间显示功能
function _getRelativeTime(date) {
    // 使用 dayjs 解析日期
    const parsedDate = dayjs(date)
    
    // 检查日期是否有效
    if (!parsedDate.isValid()) {
        console.warn(`无效的日期格式: ${date}，使用当前日期代替`)
        return '刚刚'
    }
    
    // 使用 dayjs 的 fromNow 方法获取相对时间
    return parsedDate.fromNow()
}

// 判断日期是否在一周内
function _isWithinWeek(date) {
    // 使用 dayjs 解析日期
    const parsedDate = dayjs(date)
    
    // 检查日期是否有效
    if (!parsedDate.isValid()) {
        console.warn(`无效的日期格式: ${date}，使用当前日期代替`)
        return true
    }
    
    // 获取当前日期
    const now = dayjs()
    
    // 判断日期是否在一周内
    return parsedDate.isAfter(now.subtract(7, 'day'))
}

function _compareDate(obj1, obj2) {
    return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1
}

export { getPosts } 