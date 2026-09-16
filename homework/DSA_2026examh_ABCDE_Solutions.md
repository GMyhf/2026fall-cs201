# 2026 数算A（实验班）上机考试 A–E：Python / C++ 题解

*Updated: 2026-09-16 15:20 (GMT+8)*  
*Compiled by Hongfei Yan (2026 Fall)*  
*题目出处：<http://dsa.openjudge.cn/2026examh/>*

> 五道题都给出**完整可提交的 Python 与 C++ 代码**及推导过程。每题结尾附本机实测耗时（最大规模构造数据），供判断 CPython 是否够用。
>
> 所有代码都做过验证：小数据与暴力/穷举对拍，大数据跑最大规模构造样例。具体见每题的「验证」小节。

## 总览

| 题 | 名称 | 考点 | 核心算法 | 复杂度 | 考场通过 |
| :-- | :--- | :--- | :--- | :--- | :--- |
| A | Familiar？ | 堆 | 逆向撤销插入 + 正向模拟校验 | $O(n\log n)$ | 54 / 59 |
| B | 环形匹配 | 字符串 | 周期性约简 + KMP on $s+s$ | $O(n+m)$ | 52 / 58 |
| C | 中转网络 | 图论 | 拆点建虚拟节点 + 4 层 Dijkstra | $O((n+k+m+S)\log)$ | 36 / 53 |
| D | 嵌套窗口 | 树状数组 | 拆式子 + 二维偏序四元前缀和 | $O(n\log R)$ | 51 / 58 |
| E | 树上消消乐 | 树 + 贪心 | 奇偶分析 + 边定向 + 堆贪心 | $O(n\log n)$ | **17 / 53** |

> 「考场通过」= OpenJudge 上的 通过人数 / 尝试人数。**E 是断崖，C 次之**；A、B、D 属于「想到了就能写出来」的类型。详细的考点拆解见文末 [§ 考点分析](#考点分析)。

**通用 I/O 模板**：

```python
# Python：input() 在 2e5 量级会明显拖慢，一次性读入
import sys
data = sys.stdin.buffer.read().split()
```

```cpp
// C++：关掉与 stdio 的同步，cin 就够快了
ios::sync_with_stdio(false);
cin.tie(nullptr);
```

---

# A. Familiar？

> 全局题号 31188，<http://dsa.openjudge.cn/2026examh/A/>  
> 时限 1000ms / 测试点，内存 512MB

## 题意

小根堆用数组维护，下标从 1 开始，位置 $i$ 的父节点是 $\lfloor i/2\rfloor$。从空堆开始依次插入 $n$ 个**两两不同**的整数，第 $i$ 次把新元素放到位置 $i$ 再执行 SiftUp：

```text
SiftUp(i):
    while i > 1:
        p = floor(i / 2)
        if heap[p] < heap[i]:
            break
        swap(heap[p], heap[i])
        i = p
```

记第 $i$ 次插入的交换次数为 $c_i$。给出最终堆数组 $h_1..h_n$（保证是合法小根堆）和日志 $c_1..c_n$，问是否存在插入序列产生它们；存在则输出任意一个。

$1\le n\le 2\times10^5$，$-10^9\le h_i\le 10^9$，$0\le c_i\le\lfloor\log_2 i\rfloor$。

## 思路

### 关键观察：最后一次插入是可以「倒放」的

第 $i$ 次插入时，新元素 $x_i$ 从位置 $i$ 出发，向上交换了 $c_i$ 次，所以它**停在位置**

$$\textit{pos} = i \gg c_i$$

而它路过的那条祖先链 $p_0=i,\; p_1=i\gg1,\; \dots,\; p_{c_i}=i\gg c_i$ 上，其余元素**各自下移了一层**：

$$h_{\text{new}}[p_j] = h_{\text{old}}[p_{j+1}]\quad(j=0,\dots,c_i-1),\qquad h_{\text{new}}[p_{c_i}] = x_i$$

于是「撤销第 $i$ 次插入」是**完全确定**的一步：

$$x_i = h[i \gg c_i],\qquad h[p_j] \leftarrow h[p_{j-1}]\ \ (j = c_i, c_i-1, \dots, 1),\qquad \text{再丢掉下标 } i$$

注意赋值要**从 $j=c_i$ 倒着做到 $j=1$**，否则会覆盖掉还没用的值。

### 为什么还要正着验一遍

倒推是唯一的，所以**如果答案存在，它一定是倒推出来的那个**。但倒推本身不检查日志的自洽性——例如某个 $c_i$ 给大了，倒推照样能跑完，只是还原出的中间堆已经不是合法小根堆了。

局部判断能写，但边界条件很碎（要逐个检查路径上每个结点与其「另一个孩子」的大小关系）。更稳妥、也更好写的做法是：**倒推拿到候选序列 $x$，再正着完整模拟一遍**，比对每次的交换次数和最终数组。两遍的总代价都是 $O(\sum c_i)=O(n\log n)$，量级不变。

> 正向模拟用「空穴法」：不真的 swap，而是把父结点往下挪，最后把 $x$ 落位。这与题面的 swap 语义等价，但少一半赋值。

## Python 代码

```python
import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    h0 = [0]*(n+1)
    for i in range(1, n+1):
        h0[i] = int(data[i])
    c = [0]*(n+1)
    for i in range(1, n+1):
        c[i] = int(data[n+i])

    # ---- 逆推：倒着撤销第 n, n-1, ..., 1 次插入 ----
    h = h0[:]
    x = [0]*(n+1)
    ok = True
    for i in range(n, 0, -1):
        ci = c[i]
        if ci < 0 or (i >> ci) < 1:
            ok = False
            break
        x[i] = h[i >> ci]              # 这次插入的元素停在 i >> ci
        j = ci
        while j >= 1:                  # 祖先链上的值整体上移一层（倒着赋值）
            h[i >> j] = h[i >> (j-1)]
            j -= 1

    # ---- 正推验证：交换次数与最终数组都要对上 ----
    if ok:
        heap = [0]*(n+2)
        for i in range(1, n+1):
            v = x[i]
            k = i
            sw = 0
            while k > 1:
                p = k >> 1
                if heap[p] < v:
                    break
                heap[k] = heap[p]      # 空穴法：父结点下移
                k = p
                sw += 1
            heap[k] = v
            if sw != c[i]:
                ok = False
                break
        if ok:
            for i in range(1, n+1):
                if heap[i] != h0[i]:
                    ok = False
                    break

    if not ok:
        sys.stdout.write("NO\n")
    else:
        sys.stdout.write("YES\n" + ' '.join(map(str, x[1:])) + "\n")

main()
```

## C++ 代码

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> h0(n + 1), h(n + 1);
    for (int i = 1; i <= n; ++i) cin >> h0[i];
    vector<int> c(n + 1);
    for (int i = 1; i <= n; ++i) cin >> c[i];

    h = h0;
    vector<long long> x(n + 1);
    bool ok = true;

    // ---- 逆推：倒着撤销第 n, n-1, ..., 1 次插入 ----
    for (int i = n; i >= 1; --i) {
        int ci = c[i];
        if (ci < 0 || ci >= 31 || (i >> ci) < 1) { ok = false; break; }
        x[i] = h[i >> ci];                   // 这次插入的元素停在 i >> ci
        for (int j = ci; j >= 1; --j) {      // 祖先链上的值整体上移一层（倒着赋值）
            h[i >> j] = h[i >> (j - 1)];
        }
    }

    // ---- 正推验证：交换次数与最终数组都要对上 ----
    if (ok) {
        vector<long long> heap(n + 2, 0);
        for (int i = 1; i <= n && ok; ++i) {
            long long v = x[i];
            int k = i, sw = 0;
            while (k > 1) {
                int p = k >> 1;
                if (heap[p] < v) break;
                heap[k] = heap[p];           // 空穴法：父结点下移
                k = p;
                ++sw;
            }
            heap[k] = v;
            if (sw != c[i]) ok = false;
        }
        for (int i = 1; i <= n && ok; ++i) {
            if (heap[i] != h0[i]) ok = false;
        }
    }

    if (!ok) {
        cout << "NO\n";
    } else {
        cout << "YES\n";
        for (int i = 1; i <= n; ++i) cout << x[i] << " \n"[i == n];
    }
    return 0;
}
```

## 复杂度与实测

- 时间 $O\!\left(n + \sum_i c_i\right) = O(n\log n)$，空间 $O(n)$。
- 最坏数据（按 $n, n-1, \dots, 1$ 递减插入，每次都上浮到根，$\sum c_i \approx 3.14\times10^6$）：Python **0.53 s** / C++ **0.04 s**。

## 验证

- $n\le 6$ 时**穷举**所有合法小根堆（$1..n$ 的排列）× 所有合法日志向量，与「枚举全部 $n!$ 个插入序列」得到的可达集合逐一比对：`n=6` 共 2160 组，全部一致；判 YES 的还额外模拟验证输出序列确实产生给定的 $(h,c)$。
- 两个样例输出与题面完全一致（样例 1 恰好也是 `5 3 8 1 6 4 2`）。

---

# B. 环形匹配

> 全局题号 31189，<http://dsa.openjudge.cn/2026examh/B/>  
> 时限 1000ms / 测试点

## 题意

字符串 $s$ 长 $n$，首尾相接成环。模式串 $t$ 长 $m$。对每个位置 $i\ (1\le i\le n)$，$r_i$ 表示从 $i$ 出发沿环读 $m$ 个字符：$r_i$ 的第 $j$ 个字符是 $s_{((i+j-2)\bmod n)+1}$。**$m$ 可以大于 $n$**，此时会绕环多周。求所有满足 $r_i=t$ 的 $i$。

$1\le n,m\le 5\times10^5$。

## 思路

### 第一步：把 $m>n$ 的情况约简掉

若 $m>n$，由定义 $r_i[j+n]=r_i[j]$（只要 $j+n<m$），所以

$$r_i=t \implies t \text{ 以 } n \text{ 为周期}$$

即 `t[n:] == t[:m-n]`。**这个条件与 $i$ 无关**：不满足就直接输出 0。

反过来，若 $t$ 以 $n$ 为周期，则 $t[j]=t[j\bmod n]$，于是

$$r_i = t \iff t[0{:}n] = r_i[0{:}n] = (\text{$s$ 从 $i$ 开始的长度 $n$ 的旋转})$$

所以只要拿 $p=t[0{:}n]$ 去匹配即可。**$m>n$ 被彻底消掉了**，剩下的永远是「模式串长度 $\le n$」。

### 第二步：环 → 破环成链

长度 $\le n$ 的模式从位置 $i$ 出发最多绕一圈，所以在 $u=s+s$（长 $2n$）上做普通匹配，只保留起点 $<n$ 的匹配即可，答案 $i=\textit{pos}+1$。

起点 $\textit{pos}\le n-1$ 时终点 $\le (n-1)+(n-1) = 2n-2 < 2n$，不会越界。

### 第三步：KMP

课上讲过的标准 KMP：先对模式串求 `fail` 数组（最长相同前后缀），再在文本上扫一遍，匹配成功后用 `k = fail[k-1]` 回退以支持**重叠匹配**（样例 3 的 `ababab` / `abab` 就是重叠的）。

由于结果按起点递增产生，一旦 $\textit{pos}\ge n$ 就可以直接 `break`。

## Python 代码

```python
import sys

