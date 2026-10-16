# DSA 字符串

*Updated 2026-10-16 GMT+8*
 *Compiled by Hongfei Yan (2026 Fall)*
https://github.com/GMyhf/dsa-modernization

**知识点**：串、子串与真子串；字符串与线性表的两点区别；字符编码 ASCII → UNICODE / UTF-8，`char` ≠ 字符；
编码顺序与字典序，两个字面量之间的 `<` 比的是地址；顺序存储与 `'\0'`、标准串函数；
教学版 `String`：三法则与变长存储管理，`append` / `substr` / `find` / `compare`；
朴素模式匹配与目标的回溯；特征向量 `next`（优化版）与 lps 表；KMP 与线性论证；用失效函数求最小循环节。

> 本章要回答三个问题
>
> 1. **字符串和普通线性表差在哪？** 元素限定为字符集；操作以「串的整体」为对象。而且 `char` 是一个字节，不等于一个字符。
> 2. **长度一直在变，缓冲区归谁管？** 顺序存放、交给类去管：构造申请、析构释放、拷贝另开一份。
> 3. **在 30 亿个字符里找模式，怎么找得动？** 朴素匹配失配只右移一位；KMP 预先算 `next`，不重复比较已知相等的前缀。
>
> 一句话概括：**存串的类管容量与所有权；找串的算法管比较顺序——KMP 让目标下标只增不减。**



**先跑一遍**

```cpp file=code/ch04/string_class/demo.cpp
// 第 4 章「先跑一遍」：用教学版 String 走一遍 append / substr / find。
// 编译运行：
//   g++ -std=c++17 -I code/ch04/string_class code/ch04/string_class/demo.cpp -o demo && ./demo
#include "teaching.hpp"

#include <iostream>

int main() {
    String text = "Hello";                       // 隐式转换：String(const char*)
    text.append(' ').append('C').append('+').append('+');
    std::cout << "拼接后: " << text.c_str() << '\n';

    const String slice = text.substr(6, 3);
    std::cout << "子串: " << slice.c_str() << '\n';

    // find 返回 optional：有值才解引用
    std::cout << "首次出现 C 的下标: ";
    if (const auto found = text.find('C')) {
        std::cout << *found << '\n';
    } else {
        std::cout << "无\n";
    }
}
```

```bash
c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch04/string_class \
    code/ch04/string_class/demo.cpp -o /tmp/str-demo
/tmp/str-demo
```

```console
拼接后: Hello C++
子串: C++
首次出现 C 的下标: 6
```

`String` 的缓冲区仍是手写的 `char*`：第 2 节要讲的正是变长串的分配、`'\0'` 结尾和深复制，若内部直接用 `std::string`，这些都被标准库藏起来了。`append` 返回 `String&`，所以能连着写；`find` 找不到时返回空 optional，不用 `-1` 和位置 0 抢同一个数字。

图 4.12 自己的那对串，原书两个匹配算法都返回 11，正确答案是 10：

```cpp file=code/ch04/pattern_matching/demo.cpp
#include "modern.hpp"

#include <iostream>

int main() {
    const char* text = "abcddabcababcdaabcababcdaabcabaa";
    const char* pattern = "abcdaabcab";
    const auto naive = dsa::naive_search(text, pattern);
    const auto kmp = dsa::kmp_search(text, pattern);
    std::cout << "图4.12 的串，正确起始下标是 10\n";
    std::cout << "朴素: " << (naive ? static_cast<long>(*naive) : -1) << '\n';
    std::cout << "KMP:  " << (kmp ? static_cast<long>(*kmp) : -1) << '\n';
    std::cout << "原书返回 11，一律差 1\n";
}
```

```bash
c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch04/pattern_matching \
    code/ch04/pattern_matching/demo.cpp -o /tmp/kmp-demo
/tmp/kmp-demo
```

```console
图4.12 的串，正确起始下标是 10
朴素: 10
KMP:  10
原书返回 11，一律差 1
```



# 1 字符串的基本概念

**字符串**（string）是组成元素（结点）为单个字符的线性表，简称「串」。一个字符串可以是一个单词、一个句子、一篇文章，或者一个文件的内容。串中所包含的字符个数称为**串的长度**；长度为零的串称为**空串**，不包含任何字符内容。

尽管字符串是一种特殊的线性表，但其逻辑结构与线性表相比存在两点区别：

1. 字符串的数据对象约束为**字符集**；
2. 线性表的基本操作大多以「单个元素」为操作对象，而字符串的基本操作通常以「**串的整体**」作为操作对象——拼接、复制、抽取子串、模式匹配，动的都是一整段。

**子串。** 设 $s_1 = a_0a_1a_2\cdots a_{n-1}$、$s_2 = b_0b_1b_2\cdots b_{m-1}$（$0 \le m \le n$）是两个字符串，$a_i$ 和 $b_j$ 均为字符集中的字符。如果存在整数 $i$（$0 \le i \le n-m$），使得对任意 $j = 0, 1, \cdots, m-1$ 都有 $b_j = a_{i+j}$ 同时成立，则称字符串 $s_2$ 是 $s_1$ 的**子串**，或称 $s_1$ 包含 $s_2$。

- 空字符串是所有字符串的子串；
- 任何串都是其自身的子串；
- 如果 `str` 的一个子串非空且不为 `str` 自身，则称其为 `str` 的一个**真子串**。

例如 `"quick"`、`"jump"`、`"fox"`、`"brown dog"` 均为 `"The quick brown dog jumps over the lazy fox"` 的真子串。第 3 节的模式匹配问题，问的就是「一个串是不是另一个串的子串，如果是，从哪个位置开始」。

**抽象数据类型。** 原书【代码4.1】给出字符串的抽象数据类型，那份声明有三处今天必须改：

| 原书的写法 | 问题 | 本章的改法 |
| --- | --- | --- |
| 类名是小写的 `string` | 在 `using namespace std;` 的翻译单元里与 `std::string` 歧义；正文随后又改用大写 `String`，两个名字混用 | 类名大写 `String` |
| `int isEmpty();`、`int find(...)` 用 `-1` 表示没找到 | `-1` 与「位置 0」只差一个符号，漏判就把「没找到」当成「匹配在开头」 | `bool empty()`、`std::optional<size_type> find(...)` |
| 修改器按值返回：`string append(const char c);` | 签名含混——`s.append('x');` 是改了 `s`，还是返回了一个新串而 `s` 原封不动？ | 修改器返回 `String&` |



## 1.1 字符编码

字符串的逻辑元素是字符，内存中却保存**编码单元**。计算机只能识别 0、1 组成的字节，因此实际字符集的「字符」在内存中需要用「字节」来表示，这就是所谓的**字符编码**。

在 C/C++ 中，字符类型是单字节的基本数据类型，采用 ASCII（American Standard Code for Information Interchange，美国标准信息交换码）编码标准：每个字符用一个字节表示，低 7 位表示字符，最高位均为 0，共 128 个字符。

| 编号 | 个数 | 类别 | 举例 |
| --- | --- | --- | --- |
| 0～31、127 | 33 | 控制 / 通信专用字符 | LF（换行）、CR（回车）、DEL、BEL；SOH（文头）、ACK（确认） |
| 32 | 1 | 空格 | 可打印字符，只是看不见 |
| 33～126 | 94 | 通用字符 | 52 个大小写字母、10 个数字、标点与运算符号 |
| 48～57 | 10 | 数字 `0`–`9` | `'0'` = 48 |
| 65～90 | 26 | 大写字母 `A`–`Z` | `'A'` = 65 |
| 97～122 | 26 | 小写字母 `a`–`z` | `'a'` = 97 |

（原书把第 32 号空格也算进控制字符，于是得出「34 个控制字符」。按 ASCII 标准本身的划分，控制字符是 0～31 号和 127 号共 33 个。33～126 号这 94 个「通用字符」的说法不受影响。）**记住三个区间都是连续递增的**——1.2 节的字符比较就建立在这一点上。

制定于 20 世纪 60 年代的 ASCII 没有考虑中文、阿拉伯文等国际文字的统一编码。在发展过程中，不同语言形成了各自独立的编码系统，**这些系统有可能用相同的编号表示各自不同的字符**：中文、日文和韩文都采用两个字节的编码方式，但编码上存在冲突；每种语言又有多种编码，例如中文的 GB2312-80（简体国标码，6763 个汉字）、BIG5（繁体，13053 个汉字），日文的 S-JIS、JIS 以及韩文 Wansung 码等。计算机看到的只是编码后的数字，不同语言系统之间交流文档因此非常困难。

为了解决互通问题，产生了「通用文字符号编码标准」**UNICODE**：它是一种可伸缩的编码，既可以容纳多种语言文字的大编码集，又可以缩减，允许用单字节表示常用的 ASCII 符号。今天最常见的落地形式是 **UTF-8**——以 1～4 个字节编码一个 Unicode 码点，且与 ASCII 完全兼容。

**由此产生一条 2008 年的书还讲不到的结论：C++ 的 `char` 是一个字节，不等于一个「人眼看到的字符」。**

- `std::string::size()` 返回的是字节数，不能用来数 Unicode 字符；
- 要数字符，就得按 UTF-8 解码，或使用明确的 Unicode 库；
- 字面量 `u8"..."` 表示 UTF-8 字节序列。

字节数、字符数、显示宽度是三个不同层次，UTF-8 下不能混用。好在**编码本身不改变字符串概念和操作的本质**：查找、拼接、抽取子串的接口语义与编码无关，所以本章与原书一样，以 ASCII 为主，基本不涉及多国语言混排。



## 1.2 字符的编码顺序

为了便于字符串的比较和运算，字符编码表一般遵循约定俗成的「**偏序编码规则**」：根据字符的自然含义，某些字符间具有一定的次序（例如数字符号 $0, 1, 2, \cdots, 9$ 的大小次序），编码时使其在字符集中的编码顺序和自然次序一致。令 $\mathrm{encode}(x)$ 为符号 $x$ 到其 ASCII 编码的映射，则有

