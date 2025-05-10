---
title: JavaScript 核心知识点小记 (上)
date: 2025-04-27
category: Note
tags: 
    - JavaScript
description: 从闭包到对象属性描述符，涵盖函数作用域、内存管理、对象属性控制等关键知识点。
draft: false  
outline: [2,3] 
sticky: false 
done: false   
gridPaper: false 
cbf: false 
handwriting: false
AutoAnchor: true
---

# JavaScript 核心知识点小记 (上)

::: details 目录
[[toc]]
:::

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

`splice()`方法用于删除原数组的一部分成员，并可以在删除的位置添加新的数组成员，返回值是被删除的元素。注意，该方法会改变原数组。

```js
arr.splice(start, count, addElement1, addElement2, ...);
```

`splice`的第一个参数是删除的起始位置（从0开始），第二个参数是被删除的元素个数。如果后面还有更多的参数，则表示这些就是要被插入数组的新元素。

还可以单独插入元素而不删除元素，把`splice`方法的第二个参数设置为0。如果只提供一个参数，等同于将原数组在指定位置拆分成两个数组

`sort`方法对数组成员进行排序，默认是按照**字典顺序**排序。排序后，原数组将被改变。

如果想让`sort`方法按照自定义的方式排序，可以传入一个函数作为参数。函数接受两个参数，表示进行比较的两个数组成员，如果函数的返回值大于0，表示第一个成员排在第二个成员后面，其他情况，都是第一个元素排在第二个元素前面。

> [!tip]
>
> 注意，自定义的排序函数**应该返回数值**，**而不是布尔值或者其他**，否则不同的浏览器可能有不同的实现，不能保证结果都一致。

`map()`方法将数组的所有成员依次传入参数函数，然后把每一次的执行结果组成一个新数组返回。

`map()`方法接受一个函数作为参数。该函数调用时，`map()`方法向它（函数）传入三个参数：**当前成员、当前位置和数组本身。**

`map()`方法还可以接受第二个参数，用来绑定回调函数内部的`this`变量

```js {3}
var arr = ['a', 'b', 'c'];

[1, 2].map(function (e) {
  return this[e];
}, arr)
// ['b', 'c']
```

上述代码中函数内的`this`指向`arr`数组。

> [!tip]
>
> `map()`方法的回调函数**不会在空位执行函数**（`['a','b', ,'d']`），但是不会跳过`undefined`和`null`

`forEach()`方法与`map()`方法很相似，也是对数组的所有成员依次执行参数函数。但是，`forEach()`方法**不返回值**，只用来操作数据（比如：为了在屏幕输出内容）。

`forEach()`的用法与`map()`方法一致，参数是一个函数，该函数同样接受三个参数：当前值、当前位置、整个数组。

`forEach()`方法也可以接受第二个参数，绑定参数函数的`this`变量。

注意，`forEach()`方法无法中断执行，总是会将所有成员遍历完，`forEach()`方法不会跳过`undefined`和`null`，但会跳过空位。

`filter()`方法用于过滤数组成员，满足条件的成员组成一个新数组返回。

它的参数是一个函数，所有数组成员依次执行该函数，**返回结果为**`true`**的成员组成一个新数组返回**。该方法不会改变原数组。

`filter()`方法的参数函数可以接受三个参数：当前成员，当前位置和整个数组。

`filter()`方法还可以接受第二个参数，用来绑定参数函数内部的`this`变量。

`some`方法是只要**一个成员执行函数的返回值是**`true`，则整个`some`方法的返回值就是`true`，否则返回`false`。

`every`方法是所有成员的返回值都是`true`，整个`every`方法才返回`true`，否则返回`false`。

`some`和`every`方法还可以接受第二个参数，用来绑定参数函数内部的`this`变量。

`reduce()`方法和`reduceRight()`方法依次处理数组的每个成员，最终累计为一个值。它们的差别是，`reduce()`是从左到右处理（从第一个成员到最后一个成员），`reduceRight()`则是从右到左（从最后一个成员到第一个成员），其他完全一样。

```js
[1, 2, 3, 4, 5].reduce(function (a, b) {
  console.log(a, b);
  return a + b;
})
// 1 2
// 3 3
// 6 4
// 10 5
//最后结果：15
```

上面代码中，`reduce()`方法用来求出数组所有成员的和。`reduce()`的参数是一个函数，数组每个成员都会依次执行这个函数。如果数组有 n 个成员，这个参数函数就会执行 n - 1 次。

- 第一次执行：`a`是数组的第一个成员`1`，`b`是数组的第二个成员`2`。
- 第二次执行：`a`为上一轮的返回值`3`，`b`为第三个成员`3`。
- 第三次执行：`a`为上一轮的返回值`6`，`b`为第四个成员`4`。
- 第四次执行：`a`为上一轮返回值`10`，`b`为第五个成员`5`。至此所有成员遍历完成，整个方法的返回值就是最后一轮的返回值`15`。

`reduce()`方法和`reduceRight()`方法的第一个参数都是一个函数。该函数接受以下四个参数。

1. 累积变量。第一次执行时，默认为数组的第一个成员；以后每次执行时，都是上一轮的返回值。
2. 当前变量。第一次执行时，默认为数组的第二个成员；以后每次执行时，都是下一个成员。
3. 当前位置。一个整数，表示第二个参数（当前变量）的位置，默认为`1`。
4. 原数组。

这四个参数之中，只有前两个是必须的，后两个则是可选的。

如果要对累积变量**指定初值**，可以把它放在`reduce()`方法和`reduceRight()`方法的第二个参数。

`indexOf`方法返回给定元素在数组中第一次出现的位置，如果没有出现则返回`-1`。

`indexOf`方法还可以接受第二个参数，表示搜索的开始位置。

`lastIndexOf`方法返回给定元素在数组中最后一次出现的位置，如果没有出现则返回`-1`。

> [!tip]
>
> 注意，这两个方法不能用来搜索`NaN`的位置，即它们无法确定数组成员是否包含`NaN`。

## 包装对象

在JavaScript中，原始类型的值：数字，字符串，布尔值，在一定条件下会自动转换为对象，也就是**原始类型的包装对象**

所谓“包装对象”，指的是与数值、字符串、布尔值分别相对应的`Number`、`String`、`Boolean`三个原生对象。这三个原生对象可以把**原始类型的值变成（包装成）对象**。

```js
var v1 = new Number(123);
typeof v1 // "object"
v1 === 123 // false
```

包装对象的目的是：让整门语言有一个通用的数据模型，**其次是使得原始类型的值也有办法调用自己的方法。**

### 实例方法

三种包装对象各自提供了许多实例方法，其中两种它们共同具有、从`Object`对象继承的方法：`valueOf()`和`toString()`。

`valueOf()`方法返回包装对象实例对应的原始类型的值。

```js
new Number(123).valueOf()  // 123
```

`toString()`方法返回对应的字符串形式。

```js
new Number(123).toString() // "123"
```

### 自动转换

某些场合，原始类型的值会自动当作包装对象调用，即调用包装对象的属性和方法。这时，JavaScript 引擎会自动将原始类型的值转为包装对象实例，并在使用后**立刻销毁实例**。

```js
'abc'.length // 3
```

上述代码中，`abc`本身只是一个**普通的字符串**，不是一个对象，所以不能调用`length`属性

此时，JavaScript 引擎自动将其转为**包装对象**，在这个对象上调用`length`属性。

调用结束后，这个临时对象就会被销毁。这就叫原始类型与实例对象的自动转换。

```js
let str = 'abc';
str.length // 3
```

实际上执行的是：

```js
let strObj = new String(str)
// String {
//   0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"
// }
strObj.length // 3
```

上面代码中，字符串`abc`的包装对象提供了多个属性，`length`只是其中之一。

自动转换生成的包装对象是只读的，无法修改。所以，字符串无法添加新属性。

> [!tip]
>
> 当调用结束后，包装对象实例会自动销毁。这意味着，下一次调用字符串的属性时，实际是调用一个新生成的对象，而不是上一次调用时生成的那个对象，所以取不到赋值在上一个对象的属性。如果要为字符串添加属性，只有在它的原型对象`String.prototype`上定义

### 自定义方法

除了原生的实例方法，包装对象还可以自定义方法和属性，**供原始类型的值直接调用**

比如，我们可以新增一个`double`方法，使得字符串和数字翻倍。

```js
String.prototype.double = function () {
  return this.valueOf() + this.valueOf();
};

'abc'.double()
// abcabc

Number.prototype.double = function () {
  return this.valueOf() + this.valueOf();
};

(123).double() // 246
```

上面代码在`String`和`Number`这两个对象的原型上面，分别自定义了一个方法，从而可以在所有实例对象上调用。注意，最后一行的`123`外面必须要加上圆括号，否则后面的点运算符（`.`）会被解释成小数点。

## Boolean 对象

`Boolean`对象是 JavaScript 的三个包装对象之一。作为构造函数，它主要用于生成布尔值的包装对象实例。

使用双重的否运算符（`!`）也可以将任意值转为对应的布尔值。

## Number 对象

`Number`对象是数值对应的包装对象，可以作为构造函数使用，也可以作为工具函数使用。

### 静态属性

> [!tip]
>
> **静态属性**指的是直接定义在`Number`对象上的属性，而不是定义在实例上的属性

| 静态属性                   | 含义                                                         |
| -------------------------- | ------------------------------------------------------------ |
| `Number.POSITIVE_INFINITY` | 正的无限，指向`Infinity`                                     |
| `Number.NEGATIVE_INFINITY` | 负的无限，指向`-Infinity`                                    |
| `Number.NaN`               | 表示非数值，指向`NaN`                                        |
| `Number.MIN_VALUE`         | 表示最小的正数（即最接近0的正数，在64位浮点数体系中为`5e-324`），相应的，最接近0的负数为`-Number.MIN_VALUE` |
| `Number.MAX_SAFE_INTEGER`  | 表示能够精确表示的最大整数，即`9007199254740991`             |
| `Number.MIN_SAFE_INTEGER`  | 表示能够精确表示的最小整数，即`-9007199254740991`            |

### 实例方法

#### toString()

`Number.prototype.toString()`用来将一个数值转为字符串形式。

`toString`方法可以接受一个参数，表示输出的进制。如果省略这个参数，默认将数值先转为十进制，再输出字符串；否则，就根据参数指定的进制，将一个数字转化成某个进制的字符串。

```js
(10).toString(2) // "1010"
```

> [!tip]
>
> 上面代码中，`10`一定要放在括号里，这样表明后面的点表示调用对象属性。如果不加括号，这个点会被 JavaScript 引擎解释成小数点，从而报错。
>
> 当然，只要让JavaScript 引擎不混淆小数点和对象的点运算符，各种写法都能用。
>
> 还可以在`10`后面加两个点，JavaScript 会把第一个点理解成小数点（即`10.0`），把第二个点理解成调用对象属性，从而得到正确结果。

```js
10..toString(2)
// "1010"

// 其他方法还包括
10 .toString(2) // "1010"
10.0.toString(2) // "1010"
```

通过方括号运算符也可以调用`toString`方法。

```js
10['toString'](2) // "1010"
```

`toString`方法只能将十进制的数，转为其他进制的字符串。如果要将其他进制的数，转回十进制，需要使用`parseInt`方法。

#### toFixed()

`Number.prototype.toFixed()`方法先将一个数转为指定位数的小数，然后返回这个小数对应的字符串。

#### toExponential

`Number.prototype.toExponential()`方法用于将一个数转为科学计数法形式，`toExponential`方法的参数是小数点后有效数字的位数，范围为0到100

#### toPrecision()

`Number.prototype.toPrecision()`方法用于将一个数转为指定位数的有效数字，该方法的参数为有效数字的位数，范围是1到100

#### toLocaleString

`Number.prototype.toLocaleString()`方法接受一个地区码作为参数，返回一个字符串，表示当前数字在该地区的当地书写形式。

### 自定义方法

与其他对象一样，`Number.prototype`对象上面可以自定义方法，被`Number`的实例继承。

```js
Number.prototype.add = function (x) {
  return this + x;
};

8['add'](2) // 10
```

```js
Number.prototype.iterate = function () {
  var result = [];
  for (var i = 0; i <= this; i++) {
    result.push(i);
  }
  return result;
};

(8).iterate()
// [0, 1, 2, 3, 4, 5, 6, 7, 8]
```

注意，数值的自定义方法，只能定义在它的原型对象`Number.prototype`上面，数值本身是无法自定义属性的。

```js
var n = 1;
n.x = 1;
n.x // undefined
```

上面代码中，`n`是一个原始类型的数值。直接在它上面新增一个属性`x`，不会报错，但毫无作用，总是返回`undefined`。这是因为一旦被调用属性，`n`就自动转为`Number`的实例对象，调用结束后，该对象自动销毁。所以，下一次调用`n`的属性时，实际取到的是另一个对象，属性`x`当然就读不出来。

## String 对象

`String`对象是 JavaScript 原生提供的三个包装对象之一，用来生成字符串对象。

字符串对象是一个类似数组的对象（很像数组，但不是数组）

```js
new String('abc')
// String {0: "a", 1: "b", 2: "c", length: 3}

(new String('abc'))[1] // "b"
```

### 静态方法

...

### 实例方法

`String.prototype.charAt()`方法返回指定位置的字符，参数是从`0`开始编号的位置

`String.prototype.concat()`方法用于连接两个字符串，返回一个新字符串，不改变原字符串。

`String.prototype.slice()`方法用于从原字符串取出子字符串并返回，不改变原字符串。它的第一个参数是子字符串的开始位置，第二个参数是子字符串的结束位置（不含该位置）。

`String.prototype.substring()`方法用于从原字符串取出子字符串并返回，不改变原字符串，跟`slice`方法很相像。它的第一个参数表示子字符串的开始位置，第二个位置表示结束位置（返回结果不含该位置）。

如果省略第二个参数，则表示子字符串一直到原字符串的结束。

如果第一个参数大于第二个参数，`substring`方法会自动更换两个参数的位置。

如果参数是负数，`substring`方法会自动将负数转为0。

`String.prototype.indexOf()`方法用于确定一个字符串在另一个字符串中第一次出现的位置，返回结果是匹配开始的位置。如果返回`-1`，就表示不匹配，该方法还可以接受第二个参数，表示从该位置开始向后匹配。

`String.prototype.lastIndexOf()` 方法的用法跟`indexOf`方法一致，主要的区别是`lastIndexOf`从尾部开始匹配，`indexOf`则是从头部开始匹配。

`String.prototype.trim()`方法用于去除字符串两端的空格，返回一个新字符串，不改变原字符串。