def kmp_occurrences(text, pat, limit):
    """返回 pat 在 text 中所有出现的起点（0-based），只保留 < limit 的。"""
    m = len(pat)
    fail = [0]*m
    k = 0
    for i in range(1, m):                  # 求 fail 数组
        ch = pat[i]
        while k and pat[k] != ch:
            k = fail[k-1]
        if pat[k] == ch:
            k += 1
        fail[i] = k

    res = []
    k = 0
    for i, ch in enumerate(text):          # 扫文本
        while k and pat[k] != ch:
            k = fail[k-1]
        if pat[k] == ch:
            k += 1
        if k == m:
            st = i - m + 1
            if st >= limit:                # 起点递增，越界即可停
                break
            res.append(st)
            k = fail[k-1]                  # 允许重叠匹配
    return res

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0]); m = int(data[1])
    s = data[2].decode()
    t = data[3].decode()

    if m > n:
        # 绕环多周 => t 必须以 n 为周期，否则无解
        if t[n:] != t[:m-n]:
            sys.stdout.write("0\n")
            return
        pat = t[:n]
    else:
        pat = t

    pos = kmp_occurrences(s + s, pat, n)
    out = [str(len(pos))]
    if pos:
        out.append(' '.join(str(p+1) for p in pos))
    sys.stdout.write('\n'.join(out) + '\n')

