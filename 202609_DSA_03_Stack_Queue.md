# DSA 栈与队列

*Updated 2026-09-17 GMT+8*
 *Compiled by Hongfei Yan (2026 Fall)*
https://github.com/GMyhf/dsa-modernization

**知识点**：栈的 ADT 与 LIFO；顺序栈、链式栈及其比较；后缀表达式求值；
运行栈、栈帧与递归深度的实测；显式栈改写；队列的 ADT 与 FIFO；
顺序队列的假溢出、循环队列与「牺牲一格」；链式队列；限制存取点的表。

> 本章要回答三个问题
>
> 1. **在线性表上只加一条限制，能换来什么？** 只在一端进出是**栈**（LIFO），一端进另一端出是**队列**（FIFO）。
> 2. **递归为什么会崩，崩在哪里？** 运行栈、栈帧，以及一组会推翻直觉的实测数字。
> 3. **「空栈弹出」是错误，还是一种正常状态？** 这个判断决定了接口怎么写。
>
> 一句话概括：**栈和队列不是新的存储结构，是加了限制的线性表。限制换来的是：每个操作都能做到 $O(1)$。**



**先跑一遍**

```cpp file=code/ch03/array_stack/demo.cpp
// 第 3 章「先跑一遍」：用教学版 ArrayStack 走一遍 push / top / pop。
// 编译运行：
//   g++ -std=c++17 -I code/ch03/array_stack code/ch03/array_stack/demo.cpp -o demo && ./demo
#include "teaching.hpp"

#include <iostream>

int main() {
    ArrayStack<int> stack;
    stack.push(1);
    stack.push(2);
    stack.push(3);

    // top() 返回 optional：有值才解引用，空栈不会崩
    if (auto value = stack.top()) {
        std::cout << "栈顶是 " << *value << '\n';
    }

    std::cout << "依次弹出:";
    while (auto value = stack.pop()) {
        std::cout << ' ' << *value;
    }
    std::cout << "\n空栈再弹? " << (stack.pop() ? "有值" : "空") << '\n';
}
```

```bash
c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch03/array_stack \
    code/ch03/array_stack/demo.cpp -o /tmp/stack-demo
/tmp/stack-demo
```

```console
栈顶是 3
依次弹出: 3 2 1
空栈再弹? 空
```

后进先出：最后压入的 3 最先出来。空栈上 `pop()` 返回空 optional，不打印、不崩溃。

循环队列牺牲一个槽位区分空与满，所以逻辑容量 3 实际申请 4 个槽：

```cpp file=code/ch03/queue/demo.cpp
// 第 3 章「先跑一遍」：用教学版 ArrayQueue 走一遍 enqueue / dequeue，
// 顺便看看「牺牲一个槽位」的效果——逻辑容量 3 就真的只装得下 3 个。
// 编译运行：
//   g++ -std=c++17 -I code/ch03/queue code/ch03/queue/demo.cpp -o demo && ./demo
#include "teaching.hpp"

#include <iostream>

int main() {
    ArrayQueue<int> queue(3);
    if (!queue.enqueue(1) || !queue.enqueue(2) || !queue.enqueue(3)) {
        std::cout << "入队失败\n";
        return 1;
    }
    std::cout << "逻辑容量 3 时再入队? " << (queue.enqueue(4) ? "成功" : "已满") << '\n';
    std::cout << "依次出队:";
    while (auto value = queue.dequeue()) {
        std::cout << ' ' << *value;
    }
    std::cout << '\n';
}
```

```bash
c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch03/queue \
    code/ch03/queue/demo.cpp -o /tmp/queue-demo
/tmp/queue-demo
```

```console
逻辑容量 3 时再入队? 已满
依次出队: 1 2 3
```



# 1 栈

## 1.1 栈的抽象数据类型

**栈**（stack）是限定仅在**一端**进行插入和删除运算的线性表。该端称为**栈顶**（top），另一端称为**栈底**（bottom）。元素按**后进先出**（LIFO，last in first out）的次序访问。

<img src="https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-1.png" alt="图 3.1 栈的示意图" style="zoom:67%;" />

<center>图  栈的示意图。进和出都在栈顶这一端，栈底不动</center>



**抽象数据类型描述的是「一组运算」。** 在 C++ 里，模板本身已经承担了这层抽象——`ArrayStack<T>` 提供哪些运算，由它的接口决定，
不需要继承任何东西。我们不关心它是否继承自某个 `Stack<T>`，只关心它有没有`push`、`pop`、`top` 这几个运算。所以这一节要定下来的是**这张表**：

| 运算      | 含义                                   | 时间代价  |
| --------- | -------------------------------------- | --------- |
| `push(x)` | 把 x 压到栈顶                          | 摊还 O(1) |
| `pop()`   | 弹出栈顶并把它带回来；空栈返回「没有」 | O(1)      |
| `top()`   | 只看栈顶，不弹出；空栈返回「没有」     | O(1)      |
| `empty()` | 栈里还有没有元素                       | O(1)      |
| `size()`  | 栈里有几个元素                         | O(1)      |
| `clear()` | 清空                                   | O(1)      |

表里有两处「空栈返回『没有』」。这四个字在 C++17 里有一个精确的表达方式：`std::optional`。





## 1.2 顺序栈

采用顺序存储结构的栈称为**顺序栈**，需要一块连续的区域存储元素。
首先要确定：**数组的哪一端表示栈顶？**

- 把**第 0 个位置**当栈顶 —— 每次 `push` / `pop` 都要把所有元素后移或前移一位，$O(n)$；
- 把**最后一个元素的位置**当栈顶 —— 新元素加在表尾、出栈也删表尾，$O(1)$。

顺序栈一律选后者。这是「选对了就没有代价」的例子。

### 教学版：完整实现

下面是一份**完整的、能直接编译运行的**顺序栈。一个文件、一个类。是连续数组、栈顶在表尾、满了就把容量翻倍。

```cpp file=code/ch03/array_stack/teaching.hpp
// 顺序栈 ArrayStack —— 教学版。
// 与 modern.hpp（工程版）的分工：
//   教学版  遵守三法则（析构 + 拷贝构造 + 拷贝赋值），正确，但拷贝多一点；
//   工程版  在此之上补齐移动构造/移动赋值、强异常保证、编译期类型约束。
#pragma once

#include <cstddef>
#include <optional>

template <typename T>
class ArrayStack {
public:
    using value_type = T;
    using size_type = std::size_t;

    // 构造：先要一小块数组。容量不够时会自动翻倍，所以初值给多少都不影响正确性。
    explicit ArrayStack(size_type initial_capacity = 8)
        : data_(new T[initial_capacity]), capacity_(initial_capacity), size_(0) {}

    // 析构：数组是 new[] 来的，就得 delete[] 回去。
    ~ArrayStack() { delete[] data_; }

    // 拷贝构造：必须自己写。
    // 不写的话编译器生成的版本会把 data_ 这根指针照抄一份，于是两个栈指向同一块
    // 内存，各析构一次 —— 同一块内存被释放两次。原书 arrStack 正是漏了这个。
    ArrayStack(const ArrayStack& other)
        : data_(new T[other.capacity_]), capacity_(other.capacity_), size_(other.size_) {
        for (size_type i = 0; i < size_; ++i) {
            data_[i] = other.data_[i];
        }
    }

    // 拷贝赋值：同理。注意三件事的顺序——先把新数组备好，再释放旧的，最后接管。
    ArrayStack& operator=(const ArrayStack& other) {
        if (this == &other) {   // 自己赋值给自己，什么都不用做
            return *this;
        }
        T* fresh = new T[other.capacity_];
        for (size_type i = 0; i < other.size_; ++i) {
            fresh[i] = other.data_[i];
        }
        delete[] data_;
        data_ = fresh;
        capacity_ = other.capacity_;
        size_ = other.size_;
        return *this;
    }

    // 入栈。满了就翻倍，所以不会有「栈满溢出」这回事。
    void push(const T& value) {
        if (size_ == capacity_) {
            grow();
        }
        data_[size_] = value;
        ++size_;
    }

    // 出栈并把元素带回来。空栈返回空的 optional，不是错误，也不打印任何东西。
    std::optional<T> pop() {
        if (empty()) {
            return std::nullopt;
        }
        --size_;
        return data_[size_];
    }

    // 只看栈顶，不弹出。空栈同样返回空 optional。
    std::optional<T> top() const {
        if (empty()) {
            return std::nullopt;
        }
        return data_[size_ - 1];
    }

    bool empty() const { return size_ == 0; }
    size_type size() const { return size_; }
    size_type capacity() const { return capacity_; }

    // 清空：把长度归零就行，已经申请的数组留着接着用。
    void clear() { size_ = 0; }

private:
    // 扩容：申请一块两倍大的，把老元素搬过去，再把老的还回去。
    // 每个元素在均摊意义下只被搬运常数次，所以 push 的摊还代价仍是 O(1)。
    void grow() {
        size_type next = (capacity_ == 0) ? 1 : capacity_ * 2;
        T* fresh = new T[next];
        for (size_type i = 0; i < size_; ++i) {
            fresh[i] = data_[i];
        }
        delete[] data_;       // 先搬完再释放旧的，顺序反了就会读到已释放的内存
        data_ = fresh;
        capacity_ = next;
    }

    T* data_;             // 指向底层数组
    size_type capacity_;  // 数组能放多少个
    size_type size_;      // 现在放了几个，同时也是下一个空位的下标
};
```

把它存成 `teaching.hpp`，配上本章开头那个 `demo.cpp`，一条命令就能跑：

```bash
g++ -std=c++17 -Wall -Wextra demo.cpp -o demo && ./demo
```

### 关键要点

**1. 空栈上的 `pop`/`top` 返回空 `optional`。**
`std::optional<T>` 把「有没有值」搬进了**类型**里，取值之前必须先判断。**空栈不是错误，是一种可预期的状态**，所以它返回空盒子而不是抛异常；真正的错误（参数非法、容量溢出）才抛异常。

