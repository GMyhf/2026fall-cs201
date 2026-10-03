# 第三章作业 参考答案

## 1 支持 $O(1)$ `getMax` 的栈

> 最经典对应题： 力扣 155. 最小栈 (Min Stack)
>
> - 说明：力扣 155 题要求实现 getMin()，其核心考察点、辅助栈/辅助变量思路以及操作接口（push, pop, top, getMin）与本题完全对称（只需将比较逻辑由最小值改为最大值）。
>
> 直接同名题（会员题）： 力扣 716. 最大栈 (Max Stack) 
>
> - 说明： 题意完全对应“最大栈”，不过力扣 716 额外增加了一个要求从栈中任意位置弹出最大值的 popMax() 操作。

**M155.最小栈**

https://leetcode.cn/problems/min-stack/

这道题是栈结构非常经典的考题。

### 方法一：辅助栈（双栈法）

如果只用一个变量 `min_val` 来记录最小值，当这个最小值被 `pop()` 弹出后，我们无法在 $O(1)$ 时间内知道**次小值**（即上一个状态下的最小值）是多少。

因此，我们需要记录**状态历史**：
1. **主数据栈 `st`**：正常存放所有压入的元素。
2. **辅助最小栈 `min_st`**：栈顶始终保存当前主栈中所有元素的**最小值**。
   - 每次压入元素 `val` 时，辅助栈压入 `min(val, min_st.top())`。
   - 每次弹出时，两个栈同步弹出。
   - `getMin()` 时，直接返回 `min_st.top()` 即可。

---

**C++ 代码实现**

```cpp
#include <stack>
#include <algorithm>

class MinStack {
private:
    std::stack<int> st;      // 主栈：存储所有元素
    std::stack<int> min_st;  // 辅助栈：栈顶始终是当前栈内的最小值

public:
    MinStack() {
        
    }
    
    void push(int value) {
        st.push(value);
        // 如果辅助栈为空，当前元素就是最小值；
        // 否则将 value 与当前的最小值比较，压入较小者
        if (min_st.empty() || value < min_st.top()) {
            min_st.push(value);
        } else {
            min_st.push(min_st.top());
        }
    }
    
    void pop() {
        // 两个栈同步弹出
        st.pop();
        min_st.pop();
    }
    
    int top() {
        return st.top();
    }
    
    int getMin() {
        return min_st.top();
    }
};

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack* obj = new MinStack();
 * obj->push(value);
 * obj->pop();
 * int param_3 = obj->top();
 * int param_4 = obj->getMin();
 */
```

---

### 方法二：单栈存 `std::pair`

如果你希望只使用一个栈容器，可以将元素和当前最小值打包存储：

```cpp
#include <stack>
#include <algorithm>

class MinStack {
private:
    // pair.first: 元素值, pair.second: 当前时刻的最小值
    std::stack<std::pair<int, int>> st;

public:
    MinStack() {}
    
    void push(int value) {
        if (st.empty()) {
            st.push({value, value});
        } else {
            st.push({value, std::min(value, st.top().second)});
        }
    }
    
    void pop() {
        st.pop();
    }
    
    int top() {
        return st.top().first;
    }
    
    int getMin() {
        return st.top().second;
    }
};
```

---

**复杂度分析**

- **时间复杂度**：
  - `push`：$O(1)$
  - `pop`：$O(1)$
  - `top`：$O(1)$
  - `getMin`：$O(1)$
  每个操作都只涉及常数次栈操作。
- **空间复杂度**：$O(N)$，其中 $N$ 是栈中元素的个数。辅助栈（或 pair）消耗了与主栈同等规模的额外空间。

> **注**：如果要实现**最大栈 (MaxStack)** 的 `getMax()`，逻辑完全一致，只需在 `push` 时将 `std::min(...)` 换成 `std::max(...)` 即可。

---

## 2 合法括号序列的计数（Catalan 数）

**M22.括号生成**

https://leetcode.cn/problems/generate-parentheses/



### 方法一：回溯（Backtracking）与深度优先搜索（DFS）

