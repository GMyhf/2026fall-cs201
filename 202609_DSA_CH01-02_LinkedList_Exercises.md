# DSA 习题课：链表 6 题（对应 CH01～CH02）

*Updated 2026-09-16 GMT+8*  
*Compiled by Hongfei Yan (2026 Fall)*  
https://github.com/GMyhf/2026fall-cs201/

> **教材对应**：[GMyhf/dsa-modernization](https://gmyhf.github.io/dsa-modernization/) 第 1 章（概论：ADT、渐进分析）、第 2 章（线性表：顺序表、单链表、双链表、循环链表）。
>
> **课堂定位**：CH02 讲的是「如何自己造一个链表类」；本讲义练的是「拿到别人造好的链表，怎么在上面写算法」。两者合起来才是完整的第 2 章。
>
> **课前准备**：6 道题请先各自尝试 20 分钟再看题解。做不出来不要紧，但要能说清楚「卡在哪一步」。

---

## 0 为什么是这 6 道题

第 2 章最后一节（2.4 线性表实现方法的比较）给出了一张代价表，其中最关键的一行是：

| 运算 | 顺序表 | 链表 |
| :--- | :--- | :--- |
| 按下标读写 `at(i)` | $O(1)$ 随机访问 | $O(n)$ 只能循链数过去 |
| **已知前驱后插入 / 删除** | $O(n)$ 要搬后续元素 | $O(1)$ 只改常数条链接 |
| 按位置插入 / 删除 | $O(n)$ 搬 | $O(n)$ 定位是瓶颈 |

课件里那句话要背下来：

> **链表的 $O(1)$ 前提是「已经拿到了前驱结点」。只给位置 $i$ 的话两种结构都是 $O(n)$，只是瓶颈不同：顺序表是搬，链表是走。**

这 6 道题正好把这句话拆成了三层：

| 分组 | 题号 | 练什么 | 对应章节 |
| :--- | :--- | :--- | :--- |
| 单向链表 | E160 相交链表 | 指针即身份；双指针把 $O(n)$ 的定位做成 $O(1)$ 空间 | 2.3.1 |
| 单向链表 | E206 反转链表 | 改链接的最小动作：断链前先存后继 | 2.3.1 |
| 双向链表 | M1472 浏览器历史 | `prev` 指针买到了什么 | 2.3.2 |
| 双向链表 | M146 LRU 缓存 | 用哈希表把「找前驱」的 $O(n)$ 降到 $O(1)$，链表的 $O(1)$ 才真正兑现 | 2.3.2 + 第 10 章 |
| 核心技巧 | E21 合并两个有序链表 | 头结点（哨兵）为什么能省掉分支 | 2.3.1 |
| 核心技巧 | E234 回文链表 | 快慢指针找中点 + 反转的综合 | 2.3.1 |

**M146 是这一组的收官题**：它是「散列方法是把顺序表和链表结合起来的一种数据结构」（CH02 结尾预告的第 10 章）在工程里最常见的一次落地。

---

## 1 预备：三份模板

### 1.1 结点定义

LeetCode 给定的结点定义（与课件 2.3.1 的 `struct Node` 是同一个东西，只是把 `value/next` 改名成了 `val/next`，并且去掉了头结点）：

```python
# Python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

```cpp
// C++
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
```

> ⚠️ **注意 LeetCode 与课件的一个差别**：课件里的 `LinkedList` 类**带头结点**（不存数据的哨兵，永远排在第一个真元素前面），所以「表头插入」和「中间插入」可以共用一套代码；LeetCode 传给你的 `head` 就是**第一个真元素**，没有哨兵。
>
> 这正是很多同学在 E21、E206 里写出一堆 `if head is None` 分支的原因。**解决办法：自己临时造一个哨兵**（下面 1.3）。

### 1.2 三条铁律

1. **比较结点用「地址」不用「值」**。Python 用 `is`，C++ 直接比指针。E160 全靠这一条。
2. **断链之前先把后继存下来**。课件在析构函数里强调过同一件事：
   ```cpp
   current = current->next;   // 先记下后继
   delete dying;              // 再释放，否则就是从已释放的内存里读指针
   ```
   算法题里是 `next_node = curr.next` 写在 `curr.next = prev` 之前，道理完全一样。
3. **先在纸上画 0 个、1 个、2 个结点的情形**。链表题的 bug 90% 出在这三种长度上。

### 1.3 哨兵（dummy / 虚拟头结点）

课件 2.3.1 的原话：

> 头结点（head node）是一个不存放数据的哨兵，永远排在第一个真元素前面。有了它，表头插入和删除都变成「修改某个前驱的 `next`」，空表也不必另写一套分支。

算法题里的等价写法：

```python
dummy = ListNode(0, head)   # 或 ListNode(0); dummy.next = head
# ... 在 dummy 之后操作 ...
return dummy.next           # 永远返回 dummy.next，而不是原来的 head
```

```cpp
ListNode dummy(0, head);    // 放栈上，不用管释放
// ...
return dummy.next;
```

**什么时候一定要用哨兵**：新表头可能变化（删除首元素、合并、插入排序），或者「先建表再返回」的场合（E21）。

---

# 2 单向链表

## 2.1 E160. 相交链表

> hash table, linked list, two pointers, https://leetcode.cn/problems/intersection-of-two-linked-lists/

给你两个单链表的头节点 `headA` 和 `headB`，请你找出并返回两个单链表相交的**起始节点**。如果不存在相交节点，返回 `null`。题目数据保证整个链式结构中不存在环，且函数返回结果后链表必须**保持其原始结构**。

**进阶**：能否设计一个时间复杂度 $O(m+n)$、仅用 $O(1)$ 内存的解决方案？

### 先想清楚一件事：什么叫「相交」

```
A:  a1 → a2 ↘
              c1 → c2 → c3        ← 相交后是同一串结点，不是「值相同」
B:  b1 → b2 → b3 ↗
```

两个链表相交之后，**后面的结点是同一批对象**（同一个地址），不可能再分开——因为每个结点只有一个 `next`。所以：

- 判断相交只能用 `pA is pB`（C++：`pA == pB`），**不能**用 `pA.val == pB.val`；
- 一旦相交，**两条链的尾巴长度必然相同**。这是所有解法的出发点。

### 解法一：哈希表（$O(m+n)$ 时间，$O(m)$ 空间）

把 A 的所有结点地址丢进集合，再顺着 B 走，第一个命中的就是答案。思路直白，适合当作正确性的对照组。

```python
class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        visited = set()
        p = headA
        while p:
            visited.add(p)          # 存的是结点对象，按 id 哈希
            p = p.next
        p = headB
        while p:
            if p in visited:
                return p
            p = p.next
        return None
```

> Python 的 `set` 对没有自定义 `__hash__` 的对象默认按 `id()` 哈希，正好是「按地址」，符合我们的需要。

### 解法二：对齐长度（$O(1)$ 空间，最容易证明）

设 A 长 $m$、B 长 $n$。若相交，公共尾部长度相同，那么把长的那条**先走 $|m-n|$ 步**，两个指针到表尾的距离就一样了，此后同步前进，第一次相等处即为交点。

### 解法三：双指针「换道」（$O(1)$ 空间，考试要写这个）

```python
class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        if not headA or not headB:
            return None
        pA, pB = headA, headB
        while pA is not pB:                  # 用 is，比地址
            pA = pA.next if pA else headB    # 走到尽头(None)后换到对面的头
            pB = pB.next if pB else headA
        return pA                            # 交点，或 None
```

```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (headA == nullptr || headB == nullptr) return nullptr;
        ListNode *pA = headA, *pB = headB;
        while (pA != pB) {
            pA = (pA == nullptr) ? headB : pA->next;
            pB = (pB == nullptr) ? headA : pB->next;
        }
        return pA;   // 相交则为交点，不相交则两者同时为 nullptr
    }
};
```

### 双指针法的数学证明（本题重点）

记：

- $a$ = A 独有部分的长度（`a1 → a2`，图中 $a=2$）
- $b$ = B 独有部分的长度（`b1 → b2 → b3`，图中 $b=3$）
- $c$ = 公共部分的长度（`c1 → c2 → c3`，图中 $c=3$）

于是 A 总长为 $a+c$，B 总长为 $b+c$。

**情形一：相交（$c > 0$）**

- 指针 `pA` 的路线：走完 A（$a+c$ 步）→ 跳到 `headB` → 再走 $b$ 步抵达交点 `c1`。**总步数 $= a + c + b$。**
- 指针 `pB` 的路线：走完 B（$b+c$ 步）→ 跳到 `headA` → 再走 $a$ 步抵达交点 `c1`。**总步数 $= b + c + a$。**

两式相等。既然两个指针**每轮各走一步、步数又相同**，它们必然在第 $a+b+c$ 步**同时**站在 `c1` 上，循环条件 `pA != pB` 首次失败，返回 `c1`。

还要说明「不会更早相遇」：在抵达交点之前，`pA` 停在 A 的独有段或 B 的前 $b$ 个结点上，`pB` 停在 B 的独有段或 A 的前 $a$ 个结点上；由于两条链在 `c1` 之前没有公共结点，且两指针此时位于同一条链上的**不同偏移**（偏移差恒为 $a-b$，只有走到公共段才归零），不可能提前相等。

**情形二：不相交（$c = 0$）**

- `pA`：走完 A（$a$ 步，此时 `pA` 为 `None`）→ 换到 `headB` → 走完 B（$b$ 步）→ 变成 `None`。**总步数 $a+b+1$ 时为 `None`。**
- `pB`：同理，**总步数 $b+a+1$ 时为 `None`。**

两者**同时**变成 `None`，而 `None is None` 为真，循环退出，返回 `None`——正是期望的答案。

> **这里藏着本题最大的坑**：换道的判断必须写成「**指针本身为空时换道**」（`pA = pA.next if pA else headB`），而不是「**指针的 next 为空时换道**」（`if pA.next is None: pA = headB`）。后者跳过了 `None` 这个位置，不相交时两个指针会在两条链上**无限循环**。
>
> 换句话说：`None` 也是一个必须被访问到的「站点」，它就是两条链共同的「虚拟终点」。

**终止性**：每个指针最多换道一次，走过的结点数不超过 $(a+c)+(b+c)+1$，所以是 $O(m+n)$，且只用了两个指针变量，空间 $O(1)$。

### 复杂度与易错点

| 解法 | 时间 | 空间 | 备注 |
| :--- | :--- | :--- | :--- |
| 哈希表 | $O(m+n)$ | $O(m)$ | 好写、好调试 |
| 对齐长度 | $O(m+n)$ | $O(1)$ | 要遍历两遍求长度 |
| 双指针换道 | $O(m+n)$ | $O(1)$ | 代码最短，但要能讲清为什么 |

- ❌ 用 `pA.val == pB.val` 判断相交。
- ❌ 换道条件写成 `pA.next is None`（不相交时死循环）。
- ❌ 修改链表（本题要求保持原始结构）。
- ✅ `headA` 或 `headB` 为空要提前返回。

---

## 2.2 E206. 反转链表

> recursion, linked list, https://leetcode.cn/problems/reverse-linked-list/

给你单链表的头节点 `head`，请你反转链表，并返回反转后的链表。结点数目范围 $[0, 5000]$。

### 解法一：迭代（三指针）

反转的本质是：**把每个结点的 `next` 从「指向后继」改成「指向前驱」**。单链表从一个结点走不回前一个（CH02 2.3.2 讲双链表时的原话），所以必须自己拿一个 `prev` 变量把前驱背在身上。

```
初始:   None    1 → 2 → 3 → 4 → 5 → None
        prev   curr

