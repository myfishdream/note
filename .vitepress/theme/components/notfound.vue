<template>
    <div class="terminal-container">
        <div class="terminal-content">
            <div class="terminal-text">
                <div class="terminal-line" ref="line1">
                    <span class="prompt">&gt;</span> <span class="typing-text" ref="typingText1"></span>
                </div>
                <div class="terminal-line" ref="line2">
                    <span class="prompt"></span> <span class="typing-text" ref="typingText2"></span>
                </div>
                <div class="terminal-line" ref="line3">
                    <span class="prompt"></span> <span class="typing-text" ref="typingText3"></span>
                </div>
                <div class="terminal-line terminal-empty-line"></div>
                <div class="terminal-line terminal-nav" ref="navLine">
                    <a :href="withBase('/')" class="terminal-link">
                        <span class="terminal-icon">⌂</span> HOME
                    </a>
                    <a :href="'mailto:' + emailAddress" class="terminal-link">
                        <span class="terminal-icon">✉</span> WRITE TO ME
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { withBase, useData } from 'vitepress';

// 获取主题相关数据
const { isDark } = useData();

// 您可以在这里设置您的邮箱
const emailAddress = 'yumengjh@outlook.com';

// 打字效果相关变量
const typingText1 = ref(null);
const typingText2 = ref(null);
const typingText3 = ref(null);
const navLine = ref(null);

// 要显示的文本
const text1 = 'Oops, ERROR 404 NOT FOUND...';
const text2 = 'You may have mis-typed the URL.';
const text3 = 'Or \'/e has been remo/';

// 打字效果函数
const typeEffect = (element, text, speed, delay = 0, onComplete = null) => {
    return new Promise(resolve => {
        setTimeout(() => {
            let i = 0;
            element.textContent = '';
            const typing = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    if (onComplete) onComplete();
                    resolve();
                }
            }, speed);
        }, delay);
    });
};

// 添加光标闪烁
const addCursorBlink = (element) => {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
};

// 顺序执行打字效果
onMounted(async () => {
    // 先隐藏导航行
    if (navLine.value) navLine.value.style.opacity = '0';
    
    // 第一行打字效果
    await typeEffect(typingText1.value, text1, 50);
    
    // 第二行打字效果
    await typeEffect(typingText2.value, text2, 50, 300);
    
    // 第三行打字效果
    await typeEffect(typingText3.value, text3, 50, 300);
    
    // 显示导航行
    setTimeout(() => {
        if (navLine.value) {
            navLine.value.style.opacity = '1';
            navLine.value.style.transform = 'translateY(0)';
        }
        
        // 在最后一行添加闪烁光标
        addCursorBlink(typingText3.value);
    }, 500);
});
</script>

<style scoped>
.terminal-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background-color: var(--vp-c-bg);
    color: var(--vp-c-brand);
    font-family: "Courier New", monospace;
    padding: 2rem;
    box-sizing: border-box;
    text-shadow: 0 0 5px var(--vp-c-brand-lighter, rgba(0, 170, 102, 0.3));
    position: relative;
    overflow: hidden;
}

/* 添加网格背景 */
.terminal-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
        linear-gradient(rgba(var(--terminal-grid-color, 30, 30, 30), 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--terminal-grid-color, 30, 30, 30), 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 0;
    pointer-events: none;
}

.terminal-content {
    max-width: 700px;
    width: 100%;
    position: relative;
    z-index: 1;
    background-color: var(--vp-c-bg-alt, rgba(30, 33, 38, 0.8));
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--vp-c-divider);
}

.terminal-text {
    position: relative;
}

.terminal-line {
    margin-bottom: 1.2rem;
    line-height: 1.5;
    font-size: 1.2rem;
}

.terminal-empty-line {
    height: 1.8rem;
}

.prompt {
    color: var(--vp-c-brand);
    margin-right: 0.5rem;
}

.typing-text {
    color: var(--vp-c-brand);
    position: relative;
}

.cursor {
    display: inline-block;
    width: 0.8rem;
    height: 1.2rem;
    background-color: var(--vp-c-brand);
    margin-left: 0.2rem;
    vertical-align: middle;
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

.terminal-nav {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.5s, transform 0.5s;
}

.terminal-link {
    color: var(--vp-c-brand);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
}

.terminal-link:hover {
    text-shadow: 0 0 10px var(--vp-c-brand-lighter, rgba(0, 170, 102, 0.5));
    opacity: 1;
    background-color: var(--vp-c-bg-mute);
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.terminal-icon {
    font-size: 1.2rem;
}

@media (max-width: 600px) {
    .terminal-content {
        padding: 1.5rem;
    }
    
    .terminal-line {
        font-size: 1rem;
    }
    
    .terminal-nav {
        flex-direction: column;
        gap: 1rem;
    }
}

:root {
    --terminal-grid-color: 30, 30, 30;
}

.dark {
    --terminal-grid-color: 200, 200, 200;
}
</style>
