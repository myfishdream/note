---
title: JavaScript 核心知识点小记
date: 2025-04-27
category: Note
tags: 
    - JavaScript
description: 从闭包到对象属性描述符，涵盖函数作用域、内存管理、对象属性控制等关键知识点。
draft: false
outline: [2,3]
# sticky: true
done: true
gridPaper: true
cbf: false
---

# JavaScript 核心知识点小记

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

**注意：**如果原型对象的某个属性的`writable`为`false`，那么**子对象**将无法自定义这个属性。

> [!tip]
>
> 有一个规避方法，就是通**过覆盖属性描述对象**，绕过这个限制。原因是这种情况下，原型链会被完全忽视。

```js
var proto = Object.defineProperty({}, 'foo', {
  value: 'a',
  writable: false
});

var obj = Object.create(proto);
Object.defineProperty(obj, 'foo', {
  value: 'b'
});

obj.foo // "b"
```

`enumerable`表示目标属性是否可遍历。

> 在早期JavaScript中，`for...in`循环是基于`in`运行符的，而`in`运算符不管某个属性是自身的还是继承的都会返回`true`
>
> ```js
> var obj = {};
> 'toString' in obj // true
> ```
>
> `toString`不是`obj`对象自身的属性，但是in返会了true，导致了`toString`属性也会被for in 循环遍历
>
> 再之后，引入了一个 **可遍历性** 这个概念，只有可遍历的属性才能被`for in` 循环遍历，
>
> 并且规定了像`toString`这一类实例对象继承的原生属性，都是不可遍历的，这样就保证了`for...in`循环的可用性。
>
> 所以：如果一个属性的`enumerable`为`false`，以下操作不会读取到该属性
>
> - `for..in`循环
> - `Object.keys`方法
> - `JSON.stringify`方法

`configurable`属性决定了是否可以修改属性描述对象，还决定了目标属性是否可以被删除（delete）

注意，`writable`属性只有在`false`改为`true`时会报错，`true`改为`false`是允许的。

`value`属性的情况比较特殊。只要`writable`和`configurable`有一个为`true`，就允许改动`value`。

### 存取器 

```js
// 写法一
var obj = Object.defineProperty({}, 'p', {
  get: function () {
    return 'getter';
  },
  set: function (value) {
    console.log('setter: ' + value);
  }
});
// 写法二
var obj = {
  get p() {
    return 'getter';
  },
  set p(value) {
    console.log('setter: ' + value);
  }
};
```

第一种写法，属性`p`的`configurable`和`enumerable`都为`false`，从而导致属性`p`是不可遍历的；

第二种写法，属性`p`的`configurable`和`enumerable`都为`true`，因此属性`p`是可遍历的。

存取器往往用于，**属性的值依赖对象内部数据**的场合。

```js
var obj ={
  $n : 5,
  get next() { return this.$n++ },
  set next(n) {
    if (n >= this.$n) this.$n = n;
    else throw new Error('新的值必须大于当前值');
  }
};

obj.next // 5

obj.next = 10;
obj.next // 10

obj.next = 5;
// Uncaught Error: 新的值必须大于当前值
```

### 对象的拷贝

将一个对象的所有属性拷贝到另一个对象

```js
var extend = function (to, from) {
  for (var property in from) {
    to[property] = from[property];
  }

  return to;
}

extend({}, {
  a: 1
})
// {a: 1}
```

上述方法的缺点是遇到**存取器只会拷贝值**

```js
extend({}, {
  get a() { return 1 }
})
// {a: 1}
```

解决办法是通过`Object.defineProperty`方法来拷贝属性

```js
var extend = function (to, from) {
  for (var property in from) {
    if (!from.hasOwnProperty(property)) continue;
    Object.defineProperty(
      to,
      property,
      Object.getOwnPropertyDescriptor(from, property)
    );
  }

  return to;
}

extend({}, { get a(){ return 1 } })
// { get a(){ return 1 } })
```

`hasOwnProperty`那一行用来过滤掉继承的属性，否则可能会报错，因为`Object.getOwnPropertyDescriptor`读不到继承属性的属性描述对象。

### 控制对象状态

`Object.preventExtensions`方法可以使得一个对象无法**再添加**新的属性。

`Object.isExtensible`方法用于检查一个对象是否使用了`Object.preventExtensions`方法。

`Object.seal`方法使得一个对象既无法添加新属性，也无法删除旧属性。

> `Object.seal`实质是把属性描述对象的`configurable`属性设为`false`，因此属性描述对象不再能改变了。`Object.seal`只是禁止新增或删除属性，并不影响修改某个属性的值。

`Object.isSealed`方法用于检查一个对象是否使用了`Object.seal`方法。

`Object.freeze`方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

`Object.isFrozen`方法用于检查一个对象是否使用了`Object.freeze`方法。

> `Object.isFrozen`的一个用途是，确认某个对象没有被冻结后，再对它的属性赋值。

> [!tip]
>
> 上述方法中，如果操作了被限制的属性，在严格模式下，大部分会报错，否则只是静默失败

