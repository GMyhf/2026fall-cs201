# 2024 数据结构与算法 A 期中考试（2024-11）参考答案

> 题面见同目录 `2024DS期中考试-parts.md`（只收集到部分题目，本答案只覆盖这些题）。
> 本答案为自行解答，非官方答案。BST 计数、并查集过程用脚本核对；
> 算法设计三题已编译（`-fsanitize=address,undefined`）并按各题末尾所述方式验证。

---

## 一、选择填空（20 分）

### 5. 满足「左子树结点数 ≥ 右子树结点数」的 BST 个数：**6**

BST 的形态一旦确定，关键码 1…5 的填法唯一（中序有序），所以只需数形态。
设 f(n) 为 n 个结点、每个结点都满足「左 ≥ 右」的形态数。根占 1 个，左右分 l + r = n − 1 且 l ≥ r：

　　f(n) = Σ_{l ≥ r, l + r = n−1} f(l)·f(r)，f(0) = f(1) = 1

| n | 合法拆分 (l, r) | f(n) |
|---|---|---|
| 2 | (1,0) | 1 |
| 3 | (1,1)：1·1；(2,0)：1 | 2 |
| 4 | (2,1)：1·1；(3,0)：2 | 3 |
| 5 | (2,2)：1·1；(3,1)：2·1；(4,0)：3 | **6** |

对应到 1…5：根为 3 的 1 棵、根为 4 的 2 棵、根为 5 的 3 棵。
（根为 1、2 时左子树结点数为 0、1，小于右子树，不合法。）

已验证：枚举 1…5 的全部 42 棵 BST，逐一检查条件，恰有 6 棵满足。

> 通过**二叉搜索树（BST）的拓扑同构性**，将一个看似需要枚举数字的题目，转化为了一个精妙的**受限动态规划（递推）问题**。
>
> 以下是对该解题过程的深度剖析与逐步解读：
>
> ---
>
> **一、 核心概念拆解**
>
> 1. **为什么不需要考虑数字的具体排列？**
>    * **BST 性质**：对于固定的一组有序关键字（如 $1 \dots n$），**只要二叉树的拓扑形态固定，结点的填法是唯一确定的**（中序遍历必然从小到大严格递增）。
>    * **结论**：求“满足条件的 BST 个数”完全等价于**“求满足条件的二叉树拓扑形态数”**。
>
> 2. **条件的递归性**：
>    * 题目要求“每个结点的左子树结点数 $\ge$ 右子树结点数”。
>    * 这意味着该性质是**遗传/递归**的：不仅整棵树的根结点要满足 $l \ge r$，其左子树和右子树内部的每一个子结点，也必须同样满足“左子树 $\ge$ 右子树”。
>
> ---
>
> **二、 递推数学模型的建立**
>
> 经典的无约束二叉树形态计数是**卡特兰数（Catalan Number）**：
> $$C_n = \sum_{l=0}^{n-1} C_l \cdot C_{n-1-l}$$
>
> 而在本题中，增加了偏序约束 $l \ge r$，因此求和范围被“剪枝”了一半以上，递推式变为：
> $$f(n) = \sum_{\substack{l + r = n - 1 \\ l \ge r}} f(l) \cdot f(r)$$
>
> * **边界条件**：
>   * $f(0) = 1$（空树视为合法状态）
>   * $f(1) = 1$（单个叶子结点，左=0，右=0，满足 $0 \ge 0$）
>
> ---
>
> **三、 逐步推导过程还原**
>
> * **$n = 2$**（剩余 $1$ 个结点分配给左右）：
>   * 唯一拆分：$(l, r) = (1, 0)$
>   * $f(2) = f(1) \cdot f(0) = 1 \times 1 = 1$
>   * *(形态：根结点仅带有 1 个左孩子)*
>
> * **$n = 3$**（剩余 $2$ 个结点）：
>   * 拆分 $(1, 1)$：$f(1) \cdot f(1) = 1 \times 1 = 1$ *(完全对称的平衡形态)*
>   * 拆分 $(2, 0)$：$f(2) \cdot f(0) = 1 \times 1 = 1$ *(单侧向左倾斜形态)*
>   * $f(3) = 1 + 1 = 2$
>
> * **$n = 4$**（剩余 $3$ 个结点）：
>   * 拆分 $(2, 1)$：$f(2) \cdot f(1) = 1 \times 1 = 1$
>   * 拆分 $(3, 0)$：$f(3) \cdot f(0) = 2 \times 1 = 2$
>   * $f(4) = 1 + 2 = 3$
>
> * **$n = 5$**（剩余 $4$ 个结点）：
>   * 拆分 $(2, 2)$：$f(2) \cdot f(2) = 1 \times 1 = 1$
>   * 拆分 $(3, 1)$：$f(3) \cdot f(1) = 2 \times 1 = 2$
>   * 拆分 $(4, 0)$：$f(4) \cdot f(0) = 3 \times 1 = 3$
>   * **$f(5) = 1 + 2 + 3 = 6$**
>
> ---
>
> **四、 对应到具体数字 $1 \dots 5$ 的物理意义**
>
> 由于中序遍历必须有序，左子树有 $l$ 个结点，则**根结点必然是第 $l + 1$ 小的数**：
>
> 1. **当拆分为 $(2, 2)$ 时 $\implies$ 根必须为 3**：
>    * 左子树为 $\{1, 2\}$，形态数 $f(2) = 1$（2 是根，1 是其左孩子）。
>    * 右子树为 $\{4, 5\}$，形态数 $f(2) = 1$（5 是根，4 是其左孩子）。
>    * **共 $1 \times 1 = 1$ 棵**。
>
> 2. **当拆分为 $(3, 1)$ 时 $\implies$ 根必须为 4**：
>    * 左子树为 $\{1, 2, 3\}$，形态数 $f(3) = 2$（根为 2，左右为 1、3；或根为 3，左边全偏左）。
>    * 右子树为 $\{5\}$，形态数 $f(1) = 1$。
>    * **共 $2 \times 1 = 2$ 棵**。
>
> 3. **当拆分为 $(4, 0)$ 时 $\implies$ 根必须为 5**：
>    * 左子树为 $\{1, 2, 3, 4\}$，形态数 $f(4) = 3$。
>    * 右子树为空，形态数 $f(0) = 1$。
>    * **共 $3 \times 1 = 3$ 棵**。
>
> * **根不能为 1 或 2**：
>   * 若根为 1，则 $l=0, r=4$，出现 $l < r$；
>   * 若根为 2，则 $l=1, r=3$，出现 $l < r$；
>   * 均不合法。
>
> ---
>
> **五、 总结**
>
> 普通的 5 结点 BST 共有第 5 个卡特兰数 $C_5 = \frac{1}{6}\binom{10}{5} = 42$ 棵。加上“每个结点均满足左子树大小 $\ge$ 右子树大小”这一强约束后，合法的 BST 被大幅压缩到了 **6** 棵。该解答思路清晰、数学建模准确，是一个非常标准的二叉树组合计数典范。

