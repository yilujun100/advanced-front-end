// JavaScript 中的 apply、call 和 bind 方法是前端开发中相当重要的概念，并且与 this 的指向密切相关。
// 很多人对它们的理解还比较浅显，如果你想拥有扎实的 JavaScript 编程基础，那么必须要了解这些基础常用的方法。

// new 原理介绍
// new 关键词的主要作用就是执行一个构造函数、返回一个实例对象，在 new 的过程中，根据构造函数的情况，来
// 确定是否可以接受参数的传递。
// new 在生成实例的过程中进行了哪些步骤来实现？
// 创建一个新对象；
// 将构造函数的作用域赋给新对象（this 指向新对象）；
// 执行构造函数中的代码（为这个新对象添加属性）；
// 返回新对象。
function Person() {
    this.name = 'Jack'
    return 'tom'
}
var p = new Person()
console.log(p)
console.log(p.name)
// 可以看出，当构造函数中 return 的不是一个对象时，那么它还是会根据 new 关键词的执行逻辑，生成一个新的对象（绑定了最新this）,
// 最后返回出来。
// 因此我们总结一下：new 关键词执行之后总是会返回一个对象，要么是实例对象，要么是 return 语句指定的对象。

// call & apply & bind 原理介绍
// 先来了解一下这三个方法的基本情况，call、apply 和 bind 是挂在 Function 对象上的三个方法，调用这三个方法的必须是一个函数。
// 这三个方法共有的、比较明显的作用就是，都可以改变函数执行时上下文 this 指向。call 和 apply 的区别在于，传参的写法不同：
// call 方法接受的是一个参数列表，而 apply 方法接受的是一个包含多个参数的数组；而 bind 和这两个（call、apply）又不同，bind
// 虽然改变了函数执行时的 this 指向，但不是马上执行，而这两个（call、apply）是在改变了函数的 this 指向之后立马执行。
// 程序中：A对象有个 getName 的方法，B 对象也需要临时使用同样的方法，那么这时候我们是单独为 B 对象扩展一个方法，还是借用一下 A
// 对象的方法呢？当然是可以借用 A 对象的 getName 方法，既达到了目的，又节省重复定义，节约内存空间。
let a = {
    name: 'jack',
    getName: function(msg) {
        return msg + this.name
    }
}
let b = {
    name: 'lily'
}
console.log(a.getName('hello~'))
console.log(a.getName.call(b, 'hi~'))
console.log(a.getName.apply(b, ['hi~']))
let name = a.getName.bind(b, 'hello~')
console.log(name())
// 使用三种方式都可以达成我们想要的目标，即通过改变 this 的指向，让 b 对象可以直接使用 a 对象中的 getName 方法。

// 方法的使用场景
// 下面几种应用场景，你多加体会就可以发现它们的理念都是“借用”方法的思路。
// 判断数据类型
// 用 Object.prototype.toString 来判断类型是最合适的，借用它我们几乎可以判断所有类型的数据。
function getType(obj) {
    let type = typeof obj
    if (type !== 'object') {
        return type
    }
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
}
// 结合上面这段代码，以及在前面讲的 call 的方法的“借用”思路，那么判断数据类型就是借用了 Object 的原型链上的 toString
// 方法，最后返回用来判断传入的 obj 的字符串，来确定最后的数据类型。

// 类数组借用方法
// 类数组因为不是真正的数组，所以没有数组类型上自带的种种方法，所以我们就可以利用一些方法去借用数组的方法，比如借用数组的
// push 方法。
var arrayLike = {
    0: 'java',
    1: 'script',
    length: 2
}
Array.prototype.push.call(arrayLike, 'jack', 'lily')
console.log(typeof arrayLike) // 'object'
console.log(arrayLike) // { '0': 'java', '1': 'script', '2': 'jack', '3': 'lily', length: 4 }
// 从上面的代码可以看到，arrayLike 是一个对象，模拟数组的一个类数组。从数据类型上看，它是一个对象。用 typeof 来判断输出的
// 是 'object'，它自身是不会有数组的push方法的，这里我们就用call的方法来借用Array原型链上的push方法，可以实现一个类数组
// 的 push 方法，给 arrayLike 添加新的元素。

// 获取数组的最大/最小值
// 我们可以用apply来实现数组中判断最大/最小值，apply 直接传递数组作为调用方法的参数，也可以减少异步展开数组，可以直接使用
// Math.max、Math.min 来获取数组的最大值/最小值
let arr = [13, 6, 10, 11, 16]
const max = Math.max.apply(Math, arr)
const min = Math.min.apply(Math, arr)
console.log(max)
console.log(min)

// 继承
// 这些方法类似的应用场景还有很多，关键在于它们借用方法的理念。

// new 的实现
// 在执行 new 的过程中，new 被调用后大致做了哪几件事情
// 让实例可以访问到私有属性；
// 让实例可以访问构造函数原型（constructor.prototype）所在原型链上的属性；
// 构造函数返回的最后结果是引用数据类型。
function _new(ctor, ...args) {
    if (typeof ctor !== 'function') {
        throw 'ctor must be a function'
    }
    let obj = new Object()
    obj.__proto__ = Object.create(ctor.prototype)
    let res = ctor.apply(obj, [...args])

    let isObject = typeof res === 'object' && res !== null
    let isFunction = typeof res === 'function'
    return isObject || isFunction ? res : obj
}

// apply 和 call 的实现
Function.prototype.myCall = function(context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('Error: this must be a function');
    }
    context = context || window;
    context.fn = this; // this 即 f.myCall 的 f
    const result = eval('context.fn(...args)');
    delete context.fn;
    return result;
};
Function.prototype.myApply = function(context, args) {
    if (typeof this !== 'function') {
        throw new TypeError('Error: this must be a function');
    }
    context = context || window;
    context.fn = this;
    const result = eval('context.fn(...args)');
    delete context.fn;
    return result;
};

// bind 的实现
Function.prototype.myBind = function(context) {
    if (typeof this !== 'function') {
        throw new TypeError('Error: this must be a function');
    }
    const self = this; // this 即 f.myBind 的 f
    const args = [...arguments].slice(1);
    let fbound = function() {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }
    if (this.prototype) {
        fbound.prototype = Object.create(this.prototype);
    }
    return fbound;
};
// https://github.com/mqyqingfeng/Blog/issues/12