$$\mathrm{encode}('0') + 1 = \mathrm{encode}('1'), \quad \mathrm{encode}('1') + 1 = \mathrm{encode}('2'), \quad \cdots, \quad \mathrm{encode}('8') + 1 = \mathrm{encode}('9')$$

字母 $A, B, \cdots, Z$ 与 $a, b, \cdots, z$ 遵循同样的偏序规则。于是任意两个字符 `ch1` 和 `ch2` 均可用编码值直接比较大小；对字母而言，这种次序就是字典编目次序。

两个字符串按构成它们的字符逐个比较：**先比较第一个不同的编码单元；若一个是另一个的前缀，较短者更小**。于是

- `"monday" < "sunday" < "tuesday"`
- `"123" < "1234" < "23"`

**注意这仅仅是字典次序，与日常理解的次序不同**——星期一在星期二之前，整数 123 比 23 要大。

编码值比较也不是语言学排序：大小写、重音、中文排序都可能需要额外的 locale 或排序键。比较前必须先约定编码和规范化方式，不能把「字节序」误当成「自然语言顺序」。

#### C++ 特有的坑：两个字面量之间写 `<`，比的是地址

上面那条结论只对 `std::string` 成立。两个**字符串字面量**之间写 `<`，比的是两个数组的**地址**，不是内容：

```text
$ g++ -std=c++17 -Wall -Wextra litcmp.cpp
litcmp.cpp:7:25: warning: comparison between two arrays [-Warray-compare]
    7 |     std::cout << ("123" < "1234") << ' ' << ("1234" < "23") << '\n';
      |                   ~~~~~~^~~~~~~~
$ ./litcmp
true true      # ("123" < std::string("1234"))、(std::string("1234") < "23")
false true     # ("123" < "1234")、("1234" < "23")——第一个的答案反了
```

同一行代码，两边只要有一边是 `std::string`，比的就是内容；两边都是裸字面量，比的就是地址，而地址由编译器摆放决定。所以凡是比较字符串，一律先落到 `String` / `std::string` 上，再谈编码顺序。



# 2 字符串的存储结构和实现

选择字符串的存储结构时要考虑字符串的**变长特点**。某些应用中字符串的长度变化非常显著——短如单词，长为文件；从统计分布来看，字符串长度分布的方差很大，**用静态长度的向量作为存储结构是不恰当的**。拼接、查找、置换和模式匹配等操作本身都涉及变长的字符串操作，时间开销大，必须精心设计算法、选择恰当的存储结构。本节重点讨论程序执行过程中字符串的**变长存储**问题。

本节的对象是一个自管理的字符缓冲区：长度、结尾空字符、深复制都属于接口契约。所以缓冲区是**裸 `char*`**——换成 `std::string`，这一节就没了。（Python 的 `str` 是不可变对象，不会让你实现缓冲区的分配与释放，因此本节只有 C++ 实现；第 3 节的模式匹配有 Python 版。）

## 2.1 字符串的顺序存储

字符串用一段连续字符数组按字符的逻辑顺序存储，末尾保留 `'\0'` 作为 C 风格字符串的结束标志，并单独记录不含终止符的长度 `length`。因此容量至少要能容纳 `length + 1` 个字符；`'\0'` 不是字符串内容，不计入长度。

- 顺序存储**适合访问单个字符或连续的一组字符**：按下标取第 $i$ 个字符是 $O(1)$；
- 插入和删除（增减字符）要移动插入或删除点后面的所有字符；拼接和抽取子串也要复制一段连续区域；
- 容量不足时，通常重新申请更大的数组、复制旧内容、释放旧数组，再更新指针和长度——这正是后面 `String` 类需要自己维护所有权、拷贝和析构的原因。

C/C++ 的标准字符串是顺序存储方案的典型代表：用 `char s[M];` 定义字符串变量，`M` 是字符数组的长度。由于末尾要带一个 `'\0'`，**字符串的长度不能超过 `M - 1`**。原书图 4.1 画的是

```text
char s1[12] = "Hello world";
char s2[8]  = "2008";
char s3[6];
```

这三个数组在内存里的样子：

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-1.png" alt="图 4.1 C++ 标准字符串的变量说明示意图" style="zoom:67%;" />

<center>图 4.1　C 风格字符串的变量说明。<code>'\0'</code> 是 8 位全 0 的 NULL 符，只作结束标记用，不算内容</center>

原书说图中的 `s3` 没给初值，「意味着它存储空字符串」。**这只对全局或 `static` 数组成立**（它们会被零初始化）；写在函数里的局部数组不给初值，内容是不确定的，在写入之前把它当字符串读（例如 `strlen(s3)`）是未定义行为。要一个空串，就写 `char s3[6] = "";`。

**存储字符串的数组是静态定长的**，程序运行中一旦产生更长的字符串就会造成数组溢出——这正是接下来要用一个类来解决的问题。

#### 标准串函数

`<cstring>`（C 里是 `<string.h>`）提供了若干处理字符串的常用函数：

表 4.1　标准串函数

| 函数名 | 功能说明 |
| --- | --- |
| `size_t strlen(char* s)` | 求字符串 `s` 的当前长度，不计结束符；空字符串的长度为 0 |
| `char* strcpy(char* s1, const char* s2)` | 将 `s2` 复制到 `s1`，并返回一个指向 `s1` 开始的指针 |
| `char* strcat(char* s1, const char* s2)` | 将 `s2` 拼接到 `s1` 尾部 |
| `int strcmp(const char* s1, const char* s2)` | 比较 `s1` 和 `s2`：全同返回 0，`s1` 大于 `s2` 返回正数，小于返回负数 |
| `char* strchr(char* s, char c)` | 定位到 `s` 中第一次出现字符 `c` 的位置，没有则返回空指针 |
| `char* strrchr(char* s, char c)` | 从尾部逆向定位，返回最后一次出现 `c` 的位置，没有则返回空指针 |

此外，输入/输出也是标准串函数库的主要组成部分：`cin >> s1;` 从标准输入读取字符串到 `s1`，`cout << s1;` 把 `s1` 的内容输出到标准输出。

例如对图 4.1 中的 `s1` 调用 `strchr(s1, 'o')` 和 `strrchr(s1, 'o')`，分别得到字符 `'o'` 第一次（下标 4）和最后一次（下标 7）出现的位置：

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-2.png" alt="图4.2 在字符串 s1 中寻找并定位给定字符 'o' 的位置" style="zoom:67%;" />

<center>图 4.2　在字符串 s1 中定位字符 'o'</center>

两个函数返回的都是指针，找不到返回空指针。下面的 `String` 用下标加 `std::optional` 表达同一件事——「没找到」不再靠一个特殊指针值来表示。

#### `s1 = s2` 不是复制内容

字符串处理中非常容易犯的一个错误：**赋值语句 `s1 = s2` 不能被理解为把 `s2` 的内容复制到 `s1`**。数组不是指针，只是在多数表达式里退化为指向首元素的指针（`sizeof s1` 是 12，不是指针的大小）。于是：

- 若 `s1`、`s2` 是上面那样的字符数组，`s1 = s2` **根本编译不过**——数组不可赋值，g++ 报 `error: incompatible types in assignment of 'char [8]' to 'char [12]'`，clang++ 报 `error: array type 'char[12]' is not assignable`。复制内容要用 `strcpy`。
- 若它们是 `char*`，赋值能通过，但复制的只是**地址**：两个指针从此指向同一块内存，改一个，另一个跟着变。

第二种正是 `String` 必须自己写拷贝赋值运算符的原因：编译器默认的逐成员复制只复制指针，两个对象共用一块缓冲区，析构时重复释放。



## 2.2 字符串类 String 的存储结构

顺序存储简单易实现，标准串函数也很实用，**但终归难以避免静态定长的局限**；而实际应用中，大多数字符串变量的长度是动态变化的。

那么为什么不用链式的变长结构？因为**每一个链指针比一个字符所占的存储空间还大**——1 字节的数据配 8 字节的指针（64 位机），指针域的开销几倍于数据域（回到第 2 章那条判据：指针所占比例超过 1:1 就要慎重）。所以字符串的变长存储走的是另一条路：**仍然顺序存放，但把这块缓冲区的分配与释放交给一个类去管**。

顺序存储只说了「字符放在哪」，还没说「这块内存归谁、什么时候还」。包成一个类之后，这两件事才有着落：类里存一个指向字符数组的指针和一个长度，**构造时申请、析构时释放、拷贝时另开一份**——这就是**变长存储管理**。

### 教学版：完整实现

下面是一份**完整的、能直接编译运行的**字符串类。一个文件、一个类。2.2、2.3 两节就是把它拆开逐段讲。

