// 剖析 JS 数组 sort 方法的底层实现
// 开始前请先思考一下：
// 1.sort方法到底是用了哪种排序思路？
// 2.sort方法里面的参数对比函数是什么意思？

// sort方法的基本使用
// sort方法是对数组元素进行排序，默认排序顺序是先将元素转换为字符串，然后再进行排序，先来看一下它的语法：
// arr.sort([compareFunction])
// 其中compareFunction用来指定按某种顺序进行排列的函数，如果省略不写，元素按照转换为字符串的各个字符的Unicode位点进行排序。
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.sort();
console.log(months);
const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1); // [1, 100000, 21, 30, 4]
// 如果想要按照从小到大排序或者从大到小排序，那么上面的代码就需要跳转为下面这样。
const array1 = [1, 30, 4, 21, 100000];
array1.sort((a, b) => b - a);
console.log(array1); // [100000, 30, 21, 4, 1]
const array1 = [1, 30, 4, 21, 100000];
array1.sort((a, b) => a - b);
console.log(array1); // [1, 4, 21, 30, 100000]
// 如果指明了 compareFunction 参数，那么数组会按照调用该函数的返回值排序，即 a 和 b 是两个将要被比较的元素：
// 如果 compareFunction(a, b) 小于 0，那么 a 会被排列到 b 之前；
// 如果 compareFunction(a, b) 等于 0，a 和 b 的相对位置不变；
// 如果 compareFunction(a, b) 大于 0，b 会被排列到 a 之前。

// sort 方法的底层实现
// 相信你对 JS 数组的 sort 方法已经不陌生了，上面也对它的用法进行了详细的介绍。那么它的内部是如何实现的呢？如果你能够进入它的
// 内部看一看源码，理解背后的设计，这对编程思维的提升是一个很好的帮助。
// sort 方法在V8内部相较于其他方法而言是一个比较难的算法，对于很多边界情况结合排序算法做了反复的优化，但是这里不会直接拿源码来
// 讲，而是会根据源码的思路，循序善诱地带你实现一个跟引擎性能类似的排序算法，并且一步步拆解其中的奥秘。

// 底层sort源码分析
// 先大概来梳理一下源码中排序的思路（V8源码sort排序部分：https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L709）
// 通过研究源码我们先直接看一下结论，如果要排序的元素个数是n的时候，那么就会有以下几种情况：
// 1.当 n<=10 时，采用插入排序；
// 2.当 n>10 时，采用三路快速排序；
// 3. 10<n<=1000, 采用中位数作为哨兵元素；
// 4. n>1000, 每隔 200~215 个元素挑出一个元素，放到一个新数组中，然后对它排序，找到中间位置的数，以此作为中位数。
// 在得出这个结论之前，有必要了解为什么这么做。

// 1.为什么元素个数少的时候要采用插入排序？
// 虽然插入排序理论上是平均时间复杂度为O(n^2)的算法，快速排序是一个平均O(nlogn)级别的算法。但是别忘了，这只是理论上平均的
// 时间复杂度估算，但是它们也有最好的时间复杂度情况，而插入排序在最好的情况下时间复杂度是O(n)。
// 在实际情况中两者的算法复杂度前面都会有一个系数，当 n 足够小的时候，快速排序 nlogn 的优势会越来越小。倘若插入排序 n 足够
// 小，那么就会超过快排。而事实上正是如此，插入排序经过优化以后，对于小数据集的排序会有非常优越的性能，很多时候甚至会超过快排。
// 因此对于很小的数据量，应用插入排序是一个非常不错的选择。

