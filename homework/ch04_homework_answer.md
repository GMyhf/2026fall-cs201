# 第四章作业 参考答案

## 1 最小覆盖子串

> 原题：力扣 76. 最小覆盖子串（力扣只要求返回子串，本题还要求返回起始下标）。

**H76.最小覆盖子串**

https://leetcode.cn/problems/minimum-window-substring/

**思路。** 用两个计数表 `need` 与 `window` 分别记录 `T` 中各字符所需次数与当前窗口内各字符出现次数。维护 `have`（窗口内已达标的字符种类数）和 `required = |need|`。右指针扩张窗口直到 `have == required`，再不断左移左指针尝试缩小窗口。只记录最佳窗口的起点和长度，最后截取一次子串。

**伪代码。**

```text
function minWindow(S, T):
    if len(T) == 0: return ("", 0)
    if len(S) < len(T): return ("", -1)

    need = {}
    for c in T:
        need[c] = need.get(c, 0) + 1

    window = {}
    have = 0
    required = len(need)
    left = 0
    best_start = -1
    min_len = +∞

    for right = 0 .. len(S)-1:
        c = S[right]
        if c in need:
            window[c] = window.get(c, 0) + 1
            if window[c] == need[c]:
                have += 1

        while have == required and left <= right:
            cur_len = right - left + 1
            if cur_len < min_len:
                min_len = cur_len
                best_start = left
            // 尝试左移
            c2 = S[left]
            if c2 in need:
                window[c2] -= 1
                if window[c2] < need[c2]:
                    have -= 1
            left += 1

    if best_start == -1: return ("", -1)
    return (S[best_start .. best_start + min_len - 1], best_start)
```

**复杂度。** 两个指针各至多移动 $n$ 次，建立 `need` 需 $O(m)$，最后一次截取需至多 $O(n)$；总时间 $O(n + m)$，额外计数空间 $O(|\Sigma|)$（不计返回的子串）。

---

## 2 KMP 求所有出现位置（允许重叠）

> 改编自：力扣 28. 找出字符串中第一个匹配项的下标（力扣只求第一次出现，本题求全部出现且允许重叠）。

**E28.找出字符串中第一个匹配项的下标**

https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/

**思路。** 按课件的约定，`next[0] = -1`；对 $i > 0$，`next[i]` 是 `P[0..i-1]` 的最长相等真前后缀长度。为处理完整匹配，沿用同一定义额外计算 `next[m]`，数组长度为 $m + 1$。文本指针 `i` 指向待比较字符，`j` 是当前已匹配的模式前缀长度。失配时令 `j = next[j]`，文本指针不回退；若 `j == -1`，则直接读入下一个文本字符并把 `j` 置回 0。当 `j == m` 时，记录 `i - m`，再令 `j = next[m]`，便可继续查找重叠出现。

**伪代码。**

```text
function getNext(P):
    m = len(P)
    next = [-1] * (m + 1)          // next[0] = -1；多算一项 next[m]
    i = 0
    k = -1
    while i < m:
        if k == -1 or P[i] == P[k]:
            i += 1
            k += 1
            next[i] = k
        else:
            k = next[k]
    return next

function kmpSearch(P, T):
    m, n = len(P), len(T)
    if m == 0: return []
    next = getNext(P)
    result = []
    i = 0
    j = 0
    while i < n:
        if j == -1 or T[i] == P[j]:
            i += 1
            j += 1
            if j == m:
                result.append(i - m)
                j = next[m]          // 保留可重叠的已匹配前缀
        else:
            j = next[j]
    return result
```

**复杂度。** 时间 $O(n + m)$；除结果列表外的额外空间 $O(m)$。

---

## 3 利用 `next` 数组求最短周期

> 对应题：力扣 459. 重复的子字符串（判断是否存在非平凡周期，本题进一步求最短周期）；OpenJudge 02406 字符串乘方（求 $S = a^k$ 的最大 $k$，即 $n / p$）。

**E459.重复的子字符串**

https://leetcode.cn/problems/repeated-substring-pattern/

**02406: 字符串乘方**

http://cs101.openjudge.cn/practice/02406/

**思路。** 用上题的 `getNext(S)`，其中额外计算的 `next[n]` 正是整个 `S` 的最长相等真前后缀（border）长度，记为 $L$。令 $p = n - L$。若 $p < n$ 且 $n \bmod p = 0$，则最短周期为 $p$；否则为 $n$。

**正确性。**