`String.prototype.toLowerCase()`方法用于将一个字符串全部转为小写，`toUpperCase`则是全部转为大写。它们都返回一个新字符串，不改变原字符串。

`String.prototype.match()`方法用于确定原字符串是否匹配某个子字符串，返回一个数组，成员为匹配的第一个字符串。如果没有找到匹配，则返回`null`。支持正则表达式作为参数

返回的数组还有`index`属性和`input`属性，分别表示匹配字符串开始的位置和原始字符串。

`String.prototype.search()`方法的用法基本等同于`match`，但是返回值为匹配的第一个位置。如果没有找到匹配，则返回`-1`。

`String.prototype.replace()` 方法用于替换匹配的子字符串，一般情况下只替换第一个匹配（除非使用带有`g`修饰符的正则表达式）。

`String.prototype.split()` 方法按照给定规则分割字符串，返回一个由分割出来的子字符串组成的数组。

```js
'a|b|c'.split('|') // ["a", "b", "c"]
```

`split`方法的第二个参数，决定了返回数组的成员数，支持正则表达式。

## Math 对象

`Math`是 JavaScript 的原生对象，提供各种数学功能。**该对象不是构造函数**，不能生成实例，所有的属性和方法都必须在`Math`对象上调用。

### Math.abs()

`Math.abs`方法返回参数值的绝对值。

### Math.max()

`Math.max`方法返回参数之中最大的那个值

### Math.min()

`Math.min`返回最小的那个值

### Math.floor()

`Math.floor`方法返回**小于或等于**参数值的最大**整数**（地板值）

```js
Math.floor(3.2) // 3
Math.floor(-3.2) // -4
```

### Math.ceil() 

`Math.ceil`方法返回大于或等于参数值的最小整数（天花板值）

```js
Math.ceil(3.2) // 4
Math.ceil(-3.2) // -3
```

### Math.round()

`Math.round`方法用于四舍五入。

### Math.random()

`Math.random()`返回0到1之间的一个伪随机数，可能等于0，但是一定小于1。

任意范围的**随机数**生成函数如下。

```js
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

getRandomArbitrary(1.5, 6.5)
// 2.4942810038223864
```

任意范围的**随机整数**生成函数如下。

```js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

getRandomInt(1, 6) // 5
```

返回**随机字符**的例子如下。

```js
function random_str(length) {
  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  ALPHABET += 'abcdefghijklmnopqrstuvwxyz';
  ALPHABET += '0123456789-_';
  var str = '';
  for (var i = 0; i < length; ++i) {
    var rand = Math.floor(Math.random() * ALPHABET.length);
    str += ALPHABET.substring(rand, rand + 1);
  }
  return str;
}

random_str(6) // "NdQKOr"
```

上面代码中，`random_str`函数接受一个整数作为参数，返回变量`ALPHABET`内的随机字符所组成的指定长度的字符串。

## Date 对象

...

## RegExp 对象

新建正则表达式有两种方法。

一种是使用**字面量**，以斜杠表示开始和结束。

```js
var regex = /xyz/;
```

另一种是使用`RegExp`构造函数。

```js
var regex = new RegExp('xyz');
```

`RegExp`构造函数还可以接受第二个参数，表示修饰符

### 实例方法

#### test()

`RegExp.prototype.` 正则实例对象的`test`方法返回一个布尔值，表示当前模式是否能匹配参数字符串。

```js
/cat/.test('cats and dogs') // true
```

如果正则表达式带有`g`修饰符，则每一次`test`方法都从**上一次结束**的位置开始向后匹配。

> [!tip]
>
> `RegExp.prototype.lastIndex`：返回一个整数，表示下一次开始搜索的位置。该属性可读写，但是只在进行连续搜索时有意义，详细介绍请看后文。

```js
var r = /x/g;
var s = '_x_x';

r.lastIndex // 0
r.test(s) // true

r.lastIndex // 2
r.test(s) // true

r.lastIndex // 4
r.test(s) // false
```

`g`修饰符，表示是全局搜索，可以通过正则对象的`lastIndex`属性指定开始搜索的位置。

#### exec()

`RegExp.prototype.exec()`用来返回匹配结果。如果发现匹配，就返回一个数组，成员是匹配成功的子字符串，否则返回`null`。

如果正则表达式包含圆括号（即含有“**组匹配**”），则返回的数组会包括多个成员。第一个成员是整个匹配成功的结果，后面的成员就是圆括号对应的匹配成功的组。

也就是说，第二个成员对应第一个括号，第三个成员对应第二个括号，以此类推。整个数组的`length`属性等于组匹配的数量再加1。

```js
var s = '_x_x';
var r = /_(x)/;

r.exec(s) // ["_x", "x"]
```

`exec()`方法的返回数组还包含以下两个属性：

- `input`：整个原字符串。
- `index`：模式匹配成功的开始位置（从0开始计数）。

如果正则表达式加上`g`修饰符，则可以使用多次`exec()`方法，下一次搜索的位置从上一次匹配成功结束的位置开始。

利用`g`修饰符允许多次匹配的特点，可以用一个循环完成全部匹配。

```js
var reg = /a/g;
var str = 'abc_abc_abc'

while(true) {
  var match = reg.exec(str);
  if (!match) break;
  console.log('#' + match.index + ':' + match[0]);
}
// #0:a
// #4:a
// #8:a
```

#### match()

`String.prototype.match()`对**字符串**进行正则匹配，返回匹配结果

```js
var s = '_x_x';
var r1 = /x/;
var r2 = /y/;

s.match(r1) // ["x"]
s.match(r2) // null
```

如果正则表达式带有`g`修饰符，则该方法与正则对象的`exec`方法行为不同，**会一次性返回所有匹配成功的结果。**

设置正则表达式的`lastIndex`属性，对`match`方法无效，匹配总是从字符串的第一个字符开始。

#### search()

`String.prototype.search()`返回**第一个满足条件**的匹配结果在整个字符串中的位置。如果没有任何匹配，则返回`-1`。

```js
'_x_x'.search(/x/)
// 1
```

#### replace()

`String.prototype.replace()`方法可以替换匹配的值。它接受两个参数，第一个是正则表达式，表示搜索模式，第二个是替换的内容。

正则表达式如果不加`g`修饰符，就替换第一个匹配成功的值，否则替换所有匹配成功的值。

`replace`方法的一个应用，就是消除字符串首尾两端的空格。

```js
var str = '  #id div.class  ';

str.replace(/^\s+|\s+$/g, '')
// "#id div.class"
```

`replace`方法的第二个参数可以使用美元符号`$`，用来指代所替换的内容。

- `$&`：匹配的子字符串。
- `$``：匹配结果前面的文本。
- `$'`：匹配结果后面的文本。
- `$n`：匹配成功的第`n`组内容，`n`是从1开始的自然数。
- `$$`：指代美元符号`$`。

```js
'hello world'.replace(/(\w+)\s(\w+)/, '$2 $1')
// "world hello"
```

`replace`方法的第二个参数还可以是一个函数，将每一个匹配内容替换为函数返回值。

```js
'3 and 5'.replace(/[0-9]+/g, function (match) {
  return 2 * match;
})
// "6 and 10"

var a = 'The quick brown fox jumped over the lazy dog.';
var pattern = /quick|brown|lazy/ig;

a.replace(pattern, function replacer(match) {
  return match.toUpperCase();
});
// The QUICK BROWN fox jumped over the LAZY dog.
```

函数，可以接受多个参数。

其中，第一个参数是**捕捉到的内容**，第二个参数是捕捉到的**组匹配**（**有多少个组匹配，就有多少个对应的参数**）。

此外，最后还可以添加两个参数，倒数第二个参数是捕捉到的内容在整个字符串中的**位置**（比如从第五个位置开始），最后一个参数是**原字符串**。下面是一个网页模板替换的例子。

#### split()

`String.prototype.split()`方法按照正则规则分割字符串，返回一个由分割后的各个部分组成的数组。

```js
str.split(separator, [limit])
```

该方法接受两个参数，第一个参数是正则表达式，表示分隔规则，第二个参数是返回数组的最大成员数。

## 匹配规则

### 字面量字符

大部分字符在正则表达式中，就是字面的含义，比如`/a/`匹配`a`，`/b/`匹配`b`。

```js
/dog/.test('old dog') // true
```

如果在正则表达式之中，某个字符只表示它字面的含义（就像前面的`a`和`b`），那么它们就叫做“**字面量字符**”（literal characters）。

### 元字符

还有一部分字符有特殊含义，不代表字面的意思。它们叫做“**元字符**”（metacharacters），主要有以下几个。

#### 点字符（.)

点字符（`.`）匹配除回车（`\r`）、换行(`\n`) 、行分隔符（`\u2028`）和段分隔符（`\u2029`）以外的所有字符。注意，对于码点大于`0xFFFF`字符，点字符不能正确匹配，会认为这是两个字符。

```
/c.t/
```

上面代码中，`c.t`匹配`c`和`t`之间包含任意一个字符的情况，只要这三个字符在同一行，比如`cat`、`c2t`、`c-t`等等，但是不匹配`coot`。

#### 位置字符

位置字符用来提示字符所处的位置，主要有两个字符。

- `^` 表示字符串的开始位置
- `$` 表示字符串的结束位置

```js
// test必须出现在开始位置
/^test/.test('test123') // true

// test必须出现在结束位置
/test$/.test('new test') // true

// 从开始位置到结束位置只有test
/^test$/.test('test') // true
/^test$/.test('test test') // false
```

#### 选择符（|）

竖线符号（`|`）在正则表达式中表示“或关系”（OR），即`cat|dog`表示匹配`cat`或`dog`。

**选择符会包括它前后的多个字符**，比如`/ab|cd/`指的是匹配`ab`或者`cd`，而不是指匹配`b`或者`c`。如果想修改这个行为，可以使用圆括号。

```js
/a( |\t)b/.test('a\tb') // true
```

上面代码指的是，`a`和`b`之间有一个空格或者一个制表符。

### 转义符

正则表达式中那些有特殊含义的元字符，如果要匹配它们本身，就需要在它们前面要加上反斜杠。比如要匹配`+`，就要写成`\+`。

```js
/1+1/.test('1+1')
// false

/1\+1/.test('1+1')
// true
```

正则表达式中，需要反斜杠转义的，一共有12个字符：`^`、`.`、`[`、`$`、`(`、`)`、`|`、`*`、`+`、`?`、`{`和`\`。

需要特别注意的是，如果使用`RegExp`方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。

> [!tip]
>
> `RegExp`作为构造函数，参数是一个字符串。但是，在字符串内部，反斜杠也是转义字符，所以它会先被反斜杠转义一次，然后再被正则表达式转义一次，因此需要两个反斜杠转义。

### 特殊字符

正则表达式对一些不能打印的特殊字符，提供了表达方法。

- `\cX` 表示`Ctrl-[X]`，其中的`X`是A-Z之中任一个英文字母，用来匹配控制字符。
- `[\b]` 匹配退格键(U+0008)，不要与`\b`混淆。
- `\n` 匹配换行键。
- `\r` 匹配回车键。
- `\t` 匹配制表符 tab（U+0009）。
- `\v` 匹配垂直制表符（U+000B）。
- `\f` 匹配换页符（U+000C）。
- `\0` 匹配`null`字符（U+0000）。
- `\xhh` 匹配一个以两位十六进制数（`\x00`-`\xFF`）表示的字符。
- `\uhhhh` 匹配一个以四位十六进制数（`\u0000`-`\uFFFF`）表示的 Unicode 字符。

### 字符类

字符类（class）表示有一系列字符可供选择，只要匹配其中一个就可以了。所有可供选择的字符都放在方括号内，比如`[xyz]` 表示`x`、`y`、`z`之中任选一个匹配。

```js
/[abc]/.test('hello world') // false
/[abc]/.test('apple') // true
```

**有两个字符在字符类中有特殊含义。**

**脱字符（^）**

如果方括号内的第一个字符是`[^]`，则表示除了字符类之中的字符，其他字符都可以匹配。比如，`[^xyz]`表示除了`x`、`y`、`z`之外都可以匹配。

```js
/[^abc]/.test('bbc news') // true
/[^abc]/.test('bbc') // false
```

上面代码中，字符串`bbc news`包含`a`、`b`、`c`以外的其他字符，所以返回`true`；字符串`bbc`不包含`a`、`b`、`c`以外的其他字符，所以返回`false`。

> [!tip]
>
> 如果方括号内没有其他字符，即只有`[^]`，就表示匹配一切字符，其中包括换行符。相比之下，点号作为元字符（`.`）是不包括换行符的。

**连字符（-）**

某些情况下，对于连续序列的字符，连字符（`-`）用来提供简写形式，表示字符的连续范围。比如，`[abc]`可以写成`[a-c]`，`[0123456789]`可以写成`[0-9]`，同理`[A-Z]`表示26个大写字母。

**当连字号（dash）不出现在方括号之中，就不具备简写的作用，只代表字面的含义**

> [!caution]
>
> 不要过分使用连字符，设定一个很大的范围，否则很可能选中意料之外的字符。最典型的例子就是`[A-z]`，表面上它是选中从大写的`A`到小写的`z`之间52个字母，但是由于在 ASCII 编码之中，大写字母与小写字母之间还有其他字符，结果就会出现意料之外的结果。
>
> ```js
> /[A-z]/.test('\\') // true
> ```
>
> 上面代码中，由于反斜杠（`\`）的ASCII码在大写字母与小写字母之间，结果会被选中。

### 预定义模式

预定义模式指的是某些常见模式的简写方式。

- `\d` 匹配0-9之间的任一数字，相当于`[0-9]`。
- `\D` 匹配所有0-9以外的字符，相当于`[^0-9]`。
- `\w` 匹配任意的字母、数字和下划线，相当于`[A-Za-z0-9_]`。
- `\W` 除所有字母、数字和下划线以外的字符，相当于`[^A-Za-z0-9_]`。
- `\s` 匹配空格（包括换行符、制表符、空格符等），相等于`[ \t\r\n\v\f]`。
- `\S` 匹配非空格的字符，相当于`[^ \t\r\n\v\f]`。
- `\b` 匹配词的边界。
- `\B` 匹配非词边界，即在词的内部。

```js
// \s 的例子
/\s\w*/.exec('hello world') // [" world"]

// \B 的例子
/\Bworld/.test('hello-world') // false
/\Bworld/.test('helloworld') // true
/\bworld/.test('hello world') // true
/\bworld/.test('hello-world') // true
/\bworld/.test('helloworld') // false

