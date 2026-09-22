// 第九章 文件管理与外部排序 —— 由 dsa-modernization/book/ch09-external-sort.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch09_external_sort.js ../202609_DSA_09_External_Sort.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_09_External_Sort.pptx");

// 讲义中引用的图片（name → 本地路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const IMAGES = {
  "fig-9-1": `${SCAN}/fig-9-1.png`,
  "fig-9-3": `${SCAN}/fig-9-3.png`,
  "fig-9-4": `${SCAN}/fig-9-4.png`,
  "fig-9-5": `${SCAN}/fig-9-5.png`,
  "fig-9-6": `${SCAN}/fig-9-6.png`,
  "fig-9-7": `${SCAN}/fig-9-7.png`,
  "fig-9-8": `${SCAN}/fig-9-8.png`,
};

(async () => {
  const D = createDeck({ title: "DSA 第九章 文件管理与外部排序", imgDir: path.join(__dirname, "..", ".cache", "ch09") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  // 右向箭头（水平）
  const hArrow = (s, x, y, w, color = C.green) =>
    s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 1.5, endArrowType: "triangle" } });
  // 竖直向下箭头
  const vArrow = (s, x, y, h, color = C.green) =>
    s.addShape(pres.shapes.LINE, { x, y, w: 0, h, line: { color, width: 1.5, endArrowType: "triangle" } });

  // 画一棵 8 叶的选择树（本书实现：leaf_base = 8，结点 1..7 为内部结点，8..15 为叶）
  // spec: { leaves: [值或 null], nodes: {1..7: 标签}, champ: 标签, path: [高亮的内部结点], leafHl: 高亮叶下标 }
  function drawTree(s, x0, y0, spec) {
    const dx = 0.5, lvY = [y0 + 0.55, y0 + 1.1, y0 + 1.65], leafY = y0 + 2.15;
    const cx = {};
    for (let i = 0; i < 8; i++) cx[8 + i] = x0 + 0.25 + i * dx;
    for (let n = 7; n >= 1; n--) cx[n] = (cx[2 * n] + cx[2 * n + 1]) / 2;
    const cy = (n) => (n >= 8 ? leafY : n >= 4 ? lvY[2] : n >= 2 ? lvY[1] : lvY[0]);
    const onPath = (n) => (spec.path || []).includes(n);
    // 连线
    for (let n = 1; n <= 7; n++) {
      [2 * n, 2 * n + 1].forEach((c) => {
        const hot = onPath(n) && (onPath(c) || (c >= 8 && c - 8 === spec.leafHl));
        s.addShape(pres.shapes.LINE, {
          x: cx[n], y: cy(n), w: cx[c] - cx[n], h: cy(c) - cy(n),
          line: { color: hot ? C.bad : "9AAFA6", width: hot ? 2 : 1 },
        });
      });
    }
    // 冠军槽
    s.addShape(pres.shapes.LINE, { x: cx[1], y: y0 + 0.1, w: 0, h: 0.45, line: { color: onPath(1) ? C.bad : "9AAFA6", width: onPath(1) ? 2 : 1 } });
    s.addShape(pres.shapes.OVAL, { x: cx[1] - 0.2, y: y0 - 0.1, w: 0.4, h: 0.4, fill: { color: C.gold }, line: { color: C.goldText, width: 1 } });
    text(s, spec.champ, cx[1] - 0.2, y0 - 0.1, 0.4, 0.4, { fontSize: 11, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    text(s, "冠军", cx[1] + 0.25, y0 - 0.05, 0.6, 0.3, { fontSize: 9, bold: true, color: C.goldText, margin: 0 });
    // 内部结点
    for (let n = 1; n <= 7; n++) {
      const hot = onPath(n);
      s.addShape(pres.shapes.OVAL, { x: cx[n] - 0.18, y: cy(n) - 0.18, w: 0.36, h: 0.36, fill: { color: hot ? "FDF0EE" : C.white }, line: { color: hot ? C.bad : C.green, width: hot ? 1.5 : 1 } });
      text(s, spec.nodes[n], cx[n] - 0.18, cy(n) - 0.18, 0.36, 0.36, { fontSize: 10, bold: true, color: hot ? C.bad : C.dark, align: "center", valign: "middle", margin: 0 });
      text(s, String(n), cx[n] - 0.5, cy(n) - 0.2, 0.3, 0.2, { fontSize: 7, color: C.muted, align: "right", margin: 0 });
    }
    // 叶
    for (let i = 0; i < 8; i++) {
      const v = spec.leaves[i];
      const hot = i === spec.leafHl;
      s.addShape(pres.shapes.RECTANGLE, { x: cx[8 + i] - 0.19, y: leafY - 0.02, w: 0.38, h: 0.36, fill: { color: v === null ? "EEF1EF" : hot ? "F9D5D0" : C.mint }, line: { color: C.green, width: 1 } });
      text(s, v === null ? "—" : String(v), cx[8 + i] - 0.19, leafY - 0.02, 0.38, 0.36, { fontSize: 10.5, bold: true, color: v === null ? C.muted : C.dark, align: "center", valign: "middle", margin: 0 });
      text(s, v === null ? "" : String(i), cx[8 + i] - 0.19, leafY + 0.35, 0.38, 0.2, { fontSize: 8, color: C.muted, align: "center", margin: 0 });
    }
  }

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第九章  文件管理与外部排序",
  subtitle: "数据大到内存装不下：数页 I/O，而不是数比较",
  topics: "主存与外存 · 按页存取 · 页 I/O 成本模型\n文件组织：顺序 / 散列 / 索引 / 倒排 · 记录装页 · C++ 流文件\n外排序两阶段：顺串生成 + 归并 · 置换选择（平均 2M）\n二路归并趟数 · 多路归并 · 赢者树 / 败者树 · 稳定性与常见错误",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["内存装不下的数据，怎么排序？", "先切成若干内部有序的**顺串**，再反复**归并**，直到只剩一条。"],
    ["怎样让初始顺串更长？", "**置换选择**：用最小堆，平均能把顺串做到约 **2M**，而不是 M。"],
    ["k 路归并里，怎样快速选出最小？", "**选择树**（赢者树 / 败者树）：每次只沿叶到根重赛，代价 **O(log k)**。"],
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
    { text: "外排序的瓶颈是", options: { color: C.white } },
    { text: "磁盘读写", options: { color: C.gold, bold: true } },
    { text: "。归并趟数 ", options: { color: C.white } },
    { text: "⌈log_k m⌉", options: { color: C.gold, bold: true, fontFace: MONO } },
    { text: "：要么减少顺串数 m，要么增加归并路数 k。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["9.1 存储器", ["主存 vs 外存", "按页存取与缓冲", "页 I/O 成本模型", "图 9.1 三个缓冲"]],
    ["9.2 文件", ["记录、逻辑文件与物理文件", "9.2.1 四种组织方式", "记录怎样装进页", "9.2.2 C++ 流文件"]],
    ["9.3 顺串", ["外排序两阶段", "趟数 ⌈log_k m⌉", "9.3.1 置换选择：逐步演算", "置换选择代码"]],
    ["9.3 归并", ["9.3.2 二路外排序", "9.3.3 为什么要选择树", "赢者树 / 败者树", "四路归并演算与代码", "稳定性 · 常见错误"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.15, 2.1, 3.9, i === 2 ? C.cream : C.code);
    text(s, c[0], x + 0.15, 1.3, 1.9, 0.45, { fontSize: 17, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.1, 1.9, 1.95, 3.0, { fontSize: 11.5, gap: 8 });
  });
}

// 4. Run first
{
  const s = content("▶", "先跑一遍", "置换选择 + 败者树：demo.cpp");
  codeBlock(s, `#include "modern.hpp"

#include <iostream>

int main() {
    const std::vector<int> input{50, 49, 35, 45, 30, 25, 15, 60, 16, 27, 1};
    const auto runs = dsa::external_sort::replacement_selection(input, 7);

    std::cout << "工作区 M=7，得到 " << runs.size() << " 个顺串\\n";
    for (std::size_t index = 0; index < runs.size(); ++index) {
        std::cout << "顺串 " << index + 1 << "（长度 " << runs[index].size() << "）:";
        for (int value : runs[index]) {
            std::cout << ' ' << value;
        }
        std::cout << '\\n';
    }

    dsa::external_sort::LoserTree tree({20, 6, 8, 9, 11});
    std::cout << "败者树当前冠军: " << *tree.winner() << '\\n';
    tree.replace(1, 15);
    std::cout << "替换后冠军: " << *tree.winner() << '\\n';
}`, 0.5, 1.05, 9.0, 3.6, { fontSize: 9 });
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch09/external_sort code/ch09/external_sort/demo.cpp -o /tmp/extsort-demo\n/tmp/extsort-demo", 0.5, 4.72, 9.0, 0.42, { fontSize: 9, color: C.muted });
}

// 5. Run first: output
{
  const s = content("▶", "先跑一遍", "读懂输出：顺串比内存长；败者树只重赛一条路径");
  consoleBlock(s, "工作区 M=7，得到 2 个顺串\n顺串 1（长度 8）: 15 25 30 35 45 49 50 60\n顺串 2（长度 3）: 1 16 27\n败者树当前冠军: 6\n替换后冠军: 8", 0.5, 1.05, 5.2, 1.75, 11);
  callout(s, "置换选择（M = 7）", [
    "第一顺串长 **8 > M**：读入的 60 不小于刚输出的 15，补进了当前顺串。",
    "16、27、1 读入时都小于当时的输出值，被**冻结**，另成第二顺串。",
    "两条顺串 8 + 3 = 11 条，恰好是全部输入：**记录守恒**。",
  ], 0.5, 2.95, 5.2, 2.15, { fontSize: 11.5, gap: 5 });
  callout(s, "败者树", [
    "5 路当前值 20 6 8 9 11：冠军是 **6**（下标 1）。",
    "`replace(1, 15)`：该路补入 15，只沿「选手 1 → 根」重赛，冠军变为 **8**。",
  ], 5.95, 1.05, 3.55, 2.15, { fontSize: 11, gap: 5, fill: C.mint, tcolor: C.dark });
  callout(s, "改一个数试试", "把 M 改成 11（装得下全部输入）：只得到**一个**整表有序的顺串——置换选择**退化为堆排序**，正是「内存够用」的边界。", 5.95, 3.35, 3.55, 1.75, { fontSize: 11 });
}

// ============================ PART 1 ============================
sectionSlide("Part 1 · 9.1", "主存储器和外存储器", "外存慢在「定位」 · 按页存取与缓冲\n先建立成本模型：数页 I/O，不数比较");

// 9.1 two memories
{
  const s = content("9.1", "9.1 主存储器和外存储器", "两种存储器：快而小 vs 慢而大");
  text(s, "前面各章的结构基本都在内存里（**内部数据结构**）。内存容量有限、程序结束数据就没了；大规模数据必须放到外存上，排序也就变成**多次内存与外存之间的交换**。", 0.5, 1.02, 9, 0.6, { fontSize: 12.5 });
  const cols = [
    ["主存", "RAM、cache、显存", ["在主板上，按单元**连续编址**", "CPU 直接访问，一次存取可看成很小的常数（**纳秒**）", "快、贵、容量相对小", "**断电就丢**"], "EAF4EF", C.ok],
    ["外存", "硬盘、磁带、U 盘", ["便宜、容量大", "信息**断电不丢**，有的还能随身带走", "一次存取以**毫秒甚至秒**计", "比内存**慢几个数量级**"], "FDF0EE", C.bad],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.75, 4.35, 2.55, c[3]);
    text(s, c[0], x + 0.2, 1.85, 1.2, 0.4, { fontSize: 18, bold: true, color: c[4], margin: 0 });
    text(s, c[1], x + 1.3, 1.9, 2.9, 0.35, { fontSize: 11, color: C.muted, margin: 0 });
    bullets(s, c[2], x + 0.15, 2.35, 4.05, 1.9, { fontSize: 12, gap: 6 });
  });
  callout(s, "对外排序来说", "目标首先是**减少读写次数**，而不是减少内存里的比较——一次磁盘 I/O 往往比一次比较**贵几个数量级**。", 0.5, 4.45, 9.0, 0.65, { fontSize: 11.5, tsize: 11, fill: C.mint, tcolor: C.dark, lsm: 1.0 });
}

// 9.1 why slow
{
  const s = content("9.1", "9.1 主存储器和外存储器", "外存为什么慢：每次访问都要先定位再读写");
  text(s, "一次磁盘访问 = 定位 + 传输", 0.5, 1.05, 5, 0.35, { fontSize: 14, bold: true, color: C.dark });
  // timeline bars
  card(s, 0.5, 1.5, 9.0, 1.5, C.code);
  text(s, "定位", 0.7, 1.65, 0.8, 0.3, { fontSize: 11, bold: true, color: C.bad, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 1.65, w: 6.2, h: 0.32, fill: { color: "F2B8B0" }, line: { type: "none" } });
  text(s, "磁头移到目标磁道 → 等扇区转到磁头下：几毫秒到几十毫秒", 1.6, 1.65, 6.0, 0.32, { fontSize: 10, color: C.dark, valign: "middle", margin: 0 });
  text(s, "传输", 0.7, 2.15, 0.8, 0.3, { fontSize: 11, bold: true, color: C.ok, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.7, y: 2.15, w: 0.9, h: 0.32, fill: { color: "9ED4B8" }, line: { type: "none" } });
  text(s, "真正把数据读出来的时间，远比定位短", 3.6, 2.15, 4.0, 0.32, { fontSize: 10, color: C.muted, align: "right", valign: "middle", margin: 0 });
  text(s, "示意图，长度不按比例", 0.7, 2.6, 4, 0.25, { fontSize: 8.5, color: C.muted, margin: 0 });
  // two remedies
  const rem = [
    ["按页块存取", "外存按**固定大小的页块**存取：一次定位读写**一整页**，把定位次数摊薄。"],
    ["配合缓冲", "顺序扫描时一次读入一页或几页到内存，后面的访问**尽量打在缓冲区里**。"],
  ];
  rem.forEach((r, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 3.2, 4.35, 1.85, C.cream);
    numCircle(s, i + 1, x + 0.2, 3.35, 0.42, C.dark);
    text(s, r[0], x + 0.75, 3.37, 3.4, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, r[1], x + 0.2, 3.9, 3.95, 1.05, { fontSize: 12, margin: 0, lsm: 1.2 });
  });
}