> 这道题是一道经典的回溯（Backtracking）与深度优先搜索（DFS）问题。
>
> **解题思路**
>
> 可以通过一步步添加括号来构造出合法的括号序列。在每一步选择中，必须遵循以下两条规则，以确保最终生成的括号组合是**有效**的：
>
> 1. **添加左括号 `'('`**：只要当前左括号的数量还没有达到 `n`，就可以继续添加左括号。
> 2. **添加右括号 `')'`**：只有当当前右括号的数量**小于**左括号的数量时，才能添加右括号，否则就会出现右括号多于左括号的不合法情况。
> 3. **终止条件**：当当前构建的字符串长度达到 `2 * n` 时，说明一组完整的有效括号组合已经生成完毕，将其加入结果集中。
>
> **C++ 代码实现**
>
> ```cpp
> class Solution {
> public:
>     vector<string> generateParenthesis(int n) {
>         vector<string> result;
>         string current;
>         backtrack(n, 0, 0, current, result);
>         return result;
>     }
> 
> private:
>     void backtrack(int n, int open, int close, string& current, vector<string>& result) {
>         // 当字符串长度达到 2 * n 时，说明已经生成了一个合法的括号组合
>         if (current.length() == 2 * n) {
>             result.push_back(current);
>             return;
>         }
> 
>         // 如果左括号数量小于 n，可以继续添加左括号
>         if (open < n) {
>             current.push_back('(');
>             backtrack(n, open + 1, close, current, result);
>             current.pop_back(); // 回溯
>         }
> 
>         // 如果右括号数量小于左括号数量，可以添加右括号
>         if (close < open) {
>             current.push_back(')');
>             backtrack(n, open, close + 1, current, result);
>             current.pop_back(); // 回溯
>         }
>     }
> };
> ```
>
> **复杂度分析**
>
> - **时间复杂度**：$O(\frac{4^n}{\sqrt{n}})$。合法的括号序列数量为第 $n$ 个卡特兰数（Catalan number）$C_n = \frac{1}{n+1} \binom{2n}{n} \approx \frac{4^n}{n\sqrt{\pi n}}$。每个解生成需要 $O(n)$ 的时间复制到答案中，因此总时间复杂度渐进为 $O(\frac{4^n}{\sqrt{n}})$。
> - **空间复杂度**：$O(n)$。递归调用栈的最大深度为 $2n$，临时字符串 `current` 的长度也是 $2n$（不计保存返回结果所需的空间）。



### 方法二：递推法

长度为 $2n$ 的合法括号序列个数为第 $n$ 个 **Catalan 数** $C_n$。

**递推关系：** 考虑合法序列的第一个字符，它一定是 `(`。设与它匹配的 `)` 在第 $2k+2$ 位（$0 \le k \le n-1$），则序列被唯一地分成

$$
(\ \underbrace{A}_{k\ \text{对}}\ )\ \underbrace{B}_{n-1-k\ \text{对}}
$$

其中 $A$、$B$ 各自都是合法序列，且可以独立选取。于是

$$
C_n = \sum_{k=0}^{n-1} C_k\, C_{n-1-k} \quad (n \ge 1).
$$

**初始条件：** $C_0 = 1$（空串是唯一的合法序列）。

**通项公式：**

$$
C_n = \frac{1}{n+1}\binom{2n}{n} = \binom{2n}{n} - \binom{2n}{n+1}.
$$



