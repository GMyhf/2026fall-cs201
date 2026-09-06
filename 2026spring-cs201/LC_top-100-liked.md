# LeetCode Top 100 Liked 题解

*Updated 2026-05-30 19:10 GMT+8*
 *Compiled by Hongfei Yan (2026 Spring)*



> 来源：https://leetcode.cn/studyplan/top-100-liked/
>
> 每题包含：题目编号、思路分析、Python代码实现（含关键注释）。



## 一、哈希（hash, 3）

### E1. Two Sum（两数之和）✅

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`* 的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。



**思路**：遍历数组，用哈希表记录每个数对应的下标。对于当前数 `nums[i]`，检查 `target - nums[i]` 是否已在哈希表中。

```python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
```



### M49. Group Anagrams（字母异位词分组）✅

给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。



**思路**：将每个字符串排序作为 key，存入字典。同一 key 的字符串即为异位词。

```python
def groupAnagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())
```



### M128. Longest Consecutive Sequence（最长连续序列）✅

给定一个未排序的整数数组 `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 `O(n)` 的算法解决此问题。



**思路**：用集合存所有数。遍历每个数，若 `num - 1` 不在集合中，则以此为起点向后连续查找。

```python
def longestConsecutive(nums):
    s, longest = set(nums), 0
    for num in s:
        if num - 1 not in s:
            cur, length = num, 1
            while cur + 1 in s:
                cur += 1
                length += 1
            longest = max(longest, length)
    return longest
```



## 二、双指针（two pointers, 4）

### M11. Container With Most Water（盛最多水的容器）✅

给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以存储的最大水量。

**说明：**你不能倾斜容器。



**思路**：左右指针向中间移动。每次移动高度较小的那一边，计算并更新最大面积。

```python
def maxArea(height):
    l, r, ans = 0, len(height) - 1, 0
    while l < r:
        ans = max(ans, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return ans
```

### T42. Trapping Rain Water（接雨水）✅

给定 `n` 个非负整数表示每个宽度为 `1` 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。



**思路**：双指针记录左右最大高度。哪边矮就处理哪一边，当前位置能接的雨水 = min(left_max, right_max) - height[i]。

**“木桶效应”**（又称短板效应）是指：一只木桶想装满水，它能装多少水并不取决于最长的那块木板，而是取决于**最短的那块木板**。

```python
def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = ans = 0
    
    while l < r:
        if height[l] < height[r]:
            # 情况 A：左边柱子较矮
            if height[l] >= left_max:
                # 如果当前高度大于或等于历史左侧最大高度，说明存不住水，更新 left_max
                left_max = height[l]
            else:
                # 否则，当前位置可以接水，水量为 left_max 与当前高度的差值
                ans += left_max - height[l]
            # 左指针向右移动
            l += 1
        else:
            # 情况 B：右边柱子较矮（或等高）
            if height[r] >= right_max:
                # 如果当前高度大于或等于历史右侧最大高度，更新 right_max
                right_max = height[r]
            else:
                # 否则，当前位置可以接水，水量为 right_max 与当前高度的差值
                ans += right_max - height[r]
            # 右指针向左移动
            r -= 1
            
    return ans
```

### M15. 3Sum（三数之和）✅

给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请你返回所有和为 `0` 且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。



**思路**：排序后固定第一个数，双指针找另外两个数。注意跳过重复元素。

```python
def threeSum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]:
                    l += 1
                while l < r and nums[r] == nums[r - 1]:
                    r -= 1
                l += 1
                r -= 1
    return res
```



### E283. Move Zeroes（移动零）✅

给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。

**请注意** ，必须在不复制数组的情况下原地对数组进行操作。



**思路**：用一个指针 `pos` 记录非零元素应该放置的位置。遍历数组，将非零元素前移，最后补零。

```python
def moveZeroes(nums):
    pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[pos], nums[i] = nums[i], nums[pos]
            pos += 1
```





## 三、滑动窗口（sliding window, 2）

### M3. Longest Substring Without Repeating Characters（无重复字符的最长子串）✅

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长 子串** 的长度。



**思路**：用哈希集合记录窗口内字符。右指针扩展窗口，遇到重复时左指针收缩。

```python
def lengthOfLongestSubstring(s):
    seen, l, ans = set(), 0, 0
    for r in range(len(s)):
        while s[r] in seen:
            seen.remove(s[l])
            l += 1
        seen.add(s[r])
        ans = max(ans, r - l + 1)
    return ans
```



### M438. Find All Anagrams in a String（找到字符串中所有字母异位词）✅

给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的 **异位词** 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。



**思路**：固定长度滑动窗口。用哈希表（或数组）记录窗口内字符计数，与目标串匹配。

```python
def findAnagrams(s, p):
    from collections import Counter
    need = Counter(p)
    missing = len(p)
    res = []
    for r, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        if r >= len(p):
            left = s[r - len(p)]
            if need[left] >= 0:
                missing += 1
            need[left] += 1
        if missing == 0:
            res.append(r - len(p) + 1)
    return res
```

---

## 四、子串（substring, 3）

### T76. Minimum Window Substring（最小覆盖子串）✅

给定两个字符串 `s` 和 `t`，长度分别是 `m` 和 `n`，返回 s 中的 **最短窗口 子串**，使得该子串包含 `t` 中的每一个字符（**包括重复字符**）。如果没有这样的子串，返回空字符串 `""`。

测试用例保证答案唯一。



**思路**：用两个指针维护窗口，用哈希表记录 t 中字符的需求量。当窗口覆盖所有字符后，尝试收缩左边界。

```python
def minWindow(s, t):
    from collections import Counter
    need = Counter(t)
    missing = len(t)
    l = start = end = 0
    for r, ch in enumerate(s, 1):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1 # 不在 t 中的字符，其 need 值会变为负数
        if missing == 0:
            while l < r and need[s[l]] < 0: # 过滤掉左侧无用或冗余的字符
                need[s[l]] += 1
                l += 1
            if end == 0 or r - l < end - start: # 更新全局最短子串
                start, end = l, r
            # 破坏当前窗口的有效性，继续寻找下一个可行解
            need[s[l]] += 1
            missing += 1
            l += 1
    return s[start:end]
```



### T239. Sliding Window Maximum（滑动窗口最大值）✅

给你一个整数数组 `nums`，有一个大小为 `k` 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 `k` 个数字。滑动窗口每次只向右移动一位。

返回 *滑动窗口中的最大值* 。



**思路**：单调双端队列，队首始终是当前窗口最大值。窗口滑动时维护队列。

```python
from collections import deque

def maxSlidingWindow(nums, k):
    dq, res = deque(), []
    for i in range(len(nums)):
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if dq[0] == i - k:
            dq.popleft()
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res
```



### M560. Subarray Sum Equals K（和为 K 的子数组）✅

给你一个整数数组 `nums` 和一个整数 `k` ，请你统计并返回 *该数组中和为 `k` 的子数组的个数* 。

子数组是数组中元素的连续非空序列。



**思路**：前缀和 + 哈希表。`sum[i] - sum[j] == k` 等价于 `sum[j] == sum[i] - k`。

```python
from typing import List


class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        from collections import defaultdict

        # 哈希表用于存储每个前缀和出现的次数
        prefix_sum_count = defaultdict(int)
        # 初始化前缀和为0的情况出现一次，为了处理整个子数组和恰好为k的情况
        prefix_sum_count[0] = 1

        current_sum = 0
        count = 0

        for num in nums:
            current_sum += num
            # 查找当前前缀和减去目标值k的前缀和数量，并添加到结果计数器
            if (current_sum - k) in prefix_sum_count:
                count += prefix_sum_count[current_sum - k]
            # 更新当前前缀和的数量
            prefix_sum_count[current_sum] += 1

        return count


# test code
if __name__ == "__main__":
    sol = Solution()
    nums = [1, 1, 1]
    k = 2
    print(sol.subarraySum(nums, k))  # expect 2
```



## 五、普通数组（array, 5）

### T41. First Missing Positive（缺失的第一个正数）✅

给你一个未排序的整数数组 `nums` ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 `O(n)` 并且只使用常数级别额外空间的解决方案。



**思路**：将每个正数 `x` 放到下标 `x - 1` 位置。遍历找第一个下标与值不对应的位置。

```python
def firstMissingPositive(nums):
    n = len(nums)
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1
```

> 这是一种非常高效且经典的解法，通常被称为**“原地哈希”**（In-place Hash）或**“桶排序”**思想。
>
> **一、 核心思路：原地哈希**
>
> 对于一个长度为 $n$ 的数组 `nums`，**缺失的第一个正数一定在区间 $[1, n+1]$ 之间**。
> * 如果数组恰好包含了 $1$ 到 $n$ 的所有正整数，那么缺失的第一个正数就是 $n+1$。
> * 否则，缺失的正数一定落在 $[1, n]$ 之间。
>
> 基于这个性质，我们可以尝试将数组中的每个正整数 $x$（如果 $1 \le x \le n$）放到它应该在的位置，即**下标为 $x - 1$ 的位置**（也就是让 `nums[x - 1] = x`）。
>
> 当所有能够安置的数字都各就各位后，我们再次遍历数组。第一个满足 `nums[i] != i + 1` 的下标 `i`，其对应的 `i + 1` 就是我们要找的缺失的第一个正数。
>
> ---
>
> **二、 代码步骤详解**
>
> **1. 整理数组（置换阶段）**
>
> ```python
> for i in range(n):
>     while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
>         nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
> ```
> * **为什么用 `while` 而不是 `if`？**
>   当我们把 `nums[i]` 交换到它正确的位置 `nums[i] - 1` 时，从该位置换回来的新元素可能也是一个在 $[1, n]$ 范围内的有效正整数，但它目前还没有在正确的位置上。因此需要用 `while` 循环继续对其进行置换，直到换过来的数字不满足条件（超出边界或已经是重复值）为止。
> * **循环条件分析**：
>   * `1 <= nums[i] <= n`：只有当数值在合法范围内时才进行放置。
>   * `nums[nums[i] - 1] != nums[i]`：目标位置上的值还不等于当前值。这个条件不仅能避免不必要的交换，还能**防止数组中存在重复值时导致死循环**（例如，当两个相同的数字都需要放到同一个位置时，如果不做此判断，会陷入无限交换）。
> * **Python 的交换细节**：
>   在 Python 中，`nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]` 能够正常工作，是因为 Python 在执行多变量赋值时，会先计算右侧的元组，然后从左到右依次赋值。
>
> **2. 查找缺失值**
>
> ```python
> for i in range(n):
>     if nums[i] != i + 1:
>         return i + 1
> return n + 1
> ```
> * 遍历整理后的数组：
>   * 如果发现某个位置 `nums[i]` 的值不是 `i + 1`，说明正整数 `i + 1` 在数组中缺失，直接返回 `i + 1`。
>   * 如果整个数组全部符合要求（即 `nums` 变成了 `[1, 2, ..., n]`），说明缺失的是下一个正整数，返回 `n + 1`。
>
> ---
>
> **三、 复杂度分析**
>
> * **时间复杂度：$O(n)$**
>   虽然代码中有一层 `for` 循环嵌套了 `while` 循环，但每一次交换操作都会将至少一个元素放到它的最终正确位置。每个元素最多被交换到正确位置一次，因此总的交换次数不会超过 $n$ 次。整个置换过程的均摊时间复杂度为 $O(n)$，随后的线性扫描也是 $O(n)$，因此整体时间复杂度为 $O(n)$。
>   
> * **空间复杂度：$O(1)$**
>   算法直接在原输入数组 `nums` 上进行修改，仅使用了常数级别的额外变量来记录长度和迭代，满足题目对于常数级额外空间的要求。



### M53. Maximum Subarray（最大子数组和）✅

给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**子数组** 是数组中的一个连续部分。



**思路**：Kadane 算法。记录当前子数组和，若为负则重新开始。

```python
def maxSubArray(nums):
    cur = best = nums[0]
    for num in nums[1:]:
        cur = max(num, cur + num)
        best = max(best, cur)
    return best
```





### M56. Merge Intervals（合并区间）✅

以数组 `intervals` 表示若干个区间的集合，其中单个区间为 `intervals[i] = [starti, endi]` 。请你合并所有重叠的区间，并返回 *一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间* 。



**思路**：按区间起点排序。遍历合并重叠区间。

```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    res = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res
```





### M189. Rotate Array（轮转数组）✅

给定一个整数数组 `nums`，将数组中的元素向右轮转 `k` 个位置，其中 `k` 是非负数。



**思路**：三次反转——反转整个数组，反转前 k 个，反转后 n-k 个。

```python
def rotate(nums, k):
    n = len(nums)
    k %= n
    def rev(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1; r -= 1
    rev(0, n - 1)
    rev(0, k - 1)
    rev(k, n - 1)
```



### M238. Product of Array Except Self（除自身以外数组的乘积）✅

给你一个整数数组 `nums`，返回 数组 `answer` ，其中 `answer[i]` 等于 `nums` 中除了 `nums[i]` 之外其余各元素的乘积 。

题目数据 **保证** 数组 `nums`之中任意元素的全部前缀元素和后缀的乘积都在 **32 位** 整数范围内。

请 **不要使用除法，**且在 `O(n)` 时间复杂度内完成此题。



**思路**：先从左到右算前缀积，再从右到左乘以后缀积。

```python
def productExceptSelf(nums):
    n = len(nums)
    ans = [1] * n
    left = 1
    for i in range(n):
        ans[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        ans[i] *= right
        right *= nums[i]
    return ans
```





## 六、矩阵（matrix, 4）

### M48. Rotate Image（旋转图像）✅

给定一个 *n* × *n* 的二维矩阵 `matrix` 表示一个图像。请你将图像顺时针旋转 90 度。