一步:   None ← 1    2 → 3 → 4 → 5 → None
               prev curr

结束:   None ← 1 ← 2 ← 3 ← 4 ← 5      curr = None
                                prev  ← 返回 prev
```

每一轮固定四个动作，顺序不能乱：

```python
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        prev, curr = None, head
        while curr:
            nxt = curr.next     # ① 断链前先存后继（铁律 2）
            curr.next = prev    # ② 掉头
            prev = curr         # ③ prev 前进
            curr = nxt          # ④ curr 前进
        return prev             # curr 为 None 时，prev 是新表头
```

```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *prev = nullptr, *curr = head;
        while (curr != nullptr) {
            ListNode *nxt = curr->next;   // ① 先存后继
            curr->next = prev;            // ② 掉头
            prev = curr;                  // ③
            curr = nxt;                   // ④
        }
        return prev;
    }
};
```

**时间 $O(n)$，空间 $O(1)$。** 空表时 `curr` 一开始就是 `None`，直接返回 `prev = None`，无需特判——这就是把 `prev` 初始化为 `None` 的好处。

> **为什么 ① 不能省**：一旦执行了 `curr.next = prev`，原来的后继地址就永远找不回来了。这和课件里析构函数 `current = current->next;` 必须写在 `delete dying;` 之前是同一条原则。

### 解法二：递归

递归的思路要换一个角度：**假设 `reverseList(head.next)` 已经把后面那一段反转好了**，我现在只要处理 `head` 和它后继之间的那一根链接。

```
head → [ 2 → 3 → 4 → 5 ]          调用 reverseList(head.next)
head →  2 ← 3 ← 4 ← 5             返回 newHead = 5，注意 head.next 仍指向 2
         ↑
      head.next 现在是反转后那段的【尾结点】

