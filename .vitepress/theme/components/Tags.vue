<template>
    <div class="tags">
        <span 
            @click="toggleTag(String(key))" 
            v-for="(_, key) in data" 
            class="tag"
            :class="{ 'tag-active': selectTag === key }"
            :style="getTagStyle(key)"
        >
            {{ key }} <sup>{{ data[key].length }}</sup>
        </span>
    </div>
    <div class="tag-header">{{ selectTag }}</div>
    <a
        :href="withBase(article.regularPath)"
        v-for="(article, index) in selectTag ? data[selectTag] : []"
        :key="index"
        class="posts"
    >
        <div class="post-container">
            <div class="post-dot"></div>
            {{ article.frontMatter.title }}
        </div>
        <div class="date" :style="getYearStyle(article.frontMatter.date)">{{ article.frontMatter.date }}</div>
    </a>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'
import { initTags } from '../functions'
import '../styles/tagColors.css'
import '../styles/yearColors.css'
import tagMap from '../styles/tagMap.json'

const { theme } = useData()
const data = computed(() => initTags(theme.value.posts || []))
let selectTag = ref('')

// 获取标签的样式
const getTagStyle = (tag) => {
    const index = tagMap[tag]
    if (!index) return {}
    
    return {
        color: `var(--tag-${index})`,
        backgroundColor: `color-mix(in srgb, var(--tag-${index}) 15%, transparent)`
    }
}

// 获取年份的样式
const getYearStyle = (date) => {
    if (!date) return {}
    const year = date.substring(0, 4)
    return {
        color: `var(--year-${year})`
    }
}

// 从URL中获取tag参数
function getTagFromUrl() {
    const url = window.location.href
    const urlObj = new URL(url)
    return urlObj.searchParams.get('tag')
}

// 切换标签并更新URL
const toggleTag = (tag) => {
    selectTag.value = tag
    // 更新URL，但不刷新页面
    const url = new URL(window.location.href)
    url.searchParams.set('tag', tag)
    window.history.pushState({}, '', url.toString())
}

// 组件挂载时从URL中读取tag参数
onMounted(() => {
    const tagFromUrl = getTagFromUrl()
    if (tagFromUrl && data.value[tagFromUrl]) {
        // 如果URL中有tag参数且该标签存在，则选中该标签
        selectTag.value = tagFromUrl
    } else {
        // 否则选择第一个标签
        const defaultDisplayTag = Object.keys(data.value)[0]
        if (defaultDisplayTag) {
            toggleTag(defaultDisplayTag)
        }
    }
})
</script>

<style scoped>
.posts {
    text-decoration: none;
}

.tags {
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
}

.tag {
    display: inline-block;
    padding: 0 16px 4px 16px;
    margin: 6px 8px;
    font-size: 0.875rem;
    line-height: 25px;
    border-radius: 2px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.tag:hover {
    opacity: 0.8;
}

.tag sup {
    font-weight: bold;
}

.tag-header {
    padding: 28px 0 10px 0;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--bt-theme-title);
    font-family: var(--date-font-family);
}

@media screen and (max-width: 768px) {
    .date {
        font-size: 0.75rem;
    }
}
</style>
