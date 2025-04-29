<template>
    <div v-for="(article, index) in posts" :key="index" class="post-list">
        <div class="post-header">
            <div class="post-title">
                <svg class="doc-icon" 
                     :class="{
                         'is-sticky': article.frontMatter.sticky,
                         'is-draft': article.frontMatter.done === true
                     }"
                     viewBox="0 0 1024 1024" 
                     version="1.1" 
                     xmlns="http://www.w3.org/2000/svg" 
                     width="16" 
                     height="16">
                    <path d="M855.04 21.504H471.04c-214.016 0-388.096 174.08-388.096 388.096v504.32c0 50.176 40.96 91.136 91.136 91.136h384c214.016 0 388.096-174.08 388.096-388.096V112.128c0-50.176-40.96-90.624-91.136-90.624z m29.696 594.944c0 180.224-146.432 326.656-326.656 326.656H174.08c-16.384 0-29.696-13.312-29.696-29.696V409.088c0-180.224 146.432-326.656 326.656-326.656h384c16.384 0 29.696 13.312 29.696 29.696v504.32z" fill="currentColor"/>
                    <path d="M314.88 415.744h144.896c16.896 0 30.72-13.824 30.72-30.72s-13.824-30.72-30.72-30.72H314.88c-16.896 0-30.72 13.824-30.72 30.72s13.824 30.72 30.72 30.72zM659.456 610.304H314.88c-16.896 0-30.72 13.824-30.72 30.72s13.824 30.72 30.72 30.72h344.576c16.896 0 30.72-13.824 30.72-30.72s-13.824-30.72-30.72-30.72z" fill="currentColor"/>
                </svg>
                <a class="post-title-link" :href="withBase(article.regularPath)">{{ article.frontMatter.title }}</a>
            </div>
            <div class="post-meta">
                <div class="post-tags">
                    <template v-for="(item, tagIndex) in article.frontMatter.tags" :key="item">
                        <a v-if="tagIndex < (isMobile ? 3 : 5)"
                           class="post-tag"
                           :href="withBase(`/pages/tags.html?tag=${item}`)">
                            {{ item }}
                        </a>
                        <span v-else-if="tagIndex === (isMobile ? 3 : 5)" class="post-tag more-tag">...</span>
                    </template>
                </div>
                <span class="post-date hide-on-mobile">{{ article.frontMatter.date }}</span>
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
        
        <!-- 跳转输入框 -->
        <div class="page-jump" v-if="theme.website.showJumpBtn">
            <input 
                v-model="pageInput" 
                type="number" 
                min="1" 
                :max="pagesNum" 
                @keyup.enter="jumpToPage"
                placeholder="Page"
            />
            <button @click="jumpToPage" class="jump-btn">Jump</button>
        </div>
        
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

// 输入框的值
const pageInput = ref('')

// 分页控制参数
const maxPageBtns = 5       // 控制分页器最多显示多少个页码按钮
const maxVisiblePages = 3   // 控制当前页码前后最多显示多少个页码

// 跳转到指定页面
const jumpToPage = () => {
    const pageNum = parseInt(pageInput.value)
    
    if (pageNum && pageNum >= 1 && pageNum <= props.pagesNum) {
        const targetUrl = pageNum === 1 
            ? withBase(`/index.html`) 
            : withBase(`/page_${pageNum}.html`)
        
        window.location.href = targetUrl
    } else {
        // 无效输入
        pageInput.value = ''
    }
}

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
</script>

<style scoped>
.post-list {
    padding: 14px 0;
    border-bottom: 1px solid var(--vp-c-divider);
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
    color: var(--bt-theme-title);
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
    gap: 8px;
    font-size: 0.875rem;
    flex-shrink: 0;
}

.post-tags {
    display: flex;
    align-items: center;
    gap: 8px;
}

.post-tag,
.post-date {
    padding: 2px 8px;
    border-radius: 2px;
    background-color: var(--vp-c-bg-alt);
    color: var(--vp-c-text-1);
}

.post-tag {
    padding: 2px 8px;
    border-radius: 2px;
    background-color: var(--vp-c-bg-alt);
    color: var(--vp-c-text-1);
    text-decoration: none;
    transition: background-color 0.2s;
}

.post-tag:hover {
    color: var(--vp-c-text-3);
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
    border-radius: 50%;
    transition: all 0.2s;
    text-decoration: none;
    color: var(--vp-c-text-1);
}
.link:hover {
    /* border-color: var(--vp-c-text-1); */
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
}

.page-btn:hover:not(.disabled) {
    /* border-color: var(--vp-c-text-1); */
    color: var(--vp-c-text-1);
    text-decoration: none;
}

.page-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.page-jump {
    display: flex;
    margin: 0 4px;
    height: 32px;
}

.page-jump input {
    width: 50px;
    border: 1px var(--vp-c-divider) solid;
    border-radius: 4px 0 0 4px;
    text-align: center;
    outline: none;
    transition: all 0.2s;
    padding: 0 4px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
}

.page-jump input:focus {
    border-color: var(--vp-c-brand);
}

.jump-btn {
    padding: 0 8px;
    border: 1px var(--vp-c-divider) solid;
    border-left: none;
    border-radius: 0 4px 4px 0;
    background: var(--vp-c-bg-soft);
    cursor: pointer;
    transition: all 0.2s;
    color: var(--vp-c-text-1);
}

.jump-btn:hover {
    background: var(--vp-c-brand);
    border-color: var(--vp-c-brand);
    color: white;
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
        padding: 2px 4px;
        font-size: 0.75rem;
    }

    .hide-on-mobile {
        display: none;
    }

    .link, .page-btn {
        min-width: 28px;
        height: 28px;
    }
    
    .page-jump {
        height: 28px;
    }
    
    .page-jump input {
        width: 40px;
    }
    
    .jump-btn {
        padding: 0 4px;
        font-size: 0.75rem;
    }

    .more-tag {
        font-size: 0.75rem;
    }
}
</style>
