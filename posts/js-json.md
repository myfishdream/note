---
title: JavaScript之JSON
date: 2025-05-15
category: Note
tags: 
    - JavaScript
description: JSON 是 JavaScript 对象表示法，是一种轻量级的数据交换格式。
AutoAnchor: false
outline: [2,4]
---

# JSON 格式

::: details 目录
[[toc]]
:::

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

