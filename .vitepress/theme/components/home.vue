<template>
    <h1 class="title" v-slide-up="{ delay: 0 }">YuMeng's Blog</h1>
    <p v-slide-up="{ delay: 100 }">
        Articles, Tutorials & Understand from the author of YuMeng.
    </p>
    <button @click="navigateToFirstPage('/page_1')" v-slide-up="{ delay: 200 }">
      Read More
  </button>
  &nbsp;
  <button @click="navigateToFirstPage('/changelog')" v-slide-up="{ delay: 200 }">
     Change log
  </button>
  <img no-zoomable style="width: 300px; margin-top: 20px;" src="https://s21.ax1x.com/2025/04/26/pETFnbj.webp" alt="" v-slide-up="{ delay: 300 }">
</template>
<script setup>
import { useData, useRouter } from "vitepress";
const { theme } = useData();
const router = useRouter();

function navigateToFirstPage(url) {
  router.go(url);
}


</script>

<style scoped>
.title {
    /* margin-top: 10px; */
    /* font-size: 50px; */
    /* font-weight: bold !important; */
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