```cpp file=code/ch04/string_class/teaching.hpp
// 字符串类 String —— 教学版。原书【代码4.1】【算法4.3】【算法4.4】【算法4.5】。
//
// 一个文件、一个类、能直接编译运行，给「第一次读这一节」的人看。
//
// 本节的教学内容是**字符串的变长存储管理**：动态分配、按长度重新开辟、拷贝与释放。
// 所以这里是手写的 char* 缓冲区，不是 std::string——换成 std::string，这一节就没了。
//
// 与 modern.hpp（工程版）的分工：
//   教学版  三法则（析构 + 拷贝构造 + 拷贝赋值）；
//   工程版  补齐移动语义（移动之后 data_ 为空，读取路径要多一层 raw() 兜底）、
//           比较运算符全家、copy-and-swap。
// 两份都在闸门里真编译真运行。先读这一份，4.2a「进阶（选读）」再读那一份。
#pragma once

#include <cstddef>
#include <cstring>
#include <optional>
#include <stdexcept>

class String {
public:
    using size_type = std::size_t;

    // 空串。**注意它仍然申请了 1 个字节**，里面放一个 '\0'。
    // 这样 c_str() 永远返回一个合法的 C 字符串，调用方不必先判空指针。
    String() : data_(new char[1]), size_(0) {
        data_[0] = '\0';
    }

    // 从 C 字符串构造。参数是 `const char*` 而不是原书的 `char*`——
    // 原书那个签名让它自己书里的例子 `String s1 = "Hello";` 从 C++11 起就编译不过：
    // 字符串字面量的类型是 const char[6]，绑不到 char*。
    //
    // 这里**故意不加 explicit**，为的就是保住 `String s1 = "Hello";` 这种写法。
    String(const char* s) {   // NOLINT(google-explicit-constructor)
        if (s == nullptr) {
            throw std::invalid_argument("String: 不能用空指针构造字符串");
        }
        size_ = std::strlen(s);
        data_ = new char[size_ + 1];
        std::memcpy(data_, s, size_ + 1);   // +1 把结尾那个 '\0' 也带上
    }

    ~String() { delete[] data_; }

    // 三法则：自己管着 new 出来的缓冲区，拷贝必须自己写。
    // 原书正文里描述过赋值时「必须释放 s1 的原有空间」，却没有把拷贝构造和
    // 拷贝赋值作为清单给出。只有析构没有这两个，一次 `String b = a;` 就是二次释放。
    String(const String& other) : data_(new char[other.size_ + 1]), size_(other.size_) {
        std::memcpy(data_, other.data_, size_ + 1);
    }

    String& operator=(const String& other) {
        if (this == &other) {
            return *this;
        }
        char* fresh = new char[other.size_ + 1];   // 先备好新的
        std::memcpy(fresh, other.data_, other.size_ + 1);
        delete[] data_;                            // 再释放旧的
        data_ = fresh;
        size_ = other.size_;
        return *this;
    }

    size_type size() const { return size_; }
    size_type length() const { return size_; }
    bool empty() const { return size_ == 0; }
    const char* c_str() const { return data_; }

    void clear() {
        char* fresh = new char[1];
        fresh[0] = '\0';
        delete[] data_;
        data_ = fresh;
        size_ = 0;
    }

    // 按下标取字符。越界抛异常，不是返回一个随便什么值。
    char at(size_type index) const {
        if (index >= size_) {
            throw std::out_of_range("String::at: 下标越界");
        }
        return data_[index];
    }

    // 在串尾添加一个字符。
    //
    // **变长存储的代价在这里看得最清楚**：字符串长度变了，就得重新申请一块、
    // 把老内容拷过去、再把老的还回去。所以 append 一个字符是 O(n)，不是 O(1)。
    //
    // 返回自身引用，于是 `s.append('a').append('b')` 可以连着写；
    // 原书【代码4.1】声明的是**按值返回**，调用方从签名看不出它改不改本串。
    String& append(char c) {
        char* fresh = new char[size_ + 2];        // 老内容 + 新字符 + '\0'
        std::memcpy(fresh, data_, size_);
        fresh[size_] = c;
        fresh[size_ + 1] = '\0';
        delete[] data_;
        data_ = fresh;
        ++size_;
        return *this;
    }

    // 把 s 接在本串后面。同样是「重新申请、拷两段、释放旧的」。
    String& concatenate(const char* s) {
        if (s == nullptr) {
            throw std::invalid_argument("String::concatenate: 空指针");
        }
        size_type extra = std::strlen(s);
        char* fresh = new char[size_ + extra + 1];
        std::memcpy(fresh, data_, size_);
        std::memcpy(fresh + size_, s, extra + 1);
        delete[] data_;
        data_ = fresh;
        size_ += extra;
        return *this;
    }

    // 【算法4.5】从 pos 开始取长度至多 len 的子串。
    //
    // 原书在 `pos >= size` 时 `return NULL;`。那不是「返回空串」——
    // NULL 会去走 String(char*) 构造函数，然后 strlen(nullptr) 当场段错误。
    // 这里越界就抛异常，让错误停在发生的地方。
    // pos == size() 是合法的，得到空串（「从末尾取 0 个字符」）。
    String substr(size_type pos, size_type len) const {
        if (pos > size_) {
            throw std::out_of_range("String::substr: 起始位置越界");
        }
        size_type available = size_ - pos;
        size_type take = (len < available) ? len : available;   // 原书的 if (n > left) n = left
        String result;
        char* fresh = new char[take + 1];
        std::memcpy(fresh, data_ + pos, take);
        fresh[take] = '\0';
        delete[] result.data_;
        result.data_ = fresh;
        result.size_ = take;
        return result;
    }

    // 【算法4.4】从 start 开始查找字符 c。找到返回下标，没找到返回空 optional。
    // 原书用 -1 表示没找到——与「位置 0」只差一个符号，忘了判就会读错位置。
    std::optional<size_type> find(char c, size_type start = 0) const {
        for (size_type i = start; i < size_; ++i) {
            if (data_[i] == c) {
                return i;
            }
        }
        return std::nullopt;
    }

    // 【算法4.3】三路比较：负 / 零 / 正 表示 小于 / 等于 / 大于。
    //
    // 原书自己实现了一个 strcmp，返回值固定为 -1/0/1，并在正文里说
    // 「这与 C/C++ 语言中通常的大小比较习惯不一致」——其实不一致的是原书自己：
    // 标准 strcmp 返回的就是差值的符号，调用方只该看符号，不该看具体数值。
    int compare(const String& other) const {
        return std::strcmp(data_, other.data_);
    }

private:
    char* data_;       // 以 '\0' 结尾的字符数组，永远非空
    size_type size_;   // 字符个数，不含结尾的 '\0'
};

inline bool operator==(const String& a, const String& b) { return a.compare(b) == 0; }
inline bool operator!=(const String& a, const String& b) { return a.compare(b) != 0; }
inline bool operator<(const String& a, const String& b) { return a.compare(b) < 0; }
```

### 关键要点

**1. 两个数据成员，一条不变式。** `data_` 是以 `'\0'` 结尾的字符数组，**永远非空**；`size_` 是字符个数，不含 `'\0'`。空串也申请 1 个字节放一个 `'\0'`，于是 `c_str()` 永远返回合法的 C 字符串，调用方不必先判空指针。`clear()` 也守这条不变式：不是把 `data_` 置空，而是换成一块只装 `'\0'` 的 1 字节缓冲区。

**2. 构造函数的参数是 `const char*`，故意不加 `explicit`。** 原书写的是 `String(char* s)`，并说 `String s1 = "Hello";` 会隐含调用它。但字符串字面量的类型是 `const char[6]`，转成 `char*` 从 C++11 起已被移除——原书自己的例子编译不过。不加 `explicit` 为的就是保住 `String s1 = "Hello";` 这种写法。另外原书【算法4.4】里的 `assert(str != '\0')` 本身也编译不过（`'\0'` 是 `char`，不是空指针常量）；即便写成 `assert(str != nullptr)` 也无效——`new` 失败抛 `std::bad_alloc`，从不返回空指针，而 `assert` 在 `NDEBUG` 构建里整个消失。教学版对空指针参数抛 `std::invalid_argument`。

**3. 三法则第三次出场。** 自己管着 `new` 出来的缓冲区，拷贝构造和拷贝赋值就必须自己写。原书正文描述过赋值时「必须释放 `s1` 的原有空间」，却没有把这两个函数作为清单给出——只有析构没有它们，一次 `String b = a;` 就是二次释放，与第 2、3 章是同一个错误。拷贝赋值的三步顺序是：

1. **备好新的**：`new` + `memcpy`；
2. **释放旧的**：`delete[] data_`；
3. **接管**：`data_ = fresh`。

顺序反过来，一旦 `new` 抛异常，对象就停在「指针已释放」的破碎状态。

**4. 变长管理的两张图。** `String s1 = "Hello";` 会在动态存储区开一个长度为 6 的字符数组（5 个字符加结束符），把初值顺序存进去：

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-3.png" alt="图4.3 创建字符串的示意图" style="zoom:67%;" />

<center>图 4.3　创建字符串：对象里只有一个指针和一个长度，字符本体在堆上</center>

再写 `String s2 = "Hello world"; s1 = s2;`，新内容比旧的长，装不下，于是必须先另开一块新数组、把内容复制过去，旧数组（图中的灰格）释放掉，指针改指新数组：

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-4.png" alt="图4.4 赋值运算示意图" style="zoom:67%;" />

<center>图 4.4　赋值运算：String 按当前串长动态调整空间</center>

注意那块灰色的旧空间——**它必须释放，而且必须在新空间准备好之后再释放**。这就是「变长管理」的全部含义。

**5. `at(index)` 越界抛 `std::out_of_range`**，不是返回一个随便什么值。按下标取字符是 $O(1)$：这是顺序存储的长处。

> 工程版（`code/ch04/string_class/modern.hpp`）在此之上补齐了移动构造/移动赋值、copy-and-swap 和全套关系运算符。移动操作是 `noexcept` 的，不能在里面分配，所以被移动方的 `data_` 只能置空；为了守住「`c_str()` 永远不是空指针」的承诺，工程版的读取路径统一走一个私有的 `raw()`，`data_` 为空时返回静态空串。



## 2.3 字符串运算的实现

#### 追加与拼接

`append(char)` 与 `concatenate(const char*)` 的形状是一样的三步：**重新申请一块、把老内容拷过去、释放旧块**。所以追加一个字符是 $O(n)$，不是 $O(1)$——这就是变长串管理的代价，也是讨论「预留容量」的动机。

| 运算 | 做了什么 | 代价 |
| --- | --- | --- |
| `append(c)` | 申请 `size + 2`，拷 `size` 个字符 | $O(n)$ |
| `concatenate(s)` | 申请 `size + extra + 1`，拷两段 | $O(n + \lvert s \rvert)$ |
| `at(i)` | 直接按下标取 | $O(1)$ |

