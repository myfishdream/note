<template>
  <div class="home-container">
    <div class="head">
      <h1 class="title">Blog</h1>
      <span class="btn">
        <button @click="navigateToFirstPage('/page_1')">
          Read More
        </button>
        &nbsp;
        <!-- <button @click="navigateToFirstPage('/changelog')">
          Change log
        </button> -->
      </span>
    </div>
    <div class="introduce">
      <p style="font-size: 2rem;">
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
    </div>
    <div class="post">
      <p style="font-size: 1.2rem;">My most recent posts</p>
      <ul v-if="theme.posts && theme.posts.length">
        <li v-for="(post, index) in theme.posts.slice(0, 5)" :key="index" style="margin-bottom: 0.3em;">
          <a :href="withBase(post.regularPath)">{{ post.frontMatter.title }}</a>
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
import { useData, useRouter, withBase } from "vitepress";
import { toolsdata } from "../../tools-data";
const { theme } = useData();
const router = useRouter();

function navigateToFirstPage(url) {
  router.go(url);
}
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
.head{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  /* margin-top: 10px; */
  font-size: 1.5rem;
  font-weight: bold !important;
  font-family: Verdana, sans-serif;
  color: var(--vp-c-text-1);
}

button {
  font-size: 18px;
  color: var(--vp-c-text-2);
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  border: none;
  background: none;
  /* text-transform: uppercase; */
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 400ms;
  transition-property: color;
}

button:focus,
button:hover {
  color: var(--vp-c-text-1);
}

button:focus:after,
button:hover:after {
  width: 100%;
  left: 0%;
}

button:after {
  content: "";
  pointer-events: none;
  bottom: -2px;
  left: 50%;
  position: absolute;
  width: 0%;
  height: 2px;
  background-color: var(--vp-c-text-1);
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 400ms;
  transition-property: width, left;
}
</style>