---

## 二、辨析与简答（30 分）

### 5. 等价类合并（重量权衡 + 路径压缩）

规则：结点少的根并到结点多的根下；一样多时，根值大的并到根值小的下。Find 时做路径压缩。

| 等价对 | Find 结果（结点数） | 操作 |
|---|---|---|
| (0,2) | 0(1)，2(1)，一样大 | 2 → 0 |
| (1,2) | 1(1)，0(2) | 1 → 0 |
| (3,4) | 3(1)，4(1)，一样大 | 4 → 3 |
| (4,5) | 3(2)，5(1) | 5 → 3 |
| (2,5) | 0(3)，3(3)，一样大 | 3 → 0 |
| (6,7) | 6(1)，7(1)，一样大 | 7 → 6 |
| (8,7) | 8(1)，6(2) | 8 → 6 |
| (2,8) | 0(6)，6(3) | 6 → 0 |
| (9,7) | 9(1)；Find(7)：7→6→0，**路径压缩使 7 直接挂到 0** | 9 → 0 |

最终只有一个等价类，根为 0（共 10 个结点）：

```text
              0
   ┌───┬───┬──┴┬───┬───┐
   1   2   3   6   7   9
          / \  |
         4   5 8
```

父指针数组（下标 0…9）：`[0, 0, 0, 0, 3, 3, 0, 0, 6, 0]`。

易错点：(9,7) 这一步的 Find(7) 会把 7 从 6 下面压缩上来，所以最后 6 只剩孩子 8，7 成为 0 的直接孩子。

---

## 四、算法设计与实现（30 分）

### 1. 判断字符串能否由某个子串重复多次构成（10 分）

**思路（KMP 的 next 数组）**：设 n = |s|，`next[n]` 为整个串最长的相等真前缀/真后缀长度
（沿用教材【算法4.7】的约定，下标从 0 开始，`next[0] = -1`，这里多求一位 `next[n]`）。
令 p = n − next[n]，p 是 s 的最小周期。s 能由子串重复构成，当且仅当

　　**next[n] > 0 且 n % p == 0**，此时重复单元就是 `s[0..p-1]`，重复 n/p 次。

```cpp
bool repeatedSubstring(const string& s) {
    int n = s.size();
    vector<int> nxt(n + 1);                 // nxt[i]：s[0..i-1] 的最长相等真前后缀长度
    nxt[0] = -1;
    for (int i = 0, k = -1; i < n; ) {
        if (k == -1 || s[i] == s[k]) nxt[++i] = ++k;
        else k = nxt[k];
    }
    int p = n - nxt[n];                     // 最小周期
    return nxt[n] > 0 && n % p == 0;
}
```

**正确性**：s 有长为 next[n] 的相等前后缀 ⇔ s 有周期 n − next[n]，next[n] 取最大，所以 p 是最小周期。

- 若 next[n] > 0 且 p | n：s 由 `s[0..p-1]` 重复 n/p 次构成，且 p < n 保证至少重复 2 次。
- 反之若 s 由长 d 的单元重复构成（d | n，d < n）：d 是周期，故 next[n] ≥ n − d > 0；
  又 p ≤ d，p + d ≤ n，由周期引理 gcd(p, d) 也是周期，而 p 最小，故 p = gcd(p, d)，即 p | d，从而 p | n。

**复杂度**：时间 **O(n)**，空间 O(n)。

（等价的简洁写法：s 是重复串 ⇔ s 出现在 `(s + s)` 去掉首尾字符后的串中；用 KMP 匹配同样 O(n)。）

已验证：`abab`→True，`aba`→False，`abcabcabcabc`→True，`a`→False；
并与「枚举 n 的每个真因子 d 逐一检查」的暴力解在 20 万个随机串（字母表 {a,b}，长度 1–12）上结果一致。



#### 01961:前缀中的周期

http://cs101.openjudge.cn/practice/01961/

> 一个字符串的前缀是从第一个字符开始的连续若干个字符，例如"abaab"共有5个前缀，分别是a, ab, aba, abaa,  abaab。
>
> 我们希望知道一个N位字符串S的前缀是否具有循环节。换言之，对于每一个从头开始的长度为 i （i 大于1）的前缀，是否由重复出现的子串A组成，即 AAA...A （A重复出现K次,K 大于 1）。如果存在，请找出最短的循环节对应的K值（也就是这个前缀串的所有可能重复节中，最大的K值）。
>
> 输入
>
> 输入包括多组测试数据。每组测试数据包括两行。
> 第一行包括字符串S的长度N（2 <= N <= 1 000 000）。
> 第二行包括字符串S。
> 输入数据以只包括一个0的行作为结尾。
>
> 输出
>
> 对于每组测试数据，第一行输出 "Test case #“ 和测试数据的编号。
> 接下来的每一行，输出前缀长度i和重复测数K，中间用一个空格隔开。前缀长度需要升序排列。
> 在每组测试数据的最后输出一个空行。
>
> 样例输入
>
> ```
> 3
> aaa
> 12
> aabaabaabaab
> 0
> ```
>
> 样例输出
>
> ```
> Test case #1
> 2 2
> 3 3
> 
> Test case #2
> 2 2
> 6 2
> 9 3
> 12 4
> ```



这道题是 **KMP 算法（前缀函数 / next 数组）** 的经典应用题。

##### 解题思路

1. **KMP 的 `next` 数组性质**：
   - 设 $nxt[i]$ 表示前缀 $S[0 \dots i-1]$（长度为 $i$）的**最长相等真前后缀（border）长度**。
   - 那么，该前缀的**最小循环周期**长度为 $p = i - nxt[i]$。

2. **判断是否存在循环节**：
   - 对于长度为 $i$ 的前缀（$2 \le i \le N$）：
     - 当且仅当 **$nxt[i] > 0$ 且 $i \pmod p == 0$** 时，该前缀完全由长度为 $p$ 的子串重复拼接而成。
     - 此时重复的次数为 $K = \frac{i}{p} = \frac{i}{i - nxt[i]}$。
     - 由于 $p$ 是该前缀的最小周期，$K$ 自然是所有可能重复次数中的**最大值**（满足题目要求的“最短循环节对应的 $K$ 值”）。