`concatenate` 的第二段 `memcpy(fresh + size_, s, extra + 1)` 用 `extra + 1`，把 `s` 结尾的 `'\0'` 一起带上。

两者都返回 `String&`，于是 `s.append('a').append('b')` 可以连着写，而且调用方从签名一眼看出它改的是本串。

#### 抽取子串

原书【算法4.5】在起始位置越界时写 `return NULL;`。这里的返回类型是 `String`，所以 `NULL` 不是「空串」：它先转成 `char*`，再走 `String(char*)` 构造函数，于是 `strlen(nullptr)`。这段**能编译**，崩在运行期：

```text
$ ./s7
准备调用 s.Substr(99, 1)——原书会走到 return NULL 那一支
runtime error: null pointer passed as argument 1, which is declared to never be null
AddressSanitizer:DEADLYSIGNAL
ERROR: AddressSanitizer: SEGV on unknown address 0x000000000000
```

教学版的约定：

| 情况 | 行为 |
| --- | --- |
| `pos > size()` | 抛 `std::out_of_range`，让错误停在发生的地方 |
| `pos == size()` | 合法，得到空串（「从末尾取 0 个字符」） |
| `len` 超出剩余长度 | 截断，不报错（与原书的 `if (n > left) n = left;` 一致） |

#### 查找与比较

`find`（对应【算法4.4】）返回 `std::optional<size_type>`：找到是下标，没找到是空盒子。原书用 `-1` 表示没找到：

```text
int k = s.find('x', 0);
print(s.at(k));        // 忘了判 -1
```

`-1` 与「位置 0」只差一个符号，调用方漏判就会把「没找到」当成「匹配在开头」。换成 optional 之后，取值前必须先判断：

```text
if (const auto found = text.find('C')) {
    use(*found);       // 有值才解引用
}
```

这与第 2 章顺序表按内容检索是同一个问题、同一个改法。

`compare`（对应【算法4.3】）是三路比较：负 / 零 / 正表示小于 / 等于 / 大于。原书自己实现了一个 `strcmp`，固定返回 −1/0/1，并说「这与 C/C++ 语言中通常的大小比较习惯不一致」。其实标准 `strcmp` 返回的就是差值的符号，**调用方本来就只该看符号，不该看具体数值**。教学版保持标准语义，并据此提供 `==`、`!=`、`<` 三个关系运算符。



# 3 字符串的模式匹配

所谓**模式匹配**（pattern matching），就是在**文本**（text）中寻找一个给定的**模式**（pattern）：通常文本很大，而模式比较短小。

| 应用 | 模式 | 文本 |
| --- | --- | --- |
| 文本编辑：「替换」前先要找到被替换的内容 | 一个单词，10 个字符左右 | 几百字到上百万字 |
| DNA 分析：信息由 A、C、G、T 四个符号组成 | 基因，一般几百个字符 | 人类染色体，长度有 30 亿之多 |

这些应用对匹配算法的效率要求很高：在 30 亿个字符里，$O(|T|\cdot|P|)$ 和 $O(|T|+|P|)$ 是两个世界。

模式匹配有两类：

- **精确匹配**（exact matching）：目标 $T$ 中至少一处存在模式 $P$ 才算成功，差一个字符也算失败。想找的词可以是单选的（`"set"`），也可以是多选的——模式 `"s?t"` 可以匹配 `"sat"`、`"set"`、`"sit"`，`?` 称为**通配符**；更复杂的模式用正则表达式表示。
- **近似匹配**（approximate matching）：$P$ 与 $T$（或其子串）存在某种程度的相似即算成功。常用的相似度是一个串转换成另一个串所需的插入、删除、替换操作数目。

本节只讨论**精确匹配中的单选情况**。记号：$T_j$、$P_j$ 表示位置 $j$ 上的字符，$|T|$、$|P|$ 表示长度，$a^n$ 表示由 $n$ 个字符 $a$ 组成的串，**$P$ 和 $T$ 的第一个字符都从位置 0 开始**。模式匹配就是要在 $T$ 中找到一个 $j$，使得

$$P_0 P_1 P_2 \cdots P_{m-2} P_{m-1} = T_j T_{j+1} T_{j+2} \cdots T_{j+m-2} T_{j+m-1}$$

否则称模式匹配失败。**记住「都从位置 0 开始」这句话**——3.1 节会看到，原书自己的两个算法都没有遵守它。

本节的教学内容是**算法本身**，因此实现用 `std::string_view` 接收输入：不拷贝、不拥有，把注意力留在匹配过程上。



## 3.1 朴素的模式匹配算法

朴素算法的思路直白：把模式的首字符对齐目标的每一个位置，逐字符比较；某次比较失败（称为一次**失配**）时，就把模式相对于 $T$ 向右移动一个字符位置，重新开始下一趟匹配。如此重复，直到某趟配串成功返回，或者比较到目标串的结束也没有出现配串，则匹配失败。

```cpp file=code/ch04/pattern_matching/modern.hpp#naive
/// 朴素模式匹配：返回 pattern 在 text 中首次出现的**起始下标**；没有则 std::nullopt。
///
/// 与原书【算法4.6】的关键差别是返回值：原书写的是 `return (j - pLen + 1);`，
/// 而在 0 起始的下标体系里正确的是 `j - pLen`——**原书这里差了 1**。
/// 用书中自己的例子可以当场看出来：T="abcddabcab..."、P="abcdaabcab" 匹配始于下标 10，
/// 原书返回 11（证据见 legacy.md 缺陷 1）。
///
/// 空模式约定返回 0（与 std::string::find("") 一致）；原书用 assert(m>0) 把它挡在门外，
/// 而 assert 在 NDEBUG 下会被整个编译掉。
[[nodiscard]] inline std::optional<std::size_t> naive_search(std::string_view text,
                                                             std::string_view pattern) {
    const std::size_t n = text.size();
    const std::size_t m = pattern.size();
    if (m == 0) {
        return std::size_t{0};
    }
    if (n < m) {
        return std::nullopt;
    }
    std::size_t i = 0;  // 模式下标
    std::size_t j = 0;  // 目标下标
    while (i < m && j < n) {
        if (text[j] == pattern[i]) {
            ++i;
            ++j;
        } else {
            j = j - i + 1;  // 回退到本趟起点的下一个位置
            i = 0;
        }
    }
    return i >= m ? std::optional<std::size_t>(j - m) : std::nullopt;
}
```

```python file=code/ch04/pattern_matching/modern.py#naive
def naive_search(text: str, pattern: str) -> int | None:
    """朴素匹配：返回首次出现的 0 起始下标。"""
    if not pattern:
        return 0
    i = 0
    j = 0
    while i < len(pattern) and j < len(text):
        if text[j] == pattern[i]:
            i += 1
            j += 1
        else:
            j = j - i + 1
            i = 0
    return j - len(pattern) if i == len(pattern) else None
```

两个下标的动作：

| 变量 | 含义 | 相等时 | 失配时 |
| --- | --- | --- | --- |
| `i` | 模式下标 | `++i` | `i = 0` |
| `j` | 目标下标 | `++j` | `j = j - i + 1`（回溯） |

- 失配时 `j = j - i + 1` 把目标下标退回本趟起点的**下一个**位置——这个 `+1` 是对的，表示「换一个起点重来」；
- 成功时 `j` 已走到匹配段末尾之后，所以起始位置是 `j - m`；
- 空模式约定返回 0，与 `std::string::find("")` 一致。

**手算一例**：T = `abababd`，P = `ababd`。

| 趟 | 起点 | 比较过程 | 比较次数 |
| --- | --- | --- | --- |
| 1 | 0 | T[0..3] = `abab` 相等，T[4]='a' ≠ P[4]='d'；`j` 从 4 退回 1 | 5 |
| 2 | 1 | T[1]='b' ≠ P[0]='a'；`j` 退到 2 | 1 |
| 3 | 2 | T[2..6] = `ababd` 全部相等 → 返回 7 − 5 = 2 | 5 |

共 11 次比较。原书用 T = `"abacaabaccabacabaa"`、P = `"abacab"` 走了一遍全过程：第 1 趟在目标的 `a` 与模式的 `b` 处失配（$T_5 \ne P_5$），模式右移一位重来，如此直到第 11 趟在子串处配上，返回首位置 10。

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-6.png" alt="图 4.6 朴素匹配的示例" style="zoom:67%;" />

<center>图 4.6　朴素匹配的示例。加粗带下划线的是当前失配的那一对字符</center>

可以数一数目标里有多少字符被反复比较过（按上面的 `naive_search` 计，这一例共比较 28 次）——这些重复比较正是 KMP 要省掉的东西。

#### 时间效率：三种极端情况

**最好**：目标开头那一段就是配串，比 $|P|$ 次就完事，$O(|P|)$。

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-7.png" alt="图4.7 朴素匹配的最佳情况示例" style="zoom:67%;" />

<center>图 4.7　朴素匹配的最佳情况：第一趟就配上</center>

**匹配失败中的最好情况**：每趟都在模式首字符处就不等，右移一位再试，直到目标的 $|T|-|P|$ 位置，一共比较 $|T|-|P|+1$ 次，$O(|T|-|P|+1)$。

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-8.png" alt="图4.8 匹配失败的最佳情况示例" style="zoom:67%;" />

<center>图 4.8　匹配失败的最佳情况：每趟只比一次就失配</center>

**最坏**：目标形如 $a^n$、模式形如 $a^{m-1}b$，每趟都要比到模式的最后一个字符才失配，最多 $|T|-|P|+1$ 趟，共 $|P|(|T|-|P|+1)$ 次比较，即 $O(|T|\cdot|P|)$。

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-9.png" alt="图4.9 朴素匹配最差情况示例" style="zoom:67%;" />

<center>图 4.9　朴素匹配的最差情况</center>

**此类情况很少出现在自然语言文本中，却经常出现在 DNA 信息和图像信息中**——这正是需要 KMP 的实际理由。

#### 平均情况

