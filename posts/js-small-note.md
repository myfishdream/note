---
title: JavaScript 核心知识点小记
date: 2025-04-27
category: Note
tags: 
    - JavaScript
description: 从闭包到对象属性描述符，涵盖函数作用域、内存管理、对象属性控制等关键知识点。
draft: false  
outline: [2,3] 
sticky: true 
done: false   
gridPaper: true 
cbf: false 
---

# JavaScript 核心知识点小记

![bukanwendang](https://jsd.cdn.zzko.cn/gh/fish81/picx-images-hosting@master/20250414/bukanwendang.77dqud641r.png){title="不是问题"}


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