head.next.next = head             即 2.next = 1，把自己接到尾巴后面
head.next = None                  切断原来的正向链接，否则 1 ⇄ 2 成环
```

```python
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        if head is None or head.next is None:
            return head                  # 递归基：空表或只剩一个结点
        new_head = self.reverseList(head.next)
        head.next.next = head            # 后继的 next 指回自己
        head.next = None                 # 必须切断，否则成环
        return new_head                  # 新表头一路原样向上传
```

```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return head;
        ListNode* newHead = reverseList(head->next);
        head->next->next = head;   // 后继的 next 指回自己
        head->next = nullptr;      // 必须切断，否则成环
        return newHead;            // 新表头原样向上传
    }
};
```

**时间 $O(n)$，空间 $O(n)$（递归栈）。**

> ⚠️ **两个必须提醒的点**
>
> 1. **`head.next = None` 不能漏**。漏掉它，`1.next = 2` 且 `2.next = 1`，链表成环，返回的表头一打印就死循环。
> 2. **递归深度**。本题 $n \le 5000$，而 CPython 默认递归上限是 1000，本地跑要 `import sys; sys.setrecursionlimit(10000)`（LeetCode 已代为放宽）。这正好呼应课件 2.3.1 的警告：
>    > 链长十万级时递归释放会耗尽运行栈。
>
>    **结论：链表上的递归只适合「教学 / 短链」，工程代码一律写迭代。**

### 易错点

- ❌ 忘了存后继就改 `curr.next`。
- ❌ 递归版忘记 `head.next = None`。
- ❌ 返回 `curr` 或 `head`（都是 `None` / 旧表头），正确的是 `prev` / `newHead`。
- ✅ 用 $n=0,1,2$ 手推一遍，三种长度都对了基本就没问题。

---

# 3 双向链表

课件 2.3.2 用一句话概括了双链表的全部价值：

> 双链结点比单链结点多一根 `prev`。多出来的那个指针（64 位机上 8 字节）只买到一件事，但这件事很值：**已知一个结点时，删除它是 $O(1)$**。单链表要做同一件事，得先从头走到它的前驱，$O(n)$。

下面两题就是把这句话换成两种场景：M1472 要的是「**已知当前结点，向前 / 向后走**」；M146 要的是「**已知一个结点，把它摘下来重新挂到表头**」。

```python
# 双链表结点（本节两题通用）
class DNode:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None
```

---

## 3.1 M1472. 设计浏览器历史记录

> doubly-linked list, design, https://leetcode.cn/problems/design-browser-history/

实现 `BrowserHistory` 类：

- `BrowserHistory(string homepage)`：用 `homepage` 初始化。
- `void visit(string url)`：从当前页跳转到 `url`。**此操作会把浏览历史「前进」方向的记录全部删除。**
- `string back(int steps)`：后退至多 `steps` 步，返回当前页 url。
- `string forward(int steps)`：前进至多 `steps` 步，返回当前页 url。

数据范围：`homepage` 与 `url` 长度 $\le 20$，`1 <= steps <= 100`，最多调用 $5000$ 次。

### 为什么这题是双链表的教科书例子

浏览器历史是一条**线性的页面序列**，加上一个「当前位置」指针：

```
       back ←          → forward
  leetcode ⇄ google ⇄ facebook ⇄ youtube
                          ↑
                       current
```

- `back` / `forward` = 沿 `prev` / `next` 走 → **必须双向**，单链表走不回去；
- `visit` = 在 `current` 后面接一个新结点，并**丢弃 `current` 之后的全部旧记录** → 已知结点的插入 / 删除，正是 $O(1)$ 的那类操作。

### Python 实现

```python
class DNode:
    def __init__(self, url: str):
        self.url = url
        self.prev = None
        self.next = None


class BrowserHistory:
    def __init__(self, homepage: str):
        self.current = DNode(homepage)

    def visit(self, url: str) -> None:
        node = DNode(url)
        self.current.next = node    # 旧的前进历史在这一行被丢弃
        node.prev = self.current
        self.current = node

    def back(self, steps: int) -> str:
        while steps > 0 and self.current.prev is not None:
            self.current = self.current.prev
            steps -= 1
        return self.current.url

    def forward(self, steps: int) -> str:
        while steps > 0 and self.current.next is not None:
            self.current = self.current.next
            steps -= 1
        return self.current.url
```

关键在 `visit` 的 `self.current.next = node` 这一行：原来挂在 `current` 后面的那一整串结点**从此没有任何变量引用它们**，Python 的引用计数会自动回收（注意旧链上的 `prev` 指针也一起没了，不存在引用环）。

### C++ 实现

C++ 没有 GC，丢弃的那一段必须**自己 `delete`**——这正是 CH02 反复强调的「自己管着 `new` 出来的内存，最少要写哪几个函数」（三法则）。

```cpp
class BrowserHistory {
private:
    struct DNode {
        std::string url;
        DNode* prev = nullptr;
        DNode* next = nullptr;
        explicit DNode(std::string u) : url(std::move(u)) {}
    };

    DNode* current_;

    static void freeForward(DNode* node) {       // 释放 node 及其后的全部结点
        while (node != nullptr) {
            DNode* dying = node;
            node = node->next;                   // 先记下后继，再 delete
            delete dying;
        }
    }

public:
    explicit BrowserHistory(std::string homepage)
        : current_(new DNode(std::move(homepage))) {}

    ~BrowserHistory() {                          // 三法则：析构必须循环，不能递归
        while (current_->prev != nullptr) current_ = current_->prev;
        freeForward(current_);
    }

    // 本类持有裸指针，禁止拷贝（三法则的另一半：要么都写，要么都禁）
    BrowserHistory(const BrowserHistory&) = delete;
    BrowserHistory& operator=(const BrowserHistory&) = delete;

    void visit(std::string url) {
        freeForward(current_->next);             // 丢弃前进历史，否则内存泄漏
        DNode* node = new DNode(std::move(url));
        current_->next = node;
        node->prev = current_;
        current_ = node;
    }

    std::string back(int steps) {
        while (steps > 0 && current_->prev != nullptr) {
            current_ = current_->prev;
            --steps;
        }
        return current_->url;
    }