你必须在**[ 原地](https://baike.baidu.com/item/原地算法)** 旋转图像，这意味着你需要直接修改输入的二维矩阵。**请不要** 使用另一个矩阵来旋转图像。



**思路**：先按对角线翻转，再每行反转。

```python
def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for i in range(n):
        matrix[i].reverse()
```



### M54. Spiral Matrix（螺旋矩阵）✅

给你一个 `m` 行 `n` 列的矩阵 `matrix` ，请按照 **顺时针螺旋顺序** ，返回矩阵中的所有元素。



**思路**：方向数组+标记

```python
from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        if not matrix or not matrix[0]:
            return []

        m, n = len(matrix), len(matrix[0])
        result = []

        # 顺时针方向：右、下、左、上
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        x, y = 0, 0
        dir_idx = 0

        for _ in range(m * n):
            result.append(matrix[x][y])
            matrix[x][y] = None  # 使用 None 标记已访问，省去 visited 数组

            dx, dy = directions[dir_idx]
            next_x, next_y = x + dx, y + dy

            # 判断是否需要转弯
            if (0 <= next_x < m and 
                0 <= next_y < n and 
                matrix[next_x][next_y] is not None):
                x, y = next_x, next_y
            else:
                dir_idx = (dir_idx + 1) % 4
                dx, dy = directions[dir_idx]
                x, y = x + dx, y + dy

        return result
```



**思路**：模拟上下左右四个边界，按顺时针方向遍历。

```python
def spiralOrder(matrix):
    res = []
    t, b, l, r = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
    while t <= b and l <= r:
        for j in range(l, r + 1):
            res.append(matrix[t][j])
        t += 1
        for i in range(t, b + 1):
            res.append(matrix[i][r])
        r -= 1
        # 在上一步中 t 已经增加了，如果此时 t > b，说明所有的行已经遍历完毕
        if t <= b:
            for j in range(r, l - 1, -1):
                res.append(matrix[b][j])
            b -= 1
        # 在第二步中 r 已经减少了，如果此时 l > r，说明所有的列已经遍历完毕
        if l <= r:
            for i in range(b, t - 1, -1):
                res.append(matrix[i][l])
            l += 1
    return res
```

> 关键细节：为什么需要 if t <= b 和 if l <= r 的判断？
>
> 在非正方形矩阵（例如 3×5 或 5×3 的矩阵）中，遍历到最后可能会退化为单行或单列。
>
> 如果没有这两个条件判断，在已经遍历完所有行/列之后，底部的两个 for 循环仍会继续执行，导致将已经访问过的元素重复添加到结果数组 res 中。加上这两个判断可以确保每一轮边界收缩后，仍然满足遍历的有效性。



### M73. Set Matrix Zeroes（矩阵置零）✅

给定一个 `m x n` 的矩阵，如果一个元素为 **0** ，则将其所在行和列的所有元素都设为 **0** 。请使用 **[原地](http://baike.baidu.com/item/原地算法)** 算法**。**



**思路**：用第一行和第一列作为标记位。先记录第一行/列是否有零，再标记，最后清零。

```python
def setZeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    row0 = any(matrix[0][j] == 0 for j in range(n))
    col0 = any(matrix[i][0] == 0 for i in range(m))
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = 0
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    if row0:
        for j in range(n):
            matrix[0][j] = 0
    if col0:
        for i in range(m):
            matrix[i][0] = 0
```

> **一、 核心思想：利用矩阵自身作为标记位**
>
> 在解决此问题时，最直观的方法是创建两个辅助数组（大小分别为 $m$ 和 $n$）来记录哪些行和列需要清零。但这需要 $O(m + n)$ 的额外空间。
>
> 为了达到 **$O(1)$ 额外空间** 的要求，该算法采用了一个巧妙的思路：**直接使用矩阵的第一行和第一列来充当这两个辅助数组**。
>
> *   用 `matrix[0][j]` 记录第 `j` 列是否需要清零。
> *   用 `matrix[i][0]` 记录第 `i` 行是否需要清零。
>
> 因为第一行和第一列原本也包含数据，为了避免信息被覆盖，我们需要**先单独记录第一行和第一列自身是否原本就包含 `0`**。
>
> ---
>
> **二、 代码执行步骤详解**
>
> 1. 记录第一行和第一列的初始状态
>
> ```python
> row0 = any(matrix[0][j] == 0 for j in range(n))
> col0 = any(matrix[i][0] == 0 for i in range(m))
> ```
>
> *   `row0`：检查第一行是否原本含有 `0`。
> *   `col0`：检查第一列是否原本含有 `0`。
> *   这两个布尔值会在算法的最后一步使用。
>
> 2. 遍历其余元素，并在第一行/列做标记
>
> ```python
> for i in range(1, m):
>     for j in range(1, n):
>         if matrix[i][j] == 0:
>             matrix[i][0] = matrix[0][j] = 0
> ```
>
> *   遍历从索引 `1` 开始的子矩阵（排除第一行和第一列）。
> *   如果发现某个元素 `matrix[i][j]` 为 `0`，则将它对应的行首 `matrix[i][0]` 和列首 `matrix[0][j]` 设为 `0`。这里的行首和列首起到了“投影”和“标记”的作用。
>
> 3. 根据标记更新子矩阵中的元素
>
> ```python
> for i in range(1, m):
>     for j in range(1, n):
>         if matrix[i][0] == 0 or matrix[0][j] == 0:
>             matrix[i][j] = 0
> ```
>
> *   再次遍历该子矩阵。
> *   如果当前元素对应的行首 `matrix[i][0]` 或列首 `matrix[0][j]` 已经被标记为 `0`，则将当前元素 `matrix[i][j]` 置为 `0`。
>
> 4. 处理第一行和第一列的最终状态
>
> ```python
> if row0:
>     for j in range(n):
>         matrix[0][j] = 0
> if col0:
>     for i in range(m):
>         matrix[i][0] = 0
> ```
>
> *   利用第 1 步保存的 `row0` 和 `col0` 状态。
> *   如果 `row0` 为 `True`，说明第一行原本就有 `0`，将第一行整行置为 `0`。
> *   如果 `col0` 为 `True`，说明第一列原本就有 `0`，将第一列整列置为 `0`。
>
> ---
>
> **三、 复杂度分析**
>
> *   **时间复杂度**：$O(m \times n)$。
>     矩阵被遍历了数次，但整体的遍历次数是常数级别的，每个元素的操作时间为 $O(1)$，因此总时间复杂度与矩阵大小成线性关系。
> *   **空间复杂度**：$O(1)$。
>     除了 `row0` 和 `col0` 两个布尔变量外，没有使用任何额外的数组或矩阵空间，完全在输入矩阵上完成修改，符合“原地”算法的要求。





### M240. Search a 2D Matrix II（搜索二维矩阵 II）✅

编写一个高效的算法来搜索 `m x n` 矩阵 `matrix` 中的一个目标值 `target` 。该矩阵具有以下特性：

- 每行的元素从左到右升序排列。
- 每列的元素从上到下升序排列。



**思路**：从右上角开始，利用行列有序特性，每次排除一行或一列。

```python
def searchMatrix(matrix, target):
    if not matrix:
        return False
    i, j = 0, len(matrix[0]) - 1
    while i < len(matrix) and j >= 0:
        if matrix[i][j] == target:
            return True
        elif matrix[i][j] > target:
            j -= 1
        else:
            i += 1
    return False
```





## 七、链表（linked list, 14）

### M2. Add Two Numbers（两数相加）✅

给你两个 **非空** 的链表，表示两个非负的整数。它们每位数字都是按照 **逆序** 的方式存储的，并且每个节点只能存储 **一位** 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。



**思路**：模拟竖式加法。进位逐位相加。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
def addTwoNumbers(l1, l2):
    dummy = cur = ListNode(0)
    carry = 0
    while l1 or l2 or carry:
        s = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
        carry = s // 10
        cur.next = ListNode(s % 10)
        cur = cur.next
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    return dummy.next
```



### M19. Remove Nth Node From End of List（删除链表的倒数第 N 个结点）✅

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。



**思路**：快慢指针。快指针先走 n 步，然后快慢一起走，快到底时慢指针指向待删除节点前一个。

```python
def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next
```



### E21. Merge Two Sorted Lists（合并两个有序链表）✅

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 



**思路**：双指针归并。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = cur = ListNode(0)
        while list1 and list2:
            if list1.val < list2.val:
                cur.next = list1
                list1 = list1.next
            else:
                cur.next = list2
                list2 = list2.next
            cur = cur.next
        cur.next = list1 or list2
        return dummy.next
        
```



### T23. Merge k Sorted Lists（合并 K 个升序链表）✅

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。



思路：俩俩合并

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        def merge(p, q):
            dummy = ListNode()
            pre = dummy
            while p and q:
                if p.val <= q.val:
                    pre.next = p
                    pre = p
                    p = p.next
                elif p.val > q.val:
                    pre.next = q
                    pre = q
                    q = q.next

            pre.next = p if p else q

            return dummy.next

        if not lists:
            return None

        n = len(lists)
        while n > 1:
            new_lists = []
            for i in range(0, n, 2):
                if i < n - 1:
                    new_lists.append(merge(lists[i], lists[i + 1]))
                else:
                    new_lists.append(lists[i])
            lists = new_lists
            n = len(lists)

        return lists[0] if lists else None
```



**思路**：用最小堆（优先队列）每次取出最小节点。

```python
import heapq

def mergeKLists(lists):
    dummy = cur = ListNode(0)
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    while heap:
        _, i, node = heapq.heappop(heap)
        cur.next = node
        cur = cur.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
```



### M24. Swap Nodes in Pairs（两两交换链表中的节点）✅

给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。



**思路**：递归或迭代。每次交换两个节点，递归处理后续。

```python
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        nxt = head.next # 暂存第二个节点
        head.next = self.swapPairs(nxt.next) # 递归处理后续节点，并建立连接
        nxt.next = head # 翻转当前两个节点
        return nxt
```

> 使用**递归（Recursion）**方法来解决“两两交换链表中的节点”问题。
>
> **一、 核心思路**
>
> 递归的核心思想是将大问题分解为性质相同的子问题。
> 对于链表 `1 -> 2 -> 3 -> 4`：
>
> 1. 先考虑前两个节点 `1` 和 `2`。
> 2. 将 `3 -> 4` 看作是一个子链表，通过递归调用 `swapPairs` 完成它们的两两交换。
> 3. 得到子链表交换后的结果后，再将 `1` 和 `2` 进行交换，并与子链表的结果拼接起来。
>
> **二、 代码步骤剖析**
>
> ```python
> def swapPairs(head):
>     # 1. 基准条件（Base Case）
>     if not head or not head.next:
>         return head
> ```
> * **作用**：如果链表为空（`not head`）或者只有一个节点（`not head.next`），则无需交换，直接返回当前节点。这同时也是递归的终止条件。
>
> ```python
>     # 2. 暂存第二个节点
>     nxt = head.next
> ```
> * **作用**：记录当前成对节点中的第二个节点（即 `nxt`）。交换后，`nxt` 将成为当前这组节点的头部。
>
> ```python
>     # 3. 递归处理后续节点，并建立连接
>     head.next = swapPairs(nxt.next)
> ```
> * **作用**：`nxt.next` 是下一对节点的起点。把这一起点传入递归函数 `swapPairs`。
> * 递归返回的结果是后续所有节点交换完毕后的新头节点。将当前组的第一个节点 `head` 的 `next` 指向这个返回的结果。
>
> ```python
>     # 4. 翻转当前两个节点
>     nxt.next = head
> ```
> * **作用**：将第二个节点 `nxt` 的指针指向第一个节点 `head`，完成当前这一对节点的交换。
>
> ```python
>     # 5. 返回交换后的新头节点
>     return nxt
> ```
> * **作用**：此时 `nxt` 已经变成了这一对节点的新头部，将其返回给上一层调用。
>
> **三、 实例走读（Trace）**
>
> 以输入链表 `1 -> 2 -> 3 -> 4 -> None` 为例：
>
> 1. **第一层递归**：`head` 为 `1`，`nxt` 为 `2`。
>    * 需要计算 `1.next = swapPairs(3)`。此时进入第二层递归。
> 2. **第二层递归**：`head` 为 `3`，`nxt` 为 `4`。
>    * 需要计算 `3.next = swapPairs(None)`。此时进入第三层递归。
> 3. **第三层递归**：传入的是 `None`。
>    * 触发基准条件 `if not head`，直接返回 `None`。
> 4. **回到第二层递归**：
>    * `3.next` 接住返回值 `None`。
>    * 执行 `4.next = 3`。
>    * 返回 `4` 给第一层。此时这一段结构变为 `4 -> 3 -> None`。
> 5. **回到第一层递归**：
>    * `1.next` 接住返回值 `4`（即 `1.next = 4`）。
>    * 执行 `2.next = 1`。
>    * 返回 `2`。整个链表结构变为 `2 -> 1 -> 4 -> 3 -> None`。
>
> 最终返回的新头节点为 `2`。
>
> **四、 复杂度分析**
>
> * **时间复杂度**：$O(N)$，其中 $N$ 是链表中的节点数量。每个节点都会被访问并处理一次。
> * **空间复杂度**：$O(N)$。由于使用的是递归，会占用系统栈空间。在最坏情况下，递归深度为 $N/2$。
>
> **五、 补充：迭代法的对比**
>
> 如果需要将空间复杂度优化至 $O(1)$，通常可以使用**迭代法**（通过设置一个虚拟头节点 `dummy` 和一个指针，利用循环每次更新节点指向）。虽然迭代法的代码相对繁琐一些，但它不需要消耗额外的栈空间。



迭代法（Iterative Approach）通常通过引入一个**虚拟头节点（Dummy Node）**来简化边界条件的处理，并通过循环和指针移动来实现两两交换。这种方法可以将空间复杂度降低到 $O(1)$。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # 1. 创建虚拟头节点，指向真实的链表头
        dummy = ListNode(0)
        dummy.next = head
        
        # 2. prev 指针用于指向要交换的两个节点的前驱节点
        prev = dummy
        
        # 3. 只有当后面至少还有两个节点时，才进行交换
        while prev.next and prev.next.next:
            # 确定要交换的两个节点
            first = prev.next
            second = prev.next.next
            
            # 开始调整指针进行交换
            first.next = second.next  # 步骤 A：第一个节点指向第三个节点（或后续节点）
            second.next = first       # 步骤 B：第二个节点指向第一个节点
            prev.next = second        # 步骤 C：前驱节点指向原来的第二个节点
            
            # 4. 将 prev 指针向后移动两位，准备处理下一对节点
            # 交换后，first 节点已经变成了这一对节点的后一个，所以 prev 移动到 first
            prev = first
            
        return dummy.next
```



### T25. Reverse Nodes in k-Group（K 个一组翻转链表）✅

给你链表的头节点 `head` ，每 `k` 个节点一组进行翻转，请你返回修改后的链表。

`k` 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 `k` 的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。



**思路**：先检查是否有 k 个节点，然后翻转这 k 个节点，递归处理剩余部分。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # 检查剩余节点是否满足 k
        node = head
        for _ in range(k):
            if not node:
                return head
            node = node.next
        # 翻转当前的 k 个节点
        prev, cur = None, head
        for _ in range(k):
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
        # 递归连接与返回
        head.next = self.reverseKGroup(cur, k)
        return prev
        
```

> 这段代码展示了一个经典的**递归方法**来解决“K 个一组翻转链表”的问题。以下是对该代码的详细解读、工作原理剖析以及复杂度分析。
>
> ---
>
> **一、 代码设计思路剖析**
>
> 该解法将问题分解为子问题，每次只处理当前长度为 $k$ 的一段链表，其余部分交给递归函数处理。整个过程可以分为三个主要步骤：
>
> **1. 检查剩余节点是否满足 $k$ 个**
>
> ```python
> node = head
> for _ in range(k):
>     if not node:
>         return head
>     node = node.next
> ```
> * **作用**：在动手翻转之前，先往后数 $k$ 个节点。
> * **逻辑**：如果中途遇到空节点（`node is None`），说明剩余节点不足 $k$ 个。根据题目要求，这些节点保持原样，直接返回当前段的头节点 `head`。如果成功循环 $k$ 次，说明后面有足够的节点可以进行翻转，此时 `node` 指向了第 $k+1$ 个节点（即下一组的起点）。
>
> **2. 翻转当前的 $k$ 个节点**
>
> ```python
> prev, cur = None, head
> for _ in range(k):
>     nxt = cur.next
>     cur.next = prev
>     prev = cur
>     cur = nxt
> ```
> * **作用**：标准的多指针迭代翻转局部链表。
> * **状态变化**：
>   * 在循环开始前，`cur` 指向当前组的头节点（翻转后它将变成尾节点）。
>   * 循环执行 $k$ 次后，这一组的 $k$ 个节点的指针方向全部完成反转。
>   * 此时 `prev` 指向翻转后的新头部（即原第 $k$ 个节点），`cur` 指向下一组的起始节点（即原第 $k+1$ 个节点）。
>
> **3. 递归连接与返回**
>
> ```python
> head.next = reverseKGroup(cur, k)
> return prev
> ```
> * **作用**：连接当前已翻转部分与后续未处理（或已处理）部分。
> * **逻辑**：
>   * 当前组翻转后，原来的头节点 `head` 变成了当前组的尾节点。
>   * 它的 `next` 应该指向下一组翻转后的新头节点。因此，将 `cur`（下一组的起点）作为参数递归调用 `reverseKGroup`，并将返回值赋给 `head.next`。
>   * 最后，返回 `prev`，因为 `prev` 是当前这组翻转后的新头节点，它将被上一层的递归调用连接。
>
> ---
>
> **二、 实例走读**
>
> 假设链表为 `1 -> 2 -> 3 -> 4 -> 5`，`k = 2`。
>
> 1. **第一层递归**：
>    * 检查：存在 2 个节点（1 和 2）。
>    * 翻转前 2 个节点：`1 -> 2` 变为 `2 -> 1`。此时 `prev = 2`，`cur = 3`，原头节点 `head = 1`。
>    * 递归调用：`head.next (1.next) = reverseKGroup(3, 2)`。
>
> 2. **第二层递归**（输入 `head = 3`）：
>    * 检查：存在 2 个节点（3 和 4）。
>    * 翻转这 2 个节点：`3 -> 4` 变为 `4 -> 3`。此时 `prev = 4`，`cur = 5`，原头节点 `head = 3`。
>    * 递归调用：`head.next (3.next) = reverseKGroup(5, 2)`。
>
> 3. **第三层递归**（输入 `head = 5`）：
>    * 检查：只剩 1 个节点（5），不足 2 个。
>    * 触发边界：直接返回 `head`（即 5）。
>
> 4. **回溯拼接**：
>    * 第二层：`3.next = 5`。返回 `prev = 4`（此时这部分为 `4 -> 3 -> 5`）。
>    * 第一层：`1.next = 4`。返回 `prev = 2`（整个链表变为 `2 -> 1 -> 4 -> 3 -> 5`）。
>
> ---
>
> **三、 复杂度分析**
>
> * **时间复杂度**：$O(N)$
>   其中 $N$ 是链表的节点总数。每个节点最多被遍历两次（一次用于检查长度，一次用于翻转指针），因此时间复杂度与节点数成线性关系。
>
> * **空间复杂度**：$O(N/k)$
>   由于采用了递归写法，递归栈的深度取决于链表被分成了多少组。一共会有 $N/k$ 次递归调用，因此需要 $O(N/k)$ 的系统栈空间。如果在面试中对空间复杂度有 $O(1)$ 的严格要求，则需要将递归改写为纯迭代的双指针结构。



### M138. Copy List with Random Pointer（随机链表的复制）✅

给你一个长度为 `n` 的链表，每个节点包含一个额外增加的随机指针 `random` ，该指针可以指向链表中的任何节点或空节点。

构造这个链表的 **[深拷贝](https://baike.baidu.com/item/深拷贝/22785317?fr=aladdin)**。 深拷贝应该正好由 `n` 个 **全新** 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 `next` 指针和 `random` 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。**复制链表中的指针都不应指向原链表中的节点** 。

例如，如果原链表中有 `X` 和 `Y` 两个节点，其中 `X.random --> Y` 。那么在复制链表中对应的两个节点 `x` 和 `y` ，同样有 `x.random --> y` 。

返回复制链表的头节点。

用一个由 `n` 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 `[val, random_index]` 表示：

- `val`：一个表示 `Node.val` 的整数。
- `random_index`：随机指针指向的节点索引（范围从 `0` 到 `n-1`）；如果不指向任何节点，则为 `null` 。

你的代码 **只** 接受原链表的头节点 `head` 作为传入参数。



**思路**：在原链表每个节点后插入复制节点，然后处理 random 指针，最后分离。

结构变化：A -> B -> C 变为 A -> A' -> B -> B' -> C -> C'。其中带 ' 的为复制节点。

```python
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random


class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if not head:
            return None
        # 1.复制节点并交错插入
        cur = head
        while cur:
            # 创建新节点，新节点的 next 指向原节点的 next
            node = Node(cur.val, cur.next, None)
            # 将原节点的 next 指向新节点
            cur.next = node
            # 移动到下一个原节点（即原 cur.next，现在是 node.next）
            cur = node.next

        # 2.设置复制节点的 random 指针
        cur = head
        while cur:
            if cur.random:
                # cur.random.next 恰好就是 cur.random 对应的复制节点
                cur.next.random = cur.random.next
            cur = cur.next.next # 移动到下一个原节点

        # 3.拆分链表（恢复原链表，提取复制链表）
        cur = head
        new_head = head.next # 新链表的头节点是原头节点的下一个节点
        while cur:
            copy = cur.next         # 定位到复制节点
            cur.next = copy.next    # 恢复原节点的 next 指向
            cur = cur.next          # cur 移动到下一个原节点
            if cur:
                copy.next = cur.next    # 复制节点的 next 指向下一个复制节点
        return new_head
```



### M148. Sort List（排序链表）✅

给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。



**思路**：归并排序。快慢指针找中点，递归排序左右，再合并。

```python
def sortList(head):
    if not head or not head.next:
        return head
    # 快慢指针寻找中点并断开
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None	# 注意：必须断开链表
    
    # 递归排序左右子链表
    left = sortList(head)
    right = sortList(mid)
    
    # 合并两个有序链表
    dummy = cur = ListNode(0)
    while left and right:
        if left.val < right.val:
            cur.next = left
            left = left.next
        else:
            cur.next = right
            right = right.next
        cur = cur.next
    cur.next = left or right
    return dummy.next
```

> 这是一个经典的合并双有序链表的过程：
>
> - 引入一个虚拟头节点 dummy（哨兵节点），用 cur 指针来构建新的有序链表。
> - 比较 left 和 right 节点的值，将较小的节点接在 cur.next 后面，并移动相应的指针。
> - 当其中一个链表遍历完毕时，通过 cur.next = left or right 将另一个未遍历完的链表直接拼接到末尾。
> - 最后返回 dummy.next，即合并后新链表的头节点。



### M146. LRU Cache（LRU 缓存）✅

请你设计并实现一个满足 [LRU (最近最少使用) 缓存](https://baike.baidu.com/item/LRU) 约束的数据结构。

实现 `LRUCache` 类：

- `LRUCache(int capacity)` 以 **正整数** 作为容量 `capacity` 初始化 LRU 缓存
- `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
- `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 **逐出** 最久未使用的关键字。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。



**思路**：哈希表 + 双向链表。每次访问将节点移到头部，淘汰时移除尾部。

```python
class DLinkedNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}
        self.head = DLinkedNode()
        self.tail = DLinkedNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_head(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_to_head(node)
        return node.val

    def put(self, key, val):
        if key in self.cache:
            node = self.cache[key]
            node.val = val
            self._remove(node)
            self._add_to_head(node)
        else:
            node = DLinkedNode(key, val)
            self.cache[key] = node
            self._add_to_head(node)
            if len(self.cache) > self.cap:
                rm = self.tail.prev
                self._remove(rm)
                del self.cache[rm.key]
```



### E206. Reverse Linked List（反转链表）✅

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。



**思路**：迭代，用 prev 和 cur 两个指针逐步反转。

```python
def reverseList(head):
    prev = None
    cur = head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev
```



### E141. Linked List Cycle（环形链表）✅

给你一个链表的头节点 `head` ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。**注意：`pos` 不作为参数进行传递** 。仅仅是为了标识链表的实际情况。

*如果链表中存在环* ，则返回 `true` 。 否则，返回 `false` 。



**思路**：快慢指针，相遇即有环。

```python
def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```



### M142. Linked List Cycle II（环形链表 II）✅

给定一个链表的头节点  `head` ，返回链表开始入环的第一个节点。 *如果链表无环，则返回 `null`。*

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（**索引从 0 开始**）。如果 `pos` 是 `-1`，则在该链表中没有环。**注意：`pos` 不作为参数进行传递**，仅仅是为了标识链表的实际情况。

**不允许修改** 链表。



**思路**：快慢指针相遇后，一个指针从头开始，一个从相遇点，再次相遇即为入环点。

```python
def detectCycle(head):
    slow = fast = head
    # 1. 步骤一：判断是否有环并寻找首次相遇点
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        # 快慢指针相遇，说明有环
        if slow == fast:
            # 2. 步骤二：寻找环的入口
            slow = head  # 慢指针回到起点
            while slow != fast:
                slow = slow.next  # 慢指针每次走一步
                fast = fast.next  # 快指针此时也改为每次走一步
            return slow  # 再次相遇点即为入环点
            
    return None  # 快指针指向空，说明无环
```

> 这是一道经典的算法题，利用**快慢指针（双指针法）**不仅可以判断链表是否有环，还能在 $O(1)$ 的额外空间复杂度下找到环的入口。
>
> **一、 数学原理推导**
>
> 为什么“快慢指针相遇后，一个指针回到起点，另一个指针留在相遇点，二者同时以相同速度出发，再次相遇的地方就是入环点”？
>
> 我们可以通过几何关系来进行数学推导：
>
> 1. **定义距离**：
>    * 设从**链表头节点**到**环形入口节点**的距离为 $a$。
>    * 设从**环形入口节点**到**快慢指针相遇点**的距离为 $b$。
>    * 设从**相遇点**继续往前走回到**环形入口节点**的距离为 $c$。
>    * 那么，环的周长为 $L = b + c$。
>
> 2. **相遇时快慢指针走过的路程**：
>    * 慢指针（`slow`）走过的路程为：$s_1 = a + b$（慢指针在环内走不到一圈就会被快指针追上）。
>    * 快指针（`fast`）走过的路程为：$s_2 = a + n(b + c) + b$，其中 $n \ge 1$ 表示快指针在环内已经转了 $n$ 圈。
>
> 3. **根据速度关系建立等式**：
>    * 因为快指针的速度是慢指针的 2 倍，所以相同时间内快指针走过的路程是慢指针的 2 倍：
>      $$s_2 = 2 \cdot s_1$$
>      $$a + n(b + c) + b = 2(a + b)$$
>
> 4. **化简等式**：
>    * 整理上述公式：
>      $$a + n(b + c) + b = 2a + 2b$$
>      $$a = n(b + c) - b$$
>    * 为了更直观，我们可以拆出一项 $(b+c)$：
>      $$a = (n - 1)(b + c) + (b + c) - b$$
>      $$a = (n - 1)(b + c) + c$$
>
> 5. **结论分析**：
>    * 表达式 $a = (n - 1)(b + c) + c$ 说明：**从链表头到入环点的距离 $a$**，等于**从相遇点到入环点的距离 $c$** 加上 **$n-1$ 圈的环长**。
>    * 这意味着，如果让一个指针从链表头部出发（走过距离 $a$），另一个指针从相遇点出发（走过距离 $c$ 并可能绕环若干圈），它们最终一定会在**入环点**相遇。
>
> **二、 复杂度分析**
>
> * **时间复杂度**：$O(N)$
>   * 在第一阶段，若无环，`fast` 遍历一遍链表，耗时 $O(N)$；若有环，快慢指针在慢指针走完一圈内必然相遇，耗时 $O(N)$。
>   * 在第二阶段，指针从起点和相遇点分别走到入口，步数等于距离 $a$，耗时 $O(N)$。
>   * 总体时间复杂度为线性级别。
>
> * **空间复杂度**：$O(1)$
>   * 仅使用了 `slow` 和 `fast` 两个指针变量，没有使用额外的哈希表等数据结构，符合题目“不修改链表”且空间复杂度最小的要求。



### E160. Intersection of Two Linked Lists（相交链表）✅

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null`。



**思路**：两指针分别从 a、b 开始，走完自己链表后走对方链表，相遇点即为交点。

```python
def getIntersectionNode(headA, headB):
    a, b = headA, headB
    while a != b:
        a = a.next if a else headB
        b = b.next if b else headA
    return a
```

> 这段代码展示了解决“相交链表”问题的一种经典且空间复杂度为 $O(1)$ 的双指针解法。以下是对该思路和代码的详细解读：
>
> **1. 核心原理：消除长度差**
>
> 两个链表可能长度不同，如果直接同时遍历，它们无法同时到达相交节点。该算法的核心思想是通过**让两个指针经历相同的路程**来消除长度差。
>
> 我们可以把链表分成三个部分：
> *   **$a$**：链表 A 独有的部分（长度为 $a$）
> *   **$b$**：链表 B 独有的部分（长度为 $b$）
> *   **$c$**：两个链表公共的相交部分（长度为 $c$，若不相交则 $c = 0$）
>
> **指针的移动轨迹：**
>
> *   **指针 `a`** 先走完链表 A（距离 $a + c$），然后指向链表 B 的头部，继续走链表 B 独有的部分（距离 $b$）。总路程为：
>     $$\text{路程}_A = a + c + b$$
> *   **指针 `b`** 先走完链表 B（距离 $b + c$），然后指向链表 A 的头部，继续走链表 A 独有的部分（距离 $a$）。总路程为：
>     $$\text{路程}_B = b + c + a$$
>
> 因为 $a + c + b = b + c + a$，所以当两个指针各自走完这段距离时，它们会在**相交的起始节点**处相遇。
>
> ---
>
> **2. 两种情况的分析**
>
> 情况一：两个链表相交 ($c > 0$)
>
> *   指针 `a` 和 `b` 会在相交节点处相遇（此时 `a == b` 且不为 `None`），循环结束，返回相遇节点。
>
> 情况二：两个链表不相交 ($c = 0$)
>
> *   此时公共长度 $c = 0$。
> *   指针 `a` 走了 $a$ 步到达 A 的末尾，重定向到 B，再走 $b$ 步，总共走了 $a + b$ 步，此时指向 `None`。
> *   指针 `b` 走了 $b$ 步到达 B 的末尾，重定向到 A，再走 $a$ 步，总共走了 $b + a$ 步，此时指向 `None`。
> *   两个指针同时变为 `None`（`a == b == None`），循环结束，返回 `None`。
>
> ---
>
> **3. 代码细节解析**
>
> ```python
> def getIntersectionNode(headA, headB):
>     a, b = headA, headB
>     while a != b:
>         # 如果 a 走到链表末尾（即为 None），则重定向到 headB；否则继续走下一步
>         a = a.next if a else headB
>         # 如果 b 走到链表末尾（即为 None），则重定向到 headA；否则继续走下一步
>         b = b.next if b else headA
>     return a
> ```
>
> *   **`a = a.next if a else headB`**：
>     这里的判断是 `if a`（判断当前指针是否为 `None`），而不是 `if a.next`。这样设计可以确保当链表不相交时，指针最终能够走到 `None` 并触发 `a == b == None` 从而退出循环。如果使用 `if a.next`，在不相交的情况下会导致死循环。
>
> ---
>
> **4. 复杂度分析**
>
> *   **时间复杂度**：$O(M + N)$
>     其中 $M$ 和 $N$ 分别为两个链表的长度。两个指针最多各遍历两个链表一次（即走完 $M + N$ 个节点），因此时间复杂度是线性的。
> *   **空间复杂度**：$O(1)$
>     该算法只使用了两个指针变量 `a` 和 `b`，没有使用额外的指针容器（如哈希表），因此空间复杂度为常数级别。



### E234. Palindrome Linked List（回文链表）✅

给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。



**思路**：快慢指针找中点，反转后半部分，比较两半。

```python
def isPalindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    prev = None
    while slow:
        nxt = slow.next
        slow.next = prev
        prev = slow
        slow = nxt
    while prev:
        if head.val != prev.val:
            return False
        head = head.next
        prev = prev.next
    return True
```





## 八、二叉树（binary tree, 15）

### E94. Binary Tree Inorder Traversal（二叉树的中序遍历）✅

给定一个二叉树的根节点 `root` ，返回 *它的 **中序** 遍历* 。



**思路**：递归（左-根-右）或栈模拟。

```python
def inorderTraversal(root):
    res = []
    def inorder(node):
        if not node: return
        inorder(node.left)
        res.append(node.val)
        inorder(node.right)
    inorder(root)
    return res
```



### E101. Symmetric Tree（对称二叉树）✅

给你一个二叉树的根节点 `root` ， 检查它是否轴对称。



**思路**：递归比较左子树的左孩子与右子树的右孩子，左子树的右孩子与右子树的左孩子。

```python
def isSymmetric(root):
    def check(l, r):
        if not l and not r: return True
        if not l or not r or l.val != r.val: return False
        return check(l.left, r.right) and check(l.right, r.left)
    return check(root.left, root.right) if root else True
```

### M102. Binary Tree Level Order Traversal（二叉树的层序遍历）✅

给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。 （即逐层地，从左到右访问所有节点）。



**思路**：BFS 用队列，每层一次性处理全部节点。

```python
from collections import deque

def levelOrder(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res
```



### E104. Maximum Depth of Binary Tree（二叉树的最大深度）✅

给定一个二叉树 `root` ，返回其最大深度。

二叉树的 **最大深度** 是指从根节点到最远叶子节点的最长路径上的节点数。



**思路**：递归求左右子树最大深度 + 1。

```python
def maxDepth(root):
    if not root: return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
```



### M105. Construct Binary Tree from Preorder and Inorder Traversal（从前序与中序遍历序列构造二叉树）✅

给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的**先序遍历**， `inorder` 是同一棵树的**中序遍历**，请构造二叉树并返回其根节点。



**思路**：前序第一个为根，在中序中找到根的位置，左右部分递归构建。

```python
from typing import List, Optional
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        # 思路：前序第一个为根，在中序中找到根的位置，左右部分递归构建。

        # 缓存中序遍历的值与索引的关系，避免每次重复查找
        idx_map = {val: i for i, val in enumerate(inorder)}

        # pl, pr: 当前子树在前序遍历中的左右边界
        # il, ir: 当前子树在中序遍历中的左右边界
        def build(pl, pr, il, ir):
            # 递归终止条件
            if pl > pr:
                return None

            # 前序遍历的第一个元素为当前子树的根节点
            root = TreeNode(preorder[pl])

            # 找到根节点在中序遍历中的位置
            i = idx_map[root.val]

            # 计算左子树的长度
            left_len = i - il

            # 递归构建左子树：
            # 前序遍历区间缩小为：[pl + 1, pl + left_len]
            # 中序遍历区间缩小为：[il, i - 1]
            root.left = build(pl + 1, pl + left_len, il, i - 1)

            # 递归构建右子树：
            # 前序遍历区间缩小为：[pl + left_len + 1, pr]
            # 中序遍历区间缩小为：[i + 1, ir]
            root.right = build(pl + left_len + 1, pr, i + 1, ir)

            return root

        return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```



```python
from typing import List, Optional


# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        # 边界情况：如果前序或中序遍历序列为空，说明当前子树为空，返回 None
        if not preorder or not inorder:
            return None

        # 前序遍历的第一个元素即为当前子树的根节点值
        root_val = preorder[0]
        root = TreeNode(root_val)

        # 在中序遍历中定位根节点的位置，用以划分左右子树
        root_index = inorder.index(root_val)

        # 递归构建左子树和右子树
        # 1. 左子树：
        #    - 前序序列取根节点后的 root_index 个元素: preorder[1 : 1 + root_index]
        #    - 中序序列取根节点左侧的所有元素: inorder[:root_index]
        root.left = self.buildTree(preorder[1:1 + root_index], inorder[:root_index])

        # 2. 右子树：
        #    - 前序序列取剩余部分: preorder[1 + root_index:]
        #    - 中序序列取根节点右侧的所有元素: inorder[root_index + 1:]
        root.right = self.buildTree(preorder[1 + root_index:], inorder[root_index + 1:])

        # 返回当前构建好的子树根节点
        return root


if __name__ == '__main__':
    solution = Solution()
    # 测试样例数据
    preorder = [3, 9, 20, 15, 7]
    inorder = [9, 3, 15, 20, 7]

    # 构建二叉树
    root = solution.buildTree(preorder, inorder)
    # 输出的二叉树结构对应为: [3, 9, 20, None, None, 15, 7]
```



### E108. Convert Sorted Array to Binary Search Tree（将有序数组转换为二叉搜索树）✅

给你一个整数数组 `nums` ，其中元素已经按 **升序** 排列，请你将其转换为一棵 平衡 二叉搜索树。



**思路**：取中间元素为根，左右递归构建。

```python
def sortedArrayToBST(nums):
    def build(l, r):
        if l > r: return None
        mid = (l + r) // 2
        root = TreeNode(nums[mid])
        root.left = build(l, mid - 1)
        root.right = build(mid + 1, r)
        return root
    return build(0, len(nums) - 1)
```



### M114. Flatten Binary Tree to Linked List（二叉树展开为链表）✅

给你二叉树的根结点 `root` ，请你将它展开为一个单链表：

- 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而左子指针始终为 `null` 。

- 展开后的单链表应该与二叉树 [**先序遍历**](https://baike.baidu.com/item/先序遍历/6442839?fr=aladdin) 顺序相同。

  

**思路**：“寻找前驱节点”方法。先序遍历，每次将左子树移到右子树位置，再将原右子树接到左子树最右边。

```python
def flatten(root):
    cur = root
    while cur:
        # 如果当前节点有左子树，才需要进行旋转和拼接
        if cur.left:
            # 1. 寻找左子树的最右节点（先序遍历中，左子树里最后被访问的节点）
            pre = cur.left
            while pre.right:
                pre = pre.right
            
            # 2. 将原来的右子树接到这个最右节点的右边
            pre.right = cur.right
            
            # 3. 将左子树整体移动到右边
            cur.right = cur.left
            
            # 4. 将左子树清空
            cur.left = None
            
        # 无论是否有左子树，cur 都向右移动一步
        cur = cur.right
```



### T124. Binary Tree Maximum Path Sum（二叉树中的最大路径和）✅

二叉树中的 **路径** 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 **至多出现一次** 。该路径 **至少包含一个** 节点，且不一定经过根节点。

**路径和** 是路径中各节点值的总和。

给你一个二叉树的根节点 `root` ，返回其 **最大路径和** 。



**思路**：后序遍历。对每个节点，计算经过该节点的最大路径和，同时返回以该节点为端点的最大单边和。

```python
def maxPathSum(root):
    ans = -float('inf')
    def dfs(node):
        nonlocal ans
        if not node: return 0
        left = max(dfs(node.left), 0)
        right = max(dfs(node.right), 0)
        ans = max(ans, left + right + node.val)
        return node.val + max(left, right) # 返回该节点能提供给父节点的最大增益
    dfs(root)
    return ans
```



### M199. Binary Tree Right Side View（二叉树的右视图）✅

给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。



**思路**：层序遍历，每层取最右节点。

```python
from collections import deque

def rightSideView(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        res.append(q[-1].val)
        for _ in range(len(q)):
            node = q.popleft()
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
    return res
```



### E226. Invert Binary Tree（翻转二叉树）✅

给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。



**思路**：递归交换左右子树。

```python
def invertTree(root):
    if not root: return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root
```



### M236. Lowest Common Ancestor of a Binary Tree（二叉树的最近公共祖先）✅

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/最近公共祖先/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”



**思路**：递归查找。若当前节点是 p 或 q 则返回；左右子树都找到则当前为 LCA。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # 1. 如果 root 为空，或者 root 就是我们要找的节点之一，直接返回 root
        if not root or root == p or root == q:
            return root
        
        # 2. 递归在左子树和右子树中查找
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        
        # 3. 如果左子树找到了一个，右子树也找到了一个
        # 说明 p 和 q 分居 root 的两侧，root 就是 LCA
        if left and right:
            return root
        
        # 4. 如果只有左子树找到了，返回左子树的结果
        if left:
            return left
        
        # 5. 如果只有右子树找到了，返回右子树的结果
        if right:
            return right
        
        # 6. 如果都没找到，返回 None
        return None
```



### M437. Path Sum III（路径总和 III）✅

给定一个二叉树的根节点 `root` ，和一个整数 `targetSum` ，求该二叉树里节点值之和等于 `targetSum` 的 **路径** 的数目。

**路径** 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。



**思路**：前缀和 + DFS。用哈希表记录从根到当前节点的路径和出现次数。

```python
def pathSum(root, targetSum):
    # prefix 哈希表记录当前路径中各个前缀和出现的次数
    # 初始化 {0: 1} 是为了处理“从根节点开始的路径和恰好等于 targetSum”的情况
    prefix = {0: 1}
    ans = 0

    def dfs(node, cur):
        nonlocal ans
        # 递归终止条件：空节点直接返回
        if not node: 
            return
        
        # 累加当前节点的值，得到从根节点到当前节点的前缀和
        cur += node.val
        
        # 如果当前路径上存在某个历史前缀和等于 cur - targetSum，
        # 说明从那个历史节点到当前节点的子路径和为 targetSum，将其出现次数累加到 ans 中
        ans += prefix.get(cur - targetSum, 0)
        
        # 将当前前缀和 cur 存入哈希表，次数加 1
        prefix[cur] = prefix.get(cur, 0) + 1
        
        # 递归遍历左子树
        dfs(node.left, cur)
        # 递归遍历右子树
        dfs(node.right, cur)
        
        # 【回溯】
        # 在返回父节点之前，需要将当前节点的前缀和计数减 1
        # 防止当前节点的前缀和干扰到其他非子树路径的计算
        prefix[cur] -= 1

    # 从根节点开始 DFS 遍历，初始前缀和为 0
    dfs(root, 0)
    return ans
```

> 这是一道经典的二叉树问题，采用**前缀和 + DFS（深度优先搜索）**的方法可以高效解决。
>
> **算法解读**
>
> **1. 为什么引入“前缀和”？**
>
> 在一维数组中，如果我们想求区间 `[i, j]` 的元素和，可以通过两个前缀和的差值来计算：
> $$\text{Sum}(i, j) = \text{PrefixSum}(j) - \text{PrefixSum}(i-1)$$
> 同理，在二叉树中，如果一条向下的路径起点为 `A`，终点为 `B`（`A` 是 `B` 的祖先节点），那么这条路径的和可以表示为：
> $$\text{PathSum}(A \rightarrow B) = \text{PrefixSum}(B) - \text{PrefixSum}(\text{parent of } A)$$
> 其中 $\text{PrefixSum}(X)$ 表示从根节点 `root` 到节点 `X` 的路径节点值之和。
>
> **2. 哈希表的作用**
>
> 在 DFS 遍历二叉树的过程中，我们用一个哈希表 `prefix` 记录**从根节点到当前节点的路径上，所有前缀和出现的次数**。
> * 当遍历到某个节点时，当前路径的前缀和为 `cur`。
> * 需要寻找有多少个祖先节点的前缀和等于 `cur - targetSum`。因为如果存在这样的祖先节点，那么从该祖先节点到当前节点的路径和就正好是 `targetSum`。
> * 此时，我们直接从哈希表中查询 `cur - targetSum` 出现的次数，并累加到结果 `ans` 中。
>
> **3. 回溯（Backtracking）的必要性**
>
> 因为在遍历整棵树，当一个节点的左右子树都遍历完毕、准备返回其父节点时，该节点就超出了当前处理的路径范围。为了不影响其他分支的计算，需要在回溯时将当前节点的前缀和从哈希表 `prefix` 中恢复（即计数减 1）。
>
> **复杂度分析**
>
> * **时间复杂度**：$\mathcal{O}(N)$，其中 $N$ 是二叉树的节点数。每个节点仅被访问一次，在哈希表中插入和查询的时间复杂度为 $\mathcal{O}(1)$。
> * **空间复杂度**：$\mathcal{O}(N)$。主要开销为递归调用的栈空间以及哈希表的大小。在最坏情况下（树退化为链表），递归栈深度和哈希表大小均为 $N$。



### E543. Diameter of Binary Tree（二叉树的直径）✅

给你一棵二叉树的根节点，返回该树的 **直径** 。

二叉树的 **直径** 是指树中任意两个节点之间最长路径的 **长度** 。这条路径可能经过也可能不经过根节点 `root` 。

两节点之间路径的 **长度** 由它们之间边数表示。



**思路**：后序遍历，对每个节点求左右子树深度和，取最大值。

```python
def diameterOfBinaryTree(root):
    ans = 0
    def depth(node):
        nonlocal ans
        if not node: return 0
        left = depth(node.left)
        right = depth(node.right)
        ans = max(ans, left + right)
        return 1 + max(left, right)
    depth(root)
    return ans
```



### M98. Validate Binary Search Tree（验证二叉搜索树）✅

给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。

**有效** 二叉搜索树定义如下：

- 节点的左子树只包含 **严格小于** 当前节点的数。
- 节点的右子树只包含 **严格大于** 当前节点的数。
- 所有左子树和右子树自身必须也是二叉搜索树。



**思路**：中序遍历递增。或递归传入 min/max 边界。

```python
def isValidBST(root):
    def valid(node, lo, hi):
        if not node: return True
        if not (lo < node.val < hi): return False
        return valid(node.left, lo, node.val) and valid(node.right, node.val, hi)
    return valid(root, -float('inf'), float('inf'))
```



### M230. Kth Smallest Element in a BST（二叉搜索树中第 K 小的元素）✅

给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 `k` 小的元素（`k` 从 1 开始计数）。



**思路**：中序遍历（BST 的中序为升序），遍历到第 k 个即结果。

```python
def kthSmallest(root, k):
    stack = []
    while stack or root:
        while root:
            stack.append(root)
            root = root.left
        root = stack.pop()
        k -= 1
        if k == 0: return root.val
        root = root.right
```



## 九、图论（graph, 4）

### M200. Number of Islands（岛屿数量）✅

给你一个由 `'1'`（陆地）和 `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。



**思路**：遍历每个格子，遇到 '1' 将其连通的所有 '1' 标记为 '0'（DFS/BFS）。

```python
def numIslands(grid):
    m, n = len(grid), len(grid[0])
    def dfs(i, j):
        if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':
            return
        grid[i][j] = '0'
        for di, dj in ((1,0), (-1,0), (0,1), (0,-1)):
            dfs(i + di, j + dj)
    ans = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                ans += 1
                dfs(i, j)
    return ans
```



### M207. Course Schedule（课程表）✅

你这个学期必须选修 `numCourses` 门课程，记为 `0` 到 `numCourses - 1` 。

在选修某些课程之前需要一些先修课程。 先修课程按数组 `prerequisites` 给出，其中 `prerequisites[i] = [ai, bi]` ，表示如果要学习课程 `ai` 则 **必须** 先学习课程 `bi` 。

- 例如，先修课程对 `[0, 1]` 表示：想要学习课程 `0` ，你需要先完成课程 `1` 。

请你判断是否可能完成所有课程的学习？如果可以，返回 `true` ；否则，返回 `false` 。



**思路**：拓扑排序（Kahn 算法）。统计入度，入度为 0 的节点入队。

```python
def canFinish(numCourses, prerequisites):
    from collections import deque
    indeg = [0] * numCourses
    graph = [[] for _ in range(numCourses)]
    for u, v in prerequisites:
        graph[v].append(u)
        indeg[u] += 1
    q = deque([i for i in range(numCourses) if indeg[i] == 0])
    cnt = 0
    while q:
        node = q.popleft()
        cnt += 1
        for nei in graph[node]:
            indeg[nei] -= 1
            if indeg[nei] == 0:
                q.append(nei)
    return cnt == numCourses
```



### M208. Implement Trie (Prefix Tree)（实现 Trie 前缀树）✅

**[Trie](https://baike.baidu.com/item/字典树/9825209?fr=aladdin)**（发音类似 "try"）或者说 **前缀树** 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

- `Trie()` 初始化前缀树对象。
- `void insert(String word)` 向前缀树中插入字符串 `word` 。
- `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false` 。
- `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix` ，返回 `true` ；否则，返回 `false` 。



**思路**：每个节点包含一个长度为 26 的子节点数组和一个结束标志。

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def startsWith(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True
```



### M994. Rotting Oranges（腐烂的橘子）✅

在给定的 `m x n` 网格 `grid` 中，每个单元格可以有以下三个值之一：

- 值 `0` 代表空单元格；
- 值 `1` 代表新鲜橘子；
- 值 `2` 代表腐烂的橘子。

每分钟，腐烂的橘子 **周围 4 个方向上相邻** 的新鲜橘子都会腐烂。

返回 *直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 `-1`* 。



**思路**：多源 BFS。将所有初始腐烂橘子入队，按层扩散。

```python
from collections import deque

def orangesRotting(grid):
    m, n = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 2:
                q.append((i, j))
            elif grid[i][j] == 1:
                fresh += 1
    if fresh == 0:
        return 0
    minutes = 0
    while q:
        for _ in range(len(q)):
            i, j = q.popleft()
            for di, dj in ((1,0), (-1,0), (0,1), (0,-1)):
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:
                    grid[ni][nj] = 2
                    fresh -= 1
                    q.append((ni, nj))
        minutes += 1
    return -1 if fresh else minutes - 1
```



## 十、回溯（backtracking, 8）

### M17. Letter Combinations of a Phone Number（电话号码的字母组合）✅

给定一个仅包含数字 `2-9` 的字符串，返回所有它能表示的字母组合。答案可以按 **任意顺序** 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。



**思路**：回溯。逐位递归生成所有组合。

```python
def letterCombinations(digits):
    if not digits: return []
    mapping = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
               '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
    res = []
    def backtrack(i, cur):
        if i == len(digits):
            res.append(cur)
            return
        for ch in mapping[digits[i]]:
            backtrack(i + 1, cur + ch)
    backtrack(0, '')
    return res
```



### M22. Generate Parentheses（括号生成）✅

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。



**思路**：回溯。只当左括号数 < n 时加左括号，右括号数 < 左括号数时加右括号。

```python
def generateParenthesis(n):
    res = []
    def backtrack(l, r, cur):
        if l == n and r == n: # 或者 len(cur) == 2 * n
            res.append(cur)
            return
        if l < n:
            backtrack(l + 1, r, cur + '(')
        if r < l:
            backtrack(l, r + 1, cur + ')')
    backtrack(0, 0, '')
    return res
```



### M39. Combination Sum（组合总和）✅

给你一个 **无重复元素** 的整数数组 `candidates` 和一个目标整数 `target` ，找出 `candidates` 中可以使数字和为目标数 `target` 的 所有 **不同组合** ，并以列表形式返回。你可以按 **任意顺序** 返回这些组合。

`candidates` 中的 **同一个** 数字可以 **无限制重复被选取** 。如果至少一个数字的被选数量不同，则两种组合是不同的。 

对于给定的输入，保证和为 `target` 的不同组合数少于 `150` 个。



**思路**：回溯。候选可重复使用，每次从当前下标开始尝试。

```python
def combinationSum(candidates, target):
    res = []
    def backtrack(start, cur, total):
        if total == target:
            res.append(cur[:])
            return
        if total > target: return
        for i in range(start, len(candidates)):
            cur.append(candidates[i])
            backtrack(i, cur, total + candidates[i])
            cur.pop()
    backtrack(0, [], 0)
    return res
```



### M46. Permutations（全排列）✅

给定一个不含重复数字的数组 `nums` ，返回其 *所有可能的全排列* 。你可以 **按任意顺序** 返回答案。



**思路**：回溯。用 visited 标记已选元素。

```python
def permute(nums):
    res = []
    def backtrack(cur, used):
        if len(cur) == len(nums):		# 终止条件：当前排列已满
            res.append(cur[:])			# 深拷贝
            return
        for i in range(len(nums)):	# 尝试每个未被使用的数
            if not used[i]:
                used[i] = True			# 避免重复使用
                cur.append(nums[i])	# 旋转
                backtrack(cur, used)# 递归
                cur.pop()						# 回溯
                used[i] = False
    backtrack([], [False] * len(nums))
    return res
```



### M78. Subsets（子集）✅

给你一个整数数组 `nums` ，数组中的元素 **互不相同** 。返回该数组所有可能的子集（幂集）。

解集 **不能** 包含重复的子集。你可以按 **任意顺序** 返回解集。



**思路**：回溯。每个元素选或不选。

```python
def subsets(nums):
    res = []
    def backtrack(start, cur):
        res.append(cur[:])
        for i in range(start, len(nums)):
            cur.append(nums[i])
            backtrack(i + 1, cur)
            cur.pop()
    backtrack(0, [])
    return res
```



```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        ans, sol = [], []
        
        def backtrack(i):
            # 终止条件：处理完所有元素
            if i == n:
                ans.append(sol[:])
                return
            
            # 分支1：不选择 nums[i]
            backtrack(i + 1)
            
            # 分支2：选择 nums[i]
            sol.append(nums[i])
            backtrack(i + 1)
            sol.pop()  # 回溯
        
        backtrack(0)
        return ans
```



```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        ans = []
        for i in range(1 << n):  # 等价于 2**n，但更快
            subset = []
            for j in range(n):
                if i & (1 << j):  # 检查第 j 位是否为 1
                    subset.append(nums[j])
            ans.append(subset)
        return ans
```



### T51. N-Queens（N 皇后）✅

按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

**n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n` ，返回所有不同的 **n 皇后问题** 的解决方案。

每一种解法包含一个不同的 **n 皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。



**思路**：回溯。用列、主对角线、副对角线的集合判断是否可放置。

```python
def solveNQueens(n):
    res = []
    cols, diag1, diag2 = set(), set(), set()	# 已占用的列，主对角线（r - c），副对角线（r + c）
    board = [['.'] * n for _ in range(n)]
    def backtrack(row):
        if row == n:
            res.append([''.join(r) for r in board])
            return
        for col in range(n):	# 尝试每一列
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue			# 剪枝：冲突
            
            # 选择
            board[row][col] = 'Q'
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            
            backtrack(row + 1)	# 递归
            
            # 回溯
            board[row][col] = '.'	
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)
    backtrack(0)
    return res
```



### M79. Word Search（单词搜索）✅

给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word` 。如果 `word` 存在于网格中，返回 `true` ；否则，返回 `false`。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。



**思路**：DFS + 回溯。遍历每个格子，从该位置出发尝试匹配单词。

```python
def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(i, j, k):
        if k == len(word):
            return True
        if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
            return False
        board[i][j] = '#'
        for di, dj in ((1,0), (-1,0), (0,1), (0,-1)):
            if dfs(i + di, j + dj, k + 1):
                return True
        board[i][j] = word[k]
        return False
    for i in range(m):
        for j in range(n):
            if dfs(i, j, 0):
                return True
    return False
```



### M131. Palindrome Partitioning（分割回文串）✅

给你一个字符串 `s`，请你将 `s` 分割成一些 子串，使每个子串都是 **回文串** 。返回 `s` 所有可能的分割方案。



**思路**：回溯。在每步检查当前前缀是否为回文。

```python
def partition(s):
    res = []
    def backtrack(start, cur):
        if start == len(s):
            res.append(cur[:])		# 复制当前路径
            return
        for end in range(start + 1, len(s) + 1):
            if s[start:end] == s[start:end][::-1]:	# 只在是回文的地方切割
                cur.append(s[start:end])
                backtrack(end, cur)
                cur.pop()					# 撤销选择
    backtrack(0, [])
    return res
```



## 十一、二分查找（binary search, 6）

### T4. Median of Two Sorted Arrays（寻找两个正序数组的中位数）✅

给定两个大小分别为 `m` 和 `n` 的正序（从小到大）数组 `nums1` 和 `nums2`。请你找出并返回这两个正序数组的 **中位数** 。

算法的时间复杂度应该为 `O(log (m+n))` 。



**思路**：二分较短的数组，保证两个数组的前半部分元素个数相等。

```python
def findMedianSortedArrays(nums1, nums2):
    # 确保 nums1 是较短的数组
    # 这样可以保证二分查找的时间复杂度为 O(log(min(m, n)))
    # 同时也保证了 j = (m + n + 1) // 2 - i 的计算结果不会为负数
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
        
    m, n = len(nums1), len(nums2)
    
    # 在较短数组 nums1 的索引范围 [0, m] 内进行二分查找
    lo, hi = 0, m
    
    while lo <= hi:
        # i 为 nums1 的划分位置
        i = (lo + hi) // 2
        # j 为 nums2 的划分位置，保证左右两边的总元素个数平衡
        j = (m + n + 1) // 2 - i
        
        # 获取划分点两侧的元素值，并处理边界情况：
        # 如果划分点在数组最左侧（i==0 或 j==0），左侧值设为负无穷
        # 如果划分点在数组最右侧（i==m 或 j==n），右侧值设为正无穷
        left1 = nums1[i - 1] if i > 0 else -float('inf')
        right1 = nums1[i] if i < m else float('inf')
        
        left2 = nums2[j - 1] if j > 0 else -float('inf')
        right2 = nums2[j] if j < n else float('inf')
        
        # 验证当前划分是否符合中位数条件
        if left1 <= right2 and left2 <= right1:
            # 情况 A: 总元素个数为偶数
            # 中位数是左边最大值和右边最小值的平均数
            if (m + n) % 2 == 0:
                return (max(left1, left2) + min(right1, right2)) / 2
            # 情况 B: 总元素个数为奇数
            # 中位数是左半部分的最大值
            else:
                return max(left1, left2)
                
        # 如果 nums1 左边的元素大于 nums2 右边的元素，说明 i 偏大，需要向左移动
        elif left1 > right2:
            hi = i - 1
        # 如果 nums2 左边的元素大于 nums1 右边的元素，说明 i 偏小，需要向右移动
        else:
            lo = i + 1
```

> 通过**二分查找（Binary Search）**在 $O(\log(\min(m, n)))$ 的时间复杂度内找到两个渐增排序数组的中位数。
>
> **1. 算法思路解读**
>
> 中位数的本质是将一个集合划分为两个等长的子集，且左半部分的所有元素都小于或等于右半部分的所有元素。
>
> 对于两个已排序数组 `nums1` 和 `nums2`，我们的目标是找到两个划分点 `i` 和 `j`，将它们分别切成两部分：
> * `nums1` 分为：`nums1[0 ... i-1]` | `nums1[i ... m-1]`
> * `nums2` 分为：`nums2[0 ... j-1]` | `nums2[j ... n-1]`
>
> 为了使划分满足中位数的定义，我们需要满足两个条件：
> 1. **左右两边元素个数相等（或左边比右边多一个）**： 
>    $i + j = (m + n + 1) // 2$ 
>    这意味着只要确定了 `i`，`j` 的位置也就随之确定了。
> 2. **左半部分的最大值小于等于右半部分的最小值**：
>    $nums1[i-1] \le nums2[j]$ 且 $nums2[j-1] \le nums1[i]$。
>
> 由于两数组已排序，我们只需在较短的数组（假设为 `nums1`）上对 `i` 进行二分查找。如果发现不满足条件，则调整二分查找的边界：
> * 如果 $nums1[i-1] > nums2[j]$：说明 `nums1` 左边分过去的元素太大了，`i` 需要向左移动（减小）。
> * 如果 $nums2[j-1] > nums1[i]$：说明 `nums1` 左边分过去的元素太小了，`i` 需要向右移动（增大）。
>
> **3. 复杂度分析**
>
> * **时间复杂度**：$O(\log(\min(m, n)))$。我们只在较短的数组上进行二分查找，查找范围的大小为 $m$（其中 $m \le n$），因此折半查找的次数为 $\log(m)$。
> * **空间复杂度**：$O(1)$。算法只使用了常数个指针和变量，没有使用额外的存储空间。



### M33. Search in Rotated Sorted Array（搜索旋转排序数组）✅

整数数组 `nums` 按升序排列，数组中的值 **互不相同** 。

在传递给函数之前，`nums` 在预先未知的某个下标 `k`（`0 <= k < nums.length`）上进行了 **向左旋转**，使数组变为 `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`（下标 **从 0 开始** 计数）。例如， `[0,1,2,4,5,6,7]` 下标 `3` 上向左旋转后可能变为 `[4,5,6,7,0,1,2]` 。

给你 **旋转后** 的数组 `nums` 和一个整数 `target` ，如果 `nums` 中存在这个目标值 `target` ，则返回它的下标，否则返回 `-1` 。

你必须设计一个时间复杂度为 `O(log n)` 的算法解决此问题。



**思路**：二分。判断 mid 落在哪一段有序区间，再决定搜索范围。

```python
def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target: return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1
```

> 算法的严谨性在于：
>
> 1. **分类讨论不重不漏**：利用 nums[l] <= nums[mid] 将空间划分为两种对立的情况。
> 2. **条件判定充分必要**：在有序的一侧，利用单调性通过双侧边界直接确认 target 的存在性；若不满足，则通过排他性进入另一侧。
> 3. **收缩行为必定收敛**：由于跳过了已验证的 mid 点，区间长度在每一步都严格减小，直至 l > r 循环自然终止。



### M34. Find First and Last Position of Element in Sorted Array（在排序数组中查找元素的第一个和最后一个位置）✅

给你一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

你必须设计并实现时间复杂度为 `O(log n)` 的算法解决此问题。



**思路**：二分查找左边界和右边界。

```python
def searchRange(nums, target):
    def bisect(lo, hi, left_bound):
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] > target or (left_bound and nums[mid] == target):
                hi = mid - 1
            else:
                lo = mid + 1
        return lo
    n = len(nums)
    l = bisect(0, n - 1, True)
    if l == n or nums[l] != target: return [-1, -1]
    r = bisect(0, n - 1, False) - 1
    return [l, r]
def searchRange(nums, target):
    # 定义一个辅助的二分查找函数
    # lo: 查找区间左起点，hi: 查找区间右终点
    # left_bound: 布尔值，若为 True 则寻找左边界；若为 False 则寻找右边界的右邻居
    def bisect(lo, hi, left_bound):
        while lo <= hi:
            mid = (lo + hi) // 2
            # 情况1：当前值大于 target 
            # 情况2：当前值等于 target，且我们正在寻找左边界 (left_bound 为 True)
            # 在这两种情况下，我们需要往左半部分继续寻找，因此收缩右指针 hi
            if nums[mid] > target or (left_bound and nums[mid] == target):
                hi = mid - 1
            # 否则（当前值小于 target，或者当前值等于 target 但我们在寻找右边界）
            # 我们需要往右半部分继续寻找，因此增大左指针 lo
            else:
                lo = mid + 1
        # 循环结束时，lo 指针指向符合条件的目标索引
        return lo

    n = len(nums)
    
    # 1. 寻找左边界 (第一个等于 target 的位置)
    l = bisect(0, n - 1, True)
    
    # 如果左边界索引越界（l == n），或者找到的位置对应的值不是 target，
    # 说明数组中不存在目标值，直接返回 [-1, -1]
    if l == n or nums[l] != target: 
        return [-1, -1]
    
    # 2. 寻找右边界
    # bisect(0, n - 1, False) 返回的是第一个大于 target 的元素索引
    # 该索引减去 1，即为 target 最后一次出现的位置
    r = bisect(0, n - 1, False) - 1
    
    return [l, r]
```

> 这道题的核心要求是在一个排好序的数组中，以 $O(\log n)$ 的时间复杂度找到目标值 `target` 的起始和结束位置。这表明我们需要使用**二分查找（Binary Search）**。
>
> **核心思路解读**
>
> 这段代码通过一个巧妙的辅助函数 `bisect` 实现了两种查找逻辑：
> 1. **寻找左边界（起始位置）**：
>    当 `left_bound=True` 时，如果遇到 `nums[mid] == target`，不停止查找，而是继续向左收缩区间（即令 `hi = mid - 1`）。这样，循环结束后返回的 `lo` 就是 `target` 第一次出现的位置。
> 2. **寻找右边界的下一个位置**：
>    当 `left_bound=False` 时，如果遇到 `nums[mid] == target`，向右收缩区间（即令 `lo = mid + 1`）。循环结束后返回的 `lo` 是**第一个大于 `target` 的元素的位置**。因此，`lo - 1` 就是 `target` 最后一次出现的位置。
>
> **复杂度分析**
>
> * **时间复杂度**：$O(\log n)$。我们调用了两次二分查找，每次查找的时间复杂度均为 $O(\log n)$，因此总体时间复杂度依然是 $O(\log n)$，符合题目要求。
> * **空间复杂度**：$O(1)$。算法只使用了常数个指针变量（`lo`, `hi`, `mid`, `l`, `r`），未消耗额外的内存空间。



### E35. Search Insert Position（搜索插入位置）✅

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 `O(log n)` 的算法。



**思路**：标准二分查找。

```python
def searchInsert(nums, target):
    l, r = 0, len(nums)
    while l < r:
        mid = (l + r) // 2
        if nums[mid] >= target:
            r = mid
        else:
            l = mid + 1
    return l
```



### M74. Search a 2D Matrix（搜索二维矩阵）✅

给你一个满足下述两条属性的 `m x n` 整数矩阵：

- 每行中的整数从左到右按非严格递增顺序排列。
- 每行的第一个整数大于前一行的最后一个整数。

给你一个整数 `target` ，如果 `target` 在矩阵中，返回 `true` ；否则，返回 `false` 。



**思路**：将二维矩阵拉直成一维数组进行二分。

```python
def searchMatrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    l, r = 0, m * n - 1
    while l <= r:
        mid = (l + r) // 2
        val = matrix[mid // n][mid % n]
        if val == target: return True
        if val < target: l = mid + 1
        else: r = mid - 1
    return False
```



### M153. Find Minimum in Rotated Sorted Array（寻找旋转排序数组中的最小值）✅

已知一个长度为 `n` 的数组，预先按照升序排列，经由 `1` 到 `n` 次 **旋转** 后，得到输入数组。例如，原数组 `nums = [0,1,2,4,5,6,7]` 在变化后可能得到：

- 若旋转 `4` 次，则可以得到 `[4,5,6,7,0,1,2]`
- 若旋转 `7` 次，则可以得到 `[0,1,2,4,5,6,7]`

注意，数组 `[a[0], a[1], a[2], ..., a[n-1]]` **旋转一次** 的结果为数组 `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]` 。

给你一个元素值 **互不相同** 的数组 `nums` ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 **最小元素** 。

你必须设计一个时间复杂度为 `O(log n)` 的算法解决此问题。



**思路**：二分。如果 `nums[mid] > nums[r]`，最小值在右边；否则在左边（含 mid）。

```python
def findMin(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[r]:	# 如果中间值大于右边界值，说明最小值在右边
            l = mid + 1
        else:
            r = mid	# 否则最小元素在左边
    return nums[l]	# 最后left和right会指向最小元素
```



## 十二、栈（stack, 5）

### E20. Valid Parentheses（有效的括号）✅

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。



**思路**：用栈匹配。遇到左括号入栈，遇到右括号检查栈顶是否匹配。

```python
def isValid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
        else:
            stack.append(ch)
    return not stack
```



### T32. Longest Valid Parentheses（最长有效括号）✅

**思路**：用栈存储下标。初始化栈为 `[-1]`。遇到 '(' 入栈，遇到 ')' 出栈，若栈空则压入当前下标。

```python
def longestValidParentheses(s):
    stack, ans = [-1], 0
    for i, ch in enumerate(s):
        if ch == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                ans = max(ans, i - stack[-1])
    return ans
```



### T84. Largest Rectangle in Histogram（柱状图中最大的矩形）✅

给定 *n* 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。



**思路**：单调递增栈。遇到更矮的柱子时，弹出栈顶并计算以该高度为高的矩形面积。

```python
def largestRectangleArea(heights):
    stack, ans = [], 0
    heights = [0] + heights + [0]
    for i in range(len(heights)):
        while stack and heights[stack[-1]] > heights[i]:
            h = heights[stack.pop()]
            w = i - stack[-1] - 1
            ans = max(ans, h * w)
        stack.append(i)
    return ans
```

> 这道题是经典的单调栈应用问题。下面为您详细解读这段代码的设计思路、核心机制以及其精妙之处。
>
> ---
>
> **一、 核心思路：单调递增栈**
>
> 寻找直方图中的最大矩形，核心思想是：**确定以每一个柱子的高度为高（$h$）时，能向左右两边延伸的最大宽度（$w$）是多少**。
>
> 要找到某个柱子 $i$ 能向左右延伸的边界：
> *   **左边界**：左边第一个比它矮的柱子。
> *   **右边界**：右边第一个比它矮的柱子。
>
> **单调递增栈**（栈内元素对应的柱子高度单调递增）恰好可以高效地寻找这两侧的边界。
>
> ---
>
> **二、 关键设计：哨兵节点（Sentinel）**
>
> 代码中有一行非常关键的处理：
> ```python
> heights = [0] + heights + [0]
> ```
> 这里在原数组的首尾各添加了一个高度为 `0` 的柱子，作用如下：
>
> 1.  **首部加 `0`**：
>     *   防止栈空。在计算宽度 `w = i - stack[-1] - 1` 时，如果栈中没有元素，计算会变得复杂。
>     *   首部的 `0` 作为一个占位符（索引为 `0`），保证了即使前面的柱子全部被弹出，栈内也至少会剩下一个索引 `0`，从而避免了判断栈是否为空的边界处理。
> 2.  **尾部加 `0`**：
>     *   当遍历到最后一个高度为 `0` 的柱子时，它比栈中除了首部 `0` 以外的所有柱子都要矮。
>     *   这会强制触发 `while` 循环，将栈中所有还未处理的柱子依次弹出并计算面积，确保没有遗漏。
>
> ---
>
> **三、 代码逐行解析**
>
> 结合以下代码块，来看具体的执行流程：
>
> ```python
> def largestRectangleArea(heights):
>     stack, ans = [], 0
>     # 1. 加上哨兵，简化边界条件
>     heights = [0] + heights + [0]
>     
>     for i in range(len(heights)):
>         # 2. 如果当前高度小于栈顶高度，说明找到了栈顶元素的右边界
>         while stack and heights[stack[-1]] > heights[i]:
>             # 弹出栈顶，作为当前要计算矩形的高度 h
>             h = heights[stack.pop()]
>             
>             # 此时新的栈顶就是该高度 h 的左边界（不含）
>             # 当前的 i 就是该高度 h 的右边界（不含）
>             # 宽度 w = 右边界 - 左边界 - 1
>             w = i - stack[-1] - 1
>             
>             # 更新最大面积
>             ans = max(ans, h * w)
>             
>         # 3. 将当前索引压入栈中
>         stack.append(i)
>         
>     return ans
> ```
>
> **为什么宽度是 `w = i - stack[-1] - 1`？**
>
> 当一个索引被弹出作为高度 `h` 时：
> *   它的**右边界**是当前遍历到的索引 `i`（因为 `heights[i]` 比它矮，阻断了向右延伸）。
> *   它的**左边界**是它在栈中的前一个元素 `stack[-1]`（因为栈是单调递增的，前一个元素必然是左侧第一个比它矮的柱子）。
> *   因此，能延伸的有效区间是开区间 `(stack[-1], i)`，其宽度为 `i - stack[-1] - 1`。
>
> ---
>
> **四、 实例走读**
>
> 假设输入为 `heights = [2, 1, 5]`：
> 1.  加入哨兵后：`heights = [0, 2, 1, 5, 0]`
> 2.  **`i = 0` (h=0)**: 栈为空，`0` 入栈。`stack = [0]`
> 3.  **`i = 1` (h=2)**: `2 > heights[stack[-1]] (0)`，不进入循环，`1` 入栈。`stack = [0, 1]`
> 4.  **`i = 2` (h=1)**: `1 < heights[stack[-1]] (2)`，进入循环：
>     *   弹出 `1`，高度 `h = heights[1] = 2`
>     *   此时栈顶 `stack[-1]` 为 `0`
>     *   宽度 `w = 2 - 0 - 1 = 1`
>     *   面积 `ans = max(0, 2 * 1) = 2`
>     *   再次判断，`1 > heights[0] (0)`，退出循环。`2` 入栈。`stack = [0, 2]`
> 5.  **`i = 3` (h=5)**: `5 > heights[stack[-1]] (1)`，不进入循环，`3` 入栈。`stack = [0, 2, 3]`
> 6.  **`i = 4` (h=0)**: 末尾哨兵触发清理：
>     *   **第一轮循环**：弹出 `3`，`h = 5`，此时栈顶为 `2`。`w = 4 - 2 - 1 = 1`，`ans = max(2, 5 * 1) = 5`。
>     *   **第二轮循环**：弹出 `2`，`h = 1`，此时栈顶为 `0`。`w = 4 - 0 - 1 = 3`，`ans = max(5, 1 * 3) = 5`。
>     *   退出循环，`4` 入栈。
> 7.  遍历结束，返回 `ans = 5`。
>
> ---
>
> ### 五、 复杂度分析
>
> *   **时间复杂度**：$O(N)$。虽然代码中含有双重循环（`for` 和 `while`），但每个位置的索引最多只会入栈一次、出栈一次。因此，平均每个元素的操作次数是常数级别。
> *   **空间复杂度**：$O(N)$。最坏情况下（柱子高度单调递增），栈内会存储所有的元素。



### M155. Min Stack（最小栈）✅

设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类:

- `MinStack()` 初始化堆栈对象。
- `void push(int val)` 将元素val推入堆栈。
- `void pop()` 删除堆栈顶部的元素。
- `int top()` 获取堆栈顶部的元素。
- `int getMin()` 获取堆栈中的最小元素。



**思路**：辅助栈存最小值。

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = [float('inf')]

    def push(self, val):
        self.stack.append(val)
        self.min_stack.append(min(val, self.min_stack[-1]))

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]
```



### M394. Decode String（字符串解码）✅

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: `k[encoded_string]`，表示其中方括号内部的 `encoded_string` 正好重复 `k` 次。注意 `k` 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 `k` ，例如不会出现像 `3a` 或 `2[4]` 的输入。

测试用例保证输出的长度不会超过 `10^5`。



**思路**：用栈存储数字和当前字符串。遇到 '[' 入栈，遇到 ']' 出栈并重复拼接。

```python
def decodeString(s):
    stack = []
    cur_str = ''
    cur_num = 0
    for ch in s:
        if ch.isdigit():
            cur_num = cur_num * 10 + int(ch)
        elif ch == '[':
            stack.append((cur_str, cur_num))
            cur_str, cur_num = '', 0
        elif ch == ']':
            prev_str, num = stack.pop()
            cur_str = prev_str + cur_str * num
        else:
            cur_str += ch
    return cur_str
```



### M739. Daily Temperatures（每日温度）✅

给定一个整数数组 `temperatures` ，表示每天的温度，返回一个数组 `answer` ，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。



**思路**：单调递减栈（存下标）。遇到更高的温度则出栈并计算结果。

```python
def dailyTemperatures(temperatures):
    n = len(temperatures)
    ans = [0] * n
    stack = []
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            idx = stack.pop()
            ans[idx] = i - idx
        stack.append(i)
    return ans
```





## 十三、堆（heap, 3）

### M215. Kth Largest Element in an Array（数组中的第 K 个最大元素）✅

给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。

你必须设计并实现时间复杂度为 `O(n)` 的算法解决此问题。



**思路**：快速选择（Quick Select）或最小堆。

```python
def findKthLargest(nums, k):
    import heapq
    heap = nums[:k]
    heapq.heapify(heap)
    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)
    return heap[0]
```



### T295. Find Median from Data Stream（数据流的中位数）✅

**中位数**是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。



**思路**：一个大根堆存较小一半，一个小根堆存较大一半。保持两堆平衡。

```python
import heapq

class MedianFinder:
    def __init__(self):
        # small 是一个大根堆，用于存储较小的一半元素。
        # 在 Python 中通过存储负数来模拟大根堆。
        self.small = []   
        
        # large 是一个小根堆，用于存储较大的一半元素。
        self.large = []   

    def addNum(self, num: int) -> None:
        # 步骤 1：先将新元素放入大根堆 small 中。
        # 因为 Python 的 heapq 是小根堆，所以放入相反数 -num。
        heapq.heappush(self.small, -num)
        
        # 步骤 2：为了保证 small 中的元素始终小于或等于 large 中的元素，
        # 我们将 small 中的最大值（即堆顶）弹出，并放入小根堆 large 中。
        # 注意：从 small 弹出的值是负数，取反后变为正数放入 large。
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # 步骤 3：平衡两个堆的大小。
        # 我们的目标是让 small 的元素个数大于或等于 large 的元素个数，
        # 且两者数量差不超过 1（即 len(small) >= len(large)）。
        # 如果 large 的元素比 small 多了，就从 large 中弹出一个最小值放入 small 中。
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        # 如果 small 的元素个数多于 large，说明总元素个数为奇数。
        # 此时中位数就是 small 的堆顶元素（取反恢复为正数）。
        if len(self.small) > len(self.large):
            return -self.small[0]
        
        # 如果两个堆的元素个数相等，说明总元素个数为偶数。
        # 此时中位数是 small 的堆顶（最大值）与 large 的堆顶（最小值）的平均值。
        return (-self.small[0] + self.large[0]) / 2
```



### M347. Top K Frequent Elements（前 K 个高频元素）✅

给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。



**思路**：先用哈希表统计频率，再用最小堆维护前 k 高频。

```python
def topKFrequent(nums, k):
    from collections import Counter
    import heapq
    freq = Counter(nums)
    heap = []
    for num, f in freq.items():
        heapq.heappush(heap, (f, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for _, num in heap]
```



## 十三、贪心算法（greedy, 4）

### M45. Jump Game II（跳跃游戏 II）✅

给定一个长度为 `n` 的 **0 索引**整数数组 `nums`。初始位置在下标 0。

每个元素 `nums[i]` 表示从索引 `i` 向后跳转的最大长度。换句话说，如果你在索引 `i` 处，你可以跳转到任意 `(i + j)` 处：

- `0 <= j <= nums[i]` 且
- `i + j < n`

返回到达 `n - 1` 的最小跳跃次数。测试用例保证可以到达 `n - 1`。



**思路**：维护当前能跳到的最远位置和边界，每次到达边界步数 +1。

```python
def jump(nums):
    n = len(nums)
    if n == 1: return 0  # 如果数组长度为 1，无需跳跃，直接返回 0
    
    steps = cur_end = cur_far = 0
    
    # 注意：循环范围是 n - 1，因为不需要遍历最后一个元素。
    # 当我们到达 n - 2 时，根据题目保证可达，此时计算出的下一次边界必然能够覆盖 n - 1。
    for i in range(n - 1):
        # 1. 维护在当前步骤范围内，能起跳到的最远位置
        cur_far = max(cur_far, i + nums[i])
        
        # 2. 当遍历到当前这一步的边界时
        if i == cur_end:
            steps += 1         # 必须再跳一次才能继续往前
            cur_end = cur_far  # 更新下一次跳跃的边界
            
            # 提前结束优化：如果当前能到达的最远位置已经覆盖了最后一个元素，可直接结束
            if cur_end >= n - 1: 
                break
                
    return steps
```



### M55. Jump Game（跳跃游戏）✅

给你一个非负整数数组 `nums` ，你最初位于数组的 **第一个下标** 。数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标，如果可以，返回 `true` ；否则，返回 `false` 。



**思路**：维护能到达的最远位置。若当前 i 超过了最远位置则失败。

```python
def canJump(nums):
    farthest = 0
    for i in range(len(nums)):
        if i > farthest: return False
        farthest = max(farthest, i + nums[i])
    return True
```

### E121. Best Time to Buy and Sell Stock（买卖股票的最佳时机）✅

给定一个数组 `prices` ，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格。

你只能选择 **某一天** 买入这只股票，并选择在 **未来的某一个不同的日子** 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0` 。



**思路**：遍历，记录历史最低价，每天计算利润。

```python
def maxProfit(prices):
    min_price = float('inf')
    ans = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > ans:
            ans = p - min_price
    return ans
```

### M763. Partition Labels（划分字母区间）✅

给你一个字符串 `s` 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 `"ababcc"` 能够被分为 `["abab", "cc"]`，但类似 `["aba", "bcc"]` 或 `["ab", "ab", "cc"]` 的划分是非法的。

注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 `s` 。

返回一个表示每个字符串片段的长度的列表。



**思路**：先记录每个字母最后出现的位置。然后遍历，维护当前段右边界，到达边界时切分。

```python
def partitionLabels(s):
    last = {c: i for i, c in enumerate(s)}
    ans = []
    start = end = 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            ans.append(end - start + 1)
            start = i + 1
    return ans
```



## 十四、动态规划（dp, 10）

### E70. Climbing Stairs（爬楼梯）✅

假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。

每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？



**思路**：`dp[i] = dp[i-1] + dp[i-2]`，即斐波那契数列。

```python
def climbStairs(self, n: int) -> int:
    if n == 1:
        return 1

    dp = [0]*(n+1)
    dp[1], dp[2]= 1, 2
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]
```

> 每次只需要“前两个数”，其实不需要开辟一个完整的数组 dp，只需要用**两个变量**把最近的两个结果存起来，像窗口一样往后滑动即可。用 `a` 代替 `dp[i-2]`，用 `b` 代替 `dp[i-1]`。
>
> ```python
> def climbStairs(self, n: int) -> int:
>     if n == 1:
>         return 1
> 
>     # a 相当于 dp[1]，b 相当于 dp[2]
>     a = 1
>     b = 2
> 
>     # 从 3 开始往后算
>     for i in range(3, n + 1):
>         c = a + b  # c 相当于当前的 dp[i]
>         a = b  # 把 b 的值给 a，相当于把窗口向右移动一步
>         b = c  # 把 c 的值给 b，继续向右移动一步
> 
>     return b
> ```
>
> 在 Python 中，可以利用“元组赋值”的特性，省去中间变量 `c`：
>
> ```python
> a, b = b, a + b
> ```
>
> 这一行代码相当于同时完成了以下两步：
>
> 1.  计算新的值 `a + b`（即上一步里的 `c`）。
> 2.  把旧的 `b` 赋给 `a`，把新算出来的 `a + b` 赋给 `b`。
>



初始化和循环边界的微调，演变出简化版代码

```python
def climbStairs(n):
    a = b = 1 # # 相当于从 dp[0]=1, dp[1]=1 开始
    for _ in range(n - 1):
        a, b = b, a + b
    return b
```





### E118. Pascal's Triangle（杨辉三角）✅

给定一个非负整数 *`numRows`，*生成「杨辉三角」的前 *`numRows`* 行。

在**「杨辉三角」**中，每个数是它左上方和右上方的数的和。



**思路**：每行首尾为 1，中间为上一行相邻两数之和。

```python
def generate(numRows):
    res = [[1]]
    for _ in range(1, numRows):
        prev = res[-1]
        cur = [1] + [prev[i] + prev[i + 1] for i in range(len(prev) - 1)] + [1]
        res.append(cur)
    return res
```



### M139. Word Break（单词拆分）✅

给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 `s` 则返回 `true`。

**注意：**不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。



**思路**：`dp[i]` 表示 s[:i] 是否能被拆分。枚举拆分点 j，若 `dp[j]` 且 `s[j:i] in wordDict` 则 `dp[i] = True`。

```python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    # 将列表转换为集合（Set），将查找操作的时间复杂度从 O(k) 降低到 O(1)
    words = set(wordDict)
    
    # dp[i] 表示 s 的前 i 个字符 s[:i] 是否能被拆分
    # 初始化 dp 数组，dp[0] 为 True（空字符串），其余初始化为 False
    dp = [True] + [False] * len(s)
    
    # 遍历子串的结束位置 i（从 1 到 len(s)）
    for i in range(1, len(s) + 1):
        # 遍历分割点 j（从 0 到 i-1）
        for j in range(i):
            # 如果 s[:j] 可以被拆分（dp[j] 为 True）
            # 并且剩余部分 s[j:i] 是一个在字典中的单词
            if dp[j] and s[j:i] in words:
                dp[i] = True
                # 只要找到一种可行的分割方式，即可确定 dp[i] = True，无需继续尝试其他分割点
                break
                
    # 返回整个字符串 s 是否可以被拆分
    return dp[-1]
```



### M152. Maximum Product Subarray（乘积最大子数组）✅

给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 **32-位** 整数。

**请注意**，一个只包含一个元素的数组的乘积是这个元素的值。



**思路**：同时维护最大值和最小值（因为负负得正）。

```python
def maxProduct(nums):
    cur_max = cur_min = ans = nums[0]
    for num in nums[1:]:
        candidates = (num, cur_max * num, cur_min * num)
        cur_max, cur_min = max(candidates), min(candidates)
        ans = max(ans, cur_max)
    return ans
```



### M198. House Robber（打家劫舍）✅

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警**。

给定一个代表每个房屋存放金额的非负整数数组，计算你 **不触动警报装置的情况下** ，一夜之内能够偷窃到的最高金额。



**思路**：`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`。

```python
def rob(nums):
    prev = cur = 0
    for num in nums:
        prev, cur = cur, max(cur, prev + num)
    return cur
```



### M279. Perfect Squares（完全平方数）✅

给你一个整数 `n` ，返回 *和为 `n` 的完全平方数的最少数量* 。

**完全平方数** 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，`1`、`4`、`9` 和 `16` 都是完全平方数，而 `3` 和 `11` 不是。

 

**思路**：`dp[i] = min(dp[i], dp[i - j*j] + 1)`。

```python
def numSquares(n):
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    for i in range(1, n + 1):
        j = 1
        while j * j <= i:
            dp[i] = min(dp[i], dp[i - j * j] + 1)
            j += 1
    return dp[n]
```



```python
class Solution:
    def numSquares(self, n: int) -> int:
        coins = [i * i for i in range(1, 101)]
        dp = [0] + [float('inf')] * n
        for i in range(1, n + 1):
            dp[i] = min(dp[i - c] for c in coins if c <= i) + 1

        return dp[n]

if __name__ == '__main__':
    sol = Solution()
    print(sol.numSquares(12))
```



### M300. Longest Increasing Subsequence（最长递增子序列）✅

给你一个整数数组 `nums` ，找到其中最长严格递增子序列的长度。

**子序列** 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，`[3,6,2,7]` 是数组 `[0,3,1,6,2,2,7]` 的子序列。



**思路**：`dp[i] = max(dp[i], dp[j] + 1)` 对于 `nums[j] < nums[i]`。

```python
def lengthOfLIS(nums):
    n = len(nums)
    dp = [1] * n

    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)
```



优化：贪心 + 二分。tails[k] 表示：“长度为 `k+1` 的递增子序列中，结尾最小是多少”。注意：`tails` 本身不一定是真实 LIS，但它能正确维护 LIS 长度。

> **为什么“结尾越小越好”？**例如：长度为 3 的递增序列：[2,5,100] 和 [2,3,4]。显然第二个更优秀。因为：4 后面更容易接新的数。
>
> 所以：对于相同长度的递增序列，只保留“结尾最小”的那个。这就是贪心。

```python
def lengthOfLIS(nums):
    tails = []
    for num in nums:
        l, r = 0, len(tails)
        while l < r:
            mid = (l + r) // 2
            if tails[mid] < num:
                l = mid + 1
            else:
                r = mid
        if l == len(tails):
            tails.append(num)
        else:
            tails[l] = num
    return len(tails)
```



### M322. Coin Change（零钱兑换）✅

给你一个整数数组 `coins` ，表示不同面额的硬币；以及一个整数 `amount` ，表示总金额。

计算并返回可以凑成总金额所需的 **最少的硬币个数** 。如果没有任何一种硬币组合能组成总金额，返回 `-1` 。

你可以认为每种硬币的数量是无限的。



**思路**：`dp[i] = min(dp[i], dp[i - coin] + 1)`。

```python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```



### M416. Partition Equal Subset Sum（分割等和子集）✅

给你一个 **只包含正整数** 的 **非空** 数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。



**思路**：0-1 背包问题。`dp[i]` 表示是否能够凑出和为 i 的子集。

```python
def canPartition(nums):
    total = sum(nums)
    
    # 如果数组总和是奇数，无法平分成两个整数和，直接返回 False
    if total % 2: 
        return False
    
    # 目标和为总和的一半
    target = total // 2
    
    # dp[i] 表示是否能够凑出和为 i 的子集
    # 初始化大小为 target + 1 的数组，默认都为 False
    dp = [False] * (target + 1)
    
    # 基础情况：凑出和为 0 是可以实现的（即不选择任何元素）
    dp[0] = True
    
    # 遍历每一个数字
    for num in nums:
        # 逆序遍历背包容量，从 target 到 num 结束
        # 逆序的原因：为了防止同一个数字被重复使用。
        # 如果正序遍历，dp[i] 依赖的 dp[i-num] 可能是当前轮次刚刚更新过的值（即同一个 num 被计算了多次）。
        for i in range(target, num - 1, -1):
            # 状态转移方程：
            # 不选择当前的 num：维持原状态 dp[i]
            # 选择当前的 num：取决于之前能否凑出 i - num，即 dp[i - num]
            dp[i] = dp[i] or dp[i - num]
            
    # 返回是否能凑出目标和 target
    return dp[target]
```

> **分割等和子集**问题可以转化为标准的 **0-1 背包问题**。
>
> 1. **等和切分的要求**：要将数组分割成两个和相等的子集，意味着每个子集的和必须等于整个数组总和的一半（记为 `target`）。
>    * 如果数组的总和 `total` 是奇数，显然无法平分为两个整数和，直接返回 `False`。
>    * 如果 `total` 是偶数，我们的目标就是从数组中挑选出若干个数字，使其累加和恰好等于 `target = total // 2`。
> 2. **0-1 背包的对应关系**：
>    * 背包的容量：`target`。
>    * 物品：数组中的每个数字 `num`，每个数字只能使用一次（即 0-1 背包）。
>    * 状态定义：`dp[i]` 表示是否可以挑选出若干个数字，使其和恰好为 `i`（布尔值）。
>
> **关键点解析**
>
> 1. **为什么从后往前遍历 `i`？**
>    在 0-1 背包问题中，如果使用一维数组进行空间优化，必须采用**逆序**遍历。
>    例如，假设 `num = 3`：
>    * 如果正序更新 `dp[3] = dp[3] or dp[0]`（变为 `True`），接着更新 `dp[6] = dp[6] or dp[3]`。此时 `dp[6]` 会因为刚刚被更新为 `True`的 `dp[3]` 而变成 `True`。这相当于数字 `3` 被使用了两次（$3 + 3 = 6$）。
>    * 如果逆序更新，在计算 `dp[6]` 时，使用的是上一轮尚未被 `num = 3` 污染的 `dp[3]` 值，从而保证每个数字只被使用一次。
>
> 2. **边界条件优化 `num - 1`**：
>    第二层循环的下界是 `num - 1`（即循环到 `num` 停止）。因为当背包容量 `i < num` 时，当前数字 `num` 太大，无法放入容量为 `i` 的背包中，因此 `dp[i]` 的状态不会发生改变，无需更新。
>
> **复杂度分析**
>
> * **时间复杂度**：$O(n \times \text{target})$，其中 $n$ 是数组 `nums` 的长度，$\text{target}$ 是整个数组元素和的一半。外层循环执行 $n$ 次，内层循环执行 $\text{target}$ 次。
> * **空间复杂度**：$O(\text{target})$，只需要一个大小为 $\text{target} + 1$ 的一维数组来存储中间状态。



## 十五、多维动态规划（dp, 5）

### M5. Longest Palindromic Substring（最长回文子串）✅

给你一个字符串 `s`，找到 `s` 中最长的 回文 子串。



**思路**：中心扩展。每个位置（及两位置之间）向两边扩展，找最长回文。

```python
def longestPalindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        return s[l + 1:r]
    res = ''
    for i in range(len(s)):
        s1 = expand(i, i)			# 情况1：奇数长度回文中心（以 s[i] 为中心）
        s2 = expand(i, i + 1)	# 情况2：偶数长度回文中心（以 s[i] 和 s[i+1] 之间的空隙为中心）
        res = max(res, s1, s2, key=len)
    return res
```

> [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)
>
> 给你一个字符串 `s`，找到 `s` 中最长的 回文 子串。
>
>  
>
> **示例 1：**
>
> ```
> 输入：s = "babad"
> 输出："bab"
> 解释："aba" 同样是符合题意的答案。
> ```
>
> **示例 2：**
>
> ```
> 输入：s = "cbbd"
> 输出："bb"
> ```
>
>  
>
> **提示：**
>
> - `1 <= s.length <= 1000`
> - `s` 仅由数字和英文字母组成
>
> 
>
> 
>
> 针对“最长回文子串”这一经典问题，以下提供三种常见的解决方法：**动态规划**、**中心扩展算法**以及**Manacher（马拉车）算法**。
>
> ---
>
> ### 方法一：动态规划 (Dynamic Programming)
>
> **1. 思路**
>
> 动态规划的核心思想是将一个大问题分解为若干个相互联系的子问题。
> 对于一个子串 $s[i..j]$（表示从索引 $i$ 到 $j$ 的子串），它是否是回文串取决于：
>
> 1. 其两端字符是否相等，即 $s[i] == s[j]$。
> 2. 内部的子串 $s[i+1..j-1]$ 是否是回文串。
>
> 定义 `dp[i][j]` 表示子串 $s[i..j]$ 是否为回文串。
> 状态转移方程如下：
>
> - 当 $s[i] \neq s[j]$ 时，`dp[i][j] = False`。
> - 当 $s[i] == s[j]$ 时：
>   - 如果子串长度小于 3（即 $j - i < 3$，例如 "aba" 除去两端剩下 "b"，或者 "aa" 除去两端剩下空串），则一定是回文串：`dp[i][j] = True`。
>   - 否则，取决于内部子串：`dp[i][j] = dp[i + 1][j - 1]`。
>
> **2. 代码实现**
>
> ```python
> class Solution:
>     def longestPalindrome(self, s: str) -> str:
>         n = len(s)
>         if n < 2:
>             return s
>         
>         max_len = 1
>         begin = 0
>         # dp[i][j] 表示 s[i..j] 是否是回文
>         dp = [[False] * n for _ in range(n)]
>         
>         # 长度为 1 的子串都是回文
>         for i in range(n):
>             dp[i][i] = True
>         
>         # 递推，L 为当前枚举的子串长度
>         for L in range(2, n + 1):
>             for i in range(n):
>                 # 由 L 和左边界 i 可以确定右边界 j
>                 j = L + i - 1
>                 if j >= n:
>                     break
>                 
>                 if s[i] != s[j]:
>                     dp[i][j] = False
>                 else:
>                     if j - i < 3:
>                         dp[i][j] = True
>                     else:
>                         dp[i][j] = dp[i + 1][j - 1]
>                 
>                 # 记录最长回文子串的起始位置和长度
>                 if dp[i][j] and L > max_len:
>                     max_len = L
>                     begin = i
>                     
>         return s[begin : begin + max_len]
> ```
>
> **3. 复杂度分析**
>
> - **时间复杂度**：$O(N^2)$，其中 $N$ 是字符串的长度。需要枚举所有可能的区间起点和终点。
> - **空间复杂度**：$O(N^2)$，需要维护一个二维的 DP 状态表格。
>
> ---
>
> ### 方法二：中心扩展算法 (Center Expansion)
>
> **1. 思路**
>
> 动态规划的空间复杂度较高。由于回文串是对称的，我们可以枚举所有可能的“对称中心”，并尝试向两边进行扩展。
> 由于回文串的长度可能是奇数或偶数：
>
> - 奇数长度的回文串对称中心是一个字符，如 "aba" 的中心是 "b"。
> - 偶数长度的回文串对称中心是两个字符之间的间隙，如 "abba" 的中心是两个 "b" 之间。
>
> 因此，对于一个长度为 $N$ 的字符串，共有 $2N - 1$ 个可能的对称中心。我们依次以这些中心向外扩展，记录最长的回文子串。
>
> **2. 代码实现**
>
> ```python
> class Solution:
>     def longestPalindrome(self, s: str) -> str:
>         if not s:
>             return ""
>         
>         start, end = 0, 0
>         
>         def expandAroundCenter(left: int, right: int) -> int:
>             while left >= 0 and right < len(s) and s[left] == s[right]:
>                 left -= 1
>                 right += 1
>             # 退出循环时，s[left] != s[right]，实际回文长度为 (right - 1) - (left + 1) + 1
>             return right - left - 1
> 
>         for i in range(len(s)):
>             # 奇数长度，中心是一个字符
>             len1 = expandAroundCenter(i, i)
>             # 偶数长度，中心是两个字符之间
>             len2 = expandAroundCenter(i, i + 1)
>             
>             max_len = max(len1, len2)
>             if max_len > end - start:
>                 start = i - (max_len - 1) // 2
>                 end = i + max_len // 2
>                 
>         return s[start : end + 1]
> ```
>
> **3. 复杂度分析**
>
> - **时间复杂度**：$O(N^2)$，其中 $N$ 是字符串的长度。每个中心最多扩展 $O(N)$ 次，共有 $2N-1$ 个中心。
> - **空间复杂度**：$O(1)$，仅需常数级别的变量保存边界。
>
> ---
>
> ### 方法三：Manacher（马拉车）算法
>
> **1. 思路**
>
> Manacher 算法可以在线性时间内解决最长回文子串问题。它在中心扩展法的基础上，利用了回文串的对称性质，避免了重复的计算。
>
> 1. **预处理**：由于奇数和偶数长度的处理方式不同，算法通过在字符之间插入特殊字符（如 `#`），使得所有回文串统一变成奇数长度。
>    - 例如，`"babad"` 转化为 `"#b#a#b#a#d#"`。
> 2. **利用已知信息辅助计算**：
>    - 维护一个数组 `p`，其中 `p[i]` 表示以 `t[i]` 为中心的最大回文半径（包含 `t[i]` 本身）。
>    - 维护当前已知的“最右回文边界” `max_right` 以及对应的中心 `center`。
>    - 遍历到 $i$ 时，如果 $i$ 在 `max_right` 内部，可以通过对称点 `mirror = 2 * center - i` 的 `p[mirror]` 值来初始化 `p[i]` 的大小，从而减少后续的中心扩展次数。
>
> **2. 代码实现**
>
> ```python
> class Solution:
>     def longestPalindrome(self, s: str) -> str:
>         if not s:
>             return ""
>         
>         # 预处理：插入 "#" 以处理偶数长度的回文
>         t = "#" + "#".join(s) + "#"
>         n = len(t)
>         p = [0] * n  # p[i] 存储以 t[i] 为中心的回文半径
>         
>         center = 0
>         max_right = 0
>         max_len = 0
>         start = 0
>         
>         for i in range(n):
>             if i < max_right:
>                 mirror = 2 * center - i
>                 p[i] = min(max_right - i, p[mirror])
>             else:
>                 p[i] = 1
>             
>             # 尝试向两边扩展
>             while i - p[i] >= 0 and i + p[i] < n and t[i - p[i]] == t[i + p[i]]:
>                 p[i] += 1
>             
>             # 更新中心和最右边界
>             if i + p[i] - 1 > max_right:
>                 center = i
>                 max_right = i + p[i] - 1
>             
>             # 记录最长回文子串在原字符串中的起始位置和长度
>             if p[i] - 1 > max_len:
>                 max_len = p[i] - 1
>                 start = (i - p[i] + 1) // 2
>                 
>         return s[start : start + max_len]
> ```
>
> **3. 复杂度分析**
>
> - **时间复杂度**：$O(N)$。由于 `max_right` 在遍历过程中单调递增，内部 `while` 循环的总执行次数与整个数组的长度成线性关系。
> - **空间复杂度**：$O(N)$，需要创建一个长度约为 $2N$ 的预处理字符串及对应的半径数组 `p`。



### M62. Unique Paths（不同路径）✅

一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？



**思路**：`dp[i][j] = dp[i-1][j] + dp[i][j-1]`，空间可优化为一维。

```python
def uniquePaths(m, n):
    row = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]
```



### M64. Minimum Path Sum（最小路径和）✅

给定一个包含非负整数的 `m x n` 网格 `grid` ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。

**说明：**每次只能向下或者向右移动一步。



**思路**：`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`。

```python
def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    for i in range(1, n):
        grid[0][i] += grid[0][i - 1]
    for i in range(1, m):
        grid[i][0] += grid[i - 1][0]
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i - 1][j], grid[i][j - 1])
    return grid[-1][-1]
```



### M72. Edit Distance（编辑距离）✅

给你两个单词 `word1` 和 `word2`， *请返回将 `word1` 转换成 `word2` 所使用的最少操作数* 。

你可以对一个单词进行如下三种操作：

- 插入一个字符
- 删除一个字符
- 替换一个字符



**思路**：`dp[i][j]` 表示 word1[:i] 到 word2[:j] 的最小编辑距离。

```python
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i	# 将 word1 变为空串需要 i 次删除操作
    for j in range(n + 1): dp[0][j] = j	# 将空串变成 word2 需要 j 次插入操作
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]	# 如果当前字符相同，则不需要操作
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
```



### M1143. Longest Common Subsequence（最长公共子序列）✅

给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长 **公共子序列** 的长度。如果不存在 **公共子序列** ，返回 `0` 。

一个字符串的 **子序列** 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

- 例如，`"ace"` 是 `"abcde"` 的子序列，但 `"aec"` 不是 `"abcde"` 的子序列。

两个字符串的 **公共子序列** 是这两个字符串所共同拥有的子序列。



**思路**：`dp[i][j]` 表示 text1[:i] 和 text2[:j] 的最长公共子序列长度。

```python
def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1	# 如果当前字符相同，则 LCS 长度加1
            else:
              	# 如果不同，则取两者中较大的LCS长度
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
```





## 十六、技巧（trick, 5）

### 31. Next Permutation（下一个排列）✅

整数数组的一个 **排列** 就是将其所有成员以序列或线性顺序排列。

- 例如，`arr = [1,2,3]` ，以下这些都可以视作 `arr` 的排列：`[1,2,3]`、`[1,3,2]`、`[3,1,2]`、`[2,3,1]` 。

整数数组的 **下一个排列** 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 **下一个排列** 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。

- 例如，`arr = [1,2,3]` 的下一个排列是 `[1,3,2]` 。
- 类似地，`arr = [2,3,1]` 的下一个排列是 `[3,1,2]` 。
- 而 `arr = [3,2,1]` 的下一个排列是 `[1,2,3]` ，因为 `[3,2,1]` 不存在一个字典序更大的排列。

给你一个整数数组 `nums` ，找出 `nums` 的下一个排列。

必须**[ 原地 ](https://baike.baidu.com/item/原地算法)**修改，只允许使用额外常数空间。



**思路**：从右向左找第一个降序位置 `i`，再找右侧比 `nums[i]` 大的最小数交换，最后反转 `i` 之后的部分。

```python
def nextPermutation(nums):
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    l, r = i + 1, len(nums) - 1
    while l < r:
        nums[l], nums[r] = nums[r], nums[l]
        l += 1
        r -= 1
```

> 算法核心逻辑拆解
>
> 1. **找“较小数”位置 `i`**：
>    从右往左找，找到第一个**降序**的位置（即 `nums[i] < nums[i+1]`）。这说明 `i` 位置的数拖了后腿，需要变大。
>    - 如果没找到（整个数组是降序的），说明已经是最大排列，直接反转整个数组即可。
> 2. **找“较大数”位置 `j`**：
>    在 `i` 的右边，从右往左找第一个**比 `nums[i]` 大**的数。因为 `i` 右边是降序的，找到的第一个比它大的数，就是“刚好比它大”的那个数。
> 3. **交换并反转**：
>    交换 `nums[i]` 和 `nums[j]`。此时 `i` 右边的数依然是降序的。为了让整体排列“刚好大一点”，需要把 `i`右边的部分变成**升序**（即字典序最小），所以直接反转 `i+1` 到末尾的部分。



### M75. Sort Colors（颜色分类）✅

给定一个包含红色、白色和蓝色、共 `n` 个元素的数组 `nums` ，**[原地](https://baike.baidu.com/item/原地算法)** 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 `0`、 `1` 和 `2` 分别表示红色、白色和蓝色。

必须在不使用库内置的 sort 函数的情况下解决这个问题。



**思路**：三指针（荷兰国旗问题）。用 `p0` 指向 0 的右边界，`p2` 指向 2 的左边界，`i` 遍历数组。

```python
def sortColors(nums):
    p0, i, p2 = 0, 0, len(nums) - 1
    while i <= p2:
        if nums[i] == 0:
            nums[i], nums[p0] = nums[p0], nums[i]
            p0 += 1
            i += 1
        elif nums[i] == 2:
            nums[i], nums[p2] = nums[p2], nums[i]
            p2 -= 1
        else:
            i += 1
```



### E136. Single Number（只出现一次的数字）✅

给你一个 **非空** 整数数组 `nums` ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。



**思路**：异或运算——相同数异或为 0，0 异或任何数等于其本身。

```python
def singleNumber(nums):
    res = 0
    for num in nums:
        res ^= num
    return res
```



### E169. Majority Element（多数元素）✅

给定一个大小为 `n` 的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**进阶：**尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。



**思路**：Boyer-Moore 投票算法。计数，遇到相同数 +1，不同 -1，减到 0 就换候选。

```python
def majorityElement(nums):
    candidate, count = nums[0], 1
    for num in nums[1:]:
        if count == 0:
            candidate, count = num, 1
        elif num == candidate:
            count += 1
        else:
            count -= 1
    return candidate
```



### M287. Find the Duplicate Number（寻找重复数）✅

给定一个包含 `n + 1` 个整数的数组 `nums` ，其数字都在 `[1, n]` 范围内（包括 `1` 和 `n`），可知至少存在一个重复的整数。

假设 `nums` 只有 **一个重复的整数** ，返回 **这个重复的数** 。

你设计的解决方案必须 **不修改** 数组 `nums` 且只用常量级 `O(1)` 的额外空间。



**思路**：将数组看作链表（值指向下标），用快慢指针找环的入口即重复数。

```python
def findDuplicate(nums):
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow
```





## 总结表

| # | 题目 | 难度 | 分类 | 核心思路 |
|---|---|---|---|---|
| 1 | Two Sum | Easy | 哈希表 | 哈希表记录下标 |
| 2 | Add Two Numbers | Medium | 链表 | 模拟竖式加法 |
| 3 | Longest Substring Without Repeating Characters | Medium | 滑动窗口 | 哈希集+双指针 |
| 4 | Median of Two Sorted Arrays | Hard | 二分查找 | 二分较短的数组 |
| 5 | Longest Palindromic Substring | Medium | DP | 中心扩展 |
| 11 | Container With Most Water | Medium | 双指针 | 移动较矮的边 |
| 15 | 3Sum | Medium | 双指针 | 排序+双指针 |
| 17 | Letter Combinations of a Phone Number | Medium | 回溯 | 递归生成组合 |
| 19 | Remove Nth Node From End of List | Medium | 链表 | 快慢指针 |
| 20 | Valid Parentheses | Easy | 栈 | 栈匹配 |
| 21 | Merge Two Sorted Lists | Easy | 链表 | 双指针归并 |
| 22 | Generate Parentheses | Medium | 回溯 | 左右括号计数回溯 |
| 23 | Merge k Sorted Lists | Hard | 链表/堆 | 最小堆 |
| 24 | Swap Nodes in Pairs | Medium | 链表 | 递归交换 |
| 25 | Reverse Nodes in k-Group | Hard | 链表 | 分段翻转 |
| 31 | Next Permutation | Medium | 数组 | 找降序+交换+反转 |
| 32 | Longest Valid Parentheses | Hard | 栈 | 栈存下标 |
| 33 | Search in Rotated Sorted Array | Medium | 二分查找 | 判断有序段 |
| 34 | Find First and Last Position of Element in Sorted Array | Medium | 二分查找 | 两次二分找边界 |
| 35 | Search Insert Position | Easy | 二分查找 | 标准二分 |
| 39 | Combination Sum | Medium | 回溯 | 回溯+可重复选 |
| 41 | First Missing Positive | Hard | 数组 | 原地哈希 |
| 42 | Trapping Rain Water | Hard | 双指针 | 左右最大高度 |
| 45 | Jump Game II | Medium | 贪心 | 边界步数 |
| 46 | Permutations | Medium | 回溯 | visited 标记 |
| 48 | Rotate Image | Medium | 矩阵 | 对角线翻转+行反转 |
| 49 | Group Anagrams | Medium | 哈希表 | 排序后分组 |
| 51 | N-Queens | Hard | 回溯 | 列/对角线剪枝 |
| 53 | Maximum Subarray | Medium | 子数组 | Kadane 算法 |
| 54 | Spiral Matrix | Medium | 矩阵 | 四边界模拟 |
| 55 | Jump Game | Medium | 贪心 | 最远可达位置 |
| 56 | Merge Intervals | Medium | 数组 | 排序后合并 |
| 62 | Unique Paths | Medium | DP | 组合数/滚动数组 |
| 64 | Minimum Path Sum | Medium | DP | 原地 DP |
| 70 | Climbing Stairs | Easy | DP | 斐波那契 |
| 72 | Edit Distance | Hard | DP | 二维 DP |
| 73 | Set Matrix Zeroes | Medium | 矩阵 | 首行首列标记 |
| 74 | Search a 2D Matrix | Medium | 二分查找 | 一维化二分 |
| 75 | Sort Colors | Medium | 双指针 | 三指针荷兰国旗 |
| 76 | Minimum Window Substring | Hard | 滑动窗口 | 哈希表+双指针 |
| 78 | Subsets | Medium | 回溯 | 选或不选 |
| 79 | Word Search | Medium | 矩阵/回溯 | DFS+回溯 |
| 84 | Largest Rectangle in Histogram | Hard | 栈 | 单调栈 |
| 94 | Binary Tree Inorder Traversal | Easy | 二叉树 | 递归遍历 |
| 98 | Validate Binary Search Tree | Medium | 二叉搜索树 | 中序递增/边界递归 |
| 101 | Symmetric Tree | Easy | 二叉树 | 递归比较左右 |
| 102 | Binary Tree Level Order Traversal | Medium | 二叉树 | BFS 队列 |
| 104 | Maximum Depth of Binary Tree | Easy | 二叉树 | 递归深度 |
| 105 | Construct Binary Tree from Preorder and Inorder Traversal | Medium | 二叉树 | 递归构建 |
| 108 | Convert Sorted Array to Binary Search Tree | Easy | 二叉搜索树 | 取中间为根 |
| 114 | Flatten Binary Tree to Linked List | Medium | 二叉树 | 前序展开 |
| 118 | Pascal's Triangle | Easy | DP | 逐行迭代 |
| 121 | Best Time to Buy and Sell Stock | Easy | 贪心 | 记录最低价 |
| 124 | Binary Tree Maximum Path Sum | Hard | 二叉树 | 后序遍历 |
| 128 | Longest Consecutive Sequence | Medium | 哈希表 | 集合去重+连续查找 |
| 131 | Palindrome Partitioning | Medium | 回溯 | 回溯+回文判断 |
| 136 | Single Number | Easy | 哈希表/位运算 | 异或 |
| 138 | Copy List with Random Pointer | Medium | 链表 | 插入复制节点 |
| 139 | Word Break | Medium | DP | 枚举拆分点 |
| 141 | Linked List Cycle | Easy | 链表 | 快慢指针 |
| 142 | Linked List Cycle II | Medium | 链表 | 快慢指针找入环点 |
| 146 | LRU Cache | Medium | 设计/链表 | 双向链表+哈希表 |
| 148 | Sort List | Medium | 链表 | 归并排序 |
| 152 | Maximum Product Subarray | Medium | 子数组 | 同时维护最大最小值 |
| 153 | Find Minimum in Rotated Sorted Array | Medium | 二分查找 | 与右端点比较 |
| 155 | Min Stack | Medium | 栈 | 辅助栈 |
| 160 | Intersection of Two Linked Lists | Easy | 链表 | 双指针互换 |
| 169 | Majority Element | Easy | 数组 | Boyer-Moore 投票 |
| 189 | Rotate Array | Medium | 数组 | 三次反转 |
| 198 | House Robber | Medium | DP | 滚动变量 DP |
| 199 | Binary Tree Right Side View | Medium | 二叉树 | 层序取最右 |
| 200 | Number of Islands | Medium | 矩阵/图 | DFS 标记 |
| 206 | Reverse Linked List | Easy | 链表 | 迭代反转 |
| 207 | Course Schedule | Medium | 图 | 拓扑排序 |
| 208 | Implement Trie (Prefix Tree) | Medium | 设计/树 | 26 叉树 |
| 215 | Kth Largest Element in an Array | Medium | 堆 | 最小堆/快选 |
| 226 | Invert Binary Tree | Easy | 二叉树 | 递归交换 |
| 230 | Kth Smallest Element in a BST | Medium | 二叉搜索树 | 中序遍历 |
| 234 | Palindrome Linked List | Easy | 链表 | 快慢找中+反转 |
| 236 | Lowest Common Ancestor of a Binary Tree | Medium | 二叉树 | 递归查找 |
| 238 | Product of Array Except Self | Medium | 数组 | 左右前缀积 |
| 239 | Sliding Window Maximum | Hard | 滑动窗口 | 单调双端队列 |
| 240 | Search a 2D Matrix II | Medium | 矩阵 | 右上角行走 |
| 279 | Perfect Squares | Medium | DP | 完全背包 |
| 283 | Move Zeroes | Easy | 双指针 | 非零前移 |
| 287 | Find the Duplicate Number | Medium | 双指针 | 快慢指针（链表环） |
| 295 | Find Median from Data Stream | Hard | 堆 | 双堆平衡 |
| 300 | Longest Increasing Subsequence | Medium | DP | 贪心+二分 tails |
| 322 | Coin Change | Medium | DP | 完全背包 |
| 347 | Top K Frequent Elements | Medium | 堆 | 哈希统计+最小堆 |
| 394 | Decode String | Medium | 栈 | 双栈/单栈 |
| 416 | Partition Equal Subset Sum | Medium | DP | 0-1 背包 |
| 437 | Path Sum III | Medium | 二叉树 | 前缀和+DFS |
| 438 | Find All Anagrams in a String | Medium | 滑动窗口 | 固定窗口+哈希 |
| 543 | Diameter of Binary Tree | Easy | 二叉树 | 后序深度 |
| 560 | Subarray Sum Equals K | Medium | 哈希表 | 前缀和 |
| 739 | Daily Temperatures | Medium | 栈 | 单调递减栈 |
| 763 | Partition Labels | Medium | 贪心 | 记录最后位置+分段 |
| 994 | Rotting Oranges | Medium | 矩阵/图 | 多源 BFS |
| 1143 | Longest Common Subsequence | Medium | DP | 二维 DP |
