<template>
  <div class="head">
    <h1 class="title" v-slide-up="{ delay: 0 }">Blog</h1>
    <span class="btn">
      <button @click="navigateToFirstPage('/page_1')" v-slide-up="{ delay: 0 }">
        Read More
      </button>
      &nbsp;
      <button @click="navigateToFirstPage('/changelog')" v-slide-up="{ delay: 0 }">
        Change log
      </button>
      &nbsp;
      <button @click="toggleNavbar" v-slide-up="{ delay: 0 }">
        {{ isNavVisible ? 'Hide Menu' : 'Show Menu' }}
      </button>
    </span>
  </div>
  <p v-slide-up="{ delay: 100 }" style="border-bottom: 1px solid var(--vp-c-divider);">

  </p>
  <div class="introduce">
    <p v-slide-up="{ delay: 200 }" style="font-size: 2rem;">
      Hi, I'm YuMeng.
    </p>
    <p v-slide-up="{ delay: 300 }" style="font-size: 1.2rem;">
      I'm a Student from China. My hobby is to learn new things.
    </p>
    <p v-slide-up="{ delay: 400 }" style="font-size: 1rem; font-weight: normal;">
      Currently living in <a href="https://s21.ax1x.com/2025/04/26/pETA0gK.webp">Zhuhai</a> — possibly the most
      comfortable city in the world.
    </p>
    <p v-slide-up="{ delay: 500 }" style="font-size: 1rem; font-weight: normal;">
      I write some articles about my learning and life.
    </p>
    <p v-slide-up="{ delay: 600 }" style="font-size: 1rem; font-weight: normal;">
      I hope you like my articles.
    </p>
  </div>



</template>
<script setup>
import { useData, useRouter, withBase } from "vitepress";
import { toolsdata } from "../../tools-data";
import { ref, onMounted, onUnmounted, watch } from "vue";

const { theme } = useData();
const router = useRouter();

// 导航栏状态管理
const isNavVisible = ref(false);
const isClient = typeof window !== 'undefined';

function navigateToFirstPage(url) {
  router.go(url);
}

// 切换导航栏显示/隐藏
function toggleNavbar() {
  isNavVisible.value = !isNavVisible.value;
  updateNavbarVisibility();
}

// 更新导航栏可见性
function updateNavbarVisibility() {
  if (!isClient) return;
  const content = document.querySelector('.VPContent');
  const nav = document.querySelector('.VPNav');
  if (!nav) return;
  content.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  if (isNavVisible.value) {
    // 显示导航栏
    nav.classList.remove('nav-hidden');
    nav.classList.add('nav-visible');
    // 添加transform: translateY(0);
    content.style.transform = 'translateY(0)';
  } else {
    // 隐藏导航栏
    nav.classList.add('nav-hidden');
    nav.classList.remove('nav-visible');
    // 添加transform: translateY(-60px);
    content.style.transform = 'translateY(-60px)';
  }
}

// 恢复导航栏显示状态
function showNavBar() {
  if (!isClient) return;
  
  isNavVisible.value = true;
  const nav = document.querySelector('.VPNav');
  if (nav) {
    nav.classList.remove('nav-hidden');
    nav.classList.add('nav-visible');
  }
}

onMounted(() => {
  if (!isClient) return;
  
  // 添加样式到文档头部
  const style = document.createElement('style');
  style.textContent = `
    .VPNav {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .VPNav.nav-hidden {
      transform: translateY(-100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .VPNav.nav-visible {
      transform: translateY(0);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
  
  // 初始显示导航栏
  setTimeout(() => {
    updateNavbarVisibility();
  }, 100);
});

onUnmounted(() => {
  if (!isClient) return;
  
  // 确保组件卸载时恢复导航栏状态
  showNavBar();
});
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

/* 移动端适配 */
@media (max-width: 768px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn {
    margin-top: 1rem;
  }
}
</style>