// 9.1 cost model
{
  const s = content("9.1", "9.1 主存储器和外存储器 · 成本模型", "先建立成本模型：不能再只数比较次数");
  card(s, 0.5, 1.1, 4.35, 2.2, C.dark);
  text(s, "设文件有 N 个记录，每页可放 B 个记录", 0.7, 1.2, 4, 0.35, { fontSize: 11.5, color: C.mint, margin: 0 });
  text(s, "顺序扫描一遍", 0.7, 1.6, 2.2, 0.3, { fontSize: 11, color: C.white, margin: 0 });
  text(s, "⌈N/B⌉ 页", 2.6, 1.55, 2.1, 0.4, { fontSize: 18, bold: true, color: C.gold, margin: 0 });
  text(s, "读一遍再写回", 0.7, 2.1, 2.2, 0.3, { fontSize: 11, color: C.white, margin: 0 });
  text(s, "≈ 2⌈N/B⌉ 页", 2.6, 2.05, 2.2, 0.4, { fontSize: 18, bold: true, color: C.gold, margin: 0 });
  text(s, "内存中多做几次比较，通常远比多一次整文件读写便宜。", 0.7, 2.6, 4, 0.6, { fontSize: 11, color: C.white, margin: 0 });
  table(s, [
    ["层次", "访问单位", "本章关心的性质"],
    ["CPU cache / 主存", "字或 cache line", "可随机访问，比较和交换在这里完成"],
    ["SSD / 磁盘", "页块", "定位与传输有固定成本，应顺序、批量读写"],
    ["磁带等顺序介质", "连续块", "随机定位尤其昂贵，归并比原地交换合适"],
  ], 5.1, 1.1, 4.4, [1.2, 0.95, 2.25], { fontSize: 10, rowH: 0.52 });
  // example
  card(s, 0.5, 3.5, 9.0, 1.6, C.code);
  text(s, "例", 0.7, 3.6, 0.5, 0.3, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  text(s, "1 亿条 × 16 字节", 0.7, 3.95, 2.6, 0.35, { fontSize: 12, color: C.text, margin: 0 });
  text(s, "≈ 1.6 GB", 0.7, 4.3, 2.6, 0.6, { fontSize: 28, bold: true, color: C.bad, margin: 0 });
  text(s, "内存工作区", 3.3, 3.95, 2, 0.35, { fontSize: 12, color: C.text, margin: 0 });
  text(s, "64 MB", 3.3, 4.3, 2, 0.6, { fontSize: 28, bold: true, color: C.ok, margin: 0 });
  text(s, "任何「把全部记录放进数组再排序」的内部排序都不成立。外排序必须让**大部分记录始终留在外存**，内存里只保存**少量缓冲页和当前候选**。", 5.3, 3.7, 4.05, 1.3, { fontSize: 11.5, margin: 0, lsm: 1.2 });
}

// 9.1 figure 9.1
{
  const s = content("9.1", "9.1 主存储器和外存储器", "图 9.1：输入缓冲、内存工作区、输出缓冲分开");
  card(s, 0.5, 1.1, 9.0, 1.9, C.code);
  image(s, "fig-9-1", 0.9, 1.2, 8.2, 1.7);
  const rows = [
    ["输入缓冲", "**空了才整页补入**", C.green],
    ["内存工作区", "处理的是**记录**（置换选择里就是一个最小堆）", C.dark],
    ["输出缓冲", "**满了才整页写回**", C.goldText],
  ];
  rows.forEach((r, i) => {
    const y = 3.2 + i * 0.5;
    pill(s, r[0], 0.5, y + 0.04, 1.5, 0.36, r[2], C.white, 11);
    text(s, r[1], 2.15, y, 3.6, 0.44, { fontSize: 12, valign: "middle", margin: 0 });
  });
  callout(s, "记住这一句", "工作区处理的是**记录**，真正与设备交换的是**页**。两个粒度不一样，正是外排序所有设计的出发点。", 6.0, 3.15, 3.5, 1.9, { fontSize: 12, fill: C.mint, tcolor: C.dark });
}

// ============================ PART 2 ============================
sectionSlide("Part 2 · 9.2", "文件的组织和管理", "记录与文件 · 逻辑文件 vs 物理文件\n四种组织方式 · 记录怎样装进页 · C++ 流文件");

// 9.2 files and records
{
  const s = content("9.2", "9.2 文件的组织和管理", "文件：外存上的数据结构，由大量性质相同的记录组成");
  bullets(s, [
    "**记录**：有独立逻辑意义的一块数据——简单可以是一串字符，复杂则由若干字段组成。",
    "操作系统文件常是**连续字符流**，结构不明显；数据库文件是**有结构的记录集合**，每条记录由若干不可再分的数据项组成。",
    "例：学生登记表——姓名、学号、性别、出生年月。",
  ], 0.5, 1.05, 9.0, 1.5, { fontSize: 12.5, gap: 6 });
  table(s, [
    ["分类角度", "类别", "说明"],
    [{ t: "记录长度", bold: true }, "定长 / 不定长", "定长更好处理"],
    [{ t: "关键码个数", bold: true }, "单关键码 / 多关键码", "多关键码文件除主码外还可以有若干次码"],
    [{ t: "操作", bold: true }, "以记录为单位", "顺序读、追加、按条件修改或删除"],
    [{ t: "处理方式", bold: true }, "实时 / 批量", "实时要求很快应答；批量允许较长反馈"],
  ], 0.5, 2.6, 5.6, [1.25, 1.75, 2.6], { fontSize: 10.5, rowH: 0.42 });
  callout(s, "逻辑文件 vs 物理文件", [
    "**逻辑文件**：用户看见的记录顺序与字段——顺序定长、顺序变长、按关键码存取。",
    "**物理文件**：系统实际读写的页、块和地址。",
  ], 6.35, 2.6, 3.15, 2.5, { fontSize: 11, gap: 6 });
}

// 9.2 physical files
{
  const s = content("9.2", "9.2 文件的组织和管理", "常见的物理文件：顺序、索引、散列");
  const kinds = [
    ["顺序文件", "记录按逻辑次序放进**连续物理块**，物理顺序与逻辑顺序一致。", "顺序扫描很快；按关键码插入、删除要**搬很多块**。", "本章"],
    ["索引文件", "主文件之外另造**索引**，先查索引再读记录。", "索引保存「关键码 → 页/槽」的映射。", "第 11 章"],
    ["散列文件", "用散列函数把关键码映射到**桶或块**。", "闭散列思想可以搬到外存，但冲突处理要**按块设计**。", "第 10 章"],
  ];
  kinds.forEach((k, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.1, 2.85, 2.65, C.code);
    text(s, k[0], x + 0.2, 1.2, 1.7, 0.4, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    pill(s, k[3], x + 1.85, 1.24, 0.85, 0.3, i === 0 ? C.gold : C.green, i === 0 ? C.dark : C.white, 9.5);
    text(s, k[1], x + 0.2, 1.7, 2.5, 0.95, { fontSize: 11.5, margin: 0, lsm: 1.15 });
    text(s, k[2], x + 0.2, 2.7, 2.5, 0.95, { fontSize: 10.5, color: C.muted, margin: 0, lsm: 1.15 });
  });
  callout(s, "本章只抽出两件事", [
    "本章**不实现页缓存和文件句柄**，只抽出外排序里两件与文件组织无关、却**决定 I/O 次数**的事：",
    { t: "① 如何生成**更长的初始顺串**；② 如何在 **k 路归并**里选出当前最小。", plain: true },
  ], 0.5, 3.95, 9.0, 1.15, { fontSize: 11.5, fill: C.mint, tcolor: C.dark, gap: 3 });
}

// 9.2.1 organisation table
{
  const s = content("9.2.1", "9.2.1 文件组织", "四种组织方式：第 9–11 章的共同骨架");
  table(s, [
    ["组织方式", "保留的核心取舍", "当代说明"],
    [{ t: "顺序文件", bold: true }, "连续扫描快，按中间位置更新贵", "日志、列式批处理和外排序的顺串都利用这种顺序 I/O；原则仍适用于顺序读写 SSD、云对象和网络流"],
    [{ t: "散列文件", bold: true }, "按键定位快，范围扫描与有序输出差", "不直接把内存散列表搬到磁盘；冲突、页满和缓存未命中都必须**按页处理**（第 10 章）"],
    [{ t: "索引文件", bold: true }, "用较小目录把键映射到记录位置", "现代数据库常用 B+ 树、LSM 等页级索引；第 11 章用页模拟讲 B+ 树"],
    [{ t: "倒排文件", bold: true }, "用属性值反查记录集合", "搜索系统仍以它为核心，只是词典、压缩和分片复杂得多"],
  ], 0.5, 1.1, 9.0, [1.2, 2.7, 5.1], { fontSize: 10.5, rowH: 0.62 });
  callout(s, "今天谁来实现？", "这些组织方式今天通常由**文件系统、数据库或对象存储系统**实现，而不是由业务程序直接搬动磁盘扇区。", 0.5, 4.35, 9.0, 0.75, { fontSize: 11.5, tsize: 11, lsm: 1.0 });
}

// 9.2.1 clarification
{
  const s = content("9.2.1", "9.2.1 文件组织", "一个必须澄清的说法：「物理顺序与逻辑顺序一致」");
  card(s, 0.5, 1.1, 4.35, 2.3, "FDF0EE");
  text(s, "✗  不能理解成", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  text(s, "文件一定**连续占用磁盘扇区**。", 0.7, 1.6, 4, 0.4, { fontSize: 13, margin: 0 });
  text(s, "现代文件系统可能**重排块位置**、使用**写时复制**，或放在**远端对象存储**上。", 0.7, 2.1, 3.95, 1.2, { fontSize: 11.5, color: C.text, margin: 0, lsm: 1.2 });
  card(s, 5.15, 1.1, 4.35, 2.3, "EAF4EF");
  text(s, "✓  本章真正要守的是", 5.35, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  text(s, "读者可以**顺序消费页**，", 5.35, 1.65, 4, 0.4, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "写者可以**批量产生页**。", 5.35, 2.05, 4, 0.4, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "这正是**归并**比大量随机交换更适合外排序的原因。", 5.35, 2.6, 3.95, 0.7, { fontSize: 11.5, margin: 0 });
  table(s, [
    ["记录", "定位方式"],
    [{ t: "定长", bold: true }, "用「第 i 条在第几页」直接定位"],
    [{ t: "变长", bold: true }, "需要**槽目录**：把稳定的槽号映射到会移动的页内偏移"],
  ], 0.5, 3.6, 5.6, [1.0, 4.6], { fontSize: 11, rowH: 0.42 });
  callout(s, "删除", "立即压紧 → 扫描紧凑；留墓碑 → 写入更快但积累空洞。今天仍是同一种权衡，只是实现者多半是存储引擎。", 6.35, 3.6, 3.15, 1.5, { fontSize: 10.5 });
}

// 9.2 records into pages
{
  const s = content("9.2", "9.2 记录怎样装进页", "定长算得出，变长靠槽目录；删除有两种代价模型");
  // page diagram
  card(s, 0.5, 1.1, 4.35, 2.95, C.code);
  text(s, "一页（P 字节）", 0.7, 1.17, 3, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  const recs = [["记录 0", 1.3], ["记录 1", 0.8], ["记录 2", 1.5]];
  let xx = 0.75;
  recs.forEach((r) => {
    s.addShape(pres.shapes.RECTANGLE, { x: xx, y: 1.55, w: r[1], h: 0.45, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
    text(s, r[0], xx, 1.55, r[1], 0.45, { fontSize: 9.5, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    xx += r[1];
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.75, y: 2.0, w: 3.85, h: 0.95, fill: { color: C.white }, line: { color: C.green, width: 1, dashType: "dash" } });
  text(s, "空闲空间", 0.75, 2.0, 3.85, 0.95, { fontSize: 10, color: C.muted, align: "center", valign: "middle", margin: 0 });
  const slots = ["槽 2", "槽 1", "槽 0"];
  slots.forEach((t, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 2.35 + i * 0.75, y: 2.95, w: 0.75, h: 0.4, fill: { color: C.cream }, line: { color: C.goldText, width: 1 } });
    text(s, t, 2.35 + i * 0.75, 2.95, 0.75, 0.4, { fontSize: 9, bold: true, color: C.goldText, align: "center", valign: "middle", margin: 0 });
  });
  text(s, "页尾槽目录：偏移 + 长度", 0.75, 3.0, 1.6, 0.35, { fontSize: 8.5, color: C.goldText, margin: 0 });
  text(s, "外部引用用「页号 + 槽号」：记录在页内移动，引用不失效。", 0.7, 3.45, 4.0, 0.5, { fontSize: 10, color: C.text, margin: 0 });
  // right: fixed-length formula
  card(s, 5.15, 1.1, 4.35, 1.25, C.dark);
  text(s, "定长记录：页大小 P、记录长 R", 5.35, 1.18, 4, 0.3, { fontSize: 11, color: C.mint, margin: 0 });
  text(s, "一页最多 ⌊P/R⌋ 条", 5.35, 1.5, 4, 0.4, { fontSize: 17, bold: true, color: C.gold, margin: 0 });
  text(s, "剩余空间是**内部碎片**", 5.35, 1.95, 4, 0.3, { fontSize: 11, color: C.white, margin: 0 });
  table(s, [
    ["删除策略", "好处", "代价"],
    [{ t: "立即压紧", bold: true }, "扫描紧凑", "可能搬动大量记录"],
    [{ t: "留下墓碑", bold: true }, "写入便宜", "查询要跳过空洞；积累到一定程度仍要重组"],
  ], 5.15, 2.45, 4.35, [0.95, 0.85, 2.55], { fontSize: 9.5, rowH: 0.36 });
  text(s, "第 10 章闭散列的墓碑是同一种矛盾，只是搬动单位从数组槽变成了**页块**。", 5.15, 3.72, 4.35, 0.4, { fontSize: 9, color: C.muted, margin: 0 });
  callout(s, "逻辑顺序与物理位置分开", "是后面**索引**章节的入口：索引保存「关键码 → 页/槽」的映射，主文件不必为每次插入整体移动。**外排序则反过来**：趁批处理窗口一次性重写主文件，用顺序 I/O 换取之后更快的扫描。", 0.5, 4.2, 9.0, 0.9, { fontSize: 10.5, tsize: 11, fill: C.mint, tcolor: C.dark, lsm: 1.05 });
}

// 9.2.2 streams
{
  const s = content("9.2.2", "9.2.2 C++ 的流文件", "概念仍然成立，接口已是历史写法");
  card(s, 0.5, 1.1, 4.35, 1.6, C.code);
  text(s, "仍然成立的概念", 0.7, 1.18, 4, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "**文件**：持久化的数据对象。",
    "**流**：程序在某一时刻对它**顺序读写**的通道，通常配有用户态缓冲。",
    "读写位置决定下一次操作从哪里开始。",
  ], 0.65, 1.52, 4.1, 1.3, { fontSize: 11, gap: 3 });
  card(s, 5.15, 1.1, 4.35, 1.6, C.cream);
  text(s, "现代写法（C++17）", 5.35, 1.18, 4, 0.3, { fontSize: 12.5, bold: true, color: C.goldText, margin: 0 });
  bullets(s, [
    "`<fstream.h>` 不是标准头 → 用 `<fstream>`：`std::ifstream` / `ofstream` / `fstream`。",
    "文件名用 `std::string` 或 `std::filesystem::path`。",
    "位置用 `std::streamoff` / `std::streampos`，不用 `char*`、`int`。",
    "离开作用域自动关闭（RAII）。",
  ], 5.3, 1.52, 4.1, 1.3, { fontSize: 10, gap: 2 });
  table(s, [
    ["原书操作", "今天仍保留的意思", "现代接口与边界"],
    [{ t: "open / close", mono: true }, "取得或结束文件访问", "构造时打开或调 open()；用流状态检查失败，RAII 负责通常的关闭"],
    [{ t: "read / write", mono: true }, "在当前位置传输字节", "不能把含指针、虚函数表或依赖字节序的对象直接写入文件；定义稳定的字段格式或序列化协议"],
    [{ t: "seekg / seekp", mono: true }, "移动读 / 写位置", "只适用于支持随机访问的底层对象；管道、终端和许多网络流不能任意定位"],
  ], 0.5, 2.82, 9.0, [1.45, 1.9, 5.65], { fontSize: 9.5, rowH: 0.4 });
  text(s, "本章的 `external_sort` 故意**以容器模拟输入与输出**：验证顺串、归并与选择树的算法不变量；打开失败、短读短写、字节序、原子替换、崩溃恢复留给真正的文件层。", 0.5, 4.65, 9.0, 0.5, { fontSize: 9.5, color: C.muted });
}

// ============================ PART 3 ============================
sectionSlide("Part 3 · 9.3 / 9.3.1", "外排序：顺串生成", "外排序两阶段 · 归并趟数 ⌈log_k m⌉\n置换选择：用最小堆把顺串做到平均 2M");

// 9.3 what is external sort
{
  const s = content("9.3", "9.3 外排序", "外排序：数据在外存文件中，内存一次处理不完");
  text(s, "按内存大小把外存中的数据文件**划分成若干段**，每次读入一段用内排序排好；这些已排序的段称为**顺串**或**归并段**（run），写回外存等待将来处理，让出的内存继续处理其他段。", 0.5, 1.02, 9, 0.65, { fontSize: 12.5 });
  // two-phase diagram
  card(s, 0.5, 1.8, 9.0, 1.85, C.code);
  text(s, "输入文件", 0.65, 1.9, 1.4, 0.3, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  cells(s, 0.65, 2.25, ["", "", "", "", "", ""], { cw: 0.22, ch: 0.9, fills: ["D5DDD9", "E5EAE8", "D5DDD9", "E5EAE8", "D5DDD9", "E5EAE8"] });
  hArrow(s, 2.1, 2.7, 0.55);
  pill(s, "① 顺串生成", 2.7, 2.0, 1.5, 0.34, C.green, C.white, 10.5);
  text(s, "切成若干内部有序的段", 2.7, 2.38, 1.6, 0.5, { fontSize: 9, color: C.muted, margin: 0 });
  ["R1", "R2", "R3", "R4"].forEach((r, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 4.4, y: 1.95 + i * 0.4, w: 1.3, h: 0.32, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
    text(s, r + " 有序", 4.4, 1.95 + i * 0.4, 1.3, 0.32, { fontSize: 9, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  });
  hArrow(s, 5.85, 2.7, 0.55);
  pill(s, "② 归并", 6.45, 2.0, 1.1, 0.34, C.goldText, C.white, 10.5);
  text(s, "反复合并，直到只剩一条", 6.45, 2.38, 1.3, 0.5, { fontSize: 9, color: C.muted, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 2.25, w: 1.55, h: 0.9, fill: { color: "CDEBD9" }, line: { color: C.ok, width: 1.5 } });
  text(s, "覆盖全文件\n的一条顺串", 7.8, 2.25, 1.55, 0.9, { fontSize: 10, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  // time components
  text(s, "外排序的时间由三部分组成", 0.5, 3.8, 5, 0.3, { fontSize: 12.5, bold: true, color: C.dark });
  const parts = ["内部排序时间", "外存读 / 写时间", "内部归并时间"];
  parts.forEach((p, i) => pill(s, p, 0.5 + i * 1.9, 4.2, 1.75, 0.38, i === 1 ? C.bad : C.green, C.white, 10.5));
  callout(s, "关键", "外存读 / 写比内存慢得多——**减少外存读 / 写次数**是提高外排序效率的关键。", 6.35, 3.8, 3.15, 1.3, { fontSize: 11 });
}

// 9.3 number of passes
{
  const s = content("9.3", "9.3 外排序", "读写次数由归并趟数决定：⌈log_k m⌉");
  card(s, 0.5, 1.1, 4.35, 1.7, C.dark);
  text(s, "m 个初始顺串，每次归并 k 个", 0.7, 1.2, 4, 0.3, { fontSize: 11.5, color: C.mint, margin: 0 });
  text(s, "归并趟数 = ⌈log_k m⌉", 0.7, 1.6, 4, 0.5, { fontSize: 22, bold: true, color: C.gold, margin: 0 });
  text(s, "每一趟都要**读完整文件再写完整文件**", 0.7, 2.2, 4, 0.4, { fontSize: 11, color: C.white, margin: 0 });
  text(s, "为了减少趟数，从两个方向着手：", 5.15, 1.1, 4.3, 0.35, { fontSize: 12.5, bold: true, color: C.dark });
  const dirs = [["减少初始顺串数 m", "9.3.1 置换选择排序", C.green], ["增加归并路数 k", "9.3.3 多路归并（选择树）", C.goldText]];
  dirs.forEach((d, i) => {
    const y = 1.55 + i * 0.65;
    numCircle(s, i + 1, 5.15, y + 0.05, 0.4, d[2]);
    text(s, d[0], 5.65, y, 2.2, 0.5, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, d[1], 7.6, y, 1.9, 0.5, { fontSize: 10.5, color: C.muted, valign: "middle", margin: 0 });
  });
  table(s, [
    ["量", "普通分批排序（内存放 M 条）", "说明"],
    ["初始顺串长度", "至多 M", "每批读满内存、排好、写出"],
    ["初始顺串数", { t: "r = ⌈N/M⌉", mono: true }, "一个也少不了"],
    ["k 路归并趟数", { t: "⌈log_k r⌉", mono: true }, "每趟读 + 写整文件"],
    ["减少一趟省下", { t: "≈ 2N/B 次页 I/O", mono: true, bold: true, color: C.bad }, "而不是几个比较"],
  ], 0.5, 3.0, 9.0, [2.0, 3.3, 3.7], { fontSize: 11, rowH: 0.42 });
}

// 9.3.1 idea
{
  const s = content("9.3.1", "9.3.1 置换选择排序", "置换选择：在堆排序的基础上演化而来");
  bullets(s, [
    "朴素做法：每批 M 条排成一条长 M 的顺串 → 顺串数 **⌈N/M⌉**。",
    "置换选择：工作区是一个**最小堆**。输出堆顶后读入下一条：",
    { t: "不小于刚输出的值 → 还能进入**当前顺串**（入堆）；", sub: true },
    { t: "否则 → **冻结**，留到下一趟。", sub: true },
    "当前堆空了，把冻结区建成新堆，开始下一条顺串。",
  ], 0.5, 1.05, 5.3, 2.3, { fontSize: 12.5, gap: 5 });
  // flow diagram
  card(s, 6.0, 1.05, 3.5, 3.0, C.code);
  pill(s, "输入缓冲：incoming", 6.2, 1.2, 3.1, 0.36, C.green, C.white, 10);
  vArrow(s, 7.75, 1.58, 0.3);
  s.addShape(pres.shapes.DIAMOND, { x: 6.75, y: 1.9, w: 2.0, h: 0.7, fill: { color: C.cream }, line: { color: C.goldText, width: 1 } });
  text(s, "incoming ≥ emitted ?", 6.75, 1.9, 2.0, 0.7, { fontSize: 9, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 6.75, y: 2.25, w: -0.35, h: 0.75, line: { color: C.ok, width: 1.5, endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: 8.75, y: 2.25, w: 0.35, h: 0.75, line: { color: C.bad, width: 1.5, endArrowType: "triangle" } });
  text(s, "是", 6.1, 2.3, 0.4, 0.25, { fontSize: 9.5, bold: true, color: C.ok, margin: 0 });
  text(s, "否", 9.05, 2.3, 0.4, 0.25, { fontSize: 9.5, bold: true, color: C.bad, margin: 0 });
  pill(s, "活跃堆", 6.15, 3.05, 1.3, 0.38, C.ok, C.white, 10.5);
  pill(s, "冻结区", 8.05, 3.05, 1.3, 0.38, C.bad, C.white, 10.5);
  text(s, "弹出堆顶 = 当前顺串的下一条", 6.1, 3.5, 1.9, 0.5, { fontSize: 8.5, color: C.muted, margin: 0 });
  text(s, "等下一条顺串再建堆", 8.0, 3.5, 1.45, 0.5, { fontSize: 8.5, color: C.muted, margin: 0 });
  card(s, 0.5, 3.5, 5.3, 1.6, C.dark);
  text(s, "效果", 0.7, 3.58, 2, 0.3, { fontSize: 12, bold: true, color: C.gold, margin: 0 });
  text(s, "顺串长度不相等，但平均可形成长度为 **2M** 的顺串——顺串数约减半；每减半一次，归并趟数就可能少一趟，省下的是**一整轮完整的读写**。", 0.7, 3.92, 4.95, 1.1, { fontSize: 11.5, color: C.white, margin: 0, lsm: 1.15 });
  callout(s, "注意", "堆里只放**活跃**记录；冻结的记录**不参加**当前比赛。", 6.0, 4.2, 3.5, 0.9, { fontSize: 10.5, lsm: 1.05 });
}

// 9.3.1 trace table
{
  const s = content("9.3.1", "9.3.1 置换选择 · 逐步演算（原书图 9.2）", "输入 50 49 35 45 30 25 15 60 16 27 1，M = 7");
  const R = (t, o = {}) => ({ t, ...o });
  table(s, [
    ["步", "输出", "输出后读入", "去向", "活跃堆（数组层序）", "当前顺串", "冻结"],
    ["初始", "-", "前 7 条", "建堆", R("15 30 25 45 49 50 35", { mono: true }), "-", "-"],
    ["1", R("15", { bold: true }), "60", R("60 ≥ 15，活跃", { color: C.ok }), R("25 30 35 45 49 50 60", { mono: true }), "15", "-"],
    ["2", R("25", { bold: true }), "16", R("16 < 25，冻结", { color: C.bad }), R("30 45 35 60 49 50", { mono: true }), "15 25", "16"],
    ["3", R("30", { bold: true }), "27", R("27 < 30，冻结", { color: C.bad }), R("35 45 50 60 49", { mono: true }), "15 25 30", "16 27"],
    ["4", R("35", { bold: true }), "1", R("1 < 35，冻结", { color: C.bad }), R("45 49 50 60", { mono: true }), "15 25 30 35", "16 27 1"],
    ["5–8", R("45,49,50,60", { bold: true }), "输入耗尽", "排空活跃堆", "（空）", "15 25 30 35 45 49 50 60", "16 27 1"],
    [R("新顺串", { fill: C.cream }), R("1,16,27", { bold: true, fill: C.cream }), R("-", { fill: C.cream }), R("冻结区重新建堆", { fill: C.cream }), R("1 27 16", { mono: true, fill: C.cream }), R("1 16 27", { fill: C.cream }), R("-", { fill: C.cream })],
  ], 0.5, 1.05, 9.0, [0.6, 1.05, 0.95, 1.35, 1.85, 2.1, 1.1], { fontSize: 10, rowH: 0.4 });
  text(s, "「输出后读入」= 先弹出最小值，再从输入缓冲补一条。活跃堆一列按 `heap_from` / `heap_pop` / `heap_push` 的数组层序逐步核对过。", 0.5, 4.35, 9.0, 0.3, { fontSize: 9.5, color: C.muted });
  card(s, 0.5, 4.68, 9.0, 0.45, C.dark);
  text(s, "第一顺串 15 25 30 35 45 49 50 60，长度 **8 > M = 7**；剩下的 1 16 27 构成第二顺串。", 0.7, 4.68, 8.7, 0.45, { fontSize: 12, color: C.white, valign: "middle", margin: 0 });
}

// 9.3.1 result & invariants
{
  const s = content("9.3.1", "9.3.1 置换选择排序", "两条守门不变量");
  text(s, "顺串 1", 0.5, 1.15, 0.9, 0.42, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 1.4, 1.15, [15, 25, 30, 35, 45, 49, 50, 60], { cw: 0.55, fills: [null, null, null, null, null, null, null, "CDEBD9"] });
  s.addShape(pres.shapes.LINE, { x: 1.4, y: 1.7, w: 3.85, h: 0, line: { color: C.goldText, width: 1.5, beginArrowType: "triangle", endArrowType: "triangle" } });
  text(s, "M = 7", 2.9, 1.72, 0.9, 0.25, { fontSize: 9.5, bold: true, color: C.goldText, align: "center", margin: 0 });
  text(s, "60 ≥ 15，补进了当前顺串", 5.95, 1.15, 3.5, 0.42, { fontSize: 10.5, color: C.ok, bold: true, valign: "middle", margin: 0 });
  text(s, "顺串 2", 0.5, 2.1, 0.9, 0.42, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 1.4, 2.1, [1, 16, 27], { cw: 0.55, fills: ["F9D5D0", "F9D5D0", "F9D5D0"] });
  text(s, "读入时都小于当时的输出值，被冻结", 3.2, 2.1, 4, 0.42, { fontSize: 10.5, color: C.bad, bold: true, valign: "middle", margin: 0 });
  const inv = [
    ["每条顺串内部非递减", "保证**归并可以工作**。冻结的记录若继续和当前堆比赛，当前顺串就会倒序。"],
    ["全部顺串拼在一起，包含输入的每条记录且恰好一次", "防止冻结时**丢记录**或**重复输出**。"],
  ];
  inv.forEach((v, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 2.85, 4.35, 2.2, C.code);
    numCircle(s, i + 1, x + 0.2, 3.0, 0.42, C.dark);
    text(s, v[0], x + 0.75, 2.97, 3.45, 0.7, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
    text(s, v[1], x + 0.2, 3.75, 3.95, 1.2, { fontSize: 12, margin: 0, lsm: 1.2 });
  });
}

// 9.3.1 input order
{
  const s = content("9.3.1", "9.3.1 置换选择排序", "输入次序决定顺串长度（M = 3 的小例子）");
  // increasing
  card(s, 0.5, 1.1, 9.0, 1.05, "EAF4EF");
  text(s, "单调递增", 0.7, 1.18, 1.6, 0.35, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  text(s, "输入 1 2 … 10", 0.7, 1.55, 1.8, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  cells(s, 2.5, 1.35, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { cw: 0.42, ch: 0.38, fs: 11 });
  text(s, "每条都能补进活跃堆 → **1 条**长顺串", 6.85, 1.3, 2.6, 0.5, { fontSize: 10.5, margin: 0 });
  // decreasing
  card(s, 0.5, 2.3, 9.0, 1.05, "FDF0EE");
  text(s, "单调递减", 0.7, 2.38, 1.6, 0.35, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  text(s, "输入 10 9 … 1", 0.7, 2.75, 1.8, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  const dec = [[8, 9, 10], [5, 6, 7], [2, 3, 4], [1]];
  let dx = 2.5;
  dec.forEach((r) => { cells(s, dx, 2.55, r, { cw: 0.34, ch: 0.38, fs: 10.5, fills: r.map(() => "F9D5D0") }); dx += r.length * 0.34 + 0.12; });
  text(s, "几乎每次都冻结 → **4 条**，长 3,3,3,1，接近 M", 6.85, 2.5, 2.6, 0.5, { fontSize: 10.5, margin: 0 });
  // random
  card(s, 0.5, 3.5, 9.0, 0.8, C.cream);
  text(s, "随机排列", 0.7, 3.58, 1.6, 0.35, { fontSize: 13, bold: true, color: C.goldText, margin: 0 });
  text(s, "在常见独立分布假设下，平均顺串长约 **2M**——这是**平均结论，不是最坏保证**。", 2.5, 3.5, 6.9, 0.8, { fontSize: 12, valign: "middle", margin: 0 });
  text(s, "两个小例子由 `replacement_selection(input, 3)` 同一逻辑逐步复算。", 0.5, 4.45, 9, 0.3, { fontSize: 9.5, color: C.muted });
  text(s, "上机题：比较 M = 4, 8, 16 时产生的顺串个数——核对记录守恒与各顺串有序，**不要把随机趋势当定理**。", 0.5, 4.75, 9, 0.35, { fontSize: 10.5, color: C.goldText, bold: true });
}

// 9.3.1 class example M=3
{
  const s = content("9.3.1", "9.3.1 置换选择 · 课堂例题", "M = 3，输入 4 1 3 2 5 0：列出所有顺串");
  table(s, [
    ["步", "输出", "读入", "去向", "活跃堆（数组）", "当前顺串", "冻结"],
    ["初始", "-", "4 1 3", "建堆", { t: "1 4 3", mono: true }, "-", "-"],
    ["1", { t: "1", bold: true }, "2", { t: "2 ≥ 1，活跃", color: C.ok }, { t: "2 4 3", mono: true }, "1", "-"],
    ["2", { t: "2", bold: true }, "5", { t: "5 ≥ 2，活跃", color: C.ok }, { t: "3 4 5", mono: true }, "1 2", "-"],
    ["3", { t: "3", bold: true }, "0", { t: "0 < 3，冻结", color: C.bad }, { t: "4 5", mono: true }, "1 2 3", "0"],
    ["4", { t: "4", bold: true }, "输入耗尽", "排空", { t: "5", mono: true }, "1 2 3 4", "0"],
    ["5", { t: "5", bold: true }, "-", "排空", "（空）", "1 2 3 4 5", "0"],
    [{ t: "新顺串", fill: C.cream }, { t: "0", bold: true, fill: C.cream }, { t: "-", fill: C.cream }, { t: "冻结区建堆", fill: C.cream }, { t: "0", mono: true, fill: C.cream }, { t: "0", fill: C.cream }, { t: "-", fill: C.cream }],
  ], 0.5, 1.05, 6.2, [0.6, 0.55, 0.85, 1.25, 1.1, 1.15, 0.7], { fontSize: 10, rowH: 0.4 });
  callout(s, "结果", [
    "顺串 1：`1 2 3 4 5`（长 5 > M）",
    "顺串 2：`0`",
    "再用二路归并即可合成最终结果。",
  ], 6.95, 1.05, 2.55, 1.9, { fontSize: 10.5 });
  callout(s, "反例：冻结记录立即放回堆", "0 入堆会马上成为堆顶被输出：当前顺串变成 1 2 3 **0** …，**不再非递减**，归并阶段就读到逆序记录。", 6.95, 3.1, 2.55, 2.0, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  text(s, "同理可练：数据 10 20 2 5 15 8 26 4 11 7 13 16 21 14 6、堆大小 5 → 三个顺串（见本章习题页）。", 0.5, 4.45, 6.2, 0.6, { fontSize: 10, color: C.muted });
}

// 9.3.1 not heap sort
{
  const s = content("9.3.1", "9.3.1 置换选择排序", "置换选择 ≠ 堆排序");
  card(s, 0.5, 1.1, 4.35, 2.1, "FDF0EE");
  text(s, "✗  把整份输入推进一个堆再依次弹出", 0.7, 1.2, 4, 0.35, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  text(s, "得到的是一条完全有序序列——那是**堆排序**，要求内存容纳整个文件，已经退回内部排序。", 0.7, 1.65, 3.95, 1.4, { fontSize: 12, margin: 0, lsm: 1.2 });
  card(s, 5.15, 1.1, 4.35, 2.1, "EAF4EF");
  text(s, "✓  现在的接口返回若干顺串", 5.35, 1.2, 4, 0.35, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  text(s, "`replacement_selection(input, memory)` 返回 `vector<vector<int>>`，并用原书图 9.2 这组数据守门：必须得到 **8 + 3** 两条顺串。", 5.35, 1.65, 3.95, 1.4, { fontSize: 12, margin: 0, lsm: 1.2 });
  callout(s, "旧实现的教训", "旧实现曾经把整份输入推进一个堆；测试只断言 `{3,1,2} → {1,2,3}`——**堆排序也能过**。只看「最后输出是否有序」的测试，守不住外排序。", 0.5, 3.4, 5.6, 1.7, { fontSize: 11.5 });
  callout(s, "边界：M ≥ N", "把 M 改成 11（装得下全部输入）只得到一个顺串，内容整表有序——置换选择**退化为堆排序**，正是「内存够用」的边界。", 6.35, 3.4, 3.15, 1.7, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// code 1
{
  const s = content("9.3.1", "9.3.1 置换选择 · modern.hpp（上）", "参数检查与首次建堆");
  codeBlock(s, `// 算法9.1：置换选择。memory 是内存工作区能容纳的记录数 M。
// 返回若干顺串：每个顺串内部有序，第一趟的平均长度约为 2M，而不是 M。
// 不属于当前顺串的新记录被冻结，等当前堆耗尽后再建下一趟。
inline std::vector<std::vector<int>> replacement_selection(const std::vector<int>& input,
                                                           std::size_t memory) {
    if (memory == 0) {
        throw std::invalid_argument("replacement selection memory must be positive");
    }
    if (input.empty()) {
        return {};
    }

    std::size_t next = 0;
    std::vector<int> heap;
    heap.reserve(memory);
    while (next < input.size() && heap.size() < memory) {
        heap.push_back(input[next++]);
    }
    detail::heap_from(heap);

    std::vector<std::vector<int>> runs;
    std::vector<int> current_run;
    std::vector<int> frozen;
`, 0.5, 1.02, 9.0, 3.5, { fontSize: 8.5, hl: [16, 17, 18, 19] });
  const notes = [
    ["memory == 0", "调用方的错误 → 抛 `invalid_argument`"],
    ["input.empty()", "可预期的空输入 → 返回空列表"],
    ["首次建堆", "至多读入 memory 条，`heap_from` 自底向上建最小堆"],
  ];
  notes.forEach((n, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.6, 2.85, 0.58, C.cream);
    text(s, n[0], x + 0.12, 4.62, 2.6, 0.24, { fontSize: 9.5, bold: true, color: C.goldText, margin: 0 });
    text(s, n[1], x + 0.12, 4.85, 2.65, 0.3, { fontSize: 9, margin: 0 });
  });
}

// code 2
{
  const s = content("9.3.1", "9.3.1 置换选择 · modern.hpp（中）", "当前堆空了：收尾一条顺串，冻结区解冻成新堆");
  codeBlock(s, `    while (!heap.empty() || next < input.size() || !frozen.empty()) {
        if (heap.empty()) {
            if (!current_run.empty()) {
                runs.push_back(std::move(current_run));
                current_run = {};
            }
            heap = std::move(frozen);
            frozen = {};
            while (next < input.size() && heap.size() < memory) {
                heap.push_back(input[next++]);
            }
            detail::heap_from(heap);
            if (heap.empty()) {
                break;
            }
        }
        // ...`, 0.5, 1.05, 5.9, 3.1, { fontSize: 9, hl: [7, 8] });
  callout(s, "循环条件：三者任一非空", [
    "活跃堆还有记录；",
    "输入还没读完；",
    "冻结区还有记录。",
  ], 6.65, 1.05, 2.85, 1.45, { fontSize: 10.5, gap: 2 });
  callout(s, "换顺串的四步", [
    "当前顺串非空 → 推入 `runs`；",
    "`heap = std::move(frozen)`：冻结区整体变成新工作区；",
    "若还有输入，补满到 memory 条；",
    "重新建堆，开始下一趟。",
  ], 6.65, 2.65, 2.85, 2.45, { fontSize: 10, gap: 3, fill: C.mint, tcolor: C.dark });
  text(s, "冻结区的大小 + 活跃堆的大小始终 ≤ memory：每冻结一条，堆就少一条——**内存工作区不超过 M**。", 0.5, 4.3, 5.9, 0.8, { fontSize: 11, color: C.goldText, bold: true });
}

// code 3
{
  const s = content("9.3.1", "9.3.1 置换选择 · modern.hpp（下）", "弹出堆顶，按「incoming >= emitted」分流");
  codeBlock(s, `        // ...
        const int emitted = detail::heap_pop(heap);
        current_run.push_back(emitted);

        if (next == input.size()) {
            continue;
        }
        const int incoming = input[next++];
        if (incoming >= emitted) {
            detail::heap_push(heap, incoming);
        } else {
            frozen.push_back(incoming);
        }
    }
    if (!current_run.empty()) {
        runs.push_back(std::move(current_run));
    }
    return runs;
}`, 0.5, 1.05, 5.9, 3.2, { fontSize: 9, hl: [9, 10, 11, 12] });
  callout(s, "分流是整个算法的核心", [
    "`>=`：等于刚输出的值也能留在当前顺串（非递减）。",
    "冻结的记录**不入堆**，不会和当前堆比赛。",
    "输入耗尽后只弹不补：把活跃堆排空。",
  ], 6.65, 1.05, 2.85, 2.35, { fontSize: 10.5, gap: 4 });
  callout(s, "Python 版同一逻辑", "`modern.py` 中 `nxt < smallest` 则 `frozen.append(nxt)`，否则 `_heap_push`；工作区空了就 `heap, frozen = frozen, []`。", 6.65, 3.55, 2.85, 1.55, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  text(s, "循环退出后，最后一条非空的 `current_run` 也要收进 `runs`。", 0.5, 4.4, 5.9, 0.6, { fontSize: 11, color: C.muted });
}

// ============================ PART 4 ============================
sectionSlide("Part 4 · 9.3.2 / 9.3.3", "归并：二路与多路", "二路外排序与趟数 · 为什么要选择树\n赢者树 · 败者树 · 四路归并演算 · 稳定性");

// 9.3.2 three buffers
{
  const s = content("9.3.2", "9.3.2 二路外排序", "归并两条顺串：至少三个缓冲页");
  card(s, 0.5, 1.1, 9.0, 2.55, C.code);
  const inBuf = (y, label, name) => {
    text(s, name, 0.7, y, 1.4, 0.4, { fontSize: 10.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 2.0, y, w: 2.0, h: 0.4, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
    text(s, label, 2.0, y, 2.0, 0.4, { fontSize: 10, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    hArrow(s, 4.05, y + 0.2, 0.75);
  };
  inBuf(1.35, "输入缓冲 1", "顺串 A 当前页");
  inBuf(2.35, "输入缓冲 2", "顺串 B 当前页");
  text(s, "页耗尽 → 读该顺串下一页", 2.0, 1.8, 2.4, 0.3, { fontSize: 9, color: C.green, margin: 0 });
  text(s, "页耗尽 → 读该顺串下一页", 2.0, 2.8, 2.4, 0.3, { fontSize: 9, color: C.green, margin: 0 });
  s.addShape(pres.shapes.OVAL, { x: 4.85, y: 1.6, w: 1.2, h: 1.2, fill: { color: C.cream }, line: { color: C.goldText, width: 1 } });
  text(s, "比较两个\n队首", 4.85, 1.6, 1.2, 1.2, { fontSize: 10, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  hArrow(s, 6.1, 2.2, 0.45);
  s.addShape(pres.shapes.RECTANGLE, { x: 6.6, y: 2.0, w: 1.3, h: 0.4, fill: { color: "F7E3B5" }, line: { color: C.goldText, width: 1 } });
  text(s, "输出缓冲", 6.6, 2.0, 1.3, 0.4, { fontSize: 10, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  hArrow(s, 7.95, 2.2, 0.45);
  text(s, "外存", 8.45, 2.0, 0.9, 0.4, { fontSize: 11, bold: true, color: C.dark, valign: "middle", margin: 0 });
  text(s, "页满 → 整页写回", 6.45, 2.45, 1.7, 0.3, { fontSize: 9, color: C.goldText, margin: 0 });
  text(s, "较小者移入输出缓冲", 4.6, 2.9, 1.8, 0.3, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
  bullets(s, [
    "比较两个输入缓冲的队首，把**较小者**移入输出缓冲。",
    "某个输入页耗尽，就读**该顺串**的下一页；输出页满，则**整页写回**。",
    "于是**每个输入页恰好读一次，每个输出页恰好写一次**。",
  ], 0.5, 3.8, 5.8, 1.3, { fontSize: 12, gap: 5 });
  callout(s, "趟数", "m 个顺串两两归并，趟数是 **⌈log₂ m⌉**。置换选择把初始顺串变长，就是为了减小 m。", 6.5, 3.8, 3.0, 1.3, { fontSize: 11 });
}

// 9.3.2 figure 9.3 + table
{
  const s = content("9.3.2", "9.3.2 二路外排序 · 图 9.3", "3000 条记录，10 条初始顺串：要归并几趟？");
  card(s, 0.5, 1.05, 9.0, 2.0, C.code);
  image(s, "fig-9-3", 0.7, 1.1, 8.6, 1.9);
  table(s, [
    ["趟次", "输入顺串数", "合并方式", "输出顺串数", "每条典型长度"],
    ["0", "10", "初始顺串", "10", "300"],
    ["1", "10", "两两归并", "5", "600"],
    ["2", "5", "两对归并，1 条轮空", "3", "1200, 1200, 600"],
    ["3", "3", "一对归并，1 条轮空", "2", "2400, 600"],
    ["4", "2", "最后归并", "1", { t: "3000", bold: true }],
  ], 0.5, 3.15, 6.3, [0.6, 1.1, 2.0, 1.1, 1.5], { fontSize: 10, rowH: 0.32, align: "center" });
  callout(s, "结论", "确实需要 **⌈log₂ 10⌉ = 4** 趟。每趟另写一个文件，归并阶段传输约 **4 × 2N = 8N** 条记录。", 7.0, 3.15, 2.5, 1.95, { fontSize: 11 });
}

// 9.3.2 two conclusions
{
  const s = content("9.3.2", "9.3.2 二路外排序", "两笔账：省一趟值多少？路数越多越好吗？");
  card(s, 0.5, 1.1, 4.35, 2.4, "EAF4EF");
  text(s, "置换选择省下一整趟", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  const bars = [["10 条顺串", "⌈log₂ 10⌉ = 4 趟", 4], ["5 条顺串", "⌈log₂ 5⌉ = 3 趟", 3]];
  bars.forEach((b, i) => {
    const y = 1.7 + i * 0.6;
    text(s, b[0], 0.7, y, 1.1, 0.4, { fontSize: 11, bold: true, valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 1.85, y: y + 0.05, w: b[2] * 0.55, h: 0.3, fill: { color: i === 0 ? "9AAFA6" : C.ok }, line: { type: "none" } });
    text(s, b[1], 1.9 + b[2] * 0.55, y, 1.6, 0.4, { fontSize: 10, valign: "middle", margin: 0 });
  });
  text(s, "初始顺串数从 10 降到 5，直接省掉**一次完整读写**（约 2N 条记录的传输）。", 0.7, 2.9, 4, 0.55, { fontSize: 10.5, margin: 0 });
  card(s, 5.15, 1.1, 4.35, 2.4, "FDF0EE");
  text(s, "「增加归并路数总会更快」不成立", 5.35, 1.2, 4.1, 0.35, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "k 越大，趟数越少；",
    "但至少要为**每一路留一个输入缓冲**，还要有输出缓冲；",
    "内存固定时，每路缓冲变小，**补页更频繁**。",
  ], 5.3, 1.65, 4.1, 1.8, { fontSize: 11.5, gap: 5 });
  card(s, 0.5, 3.7, 9.0, 1.4, C.dark);
  text(s, "选择 k 是一种折中", 0.75, 3.8, 5, 0.3, { fontSize: 12, bold: true, color: C.gold, margin: 0 });
  text(s, "「少趟数」和「每路有足够缓冲」之间的折中。而且 k 变大后，从 k 个队首里挑最小也会变贵——下一页先算这笔账。", 0.75, 4.15, 8.5, 0.85, { fontSize: 12.5, color: C.white, margin: 0, lsm: 1.2 });
}

// 9.3.3 cost of k-way
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树", "先算一笔账：直接比较时，内部归并随 k 变贵");
  bullets(s, [
    "k（k > 2）路归并：在 k 个队首中找最小，要 **k − 1** 次两两比较。",
    "得到含 u 个记录的归并段：**(k − 1)(u − 1)** 次比较。",
    "对 n 个记录的文件，内部归并的总比较次数：",
  ], 0.5, 1.05, 5.5, 1.4, { fontSize: 12, gap: 5 });
  card(s, 0.5, 2.45, 5.5, 1.05, C.dark);
  text(s, "⌈log_k m⌉·(k−1)·(n−1)", 0.7, 2.52, 5.2, 0.42, { fontSize: 16, bold: true, color: C.gold, margin: 0 });
  text(s, "= ⌈log₂ m⌉ / log₂ k · (k−1)·(n−1)", 0.7, 2.95, 5.2, 0.42, { fontSize: 14, bold: true, color: C.white, margin: 0 });
  callout(s, "削减了增大 k 的好处", "m 不变时，随着 k 增大，**(k−1) / log₂ k** 也增大：内部归并的时间随之增大，某种程度上**削减了由于增大 k 而减少归并趟数带来的好处**。", 0.5, 3.65, 5.5, 1.45, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
  s.addChart(pres.charts.BAR, [{ name: "(k-1)/log2 k", labels: ["2", "4", "8", "16", "32"], values: [1, 1.5, 2.33, 3.75, 6.2] }], {
    x: 6.2, y: 1.05, w: 3.3, h: 4.05, barDir: "col", chartColors: [C.bad], dataLabelFormatCode: "0.##",
    showTitle: true, title: "(k−1) / log₂ k", titleFontSize: 11, titleColor: C.dark, titleFontFace: FONT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 9, dataLabelColor: C.dark,
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted, valAxisLabelFontSize: 8, catAxisLabelFontSize: 9,
    valGridLine: { color: "E5EAE8", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
    showCatAxisTitle: true, catAxisTitle: "k", catAxisTitleFontSize: 9, catAxisTitleColor: C.muted,
  });
}

// 9.3.3 tree removes the term
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树", "选择树正是用来消掉这一项的");
  text(s, "选择树从 k 个关键码中找出最小值，比较次数是树高 **⌈log₂ k⌉**。于是内部归并的总比较次数变为：", 0.5, 1.02, 9, 0.6, { fontSize: 12.5 });
  card(s, 0.5, 1.65, 9.0, 0.95, C.dark);
  text(s, "⌈log_k m⌉·⌈log₂ k⌉·(n−1) = (log₂ m / log₂ k)·⌈log₂ k⌉·(n−1) = ⌈log₂ m⌉·(n−1)", 0.7, 1.72, 8.6, 0.45, { fontSize: 13, bold: true, color: C.gold, margin: 0 });
  text(s, "内部比较次数与 k 无关，不随 k 的增加而增加——这就是选择树存在的全部理由。", 0.7, 2.18, 8.6, 0.35, { fontSize: 12, color: C.white, margin: 0 });
  table(s, [
    ["k", "趟数 ⌈log_k 256⌉", "直接比较：趟数 × (k−1)", "选择树：趟数 × ⌈log₂ k⌉"],
    ["2", "8", "8", { t: "8", bold: true, color: C.ok }],
    ["4", "4", "12", { t: "8", bold: true, color: C.ok }],
    ["16", "2", "30", { t: "8", bold: true, color: C.ok }],
    ["256", "1", { t: "255", bold: true, color: C.bad }, { t: "8", bold: true, color: C.ok }],
  ], 0.5, 2.8, 5.9, [0.6, 1.5, 1.95, 1.85], { fontSize: 10, rowH: 0.36, align: "center" });
  text(s, "表中数字 × (n−1) 即内部归并总比较次数（m = 256 个初始顺串，取整后恰好整除）。", 0.5, 4.75, 5.9, 0.35, { fontSize: 9, color: C.muted });
  callout(s, "直观理解", [
    "第一次建树要 k−1 次比较；",
    "之后**只替换获胜顺串的队首**，沿高度 ⌈log₂ k⌉ 的路径重赛；",
    "输出 N 条记录：选择代价由 **O(Nk)** 降为 **O(N log k)**。",
  ], 6.6, 2.8, 2.9, 2.3, { fontSize: 10.5, gap: 4 });
}

// 9.3.3 winner tree definition
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树 · 赢者树", "选择树（竞赛树）：一系列「淘汰赛」的结果");
  bullets(s, [
    "选择树是**完全二叉树**，通常顺序存储；有**赢者树**和**败者树**两种。",
    "**赢者树**：n 名选手 → n 个外部结点、**n − 1** 个内部结点；每个内部结点记录其左右子结点那场比赛的**赢家**。",
    "从最底层开始两两比赛，输者淘汰、赢者向上，**树根记录整个比赛的胜者**。最小赢者树中分数小的获胜。",
    "数组存储：选手 **L[1…n]**，内部结点 **B[1…n−1]**，**B 中存的是 L 的索引**。",
    "每个「选手」代表**一条顺串的当前记录**。",
  ], 0.5, 1.05, 5.6, 3.0, { fontSize: 12, gap: 6 });
  card(s, 6.35, 1.05, 3.15, 3.15, C.code);
  image(s, "fig-9-4", 6.5, 1.15, 2.85, 2.7);
  text(s, "图 9.4  含有 5 个选手的赢者树", 6.35, 3.85, 3.15, 0.3, { fontSize: 9.5, color: C.muted, align: "center" });
  callout(s, "何时值得用", "内存内一般的「取最小」任务直接用**二叉堆或优先队列**；只有需要反复从**固定的多路输入**中选冠军时，才值得维护选择树——它是外排序多路归并的专用优化。", 0.5, 4.2, 9.0, 0.9, { fontSize: 10.5, tsize: 11, fill: C.mint, tcolor: C.dark, lsm: 1.05 });
}

// 9.3.3 index mapping
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树 · 赢者树", "外部结点 L[i] 挂在哪个内部结点 B[p] 下？");
  card(s, 0.5, 1.05, 5.3, 2.35, C.dark);
  const f = [
    ["最底层最左内部结点编号", "2^s，s = ⌊log₂(n−1)⌋"],
    ["最底层外部结点数", "LowExt = 2(n − 2^s)"],
    ["最底层外部结点之上的结点数", "offset = 2^(s+1) − 1"],
  ];
  f.forEach((r, i) => {
    text(s, r[0], 0.7, 1.15 + i * 0.42, 2.6, 0.38, { fontSize: 10.5, color: C.mint, valign: "middle", margin: 0 });
    text(s, r[1], 3.2, 1.15 + i * 0.42, 2.55, 0.38, { fontSize: 11.5, bold: true, color: C.white, valign: "middle", margin: 0 });
  });
  text(s, "p = (i + offset) / 2              i ≤ LowExt", 0.7, 2.5, 5, 0.3, { fontSize: 11, bold: true, fontFace: MONO, color: C.gold, margin: 0 });
  text(s, "p = (i − LowExt + n − 1) / 2      i > LowExt", 0.7, 2.85, 5, 0.3, { fontSize: 11, bold: true, fontFace: MONO, color: C.gold, margin: 0 });
  text(s, "例：n = 5 → s = 2，2^s = 4，LowExt = 2，offset = 7（整数除法）", 0.5, 3.55, 5.3, 0.3, { fontSize: 11, bold: true, color: C.dark });
  table(s, [
    ["L[i]", "L[1]", "L[2]", "L[3]", "L[4]", "L[5]"],
    ["条件", "≤ LowExt", "≤ LowExt", "> LowExt", "> LowExt", "> LowExt"],
    ["算式", "(1+7)/2", "(2+7)/2", "(3−2+4)/2", "(4−2+4)/2", "(5−2+4)/2"],
    [{ t: "B[p]", bold: true }, { t: "B[4]", bold: true, color: C.ok }, { t: "B[4]", bold: true, color: C.ok }, { t: "B[2]", bold: true, color: C.ok }, { t: "B[3]", bold: true, color: C.ok }, { t: "B[3]", bold: true, color: C.ok }],
  ], 0.5, 3.9, 5.3, [0.7, 0.92, 0.92, 0.92, 0.92, 0.92], { fontSize: 9.5, rowH: 0.29, align: "center", tight: true });
  card(s, 6.05, 1.05, 3.45, 3.0, C.code);
  image(s, "fig-9-4", 6.2, 1.12, 3.15, 2.85);
  callout(s, "对照图 9.4", "L[1]、L[2] 挂在 B[4]，L[3] 挂在 B[2]，L[4]、L[5] 挂在 B[3]。", 6.05, 4.15, 3.45, 0.95, { fontSize: 10.5 });
}

// 9.3.3 winner tree replay
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树 · 赢者树", "8 路归并：输出冠军后只沿一条路径重赛");
  card(s, 0.5, 1.02, 4.4, 2.75, C.code);
  image(s, "fig-9-5", 0.55, 1.07, 4.3, 2.4);
  text(s, "图 9.5  冠军 L[3] = 6", 0.5, 3.5, 4.4, 0.25, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
  card(s, 5.1, 1.02, 4.4, 2.75, C.code);
  image(s, "fig-9-6", 5.15, 1.07, 4.3, 2.4);
  text(s, "图 9.6  R[3] 补入 11 后重构", 5.1, 3.5, 4.4, 0.25, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
  const steps = [
    ["B[5]", "L[3]=11 vs L[4]=20 → 3"],
    ["B[2]", "L[2]=9 vs L[3]=11 → 2"],
    ["B[1]", "L[2]=9 vs L[6]=8 → 6"],
  ];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 2.05;
    card(s, x, 3.95, 1.9, 0.75, C.cream);
    text(s, st[0], x + 0.1, 3.98, 1.7, 0.28, { fontSize: 11, bold: true, color: C.goldText, fontFace: MONO, margin: 0 });
    text(s, st[1], x + 0.1, 4.28, 1.75, 0.38, { fontSize: 9.5, margin: 0 });
  });
  text(s, "其余比赛结果不变。修改次数在 0 ~ log₂ n 之间：路径上某场结果没变，祖先就不必再赛。", 0.5, 4.75, 6.1, 0.4, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "赢者树要「取兄弟」", "父结点记的是胜者，重赛 B[p] 时要读**两个孩子**的胜者：沿途每层都要去看对手（兄弟）是谁。", 6.75, 3.95, 2.75, 1.15, { fontSize: 10 });
}

// four-way merge trace
{
  const s = content("9.3.3", "9.3.3 四路归并 · 手工演算", "每一步只替换刚获胜的那一路");
  const hot = (t) => ({ t, bold: true, color: C.bad });
  table(s, [
    ["步", "比赛中的 4 个当前值", "冠军路", "输出", "该路补入"],
    ["1", "2, 4, 1, 6", "R2", hot("1"), "11"],
    ["2", "2, 4, 11, 6", "R0", hot("2"), "12"],
    ["3", "12, 4, 11, 6", "R1", hot("4"), "9"],
    ["4", "12, 9, 11, 6", "R3", hot("6"), "8"],
    ["5", "12, 9, 11, 8", "R3", hot("8"), "30"],
    ["6", "12, 9, 11, 30", "R1", hot("9"), "25"],
    ["7", "12, 25, 11, 30", "R2", hot("11"), "18"],
    ["8", "12, 25, 18, 30", "R0", hot("12"), "20"],
    ["9", "20, 25, 18, 30", "R2", hot("18"), "耗尽"],
    ["10", "20, 25, +∞, 30", "R0", hot("20"), "耗尽"],
    ["11", "+∞, 25, +∞, 30", "R1", hot("25"), "耗尽"],
    ["12", "+∞, +∞, +∞, 30", "R3", hot("30"), "耗尽"],
  ], 0.5, 1.02, 5.5, [0.5, 2.2, 0.9, 0.8, 1.1], { fontSize: 9, rowH: 0.29, tight: true, align: "center" });
  codeBlock(s, `R0:  2 12 20
R1:  4  9 25
R2:  1 11 18
R3:  6  8 30`, 6.25, 1.02, 3.25, 1.05, { fontSize: 10, lang: "text" });
  callout(s, "输出", "`1 2 4 6 8 9 11 12 18 20 25 30`", 6.25, 2.2, 3.25, 0.85, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "一路耗尽：用 +∞ 参赛", [
    "耗尽的路以「正无穷」参加余下比赛，就不会再次获胜。",
    "但若关键码允许取最大整数，`INT_MAX` 哨兵会**与合法数据冲突**。",
    "更稳妥：额外保存「该路是否耗尽」的状态。",
  ], 6.25, 3.18, 3.25, 1.92, { fontSize: 9.5, gap: 3 });
}

// loser tree definition
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树 · 败者树", "败者树：内部结点记败者，另设 B[0] 记冠军");
  bullets(s, [
    "内部结点记录的是**败者**的下标；另加结点 **B[0]** 记录整个比赛的**冠军**。",
    "某选手 L[i] 的分数改变时，同样只沿 L[i] 到根的路径修改：",
    { t: "新进入的结点与父结点比赛，**败者下标存放在父结点中**；", sub: true },
    { t: "**赢者**再与上一级父结点比较，沿路径一直到根。", sub: true },
    "父结点里存的就是这一路的对手，**不必再去取兄弟**——败者树比赢者树少一次「取兄弟」访问，也是外排序实现里**更常见**的选择。",
  ], 0.5, 1.05, 4.9, 3.6, { fontSize: 12, gap: 6 });
  card(s, 5.6, 1.05, 3.9, 3.6, C.code);
  image(s, "fig-9-7", 5.7, 1.1, 3.7, 3.2);
  text(s, "图 9.7  8 路归并的败者树（冠军 B[0] = 3）", 5.6, 4.3, 3.9, 0.3, { fontSize: 9.5, color: C.muted, align: "center" });
  text(s, "同一组 8 个关键码 10 9 6 20 12 8 15 16：B[4]=1（10 输给 9）、B[5]=4（20 输给 6）、B[2]=2（9 输给 6）、B[1]=6（8 输给 6）。", 0.5, 4.72, 9.0, 0.4, { fontSize: 9.5, color: C.muted });
}

// loser tree replay
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树 · 败者树", "输出冠军 L[3]=6、R[3] 补入 11：新值与路径上的败者依次比较");
  card(s, 0.5, 1.05, 4.2, 3.35, C.code);
  image(s, "fig-9-8", 0.6, 1.1, 4.0, 3.0);
  text(s, "图 9.8  替换一路记录后重构败者树", 0.5, 4.08, 4.2, 0.3, { fontSize: 9.5, color: C.muted, align: "center" });
  const steps = [
    ["B[5]", "11 vs L[4]=20", "20 输 → B[5] = 4", "11（L[3]）上行"],
    ["B[2]", "11 vs 存着的败者 L[2]=9", "11 输 → B[2] = 3", "9（L[2]）上行"],
    ["B[1]", "9 vs 存着的败者 L[6]=8", "9 输 → B[1] = 2", "8（L[6]）上行"],
    ["B[0]", "到根", "冠军 = 6", "下一个输出 8"],
  ];
  steps.forEach((st, i) => {
    const y = 1.05 + i * 0.84;
    numCircle(s, i + 1, 4.95, y + 0.17, 0.38, i === 3 ? C.gold : C.green);
    text(s, st[0], 5.45, y + 0.05, 0.7, 0.3, { fontSize: 12, bold: true, fontFace: MONO, color: C.dark, margin: 0 });
    text(s, st[1], 6.15, y + 0.05, 3.35, 0.3, { fontSize: 10.5, margin: 0 });
    text(s, st[2], 5.45, y + 0.38, 2.0, 0.3, { fontSize: 10.5, bold: true, color: C.bad, margin: 0 });
    text(s, st[3], 7.5, y + 0.38, 2.0, 0.3, { fontSize: 10.5, color: C.ok, margin: 0 });
  });
  callout(s, "对照赢者树", "同样 3 场比赛，但每场的对手**就存在父结点里**：B[2] 里是 2（L[2]），B[1] 里是 6（L[6]），不必再去读兄弟子树的胜者。", 0.5, 4.5, 9.0, 0.62, { fontSize: 10.5, tsize: 10.5, fill: C.mint, tcolor: C.dark, lsm: 1.0 });
}

// demo loser tree drawn with book implementation
{
  const s = content("9.3.3", "9.3.3 本书实现 · demo 里的败者树", "LoserTree({20, 6, 8, 9, 11})：leaf_base = 8，结点里写败者下标");
  card(s, 0.5, 1.05, 4.4, 3.2, C.code);
  text(s, "建树后", 0.65, 1.1, 1.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  drawTree(s, 0.7, 1.55, { leaves: [20, 6, 8, 9, 11, null, null, null], nodes: { 1: "4", 2: "2", 3: "—", 4: "0", 5: "3", 6: "—", 7: "—" }, champ: "1" });
  card(s, 5.1, 1.05, 4.4, 3.2, C.code);
  text(s, "replace(1, 15) 后", 5.25, 1.1, 2.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  drawTree(s, 5.3, 1.55, { leaves: [20, 15, 8, 9, 11, null, null, null], nodes: { 1: "4", 2: "1", 3: "—", 4: "0", 5: "3", 6: "—", 7: "—" }, champ: "2", path: [1, 2, 4], leafHl: 1 });
  bullets(s, [
    "方框下的数字是选手下标；圆圈里是**败者下标**，「—」表示该场有一方是空位（`no_player`，直接轮空）。",
    "建树：冠军是下标 1（值 6）。替换后重赛结点 **4 → 2 → 1**：15 在结点 2 输给 8，冠军变为下标 2（值 **8**）——与 demo 输出一致。",
  ], 0.5, 4.33, 9.0, 0.8, { fontSize: 10, gap: 2 });
}

// winner vs loser comparison
{
  const s = content("9.3.3", "9.3.3 多路归并——选择树", "赢者树 vs 败者树：区别在重赛时保存了什么信息");
  table(s, [
    ["", "赢者树", "败者树"],
    [{ t: "内部结点存", bold: true }, "两子树比赛的**胜者**下标", "该场比赛的**败者**下标"],
    [{ t: "全局冠军", bold: true }, "根 B[1]", "另设冠军槽 B[0]（本书 `champion_`）"],
    [{ t: "重赛时的对手", bold: true }, "要去找沿途的对手（**取兄弟**）", "直接与父结点里留下的败者比较"],
    [{ t: "替换一名选手", bold: true }, "沿叶到根，⌈log₂ k⌉ 场", "沿叶到根，⌈log₂ k⌉ 场"],
    [{ t: "本书存储", bold: true }, { t: "tree_（2·leaf_base）", mono: true }, { t: "loser_ + subtree_winner_", mono: true }],
  ], 0.5, 1.05, 9.0, [1.8, 3.4, 3.8], { fontSize: 11, rowH: 0.46 });
  callout(s, "渐近复杂度相同", "两者都是 **O(log k)**；区别只在重赛时保存了什么信息。", 0.5, 4.0, 4.35, 1.1, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "相等关键码的决胜规则", "必须规定稳定的规则：本书让**下标较小的路获胜**（`<=`），测试用两个值为 1 的选手固定这条规则。", 5.15, 4.0, 4.35, 1.1, { fontSize: 11 });
}

// TournamentOps code
{
  const s = content("9.3.3", "9.3.3 选择树 · modern.hpp · detail::TournamentOps", "better / worse：一次比较，两个结果");
  codeBlock(s, `struct TournamentOps {
    static constexpr std::size_t no_player = static_cast<std::size_t>(-1);

    // ...

    static std::size_t better(const std::vector<int>& players, std::size_t left,
                              std::size_t right) {
        if (left == no_player) {
            return right;
        }
        if (right == no_player) {
            return left;
        }
        return players[left] <= players[right] ? left : right;
    }

    static std::size_t worse(const std::vector<int>& players, std::size_t left,
                             std::size_t right) {
        if (left == no_player) {
            return left;
        }
        if (right == no_player) {
            return right;
        }
        return players[left] <= players[right] ? right : left;
    }
};`, 0.5, 1.05, 6.3, 4.05, { fontSize: 8.5, hl: [14, 25] });
  callout(s, "<= 决定平局", "值相等时 `left` 胜：下标小的路获胜，比赛结果**可重复**。", 7.05, 1.05, 2.45, 1.3, { fontSize: 10.5 });
  callout(s, "no_player：空位", [
    "叶数补到 2 的幂（`next_power_of_two`），多出的叶是空位。",
    "`better`：空位直接让对方胜。",
    "`worse`：有空位时败者记为空位（「轮空」）。",
  ], 7.05, 2.5, 2.45, 2.6, { fontSize: 10, gap: 3, fill: C.mint, tcolor: C.dark });
}

// WinnerTree code 1
{
  const s = content("9.3.3", "9.3.3 代码 9.2 · WinnerTree（上）", "建树：叶放选手下标，内部结点自底向上写 better");
  codeBlock(s, `// 代码9.2：赢者树。内部结点保存两名选手比较后的胜者下标，根是全局最小。
class WinnerTree {
public:
    explicit WinnerTree(std::vector<int> players) : players_(std::move(players)) {
        if (players_.empty()) {
            return;
        }
        leaf_base_ = detail::TournamentOps::next_power_of_two(players_.size());
        tree_.assign(leaf_base_ * 2, detail::TournamentOps::no_player);
        for (std::size_t index = 0; index < players_.size(); ++index) {
            tree_[leaf_base_ + index] = index;
        }
        for (std::size_t node = leaf_base_ - 1; node > 0; --node) {
            tree_[node] = detail::TournamentOps::better(players_, tree_[node * 2],
                                                        tree_[node * 2 + 1]);
        }
    }

    [[nodiscard]] std::optional<std::size_t> winner_index() const {
        if (players_.empty() || tree_[1] == detail::TournamentOps::no_player) {
            return std::nullopt;
        }
        return tree_[1];
    }

    [[nodiscard]] std::optional<int> winner() const {
        const auto index = winner_index();
        return index ? std::optional<int>(players_[*index]) : std::nullopt;
    }`, 0.5, 1.05, 6.55, 4.05, { fontSize: 7.9, hl: [13, 14, 15] });
  callout(s, "完全二叉数组", [
    "结点 1 是根；结点 i 的孩子是 2i、2i+1。",
    "叶从 `leaf_base_` 开始：选手 j 在 `leaf_base_ + j`。",
    "建树：从 `leaf_base_ - 1` 到 1 逐个结点比赛，自底向上。",
  ], 7.3, 1.05, 2.2, 2.45, { fontSize: 10, gap: 3 });
  callout(s, "空树", "没有选手时 `winner()` 返回空 `optional`，而不是抛异常。", 7.3, 3.65, 2.2, 1.45, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// WinnerTree code 2
{
  const s = content("9.3.3", "9.3.3 代码 9.2 · WinnerTree（下）", "replace：从叶爬到根，每层重写一次 better");
  codeBlock(s, `    void replace(std::size_t player, int value) {
        if (player >= players_.size()) {
            throw std::out_of_range("tournament player");
        }
        players_[player] = value;
        std::size_t node = leaf_base_ + player;
        tree_[node] = player;
        while (node > 1) {
            node /= 2;
            tree_[node] = detail::TournamentOps::better(players_, tree_[node * 2],
                                                        tree_[node * 2 + 1]);
        }
    }

private:
    std::vector<int> players_;
    std::vector<std::size_t> tree_;
    std::size_t leaf_base_{0};
};`, 0.5, 1.05, 6.55, 3.1, { fontSize: 8.5, hl: [8, 9, 10, 11] });
  callout(s, "要读两个孩子", "`better(tree_[node*2], tree_[node*2+1])`：重算一个结点就要看它**两个孩子**的赢家——这就是「取兄弟」。", 7.3, 1.05, 2.2, 2.2, { fontSize: 10 });
  callout(s, "越界是调用方的错误", "`player >= size` 抛 `out_of_range`。", 7.3, 3.4, 2.2, 1.1, { fontSize: 10, fill: "FDF0EE", tcolor: C.bad });
  text(s, "上机题：随机替换选手，每次与「扫描 k 路取最小」（`std::min_element`）对拍冠军的值和下标。", 0.5, 4.3, 6.55, 0.6, { fontSize: 10.5, color: C.goldText, bold: true });
}

// LoserTree code 1
{
  const s = content("9.3.3", "9.3.3 代码 9.3 · LoserTree（上）", "两个数组：loser_ 记败者，subtree_winner_ 记子树胜者");
  codeBlock(s, `// 代码9.3：败者树。内部结点保存败者下标，另用 champion_ 记录全局胜者。
// 替换一名选手时只需沿叶到根重赛，不必访问兄弟子树的内部结构。
class LoserTree {
public:
    explicit LoserTree(std::vector<int> players) : players_(std::move(players)) {
        if (players_.empty()) {
            return;
        }
        leaf_base_ = detail::TournamentOps::next_power_of_two(players_.size());
        loser_.assign(leaf_base_, detail::TournamentOps::no_player);
        subtree_winner_.assign(leaf_base_ * 2, detail::TournamentOps::no_player);
        for (std::size_t index = 0; index < players_.size(); ++index) {
            subtree_winner_[leaf_base_ + index] = index;
        }
        for (std::size_t node = leaf_base_ - 1; node > 0; --node) {
            replay_node(node);
        }
        champion_ = subtree_winner_[1];
    }

    [[nodiscard]] std::optional<std::size_t> winner_index() const {
        if (players_.empty() || champion_ == detail::TournamentOps::no_player) {
            return std::nullopt;
        }
        return champion_;
    }
    // ...`, 0.5, 1.05, 6.55, 4.05, { fontSize: 8.5, hl: [10, 11, 18] });
  callout(s, "数组大小", [
    "`loser_`：leaf_base 个，结点 1…leaf_base−1 有效（0 不用）。",
    "`subtree_winner_`：2·leaf_base 个，叶与内部结点都有。",
    "`champion_` 就是 B[0]。",
  ], 7.3, 1.05, 2.2, 2.75, { fontSize: 9.5, gap: 3 });
  callout(s, "建树", "自底向上对每个内部结点 `replay_node`，最后冠军 = 根的子树胜者。", 7.3, 3.95, 2.2, 1.15, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
}

// LoserTree code 2
{
  const s = content("9.3.3", "9.3.3 代码 9.3 · LoserTree（中）", "loser_at 与 replace");
  codeBlock(s, `    [[nodiscard]] std::optional<int> winner() const {
        const auto index = winner_index();
        return index ? std::optional<int>(players_[*index]) : std::nullopt;
    }

    [[nodiscard]] std::optional<std::size_t> loser_at(std::size_t node) const {
        if (node == 0 || node >= loser_.size() ||
            loser_[node] == detail::TournamentOps::no_player) {
            return std::nullopt;
        }
        return loser_[node];
    }

    void replace(std::size_t player, int value) {
        if (player >= players_.size()) {
            throw std::out_of_range("tournament player");
        }
        players_[player] = value;
        subtree_winner_[leaf_base_ + player] = player;
        for (std::size_t node = (leaf_base_ + player) / 2; node > 0; node /= 2) {
            replay_node(node);
        }
        champion_ = subtree_winner_[1];
    }
    // ...`, 0.5, 1.05, 6.55, 3.75, { fontSize: 8.5, hl: [19, 20, 21, 23] });
  callout(s, "loser_at(node)", "「这一路是在哪一层、被谁淘汰的」。结点 0、越界、轮空都返回空 `optional`。", 7.3, 1.05, 2.2, 1.85, { fontSize: 10 });
  callout(s, "replace", "叶写回自己的下标，从父结点 `(leaf_base_+player)/2` 开始逐层 `replay_node`，最后更新冠军。", 7.3, 3.05, 2.2, 2.05, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  text(s, "demo：`tree.replace(1, 15)` 重赛结点 4、2、1，冠军变为 8。", 0.5, 4.88, 6.55, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
}

// LoserTree code 3
{
  const s = content("9.3.3", "9.3.3 代码 9.3 · LoserTree（下）", "replay_node：一场比赛同时写下败者和胜者");
  codeBlock(s, `    // ...
private:
    void replay_node(std::size_t node) {
        const std::size_t left = subtree_winner_[node * 2];
        const std::size_t right = subtree_winner_[node * 2 + 1];
        loser_[node] = detail::TournamentOps::worse(players_, left, right);
        subtree_winner_[node] = detail::TournamentOps::better(players_, left, right);
    }

    std::vector<int> players_;
    std::vector<std::size_t> loser_;
    std::vector<std::size_t> subtree_winner_;
    std::size_t leaf_base_{0};
    std::size_t champion_{detail::TournamentOps::no_player};
};`, 0.5, 1.05, 6.55, 2.55, { fontSize: 9, hl: [6, 7] });
  callout(s, "为什么两个数组都要维护？（modern.py 的注释）", [
    "只留输家数组的写法看着更省，但那样**只有「替换冠军」这一种用法是对的**。",
    "k 路归并恰好只用那一种，于是错误可以**长期不被发现**。",
    "同时维护 `subtree_winner_` 与 `loser_`，替换**任意**一片叶子都成立——这里不取那条捷径。",
  ], 0.5, 3.75, 9.0, 1.35, { fontSize: 10.5, gap: 2, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "对拍", "测试里赢者树和败者树**逐项对拍**：同一组输入，输出序列必须完全相同。", 7.3, 1.05, 2.2, 2.55, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// stability
{
  const s = content("9.3.3", "9.3.3 稳定性和重复关键码", "关键码相等，不代表记录相同");
  bullets(s, [
    "外排序处理的通常是**完整记录**。若要求稳定排序，比较器必须把「**原始先后次序**」作为第二关键码：",
    { t: "同一顺串内：先出现的先输出；", sub: true },
    { t: "不同顺串之间：用**初始顺串号 + 顺串内位置**决胜。", sub: true },
    "只比较整数值，虽然仍能得到非递减关键码，却可能**打乱同关键码记录的先后**。",
  ], 0.5, 1.05, 9.0, 1.9, { fontSize: 12.5, gap: 6 });
  card(s, 0.5, 3.05, 4.35, 2.05, C.code);
  text(s, "本书 WinnerTree / LoserTree", 0.7, 3.15, 4, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "值相等时**下标较小的选手获胜**：保证比赛结果**可重复**，但它只等价于「**路号优先**」。", 0.7, 3.55, 3.95, 1.4, { fontSize: 11.5, margin: 0, lsm: 1.2 });
  callout(s, "≠ 全文件稳定", "若初始顺串本身由稳定排序生成，还要证明**路号顺序与原始文件顺序一致**；否则应把**原始序号随记录一起参与比较**。", 5.15, 3.05, 4.35, 2.05, { fontSize: 11.5, fill: "FDF0EE", tcolor: C.bad });
}

// common mistakes
{
  const s = content("9.3", "9.3 外排序 · 三个常见错误", "三个常见错误，以及测试该查什么");
  const errs = [
    ["把所有输入一次放进堆", "要求内存容纳整个文件，已经**退回内部堆排序**。"],
    ["冻结后仍与当前堆比赛", "小于刚输出值的记录会让当前顺串**倒序**，破坏归并前提。"],
    ["一路耗尽就停止", "正确做法：让该路**退出比赛**，继续归并其余顺串，直到所有路都耗尽。"],
  ];
  errs.forEach((e, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.1, 2.85, 1.95, "FDF0EE");
    numCircle(s, i + 1, x + 0.18, 1.22, 0.4, C.bad);
    text(s, e[0], x + 0.68, 1.2, 2.1, 0.5, { fontSize: 12.5, bold: true, color: C.bad, margin: 0, valign: "middle" });
    text(s, e[1], x + 0.18, 1.8, 2.55, 1.15, { fontSize: 11, margin: 0, lsm: 1.15 });
  });
  text(s, "检查外排序程序，不能只看「最后输出是否有序」——还要分别检查：", 0.5, 3.2, 9, 0.35, { fontSize: 12.5, bold: true, color: C.dark });
  const checks = ["记录守恒", "每条初始顺串有序", "工作区不超过 M", "耗尽一路后仍能继续", "相等关键码的决胜规则"];
  checks.forEach((c, i) => {
    const x = 0.5 + i * 1.82;
    pill(s, "✓ " + c, x, 3.65, 1.72, 0.42, C.green, C.white, 10);
  });
  callout(s, "为什么", "否则一个**偷偷做整表排序**的实现也会交出正确终值，却完全没有实现外排序。", 0.5, 4.25, 9.0, 0.85, { fontSize: 11.5, lsm: 1.0 });
}

// cost summary
{
  const s = content("9.3", "9.3 外排序 · 代价小结", "设文件 N 条记录、内存装 M 条、k 路归并");
  table(s, [
    ["环节", "代价", "谁来优化"],
    [{ t: "生成顺串（置换选择）", bold: true }, "顺串平均长 2M，段数约 N / 2M", "置换选择：减少**段数** m"],
    [{ t: "归并趟数", bold: true }, { t: "⌈log_k (N/2M)⌉", mono: true }, "多路归并：减少**趟数**"],
    [{ t: "每趟外存访问", bold: true }, "读一遍 + 写一遍整文件（约 2N/B 页）", "趟数少一趟，省一整轮"],
    [{ t: "每步挑最小", bold: true }, "直接比较 O(k)；选择树 O(log k)", "选择树：内部比较与 k 无关"],
    [{ t: "每路缓冲", bold: true }, "内存固定时，k 越大每路缓冲越小", "k 的选择是折中"],
  ], 0.5, 1.05, 9.0, [2.3, 3.6, 3.1], { fontSize: 11, rowH: 0.5 });
  card(s, 0.5, 4.2, 9.0, 0.9, C.dark);
  text(s, "优化的两个方向：**置换选择**减少段数，**多路归并 + 选择树**减少趟数且不让内部比较变贵。", 0.75, 4.2, 8.5, 0.9, { fontSize: 13, color: C.white, valign: "middle", margin: 0 });
}

// exercises
{
  const s = content("练", "习题精选", "几道代表性习题（答案已核对）");
  const ex = [
    ["正文习题 2", "输入 50 49 35 45 30 25 15 60 16 27 1、M = 7，写出置换选择的顺串并指出冻结的键。", "`15 25 30 35 45 49 50 60` 与 `1 16 27`；16、27、1 被冻结。"],
    ["课程作业", "数据 10 20 2 5 15 8 26 4 11 7 13 16 21 14 6，堆大小 5，求置换选择的顺串。", "`2 5 8 10 11 15 20 26`、`4 7 13 14 16 21`、`6`：第一顺串长 8 > 5。"],
    ["原书习题 3", "80 个初始归并段：(1) 3 趟完成，至少几路？(2) 同时可用文件 ≤ 15，至少几趟？此趟数下最低路数？", "(1) k³ ≥ 80 → **k = 5**；(2) 含输出文件 k ≤ 14，14² ≥ 80 → **2 趟**；k² ≥ 80 → **k = 9**。"],
    ["原书习题 4", "8 个顺串首键 14 22 24 15 16 11 100 18，第二键 26 38 30 26 50 28 110 40：画 8 路败者树并重构一次。", "冠军 11（第 6 路）；该路换 28，只沿其叶到根重赛，下一冠军 **14**。"],
  ];
  ex.forEach((e, i) => {
    const y = 1.05 + i * 1.02;
    card(s, 0.5, y, 9.0, 0.92, i % 2 === 0 ? C.code : C.white, "D5DDD9");
    text(s, e[0], 0.65, y + 0.08, 1.3, 0.3, { fontSize: 10.5, bold: true, color: C.goldText, margin: 0 });
    text(s, e[1], 1.95, y + 0.06, 7.45, 0.42, { fontSize: 10.5, margin: 0 });
    text(s, "答：" + e[2], 1.95, y + 0.5, 7.45, 0.38, { fontSize: 10.5, color: C.green, margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["成本模型", "外存按页存取，一次 I/O 比一次比较贵几个数量级：外排序数的是**页 I/O**，不是比较次数。"],
    ["文件组织", "逻辑文件 vs 物理文件；顺序 / 散列 / 索引 / 倒排。读者顺序消费页，写者批量产生页。"],
    ["两阶段", "先生成**顺串**，再逐趟**归并**；趟数 `⌈log_k m⌉`——减小 m 或增大 k。"],
    ["置换选择", "最小堆 + **冻结**：`incoming >= emitted` 才进当前顺串；平均长约 **2M**（平均，不是保证）。"],
    ["选择树", "赢者树记胜者、败者树记败者另设冠军；替换只沿叶到根重赛，内部比较**与 k 无关**。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
