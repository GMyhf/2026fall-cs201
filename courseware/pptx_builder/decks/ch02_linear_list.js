// 第二章 线性表 —— 由 202609_DSA_02_Linear_List.md 整理成的讲课 PPT。
// 正文（1–4 节 + 小结）+ 附录A 编程练习（E160 / E206 / M1472 / M146 / E21 / E234）。
// 生成：cd courseware/pptx_builder && node decks/ch02_linear_list.js ../202609_DSA_02_Linear_List.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_02_Linear_List.pptx");

// 讲义中引用的图片（name → url）；幻灯片里用 image(s, name, ...) 引用
// 讲义里的 fig-2-5（头尾双指针单链表）只有本机路径，没有可下载地址，这里改为用形状自己画。
const IMAGES = {
  "fig-2-4": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-2-4.png",
  "fig-2-6": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-2-6.png",
  "fig-2-10": "https://raw.githubusercontent.com/GMyhf/img1/main/fig-2-10.png",
  lru: "https://raw.githubusercontent.com/GMyhf/img1/main/1696039105-PSyHej-146-3-c.png",
};

(async () => {
  const D = createDeck({ title: "DSA 第二章 线性表", imgDir: path.join(__dirname, "..", ".cache", "ch02") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  // ---- 本章专用的小画图工具（放在 deck 文件里，不动 lib.js）----

  // 单链表：一串 [data|next] 结点，最后一个画 ∧
  function chain(s, x, y, vals, opts = {}) {
    const dw = opts.dw || 0.55, nw = opts.nw || 0.26, h = opts.h || 0.42, gap = opts.gap || 0.4;
    const step = dw + nw + gap;
    vals.forEach((v, i) => {
      const bx = x + i * step;
      const fill = opts.fills?.[i] || opts.fill || C.mint;
      s.addShape(pres.shapes.RECTANGLE, { x: bx, y, w: dw, h, fill: { color: fill }, line: { color: C.green, width: 1 } });
      s.addShape(pres.shapes.RECTANGLE, { x: bx + dw, y, w: nw, h, fill: { color: C.white }, line: { color: C.green, width: 1 } });
      text(s, String(v), bx, y, dw, h, { fontSize: opts.fs || 11, bold: true, color: opts.colors?.[i] || C.dark, align: "center", valign: "middle", margin: 0 });
      if (i < vals.length - 1) {
        s.addShape(pres.shapes.LINE, { x: bx + dw + nw, y: y + h / 2, w: gap, h: 0, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
      } else if (opts.nil !== false) {
        text(s, "∧", bx + dw, y, nw, h, { fontSize: 10, color: C.muted, align: "center", valign: "middle", margin: 0 });
      }
    });
    return { step, width: vals.length * step - gap };
  }

  // 双链表：一串结点，相邻之间画双向箭头
  function dchain(s, x, y, vals, opts = {}) {
    const bw = opts.bw || 0.8, h = opts.h || 0.42, gap = opts.gap || 0.42;
    const step = bw + gap;
    vals.forEach((v, i) => {
      const bx = x + i * step;
      const sentinel = opts.sentinels?.includes(i);
      s.addShape(pres.shapes.RECTANGLE, { x: bx, y, w: bw, h, fill: { color: sentinel ? "E8ECEA" : (opts.fills?.[i] || C.mint) }, line: { color: sentinel ? C.muted : C.green, width: 1, dashType: sentinel ? "dash" : "solid" } });
      text(s, String(v), bx, y, bw, h, { fontSize: opts.fs || 10.5, bold: true, color: sentinel ? C.muted : C.dark, align: "center", valign: "middle", margin: 0 });
      if (i < vals.length - 1) {
        s.addShape(pres.shapes.LINE, { x: bx + bw, y: y + h / 2, w: gap, h: 0, line: { color: C.green, width: 1.2, beginArrowType: "triangle", endArrowType: "triangle" } });
      }
    });
    return { step, width: vals.length * step - gap };
  }

  // 指向某个结点的标签（默认画在上方）
  function ptr(s, label, cx, y, color = C.goldText, below = false) {
    if (!below) {
      pill(s, label, cx - 0.45, y - 0.72, 0.9, 0.3, color, C.white, 9.5);
      s.addShape(pres.shapes.LINE, { x: cx, y: y - 0.4, w: 0, h: 0.34, line: { color, width: 1.4, endArrowType: "triangle" } });
    } else {
      s.addShape(pres.shapes.LINE, { x: cx, y: y + 0.48, w: 0, h: 0.32, line: { color, width: 1.4, beginArrowType: "triangle" } });
      pill(s, label, cx - 0.45, y + 0.82, 0.9, 0.3, color, C.white, 9.5);
    }
  }

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. 封面
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第二章  线性表",
  subtitle: "Linear List：顺序表与链表",
  topics: "线性表的定义 (K, R) 与结构特点 · 抽象数据类型与运算的五个类别\n顺序表：类定义、检索、插入、删除、翻倍扩容 · 三法则与二次释放\n单链表：结点、头结点、尾指针、循链定位 · 双链表 · 循环链表\n两种实现的代价对比与取舍 · 附录：6 道链表编程练习",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-16 · github.com/GMyhf/2026fall-cs201",
});

// 2. 本章三个问题
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["一串同类型元素排成唯一的先后次序，怎么存？", "**顺序表**、**链表**（单链表、双链表、循环链表）。"],
    ["为什么同一个操作，在两种结构上代价差一个数量级？", "关键是分清「**按位置找元素**」和「**已知结点后改链接**」这两类操作。"],
    ["自己管着 `new` 出来的内存，最少要写哪几个函数？", "**三法则**：析构、拷贝构造、拷贝赋值。"],
  ];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.55, C.code);
    numCircle(s, i + 1, x + 0.2, 1.32, 0.46, C.dark);
    text(s, q[0], x + 0.2, 1.92, 2.5, 0.8, { fontSize: 13.5, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], x + 0.2, 2.75, 2.5, 0.85, { fontSize: 11.5, margin: 0, lsm: 1.2 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "一句话概括", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "顺序表按下标读是 ", options: { color: C.white } },
    { text: "O(1)", options: { color: C.gold, bold: true, fontFace: MONO } },
    { text: "，插删要搬 ", options: { color: C.white } },
    { text: "O(n)", options: { color: C.gold, bold: true, fontFace: MONO } },
    { text: " 个元素；链表已知前驱后插删是 ", options: { color: C.white } },
    { text: "O(1)", options: { color: C.gold, bold: true, fontFace: MONO } },
    { text: "，但找到那个前驱仍是 ", options: { color: C.white } },
    { text: "O(n)", options: { color: C.gold, bold: true, fontFace: MONO } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 14, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. 内容地图
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["正文", ["1 线性表的概念：定义 (K, R)、结构特点、ADT 运算表", "2 顺序表：类定义、检索、插入、删除、扩容、三法则", "3 链表：单链表（头结点、尾指针、循链定位）、双链表、循环链表", "4 两种实现方法的比较与取舍", "本章小结"]],
    ["附录A 编程练习", ["预备：结点定义、三条铁律、哨兵", "单向链表：E160 相交链表、E206 反转链表", "双向链表：M1472 浏览器历史、M146 LRU 缓存", "核心技巧：E21 合并有序链表、E234 回文链表", "小结：复杂度总表、五个模板、自检清单"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.15, 4.35, 3.35, i === 0 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 4.0, 0.45, { fontSize: 19, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 4.1, 2.5, { fontSize: 12, gap: 8 });
  });
  card(s, 0.5, 4.65, 9.0, 0.5, C.dark);
  text(s, "讲的是「如何自己造一个链表类」；练的是「拿到别人造好的链表，怎么在上面写算法」——两者合起来才是完整的。", 0.7, 4.65, 8.6, 0.5, { fontSize: 12, color: C.white, valign: "middle", margin: 0 });
}

// 4. 先跑一遍：顺序表
{
  const s = content("▶", "先跑一遍", "用教学版 ArrayList 走一遍 append / insert / find / remove");
  codeBlock(s, `#include "teaching.hpp"
#include <iostream>

int main() {
    ArrayList<int> values;
    values.append(10);
    values.append(30);
    values.insert(1, 20);

    std::cout << "顺序表:";
    for (int value : values) {   // 有 begin()/end()，range-for 可用
        std::cout << ' ' << value;
    }

    // find 返回 optional：有值才解引用
    if (auto pos = values.find(20)) {
        std::cout << "\\n查找 20 的下标: " << *pos << '\\n';
    }

    std::cout << "删除位置 1 得到 " << values.remove(1) << "，剩余:";
    for (int value : values) {
        std::cout << ' ' << value;
    }
    std::cout << '\\n';
}`, 0.5, 1.1, 5.5, 4.0, { fontSize: 9 });
  consoleBlock(s, "顺序表: 10 20 30\n查找 20 的下标: 1\n删除位置 1 得到 20，剩余: 10 30", 6.2, 1.1, 3.3, 1.2);
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror \\\n  -Icode/ch02/array_list \\\n  code/ch02/array_list/demo.cpp", 6.2, 2.4, 3.3, 0.65, { fontSize: 8.5, color: C.muted });
  callout(s, "看到了什么", [
    "`insert(1, 20)` 要把后面的元素**右移一位**——顺序表的固有代价。",
    "`find` 返回 `optional`：**有值才解引用**，「没找到」不是错误。",
    "`remove` 把删掉的元素**带回来**，不用先读一次再删。",
  ], 6.2, 3.15, 3.3, 1.95, { fontSize: 11 });
}

// 5. 先跑一遍：链表
{
  const s = content("▶", "先跑一遍", "用教学版 LinkedList 走一遍 append / insert / remove");
  codeBlock(s, `#include "teaching.hpp"
#include <iostream>

int main() {
    LinkedList<int> values;
    values.append(10);
    values.append(30);        // 经尾指针 O(1) 接链
    values.insert(1, 20);     // 只改两条链接，但要先循链找前驱

    std::cout << "链表:";
    for (int value : values) {
        std::cout << ' ' << value;
    }
    std::cout << "\\n删除位置 0 得到 " << values.remove(0) << "，剩余:";
    for (int value : values) {
        std::cout << ' ' << value;
    }
    std::cout << "\\nappend 之后尾元素是 "
              << values.at(values.size() - 1) << '\\n';
}`, 0.5, 1.1, 5.5, 4.0, { fontSize: 9 });
  consoleBlock(s, "链表: 10 20 30\n删除位置 0 得到 10，剩余: 20 30\nappend 之后尾元素是 30", 6.2, 1.1, 3.3, 1.2);
  callout(s, "看到了什么", [
    "同一组操作，链表**只改两条链接**，不搬元素。",
    "但**按位置找前驱仍是 O(n)**——定位是链表的瓶颈。",
    "`append` 经**尾指针** O(1) 接链，不必再从头走到尾。",
  ], 6.2, 2.4, 3.3, 1.95, { fontSize: 11 });
  card(s, 6.2, 4.5, 3.3, 0.6, C.dark);
  text(s, "顺序表：搬 · 链表：走", 6.2, 4.5, 3.3, 0.6, { fontSize: 15, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
}

// ============================ PART 1 ============================
sectionSlide("Part 1", "线性表的概念", "定义 (K, R) 与结构特点 · 运算的五个类别\nADT 运算表 · 两类存储结构");

// 1.1 定义
{
  const s = content("1", "1 线性表的概念", "线性表：有限且有序的元素序列");
  text(s, "**线性表**（linear list）是由称为**元素**（element）的数据项组成的一种**有限且有序**的序列。用二元组 B = (K, R) 写出来就是：", 0.5, 1.02, 9, 0.5, { fontSize: 12.5 });
  card(s, 0.5, 1.6, 9.0, 0.75, C.code);
  text(s, "K = { k₀, k₁, ⋯, kₙ₋₁ },    R = { r },    r = { ⟨kᵢ, kᵢ₊₁⟩,  0 ≤ i ≤ n−2 }", 0.5, 1.6, 9.0, 0.75, { fontSize: 15, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  bullets(s, [
    "元素个数 **n** 称为线性表的**长度**；n = 0 时称**空表**。",
    "k₀ 称开始结点或**表首**，kₙ₋₁ 称终止结点或**表尾**。",
    "线性关系 r 刻画**前驱、后继**关系，具有**反对称性**和**传递性**。",
  ], 0.5, 2.55, 5.6, 1.6, { fontSize: 12.5, gap: 8 });
  callout(s, "逻辑特征（一句话）", "K 中每个结点在关系 r 上**最多只有一个前驱和一个后继**。", 6.35, 2.55, 3.15, 1.0, { fontSize: 11.5 });
  // 线性关系示意：k₀ → k₁ → k₂ → ⋯ → kₙ₋₁
  ["k₀", "k₁", "k₂"].forEach((v, i) => {
    const x = 0.6 + i * 1.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.35, w: 0.62, h: 0.42, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
    text(s, v, x, 4.35, 0.62, 0.42, { fontSize: 11, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.62, y: 4.56, w: 0.38, h: 0, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
  });
  text(s, "⋯", 3.6, 4.35, 0.4, 0.42, { fontSize: 14, color: C.muted, align: "center", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 4.0, y: 4.56, w: 0.38, h: 0, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.4, y: 4.35, w: 0.72, h: 0.42, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
  text(s, "kₙ₋₁", 4.4, 4.35, 0.72, 0.42, { fontSize: 11, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  text(s, "每个结点最多一个前驱、一个后继", 5.5, 4.35, 4.0, 0.42, { fontSize: 11, color: C.goldText, bold: true, valign: "middle", margin: 0 });
}

// 1.2 结构特点
{
  const s = content("1", "1 线性表的概念", "线性结构的两个结构特点");
  const feats = [
    ["均匀性", "同一线性表中的各数据元素必定具有**相同的数据类型和长度**。", C.green],
    ["有序性", "各元素在表中都有自己的位置，元素之间的**相对位置是线性的**。", C.goldText],
  ];
  feats.forEach((f, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.1, 4.35, 1.5, C.code);
    pill(s, f[0], x + 0.2, 1.25, 1.2, 0.4, f[2], C.white, 13);
    text(s, f[1], x + 0.2, 1.78, 3.95, 0.7, { fontSize: 12, margin: 0 });
  });
  callout(s, "注", "概念上并不反对元素类型不同（例如**广义表**），但那属于高级线性结构。", 0.5, 2.75, 4.35, 0.85, { fontSize: 11 });
  card(s, 5.15, 2.75, 4.35, 0.85, C.mint);
  text(s, "同一种线性结构，不同场合不同称谓", 5.35, 2.82, 4.0, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  text(s, "顺序表 · 链表 · 串 · 栈 · 顺序文件；元素相应地叫**表目**、**结点**或**记录**。", 5.35, 3.12, 4.0, 0.45, { fontSize: 11, margin: 0 });
  // 运算两大类
  text(s, "线性表上的运算：两大类", 0.5, 3.8, 9, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const two = [
    ["对整个表", "创建 / 置空一个线性表；合并两个线性表；判断表是否为空或为满"],
    ["对表中元素", "查找满足一定条件的元素；在表中插入或删除指定的元素"],
  ];
  two.forEach((t, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 4.2, 4.35, 0.9, i === 0 ? "EAF4EF" : C.cream);
    text(s, t[0], x + 0.15, 4.26, 4.05, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, t[1], x + 0.15, 4.56, 4.05, 0.5, { fontSize: 11, margin: 0 });
  });
}

// 1.3 五类运算
{
  const s = content("1", "1 线性表的概念", "按特性细分：线性表的运算分 5 类");
  const kinds = [
    ["①", "创建", "创建线性表的一个实例", C.green],
    ["②", "析构", "消除实例并释放所占空间", C.bad],
    ["③", "获取信息", "由内容寻找位置、由位置读取元素内容——**不改变表的内容**", C.goldText],
    ["④", "访问并改变", "更新指定元素、添加元素、删除元素、清空线性表", C.dark],
    ["⑤", "辅助管理", "例如求表的当前长度", C.muted],
  ];
  kinds.forEach((k, i) => {
    const y = 1.1 + i * 0.68;
    card(s, 0.5, y, 9.0, 0.6, i % 2 === 0 ? C.code : C.white);
    text(s, k[0], 0.62, y, 0.4, 0.6, { fontSize: 15, bold: true, color: k[3], align: "center", valign: "middle", margin: 0 });
    text(s, k[1], 1.1, y, 1.5, 0.6, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, k[2], 2.65, y, 6.7, 0.6, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  callout(s, "为什么要分类", "① ② 管**生命周期**，③ 是**只读**查询，④ 才会改内容或结构，⑤ 是辅助。分清「只读」与「会改」，接口的常量性（`const`）和异常口径就都定下来了。", 0.5, 4.55, 9.0, 0.6, { fontSize: 11, tsize: 11 });
}

// 1.4 ADT 运算表
{
  const s = content("1", "1 线性表的概念", "把这组运算定义在 ArrayList<T> 上：这张表");
  table(s, [
    ["运算", "含义", "时间代价"],
    [{ t: "at(i) / set(i, x)", mono: true }, "按下标取值、改值", "O(1)"],
    [{ t: "find(x)", mono: true }, "按内容查位置；**找不到返回「没有」**", "O(n)"],
    [{ t: "insert(i, x)", mono: true }, "在位置 i 插入", "O(n)"],
    [{ t: "append(x)", mono: true }, "在表尾追加", "摊还 O(1)"],
    [{ t: "remove(i)", mono: true }, "删除位置 i 上的元素**并把它带回来**", "O(n)"],
    [{ t: "size() / empty() / clear()", mono: true }, "长度、判空、置空", "O(1)"],
  ], 0.5, 1.15, 6.2, [1.9, 3.15, 1.15], { fontSize: 11, rowH: 0.45 });
  callout(s, "「没有」在 C++17 里怎么说", [
    "`std::optional<size_type>`：一个**可能装着下标的盒子**。",
    "找到了盒子里是下标；没找到盒子是空的（`std::nullopt`）。",
    "**取值必须先开盒**，这一步绕不过去。",
  ], 6.9, 1.15, 2.6, 2.05, { fontSize: 10.5 });
  callout(s, "⚠ 空盒子取值", "直接 `*` 取值是**未定义行为**；用 `.value()` 取会抛 `std::bad_optional_access`。", 6.9, 3.35, 2.6, 1.15, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  text(s, "运算的具体实现与它在计算机中的物理存储结构密切相关，效率也与存储结构相关。", 0.5, 4.6, 6.2, 0.5, { fontSize: 11, color: C.muted });
}

// 1.5 两类存储结构
{
  const s = content("1", "1 线性表的概念", "两类存储结构：逻辑结构到存储空间的映射");
  text(s, "存储结构本质上是**逻辑结构到存储空间的映射**：既要为**结点集合**到存储器单元建立映射，也要为元素之间的**线性关系**到相应存储单元地址间的关系建立映射。", 0.5, 1.02, 9, 0.55, { fontSize: 12 });
  const kinds = [
    ["定长的顺序存储结构", "顺序表", ["通过创建**数组**建立，分配一块**连续**的存储空间；", "元素顺序存储在地址连续的空间中，以**物理位置相邻**表示元素之间的关系；", "不足：**限制了线性表的长度变化**。"], "EAF4EF", C.ok],
    ["变长的线性存储结构", "链表（链接式存储）", ["用**指针**表示元素之间的线性关系，靠前驱 / 后继关系把元素链接起来；", "**对表长不加限制**，要加新元素时可方便地申请空间并链接到合适位置；", "代价：每个结点多一根指针。"], C.cream, C.goldText],
  ];
  kinds.forEach((k, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.65, 4.35, 2.65, k[3]);
    numCircle(s, i + 1, x + 0.18, 1.8, 0.42, k[4]);
    text(s, k[0], x + 0.72, 1.82, 3.5, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
    text(s, "简称 " + k[1], x + 0.72, 2.12, 3.5, 0.28, { fontSize: 10.5, color: C.muted, margin: 0 });
    bullets(s, k[2], x + 0.18, 2.5, 4.0, 1.7, { fontSize: 10.5, gap: 5 });
  });
  // 两种存储的小示意
  cells(s, 0.9, 4.55, [10, 20, 30, 40], { cw: 0.5, ch: 0.38, fs: 10 });
  text(s, "连续数组", 3.05, 4.55, 1.6, 0.38, { fontSize: 10, color: C.muted, valign: "middle", margin: 0 });
  chain(s, 5.4, 4.55, [10, 20, 30], { dw: 0.42, nw: 0.2, h: 0.38, gap: 0.25, fs: 9.5 });
  text(s, "散落的结点 + 指针", 8.0, 4.55, 1.5, 0.38, { fontSize: 10, color: C.muted, valign: "middle", margin: 0 });
}

// ============================ PART 2 ============================
sectionSlide("Part 2", "顺序表", "地址公式与随机存取 · 类定义 · 检索 / 插入 / 删除\n翻倍扩容 · 三法则与二次释放");

// 2.0 为什么没有 Python 版
{
  const s = content("2", "2 顺序表", "为什么这一节没有 Python 版");
  text(s, "这里**故意只给 C++**。", 0.5, 1.05, 9, 0.35, { fontSize: 14, bold: true, color: C.dark });
  bullets(s, [
    "顺序表的重点**不是**「把几个值放进一个序列」，而是**容量**、**对象生命周期**，以及**扩容失败时旧数组是否仍然有效**。",
    "若直接写成 Python `list`，扩容、元素搬迁和析构都由**解释器隐藏**；得到的是一个可用的容器，却看不到**三法则**、移动语义和强异常保证为何存在。",
    "算法侧可以把同一思想用 Python 重讲；**存储侧**若也用 `list`，反而会把本节要教的课删掉。",
  ], 0.5, 1.5, 5.6, 2.3, { fontSize: 12.5, gap: 10 });
  callout(s, "本节要看见的三件事", [
    "容量 `capacity_` 与长度 `size_` 是**两件事**；",
    "`new T[n]` / `delete[]` 成对出现，谁来配对？",
    "`grow()` 抛异常时，**旧数组还能不能用**？",
  ], 6.35, 1.5, 3.15, 2.3, { fontSize: 11 });
  card(s, 0.5, 4.0, 9.0, 1.05, C.dark);
  text(s, "按顺序方式存储的线性表称为**顺序表**（array-based list），又称**向量**（vector），通过数组建立。", 0.7, 4.0, 8.6, 1.05, { fontSize: 13, color: C.white, valign: "middle", margin: 0 });
}

// 2.1 地址公式
{
  const s = content("2.1", "2 顺序表", "地址公式：顺序表是随机存取的存储结构");
  text(s, "假设每个元素占 **L** 个存储单元，开始结点 k₀ 的存储位置记为 **b = loc(k₀)**（首地址），则下标为 i 的元素 kᵢ 的存储位置是：", 0.5, 1.02, 9, 0.5, { fontSize: 12 });
  card(s, 0.5, 1.58, 4.35, 0.7, C.dark);
  text(s, "loc(kᵢ) = b + i × L", 0.5, 1.58, 4.35, 0.7, { fontSize: 20, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
  callout(s, "推论", "只要确定了基地址，任一元素的地址都能**直接算出** → 按下标取值 **O(1)**。**物理相邻表示了逻辑相邻。**", 5.15, 1.58, 4.35, 0.7, { fontSize: 11 });
  text(s, "(a) 线性表的逻辑结构", 0.5, 2.42, 4.4, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["数据元素", "k₀", "k₁", "…", "kᵢ", "…", "kₙ₋₁"],
    ["逻辑地址", "0", "1", "…", "i", "…", "n−1"],
  ], 0.5, 2.72, 4.35, [1.1, 0.54, 0.54, 0.45, 0.54, 0.45, 0.73], { fontSize: 10, rowH: 0.32, align: "center" });
  text(s, "(b) 线性表的顺序存储结构", 5.15, 2.42, 4.4, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["数据元素", "k₀", "k₁", "…", "kᵢ", "…", "kₙ₋₁"],
    ["存储地址", "b", "b+L", "…", "b+i·L", "…", "b+(n−1)·L"],
  ], 5.15, 2.72, 4.35, [0.95, 0.4, 0.62, 0.35, 0.79, 0.35, 0.89], { fontSize: 9, rowH: 0.32, align: "center" });
  // 示意：连续内存
  text(s, "内存里的样子", 0.5, 3.6, 2, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  cells(s, 0.5, 4.05, ["k₀", "k₁", "k₂", "k₃", "", ""], { cw: 0.72, ch: 0.45, fs: 11, fills: [C.mint, C.mint, C.mint, C.mint, C.white, C.white] });
  text(s, "b", 0.5, 4.53, 0.72, 0.25, { fontSize: 9, color: C.goldText, bold: true, align: "center", margin: 0 });
  text(s, "b+L", 1.22, 4.53, 0.72, 0.25, { fontSize: 9, color: C.goldText, bold: true, align: "center", margin: 0 });
  text(s, "b+2L", 1.94, 4.53, 0.72, 0.25, { fontSize: 9, color: C.goldText, bold: true, align: "center", margin: 0 });
  text(s, "size_ = 4", 4.95, 4.05, 1.4, 0.45, { fontSize: 11, bold: true, color: C.green, valign: "middle", margin: 0 });
  text(s, "capacity_ = 6", 6.3, 4.05, 1.6, 0.45, { fontSize: 11, bold: true, color: C.goldText, valign: "middle", margin: 0 });
  text(s, "空槽位不属于表", 7.9, 4.05, 1.6, 0.45, { fontSize: 10, color: C.muted, valign: "middle", margin: 0 });
}

// 2.2 类定义
{
  const s = content("2.2.1", "2 顺序表 · 类定义", "缓冲区是裸指针，于是这个类必须守三法则");
  codeBlock(s, `template <typename T>
class ArrayList {
public:
    explicit ArrayList(size_type initial_capacity = 8)
        : data_(new T[initial_capacity]),
          capacity_(initial_capacity), size_(0) {}

    ~ArrayList() { delete[] data_; }
    // ... 三法则的另外两个见下文

private:
    T* data_;             // 指向底层数组      —— 原书 T* aList
    size_type capacity_;  // 数组能放多少个    —— 原书 int maxSize
    size_type size_;      // 现在放了几个      —— 原书 int curLen
};`, 0.5, 1.1, 5.7, 2.35, { fontSize: 9.5 });
  callout(s, "三法则（Rule of Three）", "一个类只要写了**析构函数、拷贝构造、拷贝赋值**中的任意一个，通常这三个都得写。", 6.4, 1.1, 3.1, 1.15, { fontSize: 11 });
  callout(s, "为什么用裸指针而不是 unique_ptr", "**顺序表的存储管理正是本节的教学内容**：用 `std::unique_ptr<T[]>` 时这几个函数编译器生成的就够用，**看不到它们为什么必须存在**。", 6.4, 2.4, 3.1, 2.1, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "理由很直白：你之所以要写析构函数，是因为你在**管资源**；既然在管资源，编译器那份「逐成员照抄」的拷贝就**一定是错的**——照抄一个指针成员的结果是**两个对象指向同一块内存**，各自析构时各释放一次，**同一块内存被释放两次**。", 0.5, 3.6, 5.7, 1.5, { fontSize: 11.5, lsm: 1.15 });
}

// 2.3 检索：按位置
{
  const s = content("2.2.2", "2 顺序表 · 运算实现", "检索之一：按位置的检索 O(1)");
  text(s, "按位置的检索**直接由地址公式算出**：先查下标合不合法，然后直接 `data_[index]`，**没有循环**。", 0.5, 1.02, 9, 0.4, { fontSize: 12.5 });
  codeBlock(s, `const T& at(size_type index) const {
    if (index >= size_) {
        throw std::out_of_range("ArrayList::at: 下标越界");
    }
    return data_[index];        // 直接算地址，没有循环
}

void set(size_type index, const T& value) {
    if (index >= size_) {
        throw std::out_of_range("ArrayList::set: 下标越界");
    }
    data_[index] = value;
}`, 0.5, 1.5, 5.7, 2.2, { fontSize: 9.5 });
  callout(s, "两种「出错」的口径", [
    "**下标越界**是调用方的错误 → 抛 `std::out_of_range`。",
    "**「没找到」**是可预期的结果 → 返回空 `optional`（下一页）。",
    "同一个类里两种口径并存，判断依据是「这算不算错」。",
  ], 6.4, 1.5, 3.1, 2.2, { fontSize: 10.5 });
  // 随机访问示意
  text(s, "随机存取：跳着读，代价一样", 0.5, 3.9, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  cells(s, 0.5, 4.35, [10, 20, 30, 40, 50, 60], { cw: 0.6, ch: 0.42, fs: 11, idx: true });
  arrowLabel(s, "at(4)", 0.5 + 4.5 * 0.6, 4.35, C.ok);
  text(s, "`at(0)` 与 `at(1000)` 一样快——地址是算出来的，不是走出来的。", 4.6, 4.35, 4.9, 0.42, { fontSize: 11, valign: "middle" });
}

// 2.4 检索：按内容
{
  const s = content("2.2.2", "2 顺序表 · 运算实现", "检索之二：按内容的检索 O(n)，并说清「没找到」");
  codeBlock(s, `std::optional<size_type> find(const T& value) const {
    for (size_type i = 0; i < size_; ++i) {
        if (data_[i] == value) {
            return i;
        }
    }
    return std::nullopt;          // 没找到：空盒子
}`, 0.5, 1.05, 5.7, 1.45, { fontSize: 9.5 });
  codeBlock(s, `// 调用方：取值必须先开盒
if (auto pos = values.find(20)) {   // 先问盒子空不空
    std::cout << *pos << '\\n';       // 确认非空后才取值
}`, 0.5, 2.6, 5.7, 0.85, { fontSize: 9.5 });
  text(s, "检索的时间代价体现在**比较次数**上", 0.5, 3.6, 5.7, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  const cases = [["最好", "第 1 个元素即为所求", "1 次", C.ok], ["最差", "表中没有该元素", "n 次", C.bad], ["平均", "等概率假设", "(n+1)/2", C.goldText]];
  cases.forEach((c, i) => {
    const y = 3.95 + i * 0.4;
    pill(s, c[0], 0.5, y, 0.7, 0.34, c[3], C.white, 10);
    text(s, c[1], 1.35, y, 2.7, 0.34, { fontSize: 11, valign: "middle", margin: 0 });
    text(s, c[2], 4.1, y, 1.6, 0.34, { fontSize: 11, bold: true, fontFace: MONO, color: c[3], valign: "middle", margin: 0 });
  });
  card(s, 6.4, 1.05, 3.1, 1.5, C.code);
  text(s, "平均比较次数", 6.55, 1.12, 2.8, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  text(s, "∑ p × i = (1 + 2 + ⋯ + n) / n\n         = (n + 1) / 2", 6.55, 1.45, 2.8, 0.7, { fontSize: 11, fontFace: MONO, color: C.text, margin: 0 });
  text(s, "即平均要检查表中**一半**的元素", 6.55, 2.15, 2.8, 0.35, { fontSize: 10.5, margin: 0 });
  callout(s, "一次调用要带回两件事", "**找没找到**，和**在第几个位置**。`std::optional<size_type>` 把这两件事装进一个返回值，而且**取值前必须判断**。", 6.4, 2.65, 3.1, 1.4, { fontSize: 10.5 });
  callout(s, "⚠ 反复出现的问题", "「没找到怎么告诉调用方」在后面各章还会遇到；第一次遇到值得说透。", 6.4, 4.15, 3.1, 0.95, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 2.5 插入
{
  const s = content("2.2.2", "2 顺序表 · 运算实现", "插入：搬 O(n) 个元素，而且必须从后往前搬");
  codeBlock(s, `void insert(size_type pos, const T& value) {
    if (pos > size_) {                       // pos == size() 就是追加到表尾
        throw std::out_of_range("ArrayList::insert: 插入位置非法");
    }
    if (size_ == capacity_) {
        grow();
    }
    for (size_type i = size_; i > pos; --i) {
        data_[i] = data_[i - 1];             // 从后往前搬，否则会自己覆盖自己
    }
    data_[pos] = value;
    ++size_;
}

void append(const T& value) { insert(size_, value); }`, 0.5, 1.05, 6.2, 2.5, { fontSize: 9 });
  callout(s, "⚠ 「从后往前搬」不是风格问题", "反过来写（从 `pos` 开始往后覆盖），**第一步就把后面的数据抹掉了**，整段变成 `pos` 处那一个值的复制。", 6.9, 1.05, 2.6, 2.05, { fontSize: 10, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "pos == size()", "合法，就是**追加到表尾**——所以 `append` 只是 `insert(size_, x)`。", 6.9, 3.25, 2.6, 1.15, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  // 插入示意
  text(s, "insert(1, 20)：先腾位置，再写入", 0.5, 3.7, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  cells(s, 0.5, 4.15, [10, 30, 40, "", ""], { cw: 0.55, ch: 0.4, fs: 10.5 });
  text(s, "→", 3.4, 4.15, 0.35, 0.4, { fontSize: 14, color: C.muted, align: "center", valign: "middle", margin: 0 });
  cells(s, 3.85, 4.15, [10, "", 30, 40, ""], { cw: 0.55, ch: 0.4, fs: 10.5, fills: [C.mint, "F9D5D0", C.mint, C.mint, C.white] });
  text(s, "→", 6.75, 4.15, 0.35, 0.4, { fontSize: 14, color: C.muted, align: "center", valign: "middle", margin: 0 });
  cells(s, 7.2, 4.15, [10, 20, 30, 40], { cw: 0.55, ch: 0.4, fs: 10.5, fills: [C.mint, "CDEBD9", C.mint, C.mint] });
  text(s, "从后往前逐个右移", 3.85, 4.6, 2.6, 0.3, { fontSize: 9.5, color: C.bad, margin: 0 });
  text(s, "写入新元素，size_ + 1", 7.2, 4.6, 2.3, 0.3, { fontSize: 9.5, color: C.ok, margin: 0 });
}

// 2.6 删除与扩容
{
  const s = content("2.2.2", "2 顺序表 · 运算实现", "删除与扩容：左移一位；容量翻倍而不是加一");
  codeBlock(s, `T remove(size_type pos) {
    if (pos >= size_) { throw std::out_of_range("ArrayList::remove: 下标越界"); }
    T removed = data_[pos];
    for (size_type i = pos; i + 1 < size_; ++i) {
        data_[i] = data_[i + 1];             // 后面的元素左移一位
    }
    --size_;
    return removed;                          // 把删掉的元素带回来
}

void grow() {                                // 私有
    size_type next = (capacity_ == 0) ? 1 : capacity_ * 2;
    T* fresh = new T[next];
    for (size_type i = 0; i < size_; ++i) { fresh[i] = data_[i]; }
    delete[] data_;      // 先搬完再释放旧的，顺序反了就会读到已释放的内存
    data_ = fresh;
    capacity_ = next;
}`, 0.5, 1.05, 6.2, 2.85, { fontSize: 8.8 });
  callout(s, "翻倍而不是加一", "从 0 增长到 n 一共搬 **1 + 2 + 4 + ⋯ + n < 2n** 个元素，平摊到 n 次追加上是**常数**；若每次只加一，总搬运量是 **O(n²)**。", 6.9, 1.05, 2.6, 1.85, { fontSize: 10.5 });
  callout(s, "教学版的 clear()", "只有一行：`void clear() { size_ = 0; }`——已经申请的数组留着接着用。", 6.9, 3.05, 2.6, 1.3, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  // 两个数字
  card(s, 0.5, 4.05, 3.05, 1.05, "FDF0EE");
  text(s, "每次 +1：1 + 2 + ⋯ + n", 0.65, 4.1, 2.8, 0.28, { fontSize: 10, color: C.bad, bold: true, margin: 0 });
  text(s, "499,500", 0.65, 4.38, 2.8, 0.55, { fontSize: 26, bold: true, color: C.bad, margin: 0 });
  text(s, "append 1000 个元素的总搬运次数", 0.65, 4.88, 2.8, 0.22, { fontSize: 8.5, color: C.muted, margin: 0 });
  card(s, 3.65, 4.05, 3.05, 1.05, "EAF4EF");
  text(s, "每次 ×2：1 + 2 + 4 + ⋯", 3.8, 4.1, 2.8, 0.28, { fontSize: 10, color: C.ok, bold: true, margin: 0 });
  text(s, "1,023", 3.8, 4.38, 2.8, 0.55, { fontSize: 26, bold: true, color: C.ok, margin: 0 });
  text(s, "同样 1000 个元素（容量从 1 起翻倍）", 3.8, 4.88, 2.8, 0.22, { fontSize: 8.5, color: C.muted, margin: 0 });
}

// 2.7 三法则
{
  const s = content("2.3", "2 顺序表 · 三法则", "三法则：写了析构，就得写拷贝构造和拷贝赋值");
  codeBlock(s, `ArrayList(const ArrayList& other)
    : data_(new T[other.capacity_]), capacity_(other.capacity_), size_(other.size_) {
    for (size_type i = 0; i < size_; ++i) {
        data_[i] = other.data_[i];              // 深拷贝：各自一块内存
    }
}

ArrayList& operator=(const ArrayList& other) {
    if (this == &other) { return *this; }       // 自赋值：a = a
    T* fresh = new T[other.capacity_];          // 先申请新的
    for (size_type i = 0; i < other.size_; ++i) { fresh[i] = other.data_[i]; }
    delete[] data_;                             // 成功了再释放旧的
    data_ = fresh;
    capacity_ = other.capacity_;
    size_ = other.size_;
    return *this;
}`, 0.5, 1.05, 6.2, 2.6, { fontSize: 8.8 });
  callout(s, "⚠ 注意赋值的顺序", "**先申请、拷完、再释放旧的。** 倒过来写（先 `delete[]` 再 `new`），`new` 抛异常就把**原对象也毁掉了**。", 6.9, 1.05, 2.6, 1.65, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  // double free 图
  pill(s, "a.data_", 6.9, 3.0, 1.1, 0.34, C.green, C.white, 10);
  pill(s, "b.data_", 6.9, 3.85, 1.1, 0.34, C.green, C.white, 10);
  cells(s, 8.5, 3.28, [1, 2], { cw: 0.42, ch: 0.38, fs: 10 });
  s.addShape(pres.shapes.LINE, { x: 8.0, y: 3.17, w: 0.5, h: 0.3, line: { color: C.bad, width: 1.4, endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: 8.0, y: 4.02, w: 0.5, h: -0.3, line: { color: C.bad, width: 1.4, endArrowType: "triangle" } });
  text(s, "浅拷贝 → 析构两次 → **二次释放**", 6.9, 4.35, 2.6, 0.7, { fontSize: 10, color: C.bad, margin: 0 });
  bullets(s, [
    "你之所以要写**析构函数**，是因为你在**管资源**；",
    "既然在管资源，编译器那份「逐成员照抄」的拷贝就**一定是错的**；",
    "照抄一个指针成员 → **两个对象指向同一块内存** → 各释放一次 → 同一块内存被释放两次。",
  ], 0.5, 3.8, 6.2, 1.3, { fontSize: 11, gap: 5 });
}

// ============================ PART 3 ============================
sectionSlide("Part 3", "链表", "把逻辑相邻写进结点的链接域\n单链表：头结点 · 尾指针 · 循链定位 · 插入删除 · 析构\n双链表 · 循环链表");

// 3.0 链表的思想
{
  const s = content("3", "3 链表", "顺序表用物理相邻，链表用链接域");
  bullets(s, [
    "顺序表用**物理相邻**表示逻辑相邻：按下标读取 O(1)，但中间插入删除要**搬动后续元素**。",
    "链表把逻辑相邻写进结点的**链接域**：结点可以**散落在内存中**；**给定一个前驱结点后，插入或删除只改常数条指针**。",
    "代价必须如实保留：**要按位置找到那个前驱，仍须从表头循链** —— 所以按位置访问、查找、插入和删除的**总时间仍是 O(n)**。",
  ], 0.5, 1.05, 9.0, 1.4, { fontSize: 12.5, gap: 8 });
  card(s, 0.5, 2.55, 9.0, 1.35, C.code);
  image(s, "fig-2-4", 0.7, 2.65, 8.6, 1.15);
  text(s, "单链表示例：`data` 域存真正的数据，`next` 域存后继结点的地址；终止结点的 `next` 是空指针（图里用「\\」表示）。", 0.5, 4.0, 9.0, 0.3, { fontSize: 10, color: C.muted });
  const facts = [
    ["访问只能从表头开始", "顺着 `next` 走：`head->next->data` 是 8，`head->next->next->data` 是 50"],
    ["结点不必两两相邻", "这正是链表能以常数条指针完成插入删除的原因"],
    ["表越长，这条链越长", "循链的代价随长度线性增长"],
  ];
  facts.forEach((f, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.35, 2.85, 0.75, i === 1 ? C.cream : C.code);
    text(s, f[0], x + 0.12, 4.4, 2.6, 0.26, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
    text(s, f[1], x + 0.12, 4.66, 2.65, 0.42, { fontSize: 9, margin: 0 });
  });
}

// 3.1 尾指针
{
  const s = content("3", "3 链表", "尾指针 tail：让「在表尾追加」不必每次走到底");
  text(s, "为了让「在表尾追加」不必每次走到底，另设一个指向尾结点的变量 `tail`，`append()` 因此是 **O(1)**。", 0.5, 1.02, 9, 0.4, { fontSize: 12.5 });
  // 自己画「具有头、尾两指针的单链表」（讲义里的 fig-2-5 只有本机路径）
  card(s, 0.5, 1.6, 9.0, 1.9, C.code);
  const ch = chain(s, 1.6, 2.35, [10, 20, 30, 40], { dw: 0.6, nw: 0.28, gap: 0.5 });
  ptr(s, "head", 1.9, 2.35, C.goldText);
  ptr(s, "tail", 1.6 + 3 * ch.step + 0.3, 2.35, C.green);
  text(s, "具有头、尾两指针的单链表", 0.5, 3.15, 9.0, 0.3, { fontSize: 10, color: C.muted, align: "center" });
  const ops = [
    ["有 tail", "`append(x)` = 新结点接到 `tail` 后面，再让 `tail` 指向它 —— **O(1)**", C.ok],
    ["没有 tail", "每次 `append` 都要从表头走到最后一个结点 —— **O(n)**", C.bad],
  ];
  ops.forEach((o, i) => {
    const y = 3.6 + i * 0.72;
    card(s, 0.5, y, 9.0, 0.62, i === 0 ? "EAF4EF" : "FDF0EE");
    pill(s, o[0], 0.65, y + 0.14, 1.1, 0.34, o[2], C.white, 10.5);
    text(s, o[1], 1.9, y, 7.4, 0.62, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  text(s, "插在表尾、删掉最后一个结点时，`tail` 都要跟着改——这就是后面 `insert` / `remove` 里那两行 `if` 的来源。", 0.5, 5.1, 9.0, 0.3, { fontSize: 10.5, color: C.goldText });
}

// 3.2 结点与头结点
{
  const s = content("2.3.1", "3 链表 · 单链表", "结点与头结点：消特例的哨兵");
  codeBlock(s, `template <typename T>
class LinkedList {
private:
    struct Node {          // 原书【代码2.6】：一个数据域 + 一根指向后继的链接
        T value;
        Node* next;
    };                     // 放在 private：调用方拿不到指针，就改不坏链

public:
    LinkedList() : head_(new Node), tail_(head_), size_(0) {
        head_->next = nullptr;
    }
    // ...
private:
    Node* head_;           // 头结点：不存放数据的哨兵，等价于原书「第 -1 个结点」
    Node* tail_;           // 尾指针：空表时回指头结点
    size_type size_;
};`, 0.5, 1.05, 6.0, 2.55, { fontSize: 8.8 });
  callout(s, "头结点（head node）", "一个**不存放数据的哨兵**，永远排在第一个真元素前面。有了它，表头插入和删除都变成「修改某个前驱的 `next`」，**空表也不必另写一套分支**。", 6.7, 1.05, 2.8, 2.0, { fontSize: 10.5 });
  callout(s, "结点定义放 private", "调用方拿不到 `Node*`，就**改不坏链**。", 6.7, 3.2, 2.8, 0.9, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  card(s, 0.5, 3.75, 6.0, 1.35, C.code);
  image(s, "fig-2-6", 0.6, 3.85, 5.8, 1.15);
  text(s, "(a) 带头结点的空表；(b) 一个典型的带头结点的单链表。带阴影的那个结点就是头结点，**它的数据域不算表中元素**。", 6.7, 4.2, 2.8, 0.9, { fontSize: 9.5, color: C.muted });
}

// 3.3 循链定位
{
  const s = content("2.3.1", "3 链表 · 单链表", "循链定位：头结点的意义就在那一行");
  codeBlock(s, `Node* predecessor_at(size_type pos) const {
    if (pos > size_) {
        throw std::out_of_range("LinkedList: 下标越界");
    }
    Node* predecessor = head_;          // pos == 0 时前驱就是头结点
    for (size_type i = 0; i < pos; ++i) {
        predecessor = predecessor->next;
    }
    return predecessor;
}`, 0.5, 1.05, 5.9, 1.85, { fontSize: 9.5, hl: [5] });
  callout(s, "没有头结点会怎样", "就要为 `pos == 0` **单写一套分支**，插入、删除各写一次。头结点把「表头」和「中间」统一成了同一件事。", 6.6, 1.05, 2.9, 1.85, { fontSize: 10.5 });
  text(s, "predecessor_at(2)：从头结点起走 2 步", 0.5, 3.05, 5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const ch = chain(s, 1.0, 4.25, ["head", 10, 20, 30], { dw: 0.72, nw: 0.28, gap: 0.45, fills: ["E8ECEA", C.mint, C.mint, C.mint], colors: [C.muted, C.dark, C.dark, C.dark], fs: 10 });
  ptr(s, "i = 0", 1.36, 4.25, C.muted);
  ptr(s, "i = 1", 1.0 + ch.step + 0.36, 4.25, C.goldText);
  ptr(s, "i = 2", 1.0 + 2 * ch.step + 0.36, 4.25, C.bad);
  text(s, "返回它：位置 2 的前驱", 1.0 + 2 * ch.step - 0.35, 4.8, 2.5, 0.3, { fontSize: 9.5, color: C.bad, bold: true, margin: 0 });
  callout(s, "代价", "循链定位是 **O(n)** —— 这是链表所有「按位置」操作的瓶颈。", 6.6, 3.25, 2.9, 1.05, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 3.4 插入与删除
{
  const s = content("2.3.1", "3 链表 · 单链表", "插入与删除：不搬元素，但定位要走");
  codeBlock(s, `void insert(size_type pos, const T& value) {
    Node* predecessor = predecessor_at(pos);      // ① 循链找前驱，O(n)
    Node* fresh = new Node;
    fresh->value = value;
    fresh->next = predecessor->next;              // ② 改两条链接，O(1)
    predecessor->next = fresh;
    if (predecessor == tail_) { tail_ = fresh; }  // 插在表尾，尾指针要跟上
    ++size_;
}

T remove(size_type pos) {
    if (pos >= size_) { throw std::out_of_range("LinkedList::remove: 下标越界"); }
    Node* predecessor = predecessor_at(pos);
    Node* dying = predecessor->next;
    T value = dying->value;
    predecessor->next = dying->next;              // 只改一条链接
    if (dying == tail_) { tail_ = predecessor; }  // 删的是最后一个
    delete dying;
    --size_;
    return value;
}`, 0.5, 1.02, 6.2, 3.05, { fontSize: 8.6 });
  callout(s, "两步的代价不一样", [
    "① **循链找前驱**：O(n)，走出来的；",
    "② **改两条链接**：O(1)，不搬任何元素。",
    "链表的插入不搬元素，**但定位要走**——这就是链表与顺序表的全部分工。",
  ], 6.9, 1.02, 2.6, 2.3, { fontSize: 10 });
  callout(s, "别忘了 tail_", "插在表尾 / 删掉最后一个结点时，尾指针必须跟着改。", 6.9, 3.45, 2.6, 1.05, { fontSize: 10, fill: "FDF0EE", tcolor: C.bad });
  text(s, "insert：② fresh->next = p->next  →  ③ p->next = fresh（顺序不能反）", 0.5, 4.2, 6.2, 0.3, { fontSize: 10.5, bold: true, color: C.green, margin: 0 });
  chain(s, 0.8, 4.6, ["p", 20, 30], { dw: 0.5, nw: 0.24, h: 0.36, gap: 0.3, fs: 10, fills: [C.mint, "CDEBD9", C.mint] });
  text(s, "新结点（绿）插在 p 与 30 之间：只改两条链接，不搬元素", 3.9, 4.6, 2.8, 0.36, { fontSize: 9, color: C.muted, valign: "middle", margin: 0 });
}

// 3.5 析构必须循环
{
  const s = content("2.3.1", "3 链表 · 单链表", "析构必须循环，不能递归");
  codeBlock(s, `void clear() {
    Node* current = head_->next;
    while (current != nullptr) {        // 沿 next 逐个释放
        Node* dying = current;
        current = current->next;        // 先记下后继，再 delete
        delete dying;
    }
    head_->next = nullptr;
    tail_ = head_;                      // 表空了，尾指针退回头结点
    size_ = 0;
}

~LinkedList() { clear(); delete head_; }`, 0.5, 1.05, 5.9, 2.35, { fontSize: 9.5, hl: [5] });
  callout(s, "⚠ 两条必须记住", [
    "链长**十万级**时，递归释放会**耗尽运行栈**。",
    "`current = current->next;` 必须写在 `delete dying;` **之前**，否则就是从**已释放的内存**里读指针。",
  ], 6.5, 1.05, 3.0, 2.35, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  text(s, "顺序：先记后继，再释放", 0.5, 3.6, 5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const steps = [["记下后继", "current = current->next", C.ok], ["释放当前", "delete dying", C.bad], ["重复到 nullptr", "while (current != nullptr)", C.dark]];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.05, 2.85, 1.0, C.code);
    numCircle(s, i + 1, x + 0.15, 4.2, 0.38, st[2]);
    text(s, st[0], x + 0.6, 4.22, 2.15, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, st[1], x + 0.15, 4.62, 2.6, 0.35, { fontSize: 8.5, fontFace: MONO, color: C.text, margin: 0 });
  });
  text(s, "`~LinkedList()` 先 `clear()` 清掉所有真结点，再 `delete head_` 释放头结点本身——头结点是构造函数里 `new` 出来的。", 6.5, 3.6, 3.0, 0.95, { fontSize: 9.5, color: C.muted });
}

// 3.6 双链表
{
  const s = content("2.3.2", "3 链表 · 双链表", "多一根 prev，只买到一件事，但这件事很值");
  card(s, 0.5, 1.05, 4.6, 1.7, C.code);
  image(s, "fig-2-10", 0.6, 1.15, 4.4, 1.5);
  text(s, "双链表的结点：一个数据域，两根指针 —— `prev` 指前驱，`next` 指后继", 0.5, 2.8, 4.6, 0.5, { fontSize: 10, color: C.muted });
  bullets(s, [
    "双链结点比单链结点多一根 `prev`（64 位机上 **8 字节**）。",
    "它只买到一件事：**已知一个结点时，删除它是 O(1)**。",
    "单链表要做同一件事，得先从头走到它的前驱 —— **O(n)**，因为**单链表从一个结点走不回前一个**。",
  ], 5.3, 1.05, 4.2, 2.2, { fontSize: 12, gap: 8 });
  text(s, "已知结点 x，删除它", 0.5, 3.4, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  card(s, 0.5, 3.78, 4.35, 1.32, "FDF0EE");
  text(s, "单链表：O(n)", 0.65, 3.83, 3, 0.28, { fontSize: 11, bold: true, color: C.bad, margin: 0 });
  chain(s, 0.7, 4.22, [10, 20, "x"], { dw: 0.48, nw: 0.22, h: 0.36, gap: 0.3, fs: 9.5, fills: [C.mint, C.mint, "F9D5D0"] });
  text(s, "要从表头重新走到 x 的前驱", 0.7, 4.66, 3.9, 0.35, { fontSize: 9.5, color: C.bad, margin: 0 });
  card(s, 5.15, 3.78, 4.35, 1.32, "EAF4EF");
  text(s, "双链表：O(1)", 5.3, 3.83, 3, 0.28, { fontSize: 11, bold: true, color: C.ok, margin: 0 });
  dchain(s, 5.35, 4.22, [10, 20, "x"], { bw: 0.6, h: 0.36, gap: 0.3, fs: 9.5, fills: [C.mint, C.mint, "CDEBD9"] });
  text(s, "`x->prev->next = x->next` 等两句即可", 5.35, 4.66, 4.0, 0.35, { fontSize: 9.5, color: C.ok, margin: 0 });
}

// 3.7 循环链表
{
  const s = content("2.3.3", "3 链表 · 循环链表", "尾结点的 next 接回首结点：没有 nullptr 作为终点");
  bullets(s, [
    "循环链表把尾结点的 `next` **接回首结点**，因而**没有 **`nullptr`** 作为终点**。",
    "适合**轮转调度**、**循环缓冲区**等「处理完最后一个又回到第一个」的场景。",
    "例子是**进程轮转**：多个进程串成一个环，用一个 `current` 指针指向下一个要激活的进程，指针往前走一步就轮到下一个。",
    "只要把单链表最后一个结点的 `next` 指回表首就得到循环链表：**不多花任何存储**，却让「从任一结点都能访问到其余全部结点」成为可能。",
    "**只保存 **`tail`** 就够了**：取首结点是 `tail->next`，尾插只需改两根链接，均为 O(1)。",
  ], 0.5, 1.05, 5.9, 2.6, { fontSize: 11.5, gap: 6 });
  card(s, 6.5, 1.05, 3.0, 2.6, C.code);
  const cx = 8.0, cy = 2.4, r = 0.78;
  ["P₁", "P₂", "P₃", "P₄"].forEach((v, i) => {
    const ang = (-90 + i * 90) * Math.PI / 180;
    const bx = cx + r * Math.cos(ang) - 0.28, by = cy + r * Math.sin(ang) - 0.19;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: by, w: 0.56, h: 0.38, rectRadius: 0.06, fill: { color: i === 0 ? "CDEBD9" : C.mint }, line: { color: C.green, width: 1 } });
    text(s, v, bx, by, 0.56, 0.38, { fontSize: 10, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  });
  s.addShape(pres.shapes.DONUT, { x: cx - 0.34, y: cy - 0.34, w: 0.68, h: 0.68, fill: { color: "E8ECEA" }, line: { type: "none" } });
  pill(s, "current", cx - 0.5, cy - 0.16, 1.0, 0.3, C.goldText, C.white, 9);
  text(s, "进程轮转：串成一个环", 6.5, 3.3, 3.0, 0.3, { fontSize: 10, color: C.muted, align: "center" });
  callout(s, "⚠ 代价是边界更容易写错", [
    "遍历时必须**保存起点**，并在**再次遇到起点**时停止——不能写成「走到 `nullptr` 为止」；",
    "删除最后一个结点后要把 `tail` 清空；删除首结点则把 `tail->next` 跳过被删结点；",
    "**测试至少应覆盖三种长度**（空表、单结点、多结点），并验证从每个结点出发恰好走一整圈。",
  ], 0.5, 3.8, 6.9, 1.3, { fontSize: 9.5, gap: 3, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "循环双链表", "把双链表的首尾也接起来，**反向遍历同样闭合**。", 7.6, 3.8, 1.9, 1.3, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// ============================ PART 4 ============================
sectionSlide("Part 4", "线性表实现方法的比较", "六行对比表 · 取舍时的两个因素\n线性表在后面各章的位置");

// 4.1 对比表
{
  const s = content("4", "4 比较", "同一组运算，两种实现的代价");
  table(s, [
    ["运算", "顺序表", "链表"],
    [{ t: "按下标读写 at(i)", mono: true }, { t: "**O(1)** 随机访问", fill: "EAF4EF" }, "O(n) 只能循链数过去"],
    [{ t: "按内容查找 find(x)", mono: true }, "O(n)", "O(n)"],
    [{ t: "已知前驱后插入 / 删除", bold: true, fill: C.cream }, { t: "O(n) 要搬后续元素", fill: C.cream }, { t: "**O(1)** 只改常数条链接", fill: C.cream }],
    [{ t: "按位置插入 / 删除", bold: true, fill: C.cream }, { t: "O(n) 搬", fill: C.cream }, { t: "O(n) 定位是瓶颈", fill: C.cream }],
    [{ t: "表尾追加 append(x)", mono: true }, "摊还 O(1)", { t: "**O(1)** 靠尾指针", fill: "EAF4EF" }],
    ["额外空间", "几乎没有（紧凑存储）", "每个结点一根指针"],
  ], 0.5, 1.15, 9.0, [3.0, 3.0, 3.0], { fontSize: 11.5, rowH: 0.46 });
  callout(s, "注意第三、第四行的差别", "**链表的 O(1) 前提是已经拿到了前驱结点。** 只给位置 i 的话，两种结构都是 O(n)，只是瓶颈不同：**顺序表是搬，链表是走。**", 0.5, 4.25, 9.0, 0.85, { fontSize: 11.5, tsize: 11 });
}

// 4.2 取舍
{
  const s = content("4", "4 比较", "取舍时的两个因素");
  const factors = [
    ["不要使用顺序表的场合", ["经常插入 / 删除**内部**元素时不宜使用 —— 平均情况下需要**移动表中一半的元素**。", "**无法确定线性表长度的最大值**时也不宜采用。"], "FDF0EE", C.bad],
    ["不要使用链表的场合", ["经常**按位置访问**、而且按位读比插删频繁时不宜使用 —— **顺链扫描比按下标读元素费时**。", "**指针本身的存储开销**也要考虑：如果与结点内容所占空间相比，指针所占比例较大（**超过 1:1**），应该慎重选择。"], "EAF4EF", C.ok],
  ];
  factors.forEach((f, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.1, 4.35, 2.5, f[2]);
    numCircle(s, i + 1, x + 0.18, 1.25, 0.42, f[3]);
    text(s, f[0], x + 0.72, 1.28, 3.5, 0.32, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
    bullets(s, f[1], x + 0.18, 1.75, 4.0, 1.7, { fontSize: 11, gap: 8 });
  });
  card(s, 0.5, 3.8, 9.0, 1.3, C.dark);
  text(s, "一句话", 0.75, 3.9, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText(runs("选顺序表还是链表，不看「哪个更高级」，只看**你的高频操作到底是「按位置读」还是「已知结点改」**。", { color: C.white, boldColor: C.gold }), { x: 0.75, y: 4.25, w: 8.5, h: 0.75, fontFace: FONT, fontSize: 15, color: C.white, margin: 0, isTextBox: true });
}

// 4.3 线性表在后面各章的位置
{
  const s = content("4", "4 比较", "线性表在后面各章的位置");
  const items = [
    ["存储管理", "本质上就是利用线性表管理**可利用空间**", "第 12 章", C.green],
    ["散列方法", "把**顺序表和链表结合起来**的一种数据结构", "第 10 章", C.goldText],
    ["栈、队列、串", "都是**限制了存取点**的线性表", "第 3、4 章", C.dark],
    ["二分检索 / 快速排序", "顺序表提供**随机访问**，因此适合这两者", "第 10、8 章", C.ok],
  ];
  items.forEach((it, i) => {
    const y = 1.15 + i * 0.95;
    card(s, 0.5, y, 9.0, 0.82, i % 2 === 0 ? C.code : C.white);
    pill(s, it[2], 0.65, y + 0.22, 1.15, 0.38, it[3], C.white, 10);
    text(s, it[0], 2.0, y, 2.4, 0.82, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, it[1], 4.45, y, 4.9, 0.82, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  text(s, "本章的两种结构会在后面各章反复出现——先把「搬」与「走」的代价记牢。", 0.5, 5.0, 9.0, 0.3, { fontSize: 10.5, color: C.muted });
}

// 本章小结
summarySlide("本章小结", [
  ["最常用的结构", "**线性结构是最简单且最常用的一种数据结构**，元素之间满足线性关系。"],
  ["两种存储方式", "线性表通常有**顺序**和**链式**两种存储方式，各运算的实现效率各有千秋。"],
  ["顺序表 / 链表", "顺序表易用、空间开销小、支持随机访问，适合**静态数据**；链表适合**频繁增删**与**长度事先不定**。"],
  ["三法则", "写了析构函数，就得写拷贝构造和拷贝赋值 —— 否则是**二次释放**。"],
  ["头结点", "是**消特例**的工具：表头插删不再需要单写一套分支。"],
]);

// ============================ 附录A ============================
sectionSlide("附录 A", "编程练习", "6 道题：把「链表的 O(1) 前提是拿到前驱」拆成三层\nE160 · E206 · M1472 · M146 · E21 · E234");

// A.0 为什么是这 6 道题
{
  const s = content("A.0", "附录A 编程练习", "为什么是这 6 道题");
  callout(s, "先记住这句话", "**链表的 O(1) 前提是「已经拿到了前驱结点」。只给位置 i 的话两种结构都是 O(n)，只是瓶颈不同：顺序表是搬，链表是走。**", 0.5, 1.02, 9.0, 0.78, { fontSize: 11.5, tsize: 11 });
  table(s, [
    ["分组", "题号", "练什么", "对应章节"],
    ["单向链表", "E160 相交链表", "指针即身份；双指针把 O(n) 的定位做成 O(1) 空间", "2.3.1"],
    ["单向链表", "E206 反转链表", "改链接的最小动作：断链前先存后继", "2.3.1"],
    ["双向链表", "M1472 浏览器历史", "`prev` 指针买到了什么", "2.3.2"],
    [{ t: "双向链表", fill: C.cream }, { t: "M146 LRU 缓存", fill: C.cream }, { t: "用哈希表把「找前驱」的 O(n) 降到 O(1)，链表的 O(1) 才真正兑现", fill: C.cream }, { t: "2.3.2 + 第 10 章", fill: C.cream }],
    ["核心技巧", "E21 合并两个有序链表", "头结点（哨兵）为什么能省掉分支", "2.3.1"],
    ["核心技巧", "E234 回文链表", "快慢指针找中点 + 反转的综合", "2.3.1"],
  ], 0.5, 1.95, 9.0, [1.1, 1.9, 4.5, 1.5], { fontSize: 10.5, rowH: 0.42 });
  card(s, 0.5, 4.85, 9.0, 0.5, C.dark);
  text(s, "**M146 是这一组的收官题**：它是「散列方法是把顺序表和链表结合起来的一种数据结构」在工程里最常见的一次落地。", 0.7, 4.85, 8.6, 0.5, { fontSize: 11.5, color: C.white, boldColor: C.gold, valign: "middle", margin: 0 });
}

// A.1 结点定义
{
  const s = content("A.1", "附录A · 预备", "结点定义：与 2.3.1 的 struct Node 是同一个东西");
  codeBlock(s, `# Python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`, 0.5, 1.05, 5.9, 1.0, { fontSize: 9.5, lang: "py" });
  codeBlock(s, `// C++
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};`, 0.5, 2.2, 5.9, 1.5, { fontSize: 9.5 });
  callout(s, "⚠ LeetCode 与课件的一个差别", [
    "课件里的 `LinkedList` **带头结点**（哨兵永远排在第一个真元素前面），所以「表头插入」和「中间插入」共用一套代码；",
    "LeetCode 传给你的 `head` 就是**第一个真元素**，**没有哨兵**。",
    "这正是很多同学在 E21、E206 里写出一堆 `if head is None` 分支的原因。",
  ], 6.6, 1.05, 2.9, 2.65, { fontSize: 9.5, gap: 4, fill: "FDF0EE", tcolor: C.bad });
  // 对比图
  text(s, "课件：带头结点", 0.5, 3.85, 2.5, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  chain(s, 0.5, 4.2, ["head", 1, 2], { dw: 0.6, nw: 0.24, h: 0.36, gap: 0.3, fs: 9.5, fills: ["E8ECEA", C.mint, C.mint], colors: [C.muted, C.dark, C.dark] });
  text(s, "LeetCode：head 就是第一个真元素", 5.0, 3.85, 3.5, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  chain(s, 5.0, 4.2, [1, 2, 3], { dw: 0.6, nw: 0.24, h: 0.36, gap: 0.3, fs: 9.5 });
  text(s, "解决办法：自己临时造一个哨兵（下一页）", 5.0, 4.7, 4.5, 0.3, { fontSize: 10, color: C.goldText, bold: true, margin: 0 });
}

// A.2 三条铁律 + 哨兵
{
  const s = content("A.2", "附录A · 预备", "三条铁律与哨兵（dummy / 虚拟头结点）");
  const laws = [
    ["比较结点用「地址」不用「值」", "Python 用 `is`，C++ 直接比指针。**E160 全靠这一条。**", C.green],
    ["断链之前先把后继存下来", "算法题里是 `nxt = curr.next` 写在 `curr.next = prev` 之前，与课件析构函数里的顺序**道理完全一样**。", C.bad],
    ["先在纸上画 0 个、1 个、2 个结点的情形", "链表题的 bug **90% 出在这三种长度上**。", C.goldText],
  ];
  laws.forEach((l, i) => {
    const y = 1.05 + i * 0.86;
    card(s, 0.5, y, 5.9, 0.78, C.code);
    numCircle(s, i + 1, 0.65, y + 0.2, 0.38, l[2]);
    text(s, l[0], 1.15, y + 0.04, 5.1, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, l[1], 1.15, y + 0.34, 5.15, 0.42, { fontSize: 10, margin: 0 });
  });
  codeBlock(s, `current = current->next;   // 先记下后继
delete dying;              // 再释放，否则就是从已释放的内存里读指针`, 0.5, 3.7, 5.9, 0.6, { fontSize: 8.8 });
  callout(s, "哨兵：课件 2.3.1 的原话", "头结点是一个**不存放数据的哨兵**，永远排在第一个真元素前面。有了它，表头插入和删除都变成「修改某个前驱的 `next`」，**空表也不必另写一套分支**。", 6.6, 1.05, 2.9, 1.75, { fontSize: 9.5 });
  codeBlock(s, `dummy = ListNode(0, head)
# ... 在 dummy 之后操作 ...
return dummy.next     # 永远返回 dummy.next`, 6.6, 2.95, 2.9, 0.85, { fontSize: 8, lang: "py" });
  codeBlock(s, `ListNode dummy(0, head);  // 放栈上
return dummy.next;`, 6.6, 3.95, 2.9, 0.6, { fontSize: 8 });
  callout(s, "什么时候一定要用哨兵", "新表头**可能变化**（删除首元素、合并、插入排序），或者「**先建表再返回**」的场合（E21）。", 0.5, 4.45, 5.9, 0.65, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// ---------------- E160 ----------------
{
  const s = content("E160", "附录A · 单向链表", "E160 相交链表：先想清楚什么叫「相交」");
  text(s, "给你两个单链表的头节点 `headA` 和 `headB`，找出并返回两个单链表相交的**起始节点**；不存在则返回 `null`。数据保证**无环**，且函数返回后链表必须**保持原始结构**。**进阶**：时间 O(m+n)、空间 O(1)。", 0.5, 1.02, 9.0, 0.6, { fontSize: 11.5 });
  // 相交示意图
  card(s, 0.5, 1.7, 5.9, 1.85, C.code);
  chain(s, 0.78, 1.95, ["a1", "a2"], { dw: 0.4, nw: 0.18, h: 0.34, gap: 0.18, fs: 9, nil: false });
  chain(s, 0.78, 2.78, ["b1", "b2", "b3"], { dw: 0.4, nw: 0.18, h: 0.34, gap: 0.18, fs: 9, nil: false });
  chain(s, 3.3, 2.36, ["c1", "c2", "c3"], { dw: 0.4, nw: 0.18, h: 0.34, gap: 0.18, fs: 9, fills: ["CDEBD9", "CDEBD9", "CDEBD9"] });
  s.addShape(pres.shapes.LINE, { x: 2.12, y: 2.12, w: 1.18, h: 0.41, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: 2.88, y: 2.95, w: 0.42, h: -0.42, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
  text(s, "A", 0.56, 1.95, 0.2, 0.34, { fontSize: 10, bold: true, color: C.goldText, valign: "middle", margin: 0 });
  text(s, "B", 0.56, 2.78, 0.2, 0.34, { fontSize: 10, bold: true, color: C.goldText, valign: "middle", margin: 0 });
  text(s, "相交后是**同一串结点**，不是「值相同」", 3.3, 2.82, 3.0, 0.55, { fontSize: 9.5, color: C.ok, margin: 0 });
  bullets(s, [
    "两个链表相交之后，**后面的结点是同一批对象**（同一个地址），不可能再分开——因为每个结点只有一个 `next`。",
    "判断相交只能用 `pA is pB`（C++：`pA == pB`），**不能**用 `pA.val == pB.val`。",
    "一旦相交，**两条链的尾巴长度必然相同**。这是所有解法的出发点。",
  ], 6.6, 1.7, 2.9, 1.9, { fontSize: 9.5, gap: 5 });
  // 三种解法概览
  const sols = [["哈希表", "O(m+n) 时间 / O(m) 空间", "好写、好调试，当正确性对照组", C.green],
    ["对齐长度", "O(1) 空间", "长的先走 |m−n| 步，此后同步前进", C.goldText],
    ["双指针换道", "O(1) 空间", "**考试要写这个**：代码最短", C.bad]];
  sols.forEach((so, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 3.75, 2.85, 1.35, i === 2 ? C.cream : C.code);
    pill(s, so[0], x + 0.15, 3.88, 1.3, 0.34, so[3], C.white, 10.5);
    text(s, so[1], x + 0.15, 4.28, 2.6, 0.28, { fontSize: 9.5, bold: true, color: C.dark, margin: 0 });
    text(s, so[2], x + 0.15, 4.58, 2.6, 0.45, { fontSize: 9.5, margin: 0 });
  });
}

{
  const s = content("E160", "附录A · 单向链表", "解法一 哈希表 / 解法二 对齐长度");
  codeBlock(s, `class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        visited = set()
        p = headA
        while p:
            visited.add(p)          # 存的是结点对象，按 id 哈希
            p = p.next
        p = headB
        while p:
            if p in visited:
                return p
            p = p.next
        return None`, 0.5, 1.05, 6.2, 2.0, { fontSize: 9, lang: "py" });
  callout(s, "为什么 set 正好够用", "Python 的 `set` 对没有自定义 `__hash__` 的对象**默认按 **`id()`** 哈希**，正好是「按地址」，符合我们的需要。", 6.9, 1.05, 2.6, 2.0, { fontSize: 10 });
  text(s, "解法二：对齐长度（O(1) 空间，最容易证明）", 0.5, 3.25, 6.2, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "设 A 长 m、B 长 n。若相交，公共尾部长度相同，那么把**长的那条先走 |m−n| 步**，两个指针到表尾的距离就一样了；此后同步前进，**第一次相等处**即为交点。", 0.5, 3.6, 6.2, 0.75, { fontSize: 11.5 });
  // 对齐示意
  chain(s, 0.5, 4.5, ["a1", "a2", "c1", "c2"], { dw: 0.45, nw: 0.2, h: 0.34, gap: 0.16, fs: 9, fills: [C.mint, C.mint, "CDEBD9", "CDEBD9"] });
  chain(s, 3.9, 4.5, ["b1", "c1", "c2"], { dw: 0.45, nw: 0.2, h: 0.34, gap: 0.16, fs: 9, fills: [C.mint, "CDEBD9", "CDEBD9"] });
  text(s, "长的那条先走 1 步 → 到表尾的距离相同 → 此后同步前进", 0.5, 4.15, 6.2, 0.3, { fontSize: 9.5, color: C.goldText, bold: true, margin: 0 });
  callout(s, "代价", "要**遍历两遍**求长度；代码比换道法长。", 6.9, 3.25, 2.6, 1.85, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  text(s, "两种解法都是 O(m+n) 时间，区别只在空间与遍历遍数。", 0.5, 4.95, 6.2, 0.3, { fontSize: 9.5, color: C.muted });
}

{
  const s = content("E160", "附录A · 单向链表", "解法三 双指针「换道」：走完自己走对面");
  codeBlock(s, `class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        if not headA or not headB:
            return None
        pA, pB = headA, headB
        while pA is not pB:                  # 用 is，比地址
            pA = pA.next if pA else headB    # 走到尽头(None)后换到对面的头
            pB = pB.next if pB else headA
        return pA                            # 交点，或 None`, 0.5, 1.05, 6.2, 1.55, { fontSize: 9, lang: "py" });
  codeBlock(s, `class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (headA == nullptr || headB == nullptr) return nullptr;
        ListNode *pA = headA, *pB = headB;
        while (pA != pB) {
            pA = (pA == nullptr) ? headB : pA->next;
            pB = (pB == nullptr) ? headA : pB->next;
        }
        return pA;   // 相交则为交点，不相交则两者同时为 nullptr
    }
};`, 0.5, 2.75, 6.2, 1.9, { fontSize: 9 });
  callout(s, "三个要点", [
    "循环条件比的是**地址**（`is` / `==` 指针）；",
    "换道条件是「**指针本身为空**」，不是「它的 `next` 为空」；",
    "返回 `pA` 即可：相交时是交点，不相交时两者同时为空。",
  ], 6.9, 1.05, 2.6, 2.05, { fontSize: 10, gap: 4 });
  card(s, 6.9, 3.3, 2.6, 1.35, C.dark);
  text(s, "路程相等", 7.05, 3.38, 2.3, 0.28, { fontSize: 10.5, bold: true, color: C.gold, margin: 0 });
  text(s, "pA: a + c + b\npB: b + c + a", 7.05, 3.7, 2.3, 0.6, { fontSize: 13, fontFace: MONO, color: C.white, margin: 0 });
  text(s, "两式相等 → 必在同一步相遇", 7.05, 4.3, 2.3, 0.3, { fontSize: 9, color: C.mint, margin: 0 });
  text(s, "每个指针最多换道一次，走过的结点数不超过 (a+c)+(b+c)+1 → O(m+n)，只用两个指针变量 → 空间 O(1)。", 0.5, 4.75, 9.0, 0.35, { fontSize: 10, color: C.muted });
}

{
  const s = content("E160", "附录A · 单向链表", "双指针法的数学证明（本题重点）");
  card(s, 0.5, 1.02, 9.0, 0.6, C.code);
  text(s, "记 **a** = A 独有部分长度（图中 a = 2）， **b** = B 独有部分长度（b = 3）， **c** = 公共部分长度（c = 3）；于是 A 总长 a+c，B 总长 b+c。", 0.7, 1.02, 8.6, 0.6, { fontSize: 11.5, valign: "middle", margin: 0 });
  card(s, 0.5, 1.78, 4.35, 1.75, "EAF4EF");
  text(s, "情形一：相交（c > 0）", 0.68, 1.85, 4.0, 0.3, { fontSize: 12.5, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "`pA`：走完 A（a+c 步）→ 跳到 `headB` → 再走 b 步抵达 `c1`。**总步数 = a + c + b**",
    "`pB`：走完 B（b+c 步）→ 跳到 `headA` → 再走 a 步抵达 `c1`。**总步数 = b + c + a**",
  ], 0.68, 2.2, 4.0, 1.25, { fontSize: 10, gap: 5 });
  card(s, 5.15, 1.78, 4.35, 1.75, C.cream);
  text(s, "情形二：不相交（c = 0）", 5.33, 1.85, 4.0, 0.3, { fontSize: 12.5, bold: true, color: C.goldText, margin: 0 });
  bullets(s, [
    "`pA`：走完 A（a 步，此时为 `None`）→ 换到 `headB` → 走完 B（b 步）→ 变成 `None`。**第 a+b+1 步为 None**",
    "`pB`：同理，**第 b+a+1 步为 None**。两者**同时**变成 `None`，`None is None` 为真 → 返回 `None`。",
  ], 5.33, 2.2, 4.0, 1.25, { fontSize: 10, gap: 5 });
  text(s, "为什么「不会更早相遇」", 0.5, 3.65, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "抵达交点之前，`pA` 停在 A 的独有段或 B 的前 b 个结点上，`pB` 停在 B 的独有段或 A 的前 a 个结点上；两条链在 `c1` 之前**没有公共结点**，且两指针此时位于**同一条链上的不同偏移**（偏移差恒为 a−b，只有走到公共段才归零），**不可能提前相等**。", 0.5, 4.0, 5.9, 1.1, { fontSize: 10.5, lsm: 1.15 });
  callout(s, "结论", "既然两个指针**每轮各走一步、步数又相同**，它们必然在第 **a+b+c** 步**同时**站在 `c1` 上，循环条件 `pA != pB` 首次失败，返回 `c1`。", 6.5, 3.65, 3.0, 1.45, { fontSize: 10.5 });
}

{
  const s = content("E160", "附录A · 单向链表", "本题最大的坑 + 复杂度与易错点");
  card(s, 0.5, 1.02, 9.0, 1.35, "FDF0EE");
  text(s, "⚠ 换道的判断必须写成「指针本身为空时换道」", 0.7, 1.08, 8.6, 0.32, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  codeBlock(s, `pA = pA.next if pA else headB        # ✓ 正确：None 也是一个必须被访问到的「站点」
if pA.next is None: pA = headB      # ✗ 错误：跳过了 None，不相交时两指针无限循环`, 0.7, 1.45, 8.6, 0.6, { fontSize: 8.5, lang: "py" });
  text(s, "换句话说：`None` 就是两条链共同的「**虚拟终点**」。", 0.7, 2.06, 8.6, 0.28, { fontSize: 10.5, color: C.bad, margin: 0 });
  table(s, [
    ["解法", "时间", "空间", "备注"],
    ["哈希表", "O(m+n)", "O(m)", "好写、好调试"],
    ["对齐长度", "O(m+n)", "O(1)", "要遍历两遍求长度"],
    [{ t: "双指针换道", fill: C.cream }, { t: "O(m+n)", fill: C.cream }, { t: "O(1)", fill: C.cream }, { t: "代码最短，但要能讲清为什么", fill: C.cream }],
  ], 0.5, 2.55, 5.9, [1.5, 1.2, 1.0, 2.2], { fontSize: 10.5, rowH: 0.4 });
  callout(s, "易错点", [
    "❌ 用 `pA.val == pB.val` 判断相交。",
    "❌ 换道条件写成 `pA.next is None`（不相交时死循环）。",
    "❌ 修改链表（本题要求保持原始结构）。",
    "✅ `headA` 或 `headB` 为空要提前返回。",
  ], 6.5, 2.55, 3.0, 2.0, { fontSize: 9.5, gap: 4 });
  text(s, "终止性：每个指针最多换道一次 → 一定停；正确性：路程相等 → 同步抵达交点。", 0.5, 4.7, 5.9, 0.35, { fontSize: 10, color: C.muted });
}

// ---------------- E206 ----------------
{
  const s = content("E206", "附录A · 单向链表", "E206 反转链表：迭代（三指针）");
  text(s, "反转的本质是：**把每个结点的 **`next`** 从「指向后继」改成「指向前驱」**。单链表从一个结点走不回前一个，所以必须自己拿一个 `prev` 变量**把前驱背在身上**。", 0.5, 1.02, 9.0, 0.5, { fontSize: 11.5 });
  // 三阶段示意
  const stages = [
    ["初始", ["None", 1, 2, 3], ["prev", "curr"]],
    ["一步", ["None ← 1", 2, 3, ""], ["", ""]],
  ];
  card(s, 0.5, 1.6, 9.0, 1.65, C.code);
  text(s, "初始:", 0.7, 1.72, 0.6, 0.3, { fontSize: 10, bold: true, color: C.dark, margin: 0 });
  chain(s, 1.35, 1.7, ["∅", 1, 2, 3, 4, 5], { dw: 0.42, nw: 0.2, h: 0.32, gap: 0.2, fs: 9, fills: ["E8ECEA", C.mint, C.mint, C.mint, C.mint, C.mint] });
  text(s, "prev", 1.35, 2.04, 0.62, 0.22, { fontSize: 8.5, bold: true, color: C.goldText, align: "center", margin: 0 });
  text(s, "curr", 2.17, 2.04, 0.62, 0.22, { fontSize: 8.5, bold: true, color: C.bad, align: "center", margin: 0 });
  text(s, "一步:", 0.7, 2.42, 0.6, 0.3, { fontSize: 10, bold: true, color: C.dark, margin: 0 });
  chain(s, 1.35, 2.4, ["∅ ← 1", 2, 3, 4, 5], { dw: 0.6, nw: 0.2, h: 0.32, gap: 0.2, fs: 8.5, fills: ["CDEBD9", C.mint, C.mint, C.mint, C.mint] });
  text(s, "prev", 1.45, 2.74, 0.62, 0.22, { fontSize: 8.5, bold: true, color: C.goldText, align: "center", margin: 0 });
  text(s, "curr", 2.35, 2.74, 0.62, 0.22, { fontSize: 8.5, bold: true, color: C.bad, align: "center", margin: 0 });
  text(s, "结束:  ∅ ← 1 ← 2 ← 3 ← 4 ← 5      curr = None，返回 prev（新表头）", 0.7, 3.0, 8.6, 0.25, { fontSize: 10, bold: true, color: C.green, margin: 0 });
  codeBlock(s, `class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        prev, curr = None, head
        while curr:
            nxt = curr.next     # ① 断链前先存后继（铁律 2）
            curr.next = prev    # ② 掉头
            prev = curr         # ③ prev 前进
            curr = nxt          # ④ curr 前进
        return prev             # curr 为 None 时，prev 是新表头`, 0.5, 3.4, 6.2, 1.7, { fontSize: 9, lang: "py" });
  callout(s, "四个动作，顺序不能乱", [
    "**时间 O(n)，空间 O(1)。**",
    "空表时 `curr` 一开始就是 `None`，直接返回 `prev = None`，**无需特判**。",
    "**为什么 ① 不能省**：一旦执行 `curr.next = prev`，原来的后继地址就**永远找不回来**了。",
  ], 6.9, 3.4, 2.6, 1.7, { fontSize: 9, gap: 4 });
}

{
  const s = content("E206", "附录A · 单向链表", "递归版：假设后面那一段已经反转好了");
  card(s, 0.5, 1.02, 5.9, 1.4, C.code);
  text(s, `head → [ 2 → 3 → 4 → 5 ]        调用 reverseList(head.next)
head →  2 ← 3 ← 4 ← 5           返回 newHead = 5
         ↑ head.next 现在是反转后那段的【尾结点】

head.next.next = head           即 2.next = 1，把自己接到尾巴后面
head.next = None                切断原来的正向链接，否则 1 ⇄ 2 成环`, 0.65, 1.08, 5.6, 1.3, { fontSize: 8.5, color: C.text, margin: 0 });
  codeBlock(s, `class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        if head is None or head.next is None:
            return head                  # 递归基：空表或只剩一个结点
        new_head = self.reverseList(head.next)
        head.next.next = head            # 后继的 next 指回自己
        head.next = None                 # 必须切断，否则成环
        return new_head                  # 新表头一路原样向上传`, 0.5, 2.55, 5.9, 1.5, { fontSize: 9, lang: "py" });
  codeBlock(s, `if (head == nullptr || head->next == nullptr) return head;
ListNode* newHead = reverseList(head->next);
head->next->next = head;   // 后继的 next 指回自己
head->next = nullptr;      // 必须切断，否则成环
return newHead;`, 0.5, 4.15, 5.9, 0.7, { fontSize: 8 });
  callout(s, "⚠ 两个必须提醒的点", [
    "`head.next = None`** 不能漏**：漏掉它 `1.next = 2` 且 `2.next = 1`，链表**成环**，返回的表头一打印就死循环。",
    "**递归深度**：本题 n ≤ 5000，CPython 默认递归上限 1000，本地跑要 `sys.setrecursionlimit(10000)`（LeetCode 已代为放宽）。",
  ], 6.5, 1.02, 3.0, 2.35, { fontSize: 9.5, gap: 5, fill: "FDF0EE", tcolor: C.bad });
  card(s, 6.5, 3.5, 3.0, 0.75, C.dark);
  text(s, "时间 O(n)，空间 O(n)（递归栈）", 6.65, 3.5, 2.8, 0.75, { fontSize: 11.5, color: C.gold, bold: true, valign: "middle", margin: 0 });
  callout(s, "结论", "链表上的递归只适合「**教学 / 短链**」，**工程代码一律写迭代**（呼应课件 2.3.1：链长十万级时递归释放会耗尽运行栈）。", 6.5, 4.4, 3.0, 0.75, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "易错点：❌ 忘了存后继就改 `curr.next`　❌ 递归版忘记 `head.next = None`　❌ 返回 `prev` / `newHead`，不是 `curr` / `head`　✅ 用 n = 0, 1, 2 手推一遍", 0.5, 4.92, 5.9, 0.25, { fontSize: 8.5 });
}

// ---------------- 双向链表 ----------------
{
  const s = content("A.3", "附录A · 双向链表", "prev 买到了什么：两道题的两种场景");
  callout(s, "课件 2.3.2 的一句话", "双链结点比单链结点多一根 `prev`。多出来的那个指针（64 位机上 8 字节）只买到一件事，但这件事很值：**已知一个结点时，删除它是 O(1)**。单链表要做同一件事，得先从头走到它的前驱，O(n)。", 0.5, 1.02, 9.0, 0.95, { fontSize: 11 });
  const two = [
    ["M1472 浏览器历史", "已知当前结点，**向前 / 向后走**", "`back` / `forward` 沿 `prev` / `next` 走——单链表走不回去", C.goldText],
    ["M146 LRU 缓存", "已知一个结点，**把它摘下来重新挂到表头**", "`_remove` + `_add_front`，都是 O(1)", C.bad],
  ];
  two.forEach((t, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 2.15, 4.35, 1.45, C.code);
    pill(s, t[0], x + 0.18, 2.28, 2.2, 0.36, t[3], C.white, 10.5);
    text(s, t[1], x + 0.18, 2.72, 4.0, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, t[2], x + 0.18, 3.05, 4.0, 0.45, { fontSize: 10, margin: 0 });
  });
  codeBlock(s, `# 双链表结点（本节两题通用）
class DNode:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None`, 0.5, 3.75, 5.0, 1.35, { fontSize: 9.5, lang: "py" });
  card(s, 5.8, 3.75, 3.7, 1.35, C.code);
  dchain(s, 5.95, 4.15, ["k3", "k1", "k2"], { bw: 0.75, h: 0.4, gap: 0.35, fs: 10 });
  text(s, "已知任一结点，前后都能走", 5.95, 4.68, 3.4, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
  text(s, "两根指针的双向链", 5.95, 3.82, 3.4, 0.28, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
}

// ---------------- M1472 ----------------
{
  const s = content("M1472", "附录A · 双向链表", "M1472 设计浏览器历史记录：双链表的教科书例子");
  bullets(s, [
    "`BrowserHistory(homepage)`：用 `homepage` 初始化。",
    "`visit(url)`：从当前页跳转到 `url`。**此操作会把「前进」方向的记录全部删除。**",
    "`back(steps)` / `forward(steps)`：后退 / 前进**至多** `steps` 步，返回当前页 url。",
    "数据范围：url 长度 ≤ 20，`1 <= steps <= 100`，最多调用 **5000** 次。",
  ], 0.5, 1.02, 5.9, 1.5, { fontSize: 11, gap: 5 });
  card(s, 6.5, 1.02, 3.0, 1.5, C.code);
  text(s, "back ←            → forward", 6.6, 1.1, 2.8, 0.25, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
  dchain(s, 6.6, 1.45, ["lc", "goo", "fb", "yt"], { bw: 0.6, h: 0.36, gap: 0.12, fs: 9 });
  ptr(s, "current", 6.6 + 2 * 0.72 + 0.3, 1.45, C.goldText, true);
  text(s, "为什么这题是双链表的教科书例子", 0.5, 2.7, 6, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  const why = [
    ["back / forward", "= 沿 `prev` / `next` 走 → **必须双向**，单链表走不回去", C.goldText],
    ["visit", "= 在 `current` 后面接一个新结点，并**丢弃 **`current`** 之后的全部旧记录** → 已知结点的插入 / 删除，正是 **O(1)** 的那类操作", C.ok],
  ];
  why.forEach((w, i) => {
    const y = 3.1 + i * 0.95;
    card(s, 0.5, y, 9.0, 0.82, i === 0 ? C.code : C.cream);
    pill(s, w[0], 0.65, y + 0.22, 1.55, 0.38, w[2], C.white, 10);
    text(s, w[1], 2.35, y, 7.0, 0.82, { fontSize: 11, valign: "middle", margin: 0 });
  });
  text(s, "浏览器历史是一条**线性的页面序列**，加上一个「当前位置」指针。", 0.5, 5.0, 9.0, 0.3, { fontSize: 10.5, color: C.muted });
}

{
  const s = content("M1472", "附录A · 双向链表", "Python 实现：visit 的那一行就是「丢弃前进历史」");
  codeBlock(s, `class DNode:
    def __init__(self, url: str):
        self.url = url
        self.prev = None
        self.next = None


class BrowserHistory:
    def __init__(self, homepage: str):
        self.current = DNode(homepage)

    def visit(self, url: str) -> None:
        node = DNode(url)
        self.current.next = node    # 旧的前进历史在这一行被丢弃
        node.prev = self.current
        self.current = node

    def back(self, steps: int) -> str:
        while steps > 0 and self.current.prev is not None:
            self.current = self.current.prev
            steps -= 1
        return self.current.url

    def forward(self, steps: int) -> str:
        while steps > 0 and self.current.next is not None:
            self.current = self.current.next
            steps -= 1
        return self.current.url`, 0.5, 1.05, 6.2, 4.05, { fontSize: 8.5, lang: "py", hl: [14] });
  callout(s, "关键在 visit 的那一行", "原来挂在 `current` 后面的那一整串结点**从此没有任何变量引用它们**，Python 的**引用计数**会自动回收（旧链上的 `prev` 指针也一起没了，**不存在引用环**）。", 6.9, 1.05, 2.6, 2.1, { fontSize: 10 });
  callout(s, "走到头就停", "`back` / `forward` 的循环条件同时判断 `steps > 0` 和「**还有没有下一个**」——`steps` 超过可走步数时**走到头就停**，返回当前 url。", 6.9, 3.3, 2.6, 1.8, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

{
  const s = content("M1472", "附录A · 双向链表", "C++ 实现：没有 GC，丢弃的那一段必须自己 delete");
  codeBlock(s, `class BrowserHistory {
private:
    struct DNode {
        std::string url;
        DNode* prev = nullptr;
        DNode* next = nullptr;
        explicit DNode(std::string u) : url(std::move(u)) {}
    };
    DNode* current_;
    static void freeForward(DNode* node) {       // 释放 node 及其后的全部结点
        while (node != nullptr) {
            DNode* dying = node;
            node = node->next;                   // 先记下后继，再 delete
            delete dying;
        }
    }
public:
    explicit BrowserHistory(std::string homepage)
        : current_(new DNode(std::move(homepage))) {}
    ~BrowserHistory() {                          // 三法则：析构必须循环，不能递归
        while (current_->prev != nullptr) current_ = current_->prev;
        freeForward(current_);
    }
    // 持有裸指针 → 禁止拷贝（三法则的另一半：要么都写，要么都禁）
    BrowserHistory(const BrowserHistory&) = delete;
    BrowserHistory& operator=(const BrowserHistory&) = delete;

    void visit(std::string url) {
        freeForward(current_->next);             // 丢弃前进历史，否则内存泄漏
        DNode* node = new DNode(std::move(url));
        current_->next = node;
        node->prev = current_;
        current_ = node;
    }
    // back / forward 与 Python 版一字对应，略
};`, 0.5, 1.02, 6.4, 4.1, { fontSize: 7.8, hl: [12, 25] });
  callout(s, "三法则在这里的三条落地", [
    "自己 `new` 的结点，**自己 **`delete`；",
    "析构**循环**释放，不用递归；",
    "持有裸指针 → **禁用拷贝**（`= delete`）。",
  ], 6.9, 1.02, 2.6, 1.85, { fontSize: 9.5, gap: 4 });
  callout(s, "⚠ 顺序又一次出现", "`freeForward` 里 `node = node->next;` 必须写在 `delete dying;` **之前**——和课件 `clear()` 里那句注释一字不差：「否则就是从已释放的内存里读指针」。ASan 下立刻报 **heap-use-after-free**。", 6.9, 3.05, 2.6, 2.05, { fontSize: 9.5, fill: "FDF0EE", tcolor: C.bad });
}

{
  const s = content("M1472", "附录A · 双向链表", "对照组：顺序表实现（这题其实数组更优）");
  codeBlock(s, `class BrowserHistory:
    def __init__(self, homepage: str):
        self.history = [homepage]
        self.cur = 0          # 当前下标
        self.top = 0          # 有效历史的最后一个下标

    def visit(self, url: str) -> None:
        self.cur += 1
        if self.cur < len(self.history):
            self.history[self.cur] = url      # 覆盖，等价于「删除前进历史」
        else:
            self.history.append(url)
        self.top = self.cur                   # 前进历史作废

    def back(self, steps: int) -> str:
        self.cur = max(0, self.cur - steps)   # 一步到位，O(1)
        return self.history[self.cur]

    def forward(self, steps: int) -> str:
        self.cur = min(self.top, self.cur + steps)
        return self.history[self.cur]`, 0.5, 1.05, 5.5, 3.1, { fontSize: 8.5, lang: "py" });
  codeBlock(s, `class BrowserHistory {   // C++ 版：vector<string> + cur / top
    vector<string> history;
    int cur = 0, top = 0;
public:
    BrowserHistory(string homepage) { history.push_back(move(homepage)); }
    void visit(string url) {
        cur++;
        if (cur < (int)history.size()) history[cur] = move(url);  // 原地复用内存
        else history.push_back(move(url));
        top = cur;                       // 截断前进历史
    }
    string back(int steps)    { cur = max(0, cur - steps);   return history[cur]; }
    string forward(int steps) { cur = min(top, cur + steps); return history[cur]; }
};`, 6.1, 1.05, 3.4, 3.1, { fontSize: 6.6 });
  text(s, "用 `top` 维护有效历史的右边界：`visit` 时复用已有容量，避免频繁的 vector 缩容 / 重分配；`back` / `forward` 保持 **O(1)** 的直接计算。", 0.5, 4.3, 9.0, 0.7, { fontSize: 11 });
}

{
  const s = content("M1472", "附录A · 双向链表", "这是本题最值得讲的一页：两种实现对照");
  table(s, [
    ["运算", "双链表", "顺序表（动态数组）"],
    [{ t: "visit", mono: true }, "O(1) 改两根指针（C++ 还要 O(k) 释放旧段）", "摊还 O(1)，只改下标"],
    [{ t: "back(steps) / forward(steps)", mono: true, fill: C.cream }, { t: "O(steps) 一步一步走", fill: C.cream }, { t: "**O(1)** 下标直接加减并截断", fill: C.cream }],
    ["额外空间", "每结点两根指针", "几乎没有（紧凑存储）"],
    ["前进历史作废", "断一根 `next`（C++ 要遍历释放）", "移动一个 `top` 变量"],
  ], 0.5, 1.1, 9.0, [2.6, 3.6, 2.8], { fontSize: 10, rowH: 0.42 });
  callout(s, "结论", "`back(steps)` 是「**按位置跳转**」，顺序表的随机访问在这里**完胜**。真实浏览器用双链表，是因为每条历史记录还要挂标题、截图、表单数据等一大坨东西，且需要在中间删除单条记录；但就这道题而言，**数组版又短又快**。", 0.5, 3.45, 5.9, 1.15, { fontSize: 10 });
  callout(s, "取舍原则", "「**经常按位置访问、而且按位读比插删频繁时不宜使用链表**」。做题时把双链表版写出来是为了练手，**工程选型要看真实负载**。", 6.5, 3.45, 3.0, 1.15, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "易错点：❌ `visit` 之后没切断前进历史（`forward` 会走到早已作废的页面）　❌ `back` / `forward` 不判断边界（越界崩溃）　❌ C++ 版不 `delete` 被丢弃的分支（内存泄漏，ASan 会报）　✅ `steps` 超过可走步数时走到头就停", 0.5, 4.72, 9.0, 0.4, { fontSize: 9 });
}

// ---------------- M146 ----------------
{
  const s = content("M146", "附录A · 双向链表", "M146 LRU 缓存：为什么必须是「哈希表 + 双链表」");
  text(s, "`get` / `put` 都必须是**平均 O(1)**：`get(key)` 命中则返回并标记为「最近使用」，否则 −1；`put(key, value)` 存在则更新并刷新，不存在则插入，**超出容量则逐出最久未使用的关键字**。（`1 <= capacity <= 3000`，最多 2×10⁵ 次调用）", 0.5, 1.02, 9.0, 0.6, { fontSize: 11 });
  table(s, [
    ["需求", "只用哈希表", "只用双链表", "只用数组"],
    ["按 key 查 value", "✅ O(1)", "❌ O(n) 循链找", "❌ O(n)"],
    ["维护「使用时间」次序", "❌ 无序", "✅ 表头最新、表尾最旧", "✅ 但…"],
    ["把某个元素移到最前", "❌", "✅ O(1)（已知结点）", "❌ O(n) 搬元素"],
    ["删除最旧的元素", "❌", "✅ O(1)（表尾）", "✅ O(1)"],
  ], 0.5, 1.75, 6.2, [1.85, 1.35, 1.9, 1.1], { fontSize: 10, rowH: 0.42 });
  callout(s, "两张表各有一半能力", "**合起来正好补全**：哈希表用 key **直接拿到结点地址**，跳过「循链定位」这一步；双链表负责 O(1) 的摘链与插入。", 6.9, 1.75, 2.6, 2.1, { fontSize: 10 });
  card(s, 0.5, 3.95, 9.0, 1.15, C.code);
  text(s, "哈希表  key ──┐  直接拿到结点地址，跳过「循链定位」O(1)", 0.68, 4.02, 5.5, 0.28, { fontSize: 9.5, fontFace: MONO, color: C.text, margin: 0 });
  dchain(s, 0.95, 4.42, ["head", "k3", "k1", "k2", "tail"], { bw: 0.78, h: 0.4, gap: 0.3, fs: 10, sentinels: [0, 4] });
  text(s, "哨兵", 0.95, 4.86, 0.78, 0.22, { fontSize: 8, color: C.muted, align: "center", margin: 0 });
  text(s, "最新", 2.03, 4.86, 0.78, 0.22, { fontSize: 8, color: C.ok, align: "center", bold: true, margin: 0 });
  text(s, "最旧", 4.19, 4.86, 0.78, 0.22, { fontSize: 8, color: C.bad, align: "center", bold: true, margin: 0 });
  text(s, "哨兵", 5.27, 4.86, 0.78, 0.22, { fontSize: 8, color: C.muted, align: "center", margin: 0 });
  text(s, "**这就是课件那句「链表的 O(1) 前提是已经拿到了前驱结点」的最佳注脚**：链表本身给不出「拿到结点」这一步，哈希表补上了它。", 6.4, 4.15, 3.0, 0.9, { fontSize: 9.5, margin: 0 });
}

{
  const s = content("M146", "附录A · 双向链表", "为什么要用两个哨兵");
  bullets(s, [
    "用 `head` 和 `tail` 两个**不存数据的哨兵结点**（头结点思想的双向版），可以让：",
    { t: "「插到表头」= 插在 `head` 之后；", sub: true },
    { t: "「删除表尾」= 删除 `tail` 之前的那个；", sub: true },
    { t: "**空表、单结点表、多结点表用同一套代码，一个 **`if`** 都不用写。**", sub: true },
  ], 0.5, 1.05, 5.9, 1.5, { fontSize: 11.5, gap: 5 });
  codeBlock(s, `def _remove(self, node):        # 已知结点，摘链。双链表的看家本领
    node.prev.next = node.next
    node.next.prev = node.prev

def _add_front(self, node):     # 插到 head 哨兵之后
    node.next = self.head.next
    node.prev = self.head
    self.head.next.prev = node
    self.head.next = node

def _move_to_front(self, node):
    self._remove(node); self._add_front(node)`, 0.5, 2.6, 5.9, 2.0, { fontSize: 8.8, lang: "py" });
  card(s, 6.5, 1.05, 3.0, 3.55, C.code);
  image(s, "lru", 6.6, 1.15, 2.8, 3.35);
  text(s, "每个真结点前后**一定有结点**，所以 `_remove` / `_add_front` 里一个 `if` 都不用写。", 0.5, 4.75, 5.9, 0.35, { fontSize: 10.5, color: C.goldText, bold: true });
  text(s, "LRU：哈希表 + 双向链表", 6.5, 4.7, 3.0, 0.3, { fontSize: 9.5, color: C.muted, align: "center" });
}

{
  const s = content("M146", "附录A · 双向链表", "Python 实现（手写双链表）：结构与哨兵");
  codeBlock(s, `class DNode:
    __slots__ = ('key', 'value', 'prev', 'next')

    def __init__(self, key=0, value=0):
        self.key = key          # ★ 结点里必须存 key，逐出时要拿它去删哈希表
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.table = {}                  # key -> DNode
        self.head = DNode()              # 哨兵：head.next 是最近使用的
        self.tail = DNode()              # 哨兵：tail.prev 是最久未使用的
        self.head.next = self.tail
        self.tail.prev = self.head`, 0.5, 1.05, 6.2, 3.1, { fontSize: 9.5, lang: "py", hl: [5] });
  callout(s, "结点里为什么要存 key", "逐出时我们是从**链表尾部**拿到结点的，但要删的是**哈希表里的一项**，没有 `key` 就找不到该删谁。**本题最经典的一个坑。**", 6.9, 1.05, 2.6, 1.85, { fontSize: 9.5 });
  callout(s, "两个哨兵在这里接好", "`head.next = tail`、`tail.prev = head`；此后 `self.head` / `self.tail` **再也不出现在赋值号左边**。", 6.9, 3.05, 2.6, 1.55, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "三个私有辅助 `_remove` / `_add_front` / `_move_to_front` 见上一页。", 0.5, 4.3, 6.2, 0.35, { fontSize: 10, color: C.muted });
}

{
  const s = content("M146", "附录A · 双向链表", "Python 实现：对外接口 get / put");
  codeBlock(s, `    def get(self, key: int) -> int:
        node = self.table.get(key)
        if node is None:
            return -1
        self._move_to_front(node)        # 命中即刷新
        return node.value

    def put(self, key: int, value: int) -> None:
        node = self.table.get(key)
        if node is not None:             # 已存在：原地改值 + 刷新
            node.value = value
            self._move_to_front(node)
            return
        node = DNode(key, value)
        self.table[key] = node
        self._add_front(node)
        if len(self.table) > self.capacity:
            lru = self.tail.prev         # 表尾哨兵之前 = 最久未使用
            self._remove(lru)
            del self.table[lru.key]      # ★ 别忘了同步删哈希表`, 0.5, 1.05, 6.2, 3.5, { fontSize: 9.5, lang: "py", hl: [21] });
  callout(s, "三个细节", [
    "**结点里为什么要存 key**：逐出时我们是从**链表尾部**拿到结点的，但要删的是**哈希表里的一项**，没有 `key` 就找不到该删谁。**本题最经典的一个坑。**",
    "`dict` 的 `del d[k]` / `d.pop(k)` 平均 O(1)，符合题目对平均复杂度的要求。",
    "**漏删哈希表的后果**：`len(self.table)` 不再下降，此后每次 `put` 都会触发逐出；`get` 到已被逐出的 key 时，还会对一个早已摘下的结点调用 `_remove`，它残留的 `prev` / `next` 会**把链表改乱**。在 Python 里这是「结果错」，不是 C++ 意义上的内存泄漏。",
  ], 6.9, 1.05, 2.6, 4.05, { fontSize: 8.6, gap: 6 });
  text(s, "`get` 命中即刷新；`put` 已存在则原地改值并刷新，不存在才新建结点。", 0.5, 4.65, 6.2, 0.45, { fontSize: 10, color: C.muted });
}

{
  const s = content("M146", "附录A · 双向链表", "为什么整段代码里 self.tail 从来没被赋值？");
  text(s, "`self.head`、`self.tail` 在 `__init__` 之后再也没有出现在赋值号左边——于是会怀疑「表尾变了，`tail` 却没跟着改」。`self.tail`** 本来就不该变**：它是哨兵，永远是表尾那个不存数据的空结点。", 0.5, 1.02, 9.0, 0.6, { fontSize: 11.5 });
  text(s, "「最久未使用的是谁」记在 `self.tail.prev` 里，而 `tail.prev` 在两个辅助函数里被**间接**修改了：", 0.5, 1.68, 9.0, 0.3, { fontSize: 11.5 });
  table(s, [
    ["位置", "代码", "什么时候就是在改 tail.prev"],
    [{ t: "_add_front", mono: true }, { t: "self.head.next.prev = node", mono: true }, "表为空时 `head.next` 就是 `tail`，这句即 `tail.prev = node`"],
    [{ t: "_remove", mono: true }, { t: "node.next.prev = node.prev", mono: true }, "摘最后一个真结点时 `node.next` 就是 `tail`，这句即 `tail.prev = node.prev`"],
  ], 0.5, 2.05, 9.0, [1.5, 2.9, 4.6], { fontSize: 9.5, rowH: 0.4 });
  text(s, "逐步跟踪一遍（capacity = 2）", 0.5, 3.35, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["操作", "tail.prev", "正向（head→tail）", "反向（tail→head）", "改在哪"],
    [{ t: "init", mono: true }, { t: "head", mono: true }, { t: "[]", mono: true }, { t: "[]", mono: true }, ""],
    [{ t: "put(1,1)", mono: true }, { t: "k1", mono: true }, { t: "[k1]", mono: true }, { t: "[k1]", mono: true }, "_add_front 里改的"],
    [{ t: "put(2,2)", mono: true }, { t: "k1", mono: true }, { t: "[k2, k1]", mono: true }, { t: "[k1, k2]", mono: true }, ""],
    [{ t: "get(1)", mono: true }, { t: "k2", mono: true }, { t: "[k1, k2]", mono: true }, { t: "[k2, k1]", mono: true }, "_remove(k1) 里改的"],
    [{ t: "put(3,3)", mono: true }, { t: "k1", mono: true }, { t: "[k3, k1]", mono: true }, { t: "[k1, k3]", mono: true }, "逐出 k2 时 _remove 里改的"],
  ], 0.5, 3.72, 6.4, [1.1, 0.95, 1.5, 1.5, 1.35], { fontSize: 8, rowH: 0.23, tight: true });
  callout(s, "这正是哨兵的价值", "不设 `tail` 哨兵、让 `self.tail` 直接指向最后一个真结点，就得到处补分支：插第一个结点时 `if 表空: self.tail = node`，删最后一个时 `if node is self.tail: ...`，删成空表还要置 `None`。**代价只是「表尾是谁」从 **`self.tail`** 挪到了 **`self.tail.prev`**。**", 6.9, 3.72, 2.6, 1.4, { fontSize: 8.6 });
}

{
  const s = content("M146", "附录A · 双向链表", "C++ 实现（上）：结构与三个私有辅助");
  codeBlock(s, `class LRUCache {
private:
    struct DNode {
        int key, value;
        DNode* prev;
        DNode* next;
        DNode(int k = 0, int v = 0)
            : key(k), value(v), prev(nullptr), next(nullptr) {}
    };
    int capacity_;
    std::unordered_map<int, DNode*> table_;
    DNode* head_;   // 哨兵：head_->next 最新
    DNode* tail_;   // 哨兵：tail_->prev 最旧

    void remove(DNode* node) {                 // 已知结点，O(1) 摘链
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    void addFront(DNode* node) {
        node->next = head_->next;
        node->prev = head_;
        head_->next->prev = node;
        head_->next = node;
    }
    void moveToFront(DNode* node) { remove(node); addFront(node); }
};`, 0.5, 1.02, 6.2, 3.6, { fontSize: 8.2 });
  callout(s, "与 Python 版一一对应", [
    "`remove` / `addFront` / `moveToFront` 三个私有辅助，都是 O(1)；",
    "结点里同样存着 `key`，逐出时靠它反查哈希表；",
    "`std::unordered_map<int, DNode*>` 就是那张「key → 结点地址」的表。",
  ], 6.9, 1.02, 2.6, 2.4, { fontSize: 9.5, gap: 4 });
  callout(s, "下一页", "构造 / 析构 / 禁拷贝，以及 `get` / `put`。", 6.9, 3.6, 2.6, 0.95, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "两个哨兵让 `remove` / `addFront` 里一个 `if` 都不用写——与 Python 版完全同构。", 0.5, 4.7, 6.2, 0.4, { fontSize: 10, color: C.muted });
}

{
  const s = content("M146", "附录A · 双向链表", "C++ 实现（下）：构造 / 析构 / 禁拷贝");
  codeBlock(s, `public:
    explicit LRUCache(int capacity)
        : capacity_(capacity), head_(new DNode()), tail_(new DNode()) {
        head_->next = tail_;
        tail_->prev = head_;
        table_.reserve(capacity * 2);          // 减少 rehash，常数优化
    }

    ~LRUCache() {                              // 三法则：自己 new 的就自己 delete
        DNode* curr = head_;
        while (curr != nullptr) {
            DNode* dying = curr;
            curr = curr->next;                 // 先记后继，再释放
            delete dying;
        }
    }

    LRUCache(const LRUCache&) = delete;        // 持有裸指针，禁止拷贝
    LRUCache& operator=(const LRUCache&) = delete;`, 0.5, 1.05, 6.2, 2.8, { fontSize: 9 });
  callout(s, "C++ 比 Python 多做两件事", [
    "析构要**循环释放**所有结点（含两个哨兵）——不能递归；",
    "持有裸指针 → **禁用拷贝**（`= delete`），这是三法则的另一半：要么都写，要么都禁。",
  ], 6.9, 1.05, 2.6, 2.2, { fontSize: 9.5, gap: 5 });
  callout(s, "reserve 只是常数优化", "`table_.reserve(capacity * 2)` 减少 rehash，不影响复杂度。", 6.9, 3.4, 2.6, 1.1, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "两个哨兵在构造函数里接好，之后 `head_` / `tail_` 不再赋值；「最旧是谁」记在 `tail_->prev` 里。", 0.5, 4.05, 6.2, 0.5, { fontSize: 10.5 });
  text(s, "析构里的 `curr = curr->next;` 同样必须写在 `delete dying;` 之前。", 0.5, 4.55, 6.2, 0.4, { fontSize: 10, color: C.goldText, bold: true });
}

{
  const s = content("M146", "附录A · 双向链表", "C++ 的 get / put：逐出时要删哈希表，还要真正释放");
  codeBlock(s, `    int get(int key) {
        auto it = table_.find(key);
        if (it == table_.end()) return -1;
        moveToFront(it->second);
        return it->second->value;
    }

    void put(int key, int value) {
        auto it = table_.find(key);
        if (it != table_.end()) {              // 已存在：改值 + 刷新
            it->second->value = value;
            moveToFront(it->second);
            return;
        }
        DNode* node = new DNode(key, value);
        table_[key] = node;
        addFront(node);
        if (static_cast<int>(table_.size()) > capacity_) {
            DNode* lru = tail_->prev;
            remove(lru);
            table_.erase(lru->key);            // ★ 靠结点里存的 key 反查哈希表
            delete lru;                        // ★ C++ 还要真正释放
        }
    }
};`, 0.5, 1.05, 6.2, 3.55, { fontSize: 8.5, hl: [21, 22] });
  callout(s, "逐出那三行是考点", [
    "`tail_->prev` 就是最久未使用的结点；",
    "`table_.erase(lru->key)` 靠结点里存的 `key` 反查哈希表；",
    "`delete lru` —— C++ 还要**真正释放**。",
  ], 6.9, 1.05, 2.6, 2.3, { fontSize: 9.5, gap: 4 });
  callout(s, "判超容量用 > 不是 >=", "先插入、再判断 `table_.size() > capacity_`，所以是严格大于。", 6.9, 3.5, 2.6, 1.1, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "`get` / `put` 都是「哈希表定位 O(1) + 改常数条链接 O(1)」。", 0.5, 4.7, 6.2, 0.4, { fontSize: 10, color: C.muted });
}

{
  const s = content("M146", "附录A · 双向链表", "速写版：OrderedDict 与 std::list::splice");
  codeBlock(s, `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.od = OrderedDict()   # 底层=哈希表+双链表

    def get(self, key: int) -> int:
        if key not in self.od:
            return -1
        self.od.move_to_end(key)         # O(1)
        return self.od[key]

    def put(self, key: int, value: int) -> None:
        if key in self.od:
            self.od.move_to_end(key)
        self.od[key] = value
        if len(self.od) > self.capacity:
            self.od.popitem(last=False)  # 弹出最旧的`, 0.5, 1.05, 4.6, 2.85, { fontSize: 8.6, lang: "py" });
  codeBlock(s, `using Item = std::pair<int,int>;      // {key, value}
std::list<Item> lst_;                 // front 最新
std::unordered_map<int, std::list<Item>::iterator> table_;

int get(int key) {
    auto it = table_.find(key);
    if (it == table_.end()) return -1;
    // O(1)：把它挪到表头
    lst_.splice(lst_.begin(), lst_, it->second);
    return it->second->second;
}
void put(int key, int value) {
    auto it = table_.find(key);
    if (it != table_.end()) { it->second->second = value;
        lst_.splice(lst_.begin(), lst_, it->second); return; }
    lst_.emplace_front(key, value);
    table_[key] = lst_.begin();
    if ((int)table_.size() > capacity_) {
        // 靠 pair 里存下的 key 反查哈希表
        table_.erase(lst_.back().first);
        lst_.pop_back();
    }
}`, 5.3, 1.05, 4.2, 2.85, { fontSize: 7.6 });
  callout(s, "OrderedDict = 你手写的那一版", "`OrderedDict` 的 CPython 实现**本身就是**一个哈希表加一条循环双向链表。`move_to_end(key)` / `popitem(last=False)` 都是 O(1)。**但习题课要求先能手写前面那版。**", 0.5, 4.05, 4.6, 1.05, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  callout(s, "splice 的价值", "`std::list` 就是**循环双向链表**，`splice` 是 O(1) 的「摘下来重新挂」，**迭代器（相当于结点地址）保持有效**——这正是 `std::vector` 给不了的。", 5.3, 4.05, 4.2, 1.05, { fontSize: 9.5 });
}

{
  const s = content("M146", "附录A · 双向链表", "复杂度与易错点");
  const cx = [["时间", "`get` / `put` 平均 **O(1)**（哈希 O(1) + 改常数条链接 O(1)）", C.ok], ["空间", "**O(capacity)**", C.green]];
  cx.forEach((c, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.05, 4.35, 0.8, C.code);
    pill(s, c[0], x + 0.15, 1.25, 0.9, 0.4, c[2], C.white, 11);
    text(s, c[1], x + 1.2, 1.05, 3.05, 0.8, { fontSize: 11, valign: "middle", margin: 0 });
  });
  callout(s, "易错点", [
    "❌ 结点里**不存 **`key`，逐出时删不掉哈希表项。",
    "❌ 逐出时**只摘链表不删哈希表**（表越撑越大，后续 `get` 返回已作废的结点）。",
    "❌ `put` 一个**已存在**的 key 时，又插了一个新结点（同一个 key 在链表里出现两次）。",
    "❌ 判断超容量用 `>=` 而不是 `>`。",
    "❌ C++ 版忘记 `delete lru`。",
    "✅ 用哨兵后，**所有分支判断都不需要**——如果你写出了 `if self.head is None`，说明哨兵没用对。",
  ], 0.5, 2.0, 5.9, 3.1, { fontSize: 10.5, gap: 6, fill: "FDF0EE", tcolor: C.bad });
  card(s, 6.5, 2.0, 3.0, 3.1, C.dark);
  text(s, "为什么说它是收官题", 6.7, 2.1, 2.7, 0.3, { fontSize: 11.5, bold: true, color: C.gold, margin: 0 });
  s.addText(runs("链表本身给不出「拿到结点」这一步，**哈希表补上了它**，于是链表的 O(1) 插删才真正兑现。\n\n这正是 CH02 结尾预告的「**散列方法是把顺序表和链表结合起来的一种数据结构**（第 10 章）」。", { color: C.white, boldColor: C.gold, codeColor: C.mint }), { x: 6.7, y: 2.5, w: 2.65, h: 2.5, fontFace: FONT, fontSize: 11, color: C.white, margin: 0, isTextBox: true, lineSpacingMultiple: 1.2 });
}

// ---------------- E21 ----------------
{
  const s = content("E21", "附录A · 核心技巧", "E21 合并两个有序链表：哨兵省掉了什么");
  text(s, "将两个**升序**链表合并为一个新的升序链表并返回。新链表是通过**拼接**给定的两个链表的所有结点组成的（结点数目 [0, 50]）。注意题目说的是「拼接」：**不需要 **`new`** 新结点，只改链接**——这正是链表最擅长的事。", 0.5, 1.02, 9.0, 0.6, { fontSize: 11.5 });
  card(s, 0.5, 1.68, 5.9, 1.85, C.code);
  text(s, "list1:", 0.65, 1.78, 0.6, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
  chain(s, 1.3, 1.76, [1, 2, 4], { dw: 0.42, nw: 0.2, h: 0.32, gap: 0.2, fs: 9 });
  text(s, "list2:", 0.65, 2.22, 0.6, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
  chain(s, 1.3, 2.2, [1, 3, 4], { dw: 0.42, nw: 0.2, h: 0.32, gap: 0.2, fs: 9 });
  chain(s, 0.95, 2.85, ["∅", 1, 1, 2, 3, 4, 4], { dw: 0.42, nw: 0.18, h: 0.32, gap: 0.14, fs: 9, fills: ["E8ECEA", "CDEBD9", "CDEBD9", "CDEBD9", "CDEBD9", "CDEBD9", "CDEBD9"] });
  text(s, "dummy：哨兵，最后 return dummy.next", 0.95, 3.2, 5.2, 0.28, { fontSize: 9, color: C.goldText, bold: true, margin: 0 });
  callout(s, "思路：归并 + 哨兵", "和**归并排序的 merge 步骤**一模一样：两个指针各指一条链的当前最小元素，每次挑小的接到结果尾部。", 6.6, 1.68, 2.9, 1.85, { fontSize: 10 });
  card(s, 0.5, 3.7, 9.0, 1.4, C.cream);
  text(s, "哨兵在这里省掉了什么", 0.7, 3.78, 8.6, 0.3, { fontSize: 12.5, bold: true, color: C.goldText, margin: 0 });
  text(s, "如果不用哨兵，第一次接结点时要写「结果表还是空的，得把 `head` 指过去」，之后每次又要写「接到 `tail` 后面」——**两套分支**。有了哨兵，第一次接也是「接到 `tail` 后面」（`tail` 初始就是 `dummy`），**一套代码走到底**。这就是课件 2.3.1 说的「空表也不必另写一套分支」。", 0.7, 4.12, 8.6, 0.9, { fontSize: 11.5, lsm: 1.15 });
}

{
  const s = content("E21", "附录A · 核心技巧", "迭代版：最后一行是链表相对数组的一次胜利");
  codeBlock(s, `class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        dummy = ListNode(0)      # 哨兵：不存数据，只为省掉分支
        tail = dummy
        while list1 and list2:
            if list1.val <= list2.val:   # ★ 用 <= 保证稳定性（相等时优先取 list1）
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 if list1 else list2   # 剩下那条整体挂上，不必逐个搬
        return dummy.next`, 0.5, 1.05, 6.2, 2.3, { fontSize: 8.8, lang: "py", hl: [13] });
  codeBlock(s, `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode dummy(0);              // 放栈上，函数返回时自动销毁，不泄漏
    ListNode* tail = &dummy;
    while (list1 != nullptr && list2 != nullptr) {
        if (list1->val <= list2->val) { tail->next = list1; list1 = list1->next; }
        else                          { tail->next = list2; list2 = list2->next; }
        tail = tail->next;
    }
    tail->next = (list1 != nullptr) ? list1 : list2;   // 剩余整段直接挂
    return dummy.next;
}`, 0.5, 3.45, 6.2, 1.65, { fontSize: 8.4 });
  card(s, 6.9, 1.05, 2.6, 0.75, C.dark);
  text(s, "时间 O(m+n)，空间 O(1)", 7.05, 1.05, 2.3, 0.75, { fontSize: 11, bold: true, color: C.gold, valign: "middle", margin: 0 });
  callout(s, "最后那一行的价值", "数组做归并时，剩余部分必须**逐个拷贝**到结果数组；链表只要**改一根指针**，剩下几万个结点一次性挂上，**O(1)**。", 6.9, 1.95, 2.6, 1.75, { fontSize: 9.5 });
  callout(s, "为什么是 <=", "本题用 `<` 结果仍然正确，但作为**归并排序的子过程**会破坏**稳定性**——养成用 `<=` 的习惯。", 6.9, 3.85, 2.6, 1.25, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
}

{
  const s = content("E21", "附录A · 核心技巧", "递归版，以及往后看：这就是归并排序的核心");
  codeBlock(s, `class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        if list1 is None:
            return list2            # 递归基
        if list2 is None:
            return list1
        if list1.val <= list2.val:
            list1.next = self.mergeTwoLists(list1.next, list2)
            return list1
        else:
            list2.next = self.mergeTwoLists(list1, list2.next)
            return list2`, 0.5, 1.05, 5.9, 1.95, { fontSize: 9, lang: "py" });
  callout(s, "递归版读起来最像定义", "「两条链的合并结果 = **较小的那个头** + 剩下两条链的合并结果」。代价是 **O(m+n) 的栈深度**——本题 n ≤ 50 无所谓，但换成 **M23**（合并 K 个升序链表，单链可达 10⁴）就必须写迭代。", 6.5, 1.05, 3.0, 1.95, { fontSize: 9.5 });
  card(s, 0.5, 3.15, 9.0, 1.15, C.cream);
  text(s, "往后看：M148 排序链表 = 快慢指针找中点断开 + 递归排序两半 + 本题的 merge", 0.7, 3.22, 8.6, 0.3, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  text(s, "链表归并排序是**唯一能做到 O(n log n) 时间且 O(1) 额外空间**（自底向上写法）的链表排序。CH02 说「顺序表提供随机访问，因此适合二分检索与快速排序」，反过来：**链表不适合快排**（要随机访问定位 pivot），**但天生适合归并排序**（只需顺序扫描）。", 0.7, 3.55, 8.6, 0.7, { fontSize: 11, lsm: 1.15 });
  callout(s, "易错点", [
    "❌ 不用哨兵，导致要写 `if result is None` 的分支。",
    "❌ 用 `<` 而不是 `<=`（破坏稳定性）。",
    "❌ 循环结束后忘记挂剩余段。",
    "❌ 新建结点拷贝值（题目要求拼接，多余的 O(n) 空间）。",
  ], 0.5, 4.4, 9.0, 0.7, { fontSize: 9.5, gap: 2, fill: "FDF0EE", tcolor: C.bad });
}

// ---------------- E234 ----------------
{
  const s = content("E234", "附录A · 核心技巧", "E234 回文链表：三步走");
  text(s, "判断单链表是否为回文（结点数目 [1, 10⁵]，0 ≤ val ≤ 9）。**进阶：O(n) 时间、O(1) 空间。**", 0.5, 1.02, 9.0, 0.35, { fontSize: 11.5 });
  codeBlock(s, `class Solution:                       # 解法一：倒进数组（先保证会做）
    def isPalindrome(self, head: ListNode) -> bool:
        vals = []
        while head:
            vals.append(head.val)
            head = head.next
        return vals == vals[::-1]         # O(n) 时间 O(n) 空间，但没练到链表`, 0.5, 1.5, 5.9, 1.3, { fontSize: 8.8, lang: "py" });
  callout(s, "解法二：快慢指针 + 反转后半", "**进阶解法，本题重点**：O(n) 时间、O(1) 空间；把 E206 的三指针模板用进来。", 6.5, 1.5, 3.0, 1.3, { fontSize: 10 });
  card(s, 0.5, 2.95, 9.0, 2.15, C.code);
  text(s, "三步走", 0.68, 3.02, 2, 0.28, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  text(s, `                    奇数 n=5                      偶数 n=4
① 快慢指针找中点    1 → 2 → [3] → 2 → 1           1 → 2 → [2] → 1
                    slow 停在第 3 个（正中间）    slow 停在第 3 个（后半段第一个）

② 从 slow 起反转    1 → 2 → [3] ← 2 ← 1           1 → 2 → [2] ← 1
                    left            right         left        right

③ 逐个比较          (1,1) (2,2) (3,3)             (1,1) (2,2)
                    right 走完即止                right 走完即止`, 0.68, 3.32, 8.7, 1.7, { fontSize: 8.5, color: C.text, margin: 0 });
  text(s, "图中 [ ] 标出的是 slow。", 0.68, 5.02, 4, 0.25, { fontSize: 9, color: C.muted, margin: 0 });
}

{
  const s = content("E234", "附录A · 核心技巧", "第 ① 步的原理：数 slow 前面有几个结点");
  codeBlock(s, `slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next`, 0.5, 1.05, 4.3, 0.85, { fontSize: 9.5, lang: "py" });
  text(s, "「`fast` 走到尽头时 `slow` 走了一半」这句话在奇偶长度下到底落在哪，很容易想糊涂。**别去想 **`slow`** 是不是「中点」，而是数 **`slow`** 前面有几个结点。**", 5.0, 1.05, 4.5, 0.9, { fontSize: 10.5 });
  text(s, "不变量：把结点从 1 开始编号，循环体执行 t 次之后", 0.5, 2.05, 5, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["", "位置", "前面有几个结点"],
    [{ t: "slow", mono: true }, "第 t+1 个", "t"],
    [{ t: "fast", mono: true }, "第 2t+1 个", "2t"],
  ], 0.5, 2.4, 4.3, [1.2, 1.5, 1.6], { fontSize: 10.5, rowH: 0.36 });
  text(s, "即 `slow`** 前面的结点数永远是 **`fast`** 前面的一半**。", 0.5, 3.6, 4.3, 0.3, { fontSize: 10.5, margin: 0 });
  callout(s, "什么时候停", "`while fast and fast.next` 要求第 2t+1、第 2t+2 个结点都存在，即 **2t+2 ≤ n**。第一次不满足时 **t = ⌊n/2⌋**，所以 `slow` 停在第 **⌊n/2⌋+1** 个结点，前面恰好有 **⌊n/2⌋** 个结点。", 5.0, 2.05, 4.5, 1.85, { fontSize: 10 });
  table(s, [
    ["链表长度", "停下的原因", "slow 落在"],
    ["偶数 n = 2k", "`fast` 在第 2k+1 个，已跑出链表：`fast is None`", "第 k+1 个（**后半段的第一个**）"],
    ["奇数 n = 2k+1", "`fast` 恰在最后一个（第 2k+1 个）：`fast.next is None`", "第 k+1 个（**正中间**）"],
  ], 0.5, 3.85, 9.0, [1.6, 4.9, 2.5], { fontSize: 9, rowH: 0.34 });
  text(s, "奇偶只影响**停下的原因**，不影响这个公式。", 0.5, 4.92, 9.0, 0.28, { fontSize: 9.5, color: C.goldText, bold: true });
}

{
  const s = content("E234", "附录A · 核心技巧", "实际轨迹、落点表，以及换一个循环条件就错了");
  codeBlock(s, `n=4（偶）  t=0: slow=1, fast=1
           t=1: slow=2, fast=3
           t=2: slow=3, fast=None   ← fast 跑出去了，停；slow 前面 2 个
n=5（奇）  t=0: slow=1, fast=1
           t=1: slow=2, fast=3
           t=2: slow=3, fast=5      ← fast 在最后一个，fast.next 为空，停`, 0.5, 1.05, 5.9, 1.25, { fontSize: 8.5, lang: "text" });
  table(s, [
    ["n", "1", "2", "3", "4", "5", "6"],
    ["slow 停在第几个", "1", "2", "2", "3", "3", "4"],
    ["slow 前面（前段）", "0", "1", "1", "2", "2", "3"],
    ["从 slow 起（后段）", "1", "1", "2", "2", "3", "3"],
  ], 0.5, 2.45, 5.9, [2.0, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65], { fontSize: 9.5, rowH: 0.34, align: "center" });
  text(s, "规律：**前段 ⌊n/2⌋ 个，后段 ⌈n/2⌉ 个**；奇数时多出的那个（正中间）归后段。", 0.5, 3.9, 5.9, 0.3, { fontSize: 10.5, margin: 0 });
  callout(s, "为什么从 slow 开始反转刚好对", [
    "判回文只需比较「从前数第 i 个」与「从后数第 i 个」，i = 1..⌊n/2⌋，奇数时正中间不用比。",
    "**偶数**：前后段一样长，正好两两配对；",
    "**奇数**：后段多出中点，它最后和自己比，**恒相等**，不影响结果。",
  ], 6.5, 1.05, 3.0, 2.4, { fontSize: 9.5, gap: 4 });
  card(s, 6.5, 3.6, 3.0, 1.5, "FDF0EE");
  text(s, "对照：写成 while fast.next and fast.next.next", 6.65, 3.66, 2.8, 0.45, { fontSize: 9.5, bold: true, color: C.bad, margin: 0 });
  table(s, [
    ["n", "2", "3", "4", "5", "6"],
    ["这种写法", "1", "2", "2", "3", "3"],
    ["正确写法", "2", "2", "3", "3", "4"],
  ], 6.62, 4.12, 2.76, [1.0, 0.36, 0.34, 0.34, 0.34, 0.38], { fontSize: 8, rowH: 0.26, align: "center", tight: true });
  text(s, "奇数一样，**偶数时早了一位**；它必须配合「从 `slow.next` 起反转」。", 6.65, 4.92, 2.8, 0.3, { fontSize: 8.5, color: C.bad, margin: 0 });
  text(s, "手推 n = 1, 2, 3, 4 四种长度，快慢指针的落点问题就再也不会错了。", 0.5, 4.35, 5.9, 0.3, { fontSize: 10, color: C.muted });
}

{
  const s = content("E234", "附录A · 核心技巧", "完整解法 + 为什么用 while right");
  codeBlock(s, `class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        if not head or not head.next:
            return True

        # ① 快慢指针找中点
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        # ② 反转后半段（就是 E206 的迭代模板）
        prev = None
        curr = slow
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt

        # ③ 前半段与反转后的后半段逐个比较
        left, right = head, prev
        result = True
        while right:                 # 以较短的后半段为准，right 走完即止
            if left.val != right.val:
                result = False
                break
            left = left.next
            right = right.next
        return result`, 0.5, 1.05, 6.2, 4.05, { fontSize: 8.4, lang: "py", hl: [24] });
  callout(s, "③ 为什么用 while right", "**而不是 `while left`**：反转之后，前半段的最后一个结点**仍然指向 **`slow`（`slow` 的 `next` 在反转中被改成了 `None`，但指向 `slow` 的那根链接没动），所以从 `left` 出发能一直走到 `slow` 才停；而 `right` 恰好在走完后半段后变成 `None`。**以短的那条为准最稳妥。**", 6.9, 1.05, 2.6, 2.55, { fontSize: 9.5 });
  card(s, 6.9, 3.75, 2.6, 0.7, C.dark);
  text(s, "时间 O(n)，空间 O(1)", 7.05, 3.75, 2.3, 0.7, { fontSize: 11, bold: true, color: C.gold, valign: "middle", margin: 0 });
  text(s, "C++ 版逐句对应，`nullptr` 代替 `None`。", 6.9, 4.6, 2.6, 0.5, { fontSize: 9, color: C.muted });
}

{
  const s = content("E234", "附录A · 核心技巧", "加分项：比较完把链表恢复原状");
  text(s, "工程上「**判断函数不应该改坏输入**」。反转一次是 O(n)，再反转回来还是 O(n)，**总复杂度不变**。", 0.5, 1.02, 9.0, 0.35, { fontSize: 11.5 });
  codeBlock(s, `class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        if not head or not head.next:
            return True

        def reverse(node):
            prev = None
            while node:
                node.next, prev, node = prev, node, node.next
            return prev

        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next

        second = reverse(slow)          # 反转后半段
        left, right = head, second
        ok = True
        while right:
            if left.val != right.val:
                ok = False
                break
            left, right = left.next, right.next

        reverse(second)                 # ★ 复原：再反转一次接回去
        return ok`, 0.5, 1.5, 5.9, 3.6, { fontSize: 8.0, lang: "py", hl: [24] });
  callout(s, "一行版的三指针反转", "`node.next, prev, node = prev, node, node.next`：Python 里**右边整体先求值**，所以 `node.next` 取的还是修改前的值。写给自己看可以，**考试时建议写展开版**，可读性更重要。", 6.5, 1.5, 3.0, 1.85, { fontSize: 9.5 });
  callout(s, "易错点", [
    "❌ 循环条件写成 `while fast.next and fast.next.next`，却仍从 `slow` 开始反转（偶数长度时早一位）。",
    "❌ 比较时用 `while left`（偶数时 `left` 链更长，`right` 先为 `None`，访问 `right.val` 直接报错）。",
    "💡 空表 / 单结点其实**不需要特判**；开头那句只是让意图更清楚。",
  ], 6.5, 3.5, 3.0, 1.6, { fontSize: 8.8, gap: 4, fill: "FDF0EE", tcolor: C.bad });
  text(s, "反转两次，输入链表最终与调用前一致。", 0.5, 5.15, 5.9, 0.25, { fontSize: 9, color: C.muted });
}

// ---------------- 附录小结 ----------------
{
  const s = content("A.5", "附录A · 小结", "六道题的复杂度总表");
  table(s, [
    ["题号", "最优解法", "时间", "额外空间", "一句话技巧"],
    ["E160 相交链表", "双指针换道", "O(m+n)", "O(1)", "走完自己走对面，路程必然相等"],
    ["E206 反转链表", "三指针迭代", "O(n)", "O(1)", "断链前先存后继"],
    ["M1472 浏览器历史", "双链表（**数组更优**）", "单次 O(steps)", "O(n)", "`prev` 买来的就是「能往回走」"],
    [{ t: "M146 LRU 缓存", fill: C.cream }, { t: "哈希表 + 双链表", fill: C.cream }, { t: "均摊 O(1)", fill: C.cream }, { t: "O(capacity)", fill: C.cream }, { t: "哈希补上「定位」，链表的 O(1) 才兑现", fill: C.cream }],
    ["E21 合并有序链表", "哨兵 + 归并", "O(m+n)", "O(1)", "剩余段整体挂上，O(1)"],
    ["E234 回文链表", "快慢指针 + 反转", "O(n)", "O(1)", "中点定义要靠手推确认"],
  ], 0.5, 1.15, 9.0, [1.95, 2.1, 1.35, 1.3, 2.3], { fontSize: 10, rowH: 0.45 });
  callout(s, "一句话", "选顺序表还是链表，只看**你的高频操作到底是「按位置读」还是「已知结点改」**。", 0.5, 4.45, 9.0, 0.65, { fontSize: 11.5, tsize: 11 });
}

{
  const s = content("A.5", "附录A · 小结", "五个必须形成肌肉记忆的模板");
  codeBlock(s, `# 1. 哨兵（虚拟头结点）—— 表头可能变化时一律用它
dummy = ListNode(0, head); ...; return dummy.next

# 2. 三指针反转 —— E206 / E234 / M92 / T25 都在用
prev, curr = None, head
while curr:
    nxt = curr.next; curr.next = prev; prev = curr; curr = nxt

# 3. 快慢指针找中点 —— E234 / E876 / M148
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next

# 4. 快慢指针判环 —— E141 / M142（Floyd 判圈）
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
    if slow is fast: return True

# 5. 双指针换道对齐 —— E160 / M142 求环入口
pA, pB = headA, headB
while pA is not pB:
    pA = pA.next if pA else headB
    pB = pB.next if pB else headA`, 0.5, 1.05, 6.4, 4.05, { fontSize: 8.6, lang: "py" });
  callout(s, "回到 CH02 的那张表", [
    "**M1472** 属于「不要用链表」那条：`back(steps)` 是按位置跳，**数组完胜**。",
    "**M146** 属于「不要用顺序表」那条：每次访问都要把元素挪到最前面，数组要搬一半元素，链表只改 **4 根指针**。",
    "**E21 / E234** 说明链表的另一个优势：**只改链接、不搬数据、不额外分配**，所以能做到 O(1) 额外空间。",
  ], 7.1, 1.05, 2.4, 4.05, { fontSize: 9, gap: 6 });
}

{
  const s = content("A.5", "附录A · 小结", "提交前的自检清单 & 课后拓展");
  const checks = [
    "空表（`head is None`）走通了吗？",
    "只有一个结点呢？两个呢？",
    "有没有在断链之前忘记保存后继？",
    "返回的是新表头（`prev` / `dummy.next` / `newHead`）还是旧的 `head`？",
    "有没有制造出环（改完 `a.next = b` 后 `b.next` 是否还指着 `a`）？",
    "比较结点用的是 `is` / 指针，还是误用了 `.val`？",
    "C++：`new` 出来的都 `delete` 了吗？持有裸指针的类禁用拷贝了吗（三法则）？",
    "Python：递归深度会不会超（n > 1000 时）？",
  ];
  card(s, 0.5, 1.05, 5.2, 4.05, C.code);
  text(s, "提交前的自检清单", 0.68, 1.12, 4.8, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  checks.forEach((c, i) => {
    const y = 1.5 + i * 0.44;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: y + 0.05, w: 0.18, h: 0.18, fill: { color: C.white }, line: { color: C.green, width: 1 } });
    text(s, c, 1.0, y, 4.5, 0.42, { fontSize: 9.5, margin: 0 });
  });
  table(s, [
    ["题号", "名称", "复用的模板"],
    ["E141", "环形链表", "模板 4"],
    ["E876", "链表的中间结点", "模板 3"],
    ["E203", "移除链表元素", "模板 1（哨兵）"],
    ["E83", "删除排序链表中的重复元素", "单指针扫描"],
    [{ t: "M142", fill: C.cream }, { t: "环形链表 II", fill: C.cream }, { t: "模板 4 + 数学证明（与 E160 同一套推导）", fill: C.cream }],
    ["M19", "删除链表的倒数第 N 个结点", "模板 1 + 快慢指针错开 N 步"],
    ["M2", "两数相加", "模板 1 + 进位"],
    ["M24", "两两交换链表中的结点", "模板 1 + 模板 2"],
    ["M148", "排序链表", "模板 3 + E21 的 merge"],
    ["M92", "反转链表 II", "模板 1 + 模板 2"],
    ["M430", "扁平化多级双向链表", "双链表 + 栈"],
    ["T25", "K 个一组翻转链表", "模板 1 + 模板 2，集大成者"],
    ["T23", "合并 K 个升序链表", "E21 + 堆 / 分治"],
  ], 5.9, 1.05, 3.6, [0.6, 1.5, 1.5], { fontSize: 7.8, rowH: 0.27, tight: true });
  text(s, "**M142 特别推荐**：它的证明与 E160 是同一类（两个指针走过的路程列方程）。", 5.9, 4.95, 3.6, 0.3, { fontSize: 8.5, color: C.goldText });
}

{
  const s = content("A.6", "附录A · 脚手架", "本地调试脚手架：以后所有链表题直接复用");
  codeBlock(s, `import sys
sys.setrecursionlimit(1 << 20)      # 链表递归题必备


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build(values):
    """由列表造链表，返回头结点"""
    dummy = ListNode(0)
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


def to_list(head, limit=100):
    """链表转列表；limit 用于防止成环时死循环"""
    out = []
    while head and len(out) < limit:
        out.append(head.val)
        head = head.next
    return out`, 0.5, 1.05, 5.5, 3.95, { fontSize: 8.2, lang: "py" });
  codeBlock(s, `def build_intersect(a, b, common):
    """为 E160 造两条共享尾部的链表"""
    tail = build(common)

    def attach(prefix):
        head = build(prefix)
        if head is None:
            return tail        # 前缀空：整条链即公共段
        p = head
        while p.next:
            p = p.next
        p.next = tail
        return head

    return attach(a), attach(b), tail`, 6.1, 1.05, 3.4, 2.05, { fontSize: 7.4, lang: "py" });
  codeBlock(s, `# 开发档：开满警告 + 地址/未定义行为检查
g++ -std=c++17 -Wall -Wextra -Werror -g \\
    -fsanitize=address,undefined main.cpp -o main && ./main

# 发布档：看真实性能
g++ -std=c++17 -O2 main.cpp -o main && ./main`, 6.1, 3.25, 3.4, 1.0, { fontSize: 7.2, lang: "text" });
  callout(s, "强烈建议", "本地用 **ASan 档**跑一遍 M1472 和 M146 的手写版：忘记 `delete`、`delete` 之后又读指针，这两类错误在 LeetCode 上可能照样 AC，但 **ASan 会当场报出来**。这是「三法则」那一节最值钱的实践部分。", 6.1, 4.3, 3.4, 1.05, { fontSize: 8 });
  text(s, "C++ 版脚手架同样提供 `build` / `printList` / `freeList` 三个函数（讲义附录 A.1）。", 0.5, 5.08, 5.5, 0.3, { fontSize: 9, color: C.muted });
}

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
