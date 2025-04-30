@ -1,118 +0,0 @@
<template>
  <button
    class="VPSwitchAppearance"
    title="切换浅色/深色模式"
    @click="toggle"
  >
    <div class="sun">
      <div class="icon">🌞</div>
    </div>
    <div class="moon">
      <div class="icon">🌙</div>
    </div>
  </button>
</template>

<script setup>
import { useData } from 'vitepress'
import { inject } from 'vue'

const { isDark } = useData()

// 尝试注入自定义切换函数，如果没有则使用默认切换方式
const toggleAppearance = inject('toggle-appearance', (e) => {
  isDark.value = !isDark.value
})

function toggle(e) {
  toggleAppearance(e)
}
</script>

<style>
.VPSwitchAppearance {
  border: 0;
  padding: 0;
  width: 32px;
  height: 32px;
  background-color: transparent;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background-color 0.25s;
  vertical-align: middle;
  margin-top: 0;
  margin-bottom: 0;
}

.VPSwitchAppearance:hover {
  /* background-color: var(--vp-c-gray-soft); */
}

.VPSwitchAppearance .sun, 
.VPSwitchAppearance .moon {
  position: absolute;
  width: 18px;
  height: 18px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.25s, transform 0.25s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.VPSwitchAppearance .sun {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.VPSwitchAppearance .moon {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.66);
}

.dark .VPSwitchAppearance .sun {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.66);
}

.dark .VPSwitchAppearance .moon {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* 添加动画效果 */
.VPSwitchAppearance .icon {
  font-size: 18px;
  transition: transform 0.3s ease;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.VPSwitchAppearance:hover .icon {
  transform: rotate(30deg);
}

/* 确保在导航栏中垂直居中 */
.VPNavBarHamburger + .VPSwitchAppearance,
.VPNavBarSearch + .VPSwitchAppearance,
.VPNavBarExtra + .VPSwitchAppearance {
  margin-left: 8px;
  transform: translateY(0);
}

/* 修复在移动设备上的位置 */
@media (max-width: 768px) {
  .VPSwitchAppearance {
    height: 36px;
  }
}
</style>