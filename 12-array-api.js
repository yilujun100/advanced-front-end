// 进阶练习：手写 JS 数组多个方法的底层实现
// 我们都知道，比较常用的数组方法有 push、pop、slice、map 和 reduce 等。围绕这几个常用的方法，并结合 V8 的
// 源代码手写这些方法的底层实现。
// 开始前请先回想一下：
// 1. reduce 方法里面的参数都是什么作用？
// 2. push 和 pop 的底层逻辑是什么样的呢？

// push 方法的底层实现
Array.prototype.push = function(...items) {
    let O = Object(this);
    let len = this.length >>> 0;
    let argCount = items.length >>> 0;
    // 2 ^ 53 - 1 为JS能表示的最大正整数
    if (len + argCount > 2 ** 53 - 1) {
        throw new TypeError('The number of array is over the max value');
    }
    for (let i = 0; i < argCount; i++) {
        O[len + i] = items[i];
    }
    let newLength = len + argCount;
    O.length = newLength;
    return newLength;
}
// 从上面的代码可以看出，关键点在于给数组本身循环添加新的元素 item，然后调整数组的长度 length 为最新的长度，即可完成 push
// 的底层实现。

// pop 方法的底层实现
Array.prototype.pop = function() {
    let O = Object(this);
    let len = this.length >>> 0;
    if (len === 0) {
        O.length = 0;
        return undefined;
    }
    len--;
    let value = O[len];
    delete O[len];
    O.length = len;
    return value;
}
// 其核心思路还是在于删除数组自身的最后一个元素，然后更新最新的长度，最后返回元素的值，即可达到想要的效果。另外就是当长度为 0 的时候，
// 如果执行 pop 操作，返回的是 undefined，需要做一下特殊处理。

// map 方法的底层实现
Array.prototype.map = function (callbackfn, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError("Cannot read property 'map' of null");
    }
    if (Object.prototype.toString.call(callbackfn) !== '[object Function]') {
        throw new TypeError(callbackfn + 'is not a function');
    }
    let O = Object(this);
    let T = thisArg;

    let len = O.length >>> 0;
    let A = new Array(len);
    for (let k = 0; k < len; k++) {
        if (k in O) {
            let kValue = O[k];
            // 一次传入this，当前项，当前索引，整个数组
            let mappedValue = callbackfn.call(T, kValue, k, O);
            A[k] = mappedValue;
        }
    }
    return A;
}
// map实现的思路是遍历数组，将处理过后的 mappedValue 赋值给一个新定义的数组 A，最后返回这个新数组 A,并不改变原数组的值。

// reduce 方法的底层实现
Array.prototype.reduce = function(callbackfn, initialValue) {
    // 异常处理，和 map 类似
    if (this === null || this === undefined) {
        throw new TypeError("Cannot read property 'reduce' of null");
    }
    // 处理回调类型异常
    if (Object.prototype.toString.call(callbackfn) !== '[object Function]') {
        throw new TypeError(callbackfn + ' is not a function');
    }
    let O = Object(this);
    let len = O.length >>> 0;
    let k = 0;
    let accumulator = initialValue; // reduce方法第二个参数作为累加器的初始值
    if (accumulator === undefined) {
        // 初始值不传的处理
        for (; k < len; k++) {
            if (k in O) {
                accumulator = O[k];
                k++;
                break;
            }
        }
    }
    for (; k < len; k++) {
        if (k in O) {
            accumulator = callbackfn.call(undefined, accumulator, O[k], O);
        }
    }
    return accumulator;
}

// V8 关于各种方法的实现源码地址：
// pop      https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L394
// push     https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L414
// map      https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L1036
// slice    https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L586
// filter   https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L1024