// \B 的例子
/\Bworld/.test('hello-world') // false
/\Bworld/.test('helloworld') // true
```

`\b`表示词的边界，所以`world`的词首必须独立（词尾是否独立未指定），才会匹配。同理，`\B`表示非词的边界，只有`world`的词首不独立，才会匹配。

> [!TIP]
>
> 通常情况下，正则表达式遇到换行符`\n`就会停止匹配。
>
> 可以使用`\s`字符类即可匹配包含换行符

### 重复类

用于描述一个字符出现次数，使用大括号`{}`表示，`{n}`表示只能出现`n`次，`{n,}`表示最少出现`n`次，`{n,m}`表示最少`n`次，最多`m`次

```js
/lo{2}k/.test('look') // true
/lo{2,5}k/.test('looook') // true
```

### 量词符

量词符用来设定某个模式出现的次数。

- `?` 问号表示某个模式出现0次或1次，等同于`{0, 1}`。
- `*` 星号表示某个模式出现0次或多次，等同于`{0,}`。
- `+` 加号表示某个模式出现1次或多次，等同于`{1,}`。

```js
// t 出现0次或1次
/t?est/.test('test') // true
/t?est/.test('est') // true

// t 出现1次或多次
/t+est/.test('test') // true
/t+est/.test('ttest') // true
/t+est/.test('est') // false

// t 出现0次或多次
/t*est/.test('test') // true
/t*est/.test('ttest') // true
/t*est/.test('tttest') // true
/t*est/.test('est') // true
```

### 贪婪模式

刚才讲述的量词符，默认情况下都是最大可能得匹配，即匹配到下一个字符不满足匹配规则为止。这种被称为贪婪模式。

```js
let a = 'aaa';
s.match(/a+/) // ["aaa"]
```

上面的代码中，模式是`a+`，表示匹配一个`a`或者多个`a`，但是其默认是贪婪模式，会一直匹配到字符`a`不出现为止，所以匹配结果是三个字符`a`。

量词符默认是**贪婪模式**，当然也可以改成非贪婪模式，即最小可能匹配。**只要一发现匹配，就返回结果**，不要继续往下检查了。

**把贪婪模式改为非贪婪模式的方式是在量词符的后面添加一个问号。**

```js
var s = 'aaa';
s.match(/a+?/) // ["a"]
```

上面例子中，模式结尾添加了一个问号`/a+?/`，这时就改为非贪婪模式，一旦条件满足，就不再往下匹配，`+?`表示只要发现一个`a`，就不再往下匹配了。

- `+?`：表示某个模式出现1次或多次，匹配时采用非贪婪模式。
- `*?`：表示某个模式出现0次或多次，匹配时采用非贪婪模式。
- `??`：表格某个模式出现0次或1次，匹配时采用非贪婪模式。

### 修饰符

修饰符（modifier）表示模式的附加规则，放在正则模式的最尾部，修饰符可以单个使用，也可以多个一起使用。

```js
// 单个修饰符
var regex = /test/i;

// 多个修饰符
var regex = /test/ig;
```

#### g 修饰符

默认情况下，第一次匹配成功后，正则对象就停止向下匹配了。`g`修饰符表示全局匹配（global），加上它以后，正则对象将匹配全部符合条件的结果，主要用于搜索和替换。

#### i 修饰符

默认情况下，正则对象区分字母的大小写，加上`i`修饰符以后表示忽略大小写（ignoreCase）。

#### m 修饰符

`m`修饰符表示多行模式（multiline），会修改`^`和`$`的行为。

默认情况下（即不加`m`修饰符时），`^`和`$`匹配字符串的开始处和结尾处，加上`m`修饰符以后，`^`和`$`还会匹配行首和行尾，**即`^`和`$`会识别换行符（`\n`）**。

```js
/world$/.test('hello world\n') // false 不匹配换行符 
/world$/m.test('hello world\n') // true
```

```js
/^b/m.test('a\nb') // true
```

上面代码要求匹配行首的`b`，如果不加`m`修饰符，就相当于`b`只能处在字符串的开始处。加上`m`修饰符以后，**换行符`\n`也会被认为是一行的开始。**

### 组匹配

**概述**：正则表达式的括号表示分**组匹配**，括号中的模式可以用来匹配**分组的内容**。

```js
/fred+/.test('fredd') // true
/(fred)+/.test('fredfred') // true
```

上面代码中，第一个模式没有括号，结果`+`只表示**重复字母**`d`，第二个模式有括号，结果`+`就表示匹配`fred`**这个词**。

```js
var m = 'abcabc'.match(/(.)b(.)/);
m
// ['abc', 'a', 'c']	第一个代表整个正则的匹配结果，后面是各组匹配的结果
```

上面代码中，正则表达式`/(.)b(.)/`一共使用两个括号，第一个括号捕获`a`，第二个括号捕获`c`。

> [!TIP]
>
> 注意，使用组匹配时，不宜同时使用`g`修饰符，否则`match`方法不会捕获分组的内容。

```js
var m = 'abcabc'.match(/(.)b(.)/g);
m // ['abc', 'abc']
```

上面代码使用带`g`修饰符的正则表达式，结果`match`方法只捕获了匹配整个表达式的部分。这时必须使用正则表达式的`exec`方法，配合循环，才能读到每一轮匹配的组捕获。

```js
var str = 'abcabc';
var reg = /(.)b(.)/g;
while (true) {
  var result = reg.exec(str);
  if (!result) break;
  console.log(result);
}
// ["abc", "a", "c"]
// ["abc", "a", "c"]
```

**正则表达式内部，还可以用`\n`引用括号匹配的内容**，`n`是从1开始的自然数，表示对应顺序的括号。

```js
/(.)b(.)\1b\2/.test("abcabc")
// true
```

上面的代码中，`\1`表示第一个括号匹配的内容（即`a`），`\2`表示第二个括号匹配的内容（即`c`）。

```js
/y(..)(.)\2\1/.test('yabccab') // true
```

**括号还可以嵌套**。

```js
/y((..)\2)\1/.test('yabababab') // true
```

上面代码中，`\1`指向外层括号，`\2`指向内层括号。

一个匹配网页标签的例子

```js
var tagName = /<([^>]+)>[^<]*<\/\1>/;

tagName.exec("<b>bold</b>")[1]
// 'b'
```

上面代码中，圆括号匹配尖括号之中的标签，而`\1`就表示对应的闭合标签。

上面代码略加修改，就能捕获带有属性的标签。

```js
var html = '<b class="hello">Hello</b><i>world</i>';
var tag = /<(\w+)([^>]*)>(.*?)<\/\1>/g;

var match = tag.exec(html);

match[1] // "b"
match[2] // " class="hello""
match[3] // "Hello"

match = tag.exec(html);

