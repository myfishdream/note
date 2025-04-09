---
title:  Vue3从入门到实战，掌握核心知识,响应式，监听对象，组件通信路由，Pinia
date: 2024-11-05
category: Note
tags:
    - Vue
description: 响应式对象，计算属性，属性监听，生命周期，Hooks，路由，Pinia，组件通信
outline: [2,6]
---


## Setup



### setup 的返回值

- 若返回一个**对象**：则对象中的：属性、方法等，在模板中均可以直接使用**（重点关注）。**
- 若返回一个**函数**：则可以自定义渲染内容，代码如下：

```jsx
setup(){
  return ()=> '你好啊！'
}
```

### setup 与 Options API 的关系

- `Vue2` 的配置（`data`、`methos`......）中**可以访问到** `setup`中的属性、方法。
- 但在`setup`中**不能访问到**`Vue2`的配置（`data`、`methos`......）。
- 如果与`Vue2`冲突，则`setup`优先。

### 语法糖

```js
<script lang="ts">
export default {
    name: "Person"
}
</script>
```

如果组件中有两个`script`，一个配置API的，一个是配置组件名字的

还需要编写一个不写`setup`的`script`标签，去指定组件名字，比较麻烦，我们可以借助`vite`中的插件简化

1. 第一步：`npm i vite-plugin-vue-setup-extend -D`
2. 第二步：`vite.config.ts`

```jsx
import { defineConfig } from 'vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

export default defineConfig({
  plugins: [ VueSetupExtend() ]
})
```

1. 第三步：`<script setup lang="ts" name="Person">`

## Reactive

**注意点：**`reactive`定义的响应式数据是“**深层次**”的。

## Ref

- 其实`ref`接收的数据可以是：**基本类型**、**对象类型**。
- 若`ref`接收的是对象类型，内部其实也是调用了`reactive`函数

> 在设置Vue中，可以更该设置，自动添加 .value

区别：

`reactive`重新分配一个新对象，会**失去**响应式（可以使用`Object.assign`去整体替换）。

```js
Object.assign(array,{id:11,name:'lol',age:123})
// 顶掉之前的属性(覆盖)
// ref类型数据就可以重新分配一个新的对象
```

使用原则：

> 1. 若需要一个基本类型的响应式数据，必须使用`ref`。
> 2. 若需要一个响应式对象，**层级不深**，`ref`、`reactive`都可以。
> 3. 若需要一个响应式对象，且**层级较深**，推荐使用`reactive`。

## toRef

- 作用：将一个响应式对象中的每一个属性，转换为`ref`对象。

- 备注：`toRefs`与`toRef`功能一致，但`toRefs`可以批量转换。

- 语法如下：

  ```js
  // 数据
    let person = reactive({name:'张三', age:18, gender:'男'})
  	
    // 通过toRefs将person对象中的n个属性批量取出，且依然保持响应式的能力
    let {name,gender} =  toRefs(person)
  	
    // 通过toRef将person对象中的gender属性取出，且依然保持响应式的能力
    let age = toRef(person,'age')
  
  ```

## computed

数据与页面双向绑定`v-model:value='值'`

```js
// 计算属性——只读取，不修改
     let fullName = computed(()=>{
      return firstName.value + '-' + lastName.value
    }) 
```

```js
// 计算属性——既读取又修改
    let fullName = computed({
      // 读取
      get(){
        return firstName.value + '-' + lastName.value
      },
      // 修改
      set(val){
        console.log('有人修改了fullName',val)
        firstName.value = val.split('-')[0]
        lastName.value = val.split('-')[1]
      }
    })
```

特点：它所依赖的**数据**只要发生变化它就**重新计算**

并且计算属性有缓存，多次调用不会反复执行（与函数不同）

## Watch

特点：`Vue3`中的`watch`只能监视以下**四种数据**：

1. `ref`定义的数据。
2. `reactive`定义的数据。
3. 函数返回一个值（`getter`函数）。
4. 一个包含上述内容的数组。

### 情况一

​    `import {ref,watch} from 'vue'`

```js
// 监视，情况一：监视【ref】定义的【基本类型】数据
    const stopWatch = watch(sum,(newValue,oldValue)=>{
      console.log('sum变化了',newValue,oldValue)
      if(newValue >= 10){
        stopWatch() // 停止监视
      }
    })
```



### 情况二

监视`ref`定义的【对象类型】数据：直接写**数据名**，监视的是对象的【**地址值**】，若想监视对象内部的数据，要手动**开启深度监视。**

> 注意：
>
> - 若修改的是`ref`定义的对象中的属性，`newValue` 和 `oldValue` **都是新值**，因为它们是同一个对象。
> - 若修改整个`ref`定义的对象，`newValue` 是新值， `oldValue` 是旧值，因为不是同一个对象了。

```js
// 数据
  let person = ref({
    name:'张三',
    age:18
  })
  
   /* 
    监视，情况一：监视【ref】定义的【对象类型】数据，监视的是对象的地址值，若想监视	对象内部属性的变化，需要手动开启深度监视
    watch的第一个参数是：被监视的数据
    watch的第二个参数是：监视的回调
    watch的第三个参数是：配置对象（deep、immediate等等.....） 
  */
  watch(person,(newValue,oldValue)=>{
    console.log('person变化了',newValue,oldValue)
  },{deep:true,})
// 配置项 immediate:true 立即监视
```



### 情况三

监视`reactive`定义的【对象类型】数据，且默认开启了**深度监视**。

```js
// 数据
  let person = reactive({
    name:'张三',
    age:18
  })
  let obj = reactive({
    a:{
      b:{
        c:666
      }
    }
  })
  
  // 监视，情况三：监视【reactive】定义的【对象类型】数据，且默认是开启深度监视的
  watch(person,(newValue,oldValue)=>{
    console.log('person变化了',newValue,oldValue)
  })
  watch(obj,(newValue,oldValue)=>{
    console.log('Obj变化了',newValue,oldValue)
  })
```



### 情况四

监视`ref`或`reactive`定义的【对象类型】数据中的**某个属性**，注意点如下：

1. 若该属性值**不是**【对象类型】，需要写成函数形式。
2. 若该属性值是**依然**是【对象类型】，可直接编，也可写成函数，建议写成函数。

结论：监视的要是对象里的属性，那么最好写函数式，注意点：**若是对象监视的是地址值，需要关注对象内部，需要手动开启深度监视**。