**2. 拷贝构造和拷贝赋值必须自己写。**

规则叫**三法则**：一个类只要自己写了析构函数、拷贝构造、拷贝赋值中的**任意一个**，通常这三个都得写。原因很直白——你之所以要写析构函数，是因为你在管资源；既然在管资源，编译器那份「逐成员照抄」的拷贝就一定是错的。

**3. 翻倍扩容让 `push` 的摊还代价保持 O(1)。**
`grow()` 每次把容量乘 2，而不是加 1。差别不是常数：加 1 的话，push n 个元素总共要搬$1+2+\cdots+n = O(n^2)$ 次；翻倍的话，总搬运次数是 $1+2+4+\cdots+n < 2n$，平摊到每次 push 就是常数。

顺带一提 `grow()` 里那三行的**顺序**：先申请新数组、再搬元素、最后才 `delete[]` 旧的。反过来写（先释放再搬）就是读已经还回去的内存，ASan 当场报 `heap-use-after-free`。

**4. `new T[n]` 有一条限制，值得知道。**
它会把整块槽位**默认构造**出来。所以 `T` 必须能默认构造——一个只有带参构造函数的类放不进这个栈。

**5. 容器里一个 `cout` 都没有。**
**数据结构负责数据结构，报错交给调用方。** 



## 1.3 链式栈

采用链式存储结构的栈称为链式栈。结点分散在堆上，压栈只是接一个新结点，**不需要连续空间，也没有"栈满"这回事**——这正是它与顺序栈的核心差别。

<img src="https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-4.png" alt="图3.4 链式栈示意" style="zoom:67%;" />

图 3.4　链式栈示意。栈顶就是链表的第一个结点，`push` 在链头插入、`pop` 删链头，两者都是 O(1)；把栈顶放在链尾就得从头走到尾，退化成 O(n)。代价是每个元素多一根指针（结构性开销）。

### 教学版：完整实现

接口形状和 1.2 的 `ArrayStack` 刻意保持一致——同一个抽象数据类型，换一种存储结构，两者才好拿来对比。

```cpp file=code/ch03/linked_stack/teaching.hpp
// 链式栈 LinkedStack —— 教学版。
//
// 一个文件、一个类、能直接编译运行，给「第一次读这一节」的人看。
// 本节要教的是「同一个 ADT 换一种存储结构」：顺序栈用连续数组，链式栈用结点串联。
//
// 与 modern.hpp（工程版）的分工：
//   教学版  三法则（析构 + 拷贝构造 + 拷贝赋值），正确，但拷贝多一点；
//   工程版  在此之上补齐移动语义、拷贝失败时的清理、零拷贝的 peek()。
#pragma once

#include <cstddef>
#include <optional>

template <typename T>
class LinkedStack {
public:
    using value_type = T;
    using size_type = std::size_t;

    // 链式栈**不需要预设容量**，所以构造函数没有参数。
    // 原书的 `lnkStack(int defSize)` 是从顺序栈那边照抄过来的，那个参数一次都没用过。
    LinkedStack() : top_(nullptr), size_(0) {}

    ~LinkedStack() { clear(); }

    // 三法则：这个类自己管着一串 new 出来的结点，拷贝必须自己写。
    // 不写的话两个栈会共享同一串结点，各析构一次 → 二次释放。
    // 原书 lnkStack 有析构函数却没有这两个，与顺序栈是同一个错误。
    LinkedStack(const LinkedStack& other) : top_(nullptr), size_(0) {
        copy_from(other);
    }

    LinkedStack& operator=(const LinkedStack& other) {
        if (this == &other) {
            return *this;
        }
        clear();
        copy_from(other);
        return *this;
    }

    // 入栈：造一个新结点，让它指向原来的栈顶，再让栈顶指向它。
    // **没有「栈满」这回事**——这正是链式栈相对顺序栈最大的差别。
    void push(const T& value) {
        Node* fresh = new Node;
        fresh->value = value;
        fresh->next = top_;
        top_ = fresh;
        ++size_;
    }

    // 出栈：把栈顶结点摘下来，取走它的值，再释放它。空栈返回空 optional。
    std::optional<T> pop() {
        if (empty()) {
            return std::nullopt;
        }
        Node* dying = top_;
        T value = dying->value;
        top_ = dying->next;
        delete dying;
        --size_;
        return value;
    }

    std::optional<T> top() const {
        if (empty()) {
            return std::nullopt;
        }
        return top_->value;
    }

    bool empty() const { return top_ == nullptr; }
    size_type size() const { return size_; }

    // 逐个释放结点。**用循环，不要用递归**——链长十万级时递归析构会把运行栈撑爆。
    // 第 5 章有实测数字。
    void clear() {
        while (top_ != nullptr) {
            Node* dying = top_;
            top_ = top_->next;
            delete dying;
        }
        size_ = 0;
    }

private:
    struct Node {
        T value;
        Node* next;
    };

    // 拷贝一串结点：原栈是「顶 → 底」，新栈也要按同样次序串起来，
    // 所以从原栈的顶开始走，每次把新结点接到上一个新结点的后面。
    void copy_from(const LinkedStack& other) {
        Node** tail = &top_;             // 指向「下一个新结点该挂在哪」
        for (Node* source = other.top_; source != nullptr; source = source->next) {
            Node* fresh = new Node;
            fresh->value = source->value;
            fresh->next = nullptr;
            *tail = fresh;
            tail = &fresh->next;
            ++size_;
        }
    }

    Node* top_;           // 栈顶结点；空栈时是 nullptr
    size_type size_;      // 结点个数
};
```

三处值得对着上一节看：

- **没有 `capacity`，也没有 `grow()`。** 链式栈不需要连续空间，压多少个都不用扩容。顺序栈那一节大半篇幅在讲扩容，这里整段消失了。
- **代价在别处**：每个元素多带一根 `next` 指针（64 位机上 8 字节），而且结点分散在堆上，缓存局部性不如顺序栈的连续数组。
- **`clear()` 用循环，不用递归。** 链式结构最自然的写法是递归释放，但深链会耗尽运行栈。教学版的测试用 80 万个结点压栈再整体析构，正是为这条兜底：把 `clear()` 换成递归释放，AddressSanitizer 当场报`stack-overflow`，回溯指到递归那一行。



## 1.4 表达式求值

栈的应用非常广泛，只要满足后进先出的特性都可以使用栈结构。例如，记录网页访问历史、保存文本编辑器中的undo序列、编译栈中函数调用地址和参数的保存、二叉树的深度优先周游等。下面通过一些简单的实例来具体说明如何使用栈解决实际问题。

表达式求值是程序设计语言编译器中的一个最基本的问题。表达式是由常量、变量、运算符、函数调用等按一定规则组合而成的。为了讨论方便，在不失一般性的前提下，下面以简化的整型四则运算表达式为例来说明栈在表达式计算中的作用。



> 表达式的定义可以用**“巴科斯范式（BNF）”**的形式化语言描述，就是教计算机**“如何看懂小学四则运算”**。
>
> 我们可以用**“剥洋葱”**或者**“俄罗斯套娃”**的方式来轻松搞懂它。
>
> ---
>
> **一、为什么搞得这么复杂？**
>
> 人类看到 `1 + 2 * 3`，一眼就知道先算 `2 * 3`，再算 `+ 1`。  
> 但计算机很笨，它看到的只是一串文本字符：`'1'`, `'+'`, `'2'`, `'*'`, `'3'`。计算机怎么知道谁的优先级高？谁跟谁是一伙的？
>
> 书里的这套规则，就是为了**用严密的逻辑把“运算优先级”（括号 > 乘除 > 加减）定死**。
>
> ---
>
> **二、先认识三个“奇怪符号”**
>
> * **`::=`** ：读作**“定义为”**或**“相当于”**。左边是名字，右边是它的具体内容。
> * **`|`** ：读作**“或者”**。
> * **`< >`** ：表示一个**语法成分**（可以理解为一个分类标签，用来装具体内容）。
>
> ---
>
> **三、由浅入深：自底向上看这 5 个层级**
>
> 我们倒着看（从最简单的`<数字>`看到最外层的`<表达式>`），就会发现它就是一层套一层的：
>
> 1. `<数字>`：最底层的砖块
>
> * **规则**：`0 | 1 | 2 | ... | 9`
> * **人话**：就是单个阿拉伯数字，0 到 9 随便挑一个。
>
> 2. `<常数>`：拼成一个多位数
>
> * **规则**：`<数字> | <数字> <常数>`
> * **人话**：
>   * 可以是一个单独的数字（比如 `5`）。
>   * 也可以是一个数字后面跟着另一个常数（比如 `2` 后面跟 `3` 变成 `23`；`1` 后面跟 `23` 变成 `123`）。
>   * **结论**：这就是数学里的**整数**。
>
> 3. `<因子>`：运算的“最小独立单位”
>
> * **规则**：`<常数> | ( <表达式> )`
> * **人话**：一个因子只有两种情况：
>   * 要么就是一个简单的数（常数，比如 `5`）。
>   * 要么就是被**圆括号**包起来的一整串复杂算式（比如 `(1 + 2)`）。
>   * **为什么这么设计？** 因为括号里的东西优先级最高，必须把它当成一个“整体（因子）”来看待！
>
> 4. `<项>`：处理【乘法、除法】的层级
>
> * **规则**：`<因子> * <因子> | <因子> / <因子> | <因子>`
> * **人话**：
>   * 它可以是一个独立的因子（比如 `5`、或者 `(1+2)`）。
>   * 也可以是因子之间用 `*` 或 `/` 连起来（比如 `3 * 5`，或者 `(1+2) * 4`）。
>   * **关键点**：这里**只处理乘除**，绝不允许出现加减号！这就在语法上保证了乘除法的绑定更紧密。
>
> 5. `<表达式>`：处理【加法、减法】的最外层
>
> * **规则**：`<项> + <项> | <项> - <项> | <项>`
> * **人话**：
>   * 一个完整的表达式，就是由几个`<项>`用 `+` 或 `-` 连起来的。
>   * 比如：`<项1> + <项2>`。
>
> ---
>
> **四、实战拆解：电脑如何看懂 `(1 + 2) * 3`？**
>
> 我们用上面的规则把 `(1 + 2) * 3` 套进去：
>
> 1. **先看括号里的 `1 + 2`**：
>    * `1` 和 `2` 是`<常数>`，也是`<因子>`，也是`<项>`。
>    * `<项> + <项>` 组合成了 `<表达式>`（即 `1 + 2`）。
> 2. **看括号 `(1 + 2)`**：
>    * 根据第 3 条规则：`( <表达式> )` 变成了一个**`<因子>`**。
> 3. **看后面的 `* 3`**：
>    * `3` 是`<常数>`，也是一个**`<因子>`**。
> 4. **组合起来**：
>    * 前面的`<因子>` 与 后面的`<因子>` 通过 `*` 连起来：`<因子> * <因子>`。
>    * 根据第 4 条规则，这变成了一个**`<项>`**。
> 5. **最后**：
>    * 这个`<项>`本身就是一个合法的**`<表达式>`**！
>
> ---
>
> **五、总结**
>
> 核心目的就一句话：**通过把算式拆分成 `表达式(加减) -> 项(乘除) -> 因子(括号和数字)` 三个层级，机器在语法上自然而然地实现了“先算括号，再算乘除，最后算加减”。**
>
> 后面课文要讲的**“用栈（Stack）求值”**，就是根据这一套拆解逻辑，利用栈先进后出的特性，一步步把最终的数值算出来。



