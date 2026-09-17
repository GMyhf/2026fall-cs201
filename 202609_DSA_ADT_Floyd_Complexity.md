# DSA Week1 ADT, Floyd, Dijkstra & Complexity

*Updated 2026-09-17 09:40 GMT+8*  
*Compiled by Hongfei Yan (2026 fall)*    
https://github.com/GMyhf/2026fall-cs201/



**知识点**：问题抽象与建模、相邻矩阵、Floyd 最短路、最小化最大距离；
逻辑结构 $(K, r)$ 与线性/树形/图三分；顺序、链接、索引、散列四种存储映射；
抽象数据类型 $(D, R, P)$ 与信息隐蔽；算法的四条性质；六种算法设计方法；
渐进分析与大 $O$ / $\Omega$ / $\Theta$；最佳、最差与平均情况；时空折衷。



# 1 数据结构与算法

https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/?ref=outind

数据结构与算法（Data Structures and Algorithms，简称 DSA）是两个独立但又紧密关联的计算机科学领域的结合。它被广泛认为是每一位计算机专业学生必须掌握的核心技能之一。

在实践中我们常常发现，对数据结构与算法有深入理解的程序员，通常具备更强的编程能力和问题解决能力。

> 掌握 DSA，不仅是提升编程能力的关键，更是通往优秀软件工程师之路的基石。正因如此，他们往往能在激烈的求职竞争中脱颖而出，成功通过各大科技公司的技术面试。

