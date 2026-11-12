# DSA 二叉树

*Updated 2026-10-16 GMT+8*
 *Compiled by Hongfei Yan (2026 Fall)*
https://github.com/GMyhf/dsa-modernization

**知识点**：二叉树的递归定义与五种基本形态；满二叉树、完全二叉树、扩充二叉树与 $E=I+2n$；
二叉树的性质 1–7；线索二叉树与 Morris 遍历；前序、中序、后序与层次周游；表达式树；
由周游序列重建二叉树，以及递归到显式栈的改写；非递归周游；二叉链表、三叉链表与完全二叉树的顺序存储；
二叉搜索树的查找、插入、删除；最小堆的上浮与下沉、建堆 $O(n)$、优先队列与对顶堆；Huffman 树、带权路径长度与前缀编码。

> 本章要回答三个问题
>
> 1. **二叉树为什么不是「度为 2 的树」？** 子树有左右之分，次序不能颠倒：挂左边和挂右边是两棵不同的二叉树。
> 2. **一棵树能摊成几种线性序列？** 前序、中序、后序靠栈（递归），层次周游靠队列。同一个结点，换一种次序就换一批邻居。
> 3. **要多少「序」，才够快？** 全序：BST 让增删查都走 $O(h)$。只要最小值：堆只需局部有序，建堆 $O(n)$；Huffman 反复取两个最小。
>
> 一句话概括：**二叉树的定义是递归的，所以本章算法几乎都是递归的——代码的形状和定义的形状一眼对上。**


**先跑一遍**

先建树并打印四种周游，再插一棵 BST：

```cpp file=code/ch05/binary_tree/demo.cpp
// 第 5 章「先跑一遍」：用教学版 BinaryTree 与 BinarySearchTree 走一遍四种周游与增删查。
// 编译运行：
//   g++ -std=c++17 -I code/ch05/binary_tree code/ch05/binary_tree/demo.cpp -o demo && ./demo
#include "teaching.hpp"

#include <iostream>

int main() {
    // 建一棵样例树：A 的左孩子 B（孩子 D、E），右孩子 C（叶子）
    BinaryTree<char> d, e, b, c, root;
    d.create_leaf('D');
    e.create_leaf('E');
    b.create_tree('B', d, e);      // d、e 的所有权转移给 b，之后两者变空
    c.create_leaf('C');
    root.create_tree('A', b, c);

    std::cout << "先序: ";
    root.preorder([](char value) { std::cout << value; });
    std::cout << "\n中序: ";
    root.inorder([](char value) { std::cout << value; });
    std::cout << "\n后序: ";
    root.postorder([](char value) { std::cout << value; });
    std::cout << "\n层次: ";
    root.level_order([](char value) { std::cout << value; });
    std::cout << '\n';

    BinarySearchTree<int> tree;
    for (int key : {8, 3, 10, 1, 6, 14, 4, 7}) {
        (void)tree.insert(key);
    }
    std::cout << "BST 中序:";
    tree.inorder([](int key) { std::cout << ' ' << key; });   // 中序 = 升序
    std::cout << "\n含 6? " << (tree.contains(6) ? "是" : "否")
              << "  删 3 后含 3? ";
    (void)tree.remove(3);
    std::cout << (tree.contains(3) ? "是" : "否") << '\n';
}
```

```bash
c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch05/binary_tree \
    code/ch05/binary_tree/demo.cpp -o /tmp/tree-demo
/tmp/tree-demo
```

```console
先序: ABDEC
中序: DBEAC
后序: DEBCA
层次: ABCDE
BST 中序: 1 3 4 6 7 8 10 14
含 6? 是  删 3 后含 3? 否
```

`create_tree(value, left, right)` 接管两棵子树：`left` 和 `right` 在调用之后变空，不会和新建的树抢着析构同一批结点。BST 中序输出正是升序，这是「左小右大」的直接推论（第 4 节）。

最小堆依次取出最小元；权 2、3、4、7 的 Huffman 树：

```cpp file=code/ch05/heap_huffman/demo.cpp
// 第 5 章「先跑一遍」：用教学版 MinHeap 与 HuffmanTree。
// 编译运行：
//   g++ -std=c++17 -I code/ch05/heap_huffman code/ch05/heap_huffman/demo.cpp -o demo && ./demo
#include "teaching.hpp"

#include <iostream>

int main() {
    MinHeap<int> heap;
    for (int value : {5, 1, 4, 2}) {
        heap.insert(value);
    }
    std::cout << "依次取出最小元:";
    while (auto value = heap.remove_min()) {   // 空堆返回 nullopt，循环自然结束
        std::cout << ' ' << *value;
    }
    std::cout << '\n';

    const int weights[] = {2, 3, 4, 7};
    const HuffmanTree tree(weights, 4);
    std::cout << "权 2,3,4,7 的 Huffman 树根权 = " << tree.total_weight() << '\n';
    std::cout << "带权路径长度 WPL = " << tree.weighted_path_length() << '\n';
}
```

```bash
c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch05/heap_huffman \
    code/ch05/heap_huffman/demo.cpp -o /tmp/heap-demo
/tmp/heap-demo
```

```console
依次取出最小元: 1 2 4 5
权 2,3,4,7 的 Huffman 树根权 = 16
带权路径长度 WPL = 30
```

空堆上 `remove_min()` 返回空 optional，`while` 循环自然结束。WPL $=30$ 的来历见第 6 节。


# 1 二叉树的概念

二叉树由结点的有限集合构成：或者为空，或者由一个根和两棵互不相交的左、右子树组成。左右次序不能颠倒。根没有父结点；其余每个结点恰有一个父结点，至多两个孩子。没有孩子的是叶，其余是内部结点。从根到某结点的边数是该结点的层数，根在第 0 层。

按定义展开，二叉树只有 5 种基本形态：(a) 空树；(b) 只有一个根结点；(c) 右子树为空；(d) 左子树为空；(e) 左右子树均非空。

![图 5.1 二叉树的 5 种基本形态](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-1.png)

图 5.1　二叉树的 5 种基本形态。**(c) 和 (d) 是两棵不同的二叉树**——同样是一个根加一个孩子，挂左边和挂右边不能混为一谈。第 6 章的一般树没有这个区分，这正是二叉树不是「度为 2 的树」的原因。

## 1.1 二叉树的定义和基本术语

**定义。** 二叉树（binary tree）由结点的有限集合构成，这个有限集合或者为空集（empty），或者为由
一个根结点（root）及两棵互不相交、分别称做这个根的左子树（left subtree）和右子树（right subtree）
的二叉树组成的集合。这个**递归定义**刻画了二叉树的固有特性：二叉树既可以是一棵空树，也可以是
由一个根结点和分别为其左子树和右子树的互不相交的二叉树组成（其左、右子树也可以为空）。

值得注意的是，**二叉树的子树有左、右之分，其次序不能颠倒**——上面图 5.1 中的 (c) 和 (d) 分别
表示两棵不同的二叉树。二叉树的结点与表的元素类似，可以表示任何一种数据类型。

**基本术语。** 二叉树是由唯一的起始结点引出的结点集合，这个起始结点称为**根**（root）。

- 二叉树中的任何非根结点都有且仅有一个前驱结点，称为该结点的**父结点**（或称双亲，parent）；
  根结点即为二叉树中唯一没有父结点的结点。
- 任何结点最多可能有两个后继结点，分别称为**左子结点**（左孩子、左子女，left child）和**右子结点**
  （右孩子、右子女，right child）。具有相同父结点的结点之间互称**兄弟结点**（sibling）。
- 一个结点的子树数目称为该结点的**度**（degree）。没有子结点的结点称为**叶结点**（leaf，也称树叶
  或终端结点），叶结点的度为 0；除叶结点以外的那些非终端结点称为**内部结点**（或分支结点，
  internal node）。
- 父结点 $k$ 与子结点 $k'$ 之间存在的一条有向连线 $\langle k, k' \rangle$ 称做**边**（edge）。
- 若二叉树中存在结点序列 $k_0, k_1, \cdots, k_s$，使得 $\langle k_0, k_1 \rangle$、
  $\langle k_1, k_2 \rangle$、$\cdots$、$\langle k_{s-1}, k_s \rangle$ 都是二叉树中的边，则称从结点
  $k_0$ 到结点 $k_s$ 存在一条**路径**（path），该路径所经历的边的个数称为这条路径的**路径长度**
  （path length）。若有一条由 $k$ 到达 $k_s$ 的路径，则称 $k$ 是 $k_s$ 的**祖先**（ancestor），
  $k_s$ 是 $k$ 的**子孙**（descendant）。
- 切断一个结点与其父结点的连接，则该结点与其子孙构成的树就称为以该结点为根的**子树**
  （subtree）。从根结点到某个结点的路径长度称为结点的**层数**（level）：根结点为第 0 层，非根
  结点的层数是其父结点的层数加 1。

除了严格区分左右子结点外，其他二叉树概念在第 6 章的一般树形结构中也适用。

下面这棵树：

```text
      A
     / \
    B   C
   / \
  D   E
```

这棵 5 个结点的小树是本章示例程序用的例子。2.2 节讨论周游次序时会换成原书图 5.5 那棵 9 个结点的树——结点多一些，三种周游的差别才看得出来。

四种周游访问的是同一组结点，次序不同：

| 周游 | 顺序 | 本例 |
| --- | --- | --- |
| 先序 | 根，左，右 | A B D E C |
| 中序 | 左，根，右 | D B E A C |
| 后序 | 左，右，根 | D E B C A |
| 层次 | 按离根的距离 | A B C D E |

递归版周游最贴合定义，也是第 2 节要教的东西。代价是**递归深度等于树高**：极深的退化树（比如按升序往 BST 里插入得到的一条链）会耗尽运行栈。所以教学版的周游保留递归——它就是本章要教的东西；而析构与深拷贝不是教学内容，却会被一次普通的作用域结束、一句 `auto copy = tree;` 隐式触发，工程版就把它们改成了迭代（析构用「右旋到没有左孩子，再沿右链逐个删」的办法，额外空间 $O(1)$）。

## 1.2 满二叉树、完全二叉树、扩充二叉树

任何结点或者是叶，或者左右子树都非空，叫做满二叉树（full binary tree）。这个定义只要求**没有度为 1 的结点**，不要求叶在同一层，结点数也不固定——图 5.2(a) 的叶 C 在第 1 层、D 在第 2 层、F 和 G 在第 3 层。

注意口径：有些教材所说的「满二叉树」是指**每一层都排满**（英文 perfect binary tree），深度为 $k$ 时恰有 $2^{k+1}-1$ 个结点、叶全在第 $k$ 层。它是本书满二叉树的特例；答题时先说清用的是哪种定义。

完全二叉树（complete binary tree）不要求每个内部结点都有两个孩子，但**最多只有最下面两层的结点度数可以小于 2**（换句话说，除最后一层外每层都排满），且最下层的结点从左到右连续排列、没有空洞。由此可知它的叶只出现在最下两层；但反过来「叶只在最下两层」并不够——一条三个结点的左链 A→B→C 只有一片叶 C，却因第 1 层缺了 A 的右孩子而不完全。堆正是利用这个条件按层编号存进数组：编号关系见 1.3 节。满二叉树与完全二叉树**互不包含**：图 5.2(a) 是满的，但 C 没有孩子，第 2 层缺了两个位置，而下面还有第 3 层，所以不完全；图 5.2(b) 是完全的，但 F 只有一个孩子，所以不满。每层都排满的二叉树（perfect）才既满又完全。

![图 5.2 满二叉树和完全二叉树示例](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-2.png)

图 5.2　(a) 满二叉树；(b) 完全二叉树。

把普通二叉树的每个空子树位置都补成一个“外部叶”，所得树叫扩充二叉树（extended binary tree），原来的结点叫内部结点。若原树有 $n$ 个内部结点，则扩充树有 $n+1$ 个外部叶。

![图 5.3 扩充二叉树](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-3.png)

图 5.3　扩充二叉树：方框是补出来的外部叶，圆圈是原有的内部结点。补完之后每个内部结点都恰好有两个孩子，所以扩充二叉树一定是满二叉树——第 6 节算带权外部路径长度时用的就是这张图的形状。设内部路径长度 $I$ 为根到所有内部结点的边数之和，外部路径长度 $E$ 为根到所有外部叶的边数之和，则

$$E=I+2n.$$

以图 5.3 为例（$n=10$ 个内部结点、11 个外部叶），按深度逐个相加：

$$E=3+4+4+3+4+4+3+4+4+3+3=39,\qquad I=0+1+2+3+2+3+1+2+3+2=19,$$

正好 $39=19+2\times10$。

直观的理由是：每个内部结点向下增加的两条分支，分别把一条路径贡献给外部叶；沿着原树的每条边，路径长度同时在内部路径和外部路径中各增加一次。等价地，对内部结点按度数计边，可得外部叶数为 $n+1$。严格的证明用原书的办法，对内部结点数 $n$ 归纳：

> **证明.** $n=1$ 时 $I=0$、$E=1+1=2$，等式成立。设等式对 $n$ 个内部结点的扩充二叉树成立，考虑有 $n+1$ 个内部结点的扩充二叉树。
> 取一个**两个孩子都是外部叶**的内部结点（最深的内部结点就是这样的），设它到根的路径长度为 $K$，
> 把它连同两个外部叶换成一个外部叶，得到有 $n$ 个内部结点的扩充二叉树。
> 内部路径长度少了 $K$：$I_n=I_{n+1}-K$；外部路径长度少了两个长 $K+1$ 的、多了一个长 $K$ 的：$E_n=E_{n+1}-2(K+1)+K=E_{n+1}-K-2$。
> 由归纳假设 $E_n=I_n+2n$，代入得 $E_{n+1}=I_n+2n+K+2=I_{n+1}+2(n+1)$。∎

这个关系是最优二叉树和 Huffman 树计算带权路径长度的基础。

## 1.3 二叉树的主要性质

第 $i$ 层至多 $2^i$ 个结点；深度为 $k$ 的二叉树至多 $2^{k+1}-1$ 个结点。按层从 0 编号时，
结点 $i$ 的父是 $\lfloor(i-1)/2\rfloor$，左右孩子是 $2i+1$ 与 $2i+2$——第 5 节的堆全靠这一条。
$n$ 个结点的完全二叉树高度为 $\lceil\log_2(n+1)\rceil$。这些性质原书没错，原样保留。

先说清两个容易混的词。**深度**是最大的层数（根在第 0 层，所以只有一个根的树深度为 0）；
**高度**（height）是层数最大的叶结点的层数加 1，也就是「一共有几层」（只有一个根的树高度为 1）。
二者恰好差 1。原书把上面几条依次编为：

- **性质 1**：第 $i$ 层上最多有 $2^i$ 个结点（$i\ge 0$）。对 $i$ 归纳：第 0 层只有根；第 $i$ 层每个结点至多两个孩子，所以第 $i+1$ 层至多 $2\cdot 2^i$ 个。
- **性质 2**：深度为 $k$ 的二叉树至多有 $2^{k+1}-1$ 个结点（$k\ge 0$）。把性质 1 对 $i=0,\dots,k$ 求和：$1+2+\cdots+2^k=2^{k+1}-1$。
- **性质 3～5** 见下文。
- **性质 6**：有 $n$ 个结点（$n>0$）的完全二叉树，高度为 $\lceil\log_2(n+1)\rceil$，深度为 $\lceil\log_2(n+1)\rceil-1$（也等于 $\lfloor\log_2 n\rfloor$）。证明：设高度为 $h$，完全二叉树前 $h-1$ 层排满、第 $h$ 层至少有一个结点，由性质 2 得 $2^{h-1}-1<n\le 2^h-1$，即 $2^{h-1}<n+1\le 2^h$；取对数 $h-1<\log_2(n+1)\le h$，$h$ 是整数，所以 $h=\lceil\log_2(n+1)\rceil$。例如 $n=10$（第 3 节图 5.9 去掉最后两个结点）时高度为 $\lceil\log_2 11\rceil=4$。
- **性质 7**：$n$ 个结点的完全二叉树按层次、从左到右编号 $0\sim n-1$，对任一结点 $i$：
  (1) $i=0$ 是根；$i>0$ 时父结点是 $\lfloor(i-1)/2\rfloor$。
  (2) 当 $2i+1\le n-1$ 时左孩子是 $2i+1$，否则没有左孩子；当 $2i+2\le n-1$ 时右孩子是 $2i+2$，否则没有右孩子。
  (3) $i$ 为偶数且 $0<i<n$ 时左兄弟是 $i-1$；$i$ 为奇数且 $i+1<n$ 时右兄弟是 $i+1$。