    std::string forward(int steps) {
        while (steps > 0 && current_->next != nullptr) {
            current_ = current_->next;
            --steps;
        }
        return current_->url;
    }
};
```

> `freeForward` 里的 `node = node->next;` 必须写在 `delete dying;` **之前**——和课件 `clear()` 里那句注释一字不差：「否则就是从已释放的内存里读指针」。ASan 下这种错误会立刻报 heap-use-after-free。

### 对照组：顺序表实现（这题其实数组更优！）

**Python 实现**

```python
class BrowserHistory:
    def __init__(self, homepage: str):
        self.history = [homepage]
        self.cur = 0          # 当前下标
        self.top = 0          # 有效历史的最后一个下标

    def visit(self, url: str) -> None:
        self.cur += 1
        if self.cur < len(self.history):
            self.history[self.cur] = url      # 覆盖，等价于「删除前进历史」
        else:
            self.history.append(url)
        self.top = self.cur                   # 前进历史作废

    def back(self, steps: int) -> str:
        self.cur = max(0, self.cur - steps)   # 一步到位，O(1)
        return self.history[self.cur]

    def forward(self, steps: int) -> str:
        self.cur = min(self.top, self.cur + steps)
        return self.history[self.cur]
```

**C++ 实现**

将 Python 版的思路翻译为 C++ 的 `std::vector<string>`。

利用 top 维护有效历史的右边界，在 visit 时复用已有容量，避免频繁的 vector 缩容/重分配，同时让 back 和 forward 保持 O(1) 的直接计算：

```cpp
class BrowserHistory {
private:
    vector<string> history;
    int cur = 0;  // 当前访问的下标
    int top = 0;  // 有效历史的最远下标

public:
    BrowserHistory(string homepage) {
        history.push_back(move(homepage));
        cur = 0;
        top = 0;
    }
    
    void visit(string url) {
        cur++;
        if (cur < static_cast<int>(history.size())) {
            history[cur] = move(url); // 覆盖旧历史，原地复用内存
        } else {
            history.push_back(move(url));
        }
        top = cur; // 截断前进历史
    }
    
    string back(int steps) {
        cur = max(0, cur - steps); // O(1) 计算跳转
        return history[cur];
    }
    
    string forward(int steps) {
        cur = min(top, cur + steps); // O(1) 计算跳转
        return history[cur];
    }
};
```



**这是本题最值得讲的一页。** 把两种实现按 CH02 2.4 的表格对照一下：

| 运算 | 双链表 | 顺序表（动态数组） |
| :--- | :--- | :--- |
| `visit` | $O(1)$ 改两根指针（C++ 还要 $O(k)$ 释放旧段） | 摊还 $O(1)$，只改下标 |
| `back(steps)` / `forward(steps)` | $O(\text{steps})$ 一步一步走 | **$O(1)$ 下标直接加减并截断** |
| 额外空间 | 每结点两根指针 | 几乎没有（紧凑存储） |
| 前进历史作废 | 断一根 `next`（C++ 要遍历释放） | 移动一个 `top` 变量 |

**结论**：`back(steps)` 是「按位置跳转」，顺序表的随机访问在这里完胜。真实浏览器用双链表，是因为每条历史记录还要挂标题、截图、表单数据等一大坨东西，且需要在中间删除单条记录；但就 LeetCode 这道题而言，**数组版又短又快**。

> 这恰好印证了课件 2.4 的取舍原则：「**经常按位置访问、而且按位读比插删频繁时不宜使用链表**」。做题时把双链表版写出来是为了练手，工程选型要看真实负载。

### 易错点

- ❌ `visit` 之后没有切断前进历史（`forward` 会走到早已作废的页面）。
- ❌ `back` / `forward` 写成 `for _ in range(steps)` 而不判断边界（越界崩溃）。
- ❌ C++ 版不 `delete` 被丢弃的分支（内存泄漏，本地 valgrind / ASan 会报）。
- ✅ `steps` 超过可走步数时**走到头就停**，返回当前 url，而不是返回空。

---

## 3.2 M146. LRU 缓存

> hash table, doubly-linked list, design, https://leetcode.cn/problems/lru-cache/

实现 `LRUCache` 类，`get` 和 `put` 都必须是**平均 $O(1)$**：

- `LRUCache(int capacity)`：以正整数容量初始化。
- `int get(int key)`：存在则返回 value 并将其标记为「最近使用」，否则返回 `-1`。
- `void put(int key, int value)`：存在则更新并标记为最近使用；不存在则插入，若超出容量则**逐出最久未使用的关键字**。

数据范围：`1 <= capacity <= 3000`，最多调用 $2 \times 10^5$ 次。

### 思路推导：为什么必须是「哈希表 + 双链表」

先分析需求，看单一结构为什么不够：

| 需求 | 只用哈希表 | 只用双链表 | 只用数组 |
| :--- | :--- | :--- | :--- |
| 按 key 查 value | ✅ $O(1)$ | ❌ $O(n)$ 循链找 | ❌ $O(n)$ |
| 维护「使用时间」次序 | ❌ 无序 | ✅ 表头最新、表尾最旧 | ✅ 但… |
| 把某个元素移到最前 | ❌ | ✅ $O(1)$（已知结点） | ❌ $O(n)$ 搬元素 |
| 删除最旧的元素 | ❌ | ✅ $O(1)$（表尾） | ✅ $O(1)$ |

两张表各有一半能力，**合起来正好补全**：

```
哈希表  key ──────────────┐ 直接拿到结点地址，跳过「循链定位」这一步 O(1)
                          ↓
双链表  head ⇄ [k3] ⇄ [k1] ⇄ [k2] ⇄ tail
         (哨兵)  最新            最旧  (哨兵)
```

**这就是课件那句「链表的 $O(1)$ 前提是已经拿到了前驱结点」的最佳注脚**：链表本身给不出「拿到结点」这一步，哈希表补上了它，于是链表的 $O(1)$ 插删才真正兑现。CH02 结尾预告的「散列方法是把顺序表和链表结合起来的一种数据结构（第 10 章）」，说的就是这类组合。

### 为什么要用两个哨兵

用 `head` 和 `tail` 两个不存数据的哨兵结点（课件 2.3.1 的头结点思想，双向版），可以让：

- 「插到表头」= 插在 `head` 之后；
- 「删除表尾」= 删除 `tail` 之前的那个；
- **空表、单结点表、多结点表用同一套代码**，一个 `if` 都不用写。

<img src="https://pic.leetcode.cn/1696039105-PSyHej-146-3-c.png" alt="LRU 图示" style="zoom: 25%;" />

### Python 实现（手写双链表）

```python
class DNode:
    __slots__ = ('key', 'value', 'prev', 'next')

    def __init__(self, key=0, value=0):
        self.key = key          # ★ 结点里必须存 key，逐出时要拿它去删哈希表
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.table = {}                  # key -> DNode
        self.head = DNode()              # 哨兵：head.next 是最近使用的
        self.tail = DNode()              # 哨兵：tail.prev 是最久未使用的
        self.head.next = self.tail
        self.tail.prev = self.head

    # ---------- 三个私有辅助，都是 O(1) ----------
    def _remove(self, node: DNode) -> None:
        """已知结点，摘链。双链表的看家本领。"""
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_front(self, node: DNode) -> None:
        """插到 head 哨兵之后"""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def _move_to_front(self, node: DNode) -> None:
        self._remove(node)
        self._add_front(node)

    # ---------- 对外接口 ----------
    def get(self, key: int) -> int:
        node = self.table.get(key)
        if node is None:
            return -1
        self._move_to_front(node)        # 命中即刷新
        return node.value

    def put(self, key: int, value: int) -> None:
        node = self.table.get(key)
        if node is not None:             # 已存在：原地改值 + 刷新
            node.value = value
            self._move_to_front(node)
            return
        node = DNode(key, value)
        self.table[key] = node
        self._add_front(node)
        if len(self.table) > self.capacity:
            lru = self.tail.prev         # 表尾哨兵之前 = 最久未使用
            self._remove(lru)
            del self.table[lru.key]      # ★ 别忘了同步删哈希表，否则表只增不减、结果出错