![img](https://raw.githubusercontent.com/GMyhf/img/main/img/202402232017469.png)



<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/fb96bc6ffdcf0b07190386d66d9e14ad.png" alt="fb96bc6ffdcf0b07190386d66d9e14ad" style="zoom: 67%;" />

⚠️ **重要提示：算法是前序《计算概论》（Algorithms and Data Structures，简称 ADS）课程的核心内容**

> ADS 课程涵盖以下四类关键算法：
>
> - 贪心算法（Greedy）
> - 递归与回溯（Recursion / Backtracking）
> - 动态规划（Dynamic Programming, DP）
> - 搜索算法（Searching）
>
> 如果你在递归类题目上练习不足，建议针对性地多做相关题目以巩固基础。
>
> **遇到不会的题目怎么办？** 欢迎随时在课程群内提问！
>
> **学习建议：**
>
> 1. **递归（Recursion）**  
>    是算法设计中的核心基础技能，建议优先掌握。  
>    参考资料：递归、回溯、并查集, https://github.com/GMyhf/2025fall-cs101/blob/main/20251028_ADS_week08-09_recursion_backtracking.md
>
> 2. **队列与广度优先搜索（BFS）**  
>    队列在广度优先搜索中有广泛应用。  
>    参考资料：搜索专题, https://github.com/GMyhf/2025fall-cs101/blob/main/20251125_ADS_week12_searching.md
>
> 3. **其他常用算法技巧**  
>    即使尚未系统学习，也无需担心。遇到相关问题时逐步掌握即可。常见技巧包括：
>
>    - 双指针（链表中的“快慢指针”需重点掌握）
>    - 单调栈
>    - 二分查找
>    - 并查集
>    - 滑动窗口
>    - 懒删除（Lazy Deletion）  
>
>    多数技巧通过 1～2 道典型题目即可理解其基本原理，但要熟练运用仍需持续练习。
>
>    
>

> **What is Data Structure?**
>
> 数据结构是指一种特定的存储和组织数据的方式，旨在我们的设备中高效且有效地管理和利用数据。<mark>采用数据结构的核心理念在于最小化时间和空间复杂度</mark>，即通过占用尽可能少的内存空间并以最短的时间来执行数据操作，从而实现高效的性能。
>
> **What is Algorithm?**
>
> 算法是指为了解决特定类型的问题或执行某种特定计算而设计的一系列明确定义的步骤。用更简单的话来说，算法就是一组按部就班的操作，通过这些操作来完成一项具体的任务。
>
> **How to start learning DSA?**
>
> 首先要做的是将整个学习过程分解为一系列需按顺序完成的小任务。从零开始系统地学习数据结构与算法（DSA）的过程可以分为以下四个阶段：
>
> 1. **理解时间和空间复杂度**：掌握评估算法效率的关键概念。
> 2. **学习各数据结构的基础**：熟悉不同数据结构的特点和使用场景。
> 3. **掌握算法的基础知识**：了解常用算法的工作原理及其应用。
> 4. **练习 DSA 相关的题目**：通过实践巩固所学知识，提高解决问题的能力。
>



## 1.1 数据结构

数据结构描述的是：按一定逻辑关系组织起来的数据，它们在计算机里怎么存放，以及定义在其上的运算。**三件事要分开看**——逻辑结构、存储结构、运算。



### 1.1.1 数据的逻辑结构

逻辑结构是从具体问题里抽出来的模型，**只谈「有哪些结点、结点之间是什么关系」，不谈它们占几个字节**。1.1 节经纪人之间的传播路径就是一个有向图。

从集合论的观点看，数据的逻辑结构可以用一个二元组 $B = (K, R)$ 表示：

- $K$ 是数据**结点**（node）组成的**有穷集合**，每个结点代表一个数据或一组有明确结构的数据；
- $R$ 是定义在 $K$ 上的一组**二元关系**。本书里 $R$ 一般只含一个关系 $r$，此时记作 $(K, r)$。

若 $\langle k, k' \rangle \in r$，则称 $k$ 为 $k'$ 的**前驱**，$k'$ 为 $k$ 的**后继**。没有前驱的结点叫**开始结点**，没有后继的结点叫**终止结点**。

**例：教学计划。** 每门必修课是一个结点，全部必修课组成 $K$；「必须先修」是 $K$ 上的一个关系。$\langle \text{程序设计}, \text{数据结构} \rangle$ 表示必须先上程序设计。没有先修约束的课可以并行开设。

**结点的类型。** 结点是数据结构中数据的基本单位，其类型既可以是基本数据类型（整数、实数、布尔、字符、指针），也可以是复合数据类型（数组、结构、对象），而复合类型本身又能参与定义更复杂的结点类型。数据结构课关心的是结点之间的关系，所以**通常把结点当作黑盒**。

**结构的分类**，以关系 $r$ 的性质为准：

| 结构         | 前驱                    | 后继      | 本书在哪几章                       |
| ------------ | ----------------------- | --------- | ---------------------------------- |
| **线性结构** | 至多 1 个               | 至多 1 个 | 线性表、栈、队列、串（第 2–4 章）  |
| **树形结构** | 根无前驱，其余恰好 1 个 | **不限**  | 二叉树、树、B 树（第 5、6、11 章） |
| **图结构**   | **不限**                | **不限**  | 最短路、最小生成树（第 7 章）      |

- 线性结构中存在唯一的开始结点和唯一的终止结点，其余都是既有唯一前驱、又有唯一后继的内部结点。
- 树形结构中有且仅有一个结点 $k_0$（**树根**）没有前驱；从根到任一结点 $k$ 存在唯一的结点序列 $k_0, k_1, \ldots, k_s = k$，称为一条**路径**。UNIX / DOS 的文件系统就是典型的树。
- **树 vs 图**的分界：每个结点是否**仅从属于一个直接前驱**。**线性 vs 树**的分界：每个结点是否**仅有一个直接后继**。



### 1.1.2 数据的存储结构

存储结构回答的是：同一套逻辑关系，在存储器里怎么落下来。主存按字节编址，相邻单元地址连续，**可以按地址随机访问，访问不同地址的时间基本相同**。

对逻辑结构 $(K, r)$ 而言，存储结构就是建立一种从逻辑结构到物理存储空间的**映射**：
一方面把每个结点 $k \in K$ 映射到一块唯一的连续存储区域，另一方面把每个关系元组 $\langle k_i, k_j \rangle \in r$ 映射为存储单元地址之间的关系
（顺序关系，或指针的地址指向关系）。

**同一种逻辑结构可以采用不同的映射。** 线性结构既可以顺序存储成顺序表，也可以链接存储成链表。常用的四种基本方法如下。

**1. 顺序方法。** 把一组结点存放在一片地址相邻的存储单元中，结点间的逻辑关系用存储单元的自然顺序表达。按下标访问因此是 $O(1)$；
程序设计语言里的数组就是它的实例。

顺序存储结构通常也称**紧凑存储结构**：存储空间除数据本身外没有附加信息。紧凑性用**存储密度**度量——数据本身占用的空间与整个结构（含附加信息）占用空间之比。存储密度太小的结构，空间效率就低。

部分非线性结构也能顺序存储，前提是同时存一些附加信息来表示逻辑关系：完全二叉树按层编号后，孩子下标可以用 $2i+1$、$2i+2$ 算出来。

**2. 链接方法。** 每个结点里附一个（或多个）指针域，专门存放后继的地址；结点因此分成数据域和指针域。适合经常增删、长度事先不知道的结构。代价是：**不知道指针时只能从链头一个一个比下去，按位置访问不再是 $O(1)$**。

**3. 索引方法。** 顺序存储的一种推广：造一个从整数域 $Z$ 到存储地址域 $D$ 的索引函数 $Y : Z \to D$，形成一张存了一组指针的**索引表**。
索引表的存储空间是**附加在结点存储空间之外**的。

索引的主要作用是**提高检索效率**：数据量很大时检索会涉及大量磁盘读写，先用索引确定存储地址再读写，可以大幅降低读写的数据量。

原书特意指出，索引函数一般**不是**数组那样的简单线性函数——数据结点长度不等时它就不可能是线性的。
下图画的正是这种情况：

```text
存储区的数据 —— 物理无序，而且每块长度不等
+----------------+----------+------------+--------------+--------+
| [1] 73         | [2] 52   | [3] 42     | [4] 98       | [5] 37 |
+----------------+----------+------------+--------------+--------+

线性索引 —— 附加在数据之外的一张小表
+------+------+------+------+------+
|  37  |  42  |  52  |  73  |  98  |   关键码：升序  -> 逻辑有序
+------+------+------+------+------+
| [5]  | [3]  | [2]  | [1]  | [4]  |   指向第几块：乱序 -> 物理没搬过
+------+------+------+------+------+
```

**这两行的错位就是索引的全部意义。**

- 上面一行升序，所以可以在索引里**二分**；
- 下面一行完全乱序，说明**数据一块都没有搬动过**；
- 要找关键码 52，先在索引里二分定位到第 3 列，读出 `[2]`，再直接去存储区取第 2 块——**只读了一块，没有扫过其余四块**。

再看每块的宽度：五块长度各不相同。**正因为长度不等，「第 $k$ 块在哪」就没法用「起始地址 + $k$ × 块长」算出来，只能查表**——
这才是原书说「索引函数并非数组那样的简单线性函数」的意思。

代价是索引表本身的空间。这正是**时空折衷**。

**4. 散列方法。** 索引法的延伸：不查表，而是用**散列函数**把关键码的值直接**算**成存储地址。散列函数应尽可能把地址均匀分布在散列表的地址空间上，同时计算要简单以便提速。冲突怎么处理、装载因子多高会退化。

实际应用中往往是几种方法的组合。例如树形结构的「子结点表」表示法就是顺序 + 链接。选存储方法时还要综合考虑定义在其上的运算：**要不要随机访问、会不会频繁插入、数据在内存还是外存。**



### 1.1.3 抽象数据类型

**抽象意味着同一个概念可以有多种具体实现。** 一旦抽象模型建立，同类问题便无需反复从零造轮子。

ADT 这一思想是逐步形成的：20 世纪 60 年代后期，为了将算法细节与底层数据结构隔离开来，Simula 67 引入了“类”；随后又演进出“模块”概念——**模块接口**导出外部可见的运算规范，**模块体**则封装私有数据与具体实现。唯有做到**接口与实现分离**，用户才能真正定义独立的类型，从而达成**数据抽象**与**信息隐藏**。

简而言之，ADT 是一个**「由数据及其相关操作构成的抽象模型」**：

* 它将数据与操作捆绑在一起；
* 使用方**仅能**通过公开操作访问数据，不能也不必窥探其内部表示。

面对某种结构时，我们可以先跳出“它是数组还是链表”的底层细节，转而聚焦：**它对外提供哪些操作？这些操作满足怎样的约束与契约？**

例如，最简单的 ADT 就是「整数及其加、减、乘、除运算」。



#### 形式化表示

在理论上，ADT 通常表示为三元组 $(D, R, P)$：

```text
ADT 抽象数据类型名 {
    数据对象 D：数据元素是什么（元素的集合）
    数据关系 R：数据元素之间存在什么逻辑关系
    基本操作 P：该类型对外提供哪些运算规范
}
```

* $D$ 与 $R$ 刻画了数据模型的骨干，属于**数据抽象**；
* $P$ 规定了该模型能执行的行为，属于**行为（操作）抽象**。



#### 概念层 vs 实现层

在 C++ 中，通常用**公有接口声明**来刻画 ADT 的契约，用**私有成员与函数体实现**来具体落地。

**切勿混淆两者的层次：**

* **概念层（ADT）**：关注“解决此问题需要什么数据关系与运算契约”；
* **实现层（类与存储结构）**：关注“这些数据在内存中如何布局，算法如何具体编码”。

因此，ADT 最精炼的定义莫过于：  **一种数据的逻辑结构，连同定义在该逻辑结构上的一组抽象操作。**



## 1.2 算法

算法的研究可以追溯到公元前 300 多年。算法的中文名称出自《周髀算经》，而英文名称 algorithm 则源于 9 世纪波斯数学家比阿勒·霍瓦里松的名字 al-Khwarizmi，他首先在数学上提出了算法这个概念。算法的第一次编写是 Ada Byron 于 1842 年为巴贝奇分析机编写求解伯努利方程的程序，因此 Ada Byron 被大多数人认为是世界上第一位程序员；由于查尔斯·巴贝奇（Charles Babbage）未能完成他的分析机，这个算法最终未能在机器上执行。20 世纪的英国数学家图灵（Turing）提出了著名的图灵论题，并提出一种假想的计算机的抽象模型，这个模型被称为图灵机。图灵机的出现解决了算法定义的难题，对算法的发展起到了重要的作用，使得大多数算法都可以转换成程序交给计算机执行，原来认为靠人力难以完成的算法也变得可行。由此也拉开了算法研究和实用的帷幕。

从应用范围来看，算法可分成数值算法和非数值算法两大类；从工作方式看，算法可分成串行算法和并行算法两大类。早在 20 世纪 70 年代，D. E. Knuth 就指出，计算机科学就是研究算法的学问。本书后面各章几乎都是非数值的、串行的算法。



### 1.2.1 算法的概念

简单来说，算法是对特定问题求解过程的描述，是指令的有限序列，即为解决某一特定问题而采取的具体而有限的操作步骤。程序是算法的一种实现，计算机按照程序逐步执行算法，实现对问题的求解。

求最大公因子的辗转相除法，以及求解联立线性方程组的主元素消除法，都是算法的典型例子。求解一个问题，通常用该问题的**输入数据类型**和该问题所要求解的**结果（算法的输出数据）所应遵循的性质**来描述。以求最大公因子算法为例，它的输入是整数类型，输入数据是任意给定的两个正整数 $n$ 和 $m$，而算法的输出则是既能整除 $n$ 又能整除 $m$ 的所有公因子中的最大的非负整数。对于求解联立线性方程组，它的输入数据是方程的系数矩阵和方程等式右侧的常数向量，而其输出结果数据是方程变元的一组取值，它们代入方程应该满足所给的等式。

算法一般具有以下性质。

1. **算法的通用性。** 对于那些符合输入数据类型的**任意**输入数据，都能根据算法进行问题求解，并保证计算结果的正确性。不是只对一组样例成立。
2. **算法的有效性。** 算法是有限条指令组成的指令序列，其中每一条指令都必须能够被人或机器所确切执行。指令的类型应该明确规定，仅限于若干明确无误的指令动作，是一个有限的指令集。例如辗转相除法，其基本动作（指令）只包括整数相除求余数和商数以及判断余数是否为 0 等几个指令。这些基本指令不仅能够被准确无误地执行，而且每一步的执行结果具有确定的类型。算法的有效性不仅指出了每一步指令能够被有效执行，而且也规定了指令的执行结果，其结果应具有确定的数据类型，是可预期的。
3. **算法的确定性。** 算法每执行一步之后，关于下一步怎么执行，应该有明确的指示。下一步动作可以是条件判断、分支指令、顺序执行一条指令，或者指示整个算法的结束等。算法的确定性就是要保证每一步之后都有关于下一步动作的指令，不能缺乏下一步指令（即「被锁住」状态），或仅含有模糊不清的指令。
4. **算法的有穷性。** 算法的执行必须在有限步内结束，换言之，算法不能含有死循环。注意，**算法由有限条指令所组成这一事实本身并不能保证算法执行的有穷性**：循环条件写错，有限条指令也可以转个没完。设计算法时，应该关注算法的结束条件。

总之，了解这些基本性质有助于人们更确切地理解算法的概念。



### 1.2.2 算法设计

算法设计与算法分析是计算机科学的核心问题。算法设计是求解问题时必须要考虑的，其任务是对各类具体问题设计求解的方法和过程。常用的算法设计方法如下。

| 方法                                | 要点                                                         | 在哪儿用                       |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| **穷举法**（enumeration）           | 把问题空间里的求解对象一一列举、逐一分析处理并验证。要求对象有限、有列举规则 | `switch` 就是一种穷举          |
| **回溯法**（backtrack）             | 按某种顺序逐一枚举并检验候选解。当前候选解不可能是解时**回溯**到上一步；还不够规模但其余条件都满足时**向前试探** | 深度优先搜索、背包问题（       |
| **分治法**（divide and conquer）    | 把难以直接解决的大问题分割成规模较小的子问题，各个击破，再合并出整个问题的解。**自顶向下** | 快速排序、归并排序（，二分检索 |
| **递归法**（recursion）             | 分治产生的子问题往往是原问题的较小模式，反复分治自然导致递归。**分治与递归如同一对孪生兄弟** | 同上                           |
| **贪心法**（greedy）                | 从初始状态出发，依据某种**贪心标准**做若干次贪心选择。只考虑局部最优，寄望于拼出全局最优 | Prim、Kruskal、Dijkstra        |
| **动态规划**（dynamic programming） | 也把问题分解成子问题，但**子问题不相互独立**。用一张表记录已解子问题的答案，避免大量重复计算 | Floyd、最佳二叉搜索树          |

- 全局穷举往往很费时间，但**在问题的局部采用穷举常常很有效**。
- 使用贪心法的**核心问题**是：选择一个真能产生问题最优解的最优度量标准。
- 动态规划与分治的区别就在于子问题是否独立：若子问题重叠而仍用分治，
  同一个子问题会被重复计算很多次。

可以选择和组合这些基本算法设计方法，根据问题的资源约束和要求，设计出相关数据结构和算法来求解问题。运用算法的常见方式有四种：算法的组合；经典算法的变形与推广；研究困难问题的特殊情况；探索新的算法。

> **1. 穷举法。** 穷举法也称枚举法，其基本思想是将问题空间中的所有求解对象一一列举出来，然后逐一加以分析、处理，并验证结果是否满足给定的条件。穷举完所有对象后，问题将最终得以解决。穷举法具有以下一些特点：
>
> 1. 对象应该是有限的，有明显的穷举范围；
> 2. 有穷举规则，可按某种规则列举对象；
> 3. 一时找不出解决问题的更好途径。
>
> 一般而言，对一个问题空间进行全局的穷举，往往很费时间，效率上难以满足要求，但在问题的局部采用穷举法常很有效。例如，C/C++ 语言中常用的分支语句 `switch` 就是一种穷举。
>
> **2. 回溯法。** 回溯法也称试探法，该方法的基本思想是将问题的候选解按某种顺序逐一枚举和检验，来寻找一个满足预定条件的解。当发现当前候选解不可能是解时，就退回到上一步重新选择下一个候选解；如果当前候选解还不满足问题规模要求，但是满足所有其他要求，那么继续扩大当前候选解的规模，并继续试探；如果当前候选解满足包括问题规模在内的所有要求时，该候选解就是问题的一个解。在回溯法中，放弃当前候选解、寻找下一个候选解的过程称为**回溯**；扩大当前候选解的规模、以继续试探的过程称为**向前试探**。
>
> 深度优先搜索就是典型的回溯法实例；背包问题也是。
>
> **3. 分治法和递归法。** 分治法的设计思想很朴素，其要点是在遇到一个难以直接解决的大问题时，将其分割成一些规模较小的子问题，以便各个击破、分而治之，然后把各个子问题的解合并起来，得出整个问题的解。分治法是一种**自顶向下**的设计方法。
>
> 如果原问题可分割成若干个子问题，这些子问题都可解，并且可利用这些子问题的解求出原问题的解，那么这种分治法就是可行的。由分治法产生的子问题往往是原问题的较小模式，在这种情况下，反复应用分治手段，可以使问题的规模不断缩小，最终缩小到很容易直接求出其解的规模，这自然会导致递归过程的产生。**分治与递归如同一对孪生兄弟**，经常同时应用在算法设计之中，并由此产生许多高效算法。
>
> 快速排序、归并排序，以及二分检索，都是分治法的应用实例。
>
> **4. 贪心法和动态规划法。** 贪心法的基本思路是从问题的初始状态出发，依据某种贪心标准，通过若干次的贪心选择而得出最优值（或较优解）。贪心法并不是从整体上考虑问题，它所做出的选择只是在某种意义上的局部最优解，寄希望于由局部的最优解构建最终的全局最优解。**选择能产生问题最优解的最优度量标准，是使用贪心法的核心问题。**
>
> 比贪心法更为一般的动态规划法通常也用于求解具有某种最优性质的问题。当一个问题的解可以看成一系列判定的结果时，可以利用动态规划方法设计其求解算法。在这类问题中，可能会有许多可行解，希望从中找到具有最优值的解。动态规划法与分治法类似，其基本思想也是将待求解问题分解成若干个子问题，先求解子问题，然后从这些子问题的解得到原问题的解。**与分治法不同的是**，适合于用动态规划求解的问题，经分解得到的子问题往往不是相互独立的。若用分治法来解这类问题，则分解得到的子问题数目太多，有些子问题被重复计算了很多次。如果能够保存已解决的子问题答案，而在需要时利用这些已求得的答案，就可以避免大量的重复计算，节省时间。一般用一张表来记录所有已解的子问题的答案：不管该子问题以后是否被用到，只要它被计算过，就将其结果填入表中——这就是动态规划法的基本思路。
>
> 最小生成树的 Prim 算法和 Kruskal 算法、求最短路径的 Dijkstra 算法和 Floyd 算法，其中 Floyd 算法是比较典型的动态规划，而其他 3 种算法是贪心算法。最佳二叉搜索树也是动态规划。
>



# 2 问题求解

程序是指令的组合，算法是求解过程的逻辑抽象，数据结构是数据及其关系在计算机里的反映。Wirth 的「程序 = 数据结构 + 算法」说的就是这件事。求解路径通常是：把现实问题抽象成模型，选定逻辑结构与存储方式，再设计算法并写成可运行的程序。



## 2.1 问题描述：股市的传言

若干股票经纪人之间互相传消息。谁能直接传给谁、传一次要花多久，都是已知的。

> **问**：从哪一个人开始散布消息，能让**所有人**最快都知道？

注意题面**不是**「出边最多的人」。要的是让**最后一个**收到消息的人也尽可能早收到。用五个经纪人 $\mathrm{B}_1 \ldots \mathrm{B}_5$、10 条**有向**边作为实例。方向和权都重要：$\mathrm{B}_1 \to \mathrm{B}_5$ 是 3，而 $\mathrm{B}_5 \to \mathrm{B}_1$ 是 5——同一对人，两个方向的时间不一样。

<img src="https://raw.githubusercontent.com/GMyhf/img1/main/fig-1-1.png" alt="图1.1 经纪人间的消息传递图" style="zoom:67%;" />

图 经纪人间的消息传递。顶点 $\mathrm{B}_i$ 是第 $i$ 个经纪人，有向边 $\langle \mathrm{B}_i, \mathrm{B}_j \rangle$ 表示 $i$ 能把消息直接传给 $j$，边上的数是所需时间。

| 起点   | 出边（终点 / 耗时）                 |
| ------ | ----------------------------------- |
| B1     | →B2 (8)　→B4 (4)　→B5 (3)           |
| B2     | →B5 (8)                             |
| **B3** | →B1 (6)　→B2 (7)　→B4 (10)　→B5 (2) |
| B4     | （没有出边）                        |
| B5     | →B1 (5)　→B2 (5)                    |

B3 指出四条边，是唯一能到达其余所有人的起点——但「能到达」还不等于「最快」。

> 把 B1 到 B5 看成五个顶点。一条 `Bi -> Bj` 边表示消息能从 `Bi` 直接传给 `Bj`；边权是传播时间。没有路径就记为 `∞`，表示消息永远传不到那里。B3 是唯一可以到达全部经纪人的起点。
>
> 图 经纪人间的消息传递（有向边，时间为权）：
>
> | 起点 | 终点 | 时间 |
> | ---- | ---- | ---: |
> | B1   | B4   |    4 |
> | B1   | B2   |    8 |
> | B1   | B5   |    3 |
> | B2   | B5   |    8 |
> | B3   | B1   |    6 |
> | B3   | B2   |    7 |
> | B3   | B4   |   10 |
> | B3   | B5   |    2 |
> | B5   | B1   |    5 |
> | B5   | B2   |    5 |
>
> B3 指出四条边，是唯一能到达其余所有人的起点。



## 2.2 问题分析和抽象

把五个人看成五个顶点，一条 $\mathrm{B}_i \to \mathrm{B}_j$ 边表示消息能直接传过去，边权是传播时间；没有边就记 $\infty$，表示消息永远传不到那里。

于是问题变成：**在有向带权图里找一个顶点，从它出发能以最短时间把消息送到其余所有顶点。**

两点之间可以绕道。$\mathrm{B}_5$ 到 $\mathrm{B}_4$ 没有直接边，要经 $\mathrm{B}_1$ 中转，顶点序列 $\mathrm{B}_5\mathrm{B}_1\mathrm{B}_4$ 就是一条**路径**，路径长度是各边权之和；两点之间最短的那条路径叫**最短路径**。

要算**任意两点之间**的最短路径，所以图用**相邻矩阵**存：第 $i$ 行第 $j$ 列是边 $\langle \mathrm{B}_i, \mathrm{B}_j \rangle$ 的权，没有边记 $\infty$。

|        |   B1 |   B2 |   B3 |   B4 |   B5 |
| ------ | ---: | ---: | ---: | ---: | ---: |
| **B1** |    0 |    8 |    ∞ |    4 |    3 |
| **B2** |    ∞ |    0 |    ∞ |    ∞ |    8 |
| **B3** |    6 |    7 |    0 |   10 |    2 |
| **B4** |    ∞ |    ∞ |    ∞ |    0 |    ∞ |
| **B5** |    5 |    5 |    ∞ |    ∞ |    0 |

经纪人间消息传递的相邻矩阵，**这就是算法的输入**。对角线是 0：一个人到自己不需要传播时间。

工作可以拆成三步：

1. **Floyd** 算出任意两人间的最短传播时间；
2. 对每一个候选起点，找出「从它出发到每个人的最短时间」中**最慢的一项**；
3. 从这些最大值中选**最小**的一个；某行仍有不可达的 $\infty$ 时，该起点不合格。



#### 为什么要取「最慢的一项」

假设从 B3 开始，Floyd 算出的最短传播时间为：到 B1 是 6，到 B2 是 7，到自身是 0，到 B4 是 10，到 B5 是 2。消息要「传遍所有人」，就**必须等最慢的 B4 收到**，因此 B3 的完成时间是这五个数里的**最大值 10**——不是它们的和，也不是最小值。

把每个人都当一次起点，结果如下。$\infty$ 表示至少有一人永远收不到消息，所以那一行没有可用的完成时间。

| 起点   | 到 B1 | 到 B2 | 到 B3 | 到 B4 | 到 B5 | 最慢的最短时间 | 是否可选 |
| ------ | ----: | ----: | ----: | ----: | ----: | -------------: | -------- |
| B1     |     0 |     8 |     ∞ |     4 |     3 |              ∞ | 否       |
| B2     |    13 |     0 |     ∞ |    17 |     8 |              ∞ | 否       |
| **B3** |     6 |     7 |     0 |    10 |     2 |         **10** | **是**   |
| B4     |     ∞ |     ∞ |     ∞ |     0 |     ∞ |              ∞ | 否       |
| B5     |     5 |     5 |     ∞ |     9 |     0 |              ∞ | 否       |

Floyd 算完之后的结果矩阵。**答案是 B3。**

这个目标常称为**「最小化最大距离」**：不是选离某一个人最近的起点，而是选让最后一个收到消息的人也尽可能早收到消息的起点。


#### 数据结构和算法设计

程序分成两个文件，这就是把**「怎么展示」**与**「怎么算」**分开：

- `modern.hpp` —— 只有数据和计算，不含任何输入输出；
- `demo.cpp` —— 只负责组装输入、打印结果。

#### 用起来：`demo.cpp`

```cpp
#include "modern.hpp"

#include <iostream>

int main() {
    // B1 ... B5 对应下标 0 ... 4。
    dsa::adt::RumorNetwork network(5);
    network.add_route(0, 3, 4);   // B1 -> B4，耗时 4
    network.add_route(0, 4, 3);   // B1 -> B5，耗时 3
    network.add_route(0, 1, 8);   // B1 -> B2，耗时 8
    network.add_route(1, 4, 8);   // B2 -> B5，耗时 8
    network.add_route(2, 0, 6);   // B3 -> B1，耗时 6
    network.add_route(2, 1, 7);   // B3 -> B2，耗时 7
    network.add_route(2, 3, 10);  // B3 -> B4，耗时 10
    network.add_route(2, 4, 2);   // B3 -> B5，耗时 2
    network.add_route(4, 0, 5);   // B5 -> B1，耗时 5
    network.add_route(4, 1, 5);   // B5 -> B2，耗时 5

    const auto source = network.best_source();
    if (source) {
        std::cout << "最佳传播起点是 B" << *source + 1 << '\n';
    } else {
        std::cout << "不存在能到达全部经纪人的起点\n";
    }
}
```

在仓库根目录：

```bash
c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch01/adt code/ch01/adt/demo.cpp -o /tmp/rumor-demo
/tmp/rumor-demo
```

第一行是「编译」，第二行是「运行刚刚编译出的程序」。命令逐项解释：

| 片段                 | 含义                                                         |
| -------------------- | ------------------------------------------------------------ |
| `c++`                | C++ 编译器命令。macOS 上通常指 Clang，Linux 上也可能指 GCC   |
| `-std=c++17`         | 按 C++17 语言规则编译；本书的 `std::optional` 需要它         |
| `-Wall -Wextra`      | 打开常见与额外的编译器警告（未使用变量、可疑转换等）         |
| `-Werror`            | 把警告**当作错误**；学习时可及早发现问题，初学调试可暂时去掉 |
| `-Icode/ch01/adt`    | 加一个头文件搜索目录，`#include "modern.hpp"` 才找得到       |
| `-o /tmp/rumor-demo` | 指定输出的可执行文件名                                       |

输出：

```console
最佳传播起点是 B3
```

**改一改再跑一次**是理解这段代码最快的方式：

- 删掉 B3 的一条出边（例如 `network.add_route(2, 1, 7);`），B3 就到不了 B2；此时不存在能覆盖全部顶点的起点，`best_source()` 返回空值，程序打印「不存在能到达全部经纪人的起点」。
- 把 `B3 -> B4` 的时间从 10 改成 1，答案仍是 B3，只是它的最慢传播时间从 10 缩短到 7。



> ### 实现导读
>
> 先只关注三个公开操作：构造函数建立距离矩阵，`add_route` 填入直接边，`best_source` 计算答案。`best_source` 内部复制一份矩阵，因而多次调用不会改变原始网络。下面按代码出现顺序解释。
>
> #### 预处理、头文件与命名空间
>
> `#pragma once` 告诉编译器：同一个头文件即使被间接包含多次，也只处理一次，避免类定义重复。
>
> | 头文件        | 本程序用它做什么                                             |
> | ------------- | ------------------------------------------------------------ |
> | `<cstddef>`   | 提供 `std::size_t`，表示非负的大小或下标。                   |
> | `<limits>`    | 提供 `std::numeric_limits<int>::max()`，取得 `int` 可表示的最大值。 |
> | `<optional>`  | 提供 `std::optional`，表达“可能没有答案”。                   |
> | `<stdexcept>` | 提供 `std::invalid_argument`，用于报告非法参数。             |
> | `<vector>`    | 提供动态数组 `std::vector`，这里用它保存二维距离矩阵。       |
>
> `namespace dsa::adt { ... }` 把名字放入 `dsa::adt` 命名空间。完整类名因此是`dsa::adt::RumorNetwork`，可避免项目中另一个人也定义 `RumorNetwork` 时发生重名。
> 代码块中的 `// >>> adt` 与 `// <<< adt` 只是同步标记，不参与 C++ 逻辑。
>
> #### 类、常量和构造函数
>
> `class RumorNetwork` 定义一种新类型。`public:` 以下是调用者可以使用的接口；`private:` 以下是实现细节，调用者不能直接改写。
>
> ```text
> static constexpr int infinity = std::numeric_limits<int>::max() / 4;
> ```
>
> `static` 表示 `infinity` 属于类本身，而不是每个对象各存一份；`constexpr` 表示编译期常量。`infinity` 只用来表示「两人之间没有直接路线」，并规定每条路线的时间都必须小于它。
> **最短时间是若干段之和**，可能超过 `int` 能表示的范围，所以求最短路时另用 64 位整数`distance_type`，「到不了」则用它的最大值 `unreachable` 表示，不再借用 `infinity`——否则一条总长恰好等于 `infinity` 的合法路径会被误读成「到不了」。
>
> ```text
> explicit RumorNetwork(std::size_t people)
>     : distance_(people, std::vector<int>(people, infinity)) { ... }
> ```
>
> 这是构造函数：`RumorNetwork network(5)` 会调用它。冒号后的部分叫**成员初始化列表**，先创建`distance_`，再进入花括号。它构造一个 5 行、每行 5 列的整数矩阵，初始全为 `infinity`。随后循环把对角线改为 0，因为一个人到自己不需要传播时间。矩阵的第 `from` 行、第 `to` 列总是表示从 `from` 到 `to` 的当前已知最短时间。
>
> #### 添加一条边
>
> ```text
> void add_route(std::size_t from, std::size_t to, int cost)
> ```
>
> 这三个参数分别是起点编号、终点编号和直接传播时间。第一段 `if` 检查编号是否越界、时间是否为负；不满足题目定义时抛出 `std::invalid_argument`，调用者可用 `try/catch` 处理。第二段 `if` 只在新边更短时更新矩阵，所以即使重复添加同一方向的边，也保留较小的时间。
>
> #### Floyd 三重循环
>
> `shortest` 是一个与 `distance_` 同样大小、元素为 `distance_type`（64 位整数）的矩阵：有直接路线的位置抄入路线时间，没有的位置记为 `unreachable`。
>
> 三层循环的含义不是“随便循环三次”，而是按中转站逐步扩大可用路径：
>
> ```text
> for each via:       允许路径经过 via
>   for each from:    固定起点 from
>     for each to:    固定终点 to
>       比较 原来的 from->to 与 from->via->to
> ```
>
> 条件 `shortest[from][via] != unreachable && shortest[via][to] != unreachable` 先确认两段都可达。
> 若 `from -> via -> to` 的总时间更小，就更新 `shortest[from][to]`。例如 B2 到 B4 没有直接边，但 B2→B5 是 8、B5→B1 是 5、B1→B4 是 4，所以 Floyd 最终得到 B2→B4 是 `8 + 5 + 4 = 17`。
>
> #### 从最短路矩阵选答案
>
> ```text
> std::optional<std::size_t> result;
> distance_type smallest_eccentricity = unreachable;
> ```
>
> 默认构造的 `result` 是空值，表示“还没有找到合格起点”。`smallest_eccentricity` 保存目前见过的最小完成时间。这里的 eccentricity（离心率）就是某起点到全部顶点的最短距离中的最大值。
>
> 外层循环每次处理一行，即一个候选起点；内层循环扫描该行。三目表达式
> `distance > largest_distance ? distance : largest_distance` 等价于“若新值更大就采用新值，否则保留旧值”，最终得到这行的最大值。若它比当前最佳值小，就同时更新最佳时间与 `result`。
>
> 任何一行含 `unreachable` 时，该行最大值也是 `unreachable`，不会优于有限答案；若所有行都含`unreachable`，`result` 保持为空，函数返回 `std::nullopt`。`[[nodiscard]]` 提醒编译器：调用者不应无意丢弃这个可能为空的重要返回值。
>
> #### 私有数据成员
>
> ```text
> std::vector<std::vector<int>> distance_;
> ```
>
> 外层 `vector` 是行，内层 `vector<int>` 是一行中的列，合起来是二维矩阵。末尾下划线是我们的约定，表示私有成员；它与函数参数 `distance` 或局部变量 `shortest` 不会混淆。
>
> 时间复杂度为 O(V^3)，空间复杂度为 O(V^2)。这适合顶点数较少、需要比较所有起点的示例；大图通常应根据图的稀疏度和查询需求选择其他最短路径算法。
>
> ### 现代实现
>
> ```cpp file=code/ch01/adt/modern.hpp
> #pragma once
> 
> #include <cstddef>
> #include <cstdint>
> #include <limits>
> #include <optional>
> #include <stdexcept>
> #include <vector>
> 
> namespace dsa::adt {
> 
> // >>> adt
> class RumorNetwork {
> public:
>     static constexpr int infinity = std::numeric_limits<int>::max() / 4;
>     /// 最短时间是若干段之和，可能超过 int；用 64 位，「到不了」另用 unreachable（D-039）。
>     using distance_type = std::int64_t;
>     static constexpr distance_type unreachable = std::numeric_limits<distance_type>::max();
> 
>     explicit RumorNetwork(std::size_t people)
>         : distance_(people, std::vector<int>(people, infinity)) {
>         for (std::size_t person = 0; person < people; ++person) {
>             distance_[person][person] = 0;
>         }
>     }
> 
>     void add_route(std::size_t from, std::size_t to, int cost) {
>         // cost 不小于 infinity 时，下面的 Floyd 会把这条路线当成「没有路线」，结果静默出错。
>         if (from >= distance_.size() || to >= distance_.size() || cost < 0 || cost >= infinity) {
>             throw std::invalid_argument("route");
>         }
>         if (cost < distance_[from][to]) {
>             distance_[from][to] = cost;
>         }
>     }
> 
>     [[nodiscard]] std::optional<std::size_t> best_source() const {
>         // >>> best-source-floyd
>         const std::size_t people = distance_.size();
>         std::vector<std::vector<distance_type>> shortest(
>             people, std::vector<distance_type>(people, unreachable));
>         for (std::size_t from = 0; from < people; ++from) {
>             for (std::size_t to = 0; to < people; ++to) {
>                 if (distance_[from][to] != infinity) {
>                     shortest[from][to] = distance_[from][to];
>                 }
>             }
>         }
>         for (std::size_t via = 0; via < people; ++via) {
>             for (std::size_t from = 0; from < people; ++from) {
>                 for (std::size_t to = 0; to < people; ++to) {
>                     if (shortest[from][via] != unreachable &&
>                         shortest[via][to] != unreachable &&
>                         shortest[from][to] > shortest[from][via] + shortest[via][to]) {
>                         shortest[from][to] = shortest[from][via] + shortest[via][to];
>                     }
>                 }
>             }
>         }
>         // <<< best-source-floyd
> 
>         // >>> best-source-pick
>         std::optional<std::size_t> result;
>         distance_type smallest_eccentricity = unreachable;
>         for (std::size_t from = 0; from < people; ++from) {
>             distance_type largest_distance = 0;
>             for (distance_type distance : shortest[from]) {
>                 largest_distance = distance > largest_distance ? distance : largest_distance;
>             }
>             if (largest_distance < smallest_eccentricity) {
>                 smallest_eccentricity = largest_distance;
>                 result = from;
>             }
>         }
>         return result;
>         // <<< best-source-pick
>     }
> 
> private:
>     std::vector<std::vector<int>> distance_;
> };
> // <<< adt
> 
> }  // namespace dsa::adt
> ```
>
> 





## 2.3 练习：M05443:兔子与樱花

Dijkstra, Floyd-Warshall,http://cs101.openjudge.cn/practice/05443

> 很久很久之前，森林里住着一群兔子。有一天，兔子们希望去赏樱花，但当他们到了上野公园门口却忘记了带地图。现在兔子们想求助于你来帮他们找到公园里的最短路。
>
> **输入**
>
> 输入分为三个部分。
> 第一个部分有P+1行（P<30），第一行为一个整数P，之后的P行表示上野公园的地点, 字符串长度不超过20。
> 第二个部分有Q+1行（Q<50），第一行为一个整数Q，之后的Q行每行分别为两个字符串与一个整数，表示这两点有直线的道路，并显示二者之间的矩离（单位为米）。
> 第三个部分有R+1行（R<20），第一行为一个整数R，之后的R行每行为两个字符串，表示需要求的路线。
>
> **输出**
>
> 输出有R行，分别表示每个路线最短的走法。其中两个点之间，用->(矩离)->相隔。
>
> 样例输入
>
> ```
> 6
> Ginza
> Sensouji
> Shinjukugyoen
> Uenokouen
> Yoyogikouen
> Meijishinguu
> 6
> Ginza Sensouji 80
> Shinjukugyoen Sensouji 40
> Ginza Uenokouen 35
> Uenokouen Shinjukugyoen 85
> Sensouji Meijishinguu 60
> Meijishinguu Yoyogikouen 35
> 2
> Uenokouen Yoyogikouen
> Meijishinguu Meijishinguu
> ```
>
> 样例输出
>
> ```
> Uenokouen->(35)->Ginza->(80)->Sensouji->(60)->Meijishinguu->(35)->Yoyogikouen
> Meijishinguu
> ```
>



### Floyd-Warshall. C++代码

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>

using namespace std;

const int INF = 1e9;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int P;
    if (!(cin >> P)) return 0;

    unordered_map<string, int> name2id;
    vector<string> id2name(P);
    for (int i = 0; i < P; ++i) {
        cin >> id2name[i];
        name2id[id2name[i]] = i;
    }

    vector<vector<int>> dist(P, vector<int>(P, INF));
    vector<vector<int>> direct_weight(P, vector<int>(P, INF));
    vector<vector<int>> nxt(P, vector<int>(P, -1));

    for (int i = 0; i < P; ++i) {
        dist[i][i] = 0;
        nxt[i][i] = i;
    }

    int Q;
    cin >> Q;
    for (int i = 0; i < Q; ++i) {
        string u_name, v_name;
        int w;
        cin >> u_name >> v_name >> w;
        int u = name2id[u_name];
        int v = name2id[v_name];

        if (w < dist[u][v]) {
            dist[u][v] = dist[v][u] = w;
            direct_weight[u][v] = direct_weight[v][u] = w;
            nxt[u][v] = v; // 从 u 到 v 的下一步走 v
            nxt[v][u] = u; // 从 v 到 u 的下一步走 u
        }
    }

    // Floyd-Warshall 核心三层循环
    for (int k = 0; k < P; ++k) {
        for (int i = 0; i < P; ++i) {
            for (int j = 0; j < P; ++j) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        // 从 i 到 j 的下一步，改为走从 i 到 k 的下一步
                        nxt[i][j] = nxt[i][k];
                    }
                }
            }
        }
    }

    int R;
    cin >> R;
    while (R--) {
        string s_name, e_name;
        cin >> s_name >> e_name;
        int start = name2id[s_name];
        int end = name2id[e_name];

        // 起点与终点相同
        if (start == end) {
            cout << s_name << "\n";
            continue;
        }

        // 利用 nxt 数组正向重构路径
        vector<int> path;
        int curr = start;
        path.push_back(curr);
        while (curr != end) {
            curr = nxt[curr][end];
            path.push_back(curr);
        }

        // 格式化输出
        cout << id2name[path[0]];
        for (size_t i = 0; i < path.size() - 1; ++i) {
            int u = path[i], v = path[i + 1];
            cout << "->(" << direct_weight[u][v] << ")->" << id2name[v];
        }
        cout << "\n";
    }

    return 0;
}
```



### Dijkstra. C++代码

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <algorithm>

using namespace std;

const int INF = 1e9;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int P;
    if (!(cin >> P)) return 0;

    unordered_map<string, int> name2id;
    vector<string> id2name(P);
    for (int i = 0; i < P; ++i) {
        cin >> id2name[i];
        name2id[id2name[i]] = i;
    }

    // 使用邻接矩阵存储边权（方便处理重边）
    vector<vector<int>> graph(P, vector<int>(P, INF));
    for (int i = 0; i < P; ++i) graph[i][i] = 0;

    int Q;
    cin >> Q;
    for (int i = 0; i < Q; ++i) {
        string u_name, v_name;
        int w;
        cin >> u_name >> v_name >> w;
        int u = name2id[u_name];
        int v = name2id[v_name];
        // 保留最小权重
        if (w < graph[u][v]) {
            graph[u][v] = graph[v][u] = w;
        }
    }

    int R;
    cin >> R;
    while (R--) {
        string s_name, e_name;
        cin >> s_name >> e_name;
        int start = name2id[s_name];
        int end = name2id[e_name];

        // 起点与终点相同
        if (start == end) {
            cout << s_name << "\n";
            continue;
        }

        // Dijkstra 求解
        vector<int> dist(P, INF);
        vector<int> prev(P, -1);
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

        dist[start] = 0;
        pq.push({0, start});

        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();

            if (d > dist[u]) continue;
            if (u == end) break;

            for (int v = 0; v < P; ++v) {
                if (graph[u][v] != INF && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                    prev[v] = u;
                    pq.push({dist[v], v});
                }
            }
        }

        // 从终点向前回溯路径
        vector<int> path;
        for (int curr = end; curr != -1; curr = prev[curr]) {
            path.push_back(curr);
        }
        reverse(path.begin(), path.end());

        // 格式化输出
        cout << id2name[path[0]];
        for (size_t i = 0; i < path.size() - 1; ++i) {
            int u = path[i], v = path[i + 1];
            cout << "->(" << graph[u][v] << ")->" << id2name[v];
        }
        cout << "\n";
    }

    return 0;
}
```



