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

## 1 带头结点单链表原地逆置

**E206.反转链表**

https://leetcode.cn/problems/reverse-linked-list/



反转链表是一道经典的链表基础题，题目进阶要求使用**迭代**和**递归**两种方式来解决。下面分别给出这两种方法的详细思路与 C++ 代码实现。

---

### **方法一：双指针迭代法（推荐，最常用）**

**思路**

1. 遍历链表，在遍历过程中改变每个结点的 `next` 指向，使其指向前一个结点。
2. 定义两个指针：
   - `prev`：初始化为 `nullptr`，记录前驱结点。
   - `curr`：初始化为 `head`，表示当前处理的结点。
3. 循环遍历：
   - 暂存当前结点的下一个结点：`ListNode* next = curr->next;`
   - 将当前结点的指针反转：`curr->next = prev;`
   - 将 `prev` 移动到当前结点：`prev = curr;`
   - 将 `curr` 移动到下一个结点：`curr = next;`
4. 当 `curr` 为 `nullptr` 时遍历结束，此时 `prev` 指向原链表的末尾（即反转后的第一个结点），返回 `prev`。

**C++ 代码**

```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        
        while (curr != nullptr) {
            ListNode* next = curr->next; // 暂存后继结点
            curr->next = prev;           // 反转指针
            prev = curr;                 // prev 前移
            curr = next;                 // curr 前移
        }
        
        return prev;
    }
};
```

**复杂度分析**

- **时间复杂度**：$O(n)$，其中 $n$ 是链表的长度，只需遍历一次链表。
- **空间复杂度**：$O(1)$，只使用了常量级别的额外空间。

---

### **方法二：递归法**

**思路**

1. **递归终止条件（Base Case）**：
   - 如果链表为空（`head == nullptr`）或只有一个结点（`head->next == nullptr`），无需反转，直接返回 `head`。
2. **递归调用**：
   - 递归调用 `reverseList(head->next)`，它会把除了当前结点 `head` 之外的剩余链表全部反转，并返回反转后的第一个结点 `newHead`。
3. **指针调整**：
   - 此时 `head->next` 是原链表中的下一个结点，但由于后续部分已经被反转，`head->next` 现在变成了反转后链表的尾结点。
   - 令 `head->next->next = head;`，即将当前结点挂在反转后的子链表末尾。
   - 断开原指针以防形成环：`head->next = nullptr;`。
4. 返回 `newHead`。

**C++ 代码**

```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // 递归终止条件：空链表或只有一个结点
        if (head == nullptr || head->next == nullptr) {
            return head;
        }
        
        // 递归反转剩余部分
        ListNode* newHead = reverseList(head->next);
        
        // 将当前结点挂到反转后的链表尾部
        head->next->next = head;
        head->next = nullptr;
        
        return newHead;
    }
};
```

**复杂度分析**

- **时间复杂度**：$O(n)$，每个结点都会被访问一次。
- **空间复杂度**：$O(n)$，递归调用栈的深度最大为 $n$。

> 注意：递归法的额外空间是 $O(n)$，**不满足**本题"只使用 $O(1)$ 额外空间"的要求，作业中应使用方法一。

---

### **对应本题：带头结点的链表**

LeetCode 206 的 `head` 指向第一个数据结点（不带头结点），而本题的 `L` 是**头结点**，`L->next` 才是第一个数据结点。只需逆置 `L->next` 开始的部分，再挂回头结点之后：

```cpp
// L 为头结点，L->next 指向第一个数据结点
void reverse(ListNode *L) {
    ListNode *prev = nullptr;
    ListNode *curr = L->next;
    while (curr != nullptr) {
        ListNode *next = curr->next; // 暂存后继结点
        curr->next = prev;           // 反转指针
        prev = curr;
        curr = next;
    }
    L->next = prev;                  // 头结点指向新的第一个数据结点
}
```

即 `L->next = reverseList(L->next);`（方法一）。头结点本身不动，空表（`L->next == nullptr`）时循环不执行，`L->next` 仍为 `nullptr`。

---

## 2 不带头结点单链表找中间结点（偶数取后一个）

**E876.链表的中间结点**

https://leetcode.cn/problems/middle-of-the-linked-list/



这是一道非常经典的**快慢指针（双指针）**问题。

**解题思路**

我们可以使用两个指针 `slow` 和 `fast`，初始时它们都指向链表的第一个结点 `head`：
- `slow` 每次向前移动 **1** 步：`slow = slow->next;`
- `fast` 每次向前移动 **2** 步：`fast = fast->next->next;`

**原理分析：**
1. **奇数个结点**（如 `1 -> 2 -> 3 -> 4 -> 5`）：
   - 初始：`slow` 在 1，`fast` 在 1
   - 第 1 步：`slow` 到 2，`fast` 到 3
   - 第 2 步：`slow` 到 3，`fast` 到 5
   - 此时 `fast->next == nullptr`，循环结束，`slow` 正好停在正中间的结点 `3`。
2. **偶数个结点**（如 `1 -> 2 -> 3 -> 4 -> 5 -> 6`）：
   - 初始：`slow` 在 1，`fast` 在 1
   - 第 1 步：`slow` 到 2，`fast` 到 3
   - 第 2 步：`slow` 到 3，`fast` 到 5
   - 第 3 步：`slow` 到 4，`fast` 到 `nullptr`
   - 此时 `fast == nullptr`，循环结束，`slow` 停在第二个中间结点 `4`（符合题目要求）。

