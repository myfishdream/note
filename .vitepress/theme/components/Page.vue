<template>
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <div v-for="(article, index) in posts" :key="index" class="post-list">
        <div class="post-header">
            <div class="post-title">
                <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
                <span v-if="article.frontMatter.sticky" class="sticky-tag">
                    <!-- 此处可以添加置顶图标 -->
                    <!-- 💡 -->
                </span>
                <span v-if="article.frontMatter.done" class="sticky-tag">
                    <!-- 未完成图标 -->
                    🔨
                </span>
            </div>
        </div>
        <p class="describe" v-html="article.frontMatter.description"></p>
        <div class='post-info'>
            {{ article.frontMatter.date }} <span v-for="item in article.frontMatter.tags"><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span>
        </div>
    </div>

    <div class="pagination">
        <a
            class="link"
            :class="{ active: pageCurrent === i }"
            v-for="i in pagesNum"
            :key="i"
            :href="withBase(i === 1 ? '/index.html' : `/page_${i}.html`)"
        >{{ i }}</a>
    </div>
</template>

<script setup>

import { withBase } from 'vitepress'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vitepress'

const progress = ref(0)
const router = useRouter()
let timer = null

const startProgress = () => {
    progress.value = 0
    timer = setInterval(() => {
        if (progress.value < 90) {
            progress.value += Math.random() * 10
        }
    }, 100)
}

const completeProgress = () => {
    progress.value = 100
    setTimeout(() => {
        progress.value = 0
    }, 200)
}

onMounted(() => {
    router.onBeforeRouteChange = () => {
        startProgress()
    }
    router.onAfterRouteChanged = () => {
        completeProgress()
    }
})

onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer)
    }
})

defineProps({
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
</script>

<style scoped>
.progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: var(--vp-c-brand);
    z-index: 9999;
    transition: width 0.2s ease-out;
}
.post-list {
    /* border-bottom: 1px dashed var(--vp-c-divider); */
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
.post-title a{
    color: var(--bt-theme-title)!important;
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
}
.link {
    display: inline-block;
    width: 26px;
    text-align: center;
    border: 1px var(--vp-c-divider) solid;
    border-right: none;
    font-weight: 400;
    border-radius: 20px;
    margin: 0 4px;
}
.link.active {
    background: var(--vp-c-text-1);
    color: var(--vp-c-neutral-inverse);
    border: 1px solid var(--vp-c-text-1) !important;
}

.sticky-tag {
    display: inline-block;
    margin-left: 8px;
    fill: var(--vp-c-brand);
    /* transform: translateY(2px); */
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
}
</style>
