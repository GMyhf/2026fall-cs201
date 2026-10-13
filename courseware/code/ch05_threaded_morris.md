# 线索二叉树与 Morris 遍历：代码讲解

对应第五章 PPT 第 13–17 页，代码见同目录的 [`ch05_threaded_morris.cpp`](ch05_threaded_morris.cpp)。

## 编译与运行

```bash
g++ -std=c++17 -Wall -Wextra -O2 ch05_threaded_morris.cpp -o ch05_threaded_morris
./ch05_threaded_morris
```

顺带查内存错误：

```bash
g++ -std=c++17 -Wall -Wextra -g -fsanitize=address,undefined ch05_threaded_morris.cpp -o ch05_threaded_morris
./ch05_threaded_morris
```

输出：

```
递归中序: 4 2 5 1 3
Morris    : 4 2 5 1 3
Morris 后树恢复原样：是
线索周游: 4 2 5 1 3
全部一致
```

代码分三块：结点结构、线索二叉树（第 14–15 页）、Morris 遍历（第 16–17 页），外加 `main` 里的演示与自检。下面都用课件上的例子 1(2(4, 5), 3)，中序序列是 **4 2 5 1 3**：

```
      1
     / \
    2   3
   / \
  4   5
```

---

## 一、结点结构

```cpp
struct Node {
    T value;
    Node* left = nullptr;
    Node* right = nullptr;
    bool left_thread = false;    // true：left 存的是中序前驱
    bool right_thread = false;   // true：right 存的是中序后继
};
```

- 前三个字段就是普通的二叉链表。
- 后两个是**标志位，每根指针一位**。线索化之后，`left` 可能指向左孩子，也可能指向中序前驱，只看指针值分不出来，必须看 `left_thread`。
- Morris 遍历只用前三个字段，标志位对它没用。放在同一个结构体里只是为了一份代码演示两种方法。

---

## 二、递归中序（对照组）

```cpp
template <typename Visitor>
static void inorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    inorder_impl(node->left, visit);
    visit(node->value);
    inorder_impl(node->right, visit);
}
```

这就是课件 5.2.2 的写法，在这里作为"标准答案"，用来检查另外两种方法的输出。要注意两点：

- **递归自带一个栈。** 函数调用栈替你记住了"左子树走完后回到哪个结点"，栈深 = 树高。线索和 Morris 要省掉的就是这个栈。
- **`Visitor` 是模板参数。** 传什么"访问"动作都可以，比如收集到数组、打印。参数是 `Visitor&`，`main` 里传的 lambda 是左值，可以直接绑定。

---

## 三、线索二叉树

### 3.1 线索化：`thread_impl`

```cpp
static void thread_impl(Node* node, Node*& pre) {
    if (node == nullptr) return;
    thread_impl(node->left, pre);                  // ① 先处理左子树
    if (node->left == nullptr) {                   // ② 自己的空左指针 → 前驱
        node->left = pre;
        node->left_thread = true;
    }
    if (pre != nullptr && pre->right == nullptr) { // ③ 上一个结点的空右指针 → 后继（就是我）
        pre->right = node;
        pre->right_thread = true;
    }
    pre = node;                                    // ④ 我成了"上一个"
    thread_impl(node->right, pre);                 // ⑤ 再处理右子树
}
```

**思路：** 这就是一次中序遍历，只是把"访问"换成了"接线索"。中序遍历中，访问到某个结点时，**上一个被访问的结点 `pre` 就是它的中序前驱**。所以在访问时刻：

- 如果我的左指针空着，就让它指向 `pre`（我的前驱）。
- 如果 `pre` 的右指针空着，就让它指向我（`pre` 的后继是我）。

**为什么 `pre` 要用引用 `Node*&`：** 整次遍历只有一个"上一个结点"，所有递归层共用这一个变量。如果按值传，右子树递归回来后 `pre` 的更新就丢了。

**为什么改指针不会和递归冲突：** 每根指针都是在遍历完它指向的那棵子树**之后**才被改写。

- ② 改 `node->left` 时，① 已经把左子树走完了。
- ③ 改 `pre->right` 时，`pre` 的右子树是空的。如果不空，就不会进这个分支。

所以递归永远不会顺着刚接上的线索走回去。

**在例子上走一遍：**

| 访问到 | 进来时的 pre | ② 自己的左指针 | ③ pre 的右指针 |
|---|---|---|---|
| 4 | 空 | 4.left = 空，标为线索 | pre 为空，跳过 |
| 2 | 4 | 有左孩子，不动 | 4.right = 2 |
| 5 | 2 | 5.left = 2 | 2 有右孩子，不动 |
| 1 | 5 | 有左孩子，不动 | 5.right = 1 |
| 3 | 1 | 3.left = 1 | 1 有右孩子，不动 |

