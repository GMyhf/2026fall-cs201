# Python十大排序算法源码

Updated Nov 10 2026

2024 spring, Compiled by Hongfei Yan



Logs:

2026/11/10 补充：快排的 Lomuto 与挖坑填数两种分割；归并的 Sedgewick 哨兵写法（含不稳定反例）与「小区间只能当场插入排序」；基数排序的计数排序版；新增 3.11 索引排序（通俗讲法、Python 实现、复杂度）。

2026/11/10 修正归并排序稳定性（`<` 改 `<=`）；修正桶排序在全部元素相等/只有一个元素时除零；计数排序支持负数（原代码遇负数会静默输出错误结果）并补充稳定版；修正快排、计数、桶、基数排序的复杂度与稳定性描述；选择排序比喻与代码一致；标题去掉多余的公式标记。

2024/5/3 增加了改进冒泡排序，增加了改进的插入排序，增加了双指针实现的快排。

2024/4/13 取自, https://blog.csdn.net/wtandyn/article/details/119577831



## 1 前言

经常用到各种排序算法，但是网上的Python排序源码质量参差不齐。因此结合网上的资料和个人理解，整理了一份可直接使用的排序算法Python源码。

包括：冒泡排序（Bubble Sort），插入排序（Insertion Sort），选择排序（Selection Sort），希尔排序（Shell Sort），归并排序（Merge Sort），快速排序（Quick Sort），堆排序（Heap Sort），计数排序（Counting Sort），桶排序（Bucket Sort），基数排序（Radix Sort），另附索引排序（Index Sort）。

## 2 排序算法的选取规则

选择合适的排序算法取决于多种因素，包括数据的规模、特性、性能要求、稳定性要求、内存限制等。

**数据规模**

小规模，通常指数据量在几十到几千个元素。冒泡排序、插入排序、选择排序（$O(n^2)$ 算法在 Python 中处理 $10^4$ 个元素已需数秒）。

中规模数据，通常指数据量在几万到几百万个元素。希尔排序、快速排序、归并排序、堆排序。

大规模数据，通常指数据量在几百万到几亿甚至更多个元素。归并排序、快速排序、堆排序；数据无法一次装入内存时用外部排序、分布式排序。

**数据特性**

几乎有序：插入排序。

整数且取值范围小：计数排序。

数据分布均匀：桶排序。

固定长度的整数或字符串：基数排序。

单条记录很大、搬不起：索引排序（只排下标）。

**性能要求**

高时间效率：归并排序、快速排序、堆排序。

低空间复杂度（原地，$O(1)$ 额外空间）：堆排序、希尔排序，以及冒泡、选择、插入排序。

**稳定性要求**

需要稳定排序：归并排序、计数排序（前缀和版本）、基数排序、桶排序（桶内用稳定排序）、插入排序、冒泡排序。Python 内置的 `sorted` / `list.sort`（Timsort）也是稳定的。

**内存限制**

内存有限：堆排序（$O(n\log n)$ 且原地）；数据量很小时也可用选择排序、插入排序。



**稳定性与比较排序（Comparison sorts）**

在排序算法中，稳定性是指相等元素的相对顺序是否在排序后保持不变。换句话说，如果排序算法在排序过程中保持了相等元素的相对顺序，则称该算法是稳定的，否则是不稳定的。

对于判断一个排序算法是否稳定，一种常见的方法是观察交换操作。挨着交换（相邻元素交换，且只在严格大于时交换）是稳定的，而隔着交换（跳跃式交换）可能会导致不稳定性。例如选择排序对 `[5a, 5b, 2]` 第一轮把 `5a` 与 `2` 交换，得到 `[2, 5b, 5a]`，两个 5 的相对次序被打乱。

