<template>
  <div class="home-container">
    <div class="introduce">
      <p style="font-size: 2rem; margin-top: 0">
        Hi, I'm YuMeng.
      </p>
      <p style="font-size: 1.2rem;">
        I'm a Student from China. My hobby is to learn new things.
      </p>
      <p style="font-size: 1rem; font-weight: normal;">
        Currently living in <a href="https://s21.ax1x.com/2025/04/26/pETA0gK.webp" target="_blank">Zhuhai</a> — possibly the most
        comfortable city in the world.
      </p>
      <p style="font-size: 1rem; font-weight: normal;">
        I write some articles about my learning and life.
      </p>
      <p style="font-size: 1rem; font-weight: normal;">
        I hope you like my articles.
      </p>
      <p style="font-size: 1rem; font-weight: normal;"> 
        My email: <a href="mailto:yumengjh@outlook.com">yumengjh@outlook.com</a>.
      </p>
    </div>
    <div class="post">
      <p style="font-size: 1.2rem;">My most recent posts</p>
      <ul v-if="theme.posts && theme.posts.length">
        <li v-for="(post, index) in theme.posts.slice(0, 5)" :key="index" style="margin-bottom: 0.3em;">
          <a :href="withBase(post.regularPath)">{{ post.frontMatter.title }}</a>
        </li>
        <li>
          <a href="/page_1">Read More</a>
        </li>
      </ul>
      
      <p style="font-size: 1.2rem;">Visit the website often</p>
      <ul>
        <li v-for="(item, index) in toolsdata[0].items" :key="index" style="margin-bottom: 0.3em;">
          <a :href="item.link" target="_blank">{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useData, withBase } from "vitepress";
import { toolsdata } from "../../tools-data";
const { theme } = useData();
</script>

<style scoped>
.post {
  font-family: Verdana, sans-serif;
  font-weight: bold;
}

.introduce p {
  font-family: Verdana, sans-serif;
  font-weight: bold;
}
</style>