/**
 * 平滑上移过渡指令
 * 
 * 使用方法:
 * v-slide-up="{ delay: 200, duration: 800, distance: '30px' }"
 * 
 * 参数说明:
 * - delay: 延迟时间(毫秒)，默认为0
 * - duration: 动画持续时间(毫秒)，默认为800
 * - distance: 上移距离，默认为'30px'
 * - once: 是否只执行一次，默认为true
 * - threshold: 触发阈值(0-1)，默认为0.2，表示元素20%可见时触发
 */

// 为元素分配唯一ID，用于跟踪状态
let uniqueId = 0;
function getUniqueId() {
  return `slide-el-${uniqueId++}`;
}

// 判断元素是否在视口中
function isElementInViewport(el, threshold = 0.2) {
  if (!el) return false;
  
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // 元素顶部位置相对于视口底部的比例
  const visibleRatio = 1 - Math.max(0, (rect.bottom < 0 ? 1 : rect.top > windowHeight ? 1 : 
                        (rect.top < 0 ? 0 : rect.top / windowHeight)));
  
  return visibleRatio > threshold;
}

// 强制应用动画样式 - 不检查视口位置，直接执行动画
function forceApplyAnimation(el, options) {
  if (!el.isConnected) return; // 元素不在DOM中则返回
  if (el.dataset.slideComplete === 'true') return; // 已完成动画则返回
  
  const { delay, duration, distance } = options;
  
  // 设置初始样式
  el.style.opacity = '0';
  el.style.transform = `translateY(${distance})`;
  el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
  el.style.transitionDelay = `${delay}ms`;
  
  // 标记元素为准备就绪状态
  el.dataset.slideReady = 'true';
  
  // 使用RAF确保样式先被应用
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (el.isConnected) { // 确保元素仍在DOM中
        // 应用动画
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.dataset.slideComplete = 'true'; // 标记完成
      }
    });
  });
}

// 正常应用动画样式 - 基于视口位置
function applyAnimation(el, options) {
  const { delay, duration, distance } = options;
  
  // 设置初始样式
  el.style.opacity = '0';
  el.style.transform = `translateY(${distance})`;
  el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
  el.style.transitionDelay = `${delay}ms`;
  
  // 标记元素为准备就绪状态
  el.dataset.slideReady = 'true';
  
  // 使用RAF确保样式先被应用
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (el.isConnected) { // 确保元素仍在DOM中
        // 应用动画
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.dataset.slideComplete = 'true'; // 标记完成
      }
    });
  });
}

// 存储所有应用了v-slide-up指令的元素
const slideElements = new Map();

// 处理所有元素的滚动检查
function checkAllElements() {
  slideElements.forEach((data, id) => {
    const { el, options } = data;
    
    // 如果元素已经动画过且设置为只执行一次，则跳过
    if (el.dataset.slideComplete === 'true' && options.once) return;
    
    // 检查元素是否在视口中
    if (isElementInViewport(el, options.threshold)) {
      // 应用动画
      applyAnimation(el, options);
      // 标记动画完成
      el.dataset.slideComplete = 'true';
      
      // 如果只执行一次，从集合中移除
      if (options.once) {
        slideElements.delete(id);
      }
    }
  });
}

// 强制触发所有元素的动画
function forceAllAnimations() {
  slideElements.forEach((data, id) => {
    const { el, options } = data;
    
    // 如果元素已经动画过且设置为只执行一次，则跳过
    if (el.dataset.slideComplete === 'true' && options.once) return;
    
    // 不检查视口位置，直接触发动画
    forceApplyAnimation(el, options);
    
    // 如果只执行一次，从集合中移除
    if (options.once) {
      slideElements.delete(id);
    }
  });
}

