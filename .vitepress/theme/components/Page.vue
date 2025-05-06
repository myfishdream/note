<template>
    <div v-for="(article, index) in posts" :key="index" class="post-list">
        <div class="post-header">
            <div class="post-title">
                <svg t="1746062017721" 
                     class="doc-icon" 
                     :class="{
                         'is-sticky': article.frontMatter.sticky,
                         'is-draft': article.frontMatter.done === true
                     }"
                     viewBox="0 0 1256 1024" 
                     version="1.1" 
                     xmlns="http://www.w3.org/2000/svg" 
                     width="16" 
                     height="16">
                    <path d="M983.645091 128.512v91.042909h94.626909l-36.538182-34.536727-58.088727-56.506182z m-74.472727-54.039273h-707.490909a111.709091 111.709091 0 0 0-111.709091 111.709091v651.636364a111.709091 111.709091 0 0 0 111.709091 111.709091h837.818181a111.709091 111.709091 0 0 0 111.709091-111.709091V294.027636h-242.036363V74.472727zM201.681455 0H958.370909l135.307636 131.677091 132.00291 124.741818V837.818182a186.181818 186.181818 0 0 1-186.181819 186.181818h-837.818181a186.181818 186.181818 0 0 1-186.181819-186.181818V186.181818a186.181818 186.181818 0 0 1 186.181819-186.181818z m46.545454 386.327273a37.236364 37.236364 0 1 1 0-74.472728h400.849455a37.236364 37.236364 0 1 1 0 74.472728H248.226909z m0 372.363636a37.236364 37.236364 0 1 1 0-74.472727H991.883636a37.236364 37.236364 0 1 1 0 74.472727H248.226909z m0-186.181818a37.236364 37.236364 0 1 1 0-74.472727H991.883636a37.236364 37.236364 0 1 1 0 74.472727H248.226909z" fill="currentColor" p-id="14890"></path>
                </svg>
                <a class="post-title-link" :href="withBase(article.regularPath)" :title="article.frontMatter.description">{{ article.frontMatter.title }}</a>
            </div>
            <div class="post-meta">
                <div class="post-tags">
                    <template v-for="(item, tagIndex) in article.frontMatter.tags" :key="item">
                        <a v-if="tagIndex < (isMobile ? 3 : 5)"
                           class="post-tag"
                           :style="getTagStyle(item)"
                           :href="withBase(`/pages/tags.html?tag=${item}`)">
                            {{ item }}
                        </a>
                        <span v-else-if="tagIndex === (isMobile ? 3 : 5)" class="post-tag more-tag">...</span>
                    </template>
                </div>
                <span class="post-date hide-on-mobile" :style="getYearStyle(article.frontMatter.date)">
                    {{ article.frontMatter.date }}
                </span>
            </div>
            
        </div>
    </div>

    <div class="pagination">
        <!-- 上一页按钮 -->
        <a v-if="theme.website.showPrevNextBtn"
            class="page-btn prev-btn" 
            :class="{ disabled: pageCurrent <= 1 }"
            :href="pageCurrent > 1 ? withBase(pageCurrent === 2 ? '/index.html' : `/page_${pageCurrent - 1}.html`) : 'javascript:void(0)'"
        >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </a>
        
        <!-- 页码按钮 -->
        <template v-for="i in pagesNum" :key="i">
            <!-- 总是显示第一页 -->
            <a  
                v-if="i === 1" 
                class="link" 
                :class="{ active: pageCurrent === i }" 
                :href="withBase('/index.html')"
            >
                {{ i }}
            </a>
            
            <!-- 前省略号 -->
            <span v-else-if="i === 2 && pageCurrent > 4" class="ellipsis">...</span>
            
            <!-- 显示当前页及其前后页 -->
            <a 
                v-else-if="(i >= pageCurrent - 1 && i <= pageCurrent + 1) || (i <= 5 && pageCurrent <= 3) || (i > pagesNum - 5 && pageCurrent > pagesNum - 3)" 
                class="link" 
                :class="{ active: pageCurrent === i }" 
                :href="withBase(i === 1 ? '/index.html' : `/page_${i}.html`)"
            >
                {{ i }}
            </a>
            
            <!-- 后省略号 -->
            <span v-else-if="i === pagesNum - 1 && pageCurrent < pagesNum - 3" class="ellipsis">...</span>
            
            <!-- 总是显示最后一页 -->
            <a 
                v-else-if="i === pagesNum" 
                class="link" 
                :class="{ active: pageCurrent === i }" 
                :href="withBase(`/page_${i}.html`)"
            >
                {{ i }}
            </a>
        </template>
        
        <!-- 下一页按钮 -->
        <a 
            v-if="theme.website.showPrevNextBtn"
            class="page-btn next-btn" 
            :class="{ disabled: pageCurrent >= pagesNum }"
            :href="pageCurrent < pagesNum ? withBase(`/page_${pageCurrent + 1}.html`) : 'javascript:void(0)'"
        >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </a>
    </div>
