<template>
    <div v-for="(article, index) in posts" :key="index" class="post-list">
        <div class="post-header">
            <div class="post-title">
                <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
                <span v-if="article.frontMatter.sticky" class="sticky-tag">
                    <svg t="1744438112321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3461" width="18"><path d="M746.384 286.736 918.96 459.312C930.992 471.344 930.992 490.864 918.96 502.896 912.704 509.152 904.432 512 896.24 511.744 896.144 511.84 896.08 511.904 896 512L160 512 160 928C160 945.68 145.68 960 128 960 110.32 960 96 945.68 96 928L96 96C96 78.32 110.32 64 128 64L896 64C896.096 64.096 896.16 64.16 896.256 64.24 903.808 64.416 911.312 67.264 917.072 73.024 928.96 84.896 928.96 104.16 917.072 116.032L746.384 286.736ZM160 128 160 448 820.464 448 682.576 310.112C682.096 309.696 681.488 309.536 681.024 309.072 675.024 303.072 672.096 295.184 672.16 287.312 672.032 279.264 674.96 271.184 681.104 265.04 681.936 264.208 683.008 263.888 683.904 263.184L819.088 128 160 128Z" p-id="3462"></path></svg>
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