平均代价依赖于目标和模式中字符的分布概率。假设串中只允许 2 种字符，每种概率 $1/2$。对第 $j$ 趟扫描：

| 本趟比较次数 | 1 | 2 | ⋯ | $k$（$k < \lvert P\rvert$） | $\lvert P\rvert$ |
| --- | --- | --- | --- | --- | --- |
| 概率 | $1/2$ | $1/4$ | ⋯ | $2^{-k}$ | $2^{-(\lvert P\rvert-1)}$ |

比满 $|P|$ 次时，最后一个字符相等（配串成功）或不等都算 $|P|$ 次，所以概率是 $2^{-(|P|-1)}$（原书写成 $2^{-|P|}$，漏了配串成功的那一半）。于是每趟平均比较

$$\sum_{k=1}^{|P|-1} \frac{k}{2^k} + \frac{|P|}{2^{|P|-1}} = 2 - 2^{1-|P|} < 2$$

次。最多有 $|T| - |P| + 1$ 趟，平均比较总次数小于 $2(|T| - |P| + 1) < 2|T|$。字符种数为 $|A|$ 时同理，每趟平均不到 $|A|/(|A|-1)$ 次——字符种类越多，越早遇到失配。**所以平均情况下朴素算法其实不慢；真正的问题是最坏情况，而最坏情况在 DNA、图像里并不罕见。**

> 原书接着用马尔科夫链给出「更好的比较次数」$2^{|P|+1} - 2$（$|A|$ 种字符时 $(|A|^{|P|+1} - |A|) / (|A| - 1)$）。**这两个式子算的不是比较次数**：式子里根本没有 $|T|$，又随 $|P|$ 指数增长，不可能比 $2|T|$「更好」。它们算的是另一个量——在随机目标串里逐个读入字符，**模式第一次出现时平均读到了第几个字符**，而且只对 `aa…a` 这类自身重叠最多的模式成立。
>
> 以 2 种字符、$P = $ `"00"` 为例：状态 $S_0$（没有进展）读到 0 进入 $S_1$、读到 1 留在 $S_0$；$S_1$ 读到 0 即配串成功、读到 1 退回 $S_0$。记 $E_0$、$E_1$ 为从两个状态出发平均还要读入的字符数：
>
> $$E_1 = 1 + \frac{1}{2} \cdot 0 + \frac{1}{2} E_0, \qquad E_0 = 1 + \frac{1}{2} E_1 + \frac{1}{2} E_0$$
>
> 解得 $E_0 = 6 = 2^{2+1} - 2$。换成 $P = $ `"01"`：$S_1$ 读到 0 时这个 0 可以当新的开头，仍留在 $S_1$，于是 $E_0 = 4$——同样长度，期望位置却不同。一般地，期望位置等于 $\sum |A|^k$，$k$ 取模式所有「既是前缀又是后缀」的长度（含模式本身）。前缀与后缀的这种重合，恰好也是 3.2 节特征向量要刻画的东西。

#### 原书的返回值差 1

原书【算法4.6】（朴素）与【算法4.8】（KMP）在匹配成功时都写：

```text
if (i >= pLen) return (j - pLen + 1);
```

匹配成功时 `j` 已经走到匹配段的**末尾之后**，所以起始位置是 `j - pLen`，那个 `+1` 是多余的。把原书两段代码照抄进程序，拿标准库的 `find` 做参照：

```text
T=abc                              P=abc          原书朴素=  1  正确答案=  0
T=xabc                             P=abc          原书朴素=  2  正确答案=  1
T=aaab                             P=ab           原书朴素=  3  正确答案=  2
T=abcddabcababcdaabcababcdaabcabaa P=abcdaabcab   原书朴素= 11  正确答案= 10
```

**每一组都恰好多 1**，最后一组正是原书图 4.12 自己用来演示 KMP 的那对串——原书逐趟画了匹配过程，却没有给出返回值，这个错误因此没有暴露。这不是排版或 OCR 错误：`j - pLen + 1` 在两个算法里独立印出、写法一致；同一段代码里的 `j = j - i + 1` 说明作者用的就是 0 起始下标；第 3 节开头的约定更是写死了「P 和 T 的第一个字符都从位置 0 开始」。

**测试要有牙**：每条匹配用例都拿 `find` 逐个对拍返回值。只断言「找到了」的测试，在原书那份实现下同样全绿——那样的测试等于没写。

#### 问题出在哪里：目标的回溯

朴素算法一旦某趟发生失配，**无论模式的具体情况如何，都只把模式右移一位**，于是目标 $T$ 中的字符会多次与模式中的字符比较，造成**目标的回溯**。

例如 $P = $ `"abacab"` 与 $T = $ `"abacaabaccabacabaa"` 的第 1 趟比较中，发现 $P_5 \ne T_5$ 时把模式右移一位、开始第 2 趟，使 $P_0$ 与 $T_1$ 比较。其实：

- 上一趟 $T_1$ 已与 $P_1$ 比较过，相等；
- 模式自身 $P_1 \ne P_0$；
- 两条一合，$P_0 \ne T_1$ 是推得出来的，**根本用不着重新比较**。

一般来说，右移的位数越多效率越好，但前提是不能丢失任何可匹配的子串。Knuth、Morris、Pratt 发现：**每次右移的位数存在，且与目标串无关，仅依赖于模式本身**。于是可以预先处理模式，为模式中的每一个位置算好失配时该退到哪里——这就是**字符串的特征向量**，改进后的算法就是 **KMP 算法**。



## 3.2 字符串的特征向量

KMP 的想法是：失配时不必把模式退回从头开始，因为**已经匹配上的那一段本身携带了信息**。用一个例子就清楚了。

设目标串 T = `abababd`，模式 P = `ababd`，从 T 的位置 0 开始比：

```text
位置:  0 1 2 3 4 5 6
T   :  a b a b a b d
P   :  a b a b d
                ↑ 这里失配（T[4]='a'，P[4]='d'）
```

失配前已经匹配上了 `abab` 这四个字符。**朴素算法**到这里会把模式整体右移一位、从 T[1] 重新比起——但这浪费了信息：我们已经知道 T[0..3] 就是 `abab`。

KMP 的做法是问：`abab` 的**前缀**和**后缀**里，最长的相同的一段是多少？

```text
abab 的前缀: a, ab, aba
abab 的后缀: b, ab, bab
最长相同的一段: "ab"，长度 2
```

这个 2 的意义是：`abab` 的末尾两个字符 `ab`，恰好也是开头两个字符。所以模式可以**一次右移 4 − 2 = 2 位**直接对上去，并且移过去之后**前两个字符不必再比**——它们必然相同：

```text
位置:  0 1 2 3 4 5 6
T   :  a b a b a b d
P   :      a b a b d
             ↑ 这两个已知相同，从这里继续比
```

接着从 P[2] 与 T[4] 往下比，一路比到底，在位置 2 匹配成功。整个过程中 **T 的下标从来没有往回退过**。

把「每个位置失配时该退到哪里」对模式的每个位置预先算出来，就是**特征向量**（next 数组）。上面这个例子用本章的实现跑出来是：

```text
next(ababd) = -1 0 -1 0 2
kmp_search("abababd", "ababd") = 2
std::string::find 对照         = 2
```

| i | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| P[i] | a | b | a | b | d |
| next[i] | −1 | 0 | −1 | 0 | 2 |

- `next[4] = 2`：在 P[4] 处失配时，模式的比较位置退到 2——和上面手推的一致；
- `next[i] = −1`：连 P[0] 都不必再比，模式整体越过当前目标字符（`i` 变 −1，下一步 `i`、`j` 同时加 1）；
- `next` 只依赖模式：同一个模式算一次，可在任意多个目标上复用。

这里用的是原书【算法4.7】的**优化版** next，所以中间会出现 −1；未优化版本的取值不同，但失配后的落点等价（见本节后半）。

```cpp file=code/ch04/pattern_matching/modern.hpp#build-next
/// 计算模式的特征向量（next 数组），原书【算法4.7】的"优化版"。
///
/// 与原书的差别只有所有权：原书 `int* findNext(String P)` 用 `new int[m]` 返回裸数组，
/// 而书中**从未展示过与之配对的 delete[]**——每调用一次泄漏一个数组。
/// 计算过程一字未改，包括 `next[i] = next[k]` 这一步优化。
///
/// 空模式返回空向量；原书是 `assert(m > 0)`，而 assert 在 NDEBUG 下会被编译掉，
/// 于是 release 构建里 `new int[0]` 加 `next[0] = -1` 就是一次越界写。
[[nodiscard]] inline std::vector<next_type> build_next(std::string_view pattern) {
    const std::size_t m = pattern.size();
    std::vector<next_type> next(m);
    if (m == 0) {
        return next;
    }
    next_type i = 0;
    next_type k = -1;
    next[0] = -1;
    while (i < static_cast<next_type>(m)) {
        while (k >= 0 && pattern[static_cast<std::size_t>(i)] != pattern[static_cast<std::size_t>(k)]) {
            k = next[static_cast<std::size_t>(k)];  // 沿已算好的特征值回退
        }
        ++i;
        ++k;
        if (i == static_cast<next_type>(m)) {
            break;
        }
        const auto ui = static_cast<std::size_t>(i);
        const auto uk = static_cast<std::size_t>(k);
        // P[i] 与 P[k] 相等时可以直接借用 next[k]，省掉一次注定失败的比较——这就是"优化版"。
        next[ui] = (pattern[ui] == pattern[uk]) ? next[uk] : k;
    }
    return next;
}
```

```python file=code/ch04/pattern_matching/modern.py#build-next
def build_next(pattern: str) -> list[int]:
    """计算原书算法4.7的优化版 next 数组。"""
    if not pattern:
        return []
    next_values = [-1] * len(pattern)
    i = 0
    k = -1
    while i < len(pattern):
        while k >= 0 and pattern[i] != pattern[k]:
            k = next_values[k]
        i += 1
        k += 1
        if i == len(pattern):
            break
        next_values[i] = next_values[k] if pattern[i] == pattern[k] else k
    return next_values
```

