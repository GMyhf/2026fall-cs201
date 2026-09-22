// 第八章 内部排序 —— 由 dsa-modernization/book/ch08-sorting.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch08_sorting.js ../202609_DSA_08_Sorting.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_08_Sorting.pptx");

// 讲义中引用的图片（name → 本地路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const IMAGES = {};
["fig-8-1", "fig-8-2", "fig-8-4", "fig-8-5", "fig-8-6", "fig-8-7", "fig-8-8", "fig-8-9",
  "fig-8-10", "fig-8-11", "fig-8-12-b", "fig-8-13", "fig-8-14"].forEach((n) => { IMAGES[n] = `${SCAN}/${n}.png`; });

(async () => {
  const D = createDeck({ title: "DSA 第八章 内部排序", imgDir: path.join(__dirname, "..", ".cache", "ch08") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, callout, bullets, card, codeBlock, consoleBlock, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  const RED = "FDF0EE", GRN = "EAF4EF";
  // 一行序列：label + 各元素（等宽、居中）；hl = {下标: 底色}
  const seqRow = (label, vals, hl = {}, extra = []) => [
    { t: label, bold: true },
    ...vals.map((v, i) => ({ t: String(v), mono: true, align: "center", fill: hl[i], bold: !!hl[i] })),
    ...extra,
  ];
  const caption = (s, str, x, y, w) => text(s, str, x, y, w, 0.3, { fontSize: 9.5, color: C.muted, align: "center" });

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第八章  内部排序",
  subtitle: "Internal Sorting：比较还是分配，稳不稳定，多快多省",
  topics: "基本概念 · 稳定性 · 比较次数与移动次数\n直接插入 · Shell · 直接选择 · 堆排序 · 冒泡 · 快速排序\n归并排序 · 逆序对计数 · 桶式 / 基数 / 索引排序\n实测：同阶不等于同速 · std::sort · 判定树下限 Ω(n log n)",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["靠比较，还是靠分配？", "比较排序最坏至少 **Ω(n log n)** 次比较；桶式、基数排序**不比较**，站在这条下界之外。"],
    ["相等的键排完还按原来的次序吗？", "这叫**稳定性**。按成绩排序时同分学生仍按原姓名顺序，后续再按姓名排才有意义。"],
    ["同为 Θ(n²)，就一样快吗？", "要看最好 / 平均 / 最坏**三个数**和额外空间；实测里冒泡比插入慢 **27 倍**。"],
  ];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.55, C.code);
    numCircle(s, i + 1, x + 0.2, 1.32, 0.46, C.dark);
    text(s, q[0], x + 0.2, 1.92, 2.5, 0.7, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], x + 0.2, 2.65, 2.5, 0.95, { fontSize: 11, margin: 0, lsm: 1.2 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "一句话概括", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "每读一种排序都问四件事：比较还是分配、稳不稳定、额外空间、三种时间。答案会告诉你：", options: { color: C.white } },
    { text: "同阶不等于同速", options: { color: C.gold, bold: true } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.55, fontFace: FONT, fontSize: 14, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["基础与简单排序", ["8.1 基本概念：术语、稳定性、代价", "8.2 插入排序：直接插入、Shell 排序", "8.3 选择排序：直接选择、堆排序"]],
    ["交换与分治", ["8.4 交换排序：冒泡、快速排序及两处优化", "8.5 归并排序：两路归并、稳定性来自一个 `<`", "副产品：逆序对计数"]],
    ["突破与极限", ["8.6 分配排序：桶式、基数、索引排序", "8.7 时间代价：实测数据、std::sort", "判定树下限 Ω(n log n)", "本章小结"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 0 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 2.5, 0.45, { fontSize: 18, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 2.6, 3.0, { fontSize: 12, gap: 8 });
  });
}

// 4. Run first
{
  const s = content("▶", "先跑一遍", "同一组数据，交给四种手写排序");
  codeBlock(s, `#include "modern.hpp"
// ... <iostream>、<vector>；print(name, values) 逐个输出

int main() {
    const std::vector<int> raw{3, -2, 7, 3, 0, -2, 9, 1};

    auto insertion = raw;
    dsa::sorting::insertion_sort(insertion);
    print("插入:", insertion);

    auto heap = raw;
    dsa::sorting::heap_sort(heap);
    print("堆排:", heap);

    auto quick = raw;
    dsa::sorting::quick_sort(quick);
    print("快排:", quick);

    auto radix = raw;
    dsa::sorting::radix_sort(radix);
    print("基数:", radix);
}`, 0.5, 1.1, 5.4, 4.0, { fontSize: 9.5 });
  consoleBlock(s, "插入: -2 -2 0 1 3 3 7 9\n堆排: -2 -2 0 1 3 3 7 9\n快排: -2 -2 0 1 3 3 7 9\n基数: -2 -2 0 1 3 3 7 9", 6.15, 1.1, 3.35, 1.4);
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror \\\n  -Icode/ch08/sorting \\\n  code/ch08/sorting/demo.cpp", 6.15, 2.6, 3.35, 0.65, { fontSize: 8.5, color: C.muted });
  callout(s, "看到了什么", [
    "四种算法交出**同一条非递减序列**，含重复值和负数。",
    "插入排序保持两个 `-2`、两个 `3` 的相对次序；**堆排和快排不保证**这一点。",
    "没有一个用 `std::sort` 顶替——那样等于把这一章删掉。",
  ], 6.15, 3.35, 3.35, 1.75, { fontSize: 10.5 });
}

// ============================ 8.1 ============================
sectionSlide("8.1", "排序问题的基本概念", "内排序与外排序 · 排序码与关键码 · 稳定性\n比较次数与移动次数 · 本章的分类");

// 8.1 terms
{
  const s = content("8.1", "8.1 基本概念", "术语先约定清楚");
  bullets(s, [
    "**排序**：把序列重排为有序；本章对记录数组做**不减排序**。",
    "**内排序**：记录全部放在内存里（本章）；**外排序**：记录太多，还要访问外存（第 9 章）。",
    "用「**记录** / 元素」代替前 7 章的「结点」，用「**序列**」代替「线性表」。",
    "每个记录有一个**排序码**（sort key）域作为排序依据；本章假设排序码为整数。",
    "**不减序列** k′₀ ≤ k′₁ ≤ ⋯；**不增序列**反之。没有重复排序码时分别称升序、降序。",
    "**正序**：待排序列正好符合要求；**逆序**：把它逆转过来才符合要求。",
  ], 0.5, 1.1, 5.6, 4.0, { fontSize: 12.5, gap: 9 });
  callout(s, "⚠ 排序码不一定是关键码", "关键码唯一确定一个记录；排序码不是关键码时，可能有多个记录排序码相同，因此**排序结果可能不唯一**。", 6.35, 1.1, 3.15, 1.95, { fontSize: 11, fill: RED, tcolor: C.bad });
  callout(s, "生活里的排序", [
    "图书按编号放上书架",
    "资源管理器按名称、大小、类型排列",
    "搜索引擎把最相关的页面排在前面",
  ], 6.35, 3.2, 3.15, 1.9, { fontSize: 11 });
}

// 8.1 stability
{
  const s = content("8.1", "8.1 基本概念 · 稳定性", "稳定：相同排序码的记录，排序后相对次序不变");
  text(s, "全章用同一个序列，两个 34 记作 **34** 和 **34′**（34 在前）：", 0.5, 1.05, 9, 0.35, { fontSize: 13 });
  const row = [45, 34, 78, 12, "34′", 32, 29, 64];
  cells(s, 2.35, 1.5, row, { cw: 0.6, ch: 0.42, fills: [null, C.cream, null, null, C.cream] });
  text(s, "输入", 0.5, 1.5, 1.7, 0.42, { fontSize: 12, bold: true, color: C.dark, valign: "middle" });
  cells(s, 2.35, 2.12, [12, 29, 32, 34, "34′", 45, 64, 78], { cw: 0.6, ch: 0.42, fills: [null, null, null, "CDEBD9", "CDEBD9"] });
  text(s, "稳定 ✓", 0.5, 2.12, 1.7, 0.42, { fontSize: 12, bold: true, color: C.ok, valign: "middle" });
  cells(s, 2.35, 2.74, [12, 29, 32, "34′", 34, 45, 64, 78], { cw: 0.6, ch: 0.42, fills: [null, null, null, "F9D5D0", "F9D5D0"] });
  text(s, "不稳定 ✗", 0.5, 2.74, 1.7, 0.42, { fontSize: 12, bold: true, color: C.bad, valign: "middle" });
  callout(s, "稳定不是装饰", "按成绩排序时，两名同分学生若仍按原来的姓名顺序出现，后续按姓名再排才有意义。\n8.6.2 的 LSD 基数排序：第一趟之后的每一趟**都要求稳定**，否则前几趟的成果会被打乱。", 7.35, 1.5, 2.15, 3.6, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  card(s, 0.5, 3.4, 6.65, 1.7, C.code);
  text(s, "读每一种方法时，同时问四件事", 0.7, 3.47, 6, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  const q4 = ["比较还是分配？", "稳定吗？", "额外空间多少？", "最好 / 平均 / 最坏？"];
  q4.forEach((q, i) => {
    const x = 0.7 + i * 1.6;
    numCircle(s, i + 1, x, 3.95, 0.36, C.green);
    text(s, q, x + 0.42, 3.88, 1.15, 0.52, { fontSize: 10.5, bold: true, color: C.dark, margin: 0, valign: "middle" });
  });
  text(s, "证明稳定要对**任意**一对相同排序码论证；证明不稳定，举**一个反例**就够。", 0.7, 4.55, 6.3, 0.45, { fontSize: 11, margin: 0 });
}

// 8.1 cost
{
  const s = content("8.1", "8.1 基本概念 · 代价", "怎么衡量代价：比较次数 + 移动次数");
  bullets(s, [
    "主要看**时间代价**；有特殊空间限制时，再挑辅助空间小的算法。",
    "时间代价用**记录的总比较次数和总移动次数**衡量：一次移动 = 一次记录赋值。",
    "影响运行时间的因素：记录数量、排序码和记录的大小，以及**输入的原始有序程度**。",
    "分别考虑三种情况：**最佳、最差、平均**。",
    "平均怎么定义：不含重复记录时，长度为 n 的序列共有 **n!** 种排列；假定每种等概率，所有排列的平均运行时间就是平均时间代价。",
  ], 0.5, 1.1, 5.4, 4.0, { fontSize: 12.5, gap: 9 });
  card(s, 6.15, 1.1, 3.35, 2.75, C.code);
  text(s, "一次 swap = 三次移动", 6.3, 1.18, 3.1, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  [["tmp = a;", 1], ["a = b;", 2], ["b = tmp;", 3]].forEach((r, i) => {
    const y = 1.68 + i * 0.52;
    numCircle(s, r[1], 6.35, y, 0.36, C.green);
    s.addText(r[0], { x: 6.85, y, w: 2.4, h: 0.36, fontFace: MONO, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle", isTextBox: true });
  });
  text(s, "插入排序挪一格只要 1 次赋值", 6.3, 3.35, 3.1, 0.35, { fontSize: 10.5, color: C.muted, margin: 0 });
  callout(s, "这条换算后面要用", "8.7.2 解释「同样是 Θ(n²)，冒泡为什么比插入慢几十倍」时，靠的就是它。", 6.15, 4.0, 3.35, 1.1, { fontSize: 10.5 });
}

// 8.1 classification + overview
{
  const s = content("8.1", "8.1 基本概念 · 分类与总览", "本章的分类，以及一张先记住的总表");
  table(s, [
    ["方法", "平均时间", "稳定性", "主要特点"],
    ["直接插入", "O(n²)", { t: "稳定", color: C.ok, bold: true }, "小规模、近乎有序时简单有效"],
    ["冒泡", "O(n²)", { t: "稳定", color: C.ok, bold: true }, "教学直观，通常不作为通用选择"],
    ["选择", "O(n²)", { t: "不稳定", color: C.bad }, "交换次数少"],
    ["堆排序", "O(n log n)", { t: "不稳定", color: C.bad }, "最坏情况也有保证，原地排序"],
    ["快速排序", "O(n log n) 平均", { t: "不稳定", color: C.bad }, "实务常用，坏划分时会退化"],
    ["归并排序", "O(n log n)", { t: "稳定", color: C.ok, bold: true }, "需要 O(n) 辅助空间"],
    ["计数/基数", "与值域或位数有关", { t: "可稳定", color: C.ok }, "适合整数键，不是比较排序"],
  ], 0.5, 1.1, 6.1, [1.05, 1.55, 0.8, 2.7], { fontSize: 10.5, rowH: 0.42 });
  callout(s, "原书的分类", [
    "**插入类**：直接插入、Shell（8.2）",
    "**选择类**：直接选择、堆排序（8.3）",
    "**交换类**：冒泡、快速排序（8.4）",
    "**归并**（8.5）；**分配**：桶式、基数、索引（8.6）",
  ], 6.85, 1.1, 2.65, 2.3, { fontSize: 10.5, gap: 3 });
  callout(s, "另一种常见分法", "插入、直接选择、冒泡是「**简单排序**」；快排和归并是「**分治排序**」。", 6.85, 3.55, 2.65, 1.55, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "本章所有实现都接受有符号整数，测试含重复值和负数。", 0.5, 4.6, 6.1, 0.4, { fontSize: 11, color: C.muted });
}

// ============================ 8.2 ============================
sectionSlide("8.2", "插入排序", "逐个把新记录插进已排好的前缀\n直接插入 · 逆置 · Shell 排序（缩小增量）");

// 8.2.1 concept
{
  const s = content("8.2.1", "8.2 插入排序 · 直接插入", "直接插入：线性搜索找位置，边比边挪");
  bullets(s, [
    "对记录**逐个**处理：每个新记录与已排好序的记录比较，插到适当位置。",
    "两件事：**找位置**（从右往左比，直到第一个**不大于**新记录的值）＋ **挪位置**（比它大的都后移一格）。",
    "先把 `values[index]` **暂存**、腾出空位（hole），挪完再回填。",
    "相等元素**不越过彼此** → **稳定**：图 8.1 中 i=4 那一行，34 与 34′ 的原始顺序没变，直到排序结束也没变。",
    "空间只多一个临时变量：**Θ(1)**。",
  ], 0.5, 1.1, 5.6, 4.0, { fontSize: 12.5, gap: 10 });
  card(s, 6.35, 1.05, 3.15, 4.05, C.code);
  image(s, "fig-8-1", 6.45, 1.12, 2.95, 3.6);
  caption(s, "图 8.1 插入排序（‖ 左边已有序）", 6.35, 4.75, 3.15);
}

// 8.2.1 code + trace
{
  const s = content("8.2.1", "8.2 插入排序 · 直接插入 · modern.hpp", "insertion_sort 与逐趟结果");
  codeBlock(s, `// 算法8.1：直接插入排序。相等元素不越过彼此，故稳定。
inline void insertion_sort(std::vector<int>& values) {
    for (std::size_t index = 1; index < values.size(); ++index) {
        const int value = values[index];
        std::size_t hole = index;
        while (hole != 0 && value < values[hole - 1]) {
            values[hole] = values[hole - 1];
            --hole;
        }
        values[hole] = value;
    }
}`, 0.5, 1.05, 5.3, 2.3, { fontSize: 9, hl: [6] });
  callout(s, "`value < values[hole - 1]` 是严格小于", "遇到相等就停 → 新记录落在相等者**后面** → 稳定。写成 `<=` 就会越过相等元素。", 0.5, 3.5, 5.3, 1.6, { fontSize: 11 });
  const tr = [
    ["i", "0", "1", "2", "3", "4", "5", "6", "7"],
    seqRow("初始", [45, 34, 78, 12, "34′", 32, 29, 64]),
    seqRow("1", [34, 45, 78, 12, "34′", 32, 29, 64], { 0: C.cream }),
    seqRow("2", [34, 45, 78, 12, "34′", 32, 29, 64], { 2: C.cream }),
    seqRow("3", [12, 34, 45, 78, "34′", 32, 29, 64], { 0: C.cream }),
    seqRow("4", [12, 34, "34′", 45, 78, 32, 29, 64], { 1: GRN, 2: GRN }),
    seqRow("5", [12, 32, 34, "34′", 45, 78, 29, 64], { 1: C.cream }),
    seqRow("6", [12, 29, 32, 34, "34′", 45, 78, 64], { 1: C.cream }),
    seqRow("7", [12, 29, 32, 34, "34′", 45, 64, 78], { 6: C.cream }),
  ];
  table(s, tr, 6.0, 1.05, 3.5, [0.46, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38], { fontSize: 9, rowH: 0.3, tight: true });
  text(s, "黄色：本趟插入的记录落点；绿色：i=4 时 34′ 停在 34 后面。", 6.0, 3.9, 3.5, 0.6, { fontSize: 9.5, color: C.muted });
  text(s, "与图 8.1 逐行一致。", 6.0, 4.5, 3.5, 0.3, { fontSize: 9.5, color: C.muted });
}

// 8.2.1 python
{
  const s = content("8.2.1", "8.2 插入排序 · 直接插入 · modern.py", "Python 版：同一策略，边界条件的代价不同");
  codeBlock(s, `# 算法8.1：直接插入排序。相等元素不越过彼此，故稳定。
def insertion_sort(values: list[int]) -> None:
    for index in range(1, len(values)):
        value = values[index]
        hole = index
        # \`hole > 0\` 这个条件在 Python 里是**承重的**，不是防御性写法：
        # C++ 版越界会被 ASan 当场抓住，Python 的 values[-1] 却合法——
        # 它悄悄环绕到最后一个元素，把排序结果搅乱而不报任何错。
        while hole > 0 and value < values[hole - 1]:
            values[hole] = values[hole - 1]
            hole -= 1
        values[hole] = value`, 0.5, 1.05, 6.2, 2.45, { fontSize: 8.5, lang: "py", hl: [9] });
  callout(s, "⚠ 同一处笔误，两种结局", "漏写 `hole > 0`：C++ 下标越界，被 AddressSanitizer **当场抓住**；Python 的 `values[-1]` 完全合法，环绕到最后一个元素——**交出一个看起来正常的错答案**。", 0.5, 3.65, 6.2, 1.45, { fontSize: 11, fill: RED, tcolor: C.bad });
  callout(s, "两份实现的约定", [
    "讲**算法**的章节同时给 Python 实现；讲**存储管理**的章节只有 C++（D-025）。",
    "两份**不是逐行翻译**：策略同一份，代价不是同一份——差在哪里，每处都点名。",
  ], 6.95, 1.05, 2.55, 4.05, { fontSize: 10.5, gap: 6, fill: C.mint, tcolor: C.dark });
}

// 8.2.1 cost + inversion
{
  const s = content("8.2.1", "8.2 插入排序 · 代价分析", "最好 Θ(n)，最坏 Θ(n²)；平均要靠「逆置」来数");
  table(s, [
    ["情况", "比较次数", "移动次数", "时间"],
    ["最佳（正序）", { t: "n − 1", mono: true }, { t: "2(n − 1)", mono: true }, { t: "Θ(n)", bold: true, color: C.ok }],
    ["最差（逆序）", { t: "n(n−1)/2", mono: true }, { t: "(n−1)(n+4)/2", mono: true }, { t: "Θ(n²)", bold: true, color: C.bad }],
    ["平均", "≈ 逆置数", "逆置数 + 2(n − 1)", { t: "Θ(n²)", bold: true, color: C.bad }],
  ], 0.5, 1.05, 5.4, [1.35, 1.25, 1.75, 1.05], { fontSize: 11, rowH: 0.38 });
  text(s, "最差时第 i 趟：比较 i 次；暂存 1 次 + 后移 i 次 + 回填 1 次 = i + 2 次移动。", 0.5, 2.65, 5.4, 0.5, { fontSize: 10.5, color: C.muted });
  card(s, 0.5, 3.2, 5.4, 1.9, C.code);
  text(s, "逆置（inversion）", 0.7, 3.28, 3, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "排列 P 中 i < j 而 pᵢ > pⱼ 的一对。例如图 8.1 处理 i=3 时，12 前面有 3 个比它大的数：", 0.7, 3.6, 5.1, 0.5, { fontSize: 10.5, margin: 0 });
  cells(s, 0.9, 4.2, [34, 45, 78, 12], { cw: 0.5, ch: 0.38, fs: 11, fills: [C.mint, C.mint, C.mint, "F9D5D0"] });
  text(s, "(34,12) (45,12) (78,12)\n→ 3 个逆置，内层挪 3 次", 3.05, 4.15, 2.8, 0.55, { fontSize: 10.5, bold: true, color: C.bad, margin: 0 });
  callout(s, "平均有多少逆置？", "n 个元素两两成对共 n(n−1)/2 对；每一对要么是 P 的逆置、要么是全逆置序列 P′ 的逆置。等概率下 P 平均占一半：\n\n**n(n−1)/4 个逆置 → Θ(n²)**", 6.15, 1.05, 3.35, 2.45, { fontSize: 10.5 });
  callout(s, "一条很强的结论（8.7.1）", "**任何只对相邻记录做比较和移动的排序**，平均时间代价都是 Θ(n²)——说的是一整类算法。", 6.15, 3.65, 3.35, 1.45, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 8.2.2 Shell concept
{
  const s = content("8.2.2", "8.2 插入排序 · Shell 排序", "Shell 排序：先跨大步，最后一趟再细排");
  bullets(s, [
    "直接插入的代价全花在「**一次只能挪一格**」：一个很小的元素落在末尾，要一路挪回 n−1 次。",
    "Shell 排序（D. L. Shell，1959）利用插入排序的**两条性质**：正序时 Θ(n)；短序列上很有效。",
    "把序列分成若干**不相邻、间距相同**的子序列，各自做插入排序；再缩小间距、重复。",
    "间距减到 **1** 时整个序列已**基本有序**，最后这趟插入排序接近 Θ(n)。",
    "又称**缩小增量排序**（diminishing increment sorting）。本书按原书取增量**每次除以 2**：(2ᵏ, 2ᵏ⁻¹, ⋯, 2, 1)。",
  ], 0.5, 1.1, 5.5, 4.0, { fontSize: 12.5, gap: 10 });
  card(s, 6.2, 1.05, 3.3, 4.05, C.code);
  image(s, "fig-8-2", 6.3, 1.2, 3.1, 3.4);
  caption(s, "图 8.2 Shell 排序（同一种连线 = 同一子序列）", 6.2, 4.7, 3.3);
}

// 8.2.2 Shell trace
{
  const s = content("8.2.2", "8.2 插入排序 · Shell 排序", "n = 8：gap = 4 → 2 → 1，一步跨四格");
  const g4 = [C.cream, GRN, "E3ECF7", RED];
  const hl0 = {}; [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => { hl0[i] = g4[i % 4]; });
  table(s, [
    ["", "0", "1", "2", "3", "4", "5", "6", "7"],
    seqRow("初始", [45, 34, 78, 12, "34′", 32, 29, 64], hl0),
    seqRow("gap=4", ["34′", 32, 29, 12, 45, 34, 78, 64], { 0: C.cream, 2: "E3ECF7" }),
    seqRow("gap=2", [29, 12, "34′", 32, 45, 34, 78, 64]),
    seqRow("gap=1", [12, 29, 32, "34′", 34, 45, 64, 78], { 3: "F9D5D0", 4: "F9D5D0" }),
  ], 0.5, 1.1, 5.6, [1.0, 0.575, 0.575, 0.575, 0.575, 0.575, 0.575, 0.575, 0.575], { fontSize: 12, rowH: 0.45 });
  text(s, "初始行的底色：gap=4 时的 4 个子序列 {45,34′} {34,32} {78,29} {12,64}，各自排好。", 0.5, 3.45, 5.6, 0.55, { fontSize: 11, color: C.muted });
  callout(s, "一步跨四格", "29 从下标 6 一步搬到下标 2；34′ 从下标 4 一步搬到下标 0——直接插入做不到。", 0.5, 4.05, 5.6, 1.05, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "⚠ 代价：不稳定", "34 与 34′ 落在**不同的子序列**里，34′ 在第一趟就越过了 34，最终 **34′ 排在 34 前面**，与输入次序相反。\n\n原因正是「跨越式移动」；稳定性依赖「只与相邻元素比较、绝不跳过相等元素」。", 6.35, 1.1, 3.15, 4.0, { fontSize: 11, fill: RED, tcolor: C.bad });
}

// 8.2.2 Shell code
{
  const s = content("8.2.2", "8.2 插入排序 · Shell 排序 · modern.hpp", "shell_sort：把插入排序里的 1 换成 gap");
  codeBlock(s, `// 算法8.2：增量每次减半的 Shell 排序。
inline void shell_sort(std::vector<int>& values) {
    for (std::size_t gap = values.size() / 2; gap != 0; gap /= 2) {
        for (std::size_t index = gap; index < values.size(); ++index) {
            const int value = values[index];
            std::size_t hole = index;
            while (hole >= gap && value < values[hole - gap]) {
                values[hole] = values[hole - gap];
                hole -= gap;
            }
            values[hole] = value;
        }
    }
}`, 0.5, 1.05, 6.0, 2.7, { fontSize: 9, hl: [3, 7, 8, 9] });
  text(s, "内两层就是 insertion_sort，只是「减 1」换成「减 gap」；最外层让 gap 从 n/2 减半到 1。", 0.5, 3.9, 6.0, 0.5, { fontSize: 11.5 });
  table(s, [
    ["增量序列", "最坏时间"],
    ["减半（本书）", { t: "Θ(n²)", bold: true, color: C.bad }],
    ["Hibbard 1, 3, 7, …, 2ᵏ−1", { t: "Θ(n^(3/2))", bold: true }],
    ["Sedgewick", "实测更好"],
  ], 6.75, 1.05, 2.75, [1.75, 1.0], { fontSize: 10, rowH: 0.4 });
  callout(s, "至今没有完全解决", "增量序列直接决定复杂度。本书取减半，是因为它最容易讲清楚「增量」这件事本身。", 6.75, 2.85, 2.75, 2.25, { fontSize: 10.5 });
}

// 8.2.2 increments
{
  const s = content("8.2.2", "8.2 插入排序 · Shell 排序", "为什么「除以 2 递减」效果有限；换增量能换来质变");
  card(s, 0.5, 1.1, 4.35, 2.75, RED);
  text(s, "减半增量：仍是 Θ(n²)", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  text(s, "增量之间**不互质**：间距 2ᵏ⁻¹ 的子序列由间距 2ᵏ 的子序列组成，而后者上一轮已排过，后面的处理效率不高。\n\n最坏：大数都在**奇数**下标、小数都在**偶数**下标。每轮子序列非奇即偶，排完大数仍在奇数位——直到最后 gap=1 那一趟，序列仍未基本有序。", 0.7, 1.6, 4.0, 2.2, { fontSize: 10.5, lsm: 1.1 });
  card(s, 5.15, 1.1, 4.35, 2.75, GRN);
  text(s, "Hibbard：{2ᵏ−1, …, 7, 3, 1}", 5.35, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "推理证明可达 **Θ(n^(3/2))**；模拟实验甚至 Θ(n^(5/4))，尚无理论证明。",
    "「每次除以 3 递减」也是 Θ(n^(3/2))。",
    "有的增量序列可达 **Θ(n^(7/6))**，很接近 Θ(n log n)。",
  ], 5.3, 1.65, 4.05, 2.1, { fontSize: 11, gap: 6 });
  callout(s, "注意两条边界", [
    "**最后一趟增量必须是 1**：换用其他增量序列时，一定要人为补上间距 1，否则不能保证有序。",
    "**Shell 排序不稳定**：子序列互相交错、跨度大（34 与 34′ 就是例子）。空间仍是 Θ(1)。",
  ], 0.5, 4.0, 9.0, 1.1, { fontSize: 11, gap: 3, fill: C.cream });
}

// ============================ 8.3 ============================
sectionSlide("8.3", "选择排序", "逐个选出第 i 小的记录放到第 i 位\n直接选择（线性扫描） · 堆排序（最大堆）");

// 8.3.1 code
{
  const s = content("8.3.1", "8.3 选择排序 · 直接选择 · modern.hpp", "直接选择：选出第 i 小，一次交换到位");
  codeBlock(s, `// 算法8.3：直接选择排序。
inline void selection_sort(std::vector<int>& values) {
    for (std::size_t first = 0; first < values.size(); ++first) {
        std::size_t minimum = first;
        for (std::size_t index = first + 1; index < values.size(); ++index) {
            if (values[index] < values[minimum]) minimum = index;
        }
        using std::swap;
        swap(values[first], values[minimum]);
    }
}`, 0.5, 1.05, 6.1, 2.15, { fontSize: 9, hl: [9] });
  bullets(s, [
    "关键：**如何从剩余的未排序记录中找出最小的那个**。本节两种办法：线性查找（直接选择）、二叉树堆（堆排序）。",
    "第 i 轮从剩下的 n−i 个记录里线性扫描出最小者，与下标 i 交换。",
  ], 0.5, 3.35, 6.1, 1.75, { fontSize: 12, gap: 8 });
  card(s, 6.85, 1.05, 2.65, 2.15, C.dark);
  text(s, "比较次数", 7.0, 1.12, 2.4, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "Σ(n−1−i) = n(n−1)/2", 7.0, 1.45, 2.45, 0.4, { fontSize: 12, bold: true, color: C.white, margin: 0 });
  text(s, "**与输入顺序无关**：已排好的输入照样扫这么多次。最好、平均、最坏都是 Θ(n²)。", 7.0, 1.9, 2.4, 1.2, { fontSize: 10.5, color: C.white, margin: 0 });
  callout(s, "别人没有的优点", "**交换最多 n−1 次**。记录很大、比较很便宜时，移动开销才是主导，这时选择排序反而合适。空间 Θ(1)。", 6.85, 3.35, 2.65, 1.75, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 8.3.1 trace
{
  const s = content("8.3.1", "8.3 选择排序 · 直接选择", "逐轮结果：第 3 轮就看得出不稳定");
  table(s, [
    ["", "0", "1", "2", "3", "4", "5", "6", "7", "本轮交换"],
    seqRow("初始", [45, 34, 78, 12, "34′", 32, 29, 64], { 1: C.cream, 4: C.cream }, [""]),
    seqRow("i=0", [12, 34, 78, 45, "34′", 32, 29, 64], { 0: GRN }, ["12 与下标 3"]),
    seqRow("i=1", [12, 29, 78, 45, "34′", 32, 34, 64], { 1: GRN, 6: "F9D5D0" }, [{ t: "29 与下标 6", color: C.bad, bold: true }]),
    seqRow("i=2", [12, 29, 32, 45, "34′", 78, 34, 64], { 2: GRN }, ["32 与下标 5"]),
    seqRow("i=3", [12, 29, 32, "34′", 45, 78, 34, 64], { 3: "F9D5D0" }, [{ t: "34′ 与下标 4", color: C.bad, bold: true }]),
    seqRow("i=4", [12, 29, 32, "34′", 34, 78, 45, 64], { 4: GRN }, ["34 与下标 6"]),
    seqRow("i=5", [12, 29, 32, "34′", 34, 45, 78, 64], { 5: GRN }, ["45 与下标 6"]),
    seqRow("i=6", [12, 29, 32, "34′", 34, 45, 64, 78], { 6: GRN }, ["64 与下标 7"]),
  ], 0.5, 1.05, 6.4, [0.6, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 1.12], { fontSize: 10, rowH: 0.4 });
  callout(s, "⚠ 为什么不稳定", "扫描从前往后，**34′（下标 4）先于 34（下标 6）被选中**，排完是 34′ 34。\n\n更本质：**交换跨度很大**——i=1 那轮把 34 从下标 1 一脚踢到下标 6，越过了 34′。稳定的排序必须避免这种远距离交换。", 7.1, 1.05, 2.4, 4.05, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  text(s, "（与原书图 8.3 同一序列）", 0.5, 4.75, 6.4, 0.3, { fontSize: 9.5, color: C.muted });
}

// 8.3.2 heap concept
{
  const s = content("8.3.2", "8.3 选择排序 · 堆排序", "堆排序：用最大堆代替线性扫描来「选最大」");
  card(s, 0.5, 1.05, 9.0, 2.2, C.code);
  image(s, "fig-8-4", 0.6, 1.1, 8.8, 2.1);
  bullets(s, [
    "先把数组**建成最大堆**，再反复把**堆顶与堆尾交换**、缩小堆，把新堆顶**筛下去**。",
    "`sift_down` 必须比较**左右两个孩子**，与较大者交换。",
    "每取一次，就把一个最大值放进后面已排好的那一段——**不需要额外数组**。",
  ], 0.5, 3.4, 5.6, 1.7, { fontSize: 12, gap: 7 });
  callout(s, "代价", "建堆 O(n)（5.5.1a 证过）＋ n−1 次筛选各 O(log n) = **O(n log n)**，**最坏也有保证**。空间 Θ(1)；**不稳定**。", 6.35, 3.4, 3.15, 1.7, { fontSize: 10.5 });
}

// 8.3.2 heap code
{
  const s = content("8.3.2", "8.3 选择排序 · 堆排序 · modern.hpp", "sift_down 与 heap_sort：全手写，不委托标准库");
  codeBlock(s, `// 算法8.4：手写最大堆筛选与堆排序，不委托 std::make_heap/sort_heap。
inline void sift_down(std::vector<int>& values, std::size_t root, std::size_t count) {
    while (root * 2 + 1 < count) {
        std::size_t child = root * 2 + 1;
        if (child + 1 < count && values[child] < values[child + 1]) ++child;
        if (values[root] >= values[child]) return;
        using std::swap;
        swap(values[root], values[child]);
        root = child;
    }
}

inline void heap_sort(std::vector<int>& values) {
    for (std::size_t root = values.size() / 2; root != 0; --root) {
        sift_down(values, root - 1, values.size());
    }
    for (std::size_t end = values.size(); end > 1; --end) {
        using std::swap;
        swap(values[0], values[end - 1]);
        sift_down(values, 0, end - 1);
    }
}`, 0.5, 1.05, 9.0, 3.45, { fontSize: 8.5, hl: [5, 19] });
  const notes = [
    ["第 5 行", "选左右孩子中**较大**的那个"],
    ["建堆", "从最后一个非叶结点 n/2−1 往前筛"],
    ["排序", "堆顶换到 end−1，堆缩小一格再筛"],
  ];
  notes.forEach((n, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.6, 2.85, 0.5, C.cream);
    text(s, n[0], x + 0.1, 4.6, 0.75, 0.5, { fontSize: 10.5, bold: true, color: C.goldText, valign: "middle", margin: 0 });
    text(s, n[1], x + 0.85, 4.6, 1.95, 0.5, { fontSize: 9.5, valign: "middle", margin: 0 });
  });
}

// 8.3.2 heap trace
{
  const s = content("8.3.2", "8.3 选择排序 · 堆排序 · 手算", "heap_sort 逐步：建堆 4 次筛选，排序 7 趟");
  const T = (v) => ({ t: v, mono: true });
  table(s, [
    ["阶段", "数组（堆部分 | 已排好）", "这一步做了什么"],
    ["初始", T("45 34 78 12 34′ 32 29 64"), ""],
    ["筛 root=3", T("45 34 78 64 34′ 32 29 12"), "12 < 64，交换"],
    ["筛 root=2", T("45 34 78 64 34′ 32 29 12"), "78 ≥ 32，不动"],
    ["筛 root=1", T("45 64 78 34 34′ 32 29 12"), "34 与 64 交换；再看 12，停"],
    [{ t: "筛 root=0", bold: true }, { t: "78 64 45 34 34′ 32 29 12", mono: true, bold: true, color: C.green }, { t: "45 与 78 交换 → 最大堆", bold: true, color: C.green }],
    ["end=8", T("64 34 45 12 34′ 32 29 | 78"), "12 上顶，筛到下标 1"],
    ["end=7", T("45 34 32 12 34′ 29 | 64 78"), "29 上顶，筛到下标 5"],
    [{ t: "end=6", fill: C.cream }, { t: "34 34′ 32 12 29 | 45 64 78", mono: true, fill: C.cream }, { t: "29 被 34、34′ 依次顶上", fill: C.cream }],
    [{ t: "end=5", fill: RED }, { t: "34′ 29 32 12 | 34 45 64 78", mono: true, fill: RED, bold: true }, { t: "堆顶 34 被换到下标 4", fill: RED, color: C.bad, bold: true }],
    ["end=4", T("32 29 12 | 34′ 34 45 64 78"), ""],
    ["end=3", T("29 12 | 32 34′ 34 45 64 78"), ""],
    ["end=2", T("12 | 29 32 34′ 34 45 64 78"), { t: "结果 34′ 在 34 前", color: C.bad, bold: true }],
  ], 0.5, 1.0, 6.6, [1.0, 3.2, 2.4], { fontSize: 8.5, rowH: 0.28, tight: true });
  callout(s, "⚠ 不稳定就发生在这里", "end=6 时 34 在堆顶、34′ 在下标 1；end=5 时**堆顶 34 被一次远距离交换**送进已排好区，34′ 留在前面，最后落在 34 之前。\n\n这就是习题 2「举一个使堆排序打乱相等键次序的例子」的答案之一。", 7.3, 1.02, 2.2, 4.08, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// ============================ 8.4 ============================
sectionSlide("8.4", "交换排序", "发现逆置就交换，直到没有逆置为止\n冒泡排序 · 快速排序 · 深递归与小区间两处优化");

// 8.4.1 bubble concept
{
  const s = content("8.4.1", "8.4 交换排序 · 冒泡排序", "冒泡：只比较相邻两个，逆序就交换");
  bullets(s, [
    "交换排序的思想：**两两比较**关键码，发现逆置就交换，直到没有逆置对为止。",
    "冒泡排序不停地比较**相邻**两个记录，一趟走完，最大（或最小）的那个必然被顶到一端——像气泡从水底冒上来。",
    "原书从数组末端往前比，每趟把**最小**的推到最左；本书从前往后比，每趟把**最大**的顶到最右。原书自己也说「取决于编程人员的个人喜好」，两种写法对称等价。",
    "关键优化（原书算法 8.5 已有）：记一个「**本趟有没有交换**」的标志，没有就说明已经有序，立刻结束。",
  ], 0.5, 1.1, 5.7, 4.0, { fontSize: 12.5, gap: 10 });
  card(s, 6.4, 1.05, 3.1, 4.05, C.code);
  image(s, "fig-8-5", 6.5, 1.2, 2.9, 3.4);
  caption(s, "图 8.5 冒泡排序（原书：最小者推到最左）", 6.4, 4.7, 3.1);
}

// 8.4.1 bubble code + trace
{
  const s = content("8.4.1", "8.4 交换排序 · 冒泡排序 · modern.hpp", "bubble_sort：本趟无交换即结束");
  codeBlock(s, `// 算法8.5：带“本趟无交换即结束”优化的冒泡排序。
inline void bubble_sort(std::vector<int>& values) {
    for (std::size_t end = values.size(); end > 1; --end) {
        bool changed = false;
        for (std::size_t index = 1; index < end; ++index) {
            if (values[index] < values[index - 1]) {
                using std::swap;
                swap(values[index], values[index - 1]);
                changed = true;
            }
        }
        if (!changed) return;
    }
}`, 0.5, 1.05, 4.95, 2.7, { fontSize: 8.5, hl: [6, 12] });
  table(s, [
    ["", "0", "1", "2", "3", "4", "5", "6", "7"],
    seqRow("初始", [45, 34, 78, 12, "34′", 32, 29, 64]),
    seqRow("第1趟", [34, 45, 12, "34′", 32, 29, 64, 78], { 7: GRN }),
    seqRow("第2趟", [34, 12, "34′", 32, 29, 45, 64, 78], { 6: GRN }),
    seqRow("第3趟", [12, 34, 32, 29, "34′", 45, 64, 78], { 5: GRN }),
    seqRow("第4趟", [12, 32, 29, 34, "34′", 45, 64, 78], { 4: GRN }),
    seqRow("第5趟", [12, 29, 32, 34, "34′", 45, 64, 78], { 3: GRN }),
    seqRow("第6趟", [12, 29, 32, 34, "34′", 45, 64, 78], {}),
  ], 5.65, 1.05, 3.85, [0.65, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4], { fontSize: 9.5, rowH: 0.33, tight: true });
  text(s, "第 6 趟一次交换都没有 → 结束。绿色：本趟被顶到位的最大者。", 5.65, 3.75, 3.85, 0.5, { fontSize: 9.5, color: C.muted });
  callout(s, "稳定：只有严格小于才交换", "相等的两个元素永远不会互换位置——第 3、4 趟里 34 往左走，34′ 也在走，但始终「34 在前」。\n**把 `<` 写成 `<=`，稳定性当场消失**，这是最容易犯的错。", 0.5, 3.9, 4.95, 1.2, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  callout(s, "代价", "最好 Θ(n)（有序，第一趟就退出）；最坏逆序 n(n−1)/2 = Θ(n²)。", 5.65, 4.3, 3.85, 0.8, { fontSize: 10 });
}

// 8.4.2 quicksort concept
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序", "快速排序：分、治，不用合");
  bullets(s, [
    "Tony Hoare，1962 年；被评为 **20 世纪十大算法**之一，平均 Θ(n log n)。",
    "① 从序列中任选一个记录 k 作**轴值**（pivot）；",
    "② 把其余记录**分割**（partition）成左子序列 L 和右子序列 R；",
    "③ L 中都 ≤ k、R 中都 ≥ k，于是 **k 正好在最终位置**；",
    "④ 对 L、R 递归，直到子序列只含 0 或 1 个元素。",
    "轴值已到位，L 的记录再也不会跑到 k 右边——**不需要明显的「合」**，这是它与归并最大的区别。",
  ], 0.5, 1.1, 5.4, 4.0, { fontSize: 12.5, gap: 8 });
  card(s, 6.1, 1.05, 3.4, 2.75, C.code);
  image(s, "fig-8-6", 6.2, 1.12, 3.2, 2.35);
  caption(s, "图 8.6 快速排序图示", 6.1, 3.47, 3.4);
  callout(s, "看成一棵二叉树", "轴值是子根，L、R 是左右子树；**中序遍历**收集轴值和叶子，就是排序结果。", 6.1, 3.95, 3.4, 1.15, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// pivot choice
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序", "轴值怎么选，影响很大");
  card(s, 0.5, 1.1, 4.35, 2.55, RED);
  text(s, "✗ 选第一个或最后一个记录", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  text(s, "输入恰好**正序或逆序**时，每次分割都把剩余记录全分到一边，另一边为空——分治法根本起不到作用。\n递归深度 n，时间 **Θ(n²)**。", 0.7, 1.65, 4.0, 1.9, { fontSize: 11.5, lsm: 1.15 });
  card(s, 5.15, 1.1, 4.35, 2.55, GRN);
  text(s, "✓ 选中间点 (start + end) / 2", 5.35, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  text(s, "正序或逆序输入时**正好平分**序列，实验效果非常好。\n实务中的快排一定要配**三数取中**或**随机枢轴**。", 5.35, 1.65, 4.0, 1.9, { fontSize: 11.5, lsm: 1.15 });
  callout(s, "本书的实现", [
    "选**区间末元素**为枢轴，把更小的元素换到左侧，再递归两边。",
    "硬要求：**全相等的输入必须也能结束**。",
  ], 0.5, 3.85, 4.35, 1.25, { fontSize: 10.5, gap: 3 });
  callout(s, "等于轴值的记录怎么办？", "快排本来就不稳定，处理方法有多种。原书算法 8.6 注释：`<=` 也可以改写为 `<`，但增加记录移动——**两种都对，差别只在移动次数**。", 5.15, 3.85, 4.35, 1.25, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// fig 8.7 partition walkthrough
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序 · 原书的分割", "图 8.7：两端交替找空闲位置，把逆置记录移过去");
  card(s, 0.5, 1.05, 3.6, 4.05, C.code);
  image(s, "fig-8-7", 0.6, 1.1, 3.4, 3.95);
  const steps = [
    ["准备", "轴值 32 与**末记录交换**并存入临时变量 → 末位成了**空闲位置**（方框）。"],
    ["l 向右", "越过 ≤ 轴值的，停在 34（> 32），把它**放到空闲位 r**；l 处空出。"],
    ["r 向左", "从 r 前面找 < 轴值的，停在 29，把它**放到空闲位 l**；r 处空出。"],
    ["交替", "如此循环，直到 l、r **相遇**，整个序列扫描完毕。"],
    ["回填", "此时空闲位置**正是轴值的正确位置**，回填 32：左边都小、右边都大。"],
  ];
  steps.forEach((st, i) => {
    const y = 1.06 + i * 0.62;
    numCircle(s, i + 1, 4.35, y + 0.04, 0.36, i === 4 ? C.goldText : C.green);
    text(s, st[0], 4.8, y, 0.85, 0.5, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, st[1], 5.65, y, 3.85, 0.6, { fontSize: 10.5, margin: 0 });
  });
  callout(s, "分割是快排的全部工作量", "一次 O(n) 的线性扫描。**分得均不均匀决定递归有多深**：每次平分 O(n log n)，每次只切下一个元素 O(n²)。另一种写法是 l、r 各停在逆置记录上**直接交换**。", 4.35, 4.05, 5.15, 1.08, { fontSize: 10 });
}

// partition code
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序 · modern.hpp", "本书的 partition：末元素当轴，一趟扫描");
  codeBlock(s, `inline std::size_t partition(std::vector<int>& values, std::size_t first, std::size_t last) {
    const int pivot = values[last - 1];
    std::size_t boundary = first;
    for (std::size_t index = first; index + 1 < last; ++index) {
        if (values[index] < pivot) {
            using std::swap;
            swap(values[boundary], values[index]);
            ++boundary;
        }
    }
    using std::swap;
    swap(values[boundary], values[last - 1]);
    return boundary;
}`, 0.5, 1.05, 9.0, 2.5, { fontSize: 9, hl: [5, 12] });
  const inv = [
    ["[first, boundary)", "都 < pivot"],
    ["[boundary, index)", "都 ≥ pivot"],
    ["last − 1", "pivot 本身"],
  ];
  text(s, "循环不变式（区间左闭右开）", 0.5, 3.7, 4.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  inv.forEach((r, i) => {
    const y = 4.05 + i * 0.36;
    pill(s, r[0], 0.5, y, 2.0, 0.3, i === 2 ? C.goldText : C.green, C.white, 9.5);
    text(s, r[1], 2.6, y, 2.3, 0.3, { fontSize: 11, valign: "middle", margin: 0 });
  });
  callout(s, "要点", [
    "扫描结束，把 pivot 换到 `boundary`：左边都更小，右边都不小于它。",
    "等于 pivot 的都留在右侧；全相等时每次切下一个，**一定结束**（只是 Θ(n²)）。",
  ], 5.1, 3.7, 4.4, 1.4, { fontSize: 10.5, gap: 4 });
}

// Lomuto trace
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序 · 手算", "partition 手算：demo 数据 [3, −2, 7, 3′, 0, −2′, 9, 1]，轴 = 1");
  table(s, [
    ["index", "values[index]", "< 1 ?", "数组（下标 0…7）", "boundary"],
    ["0", "3", "否", { t: "3 -2 7 3′ 0 -2′ 9 1", mono: true }, "0"],
    ["1", "-2", { t: "是，与 [0] 交换", color: C.green }, { t: "-2 3 7 3′ 0 -2′ 9 1", mono: true }, "1"],
    ["2", "7", "否", { t: "-2 3 7 3′ 0 -2′ 9 1", mono: true }, "1"],
    ["3", "3′", "否", { t: "-2 3 7 3′ 0 -2′ 9 1", mono: true }, "1"],
    ["4", "0", { t: "是，与 [1] 交换", color: C.green }, { t: "-2 0 7 3′ 3 -2′ 9 1", mono: true }, "2"],
    ["5", "-2′", { t: "是，与 [2] 交换", color: C.green }, { t: "-2 0 -2′ 3′ 3 7 9 1", mono: true }, "3"],
    ["6", "9", "否", { t: "-2 0 -2′ 3′ 3 7 9 1", mono: true }, "3"],
    [{ t: "收尾", bold: true, fill: C.cream }, { t: "", fill: C.cream }, { t: "[3] ↔ [7]", fill: C.cream }, { t: "-2 0 -2′ 1 3 7 9 3′", mono: true, bold: true, fill: C.cream }, { t: "返回 3", bold: true, fill: C.cream }],
  ], 0.5, 1.05, 6.4, [0.7, 1.1, 1.45, 2.25, 0.9], { fontSize: 10, rowH: 0.34, tight: true });
  text(s, "此后递归 [0,3) 与 [4,8)，最终得到：", 0.5, 4.2, 6.4, 0.3, { fontSize: 11 });
  text(s, "-2′  -2  0  1  3′  3  7  9", 0.5, 4.52, 6.4, 0.45, { fontSize: 16, bold: true, fontFace: MONO, color: C.bad, margin: 0 });
  callout(s, "⚠ 相等键被打乱了", "[0,3) 以 −2′ 为轴：没有更小的，−2′ 被换到下标 0，**越过了 −2**。\n[4,8) 以 3′ 为轴，同样把 3′ 换到 3 前面。\n\n这就是 demo 那句「快排不保证」：输出看起来一样，是因为 int 看不出谁是谁。", 7.1, 1.05, 2.4, 4.05, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// quick_sort_range + analysis
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序 · 代价分析", "quick_sort_range 与三种情况的代价");
  codeBlock(s, `inline void quick_sort_range(std::vector<int>& values, std::size_t first, std::size_t last) {
    if (last - first < 2) return;
    const std::size_t middle = partition(values, first, last);
    quick_sort_range(values, first, middle);
    quick_sort_range(values, middle + 1, last);
}

// 算法8.6：手写快排。
inline void quick_sort(std::vector<int>& values) { quick_sort_range(values, 0, values.size()); }`, 0.5, 1.05, 9.0, 1.75, { fontSize: 9 });
  const cols = [
    ["最差", C.bad, RED, "每次只切下一个元素：Θ(n) 次分割 → 时间 **Θ(n²)**；每层栈上存一个轴值 → 空间 **Θ(n)**。"],
    ["最好", C.ok, GRN, "每次恰好平分：\n`T(n) = 2T(n/2) + cn`\n同除以 n 逐层叠加（log n 层）→ **Θ(n log n)**。"],
    ["平均", C.dark, C.code, "轴值落在各位置概率都是 1/n：\n`T(n) = cn + (2/n)ΣT(k)`\n相减、同除 n(n+1)、叠加 → **Θ(n log n)**，空间 **Θ(log n)**。"],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 2.95, 2.85, 2.15, c[2]);
    text(s, c[0], x + 0.15, 3.02, 2.5, 0.35, { fontSize: 14, bold: true, color: c[1], margin: 0 });
    text(s, c[3], x + 0.15, 3.42, 2.6, 1.65, { fontSize: 10, margin: 0, lsm: 1.1 });
  });
}

// python crash
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序 · modern.py", "同一个缺陷：Python 里真的崩，C++ 里只是慢");
  codeBlock(s, `def quick_sort_range(values: list[int], first: int, last: int) -> None:
    if last - first < 2:
        return
    middle = partition(values, first, last)
    quick_sort_range(values, first, middle)
    quick_sort_range(values, middle + 1, last)


# 算法8.6：手写快排。
#
# **这一版在 Python 里会真的崩，而在 C++ 里只是慢**：末元素当轴，遇到已排好序的
# 输入就退化成 n 层递归。C++ 有 8 MB 栈，几万层才炸；CPython 的递归上限默认是
# 1000 层，一千个有序元素就抛 RecursionError。同一个算法缺陷，两种语言的暴露
# 阈值差两个数量级——8.7 的「短侧递归」因此在 Python 里不是优化，是能不能跑。
# test.py 里有断言把这两件事都钉住。
def quick_sort(values: list[int]) -> None:
    quick_sort_range(values, 0, len(values))`, 0.5, 1.05, 6.4, 3.15, { fontSize: 8.5, lang: "py" });
  card(s, 7.1, 1.05, 2.4, 1.3, C.code);
  text(s, "C++", 7.25, 1.1, 2, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  text(s, "默认 8 MB 栈\n几万层才炸", 7.25, 1.42, 2.2, 0.85, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
  card(s, 7.1, 2.45, 2.4, 1.75, RED);
  text(s, "CPython", 7.25, 2.5, 2, 0.3, { fontSize: 11, bold: true, color: C.bad, margin: 0 });
  text(s, "递归上限 1000 层\n两千个有序元素就抛 RecursionError", 7.25, 2.82, 2.2, 1.3, { fontSize: 11.5, bold: true, color: C.bad, margin: 0 });
  callout(s, "结论", "暴露阈值差**两个数量级**。下一页「只对较短的一侧递归」：在 C++ 里是省栈，在 Python 里是**能不能跑完**。", 0.5, 4.35, 9.0, 0.75, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// optimized quicksort
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序 · modern.hpp", "原书算法 8.7 的两处对策：短侧递归 + 小区间插入");
  codeBlock(s, `inline void quick_sort_optimized_range(std::vector<int>& values, std::size_t first, std::size_t last) {
    while (last - first > 16) {
        const std::size_t middle = partition(values, first, last);
        if (middle - first < last - middle - 1) {
            quick_sort_optimized_range(values, first, middle);
            first = middle + 1;
        } else {
            quick_sort_optimized_range(values, middle + 1, last);
            last = middle;
        }
    }
    for (std::size_t index = first + 1; index < last; ++index) {
        const int value = values[index];
        std::size_t hole = index;
        while (hole != first && value < values[hole - 1]) {
            values[hole] = values[hole - 1];
            --hole;
        }
        values[hole] = value;
    }
}

inline void quick_sort_optimized(std::vector<int>& values) {
    quick_sort_optimized_range(values, 0, values.size());
}`, 0.5, 1.05, 9.0, 4.05, { fontSize: 8.5, hl: [2, 4, 5, 6] });
  callout(s, "① 递归太深 → 只递归短侧", "较短的一侧递归，较长的一侧改成循环。每次递归的区间至少减半 → 深度 **O(log n)**。", 6.35, 1.5, 3.05, 1.55, { fontSize: 10 });
  callout(s, "② 小区间 → 插入排序", "只剩十几个元素时，调用与划分的固定开销超过收益。本书阈值 **16**；原书按表 8.4 取 28。阈值在不同环境下得到过 9、16、28——**要在自己的机器上重测**。", 6.35, 3.15, 3.05, 1.85, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// optimization can't fix worst case
{
  const s = content("8.4.2", "8.4 交换排序 · 快速排序", "两处优化管的是栈深与常数，管不了最坏时间");
  text(s, "2 万个**已经排好序**的数（8.7.2 节实测，单位毫秒）：", 0.5, 1.05, 9, 0.35, { fontSize: 13 });
  card(s, 0.5, 1.55, 4.35, 2.1, RED);
  text(s, "优化快排", 0.7, 1.65, 3, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  text(s, "105.9", 0.7, 2.05, 4, 0.8, { fontSize: 40, bold: true, color: C.bad, margin: 0 });
  text(s, "枢轴仍取末元素：有序输入每次划分都最坏，Θ(n²) 次比较", 0.7, 2.9, 4, 0.65, { fontSize: 10.5, margin: 0 });
  card(s, 5.15, 1.55, 4.35, 2.1, GRN);
  text(s, "直接插入", 5.35, 1.65, 3, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  text(s, "0.0", 5.35, 2.05, 4, 0.8, { fontSize: 40, bold: true, color: C.ok, margin: 0 });
  text(s, "有序输入内层循环一次都不进，Θ(n)", 5.35, 2.9, 4, 0.65, { fontSize: 10.5, margin: 0 });
  callout(s, "快排在这种输入上比 Θ(n²) 的插入排序还慢", "想根治得换**枢轴策略**（三数取中、随机枢轴）——那是习题里的事。原书的实现取中间点作轴值，所以原书的实验里「快排正序和逆序一样快」；**同一个算法，选轴策略不同，对输入形态的反应可以完全相反**。", 0.5, 3.85, 9.0, 1.25, { fontSize: 11 });
}

// ============================ 8.5 ============================
sectionSlide("8.5", "归并排序", "对半切，力气全花在「合」上\n两路归并 · 稳定性来自一个 < · 两处优化 · 逆序对计数");

// 8.5 concept
{
  const s = content("8.5", "8.5 归并排序", "归并排序：分得随意，合得用心");
  bullets(s, [
    "① 把序列划分成两个子序列；② 分别递归归并排序；③ 把两个有序子序列**合并**成一个。",
    "合并：每次比较两个子序列的头，取较小的进入结果，其后的记录顶上来，继续比较。",
    "区间长度小于 2 时已经有序，递归停止。每层合并共扫描 n 个元素：",
  ], 0.5, 1.1, 5.4, 2.1, { fontSize: 12.5, gap: 8 });
  card(s, 0.5, 3.1, 5.4, 0.55, C.dark);
  text(s, "T(n) = 2T(n/2) + Θ(n) = Θ(n log n)", 0.5, 3.1, 5.4, 0.55, { fontSize: 15, bold: true, color: C.gold, align: "center", valign: "middle", fontFace: MONO });
  table(s, [
    ["", "快速排序", "归并排序"],
    ["分", "用轴值分割（全部工作量）", "对半切，常数时间"],
    ["合", "不需要", "线性归并（全部工作量）"],
    ["最坏", { t: "Θ(n²)", color: C.bad, bold: true }, { t: "Θ(n log n)，不依赖输入", color: C.ok, bold: true }],
  ], 0.5, 3.8, 5.4, [0.7, 2.3, 2.4], { fontSize: 10, rowH: 0.32 });
  card(s, 6.1, 1.05, 3.4, 2.85, C.code);
  image(s, "fig-8-8", 6.2, 1.12, 3.2, 2.4);
  caption(s, "图 8.8 归并排序", 6.1, 3.55, 3.4);
  callout(s, "空间", "只分配**一个**与输入等长的缓冲区，所有递归层复用：辅助 Θ(n)，栈另占 O(log n)。", 6.1, 4.05, 3.4, 1.05, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// merge code
{
  const s = content("8.5", "8.5 归并排序 · modern.hpp", "merge_ranges / merge_sort_range / merge_sort");
  codeBlock(s, `inline void merge_ranges(std::vector<int>& values, std::vector<int>& buffer,
                         std::size_t first, std::size_t middle, std::size_t last) {
    std::size_t left = first;
    std::size_t right = middle;
    std::size_t output = first;
    while (left < middle && right < last) {
        buffer[output++] = values[right] < values[left] ? values[right++] : values[left++];
    }
    while (left < middle) buffer[output++] = values[left++];
    while (right < last) buffer[output++] = values[right++];
    for (std::size_t index = first; index < last; ++index) values[index] = buffer[index];
}

inline void merge_sort_range(std::vector<int>& values, std::vector<int>& buffer,
                             std::size_t first, std::size_t last) {
    if (last - first < 2) return;
    const std::size_t middle = first + (last - first) / 2;
    merge_sort_range(values, buffer, first, middle);
    merge_sort_range(values, buffer, middle, last);
    merge_ranges(values, buffer, first, middle, last);
}

// 算法8.8：两路归并排序。
inline void merge_sort(std::vector<int>& values) {
    std::vector<int> buffer(values.size());
    merge_sort_range(values, buffer, 0, values.size());
}`, 0.5, 1.05, 9.0, 4.1, { fontSize: 8.4, hl: [7] });
  callout(s, "第 7 行", "「右侧**严格更小**才取右侧」：相等先取左侧 → 稳定。原书注释：「为保证稳定性，相等时左边优先」。", 7.1, 2.1, 2.3, 1.6, { fontSize: 10 });
  callout(s, "缓冲区", "`merge_sort` 里一次开够，不在递归里反复申请。", 7.1, 3.85, 2.3, 1.0, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// merge trace
{
  const s = content("8.5", "8.5 归并排序 · 手算", "最后一次合并：(25 32 34 45) + (12 34′ 64 78)");
  table(s, [
    ["步", "左段头", "右段头", "比较", "输出"],
    ["1", "25", "12", "12 < 25，取右", { t: "12", mono: true }],
    ["2", "25", "34′", "34′ < 25？否，取左", { t: "12 25", mono: true }],
    ["3", "32", "34′", "取左", { t: "12 25 32", mono: true }],
    [{ t: "4", fill: C.cream }, { t: "34", bold: true, fill: C.cream }, { t: "34′", bold: true, fill: C.cream }, { t: "34′ < 34？否（相等）→ **取左**", fill: C.cream }, { t: "12 25 32 34", mono: true, fill: C.cream }],
    ["5", "45", "34′", "34′ < 45，取右", { t: "… 34 34′", mono: true }],
    ["6", "45", "64", "取左，左段取完", { t: "… 34 34′ 45", mono: true }],
    ["7", "—", "64 78", "右段剩余照抄", { t: "12 25 32 34 34′ 45 64 78", mono: true, bold: true, color: C.green }],
  ], 0.5, 1.05, 6.2, [0.45, 0.8, 0.8, 2.15, 2.0], { fontSize: 10, rowH: 0.4 });
  text(s, "（两段取自图 8.8 倒数第二行：左 25 32 34 45，右 12 34′ 64 78）", 0.5, 4.35, 6.2, 0.3, { fontSize: 9.5, color: C.muted });
  callout(s, "稳定性的全部来源", "`values[right] < values[left]` 里的这个 `<`：相等取左。写成 `<=` 就取右，**稳定性当场消失**。", 6.95, 1.05, 2.55, 1.85, { fontSize: 10.5 });
  callout(s, "C++ 版验证不了", "`std::vector<int>` 里两个相等的 3 换不换位置，排完一模一样。Python 版能排任何可比较对象：测试用「只按 key 比较、payload 不参与」的记录，检查 payload 是否仍是入场顺序——改成 `<=` 断言就红。", 6.95, 3.0, 2.55, 2.1, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
}

// merge optimized
{
  const s = content("8.5", "8.5 归并排序 · modern.hpp", "原书算法 8.9 的两处优化，本书都实现了");
  codeBlock(s, `inline void merge_sort_optimized_range(std::vector<int>& values, std::vector<int>& buffer,
                                       std::size_t first, std::size_t last) {
    if (last - first <= 16) {
        for (std::size_t index = first + 1; index < last; ++index) {
            const int value = values[index];
            std::size_t hole = index;
            while (hole != first && value < values[hole - 1]) { values[hole] = values[hole - 1]; --hole; }
            values[hole] = value;
        }
        return;
    }
    const std::size_t middle = first + (last - first) / 2;
    merge_sort_optimized_range(values, buffer, first, middle);
    merge_sort_optimized_range(values, buffer, middle, last);
    if (values[middle] < values[middle - 1]) merge_ranges(values, buffer, first, middle, last);
}

inline void merge_sort_optimized(std::vector<int>& values) {
    std::vector<int> buffer(values.size());
    merge_sort_optimized_range(values, buffer, 0, values.size());
}`, 0.5, 1.05, 9.0, 3.07, { fontSize: 8.5, hl: [3, 15] });
  callout(s, "① 小区间改用直接插入（阈值 16）", "递归到十几个元素时，划分与调用的固定开销超过收益。", 0.5, 4.2, 3.0, 0.93, { fontSize: 10, tsize: 11 });
  callout(s, "② 两段本来就接得上 → 跳过归并", "`values[middle-1] <= values[middle]` 时整趟不归并：有序输入的搬移从 Θ(n log n) 压到接近 Θ(n)；随机输入几乎不命中。", 3.65, 4.2, 5.85, 0.93, { fontSize: 10, tsize: 11, fill: C.mint, tcolor: C.dark });
}

// Sedgewick & more
{
  const s = content("8.5", "8.5 归并排序", "归并还能怎么改进；什么时候选它");
  card(s, 0.5, 1.1, 4.35, 2.4, C.code);
  text(s, "Sedgewick 的监视哨技巧", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  text(s, "复制到临时数组时，**把第二个子数组颠倒过来**。两个子数组从两端向中间推进，彼此成为对方的「监视哨」，循环里不再反复检查子序列是否已经结束。", 0.7, 1.65, 4.0, 1.8, { fontSize: 11, lsm: 1.15 });
  card(s, 5.15, 1.1, 4.35, 2.4, C.code);
  text(s, "与优化快排同一个思路", 5.35, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  text(s, "子数组小于某个长度（原书取 28）时不再递归，最后对整个序列做一次插入排序：各块内部无序，但**整块看是一块块有序的**，整体已基本有序。", 5.35, 1.65, 4.0, 1.8, { fontSize: 11, lsm: 1.15 });
  table(s, [
    ["归并排序", "结论"],
    ["时间", "最大、最小、平均都是 **Θ(n log n)**——对初始排列不敏感，速度稳定"],
    ["空间", "辅助 **Θ(n)**，是简单排序和堆排序没有的代价"],
    ["稳定", "**稳定**；`std::stable_sort` 采用的就是归并排序"],
  ], 0.5, 3.7, 9.0, [1.3, 7.7], { fontSize: 11, rowH: 0.35 });
}

// inversion concept
{
  const s = content("8.5", "8.5 归并排序 · 副产品", "逆序对计数：在合并里多写一句");
  bullets(s, [
    "8.2.1 的逆置：i < j 而 pᵢ > pⱼ。**整趟直接插入的挪位次数 = 逆置数**；总移动 = 逆置数 + 2(n−1)。",
    "照着插入排序去数逆置是 Θ(n²)；归并排序 **Θ(n log n)** 就能数完。",
    "一对逆置要么都在左半段、要么都在右半段（**递归数掉**），要么一左一右（**合并时数**）。",
    "两段各自有序：右段 `values[right]` **严格小于**左段 `values[left]` 时，左段还没输出的 `[left, middle)` 全都比它大 → 一次记 **middle − left** 个。",
    "相等时取左、**不计数**：相等元素不构成逆置——与稳定性来自同一个 `<`。",
  ], 0.5, 1.1, 5.2, 4.0, { fontSize: 11.5, gap: 7 });
  text(s, "手算：[2, 4, 1, 3, 5]，middle = 2", 5.95, 1.05, 3.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["左头", "右头", "动作", "计数"],
    ["2", "1", "1 < 2，取右", { t: "+2", bold: true, color: C.bad }],
    ["2", "3", "取左", ""],
    ["4", "3", "3 < 4，取右", { t: "+1", bold: true, color: C.bad }],
    ["4", "5", "取左", ""],
    ["—", "5", "照抄", ""],
  ], 5.95, 1.4, 3.55, [0.6, 0.6, 1.6, 0.75], { fontSize: 10, rowH: 0.3 });
  text(s, "子段 [2,4] 与 [1,3,5] 自身各 0 个。", 5.95, 3.55, 3.55, 0.3, { fontSize: 10, color: C.muted });
  card(s, 5.95, 3.95, 3.55, 1.15, C.dark);
  text(s, "合计 3", 6.1, 3.98, 3.3, 0.45, { fontSize: 18, bold: true, color: C.gold, margin: 0 });
  text(s, "(2,1) (4,1) (4,3) ✓", 6.1, 4.45, 3.3, 0.5, { fontSize: 13, color: C.white, margin: 0, fontFace: MONO });
}

// inversion code 1
{
  const s = content("8.5", "8.5 归并排序 · 逆序对 · modern.hpp", "merge_count_ranges：与 merge_ranges 同一个合并");
  codeBlock(s, `// 归并排序的副产品（原书无清单）：逆置（逆序对）计数，Θ(n log n)。
// 与 merge_ranges 同一个合并过程，只多一句计数：右段的 values[right] 严格小于
// 左段的 values[left] 时，左段还没输出的 [left, middle) 都比它大，一次记 middle - left 个。
// 相等时取左边、不计数——相等元素不构成逆置，这与稳定性是同一个 \`<\`。
inline std::uint64_t merge_count_ranges(std::vector<int>& values, std::vector<int>& buffer,
                                        std::size_t first, std::size_t middle, std::size_t last) {
    std::uint64_t inversions = 0;
    std::size_t left = first;
    std::size_t right = middle;
    std::size_t output = first;
    while (left < middle && right < last) {
        if (values[right] < values[left]) {
            inversions += middle - left;
            buffer[output++] = values[right++];
        } else {
            buffer[output++] = values[left++];
        }
    }
    while (left < middle) buffer[output++] = values[left++];
    while (right < last) buffer[output++] = values[right++];
    for (std::size_t index = first; index < last; ++index) values[index] = buffer[index];
    return inversions;
}`, 0.5, 1.05, 9.0, 3.75, { fontSize: 8.5, hl: [12, 13] });
  text(s, "与 `merge_ranges` 相比只多了第 13 行；写成闭区间 [i, mid] 就是常见的 **mid − i + 1**。", 0.5, 4.85, 9.0, 0.3, { fontSize: 11 });
}

// inversion code 2
{
  const s = content("8.5", "8.5 归并排序 · 逆序对 · modern.hpp", "count_inversions：计数不顺手排序；结果必须 64 位");
  codeBlock(s, `inline std::uint64_t count_inversions_range(std::vector<int>& values, std::vector<int>& buffer,
                                            std::size_t first, std::size_t last) {
    if (last - first < 2) return 0;
    const std::size_t middle = first + (last - first) / 2;
    return count_inversions_range(values, buffer, first, middle)
         + count_inversions_range(values, buffer, middle, last)
         + merge_count_ranges(values, buffer, first, middle, last);
}

// 按值传参：函数在自己的副本上归并，调用方的序列原样不动（计数是查询，不该顺手排序）。
// 调用方若本来就要排序，写 count_inversions(std::move(v)) 即可省掉这次拷贝。
// 返回 64 位：逆置数最多 n(n-1)/2，n >= 65537 时就超过 INT_MAX，用 int 累加是有符号溢出。
inline std::uint64_t count_inversions(std::vector<int> values) {
    std::vector<int> buffer(values.size());
    return count_inversions_range(values, buffer, 0, values.size());
}`, 0.5, 1.05, 9.0, 2.75, { fontSize: 8.5, hl: [13] });
  callout(s, "计数不顺手排序", "C++ 按值传参、在副本上归并；本来就要排序的调用方写 `std::move(v)` 省掉拷贝。Python 版先 `list(values)` 再归并。", 0.5, 3.95, 4.35, 1.15, { fontSize: 10 });
  callout(s, "⚠ 结果必须是 64 位", "n = 70000 的递减序列应得 **2449965000**：累加器写成 `int`，UBSan 报有符号溢出，`-O2` 悄悄给错数。OJ 上就是「答案开 long long」。", 5.15, 3.95, 4.35, 1.15, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// variants
{
  const s = content("8.5", "8.5 归并排序 · 逆序对", "变形题与另一条路");
  card(s, 0.5, 1.1, 4.35, 4.0, C.code);
  text(s, "变形题（留作练习）", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  text(s, "求满足 i < j 且 aᵢ + aⱼ > bᵢ + bⱼ 的对数。", 0.7, 1.65, 4, 0.5, { fontSize: 11.5, bold: true, margin: 0 });
  bullets(s, [
    "移项：aᵢ − bᵢ > bⱼ − aⱼ；令 cᵢ = aᵢ − bᵢ，条件变成 **cᵢ > −cⱼ**。",
    "仍是「前面的数比后面的某个量大」：合并时拿左段的 cᵢ 去比右段的 −cⱼ（**先用双指针数完，再照常合并**）。",
    "条件等价于 cᵢ + cⱼ > 0，对 i、j 对称，「i < j」其实不起作用——把 c 排序后双指针也能数，可用来对拍。",
  ], 0.65, 2.2, 4.1, 2.85, { fontSize: 11, gap: 6 });
  card(s, 5.15, 1.1, 4.35, 4.0, C.code);
  text(s, "离散化 + 树状数组", 5.35, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "从左到右扫描，把每个值换成它在全体值中的**名次**（离散化）。",
    "树状数组维护「已扫过的值里各名次出现几次」；扫到 aⱼ 时，前面比它大的个数 = 已扫过的个数 − 名次不超过 aⱼ 的个数。",
    "查询与更新都是 O(log n)；相等元素名次相同、落在「不超过」一侧，同样不计入。",
    "可测实现在 `code/ch12/fenwick`。归并法不需要离散化；树状数组法能在**序列动态追加**时继续回答。",
  ], 5.3, 1.65, 4.1, 3.4, { fontSize: 10.5, gap: 5 });
}

// ============================ 8.6 ============================
sectionSlide("8.6", "分配排序和索引排序", "不比较关键码，但要事先知道记录的情况\n桶式排序 · 基数排序（LSD） · 索引排序");

// 8.6 intro
{
  const s = content("8.6", "8.6 分配排序", "跳出比较模型：直接算出每个元素该去哪儿");
  text(s, "比较排序最坏至少 **Ω(n log n)** 次比较（8.7.3）。要突破它，只能**不再比较**，转而利用关键码本身的数字结构——这就是**分配排序**：唯一特征是不需要关键码之间的比较，但**需要事先知道记录序列的一些具体情况**。", 0.5, 1.05, 9.0, 0.95, { fontSize: 12.5, lsm: 1.15 });
  const cs = [
    ["8.6.1 桶式排序", "排序码都落在某个**小区间** [0, m) 里", "m 个计数器，数一遍再累加", C.cream],
    ["8.6.2 基数排序", "值域 m **很大**", "把排序码拆成 d 位，逐位做桶式排序", C.mint],
    ["8.6.3 索引排序", "记录很大，**搬不起**", "只移动指针或下标，不移动记录本身", C.code],
  ];
  cs.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 2.2, 2.85, 2.9, c[3]);
    text(s, c[0], x + 0.15, 2.3, 2.6, 0.4, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    text(s, "什么情况", x + 0.15, 2.85, 2.6, 0.3, { fontSize: 10, bold: true, color: C.goldText, margin: 0 });
    text(s, c[1], x + 0.15, 3.15, 2.6, 0.6, { fontSize: 11.5, margin: 0 });
    text(s, "怎么做", x + 0.15, 3.85, 2.6, 0.3, { fontSize: 10, bold: true, color: C.goldText, margin: 0 });
    text(s, c[2], x + 0.15, 4.15, 2.6, 0.8, { fontSize: 11.5, margin: 0 });
  });
}

// 8.6.1 bucket
{
  const s = content("8.6.1", "8.6 分配排序 · 桶式排序", "桶式排序：先数一遍，把计数累加成位置");
  text(s, "原书例子：m = 10，序列 {7, 3, 8, 9, 6, 1, 8′, 1′, 2}", 0.5, 1.02, 9, 0.32, { fontSize: 12.5, bold: true, color: C.dark });
  const N = (arr, hl = {}) => arr.map((v, i) => ({ t: String(v), mono: true, align: "center", fill: hl[i], bold: !!hl[i] }));
  table(s, [
    ["取值 i", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    [{ t: "出现次数", bold: true }, ...N([0, 2, 1, 1, 0, 0, 1, 1, 2, 1])],
    [{ t: "累加之后", bold: true }, ...N([0, 2, 3, 4, 4, 4, 5, 6, 8, 9], { 8: C.cream })],
  ], 0.5, 1.4, 9.0, [1.5, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75], { fontSize: 11, rowH: 0.34 });
  text(s, "累加后 `count[i]` 是「≤ i 的元素共有几个」，也就是 **i 的结束位置**。", 0.5, 2.5, 9, 0.32, { fontSize: 11.5 });
  card(s, 0.5, 2.9, 4.6, 2.2, C.code);
  image(s, "fig-8-9", 0.6, 2.95, 4.4, 1.85);
  caption(s, "图 8.9 桶式排序示意图", 0.5, 4.78, 4.6);
  callout(s, "倒着扫：稳定性的唯一来源", "`count[8] == 8`：值 8 占结果下标 6、7。**从原序列尾部往前扫**：先遇到 8′ 放下标 7，后遇到 8 放下标 6——两个 8 的次序不变。正着扫就不稳定了。\n\n先数再累加，只需**一个长度为 n 的辅助数组**，不用 m 条变长的链。", 5.3, 2.9, 4.2, 2.2, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// counting sort code
{
  const s = content("8.6.1", "8.6 分配排序 · 桶式排序 · modern.hpp", "counting_sort：与原书不同的三处");
  codeBlock(s, `// 算法8.10：桶式（计数）排序，支持负数但不适合巨大稀疏值域。
inline void counting_sort(std::vector<int>& values) {
    if (values.empty()) return;
    int low = values[0];
    int high = values[0];
    for (int value : values) { if (value < low) low = value; if (high < value) high = value; }
    const auto range = static_cast<unsigned long long>(static_cast<long long>(high) - low + 1);
    if (range > counting_range_limit) throw std::invalid_argument("counting sort value range is too sparse");
    std::vector<std::size_t> counts(static_cast<std::size_t>(range), 0);
    for (int value : values) ++counts[static_cast<std::size_t>(value - low)];
    std::size_t output = 0;
    for (std::size_t bucket = 0; bucket < counts.size(); ++bucket) {
        while (counts[bucket]-- != 0) values[output++] = static_cast<int>(bucket) + low;
    }
}`, 0.5, 1.05, 9.0, 2.35, { fontSize: 8.5, hl: [7, 8, 13] });
  callout(s, "① 不要求下界为 0", "先扫出实际的 [low, high]，按 `value − low` 计数；负数不用调用者先平移。C++ 必须先转 `long long`：`high − low + 1` 在 int 里自己就会溢出。", 0.5, 3.55, 2.9, 1.55, { fontSize: 10 });
  callout(s, "② 值域太稀疏直接抛异常", "时间、空间都是 **Θ(m + n)**，m 是值域长度。排 10 个数、值域 [0, 10⁹)，会分配十亿个计数器。m > 10⁷ 抛 `invalid_argument`——当场失败好过拖垮机器。", 3.55, 3.55, 2.9, 1.55, { fontSize: 10, fill: RED, tcolor: C.bad });
  callout(s, "③ 重建取值 ≠ 搬移记录", "本书按计数**重建取值**；对纯整数输出一样。带卫星数据（学号、姓名）时，必须回到原书写法：**倒序扫描 + 搬移原记录**。", 6.6, 3.55, 2.9, 1.55, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// bucket cost
{
  const s = content("8.6.1", "8.6 分配排序 · 桶式排序", "桶式排序只在 m 较小时才有实际意义");
  table(s, [
    ["值域长度 m", "时间 Θ(m + n)", "评价"],
    ["m = Θ(n)", { t: "Θ(n)", bold: true, color: C.ok }, "相对比较排序的**一次飞跃**"],
    ["m = Θ(n log n)", { t: "Θ(n log n)", bold: true }, "没有优势，还倒贴 Θ(m + n) 空间"],
    ["m = Θ(n²)", { t: "Θ(n²)", bold: true, color: C.bad }, "不如比较排序"],
  ], 0.5, 1.1, 5.6, [1.6, 1.5, 2.5], { fontSize: 11.5, rowH: 0.45 });
  text(s, "时间：扫一遍计数 + 累加 m 个计数器 + 输出循环 n 次；空间：m 个计数器 + 长度 n 的临时数组。", 0.5, 3.1, 5.6, 0.6, { fontSize: 11, color: C.muted });
  callout(s, "判断能不能用，看 m 与 n 的比值", "这也正是下一节要把**大值域拆成若干小值域**的原因。", 0.5, 3.85, 5.6, 1.25, { fontSize: 11.5 });
  callout(s, "Python 版的差别", "Python 整数没有宽度，`high − low + 1` 溢出的坑不存在——**但值域上限的检查一条都不能少**：它挡的是**内存**，不是溢出。", 6.35, 1.1, 3.15, 2.2, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "分配排序天然稳定", "同一个桶里的记录按进桶顺序出桶，从头到尾没有任何一次比较能打乱它们（前提：收集方式保持入桶顺序）。", 6.35, 3.45, 3.15, 1.65, { fontSize: 10.5 });
}

// 8.6.2 radix intro
{
  const s = content("8.6.2", "8.6 分配排序 · 基数排序", "基数排序：把排序码拆成 d 位；MSD 与 LSD");
  bullets(s, [
    "值域 m 很大时，把排序码**按进制的基数**拆开：0～9999 可拆成千、百、十、个位。",
    "排序码 K = (k_(d−1), …, k₁, k₀)；k_(d−1) 最高位，k₀ 最低位。子码可以是不同类型：扑克牌 =（花色，面值）。",
    "基数 r：十进制 10；二进制串可取 2、4、8、16；字符串取 26。",
    "**MSD**（高位优先）：先按最高位分成子序列，再对每个子序列按次高位分……——分、分、⋯、分、收，**递归分治**。",
    "**LSD**（低位优先）：从最低位开始，每趟分配、收集——分、收；⋯；分、收。**本节都讨论 LSD。**",
  ], 0.5, 1.05, 5.5, 3.0, { fontSize: 11, gap: 5 });
  card(s, 0.5, 4.15, 5.5, 0.95, C.code);
  s.addText([
    { text: "扑克 S3 HJ C8 H9 S9 D3 CA D7", options: { bold: true, color: C.dark, breakLine: true } },
    { text: "MSD：C8 CA D3 D7 HJ H9 S3 S9 → C8 CA D3 D7 H9 HJ S3 S9", options: { breakLine: true } },
    { text: "LSD：S3 D3 D7 C8 H9 S9 HJ CA → C8 CA D3 D7 H9 HJ S3 S9", options: {} },
  ], { x: 0.65, y: 4.2, w: 5.3, h: 0.85, fontFace: FONT, fontSize: 9.5, color: C.text, margin: 0, isTextBox: true, valign: "middle" });
  card(s, 6.2, 1.05, 3.3, 2.65, C.code);
  image(s, "fig-8-10", 6.3, 1.1, 3.1, 2.55);
  callout(s, "为什么计算机用 LSD", "MSD 分完还要处理各子集，桶数随位数指数增长；LSD 速度快、便于统一处理——前提是**每一趟都稳定**。", 6.2, 3.8, 3.3, 1.3, { fontSize: 10 });
}

// LSD example
{
  const s = content("8.6.2", "8.6 分配排序 · 基数排序", "LSD 走一遍：{97, 53, 88, 59, 26, 41, 88′, 31, 22}，d=2，r=10");
  card(s, 0.5, 1.05, 3.9, 4.05, C.code);
  image(s, "fig-8-11", 0.6, 1.1, 3.7, 3.65);
  caption(s, "图 8.11 顺序存储：每趟桶式排序搬进辅助数组", 0.5, 4.75, 3.9);
  const R = (label, arr, hl = {}) => [{ t: label, bold: true }, ...arr.map((v, i) => ({ t: String(v), mono: true, align: "center", fill: hl[i], bold: !!hl[i] }))];
  table(s, [
    ["", "0", "1", "2", "3", "4", "5", "6", "7", "8"],
    R("初始", [97, 53, 88, 59, 26, 41, "88′", 31, 22], { 2: C.cream, 6: C.cream }),
    R("按个位", [41, 31, 22, 53, 26, 97, 88, "88′", 59], { 6: C.cream, 7: C.cream }),
    R("按十位", [22, 26, 31, 41, 53, 59, 88, "88′", 97], { 6: GRN, 7: GRN }),
  ], 4.6, 1.05, 4.9, [0.85, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45], { fontSize: 10, rowH: 0.36 });
  bullets(s, [
    "第一趟按**个位**分配收集：41 31 | 22 | 53 | 26 | 97 | 88 88′ | 59。",
    "第二趟按**十位**：十位相同的 22、26 之间，保持了第一趟排好的个位次序。",
    "88 与 88′ 始终保持原来的先后——**每一趟都必须稳定**，否则低位排好的次序会被高位那趟打乱。",
  ], 4.6, 2.65, 4.9, 2.45, { fontSize: 11, gap: 7 });
}

// radix C++
{
  const s = content("8.6.2", "8.6 分配排序 · 基数排序 · modern.hpp", "radix_sort：按字节 4 趟，翻转符号位");
  codeBlock(s, `// 算法8.11：LSD 基数排序。翻转符号位使二补码有符号 int 按无符号序排序。
inline void radix_sort(std::vector<int>& values) {
    std::vector<int> buffer(values.size());
    for (unsigned shift = 0; shift < 32; shift += 8) {
        std::size_t counts[256]{};
        for (int value : values) {
            const auto key = static_cast<std::uint32_t>(value) ^ 0x80000000U;
            ++counts[(key >> shift) & 0xffU];
        }
        std::size_t offset = 0;
        for (std::size_t& count : counts) { const std::size_t old = count; count = offset; offset += old; }
        for (int value : values) {
            const auto key = static_cast<std::uint32_t>(value) ^ 0x80000000U;
            buffer[counts[(key >> shift) & 0xffU]++] = value;
        }
        values.swap(buffer);
    }
}`, 0.5, 1.05, 9.0, 2.7, { fontSize: 8.5, hl: [7, 11] });
  callout(s, "为什么异或 0x80000000", "否则负数按无符号序会排到**最大**。翻转符号位后，负数的位模式整体排到正数前面。", 0.5, 3.9, 2.9, 1.2, { fontSize: 10 });
  callout(s, "第 11 行：计数 → 起始位置", "与桶式排序同一招；这里是「起始」偏移，所以正着扫也稳定。", 3.55, 3.9, 2.9, 1.2, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  callout(s, "代价 Θ(d(n + r))", "d = 4 趟，r = 256 个桶。把「值域 m」换成「位数 d 与基数 r」，[0, 2³²) 也排得动。", 6.6, 3.9, 2.9, 1.2, { fontSize: 10 });
}

// radix python
{
  const s = content("8.6.2", "8.6 分配排序 · 基数排序 · modern.py", "本章最值得看的一处语言差异：没有「最高位」");
  codeBlock(s, `# 算法8.11：LSD 基数排序，每趟按 8 位分桶。
# ...
def radix_sort(values: list[int]) -> None:
    if not values:
        return
    shift_base = min(values)
    keys = [value - shift_base for value in values]
    largest = max(keys)
    buffer = [0] * len(keys)
    shift = 0
    while (largest >> shift) > 0 or shift == 0:
        counts = [0] * RADIX_BUCKETS
        for key in keys:
            counts[(key >> shift) & (RADIX_BUCKETS - 1)] += 1
        offset = 0
        for bucket in range(RADIX_BUCKETS):
            counts[bucket], offset = offset, offset + counts[bucket]
        for key in keys:
            digit = (key >> shift) & (RADIX_BUCKETS - 1)
            buffer[counts[digit]] = key
            counts[digit] += 1
        keys, buffer = buffer, keys
        shift += RADIX_BITS
    for index, key in enumerate(keys):
        values[index] = key + shift_base`, 0.5, 1.05, 5.6, 4.05, { fontSize: 8.5, lang: "py", hl: [6, 7, 25] });
  callout(s, "C++ 的技巧在 Python 里不成立", "C++ 的 `int` 是**定长补码**，翻转符号位即可。Python 整数任意精度，**没有「最高位」**：`-1` 的二进制是概念上无限长的 1。", 6.35, 1.05, 3.15, 1.85, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  callout(s, "换一种办法：整体平移", "减去 `min(values)` 平移到非负区间，排完再加回来。代价是多一次 `min` 扫描；换来**不依赖任何机器字长**——对 10³⁰ 一样成立，测试就拿这个规模钉住。", 6.35, 3.05, 3.15, 2.05, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// StaticQueue
{
  const s = content("8.6.2", "8.6 分配排序 · 基数排序 · modern.hpp", "原书代码 8.12：显式的桶——固定容量队列");
  codeBlock(s, `// 代码8.12：固定容量 FIFO，是基数排序的桶而非通用 STL queue 替身。
template <typename T>
class StaticQueue {
public:
    explicit StaticQueue(std::size_t capacity) : data_(capacity), capacity_(capacity) {}
    [[nodiscard]] bool push(const T& value) {
        if (size_ == capacity_) return false;
        data_[(front_ + size_++) % capacity_] = value;
        return true;
    }
    [[nodiscard]] std::optional<T> pop() {
        if (size_ == 0) return std::nullopt;
        T value = data_[front_];
        front_ = (front_ + 1) % capacity_;
        --size_;
        return value;
    }
    [[nodiscard]] bool empty() const noexcept { return size_ == 0; }
private:
    std::vector<T> data_;
    std::size_t capacity_{0};
    std::size_t front_{0};
    std::size_t size_{0};
};`, 0.5, 1.05, 9.0, 4.05, { fontSize: 8.5 });
  card(s, 6.2, 2.05, 3.2, 1.75, C.white, "D5DDD9");
  image(s, "fig-8-12-b", 6.3, 2.1, 3.0, 1.65);
  callout(s, "不是 std::queue 的替身", "容量固定、不扩容：`push` 满了返回 false，`pop` 空了返回 `nullopt`。Python 侧不实现：容量、环绕是**存储管理**。", 6.2, 3.88, 3.2, 1.22, { fontSize: 9.5, tsize: 11 });
}

// radix linked style
{
  const s = content("8.6.2", "8.6 分配排序 · 基数排序 · modern.hpp", "算法 8.13：push 进 256 个桶，按桶号依次 pop");
  codeBlock(s, `// 算法8.13：以显式桶队列演示顺序收集的基数排序。
inline void radix_sort_linked_style(std::vector<int>& values) {
    std::vector<int> buffer(values.size());
    for (unsigned shift = 0; shift < 32; shift += 8) {
        std::vector<StaticQueue<int>> buckets;
        buckets.reserve(256);
        for (std::size_t bucket = 0; bucket < 256; ++bucket) buckets.emplace_back(values.size());
        for (int value : values) {
            const auto key = static_cast<std::uint32_t>(value) ^ 0x80000000U;
            (void)buckets[(key >> shift) & 0xffU].push(value);
        }
        std::size_t output = 0;
        for (auto& bucket : buckets) while (auto value = bucket.pop()) buffer[output++] = *value;
        values.swap(buffer);
    }
}`, 0.5, 1.05, 9.0, 2.6, { fontSize: 8.5, hl: [10, 13] });
  callout(s, "隐式桶 vs 显式桶", "`radix_sort` 把桶做成计数数组（先数、再累加、再放）；这一版更接近「分配—收集」的字面意思，更好懂，代价是每趟维护 256 个队列。", 0.5, 3.8, 3.0, 1.3, { fontSize: 10 });
  callout(s, "结果逐字节相同", "两种写法排出来的结果逐字节相同，测试对拍了这一点。", 3.65, 3.8, 2.7, 1.3, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  callout(s, "Python 用 list 作桶", "稳定性来自「桶内保持入桶顺序、收集时按桶号从小到大」——一个字都没少。", 6.5, 3.8, 3.0, 1.3, { fontSize: 10 });
}

// is radix Θ(n)?
{
  const s = content("8.6.2", "8.6 分配排序 · 基数排序", "基数排序到底是不是 Θ(n) 的？");
  card(s, 0.5, 1.1, 4.35, 2.2, C.code);
  text(s, "看起来是", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  text(s, "Θ(d(n + r))：r 远小于 n 时（r = 10、26 都是常数）忽略 r，得 Θ(d·n)；d 若相对 n 很小，就是 **Θ(n)**。\n**似乎是最快的排序算法——但它不是。**", 0.7, 1.6, 4.0, 1.65, { fontSize: 11, lsm: 1.15 });
  card(s, 5.15, 1.1, 4.35, 2.2, RED);
  text(s, "其实不是", 5.35, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  text(s, "n 个**互不相同**的关键码需要 n 个不同编码：**d ≥ log_r n**，d 不能再当常数。时间变成 **Θ(n log_r n)**；r = 2 时就是 Θ(n log n)——与堆、快排、归并同一量级。", 5.35, 1.6, 4.0, 1.65, { fontSize: 11, lsm: 1.15 });
  callout(s, "「常数时间比较」的默认假设", "32 位 int 的位数几乎都比 log n 大，比较两个长整数理论上是 Ω(log n)，但人们认为整数比较是常数时间——这条假设正是上面那笔账能算出差别的原因。", 0.5, 3.5, 4.35, 1.6, { fontSize: 10.5 });
  callout(s, "一处值得抄下来的工程优化", "r = 2ᵍ 时，取第 i 位不用循环除 i 次，改用位操作：\n`k = ((k & (0xFF << (i*g))) >> (i*g)) % r;`\n原书实测 1M 数据、r = 16：0.6570 s → **0.5532 s**。", 5.15, 3.5, 4.35, 1.6, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 8.6.3 index sort concept
{
  const s = content("8.6.3", "8.6 索引排序", "索引排序：记录一个都不动，动的是索引");
  bullets(s, [
    "前面所有算法都在**搬记录**。记录很大时（一条学籍几百字节、一张图片几兆），搬移代价压过比较代价。",
    "办法：数组元素存**指向记录的指针**（或下标），移动时只动指针。8.6.2 的静态链基数排序也是一种索引排序。",
    "**用空间换时间**；排完再按索引整理原数组，这一步必须 **O(n)**，否则省下的搬移又还回去了。",
  ], 0.5, 1.05, 5.4, 2.4, { fontSize: 11.5, gap: 7 });
  card(s, 6.1, 1.05, 3.4, 1.35, C.code);
  image(s, "fig-8-13", 6.2, 1.1, 3.2, 0.95);
  caption(s, "图 8.13 (a) 排序前 (b) 排序后", 6.1, 2.07, 3.4);
  callout(s, "约定（原书表 8.1 第二种）", "`index[i]` = 结果第 i 位应从原数组哪个下标取值，即 **结果[i] == 原数组[index[i]]**。", 6.1, 2.5, 3.4, 1.0, { fontSize: 9.5 });
  const N = (arr, hl = {}) => arr.map((v, i) => ({ t: String(v), mono: true, align: "center", fill: hl[i], bold: !!hl[i] }));
  table(s, [
    ["原下标 i", "0", "1", "2", "3", "4", "5", "6", "7"],
    [{ t: "排序码", bold: true }, ...N([29, 25, 34, 64, "34′", 12, 32, 45], { 2: C.cream, 4: C.cream })],
    [{ t: "索引 index[i]", bold: true }, ...N([5, 1, 0, 6, 2, 4, 7, 3], { 4: GRN, 5: GRN })],
    [{ t: "按索引取值", bold: true }, ...N([12, 25, 29, 32, 34, "34′", 45, 64])],
  ], 0.5, 3.6, 9.0, [1.8, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9], { fontSize: 11, rowH: 0.36 });
}

// index sort code
{
  const s = content("8.6.3", "8.6 索引排序 · modern.hpp", "insertion_index_sort：排的是索引，不是记录");
  codeBlock(s, `// 算法8.14：排序索引，不移动原记录。
inline std::vector<std::size_t> insertion_index_sort(const std::vector<int>& values) {
    std::vector<std::size_t> indexes(values.size());
    for (std::size_t i = 0; i < indexes.size(); ++i) indexes[i] = i;
    for (std::size_t i = 1; i < indexes.size(); ++i) {
        const std::size_t index = indexes[i];
        std::size_t hole = i;
        while (hole != 0 && values[index] < values[indexes[hole - 1]]) { indexes[hole] = indexes[hole - 1]; --hole; }
        indexes[hole] = index;
    }
    return indexes;
}`, 0.5, 1.05, 9.0, 2.2, { fontSize: 8.5, hl: [8] });
  callout(s, "排索引可以用任何排序", "原书算法 8.14 用直接插入：`values` 按 `const&` 传入，**一次都不写**；动的只有 `indexes`。", 0.5, 3.4, 2.9, 1.7, { fontSize: 10.5 });
  callout(s, "稳定性是免费的", "插入排序不越过相等元素，所以 34 与 34′ 的先后没变——`index` 里 **2 排在 4 前面**。", 3.55, 3.4, 2.9, 1.7, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "代价与收益", "多用 Θ(n) 的索引空间，换来「**排序阶段一次记录搬移都没有**」。", 6.6, 3.4, 2.9, 1.7, { fontSize: 10.5 });
}

// adjust_by_index
{
  const s = content("8.6.3", "8.6 索引排序 · modern.hpp", "adjust_by_index：沿置换环整理，Θ(n)");
  codeBlock(s, `// 算法8.15：沿置换环把索引顺序落实为记录顺序。
inline void adjust_by_index(std::vector<int>& values, std::vector<std::size_t>& indexes) {
    for (std::size_t first = 0; first < values.size(); ++first) {
        if (indexes[first] == first) continue;
        std::size_t current = first;
        const int saved = values[first];
        while (indexes[current] != first) {
            const std::size_t source = indexes[current];
            values[current] = values[source];
            indexes[current] = current;
            current = source;
        }
        values[current] = saved;
        indexes[current] = current;
    }
}`, 0.5, 1.05, 9.0, 2.65, { fontSize: 8.5, hl: [9, 10] });
  callout(s, "顺着置换环走", [
    "0 该放 5 的值、5 该放 4 的值、4 该放 2 的值、2 该放 0 的值——一圈回到起点，**这一环上的元素一次到位**。",
    "到位一个就把索引改成自己的下标，不再参与后续的环。",
  ], 6.3, 1.4, 3.1, 2.2, { fontSize: 10, gap: 4, fill: C.mint, tcolor: C.dark });
  const N = (arr, hl = {}) => arr.map((v, i) => ({ t: String(v), mono: true, align: "center", fill: hl[i], bold: !!hl[i] }));
  table(s, [
    ["", "0", "1", "2", "3", "4", "5", "6", "7"],
    [{ t: "初始", bold: true }, ...N([29, 25, 34, 64, "34′", 12, 32, 45])],
    [{ t: "环 {0, 5, 4, 2}", bold: true }, ...N([12, 25, 29, 64, 34, "34′", 32, 45], { 0: C.cream, 2: C.cream, 4: C.cream, 5: C.cream })],
    [{ t: "环 {3, 6, 7}", bold: true }, ...N([12, 25, 29, 32, 34, "34′", 45, 64], { 3: GRN, 6: GRN, 7: GRN })],
  ], 0.5, 3.85, 6.4, [1.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6], { fontSize: 9.5, rowH: 0.27, tight: true });
  callout(s, "每个元素恰好搬一次", "整理 Θ(n) 次移动、O(1) 辅助空间。（底稿把这一环印成 {0,5,4,1}，与元素对不上，应为 {0,5,4,2}。）", 7.05, 3.85, 2.45, 1.25, { fontSize: 9.5, tsize: 11 });
}

// ============================ 8.7 ============================
sectionSlide("8.7", "排序算法的时间代价", "三种简单排序为什么快不起来 · 实测：同阶不等于同速\nstd::sort 是怎么拼起来的 · 判定树：比较排序的下限");

// 8.7.1
{
  const s = content("8.7.1", "8.7 时间代价 · 简单排序", "三种 Θ(n²)：差别在对输入形态的反应");
  table(s, [
    ["算法", "最好", "平均", "最坏", "稳定", "交换/搬移次数"],
    ["直接插入", { t: "Θ(n)（已有序）", color: C.ok }, "Θ(n²)", "Θ(n²)（逆序）", "稳定", "搬移 Θ(n²)"],
    ["冒泡（带无交换退出）", { t: "Θ(n)（已有序）", color: C.ok }, "Θ(n²)", "Θ(n²)", "稳定", "交换 Θ(n²)"],
    [{ t: "直接选择", fill: C.cream }, { t: "Θ(n²)", color: C.bad, bold: true, fill: C.cream }, { t: "Θ(n²)", fill: C.cream }, { t: "Θ(n²)", fill: C.cream }, { t: "不稳定", bold: true, color: C.bad, fill: C.cream }, { t: "交换 ≤ n − 1", bold: true, fill: C.cream }],
  ], 0.5, 1.05, 9.0, [1.9, 1.55, 0.95, 1.55, 0.95, 2.1], { fontSize: 10.5, rowH: 0.4 });
  callout(s, "为什么都快不起来：原因是同一个", [
    "插入和冒泡**只对相邻的两个记录比较和移动**，记录只能一步步挪向目标。",
    "直接选择改进了交换次数，但在剩余记录中**逐个线性比较**，比较次数没降。",
    "相邻比较的算法平均步长由逆置数决定：平均 n(n−1)/4 → **Θ(n²)**。",
  ], 0.5, 2.85, 5.6, 2.25, { fontSize: 10.5, gap: 4 });
  callout(s, "要从数量级上提速", "必须**摆脱逐个一步步操作**：Shell 排序跨越相邻元素做分区插入，就达到 Θ(n^1.5)（取决于增量：减半最坏 Θ(n²)，Hibbard 最坏 Θ(n^(3/2))）。", 6.35, 2.85, 3.15, 2.25, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 8.7.2 measurements
{
  const s = content("8.7.2", "8.7 时间代价 · 实测", "量出来的数量级（g++ 13.3，-O2，随机数据，毫秒）");
  const H = (t) => ({ t, align: "center" });
  table(s, [
    ["n", "插入", "选择", "冒泡", "堆排", "快排", "归并"],
    [{ t: "1000", bold: true }, H("0.1"), H("0.2"), H("2.8"), H("0.0"), H("0.0"), H("0.0")],
    [{ t: "10000", bold: true }, H("7.9"), H("18.9"), H("162.4"), H("0.7"), H("0.4"), H("0.5")],
    [{ t: "50000", bold: true }, { t: "213.5", align: "center", bold: true, color: C.ok }, H("482.1"), { t: "5821.9", align: "center", bold: true, color: C.bad }, H("3.0"), H("2.2"), H("3.1")],
  ], 0.5, 1.05, 5.6, [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8], { fontSize: 11, rowH: 0.36 });
  text(s, "输入形态的影响（2 万个数）", 0.5, 2.65, 5.6, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["", "插入", "冒泡", "优化快排"],
    [{ t: "已经排好序", bold: true }, { t: "0.0", align: "center", color: C.ok, bold: true }, H("0.0"), { t: "105.9", align: "center", color: C.bad, bold: true }],
    [{ t: "随机", bold: true }, H("58.5"), H("675.1"), H("0.7")],
  ], 0.5, 3.0, 5.6, [1.7, 1.3, 1.3, 1.3], { fontSize: 11, rowH: 0.36 });
  text(s, "上机题第 1 题要求的正是这张表。", 0.5, 4.2, 5.6, 0.3, { fontSize: 10, color: C.muted });
  callout(s, "两件事值得停下来看", [
    "**同为 Θ(n²)，冒泡比插入慢 27 倍**（5822 对 214）：常数差来自三步交换 vs 一次搬移。",
    "n 从 1 万到 5 万（5 倍）：Θ(n²) 的三个涨约 **25 倍**，Θ(n log n) 的三个只涨 **5～6 倍**。",
    "优化快排在有序输入上比插入**慢了不止 100 倍**：末元素当轴，有序输入每次划分都最坏。",
  ], 6.35, 1.05, 3.15, 4.05, { fontSize: 10.5, gap: 6 });
}

// 8.7.2 sensitivity + std::sort
{
  const s = content("8.7.2", "8.7 时间代价 · 实测", "对数据分布的敏感性；标准库的排序是怎么拼的");
  bullets(s, [
    "**选择、归并、基数排序对数据分布不敏感**；插入、冒泡、Shell 都是正序比逆序快，正序或基本有序时简单算法最好。",
    "原书快排（**中间点**作轴）正序和逆序一样快，都比随机快；本书取末元素，这两种输入上反而最慢。",
    "**堆排序逆序比正序稍快**：最大堆下，逆序输入已自然成堆，建堆快。",
    "顺序基数排序比链式快；但记录是较大的组合类型时，应采用链式存储减少移动。",
  ], 0.5, 1.05, 4.6, 4.05, { fontSize: 11, gap: 8 });
  card(s, 5.3, 1.05, 4.2, 4.05, C.code);
  text(s, "std::sort = 本章三种算法拼起来（introsort）", 5.45, 1.12, 4.0, 0.35, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  pill(s, "快速排序（三点选中）", 5.5, 1.6, 3.8, 0.42, C.green, C.white, 11);
  s.addShape(pres.shapes.LINE, { x: 6.0, y: 2.05, w: 0, h: 0.45, line: { color: C.goldText, width: 1.5, endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: 8.4, y: 2.05, w: 0, h: 0.45, line: { color: C.bad, width: 1.5, endArrowType: "triangle" } });
  text(s, "长度 < 阈值（原书记 20）", 6.08, 2.05, 1.25, 0.45, { fontSize: 8.5, color: C.goldText, margin: 0, valign: "middle" });
  text(s, "深度 > 2 log n", 7.35, 2.05, 1.0, 0.45, { fontSize: 8.5, color: C.bad, margin: 0, valign: "middle", align: "right" });
  pill(s, "最后整体插入排序", 5.5, 2.55, 1.85, 0.42, C.goldText, C.white, 10);
  pill(s, "转堆排序 O(n log n)", 7.45, 2.55, 1.85, 0.42, C.bad, C.white, 10);
  text(s, "最坏比堆排序差一些，比快排好得多；平均与快排差不多。", 5.45, 3.1, 4.0, 0.5, { fontSize: 10, margin: 0 });
  text(s, "`stable_sort` → 归并排序；`partial_sort` → 堆排序；`nth_element` 找区间内某位置的元素；C 语言有 `qsort`。", 5.45, 3.6, 4.0, 0.7, { fontSize: 10, margin: 0 });
  text(s, "这也是本书**不用 std::sort 顶替**这一章的理由：读懂它的前提，正是先把这三种都手写一遍。", 5.45, 4.35, 4.0, 0.7, { fontSize: 10, bold: true, color: C.goldText, margin: 0 });
}

// 8.7.3 lower bound
{
  const s = content("8.7.3", "8.7 时间代价 · 排序问题的下限", "判定树：任何比较排序最坏至少 Ω(n log n) 次比较");
  card(s, 0.5, 1.05, 4.0, 2.95, C.code);
  image(s, "fig-8-14", 0.6, 1.1, 3.8, 2.6);
  caption(s, "图 8.14 用判定树模拟基于比较的排序（n = 3）", 0.5, 3.7, 4.0);
  const st = [
    "每个内部结点是一次比较「aᵢ < aⱼ ?」，每片叶子是一种输出排列；比较次数 = 根到叶的路径长度。",
    "n 个互不相同的元素有 **n!** 种排列，每种都必须被区分 → **叶子 ≥ n!**。",
    "高度为 h 的二叉树最多 2ʰ 片叶子：2ʰ ≥ n!，",
    "h ≥ log₂(n!) ≥ log₂(n/2)^(n/2) = (n/2) log₂(n/2) = **Θ(n log n)**。树高正是最坏比较次数。",
  ];
  st.forEach((t, i) => {
    const y = 1.08 + i * 0.77;
    numCircle(s, i + 1, 4.75, y + 0.04, 0.34, C.green);
    text(s, t, 5.2, y, 4.3, 0.75, { fontSize: 10.5, margin: 0 });
  });
  callout(s, "上限与下限", "下限 = 问题可能达到的最佳效率；上限 = 已知最快算法。光 I/O 就要 Ω(n)；比较排序上下限都是 n log n 量级：**重合**，不可能更快。", 0.5, 4.07, 4.6, 1.03, { fontSize: 10, tsize: 11 });
  callout(s, "下界只管比较排序", "桶式、基数不比较，做到 Θ(m+n)、Θ(d(n+r))——站在下界**管辖范围之外**；代价是值域要够密或位数要够少。", 5.25, 4.07, 4.25, 1.03, { fontSize: 10, tsize: 11, fill: C.mint, tcolor: C.dark });
}

// overall table
{
  const s = content("∑", "本章总结 · 总表", "九种内排序放在一张表里");
  const OK = { t: "稳定", color: C.ok, bold: true }, NO = { t: "不稳定", color: C.bad };
  table(s, [
    ["方法", "平均时间", "最坏时间", "辅助空间", "稳定", "备注"],
    ["直接插入", "Θ(n²)", "Θ(n²)", "Θ(1)", OK, "有序时 Θ(n)；小规模、基本有序最快"],
    ["Shell", "取决于增量", "减半 Θ(n²)", "Θ(1)", NO, "Hibbard 最坏 Θ(n^(3/2))"],
    ["直接选择", "Θ(n²)", "Θ(n²)", "Θ(1)", NO, "最好也 Θ(n²)；交换 ≤ n−1"],
    ["堆排序", "Θ(n log n)", "Θ(n log n)", "Θ(1)", NO, "最坏有保证，原地"],
    ["冒泡", "Θ(n²)", "Θ(n²)", "Θ(1)", OK, "有序时 Θ(n)；实测最慢"],
    ["快速排序", "Θ(n log n)", { t: "Θ(n²)", color: C.bad }, "Θ(log n)", NO, "实践中最快；枢轴策略决定最坏输入"],
    ["归并排序", "Θ(n log n)", "Θ(n log n)", "Θ(n)", OK, "对初始排列不敏感"],
    ["桶式排序", "Θ(m + n)", "Θ(m + n)", "Θ(m + n)", OK, "只适合值域 m 较小"],
    ["基数排序", "Θ(d(n + r))", "Θ(d(n + r))", "Θ(n + r)", OK, "关键码互不相同时实为 Θ(n log n)"],
  ], 0.5, 1.02, 9.0, [1.15, 1.25, 1.25, 1.05, 0.8, 3.5], { fontSize: 10, rowH: 0.36 });
  text(s, "稳定：插入、冒泡、归并、分配（桶式、基数）。不稳定（举反例即可）：直接选择、堆、Shell、快排。", 0.5, 4.75, 9.0, 0.35, { fontSize: 10.5, color: C.goldText, bold: true });
}

// how to choose
{
  const s = content("∑", "本章总结 · 怎么选", "按规模、稳定性、有序程度、关键码形态来选");
  const rules = [
    ["关键码序列**基本有序**", "直接插入最快，冒泡也较快"],
    ["要求速度**稳定**、对初始排列不敏感", "归并排序"],
    ["记录个数 n **较小**", "直接插入或直接选择"],
    ["n **较大**", "O(n log n) 的快排、堆排序、归并或基数排序"],
    ["n 较大、输入**杂乱无序**、无稳定性要求", "快速排序效果最好"],
    ["n **很大**且关键码**位数较少**", "静态链的基数排序"],
  ];
  rules.forEach((r, i) => {
    const y = 1.08 + i * 0.52;
    numCircle(s, i + 1, 0.5, y + 0.06, 0.36, C.green);
    card(s, 1.0, y, 5.2, 0.46, C.code);
    s.addText(runs(r[0], { color: C.text }), { x: 1.1, y, w: 3.6, h: 0.46, fontFace: FONT, fontSize: 11, valign: "middle", margin: 0, isTextBox: true });
    text(s, "→ " + r[1], 4.0, y, 2.15, 0.46, { fontSize: 10, bold: true, color: C.green, valign: "middle", margin: 0 });
  });
  callout(s, "记录很大、搬不起", "减少移动：**索引排序**；或直接选择（交换 ≤ n−1）。", 6.45, 1.08, 3.05, 1.3, { fontSize: 10.5 });
  callout(s, "有空间限制", "插入、选择、冒泡、Shell、堆：Θ(1)；快排 Θ(log n)；归并 Θ(n)。", 6.45, 2.5, 3.05, 1.3, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "也可以组合", "插入排序常与其他方法结合使用：优化快排、优化归并、std::sort。", 6.45, 3.92, 3.05, 1.18, { fontSize: 10.5 });
}

// exercises
{
  const s = content("✎", "课后练习（精选）", "几道代表性的习题与上机题");
  const ex = [
    ["习题 1", "对 {49, 38, 65, 97, 76, 13, 27} 分别画出直接插入、冒泡、简单选择的**第一趟**结果。"],
    ["习题 2", "说明为什么直接插入稳定、堆排序不稳定；举一个使堆排序打乱相等键次序的例子。"],
    ["原书 14", "红、白、蓝三色条块共 n 个：Θ(n) 时间、最少辅助空间排成**荷兰国旗**。"],
    ["原书 19", "「归并 Θ(n log n)、插入 Θ(n²)，所以排 256 个数归并快 64 倍」——对吗？为什么？"],
    ["原书 12", "用栈代替快排的递归：最坏栈多深？怎样组织递归顺序让栈最浅？能用队列吗？"],
    ["上机 2", "构造使快排退化的输入，观察递归深度（对照本章 Python 版的 RecursionError）。"],
  ];
  ex.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6, y = 1.08 + row * 1.35;
    card(s, x, y, 4.4, 1.22, row === 0 ? C.cream : C.code);
    pill(s, e[0], x + 0.15, y + 0.12, 1.0, 0.32, C.dark, C.gold, 10);
    text(s, e[1], x + 0.15, y + 0.5, 4.1, 0.68, { fontSize: 10.5, margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["四个问题", "比较还是分配？稳不稳定？额外空间？**最好 / 平均 / 最坏**三个时间？"],
    ["简单排序", "插入、选择、冒泡都是 Θ(n²)：**只做相邻比较**的算法平均逃不出逆置数 n(n−1)/4。"],
    ["分治排序", "快排力气花在「分」、平均最快但会退化；归并力气花在「合」，稳定、Θ(n) 空间。"],
    ["稳定的来源", "一个 `<`：相等不越过、相等取左、桶内保持入桶顺序；**跨越式移动**就不稳定。"],
    ["下限与分配", "比较排序最坏 **Ω(n log n)**；桶式、基数靠关键码结构站在下界之外。**同阶不等于同速**。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