// 创建指令
export const vSlideUp = {
  mounted(el, binding) {
    // 分配唯一ID
    const id = getUniqueId();
    el.dataset.slideId = id;
    
    // 合并默认选项与传入选项
    const options = Object.assign({
      delay: 0,
      duration: 800,
      distance: '30px',
      once: true,
      threshold: 0.2
    }, binding.value || {});
    
    // 存储选项
    el._slideOptions = options;
    
    // 初始样式 - 但不要开始过渡
    el.style.opacity = '0';
    el.style.transform = `translateY(${options.distance})`;
    
    // 创建滚动处理函数
    const handleScroll = () => {
      // 如果元素已经动画过且设置为只执行一次，则返回
      if (el.dataset.slideComplete === 'true' && options.once) return;
      
      // 检查元素是否在视口中
      if (isElementInViewport(el, options.threshold)) {
        // 应用动画
        applyAnimation(el, options);
        // 标记动画完成
        el.dataset.slideComplete = 'true';
        
        // 如果只执行一次，移除滚动监听
        if (options.once) {
          window.removeEventListener('scroll', el._scrollHandler);
        }
      }
    };
    
    // 保存滚动处理函数引用以便后续清理
    el._scrollHandler = handleScroll;
    
    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 将元素添加到集合中
    slideElements.set(id, { el, options });
  },
  
  // 元素更新时重新检查
  updated(el, binding) {
    // 获取元素ID
    const id = el.dataset.slideId;
    
    // 更新选项
    const oldOptions = el._slideOptions || {};
    const newOptions = Object.assign({}, oldOptions, binding.value || {});
    el._slideOptions = newOptions;
    
    // 如果元素已经动画过且设置为只执行一次，则返回
    if (el.dataset.slideComplete === 'true' && newOptions.once) return;
    
    // 更新集合中的选项
    if (slideElements.has(id)) {
      const data = slideElements.get(id);
      data.options = newOptions;
      slideElements.set(id, data);
    }
    
    // 检查是否需要应用动画
    if (isElementInViewport(el, newOptions.threshold)) {
      applyAnimation(el, newOptions);
      el.dataset.slideComplete = 'true';
    }
  },
  
  // 组件卸载时清理
  unmounted(el) {
    if (el._scrollHandler) {
      window.removeEventListener('scroll', el._scrollHandler);
    }
    
    // 从集合中移除元素
    const id = el.dataset.slideId;
    if (id && slideElements.has(id)) {
      slideElements.delete(id);
    }
  }
};

// 初始化计时器ID
let initialCheckTimer = null;
let forcedCheckCount = 0;
const MAX_FORCED_CHECKS = 5; // 最大强制检查次数

// 在页面加载后触发多次检查和一次强制触发
function setupInitialChecks() {
  // 清除任何已存在的计时器
  if (initialCheckTimer) {
    clearInterval(initialCheckTimer);
  }
  
  // 重置强制检查计数
  forcedCheckCount = 0;
  
  // 强制立即执行一次检查
  checkAllElements();
  
  // 然后设置一个轮询检查，确保后续加载的元素也能正确触发
  initialCheckTimer = setInterval(() => {
    checkAllElements();
    
    // 增加强制检查计数
    forcedCheckCount++;
    
    // 在最后一次检查时，强制触发所有元素动画
    if (forcedCheckCount >= MAX_FORCED_CHECKS) {
      forceAllAnimations(); // 强制触发所有元素的动画
      clearInterval(initialCheckTimer);
      initialCheckTimer = null;
    }
  }, 300); // 每300ms检查一次，总共检查5次
}

// 为VitePress特定事件绑定检查函数
if (typeof window !== 'undefined') {
  // 页面内容加载完成
  window.addEventListener('DOMContentLoaded', () => {
    setupInitialChecks();
  });
  
  // 页面完全加载后
  window.addEventListener('load', () => {
    // 延迟执行，确保Vue组件已经渲染
    setTimeout(() => {
      checkAllElements();
      // 2秒后强制触发所有元素
      setTimeout(forceAllAnimations, 2000);
    }, 100);
  });
  
  // 监听DOM变化
  const observer = new MutationObserver((mutations) => {
    // 只在有节点添加时进行检查
    if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
      setTimeout(checkAllElements, 50);
    }
  });
  
  // 当DOM准备好时开始观察
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // VitePress路由变化后重新检查
  if (typeof document !== 'undefined') {
    // VitePress特有的页面加载事件
    document.addEventListener('vitepress:page-loaded', () => {
      setupInitialChecks();
    });
    
    // 监听hash变化，因为VitePress可能使用hash路由
    window.addEventListener('hashchange', () => {
      setupInitialChecks();
    });
  }
}

// 导出所有指令
export default {
  install(app) {
    app.directive('slide-up', vSlideUp);
  }
}; 