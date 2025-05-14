---
title: JavaScript 核心知识点小记 (下)
date: 2025-05-07
category: Note
tags: 
    - JavaScript
description: 从异步操作到DOM事件，涵盖异步编程、事件处理、DOM操作等关键知识点。
draft: false
sticky: false
done: false
AutoAnchor: true
---

# JavaScript 核心知识点小记 (下)

::: details 目录
[[toc]]
:::

## 异步操作

### 单线程模型

**单线程模型**指的是，JavaScript 只在一个线程上运行。也就是说，JavaScript 同时只能执行一个任务，其他任务都必须在后面排队等待。

**注意**：JavaScript 只在一个线程上运行，不代表 JavaScript 引擎只有一个线程。

事实上，JavaScript 引擎有多个线程，单个脚本只能在一个线程上运行（称为主线程），其他线程都是在后台配合。

JavaScript 之所以采用单线程，而不是多线程，跟历史有关系。JavaScript 从诞生起就是单线程，原因是不想让浏览器变得太复杂，因为多线程需要共享资源、且有可能修改彼此的运行结果，对于一种网页脚本语言来说，这就太复杂了。如果 JavaScript 同时有两个线程，一个线程在网页 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？是不是还要有锁机制？所以，为了避免复杂性，JavaScript 一开始就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。

常见的浏览器无响应，也就是假死，往往就是因为某一段代码长时间执行，比如死循环等，导致整个页面都卡在这个地方，其他任务无法执行。

JavaScript语言本身并不慢，慢的是读写外部数据，比如Ajax请求返回结果，假如在这个时候，服务器迟迟没有响应就会导致脚本的长时间停滞。

如果排队是因为计算量大，CPU 忙不过来，倒也算了，但是很多时候 CPU 是闲着的，因为 IO 操作（输入输出）很慢（比如 Ajax 操作从网络读取数据），不得不等着结果出来，再往下执行。

JavaScript 语言的设计者意识到，这时 CPU 完全可以不管 IO 操作，挂起处于等待中的任务，先运行排在后面的任务。等到 IO 操作返回了结果，再回过头，把挂起的任务继续执行下去。这种机制就是 JavaScript 内部采用的“**事件循环**”机制（Event Loop）。

单线程模型虽然对 JavaScript 构成了很大的限制，但也因此使它具备了其他语言不具备的优势。如果用得好，JavaScript 程序是不会出现堵塞的，这就是 Node.js 可以用很少的资源，应付大流量访问的原因。

为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。所以，这个新标准并没有改变 JavaScript 单线程的本质。

### 同步和异步

程序里面所有的任务，可以分成两类：同步任务（synchronous）和异步任务

同步任务是那些没有被引擎挂起、在主线程上排队执行的任务。只有前一个任务执行完毕，才能执行后一个任务。

异步任务是那些被引擎放在一边，不进入主线程、而进入任务队列的任务。只有引擎认为某个异步任务可以执行了（比如 Ajax 操作从服务器得到了结果），该任务（采用回调函数的形式）才会进入主线程执行。

排在异步任务后面的代码，不用等待异步任务结束会马上运行，也就是说，异步任务不具有“堵塞”效应。

举例来说，Ajax 操作可以当作**同步任务**处理，也可以当作**异步任务**处理，由开发者决定。如果是同步任务，主线程就等着 Ajax 操作返回结果，再往下执行；如果是异步任务，主线程在发出 Ajax 请求以后，就直接往下执行，等到 Ajax 操作有了结果，主线程再执行对应的回调函数。

### 任务队列和事件循环

JavaScript 运行时，除了一个正在运行的主线程，引擎还提供一个任务队列，里面是各种需要当前程序处理的异步任务（实际上，根据异步任务的类型，存在多个任务队列。）。

首先，主线程会去执行所有的同步任务。等到同步任务全部执行完，就会去看任务队列里面的异步任务。如果满足条件，那么异步任务就重新进入主线程开始执行，这时它就变成同步任务了。等到执行完，下一个异步任务再进入主线程开始执行。一旦任务队列清空，程序就结束执行。

异步任务的写法通常是回调函数。一旦异步任务重新进入主线程，就会执行对应的回调函数。如果一个异步任务没有回调函数，就不会进入任务队列，也就是说，不会重新进入主线程，因为没有用回调函数指定下一步的操作。

JavaScript 引擎怎么知道异步任务有没有结果，能不能进入主线程呢？

答案就是引擎在不停地检查，一遍又一遍，只要同步任务执行完了，引擎就会去检查那些挂起来的异步任务，是不是可以进入主线程了。这种循环检查的机制，就叫做**事件循环**（Event Loop）。