match[1] // "i"
match[2] // ""
match[3] // "world"
```

**非捕获组**

`(?:x)`称为非捕获组（Non-capturing group），表示不返回该组匹配的内容，即匹配的结果中不计入这个括号。

非捕获组的作用请考虑这样一个场景，假定需要匹配`foo`或者`foofoo`，正则表达式就应该写成`/(foo){1, 2}/`，但是这样会占用一个**组匹配**。这时，就可以使用非捕获组，将正则表达式改为`/(?:foo){1, 2}/`，它的作用与前一个正则是一样的，但是不会单独输出括号内部的内容。

```js
var m = 'abc'.match(/(?:.)b(.)/);
m // ["abc", "c"]
```

上面代码中的模式，一共使用了两个括号。其中第一个括号是非捕获组，所以最后返回的结果中没有第一个括号，只有第二个括号匹配的内容。

分解网址的正则表达式。

```js
// 正常匹配
var url = /(http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

url.exec('http://google.com/');
// ["http://google.com/", "http", "google.com", "/"]

// 非捕获组匹配
var url = /(?:http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

url.exec('http://google.com/');
// ["http://google.com/", "google.com", "/"]
```

上面的代码中，前一个正则表达式是正常匹配，第一个括号返回网络协议；后一个正则表达式是非捕获匹配，返回结果中不包括网络协议。

**先行断言**

`x(?=y)`称为先行断言（Positive look-ahead），`x`只有在`y`前面才匹配，`y`不会被计入返回结果。比如，要匹配后面跟着百分号的数字，可以写成`/\d+(?=%)/`。

“先行断言”中，括号里的部分是不会返回的。

```js
var m = 'abc'.match(/b(?=c)/);
m // ["b"]
```

上面的代码使用了先行断言，`b`在`c`前面所以被匹配，但是括号对应的`c`不会被返回。

**先行否定断言**

`x(?!y)`称为先行否定断言（Negative look-ahead），`x`只有不在`y`前面才匹配，`y`不会被计入返回结果。比如，要匹配后面跟的不是百分号的数字，就要写成`/\d+(?!%)/`。

```js
/\d+(?!\.)/.exec('3.14')
// ["14"]
```

上面代码中，正则表达式指定，只有不在小数点前面的数字才会被匹配，因此返回的结果就是`14`。

“先行否定断言”中，括号里的部分是不会返回的。

```js
var m = 'abd'.match(/b(?!c)/);
m // ['b']
```

上面的代码使用了先行否定断言，`b`不在`c`前面所以被匹配，而且括号对应的`d`不会被返回。

## JSON 格式

json格式是一种数据交换的文本格式，目的就是取代繁琐笨重的XML格式。

每个json对象的就是一个值，可能是一个数组或者对象，也可能是一个原始类型的值。总是，**只能是一个值，不能是两个值。**

### 类型和格式

json对类型和格式有严格要求：

复合类型的值**只能是数组或者对象**，不能是函数，正则表达式对象，日期对象

原始类型的值只有四种：字符串，数值（十进制），布尔值和`null`，不能使用`NaN`, `Infinity`, `-Infinity`和`undefined`

字符串必须使用双引号表示，不能使用单引号。

对象的键名必须放在**双引号**里面

数组或对象最后一个成员的后面，不能加逗号。

### JSON 对象

`JSON`对象是 JavaScript 的原生对象，用来处理 JSON 格式数据。它有两个静态方法：`JSON.stringify()`和`JSON.parse()`。

### JSON.stringify()

#### 基本用法

`JSON.stringify()`方法用于将一个值转为 JSON 字符串。该字符串符合 JSON 格式，并且可以被`JSON.parse()`方法还原。

**注意**，对于原始类型的字符串，转换结果会带双引号。

如果对象的属性是`undefined`、函数或 XML 对象，该属性会被`JSON.stringify()`过滤。

```js
var obj = {
  a: undefined,
  b: function () {}
};

JSON.stringify(obj) // "{}"
```

如果数组的成员是`undefined`、函数或 XML 对象，则这些值被转成`null`。

正则对象会被转成空对象。

`JSON.stringify()`方法会忽略对象的**不可遍历的属性**。

#### 第二个参数

`JSON.stringify()`方法还可以接受一个数组，作为第二个参数，指定参数对象的哪些属性需要转成字符串。

```js
var obj = {
  'prop1': 'value1',
  'prop2': 'value2',
  'prop3': 'value3'
};

var selectedProperties = ['prop1', 'prop2'];

JSON.stringify(obj, selectedProperties)
// "{"prop1":"value1","prop2":"value2"}"
```

这个类似**白名单**的数组，**只对对象的属性有效，对数组无效**。

第二个参数还可以是一个函数，用来更改`JSON.stringify()`的返回值。

```js
function f(key, value) {
  if (typeof value === "number") {
    value = 2 * value;
  }
  return value;
}

JSON.stringify({ a: 1, b: 2 }, f)
// '{"a": 2,"b": 4}'
```

上面代码中的`f`函数，接受两个参数，分别是被转换的对象的键名和键值。如果键值是数值，就将它乘以`2`，否则就原样返回。

**注意**，这个处理函数是递归处理所有的键。

#### 第三个参数

`JSON.stringify()`还可以接受第三个参数，用于增加返回的 JSON 字符串的可读性。

默认返回的是单行字符串，对于大型的 JSON 对象，可读性非常差。第三个参数使得每个属性单独占据一行，并且将每个属性前面添加指定的前缀（不超过10个字符）。

```js
// 默认输出
JSON.stringify({ p1: 1, p2: 2 })
// JSON.stringify({ p1: 1, p2: 2 })

// 分行输出
JSON.stringify({ p1: 1, p2: 2 }, null, '\t')
// {
// 	"p1": 1,
// 	"p2": 2
// }
```

上面例子中，第三个属性`\t`在每个属性前面添加一个制表符，然后分行显示。

第三个属性如果是一个数字，则表示每个属性前面添加的空格（最多不超过10个）。

```js
JSON.stringify({ p1: 1, p2: 2 }, null, 2);
/*
"{
  "p1": 1,
  "p2": 2
}"
*/
```

### toJSON()

如果参数对象有自定义的`toJSON()`方法，那么`JSON.stringify()`会使用这个方法的返回值作为参数，而忽略原对象的其他属性。

::: code-group
```js [有toJSON]
var user = {
  firstName: '三',
  lastName: '张',

  get fullName(){
    return this.lastName + this.firstName;
  }
};

JSON.stringify(user)
// "{"firstName":"三","lastName":"张","fullName":"张三"}"
```

```js [无toJSON]
var user = {
  firstName: '三',
  lastName: '张',

  get fullName(){
    return this.lastName + this.firstName;
  },

  toJSON: function () {
    return {
      name: this.lastName + this.firstName
    };
  }
};

JSON.stringify(user)
// "{"name":"张三"}"
```
:::

`Date`对象就有一个自己的`toJSON()`方法。

```js
var date = new Date('2015-01-01');
date.toJSON() // "2015-01-01T00:00:00.000Z"
JSON.stringify(date) // ""2015-01-01T00:00:00.000Z""
```

`toJSON()`方法的一个应用是，将正则对象自动转为字符串。因为`JSON.stringify()`默认不能转换正则对象，但是设置了`toJSON()`方法以后，就可以转换正则对象了。

```js
var obj = {
  reg: /foo/
};

// 不设置 toJSON 方法时
JSON.stringify(obj) // "{"reg":{}}"

// 设置 toJSON 方法时
RegExp.prototype.toJSON = RegExp.prototype.toString;
JSON.stringify(/foo/) // ""/foo/""
```

### JSON.parse()

`JSON.parse()`方法用于将 JSON 字符串转换成对应的值。

```js
var o = JSON.parse('{"name": "张三"}');
o.name // 张三
```

如果传入的字符串不是有效的 JSON 格式，`JSON.parse()`方法将报错。

`JSON.parse()`方法可以接受一个处理函数，作为第二个参数，用法与`JSON.stringify()`方法类似。

```js
function f(key, value) {
  if (key === 'a') {
    return value + 10;
  }
  return value;
}

JSON.parse('{"a": 1, "b": 2}', f)
// {a: 11, b: 2}
```

### 深拷贝

`JSON.parse()`和`JSON.stringify()`可以结合使用，像下面这样写，实现对象的深拷贝。

```js
JSON.parse(JSON.stringify(obj))
```

上面这种写法，可以深度克隆一个对象，但是对象内部不能有 JSON
不允许的数据类型，比如函数、正则对象、日期对象等。

## 面向对象编程

**面向对象编程**是目前主流的编程范式。它将真实世界各种复杂的关系，抽象为一个个对象，然后由对象之间的分工与合作，完成对真实世界的模拟。

每一个对象都是功能中心，具有明确分工，可以完成接受信息、处理数据、发出信息等任务。对象可以复用，通过继承机制还可以定制。

因此，面向对象编程具有灵活、代码可复用、高度模块化等特点，容易维护和开发，比起由一系列函数或指令组成的传统的**过程式编程**，更适合多人合作的大型软件项目。

那么，**对象**（object）到底是什么？我们从两个层次来理解。

**（1）对象是单个实物的抽象。**

一本书、一辆汽车、一个人都可以是对象，一个数据库、一张网页、一个远程服务器连接也可以是对象。当实物被抽象成对象，实物之间的关系就变成了对象之间的关系，从而就可以模拟现实情况，针对对象进行编程。

**（2）对象是一个容器，封装了属性（property）和方法（method）。**

属性是对象的状态，方法是对象的行为（完成某种任务）。比如，我们可以把动物抽象为`animal`对象，使用“属性”记录具体是哪一种动物，使用“方法”表示动物的某种行为（奔跑、捕猎、休息等等）。

### 构造函数

面向对象编程的第一步，就是要生成对象。前面说过，对象是**单个实物的抽象**。

通常需要一个模板，表示某一类实物的共同特征，然后对象根据这个模板生成。

典型的面向对象编程语言（比如 C++ 和 Java），都有“类”（class）这个概念。所谓“类”就是对象的模板，对象就是“类”的实例。

但是，JavaScript 语言的对象体系，不是基于“类”的，而是基于构造函数（constructor）和原型链（prototype）。

JavaScript 语言使用**构造函数**（constructor）作为**对象的模板**。

所谓”**构造函数**”，就是专门用来生成实例对象的函数。它就是对象的模板，描述实例对象的基本结构。一个构造函数，可以生成多个实例对象，这些实例对象都有相同的结构。

构造函数就是一个普通的函数，**但具有自己的特征和用法**。

```js
var Vehicle = function () {
  this.price = 1000;
};
```

上面代码中，`Vehicle`就是构造函数。为了与普通函数区别，构造函数名字的**第一个字母通常大写。**

构造函数的特点有两个。

- 函数体内部使用了`this`关键字，代表了所要生成的对象实例（可以往生成的实例对象上挂载属性）。
- 生成对象的时候，必须使用`new`命令。

### new 命令

`new`命令的作用，就是执行构造函数，返回一个实例对象。

```js
var Vehicle = function () {
  this.price = 1000;
};

var v = new Vehicle();
v.price // 1000
```

上面代码通过`new`命令，让构造函数`Vehicle`生成一个实例对象，保存在变量`v`中。这个新生成的实例对象，从构造函数`Vehicle`得到了`price`属性。

`new`命令执行时，构造函数内部的`this`，就代表了新生成的实例对象，`this.price`表示实例对象有一个`price`属性，值是1000。

使用`new`命令时，根据需要，构造函数也可以接受参数。

```js
var Vehicle = function (p) {
  this.price = p;
};

var v = new Vehicle(500);
```

`new`命令本身就可以执行构造函数，所以后面的构造函数可以带括号，也可以不带括号。

如果忘了使用`new`命令，直接调用构造函数，此时构造函数就变成了普通函数，并不会生成实例对象。而且由于后面会说到的原因，`this`这时代表**全局对象**，将造成一些意想不到的结果。

```js
console.log(this);
// Window {window: Window, self: Window, document: document, name: '', location: Location, …}
```

```js
var Vehicle = function (){
  this.price = 1000;
};

var v = Vehicle();
v // undefined
price // 1000
```

上面代码中，调用`Vehicle`构造函数时，忘了加上`new`命令。结果，变量`v`变成了`undefined`，而`price`属性变成了全局变量。

为了保证构造函数必须与`new`命令一起使用，一个解决办法是，构造函数内部使用**严格模式**，即第一行加上`use strict`。这样的话，一旦忘了使用`new`命令，直接调用构造函数就会报错。

```js
function Fubar(foo, bar){
  'use strict';
  this._foo = foo;
  this._bar = bar;
}

Fubar()
// TypeError: Cannot set property '_foo' of undefined
```

上面代码的`Fubar`为构造函数，`use strict`命令保证了该函数在严格模式下运行。

由于严格模式中，函数内部的`this`不能指向全局对象，默认等于`undefined`，导致不加`new`调用会报错（JavaScript 不允许对`undefined`添加属性）。

另一个解决办法，构造函数内部判断是否使用`new`命令，如果发现没有使用，则直接返回一个实例对象。

```js
function Fubar(foo, bar) {
  if (!(this instanceof Fubar)) {
    return new Fubar(foo, bar);
  }

  this._foo = foo;
  this._bar = bar;
}

Fubar(1, 2)._foo // 1
(new Fubar(1, 2))._foo // 1
```

上面代码中的构造函数，不管加不加`new`命令，都会得到同样的结果。

### new 命令的原理

使用`new`命令时，它后面的函数依次执行下面的步骤。

1. 创建一个空对象，作为将要返回的对象实例。
2. 将这个空对象的原型，指向构造函数的`prototype`属性。
3. 将这个空对象赋值给函数内部的`this`关键字。
4. 开始执行构造函数内部的代码。

也就是说，构造函数内部，`this`指的是一个新生成的空对象，所有针对`this`的操作，都会发生在这个空对象上。

构造函数之所以叫“构造函数”，就是说这个函数的目的，就是操作一个空对象（即`this`对象），将其“构造”为需要的样子。

如果构造函数内部有`return`语句，而且`return`后面跟着一个**对象**，`new`命令会返回`return`语句指定的对象；否则，就会不管`return`语句，返回`this`对象。

```js
var Vehicle = function () {
  this.price = 1000;
  return 1000;	// 非对象
};

(new Vehicle()) === 1000
// false
```

上面代码中，构造函数`Vehicle`的`return`语句返回一个数值。这时，`new`命令就会忽略这个`return`语句，返回“构造”后的`this`对象。

但是，如果`return`语句返回的是一个跟`this`无关的新对象，`new`命令会返回这个新对象，而不是`this`对象。这一点需要特别引起注意。

```js
var Vehicle = function (){
  this.price = 1000;
  return { price: 2000 };
};

(new Vehicle()).price
// 2000
```

另一方面，如果对普通函数（内部没有`this`关键字的函数）使用`new`命令，则会返回一个空对象。

```js
function getMessage() {
  return 'this is a message';
}

var msg = new getMessage();

msg // {}
typeof msg // "object"
```

上面代码中，`getMessage`是一个普通函数，返回一个字符串。对它使用`new`命令，会得到一个空对象。这是因为`new`命令总是返回一个对象，要么是实例对象，要么是`return`语句指定的对象。本例中，`return`语句返回的是字符串，所以`new`命令就忽略了该语句。

### 手搓简化new命令

```js
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数
  var result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return (typeof result === 'object' && result != null) ? result : context;
}

// 实例
var actor = _new(Person, '张三', 28);
```

### new.target

函数内部可以使用`new.target`属性。如果当前函数是`new`命令调用，`new.target`指向当前函数，否则为`undefined`。

```js
function f() {
  console.log(new.target === f);
}

f() // false
new f() // true
```

使用这个属性，可以判断函数调用的时候，是否使用`new`命令。

```js
function f() {
  if (!new.target) {
    throw new Error('请使用 new 命令调用！');
  }
  // ...
}

f() // Uncaught Error: 请使用 new 命令调用！
```

### Object.create()

构造函数作为模板，可以生成实例对象。但是，有时拿不到构造函数，只能拿到一个现有的对象。我们希望以这个现有的对象作为模板，生成新的实例对象，这时就可以使用`Object.create()`方法。

```js
var person1 = {
  name: '张三',
  age: 38,
  greeting: function() {
    console.log('Hi! I\'m ' + this.name + '.');
  }
};

var person2 = Object.create(person1);

person2.name // 张三
person2.greeting() // Hi! I'm 张三.
```

上面代码中，对象`person1`是`person2`的模板，后者继承了前者的属性和方法。

### this关键字

前一章已经提到，`this`可以用在构造函数之中，表示实例对象。

除此之外，`this`还可以用在别的场合。但不管是什么场合，`this`都有一个共同点：它总是返回一个对象。

简单说，`this`**就是属性或方法当前所在的对象**。

```js
var person = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

person.describe()
// "姓名：张三"
```

上面代码中，`this.name`表示`name`属性所在的那个对象。

由于`this.name`是在`describe`方法中调用，而`describe`方法所在的当前对象是`person`，因此`this`指向`person`，`this.name`就是`person.name`。

由于对象的属性可以赋给另一个对象，所以属性所在的当前对象是可变的，即`this`的指向是可变的。

```js
var A = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

var B = {
  name: '李四'
};

B.describe = A.describe;
B.describe()
// "姓名：李四"
```

上面代码中，`A.describe`属性被赋给`B`，于是`B.describe`就表示`describe`方法所在的当前对象是`B`，所以`this.name`就指向`B.name`。

稍稍重构这个例子，`this`的动态指向就能看得更清楚。

```js
function f() {
  return '姓名：'+ this.name;
}

var A = {
  name: '张三',
  describe: f
};

var B = {
  name: '李四',
  describe: f
};

A.describe() // "姓名：张三"
B.describe() // "姓名：李四"
```

上面代码中，函数`f`内部使用了`this`关键字，随着`f`所在的对象不同，`this`的指向也不同。

**只要函数被赋给另一个变量，`this`的指向就会变**。

```js
var A = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

var name = '李四';	// 顶层属性（window对象）
var f = A.describe;
f() // "姓名：李四"
```

上面代码中，`A.describe`被赋值给变量`f`，内部的`this`就会指向`f`运行时所在的对象（本例是顶层对象）

**网页编程的例子**

```html
<input type="text" name="age" size=3 onChange="validate(this, 18, 99);">

<script>
function validate(obj, lowval, hival){
  if ((obj.value < lowval) || (obj.value > hival))
    console.log('Invalid Value!');
}
</script>
```

每当用户输入一个值，就会调用`onChange`回调函数，验证这个值是否在指定范围。**浏览器会向回调函数传入当前对象**，因此`this`就代表传入当前对象（即文本框），然后就可以从`this.value`上面读到用户的输入值。

总结一下，JavaScript 语言之中，一切皆对象，运行环境也是对象，所以函数都是在某个对象之中运行，`this`就是函数运行时所在的对象（环境）。

这本来并不会让用户糊涂，但是 JavaScript 支持运行环境动态切换，也就是说，`this`的指向是动态的，没有办法事先确定到底指向哪个对象。

### this实质

JavaScript 语言之所以有 this 的设计，跟内存里面的数据结构有关系。

```js
var obj = { foo:  5 };
```

上面的代码将一个对象赋值给变量`obj`。JavaScript 引擎会先在内存里面，生成一个对象`{ foo: 5 }`，然后把这个对象的内存地址赋值给变量`obj`。

也就是说，变量`obj`是一个地址（reference）。

后面如果要读取`obj.foo`，引擎先从`obj`拿到内存地址，然后再从该地址读出原始的对象，返回它的`foo`属性。

原始的对象以字典结构保存，每一个属性名都对应一个属性描述对象。

举例来说，上面例子的`foo`属性，实际上是以下面的形式保存的。

```js
{
  foo: {
    [[value]]: 5
    [[writable]]: true
    [[enumerable]]: true
    [[configurable]]: true
  }
}
```

注意，`foo`属性的值保存在属性描述对象的`value`属性里面。

这样的结构是很清晰的，问题在于属性的值可能是一个函数。

```js
var obj = { foo: function () {} };
```

这时，引擎会将函数单独保存在内存中，然后再将函数的地址赋值给`foo`属性的`value`属性。

```js
{
  foo: {
    [[value]]: 函数的地址
    ...
  }
}
```

由于函数是一个单独的值，所以它可以在不同的环境（上下文）执行。

```js
var f = function () {};
var obj = { f: f };

// 单独执行
f()

// obj 环境执行
obj.f()
```

JavaScript 允许在函数体内部，引用当前环境的其他变量。

```js
var f = function () {
  console.log(x);
};
```

上面代码中，函数体里面使用了变量`x`。该变量由运行环境提供。

现在问题就来了，由于函数可以在不同的运行环境执行，所以需要有一种机制，能够在函数体内部获得当前的运行环境（context）。

所以，`this`就出现了，它的设计目的就是在函数体内部，指代函数当前的运行环境。

```js
var f = function () {
  console.log(this.x);
}
```

上面代码中，函数体里面的`this.x`就是指当前运行环境的`x`。

```js
var f = function () {
  console.log(this.x);
}

var x = 1;
var obj = {
  f: f,
  x: 2,
};

// 单独执行
f() // 1

// obj 环境执行
obj.f() // 2
```

上面代码中，函数`f`在全局环境执行，`this.x`指向全局环境的`x`；在`obj`环境执行，`this.x`指向`obj.x`。

### this场景

`this`主要有以下几个使用场合。

#### 全局环境

全局环境使用`this`，它指的就是顶层对象`window`。

```js
this === window // true
```

#### 构造函数

构造函数中的`this`，指的是实例对象。

```js
var Obj = function (p) {
  this.p = p;
};
```

上面代码定义了一个构造函数`Obj`。由于`this`指向实例对象，所以在构造函数内部定义`this.p`，就相当于定义实例对象有一个`p`属性。

```js
var o = new Obj('Hello World!');
o.p // "Hello World!"
```

#### 对象的方法

如果**对象**的**方法**里面包含`this`，`this`的指向就是方法运行时所在的对象。该方法赋值给另一个对象，就会改变`this`的指向。

```js
var obj ={
  foo: function () {
    console.log(this);
  }
};

obj.foo() // obj
```

上面代码中，`obj.foo`方法执行时，它内部的`this`指向`obj`。

下面这几种用法，都会改变`this`的指向。

```js
// 情况一
(obj.foo = obj.foo)() // window
// 情况二
(false || obj.foo)() // window
// 情况三
(1, obj.foo)() // window
```

上面代码中，`obj.foo`就是一个值。这个值真正调用的时候，运行环境已经不是`obj`了，而是全局环境，所以`this`不再指向`obj`。

可以这样理解，JavaScript 引擎内部，`obj`和`obj.foo`储存在两个内存地址，称为地址一和地址二。

`obj.foo()`这样调用时，是从地址一调用地址二，因此地址二的运行环境是地址一，`this`指向`obj`。

但是，上面三种情况，都是直接取出地址二进行调用，这样的话，运行环境就是全局环境，因此`this`指向全局环境。上面三种情况等同于下面的代码。

```js
// 情况一
(obj.foo = function () {
  console.log(this);
})()
// 等同于
(function () {
  console.log(this);
})()

// 情况二
(false || function () {
  console.log(this);
})()

// 情况三
(1, function () {
  console.log(this);
})()
```

如果`this`所在的方法不在对象的**第一层**，这时`this`只是指向**当前一层的对象**，而不会继承更上面的层。

```js
var a = {
  p: 'Hello',
  b: {
    m: function() {
      console.log(this.p);
    }
  }
};

a.b.m() // undefined
```

上面代码中，`a.b.m`方法在`a`对象的第二层，该方法内部的`this`不是指向`a`，而是指向`a.b`，因为实际执行的是下面的代码。

```js
var b = {
  m: function() {
   console.log(this.p);
  }
};

var a = {
  p: 'Hello',
  b: b
};

(a.b).m() // 等同于 b.m()
```

如果要达到预期效果，只有写成下面这样。

```js
var a = {
  b: {
    m: function() {
      console.log(this.p);
    },
    p: 'Hello'
  }
};
```

如果这时将嵌套对象内部的方法赋值给一个变量，`this`依然会指向全局对象。

```js
var a = {
  b: {
    m: function() {
      console.log(this.p);
    },
    p: 'Hello'
  }
};

var hello = a.b.m;
hello() // undefined
```

上面代码中，`m`是多层对象内部的一个方法。为求简便，将其赋值给`hello`变量，结果调用时，`this`指向了顶层对象。为了避免这个问题，可以只将`m`所在的对象赋值给`hello`，这样调用时，`this`的指向就不会变。

```js
var hello = a.b;
hello.m() // Hello
```

### this注意点

#### 避免多层 this

由于`this`的指向是不确定的，所以切勿在函数中包含多层的`this`。

```js
var o = {
  f1: function () {
    console.log(this);
    var f2 = function () {
      console.log(this);
    }();
  }
}

o.f1()
// Object
// Window
```

上面代码包含两层`this`，结果运行后，第一层指向对象`o`，第二层指向全局对象，因为实际执行的是下面的代码。

```
var temp = function () {
  console.log(this);
};

var o = {
  f1: function () {
    console.log(this);
    var f2 = temp();
  }
}
```

一个解决方法是在第二层改用一个指向外层`this`的变量。

```js
var o = {
  f1: function() {
    console.log(this);
    var that = this;
    var f2 = function() {
      console.log(that);
    }();
  }
}

o.f1()
// Object
// Object
```

上面代码定义了变量`that`，固定指向外层的`this`，然后在内层使用`that`，就不会发生`this`指向的改变。

**事实上，使用一个变量固定`this`的值，然后内层函数调用这个变量，是非常常见的做法，请务必掌握。**

JavaScript 提供了严格模式，也可以硬性避免这种问题。严格模式下，如果函数内部的`this`指向顶层对象，就会报错。

```js
var counter = {
  count: 0
};
counter.inc = function () {
  'use strict';
  this.count++
};
var f = counter.inc;
f()
// TypeError: Cannot read property 'count' of undefined
```

上面代码中，`inc`方法通过`'use strict'`声明采用严格模式，这时内部的`this`一旦指向顶层对象，就会报错。

#### 数组this

避免数组处理方法中的 this，数组的`map`和`foreach`方法，允许提供一个函数作为参数。这个函数内部不应该使用`this`。

```js
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    });
  }
}

