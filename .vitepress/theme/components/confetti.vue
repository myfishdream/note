<template>
    <div class="confetti-container">
        <canvas ref="confettiCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import JSConfetti from 'js-confetti'

const confettiCanvas = ref(null)
let jsConfetti = null

// 暴露给外部的触发函数
const triggerConfetti = () => {
    if (jsConfetti) {
        jsConfetti.addConfetti({
            confettiColors: [
                '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                '#ff8000', '#8000ff', '#00ff80', '#ff0080', '#80ff00', '#0080ff'
            ],
            // confettiRadius: 5,
            // confettiNumber: 500,    // 彩带数量
        })
    }
}

onMounted(() => {
    // 初始化 confetti
    jsConfetti = new JSConfetti({ canvas: confettiCanvas.value })
})

// 暴露函数给外部使用
defineExpose({
    triggerConfetti
})
</script>

<style scoped>
.confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
}

.confetti-container canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>