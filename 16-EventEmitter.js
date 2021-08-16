// 怎样轻松实现一个 EventEmitter?
// 虽然严格意义上来说，events 模块属于 Node.js 服务端的知识，但是由于大多数 Node.js 核心 API 构建用的是异步
// 事件驱动架构，因此通过学习这部分内容，能够自己实现一个 EventEmitter。
// 开始前先思考几个问题：
// 1. EventEmitter 采用什么样的设计模式?
// 2. EventEmitter 常用的 API 是怎样实现的?

// Events 基本介绍
// 你或多或少了解一些 Node.js 相关的知识，应该知道 Node.js 里面有很多模块，其中 events 就是比较重要的一个模块。
// Node.js 的 events 模块对外提供了一个 EventEmitter 对象，用于对 Node.js 中的事件进行统一管理。因为 Node.js
// 采用了事件驱动机制，而 EventEmitter 就是 Node.js 实现事件驱动的基础。在 EventEmitter 的基础上，Node.js 中
// 几乎所有的模块都继承了这个类，以实现异步事件驱动架构。
// 为了让你对此有一个大概的了解，我们先来看下 EventEmitter 的简单使用情况。
var events = require('events')
var eventEmitter = new events.EventEmitter()
eventEmitter.on('say', function(name) {
    console.log('Hello', name)
})
eventEmitter.emit('say', 'Jonh')
// 以上代码中，新定义的 eventEmitter 是接收 events.EventEmitter 模块 new 之后返回的一个实例，eventEmitter
// 的 emit 方法，发出 say 事件，通过 eventEmitter 的 on 方法监听，从而执行相应的函数。
// 这就是 Node.js 的 events 模块中 EventEmitter 的基本用法。

// 常用的 EventEmitter 模块的 API
// 除了上面的那段代码中已经使用的 on 和 emit 这两个 API，EventEmitter 还提供了其他的 API 方法。
// 方法名                                           方法描述
// addListener(event, listener)                    为指定事件添加一个监听器到监听器数组的尾部
// prependListener(event, listener)                与addListener相对，为指定事件添加一个监听器到监听器数组的头部
// on(event, listener)                             其实就是addListener的别名
// once(event, listener)                           为指定事件注册一个单次监听器，即监听器最多只会触发一次，触发后
//                                                 立刻解除该监听器
// removeListener(event, listener)                 移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器
// off(event, listener)                            removeListener的别名
// removeAllListener([event])                      移除所有事件的所有监听器，如果指定事件，则移除指定事件的所有监听器
// setMaxListeners(n)                              默认情况下，EventEmitters中如果添加的监听器超过10个就会输出
//                                                 告警信息；setMaxListeners函数用于提高监听器的默认限制的数量
// listeners(event)                                返回指定事件的监听器数组
// emit(event, [arg1], [arg2], [...])              按参数的顺序执行每个监听器，如果事件有注册监听返回true,否则返回fasle
// 除此之外，还有两个特殊的事件，不需要额外手动添加，下标所示的就是 Node.js 的 EventEmitter 模块自带的特殊事件。
// 事件名                       事件描述
// newListener          该事件在添加新事件监听器的时候触发
// removeListener       从指定监听器数组中删除一个监听器。需要注意的是，此操作将会改变处于被删监听器之后的那些监听器的索引
// 从上面的表格可以看出，Node.js的EventEmitter模块看起来方法很多且复杂，但通过仔细学习，其实其使用的实现并不困难。

// addListener 和 removeListener、on 和 off 方法对比
// addListener方法的作用是为指定事件添加一个监听器，其实和on方法实现的功能是一样的，on其实就是addListener方法的一个别名。
// 二者实现的作用是一样的，同时removeListener方法的作用是为移除某个事件的监听器，同样off也是removeListener的别名。
// 下面我们来看看addListener和removeListener的用法。
var events = require('events')
var emitter = new events.EventEmitter()
function hello1(name) {
    console.log('hello 1', name)
}
function hello2(name) {
    console.log('hello 2', name)
}
emitter.addListener('say', hello1)
emitter.addListener('say', hello2)
emitter.emit('say', 'John')
// 输出hello 1 John
// 输出hello 2 John
emitter.removeListener('say', hello1)
emitter.emit('say', 'John')
// 相应的，监听say事件的hello1事件被移除
// 只输出hello 2 John

// removeListener 和 removeAllListeners
// removeListener方法是指移除一个指定事件的某一个监听器，而removeAllListeners指的是移除某一个指定事件的全部监听器。
var events = require('events')
var emitter = new events.EventEmitter()
function hello1(name) {
    console.log('hello 1', name)
}
function hello2(name) {
    console.log('hello 2', name)
}
emitter.addListener('say', hello1)
emitter.addListener('say', hello2)
emitter.removeAllListeners('say')
emitter.emit('say', 'John')
// removeAllListeners移除了所有关于say事件的监听
// 因此没有任何输出

// on 和 once 方法区别
// on和once的区别是：on的方法对于某一指定事件添加的监听器可以持续不断地监听相应的事件；而once方法添加的监听器，监听一次后，
// 就会被消除。
var events = require('events')
var emitter = new events.EventEmitter()
function hello(name) {
    console.log('hello', name)
}
emitter.on('say', hello)
emitter.emit('say', 'John')
emitter.emit('say', 'Lily')
emitter.emit('say', 'Lucy')
// 会输出 hello John、 hello Lily、 hello Lucy，之后还要加也可以继续触发
emitter.once('see', hello)
emitter.emit('see', 'Tom')
// 只会输出一次 hello Tom
// 也就是说，on方法监听的事件，可以持续不断地被触发，而once方法只会触发一次。
// 讲到这里，你已经基本熟悉了Node.js下的EventEmitter的基本情况。那么如果在浏览器端，我们想实现一个EventEmitter方法，
// 应该用什么样的思路呢?