o.f()
// undefined a1
// undefined a2
```

上面代码中，`foreach`方法的回调函数中的`this`，其实是指向`window`对象，因此取不到`o.v`的值。原因跟上一段的多层`this`是一样的，**就是内层的`this`不指向外部，而指向顶层对象**。

解决这个问题的一种方法，就是前面提到的，使用中间变量固定`this`。

```js
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    var that = this;
    this.p.forEach(function (item) {
      console.log(that.v+' '+item);
    });
  }
}

o.f()
// hello a1
// hello a2
```

另一种方法是将`this`当作`foreach`方法的第二个参数，固定它的运行环境。

#### 回调函数this

回调函数中的`this`往往会改变指向，最好避免使用。

```js
var o = new Object();
o.f = function () {
  console.log(this === o);
}

// jQuery 的写法
$('#button').on('click', o.f);
```

上面代码中，点击按钮以后，控制台会显示`false`。原因是此时`this`不再指向`o`对象，而是指向按钮的 DOM 对象，因为`f`方法是在按钮对象的环境中被调用的。这种细微的差别，很容易在编程中忽视，导致难以察觉的错误。

为了解决这个问题，可以采用下面的一些方法对`this`进行绑定，也就是使得`this`固定指向某个对象，减少不确定性。

### this绑定

`this`的动态切换，固然为 JavaScript 创造了巨大的灵活性，但也使得编程变得困难和模糊。

有时，需要把`this`固定下来，避免出现意想不到的情况。

JavaScript 提供了`call`、`apply`、`bind`这三个方法，来切换/固定`this`的指向。

#### call()

`Function.prototype.call()`，函数实例的`call`方法，可以指定函数内部`this`的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。

```js
var obj = {};

var f = function () {
  return this;
};

f() === window // true
f.call(obj) === obj // true
// 调用f()函数同时指定它执行所在的作用域
```

`call`方法的参数，应该是一个**对象**。如果参数为空、`null`和`undefined`，则默认传入**全局对象。**

```js
var n = 123;
var obj = { n: 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```

如果`call`方法的参数是一个原始值，那么**这个原始值会自动转成对应的包装对象**，然后传入`call`方法。

```js
var f = function () {
  return this;
};

f.call(5)
// Number {[[PrimitiveValue]]: 5}
```

上面代码中，`call`的参数为`5`，不是对象，会被自动转成包装对象（`Number`的实例），绑定`f`内部的`this`。

`call`方法还可以接受多个参数。

```js
func.call(thisValue, arg1, arg2, ...)
```

`call`的第一个参数就是`this`所要指向的那个对象，后面的参数则是**函数调用时所需的参数**。

`call`方法的一个应用是调用对象的**原生方法**（**防止中间层覆盖影响结果**）。

```js
var obj = {};
obj.hasOwnProperty('toString') // false

// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
  return true;
};
obj.hasOwnProperty('toString') // true	（结果被影响）

Object.prototype.hasOwnProperty.call(obj, 'toString') // false （不受影响）
```

上面代码中，`hasOwnProperty`是`obj`对象继承的方法，如果这个方法一旦被覆盖，就不会得到正确结果。

`call`方法可以解决这个问题，它将`hasOwnProperty`方法的原始定义放到`obj`对象上执行，这样无论`obj`上有没有同名方法，都不会影响结果。

#### apply()

`Function.prototype.apply()`方法的作用与`call`方法类似，也是改变`this`指向，然后再调用该函数。唯一的区别就是，它接收一个数组作为函数执行时的参数，使用格式如下。

```js
func.apply(thisValue, [arg1, arg2, ...])
```

`apply`方法的第一个参数也是`this`所要指向的那个对象，如果设为`null`或`undefined`，则等同于指定全局对象。第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。

原函数的参数，在`call`方法中必须一个个添加，但是在`apply`方法中，**必须以数组形式添加。**

```js
function f(x, y){
  console.log(x + y);
}

f.call(null, 1, 1) // 2
f.apply(null, [1, 1]) // 2
```

利用这一点，可以做一些有趣的应用。

**找出数组最大元素**

JS不提供找出数组最大元素的函数。结合使用`apply`方法和`Math.max`方法，就可以返回数组的最大元素。

```js
var a = [10, 2, 4, 15, 9];
Math.max.apply(null, a) // 15
// null则为全局对象
```

**将数组的空元素变为`undefined`**

通过`apply`方法，利用`Array`构造函数将数组的空元素变成`undefined`

```js
Array.apply(null, ['a', ,'b'])
// [ 'a', undefined, 'b' ]
```

空元素与`undefined`的差别在于，数组的`forEach`方法会跳过空元素，但是不会跳过`undefined`。因此，遍历内部元素的时候，会得到不同的结果。

**转换类似数组的对象**

另外，利用数组对象的`slice`方法，可以将一个类似数组的对象（比如`arguments`对象）转为真正的数组。

```js
Array.prototype.slice.apply({0: 1, length: 1}) // [1]
Array.prototype.slice.apply({0: 1}) // []
Array.prototype.slice.apply({0: 1, length: 2}) // [1, undefined]
Array.prototype.slice.apply({length: 1}) // [undefined]
```

这个方法起作用的前提是，被处理的对象必须有`length`属性，以及相对应的数字键。

#### bind()

`Function.prototype.bind()`方法用于将函数体内的`this`绑定到某个对象，然后返回一个新函数。

```js
var d = new Date();
d.getTime() // 1481869925657

var print = d.getTime;
print() // Uncaught TypeError: this is not a Date object.
```

我们将`d.getTime()`方法赋给变量`print`，然后调用`print()`就报错了。这是因为`getTime()`方法内部的`this`，绑定`Date`对象的实例，赋给变量`print`以后，内部的`this`已经不指向`Date`对象的实例了。

使用`bind()`解决

```js
var print = d.getTime.bind(d);
print() // 1481869925657
```

上面的代码中，将`d.getTime`方法赋值给`print`的时候绑定其内部的this的指向为`d`，否则`this`的指向为`print`。

`bind`方法的参数就是所要绑定`this`的对象，下面是一个更清晰的例子。

```js
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var func = counter.inc.bind(counter);
func();
counter.count // 1
```

上面代码中，`counter.inc()`方法被赋值给变量`func`。这时必须用`bind()`方法将`inc()`内部的`this`，绑定到`counter`，否则就会出错。

`this`绑定到其他对象也是可以的。

```js
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var obj = {
  count: 100
};
var func = counter.inc.bind(obj);
func();
obj.count // 101
```

`bind()`**还可以接受更多的参数，将这些参数绑定原函数的参数。**

```js
var add = function (x, y) {
  return x * this.m + y * this.n;
}

var obj = {
  m: 2,
  n: 2
};

var newAdd = add.bind(obj, 5);
newAdd(5) // 20
```

上面代码中，`bind()`方法除了绑定`this`对象，**还将`add()`函数的第一个参数`x`绑定成`5`**，然后返回一个新函数`newAdd()`，这个函数只要再接受一个参数`y`就能运行了。

如果`bind()`方法的第一个参数是`null`或`undefined`，等于将`this`绑定到全局对象，函数运行时`this`指向顶层对象（浏览器为`window`）

##### **注意点**

###### **每一次返回一个新函数**

`bind()`**方法每运行一次，就返回一个新函数**，这会产生一些问题。比如，监听事件的时候，不能写成下面这样。

```js
element.addEventListener('click', o.m.bind(o));
```

`click`事件绑定`bind()`方法生成的一个匿名函数。这样会导致无法取消绑定，所以下面的代码是无效的。

```js
element.removeEventListener('click', o.m.bind(o));
```

正确的方法是写成下面这样:
```js
var listener = o.m.bind(o);	// 给生成的函数命名
element.addEventListener('click', listener);
//  ...
element.removeEventListener('click', listener);
```

###### **结合回调函数使用**

回调函数是 JavaScript 最常用的模式之一，但是一个常见的错误是，将包含`this`的方法直接当作回调函数。解决方法就是使用`bind()`方法，将`counter.inc()`绑定`counter`。

```js
var counter = {
  count: 0,
  inc: function () {
    'use strict';
    this.count++;
  }
};

function callIt(callback) {
  callback();
}

callIt(counter.inc.bind(counter));
counter.count // 1
```

上面代码中，`callIt()`方法会调用回调函数。这时如果直接把`counter.inc`传入，调用时`counter.inc()`内部的`this`就会指向**全局对象**。

使用`bind()`方法将`counter.inc`绑定`counter`以后，就不会有这个问题，`this`总是指向`counter`。

还有一种情况比较隐蔽，就是某些数组方法可以接受一个函数当作参数。这些函数内部的`this`指向，很可能也会出错。

```js
var obj = {
  name: '张三',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    });
  }
};

obj.print()
// 没有任何输出
```

上面代码中，`obj.print`内部`this.times`的`this`是指向`obj`的，这个没有问题。但是，`forEach()`方法的回调函数内部的`this.name`却是指向全局对象，导致没有办法取到值。稍微改动一下，就可以看得更清楚。

```js
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this === window);
  });
};

obj.print()
// true
// true
// true
```

解决这个问题，也是通过`bind()`方法绑定`this`。

```js
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this.name);
  }.bind(this));
};

obj.print()
// 张三
// 张三
// 张三
```

###### **结合`call()`方法使用**

利用`bind()`方法，可以改写一些 JavaScript 原生方法的使用形式，以数组的`slice()`方法为例。

```js
[1, 2, 3].slice(0, 1) // [1]
// 等同于
Array.prototype.slice.call([1, 2, 3], 0, 1) // [1]
```

上面的代码中，数组的`slice`方法从`[1, 2, 3]`里面，按照指定的开始位置和结束位置，切分出另一个数组。这样做的本质是在`[1, 2, 3]`上面调用`Array.prototype.slice()`方法，因此可以用`call`方法表达这个过程，得到同样的结果。

##### **改写原生方法**

`call()`方法实质上是调用`Function.prototype.call()`方法，因此上面的表达式可以用`bind()`方法改写。

```js
var slice = Function.prototype.call.bind(Array.prototype.slice);
slice([1, 2, 3], 0, 1) // [1]
```

上面代码的含义就是，将`Array.prototype.slice`变成`Function.prototype.call`方法所在的对象，调用时就变成了`Array.prototype.slice.call`。类似的写法还可以用于其他数组方法。

```js
var push = Function.prototype.call.bind(Array.prototype.push);
var pop = Function.prototype.call.bind(Array.prototype.pop);

var a = [1 ,2 ,3];
push(a, 4)
a // [1, 2, 3, 4]

pop(a)
a // [1, 2, 3]
```

如果再进一步，将`Function.prototype.call`方法绑定到`Function.prototype.bind`对象，就意味着`bind`的调用形式也可以被改写。

```js
function f() {
  console.log(this.v);
}