3. **算法流程**：
   - 读入 $N$ 和字符串 $S$。
   - 计算 $S$ 的 `next` 数组（长度为 $N + 1$）。
   - 从 $i = 2$ 到 $N$ 遍历，若满足条件 $nxt[i] > 0$ 且 $i \pmod{(i - nxt[i])} == 0$，则输出 $i$ 和 $i / (i - nxt[i])$。
   - 每组测试用例末尾输出一个空行。

---

##### 完整代码 (C++)

```cpp
#include <iostream>
#include <vector>
#include <string>

using namespace std;

// 预分配全局或静态数组，避免大内存频繁分配
const int MAXN = 1000005;
int nxt[MAXN];

int main() {
    // 优化标准输入输出，提升效率
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    int case_num = 1;

    while (cin >> n && n != 0) {
        string s;
        cin >> s;

        // 计算 KMP 的 next 数组
        // nxt[i] 表示 s[0..i-1] 的最长相等真前后缀长度
        nxt[0] = -1;
        for (int i = 0, k = -1; i < n; ) {
            if (k == -1 || s[i] == s[k]) {
                nxt[++i] = ++k;
            } else {
                k = nxt[k];
            }
        }

        cout << "Test case #" << case_num++ << "\n";

        // 枚举前缀长度 i，从 2 到 n
        for (int i = 2; i <= n; ++i) {
            int p = i - nxt[i]; // 最小周期
            // 如果存在相等真前后缀，且周期能整除当前长度
            if (nxt[i] > 0 && i % p == 0) {
                cout << i << " " << i / p << "\n";
            }
        }
        cout << "\n"; // 每组测试数据后输出一个空行
    }

    return 0;
}
```

---

##### 复杂度分析

- **时间复杂度**：
  - 计算单组数据的 `next` 数组需要 $O(N)$ 时间。
  - 遍历检查 $2 \dots N$ 的前缀需要 $O(N)$ 时间。
  - 总时间复杂度为 **$O(N)$**，对于 $N \le 1\,000\,000$ 能够在毫秒级内完成。
- **空间复杂度**：
  - 存储字符串和 `next` 数组，空间复杂度为 **$O(N)$**。

##### 注意事项

- $N$ 最大为 $1\,000\,000$，数据量较大，必须使用快速输入输出（如 `cin.tie(nullptr)`）或 `scanf` / `printf`。
- 每组数据末尾都要输出一个空行（包括最后一组）。



#### 最小循环元引理的证明

> 最小循环元引理（Minimum Cycle Element Lemma），该引理是字符串处理和 KMP 算法中的一个核心结论。为了证明它，我们需要从 **$next$ 数组（LPS 表）的定义**出发，利用**位移相等性**进行推导。
>
> ---
>
> **1. 核心结论回顾**
>
> 设字符串 $S$ 的长度为 $n$，其最长公共真前后缀长度为 $next[n]$。
> 令 $L = n - next[n]$。
> **引理断言：** 若 $n \pmod L == 0$，则 $L$ 是 $S$ 的最小循环元长度。
>
> ---
>
> **2. 证明过程**
>
> 我们可以将证明分为两个部分：
>
> 1. **充分性：** 为什么当 $n \pmod L = 0$ 时，$L$ 一定是一个循环节。
> 2. **最小性：** 为什么 $L$ 是最短的循环节。
>
> ---
>
> **第一部分：充分性证明（$L$ 是一个循环节）**
>
> 根据 $next[n]$ 的定义，字符串 $S$ 的前 $next[n]$ 个字符与后 $next[n]$ 个字符完全相同。
>
> 1. **等式建立：**
>    设 $k = next[n]$。根据定义有：
>    $$S[1 \dots k] = S[n-k+1 \dots n]$$
>
> 2. **位移关系：**
>    由于 $L = n - k$，我们可以将上述等式改写为：
>    $$S[1 \dots n-L] = S[L+1 \dots n]$$
>
> 3. **逐位对应：**
>    这意味着对于任意 $1 \le i \le n-L$，都有：
>    $$S[i] = S[i+L]$$
>    这个性质告诉我们，字符串中**距离为 $L$ 的字符全部相等**。
>
> 4. **循环传导：**
>
>    *   $S[1] = S[1+L] = S[1+2L] = \dots$
>    *   $S[2] = S[2+L] = S[2+2L] = \dots$
>    *   ...
>    *   $S[L] = S[L+L] = S[L+2L] = \dots$
>
>    如果 $n$ 能被 $L$ 整除（即 $n = m \cdot L$），那么整个字符串恰好可以被划分为 $m$ 个长度为 $L$ 的块。
>    根据上述传导关系，第一块 $S[1 \dots L]$ 等于第二块 $S[L+1 \dots 2L]$，等于第三块……以此类推。
>    **结论：** $S$ 是由长度为 $L$ 的前缀重复 $n/L$ 次构成的。
>
> ---
>
> **第二部分：最小性证明（$L$ 是最短循环节）**
>
> 我们要证明不存在更短的循环节。
>
> 1. **反证法：**
>    假设存在一个更短的循环节，其长度为 $L'$，且 $L' < L$。
>
> 2. **构造前后缀：**
>    如果 $L'$ 是 $S$ 的一个循环节，那么根据循环节的性质，必然有：
>    $$S[1 \dots n-L'] = S[L'+1 \dots n]$$
>    这意味着长度为 $n - L'$ 的前缀和后缀相等。
>
> 3. **矛盾推导：**
>    由假设 $L' < L$，可得：
>    $$n - L' > n - L$$
>    由于 $L = n - next[n]$，代入上式：
>    $$n - L' > next[n]$$
>    这说明我们找到了一个比 $next[n]$ 更长的公共真前后缀。
>
>    然而，根据 KMP 算法中 $next[n]$ 的定义，它是**最长**的公共真前后缀。这产生了矛盾。
>    **结论：** 不存在比 $L$ 更短的循环节。
>
> ---
>
> **3. 补充：如果 $n \pmod L \neq 0$ 呢？**
>
> 如果 $n$ 不能被 $n - next[n]$ 整除，虽然 $S[i] = S[i+L]$ 依然成立，但字符串的末尾会剩下一个不足 $L$ 的“残缺节”。在这种情况下：
>
> *   $L$ 依然是 $S$ 的一个周期（Period），但 $S$ **不具备**完整的循环元。
> *   $S$ 的最小循环元长度只能是 $n$ 本身（即不可再分）。
>
> **4. 总结**
>
> *   **$n - next[n]$** 代表了字符串中出现重复特征的**最小偏移量**。
> *   只要总长度能整除这个偏移量，该偏移量对应的子串就是**最小循环元**。
> *   这个结论的优美之处在于：它将复杂的周期性判断简化为了对 $next$ 数组末尾数值的简单算术运算。