main()
```

## C++ 代码

```cpp
#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n, m;
    if (!(cin >> n >> m)) return 0;
    string s, t;
    cin >> s >> t;

    string pat;
    if (m > n) {
        // 绕环多周 => t 必须以 n 为周期，否则无解
        if (t.compare(n, m - n, t, 0, m - n) != 0) {
            cout << "0\n";
            return 0;
        }
        pat = t.substr(0, n);
    } else {
        pat = t;
    }

    const string text = s + s;                 // 破环成链
    const size_t M = pat.size();

    vector<int> fail(M, 0);                    // 失配函数
    for (size_t i = 1, k = 0; i < M; ++i) {
        while (k && pat[k] != pat[i]) k = fail[k - 1];
        if (pat[k] == pat[i]) ++k;
        fail[i] = static_cast<int>(k);
    }

    vector<long long> res;
    for (size_t i = 0, k = 0; i < text.size(); ++i) {
        while (k && pat[k] != text[i]) k = fail[k - 1];
        if (pat[k] == text[i]) ++k;
        if (k == M) {
            long long st = static_cast<long long>(i) - static_cast<long long>(M) + 1;
            if (st >= n) break;                // 起点递增，越界即可停
            res.push_back(st + 1);
            k = fail[k - 1];                   // 允许重叠匹配
        }
    }

    cout << res.size() << '\n';
    for (size_t i = 0; i < res.size(); ++i) cout << res[i] << " \n"[i + 1 == res.size()];
    return 0;
}
```

## 复杂度与实测

- 时间 $O(n+m)$，空间 $O(n+m)$。周期判断 `t[n:] == t[:m-n]` 是 C 层面的整段比较，$O(m)$ 但常数极小。
- $n=m=5\times10^5$，全 `a`（50 万个匹配位置）：Python **0.29 s** / C++ **0.03 s**。随机 `ab` 串（0 个匹配，KMP 跑满 $10^6$ 字符）：Python **0.15 s**。

> **一个偷懒但危险的写法**：用 `u.find(p, start)` 循环找下一个。在「$s$ 全是 `a`」这类高度周期的数据上，每次 `find` 都要做一次长度为 $m$ 的比较，退化成 $O(nm)$。KMP 没有这个问题。

## 验证

3000 组随机小数据（字母表 `a`/`ab`/`abc`，$n\le7$，$m\le12$，一半刻意构造成有解）与 $O(nm)$ 暴力环形匹配逐位对拍，全部一致；三个样例输出与题面一致。

---

# C. 中转网络

> 全局题号 31190，<http://dsa.openjudge.cn/2026examh/C/>  
> 时限 1500ms / 测试点

## 题意

$n$ 点 $m$ 条带权无向边，点 $v$ 有处理费用 $a_v\ge0$。另有 $k$ 个中转组，同组内两点可以 0 费用直达。路线 $v_0=1,\dots,v_t=n$ 的费用为

$$\sum_{i=1}^{t} b_i \;+\; \sum_{i=0}^{t} a_{v_i} \;-\; \max_{0\le i\le t} a_{v_i} \;+\; \min_{0\le i\le t} a_{v_i}$$

其中 $b_i$ 是第 $i$ 步的边权（走中转组则为 0）。点和边都可以重复经过。求最小费用。

$2\le n\le2\times10^5$，$0\le m,k\le2\times10^5$，$0\le S=\sum s_g\le2\times10^5$，$a_v,w\le10^9$。

## 思路

### 第一步：读懂这个费用

$\sum_{i=0}^{t}a_{v_i}$ 是**按经过次数**累加的（同一个点走两次就付两次）。然后：

- **减一个 $\max$**：最贵的那个点白嫖一次；
- **加一个 $\min$**：最便宜的那个点多付一次。

样例验算：路线 $1\to2$（边权 3）$\to3$（中转，0）$\to4$（边权 1）。$\sum b=4$，$\sum a=5+2+8+4=19$，$\max=8$，$\min=2$，合计 $4+19-8+2=17$ ✓。

### 第二步：干掉 max / min —— 松弛成「任选两点」

$\max/\min$ 依赖整条路线，不是马尔可夫的，没法直接塞进最短路。但注意我们在**求最小值**：

对路线上任意两个经过的点 $p,q$ 都有 $-a_p \ge -\max$ 且 $+a_q \ge +\min$，所以

$$\text{base} - a_p + a_q \;\ge\; \text{base} - \max + \min$$

取 $p=\arg\max$、$q=\arg\min$ 时取等。因此

$$\text{答案} \;=\; \min_{\text{路线}}\ \min_{p,q\ \text{经过}}\ \bigl(\text{base} - a_p + a_q\bigr)$$

**于是算法可以「随便挑」两个经过的点**当作 $p,q$：挑错了只会算大，不会算小，最小值仍然正确。（允许 $p=q$，此时该项为 base，同样是合法上界。）

### 第三步：把负权消掉

直接建「在某点把状态从 0 翻到 1，代价 $-a_v$」会产生**负权边**，Dijkstra 不能用。换个说法就好了：

- 减去 $a_p$ 和「到达 $p$ 时付 $a_p$」正好抵消 $\Rightarrow$ **这一次到达免费**（系数 0）；
- 加上 $a_q$ 就是 **这一次到达付双倍**（系数 2）。

于是把节点费用摊到「到达」上：到达实点 $y$ 的代价是 $a_y \times (1 - d_i + d_j)$，其中 $d_i\in\{0,1\}$ 表示在这里用掉折扣、$d_j\in\{0,1\}$ 表示在这里用掉附加。系数只可能是 $0,1,2$，**全非负**，Dijkstra 可用。

### 第四步：中转组拆点

把每个中转组建成一个**虚拟节点** $n+g$，组内每个点与它双向连 0 权边。这样组内任意两点互达的代价是 0，边数从 $O(s_g^2)$ 降到 $O(s_g)$，总边数 $O(m+S)$。

虚拟节点**不是真实节点**：到达它不付节点费用，也不能在它身上用折扣/附加。

### 第五步：分层 Dijkstra

状态 $(v, i, j)$，$i$ = 折扣是否已用，$j$ = 附加是否已用，共 $4(n+k)$ 个状态。编码成整数 `v*4 + (i*2+j)`。

起点（$v_0=1$，本来就要付 $a_1$，折扣/附加也可以就用在它身上）：

| 状态 | 含义 | 初值 |
| :-- | :-- | :-- |
| $(1,0,0)$ | 都没用 | $a_1$ |
| $(1,1,0)$ | 折扣用在 1 | $0$ |
| $(1,0,1)$ | 附加用在 1 | $2a_1$ |
| $(1,1,1)$ | 都用在 1 | $a_1$ |

答案是 $\textit{dist}[(n,1,1)]$——**必须两个都用掉**才是合法的费用表达式。

## Python 代码

```python
import sys
from heapq import heappush, heappop

def main():
    data = sys.stdin.buffer.read().split()
    it = iter(data)
    n = int(next(it)); m = int(next(it)); k = int(next(it))
    a = [0]*(n + k + 1)
    for v in range(1, n+1):
        a[v] = int(next(it))

    # 图：1..n 为真实节点，n+1..n+k 为中转组虚拟节点（链式前向星）
    N = n + k
    head = [-1]*(N+1)
    nxt = []; to = []; wt = []
    def add(u, v, w):
        to.append(v); wt.append(w); nxt.append(head[u]); head[u] = len(to)-1

    for _ in range(m):
        u = int(next(it)); v = int(next(it)); w = int(next(it))
        add(u, v, w); add(v, u, w)
    for g in range(1, k+1):
        gid = n + g
        s = int(next(it))
        for _ in range(s):
            v = int(next(it))
            add(v, gid, 0); add(gid, v, 0)

    INF = float('inf')
    # 状态 = node*4 + (i*2 + j)，i=已用折扣（某次到达免费），j=已用附加（某次到达双倍）
    dist = [INF]*((N+1)*4)
    a1 = a[1]
    start = [(a1, 0), (0, 2), (2*a1, 1), (a1, 3)]
    pq = []
    for d, st in start:
        s0 = 1*4 + st
        if d < dist[s0]:
            dist[s0] = d
            heappush(pq, (d, s0))

    target = n*4 + 3                       # 折扣和附加都必须用掉
    while pq:
        d, st = heappop(pq)
        if d > dist[st]:
            continue
        if st == target:
            break
        u, flag = st >> 2, st & 3
        i, j = flag >> 1, flag & 1
        e = head[u]
        while e != -1:
            y = to[e]; w = wt[e]
            if y > n:                      # 虚拟节点：不收节点费，也不能在此用折扣/附加
                ns = y*4 + flag
                nd = d + w
                if nd < dist[ns]:
                    dist[ns] = nd
                    heappush(pq, (nd, ns))
            else:
                ay = a[y]
                for di in range(0, 2-i):
                    for dj in range(0, 2-j):
                        nd = d + w + ay*(1 - di + dj)
                        ns = y*4 + ((i+di)*2 + (j+dj))
                        if nd < dist[ns]:
                            dist[ns] = nd
                            heappush(pq, (nd, ns))
            e = nxt[e]

    sys.stdout.write(str(dist[target]) + "\n")