求 next 的过程是**用模式串跟自己匹配**：

- 内层 `while`：`P[i] ≠ P[k]` 时 `k = next[k]`，沿已算好的特征值回退，直到能延长或 `k` 退到 −1；
- 最后那个三目表达式就是「优化」：若 `P[i] == P[k]`，退到 `k` 必然在同一个字符上再失配一次，不如直接借用 `next[k]` 一步到位。

#### 手算 `build_next("abcdaabcab")`

| i | 进入时 k | 回退：比 P[i] 与 P[k] | `++` 后 i, k | P[i+1] vs P[k] | 写 next[i+1] |
| --- | --- | --- | --- | --- | --- |
| 0 | −1 | k = −1 不比 | 1, 0 | b ≠ a | 0 |
| 1 | 0 | b≠a → k=next[0]=−1 | 2, 0 | c ≠ a | 0 |
| 2 | 0 | c≠a → k=−1 | 3, 0 | d ≠ a | 0 |
| 3 | 0 | d≠a → k=−1 | 4, 0 | a = a | **next[0] = −1** |
| 4 | 0 | a=a，不退 | 5, 1 | a ≠ b | 1 |
| 5 | 1 | a≠b → k=next[1]=0；a=a 停 | 6, 1 | b = b | **next[1] = 0** |
| 6 | 1 | b=b，不退 | 7, 2 | c = c | **next[2] = 0** |
| 7 | 2 | c=c，不退 | 8, 3 | a ≠ d | 3 |
| 8 | 3 | a≠d → k=next[3]=0；a=a 停 | 9, 1 | b = b | **next[1] = 0** |
| 9 | 1 | b=b，不退 | 10, 2 | i == m | break |

「i」列是本轮开始时的 `i`；自增后 `i` 变成 `i+1`，写的是 `next[i+1]`。`next[0] = −1` 在循环前赋好。加粗的是优化生效的位置：`P[i]` 与 `P[k]` 相等时借用 `next[k]`，而不是写 `k`。结果：

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P[i] | a | b | c | d | a | a | b | c | a | b |
| next[i] | −1 | 0 | 0 | 0 | −1 | 1 | 0 | 0 | 3 | 0 |

这与原书图 4.11 最后一行完全一致。原书在优化之前，还先按定义给出了未优化的 `next = {-1,0,0,0,0,1,1,2,3,1}`，并指出「可以优化的下标位置为 4、6、7、9」——正是上表加粗、值发生变化的位置。

#### 优化版 next 与常见的 lps 表是什么关系

很多教材和网上的 KMP 用的是另一张表：**lps**（longest proper prefix which is also suffix），`lps[i]` 是 `P[0..i]`（**含** `P[i]`）最长的相等真前后缀长度，初值全 0。原书的优化版 next 可以由它**两步**推出来：

```text
i            0   1   2   3   4   5   6   7   8   9
P[i]         a   b   c   d   a   a   b   c   a   b
lps          0   0   0   0   1   1   2   3   1   2
next        -1   0   0   0   0   1   1   2   3   1    ← 第一步：右移一格
优化版 next  -1   0   0   0  -1   1   0   0   3   0    ← 第二步：原书算法4.7 / 图 4.11
```

**第一步：`next[i] = lps[i-1]`，`next[0] = -1`。** 两张表回答的问题不同：`lps[i]` 问的是「`P[0..i]` 的最长前后缀」；`next[i]` 问的是「`P[i]` 与目标失配时，模式下标退到哪里」。`P[i]` 刚失配，能利用的只有它前面已经配上的 `P[0..i-1]`，所以取 `lps[i-1]`——整张表右移一格。`P[0]` 前面什么都没有，退无可退，记作 −1，意思是「不必再比，目标前进一格」，对应 KMP 匹配里 `i == -1` 时的 `++i; ++j`。用 lps 表写匹配时要写 `i = lps[i-1]` 并单独处理 `i == 0`；原书把这个「减 1」和特判都折进了表里。

**第二步：跳过注定失败的回退。** 设 `P[i]` 与 `T[j]` 失配，按未优化的 next 应退到 `k = next[i]`、接着比 `P[k]` 与 `T[j]`。若 `P[k] == P[i]`，这次比较不用做就知道结果——`T[j]` 刚和 `P[i]` 不等，也就一定和 `P[k]` 不等。于是直接借用 `next[k]`。`next[k]` 本身已经优化过，所以一串相同字符会一步跳到底。模式 `"aaaab"` 最能看出差别：

```text
i            0   1   2   3   4
lps          0   1   2   3   0
next        -1   0   1   2   3
优化版 next  -1  -1  -1  -1   3
```

在 `i = 3` 处与一个不是 `'a'` 的字符失配时，未优化的 next 会依次退到 2、1、0、−1，白比三次 `'a'`；优化版一步退到 −1。

对照代码：里层 `while` 的 `k = next[k]` 就是 lps 写法里的 `length = lps[length - 1]`；`++i; ++k` 之后，`k` 恰是 `P[0..i-1]` 的最长前后缀长度，也就是未优化的 `next[i]`；最后那个三目运算是第二步。

**代价是：优化版 next 只能拿来做匹配**，它的值已不再是前后缀长度（上表 `i = 4` 是 −1）。需要前后缀长度本身时——例如 3.4 节求最小循环节——必须用 lps。

#### lps 写法的 KMP：找出全部出现位置

刷题时更常见的是 lps 写法。下面这一版用 `j = lps[j-1]` 回退；匹配成功后不停下，而是同样按 `lps` 回退，接着找下一处，于是能报出**全部**出现位置：

```python
def compute_lps(pattern):
    """
    计算 pattern 的最长前缀后缀（Longest Proper Prefix which is also Suffix）表
    """
    m = len(pattern)
    lps = [0] * m       # 初始化 lps 数组
    length = 0          # 当前最长前后缀长度
    for i in range(1, m):   # i 从 1 开始，lps[0] 永远是 0
        while length > 0 and pattern[i] != pattern[length]:
            length = lps[length - 1]   # 回退到上一个有效前后缀长度
        if pattern[i] == pattern[length]:
            length += 1
        lps[i] = length
    return lps


def kmp_search(text, pattern):
    n = len(text)
    m = len(pattern)
    if m == 0:
        return 0
    lps = compute_lps(pattern)
    matches = []

    j = 0  # 模式串指针
    for i in range(n):  # 主串指针，只增不减
        while j > 0 and text[i] != pattern[j]:
            j = lps[j - 1]  # 模式串回退
        if text[i] == pattern[j]:
            j += 1
        if j == m:
            matches.append(i - j + 1)  # 匹配成功
            j = lps[j - 1]  # 查找下一个匹配

    return matches


text = "ABABABABCABABABABCABABABABC"
pattern = "ABABCABAB"
print("pos matched：", kmp_search(text, pattern))
# pos matched： [4, 13]
```

`length = lps[length - 1]` 是整段代码最难理解的一行。当 `pattern[i] != pattern[length]` 时，长为 `length + 1` 的前后缀延长失败了，但失败并不意味着要从 0 重来：已知前缀 `pattern[0..length-1]` 等于以 `i-1` 结尾的后缀，要找一个更短的长度 `L'`，使 `pattern[0..L'-1]` 仍是以 `i-1` 结尾的后缀——它本质上就是 **`pattern[0..length-1]` 自己的最长公共前后缀**，而那个值恰好已经存在 `lps[length - 1]` 里。整个 `while` 就是在「最长的 → 次长的 → 更短的」候选里依次尝试，直到某个能延长，或 `length` 缩到 0。



## 3.3 KMP 模式匹配算法

有了特征向量，匹配过程与朴素算法几乎一样，只有失配那一步不同：不再把模式退回开头，而是退到 `next[i]`。

```cpp file=code/ch04/pattern_matching/modern.hpp#kmp
/// KMP 模式匹配。失配时不再把模式右移一位，而是按特征值决定右移多少。
///
/// 返回值与 naive_search 一致，也修正了原书【算法4.8】同样的差一错误。
/// next 由调用方传入：同一个模式可以只算一次、多次匹配复用——
/// 这正是原书强调的性质，接口把它显式表达出来。
[[nodiscard]] inline std::optional<std::size_t> kmp_search(std::string_view text,
                                                           std::string_view pattern,
                                                           const std::vector<next_type>& next) {
    const std::size_t n = text.size();
    const std::size_t m = pattern.size();
    if (m == 0) {
        return std::size_t{0};
    }
    if (next.size() != m) {
        throw std::invalid_argument("kmp_search: next 数组长度与模式不符");
    }
    if (n < m) {
        return std::nullopt;
    }
    next_type i = 0;    // 模式下标，可以退到 -1
    std::size_t j = 0;  // 目标下标，只增不减
    while (i < static_cast<next_type>(m) && j < n) {
        if (i == -1 || text[j] == pattern[static_cast<std::size_t>(i)]) {
            ++i;
            ++j;
        } else {
            i = next[static_cast<std::size_t>(i)];
        }
    }
    return i >= static_cast<next_type>(m) ? std::optional<std::size_t>(j - m) : std::nullopt;
}

/// 便利重载：模式只用一次时，自己把 next 算掉。
[[nodiscard]] inline std::optional<std::size_t> kmp_search(std::string_view text,
                                                           std::string_view pattern) {
    return kmp_search(text, pattern, build_next(pattern));
}
```

```python file=code/ch04/pattern_matching/modern.py#kmp
def kmp_search(text: str, pattern: str, next_values: list[int] | None = None) -> int | None:
    """KMP 匹配；目标串下标只向前移动。"""
    if not pattern:
        return 0
    if next_values is None:
        next_values = build_next(pattern)
    if len(next_values) != len(pattern):
        raise ValueError("kmp_search: next 数组长度与模式不符")
    i = 0
    j = 0
    while i < len(pattern) and j < len(text):
        if i == -1 or text[j] == pattern[i]:
            i += 1
            j += 1
        else:
            i = next_values[i]
    return j - len(pattern) if i == len(pattern) else None
```