```

> **三个细节**
>
> 1. **结点里为什么要存 `key`**：逐出时我们是从**链表尾部**拿到结点的，但要删的是**哈希表里的一项**，没有 `key` 就找不到该删谁。这是本题最经典的一个坑。
> 2. `dict` 的 `del d[k]` / `d.pop(k)` 平均 $O(1)$，符合题目对平均复杂度的要求。
> 3. **漏删哈希表的后果**：`len(self.table)` 不再下降，此后每次 `put` 都会触发逐出；`get` 到已被逐出的 key 时，还会对一个早已摘下的结点调用 `_remove`，它残留的 `prev` / `next` 会把链表改乱。在 Python 里这是「结果错」，不是 C++ 意义上的内存泄漏（结点仍被字典引用着）。

#### 为什么整段代码里 `self.tail` 从来没被赋值？

读代码时很容易发现：`self.head`、`self.tail` 在 `__init__` 之后再也没有出现在赋值号左边，于是会怀疑「表尾变了，`tail` 却没跟着改」。

**`self.tail` 本来就不该变。** 它是哨兵，永远是表尾那个不存数据的空结点；「最久未使用的是谁」记在 **`self.tail.prev`** 里，而 `tail.prev` 在两个辅助函数里被**间接**修改了：

| 位置 | 代码 | 什么时候就是在改 `tail.prev` |
| :--- | :--- | :--- |
| `_add_front` | `self.head.next.prev = node` | 表为空时 `head.next` 就是 `tail`，这句即 `tail.prev = node` |
| `_remove` | `node.next.prev = node.prev` | 摘最后一个真结点时 `node.next` 就是 `tail`，这句即 `tail.prev = node.prev` |

逐步跟踪一遍（capacity = 2）：

```text
操作       tail.prev   正向（head→tail）   反向（tail→head）
init       head        []                  []
put(1,1)   k1          [k1]                [k1]         ← _add_front 里改的
put(2,2)   k1          [k2, k1]            [k1, k2]
get(1)     k2          [k1, k2]            [k2, k1]     ← _remove(k1) 里改的
put(3,3)   k1          [k3, k1]            [k1, k3]     ← 逐出 k2 时 _remove 里改的
```

全程 `self.tail` 是**同一个对象**，`tail.prev` 却始终指向正确的最久未使用结点；正向、反向遍历每一步都互为逆序，说明两条链保持一致。

**这正是哨兵的价值。** 如果不设 `tail` 哨兵，而让 `self.tail` 直接指向最后一个真结点，就得到处补分支：插第一个结点时 `if 表空: self.tail = node`，删最后一个结点时 `if node is self.tail: self.tail = node.prev`，删成空表还要置 `None`。用了两个哨兵，每个真结点前后**一定有结点**，`_remove` / `_add_front` 里一个 `if` 都不用写——代价只是「表尾是谁」从 `self.tail` 挪到了 `self.tail.prev`。这和 1.3 节、课件 2.3.1 的头结点是同一个思想，只是换成了双向、首尾各一个。

> C++ 版的 `head_` / `tail_` 同理：构造函数之后也不再赋值，`tail_->prev` 在 `remove` / `addFront` 里被间接更新。

**面试 / 比赛速写版**（用 `OrderedDict`，但**习题课要求先能手写上面那版**）：

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.od = OrderedDict()          # 底层就是「哈希表 + 双向链表」

    def get(self, key: int) -> int:
        if key not in self.od:
            return -1
        self.od.move_to_end(key)         # O(1)
        return self.od[key]

    def put(self, key: int, value: int) -> None:
        if key in self.od:
            self.od.move_to_end(key)
        self.od[key] = value
        if len(self.od) > self.capacity:
            self.od.popitem(last=False)  # 弹出最旧的
```

> `OrderedDict` 的 CPython 实现本身就是一个哈希表加一条循环双向链表——**你手写的那版正是它的内核**。

### C++ 实现（手写双链表）

```cpp
class LRUCache {
private:
    struct DNode {
        int key, value;
        DNode* prev;
        DNode* next;
        DNode(int k = 0, int v = 0) : key(k), value(v), prev(nullptr), next(nullptr) {}
    };

    int capacity_;
    std::unordered_map<int, DNode*> table_;
    DNode* head_;   // 哨兵：head_->next 最新
    DNode* tail_;   // 哨兵：tail_->prev 最旧

    void remove(DNode* node) {                 // 已知结点，O(1) 摘链
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    void addFront(DNode* node) {
        node->next = head_->next;
        node->prev = head_;
        head_->next->prev = node;
        head_->next = node;
    }

    void moveToFront(DNode* node) { remove(node); addFront(node); }

public:
    explicit LRUCache(int capacity)
        : capacity_(capacity), head_(new DNode()), tail_(new DNode()) {
        head_->next = tail_;
        tail_->prev = head_;
        table_.reserve(capacity * 2);          // 减少 rehash，常数优化
    }

    ~LRUCache() {                              // 三法则：自己 new 的就自己 delete
        DNode* curr = head_;
        while (curr != nullptr) {
            DNode* dying = curr;
            curr = curr->next;                 // 先记后继，再释放
            delete dying;
        }
    }
    LRUCache(const LRUCache&) = delete;        // 持有裸指针，禁止拷贝
    LRUCache& operator=(const LRUCache&) = delete;

    int get(int key) {
        auto it = table_.find(key);
        if (it == table_.end()) return -1;
        moveToFront(it->second);
        return it->second->value;
    }

    void put(int key, int value) {
        auto it = table_.find(key);
        if (it != table_.end()) {              // 已存在：改值 + 刷新
            it->second->value = value;
            moveToFront(it->second);
            return;
        }
        DNode* node = new DNode(key, value);
        table_[key] = node;
        addFront(node);
        if (static_cast<int>(table_.size()) > capacity_) {
            DNode* lru = tail_->prev;
            remove(lru);
            table_.erase(lru->key);            // ★ 靠结点里存的 key 反查哈希表
            delete lru;                        // ★ C++ 还要真正释放
        }
    }
};
```