### 2. 由 L、R 求父亲数组 T，并判断 U 是否为 V 的后代（10 分）

**（1）（6 分）** 每个结点 i 的非空孩子 L[i]、R[i] 的父亲就是 i；根没有父亲，保持 0。

```cpp
void buildParent(const int L[], const int R[], int T[], int n) {
    for (int i = 0; i <= n; ++i) T[i] = 0;     // 根及 T[0] 保持为 0
    for (int i = 1; i <= n; ++i) {
        if (L[i] != 0) T[L[i]] = i;
        if (R[i] != 0) T[R[i]] = i;
    }
}
```

时间 O(n)，除 T 外额外空间 O(1)。

**（2）（4 分）** U 是 V 的后代 ⇔ V 在 U 到根的路径上（不含 U 自身）。从 U 的父亲出发沿 T 上溯：

```cpp
bool isDescendant(const int T[], int u, int v) {
    for (int p = T[u]; p != 0; p = T[p])        // 从 u 的父亲一直走到根
        if (p == v) return true;
    return false;
}
```

时间 O(h)（h 为树高，最坏 O(n)），空间 O(1)。只用到了 T；L、R 在（1）中已用来求 T。

已验证：树 1(2,3)、2(4,−)、3(5,6) 求得 T = `[0,0,1,1,2,3,3]`；
4 是 1 的后代 ✓，4 不是 3 的后代 ✓，1 不是自己的后代 ✓，6 是 3 的后代 ✓。



> 判断 $u$ 是否为 $v$ 的后代/祖先通常是一项前置技巧：
>
> * **常见做法（DFS 序判定法）**：
>   对整棵树进行一次深度优先遍历，记录每个结点的入戳 `in[i]` 和出戳 `out[i]`。
>   若 $u$ 是 $v$ 的后代，当且仅当：
>   $$\text{in}[v] \le \text{in}[u] \quad \text{且} \quad \text{out}[u] \le \text{out}[v]$$
>   这样只需 $O(n)$ 预处理，后续每次判断仅需 **$O(1)$** 即可完成。



**“基于 DFS 序的 LCA 算法”**（相比于传统的欧拉序 RMQ，它把序列长度从 $2N$ 压缩到了 $N$）。

**“求任意两个节点的 LCA（最近公共祖先）”，用来“判断 U 是否为 V 的后代”属于“杀鸡用牛刀”了。**

---

**一、 两个概念的辨析**

| 对比维度       | **单纯判断 U 是否为 V 的后代**    | **求 LCA**                              |
| :------------- | :-------------------------------- | :-------------------------------------- |
| **核心问题**   | $V$ 是否在 $U$ 到根节点的路径上？ | $U$ 和 $V$ 的**最低公共祖先具体是谁**？ |
| **所需算法**   | **DFS 进出时间戳**（括号定理）    | **DFS 序 + ST表/RMQ** 或 倍增 / 树剖    |
| **预处理时间** | **$O(n)$**（仅需一次极简 DFS）    | $O(n \log n)$（需要构建二维 ST 表）     |
| **查询时间**   | **$O(1)$**（仅需两次整数比大小）  | $O(1)$（通过 RMQ 查询最值）             |
| **代码量**     | 仅需 10 行左右                    | 需要几十行（RMQ、位运算、ST表）         |

---

**二、 如果仅仅是“判断 U 是否为 V 的后代”，真正的 DFS 序做法是怎样的？**

在树的深度优先遍历中，树结构天然满足**“括号包含关系”**（也称树的括号定理）：
> 当且仅当 **$V$ 进入的时间 $\le$ $U$ 进入的时间** 且 **$U$ 离开的时间 $\le$ $V$ 离开的时间** 时，$U$ 必然在 $V$ 的子树中（即 $U$ 是 $V$ 的后代）。

这种做法**完全不需要 ST 表，不需要父节点指针，也不需要动态规划**，代码极为精简：

**Python 实现：**

```python
# tin[x] 表示进入节点 x 的时间，tout[x] 表示离开节点 x 的时间
timer = 0
tin = [0] * (N + 1)
tout = [0] * (N + 1)

def dfs(u, p):
    global timer
    timer += 1
    tin[u] = timer
    for v in graph[u]:
        if v != p:
            dfs(v, u)
    timer += 1
    tout[u] = timer

# O(1) 判断：U 是否是 V 的后代（且 U != V）
def is_descendant(u, v):
    if u == v: 
        return False
    return tin[v] <= tin[u] and tout[u] <= tout[v]
```

---

三、 如何用 LCA 来做这道题？

当然，**LCA 的能力是完全包含“判断后代”的**。如果已经实现 `query_lca(u, v)`，后代的判定条件非常简单：

$$U \text{ 是 } V \text{ 的后代} \iff \text{query\_lca}(u, v) == v \quad \text{且} \quad u \neq v$$

* **优点**：不仅能判断后代，还能求出两个点不具备后代关系时的公共祖先。
* **缺点**：对于第一轮讨论的那种 10 分的小题来说，写 ST 表和 RMQ 无论从代码量还是理解成本上都过重了。



```python
# tin[x] 表示进入节点 x 的时间，tout[x] 表示离开节点 x 的时间
timer = 0
tin = [0] * (N + 1)
tout = [0] * (N + 1)

def dfs(u, p):
    global timer
    timer += 1
    tin[u] = timer
    for v in graph[u]:
        if v != p:
            dfs(v, u)
    timer += 1
    tout[u] = timer

# O(1) 判断：U 是否是 V 的后代（且 U != V）
def is_descendant(u, v):
    if u == v: 
        return False
    return tin[v] <= tin[u] and tout[u] <= tout[v]
```



#### P3379 【模板】最近公共祖先（LCA）（黄色 普及/提高-）

LCA, binary lifting, https://www.luogu.com.cn/problem/P3379