> **性质 7 (2) 的证明.** 设结点 $i$ 在第 $j$ 层、是该层从左数第 $p$ 个（从 0 数）。第 $j$ 层之前共有
> $1+2+\cdots+2^{j-1}=2^j-1$ 个结点，所以 $i=(2^j-1)+p$。完全二叉树里第 $j$ 层在它左边的 $p$ 个结点
> 都排满了孩子，共 $2p$ 个，排在第 $j+1$ 层的最前面；于是 $i$ 的左孩子是第 $j+1$ 层第 $2p$ 个，编号
> $(2^{j+1}-1)+2p=2\big[(2^j-1)+p\big]+1=2i+1$，右孩子紧随其后是 $2i+2$。编号超过 $n-1$ 就说明那个孩子不存在。
> (1) 是 (2) 反过来解：$2i'+1=i$ 或 $2i'+2=i$，两种情况都有 $i'=\lfloor(i-1)/2\rfloor$。(3) 由 (2) 直接得到：左孩子编号是奇数、右孩子是偶数。∎
>
> 例：第 3 节图 5.9 那棵 $n=12$ 的完全二叉树里，结点 5（F）的左孩子是 11（L），右孩子 12 超出了 $n-1=11$，所以 F 没有右孩子；结点 11 的父结点是 $\lfloor 10/2\rfloor=5$。

其中三条值得单独写下来，因为后面反复要用。

**性质 3**：非空二叉树的叶结点数 $n_0$ 等于度为 2 的结点数 $n_2$ 加 1，即 $n_0 = n_2 + 1$。

> **证明.** 设结点总数 $n$、度为 1 的结点数 $n_1$，则 $n = n_0 + n_1 + n_2$。
> 换个角度数边：除根之外每个结点都恰好有一条边进入，所以边数 $e = n - 1$；
> 而这些边都是从度为 1 或 2 的结点射出的，所以 $e = n_1 + 2n_2$。
> 两式合起来得 $n_0 + n_1 + n_2 = n_1 + 2n_2 + 1$，即 $n_0 = n_2 + 1$。∎

**性质 4（满二叉树定理）**：非空满二叉树的**树叶数目等于其分支结点数加 1**。

> **证明.** 满二叉树里每个结点的度非 0 即 2，也就是 $n_1 = 0$，
> 于是分支结点就是 $n_2$，由性质 3 直接得 $n_0 = n_2 + 1$。∎

**性质 5（满二叉树定理推论）**：非空二叉树的**空子树数目等于其结点数加 1**。

> **证明.** 设二叉树为 $T$，把它所有的空子树都换成树叶，得到的扩充二叉树记为 $T'$。
> $T'$ 是满二叉树，而 $T$ 原来的每个结点在 $T'$ 里都成了分支结点。
> 由满二叉树定理，$T'$ 的树叶数 = 分支结点数 + 1 = $T$ 的结点数 + 1。
> 而每片新添的树叶恰好对应 $T$ 的一棵空子树，所以 $T$ 的空子树数目等于它的结点数加 1。∎

## 1.4 线索二叉树与 Morris 遍历

性质 5 不是纸面游戏：它说明**一棵 $n$ 个结点的二叉树里有 $n+1$ 个空指针**。换个角度再数一遍：$n$ 个结点共 $2n$ 个指针域，除根外每个结点被一根指针指着，用掉 $n-1$ 个，空着 $2n-(n-1)=n+1$ 个——一半以上的指针域是空的。链式存储时这些空指针占的空间和结点本身同阶，线索二叉树、Trie 的压缩、第 12 章 PATRICIA 的动机都从这里来。

能不能利用这些空指针？左指针空就存中序前驱，右指针空就存中序后继——这就是**线索**（thread）。（中序 = 左 → 根 → 右，第 2 节细讲；本节的代码可以学完 2.2 节再回来看。）

![图 5.23 中序穿线二叉树](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-23.png)

图 5.23　中序穿线（线索）二叉树。虚线是借空指针存下的中序前驱/后继，结点里另加一位标志区分「这根指针是孩子还是线索」。有了它，中序遍历不用栈也不用递归。

拿到一根指针，怎么知道它是孩子还是线索？**每根指针一位标志**（不是每个结点一位）。

> 现代的看法：线索二叉树适合教学和需要低额外空间遍历的专门场景；插入、删除都要维护线索，所以现代通用库通常直接使用显式栈、父指针或迭代器，不应把线索化当作默认的树表示。原书把它放在习题里。它的思想今天仍活在 Morris 遍历里（临时线索，用完拆掉）。

下面的代码都用这棵树 1(2(4, 5), 3)，中序序列是 **4 2 5 1 3**。完整可运行的程序（含递归中序对照与自检）见 `courseware/code/ch05_threaded_morris.cpp`。

```text
      1
     / \
    2   3
   / \
  4   5
```

#### 线索化：按中序走一遍，把空指针接到前驱 / 后继

```cpp
struct Node {
    T value;
    Node* left = nullptr;
    Node* right = nullptr;
    bool left_thread = false;    // true：left 存的是中序前驱
    bool right_thread = false;   // true：right 存的是中序后继
};

// 线索化：按中序走一遍，pre 是上一个访问到的结点
static void thread_impl(Node* node, Node*& pre) {
    if (node == nullptr) return;
    thread_impl(node->left, pre);
    if (node->left == nullptr) {                   // 空左指针 → 存中序前驱
        node->left = pre;
        node->left_thread = true;
    }
    if (pre != nullptr && pre->right == nullptr) { // 上一个结点的空右指针 → 存后继
        pre->right = node;
        pre->right_thread = true;
    }
    pre = node;
    thread_impl(node->right, pre);
}

static void make_threaded(Node* root) {
    Node* pre = nullptr;
    thread_impl(root, pre);
    if (pre != nullptr) pre->right_thread = true;  // 最后一个结点：后继为空
}
```

这就是一次中序周游，只是把「访问」换成了「接线索」：访问到某个结点时，**上一个被访问的结点 `pre` 就是它的中序前驱**。所以在访问时刻，自己的左指针空着就指向 `pre`；`pre` 的右指针空着就指向自己。

- **`pre` 要用引用 `Node*&`**：整次遍历只有一个「上一个结点」，所有递归层共用这一个变量；按值传，右子树递归回来后 `pre` 的更新就丢了。
- **改指针不会和递归冲突**：每根指针都是在遍历完它指向的那棵子树**之后**才被改写，递归永远不会顺着刚接上的线索走回去。
- **两端是空线索**：中序第一个结点的 `left`、最后一个结点的 `right` 值为空，但标志都是 `true`。这样周游时只看标志位，不用再判空。

在例子上走一遍：

| 访问到 | 进来时的 pre | 自己的左指针 | pre 的右指针 |
|---|---|---|---|
| 4 | 空 | 4.left = 空，标为线索 | pre 为空，跳过 |
| 2 | 4 | 有左孩子，不动 | 4.right = 2 |
| 5 | 2 | 5.left = 2 | 2 有右孩子，不动 |
| 1 | 5 | 有左孩子，不动 | 5.right = 1 |
| 3 | 1 | 3.left = 1 | 1 有右孩子，不动 |

#### 沿线索找后继：中序周游不用栈，也不用递归

```cpp
// 中序后继：右指针是线索就直接跳；否则是右子树里最左下的结点
static Node* next(Node* node) {
    if (node->right_thread) return node->right;
    node = node->right;
    while (!node->left_thread) node = node->left;
    return node;
}

template <typename Visitor>
static void inorder_threaded(Node* root, Visitor& visit) {
    if (root == nullptr) return;
    Node* node = root;
    while (!node->left_thread) node = node->left;  // 中序第一个：最左下
    for (; node != nullptr; node = next(node)) visit(node->value);
}
```

| 结点 p 的情况 | 中序后继 |
| --- | --- |
| `right_thread = true` | 就是 `p->right`，一步到位 |
| `right_thread = false` | 右子树里一路向左走到底（左指针是线索为止） |

「走到底」只能用 `!left_thread` 判断，不能用 `left != nullptr`：线索化之后，叶子的左指针也指着前驱，几乎都不为空。每个结点只多两位标志，额外空间 $O(1)$；每条边最多走两次，时间 $O(n)$。代价在别处：插入、删除都要维护线索。

#### Morris 遍历：临时线索，用时搭上，用完拆掉

普通周游要用栈，是因为进左子树之前必须记住「回来的路」。Morris 注意到：**`cur` 的左子树里最后被访问的结点（中序前驱，即左子树最右下的结点），它的 `right` 一定是空的**——让它临时指回 `cur`，路就存在树里了。

```cpp
// Morris 中序周游：额外空间 O(1)。中途临时改树，结束时恢复原样。
template <typename Visitor>
static void morris_inorder(Node* root, Visitor& visit) {
    Node* cur = root;
    while (cur != nullptr) {
        if (cur->left == nullptr) {            // 没有左子树：访问，往右走
            visit(cur->value);
            cur = cur->right;                  // 可能是真孩子，也可能是临时线索
            continue;
        }
        Node* pre = cur->left;                 // 找中序前驱：左子树最右下
        while (pre->right != nullptr && pre->right != cur) pre = pre->right;
        if (pre->right == nullptr) {           // 第一次到 cur：搭线索，进左子树
            pre->right = cur;
            cur = cur->left;
        } else {                               // 第二次到 cur：左子树已走完
            pre->right = nullptr;              // 拆线索，恢复原树
            visit(cur->value);
            cur = cur->right;
        }
    }
}
```

**怎么分辨第一次 / 第二次到 `cur`？** 不用标志位：从 `cur->left` 一路向右，碰到的若是 `cur` 本身，说明线索是自己上次搭的，左子树已经走完。找前驱那个循环的第二个条件 `pre->right != cur` 绝对不能漏，漏了就会顺着线索走回 `cur`、再进左子树，死循环。

| cur | 左子树最右下 pre | 动作 | 输出 |
| --- | --- | --- | --- |
| 1 | 5，right 空 | 搭 5→1，进左子树 | |
| 2 | 4，right 空 | 搭 4→2，进左子树 | |
| 4 | （无左子树） | 访问；顺 4→2 回到 2 | 4 |
| 2 | 4，right = 2 | 第二次：拆 4→2，访问，进右 | 2 |
| 5 | （无左子树） | 访问；顺 5→1 回到 1 | 5 |
| 1 | 5，right = 1 | 第二次：拆 5→1，访问，进右 | 1 |
| 3 | （无左子树） | 访问；right 空，结束 | 3 |

推演口诀：**有左子树的结点经过两次**——第一次搭线索、进左；第二次拆线索、访问、进右。没有左子树的结点：访问，往右（可能顺着线索回去）。

- **时间 $O(n)$**：内层循环走的是「`cur` 左子树的右边链」，不同结点的这条链互不重叠，搭线索时走一遍、拆线索时再走一遍，每条边至多走 3 次。
- **空间 $O(1)$**：只有 `cur`、`pre` 两个指针。
- **⚠ 中途在改树**：`visit` 抛异常或提前退出，线索就留在树上；周游期间别的线程也不能同时读这棵树。函数参数是 `Node*` 而不是 `const Node*`，从签名就看得出它要改树。

|  | 线索二叉树 | Morris 遍历 |
| --- | --- | --- |
| 线索存多久 | 一直在，是存储结构的一部分 | 周游时临时搭，用完拆掉 |
| 结点结构 | 每根指针多一位标志 | 不变，不要标志位 |
| 怎么判断是不是线索 | 看标志位 | 看前驱的 `right` 是否指回 `cur` |
| 代价 | 插入、删除要维护线索 | 周游中途改树，不能并发读 |

两者的共同点：都利用性质 5 的 $n+1$ 个空指针，让中序周游不用栈也不用递归。Morris 可以看成「临时线索化」。把 `visit` 移到「第一次到 `cur`」的分支（以及没有左子树的分支），就得到 Morris 前序遍历。


# 2 二叉树的周游

第 1 节介绍了二叉树的逻辑结构，本节讨论二叉树的抽象数据类型和几种周游算法。

## 2.1 二叉树的抽象数据类型

一般情况下，需要在二叉树的各个结点中存储必要的信息，对二叉树的操作和运算也主要集中在访问
结点信息上：访问某个结点的左子结点、右子结点、父结点，或者访问结点存储的数据；从应用角度看，
有时还需要遍历二叉树的每个结点。二叉树 ADT 的基本操作因此包括建树、判空、取得根和左右子树，
以及先序、中序、后序和层次周游，在具体应用中可以此为基础进行扩充。

**为了强调抽象数据类型与存储无关，这里并不规定该 ADT 的存储方式**——二叉树结点的各种存储
方式在第 3 节讨论，本节先从调用方观察这些操作。（原书【代码5.1】【代码5.2】分别给出二叉树
结点类和二叉树类，并把二叉树类声明为结点类的**友元类**，以便访问结点的私有成员。本书改用
另一种做法：结点是二叉树内部的实现细节，对外只暴露一组访问器，因此不需要友元声明。）

所谓二叉树的**周游**（或称遍历，traversal）是指按照一定顺序依次访问树中所有的结点，并使得每个
结点仅被访问一次。这里所说的「访问」是指**操作**，可以理解成对结点数据成员的处理，例如输出、
修改结点的信息等。

对于线性结构来说周游是一个很容易的问题；但二叉树是一种非线性结构，每个结点可以有一个以上
的直接后继，因此需要把二叉树中的结点转化为顺序结构才能周游整棵树。**周游一棵二叉树的过程，
实际上就是把二叉树的结点放入一个线性序列的过程，即对二叉树进行线性化。** 下面介绍两类周游
方法：深度优先周游和广度优先周游。

## 2.2 深度优先周游二叉树

二叉树的逻辑结构只有三个基本单元：根结点、左子树、右子树。

![图 5.4 二叉树的基本结构](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-4.png)

图 5.4　二叉树的基本结构。周游一棵树就是安排这三件事的先后：记访问当前结点为 $t$、周游左子树为 $L$、周游右子树为 $R$，六种排列里约定「先左后右」，剩下的就是前序 $tLR$、中序 $LtR$、后序 $LRt$ 三种。

深度优先周游的思路是尽量往深处走：沿左链一路下降，遇到左子树为空就退回最近的、右子树尚未访问的分支结点，转向它的右孩子，再继续尽量往左。重复到没有结点可退为止，每个结点恰好被访问一次。

按图 5.4 说明里的记号，三种深度优先周游的递归定义是：

| 次序 | 名字 | 递归定义 |
| --- | --- | --- |
| tLR | 前序（preorder） | 访问根 → 前序周游左子树 → 前序周游右子树 |
| LtR | 中序（inorder） | 中序周游左子树 → 访问根 → 中序周游右子树 |
| LRt | 后序（postorder） | 后序周游左子树 → 后序周游右子树 → 访问根 |

![图 5.5 二叉树示例：根 A；左子树的根 B 有孩子 D 和 E，E 有左孩子 G；右子树的根 C 有右孩子 F，F 有孩子 H 和 I](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-5.png)

前序（中序、后序）周游二叉树得到二叉树结点的一个有序序列，称为二叉树的前序（中序、后序）
**序列**。对于图 5.5 所示的二叉树：

| 周游 | 序列 |
| --- | --- |
| 前序 $tLR$ | `A B D E G C F H I` |
| 中序 $LtR$ | `D B G E A C H F I` |
| 后序 $LRt$ | `D G E B H I F C A` |

二叉树这种非线性结构经过周游转化成线性序列，从而**可以指定某种周游次序下某结点的前驱和后继
结点**。以结点 $E$ 为例：在前序序列中它的前驱是 $D$、后继是 $G$；中序序列中 $E$ 的前驱是 $G$、
后继是 $A$；后序序列中 $E$ 的前驱是 $G$、后继是 $B$。同一个结点，在三种线性化下有三组不同的
邻居——这正是「周游次序」这件事本身的意义。

原书【算法5.3】把三种周游写成三个递归函数，与存储结构无关。教学版照搬这个结构（完整实现见第 3 节）：

```cpp file=code/ch05/binary_tree/teaching.hpp#fn:BinaryTree::preorder_impl
template <typename Visitor>
static void preorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    visit(node->value);                 // 根
    preorder_impl(node->left, visit);   // 左
    preorder_impl(node->right, visit);  // 右
}
```

```cpp file=code/ch05/binary_tree/teaching.hpp#fn:BinaryTree::inorder_impl
template <typename Visitor>
static void inorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    inorder_impl(node->left, visit);    // 左
    visit(node->value);                 // 根
    inorder_impl(node->right, visit);   // 右
}
```

```cpp file=code/ch05/binary_tree/teaching.hpp#fn:BinaryTree::postorder_impl
template <typename Visitor>
static void postorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    postorder_impl(node->left, visit);  // 左
    postorder_impl(node->right, visit); // 右
    visit(node->value);                 // 根
}
```

三个函数的形状完全一样，只差 `visit` 那一行放在哪里。**递归在这一章的价值就在这里：代码的形状和定义的形状能一眼对上。** 读的时候要把「访问」和「走进去」分清楚——`visit(node->value)` 是访问，`preorder_impl(node->left, visit)` 是走进去；报错的序列多半来自把这两件事混为一谈。

每个结点进出各一次，三种周游的时间代价都是 $O(n)$。空间代价是递归深度，等于树高：平衡时约 $\log_2 n$，退化成一条链时是 $n$，1.1 节说的「压穿运行栈」就是这种树。非递归写法见下面的「非递归周游」。