> 这段数学解读**非常经典、严谨且优美**！它从**结构分解（递推）**和**组合对称性（反射法）**两个最核心的数学视角，彻底讲透了卡特兰数与合法括号序列的本质联系。
>
> 针对你的解读，可以从以下三个维度做进一步的延展与呼应：
>
> ---
>
> **1. 从递推式直接映射出第二种解法：分治 / 动态规划（DP）**
>
> 你在解读中提到的唯一分解式：
> $$(\ \underbrace{A}_{k\ \text{对}}\ )\ \underbrace{B}_{n-1-k\ \text{对}}$$
>
> 这个分解不仅解释了递推式 $C_n = \sum_{k=0}^{n-1} C_k C_{n-1-k}$，更绝妙的是——**它本身就是一种极其漂亮的“自顶向下递归”或“自底向上DP”的生成算法**。
>
> 因为对于每一个固定的 $k$，与第一个 `(` 匹配的 `)` 的位置是**唯一确定**的，所以枚举所有的 $k$，所得到的括号串集合是**互不重叠且完全覆盖**的，不需要任何去重操作。
>
> **对应的 DP 代码实现：**
>
> ```cpp
> class Solution {
> public:
>     vector<string> generateParenthesis(int n) {
>         // dp[i] 存储 i 对括号的所有合法序列
>         vector<vector<string>> dp(n + 1);
>         dp[0] = {""}; // C_0 = 1，空串
> 
>         for (int i = 1; i <= n; ++i) {
>             for (int k = 0; k < i; ++k) {
>                 // 根据 (A)B 的结构进行拼接
>                 // A 来自 dp[k]，B 来自 dp[i - 1 - k]
>                 for (const string& A : dp[k]) {
>                     for (const string& B : dp[i - 1 - k]) {
>                         dp[i].push_back("(" + A + ")" + B);
>                     }
>                 }
>             }
>         }
>         return dp[n];
>     }
> };
> ```
>
> > **对比回溯法**：
> >
> > - **回溯法**是“在状态树上做深度优先遍历”，空间开销仅为栈深度 $O(n)$。
> > - **DP法**直接具象化了数学递推式，在需要利用已求得子问题时极其直观。



### 方法三：推导法

**推导（反射法）：** $n$ 个 `(`、$n$ 个 `)` 的所有排列共 $\binom{2n}{n}$ 种。对不合法序列，找到第一个"右括号比左括号多 1"的前缀位置，把该位置之后的所有括号左右翻转，得到一个含 $n+1$ 个 `)`、$n-1$ 个 `(` 的序列；这个变换是一一对应的（反过来，任何含 $n+1$ 个 `)` 的序列都一定有这样的前缀，可以翻转回去）。所以不合法序列恰有 $\binom{2n}{n+1}$ 个，合法序列数为 $\binom{2n}{n} - \binom{2n}{n+1} = \frac{1}{n+1}\binom{2n}{n}$。

前几项：$C_0 = 1, C_1 = 1, C_2 = 2, C_3 = 5, C_4 = 14, C_5 = 42$。

**$n = 3$ 时的全部合法序列（共 $C_3 = 5$ 个）：**

```text
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```

验证：$C_3 = C_0C_2 + C_1C_1 + C_2C_0 = 2 + 1 + 2 = 5 = \frac14\binom63 = \frac{20}{4}$。

---

## 3 浏览器的"后退 / 前进"

**M1472.设计浏览器历史记录**

https://leetcode.cn/problems/design-browser-history/



### 方法一：动态数组

> 这道题可以用 **动态数组（`std::vector`）+ 指针（下标）** 来实现，非常直观且高效。
>
> **解题思路**
>
> 1. **数据结构**：
>    - 使用一个数组 `history` 存储所有浏览过的 URL。
>    - 使用一个整数 `curr` 记录当前浏览页面的下标。
>
> 2. **具体操作**：
>    - **`BrowserHistory(string homepage)`**：
>      - 将 `homepage` 存入 `history`，当前位置 `curr` 设为 `0`。
>    - **`visit(string url)`**：
>      - 题目要求“把浏览历史前进的记录全部删除”，因此我们需要截断当前下标 `curr` 之后的所有历史记录，即保留 `0` 到 `curr` 的部分。
>      - 将新的 `url` 加入数组末尾，并将 `curr` 前移一位指向新页面。
>    - **`back(int steps)`**：
>      - 最多后退到最开始的网页（下标 `0`），因此新的位置为 `max(0, curr - steps)`。
>      - 更新 `curr` 并返回 `history[curr]`。
>    - **`forward(int steps)`**：
>      - 最多前进到当前历史的最末尾（下标 `history.size() - 1`），因此新的位置为 `min((int)history.size() - 1, curr + steps)`。
>      - 更新 `curr` 并返回 `history[curr]`。
>
> ---
>
> **代码实现**
>
> ```cpp
> #include <vector>
> #include <string>
> #include <algorithm>
> 
> using namespace std;
> 
> class BrowserHistory {
> private:
>     vector<string> history;
>     int curr;
> 
> public:
>     BrowserHistory(string homepage) {
>         history.push_back(homepage);
>         curr = 0;
>     }
>     
>     void visit(string url) {
>         // 清空当前页面之后的前进记录
>         history.resize(curr + 1);
>         history.push_back(url);
>         curr++;
>     }
>     
>     string back(int steps) {
>         // 最多后退到下标 0
>         curr = max(0, curr - steps);
>         return history[curr];
>     }
>     
>     string forward(int steps) {
>         // 最多前进到当前有效历史的末尾
>         curr = min((int)history.size() - 1, curr + steps);
>         return history[curr];
>     }
> };
> 
> /**
>  * Your BrowserHistory object will be instantiated and called as such:
>  * BrowserHistory* obj = new BrowserHistory(homepage);
>  * obj->visit(url);
>  * string param_2 = obj->back(steps);
>  * string param_3 = obj->forward(steps);
>  */
> ```
>
> ---
>
> **复杂度分析**
>
> - **时间复杂度**：
>   - `BrowserHistory`：$O(1)$
>   - `visit`：均摊 $O(1)$，`resize` 和 `push_back` 的均摊时间开销为常数级别。
>   - `back`：$O(1)$，仅做下标计算与访问。
>   - `forward`：$O(1)$，仅做下标计算与访问。
> - **空间复杂度**：$O(N)$，其中 $N$ 为执行 `visit` 的操作次数，最多占用 $O(N)$ 的空间保存字符串。