main()
```

## C++ 代码

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;

    const int N = n + k;                        // 1..n 真实节点，n+1..n+k 中转组虚拟节点
    vector<long long> a(N + 1, 0);
    for (int v = 1; v <= n; ++v) cin >> a[v];

    // 链式前向星
    vector<int> head(N + 1, -1), nxt, to;
    vector<long long> wt;
    auto addEdge = [&](int u, int v, long long w) {
        to.push_back(v); wt.push_back(w);
        nxt.push_back(head[u]); head[u] = static_cast<int>(to.size()) - 1;
    };

    for (int i = 0; i < m; ++i) {
        int u, v; long long w;
        cin >> u >> v >> w;
        addEdge(u, v, w); addEdge(v, u, w);
    }
    for (int g = 1; g <= k; ++g) {
        int sz; cin >> sz;
        int gid = n + g;
        for (int i = 0; i < sz; ++i) {
            int v; cin >> v;
            addEdge(v, gid, 0); addEdge(gid, v, 0);
        }
    }

    // 状态 = node*4 + (i*2 + j)，i=已用折扣（某次到达免费），j=已用附加（某次到达双倍）
    const long long INF = (1LL << 62);
    vector<long long> dist(static_cast<size_t>(N + 1) * 4, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>,
                   greater<pair<long long, int>>> pq;

    const long long a1 = a[1];
    const pair<long long, int> starts[4] = {{a1, 0}, {0, 2}, {2 * a1, 1}, {a1, 3}};
    for (const auto& st : starts) {
        int s0 = 1 * 4 + st.second;
        if (st.first < dist[s0]) { dist[s0] = st.first; pq.push({st.first, s0}); }
    }

    const int target = n * 4 + 3;               // 折扣和附加都必须用掉
    while (!pq.empty()) {
        auto [d, st] = pq.top(); pq.pop();
        if (d > dist[st]) continue;
        if (st == target) break;
        int u = st >> 2, flag = st & 3;
        int i = flag >> 1, j = flag & 1;
        for (int e = head[u]; e != -1; e = nxt[e]) {
            int y = to[e];
            long long w = wt[e];
            if (y > n) {                        // 虚拟节点：不收节点费，也不能在此用折扣/附加
                int ns = y * 4 + flag;
                long long nd = d + w;
                if (nd < dist[ns]) { dist[ns] = nd; pq.push({nd, ns}); }
            } else {
                long long ay = a[y];
                for (int di = 0; di < 2 - i; ++di) {
                    for (int dj = 0; dj < 2 - j; ++dj) {
                        long long nd = d + w + ay * (1 - di + dj);
                        int ns = y * 4 + ((i + di) * 2 + (j + dj));
                        if (nd < dist[ns]) { dist[ns] = nd; pq.push({nd, ns}); }
                    }
                }
            }
        }
    }

    cout << dist[target] << '\n';
    return 0;
}
```

## 复杂度与实测

- 状态数 $4(n+k)$，每条有向边最多派生 9 种层间转移，时间 $O\bigl((m+S)\log(n+k)\bigr)$ 级别。
- $n=m=2\times10^5,\ k=2000,\ S=2\times10^5$（权值随机）：Python **2.6 ~ 2.9 s**（峰值内存约 200 MB）/ C++ **0.27 s**（37 MB）。

> **这是五题里 CPython 压力最大的一道**，超了 1.5 s 的单点限制。能进一步压常数的方向：把 `heappush` 的元组换成 `d * 4(N+1) + st` 的单个整数（减少元组分配）、把 `dist` 换成 `array('q')`。要稳过还是得 C++。算法本身是对的，先保证 Subtask 1/2/3 的分。

## 验证

274 组随机小图（$n\le4$，含自环/重边/中转组）与「枚举全部长度 $\le8$ 的走法、直接按题面公式算费用」的暴力搜索对拍，全部一致；样例输出 17 与题面一致。

> 一开始写错了 flag 的位序（把 $i$、$j$ 的含义对调），样例输出 10。这类 bug 靠样例就能发现，**分层最短路一定要把状态编码写在注释里**。

---

# D. 嵌套窗口

> 全局题号 31191，<http://dsa.openjudge.cn/2026examh/D/>  
> 时限 2000ms / 测试点

## 题意

$n$ 个闭区间 $[l_i,r_i]$，$0\le l_i<r_i\le 40000$。若 $l_i<l_j<r_j<r_i$ 称窗口 $i$ **严格包含** $j$。对每个这样的有序对，再选整数 $x,y$ 满足

$$l_i\le x<l_j,\qquad r_j<y\le r_i$$

方案由四元组 $(i,j,x,y)$ 确定，求方案总数。$1\le n\le2\times10^5$。

## 思路

### 第一步：把四元组变成两个因子

给定一对 $(i,j)$：$x$ 有 $l_j-l_i$ 种取法，$y$ 有 $r_i-r_j$ 种取法。又因为题目已保证 $l_j<r_j$，**条件 $l_i<l_j<r_j<r_i$ 等价于 $l_i<l_j$ 且 $r_j<r_i$**（中间那个不等号是白送的）。所以

$$\text{答案} = \sum_{\substack{l_i<l_j\\ r_j<r_i}} (l_j-l_i)(r_i-r_j)$$

这是一个**二维偏序求和**：对每个 $i$，要统计「$l_j>l_i$ 且 $r_j<r_i$」的那批 $j$。

### 第二步：把乘积拆开

$$(l_j-l_i)(r_i-r_j) = l_j r_i - l_j r_j - l_i r_i + l_i r_j$$

对固定的 $i$ 求和，需要那批 $j$ 的四个量：

$$S_0=\sum 1,\qquad S_1=\sum l_j,\qquad S_2=\sum r_j,\qquad S_3=\sum l_j r_j$$

于是 $i$ 的贡献是

$$r_i S_1 \;-\; S_3 \;-\; l_i r_i S_0 \;+\; l_i S_2$$

### 第三步：一维扫描 + 树状数组

把窗口按 $l$ **从大到小**排序后依次处理。处理到 $i$ 时，已经插入树状数组的都满足 $l_j>l_i$；再用树状数组按 $r$ 做前缀查询（$r_j\le r_i-1$），就得到了那四个 $S$。

**$l$ 相同的一批必须整批先查询、再整批插入**，否则会把 $l_j=l_i$ 的窗口误算进去（严格小于）。

四个量各开一棵树状数组（或者说一棵树状数组存四元组），下标用 $r+1$（因为 $r$ 可以取 0），规模 $R=40001$。

## Python 代码

```python
import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    L = [0]*n; R = [0]*n
    for i in range(n):
        L[i] = int(data[1+2*i]); R[i] = int(data[2+2*i])

    SZ = 40002                       # r 取值 [0, 40000]，树状数组下标用 r+1
    c0 = [0]*(SZ+1)                  # 计数         sum 1
    c1 = [0]*(SZ+1)                  # sum l_j
    c2 = [0]*(SZ+1)                  # sum r_j
    c3 = [0]*(SZ+1)                  # sum l_j * r_j

    order = sorted(range(n), key=lambda i: -L[i])   # 按 l 从大到小

    ans = 0
    p = 0
    while p < n:
        q = p
        cur = L[order[p]]
        while q < n and L[order[q]] == cur:         # l 相同的一批一起处理
            q += 1

        # 先查询：此时树状数组里只有 l_j > cur 的窗口
        for t in range(p, q):
            i = order[t]
            li = L[i]; ri = R[i]
            s0 = s1 = s2 = s3 = 0
            x = ri                                  # 前缀：r_j <= ri - 1
            while x > 0:
                s0 += c0[x]; s1 += c1[x]; s2 += c2[x]; s3 += c3[x]
                x -= x & -x
            ans += ri*s1 - s3 - li*ri*s0 + li*s2

        # 再插入这一批（保证严格 l_i < l_j）
        for t in range(p, q):
            i = order[t]
            li = L[i]; ri = R[i]; lr = li*ri
            x = ri + 1
            while x <= SZ:
                c0[x] += 1; c1[x] += li; c2[x] += ri; c3[x] += lr
                x += x & -x
        p = q

    sys.stdout.write(str(ans) + "\n")

main()
```

