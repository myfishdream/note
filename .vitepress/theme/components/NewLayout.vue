<template>
    <Layout>
        <template #doc-before>
            <div style="padding-top:20px;" class='post-info' v-if="!$frontmatter.page">
                {{ $frontmatter.date?.substring(0,10) }} &nbsp;&nbsp; <span v-for="item in $frontmatter.tags"><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span>
            </div>
        </template>
        <template #doc-footer-before>
            <!-- <Giscus /> -->
        </template>
        <template #not-found>
            <!-- 页面不存在 -->
            <div class="page404">
                <Error />
            </div>
        </template>
    </Layout>
    <Copyright />
</template>
<script setup>
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'
import Error from './error.vue'
// import Giscus from './giscus.vue'
import { withBase } from "vitepress";
const { Layout } = DefaultTheme
</script>