### Floyd-Warshall. Python代码

```python
import sys

def solve():
    input = sys.stdin.read
    data = input().split()
    if not data:
        return

    idx = 0

    # 1. 读取地点并建立双向映射
    p = int(data[idx])
    idx += 1
    name_to_id = {}
    id_to_name = []
    for i in range(p):
        name = data[idx]
        idx += 1
        name_to_id[name] = i
        id_to_name.append(name)

    # 2. 初始化距离矩阵、直连边权与路径转移矩阵
    INF = float('inf')
    dist = [[INF] * p for _ in range(p)]
    direct_weight = [[INF] * p for _ in range(p)]
    nxt = [[None] * p for _ in range(p)]

    for i in range(p):
        dist[i][i] = 0
        nxt[i][i] = i

    # 读取道路信息
    q = int(data[idx])
    idx += 1
    for _ in range(q):
        u_name = data[idx]
        v_name = data[idx + 1]
        w = int(data[idx + 2])
        idx += 3
        u, v = name_to_id[u_name], name_to_id[v_name]

        # 考虑重边情况，保留最小权重
        if w < dist[u][v]:
            dist[u][v] = dist[v][u] = w
            direct_weight[u][v] = direct_weight[v][u] = w
            nxt[u][v] = v
            nxt[v][u] = u

    # 3. Floyd-Warshall 核心算法
    for k in range(p):
        for i in range(p):
            for j in range(p):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    # 从 i 到 j 的后继节点更新为从 i 到 k 的后继节点
                    nxt[i][j] = nxt[i][k]

    # 4. 处理查询并重构路径
    r = int(data[idx])
    idx += 1
    for _ in range(r):
        start_name = data[idx]
        end_name = data[idx + 1]
        idx += 2

        start = name_to_id[start_name]
        end = name_to_id[end_name]

        # 起点与终点相同
        if start == end:
            print(start_name)
            continue

        # 沿着 nxt 数组重构路径序列
        path = [start]
        curr = start
        while curr != end:
            curr = nxt[curr][end]
            path.append(curr)

        # 格式化拼接输出
        res = [id_to_name[path[0]]]
        for i in range(len(path) - 1):
            u, v = path[i], path[i + 1]
            w = direct_weight[u][v]
            res.append(f"->({w})->{id_to_name[v]}")

        print("".join(res))

if __name__ == '__main__':
    solve()
```



