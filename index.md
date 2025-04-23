---
page: true
title: 首页
aside: false
lastUpdated: false
comments: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(0,10)
</script>
<Page :posts="posts" :pageCurrent="1" :pagesNum="3" />