## C++ 代码

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> L(n), R(n);
    for (int i = 0; i < n; ++i) cin >> L[i] >> R[i];

    const int SZ = 40002;                       // r 取值 [0, 40000]，下标用 r+1
    vector<long long> c0(SZ + 1, 0), c1(SZ + 1, 0), c2(SZ + 1, 0), c3(SZ + 1, 0);

    vector<int> order(n);
    iota(order.begin(), order.end(), 0);
    sort(order.begin(), order.end(), [&](int x, int y) { return L[x] > L[y]; });

    long long ans = 0;
    int p = 0;
    while (p < n) {
        int q = p, cur = L[order[p]];
        while (q < n && L[order[q]] == cur) ++q;        // l 相同的一批一起处理

        for (int t = p; t < q; ++t) {                   // 先查询：表中只有 l_j > cur
            int i = order[t];
            long long li = L[i], ri = R[i];
            long long s0 = 0, s1 = 0, s2 = 0, s3 = 0;
            for (int x = R[i]; x > 0; x -= x & -x) {    // 前缀：r_j <= ri - 1
                s0 += c0[x]; s1 += c1[x]; s2 += c2[x]; s3 += c3[x];
            }
            ans += ri * s1 - s3 - li * ri * s0 + li * s2;
        }
        for (int t = p; t < q; ++t) {                   // 再插入这一批
            int i = order[t];
            long long li = L[i], ri = R[i], lr = li * ri;
            for (int x = R[i] + 1; x <= SZ; x += x & -x) {
                c0[x] += 1; c1[x] += li; c2[x] += ri; c3[x] += lr;
            }
        }
        p = q;
    }

    cout << ans << '\n';
    return 0;
}
```

## 复杂度与实测

- 时间 $O(n\log R)$，$R=4\times10^4$，空间 $O(n+R)$。
- $n=2\times10^5$ 随机数据：Python **1.1 ~ 1.4 s**（限时 2 s，够用）/ C++ **0.06 s**。

> **数值范围**：答案可以达到 $4\times10^{18}$ 量级（构造：$10^5$ 个 $[0,40000]$ 加 $10^5$ 个 $[20000,20001]$），逼近 `long long` 上限 $9.2\times10^{18}$。C++ 必须用 `long long`（`int` 会炸）；**Python 的大整数在这里是白送的优势**。
>
> 想再快一点：把四个计数打包进**一个 Python 大整数**（移位分域，`cnt` 18 位 / `sum_l`、`sum_r` 各 33 位 / `sum_lr` 49 位），树状数组就只剩一个数组、一次加法。

## 验证

1500 组随机小数据（$n\le9$，坐标上界 4/6/20）与 $O(n^2)$ 暴力枚举对拍，全部一致；三个样例输出 23 / 4 / 0 与题面一致。

---

# E. 树上消消乐

> 全局题号 31192，<http://dsa.openjudge.cn/2026examh/E/>  
> 时限 1000ms / 测试点，通过 17 / 53，**本场最难**

## 题意

$n$ 个点的树，点 $v$ 上有整数 $a_v$。记 $S_v$ 为 $v$ **尚未被删除**的邻居的 $a$ 之和（无邻居则 0）。每次可以选一个未删除且满足 $a_v+S_v\equiv1\pmod 2$ 的点删掉（连带其边）。问能否删光；能则输出**字典序最小**的删除顺序，否则输出 NO。

$1\le n\le2\times10^5$，$1\le a_v\le10^9$。

## 思路

### 第一步：一切都在模 2 下

令 $b_v=a_v\bmod 2$，把点分成**奇点**（$b=1$）和**偶点**（$b=0$）。条件 $a_v+S_v\equiv1$ 只关心**还活着的奇邻居有多少个**。记 $\mathrm{cnt}(v)$ = 当前存活的奇邻居数：

| $v$ 的类型 | 可删条件 | 删除后对别人的影响 |
| :--- | :--- | :--- |
| 偶点（$b_v=0$） | $\mathrm{cnt}(v)$ 是**奇数** | **没有任何影响**（$b_v=0$，不改变任何人的 $S$ 的奇偶） |
| 奇点（$b_v=1$） | $\mathrm{cnt}(v)$ 是**偶数** | 所有存活邻居的 $\mathrm{cnt}$ 减 1 |

**关键分解**：只有奇点之间的边会互相影响。把所有奇点和它们之间的边取出来，得到一个**森林 $F$**（树的导出子图一定是森林）。于是

> 奇点 $v$ 可删 $\iff$ 它在**当前剩余的 $F$** 中的度数是偶数。

偶点则完全是「搭便车」的：它不影响任何人，只需要在某个 $\mathrm{cnt}$ 为奇数的时刻把自己删掉。

### 第二步：什么时候有解

**结论（可行性不变量）**：当前局面能删光，当且仅当

- **(I1)** $F$ 的**每个连通分量的点数都是奇数**；
- **(I2)** 每个存活的偶点**至少还有一个存活的奇邻居**。

**(I2) 必要**：偶点 $u$ 若 $\mathrm{cnt}(u)=0$，它的条件永远是 $0\equiv1$，永远删不掉。

**(I1) 必要**：在 $F$ 的一个分量里删一个度数为偶数的点，**删掉的边数是偶数**。一棵 $p$ 个点的树有 $p-1$ 条边，要全部删完（最终 0 条），必须 $p-1$ 为偶数，即 $p$ 为奇数。分量分裂后对每个子分量递归同理。

**充分性（构造）**：只要 (I1)(I2) 成立，就按下面的办法走：每次在 $F$ 里挑一个合法的点 $v$ 删；删 $v$ 之前，先把那些「只剩 $v$ 这一个奇邻居」的偶点删掉（它们此时 $\mathrm{cnt}=1$ 是奇数，正好可删）。这样 (I2) 一直成立，最后 $F$ 空了，由 (I2) 偶点也都没了。

> 样例 2（$a=3\ 5\ 7\ 9$，链 1-2-3-4）：全是奇点，$F$ 就是这条 4 个点的链，分量大小 4 是偶数 $\Rightarrow$ **NO** ✓

### 第三步：$F$ 里到底该删哪个点 —— 「度数偶」是不够的

$p=5$ 的链 `1-2-3-4-5`：度数为偶的点是 2、3、4。但**删 3 会把链劈成 $\{1,2\}$ 和 $\{4,5\}$ 两个偶数分量，立刻死局**。所以正确条件是：

> 奇点 $v$ 可以作为（成功序列的）一步，当且仅当 **$F-v$ 的每个分量大小都是奇数**。

（这个条件自动蕴含度数为偶：$\sum$ 分量大小 $=p-1$ 为偶，若全奇则分量个数 = 度数为偶。）

### 第四步：把它变成「边定向」——本题最漂亮的一步

设分量大小 $|C|$ 为奇数。对一条边 $e=(u,v)$，删掉 $e$ 把 $C$ 分成两侧，两侧大小之和 $=|C|$ 为奇 $\Rightarrow$ **恰好一侧是偶数**。

> 把 $e$ **定向指向「自己那一侧是偶数」的那个端点**。每条边都恰好有唯一的指向。

而 $F-v$ 中含 $u$ 的分量，正是边 $(u,v)$ 的 $u$ 侧。于是

$$v \text{ 合法} \iff \text{所有邻居侧都是奇数} \iff \text{所有 } v \text{ 侧都是偶数} \iff \textbf{所有关联边都指向 } v$$

即 **$v$ 是一个「汇点」**（入度 = 度数）。

**汇点一定存在**：从任意点出发，只要有一条边不指向自己就沿它走过去。因为这条边指向对方，不会被反向走回来，而树上无环，所以这条路径不会重复用边，必然在有限步后停在一个所有边都指向它的点上。

**更妙的是：这个定向永远不会变。** 设 $v$ 是汇点、度数 $d$（偶），删掉 $v$ 后对留在分支 $B$ 里的边 $(u,w)$（$w$ 侧原本朝着 $v$）：

$$|w\text{ 侧（在 }C\text{ 中）}| = 1 + \sum_{\text{其余 } d-1 \text{ 个分支}}|B_j| + |w\text{ 侧（在 }B\text{ 中）}|$$

每个分支都是奇数，共 $d-1$ 个，故 $|w$ 侧$|$ 的奇偶变化量 $\equiv 1+(d-1)= d \equiv 0 \pmod 2$。**奇偶不变，定向不变。**

所以定向**只需在原始森林上算一次**：把每个分量随便定根、DFS 求子树大小 `sz`，对树边 $(p,c)$：

- `sz[c]` 为**奇** $\Rightarrow$ 边指向 $p$（对 $c$ 而言是「向外」）；
- `sz[c]` 为**偶** $\Rightarrow$ 边指向 $c$（对 $p$ 而言是「向外」）。

记 `pending[v]` = $v$ 关联的**背离自己**的存活边数，则 **$v$ 在 $F$ 中可删 $\iff$ `pending[v] == 0`**。删掉汇点 $v$ 时，它的每条边都指向自己、背离对面，所以每个存活邻居 $w$ 的 `pending[w]` 减 1。$O(1)$ 维护。

### 第五步：奇点还要让着偶点

若奇点 $v$ 有一个偶邻居 $u$ 且 $\mathrm{cnt}(u)=1$（$u$ 只剩 $v$ 一个奇邻居），那么**先删 $v$ 会让 $u$ 永远删不掉**，违反 (I2)。记

$$\mathrm{block}[v] = \#\{\text{存活偶邻居 } u : \mathrm{cnt}(u)=1\}$$

于是最终的**可删判定**：

$$\text{偶点 } v:\ \mathrm{cnt}(v)\ \text{为奇}\qquad\qquad \text{奇点 } v:\ \texttt{pending}[v]=0\ \wedge\ \texttt{block}[v]=0$$

这两种操作都**保持 (I1)(I2)**，而 (I1)(I2) 又保证还能删光，所以**每一步取编号最小的可删点**就是字典序最小的答案——用一个小根堆即可。

> `cnt[u]` 从 2 降到 1 时要给它「唯一剩下的奇邻居」加 `block`；找这个邻居用一个**只前进不回退的游标**（奇邻居只会消失不会复活），总代价 $O(\deg u)$ 摊还。

## Python 代码

```python
import sys
from heapq import heapify, heappush, heappop

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    b = [0]*(n+1)
    for v in range(1, n+1):
        b[v] = int(data[v]) & 1        # 只关心奇偶

    # ---- CSR 邻接表 ----
    m = n - 1
    deg = [0]*(n+2)
    us = [0]*m; vs = [0]*m
    for e in range(m):
        u = int(data[n+1+2*e]); v = int(data[n+2+2*e])
        us[e] = u; vs[e] = v
        deg[u] += 1; deg[v] += 1
    start = [0]*(n+2)
    for v in range(1, n+1):
        start[v+1] = start[v] + deg[v]
    fill = start[:]
    adj = [0]*(2*m)
    for e in range(m):
        u = us[e]; v = vs[e]
        adj[fill[u]] = v; fill[u] += 1
        adj[fill[v]] = u; fill[v] += 1

    out = sys.stdout
    # ---- 偶点：统计奇邻居个数 ----
    cnt = [0]*(n+1)
    for u in range(1, n+1):
        if b[u] == 0:
            c = 0
            for t in range(start[u], start[u+1]):
                if b[adj[t]]:
                    c += 1
            if c == 0:                 # 永远凑不出奇数 -> 无解
                out.write("NO\n"); return
            cnt[u] = c

    # ---- 奇点森林 F：分量大小必须为奇数，并给每条边定向 ----
    pending = [0]*(n+1)                # 背离 v 的剩余 F 边数；为 0 时 v 才可删
    visited = bytearray(n+1)
    parent = [0]*(n+1)
    sz = [0]*(n+1)
    for root in range(1, n+1):
        if b[root] == 0 or visited[root]:
            continue
        comp = []
        visited[root] = 1; parent[root] = 0
        stack = [root]
        while stack:                   # 迭代 DFS，n 大不能用递归
            v = stack.pop()
            comp.append(v)
            for t in range(start[v], start[v+1]):
                w = adj[t]
                if b[w] and not visited[w]:
                    visited[w] = 1; parent[w] = v; stack.append(w)
        if len(comp) % 2 == 0:         # 偶数大小的分量删不空
            out.write("NO\n"); return
        for v in comp:
            sz[v] = 1
        for v in reversed(comp):       # comp 是先序，逆序即可自底向上累加
            p = parent[v]
            if p:
                sz[p] += sz[v]
        for v in comp:
            p = parent[v]
            if p:
                # 边 (p, v)：v 那一侧大小为 sz[v]，指向「自己这侧为偶数」的端点
                if sz[v] & 1:
                    pending[v] += 1    # 边指向 p，即背离 v
                else:
                    pending[p] += 1    # 边指向 v，即背离 p

    # ---- block[v]：卡住奇点 v 的偶邻居个数（这些偶邻居只剩 v 一个奇邻居）----
    block = [0]*(n+1)
    ptr = start[:]                     # 每个偶点扫描奇邻居的游标（只前进）
    deleted = bytearray(n+1)

    def unique_live_odd(u):
        """cnt[u] == 1 时，返回 u 唯一尚存的奇邻居"""
        i = ptr[u]; end = start[u+1]
        while i < end:
            w = adj[i]
            if b[w] and not deleted[w]:
                ptr[u] = i
                return w
            i += 1
        ptr[u] = i
        return 0

    for u in range(1, n+1):
        if b[u] == 0 and cnt[u] == 1:
            block[unique_live_odd(u)] += 1

    def avail(v):
        if deleted[v]:
            return False
        if b[v] == 0:
            return cnt[v] & 1
        return pending[v] == 0 and block[v] == 0

    heap = [v for v in range(1, n+1) if avail(v)]
    heapify(heap)
    res = []
    while heap:
        v = heappop(heap)
        if not avail(v):               # 懒删除
            continue
        deleted[v] = 1
        res.append(v)
        if b[v] == 0:
            if cnt[v] == 1:            # 它原先卡着唯一的奇邻居
                z = unique_live_odd(v)
                if z:
                    block[z] -= 1
                    if avail(z): heappush(heap, z)
        else:
            for t in range(start[v], start[v+1]):
                w = adj[t]
                if deleted[w]:
                    continue
                if b[w]:
                    pending[w] -= 1    # 汇点的边都背离 w
                    if avail(w): heappush(heap, w)
                else:
                    cnt[w] -= 1
                    if cnt[w] == 1:
                        z = unique_live_odd(w)
                        if z: block[z] += 1
                    if avail(w): heappush(heap, w)

    if len(res) == n:
        out.write("YES\n" + ' '.join(map(str, res)) + "\n")
    else:
        out.write("NO\n")