* **充分性**：$S[0..n-p-1] = S[p..n-1]$ 恰好是 border 的语义（前后缀相等，长度 $n - p = L$），即 $S[i] = S[i+p]$ 对所有合法 $i$ 成立；再加上 $p \mid n$，就能推出 $S = (S[0..p-1])^{n/p}$。由于 $L$ 是最长 border，$p = n - L$ 是 $S$ 的最小（广义）周期，因而也是最短的整除周期。
* **必要性**（补充）：若 $p \nmid n$，则不存在长度 $q < n$ 且 $q \mid n$ 的周期。反设存在这样的 $q$，则 $q \le n/2$，且 $p \le q$（$p$ 是最小周期），于是 $p + q \le n$。由周期引理（Fine–Wilf），$\gcd(p, q)$ 也是 $S$ 的周期；由 $p$ 最小得 $\gcd(p, q) = p$，即 $p \mid q \mid n$，矛盾。

**伪代码。**

```text
function shortestPeriod(S):
    n = len(S)
    if n == 0: return 0
    next = getNext(S)               // 复用上题的 getNext
    L = next[n]                     // 整个 S 的最长 border 长度
    p = n - L
    if p < n and n % p == 0:
        return p
    else:
        return n
```

**复杂度。** `getNext` 为 $O(n)$，主函数常数时间；总计 $O(n)$ 时间、$O(n)$ 额外空间（`next` 数组）。

---

## 4 单次遍历原地删除 `'b'` 与级联 `"ac"`

> 非力扣原题，是经典面试题（Techie Delight 上有同构题 "Remove all occurrences of AB and C"）。思路与下面两道力扣题一致——把写指针左侧当作栈，新字符与"栈顶"配对消除：
>
> **E2696.删除子串后的字符串最小长度**（删除 `"AB"`、`"CD"`，级联）
>
> https://leetcode.cn/problems/minimum-string-length-after-removing-substrings/
>
> **E1047.删除字符串中的所有相邻重复项**
>
> https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/

**思路。** 使用两个指针 `i`（读指针）和 `j`（写指针），`S[0..j-1]` 是目前保留下来的结果，可以看成一个"栈"，`S[j-1]` 是栈顶：

* 初始 `i = 0`，`j = 0`。
* 对每个 `S[i]`：
  1. 若 `S[i] == 'b'`，跳过（仅 `i++`，不写入）。
  2. 否则记 `c = S[i]`。若 `c == 'c'` 且 `j > 0` 且 `S[j-1] == 'a'`，说明当前 `'c'` 与结果末尾的 `'a'` 构成一个 `"ac"`，把那个 `'a'` 弹出（`j--`），当前 `'c'` 也不写入（仅 `i++`）。
  3. 否则将 `S[j] = c`，`j++`，`i++`。

级联删除的正确性：弹出 `'a'` 后，新的栈顶 `S[j-1]` 自动成为下一个字符的比较对象，因此"删掉 `ac` 后新变得相邻的 `a`、`c`"会在后续读到 `'c'` 时被检测到；而 `'b'` 根本不写入，所以 `a b c` 这类被 `'b'` 隔开的 `a`、`c` 也会直接相邻并被删除。由于写指针 $j \le i$ 恒成立，写入不会覆盖尚未读取的字符，可以就地进行。

**伪代码。**

```text
function remove_b_and_ac_inplace(s):
    n = len(s)
    i = 0
    j = 0
    while i < n:
        c = s[i]
        if c == 'b':
            i += 1
            continue
        if c == 'c' and j > 0 and s[j - 1] == 'a':
            j -= 1                   // 弹出 'a'，跳过当前 'c'
            i += 1
            continue
        s[j] = c
        j += 1
        i += 1
    return j                         // 新长度，结果为 s[0..j-1]
```

以 `"aaccac"` 为例：`a`、`a` 入栈 → `c` 与栈顶 `a` 抵消 → `c` 与栈顶 `a` 抵消（级联）→ `a` 入栈 → `c` 抵消，最终长度 0。

**复杂度分析。**

* 读指针 `i` 单调右移，恰好 $n$ 次；每轮循环只做 $O(1)$ 次读、写、比较。写指针 `j` 每轮至多 $+1$ 或 $-1$，不会引起额外的回溯扫描，故总时间 $O(n)$。
* 额外空间 $O(1)$（只用到几个指针 / 临时变量，`S` 被就地修改）。

> **修正说明**：原答案复杂度分析中写"指针 `i`、`j` 单调右移，`j` 仅在弹出 `'a'` 时减小"，前后矛盾（`j` 并不单调）；已改为只有 `i` 单调、每轮 $O(1)$ 的论证。另补充了 $j \le i$ 保证就地写入安全的说明。
