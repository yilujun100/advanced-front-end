// 数据类型检测
// 1. typeof
// 虽然 typeof null 会输出 object,但这只是 JS 存在的一个悠久 Bug,不代表 null 就是引用类型，并且 null 本身也不是对象。
// 因此，null 在 typeof 之后返回的是有问题的结果，不能作为判断null的方法。如果你需要在if语句中判断是否为null，直接通过
// '=== null' 来判断就好
// 2. instanceof
function myInstanceof(left, right) {
    // 这里先用typeof来判断基础数据类型，如果是，直接返回false
    if (typeof left !== 'object' || left === null) return false;
    // getPrototypeOf是Object对象自带的API,能够拿到参数的原型对象
    let proto = Object.getPrototypeOf(left);
    while (true) { // 循环往下寻找，直到找到相同的原型对象
        if (proto === null) return false;
        if (proto === right.prototype) return true; // 找到相同原型对象，返回true
        proto = Object.getPrototypeOf(proto);
    }
}
console.log(myInstanceof(new Number(123), Number)); // true
console.log(myInstanceof(123, Number)); // false

// instanceof 可以准确判断复杂引用数据类型，但是不能正确判断基础数据类型；
// 而 typeof 也存在弊端，它虽然可以判断基础数据类型（null除外），但是引用数据类型中，
// 除了 function 类型以外，其他的也无法判断。
// 总之，不管单独用 typeof 还是 instanceof,都不能满足所有场景的需求，而只能通过二者混写
// 的方式来判断。

// 3. Object.prototype.toString
// toString()是Object的原型方法，调用该方法，可以统一返回格式为"[object Xxx]" 的字符串，
// 其中 Xxx 就是对象的类型。对于 Object 对象，直接调用 toString() 就能返回 [object Object];
// 而对于其他对象，则需要通过 call 来调用，才能返回正确的类型信息。
console.log(Object.prototype.toString({}))
console.log(Object.prototype.toString.call({}))
console.log(Object.prototype.toString.call(1))
console.log(Object.prototype.toString.call('1'))
console.log(Object.prototype.toString.call(true))
console.log(Object.prototype.toString.call(function(){}))
console.log(Object.prototype.toString.call(null))
console.log(Object.prototype.toString.call(undefined))
console.log(Object.prototype.toString.call(/123/g))
console.log(Object.prototype.toString.call(new Date()))
console.log(Object.prototype.toString.call([]))
// console.log(Object.prototype.toString.call(document)) // "[object HTMLDocument]"
// console.log(Object.prototype.toString.call(window)) // "[object Window]"

