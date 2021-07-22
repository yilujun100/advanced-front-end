// 浅拷贝
// 方法一：Object.assign
/* let target = {}
let source = { a: { b: 1 } }
Object.assign(target, source)
console.log(target) */

/* let target = {}
let source = { a: { b: 1 } }
Object.assign(target, source)
console.log(target)
source.a.b = 10
console.log(source)
console.log(target) */
// 使用 Object.assign 方法有几点需要注意：
// 它不会拷贝对象的继承属性；
// 它不会拷贝对象的不可枚举的属性；
// 可以拷贝Symbol类型的属性
// 可以简单理解为：Object.assign 循环遍历原对象的属性，通过复制的方式将其赋值给目标对象的相应属性
/* let obj1 = { a: { b: 1 }, sym: Symbol(1) }
Object.defineProperty(obj1, 'innumerable', {
    value: '不可枚举属性',
    enumerable: false
})
let obj2 = {}
Object.assign(obj2, obj1)
obj1.a.b = 2
console.log('obj1', obj1)
console.log('obj2', obj2) */

// 方法二：扩展运算符方式
/* 对象的拷贝 */
/* let obj = { a: 1, b: { c: 1 } }
let obj2 = {...obj}
obj.a = 2
console.log(obj)
console.log(obj2)
obj.b.c = 2
console.log(obj)
console.log(obj2) */
/* 数组的拷贝 */
/* let arr = [1, 2, 3]
let newArr = [...arr] // 跟arr.slice()是一样的效果 */
// 扩展运算符 和 Object.assign 有同样的缺陷，也就是实现的浅拷贝的功能差不多，但是如果属性都是基本类型的值，
// 使用扩展运算符进行浅拷贝会更加方便。

// 方法三：concat 拷贝数组
// 数组的 concat 方法其实也是浅拷贝，所以连接一个含有引用类型的数组时，需要注意修改原数组中的元素的属性，
// 因为它会影响拷贝之后连接的数组。不过 concat 只能用于数组的浅拷贝，使用场景比较局限。
/* let arr = [1, 2, 3]
let newArr = arr.concat()
newArr[1] = 100
console.log(arr)
console.log(newArr) */

// 方法四：slice 拷贝数组
// slice 方法也比较有局限性，因为它仅仅针对数组类型。slice 方法会返回一个新的数组对象，这一对象由该方法的
// 前两个参数来决定原数组截取的开始和结束位置，是不会影响和改变原始数组的。
/* let arr = [1, 2, { val: 4 }]
let newArr = arr.slice()
newArr[2].val = 1000
console.log(arr) */
// 浅拷贝的限制所在——它只能拷贝一层对象。如果存在对象的嵌套，那么浅拷贝将无能为力。因此深拷贝就是为了解决这个问题而生的，
// 它能解决多层对象嵌套问题，彻底实现拷贝。

// 手工实现一个浅拷贝
// 实现思路：
// 对基础类型做一个最基本的一个拷贝；
// 对引用类型开辟一个新的存储，并且拷贝一层对象属性。
const shallowClone = target => {
    if (typeof target === 'object' && target !== null) {
        const cloneTarget = Array.isArray(target) ? [] : {};
        for (let prop in target) {
            if (target.hasOwnProperty(prop)) {
                cloneTarget[prop] = target[prop];
            }
        }
        return cloneTarget;
    } else {
        return target;
    }
}
// 利用类型判断，针对引用类型的对象进行 for 循环遍历对象属性赋值给目标对象的属性，基本就可以手工实现一个浅拷贝的代码了。

// 深拷贝的原理和实现
// 浅拷贝只是创建了一个新的对象，复制了原有对象的基本类型的值，而引用数据类型只拷贝了一层属性，再深层的还是无法进行拷贝。
// 深拷贝则不同，对于复杂引用数据类型，其在堆内存中完全开辟了一块内存地址，并将原有的对象完全复制过来存放。
// 这两个对象是相互独立、不受影响的，彻底实现了内存上的分离。总的来说，深拷贝的原理可以总结如下：
// 将一个对象从内存中完整地拷贝出来一份给目标对象，并从堆内存中开辟一个全新的空间存放新对象，且新对象的修改并不会改变原对象，
// 二者实现真正的分离。

