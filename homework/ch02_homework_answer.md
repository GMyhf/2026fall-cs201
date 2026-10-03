# 第二章作业 参考答案

以下代码统一使用如下结点定义：

```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x = 0) : val(x), next(nullptr) {}
};
```

---

### 1 带头结点单链表原地逆置

**思路（头插法）：** 把原链表从第一个数据结点起逐个"摘下"，再依次插到头结点之后。先摘下的结点被后插入的结点挤到后面，最终顺序恰好反过来。只用 `p`、`q` 两个指针，额外空间 $O(1)$。

```cpp
// L 为头结点，L->next 指向第一个数据结点
void reverse(ListNode *L) {
    ListNode *p = L->next;   // p：待处理的剩余链表
    L->next = nullptr;       // 头结点先断开，作为新链表
    while (p != nullptr) {
        ListNode *q = p->next;   // 先记住后继，防止断链
        p->next = L->next;       // 把 p 插到头结点之后
        L->next = p;
        p = q;
    }
}
```

**示例：** `L -> 1 -> 2 -> 3`

| 步骤 | 新链表 | 剩余 |
|---|---|---|
| 初始 | `L` | `1 2 3` |
| 插入 1 | `L -> 1` | `2 3` |
| 插入 2 | `L -> 2 -> 1` | `3` |
| 插入 3 | `L -> 3 -> 2 -> 1` | 空 |

**复杂度：** 时间 $O(n)$，额外空间 $O(1)$。空表（`L->next == nullptr`）和只有一个结点时循环自然处理，无需特判。

> 等价写法（三指针迭代）：维护 `prev, cur, next`，每步令 `cur->next = prev`，最后 `L->next = prev`。

---

### 2 不带头结点单链表找中间结点（偶数取后一个）

**思路（快慢指针）：** `slow` 每次走 1 步，`fast` 每次走 2 步。`fast` 走到表尾时，`slow` 恰好走了一半，只需遍历一次。

```cpp
ListNode *middleNode(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;   // 空表时返回 nullptr
}
```

**正确性：** 循环执行 $k$ 次后，`slow` 指向第 $k+1$ 个结点，`fast` 指向第 $2k+1$ 个结点。循环在 `fast` 为空或 `fast` 为最后一个结点时停止：

- $n$ 为奇数，$n = 2k+1$：`fast` 停在最后一个结点，`slow` 指向第 $k+1 = \frac{n+1}{2}$ 个，正好是中间结点。
- $n$ 为偶数，$n = 2k$：`fast` 走到空，`slow` 指向第 $k+1 = \frac n2 + 1$ 个，是两个中间结点中的**后一个**，符合题意。

**验证：** `1 2 3 4 5` 返回 3；`1 2 3 4` 返回 3；`1 2` 返回 2；`1` 返回 1。

> 若题目要求偶数时返回前一个，把循环条件改成 `fast->next && fast->next->next` 即可。

**复杂度：** 时间 $O(n)$，额外空间 $O(1)$。

---

### 3 判断两个无环单链表是否相交，并求第一个公共结点

**关键性质：** 单链表每个结点只有一个 `next`，所以两表一旦在某结点相交，此后的所有结点都相同，整体呈 **"Y" 形**而不可能是 "X" 形。因此：

- 两表相交 ⟺ 两表的**尾结点是同一个结点**（比较指针地址，而不是比较值）。
- 两表从交点到表尾的长度相同，差别只在交点之前。让长表先走 $|len_1 - len_2|$ 步，两个指针再同步前进，第一次指向同一结点的位置就是第一个公共结点。

```cpp
// 返回第一个公共结点；不相交返回 nullptr
ListNode *getIntersectionNode(ListNode *h1, ListNode *h2) {
    if (h1 == nullptr || h2 == nullptr) return nullptr;

    // 1. 求两表长度及尾结点
    int len1 = 1, len2 = 1;
    ListNode *t1 = h1, *t2 = h2;
    while (t1->next) { t1 = t1->next; ++len1; }
    while (t2->next) { t2 = t2->next; ++len2; }

    // 2. 尾结点不同则不相交
    if (t1 != t2) return nullptr;

    // 3. 长表先走差值步
    ListNode *p = h1, *q = h2;
    for (int d = len1 - len2; d > 0; --d) p = p->next;
    for (int d = len2 - len1; d > 0; --d) q = q->next;

    // 4. 同步前进，首次相遇即第一个公共结点
    while (p != q) {
        p = p->next;
        q = q->next;
    }
    return p;
}
```

**复杂度：** 时间 $O(len_1 + len_2)$，额外空间 $O(1)$（只用若干指针和计数器）。

**另一种写法（双指针交换起点）：** `p` 从 `h1`、`q` 从 `h2` 出发，走到表尾（`nullptr`）后分别改从对方的表头继续。每个指针至多走完两个表各一遍，若相交会在第一个公共结点相遇，否则同时到达 `nullptr`。

```cpp
ListNode *getIntersectionNode2(ListNode *h1, ListNode *h2) {
    ListNode *p = h1, *q = h2;
    while (p != q) {
        p = p ? p->next : h2;
        q = q ? q->next : h1;
    }
    return p;   // 相交时为第一个公共结点，否则为 nullptr
}
```

设 $L_1$ 独有部分长 $a$，$L_2$ 独有部分长 $b$，公共部分长 $c$（循环每轮两个指针各移动一次，"从 `nullptr` 跳到对方表头"也算一次）：

- 若 $a = b$：两者走 $a$ 步后直接在交点相遇（不相交时同时到达 `nullptr`），无需换头。
- 若 $a \ne b$ 且相交：`p` 走 $a + c$ 步到 `nullptr`，1 步跳到 `h2`，再走 $b$ 步到交点，共 $a + c + 1 + b$ 步；`q` 同理共 $b + c + 1 + a$ 步，两者相等，于是同时到达交点。在此之前二者处在不同位置，不会提前误判。
- 若不相交（$c = 0$）：两者都在 $a + 1 + b$ 步后同时为 `nullptr`，循环结束，返回 `nullptr`。
