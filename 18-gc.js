// 围绕JS引擎相关知识，深入了解其底层运行逻辑。这对于日常开发中对高性能 JavaScript 的编写以及排查代码性能问题有着很好的帮助，
// 同样也是 JavaScript 开发者进阶过程中必不可少的学习路径。
// 通过学习JS引擎底层的垃圾回收机制，了解更多的浏览器内核层面的东西，从而对JS的内存管理以及内存溢出等形成一定的认识。
// 开始前，有两个问题。
// 1. JavaScript 的内存是怎么管理的
// 2. Chrome 浏览器又是如何进行垃圾回收的

// JavaScript 的内存管理
// 不管是什么样的计算机程序语言，运行在对应的代码引擎上，对应的使用内存过程大致逻辑是一样的，可以分为这三个步骤：
// 1. 分配你所需要的系统内存空间；
// 2. 使用分配到的内存进行读或者写等操作；
// 3. 不需要使用内存时，将其空间释放或者归还。
// 与其他需要手动管理内存的语言不太一样的地方是，在 JavaScript 中，当我们创建变量（对象，字符串等）的时候，系统会自动给对象
// 分配对应的内存。
var a = 123; // 给数值变量分配栈内存
var etf = 'ARK'; // 给字符串分配栈内存
// 给对象及其包含的值分配堆内存
var obj = {
    name: 'tom',
    age: 13
};
// 给数组及其包含的值分配内存（就像对象一样）
var a = [1, null, 'PSAC'];
// 给函数（可调用的对象）分配内存
function sum(a, b) {
    return a + b;
}
// 当系统经过一段时间发现这些变量不会再被使用的时候，会通过垃圾回收机制的方式来处理掉这些变量所占用的内存，其实开发者不用过多关心内存问题。
// 即便是这样，我们在开发过程中也需要了解 JavaScript 的内存管理机制，这样才能避免一些不必要的问题，在 JavaScript 中数据类型分为两类：
// 简单类型和引用类型。
// 对于简单的数据类型，内存是保存在栈（stack）空间中的；复杂数据类型，内存保存在堆（heap）空间中。简而言之，基本就是说明以下两点。
// 基本类型：这些类型在内存中会占据固定的内存空间，它们的值都保存在栈空间中，直接可以通过值来访问这些；
// 引用类型：由于引用类型值大小不固定（比如上面的对象可以添加属性等），栈内存中存放地址指向堆内存中的对象，是通过引用来访问的。
// 因此总结来说：栈内存中的基本类型，可以通过操作系统直接处理；而堆内存中的引用类型，正是由于可以经常变化，大小不固定，因此需要
// JavaScript 的引擎通过垃圾回收机制来处理。

// Chrome 内存回收机制
// 在 Chrome 浏览器中，JavaScript 的 V8 引擎被限制了内存的使用，根据不同的操作系统（操作系统有 64 位和 32 位的）内存大小会不同，
// 大的可以到 1.4G 的空间，小的只能到 0.7G 的空间。
// 那么请你思考一下，为什么要去限制内存使用呢？大致是两个原因：V8 最开始是为浏览器而设计的引擎，早些年由于 Web 应用都比较简单，其实
// 并未考虑占据过多的内存空间；另外又由于被 V8 的垃圾回收机制所限制，比如清理大量的内存时会耗费很多时间，这样会引起 JavaScript
// 执行的线程被挂起，会影响当前执行的页面应用的性能。
// Chrome 的 JavaScript 引擎 V8 将堆内存分为两类 新生代的回收机制和老生代的回收机制。

// 新生代内存回收
// 我们先来看下新生代的内存回收的空间，在 64 位操作系统下分配为 32MB，正是因为新生代中的变量存活时间短，不太容易产生太大的内存压力，
// 因此不够大也是可以理解的。首先系统会将分配给新生代的内存空间分为两部分
// 边部分表示正在使用的内存空间，右边是目前闲置的内存空间。当浏览器开始进行内存的垃圾回收时，JavaScript 的 V8 引擎会将左边的对象
// 检查一遍。如果引擎检测是存活对象，那么会复制到右边的内存空间去；如果不是存活的对象，则直接进行系统回收。当所有左边的内存里的对象
// 没有了的时候，等再有新生代的对象产生时，上面的部分左右对调，这样来循环处理。
// 如果是顺序放置的那比较好处理，可以按照上面所说的处理方式。但是如果是零散的场景怎么处理呢？
// 橙色的块代表存活对象，白色地方代表未分配的内存。正常情况下，由于堆内存是连续分配的，但是也有可能出现零散的这种内存分配情况，这种
// 零散的分配情况就造成了内存碎片，会影响比较大的内存对象的放置。
// 因此这里介绍一个算法 Scavenge，它主要就是解决内存碎片的情况，在通过算法处理过后，内存中对象的排布都会变成下图这个排列方式
// 进行这样的算法处理，明显会让内存排布变得更整齐了，这样就非常方便之后新来的对象的内存分配。

