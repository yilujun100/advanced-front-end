// 如何理解 Generator、Async/await 等异步编程的语法糖？
// Generator 是 ES6 标准中的异步编程方式，而 async/await 是 ES7 标准中的。通过本讲的学习，能对这两种编程
// 方式有更深刻的理解。
// 开始前请先思考一下：
// 1. Generator 执行之后，最后返回的是什么？
// 2. async/await 的方式比 Promise 和 Generator 好在哪里？

// Generator 基本介绍
// Generator（生成器）是 ES6 的新关键词，学习起来比较晦涩难懂，那么什么是 Generator 函数呢？通俗来讲 Generator
// 是一个带星号的“函数”（它并不是真正的函数，下面的代码会验证），可以配合 yield 关键字来暂停或者执行函数。我们
// 来看一段使用 Generator 的代码
function* gen() {
    console.log('enter')
    let a = yield 1
    let b = yield (function() {return 2})()
    return 3
}
var g = gen() // 阻塞住，不会执行任何语句
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
// output:
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: true }
// { value: undefined, done: true }
// 结合上面的代码，我们分析一下 Generator 函数的执行情况。Generator 中配合使用 yield 关键词可以控制函数执行
// 的顺序，每当执行一次 next 方法，Generator 函数会执行到下一个存在 yield 关键词的位置。
// 总结下来，Generator 的执行有这几个关键点：
// 1. 调用 gen() 后，程序会阻塞住，不会执行任何语句。
// 2. 调用 g.next() 后，程序继续执行，直到遇到 yield 关键词时执行暂停。
// 3. 一直执行 next 方法，最后返回一个对象，共存在两个属性：value 和 done。

// yield 基本介绍
// yield 同样也是 ES6 的新关键词，配合 Generator 执行以及暂停。yield 关键词最后返回一个迭代器对象，该对象有
// value 和 done 两个属性，其中 done 属性代表返回值以及是否完成。yield 配合着 Generator,再同时使用 next 方法，
// 可以主动控制 Generator 执行进度。
// 下面我们看看多个 Generator 配合 yield 使用的情况
function* gen1() {
    yield 1
    yield* gen2()
    yield 4
}
function* gen2() {
    yield 2
    yield 3
}
var g = gen1()
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
// 从上面的代码中可以看出，使用 yield 关键词的话还可以配合着 Generator 函数嵌套使用，从而控制函数执行进度。这样对于 Generator 的使用，
// 以及最终函数的执行进度都可以很好地控制，从而形成符合你设想的执行顺序。即便 Generator 函数相互嵌套，也能通过调用 next 方法来按照进度
// 一步步执行。
// 那么讲到这里你可能会有几个疑惑，Generator 和异步编程有什么联系？怎么才可以把 Generator 函数按照顺序一次性执行完呢？
// 接着往下看，你就会明白了。

// thunk 函数介绍
// 直接说概念可能会有些晦涩，我们通过一段代码来了解一下什么是 thunk 函数，就拿判断数据类型来举例。
let isString = obj => {
    return Object.prototype.toString.call(obj) === '[object String]'
}
let isFunction = obj => {
    return Object.prototype.toString.call(obj) === '[object Function]'
}
let isArray = obj => {
    return Object.prototype.toString.call(obj) === '[object Array]'
}
// 可以看到，其中出现了非常多重复的数据类型判断逻辑，平常业务开发中类似的重复逻辑的场景也同样会有很多。我们将它们做一下封装。
let isType = type => {
    return obj => {
        return Object.prototype.toString.call(obj) === `[object ${type}]`
    }
}
// 那么封装之后我们可以这么来使用，从而来减少重复的逻辑代码
let isString = isType('String')
let isArray = isType('Array')
isString('123')
isArray([1, 2, 3])
// 相应的 isString 和 isArray 是由 isType 方法生产出来的函数，通过上面的方式来改造代码，明显简洁了不少。像 isType
// 这样的函数我们称为 thunk 函数，它的基本思路都是接收一定的参数，会生产出定制化的函数，最后使用定制化的函数去完成想要
// 实现的功能。
// 这样的函数在 JS 的编程过程中会遇到很多，尤其是你在阅读一些开源项目时，抽象度比较高的 JS 代码往往都会采用这样的方式。
// 那么请你想一下，Generator 和 thunk 函数的结合是否能为我们带来一定的便捷性呢？

// Generator 和 thunk 结合
// 下面我以文件操作的代码为例，看一下 Generator 和 thunk 的结合能够对异步操作产生什么样的效果。
const readFileThunk = filename => {
    return callback => {
        fs.readFile(filename, callback)
    }
}
const gen = function* () {
    const data1 = yield readFileThunk('1.txt')
    console.log(data1.toString())
    const data2 = yield readFileThunk('2.txt')
    console.log(data2.toString())
}
let g = gen()
g.next().value((err, data1) => {
    g.next(data1).value((err, data2) => {
        g.next(data2)
    })
})
// readFileThunk 就是一个 thunk 函数，上面的这种编程方式就让 Generator 和异步操作关联起来了。上面第三段
// 代码执行起来嵌套的情况还算简单，如果任务多起来，就会产生很多层的嵌套，可读性不强，因此我们有必要把执行的代码封装优化一下
function run(gen) {
    const next = (err, data) => {
        let res = gen.next(data)
        if (res.done) return
        res.value(next)
    }
    next()
}
run(g)
// 改造完之后，我们可以看到 run 函数和上面的执行效果其实是一样的。代码虽然只有几行，但其包含了递归的过程，解决了多层嵌套的问题，
// 并且完成了异步操作的一次性的执行效果。这就是通过 thunk 函数完成异步操作的情况