### 方法二：双向链表

> 
>
> ```cpp
> class BrowserHistory {
> private:
>     struct DNode {
>         string url;
>         DNode* prev = nullptr;
>         DNode* next = nullptr;
>         explicit DNode(string u) : url(move(u)) {}
>     };
> 
>     DNode* current_;
> 
>     // 释放 node 及其后的全部结点
>     static void freeForward(DNode* node) {
>         while (node != nullptr) {
>             DNode* dying = node;
>             node = node->next; // 必须先记下后继，再 delete
>             delete dying;
>         }
>     }
> 
> public:
>     BrowserHistory(string homepage)
>         : current_(new DNode(move(homepage))) {}
> 
>     ~BrowserHistory() {
>         // 先回退到链表头部，再一并释放
>         while (current_->prev != nullptr) {
>             current_ = current_->prev;
>         }
>         freeForward(current_);
>     }
> 
>     // 禁止拷贝（三法则）
>     BrowserHistory(const BrowserHistory&) = delete;
>     BrowserHistory& operator=(const BrowserHistory&) = delete;
> 
>     void visit(string url) {
>         freeForward(current_->next); // 丢弃并释放前进历史
>         DNode* node = new DNode(move(url));
>         current_->next = node;
>         node->prev = current_;
>         current_ = node;
>     }
> 
>     string back(int steps) {
>         while (steps > 0 && current_->prev != nullptr) {
>             current_ = current_->prev;
>             --steps;
>         }
>         return current_->url;
>     }
> 
>     string forward(int steps) {
>         while (steps > 0 && current_->next != nullptr) {
>             current_ = current_->next;
>             --steps;
>         }
>         return current_->url;
>     }
> };
> 
> /**
>  * Your BrowserHistory object will be instantiated and called as such:
>  * BrowserHistory* obj = new BrowserHistory(homepage);
>  * obj->visit(url);
>  * string param_2 = obj->back(steps);
>  * string param_3 = obj->forward(steps);
>  */
> ```
>
> 基于**双向链表（Doubly Linked List）**的手动内存管理实现在工程严谨性上写得**非常出色**：
>
> **亮点评价**
>
> 1. **内存安全**：
>    - 析构函数中先安全回溯到链表头部再整链释放，避免了内存泄漏。
>    - `freeForward` 循环中先记录 `node->next` 再 `delete dying`，避免了 `use-after-free`。
>    - 在 `visit` 时主动释放了被覆盖的前进历史结点。
> 2. **现代 C++ 规范（Rule of Three / Five）**：
>    - 显式声明了 `delete` 拷贝构造和拷贝赋值，防止指针浅拷贝导致的悬空指针（Dangling Pointer）和重复释放（Double Free）。
> 3. **移动语义**：
>    - 构造参数使用了 `std::move`，减少不必要的 `std::string` 深拷贝。
>
> ---
>
> *(注意：如果允许 `current_` 为 `nullptr`，析构函数需要加上 `if (current_ != nullptr)` 防御)*。
>
> ---
>
> ### 与 `std::vector` 实现的对比（设计取舍）
>
> | 维度                        | 双向链表（当前实现）                                         | 动态数组（`vector`）               |
> | :-------------------------- | :----------------------------------------------------------- | :--------------------------------- |
> | **`back` / `forward` 时间** | $O(\text{steps})$：需要逐结点遍历                            | **$O(1)$**：直接下标跳转           |
> | **`visit` 时间**            | $O(K)$：需要遍历释放 $K$ 个废弃结点                          | 均摊 $O(1)$：只需调整下标/`resize` |
> | **内存连续性（Cache）**     | 较差：结点离散分配于堆上，易 Cache Miss                      | 极好：连续内存，CPU 缓存命中率高   |
> | **内存开销**                | 额外需要维护两个指针（每个结点 16 字节开销）                 | 仅数组自身的动态扩容开销           |
> | **适用场景**                | 适合真实的浏览器/通用软件架构（结点可能承载 DOM、页面快照、生命周期钩子等复杂对象） | 适合纯算法题目、海量轻量级访问记录 |
>
> 在实际工程面试中，能写出这样一份指针操作清晰、内存管理完备的双向链表代码，是衡量 C++ 基本功的绝佳体现！
>
> 