后缀（逆波兰）表达式**不需要括号，也不需要优先级规则**。求值规则只有两条：

- **遇操作数压栈**；
- **遇操作符弹出两个，算完再压回**。

读到末尾时，栈里剩下的唯一元素就是结果。

原书用 $23 + (34 \times 45) / (5 + 6 + 7)$ 举例，后缀式是 `23 34 45 * 5 6 + 7 + / +`：



| 步骤 | 待处理的后缀表达式（左→右） | 栈的状态（底→顶） | 进行的运算          |
| ---: | --------------------------- | ----------------- | ------------------- |
|    1 | `23 34 45 * 5 6 + 7 + / +`  |                   |                     |
|    2 | `34 45 * 5 6 + 7 + / +`     | 23                |                     |
|    3 | `45 * 5 6 + 7 + / +`        | 23 34             |                     |
|    4 | `* 5 6 + 7 + / +`           | 23 34 45          |                     |
|    5 | `5 6 + 7 + / +`             | 23 1530           | 34 × 45 = 1530 入栈 |
|    6 | `6 + 7 + / +`               | 23 1530 5         |                     |
|    7 | `+ 7 + / +`                 | 23 1530 5 6       |                     |
|    8 | `7 + / +`                   | 23 1530 11        | 5 + 6 = 11 入栈     |
|    9 | `+ / +`                     | 23 1530 11 7      |                     |
|   10 | `/ +`                       | 23 1530 18        | 11 + 7 = 18 入栈    |
|   11 | `+`                         | 23 85             | 1530 / 18 = 85 入栈 |
|   12 |                             | 108               | 23 + 85 = 108 入栈  |

> ⚠️ 第 11 步是这道题的考点：**先弹出的 18 是右操作数**，后弹出的 1530 才是左操作数。
> 减法和除法都不可交换，弹出次序写反，结果就错。

```cpp
[[nodiscard]] inline double evaluate_postfix(std::string_view expression) {
    ArrayStack<double> operands;

    const auto pop_two = [&operands](double& left, double& right) {
        if (operands.size() < 2) {
            throw std::invalid_argument("后缀表达式：操作数不足");
        }
        right = *operands.pop();          // 先弹出的是右操作数
        left = *operands.pop();
    };
    // ... 逐个记号：是数就压栈，是操作符就 pop_two 算完再 push
}
```

>  出错时抛 `std::invalid_argument`（表达式不合法）或 `std::domain_error`（除零）。



#### 示例OJ24588: 后序表达式求值

http://cs101.openjudge.cn/practice/24588/

> 后序表达式由操作数和运算符构成。操作数是整数或小数，运算符有 + - * / 四种，其中 * / 优先级高于 + -。后序表达式可用如下方式递归定义：
>
> 1) 一个操作数是一个后序表达式。该表达式的值就是操作数的值。
> 2) 若a,b是后序表达式，c是运算符，则"a b c"是后序表达式。“a b c”的值是 (a) c (b),即对a和b做c运算，且a是第一个操作数，b是第二个操作数。下面是一些后序表达式及其值的例子(操作数、运算符之间用空格分隔)：
>
> 3.4       值为：3.4
> 5        值为：5
> 5 3.4 +     值为：5 + 3.4
> 5 3.4 + 6 /   值为：(5+3.4)/6
> 5 3.4 + 6 * 3 + 值为：(5+3.4)*6+3
>
> 
>
> **输入**
>
> 第一行是整数n(n<100)，接下来有n行，每行是一个后序表达式，长度不超过1000个字符
>
> **输出**
>
> 对每个后序表达式，输出其值，保留小数点后面2位
>
> 样例输入
>
> ```
> 3
> 5 3.4 +
> 5 3.4 + 6 /
> 5 3.4 + 6 * 3 +
> ```
>
> 样例输出
>
> ```
> 8.40
> 1.40
> 53.40
> ```
>
> 来源: Guo wei
>
> 
>
> 要解决这个问题，需要理解如何计算后序表达式。后序表达式的计算可以通过使用一个栈来完成，按照以下步骤：
>
> 1. 从左到右扫描后序表达式。
> 2. 遇到数字时，将其压入栈中。
> 3. 遇到运算符时，从栈中弹出两个数字，先弹出的是右操作数，后弹出的是左操作数。将这两个数字进行相应的运算，然后将结果压入栈中。
> 4. 当表达式扫描完毕时，栈顶的数字就是表达式的结果。
>
> ```python
> def evaluate_postfix(expression):
>     stack = []
>     tokens = expression.split()
> 
>     for token in tokens:
>         if token in '+-*/':
>             # 弹出栈顶的两个元素
>             right_operand = stack.pop()
>             left_operand = stack.pop()
>             # 执行运算
>             if token == '+':
>                 stack.append(left_operand + right_operand)
>             elif token == '-':
>                 stack.append(left_operand - right_operand)
>             elif token == '*':
>                 stack.append(left_operand * right_operand)
>             elif token == '/':
>                 stack.append(left_operand / right_operand)
>         else:
>             # 将操作数转换为浮点数后入栈
>             stack.append(float(token))
> 
>     # 栈顶元素就是表达式的结果
>     return stack[0]
> 
> # 读取输入行数
> n = int(input())
> 
> # 对每个后序表达式求值
> for _ in range(n):
>     expression = input()
>     result = evaluate_postfix(expression)
>     # 输出结果，保留两位小数
>     print(f"{result:.2f}")
> ```
>
> 这个程序将读取输入行数，然后对每行输入的后序表达式求值，并按要求保留两位小数输出结果。





## 1.5 中缀表达式到后缀表达式的转换

上面那个求值器有个前提：**表达式已经是后缀式了**。可人写出来的是中缀式`23 + (34 * 45) / (5 + 6 + 7)`，中间隔着一步转换。这一步才是**栈最典型的应用**——括号和优先级造成的「先算什么」，全靠一把栈记住。编译器把算术式变成机器指令，走的就是同一条路。



#### <mark>Shunting yard algorightm</mark>

Shunting yard algorightm（调度场算法）是一种用于将中缀表达式转换为后缀表达式的算法。它由荷兰计算机科学家 Edsger Dijkstra 在1960年代提出，用于解析和计算数学表达式。

