<template>
    <div class="finish-container">
        <Confetti ref="confettiRef" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Confetti from './confetti.vue'

const confettiRef = ref(null)
let hasTriggered = false

const checkScroll = () => {
    // 获取文档高度
    const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
    )
    
    // 获取视口高度
    const windowHeight = window.innerHeight
    
    // 获取滚动位置
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    // 判断是否接近底部（距离底部 100px 以内）
    if (documentHeight - (scrollTop + windowHeight) < 100 && !hasTriggered) {
        hasTriggered = true
        confettiRef.value?.triggerConfetti()
    }
}

onMounted(() => {
    window.addEventListener('scroll', checkScroll)
    // 初始检查一次
    checkScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.finish-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
}
</style>