### 方法三：双栈

**1. 用 `push`、`pop`、`empty` 描述三个操作：**

```text
visit(p):
    push(Back, current)
    current ← p
    while not empty(Forward):     // 访问新页面后，原有"前进"历史作废
        pop(Forward)

back():
    if not empty(Back):
        push(Forward, current)
        current ← pop(Back)

forward():
    if not empty(Forward):
        push(Back, current)
        current ← pop(Forward)
```

**2. 执行过程**（栈均从栈底写到栈顶）：

| 操作 | current | Back | Forward |
|---|---|---|---|
| 初始 | Home | 空 | 空 |
| `visit(A)` | A | Home | 空 |
| `visit(B)` | B | Home, A | 空 |
| `back()` | A | Home | B |
| `visit(C)` | C | Home, A | 空（B 被清除） |
| `back()` | A | Home | C |
| `forward()` | C | Home, A | 空 |
| `back()` | A | Home | C |

**最终结果：** `current = A`；`Back` 从栈底到栈顶为 `Home`；`Forward` 从栈底到栈顶为 `C`。

---

## 4 用两个栈实现队列

**E232.用栈实现队列**

https://leetcode.cn/problems/implement-queue-using-stacks/



> 这道题可以通过维护 **两个栈** 来实现队列（先进先出 FIFO）：
>
> **解题思路**
>
> 1. **双栈分工**：
>    - **输入栈 `inStack`**：专门负责处理入队操作 `push`。
>    - **输出栈 `outStack`**：专门负责处理出队操作 `pop` 和查看队首操作 `peek`。
>
> 2. **操作过程**：
>    - **`push(x)`**：直接将元素压入 `inStack`。
>    - **`pop()` / `peek()`**：
>      - 如果 `outStack` 为空，说明之前的元素都还在 `inStack` 中。此时将 `inStack` 中的元素**全部逐一弹出并压入 `outStack`**。这样原本“后入先出”的元素在经历一次翻转后，在 `outStack` 顶部就变成了“最先进入的元素”（即队首）。
>      - 如果 `outStack` 不为空，直接操作 `outStack` 栈顶即可。
>    - **`empty()`**：当且仅当 `inStack` 和 `outStack` **均为空**时，队列才为空。
>
> **复杂度分析**
>
> - **时间复杂度**：
>   - `push`：$O(1)$。
>   - `pop` / `peek`：**均摊时间复杂度为 $O(1)$**。虽然在 `outStack` 为空时需要转移元素（单次最坏 $O(n)$），但每个元素最多只会被转移一次（入 `inStack` 一次，出 `inStack` 一次，入 `outStack` 一次，出 `outStack` 一次），因此 $n$ 次操作的总时间复杂度为 $O(n)$。
>   - `empty`：$O(1)$。
> - **空间复杂度**：$O(n)$，使用两个栈存储所有元素。
>
> ---
>
> C++ **代码实现**
>
> ```cpp
> #include <stack>
> 
> class MyQueue {
> private:
>     std::stack<int> inStack;   // 负责入队
>     std::stack<int> outStack;  // 负责出队和查看队头
> 
>     // 辅助函数：当 outStack 为空时，将 inStack 的所有元素倒入 outStack
>     void inToOut() {
>         if (outStack.empty()) {
>             while (!inStack.empty()) {
>                 outStack.push(inStack.top());
>                 inStack.pop();
>             }
>         }
>     }
> 
> public:
>     MyQueue() {
> 
>     }
>     
>     // 将元素 x 推到队列的末尾
>     void push(int x) {
>         inStack.push(x);
>     }
>     
>     // 从队列的开头移除并返回元素
>     int pop() {
>         inToOut();
>         int topVal = outStack.top();
>         outStack.pop();
>         return topVal;
>     }
>     
>     // 返回队列开头的元素
>     int peek() {
>         inToOut();
>         return outStack.top();
>     }
>     
>     // 如果队列为空，返回 true ；否则，返回 false
>     bool empty() {
>         return inStack.empty() && outStack.empty();
>     }
> };
> 
> /**
>  * Your MyQueue object will be instantiated and called as such:
>  * MyQueue* obj = new MyQueue();
>  * obj->push(x);
>  * int param_2 = obj->pop();
>  * int param_3 = obj->peek();
>  * bool param_4 = obj->empty();
>  */
> ```
>
> 



