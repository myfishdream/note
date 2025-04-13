<template>
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <div v-for="(article, index) in posts" :key="index" class="post-list">
        <div class="post-header">
            <div class="post-title">
                <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
                <span v-if="article.frontMatter.sticky" class="sticky-tag">
                    <svg t="1744438112321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3461" width="18"><path d="M746.384 286.736 918.96 459.312C930.992 471.344 930.992 490.864 918.96 502.896 912.704 509.152 904.432 512 896.24 511.744 896.144 511.84 896.08 511.904 896 512L160 512 160 928C160 945.68 145.68 960 128 960 110.32 960 96 945.68 96 928L96 96C96 78.32 110.32 64 128 64L896 64C896.096 64.096 896.16 64.16 896.256 64.24 903.808 64.416 911.312 67.264 917.072 73.024 928.96 84.896 928.96 104.16 917.072 116.032L746.384 286.736ZM160 128 160 448 820.464 448 682.576 310.112C682.096 309.696 681.488 309.536 681.024 309.072 675.024 303.072 672.096 295.184 672.16 287.312 672.032 279.264 674.96 271.184 681.104 265.04 681.936 264.208 683.008 263.888 683.904 263.184L819.088 128 160 128Z" p-id="3462"></path></svg>
                </span>
                <span v-if="article.frontMatter.done" class="sticky-tag">
                    <svg t="1744548242012" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21669" width="19" height="19"><path d="M841.6 169.6C752.64 80.64 634.24 32 508.8 32s-243.84 48.64-332.8 137.6C87.04 258.56 38.4 376.96 38.4 502.4c0 91.52 26.24 180.48 76.16 256.64 9.6 15.36 30.08 19.2 45.44 9.6 15.36-9.6 19.2-30.08 9.6-45.44-42.88-65.92-65.28-142.08-65.28-220.8 0-223.36 181.76-405.12 405.12-405.12s405.12 181.76 405.12 405.12-181.76 405.12-405.12 405.12c-74.24 0-146.56-19.84-209.28-58.24-15.36-9.6-35.84-4.48-44.8 10.88-9.6 15.36-4.48 35.84 10.88 44.8 72.96 44.16 157.44 67.84 243.2 67.84 125.44 0 243.84-48.64 332.8-137.6 88.96-88.96 137.6-206.72 137.6-332.8-0.64-125.44-49.28-243.84-138.24-332.8z m-332.8 397.44c10.88 0 21.12-3.84 29.44-12.16l152.32-165.12c16-16 16-42.24 0-58.88-16-16-42.24-16-58.88 0L508.8 467.2 382.08 340.48c-16-16-42.24-16-58.88 0-16 16-16 42.24 0 58.88L480 554.88c7.68 8.32 18.56 12.16 28.8 12.16z" fill="#E55D5D" p-id="21670"></path><path d="M691.84 630.4L536.32 472.96c-8.32-8.32-18.56-12.16-29.44-12.16-10.88 0-21.12 3.84-29.44 12.16l-151.68 166.4c-16 16-16 42.88 0 58.88 16 16 42.24 16 58.24 0l122.88-136.96 126.72 128c16 16 42.24 16 58.24 0s16-42.88 0-58.88z" fill="#E55D5D" p-id="21671"></path></svg>
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
}
</style>