// 2.为什么要花这么大的力气选择哨兵元素？
// 因为快速排序的性能瓶颈在于递归的深度，最坏的情况是每次的哨兵都是最小元素或者是最大元素，那么进行 partition (一边是小于
// 哨兵的元素，另一边是大于哨兵的元素)时，就会有一边是空的。如果这么排下去，递归的层数就达到了 n，而每一层的复杂度是 O(n),
// 因此快排这时候会退化成 O(n^2)级别。
// 这种情况是要尽力避免的，那么如何来避免？就是让哨兵元素尽可能地处于数组的中间位置，让最大或者最小的情况尽可能少。这时候，你
// 就能理解 V8 里面所做的各种优化了。
// 接下来，我们看一下官方实现 sort 排序算法的代码基本结构。
function ArraySort(comparefn) {
    CHECK_OBJECT_CORECIBLE(this, "Array.prototype.sort");

    var array = TO_OBJECT(this);
    var length = TO_LENGTH(array.length);
    return InnerArraySort(array, length, comparefn);
}
function InnerArraySort(array, length, comparefn) {
    // 比较函数未传入
    if (!IS_CALLABLE(comparefn)) {
        comparefn = function (x, y) {
            if (x === y) return 0;
            if (%_IsSmi(x) && %_IsSmi(y)) {
                return %SmiLexicographicCompare(x, y);
            }
            x = TO_STRING(x);
            y = TO_STRING(y);
            if (x == y) return 0;
            else return x < y ? -1 : 1;
        };
    }
    function InsertionSort(a, from , to) { // 插入排序
        for (var i = from + 1; i < to; i++) {
            var element = a[i];
            for (var j = i - 1; j >= from; j--) {
                var tmp = a[j];
                var order = comparefn(tmp, element);
                if (order > 0) {
                    a[j + 1] = tmp;
                } else {
                    break;
                }
            }
            a[j + 1] = element;
        }
    }
    function GetThirdIndex(a, from, to) { // 元素个数大于1000时寻找哨兵元素
        var t_array = new InternalArray();
        var increment = 200 + ((to - from) & 15);
        var j = 0;
        from += 1;
        to -= 1;
        for (var i = from; i < to; i += increment) {
            t_array[j] = [i, a[i]];
            j++;
        }
        t_array.sort(function(a, b) {
            return comparefn(a[1], b[1]);
        });
        var third_index = t_array[t_array.length >> 1][0];
        return third_index;
    }
    function QuickSort(a, from, to) { // 快速排序实现
        var third_index = 0; // 哨兵位置
        while (true) {
            if (to - from <= 10) {
                InsertionSort(a, from, to); // 数据量小，使用插入排序
                return;
            }
            if (to - from > 1000) {
                third_index = GetThirdIndex(a, from, to);
            } else {
                // 小于1000直接取中点
                third_index = from + ((to - from) >> 1);
            }
            // 下面开始快排
            var v0 = a[from];
            var v1 = a[to - 1];
            var v2 = a[third_index];
            var c01 = comparefn(v0, v1);
            if (c01 > 0) {
                // v1 < v0, so swap them
                var tmp = v0;
                v0 = v1;
                v1 = tmp;
            } // v0 <= v1
            var c02 = comparefn(v0, v2);
            if (c02 >= 0) {
                // v2 <= v0 <= v1
                var tmp = v0;
                v0 = v2;
                v2 = v1;
                v1 = tmp;
            } else {
                // v0 <= v1 && v0 < v2
                var c12 = comparefn(v1, v2);
                if (c12 > 0) {
                    // v0 <= v2 < v1
                    var tmp = v1;
                    v1 = v2;
                    v2 = tmp;
                }
            }
            // v0 <= v1 <= v2
            a[from] = v0;
            a[to - 1] = v2;
            var pivot = v1;
            var low_end = from + 1;
            var high_start = to - 1;
            a[third_index] = a[low_end];
            a[low_end] = pivot;

            partition: for (var i = low_end + 1; i < high_start; i++) {
                var element = a[i];
                var order = comparefn(element, pivot);
                if (order < 0) {
                    a[i] = a[low_end];
                    a[low_end] = element;
                    low_end++;
                } else if (order > 0) {
                    do {
                        high_start--;
                        if (high_start == i) break partition;
                        var top_elem = a[high_start];
                        order = comparefn(top_elem, pivot);
                    } while (order > 0);
                    a[i] = a[high_start];
                    a[high_start] = element;
                    if (order < 0) {
                        element = a[i];
                        a[i] = a[low_end];
                        a[low_end] = element;
                        low_end++;
                    }
                }
            }
            // 快排的核心思路，递归调用快速排序方法
            if (to - hight_start < low_end - from) {
                QuickSort(a, high_start, to);
                to = low_end;
            } else {
                QuickSort(a, from, low_end);
                from = high_start;
            }
        }
    }
}
// 从上面的源码分析来看，当数据量小于10的时候用插入排序；当数据量大于10之后采用三路快排；当数据量为10~1000时候直接采用中位数
// 为哨兵元素；当数据量大于1000的时候就开始寻找哨兵元素。
// 关于排序时间复杂度也不用死机硬背，在不同的数据量情况下，不代表某种排序一定就比另外一种排序速度快，这点要牢记，然后根据不同
// 的场景进行不同的分析。
// 快速排序和插入排序的最好以及最快情况下的时间复杂度对比
// 排序算法         时间复杂度（最好）      时间复杂度（平均）      时间复杂度（最差）      空间复杂度         稳定性
// 快速排序         O(nlogn)                O(nlogn)            O(n^2)              O(nlogn)        不稳定
// 插入排序         O(n)                    O(n^2)              O(n^2)              O(1)            稳定
// 将这两个排序的时间复杂度对比来看，如果当 n 足够小的时候，最好的情况下，插入排序的时间复杂度为 O(n) 要优于快速排序的 O(nlogn),
// 因此就解释了这里当 V8 实现 JS 数组排序算法时，数据量较小的时候会采用插入排序的原因了。