### Dijkstra. Python代码

```python
import sys
import heapq

def solve():
    input = sys.stdin.read
    data = input().split()
    if not data:
        return

    idx = 0

    # 1. 读取地点信息
    p = int(data[idx])
    idx += 1
    name_to_id = {}
    id_to_name = []
    for i in range(p):
        name = data[idx]
        idx += 1
        name_to_id[name] = i
        id_to_name.append(name)

    # 2. 读取道路信息（邻接矩阵/邻接表）
    q = int(data[idx])
    idx += 1
    # 用字典存储邻接关系，处理可能的重边
    graph = [{} for _ in range(p)]
    for _ in range(q):
        u_name = data[idx]
        v_name = data[idx + 1]
        dist = int(data[idx + 2])
        idx += 3
        u, v = name_to_id[u_name], name_to_id[v_name]
        # 若有重边，保留距离较小者
        if v not in graph[u] or dist < graph[u][v]:
            graph[u][v] = dist
            graph[v][u] = dist

    # 3. 读取查询并求解
    r = int(data[idx])
    idx += 1
    for _ in range(r):
        start_name = data[idx]
        end_name = data[idx + 1]
        idx += 2

        start = name_to_id[start_name]
        end = name_to_id[end_name]

        # 起点和终点相同的情况
        if start == end:
            print(start_name)
            continue

        # Dijkstra 算法
        dist = [float('inf')] * p
        prev = [-1] * p
        dist[start] = 0
        pq = [(0, start)]

        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            if u == end:
                break
            for v, weight in graph[u].items():
                if dist[u] + weight < dist[v]:
                    dist[v] = dist[u] + weight
                    prev[v] = u
                    heapq.heappush(pq, (dist[v], v))

        # 回溯路径
        path = []
        curr = end
        while curr != -1:
            path.append(curr)
            curr = prev[curr]
        path.reverse()

        # 拼接输出字符串
        res_parts = [id_to_name[path[0]]]
        for i in range(len(path) - 1):
            u, v = path[i], path[i + 1]
            w = graph[u][v]
            res_parts.append(f"->({w})->{id_to_name[v]}")

        print("".join(res_parts))

if __name__ == '__main__':
    solve()
```