[维基百科](http://en.wikipedia.org/wiki/Event_loop)的定义是：“事件循环是一个程序结构，用于等待和发送消息和事件

### 异步操作的模式

#### 回调函数

回调函数是异步操作最基本的方法。

下面是两个函数`f1`和`f2`，编程的意图是`f2`必须等到`f1`执行完成，才能执行。

```js
function f1() {}
function f2() {}
f1();
f2();
```

上面代码的问题在于，如果`f1`是异步操作，`f2`会立即执行，不会等到`f1`结束再执行。

这时，可以考虑改写`f1`，把`f2`写成`f1`的回调函数。

```js
function f1(callback) {
    // ...
    callback();
}
function f2() {}
f1(f2);
```

回调函数的优点是简单、容易理解和实现，缺点是不利于代码的阅读和维护，各个部分之间高度[耦合](http://en.wikipedia.org/wiki/Coupling_(computer_programming))（coupling），使得程序结构混乱、流程难以追踪（尤其是多个回调函数嵌套的情况），而且每个任务只能指定一个回调函数。

#### 事件监听

另一种思路是采用事件驱动模式。异步任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

还是以`f1`和`f2`为例。首先，为`f1`绑定一个事件（这里采用的 jQuery 的[写法](http://api.jquery.com/on/)）。

```js
f1.on('done', f2);
```

上面这行代码的意思是，当`f1`发生`done`事件，就执行`f2`。然后，对`f1`进行改写：

```js
function f1() {
  setTimeout(function () {
    // ...
    f1.trigger('done');
  }, 1000);
}
```

上面代码中，`f1.trigger('done')`表示，执行完成后，立即触发`done`事件，从而开始执行`f2`。

这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以“[去耦合](http://en.wikipedia.org/wiki/Decoupling)”（decoupling），有利于实现模块化。

缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。阅读代码的时候，很难看出主流程。

#### 发布/订阅

事件完全可以理解成“信号”，如果存在一个“信号中心”，某个任务执行完成，就向信号中心“发布”（publish）一个信号，其他任务可以向信号中心“订阅”（subscribe）这个信号，从而知道什么时候自己可以开始执行。

这就叫做”[发布/订阅模式](http://en.wikipedia.org/wiki/Publish-subscribe_pattern)”（publish-subscribe pattern），又称“[观察者模式](http://en.wikipedia.org/wiki/Observer_pattern)”（observer pattern）。

这个模式有多种[实现](http://msdn.microsoft.com/en-us/magazine/hh201955.aspx)，下面采用的是 Ben Alman 的 [Tiny Pub/Sub](https://gist.github.com/661855)，这是 jQuery 的一个插件。

首先，`f2`向信号中心`jQuery`订阅`done`信号。

```js
jQuery.subscribe('done', f2);
```

然后，`f1`进行如下改写。

```js
function f1() {
  setTimeout(function () {
    // ...
    jQuery.publish('done');
  }, 1000);
}
```

上面代码中，`jQuery.publish('done')`的意思是，`f1`执行完成后，向信号中心`jQuery`发布`done`信号，从而引发`f2`的执行。

`f2`完成执行后，可以取消订阅（unsubscribe）。

```js
jQuery.unsubscribe('done', f2);
```

这种方法的性质与“事件监听”类似，但是明显优于后者。因为可以通过查看“消息中心”，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

### 流程控制

如果有多个异步操作，就存在一个流程控制的问题：如何确定异步操作执行的顺序，以及如何保证遵守这种顺序。

```js
function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}
```

上面代码的`async`函数是一个异步任务，非常耗时，每次执行需要1秒才能完成，然后再调用回调函数。

如果有六个这样的异步任务，需要全部完成后，才能执行最后的`final`函数。请问应该如何安排操作流程？

```js
function final(value) {
  console.log('完成: ', value);
}

async(1, function (value) {
  async(2, function (value) {
    async(3, function (value) {
      async(4, function (value) {
        async(5, function (value) {
          async(6, final);
        });
      });
    });
  });
});
// 参数为 1 , 1秒后返回结果
// 参数为 2 , 1秒后返回结果
// 参数为 3 , 1秒后返回结果
// 参数为 4 , 1秒后返回结果
// 参数为 5 , 1秒后返回结果
// 参数为 6 , 1秒后返回结果
// 完成:  12
```

上面代码中，六个回调函数的嵌套，不仅写起来麻烦，容易出错，而且难以维护。

#### 串行执行

我们可以编写一个流程控制函数，让它来控制异步任务，一个任务完成以后，再执行另一个。这就叫串行执行。

```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];

function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

function series(item) {
  if(item) {
    async( item, function(result) {
      results.push(result);
      return series(items.shift());
    });
  } else {
    return final(results[results.length - 1]);
  }
}

series(items.shift());
```

上面代码中，函数`series`就是串行函数，它会依次执行异步任务，所有任务都完成后，才会执行`final`函数。`items`数组保存每一个异步任务的参数，`results`数组保存每一个异步任务的运行结果。

注意，上面的写法需要六秒，才能完成整个脚本。

#### 并行执行

流程控制函数也可以是并行执行，即所有异步任务同时执行，等到全部完成以后，才执行`final`函数。

```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];

function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

items.forEach(function(item) {
  async(item, function(result){
    results.push(result);
    if(results.length === items.length) {
      final(results[results.length - 1]);
    }
  })
});
```

上面代码中，`forEach`方法会同时发起六个异步任务，等到它们全部完成以后，才会执行`final`函数。

相比而言，上面的写法只要一秒，就能完成整个脚本。这就是说，并行执行的效率较高，比起串行执行一次只能执行一个任务，较为节约时间。但是问题在于如果并行的任务较多，很容易耗尽系统资源，拖慢运行速度。因此有了第三种流程控制方式

#### 结合

所谓并行与串行的结合，就是设置一个门槛，每次最多只能并行执行`n`个异步任务，这样就避免了过分占用系统资源。

```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];
var running = 0;
var limit = 2;

function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

function launcher() {
  while(running < limit && items.length > 0) {
    var item = items.shift();
    async(item, function(result) {
      results.push(result);
      running--;
      if(items.length > 0) {
        launcher();
      } else if(running === 0) {
        final(results);
      }
    });
    running++;
  }
}

launcher();
```

上面代码中，最多只能同时运行两个异步任务。变量`running`记录当前正在运行的任务数，只要低于门槛值，就再启动一个新的任务，如果等于`0`，就表示所有任务都执行完了，这时就执行`final`函数。

这段代码需要三秒完成整个脚本，处在串行执行和并行执行之间。通过调节`limit`变量，达到效率和资源的最佳平衡。

###  setTimeout()

`setTimeout`函数用来指定某个函数或某段代码，在多少毫秒之后执行。它返回一个整数，表示定时器的编号，以后可以用来取消这个定时器。

```js
var timerId = setTimeout(func|code, delay);
```

上面代码中，`setTimeout`函数接受两个参数，第一个参数`func|code`是将要推迟执行的函数名或者一段代码，第二个参数`delay`是推迟执行的毫秒数。

```js
console.log(1);
setTimeout('console.log(2)',1000);
console.log(3);
// 1
// 3
// 2
```

上面代码会先输出1和3，然后等待1000毫秒再输出2。注意，`console.log(2)`必须以字符串的形式，作为`setTimeout`的参数。

如果推迟执行的是函数，就直接将函数名，作为`setTimeout`的参数。

```js
function f() {
  console.log(2);
}

setTimeout(f, 1000);
```

`setTimeout`的第二个参数如果省略，则默认为0。

除了前两个参数，`setTimeout`还允许更多的参数。它们将依次传入推迟执行的函数（回调函数）。

还有一个需要注意的地方，如果回调函数是对象的方法，那么`setTimeout`使得方法内部的`this`关键字指向**全局环境**，而不是定义时所在的那个对象。

```js
var x = 1;

var obj = {
  x: 2,
  y: function () {
    console.log(this.x);
  }
};

setTimeout(obj.y, 1000) // 1
```

上面代码输出的是1，而不是2。因为当`obj.y`在1000毫秒后运行时，`this`所指向的已经不是`obj`了，而是全局环境。

为了防止出现这个问题，一种解决方法是将`obj.y`放入一个函数。

```js
var x = 1;

var obj = {
  x: 2,
  y: function () {
    console.log(this.x);
  }
};

setTimeout(function () {
  obj.y();
}, 1000);
// 2
```

上面代码中，`obj.y`放在一个匿名函数之中，这使得`obj.y`在`obj`的作用域执行，而不是在全局作用域内执行，所以能够显示正确的值。

另一种解决方法是，使用`bind`方法，将`obj.y`这个方法绑定在`obj`上面。

```js
var x = 1;

var obj = {
  x: 2,
  y: function () {
    console.log(this.x);
  }
};

setTimeout(obj.y.bind(obj), 1000)
// 2
```

### setInterval()

`setInterval`函数的用法与`setTimeout`完全一致，区别仅仅在于`setInterval`指定某个任务每隔一段时间就执行一次，也就是无限次的定时执行。

与`setTimeout`一样，除了前两个参数，`setInterval`方法还可以接受更多的参数，它们会传入回调函数。

`setInterval`的一个常见用途是实现轮询。下面是一个轮询 URL 的 Hash 值是否发生变化的例子。

```js
var hash = window.location.hash;
var hashWatcher = setInterval(function() {
  if (window.location.hash != hash) {
    updatePage();
  }
}, 1000);
```

`setInterval`指定的是“开始执行”之间的间隔，并不考虑每次任务执行本身所消耗的时间。因此实际上，两次执行之间的间隔会小于指定的时间。比如，`setInterval`指定每 100ms 执行一次，每次执行需要 5ms，那么第一次执行结束后95毫秒，第二次执行就会开始。如果某次执行耗时特别长，比如需要105毫秒，那么它结束后，下一次执行就会立即开始。

为了确保两次执行之间有固定的间隔，可以不用`setInterval`，而是每次执行结束后，使用`setTimeout`指定下一次执行的具体时间。

```js
var i = 1;
var timer = setTimeout(function f() {
  // ...
  timer = setTimeout(f, 2000);
}, 2000);
```

上面代码可以确保，下一次执行总是在本次执行结束之后的2000毫秒开始。

### 清除定时器

`setTimeout`和`setInterval`函数，都返回一个整数值，表示计数器编号。将该整数传入`clearTimeout`和`clearInterval`函数，就可以取消对应的定时器。

```js
var id1 = setTimeout(f, 1000);
var id2 = setInterval(f, 1000);

clearTimeout(id1);
clearInterval(id2);
```

### debounce函数

有时，我们不希望回调函数被频繁调用。比如，用户填入网页输入框的内容，希望通过 Ajax 方法传回服务器，jQuery 的写法如下。

```js
$('textarea').on('keydown', ajaxAction);
```

这样写有一个很大的缺点，就是如果用户连续击键，就会连续触发`keydown`事件，造成大量的 Ajax 通信。

这是不必要的，而且很可能产生性能问题。正确的做法应该是，设置一个门槛值，表示两次 Ajax 通信的最小间隔时间。如果在间隔时间内，发生新的`keydown`事件，则不触发 Ajax 通信，并且重新开始计时。如果过了指定时间，没有发生新的`keydown`事件，再将数据发送出去。

这种做法叫做 debounce（防抖动）。假定两次 Ajax 通信的间隔不得小于2500毫秒，上面的代码可以改写成下面这样。

```js
$('textarea').on('keydown', debounce(ajaxAction, 2500));

function debounce(fn, delay){
  var timer = null; // 声明计时器
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
```

上面代码中，只要在2500毫秒之内，用户再次击键，就会取消上一次的定时器，然后再新建一个定时器。这样就保证了回调函数之间的调用间隔，至少是2500毫秒。

### 运行机制

`setTimeout`和`setInterval`的运行机制，是将指定的代码移出本轮事件循环，等到下一轮事件循环，再检查是否到了指定时间。如果到了，就执行对应的代码；如果不到，就继续等待。

这意味着，`setTimeout`和`setInterval`指定的回调函数，必须等到本轮事件循环的所有同步任务都执行完，才会开始执行。

由于前面的任务到底需要多少时间执行完，是不确定的，所以没有办法保证，`setTimeout`和`setInterval`指定的任务，一定会按照预定时间执行。

```js
setTimeout(someTask, 100);
veryLongTask();
```

上面代码的`setTimeout`，指定100毫秒以后运行一个任务。但是，如果后面的`veryLongTask`函数（同步任务）运行时间非常长，过了100毫秒还无法结束，那么被推迟运行的`someTask`就只有等着，等到`veryLongTask`运行结束，才轮到它执行。

```js
setInterval(function () {
  console.log(2);
}, 1000);

sleep(3000);

function sleep(ms) {
  var start = Date.now();
  while ((Date.now() - start) < ms) {
  }
}
```

上面代码中，`setInterval`要求每隔1000毫秒，就输出一个2。但是，紧接着的`sleep`语句需要3000毫秒才能完成，那么`setInterval`就必须推迟到3000毫秒之后才开始生效。注意，生效后`setInterval`不会产生累积效应，即不会一下子输出三个2，而是只会输出一个2。

上例中的`sleep`函数会阻塞主线程，实际中应该使用异步操作，避免主线程被阻塞。

```js
function asyncSleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

asyncSleep(3000).then(() => {
   // 等待后操作
});
```

### setTimeout(f, 0)

`setTimeout(f, 0)`会在下一轮事件循环一开始就执行。

```js
setTimeout(function () {
  console.log(1);
}, 0);
console.log(2);
// 2
// 1
```

上面代码先输出`2`，再输出`1`。因为`2`是同步任务，在本轮事件循环执行，而`1`是下一轮事件循环执行。

总之，`setTimeout(f, 0)`这种写法的目的是，尽可能早地执行`f`，但是并不能保证立刻就执行`f`。

实际上，`setTimeout(f, 0)`不会真的在0毫秒之后运行，不同的浏览器有不同的实现。以 Edge 浏览器为例，会等到4毫秒之后运行。如果电脑正在使用电池供电，会等到16毫秒之后运行；如果网页不在当前 Tab 页，会推迟到1000毫秒（1秒）之后运行。这样是为了节省系统资源。

### 应用

`setTimeout(f, 0)`有几个非常重要的用途。它的一大应用是，可以调整事件的发生顺序。

比如，网页开发中，某个事件先发生在子元素，然后冒泡到父元素，即子元素的事件回调函数，会早于父元素的事件回调函数触发。

如果，想让父元素的事件回调函数先发生，就要用到`setTimeout(f, 0)`。

```js
// HTML 代码如下
// <input type="button" id="myButton" value="click">

var input = document.getElementById('myButton');

input.onclick = function A() {
  setTimeout(function B() {
    input.value +=' input';
  }, 0)
};

document.body.onclick = function C() {
  input.value += ' body'
};
```

上面代码在点击按钮后，先触发回调函数`A`，然后触发函数`C`。函数`A`中，`setTimeout`将函数`B`推迟到下一轮事件循环执行，这样就起到了，先触发父元素的回调函数`C`的目的了。

另一个应用是，用户自定义的回调函数，通常在浏览器的默认动作之前触发。

比如，用户在输入框输入文本，`keypress`事件会在浏览器接收文本之前触发。因此，下面的回调函数是达不到目的的。

```js
// HTML 代码如下
// <input type="text" id="input-box">

document.getElementById('input-box').onkeypress = function (event) {
  this.value = this.value.toUpperCase();
}
```

上面代码想在用户每次输入文本后，立即将字符转为大写。但是实际上，它只能将本次输入前的字符转为大写，因为浏览器此时还没接收到新的文本，所以`this.value`取不到最新输入的那个字符。只有用`setTimeout`改写，上面的代码才能发挥作用。

```js
document.getElementById('input-box').onkeypress = function() {
  var self = this;
  setTimeout(function() {
    self.value = self.value.toUpperCase();
  }, 0);
}
```

上面代码将代码放入`setTimeout`之中，就能使得它在浏览器接收到文本之后触发。

由于`setTimeout(f, 0)`实际上意味着，**将任务放到浏览器最早可得的空闲时段执行**，所以那些计算量大、耗时长的任务，常常会被放到几个小部分，分别放到`setTimeout(f, 0)`里面执行。

由于`setTimeout(f, 0)`实际上意味着，将任务放到浏览器最早可得的空闲时段执行，所以那些计算量大、耗时长的任务，常常会被放到几个小部分，分别放到`setTimeout(f, 0)`里面执行。

```js
var div = document.getElementsByTagName('div')[0];

// 写法一
for (var i = 0xA00000; i < 0xFFFFFF; i++) {
  div.style.backgroundColor = '#' + i.toString(16);
}

// 写法二
var timer;
var i=0x100000;

function func() {
  timer = setTimeout(func, 0);
  div.style.backgroundColor = '#' + i.toString(16);
  if (i++ == 0xFFFFFF) clearTimeout(timer);
}

timer = setTimeout(func, 0);
```

**上述代码工作流程:**

**`setTimeout(func, 0)`**：将 `func` 函数放入事件队列，**等待当前执行栈清空后执行**。这种方式不会阻塞主线程，允许浏览器继续处理其他任务（如 UI 渲染和用户交互）。

**执行栈**是 JavaScript 的同步任务处理机制。它遵循“后进先出”（LIFO, Last In First Out）的原则，用于管理函数调用和执行。

**同步任务**：所有同步代码（如函数调用、变量赋值、循环等）都在执行栈中按顺序执行。

**阻塞性**：如果执行栈中有任务在运行，其他同步任务必须等待当前任务完成才能执行。

**执行栈与事件循环的关系**：

1. **执行栈优先**：JavaScript 引擎会优先执行执行栈中的同步任务，只有当执行栈清空后，才会从任务队列中取出异步任务并放入执行栈中执行。
2. **协作机制**：执行栈和事件循环共同协作，确保同步任务和异步任务都能得到处理，同时避免主线程被长时间阻塞。

上面代码有两种写法，都是改变一个网页元素的背景色。写法一会造成浏览器“堵塞”，因为 JavaScript 执行速度远高于 DOM，会造成大量 DOM 操作“堆积”，而写法二就不会，这就是`setTimeout(f, 0)`的好处。

另一个使用这种技巧的例子是代码高亮的处理。如果代码块很大，一次性处理，可能会对性能造成很大的压力，那么将其分成一个个小块，一次处理一块，比如写成`setTimeout(highlightNext, 50)`的样子，性能压力就会减轻。

### Promise 对象

Promise 对象是 JavaScript 的异步操作解决方案，为异步操作提供统一接口。它起到代理作用（proxy），充当异步操作与回调函数之间的中介，使得异步操作具备同步操作的接口。

Promise 可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数。

首先，Promise 是一个对象，也是一个构造函数

```js
function f1(resolve, reject) {
  // 异步代码...
}

var p1 = new Promise(f1);
```

上面代码中，`Promise`构造函数接受一个回调函数`f1`作为参数，`f1`里面是异步操作的代码。然后，返回的`p1`就是一个 Promise 实例。

Promise 的设计思想是，所有异步任务都返回一个 Promise 实例。Promise 实例有一个`then`方法，用来指定下一步的回调函数。

```js
var p1 = new Promise(f1);
p1.then(f2);
```

上面代码中，`f1`的异步操作执行完成，就会执行`f2`。

传统的写法可能需要把`f2`作为回调函数传入`f1`，比如写成`f1(f2)`，异步操作完成后，在`f1`内部调用`f2`。

Promise 使得`f1`和`f2`变成了链式写法。不仅改善了可读性，而且对于多层嵌套的回调函数尤其方便。

```js
// 传统写法
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // ...
      });
    });
  });
});

// Promise 的写法
(new Promise(step1))
  .then(step2)
  .then(step3)
  .then(step4);
```

Promise 原本只是社区提出的一个构想，一些函数库率先实现了这个功能。ECMAScript 6 将其写入语言标准，目前 JavaScript 原生支持 Promise 对象。

### Promise 对象的状态

Promise 对象通过自身的状态，来控制异步操作。Promise 实例具有三种状态。

- 异步操作未完成（pending）
- 异步操作成功（fulfilled）
- 异步操作失败（rejected）

上面三种状态里面，`fulfilled`和`rejected`合在一起称为`resolved`（已定型）。

这三种的状态的变化途径只有两种。

- 从“未完成”到“成功”
- 从“未完成”到“失败”

一旦状态发生变化，就凝固了，不会再有新的状态变化。

这也是 Promise 这个名字的由来，它的英语意思是“承诺”，一旦承诺成效，就不得再改变了。这也意味着，Promise 实例的状态变化只可能发生一次。

因此，Promise 的最终结果只有两种。

- 异步操作成功，Promise 实例传回一个值（value），状态变为`fulfilled`。
- 异步操作失败，Promise 实例抛出一个错误（error），状态变为`rejected`。

### Promise 构造函数

JavaScript 提供原生的`Promise`构造函数，用来生成 Promise 实例。

```js
var promise = new Promise(function (resolve, reject) {
  // ...

  if (/* 异步操作成功 */){
    resolve(value);
  } else { /* 异步操作失败 */
    reject(new Error());
  }
});
```

上面代码中，`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己实现。

`resolve`函数的作用是，将`Promise`实例的状态从“未完成”变为“成功”（即从`pending`变为`fulfilled`），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。

`reject`函数的作用是，将`Promise`实例的状态从“未完成”变为“失败”（即从`pending`变为`rejected`），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

```js
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100)
```

上面代码中，`timeout(100)`返回一个 Promise 实例。100毫秒以后，该实例的状态会变为`fulfilled`

### Promise.prototype.then()

Promise 实例的`then`方法，用来添加回调函数。

`then`方法可以接受两个回调函数，第一个是异步操作成功时（变为`fulfilled`状态）的回调函数，第二个是异步操作失败（变为`rejected`）时的回调函数（该参数可以省略）。一旦状态改变，就调用相应的回调函数。

```js
var p1 = new Promise(function (resolve, reject) {
  resolve('成功');
});
p1.then(console.log, console.error);
// "成功"

var p2 = new Promise(function (resolve, reject) {
  reject(new Error('失败'));
});
p2.then(console.log, console.error);
// Error: 失败
```

上面代码中，`p1`和`p2`都是Promise 实例，它们的`then`方法绑定两个回调函数：成功时的回调函数`console.log`，失败时的回调函数`console.error`（可以省略）。

`p1`的状态变为成功，`p2`的状态变为失败，对应的回调函数会收到异步操作传回的值，然后在控制台输出。

`then`方法可以链式使用。

```js
p1
  .then(step1)
  .then(step2)
  .then(step3)
  .then(
    console.log,
    console.error
  );
```

上面代码中，`p1`后面有四个`then`，意味依次有四个回调函数。只要前一步的状态变为`fulfilled`，就会依次执行紧跟在后面的回调函数。

最后一个`then`方法，回调函数是`console.log`和`console.error`，用法上有一点重要的区别。

`console.log`只显示`step3`的返回值，而`console.error`可以显示`p1`、`step1`、`step2`、`step3`之中任意一个发生的错误。

举例来说，如果`step1`的状态变为`rejected`，那么`step2`和`step3`都不会执行了（因为它们是`resolved`的回调函数）。

Promise 开始寻找，接下来第一个为`rejected`的回调函数，在上面代码中是`console.error`。这就是说，Promise 对象的报错具有传递性。

### then() 用法辨析

Promise 的用法，简单说就是一句话：使用`then`方法添加回调函数。但是，不同的写法有一些细微的差别，请看下面四种写法，它们的差别在哪里？

```js
// 写法一
f1().then(function () {
  return f2();
});

// 写法二
f1().then(function () {
  f2();
});

// 写法三
f1().then(f2());

// 写法四
f1().then(f2);
```

为了便于讲解，下面这四种写法都再用`then`方法接一个回调函数`f3`。写法一的`f3`回调函数的参数，是`f2`函数的运行结果。

```js
f1().then(function () {
  return f2();
}).then(f3);
```

写法二的`f3`回调函数的参数是`undefined`。

```js
f1().then(function () {
  f2();
  return;
}).then(f3);
```

写法三的`f3`回调函数的参数，是`f2`函数返回的函数的运行结果。

```js
f1().then(f2())
  .then(f3);
```

写法四与写法一只有一个差别，那就是`f2`会接收到`f1()`返回的结果。

```js
f1().then(f2)
  .then(f3);
```

### 图片加载

下面是使用 Promise 完成图片的加载。

```js
var preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```

上面代码中，`image`是一个图片对象的实例。它有两个事件监听属性，`onload`属性在图片加载成功后调用，`onerror`属性在加载失败调用。

上面的`preloadImage()`函数用法如下。

```js
preloadImage('https://example.com/my.jpg')
  .then(function (e) { document.body.append(e.target) })
  .then(function () { console.log('加载成功') })
```

上面代码中，图片加载成功以后，`onload`属性会返回一个事件对象，因此第一个`then()`方法的回调函数，会接收到这个事件对象。该对象的`target`属性就是图片加载后生成的 DOM 节点。

### 小结

Promise 的优点在于，让回调函数变成了规范的链式写法，程序流程可以看得很清楚。它有一整套接口，可以实现许多强大的功能，比如同时执行多个异步操作，等到它们的状态都改变以后，再执行一个回调函数；再比如，为多个回调函数中抛出的错误，统一指定处理方法等等。

而且，Promise 还有一个传统写法没有的好处：它的状态一旦改变，无论何时查询，都能得到这个状态。这意味着，无论何时为 Promise 实例添加回调函数，该函数都能正确执行。所以，你不用担心是否错过了某个事件或信号。如果是传统写法，通过监听事件来执行回调函数，一旦错过了事件，再添加回调函数是不会执行的。

Promise 的缺点是，编写的难度比传统写法高，而且阅读代码也不是一眼可以看懂。你只会看到一堆`then`，必须自己在`then`的回调函数里面理清逻辑。

### 微任务

Promise 的回调函数属于异步任务，会在同步任务之后执行。

```js
new Promise(function (resolve, reject) {
  resolve(1);
}).then(console.log);

console.log(2);
// 2
// 1
```

上面代码会先输出2，再输出1。因为`console.log(2)`是同步任务，而`then`的回调函数属于异步任务，一定晚于同步任务执行。

但是，Promise 的回调函数不是正常的异步任务，而是微任务（microtask）。

它们的区别在于，正常任务追加到下一轮事件循环，**微任务追加到本轮事件循环**。这意味着，微任务的执行时间一定早于正常任务。

```js
setTimeout(function() {
  console.log(1);
}, 0);

new Promise(function (resolve, reject) {
  resolve(2);
}).then(console.log);

console.log(3);
// 3
// 2
// 1
```

上面代码的输出结果是`321`。这说明`then`的回调函数的执行时间，早于`setTimeout(fn, 0)`。因为`then`是本轮事件循环执行，`setTimeout(fn, 0)`在下一轮事件循环开始时执行。

**微任务（Microtask）是异步任务的一种**。在 JavaScript 中，异步任务分为两类

1. **宏任务（Macrotask）**：
   - 包括 `setTimeout`、`setInterval`、`setImmediate` 等。
   - 通常来自用户交互（如点击事件）或定时器。
   - 每个宏任务会放入宏任务队列（Task Queue）。
2. **微任务（Microtask）**：
   - 包括 `Promise`、`MutationObserver`、`process.nextTick`（Node.js）等。
   - 通常来自异步操作（如 `Promise` 的 `then` 回调）或 DOM 变化监听。
   - 每个微任务会放入微任务队列（Microtask Queue）。

**执行顺序**：

JavaScript 的执行顺序遵循以下规则：

1. **执行栈（Call Stack）**：优先执行同步任务。
2. **微任务队列（Microtask Queue）**：当执行栈清空后，立即执行所有微任务。
3. **宏任务队列（Task Queue）**：在微任务执行完毕后，再执行宏任务。

**微任务是异步任务的一种，优先级高于宏任务。**

## DOM

### 概述

DOM 是 JavaScript 操作网页的接口，全称为“文档对象模型”（Document Object Model）。它的作用是将网页转为一个 JavaScript 对象，从而可以用脚本进行各种操作（比如增删内容）。

### 节点

DOM 的最小组成单位叫做节点（node）。文档的树形结构（DOM 树），就是由各种不同类型的节点组成。每个节点可以看作是文档树的一片叶子。

节点的类型有七种。

- `Document`：整个文档树的顶层节点
- `DocumentType`：`doctype`标签（比如`<!DOCTYPE html>`）
- `Element`：网页的各种HTML标签（比如`<body>`、`<a>`等）
- `Attr`：网页元素的属性（比如`class="right"`）
- `Text`：标签之间或标签包含的文本
- `Comment`：注释
- `DocumentFragment`：文档的片段

浏览器提供一个原生的节点对象`Node`，上面这七种节点都继承了`Node`，**因此具有一些共同的属性和方法。**

> [!tip]
>
> **DocumentFragment** 是 DOM（文档对象模型）中的一个特殊节点类型，它代表一个轻量级的文档片段。
>
> DocumentFragment 节点本身不是一个真实的 DOM 节点，因此它不会直接出现在浏览器的渲染树中。**它主要用于临时存储和管理一组节点，以便在需要时一次性将它们添加到实际的 DOM 树中**
>
> 

### 节点树

一个文档的所有节点，按照所在的层级，可以抽象成一种树状结构。

这种树状结构就是 DOM 树。它有一个顶层节点，下一层都是顶层节点的子节点，然后子节点又有自己的子节点，就这样层层衍生出一个金字塔结构，又像一棵树。

浏览器原生提供`document`节点，代表整个文档。

```js
document
// 整个文档树
#document
```

文档的第一层有两个节点，第一个是文档类型节点（`<!doctype html>`），第二个是 HTML 网页的顶层容器标签`<html>`。后者构成了树结构的根节点（root node），其他 HTML 标签节点都是它的下级节点。

除了根节点，其他节点都有三种层级关系。

- 父节点关系（parentNode）：直接的那个上级节点
- 子节点关系（childNodes）：直接的下级节点
- 同级节点关系（sibling）：拥有同一个父节点的节点

DOM 提供操作接口，用来获取这三种关系的节点。

比如，子节点接口包括`firstChild`（第一个子节点）和`lastChild`（最后一个子节点）等属性，同级节点接口包括`nextSibling`（紧邻在后的那个同级节点）和`previousSibling`（紧邻在前的那个同级节点）属性。

### Node 属性

#### nodeType

`Node.prototype.nodeType`属性返回一个整数值，表示节点的类型。

```js
document.nodeType // 9
```

上面代码中，文档节点的类型值为9。

Node 对象定义了几个常量，对应这些类型值。

```js
document.nodeType === Node.DOCUMENT_NODE // true
```

上面代码中，文档节点的`nodeType`属性等于常量`Node.DOCUMENT_NODE`。

不同节点的`nodeType`属性值和对应的常量如下。

- 文档节点（document）：9，对应常量`Node.DOCUMENT_NODE`
- 元素节点（element）：1，对应常量`Node.ELEMENT_NODE`
- 属性节点（attr）：2，对应常量`Node.ATTRIBUTE_NODE`
- 文本节点（text）：3，对应常量`Node.TEXT_NODE`
- 文档片断节点（DocumentFragment）：11，对应常量`Node.DOCUMENT_FRAGMENT_NODE`
- 文档类型节点（DocumentType）：10，对应常量`Node.DOCUMENT_TYPE_NODE`
- 注释节点（Comment）：8，对应常量`Node.COMMENT_NODE`

#### nodeName 

`Node.prototype.nodeName`属性返回节点的名称。

```js
// HTML 代码如下
// <div id="d1">hello world</div>
var div = document.getElementById('d1');
div.nodeName // "DIV"
```

上面代码中，元素节点`<div>`的`nodeName`属性就是大写的标签名`DIV`。

不同节点的`nodeName`属性值如下。

- 文档节点（document）：`#document`
- 元素节点（element）：大写的标签名
- 属性节点（attr）：属性的名称
- 文本节点（text）：`#text`
- 文档片断节点（DocumentFragment）：`#document-fragment`
- 文档类型节点（DocumentType）：文档的类型
- 注释节点（Comment）：`#comment`

#### nodeValue 

`Node.prototype.nodeValue`属性返回一个字符串，表示当前节点本身的文本值，该属性可读写。

只有文本节点（text）、注释节点（comment）和属性节点（attr）有文本值，因此这三类节点的`nodeValue`可以返回结果，其他类型的节点一律返回`null`。

同样的，也只有这三类节点可以设置`nodeValue`属性的值，其他类型的节点设置无效。

```js
// HTML 代码如下
// <div id="d1">hello world</div>
var div = document.getElementById('d1');
div.nodeValue // null
div.firstChild.nodeValue // "hello world"
```

上面代码中，`div`是元素节点，`nodeValue`属性返回`null`。`div.firstChild`是文本节点，所以可以返回文本值。

#### textContent

`Node.prototype.textContent`属性返回当前节点和它的所有后代节点的文本内容。

```js
// HTML 代码为
// <div id="divA">This is <span>some</span> text</div>

document.getElementById('divA').textContent
// This is some text
```

`textContent`属性**自动忽略当前节点内部的 HTML 标签**，返回所有文本内容。

该属性是可读写的，设置该属性的值，会用一个新的文本节点，替换所有原来的子节点。

它还有一个好处，就是自动对 HTML 标签转义（纯字符串使用）。这很适合用于用户提供的内容（防止用户插入带有标签的内容）。

```js
document.getElementById('foo').textContent = '<p>GoodBye!</p>';
```

上面代码在插入文本时，会将`<p>`标签解释为文本，而不会当作标签处理。

对于文本节点（text）、注释节点（comment）和属性节点（attr），`textContent`属性的值与`nodeValue`属性相同。

对于其他类型的节点，该属性会将每个子节点（不包括注释节点）的内容连接在一起返回。如果一个节点没有子节点，则返回空字符串。

文档节点（document）和文档类型节点（doctype）的`textContent`属性为`null`。如果要读取整个文档的内容，可以使用`document.documentElement.textContent`。

#### aseURI

`Node.prototype.baseURI`属性返回一个字符串，表示当前网页的绝对路径。浏览器根据这个属性，计算网页上的相对路径的 URL。该属性为只读。

```js
// 当前网页的网址为
// http://www.example.com/index.html
document.baseURI
// "http://www.example.com/index.html"
```

如果无法读到网页的 URL，`baseURI`属性返回`null`。

该属性的值一般由当前网址的 URL（即`window.location`属性）决定，但是可以使用 HTML 的`<base>`标签，改变该属性的值。

```js
<base href="http://www.example.com/page.html">
```

设置了以后，`baseURI`属性就返回`<base>`标签设置的值。

#### ownerDocument

`Node.prototype.ownerDocument`属性返回当前节点所在的顶层文档对象，即`document`对象。

`document`对象本身的`ownerDocument`属性，返回`null`。

#### nextSibling 

`Node.prototype.nextSibling `属性返回紧跟在当前节点后面的第一个同级节点。如果当前节点后面没有同级节点，则返回`null`。

```js
// HTML 代码如下
// <div id="d1">hello</div><div id="d2">world</div>
var d1 = document.getElementById('d1');
var d2 = document.getElementById('d2');

d1.nextSibling === d2 // true
```

上面代码中，`d1.nextSibling`就是**紧跟**在`d1`后面的同级节点`d2`。

注意，该属性还包括文本节点和注释节点（`<!-- comment -->`）。因此**如果当前节点后面有空格**，该属性会返回一个文本节点，内容为空格。

#### previousSibling 

`Node.prototype.previousSibling`属性返回当前节点前面的、距离最近的一个同级节点。如果当前节点前面没有同级节点，则返回`null`。

注意，该属性还包括文本节点和注释节点。因此如果当前节点前面有空格，该属性会返回一个文本节点，内容为空格。

#### parentNode 

`Node.prototype.parentNode`属性返回当前节点的父节点。对于一个节点来说，它的父节点只可能是三种类型：元素节点（element）、文档节点（document）和文档片段节点（documentfragment）。

文档节点（document）和文档片段节点（documentfragment）的父节点都是`null`。另外，对于那些生成后还没插入 DOM 树的节点，父节点也是`null`。

#### parentElement 

`Node.prototype.parentElement`属性返回当前节点的父元素节点。如果当前节点没有父节点，或者父节点类型不是元素节点，则返回`null`。

由于父节点只可能是三种类型：**元素节点**、文档节点（document）和文档片段节点（documentfragment）。`parentElement`属性相当于把后两种父节点都排除了。

#### firstChild

`Node.prototype.firstChild`属性返回当前节点的第一个子节点，如果当前节点没有子节点，则返回`null`。

注意，`firstChild`返回的除了元素节点，还可能是文本节点或注释节点。

```js
// HTML 代码如下
// <p id="p1">
//   <span>First span</span>
//  </p>
var p1 = document.getElementById('p1');
p1.firstChild.nodeName // "#text"
```

上面代码中，`p`元素与`span`元素之间有空白字符，这导致`firstChild`返回的是文本节点。

#### lastChild 

`lastChild`属性返回当前节点的最后一个子节点，如果当前节点没有子节点，则返回`null`。用法与`firstChild`属性相同。

#### childNodes 

`Node.prototype.childNodes`属性返回一个类似数组的对象（`NodeList`集合），成员包括当前节点的所有子节点。

```js
var children = document.querySelector('ul').childNodes;
```

上面代码中，`children`就是`ul`元素的所有子节点。

使用该属性，可以遍历某个节点的所有子节点。

```js
for (var i = 0; i < document.getElementById('div1').childNodes.length; i++) {
  // ...
}
```

文档节点（document）就有两个子节点：文档类型节点（docType）和 HTML 根元素节点。

```js
#document/
├─ <! DOCTYPE html>
├─ <html>...</html>
```

```js
var children = document.childNodes;
for (var i = 0; i < children.length; i++) {
  console.log(children[i].nodeType);
}
// 10
// 1
```

上面代码中，文档节点的第一个子节点的类型是10（即文档类型节点），第二个子节点的类型是1（即元素节点）。

注意，除了元素节点，`childNodes`属性的返回值还包括文本节点和注释节点。

如果当前节点不包括任何子节点，则返回一个空的`NodeList`集合。由于`NodeList`对象是一个动态集合，一旦子节点发生变化，立刻会反映在返回结果之中。

#### isConnected 

`Node.prototype.isConnected`属性返回一个布尔值，表示当前节点是否在文档之中。

```js
var test = document.createElement('p');
test.isConnected // false

document.body.appendChild(test);
test.isConnected // true
```

上面代码中，`test`节点是脚本生成的节点，没有插入文档之前，`isConnected`属性返回`false`，插入之后返回`true`。

### Node 方法 

#### appendChild()

`Node.prototype.appendChild()`方法接受一个节点对象作为参数，将其作为最后一个子节点，插入当前节点。该方法的返回值就是插入文档的子节点。

```js
var p = document.createElement('p');
document.body.appendChild(p);
```

上面代码新建一个`<p>`节点，将其插入`document.body`的尾部。

如果参数节点是 DOM **已经存在的节点**，`appendChild()`方法会将其从原来的位置，移动到新位置。

如果`appendChild()`方法的参数是`DocumentFragment`节点，那么插入的是`DocumentFragment`的所有子节点，而不是`DocumentFragment`节点本身。返回值是一个空的`DocumentFragment`节点。

#### hasChildNodes()

`Node.prototype.hasChildNodes()`方法返回一个布尔值，表示当前节点是否有子节点。

注意，子节点包括所有类型的节点，并不仅仅是元素节点。哪怕节点只包含一个空格，`hasChildNodes`方法也会返回`true`。

判断一个节点有没有子节点，有许多种方法，下面是其中的三种。

- `node.hasChildNodes()`
- `node.firstChild !== null`
- `node.childNodes && node.childNodes.length > 0`

#### cloneNode()

`Node.prototype.cloneNode()`方法用于克隆一个节点。它接受一个布尔值作为参数，表示是否同时克隆子节点。它的返回值是一个克隆出来的新节点。

```js
var cloneUL = document.querySelector('ul').cloneNode(true);
```

该方法有一些使用注意点。

（1）克隆一个节点，会拷贝该节点的所有属性，但是会丧失`addEventListener`方法和`on-`属性（即`node.onclick = fn`），添加在这个节点上的事件回调函数。

（2）该方法返回的节点不在文档之中，即没有任何父节点，必须使用诸如`Node.appendChild`这样的方法添加到文档之中。

（3）克隆一个节点之后，DOM 有可能出现两个有相同`id`属性（即`id="xxx"`）的网页元素，这时应该修改其中一个元素的`id`属性。如果原节点有`name`属性，可能也需要修改。

#### insertBefore()

`Node.prototype.insertBefore()`方法用于将某个节点插入父节点内部的指定位置。

```js
var insertedNode = parentNode.insertBefore(newNode, referenceNode);
```

`insertBefore`方法接受两个参数，第一个参数是所要插入的节点`newNode`，第二个参数是父节点`parentNode`内部的一个子节点`referenceNode`。`newNode`将插在`referenceNode`这个子节点的前面。返回值是插入的新节点`newNode`。

```js
var p = document.createElement('p');
document.body.insertBefore(p, document.body.firstChild);
```

上面代码中，新建一个`<p>`节点，插在`document.body.firstChild`的前面，也就是成为`document.body`的第一个子节点。

如果`insertBefore`方法的第二个参数为`null`，则新节点将插在当前节点内部的最后位置，即变成最后一个子节点。

```js
var p = document.createElement('p');
document.body.insertBefore(p, null);
```

上面代码中，`p`将成为`document.body`的最后一个子节点。这也说明`insertBefore`的第二个参数不能省略。

**注意**，如果所要插入的节点是当前 DOM 现有的节点，则该节点将从原有的位置移除，插入新的位置。

由于不存在`insertAfter`方法，如果新节点要插在父节点的某个子节点后面，可以用`insertBefore`方法结合`nextSibling`属性模拟。

```js
parent.insertBefore(s1, s2.nextSibling);
```

上面代码中，`parent`是父节点，`s1`是一个全新的节点，`s2`是可以将`s1`节点，插在`s2`节点的后面。

如果`s2`是当前节点的最后一个子节点，则`s2.nextSibling`返回`null`，这时`s1`节点会插在当前节点的最后，变成当前节点的最后一个子节点，等于紧跟在`s2`的后面。

如果要插入的节点是`DocumentFragment`类型，那么插入的将是`DocumentFragment`的所有子节点，而不是`DocumentFragment`节点本身。返回值将是一个空的`DocumentFragment`节点。

#### removeChild()

`Node.prototype.removeChild()`方法接受一个子节点作为参数，用于从当前节点移除该子节点。返回值是移除的子节点。

```js
var divA = document.getElementById('A');
divA.parentNode.removeChild(divA);
```

上面代码移除了`divA`节点。注意，这个方法是在`divA`的父节点上调用的，不是在`divA`上调用的。

**被移除的节点依然存在于内存之中**，但不再是 DOM 的一部分。

所以，一个节点移除以后，依然可以使用它，比如插入到另一个节点下面。

如果参数节点不是当前节点的子节点，`removeChild`方法将报错。

#### replaceChild()

`Node.prototype.replaceChild()`方法用于将一个新的节点，替换当前节点的某一个子节点。

```js
var replacedNode = parentNode.replaceChild(newChild, oldChild);
```

上面代码中，`replaceChild`方法接受两个参数，第一个参数`newChild`是用来替换的新节点，第二个参数`oldChild`是将要替换走的子节点。返回值是替换走的那个节点`oldChild`。

::: details 例子

```js
var divA = document.getElementById('divA');
var newSpan = document.createElement('span');
newSpan.textContent = 'Hello World!';
divA.parentNode.replaceChild(newSpan, divA);
```

上面代码是如何将指定节点`divA`替换走。

:::

#### contains()

`Node.prototype.contains()`方法返回一个布尔值，表示参数节点是否满足以下三个条件之一。

- 参数节点为当前节点。
- 参数节点为当前节点的子节点。
- 参数节点为当前节点的后代节点。

#### compareDocumentPosition()

`Node.prototype.compareDocumentPosition()`方法的用法，与`contains`方法完全一致，返回一个六个比特位的二进制值，表示参数节点与当前节点的关系。

| 二进制值 | 十进制值 | 含义                                               |
| -------- | -------- | -------------------------------------------------- |
| 000000   | 0        | 两个节点相同                                       |
| 000001   | 1        | 两个节点不在同一个文档（即有一个节点不在当前文档） |
| 000010   | 2        | 参数节点在当前节点的前面                           |
| 000100   | 4        | 参数节点在当前节点的后面                           |
| 001000   | 8        | 参数节点包含当前节点                               |
| 010000   | 16       | 当前节点包含参数节点                               |
| 100000   | 32       | 浏览器内部使用                                     |

#### isEqualNode()

`Node.prototype.isEqualNode()`方法返回一个布尔值，用于检查两个节点是否相等。所谓相等的节点，指的是两个节点的类型相同、属性相同、子节点相同。

#### isSameNode()

`Node.prototype.isSameNode()`方法返回一个布尔值，表示两个节点是否为同一个节点。

#### normalize()

`Node.prototype.normalize()`方法用于清理当前节点内部的所有文本节点（text）。它会去除空的文本节点，并且将毗邻的文本节点合并成一个，也就是说不存在空的文本节点，以及毗邻的文本节点。

```js
var wrapper = document.createElement('div');

wrapper.appendChild(document.createTextNode('Part 1 '));
wrapper.appendChild(document.createTextNode('Part 2 '));

wrapper.childNodes.length // 2
wrapper.normalize();
wrapper.childNodes.length // 1
```

上面代码使用`normalize`方法之前，`wrapper`节点有两个毗邻的文本子节点。使用`normalize`方法之后，两个文本子节点被合并成一个。

该方法是`Text.splitText`的逆方法。

#### getRootNode()

`Node.prototype.getRootNode()`方法返回当前节点所在文档的根节点`document`，与`ownerDocument`属性的作用相同。

**NodeList 接口，HTMLCollection 接口**：

节点都是单个对象，有时需要一种数据结构，能够容纳多个节点。DOM 提供两种节点集合，用于容纳多个节点：`NodeList`和`HTMLCollection`。

这两种集合都属于接口规范。许多DOM属性和方法，返回的结果是`NodeList`实例或者`HTMLCollection`实例。

主要区别是，`NodeList`可以包含各种类型的节点，`HTMLCollection`只能包含HTML元素节点。

### NodeList 接口

#### 概述

`NodeList`实例是一个类似数组的对象，它的成员是节点对象。通过以下方法可以得到`NodeList`实例。

- `Node.childNodes`
- `document.querySelectorAll()`等节点搜索方法

```js
document.body.childNodes instanceof NodeList // true
```

`NodeList`实例很像数组，可以使用`length`属性和`forEach`方法。但是，它不是数组，不能使用`pop`或`push`之类数组特有的方法。

如果`NodeList`实例要使用数组方法，可以将其转为真正的数组。

```js
var children = document.body.childNodes;
var nodeArr = Array.prototype.slice.call(children);
```

除了使用`forEach`方法遍历 NodeList 实例，还可以使用`for`循环。

```js
var children = document.body.childNodes;

for (var i = 0; i < children.length; i++) {
  var item = children[i];
}
```

注意，NodeList 实例可能是动态集合，也可能是静态集合。所谓动态集合就是一个活的集合，DOM 删除或新增一个相关节点，都会立刻反映在 NodeList 实例。

目前，只有`Node.childNodes`返回的是一个动态集合，其他的 NodeList 都是静态集合。

```js
var children = document.body.childNodes;
children.length // 18
document.body.appendChild(document.createElement('p'));
children.length // 19
```

上面代码中，文档增加一个子节点，NodeList 实例`children`的`length`属性就增加了1。

#### length 

`NodeList.prototype.length`属性返回 NodeList 实例包含的节点数量。

#### forEach()

`NodeList.prototype.forEach()`方法用于遍历 NodeList 的所有成员。它接受一个回调函数作为参数，每一轮遍历就执行一次这个回调函数，用法与数组实例的`forEach`方法完全一致。

```js
var children = document.body.childNodes;
children.forEach(function f(item, i, list) {
  // ...
}, this);
```

上面代码中，回调函数`f`的三个参数依次是当前成员、位置和当前 NodeList 实例。`forEach`方法的第二个参数，用于绑定回调函数内部的`this`，该参数可省略。

#### item()

`NodeList.prototype.item()`方法接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。

```js
document.body.childNodes.item(0)
```

如果参数值大于实际长度，或者索引不合法（比如负数），`item`方法返回`null`。如果省略参数，`item`方法会报错。

所有类似数组的对象，都可以使用方括号运算符取出成员。一般情况下，都是使用方括号运算符，而不使用`item`方法。

```js
document.body.childNodes[0]
```

#### keys()

#### values()

#### entries()

这三个方法都返回一个 ES6 的遍历器对象，可以通过`for...of`循环遍历获取每一个成员的信息。

区别在于，`keys()`返回键名的遍历器，`values()`返回键值的遍历器，`entries()`返回的遍历器同时包含键名和键值的信息。

```js
var children = document.body.childNodes;

for (var key of children.keys()) {
  console.log(key);
}
// 0
// 1
// 2
// ...

for (var value of children.values()) {
  console.log(value);
}
// #text
// <script>
// ...

for (var entry of children.entries()) {
  console.log(entry);
}
// Array [ 0, #text ]
// Array [ 1, <script> ]
// ...
```

### HTMLCollection 接口

#### 概述

`HTMLCollection`是一个节点对象的集合，只能包含元素节点（element），不能包含其他类型的节点。

它的返回值是一个类似数组的对象，但是与`NodeList`接口不同，`HTMLCollection`没有`forEach`方法，只能使用`for`循环遍历。

返回`HTMLCollection`实例的，主要是一些`Document`对象的集合属性，比如`document.links`、`document.forms`、`document.images`等。

```js
document.links instanceof HTMLCollection // true
```

`HTMLCollection`实例都是动态集合，节点的变化会实时反映在集合中。

如果元素节点有`id`或`name`属性，那么`HTMLCollection`实例上面，可以使用`id`属性或`name`属性引用该节点元素。如果没有对应的节点，则返回`null`。

```js
// HTML 代码如下
// <img id="pic" src="http://example.com/foo.jpg">

var pic = document.getElementById('pic');
document.images.pic === pic // true
```

上面代码中，`document.images`是一个`HTMLCollection`实例，可以通过`<img>`元素的`id`属性值，从`HTMLCollection`实例上取到这个元素。

#### length()

`HTMLCollection.prototype.length`属性返回`HTMLCollection`实例包含的成员数量。

#### item()

`HTMLCollection.prototype.item()`方法接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。

#### namedItem()

`HTMLCollection.prototype.namedItem()`方法的参数是一个字符串，表示`id`属性或`name`属性的值，返回当前集合中对应的元素节点。如果没有对应的节点，则返回`null`。

```js
// HTML 代码如下
// <img id="pic" src="http://example.com/foo.jpg">

var pic = document.getElementById('pic');
document.images.namedItem('pic') === pic // true
```

**ParentNode 接口，ChildNode 接口**：

节点对象除了继承 Node 接口以外，还拥有其他接口。

`ParentNode`接口表示当前节点是一个父节点，提供一些处理子节点的方法。`ChildNode`接口表示当前节点是一个子节点，提供一些相关方法。

### ParentNode 接口

如果当前节点是父节点，就会混入了（mixin）`ParentNode`接口。

由于只有元素节点（element）、文档节点（document）和文档片段节点（documentFragment）拥有子节点，因此只有这三类节点会拥有`ParentNode`接口。

#### ParentNode.children

`children`属性返回一个`HTMLCollection`实例，成员是当前节点的**所有元素子节点**。该属性只读。

下面是遍历某个节点的所有元素子节点的示例。

```js
for (var i = 0; i < el.children.length; i++) {
  // ...
}
```

注意，`children`属性只包括元素子节点，不包括其他类型的子节点（比如文本子节点）。如果没有元素类型的子节点，返回值`HTMLCollection`实例的`length`属性为`0`。

另外，`HTMLCollection`是动态集合，会实时反映 DOM 的任何变化。

#### ParentNode.firstElementChild

`firstElementChild`属性返回当前节点的第一个元素子节点。如果没有任何元素子节点，则返回`null`。

```js
document.firstElementChild.nodeName
// "HTML"
```

#### ParentNode.lastElementChild

`lastElementChild`属性返回当前节点的最后一个元素子节点，如果不存在任何元素子节点，则返回`null`。

#### ParentNode.childElementCount

`childElementCount`属性返回一个整数，表示当前节点的所有元素子节点的数目。如果不包含任何元素子节点，则返回`0`。

#### ParentNode.append()

`append()`方法为当前节点追加一个或多个子节点，位置是最后一个元素子节点的后面，该方法没有返回值。

该方法不仅可以添加元素子节点（参数为元素节点），还可以添加文本子节点（参数为字符串）。

```js
var parent = document.body;

// 添加元素子节点
var p = document.createElement('p');
parent.append(p);

// 添加文本子节点
parent.append('Hello');

// 添加多个元素子节点
var p1 = document.createElement('p');
var p2 = document.createElement('p');
parent.append(p1, p2);

// 添加元素子节点和文本子节点
var p = document.createElement('p');
parent.append('Hello', p);
```

注意，该方法与`Node.prototype.appendChild()`方法有三点不同。

- `append()`允许字符串作为参数，`appendChild()`只允许子节点作为参数。
- `append()`没有返回值，而`appendChild()`返回添加的子节点。
- `append()`可以添加多个子节点和字符串（即允许多个参数），`appendChild()`只能添加一个节点（即只允许一个参数）。

#### ParentNode.prepend()

`prepend()`方法为当前节点追加一个或多个子节点，位置是第一个元素子节点的前面。它的用法与`append()`方法完全一致，也是没有返回值。

### ChildNode 接口

如果一个节点有父节点，那么该节点就拥有了ChildNode接口。

#### ChildNode.remove()

`remove()`方法用于从父节点移除当前节点。

```js
el.remove()
```

上面代码在 DOM 里面移除了`el`节点。

#### ChildNode.before()

`before()`方法用于在当前节点的前面，插入一个或多个同级节点。两者拥有相同的父节点。

注意，该方法不仅可以插入元素节点，还可以插入文本节点。

```js
var p = document.createElement('p');
var p1 = document.createElement('p');

// 插入元素节点
el.before(p);

// 插入文本节点
el.before('Hello');

// 插入多个元素节点
el.before(p, p1);

// 插入元素节点和文本节点
el.before(p, 'Hello');
```

#### ChildNode.after()

`after()`方法用于在当前节点的后面，插入一个或多个同级节点，两者拥有相同的父节点。用法与`before`方法完全相同。

#### ChildNode.replaceWith()

`replaceWith()`方法使用参数节点，替换当前节点。参数可以是元素节点，也可以是文本节点。

```js
var span = document.createElement('span');
el.replaceWith(span);
```

上面代码中，`el`节点将被`span`节点替换。

### Document 节点

#### 概述

`document`节点对象代表整个文档，每张网页都有自己的`document`对象。

`window.document`属性就指向这个对象。只要浏览器开始载入 HTML 文档，该对象就存在了，可以直接使用。

`document`对象有不同的办法可以获取。

- 正常的网页，直接使用`document`或`window.document`。
- `iframe`框架里面的网页，使用`iframe`节点的`contentDocument`属性。
- Ajax 操作返回的文档，使用`XMLHttpRequest`对象的`responseXML`属性。
- 内部节点的`ownerDocument`属性。

`document`对象继承了`EventTarget`接口和`Node`接口，并且混入（mixin）了`ParentNode`接口。

这意味着，这些接口的方法都可以在`document`对象上调用。除此之外，`document`对象还有很多自己的属性和方法。

#### 快捷方式属性

以下属性是指向文档内部的某个节点的快捷方式。

**（1）document.defaultView**

`document.defaultView`属性返回`document`对象所属的`window`对象。如果当前文档不属于`window`对象，该属性返回`null`。

```js
document.defaultView === window // true
```

**（2）document.doctype**

对于 HTML 文档来说，`document`对象一般有两个子节点。第一个子节点是`document.doctype`，指向`<DOCTYPE>`节点，即文档类型（Document Type Declaration，简写DTD）节点。

HTML 的文档类型节点，一般写成`<!DOCTYPE html>`。如果网页没有声明 DTD，该属性返回`null`。

`document.firstChild`通常就返回这个节点。

**（3）document.documentElement**

`document.documentElement`属性返回当前文档的根元素节点（root）。

它通常是`document`节点的第二个子节点，紧跟在`document.doctype`节点后面。HTML网页的该属性，一般是`<html>`节点。

**（4）document.body，document.head**

`document.body`属性指向`<body>`节点，`document.head`属性指向`<head>`节点。

这两个属性总是存在的，如果网页源码里面省略了`<head>`或`<body>`，浏览器会自动创建。另外，这两个属性是可写的，如果改写它们的值，相当于移除所有子节点。

**（5）document.scrollingElement**

`document.scrollingElement`属性返回文档的滚动元素。也就是说，当文档整体滚动时，到底是哪个元素在滚动。

标准模式下，这个属性返回的文档的根元素`document.documentElement`（即`<html>`）。兼容（quirk）模式下，返回的是`<body>`元素，如果该元素不存在，返回`null`。

**（6）document.activeElement**

`document.activeElement`属性返回获得**当前焦点（focus）的 DOM 元素**。通常，这个属性返回的是`<input>`、`<textarea>`、`<select>`等表单元素，如果当前没有焦点元素，返回`<body>`元素或`null`。

**（7）document.fullscreenElement**

`document.fullscreenElement`属性返回当前以全屏状态展示的 DOM 元素。如果不是全屏状态，该属性返回`null`。

```js
if (
  document.fullscreenElement && 
  document.fullscreenElement.nodeName == 'VIDEO'
) {
  console.log('全屏播放视频');
}
```

上面代码中，通过`document.fullscreenElement`可以知道`<video>`元素有没有处在全屏状态，从而判断用户行为。

#### 节点集合属性

以下属性返回一个`HTMLCollection`实例，表示文档内部特定元素的集合。这些集合都是动态的，原节点有任何变化，立刻会反映在集合中。

**（1）document.links**

`document.links`属性返回当前文档所有设定了`href`属性的`<a>`及`<area>`节点。

**（2）document.forms**

`document.forms`属性返回所有`<form>`表单节点。

除了使用位置序号，`id`属性和`name`属性也可以用来引用表单。

```js
document.forms[0] === document.forms.foo
```

**（3）document.images**

`document.images`属性返回页面所有`<img>`图片节点。

```js
var imglist = document.images;

for(var i = 0; i < imglist.length; i++) {
  if (imglist[i].src === 'banner.gif') {
    // ...
  }
}
```

上面代码在所有`img`标签中，寻找某张图片。

**（4）document.embeds，document.plugins**

`document.embeds`属性和`document.plugins`属性，都返回所有`<embed>`节点。

**（5）document.scripts**

`document.scripts`属性返回所有`<script>`节点。

```js
var scripts = document.scripts;
if (scripts.length !== 0 ) {
  console.log('当前网页有脚本');
}
```

**（6）document.styleSheets**

`document.styleSheets`属性返回网页内嵌或引入的 CSS 样式表集合。

**（7）小结**

除了`document.styleSheets`属性，以上的其他集合属性返回的都是`HTMLCollection`实例。`document.styleSheets`属性返回的是`StyleSheetList`实例。

```js
document.links instanceof HTMLCollection // true
document.images instanceof HTMLCollection // true
document.forms instanceof HTMLCollection // true
document.embeds instanceof HTMLCollection // true
document.scripts instanceof HTMLCollection // true
```

`HTMLCollection`实例是类似数组的对象，所以上面这些属性都有`length`属性，都可以使用方括号运算符引用成员。

如果成员有`id`或`name`属性，还可以用这两个属性的值，在`HTMLCollection`实例上引用到这个成员。

#### 文档静态信息属性

以下属性返回文档信息。

**（1）document.documentURI，document.URL**

`document.documentURI`属性和`document.URL`属性都返回一个字符串，表示当前文档的网址（带锚点）。

不同之处是它们继承自不同的接口，

`documentURI`继承自`Document`接口，可用于所有文档；

`URL`继承自`HTMLDocument`接口，只能用于 HTML 文档。

如果文档的锚点（`#anchor`）变化，这两个属性都会跟着变化。

**（2）document.domain**

`document.domain`属性返回当前文档的域名，不包含协议和端口。

比如，网页的网址是`http://www.example.com:80/hello.html`，那么`document.domain`属性就等于`www.example.com`。如果无法获取域名，该属性返回`null`。

`document.domain`基本上是一个只读属性，只有一种情况除外。

次级域名的网页，可以把`document.domain`设为对应的上级域名。比如，当前域名是`a.sub.example.com`，则`document.domain`属性可以设置为`sub.example.com`，也可以设为`example.com`。修改后，`document.domain`相同的两个网页，可以读取对方的资源，比如设置的 Cookie。

另外，设置`document.domain`会导致端口被改成`null`。因此，如果通过设置`document.domain`来进行通信，双方网页都必须设置这个值，才能保证端口相同。

**（3）document.location**

`Location`对象是浏览器提供的原生对象，**提供 URL 相关的信息和操作方法**。通过`window.location`和`document.location`属性，可以拿到这个对象。

**（4）document.lastModified**

`document.lastModified`属性返回一个字符串，表示当前文档最后修改的时间。不同浏览器的返回值，日期格式是不一样的。

注意，`document.lastModified`属性的值是字符串，所以不能直接用来比较。`Date.parse`方法将其转为`Date`实例，才能比较两个网页。

```js
var lastVisitedDate = Date.parse('01/01/2018');
if (Date.parse(document.lastModified) > lastVisitedDate) {
  console.log('网页已经变更');
}
```

如果页面上有 JavaScript 生成的内容，`document.lastModified`属性返回的总是当前时间。

**（5）document.title**

`document.title`属性返回当前文档的标题。默认情况下，返回`<title>`节点的值。但是该属性是可写的，一旦被修改，就返回修改后的值。

**（6）document.characterSet**

`document.characterSet`属性返回当前文档的编码，比如`UTF-8`、`ISO-8859-1`等等。

**（7）document.referrer**

`document.referrer`属性返回一个字符串，表示当前文档的访问者来自哪里。

如果无法获取来源，或者用户直接键入网址而不是从其他网页点击进入，`document.referrer`返回一个空字符串。

`document.referrer`的值，总是与 HTTP 头信息的`Referer`字段保持一致。但是，`document.referrer`的拼写有两个`r`，而头信息的`Referer`字段只有一个`r`。

**（8）document.dir**

`document.dir`返回一个字符串，表示文字方向。它只有两个可能的值：`rtl`表示文字从右到左，阿拉伯文是这种方式；`ltr`表示文字从左到右，包括英语和汉语在内的大多数文字采用这种方式。

**（9）document.compatMode**

`compatMode`属性返回浏览器处理文档的模式，可能的值为`BackCompat`（向后兼容模式）和`CSS1Compat`（严格模式）。

一般来说，如果网页代码的第一行设置了明确的`DOCTYPE`（比如`<!doctype html>`），`document.compatMode`的值都为`CSS1Compat`。

#### 文档状态属性

**（1）document.hidden**

`document.hidden`属性返回一个布尔值，表示当前页面是否可见。如果窗口最小化、浏览器切换了 Tab，都会导致导致页面不可见，使得`document.hidden`返回`true`。

这个属性是 Page Visibility API 引入的，一般都是配合这个 API 使用。

**（2）document.visibilityState**

`document.visibilityState`返回文档的可见状态。

它的值有四种可能。

 - `visible`：页面可见。注意，页面可能是部分可见，即不是焦点窗口，前面被其他窗口部分挡住了。
 - `hidden`：页面不可见，有可能窗口最小化，或者浏览器切换到了另一个 Tab。
 - `prerender`：页面处于正在渲染状态，对于用户来说，该页面不可见。
 - `unloaded`：页面从内存里面卸载了。

这个属性可以用在页面加载时，防止加载某些资源；或者页面不可见时，停掉一些页面功能。

**（3）document.readyState**

`document.readyState`属性返回当前文档的状态，共有三种可能的值。

- `loading`：加载 HTML 代码阶段（尚未完成解析）
- `interactive`：加载外部资源阶段
- `complete`：加载完成

这个属性变化的过程如下。

1. 浏览器开始解析 HTML 文档，`document.readyState`属性等于`loading`。
2. 浏览器遇到 HTML 文档中的`<script>`元素，并且没有`async`或`defer`属性，就暂停解析，开始执行脚本，这时`document.readyState`属性还是等于`loading`。
3. HTML 文档解析完成，`document.readyState`属性变成`interactive`。
4. 浏览器等待图片、样式表、字体文件等外部资源加载完成，一旦全部加载完成，`document.readyState`属性变成`complete`。

下面的代码用来检查网页是否加载成功。

```js
// 基本检查
if (document.readyState === 'complete') {
  // ...
}

// 轮询检查
var interval = setInterval(function() {
  if (document.readyState === 'complete') {
    clearInterval(interval);
    // ...
  }
}, 100);
```

另外，每次状态变化都会触发一个`readystatechange`事件。

#### document.cookie

`document.cookie`属性用来操作浏览器 Cookie。

#### document.designMode

`document.designMode`属性控制当前文档是否可编辑。该属性只有两个值`on`和`off`，默认值为`off`。一旦设为`on`，用户就可以编辑整个文档的内容。

下面代码打开`iframe`元素内部文档的`designMode`属性，就能将其变为一个所见即所得的编辑器。

```js
// HTML 代码如下
// <iframe id="editor" src="about:blank"></iframe>
var editor = document.getElementById('editor');
editor.contentDocument.designMode = 'on';
```

#### document.currentScript

`document.currentScript`属性只用在`<script>`元素的内嵌脚本或加载的外部脚本之中，返回**当前脚本**所在的那个 DOM 节点，即`<script>`元素的 DOM 节点。

```js
<script id="foo">
  console.log(
    document.currentScript === document.getElementById('foo')
  ); // true
</script>
```

上面代码中，`document.currentScript`就是`<script>`元素节点。

#### document.implementation

`document.implementation`属性返回一个`DOMImplementation`对象。该对象有三个方法，主要用于创建独立于当前文档的新的 Document 对象。

- `DOMImplementation.createDocument()`：创建一个 XML 文档。
- `DOMImplementation.createHTMLDocument()`：创建一个 HTML 文档。
- `DOMImplementation.createDocumentType()`：创建一个 DocumentType 对象。

```js
var doc = document.implementation.createHTMLDocument('Title');
var p = doc.createElement('p');
p.innerHTML = 'hello world';
doc.body.appendChild(p);

document.replaceChild(
  doc.documentElement,
  document.documentElement
);
```

上面代码中，第一步生成一个新的 HTML 文档`doc`，然后用它的根元素`doc.documentElement`替换掉`document.documentElement`。这会使得当前文档的内容全部消失，变成`hello world`。

#### document.open()

`document.open`方法清除当前文档所有内容，使得文档处于可写状态，供`document.write`方法写入内容。

#### document.close()

`document.close`方法用来关闭`document.open()`打开的文档。

```js
document.open();
document.write('hello world');
document.close();
```

#### document.write()

`document.write`方法用于向当前文档写入内容。

在网页的首次渲染阶段，只要页面没有关闭写入（即没有执行`document.close()`），`document.write`写入的内容就会追加在已有内容的后面。

注意，`document.write`会当作 HTML 代码解析，不会转义。

如果页面已经解析完成（`DOMContentLoaded`事件发生之后），再调用`write`方法，它会先调用`open`方法，擦除当前文档所有内容，然后再写入。

```js
document.addEventListener('DOMContentLoaded', function (event) {
  document.write('<p>Hello World!</p>');
});

// 等同于
document.addEventListener('DOMContentLoaded', function (event) {
  document.open();
  document.write('<p>Hello World!</p>');
  document.close();
});
```

如果在页面渲染过程中调用`write`方法，并不会自动调用`open`方法。（可以理解成，`open`方法已调用，但`close`方法还未调用。）

`document.write`是 JavaScript 语言标准化之前就存在的方法，现在完全有更符合标准的方法向文档写入内容（比如对`innerHTML`属性赋值）。所以，除了某些特殊情况，应该尽量避免使用`document.write`这个方法。

#### document.writeln()

`document.writeln`方法与`write`方法完全一致，除了会在输出内容的尾部添加换行符。

注意，`writeln`方法添加的是 ASCII 码的换行符，渲染成 HTML 网页时不起作用，即在网页上显示不出换行。网页上的换行，必须显式写入`<br>`。

#### document.querySelector()

`document.querySelector`方法接受一个 CSS 选择器作为参数，返回匹配该选择器的元素节点。如果有多个节点满足匹配条件，则返回第一个匹配的节点。如果没有发现匹配的节点，则返回`null`。

```js
var el1 = document.querySelector('.myclass');
```

#### document.querySelectorAll()

`document.querySelectorAll`方法与`querySelector`用法类似，区别是返回一个`NodeList`对象，包含所有匹配给定选择器的节点。

```js
elementList = document.querySelectorAll('.myclass');
```

这两个方法的参数，可以是逗号分隔的多个 CSS 选择器，返回匹配其中一个选择器的元素节点，这与 CSS 选择器的规则是一致的。

```js
var matches = document.querySelectorAll('div.note, div.alert');
```

上面代码返回`class`属性是`note`或`alert`的`div`元素。

上述的两个方法都支持复杂的 CSS 选择器。

```js
// 选中 data-foo-bar 属性等于 someval 的元素
document.querySelectorAll('[data-foo-bar="someval"]');

// 选中 myForm 表单中所有不通过验证的元素
document.querySelectorAll('#myForm :invalid');

// 选中div元素，那些 class 含 ignore 的除外
document.querySelectorAll('DIV:not(.ignore)');

// 同时选中 div，a，script 三类元素
document.querySelectorAll('DIV, A, SCRIPT');
```

但是，它们不支持 CSS 伪元素的选择器（比如`:first-line`和`:first-letter`）和伪类的选择器（比如`:link`和`:visited`），即无法选中伪元素和伪类。

如果`querySelectorAll`方法的参数是字符串`*`，则会返回文档中的所有元素节点。

另外，`querySelectorAll`的返回结果不是动态集合，不会实时反映元素节点的变化。

最后，上述两个方法除了定义在`document`对象上，还定义在元素节点上，即在元素节点上也可以调用。

#### document.getElementsByTagName()

`document.getElementsByTagName()`方法搜索 HTML 标签名，返回符合条件的元素。

它的返回值是一个类似数组对象（`HTMLCollection`实例），可以实时反映 HTML 文档的变化。如果没有任何匹配的元素，就返回一个空集。

```js
var paras = document.getElementsByTagName('p');
paras instanceof HTMLCollection // true
```

上面代码返回当前文档的所有`p`元素节点。

HTML 标签名是大小写不敏感的，因此`getElementsByTagName()`方法的参数也是大小写不敏感的。

返回结果中，各个成员的顺序就是它们在文档中出现的顺序。

如果传入`*`，就可以返回文档中所有 HTML 元素。

```js
var allElements = document.getElementsByTagName('*');
```

**注意**，元素节点本身也定义了`getElementsByTagName`方法，返回该元素的后代元素中符合条件的元素。也就是说，这个方法不仅可以在`document`对象上调用，也可以在任何元素节点上调用。

```js
var firstPara = document.getElementsByTagName('p')[0];
var spans = firstPara.getElementsByTagName('span');
```

上面代码选中第一个`p`元素内部的所有`span`元素。

#### document.getElementsByClassName()

`document.getElementsByClassName()`方法返回一个类似数组的对象（`HTMLCollection`实例），包括了所有`class`名字符合指定条件的元素，元素的变化实时反映在返回结果中。

参数可以是多个`class`，它们之间使用空格分隔。

```js
var elements = document.getElementsByClassName('foo bar');
```

上面代码返回同时具有foo和bar两个class的元素，foo和bar的顺序不重要。

注意，正常模式下，CSS 的`class`是大小写敏感的。（`quirks mode`下，大小写不敏感。）

与`getElementsByTagName()`方法一样，`getElementsByClassName()`方法不仅可以在`document`对象上调用，也可以在任何元素节点上调用。

#### document.getElementsByName() 

`document.getElementsByName()`方法用于选择拥有`name`属性的 HTML 元素（比如`<form>`、`<radio>`、`<img>`、`<frame>`、`<embed>`和`<object>`等），返回一个类似数组的的对象（`NodeList`实例），因为`name`属性相同的元素可能不止一个。

```js
// 表单为 <form name="x"></form>
var forms = document.getElementsByName('x');
forms[0].tagName // "FORM"
```

#### document.getElementById() 

`document.getElementById()`方法返回匹配指定`id`属性的元素节点。如果没有发现匹配的节点，则返回`null`。

注意，该方法的参数是大小写敏感的。比如，如果某个节点的`id`属性是`main`，那么`document.getElementById('Main')`将返回`null`。

`document.getElementById()`方法与`document.querySelector()`方法都能获取元素节点，不同之处是`document.querySelector()`方法的参数使用 CSS 选择器语法，`document.getElementById()`方法的参数是元素的`id`属性。

```js
document.getElementById('myElement')
document.querySelector('#myElement')
```

上面代码中，两个方法都能选中`id`为`myElement`的元素，但是`document.getElementById()`比`document.querySelector()`效率高得多。

另外，这个方法（`document.getElementById()`）只能在`document`对象上使用，不能在其他元素节点上使用。

#### document.elementFromPoint()

`document.elementFromPoint()`方法返回位于页面指定位置（坐标）最上层的元素节点。

```js
var element = document.elementFromPoint(50, 50);
```

上面代码选中在`(50, 50)`这个坐标位置的最上层的那个 HTML 元素。

`elementFromPoint`方法的两个参数，依次是相对于当前视口左上角的横坐标和纵坐标，单位是像素。

如果位于该位置的 HTML 元素不可返回（比如文本框的滚动条），则返回它的父元素（比如文本框）。如果坐标值无意义（比如负值或超过视口大小），则返回`null`。

#### document.elementsFromPoint()

`document.elementsFromPoint()`返回一个数组，成员是位于指定坐标（相对于视口）的所有元素。

#### document.createElement()

`document.createElement`方法用来生成元素节点，并返回该节点。

```js
var newDiv = document.createElement('div');
```

`createElement`方法的参数为元素的标签名，即元素节点的`tagName`属性，对于 HTML 网页大小写不敏感，即参数为`div`或`DIV`返回的是同一种节点。如果参数里面包含尖括号（即`<`和`>`）会报错。

注意，`document.createElement`的参数可以是**自定义的标签名**。

#### document.createTextNode()

`document.createTextNode`方法用来生成文本节点（`Text`实例），并返回该节点。它的参数是文本节点的内容。

```js
var newDiv = document.createElement('div');
var newContent = document.createTextNode('Hello');
newDiv.appendChild(newContent);
```

上面代码新建一个`div`节点和一个文本节点，然后将文本节点插入`div`节点。

这个方法可以确保返回的节点，被浏览器当作文本渲染，而不是当作 HTML 代码渲染。因此，可以用来展示用户的输入，避免 XSS 攻击。

```js
var div = document.createElement('div');
div.appendChild(document.createTextNode('<span>Foo & bar</span>'));
console.log(div.innerHTML)
// &lt;span&gt;Foo &amp; bar&lt;/span&gt;
```

上面代码中，`createTextNode`方法对大于号和小于号进行转义，从而保证即使用户输入的内容包含恶意代码，也能正确显示。

需要注意的是，**该方法不对单引号和双引号转义**，所以不能用来对 HTML 属性赋值。

```js
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

var userWebsite = '" onmouseover="alert(\'derp\')" "';
var profileLink = '<a href="' + escapeHtml(userWebsite) + '">Bob</a>';
var div = document.getElementById('target');
div.innerHTML = profileLink;
// <a href="" onmouseover="alert('derp')" "">Bob</a>
```

上面代码中，由于`createTextNode`方法不转义双引号，导致`onmouseover`方法被注入了代码。

#### document.createAttribute()

`document.createAttribute`方法生成一个新的属性节点（`Attr`实例），并返回它。

```js
var attribute = document.createAttribute(name);
```

```js
var node = document.getElementById('div1');

var a = document.createAttribute('my_attrib');
a.value = 'newVal';

node.setAttributeNode(a);
// 或者
node.setAttribute('my_attrib', 'newVal');
```

`document.createAttribute`方法的参数 `name`，是属性的名称。

#### document.createComment()

`document.createComment`方法生成一个新的注释节点，并返回该节点。

```js
var CommentNode = document.createComment(data);
```

`document.createComment`方法的参数是一个字符串，会成为注释节点的内容。

#### document.createDocumentFragment()

`document.createDocumentFragment`方法生成一个空的文档片段对象（`DocumentFragment`实例）。

```js
var docFragment = document.createDocumentFragment();
```

`DocumentFragment`是一个存在于内存的 DOM 片段，不属于当前文档，常常用来生成一段较复杂的 DOM 结构，然后再插入当前文档。

这样做的好处在于，因为 `DocumentFragment`不属于当前文档，对它的任何改动，都不会引发网页的重新渲染，比直接修改当前文档的 DOM 有更好的性能表现。

```js
var docfrag = document.createDocumentFragment();

[1, 2, 3, 4].forEach(function (e) {
  var li = document.createElement('li');
  li.textContent = e;
  docfrag.appendChild(li);
});

var element  = document.getElementById('ul');
element.appendChild(docfrag);
```

上面代码中，文档片段 `docfrag`包含四个 `<li>`节点，这些子节点被一次性插入了当前文档。

#### document.createEvent()

`document.createEvent`方法生成一个事件对象（`Event`实例），该对象可以被 `element.dispatchEvent`方法使用，触发指定事件。

```js
var event = document.createEvent(type);
```

`document.createEvent`方法的参数是事件类型，比如 `UIEvents`、`MouseEvents`、`MutationEvents`、`HTMLEvents`。

```js
var event = document.createEvent('Event');
event.initEvent('build', true, true);
document.addEventListener('build', function (e) {
  console.log(e.type); // "build"
}, false);
document.dispatchEvent(event);
```

上面代码新建了一个名为 `build`的事件实例，然后触发该事件。

#### document.addEventListener()

#### document.removeEventListener()

#### document.dispatchEvent()

这三个方法用于处理 `document`节点的事件。它们都继承自 `EventTarget`接口。

```js
// 添加事件监听函数
document.addEventListener('click', listener, false);

// 移除事件监听函数
document.removeEventListener('click', listener, false);

// 触发事件
var event = new Event('click');
document.dispatchEvent(event);
```

#### document.hasFocus()

`document.hasFocus`方法返回一个布尔值，表示当前文档之中是否有元素被激活或获得焦点。

```js
var focused = document.hasFocus();
```

注意，有焦点的文档必定被激活（active），反之不成立，激活的文档未必有焦点。比如，用户点击按钮，从当前窗口跳出一个新窗口，该新窗口就是激活的，但是不拥有焦点。

#### document.adoptNode()

`document.adoptNode`方法将某个节点及其子节点，从原来所在的文档或`DocumentFragment`里面移除，归属当前`document`对象，返回插入后的新节点。

插入的节点对象的`ownerDocument`属性，会变成当前的`document`对象，而`parentNode`属性是`null`。

```js
var node = document.adoptNode(externalNode);
document.appendChild(node);
```

**注意**，`document.adoptNode`方法只是改变了节点的归属，并没有将这个节点插入新的文档树。所以，还要再用`appendChild`方法或`insertBefore`方法，将新节点插入当前文档树。

#### document.importNode()

`document.importNode`方法则是从原来所在的文档或`DocumentFragment`里面，拷贝某个节点及其子节点，让它们归属当前`document`对象。

拷贝的节点对象的`ownerDocument`属性，会变成当前的`document`对象，而`parentNode`属性是`null`。

```js
var node = document.importNode(externalNode, deep);
```

`document.importNode`方法的第一个参数是外部节点，第二个参数是一个布尔值，表示对外部节点是深拷贝还是浅拷贝，默认是浅拷贝（false）。虽然第二个参数是可选的，但是建议总是保留这个参数，并设为`true`。

**注意**，`document.importNode`方法只是拷贝外部节点，这时该节点的父节点是`null`。下一步还必须将这个节点插入当前文档树。

```js
var iframe = document.getElementsByTagName('iframe')[0];
var oldNode = iframe.contentWindow.document.getElementById('myNode');
var newNode = document.importNode(oldNode, true);
document.getElementById("container").appendChild(newNode);
```

上面代码从`iframe`窗口，拷贝一个指定节点`myNode`，插入当前文档。

#### document.createNodeIterator()

`document.createNodeIterator`方法返回一个子节点遍历器。

```js
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);
```

上面代码返回`<body>`元素子节点的遍历器。

`document.createNodeIterator`方法第一个参数为所要遍历的根节点，第二个参数为所要遍历的节点类型，这里指定为元素节点（`NodeFilter.SHOW_ELEMENT`）。几种主要的节点类型写法如下。

* 所有节点：NodeFilter.SHOW\_ALL
* 元素节点：NodeFilter.SHOW\_ELEMENT
* 文本节点：NodeFilter.SHOW\_TEXT
* 评论节点：NodeFilter.SHOW\_COMMENT

`document.createNodeIterator`方法返回一个“遍历器”对象（`NodeFilter`实例）。该实例的`nextNode()`方法和`previousNode()`方法，可以用来遍历所有子节点。

```js
var nodeIterator = document.createNodeIterator(document.body);
var pars = [];
var currentNode;

while (currentNode = nodeIterator.nextNode()) {
  pars.push(currentNode);
}
```

上面代码中，使用遍历器的`nextNode`方法，将根节点的所有子节点，依次读入一个数组。`nextNode`方法先返回遍历器的内部指针所在的节点，然后会将指针移向下一个节点。所有成员遍历完成后，返回`null`。`previousNode`方法则是先将指针移向上一个节点，然后返回该节点。

```js
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var currentNode = nodeIterator.nextNode();
var previousNode = nodeIterator.previousNode();

currentNode === previousNode // true
```

上面代码中，`currentNode`和`previousNode`都指向同一个的节点。

注意，遍历器返回的第一个节点，总是根节点。

```
pars[0] === document.body // true
```

#### document.createTreeWalker()

`document.createTreeWalker`方法返回一个 DOM 的子树遍历器。它与`document.createNodeIterator`方法基本是类似的，区别在于它返回的是`TreeWalker`实例，后者返回的是`NodeIterator`实例。另外，它的第一个节点不是根节点。

`document.createTreeWalker`方法的第一个参数是所要遍历的根节点，第二个参数指定所要遍历的节点类型（与`document.createNodeIterator`方法的第二个参数相同）。

```js
var treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var nodeList = [];

while(treeWalker.nextNode()) {
  nodeList.push(treeWalker.currentNode);
}
```

上面代码遍历`<body>`节点下属的所有元素节点，将它们插入`nodeList`数组。

#### document.execCommand()

如果`document.designMode`属性设为`on`，那么整个文档用户可编辑；如果元素的`contenteditable`属性设为`true`，那么该元素可编辑。这两种情况下，可以使用`document.execCommand()`方法，改变内容的样式，比如`document.execCommand('bold')`会使得字体加粗。

```js
document.execCommand(command, showDefaultUI, input)
```

该方法接受三个参数。

* `command`：字符串，表示所要实施的样式。
* `showDefaultUI`：布尔值，表示是否要使用默认的用户界面，建议总是设为`false`。
* `input`：字符串，表示该样式的辅助内容，比如生成超级链接时，这个参数就是所要链接的网址。如果第二个参数设为`true`，那么浏览器会弹出提示框，要求用户在提示框输入该参数。但是，不是所有浏览器都支持这样做，为了兼容性，还是需要自己部署获取这个参数的方式。

```js
var url = window.prompt('请输入网址');

if (url) {
  document.execCommand('createlink', false, url);
}
```

上面代码中，先提示用户输入所要链接的网址，然后手动生成超级链接。注意，第二个参数是`false`，表示此时不需要自动弹出提示框。

`document.execCommand()`的返回值是一个布尔值。如果为`false`，表示这个方法无法生效。

这个方法大部分情况下，只对选中的内容生效。如果有多个内容可编辑区域，那么只对当前焦点所在的元素生效。

`document.execCommand()`方法可以执行的样式改变有很多种，下面是其中的一些：bold、insertLineBreak、selectAll、createLink、insertOrderedList、subscript、delete、insertUnorderedList、superscript、formatBlock、insertParagraph、undo、forwardDelete、insertText、unlink、insertImage、italic、unselect、insertHTML、redo。这些值都可以用作第一个参数，它们的含义不难从字面上看出来。

#### document.queryCommandSupported()

`document.queryCommandSupported()`方法返回一个布尔值，表示浏览器是否支持`document.execCommand()`的某个命令。

```js
if (document.queryCommandSupported('SelectAll')) {
  console.log('浏览器支持选中可编辑区域的所有内容');
}
```

#### document.queryCommandEnabled()

`document.queryCommandEnabled()`方法返回一个布尔值，表示当前是否可用`document.execCommand()`的某个命令。比如，`bold`（加粗）命令只有存在文本选中时才可用，如果没有选中文本，就不可用。

```js
// HTML 代码为
// <input type="button" value="Copy" onclick　　="doCopy()">

function doCopy(){
  // 浏览器是否支持 copy 命令（选中内容复制到剪贴板）
  if (document.queryCommandSupported('copy')) {
    copyText('你好');
  }else{
    console.log('浏览器不支持');
  }
}

function copyText(text) {
  var input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();

  // 当前是否有选中文字
  if (document.queryCommandEnabled('copy')) {
    var success = document.execCommand('copy');
    input.remove();
    console.log('Copy Ok');
  } else {
    console.log('queryCommandEnabled is false');
  }
}
```

上面代码中，先判断浏览器是否支持`copy`命令（允许可编辑区域的选中内容，复制到剪贴板），如果支持，就新建一个临时文本框，里面写入内容“你好”，并将其选中。然后，判断是否选中成功，如果成功，就将“你好”复制到剪贴板，再删除那个临时文本框。

#### document.getSelection()

这个方法指向`window.getSelection()`

### Element 节点

`Element`节点对象对应网页的 HTML 元素。每一个 HTML 元素，在 DOM 树上都会转化成一个`Element`节点对象（以下简称元素节点）。

元素节点的`nodeType`属性都是`1`。

```js
var p = document.querySelector('p');
p.nodeName // "P"
p.nodeType // 1
```

`Element`对象继承了`Node`接口，因此`Node`的属性和方法在`Element`对象都存在。

此外，不同的 HTML 元素对应的元素节点是不一样的，浏览器使用不同的构造函数，生成不同的元素节点，比如`<a>`元素的构造函数是`HTMLAnchorElement()`，`<button>`是`HTMLButtonElement()`。因此，元素节点不是一种对象，而是许多种对象，这些对象除了继承`Element`对象的属性和方法，还有各自独有的属性和方法。

#### 实例属性

##### 元素特性

元素特性的相关属性

###### **（1）Element.id**

`Element.id`属性返回指定元素的`id`属性，该属性可读写。

```js
// HTML 代码为 <p id="foo">
var p = document.querySelector('p');
p.id // "foo"
```

注意，`id`属性的值是大小写敏感，即浏览器能正确识别`<p id="foo">`和`<p id="FOO">`这两个元素的`id`属性，但是最好不要这样命名。

###### **（2）Element.tagName**

`Element.tagName`属性返回指定元素的大写标签名，与`nodeName`属性的值相等。

```js
// HTML代码为
// <span id="myspan">Hello</span>
var span = document.getElementById('myspan');
span.id // "myspan"
span.tagName // "SPAN"
```

###### **（3）Element.dir**

`Element.dir`属性用于读写当前元素的文字方向，可能是从左到右（`"ltr"`），也可能是从右到左（`"rtl"`）。

###### **（4）Element.accessKey**

`Element.accessKey`属性用于读写分配给当前元素的快捷键。

```js
// HTML 代码如下
// <button accesskey="h" id="btn">点击</button>
var btn = document.getElementById('btn');
btn.accessKey // "h"
```

上面代码中，`btn`元素的快捷键是`h`，按下`Alt + h`就能将焦点转移到它上面。

###### **（5）Element.draggable**

`Element.draggable`属性返回一个布尔值，表示当前元素是否可拖动。该属性可读写。

###### **（6）Element.lang**

`Element.lang`属性返回当前元素的语言设置。该属性可读写。

```js
// HTML 代码如下
// <html lang="en">
document.documentElement.lang // "en"
```

###### **（7）Element.tabIndex**

`Element.tabIndex`属性返回一个整数，表示当前元素在 Tab 键遍历时的顺序。该属性可读写。

`tabIndex`属性值如果是负值（通常是`-1`），则 Tab 键不会遍历到该元素。如果是正整数，则按照顺序，从小到大遍历。如果两个元素的`tabIndex`属性的正整数值相同，则按照出现的顺序遍历。遍历完所有`tabIndex`为正整数的元素以后，再遍历所有`tabIndex`等于`0`、或者属性值是非法值、或者没有`tabIndex`属性的元素，顺序为它们在网页中出现的顺序。

###### **（8）Element.title**

`Element.title`属性用来读写当前元素的 HTML 属性`title`。该属性通常用来指定，鼠标悬浮时弹出的文字提示框。

##### 元素状态

元素状态的相关属性

###### （1）Element.hidden

`Element.hidden`属性返回一个布尔值，表示当前 HTML 元素的`hidden`属性的值。该属性可读写，用来控制当前元素是否可见。

```js
var btn = document.getElementById('btn');
var mydiv = document.getElementById('mydiv');

btn.addEventListener('click', function () {
  mydiv.hidden = !mydiv.hidden;
}, false);
```

注意，该属性与 CSS 设置是互相独立的。CSS 对当前元素可见性的设置，`Element.hidden`并不能反映出来。也就是说，这个属性并不能用来判断当前元素的实际可见性。

CSS 设置的优先级高于`Element.hidden`。如果 CSS 指定了该元素不可见（`display: none`）或可见（`visibility: visible`），那么`Element.hidden`并不能改变该元素实际的可见性。换言之，**这个属性只在 CSS 没有明确设定当前元素的可见性时才有效。**

###### （2）Element.contentEditable

HTML 元素可以设置`contentEditable`属性，使得元素的内容可以编辑。

```html
<div contenteditable>123</div>
```

上面代码中，`<div>`元素有`contenteditable`属性，因此用户可以在网页上编辑这个区块的内容。

`Element.contentEditable`属性返回一个字符串，表示是否设置了`contenteditable`属性，有三种可能的值。该属性可写。

- `true`：元素内容可编辑
- `false`：元素内容不可编辑
- `inherit`：元素是否可编辑，继承了父元素的设置

###### （3）**Element.isContentEditable**

`Element.isContentEditable`属性返回一个布尔值，同样表示是否设置了`contenteditable`属性。该属性只读。

##### Element.attributes

`Element.attributes`属性返回一个类似数组的对象，成员是当前元素节点的所有属性节点。

```js
var p = document.querySelector('p');
var attrs = p.attributes;

for (var i = attrs.length - 1; i >= 0; i--) {
  console.log(attrs[i].name + '->' + attrs[i].value);
}
```

上面代码遍历`p`元素的所有属性。

##### Element.className

`className`属性用来读写当前元素节点的`class`属性。它的值是一个字符串，每个`class`之间用空格分割。

##### Element.classList

`classList`属性返回一个类似数组的对象，当前元素节点的每个`class`就是这个对象的一个成员。

```js
// HTML 代码 <div class="one two three" id="myDiv"></div>
var div = document.getElementById('myDiv');

div.className
// "one two three"

div.classList
// {
//   0: "one"
//   1: "two"
//   2: "three"
//   length: 3
// }
```

`classList`对象有下列方法。

- `add()`：增加一个 class。
- `remove()`：移除一个 class。
- `contains()`：检查当前元素是否包含某个 class。
- `toggle()`：将某个 class 移入或移出当前元素。
- `item()`：返回指定索引位置的 class。
- `toString()`：将 class 的列表转为字符串。

```js
var div = document.getElementById('myDiv');

div.classList.add('myCssClass');
div.classList.add('foo', 'bar');
div.classList.remove('myCssClass');
div.classList.toggle('myCssClass'); // 如果 myCssClass 不存在就加入，否则移除
div.classList.contains('myCssClass'); // 返回 true 或者 false
div.classList.item(0); // 返回第一个 Class
div.classList.toString();
```

下面比较一下，`className`和`classList`在添加和删除某个 class 时的写法。

```js
var foo = document.getElementById('foo');

// 添加class
foo.className += 'bold';
foo.classList.add('bold');

// 删除class
foo.classList.remove('bold');
foo.className = foo.className.replace(/^bold$/, '');
```

`toggle`方法可以接受一个布尔值，作为第二个参数。如果为`true`，则添加该属性；如果为`false`，则去除该属性。

```js
el.classList.toggle('abc', boolValue);

// 等同于
if (boolValue) {
  el.classList.add('abc');
} else {
  el.classList.remove('abc');
}
```

##### Element.dataset

网页元素可以自定义`data-`属性，用来添加数据。

```js
<div data-timestamp="1522907809292"></div>
```

上面代码中，`<div>`元素有一个自定义的`data-timestamp`属性，用来为该元素添加一个时间戳。

`Element.dataset`属性返回一个对象，可以从这个对象读写`data-`属性。

```js
// <article
//   id="foo"
//   data-columns="3"
//   data-index-number="12314"
//   data-parent="cars">
//   ...
// </article>
var article = document.getElementById('foo');
article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```

注意，`dataset`上面的各个属性返回都是字符串。

HTML 代码中，`data-`属性的属性名，只能包含英文字母、数字、连词线（`-`）、点（`.`）、冒号（`:`）和下划线（`_`）。它们转成 JavaScript 对应的`dataset`属性名，规则如下。

- 开头的`data-`会省略。
- 如果连词线后面跟了一个英文字母，那么连词线会取消，该字母变成大写。
- 其他字符不变。

因此，`data-abc-def`对应`dataset.abcDef`，`data-abc-1`对应`dataset["abc-1"]`。

除了使用`dataset`读写`data-`属性，也可以使用`Element.getAttribute()`和`Element.setAttribute()`，通过完整的属性名读写这些属性。

```js
var mydiv = document.getElementById('mydiv');

mydiv.dataset.foo = 'bar';
mydiv.getAttribute('data-foo') // "bar"
```

##### Element.innerHTML

`Element.innerHTML`属性返回一个字符串，等同于该元素包含的所有 HTML 代码。该属性可读写，常用来设置某个节点的内容。它能改写所有元素节点的内容，包括`<HTML>`和`<body>`元素。

如果将`innerHTML`属性设为空，等于删除所有它包含的所有节点。

```js
el.innerHTML = '';
```

上面代码等于将`el`节点变成了一个空节点，`el`原来包含的节点被全部删除。

注意，读取属性值的时候，如果文本节点包含`&`、小于号（`<`）和大于号（`>`），`innerHTML`属性会将它们转为实体形式`&amp;`、`&lt;`、`&gt;`。如果想得到原文，建议使用`element.textContent`属性。

```js
// HTML代码如下 <p id="para"> 5 > 3 </p>
document.getElementById('para').innerHTML
// 5 &gt; 3
```

写入的时候，如果插入的文本包含 HTML 标签，会被解析成为节点对象插入 DOM。注意，如果文本之中含有`<script>`标签，虽然可以生成`script`节点，但是插入的代码不会执行。

```js
var name = "<script>alert('haha')</script>";
el.innerHTML = name;
```

上面代码将脚本插入内容，脚本并不会执行。但是，`innerHTML`还是有安全风险的。

```js
var name = "<img src=x onerror=alert(1)>";
el.innerHTML = name;
```

上面代码中，`alert`方法是会执行的。因此为了安全考虑，如果插入的是文本，最好用`textContent`属性代替`innerHTML`。

##### Element.outerHTML

`Element.outerHTML`属性返回一个字符串，表示当前元素节点的所有 HTML 代码，包括该**元素本身和所有子元素。**

```js
// HTML 代码如下
// <div id="d"><p>Hello</p></div>
var d = document.getElementById('d');
d.outerHTML
// '<div id="d"><p>Hello</p></div>'
```

`outerHTML`属性是可读写的，对它进行赋值，等于替换掉当前元素。	

```js
// HTML 代码如下
// <div id="container"><div id="d">Hello</div></div>
var container = document.getElementById('container');
var d = document.getElementById('d');
container.firstChild.nodeName // "DIV"
d.nodeName // "DIV"

d.outerHTML = '<p>Hello</p>';
container.firstChild.nodeName // "P"
d.nodeName // "DIV"	
```

上面代码中，变量`d`代表子节点，它的`outerHTML`属性重新赋值以后，内层的`div`元素就不存在了，被`p`元素替换了。但是，变量`d`依然指向原来的`div`元素，这表示被替换的`DIV`元素还存在于内存中。

**注意**，如果一个节点没有父节点，设置`outerHTML`属性会报错。

##### Element.clientHeight

`Element.clientHeight`属性返回一个整数值，表示元素节点的 CSS 高度（单位像素），只对块级元素生效，对于行内元素返回`0`。如果块级元素没有设置 CSS 高度，则返回实际高度。

除了元素本身的高度，它还包括`padding`部分，但是不包括`border`、`margin`。如果有水平滚动条，还要减去水平滚动条的高度。注意，这个值始终是整数，如果是小数会被四舍五入。

##### Element.clientWidth

`Element.clientWidth`属性返回元素节点的 CSS 宽度，同样只对块级元素有效，也是只包括元素本身的宽度和`padding`，如果有垂直滚动条，还要减去垂直滚动条的宽度。

`document.documentElement`的`clientHeight`属性，返回当前视口的高度（即浏览器窗口的高度），等同于`window.innerHeight`属性减去水平滚动条的高度（如果有的话）。`document.body`的高度则是网页的实际高度。一般来说，`document.body.clientHeight`大于`document.documentElement.clientHeight`。

```js
// 视口高度
document.documentElement.clientHeight

// 网页总高度
document.body.clientHeight
```

##### Element.clientLeft

`Element.clientLeft`属性等于元素节点左边框（left border）的宽度（单位像素），不包括左侧的`padding`和`margin`。如果没有设置左边框，或者是行内元素（`display: inline`），该属性返回`0`。该属性总是返回整数值，如果是小数，会四舍五入。

##### Element.clientTop

`Element.clientTop`属性等于网页元素顶部边框的宽度（单位像素），其他特点都与`clientLeft`相同。

##### Element.scrollHeight

`Element.scrollHeight`属性返回一个整数值（小数会四舍五入），表示当前元素的总高度（单位像素），包括溢出容器、当前不可见的部分。

它包括`padding`，但是不包括`border`、`margin`以及水平滚动条的高度（如果有水平滚动条的话），还包括伪元素（`::before`或`::after`）的高度。

##### Element.scrollWidth

`Element.scrollWidth`属性表示当前元素的总宽度（单位像素），其他地方都与`scrollHeight`属性类似。这两个属性只读。

整张网页的总高度可以从`document.documentElement`或`document.body`上读取。

```js
// 返回网页的总高度
document.documentElement.scrollHeight
document.body.scrollHeight
```

注意，如果元素节点的内容出现溢出，即使溢出的内容是隐藏的，`scrollHeight`属性仍然返回元素的总高度。

```js
// HTML 代码如下
// <div id="myDiv" style="height: 200px; overflow: hidden;">...</div>
document.getElementById('myDiv').scrollHeight // 200
```

上面代码中，即使`myDiv`元素的 CSS 高度只有200像素，且溢出部分不可见，但是`scrollHeight`仍然会返回该元素的原始高度。

##### Element.scrollLeft

`Element.scrollLeft`属性表示当前元素的水平滚动条向右侧滚动的像素数量。

##### Element.scrollTop

`Element.scrollTop`属性表示当前元素的垂直滚动条向下滚动的像素数量。

上述两个属性对于那些没有滚动条的网页元素，这两个属性总是等于0。

如果要查看整张网页的水平的和垂直的滚动距离，要从`document.documentElement`元素上读取。

```js
document.documentElement.scrollLeft
document.documentElement.scrollTop
```

这两个属性都可读写，设置该属性的值，会导致浏览器将当前元素自动滚动到相应的位置。

##### Element.offsetParent

`Element.offsetParent`属性返回最靠近当前元素的、并且 CSS 的`position`属性不等于`static`的上层元素。

```js
<div style="position: absolute;">
  <p>
    <span>Hello</span>
  </p>
</div>
```

上面代码中，`span`元素的`offsetParent`属性就是`div`元素。

该属性主要用于确定子元素位置偏移的计算基准，`Element.offsetTop`和`Element.offsetLeft`就是`offsetParent`元素计算的。

如果该元素是不可见的（`display`属性为`none`），或者位置是固定的（`position`属性为`fixed`），则`offsetParent`属性返回`null`。

```js
<div style="position: absolute;">
  <p>
    <span style="display: none;">Hello</span>
  </p>
</div>
```

上面代码中，`span`元素的`offsetParent`属性是`null`。

如果某个元素的所有上层节点的`position`属性都是`static`，则`Element.offsetParent`属性指向`<body>`元素。

##### Element.offsetHeight

`Element.offsetHeight`属性返回一个整数，表示元素的 CSS 垂直高度（单位像素），包括元素本身的高度、padding 和 border，以及水平滚动条的高度（如果存在滚动条）

##### Element.offsetWidth

`Element.offsetWidth`属性表示元素的 CSS 水平宽度（单位像素），其他都与`Element.offsetHeight`一致。

这两个属性都是只读属性，只比`Element.clientHeight`和`Element.clientWidth`多了边框的高度或宽度。如果元素的 CSS 设为不可见（比如`display: none;`），则返回`0`。

##### Element.offsetLeft

##### Element.offsetTop

`Element.offsetLeft`返回当前元素左上角相对于`Element.offsetParent`节点的水平位移，`Element.offsetTop`返回垂直位移，单位为像素。通常，这两个值是指相对于父节点的位移。

下面的代码可以算出元素左上角相对于整张网页的坐标。

```js
function getElementPosition(e) {
  var x = 0;
  var y = 0;
  while (e !== null)  {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return {x: x, y: y};
}
```

##### Element.style

每个元素节点都有`style`用来读写该元素的行内样式信息。

##### Element.children

##### Element.childElementCount

`Element.children`属性返回一个类似数组的对象（`HTMLCollection`实例），包括当前元素节点的所有子元素。如果当前元素没有子元素，则返回的对象包含零个成员。

这个属性与`Node.childNodes`属性的区别是，它只包括元素类型的子节点，不包括其他类型的子节点。

`Element.childElementCount`属性返回当前元素节点包含的子元素节点的个数，与`Element.children.length`的值相同。

##### Element.firstElementChild

##### Element.lastElementChild

`Element.firstElementChild`属性返回当前元素的第一个元素子节点，`Element.lastElementChild`返回最后一个元素子节点。

如果没有元素子节点，这两个属性返回`null`。

##### Element.nextElementSibling

##### Element.previousElementSibling

`Element.nextElementSibling`属性返回当前元素节点的后一个同级元素节点，如果没有则返回`null`。

```js
// HTML 代码如下
// <div id="div-01">Here is div-01</div>
// <div id="div-02">Here is div-02</div>
var el = document.getElementById('div-01');
el.nextElementSibling
// <div id="div-02">Here is div-02</div>
```

`Element.previousElementSibling`属性返回当前元素节点的前一个同级元素节点，如果没有则返回`null`。

#### 实例方法

##### 属性相关

元素节点提供六个方法，用来操作属性。

- `getAttribute()`：读取某个属性的值
- `getAttributeNames()`：返回当前元素的所有属性名
- `setAttribute()`：写入属性值
- `hasAttribute()`：某个属性是否存在
- `hasAttributes()`：当前元素是否有属性
- `removeAttribute()`：删除属性

##### Element.querySelector()

`Element.querySelector`方法接受 CSS 选择器作为参数，返回父元素的第一个匹配的子元素。如果没有找到匹配的子元素，就返回`null`。

```js
var content = document.getElementById('content');
var el = content.querySelector('p');
```

上面代码返回`content`节点的第一个`p`元素。

`Element.querySelector`方法可以接受任何复杂的 CSS 选择器。

注意，这个方法无法选中伪元素。

它可以接受多个选择器，它们之间使用逗号分隔。

```js
element.querySelector('div, p')
```

上面代码返回`element`的第一个`div`或`p`子元素。

需要注意的是，浏览器执行`querySelector`方法时，**是先在全局范围内搜索给定的 CSS 选择器，然后过滤出哪些属于当前元素的子元素**。因此，会有一些违反直觉的结果，下面是一段 HTML 代码。

```js
<div>
<blockquote id="outer">
  <p>Hello</p>
  <div id="inner">
    <p>World</p>
  </div>
</blockquote>
</div>
```

那么，像下面这样查询的话，实际上返回的是第一个`p`元素，而不是第二个。

```js
var outer = document.getElementById('outer');
outer.querySelector('div p')
// <p>Hello</p>
```

##### Element.querySelectorAll()

`Element.querySelectorAll`方法接受 CSS 选择器作为参数，返回一个`NodeList`实例，包含所有匹配的子元素。

```js
var el = document.querySelector('#test');
var matches = el.querySelectorAll('div.highlighted > p');
```

该方法的执行机制与`querySelector`方法相同，也是先在全局范围内查找，再过滤出当前元素的子元素。因此，选择器实际上针对整个文档的。

它也可以接受多个 CSS 选择器，它们之间使用逗号分隔。如果选择器里面有伪元素的选择器，则总是返回一个空的`NodeList`实例。

##### Element.getElementsByClassName()

`Element.getElementsByClassName`方法返回一个`HTMLCollection`实例，成员是当前元素节点的所有具有指定 class 的子元素节点。该方法与`document.getElementsByClassName`方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。

```js
element.getElementsByClassName('red test');
```

**注意**，该方法的参数大小写敏感。

由于`HTMLCollection`实例是一个活的集合，`document`对象的任何变化会立刻反应到实例，下面的代码不会生效。

```js
// HTML 代码如下
// <div id="example">
//   <p class="foo"></p>
//   <p class="foo"></p>
// </div>
var element = document.getElementById('example');
var matches = element.getElementsByClassName('foo');

for (var i = 0; i< matches.length; i++) {
  matches[i].classList.remove('foo');
  matches.item(i).classList.add('bar');
}
// 执行后，HTML 代码如下
// <div id="example">
//   <p></p>
//   <p class="foo bar"></p>
// </div>
```

上面代码中，`matches`集合的第一个成员，一旦被拿掉 class 里面的`foo`，就会立刻从`matches`里面消失，导致出现上面的结果。

##### Element.getElementsByTagName()

`Element.getElementsByTagName()`方法返回一个`HTMLCollection`实例，成员是当前节点的所有匹配指定标签名的子元素节点。该方法与`document.getElementsByClassName()`方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。

```js
var table = document.getElementById('forecast-table');
var cells = table.getElementsByTagName('td');
```

注意，该方法的参数是大小写不敏感的，因为 HTML 标签名也是大小写不敏感。

##### Element.closest()

`Element.closest`方法接受一个 CSS 选择器作为参数，返回匹配该选择器的、最接近当前节点的一个祖先节点（包括当前节点本身）。如果没有任何节点匹配 CSS 选择器，则返回`null`。

##### Element.matches()

`Element.matches`方法返回一个布尔值，表示当前元素是否匹配给定的 CSS 选择器。

```js
if (el.matches('.someClass')) {
  console.log('Match!');
}
```

##### 事件相关

以下三个方法与`Element`节点的事件相关。这些方法都继承自`EventTarget`接口。

- `Element.addEventListener()`：添加事件的回调函数
- `Element.removeEventListener()`：移除事件监听函数
- `Element.dispatchEvent()`：触发事件

```js
var event = new Event('click');
element.dispatchEvent(event);
```

##### Element.scrollIntoView()

`Element.scrollIntoView`方法滚动当前元素，进入浏览器的可见区域，类似于设置`window.location.hash`的效果。

该方法可以接受一个布尔值作为参数。如果为`true`，表示元素的顶部与当前区域的可见部分的顶部对齐（前提是当前区域可滚动）；

如果为`false`，表示元素的底部与当前区域的可见部分的尾部对齐（前提是当前区域可滚动）。如果没有提供该参数，默认为`true`。

##### Element.getBoundingClientRect()

`Element.getBoundingClientRect`方法返回一个对象，提供当前元素节点的大小、位置等信息，基本上就是 CSS 盒状模型的所有信息。

```js
var rect = obj.getBoundingClientRect();
```

上面代码中，`getBoundingClientRect`方法返回的`rect`对象，具有以下属性（全部为只读）。

- `x`：元素左上角相对于视口的横坐标
- `y`：元素左上角相对于视口的纵坐标
- `height`：元素高度
- `width`：元素宽度
- `left`：元素左上角相对于视口的横坐标，与`x`属性相等
- `right`：元素右边界相对于视口的横坐标（等于`x + width`）
- `top`：元素顶部相对于视口的纵坐标，与`y`属性相等
- `bottom`：元素底部相对于视口的纵坐标（等于`y + height`）

由于元素相对于视口（viewport）的位置，会随着页面滚动变化，因此表示位置的四个属性值，都不是固定不变的。如果想得到绝对位置，可以将`left`属性加上`window.scrollX`，`top`属性加上`window.scrollY`。

**注意**，`getBoundingClientRect`方法的所有属性，都把边框（`border`属性）算作元素的一部分。也就是说，都是从边框外缘的各个点来计算。因此，`width`和`height`包括了元素本身 + `padding` + `border`。

另外，上面的这些属性，都是继承自原型的属性，`Object.keys`会返回一个空数组，这一点也需要注意。

```js
var rect = document.body.getBoundingClientRect();
Object.keys(rect) // []
```

上面代码中，`rect`对象没有自身属性，而`Object.keys`方法只返回对象自身的属性，所以返回了一个空数组。

##### Element.getClientRects()

`Element.getClientRects`方法返回一个类似数组的对象，里面是当前元素在页面上形成的所有矩形（所以方法名中的`Rect`用的是复数）。每个矩形都有`bottom`、`height`、`left`、`right`、`top`和`width`六个属性，表示它们相对于视口的四个坐标，以及本身的高度和宽度。

##### Element.insertAdjacentElement()

`Element.insertAdjacentElement`方法在相对于当前元素的指定位置，插入一个新的节点。该方法返回被插入的节点，如果插入失败，返回`null`。

```js
element.insertAdjacentElement(position, element);
```

`Element.insertAdjacentElement`方法一共可以接受两个参数，第一个参数是一个字符串，表示插入的位置，第二个参数是将要插入的节点。第一个参数只可以取如下的值。

- `beforebegin`：当前元素之前
- `afterbegin`：当前元素内部的第一个子节点前面
- `beforeend`：当前元素内部的最后一个子节点后面
- `afterend`：当前元素之后

注意，`beforebegin`和`afterend`这两个值，只在当前节点有父节点时才会生效。如果当前节点是由脚本创建的，没有父节点，那么插入会失败。

如果插入的节点是一个文档里现有的节点，它会从原有位置删除，放置到新的位置。

##### Element.insertAdjacentHTML()

##### Element.insertAdjacentText()

`Element.insertAdjacentHTML`方法用于将一个 HTML 字符串，解析生成 DOM 结构，插入相对于当前节点的指定位置。

```js
element.insertAdjacentHTML(position, text);
```

该方法接受两个参数，第一个是一个表示指定位置的字符串，第二个是待解析的 HTML 字符串。第一个参数只能设置下面四个值之一。

- `beforebegin`：当前元素之前
- `afterbegin`：当前元素内部的第一个子节点前面
- `beforeend`：当前元素内部的最后一个子节点后面
- `afterend`：当前元素之后

```js
// HTML 代码：<div id="one">one</div>
var d1 = document.getElementById('one');
d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');
// 执行后的 HTML 代码：
// <div id="one">one</div><div id="two">two</div>
```

该方法只是在现有的 DOM 结构里面插入节点，这使得它的执行速度比`innerHTML`方法快得多。

注意，该方法不会转义 HTML 字符串，这导致它不能用来插入用户输入的内容，否则会有安全风险。

`Element.insertAdjacentText`方法在相对于当前节点的指定位置，插入一个文本节点，用法与`Element.insertAdjacentHTML`方法完全一致。

```js
// HTML 代码：<div id="one">one</div>
var d1 = document.getElementById('one');
d1.insertAdjacentText('afterend', 'two');
// 执行后的 HTML 代码：
// <div id="one">one</div>two
```

##### Element.remove()

`Element.remove`方法继承自 ChildNode 接口，用于将当前元素节点从它的父节点移除。

```js
var el = document.getElementById('mydiv');
el.remove();
```

上面代码将`el`节点从 DOM 树里面移除。

##### Element.focus()

##### Element.blur()

`Element.focus`方法用于将当前页面的焦点，转移到指定元素上。

```js
document.getElementById('my-span').focus();
```

该方法可以接受一个对象作为参数。参数对象的`preventScroll`属性是一个布尔值，指定是否将当前元素停留在原始位置，而不是滚动到可见区域。

```js
function getFocus() {
  document.getElementById('btn').focus({preventScroll:false});
}
```

上面代码会让`btn`元素获得焦点，并滚动到可见区域。

最后，从`document.activeElement`属性可以得到当前获得焦点的元素。

`Element.blur`方法用于将焦点从当前元素移除。

##### Element.click()

`Element.click`方法用于在当前元素上模拟一次鼠标点击，相当于触发了`click`事件。

### 属性操作

HTML 元素包括标签名和若干个键值对，这个键值对就称为“属性”（attribute）。

```js
<a id="test" href="http://www.example.com">
  链接
</a>
```

上面代码中，`a`元素包括两个属性：`id`属性和`href`属性。

属性本身是一个对象（`Attr`对象），但是实际上，这个对象极少使用。一般都是通过元素节点对象（`HTMlElement`对象）来操作属性。

#### Element.attributes 属性

元素对象有一个`attributes`属性，返回一个类似数组的动态对象，成员是该元素标签的所有属性节点对象，属性的实时变化都会反映在这个节点对象上。

其他类型的节点对象，虽然也有`attributes`属性，但返回的都是`null`，因此可以把这个属性视为元素对象独有的。

单个属性可以通过序号引用，也可以通过属性名引用。

```js
// HTML 代码如下
// <body bgcolor="yellow" onload="">
document.body.attributes[0]
document.body.attributes.bgcolor
document.body.attributes['ONLOAD']
```

注意，上面代码的三种方法，返回的都是属性节点对象，而不是属性值。

属性节点对象有`name`和`value`属性，对应该属性的属性名和属性值，等同于`nodeName`属性和`nodeValue`属性。

```js
// HTML代码为
// <div id="mydiv">
var n = document.getElementById('mydiv');

n.attributes[0].name // "id"
n.attributes[0].nodeName // "id"

n.attributes[0].value // "mydiv"
n.attributes[0].nodeValue // "mydiv"
```

下面代码可以遍历一个元素节点的所有属性。

```js
var para = document.getElementsByTagName('p')[0];
var result = document.getElementById('result');

if (para.hasAttributes()) {
  var attrs = para.attributes;
  var output = '';
  for(var i = attrs.length - 1; i >= 0; i--) {
    output += attrs[i].name + '->' + attrs[i].value;
  }
  result.textContent = output;
} else {
  result.textContent = 'No attributes to show';
}
```

#### 元素的标准属性

HTML 元素的标准属性（即在标准中定义的属性），会自动成为元素节点对象的属性。

```js
var a = document.getElementById('test');
a.id // "test"
a.href // "http://www.example.com/"
```

上面代码中，`a`元素标签的属性`id`和`href`，自动成为节点对象的属性。

这些属性都是可写的。

```js
var img = document.getElementById('myImage');
img.src = 'http://www.example.com/image.jpg';
```

上面的写法，会立刻替换掉`img`对象的`src`属性，即会显示另外一张图片。

这种修改属性的方法，常常用于添加表单的属性。

```js
var f = document.forms[0];
f.action = 'submit.php';
f.method = 'POST';
```

上面代码为表单添加提交网址和提交方法。

注意，这种用法虽然可以读写属性，但是无法删除属性，`delete`运算符在这里不会生效。

HTML 元素的属性名是大小写不敏感的，但是 JavaScript 对象的属性名是大小写敏感的。转换规则是，转为 JavaScript 属性名时，一律采用小写。如果属性名包括多个单词，则采用骆驼拼写法，即从第二个单词开始，每个单词的首字母采用大写，比如`onClick`。

有些 HTML 属性名是 JavaScript 的保留字，转为 JavaScript 属性时，必须改名。主要是以下两个。

- `for`属性改为`htmlFor`
- `class`属性改为`className`

另外，HTML 属性值一般都是字符串，但是 JavaScript 属性会自动转换类型。比如，将字符串`true`转为布尔值，将`onClick`的值转为一个函数，将`style`属性的值转为一个`CSSStyleDeclaration`对象。因此，可以对这些属性赋予各种类型的值。

#### 属性操作的标准方法

##### 概述

元素节点提供六个方法，用来操作属性。

- `getAttribute()`
- `getAttributeNames()`
- `setAttribute()`
- `hasAttribute()`
- `hasAttributes()`
- `removeAttribute()`

这有几点注意。

**（1）适用性**

这六个方法对所有属性（包括用户自定义的属性）都适用。

**（2）返回值**

`getAttribute()`只返回字符串，不会返回其他类型的值。

**（3）属性名**

这些方法只接受属性的标准名称，不用改写保留字，比如`for`和`class`都可以直接使用。另外，这些方法对于属性名是大小写不敏感的。

```js
var image = document.images[0];
image.setAttribute('class', 'myImage');
```

上面代码中，`setAttribute`方法直接使用`class`作为属性名，不用写成`className`。

##### Element.getAttribute()

`Element.getAttribute`方法返回当前元素节点的指定属性。如果指定属性不存在，则返回`null`。

```js
// HTML 代码为
// <div id="div1" align="left">
var div = document.getElementById('div1');
div.getAttribute('align') // "left"
```

##### Element.getAttributeNames()

`Element.getAttributeNames()`返回一个数组，成员是当前元素的所有属性的名字。如果当前元素没有任何属性，则返回一个空数组。

使用`Element.attributes`属性，也可以拿到同样的结果，唯一的区别是它返回的是类似数组的对象。

```js
var mydiv = document.getElementById('mydiv');

mydiv.getAttributeNames().forEach(function (key) {
  var value = mydiv.getAttribute(key);
  console.log(key, value);
})
```

上面代码用于遍历某个节点的所有属性。

##### Element.setAttribute()

`Element.setAttribute`方法用于为当前元素节点新增属性。如果同名属性已存在，则相当于编辑已存在的属性。该方法没有返回值。

```js
// HTML 代码为
// <button>Hello World</button>
var b = document.querySelector('button');
b.setAttribute('name', 'myButton');
b.setAttribute('disabled', true);
```

上面代码中，`button`元素的`name`属性被设成`myButton`，`disabled`属性被设成`true`。

这里有两个地方需要注意，首先，属性值总是字符串，其他类型的值会自动转成字符串，比如布尔值`true`就会变成字符串`true`；

其次，上例的`disable`属性是一个布尔属性，对于`<button>`元素来说，这个属性不需要属性值，只要设置了就总是会生效，因此`setAttribute`方法里面可以将`disabled`属性设成任意值。

##### Element.hasAttribute()

`Element.hasAttribute`方法返回一个布尔值，表示当前元素节点是否包含指定属性。

```js
var d = document.getElementById('div1');

if (d.hasAttribute('align')) {
  d.setAttribute('align', 'center');
}
```

上面代码检查`div`节点是否含有`align`属性。如果有，则设置为居中对齐。

##### Element.hasAttributes()

`Element.hasAttributes`方法返回一个布尔值，表示当前元素是否有属性，如果没有任何属性，就返回`false`，否则返回`true`。

```js
var foo = document.getElementById('foo');
foo.hasAttributes() // true
```

##### Element.removeAttribute()

`Element.removeAttribute`方法移除指定属性。该方法没有返回值。

```js
// HTML 代码为
// <div id="div1" align="left" width="200px">
document.getElementById('div1').removeAttribute('align');
// 现在的HTML代码为
// <div id="div1" width="200px">
```

#### dataset 属性

有时，需要在HTML元素上附加数据，供 JavaScript 脚本使用。一种解决方法是自定义属性。

```html	
<div id="mydiv" foo="bar">
```

上面代码为`div`元素自定义了`foo`属性，然后可以用`getAttribute()`和`setAttribute()`读写这个属性。

```js
var n = document.getElementById('mydiv');
n.getAttribute('foo') // bar
n.setAttribute('foo', 'baz')
```

这种方法虽然可以达到目的，但是会使得 HTML 元素的属性不符合标准，导致网页代码通不过校验。

更好的解决方法是，使用标准提供的`data-*`属性。

```js
<div id="mydiv" data-foo="bar">
```

然后，使用元素节点对象的`dataset`属性，它指向一个对象，可以用来操作 HTML 元素标签的`data-*`属性。

```js
var n = document.getElementById('mydiv');
n.dataset.foo // bar
n.dataset.foo = 'baz'
```

上面代码中，通过`dataset.foo`读写`data-foo`属性。

删除一个`data-*`属性，可以直接使用`delete`命令。

```js
delete document.getElementById('myDiv').dataset.foo;
```

除了`dataset`属性，也可以用`getAttribute('data-foo')`、`removeAttribute('data-foo')`、`setAttribute('data-foo')`、`hasAttribute('data-foo')`等方法操作`data-*`属性。

**注意**，`data-`后面的属性名有限制，只能包含字母、数字、连词线（`-`）、点（`.`）、冒号（`:`）和下划线（`_`)。

而且，属性名不应该使用`A`到`Z`的大写字母，比如不能有`data-helloWorld`这样的属性名，而要写成`data-hello-world`。

转成`dataset`的键名时，连词线后面如果跟着一个小写字母，那么连词线会被移除，该小写字母转为大写字母，其他字符不变。

反过来，`dataset`的键名转成属性名时，所有大写字母都会被转成连词线+该字母的小写形式，其他字符不变。

比如，`dataset.helloWorld`会转成`data-hello-world`。

### Text 节点

#### 概念

文本节点（`Text`）代表元素节点（`Element`）和属性节点（`Attribute`）的文本内容。

如果一个节点只包含一段文本，那么它就有一个文本子节点，代表该节点的文本内容。

通常我们使用父节点的`firstChild`、`nextSibling`等属性获取文本节点，或者使用`Document`节点的`createTextNode`方法创造一个文本节点。

```js
// 获取文本节点
var textNode = document.querySelector('p').firstChild;

// 创造文本节点
var textNode = document.createTextNode('Hi');
document.querySelector('div').appendChild(textNode);
```

浏览器原生提供一个`Text`构造函数。它返回一个文本节点实例。它的参数就是该文本节点的文本内容。

```js
// 空字符串
var text1 = new Text();

// 非空字符串
var text2 = new Text('This is a text node');
```

**注意**，由于空格也是一个字符，所以哪怕只有一个空格，也会形成文本节点。比如，`<p> </p>`包含一个空格，它的子节点就是一个文本节点。

文本节点除了继承`Node`接口，还继承了`CharacterData`接口。

#### 属性

##### data 

`data`属性等同于`nodeValue`属性，用来设置或读取文本节点的内容。

```js
// 读取文本内容
document.querySelector('p').firstChild.data
// 等同于
document.querySelector('p').firstChild.nodeValue

// 设置文本内容
document.querySelector('p').firstChild.data = 'Hello World';
```

##### wholeText

`wholeText`属性将当前文本节点与毗邻的文本节点，作为一个整体返回。大多数情况下，`wholeText`属性的返回值，与`data`属性和`textContent`属性相同。但是，某些特殊情况会有差异。

举例来说，HTML 代码如下。

```js
<p id="para">A <em>B</em> C</p>
```

这时，文本节点的`wholeText`属性和`data`属性，返回值相同。

```js
var el = document.getElementById('para');
el.firstChild.wholeText // "A "
el.firstChild.data // "A "
```

但是，一旦移除`<em>`节点，`wholeText`属性与`data`属性就会有差异，因为这时其实`<p>`节点下面包含了两个毗邻的文本节点。

```js
el.removeChild(para.childNodes[1]);
el.firstChild.wholeText // "A C"
el.firstChild.data // "A "
```

##### length

`length`属性返回当前文本节点的文本长度。

```js
(new Text('Hello')).length // 5
```

##### nextElementSibling

##### previousElementSibling

`nextElementSibling`属性返回紧跟在当前文本节点后面的那个同级**元素节点**。如果取不到元素节点，则返回`null`。

```js
// HTML 为
// <div>Hello <em>World</em></div>
var tn = document.querySelector('div').firstChild;
tn.nextElementSibling
// <em>World</em>
```

`previousElementSibling`属性返回当前文本节点前面最近的同级元素节点。如果取不到元素节点，则返回`null：`。

#### 方法

##### appendData()

##### deleteData()

##### insertData()

##### replaceData()

##### subStringData()

以下5个方法都是编辑`Text`节点文本内容的方法

- `appendData()`：在`Text`节点尾部追加字符串。
- `deleteData()`：删除`Text`节点内部的子字符串，第一个参数为子字符串开始位置，第二个参数为子字符串长度。
- `insertData()`：在`Text`节点插入字符串，第一个参数为插入位置，第二个参数为插入的子字符串。
- `replaceData()`：用于替换文本，第一个参数为替换开始位置，第二个参数为需要被替换掉的长度，第三个参数为新加入的字符串。
- `subStringData()`：用于获取子字符串，第一个参数为子字符串在`Text`节点中的开始位置，第二个参数为子字符串长度。

```js
// HTML 代码为
// <p>Hello World</p>
var pElementText = document.querySelector('p').firstChild;

pElementText.appendData('!');
// 页面显示 Hello World!
pElementText.deleteData(7, 5);
// 页面显示 Hello W
pElementText.insertData(7, 'Hello ');
// 页面显示 Hello WHello
pElementText.replaceData(7, 5, 'World');
// 页面显示 Hello WWorld
pElementText.substringData(7, 10);
// 页面显示不变，返回"World "
```

##### remove()

`remove`方法用于移除当前`Text`节点。

```js
// HTML 代码为
// <p>Hello World</p>
document.querySelector('p').firstChild.remove()
// 现在 HTML 代码为
// <p></p>
```

##### splitText()

`splitText`方法将`Text`节点一分为二，变成两个毗邻的`Text`节点。

它的参数就是分割位置（从零开始），分割到该位置的字符前结束。如果分割位置不存在，将报错。

分割后，该方法返回分割位置后方的字符串，而原`Text`节点变成只包含分割位置前方的字符串。

```js
// html 代码为 <p id="p">foobar</p>
var p = document.getElementById('p');
var textnode = p.firstChild;

var newText = textnode.splitText(3);
newText // "bar"
textnode // "foo"
```

父元素节点的`normalize`方法可以将毗邻的两个`Text`节点合并。

接上面的例子，文本节点的`splitText`方法将一个`Text`节点分割成两个，父元素的`normalize`方法可以实现逆操作，将它们合并。

```js
p.childNodes.length // 2

// 将毗邻的两个 Text 节点合并
p.normalize();
p.childNodes.length // 1
```

### DocumentFragment 节点

`DocumentFragment`节点代表一个文档的片段，本身就是一个完整的 DOM 树形结构。

它没有父节点，`parentNode`返回`null`，但是可以插入任意数量的子节点。

它不属于当前文档，操作`DocumentFragment`节点，要比直接操作 DOM 树快得多。

它一般用于构建一个 DOM 结构，然后插入当前文档。

`document.createDocumentFragment`方法，以及浏览器原生的`DocumentFragment`构造函数，可以创建一个空的`DocumentFragment`节点。然后再使用其他 DOM 方法，向其添加子节点。

```js
var docFrag = document.createDocumentFragment();
// 等同于
var docFrag = new DocumentFragment();

var li = document.createElement('li');
li.textContent = 'Hello World';
docFrag.appendChild(li);

document.querySelector('ul').appendChild(docFrag);
```

上面代码创建了一个`DocumentFragment`节点，然后将一个`li`节点添加在它里面，最后将`DocumentFragment`节点移动到原文档。

**注意**，`DocumentFragment`节点本身不能被插入当前文档。当它作为`appendChild()`、`insertBefore()`、`replaceChild()`等方法的参数时，是它的所有子节点插入当前文档，而不是它自身。一旦`DocumentFragment`节点被添加进当前文档，它自身就变成了空节点（`textContent`属性为空字符串），可以被再次使用。

如果想要保存`DocumentFragment`节点的内容，可以使用`cloneNode`方法。

```js
document
  .querySelector('ul')
  .appendChild(docFrag.cloneNode(true));
```

上面这样添加`DocumentFragment`节点进入当前文档，不会清空`DocumentFragment`节点。

下面是一个例子，使用`DocumentFragment`反转一个指定节点的所有子节点的顺序。

```js
function reverse(n) {
  var f = document.createDocumentFragment();
  while(n.lastChild) f.appendChild(n.lastChild);
  n.appendChild(f);
}
```

`DocumentFragment`节点对象没有自己的属性和方法，全部继承自`Node`节点和`ParentNode`接口。也就是说，`DocumentFragment`节点比`Node`节点多出以下四个属性。

- `children`：返回一个动态的`HTMLCollection`集合对象，包括当前`DocumentFragment`对象的所有子元素节点。
- `firstElementChild`：返回当前`DocumentFragment`对象的第一个子元素节点，如果没有则返回`null`。
- `lastElementChild`：返回当前`DocumentFragment`对象的最后一个子元素节点，如果没有则返回`null`。
- `childElementCount`：返回当前`DocumentFragment`对象的所有子元素数量。

### CSS 操作

CSS 与 JavaScript 是两个有着明确分工的领域，前者负责页面的视觉效果，后者负责与用户的行为互动。但是，它们毕竟同属网页开发的前端，因此不可避免有着交叉和互相配合。

#### HTML 元素的 style 属性

操作 CSS 样式最简单的方法，就是使用网页元素节点的`getAttribute()`方法、`setAttribute()`方法和`removeAttribute()`方法，直接读写或删除网页元素的`style`属性。

```js
div.setAttribute(
  'style',
  'background-color:red;' + 'border:1px solid black;'
);
```

上面的代码相当于下面的 HTML 代码。

```js
<div style="background-color:red; border:1px solid black;" />
```

#### CSSStyleDeclaration 接口

##### 简介

CSSStyleDeclaration 接口用来操作元素的样式。三个地方部署了这个接口。

- 元素节点的`style`属性（`Element.style`）
- `CSSStyle`实例的`style`属性
- `window.getComputedStyle()`的返回值

CSSStyleDeclaration 接口可以直接读写 CSS 的样式属性，不过，连词号需要变成骆驼拼写法。

```js
var divStyle = document.querySelector('div').style;

divStyle.backgroundColor = 'red';
divStyle.border = '1px solid black';
divStyle.width = '100px';
divStyle.height = '100px';
divStyle.fontSize = '10em';

divStyle.backgroundColor // red
divStyle.border // 1px solid black
divStyle.height // 100px
divStyle.width // 100px
```

上面代码中，`style`属性的值是一个 CSSStyleDeclaration 实例。

这个对象所包含的属性与 CSS 规则一一对应，但是名字需要改写，比如`background-color`写成`backgroundColor`。

改写的规则是将横杠从 CSS 属性名中去除，然后将横杠后的第一个字母大写。如果 CSS 属性名是 JavaScript 保留字，则规则名之前需要加上字符串`css`，比如`float`写成`cssFloat`。

注意，该对象的属性值都是字符串，设置时必须包括单位，但是不含规则结尾的分号。比如，`divStyle.width`不能写为`100`，而要写为`100px`。

另外，`Element.style`返回的只是行内样式，并不是该元素的全部样式。

通过样式表设置的样式，或者从父元素继承的样式，无法通过这个属性得到。元素的全部样式要通过`window.getComputedStyle()`得到。

##### 实例属性

###### **（1）CSSStyleDeclaration.cssText**

`CSSStyleDeclaration.cssText`属性用来读写当前规则的所有样式声明文本。

```js
var divStyle = document.querySelector('div').style;

divStyle.cssText = 'background-color: red;'
  + 'border: 1px solid black;'
  + 'height: 100px;'
  + 'width: 100px;';
```

注意，`cssText`的属性值不用改写 CSS 属性名。

删除一个元素的所有行内样式，最简便的方法就是设置`cssText`为空字符串。

```js
divStyle.cssText = '';
```

###### （2）CSSStyleDeclaration.length

`CSSStyleDeclaration.length`属性返回一个整数值，表示当前规则包含多少条样式声明。

```js
// HTML 代码如下
// <div id="myDiv"
//   style="height: 1px;width: 100%;background-color: #CA1;"
// ></div>
var myDiv = document.getElementById('myDiv');
var divStyle = myDiv.style;
divStyle.length // 3
```

###### （3）CSSStyleDeclaration.parentRule

CSSStyleDeclaration.parentRule属性返回当前规则所属的那个样式块（CSSRule 实例）。如果不存在所属的样式块，该属性返回null。

该属性只读，且只在使用 CSSRule 接口时有意义。

##### 实例方法

###### **（1）CSSStyleDeclaration.getPropertyPriority()**

`CSSStyleDeclaration.getPropertyPriority`方法接受 CSS 样式的属性名作为参数，返回一个字符串，表示有没有设置`important`优先级。如果有就返回`important`，否则返回空字符串。

```js
// HTML 代码为
// <div id="myDiv" style="margin: 10px!important; color: red;"/>
var style = document.getElementById('myDiv').style;
style.margin // "10px"
style.getPropertyPriority('margin') // "important"
style.getPropertyPriority('color') // ""
```

###### （2）CSSStyleDeclaration.getPropertyValue()

`CSSStyleDeclaration.getPropertyValue`方法接受 CSS 样式属性名作为参数，返回一个字符串，表示该属性的属性值。

```js
// HTML 代码为
// <div id="myDiv" style="margin: 10px!important; color: red;"/>
var style = document.getElementById('myDiv').style;
style.margin // "10px"
style.getPropertyValue("margin") // "10px"
```

###### **（3）CSSStyleDeclaration.item()**

`CSSStyleDeclaration.item`方法接受一个整数值作为参数，返回该位置的 CSS 属性名。

```js
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;"/>
var style = document.getElementById('myDiv').style;
style.item(0) // "color"
style.item(1) // "background-color"
```

###### （4）CSSStyleDeclaration.removeProperty()

`CSSStyleDeclaration.removeProperty`方法接受一个属性名作为参数，在 CSS 规则里面移除这个属性，返回这个属性原来的值。

```js
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;">
//   111
// </div>
var style = document.getElementById('myDiv').style;
style.removeProperty('color') // 'red'
// HTML 代码变为
// <div id="myDiv" style="background-color: white;">
```

###### （5）CSSStyleDeclaration.setProperty()

`CSSStyleDeclaration.setProperty`方法用来设置新的 CSS 属性。该方法没有返回值。

该方法可以接受三个参数。

- 第一个参数：属性名，该参数是必需的。
- 第二个参数：属性值，该参数可选。如果省略，则参数值默认为空字符串。
- 第三个参数：优先级，该参数可选。如果设置，唯一的合法值是`important`，表示 CSS 规则里面的`!important`。

```js
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;">
//   111
// </div>
var style = document.getElementById('myDiv').style;
style.setProperty('border', '1px solid blue');
```

#### CSS 模块的侦测

CSS 的规格发展太快，新的模块层出不穷。不同浏览器的不同版本，对 CSS 模块的支持情况都不一样。有时候，需要知道**当前浏览器是否支持某个模块，这就叫做“CSS模块的侦测”。**

一个比较普遍适用的方法是，判断元素的`style`对象的某个属性值是否为字符串。

```js
typeof element.style.animationName === 'string';
typeof element.style.transform === 'string';
```

如果该 CSS 属性确实存在，会返回一个字符串。即使该属性实际上并未设置，也会返回一个空字符串。如果该属性不存在，则会返回`undefined`。

```js
document.body.style['maxWidth'] // ""
document.body.style['maximumWidth'] // undefined
```

另外，使用的时候，需要把不同浏览器的 CSS 前缀也考虑进去。

```js
var content = document.getElementById('content');
typeof content.style['webkitAnimation'] === 'string'
```

封装函数

```js
function isPropertySupported(property) {
  if (property in document.body.style) return true;
  var prefixes = ['Moz', 'Webkit', 'O', 'ms', 'Khtml'];
  var prefProperty = property.charAt(0).toUpperCase() + property.substr(1);

  for(var i = 0; i < prefixes.length; i++){
    if((prefixes[i] + prefProperty) in document.body.style) return true;
  }

  return false;
}

isPropertySupported('background-clip')
// true
```

### CSS 对象

浏览器原生提供 CSS 对象，为 JavaScript 操作 CSS 提供一些工具方法。

这个对象目前有两个静态方法。

#### CSS.escape()

`CSS.escape`方法用于转义 CSS 选择器里面的特殊字符。

```html
<div id="foo#bar">
```

上面代码中，该元素的`id`属性包含一个`#`号，该字符在 CSS 选择器里面有特殊含义。不能直接写成`document.querySelector('#foo#bar')`，只能写成`document.querySelector('#foo\\#bar')`。这里必须使用双斜杠的原因是，单引号字符串本身会转义一次斜杠。

`CSS.escape`方法就用来转义那些特殊字符。

```js
document.querySelector('#' + CSS.escape('foo#bar'))
```

#### CSS.supports()

`CSS.supports`方法返回一个布尔值，表示当前环境是否支持某一句 CSS 规则。

它的参数有两种写法，一种是第一个参数是属性名，第二个参数是属性值；另一种是整个参数就是一行完整的 CSS 语句。

```js
// 第一种写法
CSS.supports('transform-origin', '5px') // true

// 第二种写法
CSS.supports('display: table-cell') // true
```

注意，第二种写法的参数结尾不能带有分号，否则结果不准确。

```js
CSS.supports('display: table-cell;') // false
```

### window.getComputedStyle()

行内样式（inline style）具有最高的优先级，改变行内样式，通常会立即反映出来。

但是，网页元素最终的样式是综合各种规则计算出来的。因此，如果想得到元素实际的样式，只读取行内样式是不够的，需要得到浏览器最终计算出来的样式规则。

`window.getComputedStyle()`方法，就用来返回浏览器计算后得到的最终规则。

它接受一个节点对象作为参数，返回一个 CSSStyleDeclaration 实例，包含了指定节点的最终样式信息。所谓“最终样式信息”，指的是各种 CSS 规则叠加后的结果。

```js
var div = document.querySelector('div');
var styleObj = window.getComputedStyle(div);
styleObj.backgroundColor
```

上面代码中，得到的背景色就是`div`元素真正的背景色。

注意，CSSStyleDeclaration 实例是一个活的对象，任何对于样式的修改，会实时反映到这个实例上面。另外，这个实例是只读的。

`getComputedStyle`方法还可以接受第二个参数，表示当前元素的伪元素（比如`:before`、`:after`、`:first-line`、`:first-letter`等）。

```js
var result = window.getComputedStyle(div, ':before');
```

下面的例子是如何获取元素的高度。

```js
var elem = document.getElementById('elem-container');
var styleObj = window.getComputedStyle(elem, null)
var height = styleObj.height;
// 等同于
var height = styleObj['height'];
var height = styleObj.getPropertyValue('height');
```

上面代码得到的`height`属性，是浏览器最终渲染出来的高度，比其他方法得到的高度更可靠。

由于`styleObj`是 CSSStyleDeclaration 实例，所以可以使用各种 CSSStyleDeclaration 的实例属性和方法。

有几点需要注意。

- CSSStyleDeclaration 实例返回的 CSS 值都是绝对单位。比如，长度都是像素单位（返回值包括`px`后缀），颜色是`rgb(#, #, #)`或`rgba(#, #, #, #)`格式。
- CSS 规则的简写形式无效。比如，想读取`margin`属性的值，不能直接读，只能读`marginLeft`、`marginTop`等属性；再比如，`font`属性也是不能直接读的，只能读`font-size`等单个属性。
- 如果读取 CSS 原始的属性名，要用方括号运算符，比如`styleObj['z-index']`；如果读取骆驼拼写法的 CSS 属性名，可以直接读取`styleObj.zIndex`。
- 该方法返回的 CSSStyleDeclaration 实例的`cssText`属性总是返回空字符串。

### CSS 伪元素

CSS 伪元素是通过 CSS 向 DOM 添加的元素，主要是通过`:before`和`:after`选择器生成，然后用`content`属性指定伪元素的内容。

```html
<div id="test">Test content</div>
```

```css
#test:before {
    content: 'Before ';
    color: #FF0;
}
```

节点元素的`style`对象无法读写伪元素的样式，这时就要用到`window.getComputedStyle()`。JavaScript 获取伪元素，可以使用下面的方法。

```js
var test = document.querySelector('#test');

var result = window.getComputedStyle(test, ':before').content;
var color = window.getComputedStyle(test, ':before').color;
```

此外，也可以使用 CSSStyleDeclaration 实例的`getPropertyValue`方法，获取伪元素的属性

```js
var result = window.getComputedStyle(test, ':before')
.getPropertyValue('content');
var color = window.getComputedStyle(test, ':before')
.getPropertyValue('color');
```

### StyleSheet 接口

#### 概述

`StyleSheet`接口代表网页的一张样式表，包括`<link>`元素加载的样式表和`<style>`元素内嵌的样式表。

`document`对象的`styleSheets`属性，可以返回当前页面的所有`StyleSheet`实例（即所有样式表）。它是一个类似数组的对象。

```js
var sheets = document.styleSheets;
var sheet = document.styleSheets[0];
sheet instanceof StyleSheet // true
```

如果是`<style>`元素嵌入的样式表，还有另一种获取`StyleSheet`实例的方法，就是这个节点元素的`sheet`属性。

```js
// HTML 代码为 <style id="myStyle"></style>
var myStyleSheet = document.getElementById('myStyle').sheet;
myStyleSheet instanceof StyleSheet // true
```

严格地说，`StyleSheet`接口不仅包括网页样式表，还包括 XML 文档的样式表。

所以，它有一个子类`CSSStyleSheet`表示网页的 CSS 样式表。我们在网页里面拿到的样式表实例，实际上是`CSSStyleSheet`的实例。

这个子接口继承了`StyleSheet`的所有属性和方法，并且定义了几个自己的属性，下面把这两个接口放在一起介绍。

#### 实例属性

`StyleSheet`实例有以下属性。

##### （1）StyleSheet.disabled

`StyleSheet.disabled`返回一个布尔值，表示该样式表是否处于禁用状态。手动设置`disabled`属性为`true`，等同于在`<link>`元素里面，将这张样式表设为`alternate stylesheet`，即该样式表将不会生效。

##### （2）StyleSheet.href

`StyleSheet.href`返回样式表的网址。对于内嵌样式表，该属性返回`null`。该属性只读。

```js
document.styleSheets[0].href
```

##### （3）StyleSheet.media

`StyleSheet.media`属性返回一个类似数组的对象（`MediaList`实例），成员是表示适用媒介的字符串。

表示当前样式表是用于屏幕（screen），还是用于打印（print）或手持设备（handheld），或各种媒介都适用（all）。该属性只读，默认值是`screen`。

```js
document.styleSheets[0].media.mediaText
// "all"
```

`MediaList`实例的`appendMedium`方法，用于增加媒介；`deleteMedium`方法用于删除媒介。

```js
document.styleSheets[0].media.appendMedium('handheld');
document.styleSheets[0].media.deleteMedium('print');
```

##### （4）StyleSheet.title

`StyleSheet.title`属性返回样式表的`title`属性。

##### （5）StyleSheet.type

`StyleSheet.type`属性返回样式表的`type`属性，通常是`text/css`。

```js
document.styleSheets[0].type  // "text/css"
```

##### （6）StyleSheet.parentStyleSheet

CSS 的`@import`命令允许在样式表中加载其他样式表。`StyleSheet.parentStyleSheet`属性返回包含了当前样式表的那张样式表。如果当前样式表是顶层样式表，则该属性返回`null`。

```js
if (stylesheet.parentStyleSheet) {
  sheet = stylesheet.parentStyleSheet;
} else {
  sheet = stylesheet;
}
```

##### （7）StyleSheet.ownerNode

`StyleSheet.ownerNode`属性返回`StyleSheet`对象所在的 DOM 节点，通常是`<link>`或`<style>`。对于那些由其他样式表引用的样式表，该属性为`null`。

```js
// HTML代码为
// <link rel="StyleSheet" href="example.css" type="text/css" />
document.styleSheets[0].ownerNode
// <link rel="stylesheet" href="xxx.css">
```

##### （8）CSSStyleSheet.cssRules

`CSSStyleSheet.cssRules`属性指向一个类似数组的对象（`CSSRuleList`实例），里面每一个成员就是当前样式表的一条 CSS 规则。使用该规则的`cssText`属性，可以得到 CSS 规则对应的字符串。

```js
var sheet = document.querySelector('#styleElement').sheet;

sheet.cssRules[0].cssText
// "body { background-color: red; margin: 20px; }"

sheet.cssRules[1].cssText
// "p { line-height: 1.4em; color: blue; }"
```

每条 CSS 规则还有一个`style`属性，指向一个对象，用来读写具体的 CSS 命令。

```js
cssStyleSheet.cssRules[0].style.color = 'red';
cssStyleSheet.cssRules[1].style.color = 'purple';
```

##### （9）CSSStyleSheet.ownerRule

有些样式表是通过`@import`规则输入的，它的`ownerRule`属性会返回一个`CSSRule`实例，代表那行`@import`规则。如果当前样式表不是通过`@import`引入的，`ownerRule`属性返回`null`。

#### 实例方法

##### **（1）CSSStyleSheet.insertRule()**

`CSSStyleSheet.insertRule`方法用于在当前样式表的插入一个新的 CSS 规则。

```js
var sheet = document.querySelector('#styleElement').sheet;
sheet.insertRule('#block { color: white }', 0);
sheet.insertRule('p { color: red }', 1);
```

该方法可以接受两个参数，第一个参数是表示 CSS 规则的字符串，这里只能有一条规则，否则会报错。第二个参数是该规则在样式表的插入位置（从0开始），该参数可选，默认为0（即默认插在样式表的头部）。注意，如果插入位置大于现有规则的数目，会报错。

该方法的返回值是新插入规则的位置序号。

**注意**，浏览器对脚本在样式表里面插入规则有很多[限制](https://drafts.csswg.org/cssom/#insert-a-css-rule)。所以，这个方法最好放在`try...catch`里使用。

##### （2）CSSStyleSheet.deleteRule()

`CSSStyleSheet.deleteRule`方法用来在样式表里面移除一条规则，它的参数是该条规则在`cssRules`对象中的位置。该方法没有返回值。

```js
document.styleSheets[0].deleteRule(1);
```

### 实例：添加样式表

网页添加样式表有两种方式。一种是添加一张内置样式表，即在文档中添加一个`<style>`节点。

```js
// 写法一
var style = document.createElement('style');
style.setAttribute('media', 'screen');
style.innerHTML = 'body{color:red}';
document.head.appendChild(style);

// 写法二
var style = (function () {
  var style = document.createElement('style');
  document.head.appendChild(style);
  return style;
})();
style.sheet.insertRule('.foo{color:red;}', 0);
```

另一种是添加外部样式表，即在文档中添加一个`<link>`节点，然后将`href`属性指向外部样式表的 URL。

```js
var linkElm = document.createElement('link');
linkElm.setAttribute('rel', 'stylesheet');
linkElm.setAttribute('type', 'text/css');
linkElm.setAttribute('href', 'reset-min.css');

document.head.appendChild(linkElm);
```

### CSSRuleList 接口

CSSRuleList 接口是一个类似数组的对象，表示一组 CSS 规则，成员都是 CSSRule 实例。

获取 CSSRuleList 实例，一般是通过`StyleSheet.cssRules`属性。

```js
// HTML 代码如下
// <style id="myStyle">
//   h1 { color: red; }
//   p { color: blue; }
// </style>
var myStyleSheet = document.getElementById('myStyle').sheet;
var crl = myStyleSheet.cssRules;
crl instanceof CSSRuleList // true
```

CSSRuleList 实例里面，每一条规则（CSSRule 实例）可以通过`rules.item(index)`或者`rules[index]`拿到。CSS 规则的条数通过`rules.length`拿到。还是用上面的例子。

```js
crl[0] instanceof CSSRule // true
crl.length // 2
```

注意，添加规则和删除规则不能在 CSSRuleList 实例操作，而要在它的父元素 StyleSheet 实例上，通过`StyleSheet.insertRule()`和`StyleSheet.deleteRule()`操作。

### CSSRule 接口

#### 概述

一条 CSS 规则包括两个部分：CSS 选择器和样式声明。下面就是一条典型的 CSS 规则。

```css
.myClass {
  color: red;
  background-color: yellow;
}
```

JavaScript 通过 CSSRule 接口操作 CSS 规则。一般通过 CSSRuleList 接口（`StyleSheet.cssRules`）获取 CSSRule 实例。

```js
// HTML 代码如下
// <style id="myStyle">
//   .myClass {
//     color: red;
//     background-color: yellow;
//   }
// </style>
var myStyleSheet = document.getElementById('myStyle').sheet;
var ruleList = myStyleSheet.cssRules;
var rule = ruleList[0];
rule instanceof CSSRule // true
```

#### CSSRule 实例的属性

##### （1）CSSRule.cssText

`CSSRule.cssText`属性返回当前规则的文本，还是使用上面的例子。

```js
rule.cssText
// ".myClass { color: red; background-color: yellow; }"
```

如果规则是加载（`@import`）其他样式表，`cssText`属性返回`@import 'url'`。

##### （2）CSSRule.parentStyleSheet

`CSSRule.parentStyleSheet`属性返回当前规则所在的样式表对象（StyleSheet 实例），还是使用上面的例子。

```js
rule.parentStyleSheet === myStyleSheet // true
```

##### **（3）CSSRule.parentRule**

`CSSRule.parentRule`属性返回包含当前规则的父规则，如果不存在父规则（即当前规则是顶层规则），则返回`null`。

父规则最常见的情况是，当前规则包含在`@media`规则代码块之中。

```js
// HTML 代码如下
// <style id="myStyle">
//   @supports (display: flex) {
//     @media screen and (min-width: 900px) {
//       article {
//         display: flex;
//       }
//     }
//  }
// </style>
var myStyleSheet = document.getElementById('myStyle').sheet;
var ruleList = myStyleSheet.cssRules;

var rule0 = ruleList[0];
rule0.cssText
// "@supports (display: flex) {
//    @media screen and (min-width: 900px) {
//      article { display: flex; }
//    }
// }"

// 由于这条规则内嵌其他规则，
// 所以它有 cssRules 属性，且该属性是 CSSRuleList 实例
rule0.cssRules instanceof CSSRuleList // true

var rule1 = rule0.cssRules[0];
rule1.cssText
// "@media screen and (min-width: 900px) {
//   article { display: flex; }
// }"

var rule2 = rule1.cssRules[0];
rule2.cssText
// "article { display: flex; }"

rule1.parentRule === rule0 // true
rule2.parentRule === rule1 // true
```

##### **（4）CSSRule.type**

`CSSRule.type`属性返回一个整数值，表示当前规则的类型。

最常见的类型有以下几种。

- 1：普通样式规则（CSSStyleRule 实例）
- 3：`@import`规则
- 4：`@media`规则（CSSMediaRule 实例）
- 5：`@font-face`规则

#### CSSStyleRule 接口

如果一条 CSS 规则是普通的样式规则（不含特殊的 CSS 命令），那么除了 CSSRule 接口，它还部署了 CSSStyleRule 接口。

CSSStyleRule 接口有以下两个属性。

##### **（1）CSSStyleRule.selectorText**

`CSSStyleRule.selectorText`属性返回当前规则的选择器（可写）。

```js
var stylesheet = document.styleSheets[0];
stylesheet.cssRules[0].selectorText // ".myClass"
```

##### **（2）CSSStyleRule.style**

`CSSStyleRule.style`属性返回一个对象（CSSStyleDeclaration 实例），代表当前规则的样式声明，也就是选择器后面的大括号里面的部分。

```js
// HTML 代码为
// <style id="myStyle">
//   p { color: red; }
// </style>
var styleSheet = document.getElementById('myStyle').sheet;
styleSheet.cssRules[0].style instanceof CSSStyleDeclaration
// true
```

CSSStyleDeclaration 实例的`cssText`属性，可以返回所有样式声明，格式为字符串。

```js
styleSheet.cssRules[0].style.cssText
// "color: red;"
styleSheet.cssRules[0].selectorText
// "p"
```

#### CSSMediaRule 接口

如果一条 CSS 规则是`@media`代码块，那么它除了 CSSRule 接口，还部署了 CSSMediaRule 接口。

该接口主要提供`media`属性和`conditionText`属性。前者返回代表`@media`规则的一个对象（MediaList 实例），后者返回`@media`规则的生效条件。

### window.matchMedia()

#### 基本用法 

`window.matchMedia()`方法用来将 CSS 的[`Media Query`](https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code)条件语句，转换成一个 MediaQueryList 实例。

```js
var mdl = window.matchMedia('(min-width: 400px)');
mdl instanceof MediaQueryList // true
```

上面代码中，变量`mdl`就是 mediaQueryList 的实例。

注意，如果参数不是有效的`MediaQuery`条件语句，`window.matchMedia`不会报错，依然返回一个 MediaQueryList 实例。

```js
window.matchMedia('bad string') instanceof MediaQueryList // true
```

#### MediaQueryList 接口的实例属性

##### **（1）MediaQueryList.media**

`MediaQueryList.media`属性返回一个字符串，表示对应的 MediaQuery 条件语句。

```js
var mql = window.matchMedia('(min-width: 400px)');
mql.media // "(min-width: 400px)"
```

##### **（2）MediaQueryList.matches**

`MediaQueryList.matches`属性返回一个布尔值，表示当前页面是否符合指定的 MediaQuery 条件语句。

```js
if (window.matchMedia('(min-width: 400px)').matches) {
  /* 当前视口不小于 400 像素 */
} else {
  /* 当前视口小于 400 像素 */
}
```

下面的例子根据`mediaQuery`是否匹配当前环境，加载相应的 CSS 样式表。

```js
var result = window.matchMedia("(max-width: 700px)");

if (result.matches){
  var linkElm = document.createElement('link');
  linkElm.setAttribute('rel', 'stylesheet');
  linkElm.setAttribute('type', 'text/css');
  linkElm.setAttribute('href', 'small.css');

  document.head.appendChild(linkElm);
}
```

##### **（3）MediaQueryList.onchange**

如果 MediaQuery 条件语句的适配环境发生变化，会触发`change`事件。`MediaQueryList.onchange`属性用来指定`change`事件的监听函数。

该函数的参数是`change`事件对象（MediaQueryListEvent 实例），该对象与 MediaQueryList 实例类似，也有`media`和`matches`属性。

```js
var mql = window.matchMedia('(max-width: 600px)');

mql.onchange = function(e) {
  if (e.matches) {
    /* 视口不超过 600 像素 */
  } else {
    /* 视口超过 600 像素 */
  }
}
```

上面代码中，`change`事件发生后，存在两种可能。一种是显示宽度从600像素以上变为以下，另一种是从600像素以下变为以上，所以在监听函数内部要判断一下当前是哪一种情况。

#### MediaQueryList 接口的实例方法

MediaQueryList 实例有两个方法`MediaQueryList.addListener()`和`MediaQueryList.removeListener()`，用来为`change`事件添加或撤销监听函数。

```js
var mql = window.matchMedia('(max-width: 600px)');

// 指定监听函数
mql.addListener(mqCallback);

// 撤销监听函数
mql.removeListener(mqCallback);

function mqCallback(e) {
  if (e.matches) {
    /* 视口不超过 600 像素 */
  } else {
    /* 视口超过 600 像素 */
  }
}
```

**注意**，`MediaQueryList.removeListener()`方法不能撤销`MediaQueryList.onchange`属性指定的监听函数。

### Mutation Observer API

#### 概述

Mutation Observer API 用来监视 DOM 变动。DOM 的任何变动，比如节点的增减、属性的变动、文本内容的变动，这个 API 都可以得到通知。

概念上，它很接近事件，可以理解为 DOM 发生变动就会触发 Mutation Observer 事件。但是，它与事件有一个本质不同：**事件是同步触发**，也就是说，DOM 的变动立刻会触发相应的事件；**Mutation Observer 则是异步触发**，DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发。

这样设计是为了应付 DOM 变动频繁的特点。举例来说，如果文档中连续插入1000个`<p>`元素，就会连续触发1000个插入事件，执行每个事件的回调函数，这很可能造成浏览器的卡顿；

而 Mutation Observer 完全不同，只在1000个段落都插入结束后才会触发，而且只触发一次。

Mutation Observer 有以下特点。

- 它等待所有脚本任务完成后，才会运行（即异步触发方式）。
- 它把 DOM 变动记录封装成一个数组进行处理，而不是一条条个别处理 DOM 变动。
- 它既可以观察 DOM 的所有类型变动，也可以指定只观察某一类变动。

#### 构造函数

使用时，首先使用`MutationObserver`构造函数，新建一个观察器实例，同时指定这个实例的回调函数。

```js
var observer = new MutationObserver(callback);
```

上面代码中的回调函数，会在每次 DOM 变动后调用。该回调函数接受两个参数，第一个是变动数组，第二个是观察器实例，下面是一个例子。

```js
var observer = new MutationObserver(function (mutations, observer) {
  mutations.forEach(function(mutation) {
    console.log(mutation);
  });
});
```

#### 实例方法

##### observe()

`observe()`方法用来启动监听，它接受两个参数。

- 第一个参数：所要观察的 DOM 节点
- 第二个参数：一个配置对象，指定所要观察的特定变动

```js
var article = document.querySelector('article');

var options = {
  'childList': true,
  'attributes':true
} ;

observer.observe(article, options);
```

上面代码中，`observe()`方法接受两个参数，第一个是所要观察的DOM元素是`article`，第二个是所要观察的变动类型（子节点变动和属性变动）。

观察器所能观察的 DOM 变动类型（即上面代码的`options`对象），有以下几种。

- **childList**：子节点的变动（指新增，删除或者更改）。
- **attributes**：属性的变动。
- **characterData**：节点内容或节点文本的变动。

想要观察哪一种变动类型，就在`option`对象中指定它的值为`true`。需要注意的是，至少必须同时指定这三种观察的一种，若均未指定将报错。

除了变动类型，`options`对象还可以设定以下属性：

- `subtree`：布尔值，表示是否将该观察器应用于该节点的所有后代节点。
- `attributeOldValue`：布尔值，表示观察`attributes`变动时，是否需要记录变动前的属性值。
- `characterDataOldValue`：布尔值，表示观察`characterData`变动时，是否需要记录变动前的值。
- `attributeFilter`：数组，表示需要观察的特定属性（比如`['class','src']`）。

```js
// 开始监听文档根节点（即<html>标签）的变动
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});
```

对一个节点添加观察器，就像使用`addEventListener()`方法一样，多次添加同一个观察器是无效的，回调函数依然只会触发一次。如果指定不同的`options`对象，以后面添加的那个为准，类似覆盖。

下面的例子是观察新增的子节点。

```js
var insertedNodes = [];
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      insertedNodes.push(mutation.addedNodes[i]);
    }
  });
  console.log(insertedNodes);
});
observer.observe(document, { childList: true, subtree: true });
```

##### disconnect()

`disconnect()`方法用来停止观察。调用该方法后，DOM 再发生变动，也不会触发观察器。

```js
observer.disconnect();
```

##### takeRecords()

`takeRecords()`方法用来清除变动记录，即不再处理未处理的变动。该方法返回变动记录的数组。

```js
observer.takeRecords();
```

下面是一个例子。

```js
// 保存所有没有被观察器处理的变动
var changes = mutationObserver.takeRecords();

// 停止观察
mutationObserver.disconnect();
```

#### 对象

DOM 每次发生变化，就会生成一条变动记录（MutationRecord 实例）。

该实例包含了与变动相关的所有信息。Mutation Observer 处理的就是一个个`MutationRecord`实例所组成的数组。

`MutationRecord`对象包含了DOM的相关信息，有如下属性：

- `type`：观察的变动类型（`attributes`、`characterData`或者`childList`）。
- `target`：发生变动的DOM节点。
- `addedNodes`：新增的DOM节点。
- `removedNodes`：删除的DOM节点。
- `previousSibling`：前一个同级节点，如果没有则返回`null`。
- `nextSibling`：下一个同级节点，如果没有则返回`null`。
- `attributeName`：发生变动的属性。如果设置了`attributeFilter`，则只返回预先指定的属性。
- `oldValue`：变动前的值。这个属性只对`attribute`和`characterData`变动有效，如果发生`childList`变动，则返回`null`。

#### 应用示例

##### 子元素的变动

下面的例子说明如何读取变动记录。

```js
var callback = function (records){
  records.map(function(record){
    console.log('Mutation type: ' + record.type);
    console.log('Mutation target: ' + record.target);
  });
};

var mo = new MutationObserver(callback);

var option = {
  'childList': true,
  'subtree': true
};

mo.observe(document.body, option);
```

上面代码的观察器，观察`<body>`的所有下级节点（`childList`表示观察子节点，`subtree`表示观察后代节点）的变动。回调函数会在控制台显示所有变动的类型和目标节点。

##### 属性的变动

下面的例子说明如何追踪属性的变动。

```js
var callback = function (records) {
  records.map(function (record) {
    console.log('Previous attribute value: ' + record.oldValue);
  });
};

var mo = new MutationObserver(callback);

var element = document.getElementById('#my_element');

var options = {
  'attributes': true,
  'attributeOldValue': true
}

mo.observe(element, options);
```

上面代码先设定追踪属性变动（`'attributes': true`），然后设定记录变动前的值。实际发生变动时，会将变动前的值显示在控制台。

#### 取代 DOMContentLoaded 事件

网页加载的时候，DOM 节点的生成会产生变动记录，因此只要观察 DOM 的变动，就能在第一时间触发相关事件，也就没有必要使用`DOMContentLoaded`事件。

```js
var observer = new MutationObserver(callback);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
```

上面代码中，监听`document.documentElement`（即网页的`<html>`HTML 节点）的子节点的变动，`subtree`属性指定监听还包括后代节点。因此，任意一个网页元素一旦生成，就能立刻被监听到。

下面的代码，使用`MutationObserver`对象封装一个监听 DOM 生成的函数。

```js
(function(win){
  'use strict';

  var listeners = [];
  var doc = win.document;
  var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
  var observer;

  function ready(selector, fn){
    // 储存选择器和回调函数
    listeners.push({
      selector: selector,
      fn: fn
    });
    if(!observer){
      // 监听document变化
      observer = new MutationObserver(check);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true
      });
    }
    // 检查该节点是否已经在DOM中
    check();
  }

  function check(){
  // 检查是否匹配已储存的节点
    for(var i = 0; i < listeners.length; i++){
      var listener = listeners[i];
      // 检查指定节点是否有匹配
      var elements = doc.querySelectorAll(listener.selector);
      for(var j = 0; j < elements.length; j++){
        var element = elements[j];
        // 确保回调函数只会对该元素调用一次
        if(!element.ready){
          element.ready = true;
          // 对该节点调用回调函数
          listener.fn.call(element, element);
        }
      }
    }
  }

  // 对外暴露ready
  win.ready = ready;

})(this);

// 使用方法
ready('.foo', function(element){
  // ...
});
```

## 事件

### EventTarget 接口

事件的本质是程序各个组成部分之间的一种通信方式，也是异步编程的一种实现。

DOM 支持大量的事件，本章开始介绍 DOM 的事件编程。

介绍具体的事件之前，先来看看如何让 DOM 节点监听事件。

#### 概述

DOM 节点的事件操作（监听和触发），都定义在`EventTarget`接口。所有节点对象都部署了这个接口，其他一些需要事件通信的浏览器内置对象（比如，`XMLHttpRequest`、`AudioNode`、`AudioContext`）也部署了这个接口。

#### EventTarget.addEventListener()

`EventTarget.addEventListener()`用于在当前节点或对象上（即部署了 EventTarget 接口的对象），定义一个特定事件的监听函数。

一旦这个事件发生，就会执行监听函数。该方法没有返回值。

```js
target.addEventListener(type, listener[, useCapture]);
```

该方法接受三个参数。

- `type`：事件名称，大小写敏感。
- `listener`：监听函数。事件发生时，会调用该监听函数。
- `useCapture`：布尔值，如果设为`true`，表示监听函数将在捕获阶段（capture）触发。该参数可选，默认值为`false`（监听函数只在冒泡阶段被触发）。

```js
function hello() {
  console.log('Hello world');
}

var button = document.getElementById('btn');
button.addEventListener('click', hello, false);
```

上面代码中，`button`节点的`addEventListener()`方法绑定`click`事件的监听函数`hello()`，该函数只在冒泡阶段触发。

关于参数，有两个地方需要注意。

首先，第二个参数除了监听函数，还可以是一个具有`handleEvent`方法的对象，效果与监听函数一样。

```js
buttonElement.addEventListener('click', {
  handleEvent: function (event) {
    console.log('click');
  }
});
```

第三个参数除了布尔值`useCapture`，还可以是一个监听器配置对象，定制事件监听行为。该对象有以下属性。

- `capture`：布尔值，如果设为`true`，表示监听函数在捕获阶段触发，默认为`false`，在冒泡阶段触发。
- `once`：布尔值，如果设为`true`，表示监听函数执行一次就会自动移除，后面将不再监听该事件。该属性默认值为`false`。
- `passive`：布尔值，设为`true`时，表示禁止监听函数调用`preventDefault()`方法。如果调用了，浏览器将忽略这个要求，并在控制台输出一条警告。该属性默认值为`false`。
- `signal`：该属性的值为一个 AbortSignal 对象，为监听器设置了一个信号通道，用来在需要时发出信号，移除监听函数。

`addEventListener()`方法可以为针对当前对象的同一个事件，添加多个不同的监听函数。这些函数按照添加顺序触发，即先添加先触发。如果为同一个事件多次添加同一个监听函数，该函数只会执行一次，多余的添加将自动被去除（不必使用`removeEventListener()`方法手动去除）。

如果希望向监听函数传递参数，可以用匿名函数包装一下监听函数。

```js
function print(x) {
  console.log(x);
}

var el = document.getElementById('div1');
el.addEventListener('click', function () { print('Hello'); }, false);
```

上面代码通过匿名函数，向监听函数`print`传递了一个参数。

监听函数内部的`this`，指向当前事件所在的那个对象。

```js
// HTML 代码如下
// <p id="para">Hello</p>
var para = document.getElementById('para');
para.addEventListener('click', function (e) {
  console.log(this.nodeName); // "P"
}, false);
```

#### EventTarget.removeEventListener()

`EventTarget.removeEventListener()`方法用来移除`addEventListener()`方法添加的事件监听函数。该方法没有返回值。

`removeEventListener()`方法的参数，与`addEventListener()`方法完全一致。它的第一个参数“事件类型”，大小写敏感。

注意，**`removeEventListener()`方法移除的监听函数，必须是`addEventListener()`方法添加的那个监听函数，而且必须在同一个元素节点，否则无效。**

```js
div.addEventListener('click', function (e) {}, false);
div.removeEventListener('click', function (e) {}, false);
```

上面代码中，`removeEventListener()`方法无效，因为监听函数不是同一个匿名函数。

```js
element.addEventListener('mousedown', handleMouseDown, true);
element.removeEventListener("mousedown", handleMouseDown, false);
```

上面代码中，`removeEventListener()`方法也是无效的，因为第三个参数不一样。

#### EventTarget.dispatchEvent()

`EventTarget.dispatchEvent()`方法在当前节点上触发指定事件，从而触发监听函数的执行。该方法返回一个布尔值，只要有一个监听函数调用了`Event.preventDefault()`，则返回值为`false`，否则为`true`。

```js
target.dispatchEvent(event)
```

`dispatchEvent()`方法的参数是一个`Event`对象的实例。

```js
para.addEventListener('click', hello, false);
var event = new Event('click');
para.dispatchEvent(event);
```

上面代码在当前节点触发了`click`事件。

如果`dispatchEvent()`方法的参数为空，或者不是一个有效的事件对象，将报错。

下面代码根据`dispatchEvent()`方法的返回值，判断事件是否被取消了。

```js
var canceled = !cb.dispatchEvent(event);
if (canceled) {
  console.log('事件取消');
} else {
  console.log('事件未取消');
}
```

### 事件模型

#### 监听函数

浏览器的事件模型，就是通过监听函数（listener）对事件做出反应。事件发生后，浏览器监听到了这个事件，就会执行对应的监听函数。这是事件驱动编程模式（event-driven）的主要编程方式。	

JavaScript 有三种方法，可以为事件绑定监听函数。

##### HTML 的 on- 属性 

HTML 语言允许在元素的属性中，直接定义某些事件的监听代码。

```js
<body onload="doSomething()">
<div onclick="console.log('触发事件')">
```

上面代码为`body`节点的`load`事件、`div`节点的`click`事件，指定了监听代码。一旦事件发生，就会执行这段代码。

元素的事件监听属性，都是`on`加上事件名，比如`onload`就是`on + load`，表示`load`事件的监听代码。

注意，这些属性的值是将会执行的代码，而不是一个函数。

```js
<!-- 正确 -->
<body onload="doSomething()">

<!-- 错误 -->
<body onload="doSomething">
```

一旦指定的事件发生，`on-`属性的值是原样传入 JavaScript 引擎执行。因此如果要执行函数，不要忘记加上一对圆括号。

使用这个方法指定的监听代码，只会在冒泡阶段触发。

```html
<div onclick="console.log(2)">
  <button onclick="console.log(1)">点击</button>
</div>
```

上面代码中，`<button>`是`<div>`的子元素。`<button>`的`click`事件，也会触发`<div>`的`click`事件。

由于`on-`属性的监听代码，只在冒泡阶段触发，所以点击结果是先输出`1`，再输出`2`，即事件从子元素开始冒泡到父元素。

直接设置`on-`属性，与通过元素节点的`setAttribute`方法设置`on-`属性，效果是一样的。

```js
el.setAttribute('onclick', 'doSomething()');
// 等同于
// <Element onclick="doSomething()">
```

##### 元素节点的事件属性

元素节点对象的事件属性，同样可以指定监听函数。

```js
window.onload = doSomething;

div.onclick = function (event) {
  console.log('触发事件');
};
```

使用这个方法指定的监听函数，也是只会在冒泡阶段触发。

注意，这种方法与 HTML 的`on-`属性的差异是，它的值是函数名（`doSomething`），而不像后者，必须给出完整的监听代码（`doSomething()`）。

##### EventTarget.addEventListener()

所有 DOM 节点实例都有`addEventListener`方法，用来为该节点定义事件的监听函数。

```js
window.addEventListener('load', doSomething, false);
```

##### 小结

上面三种方法，第一种“HTML 的 on- 属性”，违反了 HTML 与 JavaScript 代码相分离的原则，将两者写在一起，不利于代码分工，因此不推荐使用。

第二种“元素节点的事件属性”的缺点在于，同一个事件只能定义一个监听函数，也就是说，如果定义两次`onclick`属性，后一次定义会覆盖前一次。因此，也不推荐使用。

第三种`EventTarget.addEventListener`是推荐的指定监听函数的方法。它有如下优点：

- 同一个事件可以添加多个监听函数。
- 能够指定在哪个阶段（捕获阶段还是冒泡阶段）触发监听函数。
- 除了 DOM 节点，其他对象（比如`window`、`XMLHttpRequest`等）也有这个接口，它等于是整个 JavaScript 统一的监听函数接口。

#### this 的指向

监听函数内部的`this`指向触发事件的那个元素节点。

```js
<button id="btn" onclick="console.log(this.id)">点击</button>
```

执行上面代码，点击后会输出`btn`。

其他两种监听函数的写法，`this`的指向也是如此。

#### 事件的传播

一个事件发生后，会在子元素和父元素之间传播（propagation）。这种传播分成三个阶段。

- **第一阶段**：从`window`对象传导到目标节点（上层传到底层），称为“捕获阶段”（capture phase）。
- **第二阶段**：在目标节点上触发，称为“目标阶段”（target phase）。
- **第三阶段**：从目标节点传导回`window`对象（从底层传回上层），称为“冒泡阶段”（bubbling phase）。

这种三阶段的传播模型，使得同一个事件会在多个节点上触发。

```html
<div>
  <p>点击</p>
</div>
```

上面代码中，`<div>`节点之中有一个`<p>`节点。

如果对这两个节点，都设置`click`事件的监听函数（每个节点的捕获阶段和冒泡阶段，各设置一个监听函数），共计设置四个监听函数。然后，对`<p>`点击，`click`事件会触发四次。

```js
var phases = {
  1: 'capture',
  2: 'target',
  3: 'bubble'
};

var div = document.querySelector('div');
var p = document.querySelector('p');

div.addEventListener('click', callback, true);
p.addEventListener('click', callback, true);
div.addEventListener('click', callback, false);
p.addEventListener('click', callback, false);

function callback(event) {
  var tag = event.currentTarget.tagName;
  var phase = phases[event.eventPhase];
  console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
}

// 点击以后的结果
// Tag: 'DIV'. EventPhase: 'capture'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'DIV'. EventPhase: 'bubble'
```

上面代码表示，`click`事件被触发了四次：`<div>`节点的捕获阶段和冒泡阶段各1次，`<p>`节点的目标阶段触发了2次。

1. 捕获阶段：事件从`<div>`向`<p>`传播时，触发`<div>`的`click`事件；
2. 目标阶段：事件从`<div>`到达`<p>`时，触发`<p>`的`click`事件；
3. 冒泡阶段：事件从`<p>`传回`<div>`时，再次触发`<div>`的`click`事件。

其中，`<p>`节点有两个监听函数（`addEventListener`方法第三个参数的不同，会导致绑定两个监听函数），因此它们都会因为`click`事件触发一次。所以，`<p>`会在`target`阶段有两次输出。

注意，浏览器总是假定`click`事件的目标节点，就是点击位置嵌套最深的那个节点（本例是`<div>`节点里面的`<p>`节点）。所以，`<p>`节点的捕获阶段和冒泡阶段，都会显示为`target`阶段。

事件传播的最上层对象是`window`，接着依次是`document`，`html`（`document.documentElement`）和`body`（`document.body`）。也就是说，上例的事件传播顺序，在捕获阶段依次为`window`、`document`、`html`、`body`、`div`、`p`，在冒泡阶段依次为`p`、`div`、`body`、`html`、`document`、`window`。

#### 事件的代理

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理（delegation）。

```js
var ul = document.querySelector('ul');

ul.addEventListener('click', function (event) {
  if (event.target.tagName.toLowerCase() === 'li') {
    // some code
  }
});
```

上面代码中，`click`事件的监听函数定义在`<ul>`节点，但是实际上，它处理的是子节点`<li>`的`click`事件。

这样做的好处是，只要定义一个监听函数，就能处理多个子节点的事件，而不用在每个`<li>`节点上定义监听函数。而且以后再添加子节点，监听函数依然有效。

如果希望事件到某个节点为止，不再传播，可以使用事件对象的`stopPropagation`方法。

```js
// 事件传播到 p 元素后，就不再向下传播了
p.addEventListener('click', function (event) {
  event.stopPropagation();
}, true);

// 事件冒泡到 p 元素后，就不再向上冒泡了
p.addEventListener('click', function (event) {
  event.stopPropagation();
}, false);
```

上面代码中，`stopPropagation`方法分别在捕获阶段和冒泡阶段，阻止了事件的传播。

但是，`stopPropagation`方法只会阻止事件的传播，不会阻止该事件触发`<p>`节点的其他`click`事件的监听函数。也就是说，不是彻底取消`click`事件。

```js
p.addEventListener('click', function (event) {
  event.stopPropagation();
  console.log(1);
});

p.addEventListener('click', function(event) {
  // 会触发
  console.log(2);
});
```

上面代码中，`p`元素绑定了两个`click`事件的监听函数。`stopPropagation`方法只能阻止这个事件的传播，不能取消这个事件，因此，第二个监听函数会触发。输出结果会先是1，然后是2。

如果想要彻底取消该事件，不再触发后面所有`click`的监听函数，可以使用`stopImmediatePropagation`方法。

```js
p.addEventListener('click', function (event) {
  event.stopImmediatePropagation();
  console.log(1);
});

p.addEventListener('click', function(event) {
  // 不会被触发
  console.log(2);
});
```

上面代码中，`stopImmediatePropagation`方法可以彻底取消这个事件，使得后面绑定的所有`click`监听函数都不再触发。所以，只会输出1，不会输出2。

### Event 对象

#### 概述

事件发生以后，会产生一个事件对象，作为参数传给监听函数。

浏览器原生提供一个`Event`对象，所有的事件都是这个对象的实例，或者说继承了`Event.prototype`对象。

`Event`对象本身就是一个构造函数，可以用来生成新的实例。

```js
event = new Event(type, options);
```

`Event`构造函数接受两个参数。第一个参数`type`是字符串，表示事件的名称；第二个参数`options`是一个对象，表示事件对象的配置。该对象主要有下面两个属性。

- `bubbles`：布尔值，可选，默认为`false`，表示事件对象是否冒泡。
- `cancelable`：布尔值，可选，默认为`false`，表示事件是否可以被取消，即能否用`Event.preventDefault()`取消这个事件。一旦事件被取消，就好像从来没有发生过，不会触发浏览器对该事件的默认行为。

```js
var ev = new Event(
  'look',
  {
    'bubbles': true,
    'cancelable': false
  }
);
document.dispatchEvent(ev);
```

上面代码新建一个`look`事件实例，然后使用`dispatchEvent`方法触发该事件。

注意，如果不是显式指定`bubbles`属性为`true`，生成的事件就只能在“捕获阶段”触发监听函数。

```js
// HTML 代码为
// <div><p>Hello</p></div>
var div = document.querySelector('div');
var p = document.querySelector('p');

function callback(event) {
  var tag = event.currentTarget.tagName;
  console.log('Tag: ' + tag); // 没有任何输出
}

div.addEventListener('click', callback, false);

var click = new Event('click');
p.dispatchEvent(click);
```

上面代码中，`p`元素发出一个`click`事件，该事件默认不会冒泡。`div.addEventListener`方法指定在冒泡阶段监听，因此监听函数不会触发。如果写成`div.addEventListener('click', callback, true)`，那么在“捕获阶段”可以监听到这个事件。

#### 实例属性

##### Event.bubbles

`Event.bubbles`属性返回一个布尔值，表示当前事件是否会冒泡。该属性为只读属性，一般用来了解 Event 实例是否可以冒泡。前面说过，除非显式声明，`Event`构造函数生成的事件，默认是不冒泡的。

##### Event.eventPhase

`Event.eventPhase`属性返回一个整数常量，表示事件目前所处的阶段。该属性只读。

```js
var phase = event.eventPhase;
```

`Event.eventPhase`的返回值有四种可能。

- 0，事件目前没有发生。
- 1，事件目前处于捕获阶段，即处于从祖先节点向目标节点的传播过程中。
- 2，事件到达目标节点，即`Event.target`属性指向的那个节点。
- 3，事件处于冒泡阶段，即处于从目标节点向祖先节点的反向传播过程中。

##### Event.cancelable

`Event.cancelable`属性返回一个布尔值，表示事件是否可以取消。该属性为只读属性，一般用来了解 Event 实例的特性。

大多数浏览器的原生事件是可以取消的。比如，取消`click`事件，点击链接将无效。但是除非显式声明，`Event`构造函数生成的事件，默认是不可以取消的。

```js
var evt = new Event('foo');
evt.cancelable  // false
```

当`Event.cancelable`属性为`true`时，调用`Event.preventDefault()`就可以取消这个事件，阻止浏览器对该事件的默认行为。

如果事件不能取消，调用`Event.preventDefault()`会没有任何效果。所以使用这个方法之前，最好用`Event.cancelable`属性判断一下是否可以取消。

##### Event.cancelBubble

`Event.cancelBubble`属性是一个布尔值，如果设为`true`，相当于执行`Event.stopPropagation()`，可以阻止事件的传播。

##### event.defaultPrevented

`Event.defaultPrevented`属性返回一个布尔值，表示该事件是否调用过`Event.preventDefault`方法。该属性只读。

```js
if (event.defaultPrevented) {
  console.log('该事件已经取消了');
}
```

##### Event.currentTarget

##### Event.target

事件发生以后，会经过捕获和冒泡两个阶段，依次通过多个 DOM 节点。因此，任意事件都有两个与事件相关的节点，一个是事件的原始触发节点（`Event.target`），另一个是事件当前正在通过的节点（`Event.currentTarget`）。前者通常是后者的后代节点。

`Event.currentTarget`属性返回事件当前所在的节点，即事件当前正在通过的节点，也就是当前正在执行的监听函数所在的那个节点。随着事件的传播，这个属性的值会变。

`Event.target`属性返回原始触发事件的那个节点，即事件最初发生的节点。这个属性不会随着事件的传播而改变。

事件传播过程中，不同节点的监听函数内部的`Event.target`与`Event.currentTarget`属性的值是不一样的。

```js
// HTML 代码为
// <p id="para">Hello <em>World</em></p>
function hide(e) {
  // 不管点击 Hello 或 World，总是返回 true
  console.log(this === e.currentTarget);

  // 点击 Hello，返回 true
  // 点击 World，返回 false
  console.log(this === e.target);
}

document.getElementById('para').addEventListener('click', hide, false);
```

`e.target`总是指向原始点击位置的那个节点。

##### Event.type

`Event.type`属性返回一个字符串，表示事件类型。事件的类型是在生成事件的时候指定的。该属性只读。

```js
var evt = new Event('foo');
evt.type // "foo"
```

##### Event.timeStamp

`Event.timeStamp`属性返回一个毫秒时间戳，表示事件发生的时间。它是相对于网页加载成功开始计算的。

```js
var evt = new Event('foo');
evt.timeStamp // 3683.6999999995896
```

##### Event.isTrusted

`Event.isTrusted`属性返回一个布尔值，表示该事件是否由真实的用户行为产生。比如，用户点击链接会产生一个`click`事件，该事件是用户产生的；`Event`构造函数生成的事件，则是脚本产生的。

```js
var evt = new Event('foo');
evt.isTrusted // false
```

##### Event.detail

`Event.detail`属性只有浏览器的 UI （用户界面）事件才具有。该属性返回一个数值，表示事件的某种信息。具体含义与事件类型相关。

比如，对于`click`和`dblclick`事件，`Event.detail`是鼠标按下的次数（`1`表示单击，`2`表示双击，`3`表示三击）；对于鼠标滚轮事件，`Event.detail`是滚轮正向滚动的距离，负值就是负向滚动的距离，返回值总是3的倍数。

#### 实例方法

##### Event.preventDefault() 

`Event.preventDefault`方法取消浏览器对当前事件的默认行为。

比如点击链接后，浏览器默认会跳转到另一个页面，使用这个方法以后，就不会跳转了；

再比如，按一下空格键，页面向下滚动一段距离，使用这个方法以后也不会滚动了。

该方法生效的前提是，事件对象的`cancelable`属性为`true`，如果为`false`，调用该方法没有任何效果。

注意，该方法只是取消事件对当前元素的默认影响，**不会阻止事件的传播**。

如果要阻止传播，可以使用`stopPropagation()`或`stopImmediatePropagation()`方法。

##### Event.stopPropagation()

`stopPropagation`方法阻止事件在 DOM 中继续传播，防止再触发定义在别的节点上的监听函数，但是不包括在当前节点上其他的事件监听函数。

```js
function stopEvent(e) {
  e.stopPropagation();
}

el.addEventListener('click', stopEvent, false);
```

上面代码中，`click`事件将不会进一步冒泡到`el`节点的父节点。

##### Event.stopImmediatePropagation()

`Event.stopImmediatePropagation`方法阻止同一个事件的其他监听函数被调用，不管监听函数定义在当前节点还是其他节点。也就是说，该方法阻止事件的传播，比`Event.stopPropagation()`更彻底。

如果同一个节点对于同一个事件指定了多个监听函数，这些函数会根据添加的顺序依次调用。只要其中有一个监听函数调用了`Event.stopImmediatePropagation`方法，其他的监听函数就不会再执行了。

```javascript
function l1(e){
  e.stopImmediatePropagation();
}

function l2(e){
  console.log('hello world');
}

el.addEventListener('click', l1, false);
el.addEventListener('click', l2, false);
```

上面代码在`el`节点上，为`click`事件添加了两个监听函数`l1`和`l2`。由于`l1`调用了`event.stopImmediatePropagation`方法，所以`l2`不会被调用。

##### Event.composedPath()

`Event.composedPath()`返回一个数组，成员是事件的最底层节点和依次冒泡经过的所有上层节点。

```js
// HTML 代码如下
// <div>
//   <p>Hello</p>
// </div>
var div = document.querySelector('div');
var p = document.querySelector('p');

div.addEventListener('click', function (e) {
  console.log(e.composedPath());
}, false);
// [p, div, body, html, document, Window]
```

上面代码中，`click`事件的最底层节点是`p`，向上依次是`div`、`body`、`html`、`document`、`Window`。

### 鼠标事件	

#### 种类

鼠标事件主要有下面这些，所有事件都继承了`MouseEvent`接口。

##### （1）点击事件

鼠标点击相关的有四个事件。

- `click`：按下鼠标（通常是按下主按钮）时触发。
- `dblclick`：在同一个元素上双击鼠标时触发。
- `mousedown`：按下鼠标键时触发。
- `mouseup`：释放按下的鼠标键时触发。

`click`事件可以看成是两个事件组成的：用户在同一个位置先触发`mousedown`，再触发`mouseup`。因此，触发顺序是，`mousedown`首先触发，`mouseup`接着触发，`click`最后触发。

双击时，`dblclick`事件则会在`mousedown`、`mouseup`、`click`之后触发。

##### （2）移动事件

鼠标移动相关的有五个事件。

- `mousemove`：当鼠标在一个节点内部移动时触发。当鼠标持续移动时，该事件会连续触发。为了避免性能问题，建议对该事件的监听函数做一些限定，比如限定一段时间内只能运行一次。
- `mouseenter`：鼠标进入一个节点时触发，进入子节点不会触发这个事件（详见后文）。
- `mouseover`：鼠标进入一个节点时触发，进入子节点会再一次触发这个事件（详见后文）。
- `mouseout`：鼠标离开一个节点时触发，离开父节点也会触发这个事件（详见后文）。
- `mouseleave`：鼠标离开一个节点时触发，离开父节点不会触发这个事件（详见后文）。

`mouseover`事件和`mouseenter`事件，都是鼠标进入一个节点时触发。两者的区别是，`mouseenter`事件只触发一次，而只要鼠标在节点内部移动，`mouseover`事件会在子节点上触发多次。

```js
/* HTML 代码如下
 <ul>
   <li>item 1</li>
   <li>item 2</li>
   <li>item 3</li>
 </ul>
*/

var ul = document.querySelector('ul');

// 进入 ul 节点以后，mouseenter 事件只会触发一次
// 以后只要鼠标在节点内移动，都不会再触发这个事件
// event.target 是 ul 节点
ul.addEventListener('mouseenter', function (event) {
  event.target.style.color = 'purple';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);

// 进入 ul 节点以后，只要在子节点上移动，mouseover 事件会触发多次
// event.target 是 li 节点
ul.addEventListener('mouseover', function (event) {
  event.target.style.color = 'orange';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);
```

上面代码中，在父节点内部进入子节点，不会触发`mouseenter`事件，但是会触发`mouseover`事件。

`mouseout`事件和`mouseleave`事件，都是鼠标离开一个节点时触发。两者的区别是，在父元素内部离开一个子元素时，`mouseleave`事件不会触发，而`mouseout`事件会触发。

```js
/* HTML 代码如下
 <ul>
   <li>item 1</li>
   <li>item 2</li>
   <li>item 3</li>
 </ul>
*/

var ul = document.querySelector('ul');

// 先进入 ul 节点，然后在节点内部移动，不会触发 mouseleave 事件
// 只有离开 ul 节点时，触发一次 mouseleave
// event.target 是 ul 节点
ul.addEventListener('mouseleave', function (event) {
  event.target.style.color = 'purple';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);

// 先进入 ul 节点，然后在节点内部移动，mouseout 事件会触发多次
// event.target 是 li 节点
ul.addEventListener('mouseout', function (event) {
  event.target.style.color = 'orange';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);
```

上面代码中，在父节点内部离开子节点，不会触发`mouseleave`事件，但是会触发`mouseout`事件。

##### （3）其他事件

- `contextmenu`：按下鼠标右键时（上下文菜单出现前）触发，或者按下“上下文”菜单键时触发。
- `wheel`：滚动鼠标的滚轮时触发，该事件继承的是`WheelEvent`接口。

#### MouseEvent 接口

`MouseEvent`接口代表了鼠标相关的事件，单击（click）、双击（dblclick）、松开鼠标键（mouseup）、按下鼠标键（mousedown）等动作，所产生的事件对象都是`MouseEvent`实例。此外，滚轮事件和拖拉事件也是`MouseEvent`实例。

`MouseEvent`接口继承了`Event`接口，所以拥有`Event`的所有属性和方法，并且还提供鼠标独有的属性和方法。

浏览器原生提供一个`MouseEvent()`构造函数，用于新建一个`MouseEvent`实例。

```js
var event = new MouseEvent(type, options);
```

`MouseEvent()`构造函数接受两个参数。第一个参数是字符串，表示事件名称；第二个参数是一个事件配置对象，该参数可选。除了`Event`接口的实例配置属性，该对象可以配置以下属性，所有属性都是可选的。

- `screenX`：数值，鼠标相对于屏幕的水平位置（单位像素），默认值为0，设置该属性不会移动鼠标。

- `screenY`：数值，鼠标相对于屏幕的垂直位置（单位像素），其他与`screenX`相同。

- `clientX`：数值，鼠标相对于程序窗口的水平位置（单位像素），默认值为0，设置该属性不会移动鼠标。

- `clientY`：数值，鼠标相对于程序窗口的垂直位置（单位像素），其他与`clientX`相同。

- `ctrlKey`：布尔值，是否同时按下了 Ctrl 键，默认值为`false`。

- `shiftKey`：布尔值，是否同时按下了 Shift 键，默认值为`false`。

- `altKey`：布尔值，是否同时按下 Alt 键，默认值为`false`。

- `metaKey`：布尔值，是否同时按下 Meta 键，默认值为`false`。

- `button`：数值，表示按下了哪一个鼠标按键，默认值为`0`，表示按下主键（通常是鼠标的左键）或者当前事件没有定义这个属性；`1`表示按下辅助键（通常是鼠标的中间键），`2`表示按下次要键（通常是鼠标的右键）。

- `buttons`：数值，表示按下了鼠标的哪些键，是一个三个比特位的二进制值，默认为`0`（没有按下任何键）。`1`（二进制`001`）表示按下主键（通常是左键），`2`（二进制`010`）表示按下次要键（通常是右键），`4`（二进制`100`）表示按下辅助键（通常是中间键）。因此，如果返回`3`（二进制`011`）就表示同时按下了左键和右键。

- `relatedTarget`：节点对象，表示事件的相关节点，默认为`null`。`mouseenter`和`mouseover`事件时，表示鼠标刚刚离开的那个元素节点；`mouseout`和`mouseleave`事件时，表示鼠标正在进入的那个元素节点。

#### MouseEvent 接口的实例属性

##### MouseEvent.altKey

##### MouseEvent.ctrlKey

##### MouseEvent.metaKey

##### MouseEvent.shiftKey

`MouseEvent.altKey`、`MouseEvent.ctrlKey`、`MouseEvent.metaKey`、`MouseEvent.shiftKey`这四个属性都返回一个布尔值，表示事件发生时，是否按下对应的键。它们都是只读属性。

- `altKey`属性：Alt 键
- `ctrlKey`属性：Ctrl 键
- `metaKey`属性：Meta 键（Mac 键盘是一个四瓣的小花，Windows 键盘是 Windows 键）
- `shiftKey`属性：Shift 键

```js
// HTML 代码如下
// <body onclick="showKey(event)">
function showKey(e) {
  console.log('ALT key pressed: ' + e.altKey);
  console.log('CTRL key pressed: ' + e.ctrlKey);
  console.log('META key pressed: ' + e.metaKey);
  console.log('SHIFT key pressed: ' + e.shiftKey);
}
```

上面代码中，点击网页会输出是否同时按下对应的键。

##### MouseEvent.button

`MouseEvent.button`属性返回一个数值，表示事件发生时按下了鼠标的哪个键。该属性只读。

- 0：按下主键（通常是左键），或者该事件没有初始化这个属性（比如`mousemove`事件）。
- 1：按下辅助键（通常是中键或者滚轮键）。
- 2：按下次键（通常是右键）。

```js
// HTML 代码为
// <button onmouseup="whichButton(event)">点击</button>
var whichButton = function (e) {
  switch (e.button) {
    case 0:
      console.log('Left button clicked.');
      break;
    case 1:
      console.log('Middle button clicked.');
      break;
    case 2:
      console.log('Right button clicked.');
      break;
    default:
      console.log('Unexpected code: ' + e.button);
  }
}
```

##### MouseEvent.buttons

`MouseEvent.buttons`属性返回一个三个比特位的值，表示同时按下了哪些键。它用来处理同时按下多个鼠标键的情况。该属性只读。

- 1：二进制为`001`（十进制的1），表示按下左键。
- 2：二进制为`010`（十进制的2），表示按下右键。
- 4：二进制为`100`（十进制的4），表示按下中键或滚轮键。

同时按下多个键的时候，每个按下的键对应的比特位都会有值。比如，同时按下左键和右键，会返回3（二进制为011）。

##### MouseEvent.clientX

##### MouseEvent.clientY

`MouseEvent.clientX`属性返回鼠标位置相对于浏览器窗口左上角的水平坐标（单位像素），`MouseEvent.clientY`属性返回垂直坐标。这两个属性都是只读属性。

```js
// HTML 代码为
// <body onmousedown="showCoords(event)">
function showCoords(evt){
  console.log(
    'clientX value: ' + evt.clientX + '\n' +
    'clientY value: ' + evt.clientY + '\n'
  );
}
```

这两个属性还分别有一个别名`MouseEvent.x`和`MouseEvent.y`。

##### MouseEvent.movementX

##### MouseEvent.movementY

`MouseEvent.movementX`属性返回当前位置与上一个`mousemove`事件之间的水平距离（单位像素）。数值上，它等于下面的计算公式。

```js
currentEvent.movementX = currentEvent.screenX - previousEvent.screenX
```

`MouseEvent.movementY`属性返回当前位置与上一个`mousemove`事件之间的垂直距离（单位像素）。数值上，它等于下面的计算公式。

```js
currentEvent.movementY = currentEvent.screenY - previousEvent.screenY。
```

这两个属性都是只读属性。

##### MouseEvent.screenX

##### MouseEvent.screenY

`MouseEvent.screenX`属性返回鼠标位置相对于屏幕左上角的水平坐标（单位像素），`MouseEvent.screenY`属性返回垂直坐标。这两个属性都是只读属性。

```js
// HTML 代码如下
// <body onmousedown="showCoords(event)">
function showCoords(evt) {
  console.log(
    'screenX value: ' + evt.screenX + '\n',
    'screenY value: ' + evt.screenY + '\n'
  );
}
```

##### MouseEvent.offsetX

##### MouseEvent.offsetY

`MouseEvent.offsetX`属性返回鼠标位置与目标节点左侧的`padding`边缘的水平距离（单位像素），`MouseEvent.offsetY`属性返回与目标节点上方的`padding`边缘的垂直距离。这两个属性都是只读属性。

```js
/* HTML 代码如下
  <style>
    p {
      width: 100px;
      height: 100px;
      padding: 100px;
    }
  </style>
  <p>Hello</p>
*/
var p = document.querySelector('p');
p.addEventListener(
  'click',
  function (e) {
    console.log(e.offsetX);
    console.log(e.offsetY);
  },
  false
);
```

上面代码中，鼠标如果在`p`元素的中心位置点击，会返回`150 150`。因此中心位置距离左侧和上方的`padding`边缘，等于`padding`的宽度（100像素）加上元素内容区域一半的宽度（50像素）。

##### MouseEvent.pageX

##### MouseEvent.pageY

`MouseEvent.pageX`属性返回鼠标位置与文档左侧边缘的距离（单位像素），`MouseEvent.pageY`属性返回与文档上侧边缘的距离（单位像素）。它们的返回值都包括文档不可见的部分。这两个属性都是只读。

```js
/* HTML 代码如下
  <style>
    body {
      height: 2000px;
    }
  </style>
*/
document.body.addEventListener(
  'click',
  function (e) {
    console.log(e.pageX);
    console.log(e.pageY);
  },
  false
);
```

上面代码中，页面高度为2000像素，会产生垂直滚动条。滚动到页面底部，点击鼠标输出的`pageY`值会接近2000。

##### MouseEvent.relatedTarget

`MouseEvent.relatedTarget`属性返回事件的相关节点。对于那些没有相关节点的事件，该属性返回`null`。该属性只读。

下表列出不同事件的`target`属性值和`relatedTarget`属性值义。

| 事件名称   | target 属性    | relatedTarget 属性 |
| ---------- | -------------- | ------------------ |
| focusin    | 接受焦点的节点 | 丧失焦点的节点     |
| focusout   | 丧失焦点的节点 | 接受焦点的节点     |
| mouseenter | 将要进入的节点 | 将要离开的节点     |
| mouseleave | 将要离开的节点 | 将要进入的节点     |
| mouseout   | 将要离开的节点 | 将要进入的节点     |
| mouseover  | 将要进入的节点 | 将要离开的节点     |
| dragenter  | 将要进入的节点 | 将要离开的节点     |
| dragexit   | 将要离开的节点 | 将要进入的节点     |

```js
/*
  HTML 代码如下
  <div id="outer" style="height:50px;width:50px;border:1px solid black;">
    <div id="inner" style="height:25px;width:25px;border:1px solid black;"></div>
  </div>
*/

var inner = document.getElementById('inner');
inner.addEventListener('mouseover', function (event) {
  console.log('进入' + event.target.id + ' 离开' + event.relatedTarget.id);
}, false);
inner.addEventListener('mouseenter', function (event) {
  console.log('进入' + event.target.id + ' 离开' + event.relatedTarget.id);
});
inner.addEventListener('mouseout', function (event) {
  console.log('离开' + event.target.id + ' 进入' + event.relatedTarget.id);
});
inner.addEventListener("mouseleave", function (event){
  console.log('离开' + event.target.id + ' 进入' + event.relatedTarget.id);
});

// 鼠标从 outer 进入inner，输出
// 进入inner 离开outer
// 进入inner 离开outer

// 鼠标从 inner进入 outer，输出
// 离开inner 进入outer
// 离开inner 进入outer
```