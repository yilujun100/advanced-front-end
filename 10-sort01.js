// 数组排序（上）：如何用 JS 实现各种数组排序？
// 数组排序是你在 JavaScript 的编程过程中经常会遇到的，也是大厂面试中会考察的，尤其是调用 sort 方法。
// 开始前先思考几个问题。
// 1.数据结构中稳定的排序算法有哪些？不稳定的排序算法有哪些？
// 2.时间复杂度和空间复杂度分别代表了什么？

// 时间复杂度&空间复杂度
// 在说排序算法之前，你需要重新了解一下时间复杂度和空间复杂度。
// 关于时间复杂度，我们说的更多的是通过 O(nlogn) 以及 O(n) 等来衡量。其实大多数时候我们对此并未建立形象的认知，到底哪一种算法
// 更快、更好呢？通过一张时间复杂度的曲线图（https://gitee.com/webfrontup/javascript-algorithms）,方便你来理解。
// 图中用颜色区分了最优的、一般的以及比较差的时间复杂度，可以看到有这几种分类：Excellent、Good、Fair、Bad、Horrible，通过
// 这张图可以一目了然。因此你在面试或者日常工作中编写代码的时候，要努力将代码的时间复杂度维持在 O(nlogn)以下，要知道凡是超过 n
// 平方的时间复杂度都是难以接受的。
// 空间复杂度比较容易理解，就是对一个算法在运行过程中临时占用存储空间大小的度量。有的算法需要占用的临时工作单元数与解决问题的规模
// 有关，如果规模越大，则占的存储单元越多。比如，归并排序和快速排序的空间复杂度就是不太一样的。

// 各种排序的 JS 实现
// 数据结构算法中排序有很多种，常见的、不常见的，至少包含十种以上。根据它们的特性，可以大致分为两种类型：比较类排序和非比较排序。
// 比较类排序：通过比较来决定元素间的相对次序，其时间复杂度不能突破 O(nlogn)，因此也称为非线性时间比较类排序。
// 非比较类排序：不通过比较来决定元素间的相对次序，它可以突破基于比较排序的时间下界，以线性时间运行，因此也称为线性时间非比较类排序。
// 比较类排序：
//      交换排序：冒泡排序、快速排序
//      插入排序
//      选择排序：普通选择排序、堆排序
//      归并排序
// 非比较类排序：
//      计数排序
//      桶排序
//      基数排序
// 其实根据排序的稳定性，也可以分为稳定排序和不稳定排序，例如快速排序就是不稳定的排序、冒泡排序就是稳定的排序。

// 冒泡排序
// 冒泡排序是最基础的排序，一般在最开始学习数据结构的时候就会接触它。冒泡排序是一次比较相邻两个元素，如果顺序是错误的就把它们交换过来。走访
// 数列的工作会重复地进行，直到不需要再交换，也就是说该数列已经排序完成。
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function bubbleSort(arr) {
    const len = arr.length;
    if (len < 2) return arr;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - i; j++) {
            if (arr[j] < arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}
bubbleSort(a);

// 快速排序
// 快速排序的基本思想是在数据集中选择一个元素作为基准(pivot)，所有小于基准的元素，都移到基准的左边；所有大于基准的元素都移到基准的右边，
// 对基准左边和右边两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
}
quickSort(a);

// 插入排序
// 插入排序算法描述的是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置
// 并插入，从而达到排序的效果。
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function insertSort(arr) {
    const len = arr.length;
    let current, prev;
    for (let i = 1; i < len; i++) {
        current = arr[i];
        prev = i - 1;
        while (prev >= 0 && arr[prev] > current) {
            arr[prev + 1] = arr[prev];
            prev--;
        }
        arr[prev + 1] = current;
    }
    return arr;
}
insertSort(a);
// 插入排序的思路是基于数组本身进行调整的，首先循环遍历从 i 等于 1 开始，拿到当前的 current 的值，去和前面的值比较，如果前面的大于当前值，
// 就把前面的值和当前的那个值进行交换，通过这样不断循环达到排序的目的。