# 3 算法分析

一般而言，同一类问题总是存在着多种解决方案，即针对一个问题可以有多个算法。这些算法也许各有其优缺点以及适用的场景。那么如何在多个算法中按照某种原则进行取舍？这就需要用到算法分析技术来评价算法的效率。

算法分析的任务是利用数学工具，对每一个具体算法讨论其各种复杂度，以探讨某种具体算法适用于哪类问题，或某类问题宜采用哪种算法。其目的在于从解决同一问题的不同算法中选择出比较合适的一种，或者是对原有的算法进行改造、加工，使其更优。

为比较不同算法的效率，Juris Hartmanis 和 Richard E. Stearns 提出了一种称为计算复杂性（computational complexity）的方法来度量算法的难度。计算复杂性分析显示了实施一个算法所需的努力或代价。对于一个算法而言，其复杂性的高低体现在运行该算法所需要的计算机资源的多少上：所需的资源越多，表明该算法的复杂性越高；反之越低。计算机资源中最重要的是时间资源（即处理器）和空间资源（即存储器），因而算法的复杂性通常体现为时间复杂性和空间复杂性两个指标。本书后文说的「时间代价」「空间代价」，指的就是这两项。（这两个人名在原书里印作 “Juris Hartmanishe” 与 “Richars E. Stearns”，此处按学界通行拼法更正。）

