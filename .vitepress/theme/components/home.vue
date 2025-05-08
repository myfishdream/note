<template>
  <div class="home-intro">
    <div class="avatar-box">
      <img class="avatar" src="/favicon.ico" alt="avatar" no-zoomable />
    </div>
    <div class="intro-main">
      <div class="intro-title">
        <span class="emoji">(•_•)</span>
        <span class="nickname">你好</span>
        <span class="identity">学生 · Student · Developer</span>
      </div>
      <div class="intro-desc">
        欢迎来到 <span class="highlight">YuMeng</span> 的个人空间！这里是我分享技术见解、生活感悟和创作灵感的天地。你可以探索我的 
        <span class="link">技术博客</span>，欣赏我的 <span class="link">摄影作品</span>，或者了解我的 <span class="link">开发工具</span>。
        期待与你在这里相遇，一起交流成长。
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // 头像旋转
  const heroImg = document.querySelector('.avatar')
  let rotationAngle = 0
  let rotationSpeed = 0
  let isHovering = false
  let lastTimestamp = 0
  let animationFrameId = null

  function updateRotation(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp
    const deltaTime = timestamp - lastTimestamp
    lastTimestamp = timestamp

    if (isHovering) {
      // 鼠标悬浮时，速度逐渐增加
      rotationSpeed = Math.min(rotationSpeed + 0.01, 1.5) // 限制最大速度
    } else {
      // 鼠标离开时，速度逐渐减小
      rotationSpeed = Math.max(rotationSpeed - 0.01, 0)
    }

    if (rotationSpeed > 0) {
      rotationAngle += rotationSpeed * deltaTime
      heroImg.style.transform = `rotate(${rotationAngle}deg)`
      animationFrameId = requestAnimationFrame(updateRotation)
    } else {
      lastTimestamp = 0
      animationFrameId = null
    }
  }

  function onEnter() {
    isHovering = true
    if (!animationFrameId) {
      lastTimestamp = 0
      animationFrameId = requestAnimationFrame(updateRotation)
    }
  }
  function onLeave() {
    isHovering = false
  }

  heroImg.addEventListener('mouseenter', onEnter)
  heroImg.addEventListener('mouseleave', onLeave)

  onUnmounted(() => {
    heroImg.removeEventListener('mouseenter', onEnter)
    heroImg.removeEventListener('mouseleave', onLeave)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })
})
</script>

<style scoped>
.home-intro {
  display: flex;
  align-items: flex-start;
  margin: 2.5rem 0 2rem 0;
}
.avatar-box {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  margin-right: 2rem;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  image-rendering: pixelated;
}
.intro-main {
  flex: 1;
  min-width: 0;
}
.intro-title {
  display: flex;
  align-items: center;
  gap: 0.7em;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.emoji {
  font-size: 2.1rem;
  margin-right: 0.1em;
}
.nickname {
  color: var(--vp-c-text-1);
  font-weight: normal;
}
.identity {
  font-size: 1rem;
  font-weight: normal;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  padding: 0.1em 0.7em;
  margin-left: 0.7em;
  letter-spacing: 0.05em;
}
.intro-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  line-height: 2;
  margin-top: 0.5em;
  word-break: break-all;
  padding-right: 0.5em;
}
.highlight {
  color: var(--vp-c-brand);
}
.link {
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline
}
.link:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}
@media (max-width: 600px) {
  .home-intro {
    flex-direction: column;
    align-items: flex-start;
    margin: 1.5rem 0 1rem 0;
    padding: 0 1rem;
  }
  .avatar-box {
    margin-right: 0;
    margin-bottom: 1.2rem;
    width: 64px;
    height: 64px;
  }
  .avatar {
    width: 48px;
    height: 48px;
  }
  .intro-title {
    font-size: 1.2rem;
    margin-bottom: 0.3em;
  }
  .emoji {
    font-size: 1.3rem;
  }
  .identity {
    font-size: 0.9rem;
    padding: 0.1em 0.5em;
    margin-left: 0.5em;
  }
  .intro-desc {
    font-size: 0.95rem;
    margin-top: 0.3em;
    padding-right: 0;
  }
  .avatar-box {
    display: none;
  }
}
</style>