**标准库速写版**（`std::list` 就是循环双向链表，`splice` 是 $O(1)$ 的「摘下来重新挂」）：

```cpp
class LRUCache {
private:
    int capacity_;
    std::list<std::pair<int, int>> lst_;                                   // front 最新
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> table_;

public:
    explicit LRUCache(int capacity) : capacity_(capacity) {}

    int get(int key) {
        auto it = table_.find(key);
        if (it == table_.end()) return -1;
        lst_.splice(lst_.begin(), lst_, it->second);   // O(1) 移到表头，迭代器不失效
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = table_.find(key);
        if (it != table_.end()) {
            it->second->second = value;
            lst_.splice(lst_.begin(), lst_, it->second);
            return;
        }
        lst_.emplace_front(key, value);
        table_[key] = lst_.begin();
        if (static_cast<int>(table_.size()) > capacity_) {
            table_.erase(lst_.back().first);           // 同样靠存下来的 key
            lst_.pop_back();
        }
    }
};
```

> `std::list::splice` 的价值和我们手写的 `moveToFront` 完全一样：**只改链接，不搬元素，迭代器（相当于结点地址）保持有效**。这是 `std::vector` 给不了的。

### 复杂度与易错点

- **时间**：`get` / `put` 平均 $O(1)$（哈希 $O(1)$ + 改常数条链接 $O(1)$）。
- **空间**：$O(\text{capacity})$。

- ❌ 结点里不存 `key`，逐出时删不掉哈希表项。
- ❌ 逐出时只摘链表不删哈希表（表越撑越大，后续 `get` 返回已作废的结点）。
- ❌ `put` 一个已存在的 key 时，又插了一个新结点（同一个 key 在链表里出现两次）。
- ❌ 判断超容量用 `>=` 而不是 `>`。
- ❌ C++ 版忘记 `delete lru`。
- ✅ 用哨兵后，所有分支判断都不需要——如果你写出了 `if self.head is None`，说明哨兵没用对。

---

# 4 核心技巧拓展

## 4.1 E21. 合并两个有序链表

> linked list, recursion, https://leetcode.cn/problems/merge-two-sorted-lists/

将两个**升序**链表合并为一个新的升序链表并返回。新链表是通过**拼接**给定的两个链表的所有结点组成的。两链表结点数目范围 $[0, 50]$。

注意题目说的是「拼接」：**不需要 `new` 新结点，只改链接**——这正是链表最擅长的事。

### 思路：归并 + 哨兵

和归并排序的 merge 步骤一模一样：两个指针各指一条链的当前最小元素，每次挑小的接到结果尾部。

```
list1: 1 → 2 → 4
list2: 1 → 3 → 4

dummy → 1 → 1 → 2 → 3 → 4 → 4
  ↑
 哨兵，最后 return dummy.next
```

**哨兵在这里省掉了什么**：如果不用哨兵，第一次接结点时要写「结果表还是空的，得把 head 指过去」，之后每次又要写「接到 tail 后面」——两套分支。有了哨兵，第一次接也是「接到 tail 后面」（tail 初始就是 dummy），**一套代码走到底**。这就是课件 2.3.1 说的「空表也不必另写一套分支」。

### 迭代版

```python
class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        dummy = ListNode(0)      # 哨兵：不存数据，只为省掉分支
        tail = dummy
        while list1 and list2:
            if list1.val <= list2.val:   # ★ 用 <= 保证稳定性（相等时优先取 list1）
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 if list1 else list2   # 剩下那条整体挂上，不必逐个搬
        return dummy.next
```

```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);              // 放栈上，函数返回时自动销毁，不泄漏
        ListNode* tail = &dummy;
        while (list1 != nullptr && list2 != nullptr) {
            if (list1->val <= list2->val) {
                tail->next = list1;
                list1 = list1->next;
            } else {
                tail->next = list2;
                list2 = list2->next;
            }
            tail = tail->next;
        }
        tail->next = (list1 != nullptr) ? list1 : list2;   // 剩余整段直接挂
        return dummy.next;
    }
};
```

**时间 $O(m+n)$，空间 $O(1)$**（只改链接，没有新分配）。

> **最后那一行是链表相对数组的一次胜利**：数组做归并时，剩余部分必须**逐个拷贝**到结果数组；链表只要改一根指针，剩下几万个结点一次性挂上，$O(1)$。

### 递归版

```python
class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        if list1 is None:
            return list2            # 递归基
        if list2 is None:
            return list1
        if list1.val <= list2.val:
            list1.next = self.mergeTwoLists(list1.next, list2)
            return list1
        else:
            list2.next = self.mergeTwoLists(list1, list2.next)
            return list2
```

```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        if (list1 == nullptr) return list2;
        if (list2 == nullptr) return list1;
        if (list1->val <= list2->val) {
            list1->next = mergeTwoLists(list1->next, list2);
            return list1;
        }
        list2->next = mergeTwoLists(list1, list2->next);
        return list2;
    }
};
```

递归版**读起来最像定义**：「两条链的合并结果 = 较小的那个头 + 剩下两条链的合并结果」。代价是 $O(m+n)$ 的栈深度——本题 $n \le 50$ 无所谓，但换成 M23（合并 K 个升序链表，单链可达 $10^4$）就必须写迭代。

### 往后看：这就是归并排序的核心

> **M148 排序链表**（https://leetcode.cn/problems/sort-list/）= 快慢指针找中点断开 + 递归排序两半 + 本题的 merge。
>
> 链表归并排序是**唯一能做到 $O(n\log n)$ 时间且 $O(1)$ 额外空间**（自底向上写法）的链表排序。CH02 2.4 说「顺序表提供随机访问，因此适合二分检索与快速排序」，反过来：**链表不适合快排（要随机访问定位 pivot），但天生适合归并排序（只需顺序扫描）**。这一条后面第 8 章还会再讲。

### 易错点

- ❌ 不用哨兵，导致要写 `if result is None` 的分支。
- ❌ 用 `<` 而不是 `<=`（本题结果仍然正确，但作为归并排序的子过程会**破坏稳定性**，养成用 `<=` 的习惯）。
- ❌ 循环结束后忘记挂剩余段。
- ❌ 新建结点拷贝值（题目要求拼接，多余的 $O(n)$ 空间）。

---

## 4.2 E234. 回文链表

> linked list, two pointers, https://leetcode.cn/problems/palindrome-linked-list/

判断单链表是否为回文。结点数目 $[1, 10^5]$，$0 \le \text{Node.val} \le 9$。