|  | 朴素匹配失配时 | KMP 失配时 |
| --- | --- | --- |
| 模式下标 `i` | `i = 0` | `i = next[i]`（可退到 −1） |
| 目标下标 `j` | `j = j - i + 1`（回溯） | 不动——只增不减 |

`next` 作为参数由调用方传入：同一个模式只算一次、跨多个目标复用——这正是原书强调的性质，接口把它显式表达出来。`next.size() != m` 时抛 `std::invalid_argument`；返回值同样是 `j - m`，修正了原书【算法4.8】的差一错误。

#### 逐步追踪 `kmp_search("abababd", "ababd")`

`next = −1 0 −1 0 2`：

| # | i | j | T[j] | P[i] | 结果 | 动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 0 | a | a | = | i=1, j=1 |
| 2 | 1 | 1 | b | b | = | i=2, j=2 |
| 3 | 2 | 2 | a | a | = | i=3, j=3 |
| 4 | 3 | 3 | b | b | = | i=4, j=4 |
| 5 | 4 | 4 | a | d | ≠ | i = next[4] = 2，j 不动 |
| 6 | 2 | 4 | a | a | = | i=3, j=5 |
| 7 | 3 | 5 | b | b | = | i=4, j=6 |
| 8 | 4 | 6 | d | d | = | i=5, j=7 |
|  |  |  |  |  |  | i = 5 = m，返回 j − m = 2 |

KMP 共 8 次比较，`j` 序列 0,1,2,3,4,4,5,6——从不减小；朴素算法要 11 次：第 5 次失配后 `j` 从 4 退回 1，再在 T[1] 失配一次。

#### 为什么 KMP 是线性的

**时间代价的关键在于目标下标 `j` 只增不减。**

1. 循环体里 `++j` 至多执行 $|T|$ 次，与它同处一条语句的 `++i` 也不超过 $|T|$ 次；
2. 能让 `i` 减少的只有 `i = next[i]`，而 `next[i] < i`，所以每执行一次 `i` 至少减 1；
3. 一旦减到 −1，下一步必然进入 `++i, ++j` 分支；
4. 因此 `i = next[i]` 的执行次数不超过 `++i, ++j` 的次数加 1，整个循环体至多执行 $2|T| + 1$ 次——**与目标串长度成线性关系**。

加上计算 next 的 $O(|P|)$，KMP 整体为 $O(|P| + |T|)$。

一条能检出退化的测试：用朴素算法的最坏情况（T = 20 万个 `'a'`，P = 1999 个 `'a'` 加一个 `'b'`）——KMP 在其上瞬间完成，而失配后不按特征值回退的实现会退化成 $O(|T|\cdot|P|)$，直接超时。

#### 图 4.12：P = `abcdaabcab` 的完整过程

原书用 P = `"abcdaabcab"`（特征向量 $\{-1,0,0,0,-1,1,0,0,3,0\}$）、T = `"abcddabcababcdaabcababcdaabcabaa"` 走了一遍完整过程：

<img src="https://raw.githubusercontent.com/GMyhf/dsa-modernization/main/book/assets/scan/fig-4-12.png" alt="图 4.12 KMP 匹配示例" style="zoom:67%;" />

<center>图 4.12　KMP 匹配示例</center>

| 趟 | 失配 | 特征值 | 右移 |
| --- | --- | --- | --- |
| 1 | 第 5 次比较，$P_4 \ne T_4$ | next[4] = −1 | 4 − (−1) = 5 位 |
| 2 | 第 9 次比较，$P_3 \ne T_8$ | next[3] = 0 | 3 − 0 = 3 位 |
| 3 | 第 12 次比较，$P_2 \ne T_{10}$ | next[2] = 0 | 2 − 0 = 2 位 |
| 4 | 第 22 次比较匹配成功 | — | 返回 10 |

**整个过程中目标下标一次都没有回退**。同一对串，朴素的 `naive_search` 要比较 29 次。

#### 朴素与 KMP：代价对照

|  | 朴素匹配 | KMP |
| --- | --- | --- |
| 预处理 | 无 | $O(\lvert P\rvert)$ 建 next |
| 最好 | $O(\lvert P\rvert)$ | $O(\lvert P\rvert)$（含建 next） |
| 最坏 | $O(\lvert T\rvert\cdot\lvert P\rvert)$ | $O(\lvert T\rvert + \lvert P\rvert)$ |
| 目标下标 | 会回溯 | 只增不减 |
| 额外空间 | 无 | $O(\lvert P\rvert)$ 的 next 表 |
| next 复用 | — | 同一模式跨多个目标只算一次 |



## 3.4 KMP 的另一个用途：求最小循环节

特征向量算出来的那个量——前缀里「最长的相同前缀与后缀」——本身还回答另一个问题：**一个串最短是由多长的一段反复拼成的？** 上机考试里常见的「循环串」「字符串乘方」「前缀中的周期」三类题，核心都是这一件事。

**两个定义。** 串 $s$ 长为 $n$。

- 既是 $s$ 的真前缀、又是 $s$ 的真后缀的子串叫 $s$ 的**真边界**（`abab` 的真边界有 `ab` 和空串）；
- 正整数 $p$ 叫 $s$ 的**周期**，当且仅当对所有 $0 \le i < n-p$ 都有 $s_i = s_{i+p}$。

**定理：$s$ 有长为 $b$ 的真边界，当且仅当 $n-b$ 是 $s$ 的周期。所以最小周期 = $n$ − 最长真边界的长度。**

证明只需把两边展开：长为 $b$ 的真边界说的是 $s_0 s_1 \cdots s_{b-1} = s_{n-b} s_{n-b+1} \cdots s_{n-1}$，也就是对所有 $0 \le i < b$ 有 $s_i = s_{i+(n-b)}$；令 $p = n-b$，这恰好是「对所有 $0 \le i < n-p$ 有 $s_i = s_{i+p}$」——**同一组等式的两种读法**。边界越长周期越短，最长的边界就对应最小的周期。

**边界长度怎么算。** 3.2 节的特征向量回答的正是「前缀的最长相同前后缀有多长」，只是用的是**优化版**。求周期要用去掉那一步优化的版本（就是 lps 表）——回退链一模一样，只是不做 `next[i] = next[k]` 的借用：

```cpp file=code/ch04/pattern_matching/modern.hpp#border-lengths
/// 未优化的失效函数：border[i] 是前缀 s[0..i] 的**最长真边界**长度——
/// 既是它的真前缀、又是它的真后缀的最长那一段有多长。
///
/// 这就是 build_next 去掉「优化」那一步之后的数，只是下标错开一位、没有 −1：
/// 未优化的 next[i+1] == border[i]。回退 `k = border[k - 1]` 与 build_next 的
/// `k = next[k]` 是同一个动作。
///
/// **求周期不能拿 build_next 代替它。** 优化版的 `next[i] = next[k]` 专为匹配服务：
/// 当 P[i] == P[k] 时它跳过一个注定失配的落点，于是 next[i] 不再是边界长度。
/// 例如 "aaaa" 的优化版 next 是 {−1,−1,−1,−1}，而边界长度是 {0,1,2,3}。
[[nodiscard]] inline std::vector<std::size_t> border_lengths(std::string_view s) {
    const std::size_t n = s.size();
    std::vector<std::size_t> border(n);
    for (std::size_t i = 1; i < n; ++i) {
        std::size_t k = border[i - 1];  // 先试着把上一个前缀的最长边界延长一个字符
        while (k > 0 && s[i] != s[k]) {
            k = border[k - 1];  // 延长不了，退到「边界的边界」再试
        }
        if (s[i] == s[k]) {
            ++k;
        }
        border[i] = k;
    }
    return border;
}
```

```python file=code/ch04/pattern_matching/modern.py#border-lengths
def border_lengths(s: str) -> list[int]:
    """未优化的失效函数：border[i] 是前缀 s[0..i] 的最长真边界长度。

    求周期不能拿 build_next 代替：优化版 next[i] = next[k] 不再是边界长度，
    例如 "aaaa" 的优化版 next 是 [-1, -1, -1, -1]，边界长度是 [0, 1, 2, 3]。
    """
    border = [0] * len(s)
    for i in range(1, len(s)):
        k = border[i - 1]
        while k > 0 and s[i] != s[k]:
            k = border[k - 1]
        if s[i] == s[k]:
            k += 1
        border[i] = k
    return border
```

**陷阱一：优化版 next 不能拿来求周期。** `next[i] = next[k]` 是专为匹配做的：$P_i = P_k$ 时，退到 $k$ 注定再失配一次，于是直接跳过这个落点。对匹配而言那个落点没用，对周期而言它恰恰是答案。

| i | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| s[i] | a | a | a | a |
| 优化版 next[i] | −1 | −1 | −1 | −1 |
| border[i] | 0 | 1 | 2 | 3 |

拿「前缀长 − next」去算前缀 `aaa` 的周期，得到 $3-(-1)=4$，比前缀本身还长；用 border 算是 $3-2=1$，才是正确答案。在 $\{a,b\}$ 上长度不超过 10 的全部串、全部前缀上统计过：优化版给出错误周期的前缀**数以千计**，这不是个别串的巧合。

