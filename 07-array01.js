// 数组作为一个最基础的一维数据机构，在各种编程语言中都充当着至关重要的角色，你很难想象没有数组的编程语言会是什么模样。特别是JavaScript,
// 它天生的灵活性，又进一步发挥了数组的特长，丰富了数组的使用场景。可以毫不夸张地说，不深入地了解数组，就不足以写好JavaScript。
// 随着前端框架的不断演进，React 和 Vue 等 MVVM 框架的流行，数据更新的同时视图也会随之更新。在通过前端框架实现大量的业务代码中，开发者
// 都会用数组来进行数据的存储和各种“增删改查”等操作，从而实现对应前端视图层的更新。可见熟练掌握数组各种方法，并深入了解数组是很有必要的。

// Array 的构造器
// Array 构造器用于创建一个新的数组。通常，我们推荐使用对象字面量的方式创建一个数组，例如 var a = [] 就是一个比较好的写法。但是，总有
// 对象字面量表述乏力的时候，比如，我想创建一个长度为6的空数组，用对象字面量的方式是无法创建的，因此只能写成下述代码这样。
// 使用 Array 构造器，可以自定义长度
var a = Array(6); // [empty × 6]
// 使用对象字面量
var b = [];
b.length = 6; // [undefined × 6]
// Array 构造器根据参数长度的不同，有如下两种不同的处理方式：
// new Array(arg1, arg2, ...),参数长度为0或长度大于等于2时，传入的参数将按照顺序依次成为新数组的第0至第N项（参数长度为0时，返回空数组）；
// new Array(len),当len不是数值时，处理同上，返回一个只包含len元素一项的数组；当len为数值时，len最大不能超过32位无符号整型，即需要小于2的
// 32次方（len 最大为 Math.pow(2, 32)），否则将抛出 RangeError。

// ES6 新增的构造方法：Array.of 和 Array.from
// Array.of
// Array.of 用于将参数依次转化为数组中的一项，然后返回这个新数组，而不管这个参数是数字还是其他。它基本上与Array构造器功能一致，唯一的区别就在
// 单个数字参数的处理上。
Array.of(8.0);
Array(8.0);
Array.of(8.0, 5);
Array(8.0, 5);
Array.of('8');
Array('8');
// Array.from
// Array.form 的设计初衷是快速便捷地基于其他对象创建新数组，准确来说就是从一个类似数组的可迭代对象中创建一个新的数组实例。其实就是，只要一个
// 对象有迭代器，Array.from 就能把它变成一个数组（注意：是返回新的数组，不改变原对象）。
// 从语法上看，Array.from 拥有3个参数：
// 1.类似数组的对象，必选
// 2.加工函数，新生成的数组会经过该函数的加工再返回；
// 3.this作用域，表示加工函数执行时this的值。
var obj = {0: 'a', 1: 'b', 2: 'c', length: 3};
Array.from(obj, function(value, index) {
    console.log(value, index, this, arguments.length);
    return value.repeat(3); // 必须指定返回值，否则返回 undefined
}, obj);
// 通过 Array.from 这个方法可以自己定义加工函数的处理方式，从而返回想要得到的值；如果不确定返回值，则会返回undefined，最终生成的也是一个
// 包含若干个undefined元素的空数组。
// 实际上，如果这里不指定 this 的话，加工函数完全可以是一个箭头函数。上述代码可以简写为如下形式。
Array.from(obj, value => value.repeat(3));
// 除了上述obj对象以外，拥有迭代器的对象还包括String、Set、Map等，Array.form 统统可以处理。
Array.from('abc'); // ['a', 'b', 'c']
Array.from(new Set(['abc', 'def'])); // ['abc', 'def']
Array.from(new Map([[1, 'ab'], [2, 'de']]));