![image-20240305142138853](https://raw.githubusercontent.com/GMyhf/img/main/img/image-20240305142138853.png)

> <mark>Shunting Yard 算法的主要思想是使用两个栈（运算符栈和输出栈）来处理表达式的符号</mark>。算法按照运算符的优先级和结合性，将符号逐个处理并放置到正确的位置。最终，输出栈中的元素就是转换后的后缀表达式。
>
> 以下是 Shunting Yard 算法的基本步骤：
>
> 1. 初始化运算符栈和输出栈为空。
> 2. 从左到右遍历中缀表达式的每个符号。
>    - 如果是操作数（数字），则将其添加到输出栈。
>    - 如果是左括号，则将其推入运算符栈。
>    - 如果是运算符：
>      - 如果运算符的优先级大于运算符栈顶的运算符，或者运算符栈顶是左括号，则将当前运算符推入运算符栈。
>      - 否则，将运算符栈顶的运算符弹出并添加到输出栈中，直到满足上述条件（或者运算符栈为空）。
>      - 将当前运算符推入运算符栈。
>    - 如果是右括号，则将运算符栈顶的运算符弹出并添加到输出栈中，直到遇到左括号。将左括号弹出但不添加到输出栈中。
> 3. 如果还有剩余的运算符在运算符栈中，将它们依次弹出并添加到输出栈中。
> 4. 输出栈中的元素就是转换后的后缀表达式。



五条规则，从左到右扫描中缀式：

| 遇到     | 做什么                                                       |
| -------- | ------------------------------------------------------------ |
| 操作数   | 直接输出到后缀序列                                           |
| `(`      | 入栈                                                         |
| `)`      | 反复弹出并输出，直到遇到 `(`；`(` 弹掉但**不输出**。没遇到 `(` 就是括号不匹配 |
| 运算符   | 当「栈非空 且 栈顶不是 `(` 且 **栈顶优先级不低于**当前」时反复弹出并输出；然后把当前运算符入栈 |
| 扫描结束 | 栈里剩下的依次弹出输出；若弹出 `(`，说明括号不匹配           |

**第四条里「不低于」三个字是承重的。** 如果写成「高于」，同优先级时就不先弹，`1 - 2 - 3` 会转成 `1 2 3 - -`，求值得 $1-(2-3)=2$；而正确答案是左结合的$(1-2)-3=-4$。测试里有一条专门算这个数，把 `<` 写成 `<=` 它立刻变红。

程序实现涉及字符符号读入、语法检查以及语法错误处理等细节。

```cpp file=code/ch03/expression_eval/modern.hpp#infix-to-postfix
/// 把中缀表达式转换成等价的后缀表达式。例如 "23 + (34 * 45) / (5 + 6 + 7)"
/// → "23 34 45 * 5 6 + 7 + / +"。记号之间用单个空格分隔。
///
/// 是栈最典型的一个应用：/// 括号和优先级造成的「先算什么」全靠一把栈记住。
///
/// 算法就是原书那五条，逐条对应下面的分支：
///
///   (1) 操作数         → 直接输出到后缀序列
///   (2) 开括号 `(`      → 入栈
///   (3) 闭括号 `)`      → 反复弹出并输出，直到遇到开括号；开括号弹掉但不输出。
///                        没遇到开括号就说明括号不匹配
///   (4) 运算符          → 当「栈非空 且 栈顶不是开括号 且 栈顶优先级不低于当前」时，
///                        反复弹出并输出；然后把当前运算符入栈
///   (5) 扫描结束        → 栈里剩下的依次弹出输出；若弹出的是开括号，说明括号不匹配
///
/// 第 (4) 条那个「不低于」是关键：同优先级时也要先弹，这样 `a - b - c` 才会变成
/// `a b - c -`（左结合），而不是 `a b c - -`。
///
/// 与 evaluate_postfix 一样，出错抛 std::invalid_argument，不打印任何东西。
[[nodiscard]] inline std::string infix_to_postfix(std::string_view expression) {
    // 只有四则运算：+ - 同级，* / 同级且更高。开括号在栈里的优先级最低，
    // 这样第 (4) 条的循环碰到它自然会停——但仍要单独判，因为它不参与输出。
    const auto precedence = [](char op) -> int {
        return (op == '*' || op == '/') ? 2 : 1;
    };

    std::string output;
    ArrayStack<char> operators;

    const auto emit = [&output](std::string_view token) {
        if (!output.empty()) {
            output.push_back(' ');
        }
        output.append(token);
    };

    std::size_t i = 0;
    bool expect_operand = true;  // 用来把 "-3" 的负号和二元减号区分开
    while (i < expression.size()) {
        const char c = expression[i];
        if (c == ' ' || c == '\t' || c == '\n') {
            ++i;
            continue;
        }

        if (c == '(') {                                   // (2)
            operators.push(c);
            expect_operand = true;
            ++i;
            continue;
        }

        if (c == ')') {                                   // (3)
            bool matched = false;
            while (const char* top = operators.peek()) {
                const char op = *operators.pop();
                if (op == '(') {
                    matched = true;
                    break;
                }
                emit(std::string_view(&op, 1));
                (void)top;
            }
            if (!matched) {
                throw std::invalid_argument("中缀表达式：右括号没有配对的左括号");
            }
            expect_operand = false;
            ++i;
            continue;
        }

        const bool is_sign = (c == '-' || c == '+') && expect_operand;
        if (!is_sign && (c == '+' || c == '-' || c == '*' || c == '/')) {   // (4)
            while (const char* top = operators.peek()) {
                if (*top == '(' || precedence(*top) < precedence(c)) {
                    break;
                }
                const char op = *operators.pop();
                emit(std::string_view(&op, 1));
            }
            operators.push(c);
            expect_operand = true;
            ++i;
            continue;
        }

        // (1) 操作数。用和 evaluate_postfix 同一套解析，两者才好对拍。
        std::size_t consumed = 0;
        try {
            (void)std::stod(std::string(expression.substr(i)), &consumed);
        } catch (const std::exception&) {
            throw std::invalid_argument(std::string("中缀表达式：无法识别的记号 '") + c + "'");
        }
        emit(expression.substr(i, consumed));
        expect_operand = false;
        i += consumed;
    }

    while (const char* top = operators.peek()) {                            // (5)
        if (*top == '(') {
            throw std::invalid_argument("中缀表达式：左括号没有配对的右括号");
        }
        const char op = *operators.pop();
        emit(std::string_view(&op, 1));
    }

    if (output.empty()) {
        throw std::invalid_argument("中缀表达式：空表达式");
    }
    return output;
}

/// 直接对中缀表达式求值：先转成后缀，再用【算法3.5】求值。
/// 两步都在上面，这里只是把它们接起来——**这正是转换算法存在的理由**。
[[nodiscard]] inline double evaluate_infix(std::string_view expression) {
    return evaluate_postfix(infix_to_postfix(expression));
}
```

转换和求值接起来就是 `evaluate_infix`——**这正是转换算法存在的理由**。


#### 练习OJ24591:中序表达式转后序表达式

http://cs101.openjudge.cn/practice/24591/

> 中序表达式是运算符放在两个数中间的表达式。乘、除运算优先级高于加减。可以用"()"来提升优先级 --- 就是小学生写的四则算术运算表达式。中序表达式可用如下方式递归定义：
>
> 1）一个数是一个中序表达式。该表达式的值就是数的值。
>
> 2) 若a是中序表达式，则"(a)"也是中序表达式(引号不算)，值为a的值。
> 3) 若a,b是中序表达式，c是运算符，则"acb"是中序表达式。"acb"的值是对a和b做c运算的结果，且a是左操作数，b是右操作数。
>
> 输入一个中序表达式，要求转换成一个后序表达式输出。
>
> **输入**
>
> 第一行是整数n(n<100)。接下来n行，每行一个中序表达式，数和运算符之间没有空格，长度不超过700。
>
> **输出**
>
> 对每个中序表达式，输出转成后序表达式后的结果。后序表达式的数之间、数和运算符之间用一个空格分开。
>
> 样例输入
>
> ```
> 3
> 7+8.3 
> 3+4.5*(7+2)
> (3)*((3+4)*(2+3.5)/(4+5)) 
> ```
>
> 样例输出
>
> ```
> 7 8.3 +
> 3 4.5 7 2 + * +
> 3 3 4 + 2 3.5 + * 4 5 + / *
> ```
>
> 来源: Guo wei
>
> 
>
> <mark>接收浮点数，是number buffer技巧。</mark>
>
> ```python
> def infix_to_postfix(expression):
>     precedence = {'+':1, '-':1, '*':2, '/':2}
>     stack = []
>     postfix = []
>     number = ''
> 
>     for char in expression:
>         if char.isnumeric() or char == '.':
>             number += char
>         else:
>             if number:
>                 num = float(number)
>                 postfix.append(int(num) if num.is_integer() else num)
>                 number = ''
>             if char in '+-*/':
>                 while stack and stack[-1] in '+-*/' and precedence[char] <= precedence[stack[-1]]:
>                     postfix.append(stack.pop())
>                 stack.append(char)
>             elif char == '(':
>                 stack.append(char)
>             elif char == ')':
>                 while stack and stack[-1] != '(':
>                     postfix.append(stack.pop())
>                 stack.pop()
> 
>     if number:
>         num = float(number)
>         postfix.append(int(num) if num.is_integer() else num)
> 
>     while stack:
>         postfix.append(stack.pop())
> 
>     return ' '.join(str(x) for x in postfix)
> 
> n = int(input())
> for _ in range(n):
>     expression = input()
>     print(infix_to_postfix(expression))
> ```
>
> 
>
> 接收数据，还可以用<mark>re处理</mark>。
>
> ```python
> # 24591:中序表达式转后序表达式
> # http://cs101.openjudge.cn/practice/24591/
> 
> def inp(s):
>     #s=input().strip()
>     import re
>     s=re.split(r'([\(\)\+\-\*\/])',s)
>     s=[item for item in s if item.strip()]
>     return s
> 
> exp = "(3)*((3+4)*(2+3.5)/(4+5)) "
> print(inp(exp))
> ```





## 1.6 栈与递归

#### 递归为什么非要有栈

被调函数的局部变量**不能静态地占一块固定单元** —— 每调用一次就得有一份，返回时随即释放。这种「执行到调用时才分配」叫**动态分配**，它需要内存里有一块足够大的**运行栈**。



![图3.6 运行时存储器的组织形式](https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-6.png)

图 运行时存储器的组织形式：栈区放具有后进先出特征的数据（函数调用），堆区放不符合 LIFO 的动态分配（例如 `new` 出来的对象）。

栈上一格一格压着的叫**栈帧**（stack frame，或者「活动记录」），至少包含：返回地址、参数、局部变量、必要的保存寄存器。

![图 3.7 活动记录的内容](https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-7.png)

图 3.7　活动记录的内容。调用一次压一格，返回一次弹一格；被调函数里的变量地址因此都是相对于栈顶的相对地址。运行栈也因此又叫活动记录栈或调用栈(call stack)。

同一个函数可以在栈上同时有很多活动记录，每个代表一次不同的调用——对递归函数来说，递归深度就是它在运行栈里栈帧的个数** —— 同一个局部变量在不同层次被分到不同的存储空间。以 `factorial(4)` 为例：

<img src="https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-8.png" alt="图 3.8 递归计算 factorial(4) 时运行栈的变化" style="zoom:67%;" />

图 　(a) 逐层调用依次压栈；(b) 到达出口后按压栈的反序逐层弹出，把结果一层层交回去。

每深一层就多一格活动记录，**深度一旦超过栈区的大小，程序不是「变慢」，而是直接崩。**

#### 运行栈有多大：三个档位，三种结果

递归「需要开辟一个**足够大**的运行栈」。多大算足够大？这是可以量的。
同一份递归源码（每层做一次加法后返回），在一台 Linux 机器上（gcc 13.3，`ulimit -s` 为默认的 8 MB）逐档加深度：

| 构建档 | 20 万层 | 50 万层 | 100 万层 |
| --- | --- | --- | --- |
| `-O0`（不优化） | 通过 | **段错误** | 段错误 |
| `-O1` + ASan/UBSan | 通过 | **stack-overflow** | stack-overflow |
| `-O2` | 通过 | 通过 | **通过** |

