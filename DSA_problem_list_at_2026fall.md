## 2026fall 数算（DS Algo）每日选作
*Updated 2026-10-29 18:21 GMT+8*  *Compiled by Hongfei Yan (2026 Fall)*  
https://github.com/GMyhf/2026fall-cs201/blob/main/DSA_problem_list_at_2026fall.md

题解，https://fuynaloft.github.io/sol101/ ✅

<!--
|  |       |       | Medium |          |
-->



<!-- ### ==2026/03/02 -->

| 日期       | 问题编号与名称                 | 标签                                 | 难度 | 链接                                             |
| ---------- | ------------------------------ | ------------------------------------ | ---- | ------------------------------------------------ |
|  |       |       | Medium |          |
| 11 | P1262 [POI 1996 R3] 间谍网络  | SCC      | 绿色 普及+/提高 | https://www.luogu.com.cn/problem/P1262          |
| 11 | P3387 【模板】缩点 | SCC      | 绿色 普及+/提高 | https://www.luogu.com.cn/problem/P3387          |
| 11 | 427C. Checkposts   | SCC/dfs and similar, graphs, two pointers  | 1700 | https://codeforces.com/problemset/problem/427/C          |
| 11 | 29702:二叉的水管  | topological order       | Tough | http://cs101.openjudge.cn/practice/29702/          |
| 11 | 09202: 舰队、海域出击！   | topological order    | Medium    | http://cs101.openjudge.cn/practice/09202/      |
| 11 | 05442: 兔子与星空 | MST   | Medium    | http://cs101.openjudge.cn/practice/05442/      |
| 11 | 01258: Agri-Net   | MST    | Medium    | http://cs101.openjudge.cn/practice/01258/      |
| 11 | 05443: 兔子与樱花 | dijkstra, Floyd-Warshall      | Medium | http://cs101.openjudge.cn/practice/05443/          |
| 110 | 3629.通过质数传送到达终点的最少跳跃次数      | bfs, hash table, number theory       | Medium | https://leetcode.cn/problems/minimum-jumps-to-reach-end-via-prime-teleportation/          |
| 11 | 3660.跳跃游戏 IX   | greedy, graph   | Medium | https://leetcode.cn/problems/jump-game-ix/          |
| 11 | 30669: 地铁换乘    | LCA, binary lifting   | Tough | http://cs101.openjudge.cn/practice/30669/          |
| 11 | M30720: 败方树的构建与维护    | tree       | Medium | http://cs101.openjudge.cn/practice/30720/          |
| 11 | 27093: 排队又来了  | Segment Tree, Discretization（离散化）, binary search | Tough | http://cs101.openjudge.cn/practice/27093/          |
|  | P8099 [USACO22JAN] Minimizing Haybales P | 线段树, 二分, 拓扑排序  | 紫色 省选/NOI- | https://www.luogu.com.cn/problem/P8099          |
| 11 | 2502: Subway   | dijkstra | Tough | http://cs101.openjudge.cn/practice/02502/          |
| 11 | 02442:Sequence     | heap, greedy      | Tough | http://cs101.openjudge.cn/practice/02442/          |
| 11 | 2075C. Two Colors  | binary search, two pointers, combinatorics, math      | 1500 | https://codeforces.com/contest/2075/problem/C  |
| 1106 | 3742.网格中得分最大的路径     | dp     | Medium | https://leetcode.cn/problems/maximum-path-score-in-a-grid/          |
| 1105 | 29803:穿越火线     | binary search + Dijkstra       | Tough | http://cs101.openjudge.cn/practice/29803/          |
| 1104 | 28972:海拔      | Kruskal, binary+bfs, Dijkstra     | Tough | http://cs101.openjudge.cn/practice/28972          |
| 1103 | 28050: 骑士周游   | backtracking, Warnsdorff  | Tough | http://cs101.openjudge.cn/practice/28050/          |
| 1102 | 28046: 词梯      | bfs       | Medium | http://cs101.openjudge.cn/practice/28046/          |
| 1101 | M1391.检查网格中是否存在有效路径 | bfs      | Medium | https://leetcode.cn/problems/check-if-there-is-a-valid-path-in-a-grid/          |
|      |      | graph and all kinds of tags begin  | | |
| 1031 | 07734: 虫子的生活  | dsu      | Medium | http://cs101.openjudge.cn/practice/07734/          |
| 1030 | 01611: The Suspects      | dsu       | Medium | http://cs101.openjudge.cn/practice/01611/          |
| 1029 | 05430:表达式·表达式树·表达式求值      | tree      | Tough | http://cs101.openjudge.cn/practice/05430     |
| 1028 | 05414:由中根序列和后根序列重建二叉树     | tree      | Easy | http://cs101.openjudge.cn/practice/05414         |
| 1027 | 31454:第一个 AA 型子串   | brute force   | Medium | http://cs101.openjudge.cn/practice/31454/          |
| 1026 | M437.路径总和 III  | prefix sum, backtracking  | Medium | https://leetcode.cn/problems/path-sum-iii/          |
| 1025 | 76.最小覆盖子串    | sliding window    | Tough | https://leetcode.cn/problems/minimum-window-substring/          |
| 1024 | 04082: 树的镜面映射      | tree     | Medium | http://cs101.openjudge.cn/practice/04082/          |
| 1023 | 31418:筛选法建最小堆的交换次数      | heap  | Easy | http://cs101.openjudge.cn/practice/31418/  |
| 1022 | 30894: 哈夫曼编码树      | greedy    | Tough | http://cs101.openjudge.cn/practice/30894/          |
| 1021 | 124.二叉树中的最大路径和      | dfs, dp, binary tree      | Tough | https://leetcode.cn/problems/binary-tree-maximum-path-sum/          |
| 1020 | 236.二叉树的最近公共祖先  | dfs, binary tree | Medium | https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/          |
| 1019 | 03720: 文本二叉树     | tree    | Medium    | http://cs101.openjudge.cn/practice/03720/      |
| 1018 | 580C. Kefa and Park  | dfs and similar, graphs, trees   | 1500 | https://codeforces.com/contest/580/problem/C           |
| 1017 | 297.二叉树的序列化与反序列化      | dfs, bfs  | Medium | https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/          |
| 1016 | 1843D. Apple Tree     | Combinatorics, dfs and similar, dp, math, trees     | 1200 | https://codeforces.com/problemset/problem/1843/D          |
| 1015 | 01577:Falling Leaves | tree    | Medium    | http://cs101.openjudge.cn/practice/01577/     |
| 1014 | 27637:括号嵌套二叉树  | dfs, stack       | Medium | http://cs101.openjudge.cn/practice/27637          |
| 1013 | 104.二叉树的最大深度   | dfs   | Easy | https://leetcode.cn/problems/maximum-depth-of-binary-tree/          |
| 1012 | 24591:中序表达式转后序表达式   | stack      | Medium | http://cs101.openjudge.cn/practice/24591/         |
| 1011 | 31378:KMP 字符比较次数（nextval）| KMP   | Tough | http://cs101.openjudge.cn/practice/31378/          |
| 1010 | 131.分割回文串       | dp, backtracking  | Medium | https://leetcode.cn/problems/palindrome-partitioning/  |
| 1009 | 647.回文子串 | <mark>two pointers</mark>/中心扩散, dp/马拉车 | Medium | https://leetcode.cn/problems/palindromic-substrings/          |
| 1008 | 78.子集      | backtracking      | Medium | https://leetcode.cn/problems/subsets/         |
| 1007 | 46.全排列    | backtracking      | Medium | https://leetcode.cn/problems/permutations/          |
| 1006 | 20018:蚂蚁王国的越野跑  | <mark>merge sort</mark>, <mark>binary indexed tree</mark> | Medium2  | http://cs101.openjudge.cn/practice/20018/          |
| 1005 | 08210: 河中跳房子  | binary search, greedy  | Medium  | http://cs101.openjudge.cn/pctbook/M08210                         |
| 1004 | T32.最长有效括号  | stack, greedy      | Tough | https://leetcode.cn/problems/longest-valid-parentheses/         |
| 1003 | M22.括号生成      | backtracking       | Medium | https://leetcode.cn/problems/generate-parentheses/          |
| 1002 | T30201: 旅行售货商问题 | bitmask dp  | Toughm | http://cs101.openjudge.cn/practice/30201/          |
| 1001 | 01961: 前缀中的周期  | KMP      | Medium | http://cs101.openjudge.cn/practice/01961/          |
| 0930 | 239.滑动窗口最大值   | sliding window, monotonic queue   | Tough | https://leetcode.cn/problems/sliding-window-maximum/          |
| 0929 | 2840.判断通过操作能否让字符串相等 II   | string, sorting  | Medium |  https://leetcode.cn/problems/check-if-strings-can-be-made-equal-with-operations-ii/        |
| 0928 | 155.最小栈 | OOP, 辅助栈 | Medium | https://leetcode.cn/problems/min-stack/ |
| 0927 | 1461.检查一个字符串是否包含所有长度为 K 的二进制子串  | bit manipulation   | Medium | https://leetcode.cn/problems/check-if-a-string-contains-all-binary-codes-of-size-k/          |
| 0926 | 394.字符串解码     | stack  | Medium | https://leetcode.cn/problems/decode-string/          |
| 0925 | 1096.花括号展开 II | stack  | Tough | https://leetcode.cn/problems/brace-expansion-ii/          |
| 0924 | 1658.将 x 减到 0 的最小操作数      | sliding window       | Medium | https://leetcode.cn/problems/minimum-operations-to-reduce-x-to-zero/          |
| 0923 | 3827.统计单比特整数| bit manipulation  | Easy | https://leetcode.cn/problems/count-monobit-integers/          |
| 0922 | 1404.将二进制表示减到 1 的步骤数   | bit manipulation | Medium | https://leetcode.cn/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one/    |
| 0921 | M07207:神奇的幻方  | implementation  | Medium | http://cs101.openjudge.cn/pctbook/M07207/          |
| 0920 | 146.LRU缓存      | hash table, doubly-linked list   | Medium | https://leetcode.cn/problems/lru-cache/          |
| 0919 | 283.移动零        | two pointers      | Easy | https://leetcode.cn/problems/move-zeroes/          |
| 0918 | E206.反转链表      | recursion, linked list      | Easy/Medium | https://leetcode.cn/problems/reverse-linked-list/          |
| 0917 | E160.相交链表      | hash table, linked list, two pointers  | Easy/Medium | https://leetcode.cn/problems/intersection-of-two-linked-lists/          |
| 0916 | 868.二进制间距  | bit manipulation | Easy | https://leetcode.cn/problems/binary-gap/          |
| 0915 | 31202:这也是逆序对? | two pointers      | Medium | http://cs101.openjudge.cn/practice/31202/          |
| 0914 | 1680.连接连续二进制数字 | bit manipulation | Medium | https://leetcode.cn/problems/concatenation-of-consecutive-binary-numbers/          |
| 0913 | 1356.根据数字二进制下 1 的数目排序 | bit manipulation | Easy | https://leetcode.cn/problems/sort-integers-by-the-number-of-1-bits/          |
| 0912 | 01035:拼写检查      | implementation  | Medium | http://cs101.openjudge.cn/practice/01035/          |
| 0911 | 27141:完美的爱      | prefix sum, hashing table  | Medium | http://cs101.openjudge.cn/practice/27141/         |
| 0910 | 05443: 兔子与樱花   | Dijkstra, Floyd-Warshall   | Medium | http://cs101.openjudge.cn/practice/05443           |
| 0909 | 190.颠倒二进制位  | bit manipulation   | Easy |  https://leetcode.cn/problems/reverse-bits/        |
| 0908 | 27300:模型整理 | sortings, AI   | Mediium   |  http://cs101.openjudge.cn/pctbook/M27300   |
| 0907 | 27653:Fraction类 | OOP   | Easy  | http://cs101.openjudge.cn/pctbook/E27653/  |