#### 非递归周游：手写栈显式模拟调用栈

递归周游的栈是运行栈；把它换成自己管的栈，就是原书【算法5.4】–【算法5.6】的非递归周游。工程版（`modern.hpp`）用第三章那把手写链式栈 `LinkedStack` 写了三个迭代版，**只作补充，不替换递归主实现**：

```cpp
template <typename Visitor>
void preorder_iterative(Visitor&& visit) const {
    LinkedStack<const Node*> pending;
    if (root_ != nullptr) pending.push(root_);
    while (auto node = pending.pop()) {
        visit((*node)->value);
        if ((*node)->right != nullptr) pending.push((*node)->right);
        if ((*node)->left != nullptr) pending.push((*node)->left);
    }
}
template <typename Visitor>
void inorder_iterative(Visitor&& visit) const {
    LinkedStack<const Node*> pending;
    const Node* current = root_;
    while (current != nullptr || !pending.empty()) {
        while (current != nullptr) {
            pending.push(current);
            current = current->left;
        }
        current = *pending.pop();
        visit(current->value);
        current = current->right;
    }
}
template <typename Visitor>
void postorder_iterative(Visitor&& visit) const {
    struct Frame { const Node* node; bool expanded; };
    LinkedStack<Frame> pending;
    if (root_ != nullptr) pending.push(Frame{root_, false});
    while (auto frame = pending.pop()) {
        if (frame->expanded) {
            visit(frame->node->value);
        } else {
            pending.push(Frame{frame->node, true});
            if (frame->node->right != nullptr) pending.push(Frame{frame->node->right, false});
            if (frame->node->left != nullptr) pending.push(Frame{frame->node->left, false});
        }
    }
}
```

- **前序**：弹出即访问；**先压右再压左**，左孩子才会先出栈。
- **中序**：沿左链一路压栈；弹出一个就访问，再转向它的右子树。
- **后序**：给每帧加一个 `expanded` 标志。第一次弹出时还没展开——把自己标成已展开压回去，再压右、压左；第二次弹出（已展开）才访问。这样根一定在左右子树之后。

中序迭代版在 A(B(D, E), C) 上走一遍：

| 步 | 动作 | 栈（底→顶） | 输出 |
| --- | --- | --- | --- |
| 1 | 沿左链压 A、B、D | A B D | |
| 2 | 弹 D 访问；转 D 的右（空） | A B | D |
| 3 | 弹 B 访问；转 E | A | DB |
| 4 | 压 E（无左孩子） | A E | |
| 5 | 弹 E 访问；转空 | A | DBE |
| 6 | 弹 A 访问；转 C | 空 | DBEA |
| 7 | 压 C | C | |
| 8 | 弹 C 访问；栈空，结束 | 空 | DBEAC |

#### 表达式树：周游的一个用途

三种周游次序不是三种口味，它们各自对应一种实用的表达式写法。图 5.6 是表达式 $A + B \times (C + D)$ 的二叉树表示：运算符落在内部结点，运算对象落在叶结点，括号一个都不出现——树的形状已经把运算次序记下来了。

![图 5.6 表达式树：根是加号，左孩子是 A，右孩子是乘号；乘号的左孩子是 B，右孩子是加号，其孩子为 C 和 D](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-6.png)

| 周游 | 得到 | 本例 |
| --- | --- | --- |
| 前序 | **前缀**表达式（波兰式） | `+ A × B + C D` |
| 中序 | 中缀表达式（缺括号） | `A + B × C + D` |
| 后序 | **后缀**表达式（逆波兰式） | `A B C D + × +` |

中序那一行值得多看一眼：它和原式长得像，但**括号丢了**，照它算出来的是 $A + B \times C + D$，已经不是原来的表达式。要印回可读的中缀式，必须在周游时按优先级补括号。前缀式和后缀式不需要括号——运算符出现的位置本身就定死了运算次序。

第三章 1.4 节那个后缀表达式求值器（原书【算法3.5】）吃的正是这棵树后序周游的结果；那一节把中缀式转成后缀式的工作，换个说法就是「建出这棵表达式树，再后序周游一遍」。上机题「表达式二叉树」要做的就是这件事：读入一种表达式，在机内建出这棵树，再按要求输出另外两种。

#### 由周游序列重建二叉树

反过来问：给出周游序列，能不能把树建回来？**一个序列不行**——前序 `A B C` 既可以是一条左链，也可以是一条右链。**前序（或后序）加中序就够了**，前提是结点的关键码互不相同：后序的最后一个元素（前序的第一个元素）一定是根；在中序里找到根的位置 $k$，它左边的就是左子树的全部结点，右边的就是右子树；左子树的结点个数 $k$ 一旦知道，前序或后序里哪一段属于左子树、哪一段属于右子树也就切开了。对两段各做一遍同样的事，直到区间为空。

以图 5.5 为例：后序 `D G E B H I F C A` 的末元素 A 是根；A 在中序 `D B G E A C H F I` 里左边有 4 个结点，于是后序的前 4 个 `D G E B` 是左子树的后序、接下来的 `H I F C` 是右子树的后序，再各自对照中序的 `D B G E` 与 `C H F I` 递推下去。前序加后序则不够：前序 `A B`、后序 `B A` 说不清 B 是左孩子还是右孩子。

这是一道典型的上机题（例如本节末的示例 OJ24750），写法有两处常见的坑。第一，每一层都把子数组拷贝出来再递归，总代价会退化成 $O(n^2)$；只传**下标区间**就不必拷贝。第二，**输入不自洽时默默建出一棵树**。中序 `1 2 3`、后序 `3 1 2` 不对应任何一棵二叉树：根是 2，左子树只该有结点 1，后序里对应的却是 3。朴素写法在这里要么越界、要么建出一棵中序根本不是 `1 2 3` 的树。本书的处理与第 6 章由双标记先根序列重建森林（【算法6.10】）时一样：**能当场指出输入错了，就不把错误合法化**。检查只要一条——每次取出的根必须落在当前的中序区间里。

教学版把上面的推演原样写成递归，只做「中序 + 后序」；「前序 + 中序」留作练习。对外的入口先把树建在一棵临时树里，建成了才替换掉自己——中途发现序列对不上而抛出异常时，临时树的析构会释放已经建好的那一半，原来的树一个结点都不动：

```cpp file=code/ch05/binary_tree/teaching.hpp#fn:BinaryTree::build_from_inorder_postorder
// 由中序 + 后序序列重建二叉树（两个序列各 count 个元素，关键码互不相同）。
// 递归的主体在 build_impl；前序 + 中序的写法留作本章上机题第 1 题。
//
// 两个序列对不上（比如中序 1 2 3、后序 3 1 2）就抛 std::invalid_argument，
// 不悄悄建出一棵错树；这时本树保持原样。
void build_from_inorder_postorder(const T* inorder, const T* postorder, std::size_t count) {
    BinaryTree fresh;                   // 先建在一棵临时树里：中途抛异常，
    build_impl(fresh.root_, inorder, 0, count, postorder, 0);   // 由它的析构收拾半成品
    clear();                            // 建成了，再拆掉旧树、接过新树
    root_ = fresh.root_;
    fresh.root_ = nullptr;
}
```

递归主体的每一次调用，就是上面图 5.5 那段推演里的一步：参数里的两个区间是当前的中序段和后序段，`key` 是这一段的根，最后两行递归分别去建左子树和右子树：

```cpp file=code/ch05/binary_tree/teaching.hpp#fn:BinaryTree::build_impl
// 把中序 inorder[in_begin, in_end) 与后序 postorder[post_begin, …) 建成一棵子树，挂到 link 上。
// 两段一样长；只传下标，不拷贝子数组。
//
// 后序段的最后一个是根；在中序段里找到它（下标 k），左边 k - in_begin 个是左子树，
// 右边是右子树。左子树的大小一旦知道，后序段也就切成了「左子树 | 右子树 | 根」。
static void build_impl(Node*& link, const T* inorder, std::size_t in_begin, std::size_t in_end,
                       const T* postorder, std::size_t post_begin) {
    if (in_begin == in_end) {
        return;                                         // 空区间：空子树，link 保持 nullptr
    }
    const std::size_t size = in_end - in_begin;
    const T& key = postorder[post_begin + size - 1];    // 后序段的最后一个是根

    std::size_t k = in_begin;                           // 在中序段里从左往右找根
    while (k < in_end && inorder[k] != key) {           // 只找本段：根不在本段，说明两个序列对不上
        ++k;
    }
    if (k == in_end) {
        throw std::invalid_argument("build_from_inorder_postorder: root lies outside its inorder range");
    }

    link = new Node{key, nullptr, nullptr};             // 先挂上：子树里再抛异常，它也归临时树释放
    const std::size_t left_size = k - in_begin;
    build_impl(link->left, inorder, in_begin, k, postorder, post_begin);
    build_impl(link->right, inorder, k + 1, in_end, postorder, post_begin + left_size);
}
```

两处坑在这里各对应一行。参数只有下标，子数组一次也没有拷贝。找根的 `while` 只在本段 `[in_begin, in_end)` 里找——找不到就说明根不在它的中序区间里，中序 `1 2 3`、后序 `3 1 2` 正是在这里被拒：建左子树时，后序段只剩 `3`，中序段却只有 `1`。去掉 `k < in_end` 这个边界，`while` 就会越过本段一直往后读，这就是「要么越界」。

教学版的代价也一目了然：每一帧从左往右找根，最多看一遍本段，所以总时间是 $O(n\cdot h)$，$h$ 为树高；树退化成一条链时就是 $O(n^2)$。递归深度等于树高，与递归周游、递归 `clone` 一样，退化成链的输入会压穿运行栈。教学版也不单独检查重复键：有重复键时它照样能建出一棵中序、后序都对得上的树，只是这棵树不唯一。

找根还能更快。上机题里的关键码多半是字符或小整数，这时可以直接拿关键码当数组下标，先把中序登记成一本「点名册」：`pos[c]` 记下字符 `c` 在中序里的下标，`-1` 表示中序里没有它；登记时发现这一格已经有人，就是中序里有重复键。下面两个函数写在教学版的测试文件里，测试拿它们与类里的两版逐棵对拍：

```cpp file=code/ch05/binary_tree/teaching_test.cpp#fn:fill_position_table
// 「点名册」：pos[c] = 字符 c 坐在中序第几号，-1 表示中序里没有。
// 登记时发现这一格已经有人，就是中序里有重复键。
void fill_position_table(int pos[256], const char* inorder, int count) {
    for (int c = 0; c < 256; ++c) {
        pos[c] = -1;
    }
    for (int i = 0; i < count; ++i) {
        const unsigned char c = static_cast<unsigned char>(inorder[i]);
        if (pos[c] != -1) {
            throw std::invalid_argument("duplicate key in inorder sequence");
        }
        pos[c] = i;
    }
}
```

```cpp file=code/ch05/binary_tree/teaching_test.cpp#fn:build_by_table
// 与 build_impl 同一个递归，只把「从左往右数」换成查一次表：找根 O(1)，总代价 O(n)。
// 两棵子树先各自建成小树，再用 create_tree（【代码5.2】）接到根上。
void build_by_table(BinaryTree<char>& out, const int pos[256], const char* postorder,
                    int in_begin, int in_end, int post_begin) {
    if (in_begin == in_end) {
        out.clear();
        return;
    }
    const char key = postorder[post_begin + (in_end - in_begin) - 1];   // 后序段的最后一个是根
    const int k = pos[static_cast<unsigned char>(key)];                 // 查表：它坐在中序第几号
    if (k < in_begin || k >= in_end) {                                  // 不在本段（-1 也落在这里）
        throw std::invalid_argument("root lies outside its inorder range");
    }
    const int left_size = k - in_begin;
    BinaryTree<char> left, right;
    build_by_table(left, pos, postorder, in_begin, k, post_begin);
    build_by_table(right, pos, postorder, k + 1, in_end, post_begin + left_size);
    out.create_tree(key, left, right);
}
```

递归的形状与 `build_impl` 一样，只是那个从左往右数的 `while` 换成了查一次表：找根 $O(1)$，总代价 $O(n)$。`k < in_begin || k >= in_end` 就是那条「根必须落在本段」的检查，查不到时的 `-1` 也落在这里。两棵子树先各自建成小树，再用【代码5.2】的 `create_tree` 接到根上。它只适用于关键码范围很小的情形——关键码是任意整数或字符串时，没法拿它当下标。

再看递归。递归深度等于树高；把递归改写成显式栈，是本章反复用到的手法（上面的非递归周游、工程版的迭代深拷贝都是）。改写是机械的：一次递归调用的参数存成一帧，「调用」变成压栈，「返回」变成弹栈：

```cpp file=code/ch05/binary_tree/teaching.hpp#fn:BinaryTree::build_from_inorder_postorder_iterative
// 同一个重建，不递归：把每次递归调用的参数存成一帧，压进一条手写的链式栈。
// 与 build_impl 逐行对应——「递归调用」变成「压一帧」，「函数返回」变成「弹一帧」；
// 参数 Node*& link 变成帧里的 Node** link（引用存不进结构体，只能存指针）。
//
// 注意：教学版的析构 destroy 仍是递归的，所以一条很长的链就算这样建出来了，
// 析构时照样压穿运行栈。这里要学的是「递归 → 显式栈」的改写手法；
// 工程版把析构也改成了迭代，见 5.6a。
void build_from_inorder_postorder_iterative(const T* inorder, const T* postorder, std::size_t count) {
    struct Frame {
        Node** link;                    // 建好的子树挂到哪根指针上
        std::size_t in_begin, in_end;   // 中序段
        std::size_t post_begin;         // 后序段起点（与中序段一样长）
        Frame* next;                    // 链式栈：下面那一帧
    };
    // 栈也要有主人：它一离开作用域——正常建完、找不到根抛异常、
    // 甚至 new 本身失败——析构都会把剩下的帧还掉。与 fresh 是同一个想法。
    struct FrameStack {
        Frame* top = nullptr;
        FrameStack() = default;
        FrameStack(const FrameStack&) = delete;             // 三法则：拷贝出两份，
        FrameStack& operator=(const FrameStack&) = delete;  // 同一批帧就会被删两次
        ~FrameStack() {
            while (top != nullptr) {
                Frame* rest = top->next;
                delete top;
                top = rest;
            }
        }
    };

    BinaryTree fresh;
    FrameStack stack;
    stack.top = new Frame{&fresh.root_, 0, count, 0, nullptr};   // 第一次「调用」
    while (stack.top != nullptr) {
        const Frame f = *stack.top;     // 弹出一帧
        Frame* popped = stack.top;
        stack.top = stack.top->next;
        delete popped;

        if (f.in_begin == f.in_end) {
            continue;                   // 空区间：空子树
        }
        const std::size_t size = f.in_end - f.in_begin;
        const T& key = postorder[f.post_begin + size - 1];
        std::size_t k = f.in_begin;
        while (k < f.in_end && inorder[k] != key) {
            ++k;
        }
        if (k == f.in_end) {            // 剩下的帧由 stack 的析构还掉
            throw std::invalid_argument("build_from_inorder_postorder_iterative: root lies outside its inorder range");
        }

        Node* node = new Node{key, nullptr, nullptr};
        *f.link = node;                 // 先挂上：之后再抛异常，它也归临时树释放
        const std::size_t left_size = k - f.in_begin;
        // 先压右、再压左：栈后进先出，于是左子树先建，与递归的次序一致
        stack.top = new Frame{&node->right, k + 1, f.in_end, f.post_begin + left_size, stack.top};
        stack.top = new Frame{&node->left, f.in_begin, k, f.post_begin, stack.top};
    }
    clear();
    root_ = fresh.root_;
    fresh.root_ = nullptr;
}
```

对照 `build_impl` 逐行看：参数 `Node*& link` 变成帧里的 `Node** link`（引用存不进结构体，只能存指针）；先压右、再压左，是因为栈后进先出，这样左子树先建，次序与递归一致（反过来压也能建对，只是建的次序不同）。递归版不用操心「剩下的帧」：一出错，运行栈自动回收；自己管的栈就得有个主人。这里把栈包成局部对象 `FrameStack`，它的析构负责还帧——正常建完、找不到根抛异常、甚至某次 `new` 本身失败，剩下的帧都由它还掉，与入口里那棵临时树 `fresh` 是同一个想法。测试把 28 次 `new`（图 5.5 的 9 个结点加 19 帧）逐个注入失败，每一次都核对分配全部归还、原树不动。还要说清楚一点：教学版的析构 `destroy` 仍是递归的，一条很长的链即使这样建出来了，析构时照样压穿运行栈。这里要学的是改写的手法本身。