> 给定一棵有根多叉树，请求出指定两个点直接最近的公共祖先。
>
> **输入**
>
> 第一行包含三个正整数 $N,M,S$，分别表示树的结点个数、询问的个数和树根结点的序号。
>
> 接下来 $N-1$ 行每行包含两个正整数 $x, y$，表示 $x$ 结点和 $y$ 结点之间有一条直接连接的边（数据保证可以构成树）。
>
> 接下来 $M$ 行每行包含两个正整数 $a, b$，表示询问 $a$ 结点和 $b$ 结点的最近公共祖先。
>
> **输出**
>
> 输出包含 $M$ 行，每行包含一个正整数，依次为每一个询问的结果。
>
> 样例
>
> 输入 #1
>
> ```
> 5 5 4
> 3 1
> 2 4
> 5 1
> 1 4
> 2 4
> 3 2
> 3 5
> 1 2
> 4 5
> ```
>
> 输出 #1
>
> ```
> 4
> 4
> 1
> 4
> 4
> 
> ```
>
> **说明/提示**
>
> 对于 $30\%$ 的数据，$N\leq 10$，$M\leq 10$。
>
> 对于 $70\%$ 的数据，$N\leq 10000$，$M\leq 10000$。
>
> 对于 $100\%$ 的数据，$1 \leq N,M\leq 5\times10^5$，$1 \leq x, y,a ,b \leq N$，**不保证** $a \neq b$。
>
>
> 样例说明：
>
> 该树结构如下：
>
>  <img src="https://raw.githubusercontent.com/GMyhf/img/main/img/2282.png" style="zoom:33%;" /> 
>
> 第一次询问：$2, 4$ 的最近公共祖先，故为 $4$。
>
> 第二次询问：$3, 2$ 的最近公共祖先，故为 $4$。
>
> 第三次询问：$3, 5$ 的最近公共祖先，故为 $1$。
>
> 第四次询问：$1, 2$ 的最近公共祖先，故为 $4$。
>
> 第五次询问：$4, 5$ 的最近公共祖先，故为 $4$。
>
> 故输出依次为 $4, 4, 1, 4, 4$。
>
> 2021/10/4 数据更新 @fstqwq：应要求加了两组数据卡掉了暴力跳。
>
> 
>
> 倍增法，讲的清楚。P3379【模版】最近公共祖先（LCA）
>
> https://www.bilibili.com/video/BV1vg41197Xh?t=856.4
>
> > 视频讲解，截图：
> >
> > ![16e8412266d83bb469aefe1e354de807](https://raw.githubusercontent.com/GMyhf/img/main/img/16e8412266d83bb469aefe1e354de807.png)
> >
> > 
> >
> > ![8c33abf3d05630b86ab775b92ae4eca2](https://raw.githubusercontent.com/GMyhf/img/main/img/8c33abf3d05630b86ab775b92ae4eca2.png)
> >
> > 
> >
> > ![e1d80259925571314d0e215a3c54d893](https://raw.githubusercontent.com/GMyhf/img/main/img/e1d80259925571314d0e215a3c54d893.png)
> >
> > 
>
> 
>
> ### 倍增法
>
> 对于 $N, M \le 5 \times 10^5$ 的大规模数据，Python 在处理时需要极其注意效率。常用的 **倍增法（Binary Lifting）** 时间复杂度为 $O((N+M) \log N)$。
>
> 在洛谷等 OJ 上，由于 Python 解释器较慢，建议使用以下优化手段：
>
> 1.  **快速输入输出**：使用 `sys.stdin.read().split()` 批量读取。
> 2.  **迭代式 BFS**：代替 DFS，避免递归深度限制并提高深度计算效率。
> 3.  **局部变量优化**：在函数内部定义变量和逻辑。
> 4.  **位运算**：利用二进制特性。
>
> **Python 代码实现**
>
> ```python
> import sys
> 
> def solve():
>     # 1. 快速读取所有输入数据
>     # data 将包含所有的 N, M, S, 所有的边, 所有的询问
>     input_data = sys.stdin.read().split()
>     if not input_data:
>         return
>     
>     it = iter(input_data)
>     n = int(next(it))
>     m = int(next(it))
>     root = int(next(it))
>     
>     # 2. 建立邻接表
>     adj = [[] for _ in range(n + 1)]
>     for _ in range(n - 1):
>         u = int(next(it))
>         v = int(next(it))
>         adj[u].append(v)
>         adj[v].append(u)
>         
>     # 3. BFS 预处理深度和父节点
>     depth = [0] * (n + 1)
>     parent = [0] * (n + 1)
>     depth[root] = 1
>     queue = [root]
>     
>     # 层次遍历
>     for u in queue:
>         for v in adj[u]:
>             if not depth[v]:
>                 depth[v] = depth[u] + 1
>                 parent[v] = u
>                 queue.append(v)
>     
>     # 4. 构建倍增表 up[i][u] 表示节点 u 的第 2^i 个祖先
>     log_n = n.bit_length()
>     up = [parent] # up[0] 是 2^0 = 1 级祖先
>     for i in range(1, log_n):
>         prev_up = up[i-1]
>         # 使用列表推导式加速
>         curr_up = [prev_up[prev_up[j]] if prev_up[j] else 0 for j in range(n + 1)]
>         up.append(curr_up)
>     
>     # 5. 定义查询函数
>     # 放在 solve 内部可以利用局部变量加速
>     results = []
>     for _ in range(m):
>         u = int(next(it))
>         v = int(next(it))
>         
>         if depth[u] < depth[v]:
>             u, v = v, u
>             
>         # 让 u 向上跳到和 v 同一深度
>         diff = depth[u] - depth[v]
>         for i in range(log_n):
>             if (diff >> i) & 1:
>                 u = up[i][u]
>         
>         if u == v:
>             results.append(str(u))
>             continue
>             
>         # 同时向上跳，跳到 LCA 的下一层
>         for i in range(log_n - 1, -1, -1):
>             up_i = up[i]
>             if up_i[u] != up_i[v]:
>                 u = up_i[u]
>                 v = up_i[v]
>         
>         results.append(str(up[0][u]))
>         
>     # 6. 批量输出结果
>     sys.stdout.write('\n'.join(results) + '\n')
> 
> if __name__ == "__main__":
>     solve()
> ```
>
> **关键点详解**
>
> 1. **倍增表结构**：`up[i][u]` 这种结构（先索引幂次，再索引节点编号）在 Python 中比 `up[u][i]` 快得多。因为在 `LCA` 查询的循环中，我们频繁切换节点 `u`，但 `i` 是固定或按序变化的。
>
> 2. **`bit_length()`**：这是一个快速获取 $N$ 的二进制位数的方法，用于确定倍增表的最大高度。
>
> 3. **对齐深度**：
>
>    *   先求出深度差 `diff`。
>    *   利用二进制拆分，如果 `diff` 的第 $i$ 位是 1，就把 $u$ 往上跳 $2^i$ 步。
>
> 4. **二分搜索 LCA**：
>
>    *   从最大可能的跳跃步数开始尝试（`LOG` 递减）。
>    *   如果跳完后两个节点**不相等**，说明还没跳过头，执行跳跃。
>    *   最终它们会停在 LCA 的下方，直接返回 `up[0][u]` 即可。
>
>    **性能说明**
>
>    对于 $5 \times 10^5$ 的量级，即使使用了倍增法，在 Python3 (CPython) 下运行依然非常吃力（可能会在 1~2s 的时限边缘）。如果是在洛谷等平台提交，建议选择 **PyPy 3** 编译器，它的 JIT 优化能显著提升循环效率。
>
>    如果仍然 TLE，通常需要考虑 **Tarjan 离线算法**，其时间复杂度为 $O(N + M \alpha(N))$，在查询量极大时性能优于倍增法。
>
> > 倍增法，理解了ST 表 (Sparse Table) ，程序就容易看懂了。
> >
> > 在普通数组中，ST 表的递推式是：`st[k][i] = min(st[k-1][i], st[k-1][i + 2^(k-1)])`。
> > 在树中，`up[k][u]` 的递推式是：`up[k][u] = up[k-1][ up[k-1][u] ]`。
> >
> > 逻辑相同：都是通过两个 2^{k-1} 的操作合成一个 2^k 的操作。
> >
> > 
> >
> > 另外就是AI给的代码，通常是优化的。比如：# 使用列表推导式利用 Python 的 C 语言底层循环，比 for 循环快得多
>
> 
>
> ### DFS序 + RMQ (Range Minimum Query)
>
> 【孙婧斯、生命科学学院】根据定理，用dfs遍历的树，遍历序在两个节点之间的最浅父节点就是他们的最近共同祖先，最浅父节点的dn值最小。
>
> 因此，我们需要记录每个节点的遍历序dn ，st[k] [j]代表遍历序起点为j，长度为2**k的区间中最浅父节点。先把dfs遍历所有节点，赋予dn值，记录直接父节点。然后动态规划推导出st表。查找时，计算区间长度，把区间分为两部分找最小值。
>
> 为了避免在最近共同祖先是某个节点本身是错误的输出了他的父节点，区间左端点需要+1
>
> > dfn 是 DFS Number。简单来说，dfn 代表了一个节点在进行深度优先搜索（DFS）时被访问到的先后顺序。 dfn = DFS 访问顺序。它是连接“树形结构”与“线性数组”的桥梁。
>
> ```python
> import sys
> 
> def main():
>     # 1. 快速读取所有输入数据
>     # data 列表中依次存储了 N, M, S 以及后续的边信息和查询信息
>     data = list(map(int, sys.stdin.read().split()))
>     if not data:
>         return
>         
>     idx = 0
>     N = data[idx]; idx += 1  # 节点数
>     M = data[idx]; idx += 1  # 查询数
>     S = data[idx]; idx += 1  # 根节点编号
> 
>     # 2. 建立邻接表（无向图）
>     # num 设置为 5*10^5 + 1 是为了覆盖题目给定的最大节点范围
>     MAX_NODE = 5 * 10**5 + 1
>     graph = [[] for _ in range(MAX_NODE)]
>     for _ in range(N - 1):
>         x = data[idx]
>         y = data[idx + 1]
>         graph[x].append(y)
>         graph[y].append(x)
>         idx += 2
> 
>     # 3. 预处理相关变量
>     LOG = 19            # 2^19 > 500,000，用于 ST 表的深度
>     dfn = [0] * MAX_NODE  # 记录每个节点在 DFS 遍历中的访问顺序（时间戳）
>     # st[k][j] 代表在 DFS 序列中，从位置 j 开始，长度为 2^k 的区间内，dfn 最小的节点的“父节点”
>     st = [[0] * (N + 1) for _ in range(LOG)]
>     
>     # 4. 迭代式 DFS（避免 Python 递归深度超限）
>     # 获取每个节点的 DFN 和 直接父节点
>     dn = 0              # DFN 计数器
>     stack = [(S, 0)]    # 栈中存储 (当前节点, 父节点)
>     vis = [False] * MAX_NODE
>     
>     while stack:
>         node, father = stack.pop()
>         if vis[node]:
>             continue
>         vis[node] = True
>         
>         dn += 1
>         dfn[node] = dn
>         # 核心逻辑：ST 表的第 0 层存储 DFS 序为 dn 的节点的父节点
>         st[0][dn] = father
>         
>         # 遍历子节点（reversed 保持与常规递归顺序一致，非必须）
>         for child in reversed(graph[node]):
>             if child != father and not vis[child]:
>                 stack.append((child, node))
> 
>     # 5. 辅助函数：比较两个节点，返回 dfn 较小的那个节点
>     def get_min_dfn_node(node_m, node_n):
>         if node_m == 0: return node_n # 处理边界
>         if node_n == 0: return node_m
>         return node_m if dfn[node_m] < dfn[node_n] else node_n
> 
>     # 6. 动态规划构建 ST 表
>     # 时间复杂度 O(N log N)
>     for k in range(1, LOG):
>         for j in range(1, N - (1 << k) + 2):
>             # 区间 DP：当前区间最小值由两个子区间最小值合并而来
>             st[k][j] = get_min_dfn_node(st[k-1][j], 
>                                         st[k-1][j + (1 << (k-1))])
> 
>     # 7. LCA 查询函数
>     # 时间复杂度 O(1)
>     def query_lca(a, b):
>         if a == b:
>             return a
>         # 转换为 DFS 序进行区间查询
>         dfn_a, dfn_b = dfn[a], dfn[b]
>         if dfn_a > dfn_b:
>             dfn_a, dfn_b = dfn_b, dfn_a
>         
>         # 【定理关键点】
>         # LCA(a, b) 是区间 (dfn[a], dfn[b]] 中 dfn 最小的节点的父节点。
>         # 因此左端点 dfn_a 需要 +1，以排除节点 a 本身。
>         dfn_a += 1
>         
>         # 计算区间长度对应的 log 值
>         length = dfn_b - dfn_a + 1
>         d = length.bit_length() - 1
>         
>         # RMQ 查询：取两个重叠区间的最小值
>         return get_min_dfn_node(st[d][dfn_a], 
>                                 st[d][dfn_b - (1 << d) + 1])
> 
>     # 8. 处理查询请求
>     output = []
>     for _ in range(M):
>         u, v = data[idx], data[idx+1]
>         output.append(str(query_lca(u, v)))
>         idx += 2
> 
>     # 9. 批量打印结果，提高效率
>     sys.stdout.write('\n'.join(output) + '\n')
> 
> if __name__ == "__main__":
>     main()
> ```
>
> 
>
> ### 用欧拉序列转化为 RMQ
>
> 将 LCA 问题转化为 RMQ 问题是解决树上查询的一种非常高效的**在线**算法。
>
> **核心原理**
>
> 1.  **欧拉序列 (Euler Tour)**：通过 DFS 遍历树，并在**进入**节点和**从子节点返回**时都记录该节点。对于一个有 $N$ 个节点的树，欧拉序列的长度约为 $2N-1$。
> 2.  **深度序列**：记录欧拉序列中每个位置对应的节点深度。
> 3.  **转化逻辑**：节点 $u$ 和 $v$ 的 LCA，就是欧拉序列中“$u$ 第一次出现的位置”和“$v$ 第一次出现的位置”之间，**深度最小**的那个节点。
> 4.  **RMQ 求解**：使用 **ST 表 (Sparse Table)** 预处理深度序列，实现 $O(1)$ 的区间最小值查询。
>
> **复杂度分析**
>
> *   **时间复杂度**：预处理 $O(N \log N)$，查询 $O(1)$。
> *   **空间复杂度**：$O(N \log N)$，主要用于存储 ST 表。
>
> **Python 代码实现 (优化版)**
>
> 为了处理 $5 \times 10^5$ 的数据，我们使用了 `array` 模块来节省内存，并使用迭代 DFS。
>
> ```python
> import sys
> from array import array
> 
> def solve():
>     # 1. 快速读入
>     input_data = sys.stdin.read().split()
>     if not input_data: return
>     it = iter(input_data)
>     
>     n = int(next(it))
>     m = int(next(it))
>     root = int(next(it))
>     
>     adj = [[] for _ in range(n + 1)]
>     for _ in range(n - 1):
>         u, v = int(next(it)), int(next(it))
>         adj[u].append(v)
>         adj[v].append(u)
>         
>     # 2. 迭代 DFS 生成欧拉序列
>     # tour_nodes: 记录路径上的节点编号
>     # tour_depths: 记录对应的深度
>     # first_pos: 记录每个节点在 tour 中第一次出现的位置
>     tour_nodes = array('I')   # 'I' 是无符号 int
>     tour_depths = array('I')
>     first_pos = [-1] * (n + 1)
>     
>     stack = [(root, -1, 1)] # node, parent, depth
>     it_map = [0] * (n + 1)
>     
>     while stack:
>         u, p, d = stack[-1]
>         if first_pos[u] == -1:
>             first_pos[u] = len(tour_nodes)
>         
>         tour_nodes.append(u)
>         tour_depths.append(d)
>         
>         found = False
>         while it_map[u] < len(adj[u]):
>             v = adj[u][it_map[u]]
>             it_map[u] += 1
>             if v != p:
>                 stack.append((v, u, d + 1))
>                 found = True
>                 break
>         
>         if not found:
>             stack.pop()
>             if stack: # 从子节点回溯，再次记录父节点
>                 pu, pp, pd = stack[-1]
>                 tour_nodes.append(pu)
>                 tour_depths.append(pd)
> 
>     # 3. 预处理 ST 表 (RMQ)
>     # st[i][j] 存储 tour_depths 中从 j 开始长度为 2^i 的区间内，最小深度对应的索引
>     num_tour = len(tour_depths)
>     log_n = num_tour.bit_length()
>     
>     # 使用 array 节省内存，st[i] 存储第 i 层幂次的结果
>     st = [array('I', range(num_tour))] 
>     
>     for i in range(1, log_n):
>         prev = st[i-1]
>         step = 1 << (i-1)
>         # 当前层的大小
>         curr_len = num_tour - (1 << i) + 1
>         curr = array('I', [0] * curr_len)
>         for j in range(curr_len):
>             idx1 = prev[j]
>             idx2 = prev[j + step]
>             if tour_depths[idx1] < tour_depths[idx2]:
>                 curr[j] = idx1
>             else:
>                 curr[j] = idx2
>         st.append(curr)
> 
>     # 4. 在线查询
>     output = []
>     for _ in range(m):
>         u, v = int(next(it)), int(next(it))
>         l, r = first_pos[u], first_pos[v]
>         if l > r: l, r = r, l
>         
>         # 计算区间长度对应的最高幂次
>         length = r - l + 1
>         k = length.bit_length() - 1
>         
>         # 比较两个重叠区间的最小值
>         idx1 = st[k][l]
>         idx2 = st[k][r - (1 << k) + 1]
>         
>         if tour_depths[idx1] < tour_depths[idx2]:
>             output.append(str(tour_nodes[idx1]))
>         else:
>             output.append(str(tour_nodes[idx2]))
>             
>     sys.stdout.write('\n'.join(output) + '\n')
> 
> if __name__ == "__main__":
>     solve()
> ```
>
> **代码关键点：**
>
> 1.  **欧拉序列长度**：对于 $N=5 \times 10^5$ 的树，序列长度约为 $10^6$。
> 2.  **内存管理**：Python 的 `list` 存储百万级整数非常耗内存（每个 int 对象约 28 字节）。使用 `array.array('I', ...)` 可以将存储开销降低到每个元素 4 字节，防止在大数据下触发内存限制（Memory Limit Exceeded）。
> 3.  **迭代 DFS**：手动管理 `stack` 以防止 Python 递归溢出。
> 4.  **ST 表查询**：通过 `(r - l + 1).bit_length() - 1` 快速计算 $\log_2(\text{len})$。
>
> **为什么这个算法被称为“在线”？**
>
> 因为一旦 `solve` 中的预处理（ST 表构建）完成，你可以以 $O(1)$ 的速度回答任何**即时提出**的查询，而不需要像 Tarjan 算法那样必须等待所有查询都到齐了才能开始计算。这对于需要根据查询结果决定后续逻辑的题目非常关键。



### 3. 由伪满二叉树前序序列输出镜面映射树的宽度优先序列（10 分）

> 04082: 树的镜面映射
>
> http://cs101.openjudge.cn/practice/04082/
>
> 一棵树的镜面映射指的是对于树中的每个结点，都将其子结点反序。例如，对左边的树，镜面映射后变成右边这棵树。 
>
> ```
>  a                             a
> / | \                         / | \
> b  c  f       ===>            f  c  b
> / \                           / \
> d   e                         e   d
> ```
>
> 我们在输入输出一棵树的时候，常常会把树转换成对应的二叉树，而且对该二叉树中只有单个子结点的分支结点补充一个虚子结点“$”，形成“伪满二叉树”。
>
> 例如，对下图左边的树，得到下图右边的伪满二叉树 
>
> ```
>  a                             a
> / | \                          / \
> b  c  f       ===>             b   $
> / \                         / \
> d   e                       $   c                          
>                               / \
>                              d   f
>                             / \
>                            $   e
> ```
>
> 然后对这棵二叉树进行前序遍历，如果是内部结点则标记为0，如果是叶结点则标记为1，而且虚结点也输出。
>
> 现在我们将一棵树以“伪满二叉树”的形式输入，要求输出这棵树的镜面映射的宽度优先遍历序列。
>
> 输入
>
> 输入包含一棵树所形成的“伪满二叉树”的前序遍历。
> 第一行包含一个整数，表示结点的数目(不大于50)。
> 第二行包含所有结点。每个结点用两个字符表示，第一个字符表示结点的编号，第二个字符表示该结点为内部结点还是外部结点，内部结点为0，外部结点为1。结点之间用一个空格隔开。
> 数据保证所有结点的编号都为一个小写字母。
>
> 输出
>
> 输出包含这棵树的镜面映射的宽度优先遍历序列，只需要输出每个结点的编号，编号之间用一个空格隔开。
>
> 样例输入
>
> ```
> 9
> a0 b0 $1 c0 d0 $1 e1 f1 $1
> ```
>
> 样例输出
>
> ```
> a f c b e d
> ```
>
> 提示
>
> 样例输入输出对应着题目描述中的那棵树。
>
> 
>
> ```python
> import sys
> from collections import deque
> 
> sys.setrecursionlimit(10000)
> 
> # --- 第一步：读取输入并分割成 token 列表 ---
> n = int(sys.stdin.readline().strip())          # 结点总数（包括虚节点）
> tokens = sys.stdin.readline().split()           # 每个 token 形如 'a0'、'b1'、'$1'
> 
> # --- 第二步：将前序序列解析成“伪满二叉树” ---
> idx = 0  # 全局索引，用于在 tokens 列表中遍历
> 
> class BinNode:
>     __slots__ = ('label', 'is_leaf', 'left', 'right')
>     def __init__(self, label, is_leaf):
>         self.label = label      # 结点字符（小写字母或 '$'）
>         self.is_leaf = is_leaf  # True=叶子或虚节点，False=内部节点
>         self.left = None        # 左子指针（在左-子/右-兄弟表示中存第一孩子）
>         self.right = None       # 右子指针（同一层的下一个兄弟）
> 
> def parse_binary():
>     """
>     递归按前序解析伪满二叉树：
>     - 如果当前是内部节点（flag=='0'），则继续读两个子节点
>     - 如果是叶子或虚节点（flag=='1'），则不再递归
>     """
>     global idx
>     label = tokens[idx][0]
>     flag  = tokens[idx][1]
>     idx += 1
>     node = BinNode(label, flag == '1')
>     if not node.is_leaf:
>         # 内部节点必然有左右两个孩子
>         node.left = parse_binary()
>         node.right = parse_binary()
>     return node
> 
> root_bin = parse_binary()  # 根节点
> 
> # --- 第三步：将“左-子/右-兄弟”二叉树转换回 N 叉树，忽略 '$' 虚节点 ---
> class NaryNode:
>     __slots__ = ('label', 'children')
>     def __init__(self, label):
>         self.label = label    # 真实结点字符
>         self.children = []    # 孩子列表
> 
> def build_nary(bin_node):
>     """
>     将二叉表示转换成 N 叉表示：
>     - 跳过 bin_node 为 None 或 label=='$'
>     - bin_node.left 指向第一个孩子；通过 .right 链接拿到所有兄弟
>     """
>     if bin_node is None or bin_node.label == '$':
>         return None
> 
>     nnode = NaryNode(bin_node.label)
>     child = bin_node.left
>     while child:
>         nch = build_nary(child)
>         if nch:
>             nnode.children.append(nch)
>         child = child.right
>     return nnode
> 
> root = build_nary(root_bin)
> 
> # --- 第四步：对 N 叉树做镜像（对每个节点的孩子列表反序） ---
> def mirror_nary(node):
>     if node is None:
>         return
>     node.children.reverse()
>     for ch in node.children:
>         mirror_nary(ch)
> 
> mirror_nary(root)
> 
> # --- 第五步：宽度优先遍历并输出结果 ---
> q = deque([root])
> res = []
> while q:
>     u = q.popleft()
>     res.append(u.label)
>     for ch in u.children:
>         q.append(ch)
> 
> # 最终只输出结点编号，空格分隔
> print(' '.join(res))
> ```
>
> 

**思路**：

1. **还原二叉树**：前序序列中每个记号为「值 + 标记」。标记 0 是内部结点，后面依次是它的左子树、右子树的前序序列；
   标记 1 是叶结点。因为是伪满二叉树（每个内部结点恰有两个孩子），递归读入即可唯一还原。虚结点 `$` 读入后当作空指针。
2. **二叉树 → 树**：这是「左孩子-右兄弟」表示，树结点 x 的孩子依次是 x.left、x.left.right、x.left.right.right……
3. **镜面映射的 BFS**：镜面映射只是把每个结点的孩子反序，所以不必真的建镜像树——
   对原树做宽度优先遍历，每个结点出队时把它的孩子**从右到左**入队即可。

```cpp
struct Node { char val; Node *left = nullptr, *right = nullptr; };

// 读入一棵伪满二叉树的前序序列（记号形如 "a0"、"$1"），返回根；虚结点返回空
Node* build(istream& in) {
    string tok;
    in >> tok;
    Node* t = new Node{tok[0]};
    if (tok[1] == '0') {                    // 内部结点：先左子树，后右子树
        t->left = build(in);
        t->right = build(in);
    }
    if (t->val == '$') { delete t; return nullptr; }   // 虚结点不进入树
    return t;
}

void mirrorBFS(Node* root) {
    queue<Node*> q;
    if (root) q.push(root);
    while (!q.empty()) {
        Node* x = q.front(); q.pop();
        cout << x->val << ' ';
        vector<Node*> kids;                 // x 在树中的孩子：左孩子及其右兄弟链
        for (Node* c = x->left; c != nullptr; c = c->right) kids.push_back(c);
        for (int i = (int)kids.size() - 1; i >= 0; --i)   // 镜面映射：孩子反序入队
            q.push(kids[i]);
    }
}
```

（虚结点 `$` 一定是叶，标记必为 1，所以 `delete` 时它没有子树。）

**例子**：输入 `a0 b0 $1 c0 d0 $1 e1 f1 $1` 还原为：a.left = b，a.right = $；b.left = $，b.right = c；
c.left = d，c.right = f；d.left = $，d.right = e。
于是树中 a 的孩子为 b、c、f，c 的孩子为 d、e，b、d、e、f 为叶。原树 BFS 为 a b c f d e，
镜面映射后为 **a f c b e d**，与题目一致。

**复杂度**：每个记号读入一次、每个结点入队出队一次，时间 **O(n)**；空间 O(n)（树、队列及递归栈）。

已验证：程序对题目示例输出 `a f c b e d`。
