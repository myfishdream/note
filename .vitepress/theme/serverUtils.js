import { globby } from 'globby'     // globby 是一个用于文件路径匹配的库，可以用于获取指定目录下的所有文件路径
import matter from 'gray-matter'     // gray-matter 是一个用于解析markdown文件的库，可以用于解析markdown文件的frontmatter
import fs from 'fs-extra'            // fs-extra 是一个用于文件操作的库，可以用于读取和写入文件
import { resolve } from 'path'        // resolve 是一个用于解析文件路径的库，可以用于解析文件路径

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
    // 尝试解析各种格式的日期
    let parsedDate;

    // 处理常见的日期格式
    if (typeof date === 'string') {
        // 尝试解析 YYYY-MM-DD 格式
        const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
        const match = date.match(dateRegex);

        if (match) {
            // 提取年月日时分秒
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1; // 月份从0开始
            const day = parseInt(match[3]);
            const hours = match[4] ? parseInt(match[4]) : 0;
            const minutes = match[5] ? parseInt(match[5]) : 0;
            const seconds = match[6] ? parseInt(match[6]) : 0;

            parsedDate = new Date(year, month, day, hours, minutes, seconds);
        } else {
            // 尝试使用原生Date解析
            parsedDate = new Date(date);
        }
    } else if (date instanceof Date) {
        parsedDate = date;
    } else {
        parsedDate = new Date();
    }

    // 检查日期是否有效
    if (isNaN(parsedDate.getTime())) {
        console.warn(`无效的日期格式: ${date}，使用当前日期代替`);
        parsedDate = new Date();
    }

    // 返回标准格式的日期字符串 YYYY-MM-DD
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 添加相对时间显示功能
function _getRelativeTime(date) {
    // 确保date是一个Date对象
    let dateObj;
    if (typeof date === 'string') {
        // 尝试解析 YYYY-MM-DD 格式
        const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
        const match = date.match(dateRegex);

        if (match) {
            // 提取年月日时分秒
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1; // 月份从0开始
            const day = parseInt(match[3]);
            const hours = match[4] ? parseInt(match[4]) : 0;
            const minutes = match[5] ? parseInt(match[5]) : 0;
            const seconds = match[6] ? parseInt(match[6]) : 0;

            dateObj = new Date(year, month, day, hours, minutes, seconds);
        } else {
            // 尝试使用原生Date解析
            dateObj = new Date(date);
        }
    } else if (date instanceof Date) {
        dateObj = date;
    } else {
        dateObj = new Date();
    }

    // 检查日期是否有效
    if (isNaN(dateObj.getTime())) {
        console.warn(`无效的日期格式: ${date}，使用当前日期代替`);
        dateObj = new Date();
    }

    const now = new Date();
    const diff = now - dateObj;

    // 转换为秒
    const seconds = Math.floor(diff / 1000);

    // 如果小于1分钟
    if (seconds < 60) {
        return '刚刚';
    }

    // 转换为分钟
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}分钟前`;
    }

    // 转换为小时
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}小时前`;
    }

    // 转换为天
    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days}天前`;
    }

    // 转换为周
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return `${weeks}周前`;
    }

    // 转换为月
    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months}个月前`;
    }

    // 转换为年
    const years = Math.floor(days / 365);
    return `${years}年前`;
}

// 判断日期是否在一周内
function _isWithinWeek(date) {
    // 确保date是一个Date对象
    let dateObj;
    if (typeof date === 'string') {
        // 尝试解析 YYYY-MM-DD 格式
        const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
        const match = date.match(dateRegex);

        if (match) {
            // 提取年月日时分秒
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1; // 月份从0开始
            const day = parseInt(match[3]);
            const hours = match[4] ? parseInt(match[4]) : 0;
            const minutes = match[5] ? parseInt(match[5]) : 0;
            const seconds = match[6] ? parseInt(match[6]) : 0;

            dateObj = new Date(year, month, day, hours, minutes, seconds);
        } else {
            // 尝试使用原生Date解析
            dateObj = new Date(date);
        }
    } else if (date instanceof Date) {
        dateObj = date;
    } else {
        dateObj = new Date();
    }

    // 检查日期是否有效
    if (isNaN(dateObj.getTime())) {
        console.warn(`无效的日期格式: ${date}，使用当前日期代替`);
        dateObj = new Date();
    }

    const now = new Date();
    const diff = now - dateObj;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days < 7;
}

function _compareDate(obj1, obj2) {
    return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1
}

export { getPosts } 