// Array 的判断
// Array.isArray 用来判断一个变量是否为数组类型。
// 在 ES6 提供该方法之前，我们至少有如下5种方式去判断一个变量是否为数组。
var a = [];
a instanceof Array; // 1.基于instanceof
a.constructor === Array; // 2.基于constructor
Array.prototype.isPrototypeOf(a); // 3.基于Array.prototype.isPrototypeOf
Object.getPrototypeOf(a) === Array.prototype; // 4.基于getPrototypeOf
Object.prototype.toString.apply(a) === '[object Array]'; // 5.基于Object.prototype.toString
// ES6 之后新增了一个Array.isArray的方法，能直接判断数组类型是否为数组，但是如果 isArray 不存在，那么 Array.isArray 的 polyfill
// 通常可以这样写：
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// 改变自身的方法
// 基于 ES6，会改变自身值的方法一共有9个，分别为 pop、push、reverse、shift、sort、splice、unshift,以及两个 ES6 新增的方法
// copyWithin 和 fill。
// pop方法
var array = ['cat', 'dog', 'cow', 'chicken', 'mouse'];
var item = array.pop();
console.log(array);
console.log(item);
// push方法
var array = ['football', 'basketball', 'badminton'];
var i = array.push('golfball');
console.log(array);
console.log(i); // 4
// reverse方法
var array = [1, 2, 3, 4, 5];
var array2 = array.reverse();
console.log(array);
console.log(array2 === array);
// shift方法
var array = [1, 2, 3, 4, 5];
var item = array.shift();
console.log(array);
console.log(item);
// unshift方法
var array = ['red', 'green', 'blue'];
var length = array.unshift('yellow');
console.log(array);
console.log(length);
// sort方法
var array = ['apple', 'Boy', 'Cat', 'dog'];
var array2 = array.sort();
console.log(array);
console.log(array2 === array);
// splice方法
var array = ['apple', 'boy'];
var splices = array.splice(1, 1);
console.log(array);
console.log(splices);
// copyWithin方法
var array = [1, 2, 3, 4, 5];
var array2 = array.copyWithin(0, 3);
console.log(array === array2, array2); // true [4, 5, 3, 4, 5]
// fill方法
var array = [1, 2, 3, 4, 5];
var array2 = array.fill(10, 0, 3);
console.log(array === array2, array2);
// leetcode88.合并两个有序数组
var merge = function(nums1, m, nums2, n) {
    nums1.splice(m);
    nums2.splice(n);
    nums1.push(...nums2);
    nums1.sort((a, b) => a - b);
};

// 不改变自身的方法
// 基于 ES7 ，不会改变自身的方法也有9个，分别为 concat、join、slice、toString、toLocaleString、indexOf、lastIndexOf、
// 未形成标准的 toSource，以及 ES7 新增的方法 includes。
// concat方法
var array = [1, 2, 3];
var array2 = array.concat(4, [5, 6], [7, 8, 9]);
console.log(array2);
console.log(array); // 原数组并未被修改
// join方法
var array = ['We', 'are', 'Chinese'];
console.log(array.join());
console.log(array.join('+'));
// slice方法
var array = ['one', 'two', 'three', 'four', 'five'];
console.log(array.slice());
console.log(array.slice(2, 3));
// toString方法
var array = ['Jan', 'Feb', 'Mar', 'Apr'];
var str = array.toString();
console.log(str);
// toLocaleString方法
var array = [{name: 'zz'}, 123, 'abc', new Date()];
var str = array.toLocaleString();
console.log(str); // [object Object],123,abc,2021/8/2 上午11:32:03
// indexOf方法
var array = ['abc', 'def', 'ghi', '123'];
console.log(array.indexOf('def'));
// includes方法
var array = [-0, 1, 2];
console.log(array.includes(+0));
console.log(array.includes(1));
var array = [NaN];
console.log(array.includes(NaN));
// includes方法需要注意的是，如果元素中有 0，那么在判断过程中不论是+0还是-0都会判断为true，这里的includes忽略了+0和-0。
// 另外还有一个值得强调的是slice不改变自身，而splice会改变自身,注意不要记错了。
// 此外，lastIndexOf 和 indexOf 基本功能差不多，不过 lastIndexOf是从后面寻找元素的下标；而toSource方法还未形成标准。

