// JS中一直存在一种类数组的对象，它们不能直接调用数组的方法，但是又和数组比较类似，在某些特定的编程场景中会出现，这会让很多JS的初学者比较困惑。
// 我们先来看看在JavaScript中有哪些情况下的对象是类数组呢？主要有以下几种：
// 1.函数里面的参数对象arguments;
// 2.用getElementsByTagName/ClassName/Name获得的 HTMLCollection;
// 3.用querySelector获得的 NodeList.

// 类数组基本介绍
// arguments
// 我们在日常开发中经常会遇到各种类数组对象，最常见的便是在函数中使用的 arguments,它的对象只定义在函数体中，包括了函数的参数和其他属性。
function foo(name, age, sex) {
    console.log(arguments);
    console.log(typeof arguments);
    console.log(Object.prototype.toString.call(arguments));
}
foo('zhangsan', 18, 'male');
// 通过 Object.prototype.toString.call 返回的结果是'[object Arguments]',可以看出来返回的不是'[object Array]',说明 arguments
// 和数组还是有区别的。
// arguments 不仅仅有一个 length 属性，还有一个 callee 属性，我们接下来看看这个 callee 是干什么的。
function foo(name, age, sex) {
    console.log(arguments.callee);
}
foo('zhangsan', 18, 'male');
// 从控制台可以看到，输出的就是函数本身，如果在函数内部直接执行调用 callee 的话，那它就会不停地执行当前函数，直到执行到内存溢出。

// HTMLCollection
// HTMLCollection 简单来说是 HTML DOM 对象的一个接口，这个接口包含了获取到的 DOM 元素集合，返回的类型是类数组对象，如果用
// typeof 来判断的话，它返回的是'object'。它是及时更新的，当文档中的 DOM 变化时，它也会随之变化。
// 我们先随便找一个页面中有form表单的页面，在控制台中执行下述代码。
var elem1, elem2;
// document.forms 是一个 HTMLCollection
elem1 = document.forms[0];
elem2 = document.forms.item(0);
console.log(elem1);
console.log(elem2);
console.log(typeof elem1); // object
console.log(Object.prototype.toString.call(elem1)); // [object HTMLFormElement]
// 另外需要注意的一点就是 HTML DOM 中的 HTMLCollection 是即时更新的，当其所包含的文档结构发生变化时，它会自动更新。

// NodeList
// NodeList 对象是节点的集合，通常是由 querySelector 返回的。NodeList 不是一个数组，也是一种类数组。虽然 NodeList
// 不是一个数组，但是可以使用 for...of 来迭代。在一些情况下，NodeList 是一个实时集合，也就是说，如果文档中的节点树发生
// 变化，NodeList 也会随之变化。
var list = document.querySelectorAll('input[type=checkbox]');
for (var checkbox of list) {
    checkbox.checked = true;
}
console.log(list);
console.log(typeof list);
console.log(Object.prototype.toString.call(list)); // [object NodeList]

// 类数组应用场景
// 在这里介绍三种场景，这些也是最常见的。
// 1.遍历参数操作
// 我们在函数内部可以直接获取 arguments 这个类数组的值，那么也可以对参数进行一些操作，比如下面这段代码，我们可以将函数的
// 参数默认进行求和操作。
function add() {
    var sum = 0,
        len = arguments.length;
    for (var i = 0; i < len; i++) {
        sum += arguments[0];
    }
    return sum;
}
add();
add(1);
add(1, 2);
add(1, 2, 3, 4);
// 我们在函数内部可以将参数直接进行累加操作，以达到预期的效果，参数多少也可以不受限制，根据长度直接计算，返回出最后函数的参数
// 的累加结果，其他的操作也都可以仿照这样的方式来做。
// 2.定义链接字符串函数
// 我们可以通过 arguments 定义一个函数来连接字符串。这个函数唯一正式声明了的参数是一个字符串，该参数指定一个字符串作为衔接点
// 来连接字符串。
function myConcat(separa) {
    var args = Array.prototype.slice.call(arguments, 1);
    return args.join(separa);
}
myConcat(', ', 'red', 'orange', 'blue');
myConcat('; ', 'elephant', 'lion', 'snake');
myConcat('. ', 'one', 'two', 'three', 'four', 'five');
// 这段代码说明了，你可以传递任意数量的参数到该函数，并使用每个参数作为列表中的项创建列表进行拼接。从这个例子中也可以看出，我们
// 可以在日常编码中采用这样的代码抽象方式，把需要解决的这一类问题，都抽象成通用的方法，来提升代码的可复用性。
// 3.传递参数使用
// 可以借助 arguments 将参数从一个函数传递到另一个函数。
// 使用apply将foo的参数传递给bar
function foo() {
    bar.apply(this, arguments);
}
function bar(a, b, c) {
    console.log(a, b, c);
}
foo(1, 2, 3);
// 上述代码中，通过在foo函数内部调用apply方法，用foo函数的参数传递给bar函数，这样就实现了借用参数的妙用。

// 如何将类数组转换成数组
// 类数组借用数组方法转数组
// 类数组因为不是真正的数组，所以没有数组类型上自带的那些方法，我们就需要利用下面这几个方法去借用数组的方法。比如借用数组的 push 方法
var arrayLike = {
    0: 'java',
    1: 'script',
    length: 2
};
Array.prototype.push.call(arrayLike, 'zhangsan', 'lisi');
console.log(typeof arrayLike);
console.log(arrayLike);
// 从中可以看到，arrayLike 其实是一个对象，模拟数组的一个类数组，从数据类型上说它是一个对象，新增了一个length的属性。它自身是不会有
// 数组的push方法的，这里我们就用call的方法来借用Array原型链上的push方法，可以实现一个类数组的push方法，给arrayLike添加新的元素。
function sum(a, b) {
    let args = Array.prototype.slice.call(arguments);
    // let args = [].slice.call(arguments); // 这样写也是一样效果
    console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);
function sum(a, b) {
    let args = Array.prototype.concat.apply([], arguments);
    console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);
// 这段代码中可以看到，还是借用 Array 原型链上的各种方法，来实现 sum 函数的参数相加的效果。一开始都是将 arguments 通过借用数组
// 的方法转换为真正的数组，最后都又通过数组的 reduce 方法实现了参数转化的真数组 args 的相加，最后返回预期的结果。

// ES6 的方法转数组
// 对于类数组转换成数组的方式，我们还可以采用 ES6 新增的 Array.from 方法以及展开运算符的方法。
function sum(a, b) {
    let args = Array.form(arguments);
    console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);
function sum(a, b) {
    let args = [...arguments];
    console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);
function sum(...args) {
    console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);