把同样的计算改成**显式栈**（数据压进本章的 `ArrayStack`，也就是放到堆上）：三个档位在 **1000 万层**都通过。

#### `-O2` 为什么不崩

**不是因为它栈更大，而是因为编译器把递归消掉了。** 查汇编可以确认：

```text
-O0: recursive_sum 函数体内调用自己的次数 = 2
-O2: recursive_sum 函数体内调用自己的次数 = 0     // 已经变成一个循环
```

> 这条实测的教训**不是**「用 `-O2` 就安全」：
> - 尾调用优化**不是标准保证的**，换个编译器、换个写法就没了；
> - 评测机用什么优化档、什么版本，**这两件事你都控制不了**。
>
> **唯一与版本、评测机都无关的做法是：改写成显式栈。**递归吃的是**运行栈**（默认 8 MB 上限），显式栈吃的是**堆**（可以很大）。



#### 递归吃运行栈，显式栈吃堆

这正是本节的正题。用阶乘作例子，给三个版本：

**【算法3.6】递归**——每一层的返回地址与局部变量都压在运行栈上，深度由进程栈上限决定：

```cpp file=code/ch03/recursion_and_stack/modern.hpp#factorial-recursive
/// 【算法3.6】递归实现。保留原书的递归形状——那正是本节要教的东西。
///
/// 加了原书没有的两道检查：负数是定义域错误，溢出是真错误（D-001 §3）。
/// 原书 `if (n <= 0) return 1;` 把负数静默当成 0 处理，返回 1。
[[nodiscard]] inline factorial_type factorial_recursive(long long n) {
    if (n < 0) {
        throw std::invalid_argument("factorial: 负数没有阶乘");
    }
    if (static_cast<factorial_type>(n) > kMaxFactorialInput) {
        throw std::overflow_error("factorial: 结果超出 64 位无符号范围（20! 是上限）");
    }
    if (n <= 1) {
        return 1;  // 递归出口
    }
    return static_cast<factorial_type>(n) * factorial_recursive(n - 1);
}
```

**【算法3.8】迭代**——不用栈，也不占深度：

```cpp file=code/ch03/recursion_and_stack/modern.hpp#factorial-iterative
/// 【算法3.8】迭代实现。不用栈，也不占运行栈深度。
[[nodiscard]] inline factorial_type factorial_iterative(long long n) {
    if (n < 0) {
        throw std::invalid_argument("factorial: 负数没有阶乘");
    }
    if (static_cast<factorial_type>(n) > kMaxFactorialInput) {
        throw std::overflow_error("factorial: 结果超出 64 位无符号范围（20! 是上限）");
    }
    factorial_type m = 1;
    for (long long i = 2; i <= n; ++i) {
        m *= static_cast<factorial_type>(i);
    }
    return m;
}
```

**【算法3.9】显式栈**——把待处理的数据压进一个自己管理的栈，「模拟编译系统处理递归的机制，使用栈等数据结构保存回溯点」：

```cpp file=code/ch03/recursion_and_stack/modern.hpp#factorial-explicit-stack
/// 【算法3.9】用显式栈模拟递归。
///
/// 这一版存在的意义不是"更快"——它比迭代版慢——而是**演示编译系统处理递归的机制**：
/// 遇到递归规则就压栈，遇到递归出口就出栈返回。原书的话是
/// 「模拟编译系统处理递归的机制，使用栈等数据结构保存回溯点」。
///
/// 关键差别在**数据放在哪**：递归版把每层的返回地址与局部变量放在**运行栈**上，
/// 大小由进程栈上限决定；这一版把待处理的数据压进 ArrayStack，**在堆上**，
/// 只受内存限制。实测数字见书稿 3.1.5 节。
///
/// 原书写的是 `while (s.pop(&tmp))`——传的是**指针**，而同书代码3.1 的栈 ADT
/// 声明的是 `bool pop(T& item)`（引用）。两处对不上（legacy.md 缺陷 3）。
[[nodiscard]] inline factorial_type factorial_with_explicit_stack(long long n) {
    if (n < 0) {
        throw std::invalid_argument("factorial: 负数没有阶乘");
    }
    if (static_cast<factorial_type>(n) > kMaxFactorialInput) {
        throw std::overflow_error("factorial: 结果超出 64 位无符号范围（20! 是上限）");
    }
    ArrayStack<factorial_type> pending;
    for (long long i = n; i > 1; --i) {  // 按递归规则压栈
        pending.push(static_cast<factorial_type>(i));
    }
    factorial_type m = 1;  // 递归出口的返回值
    while (auto top = pending.pop()) {   // 出栈即"递归返回"
        m *= *top;
    }
    return m;
}
```

三者的差别不在快慢（显式栈版最慢），而在**数据放在哪**：前者在运行栈上，受进程栈上限约束；后者在堆上，只受内存约束。
上面那张表量的就是这个差别。



#### 一个有两条递归规则的例子：背包问题

阶乘只有一条递归规则，改写成循环几乎是显然的。给了一个有**两条**递归规则的例子 ——背包问题（更准确地说是子集和判定：能否从若干物品中选出一部分，使重量之和恰好等于背包承重）：



```cpp file=code/ch03/knapsack/modern.hpp#recursive
/// 【算法3.10】递归解法。两条递归规则、两个递归出口，原书的结构一字未改：
///   出口 1：承重恰为 0 → 有解（什么都不再选）
///   出口 2：承重为负，或承重为正但已无物品可选 → 无解
///   规则 1：选第 n-1 件 → 求解 knap(s - w[n-1], n-1)
///   规则 2：不选第 n-1 件 → 求解 knap(s, n-1)
[[nodiscard]] inline std::optional<knapsack_solution> knapsack_recursive(
    int capacity, const std::vector<int>& weights) {
    detail::validate(capacity, weights);
    knapsack_solution chosen;

    // 返回 true 表示 weights[0..n) 中存在一个子集，其和恰为 s
    const auto solve = [&weights, &chosen](auto&& self, int s, std::size_t n) -> bool {
        if (s == 0) {
            return true;  // 递归出口 1
        }
        if (s < 0 || n == 0) {
            return false;  // 递归出口 2
        }
        if (self(self, s - weights[n - 1], n - 1)) {  // 规则 1：选它
            chosen.push_back(n - 1);
            return true;
        }
        return self(self, s, n - 1);  // 规则 2：不选它
    };

    return solve(solve, capacity, weights.size())
               ? std::optional<knapsack_solution>(std::move(chosen))
               : std::nullopt;
}
```

```python file=code/ch03/knapsack/modern.py#recursive
def knapsack_recursive(capacity: int, weights: list[int]) -> list[int] | None:
    """算法3.10：两条递归规则，返回选中物品的下标。"""
    _validate(capacity, weights)
    chosen: list[int] = []

    def solve(remaining: int, count: int) -> bool:
        if remaining == 0:
            return True
        if remaining < 0 or count == 0:
            return False
        if solve(remaining - weights[count - 1], count - 1):
            chosen.append(count - 1)
            return True
        return solve(remaining, count - 1)

    return chosen if solve(capacity, len(weights)) else None
```

两个递归出口、两条递归规则。

#### 把它机械地改写成循环

原书的做法是引入一个显式栈，每帧保存四个域：参数 s 与 n、**返回地址** rd、结果单元 k。返回地址是关键——它记的是"这一层算完之后该回到哪一步继续"，正是编译器为你做的那件事。把"返回地址"写成栈帧里的一个 `stage` 字段：

```cpp file=code/ch03/knapsack/modern.hpp#explicit-stack
/// 【算法3.11】把上面的递归机械地改写成显式栈驱动。
///
/// 原书用 `goto label0/1/2/3` 表示"执行到哪一步"，本书把同一件事写成栈帧里的
/// 一个 `stage` 字段——**语义完全对应**，只是不用 goto：goto 跳进跳出会让编译器
/// 无法保证局部对象的构造与析构配对，在有 RAII 的 C++ 里不能这么写。
///
///   `Enter`      ↔ label0，递归调用入口：判出口，否则按规则 1 展开
///   `AfterRule1` ↔ label1，规则 1（选第 n-1 件）返回后的处理
///   `AfterRule2` ↔ label2，规则 2（不选第 n-1 件）返回后的处理
///
/// 每一帧存原书说的四个域：参数 s 与 n、返回地址（这里是 stage）、结果单元 k。
[[nodiscard]] inline std::optional<knapsack_solution> knapsack_with_explicit_stack(
    int capacity, const std::vector<int>& weights) {
    detail::validate(capacity, weights);

    enum class Stage { Enter, AfterRule1, AfterRule2 };
    struct Frame {
        int s = 0;
        std::size_t n = 0;
        Stage stage = Stage::Enter;
    };

    ArrayStack<Frame> stack;
    stack.push(Frame{capacity, weights.size(), Stage::Enter});
    knapsack_solution chosen;
    bool child_result = false;   // 下层刚刚返回的结果单元 k

    while (!stack.empty()) {
        Frame frame = *stack.pop();

        if (frame.stage == Stage::Enter) {
            if (frame.s == 0) {            // 递归出口 1
                child_result = true;
                continue;                  // 相当于 goto label3：直接向上返回
            }
            if (frame.s < 0 || frame.n == 0) {   // 递归出口 2
                child_result = false;
                continue;
            }
            frame.stage = Stage::AfterRule1;     // 记下"回来时该走哪一步"
            stack.push(frame);
            stack.push(Frame{frame.s - weights[frame.n - 1], frame.n - 1, Stage::Enter});
            continue;
        }

        if (frame.stage == Stage::AfterRule1) {
            if (child_result) {            // 规则 1 成功：第 n-1 件被选中
                chosen.push_back(frame.n - 1);
                continue;                  // k 已是 true，继续上传
            }
            frame.stage = Stage::AfterRule2;     // 回溯，改用规则 2
            stack.push(frame);
            stack.push(Frame{frame.s, frame.n - 1, Stage::Enter});
            continue;
        }

        // Stage::AfterRule2：规则 2 的结果就是本层的结果，原样上传
    }

    return child_result ? std::optional<knapsack_solution>(std::move(chosen)) : std::nullopt;
}
```