### 局限性

上面的三个方法锁定对象的可写性有一个漏洞：可以通过**改变原型对象**，来为对象增加属性。

```js
var obj = new Object();
Object.preventExtensions(obj); // 限制对象

var proto = Object.getPrototypeOf(obj); // 在原型对象操作
proto.t = 'hello';
obj.t // 依然可以读取到
// hello
```

解决方案是，把`obj`的原型也冻结住

```js
var obj = new Object();
Object.preventExtensions(obj);

var proto = Object.getPrototypeOf(obj);
Object.preventExtensions(proto);

proto.t = 'hello';
obj.t // undefined
```

还有一个局限性是，如果属性值是对象，上述的方法只能冻结属性**指向的对象**，而不能冻结对象的本身的内容。

```js
var obj = {
  foo: 1,
  bar: ['a', 'b']
};
Object.freeze(obj);

obj.bar.push('c');
obj.bar // ["a", "b", "c"]
```

上述代码中，将`obj`对象冻结后，**其指向将无法改变，即无法指向其他值**，但是其中的数组是可变的。类似于说，**只能冻结一个对象的顶层属性**，嵌套属性则不行

## Array

`new Array`用于生成新的数组，可以传入数字参数，表示生成指定个数成员的数组，每个位置都是空的。

`Array.isArray`方法返回一个布尔值，表示参数是否为数组。它可以弥补`typeof`运算符的不足，`typeof`运算符只能显示数组的类型是`Object`

`valueOf`方法是一个所有对象都拥有的方法，表示对该对象求值。不同对象的`valueOf`方法不尽一致，数组的`valueOf`方法返回数组本身。

`toString`方法返回数组的字符串形式。

`push`方法用于在数组的末端添加一个或多个元素，并返回添加新元素后的数组长度。注意，该方法会改变原数组。

`pop`方法用于删除数组的最后一个元素，并返回该元素。注意，该方法会改变原数组，对空数组使用`pop`方法，不会报错，而是返回`undefined`。

> [!tip]
>
> `push`和`pop`结合使用，就构成了“后进先出”的栈结构（stack）。

`shift()`方法用于删除数组的第一个元素，并返回该元素。注意，该方法会改变原数组。

> ```js
> var list = [1, 2, 3, 4];
> var item;
> 
> while (item = list.shift()) {
>   console.log(item);
> }
> 
> list // []
> ```
>
> 遍历输出并清空一个数组，局限性：数组元素不能是`0`或任何布尔值等于`false`的元素

`unshift()`方法用于在数组的第一个位置添加元素，并返回添加新元素后的数组长度。注意，该方法会改变原数组，可以接受多个参数

`join()`方法以指定参数作为分隔符，将所有数组成员连接为一个字符串返回。如果不提供参数，默认用逗号分隔。

```js
var a = [1, 2, 3, 4];

a.join(' ') // '1 2 3 4'
a.join(' | ') // "1 | 2 | 3 | 4"
a.join() // "1,2,3,4"
```

>通过`call`方法，这个方法也可以用于字符串或类似数组的对象。
>
>```js
>Array.prototype.join.call('hello', '-')
>// "h-e-l-l-o"
>
>var obj = { 0: 'a', 1: 'b', length: 2 };
>Array.prototype.join.call(obj, '-')
>// 'a-b'
>```

`concat`方法用于多个数组的合并。它将新数组的成员，添加到原数组成员的后部，然后返回一个新数组，原数组不变，其参数可以是数组，数字，字符串....

>如果数组成员包括对象，`concat`方法返回当前数组的一个浅拷贝。所谓“浅拷贝”，指的是新数组拷贝的是对象的引用。
>
>```
>var obj = { a: 1 };
>var oldArray = [obj];
>
>var newArray = oldArray.concat();
>
>obj.a = 2;
>newArray[0].a // 2
>```
>
>上面代码中，原数组包含一个对象，`concat`方法生成的新数组包含这个对象的引用。所以，改变原对象以后，新数组跟着改变。

`reverse`方法用于颠倒排列数组元素，返回改变后的数组。注意，该方法将改变原数组。

`slice()`方法用于提取目标数组的一部分，返回一个新数组，原数组不变。

```js
arr.slice(start, end);
```

它的第一个参数为起始位置（从0开始，会包括在返回的新数组之中），第二个参数为终止位置（但该位置的元素本身不包括在内）。如果省略第二个参数，则一直返回到原数组的最后一个成员。

如果`slice()`方法的参数是负数，则表示倒数计算的位置。

> [!tip]
>
> `slice()`方法的一个重要应用，是将类似数组的对象转为真正的数组。
>
> ```js
> Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 })
> // ['a', 'b']
> 
> Array.prototype.slice.call(document.querySelectorAll("div"));
> Array.prototype.slice.call(arguments);
> ```
>
> 上面代码的参数都不是数组，但是通过`call`方法，在它们上面调用`slice()`方法，就可以把它们转为真正的数组。

`splice()`

...