var o = { v: 123 };
var bind = Function.prototype.call.bind(Function.prototype.bind);
bind(f, o)() // 123
```

上面代码的含义就是，将`Function.prototype.bind`方法绑定在`Function.prototype.call`上面，所以`bind`方法就可以直接使用，不需要在函数实例上使用。

### 对象的继承

面向对象编程很重要的一个方面，就是对象的继承。A 对象通过继承 B 对象，就能直接拥有 B 对象的所有属性和方法。这对于代码的复用是非常有用的。

大部分面向对象的编程语言，都是通过“类”（class）实现对象的继承。传统上，JavaScript 语言的继承不通过 class，而是通过“原型对象”（**prototype**）实现，本章介绍 JavaScript 的原型链继承。

> [!tip]
>
> ES6 引入了 class 语法。

JavaScript通过构造函数生成新的对象，所以构造函数可以视为对象的模板，实例对象的属性和方法，可以定义在构造函数内部。

```js
function Cat (name, color) {
  this.name = name;
  this.color = color;
}

var cat1 = new Cat('大毛', '白色');

cat1.name // '大毛'
cat1.color // '白色'
```

上面代码中，`Cat`函数是一个构造函数，函数内部定义了`name`属性和`color`属性，所有实例对象（上例是`cat1`）都会生成这两个属性，即这两个属性会定义在实例对象上面。

通过构造函数为实例对象定义属性，虽然很方便，但是有一个缺点。同一个构造函数的多个实例之间，**无法共享属性，从而造成对系统资源的浪费。**

```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('喵喵');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow
// false
```

上面代码中，`cat1`和`cat2`是同一个构造函数的两个实例，它们都具有`meow`方法。由于`meow`方法是生成在每个实例对象上面，所以两个实例就生成了两次。

也就是说，每新建一个实例，就会新建一个`meow`方法。这既没有必要，又浪费系统资源，因为所有`meow`方法都是同样的行为，完全应该共享。

这个问题的解决方法，就是 JavaScript 的原型对象（prototype）。

#### prototype 属性的作用

JavaScript 继承机制的设计思想就是，原型对象的所有属性和方法，都能被实例对象共享。

也就是说，如果属性和方法定义在原型上，那么所有实例对象就能共享，不仅节省了内存，还体现了实例对象之间的联系。

下面，先看怎么为对象指定原型。JavaScript 规定，每个函数都有一个`prototype`属性，指向一个对象。

```js
function f() {}
typeof f.prototype // "object"
```

上面代码中，函数`f`默认具有`prototype`属性，指向一个对象。

对于普通函数来说，该属性基本无用。但是，对于构造函数来说，**生成实例的时候，该属性会自动成为实例对象的原型。**

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.color = 'white';

var cat1 = new Animal('大毛');
var cat2 = new Animal('二毛');

cat1.color // 'white'
cat2.color // 'white'
```

上面代码中，构造函数`Animal`的`prototype`属性，就是实例对象`cat1`和`cat2`的原型对象。原型对象上添加一个`color`属性，结果，实例对象都共享了该属性。

原型对象的属性不是实例对象自身的属性。只要修改原型对象，变动就立刻会体现在**所有**实例对象上。

```js
Animal.prototype.color = 'yellow';

cat1.color // "yellow"
cat2.color // "yellow"
```

上面代码中，原型对象的`color`属性的值变为`yellow`，两个实例对象的`color`属性立刻跟着变了。

这是因为实例对象其实没有`color`属性，都是读取原型对象的`color`属性。

也就是说，**当实例对象本身没有某个属性或方法的时候，它会到原型对象去寻找该属性或方法。这就是原型对象的特殊之处**。

**如果实例对象自身就有某个属性或方法，它就不会再去原型对象寻找这个属性或方法。**

```js
cat1.color = 'black';

cat1.color // 'black'
cat2.color // 'yellow'
Animal.prototype.color // 'yellow';
```

总结一下，原型对象的作用，就是定义所有实例对象共享的属性和方法。

这也是它被称为原型对象的原因，而实例对象可以视作从原型对象衍生出来的子对象。

```js
Animal.prototype.walk = function () {
  console.log(this.name + ' is walking');
};
```

上面代码中，`Animal.prototype`对象上面定义了一个`walk`方法，这个方法将可以在所有`Animal`实例对象上面调用。

#### 原型链

JavaScript规定，所有对象都有自己的原型对象（**prototype**）。

一方面，任何一个对象，都可以充当其他对象的原型；

另一方面，由于原型对象也是对象，所以它也有自己的原型。

因此，就会形成一个“原型链”（prototype chain）：对象到原型，再到原型的原型……

如果一层层地上溯，所有对象的原型最终都可以上溯到`Object.prototype`，即`Object`构造函数的`prototype`属性。

也就是说，所有对象都继承了`Object.prototype`的属性。这就是所有对象都有`valueOf`和`toString`方法的原因，因为这是从`Object.prototype`继承的。

`Object.prototype`对象有没有它的原型呢？回答是`Object.prototype`的原型是`null`。`null`没有任何属性和方法，也没有自己的原型。因此，原型链的尽头就是`null`。

```js
Object.getPrototypeOf(Object.prototype)
// null
```

上面代码表示，`Object.prototype`对象的原型是`null`，由于`null`没有任何属性，所以原型链到此为止。

`Object.getPrototypeOf`方法返回参数对象的原型。

读取对象的某个属性时，JavaScript 引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。

`Object.prototype`还是找不到，则返回`undefined`，如果对象自身和它的原型，都定义了一个同名属性，那么优先读取对象自身的属性，这叫做“覆盖”（overriding）。

**注意**：一级级向上，在整个原型链上寻找某个属性，对性能是有影响的。所寻找的属性在越上层的原型对象，对性能的影响越大。如果寻找某个不存在的属性，将会遍历整个原型链。

举例来说，如果让构造函数的`prototype`属性指向一个数组，就意味着实例对象可以调用数组方法。

```js
var MyArray = function () {};

MyArray.prototype = new Array();

var mine = new MyArray();
mine.push(1, 2, 3);
mine.length // 3
mine instanceof Array // true
```

上面代码中，`mine`是构造函数`MyArray`的实例对象，由于`MyArray.prototype`指向一个数组实例，使得`mine`可以调用数组方法（这些方法定义在数组实例的`prototype`对象上面）。

`instanceof`表达式用来比较一个对象是否为某个构造函数的实例（结果就是证明`mine`为`Array`的实例）。

#### constructor 属性

`prototype`对象有一个`constructor`属性，**默认指向`prototype`对象所在的构造函数。**

```js
function P() {}
P.prototype.constructor === P // true
```

由于`constructor`属性定义在`prototype`对象上面，意味着可以被所有实例对象继承。

```js
function P() {}
var p = new P();

p.constructor === P // true
p.constructor === P.prototype.constructor // true
p.hasOwnProperty('constructor') // false
```

`Object.prototype.hasOwnProperty()`方法接受一个字符串作为参数，返回一个布尔值，表示该实例对象**自身**是否具有该属性，不包括继承的

上面代码中，`p`是构造函数`P`的实例对象，但是`p`自身没有`constructor`属性，该属性其实是读取原型链上面的`P.prototype.constructor`属性。

`constructor`属性的作用是，可以得知某个实例对象，到底是哪一个构造函数产生的。

```js
function F() {};
var f = new F();

f.constructor === F // true
f.constructor === RegExp // false
```

另一方面，有了`constructor`属性，就可以从一个实例对象新建另一个实例。

```js
function Constr() {}
var x = new Constr();

var y = new x.constructor();
y instanceof Constr // true
```

上面代码中，`x`是构造函数`Constr`的实例，可以从`x.constructor`间接调用构造函数。

这使得在实例方法中，调用自身的构造函数成为可能。

```js
Constr.prototype.createCopy = function () {
  return new this.constructor();
};
```

上面代码中，`createCopy`方法调用构造函数，新建另一个实例。

`constructor`属性表示原型对象与构造函数之间的关联关系，如果修改了原型对象，一般会同时修改`constructor`属性，防止引用的时候出错。

```js
function Person(name) {
  this.name = name;
}

Person.prototype.constructor === Person // true

Person.prototype = {
  method: function () {}
};

Person.prototype.constructor === Person // false
Person.prototype.constructor === Object // true
```

上面代码中，构造函数`Person`的原型对象改掉了，但是没有修改`constructor`属性，导致这个属性不再指向`Person`。由于`Person`的新原型是一个普通对象，而普通对象的`constructor`属性指向`Object`构造函数，导致`Person.prototype.constructor`变成了`Object`。

> [!IMPORTANT] 记住
>
> 普通对象的`constructor`属性指向`Object`构造函数，原型对象则指向`prototype`对象所在的构造函数

> [!tip]  
>
> 所以，修改原型对象时，一般要同时修改`constructor`属性的指向。

```js
// 坏的写法
C.prototype = {
  method1: function (...) { ... },
  // ...
};

// 好的写法
C.prototype = {
  constructor: C,
  method1: function (...) { ... },
  // ...
};

// 更好的写法
C.prototype.method1 = function (...) { ... };
```

上面代码中，要么将`constructor`属性重新指向原来的构造函数，要么只在原型对象上添加方法，这样可以保证`instanceof`运算符不会失真。

如果不能确定`constructor`属性是什么函数，还有一个办法：通过`name`属性，从实例得到构造函数的名称。

```js
function Foo() {}
var f = new Foo();
f.constructor.name // "Foo"
```

#### instanceof 运算符

`instanceof`运算符返回一个布尔值，表示对象是否为某个构造函数的实例。

```js
var v = new Vehicle();
v instanceof Vehicle // true
```

`instanceof`运算符的左边是**实例对象**，右边是**构造函数**。

它会检查右边构造函数的原型对象（prototype），是否在左边对象的原型链上。

因此，下面两种写法是等价的。

```js
v instanceof Vehicle
// 等同于
Vehicle.prototype.isPrototypeOf(v)
```

上面代码中，`Vehicle`是对象`v`的构造函数，它的原型对象是`Vehicle.prototype`

`isPrototypeOf()`方法是 JavaScript 提供的原生方法，用于检查某个对象是否为另一个对象的原型。

由于`instanceof`检查**整个原型链**，因此同一个实例对象，可能会对多个构造函数都返回`true`。

```js
var d = new Date();
d instanceof Date // true
d instanceof Object // true
```

上面代码中，`d`同时是`Date`和`Object`的实例，因此对这两个构造函数都返回`true`。

由于任意对象（除了`null`）都是`Object`的实例，所以`instanceof`运算符可以判断一个值是否为非`null`的对象。

```js
var obj = { foo: 123 };
obj instanceof Object // true

null instanceof Object // false
```

除了`null`，其他对象的`instanceOf Object`的运算结果都是`true`。

> [!TIP]
>
> **`instanceof`的原理是检查右边构造函数的`prototype`属性，是否在左边对象的原型链上。**
>
> **有一种特殊情况，就是左边对象的原型链上，只有`null`对象。这时，`instanceof`判断会失真。**

```js
var obj = Object.create(null);
typeof obj // "object"
obj instanceof Object // false
```

上面代码中，`Object.create(null)`返回一个新对象`obj`，它的原型是`null`。

右边的构造函数`Object`的`prototype`属性，不在左边的原型链上，因此`instanceof`就认为`obj`不是`Object`的实例。这是唯一的`instanceof`运算符判断会失真的情况（**一个对象的原型是`null`**）。

`instanceof`运算符的一个用处，是判断值的类型。

**注意**，`instanceof`运算符只能用于对象，不适用原始类型的值。

```js
var x = [1, 2, 3];
var y = {};
x instanceof Array // true
y instanceof Object // true
var s = 'hello';
s instanceof String // false
```

上面代码中，字符串不是`String`对象的实例（因为字符串不是对象），所以返回`false`。

此外，对于`undefined`和`null`，`instanceof`运算符总是返回`false`。

利用`instanceof`运算符，还可以巧妙地解决，调用构造函数时，忘了加`new`命令的问题。

```js
function Fubar (foo, bar) {
  if (this instanceof Fubar) {
    this._foo = foo;
    this._bar = bar;
  } else {
    return new Fubar(foo, bar);
  }
}
```

上面代码使用`instanceof`运算符，在函数体内部判断`this`关键字是否为构造函数`Fubar`的实例。如果不是，就表明忘了加`new`命令。

#### 构造函数的继承

让一个构造函数继承另一个构造函数，是非常常见的需求。

这可以分成两步实现。第一步是**在子类的构造函数中，调用父类的构造函数**。

```js
function Sub(value) {
  Super.call(this);
  this.prop = value;
}
```

上面代码中，`Sub`是子类的构造函数，`this`是子类的实例。在实例上调用父类的构造函数`Super`，就会让子类实例具有父类实例的属性。

第二步，是让子类的原型指向父类的原型，这样子类就可以继承父类原型。

```js
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
Sub.prototype.method = '...';
```

上面代码中，`Sub.prototype`是子类的原型，要将它赋值为`Object.create(Super.prototype)`，而不是直接等于`Super.prototype`，否则后面两行对`Sub.prototype`的操作，会连父类的原型`Super.prototype`一起修改掉。

另外一种写法是`Sub.prototype`等于一个父类实例。

```js
Sub.prototype = new Super();
```

上面这种写法也有继承的效果，但是**子类会具有父类实例的方法**。有时，这可能不是我们需要的，所以不推荐使用这种写法。

**例子**：

```js
// 父类
function Shape() {
  this.x = 0;
  this.y = 0;
}

Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};
```

让`Rectangle`构造函数继承`Shape`

```js
// 第一步，子类继承父类的实例
function Rectangle() {
  Shape.call(this); // 调用父类构造函数
}
// 另一种写法
function Rectangle() {
  this.base = Shape;
  this.base();
}

// 第二步，子类继承父类的原型
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
```

采用这样的写法以后，`instanceof`运算符会对子类和父类的构造函数，都返回`true`。

```js
var rect = new Rectangle();

rect instanceof Rectangle  // true
rect instanceof Shape  // true
```

上面代码中，子类是整体继承父类。有时只需要单个方法的继承，这时可以采用下面的写法。

```js
ClassB.prototype.print = function() {
  ClassA.prototype.print.call(this);
  // some code
}
```

上面代码中，子类`B`的`print`方法先调用父类`A`的`print`方法，再部署自己的代码。这就等于继承了父类`A`的`print`方法。

#### 多重继承

JavaScript 不提供多重继承功能，即不允许一个对象同时继承多个对象。但是，可以通过变通方法，实现这个功能。

