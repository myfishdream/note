<template>
    <Layout>
        <template #doc-before>
            <div class="post-info" v-if="!$frontmatter.page">
                <span class="post-date" :style="getYearStyle($frontmatter.date)">
                    {{ $frontmatter.date?.substring(0,10) }}
                </span>
                <div class="post-tags">
                    <a v-for="item in $frontmatter.tags" 
                       :key="item"
                       class="post-tag"
                       :style="getTagStyle(item)"
                       :href="withBase(`/pages/tags.html?tag=${item}`)">
                        {{ item }}
                    </a>
                </div>
            </div>
        </template>
        <template #doc-footer-before>
            <!-- <Giscus /> -->
        </template>
    </Layout>
    <Copyright />
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'
// import Giscus from './giscus.vue'
import { withBase } from "vitepress"
import '../styles/tagColors.css'
import '../styles/yearColors.css'
import tagMap from '../styles/tagMap.json'

const { Layout } = DefaultTheme

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
        color: `var(--year-${year})`,
        backgroundColor: `color-mix(in srgb, var(--year-${year}) 15%, transparent)`
    }
}
</script>

<style scoped>
.post-info {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.post-date {
    font-family: var(--date-font-family), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 2px 10px;
    border-radius: 6px;
    white-space: nowrap;
}

.post-tags {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.post-tag {
    text-decoration: none;
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: opacity 0.2s;
}

.post-tag:hover {
    opacity: 0.8;
}

@media screen and (max-width: 768px) {
    .post-info {
        margin: 0.75rem 0 1.5rem;
        gap: 12px;
    }

    .post-date,
    .post-tag {
        font-size: 0.8125rem;
        padding: 2px 8px;
    }

    .post-tags {
        gap: 6px;
    }
}
</style>
