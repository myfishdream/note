<template>
    <div v-for="yearList in data">
        <div class="year" :style="getYearStyle(yearList[0].frontMatter.date)">
            {{ yearList[0].frontMatter.date.split('-')[0] }}
        </div>
        <a :href="withBase(article.regularPath)" v-for="(article, index) in yearList" :key="index" class="posts">
            <div class="post-container">
                <div class="post-dot"></div>
                {{ article.frontMatter.title }}
            </div>
            <div class="date" :style="getYearStyle(article.frontMatter.date)">{{ article.frontMatter.date.slice(5) }}</div>
        </a>
    </div>
</template>

<script setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useYearSort } from '../functions'
import '../styles/yearColors.css'

const { theme } = useData()
const data = computed(() => useYearSort(theme.value.posts))

// 获取年份的样式
const getYearStyle = (date) => {
    if (!date) return {}
    const year = date.substring(0, 4)
    return {
        color: `var(--year-${year})`
    }
}
</script>

<style scoped>
.year {
    padding: 28px 0 10px 0;
    font-size: 1.375rem;
    font-weight: 600;
    font-family: var(--date-font-family),serif;
}

.posts {
    text-decoration: none;
}
</style>
