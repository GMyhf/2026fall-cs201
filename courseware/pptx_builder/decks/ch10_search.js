// 第10章 检索 —— 由 dsa-modernization/book/ch10-search.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch10_search.js ../202609_DSA_10_Search.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_10_Search.pptx");

// 讲义中引用的图片（name → 本地路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const IMAGES = {
  "fig-10-1": `${SCAN}/fig-10-1.png`,
  "fig-10-2": `${SCAN}/fig-10-2.png`,
  "fig-10-3": `${SCAN}/fig-10-3.png`,
  "fig-10-5": `${SCAN}/fig-10-5.png`,
  "fig-10-6": `${SCAN}/fig-10-6.png`,
  "fig-10-7": `${SCAN}/fig-10-7.png`,
  "fig-10-8": `${SCAN}/fig-10-8.png`,
  "fig-10-11": `${SCAN}/fig-10-11.png`,
};

(async () => {
  const D = createDeck({ title: "DSA 第10章 检索", imgDir: path.join(__dirname, "..", ".cache", "ch10") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;
  const RED = "FDF0EE", GREENBG = "EAF4EF";

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第10章  检索",
  subtitle: "Search：比较着找，还是直接算出地址",
  topics: "平均检索长度 ASL · 顺序检索与监视哨 · 二分检索（半开区间）与决策树 · 分块检索\n集合的数学特性 · IntSet 接口 · 位向量求交并差\n散列函数：除余 / 乘余取整 / 平方取中 / 折叠 / ELFhash · 开散列（拉链）\n闭散列：线性 / 二次 / 随机 / 双散列探查 · 墓碑删除 · 负载因子与效率",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["不排序、排序、分块，检索的代价各是多少？", "10.1 基于线性表的检索：**顺序 O(n)**、**二分 O(log n)**、分块介于二者之间。"],
    ["「在不在里面」这个问题怎么问？", "10.2 集合：`insert` / `erase` 返回 `bool`，全集小时用**位向量**一次按位运算求交。"],
    ["能不能不比较，直接算出地址？", "10.3 散列：散列函数定位槽位，冲突时继续探查，删除要留**墓碑**。"],
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
    { text: "散列法的平均检索长度", options: { color: C.white } },
    { text: "不依赖于表中结点的个数", options: { color: C.gold, bold: true } },
    { text: "，而是随", options: { color: C.white } },
    { text: "负载因子 α", options: { color: C.gold, bold: true } },
    { text: "的增大而增加。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["10.1  线性表", ["检索与平均检索长度 ASL", "10.1.1 顺序检索、监视哨", "10.1.2 二分检索：半开区间、trace、决策树、代价", "10.1.3 分块检索（索引检索）", "教学版 teaching.hpp 总览"]],
    ["10.2  集合", ["10.2.1 集合的数学特性", "接口口径：可预期的失败返回 bool", "10.2.2 计算机中的集合", "IntSet：顺序检索上的交与包含", "有限全集上的位向量"]],
    ["10.3  散列", ["散列的思想、冲突、负载因子", "10.3.1 七种散列函数", "10.3.2 开散列（拉链法）", "10.3.3 闭散列：四种探查、墓碑", "10.3.4 HashTable 实现", "10.3.5 效率分析 · 10.3.6 应用"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 2 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 2.5, 0.45, { fontSize: 20, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 2.6, 3.1, { fontSize: 11.5, gap: 7 });
  });
}

// 4. Run first (1/2)
{
  const s = content("▶", "先跑一遍 · demo.cpp（上）", "用教学版 HashTable 观察线性探测");
  codeBlock(s, `// 第 10 章「先跑一遍」：用教学版 HashTable 观察线性探测与墓碑删除。
// 编译运行：
//   g++ -std=c++17 -I code/ch10/search_hash code/ch10/search_hash/demo.cpp -o demo && ./demo
#include "teaching.hpp"

#include <iostream>

int main() {
    HashTable table(5);
    if (!table.insert(1) || !table.insert(6) || !table.insert(11)) {
        std::cout << "插入 1、6、11 失败\\n";
        return 1;
    }

    std::cout << "插入 1、6、11 后:\\n";
    for (std::size_t index = 0; index < table.capacity(); ++index) {
        const auto slot = table.slot_at(index);
        std::cout << "  槽 " << index << ": ";
        if (slot.state == HashTable::SlotState::used) {
            std::cout << slot.key << '\\n';
        } else if (slot.state == HashTable::SlotState::tombstone) {
            std::cout << "墓碑\\n";
        } else {
            std::cout << "空\\n";
        }
    }
    // ...`, 0.5, 1.05, 6.6, 4.1, { fontSize: 8 });
  consoleBlock(s, "插入 1、6、11 后:\n  槽 0: 空\n  槽 1: 1\n  槽 2: 6\n  槽 3: 11\n  槽 4: 空", 7.3, 1.05, 2.2, 1.85, 10);
  callout(s, "看到了什么", [
    "表长 5，`home(k) = k % 5`：1、6、11 的基地址**都是 1**。",
    "1 住进槽 1；6 冲突，探测到 2；11 连续冲突，落到 3。",
    "这就是**线性探测**：被占就往后一格。",
  ], 7.3, 3.05, 2.2, 2.05, { fontSize: 10 });
}

// 5. Run first (2/2)
{
  const s = content("▶", "先跑一遍 · demo.cpp（下）", "删掉 1 之后：墓碑让 6 仍然找得到");
  codeBlock(s, `    // ...
    if (!table.erase(1)) {
        std::cout << "删除 1 失败\\n";
        return 1;
    }
    std::cout << "删除 1 后仍能找到 6? " << (table.contains(6) ? "是" : "否") << '\\n';
    if (!table.insert(16)) {
        std::cout << "插入 16 失败\\n";
        return 1;
    }
    std::cout << "插入 16 后槽 1 是 "
              << table.slot_at(1).key
              << "（复用了墓碑）\\n";
}`, 0.5, 1.05, 6.6, 2.55, { fontSize: 8.5 });
  consoleBlock(s, "删除 1 后仍能找到 6? 是\n插入 16 后槽 1 是 16（复用了墓碑）", 0.5, 3.75, 6.6, 0.85, 10.5);
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch10/search_hash \\\n    code/ch10/search_hash/demo.cpp -o /tmp/hash-demo", 0.5, 4.68, 6.6, 0.45, { fontSize: 8.5, color: C.muted });
  callout(s, "看到了什么", [
    "删除 1 **不把槽 1 标空**，而是标成**墓碑**。",
    "查 6：从槽 1 出发，越过墓碑，在槽 2 命中。",
    "插 16：记住首个墓碑，确认后面没有 16，**回头复用槽 1**。",
  ], 7.3, 1.05, 2.2, 2.75, { fontSize: 10 });
  callout(s, "如果标空", "第二行会变成「否」——测试里有两条具名断言守住这件事。", 7.3, 3.95, 2.2, 1.15, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// 6. Basic concepts & ASL
{
  const s = content("10", "检索 · 基本概念", "检索与平均检索长度 ASL");
  bullets(s, [
    "**检索**：在一组记录里定位关键码等于给定值的那一条，或属性满足条件的那些条。",
    "**成功**：至少找到一条；**失败**：没有。**精确匹配**查单个值，**范围查询**查一个区间。",
    "主要操作是关键码的比较。平均比较次数称为**平均检索长度**（ASL），是衡量检索算法的时间标准，也是元素总数 n 的函数。",
  ], 0.5, 1.05, 5.3, 2.4, { fontSize: 12, gap: 8 });
  card(s, 6.05, 1.05, 3.45, 1.45, C.dark);
  text(s, "ASL = Σ Pᵢ · Cᵢ", 6.2, 1.15, 3.2, 0.6, { fontSize: 24, bold: true, color: C.gold, margin: 0, align: "center" });
  text(s, "Pᵢ：检索第 i 个元素的概率\nCᵢ：找到它所需的比较次数", 6.2, 1.78, 3.2, 0.65, { fontSize: 10.5, color: C.white, margin: 0, align: "center" });
  table(s, [
    ["元素", "Pᵢ", "Cᵢ（顺序）", "Pᵢ·Cᵢ"],
    ["a", "0.4", "1", "0.4"],
    ["b", "0.1", "2", "0.2"],
    ["c", "0.5", "3", "1.5"],
    [{ t: "合计", bold: true }, "1.0", "", { t: "2.1", bold: true, color: C.bad }],
  ], 6.05, 2.65, 3.45, [0.75, 0.8, 1.05, 0.85], { fontSize: 10.5, rowH: 0.27, align: "center" });
  text(s, "原书例：(a,b,c) 平均要比较 2.1 次", 6.05, 4.25, 3.45, 0.25, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  callout(s, "检索的四类", [
    "基于线性表 · 按关键码直接访问（含散列）——**本章**",
    "树形索引（第 5、11、12 章）· 基于属性的倒排（第 11 章）",
  ], 0.5, 3.55, 5.3, 1.1, { fontSize: 10.5, gap: 2 });
  text(s, "已知各元素检索概率的分布时，ASL 能准确反映平均时间性能；此外还要看存储量、算法复杂性。", 0.5, 4.7, 9, 0.4, { fontSize: 10, color: C.muted, margin: 0 });
}

// ============================ PART 1 ============================
sectionSlide("10.1", "基于线性表的检索", "数据放在数组或链表里，逐个与给定值 K 比较\n顺序检索 · 二分检索 · 分块检索");

// 10.1.1 sequential concept
{
  const s = content("10.1.1", "10.1 线性表 · 顺序检索", "顺序检索：从头比到尾，对数据没有任何要求");
  bullets(s, [
    "逐个比较记录的关键码和给定值：相等则成功，走完仍未找到则失败。",
    "**表中各元素可以任意排列**——唯一的、也是最宝贵的优点：不要求有序，链表和数组都能用。",
    "最好：目标在第一个位置，比较 **1** 次；最坏：目标不在表里，比较 **n** 次。",
    "**等概率假设** Pᵢ = 1/n 下：ASL = (1 + 2 + ⋯ + n)/n = **(n+1)/2**。",
  ], 0.5, 1.05, 5.3, 2.9, { fontSize: 12.5, gap: 9 });
  card(s, 6.05, 1.05, 3.45, 3.0, C.code);
  text(s, "例：{8, 3, 8, 1}", 6.2, 1.12, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "查 8：第 1 次比较命中下标 0", 6.2, 1.5, 3.2, 0.25, { fontSize: 10.5, bold: true, color: C.ok, margin: 0 });
  cells(s, 6.5, 1.95, [8, 3, 8, 1], { idx: true, fills: ["CDEBD9"] });
  arrowLabel(s, "", 6.75, 1.95, C.ok);
  text(s, "查 7：依次比较 8、3、8、1 → 失败", 6.2, 2.7, 3.2, 0.25, { fontSize: 10.5, bold: true, color: C.bad, margin: 0 });
  cells(s, 6.5, 3.1, [8, 3, 8, 1], { idx: true, fills: ["F9D5D0", "F9D5D0", "F9D5D0", "F9D5D0"] });
  text(s, "走完整张表才知道不在", 6.2, 3.72, 3.2, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "重复关键码返回哪一个？", "本书接口返回**第一个**匹配位置。这不是顺序检索自动保证的抽象性质，而是「从左向右、命中即停」这份实现的**明确约定**。", 0.5, 4.1, 9.0, 1.0, { fontSize: 11 });
}

// sequential code
{
  const s = content("10.1.1", "10.1 线性表 · 顺序检索 · teaching.hpp", "sequential_search：找到返回下标，没找到返回空 optional");
  codeBlock(s, `// 【算法10.2】顺序检索：从头比到尾。找到返回下标，没找到返回空 optional。
// 代价 O(n)。它对数据没有任何要求——这是它唯一的优点，也是全部优点。
inline std::optional<std::size_t> sequential_search(const std::vector<int>& values, int key) {
    for (std::size_t index = 0; index < values.size(); ++index) {
        if (values[index] == key) {
            return index;
        }
    }
    return std::nullopt;
}`, 0.5, 1.05, 9.0, 2.05, { fontSize: 9.5 });
  codeBlock(s, `def sequential_search(values, key):
    for i, value in enumerate(values):
        if value == key:
            return i
    return None`, 0.5, 3.25, 4.35, 1.3, { fontSize: 9.5, lang: "py" });
  text(s, "Python 版（modern.py）：同一逻辑，失败返回 `None`", 0.5, 4.62, 4.35, 0.45, { fontSize: 10, color: C.muted });
  callout(s, "接口口径", [
    "「没找到」是**可预期的结果**，不是错误 → 返回 `std::nullopt`，不抛异常、不打印。",
    "循环里每轮要测**两个条件**：`index < size` 与 `values[index] == key`。",
  ], 5.15, 3.25, 4.35, 1.85, { fontSize: 11 });
}

// sentinel
{
  const s = content("10.1.1", "10.1 线性表 · 顺序检索", "监视哨：让循环只测一个条件");
  text(s, "原书把位置 0 空出来做监视哨：检索前先 `dataList[0]->setKey(K)`，再**从后往前**比较，循环条件只写「当前元素是否等于目标」。", 0.5, 1.02, 9, 0.6, { fontSize: 12.5 });
  card(s, 0.5, 1.75, 4.35, 2.1, C.code);
  text(s, "查 K = 7（不在表中）", 0.7, 1.82, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  cells(s, 1.0, 2.55, [7, 8, 3, 8, 1], { idx: true, fills: [C.cream, null, null, null, null], colors: [C.goldText] });
  arrowLabel(s, "监视哨", 1.25, 2.55, C.goldText);
  s.addShape(pres.shapes.LINE, { x: 3.2, y: 3.3, w: -1.9, h: 0, line: { color: C.bad, width: 1.5, endArrowType: "triangle", dashType: "dash" } });
  text(s, "i 从 n 往 0 走，走到 0 时 key 恰好等于 K", 0.7, 3.4, 4.0, 0.3, { fontSize: 10, color: C.bad, margin: 0 });
  card(s, 5.15, 1.75, 4.35, 2.1, GREENBG);
  text(s, "作用：保证 while 一定终止", 5.35, 1.82, 4, 0.3, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "检索不成功时 i 会走到 0，此时终止条件「被迫」成立。",
    "所以不必把 `i > 0` 写进循环条件。",
    "停在原表范围内 = 成功；停在哨兵槽 = 失败。",
  ], 5.3, 2.2, 4.1, 1.6, { fontSize: 11, gap: 5 });
  callout(s, "「加速」原理", "当一个循环需要测试两个或多个条件时，应尽量**减少测试条件**——比较次数的**常数**会小一点，**阶不变**。", 0.5, 4.0, 4.35, 1.1, { fontSize: 10.5 });
  callout(s, "什么时候不该用", "只读输入、并发共享数组、没有额外槽时，不应为省一个边界判断去**改数据**。本书的顺序检索不写输入。", 5.15, 4.0, 4.35, 1.1, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// 10.1.2 binary concept
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索", "有序表：先确定范围，再逐步缩小");
  bullets(s, [
    "**有序表**：所有元素按关键码不增或不降排列——一种特殊的线性表。",
    "查英语字典：b 打头靠前翻、z 打头翻到后面；当前页的词在待查词之前就往后翻，反之往前翻。",
    "体现的思想：**先确定待查目标所在的范围，然后逐步缩小范围**，直到找到或找不到。",
  ], 0.5, 1.05, 5.0, 2.6, { fontSize: 12.5, gap: 9 });
  text(s, "一次比较、三种结果（以递增为例）", 5.8, 1.05, 3.7, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const r = [["a[mid] == K", "检索成功", C.ok], ["a[mid] > K", "若在表中，一定在它之前 → 丢右半", C.green], ["a[mid] < K", "若在表中，一定在它之后 → 丢左半", C.goldText]];
  r.forEach((it, i) => {
    const y = 1.45 + i * 0.72;
    card(s, 5.8, y, 3.7, 0.62, C.code);
    pill(s, it[0], 5.9, y + 0.13, 1.35, 0.36, it[2], C.white, 10);
    text(s, it[1], 7.35, y, 2.1, 0.62, { fontSize: 10.5, valign: "middle", margin: 0 });
  });
  callout(s, "两条前提", [
    "表必须**按关键码有序**；",
    "能**按下标随机访问** → 适合数组，**不适合链表**。",
  ], 0.5, 3.75, 4.35, 1.35, { fontSize: 11.5 });
  callout(s, "代价", "区间长度每次至少减半，比较次数 **O(log n)**。二分检索是比较典型的**分治**算法，也可以改用递归实现。", 5.15, 3.75, 4.35, 1.35, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// binary code
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索 · teaching.hpp", "binary_search：半开区间 [first, last)");
  codeBlock(s, `inline std::optional<std::size_t> binary_search(const std::vector<int>& sorted_values, int key) {
    std::size_t first = 0;
    std::size_t last = sorted_values.size();
    while (first < last) {
        // 写成 first + (last - first) / 2 而不是 (first + last) / 2：
        // 后者在两个下标都很大时会溢出。
        std::size_t middle = first + (last - first) / 2;
        if (sorted_values[middle] == key) {
            return middle;
        }
        if (sorted_values[middle] < key) {
            first = middle + 1;    // 目标在右半边
        } else {
            last = middle;         // 目标在左半边
        }
    }
    return std::nullopt;
}`, 0.5, 1.05, 9.0, 2.9, { fontSize: 9, hl: [12, 14] });
  const pts = [
    ["last 指向「最后一个候选的下一个」", "初值 `last = size()`，循环条件 `first < last`，区间空了就返回空。"],
    ["只写 last = middle，永不减 1", "闭区间要写 `high = mid - 1`，`mid == 0` 时**无符号下标下溢**成天文数字。"],
    ["中点防溢出", "`first + (last - first) / 2`，而不是 `(first + last) / 2`。"],
  ];
  pts.forEach((p, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.05, 2.85, 1.05, C.cream);
    text(s, p[0], x + 0.12, 4.1, 2.65, 0.3, { fontSize: 10.5, bold: true, color: C.goldText, margin: 0 });
    text(s, p[1], x + 0.12, 4.42, 2.65, 0.65, { fontSize: 9.5, margin: 0 });
  });
}

// half-open vs closed
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索", "为什么用半开区间：不写 middle − 1");
  card(s, 0.5, 1.05, 4.35, 2.55, RED);
  text(s, "✗ 闭区间 [low, high]", 0.7, 1.12, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "`high` 初值是 `size - 1`：空表时就已下溢。",
    "没找到走左半要写 `high = mid - 1`。",
    "下标是 `std::size_t`，`mid == 0` 时 `0 - 1` 变成 **2⁶⁴ − 1**。",
    "这个 bug 在有符号下标上永远暴露不出来。",
  ], 0.65, 1.55, 4.1, 2.0, { fontSize: 11, gap: 5 });
  card(s, 5.15, 1.05, 4.35, 2.55, GREENBG);
  text(s, "✓ 半开区间 [first, last)", 5.35, 1.12, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "`last = size()`：空表时区间 [0, 0) 直接为空。",
    "走左半：`last = middle`；走右半：`first = middle + 1`。",
    "**永远不减 1**，无符号下标不会下溢。",
    "区间长度 = `last - first`，一目了然。",
  ], 5.3, 1.55, 4.1, 2.0, { fontSize: 11, gap: 5 });
  card(s, 0.5, 3.8, 9.0, 1.3, C.dark);
  text(s, "循环不变量", 0.75, 3.9, 3, 0.3, { fontSize: 12, bold: true, color: C.gold, margin: 0 });
  text(s, "每轮都维持：**若目标存在，它一定还在 [first, last) 里**。更新边界时必须把已经比较过、不可能命中的中点**排除**——这就是 `first = middle + 1` 里 +1 的来由，也是 `last = middle` 不必 −1 的原因。", 0.75, 4.22, 8.5, 0.8, { fontSize: 11.5, color: C.white, margin: 0 });
}

// binary trace
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索 · 手算", "逐步 trace：在 {1,3,7,8,12,15,18,21} 中查 18 与 14");
  cells(s, 0.9, 1.35, [1, 3, 7, 8, 12, 15, 18, 21], { idx: true, cw: 0.55, fills: [null, null, null, null, C.cream, null, "CDEBD9", null] });
  arrowLabel(s, "第1轮 mid=4", 0.9 + 4.5 * 0.55, 1.35, C.goldText);
  arrowLabel(s, "第2轮 mid=6", 0.9 + 6.5 * 0.55, 1.35, C.ok);
  text(s, "查 18（命中）", 5.6, 1.0, 3.9, 0.3, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
  table(s, [
    ["轮", "[first,last)", "middle", "中值", "判断"],
    ["1", { t: "[0,8)", mono: true }, "4", "12", "12 < 18，first = 5"],
    ["2", { t: "[5,8)", mono: true }, "6", "18", { t: "命中下标 6", bold: true, color: C.ok }],
  ], 5.6, 1.32, 3.9, [0.35, 0.9, 0.65, 0.55, 1.45], { fontSize: 9.5, rowH: 0.28 });
  text(s, "查 14（失败）", 0.5, 2.35, 4, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  table(s, [
    ["轮", "[first,last)", "middle", "中值", "判断"],
    ["1", { t: "[0,8)", mono: true }, "4", "12", "12 < 14，first = 5"],
    ["2", { t: "[5,8)", mono: true }, "6", "18", "18 > 14，last = 6"],
    ["3", { t: "[5,6)", mono: true }, "5", "15", "15 > 14，last = 5"],
    ["4", { t: "[5,5)", mono: true }, "—", "—", { t: "区间为空 → 返回空", bold: true, color: C.bad }],
  ], 0.5, 2.67, 5.4, [0.4, 1.1, 0.8, 0.7, 2.4], { fontSize: 10, rowH: 0.3 });
  callout(s, "读这两张表", [
    "每轮比较**一次**，区间长度 8 → 3 → 1 → 0。",
    "失败时并不是「比到最后一个」，而是**区间变空**。",
    "查 14 比较 3 次，不超过 ⌈log₂(8+1)⌉ = 4。",
  ], 6.15, 2.35, 3.35, 2.75, { fontSize: 10.5 });
}

// fig 10.1
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索", "图 10.1　原书例：在 (15,17,18,22,35,51,60,88,93) 中查 18");
  card(s, 0.5, 1.05, 9.0, 2.2, C.code);
  image(s, "fig-10-1", 0.7, 1.1, 8.6, 2.1);
  text(s, "原书：闭区间 [low,high]，下标从 1 起", 0.5, 3.33, 4.35, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["轮", "[low,high]", "mid", "中值", "判断"],
    ["1", { t: "[1,9]", mono: true }, "5", "35", "35 > 18，high = 4"],
    ["2", { t: "[1,4]", mono: true }, "2", "17", "17 < 18，low = 3"],
    ["3", { t: "[3,4]", mono: true }, "3", "18", { t: "命中（第 3 项）", bold: true, color: C.ok }],
  ], 0.5, 3.63, 4.35, [0.35, 0.85, 0.5, 0.55, 2.1], { fontSize: 9.5, rowH: 0.26 });
  text(s, "本书：半开区间 [first,last)，下标从 0 起", 5.15, 3.33, 4.35, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["轮", "[first,last)", "middle", "中值", "判断"],
    ["1", { t: "[0,9)", mono: true }, "4", "35", "35 > 18，last = 4"],
    ["2", { t: "[0,4)", mono: true }, "2", "18", { t: "命中下标 2", bold: true, color: C.ok }],
  ], 5.15, 3.63, 4.35, [0.35, 0.95, 0.6, 0.5, 1.95], { fontSize: 9.5, rowH: 0.26 });
  text(s, "中点 `(low+high)/2`，走左半 `high = mid - 1`。", 5.15, 4.45, 4.35, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
  text(s, "同一张表、同一个 18：原书比 **3** 次，本书 **2** 次就停。两种写法都对，但**中点落点不同**，手算时别混用。", 0.5, 4.78, 9.0, 0.32, { fontSize: 11, color: C.bad, margin: 0 });
}

// decision tree
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索", "图 10.2　决策树：把所有比较路径同时展开");
  card(s, 0.5, 1.05, 4.6, 3.3, C.code);
  image(s, "fig-10-2", 0.65, 1.15, 4.3, 3.1);
  text(s, "9 个元素的决策树；结点旁数字是下标", 0.5, 4.4, 4.6, 0.3, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  bullets(s, [
    "**这棵决策树其实就是一棵 BST**：检索某个值正好走一条从根到对应结点的路径。",
    "比较次数 = 该结点所在**层数 + 1**；最多不超过树的高度。",
    "**对同一长度的有序数组，决策树形状是固定的**——与元素的数值无关，只由下标决定。",
  ], 5.35, 1.05, 4.15, 2.75, { fontSize: 12, gap: 9 });
  callout(s, "图中查 18", "35 → 17 → 18：比较 3 次，18 在第 3 层（根为第 1 层）。", 5.35, 3.85, 4.15, 0.85, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  text(s, "图10.1把一次查找画成区间逐步缩小；图10.2把所有可能的路径同时展开。", 0.5, 4.8, 9, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
}

// cost math
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索", "代价的代数推导：最大检索长度 ⌈log₂(n+1)⌉");
  table(s, [
    ["比较次数", "成功检索的结点数"],
    ["1", "1 = 2⁰"],
    ["2", "2 = 2¹"],
    ["3", "4 = 2²"],
    ["j", "2ʲ⁻¹"],
  ], 0.5, 1.1, 3.4, [1.5, 1.9], { fontSize: 11.5, rowH: 0.36, align: "center" });
  bullets(s, [
    "n = 2⁰ + 2¹ + ⋯ + 2ʲ⁻¹ = **2ʲ − 1** 时，最大检索长度为 j；",
    "2ʲ − 1 < n ≤ 2ʲ⁺¹ − 1 时为 j + 1；",
    "总的来说：**最大检索长度 = ⌈log₂(n+1)⌉**。",
  ], 4.15, 1.1, 5.35, 1.6, { fontSize: 12, gap: 7 });
  card(s, 4.15, 2.75, 5.35, 1.15, C.dark);
  text(s, "等概率、n = 2ʲ − 1 时", 4.35, 2.82, 5, 0.28, { fontSize: 10.5, bold: true, color: C.gold, margin: 0 });
  text(s, "ASL = (1/n) Σ i·2ⁱ⁻¹ = (1/n)(j·2ʲ − 2ʲ + 1)\n     ≈ ((n+1)/n)·log₂(n+1) − 1", 4.35, 3.1, 5.1, 0.75, { fontSize: 12, color: C.white, margin: 0, fontFace: MONO });
  table(s, [
    ["n", "7", "8", "9", "10000"],
    ["⌈log₂(n+1)⌉", "3", "4", "4", "14"],
  ], 0.5, 3.1, 3.4, [1.3, 0.45, 0.45, 0.45, 0.75], { fontSize: 10.5, rowH: 0.32, align: "center" });
  callout(s, "结论", "n 较大时 **ASL ≈ log₂(n+1) − 1**：平均检索长度与最大检索长度**相近**，因而效率较高。图 10.2 有 9 个结点、4 层，最多比较 4 次。", 0.5, 4.05, 9.0, 1.05, { fontSize: 11.5 });
}

// two constraints
{
  const s = content("10.1.2", "10.1 线性表 · 二分检索", "两条硬约束：什么时候才值得用二分");
  const items = [
    ["要求事先按关键码排好序", "而**排序本身是一种很费时的操作**。只查一两次的话，排序的代价远大于省下的比较。", C.bad],
    ["只适用于顺序存储结构", "要随机访问中点，所以得是数组；而在顺序结构中**插入和删除都比较困难**（要移动大量元素）。", C.goldText],
  ];
  items.forEach((it, i) => {
    const y = 1.15 + i * 1.3;
    card(s, 0.5, y, 9.0, 1.15, C.code);
    numCircle(s, i + 1, 0.72, y + 0.33, 0.5, it[2]);
    text(s, it[0], 1.45, y + 0.12, 7.8, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    text(s, it[1], 1.45, y + 0.5, 7.9, 0.6, { fontSize: 12, margin: 0 });
  });
  card(s, 0.5, 3.85, 9.0, 1.25, C.dark);
  text(s, "所以", 0.75, 3.95, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "二分检索特别适用于那种**一经建立就很少改动、而又需要经常检索**的线性表。", 0.75, 4.28, 8.5, 0.7, { fontSize: 16, bold: true, color: C.white, margin: 0 });
}

// 10.1.3 block concept
{
  const s = content("10.1.3", "10.1 线性表 · 分块检索", "分块检索（索引检索）：块间有序，块内无序");
  card(s, 0.5, 1.05, 9.0, 2.0, C.code);
  image(s, "fig-10-3", 0.7, 1.1, 8.6, 1.9);
  bullets(s, [
    "把 n 个元素分成 b 块：后一块的最小关键码**不小于**前一块的最大关键码；块内部可以无序。",
    "另造一张**块索引**：每项记下该块的最大关键码（Key）、起始位置（link），以及当前记录数（count）。",
    "图 10.3 中每块后留了空位（下标 5、11）供块内插入，块起点为 0、6、12；块不必填满，所以要记 count。",
  ], 0.5, 3.15, 5.6, 1.95, { fontSize: 11, gap: 6 });
  callout(s, "两个阶段", [
    "① 确定所在的块：**顺序或二分**都行；",
    "② 块内检索：**只能顺序**（块内无序）。",
  ], 6.35, 3.15, 3.15, 1.95, { fontSize: 11 });
}

// block example
{
  const s = content("10.1.3", "10.1 线性表 · 分块检索 · 例", "图 10.3 的主表：查 44 与查 23，块间有序只负责排除别的块");
  const vals = [22, 12, 13, 9, 8, "", 33, 42, 44, 24, 48, "", 60, 80, 74, 49, 86, 53];
  const cw = 0.5;
  const fills = vals.map((v, i) => (v === "" ? C.white : v === 44 ? "CDEBD9" : (v === 33 || v === 42 ? C.cream : null)));
  cells(s, 0.5, 1.32, vals, { cw, ch: 0.42, fs: 11, idx: true, fills });
  [[0, 5, "块 0"], [6, 5, "块 1"], [12, 6, "块 2"]].forEach(([st, n, lb]) => {
    text(s, lb, 0.5 + st * cw, 1.03, n * cw, 0.26, { fontSize: 10.5, bold: true, color: C.green, align: "center", margin: 0 });
  });
  [5, 11].forEach((i) => text(s, "空", 0.5 + i * cw, 1.32, cw, 0.42, { fontSize: 9, color: C.muted, align: "center", valign: "middle", margin: 0 }));
  table(s, [
    ["索引项", "块 0", "块 1", "块 2"],
    [{ t: "link", mono: true }, "0", "6", "12"],
    [{ t: "Key", mono: true }, "22", "48", "86"],
    [{ t: "count", mono: true }, "5", "5", "6"],
  ], 0.5, 2.05, 4.2, [1.05, 1.05, 1.05, 1.05], { fontSize: 10.5, rowH: 0.25, align: "center" });
  bullets(s, [
    "每块后**留一个空位**（下标 5、11），供块内插入用；所以块起点 `link` 是 **0、6、12**。",
    "`Key` 是块内最大关键码；`count` 记该块**当前**有几个元素。",
  ], 4.95, 2.02, 4.55, 1.1, { fontSize: 10.5, gap: 4 });
  card(s, 0.5, 3.2, 4.35, 1.9, GREENBG);
  text(s, "查 44 → 成功", 0.7, 3.27, 4, 0.3, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "索引：比较 22（44 更大）、48（44 ≤ 48）→ **只能在块 1**。",
    "从 `link = 6` 起顺序比 `count = 5` 个：33、42、**44** 命中。",
  ], 0.65, 3.62, 4.1, 1.4, { fontSize: 11, gap: 6 });
  card(s, 5.15, 3.2, 4.35, 1.9, RED);
  text(s, "查 23 → 失败", 5.35, 3.27, 4, 0.3, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "同样落到块 1（22 < 23 ≤ 48）。",
    "块内扫完 5 个都不等 → 失败。",
    "**不能因为 23 小于块最大值 48 就断言存在**：块内仍然无序。",
  ], 5.3, 3.62, 4.1, 1.4, { fontSize: 11, gap: 5 });
}

// block ASL
{
  const s = content("10.1.3", "10.1 线性表 · 分块检索", "分块的 ASL：两个阶段之和，s = √n 时最小");
  text(s, "n 个元素均分成 b 块、每块 s 个（n = s × b），等概率：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  card(s, 0.5, 1.45, 4.35, 1.35, C.code);
  text(s, "第一阶段用二分", 0.7, 1.52, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "ASL ≈ log₂(n/s + 1) + (s − 1)/2", 0.7, 1.95, 4.1, 0.5, { fontSize: 13, bold: true, color: C.green, margin: 0, fontFace: MONO });
  card(s, 5.15, 1.45, 4.35, 1.35, C.code);
  text(s, "第一阶段用顺序", 5.35, 1.52, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "ASL = (b+1)/2 + (s+1)/2\n    = (n + s²)/(2s) + 1", 5.35, 1.9, 4.1, 0.8, { fontSize: 13, bold: true, color: C.green, margin: 0, fontFace: MONO });
  text(s, "s = √n 时，顺序分块的 ASL 取最小值 **√n + 1**。原书对照：n = 10000，分 100 块、每块 100 个——", 0.5, 2.95, 9, 0.4, { fontSize: 12 });
  table(s, [
    ["方法", "平均比较次数（n = 10000）"],
    ["顺序检索", { t: "约 5000", bold: true, color: C.bad }],
    ["分块检索（100 × 100）", { t: "101", bold: true, color: C.goldText }],
    ["二分检索", { t: "最多 14", bold: true, color: C.ok }],
  ], 0.5, 3.4, 5.0, [2.4, 2.6], { fontSize: 11.5, rowH: 0.34 });
  callout(s, "注意", "b ≈ √n 只是「索引顺序查、每块等长」这个成本模型下的选择；索引改用二分后最优块数会变化。**不是定义**。", 5.75, 3.4, 3.75, 1.7, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// block pros/cons + three compare
{
  const s = content("10.1.3", "10.1 线性表 · 分块检索", "分块的优缺点 & 线性表三种检索对比");
  callout(s, "优点：插入删除", [
    "只要找到结点应属的块，在块内插删即可。",
    "插入可以放在**块尾**；删除时把本块**最后一个记录**移到被删位置，不必移动大量结点。",
  ], 0.5, 1.05, 4.35, 1.75, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "代价与风险", [
    "多一个辅助索引数组；要先把表**分块排序**。",
    "大量插删使块中结点分布很不均匀时，**检索速度下降**。",
    "外存上常以一次 I/O 读取的一页作为一块。",
  ], 5.15, 1.05, 4.35, 1.75, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  table(s, [
    ["", "顺序检索", "二分检索", "分块检索"],
    [{ t: "对表的要求", bold: true }, "无，可任意排列", "有序 + 顺序存储", "块间有序，块内任意"],
    [{ t: "时间（平均/最差）", bold: true }, "Θ(n)", "Θ(log n)", "介于二者之间"],
    [{ t: "插入删除", bold: true }, "容易", "困难（移动元素）", "较容易（块内）"],
    [{ t: "一句话", bold: true }, { t: "效率最低，限制最少", color: C.bad }, { t: "效率最高，限制较多", color: C.ok }, { t: "介于二者之间", color: C.goldText }],
  ], 0.5, 3.0, 9.0, [1.8, 2.3, 2.4, 2.5], { fontSize: 11, rowH: 0.4 });
}

// teaching.hpp overview
{
  const s = content("10.1", "教学版 · teaching.hpp", "本章四件东西放在同一个文件里");
  const items = [
    ["sequential_search / binary_search", "线性表上的两种检索", "10.1", C.green],
    ["IntSet", "不重复整数集合与集合运算", "10.2", C.goldText],
    ["elf_hash", "ELF 散列函数", "10.3.1", C.dark],
    ["HashTable", "线性探测的闭散列表，含「墓碑」删除", "10.3.3–4", C.bad],
  ];
  items.forEach((it, i) => {
    const y = 1.1 + i * 0.72;
    card(s, 0.5, y, 5.6, 0.62, C.code);
    pill(s, it[2], 0.62, y + 0.14, 0.95, 0.34, it[3], C.white, 10);
    text(s, it[0], 1.7, y + 0.03, 4.3, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0, fontFace: MONO });
    text(s, it[1], 1.7, y + 0.32, 4.3, 0.26, { fontSize: 10.5, color: C.muted, margin: 0 });
  });
  callout(s, "与工程版 modern.hpp 的分工", "教学版把 `[[nodiscard]]` / `noexcept` 和压成一行的 if 分支全部展开，**其余逻辑一模一样**。", 6.35, 1.1, 3.15, 1.6, { fontSize: 10.5 });
  callout(s, "没有三法则", "这一章没有手写存储管理——`std::vector` 在这里只是「一块连续的槽位」，不是被替换掉的教学内容。", 6.35, 2.85, 3.15, 1.4, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "源码：code/ch10/search_hash/ —— teaching.hpp · modern.hpp · modern.py · demo.cpp · test.cpp。后面各节就是把它拆开逐段讲。", 0.5, 4.1, 5.6, 0.95, { fontSize: 10.5, color: C.muted });
}

// ============================ PART 2 ============================
sectionSlide("10.2", "集合的检索", "集合只关心一个元素在不在里面\n数学特性 · IntSet 接口 · 位向量");

// 10.2.1 math
{
  const s = content("10.2.1", "10.2 集合 · 数学特性", "集合：确定的、相异的对象，次序无关");
  bullets(s, [
    "集合由若干个**确定的、相异的**对象构成；一个集合中不包含两个完全相同的元素。",
    "**{1,4} 和 {4,1} 是同一个集合**——元素的次序无关紧要。",
    "元素多时用 `{x | x 应满足的条件}`，条件是一个谓词。元素个数为零的是**空集** ∅。",
  ], 0.5, 1.05, 4.6, 2.3, { fontSize: 12, gap: 8 });
  table(s, [
    ["关系 / 运算", "定义"],
    [{ t: "成员 x ∈ A", bold: true }, "x 是 A 的元素（最基本）"],
    [{ t: "子集 A ⊆ B", bold: true }, "A 的每个元素都在 B 中；B 是 A 的超集"],
    [{ t: "并 A ∪ B", bold: true }, "至少属于 A、B 之一"],
    [{ t: "交 A ∩ B", bold: true }, "A、B 的共同元素"],
    [{ t: "差 A − B", bold: true }, "属于 A 但不属于 B"],
    [{ t: "幂集 P(A)", bold: true }, "A 的所有子集的全体"],
  ], 5.35, 1.05, 4.15, [1.35, 2.8], { fontSize: 10.5, rowH: 0.34 });
  card(s, 0.5, 3.45, 4.6, 1.65, C.code);
  text(s, "例：A = {1,2,a,b,c}，B = {1,3,b,d}", 0.65, 3.52, 4.4, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  text(s, "A ∪ B = {1,2,3,a,b,c,d}\nA ∩ B = {1,b}\nA − B = {2,a,c}\nA = {a,b,c} 时 P(A) 有 8 个元素", 0.65, 3.85, 4.4, 1.2, { fontSize: 11, margin: 0, fontFace: MONO });
  text(s, "每个集合都是其本身的子集；空集是任何集合的子集。A ⊆ B 且 A ≠ B 才是真子集。", 5.35, 3.85, 4.15, 0.8, { fontSize: 10.5, color: C.goldText, bold: true, margin: 0 });
}

// set interface semantics
{
  const s = content("10.2.1", "10.2 集合 · 接口口径", "「x 属于 S」是一个命题，不是一个位置");
  card(s, 0.5, 1.05, 4.35, 2.35, C.code);
  text(s, "可预期的失败 → 返回 bool", 0.7, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "插入一个**已经在里面**的键 → `false`",
    "删除一个**不在里面**的键 → `false`",
    "都是正常、可预期的失败：返回「没做成」，**不抛异常、不打印一行**。",
  ], 0.65, 1.5, 4.1, 1.85, { fontSize: 11.5, gap: 6 });
  card(s, 5.15, 1.05, 4.35, 2.35, C.code);
  text(s, "空集的两个方向", 5.35, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "对任意元素都有 **x ∉ ∅**；",
    "但子集关系方向不同：**任何集合都包含空集**，空集也包含自身。",
  ], 5.3, 1.5, 4.1, 1.85, { fontSize: 11.5, gap: 6 });
  text(s, "可拿来测试的代数性质", 0.5, 3.55, 9, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const props = ["A ∩ B = B ∩ A", "A ∩ A = A", "A ∩ ∅ = ∅", "A ⊇ A", "A ⊇ ∅"];
  props.forEach((p, i) => pill(s, p, 0.5 + i * 1.82, 3.95, 1.65, 0.42, i < 3 ? C.green : C.goldText, C.white, 12));
  text(s, "示例测试不只核对一次结果，还要用这些性质防止实现「碰巧对一组输入」。", 0.5, 4.55, 9, 0.4, { fontSize: 11.5, color: C.muted, margin: 0 });
}

// 10.2.2 computer sets
{
  const s = content("10.2.2", "10.2 集合 · 计算机中的集合", "基类型、幂集，以及同一接口下的不同结构");
  card(s, 0.5, 1.05, 9.0, 1.3, C.dark);
  text(s, "计算机所支持的集合，其**基类型**一般是有限、顺序类型。集合类型的值集是其基类型值集的**幂集**，集合类型的每个值是幂集的一个子集。", 0.75, 1.12, 8.5, 0.7, { fontSize: 12.5, color: C.white, margin: 0 });
  text(s, "→ 给全集每个元素分配一个二进制位，一个集合就正好是一个**位串**（后面的位向量）。", 0.75, 1.85, 8.5, 0.4, { fontSize: 11.5, color: C.gold, margin: 0 });
  table(s, [
    ["底层结构", "contains 代价", "适合"],
    ["线性表 + 顺序检索（本章 IntSet）", "O(n)", "很小的集合，实现简单"],
    ["有序表 + 二分", "O(log n)", "少改动、常查询"],
    ["二叉搜索树", "与树高相关", "需要有序遍历"],
    ["散列表", "期望 O(1)", "规模大、精确查"],
    ["位向量", "O(1)", "全集固定而且不大"],
  ], 0.5, 2.55, 5.8, [2.9, 1.3, 1.6], { fontSize: 10.5, rowH: 0.36 });
  callout(s, "先把接口钉死", "`insert` / `erase` 返回 `bool`，`contains` 只回答在不在，`intersection` 和 `includes` 用检索组合出来。**换成散列表时，调用方不用改。**", 6.55, 2.55, 2.95, 2.55, { fontSize: 10.5 });
}

// IntSet code 1
{
  const s = content("10.2.2", "10.2 集合 · teaching.hpp · IntSet（上）", "insert / erase / contains：都落到顺序检索");
  codeBlock(s, `class IntSet {
public:
    // 插入。已经有了就返回 false——集合不含重复元素，这是可预期状态，不是错误。
    bool insert(int value) {
        if (contains(value)) {
            return false;
        }
        values_.push_back(value);
        return true;
    }

    bool erase(int value) {
        std::optional<std::size_t> found = sequential_search(values_, value);
        if (!found) {
            return false;
        }
        values_.erase(values_.begin() + static_cast<std::ptrdiff_t>(*found));
        return true;
    }

    bool contains(int value) const {
        return sequential_search(values_, value).has_value();
    }
    // ...`, 0.5, 1.05, 6.3, 4.1, { fontSize: 8.5, hl: [13, 22] });
  callout(s, "三个运算", [
    "`insert`：先 `contains` 查重，没有才 `push_back`。",
    "`erase`：用 `sequential_search` 拿到下标，再从 vector 里删掉。",
    "`contains`：顺序检索 `has_value()`。",
  ], 7.05, 1.05, 2.45, 2.55, { fontSize: 10 });
  callout(s, "代价", "每个运算都是 **O(n)**——瓶颈全在「查一个元素在不在」。", 7.05, 3.75, 2.45, 1.35, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// IntSet code 2
{
  const s = content("10.2.2", "10.2 集合 · teaching.hpp · IntSet（下）", "intersection / includes：用 contains 组合出来");
  codeBlock(s, `    // ...
    // 交集：本集合里凡是对方也有的，都收进结果。
    IntSet intersection(const IntSet& other) const {
        IntSet result;
        for (int value : values_) {
            if (other.contains(value)) {
                (void)result.insert(value);
            }
        }
        return result;
    }

    // 包含：对方的每个元素本集合都得有。
    bool includes(const IntSet& other) const {
        for (int value : other.values_) {
            if (!contains(value)) {
                return false;
            }
        }
        return true;
    }

    std::size_t size() const { return values_.size(); }

private:
    std::vector<int> values_;
};`, 0.5, 1.05, 6.0, 4.1, { fontSize: 8.5 });
  card(s, 6.75, 1.05, 2.75, 1.6, C.dark);
  text(s, "交集的代价", 6.9, 1.12, 2.5, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "O(n·m)", 6.9, 1.45, 2.5, 0.6, { fontSize: 30, bold: true, color: C.white, margin: 0, fontFace: MONO });
  text(s, "n 次循环 × 每次 O(m) 的 contains", 6.9, 2.1, 2.5, 0.45, { fontSize: 9.5, color: C.mint, margin: 0 });
  callout(s, "10.3 节的伏笔", "散列就是来把 `contains` 的 **O(n) 压成 O(1)** 的——**接口一个字都不用改**。", 6.75, 2.8, 2.75, 1.3, { fontSize: 10.5 });
  callout(s, "(void)", "交集里 `insert` 不会失败（`values_` 无重复），`(void)` 表明有意忽略返回值。", 6.75, 4.2, 2.75, 0.9, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
}

// bit vector
{
  const s = content("10.2.2", "10.2 集合 · 位向量", "有限全集上的位表示：交并差 = 按位与 / 或 / A & ~B");
  text(s, "全集 `{a,b,c,d,e,f,g,h}`，**从低位到高位**依次对应这 8 个元素（位串右端是 a）：", 0.5, 1.02, 9, 0.35, { fontSize: 12 });
  const letters = ["h", "g", "f", "e", "d", "c", "b", "a"];
  const rows = [
    ["A = {a,c,f}", "00100101"],
    ["B = {b,c,f,g}", "01100110"],
    ["A ∩ B = {c,f}", "00100100"],
    ["A ∪ B = {a,b,c,f,g}", "01100111"],
    ["A \\ B = {a}", "00000001"],
  ];
  const cx = 3.0, cw = 0.42;
  letters.forEach((l, i) => text(s, l, cx + i * cw, 1.42, cw, 0.25, { fontSize: 10, bold: true, color: C.muted, align: "center", margin: 0 }));
  rows.forEach((r, k) => {
    const y = 1.7 + k * 0.5;
    text(s, r[0], 0.5, y, 2.4, 0.4, { fontSize: 11.5, bold: true, color: k >= 2 ? C.goldText : C.dark, valign: "middle", margin: 0 });
    const bits = r[1].split("");
    cells(s, cx, y, bits, { cw, ch: 0.4, fs: 12, fills: bits.map((b) => (b === "1" ? (k >= 2 ? C.cream : "CDEBD9") : C.white)) });
    const op = ["", "", "A & B", "A | B", "A & ~B"][k];
    if (op) text(s, op, cx + 8 * cw + 0.15, y, 1.2, 0.4, { fontSize: 11, bold: true, fontFace: MONO, color: C.green, valign: "middle", margin: 0 });
  });
  callout(s, "位向量（bitmap）", [
    "一次机器指令并行处理 **32 或 64** 个元素。",
    "「属于」只需检查对应位；并交差只改比特位，**不移动数据**。",
  ], 7.25, 1.42, 2.25, 2.4, { fontSize: 10, gap: 4 });
  text(s, "集合比数组的操作更加便捷：数组的插入删除要大量移动数据，而集合的并、交、差只需修改相应比特位。", 0.5, 4.3, 9, 0.6, { fontSize: 11, color: C.muted });
}

// example 10.1 odd primes
{
  const s = content("10.2.2", "10.2 集合 · 位向量 · 例 10.1", "0～15 之间的奇素数：一次按位与完成求交");
  text(s, "位向量**从右到左**表示自然数 0～15（最右一位是 0）：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  const cw = 0.36, cx = 2.9;
  for (let i = 0; i < 16; i++) text(s, String(15 - i), cx + i * cw, 1.45, cw, 0.25, { fontSize: 8.5, color: C.muted, align: "center", margin: 0 });
  const rows = [
    ["素数 {13,11,7,5,3,2}", "0010100010101100", "CDEBD9"],
    ["奇数 {15,13,…,3,1}", "1010101010101010", C.mint],
    ["按位与 = 奇素数", "0010100010101000", C.cream],
  ];
  rows.forEach((r, k) => {
    const y = 1.75 + k * 0.62;
    text(s, r[0], 0.5, y, 2.35, 0.42, { fontSize: 11, bold: true, color: k === 2 ? C.goldText : C.dark, valign: "middle", margin: 0 });
    const bits = r[1].split("");
    cells(s, cx, y, bits, { cw, ch: 0.42, fs: 11, fills: bits.map((b) => (b === "1" ? r[2] : C.white)) });
  });
  card(s, 0.5, 3.75, 4.35, 1.35, C.dark);
  text(s, "结果", 0.7, 3.82, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "{13, 11, 7, 5, 3}", 0.7, 4.15, 4, 0.55, { fontSize: 24, bold: true, color: C.white, margin: 0 });
  callout(s, "代价与前提", [
    "空间与**全集大小**成正比：十亿个可能值只出现几十个时很浪费，改用散列或树。",
    "要先**固定「元素 → 位号」映射**，否则同样的位串可能代表不同集合。",
  ], 5.15, 3.75, 4.35, 1.35, { fontSize: 10, gap: 3 });
}

// ============================ PART 3 ============================
sectionSlide("10.3", "散列方法", "不比较，直接根据关键码算出存储地址\n散列函数 · 开散列 · 闭散列与墓碑 · 效率分析");

// why hashing
{
  const s = content("10.3", "10.3 散列 · 基本思想", "能不能不比较，直接算出地址？");
  bullets(s, [
    "前面的检索都**基于关键码比较**：顺序、分块靠「等于 / 不等于」，二分、树形靠「大于 / 等于 / 小于」。",
    "**这些方法的平均检索长度都与 n 有关**，n 很大时用户可能无法忍受。",
    "启发：读数组元素 `a[i]` 是由起始地址和下标**直接算出来**的，Θ(1)，与 n 无关。",
  ], 0.5, 1.05, 5.3, 2.5, { fontSize: 12, gap: 8 });
  // diagram
  card(s, 6.0, 1.05, 3.5, 2.5, C.code);
  pill(s, "关键码 K", 6.2, 1.25, 1.3, 0.4, C.green, C.white, 11);
  s.addShape(pres.shapes.LINE, { x: 7.55, y: 1.45, w: 0.4, h: 0, line: { color: C.green, width: 2, endArrowType: "triangle" } });
  pill(s, "h(K)", 8.0, 1.25, 1.3, 0.4, C.dark, C.gold, 11);
  s.addShape(pres.shapes.LINE, { x: 8.65, y: 1.7, w: 0, h: 0.4, line: { color: C.green, width: 2, endArrowType: "triangle" } });
  cells(s, 6.35, 2.2, ["", "", "", "K", "", ""], { cw: 0.45, ch: 0.4, idx: true, fills: [C.white, C.white, C.white, C.cream, C.white, C.white] });
  text(s, "散列表：每个位置叫一个槽（slot）", 6.1, 2.95, 3.3, 0.5, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  callout(s, "散列方法的主要思想", "以关键码 K 为自变量，通过**散列函数** h(K) 算出函数值，解释为结点的存储地址，把关键码和属性一起存进去；检索时用同样的方法算地址，到那个单元里取。按这种方式构造的存储结构叫**散列表**（hash table）。", 0.5, 3.7, 9.0, 1.4, { fontSize: 11.5 });
}

// example 10.2
{
  const s = content("10.3", "10.3 散列 · 例 10.2", "冲突是怎么来的：14 个关键字放进 26 个槽");
  text(s, "h₁(K) = K[0] − 'a'：(and, array)、(else, end)、(while, with) **三对冲突**。改成首尾字母序号的平均值：", 0.5, 1.02, 5.6, 0.6, { fontSize: 11.5 });
  text(s, "h₂(K) = (K[0] + K[last] − 2×'a') / 2", 0.5, 1.62, 5.6, 0.35, { fontSize: 12.5, bold: true, color: C.green, fontFace: MONO, margin: 0 });
  const kw = [["and", "a+d", "(0+3)/2", "1"], ["array", "a+y", "(0+24)/2", "12"], ["begin", "b+n", "(1+13)/2", "7"], ["do", "d+o", "(3+14)/2", "8"], ["else", "e+e", "(4+4)/2", "4"], ["end", "e+d", "(4+3)/2", "3"], ["for", "f+r", "(5+17)/2", "11"]];
  const kw2 = [["go", "g+o", "(6+14)/2", "10"], ["if", "i+f", "(8+5)/2", "6"], ["repeat", "r+t", "(17+19)/2", "18"], ["then", "t+n", "(19+13)/2", "16"], ["until", "u+l", "(20+11)/2", "15"], ["while", "w+e", "(22+4)/2", "13"], ["with", "w+h", "(22+7)/2", "14"]];
  const mk = (arr) => [["K", "首+尾", "计算", "h₂"], ...arr.map((r) => [{ t: r[0], mono: true }, r[1], r[2], { t: r[3], bold: true, color: C.green }])];
  table(s, mk(kw), 0.5, 2.1, 2.75, [0.7, 0.55, 0.95, 0.55], { fontSize: 9, rowH: 0.29, tight: true, align: "center" });
  table(s, mk(kw2), 3.35, 2.1, 2.75, [0.7, 0.55, 0.95, 0.55], { fontSize: 9, rowH: 0.29, tight: true, align: "center" });
  text(s, "整数除法向下取整；14 个值两两不同 → 无冲突", 0.5, 4.5, 5.6, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  card(s, 6.35, 1.02, 3.15, 3.35, C.code);
  image(s, "fig-10-5", 6.45, 1.08, 2.95, 3.2);
  text(s, "图 10.5　26 个槽装 14 个关键码，空槽是有意留的", 6.35, 4.42, 3.15, 0.5, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
}

// load factor, collision
{
  const s = content("10.3", "10.3 散列 · 术语", "负载因子、冲突与同义词");
  card(s, 0.5, 1.05, 2.85, 1.9, C.dark);
  text(s, "负载因子", 0.7, 1.12, 2.5, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "α = N / M", 0.7, 1.45, 2.5, 0.6, { fontSize: 26, bold: true, color: C.white, margin: 0, fontFace: MONO });
  text(s, "M：表的空间大小\nN：填入的结点数（又称装填因子）", 0.7, 2.1, 2.55, 0.8, { fontSize: 9.5, color: C.mint, margin: 0 });
  bullets(s, [
    "一般情况下**散列表的空间必须比结点的集合大**：浪费一些空间，换取检索效率。",
    "散列函数对不相等的关键码算出相同地址叫**冲突**（collision），这两个关键码称为该散列函数的**同义词**。",
    "实际应用中很少有不产生冲突的散列函数，必须考虑冲突时怎么办。",
  ], 3.6, 1.05, 5.9, 1.95, { fontSize: 11.5, gap: 6 });
  text(s, "采用散列技术时的两个首要问题", 0.5, 3.15, 9, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const qs = [["①", "如何构造使结点「分布均匀」的散列函数", "→ 10.3.1"], ["②", "一旦发生冲突，用什么方法解决", "→ 10.3.2–10.3.3"]];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 3.55, 4.35, 0.8, C.code);
    text(s, q[0], x + 0.15, 3.55, 0.4, 0.8, { fontSize: 20, bold: true, color: C.goldText, valign: "middle", margin: 0 });
    text(s, q[1], x + 0.6, 3.6, 3.6, 0.4, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, q[2], x + 0.6, 3.98, 3.6, 0.3, { fontSize: 10.5, color: C.green, margin: 0 });
  });
  text(s, "代价：散列**不保持键的次序**，不能按范围遍历；装载因子过高或散列不均匀时冲突变多，会退化成接近线性。", 0.5, 4.5, 9, 0.55, { fontSize: 11, color: C.bad });
}

// 10.3.1 principles + modulo
{
  const s = content("10.3.1", "10.3 散列 · 散列函数", "三条原则 · 1. 除余法 h(x) = x mod M");
  const pr = ["运算尽可能简单", "值域必须在散列表范围内", "尽可能使结点均匀分布"];
  pr.forEach((p, i) => pill(s, p, 0.5 + i * 3.05, 1.05, 2.85, 0.42, C.green, C.white, 11.5));
  card(s, 0.5, 1.65, 4.35, 2.3, RED);
  text(s, "M 挑不好会怎样", 0.7, 1.72, 4, 0.3, { fontSize: 12.5, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "**M 为偶数**：x 偶则 h(x) 偶、x 奇则 h(x) 奇；偶数键多就不匀。",
    "**M = 2ᵏ**：h(x) 只是 x 二进制**最右 k 位**。",
    "**M = 10ᵏ**：只是最右 k 个十进制位。",
    "它们**不依赖 x 的全部比特位**，不合要求。",
  ], 0.65, 2.08, 4.1, 1.85, { fontSize: 10.5, gap: 4 });
  card(s, 5.15, 1.65, 4.35, 2.3, GREENBG);
  text(s, "通常选一个质数作 M", 5.35, 1.72, 4, 0.3, { fontSize: 12.5, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "x mod M 就依赖于 x 的**所有位**，增大均匀分布的可能。",
    "优点：实现简单；M 可运行时确定；常数时间。",
    "要选与数据规律**无公因子**的素数。",
  ], 5.3, 2.08, 4.1, 1.85, { fontSize: 10.5, gap: 4 });
  callout(s, "潜在缺点", "**连续的关键码映射成连续的散列值**：能保证连续键不冲突，但要占据连续的数组单元，在某些实现中可能降低检索性能。", 0.5, 4.1, 9.0, 1.0, { fontSize: 11 });
}

// multiplicative & mid-square
{
  const s = content("10.3.1", "10.3 散列 · 散列函数", "2. 乘余取整法 · 3. 平方取中法");
  card(s, 0.5, 1.05, 4.35, 4.05, C.code);
  text(s, "2. 乘余取整法", 0.7, 1.12, 4, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "hash(K) = ⌊ n × (A × K mod 1) ⌋", 0.7, 1.55, 4.0, 0.35, { fontSize: 12, bold: true, color: C.green, fontFace: MONO, margin: 0 });
  bullets(s, [
    "K 乘常数 A（0 < A < 1），取乘积的**小数部分**，再乘整数 n 向下取整。",
    "优点：**对 n 的选择无关紧要**。地址空间 p 位时取 n = 2ᵖ，地址就是 A×K 小数点后最左 p 位。",
    "Knuth：A 可取任何值，最佳选择与数据特征有关；一般取**黄金分割** A = (√5 − 1)/2 ≈ 0.6180339 最理想。",
  ], 0.65, 2.0, 4.1, 3.0, { fontSize: 11, gap: 7 });
  card(s, 5.15, 1.05, 4.35, 4.05, C.code);
  text(s, "3. 平方取中法", 5.35, 1.12, 4, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "整数相除通常比相乘慢——有意避开除余法的除法可以提高运行速度。",
    "做法：先求关键码的**平方**以扩大相近数的差别，再根据表长**取中间几位**（往往取二进制位）。",
    "为什么均匀：乘积的中间几位与乘数的**每一数位都相关**。",
  ], 5.3, 1.55, 4.1, 2.6, { fontSize: 11, gap: 7 });
  text(s, "平方取中和折叠都试图把关键码不同位置的信息**混在一起**。", 5.35, 4.3, 4.0, 0.7, { fontSize: 10.5, bold: true, color: C.goldText, margin: 0 });
}

// digit analysis & radix
{
  const s = content("10.3.1", "10.3 散列 · 散列函数", "4. 数字分析法 · 5. 基数转换法");
  card(s, 0.5, 1.05, 4.35, 4.05, C.code);
  text(s, "4. 数字分析法", 0.7, 1.12, 4, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "n 个 d 位数，每位可能有 r 种符号；选**各种符号分布均匀**的若干位作地址。均匀度：", 0.7, 1.5, 4.0, 0.7, { fontSize: 10.5, margin: 0 });
  text(s, "λₖ = Σᵢ (αᵢᵏ − n/r)²", 0.7, 2.2, 4.0, 0.4, { fontSize: 14, bold: true, color: C.green, margin: 0, align: "center" });
  text(s, "αᵢᵏ：第 i 个符号在第 k 位出现的次数；**λₖ 越小越均匀**。", 0.7, 2.65, 4.0, 0.5, { fontSize: 10, color: C.muted, margin: 0 });
  text(s, "例 10.5 学号形态：", 0.7, 3.2, 4, 0.3, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  text(s, "992148  991269  990527\n991630  991805", 0.7, 3.5, 4, 0.55, { fontSize: 12, fontFace: MONO, margin: 0 });
  text(s, "前三位几乎不变——取它们做地址等于把所有记录**挤进同一个槽**。", 0.7, 4.15, 4.0, 0.8, { fontSize: 10.5, color: C.bad, margin: 0 });
  card(s, 5.15, 1.05, 4.35, 4.05, C.code);
  text(s, "5. 基数转换法", 5.35, 1.12, 4, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "把关键码看成另一种进制的数，再转换成原来进制，选其中几位作地址。", 5.35, 1.5, 4.0, 0.55, { fontSize: 10.5, margin: 0 });
  text(s, "210485₁₃\n= 2×13⁵ + 1×13⁴ + 0×13³\n  + 4×13² + 8×13 + 5\n= 742586 + 28561 + 0\n  + 676 + 104 + 5\n= 771932₁₀", 5.35, 2.1, 4.0, 1.7, { fontSize: 11, fontFace: MONO, margin: 0 });
  text(s, "表长 10000 → 取低 4 位 **1932**", 5.35, 3.85, 4.0, 0.3, { fontSize: 11.5, bold: true, color: C.green, margin: 0 });
  text(s, "通常要求两个基数**互素**，且新基数比原基数大。", 5.35, 4.25, 4.0, 0.6, { fontSize: 10.5, color: C.goldText, bold: true, margin: 0 });
}

// folding
{
  const s = content("10.3.1", "10.3 散列 · 散列函数", "6. 折叠法：ISBN 0-442-20586-4 → 4 位地址");
  bullets(s, [
    "关键码位数很多、平方取中太复杂时：把关键码分割成位数相同的几部分（最后一部分可以不同），取叠加和（**舍去进位**）。",
    "馆藏书不到 10000 种时，用 10 位 ISBN 构造 4 位散列函数：从低位起分成 **5864 | 4220 | 04**。",
  ], 0.5, 1.05, 5.0, 1.8, { fontSize: 11.5, gap: 7 });
  card(s, 5.75, 1.05, 3.75, 1.85, C.code);
  image(s, "fig-10-6", 5.85, 1.12, 3.55, 1.7);
  table(s, [
    ["", "移位叠加", "分界叠加"],
    ["做法", "各段直接按位相加", "相邻段反向后再加（4220 → 0224）"],
    ["算式", { t: "5864 + 4220 + 04 = [1]0088", mono: true }, { t: "5864 + 0224 + 04 = 6092", mono: true }],
    ["h(K)", { t: "0088", bold: true, color: C.green }, { t: "6092", bold: true, color: C.green }],
  ], 0.5, 3.05, 9.0, [1.0, 3.6, 4.4], { fontSize: 10.5, rowH: 0.34 });
  text(s, "比喻：分界叠加是把数字写在透明纸上、从低位**折起来**再相加；移位叠加是沿折缝**裁开**再相加。无论哪种，最后仍要对表长取模。", 0.5, 4.5, 9, 0.6, { fontSize: 10.5, color: C.muted });
}

// ELFhash description
{
  const s = content("10.3.1", "10.3 散列 · 散列函数", "7. ELFhash：UNIX System V R4 的字符串散列");
  text(s, "用于 ELF（executable and linking format）文件格式。结果 h 初始为 0，对每个字符：", 0.5, 1.02, 9, 0.35, { fontSize: 12 });
  const steps = [["左移加字", "h = (h << 4) + 当前字符"], ["取高 4 位", "g = h & 0xF0000000"], ["折回低位", "若 g ≠ 0：h ^= g >> 24"], ["清高 4 位", "h &= ~g"]];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.5, 2.1, 1.25, C.code);
    numCircle(s, i + 1, x + 0.12, 1.6, 0.36, i === 2 ? C.goldText : C.green);
    text(s, st[0], x + 0.55, 1.6, 1.5, 0.36, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, st[1], x + 0.12, 2.1, 1.9, 0.55, { fontSize: 9.5, fontFace: MONO, color: C.green, margin: 0 });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: x + 2.1, y: 2.12, w: 0.2, h: 0, line: { color: C.green, width: 1.5, endArrowType: "triangle" } });
  });
  text(s, "最后得到的长整数 h 对散列表长取余，就是在表中的位置。", 0.5, 2.9, 9, 0.3, { fontSize: 11.5, margin: 0 });
  callout(s, "为什么好用", [
    "对长字符串和短字符串都很有效。",
    "**字符串中每个字符都有同样的作用**。",
    "能比较均匀地把字符串分布在散列表中。",
  ], 0.5, 3.35, 4.35, 1.75, { fontSize: 11 });
  callout(s, "它不是什么", "ELFHash **不是密码学散列**：只求快和够匀，不抗碰撞、不抗逆向，**不能拿它保存密码**。", 5.15, 3.35, 4.35, 1.75, { fontSize: 11, fill: RED, tcolor: C.bad });
}

// elf_hash code
{
  const s = content("10.3.1", "10.3 散列 · teaching.hpp", "elf_hash：逐字节读 unsigned char");
  codeBlock(s, `// 【算法10.8】ELF 散列：把字符串搅成一个整数。
//
// 逐字节读的是 \`unsigned char\` 而不是 \`char\`——\`char\` 在多数平台上是有符号的，
// 中文等非 ASCII 字节会变成负数，一进位运算就带出符号扩展，散列值随平台而变。
inline std::size_t elf_hash(const std::string& text) {
    std::size_t hash = 0;
    for (unsigned char character : text) {
        hash = (hash << 4U) + character;        // 左移 4 位，腾出位置放新字节
        std::size_t high_bits = hash & 0xF0000000U;   // 溢出到高 4 位的那部分
        if (high_bits != 0) {
            hash ^= high_bits >> 24U;           // 折回低位，别让它白白丢掉
        }
        hash &= ~high_bits;                     // 再把高 4 位清掉
    }
    return hash;
}`, 0.5, 1.05, 9.0, 2.65, { fontSize: 9, hl: [7] });
  table(s, [
    ["字节（UTF-8「中」）", "h 的变化"],
    [{ t: "E4", mono: true }, { t: "0x0 << 4 + 0xE4 = 0xE4", mono: true }],
    [{ t: "B8", mono: true }, { t: "0xE40 + 0xB8 = 0xEF8", mono: true }],
    [{ t: "AD", mono: true }, { t: "0xEF80 + 0xAD = 0xF02D", mono: true, bold: true, color: C.ok }],
  ], 0.5, 3.85, 4.9, [1.7, 3.2], { fontSize: 10, rowH: 0.3 });
  callout(s, "测试守着的一条", "按无符号读得到 `0xF02D`；按有符号 `char` 读会被符号扩展成 `0xFFFFFF000FFF00DD`（本机实测）。两者天差地别，这一条能把两种写法分开。", 5.6, 3.85, 3.9, 1.25, { fontSize: 10 });
}

// evaluating hash functions
{
  const s = content("10.3.1", "10.3 散列 · 散列函数", "怎样评价一个散列函数");
  const items = [
    ["稳定", "同一键必须**稳定**得到同一地址。", C.green],
    ["便宜", "计算成本**不能比检索本身还贵**。", C.goldText],
    ["均匀", "在**实际键分布**上应尽量均匀——不能只拿一两个键试。", C.dark],
  ];
  items.forEach((it, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.1, 2.85, 1.6, C.code);
    pill(s, it[0], x + 0.2, 1.25, 1.1, 0.38, it[2], C.white, 12);
    text(s, it[1], x + 0.2, 1.75, 2.5, 0.85, { fontSize: 12, margin: 0 });
  });
  callout(s, "关键码本身有规律时", "例如学号末两位大量重复，直接取末位会把数据**挤进少数槽**。除留余数法常把表长选成与数据规律无公因子的素数；平方取中和折叠则试图把关键码不同位置的信息混在一起。", 0.5, 2.9, 5.6, 2.2, { fontSize: 11 });
  callout(s, "安全目标是另一回事", "密码学散列还要求**抗碰撞、抗逆向**。本章散列表不承担这些目标。", 6.35, 2.9, 3.15, 2.2, { fontSize: 11, fill: RED, tcolor: C.bad });
}

// 10.3.2 open hashing
{
  const s = content("10.3.2", "10.3 散列 · 开散列（拉链法）", "开散列：冲突的关键码存到主表之外");
  card(s, 0.5, 1.05, 3.4, 3.0, C.code);
  image(s, "fig-10-7", 0.6, 1.12, 3.2, 2.85);
  table(s, [
    ["K", "77", "7", "110", "95", "14", "75", "62"],
    ["K mod 11", "0", "7", "0", "7", "3", "9", "7"],
  ], 0.5, 4.2, 3.4, [0.9, 0.35, 0.3, 0.4, 0.35, 0.35, 0.35, 0.4], { fontSize: 9, rowH: 0.28, tight: true, align: "center" });
  bullets(s, [
    "两类冲突解决：**开散列**把冲突键存在主表**之外**；**闭散列**存在表中**另一个槽**。",
    "开散列 = 拉链法 = 分离链接（separate chaining）；这里的「开」指冲突元素移到槽外的链或桶中，**并非开放地址法**。",
    "每个槽挂一条链表，同址键串在这条链上。插入：算地址接到链上；查找、删除只在那一条链上走。",
    "删一个结点不影响别的链，**不存在「探测序列被截断」的问题**。",
  ], 4.15, 1.05, 5.35, 3.0, { fontSize: 11, gap: 5 });
  callout(s, "图 10.7", "11 个槽、h(K) = K mod 11，依次插入 77、7、110、95、14、75、62：第 0 槽 2 个、第 3 槽 1 个、第 7 槽 3 个、第 9 槽 1 个。", 4.15, 4.1, 5.35, 1.0, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// open hashing cost + bucket
{
  const s = content("10.3.2", "10.3 散列 · 开散列", "链长、α > 1，以及外存上的桶式散列");
  bullets(s, [
    "装载因子 α = n/m **可以大于 1**，链只是变长。",
    "链内无序时：成功查询平均看**半条链**（1 + α/2），失败查询看**整条链**。",
    "实现简单；空间上每个结点多一个指针。本章主实现是闭散列，开散列不另写一份。",
  ], 0.5, 1.05, 4.6, 2.2, { fontSize: 11.5, gap: 7 });
  card(s, 5.3, 1.05, 4.2, 2.05, C.code);
  image(s, "fig-10-8", 5.4, 1.12, 4.0, 1.9);
  text(s, "图 10.8　B 个存储桶的散列文件组织：h(K) 算出的是**桶号**；目录表存 B 个指针，桶由页块串成。", 5.3, 3.15, 4.2, 0.55, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "桶式散列的代价按访外次数计", "一次访外读目录表，再逐块查桶；平均访外次数约为桶内页块数的一半——**理想是每个桶只有一个页块**。文件增长后要重新组织、改散列函数并加长目录表。", 0.5, 3.35, 4.6, 1.75, { fontSize: 10.5 });
  callout(s, "拉链法的风险", "从「表满」变成「**某条链过长**」：分布不均或攻击者构造同址键时，单链退化成长度 n，查找回到 O(n)。工程库会**随机化散列种子**，或链过长时改用平衡树。", 5.3, 3.8, 4.2, 1.3, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// 10.3.3 closed hashing concept
{
  const s = content("10.3.3", "10.3 散列 · 闭散列（开地址法）", "闭散列：所有记录都住在表里，靠探查序列找空位");
  text(s, "每个关键码 K 有一个**基位置** d₀ = h(K)；被占了就沿**探查序列**找下一个：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  card(s, 0.5, 1.45, 9.0, 0.7, C.dark);
  text(s, "dᵢ = (d₀ + p(K, i)) mod M，   i = 1, 2, …        p(K, i)：探查函数", 0.7, 1.45, 8.6, 0.7, { fontSize: 15, bold: true, color: C.gold, valign: "middle", margin: 0, fontFace: MONO });
  const ops = [
    ["插入", "依次探查，把找到的**第一个开放空闲位置**作为存储位置；所有后继地址都不空 → 表满、报告溢出。", C.green],
    ["检索", "沿同样的序列找；成功返回该位置。**遇到开放的空闲地址，说明表中没有待查关键码。**", C.goldText],
    ["删除", "按同样的序列找到后，对该结点加**删除标记**（而不是标空）。", C.bad],
  ];
  ops.forEach((o, i) => {
    const y = 2.3 + i * 0.62;
    pill(s, o[0], 0.5, y + 0.1, 0.9, 0.38, o[2], C.white, 11.5);
    text(s, o[1], 1.55, y, 7.95, 0.58, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  callout(s, "一句话", "对闭散列表来说，**构造后继散列地址序列的方法，也就是处理冲突的方法**。现代资料多称「开放地址法」（open addressing）。", 0.5, 4.2, 9.0, 0.9, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// linear probing & clustering
{
  const s = content("10.3.3", "10.3 散列 · 闭散列 · 探查方法", "1. 线性探查 p(K, i) = i，以及它的毛病：聚集");
  text(s, "把表看成**环形**：在 d 冲突就依次探查 d+1, d+2, …, M−1, 0, 1, …, d−1；回到 d 则插入和检索都失败。", 0.5, 1.02, 9, 0.55, { fontSize: 12 });
  // cluster diagram
  const fills = [C.white, C.mint, C.mint, C.mint, C.mint, C.mint, C.white, C.white, C.mint, C.white];
  cells(s, 0.9, 1.9, ["", "a", "b", "c", "d", "e", "", "", "f", ""], { idx: true, cw: 0.5, fills });
  s.addShape(pres.shapes.LINE, { x: 1.4, y: 2.62, w: 2.5, h: 0, line: { color: C.bad, width: 1.5, dashType: "dash" } });
  text(s, "一段连续被占的槽：基地址落在 1～5 中任何一处的新键，最后都落到槽 6", 0.5, 2.7, 5.4, 0.5, { fontSize: 10, color: C.bad, margin: 0 });
  bullets(s, [
    "基地址不同的结点争夺相同的后继地址，称为**聚集**（堆积），也叫**基本聚集**（primary clustering）。",
    "原因：散列函数选择不当，或负载因子过大。",
    "**小的聚集可能汇合成大的聚集**，导致很长的探查序列。",
  ], 0.5, 3.3, 5.4, 1.8, { fontSize: 11, gap: 5 });
  callout(s, "原书例 10.7", "理想情况下每个空槽接收下一条记录的机会应该相等。但在那张表里：下一条记录放在第 11 槽的概率是 **2/15**，放到第 7 槽的概率却是 **11/15**。", 6.15, 1.9, 3.35, 3.2, { fontSize: 11 });
}

// improved linear, quadratic, random
{
  const s = content("10.3.3", "10.3 散列 · 闭散列 · 探查方法", "改进线性探查 · 2. 二次探查 · 3. 随机探查");
  const cols = [
    ["每次跳 c 格", "p(K,i) = i·c", ["**c 必须与 M 互素**：c = 2 且 M 为偶数时，偶数基位置只能走遍偶数槽。", "仍然纠缠：h(k₁)=3、h(k₂)=5 时序列是 3,5,7,9,… 和 5,7,9,…"]],
    ["2. 二次探查", "1², −1², 2², −2², …", ["后继地址**跳跃式**，为后续数据留空间，减少聚集。", "同义词来回散列在第一个地址的两端。", "缺点：**不易探查到整个表的所有位置**。"]],
    ["3. 随机探查", "(h(K) + rᵢ) mod M", ["不能真随机：检索时必须能**重建同样的序列**。", "rᵢ 是 1～M−1 的伪随机数序列，所有插入和检索用同一串。", "**要避免产生 0 或 M**：否则重复探查基地址。"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.05, 2.85, 4.05, C.code);
    text(s, c[0], x + 0.15, 1.12, 2.6, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    card(s, x + 0.15, 1.55, 2.55, 0.45, C.dark);
    text(s, c[1], x + 0.15, 1.55, 2.55, 0.45, { fontSize: 10.5, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0, fontFace: MONO });
    bullets(s, c[2], x + 0.1, 2.15, 2.65, 2.9, { fontSize: 10.5, gap: 6 });
  });
}

// double hashing
{
  const s = content("10.3.3", "10.3 散列 · 闭散列 · 探查方法", "4. 双散列探查：让步长也由关键码决定");
  text(s, "为避免**二级聚集**，探查序列应当是**关键码值的函数**，而不只是基位置的函数：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  card(s, 0.5, 1.45, 9.0, 0.7, C.dark);
  text(s, "dᵢ = (d + i · h₂(K)) mod M，  d = h₁(K)，  1 ≤ h₂(K) ≤ M−1", 0.7, 1.45, 8.6, 0.7, { fontSize: 14.5, bold: true, color: C.gold, valign: "middle", margin: 0, fontFace: MONO });
  bullets(s, [
    "h₂(K) 作为线性探查的**常数项**：不同关键码即使基地址相同，步长也不同。",
    "**h₂(K) 应尽量与 M 互素**，否则同义词地址循环计算，表未满就溢出。",
    "探查序列**跳跃式**散布在整个存储区；优点不易产生聚集，缺点计算量稍大。",
  ], 0.5, 2.3, 4.8, 2.8, { fontSize: 11.5, gap: 8 });
  table(s, [
    ["M 的取法", "h₂ 的取法"],
    ["M 为素数，h₁ = K mod M", { t: "K mod (M−2) + 1\n或 ⌊K/M⌋ mod (M−2) + 1", mono: true }],
    ["M = 2ᵐ", "返回 1～2ᵐ−1 之间的奇数"],
    ["M 任意，h₁ = K mod p（p：小于 M 的最大素数）", { t: "K mod q + 1（q：小于 p 的最大素数）", mono: false }],
  ], 5.5, 2.3, 4.0, [1.9, 2.1], { fontSize: 9.5, rowH: 0.5 });
  text(s, "最后一种不能保证 h₂(K) 与 M 互素，但还是常被采用。", 5.5, 4.55, 4.0, 0.5, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// comparison of probes
{
  const s = content("10.3.3", "10.3 散列 · 闭散列 · 探查方法", "四种探查怎么选：看聚集");
  table(s, [
    ["探查方法", "探查函数 p(K, i)", "基本聚集", "二级聚集", "代价"],
    [{ t: "线性探查", bold: true }, { t: "i", mono: true }, { t: "有", color: C.bad, bold: true }, { t: "有", color: C.bad }, "最简单（本书实现）"],
    [{ t: "二次探查", bold: true }, { t: "±1², ±2², …", mono: true }, { t: "消除", color: C.ok, bold: true }, { t: "有", color: C.bad }, "不易探遍全表"],
    [{ t: "随机探查", bold: true }, { t: "rᵢ（伪随机）", mono: false }, { t: "消除", color: C.ok, bold: true }, { t: "有", color: C.bad }, "序列要可重建"],
    [{ t: "双散列", bold: true }, { t: "i · h₂(K)", mono: true }, { t: "消除", color: C.ok, bold: true }, { t: "解决得较好", color: C.ok, bold: true }, "计算量稍大"],
  ], 0.5, 1.1, 9.0, [1.5, 2.1, 1.4, 1.6, 2.4], { fontSize: 11.5, rowH: 0.46 });
  callout(s, "二级聚集从哪来", "两个关键码散列到**同一个基地址**，若探查序列也相同就是二级聚集。二次、伪随机探查的序列**只是基地址的函数**，所以消不掉它。", 0.5, 3.55, 4.35, 1.55, { fontSize: 10.5 });
  callout(s, "好的探查函数", [
    "能够探查散列表中的**所有槽**；",
    "两个关键码的基地址或中间序列偶然会合时，最终**也能岔开**。",
  ], 5.15, 3.55, 4.35, 1.55, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// deletion problem
{
  const s = content("10.3.3", "10.3 散列 · 闭散列 · 删除", "删除是闭散列的难点：不能把槽直接标成空");
  codeBlock(s, `// 删除是这里唯一的难点。直接把槽位标成「空」是**错的**：
//
//   假设 A 和 B 的基地址都是 3，A 占了 3，B 探测一格住进 4。
//   现在删掉 A，把 3 标成空。再查 B：从 3 开始，看到「空」就认定 B 不在表里——
//   可 B 明明就在 4 号槽。**探测链被这个空格截断了。**
//
// 所以删除只能把槽位标成**墓碑**(tombstone)：查找路过它继续往下走，
// 插入则可以覆盖它。三种状态因此缺一不可。`, 0.5, 1.05, 9.0, 1.6, { fontSize: 9.5 });
  text(s, "表长 5，1、6、11 基地址都是 1：删掉 1 后若标空——", 0.5, 2.8, 5, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  cells(s, 0.9, 3.55, ["空", "空", "6", "11", "空"], { idx: true, cw: 0.62, fs: 11, fills: [C.white, "F9D5D0", C.mint, C.mint, C.white], colors: [C.muted, C.bad] });
  arrowLabel(s, "查 6 从这里开始", 0.9 + 1.5 * 0.62, 3.55, C.bad);
  text(s, "看到「空」就停 → 误判「从未插入过 6」", 0.5, 4.25, 4.8, 0.3, { fontSize: 11, bold: true, color: C.bad, margin: 0 });
  text(s, "原书图 10.9：41、15 都散列到槽 2，15 放在槽 3；删 41 后槽 2 失去了对 15 的「探查导引作用」，**15 被漏检**。", 0.5, 4.6, 4.8, 0.55, { fontSize: 10, color: C.muted, margin: 0 });
  callout(s, "把后面的记录前移？也不行", "有人想把探查序列之后的记录逐步前移，或把序列最后一个记录填进空位——都不可取：**一个单元可能不只处于一个探查序列中**（聚集），会挪动其他同义词表中的记录。", 5.5, 2.8, 4.0, 2.3, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// tombstone state table
{
  const s = content("10.3.3", "10.3 散列 · 闭散列 · 墓碑", "三种状态：空 / 占用 / 墓碑——完整状态变化");
  const T = { t: "墓碑", bold: true, color: C.white, fill: C.goldText, align: "center" };
  const E = { t: "空", color: C.muted, align: "center" };
  const V = (v, hl) => ({ t: String(v), bold: true, align: "center", fill: hl ? "CDEBD9" : undefined });
  table(s, [
    ["操作", "槽 0", "槽 1", "槽 2", "槽 3", "槽 4", "说明"],
    ["初始", { ...E }, { ...E }, { ...E }, { ...E }, { ...E }, "—"],
    [{ t: "插入 1", bold: true }, { ...E }, V(1, true), { ...E }, { ...E }, { ...E }, "home(1) = 1"],
    [{ t: "插入 6", bold: true }, { ...E }, V(1), V(6, true), { ...E }, { ...E }, "1 冲突，探测到 2"],
    [{ t: "插入 11", bold: true }, { ...E }, V(1), V(6), V(11, true), { ...E }, "连续冲突，探测到 3"],
    [{ t: "删除 1", bold: true, color: C.bad }, { ...E }, { ...T }, V(6), V(11), { ...E }, "探测链不能截断"],
    [{ t: "查找 11", bold: true }, { ...E }, { ...T }, V(6), V(11, true), { ...E }, "越过墓碑，在 3 命中"],
    [{ t: "插入 16", bold: true, color: C.ok }, { ...E }, V(16, true), V(6), V(11), { ...E }, "记住首个墓碑，确认无重复后复用"],
  ], 0.5, 1.05, 9.0, [1.1, 0.75, 0.75, 0.75, 0.75, 0.75, 4.15], { fontSize: 11, rowH: 0.38 });
  callout(s, "墓碑的语义", "「这里曾经有元素，被删掉了，但探测链还要继续往下走」。检索时可把墓碑看成**不等于任何关键码的特殊值**——检索算法几乎不用改。", 0.5, 4.2, 9.0, 0.9, { fontSize: 11 });
}

// insertion must not stop at tombstone
{
  const s = content("10.3.3", "10.3 散列 · 闭散列 · 墓碑", "插入：回收墓碑，但不能一看到墓碑就停");
  card(s, 0.5, 1.05, 4.35, 2.6, RED);
  text(s, "✗ 碰到墓碑就立刻写入", 0.7, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  text(s, "表长 7：3 在槽 3、10 被挤到槽 4；删 3 后再插 10——", 0.7, 1.5, 4.0, 0.5, { fontSize: 10.5, margin: 0 });
  cells(s, 1.0, 2.35, ["", "", "", "10", "10", "", ""], { idx: true, cw: 0.48, fs: 11, fills: [C.white, C.white, C.white, "F9D5D0", C.mint, C.white, C.white] });
  text(s, "同一个键被插了两遍", 0.7, 2.95, 4.0, 0.3, { fontSize: 11, bold: true, color: C.bad, margin: 0 });
  card(s, 5.15, 1.05, 4.35, 2.6, GREENBG);
  text(s, "✓ 记住首个墓碑，继续走", 5.35, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "沿探查序列一直走到**真正的空槽**或**找到同键**为止。",
    "发现同键 → 插入失败（返回 `false`）。",
    "走到空槽 → 回头在**第一个墓碑**处插入。",
  ], 5.3, 1.5, 4.1, 2.1, { fontSize: 11, gap: 6 });
  callout(s, "为什么要回收墓碑", "删除后释放的槽应能为将来的插入使用。不回收的话，表用久了**探测链只会越来越长**。", 0.5, 3.8, 4.35, 1.3, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "加入删除后", "闭散列的**插入操作需要修改**，检索操作几乎可以不修改：遇到墓碑顺着序列继续，直到找到关键码或遇到空单元。", 5.15, 3.8, 4.35, 1.3, { fontSize: 10.5 });
}

// 10.3.4 dictionary ADT
{
  const s = content("10.3.4", "10.3 散列 · 闭散列表的算法", "字典：用散列实现的「(关键码, 属性值)」集合");
  bullets(s, [
    "**字典**是一种特殊的集合，元素是（关键码，属性值）二元组，同一字典内**关键码互不相同**。",
    "又称联合内存 / 联合数组：依据关键码存储和析取值，可组织简单的数据库。",
    "实现方式很多（有序线性表、字符树……），**用散列实现的字典检索性能非常高**。",
  ], 0.5, 1.05, 5.0, 2.4, { fontSize: 11.5, gap: 8 });
  card(s, 5.75, 1.05, 3.75, 2.4, C.code);
  text(s, "原书 hashdict  →  本书 HashTable", 5.9, 1.12, 3.5, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  const map = [["hashInsert", "insert"], ["hashSearch", "contains"], ["hashDelete", "erase"], ["size", "size"]];
  map.forEach((m, i) => {
    const y = 1.5 + i * 0.45;
    text(s, m[0], 5.9, y, 1.5, 0.35, { fontSize: 10.5, fontFace: MONO, color: C.muted, valign: "middle", margin: 0 });
    s.addShape(pres.shapes.LINE, { x: 7.4, y: y + 0.17, w: 0.35, h: 0, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
    text(s, m[1], 7.85, y, 1.5, 0.35, { fontSize: 10.5, fontFace: MONO, bold: true, color: C.green, valign: "middle", margin: 0 });
  });
  callout(s, "封装的好处", "散列函数 h 和探查函数 p 放在 `private` 里：用户可以**替换散列函数和探查函数，调用方不必改**。", 0.5, 3.6, 4.35, 1.5, { fontSize: 10.5 });
  callout(s, "原书算法的一个前提", "插入和检索都假定每个探查序列中**至少有一个槽是空的**，否则检索不成功时会**无限循环**。本书改为：探测最多 `capacity()` 步，满表插入返回 `false`。", 5.15, 3.6, 4.35, 1.5, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// HashTable code 1
{
  const s = content("10.3.4", "10.3 散列 · teaching.hpp · HashTable（一）", "三种槽状态、构造与 insert");
  codeBlock(s, `class HashTable {
public:
    enum class SlotState { empty, used, tombstone };

    struct SlotView {
        int key;
        SlotState state;
    };

    explicit HashTable(std::size_t capacity) : slots_(capacity), size_(0) {
        if (capacity == 0) {
            throw std::invalid_argument("HashTable: 容量必须为正");
        }
    }

    // 插入。键已存在返回 false；表满且没有墓碑可用也返回 false。
    bool insert(int key) {
        std::optional<std::size_t> target = insertion_slot(key);
        if (!target) {
            return false;                       // 表满，插不进去
        }
        if (slots_[*target].state == SlotState::used) {
            return false;                       // 键已经在表里
        }
        slots_[*target].key = key;
        slots_[*target].state = SlotState::used;
        ++size_;
        return true;
    }`, 0.5, 1.05, 6.3, 4.1, { fontSize: 8, hl: [3] });
  callout(s, "SlotState", "**三种状态缺一不可**：`empty` 让查找停下；`tombstone` 让查找继续、插入可复用；`used` 才是真有元素。", 7.0, 1.05, 2.5, 1.55, { fontSize: 10 });
  callout(s, "insert 的两种 false", [
    "`insertion_slot` 返回空 → **表满**；",
    "返回的槽是 `used` → **键已存在**。",
    "都是可预期的失败，不抛异常。",
  ], 7.0, 2.72, 2.5, 1.45, { fontSize: 9.5, gap: 2 });
  callout(s, "容量 0", "抛 `invalid_argument`：否则 `% 0` 是除零。", 7.0, 4.3, 2.5, 0.85, { fontSize: 9.5, fill: RED, tcolor: C.bad });
}

// HashTable code 2
{
  const s = content("10.3.4", "10.3 散列 · teaching.hpp · HashTable（二）", "erase 标墓碑；slot_at 让测试看见每一格");
  codeBlock(s, `    bool contains(int key) const { return find_slot(key).has_value(); }

    // 删除：**标墓碑，不标空**。理由见上面类注释里那三行推演。
    bool erase(int key) {
        std::optional<std::size_t> found = find_slot(key);
        if (!found) {
            return false;
        }
        slots_[*found].state = SlotState::tombstone;
        --size_;
        return true;
    }

    std::size_t size() const { return size_; }
    std::size_t capacity() const { return slots_.size(); }

    // 让调用方（和测试）能看到每一格的状态，方便观察探测过程。
    SlotView slot_at(std::size_t index) const {
        if (index >= slots_.size()) {
            throw std::out_of_range("HashTable::slot_at: 下标越界");
        }
        return SlotView{slots_[index].key, slots_[index].state};
    }

private:
    struct Slot {
        int key = 0;
        SlotState state = SlotState::empty;
    };`, 0.5, 1.05, 6.3, 4.1, { fontSize: 8, hl: [9] });
  callout(s, "erase 只改一行", "`state = tombstone`，`key` 留着也无妨——状态说了算。把这一行改成 `empty`，「删掉 3 之后 10 还找不找得到」的断言**立刻变红**。", 7.0, 1.05, 2.5, 2.2, { fontSize: 10, fill: RED, tcolor: C.bad });
  callout(s, "size 不数墓碑", "`size_` 只计有效元素。墓碑占着槽却不计入 `size()/capacity()`——这一点在效率分析里还会回来。", 7.0, 3.4, 2.5, 1.75, { fontSize: 10 });
}

// HashTable code 3
{
  const s = content("10.3.4", "10.3 散列 · teaching.hpp · HashTable（三）", "home 与 find_slot：遇空停，遇墓碑走");
  codeBlock(s, `    // 基地址：key 取绝对值再对表长取模。
    // 先转成 long long 再取绝对值，是因为 INT_MIN 的相反数在 int 里放不下。
    std::size_t home(int key) const {
        long long magnitude = (key >= 0) ? key : -static_cast<long long>(key);
        return static_cast<std::size_t>(magnitude) % slots_.size();
    }

    // 查找：从基地址起一格一格往后走。
    //   碰到「空」  → 探测链到头了，键不在表里；
    //   碰到「墓碑」→ 继续走（这正是墓碑存在的意义）；
    //   碰到「占用」且键相同 → 找到了。
    std::optional<std::size_t> find_slot(int key) const {
        for (std::size_t step = 0; step < slots_.size(); ++step) {
            std::size_t index = (home(key) + step) % slots_.size();
            if (slots_[index].state == SlotState::empty) {
                return std::nullopt;
            }
            if (slots_[index].state == SlotState::used && slots_[index].key == key) {
                return index;
            }
        }
        return std::nullopt;                    // 走遍全表也没有
    }`, 0.5, 1.05, 6.6, 3.6, { fontSize: 8, hl: [15, 18] });
  callout(s, "负键也能进表", "`home` 先取绝对值再取模。`-INT_MIN` 在 `int` 里溢出，所以先转 `long long`。", 7.3, 1.05, 2.2, 1.75, { fontSize: 9.5 });
  callout(s, "最多走 capacity 步", "`step < slots_.size()`：满表时查找**不会死循环**，走遍全表返回空。", 7.3, 2.95, 2.2, 1.7, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "墓碑既不是 `empty` 也不满足 `used && key == key`——两个 `if` 都不成立，循环自然继续：这就是「看成不等于任何关键码的特殊值」。", 0.5, 4.72, 9.0, 0.45, { fontSize: 10, color: C.goldText, bold: true, margin: 0 });
}

// HashTable code 4
{
  const s = content("10.3.4", "10.3 散列 · teaching.hpp · HashTable（四）", "insertion_slot：记住路上第一个墓碑");
  codeBlock(s, `    // 找插入位置。比查找多做一件事：**记住路上第一个墓碑**。
    // 走到「空」时优先返回那个墓碑——回收墓碑，探测链才不会越来越长。
    // 但必须先走到「空」或找到同键才能停，否则会把一个已存在的键插第二遍。
    std::optional<std::size_t> insertion_slot(int key) const {
        std::optional<std::size_t> first_tombstone;
        for (std::size_t step = 0; step < slots_.size(); ++step) {
            std::size_t index = (home(key) + step) % slots_.size();
            if (slots_[index].state == SlotState::used && slots_[index].key == key) {
                return index;                   // 键已存在
            }
            if (slots_[index].state == SlotState::tombstone && !first_tombstone) {
                first_tombstone = index;
            }
            if (slots_[index].state == SlotState::empty) {
                return first_tombstone ? first_tombstone : std::optional<std::size_t>(index);
            }
        }
        return first_tombstone;                 // 全表没有空格，只能指望墓碑
    }

    std::vector<Slot> slots_;
    std::size_t size_;
};`, 0.5, 1.05, 6.6, 3.55, { fontSize: 8, hl: [12, 15] });
  const outs = [["同键", "返回它的下标 → insert 见 used，返回 false", C.bad], ["空槽", "有墓碑就返回首个墓碑，否则返回这个空槽", C.ok], ["走遍全表", "没有空格：返回首个墓碑（可能为空 = 表满）", C.goldText]];
  text(s, "三种出口", 7.3, 1.05, 2.2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  outs.forEach((o, i) => {
    const y = 1.42 + i * 1.05;
    pill(s, o[0], 7.3, y, 1.1, 0.32, o[2], C.white, 10);
    text(s, o[1], 7.3, y + 0.36, 2.2, 0.62, { fontSize: 9.5, margin: 0 });
  });
  text(s, "用 `optional` 记「有没有见过墓碑」——`!first_tombstone` 保证只记**第一个**。", 0.5, 4.7, 9.0, 0.4, { fontSize: 10.5, color: C.goldText, bold: true, margin: 0 });
}

// tests
{
  const s = content("10.3.4", "10.3 散列 · teaching_test.cpp", "三条具名断言守住墓碑语义");
  codeBlock(s, `void test_erase_leaves_a_tombstone_not_a_hole() {
    HashTable table(7);
    check(table.insert(3), "3 落在槽 3");
    check(table.insert(10), "10 被挤到槽 4");

    check(table.erase(3), "删掉 3");
    check(!table.contains(3), "3 确实没了");
    check(table.slot_at(3).state == HashTable::SlotState::tombstone,
          "槽 3 是墓碑，不是空——探测链不能在这里断掉");
    check(table.contains(10), "**10 仍然查得到**（查找路过墓碑要继续走）");
    check(table.size() == 1, "长度减一");
}
// ...
void test_tombstone_reuse_does_not_duplicate_keys() {
    HashTable table(7);
    check(table.insert(3), "3 落在槽 3");
    check(table.insert(10), "10 被挤到槽 4");
    check(table.erase(3), "删掉 3，槽 3 成为墓碑");

    check(!table.insert(10), "再插 10 必须返回 false——它就在槽 4，不能因为前面有墓碑就再插一遍");
    check(table.size() == 1, "长度仍是 1");
}`, 0.5, 1.02, 9.0, 3.3, { fontSize: 8.5, hl: [10, 20] });
  const t = [
    ["删除只能标墓碑", "把 `erase` 改成标 `empty`：「10 仍然查得到」立刻变红。", C.bad],
    ["插入要回收墓碑", "插 24（基地址也是 3）必须落回槽 3，而不是跑到后面去。", C.green],
    ["回收时不能提前停", "碰到墓碑就返回 → 同一个 10 插两遍。最隐蔽，单列一个用例。", C.goldText],
  ];
  t.forEach((it, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.42, 2.85, 0.72, C.code);
    text(s, it[0], x + 0.1, 4.44, 2.7, 0.26, { fontSize: 10, bold: true, color: it[2], margin: 0 });
    text(s, it[1], x + 0.1, 4.7, 2.7, 0.42, { fontSize: 8.5, margin: 0 });
  });
}

// Python track
{
  const s = content("10.3.4", "10.3 散列 · Python 算法轨 · modern.py", "Python 版 HashTable：None 是空，_TOMBSTONE 是墓碑");
  codeBlock(s, `class HashTable:
    def __init__(self, capacity):
        if capacity <= 0:
            raise ValueError("hash table capacity must be positive")
        self._slots = [None] * capacity
        self._size = 0
    def _home(self, key):
        return abs(key) % len(self._slots)
    def insert(self, key):
        first_tombstone = None
        for step in range(len(self._slots)):
            i = (self._home(key) + step) % len(self._slots)
            if self._slots[i] == key:
                return False
            if self._slots[i] is _TOMBSTONE and first_tombstone is None:
                first_tombstone = i
            if self._slots[i] is None:
                target = first_tombstone if first_tombstone is not None else i
                self._slots[target] = key
                self._size += 1
                return True
        if first_tombstone is None:
            return False
        self._slots[first_tombstone] = key
        self._size += 1
        return True
    # ...`, 0.5, 1.05, 6.3, 4.1, { fontSize: 8, lang: "py" });
  callout(s, "三种状态的 Python 写法", [
    "空：`None`；墓碑：哨兵对象 `_TOMBSTONE`；占用：键本身。",
    "用 `is` 比较哨兵，不会与任何键相等。",
  ], 7.0, 1.05, 2.5, 2.0, { fontSize: 10, gap: 3 });
  callout(s, "不许偷懒", "Python 版**不用** `dict` 或 `set` 代做集合与散列——这两个名字由本单元的 `d025_forbidden` 额外封住。", 7.0, 3.2, 2.5, 1.95, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// 10.3.5 efficiency derivation
{
  const s = content("10.3.5", "10.3 散列 · 效率分析", "衡量的是什么：成功检索 vs 不成功检索");
  bullets(s, [
    "性能按完成一次插入、删除或检索所需的**记录访问次数**来衡量。",
    "删除前必须先找到它 → **删除 = 一次成功检索**。",
    "插入要找到探查序列的尾部（考虑删除时也要走到尾部查重）→ **插入 = 一次不成功检索**。",
    "表越满，记录越可能放到离基地址更远的地方 → 代价与 **α = N/M** 有关。",
  ], 0.5, 1.05, 4.6, 3.0, { fontSize: 11.5, gap: 7 });
  card(s, 5.35, 1.05, 4.15, 1.85, C.dark);
  text(s, "插入 / 不成功检索（随机探查序列）", 5.5, 1.12, 3.9, 0.28, { fontSize: 10.5, bold: true, color: C.gold, margin: 0 });
  text(s, "1 + Σ (N/M)ⁱ = 1/(1−α)", 5.5, 1.5, 3.9, 0.5, { fontSize: 17, bold: true, color: C.white, margin: 0, fontFace: MONO });
  text(s, "第 i 次冲突的可能性 N(N−1)⋯ / M(M−1)⋯，N、M 很大时近似 (N/M)ⁱ", 5.5, 2.1, 3.9, 0.7, { fontSize: 9.5, color: C.mint, margin: 0 });
  card(s, 5.35, 3.05, 4.15, 1.6, C.code);
  text(s, "成功检索 = 插入它时代价的平均", 5.5, 3.12, 3.9, 0.28, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  text(s, "(1/α)·∫[0,α] dx/(1−x)\n= (1/α)·ln(1/(1−α))", 5.5, 3.45, 3.9, 0.8, { fontSize: 14, bold: true, color: C.green, margin: 0, fontFace: MONO });
  text(s, "α 从 0 增长到当前值，对所有插入代价积分求平均", 5.5, 4.25, 3.9, 0.35, { fontSize: 9, color: C.muted, margin: 0 });
  text(s, "所以散列表的效率问题**实质上还是平均检索长度的问题**，而且要区别对待成功与不成功。", 0.5, 4.2, 4.6, 0.85, { fontSize: 11, color: C.goldText, bold: true, margin: 0 });
}

// table 10.2 + fig 10.11
{
  const s = content("10.3.5", "10.3 散列 · 效率分析", "表 10.2：三种冲突解决策略的期望检索长度");
  table(s, [
    ["冲突解决策略", "成功检索（删除）", "不成功检索（插入）"],
    [{ t: "开散列法（拉链）", bold: true }, "1 + α/2", "α + e^(−α)"],
    [{ t: "双散列探查法", bold: true }, "(1/α)·ln(1/(1−α))", "1/(1−α)"],
    [{ t: "线性探查法", bold: true }, "½·(1 + 1/(1−α))", "½·(1 + 1/(1−α)²)"],
  ], 0.5, 1.05, 5.6, [1.8, 1.9, 1.9], { fontSize: 10.5, rowH: 0.42 });
  callout(s, "开散列的效率最高", [
    "实际系统中使用的散列**大多是开散列**：简单、不产生聚集、删除极为方便。",
    "闭散列需要考虑的因素更多、更需精心设计；在不能动态分配空间等受限系统中有独到用途，精心设计后效率**比开散列稳定**。",
  ], 0.5, 2.85, 5.6, 2.25, { fontSize: 10.5, gap: 4 });
  card(s, 6.35, 1.05, 3.15, 3.25, C.code);
  image(s, "fig-10-11", 6.45, 1.12, 2.95, 3.1);
  text(s, "图 10.11　不同碰撞处理方法的 ASL：α 接近 1 时开放地址法曲线快速上扬；拉链法（曲线 1）平缓。", 6.35, 4.35, 3.15, 0.75, { fontSize: 9, color: C.muted, margin: 0 });
}

// alpha table
{
  const s = content("10.3.5", "10.3 散列 · 效率分析", "0.5 是一条经验阈值：α 一过，性能急剧下降");
  table(s, [
    ["α", "线性探测成功查询 ASL", "直观状态"],
    ["0.25", "1.17", "大部分键在回家地址"],
    ["0.50", { t: "1.50", bold: true, color: C.ok }, "冲突可控"],
    ["0.70", "2.17", "聚集开始明显"],
    ["0.80", { t: "3.00", bold: true, color: C.goldText }, "应考虑扩表"],
    ["0.90", "5.50", "少量空槽被长探测链隔开"],
    ["0.95", { t: "10.50", bold: true, color: C.bad }, "已接近线性退化"],
  ], 0.5, 1.05, 5.0, [0.7, 2.0, 2.3], { fontSize: 11, rowH: 0.36, align: "center" });
  text(s, "按 ½·(1 + 1/(1−α)) 计算", 0.5, 3.65, 5.0, 0.25, { fontSize: 9.5, color: C.muted, margin: 0, align: "center" });
  callout(s, "扩表 = 重新散列", "所有键的地址都依赖表长，扩表必须按**新表长重新散列**，不能原封不动复制槽位。实务上常在 α 为 0.5～0.7 时扩表；可按访问频率从高到低重插，让常用记录更靠近基位置。", 5.75, 1.05, 3.75, 2.2, { fontSize: 10.5 });
  callout(s, "墓碑也抬高成本", "墓碑不计入 `size()/capacity()`。有效 α 只有 0.4、另有 0.4 是墓碑的表，失败查询仍可能走过 0.8 张表——**墓碑过多时即使未满也要重建**。", 5.75, 3.4, 3.75, 1.7, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  card(s, 0.5, 4.0, 5.0, 1.1, C.dark);
  text(s, "散列法的重要特征：平均检索长度**不依赖于结点个数**，随 α 增大而增加；安排得好可以小于 1.5。", 0.7, 4.05, 4.65, 1.0, { fontSize: 11.5, color: C.white, valign: "middle", margin: 0 });
}

// 10.3.6 applications
{
  const s = content("10.3.6", "10.3 散列 · 应用", "散列方法的应用");
  const apps = [["搜索引擎", "关键词字典"], ["DNS", "域名 ↔ IP 地址"], ["操作系统", "命令路径下的可执行程序名"], ["编译器", "符号表"]];
  apps.forEach((a, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.05, 2.1, 0.95, C.code);
    text(s, a[0], x + 0.12, 1.1, 1.9, 0.35, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
    text(s, a[1], x + 0.12, 1.48, 1.9, 0.45, { fontSize: 10, color: C.muted, margin: 0 });
  });
  callout(s, "能亲手验证：C Shell 的命令散列表", [
    "登录时 `PATH` 下所有可执行程序被散列到命令表。",
    "新加程序后不更新散列表 → 换个目录直接敲名字报 `Command not found.`",
    "`rehash` 更新；`hashstat` 看统计；`unhash` 解除散列、逐目录尝试。",
  ], 0.5, 2.2, 5.0, 2.9, { fontSize: 10.5, gap: 5 });
  callout(s, "散列作指纹：另一回事", "MD5（Rivest，90 年代）把文件压成 128 位摘要，内容一改摘要就变。但**MD5 已不能用于安全目的**：抗碰撞性早被攻破。口令存储应使用 bcrypt、scrypt、Argon2 等并**加盐**。", 5.75, 2.2, 3.75, 2.9, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// when not to use hashing
{
  const s = content("10.3.6", "10.3 散列 · 应用", "选择结构时先问操作：什么时候不该用散列");
  table(s, [
    ["需求", "适合的结构", "不选散列的原因"],
    ["精确查一个键", { t: "散列表", bold: true, color: C.ok }, "正是它的长项"],
    ["按键从小到大遍历", "有序表 / 搜索树", "散列槽位没有关键码顺序"],
    [{ t: "查 [low, high] 范围", mono: false }, "B+ 树 / 有序数组", "散列不能定位相邻键"],
    ["数据很少且更新不频繁", "线性表", "实现和内存开销更小"],
    ["需要最坏 O(log n)", "平衡搜索树", "普通散列只保证期望代价"],
  ], 0.5, 1.05, 9.0, [2.8, 2.6, 3.6], { fontSize: 12, rowH: 0.46 });
  callout(s, "散列值不能代替关键码相等判断", "缓存还要处理容量淘汰；去重还要保存原始键，以确认「散列值相同但键不同」的碰撞。散列值只是**候选地址或摘要**。", 0.5, 4.0, 9.0, 1.1, { fontSize: 11.5 });
}

// exercises
{
  const s = content("练", "课后练习 · 选讲", "几道代表性习题");
  const ex = [
    ["二分 trace", "对 {8, 13, 17, 26, 44, 56, 88, 97} 用二分检索 88，写出每一步的 first、mid、last。", "半开区间：[0,8) mid=4 (44<88) → [5,8) mid=6 命中。"],
    ["ASL 三种检索", "有序表 A[25] 等概率，分别求顺序、二分、分块（5 块 × 5 个）的平均查找长度。", "顺序 (n+1)/2；分块用两阶段之和。"],
    ["线性探查造表", "HT[13]、h(K)=K mod 13，线性探查插入 12、23、45、57、20、03、78、31、15、36，求成功与不成功 ASL。", "逐个算基地址，冲突就往后。"],
    ["墓碑", "表长 5 依次插入 1、6、11；删除 1 后若标空，查找 6 会怎样？", "在槽 1 看到空就停 → 误判不在。"],
  ];
  ex.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.65, y = 1.05 + row * 2.05;
    card(s, x, y, 4.35, 1.9, C.code);
    numCircle(s, i + 1, x + 0.15, y + 0.12, 0.38, C.dark);
    text(s, e[0], x + 0.65, y + 0.12, 3.5, 0.38, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, e[1], x + 0.2, y + 0.6, 3.95, 0.75, { fontSize: 10.5, margin: 0 });
    text(s, "提示：" + e[2], x + 0.2, y + 1.38, 3.95, 0.45, { fontSize: 9.5, color: C.green, margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["ASL", "平均检索长度 **ASL = Σ PᵢCᵢ**；等概率时顺序检索为 (n+1)/2。"],
    ["线性表检索", "顺序**限制最少、效率最低**；二分 ⌈log₂(n+1)⌉，适合**少改动、常检索**；分块介于二者之间。"],
    ["集合", "只关心「在不在」：可预期的失败返回 `bool`；全集小时用**位向量**，交并差 = 按位运算。"],
    ["散列与冲突", "散列函数 + 冲突解决是核心；开散列拉链，闭散列靠探查序列，**删除必须留墓碑**。"],
    ["效率", "ASL **不依赖 n**，随负载因子 α 增大而增加；α 超过 0.5 左右就该扩表、重新散列。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