// 选择排序
// 选择排序是一种简单直观的排序算法。它的工作原理是，首先将最小的元素存放在序列的起始位置，在从剩余未排序元素中继续寻找最小元素，然后放到已排序
// 的序列后面...以此类推，直到所有元素均排序完毕。
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function selectSort(arr) {
    const len = arr.length;
    let temp, minIndex;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i +1; j < len; j++) {
            if (arr[j] <= arr[minIndex]) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}
selectSort(a);
// 从上面的代码中可以看出该排序是表现最稳定的排序算法之一，因为无论什么数据进去都是 O(n^2) 的时间复杂度，所以用到它的时候，数据规模
// 越小越好。

// 堆排序
// 堆排序是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质，即子节点的键值或索引总是
// 小于（或者大于）它的父节点。堆的底层实际上就是一颗完全二叉树，可以用数组实现。
// 根节点最大的堆叫作大根堆，根节点最小的堆叫作小根堆，你可以根据从大到小排序或者从小到大来排序，分别建立对应的堆就可以。
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function heapSort(arr) {
    const len = arr.length;
    let k = 0;
    function swap(i, j) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    function maxHeapify(start, end) {
        let dad = start;
        let son = dad * 2 + 1;
        if (son >= end) return;
        if (son + 1 < end && arr[son] < arr[son + 1]) {
            son++;
        }
        if (arr[dad] <= arr[son]) {
            swap(dad, son);
            maxHeapify(son, end);
        }
    }
    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
        maxHeapify(i, len);
    }
    for (let j = len - 1; j > k; j--) {
        swap(0, j);
        maxHeapify(0, j);
    }
    return arr;
}
heapSort(a);
// 堆排序相比上面几种排序整体上会复杂一些，不太容易理解。不过你应该知道两点：一是堆排序最核心的点就在于排序前先建堆；而是由于堆其实就是
// 完全二叉树，如果父节点的序号为 n,那么叶子节点的序号就分别是 2n 和 2n + 1。
// 堆排序最后有两个循环：第一个是处理父节点的顺序；第二个循环则是根据父节点和叶子节点的大小对比，进行堆的跳转。通过这两轮循环的调整，
// 最后堆排序完成。

// 归并排序
// 归并排序是建立在归并操作上的一种有效的排序算法，该算法是采用分治法的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；先
// 使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为二路归并。
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function mergeSort(arr) {
    const merge = (right, left) => {
        const result = [];
        let il = 0;
        let ir = 0;
        while (il < left.length && ir < right.length) {
            if (left[il] < right[ir]) {
                result.push(left[il++]);
            } else {
                result.push(right[ir++]);
            }
        }
        while (il < left.length) {
            result.push(left[il++]);
        }
        while (ir < right.length) {
            result.push(right[ir++]);
        }
        return result;
    }
    const mergeSort = arr => {
        if (arr.length === 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid, arr.length);
        return merge(mergeSort(left), mergeSort(right));
    }
    return mergeSort(arr);
}
mergeSort(a);
// 通过归并排序可以得到想要的结果。上面提到了分治的思路，你可以从 mergeSort 方法中看到，通过 mid 可以把该数组分成左右两个数组，
// 分别对这两个进行递归调用排序方法，最后将两个数组按照顺序归并起来。
// 归并排序是一种稳定的排序方法，和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好得多，因为始终都是 O(nlogn) 
// 的时间复杂度。而代价是需要额外的内存空间。

// 排序算法         时间复杂度（平均）          空间复杂度          稳定性
// 冒泡排序         O(n^2)                      O(1)            稳定
// 快速排序         O(nlogn)                    O(nlogn)        不稳定
// 插入排序         O(n^2)                      O(1)            稳定
// 选择排序         O(n^2)                      O(1)            不稳定
// 堆排序           O(nlogn)                    O(1)            不稳定
// 归并排序         O(nlogn)                    O(n)            稳定