```cpp file=code/ch04/pattern_matching/modern.hpp#minimal-period
/// 最小周期 p：满足 s[i] == s[i+p]（对所有 0 ≤ i < n−p）的最小正整数。
/// 定理：p = n − （整串的最长真边界长度）。空串约定返回 0。
///
/// 注意 p 不一定整除 n："ababa" 的最小周期是 2，但它不是某个串重复若干次。
[[nodiscard]] inline std::size_t minimal_period(std::string_view s) {
    const std::size_t n = s.size();
    if (n == 0) {
        return 0;
    }
    return n - border_lengths(s)[n - 1];
}

/// s 能否写成某个**更短**的串重复至少两次（「循环串」问题）。
///
/// 两个条件缺一不可：
///   n % p == 0 —— 周期不整除长度就拼不回整串（"ababa"）；
///   p < n      —— 边界为 0 时 p == n，而 n % n == 0 **恒成立**，
///                 漏掉这一条会把 "abcd" 这种毫无重复的串也判成循环串。
[[nodiscard]] inline bool is_repetition(std::string_view s) {
    const std::size_t n = s.size();
    const std::size_t p = minimal_period(s);
    return p < n && n % p == 0;
}

/// 最大的 K，使 s 恰好是某个串重复 K 次（「字符串乘方」问题）。
/// 不是循环串时 K = 1（s 就是它自己重复一次）；空串约定返回 0。
[[nodiscard]] inline std::size_t repetition_count(std::string_view s) {
    if (s.empty()) {
        return 0;
    }
    return is_repetition(s) ? s.size() / minimal_period(s) : 1;
}
```

```python file=code/ch04/pattern_matching/modern.py#minimal-period
def minimal_period(s: str) -> int:
    """最小周期 p = n - 整串的最长真边界长度；空串约定返回 0。"""
    if not s:
        return 0
    return len(s) - border_lengths(s)[-1]


def is_repetition(s: str) -> bool:
    """s 能否写成更短的串重复至少两次。

    p < n 不能省：边界为 0 时 p == n，而 n % n == 0 恒成立。
    """
    p = minimal_period(s)
    return p < len(s) and len(s) % p == 0


def repetition_count(s: str) -> int:
    """最大的 K，使 s 是某个串重复 K 次；不是循环串时为 1，空串为 0。"""
    if not s:
        return 0
    return len(s) // minimal_period(s) if is_repetition(s) else 1
```

**陷阱二：边界为 0 时，「整除」不等于「循环」。** 判断 $s$ 是否由一个更短的串重复而成，要同时满足 $n \bmod p = 0$ 与 $p < n$。边界为 0 时 $p = n$，而 $n \bmod n = 0$ **恒成立**——只写第一个条件，`abcd` 就被当成了循环串。

四个例子：

| s | `border_lengths(s)` | `minimal_period` | `is_repetition` | `repetition_count` |
| --- | --- | --- | --- | --- |
| `abcabcabc` | 0 0 0 1 2 3 4 5 6 | 9 − 6 = 3 | true | 3 |
| `ababa` | 0 0 1 2 3 | 5 − 3 = 2 | false | 1 |
| `abcd` | 0 0 0 0 | 4 − 0 = 4 | false | 1 |
| `aaaa` | 0 1 2 3 | 4 − 3 = 1 | true | 4 |

`ababa` 的最小周期是 2，但 2 不整除 5，它**不是**某个串的整数次重复；`abcd` 没有非空真边界，最小周期就是它自己的长度。

**三类题怎么落到这组函数上。**

| 题型 | 问什么 | 用什么 |
| --- | --- | --- |
| 循环串 | $s$ 能否写成更短的串重复至少两次 | `is_repetition(s)` |
| 字符串乘方 | 最大的 $K$，使 $s$ 是某串重复 $K$ 次 | `repetition_count(s)` |
| 前缀中的周期 | 逐个前缀报出 $K > 1$ 的那些 | 对 `border` 每个下标 $i$，长 $i+1$ 的前缀套同一判断 |

整个串只算一遍失效函数，总代价 $O(n)$。下面两道 OJ 题正好是后两类。

#### 示例OJ02406: 字符串乘方

http://cs101.openjudge.cn/practice/02406/

> 给定两个字符串 a 和 b，定义 `a*b` 为它们的连接。例如 a = "abc"、b = "def"，则 `a*b = "abcdef"`。如果把连接看成乘法，非负整数的乘方按通常方式定义：$a^0 = $ ""（空串），$a^{n+1} = a * (a^n)$。
>
> **输入**
>
> 每个测试样例是一行可打印字符，用 s 表示。s 的长度至少为 1，不超过一百万。最后一个测试样例后面是一个点号作为一行。
>
> **输出**
>
> 对每个 s，输出最大的 n，使得存在一个 a，让 $s = a^n$。
>
> 样例输入
>
> ```
> abcd
> aaaa
> ababab
> .
> ```
>
> 样例输出
>
> ```
> 1
> 4
> 3
> ```
>
> 来源: Waterloo local 2002.07.01
>
> 
>
> 这就是 `repetition_count`：求出整串的最长真边界 `next[-1]`，最小周期 `p = n - next[-1]`；`p` 整除 `n` 就输出 `n // p`，否则输出 1。注意这里不必单独判 `p < n`：边界为 0 时 `p == n`，`n // p` 恰好是 1，与「否则输出 1」一致。
>
> ```python
> import sys
> 
> while True:
>     s = sys.stdin.readline().strip()
>     if s == '.':
>         break
>     n = len(s)
>     next = [0] * len(s)       # 未优化的失效函数，即 border_lengths
>     j = 0
>     for i in range(1, n):
>         while j > 0 and s[i] != s[j]:
>             j = next[j - 1]
>         if s[i] == s[j]:
>             j += 1
>         next[i] = j
>     p = len(s) - next[-1]     # 最小周期
>     if n % p == 0:
>         print(n // p)
>     else:
>         print(1)
> ```



#### 示例OJ01961: 前缀中的周期

http://cs101.openjudge.cn/practice/01961/

> 一个字符串的前缀是从第一个字符开始的连续若干个字符，例如 "abaab" 共有 5 个前缀，分别是 a、ab、aba、abaa、abaab。
>
> 我们希望知道一个 N 位字符串 S 的前缀是否具有循环节。换言之，对于每一个从头开始的长度为 i（i 大于 1）的前缀，是否由重复出现的子串 A 组成，即 AAA...A（A 重复出现 K 次，K 大于 1）。如果存在，请找出最短的循环节对应的 K 值（也就是这个前缀串的所有可能重复节中，最大的 K 值）。
>
> **输入**
>
> 输入包括多组测试数据。每组测试数据包括两行。第一行是字符串 S 的长度 N（2 <= N <= 1 000 000）；第二行是字符串 S。输入数据以只包括一个 0 的行作为结尾。
>
> **输出**
>
> 对于每组测试数据，第一行输出 "Test case #" 和测试数据的编号。接下来的每一行，输出前缀长度 i 和重复次数 K，中间用一个空格隔开。前缀长度需要升序排列。在每组测试数据的最后输出一个空行。
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
>
> 
>
> 对每个长度 `i` 的前缀，`k = i - next[i-1]` 是它的最小周期。**这里两个条件缺一不可**：`i % k == 0`，且 `i // k > 1`（即 `k < i`，陷阱二）——漏了后者，每个没有边界的前缀都会以 K = 1 被报出来。
>
> ```python
> def kmp_next(s):
>     # 未优化的失效函数：next[i] 是 s[0..i] 的最长相等前后缀长度
>     next = [0] * len(s)
>     j = 0
>     for i in range(1, len(s)):
>         while s[i] != s[j] and j > 0:
>             j = next[j - 1]
>         if s[i] == s[j]:
>             j += 1
>         next[i] = j
>     return next
> 
> 
> def main():
>     case = 0
>     while True:
>         n = int(input().strip())
>         if n == 0:
>             break
>         s = input().strip()
>         case += 1
>         print("Test case #{}".format(case))
>         next = kmp_next(s)
>         for i in range(2, len(s) + 1):
>             k = i - next[i - 1]       # 长为 i 的前缀的最小周期
>             if (i % k == 0) and i // k > 1:
>                 print(i, i // k)
>         print()
> 
> 
> if __name__ == "__main__":
>     main()
> ```



# 4 习题选讲

- **给出使 $s_1 + s_2 = s_2 + s_1$ 成立的所有可能条件**（$+$ 为连接）。结论很漂亮：当且仅当两者都是同一个串的重复。
- **线性时间判断 $T$ 是否是 $T'$ 的循环反转**（如 `arc` 与 `car`）。长度相同，且 $T$ 是 $T'T'$ 的子串——用 KMP 找。不要先反转再找，拿 `arc` / `car` 一试就露馅。
- **求 `BAAABBBAA` 的特征向量**，并与目标 `BAAABBBCDDDCCHHHHBBBAAABBBAADD` 匹配，画出过程。优化版 next 是 `-1 0 0 0 -1 1 1 0 0`。
- **简单行编辑程序**：行插入、行删除、改变当前行指针、分页显示、查找和替换。查找必须自己实现 KMP（或其他模式匹配算法），不允许用编程环境提供的查找算法。



---

# 本章小结

- **字符串是元素限定为字符、操作按整段的线性表。** `char` 是字节不是字符；比较按编码单元的字典序，两个裸字面量之间的 `<` 比的是地址。
- **变长存储 = 顺序存放 + 类管理缓冲区。** 长度一变就重新申请、拷贝、释放，追加一个字符是 $O(n)$；三法则第三次出场，拷贝赋值先备新、再释放旧。
- 接口口径：`find` 返回 `optional` 不用 `-1`；`substr` 越界抛异常而非 `return NULL`；修改器返回 `String&`。
- **朴素匹配**失配右移一位，目标回溯，最坏 $O(|T|\cdot|P|)$，平均不到 $2|T|$ 次比较。原书两个匹配算法的返回值一律差 1，正确的是 `j - m`。
- **KMP**：next 只依赖模式、可复用；目标下标只增不减，整体 $O(|T|+|P|)$。
- **最小周期 = $n$ − 最长真边界。** 求周期要用未优化的 border（lps），不能用优化版 next；判断循环串要同时满足 $n \bmod p = 0$ 与 $p < n$。