// 方法一：乞丐版（JSON.stringify）
// JSON.stringify() 是目前开发过程中最简单的深拷贝方法，其实就是把一个对象序列化成为 JSON 字符串，并将对象里面的内容
// 转换成字符串，最后再用 JSON.parse() 的方法将 JSON 字符串生成一个新的对象
/* let obj1 = { a: 1, b: [1, 2, 3] }
let obj2 = JSON.parse(JSON.stringify(obj1))
console.log(obj2)
obj1.a = 2
obj1.b.push(4)
console.log(obj1)
console.log(obj2) */
// 通过 JSON.stringify 可以初步实现一个对象的深拷贝，通过改变 obj1 的 b 属性，可以看出 obj2 这个对象也不受影响。
// 但是使用 JSON.stringify 实现深拷贝有一些地方值得注意：
// 拷贝的对象的值中如果有函数、undefined、symbol 这几种类型，经过 JSON.stringify 序列化之后的字符串中这个键值对会消失；
// 拷贝 Date 引用类型会变成字符串；
// 无法拷贝不可枚举的属性；
// 无法拷贝对象的原型链；
// 拷贝 RegExp 引用类型会变成空对象；
// 对象中含有 NaN、Infinity 以及 -Infinity,JSON序列化的结果会变成null;
// 无法拷贝对象的循环引用，即对象成环（obj[key] = obj）。
/* function Obj() {
    this.func = function() { alert(1) }
    this.obj = { a: 1 }
    this.arr = [1, 2, 3]
    this.und = undefined
    this.reg = /123/
    this.date = new Date(0)
    this.NaN = NaN
    this.infinity = Infinity
    this.sym = Symbol(1)
}
let obj1 = new Obj()
Object.defineProperty(obj1, 'innumerable', {
    enumerable: false,
    value: 'innumerable'
})
console.log('obj1: ', obj1)
let obj2 = JSON.parse(JSON.stringify(obj1))
console.log('obj2: ', obj2) */
// 使用 JSON.stringify 方法实现深拷贝对象，虽然到目前位置还有很多无法实现的功能，但是这种方法足以满足日常的开发需求，并且
// 是最简单和快捷的。而对于其他的也要实现深拷贝的，比较麻烦的属性对应的数据类型，JSON.stringify 暂时还是无法满足的，那么就
// 需要下面的几种方法了。

// 方法二：基础版（手写递归实现）
// 下面是一个实现 deepClone 函数封装的例子，通过 for in 遍历传入参数的属性值，如果值是引用类型则再次递归调用该函数，如果是
// 基础数据类型就直接复制
let obj1 = {
    a: {
        b: 1
    }
}
function deepClone(obj) {
    let cloneObj = {}
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            cloneObj[key] = deepClone(obj[key])
        } else {
            cloneObj[key] = obj[key]
        }
    }
    return cloneObj
}
let obj2 = deepClone(obj1)
obj1.a.b = 2
console.log(obj2)
// 虽然利用递归能实现一个深拷贝，但是同上面的 JSON.stringify 一样，还是有一些问题没有完全解决，例如：
// 这个深拷贝函数并不能复制不可枚举的属性以及 Symbol 类型；
// 这种方法只是针对普通的引用类型的值做递归复制，而对于 Array、Date、RegExp、Error、Function 这样的引用类型并不能正确地拷贝；
// 对象的属性里面成环，即循环引用没有解决。
// 这种基础版本的写法也比较简单，可以应对大部分的应用情况。但是你在面试的过程中，如果只能写出这样的一个有缺陷的深拷贝的方法，
// 有可能不会通过。

// 方法三：改进版（改进后递归实现）
// 针对上面几个待解决问题，我先通过四点相关的理论告诉你分别应该怎么做。
// 针对不可枚举属性以及Symbol类型，我们可以使用Reflect.ownKeys方法；
// 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回；
// 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create 方法
// 创建一个新对象，并继承传入原对象的原型链；
// 利用 WeakMap 类型作为 Hash 表，因为 WeakMap 是弱引用类型，可以有效防止内存泄漏，作为检测循环引用很有帮助，
// 如果存在循环，则引用直接返回 WeakMap 存储的值。
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
const deepClone = function(obj, hash = new WeakMap()) {
    if (obj.constructor === Date) return new Date(obj) // 日期对象直接返回一个新的日期对象
    if (obj.constructor === RegExp) return new RegExp(obj) // 正则对象直接返回一个新的正则对象
    // 如果循环引用了就用 weakMap 来解决
    if (hash.has(obj)) return hash.get(obj)
    let allDesc = Object.getOwnPropertyDescriptors(obj)
    // 遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
    // 继承原型链
    hash.set(obj, cloneObj)
    for (let key of Reflect.ownKeys(obj)) {
        cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
    }
    return cloneObj
}
let obj = {
    num: 0,
    str: '',
    boolean: true,
    unf: undefined,
    nul: null,
    obj: { name: '我是一个对象', id: 1 },
    arr: [0, 1, 2],
    func: function() { console.log('我是一个函数') },
    date: new Date(0),
    reg: new RegExp('/我是一个正则/ig'),
    [Symbol('1')]: 1
}
Object.defineProperty(obj, 'innumerable', {
    enumerable: false,
    value: '不可枚举属性'
})
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj // 设置loop成循环引用的属性
let cloneObj = deepClone(obj)
cloneObj.arr.push(4)
console.log('obj: ', obj)
console.log('cloneObj: ', cloneObj)