```js
// 数据
    let person = reactive({
      name:'张三',
      age:18,
      car:{
        c1:'奔驰',
        c2:'宝马'
      }
    })
    
    // 监视，情况四：监视响应式对象中的某个属性，且该属性是基本类型的，要写成函数式
     watch(()=> person.name,(newValue,oldValue)=>{
      console.log('person.name变化了',newValue,oldValue)
    }) 
  
    // 监视，情况四：监视响应式对象中的某个属性，且该属性是对象类型的，可以直接写，也能写函数，更推荐写函数
    watch(()=>person.car,(newValue,oldValue)=>{
      console.log('person.car变化了',newValue,oldValue)
    },{deep:true})
```

> getter函数就是一个能返回值的函数

### 情况无

监视上述的多个数据

```js
// 监视，情况五：监视上述的多个数据
    watch([()=>person.name,person.car],(newValue,oldValue)=>{
      console.log('person.car变化了',newValue,oldValue)
    },{deep:true})
```
## WatchEffect

官网解释：立即执行一个函数，同时响应的追踪其依赖，并在依赖更改时重新执行函数

watch和watchEffect对比：

- watch需要指出监视的数据
- watchEffect不用明确指出监视的数据，自动跟踪依赖的数据

```js
 // 用watch实现，需要明确的指出要监视：temp、height
  watch([temp,height],(value)=>{
    // 从value中获取最新的temp值、height值
    const [newTemp,newHeight] = value
    // 室温达到50℃，或水位达到20cm，立刻联系服务器
    if(newTemp >= 50 || newHeight >= 20){
      console.log('联系服务器')
    }
  })

  // 用watchEffect实现，不用
  const stopWtach = watchEffect(()=>{
    // 室温达到50℃，或水位达到20cm，立刻联系服务器
    if(temp.value >= 50 || height.value >= 20){
      console.log(document.getElementById('demo')?.innerText)
      console.log('联系服务器')
    }
    // 水温达到100，或水位达到50，取消监视
    if(temp.value === 100 || height.value === 50){
      console.log('清理了')
      stopWtach()
    }
  })
```
## 标签Ref

作用：用于注册模版引用

- 用在普通DOM元素上，获取的时**DOM节点**
- 用在组件标签上，获取的是**组件实例对象**

```js
 <h1 ref="title1">尚硅谷</h1>
 let title1 = ref()
 function showLog(){
       console.log(title1.value)
 }
```

```js
<!-- 父组件App.vue -->
<template>
  <Person ref="ren"/>
  <button @click="test">测试</button>
</template>

<script lang="ts" setup name="App">
  import Person from './components/Person.vue'
  import {ref} from 'vue'

  let ren = ref()

  function test(){
    console.log(ren.value.name)
    console.log(ren.value.age)
  }
</script>


<!-- 子组件Person.vue中要使用defineExpose暴露内容 -->
<script lang="ts" setup name="Person">
  import {ref,defineExpose} from 'vue'
	// 数据
  let name = ref('张三')
  let age = ref(18)
  /****************************/
  /****************************/
  // 使用defineExpose将组件中的数据交给外部
  defineExpose({name,age})
</script>
```
### 子传父

子组件通过defineExpose({MyName:name,Age:age})将数据交出给外部，外部通过组件标签的ref属性即可读取
> 简写：defineExpose({name,age})

## props

### 父传子
```ts
// 定义一个接口，用于限制每个Person对象的格式
export interface PersonInter{
    id:string,
    name:string,
    age:number
}

// 定义一个自定义类型Persons
export type Persons = Array<PersonInter>
    
    //第一种使用接口方法
//    let users:Array<PersonInter>=reactive([
//   {id:'dfgg01',name:'lik',age:11},
//   {id:'dfgg02',name:'lik2',age:131},
//   {id:'dfgg03',name:'li3k',age:113}
// ])
    // 第二种
    let users=reactive<Persons>([
  {id:'dfgg01',name:'lik',age:11},
  {id:'dfgg02',name:'lik2',age:131},
  {id:'dfgg03',name:'li3k',age:113}
])
```

```js
// 引入类型接口!!!
import {type PersonInter} from '@/types'

// 父组件传递数据
<Person :list="persons"/>

// 子组件接受数据
   
  // 第一种写法：仅接收
// const props = defineProps(['list'])
  
  // 第二种写法：接收+限制类型
// defineProps<{list:Persons}>()
  
  // 第三种写法：接收+限制类型+指定默认值+限制必要性	（注意引入withDefaults）
let props = withDefaults(defineProps<{list?:Persons}>(),{
     list:()=>[{id:'asdasg01',name:'小猪佩奇',age:18}]
  })
```
## 生命周期

概念：Vue组件实例在创建时要经历一系列的初始化步骤，在此过程中`Vue`会在**合适的时机，调用特定的函数**，从而让开发者有机会在特定阶段运行自己的代码，这些特定的函数统称为：生命周期钩子



生命周期整体分为四个阶段，分别是：**创建、挂载、更新、销毁**，每个阶段都有两个钩子，一前一后。



`Vue2`的生命周期

> 创建阶段：`beforeCreate`、`created`
>
> 挂载阶段：`beforeMount`、`mounted`
>
> 更新阶段：`beforeUpdate`、`updated`
>
> 销毁阶段：`beforeDestroy`、`destroyed`



`Vue3`的生命周期

> 创建阶段：`setup`
>
> 挂载阶段：`onBeforeMount`、`onMounted`
>
> 更新阶段：`onBeforeUpdate`、`onUpdated`
>
> 卸载阶段：`onBeforeUnmount`、`onUnmounted`



常用的钩子：`onMounted`(挂载完毕)、`onUpdated`(更新完毕)、`onBeforeUnmount`(卸载之前)
## Hooks

Hooks定义：本质是一个函数，把setup函数中的`Composition API`(组合式API)进行了封装，类似Vue2中的Mixin

优点：复用代码，逻辑清晰

一般在SRC文件夹中新建hooks文件夹存放封装API

**数据和方法要包在一个函数里面，并且暴露 ，最后向外提供东西return**



示例代码：

- `useSum.ts`中内容如下：

  ```js
  import {ref,onMounted} from 'vue'

  export default function(){
    let sum = ref(0)

    const increment = ()=>{
      sum.value += 1
    }
    const decrement = ()=>{
      sum.value -= 1
    }
    onMounted(()=>{
      increment()
    })

    //向外部暴露数据
    return {sum,increment,decrement}
  }		
  ```