main()
```

## C++ 代码

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> b(n + 1);
    for (int v = 1; v <= n; ++v) {
        long long a; cin >> a;
        b[v] = static_cast<int>(a & 1);          // 只关心奇偶
    }

    // ---- CSR 邻接表 ----
    const int m = n - 1;
    vector<int> us(m), vs(m), deg(n + 2, 0), start(n + 2, 0);
    for (int e = 0; e < m; ++e) {
        cin >> us[e] >> vs[e];
        ++deg[us[e]]; ++deg[vs[e]];
    }
    for (int v = 1; v <= n; ++v) start[v + 1] = start[v] + deg[v];
    vector<int> fill_(start), adj(2 * m);
    for (int e = 0; e < m; ++e) {
        adj[fill_[us[e]]++] = vs[e];
        adj[fill_[vs[e]]++] = us[e];
    }

    // ---- 偶点：统计奇邻居个数 ----
    vector<int> cnt(n + 1, 0);
    for (int u = 1; u <= n; ++u) {
        if (b[u]) continue;
        int c = 0;
        for (int t = start[u]; t < start[u + 1]; ++t) c += b[adj[t]];
        if (c == 0) { cout << "NO\n"; return 0; }   // 永远凑不出奇数 -> 无解
        cnt[u] = c;
    }

    // ---- 奇点森林 F：分量大小必须为奇数，并给每条边定向 ----
    vector<int> pending(n + 1, 0), parent(n + 1, 0), sz(n + 1, 0), comp, stk;
    vector<char> visited(n + 1, 0);
    for (int root = 1; root <= n; ++root) {
        if (!b[root] || visited[root]) continue;
        comp.clear();
        visited[root] = 1; parent[root] = 0;
        stk.assign(1, root);
        while (!stk.empty()) {                      // 迭代 DFS，n 大不能用递归
            int v = stk.back(); stk.pop_back();
            comp.push_back(v);
            for (int t = start[v]; t < start[v + 1]; ++t) {
                int w = adj[t];
                if (b[w] && !visited[w]) { visited[w] = 1; parent[w] = v; stk.push_back(w); }
            }
        }
        if (comp.size() % 2 == 0) { cout << "NO\n"; return 0; }  // 偶数分量删不空
        for (int v : comp) sz[v] = 1;
        for (size_t idx = comp.size(); idx-- > 0; ) {            // 先序逆序 = 自底向上
            int v = comp[idx], p = parent[v];
            if (p) sz[p] += sz[v];
        }
        for (int v : comp) {
            int p = parent[v];
            if (!p) continue;
            // 边 (p, v)：v 侧大小为 sz[v]，指向「自己这侧为偶数」的端点
            if (sz[v] & 1) ++pending[v];            // 边指向 p，即背离 v
            else           ++pending[p];            // 边指向 v，即背离 p
        }
    }

    // ---- block[v]：卡住奇点 v 的偶邻居个数（这些偶邻居只剩 v 一个奇邻居）----
    vector<int> block(n + 1, 0), ptr(start);        // ptr：只前进的游标
    vector<char> deleted(n + 1, 0);

    auto uniqueLiveOdd = [&](int u) -> int {        // cnt[u]==1 时返回唯一尚存的奇邻居
        int i = ptr[u], end = start[u + 1];
        while (i < end) {
            int w = adj[i];
            if (b[w] && !deleted[w]) { ptr[u] = i; return w; }
            ++i;
        }
        ptr[u] = i;
        return 0;
    };
    for (int u = 1; u <= n; ++u) {
        if (!b[u] && cnt[u] == 1) ++block[uniqueLiveOdd(u)];
    }

    auto avail = [&](int v) -> bool {
        if (deleted[v]) return false;
        if (!b[v]) return (cnt[v] & 1) != 0;
        return pending[v] == 0 && block[v] == 0;
    };

    priority_queue<int, vector<int>, greater<int>> heap;
    for (int v = 1; v <= n; ++v) if (avail(v)) heap.push(v);

    vector<int> res;
    res.reserve(n);
    while (!heap.empty()) {
        int v = heap.top(); heap.pop();
        if (!avail(v)) continue;                    // 懒删除
        deleted[v] = 1;
        res.push_back(v);
        if (!b[v]) {
            if (cnt[v] == 1) {                      // 它原先卡着唯一的奇邻居
                int z = uniqueLiveOdd(v);
                if (z) { --block[z]; if (avail(z)) heap.push(z); }
            }
        } else {
            for (int t = start[v]; t < start[v + 1]; ++t) {
                int w = adj[t];
                if (deleted[w]) continue;
                if (b[w]) {
                    --pending[w];                   // 汇点的边都背离 w
                    if (avail(w)) heap.push(w);
                } else {
                    --cnt[w];
                    if (cnt[w] == 1) {
                        int z = uniqueLiveOdd(w);
                        if (z) ++block[z];
                    }
                    if (avail(w)) heap.push(w);
                }
            }
        }
    }

    if (static_cast<int>(res.size()) == n) {
        cout << "YES\n";
        for (int i = 0; i < n; ++i) cout << res[i] << " \n"[i + 1 == n];
    } else {
        cout << "NO\n";
    }
    return 0;
}
```

