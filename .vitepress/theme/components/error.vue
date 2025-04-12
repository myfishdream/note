<template>
    <div class="error-container">
        <h1 class="error-code">404</h1>
        <p class="error-text">PAGE NOT FOUND</p>
        <div class="error-image">
            <a href="/">
                <img src="/images/404.png" alt="无法访问" class="plug-image">
            </a>
        </div>
    </div>
</template>

<style scoped>
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
    font-family: "Share Tech Mono", monospace;
}

.error-code {
    font-size: 5rem;
    font-weight: 300;
    color: var(--vp-c-text-1);
    margin: 0;
    line-height: 1.2;
}

.error-text {
    font-size: 20px;
    color: var(--vp-c-text-2);
    margin-top: 20px;
}

.error-image {
    width: 300px;
    position: relative;
}


</style>