工程版 `modern.hpp` 把查表和显式栈合在一起，并推广到任意只支持 `<` 的类型 `T`：关键码不一定能当下标，点名册换成「把中序下标按键排序，再二分」，总代价 $O(n\log n)$；显式栈用第三章的 `LinkedStack`，析构也是迭代的；重复键、键缺失单独报出，好让报错说对原因。它把两种重建做成两个静态工厂 `from_inorder_postorder` 与 `from_preorder_inorder`，代码这里不再列出。

为什么「能建完就一定对」？对区间长度归纳：根取自区间的末端（后序）或首端（前序），左右两段恰好分走剩下的元素；若两段各自重建出的子树中序、后序（前序）与各自的区间一致，拼上根之后整棵树也一致。所以建完之后不必再周游一遍核对，教学版与工程版都是如此。测试用随机树做往返（工程版 400 棵、教学版 300 棵）：取序列、重建、再取四种序列（含层次序列，确认形状也一样）逐一比对。

#### 示例OJ24750: 根据二叉树中后序序列建树

http://cs101.openjudge.cn/practice/24750/

> 假设二叉树的节点里包含一个大写字母，每个节点的字母都不同。
>
> 给定二叉树的中序遍历序列和后序遍历序列（长度均不超过26），请输出该二叉树的前序遍历序列。
>
> **输入**
>
> 2行，均为大写字母组成的字符串，表示一棵二叉树的中序遍历序列与后序遍历排列。
>
> **输出**
>
> 表示二叉树的前序遍历序列。
>
> 样例输入
>
> ```
> BADC
> BDCA
> ```
>
> 样例输出
>
> ```
> ABCD
> ```
>
> 来源: Lou Yuke
>
> 
>
> 思路就是上面 `build_impl` 与「点名册」两段代码的合体：只传下标区间，不切片拷贝；字母当键，先把中序登记成字典 `pos`，找根 $O(1)$。题目只要前序，所以连树都不必真建——递归里**先输出根、再进左右子树**，输出的次序天然就是前序。右子树在后序里的起点要跳过左子树的 `k - in_lo` 个元素，不是 `k + 1`。
>
> ```python
> def preorder_of(inorder, postorder):
>     pos = {c: i for i, c in enumerate(inorder)}   # 「点名册」：字符 → 中序下标
>     out = []
>
>     def build(in_lo, in_hi, post_lo):             # 中序段 [in_lo, in_hi)，后序段从 post_lo 起、一样长
>         if in_lo == in_hi:
>             return
>         root = postorder[post_lo + (in_hi - in_lo) - 1]   # 后序段的最后一个是根
>         k = pos[root]
>         out.append(root)                          # 前序：根最先输出
>         build(in_lo, k, post_lo)                  # 左子树
>         build(k + 1, in_hi, post_lo + (k - in_lo))   # 右子树：后序起点跳过左子树的 k - in_lo 个
>
>     build(0, len(inorder), 0)
>     return ''.join(out)
>
>
> inorder = input().strip()
> postorder = input().strip()
> print(preorder_of(inorder, postorder))
> ```

> 输入 `DBGEACHFI` / `DGEBHIFCA`（图 5.5 那棵树）时输出 `ABDEGCFHI`，与 2.2 节的前序序列一致。

## 2.3 广度优先周游二叉树

**先把三种深度优先周游的代价算清楚。** 不管采用哪种周游方式，对于有 $n$ 个结点的二叉树，
周游完树的所有元素都需要 $O(n)$ 时间——只要对每个结点的处理（`Visit` 的执行）时间是一个常数，
周游二叉树就可以在线性时间内完成。所需要的**辅助空间为周游过程中栈的最大容量，即树的高度**；
最坏情况下（每个结点只有一个孩子的「藤」），具有 $n$ 个结点的二叉树高度为 $n$，所需空间复杂度
为 $O(n)$。写成递归时这个栈就是运行栈，因此那句「树退化成藤会爆栈」不是危言耸听。

深度优先是尽量往深走，广度优先是一层一层走：首先访问第 0 层（即根结点所在的层），然后从左到右
依次访问第 1 层的两个结点，依次类推——当第 $i$ 层的所有结点访问完之后，再从左至右依次访问
第 $i+1$ 层的各个结点。对图 5.5 那棵树，结果是 A B C D E F G H I。

深度优先靠**栈**（写成递归时就是运行栈），广度优先靠**队列**：

```text
把根入队
只要队列非空:
    出队一个结点, 访问它
    它的左孩子入队
    它的右孩子入队
```

上层结点总是比下层结点先入队，队列又先进先出，于是出队次序自然就是逐层从左到右。

**为什么不能像前三种那样写成递归？** 递归的形状天生是深度优先的：一层调用只能带着「当前子树」往下走，而层次周游要在兄弟子树之间横向跳——第 2 层的最后一个结点和第 3 层的第一个结点常常分属不同的子树。这个跨子树的次序只能由一个显式的队列记住，递归的调用栈替不了它。

原书【算法5.7】在这里直接用了 `std::queue`。教学版改成在 `level_order` 里现写一条极简的链式 FIFO：本节要教的就是「队列在这里起了什么作用」，一行 `std::queue<Node*>` 会把它藏起来。队列本身第三章已经讲过，这里只是用它。

```cpp file=code/ch05/binary_tree/teaching.hpp#fn:BinaryTree::level_order
// 【算法5.7】层次周游：一层一层从左到右。
// 深度优先靠栈（这里是递归用的运行栈），广度优先靠**队列**。
template <typename Visitor>
void level_order(Visitor visit) const {
    // 一条极简的链式队列，只在这个函数里用
    struct Pending {
        const Node* node;
        Pending* next;
    };
    Pending* front = nullptr;
    Pending* rear = nullptr;

    if (root_ != nullptr) {
        front = rear = new Pending{root_, nullptr};
    }
    while (front != nullptr) {
        Pending* item = front;               // 出队
        front = front->next;
        if (front == nullptr) {
            rear = nullptr;
        }
        const Node* node = item->node;
        delete item;

        visit(node->value);

        if (node->left != nullptr) {         // 左右孩子依次入队
            Pending* fresh = new Pending{node->left, nullptr};
            if (rear == nullptr) { front = rear = fresh; } else { rear->next = fresh; rear = fresh; }
        }
        if (node->right != nullptr) {
            Pending* fresh = new Pending{node->right, nullptr};
            if (rear == nullptr) { front = rear = fresh; } else { rear->next = fresh; rear = fresh; }
        }
    }
}
```

每个结点入队、出队各一次，时间同样是 $O(n)$。空间由结点最多的那一层决定：最坏是每层都排满的二叉树（perfect），队列最长时装着最下面一整层，约 $(n+1)/2$ 个结点。这与深度优先的空间代价（正比于树高）正好互补——树越平衡，深度优先越省；树越接近一条链，广度优先越省。


# 3 二叉树的存储结构

前面几节讨论的二叉树逻辑结构和抽象数据类型，都**不依赖于二叉树的物理存储方式**。二叉树的存储
实现方法有多种：既可以用链接存储结构实现，又可以用顺序存储结构实现；这些方法各有其特点和
适用范围，在应用中要根据情况决定采用哪种。

**链式存储**把二叉树的各结点随机地存储在内存空间，结点之间的关系用指针表示。由二叉树的定义
可知，每一个结点由一个数据元素和指向其左右子树的分支组成，所以表示二叉树的链表结点包含
3 个域：数据域和左、右指针域——用 `info` 域存储结点的数据元素，另外再设置两个指针域 `left`
和 `right`，分别指向结点的左子结点和右子结点；当结点的某个子结点为空时，相应的指针为空指针。

![图 5.7 二叉树结点的存储结构](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-7.png)

图 5.7　二叉树结点的两种存储结构：(a) 数据域 + 左右指针，用它得到的是**二叉链表**（也叫 left-right 存储法）；(b) 再加一根指向父结点的 `parent`，得到的是**三叉链表**。二叉链表里找父结点得从根重新走一趟，三叉链表顺着 `parent` 一步就到——多一根指针买到的就是这件事。

![图 5.8 图 5.5 中二叉树的二叉链表存储结构](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-8.png)

图 5.8　图 5.5 那棵树的二叉链表存储结构。数一数图里的空指针：$n$ 个结点的二叉链表恰有 $n+1$ 个空链域（1.3 节的性质 5），线索二叉树就是把它们利用起来。

本章的教学版用的正是二叉链表。`create_tree` 先 `new` 出新根，再把两棵子树的根指针挪过来，最后才清空自己原来的树。这样即使 `new` 抛异常，调用方的两棵子树也不动。

**顺序存储**是指按照一定次序，用一组地址连续的存储单元存储二叉树上的各个结点元素。由于二叉树
是一种非线性结构，因此必须将结点排成一个线性序列，使得通过结点在这个序列中的相对位置就能
确定结点之间的逻辑关系；**但通常情况下，只通过相应位置不足以刻画整个树形结构**。

而对于一棵具有 $n$ 个结点的**完全二叉树**，可以从根结点起自上而下、从左至右地把所有结点编号，
得到一个足以反映整个二叉树结构的线性序列——采用这种方式，线性序列里存储的结点就是按照层次
周游二叉树得到的排列。按层次顺序把结点从 $0$ 到 $n-1$ 编号，编号 $i$ 的结点就放在数组下标 $i$。

![图 5.9 完全二叉树的结点编号](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-9.png)

图 5.9　完全二叉树的结点编号。

| 下标 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 元素 | A | B | C | D | E | F | G | H | I | J | K | L |

上图就是图 5.9 的顺序存储结构。结点间的关系不再靠指针，而是**隐含在下标里**：下标 $i$ 的左右孩子是 $2i+1$ 和 $2i+2$，父结点是 $\lfloor (i-1)/2 \rfloor$——正是 1.3 节的性质。一个指针都不用存，这是完全二叉树最省空间的存法；第 5 节的堆和 第八章的堆排序都用它。**但它只对完全二叉树划算**：树一旦有空洞，数组里就要留出同样多的空位。

第 6 章会介绍一般情况下树的顺序存储；由于二叉树与树能够进行等价转换，因此一般情况下的二叉树
也可以采用类似的顺序存储结构方法。

**在不同的存储结构中，不仅空间开销有差异，实现二叉树操作的方法也不同。** 因此在具体应用中
采取什么存储结构，除了根据二叉树的形态之外，还应该考虑时间、空间复杂度和算法的简洁性。

#### 教学版：完整实现

下面是一份**完整的、能直接编译运行的**二叉树与二叉搜索树。一个文件、两个类。
**递归是这一章的正题**，所以周游、释放、深拷贝这里全部写成递归——
形状和定义一样，一眼就能对上。代价是递归深度等于树高，退化成链的树会压穿运行栈；工程版把释放和深拷贝改成了迭代。

