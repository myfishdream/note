<template>
    <div v-for="(article, index) in posts" :key="index" class="post-list">
        <div class="post-header">
            <div class="post-title">
                <a class="post-title-link" :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
                <span v-if="article.frontMatter.sticky" class="sticky-tag">
                    <!-- 此处可以添加置顶图标 -->
                    <!-- 💡 -->
                </span>
                <span v-if="article.frontMatter.done" class="sticky-tag">
                    <!-- 未完成图标 -->
                    <!-- <svg t="1745112021376" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17279" width="17" ><path d="M512 19.692308C240.246154 19.692308 19.692308 240.246154 19.692308 512S240.246154 1004.307692 512 1004.307692 1004.307692 783.753846 1004.307692 512 783.753846 19.692308 512 19.692308z m0 35.446154c252.061538 0 456.861538 204.8 456.861538 456.861538S764.061538 968.861538 512 968.861538 55.138462 764.061538 55.138462 512 259.938462 55.138462 512 55.138462z" p-id="17280"></path></svg> -->
                </span>
            </div>
        </div>
        <p class="describe" v-html="article.frontMatter.description"></p>
        <div class='post-info'>
            {{ article.frontMatter.date }} <span v-for="item in article.frontMatter.tags"><a class="post-tag-link" :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span>
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
import { ref, computed } from 'vue'

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
</script>

<style scoped>
.post-list {
    /* border-bottom: 1px solid var(--vp-c-divider); */
    padding: 14px 0 14px 0;
}
.post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.post-title {
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--bt-theme-title)!important;
    margin: 0.1rem 0;
    
}
.post-title-link{
    color: var(--bt-theme-title)!important;
    text-decoration: none;
}
.post-tag-link{
    color: var(--vp-c-text-1)!important;
    text-decoration: none;
}
.post-tag-link:hover{
    color: var(--vp-c-text-3)!important;
    text-decoration: none;
}

.describe {
    font-size: 0.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    color: var(--vp-c-text-2);
    margin: 10px 0;
    line-height: 1.5rem;
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

.sticky-tag {
    display: inline-block;
    margin-left: 8px;
    fill: var(--vp-c-brand);
    transform: translateY(2px);
}

@media screen and (max-width: 768px) {
    .post-list {
        padding: 14px 0 14px 0;
    }
    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .post-title {
        font-size: 1.0625rem;
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        width: 17rem;
    }
    .describe {
        font-size: 0.9375rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        margin: 0.5rem 0 1rem;
    }
    
    /* 移动端适配 */
    /* .pagination {
        gap: 2px;
    } */
    
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
}
</style>
