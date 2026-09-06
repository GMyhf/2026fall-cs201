## 2026spring 数算（DS Algo）每日选作
*Updated 2026-05-28 00:49 GMT+8*  *Compiled by Hongfei Yan (2026 Spring)*  
https://github.com/GMyhf/2026spring-cs201/blob/main/DSA_problem_list_at_2026spring.md

题解，https://fuynaloft.github.io/sol101/ ✅

<!--
|  |       |       | Medium |          |
-->



<!-- ### ==2026/03/02 -->

| 日期       | 问题编号与名称                 | 标签                                 | 难度 | 链接                                             |
| ---------- | ------------------------------ | ------------------------------------ | ---- | ------------------------------------------------ |
| 0528 | 3093.最长公共后缀查询 | Trie   | Tough | https://leetcode.cn/problems/longest-common-suffix-queries/          |
| 0527 | 24686:树的重量    | lazy tag, Segment Tree, Fenwick/Binary Indexed Tree  | Tough | http://cs101.openjudge.cn/practice/24686/          |
| 0526 | P3403 跳楼机      | 同余最短路   | 蓝色 提高+/省选 | https://www.luogu.com.cn/problem/P3403          |
| 0525 | M1871.跳跃游戏 VII      | dp+sliding window | Medium | https://leetcode.cn/problems/jump-game-vii/          |
| 0524 | P2515 [HAOI2010] 软件安装  | SCC, tree DP   | 蓝色 提高+/省选- | https://www.luogu.com.cn/problem/P2515          |
| 0523 | 1850H. The Third Letter  | dfs and similar, dsu, graphs, greedy  | 1700 | https://codeforces.com/contest/1850/problem/H          |
| 0522 | 30901:第67个异或问题     | math, hash table, trie, bitmask  | Tough | http://cs101.openjudge.cn/practice/30901/          |
| 0521 | P6192 【模板】最小斯坦纳树  | 状态压缩DP, Dijkstra  | 紫色 省选/NOI-   | https://www.luogu.com.cn/problem/P6192 |
| 0520 | 30313: 0-W 最小生成树    | 补图连通块 + 缩点 Kruskal       | Tough | http://cs101.openjudge.cn/practice/T30313          |
| 0519 | 28749: Top2招生工作      | 图论，线性同余方程组    | Tough | http://cs101.openjudge.cn/practice/28749/          |
| 0518 | P1262 [POI 1996 R3] 间谍网络  | SCC      | 绿色 普及+/提高 | https://www.luogu.com.cn/problem/P1262          |
| 0517 | P3387 【模板】缩点 | SCC      | 绿色 普及+/提高 | https://www.luogu.com.cn/problem/P3387          |
| 0516 | 427C. Checkposts   | SCC/dfs and similar, graphs, two pointers  | 1700 | https://codeforces.com/problemset/problem/427/C          |
| 0515 | 29702:二叉的水管  | topological order       | Tough | http://cs101.openjudge.cn/practice/29702/          |
| 0514 | 09202: 舰队、海域出击！   | topological order    | Medium    | http://cs101.openjudge.cn/practice/09202/      |
| 0513 | 05442: 兔子与星空 | MST   | Medium    | http://cs101.openjudge.cn/practice/05442/      |
| 0512 | 01258: Agri-Net   | MST    | Medium    | http://cs101.openjudge.cn/practice/01258/      |
| 0511 | 05443: 兔子与樱花 | dijkstra, Floyd-Warshall      | Medium | http://cs101.openjudge.cn/practice/05443/          |
| 0510 | 3629.通过质数传送到达终点的最少跳跃次数      | bfs, hash table, number theory       | Medium | https://leetcode.cn/problems/minimum-jumps-to-reach-end-via-prime-teleportation/          |
| 0509 | 3660.跳跃游戏 IX   | greedy, graph   | Medium | https://leetcode.cn/problems/jump-game-ix/          |
| 0508 | 30669: 地铁换乘    | LCA, binary lifting   | Tough | http://cs101.openjudge.cn/practice/30669/          |
| 0507 | M30720: 败方树的构建与维护    | tree       | Medium | http://cs101.openjudge.cn/practice/30720/          |
| 0506 | 27093: 排队又来了  | Segment Tree, Discretization（离散化）, binary search | Tough | http://cs101.openjudge.cn/practice/27093/          |
|  | P8099 [USACO22JAN] Minimizing Haybales P | 线段树, 二分, 拓扑排序  | 紫色 省选/NOI- | https://www.luogu.com.cn/problem/P8099          |
| 0505 | 2502: Subway   | dijkstra | Tough | http://cs101.openjudge.cn/practice/02502/          |
| 0504 | 02442:Sequence     | heap, greedy      | Tough | http://cs101.openjudge.cn/practice/02442/          |
| 0503 | 2075C. Two Colors  | binary search, two pointers, combinatorics, math      | 1500 | https://codeforces.com/contest/2075/problem/C  |
| 0502 | 3742.网格中得分最大的路径     | dp     | Medium | https://leetcode.cn/problems/maximum-path-score-in-a-grid/          |
| 0501 | 29803:穿越火线     | binary search + Dijkstra       | Tough | http://cs101.openjudge.cn/practice/29803/          |
| 0430 | 28972:海拔      | Kruskal, binary+bfs, Dijkstra     | Tough | http://cs101.openjudge.cn/practice/28972          |
| 0429 | 28050: 骑士周游   | backtracking, Warnsdorff  | Tough | http://cs101.openjudge.cn/practice/28050/          |
| 0428 | 28046: 词梯      | bfs       | Medium | http://cs101.openjudge.cn/practice/28046/          |
| 0427 | M1391.检查网格中是否存在有效路径 | bfs      | Medium | https://leetcode.cn/problems/check-if-there-is-a-valid-path-in-a-grid/          |
|      |      | graph and all kinds of tags begin  | | |
| 0426 | 3464.正方形上的点之间的最大距离  | geometry, binary search       | Tough | https://leetcode.cn/problems/maximize-the-distance-between-points-on-a-square/          |
| 0425 | 07734: 虫子的生活  | dsu      | Medium | http://cs101.openjudge.cn/practice/07734/          |
| 0424 | 01611: The Suspects      | dsu       | Medium | http://cs101.openjudge.cn/practice/01611/          |
| 0423 | 3331.修改后子树的大小      | dfs, backtracking  | Medium | https://leetcode.cn/problems/find-subtree-sizes-after-changes/          |
| 0422 | 2452.距离字典两次编辑以内的单词   | trie, brute force       | Medium | https://leetcode.cn/problems/words-within-two-edits-of-dictionary/          |
| 0421 | M1722.执行交换操作后的最小汉明距离      | dsu      | Medium | https://leetcode.cn/problems/minimize-hamming-distance-after-swap-operations/          |
| 0420 | 3761.镜像对之间最小绝对距     | hash table  | Medium | https://leetcode.cn/problems/minimum-absolute-distance-between-mirror-pairs/          |
| 0419 | 3600.升级后最大生成树稳定性    | <mark>binary search</mark>, <mark>minimum spanning tree</mark>, dsu | Tough | https://leetcode.cn/problems/maximize-spanning-tree-stability-with-upgrades/          |
| 0418 | 3327.判断 DFS 字符串是否是回文串    | tree, dfs, manacher  | Tough | https://leetcode.cn/problems/check-if-dfs-strings-are-palindromes/          |
|  |       | one problem per day       |  |          |
| 0417 | 30894: 哈夫曼编码树      | greedy    | Tough | http://cs101.openjudge.cn/practice/30894/          |
| 0417 | 3488.距离最小相等元素查询 | hash table, binary search  | Medium | https://leetcode.cn/problems/closest-equal-element-queries/          |
| 0416 | 04080: Huffman 编码树 | greedy   | Easy | http://cs101.openjudge.cn/practice/04080/          |
| 0416 | 20576: printExp（逆波兰表达式建树）      | AST       | Tough | http://cs101.openjudge.cn/practice/20576/          |
| 0415 | 02775: 文件结构“图”  | tree   | Tough | http://cs101.openjudge.cn/practice/02775/          |
| 0415 | 116.填充每个节点的下一个右侧节点指针  | dfs, linked list, binary tree | Medium | https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/   |
| 0414 | P3379 【模板】最近公共祖先（LCA） | LCA, binary lifting | Tough | https://www.luogu.com.cn/problem/P3379          |
| 0414 | P1352 没有上司的舞会   | tree dp  | Medium | https://www.luogu.com.cn/problem/P1352          |
| 0413 | 124.二叉树中的最大路径和      | dfs, dp, binary tree      | Tough | https://leetcode.cn/problems/binary-tree-maximum-path-sum/          |
| 0413 | 236.二叉树的最近公共祖先  | dfs, binary tree | Medium | https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/          |
| 0412 | 03720: 文本二叉树     | tree    | Medium    | http://cs101.openjudge.cn/practice/03720/      |
| 0412 | 24637:宝藏二叉树     | tree dp    | Medium    | http://cs101.openjudge.cn/practice/24637/      |
| 0411 | 529.扫雷游戏  | dfs, bfs      | Medium | https://leetcode.cn/problems/minesweeper/          |
| 0411 | 580C. Kefa and Park  | dfs and similar, graphs, trees   | 1500 | https://codeforces.com/contest/580/problem/C           |
| 0410 | 297.二叉树的序列化与反序列化      | dfs, bfs  | Medium | https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/          |
| 0410 | 15265: Shell排序      | shell sorting      | Medium | http://cs101.openjudge.cn/practice/15265/          |
| 0409 | 1843D. Apple Tree     | Combinatorics, dfs and similar, dp, math, trees     | 1200 | https://codeforces.com/problemset/problem/1843/D          |
| 0409 | 01577:Falling Leaves | tree    | Medium    | http://cs101.openjudge.cn/practice/01577/     |
| 0408 | 230.二叉搜索树中第K小的元素   | dfs, stack   | Medium | https://leetcode.cn/problems/kth-smallest-element-in-a-bst/          |
| 0408 | 27637:括号嵌套二叉树  | dfs, stack       | Medium | http://cs101.openjudge.cn/practice/27637          |
| 0407 | 2069.模拟行走机器人 II   | implementation     | Medium | https://leetcode.cn/problems/walking-robot-simulation-ii/          |
| 0407 | 226.翻转二叉树      | dfs       | Easy | https://leetcode.cn/problems/invert-binary-tree/          |
| 0406 | 874.模拟行走机器人     | implementation   | Medium | https://leetcode.cn/problems/walking-robot-simulation/           |
| 0406 | 104.二叉树的最大深度   | dfs   | Easy | https://leetcode.cn/problems/maximum-depth-of-binary-tree/          |
| 0405 | 101025.产生至少 K 个峰值的最少操作次数  | dp | Tough | https://leetcode.cn/problems/minimum-operations-to-achieve-at-least-k-peaks/          |
| 0405 | 94. 二叉树的中序遍历 | dfs, stack, Morris       | Easy | https://leetcode.cn/problems/binary-tree-inorder-traversal/         |
|  |       | trees begin |   |       |
| 0404 | 3561.移除相邻字符     | stack    | Medium    | https://leetcode.cn/problems/resulting-string-after-adjacent-removals/      | 
| 0404 | 2087.网格图中机器人回家的最小代价    | greedy       | Medium | https://leetcode.cn/problems/minimum-cost-homecoming-of-a-robot-in-a-grid/          |
| 0403 | 3661.可以被机器人摧毁的最大墙壁数目  | dp, binary search  | Tough  | https://leetcode.cn/problems/maximum-walls-destroyed-by-robots/          |
| 0403 | 30637: 合法出栈序列pub   | stack, math  | Medium | http://cs101.openjudge.cn/practice/M30637/          |
| 0402 | 30102:完美交易窗口  | monotonic stack, binary search | Tough | http://cs101.openjudge.cn/practice/T30102/          |
| 0402 | 3418.机器人可以获得的最大金币数  | dp  | Medium | https://leetcode.cn/problems/maximum-amount-of-money-robot-can-earn/          |
| 0401 | 2751.机器人碰撞 | stack     | Tough | https://leetcode.cn/problems/robot-collisions/          |
| 0401 | 30339:愉悦的假期  | bfs     | Tough | http://cs101.openjudge.cn/practice/30339/         |
| 0331 | 3474.字典序最小的生成字符串   | greedy, string | Tough | https://leetcode.cn/problems/lexicographically-smallest-generated-string/          |
| 0331 | 27205:护林员盖房子又来了  | monotonic stack    | Tough | http://cs101.openjudge.cn/pctbook/T27205/          |
| 0330 | 239.滑动窗口最大值   | sliding window, monotonic queue   | Tough | https://leetcode.cn/problems/sliding-window-maximum/          |
| 0330 | 2840.判断通过操作能否让字符串相等 II   | string, sorting  | Medium |  https://leetcode.cn/problems/check-if-strings-can-be-made-equal-with-operations-ii/        |
| 0329 | 02815: 城堡问题     | bfs, dfs, bit manipulation    | Medium    | http://cs101.openjudge.cn/pctbook/M02815/      |
| 0329 | 142.环形链表II  | hash table, linked list, two pointers   | Medium | https://leetcode.cn/problems/linked-list-cycle-ii/          |
| 0328 | 37.解数独   | backtracking, hash table | Tough    | https://leetcode.cn/problems/sudoku-solver/      |
| 0328 | 19.删除链表的倒数第N个结点| linked list, tow pointers | Medium | https://leetcode.cn/problems/remove-nth-node-from-end-of-list/      |
| 0327 | 3548.等和矩阵分割 II  | prefix sum | Tough | https://leetcode.cn/problems/equal-sum-grid-partition-ii/          |
| 0327 | sy299:简单的计算器      | stack       | Tough | https://sunnywhy.com/sfbj/7/1/299          |
| 0326 | 02488: A Knight's Journey  | backtracking, greedy    | Tough  | http://cs101.openjudge.cn/practice/02488/      | 
| 0326 | 141.环形链表    | hash table, linked list, two pointers   | Easy | https://leetcode.cn/problems/linked-list-cycle/          |
| 0325 | 20140:今日化学论文 | stack    | Medium    | http://cs101.openjudge.cn/pctbook/M20140/ |
| 0325 | 206.反转链表  | recursion, linked list | Easy | https://leetcode.cn/problems/reverse-linked-list/          |
| 0324 | 394.字符串解码     | stack    | Medium | https://leetcode.cn/problems/decode-string/    |
| 0324 | 160.相交链表  | hash table, linked list, two pinters | Easy | https://leetcode.cn/problems/intersection-of-two-linked-lists/          |
| 0323 | 1594.矩阵的最大非负积  | dp      | Medium | https://leetcode.cn/problems/maximum-non-negative-product-in-a-matrix/          |
| 0323 | 1886.判断矩阵经轮转后是否一致     | matrix  | Easy | https://leetcode.cn/problems/determine-whether-matrix-can-be-obtained-by-rotation/          |
| 0322 | 240.搜索二维矩阵II     | binary search    | Medium    | https://leetcode.cn/problems/search-a-2d-matrix-ii/      |
| 0322 | E3643.垂直翻转子矩阵   | two pinters, matrix  | Easy | https://leetcode.cn/problems/flip-square-submatrix-vertically/          |
| 0321 | 08210: 河中跳房子  | binary search, greedy  | Medium  | http://cs101.openjudge.cn/pctbook/M08210                         | 
| 0321 | 994.腐烂的橘子     | bfs    | Medium    | https://leetcode.cn/problems/rotting-oranges/ |
| 0320 | M3212.统计 X 和 Y 频数相等的子矩阵数量  | prefix sum  | Medium | https://leetcode.cn/problems/count-submatrices-with-equal-frequency-of-x-and-y/    |
| 0320 | 35.搜索插入位置  | binary search | Easy | https://leetcode.cn/problems/search-insert-position/         |
| 0319 | 03129:魔兽世界之一：备战 | implementation | Medium | http://cs101.openjudge.cn/practice/03129/          |
| 0319 | 2405.子字符串的最优划分  | greedy, bit manipulation | Medium | https://leetcode.cn/problems/optimal-partition-of-string/          |
| 0318 | 5.最长回文串 | DP, Center Expansion, Manacher | Medium | https://leetcode.cn/problems/longest-palindromic-substring/          |
| 0318 | 04093: 倒排索引查询 | Inverted Index | Medium | http://cs101.openjudge.cn/practice/04093/          |
| 0317 | 02406: 字符串乘方   | KMP  | Tough | http://cs101.openjudge.cn/practice/02406/          |
| 0317 | 39.组合总和   | backtracking    | Medium | https://leetcode.cn/problems/combination-sum/          |
| 0316 | 17.电话号码的字母组合    | backtracking       | Medium | https://leetcode.cn/problems/letter-combinations-of-a-phone-number/          |
| 0316 | 1415.长度为 n 的开心字符串中字典序第 k 小的字符串 | math, backtracking | Medium | https://leetcode.cn/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/          |
| 0315 | 78.子集      | backtracking      | Medium | https://leetcode.cn/problems/subsets/         |
| 0315 | 46.全排列    | backtracking      | Medium | https://leetcode.cn/problems/permutations/          |
| 0314 | 20018:蚂蚁王国的越野跑  | <mark>merge sort</mark>, <mark>binary indexed tree</mark> | Medium2  | http://cs101.openjudge.cn/practice/20018/          |
| 0314 | 131.分割回文串       | dp, backtracking  | Medium | https://leetcode.cn/problems/palindrome-partitioning/          |
| 0313 | 30201: 旅行售货商问题  | 状态压缩DP, Held-Karp   | Tough | http://cs101.openjudge.cn/practice/30201/       |
| 0313 | 04067: 回文数字 | queue       | Easy       | http://cs101.openjudge.cn/pctbook/E04067          |
| 0312 | 1888.使二进制字符串字符交替的最少反转次数 | <mark>sliding window</mark> | Medium2 | https://leetcode.cn/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/ |
| 0312 | 1009.十进制整数的反码  | bit manipulation  | Easy | https://leetcode.cn/problems/complement-of-base-10-integer/description/          |
| 0311 | 2195.EIdiot First Search | <mark>dfs and similar, dp, trees</mark> | Tough | https://codeforces.com/problemset/problem/2195/E           |
| 0311 | 1364A.XXXXX  | two pointers  | 1200 | https://codeforces.com/problemset/problem/1364/A          |
| 0310 | 647.回文子串 | <mark>two pointers</mark>/中心扩散, dp/马拉车 | Medium | https://leetcode.cn/problems/palindromic-substrings/          |
| 0310 | M304.二维区域和检索 - 矩阵不可变 | prefix sum  | Medium | https://leetcode.cn/problems/range-sum-query-2d-immutable/          |
| 0309 | 1545. 找出第 N 个二进制字符串中的第 K 位 | dfs | Medium | https://leetcode.cn/problems/find-kth-bit-in-nth-binary-string/          |
| 0309 | E303.区域和检索 - 数组不可变    | <mark>prefix sum</mark> | Easy | https://leetcode.cn/problems/range-sum-query-immutable/         |
| 0308 | 01019:Number Sequence| <mark>binary search</mark> | Medium | http://cs101.openjudge.cn/practice/01019/          |
| 0308 | 20169:排队    | <mark>DSU</mark>       | Easy | http://cs101.openjudge.cn/practice/20169/          |
| 0307 | 07207:神奇的幻方  | <mark>matrix</mark>      | Medium | http://cs101.openjudge.cn/practice/07207/          |
| 0307 | 05467:多项式加法  | dict   | Easy | http://cs101.openjudge.cn/practice/05467/          |
| 0306 | 1461.检查一个字符串是否包含所有长度为 K 的二进制子串  | bit manipulation   | Medium | https://leetcode.cn/problems/check-if-a-string-contains-all-binary-codes-of-size-k/          |
| 0306 | 3827.统计单比特整数| bit manipulation  | Easy | https://leetcode.cn/problems/count-monobit-integers/          |
| 0305 | 1404.将二进制表示减到 1 的步骤数   | bit manipulation | Medium | https://leetcode.cn/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one/    |
| 0305 | 868.二进制间距  | bit manipulation | Easy | https://leetcode.cn/problems/binary-gap/          |
| 0304 | 1680.连接连续二进制数字 | bit manipulation | Medium | https://leetcode.cn/problems/concatenation-of-consecutive-binary-numbers/          |
| 0304 | 1356.根据数字二进制下 1 的数目排序 | bit manipulation | Easy | https://leetcode.cn/problems/sort-integers-by-the-number-of-1-bits/          |
| 0303 | <mark>155.最小栈</mark> | OOP, 辅助栈 | Medium | https://leetcode.cn/problems/min-stack/ |
| 0303 |  190.颠倒二进制位  | <mark>bit manipulation</mark>   | Easy |  https://leetcode.cn/problems/reverse-bits/        |
| 0302 | 27300:模型整理 | sortings, AI   | Mediium   |  http://cs101.openjudge.cn/pctbook/M27300   |
| 0302 | 27653:Fraction类 | OOP   | Easy  | http://cs101.openjudge.cn/pctbook/E27653/  |
