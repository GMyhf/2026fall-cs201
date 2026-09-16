# DSA Assignment #2: 线性表 & 链表

*Updated: 2026-09-16 11:05 (GMT+8)*  
*完成学生：<mark>同学的姓名、院系</mark>*



>**说明：**
>
>截止日期：前三周作业统一于 9月29日 提交至 Canvas 平台。
>
>内容要求：每个题目包含：**解题思路**（可选）、**源代码**、**Accepted 截图**、**预估耗时**（可选）。
>
>本次作业对应教材 [dsa-modernization](https://gmyhf.github.io/dsa-modernization/) 第 1～2 章（概论、线性表）。**Python 代码必做，C++ 代码选做**（教材是「Python 讲算法，C++ 讲实现」，鼓励至少挑 1～2 题用 C++ 再写一遍）。
>
>配套讲义：[习题课：链表 6 题](../202609_DSA_CH01-02_LinkedList_Exercises.md)。**建议先自己做，卡住 20 分钟以上再看讲义。**



## 1. 题目

### E160.相交链表

hash table, linked list, two pointers, https://leetcode.cn/problems/intersection-of-two-linked-lists/

> 至少写出哈希表法；进阶要求 $O(1)$ 空间。**请在思路里写清楚双指针法为什么正确**（设两条链独有部分长 $a$、$b$，公共部分长 $c$，算一算两个指针各走了多少步）。
>
> 注意：判断相交要比「是不是同一个结点」，不是比 `val`。

思路：



预估耗时：



代码

```python

```



C++代码（选做）

```cpp

```



代码运行截图 <mark>（至少包含有"Accepted"）</mark>





### E206.反转链表

recursion, linked list, https://leetcode.cn/problems/reverse-linked-list/

> **迭代法和递归法都要写。** 递归版注意两点：`head.next.next = head` 之后必须 `head.next = None`（否则成环）；本地跑 $n=5000$ 时要 `sys.setrecursionlimit()`。

思路：



预估耗时：



代码（迭代）

```python

```



代码（递归）

```python

```



C++代码（选做）

```cpp

```



代码运行截图 <mark>（至少包含有"Accepted"）</mark>





### M1472.设计浏览器历史记录

doubly-linked list, design, https://leetcode.cn/problems/design-browser-history/

> 用**双向链表**实现（这是本题的练习目的）。注意 `visit` 之后要把「前进」方向的历史切断。
>
> **思考题（写在思路里）**：本题如果改用顺序表（数组 + 下标）实现，`back(steps)` / `forward(steps)` 的复杂度会变成多少？结合教材 2.4 节「不要使用链表的场合」说说哪种实现更适合这道题。

思路：



预估耗时：



代码

```python

```



C++代码（选做）

```cpp

```



代码运行截图 <mark>（至少包含有"Accepted"）</mark>





### M146.LRU缓存

hash table, doubly-linked list, design, https://leetcode.cn/problems/lru-cache/

> 本次作业的重点题。要求 `get` 和 `put` 均为**平均 $O(1)$**，请**手写哈希表 + 双向链表**，先不要直接用 `OrderedDict` / `std::list`（写完之后可以再用库实现对照一遍）。
>
> 两个最常见的坑：① 链表结点里要存 `key`，否则淘汰时删不掉哈希表里那一项；② 淘汰时链表和哈希表必须同步删。

思路：



预估耗时：



代码

```python

```



C++代码（选做）

```cpp

```



代码运行截图 <mark>（至少包含有"Accepted"）</mark>





### E21.合并两个有序链表

linked list, recursion, https://leetcode.cn/problems/merge-two-sorted-lists/

> 用**虚拟头结点（dummy）**，体会它是怎么把「结果表还是空的」这个分支省掉的——对应教材 2.3.1 节的「头结点」。
>
> 题目要求是**拼接**已有结点，不需要 `new` 新结点。

思路：



预估耗时：



代码

```python

```



C++代码（选做）

```cpp

```



代码运行截图 <mark>（至少包含有"Accepted"）</mark>





### E234.回文链表

linked list, two pointers, https://leetcode.cn/problems/palindrome-linked-list/

> 进阶要求 $O(n)$ 时间、$O(1)$ 空间：**快慢指针找中点 + 反转后半段 + 逐个比较**。
>
> 请在思路里说明：链表长度为**奇数**和**偶数**时，快慢指针结束后 `slow` 分别停在第几个结点上（建议用 $n = 1,2,3,4$ 手推一遍）。

思路：



预估耗时：



代码

```python

```



C++代码（选做）

```cpp

```



代码运行截图 <mark>（至少包含有"Accepted"）</mark>





## 2. 学习总结和收获

<mark>如果作业题目简单，有否额外练习题目，比如：OJ“数算2026fall每日选做”、CF、LeetCode、洛谷等网站题目。</mark>

可选的链表拓展题（讲义第 6 节有完整清单）：E141 环形链表、E876 链表的中间结点、M19 删除链表的倒数第 N 个结点、M142 环形链表 II、M2 两数相加、M148 排序链表、T25 K 个一组翻转链表。