## 复杂度与实测

- 时间 $O(n\log n)$（堆），其余都是 $O(n)$ 摊还；空间 $O(n)$。
- $n=2\times10^5+1$ 随机树、$a$ 全奇（最坏情况：$F$ 就是整棵树）：Python **0.99 s** / C++ **0.08 s**。Python 贴着 1 s 限制，建议把 `avail` 内联掉再压一压。

## 验证

1500 组随机树（$n\le9$）与暴力对拍：暴力用 `frozenset` 记忆化搜索判可行性，再逐位选「最小的、删掉之后仍可行的点」得到字典序最小解。其中 426 组有解、1074 组无解，**输出序列逐位完全一致**；两个样例输出 `1 2 4 3` 和 `NO` 与题面一致。

---

# 考点分析

## 一张表看完

| 题 | 数据结构 | 算法 | 真正卡人的地方 | 课程对应材料 |
| :-- | :--- | :--- | :--- | :--- |
| A | 二叉堆（数组式完全二叉树） | 上浮 SiftUp、逆向模拟 | 意识到「撤销一次插入」是确定性的 | 堆 / 优先队列 |
| B | 字符串 | KMP、破环成链 | $m>n$ 的周期性约简 | [W03 KMP](../2026spring-cs201/202603_DSA_W03_KMP_InvertedIndex_BitOpt.md) |
| C | 堆、邻接表 | Dijkstra、分层图 | 消 max/min、消负权、消团边（三消） | [W09-12 图](../2026spring-cs201/202604_DSA_W09-12_Graph.md) |
| D | 树状数组 | 离线二维偏序 | 把乘积拆成 4 个可维护的和 | [W02 BIT](../2026spring-cs201/202603_DSA_W02_BIT_Fenwick.md) |
| E | 树/森林、堆、CSR | 迭代 DFS、贪心 | 奇偶归约 → 边定向 → 定向不变性 | [W06-08 树](../2026spring-cs201/202604_DSA_W06-08_Tree.md) |

**一句话总结这套卷子**：A、B、D 考的是「**你有没有学过这个工具**」（堆的插入过程、KMP、树状数组）；C、E 考的是「**你能不能把题目改写成你学过的工具能吃的形状**」。后者才是分水岭——C 通过率 68%、E 只有 32%。

## 逐题拆解

### A. Familiar？ —— 堆，但是反着考

- **数据结构**：二叉堆的**数组表示**。下标从 1 开始时，父节点是 `i >> 1`，往上走 $c$ 层就是 `i >> c`——这道题几乎全靠这个位运算。
- **算法**：SiftUp（上浮）、逆向模拟（reverse simulation / 时光倒流）。
- **思维关键**：大多数人学堆只学「怎么用」，这题问「**插入过程本身留下了什么痕迹**」。想通「第 $i$ 次插入的元素必定停在 `i >> c_i`」，整道题就塌了。
- **通用套路**：**构造题 = 倒推出唯一候选 + 正向验证**。倒推往往是确定性的（因此候选唯一），但倒推不负责检查合法性，所以一定要正着再跑一遍。这个套路在「还原操作序列」类题目里反复出现。
- **实现细节**：祖先链赋值要**倒着做**（先写深处再写浅处），否则覆盖掉还没读的值；正向模拟用空穴法少一半赋值。

### B. 环形匹配 —— KMP + 两次约简

- **数据结构**：字符串（没有额外结构）。
- **算法**：**KMP**（失配函数 `fail` / `next` 数组）。匹配成功后 `k = fail[k-1]` 回退，才能找到**重叠**出现（样例 3 的 `ababab` / `abab`）。
- **思维关键**：两次「把问题变小」——
  1. **$m>n$ 的约简**：$r_i$ 天然满足 $r_i[j]=r_i[j+n]$，所以 $t$ 必须以 $n$ 为周期，这个条件**与 $i$ 无关**，可以一次性判掉；判过之后模式串截到 $t[0{:}n]$，长度立刻 $\le n$。这一步用到**字符串周期性**（border 理论的推论）。
  2. **破环成链**：模式长度 $\le n$ 后最多绕一圈，在 $s+s$ 上做普通匹配即可。
