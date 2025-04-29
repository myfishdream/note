import fs from 'fs-extra'
import path from 'path'

export function generateTagColors(posts) {
    // 收集所有唯一的标签
    const allTags = new Set()
    posts.forEach(post => {
        if (post.frontMatter.tags) {
            post.frontMatter.tags.forEach(tag => allTags.add(tag))
        }
    })

    // 生成CSS内容
    let cssContent = '/* 自动生成的标签颜色变量。请勿编辑变量名！ */\n'
    cssContent += '/* 可以修改颜色值来自定义标签颜色 */\n\n'
    cssContent += ':root {\n'
    
    // 为每个标签生成一个CSS变量，使用数字索引
    const sortedTags = Array.from(allTags).sort()
    const tagMap = new Map() // 用于存储标签到索引的映射

    sortedTags.forEach((tag, index) => {
        const varName = `--tag-${index + 1}`
        tagMap.set(tag, index + 1)
        cssContent += `    ${varName}: #e0e0e0; /* ${tag} */\n`
    })
    
    cssContent += '}\n\n'
    cssContent += '.dark {\n'
    
    // 为暗色模式生成相同的变量
    sortedTags.forEach((tag, index) => {
        const varName = `--tag-${index + 1}`
        cssContent += `    ${varName}: #4a4a4a; /* ${tag} */\n`
    })
    
    cssContent += '}\n\n'
    
    // 生成标签映射注释
    cssContent += '/* 标签名称到变量编号的映射 */\n'
    cssContent += '/*\n'
    tagMap.forEach((index, tag) => {
        cssContent += ` * ${tag} -> --tag-${index}\n`
    })
    cssContent += ' */\n'

    // 确保目录存在
    const cssDir = path.join(process.cwd(), '.vitepress/theme/styles')
    if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir, { recursive: true })
    }

    const cssPath = path.join(cssDir, 'tagColors.css')
    
    // 如果文件已存在，读取现有的颜色值
    let existingColors = new Map()
    if (fs.existsSync(cssPath)) {
        const existingContent = fs.readFileSync(cssPath, 'utf-8')
        const colorRegex = /(--tag-\d+):\s*([^;]+);/g
        let match
        while ((match = colorRegex.exec(existingContent)) !== null) {
            existingColors.set(match[1], match[2])
        }
    }

    // 使用现有的颜色值更新新生成的内容
    if (existingColors.size > 0) {
        sortedTags.forEach((tag, index) => {
            const varName = `--tag-${index + 1}`
            if (existingColors.has(varName)) {
                const color = existingColors.get(varName)
                cssContent = cssContent.replace(
                    new RegExp(`${varName}: #e0e0e0;`), 
                    `${varName}: ${color};`
                )
                cssContent = cssContent.replace(
                    new RegExp(`${varName}: #4a4a4a;`), 
                    `${varName}: ${color};`
                )
            }
        })
    }

    // 写入文件
    fs.writeFileSync(cssPath, cssContent)
    
    // 同时生成标签映射文件，方便组件使用
    const mapPath = path.join(cssDir, 'tagMap.json')
    fs.writeFileSync(mapPath, JSON.stringify(Object.fromEntries(tagMap), null, 2))
} 