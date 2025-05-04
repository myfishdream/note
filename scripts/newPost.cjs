#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 获取命令行参数
const args = process.argv.slice(2)
const [fileName = `post-${Date.now().toString().slice(9, 14)}`, title = 'My article', description = '默认描述', tags = '默认标签'] = args

// 获取当前日期
const date = new Date().toISOString().split('T')[0]

// 生成frontmatter
const frontmatter = `---
title: ${title}
date: ${date}
category: other
tags: 
    - ${tags.split(',').join('\n    - ')}
description: ${description}
draft: false
outline: [2,3]
sticky: false
done: false
gridPaper: false
handwriting: false
cbf: false
zoomable: true
publish: true
---

`

try {
    // 确保posts目录存在
    const postsDir = path.join(process.cwd(), 'posts')
    if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir)
    }

    // 创建文件
    const filePath = path.join(postsDir, `${fileName}.md`)
    fs.writeFileSync(filePath, frontmatter)
    
    console.log(`\n✨ 文章创建成功！`)
    console.log(`📝 文件路径: ${filePath}`)
    console.log(`\n使用方法：`)
    console.log(`npm run new [文件名] [标题] [描述] [标签(逗号分隔)]`)
    console.log(`示例：npm run new my-post "我的文章" "这是描述" "标签1,标签2"`)
    
} catch (error) {
    console.error('❌ 创建文章失败:', error)
} 