因此，循环的继续条件是：`fast != nullptr && fast->next != nullptr`。

---

**C++ 代码实现**

```cpp
class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        
        // 当 fast 能够走两步时继续循环
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;          // 慢指针走一步
            fast = fast->next->next;    // 快指针走两步
        }
        
        return slow;
    }
};
```

---

**复杂度分析**

- **时间复杂度**：$O(N)$，其中 $N$ 是链表的结点数。循环执行 $\lfloor N / 2 \rfloor$ 次，快指针只扫过链表一遍，满足"只遍历一次"的要求。
- **空间复杂度**：$O(1)$，只需要常数级别的额外空间来存储指针。

---

## 3 判断两个无环单链表是否相交，并求第一个公共结点

**E160.相交链表**

https://leetcode.cn/problems/intersection-of-two-linked-lists/



### 方法一：长度差法（Difference of Lengths Method）或 差值步法

**关键性质：** 单链表每个结点只有一个 `next`，所以两表一旦在某结点相交，此后的所有结点都相同，整体呈 **"Y" 形**而不可能是 "X" 形。因此：

- 两表相交 ⟺ 两表的**尾结点是同一个结点**（比较指针地址，而不是比较值）。
- 两表从交点到表尾的长度相同，差别只在交点之前。让长表先走 $|len_1 - len_2|$ 步，两个指针再同步前进，第一次指向同一结点的位置就是第一个公共结点。

```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (headA == nullptr || headB == nullptr) return nullptr;

        // 1. 求两表长度及尾结点
        int len1 = 1, len2 = 1;
        ListNode *t1 = headA, *t2 = headB;
        while (t1->next) { t1 = t1->next; ++len1; }
        while (t2->next) { t2 = t2->next; ++len2; }

        // 2. 尾结点不同则不相交
        if (t1 != t2) return nullptr;

        // 3. 长表先走差值步
        ListNode *p = headA, *q = headB;
        for (int d = len1 - len2; d > 0; --d) p = p->next;
        for (int d = len2 - len1; d > 0; --d) q = q->next;

        // 4. 同步前进，首次相遇即第一个公共结点
        while (p != q) {
            p = p->next;
            q = q->next;
        }
        return p;
    }
};
```

**复杂度：** 时间 $O(len_1 + len_2)$，额外空间 $O(1)$（只用若干指针和计数器）。



### 方法二：双指针法

这道题是经典的单链表相交问题。可以使用**双指针法**来实现时间复杂度 $O(m + n)$、空间复杂度 $O(1)$ 的最优解。

---

**思路**

设链表 A 的非公共部分长度为 $a$，链表 B 的非公共部分长度为 $b$，公共部分（相交部分）长度为 $c$。

1. **若两链表相交**：
   - 链表 A 的总长度为 $a + c$；
   - 链表 B 的总长度为 $b + c$。

   我们使用两个指针 `pA` 和 `pB`，分别从 `headA` 和 `headB` 出发：
   - 指针 `pA` 遍历完链表 A 后（到达 `nullptr`），转去遍历链表 B 的头部；
   - 指针 `pB` 遍历完链表 B 后（到达 `nullptr`），转去遍历链表 A 的头部。

   每轮循环两个指针各移动一次，"从 `nullptr` 跳到另一表的表头"也算一次：
   - 若 $a = b$：两指针走 $a$ 步后直接在交点相遇，不需要换头。
   - 若 $a \ne b$：`pA` 走 $a + c$ 步到 `nullptr`，1 步跳到 `headB`，再走 $b$ 步到交点，共 $a + c + 1 + b$ 步；`pB` 同理共 $b + c + 1 + a$ 步。
   
   由于 $a + c + 1 + b = b + c + 1 + a$，两个指针走过的步数完全相同，因此它们**必定会在相交的第一个结点处相遇**（即 `pA == pB`）。在此之前两者一直位于不同结点，不会提前退出。

2. **若两链表不相交**（即 $c = 0$）：
   - 若 $a = b$，两者走 $a$ 步后同时为 `nullptr`；
   - 否则 `pA` 走完 A、跳到 B 的表头、再走完 B，共 $a + 1 + b$ 步；`pB` 同理共 $b + 1 + a$ 步；
   - 最终它们会**同时指向 `nullptr`**，此时 `pA == pB == nullptr`，循环结束并返回 `nullptr`。

---

**C++ 代码实现**

```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (headA == nullptr || headB == nullptr) {
            return nullptr;
        }

        ListNode *pA = headA;
        ListNode *pB = headB;

        // 当 pA 和 pB 相等时跳出循环（相遇在交点，或者同时为 nullptr）
        while (pA != pB) {
            // pA 走完链表 A 后转向链表 B，否则继续向下走
            pA = (pA == nullptr) ? headB : pA->next;
            // pB 走完链表 B 后转向链表 A，否则继续向下走
            pB = (pB == nullptr) ? headA : pB->next;
        }

        return pA;
    }
};
```

---

**复杂度分析**

- **时间复杂度**：$O(m + n)$，其中 $m = a + c$、$n = b + c$ 分别为两表长度。每个指针最多遍历两个链表各一次（循环至多执行 $a + b + c + 1 \le m + n + 1$ 次）。
- **空间复杂度**：$O(1)$。只使用了两个指针变量，不需要额外的哈希表等存储空间。