```cpp file=code/ch05/binary_tree/teaching.hpp
// 二叉树与二叉搜索树 —— 教学版。
// 原书【代码5.1】【代码5.2】【算法5.3】【算法5.7】【算法5.9】【算法5.10】。
//
// 一个文件、两个类、能直接编译运行，给「第一次读这一节」的人看。
//
//   BinaryTree         二叉链表：一个结点，两根指向孩子的链接；深度优先与层次周游；
//                      由中序 + 后序序列重建，递归与显式栈各一版（5.2.2，不是原书编号算法）。
//   BinarySearchTree   在二叉树上加一条「左小右大」的约束，于是查找变成一路往下走。
//
// **递归是这一章的正题**，所以周游、释放、深拷贝这里全部写成递归——形状和定义一样，
// 一眼就能对上。代价是递归深度等于树高：退化成一条链的树（比如按升序插入 BST）
// 会把运行栈压穿。工程版把释放和深拷贝改成了迭代，见 5.6a「进阶（选读）」。
//
// 与 modern.hpp（工程版）的分工：
//   教学版  三法则 + 全递归；
//   工程版  五法则、迭代释放（右旋拉直）、迭代深拷贝、强异常保证、非递归周游、
//           O(n log n) 且不递归的重建。
#pragma once

#include <cstddef>
#include <stdexcept>

// ---------------------------------------------------------------------------
// 二叉树（二叉链表）
// ---------------------------------------------------------------------------
template <typename T>
class BinaryTree {
public:
    // 【代码5.1】二叉树结点：一个数据域 + 左右两根链接。
    // 没有孩子就是 nullptr——这比原书用一个"空结点"表示要省事得多。
    struct Node {
        T value;
        Node* left;
        Node* right;
    };

    BinaryTree() : root_(nullptr) {}

    ~BinaryTree() { clear(); }

    // 三法则：树管着一堆 new 出来的结点，拷贝必须自己写（而且必须是**深**拷贝）。
    BinaryTree(const BinaryTree& other) : root_(clone(other.root_)) {}

    BinaryTree& operator=(const BinaryTree& other) {
        if (this == &other) {
            return *this;
        }
        Node* fresh = clone(other.root_);   // 先把新树建好
        clear();                            // 再拆掉旧树
        root_ = fresh;
        return *this;
    }

    bool empty() const { return root_ == nullptr; }
    const Node* root() const { return root_; }
    Node* root() { return root_; }

    // 造一棵新树：一个根，接上左右两棵子树。
    // 两棵子树的所有权**转移**给新树——传进来的那两棵随即变空，
    // 否则同一批结点会被两棵树各删一次。
    void create_tree(const T& value, BinaryTree& left, BinaryTree& right) {
        Node* fresh = new Node{value, left.root_, right.root_};
        left.root_ = nullptr;
        right.root_ = nullptr;
        clear();
        root_ = fresh;
    }

    void create_leaf(const T& value) {
        Node* fresh = new Node{value, nullptr, nullptr};
        clear();
        root_ = fresh;
    }

    // 由中序 + 后序序列重建二叉树（两个序列各 count 个元素，关键码互不相同）。
    // 递归的主体在 build_impl；前序 + 中序的写法留作本章上机题第 1 题。
    //
    // 两个序列对不上（比如中序 1 2 3、后序 3 1 2）就抛 std::invalid_argument，
    // 不悄悄建出一棵错树；这时本树保持原样。
    void build_from_inorder_postorder(const T* inorder, const T* postorder, std::size_t count) {
        BinaryTree fresh;                   // 先建在一棵临时树里：中途抛异常，
        build_impl(fresh.root_, inorder, 0, count, postorder, 0);   // 由它的析构收拾半成品
        clear();                            // 建成了，再拆掉旧树、接过新树
        root_ = fresh.root_;
        fresh.root_ = nullptr;
    }

    // 同一个重建，不递归：把每次递归调用的参数存成一帧，压进一条手写的链式栈。
    // 与 build_impl 逐行对应——「递归调用」变成「压一帧」，「函数返回」变成「弹一帧」；
    // 参数 Node*& link 变成帧里的 Node** link（引用存不进结构体，只能存指针）。
    //
    // 注意：教学版的析构 destroy 仍是递归的，所以一条很长的链就算这样建出来了，
    // 析构时照样压穿运行栈。这里要学的是「递归 → 显式栈」的改写手法；
    // 工程版把析构也改成了迭代，见 5.6a。
    void build_from_inorder_postorder_iterative(const T* inorder, const T* postorder, std::size_t count) {
        struct Frame {
            Node** link;                    // 建好的子树挂到哪根指针上
            std::size_t in_begin, in_end;   // 中序段
            std::size_t post_begin;         // 后序段起点（与中序段一样长）
            Frame* next;                    // 链式栈：下面那一帧
        };
        // 栈也要有主人：它一离开作用域——正常建完、找不到根抛异常、
        // 甚至 new 本身失败——析构都会把剩下的帧还掉。与 fresh 是同一个想法。
        struct FrameStack {
            Frame* top = nullptr;
            FrameStack() = default;
            FrameStack(const FrameStack&) = delete;             // 三法则：拷贝出两份，
            FrameStack& operator=(const FrameStack&) = delete;  // 同一批帧就会被删两次
            ~FrameStack() {
                while (top != nullptr) {
                    Frame* rest = top->next;
                    delete top;
                    top = rest;
                }
            }
        };

        BinaryTree fresh;
        FrameStack stack;
        stack.top = new Frame{&fresh.root_, 0, count, 0, nullptr};   // 第一次「调用」
        while (stack.top != nullptr) {
            const Frame f = *stack.top;     // 弹出一帧
            Frame* popped = stack.top;
            stack.top = stack.top->next;
            delete popped;

            if (f.in_begin == f.in_end) {
                continue;                   // 空区间：空子树
            }
            const std::size_t size = f.in_end - f.in_begin;
            const T& key = postorder[f.post_begin + size - 1];
            std::size_t k = f.in_begin;
            while (k < f.in_end && inorder[k] != key) {
                ++k;
            }
            if (k == f.in_end) {            // 剩下的帧由 stack 的析构还掉
                throw std::invalid_argument("build_from_inorder_postorder_iterative: root lies outside its inorder range");
            }

            Node* node = new Node{key, nullptr, nullptr};
            *f.link = node;                 // 先挂上：之后再抛异常，它也归临时树释放
            const std::size_t left_size = k - f.in_begin;
            // 先压右、再压左：栈后进先出，于是左子树先建，与递归的次序一致
            stack.top = new Frame{&node->right, k + 1, f.in_end, f.post_begin + left_size, stack.top};
            stack.top = new Frame{&node->left, f.in_begin, k, f.post_begin, stack.top};
        }
        clear();
        root_ = fresh.root_;
        fresh.root_ = nullptr;
    }

    // 【算法5.3】深度优先周游的三种次序。三个函数只差 visit 那一行的位置：
    //   前序 根左右 · 中序 左根右 · 后序 左右根
    template <typename Visitor>
    void preorder(Visitor visit) const { preorder_impl(root_, visit); }

    template <typename Visitor>
    void inorder(Visitor visit) const { inorder_impl(root_, visit); }

    template <typename Visitor>
    void postorder(Visitor visit) const { postorder_impl(root_, visit); }

    // 【算法5.7】层次周游：一层一层从左到右。
    // 深度优先靠栈（这里是递归用的运行栈），广度优先靠**队列**。
    template <typename Visitor>
    void level_order(Visitor visit) const {
        // 一条极简的链式队列，只在这个函数里用
        struct Pending {
            const Node* node;
            Pending* next;
        };
        Pending* front = nullptr;
        Pending* rear = nullptr;

        if (root_ != nullptr) {
            front = rear = new Pending{root_, nullptr};
        }
        while (front != nullptr) {
            Pending* item = front;               // 出队
            front = front->next;
            if (front == nullptr) {
                rear = nullptr;
            }
            const Node* node = item->node;
            delete item;

            visit(node->value);

            if (node->left != nullptr) {         // 左右孩子依次入队
                Pending* fresh = new Pending{node->left, nullptr};
                if (rear == nullptr) { front = rear = fresh; } else { rear->next = fresh; rear = fresh; }
            }
            if (node->right != nullptr) {
                Pending* fresh = new Pending{node->right, nullptr};
                if (rear == nullptr) { front = rear = fresh; } else { rear->next = fresh; rear = fresh; }
            }
        }
    }

    // 结点数与高度：两个最典型的「先算孩子、再算自己」的递归。
    std::size_t size() const { return count(root_); }
    std::size_t height() const { return depth(root_); }

    void clear() {
        destroy(root_);
        root_ = nullptr;
    }

private:
    // 【代码5.8】后序释放：**必须先删两个孩子，再删自己**。
    // 反过来先 delete node，node->left 就成了读已释放内存。
    static void destroy(Node* node) {
        if (node == nullptr) {
            return;
        }
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

    // 深拷贝：形状和 destroy 一样，只是把"删"换成"建"。
    static Node* clone(const Node* node) {
        if (node == nullptr) {
            return nullptr;
        }
        return new Node{node->value, clone(node->left), clone(node->right)};
    }

    // 把中序 inorder[in_begin, in_end) 与后序 postorder[post_begin, …) 建成一棵子树，挂到 link 上。
    // 两段一样长；只传下标，不拷贝子数组。
    //
    // 后序段的最后一个是根；在中序段里找到它（下标 k），左边 k - in_begin 个是左子树，
    // 右边是右子树。左子树的大小一旦知道，后序段也就切成了「左子树 | 右子树 | 根」。
    static void build_impl(Node*& link, const T* inorder, std::size_t in_begin, std::size_t in_end,
                           const T* postorder, std::size_t post_begin) {
        if (in_begin == in_end) {
            return;                                         // 空区间：空子树，link 保持 nullptr
        }
        const std::size_t size = in_end - in_begin;
        const T& key = postorder[post_begin + size - 1];    // 后序段的最后一个是根

        std::size_t k = in_begin;                           // 在中序段里从左往右找根
        while (k < in_end && inorder[k] != key) {           // 只找本段：根不在本段，说明两个序列对不上
            ++k;
        }
        if (k == in_end) {
            throw std::invalid_argument("build_from_inorder_postorder: root lies outside its inorder range");
        }

        link = new Node{key, nullptr, nullptr};             // 先挂上：子树里再抛异常，它也归临时树释放
        const std::size_t left_size = k - in_begin;
        build_impl(link->left, inorder, in_begin, k, postorder, post_begin);
        build_impl(link->right, inorder, k + 1, in_end, postorder, post_begin + left_size);
    }

    template <typename Visitor>
    static void preorder_impl(const Node* node, Visitor& visit) {
        if (node == nullptr) return;
        visit(node->value);                 // 根
        preorder_impl(node->left, visit);   // 左
        preorder_impl(node->right, visit);  // 右
    }

    template <typename Visitor>
    static void inorder_impl(const Node* node, Visitor& visit) {
        if (node == nullptr) return;
        inorder_impl(node->left, visit);    // 左
        visit(node->value);                 // 根
        inorder_impl(node->right, visit);   // 右
    }

    template <typename Visitor>
    static void postorder_impl(const Node* node, Visitor& visit) {
        if (node == nullptr) return;
        postorder_impl(node->left, visit);  // 左
        postorder_impl(node->right, visit); // 右
        visit(node->value);                 // 根
    }

    static std::size_t count(const Node* node) {
        return node == nullptr ? 0 : 1 + count(node->left) + count(node->right);
    }

    static std::size_t depth(const Node* node) {
        if (node == nullptr) return 0;
        std::size_t l = depth(node->left);
        std::size_t r = depth(node->right);
        return 1 + (l > r ? l : r);
    }

    Node* root_;
};

// ---------------------------------------------------------------------------
// 二叉搜索树
//
// 约束只有一条：**左子树的键都小于根，右子树的键都大于根**。
// 有了它，查找就不必遍历全树——每比较一次就砍掉一半（前提是树是平衡的）。
// ---------------------------------------------------------------------------
template <typename T>
class BinarySearchTree {
public:
    struct Node {
        T value;
        Node* left;
        Node* right;
    };

    BinarySearchTree() : root_(nullptr) {}

    ~BinarySearchTree() { clear(); }

    BinarySearchTree(const BinarySearchTree& other) : root_(clone(other.root_)) {}

    BinarySearchTree& operator=(const BinarySearchTree& other) {
        if (this == &other) {
            return *this;
        }
        Node* fresh = clone(other.root_);
        clear();
        root_ = fresh;
        return *this;
    }

    bool empty() const { return root_ == nullptr; }

    // 【算法5.9】插入。一路比较着往下走，走到空位就把新结点挂上去。
    // 键已存在时返回 false——重复键是可预期状态，不是错误，所以不抛异常。
    bool insert(const T& value) {
        Node** link = &root_;               // 指向「新结点该挂在哪根指针上」
        while (*link != nullptr) {
            if (value < (*link)->value) {
                link = &(*link)->left;
            } else if ((*link)->value < value) {
                link = &(*link)->right;
            } else {
                return false;               // 已经有了
            }
        }
        *link = new Node{value, nullptr, nullptr};
        return true;
    }

    // 查找：同样一路往下走。树高是 h，代价就是 O(h)。
    bool contains(const T& value) const {
        const Node* current = root_;
        while (current != nullptr) {
            if (value < current->value) {
                current = current->left;
            } else if (current->value < value) {
                current = current->right;
            } else {
                return true;
            }
        }
        return false;
    }

    // 【算法5.10】删除。键不存在返回 false（幂等，不是错误）。
    //
    // 难点只有一个：被删结点有两个孩子时，谁来顶替它？
    // 答案是**中序前驱**——左子树里最大的那个。它顶上来之后，
    // 「左小右大」仍然成立，因为它比左子树其余的都大、比右子树全部都小。
    bool remove(const T& value) { return remove_impl(root_, value); }

    void clear() {
        destroy(root_);
        root_ = nullptr;
    }

    // 中序周游一棵 BST，得到的正是**升序**——这是「左小右大」的直接推论。
    template <typename Visitor>
    void inorder(Visitor visit) const { inorder_impl(root_, visit); }

private:
    static bool remove_impl(Node*& link, const T& value) {
        if (link == nullptr) {
            return false;
        }
        if (value < link->value) {
            return remove_impl(link->left, value);
        }
        if (link->value < value) {
            return remove_impl(link->right, value);
        }

        Node* removed = link;
        if (removed->left == nullptr) {          // 没有左孩子：右孩子直接顶上
            link = removed->right;
            delete removed;
            return true;
        }

        // 找中序前驱：从左孩子出发，一路向右走到底
        Node** predecessor_link = &removed->left;
        while ((*predecessor_link)->right != nullptr) {
            predecessor_link = &(*predecessor_link)->right;
        }
        Node* replacement = *predecessor_link;
        *predecessor_link = replacement->left;   // 前驱可能还有左孩子，先接走
        replacement->left = removed->left;
        replacement->right = removed->right;
        link = replacement;
        delete removed;
        return true;
    }

    static void destroy(Node* node) {
        if (node == nullptr) return;
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

    static Node* clone(const Node* node) {
        if (node == nullptr) return nullptr;
        return new Node{node->value, clone(node->left), clone(node->right)};
    }

    template <typename Visitor>
    static void inorder_impl(const Node* node, Visitor& visit) {
        if (node == nullptr) return;
        inorder_impl(node->left, visit);
        visit(node->value);
        inorder_impl(node->right, visit);
    }

    Node* root_;
};
```


# 4 二叉搜索树

在实际应用中，经常会碰到这样的操作：在一组记录中检索一个记录，向其中插入一个记录，或者删除
一个记录。对于一个**无序线性表**，插入记录时只需要把该记录放在表的末端，但在表中查找一个特定
记录的检索时间却相对较慢；对于**有序线性表**，如果用二分查找法检索特定的记录，检索效率较高，
但是遇到动态增减变化的情况（如插入或删除一个元素）时需要移动大量的元素。很多应用都需要一种
**插入、删除和检索记录效率都较高**的数据组织方法——二叉搜索树（binary search tree，BST，也称
二叉排序树、二叉查找树）就是这样一种高效的数据结构。

二叉搜索树是一类满足以下属性的特殊二叉树：树中的每个非空结点表示一个记录；若某结点左子树
不为空，则**左子树上所有结点的值均小于该结点的关键码值**；若其右子树不为空，则**右子树上所有
结点的值均大于该结点的关键码值**。二叉搜索树可以是一棵空树，且**任何结点的左右子树都是二叉
搜索树**。按照中序周游整个二叉树，可得到一个由小到大的有序排列；这个定义也表明**树中各结点的
关键码必须是唯一的**。原书用关键码集合 $K=\{50,19,35,55,20,5,100,52,88,53,92\}$ 建的树是这样的：

![图 5.11 二叉搜索树](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-11.png)

图 5.11　二叉搜索树：从空树起，按 50, 19, 35, 55, 20, 5, 100, 52, 88, 53, 92 的顺序逐个插入得到（中序周游正好是升序 5 19 20 35 50 52 53 55 88 92 100）。检索 `key` 时把它与根比较：小于就只找左子树，大于就只找右子树，每一步都能扔掉一整棵子树——这就是它比无序线性表快的原因。走到空子树还没找到，就说明 `key` 不在树里。

**插入**要先运用检索方法，查找待插入关键码是否在树中：如果存在则不允许插入重复关键码；如果
直到找到叶结点还没有发现重复关键码，则把新结点插入到待插入方向作为新的叶结点。它**不像在
有序线性表中插入元素那样要移动大量的数据**，只需改动某个结点的空指针；与查找一样，插入一个
新结点的时间复杂度是根到插入位置的路径长度，因此**在树形比较平衡时二叉搜索树的效率相当高**。
对于给定的关键码集合，可以从一棵空的二叉搜索树开始，按照检索路径逐个插入到相应的叶结点位置，
从而动态生成二叉搜索树。

**删除比较复杂**：要保持二叉搜索树的性质，就不能在树中留下一个空位置，因此需要用另一个结点来
填充这个位置并且保持性质。插入重复键、删除不存在的键都是可预期状态，返回 `false`，不抛异常。
删除有左右孩子的结点时，用左子树里最右的前驱替换它：先把前驱从原位置摘下，再让它继承被删
结点的两棵子树，最后只 `delete` 被删结点一次。漏掉「先脱离原父」会形成环或二次释放。

二叉搜索树的实现就在上面那份教学版清单里的 `BinarySearchTree`。三处值得停一下：

- **插入用的是「指向指针的指针」** `Node** link`。它指向「新结点该挂在哪根指针上」，
  于是「挂到根」和「挂到某个孩子」写成同一句 `*link = new Node{...}`，
  空树不必另开一个分支。
- **删除有两个孩子的结点时，用左子树里最右的那个（中序前驱）顶替。**
  它比左子树其余的都大、比右子树全部都小，顶上来之后「左小右大」仍然成立。
- **前驱自己可能还有一个左孩子**，顶替之前必须先把它接走
  （`*predecessor_link = replacement->left;`）。漏了这一句，树上会出现环——
  教学版的测试专门搭了一棵这样的树，去掉那句，中序周游立刻无限递归、ASan 报栈溢出。

删除分几种情形，原书的图把它们摆开了：

![图 5.12 二叉搜索树的删除示例](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-12.png)

图 5.12　二叉搜索树的删除（都从图 5.11 出发，用下文的基本方案）：(a) 删 52——它没有左子树，直接让右子树的根 53 顶上；(b) 删 55——它有左子树 52→53，左子树中序最后的结点是 53，把 55 的右子树（以 100 为根）整个挂到 53 的右边，再让左子树的根 52 顶替 55。原树深度是 4（50→55→100→88→92），删完反而变成 5（50→52→53→100→88→92）。

**原书在这里给了两种删除方案，本书实现的是后一种。**（原书【算法5.9】是上面讲的插入，基本删除方案只有文字描述，改进方案才写成【算法5.10】。）基本方案是：若被删结点
`pointer` 有左子树，就在左子树里找到按中序周游的最后一个结点 `temppointer`，把 `temppointer`
的右指针置成指向 `pointer` 右子树的根，然后用 `pointer` 左子树的根代替被删结点。它是对的，
但从图 5.12(b) 可以看到，**把 `pointer` 的右子树整个下降为 `temppointer` 的右子树后，树的高度
可能会增加**——删了一个结点，树反而更瘦长了。

改进方案（原书【算法5.10】）换一个顺序：若 `pointer` 有左子树，先在左子树中找到中序周游的
最后一个结点 `temppointer`（即左子树中的最大结点），**并将其从二叉搜索树中删除**；由于
`temppointer` 没有右子树，删除它只需用它的左子树代替它；然后用 `temppointer` 结点代替待删除
的结点 `pointer`。这样接上去的是同一层的邻居，高度不会凭空长高。上面教学版实现里那三句
`*predecessor_link = replacement->left;` / `replacement->left = ...` / `replacement->right = ...`，
逐句对应的就是这个改进方案。

![图 5.13 改进的二叉搜索树的删除](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-13.png)

图 5.13　改进的删除办法：同样从图 5.11 删 55，先把左子树里最右的结点 53 摘下（它没有左孩子，原位置直接置空），再让 53 接过 55 的左子树 52 和右子树 100，顶替 55。删完深度仍是 4。用左子树里最右的那个结点（中序前驱）顶替被删结点。它比左子树其余全部都大、比右子树全部都小，顶上来之后「左小右大」原封不动，树也不会因为整棵子树搬家而变高。

#### 示例OJ22275: 二叉搜索树的遍历

http://cs101.openjudge.cn/practice/22275/

> 给出一棵二叉搜索树的前序遍历，求它的后序遍历
>
> **输入**
>
> 第一行一个正整数n（n<=2000）表示这棵二叉搜索树的结点个数
> 第二行n个正整数，表示这棵二叉搜索树的前序遍历
> 保证第二行的n个正整数中，1~n的每个值刚好出现一次
>
> **输出**
>
> 一行n个正整数，表示这棵二叉搜索树的后序遍历
>
> 样例输入
>
> ```
> 5
> 4 2 1 3 5
> ```
>
> 样例输出
>
> ```
> 1 3 2 5 4
> ```
>
> 
>
> **BST 的中序就是升序**，所以这题等价于「前序 + 中序重建」：把前序排个序就得到中序，套用 2.2 节的重建即可。还可以更直接地利用「左小右大」：前序的第一个值是根，紧跟着的、比根小的那一段是左子树，其余是右子树。下面的写法给每棵子树一个取值区间 $(lo, hi)$，按前序依次取值，下一个值落在区间外就说明这棵子树结束了——每个值只看常数次，总代价 $O(n)$。
>
> ```python
> import sys
> sys.setrecursionlimit(10000)
>
>
> def postorder_of(pre):
>     out = []
>     i = 0                                   # 下一个待取的前序下标
>
>     def build(lo, hi):                      # 用前序里接下来那些落在 (lo, hi) 内的值建一棵子树
>         nonlocal i
>         if i == len(pre) or not (lo < pre[i] < hi):
>             return                          # 下一个值不属于这棵子树：空子树
>         root = pre[i]
>         i += 1
>         build(lo, root)                     # 左子树的值都在 (lo, root)
>         build(root, hi)                     # 右子树的值都在 (root, hi)
>         out.append(root)                    # 后序：左、右之后才输出根
>
>     build(float('-inf'), float('inf'))
>     return out
>
>
> n = int(input())
> pre = list(map(int, input().split()))
> print(' '.join(map(str, postorder_of(pre))))
> ```