```js
function M1() {
  this.hello = 'hello';
}

function M2() {
  this.world = 'world';
}

function S() {
  M1.call(this);
  M2.call(this);
}

// 继承 M1
S.prototype = Object.create(M1.prototype);
// 继承链上加入 M2
Object.assign(S.prototype, M2.prototype);

// 指定构造函数
S.prototype.constructor = S;

var s = new S();
s.hello // 'hello'
s.world // 'world'
```

上面代码中，子类`S`同时继承了父类`M1`和`M2`。这种模式又称为 Mixin（混入）。

#### 模块

随着网站逐渐变成“互联网应用程序”，嵌入网页的 JavaScript 代码越来越庞大，越来越复杂。网页越来越像桌面程序，需要一个团队分工协作、进度管理、单元测试等等……开发者必须使用软件工程的方法，管理网页的业务逻辑。

JavaScript 模块化编程，已经成为一个迫切的需求。理想情况下，开发者只需要实现核心的业务逻辑，其他都可以加载别人已经写好的模块。

但是，JavaScript 不是一种模块化编程语言，ES6 才开始支持“类”和“模块”。下面介绍传统的做法，如何利用对象实现模块的效果。

##### 基本实现

模块是实现特定功能的**一组属性和方法的封装**。

简单的做法是把模块写成一个对象，所有的模块成员都放到这个对象里面。

```js
var module1 = new Object({
　_count : 0,
　m1 : function (){
　　//...
　},
　m2 : function (){
  　//...
　}
});
```

上面的函数`m1`和`m2`，都封装在`module1`对象里。使用的时候，就是调用这个对象的属性。

```js
module1.m1();
```

但是，这样的写法会暴露所有模块成员，内部状态可以被外部改写。比如，外部代码可以直接改变内部计数器的值。

```js
module1._count = 5;
```

##### 私有变量

###### 封装私有变量：构造函数的写法

我们可以利用构造函数，封装私有变量。

```js
function StringBuilder() {
  var buffer = [];

  this.add = function (str) {
     buffer.push(str);
  };

  this.toString = function () {
    return buffer.join('');
  };

}
```

上面代码中，`buffer`是模块的私有变量。

一旦生成实例对象，外部是无法直接访问`buffer`的。

但是，这种方法将私有变量封装在构造函数中，导致构造函数与实例对象是一体的，总是存在于内存之中，无法在使用完成后清除。

这意味着，构造函数有双重作用，**既用来塑造实例对象，又用来保存实例对象的数据**，违背了构造函数与实例对象在数据上相分离的原则（**即实例对象的数据，不应该保存在实例对象以外**）。同时，非常耗费内存。

```js
function StringBuilder() {
  this._buffer = [];
}

StringBuilder.prototype = {
  constructor: StringBuilder,
  add: function (str) {
    this._buffer.push(str);
  },
  toString: function () {
    return this._buffer.join('');
  }
};
```

这种方法将私有变量放入实例对象中，好处是看上去更自然，但是它的私有变量可以从外部读写，不是很安全。

###### 封装私有变量：立即执行函数的写法

另一种做法是使用“立即执行函数”（Immediately-Invoked Function Expression，IIFE），将相关的属性和方法封装在一个函数作用域里面，可以达到不暴露私有成员的目的。

```js
var module1 = (function () {
　var _count = 0;
　var m1 = function () {
　  //...
　};
　var m2 = function () {
　　//...
　};
　return {
　　m1 : m1,
　　m2 : m2
　};
})();
```

使用上面的写法，外部代码无法读取内部的`_count`变量。

```js
console.info(module1._count); //undefined
```

上面的`module1`就是 JavaScript 模块的基本写法。下面，再对这种写法进行加工。

##### 模块的放大模式

如果一个模块很大，必须分成几个部分，或者一个模块需要继承另一个模块，这时就有必要采用“**放大模式**”（augmentation）。

```js
var module1 = (function (mod){
　mod.m3 = function () {
　　//...
　};
　return mod;
})(module1);
```

上面的代码为`module1`模块添加了一个新方法`m3()`，然后返回新的`module1`模块。

在浏览器环境中，模块的各个部分通常都是从网上获取的，有时无法知道哪个部分会先加载。如果采用上面的写法，第一个执行的部分有可能加载一个不存在空对象，这时就要采用"宽放大模式"（Loose augmentation）。

```js
var module1 = (function (mod) {
　//...
　return mod;
})(window.module1 || {});
```

与"放大模式"相比，“宽放大模式”就是“立即执行函数”的参数可以是空对象。

##### 输入全局变量

独立性是模块的重要特点，模块内部最好不与程序的其他部分直接交互。

为了在模块内部调用全局变量，必须显式地将其他变量输入模块。

```js
var module1 = (function ($, YAHOO) {
　//...
})(jQuery, YAHOO);
```

上面的`module1`模块需要使用 jQuery 库和 YUI 库，就把这两个库（其实是两个模块）当作参数输入`module1`。这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显。

立即执行函数还可以起到命名空间的作用。

```js
(function($, window, document) {

  function go(num) {
  }

  function handleEvents() {
  }

  function initialize() {
  }

  function dieCarouselDie() {
  }

  // 附加到全局范围
  window.finalCarousel = {
    init : initialize,
    destroy : dieCarouselDie
  }

})( jQuery, window, document );
```

上面代码中，`finalCarousel`对象输出到全局，对外暴露`init`和`destroy`接口，内部方法`go`、`handleEvents`、`initialize`、`dieCarouselDie`都是外部无法调用的。

### 对象的相关方法

JavaScript 在`Object`对象上面，提供了很多相关方法，处理面向对象编程的相关操作。

#### Object.getPrototypeOf()

`Object.getPrototypeOf`方法返回参数对象的原型。这是获取原型对象的标准方法。

```js
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype // true
```

几种特殊对象的原型

```js
// 空对象的原型是 Object.prototype
Object.getPrototypeOf({}) === Object.prototype // true

// Object.prototype 的原型是 null
Object.getPrototypeOf(Object.prototype) === null // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true
```

#### Object.setPrototypeOf()

`Object.setPrototypeOf`方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。

```js
var a = {};
var b = {x: 1};
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1
```

上面代码中，`Object.setPrototypeOf`方法将对象`a`的原型，设置为对象`b`，因此`a`可以共享`b`的属性。

`new`命令可以使用`Object.setPrototypeOf`方法模拟。

```js
var F = function () {
  this.foo = 'bar';
};

var f = new F();
// 等同于
var f = Object.setPrototypeOf({}, F.prototype);
F.call(f);
```

上面代码中，`new`命令新建实例对象，其实可以分成两步。第一步，将一个空对象的原型设为构造函数的`prototype`属性（上例是`F.prototype`）；

第二步，将构造函数内部的`this`绑定这个空对象，然后执行构造函数，使得定义在`this`上面的方法和属性（上例是`this.foo`），都转移到这个空对象上。

#### Object.create()

生成实例对象的常用方法是，使用`new`命令让构造函数返回一个实例。

但是很多时候，只能拿到一个实例对象，它可能根本不是由构建函数生成的，那么能不能从一个实例对象，生成另一个实例对象呢？

JavaScript 提供了`Object.create()`方法，用来满足这种需求。

该方法接受一个对象作为参数，然后以它为原型，返回一个实例对象。该实例完全继承原型对象的属性。

```js
// 原型对象
var A = {
  print: function () {
    console.log('hello');
  }
};

// 实例对象
var B = Object.create(A);

Object.getPrototypeOf(B) === A // true
B.print() // hello
B.print === A.print // true
```

上面代码中，`Object.create()`方法以`A`对象为原型，生成了`B`对象。`B`继承了`A`的所有属性和方法。

实际上，`Object.create()`方法可以用下面的代码代替。

```js
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };
}
```

上面代码表明，`Object.create()`方法的实质是新建一个空的构造函数`F`，然后让`F.prototype`属性指向参数对象`obj`，最后返回一个`F`的实例，从而实现让该实例继承`obj`的属性。

下面三种方式生成的新对象是等价的。

```js
var obj1 = Object.create({});
var obj2 = Object.create(Object.prototype);
var obj3 = new Object();
```

如果想要生成一个不继承任何属性（比如没有`toString()`和`valueOf()`方法）的对象，可以将`Object.create()`的参数设为`null`。

```js
var obj = Object.create(null);

obj.valueOf()
// TypeError: Object [object Object] has no method 'valueOf'
```

上面代码中，对象`obj`的原型是`null`，它就不具备一些定义在`Object.prototype`对象上面的属性，比如`valueOf()`方法。

使用`Object.create()`方法的时候，必须提供对象原型，即参数不能为空，或者不是对象，否则会报错。

```js
Object.create()
// TypeError: Object prototype may only be an Object or null
Object.create(123)
// TypeError: Object prototype may only be an Object or null
```

`Object.create()`方法生成的新对象，动态继承了原型。在原型上添加或修改任何方法，会立刻反映在新对象之上。

```js
var obj1 = { p: 1 };
var obj2 = Object.create(obj1);

obj1.p = 2;
obj2.p // 2
```

上面代码中，修改对象原型`obj1`会影响到实例对象`obj2`。

除了对象的原型，`Object.create()`方法还可以接受第二个参数。该参数是一个属性描述对象，它所描述的对象属性，会添加到实例对象，作为该对象自身的属性。

```js
var obj = Object.create({}, {
  p1: {
    value: 123,
    enumerable: true,
    configurable: true,
    writable: true,
  },
  p2: {
    value: 'abc',
    enumerable: true,
    configurable: true,
    writable: true,
  }
});

// 等同于
var obj = Object.create({});
obj.p1 = 123;
obj.p2 = 'abc';
```

`Object.create()`方法生成的对象，继承了它的原型对象的构造函数。

```js
function A() {}
var a = new A();
var b = Object.create(a);

b.constructor === A // true
b instanceof A // true
```

上面代码中，`b`对象的原型是`a`对象，因此继承了`a`对象的构造函数`A`。

#### Object.prototype.isPrototypeOf()

实例对象的`isPrototypeOf`方法，用来判断该对象是否为参数对象的原型。

```js
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true
```

上面代码中，`o1`和`o2`都是`o3`的原型。这表明只要实例对象处在参数对象的原型链上，`isPrototypeOf`方法都返回`true`。

```js
Object.prototype.isPrototypeOf({}) // true
Object.prototype.isPrototypeOf([]) // true
Object.prototype.isPrototypeOf(/xyz/) // true
Object.prototype.isPrototypeOf(Object.create(null)) // false
```

上面代码中，由于`Object.prototype`处于原型链的最顶端，所以对各种实例都返回`true`，只有直接继承自`null`的对象除外。

#### Object.prototype.__proto__

实例对象的`__proto__`属性（前后各两个下划线），返回该对象的原型。该属性可读写。

```js
var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p // true
```

上面代码通过`__proto__`属性，将`p`对象设为`obj`对象的原型。

根据语言标准，`__proto__`属性只有浏览器才需要部署，其他环境可以没有这个属性。

它前后的两根下划线，表明它本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用`Object.getPrototypeOf()`和`Object.setPrototypeOf()`，进行原型对象的读写操作。

原型链可以用`__proto__`很直观地表示。

```js
var A = {
  name: '张三'
};
var B = {
  name: '李四'
};

var proto = {
  print: function () {
    console.log(this.name);
  }
};

A.__proto__ = proto;
B.__proto__ = proto;

A.print() // 张三
B.print() // 李四

A.print === B.print // true
A.print === proto.print // true
B.print === proto.print // true
```

上面代码中，`A`对象和`B`对象的原型都是`proto`对象，它们都共享`proto`对象的`print`方法。也就是说，`A`和`B`的`print`方法，都是在调用`proto`对象的`print`方法。

#### 获取原型对象方法的比较

如前所述，`__proto__`属性指向当前对象的原型对象，即构造函数的`prototype`属性。

```js
var obj = new Object();

obj.__proto__ === Object.prototype
// true
obj.__proto__ === obj.constructor.prototype
```

上面代码首先新建了一个对象`obj`，它的`__proto__`属性，指向构造函数（`Object`或`obj.constructor`）的`prototype`属性。

因此，获取实例对象`obj`的原型对象，有三种方法。

- `obj.__proto__`
- `obj.constructor.prototype`
- `Object.getPrototypeOf(obj)`

上面三种方法之中，前两种都不是很可靠。`__proto__`属性只有浏览器才需要部署，其他环境可以不部署。而`obj.constructor.prototype`在手动改变原型对象时，可能会失效。

```js
var P = function () {};
var p = new P();

var C = function () {};
C.prototype = p;
var c = new C();

c.constructor.prototype === p // false
```

上面代码中，构造函数`C`的原型对象被改成了`p`，但是实例对象的`c.constructor.prototype`却没有指向`p`。所以，在改变原型对象时，一般要同时设置`constructor`属性。

```js
C.prototype = p;
C.prototype.constructor = C;

var c = new C();
c.constructor.prototype === p // true
```

因此，推荐使用第三种`Object.getPrototypeOf`方法，获取原型对象。

#### Object.getOwnPropertyNames()

`Object.getOwnPropertyNames`方法返回一个数组，成员是参数对象本身的所有属性的键名，不包含继承的属性键名。

```js
Object.getOwnPropertyNames(Date)
// ["parse", "arguments", "UTC", "caller", "name", "prototype", "now", "length"]
```

上面代码中，`Object.getOwnPropertyNames`方法返回`Date`所有自身的属性名。

对象本身的属性之中，有的是可以遍历的（enumerable），有的是不可以遍历的。`Object.getOwnPropertyNames`方法返回所有键名，不管是否可以遍历。

只获取那些可以遍历的属性，使用`Object.keys`方法。

```js
Object.keys(Date) // []
```

上面代码表明，`Date`对象所有自身的属性，都是不可以遍历的。

#### Object.prototype.hasOwnProperty()

对象实例的`hasOwnProperty`方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。

```js
Date.hasOwnProperty('length') // true
Date.hasOwnProperty('toString') // false
```

上面代码表明，`Date.length`（构造函数`Date`可以接受多少个参数）是`Date`自身的属性，`Date.toString`是继承的属性。

另外，`hasOwnProperty`方法是 JavaScript 之中唯一一个处理对象属性时，不会遍历原型链的方法。

#### in 运算符和 for...in 循环

`in`运算符返回一个布尔值，表示一个对象是否具有某个属性。它不区分该属性是对象自身的属性，还是继承的属性。

```js
'length' in Date // true
'toString' in Date // true
```

`in`运算符常用于检查一个属性是否存在。