// Generator 和 Promise 结合
// 还是利用上面的输出文件的例子，对代码进行改造
// 最后包装成 Promise 对象进行返回
const readFilePromise = filename => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    }).then(res => res)
}
// 这块和上面 thunk 的方式一样
const gen = function* () {
    const data1 = yield readFilePromise('1.txt')
    console.log(data1.toString())
    const data2 = yield readFilePromise('2.txt')
    console.log(data2.toString())
}
let g = gen()
function run(gen) {
    const next = (err, data) => {
        let res = gen.next(data)
        if (res.done) return
        res.value.then(next)
    }
    next()
}
run(g)
// 从上面的代码可以看出，thunk 函数的方式和通过 Promise 方式执行效果本质上是一样的，只不过通过 Promise 的方式也可以配合
// Generator 函数实现同样的异步操作。

// co 函数库
// co 函数库是著名程序员 TJ 发布的一个小工具，用于处理 Generator 函数的自动执行。核心原理其实就是通过和 thunk 函数以及
// Promise 对象进行配合，包装成一个库。它使用起来非常简单，比如还是用上面那段代码，第三段代码就可以省略了，直接引用 co
// 函数，包装起来就可以使用了
const co = require('co')
let g = gen()
co(g).then(res => {
    console.log(res)
})
// 这段代码比较简单，几行就完成了之前写的递归的那些操作。那么为什么 co 函数库可以自动执行 Generator 函数，它的处理原理是什么呢？
// 1. 因为 Generator 函数就是一个异步操作的容器，它需要一种自动执行机制，co 函数接受 Generator 函数作为参数，并最后返回一个
// Promise 对象。
// 2. 在返回的 Promise 对象里面，co 先检查参数 gen 是否为 Generator 函数。如果是，就执行该函数；如果不是就返回，并将 Promise
// 对象的状态改为 resolved。
// 3. co 将 Generator 函数的内部指针对象的 next 方法，包装成 onFulfilled 函数。这主要是为了能够捕捉抛出的错误。
// 4. 关键的是 next 函数，它会反复调用自身。
// co源码库： https://github.com/tj/co/blob/master/index.js

// async/await 介绍
// JS 的异步编程从最开始的回调函数的方式，演化到使用 Promise 对象，再到 Generator+co 函数的方式，每次都有一些改变，但又让人觉得
// 不彻底，都需要理解底层运行机制。
// 而 async/await 被称为 JS 中异步终极解决方案，它既能够像 co+Generator 一样用同步的方式来书写异步代码，又得到底层的语法支持，
// 无须借助任何第三方库。
// 接下来，我们就从原理的角度来看看 async/await 这个语法糖背后到底做了哪些优化和改进，使得我们用起来会更加方便。还是按照上面
// Generator 和 Promise 结合的例子，使用 async/await 语法糖来进行改造
// readFilePromise 依旧返回 Promise 对象
const readFilePromise = filename => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    }).then(res => res)
}
// 这里把 Generator的 * 换成 async，把 yield 换成 await
const gen = async function() {
    const data1 = await readFilePromise('1.txt')
    console.log(data1.toString())
    const data2 = await readFilePromise('2.txt')
    console.log(data2.toString())
}
// 从上面的代码中可以看到，虽然我们简单地将 Generator 的 * 号换成了 async，把 yield 换成了 await，
// 但其实 async 的内部做了不少工作。我们根据 async 的原理详细拆解一下，看看它到底做了哪些工作。
// 总结下来，async 函数对 Generator 函数的改进，主要体现在以下三点:
// 1. 内置执行器：Generator 函数的执行必须靠执行器，因为不能一次性执行完成，所以之后才有了开源的 co 函数库。
// 但是，async 函数和正常的函数一样执行，也不用 co 函数库，也不用使用 next 方法，而 async 函数自带执行器，会自动执行。
// 2. 适用性更好：co 函数库有条件约束，yield 命令后面只能是 Thunk 函数或 Promise 对象，但是 async 函数的
// await 关键词后面，可以不受约束。
// 3. 可读性更好：async 和 await，比起使用 * 号和 yield，语义更清晰明了。
// 我们通过一段简单的代码来看下 async 返回的结果，是不是使用起来更方便
async function func() {
    return 100
}
console.log(func()) // Promise {<resolved>: 100}
// 从执行的结果可以看出，async 函数 func 最后返回的结果直接是 Promise 对象，比较方便让开发者继续往后处理。
// 而之前 Generator 并不会自动执行，需要通过 next 方法控制，最后返回的也并不是 Promise 对象，而是需要通过
// co 函数库来实现最后返回 Promise 对象。
// 这样看来，ES7 加入的 async/await 的确解决了之前的问题，使开发者在编程过程中更容易理解，语法更清晰，并且
// 也不用再单独引用 co 函数库了。因此用 async/await 写出的代码也更加优雅，相比于之前的 Promise 和 co+Generator
// 的方式更容易理解，上手成本也更低，不愧是 JS 异步的终极解决方案。

// 总结：
// 异步编程方法                     特点
// Generator                生成器函数配合着 yield 关键词来使用，不自动执行，需要执行 next 方法一步一步往下执行
// Generator+co             通过引入开源 co 函数库，实现异步编程，并且还能控制返回结果为Promise对象，方便后续继续操作，
//                          但是要求 yield 后面，只能是 thunk 函数或 Promise 对象
// async/await              ES7 引入的终极异步编程解决方案，不用引入其他任何库，对于await后面的类型无限制，可读性更好，容易理解