# 第一章作业 参考答案

> 约定：本文中 $\log$ 若不特别说明均以 2 为底（渐近意义下底数不影响结果）。

## 1

1. $\sum_{i=1}^{n} \frac{1}{i} = \Theta(\log n)$。

   由积分估计：$\ln(n+1) = \int_1^{n+1}\frac{dx}{x} \le \sum_{i=1}^{n}\frac1i \le 1 + \int_1^{n}\frac{dx}{x} = 1 + \ln n$。

2. $\log(n!) = \Theta(n \log n)$。

   上界：$\log(n!) = \sum_{i=1}^n \log i \le n\log n$。
   下界：$\log(n!) \ge \sum_{i=\lceil n/2\rceil}^{n}\log i \ge \frac n2 \log\frac n2 = \Omega(n\log n)$。

3. $f(n) = \Omega(g(n))$ 且 $f(n) = O(g(n))$ 等价于 $f(n) = \Theta(g(n))$。

4. $2026^n = \Omega(2025^n)$。

   因为 $\frac{2026^n}{2025^n} = \left(\frac{2026}{2025}\right)^n \to \infty$，所以 $2026^n \ne O(2025^n)$，从而也不是 $\Theta$；而 $2026^n \ge 2025^n$ 恒成立，故只能填 $\Omega$。（参见第 4.1 题。）

## 2

**答案：$O(n)$（实际上是 $\Theta(n)$）。**

推导：对固定的 $i$，内层循环中 $j$ 依次取 $i, 2i, 4i, \dots, 2^k i$，只要 $2^k i \le n$ 就执行一次 `cnt++`。所以外层取 $i$ 时，内层执行次数为

$$
t(i) = \#\{\,k \ge 0 : 2^k i \le n\,\} = \left\lfloor \log_2 \frac{n}{i} \right\rfloor + 1 .
$$

总次数 $\displaystyle \text{cnt} = \sum_{i=1}^{n} t(i)$。交换求和次序：对每个 $k \ge 0$，满足 $2^k i \le n$ 的 $i$ 恰有 $\lfloor n/2^k \rfloor$ 个，因此

$$
\text{cnt} = \sum_{i=1}^{n}\sum_{k \ge 0}[\,2^k i \le n\,] = \sum_{k \ge 0} \left\lfloor \frac{n}{2^k} \right\rfloor \le n\left(1 + \frac12 + \frac14 + \cdots\right) < 2n .
$$

又 $k=0$ 一项就等于 $n$，所以 $n \le \text{cnt} < 2n$，外层循环本身执行 $n$ 次，故时间复杂度为 $\Theta(n)$，即 $O(n)$。

> 注意：不能简单地说"外层 $n$ 次、内层 $O(\log n)$ 次，所以 $O(n\log n)$"——这只是一个松的上界。内层从 $j=i$ 开始，$i$ 越大内层越短，大部分 $i$（$i > n/2$ 的那一半）内层只执行 1 次。
>
> 另一种算法：$\sum_{i=1}^n \log\frac ni = n\log n - \log(n!) = n\log n - (n\log n - n\log e + O(\log n)) = O(n)$（Stirling 公式）。

## 3

1. $T(n) = n^5 \times 3^n + 4^n = \Theta(4^n)$。

   因为 $\frac{n^5 3^n}{4^n} = n^5 (3/4)^n \to 0$，多项式因子敌不过指数的底数之比，故 $4^n \le T(n) \le 2\cdot 4^n$（$n$ 充分大时）。

2. $T(n) = T(n-1) + \Theta(n)$ ⟹ $T(n) = \Theta(n^2)$。

   展开：$T(n) = T(1) + \sum_{k=2}^{n}\Theta(k) = \Theta\!\left(\frac{n(n+1)}{2}\right) = \Theta(n^2)$。

3. $T(n) = T(\lfloor n/2 \rfloor) + \Theta(1)$ ⟹ $T(n) = \Theta(\log n)$。

   每次规模减半，递归深度为 $\lfloor \log_2 n\rfloor + 1$，每层 $\Theta(1)$。（二分查找的递推式；也可由主定理 $a=1,b=2,f(n)=\Theta(1)=\Theta(n^{\log_b a})$ 得到。）

4. $T(n) = T(n-1) + \Theta(\log n)$ ⟹ $T(n) = \Theta(n \log n)$。

   展开：$T(n) = T(1) + \sum_{k=2}^{n}\Theta(\log k) = \Theta(\log n!) = \Theta(n\log n)$（由第 1.2 题）。

## 4

### 4.1 证明：对任意正实数 $a, b$，$a^n = O(b^n) \iff a \le b$。

**（⇐）** 若 $a \le b$，由 $a, b > 0$ 得对所有 $n \ge 1$ 有 $a^n \le b^n$。取 $c = 1, n_0 = 1$ 即满足 $O$ 的定义，所以 $a^n = O(b^n)$。

**（⇒）** 用反证法。假设 $a^n = O(b^n)$ 但 $a > b$。由定义存在常数 $c > 0$ 和 $n_0$，使得对所有 $n \ge n_0$ 有 $a^n \le c\, b^n$，即

$$
\left(\frac ab\right)^n \le c \quad (n \ge n_0).
$$

令 $r = a/b > 1$，则 $r^n = (1 + (r-1))^n \ge 1 + n(r-1)$（Bernoulli 不等式），取 $n > \max\{n_0, \frac{c}{r-1}\}$ 时 $r^n > c$，矛盾。故 $a \le b$。 ∎

### 4.2 已知 $T(1)=1$，$T(n) = 2T(\lfloor n/2\rfloor) + n$，证明 $T(n) = O(n\log n)$。

**要证：** 对所有 $n \ge 2$，$T(n) \le 2\,n \log_2 n$（取 $c = 2, n_0 = 2$）。

> 为什么不从 $n = 1$ 开始？因为 $1\cdot\log 1 = 0 < T(1) = 1$，$n=1$ 时不等式不成立。$O$ 记号只要求 $n$ 充分大时成立，所以把基础情形放在 $n = 2, 3$。

**基础情形。** $T(2) = 2T(1) + 2 = 4 \le 2\cdot 2\cdot \log_2 2 = 4$；
$T(3) = 2T(1) + 3 = 5 \le 2\cdot 3\cdot\log_2 3 \approx 9.51$。成立。

**归纳步骤。** 设 $n \ge 4$，并假设对所有 $2 \le k < n$ 均有 $T(k) \le 2k\log_2 k$。记 $m = \lfloor n/2 \rfloor$，由 $n\ge 4$ 知 $2 \le m < n$，可用归纳假设；且 $m \le n/2$，所以

$$
\begin{aligned}
T(n) &= 2T(m) + n \le 2\cdot 2m\log_2 m + n \\
     &\le 2n \log_2\frac n2 + n \qquad (\text{因为 } 2m \le n,\ \log_2 m \le \log_2\tfrac n2)\\
     &= 2n\log_2 n - 2n + n \\
     &= 2n\log_2 n - n \\
     &\le 2n\log_2 n .
\end{aligned}
$$

由数学归纳法（强归纳），对所有 $n \ge 2$ 有 $T(n) \le 2n\log_2 n$，即 $T(n) = O(n\log n)$。 ∎

> 补充：同样可证 $T(n) \ge n\log_2 n$ 的量级下界（每层合并代价 $n$，共约 $\log_2 n$ 层），因此实际上 $T(n) = \Theta(n\log n)$，这就是归并排序的递推式。
