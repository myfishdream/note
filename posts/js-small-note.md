---
title: JavaScript 核心知识点与编程技巧小记：从闭包到对象属性描述符的深入解析
date: 2025-04-27
category: Note
tags: 
    - JavaScript
description: 深入解析JavaScript核心概念：从闭包到对象属性描述符，涵盖函数作用域、内存管理、对象属性控制等关键知识点，帮助开发者更好地理解JavaScript的底层机制和编程技巧。
draft: false
outline: [2,3]
# sticky: true
done: true
gridPaper: true
---

# JavaScript 核心知识点与编程技巧小记

## 闭包

如果在函数外访问函数内的局部变量，正常情况下这无法读取，但是可以通过变通的方法。在函数的内部再定义一个函数。

```js
function f1() {
  var n = 999;
  function f2() {
    console.log(n);
  }
  return f2;
}

var result = f1();
result(); // 999
```

在JavaScript中只有函数内部的子函数才能读取内部变量，因此可以把闭包简单理解成一个**定义在一个函数内部的函数**。

闭包最大的特点就是：它能够**记住**诞生的环境，比如`f2`记住了它的诞生环境是`f1`，所以从`f2`可以得到`f1`的内部变量。

本质上是，**闭包就是将函数内部和函数外部连接起来的一座桥梁。**

其最大的两个用处是：一个是可以读取外层函数内部的变量，另一个是这些变量始终都保持在内存中，即闭包可以使得**它诞生的环境一直存在**。

下面的例子中，闭包使得内部变量记住了上一次调用的运行结果

```js
function createIncrementor(start) {
  return function () {
    return start++;
  };
}
var inc = createIncrementor(5);
inc() // 5
inc() // 6
inc() // 7
```

上面代码中，`start`是函数`createIncrementor`的内部变量。通过闭包，`start`的状态被保留了，每一次调用都是在上一次调用的基础上进行计算。从中可以看到，闭包`inc`使得函数`createIncrementor`的内部环境，**一直存在**。所以，闭包可以看作是函数内部作用域的一个接口。



为什么闭包能够返回外层函数的内部变量？原因是闭包（上例的`inc`）用到了外层变量（`start`），导致外层函数（`createIncrementor`）不能从内存释放。

只要闭包没有被垃圾回收机制清除，外层函数提供的运行环境也不会被清除，它的内部变量就始**终保存着当前值**，供闭包读取。

闭包还可以用于封装对象的**私有属性**和**私有方法**

```js
function Person(name) {
  var _age;
  function setAge(n) {
    _age = n;
  }
  function getAge() {
    return _age;
  }

  return {
    name: name,
    getAge: getAge,
    setAge: setAge
  };
}

var p1 = Person('张三');
p1.setAge(25);
p1.getAge() // 25
```

> [!tip]
>
> 注意，外层函数每次运行，都会生成一个**新的闭包**，而这个闭包又会保留外层函数的内部变量，所以内存消耗很大。因此不能滥用闭包，否则会造成网页的性能问题。

## Object

`instanceof`运算符用来验证，一个对象是否为指定的构造函数的实例。

**静态方法**指的是`Object`对象自身的方法。

`Object.keys`方法的参数是一个对象，返回一个数组。该数组的成员都是该对象自身的（而不是继承的）所有属性名，**只返回可枚举的属性**

`Object.getOwnPropertyNames`方法也是接受一个对象作为参数，返回一个数组，包含了该对象自身的所有属性名，**还返回不可枚举的属性名。**

```js
Object.keys([])
// []
Object.getOwnPropertyNames([])
// ["length"]
```

其中数组的`length`属性是不可枚举的

可以利用这两个方法做一个计算对象属性个数的方法：

```js
var obj = {
  p1: 123,
  p2: 456
};

Object.keys(obj).length // 2
Object.getOwnPropertyNames(obj).length // 2
```

------

`Object.prototype.valueOf()`方法的作用是返回一个对象的“值”，默认情况下返回对象本身。

`Object.prototype.hasOwnProperty()`方法接受一个字符串作为参数，返回一个布尔值，表示该实例对象**自身**是否具有该属性，不包括继承的

**属性描述对象**用于描述对象的属性，控制它的行为，比如该属性是否可写，可遍历等

每个属性都有自己对应的属性描述对象，保存该属性的一些**元信息**。

```js
{
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false,
  get: undefined,
  set: undefined
}
```

`value`是该属性的属性值，默认为`undefined`。

`writable`是一个布尔值，表示属性值（value）是否可改变（即是否可写），默认为`true`。

`enumerable`是一个布尔值，表示该属性是否可遍历，默认为`true`。如果设为`false`，会使得某些操作（比如`for...in`循环、`Object.keys()`）跳过该属性。

`configurable`是一个布尔值，表示属性的可配置性，默认为`true`。如果设为`false`，将阻止某些操作改写属性描述对象，比如无法删除该属性，也不得改变各种元属性（`value`属性除外）。也就是说，`configurable`属性控制了属性描述对象的可写性。

`get`是一个函数，表示该属性的取值函数（getter），默认为`undefined`。

`set`是一个函数，表示该属性的存值函数（setter），默认为`undefined`。

`Object.getOwnPropertyDescriptor()`方法可以获取属性描述对象。它的第一个参数是目标对象，第二个参数是一个字符串，对应目标对象的某个属性名。**同样只能只能用于对象自身的属性，不能用于继承的属性。**比如`toString`

**enumerable: false**可以控制`Object.keys`的行为，只返回可遍历的属性，`Object.getOwnPropertyNames`则不行

`Object.defineProperty()`方法允许通过属性描述对象，**定义**或**修改**一个属性，然后返回修改后的对象，它的用法如下。

```js
Object.defineProperty(object, propertyName, attributesObject)
```

- object：属性所在的对象
- propertyName：字符串，表示属性名
- attributesObject：属性描述对象

```js
obj.p

// 可以写成

var obj = Object.defineProperty({}, 'p', {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});
```

如果一次性定义或修改多个属性，可以使用`Object.defineProperties()`方法。

```js
var obj = Object.defineProperties({}, {
  p1: { value: 123, enumerable: true },
  p2: { value: 'abc', enumerable: true },
  p3: { get: function () { return this.p1 + this.p2 },
    enumerable:true,
    configurable:true
  }
});

obj.p1 // 123
obj.p2 // "abc"
obj.p3 // "123abc"
```

`Object.prototype.propertyIsEnumerable()`用来判断某个属性是否可遍历，**对于继承的属性一律返回false**

### 元属性

`value`属性是目标属性的值。

`writable`属性是一个布尔值，决定了目标属性的**值（value）**是否可以被改变。

**注意：**如果原型对象的某个属性的`writable`为`false`，那么子对象将无法自定义这个属性。

> [!tip]
>
> 有一个规避方法，就是通过覆盖属性描述对象，绕过这个限制。原因是这种情况下，原型链会被完全忽视。

### enumerable。。。
