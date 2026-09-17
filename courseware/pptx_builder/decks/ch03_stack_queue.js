// 第三章 栈与队列 —— 由 202609_DSA_03_Stack_Queue.md 整理成的讲课 PPT（58 页）。
// 生成：cd courseware/pptx_builder && node decks/ch03_stack_queue.js ../202609_DSA_03_Stack_Queue.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_03_Stack_Queue.pptx");

// 讲义中引用的图片（name → url）；幻灯片里用 image(s, name, ...) 引用
const IMAGES = {
  "fig-3-1": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-1.png",
  "fig-3-4": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-4.png",
  "fig-3-6": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-6.png",
  "fig-3-7": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-7.png",
  "fig-3-8": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-8.png",
  "fig-3-11": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-11.png",
  "fig-3-13": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-3-13.png",
  shunting: "https://raw.githubusercontent.com/GMyhf/img/main/img/image-20240305142138853.png",
};

(async () => {
  const D = createDeck({ title: "DSA 第三章 栈与队列", imgDir: path.join(__dirname, "..", ".cache", "ch03") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第三章  栈与队列",
  subtitle: "Stack & Queue：加了限制的线性表",
  topics: "栈 ADT 与 LIFO · 顺序栈 / 链式栈 · 后缀表达式 · 调度场算法\n运行栈与递归深度实测 · 显式栈改写 · 背包问题\n队列 ADT 与 FIFO · 假溢出 · 循环队列「牺牲一格」 · 链式队列\n限制存取点的表 · 出栈序列判定与 Catalan 数",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-17 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["在线性表上只加一条限制，能换来什么？", "只在一端进出是**栈**（LIFO）；一端进、另一端出是**队列**（FIFO）。"],
    ["递归为什么会崩，崩在哪里？", "运行栈、栈帧，以及一组会**推翻直觉**的实测数字。"],
    ["「空栈弹出」是错误，还是正常状态？", "这个判断决定了**接口怎么写**：`optional` 还是异常。"],
  ];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.55, C.code);
    numCircle(s, i + 1, x + 0.2, 1.32, 0.46, C.dark);
    text(s, q[0], x + 0.2, 1.92, 2.5, 0.7, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], x + 0.2, 2.65, 2.5, 0.95, { fontSize: 11.5, margin: 0, lsm: 1.2 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "一句话概括", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "栈和队列不是新的存储结构，是", options: { color: C.white } },
    { text: "加了限制的线性表", options: { color: C.gold, bold: true } },
    { text: "。限制换来的是：每个操作都能做到 ", options: { color: C.white } },
    { text: "O(1)", options: { color: C.gold, bold: true, fontFace: MONO } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["1  栈", ["1.1 栈的抽象数据类型", "1.2 顺序栈（教学版完整实现）", "1.3 链式栈", "1.4 表达式求值（后缀式）", "1.5 中缀 → 后缀：调度场算法", "1.6 栈与递归：运行栈实测、显式栈改写、背包"]],
    ["2  队列", ["2.1 队列的抽象数据类型", "2.2 顺序队列：假溢出、循环队列、牺牲一格", "2.3 链式队列：队尾指针与边界"]],
    ["3  深入讨论", ["3.1 顺序栈 vs 链式栈；双栈共享", "3.2 顺序队列 vs 链式队列", "3.3 限制存取点的表", "出栈序列判定与 Catalan 数", "本章小结"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 0 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 2.5, 0.45, { fontSize: 20, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 2.6, 3.0, { fontSize: 12, gap: 8 });
  });
}

// 4. Run first: stack
{
  const s = content("▶", "先跑一遍", "用教学版 ArrayStack 走一遍 push / top / pop");
  codeBlock(s, `#include "teaching.hpp"
#include <iostream>

int main() {
    ArrayStack<int> stack;
    stack.push(1);
    stack.push(2);
    stack.push(3);

    // top() 返回 optional：有值才解引用，空栈不会崩
    if (auto value = stack.top()) {
        std::cout << "栈顶是 " << *value << '\\n';
    }

    std::cout << "依次弹出:";
    while (auto value = stack.pop()) {
        std::cout << ' ' << *value;
    }
    std::cout << "\\n空栈再弹? "
              << (stack.pop() ? "有值" : "空") << '\\n';
}`, 0.5, 1.1, 5.4, 4.0, { fontSize: 9.5 });
  consoleBlock(s, "栈顶是 3\n依次弹出: 3 2 1\n空栈再弹? 空", 6.15, 1.1, 3.35, 1.2);
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror \\\n  -Icode/ch03/array_stack \\\n  code/ch03/array_stack/demo.cpp", 6.15, 2.45, 3.35, 0.65, { fontSize: 8.5, color: C.muted });
  callout(s, "看到了什么", [
    "**后进先出**：最后压入的 3 最先出来。",
    "空栈上 `pop()` 返回**空 optional**：不打印、不崩溃。",
    "`while (auto v = stack.pop())` 一行完成「判空 + 取值」。",
  ], 6.15, 3.2, 3.35, 1.9, { fontSize: 11 });
}

// 5. Run first: queue
{
  const s = content("▶", "先跑一遍", "用教学版 ArrayQueue 走一遍 enqueue / dequeue");
  codeBlock(s, `#include "teaching.hpp"
#include <iostream>

int main() {
    ArrayQueue<int> queue(3);
    if (!queue.enqueue(1) || !queue.enqueue(2)
        || !queue.enqueue(3)) {
        std::cout << "入队失败\\n";
        return 1;
    }
    std::cout << "逻辑容量 3 时再入队? "
              << (queue.enqueue(4) ? "成功" : "已满") << '\\n';
    std::cout << "依次出队:";
    while (auto value = queue.dequeue()) {
        std::cout << ' ' << *value;
    }
    std::cout << '\\n';
}`, 0.5, 1.1, 5.4, 4.0, { fontSize: 9.5 });
  consoleBlock(s, "逻辑容量 3 时再入队? 已满\n依次出队: 1 2 3", 6.15, 1.1, 3.35, 1.0);
  callout(s, "看到了什么", [
    "**先进先出**：1 最先入队，也最先出队。",
    "循环队列**牺牲一个槽位**区分空与满：逻辑容量 3 实际申请 **4 个槽**。",
    "顺序队列容量固定：队满时 `enqueue` 返回 `false`，而不是自动扩容。",
  ], 6.15, 2.3, 3.35, 2.8, { fontSize: 11 });
}

// ============================ PART 1 ============================
sectionSlide("Part 1", "栈 Stack", "只在一端进出 · 后进先出 LIFO\n顺序栈 · 链式栈 · 表达式求值 · 栈与递归");

// 1.1 definition
{
  const s = content("1.1", "1 栈 · 抽象数据类型", "栈：限定仅在一端插入和删除的线性表");
  bullets(s, [
    "**栈**（stack）：插入和删除都只在**一端**进行。",
    "这一端称为**栈顶**（top），另一端称为**栈底**（bottom）。",
    "元素按**后进先出**（LIFO, last in first out）的次序访问。",
    "进和出都在栈顶，**栈底不动**。",
  ], 0.5, 1.15, 5.2, 2.2, { fontSize: 14, gap: 10 });
  callout(s, "生活里的栈", [
    "一摞盘子：只能从最上面放、从最上面拿。",
    "浏览器「后退」、编辑器 undo 序列。",
    "函数调用：最后调用的函数最先返回。",
  ], 0.5, 3.35, 5.2, 1.7, { fontSize: 12 });
  card(s, 6.0, 1.15, 3.5, 3.9, C.code);
  image(s, "fig-3-1", 6.2, 1.3, 3.1, 3.2);
  text(s, "栈的示意图：进和出都在栈顶", 6.0, 4.6, 3.5, 0.3, { fontSize: 10, color: C.muted, align: "center" });
}

// 1.1 ADT table
{
  const s = content("1.1", "1 栈 · 抽象数据类型", "ADT 描述的是「一组运算」");
  text(s, "C++ 模板本身就承担了这层抽象：`ArrayStack<T>` 提供哪些运算由接口决定，**不需要继承**某个 `Stack<T>`。这一节要定下来的是这张表：", 0.5, 1.05, 9, 0.55, { fontSize: 12.5 });
  table(s, [
    ["运算", "含义", "时间代价"],
    [{ t: "push(x)", mono: true }, "把 x 压到栈顶", "摊还 O(1)"],
    [{ t: "pop()", mono: true }, "弹出栈顶并把它带回来；**空栈返回「没有」**", "O(1)"],
    [{ t: "top()", mono: true }, "只看栈顶，不弹出；**空栈返回「没有」**", "O(1)"],
    [{ t: "empty()", mono: true }, "栈里还有没有元素", "O(1)"],
    [{ t: "size()", mono: true }, "栈里有几个元素", "O(1)"],
    [{ t: "clear()", mono: true }, "清空", "O(1)"],
  ], 0.5, 1.7, 5.6, [1.2, 3.3, 1.1], { fontSize: 11.5, rowH: 0.42 });
  callout(s, "「没有」在 C++17 里怎么说？", [
    "`std::optional<T>`：把「有没有值」搬进**类型**里。",
    "取值前必须先判断：`if (auto v = s.pop())`。",
    "有值：`*v` 取出；没值：`std::nullopt`。",
  ], 6.4, 1.7, 3.1, 2.1, { fontSize: 11 });
  callout(s, "接口口径", "空栈是**可预期的状态**，不是错误 → 返回空盒子；参数非法、容量溢出才是错误 → 抛异常。", 6.4, 3.95, 3.1, 1.1, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 1.2 which end is top
{
  const s = content("1.2", "1 栈 · 顺序栈", "数组的哪一端当栈顶？");
  text(s, "顺序栈：用一块**连续区域**存储元素。第一个要做的设计决定——", 0.5, 1.05, 9, 0.35, { fontSize: 13 });
  // left option
  card(s, 0.5, 1.5, 4.35, 3.55, "FDF0EE");
  text(s, "✗  第 0 个位置当栈顶", 0.7, 1.6, 4, 0.35, { fontSize: 15, bold: true, color: C.bad, margin: 0 });
  cells(s, 0.9, 2.45, ["x", "a", "b", "c", "d", ""], { idx: true, fills: ["F9D5D0"] });
  arrowLabel(s, "push 到这里", 1.15, 2.45, C.bad);
  s.addShape(pres.shapes.LINE, { x: 1.45, y: 3.15, w: 2.4, h: 0, line: { color: C.bad, width: 1.5, endArrowType: "triangle", dashType: "dash" } });
  text(s, "所有元素都要后移一位", 1.4, 3.2, 2.6, 0.25, { fontSize: 10, color: C.bad, margin: 0 });
  text(s, "每次 `push` / `pop` 都要把所有元素后移或前移一位 → **O(n)**", 0.7, 3.75, 4, 0.9, { fontSize: 12.5 });
  // right option
  card(s, 5.15, 1.5, 4.35, 3.55, "EAF4EF");
  text(s, "✓  最后一个元素的位置当栈顶", 5.35, 1.6, 4, 0.35, { fontSize: 15, bold: true, color: C.ok, margin: 0 });
  cells(s, 5.55, 2.45, ["a", "b", "c", "d", "x", ""], { idx: true, fills: [null, null, null, null, "CDEBD9"] });
  arrowLabel(s, "top = size-1", 7.75, 2.45, C.ok);
  text(s, "新元素加在表尾、出栈也删表尾，**其他元素一个都不动** → **O(1)**", 5.35, 3.75, 4, 0.9, { fontSize: 12.5 });
  text(s, "顺序栈一律选后者——「选对了就没有代价」", 5.35, 4.55, 4, 0.35, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
}

// 1.2 code part 1
{
  const s = content("1.2", "1 栈 · 顺序栈 · 教学版 teaching.hpp（上）", "成员、构造与三法则");
  codeBlock(s, `template <typename T>
class ArrayStack {
public:
    // 容量不够时会自动翻倍，初值给多少都不影响正确性
    explicit ArrayStack(size_type initial_capacity = 8)
        : data_(new T[initial_capacity]),
          capacity_(initial_capacity), size_(0) {}

    ~ArrayStack() { delete[] data_; }   // new[] 来的就 delete[] 回去

    // 拷贝构造：必须自己写，否则两个栈共享同一块内存
    ArrayStack(const ArrayStack& other)
        : data_(new T[other.capacity_]),
          capacity_(other.capacity_), size_(other.size_) {
        for (size_type i = 0; i < size_; ++i) data_[i] = other.data_[i];
    }

    // 拷贝赋值：先备好新数组，再释放旧的，最后接管
    ArrayStack& operator=(const ArrayStack& other) {
        if (this == &other) return *this;   // 自赋值
        T* fresh = new T[other.capacity_];
        for (size_type i = 0; i < other.size_; ++i) fresh[i] = other.data_[i];
        delete[] data_;
        data_ = fresh; capacity_ = other.capacity_; size_ = other.size_;
        return *this;
    }`, 0.5, 1.05, 6.2, 4.05, { fontSize: 8.5 });
  card(s, 6.95, 1.05, 2.55, 1.7, C.code);
  text(s, "三个数据成员", 7.1, 1.12, 2.3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  s.addText([
    { text: "T* data_", options: { fontFace: MONO, bold: true, color: C.green, breakLine: true } },
    { text: "指向底层数组", options: { breakLine: true } },
    { text: "size_type capacity_", options: { fontFace: MONO, bold: true, color: C.green, breakLine: true } },
    { text: "数组能放多少个", options: { breakLine: true } },
    { text: "size_type size_", options: { fontFace: MONO, bold: true, color: C.green, breakLine: true } },
    { text: "现有几个 = 下一个空位下标", options: {} },
  ], { x: 7.1, y: 1.42, w: 2.35, h: 1.3, fontFace: FONT, fontSize: 9.5, color: C.text, margin: 0, isTextBox: true, valign: "top" });
  callout(s, "为什么要自己写拷贝？", "编译器生成的拷贝会把 `data_` 这根**指针照抄**一份 → 两个栈指向同一块内存，各析构一次 → **double free**。原书 arrStack 正是漏了这个。", 6.95, 2.9, 2.55, 2.2, { fontSize: 10.5 });
}

// 1.2 code part 2
{
  const s = content("1.2", "1 栈 · 顺序栈 · 教学版 teaching.hpp（下）", "push / pop / top 与翻倍扩容");
  codeBlock(s, `    // 入栈。满了就翻倍，所以不会有「栈满溢出」这回事
    void push(const T& value) {
        if (size_ == capacity_) grow();
        data_[size_] = value;
        ++size_;
    }
    // 出栈并带回元素。空栈返回空 optional，不是错误
    std::optional<T> pop() {
        if (empty()) return std::nullopt;
        --size_;
        return data_[size_];
    }
    std::optional<T> top() const {           // 只看不弹
        if (empty()) return std::nullopt;
        return data_[size_ - 1];
    }
    bool empty() const { return size_ == 0; }
    void clear() { size_ = 0; }              // 数组留着接着用
private:
    void grow() {
        size_type next = (capacity_ == 0) ? 1 : capacity_ * 2;
        T* fresh = new T[next];
        for (size_type i = 0; i < size_; ++i) fresh[i] = data_[i];
        delete[] data_;      // 先搬完再释放旧的，顺序反了就读到已释放内存
        data_ = fresh;
        capacity_ = next;
    }`, 0.5, 1.05, 6.2, 4.05, { fontSize: 8.5 });
  const steps = [["申请", "new T[2·cap]"], ["搬运", "逐个复制旧元素"], ["释放", "delete[] 旧数组"], ["接管", "data_ = fresh"]];
  text(s, "grow() 的四步顺序", 6.95, 1.05, 2.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  steps.forEach((st, i) => {
    const y = 1.42 + i * 0.62;
    numCircle(s, i + 1, 6.95, y + 0.06, 0.36, i === 2 ? C.bad : C.green);
    text(s, st[0], 7.4, y, 0.8, 0.26, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, st[1], 7.4, y + 0.25, 2.1, 0.26, { fontSize: 9.5, color: C.muted, margin: 0 });
  });
  callout(s, "顺序写反会怎样", "先释放再搬 = 读已经还回去的内存，ASan 当场报 `heap-use-after-free`。", 6.95, 3.95, 2.55, 1.15, { fontSize: 10.5 });
}

// Key points 1 & 2
{
  const s = content("1.2", "1 栈 · 顺序栈 · 关键要点", "要点 1–2：空状态用 optional；资源类要守三法则");
  card(s, 0.5, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 1, 0.7, 1.25, 0.42, C.dark);
  text(s, "空栈 pop / top 返回空 optional", 1.25, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "`std::optional<T>` 把「有没有值」搬进**类型**，取值前必须先判断。",
    "**空栈不是错误，是可预期的状态** → 返回空盒子，不抛异常。",
    "真正的错误（参数非法、容量溢出）才抛异常。",
  ], 0.7, 1.8, 4.0, 1.9, { fontSize: 12, gap: 8 });
  codeBlock(s, `if (auto v = stack.pop()) {
    use(*v);          // 有值
} else {
    /* 空栈：正常分支 */
}`, 0.7, 3.7, 3.95, 1.2, { fontSize: 9.5 });

  card(s, 5.15, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 2, 5.35, 1.25, 0.42, C.dark);
  text(s, "三法则（Rule of Three）", 5.9, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  text(s, "自己写了**析构 / 拷贝构造 / 拷贝赋值**中的任意一个，通常三个都得写。你写析构是因为在管资源；在管资源，编译器「逐成员照抄」的拷贝就一定是错的。", 5.35, 1.8, 4.0, 1.25, { fontSize: 11.5, lsm: 1.15 });
  // shallow copy diagram
  pill(s, "栈 A.data_", 5.45, 3.25, 1.35, 0.36, C.green, C.white, 10);
  pill(s, "栈 B.data_", 5.45, 4.2, 1.35, 0.36, C.green, C.white, 10);
  cells(s, 7.75, 3.72, [1, 2, 3], { cw: 0.42, ch: 0.38, fs: 11 });
  s.addShape(pres.shapes.LINE, { x: 6.8, y: 3.43, w: 0.95, h: 0.45, line: { color: C.bad, width: 1.5, endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: 6.8, y: 4.38, w: 0.95, h: -0.45, line: { color: C.bad, width: 1.5, endArrowType: "triangle" } });
  text(s, "浅拷贝：析构两次 → double free", 7.0, 4.45, 2.45, 0.45, { fontSize: 10, bold: true, color: C.bad, margin: 0 });
}

// Key point 3: doubling
{
  const s = content("1.2", "1 栈 · 顺序栈 · 关键要点", "要点 3：翻倍扩容让 push 的摊还代价保持 O(1)");
  text(s, "`grow()` 每次把容量**乘 2**，而不是加 1。差别不是常数——", 0.5, 1.05, 9, 0.35, { fontSize: 13 });
  card(s, 0.5, 1.55, 4.35, 2.2, "FDF0EE");
  text(s, "每次 +1", 0.7, 1.65, 3, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  text(s, "1 + 2 + ⋯ + n = O(n²)", 0.7, 2.05, 4, 0.4, { fontSize: 15, bold: true, fontFace: MONO, color: C.text, margin: 0 });
  text(s, "499,500", 0.7, 2.55, 4, 0.75, { fontSize: 40, bold: true, color: C.bad, margin: 0 });
  text(s, "push 1000 个元素的总搬运次数", 0.7, 3.3, 4, 0.3, { fontSize: 10.5, color: C.muted, margin: 0 });
  card(s, 5.15, 1.55, 4.35, 2.2, "EAF4EF");
  text(s, "每次 ×2", 5.35, 1.65, 3, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  text(s, "1 + 2 + 4 + ⋯ + n < 2n", 5.35, 2.05, 4, 0.4, { fontSize: 15, bold: true, color: C.text, margin: 0 });
  text(s, "1,023", 5.35, 2.55, 4, 0.75, { fontSize: 40, bold: true, color: C.ok, margin: 0 });
  text(s, "push 1000 个元素的总搬运次数（容量从 1 起翻倍）", 5.35, 3.3, 4, 0.3, { fontSize: 10.5, color: C.muted, margin: 0 });
  callout(s, "摊还分析一句话", "翻倍时总搬运 < 2n，平摊到每次 push 就是**常数**。每个元素在均摊意义下只被搬运常数次——偶尔一次 O(n) 的 grow 被之前大量 O(1) 的 push「预付」了。", 0.5, 3.95, 9.0, 1.1, { fontSize: 11.5 });
}

// Key points 4 & 5
{
  const s = content("1.2", "1 栈 · 顺序栈 · 关键要点", "要点 4–5：new T[n] 的限制；容器里一个 cout 都没有");
  card(s, 0.5, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 4, 0.7, 1.25, 0.42, C.dark);
  text(s, "new T[n] 会默认构造整块槽位", 1.25, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "`new T[n]` 把 n 个槽位**全部默认构造**出来。",
    "所以 **T 必须能默认构造**——只有带参构造函数的类放不进这个栈。",
    "工程版（modern.hpp）用未初始化内存 + 定位构造解决，并补齐移动语义、强异常保证。",
  ], 0.7, 1.8, 4.0, 2.0, { fontSize: 12, gap: 8 });
  codeBlock(s, `struct Point { Point(int, int); };
ArrayStack<Point> s;  // 编译错误：
                      // 没有 Point()`, 0.7, 3.85, 3.95, 0.95, { fontSize: 9.5 });

  card(s, 5.15, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 5, 5.35, 1.25, 0.42, C.dark);
  text(s, "数据结构负责数据结构", 5.9, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  text(s, "报错交给调用方。", 5.35, 1.75, 4, 0.35, { fontSize: 13, bold: true, color: C.goldText, margin: 0 });
  const rules = [["可预期的空状态", "返回 optional", C.green], ["调用方的错误", "抛异常", C.goldText], ["容器内部", "零 I/O", C.dark]];
  rules.forEach((r, i) => {
    const y = 2.3 + i * 0.85;
    card(s, 5.35, y, 3.95, 0.7, C.white, "D5DDD9");
    text(s, r[0], 5.5, y, 1.9, 0.7, { fontSize: 12, color: C.text, valign: "middle", margin: 0 });
    pill(s, r[1], 7.45, y + 0.16, 1.7, 0.38, r[2], C.white, 11);
  });
}

// 1.3 linked stack concept
{
  const s = content("1.3", "1 栈 · 链式栈", "链式栈：栈顶就是链表的第一个结点");
  card(s, 0.5, 1.1, 9.0, 1.65, C.code);
  image(s, "fig-3-4", 0.8, 1.2, 8.4, 1.45);
  bullets(s, [
    "结点分散在堆上，压栈只是接一个新结点——**不需要连续空间，也没有「栈满」这回事**。",
    "`push` 在链头插入、`pop` 删链头，两者都是 **O(1)**。",
    "反过来把栈顶放在链尾？每次都得从头走到尾，退化成 **O(n)**。",
    "代价：每个元素多一根指针（**结构性开销**，64 位机上 8 字节）。",
  ], 0.5, 2.95, 5.6, 2.1, { fontSize: 12.5, gap: 8 });
  callout(s, "刻意保持接口一致", "`LinkedStack` 的接口形状与 `ArrayStack` 完全一样——**同一个 ADT，换一种存储结构**，两者才好拿来对比。\n构造函数没有参数：链式栈**不需要预设容量**。", 6.35, 2.95, 3.15, 2.1, { fontSize: 11 });
}

// 1.3 code
{
  const s = content("1.3", "1 栈 · 链式栈 · 教学版 teaching.hpp", "push / pop / clear");
  codeBlock(s, `    LinkedStack() : top_(nullptr), size_(0) {}   // 不需要预设容量
    ~LinkedStack() { clear(); }

    // 造新结点，让它指向原栈顶，再让栈顶指向它
    void push(const T& value) {
        Node* fresh = new Node;
        fresh->value = value;
        fresh->next = top_;
        top_ = fresh;
        ++size_;
    }
    // 摘下栈顶结点，取走值，再释放它
    std::optional<T> pop() {
        if (empty()) return std::nullopt;
        Node* dying = top_;
        T value = dying->value;
        top_ = dying->next;
        delete dying;
        --size_;
        return value;
    }
    bool empty() const { return top_ == nullptr; }
    // 逐个释放结点。用循环，不要用递归！
    void clear() {
        while (top_ != nullptr) {
            Node* dying = top_; top_ = top_->next; delete dying;
        }
        size_ = 0;
    }`, 0.5, 1.05, 5.6, 4.05, { fontSize: 8.2 });
  // push diagram
  text(s, "push(x) 三步", 6.35, 1.05, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const dy = 1.55;
  pill(s, "top_", 6.35, dy + 0.5, 0.7, 0.32, C.dark, C.gold, 10);
  s.addShape(pres.shapes.RECTANGLE, { x: 7.45, y: dy, w: 0.55, h: 0.4, fill: { color: "CDEBD9" }, line: { color: C.ok, width: 1.2 } });
  text(s, "x", 7.45, dy, 0.55, 0.4, { fontSize: 12, bold: true, align: "center", valign: "middle", margin: 0 });
  ["c", "b", "a"].forEach((v, i) => {
    const x = 7.45 + i * 0.7;
    s.addShape(pres.shapes.RECTANGLE, { x, y: dy + 0.95, w: 0.5, h: 0.4, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
    text(s, v, x, dy + 0.95, 0.5, 0.4, { fontSize: 12, bold: true, align: "center", valign: "middle", margin: 0 });
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 0.5, y: dy + 1.15, w: 0.2, h: 0, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
  });
  s.addShape(pres.shapes.LINE, { x: 7.72, y: dy + 0.4, w: 0, h: 0.55, line: { color: C.ok, width: 1.5, endArrowType: "triangle" } });
  text(s, "① next = top_", 7.8, dy + 0.5, 1.6, 0.25, { fontSize: 9, color: C.ok, bold: true, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 7.05, y: dy + 0.6, w: 0.4, h: -0.4, line: { color: C.bad, width: 1.5, endArrowType: "triangle", dashType: "dash" } });
  text(s, "② top_ = fresh", 6.35, dy + 1.45, 2, 0.25, { fontSize: 9, color: C.bad, bold: true, margin: 0 });
  callout(s, "为什么 clear() 必须用循环", "链式结构最自然的写法是递归释放，但**深链会耗尽运行栈**。教学版测试压 **80 万个结点**再整体析构；换成递归释放，AddressSanitizer 当场报 `stack-overflow`。", 6.35, 3.3, 3.15, 1.8, { fontSize: 10.5 });
}

// 1.3 copy_from
{
  const s = content("1.3", "1 栈 · 链式栈 · 教学版", "三法则同样适用：copy_from 保持「顶 → 底」次序");
  codeBlock(s, `LinkedStack(const LinkedStack& other) : top_(nullptr), size_(0) {
    copy_from(other);
}
LinkedStack& operator=(const LinkedStack& other) {
    if (this == &other) return *this;
    clear();
    copy_from(other);
    return *this;
}

// 从原栈的顶开始走，每次把新结点接到上一个新结点后面
void copy_from(const LinkedStack& other) {
    Node** tail = &top_;          // 指向「下一个新结点该挂在哪」
    for (Node* source = other.top_; source != nullptr;
         source = source->next) {
        Node* fresh = new Node;
        fresh->value = source->value;
        fresh->next = nullptr;
        *tail = fresh;
        tail = &fresh->next;
        ++size_;
    }
}`, 0.5, 1.05, 5.6, 4.05, { fontSize: 9 });
  callout(s, "Node** tail 技巧", [
    "`tail` 指向的是「**指针变量本身**」：一开始是 `top_`，之后是上一个结点的 `next`。",
    "于是「挂第一个结点」和「挂后续结点」写法完全相同，**不用特判空链**。",
    "如果逐个 `push`，得到的栈次序会**颠倒**。",
  ], 6.35, 1.05, 3.15, 2.55, { fontSize: 10.5 });
  callout(s, "原书缺陷", "`lnkStack` 有析构函数却没有拷贝构造和拷贝赋值——与顺序栈是**同一个错误**：两个栈共享结点，二次释放。", 6.35, 3.75, 3.15, 1.35, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 1.3 compare
{
  const s = content("1.3", "1 栈 · 链式栈", "对着顺序栈看：三处差别");
  const items = [
    ["没有 capacity，也没有 grow()", "链式栈不需要连续空间，压多少个都不用扩容。顺序栈那一节**大半篇幅在讲扩容**，这里整段消失了。", C.ok],
    ["代价在别处", "每个元素多带一根 `next` 指针（64 位机 8 字节）；结点分散在堆上，**缓存局部性**不如连续数组。", C.goldText],
    ["clear() 用循环，不用递归", "递归释放是最自然的写法，但深链会耗尽运行栈。**80 万结点**的测试专门为这条兜底。", C.bad],
  ];
  items.forEach((it, i) => {
    const y = 1.15 + i * 1.3;
    card(s, 0.5, y, 9.0, 1.15, C.code);
    numCircle(s, i + 1, 0.72, y + 0.33, 0.5, it[2]);
    text(s, it[0], 1.45, y + 0.12, 7.8, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    text(s, it[1], 1.45, y + 0.5, 7.9, 0.6, { fontSize: 12, margin: 0 });
  });
}

// 1.4 applications & BNF
{
  const s = content("1.4", "1 栈 · 表达式求值", "栈的应用 & 表达式的形式化定义（BNF）");
  text(s, "只要满足**后进先出**，都可以用栈：网页访问历史、编辑器 undo、函数调用地址与参数保存、二叉树深度优先周游……表达式求值是编译器最基本的问题之一。", 0.5, 1.02, 9, 0.6, { fontSize: 12 });
  const layers = [
    ["<表达式>", "<项> + <项> | <项> - <项> | <项>", "处理加减（最外层）"],
    ["<项>", "<因子> * <因子> | <因子> / <因子> | <因子>", "处理乘除，绝不出现加减"],
    ["<因子>", "<常数> | ( <表达式> )", "括号内整体当成一个单位"],
    ["<常数>", "<数字> | <数字> <常数>", "多位整数"],
    ["<数字>", "0 | 1 | 2 | … | 9", "最底层的砖块"],
  ];
  layers.forEach((l, i) => {
    const inset = i * 0.18;
    const y = 1.68 + i * 0.52;
    card(s, 0.5 + inset, y, 5.9 - 2 * inset, 0.46, i % 2 ? C.mint : "E3EEE9");
    text(s, l[0], 0.62 + inset, y, 1.1, 0.46, { fontSize: 11, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, l[1], 1.72 + inset, y, 4.6 - 2 * inset, 0.46, { fontSize: 9, color: C.text, valign: "middle", margin: 0 });
  });
  card(s, 6.65, 1.7, 2.85, 2.5, C.code);
  text(s, "三个符号", 6.8, 1.78, 2.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "`::=`  读作「定义为」",
    "`|`  读作「或者」",
    "`< >`  一个语法成分（分类标签）",
  ], 6.75, 2.15, 2.7, 1.2, { fontSize: 11, gap: 6 });
  text(s, "层级越深，绑定越紧：括号 > 乘除 > 加减", 6.8, 3.35, 2.6, 0.75, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
  callout(s, "核心思想", "把算式拆成 **表达式(加减) → 项(乘除) → 因子(括号和数字)** 三个层级，机器在语法上自然实现「先算括号，再算乘除，最后算加减」。", 0.5, 4.33, 9.0, 0.8, { fontSize: 10.5, tsize: 11 });
}

// BNF worked example
{
  const s = content("1.4", "1 栈 · 表达式求值", "实战拆解：计算机如何看懂 (1 + 2) * 3");
  const steps = [
    ["1 + 2", "1、2 是 <常数> → <因子> → <项>；<项> + <项> 组成 <表达式>"],
    ["(1 + 2)", "规则 ( <表达式> ) → 变成一个 <因子>"],
    ["3", "<常数>，也是一个 <因子>"],
    ["(1 + 2) * 3", "<因子> * <因子> → 一个 <项>"],
    ["整体", "这个 <项> 本身就是合法的 <表达式> ✓"],
  ];
  steps.forEach((st, i) => {
    const y = 1.15 + i * 0.66;
    numCircle(s, i + 1, 0.5, y + 0.08, 0.4, C.green);
    card(s, 1.05, y, 1.9, 0.56, C.dark);
    text(s, st[0], 1.05, y, 1.9, 0.56, { fontSize: 13, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
    text(s, st[1], 3.1, y, 3.3, 0.56, { fontSize: 11, valign: "middle", margin: 0 });
  });
  // parse tree
  card(s, 6.6, 1.15, 2.9, 3.9, C.code);
  text(s, "语法树", 6.75, 1.22, 2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const node = (label, x, y, w = 0.9, fill = C.mint) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.32, rectRadius: 0.06, fill: { color: fill }, line: { color: C.green, width: 0.8 } });
    text(s, label, x, y, w, 0.32, { fontSize: 9.5, bold: true, align: "center", valign: "middle", margin: 0 });
  };
  const edge = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: y1, w: Math.abs(x2 - x1), h: y2 - y1, flipH: x2 < x1, line: { color: C.green, width: 1 } });
  node("表达式", 7.6, 1.6);
  node("项", 7.6, 2.15);
  node("因子", 6.85, 2.75); node("*", 7.75, 2.75, 0.6, C.cream); node("因子", 8.45, 2.75);
  node("( 表达式 )", 6.72, 3.35, 1.15);
  node("3", 8.45, 3.35, 0.9, C.cream);
  node("1 + 2", 6.85, 3.95, 0.9, C.cream);
  edge(8.05, 1.92, 8.05, 2.15);
  edge(8.05, 2.47, 7.3, 2.75); edge(8.05, 2.47, 8.05, 2.75); edge(8.05, 2.47, 8.9, 2.75);
  edge(7.3, 3.07, 7.3, 3.35); edge(8.9, 3.07, 8.9, 3.35); edge(7.3, 3.67, 7.3, 3.95);
  text(s, "后面用栈求值，走的就是这套拆解逻辑", 6.75, 4.45, 2.6, 0.5, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// postfix rules
{
  const s = content("1.4", "1 栈 · 表达式求值", "后缀（逆波兰）表达式：不要括号，不要优先级");
  text(s, "中缀 `23 + (34 × 45) / (5 + 6 + 7)`  ⟶  后缀 `23 34 45 * 5 6 + 7 + / +`", 0.5, 1.05, 9, 0.45, { fontSize: 15, bold: true, color: C.dark });
  const rules = [["遇操作数", "压栈", C.green], ["遇操作符", "弹出两个，算完再压回", C.goldText], ["读到末尾", "栈里剩下的唯一元素就是结果", C.dark]];
  rules.forEach((r, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.7, 2.85, 1.35, C.code);
    pill(s, r[0], x + 0.2, 1.85, 1.3, 0.36, r[2], C.white, 11);
    text(s, r[1], x + 0.2, 2.3, 2.5, 0.65, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  });
  callout(s, "为什么后缀式不需要括号？", "运算符出现的**位置**就已经决定了运算次序：每个运算符作用于它**之前**最近的两个「值」。优先级和括号的信息，在转换成后缀式时就被编码进顺序里了。", 0.5, 3.25, 5.6, 1.8, { fontSize: 12 });
  card(s, 6.35, 3.25, 3.15, 1.8, C.dark);
  text(s, "一句话", 6.55, 3.35, 2.5, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "中缀式给人看，\n后缀式给栈算。", 6.55, 3.75, 2.8, 1.1, { fontSize: 20, bold: true, color: C.white, margin: 0 });
}

// postfix trace table
{
  const s = content("1.4", "1 栈 · 表达式求值", "逐步求值：23 34 45 * 5 6 + 7 + / +");
  const rows = [
    ["步", "待处理的后缀表达式", "栈（底 → 顶）", "进行的运算"],
    ["1", { t: "23 34 45 * 5 6 + 7 + / +", mono: true }, "", ""],
    ["2", { t: "34 45 * 5 6 + 7 + / +", mono: true }, "23", ""],
    ["3", { t: "45 * 5 6 + 7 + / +", mono: true }, "23 34", ""],
    ["4", { t: "* 5 6 + 7 + / +", mono: true }, "23 34 45", ""],
    ["5", { t: "5 6 + 7 + / +", mono: true }, "23 1530", { t: "34 × 45 = 1530 入栈", bold: true, color: C.green }],
    ["6", { t: "6 + 7 + / +", mono: true }, "23 1530 5", ""],
    ["7", { t: "+ 7 + / +", mono: true }, "23 1530 5 6", ""],
    ["8", { t: "7 + / +", mono: true }, "23 1530 11", { t: "5 + 6 = 11 入栈", bold: true, color: C.green }],
    ["9", { t: "+ / +", mono: true }, "23 1530 11 7", ""],
    ["10", { t: "/ +", mono: true }, "23 1530 18", { t: "11 + 7 = 18 入栈", bold: true, color: C.green }],
    ["11", { t: "+", mono: true }, "23 85", { t: "1530 / 18 = 85 入栈", bold: true, color: C.bad, fill: "FDF0EE" }],
    ["12", "", { t: "108", bold: true }, { t: "23 + 85 = 108 ✓", bold: true, color: C.green }],
  ];
  table(s, rows, 0.5, 0.98, 6.3, [0.4, 2.45, 1.55, 1.9], { fontSize: 9, rowH: 0.29, tight: true });
  callout(s, "⚠ 第 11 步是考点", "**先弹出的 18 是右操作数**，后弹出的 1530 才是左操作数。\n\n减法和除法都不可交换，弹出次序写反：18 / 1530 ≈ 0.0118，结果就错。", 7.05, 1.02, 2.45, 4.05, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
}

// evaluate_postfix C++
{
  const s = content("1.4", "1 栈 · 表达式求值", "evaluate_postfix：弹出次序写进代码");
  codeBlock(s, `[[nodiscard]] inline double evaluate_postfix(std::string_view expression) {
    ArrayStack<double> operands;

    const auto pop_two = [&operands](double& left, double& right) {
        if (operands.size() < 2) {
            throw std::invalid_argument("后缀表达式：操作数不足");
        }
        right = *operands.pop();          // 先弹出的是右操作数
        left = *operands.pop();
    };
    // ... 逐个记号：是数就压栈，是操作符就 pop_two 算完再 push
}`, 0.5, 1.1, 9.0, 2.4, { fontSize: 10, hl: [8] });
  const errs = [
    ["std::invalid_argument", "表达式不合法：操作数不足、无法识别的记号、最后栈里不止一个值"],
    ["std::domain_error", "除零"],
  ];
  text(s, "出错时怎么办？——调用方的错误，抛异常", 0.5, 3.7, 9, 0.35, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  errs.forEach((e, i) => {
    const y = 4.12 + i * 0.5;
    pill(s, e[0], 0.5, y, 2.6, 0.38, i ? C.goldText : C.bad, C.white, 10.5);
    text(s, e[1], 3.3, y, 6.2, 0.38, { fontSize: 12, valign: "middle", margin: 0 });
  });
}

// OJ24588
{
  const s = content("OJ", "1 栈 · 表达式求值 · 示例", "OJ 24588：后序表达式求值");
  codeBlock(s, `def evaluate_postfix(expression):
    stack = []
    tokens = expression.split()

    for token in tokens:
        if token in '+-*/':
            # 弹出栈顶的两个元素
            right_operand = stack.pop()
            left_operand = stack.pop()
            if token == '+':
                stack.append(left_operand + right_operand)
            elif token == '-':
                stack.append(left_operand - right_operand)
            elif token == '*':
                stack.append(left_operand * right_operand)
            elif token == '/':
                stack.append(left_operand / right_operand)
        else:
            stack.append(float(token))   # 操作数转浮点后入栈

    return stack[0]                      # 栈顶元素就是结果

n = int(input())
for _ in range(n):
    print(f"{evaluate_postfix(input()):.2f}")`, 0.5, 1.05, 5.6, 4.05, { fontSize: 8.8, lang: "py" });
  callout(s, "题意", "cs101.openjudge.cn/practice/24588\n操作数是整数或小数，运算符 + - * /。「a b c」的值是 (a) c (b)。每行输出保留 2 位小数。", 6.35, 1.05, 3.15, 1.5, { fontSize: 10.5 });
  card(s, 6.35, 2.68, 3.15, 1.25, C.code);
  text(s, "样例", 6.5, 2.73, 1, 0.25, { fontSize: 10, bold: true, color: C.dark, margin: 0 });
  s.addText("5 3.4 +          → 8.40\n5 3.4 + 6 /      → 1.40\n5 3.4 + 6 * 3 +  → 53.40", { x: 6.5, y: 3.0, w: 3.0, h: 0.85, fontFace: MONO, fontSize: 9.5, color: C.text, margin: 0, isTextBox: true, valign: "top" });
  callout(s, "注意", "`split()` 切分记号；先弹 right 后弹 left。", 6.35, 4.06, 3.15, 1.04, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 1.5 shunting yard intro
{
  const s = content("1.5", "1 栈 · 中缀转后缀", "调度场算法（Shunting Yard, Dijkstra 1960s）");
  card(s, 0.5, 1.05, 4.6, 4.05, C.code);
  image(s, "shunting", 0.6, 1.15, 4.4, 3.85);
  bullets(s, [
    "上面的求值器有个前提：**表达式已经是后缀式**。可人写出来的是中缀式——中间隔着一步转换。",
    "这一步是**栈最典型的应用**：括号和优先级造成的「先算什么」，全靠一把栈记住。",
    "编译器把算术式变成机器指令，走的就是同一条路。",
    "形象理解：数字直接开进「输出轨道」，运算符先停进「调度场」（运算符栈），等到优先级允许时再开出去。",
  ], 5.35, 1.05, 4.15, 4.05, { fontSize: 12, gap: 10 });
}

// five rules
{
  const s = content("1.5", "1 栈 · 中缀转后缀", "五条规则：从左到右扫描中缀式");
  table(s, [
    ["遇到", "做什么"],
    [{ t: "① 操作数", bold: true }, "直接输出到后缀序列"],
    [{ t: "② (", bold: true }, "入栈"],
    [{ t: "③ )", bold: true }, "反复弹出并输出，直到遇到 `(`；`(` 弹掉但**不输出**。没遇到 `(` → 括号不匹配"],
    [{ t: "④ 运算符", bold: true, fill: C.cream }, { t: "当「栈非空 且 栈顶不是 `(` 且 **栈顶优先级不低于当前**」时反复弹出并输出；然后把当前运算符入栈", fill: C.cream }],
    [{ t: "⑤ 扫描结束", bold: true }, "栈里剩下的依次弹出输出；若弹出 `(` → 括号不匹配"],
  ], 0.5, 1.1, 9.0, [1.4, 7.6], { fontSize: 12, rowH: 0.52 });
  callout(s, "优先级约定", "`*` `/` 为 2，`+` `-` 为 1。`(` 在栈里起「隔板」作用：第④条的循环碰到它就停。", 0.5, 4.3, 9.0, 0.8, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// shunting trace
{
  const s = content("1.5", "1 栈 · 中缀转后缀", "逐步转换：23 + (34 * 45) / (5 + 6 + 7)");
  const rows = [
    ["记号", "规则", "运算符栈（底 → 顶）", "输出序列"],
    [{ t: "23", mono: true }, "①", "", { t: "23", mono: true }],
    [{ t: "+", mono: true }, "④ 栈空，入栈", { t: "+", mono: true }, { t: "23", mono: true }],
    [{ t: "(", mono: true }, "② 入栈", { t: "+ (", mono: true }, { t: "23", mono: true }],
    [{ t: "34", mono: true }, "①", { t: "+ (", mono: true }, { t: "23 34", mono: true }],
    [{ t: "*", mono: true }, "④ 栈顶是 (，入栈", { t: "+ ( *", mono: true }, { t: "23 34", mono: true }],
    [{ t: "45", mono: true }, "①", { t: "+ ( *", mono: true }, { t: "23 34 45", mono: true }],
    [{ t: ")", mono: true }, "③ 弹 * 输出，丢 (", { t: "+", mono: true }, { t: "23 34 45 *", mono: true }],
    [{ t: "/", mono: true }, "④ + 优先级低，入栈", { t: "+ /", mono: true }, { t: "23 34 45 *", mono: true }],
    [{ t: "(", mono: true }, "② 入栈", { t: "+ / (", mono: true }, { t: "23 34 45 *", mono: true }],
    [{ t: "5", mono: true }, "①", { t: "+ / (", mono: true }, { t: "… * 5", mono: true }],
    [{ t: "+", mono: true }, "④ 栈顶是 (，入栈", { t: "+ / ( +", mono: true }, { t: "… * 5", mono: true }],
    [{ t: "6", mono: true }, "①", { t: "+ / ( +", mono: true }, { t: "… * 5 6", mono: true }],
    [{ t: "+", mono: true, fill: C.cream }, { t: "④ 栈顶 + **不低于** +，弹出", fill: C.cream }, { t: "+ / ( +", mono: true, fill: C.cream }, { t: "… * 5 6 +", mono: true, fill: C.cream }],
    [{ t: "7", mono: true }, "①", { t: "+ / ( +", mono: true }, { t: "… 5 6 + 7", mono: true }],
    [{ t: ")", mono: true }, "③ 弹 + 输出，丢 (", { t: "+ /", mono: true }, { t: "… 5 6 + 7 +", mono: true }],
    [{ t: "结束", bold: true }, "⑤ 依次弹出 /、+", "", { t: "23 34 45 * 5 6 + 7 + / +", mono: true, bold: true, color: C.green }],
  ];
  table(s, rows, 0.5, 0.98, 9.0, [0.8, 3.0, 1.9, 3.3], { fontSize: 8.5, rowH: 0.245, tight: true });
}

// "not lower than"
{
  const s = content("1.5", "1 栈 · 中缀转后缀", "「不低于」三个字是承重的：左结合");
  text(s, "例：`1 - 2 - 3`，正确答案是左结合的 **(1 − 2) − 3 = −4**", 0.5, 1.05, 9, 0.4, { fontSize: 15 });
  card(s, 0.5, 1.6, 4.35, 2.6, "EAF4EF");
  text(s, "✓ 栈顶优先级「不低于」当前 → 弹出", 0.7, 1.7, 4, 0.35, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  text(s, "1 2 - 3 -", 0.7, 2.2, 4, 0.6, { fontSize: 28, bold: true, fontFace: MONO, color: C.dark, margin: 0 });
  text(s, "(1 − 2) − 3 = −4", 0.7, 2.9, 4, 0.5, { fontSize: 22, bold: true, color: C.ok, margin: 0 });
  text(s, "同优先级时先把前一个 − 弹出去", 0.7, 3.55, 4, 0.4, { fontSize: 11, color: C.muted, margin: 0 });
  card(s, 5.15, 1.6, 4.35, 2.6, "FDF0EE");
  text(s, "✗ 写成「高于」才弹出", 5.35, 1.7, 4, 0.35, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  text(s, "1 2 3 - -", 5.35, 2.2, 4, 0.6, { fontSize: 28, bold: true, fontFace: MONO, color: C.dark, margin: 0 });
  text(s, "1 − (2 − 3) = 2", 5.35, 2.9, 4, 0.5, { fontSize: 22, bold: true, color: C.bad, margin: 0 });
  text(s, "同优先级不弹，变成右结合", 5.35, 3.55, 4, 0.4, { fontSize: 11, color: C.muted, margin: 0 });
  codeBlock(s, `if (*top == '(' || precedence(*top) < precedence(c)) {
    break;      // 栈顶优先级严格更低才停；相等也要弹
}`, 0.5, 4.4, 5.9, 0.7, { fontSize: 9.5 });
  text(s, "测试里有一条专门算这个数：把 `<` 写成 `<=` 它立刻变红。", 6.6, 4.4, 2.9, 0.7, { fontSize: 11, valign: "middle" });
}

// infix_to_postfix code
{
  const s = content("1.5", "1 栈 · 中缀转后缀 · modern.hpp（上）", "infix_to_postfix：准备工作与规则 ② ③");
  codeBlock(s, `[[nodiscard]] inline std::string infix_to_postfix(std::string_view expression) {
    const auto precedence = [](char op) -> int {     // + - 同级，* / 更高
        return (op == '*' || op == '/') ? 2 : 1;
    };
    std::string output;
    ArrayStack<char> operators;
    const auto emit = [&output](std::string_view token) {
        if (!output.empty()) output.push_back(' ');   // 记号之间一个空格
        output.append(token);
    };
    std::size_t i = 0;
    bool expect_operand = true;  // 用来把 "-3" 的负号和二元减号区分开
    while (i < expression.size()) {
        const char c = expression[i];
        if (c == ' ' || c == '\\t' || c == '\\n') { ++i; continue; }
        if (c == '(') {                                   // (2) 入栈
            operators.push(c);
            expect_operand = true; ++i; continue;
        }
        if (c == ')') {                                   // (3) 弹到左括号
            bool matched = false;
            while (operators.peek()) {
                const char op = *operators.pop();
                if (op == '(') { matched = true; break; }
                emit(std::string_view(&op, 1));
            }
            if (!matched) throw std::invalid_argument("右括号没有配对的左括号");
            expect_operand = false; ++i; continue;
        }`, 0.5, 1.0, 6.3, 4.15, { fontSize: 7.9 });
  callout(s, "三个小工具", [
    "`precedence`：只有两级，`(` 不参与比较，单独判断。",
    "`emit`：往输出里追加一个记号，自动补空格。",
    "`expect_operand`：刚读完 `(` 或运算符时为真——此时的 `-` 是**负号**。",
  ], 7.0, 1.02, 2.5, 2.55, { fontSize: 10, gap: 4 });
  callout(s, "规则 ③ 的出错口径", "弹空了还没遇到 `(` → 括号不匹配 → 抛 `std::invalid_argument`。", 7.0, 3.7, 2.5, 1.42, { fontSize: 10, fill: "FDF0EE", tcolor: C.bad });
}
{
  const s = content("1.5", "1 栈 · 中缀转后缀 · modern.hpp（下）", "infix_to_postfix：规则 ④ ① ⑤");
  codeBlock(s, `        const bool is_sign = (c == '-' || c == '+') && expect_operand;
        if (!is_sign && (c == '+' || c == '-' || c == '*' || c == '/')) {   // (4)
            while (const char* top = operators.peek()) {
                if (*top == '(' || precedence(*top) < precedence(c)) {
                    break;                     // 栈顶严格更低才停：「不低于」就弹
                }
                const char op = *operators.pop();
                emit(std::string_view(&op, 1));
            }
            operators.push(c);
            expect_operand = true; ++i; continue;
        }
        // (1) 操作数。用和 evaluate_postfix 同一套解析，两者才好对拍
        std::size_t consumed = 0;
        try {
            (void)std::stod(std::string(expression.substr(i)), &consumed);
        } catch (const std::exception&) {
            throw std::invalid_argument("无法识别的记号");
        }
        emit(expression.substr(i, consumed));
        expect_operand = false;
        i += consumed;
    }
    while (const char* top = operators.peek()) {                        // (5)
        if (*top == '(') throw std::invalid_argument("左括号没有配对的右括号");
        const char op = *operators.pop();
        emit(std::string_view(&op, 1));
    }
    if (output.empty()) throw std::invalid_argument("空表达式");
    return output;
}`, 0.5, 1.0, 6.3, 4.15, { fontSize: 7.9, hl: [4] });
  callout(s, "规则 ④", "`peek()` 返回指针：栈空时为 `nullptr`，`while` 自然停下；看栈顶**不拷贝**。", 7.0, 1.02, 2.5, 1.35, { fontSize: 10 });
  callout(s, "规则 ①", "`std::stod` 顺带告诉我们读了几个字符（`consumed`），整数、小数、负数一并处理。", 7.0, 2.5, 2.5, 1.35, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  callout(s, "规则 ⑤", "栈里剩下 `(` → 左括号多了，同样抛异常。", 7.0, 3.98, 2.5, 1.14, { fontSize: 10, fill: "FDF0EE", tcolor: C.bad });
}

// evaluate_infix + design notes
{
  const s = content("1.5", "1 栈 · 中缀转后缀", "把两步接起来：这正是转换算法存在的理由");
  codeBlock(s, `[[nodiscard]] inline double evaluate_infix(std::string_view expression) {
    return evaluate_postfix(infix_to_postfix(expression));
}`, 0.5, 1.1, 9.0, 0.8, { fontSize: 11 });
  // pipeline
  const boxes = [["中缀式", "23 + (34*45) / (5+6+7)"], ["infix_to_postfix", "运算符栈"], ["后缀式", "23 34 45 * 5 6 + 7 + / +"], ["evaluate_postfix", "操作数栈"], ["结果", "108"]];
  boxes.forEach((b, i) => {
    const x = 0.5 + i * 1.86;
    const dark = i % 2 === 1;
    card(s, x, 2.15, 1.6, 1.1, dark ? C.dark : C.code);
    text(s, b[0], x + 0.05, 2.22, 1.5, 0.35, { fontSize: dark ? 9.5 : 12, bold: true, color: dark ? C.gold : C.dark, align: "center", margin: 0, fontFace: dark ? MONO : FONT });
    text(s, b[1], x + 0.05, 2.58, 1.5, 0.6, { fontSize: 9.5, color: dark ? C.mint : C.text, align: "center", margin: 0 });
    if (i < 4) s.addShape(pres.shapes.LINE, { x: x + 1.62, y: 2.7, w: 0.22, h: 0, line: { color: C.green, width: 2, endArrowType: "triangle" } });
  });
  callout(s, "设计细节", [
    "`expect_operand` 标志：期待操作数时遇到的 `-` 是**负号**，否则是二元减号。",
    "操作数用和 `evaluate_postfix` **同一套解析**（`std::stod`），两者才好对拍。",
    "`peek()` 返回指针，看栈顶**不拷贝**；与 `pop()` 的 `optional` 口径互补。",
    "与求值器一样：出错抛 `std::invalid_argument`，**不打印任何东西**。",
  ], 0.5, 3.5, 9.0, 1.6, { fontSize: 11.5, gap: 3 });
}

// OJ24591
{
  const s = content("OJ", "1 栈 · 中缀转后缀 · 练习", "OJ 24591：中序表达式转后序表达式（number buffer 技巧）");
  codeBlock(s, `def infix_to_postfix(expression):
    precedence = {'+':1, '-':1, '*':2, '/':2}
    stack = []
    postfix = []
    number = ''
    for char in expression:
        if char.isnumeric() or char == '.':
            number += char                    # 数字字符先攒在缓冲里
        else:
            if number:                        # 遇到非数字：把攒好的数输出
                num = float(number)
                postfix.append(int(num) if num.is_integer() else num)
                number = ''
            if char in '+-*/':
                while stack and stack[-1] in '+-*/' and \\
                        precedence[char] <= precedence[stack[-1]]:
                    postfix.append(stack.pop())
                stack.append(char)
            elif char == '(':
                stack.append(char)
            elif char == ')':
                while stack and stack[-1] != '(':
                    postfix.append(stack.pop())
                stack.pop()
    if number:                                # 别忘了最后一个数
        num = float(number)
        postfix.append(int(num) if num.is_integer() else num)
    while stack:
        postfix.append(stack.pop())
    return ' '.join(str(x) for x in postfix)`, 0.5, 0.98, 5.9, 4.17, { fontSize: 7.6, lang: "py" });
  card(s, 6.6, 1.02, 2.9, 1.75, C.code);
  text(s, "样例", 6.75, 1.08, 1, 0.25, { fontSize: 10, bold: true, color: C.dark, margin: 0 });
  s.addText("7+8.3\n→ 7 8.3 +\n3+4.5*(7+2)\n→ 3 4.5 7 2 + * +\n(3)*((3+4)*(2+3.5)/(4+5))\n→ 3 3 4 + 2 3.5 + * 4 5 + / *", { x: 6.75, y: 1.33, w: 2.7, h: 1.4, fontFace: MONO, fontSize: 7.8, color: C.text, margin: 0, isTextBox: true, valign: "top" });
  callout(s, "注意点", [
    "输入里数和运算符之间**没有空格**，要自己切分记号。",
    "`<=`：同优先级也弹出（左结合）。",
    "`)` 之后 `stack.pop()` 丢掉 `(`。",
  ], 6.6, 2.9, 2.9, 1.25, { fontSize: 10, gap: 2 });
  callout(s, "另一种切分：re", "`re.split(r'([\\(\\)\\+\\-\\*\\/])', s)`\n分组让分隔符也留在结果里，再滤掉空串。", 6.6, 4.2, 2.9, 0.95, { fontSize: 9, fill: C.mint, tcolor: C.dark, lsm: 1.0 });
}

// 1.6 why stack
{
  const s = content("1.6", "1 栈 · 栈与递归", "递归为什么非要有栈");
  bullets(s, [
    "被调函数的局部变量**不能静态地占一块固定单元**——每调用一次就得有一份，返回时随即释放。",
    "「执行到调用时才分配」叫**动态分配**，需要内存里有一块足够大的**运行栈**。",
    "栈上一格一格压着的叫**栈帧**（stack frame / 活动记录），至少包含：**返回地址、参数、局部变量、保存的寄存器**。",
    "调用一次压一格，返回一次弹一格——所以又叫**调用栈**（call stack）。",
  ], 0.5, 1.1, 4.6, 3.95, { fontSize: 12.5, gap: 10 });
  card(s, 5.3, 1.1, 2.05, 3.95, C.code);
  image(s, "fig-3-6", 5.4, 1.2, 1.85, 3.1);
  text(s, "运行时存储器：栈区放 LIFO 的函数调用；堆区放 new 出来的对象", 5.35, 4.3, 1.95, 0.7, { fontSize: 8.5, color: C.muted, align: "center", margin: 0 });
  card(s, 7.45, 1.1, 2.05, 3.95, C.code);
  image(s, "fig-3-7", 7.55, 1.2, 1.85, 3.1);
  text(s, "活动记录的内容：变量地址都是相对栈顶的相对地址", 7.5, 4.3, 1.95, 0.7, { fontSize: 8.5, color: C.muted, align: "center", margin: 0 });
}

// factorial(4) stack
{
  const s = content("1.6", "1 栈 · 栈与递归", "factorial(4)：递归深度 = 运行栈里的栈帧个数");
  card(s, 0.5, 1.05, 5.9, 4.05, C.code);
  image(s, "fig-3-8", 0.6, 1.15, 5.7, 3.85);
  bullets(s, [
    "同一个函数可以在栈上同时有**很多活动记录**，每个代表一次不同的调用。",
    "同一个局部变量在不同层次被分到**不同的存储空间**。",
    "(a) 逐层调用依次压栈；(b) 到达出口后按压栈的**反序**逐层弹出，把结果一层层交回去。",
  ], 6.6, 1.05, 2.9, 2.75, { fontSize: 11.5, gap: 8 });
  card(s, 6.6, 3.85, 2.9, 1.25, C.dark);
  text(s, "每深一层就多一格活动记录。深度一旦超过栈区大小，程序不是「变慢」，而是**直接崩**。", 6.75, 3.92, 2.65, 1.1, { fontSize: 11, color: C.white, margin: 0, valign: "middle" });
}

// measurements
{
  const s = content("1.6", "1 栈 · 栈与递归 · 实测", "运行栈有多大：三个档位，三种结果");
  text(s, "同一份递归源码（每层做一次加法后返回），Linux · gcc 13.3 · `ulimit -s` 默认 **8 MB**，逐档加深度：", 0.5, 1.02, 9, 0.4, { fontSize: 12 });
  const P = { t: "通过", color: C.ok, bold: true, align: "center" };
  const F = (t) => ({ t, color: C.white, bold: true, fill: C.bad, align: "center" });
  const Fl = (t) => ({ t, color: C.bad, bold: true, fill: "FDF0EE", align: "center" });
  table(s, [
    ["构建档", "20 万层", "50 万层", "100 万层"],
    [{ t: "-O0（不优化）", mono: true, bold: true }, { ...P }, F("段错误"), Fl("段错误")],
    [{ t: "-O1 + ASan/UBSan", mono: true, bold: true }, { ...P }, F("stack-overflow"), Fl("stack-overflow")],
    [{ t: "-O2", mono: true, bold: true }, { ...P }, { ...P }, { t: "通过 ?!", color: C.white, bold: true, fill: C.ok, align: "center" }],
  ], 0.5, 1.55, 5.8, [2.2, 1.1, 1.25, 1.25], { fontSize: 12, rowH: 0.55 });
  card(s, 6.55, 1.55, 2.95, 2.2, C.dark);
  text(s, "改成显式栈", 6.75, 1.65, 2.6, 0.3, { fontSize: 12, bold: true, color: C.gold, margin: 0 });
  text(s, "1000 万层", 6.75, 2.0, 2.6, 0.8, { fontSize: 34, bold: true, color: C.white, margin: 0 });
  text(s, "三个档位全部通过。数据压进 `ArrayStack`，也就是放到**堆上**。", 6.75, 2.85, 2.6, 0.8, { fontSize: 11, color: C.mint, margin: 0 });
  callout(s, "读这张表", [
    "20 万层三档都过；50 万层 -O0 和 -O1 崩——栈帧大小 × 深度 超过了 8 MB。",
    "-O2 在 100 万层居然通过——**不是因为它栈更大**。下一页揭晓。",
  ], 0.5, 3.95, 9.0, 1.15, { fontSize: 11.5, gap: 3 });
}

// -O2 why
{
  const s = content("1.6", "1 栈 · 栈与递归 · 实测", "-O2 为什么不崩：编译器把递归消掉了");
  codeBlock(s, `-O0: recursive_sum 函数体内调用自己的次数 = 2
-O2: recursive_sum 函数体内调用自己的次数 = 0     // 已经变成一个循环`, 0.5, 1.1, 9.0, 0.75, { fontSize: 11, lang: "text" });
  text(s, "查汇编可以确认：-O2 做了**尾调用优化 / 递归转循环**，运行栈深度恒为 1。", 0.5, 1.95, 9, 0.35, { fontSize: 12.5 });
  card(s, 0.5, 2.5, 4.35, 2.6, "FDF0EE");
  text(s, "教训**不是**「用 -O2 就安全」", 0.7, 2.6, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "尾调用优化**不是标准保证的**：换个编译器、换个写法就没了。",
    "评测机用什么优化档、什么编译器版本——**这两件事你都控制不了**。",
  ], 0.7, 3.05, 4.0, 1.9, { fontSize: 12.5, gap: 10 });
  card(s, 5.15, 2.5, 4.35, 2.6, "EAF4EF");
  text(s, "唯一与版本、评测机都无关的做法", 5.35, 2.6, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  text(s, "改写成显式栈", 5.35, 3.05, 4, 0.6, { fontSize: 28, bold: true, color: C.dark, margin: 0 });
  const rows = [["递归", "吃运行栈", "默认 8 MB 上限", C.bad], ["显式栈", "吃堆", "只受内存限制", C.ok]];
  rows.forEach((r, i) => {
    const y = 3.8 + i * 0.58;
    pill(s, r[0], 5.35, y, 1.0, 0.4, r[3], C.white, 11);
    text(s, r[1], 6.5, y, 1.1, 0.4, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, r[2], 7.6, y, 1.8, 0.4, { fontSize: 11, color: C.muted, valign: "middle", margin: 0 });
  });
}

// factorial three versions
{
  const s = content("1.6", "1 栈 · 栈与递归", "阶乘的三个版本：递归 / 迭代 / 显式栈");
  const cols = [
    ["【算法3.6】递归", "运行栈", `factorial_type factorial_recursive(long long n) {
    if (n < 0) throw std::invalid_argument(...);
    if (n > kMaxFactorialInput)   // 20! 是上限
        throw std::overflow_error(...);
    if (n <= 1) return 1;          // 递归出口
    return n * factorial_recursive(n - 1);
}`],
    ["【算法3.8】迭代", "不用栈", `factorial_type factorial_iterative(long long n) {
    // ... 同样的两道检查
    factorial_type m = 1;
    for (long long i = 2; i <= n; ++i) {
        m *= i;
    }
    return m;
}`],
    ["【算法3.9】显式栈", "堆", `factorial_type factorial_with_explicit_stack(long long n) {
    // ... 同样的两道检查
    ArrayStack<factorial_type> pending;
    for (long long i = n; i > 1; --i)
        pending.push(i);           // 按递归规则压栈
    factorial_type m = 1;          // 递归出口的返回值
    while (auto top = pending.pop())
        m *= *top;                 // 出栈即「递归返回」
    return m;
}`],
  ];
  cols.forEach((c, i) => {
    const y = 1.0 + [0, 1.2, 2.4][i];
    const h = [1.1, 1.1, 1.7][i];
    text(s, c[0], 0.5, y, 1.9, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    pill(s, c[1], 0.5, y + 0.35, 1.0, 0.3, [C.bad, C.green, C.ok][i], C.white, 9.5);
    codeBlock(s, c[2], 2.3, y, 4.6, h, { fontSize: 7.5 });
  });
  callout(s, "差别不在快慢", "显式栈版其实**最慢**。它存在的意义是**演示编译系统处理递归的机制**：遇到递归规则就压栈，遇到递归出口就出栈返回。", 7.1, 1.0, 2.4, 2.1, { fontSize: 10.5 });
  callout(s, "差别在数据放在哪", "递归版：返回地址与局部变量在**运行栈**上，受进程栈上限约束。\n显式栈版：待处理数据在**堆**上，只受内存约束。", 7.1, 3.2, 2.4, 1.9, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "两道检查是原书没有的：负数是定义域错误，溢出是真错误。原书 `if (n <= 0) return 1;` 把负数静默当 0。", 0.5, 4.2, 1.7, 0.95, { fontSize: 8.5, color: C.muted, margin: 0 });
}

// knapsack recursive
{
  const s = content("1.6", "1 栈 · 栈与递归 · 背包问题", "两条递归规则的例子：子集和判定");
  text(s, "能否从若干物品中选出一部分，使重量之和**恰好**等于背包承重 s？  `knap(s, n)`：只考虑前 n 件物品。", 0.5, 1.02, 9, 0.4, { fontSize: 12 });
  const rs = [
    ["出口 1", "s == 0", "有解（什么都不再选）", C.ok],
    ["出口 2", "s < 0 或 n == 0", "无解", C.bad],
    ["规则 1", "选第 n-1 件", "knap(s − w[n−1], n−1)", C.green],
    ["规则 2", "不选第 n-1 件", "knap(s, n−1)", C.goldText],
  ];
  rs.forEach((r, i) => {
    const y = 1.55 + i * 0.62;
    pill(s, r[0], 0.5, y + 0.06, 0.95, 0.38, r[3], C.white, 10.5);
    text(s, r[1], 1.6, y, 1.6, 0.5, { fontSize: 11.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, r[2], 3.1, y, 1.9, 0.5, { fontSize: 10.5, fontFace: MONO, valign: "middle", margin: 0 });
  });
  callout(s, "对比阶乘", "阶乘只有**一条**递归规则，改写成循环几乎是显然的。背包有**两条**：规则 1 失败后要**回溯**再试规则 2——这就需要记住「回来之后该走哪一步」。", 0.5, 4.05, 4.5, 1.05, { fontSize: 10.5 });
  codeBlock(s, `def knapsack_recursive(capacity: int,
                       weights: list[int]) -> list[int] | None:
    """算法3.10：两条递归规则，返回选中物品的下标。"""
    _validate(capacity, weights)
    chosen: list[int] = []

    def solve(remaining: int, count: int) -> bool:
        if remaining == 0:
            return True                      # 出口 1
        if remaining < 0 or count == 0:
            return False                     # 出口 2
        if solve(remaining - weights[count - 1], count - 1):
            chosen.append(count - 1)         # 规则 1：选它
            return True
        return solve(remaining, count - 1)   # 规则 2：不选

    return chosen if solve(capacity, len(weights)) else None`, 5.2, 1.55, 4.3, 3.55, { fontSize: 7.9, lang: "py" });
}

// frame mapping
{
  const s = content("1.6", "1 栈 · 栈与递归 · 背包问题", "机械改写：把「返回地址」写成栈帧里的 stage 字段");
  text(s, "原书的显式栈每帧保存**四个域**；返回地址是关键——它记的是「这一层算完之后该回到哪一步继续」，正是编译器替你做的那件事。", 0.5, 1.02, 9, 0.6, { fontSize: 12 });
  const fields = [["s", "参数：剩余承重"], ["n", "参数：可选物品数"], ["rd", "返回地址 → stage"], ["k", "结果单元"]];
  fields.forEach((f, i) => {
    const y = 1.75 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.7, h: 0.5, fill: { color: i === 2 ? C.cream : C.mint }, line: { color: C.green, width: 1 } });
    text(s, f[0], 0.5, y, 0.7, 0.5, { fontSize: 14, bold: true, fontFace: MONO, align: "center", valign: "middle", color: C.dark, margin: 0 });
    text(s, f[1], 1.3, y, 1.9, 0.5, { fontSize: 11, valign: "middle", margin: 0 });
  });
  text(s, "一个栈帧", 0.5, 3.8, 1.5, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
  table(s, [
    ["原书 goto 标签", "本书 stage", "含义"],
    [{ t: "label0", mono: true }, { t: "Enter", mono: true, bold: true, color: C.green }, "递归调用入口：判出口，否则按规则 1 展开"],
    [{ t: "label1", mono: true }, { t: "AfterRule1", mono: true, bold: true, color: C.green }, "规则 1（选第 n-1 件）返回后的处理"],
    [{ t: "label2", mono: true }, { t: "AfterRule2", mono: true, bold: true, color: C.green }, "规则 2（不选第 n-1 件）返回后的处理"],
  ], 3.4, 1.75, 6.1, [1.35, 1.35, 3.4], { fontSize: 10.5, rowH: 0.5 });
  callout(s, "为什么不用 goto？", "`goto` 跳进跳出会让编译器无法保证局部对象的构造与析构配对——在有 RAII 的 C++ 里不能这么写。`stage` 字段与标签**语义完全对应**。", 3.4, 3.9, 6.1, 1.2, { fontSize: 11 });
  callout(s, "k 提到栈外", "`child_result` 充当 CPU 的「返回值寄存器」（如 RAX）。", 0.5, 4.1, 2.75, 1.0, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// explicit stack python
{
  const s = content("1.6", "1 栈 · 栈与递归 · 背包问题", "【算法3.11】显式栈驱动（Python 版）");
  codeBlock(s, `def knapsack_with_explicit_stack(capacity, weights):
    _validate(capacity, weights)
    enter, after_rule1, after_rule2 = range(3)   # 模拟「返回地址」
    stack = [(capacity, len(weights), enter)]    # 帧 = (remaining, count, stage)
    chosen = []
    child_result = False                         # 模拟「返回值寄存器」

    while stack:
        remaining, count, stage = stack.pop()    # 恢复该层全部局部变量
        if stage == enter:
            if remaining == 0:
                child_result = True              # 出口 1
            elif remaining < 0 or count == 0:
                child_result = False             # 出口 2
            else:
                stack.append((remaining, count, after_rule1))   # 保存断点
                stack.append((remaining - weights[count - 1], count - 1, enter))  # 子调用
        elif stage == after_rule1:
            if child_result:
                chosen.append(count - 1)         # 规则 1 成功：选中它
            else:                                # 失败：回溯，改用规则 2
                stack.append((remaining, count, after_rule2))
                stack.append((remaining, count - 1, enter))
        # after_rule2：结果已在 child_result 里，原样上传，无需代码

    return chosen if child_result else None`, 0.5, 1.02, 6.6, 4.1, { fontSize: 8.2, lang: "py" });
  callout(s, "每次「调用」压两帧", [
    "先压**断点**：自己带着下一步的 stage；",
    "再压**子调用**：stage = enter。",
    "子调用先出栈执行；结束后弹出的正是断点——**LIFO 恰好还原了调用/返回的次序**。",
  ], 7.3, 1.02, 2.2, 2.75, { fontSize: 10.5, gap: 4 });
  callout(s, "C++ 版", "`enum class Stage { Enter, AfterRule1, AfterRule2 };`\n`struct Frame { int s; size_t n; Stage stage; };`", 7.3, 3.9, 2.2, 1.22, { fontSize: 9, fill: C.mint, tcolor: C.dark, lsm: 1.0 });
}

// optimization
{
  const s = content("1.6", "1 栈 · 栈与递归 · 背包问题", "【算法3.12】优化：让每层要记的东西更少");
  const x0 = 0.5;
  text(s, "栈帧：4 个域  →  2 个域", x0, 1.05, 5, 0.4, { fontSize: 16, bold: true, color: C.dark, margin: 0 });
  const fr = [["s", false], ["n", true], ["stage", false], ["k", true]];
  fr.forEach((f, i) => {
    const x = x0 + i * 1.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: 1.0, h: 0.55, fill: { color: f[1] ? "F4F4F4" : C.mint }, line: { color: f[1] ? "BBBBBB" : C.green, width: 1, dashType: f[1] ? "dash" : "solid" } });
    text(s, f[0], x, 1.6, 1.0, 0.55, { fontSize: 14, bold: true, fontFace: MONO, align: "center", valign: "middle", color: f[1] ? "AAAAAA" : C.dark, margin: 0 });
    if (f[1]) s.addShape(pres.shapes.LINE, { x: x + 0.15, y: 1.875, w: 0.7, h: 0, line: { color: C.bad, width: 2 } });
  });
  card(s, 0.5, 2.4, 4.35, 1.2, C.code);
  numCircle(s, 1, 0.65, 2.52, 0.38, C.dark);
  text(s, "结果单元 k 提到栈外", 1.15, 2.5, 3.6, 0.35, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "一旦某层为 true 就逐层上传且不再变化 → 一个函数级变量即可。", 1.15, 2.85, 3.6, 0.7, { fontSize: 10.5, margin: 0 });
  card(s, 0.5, 3.75, 4.35, 1.35, C.code);
  numCircle(s, 2, 0.65, 3.87, 0.38, C.dark);
  text(s, "参数 n 由栈深推出", 1.15, 3.85, 3.6, 0.35, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "每递归一层 n 减 1、栈深加 1，所以 **n = n₀ − 栈深**。只需维护一个 depth 计数器。", 1.15, 4.2, 3.6, 0.85, { fontSize: 10.5, margin: 0 });
  codeBlock(s, `stack = [(capacity, enter)]      # 帧只剩两个域
size = len(weights)
depth = 1
while stack:
    remaining, stage = stack.pop()
    depth -= 1
    count = size - depth         # n 由栈深推出
    if stage == enter:
        ...
        stack.append((remaining, after_rule1))
        stack.append((remaining - weights[count-1],
                      enter))
        depth += 2               # 压了两帧
    elif stage == after_rule1:
        ...`, 5.1, 1.05, 4.4, 2.75, { fontSize: 8.5, lang: "py" });
  card(s, 5.1, 3.95, 4.4, 1.15, C.dark);
  text(s, "这才是真正的「优化」：不是跑得更快，而是想清楚**每一层到底需要记住什么**——这正是编译器替你想过的问题。", 5.3, 4.0, 4.05, 1.05, { fontSize: 11, color: C.white, valign: "middle", margin: 0 });
}

// ============================ PART 2 ============================
sectionSlide("Part 2", "队列 Queue", "一端进、另一端出 · 先进先出 FIFO\n顺序队列 · 假溢出 · 循环队列 · 链式队列");

// queue def + ADT
{
  const s = content("2.1", "2 队列 · 抽象数据类型", "队列：一端插入，另一端删除");
  // diagram
  const y = 1.35;
  cells(s, 2.0, y, ["a₁", "a₂", "a₃", "a₄", "a₅"], { cw: 0.62, ch: 0.5, fs: 13 });
  pill(s, "出队 dequeue", 0.35, y + 0.06, 1.4, 0.38, C.goldText, C.white, 10);
  s.addShape(pres.shapes.LINE, { x: 1.78, y: y + 0.25, w: 0.2, h: 0, line: { color: C.goldText, width: 2, beginArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: 5.12, y: y + 0.25, w: 0.2, h: 0, line: { color: C.green, width: 2, beginArrowType: "triangle" } });
  pill(s, "入队 enqueue", 5.35, y + 0.06, 1.4, 0.38, C.green, C.white, 10);
  text(s, "队头 front", 2.0, y + 0.55, 1.2, 0.25, { fontSize: 9.5, bold: true, color: C.goldText, margin: 0 });
  text(s, "队尾 rear", 3.9, y + 0.55, 1.2, 0.25, { fontSize: 9.5, bold: true, color: C.green, align: "right", margin: 0 });
  bullets(s, [
    "只允许**删除**的一端叫**队头**（front），删除叫**出队**。",
    "只允许**插入**的一端叫**队尾**（rear），插入叫**入队**。",
    "按到达顺序释放元素 → **先进先出**（FIFO）。",
    "售票窗口前排队买票，就是日常版的队列。",
  ], 0.5, 2.35, 6.2, 2.7, { fontSize: 12.5, gap: 8 });
  table(s, [
    ["运算", "含义"],
    [{ t: "clear()", mono: true }, "变为空队列"],
    [{ t: "enqueue(item)", mono: true }, "插入队尾，成功返回真"],
    [{ t: "dequeue()", mono: true }, "返回并删除队头（optional）"],
    [{ t: "front()", mono: true }, "返回队头不删除（optional）"],
    [{ t: "empty()", mono: true }, "队列已空则返回真"],
    [{ t: "full()", mono: true, color: C.goldText }, "仅顺序实现才有"],
  ], 6.9, 1.1, 2.6, [1.2, 1.4], { fontSize: 9.5, rowH: 0.42 });
  text(s, "根据应用需要**适当增删运算**：链式队列不需要 `full()`。", 6.9, 4.2, 2.6, 0.85, { fontSize: 10.5, color: C.goldText });
}

// 2.2 can't fix either end
{
  const s = content("2.2", "2 队列 · 顺序队列", "为什么两头都不能固定");
  text(s, "队列**两头都要动**：入队动队尾，出队动队头。沿用顺序表的实现方法会怎样？", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  const opts = [
    ["队尾固定在位置 0", "出队 O(1)", "入队要把所有元素后移一位 O(n)", "FDF0EE", C.bad, "✗"],
    ["队尾固定在位置 n−1", "入队 O(1)", "出队要移动剩余 n−1 个元素 O(n)", "FDF0EE", C.bad, "✗"],
    ["两头都别固定", "入队 O(1)", "出队 O(1)：front、rear 都往后走，元素一个都不搬", "EAF4EF", C.ok, "✓"],
  ];
  opts.forEach((o, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.55, 2.85, 2.25, o[3]);
    text(s, o[5] + "  " + o[0], x + 0.18, 1.65, 2.6, 0.4, { fontSize: 13.5, bold: true, color: o[4], margin: 0 });
    text(s, o[1], x + 0.18, 2.15, 2.6, 0.35, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, o[2], x + 0.18, 2.55, 2.5, 1.1, { fontSize: 11.5, margin: 0 });
  });
  // drift diagram
  text(s, "新问题：队列整体向数组尾部「漂移」——假溢出", 0.5, 3.92, 5, 0.3, { fontSize: 12.5, bold: true, color: C.bad, margin: 0 });
  cells(s, 0.6, 4.7, ["", "", "", "", "e", "f", "g"], { cw: 0.52, ch: 0.42, fills: ["F4F4F4", "F4F4F4", "F4F4F4", "F4F4F4"] });
  arrowLabel(s, "front", 0.6 + 4.5 * 0.52, 4.7, C.goldText);
  text(s, "rear 到末尾 →", 4.3, 4.7, 1.3, 0.42, { fontSize: 10, bold: true, color: C.green, valign: "middle", margin: 0 });
  text(s, "数组前端还空着一大片，`rear` 却已到末尾，入队报满。解决：把数组在逻辑上看成一个**环**。", 5.6, 4.35, 3.9, 0.8, { fontSize: 11.5, valign: "middle" });
}

// circular queue fig
{
  const s = content("2.2", "2 队列 · 顺序队列", "循环队列：下标 0 是下标 mSize−1 的直接后继");
  card(s, 0.5, 1.05, 9.0, 2.45, C.code);
  image(s, "fig-3-11", 0.7, 1.15, 8.6, 2.25);
  text(s, "(a) 初始队列里有 12、17、8、20 四个元素；(b) 两次出队、三次入队之后。入队增加 rear，出队增加 front，两者都在环上顺时针走。", 0.5, 3.55, 9, 0.5, { fontSize: 10.5, color: C.muted });
  card(s, 0.5, 4.15, 4.35, 0.95, C.dark);
  text(s, "位置 x 的后继", 0.7, 4.22, 3, 0.3, { fontSize: 10.5, bold: true, color: C.gold, margin: 0 });
  text(s, "(x + 1) % mSize", 0.7, 4.5, 4, 0.5, { fontSize: 22, bold: true, fontFace: MONO, color: C.white, margin: 0 });
  callout(s, "取模不能漏", "`rear_ = (rear_ + 1) % slots_;` 走到末尾就绕回 0。少了 `%`，下标越界写出数组。", 5.15, 4.15, 4.35, 0.95, { fontSize: 10.5 });
}

// sacrifice slot
{
  const s = content("2.2", "2 队列 · 顺序队列", "绕回之后的麻烦：front == rear 既可能空、也可能满");
  text(s, "**抽屉原理**：n 个位置的数组，队列有「空、1 个、…、n 个」共 **n+1** 种状态；固定 front 后 rear 只有 **n** 种取值——必有两种状态撞在一起。", 0.5, 1.02, 9, 0.6, { fontSize: 12 });
  const ring = (cx, cy, vals, frontI, rearI, title, color) => {
    const r = 0.72;
    vals.forEach((v, i) => {
      const ang = (-90 + i * 90) * Math.PI / 180;
      const x = cx + r * Math.cos(ang) - 0.25, y = cy + r * Math.sin(ang) - 0.22;
      const sacrificed = v === "×";
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.5, h: 0.44, fill: { color: sacrificed ? "F9D5D0" : v ? C.mint : C.white }, line: { color: C.green, width: 1 } });
      text(s, sacrificed ? "空" : v, x, y, 0.5, 0.44, { fontSize: 11, bold: true, color: sacrificed ? C.bad : C.dark, align: "center", valign: "middle", margin: 0 });
      text(s, String(i), x + 0.5, y - 0.02, 0.2, 0.2, { fontSize: 7, color: C.muted, margin: 0 });
    });
    text(s, title, cx - 1.3, cy - 1.45, 2.6, 0.3, { fontSize: 12, bold: true, color, align: "center", margin: 0 });
    text(s, `front=${frontI}  rear=${rearI}`, cx - 1.3, cy + 1.0, 2.6, 0.28, { fontSize: 10, fontFace: MONO, color: C.text, align: "center", margin: 0 });
  };
  card(s, 0.5, 1.7, 2.9, 2.75, C.code);
  ring(1.95, 3.2, ["", "", "", ""], 0, 0, "空：front == rear", C.green);
  card(s, 3.55, 1.7, 2.9, 2.75, C.code);
  ring(5.0, 3.2, ["1", "2", "3", "×"], 0, 3, "满：(rear+1)%4 == front", C.bad);
  codeBlock(s, `bool empty() const {
    return front_ == rear_;
}
// rear 再走一格就撞上 front：
// 那一格就是被牺牲掉的槽位
bool full() const {
    return (rear_ + 1) % slots_
           == front_;
}`, 6.6, 1.7, 2.9, 2.75, { fontSize: 9.5 });
  callout(s, "牺牲一个槽位", "数组开 **n+1** 格却只装 n 个元素：`slots_ = 容量 + 1`。这就是「逻辑容量 3 时第 4 个入不进去」的原因。", 0.5, 4.55, 9.0, 0.62, { fontSize: 10.5, tsize: 10.5 });
}

// circular queue code + trace
{
  const s = content("2.2", "2 队列 · 顺序队列 · 教学版", "enqueue / dequeue / size，以及一次绕回");
  codeBlock(s, `explicit ArrayQueue(size_type capacity)
    : slots_(capacity + 1), data_(new T[capacity + 1]),
      front_(0), rear_(0) {}

bool enqueue(const T& value) {
    if (full()) return false;      // 容量固定
    data_[rear_] = value;
    rear_ = (rear_ + 1) % slots_;  // 取模绕回
    return true;
}
std::optional<T> dequeue() {
    if (empty()) return std::nullopt;
    T value = data_[front_];
    front_ = (front_ + 1) % slots_;
    return value;
}
size_type size() const {
    return (rear_ >= front_) ? (rear_ - front_)
                             : (slots_ - front_ + rear_);
}
// front_: 队头元素的下标
// rear_ : 下一个入队元素要写的下标`, 0.5, 1.02, 4.6, 4.1, { fontSize: 8.4 });
  table(s, [
    ["操作（容量 3, slots 4）", "data[0..3]", "front", "rear", "结果"],
    [{ t: "enqueue(1)", mono: true }, { t: "1 _ _ _", mono: true }, "0", "1", "true"],
    [{ t: "enqueue(2)", mono: true }, { t: "1 2 _ _", mono: true }, "0", "2", "true"],
    [{ t: "enqueue(3)", mono: true }, { t: "1 2 3 _", mono: true }, "0", "3", "true"],
    [{ t: "enqueue(4)", mono: true, fill: "FDF0EE" }, { t: "1 2 3 _", mono: true, fill: "FDF0EE" }, { t: "0", fill: "FDF0EE" }, { t: "3", fill: "FDF0EE" }, { t: "已满", bold: true, color: C.bad, fill: "FDF0EE" }],
    [{ t: "dequeue()", mono: true }, { t: "_ 2 3 _", mono: true }, "1", "3", "1"],
    [{ t: "enqueue(4)", mono: true, fill: "EAF4EF" }, { t: "_ 2 3 4", mono: true, fill: "EAF4EF" }, { t: "1", fill: "EAF4EF" }, { t: "0 ↺", bold: true, color: C.ok, fill: "EAF4EF" }, { t: "true", fill: "EAF4EF" }],
    [{ t: "full()?", mono: true }, { t: "(0+1)%4 == 1", mono: true }, "", "", { t: "满", bold: true, color: C.bad }],
    [{ t: "dequeue() ×3", mono: true }, { t: "_ _ _ _", mono: true }, "0 ↺", "0", "2 3 4"],
  ], 5.3, 1.02, 4.2, [1.35, 1.05, 0.5, 0.5, 0.8], { fontSize: 8.8, rowH: 0.36 });
  text(s, "rear 从 3 绕回 0；此时 front=1、rear=0，size = 4 − 1 + 0 = 3。", 5.3, 4.4, 4.2, 0.6, { fontSize: 10.5, color: C.goldText, bold: true });
}

// 2.3 linked queue concept
{
  const s = content("2.3", "2 队列 · 链式队列", "链式队列：front 指队首，rear 指队尾");
  // diagram
  const y = 1.6;
  ["a₁", "a₂", "a₃", "a₄"].forEach((v, i) => {
    const x = 1.3 + i * 1.25;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.55, h: 0.45, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.55, y, w: 0.3, h: 0.45, fill: { color: C.white }, line: { color: C.green, width: 1 } });
    text(s, v, x, y, 0.55, 0.45, { fontSize: 12, bold: true, align: "center", valign: "middle", margin: 0 });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: x + 0.7, y: y + 0.225, w: 0.55, h: 0, line: { color: C.green, width: 1.3, endArrowType: "triangle" } });
    else text(s, "∧", x + 0.55, y, 0.3, 0.45, { fontSize: 10, align: "center", valign: "middle", margin: 0 });
  });
  pill(s, "front", 1.1, 1.0, 0.8, 0.32, C.goldText, C.white, 10);
  s.addShape(pres.shapes.LINE, { x: 1.55, y: 1.32, w: 0, h: 0.28, line: { color: C.goldText, width: 1.5, endArrowType: "triangle" } });
  pill(s, "rear", 4.95, 1.0, 0.8, 0.32, C.green, C.white, 10);
  s.addShape(pres.shapes.LINE, { x: 5.3, y: 1.32, w: 0, h: 0.28, line: { color: C.green, width: 1.5, endArrowType: "triangle" } });
  text(s, "出队：删最前面的结点", 0.5, 2.15, 2.4, 0.3, { fontSize: 10, color: C.goldText, bold: true, margin: 0 });
  text(s, "入队：接到尾部、改 rear", 4.2, 2.15, 2.4, 0.3, { fontSize: 10, color: C.green, bold: true, margin: 0 });
  bullets(s, [
    "本质是**链表的简化**：链接方向从队首指向队尾。",
    "结点分散在堆上，**没有「队满」这回事**——「根据应用增删运算」的具体例子。",
    "**队尾指针是必需的**：没有它，每次入队都得从队头走到尾，O(n)；有了它，入队出队都是 O(1)。",
  ], 0.5, 2.6, 6.2, 2.5, { fontSize: 12, gap: 8 });
  callout(s, "不设表头虚结点", [
    { t: "为减少访问队首的代价，这种实现**没有专用表头虚结点**。代价是两个边界要单独处理：", plain: true },
    "① 插入到**空队列**：front、rear 都指向新结点；",
    "② 出队后**队列变空**：rear 也要置空。",
  ], 6.9, 1.0, 2.6, 4.1, { fontSize: 10.5, gap: 8 });
}

// linked queue code + dangling
{
  const s = content("2.3", "2 队列 · 链式队列 · 教学版", "最容易漏的一行：出队摘空时 rear 必须置空");
  codeBlock(s, `// 入队：新结点接到队尾。原来是空队列的话，它同时也是队头
void enqueue(const T& value) {
    Node* fresh = new Node;
    fresh->value = value;
    fresh->next = nullptr;
    if (rear_ == nullptr) {
        front_ = rear_ = fresh;          // 边界 ①
    } else {
        rear_->next = fresh;
        rear_ = fresh;
    }
    ++size_;
}
// 出队：摘下队头结点
std::optional<T> dequeue() {
    if (empty()) return std::nullopt;
    Node* dying = front_;
    T value = dying->value;
    front_ = dying->next;
    if (front_ == nullptr) {
        rear_ = nullptr;                 // 边界 ②：否则 rear 成野指针
    }
    delete dying;
    --size_;
    return value;
}`, 0.5, 1.02, 5.3, 4.1, { fontSize: 8.4, hl: [7, 21] });
  card(s, 6.0, 1.02, 3.5, 2.65, "FDF0EE");
  text(s, "漏掉边界 ② 会发生什么", 6.15, 1.1, 3.2, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  pill(s, "front = null", 6.15, 1.5, 1.35, 0.3, C.goldText, C.white, 9);
  pill(s, "rear", 7.9, 1.5, 0.7, 0.3, C.bad, C.white, 9);
  s.addShape(pres.shapes.LINE, { x: 8.25, y: 1.8, w: 0, h: 0.3, line: { color: C.bad, width: 1.5, endArrowType: "triangle" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.95, y: 2.1, w: 0.6, h: 0.42, fill: { color: "EEEEEE" }, line: { color: C.bad, width: 1, dashType: "dash" } });
  text(s, "已释放", 7.95, 2.1, 0.6, 0.42, { fontSize: 8.5, color: C.bad, align: "center", valign: "middle", margin: 0 });
  text(s, "下一次 `enqueue` 看到 `rear_ != nullptr`，执行 `rear_->next = fresh`——**写进已释放的内存**（use-after-free）。", 6.15, 2.65, 3.2, 0.95, { fontSize: 10.5, margin: 0 });
  callout(s, "clear() 同样用循环", "逐个 `delete` 结点，最后 `rear_ = nullptr; size_ = 0;`——长队列的递归析构会把运行栈撑爆。", 6.0, 3.8, 3.5, 1.3, { fontSize: 10.5 });
}

// ============================ PART 3 ============================
sectionSlide("Part 3", "栈与队列的深入讨论", "两种存储的取舍 · 双栈共享 · 限制存取点的表\n出栈序列判定与 Catalan 数");

// applications
{
  const s = content("3", "3 深入讨论 · 应用", "栈和队列都用在哪里");
  const cols = [
    ["栈  LIFO", C.dark, ["函数调用与递归实现", "深度优先周游（DFS）", "表达式转换与求值", "快速排序的非递归版本", "伸展树", "网页历史、undo 序列"]],
    ["队列  FIFO", C.green, ["消息 / 数据缓冲器：硬件设备间通信", "操作系统资源管理：内存、打印机", "**广度优先搜索（BFS）**的主要中间数据结构", "按优先级组织 → **优先队列**", "只要满足「先来先服务」即可"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.1, 4.35, 3.95, C.code);
    pill(s, c[0], x + 0.2, 1.25, 1.8, 0.45, c[1], C.white, 14);
    bullets(s, c[2], x + 0.2, 1.9, 4.0, 3.0, { fontSize: 13, gap: 10 });
  });
}

// 3.1 stack compare
{
  const s = content("3.1", "3 深入讨论", "顺序栈 vs 链式栈：时间难分伯仲，空间各有代价");
  table(s, [
    ["维度", "顺序栈", "链式栈"],
    [{ t: "push / pop", bold: true }, "O(1)（push 摊还）", "O(1)"],
    [{ t: "空间", bold: true }, "需说明固定长度；栈不满时**浪费**一些空间", "长度按需增减；每个元素一个指针域——**结构性开销**"],
    [{ t: "栈满", bold: true }, "需扩容（翻倍）", "没有这回事"],
    [{ t: "访问内部元素", bold: true, fill: C.cream }, { t: "按与栈顶的相对位置**快速定位**", fill: C.cream }, { t: "沿指针链**遍历**", fill: C.cream }],
    [{ t: "缓存局部性", bold: true }, "连续数组，好", "结点分散在堆上，差"],
  ], 0.5, 1.1, 9.0, [1.8, 3.6, 3.6], { fontSize: 12, rowH: 0.5 });
  card(s, 0.5, 4.3, 9.0, 0.8, C.dark);
  text(s, "正因为「访问内部元素」这一条，**顺序栈在实际中更常用一些**。", 0.7, 4.3, 8.6, 0.8, { fontSize: 15, color: C.white, valign: "middle", margin: 0 });
}

// double stack
{
  const s = content("3.1", "3 深入讨论 · 多栈管理", "一个数组存两个栈：从两端迎面延伸");
  card(s, 0.5, 1.1, 9.0, 1.9, C.code);
  image(s, "fig-3-13", 0.9, 1.2, 8.2, 1.7);
  bullets(s, [
    "编译系统等系统软件往往**同时管理多个栈**。",
    "利用顺序栈**单向延伸**的特性：数组两端分别是两个栈的栈底，向中间生长。",
    "栈满条件：`top1 + 1 == top2`——中间余量用完才算满。",
  ], 0.5, 3.2, 5.4, 1.9, { fontSize: 12.5, gap: 8 });
  callout(s, "什么时候划算", "两个栈的空间需求**恰好相反**（一个涨、另一个缩）时很省空间；两个**同时涨**，中间那点余量很快就没了。", 6.1, 3.2, 3.4, 1.9, { fontSize: 11.5 });
}

// 3.2 queue compare
{
  const s = content("3.2", "3 深入讨论", "顺序队列 vs 链式队列");
  table(s, [
    ["维度", "顺序队列（循环）", "链式队列"],
    [{ t: "enqueue / dequeue", bold: true }, "O(1)", "O(1)"],
    [{ t: "规模", bold: true }, "存储空间固定；无法应对**规模变化大且最大规模不可预测**", "轻松应对规模变化"],
    [{ t: "访问内部元素", bold: true }, "简单，适合需要访问队列内部元素的应用", "需遍历"],
    [{ t: "空间代价", bold: true }, "牺牲一格 + 未用空间", "每结点一个指针"],
    [{ t: "一个数组放两个？", bold: true, fill: C.cream }, { t: "**不能**——除非总有数据项从一个队列转入另一个", fill: C.cream }, { t: "—", fill: C.cream }],
  ], 0.5, 1.1, 9.0, [1.9, 4.1, 3.0], { fontSize: 12, rowH: 0.5 });
  callout(s, "工程提示", "如果能预测「浪涌」的统计特性，就可以大致估算出缓冲队列的长度，用顺序队列。时间效率上两者**没有优劣之分**。", 0.5, 4.3, 9.0, 0.8, { fontSize: 11.5, tsize: 11 });
}

// 3.3 restricted lists
{
  const s = content("3.3", "3 深入讨论", "限制存取点的表：栈和队列的变种");
  const variants = [
    ["双端队列 deque", "插入和删除都限制在**两端**。栈和队列都是它的特例。", [1, 1, 1, 1]],
    ["双栈", "两个底部相连的栈：从 end1 插入的只能从 end1 删除。", [1, 1, 1, 1]],
    ["超队列", "**删除**只在一端，插入可在两端（删除受限）。", [1, 1, 1, 0]],
    ["超栈", "**插入**只在一端，删除可在两端（插入受限）。", [1, 0, 1, 1]],
  ];
  // flags: [left-in, left-out, right-in, right-out]
  variants.forEach((v, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.65, y = 1.1 + row * 1.95;
    card(s, x, y, 4.35, 1.8, C.code);
    text(s, v[0], x + 0.2, y + 0.1, 3.9, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, v[1], x + 0.2, y + 0.45, 3.95, 0.55, { fontSize: 10.5, margin: 0 });
    cells(s, x + 1.4, y + 1.12, ["", "", "", ""], { cw: 0.38, ch: 0.38, fills: [C.mint, C.mint, C.mint, C.mint] });
    const f = v[2];
    const arrow = (xx, yy, dirIn, color) => s.addShape(pres.shapes.LINE, { x: xx, y: yy, w: 0.4, h: 0, line: { color, width: 1.8, endArrowType: dirIn ? "triangle" : undefined, beginArrowType: dirIn ? undefined : "triangle" } });
    if (f[0]) { s.addShape(pres.shapes.LINE, { x: x + 0.9, y: y + 1.2, w: 0.45, h: 0, line: { color: C.green, width: 1.8, endArrowType: "triangle" } }); text(s, "入", x + 0.6, y + 1.08, 0.3, 0.22, { fontSize: 8.5, color: C.green, bold: true, margin: 0 }); }
    if (f[1]) { s.addShape(pres.shapes.LINE, { x: x + 0.9, y: y + 1.4, w: 0.45, h: 0, line: { color: C.goldText, width: 1.8, beginArrowType: "triangle" } }); text(s, "出", x + 0.6, y + 1.3, 0.3, 0.22, { fontSize: 8.5, color: C.goldText, bold: true, margin: 0 }); }
    if (f[2]) { s.addShape(pres.shapes.LINE, { x: x + 2.97, y: y + 1.2, w: 0.45, h: 0, line: { color: C.green, width: 1.8, beginArrowType: "triangle" } }); text(s, "入", x + 3.45, y + 1.08, 0.3, 0.22, { fontSize: 8.5, color: C.green, bold: true, margin: 0 }); }
    if (f[3]) { s.addShape(pres.shapes.LINE, { x: x + 2.97, y: y + 1.4, w: 0.45, h: 0, line: { color: C.goldText, width: 1.8, endArrowType: "triangle" } }); text(s, "出", x + 3.45, y + 1.3, 0.3, 0.22, { fontSize: 8.5, color: C.goldText, bold: true, margin: 0 }); }
    if (i === 1) s.addShape(pres.shapes.LINE, { x: x + 2.16, y: y + 1.05, w: 0, h: 0.52, line: { color: C.bad, width: 2.5 } });
  });
  text(s, "C++ 标准库有 `std::deque`，`std::stack` 与 `std::queue` 默认都由它实现——但那是**使用者的视角**。本章手写，是因为「存储怎么落、边界怎么守」本身就是教学内容。", 0.5, 5.0, 9, 0.45, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// stack sequence: rules
{
  const s = content("3.3", "3 深入讨论 · 出栈序列", "车辆 1…n 依次进栈，给定出栈次序，能不能得到？");
  text(s, "回答它**不需要搜索**。拿栈模拟一遍，每一步都没有选择余地——看下一辆要开出的车：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  const cases = [
    ["正在栈顶", "必须**现在就开出**。再压进一辆，它就被盖住了。", C.ok],
    ["还没进栈", "只能把后面的车**一辆辆压进去**，直到它到达栈顶。", C.green],
    ["已在栈里、却不在栈顶", "它上面压着别的车，**这个次序不可能**。", C.bad],
  ];
  cases.forEach((c, i) => {
    const y = 1.5 + i * 0.8;
    numCircle(s, i + 1, 0.5, y + 0.12, 0.45, c[2]);
    text(s, c[0], 1.1, y, 2.3, 0.7, { fontSize: 13.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, c[1], 3.4, y, 2.9, 0.7, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  text(s, "第 3 种不必单独判断：车全部进过栈了还等不到它，就是它。", 0.5, 3.95, 5.8, 0.35, { fontSize: 11, color: C.goldText, bold: true });
  // example 3,1,2
  card(s, 6.5, 1.5, 3.0, 3.6, C.code);
  text(s, "例：3, 1, 2", 6.7, 1.58, 2.6, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const stk = [["1", C.mint], ["2", C.mint], ["3", "CDEBD9"]];
  stk.forEach((v, i) => {
    const y = 3.35 - i * 0.45;
    s.addShape(pres.shapes.RECTANGLE, { x: 6.85, y, w: 0.7, h: 0.42, fill: { color: v[1] }, line: { color: C.green, width: 1 } });
    text(s, v[0], 6.85, y, 0.7, 0.42, { fontSize: 13, bold: true, align: "center", valign: "middle", margin: 0 });
  });
  s.addShape(pres.shapes.LINE, { x: 7.6, y: 2.47, w: 0.4, h: 0, line: { color: C.ok, width: 1.5, endArrowType: "triangle" } });
  text(s, "3 开出 ✓", 8.05, 2.35, 1.3, 0.25, { fontSize: 10, color: C.ok, bold: true, margin: 0 });
  text(s, "栈顶变成 2", 8.05, 2.87, 1.3, 0.25, { fontSize: 10, color: C.text, margin: 0 });
  text(s, "1 被压住 ✗", 8.05, 3.35, 1.3, 0.25, { fontSize: 10, color: C.bad, bold: true, margin: 0 });
  text(s, "3 要先开出 → 1、2 必须都已进栈，且 2 压在 1 上面；3 开走后栈顶是 2，**1 出不来**。", 6.7, 3.9, 2.7, 1.1, { fontSize: 10, margin: 0 });
  callout(s, "对照：2, 1, 3 可行", "Push Push Pop Pop Push Pop", 0.5, 4.4, 5.8, 0.7, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// stack sequence code + catalan chart
{
  const s = content("3.3", "3 深入讨论 · 出栈序列", "stack_operations_for：O(n) 判定 & Catalan 数");
  codeBlock(s, `enum class StackOp { Push, Pop };

[[nodiscard]] inline std::optional<std::vector<StackOp>>
stack_operations_for(const std::vector<int>& pop_order) {
    const int n = static_cast<int>(pop_order.size());
    ArrayStack<int> stack;
    std::vector<StackOp> ops;
    int next_car = 1;                    // 下一辆等着进栈的车
    for (int wanted : pop_order) {
        while (stack.empty() || *stack.peek() != wanted) {
            if (next_car > n) {
                return std::nullopt;     // 车都进过栈了：它被压在下面
            }
            stack.push(next_car);
            ++next_car;
            ops.push_back(StackOp::Push);
        }
        (void)stack.pop();
        ops.push_back(StackOp::Pop);
    }
    return ops;
}`, 0.5, 1.02, 5.2, 3.2, { fontSize: 8.4 });
  bullets(s, [
    "「次序不可能」是**可预期结果**，返回 `nullopt` 而不是抛异常——与空栈 `pop()` 口径一致。",
    "每辆车至多进栈、出栈各一次 → **O(n)**。重复、缺号、越界的编号同样返回 `nullopt`。",
  ], 0.5, 4.3, 5.2, 0.85, { fontSize: 10, gap: 3 });
  s.addChart(pres.charts.BAR, [{ name: "合法出栈序列数", labels: ["1", "2", "3", "4", "5", "6", "7"], values: [1, 2, 5, 14, 42, 132, 429] }], {
    x: 5.9, y: 1.02, w: 3.6, h: 3.05, barDir: "col", chartColors: [C.green],
    showTitle: true, title: "n 辆车的合法出栈序列数", titleFontSize: 11, titleColor: C.dark, titleFontFace: FONT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 9, dataLabelColor: C.dark,
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted, valAxisLabelFontSize: 8, catAxisLabelFontSize: 9,
    valGridLine: { color: "E5EAE8", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
    showCatAxisTitle: true, catAxisTitle: "n", catAxisTitleFontSize: 9, catAxisTitleColor: C.muted,
  });
  card(s, 5.9, 4.15, 3.6, 0.95, C.dark);
  text(s, "Catalan 数  Cₙ = (2n)! / ((n+1)! · n!)", 6.05, 4.2, 3.4, 0.35, { fontSize: 11.5, bold: true, color: C.gold, margin: 0 });
  text(s, "测试对 n = 1…7 穷举全部 5913 个排列逐个核对。", 6.05, 4.55, 3.4, 0.5, { fontSize: 10, color: C.white, margin: 0 });
}

  summarySlide("本章小结", [
    ["限制换 O(1)", "栈和队列都是**限制了存取点的线性表**，限制换来的是每个操作 O(1)。"],
    ["两种存储", "顺序实现省空间、能随机访问内部元素；链式实现不会满，但有指针开销。"],
    ["循环队列", "用取模把数组看成环，解决**假溢出**；**牺牲一格**区分空与满。"],
    ["递归 = 运行栈", "深度受 `ulimit -s` 限制；可靠的深递归写法只有**显式栈**。-O2 把递归消成循环**不能依赖**。"],
    ["接口口径", "可预期的空状态返回 `optional`；调用方的错误抛异常；容器内部**零 I/O**。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