### 3.2 收尾：`make_threaded`

```cpp
static void make_threaded(Node* root) {
    Node* pre = nullptr;
    thread_impl(root, pre);
    if (pre != nullptr) pre->right_thread = true;  // 最后一个结点：后继为空
}
```

递归结束时，`pre` 停在中序最后一个结点（例子里是 3）。它没有"下一个结点"来走第 ③ 步，所以要手动把它的右指针标为线索，值保持 `nullptr`。

这样就做到了**每个空指针都标成了线索**：中序第一个结点的左线索、最后一个结点的右线索，值都是 `nullptr`。后面的代码因此只需要看标志位，不必再单独判空。

### 3.3 找后继：`next`

```cpp
static Node* next(Node* node) {
    if (node->right_thread) return node->right;    // 情况 A
    node = node->right;                            // 情况 B
    while (!node->left_thread) node = node->left;
    return node;
}
```

- **情况 A：右指针是线索。** 它存的就是后继，一步到位。如果是最后一个结点，返回 `nullptr`，周游结束。
- **情况 B：右指针是真孩子。** 中序是"左 → 根 → 右"，我访问完了，接下来进右子树。右子树里最先访问的是它**最左下**的结点，所以往右走一步，再一路向左走到底。

**"走到底"为什么用 `!left_thread` 判断，而不是 `left != nullptr`：** 线索化之后，左指针几乎都不为空，叶子的左指针也指着前驱。最左下的那个结点，它的左指针是一条线索，而不是空指针，所以只能靠标志位判断停在哪里。

### 3.4 周游：`inorder_threaded`

```cpp
template <typename Visitor>
static void inorder_threaded(Node* root, Visitor& visit) {
    if (root == nullptr) return;
    Node* node = root;
    while (!node->left_thread) node = node->left;  // 中序第一个：最左下
    for (; node != nullptr; node = next(node)) visit(node->value);
}
```

先从根一路向左，找到中序第一个结点，然后反复调用 `next`。整个过程**没有栈，也没有递归**。

| 当前 | next 走的是 | 下一个 |
|---|---|---|
| 4 | A：4.right 是线索 | 2 |
| 2 | B：进右子树 5，5 的左是线索，停 | 5 |
| 5 | A：5.right 是线索 | 1 |
| 1 | B：进右子树 3，3 的左是线索，停 | 3 |
| 3 | A：3.right 是线索，值为空 | 结束 |

**复杂度：** 时间 O(n)。情况 B 向左走的路径都落在不同子树里，互不重叠，每条边最多走两次。额外空间 O(1)，代价是每个结点多两位标志。

---

## 四、Morris 遍历

```cpp
template <typename Visitor>
static void morris_inorder(Node* root, Visitor& visit) {
    Node* cur = root;
    while (cur != nullptr) {
        if (cur->left == nullptr) {            // 分支 1
            visit(cur->value);
            cur = cur->right;
            continue;
        }
        Node* pre = cur->left;                 // 找前驱
        while (pre->right != nullptr && pre->right != cur) pre = pre->right;
        if (pre->right == nullptr) {           // 分支 2：第一次到 cur
            pre->right = cur;
            cur = cur->left;
        } else {                               // 分支 3：第二次到 cur
            pre->right = nullptr;
            visit(cur->value);
            cur = cur->right;
        }
    }
}
```

### 4.1 核心思想

普通遍历要用栈，是因为进了左子树之后，要记住"走完左子树回到哪里"。

Morris 注意到：**左子树里最后被访问的结点，也就是 `cur` 的中序前驱（左子树最右下的结点），它的 `right` 一定是空的。**（如果不空，它就不是"最右下"。）所以可以临时让它指回 `cur`，把回来的路存进树里，用完再拆掉。

打个比方：普通遍历是随身带地图（栈）。Morris 每到一个岔路口，先派人去左边小路的尽头，在那里刻一个指回路口的箭头，再往左走；以后顺着箭头回来时，把箭头抹掉，继续往右走。

### 4.2 三个分支

- **分支 1：`cur` 没有左子树。** 没有需要先走的路，直接访问 `cur`，然后往右走。这里的 `cur->right` 可能是真的右孩子，也可能是之前搭好的临时线索。顺着线索走，就回到了某个祖先结点。
- **找前驱：** 从 `cur->left` 出发一路向右。循环有两个停止条件：
  - `pre->right == nullptr`：走到了最右下，线索还没搭。
  - `pre->right == cur`：线索已经搭过了，这就是"自己上次搭的"。

  第二个条件绝对不能漏。漏掉的话，`pre` 会顺着线索走回 `cur`，再进左子树，形成死循环。