不言而喻，对于任意给定的问题，设计出复杂性尽可能低的算法是人们追求的一个重要目标；另一方面，当给定的问题已有多种算法时，选择其中复杂性最低者，也是选用算法时应遵循的一个重要准则。因此，复杂性分析对算法的设计或选用有着重要的指导意义和实用价值。

对于算法的复杂性，首先需要明确两个问题：

1. 怎样**表达**一个算法的复杂性；
2. 怎样**计算**一个算法的复杂性。

影响程序运行时间的因素有很多。一个运行在 Cray 巨型机上的算法，放在 PC 上肯定会慢很多；反过来，一个效率较差的算法运行在 Cray 上，也可能比一个效率极好的算法运行在 PC 上还要快许多。即使运行在同样的机器上，所采用的程序语言不同，运行时间也可能不同：采用编译型的语言往往要比解释型的语言快许多——原书举的例子是，采用 C 语言编写的程序，比用 LISP 语言编写的、采用同样算法的程序快将近 20 倍。

综上所述，评估算法的效率不能采用诸如微秒、纳秒这样的真实时间单位。对算法分析来说，最重要的不是具体的运行时间，而是**算法与输入规模之间的关系**：用一定「规模（size）」的数据作为输入时，程序运行所需的「基本操作（basic operation）」数来描述时间效率。例如，如果数据规模 $n$ 和运行时间 $t$ 之间存在线性关系 $t_1 = cn_1$，那么数据规模增加到原来的 5 倍后，运行时间也相应地增加同样的倍数，即 $n_2 = 5n_1$，则 $t_2 = 5t_1$。同理，如果 $t_1 = \log_2 n$，则规模加倍只意味着时间增加一个单位：$n_2 = 2n$ 时 $t_2 = \log_2(2n) = \log_2 n + 1 = t_1 + 1$。

此处「规模」和「基本操作」的关系视具体的算法而定。「规模」一般指输入量的数目，例如在排序问题中，问题的规模即为待排序元素的个数；而完成一个「基本操作」所需的时间应该与被操作的具体数值无关，例如两个整数相加的操作时间，与这两个整数的具体取值没有关系。

## 3.1 渐进分析方法

一般情况下，用来表示数据规模和时间关系的函数都相当复杂。计算这样的函数时通常只考虑大的数据，而那些不能显著改变函数量级的部分都可以忽略掉；其结果是原函数的一个近似值，这个近似值在数据规模很大时会足够接近原值。这种方法称为渐进算法分析（asymptotic algorithm analysis）方法，简称渐进分析。例如下面这个函数：

$$f(n) = n^2 + 100n + \log_{10} n + 1000$$

在 $n$ 的取值很小时，例如为 1 时，最后的常数项 1000 对函数值的贡献最大；当 $n = 10$ 时，第 2 项（$100n$）和最后的 1000 具有相同的贡献；当 $n$ 达到 100 时，前两项的贡献相同；但当 $n$ 大于 100 后，第 2 项的贡献就小于第 1 项，而且 $n$ 越大，第 2 项对函数值而言就越微不足道。由于第 1 项是二次增长的，当 $n$ 取值很大时，函数的取值主要依赖于第 1 项的贡献。

渐进分析是对资源开销的一种不精确的估计，它提供的是对算法所需资源开销进行评估的简化模型，以便把注意力集中在最重要的部分。应该注意的是，**并非任何情况下都可以忽略常数部分**：当算法要解决的问题规模很小时，各项系数和常数项就会起到举足轻重的作用，如同上面的函数所示。因此，用于上万个数的排序算法，也许并不适用于仅对 10 个数的排序。

**大 O 表示法。** 渐进分析最常用的表示方法是估计函数的增长趋势，采用由 Paul Bachmann 于 1894 年引入的大 $O$ 表示法。设 $f$ 和 $g$ 为从自然数到非负实数集的两个函数。

> **定义 1**　如果存在正数 $c$ 和 $N$，使得对任意的 $n \ge N$，都有 $f(n) \le c\,g(n)$，则称 $f(n)$ 在集合 $O(g(n))$ 中，或简称 $f(n)$ 是 $O(g(n))$ 的。

该定义说明了函数 $f$ 和 $g$ 之间的关系：既可以表达成函数 $g(n)$ 是函数 $f(n)$ 取值的上限（upper bound），也可以说函数 $f$ 的增长最终至多趋同于 $g$ 的增长。

因此，大 $O$ 表示法提供了一种表达函数增长率上限的方法。换言之，若某种算法在 $O(g(n))$ 中，只是表明了该算法**最多会差到何种程度**。当然，一个函数增长率的上限可能不止一个：一个在集合 $O(n)$ 中的函数也一定在 $O(n^2)$ 中，同时也在 $O(n^3)$ 中。大 $O$ 表示法给出的是所有上限中最小的那个上限。

下面列出大 $O$ 表示法的一些有益特性，可在计算算法效率时使用（其中 $a$ 表示不依赖于 $n$ 的任意常数）：

1. 如果 $f(n)$ 是 $O(g(n))$ 的，$g(n)$ 是 $O(h(n))$ 的，则 $f(n)$ 是 $O(h(n))$ 的；
2. 如果 $f(n)$ 是 $O(h(n))$ 的，$g(n)$ 是 $O(h(n))$ 的，则 $f(n) + g(n)$ 是 $O(h(n))$ 的；
3. 函数 $an^k$ 是 $O(n^k)$ 的；
4. 若 $f(n) = c\,g(n)$，则 $f(n)$ 是 $O(g(n))$ 的；
5. 对于任何正数 $a$ 和 $b$（$b \ne 1$），函数 $\log_a n$ 是 $O(\log_b n)$ 的——即任何对数函数无论底数为何值，都具有相同的增长率；
6. 对任何正数 $a \ne 1$，都有 $\log_a n$ 是 $O(\log_2 n)$ 的。本书把 $\log_2 n$ 简写为 $\log n$。

