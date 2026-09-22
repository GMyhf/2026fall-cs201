// 第11章 索引技术 —— 由 dsa-modernization/book/ch11-index.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch11_index.js ../202609_DSA_11_Index.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_11_Index.pptx");

// 讲义中引用的图片（name → 本地绝对路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const IMAGES = {};
["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15-a", "15-c",
  "16", "17", "18", "19", "20", "21", "22", "23", "24"].forEach((n) => {
  IMAGES[`fig-11-${n}`] = `${SCAN}/fig-11-${n}.png`;
});

(async () => {
  const D = createDeck({ title: "DSA 第11章 索引技术", imgDir: path.join(__dirname, "..", ".cache", "ch11") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  // 画树用的小积木：结点（中心 x、顶 y、宽 w）、边、叶链
  const tnode = (s, label, cx, y, w, fill = C.mint, color = C.dark, fs = 11) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx - w / 2, y, w, h: 0.34, rectRadius: 0.05, fill: { color: fill }, line: { color: C.green, width: 1 } });
    text(s, label, cx - w / 2, y, w, 0.34, { fontSize: fs, bold: true, color, align: "center", valign: "middle", margin: 0 });
  };
  const tedge = (s, x1, y1, x2, y2, color = C.green, width = 1) => {
    s.addShape(pres.shapes.LINE, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width } });
  };
  const tlink = (s, x1, x2, y) => {
    s.addShape(pres.shapes.LINE, { x: x1, y, w: x2 - x1, h: 0, line: { color: C.goldText, width: 1.2, beginArrowType: "triangle", endArrowType: "triangle" } });
  };
  const caption = (s, str, x, y, w) => text(s, str, x, y, w, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第11章  索引技术",
  subtitle: "Indexing：关键码到记录位置的查找表",
  topics: "线性索引：稠密 / 稀疏 · 多级索引 · 静态多分树与扇出\n倒排索引：有序表求交 · 短语查询\nB 树：插入分裂 · 删除借位与合并 · B+ 树与叶链范围扫描\n位图索引与尾部掩码 · 游程压缩 · 签名文件 · 红黑树（对照）",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["主文件太大，怎么先查一张小表？", "**线性索引**分稠密和稀疏；索引也放不下就建**多级索引**——查一次的代价等于层数。"],
    ["索引还要支持插入删除，怎么办？", "**B 树 / B+ 树**：靠分裂、借位与合并做局部调整，始终保持平衡。"],
    ["能不能反过来，从属性值找记录？", "**倒排索引**把查询变成集合运算；低基数属性用**位图**，粗筛用**签名**。"],
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
    { text: "索引是「关键码 → 记录位置」的查找表；关键指标不是比较次数，而是", options: { color: C.white } },
    { text: "磁盘页访问次数", options: { color: C.gold, bold: true } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 14.5, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["11.1", "线性索引", ["稠密 vs 稀疏", "变长记录", "多级索引", "1000 条记录算出四层"]],
    ["11.2", "静态多分树", ["多分降树高", "扇出是算出来的", "批量装入 bulk_load", "溢出区与重组"]],
    ["11.3", "倒排索引", ["属性倒排 / 正文倒排", "双指针求交 O(n+m)", "交 / 并 / 差", "短语查询靠位置"]],
    ["11.4", "动态索引", ["B 树定义与访外", "插入—分裂", "交换—删除—借—合并", "B+ 树与叶链", "性能分析 · 静态 vs 动态"]],
    ["11.5", "位索引技术", ["位图与按位运算", "尾部掩码", "游程压缩 · 签名", "红黑树（对照）"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 1.82;
    card(s, x, 1.15, 1.7, 3.9, i === 3 ? C.cream : C.code);
    text(s, c[0], x + 0.12, 1.28, 1.5, 0.3, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
    text(s, c[1], x + 0.12, 1.58, 1.5, 0.4, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[2], x + 0.06, 2.12, 1.6, 2.85, { fontSize: 10.5, gap: 7 });
  });
}

// 4. Run first: linear index (1/2)
{
  const s = content("▶", "先跑一遍 · code/ch11/linear_index/demo.cpp（上）", "1000 条记录，每个数据页 4 条，建稀疏索引");
  codeBlock(s, `#include "modern.hpp"

#include <cstdio>

int main() {
    using dsa::index::IndexKind;
    using dsa::index::MultiLevelIndex;
    std::vector<std::pair<int, std::string>> records;
    for (int i = 0; i < 1000; ++i) {
        records.emplace_back(i * 10, std::string(static_cast<std::size_t>(i % 7) + 1, 'x'));
    }

    // 每个数据页 4 条记录，每个索引页 4 项。
    MultiLevelIndex sparse(IndexKind::Sparse, 4, 4);
    sparse.load(records);
    sparse.reset_counters();
    const bool hit = sparse.find(5000).has_value();
    std::printf("稀疏 · 每页 4 项 : %zu 个数据页，%zu 个索引项，%zu 层，查一次读 %zu 页（命中 %d）\\n",
                sparse.data_pages(), sparse.entries(), sparse.levels(), sparse.page_reads(),
                static_cast<int>(hit));
    // ...`, 0.5, 1.05, 9.0, 3.4, { fontSize: 8.5, hl: [14] });
  consoleBlock(s, "稀疏 · 每页 4 项 : 250 个数据页，250 个索引项，4 层，查一次读 4 页（命中 1）", 0.5, 4.55, 9.0, 0.57, 10);
}

// 5. Run first: linear index (2/2)
{
  const s = content("▶", "先跑一遍 · code/ch11/linear_index/demo.cpp（下）", "索引页放 64 项；换成稠密索引");
  codeBlock(s, `    // ...
    // 索引页装得多，层数就少，访外次数随之下降——这就是 11.2 要做多分树的理由。
    MultiLevelIndex flat(IndexKind::Sparse, 4, 64);
    flat.load(records);
    flat.reset_counters();
    (void)flat.find(5000);
    std::printf("稀疏 · 每页 64 项: %zu 层，查一次读 %zu 页\\n", flat.levels(), flat.page_reads());

    MultiLevelIndex dense(IndexKind::Dense, 4, 64);
    dense.load(records);
    dense.reset_counters();
    (void)dense.find(5005);  // 不存在
    const std::size_t miss_reads = dense.page_reads();
    dense.reset_counters();
    (void)dense.find(5000);  // 存在
    std::printf("稠密 · %zu 层      : 查不到读 %zu 页，命中读 %zu 页——"
                "多出来的那一页就是数据页，索引里没有就不必去读\\n",
                dense.levels(), miss_reads, dense.page_reads());
    return 0;
}`, 0.5, 1.05, 9.0, 3.15, { fontSize: 8.5, hl: [3, 9] });
  consoleBlock(s, "稀疏 · 每页 4 项 : 250 个数据页，250 个索引项，4 层，查一次读 4 页（命中 1）\n稀疏 · 每页 64 项: 2 层，查一次读 2 页\n稠密 · 2 层      : 查不到读 1 页，命中读 2 页——多出来的那一页就是数据页，索引里没有就不必去读", 0.5, 4.27, 9.0, 0.86, 9);
}

// 6. Three conclusions
{
  const s = content("▶", "先跑一遍 · 看到了什么", "三行输出，三个结论");
  const items = [
    ["4 层，查一次读 4 页", "索引项一页放不下就**逐层上建**，查一次的代价等于**层数**。", C.green],
    ["每页 64 项：2 层，读 2 页", "**索引页装得多，层数就少，访外次数随之下降**——这正是 11.2 要做多分树的理由。", C.goldText],
    ["稠密：查不到 1 页，命中 2 页", "稠密索引在索引里查不到就是真没有，**一个数据页都不用读**；稀疏索引只能定位到页，**查不到也得先把那一页读上来**。", C.bad],
  ];
  items.forEach((it, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.1, 2.85, 2.75, C.code);
    numCircle(s, i + 1, x + 0.2, 1.25, 0.42, it[2]);
    text(s, it[0], x + 0.72, 1.25, 2.05, 0.45, { fontSize: 12, bold: true, color: it[2], margin: 0, valign: "middle" });
    text(s, it[1], x + 0.2, 1.9, 2.5, 1.85, { fontSize: 12, margin: 0, lsm: 1.2 });
  });
  card(s, 0.5, 4.05, 9.0, 1.0, C.dark);
  text(s, "度量衡", 0.75, 4.13, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "本章全部实现都是内存里的", options: { color: C.white } },
    { text: "页模拟", options: { color: C.gold, bold: true } },
    { text: "：结点即页，", options: { color: C.white } },
    { text: "page_reads()", options: { color: C.gold, bold: true, fontFace: MONO } },
    { text: " 数的是页访问次数。", options: { color: C.white } },
  ], { x: 0.75, y: 4.45, w: 8.6, h: 0.45, fontFace: FONT, fontSize: 13.5, margin: 0, isTextBox: true, valign: "middle" });
}

// ============================ PART 1 ============================
sectionSlide("Part 1 · 11.1", "线性索引", "项是 (key, location)，按 key 排序，可以在内存里二分\n稠密与稀疏 · 变长记录 · 多级索引 · 查一次的代价 = 层数");