function getType(obj) {
    let type = typeof obj;
    if (type !== 'object') { // 先进行typeof判断，如果是基础数据类型，直接返回
        return type;
    }
    // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}


// 类型转换
// 强制类型转换
// 强制类型转换的方式包括 Number()、parseInt()、parseFloat()、toString()、String()、Boolean()
// Number()方法的强制转换规则：
// 如果是布尔值，true 和 false 分别被转换为 1 和 0;
// 如果是数字，返回自身
// 如果是null,返回0
// 如果是 undefined,返回 NaN
// 如果是字符串，遵循以下规则：如果字符串中只包含数字（或者是0X / 0x 开头的十六进制数字字符串，允许包含正负号），则将其转换为十进制；
// 如果字符串中包含了有效的浮点格式，将其转换为浮点数值；如果是空字符串，将其转换为0；如果不是以上格式的字符串，均返回NaN;
// 如果是 Symbol,抛出错误；
// 如果是对象，并且部署了[Symbol.toPrimitive]，那么调用此方法，否则调用对象的valueOf()方法，然后依据前面的规则转换返回的值；
// 如果转换的结果是NaN,则调用对象的 toString() 方法，再次依照前面的顺序转换返回对应的值
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(Number('0111')); // 111
console.log(Number(null)); // 0
console.log(Number('')); // 0
console.log(Number('1a')); // NaN
console.log(Number(-0X11)); // -17
console.log(Number('0X11')); // 17

// Boolean() 方法的强制转换规则
// 除了 undefined、null、false、''、0(包括+0,-0)、NaN 转换出来是false,其他都是true

// 隐式类型转换
// 凡是通过逻辑运算符（&&、||、!）、算术运算符(+、-、*、/)、关系操作符(>、<、<=、>=)、相等运算符(==)
// 或者 if/while 条件的操作，如果遇到两个数据类型不一样的情况，都会出现隐式类型转换。
// '=='的隐式类型转换规则
// 如果类型相同，无须进行类型转换
// 如果其中一个操作值是 null 或者 undefined,那么另一操作符必须为 null 或者 undefined,才会返回true,否则都返回false
// 如果其中一个是 Symbol 类型，那么返回false
// 两个操作值如果为string 和 number 类型，那么就会将字符串转换为 number;
// 如果一个操作值是 boolean，那么转换成 number
// 如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（调用 object 的 valueOf/toString 方法进行转换）
var a = {
    value: 0,
    valueOf: function() {
        this.value++;
        return this.value;
    }
};
console.log(a == 1 && a == 2 && a == 3); // true

// '+' 的隐式类型转换规则
// '+' 号操作符，不仅可以用作数字相加，还可以用作字符串拼接。仅当 '+' 号两边都是数字时，进行的是加法运算；
// 如果两边都是字符串，则直接拼接，无须进行隐式类型转换。
// 如果其中有一个是字符串，另外一个是 undefined、null 或布尔型，则调用 toString() 方法进行字符串拼接；
// 如果是纯对象、数组、正则等，则默认调用对象的转换方法会存在优先级，然后再进行拼接。
// 如果其中有一个是数字，另外一个是 undefined、null、布尔型或数字，则会将其转换成数字进行加法运算，对象
// 的情况还是参考上一条规则。
// 如果其中一个是字符串、一个是数字，则按照字符串规则进行拼接。
console.log('1' + undefined); // '1undefined'
console.log('1' + null); // '1null'
console.log('1' + true); // '1true'
console.log('1' + 1n) // '11' 比较特殊字符串和BigInt相加，BigInt转换为字符串
console.log(1 + undefined); // NaN undefined转换数字相加NaN
console.log(1 + 1n); // 错误 不能把BigInt和Number类型直接混合相加

// Object的转换规则
// 对象转换的规则，会先调用内置的[ToPrimitive]函数，其规则逻辑如下：
// 如果部署了 Symbol.toPrimitive 方法，优先调用再返回；
// 调用 valueOf(),如果转换为基础类型，则返回；
// 调用 toString(),如果转换为基础类型，则返回；
// 如果都没有返回基础类型，会报错。
var obj = {
    value: 1,
    valueOf() {
        return 2;
    },
    toString() {
        return '3';
    },
    [Symbol.toPrimitive]() {
        return 4;
    }
};
console.log(obj + 1); // 5
10 + {}; // '10[object Object]' 注意：{}会默认调用valueOf是{}，不是基础类型继续转换，调用toString,返回结果是'[object Object]',再和10拼接
[1,2,undefined,4,5] + 10 // '1,2,,4,510' 注意[1,2,undefined,4,5]会默认先调用valueOf结果还是这个数组，不是基础类型继续转换，也还是调用toString,返回'1,2,,4,5',再和10拼接
// 总结：
// 数据类型的基本概念：
// 基础类型：Number、String、Boolean、Null、Undefined、Symbol、BigInt
// 引用类型：Object
// 基础类型存储在栈内存，被引用或拷贝时，会创建一个完全相等的变量
// 引用类型存储在堆内存，存储的是地址，多个引用指向同一个地址，这里会涉及一个“共享”的概念。
// 数据类型的判断方法：typeof 和 instanceof,以及 Object.prototype.toString 的判断数据类型、手写instanceof代码片段
// 两种数据类型转换方式：强制类型转换 和 隐式类型转换，日常写代码过程中隐式转换要多留意，如果理解不到位，很容易引起在编码过程中的bug，
// 得到一些意想不到的结果
// 数据类型转换规则：
// 1. 对象 == 字符串 对象.toString()变为字符串
// 2. null == undefined 相等，但和其它值比较就不再相等
// 3. NaN == NaN 不相等
// 4. 剩下的都是转换为数字