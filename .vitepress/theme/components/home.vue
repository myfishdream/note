<template>
    <h1 class="title">YuMeng's Point</h1>
    <p>
        Articles, Tutorials & Understand from the author of YuMeng.
    </p>
    <button @click="navigateToFirstPage">
      Read More
  </button>
  
</template>
<script setup>
import { useData, useRouter } from "vitepress";
const { theme } = useData();
const router = useRouter();

function navigateToFirstPage() {
  router.go('/page_1');
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