# 排序算法详解：Python 与 C++ 实现

Updated Nov 10 2026

2024 spring, Compiled by Hongfei Yan



Logs:

2026/11/10（三）标题由「Python十大排序算法源码」改为现名。对照课件 `202609_DSA_08_Sorting.pptx` 补充：Hibbard 增量、归并的「已有序跳过」与自底向上归并、逆序对计数、快排的三路划分与工程版（随机基准 + 短侧递归 + 小区间插入）、快速选择、树排序、有符号整数的基数排序、链表归并排序、k 路归并、标准库排序（Timsort / introsort）与比较排序下界。全部算法给出 C++17 实现；Python 函数统一为 snake_case 命名；按「简单排序 → 归并 → 快排 → 堆 → 分配 → 索引 → 链表与多路 → 标准库与理论」重排章节。

2026/11/10（二）补充：快排的 Lomuto 与挖坑填数两种分割；归并的 Sedgewick 哨兵写法（含不稳定反例）与「小区间只能当场插入排序」；基数排序的计数排序版；索引排序。

2026/11/10（一）修正归并排序稳定性（`<` 改 `<=`）；修正桶排序在全部元素相等/只有一个元素时除零；计数排序支持负数（原代码遇负数会静默输出错误结果）并补充稳定版；修正快排、计数、桶、基数排序的复杂度与稳定性描述。

2024/5/3 增加了改进冒泡排序，增加了改进的插入排序，增加了双指针实现的快排。

2024/4/13 取自, https://blog.csdn.net/wtandyn/article/details/119577831



## 1 前言

经常用到各种排序算法，但网上的排序源码质量参差不齐。这里结合课件第 8 章「内部排序」（`202609_DSA_08_Sorting.pptx`）和个人理解，整理了一份可以直接运行、并经过测试的排序算法源码。每种算法依次给出：**思路 → Python 实现 → C++ 实现 → 复杂度与稳定性**。

| 章节 | 内容 |
| :-- | :-- |
| 3 简单排序 | 冒泡、选择、插入、希尔 |
| 4 归并排序 | 自顶向下、三处优化（小区间插入、已有序跳过、Sedgewick 哨兵）、自底向上、逆序对计数 |
| 5 快速排序 | 列表推导版、三种原地分割、三路划分、工程版、快速选择、树排序 |
| 6 堆排序 | 建堆 + 反复取堆顶 |
| 7 分配排序 | 计数、桶、基数（含有符号整数） |
| 8 索引排序 | 只排下标，再沿置换环整理 |
| 9 链表与多路归并 | 链表归并排序、k 路归并 |
| 10 标准库与理论 | Timsort、introsort、比较排序下界、易错点 |

约定：

- 一律排成**非递减**（升序）。
- Python 用 3.10+。原地排序的函数修改传入的列表，并把它返回以便打印；归并（切片版）、计数、桶、基数等返回新列表。
- C++ 用 C++17，函数一般写成 `void xxx_sort(std::vector<int>& a)`，原地修改。编译：`g++ -std=c++17 -O2 -Wall -Wextra demo.cpp`。
- 每段代码都能**单独运行**；示例数据统一用 `[6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]`。
- 所有排序函数都与 `sorted` / `std::sort` 做过随机对拍，边界覆盖空序列、单元素、全部相等，以及（适用时）负数。



## 2 排序算法的选取规则

选择合适的排序算法取决于多种因素，包括数据的规模、特性、性能要求、稳定性要求、内存限制等。

**数据规模**

小规模，通常指几十到几千个元素：插入排序、选择排序、冒泡排序。$O(n^2)$ 算法用 Python 排 $10^4$ 个随机数已需约 3 秒。

中规模，通常指几万到几百万个元素：快速排序、归并排序、堆排序、希尔排序。

大规模，通常指几百万到几亿个元素：归并排序、快速排序、堆排序；数据无法一次装入内存时用外部排序（课件第 9 章）、分布式排序。

**数据特性**

- 几乎有序：插入排序（$O(n+d)$，$d$ 为逆序对个数）；Python 内置的 Timsort 对这类数据也接近线性。
- 整数且取值范围小：计数排序。
- 数据大致均匀分布在已知区间：桶排序。
- 固定长度的整数或字符串：基数排序。
- 大量重复值：三路划分的快速排序。
- 单条记录很大、搬不起：索引排序（只排下标）。
- 只要前 $k$ 个或第 $k$ 个：快速选择、堆，不必全排。

**性能要求**

- 平均最快：快速排序。
- 最坏也要 $O(n\log n)$：归并排序、堆排序（C++ `std::sort` 用 introsort 兼顾两者）。

**稳定性要求**

需要稳定排序：归并排序、插入排序、冒泡排序、计数排序（前缀和版）、基数排序、桶排序（桶内用稳定排序）、树排序（相等进右子树）。Python 的 `sorted` / `list.sort` 和 C++ 的 `std::stable_sort` 也是稳定的。

**内存限制**

$O(1)$ 额外空间（原地）：堆排序、希尔排序，以及冒泡、选择、插入排序。快速排序只需递归栈 $O(\log n)$（短侧递归可保证）。归并排序要 $O(n)$ 辅助数组。



**稳定性**

稳定性是指**相等元素在排序后的相对次序是否保持不变**。保持不变就是稳定的，否则是不稳定的。

稳定性有实际用处：先按姓名排，再**稳定地**按成绩排，同分的同学仍按姓名排列；LSD 基数排序每一趟都依赖上一趟的成果，所以每一趟都必须稳定。

判断一个排序是否稳定，常见的方法是观察交换操作：**挨着交换**（相邻元素交换，且只在严格大于时交换）是稳定的；**隔着交换**（跳跃式移动）可能导致不稳定。例如选择排序对 `[5a, 5b, 2]` 第一轮把 `5a` 与 `2` 交换，得到 `[2, 5b, 5a]`，两个 5 的相对次序被打乱。证明稳定要对任意一对相等元素论证；证明不稳定，举一个反例就够。



**复杂度总表**

| 算法 | 最好 | 平均 | 最坏 | 额外空间 | 稳定 | 类别 |
| :-- | :--: | :--: | :--: | :--: | :--: | :--: |
| 冒泡（带提前结束） | $n$ | $n^2$ | $n^2$ | $1$ | 是 | 交换 |
| 选择 | $n^2$ | $n^2$ | $n^2$ | $1$ | 否 | 选择 |
| 插入 | $n$ | $n^2$ | $n^2$ | $1$ | 是 | 插入 |
| 希尔 | $n\log n$ | 取决于增量 | 减半增量 $n^2$；Hibbard $n^{3/2}$ | $1$ | 否 | 插入 |
| 归并 | $n\log n$ | $n\log n$ | $n\log n$ | $n$ | 是 | 归并 |
| 快速（原地） | $n\log n$ | $n\log n$ | $n^2$ | 栈 $\log n$ | 否 | 交换（分割） |
| 堆 | $n\log n$ | $n\log n$ | $n\log n$ | $1$ | 否 | 选择 |
| 树排序（普通 BST） | $n\log n$ | $n\log n$ | $n^2$ | $n$ | 是 | 插入（与快排同构） |
| 计数 | $n+k$ | $n+k$ | $n+k$ | $n+k$ | 是（前缀和版） | 分配，$k$ 为值域长度 |
| 桶 | $n+k$ | $n+k$ | $n^2$ 或 $n\log n$（看桶内排序） | $n+k$ | 是（桶内稳定时） | 分配，$k$ 为桶数 |
| 基数（LSD） | $d(n+b)$ | $d(n+b)$ | $d(n+b)$ | $n+b$ | 是 | 分配，$d$ 位、基数 $b$ |
| Timsort（Python） | $n$ | $n\log n$ | $n\log n$ | $n$ | 是 | 插入 + 归并 |
| introsort（C++ `std::sort`） | $n\log n$ | $n\log n$ | $n\log n$ | $\log n$ | 否 | 快排 + 堆 + 插入 |

表中省略了 $O(\cdot)$。基于比较的排序，最坏情况至少要 $\Omega(n\log n)$ 次比较（证明见 10.3 节），平均情况也一样；计数、桶、基数排序不做元素间的比较，所以不受这个下界限制，但对数据有要求。



## 3 简单排序

### 3.1 冒泡排序（Bubble Sort）

**思路**：从前往后比较相邻的两个元素，前者大就交换。一趟走完，最大的元素像气泡一样“冒”到末尾；对剩下的前 $n-1$ 个元素重复，直到全部有序。

