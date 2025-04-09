---
title: 记录JavaScript数组的一些方法for/forEach，map，filter，reduce，every，some，includes
date: 2025-02-12
category: Note
tags:
    - JavaScript
description: for/forEach，map，filter，reduce，every，some，includes
outline: [2,4]
---

# 循环遍历

## for/forEach

在性能上 **for > forEach**

- for循环直接操作索引，没有额外的函数调用和上下文，所以性能是最快的
- for可以使用break终止，forEach不支持 跳出循环

```js
        let arrs = [...Array(999999).keys()]
        let total = 0;
        let startTime = Date.now();
        for (let i = 0; i < arrs.length; i++) total += i;
        let endTime = Date.now()
        let countTime = endTime - startTime;
        console.log('Count:', total);
        console.log("Time:", countTime);
```

```js
        let arrs = [...Array(999999).keys()]
        let total = 0;
        let startTime = Date.now();
        arrs.forEach(item => {
            total += item;
        })
        let endTime = Date.now()
        let countTime = endTime - startTime;
        console.log('Count:', total);
        console.log("Time:", countTime);
```

> [!IMPORTANT]
>
> forEach不支持异步任务（async-await），不会等待异步任务，或者使用for

## map

map()方法是数组原型的一个函数，对数组遍历不会破坏数组，将会创建一个新数组，**按照原数组元素的顺序依次执行给定义的函数**，**返回一个新数组**

适用于处理数组中的每个元素并且生成一个新的数组。

语法：

```js
map(callbackFuction)
map(callbackFuction,thisArray)
```

参数：

回调函数：
**element**数组中当前正在处理的元素

**index**正在处理的元素在数组中的索引

**array** 原数组

> [!IMPORTANT]
>
> 使用for循环进行网络请求是**依次发送**，用<u>map+promise</u>All可以实现**并发请求**

## filter

filter()方法会对数组的每个元素应用指定的函数，并返回一个新的数组，其中**只有符合条件的元素**，并且原数组不受到影响，**只有满足True才能被处理到新数组中**	

**参数**：

回调函数：
**element**:数组中正在处理的元素

**index**:正在处理元素的索引值

**array**：原数组

过滤实现去重效果

indexOf方法返回**第一个**匹配的元素的索引

```js
        let arrs = [1, 4, 5, 6, 6, 2, 4, 5, 6]
        let NewArrs = arrs.filter((item, index, arrs) => {
            return arrs.indexOf(item) == index
        })
        console.log(NewArrs);
```

filter + map组合使用(**链式调用**)，实现**去除无用信息加自定义属性**

```js
let student = [
    { id: 1, name: 'zhangsan' },
    { id: 2, name: 'lisi' },
    { id: undefined, name: 'wangwu' },
    { id: 3, name: 'ergou' },
]
let NewStudent = student.filter((item) => {
    return item.id
}).map((item) => {
    return {
        ...item,
        sex: '男'
    }
})
console.log(NewStudent);

// {id: 1, name: 'zhangsan', sex: '男'}
// {id: 2, name: 'lisi', sex: '男'}
// {id: 3, name: 'ergou', sex: '男'}
```

## reduce

reduce方法对数组中的每个元素按顺序执行一个指定方法，每一次执行reduce会将先前元素的计算结果作为参数传入

语法：

- **reduce(callbackFunction)**
- **reduce(callbackFunction,initValue(初始值))**

参数

回调函数：
prev(必填)：上一次调用回调函数的结果

current（必填）：当前的元素的值

index（可选）：当前值在数组中的索引位置

array（可选）：数组本身

初始值：

第一次调用回调函数的初始值。如果指定初始值，则回调函数从数组中的第一个值作为当前值开始执行

**如果没有指定初始值，数组中的第一个值是prev参数的值**，数值第二个值是current参数的值，如果数组为空，则抛出错误，**所有在不知道数组长度情况下可以指定初始值为0，保持逻辑的严谨性**

**不使用初始值**：

```js
        let reslut = [1, 2, 3, 4, 5];
        let resluts = reslut.reduce((prev, current, index) => {
            console.log('上一次值：', prev, '当前值：', current, '索引：', index);
            return prev + current;
        })
        console.log('最终结果', resluts);
```

```bash
上一次值： 1 当前值： 2 索引： 1
nav.html:14 上一次值： 3 当前值： 3 索引： 2
nav.html:14 上一次值： 6 当前值： 4 索引： 3
nav.html:14 上一次值： 10 当前值： 5 索引： 4
nav.html:17 最终结果 15
```

**使用初始值**：

```js
   let reslut = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let resluts = reslut.reduce((prev, current, index) => {
            console.log('上一次值：', prev, '当前值：', current, '索引：', index);
            return prev + current;
        }, 0)
        console.log('最终结果', resluts);
```

```bash
上一次值： 0 当前值： 1 索引： 0
nav.html:14 上一次值： 1 当前值： 2 索引： 1
nav.html:14 上一次值： 3 当前值： 3 索引： 2
nav.html:14 上一次值： 6 当前值： 4 索引： 3
nav.html:14 上一次值： 10 当前值： 5 索引： 4
nav.html:14 上一次值： 15 当前值： 6 索引： 5
nav.html:14 上一次值： 21 当前值： 7 索引： 6
nav.html:14 上一次值： 28 当前值： 8 索引： 7
nav.html:14 上一次值： 36 当前值： 9 索引： 8
nav.html:14 上一次值： 45 当前值： 10 索引： 9
nav.html:17 最终结果 55
```

**实现数组最大值：**

```js
        let reslut = [23, 54, 76, 87, 98, 21];
        let resluts = reslut.reduce((prev, current, index) => {
            return Math.max(prev, current);
        }, 0)
        console.log('数组最大值：', resluts);
```

## every

判断数组中所有元素是否满足函数中给的条件，全部满足返回True，否则false

语法：

- **every(callbackFunction)**
- **every(callbackFunction,thisArry)**

参数：

**回调函数：**

element：数组中当前正在处理的元素

index：当前处理元素的索引

array：数组本身

**thisArry**

执行回调函数时用作this的值

```js
        let reslut = [23, 54, 76, 87, 98, 21];
        let status = reslut.every(num => num > 30)
        console.log(status);
// 返回false
```

**判断所有商品是否有库存**

```js
        let more = [
            { name: '华为', price: '8999', stock: true },
            { name: '小米', price: '9999', stock: false },
            { name: '苹果', price: '1999', stock: true },
        ]
        let result = more.every((value) => {
            return value.stock;
        })
        console.log(result)
// false
```

**实现表单所有输入完成才能提交**

...

## some

和every类似，唯一不同的是，只要满足一个即返回ture，否则false

## includes

includes方法用于判断**数组**中是否包含一个**指定的值**，根据情况，包含返回true，否则返回false

> [!IMPORTANT]
>
> includes方法只能用于检测基础数据类型(数字，字符串，布尔值)，不能检测包含对象的类型
>
> **因为校验的不是值，是地址**
>
> - [1,2,3,4,5,6]
> - [{a:'-',b:'-',c:'-'},{a:'-',b:'-',c:'-'},{a:'-',b:'-',c:'-'}]

**语法：**

includes（searchElement）

includes（searchElement，formIndex）

**参数**：

searchElement 需要查找的值

formIndex开始搜索的索引

```js
        let a=[1,2,'he',true];
        console.log(a.includes('he'));
```

**every配合includes实现检测一个数组是否包含另一个数组中的所有值**

```js
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let num = [1, 2, 6];
        let status = num.every((ele) => {
            return arr.includes(ele);
        })
        console.log(status);

```