**1. 两个栈的分工与伪代码**

- `S1`：**入队栈**，新元素都压入 `S1`，栈顶是最新入队的元素。
- `S2`：**出队栈**，栈顶是当前队首。只有 `S2` 为空时，才把 `S1` 的元素全部依次弹出并压入 `S2`，这样顺序正好反转，最早入队的元素到了 `S2` 栈顶。

队列中的元素从队首到队尾为：`S2` 从栈顶到栈底，接着 `S1` 从栈底到栈顶。

```text
enQueue(x):
    push(S1, x)

deQueue():
    if isEmpty(S2):
        while not isEmpty(S1):
            push(S2, pop(S1))
    return pop(S2)                 // 若此时 S2 仍为空，则队列为空，出错

isEmpty():
    return isEmpty(S1) and isEmpty(S2)
```

注意：`S2` 非空时**不能**把 `S1` 倒进去，否则新元素会压在旧元素上面，破坏先进先出的顺序。

**2. 时间复杂度**

- `enQueue`：最坏 $O(1)$。
- `isEmpty`：最坏 $O(1)$。
- `deQueue`：最坏 $O(n)$。当 `S2` 为空而 `S1` 中有 $n$ 个元素时，需要把 $n$ 个元素全部倒入 `S2`。

**均摊分析：** 每个元素一生中最多被 `push(S1)`、`pop(S1)`、`push(S2)`、`pop(S2)` 各一次，共 4 次栈操作。因此任意 $m$ 次队列操作的总时间为 $O(m)$，每次操作的**均摊**时间为 $O(1)$。

**3. 执行过程**（栈从栈底写到栈顶）：

| 操作 | S1 | S2 | 返回值 |
|---|---|---|---|
| `enQueue(5)` | 5 | 空 | |
| `enQueue(8)` | 5, 8 | 空 | |
| `deQueue()` | 空 | 8, 5 → 弹出 5 → 8 | **5** |
| `enQueue(2)` | 2 | 8 | |
| `enQueue(7)` | 2, 7 | 8 | |
| `deQueue()` | 2, 7 | 空 | **8** |
| `deQueue()` | 空 | 7, 2 → 弹出 2 → 7 | **2** |

**结果：** 三次 `deQueue()` 依次返回 **5、8、2**；结束后队列中只剩 **7**（从队首到队尾：`7`），它在 `S2` 中，`S1` 为空。
