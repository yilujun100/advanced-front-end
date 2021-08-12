// JS 异步编程都有哪些方案？
// 我们在日常开发中都用过哪些 JS 异步编程的方式？总结起来无外乎有这几种：回调函数、事件监听、Promise、Generator、
// async/await，这几种 JS 的编程方式都是异步编程。回调函数方式是最早的 JS 异步编程的方式，后随着 ES 标准的发展，
// Promise、Generator 和 async/await 接连出现。
// 开始前请先回想一下：
// 1. 同步编程和异步编程的区别在哪里？
// 2. 回调地狱有哪些方法可以解决？

// 什么是同步？
// 所谓的同步就是在执行某段代码时，在该代码没有得到返回结果之前，其他代码暂时是无法执行的，但是一旦执行完成拿到返回值之后，
// 就可以执行其他代码了。换句话说，在此段代码执行完未返回结果之前，会阻塞之后的代码执行，这样的情况称为同步。

// 什么是异步？
// 所谓异步就是当某一代吗执行异步过程调用发出后，这段代码不会立刻得到返回结果。而是在异步调用发出之后，一般通过回调函数
// 处理这个调用之后拿到结果。异步调用发出后，不会影响阻塞后面的代码执行，这样的情形称为异步。

// JS 编程中为什么需要异步？
// 我们都知道 JavaScript 是单线程的，如果 JS 都是同步代码意味着什么呢？这样可能会造成阻塞，如果当前我们有一段代码需要执行时，
// 如果使用同步的方式，那么就会阻塞后面的代码执行；而如果使用异步则不会阻塞，我们不需要等待异步代码执行的返回结果，可以继续执行
// 该异步任务之后的代码逻辑。因此在 JS 编程中，会大量使用异步来进行编程。

// JS 异步编程方式发展历程
// 说完了异步编程的基本概念，下面我们按照时间顺序来看一下 JS 异步编程的实现方式。
// 回调函数
// 从历史发展的脉络来看，早些年为了实现 JS 的异步编程，一般都采用回调函数的方式，比如比较典型的事件的回调，或者用 setTimeout/
// setInterval 来实现一些异步编程的操作，但是使用回调函数来实现存在一个很常见的问题，那就是回调地狱。
fs.readFile(A, 'utf-8', function(err, data) {
    fs.readFile(B, 'utf-8', function(err, data) {
        fs.readFile(C, 'utf-8', function(err, data) {
            fs.readFile(D, 'utf-8', function(err, data) {
                // ...
            });
        });
    });
});
// 从上面的代码可以看出，其逻辑为先读取A文本内容，再根据A文本内容读取B，然后再根据B的内容读取C。为了实现这个业务逻辑，上面实现的
// 代码就很容易形成回调地狱。回调实现异步编程的场景也有很多，比如：
// 1. ajax 请求的回调
// 2. 定时器中的回调
// 3. 事件回调
// 4. Nodejs 中的一些方法回调
// 异步回调如果层级很少，可读性和代码的维护性暂时还是可以接受，一旦层级变多就会陷入回调地狱，上面这些异步编程的场景都会涉及回调地狱
// 的问题。下面我们来看一下针对上面这个业务场景，改成 Promise 来实现异步编程，会是什么样子的呢？

// Promise
// 为了解决回调地狱的问题，之后社区提出了 Promise 的解决方案，ES6 又将其写进了语言标准，采用 Promise 的实现方式在一定程度上解决了
// 回调地狱的问题。
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
read(A).then(data => {
    return read(B);
}).then(data => {
    return read(C);
}).then(data => {
    return read(D);
}).catch(reason => {
    console.log(reason);
});
// 从上面的代码可以看出，针对回调地狱进行这样的改进，可读性的确有一定的提升，优点是可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的
// 回调函数，但是 Promise 也存在一些问题，即便是使用 Promise 的链式调用，如果操作过多，其实并没有从根本上解决回调地狱的问题，只是换了
// 一种写法，可读性虽然有所提升，但是依旧很难维护。不过 Promise 又提供了一个 all 方法，对于这个业务场景的代码，用 all 来实现可能效果会更好。
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
// 通过 Promise.all 可以实现多个异步并行执行，同一时刻获取最终结果的问题
Promise.all([read(A), read(B), read(C)]).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});

// Generator
// Generator 也是一种异步编程解决方案，它最大的特点就是可以交出函数的执行权，Generator 函数可以看出是异步任务的容器，需要暂停的地方，
// 都用 yield 语法来标注。Generator 函数一般配合 yield 使用，Generator 函数最后返回的是迭代器。
function* gen() {
    let a = yield 111;
    console.log(a);
    let b = yield 222;
    console.log(b);
    let c = yield 333;
    console.log(c);
    let d = yield 444;
    console.log(d);
}
let t = gen();
t.next(1);
t.next(2);
t.next(3);
t.next(4);
t.next(5);
// 从上面的代码中可以看到输出结果，第一次的 next 虽然执行了但是并未输出结果，后面的每次执行 next 会把参数传入然后打印出来，等到最后一次
// next 对应的 yield 执行完之后，控制台会打印 “{value: undefined, done: true}” 的输出结果，标识该 Generator 函数已经执行完毕，
// 即 done：true。

// async/await
// ES6 之后 ES7 中又提出了新的异步解决方案：async/await，async 是 Generator 函数的语法糖，async/await 的优点是代码清晰
// （不像使用 Promise 的时候需要写很多 then 的方法链），可以处理回调地狱的问题。async/await 写起来使得 JS 的异步代码看起来像同步代码，
// 其实异步编程发展的目标就是让异步逻辑的代码看起来像同步一样容易理解。
function testWait() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log('testWait');
            resolve();
        }, 1000);
    });
}
async function testAwaitUse() {
    await testWait();
    console.log('hello');
    return 123;
    // 输出顺序：testWait，hello
    // 如果不使用await输出顺序：hello , testWait
}
console.log(testAwaitUse());
// 执行上面的代码，从结果中可以看出，在正常的执行顺序下，testWait 这个函数由于使用的是 setTimeout 的定时器，回调会在一秒之后执行，
// 但是由于执行到这里采用了 await 关键词，testAwaitUse 函数在执行的过程中需要等待 testWait 函数执行完成之后，再执行打印 hello 的操作。
// 但是如果去掉 await ，打印结果的顺序就会变化。
// 因此，async/await 不仅仅是 JS 的异步编程的一种方式，其可读性也接近于同步代码，让人更容易理解。