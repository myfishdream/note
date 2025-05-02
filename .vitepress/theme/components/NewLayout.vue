<template>
    <Layout>
        <template #nav-bar-content-after>
            <!-- 导航栏内容后 -->
             <!-- <CustomNavbar /> -->
        </template>
        <template #doc-before>
            <!-- 文档内容前 - 文章日期、标签和更新时间 -->
            <div class="post-info" v-if="!$frontmatter.page">
                <div class="post-info-left">
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
                <div class="post-info-right" v-if="lastUpdated && $frontmatter.date">
                    <span class="post-updated" :title="formatDate(lastUpdated, 'YYYY-MM-DD HH:mm:ss')">
                        更新: {{ displayUpdatedTime }}
                    </span>
                </div>
            </div>
            
            <!-- 文章简介 -->
            <div class="post-description" v-if="$frontmatter.description && $frontmatter.date">
                <p>{{ $frontmatter.description }}</p>
            </div>
        </template>
        <template #doc-footer-before>
            <!-- 文档页脚前 - 原评论系统位置 -->
            <!-- <Giscus /> -->
        </template>
        <!-- 6. 未找到页面插槽 -->
        <template #not-found>
            <!-- <NotFound /> -->
        </template>
    </Layout>
    <Copyright />
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'
// import CustomNavbar from './CustomNavbar.vue'
// import NotFound from './notfound.vue'
// import Giscus from './giscus.vue'
import { withBase, useData } from "vitepress"
import { computed } from 'vue'
import '../styles/tagColors.css'
import '../styles/yearColors.css'
import tagMap from '../styles/tagMap.json'
import { getRelativeTime, formatDate } from '../functions'
const { Layout } = DefaultTheme

// 获取页面数据，包括最后更新时间
const { page } = useData()

// 计算最后更新时间
const lastUpdated = computed(() => page.value.lastUpdated)
// 计算显示的更新时间（相对或绝对）
const displayUpdatedTime = computed(() => {
    if (!lastUpdated.value) return ''
    
    // 使用相对时间函数，3天内显示相对时间，否则显示绝对日期
    return getRelativeTime(lastUpdated.value, {
        maxDays: 3,  // 3天以内使用相对时间
        format: 'YYYY-MM-DD', // 超过时显示月日
        suffix: true,  // 显示"前"后缀
        texts: {
            now: '刚刚',
            minute: '分钟',
            hour: '小时',
            day: '天'
        }
    })
})
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
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.post-info-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.post-info-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
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

.post-updated {
    font-family: var(--date-font-family), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 2px 10px;
    white-space: nowrap;
    color: var(--vp-c-text-dark-1);
    border-bottom: 2px solid var(--vp-c-brand);
}

/* 文章简介样式 */
.post-description {
    margin: 1rem 0 1.5rem;
    padding: 12px 16px;
    border-radius: 2px;
    background-color: rgba(var(--vp-c-brand-rgb), 0.05);
    line-height: 1.6;
    font-size: 0.95rem;
    color: var(--vp-c-text-2);
    border-left: 4px solid var(--vp-c-brand);
}

.post-description p {
    margin: 0;
}

@media screen and (max-width: 768px) {
    .post-info {
        flex-direction: column;
        align-items: flex-start;
        margin: 0.75rem 0 1.5rem;
        gap: 10px;
    }
    
    .post-info-left {
        gap: 12px;
    }

    .post-date,
    .post-tag,
    .post-updated {
        font-size: 0.8125rem;
        padding: 2px 8px;
    }

    .post-tags {
        gap: 6px;
    }
}
</style>