- `useDog.ts`中内容如下：

  ```js
  import {reactive,onMounted} from 'vue'
  import axios,{AxiosError} from 'axios'

  export default function(){
    let dogList = reactive<string[]>([])

    // 方法
    async function getDog(){
      try { 
        // 发请求
        let {data} = await axios.get('https://dog.ceo/api/breed/pembroke/images/random')
        // 维护数据
        dogList.push(data.message)
      } catch (error) {
        // 处理错误
        const err = <AxiosError>error
        console.log(err.message)
      }
    }

    // 挂载钩子
    onMounted(()=>{
      getDog()
    })
  	
    //向外部暴露数据
    return {dogList,getDog}
  }
  ```

- 组件中具体使用：

  ```vue
  <template>
    <h2>当前求和为：{{sum}}</h2>
    <button @click="increment">点我+1</button>
    <button @click="decrement">点我-1</button>
    <hr>
    <img v-for="(u,index) in dogList.urlList" :key="index" :src="(u as string)"> 
    <span v-show="dogList.isLoading">加载中......</span><br>
    <button @click="getDog">再来一只狗</button>
  </template>
  
  <script lang="ts">
    import {defineComponent} from 'vue'
  
    export default defineComponent({
      name:'App',
    })
  </script>
  
  <script setup lang="ts">
    import useSum from './hooks/useSum'
    import useDog from './hooks/useDog'
  	
    let {sum,increment,decrement} = useSum()
    let {dogList,getDog} = useDog()
  </script>
  ```

------
## 路由

