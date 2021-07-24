// 继承的概念
// 继承是面向对象的，使用这种方式我们可以更好地复用以前的开发代码，缩短开发的周期、提升开发效率。
// 继承在各种编程语言中都充当着至关重要的角色，特别是在 JavaScript 中，它天生的灵活性，使应用场景更加丰富。JavaScript 的继承
// 也经常会用在前端工程基础库的底层搭建上面，在整个 JavaScript 的学习中尤为重要。

// JS 实现继承的几种方式
// 第一种：原型链继承
// 原型链继承是比较常见的继承方式之一，其中涉及的构造函数、原型和实例，三者之间存在着一定的关系，即每一个构造函数都有一个原型
// 对象，原型对象又包含一个指向构造函数的指针，而实例则包含这个原型对象的指针。
function Parent1() {
    this.name = 'parent1'
    this.play = [1, 2, 3]
}
function Child1() {
    this.type = 'child1'
}
Child1.prototype = new Parent1()
Child1.prototype.constructor = Child1
console.log(new Child1())
// 上面的代码看似没有问题，虽然父类的方法和属性都能够访问，但其实有一个潜在的问题。
var s1 = new Child1()
var s2 = new Child1()
s1.play.push(4)
console.log(s1.play, s2.play)
// 明明我只改变了s1的play属性，为什么s2也跟着变了呢？原因很简单，因为两个实例使用的是同一个原型对象。它们的内存空间
// 是共享的，当一个发生变化的时候，另外一个也随之进行了变化，这就是使用原型链继承方式的一个缺点。
// 那么要解决这个问题的话，我们就得再看看其他的继承方式，下面我们看看能解决原型属性共享问题的第二种方法。

// 第二种：构造函数继承（借助 call）
function Parent2() {
    this.name = 'parent2'
}
Parent12.prototype.getName = function() {
    return this.name
}
function Child2() {
    Parent2.call(this)
    this.type = 'child2'
}
let child = new Child2()
console.log(child) // 没问题
console.log(child.getName()) // 会报错
// 可以看到最后打印的 child 在控制台显示，除了 Child1 的属性 type 之外，也继承了 Parent1 的属性 name。这样写
// 的时候子类虽然能够拿到父类的属性值，解决了第一种继承方式的弊端，但问题是，父类原型对象中一旦存在父类之前自己定义
// 的方法，那么子类将无法继承这些方法。
// 构造函数实现继承的优缺点，它使父类的引用属性不会被共享，优化了第一种继承方式的弊端；但是随之而来的缺点也比较明显————
// 只能继承父类的实例属性和方法，不能继承原型属性或者方法。
// 上面的两种继承方式各有优缺点，那么结合二者的优点，于是就产生了下面这种组合的继承方式。

// 第三种：组合继承（前两种组合）
function Parent3() {
    this.name = 'parent3'
    this.play = [1, 2, 3]
}
Parent3.prototype.getName = function() {
    return this.name
}
function Child3() {
    // 第二次调用 Parent3()
    Parent3.call(this)
    this.type = 'child3'
}
// 第一次调用 Parent3()
Child3.prototype = new Parent3()
Child3.prototype.constructor = Child3 // 修正constructor指向
var s3 = new Child3()
var s4 = new Child3()
s3.play.push(4)
console.log(s3.play, s4.play) // 互不影响
console.log(s3.getName()) // 正常输出'parent3'
console.log(s4.getName()) // 正常输出'parent3'
// 这里又增加了一个新的问题：通过注释我们可以看到 Parent3 执行了两次，第一次是改变 Child3 的prototype的时候，
// 第二次是通过call方法调用 Parent3 的时候，那么 Parent3 多构造一次就多进行了一次性能开销，这是我们不愿看到的。
// 那么是否有更好的办法解决这个问题呢？下面的第六种继承方式可以更好地解决这里的问题。
// 上面介绍的更多是围绕着构造函数的方式，那么对于 JavaScript 的普通对象，怎么实现继承？

// 第四种：原型式继承
// 这里不得不提到的就是 ES5 里面的 Object.create 方法，这个方法接收两个参数：一是用作新对象原型的对象、二是为
// 新对象定义额外属性的对象（可选参数）。
let parent4 = {
    name: 'parent4',
    friends: ['p1', 'p2', 'p3'],
    getName: function() {
        return this.name
    }
}
let person4 = Object.create(parent4)
person4.name = 'tom'
person4.friends.push('jerry')
let person5 = Object.create(parent4)
person5.friends.push('lucy')
console.log(person4.name)
console.log(person4.name === person4.getName())
console.log(person5.name)
console.log(person4.friends)
console.log(person5.friends)
// 这种继承方式的缺点也很明显，多个实例的引用类型属性指向相同的内存，存在篡改的可能，接下来我们看一下在这个继承基础上
// 进行优化之后的另一种继承方式————寄生式继承