// 实现一个EventEmitter
// 从上面的讲解中可以看到，EventEmitter是在Node.js中events模块里封装的，那么在浏览器端实现一个这样的EventEmitter是否
// 可以呢?其实自己封装一个能在浏览器中跑的EventEmitter，并应用在你的业务代码中还是能带来不少方便地，它可以帮你实现自定义事件
// 的订阅和发布，从而提升业务开发的便利性。
// 那么结合上面介绍的内容，我们一起来实现一个基础版本的EventEmitter,包含基础的on、off、emit、once、alloff这几个方法。
function EventEmitter() {
    this.__events = {}
}
EventEmitter.VERSION = '1.0.0'
// 从上面的代码中可以看到，我们先初始化了一个内部的__events的对象，用来存放自定义事件，以及自定义事件的回调函数。
// 其次，我们来看看如何实现EventEmitter的on方法。
EventEmitter.prototype.on = function(eventName, listener) {
    if (!eventName || !listener) return
    // 判断回调的listener是否为函数
    if (!isValidListener(listener)) {
        throw new TypeError('listener must be a function')
    }
    var events = this.__events
    var listeners = events[eventName] = events[eventName] || []
    var listenerIsWrapped = typeof listener === 'object'
    // 不重复添加事件，判断是否有一样的
    if (indexOf(listeners, listener) === -1) {
        listeners.push(listenerIsWrapped ? listener : {
            listener: listener,
            once: false
        })
    }
    return this
}
// 判断是否是合法的listener
function isValidListener(listener) {
    if (typeof listener === 'function') {
        return true
    } else if (listener && typeof listener === 'object') {
        return isValidListener(listener.listener)
    } else {
        return false
    }
}
// 顾名思义，判断新增自定义事件是否存在
function indexOf(array, item) {
    var result = -1
    item = typeof item === 'object' ? item.listener : item
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i].listener === item) {
            result = i
            break
        }
    }
    return result
}
// 从上面的代码中可以看出，on方法的核心思路就是，当调用订阅一个自定义事件的时候，只要该事件通过校验合法之后，就把该自定义事件
// push到this.__events这个对象中存储，等需要触发的时候，则直接从通过获取__events中对应事件的listener回调函数，而后直接
// 执行该回调方法就能实现想要的效果。
EventEmitter.prototype.emit = function(eventName, args) {
    // 直接通过内部对象获取对应自定义事件的回调函数
    var listeners = this.__events[eventName]
    if (!listeners) return
    // 需要考虑多个listener的情况
    for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i]
        if (listener) {
            listener.listener.apply(this, args || [])
            // 给listener中once为true的进行特殊处理
            if (listener.once) {
                this.off(eventName, listener.listener)
            }
        }
    }
    return this
}
EventEmitter.prototype.off = function(eventName, listener) {
    var listeners = this.__events[eventName]
    if (!listeners) return
    var index
    for (var i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i] && listeners[i].listener === listener) {
            index = i
            break
        }
    }
    // off的关键
    if (typeof index !== 'undefined') {
        listeners.splice(index, 1, null)
    }
    return this
}
// 从上面的代码中可以看出emit的处理方式，其实就是拿到对应自定义事件进行apply执行，在执行过程中对于一开始once方法绑定
// 的自定义事件进行特殊的处理，当once为true的时候，再触发off方法对该自定义事件进行解绑，从而实现自定义事件一次执行的
// 效果。
EventEmitter.prototype.once = function(eventName, listener) {
    // 直接调用on方法，once参数传入true,待执行之后进行once处理
    return this.on(eventName, {
        listener: listener,
        once: true
    })
}
EventEmitter.prototype.allOff = function(eventName) {
    // 如果该eventName存在，则将其对应的listeners的数组直接清空
    if (eventName && this.__events[eventName]) {
        this.__events[eventName] = []
    } else {
        this.__events = {}
    }
}
// 从上面的代码中可以看到，once方法的本质还是调用on方法，只不过传入的参数区分和非一次执行的情况。当再次触发emit方法的时候，
// once绑定的执行一次之后再进行解绑。
// allOff方法也很好理解，其实就是对内部的__events对象进行清空，清空之后如果再次触发自定义事件，也就无法触发回调函数了。

// 总结：
// 现在，你可以回过头思考一下在开篇提到的问题：EventEmitter采用的是什么样的设计模式?其实通过上面的学习不难发现，EventEmiiter
// 采用的正是发布-订阅模式。
// 另外，观察者模式和发布订阅模式有些类似的地方，但是在细节方面还是有一些区别的，你要注意别把这两个模式搞混了。发布订阅模式其实
// 是观察者模式的一种变形，区别在于：发布订阅模式在观察者模式的基础上，在目标和观察者之间增加了一个调度中心。
// 但就浏览器端使用场景来说，其实也有运用同样的思路解决问题的工具，在Vue框架中不同组件之间的通讯里，有一种解决方案叫EventBus。
// 和EventEmitter的思路类似，它的基本用途是将EventBus作为组件传递数据的桥梁，所有组件共用相同的事件中心，可以向该中心注册
// 发送事件或接收事件，所有组件都可以收到通知，使用起来非常便利，其核心其实就是发布订阅模式的落地实现。