**优化**：记一个标志 `swapped`。如果某一趟一次交换都没有，说明已经有序，立即结束。这样输入本来有序时只需一趟、$n-1$ 次比较。去掉 `swapped` 就是最原始的冒泡排序。

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):          # 末尾 i 个元素已经就位
            if arr[j] > arr[j + 1]:         # 严格大于才交换：相等元素不换位，稳定
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:                     # 一趟没有交换：已经有序，提前结束
            break
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(bubble_sort(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <utility>
#include <vector>

void bubble_sort(std::vector<int>& a) {
    const int n = static_cast<int>(a.size());
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; ++j) {
            if (a[j] > a[j + 1]) {              // 严格大于才交换：稳定
                std::swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;                    // 一趟没有交换：提前结束
    }
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    bubble_sort(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间复杂度：最好 $O(n)$（已有序，一趟就结束）；平均和最坏 $O(n^2)$（逆序时比较、交换各 $n(n-1)/2$ 次）。
空间复杂度：$O(1)$。
稳定排序。把 `>` 写成 `>=` 稳定性就没了。
一次交换等于三次赋值，所以同为 $O(n^2)$，冒泡通常比插入排序慢好几倍（课件实测 5 万个随机数慢 27 倍）。



### 3.2 选择排序（Selection Sort）

**思路**：像在水果摊挑苹果：先从全部里挑出最小的放到第 1 位，再从剩下的里挑出次小的放到第 2 位……第 $i$ 轮在无序区 `arr[i..n-1]` 中找到最小元素，与 `arr[i]` 交换。

它的特点是**比较次数多、交换次数少**：每一轮只交换一次，总共至多 $n-1$ 次。记录很大、比较却很便宜时，这一点很有用。

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):           # 在无序区 arr[i..n-1] 中找最小
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:                    # 一轮只交换一次
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(selection_sort(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <utility>
#include <vector>

void selection_sort(std::vector<int>& a) {
    const int n = static_cast<int>(a.size());
    for (int i = 0; i < n - 1; ++i) {
        int min_idx = i;
        for (int j = i + 1; j < n; ++j) {
            if (a[j] < a[min_idx]) min_idx = j;
        }
        if (min_idx != i) std::swap(a[i], a[min_idx]);
    }
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    selection_sort(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间复杂度：$O(n^2)$。无论输入如何，比较次数都是 $n(n-1)/2$，所以最好情况也是 $O(n^2)$；交换至多 $n-1$ 次。
空间复杂度：$O(1)$。
不稳定排序：交换是跳跃式的，例子见第 2 节的 `[5a, 5b, 2]`。



### 3.3 插入排序（Insertion Sort）

**思路**：像打扑克牌时理牌。把第一个元素看作有序区，之后每次取无序区的第一个元素，在有序区中**从右往左**找到它的位置插进去。

先看一个常见但不够好的写法：逐对交换，而且找到位置后不停下来。

```python
def insertion_sort_swap(arr):
    for i in range(1, len(arr)):
        for j in range(i, 0, -1):           # 一直扫到最左端，不会提前停
            if arr[j] < arr[j - 1]:
                arr[j], arr[j - 1] = arr[j - 1], arr[j]
    return arr

if __name__ == "__main__":
    print(insertion_sort_swap([6, 5, 18, 2, 16, 4, 4, 8, 1]))   # [1, 2, 4, 4, 5, 6, 8, 16, 18]
```

结果是对的，但两处浪费：

1. 找到正确位置后内层循环还在继续，即使输入已经有序也要比较 $n(n-1)/2$ 次，**最好情况丢了 $O(n)$**；
2. 每挪一格都是一次交换（三次赋值）。

改进的写法：先把待插入的元素 `key` 暂存，比它大的元素依次**后移一格**，遇到不大于它的就停，再把 `key` 放进空位。

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]                        # 暂存待插入元素，腾出一个空位
        j = i - 1
        while j >= 0 and key < arr[j]:      # 严格小于：相等就停，稳定
            arr[j + 1] = arr[j]             # 比 key 大的后移一格
            j -= 1
        arr[j + 1] = key
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(insertion_sort(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

注意 `j >= 0` 不能省：Python 中 `arr[-1]` 是合法下标，它会悄悄取到最后一个元素，程序不报错但结果是错的。C++ 越界则是未定义行为。

```cpp
#include <iostream>
#include <vector>

void insertion_sort(std::vector<int>& a) {
    const int n = static_cast<int>(a.size());
    for (int i = 1; i < n; ++i) {
        const int key = a[i];
        int j = i - 1;
        while (j >= 0 && key < a[j]) {          // 严格小于：稳定
            a[j + 1] = a[j];
            --j;
        }
        a[j + 1] = key;
    }
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    insertion_sort(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间复杂度：最好 $O(n)$（已有序）；平均和最坏 $O(n^2)$。更精确地说是 $O(n+d)$，$d$ 为逆序对个数：每后移一格恰好消掉一个逆序对。随机排列平均有 $n(n-1)/4$ 个逆序对，所以平均是 $O(n^2)$。
空间复杂度：$O(1)$。
稳定排序。条件写成 `key <= arr[j]` 就不稳定了。
插入排序在小规模、几乎有序的数据上最快，因此常被用作其他算法的“收尾”：快排、归并的小区间优化，Timsort，C++ 的 introsort 都用到它。



### 3.4 希尔排序（Shell Sort）

**思路**：插入排序慢在“一次只能挪一格”：一个很小的元素落在末尾，要一格一格挪回来。希尔排序先让元素**跨大步**移动：

1. 选一个增量序列 $t_1 > t_2 > \dots > t_k = 1$；
2. 对每个增量 $t$，把下标相差 $t$ 的元素归为一组（共 $t$ 组），每组各自做插入排序；
3. 增量逐步缩小，最后一趟增量为 1，就是一次普通的插入排序。此时序列已经基本有序，这一趟很快。

增量序列决定了复杂度。Shell 原始序列是 $n/2, n/4, \dots, 1$；Hibbard 序列是 $2^k-1$（…, 15, 7, 3, 1），相邻增量互素，效果更好。OJ 15265 要求的就是 Hibbard 增量。

```python
def shell_sort(arr, gaps=None):
    n = len(arr)
    if gaps is None:                        # Shell 原始增量：n//2, n//4, ..., 1
        gaps, g = [], n // 2
        while g > 0:
            gaps.append(g)
            g //= 2
    for gap in gaps:
        for i in range(gap, n):             # 就是插入排序，只是把“减 1”换成“减 gap”
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
    return arr


def hibbard_gaps(n):
    # Hibbard 增量：2^k - 1 中小于 n 的，从大到小，例如 n = 10 得 [7, 3, 1]
    gaps, k = [], 1
    while (1 << k) - 1 < n:
        gaps.append((1 << k) - 1)
        k += 1
    return gaps[::-1] or [1]

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(shell_sort(data[:]))
    print(shell_sort(data[:], hibbard_gaps(len(data))))   # 增量 [15, 7, 3, 1]
    # 两行都输出 [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <vector>

void shell_sort_with_gaps(std::vector<int>& a, const std::vector<int>& gaps) {
    const int n = static_cast<int>(a.size());
    for (int gap : gaps) {
        for (int i = gap; i < n; ++i) {
            const int temp = a[i];
            int j = i;
            while (j >= gap && a[j - gap] > temp) {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = temp;
        }
    }
}

void shell_sort(std::vector<int>& a) {                 // Shell 原始增量 n/2, n/4, ..., 1
    std::vector<int> gaps;
    for (int g = static_cast<int>(a.size()) / 2; g > 0; g /= 2) gaps.push_back(g);
    shell_sort_with_gaps(a, gaps);
}

void shell_sort_hibbard(std::vector<int>& a) {         // Hibbard 增量 ..., 15, 7, 3, 1
    std::vector<int> gaps;
    for (int g = 1; g < static_cast<int>(a.size()); g = g * 2 + 1) gaps.insert(gaps.begin(), g);
    shell_sort_with_gaps(a, gaps);
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    std::vector<int> b = a;
    shell_sort(a);
    shell_sort_hibbard(b);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    for (int x : b) std::cout << x << ' ';
    std::cout << '\n';
    // 两行都输出 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

空间复杂度：$O(1)$。
不稳定排序：相等元素可能分在不同的组里，跨组移动后次序会颠倒。

时间复杂度取决于增量序列，至今没有完全解决：

- Shell 原始增量（减半）：最坏 $O(n^2)$。相邻增量不互素，例如大数都在奇数下标、小数都在偶数下标时，前面各趟根本不会让它们交汇，直到最后增量为 1 的那一趟。
- Hibbard 增量 $2^k-1$：最坏 $O(n^{3/2})$，实验平均约 $O(n^{5/4})$。
- Pratt 增量 $2^p3^q$：$O(n\log^2 n)$。
- 已有序时每趟只比较不移动，共 $O(n\log n)$。

希尔排序代码短、原地、对中等规模数据表现不错，但对很大的数据通常不如快速排序、归并排序。

> https://pythontutor.com 很好用，适合还不会用 PyCharm 调试工具的同学，当然后者也好用。另外就是 print 变量输出。
>
> ![image-20241021214028913](https://raw.githubusercontent.com/GMyhf/img/main/img/202410212140881.png)
>



## 4 归并排序

### 4.1 自顶向下的归并排序（Merge Sort）

**思路**：分治。

1. **分**：把序列从中间切成左右两半；
2. **治**：递归地分别排好两半；
3. **合**：把两个有序序列合并成一个——每次比较两段的“头”，取较小的放进结果。

长度不超过 1 的序列天然有序，递归到此为止。快排的力气花在“分”上，归并的力气全花在“合”上。

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:             # 相等时先取左边，保证稳定
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])                 # 两段之一已取完，另一段剩余部分照抄
    result.extend(right[j:])
    return result

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(merge_sort(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

切片 `arr[:mid]` 会复制数据，写法简洁但每层都在分配新列表。C++ 版只开**一个**与输入等长的辅助数组，所有递归层复用：

```cpp
#include <iostream>
#include <vector>

// 合并 a[lo, mid) 与 a[mid, hi)，buf 为辅助数组
void merge_ranges(std::vector<int>& a, std::vector<int>& buf, int lo, int mid, int hi) {
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) buf[k++] = (a[j] < a[i]) ? a[j++] : a[i++];  // 右边严格更小才取右：稳定
    while (i < mid) buf[k++] = a[i++];
    while (j < hi) buf[k++] = a[j++];
    for (k = lo; k < hi; ++k) a[k] = buf[k];
}

void merge_sort_range(std::vector<int>& a, std::vector<int>& buf, int lo, int hi) {
    if (hi - lo < 2) return;
    const int mid = lo + (hi - lo) / 2;
    merge_sort_range(a, buf, lo, mid);
    merge_sort_range(a, buf, mid, hi);
    merge_ranges(a, buf, lo, mid, hi);
}

void merge_sort(std::vector<int>& a) {
    std::vector<int> buf(a.size());                    // 只分配一次
    merge_sort_range(a, buf, 0, static_cast<int>(a.size()));
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    merge_sort(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间复杂度：$T(n) = 2T(n/2) + O(n) = O(n\log n)$，最好、平均、最坏都一样，对输入的初始排列不敏感。
空间复杂度：$O(n)$ 辅助数组，另加 $O(\log n)$ 递归栈。
稳定排序。稳定性全靠合并时“相等取左”：Python 版写 `left[i] <= right[j]`，C++ 版写 `a[j] < a[i]`（右边严格更小才取右），两者等价。若把 Python 版写成 `left[i] < right[j]`，相等时先取右边，就不稳定了。
C++ 的 `std::stable_sort` 用的就是归并排序。

> 递归程序的运行过程不容易理解。https://pythontutor.com 可以完美展示归并排序的递归过程。
>
> ![image-20241021221131586](https://raw.githubusercontent.com/GMyhf/img/main/img/202410212211019.png)
>



### 4.2 归并排序的三处优化

**优化一：小区间改用插入排序——只能“当场”排**

递归到十几个元素时，函数调用的固定开销超过收益，改用插入排序更快。但要注意它和快排的区别：

- 快排可以在小区间**直接返回、什么都不做**，等整个递归结束后对全数组做**一次**插入排序。此时块与块之间已经有序，每个元素离最终位置都不远，这一趟接近 $O(n)$。
- 归并**不能**这样偷懒。`merge` 的前提是左右两半**各自有序**；小区间若不排好就返回，上一层的 `merge` 得到的就是错误结果。所以归并只能在递归到小区间时**当场**做插入排序。

**优化二：两段本来就接得上，跳过归并**

左段最大的 `a[mid-1]` 不大于右段最小的 `a[mid]` 时，两段拼起来已经有序，整趟合并都可以省掉。已经有序的输入因此接近 $O(n)$；随机输入几乎不会命中，代价只是一次比较。

```python
def merge_sort_optimized(arr, cutoff=16):
    buf = arr[:]                            # 辅助数组只开一次

    def insertion(lo, hi):                  # 对 arr[lo:hi] 做插入排序
        for i in range(lo + 1, hi):
            key, j = arr[i], i - 1
            while j >= lo and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key

    def merge(lo, mid, hi):                 # 合并 arr[lo:mid] 与 arr[mid:hi]
        buf[lo:hi] = arr[lo:hi]
        i, j = lo, mid
        for k in range(lo, hi):
            if j >= hi or (i < mid and buf[i] <= buf[j]):
                arr[k] = buf[i]
                i += 1
            else:
                arr[k] = buf[j]
                j += 1

    def sort(lo, hi):
        if hi - lo <= cutoff:               # 优化一：小区间当场插入排序
            insertion(lo, hi)
            return
        mid = (lo + hi) // 2
        sort(lo, mid)
        sort(mid, hi)
        if arr[mid - 1] <= arr[mid]:        # 优化二：两段本来接得上，跳过归并
            return
        merge(lo, mid, hi)

    sort(0, len(arr))
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(merge_sort_optimized(data, cutoff=4))   # 示例数据短，阈值调小才看得到归并
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <vector>

void merge_ranges(std::vector<int>& a, std::vector<int>& buf, int lo, int mid, int hi) {
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) buf[k++] = (a[j] < a[i]) ? a[j++] : a[i++];
    while (i < mid) buf[k++] = a[i++];
    while (j < hi) buf[k++] = a[j++];
    for (k = lo; k < hi; ++k) a[k] = buf[k];
}

void merge_sort_optimized_range(std::vector<int>& a, std::vector<int>& buf, int lo, int hi, int cutoff) {
    if (hi - lo <= cutoff) {                           // 优化一：小区间当场插入排序
        for (int i = lo + 1; i < hi; ++i) {
            const int key = a[i];
            int j = i - 1;
            while (j >= lo && a[j] > key) { a[j + 1] = a[j]; --j; }
            a[j + 1] = key;
        }
        return;
    }
    const int mid = lo + (hi - lo) / 2;
    merge_sort_optimized_range(a, buf, lo, mid, cutoff);
    merge_sort_optimized_range(a, buf, mid, hi, cutoff);
    if (a[mid - 1] <= a[mid]) return;                  // 优化二：已经接得上，跳过归并
    merge_ranges(a, buf, lo, mid, hi);
}

void merge_sort_optimized(std::vector<int>& a, int cutoff = 16) {
    std::vector<int> buf(a.size());
    merge_sort_optimized_range(a, buf, 0, static_cast<int>(a.size()), cutoff);
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    merge_sort_optimized(a, 4);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

阈值（这里取 16，课件原书取 28）要在自己的机器上实测确定。两处优化都不改变 $O(n\log n)$ 的最坏复杂度，也不影响稳定性。

**优化三：Sedgewick 的哨兵（监视哨）归并**

普通 `merge` 的循环每一步都要检查两段是否取完，结束后还要处理剩下的一半。Sedgewick（《Algorithms》作者）的办法是：**左半段正序复制、右半段倒序复制**到辅助数组，两个指针从两端向中间走，循环里不再需要任何越界检查。

```python
def merge_sedgewick(a, aux, l, m, r):
    # 合并 a[l..m] 与 a[m+1..r]（闭区间，两段各自有序且都非空）
    for i in range(l, m + 1):
        aux[i] = a[i]                       # 左半段正序复制
    for j in range(m + 1, r + 1):
        aux[r + m + 1 - j] = a[j]           # 右半段倒序复制
    i, j = l, r                             # 一个从左往右，一个从右往左
    for k in range(l, r + 1):               # 循环里没有任何越界检查
        if aux[j] < aux[i]:
            a[k] = aux[j]
            j -= 1
        else:
            a[k] = aux[i]
            i += 1


def merge_sort_sedgewick(a):
    aux = [None] * len(a)                   # 辅助数组只开一次，各层递归复用

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
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(merge_sort_sedgewick(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <vector>

// 合并 a[l..m] 与 a[m+1..r]（闭区间）
void merge_sedgewick(std::vector<int>& a, std::vector<int>& aux, int l, int m, int r) {
    for (int i = l; i <= m; ++i) aux[i] = a[i];               // 左半段正序
    for (int j = m + 1; j <= r; ++j) aux[r + m + 1 - j] = a[j]; // 右半段倒序
    int i = l, j = r;
    for (int k = l; k <= r; ++k) a[k] = (aux[j] < aux[i]) ? aux[j--] : aux[i++];
}

void merge_sort_sedgewick_range(std::vector<int>& a, std::vector<int>& aux, int l, int r) {
    if (l >= r) return;
    const int m = l + (r - l) / 2;
    merge_sort_sedgewick_range(a, aux, l, m);
    merge_sort_sedgewick_range(a, aux, m + 1, r);
    merge_sedgewick(a, aux, l, m, r);
}

void merge_sort_sedgewick(std::vector<int>& a) {
    std::vector<int> aux(a.size());
    merge_sort_sedgewick_range(a, aux, 0, static_cast<int>(a.size()) - 1);
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    merge_sort_sedgewick(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

为什么不会越界：以左 `[1, 3, 5]`、右 `[2, 4, 6]` 为例，复制后 `aux = [1, 3, 5, 6, 4, 2]`，呈“山峰”状，两段各自的最大值 5 和 6 在中间相邻。

- 左段先取完时，`i` 越过中点，停在右段的最大值 6 上。右段剩下的元素都不大于 6：要么 `aux[j] < aux[i]` 取 `aux[j]`，要么二者相等取 `aux[i]`（它也是右段的元素）。`i`、`j` 只会在 `[l, r]` 内相向收拢，`k` 走满 `r - l + 1` 步时恰好取完。
- 右段先取完时，`j` 停在左段的最大值 5 上，同理充当哨兵。

代价：**这种写法不稳定**。平局时取左边，所以单看“右段倒序”并不会打乱次序；问题出在**左段先取完之后**：`i` 越过中点进入倒序的右段，是从右段的**末尾**开始往回取，右段里相等的最大值就被反序输出了。最小反例：

```text
左段 [1]，右段 [2a, 2b]：aux = [1, 2b, 2a]，i 指向 1，j 指向 2a
k=0：2a < 1 ? 否 → 取 1，i 走到 2b
k=1：2a < 2b ? 否（相等）→ 取 aux[i] = 2b      ← 2b 跑到了 2a 前面
k=2：取 2a
结果 [1, 2b, 2a]，不稳定
```

右段先取完的情形仍然稳定：此时 `j` 停在左段最大值上，`aux[j] < aux[i]` 不可能成立，剩下的左段按原次序取完。所以需要稳定性的场合（如 `std::stable_sort`）不用这个技巧；只排整数、追求内层循环分支最少时才值得用。



### 4.3 自底向上的归并排序（非递归）

不递归，直接从长度为 1 的小段开始，两两合并成长度 2、4、8……的有序段，直到整体有序。没有递归栈，链表上用这种写法可以做到 $O(1)$ 额外空间（见 9.1 节）。

```python
def merge_sort_bottom_up(arr):
    n = len(arr)
    buf = arr[:]
    width = 1                               # 当前有序段的长度：1, 2, 4, ...
    while width < n:
        for lo in range(0, n - width, 2 * width):   # 右段非空才需要合并
            mid, hi = lo + width, min(lo + 2 * width, n)
            buf[lo:hi] = arr[lo:hi]
            i, j = lo, mid
            for k in range(lo, hi):
                if j >= hi or (i < mid and buf[i] <= buf[j]):
                    arr[k] = buf[i]
                    i += 1
                else:
                    arr[k] = buf[j]
                    j += 1
        width *= 2
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(merge_sort_bottom_up(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

void merge_sort_bottom_up(std::vector<int>& a) {
    const int n = static_cast<int>(a.size());
    std::vector<int> buf(a.size());
    for (int width = 1; width < n; width *= 2) {
        for (int lo = 0; lo + width < n; lo += 2 * width) {    // 右段非空才合并
            const int mid = lo + width, hi = std::min(lo + 2 * width, n);
            int i = lo, j = mid, k = lo;
            while (i < mid && j < hi) buf[k++] = (a[j] < a[i]) ? a[j++] : a[i++];
            while (i < mid) buf[k++] = a[i++];
            while (j < hi) buf[k++] = a[j++];
            std::copy(buf.begin() + lo, buf.begin() + hi, a.begin() + lo);
        }
    }
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    merge_sort_bottom_up(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间 $O(n\log n)$（共 $\lceil \log_2 n\rceil$ 趟，每趟 $O(n)$），空间 $O(n)$，稳定。



### 4.4 归并的应用：逆序对计数（OJ 02299 Ultra-QuickSort）

**逆序对**：$i < j$ 而 $a_i > a_j$ 的一对。逆序对数 = 冒泡排序（只交换相邻元素）需要的最少交换次数 = 插入排序的后移次数。用二重循环数是 $O(n^2)$，在归并排序里顺手数是 $O(n\log n)$：

- 一对逆序要么都在左半段、要么都在右半段（递归时数掉），要么一左一右（**合并时数**）；
- 合并时两段各自有序。当右段的 `right[j]` **严格小于**左段的 `left[i]`，左段还没输出的 `left[i:]` 全都比它大，一次记 `len(left) - i` 个；
- 相等时先取左边、不计数：相等元素不构成逆序对。这和稳定性用的是同一个 `<=`。

```python
def count_inversions(arr):
    # 返回 (排好序的列表, 逆序对数)
    if len(arr) <= 1:
        return arr[:], 0
    mid = len(arr) // 2
    left, x = count_inversions(arr[:mid])
    right, y = count_inversions(arr[mid:])
    merged, i, j, inv = [], 0, 0, x + y
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:             # 相等不算逆序
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
            inv += len(left) - i            # left[i:] 都比 right[j] 大
    merged += left[i:]
    merged += right[j:]
    return merged, inv

if __name__ == "__main__":
    print(count_inversions([2, 4, 1, 3, 5])[1])     # 3：(2,1) (4,1) (4,3)
    print(count_inversions([9, 1, 0, 5, 4])[1])     # 6
    print(count_inversions([2, 2, 1])[1])           # 2；若写成 left[i] < right[j] 会多数成 3
```

```cpp
#include <iostream>
#include <vector>

long long merge_count(std::vector<int>& a, std::vector<int>& buf, int lo, int hi) {   // [lo, hi)
    if (hi - lo < 2) return 0;
    const int mid = lo + (hi - lo) / 2;
    long long inv = merge_count(a, buf, lo, mid) + merge_count(a, buf, mid, hi);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        if (a[j] < a[i]) {                    // 右边严格更小：a[i..mid) 都比它大
            inv += mid - i;
            buf[k++] = a[j++];
        } else {
            buf[k++] = a[i++];
        }
    }
    while (i < mid) buf[k++] = a[i++];
    while (j < hi) buf[k++] = a[j++];
    for (k = lo; k < hi; ++k) a[k] = buf[k];
    return inv;
}

// 按值传参：在副本上归并，不改动调用方的数据（计数是查询，不该顺手排序）
long long count_inversions(std::vector<int> a) {
    std::vector<int> buf(a.size());
    return merge_count(a, buf, 0, static_cast<int>(a.size()));
}

int main() {
    std::cout << count_inversions({2, 4, 1, 3, 5}) << '\n';   // 3
    std::cout << count_inversions({9, 1, 0, 5, 4}) << '\n';   // 6
    std::cout << count_inversions({2, 2, 1}) << '\n';         // 2
}
```

时间 $O(n\log n)$，空间 $O(n)$。逆序对最多 $n(n-1)/2$ 个，$n = 5\times 10^5$ 时约 $1.25\times 10^{11}$，**C++ 必须用 `long long`**，用 `int` 会溢出；Python 整数没有这个问题。

变形：OJ 20018「蚂蚁王国的越野跑」数的是 $a_i < a_j$ 的“顺序对”，把合并改成降序即可，数法一行不变。另一条路是离散化 + 树状数组，也是 $O(n\log n)$，并且支持序列动态追加。



## 5 快速排序

**思路**：分治，但力气花在“分”上。

1. 选一个元素作**基准**（pivot）；
2. **分割**（partition）：把比基准小的放到左边、比基准大的放到右边，基准就落在了它的**最终位置**；
3. 对左右两部分递归，直到长度不超过 1。

基准已经到位，左边的元素再也不会跑到它右边，所以**不需要“合”**。把基准看成子树的根、左右部分看成左右子树，快排的过程就是一棵二叉搜索树（见 5.6 节）。



### 5.1 列表推导版：三行写完，但不是原地排序

```python
def quick_sort_simple(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[0]                          # 首元素当基准
    left = [x for x in arr[1:] if x < pivot]
    right = [x for x in arr[1:] if x >= pivot]
    return quick_sort_simple(left) + [pivot] + quick_sort_simple(right)

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(quick_sort_simple(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

这个写法适合理解思想，但要清楚它的代价：

- **不是原地排序**：每层都新建列表，平均额外空间 $O(n)$，退化时 $O(n^2)$。
- **恰好是稳定的**：列表推导保持原有次序，与基准相等的元素都排在基准之后。“快排不稳定”说的是下面的原地版本。
- **会退化**：首元素当基准，输入已经有序、逆序或全部相等时，每次只切掉一个元素，时间 $O(n^2)$、递归深度 $n$。Python 默认递归上限约 1000，**1000 个有序元素就抛 `RecursionError`**。

C++ 一般不这样写；C++ 版本见下面的原地分割。



### 5.2 原地分割的三种写法

原地快排的差别全在 `partition`。教材里常见三种写法，分割后的排列各不相同，但都把基准放到最终位置并返回它的下标：

① **成对交换（Hoare 式，课件双指针版）**：首元素当基准。`left` 从左往右找第一个**大于**基准的，`right` 从右往左找第一个**小于**基准的，两者交换；指针交错时，`right` 停在最后一个不大于基准的位置，把基准换过去。

② **Lomuto 分割（单向扫描，CLRS《算法导论》、课件 `modern.hpp` 采用）**：末元素当基准。慢指针 `boundary` 和快指针 `i` 都从左往右走，`a[lo..boundary-1]` 始终都小于基准；遇到小于基准的元素就换到 `boundary` 处，扫完后把基准换到 `boundary`。

③ **挖坑填数（两端交替，严蔚敏《数据结构》等国内教材、课件图 8.7 采用）**：末元素当基准。先把基准暂存，末位就成了一个“坑”；`l` 从左往右找比基准大的，填进右边的坑，`l` 处成了新坑；`r` 再从右往左找比基准小的，填进左边的坑……两端交替，`l`、`r` 相遇处就是基准的最终位置。全程只有赋值、没有交换。

课件第 8 章的图 8.7 是挖坑填数，配套代码的 `partition` 是 Lomuto，两者本来就不是同一种写法。

```python
def partition_pair(arr, lo, hi):            # ① 成对交换，首元素当基准
    pivot = arr[lo]
    left, right = lo + 1, hi
    while True:
        while left <= right and arr[left] <= pivot:
            left += 1                       # 找第一个 > pivot 的
        while left <= right and arr[right] >= pivot:
            right -= 1                      # 找第一个 < pivot 的
        if left > right:                    # 指针交错：扫描结束
            break
        arr[left], arr[right] = arr[right], arr[left]
    arr[lo], arr[right] = arr[right], arr[lo]   # 基准归位
    return right


def partition_lomuto(arr, lo, hi):          # ② Lomuto，末元素当基准
    pivot = arr[hi]
    boundary = lo                           # [lo, boundary) 都 < pivot
    for i in range(lo, hi):                 # [boundary, i) 都 >= pivot
        if arr[i] < pivot:
            arr[boundary], arr[i] = arr[i], arr[boundary]
            boundary += 1
    arr[boundary], arr[hi] = arr[hi], arr[boundary]
    return boundary


def partition_hole(arr, lo, hi):            # ③ 挖坑填数，末元素当基准
    pivot = arr[hi]                         # 暂存基准，arr[hi] 成为“坑”
    l, r = lo, hi
    while l < r:
        while l < r and arr[l] <= pivot:
            l += 1
        arr[r] = arr[l]                     # 大的填进右边的坑，l 处成为新坑
        while l < r and arr[r] >= pivot:
            r -= 1
        arr[l] = arr[r]                     # 小的填进左边的坑，r 处成为新坑
    arr[l] = pivot                          # 相遇处回填基准
    return l


def quick_sort(arr, partition=partition_lomuto, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, partition, lo, p - 1)
        quick_sort(arr, partition, p + 1, hi)
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    for part in (partition_pair, partition_lomuto, partition_hole):
        print(quick_sort(data[:], part))
    # 三行都输出 [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <utility>
#include <vector>

int partition_pair(std::vector<int>& a, int lo, int hi) {      // ① 成对交换，首元素当基准
    const int pivot = a[lo];
    int left = lo + 1, right = hi;
    while (true) {
        while (left <= right && a[left] <= pivot) ++left;
        while (left <= right && a[right] >= pivot) --right;
        if (left > right) break;
        std::swap(a[left], a[right]);
    }
    std::swap(a[lo], a[right]);
    return right;
}

int partition_lomuto(std::vector<int>& a, int lo, int hi) {    // ② Lomuto，末元素当基准
    const int pivot = a[hi];
    int boundary = lo;
    for (int i = lo; i < hi; ++i) {
        if (a[i] < pivot) std::swap(a[boundary++], a[i]);
    }
    std::swap(a[boundary], a[hi]);
    return boundary;
}

int partition_hole(std::vector<int>& a, int lo, int hi) {      // ③ 挖坑填数，末元素当基准
    const int pivot = a[hi];
    int l = lo, r = hi;
    while (l < r) {
        while (l < r && a[l] <= pivot) ++l;
        a[r] = a[l];
        while (l < r && a[r] >= pivot) --r;
        a[l] = a[r];
    }
    a[l] = pivot;
    return l;
}

template <typename Partition>
void quick_sort(std::vector<int>& a, int lo, int hi, Partition partition) {
    if (lo >= hi) return;
    const int p = partition(a, lo, hi);
    quick_sort(a, lo, p - 1, partition);
    quick_sort(a, p + 1, hi, partition);
}

int main() {
    const std::vector<int> data{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    for (auto part : {partition_pair, partition_lomuto, partition_hole}) {
        std::vector<int> a = data;
        quick_sort(a, 0, static_cast<int>(a.size()) - 1, part);
        for (int x : a) std::cout << x << ' ';
        std::cout << '\n';
    }
    // 三行都输出 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

| 写法 | 基准 | 指针 | 每步操作 | 交换/赋值量 |
| :--: | :--: | :--: | :--: | :--: |
| ① 成对交换 | 首元素 | 相向 | 两边各找到一个逆置元素就交换 | 少，约为 Lomuto 的 1/3 |
| ② Lomuto | 末元素 | 同向（快慢指针） | 小于基准就与 `boundary` 交换 | 最多 |
| ③ 挖坑填数 | 末元素 | 相向、交替 | 单向赋值填坑，不交换 | 少 |

三种写法都**不稳定**（跨越式移动）；平均 $O(n\log n)$；输入已经有序、逆序或**全部相等**时每次只切掉一个元素，退化为 $O(n^2)$，递归深度 $n$。

时间复杂度推导：

- 最好：每次恰好平分，$T(n) = 2T(n/2) + cn = O(n\log n)$；
- 平均：基准落在每个位置的概率都是 $1/n$，$T(n) = cn + \frac{2}{n}\sum_{k=0}^{n-1}T(k)$，解得 $O(n\log n)$，常数约 $1.39\,n\log_2 n$ 次比较；
- 最坏：每次只切下一个元素，$O(n^2)$。

空间复杂度：递归栈平均 $O(\log n)$，最坏 $O(n)$。下一节的工程版能保证 $O(\log n)$。



### 5.3 三路划分（荷兰国旗问题，LeetCode 75）

上面的分割只分“小于 / 不小于”两段，大量重复值时会退化。**三路划分**（Dijkstra 的荷兰国旗问题）一次把区间分成三段：

| 区间 | `[lo, lt)` | `[lt, i)` | `[i, gt]` | `(gt, hi]` |
| :--: | :--: | :--: | :--: | :--: |
| 内容 | 都 < pivot | 都 = pivot | 还没看 | 都 > pivot |

每一步让“还没看”的区间缩小 1：遇到小的换到左边，`lt`、`i` 都前进；遇到大的换到右边，只收缩 `gt`，`i` 不动（从右边换来的数还没看过）；遇到相等的直接跳过。

LeetCode 75「颜色分类」就是 pivot = 1 的三路划分：

```python
def sort_colors(nums):
    # nums 只含 0、1、2，一趟扫描、原地排好
    lt, i, gt = 0, 0, len(nums) - 1
    while i <= gt:
        if nums[i] == 0:
            nums[lt], nums[i] = nums[i], nums[lt]
            lt += 1
            i += 1
        elif nums[i] == 2:
            nums[gt], nums[i] = nums[i], nums[gt]
            gt -= 1                         # 换来的数还没看，i 不动
        else:
            i += 1
    return nums

if __name__ == "__main__":
    print(sort_colors([2, 0, 2, 1, 1, 0]))  # [0, 0, 1, 1, 2, 2]
```

```cpp
#include <iostream>
#include <utility>
#include <vector>

void sort_colors(std::vector<int>& nums) {
    int lt = 0, i = 0, gt = static_cast<int>(nums.size()) - 1;
    while (i <= gt) {
        if (nums[i] == 0) std::swap(nums[lt++], nums[i++]);
        else if (nums[i] == 2) std::swap(nums[gt--], nums[i]);   // i 不动
        else ++i;
    }
}

int main() {
    std::vector<int> nums{2, 0, 2, 1, 1, 0};
    sort_colors(nums);
    for (int x : nums) std::cout << x << ' ';
    std::cout << '\n';   // 0 0 1 1 2 2
}
```

时间 $O(n)$，空间 $O(1)$，一趟扫描。用计数排序（数一遍 0、1、2 再写回）也是 $O(n)$，但要扫两趟。



### 5.4 工程版快速排序：随机基准 + 三路划分 + 短侧递归 + 小区间插入

前面的朴素快排有三个问题，各有对策：

| 问题 | 对策 |
| :-- | :-- |
| 有序、逆序输入退化为 $O(n^2)$ | **随机选基准**（或三数取中）：没有固定的坏输入 |
| 大量重复值、全部相等时退化 | **三路划分**：与基准相等的一段一次到位，不再参与递归 |
| 退化时递归深度 $O(n)$，Python 直接 `RecursionError` | **只对较短的一侧递归**，较长的一侧改成循环：每次递归的区间不超过一半，深度 $O(\log n)$ |
| 小区间上调用和划分的固定开销大 | 长度不超过阈值（如 16）时改用**插入排序** |

```python
import random

def quick_sort_engineered(arr, cutoff=16):
    def insertion(lo, hi):                  # 对闭区间 arr[lo..hi] 插入排序
        for i in range(lo + 1, hi + 1):
            key, j = arr[i], i - 1
            while j >= lo and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key

    def sort(lo, hi):                       # 闭区间 [lo, hi]
        while hi - lo + 1 > cutoff:
            pivot = arr[random.randint(lo, hi)]     # 随机基准
            lt, i, gt = lo, lo, hi                  # 三路划分：< | = | >
            while i <= gt:
                if arr[i] < pivot:
                    arr[lt], arr[i] = arr[i], arr[lt]
                    lt += 1
                    i += 1
                elif arr[i] > pivot:
                    arr[gt], arr[i] = arr[i], arr[gt]
                    gt -= 1
                else:
                    i += 1
            # arr[lo..lt-1] < pivot，arr[lt..gt] == pivot，arr[gt+1..hi] > pivot
            if lt - lo < hi - gt:           # 短的一侧递归，长的一侧继续循环
                sort(lo, lt - 1)
                lo = gt + 1
            else:
                sort(gt + 1, hi)
                hi = lt - 1
        insertion(lo, hi)

    sort(0, len(arr) - 1)
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(quick_sort_engineered(data, cutoff=4))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    print(quick_sort_engineered(list(range(100000)))[:5])  # 有序输入也不会 RecursionError
    print(quick_sort_engineered([7] * 100000)[:5])         # 全部相等：一趟划分就结束
```

```cpp
#include <iostream>
#include <random>
#include <utility>
#include <vector>

void quick_sort_engineered_range(std::vector<int>& a, int lo, int hi, std::mt19937& rng, int cutoff) {
    while (hi - lo + 1 > cutoff) {
        const int pivot = a[std::uniform_int_distribution<int>(lo, hi)(rng)];   // 随机基准
        int lt = lo, i = lo, gt = hi;                                           // 三路划分
        while (i <= gt) {
            if (a[i] < pivot) std::swap(a[lt++], a[i++]);
            else if (a[i] > pivot) std::swap(a[gt--], a[i]);
            else ++i;
        }
        if (lt - lo < hi - gt) {                   // 短侧递归，长侧循环：栈深 O(log n)
            quick_sort_engineered_range(a, lo, lt - 1, rng, cutoff);
            lo = gt + 1;
        } else {
            quick_sort_engineered_range(a, gt + 1, hi, rng, cutoff);
            hi = lt - 1;
        }
    }
    for (int i = lo + 1; i <= hi; ++i) {          // 小区间插入排序
        const int key = a[i];
        int j = i - 1;
        while (j >= lo && a[j] > key) { a[j + 1] = a[j]; --j; }
        a[j + 1] = key;
    }
}

void quick_sort_engineered(std::vector<int>& a, int cutoff = 16) {
    std::mt19937 rng(std::random_device{}());
    quick_sort_engineered_range(a, 0, static_cast<int>(a.size()) - 1, rng, cutoff);
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    quick_sort_engineered(a, 4);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

期望时间 $O(n\log n)$，与输入形态无关（随机基准下，坏情况只取决于运气，概率极小）；重复值越多越快，全部相等时 $O(n)$。栈深度 $O(\log n)$。不稳定。
注意：短侧递归只保证**栈深**，不保证时间。如果基准固定取末元素，有序输入仍是 $O(n^2)$——课件实测 2 万个有序数，这样的“优化快排”要 105.9 ms，直接插入排序 0.0 ms。根治退化要靠换基准策略。



### 5.5 快速选择：第 k 小 / 第 k 大（LeetCode 215）

只要第 $k$ 小的元素，就不必把整个数组排好：划分之后，答案只会在**一侧**，只进那一侧即可。

```python
import random

def quick_select(nums, k):
    # 返回第 k 小的元素（k 从 1 开始）；会打乱 nums 的次序
    target = k - 1                          # 升序下的下标
    lo, hi = 0, len(nums) - 1
    while True:
        pivot = nums[random.randint(lo, hi)]        # 随机基准，避开最坏情况
        lt, i, gt = lo, lo, hi                      # 三路划分
        while i <= gt:
            if nums[i] < pivot:
                nums[lt], nums[i] = nums[i], nums[lt]
                lt += 1
                i += 1
            elif nums[i] > pivot:
                nums[gt], nums[i] = nums[i], nums[gt]
                gt -= 1
            else:
                i += 1
        if target < lt:                     # 只进答案所在的一侧
            hi = lt - 1
        elif target > gt:
            lo = gt + 1
        else:
            return pivot


def find_kth_largest(nums, k):              # LeetCode 215：第 k 大 = 第 n-k+1 小
    return quick_select(nums, len(nums) - k + 1)

if __name__ == "__main__":
    print(find_kth_largest([3, 2, 1, 5, 6, 4], 2))           # 5
    print(find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))  # 4
```

```cpp
#include <algorithm>
#include <iostream>
#include <random>
#include <utility>
#include <vector>

int quick_select(std::vector<int> nums, int k) {      // 第 k 小，k 从 1 开始；按值传参不改调用方
    static std::mt19937 rng(std::random_device{}());
    const int target = k - 1;
    int lo = 0, hi = static_cast<int>(nums.size()) - 1;
    while (true) {
        const int pivot = nums[std::uniform_int_distribution<int>(lo, hi)(rng)];
        int lt = lo, i = lo, gt = hi;
        while (i <= gt) {
            if (nums[i] < pivot) std::swap(nums[lt++], nums[i++]);
            else if (nums[i] > pivot) std::swap(nums[gt--], nums[i]);
            else ++i;
        }
        if (target < lt) hi = lt - 1;
        else if (target > gt) lo = gt + 1;
        else return pivot;
    }
}

int main() {
    std::vector<int> nums{3, 2, 3, 1, 2, 4, 5, 5, 6};
    const int n = static_cast<int>(nums.size());
    std::cout << quick_select(nums, n - 4 + 1) << '\n';   // 第 4 大：4

    // 标准库：std::nth_element 把第 k 小放到下标 k-1 处，左边都不大于它、右边都不小于它
    std::nth_element(nums.begin(), nums.begin() + (n - 4), nums.end());
    std::cout << nums[n - 4] << '\n';                      // 4
}
```

期望时间 $O(n)$：快排两侧都要递归，是 $n\log n$；选择只留一侧，期望 $n + n/2 + n/4 + \dots \approx 2n$。最坏 $O(n^2)$（随机基准下概率极小；BFPRT“中位数的中位数”算法可保证最坏 $O(n)$，但常数大）。
另一条路是堆：维护大小为 $k$ 的小顶堆，$O(n\log k)$，Python 里写作 `heapq.nlargest(k, nums)[-1]`。



### 5.6 树排序：二叉搜索树与快排同构

**思路**：把元素逐个插入二叉搜索树（BST），再**中序遍历**，得到的就是有序序列。

它和“首元素当基准”的快排做的是**同一批比较**：根是第一个元素，后面每个元素插入时都先和根比较，分到左 / 右子树——这正是一次分割；子树再按各自的第一个元素分下去。所以平均 $O(n\log n)$，有序输入时树退化成链，$O(n^2)$。

```python
class Node:
    __slots__ = ("val", "left", "right")

    def __init__(self, val):
        self.val, self.left, self.right = val, None, None


def tree_sort(arr):
    root = None
    for x in arr:                           # 循环插入，不用递归：有序输入也不会栈溢出
        node = Node(x)
        if root is None:
            root = node
            continue
        cur = root
        while True:
            if x < cur.val:
                if cur.left is None:
                    cur.left = node
                    break
                cur = cur.left
            else:                           # 相等进右子树：先来的在前，稳定
                if cur.right is None:
                    cur.right = node
                    break
                cur = cur.right
    result, stack, cur = [], [], root       # 非递归中序遍历
    while stack or cur:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        result.append(cur.val)
        cur = cur.right
    return result

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(tree_sort(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <vector>

void tree_sort(std::vector<int>& a) {
    struct Node { int val; int left = -1, right = -1; };
    std::vector<Node> pool;                       // 结点存进数组，用下标代替指针，不必手动释放
    pool.reserve(a.size());
    for (int x : a) {
        pool.push_back({x});
        const int id = static_cast<int>(pool.size()) - 1;
        if (id == 0) continue;
        int cur = 0;
        while (true) {
            int& next = (x < pool[cur].val) ? pool[cur].left : pool[cur].right;   // 相等进右子树
            if (next == -1) { next = id; break; }
            cur = next;
        }
    }
    std::vector<int> stack;                       // 非递归中序遍历
    int cur = pool.empty() ? -1 : 0, k = 0;
    while (!stack.empty() || cur != -1) {
        while (cur != -1) { stack.push_back(cur); cur = pool[cur].left; }
        cur = stack.back();
        stack.pop_back();
        a[k++] = pool[cur].val;
        cur = pool[cur].right;
    }
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    tree_sort(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间：平均 $O(n\log n)$，最坏（有序输入，树退化成链）$O(n^2)$。换成 AVL 树、红黑树等平衡树，最坏也是 $O(n\log n)$——C++ 的 `std::multiset` 就是红黑树。
空间：$O(n)$ 个结点。
稳定（相等进右子树）。实际中很少用它排序：常数比快排大得多，但它说明了快排与 BST 的联系。



## 6 堆排序（Heap Sort）

**思路**：选择排序每轮用线性扫描找最大值，代价 $O(n)$；堆排序改用**最大堆**，找最大值只要 $O(\log n)$。

1. **建堆**：把数组看成完全二叉树（下标 $i$ 的孩子是 $2i+1$、$2i+2$），从最后一个非叶结点 $n/2-1$ 往前，逐个向下调整（`sift_down`），得到最大堆；
2. **排序**：堆顶是最大值，把它与堆尾交换，堆的大小减 1，再把新堆顶向下调整；重复 $n-1$ 次。

已排好的部分放在数组后面，不需要额外数组。

```python
def sift_down(arr, root, size):
    # 在 arr[0:size] 构成的最大堆中，把 arr[root] 向下调整到合适位置
    while 2 * root + 1 < size:
        child = 2 * root + 1                # 左孩子
        if child + 1 < size and arr[child + 1] > arr[child]:
            child += 1                      # 选左右孩子中较大的
        if arr[root] >= arr[child]:
            break
        arr[root], arr[child] = arr[child], arr[root]
        root = child


def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):     # 建堆：从最后一个非叶结点往前
        sift_down(arr, i, n)
    for end in range(n - 1, 0, -1):         # 堆顶（最大值）换到末尾，堆缩小 1
        arr[0], arr[end] = arr[end], arr[0]
        sift_down(arr, 0, end)
    return arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(heap_sort(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
```

```cpp
#include <iostream>
#include <utility>
#include <vector>

void sift_down(std::vector<int>& a, int root, int size) {
    while (2 * root + 1 < size) {
        int child = 2 * root + 1;
        if (child + 1 < size && a[child + 1] > a[child]) ++child;   // 较大的孩子
        if (a[root] >= a[child]) return;
        std::swap(a[root], a[child]);
        root = child;
    }
}

void heap_sort(std::vector<int>& a) {
    const int n = static_cast<int>(a.size());
    for (int i = n / 2 - 1; i >= 0; --i) sift_down(a, i, n);      // 建堆 O(n)
    for (int end = n - 1; end > 0; --end) {
        std::swap(a[0], a[end]);
        sift_down(a, 0, end);
    }
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    heap_sort(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间复杂度：$O(n\log n)$，**最坏也有保证**。建堆 $O(n)$（大部分结点在底层，下沉距离很短），之后 $n-1$ 次调整各 $O(\log n)$。
空间复杂度：$O(1)$。`sift_down` 写成循环而不是递归，就是严格的 $O(1)$。
不稳定：堆顶与堆尾的交换是远距离的。
实际运行通常比快排慢：访问模式跳跃，对缓存不友好。C++ 的 introsort 在快排递归过深时就转用堆排序兜底。
Python 也可以用标准库的小顶堆：`[heapq.heappop(h) for _ in range(len(h))]`（先 `heapq.heapify(h)`），但那需要 $O(n)$ 额外空间。



## 7 分配排序（非比较排序）

基于比较的排序最坏至少 $\Omega(n\log n)$ 次比较（见 10.3 节）。要突破这个下界，只能**不比较元素**，转而利用关键码本身的结构，直接算出每个元素该去哪儿。代价是对数据有要求：

| 名称 | 平均 | 最坏 | 空间 | 稳定 | 适用情况 |
| :--: | :--: | :--: | :--: | :--: | :-- |
| 计数排序 | $O(n+k)$ | $O(n+k)$ | $O(n+k)$ | 是 | 整数，取值范围 $k=\max-\min+1$ 不比 $n$ 大太多 |
| 桶排序 | $O(n+k)$ | $O(n^2)$（桶内插入排序）/ $O(n\log n)$（桶内用 `sorted`） | $O(n+k)$ | 是 | 数据大致均匀分布，$k$ 为桶数 |
| 基数排序 | $O(d(n+b))$ | $O(d(n+b))$ | $O(n+b)$ | 是 | 整数或定长字符串，$d$ 为位数，$b$ 为基数（十进制 $b=10$） |



### 7.1 计数排序（Counting Sort）

**思路**：整数的取值范围很小时，开一个计数数组，数一遍每个值出现几次，再按值从小到大写回。

**简单版**（只排纯整数）：

```python
def counting_sort(arr):
    if not arr:
        return arr
    min_value, max_value = min(arr), max(arr)
    count = [0] * (max_value - min_value + 1)   # 用 min_value 做偏移，支持负数
    for num in arr:
        count[num - min_value] += 1
    sorted_arr = []
    for i, c in enumerate(count):
        sorted_arr.extend([i + min_value] * c)
    return sorted_arr

if __name__ == "__main__":
    data = [6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10]
    print(counting_sort(data))
    # [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    print(counting_sort([3, -1, 2, -1]))    # [-1, -1, 2, 3]
```

> 不做偏移、直接写 `count = [0] * (max_value + 1)` 的话，遇到负数时 `count[-1]` 会被 Python 当作“倒数第一个”，**不报错但结果错误**，例如 `[3, -1, 2]` 会输出 `[2, 3, 3]`。

> ![image-20241021225923484](https://raw.githubusercontent.com/GMyhf/img/main/img/202410212259316.png)

**稳定版**（按整数键给**记录**排序，例如作为基数排序的一趟）：简单版只是“按值重写”，排纯整数没问题，但排带卫星数据的记录（学号、姓名）时，必须把原记录搬到正确位置。做法是把计数累加成前缀和——`count[v]` 变成“键不超过 $v$ 的记录个数”，也就是值 $v$ 的结束位置——再**从后往前**扫描放置，保证相等键的先后次序不变：

```python
def counting_sort_stable(arr, key=lambda x: x):
    if not arr:
        return arr
    keys = [key(x) for x in arr]
    lo = min(keys)
    count = [0] * (max(keys) - lo + 1)
    for k in keys:
        count[k - lo] += 1
    for i in range(1, len(count)):          # 前缀和：count[i] = 键 <= i+lo 的元素个数
        count[i] += count[i - 1]
    output = [None] * len(arr)
    for x, k in zip(reversed(arr), reversed(keys)):   # 从后往前，保证稳定
        count[k - lo] -= 1
        output[count[k - lo]] = x
    return output

if __name__ == "__main__":
    print(counting_sort_stable([(3, 'a'), (1, 'b'), (3, 'c'), (1, 'd')], key=lambda t: t[0]))
    # [(1, 'b'), (1, 'd'), (3, 'a'), (3, 'c')]
```

C++ 版同时给出值域保护：值域太稀疏（例如排 10 个数、值域却有 $10^9$）时，计数数组会把内存撑爆，与其拖垮机器，不如当场报错。注意 `max - min + 1` 在 `int` 里可能溢出，要先转成 `long long`。

```cpp
#include <iostream>
#include <stdexcept>
#include <vector>

void counting_sort(std::vector<int>& a) {
    if (a.empty()) return;
    int lo = a[0], hi = a[0];
    for (int x : a) { if (x < lo) lo = x; if (x > hi) hi = x; }
    const long long range = static_cast<long long>(hi) - lo + 1;   // 先转 long long，防止溢出
    if (range > 10'000'000) throw std::invalid_argument("counting sort: value range too large");
    std::vector<int> count(static_cast<std::size_t>(range), 0);
    for (int x : a) ++count[x - lo];
    int k = 0;
    for (long long v = 0; v < range; ++v) {
        for (int c = count[v]; c > 0; --c) a[k++] = static_cast<int>(v + lo);
    }
}

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    counting_sort(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 1 2 3 4 4 5 6 7 8 9 10 10 11 12 13 14 15 16 17 18 19 20
}
```

时间复杂度：$O(n + k)$，$k = \max - \min + 1$ 是取值范围。
空间复杂度：$O(n + k)$。
稳定（前缀和版）。
值域 $k = O(n)$ 时它是线性的，相对比较排序是一次飞跃；$k = O(n\log n)$ 时已没有优势；$k = O(n^2)$ 时还不如比较排序。判断能不能用，看 $k$ 与 $n$ 的比值。



### 7.2 桶排序（Bucket Sort）

**思路**：假设数据大致**均匀**地分布在某个区间上。把区间等分成若干个桶，每个元素按值放进对应的桶，每个桶内元素很少，分别排序后按桶的顺序依次拼接即可。

计数排序是“一个桶装一个值，桶内不用排”；桶排序是“一个桶装一段区间，桶内还要再排一次”。

下面的代码先求出最小值和最大值，把 `[min, max]` 映射到 `n` 个桶上，所以适用于任意区间的数值：

```python
def bucket_sort(arr):
    n = len(arr)
    if n <= 1:
        return arr
    max_val = max(arr)
    min_val = min(arr)
    if max_val == min_val:                  # 所有元素相等，否则下面会除以 0
        return arr

    buckets = [[] for _ in range(n)]        # 桶的个数取 n
    for num in arr:
        index = int((num - min_val) / (max_val - min_val) * (n - 1))   # 映射到 0..n-1
        buckets[index].append(num)

    sorted_arr = []
    for bucket in buckets:
        sorted_arr.extend(sorted(bucket))   # 桶内用稳定的 sorted，按桶号依次收集
    return sorted_arr

if __name__ == "__main__":
    print(bucket_sort([0.897, 0.565, 0.656, 0.1234, 0.665, 0.3434]))
    # [0.1234, 0.3434, 0.565, 0.656, 0.665, 0.897]
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

void bucket_sort(std::vector<double>& a) {
    const int n = static_cast<int>(a.size());
    if (n <= 1) return;
    const auto [mn_it, mx_it] = std::minmax_element(a.begin(), a.end());
    const double mn = *mn_it, mx = *mx_it;
    if (mn == mx) return;                                   // 全部相等，避免除以 0

    std::vector<std::vector<double>> buckets(n);
    for (double x : a) {
        const int idx = static_cast<int>((x - mn) / (mx - mn) * (n - 1));
        buckets[idx].push_back(x);
    }
    int k = 0;
    for (auto& b : buckets) {
        std::stable_sort(b.begin(), b.end());               // 桶内元素很少；用稳定排序
        for (double x : b) a[k++] = x;
    }
}

int main() {
    std::vector<double> a{0.897, 0.565, 0.656, 0.1234, 0.665, 0.3434};
    bucket_sort(a);
    for (double x : a) std::cout << x << ' ';
    std::cout << '\n';
    // 0.1234 0.3434 0.565 0.656 0.665 0.897
}
```

时间复杂度：数据均匀分布时，每桶期望 $O(1)$ 个元素，平均 $O(n + k)$（$k$ 为桶数，这里 $k = n$）；若数据都挤进同一个桶，退化为桶内排序的复杂度（桶内用插入排序是 $O(n^2)$，用 `sorted` 是 $O(n\log n)$）。
空间复杂度：$O(n + k)$。
稳定：元素按原次序入桶，桶内用稳定排序，按桶号依次收集。



### 7.3 基数排序（Radix Sort）

**思路**：值域太大、开不起计数数组时，把关键码**按位拆开**，每一位的取值范围都很小，逐位做计数排序（或分桶）。

- **LSD**（Least Significant Digit first，低位优先）：从个位开始，按个位排一趟、再按十位排一趟……最后一趟按最高位。计算机里通常用 LSD。
- **MSD**（高位优先）：先按最高位分组，每组再按次高位递归分组，是分治的写法。

LSD 的关键：**每一趟都必须稳定**。按十位排时，`42` 和 `45` 十位相同，这一趟稳定，上一趟按个位排出的 `42` 在 `45` 前的次序才能保留下来。任何一趟不稳定，前面各趟的成果都会被打乱。

**分桶写法**（每趟 10 个桶，按桶号收集）：

```python
def radix_sort(arr):
    # 只适用于非负整数；有负数时见下面的 radix_sort_signed
    if not arr:
        return arr
    digits = len(str(max(arr)))             # 最大值的位数 = 趟数
    for i in range(digits):
        buckets = [[] for _ in range(10)]
        for num in arr:
            buckets[num // 10 ** i % 10].append(num)    # 按第 i 位分配（入桶保持原次序）
        arr = [num for bucket in buckets for num in bucket]   # 按桶号收集
    return arr

if __name__ == "__main__":
    print(radix_sort([170, 45, 75, 90, 802, 24, 2, 66]))
    # [2, 24, 45, 66, 75, 90, 170, 802]
```

**计数写法**（每趟用“计数 → 前缀和 → 从后往前放置”，只需一个长度为 10 的计数数组和一个长度为 $n$ 的输出数组）：

```python
def counting_sort_by_digit(arr, exp):
    # 按 exp 所在的那一位（exp = 1 个位、10 十位、100 百位……）做一次稳定的计数排序
    count = [0] * 10
    for x in arr:
        count[x // exp % 10] += 1
    for d in range(1, 10):                  # 前缀和：count[d] = 该位 <= d 的元素个数
        count[d] += count[d - 1]
    output = [0] * len(arr)
    for x in reversed(arr):                 # 从后往前放，保证稳定
        d = x // exp % 10
        count[d] -= 1
        output[count[d]] = x
    return output


def radix_sort_counting(arr):
    if not arr:
        return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:               # 从个位开始，逐位稳定排序
        arr = counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

if __name__ == "__main__":
    print(radix_sort_counting([170, 45, 75, 90, 802, 24, 2, 66]))
    # [2, 24, 45, 66, 75, 90, 170, 802]
```

逐趟结果（把位数补齐看更清楚）：

| 趟 | 结果 |
| :--: | :-- |
| 初始 | 170, 045, 075, 090, 802, 024, 002, 066 |
| 按个位 | 170, 090, 802, 002, 024, 045, 075, 066 |
| 按十位 | 802, 002, 024, 045, 066, 170, 075, 090 |
| 按百位 | 002, 024, 045, 066, 075, 090, 170, 802 |

**有负数怎么办**：Python 的整数没有固定位数，最简单的办法是整体平移到非负区间，排完再移回来：

```python
def radix_sort_signed(arr):
    if not arr:
        return arr
    shift = min(arr)
    keys = [x - shift for x in arr]         # 平移后都 >= 0
    max_key, exp = max(keys), 1
    while max_key // exp > 0:
        buckets = [[] for _ in range(10)]
        for k in keys:
            buckets[k // exp % 10].append(k)
        keys = [k for b in buckets for k in b]
        exp *= 10
    return [k + shift for k in keys]

if __name__ == "__main__":
    print(radix_sort_signed([3, -2, 7, 3, 0, -2, 9, 1]))   # [-2, -2, 0, 1, 3, 3, 7, 9]
```

C++ 的 `int` 是定长 32 位补码，常用的做法是**按字节分 4 趟、每趟 256 个桶**；把符号位翻转（异或 `0x80000000`）后，负数的位模式整体排到正数前面，就能直接排有符号整数。下面同时给出十进制版（只排非负数）和按字节版：

```cpp
#include <cstdint>
#include <iostream>
#include <vector>

// 十进制 LSD，每趟一次稳定计数排序；只适用于非负整数
void radix_sort_decimal(std::vector<int>& a) {
    if (a.empty()) return;
    int mx = a[0];
    for (int x : a) if (x > mx) mx = x;
    std::vector<int> out(a.size());
    for (long long exp = 1; mx / exp > 0; exp *= 10) {
        int count[10] = {0};
        for (int x : a) ++count[x / exp % 10];
        for (int d = 1; d < 10; ++d) count[d] += count[d - 1];          // 前缀和
        for (int i = static_cast<int>(a.size()) - 1; i >= 0; --i) {    // 从后往前：稳定
            const int d = static_cast<int>(a[i] / exp % 10);
            out[--count[d]] = a[i];
        }
        a.swap(out);
    }
}

// 按字节 LSD：4 趟 x 256 个桶；翻转符号位后，有符号 int 可按无符号次序排序
void radix_sort(std::vector<int>& a) {
    std::vector<int> buf(a.size());
    for (unsigned shift = 0; shift < 32; shift += 8) {
        std::size_t count[257] = {0};
        for (int x : a) {
            const std::uint32_t key = static_cast<std::uint32_t>(x) ^ 0x80000000U;
            ++count[((key >> shift) & 0xFFU) + 1];
        }
        for (int d = 0; d < 256; ++d) count[d + 1] += count[d];       // count[d] = 桶 d 的起始位置
        for (int x : a) {                                              // 起始位置正着放，同样稳定
            const std::uint32_t key = static_cast<std::uint32_t>(x) ^ 0x80000000U;
            buf[count[(key >> shift) & 0xFFU]++] = x;
        }
        a.swap(buf);
    }
}

int main() {
    std::vector<int> a{170, 45, 75, 90, 802, 24, 2, 66};
    radix_sort_decimal(a);
    for (int x : a) std::cout << x << ' ';
    std::cout << '\n';   // 2 24 45 66 75 90 170 802

    std::vector<int> b{3, -2, 7, 3, 0, -2, 9, 1};
    radix_sort(b);
    for (int x : b) std::cout << x << ' ';
    std::cout << '\n';   // -2 -2 0 1 3 3 7 9
}
```

时间复杂度：$O(d(n + b))$，$n$ 为元素个数，$d$ 为位数（趟数），$b$ 为基数（十进制 $b=10$，按字节 $b=256$）。
空间复杂度：$O(n + b)$。
稳定排序。

**基数排序真的是线性的吗？** $d$ 看起来像常数，但 $n$ 个**互不相同**的关键码至少需要 $d \ge \log_b n$ 位，此时时间是 $O(n\log_b n)$，与 $O(n\log n)$ 同一量级。它在实践中快，是因为 32 位整数的 $d$ 固定为 4（按字节）。



## 8 索引排序（Index Sort）

**通俗讲法**

给全班同学按身高排座位，有两种做法：

- 让同学们**真的起身换座位**——这就是前面各种排序在做的“搬记录”；
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
    print(index_sort(scores))               # [5, 1, 0, 6, 2, 4, 7, 3]
    print(scores)                           # 原数组没动：[29, 25, 34, 64, 34, 12, 32, 45]
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

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

struct Student { std::string name; int score; };   // 想象这是一条很大的记录

// 第一步：排索引。std::stable_sort 只搬下标，记录一次都不动
std::vector<int> index_sort(const std::vector<Student>& recs) {
    std::vector<int> index(recs.size());
    std::iota(index.begin(), index.end(), 0);       // 0, 1, ..., n-1
    std::stable_sort(index.begin(), index.end(),
                     [&](int i, int j) { return recs[i].score < recs[j].score; });
    return index;
}

// 第二步：沿置换环原地整理，O(n) 次赋值、O(1) 额外空间；结束后 index 变为恒等排列
void adjust_by_index(std::vector<Student>& recs, std::vector<int>& index) {
    const int n = static_cast<int>(recs.size());
    for (int first = 0; first < n; ++first) {
        if (index[first] == first) continue;
        Student saved = std::move(recs[first]);
        int cur = first;
        while (index[cur] != first) {
            const int src = index[cur];
            recs[cur] = std::move(recs[src]);
            index[cur] = cur;
            cur = src;
        }
        recs[cur] = std::move(saved);
        index[cur] = cur;
    }
}

int main() {
    std::vector<Student> recs{{"甲", 29}, {"乙", 25}, {"丙", 34}, {"丁", 64},
                              {"戊", 34}, {"己", 12}, {"庚", 32}, {"辛", 45}};
    std::vector<int> index = index_sort(recs);
    for (int i : index) std::cout << i << ' ';
    std::cout << '\n';                              // 5 1 0 6 2 4 7 3
    adjust_by_index(recs, index);
    for (const auto& s : recs) std::cout << s.name << s.score << ' ';
    std::cout << '\n';                              // 己12 乙25 甲29 庚32 丙34 戊34 辛45 丁64
}
```

手算整理过程（键值 `[29, 25, 34, 64, 34′, 12, 32, 45]`，`index = [5, 1, 0, 6, 2, 4, 7, 3]`）：

| 环 | 走法 | 整理后 |
| :--: | :-- | :-- |
| {0, 5, 4, 2} | 暂存 29；0 ← 5 的 12，5 ← 4 的 34′，4 ← 2 的 34；回到 0，29 放进 2 | 12, 25, 29, 64, 34, 34′, 32, 45 |
| {1} | 25 已在位，跳过 | 不变 |
| {3, 6, 7} | 暂存 64；3 ← 6 的 32，6 ← 7 的 45；回到 3，64 放进 7 | 12, 25, 29, 32, 34, 34′, 45, 64 |

两个 34 的次序没变：`index` 里下标 2 排在 4 前面，因为排索引用的是稳定排序。

**复杂度分析**

| 阶段 | 比较次数 | 记录移动 | 额外空间 |
| :--: | :--: | :--: | :--: |
| 排索引 | 与所用排序相同：插入排序 $O(n^2)$，`sorted` / `std::stable_sort` 为 $O(n\log n)$ | **0 次** | 索引数组 $O(n)$ |
| 原地整理 | 0 | 每个不在位的元素恰好写 1 次（含最后的回填），每个长度为 L 的环另加 1 次暂存，即 L + 1 次；环长至少 2，合计不超过 $1.5n$ 次，即 $O(n)$ | $O(1)$（一个 `saved`） |

- 整理是 $O(n)$ 的原因：每个下标一旦到位就被改成自己（`index[cur] = cur`），外层循环再遇到它直接跳过，所以每个元素只被处理一次。
- 也可以不原地整理，直接 `[records[i] for i in index]` 生成新表：同样 $O(n)$ 时间，但要 $O(n)$ 额外空间。
- 稳定性由排索引所用的算法决定。
- `adjust_by_index` 会把 `index` 改成 `0, 1, …, n-1`；之后还要用名单的话，先复制一份。
- 适用场景：记录大、比较便宜；或者原数组不允许改动（例如同时要按多个关键字给同一份数据建多张“名单”）。



## 9 链表排序与多路归并

### 9.1 链表的归并排序（LeetCode 148）

链表不能随机访问，快排、堆排序都不合适；归并只需**顺序**走两条链，正合链表，而且合并时只改指针、不搬数据，也不需要数组版的 $O(n)$ 辅助空间。

- **分**：快慢指针找中点，从中间断开；
- **合**：和数组版一样比较两条链的头，较小者接到结果链尾。

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


def sort_list(head):
    if head is None or head.next is None:
        return head
    slow, fast = head, head.next            # fast 从 head.next 起：两个结点时能断成 1 + 1
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    right, slow.next = slow.next, None      # 从中点断开
    return merge_lists(sort_list(head), sort_list(right))


def merge_lists(a, b):
    tail = dummy = ListNode()
    while a and b:
        if a.val <= b.val:                  # <= 保证稳定
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b                      # 剩下的整条接上，只改指针
    return dummy.next

if __name__ == "__main__":
    head = None
    for x in reversed([4, 2, 1, 3, 5, 2]):
        head = ListNode(x, head)
    head = sort_list(head)
    out = []
    while head:
        out.append(head.val)
        head = head.next
    print(out)                              # [1, 2, 2, 3, 4, 5]
```

`fast` 必须从 `head.next` 起：若从 `head` 起，两个结点时 `slow` 会停在第二个，断成 2 + 0，无限递归。

```cpp
#include <iostream>
#include <vector>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

ListNode* merge_lists(ListNode* a, ListNode* b) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }   // <= 保证稳定
        else { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
}

ListNode* sort_list(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* slow = head;
    ListNode* fast = head->next;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* right = slow->next;
    slow->next = nullptr;                                         // 从中点断开
    return merge_lists(sort_list(head), sort_list(right));
}

int main() {
    std::vector<ListNode> nodes;                    // 结点放在 vector 里，离开作用域自动释放
    for (int x : {4, 2, 1, 3, 5, 2}) nodes.emplace_back(x);
    for (std::size_t i = 0; i + 1 < nodes.size(); ++i) nodes[i].next = &nodes[i + 1];
    for (ListNode* p = sort_list(&nodes[0]); p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\n';                              // 1 2 2 3 4 5
}
```

时间 $O(n\log n)$；递归栈 $O(\log n)$。题目进阶要求 $O(1)$ 额外空间，就改成 4.3 节的自底向上写法：按步长 1、2、4……逐段切下、两两合并。



### 9.2 k 路归并（LeetCode 23）

把 $k$ 个有序序列合并成一个。每次要从 $k$ 个“当前头”里取最小的——这正是堆擅长的事：堆里只放 $k$ 个当前头，每取出一个，就把它所在序列的下一个元素放进堆。

```python
import heapq

def k_way_merge(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]   # (值, 第几个序列, 序列内下标)
    heapq.heapify(heap)
    result = []
    while heap:
        val, i, j = heapq.heappop(heap)
        result.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return result

if __name__ == "__main__":
    print(k_way_merge([[1, 4, 5], [1, 3, 4], [2, 6], []]))   # [1, 1, 2, 3, 4, 4, 5, 6]
```

元组里的序列号 `i` 有两个作用：找到下一个元素，以及**值相等时打破平局**。合并链表（LeetCode 23）时，若元组写成 `(node.val, node)`，值相等就会去比较两个 `ListNode`，抛 `TypeError`；写成 `(node.val, i, node)` 就不会。标准库的 `heapq.merge(*lists)` 做的是同一件事。

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <tuple>
#include <vector>

std::vector<int> k_way_merge(const std::vector<std::vector<int>>& lists) {
    using Item = std::tuple<int, int, int>;                       // (值, 第几个序列, 序列内下标)
    std::priority_queue<Item, std::vector<Item>, std::greater<Item>> heap;   // 小顶堆
    for (int i = 0; i < static_cast<int>(lists.size()); ++i) {
        if (!lists[i].empty()) heap.emplace(lists[i][0], i, 0);
    }
    std::vector<int> result;
    while (!heap.empty()) {
        const auto [val, i, j] = heap.top();
        heap.pop();
        result.push_back(val);
        if (j + 1 < static_cast<int>(lists[i].size())) heap.emplace(lists[i][j + 1], i, j + 1);
    }
    return result;
}

int main() {
    for (int x : k_way_merge({{1, 4, 5}, {1, 3, 4}, {2, 6}, {}})) std::cout << x << ' ';
    std::cout << '\n';   // 1 1 2 3 4 4 5 6
}
```

设元素总数为 $N$：堆的大小始终不超过 $k$，每个元素进出堆各一次，时间 $O(N\log k)$，额外空间 $O(k)$。对比：逐条并入结果是 $O(kN)$；两两分治归并也是 $O(N\log k)$。外排序（课件第 9 章）的多路归并、败者树做的也是这件事。



## 10 标准库、理论与易错点

### 10.1 Python 的 `sorted` / `list.sort`：Timsort

Python 内置排序用的是 Timsort（Tim Peters，2002），也被 Java 的对象排序和 Android 采用。它是**插入排序 + 归并排序**的混合：

1. **找 run**：从左往右切出已经有序的段（严格递减的段原地翻转），这是它在真实数据上快的根源；
2. **补齐**：短于 minrun（32～64）的段用**二分插入排序**补长；
3. **归并**：各段压栈，按长度规则两两归并，保持各段长度平衡；归并时若一边连续胜出，就**倍增跳跃**（galloping）。

最好 $O(n)$（已有序或逆序只要 $n-1$ 次比较），最坏 $O(n\log n)$，额外空间 $O(n)$，**稳定**。

稳定性的直接用法是多关键字排序：

```python
students = [("Bob", 90), ("Amy", 85), ("Cat", 90), ("Dan", 85)]

# 写法一：利用稳定性，先按次要关键字排，再按主要关键字排
s1 = sorted(students, key=lambda t: t[0])           # 先按姓名
s1 = sorted(s1, key=lambda t: -t[1])                # 再按分数降序：同分者保持姓名次序

# 写法二：一次排，key 返回元组
s2 = sorted(students, key=lambda t: (-t[1], t[0]))

print(s1)   # [('Bob', 90), ('Cat', 90), ('Amy', 85), ('Dan', 85)]
print(s1 == s2)                                     # True
```

要点：

- `key=` 对每个元素只计算一次，比用 `functools.cmp_to_key` 写比较函数快，也更清楚；
- `reverse=True` 降序，并且仍然稳定；
- 按什么排要想清楚：例如 OJ 27300 中参数量 `"1.3B"`、`"350M"` 必须先换算成数值，按字符串排会把 13 亿排到 3.5 亿前面。

做题时优先用内置排序；手写排序是为了知道它**为什么快、什么时候不快**。



### 10.2 C++ 的 `std::sort` 与相关函数

`std::sort` 是 **introsort**（内省排序），把本文的三种算法拼在一起：

- 主体是快速排序（三数取中选基准）；
- 递归深度超过约 $2\log_2 n$ 时，说明划分一直很差，改用**堆排序**，保证最坏 $O(n\log n)$；
- 区间很短时停止递归，最后用**插入排序**收尾。

平均与快排相当，最坏比纯快排好得多。它**不稳定**。

| 函数 | 作用 | 底层 | 复杂度 |
| :-- | :-- | :-- | :--: |
| `std::sort` | 排序，不稳定 | introsort | $O(n\log n)$ |
| `std::stable_sort` | 稳定排序 | 归并排序 | $O(n\log n)$（内存不足时 $O(n\log^2 n)$） |
| `std::partial_sort` | 只把最小的 $k$ 个排好放在前面 | 堆 | $O(n\log k)$ |
| `std::nth_element` | 第 $k$ 小放到位，左边都不大于、右边都不小于 | 快速选择（introselect） | 平均 $O(n)$ |

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <string>
#include <vector>

struct Student { std::string name; int score; };

int main() {
    std::vector<int> a{6, 5, 18, 2, 16, 15, 19, 13, 10, 12, 7, 9, 4, 4, 8, 1, 11, 14, 3, 20, 17, 10};
    std::sort(a.begin(), a.end());                           // 升序
    std::sort(a.begin(), a.end(), std::greater<int>());      // 降序
    std::cout << a.front() << ' ' << a.back() << '\n';       // 20 1

    std::vector<Student> s{{"Bob", 90}, {"Amy", 85}, {"Cat", 90}, {"Dan", 85}};
    std::stable_sort(s.begin(), s.end(),                     // 按分数降序，同分保持原次序
                     [](const Student& x, const Student& y) { return x.score > y.score; });
    for (const auto& t : s) std::cout << t.name << ' ';
    std::cout << '\n';                                       // Bob Cat Amy Dan

    std::vector<int> b{5, 1, 4, 2, 3};
    std::partial_sort(b.begin(), b.begin() + 2, b.end());    // 最小的 2 个排好放在前面
    std::cout << b[0] << ' ' << b[1] << '\n';                // 1 2
}
```

比较函数必须是**严格弱序**：写 `<` 或 `>`，**不能写 `<=` 或 `>=`**。用 `<=` 时，两个相等元素会“互相小于”，`std::sort` 的行为是未定义的，元素较多时可能越界访问、直接崩溃。



### 10.3 比较排序的下界：$\Omega(n\log n)$

任何**只通过比较元素来排序**的算法，最坏情况至少要 $\Omega(n\log n)$ 次比较。用**判定树**证明：

1. 把算法的执行过程画成一棵二叉树：每个内部结点是一次比较“$a_i < a_j$ ?”，两个分支对应两种结果；每片叶子对应一种输出排列。比较次数就是从根到叶子的路径长度。
2. $n$ 个互不相同的元素有 $n!$ 种排列，算法必须把它们都区分开，所以**叶子至少 $n!$ 片**。
3. 高度为 $h$ 的二叉树最多 $2^h$ 片叶子，所以 $2^h \ge n!$，
   $$h \ge \log_2(n!) \ge \log_2\left(\tfrac{n}{2}\right)^{n/2} = \tfrac{n}{2}\log_2\tfrac{n}{2} = \Omega(n\log n)$$
   （$n!$ 中较大的一半因子都不小于 $n/2$）。树高正是最坏情况的比较次数。

所以归并排序、堆排序在比较排序里已经是渐近最优的。计数、桶、基数排序不比较元素，站在这个下界的管辖范围之外，代价是对值域或位数有要求。

另一个有用的结论：**只交换相邻元素**的排序（冒泡、插入），每次交换恰好消掉一个逆序对，而随机排列平均有 $n(n-1)/4$ 个逆序对，所以这类算法平均一定是 $\Theta(n^2)$。要从数量级上提速，就必须让元素“跨大步”移动——希尔、快排、归并、堆都是这样做的。



### 10.4 手写排序的易错点

| 易错写法 | 后果 | 正确做法 |
| :-- | :-- | :-- |
| 归并合并时写 `left[i] < right[j]` | 相等时先取右边，**不稳定**；拿它数逆序对还会把相等的一对也算进去（`[2, 2, 1]` 数出 3，应为 2） | 写 `<=` |
| 计数排序 `count[num]` 不减最小值 | 负数下标在 Python 里合法，`count[-1]` 环绕到末尾，**不报错、给错答案**：`[3, -1, 2]` → `[2, 3, 3]` | 先求 `min`，用 `num - min` 做下标 |
| 桶排序用 `(max - min) / n` 当桶宽 | 全部相等或只有一个元素时桶宽为 0，`ZeroDivisionError` | 先特判 `max == min` |
| 插入排序逐对交换、找到位置不停 | 有序输入也要比较 $n(n-1)/2$ 次，最好情况丢了 $O(n)$ | `while` + 后移，遇到不大于 `key` 的就停 |
| 插入排序漏写 `j >= 0` | Python 的 `arr[-1]` 合法，悄悄取到末尾元素，结果错误；C++ 越界 | 循环条件带上下标检查 |
| 快排首/末元素当基准 | 有序、逆序、全部相等的输入退化为 $O(n^2)$；Python 递归 1000 层就 `RecursionError` | 随机基准 + 三路划分 + 短侧递归 |
| `heapq` 里放 `(值, 对象)` | 值相等时比较对象本身，`TypeError` | 放 `(值, 序号, 对象)` |
| C++ 比较函数写 `<=` | 违反严格弱序，`std::sort` 未定义行为，可能崩溃 | 只写 `<` 或 `>` |
| 逆序对计数用 `int` | $n$ 较大时超过 $2^{31}-1$，溢出 | C++ 用 `long long` |

防错的办法：随机数据与 `sorted` / `std::sort` **对拍**，再补四类边界——**空、单元素、全部相等、含负数**；稳定性用“(键, 原序号)”记录来测。本文的每个函数都这样测过。