> 递归深度可达 $n$（例如前序是 `1 2 3 … n` 的一条右链），所以要调高 Python 的递归上限——这正是 2.2 节说的「递归深度等于树高」。


# 5 堆与优先队列

## 5.1 最小堆

在现实应用中，经常会遇到频繁地在一组对象中查找最大值或最小值的情况。为了达到这个目的，可以
每次都先排序，然后从已排序的序列中找到其最大值或最小值——这种方法虽然可行，但时间开销比较
大。有没有一种结构能为这类特殊应用提供较高的效率？这就是**堆**。堆可分为最小堆和最大堆，本节
主要讨论最小堆，最大堆具有类似的性质。

**最小堆**（min-heap，最小值堆）是关键码序列 $\{K_0, K_1, \cdots, K_{n-1}\}$，它具有如下特性：

$$K_i \le K_{2i+1}, \quad K_i \le K_{2i+2} \quad (i = 0, 1, \cdots, \lfloor n/2 \rfloor - 1)$$

（下标超过 $n-1$ 的那一项不存在，就不必比较：例如 $n$ 为偶数时，最后一个内部结点 $i=n/2-1$ 只有左孩子 $2i+1=n-1$。）

从逻辑的角度来讲，堆是一种树形结构，而且是一种**特殊的完全二叉树**：此完全二叉树的每个结点
对应于序列中的一个关键码，根结点对应于 $K_0$，按层次从左至右依次类推。说其特殊，主要是因为
**堆序只是局部有序**——最小堆对应的完全二叉树中所有内部结点的值均不大于其左右子结点的关键
码值，且一个结点与其兄弟之间没有必然的联系。最小堆不像二叉搜索树那样实现了关键码的完全排序；
相比较而言，只有当结点之间是父子关系时，才可以确定这两个结点关键码的大小关系。

根据最小堆的定义，堆对应的完全二叉树的根结点具有最小关键码值，即堆所对应序列的第一个元素
具有最小值。第 3 节已经介绍过用顺序存储结构实现完全二叉树的有效方法，因此可以把最小堆的
关键码存储在一维数组中：只需要计算简单的代数表达式，就能非常容易地查找某个结点的父结点和
子结点（下标 `i` 的孩子是 `2i+1` 和 `2i+2`），**既避免了使用指针来保持结构，又能有效地执行相应
操作**。当然，由于顺序存储的空间分配要求，必须预先知道堆的大小（本书的实现按需扩容）。
`sift_down` 必须比较左右两个孩子。空堆上 `remove_min()` 返回 `nullopt`。

**插入与删除。** 插入时新添的元素加入末尾；为了保持最小堆的性质，需要沿着其祖先的路径，自下
而上依次比较和交换该结点与父结点的位置，直到重新满足堆的性质为止。这样做会出现两种情况：
要么新结点升到最小堆的顶端，要么到某一位置时发现父结点比新插入的结点关键码值小。这个自下
而上逐渐上升、最后停在满足最小堆性质的位置的过程，通常被称为「**筛选**」。删除操作的处理与
插入时方向相反：删除某个位置的元素后形成了一个空位置，首先把最末端的结点填入这个位置；同理，
这样做也可能导致破坏堆序特性，末端元素需要与被删位置的子结点比较交换，直到过滤到该结点小于
最小子结点的正确位置为止。删除的若是**堆顶以外的任意位置**，还要多看一眼父结点：填进来的末端元素可能比新父结点还小
（它原本来自另一棵子树），这时要改为**向上**筛选。例如堆 `1 10 2 11 12 3 4` 删除下标 3 的 11，填进来的 4
比父结点 10 小，就得上浮。原书【代码5.11】的 `Remove(pos)` 正是先比父结点、再决定上浮还是下沉。

**建堆。** 把所有关键码放到一维数组中，此时形成的完全二叉树并不具备最小堆的特性，但是**仅包含
叶子结点的子树已经是堆**——在有 $n$ 个结点的完全二叉树中，当 $i > \lfloor n/2 \rfloor - 1$ 时，以
关键码 $K_i$ 为根的子树已经是堆。这时，从含有内部结点数最少的子树（这种子树在完全二叉树的
倒数第二层，此时 $i = \lfloor n/2 \rfloor - 1$）开始，从右至左依次进行调整；对这一层调整完成之后，
继续对上一层进行同样的工作，直到整个过程到达树根时，整棵完全二叉树就成为一个堆。

对当前结点 $K_i$，调整过程是从 $K_i$ 开始向下筛选的过程：如果 $K_i \le K_{2i+1}$ 且
$K_i \le K_{2i+2}$，则以 $K_i$ 为根的子树就已经是堆，不需要调整结点的位置；否则将 $K_i$ 的值与
其子结点中关键码小的一个进行交换，交换后继续对以该子结点为根的子树进行重建，这样在最坏
情况下向下调整到树叶，然后依次调整以 $K_{i-1}, K_{i-2}, \cdots, K_0$ 为根的子树。完成了以 $K_0$
为根的树的筛选，就完成了建堆的过程。

**最后一句提醒**：最小堆只适合于查找最小值，**查找任意值的效率不高**——它没有二叉搜索树那样的
全序，找一个中间大小的关键码只能线性扫描。类似地也可以定义最大堆，第八章的堆排序用的
就是最大堆。

![图 5.14 最小堆对应的完全二叉树](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-14.png)

图 5.14　关键码序列 $K=\{12,14,15,19,20,17,18,24,22,26\}$ 对应的最小堆。堆序是**局部有序**：只有父子之间才能断定大小，兄弟之间没有任何关系——这一点和二叉搜索树完全不同，也正是建堆能比排序更快的原因。根一定是最小的那个。

#### 教学版：完整实现

最小堆与 Huffman 树放在同一个文件里——因为 Huffman 的构造规则
「反复取两个最小的合并」正是堆的第一个真实用途，两节内容在这里接上。

```cpp file=code/ch05/heap_huffman/teaching.hpp
// 最小堆与 Huffman 树 —— 教学版。原书【代码5.11】【代码5.12】。
//
// 一个文件、两个类、能直接编译运行，给「第一次读这一节」的人看。
//
//   MinHeap      完全二叉树用**数组**存：下标 i 的孩子是 2i+1 和 2i+2，父亲是 (i-1)/2。
//                不需要任何指针，这正是这一节最漂亮的地方。
//   HuffmanTree  反复「取两个最小的合并」，用最小堆来取——这是堆的第一个真实用途。
//
// 与 modern.hpp（工程版）的分工：
//   教学版  三法则、扩容不考虑异常、Huffman 构造不做溢出与失败清理；
//   工程版  五法则、对元素类型的 static_assert、构造中途失败时逐个回收裸结点、
//           权重相加的溢出检查。
// 两份都在闸门里真编译真运行。先读这一份，5.6a「进阶（选读）」再读那一份。
#pragma once

#include <cstddef>
#include <optional>
#include <stdexcept>
#include <string>

// ---------------------------------------------------------------------------
// 最小堆
//
// 堆是一棵**完全二叉树**（除最后一层外每层排满，最后一层靠左连续），
// 且每个结点都不大于它的孩子。完全二叉树可以按层次次序压进一个数组，
// 于是父子关系变成下标算术：
//
//   下标 i 的左孩子  2i + 1
//   下标 i 的右孩子  2i + 2
//   下标 i 的父亲    (i - 1) / 2       （i > 0）
//
// 一根指针都不用。
// ---------------------------------------------------------------------------
template <typename T>
class MinHeap {
public:
    using size_type = std::size_t;

    explicit MinHeap(size_type initial_capacity = 8)
        : data_(new T[initial_capacity]), capacity_(initial_capacity), size_(0) {}

    ~MinHeap() { delete[] data_; }

    // 三法则：管着 new 出来的数组，拷贝必须自己写。
    MinHeap(const MinHeap& other)
        : data_(new T[other.capacity_]), capacity_(other.capacity_), size_(other.size_) {
        for (size_type i = 0; i < size_; ++i) {
            data_[i] = other.data_[i];
        }
    }

    MinHeap& operator=(const MinHeap& other) {
        if (this == &other) {
            return *this;
        }
        T* fresh = new T[other.capacity_];
        for (size_type i = 0; i < other.size_; ++i) {
            fresh[i] = other.data_[i];
        }
        delete[] data_;
        data_ = fresh;
        capacity_ = other.capacity_;
        size_ = other.size_;
        return *this;
    }

    bool empty() const { return size_ == 0; }
    size_type size() const { return size_; }

    // 插入：先放到数组末尾（也就是完全二叉树的最后一个位置），
    // 再一路和父亲比较、必要时上浮。树高是 log n，所以代价是 O(log n)。
    void insert(const T& value) {
        if (size_ == capacity_) {
            grow();
        }
        data_[size_] = value;
        sift_up(size_);
        ++size_;
    }

    // 取走最小的那个（就是根，下标 0）。空堆返回空 optional。
    //
    // 手法是固定的：把**最后一个**元素搬到根上，长度减一，然后让它一路下沉。
    // 为什么是最后一个？因为只有拿掉最后一个位置，剩下的才仍然是一棵完全二叉树。
    std::optional<T> remove_min() {
        if (empty()) {
            return std::nullopt;
        }
        T smallest = data_[0];
        --size_;
        if (size_ > 0) {
            data_[0] = data_[size_];
            sift_down(0);
        }
        return smallest;
    }

private:
    // 上浮：只要比父亲小就换上去。
    void sift_up(size_type index) {
        while (index > 0) {
            size_type parent = (index - 1) / 2;
            if (!(data_[index] < data_[parent])) {
                break;                       // 已经不小于父亲，位置对了
            }
            T tmp = data_[index];
            data_[index] = data_[parent];
            data_[parent] = tmp;
            index = parent;
        }
    }

    // 下沉：和两个孩子里较小的那个比，比它大就换下去。
    // **必须和较小的那个换**——跟较大的换会破坏「父亲不大于两个孩子」。
    void sift_down(size_type index) {
        for (;;) {
            size_type left = index * 2 + 1;
            size_type right = left + 1;
            size_type smallest = index;
            if (left < size_ && data_[left] < data_[smallest]) {
                smallest = left;
            }
            if (right < size_ && data_[right] < data_[smallest]) {
                smallest = right;
            }
            if (smallest == index) {
                return;                      // 父亲已经最小，停
            }
            T tmp = data_[index];
            data_[index] = data_[smallest];
            data_[smallest] = tmp;
            index = smallest;
        }
    }

    void grow() {
        size_type next = (capacity_ == 0) ? 1 : capacity_ * 2;
        T* fresh = new T[next];
        for (size_type i = 0; i < size_; ++i) {
            fresh[i] = data_[i];
        }
        delete[] data_;
        data_ = fresh;
        capacity_ = next;
    }

    T* data_;
    size_type capacity_;
    size_type size_;
};

// ---------------------------------------------------------------------------
// Huffman 树
//
// 构造规则只有一句：**反复取出权最小的两棵树，合并成一棵新树放回去**，
// 直到只剩一棵。「取最小的」正是最小堆的拿手好戏，两节内容在这里接上了。
// ---------------------------------------------------------------------------
class HuffmanTree {
public:
    struct Node {
        int weight;
        char symbol;      // 只有叶子有意义；内部结点是合并出来的，置 '\0'
        Node* left;
        Node* right;
    };

    HuffmanTree() : root_(nullptr) {}

    /// 只关心树形与 WPL 时用这个。
    HuffmanTree(const int* weights, std::size_t count) : HuffmanTree(nullptr, weights, count) {}

    /// 带上每个权重对应的字符，树就能拿来**编码和译码**了。
    HuffmanTree(const char* symbols, const int* weights, std::size_t count) : root_(nullptr) {
        if (count == 0) {
            return;
        }
        if (weights == nullptr) {
            throw std::invalid_argument("HuffmanTree: 权重数组是空指针");
        }

        // **先把参数全查一遍，再动手 new。** 顺序反过来的话，
        // 在第 k 个权重上发现非法值时前 k-1 个结点已经建好了，
        // 抛出去就全漏了——LeakSanitizer 会当场把它报出来（作者第一版正是如此）。
        for (std::size_t i = 0; i < count; ++i) {
            if (weights[i] < 0) {
                throw std::invalid_argument("HuffmanTree: 权重不能为负");
            }
        }

        MinHeap<ByWeight> heap;
        for (std::size_t i = 0; i < count; ++i) {
            char symbol = (symbols == nullptr) ? '\0' : symbols[i];
            heap.insert(ByWeight{new Node{weights[i], symbol, nullptr, nullptr}});  // 每个权重先做成一棵单结点树
        }

        while (heap.size() > 1) {
            Node* left = heap.remove_min()->node;      // 最小的
            Node* right = heap.remove_min()->node;     // 次小的
            Node* parent = new Node{left->weight + right->weight, '\0', left, right};
            heap.insert(ByWeight{parent});
        }
        root_ = heap.remove_min()->node;
    }

    ~HuffmanTree() { destroy(root_); }

    // 这棵树不支持拷贝：结点是裸指针，深拷贝要写一整套，而 Huffman 树建好就只读。
    // 明确 `= delete` 好过让编译器悄悄生成一个会二次释放的版本。
    HuffmanTree(const HuffmanTree&) = delete;
    HuffmanTree& operator=(const HuffmanTree&) = delete;

    const Node* root() const { return root_; }

    // 根的权重就是所有叶子权重之和。
    int total_weight() const { return root_ == nullptr ? 0 : root_->weight; }

    // 带权路径长度(WPL)：每个叶子的权重乘以它的深度，再求和。
    // Huffman 树的意义就在于它让这个数最小。
    int weighted_path_length() const { return wpl(root_, 0); }

    // ---- Huffman 编码与译码 ------------------------------------------------
    //
    // 编码规则：从每个结点引向**左**孩子的边标 0，引向**右**孩子的边标 1；
    // 从根走到某个叶子，一路上的 0/1 连起来就是那个字符的编码。
    //
    // 这样得到的一定是**前缀码**——任何字符的编码都不会是另一个字符编码的前缀。
    // 理由很直白：字符只住在**叶子**上，而一个叶子不可能在另一个叶子的路径上。
    // 前缀码是能译码的前提：不然 011 既可以读成 a+bb 也可以读成 c+b，无法分辨。

    /// 查一个字符的编码。不在树里返回空 optional。
    std::optional<std::string> code_of(char symbol) const {
        std::string path;
        if (find_code(root_, symbol, path)) {
            // 只有一个字符时，从根到叶的路径是空串——那样的编码没法传。
            // 约定给它一位 "0"。这是个真实的边界，不是抠字眼。
            return path.empty() ? std::string("0") : path;
        }
        return std::nullopt;
    }

    /// 把一段文字编成比特串。出现了树里没有的字符就返回空 optional。
    std::optional<std::string> encode(const std::string& text) const {
        std::string bits;
        for (char c : text) {
            auto code = code_of(c);
            if (!code) {
                return std::nullopt;
            }
            bits += *code;
        }
        return bits;
    }

    /// 把比特串译回文字。**用的是同一棵树**：从根出发，读 0 走左、读 1 走右，
    /// 走到叶子就吐出一个字符再回到根。比特串不合法（多出半截、出现非 0/1）
    /// 就返回空 optional。
    std::optional<std::string> decode(const std::string& bits) const {
        if (root_ == nullptr) {
            return bits.empty() ? std::optional<std::string>(std::string()) : std::nullopt;
        }
        // 单结点树是特例：整棵树只有一个字符，每一位都译成它。
        if (root_->left == nullptr && root_->right == nullptr) {
            std::string text;
            for (char b : bits) {
                if (b != '0') {
                    return std::nullopt;
                }
                text.push_back(root_->symbol);
            }
            return text;
        }

        std::string text;
        const Node* current = root_;
        for (char b : bits) {
            if (b == '0') {
                current = current->left;
            } else if (b == '1') {
                current = current->right;
            } else {
                return std::nullopt;          // 既不是 0 也不是 1
            }
            if (current == nullptr) {
                return std::nullopt;
            }
            if (current->left == nullptr && current->right == nullptr) {
                text.push_back(current->symbol);
                current = root_;              // 吐出一个字符，回到根
            }
        }
        if (current != root_) {
            return std::nullopt;              // 走到一半就没比特了：串不完整
        }
        return text;
    }

private:
    // 放进堆里的是「一棵树的根指针」，比较的是它的权重。
    struct ByWeight {
        Node* node;
        bool operator<(const ByWeight& other) const {
            return node->weight < other.node->weight;
        }
    };

    static void destroy(Node* node) {
        if (node == nullptr) return;
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

    /// 在树里找字符 symbol，把根到它的路径（左 0 右 1）写进 path。
    static bool find_code(const Node* node, char symbol, std::string& path) {
        if (node == nullptr) {
            return false;
        }
        if (node->left == nullptr && node->right == nullptr) {
            return node->symbol == symbol;
        }
        path.push_back('0');
        if (find_code(node->left, symbol, path)) {
            return true;
        }
        path.back() = '1';
        if (find_code(node->right, symbol, path)) {
            return true;
        }
        path.pop_back();                      // 这条路走不通，回溯
        return false;
    }

    static int wpl(const Node* node, int depth) {
        if (node == nullptr) return 0;
        if (node->left == nullptr && node->right == nullptr) {
            return node->weight * depth;      // 叶子
        }
        return wpl(node->left, depth + 1) + wpl(node->right, depth + 1);
    }

    Node* root_;
};
```