![](https://raw.githubusercontent.com/fish81/typora-uploads-images/main/image/1744108744_0.png)

安装路由：`npm i vue-router` 

凡是涉及到路由，在src建文件夹router

```js
//路由配置文件代码
import {createRouter,createWebHistory} from 'vue-router'
import Home from '@/pages/Home.vue'
import News from '@/pages/News.vue'
import About from '@/pages/About.vue'

const router = createRouter({
	history:createWebHistory(), // 路由工作模式
	routes:[
		{
			path:'/home',
			component:Home
		},
		{
			path:'/about',
			component:About
		}
	]
})
export default router
```

```js
// 使用路由配置文件
import router from './router/index'
const app=createApp(App)

app.use(router)

app.mount('#app')
```

```vue
// 切换区及展示区
<template>
  <div class="app">
    <h2 class="title">Vue路由测试</h2>
    <!-- 导航区 -->
    <div class="navigate">
      <RouterLink to="/home" active-class="active">首页</RouterLink>
      <RouterLink to="/news" active-class="active">新闻</RouterLink>
      <RouterLink to="/about" active-class="active">关于</RouterLink>
    </div>
    <!-- 展示区 -->
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
  import {RouterLink,RouterView} from 'vue-router'  
</script>
```

### 注意

1. 路由组件通常存放在`pages` 或 `views`文件夹，一般组件通常存放在`components`文件夹。
2. 通过点击导航，视觉效果上“消失” 了的路由组件，默认是被**卸载**掉的，需要的时候再去**挂载**。

### 工作模式

1. `history`模式

   > 优点：`URL`更加美观，不带有`#`，更接近传统的网站`URL`。
   >
   > 缺点：后期项目上线，需要服务端配合处理路径问题，否则刷新会有`404`错误。
   >
   > ```js
   > const router = createRouter({
   >   	history:createWebHistory(), //history模式
   >   	/******/
   > })
   > ```

2. `hash`模式

   > 优点：兼容性更好，因为不需要服务器端处理路径。
   >
   > 缺点：`URL`带有`#`不太美观，且在`SEO`优化方面相对较差。
   >
   > ```js
   > const router = createRouter({
   >   	history:createWebHashHistory(), //hash模式
   >   	/******/
   > })
   > ```

### to的两种写法

```vue
<!-- 第一种：to的字符串写法 -->
<router-link active-class="active" to="/home">主页</router-link>

<!-- 第二种：to的对象写法 -->
<router-link active-class="active" :to="{path:'/home'}">Home</router-link>
```

### 命名路由

作用：可以简化路由跳转及传参

给路由规则命名：

```js
routes:[
  {
    name:'zhuye',
    path:'/home',
    component:Home
  },
  {
    name:'xinwen',
    path:'/news',
    component:News,
  },
  {
    name:'guanyu',
    path:'/about',
    component:About
  }
]
```

跳转路由：

```vue
<!--简化前：需要写完整的路径（to的字符串写法） -->
<router-link to="/news/detail">跳转</router-link>

<!--简化后：直接通过名字跳转（to的对象写法配合name属性） -->
<router-link :to="{name:'guanyu'}">跳转</router-link>
```

### 嵌套路由

编写`News`的子路由：`Detail.vue`

配置路由规则，使用`children`配置项：

```ts
const router = createRouter({
  history:createWebHistory(),
	routes:[
		{
			name:'zhuye',
			path:'/home',
			component:Home
		},
		{
			name:'xinwen',
			path:'/news',
			component:News,
			children:[
				{
					name:'xiang',
					path:'detail',
					component:Detail
				}
			]
		},
		{
			name:'guanyu',
			path:'/about',
			component:About
		}
	]
})
export default router
```

跳转路由（记得要加完整路径）：

```vue
<routerlink to="/news/detail">xxxx</routerlink>
<!-- 或 -->
<routerlink :to="{path:'/news/detail'}">xxxx</routerlink>
```

记得去`Home`组件中预留一个`<router-view>`

```vue
<template>
  <div class="news">
    <nav class="news-list">
      <RouterLink v-for="news in newsList" :key="news.id" :to="{path:'/news/detail'}">
        {{news.name}}
      </RouterLink>
    </nav>
    <div class="news-detail">
      <RouterView/>
    </div>
  </div>
</template>
```

### 路由传参

#### query参数

1. 传递参数

   ```vue
   <!-- 跳转并携带query参数（to的字符串写法） -->
   <router-link to="/news/detail?a=1&b=2&content=欢迎你">
   	跳转
   </router-link>
   				
   <!-- 跳转并携带query参数（to的对象写法） -->
   <RouterLink 
     :to="{
       //name:'xiang', //用name也可以跳转
       path:'/news/detail',
       query:{
         id:news.id,
         title:news.title,
         content:news.content
       }
     }"
   >
     {{news.title}}
   </RouterLink>
   ```

2. 接收参数：

   ```js
   import {useRoute} from 'vue-router'
   const route = useRoute()
   // 打印query参数
   console.log(route.query)
   ```

#### params参数

1. 传递参数

   ```vue
   <!-- 跳转并携带params参数（to的字符串写法） -->
   <RouterLink :to="`/news/detail/001/新闻001/内容001`">{{news.title}}</RouterLink>
   				
   <!-- 跳转并携带params参数（to的对象写法） -->
   <RouterLink 
     :to="{
       name:'xiang', //用name跳转
       params:{
         id:news.id,
         title:news.title,
         content:news.title
       }
     }"
   >
     {{news.title}}
   </RouterLink>
   ```

2. 接收参数：

   ```js
   import {useRoute} from 'vue-router'
   const route = useRoute()
   // 打印params参数
   console.log(route.params)
   ```

> 备注1：传递`params`参数时，若使用`to`的对象写法，**必须使用`name`配置项**，不能用`path`。
>
> 备注2：传递`params`参数时，需要提前在**规则中占位。**

### 路由的props配置

作用：让路由组件更方便的收到参数（可以将路由参数作为`props`传给组件）

```js
{
	name:'xiang',
	path:'detail/:id/:title/:content',
	component:Detail,

  // props的对象写法，作用：把对象中的每一组key-value作为props传给Detail组件
  // props:{a:1,b:2,c:3}, 

  // props的布尔值写法，作用：把收到了每一组params参数，作为props传给Detail组件
  // props:true
  
  // props的函数写法，作用：把返回的对象中每一组key-value作为props传给Detail组件
  props(route){
    return route.query
  }
}
```

### replace属性

1. 作用：控制路由跳转时操作浏览器历史记录的模式。

2. 浏览器的历史记录有两种写入方式：分别为```push```和```replace```：

   - ```push```是追加历史记录（默认值）。
   - `replace`是替换当前记录。

3. 开启`replace`模式：

   ```vue
   <RouterLink replace .......>News</RouterLink>
   ```

### 编程式导航

定义：**不依赖RouterLink实现路由跳转**	

router.push()的参数和to的参数类似

```js
import {useRouter} from 'vue-router'
const router = useRouter()
router.push({
    name:'xingwen',
    query:{
        id:...,
        name:...,
        age:...
    }
})

```

### 重定向

作用：将特定的路径，重新定向到已有路由。

首页默认组件展示

1. 具体编码：

   ```js
   {
       path:'/',
       redirect:'/about'
   }
   ```

## pinia

集中式状态(数据)管理

Script中的name用于**定义组件名**，如果不写，会将**文件名**作为**组件名**

```js
v-model.number='n'
// 自动转换成数字
```

**nanoid**库用于生成唯一ID值`npm i nanoid`

```js
import {nanoid} from 'nanoid'
let id=nanoid() // 调用生成即可
```

```js
let {data:{content:title}} = result
// 连续解构+重命名 从result解构出data在解构出content再重新命名为title
```

### 搭建Pinia

第一步：`npm install pinia`

第二步：操作`src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'

/* 引入createPinia，用于创建pinia */
import { createPinia } from 'pinia'

/* 创建pinia */
const pinia = createPinia()
const app = createApp(App)

/* 使用插件 */{}
app.use(pinia)
app.mount('#app')
```

此时开发者工具中已经有了`pinia`选项

在src文件夹中新建一个store文件夹(数据总经理)

> 如果ref定义在reactive中，读取ref时不需要再加value，已经自动解包了

### 存储+读取数据

const useCountStore = defineStore('count',{...}）

- useCountStore :名字
- count：相当于ID值，最好与文件名保持一致
- ...: 配置对象

1. `Store`是一个保存：**状态**、**业务逻辑** 的实体，每个组件都可以**读取**、**写入**它。

2. 它有三个概念：`state`、`getter`、`action`，相当于组件中的： `data`、 `computed` 和 `methods`。

3. 具体编码：`src/store/count.ts`

   ```ts
   // 引入defineStore用于创建store
   import {defineStore} from 'pinia'

   // 定义并暴露一个store
   export const useCountStore = defineStore('count',{
     // 动作
     actions:{},
     // 状态
     state(){
       return {
         sum:6
       }
     },
     // 计算
     getters:{}
   })
   ```

4. 具体编码：`src/store/talk.ts`

   ```js
   // 引入defineStore用于创建store
   import {defineStore} from 'pinia'

   // 定义并暴露一个store
   export const useTalkStore = defineStore('talk',{
     // 动作
     actions:{},
     // 状态
     state(){
       return {
         talkList:[
           {id:'yuysada01',content:'你今天有点怪，哪里怪？怪好看的！'},
        	{id:'yuysada02',content:'草莓、蓝莓、蔓越莓，你想我了没？'},
           {id:'yuysada03',content:'心里给你留了一块地，我的死心塌地'}
         ]
       }
     },
     // 计算
     getters:{}
   })
   ```

5. 组件中使用`state`中的数据

   ```vue
   <template>
     <h2>当前求和为：{{ sumStore.sum }}</h2>
   </template>
   
   <script setup lang="ts" name="Count">
     // 引入对应的useXxxxxStore	
     import {useSumStore} from '@/store/sum'
     
     // 调用useXxxxxStore得到对应的store
     const sumStore = useSumStore()
   </script>
   ```

   ```vue
   <template>
   	<ul>
       <li v-for="talk in talkStore.talkList" :key="talk.id">
         {{ talk.content }}
       </li>
     </ul>
   </template>
   
   <script setup lang="ts" name="Count">
     import axios from 'axios'
     import {useTalkStore} from '@/store/talk'
   
     const talkStore = useTalkStore()
   </script>
   ```

### 修改数据(三种方式)

1. 第一种修改方式，直接修改

   ```ts
   countStore.sum = 666
   ```

2. 第二种修改方式：批量修改

   ```ts
   countStore.$patch({
     sum:999,
     school:'atguigu'
   })
   ```

3. 第三种修改方式：借助`action`修改（`action`中可以编写一些业务逻辑）

   ```js
   import { defineStore } from 'pinia'

   export const useCountStore = defineStore('count', {
     /*************/
     actions: {
       //加
       increment(value:number) {
         if (this.sum < 10) {
           //操作countStore中的sum
           this.sum += value
         }
       },
       //减
       decrement(value:number){
         if(this.sum > 1){
           this.sum -= value
         }
       }
     },
     /*************/
   })
   ```

4. 组件中调用`action`即可

   ```js
   // 使用countStore
   const countStore = useCountStore()
   
   // 调用对应action
   countStore.incrementOdd(n.value)
   ```

### storeToRefs

- 借助`storeToRefs`将`store`中的数据转为`ref`对象，方便在模板中使用。

- 注意：`pinia`提供的`storeToRefs`**只会将数据做转换**，而`Vue`的`toRefs`会转换`store`中全部数据。

- ```vue
  <template>
  	<div class="count">
  		<h2>当前求和为：{{sum}}</h2>
  	</div>
  </template>
  
  <script setup lang="ts" name="Count">
    import { useCountStore } from '@/store/count'
    /* 引入storeToRefs */
    import { storeToRefs } from 'pinia'
  
  	/* 得到countStore */
    const countStore = useCountStore()
    /* 使用storeToRefs转换countStore，随后解构 */
    const {sum} = storeToRefs(countStore)
  </script>
  ```

  

### getters

1. 概念：当`state`中的数据，**需要经过处理后再使用时**，可以使用`getters`配置。

2. 追加```getters```配置。

   ```js
   // 引入defineStore用于创建store
   import {defineStore} from 'pinia'

   // 定义并暴露一个store
   export const useCountStore = defineStore('count',{
     // 动作
     actions:{
       /************/
     },
     // 状态
     state(){
       return {
         sum:1,
         school:'atguigu'
       }
     },
     // 计算
     getters:{
       bigSum:(state):number => state.sum *10,
       upperSchool():string{
         return this. school.toUpperCase()
       }
     }
   })
   ```

3. 组件中读取数据：

   ```js
   const {increment,decrement} = countStore
   let {sum,school,bigSum,upperSchool} = storeToRefs(countStore)
   ```

   ### $subscribe

通过 store 的 `$subscribe()` 方法侦听 `state` 及其变化

mutate:本次修改的信息

state：真正的数据

```ts
talkStore.$subscribe((mutate,state)=>{
  console.log('LoveTalk',mutate,state)
  localStorage.setItem('talk',JSON.stringify(talkList.value))
})
```

```js
 localStorage.setItem('talk',JSON.stringify(talkList.value)) // 将数据转换后本地存储
let talkList=JSON.parse(localStorage.getItem('talk') as String) || [] //读取字符串并转回来 断言（它就是一个能取出来的字符串）默认值空数组
```

本地存储存字符串，如果不是字符串，底层会调用toString()

如果一个数组里面都是对象，应该调用`JSON.stringify`将数组打成字符串的形式，并且人类看得懂

### store组合式写法

```ts
import {defineStore} from 'pinia'
import axios from 'axios'
import {nanoid} from 'nanoid'
import {reactive} from 'vue'

export const useTalkStore = defineStore('talk',()=>{
  // talkList就是state
  const talkList = reactive(
    JSON.parse(localStorage.getItem('talkList') as string) || []
  )

  // getATalk函数相当于action
  async function getATalk(){
    // 发请求，下面这行的写法是：连续解构赋值+重命名
    let {data:{content:title}} = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
    // 把请求回来的字符串，包装成一个对象
    let obj = {id:nanoid(),title}
    // 放到数组中
    talkList.unshift(obj)
  }
  return {talkList,getATalk}
})
```

## 组件通信

![](https://raw.githubusercontent.com/fish81/typora-uploads-images/main/image/1744109074_0.png)

### props

概述：`props`是使用频率最高的一种通信方式，常用与 ：**父 ↔ 子**。

- 若 **父传子**：属性值是**非函数**。(通过组件中的**属性**传递)
- 若 **子传父**：属性值是**函数**。(通过组件中的**函数**传递) -> 父亲给儿子传一个函数让儿子调用 数据即可回到父亲

父组件：

```vue
<template>
  <div class="father">
    <h3>父组件，</h3>
		<h4>我的车：{{ car }}</h4>
		<h4>儿子给的玩具：{{ toy }}</h4>
		<Child :car="car" :getToy="getToy"/>
  </div>
</template>

<script setup lang="ts" name="Father">
	import Child from './Child.vue'
	import { ref } from "vue";
	// 数据
	const car = ref('奔驰')
	const toy = ref()
	// 方法
	function getToy(value:string){
		toy.value = value
	}
</script>
```

子组件

```vue
<template>
  <div class="child">
    <h3>子组件</h3>
		<h4>我的玩具：{{ toy }}</h4>
		<h4>父给我的车：{{ car }}</h4>
		<button @click="getToy(toy)">玩具给父亲</button>
  </div>
</template>

<script setup lang="ts" name="Child">
	import { ref } from "vue";
	const toy = ref('奥特曼')
	
	defineProps(['car','getToy'])
</script>
```

### 自定义事件

步骤：

1. 首先在父组件中**子组件标签**处声明一个自定义事件并且指定回调函数`@haha='qwe'`

2. 子组件处使用`const emit = defineEmits(['haha'])`接收

3. 最后在需要传递数据的地方调用即可`emit('haha',传参)` ，此时父组件处的自定义事件的回调函数就可以拿到数据

   **命名规范**：

![](https://raw.githubusercontent.com/fish81/typora-uploads-images/main/image/1744109086_0.png)

1. 概述：自定义事件常用于：**子 => 父。**
2. 注意区分好：原生事件、自定义事件。

- 原生事件：
  - 事件名是特定的（`click`、`mosueenter`等等）	
  - 事件对象`$event`: 是包含事件相关信息的对象（`pageX`、`pageY`、`target`、`keyCode`）
- 自定义事件：
  - 事件名是任意名称
  - <strong style="color:red">事件对象`$event`: 是调用`emit`时所提供的数据，可以是任意类型！！！</strong >

1. 示例：

   ```html
   <!--在父组件中，给子组件绑定自定义事件：-->
   <Child @send-toy="toy = $event"/>
   
   <!--注意区分原生事件与自定义事件中的$event-->
   <button @click="toy = $event">测试</button>
   ```

   ```js
   //子组件中，触发事件：
   this.$emit('send-toy', 具体数据)
   ```

### mitt

**任意组件间通信**

概述：与消息订阅与发布（`pubsub`）功能类似，可以实现任意组件间通信。

| emitter的方法 | 含义               |
| ------------- | ------------------ |
| all           | 拿到所有绑定的事件 |
| emit          | 触发某一个事件     |
| off           | 解绑某一个事件     |
| on            | 绑定某一个事件     |
| all.clear()   | 清空所有事件       |

安装`mitt`

```shell
npm i mitt
```

新建文件：`src\utils\emitter.ts`

```javascript
// 引入mitt 
import mitt from "mitt";

// 创建emitter
const emitter = mitt()

/*
  // 绑定事件
  emitter.on('abc',(value)=>{
    console.log('abc事件被触发',value)
  })
  emitter.on('xyz',(value)=>{
    console.log('xyz事件被触发',value)
  })

  setInterval(() => {
    // 触发事件
    emitter.emit('abc',666)
    emitter.emit('xyz',777)
  }, 1000);

  setTimeout(() => {
    // 清理事件
    emitter.all.clear()
  }, 3000); 
*/

// 创建并暴露mitt
export default emitter
```

接收数据的组件中：绑定事件、同时在销毁前解绑事件：

```typescript
import emitter from "@/utils/emitter";
import { onUnmounted } from "vue";

// 绑定事件
emitter.on('send-toy',(value)=>{
  console.log('send-toy事件被触发',value)
})

onUnmounted(()=>{
  // 解绑事件
  emitter.off('send-toy')
})
```

【第三步】：提供数据的组件，在合适的时候触发事件

```javascript
import emitter from "@/utils/emitter";

function sendToy(){
  // 触发事件
  emitter.emit('send-toy',toy.value)
}
```

**注意这个重要的内置关系，总线依赖着这个内置关系**

### v-model

**可以自己封装UI组件库**

当v-model用在**html标签**上时，底层原理:

v-model原理：

```html
<input type="text" :value="name" @input="name = $event.target.value">

    <input type="text" :value="name" @input="name = (<HTMLInputElement>$event.target).value">
    <!-- TS写法 -->
```

当v-model用在**组件标签**上时:

本质：`:moldeValue` ＋ `update:modelValue`事件

> 注意：update:modelValue是一个事件名称

```vue
<!-- 组件标签上使用v-model指令 -->
<AtguiguInput v-model="userName"/>

<!-- 组件标签上v-model的本质 -->
<AtguiguInput :modelValue="userName" @update:model-value="userName = $event"/>
```

1. `AtguiguInput`组件中：

   ```vue
   <template>
     <div class="box">
       <!--将接收的value值赋给input元素的value属性，目的是：为了呈现数据 -->
   		<!--给input元素绑定原生input事件，触发input事件时，进而触发update:model-value事件-->
       <input 
          type="text" 
          :value="modelValue" 
          @input="emit('update:model-value',$event.target.value)"
       >
     </div>
   </template>

   <script setup lang="ts" name="AtguiguInput">
     // 接收props
     defineProps(['modelValue'])
     // 声明事件
     const emit = defineEmits(['update:model-value'])
   </script>
   ```

2. 也可以更换`value`，例如改成`abc`

   ```vue
   <!-- 也可以更换value，例如改成abc-->
   <AtguiguInput v-model:abc="userName"/>

   <!-- 上面代码的本质如下 -->
   <AtguiguInput :abc="userName" @update:abc="userName = $event"/>
   ```

   `AtguiguInput`组件中：

   ```vue
   <template>
     <div class="box">
       <input 
          type="text" 
          :value="abc" 
          @input="emit('update:abc',$event.target.value)"
       >
     </div>
   </template>

   <script setup lang="ts" name="AtguiguInput">
     // 接收props
     defineProps(['abc'])
     // 声明事件
     const emit = defineEmits(['update:abc'])
   </script>
   ```

3. 如果`value`可以更换，那么就可以在组件标签上多次使用`v-model`

   再在AtguiguInput添加对应属性方法即可

   ```vue
   <AtguiguInput v-model:abc="userName" v-model:xyz="password"/>
   ```

> $event到底是个啥？ 啥时候要.target
>
> - ​	对于原生事件，$event就是事件对象（要）
> - ​	对于自定义事件，$event就是触发事件时，所传递的参数（数据） （不要）

### $attrs 

**祖 < - >  孙 互相通信**（本质是props）

**v-bind**:
![](https://raw.githubusercontent.com/fish81/typora-uploads-images/main/image/1744109093_0.png)

1. 概述：`$attrs`用于实现**当前组件的父组件**，向**当前组件的子组件**通信（**祖→孙**）。

2. 具体说明：`$attrs`是一个对象，**包含所有父组件传入的标签属性。**

   > 注意：`$attrs`会自动排除`props`中声明的属性(可以认为声明过的 `props` 被子组件自己“消费”了)

   过程：

   父亲把数据传给儿子`Child :a="a" :b="b" :c="c" :d="d" v-bind="{x:100,y:200}" :updateA="updateA"/>`

   儿子不接收，直接把数据传给孙子`GrandChild v-bind="$attrs"/>`

   孙子接收即可

父组件：

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
		<Child :a="a" :b="b" :c="c" :d="d" v-bind="{x:100,y:200}" :updateA="updateA"/>
  </div>
</template>

<script setup lang="ts" name="Father">
	import Child from './Child.vue'
	import { ref } from "vue";
	let a = ref(1)
	let b = ref(2)
	let c = ref(3)
	let d = ref(4)

	function updateA(value){
		a.value = value
	}
</script>
```

子组件：

```vue
<template>
	<div class="child">
		<h3>子组件</h3>
		<GrandChild v-bind="$attrs"/>
	</div>
</template>

<script setup lang="ts" name="Child">
	import GrandChild from './GrandChild.vue'
</script>
```

孙组件：

```vue
<template>
	<div class="grand-child">
		<h3>孙组件</h3>
		<h4>a：{{ a }}</h4>
		<h4>b：{{ b }}</h4>
		<h4>c：{{ c }}</h4>
		<h4>d：{{ d }}</h4>
		<h4>x：{{ x }}</h4>
		<h4>y：{{ y }}</h4>
		<button @click="updateA(666)">点我更新A</button>
	</div>
</template>

<script setup lang="ts" name="GrandChild">
	defineProps(['a','b','c','d','x','y','updateA'])
</script>
```

###  $ refs、$parent

子组件**暴露**数据，父组件即可通过ref获取/修改

ref获取单个数据 refs即可获取所有子组件数据

> 注意：记得暴露数据，否则无法获取

1. 概述：

   - `$refs`用于 ：**父→子。**
   - `$parent`用于：**子→父。**

2. 原理如下：

   | 属性      | 说明                                                     |
   | --------- | -------------------------------------------------------- |
   | `$refs`   | 值为对象，包含所有被`ref`属性标识的`DOM`元素或组件实例。 |
   | `$parent` | 值为对象，当前组件的父组件实例对象。                     |

> 注意点：当一个ref在一个**响应式对象**数据内部时，访问不需要加value，自动解包

### provide、inject

`provide(名字,值)` 向后代提供数据

inject(名字,默认值) 接收数据

1. 概述：实现**祖孙组件**直接通信

2. 具体使用：

   * 在祖先组件中通过`provide`配置向后代组件提供数据
   * 在后代组件中通过`inject`配置来声明接收数据

3. 具体编码：

   【第一步】父组件中，使用`provide`提供数据

   ```vue
   <template>
     <div class="father">
       <h3>父组件</h3>
       <h4>资产：{{ money }}</h4>
       <h4>汽车：{{ car }}</h4>
       <button @click="money += 1">资产+1</button>
       <button @click="car.price += 1">汽车价格+1</button>
       <Child/>
     </div>
   </template>
   
   <script setup lang="ts" name="Father">
     import Child from './Child.vue'
     import { ref,reactive,provide } from "vue";
     // 数据
     let money = ref(100)
     let car = reactive({
       brand:'奔驰',
       price:100
     })
     // 用于更新money的方法
     function updateMoney(value:number){
       money.value += value
     }
     // 提供数据
     provide('moneyContext',{money,updateMoney})
     provide('car',car)
   </script>
   ```

   > 注意：子组件中不用编写任何东西，是不受到任何打扰的

   【第二步】孙组件中使用`inject`配置项接受数据。

   ```vue
   <template>
     <div class="grand-child">
       <h3>我是孙组件</h3>
       <h4>资产：{{ money }}</h4>
       <h4>汽车：{{ car }}</h4>
       <button @click="updateMoney(6)">点我</button>
     </div>
   </template>
   
   <script setup lang="ts" name="GrandChild">
     import { inject } from 'vue';
     // 注入数据
    let {money,updateMoney} = inject('moneyContext',{money:0,updateMoney:(x:number)=>{}})
     let car = inject('car')
   </script>
   ```

### pinia

### slot

**用于复用组件，呈现<u>不同内容</u>**

#### 默认插槽

```vue
父组件中：
        <Category title="今日热门游戏">
          <ul>
            <li v-for="g in games" :key="g.id">{{ g.name }}</li>
          </ul>
        </Category>
子组件中：
        <template>
          <div class="item">
            <h3>{{ title }}</h3>
            <!-- 默认插槽 -->
            <slot>默认值</slot>
          </div>
        </template>
```

#### 具名插槽

**v-slot:s1 简写形式 #s1**

```vue
父组件中：
        <Category title="今日热门游戏">
          <template v-slot:s1>
            <ul>
              <li v-for="g in games" :key="g.id">{{ g.name }}</li>
            </ul>
          </template>
          <template #s2>
            <a href="">更多</a>
          </template>
        </Category>
子组件中：
        <template>
          <div class="item">
            <h3>{{ title }}</h3>
            <slot name="s1"></slot>
            <slot name="s2"></slot>
          </div>
        </template>
```

#### 作用域插槽

数据在子，子组件将数据传给使用者，<span style='color:red'>渲染结构</span>由使用者决定

通俗理解：  <span style="color: blue;">压岁钱在孩子那，但是使用压岁钱买的东西，还是由父亲决定</span>

1. 理解：<span style="color:red">数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定。</span>（新闻数据在`News`组件中，但使用数据所遍历出来的结构由`App`组件决定）

2. 具体编码：

   ```vue
   父组件中：
         <Game v-slot="params">
         <!-- <Game v-slot:default="params"> -->
         <!-- <Game #default="params"> -->
           <ul>
             <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
           </ul>
         </Game>
   
   子组件中：
         <template>
           <div class="category">
             <h2>今日游戏榜单</h2>
             <slot :games="games" a="哈哈"></slot>
           </div>
         </template>
   
         <script setup lang="ts" name="Category">
           import {reactive} from 'vue'
           let games = reactive([
             {id:'asgdytsa01',name:'英雄联盟'},
             {id:'asgdytsa02',name:'王者荣耀'},
             {id:'asgdytsa03',name:'红色警戒'},
             {id:'asgdytsa04',name:'斗罗大陆'}
           ])
         </script>
   ```

```vue
v-slot:qwe="params" //具名+作用域插槽
```

## 其它 API

### shallowRef  shallowReactive

#### `shallowRef`

1. 作用：创建一个响应式数据，但只对顶层属性进行响应式处理。

2. 用法：

   ```js
   let myVar = shallowRef(initialValue);
   
   person.values属于第一层
   person.values 浅层次
   person.value.age 深层次
   ```

3. 特点：只跟踪引用值的变化，不关心值内部的属性变化。

4. 只关心整体是否被修改，具体属性值不管

#### shallow Reactive

1. 作用：创建一个浅层响应式对象，只会使对象的最顶层属性变成响应式的，对象内部的嵌套属性则不会变成响应式的

2. 用法：

   ```js
   const myObj = shallowReactive({ ... });
   ```

3. 特点：对象的顶层属性是响应式的，但嵌套对象的属性不是。

#### 总结

> 通过使用 [`shallowRef()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 和 [`shallowReactive()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive) 来绕开深度响应。浅层式 `API` 创建的状态只在其顶层是响应式的，对所有深层的对象不会做任何处理，避免了对每一个内部属性做响应式所带来的性能成本，这使得属性的访问变得更快，可提升性能。

​	

### readonly shallowReadonly

#### readonly

**单向关联**！！！

1. 作用：用于创建一个对象的**深只读副本**。

2. 用法：

   ```js
   const original = reactive({ ... });
   const readOnlyCopy = readonly(original);
   
   // 两个数据单向关联 可以修改sun1，sun2也会同步更改  但是sun2不可修改
   let sun1 = ref(0)
   let sun2 = ref(sum1)
   ```

3. 特点：

   * 对象的所有嵌套属性都将变为只读。
   * 任何尝试修改这个对象的操作都会被阻止（在开发模式下，还会在控制台中发出警告）。

4. 应用场景：

   * 创建**不可变的状态快照**。
   * 保护全局状态或配置不被修改。

#### shallowReadonly

1. 作用：与 `readonly` 类似，但只作用于对象的**顶层属性**。

2. 用法：

   ```js
   const original = reactive({ ... });
   const shallowReadOnlyCopy = shallowReadonly(original);
   ```

3. 特点：

   * 只将对象的顶层属性设置为只读，对象内部的嵌套属性仍然是可变的。

   * 适用于只需保护对象顶层属性的场景。

### toRaw markRaw

#### toRaw

1. 作用：用于获取一个响应式对象的原始对象， `toRaw` 返回的对象不再是响应式的，不会触发视图更新。

   > 官网描述：这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。

   > 何时使用？ —— 在需要将响应式对象传递给非 `Vue` 的库或外部系统时，使用 `toRaw` 可以确保它们收到的是普通对象，**保证其修改普通数据不会影响页面数据**

   

   > 当希望把一个数据交给别人用的时候，知道会被修改，但是不希望修改的数据传递到页面上，所以使用to Raw()传递过去即可

2. 具体编码：

   ```js
   import { reactive,toRaw,markRaw,isReactive } from "vue";
   
   /* toRaw */
   // 响应式对象
   let person = reactive({name:'tony',age:18})
   // 原始对象
   let rawPerson = toRaw(person)
   
   
   /* markRaw */
   let citysd = markRaw([
     {id:'asdda01',name:'北京'},
     {id:'asdda02',name:'上海'},
     {id:'asdda03',name:'天津'},
     {id:'asdda04',name:'重庆'}
   ])
   // 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
   let citys2 = reactive(citys)
   console.log(isReactive(person))
   console.log(isReactive(rawPerson))
   console.log(isReactive(citys))
   console.log(isReactive(citys2))
   ```

#### `markRaw`

1. 作用：标记一个对象，使其**永远不会**变成响应式的。

   > 例如使用`mockjs`时，为了防止误把`mockjs`变为响应式对象，可以使用 `markRaw` 去标记`mockjs`

2. 编码：

   ```js
   /* markRaw */
   let citys = markRaw([
     {id:'asdda01',name:'北京'},
     {id:'asdda02',name:'上海'},
     {id:'asdda03',name:'天津'},
     {id:'asdda04',name:'重庆'}
   ])
   // 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
   let citys2 = reactive(citys)
   ```

### customRef

当想实现一个效果，数据一修改，**过一秒**后在更新数据

**难点：**

**读数据首先调用track()，**

告诉vue数据很重要，要对数据进行持续跟踪，一旦数据发生变化就更新

**改数据最后调用trigger()**

当所有数据更新完毕，通知vue一下数据发生变化

> 一般自定义Ref封装在Hooks里面	

作用：创建一个自定义的`ref`，并对其依赖项跟踪和更新触发进行逻辑控制。

实现防抖效果（`useSumRef.ts`）：

```typescript
import {customRef } from "vue";

export default function(initValue:string,delay:number){
  let msg = customRef((track,trigger)=>{
    let timer:number
    return {
      get(){
        track() // 告诉Vue数据msg很重要，要对msg持续关注，一旦变化就更新
        return initValue
      },
      set(value){
        clearTimeout(timer)
        timer = setTimeout(() => {
          initValue = value
          trigger() //通知Vue数据msg变化了
        }, delay);
      }
    }
  }) 
  return {msg}
}
```

组件中使用：

```ts
import useSumRef from './hooks/useSumRef.ts'
let {msg} = useSumRef('Hellow',3000)
```

##  Vue3新组件

### Teleport

Teleport 是一种能够将我们的**组件html结构**移动到指定位置的技术。

调用者某些属性会影响子组件位置，使用to属性**指定插入调用者的某一个位置**

```html
<teleport to='body' >
    <div class="modal" v-show="isShow">
      <h2>我是一个弹窗</h2>
      <p>我是弹窗中的一些内容</p>
      <button @click="isShow = false">关闭弹窗</button>
    </div>
</teleport>
```

### Suspense

场景：当子组件有异步任务的时候，并且子组件还要用的时候

-  等待异步组件时渲染一些额外内容，让应用有更好的用户体验 
-  使用步骤： 
   -  异步引入组件
   -  使用`Suspense`包裹组件，并配置好`default` 与 `fallback`

defineAsyncComponent  是 vue3引入的一个 API，用于定义和加载异步组件。

它的主要作用是实现**懒加载**（Lazy Loading），即在**实际需要时才加载组件**，优化页面的性能和提升用户体验，尤其适用于大型应用和单页面应用（SPA）



```tsx
import { defineAsyncComponent,Suspense } from "vue";
const Child = defineAsyncComponent(()=>import('./Child.vue'))
```

```vue
<template>
    <div class="app">
        <h3>我是App组件</h3>
        <Suspense>
          <template v-slot:default>
            <Child/>
          </template>
          <template v-slot:fallback>
            <h3>加载中.......</h3>
          </template>
        </Suspense>
    </div>
</template>
```

### 全局API转移到应用对象

> 全局API指的是Vue身上的
>
> 转移到应用上指的是app

- `app.component`

  - 在main.ts引入组件Hello.vue组件使用app.component('hello',hello)注册全局组件（即可以到处使用）

- `app.config`

  - ```ts
    // 全局属性 （所有位置都可以使用）
    app.config.globalProperties.x = 1
    
    declare module 'vue' {
        interface ComponentCustomProperties {
            x: number
        }
    }
    ```

    

- `app.directive`

  - ```ts
    // 自定义指令
    app.directive('bty', (element, { value }) => {
        element.innerText += value
        element.style.color = 'red'
        element.style.backgroundColor = 'yellow'
    })
    // 调用
     <h1 v-bty="name">Nian</h1>
    ```

    

- `app.mount`

  - 挂载应用（main.ts）

- `app.unmount`

  - 卸载应用

- `app.use`

  - 安装插件

### 其他

#### 非兼容性改变

> 指的是 在Vue3只能这样写，不能向Vue2那样写了
>
> 实质：Vue2 和 Vue3 有什么区别

- 过渡类名 `v-enter` 修改为 `v-enter-from`、过渡类名 `v-leave` 修改为 `v-leave-from`。


- `keyCode` 作为 `v-on` 修饰符的支持。

- `v-model` 指令在组件上的使用已经被重新设计，替换掉了 `v-bind.sync。`

- `v-if` 和 `v-for` 在同一个元素身上使用时的优先级发生了变化。

- 移除了`$on`、`$off` 和 `$once` 实例方法。

- 移除了过滤器 `filter`。

- 移除了`$children` 实例 `propert`。