**进阶：$O(n)$ 时间、$O(1)$ 空间。**

### 解法一：倒进数组（$O(n)$ 空间，先保证会做）

```python
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        vals = []
        while head:
            vals.append(head.val)
            head = head.next
        return vals == vals[::-1]
```

$O(n)$ 时间 $O(n)$ 空间。能过，但没有练到链表。

### 解法二：快慢指针 + 反转后半（进阶解法，本题重点）

三步走：

```
① 快慢指针找中点        1 → 2 → 3 → 2 → 1
                               ↑ slow

② 反转后半段            1 → 2 → 3 ← 2 ← 1
                        ↑           ↑
                       left       right(=prev)

③ 双向比较             逐个比 left.val 与 right.val，right 走完即止
```

**第 ① 步的原理**：`fast` 每次走两步、`slow` 每次走一步，`fast` 走到尽头时 `slow` 恰好走了一半。

```python
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

这两个循环条件要分清：

| 链表长度 | 循环结束时 | `slow` 落在 |
| :--- | :--- | :--- |
| 偶数 $n=2k$ | `fast is None` | 第 $k+1$ 个结点（**后半段的第一个**） |
| 奇数 $n=2k+1$ | `fast.next is None` | 第 $k+1$ 个结点（**正中间**） |

两种情况 `slow` 都落在「从这里开始反转」的正确位置上：偶数时前后两半等长；奇数时中间那个结点会和自己比较，恒为真，不影响结果。

```python
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        if not head or not head.next:
            return True

        # ① 快慢指针找中点
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        # ② 反转后半段（就是 E206 的迭代模板）
        prev = None
        curr = slow
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt

        # ③ 前半段与反转后的后半段逐个比较
        left, right = head, prev
        result = True
        while right:                 # 以较短的后半段为准，right 走完即止
            if left.val != right.val:
                result = False
                break
            left = left.next
            right = right.next
        return result
```

```cpp
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return true;

        // ① 快慢指针找中点
        ListNode *slow = head, *fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // ② 反转后半段
        ListNode *prev = nullptr, *curr = slow;
        while (curr != nullptr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }

        // ③ 比较
        bool result = true;
        ListNode *left = head, *right = prev;
        while (right != nullptr) {
            if (left->val != right->val) { result = false; break; }
            left = left->next;
            right = right->next;
        }
        return result;
    }
};
```

**时间 $O(n)$，空间 $O(1)$。**

> **③ 为什么用 `while right` 而不是 `while left`**：反转之后，前半段的最后一个结点仍然指向 `slow`（`slow` 的 `next` 在反转中被改成了 `None`，但指向 `slow` 的那根链接没动），所以从 `left` 出发能一直走到 `slow` 才停；而 `right` 恰好在走完后半段后变成 `None`。**以短的那条为准**最稳妥。

### 加分项：比较完把链表恢复原状

工程上「判断函数不应该改坏输入」。反转一次是 $O(n)$，再反转回来还是 $O(n)$，总复杂度不变：

```python
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        if not head or not head.next:
            return True

        def reverse(node):
            prev = None
            while node:
                node.next, prev, node = prev, node, node.next
            return prev

        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next

        second = reverse(slow)          # 反转后半段
        left, right = head, second
        ok = True
        while right:
            if left.val != right.val:
                ok = False
                break
            left, right = left.next, right.next

        reverse(second)                 # ★ 复原：再反转一次接回去
        return ok
```

> Python 里 `node.next, prev, node = prev, node, node.next` 是一行版的三指针反转：**右边整体先求值**，所以 `node.next` 取的还是修改前的值。写给自己看可以，**考试时建议写展开版**，可读性更重要。

### 易错点

- ❌ 快慢指针循环条件写成 `while fast.next and fast.next.next`（中点位置偏了一位，偶数长度会出错）。
- ❌ 比较时用 `while left`（前半段走不完，可能误判）。
- ❌ 空表 / 单结点没有提前返回（`slow = head`，反转后 `left` 和 `right` 都指向它，其实也能过，但显式特判更清楚）。
- ✅ 手推 $n=1,2,3,4$ 四种长度，快慢指针的落点问题就再也不会错了。

---

# 5 小结

## 5.1 六道题的复杂度总表

| 题号 | 最优解法 | 时间 | 额外空间 | 一句话技巧 |
| :--- | :--- | :--- | :--- | :--- |
| E160 相交链表 | 双指针换道 | $O(m+n)$ | $O(1)$ | 走完自己走对面，路程必然相等 |
| E206 反转链表 | 三指针迭代 | $O(n)$ | $O(1)$ | 断链前先存后继 |
| M1472 浏览器历史 | 双链表（数组更优） | 单次 $O(\text{steps})$ | $O(n)$ | `prev` 买来的就是「能往回走」 |
| M146 LRU 缓存 | 哈希表 + 双链表 | 均摊 $O(1)$ | $O(\text{capacity})$ | 哈希补上「定位」，链表的 $O(1)$ 才兑现 |
| E21 合并有序链表 | 哨兵 + 归并 | $O(m+n)$ | $O(1)$ | 剩余段整体挂上，$O(1)$ |
| E234 回文链表 | 快慢指针 + 反转 | $O(n)$ | $O(1)$ | 中点定义要靠手推确认 |

## 5.2 五个必须形成肌肉记忆的模板

```python
# 1. 哨兵（虚拟头结点）—— 表头可能变化时一律用它
dummy = ListNode(0, head); ...; return dummy.next

# 2. 三指针反转 —— E206 / E234 / M92 / T25 都在用
prev, curr = None, head
while curr:
    nxt = curr.next; curr.next = prev; prev = curr; curr = nxt

# 3. 快慢指针找中点 —— E234 / E876 / M148
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next

# 4. 快慢指针判环 —— E141 / M142（Floyd 判圈）
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
    if slow is fast: return True

# 5. 双指针换道对齐 —— E160 / M142 求环入口
pA, pB = headA, headB
while pA is not pB:
    pA = pA.next if pA else headB
    pB = pB.next if pB else headA