获得对象的所有**可遍历属性**（不管是自身的还是继承的），可以使用`for...in`循环。

```js
var o1 = { p1: 123 };

var o2 = Object.create(o1, {
  p2: { value: "abc", enumerable: true }
});

for (p in o2) {
  console.info(p);
}
// p2
// p1
```

上面代码中，对象`o2`的`p2`属性是自身的，`p1`属性是继承的。这两个属性都会被`for...in`循环遍历。

为了在`for...in`循环中获得对象自身的属性，可以采用`hasOwnProperty`方法判断一下。

```js
for ( var name in object ) {
  if ( object.hasOwnProperty(name) ) {
    /* loop code */
  }
}
```

获得对象的**所有属性**（不管是自身的还是继承的，也不管是否可枚举），可以使用下面的函数。

```js
function inheritedPropertyNames(obj) {
  var props = {};
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(p) {
      props[p] = true;
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}
```

上面代码依次获取`obj`对象的每一级原型对象“自身”的属性，从而获取`obj`对象的“所有”属性，不管是否可遍历。

下面是一个例子，列出`Date`对象的所有属性。

```js
inheritedPropertyNames(Date)
// [
//  "caller",
//  "constructor",
//  "toString",
//  "UTC",
//  ...
// ]
```

#### 对象的拷贝

如果要拷贝一个对象，需要做到下面两件事情。

- 确保拷贝后的对象，与原对象具有同样的原型。
- 确保拷贝后的对象，与原对象具有同样的实例属性。

下面就是根据上面两点，实现的对象拷贝函数。

```js
function copyObject(orig) {
  var copy = Object.create(Object.getPrototypeOf(orig));
  copyOwnPropertiesFrom(copy, orig);
  return copy;
}

function copyOwnPropertiesFrom(target, source) {
  Object
    .getOwnPropertyNames(source)
    .forEach(function (propKey) {
      var desc = Object.getOwnPropertyDescriptor(source, propKey);
      Object.defineProperty(target, propKey, desc);
    });
  return target;
}
```

另一种更简单的写法，是利用 **ES2017** 才引入标准的`Object.getOwnPropertyDescriptors`方法。

```js
function copyObject(orig) {
  return Object.create(
    Object.getPrototypeOf(orig),
    Object.getOwnPropertyDescriptors(orig)
  );
}
```

### 严格模式

除了正常的运行模式，JavaScript 还有第二种运行模式：严格模式（strict mode）。顾名思义，这种模式采用更加严格的 JavaScript 语法。

同样的代码，在正常模式和严格模式中，可能会有不一样的运行结果。一些在正常模式下可以运行的语句，在严格模式下将不能运行。

#### 设计目的

早期的 JavaScript 语言有很多设计不合理的地方，但是为了兼容以前的代码，又不能改变老的语法，只能不断添加新的语法，引导程序员使用新语法。

严格模式是从 ES5 进入标准的，主要目的有以下几个。

- 明确禁止一些不合理、不严谨的语法，减少 JavaScript 语言的一些怪异行为。
- 增加更多报错的场合，消除代码运行的一些不安全之处，保证代码运行的安全。
- 提高编译器效率，提升运行速度。
- 为未来新版本的 JavaScript 语法做好铺垫。

总之，严格模式体现了 JavaScript 更合理、更安全、更严谨的发展方向。

#### 启用方法

进入严格模式的标志，是一行字符串`use strict`。

```js
'use strict';
```

老版本的引擎会把它当作一行普通字符串，加以忽略。新版本的引擎就会进入严格模式。

严格模式可以用于整个脚本，也可以只用于单个函数。

#####  整个脚本文件

`use strict`放在脚本文件的第一行，整个脚本都将以严格模式运行。如果这行语句不在第一行就无效，整个脚本会以正常模式运行。(严格地说，只要前面不是产生实际运行结果的语句，`use strict`可以不在第一行，比如直接跟在一个空的分号后面，或者跟在注释后面。)

```js
<script>
  'use strict';
  console.log('这是严格模式');
</script>

<script>
  console.log('这是正常模式');
</script>
```

上面代码中，一个网页文件依次有两段 JavaScript 代码。前一个`<script>`标签是严格模式，后一个不是。

如果`use strict`写成下面这样，则不起作用，严格模式必须从代码一开始就生效。

```js
<script>
  console.log('这是正常模式');
  'use strict';
</script>
```

##### 单个函数

`use strict`放在函数体的第一行，则整个函数以严格模式运行。

```js
function strict() {
  'use strict';
  return '这是严格模式';
}

function strict2() {
  'use strict';
  function f() {
    return '这也是严格模式';
  }
  return f();
}

function notStrict() {
  return '这是正常模式';
}
```

有时，需要把不同的脚本合并在一个文件里面。如果一个脚本是严格模式，另一个脚本不是，它们的合并就可能出错。

严格模式的脚本在前，则合并后的脚本都是严格模式；如果正常模式的脚本在前，则合并后的脚本都是正常模式。

这两种情况下，合并后的结果都是不正确的。这时可以考虑把整个脚本文件放在一个立即执行的匿名函数之中。

```js
(function () {
  'use strict';
  // some code here
})();
```

#### 显式报错

严格模式使得 JavaScript 的语法变得更严格，更多的操作会显式报错。其中有些操作，在正常模式下只会默默地失败，不会报错。

##### 只读属性不可写

严格模式下，设置字符串的`length`属性，会报错。

```js
'use strict';
'abc'.length = 5;
// TypeError: Cannot assign to read only property 'length' of string 'abc'
```

上面代码报错，因为`length`是只读属性，严格模式下不可写。正常模式下，改变`length`属性是无效的，但不会报错。

严格模式下，对只读属性赋值，或者删除不可配置（non-configurable）属性都会报错。

```js
// 对只读属性赋值会报错
'use strict';
var obj = Object.defineProperty({}, 'a', {
  value: 37,
  writable: false
});
obj.a = 123;
// TypeError: Cannot assign to read only property 'a' of object #<Object>

// 删除不可配置的属性会报错
'use strict';
var obj = Object.defineProperty({}, 'p', {
  value: 1,
  configurable: false
});
delete obj.p
// TypeError: Cannot delete property 'p' of #<Object>
```

##### 只设置了取值器的属性不可写

严格模式下，对一个只有取值器（getter）、没有存值器（setter）的属性赋值，会报错。

```js
'use strict';
var obj = {
  get v() { return 1; }
};
obj.v = 2;
// Uncaught TypeError: Cannot set property v of #<Object> which has only a getter
```

上面代码中，`obj.v`只有取值器，没有存值器，对它进行赋值就会报错。

##### 禁止扩展的对象不可扩展

严格模式下，对禁止扩展的对象添加新属性，会报错。

```js
'use strict';
var obj = {};
Object.preventExtensions(obj);
obj.v = 1;
// Uncaught TypeError: Cannot add property v, object is not extensible
```

上面代码中，`obj`对象禁止扩展，添加属性就会报错。

##### eval、arguments 不可用作标识名

严格模式下，使用`eval`或者`arguments`作为标识名，将会报错。下面的语句都会报错。

```js
'use strict';
var eval = 17;
var arguments = 17;
var obj = { set p(arguments) { } };
try { } catch (arguments) { }
function x(eval) { }
function arguments() { }
var y = function eval() { };
var f = new Function('arguments', "'use strict'; return 17;");
// SyntaxError: Unexpected eval or arguments in strict mode
```

##### 函数不能有重名的参数

正常模式下，如果函数有多个重名的参数，可以用`arguments[i]`读取。严格模式下，这属于语法错误。

```js
function f(a, a, b) {
  'use strict';
  return a + b;
}
// Uncaught SyntaxError: Duplicate parameter name not allowed in this cont
```

##### 禁止八进制的前缀0表示法

正常模式下，整数的第一位如果是`0`，表示这是八进制数，比如`0100`等于十进制的64。严格模式禁止这种表示法，整数第一位为`0`，将报错。

```js
'use strict';
var n = 0100;
// Uncaught SyntaxError: Octal literals are not allowed in strict mode.
```

#### 增强的安全措施

严格模式增强了安全保护，从语法上防止了一些不小心会出现的错误。

##### 全局变量显式声明

正常模式中，如果一个变量没有声明就赋值，默认是全局变量。严格模式禁止这种用法，全局变量必须显式声明。

```js
'use strict';

v = 1; // 报错，v未声明

for (i = 0; i < 2; i++) { // 报错，i 未声明
  // ...
}

function f() {
  x = 123;
}
f() // 报错，未声明就创建一个全局变量
```

因此，严格模式下，变量都必须先声明，然后再使用。

##### 禁止 this 关键字指向全局对象 

正常模式下，函数内部的`this`可能会指向全局对象，严格模式禁止这种用法，避免无意间创造全局变量。

```js
// 正常模式
function f() {
  console.log(this === window);
}
f() // true

// 严格模式
function f() {
  'use strict';
  console.log(this === undefined);
}
f() // true
```

上面代码中，严格模式的函数体内部`this`是`undefined`。

这种限制对于构造函数尤其有用。使用构造函数时，有时忘了加`new`，这时`this`不再指向全局对象，而是报错。

```js
function f() {
  'use strict';
  this.a = 1;
};

f();// 报错，this 未定义
```

严格模式下，函数直接调用时（不使用`new`调用），函数内部的`this`表示`undefined`（未定义），因此可以用`call`、`apply`和`bind`方法，将任意值绑定在`this`上面。

正常模式下，`this`指向全局对象，如果绑定的值是非对象，将被自动转为对象再绑定上去，而`null`和`undefined`这两个无法转成对象的值，将被忽略。

```js
// 正常模式
function fun() {
  return this;
}

fun() // window
fun.call(2) // Number {2}
fun.call(true) // Boolean {true}
fun.call(null) // window
fun.call(undefined) // window

// 严格模式
'use strict';
function fun() {
  return this;
}

fun() //undefined
fun.call(2) // 2
fun.call(true) // true
fun.call(null) // null
fun.call(undefined) // undefined
```

上面代码中，可以把任意类型的值，绑定在`this`上面。

##### 禁止使用 fn.callee、fn.caller

函数内部不得使用`fn.caller`、`fn.arguments`，否则会报错。这意味着不能在函数内部得到调用栈了。

```js
function f1() {
  'use strict';
  f1.caller;    // 报错
  f1.arguments; // 报错
}

f1();
```

##### 禁止使用 arguments.callee、arguments.caller

`arguments.callee`和`arguments.caller`是两个历史遗留的变量，从来没有标准化过，现在已经取消了。正常模式下调用它们没有什么作用，但是不会报错。严格模式明确规定，函数内部使用`arguments.callee`、`arguments.caller`将会报错。

```js
'use strict';
var f = function () {
  return arguments.callee;
};

f(); // 报错
```

##### 禁止删除变量

严格模式下无法删除变量，如果使用`delete`命令删除一个变量，会报错。只有对象的属性，且属性的描述对象的`configurable`属性设置为`true`，才能被`delete`命令删除。

```js
'use strict';
var x;
delete x; // 语法错误

var obj = Object.create(null, {
  x: {
    value: 1,
    configurable: true
  }
});
delete obj.x; // 删除成功
```

#### 静态绑定

JavaScript 语言的一个特点，就是允许“动态绑定”，即某些属性和方法到底属于哪一个对象，不是在编译时确定的，而是在运行时（runtime）确定的。

严格模式对动态绑定做了一些限制。某些情况下，只允许静态绑定。也就是说，属性和方法到底归属哪个对象，必须在编译阶段就确定。这样做有利于编译效率的提高，也使得代码更容易阅读，更少出现意外。

具体来说，涉及以下几个方面。

##### 禁止使用 with 语句

严格模式下，使用`with`语句将报错。因为`with`语句无法在编译时就确定，某个属性到底归属哪个对象，从而影响了编译效果。

**with语句**用于动态修改作用域链（如 `with(obj) { console.log(x); }`）

```js
// 废弃写法
with (Math) {
  console.log(PI, sin(2));
}
// 替代方案
console.log(Math.PI, Math.sin(2));
```

```js
'use strict';
var v  = 1;
var obj = {};

with (obj) {
  v = 2;
}
// Uncaught SyntaxError: Strict mode code may not include a with statement
```

##### 创设 eval 作用域

正常模式下，JavaScript 语言有两种变量作用域（scope）：全局作用域和函数作用域。严格模式创设了第三种作用域：`eval`作用域。

正常模式下，`eval`语句的作用域，取决于它处于全局作用域，还是函数作用域。严格模式下，`eval`语句本身就是一个作用域，不再能够在其所运行的作用域创设新的变量了，也就是说，`eval`所生成的变量只能用于`eval`内部。

```js
(function () {
  'use strict';
  var x = 2;
  console.log(eval('var x = 5; x')) // 5
  console.log(x) // 2
})()
```

上面代码中，由于`eval`语句内部是一个独立作用域，所以内部的变量`x`不会泄露到外部。

注意，如果希望`eval`语句也使用严格模式，有两种方式。

```js
// 方式一
function f1(str){
  'use strict';
  return eval(str);
}
f1('undeclared_variable = 1'); // 报错

// 方式二
function f2(str){
  return eval(str);
}
f2('"use strict";undeclared_variable = 1')  // 报错
```

##### arguments 不再追踪参数的变化

变量`arguments`代表函数的参数。严格模式下，函数内部改变参数与`arguments`的联系被切断了，两者不再存在联动关系。

```js
function f(a) {
  a = 2;
  return [a, arguments[0]];
}
f(1); // 正常模式为[2, 2]

function f(a) {
  'use strict';
  a = 2;
  return [a, arguments[0]];
}
f(1); // 严格模式为[2, 1]
```

上面代码中，改变函数的参数，不会反应到`arguments`对象上来。

#### 版本过渡

##### 非函数代码块不得声明函数

ES6 会引入块级作用域。为了与新版本接轨，ES5 的严格模式**只允许在全局作用域或函数作用域声明函数**。也就是说，不允许在非函数的代码块内声明函数。

```js
'use strict';
if (true) {
  function f1() { } // 语法错误
}

for (var i = 0; i < 5; i++) {
  function f2() { } // 语法错误
}
```

上面代码在`if`代码块和`for`代码块中声明了函数，ES5 环境会报错。

注意，如果是 ES6 环境，上面的代码不会报错，**因为 ES6 允许在代码块之中声明函数。**

##### 保留字

为了向将来 JavaScript 的新版本过渡，严格模式新增了一些保留字（implements、interface、let、package、private、protected、public、static、yield等）。使用这些词作为变量名将会报错。

```js
function package(protected) { // 语法错误
  'use strict';
  var implements; // 语法错误
}
```