常见的上限 $g(n)$ 有以下若干种（$\mathrm{rate}_{n \to \infty} f(n)$ 表示 $n$ 趋于无限大时函数 $f(n)$ 的增长率）：

| $g(n)$    | 名称                   | 原书给的例子                                                 |
| --------- | ---------------------- | ------------------------------------------------------------ |
| $1$       | 常数函数               | 不依赖于数据规模 $n$                                         |
| $\log n$  | 对数函数               | 比线性函数 $n$ 增长慢                                        |
| $n$       | 线性增长               | $\mathrm{rate}(n \text{ 个 } a \text{ 相加}) = \mathrm{rate}(n \times a) = O(n)$ |
| $n\log n$ | 阶数低于二阶、高于一阶 | $\mathrm{rate}\sum_{i=1}^{\log n}\sum_{j=1}^{n} a = O(n\log n)$，一般出现在树形结构的算法中 |
| $n^2$     | 二阶增长               | $\mathrm{rate}(1 + 2 + \cdots + n) = \mathrm{rate}(n(n+1)/2) = O(n^2)$ |
| $a^n$     | 指数增长               | 往往出现在递归定义的函数计算中                               |

值得注意的是，指数增长的渐进式比任何高次的多项式函数（如 $n^3$、$n^4$）都增长得更快。

这些渐进式的函数曲线，在 $n$ 很大的时候其大小差别非常大。令时间单位为 $1\,\mu\mathrm{s}$，在 $n$ 等于 1000 时：线性增长率 $T(n) = n$ 为 $1000\,\mu\mathrm{s}$，即 1 ms；二次增长率 $T(n) = n^2$ 的时间开销是 $10^6\,\mu\mathrm{s}$，即 1 s；三次增长率 $T(n) = n^3$ 的时间开销就是 1000 s（约 16 分钟）；而指数型的增长率 $T(n) = 2^n$ 所花费的时间约为 $10^{286}$ 年，迄今地球的年龄还不超过 $10^{10}$ 年。具有指数增长率的算法简称指数爆炸型算法，应用时需要谨慎。

原书用表 1.2 把这些量级换算成现实世界里的速度，好让「差一个数量级」有一个能感知的尺度：

表 1.2　各个量级的实例

| m/s        | 英制度量衡    | 现实世界的例子           |
| ---------- | ------------- | ------------------------ |
| $10^{-11}$ | 1.2 英寸/世纪 | 钟乳石的生长速度         |
| $10^{-10}$ | 1.2 英寸/十年 | 大陆板块的漂移速度       |
| $10^{-9}$  | 1.2 英寸/年   | 指甲的生长速度           |
| $10^{-8}$  | 1 英尺/年     | 头发的生长速度           |
| $10^{-7}$  | 1 英尺/月     | 杂草的生长速度           |
| $10^{-6}$  | 3.4 英寸/天   | 冰河的流动速度           |
| $10^{-5}$  | 1.4 英寸/时   | 表的分针转动速度         |
| $10^{-4}$  | 1.2 英尺/时   | 胃肠的蠕动速度           |
| $10^{-3}$  | 2 英寸/分     | 蜗牛的速度               |
| $10^{-2}$  | 2 英尺/分     | 蚂蚁的速度               |
| $10^{-1}$  | 20 英尺/分    | 巨龟的速度               |
| $1$        | 2.2 英里/时   | 人类的散步速度           |
| $10^{1}$   | 22 英里/时    | 人类疾跑速度             |
| $10^{2}$   | 220 英里/时   | 螺旋桨飞机的速度         |
| $10^{3}$   | 37 英里/分    | 喷气式飞机的速度         |
| $10^{4}$   | 370 英里/分   | 宇宙飞船的速度           |
| $10^{5}$   | 3700 英里/分  | 流星撞击地球的速度       |
| $10^{6}$   | 620 英里/秒   | 地球自转速度             |
| $10^{7}$   | 6200 英里/秒  | 卫星从洛杉矶到纽约的速度 |
| $10^{8}$   | 62000 英里/秒 | 光速的三分之一           |

图 1.5 把常用函数的增长趋势画在一起——$n$ 稍大，曲线之间就拉开天文数字的差距：

<img src="https://raw.githubusercontent.com/GMyhf/img1/main/fig-1-5.png" alt="图 1.5 常用函数的增长趋势" style="zoom:67%;" />

图 1.5　常用函数的增长趋势。

同一组 $n$ 用数字排出来是这样：

| 阶        | $n=16$ | $n=256$ | 直觉        |
| --------- | -----: | ------: | ----------- |
| $1$       |      1 |       1 | 常数        |
| $\log n$  |      4 |       8 | 二分        |
| $n$       |     16 |     256 | 扫一遍      |
| $n\log n$ |     64 |    2048 | 快排 / 归并 |
| $n^2$     |    256 |   65536 | 双重循环    |
| $2^n$     |  65536 |       — | 穷举子集    |

**$\Omega$ 表示法。** 大 $O$ 表示法给出了函数增值率的上限。与此相对，还有 $\Omega$ 表示法（读做「欧米伽」）：

> **定义 2**　如果存在正数 $c$ 和 $N$，使得对所有的 $n \ge N$，都有 $f(n) \ge c\,g(n)$，则称 $f(n)$ 在集合 $\Omega(g(n))$ 中，或简称 $f(n)$ 是 $\Omega(g(n))$ 的。

此定义说明了 $c\,g(n)$ 是函数 $f(n)$ 取值的下限（lower bound），也可以说函数 $f(n)$ 的增长最终至少是趋同于函数 $g(n)$ 的增长。大 $O$ 表示法和 $\Omega$ 表示法的唯一区别在于不等式的方向不同；正如大 $O$ 取的是所有上限中最小的那个，$\Omega$ 取的是所有下限中**最大**的那个。

**$\Theta$ 表示法。** 大 $O$ 和 $\Omega$ 描述了某一函数增长的上限和下限。当上、下限相同时，则可用 $\Theta$（读做「希塔」）表示法：如果一个函数既在集合 $O(g(n))$ 中，又在集合 $\Omega(g(n))$ 中，则称其为 $\Theta(g(n))$。即存在正常数 $c_1$、$c_2$ 以及正整数 $N$，使得对于任意的正整数 $n > N$，下列两不等式同时成立：

$$c_1 g(n) \le f(n) \le c_2 g(n)$$

此定义具体给出了下限估计和上限估计两种估计式。例如 $f(n) = 100 \times n^2 + 5 \times n + 500$，令 $g(n) = n^2$，此时存在常数 $c_1 = 100$、$c_2 = 105$、$N = 10$，当 $n > N$ 时上式成立，因此可以说 $f(n)$ 为 $\Theta(n^2)$。

**渐进分析的实例。** 通过对算法所需的时间和空间代价的估算，渐进分析方法可以衡量算法的复杂度。实际上，大多数情况下，算法的时间复杂度是根据算法执行过程中需要实施的赋值、比较等基本运算数目的多少来衡量的。

先从一个简单的例子开始分析。下面是一段对数组中的各个元素求和的代码：

```text
for (i = sum = 0; i < n; i++)
    sum += a[i];
```

其中主要的操作为赋值运算，因此该算法的时间代价主要体现在赋值操作的数目上。在循环开始之前有两次赋值，分别对 `i` 和 `sum` 进行；循环进行了 $n$ 次，每次循环中执行两次赋值，分别对 `sum` 和 `i` 进行更新操作。总共有 $2 + 2n$ 次赋值操作，其渐进复杂度为 $O(n)$。

在循环中嵌套循环，其复杂度会相应增大。例如下面这段代码依次求出给定数组的所有子数组中各元素之和：

```text
for (i = 0; i < n; i++) {
    for (j = 1, sum = a[0]; j <= i; j++)
        sum += a[j];
    cout << "sum for subarray 0 through " << i << " is " << sum << endl;
}
```

循环开始前有一次对 `i` 的赋值操作。之后，外层循环共进行 $n$ 次，每个循环中包含一个内层循环以及对 `i`、`j`、`sum` 分别进行赋值的操作；每个内层循环执行 2 个赋值操作（分别更新 `sum` 和 `j`），共执行 $i$ 次（$i = 1, 2, \cdots, n-1$）。因此，整个程序总共执行的赋值操作为

$$1 + 3n + \sum_{i=1}^{n-1} 2i = 1 + 3n + 2(1 + 2 + \cdots + n - 1) = 1 + 3n + n(n-1) = O(n) + O(n^2) = O(n^2)$$

一般情况下，循环中嵌套循环会增加算法的复杂度，但也并非总是如此。例如在上面的实例中，如果只对每个子数组的前 5 个元素求和，则相应的代码可采用下面的方式：

```text
for (i = 4; i < n; i++)
    for (j = i - 3, sum = a[i - 4]; j <= i; j++)
        sum += a[j];
```

此时，外层循环进行 $n - 4$ 次。对每个 $i$ 而言，内层循环只执行 4 次，每次的操作次数与 $i$ 的大小无关：8 次赋值操作。外加对 `i` 的初始化，整个代码总共进行 $O(1) + 8(n - 4) = O(n)$ 次赋值操作。**尽管存在嵌套循环，但算法的整体时间复杂度依然呈线性增长。**

另外，对于排序算法而言，其主要时间开销体现在比较和交换（或移动）等操作上，具体可参考第 8 章的各算法分析。

## 3.2 最佳、最差和平均情况

对于某些算法，即使问题规模相同，如果输入数据不同，其时间复杂度也不同。换言之，算法的渐进分析往往无法独立于输入数据的状态而进行。这是因为算法实际执行的操作往往依赖于算法中分支条件的走向，而这些分支走向又取决于输入数据的取值。为此，对算法进行渐进分析时会根据输入数据的取值分情况进行，以便确切了解各种算法所适用的情况，以及能否在规定的响应时间内完成。