```

## 5.3 回到 CH02 的那张表

做完这 6 题，再读一遍课件 2.4 的取舍原则，应该有不一样的体会：

> 1. **不要使用顺序表的场合**：经常插入 / 删除内部元素时不宜使用顺序表——平均情况下需要移动表中一半的元素。此外，无法确定线性表长度的最大值时也不宜采用。
> 2. **不要使用链表的场合**：经常按位置访问、而且按位读比插删频繁时不宜使用链表——顺链扫描比按下标读元素费时。此外，指针本身的存储开销也要考虑。

- **M1472** 属于第 2 条：`back(steps)` 是按位置跳，数组完胜。
- **M146** 属于第 1 条：每次访问都要把元素挪到最前面，数组要搬一半元素，链表只改 4 根指针。
- **E21 / E234** 说明链表的另一个优势：**只改链接、不搬数据、不额外分配**，所以能做到 $O(1)$ 额外空间。

**一句话**：选顺序表还是链表，不看「哪个更高级」，只看**你的高频操作到底是「按位置读」还是「已知结点改」**。

## 5.4 提交前的自检清单

- [ ] 空表（`head is None`）走通了吗？
- [ ] 只有一个结点呢？两个呢？
- [ ] 有没有在断链之前忘记保存后继？
- [ ] 返回的是新表头（`prev` / `dummy.next` / `newHead`）还是旧的 `head`？
- [ ] 有没有制造出环（改完 `a.next = b` 后 `b.next` 是否还指着 `a`）？
- [ ] 比较结点用的是 `is` / 指针，还是误用了 `.val`？
- [ ] C++：`new` 出来的都 `delete` 了吗？持有裸指针的类禁用拷贝了吗（三法则）？
- [ ] Python：递归深度会不会超（$n > 1000$ 时）？

---

# 6 课后拓展（自选，不计入作业）

按难度递增，都是同一批模板的变体：

| 题号 | 名称 | 复用的模板 |
| :--- | :--- | :--- |
| E141 | [环形链表](https://leetcode.cn/problems/linked-list-cycle/) | 模板 4 |
| E876 | [链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/) | 模板 3 |
| E203 | [移除链表元素](https://leetcode.cn/problems/remove-linked-list-elements/) | 模板 1（哨兵） |
| E83 | [删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/) | 单指针扫描 |
| M142 | [环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/) | 模板 4 + 数学证明（和 E160 同一套推导） |
| M19 | [删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) | 模板 1 + 快慢指针错开 N 步 |
| M2 | [两数相加](https://leetcode.cn/problems/add-two-numbers/) | 模板 1 + 进位 |
| M24 | [两两交换链表中的结点](https://leetcode.cn/problems/swap-nodes-in-pairs/) | 模板 1 + 模板 2 |
| M148 | [排序链表](https://leetcode.cn/problems/sort-list/) | 模板 3 + E21 的 merge |
| M92 | [反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/) | 模板 1 + 模板 2 |
| M430 | [扁平化多级双向链表](https://leetcode.cn/problems/flatten-a-multilevel-doubly-linked-list/) | 双链表 + 栈 |
| T25 | [K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/) | 模板 1 + 模板 2，链表题的集大成者 |
| T23 | [合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/) | E21 + 堆 / 分治（第 6 章预告） |

> **M142 环形链表 II** 特别推荐：它的证明和 E160 的双指针证明是**同一类**（都是「两个指针走过的路程列方程」），做完这两题，后面遇到的绝大多数双指针证明都能自己推出来。

---

# 附录 A 本地调试脚手架

LeetCode 上只能提交 `Solution` 类，本地想跑起来需要自己造链表。建议把下面两段存成文件，以后所有链表题直接复用。

## A.1 Python

```python
import sys
sys.setrecursionlimit(1 << 20)      # 链表递归题必备


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build(values):
    """由列表造链表，返回头结点"""
    dummy = ListNode(0)
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


def to_list(head, limit=100):
    """链表转列表；limit 用于防止成环时死循环"""
    out = []
    while head and len(out) < limit:
        out.append(head.val)
        head = head.next
    return out


def build_intersect(a, b, common):
    """为 E160 造两条共享尾部的链表，返回 (headA, headB, 交点)"""
    tail = build(common)

    def attach(prefix):
        head = build(prefix)
        if head is None:       # 前缀为空时，整条链就是公共段
            return tail
        p = head
        while p.next:
            p = p.next
        p.next = tail
        return head

    return attach(a), attach(b), tail


if __name__ == "__main__":
    # E206
    print(to_list(Solution().reverseList(build([1, 2, 3, 4, 5]))))   # [5,4,3,2,1]
    # E21
    print(to_list(Solution().mergeTwoLists(build([1, 2, 4]), build([1, 3, 4]))))
    # E234
    print(Solution().isPalindrome(build([1, 2, 2, 1])))              # True
    print(Solution().isPalindrome(build([1, 2])))                    # False
    # E160
    ha, hb, want = build_intersect([4, 1], [5, 6, 1], [8, 4, 5])
    print(Solution().getIntersectionNode(ha, hb) is want)            # True
```

## A.2 C++

```cpp
#include <iostream>
#include <list>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* build(const std::vector<int>& values) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int v : values) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy.next;
}

void printList(ListNode* head, int limit = 100) {
    int count = 0;
    for (ListNode* p = head; p != nullptr && count < limit; p = p->next, ++count) {
        std::cout << (count ? " " : "") << p->val;
    }
    std::cout << '\n';
}

void freeList(ListNode* head) {
    while (head != nullptr) {
        ListNode* dying = head;
        head = head->next;      // 先记后继，再释放
        delete dying;
    }
}

// ... 把某一题的 class Solution 粘到这里 ...

int main() {
    Solution sol;
    printList(sol.reverseList(build({1, 2, 3, 4, 5})));   // 5 4 3 2 1
    return 0;
}
```

编译建议（和课件 `tools/check_code.py` 用的是同一档）：

```bash
# 开发档：开满警告 + 地址/未定义行为检查，能当场抓出「读已释放内存」「泄漏」
g++ -std=c++17 -Wall -Wextra -Werror -g -fsanitize=address,undefined main.cpp -o main && ./main

# 发布档：看真实性能
g++ -std=c++17 -O2 main.cpp -o main && ./main
```

> 强烈建议本地用 **ASan 档**跑一遍 M1472 和 M146 的手写版：忘记 `delete`、`delete` 之后又读指针，这两类错误在 LeetCode 上可能照样 AC，但 ASan 会当场报出来。这是 CH02「三法则」那一节最值钱的实践部分。

---

# 附录 B 参考资料

- 教材：[GMyhf/dsa-modernization](https://gmyhf.github.io/dsa-modernization/) 第 1 章（概论：ADT、渐进分析）、第 2 章（线性表）
- 本仓库：`DSA_CH01_Overview_ADT_Complexity.pdf`、`DSA_CH02_Linear_List.pdf`
- 往期讲义：`2026spring-cs201/202603_DSA_W04-5.5_Complexity_LinearStructures.md`（第 3 节「链表」，含循环链表与更多示例）
- 上学期同类题解：`ref/DSA_MOOC_solution.md`
- 刷题方法论：`book/LeetCode 101 - A Grinding Guide.pdf`
- 题解站：https://fuynaloft.github.io/sol101/
- 每日选作：`DSA_problem_list_at_2026fall.md`