// 1.1 dense vs sparse + fig 11.1
{
  const s = content("11.1", "11.1 线性索引", "先查一张小表，再按位置读记录");
  text(s, "外存上逐条扫描主文件太贵。线性索引的项是 `(key, location)`，按 key 排序，可以在内存里**二分**。", 0.5, 1.02, 9, 0.5, { fontSize: 12.5 });
  callout(s, "稠密索引：每条记录一项", [
    "主文件**可以无序**。",
    "查到索引项就直接得到记录位置。",
    "索引里查不到 = 真没有，数据页都不用读。",
  ], 0.5, 1.6, 4.35, 1.65, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
  callout(s, "稀疏索引：每个数据块一项", [
    "通常记下该块的**最小 key**。",
    "查到块之后还要在**块内再找一次**。",
    "更省空间，但要求主文件**按 key 分块有序**。",
  ], 0.5, 3.4, 4.35, 1.7, { fontSize: 11.5 });
  card(s, 5.15, 1.6, 4.35, 1.95, C.code);
  image(s, "fig-11-1", 5.3, 1.7, 4.05, 1.45);
  caption(s, "图 11.1  线性索引与不等长记录", 5.15, 3.2, 4.35);
  callout(s, "变长记录离不开「索引 + 位置」", "记录长度不同，不能用「基地址 + 下标 × 固定长度」直接算位置。索引项保存关键码和记录地址，把**逻辑顺序与物理布局分开**；主文件移动后要更新地址，索引本身不保存完整记录。", 5.15, 3.7, 4.35, 1.4, { fontSize: 10.5 });
}

// 1.1 multi-level
{
  const s = content("11.1", "11.1 线性索引", "索引也放不下：再为它建一层 → 多级索引");
  const steps = [["内存里的顶层", C.dark], ["读一个索引页", C.green], ["读数据页", C.goldText]];
  steps.forEach((st, i) => {
    const x = 0.8 + i * 3.0;
    pill(s, st[0], x, 1.12, 2.3, 0.42, st[1], C.white, 12);
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 2.35, y: 1.33, w: 0.6, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
  });
  card(s, 0.5, 1.75, 9.0, 1.95, C.code);
  image(s, "fig-11-2", 0.7, 1.82, 8.6, 1.55);
  caption(s, "图 11.2  二级索引文件", 0.5, 3.38, 9.0);
  callout(s, "关键指标变了", "一次查询 = 顶层（常驻内存）→ 逐层读索引页 → 读数据页。这时要数的**不是 CPU 比较次数，而是磁盘页访问次数**。", 0.5, 3.85, 4.35, 1.25, { fontSize: 11 });
  callout(s, "代价由什么决定", "查一次读几页 = 下层索引层数 + 1 个数据页。想少读页，就要让每个索引页**装更多项**，把层数压下来。", 5.15, 3.85, 4.35, 1.25, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 1.1 four levels table
{
  const s = content("11.1", "11.1 线性索引 · 算一笔账", "从 1000 条记录算出四层索引");
  text(s, "每个数据页 4 条记录 → ⌈1000/4⌉ = **250** 个数据页；稀疏索引每页一项，索引页也只放 4 项：", 0.5, 1.02, 9, 0.4, { fontSize: 12.5 });
  table(s, [
    ["层", "项数", "占用页数", "上一层要为它建多少项"],
    ["数据页", "1000 条记录", "250", "250"],
    ["一级索引", "250", "63", "63"],
    ["二级索引", "63", "16", "16"],
    ["三级索引", "16", "4", "4"],
    [{ t: "顶层索引", bold: true }, "4", "1", { t: "常驻内存", bold: true, color: C.green }],
  ], 0.5, 1.55, 5.6, [1.2, 1.3, 1.1, 2.0], { fontSize: 11.5, rowH: 0.42, align: "center" });
  callout(s, "命中一次读几页？", "顶层定位后，三级、二级、一级索引**各读一页**，再读数据页：共 **4 页**——与 demo 输出一致。", 6.35, 1.55, 3.15, 1.6, { fontSize: 11 });
  callout(s, "索引页容量 4 → 64", "250 项只占 **4 页**，再用 1 个顶层页索引它们；查询只读 1 个下层索引页 + 1 个数据页 = **2 页**。", 6.35, 3.3, 3.15, 1.6, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  text(s, "每层页数 = ⌈下层项数 / 4⌉：250 → 63 → 16 → 4 → 1", 0.5, 4.2, 5.6, 0.35, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
  text(s, "（顶层只剩一页即停：它常驻内存，不计页访问）", 0.5, 4.55, 5.6, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
}

// 1.1 find code (1/2)
{
  const s = content("11.1", "11.1 线性索引 · modern.hpp#index-find（上）", "find：逐层读索引页");
  codeBlock(s, `[[nodiscard]] std::optional<std::string> find(int key) const {
    if (levels_.empty()) {
        return std::nullopt;
    }
    // 顶层常驻内存：定位到它所在的那一页，不计页访问。
    std::size_t page = locate(levels_.back(), 0, levels_.back().size(), key);
    for (std::size_t level = levels_.size() - 1; level > 0; --level) {
        page = levels_[level][page].target;
        ++reads_;  // 读一个下层索引页
        const std::size_t first = page * entries_per_page_;
        const std::size_t last = std::min(first + entries_per_page_, levels_[level - 1].size());
        if (first >= last) {
            return std::nullopt;
        }
        page = locate(levels_[level - 1], first, last, key);
    }
    // ...`, 0.5, 1.05, 9.0, 2.95, { fontSize: 9, hl: [9] });
  callout(s, "levels_ 的布局", "`levels_[0]` 是底层，`back()` 是顶层；顶层常驻内存，第一次定位**不计页访问**。", 0.5, 4.08, 2.9, 1.02, { fontSize: 10 });
  callout(s, "每下一层 +1", "循环每走一层就读一个下层索引页。层数越多，读的页越多。", 3.55, 4.08, 2.9, 1.02, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  callout(s, "locate", "在 `[first, last)` 里找**最后一个 key ≤ 目标**的项，返回它的下标。", 6.6, 4.08, 2.9, 1.02, { fontSize: 10 });
}

// 1.1 find code (2/2)
{
  const s = content("11.1", "11.1 线性索引 · modern.hpp#index-find（下）", "底层：稠密与稀疏分道扬镳");
  codeBlock(s, `    // ...
    const Entry& entry = levels_[0][page];
    if (kind_ == IndexKind::Dense) {
        // 稠密索引：索引里没有就是真没有，数据页一次都不用读。
        if (entry.key != key) {
            return std::nullopt;
        }
        ++reads_;
        return records_[entry.target].second;
    }
    // 稀疏索引：只能定位到页，页内还要再找一次；不命中也已经付出了这一页。
    ++reads_;
    const std::size_t first = entry.target * records_per_page_;
    const std::size_t last = std::min(first + records_per_page_, records_.size());
    for (std::size_t i = first; i < last; ++i) {
        if (records_[i].first == key) {
            return records_[i].second;
        }
    }
    return std::nullopt;
}`, 0.5, 1.05, 6.3, 4.05, { fontSize: 8.5, hl: [6, 12] });
  callout(s, "稠密 vs 稀疏", [
    "稠密：`entry.key != key` 直接返回，**不读数据页**。",
    "稀疏：先 `++reads_` 读页，再在页内顺序找。",
  ], 7.0, 1.05, 2.5, 1.95, { fontSize: 10.5 });
  callout(s, "页内怎么找不重要", "页内用顺序查还是二分查，只改变 CPU 比较次数，**不改变「这一页已经读进来」**这个事实。优化顺序：先降树高和随机 I/O，再谈页内比较。", 7.0, 3.1, 2.5, 2.0, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// ============================ PART 2 ============================
sectionSlide("Part 2 · 11.2", "静态索引：多分树", "一个结点恰好装满一页 · 多分 → 树矮 → 页访问少\n扇出是算出来的 · 批量装入 · 溢出区与重组");

// 11.2 why multiway
{
  const s = content("11.2", "11.2 静态多分树", "多分树降低的是高度");
  card(s, 0.5, 1.05, 4.5, 4.05, C.code);
  image(s, "fig-11-3", 0.65, 1.15, 4.2, 3.55);
  caption(s, "图 11.3  多分树", 0.5, 4.72, 4.5);
  bullets(s, [
    "磁盘按页读写，一个索引结点通常设计成**恰好装满一页**。",
    "二叉树每个结点只有两个孩子，同样多的 key 把树撑得很高 → 查询要读很多页。",
    "每个结点最多 **m** 个孩子、树高 **h**：理想满树可导航约 **mʰ** 个叶页。",
  ], 5.25, 1.05, 4.25, 1.95, { fontSize: 11.5, gap: 6 });
  text(s, "同样覆盖一百万个叶页：", 5.25, 3.0, 4.2, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  card(s, 5.25, 3.35, 2.05, 1.05, "FDF0EE");
  text(s, "≈ 20 层", 5.25, 3.38, 2.05, 0.6, { fontSize: 24, bold: true, color: C.bad, align: "center", margin: 0 });
  text(s, "二叉树", 5.25, 3.98, 2.05, 0.3, { fontSize: 10.5, color: C.muted, align: "center", margin: 0 });
  card(s, 7.45, 3.35, 2.05, 1.05, "EAF4EF");
  text(s, "3 层", 7.45, 3.38, 2.05, 0.6, { fontSize: 24, bold: true, color: C.ok, align: "center", margin: 0 });
  text(s, "100 路树", 7.45, 3.98, 2.05, 0.3, { fontSize: 10.5, color: C.muted, align: "center", margin: 0 });
  text(s, "页内要比较更多分界 key，但整页已经在内存里，代价通常**远小于多读一次外存页**。", 5.25, 4.5, 4.25, 0.6, { fontSize: 10.5, color: C.text, margin: 0 });
}

// 11.2 fan-out
{
  const s = content("11.2", "11.2 静态多分树", "扇出不是随意选的，是算出来的");
  const boxes = [["4096 字节", "一页"], ["÷ 16 字节", "关键码 + 孩子页号"], ["≈ 250 项", "扣除页头之后"], ["扇出 ≈ 251", "孩子数 = 项数 + 1"]];
  boxes.forEach((b, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.15, 2.0, 1.25, i === 3 ? C.dark : C.code);
    text(s, b[0], x, 1.25, 2.0, 0.6, { fontSize: 19, bold: true, color: i === 3 ? C.gold : C.dark, align: "center", valign: "middle", margin: 0 });
    text(s, b[1], x, 1.85, 2.0, 0.4, { fontSize: 10.5, color: i === 3 ? C.mint : C.muted, align: "center", margin: 0 });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: x + 2.02, y: 1.78, w: 0.26, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
  });
  callout(s, "扇出什么时候会下降", [
    "关键码**变长**：每项占的字节变多。",
    "页头**元数据增加**：一页里能用的空间变少。",
  ], 0.5, 2.65, 4.35, 1.3, { fontSize: 11.5 });
  callout(s, "数据库为什么喜欢短关键码", "不只为省总空间，也为让**一页容纳更多分支、压低树高**。", 5.15, 2.65, 4.35, 1.3, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
  card(s, 0.5, 4.15, 9.0, 0.95, C.code);
  text(s, "后面 11.4 的性能分析会再算一次：4 字节整数关键码、8 字节指针，4096 字节的块里 B+ 树的阶 **m = 340**；三层 B+ 树能容纳约 **1660 万**条记录。", 0.7, 4.2, 8.6, 0.85, { fontSize: 11.5, valign: "middle", margin: 0 });
}

// 11.2 bulk_load code
{
  const s = content("11.2", "11.2 静态多分树 · bplus_tree/modern.hpp#bulk_load（节选）", "批量装入：按页填满，自底向上建层");
  codeBlock(s, `std::vector<std::unique_ptr<Node>> level;
for (std::size_t i = 0; i < sorted.size(); i += per_leaf) {
    auto leaf = std::make_unique<Node>(true);
    for (std::size_t j = i; j < sorted.size() && j < i + per_leaf; ++j) {
        leaf->keys.push_back(sorted[j].first);
        leaf->values.push_back(sorted[j].second);
    }
    if (!level.empty()) {
        level.back()->next = leaf.get();
    }
    level.push_back(std::move(leaf));
}
rebalance_last_page(level, tree.min_keys(true));
tree.first_leaf_ = level.front().get();
tree.size_ = sorted.size();
while (level.size() > 1) {
    std::vector<std::unique_ptr<Node>> parents;
    for (std::size_t i = 0; i < level.size(); i += order) {
        auto parent = std::make_unique<Node>(false);
        for (std::size_t j = i; j < level.size() && j < i + order; ++j) {
            if (j != i) {
                parent->keys.push_back(smallest_key(level[j].get()));
            }
            parent->children.push_back(std::move(level[j]));
        }
        parents.push_back(std::move(parent));
    }
    rebalance_last_page(parents, tree.min_keys(false));
    level = std::move(parents);
}
tree.root_ = std::move(level.front());`, 0.5, 1.0, 5.7, 4.12, { fontSize: 7.9, hl: [9, 22] });
  text(s, "三步", 6.45, 1.05, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const steps = [["按 key 排好", "bulk_load 要求 key 严格递增"], ["连续填叶页", "顺手串起叶链 next"], ["建上一层", "用每个孩子的最小 key 当分界"]];
  steps.forEach((st, i) => {
    const y = 1.42 + i * 0.62;
    numCircle(s, i + 1, 6.45, y + 0.06, 0.36, C.green);
    text(s, st[0], 6.9, y, 2.6, 0.26, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, st[1], 6.9, y + 0.26, 2.6, 0.26, { fontSize: 9.5, color: C.muted, margin: 0 });
  });
  callout(s, "为什么要批量装入", "叶页天然相邻，范围扫描接近**顺序 I/O**。一条条随机插入再指望同样布局是不行的：结点会因分裂留下空隙，树形和页利用率都不同。", 6.45, 3.35, 3.05, 1.75, { fontSize: 10.5 });
}

// 11.2 static tree key points
{
  const s = content("11.2", "11.2 静态多分树 · 关键要点", "一次建好、很少改");
  const items = [
    ["查找：从根走到叶，每层读一页", "批量装入时按页填满，之后结构不再变。树高就是查一次要读的页数。", C.ok],
    ["插入、删除破坏「一页正好满」", "多出来的记录只能进**溢出区**，少了的页会**变稀**，最终往往要**重组整棵树**。", C.bad],
    ["同一套建法，两种后续", "用 `bulk_load` 把 {10,20,30,50,70,90} 装成 3 阶树，得到 `[30,70] / [10,20] [30,50] [70,90]`——正是 11.4 的那棵 B+ 树。区别只在后续：**静态多分树靠重组，B+ 树靠分裂与合并就地维护**。", C.goldText],
  ];
  items.forEach((it, i) => {
    const y = 1.1 + i * 1.33;
    const h = i === 2 ? 1.35 : 1.2;
    card(s, 0.5, y, 9.0, h, C.code);
    numCircle(s, i + 1, 0.72, y + 0.33, 0.5, it[2]);
    text(s, it[0], 1.45, y + 0.1, 7.8, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    text(s, it[1], 1.45, y + 0.48, 7.9, h - 0.52, { fontSize: 11.5, margin: 0 });
  });
}

// ============================ PART 3 ============================
sectionSlide("Part 3 · 11.3", "倒排索引", "不是由记录确定属性值，而是由属性值确定记录的位置\n有序表求交 O(n+m) · 交 / 并 / 差 · 短语查询");

// 11.3 definition
{
  const s = content("11.3", "11.3 倒排索引", "按属性值检索记录：倒排");
  text(s, "索引表中每一项包括**一个属性值**和**具有该属性值的各记录地址**。由于不是由记录来确定属性值，而是**由属性值来确定记录的位置**，因而称为倒排索引（inverted index）；带有倒排索引的文件称为**倒排文件**。", 0.5, 1.02, 9, 0.75, { fontSize: 12 });
  callout(s, "原书表 11.1：教师登记表", [
    "职工号 `EMP#` 是主关键码，可以唯一标识一个教员。",
    "姓名、系、职称、专长、地址等属性则不能：计算机系几十名教员，就有几十个记录的「系」是「计算机」。",
    "查「职称为讲师的所有职工号」要**顺序扫描所有记录**；查「计算机系擅长英语」还要逐个记录先查「系」再查「专长」。",
  ], 0.5, 1.9, 4.6, 3.2, { fontSize: 11 });
  card(s, 5.35, 1.9, 4.15, 3.2, C.code);
  text(s, "倒排表（inverted list）", 5.5, 1.98, 3.8, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "对每个感兴趣属性的每个值，建一张线性表，存放对应的所有关键码：", 5.5, 2.3, 3.9, 0.5, { fontSize: 10.5, margin: 0 });
  pill(s, "计算机系", 5.5, 2.95, 1.15, 0.38, C.dark, C.gold, 10.5);
  cells(s, 6.85, 2.93, ["0310", "0330", "0341"], { cw: 0.62, ch: 0.42, fs: 10.5 });
  pill(s, "英语专长", 5.5, 3.55, 1.15, 0.38, C.dark, C.gold, 10.5);
  cells(s, 6.85, 3.53, ["0310", "0421"], { cw: 0.62, ch: 0.42, fs: 10.5 });
  s.addShape(pres.shapes.LINE, { x: 5.5, y: 4.15, w: 3.85, h: 0, line: { color: "D5DDD9", width: 1 } });
  text(s, "「计算机系且擅长英语」= 两个有序列表的**交集** → `[0310]`。倒排表只存标识和位置，完整记录仍在主文件里。", 5.5, 4.22, 3.9, 0.8, { fontSize: 10.5, margin: 0 });
}

// 11.3 text indexing
{
  const s = content("11.3", "11.3 倒排索引 · 对正文文件的倒排", "词索引 vs 全文索引；posting list 存什么");
  callout(s, "词索引（word index）", [
    "把正文看做符号和词的集合，抽取关键词组成快速检索结构。",
    "适合容易解析成词的文本（如英文）；**不适合生物学数据和一些东方语言文本**。",
    "查询词限制在关键词范围内。",
  ], 0.5, 1.1, 4.35, 2.05, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "全文索引（full-text index）", [
    "把正文看做**一个长字符串**，记录子字符串的开始位置。",
    "可以查询正文中的**任何子字符串**。",
    "代价：通常需要**更大的空间**。",
  ], 5.15, 1.1, 4.35, 2.05, { fontSize: 11 });
  card(s, 0.5, 3.3, 9.0, 1.8, C.code);
  text(s, "倒排文件是使用得最广泛的词索引：排序关键词列表，每个词指向一个 posting list", 0.7, 3.38, 8.6, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "tᵢ → { (dᵢ₁, fᵢ₁, aᵢ₁), (dᵢ₂, fᵢ₂, aᵢ₂), … }", 0.7, 3.75, 8.6, 0.4, { fontSize: 16, bold: true, color: C.green, margin: 0 });
  bullets(s, [
    "**d** 文档标号 · **f** 该词在文档中的出现次数 · **a** 出现信息（位置、权重等）。",
    "为省空间、提高响应，可去掉频率甚至位置，只留文档号；**本节实现保留位置**——短语查询需要它。",
  ], 0.7, 4.22, 8.6, 0.85, { fontSize: 11, gap: 3 });
}

// 11.3 demo
{
  const s = content("▶", "11.3 倒排索引 · 先跑一遍 code/ch11/inverted_index/demo.cpp", "交、并、差与短语查询");
  codeBlock(s, `#include "modern.hpp"

#include <cstdio>

int main() {
    dsa::index::InvertedIndex index;
    index.add_document(310, {"计算机系", "英语专长"});
    index.add_document(330, {"计算机系"});
    index.add_document(341, {"计算机系"});
    index.add_document(421, {"英语专长"});

    const auto show = [](const char* label, const std::vector<int>& docs) {
        std::printf("%s:", label);
        for (const int doc : docs) {
            std::printf(" %04d", doc);
        }
        std::printf("\\n");
    };
    show("计算机系          ", index.postings("计算机系"));
    show("英语专长          ", index.postings("英语专长"));
    show("计算机系且擅长英语", index.and_query({"计算机系", "英语专长"}));
    show("计算机系或擅长英语", index.or_query({"计算机系", "英语专长"}));
    show("不擅长英语        ", index.not_query("英语专长"));

    dsa::index::InvertedIndex text;
    text.add_document(1, {"the", "quick", "brown", "fox"});
    text.add_document(2, {"the", "brown", "quick", "fox"});
    show("含 quick 与 brown ", text.and_query({"quick", "brown"}));
    show("短语 quick brown  ", text.phrase_query({"quick", "brown"}));
    return 0;
}`, 0.5, 1.0, 5.75, 4.12, { fontSize: 7.9 });
  consoleBlock(s, "计算机系          : 0310 0330 0341\n英语专长          : 0310 0421\n计算机系且擅长英语: 0310\n计算机系或擅长英语: 0310 0330 0341 0421\n不擅长英语        : 0330 0341\n含 quick 与 brown : 0001 0002\n短语 quick brown  : 0001", 6.45, 1.05, 3.05, 1.75, 8.5);
  callout(s, "看到了什么", [
    "且 = **交**，或 = **并**，非 = 相对**全部文档**的**差**。",
    "最后两行：2 号文档两个词都有，但**不相邻**——只有位置信息能把它排除。",
  ], 6.45, 2.95, 3.05, 2.15, { fontSize: 10.5 });
}

// 11.3 intersect trace
{
  const s = content("11.3", "11.3 倒排索引 · 手算", "两个指针怎样求交：A = [310, 330, 341]，B = [310, 421]");
  table(s, [
    ["步", "A[i]", "B[j]", "动作", "输出"],
    ["1", "310", "310", { t: "相等，两边都前进", bold: true, color: C.green }, "310"],
    ["2", "330", "421", "左边小，只移动 `i`", "310"],
    ["3", "341", "421", "左边小，只移动 `i`", "310"],
    ["4", { t: "耗尽", color: C.bad }, "421", "停止", { t: "310", bold: true }],
  ], 0.5, 1.15, 5.8, [0.55, 0.9, 0.9, 2.5, 0.95], { fontSize: 12, rowH: 0.5, align: "center" });
  callout(s, "为什么是 O(n+m)", "每次**至少有一个指针前进**，所以总步数不超过两张表长度之和。", 0.5, 3.8, 2.8, 1.3, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "⚠ 反面写法", "对 A 的每个文档号都**从头扫描 B**，会把 O(n+m) 退化成 **O(nm)**。", 3.5, 3.8, 2.8, 1.3, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "多词 AND：先交最短的表", "三张表长 10、1000、100000：先交最短的，往往能**尽早把候选集缩小**；先合并后两张会制造一个很大的中间结果。", 6.55, 1.15, 2.95, 1.95, { fontSize: 10.5 });
  callout(s, "OR 与 NOT", "OR 要在归并时**去重**；NOT 必须相对于「全部文档集合」求差——单独一张倒排表无法知道哪些文档**不存在**该词。", 6.55, 3.2, 2.95, 1.9, { fontSize: 10.5 });
}

// 11.3 intersect code
{
  const s = content("11.3", "11.3 倒排索引 · modern.hpp#inverted-intersect", "intersect：归并一遍，两个指针各走一趟");
  codeBlock(s, `/// 有序表求交。归并一遍，两个指针各走一趟，代价 O(n+m)。
[[nodiscard]] static std::vector<int> intersect(const std::vector<int>& left,
                                                const std::vector<int>& right) {
    std::vector<int> out;
    std::size_t i = 0;
    std::size_t j = 0;
    while (i < left.size() && j < right.size()) {
        if (left[i] < right[j]) {
            ++i;
        } else if (right[j] < left[i]) {
            ++j;
        } else {
            out.push_back(left[i]);
            ++i;
            ++j;
        }
    }
    return out;
}`, 0.5, 1.05, 6.65, 4.05, { fontSize: 9, hl: [13, 14, 15] });
  callout(s, "前提：按文档号升序", "`add_document` 要求文档号**严格递增**——倒排表有序，是后面所有集合运算的前提。", 7.35, 1.05, 2.15, 1.95, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "为什么手写", "这段归并是本节的核心，所以要自己写；**换成一行库调用，这一节就没有内容了**。", 7.35, 3.15, 2.15, 1.95, { fontSize: 10.5 });
}

// 11.3 phrase query concept
{
  const s = content("11.3", "11.3 倒排索引 · 短语查询", "短语查询要存位置：quick brown");
  text(s, "倒排项不能只存文档号，还要存**词在文档中的位置**（从 0 数起）：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  const docs = [
    ["文档 1", ["the", "quick", "brown", "fox"], [1, 2], "位置 (1, 2)，相差 1 → 保留 ✓", C.ok],
    ["文档 2", ["the", "brown", "quick", "fox"], [2, 1], "quick 在 2、brown 在 1：次序相反 → 排除 ✗", C.bad],
  ];
  docs.forEach((d, i) => {
    const y = 1.55 + i * 1.3;
    card(s, 0.5, y, 9.0, 1.15, C.code);
    text(s, d[0], 0.7, y + 0.1, 1.0, 0.4, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
    const fills = d[1].map((w) => (w === "quick" || w === "brown" ? (i === 0 ? "CDEBD9" : "F9D5D0") : null));
    cells(s, 1.8, y + 0.2, d[1], { cw: 0.85, ch: 0.42, fs: 11, idx: true, fills });
    text(s, d[3], 5.5, y + 0.2, 3.9, 0.5, { fontSize: 11.5, bold: true, color: d[4], valign: "middle", margin: 0 });
  });
  callout(s, "两步走", "先按文档号**求交**把候选缩小，再在候选文档内**检查位置是否相邻**——可避免读取无关位置表。", 0.5, 4.2, 4.35, 0.9, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "维护代价", "查询变成集合运算，很快；代价是每次插入、删除、修改记录，都要**同步维护所有相关列表**。", 5.15, 4.2, 4.35, 0.9, { fontSize: 10.5 });
}

// 11.3 phrase query code
{
  const s = content("11.3", "11.3 倒排索引 · inverted_index/modern.hpp", "phrase_query：先求交，再看位置是否相邻");
  codeBlock(s, `/// 短语查询：先求交把候选文档缩小，再用位置是否相邻过滤。
[[nodiscard]] std::vector<int> phrase_query(const std::vector<std::string>& phrase) const {
    if (phrase.empty()) {
        return {};
    }
    std::vector<int> candidates = and_query(phrase);
    std::vector<int> out;
    for (const int doc : candidates) {
        for (const int start : positions_of(phrase.front(), doc)) {
            bool adjacent = true;
            for (std::size_t step = 1; step < phrase.size() && adjacent; ++step) {
                adjacent = has_position(phrase[step], doc, start + static_cast<int>(step));
            }
            if (adjacent) {
                out.push_back(doc);
                break;
            }
        }
    }
    return out;
}`, 0.5, 1.05, 6.65, 4.05, { fontSize: 8.5, hl: [6, 12] });
  callout(s, "第 6 行", "`and_query` 用 `intersect` 逐个求交：**候选集先缩小**。", 7.35, 1.05, 2.15, 1.35, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "第 12 行", "第一个词在 `start`，第 k 个词必须恰好在 `start + k`。", 7.35, 2.5, 2.15, 1.3, { fontSize: 10.5 });
  callout(s, "文档 2", "quick 在 2，brown 应在 3，实际在 1 → 不相邻。", 7.35, 3.9, 2.15, 1.2, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// ============================ PART 4 ============================
sectionSlide("Part 4 · 11.4", "动态索引：B 树与 B+ 树", "插入删除时索引结构本身也会改变，以保持较好的检索性能\n插入—分裂 · 交换—删除—借—合并 · B+ 树叶链 · 性能分析");

// 11.4 why
{
  const s = content("11.4", "11.4 动态索引", "为什么外存索引必须用平衡的多分树");
  bullets(s, [
    "**静态索引**一旦建立，插入删除只能靠溢出区兜着；**动态索引**在插删时结构本身也会改变。",
    "BST 不能保证平衡，可能退化为线性表——**退化的树结构将导致树形索引的失败**，面临巨大的访外开销。",
    "外存索引结点在不超过页块大小的前提下，应**尽量多放关键码**。",
    "第 12 章的 AVL 树保持 Θ(log n) 平衡，但**频繁的插删调整对外存也需要很大的 I/O 访问量**。",
  ], 0.5, 1.05, 5.4, 2.8, { fontSize: 12, gap: 8 });
  callout(s, "于是问题变成", [
    "怎样保持多分树**高度上的平衡**，不让它退化？",
    "怎样让结点中关键码尽可能多，而插删又**不需要太多调整**？",
  ], 0.5, 3.85, 5.4, 1.25, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  card(s, 6.15, 1.05, 3.35, 2.2, C.dark);
  text(s, "1970", 6.35, 1.15, 3, 0.55, { fontSize: 30, bold: true, color: C.gold, margin: 0 });
  text(s, "R. Bayer 和 E. McCreight 提出 **B 树**（balanced tree）：一种平衡的多分树，适用于组织动态的索引结构。", 6.35, 1.75, 3.0, 1.4, { fontSize: 11.5, color: C.white, margin: 0 });
  callout(s, "⚠ 读音", "国内也有人写「B-树」，其中的「-」是英文**连字符**，**不要说成「B 减树」**。", 6.15, 3.4, 3.35, 1.7, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
}

// 11.4 definition
{
  const s = content("11.4", "11.4.1 B 树 · 定义", "m 阶 B 树：五条，缺一不可");
  const defs = [
    "每个结点**至多有 m 个**子结点。",
    "除根结点和叶结点外，其他每个结点**至少有 ⌈m/2⌉ 个**子结点。",
    "根结点**至少有两个**子结点（例外：根可以为空，或者独根）。",
    "**所有的叶结点在同一层**，可以有 ⌈m/2⌉−1 到 m−1 个关键码。",
    "有 k 个子结点的分支结点恰好包含 **k−1 个**关键码。",
  ];
  defs.forEach((d, i) => {
    const y = 1.1 + i * 0.62;
    numCircle(s, i + 1, 0.5, y + 0.07, 0.4, C.dark);
    text(s, d, 1.05, y, 4.9, 0.55, { fontSize: 12, valign: "middle", margin: 0 });
  });
  text(s, "最底层叶结点的指针指向空（对应失败检索）：**空指针数目 = 关键码数目 + 1**。", 0.5, 4.3, 5.45, 0.75, { fontSize: 11, color: C.goldText, margin: 0 });
  callout(s, "B 树的四条性质", [
    "总是**树高平衡**的，所有叶结点在同一层。",
    "更新和检索只影响**一些磁盘块**，性能很好。",
    "关键码接近的记录放在**同一个磁盘块**，利用访问局部性。",
    "保证一定比例的结点是满的：空间利用率有保证，插删也不必频繁改结点。",
  ], 6.2, 1.1, 3.3, 3.2, { fontSize: 10.5 });
  card(s, 6.2, 4.45, 3.3, 0.65, C.dark);
  text(s, "阶为 3 的 B 树就是「2-3 树」", 6.2, 4.45, 3.3, 0.65, { fontSize: 12, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
}

// 11.4 node form
{
  const s = content("11.4", "11.4.1 B 树 · 结点", "一个结点：多个有序 key，key 之间是孩子指针");
  card(s, 0.5, 1.1, 9.0, 1.55, C.code);
  image(s, "fig-11-4", 0.8, 1.2, 8.4, 1.15);
  caption(s, "图 11.4  B 树结点的一般形式", 0.5, 2.35, 9.0);
  bullets(s, [
    "含 **r 个**关键码的内部结点有 **r+1 个**孩子：最左孩子的键都小于第一个关键码，相邻两个关键码之间各管一个区间，最右孩子的键都大于最后一个关键码。",
    "查找从根开始：**页内先定位区间，再沿对应页号下降**，读孩子页。",
    "树高随阶数增大而降低，一次查找的页数大约是 **logₘ n**。",
  ], 0.5, 2.85, 5.6, 2.25, { fontSize: 11.5, gap: 8 });
  callout(s, "结构自检", "若孩子数与关键码数不满足「**多一个**」，结点结构已经损坏。", 6.35, 2.85, 3.15, 1.0, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "B 树是专为磁盘页设计的", "一个结点 = 一页；页内比较在内存里做，代价远小于多读一页。", 6.35, 3.95, 3.15, 1.15, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 11.4 fig 11.5 search
{
  const s = content("11.4", "11.4.1 B 树 · 检索", "检索要算访外次数：以图 11.5 为例");
  card(s, 0.5, 1.05, 4.95, 4.05, C.code);
  image(s, "fig-11-5", 0.6, 1.1, 4.75, 3.7);
  caption(s, "图 11.5  同一棵 3 阶 B 树的三种画法", 0.5, 4.8, 4.95);
  table(s, [
    ["检索", "访问的索引结点", "数据盘", "访外"],
    [{ t: "31", bold: true }, "a、c、i", "a₁₂", { t: "4 次", bold: true, color: C.bad }],
    [{ t: "12", bold: true }, "a、b", "a₃", { t: "3 次", bold: true, color: C.green }],
  ], 5.7, 1.1, 3.8, [0.6, 1.45, 0.85, 0.9], { fontSize: 10.5, rowH: 0.4, align: "center" });
  text(s, "从根到关键码所在结点的路径上涉及的结点数不超过 h+1，即**最多 h+1 次访外**。", 5.7, 2.4, 3.8, 0.7, { fontSize: 11, margin: 0 });
  callout(s, "三种画法", "(a) 通常画法；(b) 画出外部空结点；(c) 画出隐含指针——a₁～a₁₆ 是关键码在主文件里对应磁盘块的地址。", 5.7, 3.1, 3.8, 1.1, { fontSize: 10 });
  callout(s, "与 B+ 树的分水岭", "B 树的关键码在**内部结点上也带着数据地址**。", 5.7, 4.3, 3.8, 0.8, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 11.4 insert rules
{
  const s = content("11.4", "11.4.1 B 树 · 插入", "插入—分裂：可能导致 B 树朝着根的方向生长");
  const steps = [
    ["检索", "关键码已在树中 → 拒绝插入；否则最后找到的叶结点就是插入位置。"],
    ["插入叶", "插入后关键码个数 < m → 完成。"],
    ["上溢出", "个数 = m：取中位数为分界码，叶分裂为 ⌈(m−1)/2⌉ 与 ⌊(m−1)/2⌋ 个关键码的两个结点，分界码插入父结点。"],
    ["向上传递", "父结点没有上溢则结束；否则继续分裂，**可能一直分裂到根**，树增高一层。"],
  ];
  steps.forEach((st, i) => {
    const y = 1.1 + i * 0.8;
    numCircle(s, i + 1, 0.5, y + 0.12, 0.42, i === 2 ? C.bad : C.green);
    text(s, st[0], 1.05, y + 0.02, 1.1, 0.6, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, st[1], 2.15, y, 3.85, 0.7, { fontSize: 11, valign: "middle", margin: 0 });
  });
  card(s, 6.25, 1.1, 3.25, 2.55, C.dark);
  text(s, "插入最多访外次数", 6.45, 1.2, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "h + 2(h−1) + 3\n= 3h + 1", 6.45, 1.55, 3, 0.9, { fontSize: 20, bold: true, color: C.white, fontFace: MONO, margin: 0 });
  text(s, "向下读盘 h 次；每分裂一个非根结点写出 2 个结点；分裂根（最后一次）写出 3 个结点。", 6.45, 2.5, 2.9, 1.1, { fontSize: 10, color: C.mint, margin: 0 });
  callout(s, "例", "原书图 11.7 那次根也分裂的插入：3 × 3 + 1 = **10** 次访外。", 6.25, 3.8, 3.25, 1.3, { fontSize: 11 });
}

// 11.4 fig 11.6 / 11.7
{
  const s = content("11.4", "11.4.1 B 树 · 插入示例", "在图 11.5 的 3 阶 B 树里插入 14、55，再插入 19");
  card(s, 0.5, 1.05, 4.35, 2.55, C.code);
  image(s, "fig-11-6", 0.6, 1.15, 4.15, 1.9);
  caption(s, "图 11.6  插入 14、55 后", 0.5, 3.15, 4.35);
  card(s, 5.15, 1.05, 4.35, 2.55, C.code);
  image(s, "fig-11-7", 5.25, 1.15, 4.15, 1.9);
  caption(s, "图 11.7  再插入 19：根分裂", 5.15, 3.15, 4.35);
  callout(s, "14、55：就地放下", "两次插入都能就地放下，树高不变——**大多数插入就是这样结束的**。", 0.5, 3.75, 4.35, 1.35, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "19：一路裂到根", "叶溢出、分裂、分界 key 上推，父结点跟着溢出，一路裂到根，树**增高一层**。B 树只在这一种情况下长高，所以所有叶永远在同一层。", 5.15, 3.75, 4.35, 1.35, { fontSize: 10.5 });
}

// 11.4 two whys
{
  const s = content("11.4", "11.4.1 B 树 · 深入讨论", "两个「为什么」");
  card(s, 0.5, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 1, 0.7, 1.25, 0.42, C.dark);
  text(s, "根为什么可以只有 2 个子结点？", 1.25, 1.28, 3.55, 0.38, { fontSize: 13.5, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "插入分裂到根时，会分为 **2 个子结点并产生一个新根**；若要求根与内部结点同样的出度，就要大调整，违背**局部调整**原则。",
    "根往往**保存在内存**中，不需要遵守下限；大部分内部结点在外存，要保证至少半满以折衷存储与操作效率。",
    "根也不可能只有 1 个子结点：浪费空间，还增加检索时间。",
  ], 0.7, 1.8, 4.0, 3.2, { fontSize: 11, gap: 7 });
  card(s, 5.15, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 2, 5.35, 1.25, 0.42, C.dark);
  text(s, "插入时为什么分裂，不「送给邻居」？", 5.9, 1.28, 3.55, 0.38, { fontSize: 13.5, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "插入可能发生在**创建阶段**，分裂出的结点很快就会增加新的关键码。",
    "送关键码要**读和修改邻居结点**，访外开销大，操作也麻烦。",
  ], 5.35, 1.8, 4.0, 1.8, { fontSize: 11, gap: 7 });
  callout(s, "对比删除", "删除下溢时反过来：**先向兄弟借，借不到再合并**。", 5.35, 3.75, 3.95, 1.1, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 11.4 delete rules
{
  const s = content("11.4", "11.4.1 B 树 · 删除", "交换—删除—借关键码—合并");
  const steps = [
    ["交换", "待删关键码不在叶层：先与**后继**对换位置再删。后继 = 右指针所指子树中最左结点的最小关键码，一定在叶层。"],
    ["删除", "在叶层直接删除；可能使关键码个数 < ⌈m/2⌉−1，产生**下溢出**。"],
    ["借", "看直接左兄弟或右兄弟（**先左后右**）：被删结点、被借结点与父结点分界码一起排列，**取中位数为新分界码**。"],
    ["合并", "兄弟也只剩 ⌈m/2⌉−1 个：本结点 + 兄弟 + 父分界码合为一个结点；父少一个关键码，可能继续合并，**传到根则树减少一层**。"],
  ];
  steps.forEach((st, i) => {
    const y = 1.08 + i * 0.83;
    numCircle(s, i + 1, 0.5, y + 0.13, 0.42, [C.green, C.green, C.goldText, C.bad][i]);
    text(s, st[0], 1.05, y, 0.8, 0.7, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, st[1], 1.85, y, 4.35, 0.75, { fontSize: 10.5, valign: "middle", margin: 0 });
  });
  callout(s, "先借还是先合并？", "一般先看能否借，借不了再合并。**阶比较小**（如 3 阶、4 阶）时删除可能出现空结点，可以**先考虑合并**，有可能降低树高；实际 B 树阶很大，不会删一个关键码就变空。", 6.45, 1.08, 3.05, 2.55, { fontSize: 10.5 });
  callout(s, "借时为什么取中位数", "让两个新兄弟所含关键码个数**基本相同**，可以延迟下一次删除引起的下溢出。", 6.45, 3.75, 3.05, 1.35, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 11.4 fig 11.8
{
  const s = content("11.4", "11.4.1 B 树 · 删除示例", "5 阶 B 树连续删除 120、150");
  card(s, 0.5, 1.05, 5.95, 4.05, C.code);
  image(s, "fig-11-8", 0.6, 1.1, 5.75, 3.95);
  callout(s, "(b) 删 120 → 借", "先与中序后继交换再删，删后下溢，向左邻**借**一个关键码。", 6.7, 1.05, 2.8, 1.45, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "(c) 删 150 → 合并", "同样先交换，删后下溢而两侧都借不到，只能**合并**；合并又让父结点下溢，一路传到根。", 6.7, 2.62, 2.8, 1.6, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
  text(s, "图 11.8  这些局部调整保证所有叶在同一层，B 树始终平衡。", 6.7, 4.35, 2.8, 0.7, { fontSize: 10, color: C.muted, margin: 0 });
}

// 11.4 B+ definition
{
  const s = content("11.4", "11.4.2 B+ 树 · 定义", "B+ 树：关键码全在叶上，内部结点只作路标");
  text(s, "B 树的变形有很多：充满度不同、各层阶不同、关键码变长……**把关键码全部顺序存储在叶结点上、索引部分是结点内最大（或最小）关键码的复写**——就是应用最广的 B+ 树。", 0.5, 1.02, 9, 0.75, { fontSize: 11.5 });
  table(s, [
    ["", "m 阶 B 树", "m 阶 B+ 树"],
    [{ t: "k 个子结点的分支结点", bold: true }, "恰好 **k−1** 个关键码", { t: "必有 **k** 个关键码", fill: C.cream }],
    [{ t: "除根外的下限", bold: true }, "内部结点至少 ⌈m/2⌉ 个子结点", "每个结点至少 ⌈m/2⌉ 个子结点"],
    [{ t: "叶的关键码数", bold: true }, "⌈m/2⌉−1 到 m−1", "⌈m/2⌉ 到 m"],
    [{ t: "记录信息在哪", bold: true }, "内部结点也带数据地址", { t: "叶包含全部关键码及记录信息", fill: C.cream }],
    [{ t: "叶之间", bold: true }, "无横向链接", { t: "可用双链表顺序链接", fill: C.cream }],
    [{ t: "范围扫描", bold: true }, "要反复爬树", "找到下限所在叶，沿叶链扫到上限"],
  ], 0.5, 1.85, 9.0, [2.2, 3.1, 3.7], { fontSize: 11, rowH: 0.4 });
  text(s, "关系数据库的磁盘索引多用 B+ 树，正是因为**范围扫描是常见操作**。", 0.5, 4.75, 9, 0.35, { fontSize: 11.5, bold: true, color: C.goldText, margin: 0 });
}

// 11.4 fig 11.9 + conventions
{
  const s = content("11.4", "11.4.2 B+ 树 · 两套约定", "原书 11.4.2 的约定 vs 本章的约定");
  card(s, 0.5, 1.05, 9.0, 1.75, C.code);
  image(s, "fig-11-9", 0.7, 1.1, 8.6, 1.4);
  caption(s, "图 11.9  3 阶 B+ 树（原书约定：分界码为子树最大关键码的复写，叶存 2～3 个 key）", 0.5, 2.5, 9.0);
  table(s, [
    ["", "本章（code/ch11/bplus_tree）", "原书 11.4.2"],
    [{ t: "order 的含义", bold: true }, "一个结点最多几个孩子", "同"],
    [{ t: "叶的关键码容量", bold: true }, "最多 order − 1（3 阶：≤ 2 个）", "⌈m/2⌉～m（3 阶：2～3 个）"],
    [{ t: "分界码取值", bold: true }, { t: "**右子树的最小关键码**", fill: C.cream }, "最大关键码复写"],
  ], 0.5, 2.9, 6.2, [1.3, 2.6, 2.3], { fontSize: 10, rowH: 0.34 });
  text(s, "两套约定都成立，对照原书读时注意这处差别；叶分裂**复写**、内部分裂**上移**，两套一致。", 0.5, 4.6, 6.2, 0.5, { fontSize: 10.5, color: C.goldText, margin: 0 });
  callout(s, "多走一步换来什么", "B+ 内部关键码只是叶键的复写，点查询**必须走到叶**。换来的是内部页只放短 key 和孩子指针：**扇出更大、树更矮**，所有记录都在同一叶层。", 6.95, 2.9, 2.55, 2.2, { fontSize: 10 });
}

// 11.4 chapter's B+ tree: search & range
{
  const s = content("11.4", "11.4.2 B+ 树 · 本章的 3 阶 B+ 树", "内部结点只导航，数据全在叶层，叶之间有横链");
  card(s, 0.5, 1.05, 5.3, 2.75, C.code);
  tnode(s, "30  |  70", 3.15, 1.3, 1.3, C.dark, C.gold);
  [1.35, 3.15, 4.95].forEach((cx, i) => {
    tedge(s, 2.75 + i * 0.4, 1.64, cx, 2.3);
    tnode(s, ["10 | 20", "30 | 50", "70 | 90"][i], cx, 2.3, 1.2);
    text(s, "记录…", cx - 0.6, 2.95, 1.2, 0.25, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
    tedge(s, cx, 2.64, cx, 2.95, "B8C7C0");
  });
  tlink(s, 1.97, 2.53, 2.47);
  tlink(s, 3.77, 4.33, 2.47);
  text(s, "叶链 ↔：范围扫描不必再回到内部结点", 0.7, 3.35, 5.0, 0.3, { fontSize: 10, color: C.goldText, bold: true, margin: 0 });
  callout(s, "查找 50", "根上 30 ≤ 50 < 70，走**中间孩子**；叶上直接取到 50。", 0.5, 3.95, 2.55, 1.15, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "查找 35 到 80", "先落到含 35 的叶，再沿 ↔ 扫过 50、70，直到超过 80。", 3.25, 3.95, 2.55, 1.15, { fontSize: 10.5 });
  callout(s, "等于分界码走哪边？", "本章分界码 = **右子树的最小 key**，所以等于分界码要**走右边**（代码里用 `upper_bound`）。", 6.05, 1.05, 3.45, 1.3, { fontSize: 10.5 });
  callout(s, "这棵树从哪来", "11.2 的 `bulk_load(3, rows, 2)`：6 条记录每叶装 2 个，自底向上建出根 `[30,70]`。", 6.05, 2.47, 3.45, 1.3, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "对照 B 树", "B 树命中内部关键码时就可能拿到记录；B+ 树要走到叶，但**路径长度统一**。", 6.05, 3.9, 3.45, 1.2, { fontSize: 10.5 });
}

// 11.4 insert 60
{
  const s = content("11.4", "11.4.2 B+ 树 · 插入", "插入 60：叶裂 → 根裂 → 树增高一层");
  table(s, [
    ["阶段", "发生溢出的页", "局部结果", "向父层传什么"],
    ["插入前", "-", { t: "叶 [30,50]", mono: true }, "-"],
    [{ t: "插入 60", bold: true }, "叶页", { t: "[30] 与 [50,60]", mono: true }, { t: "复写 50", bold: true, color: C.green }],
    ["父层接收 50", "原根", { t: "key 变为 [30,50,70]，4 个孩子", mono: false }, { t: "上移 50", bold: true, color: C.bad }],
    ["建新根", "根", { t: "新根 [50]，树高加 1", mono: false }, "结束"],
  ], 0.5, 1.05, 5.0, [0.95, 0.95, 1.95, 1.15], { fontSize: 9.5, rowH: 0.34 });
  text(s, "中间叶暂成 `[30|50|60]`，超过 2 个 key 的上限：取中位数 50 作分界，50 **复写**一份上推（叶上仍保留）；根成了 `[30|50|70]`、要挂 4 个孩子，同样超限，中位数 50 **上移**成为新根。", 0.5, 3.0, 5.0, 1.15, { fontSize: 10.5, margin: 0 });
  callout(s, "最容易混的一处", "叶分裂：分界 key **复写**（叶上仍留一份）；内部结点分裂：分界 key **上移**（原结点不再保留）。", 0.5, 4.2, 5.0, 0.9, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  card(s, 5.75, 1.05, 3.75, 4.05, C.code);
  text(s, "插入后", 5.9, 1.12, 2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  tnode(s, "50", 7.625, 1.5, 0.7, C.dark, C.gold);
  tnode(s, "30", 6.7, 2.35, 0.6);
  tnode(s, "70", 8.55, 2.35, 0.6);
  tedge(s, 7.45, 1.84, 6.7, 2.35); tedge(s, 7.8, 1.84, 8.55, 2.35);
  const leaves = [["10|20", 6.18], ["30", 6.95], ["50|60", 8.05], ["70|90", 8.95]];
  leaves.forEach(([l, cx], i) => {
    tnode(s, l, cx, 3.25, i === 1 ? 0.5 : 0.72, i === 2 ? "CDEBD9" : C.mint, C.dark, 10);
  });
  tedge(s, 6.55, 2.69, 6.18, 3.25); tedge(s, 6.85, 2.69, 6.95, 3.25);
  tedge(s, 8.4, 2.69, 8.05, 3.25); tedge(s, 8.7, 2.69, 8.95, 3.25);
  tlink(s, 6.55, 6.69, 3.42); tlink(s, 7.21, 7.68, 3.42); tlink(s, 8.42, 8.58, 3.42);
  s.addText("[50] / [30] [70] /\n[10,20] [30] [50,60] [70,90]", { x: 5.9, y: 3.85, w: 3.5, h: 0.55, fontFace: MONO, fontSize: 9.5, color: C.text, margin: 0, isTextBox: true, valign: "top" });
  text(s, "demo 用 `to_string()` 逐层打印，与此一致", 5.9, 4.5, 3.5, 0.5, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// 11.4 split_leaf
{
  const s = content("11.4", "11.4.2 B+ 树 · modern.hpp#bplus-split（上）", "split_leaf：分界码复写上推，叶上仍保留");
  codeBlock(s, `void split_leaf(Node* node, Split& split) {
    const std::size_t mid = node->keys.size() / 2;
    auto right = std::make_unique<Node>(true);
    right->keys.assign(node->keys.begin() + static_cast<std::ptrdiff_t>(mid), node->keys.end());
    right->values.assign(std::make_move_iterator(node->values.begin() + static_cast<std::ptrdiff_t>(mid)),
                         std::make_move_iterator(node->values.end()));
    node->keys.resize(mid);
    node->values.resize(mid);
    right->next = node->next;
    node->next = right.get();
    // 叶分裂：分界码是右叶最小关键码，复写上推，叶上仍保留。
    split.happened = true;
    split.separator = right->keys.front();
    split.right = std::move(right);
    writes_ += 2;
}`, 0.5, 1.05, 9.0, 2.85, { fontSize: 9, hl: [9, 10, 13] });
  // diagram
  card(s, 0.5, 4.0, 4.6, 1.1, C.code);
  tnode(s, "30|50|60", 1.3, 4.38, 1.05, "F9D5D0", C.dark, 10);
  s.addShape(pres.shapes.LINE, { x: 1.9, y: 4.55, w: 0.45, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
  tnode(s, "30", 2.75, 4.38, 0.55);
  tnode(s, "50|60", 3.65, 4.38, 0.8, "CDEBD9", C.dark, 10);
  tlink(s, 3.03, 3.25, 4.55);
  text(s, "上推 50", 4.1, 4.38, 0.95, 0.34, { fontSize: 10, bold: true, color: C.green, valign: "middle", margin: 0 });
  text(s, "mid = 3/2 = 1", 0.6, 4.75, 2.5, 0.3, { fontSize: 9, color: C.muted, fontFace: MONO, margin: 0 });
  callout(s, "别漏了第 9–10 行", "新右叶要**接进叶链**：`right->next = node->next; node->next = right`。漏掉它点查询全绿，范围扫描却会断。`writes_ += 2`：写出左右两页。", 5.35, 4.0, 4.15, 1.1, { fontSize: 10 });
}

// 11.4 split_internal
{
  const s = content("11.4", "11.4.2 B+ 树 · modern.hpp#bplus-split（下）", "split_internal：中位数上移，原结点不再保留");
  codeBlock(s, `void split_internal(Node* node, Split& split) {
    const std::size_t mid = node->keys.size() / 2;
    auto right = std::make_unique<Node>(false);
    // 内部结点分裂：中位数上移，原结点不再保留它。
    split.separator = node->keys[mid];
    right->keys.assign(node->keys.begin() + static_cast<std::ptrdiff_t>(mid) + 1, node->keys.end());
    right->children.assign(
        std::make_move_iterator(node->children.begin() + static_cast<std::ptrdiff_t>(mid) + 1),
        std::make_move_iterator(node->children.end()));
    node->keys.resize(mid);
    node->children.resize(mid + 1);
    split.happened = true;
    split.right = std::move(right);
    writes_ += 2;
}`, 0.5, 1.05, 9.0, 2.65, { fontSize: 9, hl: [5, 6] });
  card(s, 0.5, 3.85, 4.6, 1.25, C.code);
  tnode(s, "30|50|70", 1.3, 4.3, 1.05, "F9D5D0", C.dark, 10);
  s.addShape(pres.shapes.LINE, { x: 1.9, y: 4.47, w: 0.45, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
  tnode(s, "50", 3.4, 3.95, 0.55, C.dark, C.gold, 10);
  tnode(s, "30", 2.8, 4.6, 0.55);
  tnode(s, "70", 4.0, 4.6, 0.55);
  tedge(s, 3.25, 4.29, 2.8, 4.6); tedge(s, 3.55, 4.29, 4.0, 4.6);
  text(s, "keys: [0, mid) 留下，mid 上移，(mid, end) 去右边", 0.6, 3.9, 2.0, 0.35, { fontSize: 8, color: C.muted, margin: 0 });
  callout(s, "对照 split_leaf", [
    "叶：`right` 从 `mid` 开始 → 分界码**仍在右叶**。",
    "内部：`right` 从 `mid + 1` 开始 → `keys[mid]` **只去父结点**。",
    "孩子数 = 关键码数 + 1：左边留 `mid + 1` 个孩子。",
  ], 5.35, 3.85, 4.15, 1.25, { fontSize: 9.5, gap: 2 });
}

// 11.4 demo (1/2)
{
  const s = content("▶", "11.4 B+ 树 · 先跑一遍 code/ch11/bplus_tree/demo.cpp（上）", "批量装入，再插入 60、65");
  codeBlock(s, `#include "modern.hpp"

#include <cstdio>

int main() {
    using dsa::index::BPlusTree;
    std::vector<std::pair<int, std::string>> rows;
    for (const int key : {10, 20, 30, 50, 70, 90}) {
        rows.emplace_back(key, "记录" + std::to_string(key));
    }
    // 11.2：批量装入，按页填满。
    BPlusTree tree = BPlusTree::bulk_load(3, rows, 2);
    std::printf("装入后   : %s\\n", tree.to_string().c_str());

    // 11.4：插入 60，叶裂 → 根裂 → 树增高一层。
    tree.insert(60, "记录60");
    std::printf("插入 60  : %s（树高 %zu）\\n", tree.to_string().c_str(), tree.height());
    tree.insert(65, "记录65");
    std::printf("插入 65  : %s（父结点没满，没裂到根）\\n", tree.to_string().c_str());
    // ...`, 0.5, 1.05, 6.75, 3.1, { fontSize: 8, hl: [12, 16, 18] });
  callout(s, "为什么没裂到根", "65 落进叶 `[50,60]` → `[50,60,65]` 溢出，裂成 `[50]` 与 `[60,65]`，复写 60 上推；父结点 `[70]` 只有 1 个 key，收下后成 `[60,70]`，**没超限**，到此结束。", 7.45, 1.05, 2.05, 3.1, { fontSize: 9.5 });
  consoleBlock(s, "装入后   : [30,70] / [10,20] [30,50] [70,90]\n插入 60  : [50] / [30] [70] / [10,20] [30] [50,60] [70,90]（树高 3）\n插入 65  : [50] / [30] [60,70] / [10,20] [30] [50] [60,65] [70,90]（父结点没满，没裂到根）", 0.5, 4.25, 9.0, 0.87, 9);
}

// 11.4 demo (2/2)
{
  const s = content("▶", "11.4 B+ 树 · 先跑一遍 code/ch11/bplus_tree/demo.cpp（下）", "点查询、范围扫描、删除");
  codeBlock(s, `    // ...
    tree.reset_counters();
    // 先取结果再取计数：printf 的实参求值顺序没有保证。
    const auto found = tree.find(50);
    const std::size_t point_reads = tree.page_reads();
    std::printf("查找 50  : %s，读了 %zu 页\\n", found->c_str(), point_reads);

    tree.reset_counters();
    const auto scan = tree.range(35, 80);
    const std::size_t scan_reads = tree.page_reads();
    std::printf("范围 35..80 :");
    for (const auto& row : scan) {
        std::printf(" %d", row.first);
    }
    std::printf("，读了 %zu 页\\n", scan_reads);

    tree.erase(70);
    std::printf("删除 70  : %s\\n", tree.to_string().c_str());
    return 0;
}`, 0.5, 1.05, 5.9, 3.1, { fontSize: 8.5, hl: [3] });
  callout(s, "查找 50：3 页", "树高 3：根 `[50]` → 内部 `[60,70]` → 叶 `[50]`，每层读一页。", 6.6, 1.05, 2.9, 1.25, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "删除 70：路标重算", "叶 `[70,90]` → `[90]`，仍达下限（1 个），不借不合并；但父分界 70 已过期，按「右子树最小 key」重算成 `[60,90]`。", 6.6, 2.42, 2.9, 1.73, { fontSize: 10 });
  consoleBlock(s, "查找 50  : 记录50，读了 3 页\n范围 35..80 : 50 60 65 70，读了 6 页\n删除 70  : [50] / [30] [60,90] / [10,20] [30] [50] [60,65] [90]", 0.5, 4.25, 9.0, 0.87, 9);
}

// 11.4 range code + trace
{
  const s = content("11.4", "11.4.2 B+ 树 · modern.hpp#bplus-range", "范围扫描：找到下限所在的叶，然后沿叶链横着走");
  codeBlock(s, `/// 范围扫描：找到下限所在的叶，然后沿叶链横着走，不再回到内部结点。
[[nodiscard]] std::vector<std::pair<int, std::string>> range(int low, int high) const {
    std::vector<std::pair<int, std::string>> out;
    if (low > high) {
        return out;
    }
    const Node* node = root_.get();
    while (!node->leaf) {
        ++reads_;
        node = node->children[child_slot(*node, low)].get();
    }
    while (node != nullptr) {
        ++reads_;
        for (std::size_t i = 0; i < node->keys.size(); ++i) {
            if (node->keys[i] > high) {
                return out;
            }
            if (node->keys[i] >= low) {
                out.emplace_back(node->keys[i], node->values[i]);
            }
        }
        node = node->next;
    }
    return out;
}`, 0.5, 1.05, 6.2, 4.05, { fontSize: 7.9, hl: [8, 12, 22] });
  text(s, "range(35, 80) 读的 6 页", 6.85, 1.05, 2.65, 0.3, { fontSize: 9.5, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["#", "读的页", "动作"],
    ["1", { t: "[50]", mono: true }, "35 < 50 → 左孩子"],
    ["2", { t: "[30]", mono: true }, "35 ≥ 30 → 右孩子"],
    ["3", { t: "[30]", mono: true }, "叶：30 < 35，跳过"],
    ["4", { t: "[50]", mono: true }, "收 50"],
    ["5", { t: "[60,65]", mono: true }, "收 60、65"],
    ["6", { t: "[70,90]", mono: true }, { t: "收 70；90>80 返回", bold: true, color: C.bad }],
  ], 6.85, 1.4, 2.65, [0.3, 0.8, 1.55], { fontSize: 9, rowH: 0.34, align: "left" });
  text(s, "前 2 页在内部结点下降，后 4 页全是**沿叶链横走**——输出 50 60 65 70，读 6 页，与 demo 一致。", 6.85, 3.95, 2.65, 1.1, { fontSize: 10, margin: 0 });
}

// 11.4 B+ delete
{
  const s = content("11.4", "11.4.2 B+ 树 · 删除", "删除—借关键码—合并，不需要交换");
  const steps = [
    "页仍达到最小占用 → 更新必要的父分界后结束；",
    "页下溢且相邻兄弟有富余 → **借一个键**并重算父分界；",
    "兄弟也在下限 → **合并两页**，父结点少一个 key 和一个孩子；",
    "父结点因此下溢 → 向上重复；若根只剩一个孩子，让它成为新根，**树高减 1**。",
  ];
  steps.forEach((st, i) => {
    const y = 1.08 + i * 0.52;
    numCircle(s, i + 1, 0.5, y + 0.06, 0.36, C.green);
    text(s, st, 0.98, y, 4.75, 0.48, { fontSize: 11, valign: "middle", margin: 0 });
  });
  callout(s, "⚠ 容易漏的一处：过期路标", "借位和合并都会把父结点的分界 key 搬进孩子里，而那个 key 可能**正是刚被删掉的**——搬完必须按「分界 key = 右子树最小 key」重算，否则树里会留下一个指向已删关键码的路标。**这个错误不影响点查询**，只有结构不变量检查 `validate()` 才看得出来。", 0.5, 3.25, 5.25, 1.85, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  card(s, 6.0, 1.05, 3.5, 2.05, C.code);
  image(s, "fig-11-11", 6.1, 1.15, 3.3, 1.5);
  caption(s, "图 11.11  从 3 阶 B+ 树删除 75 后", 6.0, 2.72, 3.5);
  callout(s, "原书的做法", "图 11.11 里内部结点上那份 75 的复写**可以留着不动**——它只是路标，不必对应一个真实存在的键。本章实现选择**重算**，好让 `validate()` 把关。", 6.0, 3.25, 3.5, 1.85, { fontSize: 10.5 });
}

// 11.4 mixed B+ tree
{
  const s = content("11.4", "11.4.2 B+ 树 · 混合型", "内部结点与叶结点的阶可以不同");
  card(s, 0.5, 1.05, 5.3, 4.05, C.code);
  image(s, "fig-11-12", 0.6, 1.1, 5.1, 1.0);
  caption(s, "图 11.12  混合型 B+ 树：内部阶 4，叶阶 5", 0.5, 2.12, 5.3);
  image(s, "fig-11-13", 0.6, 2.45, 5.1, 1.0);
  caption(s, "图 11.13  插入 22 之后", 0.5, 3.47, 5.3);
  image(s, "fig-11-14", 0.6, 3.8, 5.1, 1.0);
  caption(s, "图 11.14  再删除 40 之后", 0.5, 4.8, 5.3);
  bullets(s, [
    "内部结点只放**短 key 和页号**，放得下的多；叶要放记录或记录地址，放得少。",
    "内外阶数不同的叫**混合型 B+ 树**。",
    "分裂与合并的规则不变，只是**内外两层各按各自的阶**判断溢出和下溢。",
  ], 6.05, 1.05, 3.45, 2.6, { fontSize: 11.5, gap: 8 });
  callout(s, "对照原书习题 17", "内部阶 100、叶阶 15 的混合型 B+ 树，1～5 层各能存多少记录？", 6.05, 3.75, 3.45, 1.35, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 11.4 B vs B+ three sentences
{
  const s = content("11.4", "11.4.2 B 树 vs B+ 树", "三句话记住区别");
  const items = [
    ["记录在不在内部结点", "B 树内部关键码带数据地址，命中即可取；B+ 树内部只是叶键的复写，**必须查到叶**。", C.green],
    ["叶有没有横向链接", "B+ 树所有叶构成一个有序链表，可以**按关键码有序遍历**全部记录。", C.goldText],
    ["范围扫描要不要反复爬树", "B 树只适合随机检索；B+ 树同时支持**随机检索和顺序检索**（尤其范围检索），实际应用更多。", C.dark],
  ];
  items.forEach((it, i) => {
    const y = 1.1 + i * 0.97;
    card(s, 0.5, y, 9.0, 0.85, C.code);
    numCircle(s, i + 1, 0.7, y + 0.2, 0.44, it[2]);
    text(s, it[0], 1.35, y + 0.05, 2.7, 0.75, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, it[1], 4.1, y + 0.05, 5.25, 0.75, { fontSize: 11, valign: "middle", margin: 0 });
  });
  callout(s, "⚠ 分裂与合并要同时维护叶链", "只修父子指针而漏掉 `next`，点查询仍可能全绿，范围查询却会跨不过断链。所以测试既要逐键 `find`，也要把**全范围扫描结果与排序后的记录全集对拍**。", 0.5, 4.05, 9.0, 1.05, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
}

// 11.4 performance: height, splits, B vs B+
{
  const s = content("11.4", "11.4.3 B 树的性能分析", "树高有上界，分裂次数有上界");
  card(s, 0.5, 1.05, 4.35, 2.95, C.code);
  text(s, "树高", 0.7, 1.12, 3, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "N 个关键码 → N+1 个外部空结点，设都在第 I 层（根为第 0 层）。第 1 层至少 2 个结点，第 I 层至少 2⌈m/2⌉^(I−1) 个：", 0.7, 1.45, 4.0, 0.95, { fontSize: 10.5, margin: 0 });
  text(s, "I ≤ 1 + log⌈m/2⌉((N+1)/2)", 0.7, 2.45, 4.0, 0.4, { fontSize: 14, bold: true, color: C.green, margin: 0 });
  text(s, "N = 1999998、m = 199 时，**I 至多等于 4**：一次检索至多 I 次存取。", 0.7, 2.95, 4.0, 0.9, { fontSize: 11, margin: 0 });
  card(s, 5.15, 1.05, 4.35, 2.95, C.code);
  text(s, "每插入一个关键码平均分裂几个结点", 5.35, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "p 个内部结点时 N ≥ 1 + (⌈m/2⌉−1)(p−1)；最坏情况插入 N 个关键码做了 p−1 次分裂：", 5.35, 1.45, 4.0, 0.95, { fontSize: 10.5, margin: 0 });
  text(s, "s = (p−1)/N ≤ 1/(⌈m/2⌉−1)", 5.35, 2.45, 4.0, 0.4, { fontSize: 14, bold: true, color: C.green, margin: 0 });
  text(s, "m 越大这个数越小——**「结点开大一点」在插入代价上的回报**。", 5.35, 2.95, 4.0, 0.9, { fontSize: 11, margin: 0 });
  callout(s, "B 树与 B+ 树谁更矮？", "B+ 树内部结点的关键码不需要带隐含指针。页块容量、指针大小相同时索引同一个主文件，**B 树比 B+ 树高**。设一页可存 m 个（关键码, 子页地址）对、平均充盈度 (1+0.5)/2 = 75%，B+ 树高度为 ⌈log₀.₇₅ₘ N⌉。", 0.5, 4.12, 9.0, 0.98, { fontSize: 10.5 });
}

// 11.4 4096-byte bill
{
  const s = content("11.4", "11.4.3 B+ 树的索引规模", "全章最值得记住的一笔账");
  text(s, "磁盘块 4096 字节，整数关键码 4 字节，指针 8 字节，不计块头：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  const steps = [
    ["4m + 8(m+1) ≤ 4096", "B+ 树的阶 m = 340"],
    ["平均 255 个指针", "充满度介于最大和最小之间"],
    ["255² = 65025", "3 层树的叶结点数"],
    ["255³ ≈ 16.6 × 10⁶", "指向记录的指针数"],
  ];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.5, 2.1, 1.45, i === 3 ? C.dark : C.code);
    text(s, st[0], x + 0.08, 1.6, 1.94, 0.75, { fontSize: 13.5, bold: true, color: i === 3 ? C.gold : C.dark, align: "center", valign: "middle", margin: 0 });
    text(s, st[1], x + 0.08, 2.38, 1.94, 0.5, { fontSize: 10, color: i === 3 ? C.mint : C.muted, align: "center", margin: 0 });
  });
  callout(s, "结论", "记录数 ≤ 约 **1660 万**的文件都可以被 **3 层 B+ 树**容纳，**3 次访外**就能拿到关键码在主文件的地址。", 0.5, 3.15, 4.35, 1.95, { fontSize: 11.5 });
  callout(s, "实际上还可以更少", "树根通常在内存；现在内存大，把第二层结点也完全放在缓冲区是合理的——**只需读一次叶结点磁盘块**。这就是今天数据库索引的常见形态：三层 B+ 树 + 常驻内存的上两层。", 5.15, 3.15, 4.35, 1.95, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 11.4.4 static vs dynamic
{
  const s = content("11.4", "11.4.4 动态索引和静态索引的比较", "更新成本由谁承担？");
  callout(s, "静态索引", [
    "新增记录进**溢出区并挂链**，不主动重排主文件。",
    "结点紧凑、层数少，记录地址稳定。",
    "插删积累后溢出链变长、空洞增多 → 最终要**停下来重组**。",
  ], 0.5, 1.05, 4.35, 1.85, { fontSize: 10.5 });
  callout(s, "动态索引（B / B+ 树）", [
    "分裂、借位、合并保持平衡；新旧记录**渐近查询代价相同**。",
    "空间按需分配，不需要周期性全文件重组。",
    "代价：结点要留孩子指针；更新还要处理并发锁与辅助索引的地址变化。",
  ], 5.15, 1.05, 4.35, 1.85, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  table(s, [
    ["工作负载", "更合适的选择", "原因"],
    ["数据几乎只读、可批量重建", { t: "静态索引", bold: true }, "结构紧凑，读路径短"],
    ["持续插入和删除", { t: "B/B+ 树动态索引", bold: true }, "局部调整即可保持查询性能"],
    ["范围扫描很多", { t: "B+ 树", bold: true }, "数据集中在叶层，叶链可顺序读"],
    ["记录物理地址必须长期稳定", { t: "静态索引", bold: true }, "不因结点分裂搬动既有记录"],
  ], 0.5, 3.0, 9.0, [3.0, 2.2, 3.8], { fontSize: 10.5, rowH: 0.3 });
  text(s, "静态索引把成本**推迟到批量重组**，动态索引把成本**摊到每次更新**。", 0.5, 4.65, 9, 0.4, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
}

// ============================ PART 5 ============================
sectionSlide("Part 5 · 11.5", "位索引技术", "位图：一个属性值一条位串 · 按位运算 · 尾部掩码\n游程压缩 · 签名文件（粗筛）· 红黑树（与 B+ 树对照）");

// 11.5 bitmap concept
{
  const s = content("11.5", "11.5 位图索引", "每个属性值一条位串，第 i 位 = 第 i 条记录有没有这个值");
  bullets(s, [
    "适合**取值很少**的属性：性别、省份、是否及格。",
    "AND、OR、NOT 查询变成**机器字上的按位运算**，一次处理几十上百条记录。",
    "属性取值一多，位图会变得很宽，需要压缩（游程、字对齐混合等）。",
  ], 0.5, 1.05, 4.3, 2.4, { fontSize: 12, gap: 10 });
  card(s, 5.05, 1.05, 4.45, 2.55, C.code);
  image(s, "fig-11-15-a", 5.15, 1.12, 4.25, 2.1);
  caption(s, "图 11.15(a)  百货销售记录与 State=NY 的位向量", 5.05, 3.25, 4.45);
  callout(s, "空间 ≈ 记录数 × 不同取值数（位）", "低基数列很合算：一百万条记录的「是否及格」只有两张约 **122 KiB** 的位图；若把几乎每人不同的学号做位图，就会生成**近一百万张**位图，完全失去意义。", 0.5, 3.75, 9.0, 1.35, { fontSize: 11 });
}

// 11.5 bitmap sets
{
  const s = content("11.5", "11.5 位图索引", "一个数据域 = 一组位向量");
  table(s, [
    ["State=AK", "State=AL", "…", "State=NY"],
    ["0", "0", "", { t: "1", bold: true, color: C.green }],
    ["0", "1", "", "0"],
    ["0", "0", "", { t: "1", bold: true, color: C.green }],
    ["1", "0", "", "0"],
    ["0", "0", "", { t: "1", bold: true, color: C.green }],
    ["1", "0", "", "0"],
  ], 0.5, 1.4, 4.2, [1.2, 1.2, 0.6, 1.2], { fontSize: 10, rowH: 0.3, align: "center", tight: true });
  text(s, "(b) 数据域 State 的位向量集合", 0.5, 1.05, 4.2, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  card(s, 5.0, 1.05, 4.5, 2.75, C.code);
  image(s, "fig-11-15-c", 5.1, 1.12, 4.3, 2.3);
  caption(s, "图 11.15(c)  数据域 Class 的位向量集合", 5.0, 3.45, 4.5);
  callout(s, "位图为什么只适合低基数属性", "State 有多少个取值，(b) 就有多少列，每列长度都是记录条数；查询变成位串之间的按位运算。**属性取值越多，位图越宽。**", 0.5, 4.1, 9.0, 1.0, { fontSize: 11 });
}

// 11.5 AND example & NOT tail
{
  const s = content("11.5", "11.5 位图索引 · 手算", "State=NY AND Class=A");
  const rows = [["State=NY", [1, 0, 1, 0, 1, 0]], ["Class=A", [1, 1, 0, 1, 1, 0]], ["AND", [1, 0, 0, 0, 1, 0]]];
  rows.forEach((r, i) => {
    const y = 1.2 + i * 0.62;
    text(s, r[0], 0.5, y, 1.3, 0.42, { fontSize: 12, bold: true, color: i === 2 ? C.bad : C.dark, valign: "middle", margin: 0 });
    const fills = r[1].map((b) => (i === 2 && b ? "F9D5D0" : b ? C.mint : C.white));
    cells(s, 1.85, y, r[1], { cw: 0.5, ch: 0.42, fs: 12, fills, idx: i === 2 });
  });
  s.addShape(pres.shapes.LINE, { x: 1.85, y: 2.39, w: 3.0, h: 0, line: { color: C.dark, width: 1.2 } });
  text(s, "结果位 0 和 4 为 1 → 返回第 1、5 条记录（程序下标从 0 开始则是 0、4）。OR 返回满足任一条件的记录。", 0.5, 3.2, 4.5, 0.9, { fontSize: 11, margin: 0 });
  callout(s, "⚠ NOT 的尾部陷阱", "6 条记录只用了一个 64 位机器字的**前 6 位**。取反后其余 **58 位**全变成 1，会被误认成记录——NOT 必须把**超出实际记录数的尾部位清零**。", 5.3, 1.15, 4.2, 2.1, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "数据来自图 11.15(a)", "State 列：NY AL NY AK NY AK；Class 列：A A B A A B。", 5.3, 3.4, 4.2, 1.0, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "一次机器字运算处理 64 条记录：这是位图快的全部理由。", 0.5, 4.5, 9, 0.4, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
}

// 11.5 demo (1/2)
{
  const s = content("▶", "11.5 位索引 · 先跑一遍 code/ch11/bitmap_index/demo.cpp（上）", "200 条记录的「是否及格」");
  codeBlock(s, `#include "modern.hpp"

#include <cstdio>

int main() {
    dsa::index::BitmapIndex index;
    for (int i = 0; i < 200; ++i) {
        index.add_record((i % 3) == 0 ? "及格" : "不及格");
    }
    index.reset_ops();
    const auto passed = index.select("及格");
    const auto failed = index.select_not("及格");
    std::printf("200 条记录，%zu 个取值，位图共 %zu 个机器字\\n",
                index.distinct_values(), index.words());
    std::printf("及格 %zu 条，不及格 %zu 条；取反只做了 %zu 次字运算\\n",
                passed.size(), failed.size(), index.word_ops());
    // ...`, 0.5, 1.05, 6.2, 3.05, { fontSize: 9, hl: [12] });
  consoleBlock(s, "200 条记录，2 个取值，位图共 8 个机器字\n及格 67 条，不及格 133 条；取反只做了 4 次字运算", 0.5, 4.2, 6.2, 0.9, 10);
  callout(s, "数一数", [
    "200 位 → ⌈200/64⌉ = **4 个字**；2 个取值 × 4 = **8 个字**。",
    "i % 3 == 0：0, 3, …, 198 共 **67** 条及格。",
    "`select_not` 逐字取反：**4 次字运算**处理完全部 200 条记录。",
  ], 6.95, 1.05, 2.55, 4.05, { fontSize: 10.5, gap: 6 });
}

// 11.5 demo (2/2)
{
  const s = content("▶", "11.5 位索引 · 先跑一遍 code/ch11/bitmap_index/demo.cpp（下）", "稀疏位图的游程压缩；签名粗筛");
  codeBlock(s, `    // ...
    // 稀疏位图：大片全 0 的字，游程压缩很有效。
    dsa::index::BitmapIndex sparse;
    for (int i = 0; i < 1000; ++i) {
        sparse.add_record(i < 3 ? "命中" : "其他");
    }
    const auto bits = sparse.bitmap("命中");
    const auto encoded = dsa::index::run_length_encode(bits);
    std::printf("稀疏位图 %zu 个字 → 游程压缩后 %zu 个字\\n", bits.size(), encoded.size());

    dsa::index::SignatureFile signatures(2);
    signatures.add(1, {"数据", "结构"});
    signatures.add(2, {"算法", "分析"});
    std::printf("签名粗筛「数据」的候选文档数：%zu（仍需回原文确认）\\n",
                signatures.candidates({"数据"}).size());
    return 0;
}`, 0.5, 1.05, 6.8, 3.0, { fontSize: 8, hl: [8, 15] });
  consoleBlock(s, "稀疏位图 16 个字 → 游程压缩后 4 个字\n签名粗筛「数据」的候选文档数：1（仍需回原文确认）", 0.5, 4.2, 6.8, 0.9, 10);
  callout(s, "16 → 4 怎么来的", "1000 位 → **16 个字**。「命中」只有前 3 条：第 0 个字是 0b111，后 15 个字全 0。字级游程存「重复次数 + 字值」：(1, 0b111)、(15, 0) = **4 个字**。", 7.5, 1.05, 2.0, 4.05, { fontSize: 10.5 });
}

// 11.5 bitmap ops code
{
  const s = content("11.5", "11.5 位索引 · modern.hpp#bitmap-ops", "查询只是逐字的按位运算");
  codeBlock(s, `/// 「与」：逐字 \`&\`。\`word_ops()\` 数的就是这里做了几次字运算。
[[nodiscard]] std::vector<std::size_t> select_and(const std::string& a,
                                                  const std::string& b) const {
    return to_records(combine(bitmap(a), bitmap(b), Op::And));
}

[[nodiscard]] std::vector<std::size_t> select_or(const std::string& a,
                                                 const std::string& b) const {
    return to_records(combine(bitmap(a), bitmap(b), Op::Or));
}

[[nodiscard]] std::vector<std::size_t> select_not(const std::string& value) const {
    std::vector<std::uint64_t> bits = bitmap(value);
    for (auto& word : bits) {
        word = ~word;
        ++ops_;
    }
    mask_tail(bits);  // 最后一个字里超出记录数的那些位必须清掉
    return to_records(bits);
}`, 0.5, 1.05, 6.0, 2.95, { fontSize: 8, hl: [18] });
  codeBlock(s, `void mask_tail(std::vector<std::uint64_t>& bits) const {
    const std::size_t used = records_ % kBitsPerWord;
    if (used != 0 && !bits.empty()) {
        bits.back() &= (std::uint64_t{1} << used) - 1;
    }
}`, 0.5, 4.1, 6.0, 1.0, { fontSize: 8, hl: [4] });
  callout(s, "位图实现最常见的一个洞", "记录数不是 64 的整数倍时，最后一个字里超出记录数的那些位取反后会变成 1，于是**冒出根本不存在的记录号**。", 6.75, 1.05, 2.75, 2.0, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "掩码怎么算", "用了 `used` 位 → 掩码 `(1 << used) − 1` 保留低 `used` 位。200 条记录：used = 200 % 64 = **8**。", 6.75, 3.2, 2.75, 1.9, { fontSize: 10.5 });
}

// 11.5 compression & signature
{
  const s = content("11.5", "11.5 位索引 · 压缩与签名", "游程压缩不是万能的；签名只做粗筛");
  codeBlock(s, `/// 粗筛：文档签名必须**包含**查询签名的每一位。
[[nodiscard]] std::vector<int> candidates(const std::vector<std::string>& query) const {
    const std::uint64_t wanted = signature_of(query);
    std::vector<int> out;
    for (std::size_t i = 0; i < docs_.size(); ++i) {
        if ((signatures_[i] & wanted) == wanted) {
            out.push_back(docs_[i]);
        }
    }
    return out;
}`, 0.5, 1.05, 6.85, 2.05, { fontSize: 8.5, hl: [6] });
  callout(s, "签名文件", "把文档特征散列成较短的位串（各词位串**按位或**）。先用签名丢掉不可能匹配的文档，再回原文确认。", 7.5, 1.05, 2.0, 2.05, { fontSize: 9.5 });
  callout(s, "可能假阳性", "若「数据」「结构」散列后碰巧置上了与「算法」相同的几位，查「算法」时这篇文档会进入候选集。粗筛后**必须回原文确认**。", 0.5, 3.25, 2.9, 1.85, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "绝不假阴性", "构造签名时把每个真实词的位都置上：真正含「算法」的文档**不可能被漏掉**。它适合「先粗筛、再精查」，**不替代倒排**。", 3.55, 3.25, 2.9, 1.85, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "压缩会变大", "稀疏位图 16 个字压到 4 个；但 0 和 1 交替的稠密位图，游程压缩后**反而更大**——`test.cpp` 直接断言了这一点。", 6.6, 3.25, 2.9, 1.85, { fontSize: 10.5 });
}

// 11.5 red-black tree concept
{
  const s = content("11.5", "11.5 红黑树（概念导读）", "内存里的近似平衡二叉搜索树");
  card(s, 0.5, 1.05, 4.4, 2.5, C.code);
  image(s, "fig-11-16", 0.6, 1.12, 4.2, 2.0);
  caption(s, "图 11.16  红黑树示意图", 0.5, 3.18, 4.4);
  callout(s, "颜色约束", [
    "根为黑。",
    "红结点不能有红孩子。",
    "从任一结点到其后代空叶的**黑结点数相同**。",
  ], 5.15, 1.05, 4.35, 1.6, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  card(s, 5.15, 2.8, 4.35, 0.75, C.dark);
  text(s, "n 个内部结点：树高 ≤ 2 log₂(n+1) + 1", 5.15, 2.8, 4.35, 0.75, { fontSize: 13, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
  bullets(s, [
    "「平衡」不是左右子树等高，而是用颜色约束控制最长路径：**最长路径不超过最短路径的两倍**。",
    "查找、插入、删除都是 **O(log n)**，旋转次数有常数上限。",
    "适合进程地址空间里的有序映射，**不替代按页组织的 B+ 树**。C++ STL 的 `set` / `map` 等用了红黑树的变体。",
  ], 0.5, 3.7, 9.0, 1.45, { fontSize: 11, gap: 5 });
}

// 11.5 RB insert case 1
{
  const s = content("11.5", "11.5 红黑树 · 插入", "新结点着红；父子都红时看叔父——情况 1：叔父黑，旋转");
  card(s, 0.5, 1.05, 4.0, 2.0, C.code);
  image(s, "fig-11-17", 0.6, 1.12, 3.8, 1.5);
  caption(s, "图 11.17  父红、叔父黑", 0.5, 2.68, 4.0);
  card(s, 4.75, 1.05, 4.75, 2.55, C.code);
  image(s, "fig-11-18", 4.85, 1.12, 4.55, 2.08);
  caption(s, "图 11.18  叔父为黑时的四种重构", 4.75, 3.22, 4.75);
  bullets(s, [
    "先按普通 BST 找到位置，把新结点着成**红色**；父结点是黑的就结束。",
    "图 11.17：新增结点 X 是父结点 A 的左孩子；X 是右孩子时先把 X 与 A 换位，化归成同一种形状。",
  ], 0.5, 3.2, 4.1, 1.9, { fontSize: 10.5, gap: 5 });
  callout(s, "四种（LL、LR、RL、RR）是同一件事", "取「双红结点 + 祖父」这三个键的**中位数当新的子根、着黑**，另外两个当它的孩子、着红。黑高不变，**调整到此结束**。", 4.75, 3.75, 4.75, 1.35, { fontSize: 10.5 });
}

// 11.5 RB insert case 2
{
  const s = content("11.5", "11.5 红黑树 · 插入", "情况 2：叔父也红——不旋转，只换色");
  card(s, 0.5, 1.05, 4.6, 1.85, C.code);
  image(s, "fig-11-19", 0.6, 1.12, 4.4, 1.4);
  caption(s, "图 11.19  父结点、叔父结点均为红色", 0.5, 2.55, 4.6);
  callout(s, "换色，然后递归向上", "把父 A 和叔父 C 都改成黑、祖父 B 改成红。A 以下的冲突解决了，但 B 可能与它的父结点再冲突，于是**把 B 当成新的 X 递归上去**。最坏一路推到根，把根改回黑色即可——这是红黑树**唯一会长高**（阶加 1）的时刻。", 0.5, 3.05, 4.6, 2.05, { fontSize: 10.5 });
  card(s, 5.35, 1.05, 4.15, 4.05, C.code);
  image(s, "fig-11-20", 5.45, 1.12, 3.95, 3.55);
  caption(s, "图 11.20  一次插入引发的红红冲突调整全过程", 5.35, 4.72, 4.15);
}

// 11.5 RB delete
{
  const s = content("11.5", "11.5 红黑树 · 删除", "双黑结点：按兄弟和侄子的颜色分情况（以双黑是左孩子为例）");
  const cases = [
    ["fig-11-21", "1(a) 兄弟黑、红侄子外撇", "兄弟 C 提上去继承 B 的颜色，B 与侄子 D 着黑"],
    ["fig-11-22", "1(b) 兄弟黑、红侄子同边顺", "侄子 D 提上去当子根、继承 B 的颜色，B 着黑（双旋转）"],
    ["fig-11-23", "2 兄弟黑、两个侄子都黑", "只换色：C 着红、B 着黑；B 原为黑则继续向上"],
    ["fig-11-24", "3 兄弟红", "旋转一次，X 仍双黑，但已化归成前两种情况"],
  ];
  text(s, "先照 BST 删：有两个非空孩子就与右子树最小结点交换值（颜色不动），再删；删完可能出现**双黑**结点。", 0.5, 1.0, 9, 0.4, { fontSize: 10.5, margin: 0, valign: "middle" });
  cases.forEach((c, i) => {
    const x = 0.5 + (i % 2) * 4.55, y = 1.45 + Math.floor(i / 2) * 1.85;
    card(s, x, y, 4.45, 1.75, C.code);
    image(s, c[0], x + 0.08, y + 0.08, 2.3, 1.6);
    text(s, c[1], x + 2.45, y + 0.12, 1.95, 0.6, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
    text(s, c[2], x + 2.45, y + 0.75, 1.95, 1.1, { fontSize: 9.5, margin: 0 });
  });
}

// 11.5 which index
{
  const s = content("11.5", "11.5 位索引 · 对照", "各种索引怎么选");
  table(s, [
    ["结构", "保存什么", "可能的额外工作", "适合场景"],
    [{ t: "倒排表", bold: true }, "词到文档号 / 位置的列表", "合并有序列表", "精确全文检索、短语查询"],
    [{ t: "位图", bold: true }, "属性值到记录位向量", "按位布尔运算", "低基数列组合过滤"],
    [{ t: "签名", bold: true }, "文档特征的短位串", "假阳性后回原文确认", "空间受限的粗筛"],
    [{ t: "B+ 树", bold: true }, "有序 key 到记录位置", "沿页树下降、沿叶链扫描", "点查询与范围查询"],
  ], 0.5, 1.1, 9.0, [1.2, 2.6, 2.5, 2.7], { fontSize: 11.5, rowH: 0.45 });
  callout(s, "红黑树 vs B+ 树：两种成本模型", "红黑树每步只碰**几个结点**，适合内存里的有序映射；B+ 树每步碰**一整页**，适合按页读写的外存索引。图 11.16～11.25 只用来比较「二叉、内存结点」与「多路、页结点」。", 0.5, 3.5, 5.6, 1.6, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "B/B+ 树 vs 位图", "B/B+ 树适合检索并取回**少量记录**；唯一值极少（低基数）的数据域适合**位图**。", 6.35, 3.5, 3.15, 1.6, { fontSize: 11 });
}

// Exercises
{
  const s = content("练", "课后练习（精选）", "动手算一算");
  const ex = [
    ["补充 5", "在插入 60 之后的那棵 3 阶 B+ 树上继续插入 65，写出叶和根，并说明这次为什么没有一直裂到根。", "demo 的第三行就是答案：父结点 [70] 收下 60 后成 [60,70]，没超限。"],
    ["原书 1", "4096 B 磁盘块，记录 4 B 关键码 + 64 B 数据，线性索引项为（每块最小关键码, 4 B 块地址）。线性索引 2 MB 时最多存多少条记录？再加 4096 B 的二级索引呢？", "先算一块放几条记录、一个索引项几字节。"],
    ["原书 16", "100 万个记录，每个 200 B、关键码 50 B；页块 1000 B，指针 5 B。B+ 树尽量装满，要多少个非叶结点？存取一个记录几次外存访问？", "先算阶：一页能放几个（关键码, 指针）对。"],
    ["原书 23", "12 个顾客的（年龄, 月收入）：写出年龄、月收入的位图索引向量集合，找出年龄 20～40 且月收入 1000～2000 的顾客。", "范围条件 = 若干取值位向量的 OR，再 AND。"],
  ];
  ex.forEach((e, i) => {
    const y = 1.05 + i * 1.02;
    card(s, 0.5, y, 9.0, 0.92, C.code);
    pill(s, e[0], 0.65, y + 0.26, 1.0, 0.4, i === 0 ? C.green : C.dark, C.white, 10.5);
    text(s, e[1], 1.85, y + 0.05, 5.0, 0.82, { fontSize: 10, valign: "middle", margin: 0 });
    text(s, e[2], 7.0, y + 0.05, 2.4, 0.82, { fontSize: 9.5, color: C.goldText, valign: "middle", margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["度量衡", "外存索引的关键指标是**磁盘页访问次数**，不是 CPU 比较次数；查一次的代价 ≈ 树高。"],
    ["线性与静态", "稠密可无序、稀疏要分块有序；过大就多级。静态多分树按页填满，插删靠溢出区，最终重组。"],
    ["倒排", "由属性值确定记录位置：查询变成有序表的交、并、差，**双指针归并 O(n+m)**；短语查询要位置。"],
    ["B / B+ 树", "B 树「插入—分裂」「交换—删除—借—合并」保持平衡；B+ 树记录全在叶，**叶链支持范围扫描**。"],
    ["位索引", "位图适合低基数属性，NOT 要**掩掉尾部位**；签名只做粗筛（可假阳性）；红黑树是内存有序映射。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
