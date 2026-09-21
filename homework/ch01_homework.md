# 第一章作业

## 1

填空题：

1. $\sum_{i=1}^{n} \frac{1}{i} = \Theta(\underline{\hspace{1.5cm}})$。
2. $\log(n!) = \Theta(\underline{\hspace{1.5cm}})$。
3. $f(n) = \Omega(g(n))$ 且 $f(n) = O(g(n))$ 等价于 $f(n) = \underline{\hspace{1cm}}(g(n))$。
4. $2026^n = \underline{\hspace{1cm}}(2025^n)$。（填写 $O$, $\Omega$ 或 $\Theta$）

## 2

```cpp
int cnt = 0;
int i = 1;
while (i <= n) {
    int j = i;
    while (j <= n) {
        cnt++;
        j *= 2;
    }
    i++;
}
```

分析程序，求出程序的时间复杂度（大 $O$ 表示，**给出推导过程**）。

## 3

求解下列递推式的 $\Theta$ 表示。

1. $T(n) = n^5 \times 3^n + 4^n$。
2. $T(n) = T(n - 1) + \Theta(n)$。
3. $T(n) = T(\lfloor n/2 \rfloor) + \Theta(1)$。
4. $T(n) = T(n - 1) + \Theta(\log n)$。

## 4

1. 证明对任意正实数 $a$ 和 $b$，$a^n = O(b^n)$ 当且仅当 $a \le b$。
2. 给定 $T(1) = 1$ 和 $T(n) = 2T(\lfloor n/2 \rfloor) + n$，证明 $T(n) = O(n \log n)$。（提示：考虑数学归纳法）