</template>

<script setup>
import { withBase, useData } from 'vitepress'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import '../styles/tagColors.css'    // 引入标签颜色样式
import '../styles/yearColors.css'   // 引入年份颜色样式
import tagMap from '../styles/tagMap.json'  // 引入标签映射

const { theme } = useData()
// console.log(theme.value.website.showJumpBtn)
const props = defineProps({
    posts: {
        type: Array,
        required: true
    },
    pageCurrent: {
        type: Number,
        required: true
    },
    pagesNum: {
        type: Number,
        required: true
    }
})

// 分页控制参数
const maxPageBtns = 5       // 控制分页器最多显示多少个页码按钮
const maxVisiblePages = 3   // 控制当前页码前后最多显示多少个页码

const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
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
.post-list {
    padding: 14px 0;
    border-bottom: 2px solid var(--vp-c-divider);
}

.post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.post-title {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.doc-icon {
    flex-shrink: 0;
    color: var(--vp-c-text-2);
    transition: color 0.2s;
}

.doc-icon.is-sticky {
    color: var(--vp-c-success); /* 置顶文章使用主题色 */
}

.doc-icon.is-draft {
    color: var(--vp-c-warning); /* 未完成文章使用警告色 */
}

.post-title-link {
    display: block;
    color: var(--yu-theme-title);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.post-title-link:hover {
    color: var(--vp-c-text-1);
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.875rem;
    flex-shrink: 0;
}

.post-tags {
    display: flex;
    align-items: center;
    gap: 5px;
}

.post-tag,
.post-date {
    border-radius: 16px;
    padding: 2px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.post-tag {
    text-decoration: none;
    color: var(--vp-c-text-1);
    transition: opacity 0.2s;
}

.post-tag:hover {
    opacity: 0.8;
}

.post-date {
    font-weight: 500;
}

.pagination {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
}

.link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    text-align: center;
    border: 1px var(--vp-c-divider) solid;
    font-weight: 400;
    border-radius: 4px;
    transition: all 0.2s;
    text-decoration: none;
    color: var(--vp-c-text-1);
}

.link:hover {
    color: var(--vp-c-text-1);
    text-decoration: none;
}

.link.active {
    background: var(--vp-c-text-1);
    color: var(--vp-c-neutral-inverse);
    border: 1px solid var(--vp-c-text-1) !important;
}

.page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px var(--vp-c-divider) solid;
    border-radius: 4px;
    transition: all 0.2s;
    text-decoration: none;
    color: var(--vp-c-text-1);
}

.page-btn:hover:not(.disabled) {
    color: var(--vp-c-text-1);
    text-decoration: none;
}

.page-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--vp-c-text-2);
}

.more-tag {
    background-color: transparent !important;
    padding: 2px 0 !important;
}

@media screen and (max-width: 768px) {
    .post-header {
        gap: 8px;
    }

    .post-meta {
        gap: 8px;
    }

    .post-tags {
        gap: 4px;
    }

    .post-tag {
        padding: 0px 8px;
        font-size: 0.75rem;
    }

    .hide-on-mobile {
        display: none;
    }

    .link, .page-btn {
        min-width: 28px;
        height: 28px;
    }

    .more-tag {
        font-size: 0.75rem;
    }
    .doc-icon{
        display: none;
    }
}
</style>