插入的手法也是固定的：**新元素先放在末尾**（这样仍是完全二叉树），再沿着祖先一路向上比较交换，直到父结点比它小、或者它升到了根。这个上升过程叫**筛选**。

![图 5.15 在最小堆 5.14 中插入元素 13](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-15.png)

图 5.15　在图 5.14 的最小堆里插入 13：13 从末尾一路上浮，停在父结点比它小的地方。具体是：13 放在下标 10，父结点（下标 4）是 20，13<20，交换；新的父结点（下标 1）是 14，13<14，再交换；父结点成了根 12，12<13，停。数组变成 `12 13 15 19 14 17 18 24 22 26 20`，只交换了 2 次。

`remove_min` 的手法是固定的：**把最后一个元素搬到根上，长度减一，再让它下沉**。
为什么是最后一个？因为只有拿掉最后一个位置，剩下的才仍然是一棵完全二叉树。
下沉时**必须和两个孩子里较小的那个交换**——跟较大的换会破坏「父亲不大于两个孩子」。

![图 5.16 在最小堆 5.14 中删除元素 14](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-16.png)

图 5.16　在图 5.14 的最小堆里删除 14：末端元素填进空出来的位置，再与较小的那个孩子逐层交换下沉，直到它不大于自己的孩子。具体是：14 在下标 1，末端的 26 填进来；它的孩子 19、20 里小的是 19，26>19，交换；再看孩子 24、22，小的是 22，26>22，交换；26 到了叶子，停。数组变成 `12 19 15 22 20 17 18 24 26`。

#### 示例OJ04078: 实现堆结构

http://cs101.openjudge.cn/practice/04078/

> 定义一个数组，初始化为空。在数组上执行两种操作：
>
> 1、增添1个元素，把1个新的元素放入数组。
>
> 2、输出并删除数组中最小的数。
>
> 使用堆结构实现上述功能的高效算法。
>
> **输入**
>
> 第一行输入一个整数n，代表操作的次数。
> 每次操作首先输入一个整数type。
> 当type=1，增添操作，接着输入一个整数u，代表要插入的元素。
> 当type=2，输出删除操作，输出并删除数组中最小的元素。
> 1<=n<=100000。
>
> **输出**
>
> 每次删除操作输出被删除的数字。
>
> 样例输入
>
> ```
> 4
> 1 5
> 1 1
> 1 7
> 2
> ```
>
> 样例输出
>
> ```
> 1
> ```
>
> 提示
>
> 每组测试数据的复杂度为 $O(n\log n)$ 的算法才能通过本次，否则会返回 TLE（超时）
> 需要使用最小堆结构来实现本题的算法
>
> 
>
> 这题本意是练习自己写一个堆：与上面教学版 `MinHeap` 一一对应——`insert` 放到末尾再上浮，`remove_min` 把最后一个元素搬到根上再下沉，下沉时和**较小**的那个孩子比。机考时直接 `import heapq` 也可以，但手写一遍是考前必做的功课。
>
> ```python
> import sys
>
>
> class MinHeap:
>     def __init__(self):
>         self.data = []
>
>     def insert(self, value):                # 放到末尾，再上浮
>         a = self.data
>         a.append(value)
>         i = len(a) - 1
>         while i > 0:
>             parent = (i - 1) // 2
>             if not a[i] < a[parent]:
>                 break
>             a[i], a[parent] = a[parent], a[i]
>             i = parent
>
>     def remove_min(self):                   # 末尾元素搬到根上，再下沉；空堆返回 None
>         a = self.data
>         if not a:
>             return None
>         smallest = a[0]
>         last = a.pop()
>         if a:
>             a[0] = last
>             i, n = 0, len(a)
>             while True:
>                 left, right, m = 2 * i + 1, 2 * i + 2, i
>                 if left < n and a[left] < a[m]:
>                     m = left
>                 if right < n and a[right] < a[m]:
>                     m = right
>                 if m == i:
>                     break
>                 a[i], a[m] = a[m], a[i]
>                 i = m
>         return smallest
>
>
> def main():
>     tokens = sys.stdin.read().split()
>     n = int(tokens[0])
>     heap = MinHeap()
>     out = []
>     p = 1
>     for _ in range(n):
>         if tokens[p] == '1':
>             heap.insert(int(tokens[p + 1]))
>             p += 2
>         else:
>             out.append(str(heap.remove_min()))
>             p += 1
>     print('\n'.join(out))
>
>
> main()
> ```

## 5.2 建堆为什么是 $O(n)$ 而不是 $O(n\log n)$

把一个无序序列变成堆，做法是**从最后一个非叶结点起，倒着对每个结点做一次下沉**：

![图 5.17 建堆过程示例](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-17.png)

图 5.17　建堆过程示例（原书图 5.17 的筛选法）。关键码集合 $K=\{19,8,35,65,40,3,7,45\}$，$n=8$，$\lfloor n/2\rfloor-1=3$，所以从 $K_3=65$ 开始倒着调整：(a) $i=3$：65 的孩子只有 45，65>45，交换；(b) $i=2$：35 的孩子 3、7 里小的是 3，交换；(c) $i=1$：8 不大于孩子 45、40，不动；(d) $i=0$：19 先与较小的孩子 3 交换，到了下标 2 再与较小的孩子 7 交换。最后得到堆 `3 8 7 45 40 35 19 65`。倒着做的理由是：对某个结点下沉时，它的两棵子树必须已经是堆——从最后一个非叶结点往前扫，正好保证这一点。叶结点本身就是堆，所以后一半结点一次都不用碰。

粗看这是 $O(n\log n)$：`sift_down` 一次最多走一条树高那么长的路，是 $O(\log n)$；
非叶结点大约 $n/2$ 个，乘起来就是 $n/2 \cdot \log n$。**原书特意说这只是一个粗略的上界。**

细算要用到一件事：**下沉的代价不是 $\log n$，而是「这个结点到最底层还有多远」**。
越靠近底层的结点越多，而它们能下沉的距离越短——两者正好互相抵消。

**先把这个堆放大成一棵每层都排满的二叉树（perfect）。** 设堆的深度（最大层数，根在第 0 层）为 $h=\lfloor\log_2 n\rfloor$，见 1.3 节的性质 6。
深度同为 $h$、每层都排满的二叉树有 $2^{h+1}-1 \ge n$ 个结点，
而且每个结点能下沉的距离都不比原堆里对应位置的短。
**所以在这棵满树上算出来的总代价，是原堆的一个上界**——
这一步是必要的，因为一般的 $n$ 下堆的最后一层未必满，层数也要取整，
直接把「共 $\log n$ 层」当等式用是不严谨的。

满树的第 $i$ 层**恰有** $2^i$ 个结点，其中的结点最多下沉 $h-i$ 层，于是

$$\text{建堆代价} \;\le\; \sum_{i=0}^{h} 2^{i}\,(h - i)$$

令 $j = h - i$ 代入：

$$\sum_{i=0}^{h} 2^{i}(h-i) \;=\; \sum_{j=0}^{h} 2^{\,h-j}\cdot j \;=\; 2^{h}\sum_{j=0}^{h}\frac{j}{2^{j}} \;<\; 2^{h}\cdot 2 \;=\; 2^{h+1} \;\le\; 2n$$

最后两步用的是 $\sum_{j\ge 0} j/2^{j} = 2$，以及 $h=\lfloor\log_2 n\rfloor$ 蕴含 $2^{h}\le n$。

所以**建堆的时间复杂度是 $O(n)$——可以在线性时间内把一个无序序列变成堆**。

> **另一种写法**（不必先放大成满树）：$n$ 个结点的堆里，往下到最远叶子还有 $j$ 条边（这里把它叫做结点的「高度 $j$」，与 1.3 节整棵树的高度口径不同）的结点**至多**
> $\lceil n/2^{\,j+1}\rceil$ 个，每个最多下沉 $j$ 层，于是总代价
> $\le \sum_{j\ge 0} \lceil n/2^{\,j+1}\rceil \cdot j = O(n)$。
> 两种证法算的是同一件事：**越靠近底层的结点越多，能沉的距离越短。**

这个结论有实际后果：第八章的堆排序总代价是 $O(n\log n)$，但那 $\log n$ 全部来自
**后面 $n$ 次取最小值**，建堆那一步是白送的。反过来，如果一个个 `insert` 建堆——
每次上浮 $O(\log n)$，$n$ 次就是 $O(n\log n)$——就把这份便宜丢掉了。

同一个「多数结点在底层」的事实，对两种建法的意义正好相反：

- **下沉（筛选法）**：代价 = 离底层的距离。结点大多在底层，离底层近，沉得短。
- **上浮（逐个 `insert`）**：代价 = 离根的距离。结点大多在底层，离根远，浮得长。

以 $h=3$、$n=15$ 的满树为例：筛选法最坏总下沉 $\sum 2^i(h-i)=3+4+4+0=11$ 层；逐个 `insert` 最坏总上浮 $\sum 2^i\cdot i=0+2+8+24=34$ 层——光最后一层 8 个结点就占了一大半，每个都可能浮 3 层，所以是 $\Theta(n\log n)$。（例如往最小堆里按递减顺序插入，每个新来的都比堆里所有元素小，一路浮到根。）

「丢掉便宜」不改变堆排序的总阶，丢掉的只是建堆这一段。它真正要紧的场合是**只要前 $k$ 小**（top-k）：筛选法建堆 + $k$ 次取最小 $=O(n+k\log n)$，$k$ 远小于 $n$ 时接近线性；逐个 `insert` 建堆就先付了 $O(n\log n)$，比直接排序还亏。Python 的 `heapq.heapify(list)` 就是筛选法，比循环 `heappush` 快。

堆建好之后，插入、删除最小元、删除任意元素（已知它在数组里的下标时）的平均与最差代价都是 $O(\log n)$，
因为树高就是 $\log n$。但**最小堆只适合查最小值，查任意值的效率不高**——
要找一个给定的键，除了从头扫没有更好的办法。这正是第 10 章要另起炉灶讲检索的原因。

## 5.3 优先队列

**优先队列**（priority queue）是一种有用的数据结构：它是 0 个或多个元素的集合，每个元素都有一个
关键码值，执行的操作有查找、插入和删除等。它的主要特点是支持从一个集合中**快速地查找并移出
具有最大值或最小值的元素**——最小优先队列适合查找和删除最小元素，最大优先队列适合查找和删除
最大元素。

优先队列的应用很广泛。例如，计算机的操作系统用一个优先队列来实现等候进程的调度管理：在一
系列等待执行的进程中，每一个进程可以用一个数值来表示它的优先级，优先级越高这个值就越小，
优先级高的进程应该最先获得处理器。另一个例子是打印机的输出任务队列：对于先后到达的、打印
几百页和只有几页的任务，一个合理的方法是先打印页数少的任务，这样做就是按照文件的大小来
排列打印任务的优先顺序。

优先队列可以用多种方法实现，例如采用无序线性表或者有序线性表：无序表的插入可为 $O(1)$，
但取最小值要 $O(n)$；有序表取最小值可为 $O(1)$，但插入要移动元素。**堆是一种很好的优先队列
实现方法**：一旦最小堆建成，其堆顶元素就满足关键码最小的要求，为快速查找和删除优先级最高的
元素创造条件；进行插入、删除等操作时，也能有效地保持堆的性质，从而确保优先队列的高效性。
具体地说，查看堆顶为 $O(1)$，插入与移除堆顶为 $O(\log n)$，建堆为 $O(n)$。

本书的 `MinHeap<T>` 就是一个最小优先队列：`insert` 对应入队，`remove_min` 对应取出最高优先级任务，空队列以 `std::nullopt` 表示。Huffman 构造反复取两个最小权值，Dijkstra 和 Prim 则反复取当前距离或边权最小的候选；这些算法需要的是“下一项最优”，不需要把整个队列排序。若应用要求相同优先级保持到达顺序，还要把到达序号作为第二关键码显式存入元素。

#### 对顶堆：动态维护中位数

优先队列的一个经典上机题：数据一个一个到来，每来一个就要报出当前的中位数。每次排序是 $O(n\log n)$；用两个堆可以做到插入 $O(\log n)$、查询 $O(1)$。

做法是把已到的数据劈成两半：**较小的一半放进最大堆，较大的一半放进最小堆**，并始终保持两件事——最大堆里的每个元素都不大于最小堆里的每个元素；两个堆一样大，或者最大堆多一个。于是中位数就是最大堆的堆顶。新元素不大于最大堆堆顶就进最大堆，否则进最小堆；进完之后若两堆的大小差出了规定，把多的那边的堆顶搬到另一边——一次搬一个就够，因为插入前两堆至多差 1。两个堆背靠背、堆顶相对，所以叫「对顶堆」。

这里需要一个**最大堆**。工程版没有再写一个类，而是给 `MinHeap` 加了一个比较器模板参数，默认 `std::less<T>`；`MinHeap<T, std::greater<T>>` 的堆顶就是最大元素。原书代码5.11 那个堆的结构、上浮与下沉一行没变，只是把 `<` 换成了 `compare_`。另外加了一个只看不拿的 `MinHeap::peek`，与第 3 章栈的 `peek` 同一个约定：返回指针，空堆为 `nullptr`，下一次插入或删除后失效。

```cpp file=code/ch05/heap_huffman/modern.hpp#running-median
/// 对顶堆求动态中位数：较小的一半放进**最大堆** lower_，较大的一半放进**最小堆** upper_。
///
/// 不变式：lower_ 的每个元素 ≤ upper_ 的每个元素，且
///         lower_.size() == upper_.size() 或 lower_.size() == upper_.size() + 1。
/// 于是中位数永远是 lower_ 的堆顶。元素个数为偶数时取**下中位数**（第 n/2 小，从 1 数），
/// 不做两数平均——那需要 T 支持除法，而且整数平均会截断，调用方要平均就自己取两个堆顶。
/// insert 为 O(log n)，median 为 O(1)。
template <typename T>
class RunningMedian {
public:
    void insert(const T& value) {
        if (lower_.empty() || !(*lower_.peek() < value)) lower_.insert(value);
        else upper_.insert(value);
        rebalance();
    }
    /// 空时 std::nullopt。
    [[nodiscard]] std::optional<T> median() const {
        if (const T* top = lower_.peek()) return *top;
        return std::nullopt;
    }
    [[nodiscard]] std::size_t size() const noexcept { return lower_.size() + upper_.size(); }

private:
    /// 每次插入后两堆大小至多差 2，搬一个堆顶就回到不变式。
    void rebalance() {
        if (lower_.size() > upper_.size() + 1) upper_.insert(*lower_.remove_min());
        else if (upper_.size() > lower_.size()) lower_.insert(*upper_.remove_min());
    }
    MinHeap<T, std::greater<T>> lower_;   // 较小的一半，堆顶是其中最大的
    MinHeap<T> upper_;                    // 较大的一半，堆顶是其中最小的
};
```

元素个数为偶数时，`RunningMedian::median` 返回**下中位数**（排好序后第 $n/2$ 个，从 1 数），不做两数平均：平均需要 `T` 支持除法，整数平均还会截断，要平均的调用方自己取两个堆顶即可。测试把每一次插入后的结果都与「复制一份排序取中间」对比，数据取自很小的值域，重复值很多；另有全升序、全降序两条，分别让新元素一直落进同一边、逼着每次都搬堆顶。


# 6 Huffman 树及其应用

## 6.1 带权路径长度与 Huffman 树的构造

同样是四个权为 6、2、3、4 的外部结点，树的形状不同，带权外部路径长度就不同：

![图 5.18 具有不同带权外部路径长度的二叉树](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-18.png)

图 5.18　三棵外部结点权值同为 6、2、3、4 的扩充二叉树。(a) $6\times2+2\times2+3\times2+4\times2=30$；(b) $6\times2+2\times3+3\times3+4\times1=31$；(c) $6\times1+2\times3+3\times3+4\times2=29$。(c) 最小，它就是这组权值的 Huffman 树——**权越大的叶离根越近**，总长就越小。

Huffman 树反复取出两个最小权，合成它们的和，直到只剩一棵——这就是前缀编码的那棵树。
根权等于全部叶子权之和。实现就在第 5 节那份教学版清单里的 `HuffmanTree`。

![图 5.19 Huffman 树的构造过程](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-19.png)