```python file=code/ch03/knapsack/modern.py#explicit-stack
def knapsack_with_explicit_stack(capacity: int, weights: list[int]) -> list[int] | None:
    """算法3.11：用栈帧中的返回地址机械模拟递归。"""
    _validate(capacity, weights)

    # -------------------------------------------------------------
    # 1. 状态定义（模拟 CPU 的“程序计数器” PC / 返回地址 Return Address）
    # enter      : 函数入口点（开始执行当前层的逻辑）
    # after_rule1: 从“选择当前物品”的子调用返回后的恢复点
    # after_rule2: 从“不选当前物品”的子调用返回后的恢复点
    # -------------------------------------------------------------
    enter, after_rule1, after_rule2 = range(3)

    # 显式模拟调用栈：
    # 栈帧与递归版 solve(remaining, count) 的参数一一对应，再加上返回地址：
    # (当前剩余容量 remaining, 可选物品数 count, 当前执行阶段 stage)
    stack = [(capacity, len(weights), enter)]

    # 记录最终被选中的物品索引（构成解的路径）
    chosen: list[int] = []

    # 模拟 CPU 的“返回值寄存器”（例如 x86 中的 RAX/EAX）
    # 子调用执行完毕后，将结果（True/False）写入此变量，交由父调用读取
    child_result = False

    while stack:
        # 弹出当前栈顶执行上下文，恢复该层的全部“局部变量”
        # count 表示当前还有前 count 个物品可选（对应下标 0 到 count - 1）
        remaining, count, stage = stack.pop()

        # ==================== 阶段 0：函数入口 ====================
        if stage == enter:
            # Base Case 1: 恰好凑齐容量，递归成功
            if remaining == 0:
                child_result = True
            # Base Case 2: 超过承重，或已无物品可选，递归失败
            elif remaining < 0 or count == 0:
                child_result = False
            else:
                # 分支 1：尝试“选择”第 (count - 1) 个物品
                # [压栈操作 1 - 保存断点]：子调用结束后，需回到 after_rule1 处继续
                stack.append((remaining, count, after_rule1))
                # [压栈操作 2 - 发起子调用]：扣减当前物品重量，可选物品数减 1，进入新的 enter
                stack.append((remaining - weights[count - 1], count - 1, enter))

        # ==================== 阶段 1：分支 1 返回 ====================
        elif stage == after_rule1:
            # 从“返回值寄存器”读取分支 1 的成败
            if child_result:
                # 分支 1 成功：说明拿该物品能凑齐，将其记录进结果集中
                chosen.append(count - 1)
                # 当前层任务完成，直接结束，准备弹出更上一层的断点
            else:
                # 分支 1 失败：回溯，转入分支 2——尝试“不选”第 (count - 1) 个物品
                # [压栈操作 1 - 保存断点]：分支 2 结束后恢复到 after_rule2
                stack.append((remaining, count, after_rule2))
                # [压栈操作 2 - 发起子调用]：容量不变，可选物品数减 1，发起新调用
                stack.append((remaining, count - 1, enter))

        # ==================== 阶段 2：分支 2 返回 ====================
        # elif stage == after_rule2:
        #     pass
        # 说明：分支 2 的结果已经直接留存在 child_result 里了。
        # 这里无需额外代码，当前帧直接随 pop() 销毁，继续回溯上层。

    # 整个搜索结束后，若根调用成功则返回结果集，否则返回 None
    return chosen if child_result else None
```

#### 优化：让每层要记的东西更少

**参数 n 可以由栈深推出**——每递归一层 n 减 1、栈深加 1，所以 `n = n₀ − 栈深`。

于是栈帧从域缩到两个：

```cpp file=code/ch03/knapsack/modern.hpp#optimized
/// 【算法3.12】原书"优化版"的两点观察，本书照单实现：
///
/// 1. **结果单元 k 可以提到栈外**——一旦某层为 true 就逐层上传且不再变化，
///    因此一个函数级变量即可，栈帧里的 `k` 域连同它的反复赋值、进出栈都省掉。
///    （上面那版其实已经这么做了：`child_result` 就在栈外。）
/// 2. **参数 n 可以由栈深推出**——每递归一层 n 减 1、栈深加 1，
///    所以 `n = n0 - 栈深`，栈帧里的 `n` 域也能省掉。
///
/// 于是栈帧从四个域缩到两个（s 与 stage）。这是本节真正的"优化"：
/// 不是让它更快，而是**让每层要记的东西更少**——这正是手工模拟递归的意义。
///
/// 原书这一版另有一处致命问题：它同时把 `stack.top` 当**数据成员**用
/// （`t = stack.top;`）又当**成员函数**用（`stack.top(&tmp);`）。
/// 这在任何一种解释下都编译不过，而且它恰恰依赖代码3.2/3.4 那个 `top` 重名缺陷。
[[nodiscard]] inline std::optional<knapsack_solution> knapsack_optimized(
    int capacity, const std::vector<int>& weights) {
    detail::validate(capacity, weights);

    enum class Stage { Enter, AfterRule1, AfterRule2 };
    struct Frame {
        int s = 0;              // 只剩两个域
        Stage stage = Stage::Enter;
    };

    const std::size_t n0 = weights.size();
    ArrayStack<Frame> stack;
    knapsack_solution chosen;
    bool child_result = false;

    stack.push(Frame{capacity, Stage::Enter});
    std::size_t depth = 1;      // 栈中帧数；当前帧的 n = n0 - (depth - 1)

    while (!stack.empty()) {
        Frame frame = *stack.pop();
        --depth;
        const std::size_t n = n0 - depth;   // 观察 2：n 由栈深推出，不再入栈

        if (frame.stage == Stage::Enter) {
            if (frame.s == 0) { child_result = true; continue; }
            if (frame.s < 0 || n == 0) { child_result = false; continue; }
            frame.stage = Stage::AfterRule1;
            stack.push(frame);
            stack.push(Frame{frame.s - weights[n - 1], Stage::Enter});
            depth += 2;
            continue;
        }

        if (frame.stage == Stage::AfterRule1) {
            if (child_result) { chosen.push_back(n - 1); continue; }
            frame.stage = Stage::AfterRule2;
            stack.push(frame);
            stack.push(Frame{frame.s, Stage::Enter});
            depth += 2;
            continue;
        }
        // AfterRule2：结果原样上传
    }

    return child_result ? std::optional<knapsack_solution>(std::move(chosen)) : std::nullopt;
}
```

```python file=code/ch03/knapsack/modern.py#optimized
def knapsack_optimized(capacity: int, weights: list[int]) -> list[int] | None:
    """算法3.12：栈帧只保存剩余承重和返回地址。"""
    _validate(capacity, weights)

    # -------------------------------------------------------------
    # 1. 状态定义（模拟 CPU 的“程序计数器” PC / 返回地址 Return Address）
    # enter      : 函数入口点（开始执行当前层的逻辑）
    # after_rule1: 从“选择当前物品”的子调用返回后的恢复点
    # after_rule2: 从“不选当前物品”的子调用返回后的恢复点
    # -------------------------------------------------------------
    enter, after_rule1, after_rule2 = range(3)

    # 显式模拟调用栈：
    # 栈帧中只保留绝对必需的两个状态：(当前剩余容量 remaining, 当前执行阶段 stage)
    stack = [(capacity, enter)]

    # 记录最终被选中的物品索引（构成解的路径）
    chosen: list[int] = []

    # 模拟 CPU 的“返回值寄存器”（例如 x86 中的 RAX/EAX）
    # 子调用执行完毕后，将结果（True/False）写入此变量，交由父调用读取
    child_result = False

    size = len(weights)

    # 全局调用深度计数器：
    # 【核心优化】：不需要在每个栈帧里都存“当前处理到第几个物品(count)”。
    # 递归深度与可选物品数是一一对应的，利用公式直接计算，极大节省了栈内存。
    depth = 1

    while stack:
        # 弹出当前栈顶执行上下文，深度减 1
        remaining, stage = stack.pop()
        depth -= 1

        # 通过全局深度逆向推导出当前正在处理的物品索引范围
        # count 表示当前还有前 count 个物品可选（对应下标 0 到 count - 1）
        count = size - depth

        # ==================== 阶段 0：函数入口 ====================
        if stage == enter:
            # Base Case 1: 恰好凑齐容量，递归成功
            if remaining == 0:
                child_result = True
            # Base Case 2: 超过承重，或已无物品可选，递归失败
            elif remaining < 0 or count == 0:
                child_result = False
            else:
                # 分支 1：尝试“选择”第 (count - 1) 个物品
                # [压栈操作 1 - 保存断点]：子调用结束后，需回到 after_rule1 处继续
                stack.append((remaining, after_rule1))
                # [压栈操作 2 - 发起子调用]：剩余容量扣减当前物品重量，进入新的 enter
                stack.append((remaining - weights[count - 1], enter))
                # 同时压入“返回断点”和“新调用”，栈深度增加 2
                depth += 2

        # ==================== 阶段 1：分支 1 返回 ====================
        elif stage == after_rule1:
            # 从“返回值寄存器”读取分支 1 的成败
            if child_result:
                # 分支 1 成功：说明拿该物品能凑齐，将其记录进结果集中
                chosen.append(count - 1)
                # 当前层任务完成，直接结束，准备弹出更上一层的断点
            else:
                # 分支 1 失败：回溯，转入分支 2——尝试“不选”第 (count - 1) 个物品
                # [压栈操作 1 - 保存断点]：分支 2 结束后恢复到 after_rule2
                stack.append((remaining, after_rule2))
                # [压栈操作 2 - 发起子调用]：容量不变，发起新调用
                stack.append((remaining, enter))
                depth += 2

        # ==================== 阶段 2：分支 2 返回 ====================
        # elif stage == after_rule2:
        #     pass
        # 说明：分支 2 的结果已经直接留存在 child_result 里了。
        # 这里无需额外代码，当前帧直接随 pop() 销毁，继续回溯上层。

    # 整个搜索结束后，若根调用成功则返回结果集，否则返回 None
    return chosen if child_result else None
```

