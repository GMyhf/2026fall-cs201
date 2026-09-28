# 第三章作业 参考答案

### 1 支持 $O(1)$ `getMax` 的栈

**思路：** 在原栈里每个数据元素上方额外压入一个辅助整数，记录"**从栈底到该元素为止的最大值**"。这样栈顶的辅助整数就是整个栈的最大值。栈中存储形如

```text
栈底  x1, m1, x2, m2, ..., xk, mk  栈顶        其中 mi = max(x1, ..., xi)
```

新元素入栈时只需要和当前栈顶的 $m_{k}$ 比较，出栈时辅助值随数据一起弹出，历史最大值自动恢复，不需要重新扫描。

下面用 `rawPush / rawPop / rawTop` 表示原来的基本操作，`isEmpty` 表示原栈判空（只在第一次压栈时用到）。

```text
push(x):
    if S.isEmpty():
        m ← x
    else:
        m ← max(x, S.rawTop())      // rawTop() 是当前最大值
    S.rawPush(x)                     // 数据
    S.rawPush(m)                     // 辅助整数：含 x 在内的最大值

pop():
    S.rawPop()                       // 丢掉辅助整数
    return S.rawPop()                // 返回数据

top():
    m ← S.rawPop()                   // 暂时取下辅助整数
    x ← S.rawTop()                   // 读数据
    S.rawPush(m)                     // 放回去
    return x

getMax():
    return S.rawTop()
```

每个操作只做常数次原子栈操作，时间均为 $O(1)$；额外空间为每个元素一个整数，共 $O(n)$。

**示例：** 依次 `push(3), push(5), push(2)`，栈为 `3,3, 5,5, 2,5`（辅助值依次为 3、5、5），`getMax()=5`；`pop()` 返回 2，栈顶辅助值仍为 5；再 `pop()` 返回 5，栈顶辅助值变为 3，`getMax()=3`。

> **另一种省空间的写法：** 用一个整型变量 `maxVal`（初值为 `INT_MIN`）保存当前最大值，只有当新元素**成为新最大值**时才额外压入旧最大值：
>
> ```text
> push(x):  if x ≥ maxVal: { rawPush(maxVal); maxVal ← x }   rawPush(x)
> pop():    y ← rawPop();  if y = maxVal: maxVal ← rawPop();  return y
> top():    return rawTop()
> getMax(): return maxVal
> ```
>
> 比较必须用 `≥`：栈中每个等于 `maxVal` 的元素下面都压有旧最大值，出栈时才能正确恢复（例如连续 `push(5), push(5)`）。此法不需要判空，且当元素不是新最大值时不占额外空间。

---

### 2 合法括号序列的计数（Catalan 数）

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

**推导（反射法）：** $n$ 个 `(`、$n$ 个 `)` 的所有排列共 $\binom{2n}{n}$ 种。对不合法序列，找到第一个"右括号比左括号多 1"的前缀位置，把该位置之后的所有括号左右翻转，得到一个含 $n+1$ 个 `)`、$n-1$ 个 `(` 的序列；这个变换是一一对应的（反过来，任何含 $n+1$ 个 `)` 的序列都一定有这样的前缀，可以翻转回去）。所以不合法序列恰有 $\binom{2n}{n+1}$ 个，合法序列数为 $\binom{2n}{n} - \binom{2n}{n+1} = \frac{1}{n+1}\binom{2n}{n}$。

前几项：$C_0 = 1, C_1 = 1, C_2 = 2, C_3 = 5, C_4 = 14, C_5 = 42$。

**$n = 3$ 时的全部合法序列（共 $C_3 = 5$ 个）：**

```text
((()))
(()())
(())()
()(())
()()()
```

验证：$C_3 = C_0C_2 + C_1C_1 + C_2C_0 = 2 + 1 + 2 = 5 = \frac14\binom63 = \frac{20}{4}$。

---

### 3 浏览器的"后退 / 前进"

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

### 4 用两个栈实现队列

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