// 第五种：寄生式继承
// 使用原型式继承可以获得一份目标对象的浅拷贝，然后利用这个浅拷贝的能力再进行增强，添加一些方法，这样的继承方式就叫作
// 寄生式继承。
// 虽然起优缺点和原型式继承一样，但是对于普通对象的继承方式来说，寄生式继承相比原型式继承，还是在父类继承上添加了更多的方法。
let parent5 = {
    name: 'parent5',
    friends: ['p1', 'p2', 'p3'],
    getName: function() {
        return this.name
    }
}
function clone(original) {
    let clone = Object.create(original)
    clone.getFriends = function() {
        return this.friends
    }
    return clone
}
let person5 = clone(parent5)
console.log(person5.getName())
console.log(person5.getFriends())

// 第六种：寄生组合式继承
// 结合第四种中提及的继承方式，通过普通对象的继承问题的 Object.create 方法，我们在前面这几种继承方式的优缺点
// 基础上进行改造，得出了寄生组合式的继承方式，这也是所有继承方式里面相对最优的继承方式。
function clone(parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype)
    child.prototype.constructor = child
}
function Parent6() {
    this.name = 'parent6'
    this.play = [1, 2, 3]
}
Parent6.prototype.getName = function() {
    return this.name
}
function Child6() {
    Parent6.call(this)
    this.friends = 'child5'
}
clone(Parent6, Child6)
Child6.prototype.getFriends = function() {
    return this.friends
}
let person6 = new Child6()
console.log(person6)
console.log(person6.getName())
console.log(person6.getFriends())

// 整体看下来，这六种继承方式中，寄生组合式继承是这六种里面最优的继承方式。另外，ES6 还提供了继承的关键字 extends,
// 我们再看下 extends 的底层实现继承的逻辑。
// 我们可以利用 ES6 里的 extends 的语法糖，使用关键词很容易直接实现 JavaScript 的继承，但是如果想深入了解 extends
// 语法糖是怎么实现的，就得深入研究 extends 的底层逻辑。
class Person {
    constructor(name) {
        this.name = name
    }
    getName = function() {
        console.log('Person: ', this.name)
    }
}
class Gamer extends Person {
    constructor(name, age) {
        // 子类中存在构造函数，则需要在使用this之前首先调用super()
        super(name)
        this.age = age
    }
}
const asuna = new Gamer('Asuna', 20)
asuna.getName()
// 因为浏览器的兼容性问题，如果遇到不支持 ES6 的浏览器，那么就得利用babel这个编译工具，将 ES6 的代码
// 编译成 ES5，让一些不支持新语法的浏览器也能运行。
// 转译之后的代码片段
'use strict';

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ('value' in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}
	return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
})();

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}
	return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== 'function' && superClass !== null) {
		throw new TypeError(
			'Super expression must either be null or a function, not ' + typeof superClass
		);
	}
	subClass.prototype = Object.create(superClass && superClass.prototype, {
		constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
	});
	if (superClass)
		Object.setPrototypeOf
			? Object.setPrototypeOf(subClass, superClass)
			: (subClass.__proto__ = superClass);
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError('Cannot call a class as a function');
	}
}

var Person = (function () {
	function Person(name) {
        // 验证是否是 Person 构造出来的 this
		_classCallCheck(this, Person);

		this.name = name;
	}

	_createClass(Person, [
		{
			key: 'getName',
			value: function getName() {
				console.log('Person: ', this.name);
			}
		}
	]);

	return Person;
})();

var Gamer = (function (_Person) {
	_inherits(Gamer, _Person);

	function Gamer(name, age) {
		_classCallCheck(this, Gamer);

		var _this = _possibleConstructorReturn(
			this,
			(Gamer.__proto__ || Object.getPrototypeOf(Gamer)).call(this, name)
		);

		_this.age = age;
		return _this;
	}

	return Gamer;
})(Person);
// 从上面编译完成的源码中可以看到，它采用的也是寄生组合继承方式，因此也证明了这种方式是较优的解决继承的方式。