图 5.19　Huffman 树的构造过程：$n$ 个权各自成为一棵单结点树；每次挑出根权最小的两棵，合成一棵新树、新根的权是两者之和；重复 $n-1$ 次，集合里只剩一棵。图中是图 5.18(c) 那棵树的构造：权 6、2、3、4 → 先合并最小的 2 和 3 得 5 → 再合并 4 和 5 得 9 → 最后合并 6 和 9 得 15。三个内部结点的权之和 $5+9+15=29$，正是图 5.18(c) 的带权外部路径长度（理由见下文「WPL 等于所有内部结点的权之和」）。

**为什么用堆**：每一轮都要「取当前最小的两棵」。用数组线性扫是 O(n) 一轮、
总共 O(n²)；用最小堆是 O(log n) 一轮、总共 O(n log n)。这是第 5 节那个数据结构
在这里换来的东西。

衡量一棵 Huffman 树好不好，用**带权路径长度**(WPL)：每个叶子的权重乘以它的深度再求和。
以开头「先跑一遍」里 `heap_huffman/demo.cpp`用的权 2、3、4、7 为例，合并过程是 2+3=5 → 4+5=9 → 7+9=16，
于是 2 和 3 落在第 3 层、4 在第 2 层、7 在第 1 层：

$$\mathrm{WPL} = 2\times3 + 3\times3 + 4\times2 + 7\times1 = 30$$

Huffman 树的意义就是让这个数最小——权大的离根近，编码就短。
教学版的测试把 30 这个数字直接写成断言：合并时若取的不是最小的两个，它立刻变红。

如果把 $K$ 叉树定义为结点的有限集合——或者为空集，或者由一个根和 $K$ 棵有序且不相交的 $K$ 叉树组成——Huffman 算法可以推广到 $K$ 叉树：每次取 $K$ 个最小的合并。要注意一个细节：每合并一次，树的棵数减少 $K-1$，最后要恰好剩 1 棵，就要求 $(n-1)$ 能被 $K-1$ 整除；不能整除时先补上若干个权为 0 的虚叶子凑齐，否则最后一次合并凑不满 $K$ 棵，根下留着空位，WPL 就不是最小。

**教学版有一处值得单独说的写法**：构造函数**先把全部权重检查一遍，再动手 `new`**。
顺序反过来的话，在第 k 个权重上发现负数时前 k−1 个结点已经建好了，一抛就全漏。
这不是纸上推演——本书作者第一版正是先检查边建，LeakSanitizer 当场把它报了出来：

```text
==2738715==ERROR: LeakSanitizer: detected memory leaks
Direct leak of 24 byte(s) in 1 object(s) allocated from:
    #1 HuffmanTree::HuffmanTree(int const*, unsigned long) teaching.hpp:180
```

#### 权值成批给出：只求 WPL

另一类常见的上机题把输入换成「权 $w_i$ 出现了 $c_i$ 次」，$c_i$ 可以到 $10^9$，只问最小的带权路径长度。结点根本建不出来，要换两个想法。

**第一，WPL 等于所有内部结点的权之和。** 每个内部结点的权是它下面全部叶子的权之和，所以一个深度为 $d$ 的叶子，它的权在它的 $d$ 个祖先里各被算了一次，合起来恰好是「权 × 深度」。仍以示例程序的权 2、3、4、7 为例，三次合并得到的内部结点权是 5、9、16，$5+9+16=30$，与上面按深度算的一样。于是不必知道树的形状，只要把每次合并出的新权累加。

**第二，同权的树可以整批合并。** 若当前最小的权是 $w$、有 $c$ 棵，前 $\lfloor c/2\rfloor$ 次合并取的一定都是两棵 $w$（合并出的 $2w$ 不比 $w$ 小），一步就得到 $\lfloor c/2\rfloor$ 棵权为 $2w$ 的树，WPL 加上 $2w\lfloor c/2\rfloor$。$c$ 为奇数时**会余下一棵 $w$**，它要留在堆里，和下一小的树合并——这正是最容易漏掉的一步，漏了结果就偏小。堆里放的是「(权, 棵数)」这样的组，取出一组时顺手把堆顶同权的组并进来。$10^9$ 棵等权叶子每整批合并一次棵数就减半，约 $\log_2 10^9\approx 30$ 次减半就到底；不过奇数时余下的那一棵会和别的组拼出新的权值，派生出新的组，所以循环次数比 30 多一些——照下面的代码逐行复算，单组 $10^9$ 棵权为 1 的叶子共循环 50 次。

```cpp file=code/ch05/heap_huffman/modern.hpp#huffman-wpl-batched
/// 一组同权叶子：weight 这个权出现了 count 次。
struct WeightGroup {
    std::uint64_t weight;
    std::uint64_t count;
};

/// 只求 Huffman 树的带权路径长度，不建树——叶子数可达 1e9 量级，结点根本放不下。
///
/// 依据：WPL 等于**所有内部结点的权之和**（每个叶子的权在它的每个祖先里各被加一次，
/// 祖先个数正是它的深度）。所以只要把每次合并出的新权累加起来。
/// 又因为同权的若干棵树谁先合并都一样，最小的一组有 c 棵时，一次就合并出 c/2 棵
/// 权为 2w 的树；c 为奇数时剩下的那一棵要和**下一小**的树合并，不能丢。
/// 堆里放的是「组」，一轮处理一个最小权的组。
///
/// 轮数：**只证明了平凡上界**——每轮至少造出一个内部结点，所以至多 n−1 轮（n = 叶子总数）；
/// n 可达 1e9，这个界没有实用价值。更紧的界**没有证明**。实测（T-075，Python 逐行移植计数）：
/// 6 个组、count 取 1/2/3/≈1e9 的对抗混合最坏 352 轮，约「每组 log₂n 轮」；
/// 单组 1e9 叶子 50 轮、1e18 叶子 101 轮。早先写在这里的 O(k log k + log n) 被这组实测**否定**了，已撤掉。
///
/// 溢出界：设总权 W = Σ weight·count、叶子数 n = Σ count，则 WPL ≤ W·⌈log2 n⌉。
/// 该乘积小于 2^64 时一定不溢出；否则中途任何一次加法/乘法溢出都抛 std::overflow_error，
/// 不返回回绕后的错数。count 为 0 的组忽略；叶子数 ≤ 1 时 WPL 为 0。
inline std::uint64_t huffman_wpl_batched(const WeightGroup* groups, std::size_t group_count) {
    if (group_count != 0 && groups == nullptr) {
        throw std::invalid_argument("huffman_wpl_batched: non-empty input requires groups");
    }
    struct ByWeight {
        std::uint64_t weight, count;
        bool operator<(const ByWeight& other) const noexcept { return weight < other.weight; }
    };
    const auto add = [](std::uint64_t a, std::uint64_t b) {
        if (a > std::numeric_limits<std::uint64_t>::max() - b) throw std::overflow_error("Huffman WPL overflows uint64");
        return a + b;
    };
    const auto mul = [](std::uint64_t a, std::uint64_t b) {
        if (b != 0 && a > std::numeric_limits<std::uint64_t>::max() / b) throw std::overflow_error("Huffman WPL overflows uint64");
        return a * b;
    };

    MinHeap<ByWeight> heap;
    for (std::size_t i = 0; i < group_count; ++i) {
        if (groups[i].count != 0) heap.insert(ByWeight{groups[i].weight, groups[i].count});
    }
    std::uint64_t wpl = 0;
    while (auto smallest = heap.remove_min()) {
        ByWeight group = *smallest;
        while (heap.peek() != nullptr && heap.peek()->weight == group.weight) {   // 同权的组并成一组
            group.count = add(group.count, heap.remove_min()->count);
        }
        if (group.count == 1) {
            auto next = heap.remove_min();
            if (!next) break;                              // 只剩一棵树：它就是根
            const std::uint64_t merged = add(group.weight, next->weight);
            wpl = add(wpl, merged);
            heap.insert(ByWeight{merged, 1});
            if (next->count > 1) heap.insert(ByWeight{next->weight, next->count - 1});
        } else {
            const std::uint64_t pairs = group.count / 2;
            const std::uint64_t merged = mul(group.weight, 2);
            wpl = add(wpl, mul(merged, pairs));            // pairs 个内部结点，各权 2w
            if (group.count % 2 == 1) heap.insert(ByWeight{group.weight, 1});   // 奇数余下的一棵
            heap.insert(ByWeight{merged, pairs});
        }
    }
    return wpl;
}
```

结果用 64 位无符号数。设总权 $W=\sum w_ic_i$、叶子总数 $n=\sum c_i$，因为等权时尽量满的树深度不超过 $\lceil\log_2 n\rceil$，最优的 WPL 不超过 $W\lceil\log_2 n\rceil$；这个数小于 $2^{64}$ 就一定不溢出。超出时，中途的每一次加法和乘法都先检查，溢出就抛 `std::overflow_error`，不返回回绕后的错数。测试把几百组随机的小输入逐个展开成单个叶子，交给第 5 节那份教学版 `HuffmanTree::weighted_path_length` 真建树核对；$10^9$ 棵权为 1 的叶子则与闭式公式 $n\lfloor\log_2 n\rfloor+2(n-2^{\lfloor\log_2 n\rfloor})$ 核对（$n$ 片等权叶子的最优树把叶子放在相邻两层，取 $k=\lfloor\log_2 n\rfloor$，每片叶子至少深 $k$，再有 $2(n-2^k)$ 片要深一层——它们两两挂在 $n-2^k$ 个第 $k$ 层结点下）。

#### 示例OJ04080: Huffman 编码树

http://cs101.openjudge.cn/practice/04080/

> 构造一个具有n个外部节点的扩充二叉树，每个外部节点Ki有一个Wi对应，作为该外部节点的权。使得这个扩充二叉树的叶节点带权外部路径长度总和最小：
>
> ​                   Min( W1 * L1 + W2 * L2 + W3 * L3 + … + Wn * Ln)
>
> Wi:每个节点的权值。
>
> Li:根节点到第i个外部叶子节点的距离。
>
> 编程计算最小外部路径长度总和。
>
> **输入**
>
> 第一行输入一个整数n，外部节点的个数。第二行输入n个整数，代表各个外部节点的权值。
> 2<=N<=100
>
> **输出**
>
> 输出最小外部路径长度总和。
>
> 样例输入
>
> ```
> 4
> 1 1 3 5
> ```
>
> 样例输出
>
> ```
> 17
> ```
>
> 
>
> 用上面「WPL 等于所有内部结点的权之和」这一条，连树都不必建：每次从最小堆里取出两个最小的权合并，把合并出的新权累加起来即可。样例的合并过程是 1+1=2 → 2+3=5 → 5+5=10，WPL $=2+5+10=17$。
>
> ```python
> import heapq
>
> n = int(input())
> weights = list(map(int, input().split()))
> heapq.heapify(weights)                      # 筛选法建堆，O(n)
> wpl = 0
> while len(weights) > 1:
>     a = heapq.heappop(weights)              # 最小的
>     b = heapq.heappop(weights)              # 次小的
>     wpl += a + b                            # 新内部结点的权，计入 WPL
>     heapq.heappush(weights, a + b)
> print(wpl)
> ```

> 输入权 2、3、4、7 时输出 30，与「先跑一遍」里教学版 `HuffmanTree` 算出的 WPL 一致。

## 6.2 Huffman 编码

#### 编码与译码

建出树只是半程。Huffman 树的**用途**是给字符编码，这一节把它走完。

**问题从哪来。** 要传电文 `abbaaadc`。定长编码给每个字符 2 位（a=00, b=01, c=10, d=11），
总共 16 位。想更短，就得让**出现次数多的字符用更短的码**。
比如 a=0, b=1, c=01, d=10，电文变成 10 位——**但这样的电文没法译码**：
收到 `011`，既可以读成 a b b，也可以读成 c b。

**症结是「前缀」。** `0` 是 `01` 的前缀，所以读到 `0` 时无法判断该停还是该再读一位。
解决办法是要求任何字符的编码都不是另一个字符编码的前缀——这种编码叫**前缀码**。

**Huffman 树天然给出前缀码。** 规则：从每个结点引向**左**孩子的边标 0、引向**右**孩子的边标 1，
从根走到某个叶子，一路的 0/1 连起来就是那个字符的编码。
为什么一定无前缀冲突？因为**字符只住在叶子上**，而一个叶子不可能出现在另一个叶子的路径上。

原书的编码示例是这样一棵树：

![图 5.20 Huffman 编码示例](https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-5-20.png)

图 5.20　Huffman 编码示例：左边的边标 0、右边的边标 1，从根到叶一路读下来就是那个字符的编码。字符只住在叶子上，所以没有一个编码会是另一个的前缀。

这个例子的字符是 a、b、c、d、e、f、g，出现频率分别为 15、2、6、5、20、10、18。合并次序是
2+5=7 → 6+7=13 → 10+13=23 → 15+18=33 → 20+23=43 → 33+43=76，把每条到左子树的边标 0、到右子树的边标 1，
得到的各字符编码为（教学版 `HuffmanTree::code_of` 对这组权值给出的正是这一组）：

| 字符 | a | b | c | d | e | f | g |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 频率 | 15 | 2 | 6 | 5 | 20 | 10 | 18 |
| 编码 | `00` | `11110` | `1110` | `11111` | `10` | `110` | `01` |

频率最高的 e、g、a 只要 2 位，最低的 b、d 要 5 位。电文总长
$15\times2+2\times5+6\times4+5\times5+20\times2+10\times3+18\times2=195$ 位，也等于内部结点权之和
$7+13+23+33+43+76=195$；7 个字符若用定长编码，每个要 3 位，共 $76\times3=228$ 位。
有了码表，编码就是查表替换；译码则从根出发逐位匹配边上的 0/1，走到叶子译出一个字符再回到根。

以 `abbaaadc` 为例，四个字符的频率是 a×4、b×2、c×1、d×1，建出的 Huffman 树给出

| 字符 | 频率 | 编码 | 位数 |
| --- | --- | --- | --- |
| a | 4 | `0` | 1 |
| b | 2 | `10` | 2 |
| c | 1 | `110` | 3 |
| d | 1 | `111` | 3 |

电文编成 14 位，比定长的 16 位短。**注意 14 正好等于这棵树的 WPL**——
这不是巧合：WPL 是 $\sum(\text{权} \times \text{深度})$，而权就是出现次数、深度就是码长，
两者算的是同一个和。第 6 节开头说「Huffman 树让 WPL 最小」，翻译过来就是
**它让这段电文的编码总长最短**。

**译码用的是同一棵树**：从根出发，读 0 走左、读 1 走右，走到叶子就吐出一个字符，
然后回到根接着读。前缀码保证这个过程不会有歧义。

教学版实现了 `code_of` / `encode` / `decode` 三个函数，就在第 5 节那份清单里。
三处边界值得一提，测试各有一条用例守着：

- **比特串走到一半就没了**（比如传丢了最后一位）→ 返回空 `optional`，而不是吐出半个字符；
- **出现既不是 0 也不是 1 的字符** → 同样返回空 `optional`；
- **整棵树只有一个字符**：从根到叶的路径是空串，那样的编码根本没法传。
  本书约定给它一位 `"0"`。这是真实的边界，不是抠字眼。

还有一个反直觉的结论：**如果所有字符频率相同，Huffman 一位都省不下来。**
8 个等权字符建出的是一棵平衡树，每个字符恰好 3 位——退化成定长编码。
压缩的收益完全来自频率的不均匀。教学版的测试把这条也写成了断言。

（把这套编码器扩展成能压缩文件，需要再加两步：把码表本身也写进输出，
以及处理最后不足一字节的那几位。原书的上机题正是这么布置的。）


---


# 本章小结

- **递归定义**：二叉树左右有别，不是「度为 2 的树」；定义是递归的，周游、释放、深拷贝都自然写成递归，代价是递归深度等于树高。
- **性质**：$n_0=n_2+1$；扩充二叉树 $E=I+2n$；完全二叉树按层编号，结点 $i$ 的孩子是 $2i+1$、$2i+2$，父结点是 $\lfloor(i-1)/2\rfloor$。$n$ 个结点有 $n+1$ 个空指针，线索二叉树与 Morris 遍历就是把它们利用起来。
- **四种周游**：三种深度优先只差 `visit` 那一行的位置（靠栈），层次周游必须用队列；时间都是 $O(n)$。前序或后序 + 中序可以唯一重建（关键码互不相同），前序 + 后序不行；输入不自洽时要报错，而不是默默建出一棵错树。
- **两种存储**：二叉链表最常用；完全二叉树按层编号进数组，父子关系变成下标算术，一根指针都不用。
- **BST 与堆**：BST 是全序，增删查都是 $O(h)$，中序即升序；删除有两个孩子的结点时用中序前驱顶替。堆只要局部有序，插入、删除 $O(\log n)$，筛选法建堆 $O(n)$，是优先队列的标准实现。
- **Huffman**：反复合并两个最小权，得到 WPL 最小的树；WPL = 所有内部结点权之和。左 0 右 1 得到前缀码，编码总长 = WPL。