- **分支 2：第一次到 `cur`。** 搭线索 `pre->right = cur`，然后进左子树。这时**不访问** `cur`，因为中序要先走完左子树。
- **分支 3：第二次到 `cur`。** 是顺着线索回来的，说明左子树已经走完。先拆线索，把树恢复原样，再访问 `cur`，然后进右子树。

**Morris 怎么分辨第一次和第二次：** 它不用标志位，而是看前驱的 `right` 是空的还是指向 `cur` 自己。这条信息本来就藏在树里，不需要额外空间。

### 4.3 在例子上走一遍

| cur | 找到的 pre | 走的分支 | 动作 | 输出 |
|---|---|---|---|---|
| 1 | 5（right 空） | 2 | 搭 5→1，cur = 2 | |
| 2 | 4（right 空） | 2 | 搭 4→2，cur = 4 | |
| 4 | — | 1 | 访问，cur = 4.right = **2**（顺线索回来） | 4 |
| 2 | 4（right = 2） | 3 | 拆 4→2，访问，cur = 5 | 2 |
| 5 | — | 1 | 访问，cur = 5.right = **1**（顺线索回来） | 5 |
| 1 | 5（right = 1） | 3 | 拆 5→1，访问，cur = 3 | 1 |
| 3 | — | 1 | 访问，cur = 空，结束 | 3 |

可以看出规律：**有左子树的结点（1、2）各被经过两次**，没有左子树的结点（4、5、3）只经过一次。

### 4.4 复杂度

- **时间 O(n)。** 表面上是两重循环，但内层循环走的是"cur 左子树的右边链"。不同结点的这条链互不重叠，每条链在搭线索时走一遍、拆线索时再走一遍，所以内层总步数不超过 2n。外层 `cur` 的移动也是 O(n)。
- **空间 O(1)。** 只用了 `cur` 和 `pre` 两个指针。

### 4.5 注意事项

1. **遍历中途树是被改过的。** 如果 `visit` 抛异常或提前 `return`，线索就留在树上，树结构被破坏。遍历期间别的线程也不能同时读这棵树。
2. **只有完整走完才能复原。** 每条线索都在分支 3 被拆掉，前提是遍历没有中断。
3. **函数参数是 `Node*`，不是 `const Node*`。** 因为要改树。递归版用 `const Node*`，从函数签名就能看出两者的区别。

### 4.6 线索二叉树与 Morris 对比

| | 线索二叉树 | Morris 遍历 |
|---|---|---|
| 线索存多久 | 一直在，是存储结构的一部分 | 周游时临时搭，用完拆掉 |
| 结点结构 | 每根指针多一位标志 | 不变，不要标志位 |
| 怎么判断是不是线索 | 看标志位 | 看前驱的 `right` 是否指回 `cur` |
| 代价 | 插入、删除要维护线索 | 周游中途改树，不能并发读 |

共同点：都利用了性质 5 给出的 n + 1 个空指针，让中序周游不用栈也不用递归。Morris 可以看成"临时线索化"。

---

## 五、`main` 里的演示

```cpp
struct Tree {
    std::vector<std::unique_ptr<Node>> pool;
    Node* make(T v, Node* l = nullptr, Node* r = nullptr) { ... }
};
```

**为什么用 `pool` 统一管理内存，而不是写递归析构：** 线索化之后，左右指针里混着"回指"的线索。递归 delete 会顺着线索重复释放同一个结点，甚至无限递归。把所有结点放进一个 `vector<unique_ptr>`，程序结束时统一释放，和树的形状无关。

`main` 的顺序是有讲究的：

1. **递归中序**，得到标准答案 `expect`。
2. **Morris 遍历**，结果和 `expect` 比较。
3. **再跑一次递归中序**，检查 Morris 结束后树是否恢复原样。
4. **线索化，然后沿线索周游**，结果和 `expect` 比较。

**顺序不能颠倒。** 线索化之后，空指针都被线索占了：

- 递归中序会把线索当成孩子走下去，导致无限递归。
- Morris 把"`right` 为空"当作"还没搭线索"，在线索树上也会出错。

所以代码里先做 Morris，最后才做线索化，注释里也写了这一点。

最后 `return ok ? 0 : 1`：结果一致时退出码为 0，不一致时为 1。以后放进自动测试或评测脚本里也能直接用。

---

## 六、思考题

1. **Morris 前序遍历：** 把 `visit` 移到分支 2（第一次到达时）就是前序。为什么分支 3 里就不能再访问了？
2. **中序前驱：** 仿照 `next` 写一个 `prev`，找中序前驱。
3. **插入：** 在线索树里给一个叶子插入右孩子，哪几根指针和标志位要改？这就是"插入、删除要维护线索"的具体含义。
4. **反过来会怎样：** 在已经线索化的树上直接跑 `morris_inorder`，会发生什么？为什么？
