<template>
    <div class="archives-container">
        <div v-for="yearList in data" class="year-section">
            <div class="year" :style="getYearStyle(yearList[0].frontMatter.date)">
                {{ yearList[0].frontMatter.date.split('-')[0] }}
                <sup>{{ yearList.length }}</sup>
            </div>
            <div class="posts-list">
                <a 
                    :href="withBase(article.regularPath)" 
                    v-for="(article, index) in yearList" 
                    :key="index" 
                    class="posts"
                >
                    <div class="post-container">
                        <span class="post-title">{{ article.frontMatter.title }}</span>
                    </div>
                    <div class="date" :style="getYearStyle(article.frontMatter.date)">
                        {{ article.frontMatter.date.slice(5) }}
                    </div>
                </a>
            </div>
        </div>
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
.archives-container {
    padding: 1rem 0;
}

.year-section {
    margin-bottom: 2rem;
}

.year {
    padding: 1.5rem 0 1rem;
    font-size: 1.75rem;
    font-weight: 600;
    font-family: var(--date-font-family), serif;
    border-bottom: 3px solid var(--vp-c-divider);
    display: flex;
    align-items: center;
    gap: 8px;
}

.year sup {
    font-size: 0.875rem;
    background-color: var(--vp-c-bg-alt);
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;
    opacity: 0.8;
}

.posts-list {
    padding-left: 1rem;
}

.posts {
    padding: 0.75rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    border-bottom: 1px solid var(--vp-c-divider);
    transition: all 0.2s ease;
}

.post-container {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    color: var(--vp-c-text-1);
    font-size: 0.9375rem;
    font-weight: 400;
}

.post-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
}

.date {
    flex-shrink: 0;
    color: var(--date-color);
    font-weight: 500;
    font-size: 0.875rem;
    opacity: 0.8;
}

@media screen and (max-width: 768px) {
    .archives-container {
        padding: 0.5rem 0;
    }

    .year-section {
        margin-bottom: 1.5rem;
    }

    .year {
        font-size: 1.25rem;
        padding: 1rem 0 0.75rem;
    }

    .year sup {
        font-size: 0.75rem;
        padding: 1px 6px;
    }

    .posts-list {
        padding-left: 0.5rem;
    }

    .posts {
        padding: 0.625rem 0;
    }

    .post-container {
        font-size: 0.875rem;
    }

    .post-title {
        max-width: calc(100vw - 110px);
    }

    .date {
        font-size: 0.75rem;
    }
}
</style>