- **常见错法**：不做第 1 步，直接把 $s$ 复制 $\lceil (m+n)/n\rceil$ 份——$m=5\times10^5,\ n=1$ 时文本长度爆炸。
- **反面教材**：用 `text.find(pat, start)` 循环。在「全是 `a`」这种高周期数据上退化成 $O(nm)$。KMP 的线性保证不是摆设。

### C. 中转网络 —— 「三消」建图

这题是**建模题**，Dijkstra 本身只是最后一步。要连消三个障碍：

1. **消团边**：中转组内 $s$ 个点两两可达，直接连边是 $O(s^2)$，$S=2\times10^5$ 时会炸。**加一个虚拟节点**，组内每点与它连 0 权双向边，降到 $O(s)$。这是「超级源点/汇点」思想的推广，也是**拆点建图**的典型手法。
2. **消 max/min**：$\max/\min$ 依赖整条路线，非马尔可夫。但因为是**求最小值**，可以松弛成「任选两个经过点 $p,q$，算 $\text{base}-a_p+a_q$」——挑错只会算大，最小值不受影响。**「求 min 时可以把 max/min 换成任选」是一个很通用的技巧**，值得记住。
3. **消负权**：折扣写成「状态转移 $-a_v$」会产生负权边，Dijkstra 直接失效。改写成「**这一次到达免费**」（系数 $0$）而不是「先付再退」，系数只剩 $0/1/2$，全非负。**点权转边权**（把 $a_v$ 摊到「到达 $v$」上）是这一步的载体。
- **数据结构**：优先队列（堆）、链式前向星。
- **算法**：**分层图最短路**（状态 = 节点 × 2 bit），状态数 $4(n+k)$。
- **易错点**：状态编码的位序写反（本文档就踩过，样例输出 10 而非 17）。分层最短路一定要把编码写进注释。

### D. 嵌套窗口 —— 二维偏序的标准件

- **数据结构**：**树状数组（Fenwick Tree）**，这里要开 4 棵（或一棵存四元组）。
- **算法**：**离线二维偏序** = 排序消掉一维 + 树状数组处理另一维。
- **思维关键**：两步数学化简——
  1. 条件化简：$l_i<l_j<r_j<r_i$ 中 $l_j<r_j$ 是题目白送的，**条件退化为二维偏序** $l_i<l_j \wedge r_j<r_i$。没看出这一点的会去想三维偏序（CDQ 分治），复杂度和代码量都翻倍。
  2. 权重拆项：$(l_j-l_i)(r_i-r_j)=l_jr_i-l_jr_j-l_ir_i+l_ir_j$，于是只要维护 $\sum 1,\ \sum l_j,\ \sum r_j,\ \sum l_jr_j$ 四个前缀和。**把带权求和拆成若干个「可加」的量**，是树状数组类题目的核心动作。
- **易错点**：
  - $l$ 相同的一批必须**先整批查询、再整批插入**，否则 $l_i=l_j$ 会被算进去（要的是严格小于）。
  - **溢出**：答案可达 $4\times10^{18}$ 量级，C++ 必须 `long long`（`int` 必炸）。Python 的大整数在这题白送。

### E. 树上消消乐 —— 本场的分水岭

通过率 17/53。它难不在代码（代码量和 D 差不多），难在**要连做五层推理**：

1. **奇偶归约**：$a_v$ 只以 $\bmod\ 2$ 参与判定，先把点分成奇点/偶点。**看到 $\bmod 2$ 就该想「只留奇偶」**。
2. **结构分解**：偶点删除时不影响任何人（$b_v=0$），只有奇点之间的边有耦合。于是把奇点抽出来得到**导出森林 $F$**，问题变成「$F$ 上删度数为偶的点」+「偶点搭便车」。**把强耦合部分剥离出来单独研究**是图论题的常规动作。
3. **可行性刻画（不变量）**：一次删除移走偶数条边 $\Rightarrow$ 分量边数奇偶是不变量 $\Rightarrow$ **每个分量点数必须是奇数**。再加上「每个存活偶点至少剩一个奇邻居」，两条合起来充要。**找不变量是判无解的标准武器**。
4. **合法点的刻画 → 边定向**：「度数为偶」不够（$p=5$ 的链上删中点会劈出两个偶分量）。正确条件是「$F-v$ 的每个分量都是奇数」。因为 $|C|$ 为奇，**每条边恰有一侧是偶数**，把边指向「自己这侧为偶」的端点，则 $v$ 合法 $\iff$ **$v$ 是汇点**。汇点存在性用「沿着不指向自己的边走，树上无环故必然停下」证明。
5. **不变性引理**：删汇点时各分支都是奇数、度数为偶，算一下就知道**所有边的两侧奇偶都不变** $\Rightarrow$ **定向算一次就够**，维护退化成「删点时给邻居的计数器减一」，$O(1)$。**没有这一步就只能每次重算，$O(n^2)$。**

- **数据结构**：树/森林、CSR 邻接表、优先队列（小根堆）。
- **算法**：迭代 DFS 求子树大小（$n=2\times10^5$ **不能递归**，会爆栈）、堆贪心。
- **为什么贪心对**：因为「可删」已经定义成「删了之后仍然可行」，而可行性保证还能删光，所以每步取最小编号就是字典序最小。**字典序最小 = 每步取最小的「安全」选择**，前提是你能 $O(1)$ 判断安全。
- **摊还技巧**：偶点找「唯一剩下的奇邻居」用**只前进不回退的游标**，总代价 $O(\deg)$。

## 如果只想带走五句话

1. **构造题**：倒推出唯一候选，再正向验证一遍。（A）
2. **环形问题**：破环成链；周期性可以先把规模砍下来。（B）
3. **建图题**：团边用虚拟点、点权转边权、状态进分层图；Dijkstra 要求非负权，就把「退钱」改写成「不收钱」。（C）
4. **带权二维偏序**：把权重拆成几个可加的量，每个量一棵树状数组。（D）
5. **看到 $\bmod 2$**：先归约奇偶，再找不变量判无解，最后找「安全选择」做贪心。（E）

---

# 附：本机实测汇总

Python 3.12.3 / g++ 13.3 `-O2` / Linux，最大规模构造数据：

| 题 | 限时 | Python | C++ | 结论 |
| :-- | :-- | :-- | :-- | :-- |
| A | 1000 ms | 0.53 s | 0.04 s | 两者都够用 |
| B | 1000 ms | 0.29 s | 0.03 s | 两者都够用 |
| C | 1500 ms | 2.6 ~ 2.9 s | 0.27 s | **Python 超时**，需压常数或改 C++ |
| D | 2000 ms | 1.1 ~ 1.4 s | 0.06 s | 两者都够用 |
| E | 1000 ms | 0.99 s | 0.08 s | Python 贴线，C++ 从容 |

> 机器与 OJ 评测机性能不同，以上只作参考。五题的**算法复杂度都已到位**，Python 在 C、E 上的问题纯粹是解释器常数——C++ 版在同一数据上有 10~30 倍余量。
>
> **C++ 代码的验证**：五份代码都在 `-Wall -Wextra -Werror -O2` 下编译无警告，并在 ASan/UBSan 下跑过中等规模数据（无越界、无未定义行为）；此外与上面已对拍过暴力的 Python 版做了随机交叉对拍（A/B/D/E 各 1200 组，C 800 组连通图），输出完全一致，最大规模数据上的输出也逐字节相同。