**这才是本节真正的"优化"**：不是让它跑得更快，而是让每层要记的东西更少。手工模拟递归的全部意义就在这里——你必须想清楚"每一层到底需要记住什么"，而这正是编译器替你想过的那个问题。



# 2 队列

**队列**（queue）也是一种限制访问点的线性表：一端插入，另一端删除。

- 只允许删除的一端叫**队头**（front），删除叫**出队**（dequeue）；
- 只允许插入的一端叫**队尾**（rear），插入叫**入队**（enqueue）。

按到达顺序释放元素，所以叫**先进先出**（FIFO）表。空队列上的提取是可预期状态，返回 `std::nullopt`。

售票窗口前排队买票就是日常版的队列。

## 2.1 队列的抽象数据类型

根据数据抽象和封装的原则，对队列的操作只能通过队列的抽象数据类型所定义的运算来进行。

| 运算                             | 含义                           |
| -------------------------------- | ------------------------------ |
| `clear()`                        | 变为空队列                     |
| `enqueue(item)`                  | 将 item 插入队尾，成功返回真   |
| `dequeue()` 返回 `std::optional` | 返回队头元素并把它从队列中删除 |
| `front()` 返回 `std::optional`   | 返回队头元素，但不删除         |
| `empty()`                        | 队列已空则返回真               |
| 顺序实现才有`full()`             | 队列已满则返回真               |

**根据具体应用的不同需要，可以适当增删抽象数据类型中所定义的运算**——例如链式队列并不需要判断队列是否满。

队列抽象数据类型中运算的实现方法依赖于队列的存储结构，下面介绍常用的顺序队列和链式队列两种。把这些运算写直接定义在 `ArrayQueue` 与`LinkedQueue` 上。



## 2.2 顺序队列：为什么两头都不能固定

队列**两头都要动**：入队动队尾，出队动队头。如果沿用顺序表的实现方法：

- **把队尾固定在位置 0** → 出队 $O(1)$，但入队必须把当前所有元素向后移一位，$O(n)$；
- **把队尾固定在位置 $n-1$** → 入队 $O(1)$，但出队要移动剩余 $n-1$ 个元素，$O(n)$。

**两头都别固定**：让 `front` 和 `rear` 都在数组里往后走，元素本身**一个都不搬**，两个操作就都是 $O(1)$。

新问题来了：整个队列不断向数组尾部漂移，`rear` 一旦到了末尾，即使数组前端还空着一大片，入队也会报满 —— 这叫**假溢出**。

解决办法是把数组在逻辑上看成一个**环**：下标 0 是下标 `mSize - 1` 的直接后继，位置 `x` 的后继是 `(x + 1) % mSize`。这就是**循环队列**。

<img src="https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-11.png" alt="图 3.11 把数组看成环之后的样子" style="zoom:67%;" />

图 3.11　(a) 初始队列里有 12、17、8、20 四个元素；(b) 两次出队、三次入队之后的样子。入队增加 `rear`，出队增加 `front`，两者都在环上顺时针走。

#### 绕回之后的麻烦：`front == rear` 既可能空、也可能满

数一数就明白：$n$ 个位置的数组，队列有「空、1 个、2 个……$n$ 个」共 $n+1$ 种状态，而固定 `front` 后 `rear` 只有 $n$ 种取值 —— **必有两种状态撞在一起**。顺序队列更常用的办法 —— **牺牲一个槽位**：

```cpp
bool empty() const { return front_ == rear_; }

// 满的判据：rear 再往前走一格就撞上 front。那一格就是被牺牲掉的槽位。
bool full() const { return (rear_ + 1) % slots_ == front_; }

bool enqueue(const T& value) {
    if (full()) { return false; }        // 顺序队列容量固定，这是它与链式队列的核心差别
    data_[rear_] = value;
    rear_ = (rear_ + 1) % slots_;        // 走到末尾就绕回 0，取模不能漏
    return true;
}

std::optional<T> dequeue() {
    if (empty()) { return std::nullopt; }
    T value = data_[front_];
    front_ = (front_ + 1) % slots_;
    return value;
}
```

数组开 $n+1$ 格却只装 $n$ 个元素：`slots_ = 容量 + 1`。这就是「容量 3 时第 4 个入不进去」的原因。



## 2.3 链式队列

**链式队列**（linked queue）是队列的链式实现，本质上是对链表的简化：链接的方向从队列的前端指向队列的尾端，成员 `front` 和 `rear` 分别指向队首和队尾。入队只是把新元素放到链表的尾部并修改 `rear` 使其指向新的结点；出队只是删除表中最前面的那个结点并修改 `front` 使其指向新的队首。结点分散在堆上，所以**没有「队满」这回事**—— 这就是「根据应用增删运算」的具体例子。

除了队头指针，队尾指针是必需的：没有它，每次入队都得从队头走到尾，$O(n)$；有了它，入队和出队都是 $O(1)$。

为了减少访问队首结点的时间代价，这种实现**没有链表中的专用表头虚结点**，代价是两个边界要单独处理：`enqueue` 必须单独处理「插入到空队列」的情况（此时 `front` 和 `rear` 都要指向新结点），`dequeue` 也需考虑「出队后队列变空」的情况。

后一条正是最容易漏的地方：**出队把队列摘空时，队尾指针必须一起置空**，否则它就成了一根指向已释放结点的野指针，下一次入队会写进已释放的内存。


#### 教学版：完整实现

两个类放在同一个文件里，正好对着看：同一个先进先出的抽象数据类型，一个用固定大小的连续数组，一个用堆上的结点。

```cpp file=code/ch03/queue/teaching.hpp
// 队列 —— 教学版。原书【代码3.13】【代码3.14】【代码3.15】。
//
// 一个文件、两个类、能直接编译运行：
//   ArrayQueue   顺序队列（循环队列），元素放在一块固定大小的连续数组里；
//   LinkedQueue  链式队列，结点分散在堆上，队尾指针让入队保持 O(1)。
//
// 与 modern.hpp（工程版）的分工：
//   教学版  三法则（析构 + 拷贝构造 + 拷贝赋值），一行一句，正确但拷贝多一点；
//   工程版  在此之上补齐移动语义与 copy-and-swap。
#pragma once

#include <cstddef>
#include <optional>

// ---------------------------------------------------------------------------
// 顺序队列（循环队列）
//
// 队列两头都要动：入队动队尾，出队动队头。如果队头固定在下标 0，每次出队都要把
// 后面所有元素前移一位，O(n)。所以真正的做法是让队头也往后走——走到数组末尾就
// 绕回下标 0，数组被当成一个圈来用，这就是「循环队列」。
//
// 绕回之后有个麻烦：`front == rear` 既可能是空、也可能是满，分不开。
// 办法是**牺牲一个槽位**：约定「rear 的下一格就是 front」时算满，
// 于是 n 个槽位最多装 n-1 个元素，两种状态就分得开了。本书照办。
// ---------------------------------------------------------------------------
template <typename T>
class ArrayQueue {
public:
    using value_type = T;
    using size_type = std::size_t;

    // capacity 是「最多能装几个元素」，所以内部要多要一个槽位。
    explicit ArrayQueue(size_type capacity)
        : slots_(capacity + 1), data_(new T[capacity + 1]), front_(0), rear_(0) {}

    ~ArrayQueue() { delete[] data_; }

    ArrayQueue(const ArrayQueue& other)
        : slots_(other.slots_), data_(new T[other.slots_]),
          front_(other.front_), rear_(other.rear_) {
        for (size_type i = front_; i != rear_; i = (i + 1) % slots_) {
            data_[i] = other.data_[i];
        }
    }

    ArrayQueue& operator=(const ArrayQueue& other) {
        if (this == &other) {
            return *this;
        }
        T* fresh = new T[other.slots_];
        for (size_type i = other.front_; i != other.rear_; i = (i + 1) % other.slots_) {
            fresh[i] = other.data_[i];
        }
        delete[] data_;
        data_ = fresh;
        slots_ = other.slots_;
        front_ = other.front_;
        rear_ = other.rear_;
        return *this;
    }

    bool empty() const { return front_ == rear_; }

    // 满的判据：rear 再往前走一格就撞上 front。那一格就是被牺牲掉的槽位。
    bool full() const { return (rear_ + 1) % slots_ == front_; }

    size_type size() const {
        return (rear_ >= front_) ? (rear_ - front_) : (slots_ - front_ + rear_);
    }

    // 入队。队满返回 false——顺序队列的容量是固定的，这是它与链式队列的核心差别。
    bool enqueue(const T& value) {
        if (full()) {
            return false;
        }
        data_[rear_] = value;
        rear_ = (rear_ + 1) % slots_;    // 走到末尾就绕回 0，取模不能漏
        return true;
    }

    // 出队。空队列返回空 optional，不是错误，也不打印任何东西。
    std::optional<T> dequeue() {
        if (empty()) {
            return std::nullopt;
        }
        T value = data_[front_];
        front_ = (front_ + 1) % slots_;
        return value;
    }

    // 看队头但不出队。
    std::optional<T> front() const {
        if (empty()) {
            return std::nullopt;
        }
        return data_[front_];
    }

    void clear() { front_ = rear_ = 0; }

private:
    size_type slots_;     // 数组格数 = 容量 + 1（多的那一格用来区分空和满）
    T* data_;
    size_type front_;     // 队头元素的下标
    size_type rear_;      // 下一个入队元素要写的下标
};

// ---------------------------------------------------------------------------
// 链式队列
//
// 结点分散在堆上，**没有「队满」这回事**。
// 除了队头指针，还要一个**队尾指针**：没有它，每次入队都得从队头走到尾，O(n)。
// 有了它，入队和出队都是 O(1)。
// ---------------------------------------------------------------------------
template <typename T>
class LinkedQueue {
public:
    using value_type = T;
    using size_type = std::size_t;

    LinkedQueue() : front_(nullptr), rear_(nullptr), size_(0) {}

    ~LinkedQueue() { clear(); }

    LinkedQueue(const LinkedQueue& other) : front_(nullptr), rear_(nullptr), size_(0) {
        for (Node* source = other.front_; source != nullptr; source = source->next) {
            enqueue(source->value);
        }
    }

    LinkedQueue& operator=(const LinkedQueue& other) {
        if (this == &other) {
            return *this;
        }
        clear();
        for (Node* source = other.front_; source != nullptr; source = source->next) {
            enqueue(source->value);
        }
        return *this;
    }

    // 入队：新结点接到队尾。队列原来是空的话，它同时也是队头。
    void enqueue(const T& value) {
        Node* fresh = new Node;
        fresh->value = value;
        fresh->next = nullptr;
        if (rear_ == nullptr) {
            front_ = rear_ = fresh;
        } else {
            rear_->next = fresh;
            rear_ = fresh;
        }
        ++size_;
    }

    // 出队：摘下队头结点。摘完若队列空了，队尾指针也必须置空，
    // 否则它就成了一根指向已释放内存的野指针。
    std::optional<T> dequeue() {
        if (empty()) {
            return std::nullopt;
        }
        Node* dying = front_;
        T value = dying->value;
        front_ = dying->next;
        if (front_ == nullptr) {
            rear_ = nullptr;
        }
        delete dying;
        --size_;
        return value;
    }

    std::optional<T> front() const {
        if (empty()) {
            return std::nullopt;
        }
        return front_->value;
    }

    bool empty() const { return front_ == nullptr; }
    size_type size() const { return size_; }

    // 用循环释放，不要用递归——长队列的递归析构会把运行栈撑爆。
    void clear() {
        while (front_ != nullptr) {
            Node* dying = front_;
            front_ = dying->next;
            delete dying;
        }
        rear_ = nullptr;
        size_ = 0;
    }

private:
    struct Node {
        T value;
        Node* next;
    };

    Node* front_;
    Node* rear_;          // 少了它，入队就要每次从头走到尾
    size_type size_;
};
```