例如，求一个数组的所有有序子数组中最长的一个。在数组 $[1, 8, 1, 2, 5, 0, 11, 9]$ 中，这个最长的有序子数组为 $[1, 2, 5]$，长度为 3。可用以下代码实现：

```text
for (i = 0, length = 1; i < n - 1; i++) {
    for (j1 = j2 = k = i; k < n - 1 && a[k] < a[k + 1]; k++, j2++);
    if (length < j2 - j1 - 1)
        length = j2 - j1 + 1;
}
```

上面这段是原书印出来的样子，**照抄它会算错**：内层循环走完后这一段升序的长度是 `j2 - j1 + 1`，而判断条件写的却是 `length < j2 - j1 - 1`，两处的常数项差了 2。用原书自己的例子 $[1, 8, 1, 2, 5, 0, 11, 9]$ 跑一遍，答案会是 2 而不是 3。这里保留原样是为了让读者对照纸书，分析长度时按 `j2 - j1 + 1` 读。

这段代码的时间代价和数组 `a` 中元素的实际取值状态相关。根据这些元素的初始状态可以分成以下几种情况：

1. 如果数组 `a` 的所有元素是以**降序**方式输入的，那么外层循环执行 $n-1$ 次，每次内层循环只执行 1 次，整个时间开销为 $O(n)$。
2. 如果数组 `a` 的所有元素是以**升序**方式输入的，那么外层循环执行 $n-1$ 次，对每个 $i$（$i = 0, 1, \cdots, n-1$），内层循环需要执行 $(n - 1 - i)$ 次，整个时间开销为 $O(n^2)$。
3. 在大多数情况（即**平均情况**）下，数组的元素是无序的，既不按升序也不按降序输入。

一般而言，计算平均情况的复杂度应该考虑算法的所有输入情况，确定针对每种输入情况算法所需的操作数目。在简单情况下，如果每种输入出现的概率相同，可把针对每种输入的操作数目依次相加，再除以输入的总数目，来得到平均的开销。但是，每种输入的出现概率并非总是相同，此时分析平均情况的复杂度就需要把每种输入出现的概率作为权值加以考虑，即

$$C_{\mathrm{avg}} = \sum_{i} p(\mathrm{input}_i)\,\mathrm{steps}(\mathrm{input}_i)$$

此处假设可以事先得知输入的概率分布情况。$p(\mathrm{input}_i)$ 为第 $i$ 种输入的出现概率，$\mathrm{steps}(\mathrm{input}_i)$ 为算法处理第 $i$ 种输入时所需的操作或步骤数。所有的概率均为非负数，且满足 $\sum_i p(\mathrm{input}_i) = 1$。

尽管平均情况的复杂度是算法在输入规模为 $n$ 时的典型表现，但平均情况的分析并不总是可行的，因为这需要了解算法的实际输入在所有可能的输入集合中的分布状况。例如上面例子中获取数组元素的平均分布情况就并不很容易。

以从一个规模为 $n$ 的一维数组中找出一个给定的 $K$ 值为例（假设该数组中有且仅有一个元素的值为 $K$），顺序检索法将从第一个元素开始，依次检查每一个元素，直到找到 $K$ 为止。

- **最佳情况**下，数组中第 1 个元素就是 $K$，此时只要检查一个元素即可。
- **最差情况**下，$K$ 是数组的最后一个元素，此时算法需要检查数组中所有的 $n$ 个元素才能找到。
- **平均情况**下，如果 $K$ 出现在数组中每个位置上的概率相等，即出现在每个单元中的概率均为 $1/n$，平均需要 $\frac{1 + 2 + \cdots + n}{n} = \frac{n+1}{2}$ 次比较才能找到。

概率不相等时，结论会明显改变。例如出现在第 1 个位置的概率为 $1/2$，第 2 个位置上的概率为 $1/4$，而出现在其他位置的概率相等，即为 $\frac{1 - 1/2 - 1/4}{n - 2} = \frac{1}{4(n-2)}$，则查找 $K$ 平均需要

$$\frac{1}{2} + \frac{2}{4} + \frac{3 + \cdots + n}{4(n-2)} = 1 + \frac{n(n+1) - 6}{8(n-2)} = 1 + \frac{n+3}{8}$$

次比较，比等概率的 $\frac{n+1}{2}$ 快将近 4 倍。

由此可见，第 1 种情况是最佳的，所需的步骤最少；第 2 种情况所需的步骤最多，是最差的情形；第 3 种则介于最佳和最差之间。那么分析一种算法时，应该研究最佳、最差还是平均情况？

一般而言，**最佳情况发生的概率太小**，并不能作为算法性能的代表，但它可以帮助算法设计者或使用者了解某个算法在何种情况下适用。而**最差情况可以让人了解一个算法至少能做多快**，这一点在实时系统中尤其重要：例如在空运处理系统中，一个绝大部分情况下能管理 $n$ 架飞机的算法，如果不能在规定时间内管理 $n$ 架飞机，则该算法是不可接受的。此外，对于多数算法而言，最坏情况和平均情况的时间开销公式虽然不同，但往往只是常数因子大小的区别，或者常数项大小的区别。

上面 3 种情况的复杂度都相对比较简单，可以得到很精确的函数关系，但复杂度与数据规模之间的关系并非总是一目了然。尤其是平均情况的复杂性分析往往需要复杂的计算，此时前面介绍的大 $O$、$\Omega$ 和 $\Theta$ 等渐进分析法便可以派上用场。

只报一个数字、不说针对哪种输入，这个数字就没有意义。本书后面每讲一个算法，都会分别交代它的最佳、最差与平均情况——例如第 8 章的快速排序平均是 $O(n\log n)$，而输入已经有序时退化成 $O(n^2)$。

## 3.3 时间和空间的折衷

对于空间开销，也可以采用类似的渐进分析方法。但是，很多常见算法所使用的数据结构是**静态的存储结构**：所谓静态，是指算法所使用的存储空间在算法执行过程中并不发生变化。一旦确定了输入数据和问题规模，其数据结构大小也就确定下来。对于这种静态数据结构，空间开销的估算比较容易，往往与所涉及的问题规模成正比（空间开销为线性增长），或者不随问题的规模而增大（空间开销为常数）。本书后续章节对这类使用静态数据结构的算法，一般将仅限于讨论其时间代价。

当然，也经常会遇到一些使用**动态数据结构**的算法，它们的存储空间是变化的，在算法运行过程中有时会有数量级的增大或缩小。对于这种情况，空间开销的分析和估计是十分必要的。

在算法设计分析中，还涉及一个「时空资源的折衷原理」。这个原理可以简述如下：对于同一个问题求解，一般会存在多种算法，而这些算法在时间和空间开销上的优劣往往表现出「时空折衷」的性质。所谓时空折衷是指，为了改善一个算法的时间开销，往往可以增大空间开销为代价；反之亦然。

例如，为了从公司黄页数据表中快速查询公司电话（假设每个公司的名称、地址和电话都存储在该数据表中），可以附加一个散列式索引表，其散列函数可以将公司名称快速变换为索引值，通过这个索引值可以读出一个指针，指向存储该公司电话的存储单元。这种散列法附加了索引表的空间开销，但节省了时间：用散列函数的简单计算代替了原本耗时的在黄页中逐项进行公司名称的比较操作，时间开销从线性增长改善为常数时间，而空间开销方面则增添了一个线性增长率的存储空间。在设计算法时经常采用这种以空间开销换取时间开销的办法；为此，就需要对原有存储结构做出修改，或者想出全新的、更适合逻辑数据结构使用的存储方案。

当然，有时也可以牺牲计算机的运行时间，通过增大时间开销来换取存储空间的节省，例如树的顺序存储。第 6.3 节把一棵树压成一串「带右链」「带度数」的序列，省下了全部指针域的空间，代价是恢复结构时必须重新扫描一遍；第 12 章的稀疏矩阵、Huffman 编码也都是同一个取舍的不同侧面。**没有免费的加速：空间紧、时间松，和空间松、时间紧，选的结构会不一样。**

## 3.4 求解问题时数据结构的选择和评价

利用计算机求解一个给定问题时，一个关键任务是确立问题模型所采用的数据结构。一旦确定了数据结构，算法的设计便水到渠成。

根据应用的具体情况，设计或选择数据结构可以遵循以下一些原则：

1. 仔细分析所要解决的问题，特别是求解问题所涉及的数据类型和数据间的逻辑关系。
2. 在算法设计之前往往先进行数据结构的初步设计。
3. 注意数据结构的**可扩展性**，包括考虑当输入数据的规模发生改变时，数据结构是否能够适应。同时，数据结构应该适应求解问题的演变和扩展。
4. 数据结构的设计和选择也要比较算法的时空开销的优劣。

数据结构的选择和评价是复杂的，需要考虑的因素也不限于上述几条，一般要具体情况具体分析。针对具体的问题进一步阐述和检验这些原则。

落到例子上：2.1 节要的是任意两点之间的最短路径，并且只有五个经纪人，所以相邻矩阵加 Floyd 是合适的——实现简单，三重循环在 $n=5$ 时可以忽略。如果顶点很多、边很少，而且只问单源最短路，就应该换成邻接表加 Dijkstra。



# 附录

云计算实验平台，https://clab.pku.edu.cn，https://xlab.pku.edu.cn/



OpenJudge 评测平台, http://cs101.openjudge.cn，

​	OJ 提交看不到出错的测试数据，可以在 https://jensen.taildf6cf3.ts.net  看到。

力扣平台：https://leetcode.cn

Codeforces平台：https://codeforces.com/



C++复健：《算法笔记》配套编程题目，晴问网站，https://sunnywhy.com  点“算法笔记”。

Pythno3 复健：https://www.runoob.com/python3/python3-tutorial.html



