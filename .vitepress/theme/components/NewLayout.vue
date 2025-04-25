<template>
    <Layout>
        <template #doc-before>
            <div style="padding-top:20px;" class='post-info' v-if="!$frontmatter.page">
                {{ $frontmatter.date?.substring(0,10) }} &nbsp;&nbsp; <span v-for="item in $frontmatter.tags"><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span>
            </div>
        </template>
        <template #nav-bar-content-after>
            <ClientOnly>
                <Lantern /> <!-- 灯笼组件 -->
            </ClientOnly>
        </template>
        <template #doc-footer-before>
            <!-- <Giscus /> -->
        </template>
    </Layout>
    <Copyright />
</template>
<script setup>
import Lantern from './Lantern.vue'
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'
// import Giscus from './giscus.vue'
import { withBase } from "vitepress";
const { Layout } = DefaultTheme
</script>