# 3 栈与队列的深入讨论

栈和队列应用

- **栈**：函数调用与递归实现、深度优先周游、表达式转换与求值；快速排序的非递归版本、伸展树也都要用。

- **队列**：作为消息或数据缓冲器 —— 硬件设备间的通信、操作系统的资源管理；
  **队列是广度优先搜索中采用的主要中间数据结构**；按优先级组织成的队列，是**优先队列**。

  

## 3.1 顺序栈与链式栈的比较

>  栈的应用非常广泛，只要满足后进先出的特性都可以使用栈结构，例如函数调用和递归实现、深度优先周游、表达式转换和求值等。

**时间上难分伯仲，空间上各有代价。** 顺序栈和链式栈的基本操作都只需要常数时间，`push`/`pop`都是 $O(1)$。从空间角度看：初始时顺序栈必须说明一个固定的长度，当栈不够满时，势必浪费一些空间；链式栈的长度可根据需要而增减，但每个元素都需要一个指针域，从而产生**结构性开销**。

**还有一处差别常被忽略：访问栈的内部元素。** 顺序栈可以根据元素与栈顶的相对位置快速定位并读取内部元素，而链式栈则需要沿着指针链遍历才能访问内部元素。鉴于上述原因，顺序栈在实际中更为常用一些。

**多栈管理。** 在编译系统等计算机系统软件中，往往同时使用和管理多个栈，这时可充分利用顺序栈单向延伸的特性：用一个数组来存储两个栈，让它们共享同一存储空间——把数组的两端设置为两者各自的栈底，从两端开始向中间迎面延伸，这样浪费的空间相对少一些：

正因为「访问内部元素」这一条，**顺序栈在实际中更常用一些**。

<img src="https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-13.png" alt="图 3.13 存储在同一个数组中的两个迎面增长的栈" style="zoom:67%;" />

图  两个栈的空间需求恰好相反（一个涨、另一个缩）时，这种做法很省空间；两个同时涨，中间那点余量很快就没了。



## 3.2 顺序队列与链式队列的比较

由于存储空间固定，顺序队列无法满足队列规模变化很大且最大规模无法预测的情况，而链式队列则可以轻松应对这种类型的应用。另一方面，顺序队列在存取访问上很简单，可以适用那些对队列内部元素（不仅限于队列的两端）有访问需求的应用；如果可以预测浪涌的统计特性，就可以大致估算出缓冲队列的长度。

常用的入队和出队操作在两种实现里都是常数时间，**二者在时间效率上没有优劣之分**；空间代价上与栈的情况类似。只是顺序队列不像顺序栈那样，**不能在一个数组中存储两个队列**——除非总有数据项从一个队列转入另一个队列。

>  队列通常作为消息或数据缓冲器在很多领域得到广泛应用，只要满足先来先服务的特性即可。例如，计算机的硬件设备之间需要队列作为其数据通信的缓冲；操作系统中使用队列对内存、打印机等各种资源进行管理，而且根据不同优先级别的服务请求，按优先类别把服务请求分别组织成多个不同的队列。另外，**队列是广度优先搜索中采用的主要中间数据结构**。



## 3.3 限制存取点的表

利用栈和队列的思想可以设计出一些变种的栈或队列结构。虽然它们的应用没有栈和队列那样广泛，但在一些特定情况下具有很好的应用价值。

1. **双端队列** —— 插入和删除都限制在两端进行。**栈和队列都是它的特例。**
2. **双栈** —— 两个底部相连的栈：从 `end1` 插入的只能从 `end1` 删除。
3. **超队列** —— 删除受限：删除只在一端，插入可在两端。
4. **超栈** —— 插入受限：插入只在一端，删除可在两端。

C++ 标准库有 `std::deque`，`std::stack` 与 `std::queue` 默认都由它实现 ——**但那是使用者的视角**。本章手写这两种结构，
是因为「存储怎么落、边界怎么守」本身就是这一章的教学内容。



### 出栈序列能不能得到：拿顺序栈模拟一遍

例如：问 5 辆列车开出车站的次序有多少种。题给出合法出栈序列的充分必要条件，算法设计题题要证明合法序列的个数是 Catalan 数。三道题背后是同一个操作层面的问题：
**车辆 $1, 2, \ldots, n$ 依次进栈，给定一个出栈次序，它能不能得到？能的话，怎么进、怎么出？**

回答它不需要搜索。拿栈模拟一遍，每一步都没有选择余地——看下一辆要开出的车：

1. **正在栈顶**：必须现在就开出。再压进一辆，它就被盖住了；
2. **还没进栈**：只能把后面的车一辆辆压进去，直到它到达栈顶；
3. **已在栈里、却不在栈顶**：它上面压着别的车，这个次序不可能。

第 3 种情况不必单独判断：车全部进过栈了还等不到它，就是它。以 `3, 1, 2` 为例：3 要先开出，1、2 就必须都已进栈，而且 2 压在 1 上面；3 开走之后栈顶是 2，1 出不来。

```cpp file=code/ch03/array_stack/modern.hpp#stack-sequence
enum class StackOp { Push, Pop };

/// 车辆 1, 2, …, n 依次进栈，途中随时可以出栈。问：出栈次序能否恰好是 pop_order？
/// 能则返回一串操作（按这个次序做 Push / Pop 就得到它），不能返回 std::nullopt。
///
/// 做法是**拿本节的 ArrayStack 模拟一遍**，每一步都没有选择余地：
///   下一个要出栈的车正在栈顶 —— 必须现在就出（再压一辆它就被盖住了）；
///   还没进栈               —— 只能一辆辆往里压，直到它到栈顶；
///   已经在栈里、却不在栈顶   —— 它上面压着别的车，这个次序不可能。
/// 第三种情况不必单独判断：压完所有车还等不到它，就是它。
///
/// pop_order 里出现重复、缺号或越界的编号时同样返回 std::nullopt：
/// 进栈的车两两不同，出栈次序只可能是 1..n 的一个排列。
[[nodiscard]] inline std::optional<std::vector<StackOp>> stack_operations_for(
        const std::vector<int>& pop_order) {
    const int n = static_cast<int>(pop_order.size());
    ArrayStack<int> stack;
    std::vector<StackOp> ops;
    int next_car = 1;  // 下一辆等着进栈的车
    for (int wanted : pop_order) {
        while (stack.empty() || *stack.peek() != wanted) {
            if (next_car > n) {
                return std::nullopt;  // 车都进过栈了，它还没到栈顶：被压在下面了
            }
            stack.push(next_car);
            ++next_car;
            ops.push_back(StackOp::Push);
        }
        (void)stack.pop();
        ops.push_back(StackOp::Pop);
    }
    return ops;
}
```

模拟用的就是本节的 `ArrayStack`，看栈顶用的是不拷贝的 `ArrayStack::peek`。「这个次序不可能」是可预期的结果，不是错误，所以返回 `std::nullopt` 而不是抛异常——与 `pop()` 在空栈上的口径一致。
每辆车至多进栈、出栈各一次，整个判定是 $O(n)$ 的。

测试对 $n = 1, \ldots, 7$ 穷举全部 5913 个排列，逐个核对三件事：合法序列的个数恰为1、2、5、14、42、132、429，即 Catalan 数 $C_n = \frac{(2n)!}{(n+1)!\,n!}$。



---

# 本章小结

- **栈和队列都是限制了存取点的线性表**，限制换来的是每个操作 $O(1)$。
- 两种存储各有代价：顺序实现省空间、能随机访问内部元素；链式实现不会满。
- **循环队列**用取模把数组看成环，解决假溢出；**牺牲一格**区分空与满。
- **递归 = 用运行栈。** 深度受 `ulimit -s` 限制，可靠的深递归写法只有显式栈。`-O2` 把递归消成循环这件事**不能依赖**。
- 接口口径：**可预期的空状态返回 `optional`，调用方的错误抛异常，容器内部零 I/O。**