Below is a table of [comparison sorts](https://en.wikipedia.org/wiki/Comparison_sort). A comparison sort cannot perform better than O(n log n) on average.

|        Name         |  Best   |  Average  |   Worst   | Memory | Stable |       Method        |                         Other notes                          |
| :-----------------: | :-----: | :-------: | :-------: | :----: | :----: | :-----------------: | :----------------------------------------------------------: |
| In-place merge sort |    —    |     —     | $nlog^2n$ |   1    |  Yes   |       Merging       | Can be implemented as a stable sort based on stable in-place merging. |
|      Heapsort       | $nlogn$ |  $nlogn$  |  $nlogn$  |   1    |   No   |      Selection      |                                                              |
|     Merge sort      | $nlogn$ |  $nlogn$  |  $nlogn$  |  *n*   |  Yes   |       Merging       | Highly parallelizable (up to *O*(log *n*) using the Three Hungarian's Algorithm) |
|       Timsort       |   *n*   |  $nlogn$  |  $nlogn$  |  *n*   |  Yes   | Insertion & Merging | Makes *n-1* comparisons when the data is already sorted or reverse sorted. |
|      Quicksort      | $nlogn$ |  $nlogn$  |   $n^2$   | $logn$ |   No   |    Partitioning     | Quicksort is usually done in-place with *O*(log *n*) stack space. |
|      Shellsort      | $nlogn$ | $n^{4/3}$ | $n^{3/2}$ |   1    |   No   |      Insertion      |                       Small code size.                       |
|   Insertion sort    |   *n*   |   $n^2$   |   $n^2$   |   1    |  Yes   |      Insertion      | *O*(n + d), in the worst case over sequences that have *d* inversions. |
|     Bubble sort     |   *n*   |   $n^2$   |   $n^2$   |   1    |  Yes   |     Exchanging      |                       Tiny code size.                        |
|   Selection sort    |  $n^2$  |   $n^2$   |   $n^2$   |   1    |   No   |      Selection      | Stable with O(n) extra space, when using linked lists, or when made as a variant of Insertion Sort instead of swapping the two items. |



Highly tuned implementations use more sophisticated variants, such as [Timsort](https://en.wikipedia.org/wiki/Timsort) (merge sort, insertion sort, and additional logic), used in [Android](https://en.wikipedia.org/wiki/Android_(operating_system)), [Java](https://en.wikipedia.org/wiki/Java_(programming_language)), and [Python](https://en.wikipedia.org/wiki/Python_(programming_language)), and [introsort](https://en.wikipedia.org/wiki/Introsort) (quicksort and heapsort), used (in variant forms) in some [C++ sort](https://en.wikipedia.org/wiki/Sort_(C%2B%2B)) implementations and in [.NET](https://en.wikipedia.org/wiki/.NET).



下面三种是**非比较排序**，不受 $O(n\log n)$ 下界限制，但对数据有要求：

|   名称   |    平均     |                   最坏                   |   空间   | 稳定 |                    适用情况                    |
| :------: | :---------: | :--------------------------------------: | :------: | :--: | :--------------------------------------------: |
| 计数排序 |  $O(n+k)$   |                 $O(n+k)$                 | $O(n+k)$ |  是  |   整数，取值范围 $k=\max-\min+1$ 不比 $n$ 大太多   |
|  桶排序  |  $O(n+k)$   | $O(n^2)$（桶内插入排序）/ $O(n\log n)$（桶内用 `sorted`） | $O(n+k)$ |  是  |          数据大致均匀分布，$k$ 为桶数          |
| 基数排序 | $O(d(n+b))$ |               $O(d(n+b))$                | $O(n+b)$ |  是  | 非负整数或定长字符串，$d$ 为位数，$b$ 为基数（十进制 $b=10$） |



## 3 十大排序算法的Python源码

### 3.1 冒泡排序（Bubble Sort）

方法： 通过重复地遍历要排序的列表，比较相邻的元素并根据需要交换它们的位置来实现排序。（比较次数多，交换次数多）
主要思想： 前后两两比较，大小顺序错误就交换位置

代码思路：
1. 比较相邻元素，如果前者大于后者，就交换位置。
2. 从队首到队尾，每一对相邻元素都重复上述步骤，最后一个元素为最大元素。
3. 针对前n-1个元素重复。

```python
def BubbleSort(arr):
    for i in range(len(arr) - 1):
        for j in range(len(arr) - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = BubbleSort(arr_in)
    print(arr_out)
```

时间复杂度：平均和最坏情况$O(n^2)$，最好情况$O(n)$
空间复杂度：$O(1)$
稳定排序。适用于小规模数据或几乎有序的数据。



改进后的冒泡排序是对原始冒泡排序的一种优化。原始冒泡排序的基本思想是依次比较相邻的两个元素，如果它们的顺序错误就交换它们，直到没有需要交换的元素为止。这样的算法效率较低，因为即使序列已经有序，它仍然需要进行多轮的比较和交换。

改进后的冒泡排序通过增加一个标志位来优化。在每一轮比较中，如果没有发生任何交换，说明序列已经有序，不需要再进行后续的比较，因此可以提前结束排序过程。

改进后的冒泡排序实现如下所示：

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        # 标记是否发生了交换
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # 交换元素
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # 如果没有发生交换，说明数组已经排序完成
        if not swapped:
            break
    return arr
```

在这个改进后的冒泡排序算法中，如果在一轮比较中没有发生任何交换，就将标志位 `swapped` 设置为 `False`，并提前跳出循环，从而减少了不必要的比较次数，提高了效率。



### 3.2 选择排序（Selection Sort）

方法：在无序区找到最小的元素放到有序区的队尾（比较次数多，交换次数少）
主要思想：水果摊挑苹果，先挑出最小的，再挑出次小的，直到最后。
选择是对冒泡的优化，比较一轮只交换一次数据。

代码思路：
1. 找到无序待排序列中最小的元素，和第一个元素交换位置。
2. 剩下的待排无序序列（2-n）选出最小的元素，和第二个元素交换位置。
3. 直到最后选择完成。

```python
def SelectSort(arr):
    for i in range(len(arr)):
        minIndex = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[minIndex]:
                minIndex = j
        arr[i], arr[minIndex] = arr[minIndex], arr[i]
    return arr

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = SelectSort(arr_in)
    print(arr_out)
```

时间复杂度：$O(n^2)$（无论输入如何，比较次数都是 $n(n-1)/2$；交换至多 $n-1$ 次）
空间复杂度：$O(1)$
非稳定排序（跳跃式交换，见第 2 节的例子）



### 3.3 插入排序（Insertion Sort）

方法：把无序区的第一个元素插入到有序区的合适位置（比较次数少，交换次数多）
主要思想：扑克牌打牌时的插入思想，逐个插入到前面的有序数中。

代码思路：
1. 选择待排无序序列的第一个元素作为有序数列的第一个元素。
2. 把第2个元素到最后一个元素看做无序待排序列。
3. 依次从待排无序序列取出每一个元素，<mark>与有序序列的每个元素比较（从右向左扫描）</mark>，符合条件交换元素位置。

```python
def InsertSort(arr):
    for i in range(1, len(arr)):
        for j in range(i, 0, -1):
            if arr[j] < arr[j - 1]:
                arr[j], arr[j - 1] = arr[j - 1], arr[j]
    return arr

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = InsertSort(arr_in)
    print(arr_out)
```

时间复杂度：$O(n^2)$（注意：这一写法即使输入已经有序也要做 $n(n-1)/2$ 次比较，最好情况仍是 $O(n^2)$）
空间复杂度：$O(1)$
稳定排序



上面代码并没有在找到正确位置后立即停止循环，而是一直循环直到内部的 for 循环完成。

改进后的插入排序应该在找到正确位置后立即停止循环。要实现这一点，可以在内部的 for 循环中添加一个判断条件来判断是否需要继续交换。如果当前元素已经大于（或等于）前一个元素，就可以停止内部的循环了。

下面是一个改进的插入排序版本：

```python
def InsertSort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = InsertSort(arr_in)
    print(arr_out)
```

这个版本的插入排序算法在找到正确位置后会立即停止内部的循环；并且用“后移 + 一次赋值”代替逐次交换，赋值次数也约减少一半。

时间复杂度：最好情况（已有序）$O(n)$，平均和最坏情况 $O(n^2)$；更精确地说是 $O(n+d)$，$d$ 为逆序对个数。因此适合几乎有序的数据。
空间复杂度：$O(1)$
稳定排序（条件是 `key < arr[j]`，写成 `<=` 就会变得不稳定）



### 3.4 希尔排序（Shell Sort）

希尔排序是插入排序的一种更高效的改进版本，其核心思想是将待排序数组分割成若干个子序列，然后对各个子序列进行插入排序，最后再对整个序列进行一次插入排序。希尔排序的关键在于选择合适的间隔序列，以保证最终的排序效率。

代码思路：
1. 选择一个增量序列t1，t2，…，tk，其中ti>tj，tk=1。
2. 按增量序列个数k，对序列进行k趟排序。
3. 每趟排序，根据对应的增量ti，将下标相差ti的元素归为同一组（共ti组），分别对各组进行直接插入排序。仅增量因子为1时，整个序列作为一个表来处理，表长度即为整个序列的长度。

```python
def ShellSort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = ShellSort(arr_in)
    print(arr_out)
```

空间复杂度：$O(1)$
非稳定排序

希尔排序的时间复杂度取决于所使用的增量序列。没有一个统一的最佳增量序列，不同的增量序列会导致不同的时间复杂度。然而，通常情况下，希尔排序的时间复杂度可以描述如下：

- 最坏情况时间复杂度：$O(n^2)$，上面代码使用的 Shell 原始增量序列 $n/2, n/4, \dots, 1$ 就会出现这种情况；改用 Hibbard 序列 $2^k-1$ 可降到 $O(n^{3/2})$。
- 平均情况时间复杂度：根据不同的增量序列，希尔排序的平均时间复杂度可以有很大的变化，但一般认为其优于简单的插入排序，大约在$O(n^{1.25})$到$O(n^{1.6})$之间。
- 最佳情况时间复杂度：如果数组已经是有序的，或者接近有序，那么希尔排序的时间复杂度可以接近线性，即$O(n)$。

值得注意的是，对于一些特定的增量序列（如 Pratt 序列 $2^p3^q$ 可达 $O(n\log^2 n)$），希尔排序的时间复杂度可以更接近于$O(n\log n)$，但这并不普遍。因此，希尔排序对于小到中等规模的数据集是一个不错的选择，但对于非常大的数据集，可能不如快速排序或归并排序等算法高效。希尔排序的空间复杂度为$O(1)$，因为它是一种原地排序算法，不需要额外的存储空间。



> https://pythontutor.com 很好用，适合还不会用Pycharm调试工具的，当然后者也好用。另外就是print变量输出。
>
> ![image-20241021214028913](https://raw.githubusercontent.com/GMyhf/img/main/img/202410212140881.png)
>



### 3.5 归并排序（Merge Sort）

归并排序采用分治法，将待排序数组分成若干个子序列，分别进行排序，然后再合并已排序的子序列，直到整个序列都排好序为止。

代码思路：
1. 将待排序数组分成左右两个子序列，递归地对左右子序列进行归并排序。
2. 将两个已排序的子序列合并成一个有序序列。

```python
def MergeSort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = MergeSort(arr[:mid])
    right = MergeSort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # 相等时先取左边，保证稳定
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = MergeSort(arr_in)
    print(arr_out)
```

时间复杂度：$O(n\log n)$（最好、平均、最坏都一样）
空间复杂度：$O(n)$
稳定排序。注意 `merge` 中必须写 `<=`：若写成 `<`，相等元素会先取右半边，排序就不稳定了。



> 递归程序运行过程，不容易理解。https://pythontutor.com，完美展示 归并排序 的递归过程。
>
> ![image-20241021221131586](https://raw.githubusercontent.com/GMyhf/img/main/img/202410212211019.png)
>



**优化一：小区间改用插入排序——只能“当场”排**

递归到十几个元素时，函数调用和切片的固定开销超过收益，可以改用插入排序。但要注意它和快排的区别：

- 快排可以在小区间**直接返回、什么都不做**，等整个递归结束后对全数组做**一次**插入排序。此时块与块之间已经有序，每个元素离最终位置都不远，这一趟接近 $O(n)$。
- 归并**不能**这样偷懒。`merge` 的前提是左右两半**各自有序**；小区间若不排好就返回，上一层的 `merge` 得到的就是错误结果。所以归并只能在递归到小区间时**当场**做插入排序。



**优化二：Sedgewick 的哨兵（监视哨）归并**

普通 `merge` 的循环每一步都要检查 `i < len(left) and j < len(right)`，结束后还要处理剩下的一半。Sedgewick（《Algorithms》作者）的办法是：**左半段正序复制、右半段倒序复制**到辅助数组，两个指针从两端向中间走：

```python
def merge_sedgewick(a, aux, l, m, r):
    # 合并 a[l..m] 与 a[m+1..r]（闭区间，两段各自有序且都非空）
    for i in range(l, m + 1):
        aux[i] = a[i]                    # 左半段正序复制
    for j in range(m + 1, r + 1):
        aux[r + m + 1 - j] = a[j]        # 右半段倒序复制
    i, j = l, r                          # 一个从左往右，一个从右往左
    for k in range(l, r + 1):            # 循环里没有任何越界检查
        if aux[j] < aux[i]:
            a[k] = aux[j]
            j -= 1
        else:
            a[k] = aux[i]
            i += 1


def merge_sort_sedgewick(a):
    aux = [None] * len(a)                # 辅助数组只开一次，各层递归复用

    def sort(l, r):
        if l >= r:
            return
        m = (l + r) // 2
        sort(l, m)
        sort(m + 1, r)
        merge_sedgewick(a, aux, l, m, r)

    sort(0, len(a) - 1)
    return a

if __name__ == "__main__":
    print(merge_sort_sedgewick([6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1]))
    # [1, 2, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 18, 19]
```

为什么不会越界：以左 `[1, 3, 5]`、右 `[2, 4, 6]` 为例，复制后 `aux = [1, 3, 5, 6, 4, 2]`，呈“山峰”状，两段各自的最大值 5 和 6 在中间相邻。

- 左段先取完时，`i` 越过中点，停在右段的最大值 6 上。右段剩下的元素都不大于 6：要么 `aux[j] < aux[i]` 取 `aux[j]`，要么二者相等取 `aux[i]`（它也是右段的元素）。`i`、`j` 只会在 `[l, r]` 内相向收拢，`k` 走满 `r - l + 1` 步时恰好取完，不需要任何越界判断。
- 右段先取完时，`j` 停在左段的最大值 5 上，同理充当哨兵。

代价：**这种写法不稳定**。平局时取左边，所以单看“右段倒序”并不会打乱次序；问题出在**左段先取完之后**：`i` 越过中点进入倒序的右段，是从右段的**末尾**开始往回取，右段里相等的最大值就被反序输出了。最小反例：

```python
# 左段 [1]，右段 [2a, 2b]：aux = [1, 2b, 2a]
# k=0：2a < 1 ? 否 → 取 1，i 走到 2b
# k=1：2a < 2b ? 否（相等）→ 取 aux[i] = 2b   ← 2b 跑到了 2a 前面
# k=2：取 2a
# 结果 [1, 2b, 2a]，不稳定
```

（右段先取完的情形仍然稳定：此时 `j` 停在左段最大值上，`aux[j] < aux[i]` 不可能成立，剩下的左段按原次序取完。）所以需要稳定性的场合（如 C++ `std::stable_sort`）不用这个技巧；只排整数、追求内层循环最少分支时才值得用。



### 3.6 快速排序（Quick Sort）

快速排序是一种高效的排序算法，采用分治法的思想，通过将数组分割成较小的子数组，然后分别对子数组进行排序，最终将数组整合成有序序列。

代码思路：
1. 选择数组中的一个元素作为基准（pivot）。
2. 将数组分割成两个子数组，使得左子数组中的所有元素都小于基准，右子数组中的所有元素都大于基准。
3. 对左右子数组递归地进行快速排序。

```python
def QuickSort(arr):
    if len(arr) <= 1:
        return arr
    else:
        pivot = arr[0]  # Choose the first element as the pivot
        left = [x for x in arr[1:] if x < pivot]
        right = [x for x in arr[1:] if x >= pivot]
        return QuickSort(left) + [pivot] + QuickSort(right)

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = QuickSort(arr_in)
    print(arr_out)
```

时间复杂度：平均情况下为$O(n\log n)$，最坏情况下为$O(n^2)$（取首元素为基准时，数组已经有序或逆序、或大量重复元素都会退化）
空间复杂度：这种写法每层都新建列表，不是原地排序，平均额外空间 $O(n)$；退化时递归深度为 $n$，对上千个已有序元素会触发 `RecursionError`（Python 默认递归上限约 1000）
稳定性：这种写法恰好是稳定的（列表推导保持原有次序，与基准相等的元素都在基准之后）；但通常所说的原地快排（如下面的双指针版本）是不稳定的。

写法简洁，适合理解思想；实际使用时可改为随机选基准 `pivot = random.choice(arr)`，并把与基准相等的元素单独分为一组（三路划分），以避免退化。



如果用双指针实现，在partition函数中用两个指针 `i` 和 `j` 的方式实现，这是原地排序。以最右元素为基准：`i` 从左向右找第一个 $\ge$ pivot 的元素，`j` 从右向左找第一个 $<$ pivot 的元素，二者交换；指针相遇后，`i` 就是基准的最终位置。

```python
def quicksort(arr, left, right):
    if left < right:
        partition_pos = partition(arr, left, right)
        quicksort(arr, left, partition_pos - 1)
        quicksort(arr, partition_pos + 1, right)


def partition(arr, left, right):
    i = left
    j = right - 1
    pivot = arr[right]
    while i <= j:
        while i <= right and arr[i] < pivot:
            i += 1
        while j >= left and arr[j] >= pivot:
            j -= 1
        if i < j:
            arr[i], arr[j] = arr[j], arr[i]
    # 此时 arr[left..i-1] < pivot，arr[i..right-1] >= pivot，把基准放到位置 i
    if arr[i] > pivot:
        arr[i], arr[right] = arr[right], arr[i]
    return i


if __name__ == "__main__":
    arr = [22, 11, 88, 66, 55, 77, 33, 44]
    quicksort(arr, 0, len(arr) - 1)
    print(arr)

# [11, 22, 33, 44, 55, 66, 77, 88]
```

时间复杂度：平均 $O(n\log n)$，最坏 $O(n^2)$；空间复杂度：递归栈平均 $O(\log n)$，最坏 $O(n)$；不稳定排序。



**另外两种原地分割写法**

原地快排的差别全在 `partition`。除了上面“两头各找一个、成对交换”的写法，教材里还常见两种，它们都以末元素为基准，分割后的排列不同，但都把基准放到最终位置。课件第 8 章的图 8.7 是**挖坑填数**，配套代码 `modern.hpp` 的 `partition` 是 **Lomuto**——两者本来就不是同一种写法。

① **Lomuto 分割（单向扫描，CLRS《算法导论》采用）**：`boundary`（慢指针）和 `i`（快指针）都从左往右走；`a[first..boundary-1]` 始终都小于基准，遇到小于基准的元素就换到 `boundary` 处，扫完后把基准换到 `boundary`。

② **挖坑填数（两端交替，严蔚敏《数据结构》等国内教材常用，即课件图 8.7）**：先把基准暂存，末位就成了一个“坑”；`l` 从左往右找比基准大的，填进右边的坑，`l` 处成了新坑；`r` 再从右往左找比基准小的，填进左边的坑……两端交替，`l`、`r` 相遇处就是基准的最终位置。全程只有赋值、没有交换。

```python
def partition_lomuto(arr, first, last):
    pivot = arr[last]                    # 末元素当基准
    boundary = first                     # [first, boundary) 都 < pivot
    for i in range(first, last):         # [boundary, i) 都 >= pivot
        if arr[i] < pivot:
            arr[boundary], arr[i] = arr[i], arr[boundary]
            boundary += 1
    arr[boundary], arr[last] = arr[last], arr[boundary]
    return boundary


def partition_hole(arr, l, r):
    pivot = arr[r]                       # 暂存基准，arr[r] 成为“坑”
    while l < r:
        while l < r and arr[l] <= pivot:
            l += 1
        arr[r] = arr[l]                  # 大的填进右边的坑，l 处成为新坑
        while l < r and arr[r] >= pivot:
            r -= 1
        arr[l] = arr[r]                  # 小的填进左边的坑，r 处成为新坑
    arr[l] = pivot                       # 相遇处回填基准
    return l


def quick_sort_with(arr, partition, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort_with(arr, partition, lo, p - 1)
        quick_sort_with(arr, partition, p + 1, hi)
    return arr

if __name__ == "__main__":
    print(quick_sort_with([22, 11, 88, 66, 55, 77, 33, 44], partition_lomuto))
    print(quick_sort_with([22, 11, 88, 66, 55, 77, 33, 44], partition_hole))
    # 两行都输出 [11, 22, 33, 44, 55, 66, 77, 88]
```

| 写法 | 指针 | 每步操作 | 交换/赋值量 | 全部相等的输入 |
| :--: | :--: | :--: | :--: | :--: |
| 成对交换（上文双指针） | 相向 | 两边各找到一个逆置元素就交换 | 较少 | 退化为 $O(n^2)$ |
| Lomuto | 同向（快慢指针） | 小于基准就与 `boundary` 交换 | 最多，约为成对交换的 3 倍 | 退化为 $O(n^2)$ |
| 挖坑填数 | 相向、交替 | 单向赋值填坑，不交换 | 较少 | 退化为 $O(n^2)$ |

三种写法都不稳定，平均 $O(n\log n)$、最坏 $O(n^2)$。Lomuto 最好写、不容易写错边界；想避免“全部相等”时退化，可让两边遇到相等也停下来交换（Hoare 原版），或改成三路划分（`<`、`=`、`>` 三段）。





### 3.7 堆排序（Heap Sort）

堆排序利用了堆这种数据结构的特性，将待排序数组构建成一个二叉堆，然后对堆进行排序。

代码思路：
1. 构建一个最大堆（或最小堆），将待排序数组转换成堆。
2. 从堆顶开始，每次将堆顶元素与堆的最后一个元素交换，然后重新调整堆。
3. 重复上述步骤，直到整个堆排序完成。

```python
def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def HeapSort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
    return arr

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = HeapSort(arr_in)
    print(arr_out)
```

时间复杂度：$O(n\log n)$（建堆 $O(n)$，之后 $n-1$ 次调整各 $O(\log n)$）
空间复杂度：$O(1)$（上面 `heapify` 用了递归，递归深度为 $O(\log n)$；改成 while 循环即为严格 $O(1)$）
不稳定排序



### 3.8 计数排序（Counting Sort）

计数排序是一种非比较性的排序算法，适用于待排序元素为整数、且取值范围较小的情况。该算法通过统计每个元素出现的次数，然后根据统计结果重构排序后的数组。

代码思路：
1. 统计数组中每个元素出现的次数，并存储在额外的计数数组中。
2. 根据计数数组中的统计结果，重构排序后的数组。

```python
def CountingSort(arr):
    if not arr:
        return arr
    min_value, max_value = min(arr), max(arr)
    count = [0] * (max_value - min_value + 1)  # 用 min_value 做偏移，支持负数
    for num in arr:
        count[num - min_value] += 1
    sorted_arr = []
    for i, c in enumerate(count):
        sorted_arr.extend([i + min_value] * c)
    return sorted_arr

if __name__ == "__main__":
    arr_in = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(arr_in)
    arr_out = CountingSort(arr_in)
    print(arr_out)
```

时间复杂度：$O(n + k)$，其中n是数组的长度，$k = \max - \min + 1$ 是取值范围
空间复杂度：$O(n + k)$

> 原先的写法 `count = [0] * (max_value + 1)` 不做偏移，遇到负数时 `count[-1]` 会被 Python 当作“倒数第一个”，**不报错但结果错误**，例如 `[3, -1, 2]` 会输出 `[2, 3, 3]`。

上面的版本直接“按值重写”，只适合排纯整数。如果要按整数键给**记录**排序（例如作为基数排序的子过程），需要用前缀和计算每个值的最终位置，并从后往前放置以保证稳定：

```python
def CountingSortStable(arr, key=lambda x: x):
    if not arr:
        return arr
    keys = [key(x) for x in arr]
    lo = min(keys)
    count = [0] * (max(keys) - lo + 1)
    for k in keys:
        count[k - lo] += 1
    for i in range(1, len(count)):  # 前缀和：count[i] = 键值 <= i 的元素个数
        count[i] += count[i - 1]
    output = [None] * len(arr)
    for x, k in zip(reversed(arr), reversed(keys)):  # 从后往前，保证稳定
        count[k - lo] -= 1
        output[count[k - lo]] = x
    return output

if __name__ == "__main__":
    print(CountingSortStable([(3, 'a'), (1, 'b'), (3, 'c'), (1, 'd')], key=lambda t: t[0]))
    # [(1, 'b'), (1, 'd'), (3, 'a'), (3, 'c')]
```

> ![image-20241021225923484](https://raw.githubusercontent.com/GMyhf/img/main/img/202410212259316.png)



### 3.9 桶排序（Bucket Sort）

桶排序假设输入数据大致均匀地分布在某个区间上（经典表述是均匀、独立地分布在 [0, 1) 区间）。把区间等分成若干个桶，每个桶内元素很少，分别排序后依次拼接即可。下面的代码先求出最小值和最大值，因此适用于任意区间的数值。

代码思路：
1. 创建一个定量的桶数组，并初始化每个桶为空。
2. 将每个元素放入对应的桶中。
3. 对每个非空桶进行排序。
4. 从每个桶中将排序后的元素依次取出，得到排序结果。

```python
def BucketSort(arr):
    n = len(arr)
    if n <= 1:
        return arr
    max_val = max(arr)
    min_val = min(arr)
    if max_val == min_val:  # 所有元素相等，否则下面会除以 0
        return arr

    buckets = [[] for _ in range(n)]  # 桶的个数取 n

    for num in arr:
        index = int((num - min_val) / (max_val - min_val) * (n - 1))
        buckets[index].append(num)

    sorted_arr = []
    for bucket in buckets:
        sorted_arr.extend(sorted(bucket))

    return sorted_arr

if __name__ == "__main__":
    arr_in = [0.897, 0.565, 0.656, 0.1234, 0.665, 0.3434]
    print(arr_in)
    arr_out = BucketSort(arr_in)
    print(arr_out)

#[0.1234, 0.3434, 0.565, 0.656, 0.665, 0.897]
```

时间复杂度：数据均匀分布时平均 $O(n + k)$，其中n是数组的长度，k是桶的数量；若数据都落进同一个桶，退化为桶内排序的复杂度（这里用 `sorted`，即 $O(n\log n)$）
空间复杂度：$O(n + k)$
稳定排序（`sorted` 是稳定的，且元素按原次序入桶）



### 3.10 基数排序（Radix Sort）

基数排序是一种非比较型整数排序算法，它通过按位处理数字来排序，通常用于处理非负整数（下面的代码不支持负数；如有负数，可先整体加上 $-\min$ 偏移，排完再减回去）。

基数排序是一种多关键字的排序算法，它将整数按位数切割成不同的数字，然后按每个位数分别比较。

代码思路：
1. 找出数组中最大值，并确定最大值的位数。
2. 从最低位（个位）到最高位，依次按当前位把元素放进 0~9 号桶，再按桶号顺序收集（LSD，Least Significant Digit first）。
3. 每一趟按位分配必须是**稳定**的，这样高位相同的元素才能保持低位已经排好的次序。

```python
def RadixSort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    digit = len(str(max_val))

    for i in range(digit):
        bucket = [[] for _ in range(10)]
        for num in arr:
            bucket[num // (10 ** i) % 10].append(num)
        # for row in bucket:
        #     print(*row)
        arr = [num for sublist in bucket for num in sublist]
        # arr = []
        # for sublist in bucket:
        #     for num in sublist:
        #         arr.append(num)
        #print(arr)

    return arr

if __name__ == "__main__":
    arr_in = [170, 45, 75, 90, 802, 24, 2, 66]
    print(arr_in)
    arr_out = RadixSort(arr_in)
    print(arr_out)
```

时间复杂度：$O(d(n + b))$，其中n是数组的长度，d是最大值的位数，b是基数（这里 $b=10$），常简写为 $O(nd)$
空间复杂度：$O(n + b)$
稳定排序



**每一趟用计数排序实现**

上面每趟都新建 10 个列表当桶。也可以像 3.8 节的稳定版计数排序那样，用“计数 → 前缀和 → **从后往前**放置”完成每一趟，只需一个长度为 10 的计数数组和一个长度为 n 的输出数组：

```python
def counting_sort_by_digit(arr, exp):
    # 按 exp 所在的那一位（exp = 1 个位、10 十位、100 百位……）做一次稳定的计数排序
    count = [0] * 10
    for x in arr:
        count[x // exp % 10] += 1
    for d in range(1, 10):               # 前缀和：count[d] = 该位 <= d 的元素个数
        count[d] += count[d - 1]
    output = [0] * len(arr)
    for x in reversed(arr):              # 从后往前放，保证稳定
        d = x // exp % 10
        count[d] -= 1
        output[count[d]] = x
    return output


def RadixSortCounting(arr):
    if not arr:
        return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:            # 从个位开始，逐位稳定排序
        arr = counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

if __name__ == "__main__":
    print(RadixSortCounting([170, 45, 75, 90, 802, 24, 2, 66]))
    # [2, 24, 45, 66, 75, 90, 170, 802]
```

逐趟结果（把位数补齐看更清楚）：

| 趟 | 结果 |
| :--: | :-- |
| 初始 | 170, 045, 075, 090, 802, 024, 002, 066 |
| 按个位 | 170, 090, 802, 002, 024, 045, 075, 066 |
| 按十位 | 802, 002, 024, 045, 066, 170, 075, 090 |
| 按百位 | 002, 024, 045, 066, 075, 090, 170, 802 |

为什么“先排低位、再排高位”是对的：按十位排时，`45` 和 `42` 十位相同，**这一趟稳定**，所以上一趟按个位排出的 `42` 在 `45` 前的次序被保留下来。任何一趟不稳定，前面各趟的成果都会被打乱。



### 3.11 索引排序（Index Sort，补充）

**通俗讲法**

给全班同学按身高排座位，有两种做法：

- 让同学们**真的起身换座位**——这就是前面十种排序在做的“搬记录”；
- 老师只在纸上写一张**名单**：“第 1 个座位坐 5 号同学，第 2 个座位坐 1 号同学……”。同学一个都不动，排的只是这张名单。

当每条记录很大（一条学籍几百字节、一张图片几 MB）时，搬一次记录远比比较一次贵，只排“名单”就划算得多。这张名单就是**索引**：

> `index[i]` = 排序后第 i 位的记录在原数组中的下标，即 **有序结果[i] == records[index[i]]**。

（另一种约定是 `rank[j]` = 原数组第 j 条记录排完后在第几位，两者互为逆置换，做题时先看清用的是哪一种。）

如果最后确实需要让记录本身按顺序排好，再按名单**一次到位**地整理：沿着“置换环”走，每个不在位的元素只搬一次。

**第一步：排索引（记录一次都不搬）**

排索引可以用任何排序算法，比较时通过下标去取记录的键。下面用插入排序：

```python
def index_sort(records, key=lambda r: r):
    index = list(range(len(records)))       # 名单初始为 0, 1, ..., n-1
    for i in range(1, len(records)):
        cur = index[i]
        j = i - 1
        # 比较的是记录的键，挪动的只是下标
        while j >= 0 and key(records[cur]) < key(records[index[j]]):
            index[j + 1] = index[j]
            j -= 1
        index[j + 1] = cur
    return index

if __name__ == "__main__":
    scores = [29, 25, 34, 64, 34, 12, 32, 45]
    print(index_sort(scores))           # [5, 1, 0, 6, 2, 4, 7, 3]
    print(scores)                       # 原数组没动：[29, 25, 34, 64, 34, 12, 32, 45]
```

Python 里这件事就是 argsort，用内置的 `sorted` 一行即可，而且同样稳定：

```python
def argsort(records, key=lambda r: r):
    return sorted(range(len(records)), key=lambda i: key(records[i]))

if __name__ == "__main__":
    print(argsort([29, 25, 34, 64, 34, 12, 32, 45]))   # [5, 1, 0, 6, 2, 4, 7, 3]
```

**第二步（需要时）：按索引原地整理**

```python
def adjust_by_index(records, index):
    # 沿置换环把记录搬到位；结束后 index 变为 0, 1, ..., n-1
    for first in range(len(records)):
        if index[first] == first:          # 已在位，或所在的环已处理过
            continue
        saved = records[first]             # 起点腾空
        cur = first
        while index[cur] != first:         # 顺着环走：cur 位置应取 index[cur] 处的记录
            src = index[cur]
            records[cur] = records[src]
            index[cur] = cur               # 到位一个，标记一个
            cur = src
        records[cur] = saved               # 走回起点，把腾空的记录放进最后一个位置
        index[cur] = cur

if __name__ == "__main__":
    students = [("甲", 29), ("乙", 25), ("丙", 34), ("丁", 64),
                ("戊", 34), ("己", 12), ("庚", 32), ("辛", 45)]
    idx = sorted(range(len(students)), key=lambda i: students[i][1])  # 第一步：排索引（也可用 index_sort）
    print(idx)                          # [5, 1, 0, 6, 2, 4, 7, 3]
    print([students[i] for i in idx])   # 原数组不动，按名单读出有序结果
    adjust_by_index(students, idx)      # 需要时再原地整理
    print(students)
    # [('己', 12), ('乙', 25), ('甲', 29), ('庚', 32), ('丙', 34), ('戊', 34), ('辛', 45), ('丁', 64)]
```

手算整理过程（键值 `[29, 25, 34, 64, 34′, 12, 32, 45]`，`index = [5, 1, 0, 6, 2, 4, 7, 3]`）：

| 环 | 走法 | 整理后 |
| :--: | :-- | :-- |
| {0, 5, 4, 2} | 暂存 29；0 ← 5 的 12，5 ← 4 的 34′，4 ← 2 的 34；回到 0，29 放进 2 | 12, 25, 29, 64, 34, 34′, 32, 45 |
| {1} | 25 已在位，跳过 | 不变 |
| {3, 6, 7} | 暂存 64；3 ← 6 的 32，6 ← 7 的 45；回到 3，64 放进 7 | 12, 25, 29, 32, 34, 34′, 45, 64 |

两个 34 的次序没变：`index` 里下标 2 排在 4 前面，因为插入排序不越过相等元素。

**复杂度分析**

| 阶段 | 比较次数 | 记录移动 | 额外空间 |
| :--: | :--: | :--: | :--: |
| 排索引 | 与所用排序相同：插入排序 $O(n^2)$，`sorted` 为 $O(n\log n)$ | **0 次** | 索引数组 $O(n)$ |
| 原地整理 | 0 | 每个不在位的元素恰好写 1 次（含最后的回填），每个长度为 L 的环另加 1 次暂存，即 L + 1 次；环长至少 2，合计不超过 $1.5n$ 次，即 $O(n)$ | $O(1)$（一个 `saved`） |

- 整理是 $O(n)$ 的原因：每个下标一旦到位就被改成自己（`index[cur] = cur`），外层循环再遇到它直接跳过，所以每个元素只被处理一次。
- 也可以不原地整理，直接 `[records[i] for i in index]` 生成新表：同样 $O(n)$ 时间，但要 $O(n)$ 额外空间。
- 稳定性由排索引所用的算法决定：插入排序、`sorted` 都稳定，索引排序就稳定。
- `adjust_by_index` 会把 `index` 改成 `0, 1, …, n-1`；之后还要用名单的话，先复制一份。
- 适用场景：记录大、比较便宜；或者原数组不允许改动（例如同时要按多个关键字给同一份数据建多张“名单”）。