// 数组遍历的方法
// 基于 ES6，不会改变自身的遍历方法一共有12个，分别为 forEach、every、some、filter、map、reduce、reduceRight，以及
// ES6 新增的方法 entries、find、findIndex、keys、values。
// forEach方法
var array = [1, 3, 5];
var obj = { name: 'cc' };
var sReturn = array.forEach(function(value, index, array) {
    array[index] = value;
    console.log(this.name); // cc被打印了三次，this指向obj
}, obj);
console.log(array);
console.log(sReturn); // undefined, 可见返回值为undefined
// every方法
var o = {0: 10, 1: 8, 2: 25, length: 3};
var bool = Array.prototype.every.call(o, function(value, index, obj) {
    return value >= 8;
}, o);
console.log(bool);
// some方法
var array = [18, 9, 10, 35, 80];
var isExist = array.some(function(value, index, array) {
    return value > 20;
});
console.log(isExist);
// map方法
var array = [18, 9, 10, 35, 80];
array.map(item => item + 1);
console.log(array);
// filter方法
var array = [18, 9, 10, 35, 80];
var array2 = array.filter(function(value, index, array) {
    return value > 20;
});
console.log(array2);
// reduce方法
var array = [1, 2, 3, 4];
var s = array.reduce(function(previousValue, value, index, array) {
    return previousValue * value;
}, 1);
console.log(s);
// ES6写法更加简洁
array.reduce((p, v) => p * v);
// reduceRight方法（和reduce的区别就是从后往前累计）
var array = [1, 2, 3, 4];
array.reduceRight((p, v) => p * v);
// entries方法
var array = ['a', 'b', 'c'];
var iterator = array.entries();
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value); // undefined,迭代器处于数组末尾时，再迭代就会返回undefined
// find & findIndex方法
var array = [1, 3, 5, 7, 8, 9, 10];
function f(value, index, array) {
    return value % 2 === 0; // 返回偶数
}
function f2(value, index, array) {
    return value > 20;
}
console.log(array.find(f));
console.log(array.find(f2));
console.log(array.findIndex(f));
console.log(array.findIndex(f2));
// keys方法
[...Array(10).keys()];
[...new Array(10).keys()];
// values方法
var array = ['abc', 'xyz'];
var iterator = array.values();
console.log(iterator.next().value);
console.log(iterator.next().value);
// 其中，要注意有些遍历方法不会返回处理之后的数组，比如forEach;有些方法会返回处理之后的数组，比如filter。
// reduce方法也需要重点关注，其参数复杂且多，通常一些复杂的逻辑处理，其实使用reduce很容易就可以解决。我们
// 重点看一下，reduce 到底能解决什么问题呢？先看下 reduce 的两个参数。
// 首先是 callback(一个在数组的每一项中调用的函数，接受四个参数)：
// 1.previousValue(上一次调用回调函数时的返回值，或者初始值)
// 2.currentValue(当前正在处理的数组元素)
// 3.currentIndex(当前正在处理的数组元素下标)
// 4.array(调用reduce()方法的数组)
// 然后是 initialValue (可选的初始值，作为第一次调用回调函数时传给 previousValue 的值)。
// 我们通过一个例子来说明reduce的功能到底有多么强大。
/* 题目：数组 arr = [1, 2, 3, 4] 求数组的和 */
// 第一种方法：
var arr = [1, 2, 3, 4];
var sum = 0;
arr.forEach(function(e) {sum += e;});
// 第二种方法：
var arr = [1, 2, 3, 4];
var sum = 0;
arr.map(function(obj) {sum += obj});
// 第三种方法
var arr = [1, 2, 3, 4];
arr.reduce(function(pre, cur) {return pre + cur});
// 从上面代码可以看出，我们分别用了 forEach 和 map 都能实现数组的求和，其中需要另外新定义一个变量sum，再进行累加求和，最后
// 再来看 sum 的值，而 reduce 不仅可以少定义一个变量，而且也会直接返回最后累加的结果，是不是问题就可以轻松解决了？
// 题目：var arr = [{name: 'brick1}, {name: 'brick2}, {name: brick3}]
// 希望最后返回arr里面的每个对象的name拼接数据为'brick1, brick2 & brick3',如何用 reduce 来实现呢？
var arr = [{ name: 'one' }, { name: 'two' }, { name: 'three' }];
arr.reduce(function(prev, current, index, array) {
    if (index === 0) {
        return current.name;
    } else if (index === array.length - 1) {
        return prev + ' & ' + current.name;
    } else {
        return prev + ', ' + current.name;
    }
}, '');
// 用 reduce 能很轻松地对数组进行遍历，然后进行一些复杂的累加处理操作即可。

// 总结：
// 数组的各方法之间存在很多共性，如下：
// 所有插入元素的方法，比如 push、unshift 一律返回数组新的长度；
// 所有删除元素的方法，比如 pop、shift、splice 一律返回删除的元素，或者返回删除的多个元素组成的数组；
// 部分遍历方法，比如 forEach、every、some、filter、map、find、findIndex,它们都包含function(value, index, array){}
// 和 thisArg 这样两个形参。