// 老生代内存回收
// 新生代中的变量如果经过回收之后依然一直存在，那么就会被放入到老生代内存中。时间长了之后通过几个原因的判断，我们就会把这些变量进行
//  "晋升"，只要是已经经历过一次 Scavenge 算法回收的，就可以晋升为老生代内存的对象。那么在进入老生代的内存回收机制中，就不能再用
// Scavenge 的算法了。Scavenge 的算法是有其适用的场景，而对于内存空间比较大的，就不适合用 Scavenge 算法了。
// 那么老生代内存中的垃圾回收，是采用什么样的策略进行的呢？这里采用了 Mark-Sweep（标记清除） 和 Mark-Compact（标记整理）的策略

// 标记清除（Mark-Sweep）
// 标记清除分为两个阶段：标记阶段和清除阶段。
// 首先它会遍历堆上的所有的对象，分别对它们打上标记；然后在代码执行过程结束之后，对使用过的变量取消标记。那么没取消标记的就是没有使用
// 过的变量，因此在清除阶段，就会把还有标记的进行整体清除，从而释放内存空间。
// 听起来这一切都比较完美，但是其实通过标记清除之后，还是会出现内存碎片的问题。内存碎片多了之后，如果要新来一个较大的内存对象需要存储，
// 会造成影响。对于通过标记清除产生的内存碎片，还是需要通过另外一种方式进行解决，因此这里就不得不提到标记整理策略（Mark-Compact）了。

// 标记整理（Mark-Compact）
// 经过标记清除策略调整之后，老生代的内存中因此产生了很多内存碎片，若不清理这些内存碎片，之后会对存储造成影响。
// 为了方便解决浏览器中的内存碎片问题，标记整理这个策略被提出。这个策略是在标记清除的基础上演进而来的，和标记清除来对比来看，标记整理
// 添加了活动对象整理阶段，处理过程中会将所有的活动对象往一端靠拢，整体移动完成后，直接清理掉边界外的内存。
// 可以看到，老生代内存的管理方式和新生代的内存管理方式区别还是比较大的。Scavenge 算法比较适合内存较小的情况处理；而对于老生代内存较大、
// 变量较多的时候，还是需要采用“标记-清除”结合“标记-整理”这样的方式处理内存问题，并尽量避免内存碎片的产生。

// 内存泄漏与优化
// 平常用 JavaScript 开发代码，内存的泄漏和优化是应该经常留意的。内存泄漏是指 JavaScript 中，已经分配堆内存地址的对象由于长时间未
// 释放或者无法释放，造成了长期占用内存，使内存浪费，最终会导致运行的应用响应速度变慢以及最终崩溃的情况。这种就是内存泄漏，你应该在日常
// 开发和使用浏览器过程中也遇到过，那么我们来回顾一下内存泄漏的场景：
// 1. 过多的缓存未释放；
// 2. 闭包太多未释放；
// 3. 定时器或者回调太多未释放；
// 4. 太多无效的 DOM 未释放；
// 5. 全局变量太多未被发现。
// 大概总结了这几种场景，这些现象会在开发或者使用中造成内存泄漏，以至于你的浏览器卡顿、不响应、页面打不开等问题产生。那么这些问题该怎么
// 优化呢？我们来看下这些场景都需要注意点什么。
// 1. 减少不必要的全局变量，使用严格模式避免意外创建全局变量。
function foo() {
    // 全局变量 => window.bar
    this.bar = '默认this指向全局';
    // 没有声明变量，实际上是全局变量 => window.bar
    bar = '全局变量';
}
foo();
// 这段代码中，函数内部绑定了太多的 this 变量，虽然第一眼看不出问题，但仔细一分析，其实 this 下的属性默认都是绑定到 window 上的属性，
// 均为全局变量，这一点是非常有必要注意的。
// 2. 在你使用完数据后，及时解除引用（闭包中的变量，DOM 引用，定时器清除）。
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if (node) {
        node.innerHTML = JSON.stringify(someResource);
        // 定时器也没有清除，可以清除掉
    }
    // node、someResource 存储了大量数据，无法回收
}, 1000);
// 比如上面代码中就缺少清除 setInterval 的代码，类似这样的代码增多会造成内存的占用过多，这是同样也需要注意的一点。
// 3. 组织好你的代码逻辑，避免死循环等造成浏览器卡顿、崩溃的问题。例如，对于一些比较占用内存的对象提供手工释放内存的方法
var leakArray = [];
exports.clear = function() {
    leakArray = [];
}
// 比如这段代码提供了清空该数组内容的方法，使用完成之后可以根据合适业务时机进行操作释放。这样就能较好地避免对象数据量太大造成的内存溢出的问题。
// 关于内存泄漏这部分，如果你想更好地去排查以及提前避免问题的发生，最好的解决方式是通过熟练使用 Chrome 的内存剖析工具，多分析多定位 Chrome
// 帮你分析保留的内存快照，来查看持续占用大量内存的对象。最好在业务代码上线前做好分析和诊断，之后才能保证线上业务的质量。