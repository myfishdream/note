---
page: true
title: Yumo
aside: false
lastUpdated: false
comments: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(0,14)
</script>
<Page :posts="posts" :pageCurrent="1" :pagesNum="2" />