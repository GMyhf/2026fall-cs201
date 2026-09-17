// 第一章 ADT、Floyd/Dijkstra 与复杂度 —— 由 202609_DSA_01_ADT_Floyd_Complexity.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch01_adt_floyd_complexity.js ../202609_DSA_01_ADT_Floyd_Complexity.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_01_ADT_Floyd_Complexity.pptx");

// 讲义中引用的图片（name → url）；幻灯片里用 image(s, name, ...) 引用
const RAW = "https://raw.githubusercontent.com/GMyhf/";
const IMAGES = {
  "dsa-roadmap": RAW + "img/main/img/202402232017469.png",
  "dsa-mindmap": RAW + "img/main/img/fb96bc6ffdcf0b07190386d66d9e14ad.png",
  "fig-1-1": RAW + "img1/main/fig-1-1.png",
  "fig-1-5": RAW + "img1/main/fig-1-5.png",
};

(async () => {
  const D = createDeck({ title: "DSA 第一章 ADT、Floyd 与复杂度", imgDir: path.join(__dirname, "..", ".cache", "ch01") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

// 本章专用小助手：带边框的矩形（画不等宽的存储块用）
const box = (s, x, y, w, h, fill, line) =>
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line || C.green, width: 1 } });

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. 封面
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第一章  ADT 与复杂度",
  subtitle: "Week 1：抽象与建模 · Floyd / Dijkstra · 算法分析",
  topics: "问题抽象与建模 · 相邻矩阵 · Floyd 最短路 · 最小化最大距离\n逻辑结构 (K, r) 与线性 / 树形 / 图三分 · 顺序 / 链接 / 索引 / 散列四种存储映射\n抽象数据类型 (D, R, P) 与信息隐蔽 · 算法的四条性质 · 六种算法设计方法\n渐进分析与大 O / Ω / Θ · 最佳、最差与平均情况 · 时空折衷",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-17 · github.com/GMyhf/2026fall-cs201",
});

// 2. 本章三条主线
{
  const s = content("?", "本章导引", "三条主线：抽象、实现、评价");
  const qs = [
    ["现实问题怎么变成可计算的模型？", "五个经纪人传消息 → **有向带权图** → 相邻矩阵 → Floyd。**建模**是第一步。"],
    ["同一套逻辑关系，怎么在机器里落下来？", "逻辑结构 `(K, r)` 三分类；顺序 / 链接 / 索引 / 散列四种**存储映射**；ADT 把两层分开。"],
    ["两个算法摆在一起，凭什么说谁更好？", "渐进分析：大 **O** / **Ω** / **Θ**，最佳 / 最差 / 平均，以及**时空折衷**。"],
  ];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.55, C.code);
    numCircle(s, i + 1, x + 0.2, 1.32, 0.46, C.dark);
    text(s, q[0], x + 0.2, 1.92, 2.5, 0.7, { fontSize: 13.5, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], x + 0.2, 2.65, 2.5, 0.95, { fontSize: 11.5, margin: 0, lsm: 1.2 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "一句话概括", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "程序 = ", options: { color: C.white } },
    { text: "数据结构", options: { color: C.gold, bold: true } },
    { text: " + ", options: { color: C.white } },
    { text: "算法", options: { color: C.gold, bold: true } },
    { text: "（Wirth）。本章把这两个词分别讲清楚，并给出", options: { color: C.white } },
    { text: "评价", options: { color: C.gold, bold: true } },
    { text: "它们的尺子。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. 内容地图
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["1  数据结构与算法", ["1.1 数据结构：三件事分开看", "1.1.1 逻辑结构 (K, R)", "1.1.2 存储结构：四种映射", "1.1.3 抽象数据类型 (D, R, P)", "1.2 算法：概念、四条性质", "1.2.2 六种算法设计方法"]],
    ["2  问题求解", ["2.1 问题描述：股市的传言", "2.2 抽象成有向带权图", "相邻矩阵 + Floyd + 最小化最大距离", "RumorNetwork 实现导读", "2.3 练习 OJ05443 兔子与樱花", "Floyd / Dijkstra，C++ 与 Python"]],
    ["3  算法分析", ["3.1 渐进分析：大 O / Ω / Θ", "常见量级与增长趋势", "渐进分析三个实例", "3.2 最佳、最差、平均情况", "3.3 时间和空间的折衷", "3.4 数据结构的选择与评价"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 0 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 2.5, 0.45, { fontSize: 17, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 2.6, 3.0, { fontSize: 11.5, gap: 8 });
  });
}

// ============================ PART 1 ============================
sectionSlide("Part 1", "数据结构与算法", "DSA = Data Structures and Algorithms\n逻辑结构 · 存储结构 · 运算 · 抽象数据类型 · 算法设计方法");

// 4. DSA 是什么
{
  const s = content("1", "1 数据结构与算法", "DSA：两个独立又紧密关联的领域");
  card(s, 0.5, 1.05, 4.5, 2.4, C.code);
  image(s, "dsa-roadmap", 0.6, 1.15, 4.3, 2.2);
  callout(s, "What is Data Structure?", "一种**特定的存储和组织数据的方式**，为了在设备里高效地管理和利用数据。核心理念是**最小化时间和空间复杂度**：占用尽可能少的内存、用尽可能短的时间完成数据操作。", 0.5, 3.6, 4.5, 1.5, { fontSize: 11 });
  callout(s, "What is Algorithm?", "为解决特定类型的问题、或执行某种特定计算而设计的**一系列明确定义的步骤**——一组按部就班的操作。", 5.2, 1.05, 4.3, 1.35, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  text(s, "怎么开始学 DSA？四个阶段", 5.2, 2.6, 4.3, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const steps = ["理解**时间和空间复杂度**：评估效率的关键概念", "学习各**数据结构**的基础：特点与使用场景", "掌握**算法**的基础知识：工作原理及应用", "**练习题目**：通过实践巩固，提高解决问题的能力"];
  steps.forEach((t, i) => {
    const y = 2.98 + i * 0.52;
    numCircle(s, i + 1, 5.2, y + 0.05, 0.36, i === 0 ? C.gold : C.green);
    text(s, t, 5.68, y, 3.8, 0.46, { fontSize: 11, valign: "middle", margin: 0 });
  });
}

// 5. ADS 前序课程提示
{
  const s = content("⚠", "1 数据结构与算法 · 重要提示", "算法是前序《计算概论》(ADS) 的核心内容");
  card(s, 0.5, 1.05, 4.3, 1.5, C.cream);
  text(s, "ADS 课程涵盖四类关键算法", 0.68, 1.13, 4, 0.3, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  [["贪心 Greedy", C.green], ["递归 / 回溯", C.bad], ["动态规划 DP", C.goldText], ["搜索 Searching", C.dark]].forEach((p, i) => {
    pill(s, p[0], 0.7 + (i % 2) * 2.0, 1.52 + Math.floor(i / 2) * 0.48, 1.85, 0.38, p[1], C.white, 10.5);
  });
  text(s, "如果你在递归类题目上练习不足，建议针对性地多做相关题目。", 0.68, 2.62, 4.3, 0.4, { fontSize: 10.5, color: C.muted, margin: 0 });
  callout(s, "学习建议 1 · 递归（Recursion）", "算法设计中的**核心基础技能**，建议优先掌握。\n参考：递归、回溯、并查集（2025fall-cs101 week08–09）", 0.5, 3.1, 4.3, 0.95, { fontSize: 10.5 });
  callout(s, "学习建议 2 · 队列与广度优先搜索（BFS）", "队列在 BFS 中有广泛应用。参考：搜索专题（2025fall-cs101 week12）", 0.5, 4.15, 4.3, 0.9, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  card(s, 5.1, 1.05, 4.4, 2.35, C.code);
  image(s, "dsa-mindmap", 5.2, 1.15, 4.2, 2.15);
  text(s, "学习建议 3 · 其他常用算法技巧", 5.1, 3.5, 4.4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  ["双指针（链表「快慢指针」重点）", "单调栈", "二分查找", "并查集", "滑动窗口", "懒删除 Lazy Deletion"].forEach((t, i) => {
    pill(s, t, 5.15 + (i % 2) * 2.2, 3.76 + Math.floor(i / 2) * 0.375, 2.1, 0.32, i % 2 ? C.dark : C.green, C.white, 9.5);
  });
  text(s, "多数技巧 1～2 道典型题即可理解原理，熟练仍需持续练习。", 5.1, 4.9, 4.4, 0.25, { fontSize: 8, color: C.muted, margin: 0 });
}

// 6. 1.1 数据结构：三件事分开看
{
  const s = content("1.1", "1 数据结构与算法 · 数据结构", "数据结构：三件事要分开看");
  text(s, "数据结构描述的是：按一定逻辑关系组织起来的数据，它们在计算机里怎么存放，以及定义在其上的运算。", 0.5, 1.05, 9, 0.35, { fontSize: 12.5 });
  const three = [
    ["逻辑结构", "有哪些结点、结点之间是什么关系", "不谈占几个字节。1.1 节经纪人之间的传播路径就是一个**有向图**。", C.dark],
    ["存储结构", "同一套逻辑关系，在存储器里怎么落下来", "顺序、链接、索引、散列四种基本映射方法。", C.green],
    ["运算", "定义在这套数据上的操作", "选存储方法时必须**同时考虑运算**：要不要随机访问？会不会频繁插入？", C.goldText],
  ];
  three.forEach((t, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.55, 2.85, 2.5, C.code);
    pill(s, t[0], x + 0.2, 1.72, 1.5, 0.4, t[3], C.white, 13);
    text(s, t[1], x + 0.2, 2.25, 2.5, 0.6, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, t[2], x + 0.2, 2.9, 2.5, 1.05, { fontSize: 11, margin: 0, lsm: 1.15 });
  });
  callout(s, "为什么要分开", "三层混在一起谈，讨论就会跑偏：「数组还是链表」是**存储**问题，「先进先出」是**逻辑 + 运算**问题。分开之后，同一个逻辑结构可以换存储实现，同一种存储可以支撑不同运算——这正是后面各章的展开方式。", 0.5, 4.2, 9.0, 0.9, { fontSize: 11.5 });
}

// 7. 1.1.1 逻辑结构 (K, R)
{
  const s = content("1.1.1", "1 数据结构与算法 · 数据的逻辑结构", "逻辑结构：二元组 B = (K, R)");
  bullets(s, [
    "**K** 是数据**结点**（node）组成的**有穷集合**，每个结点代表一个数据或一组有明确结构的数据。",
    "**R** 是定义在 K 上的一组**二元关系**。本书 R 一般只含一个关系 r，此时记作 **(K, r)**。",
    "若 ⟨k, k′⟩ ∈ r，则 k 是 k′ 的**前驱**，k′ 是 k 的**后继**。",
    "没有前驱的结点叫**开始结点**，没有后继的结点叫**终止结点**。",
  ], 0.5, 1.1, 5.3, 2.1, { fontSize: 12.5, gap: 9 });
  callout(s, "结点的类型：通常当作黑盒", "结点类型既可以是基本类型（整数、实数、布尔、字符、指针），也可以是复合类型（数组、结构、对象），而复合类型又能参与定义更复杂的结点类型。**数据结构课关心结点之间的关系**，所以通常把结点当作黑盒。", 0.5, 3.3, 5.3, 1.75, { fontSize: 11 });
  // 教学计划示例
  card(s, 6.05, 1.1, 3.45, 3.95, C.code);
  text(s, "例：教学计划", 6.2, 1.18, 3, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "每门必修课是一个结点，全部必修课组成 K；「必须先修」是 K 上的一个关系。", 6.2, 1.5, 3.15, 0.65, { fontSize: 10.5, margin: 0 });
  pill(s, "程序设计", 6.35, 2.25, 1.35, 0.4, C.dark, C.gold, 11);
  pill(s, "数据结构", 8.0, 2.25, 1.35, 0.4, C.green, C.white, 11);
  s.addShape(pres.shapes.LINE, { x: 7.72, y: 2.45, w: 0.26, h: 0, line: { color: C.goldText, width: 2, endArrowType: "triangle" } });
  text(s, "⟨程序设计, 数据结构⟩ ∈ r", 6.2, 2.75, 3.15, 0.28, { fontSize: 10, fontFace: MONO, color: C.goldText, margin: 0 });
  text(s, "表示必须先上程序设计。", 6.2, 3.05, 3.15, 0.28, { fontSize: 10.5, margin: 0 });
  pill(s, "开始结点 = 没有先修约束", 6.2, 3.45, 3.15, 0.36, C.mint, C.dark, 10);
  text(s, "没有先修约束的课可以**并行开设**。", 6.2, 3.95, 3.15, 0.35, { fontSize: 10.5, margin: 0 });
  text(s, "「结点 + 关系」就是全部——这一层不出现任何字节数、地址、指针。", 6.2, 4.4, 3.15, 0.6, { fontSize: 10, color: C.muted, margin: 0 });
}

// 8. 结构的三种分类
{
  const s = content("1.1.1", "1 数据结构与算法 · 数据的逻辑结构", "结构的分类：以关系 r 的性质为准");
  table(s, [
    ["结构", "前驱", "后继", "本书在哪几章"],
    [{ t: "**线性结构**" }, "至多 1 个", "至多 1 个", "线性表、栈、队列、串（第 2–4 章）"],
    [{ t: "**树形结构**" }, "根无前驱，其余恰好 1 个", { t: "**不限**" }, "二叉树、树、B 树（第 5、6、11 章）"],
    [{ t: "**图结构**" }, { t: "**不限**" }, { t: "**不限**" }, "最短路、最小生成树（第 7 章）"],
  ], 0.5, 1.05, 9.0, [1.5, 2.5, 1.4, 3.6], { fontSize: 11.5, rowH: 0.42 });
  // 三种结构示意图
  const drawLine = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1, line: { color: C.green, width: 1.2 } });
  const dot = (x, y, fill) => s.addShape(pres.shapes.OVAL, { x, y, w: 0.26, h: 0.26, fill: { color: fill || C.green }, line: { type: "none" } });
  card(s, 0.5, 2.75, 2.85, 1.55, C.code);
  text(s, "线性", 0.65, 2.82, 1, 0.28, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  [0, 1, 2, 3].forEach((i) => dot(0.85 + i * 0.55, 3.45, i === 0 ? C.gold : C.green));
  [0, 1, 2].forEach((i) => drawLine(1.11 + i * 0.55, 3.58, 1.4 + i * 0.55, 3.58));
  text(s, "唯一开始结点、唯一终止结点，其余都是「一前一后」的内部结点", 0.65, 3.85, 2.5, 0.4, { fontSize: 9, color: C.muted, margin: 0 });
  card(s, 3.55, 2.75, 2.85, 1.55, C.code);
  text(s, "树形", 3.7, 2.82, 1, 0.28, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  dot(4.85, 3.14, C.gold); dot(4.3, 3.66); dot(5.4, 3.66); dot(3.95, 3.66);
  drawLine(4.98, 3.40, 4.43, 3.66); drawLine(4.98, 3.40, 5.53, 3.66); drawLine(4.98, 3.40, 4.08, 3.66);
  text(s, "有且仅有一个结点（树根）没有前驱；根到任一结点有唯一路径。UNIX / DOS 文件系统就是树", 3.7, 4.02, 2.6, 0.3, { fontSize: 7.5, color: C.muted, margin: 0 });
  card(s, 6.6, 2.75, 2.9, 1.55, C.code);
  text(s, "图", 6.75, 2.82, 1, 0.28, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  dot(7.1, 3.25); dot(8.2, 3.25); dot(7.1, 3.85); dot(8.2, 3.85);
  drawLine(7.36, 3.38, 8.2, 3.38); drawLine(7.23, 3.51, 7.23, 3.85); drawLine(7.36, 3.98, 8.2, 3.98); drawLine(8.33, 3.51, 8.33, 3.85);
  drawLine(7.36, 3.51, 8.2, 3.85);
  text(s, "前驱后继都不限", 8.6, 3.5, 0.85, 0.5, { fontSize: 9, color: C.muted, margin: 0 });
  card(s, 0.5, 4.38, 9.0, 0.72, C.dark);
  s.addText(runs("**树 vs 图**的分界：每个结点是否**仅从属于一个直接前驱**。　　**线性 vs 树**的分界：每个结点是否**仅有一个直接后继**。", { color: C.white, boldColor: C.gold }), { x: 0.7, y: 4.38, w: 8.6, h: 0.72, fontFace: FONT, fontSize: 11.5, valign: "middle", margin: 0, isTextBox: true });
}

// 9. 1.1.2 存储结构：映射
{
  const s = content("1.1.2", "1 数据结构与算法 · 数据的存储结构", "存储结构：从 (K, r) 到物理空间的映射");
  bullets(s, [
    "主存按字节编址，相邻单元地址连续，**可以按地址随机访问，访问不同地址的时间基本相同**。",
    "每个结点 k ∈ K → 一块**唯一的连续存储区域**；",
    "每个关系元组 ⟨kᵢ, kⱼ⟩ ∈ r → **存储单元地址之间的关系**（顺序关系，或指针的地址指向关系）。",
    "**同一种逻辑结构可以采用不同的映射**：线性结构既能顺序存储成顺序表，也能链接存储成链表。",
  ], 0.5, 1.1, 5.2, 2.3, { fontSize: 12.5, gap: 9 });
  // 映射示意
  card(s, 5.9, 1.1, 3.6, 2.3, C.code);
  text(s, "逻辑结构 (K, r)", 6.05, 1.2, 1.6, 0.28, { fontSize: 10, bold: true, color: C.dark, margin: 0 });
  [0, 1, 2].forEach((i) => {
    s.addShape(pres.shapes.OVAL, { x: 6.1 + i * 0.5, y: 1.55, w: 0.3, h: 0.3, fill: { color: C.green }, line: { type: "none" } });
  });
  s.addShape(pres.shapes.LINE, { x: 6.4, y: 1.7, w: 0.2, h: 0, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: 6.9, y: 1.7, w: 0.2, h: 0, line: { color: C.green, width: 1.2, endArrowType: "triangle" } });
  text(s, "映射", 7.95, 1.52, 1.4, 0.3, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 7.1, y: 2.15, w: 1.4, h: 0, line: { color: C.goldText, width: 2, endArrowType: "triangle" } });
  text(s, "物理存储空间", 6.05, 2.35, 2, 0.28, { fontSize: 10, bold: true, color: C.dark, margin: 0 });
  cells(s, 6.1, 2.65, ["", "", "", "", ""], { cw: 0.44, ch: 0.38, fills: [C.mint, C.mint, C.mint, C.white, C.white] });
  text(s, "地址连续 → 可随机访问", 8.4, 2.68, 1.05, 0.5, { fontSize: 8.5, color: C.muted, margin: 0 });
  // 四种方法
  text(s, "常用的四种基本存储方法", 0.5, 3.55, 5, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  [["1 顺序方法", "地址相邻，用自然顺序表达关系", C.dark], ["2 链接方法", "结点里附指针域存后继地址", C.green], ["3 索引方法", "索引函数 Y : Z → D，另建索引表", C.goldText], ["4 散列方法", "用散列函数把关键码算成地址", C.bad]].forEach((m, i) => {
    const x = 0.5 + (i % 4) * 2.3;
    card(s, x, 3.92, 2.15, 1.15, C.code);
    pill(s, m[0], x + 0.12, 4.03, 1.5, 0.34, m[2], C.white, 10);
    text(s, m[1], x + 0.12, 4.45, 1.9, 0.55, { fontSize: 9.5, margin: 0 });
  });
}

// 10. 顺序方法
{
  const s = content("1.1.2", "1 数据结构与算法 · 存储方法 1", "顺序方法：紧凑存储，按下标访问 O(1)");
  bullets(s, [
    "把一组结点存放在一片**地址相邻**的存储单元中，结点间的逻辑关系用存储单元的**自然顺序**表达。",
    "按下标访问因此是 **O(1)**；程序设计语言里的**数组**就是它的实例。",
    "顺序存储结构通常也称**紧凑存储结构**：存储空间除数据本身外**没有附加信息**。",
  ], 0.5, 1.1, 5.4, 1.65, { fontSize: 12.5, gap: 9 });
  card(s, 0.5, 2.85, 5.4, 1.0, C.dark);
  text(s, "存储密度", 0.7, 2.95, 2, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "数据本身占用的空间 ÷ 整个结构（含附加信息）占用的空间。密度太小，空间效率就低。", 0.7, 3.25, 5.0, 0.55, { fontSize: 11.5, color: C.white, margin: 0 });
  callout(s, "非线性结构也能顺序存储", "前提是**同时存一些附加信息**来表示逻辑关系。完全二叉树按层编号后，孩子下标可以直接算出来——不必存指针。", 0.5, 3.95, 5.4, 1.1, { fontSize: 11 });
  // 完全二叉树编号示意
  card(s, 6.1, 1.1, 3.4, 3.95, C.code);
  text(s, "完全二叉树按层编号", 6.25, 1.18, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const tnode = (label, x, y, fill) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color: fill || C.mint }, line: { color: C.green, width: 1 } });
    text(s, label, x, y, 0.42, 0.42, { fontSize: 11, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
  };
  tnode("0", 7.6, 1.55, C.gold);
  tnode("1", 6.95, 2.2); tnode("2", 8.25, 2.2);
  tnode("3", 6.55, 2.85); tnode("4", 7.35, 2.85);
  const tline = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: y1, w: Math.abs(x2 - x1), h: y2 - y1, flipH: x2 < x1, line: { color: C.green, width: 1 } });
  tline(7.81, 1.97, 7.16, 2.2); tline(7.81, 1.97, 8.46, 2.2);
  tline(7.16, 2.62, 6.76, 2.85); tline(7.16, 2.62, 7.56, 2.85);
  text(s, "左孩子 = 2i + 1　　右孩子 = 2i + 2", 6.25, 3.4, 3.1, 0.3, { fontSize: 11.5, bold: true, fontFace: MONO, color: C.goldText, margin: 0 });
  cells(s, 6.35, 3.8, [0, 1, 2, 3, 4, ""], { cw: 0.47, ch: 0.4, fs: 11, idx: true });
  text(s, "结点直接按编号放进数组，指针一个都不用存", 6.25, 4.5, 3.1, 0.5, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// 11. 链接方法
{
  const s = content("1.1.2", "1 数据结构与算法 · 存储方法 2", "链接方法：每个结点附一个指针域");
  // 链表示意
  const y0 = 1.15;
  ["a₁", "a₂", "a₃"].forEach((v, i) => {
    const x = 1.15 + i * 1.75;
    box(s, x, y0, 0.7, 0.5, C.mint);
    box(s, x + 0.7, y0, 0.45, 0.5, C.white);
    text(s, v, x, y0, 0.7, 0.5, { fontSize: 12, bold: true, align: "center", valign: "middle", margin: 0 });
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 1.15, y: y0 + 0.25, w: 0.6, h: 0, line: { color: C.green, width: 1.5, endArrowType: "triangle" } });
    else text(s, "∧", x + 0.7, y0, 0.45, 0.5, { fontSize: 11, align: "center", valign: "middle", margin: 0 });
  });
  text(s, "数据域", 1.15, y0 + 0.55, 0.7, 0.25, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
  text(s, "指针域", 1.85, y0 + 0.55, 0.45, 0.25, { fontSize: 9, color: C.goldText, align: "center", margin: 0 });
  pill(s, "结点 = 数据域 + 指针域", 5.9, y0 + 0.07, 2.3, 0.36, C.dark, C.gold, 10.5);
  bullets(s, [
    "每个结点里附一个（或多个）**指针域**，专门存放后继的地址。",
    "适合**经常增删、长度事先不知道**的结构：不需要一整片连续空间。",
    "代价：**不知道指针时只能从链头一个一个比下去，按位置访问不再是 O(1)**。",
  ], 0.5, 2.05, 5.4, 1.6, { fontSize: 12.5, gap: 9 });
  callout(s, "顺序 vs 链接：一句话对比", [
    "顺序：**紧凑**，无附加信息，随机访问 O(1)，但长度要先说清。",
    "链接：**有附加指针**（结构性开销），随机访问退化成 O(n)，但增删灵活、不会「满」。",
    "第 2 章会把这两种实现写出来逐条对比。",
  ], 0.5, 3.8, 5.4, 1.3, { fontSize: 10.5, gap: 3 });
  card(s, 6.1, 2.05, 3.4, 3.05, C.code);
  text(s, "按位置访问的代价", 6.25, 2.13, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["运算", "顺序", "链接"],
    [{ t: "取第 i 个", bold: true }, { t: "O(1)", mono: true, color: C.ok, bold: true }, { t: "O(n)", mono: true, color: C.bad, bold: true }],
    [{ t: "已知位置插入", bold: true }, { t: "O(n)", mono: true, color: C.bad, bold: true }, { t: "O(1)", mono: true, color: C.ok, bold: true }],
    [{ t: "长度可变", bold: true }, "要扩容", { t: "天然支持", color: C.ok }],
    [{ t: "附加空间", bold: true }, "无", "每结点 1 指针"],
  ], 6.25, 2.5, 3.1, [1.15, 0.95, 1.0], { fontSize: 10, rowH: 0.42 });
  text(s, "「按位置访问」与「按内容检索」是两回事，第 2 章分别给出实现与代价。", 6.25, 4.7, 3.1, 0.35, { fontSize: 9, color: C.muted, margin: 0 });
}

// 12. 索引方法：图
{
  const s = content("1.1.2", "1 数据结构与算法 · 存储方法 3", "索引方法：索引函数 Y : Z → D");
  text(s, "顺序存储的一种推广：造一个从整数域 Z 到存储地址域 D 的索引函数，形成一张存了一组指针的**索引表**。索引表的存储空间是**附加在结点存储空间之外**的。", 0.5, 1.02, 9, 0.5, { fontSize: 12 });
  // 存储区（不等宽）
  text(s, "存储区的数据 —— 物理无序，而且每块长度不等", 0.5, 1.58, 6, 0.28, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  const blocks = [["[1] 73", 1.75], ["[2] 52", 1.15], ["[3] 42", 1.45], ["[4] 98", 1.9], ["[5] 37", 1.0]];
  let bx = 0.5;
  blocks.forEach((b, i) => {
    box(s, bx, 1.9, b[1], 0.5, i === 1 ? "F9D5D0" : C.white, C.dark);
    text(s, b[0], bx, 1.9, b[1], 0.5, { fontSize: 11, bold: true, fontFace: MONO, color: i === 1 ? C.bad : C.text, align: "center", valign: "middle", margin: 0 });
    bx += b[1];
  });
  text(s, "五块长度各不相同 →「第 k 块在哪」没法用「起始地址 + k × 块长」算出来", 0.5, 2.45, 7.3, 0.28, { fontSize: 9.5, color: C.muted, margin: 0 });
  // 索引表
  text(s, "线性索引 —— 附加在数据之外的一张小表", 0.5, 2.85, 6, 0.28, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  const keys = [37, 42, 52, 73, 98], ptrs = ["[5]", "[3]", "[2]", "[1]", "[4]"];
  keys.forEach((k, i) => {
    const x = 0.5 + i * 1.1;
    box(s, x, 3.18, 1.1, 0.42, i === 2 ? C.gold : C.mint, C.dark);
    text(s, String(k), x, 3.18, 1.1, 0.42, { fontSize: 11.5, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    box(s, x, 3.6, 1.1, 0.42, i === 2 ? C.cream : C.white, C.dark);
    text(s, ptrs[i], x, 3.6, 1.1, 0.42, { fontSize: 11, bold: true, fontFace: MONO, color: i === 2 ? C.bad : C.text, align: "center", valign: "middle", margin: 0 });
  });
  text(s, "关键码：升序 → 逻辑有序，可以二分", 6.15, 3.18, 3.3, 0.42, { fontSize: 10, color: C.goldText, bold: true, valign: "middle", margin: 0 });
  text(s, "指向第几块：乱序 → 物理一块都没搬过", 6.15, 3.6, 3.3, 0.42, { fontSize: 10, color: C.green, bold: true, valign: "middle", margin: 0 });
  card(s, 0.5, 4.2, 9.0, 0.9, C.dark);
  text(s, "这两行的错位就是索引的全部意义", 0.7, 4.28, 4, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "要找关键码 52：先在索引里二分定位到第 3 列，读出 [2]，再直接去存储区取第 2 块——只读一块，没扫其余四块。", 0.7, 4.57, 8.6, 0.48, { fontSize: 11, color: C.white, margin: 0 });
}

// 13. 索引的代价 + 散列方法
{
  const s = content("1.1.2", "1 数据结构与算法 · 存储方法 3–4", "索引的代价，以及散列方法");
  card(s, 0.5, 1.05, 4.35, 2.0, C.code);
  text(s, "索引：主要作用是提高检索效率", 0.7, 1.13, 4, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "数据量很大时检索会涉及**大量磁盘读写**；先用索引确定存储地址再读写，可以大幅降低读写的数据量。",
    "索引函数一般**不是**数组那样的简单线性函数——结点长度不等时它就不可能是线性的。",
  ], 0.7, 1.5, 4.0, 1.45, { fontSize: 11, gap: 6 });
  callout(s, "代价：索引表本身的空间", "这正是 **3.3 节的时空折衷**：多花一张表的空间，换来检索时间从「逐块扫描」降到「二分 + 一次读」。", 0.5, 3.15, 4.35, 1.1, { fontSize: 11 });
  card(s, 5.15, 1.05, 4.35, 2.0, C.code);
  text(s, "4  散列方法：不查表，直接算", 5.35, 1.13, 4, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "索引法的延伸：用**散列函数**把关键码的值直接**算**成存储地址。",
    "散列函数应尽可能把地址**均匀分布**在散列表的地址空间上，同时**计算要简单**以便提速。",
    "冲突怎么处理、装载因子多高会退化——第 10 章展开。",
  ], 5.35, 1.5, 4.0, 1.45, { fontSize: 11, gap: 5 });
  // 散列示意
  card(s, 5.15, 3.15, 4.35, 1.1, C.dark);
  pill(s, "关键码 52", 5.35, 3.45, 1.35, 0.4, C.gold, C.dark, 11);
  text(s, "h(52)", 6.85, 3.47, 0.8, 0.36, { fontSize: 11, bold: true, fontFace: MONO, color: C.gold, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 6.75, y: 3.65, w: 0.95, h: 0, line: { color: C.gold, width: 2, endArrowType: "triangle" } });
  pill(s, "地址 3", 7.8, 3.45, 1.35, 0.4, C.mint, C.dark, 11);
  text(s, "一次计算，不比较、不查表", 5.35, 3.9, 4.0, 0.3, { fontSize: 10, color: C.mint, margin: 0 });
  callout(s, "实际应用往往是几种方法的组合", "例如树形结构的「子结点表」表示法就是**顺序 + 链接**。选存储方法时还要综合考虑定义在其上的运算：**要不要随机访问、会不会频繁插入、数据在内存还是外存。**", 0.5, 4.35, 9.0, 0.75, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 14. 1.1.3 ADT
{
  const s = content("1.1.3", "1 数据结构与算法 · 抽象数据类型", "ADT：抽象意味着同一个概念可以有多种具体实现");
  bullets(s, [
    "一旦抽象模型建立，同类问题便**无需反复从零造轮子**。",
    "ADT 是一个**「由数据及其相关操作构成的抽象模型」**：把数据与操作捆绑在一起；",
    "使用方**仅能**通过公开操作访问数据，**不能也不必**窥探其内部表示。",
    "面对某种结构时，先跳出「它是数组还是链表」，转而聚焦：**它对外提供哪些操作？这些操作满足怎样的约束与契约？**",
    "最简单的 ADT：**整数及其加、减、乘、除运算**。",
  ], 0.5, 1.1, 5.3, 2.85, { fontSize: 12, gap: 8 });
  callout(s, "ADT 思想是逐步形成的", "20 世纪 60 年代后期，为了把算法细节与底层数据结构隔离，**Simula 67 引入了「类」**；随后演进出「模块」：**模块接口**导出外部可见的运算规范，**模块体**封装私有数据与实现。唯有**接口与实现分离**，用户才能真正定义独立的类型，达成**数据抽象**与**信息隐藏**。", 0.5, 4.05, 5.3, 1.05, { fontSize: 10.5 });
  card(s, 6.05, 1.1, 3.45, 4.0, C.code);
  text(s, "形式化表示：三元组 (D, R, P)", 6.2, 1.18, 3.2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, `ADT 抽象数据类型名 {
    数据对象 D：
        数据元素是什么
    数据关系 R：
        元素之间的逻辑关系
    基本操作 P：
        对外提供哪些运算规范
}`, 6.2, 1.5, 3.15, 1.85, { fontSize: 9, lang: "text" });
  pill(s, "D 与 R = 数据抽象", 6.25, 3.5, 3.05, 0.4, C.green, C.white, 11);
  text(s, "刻画数据模型的骨干", 6.25, 3.93, 3.05, 0.26, { fontSize: 9.5, color: C.muted, margin: 0 });
  pill(s, "P = 行为（操作）抽象", 6.25, 4.25, 3.05, 0.4, C.goldText, C.white, 11);
  text(s, "规定该模型能执行的行为", 6.25, 4.68, 3.05, 0.26, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// 15. 概念层 vs 实现层
{
  const s = content("1.1.3", "1 数据结构与算法 · 抽象数据类型", "概念层 vs 实现层：切勿混淆两者的层次");
  card(s, 0.5, 1.1, 4.35, 2.4, C.cream);
  pill(s, "概念层（ADT）", 0.7, 1.25, 2.0, 0.42, C.goldText, C.white, 12);
  text(s, "解决此问题需要**什么数据关系与运算契约**？", 0.7, 1.8, 4.0, 0.45, { fontSize: 12.5, margin: 0 });
  text(s, "在 C++ 里用**公有接口声明**来刻画契约。", 0.7, 2.3, 4.0, 0.4, { fontSize: 11.5, margin: 0 });
  codeBlock(s, `class Stack {
public:
    void push(const T&);
    std::optional<T> pop();
};`, 0.7, 2.7, 3.95, 0.7, { fontSize: 9 });
  card(s, 5.15, 1.1, 4.35, 2.4, "EAF4EF");
  pill(s, "实现层（类与存储结构）", 5.35, 1.25, 2.6, 0.42, C.green, C.white, 12);
  text(s, "这些数据在内存中**如何布局**，算法**如何具体编码**？", 5.35, 1.8, 4.0, 0.45, { fontSize: 12.5, margin: 0 });
  text(s, "在 C++ 里用**私有成员与函数体实现**来落地。", 5.35, 2.3, 4.0, 0.4, { fontSize: 11.5, margin: 0 });
  codeBlock(s, `private:
    T* data_;          // 顺序：连续数组
    // 或 Node* top_;  // 链接：结点串联`, 5.35, 2.7, 3.95, 0.7, { fontSize: 9 });
  card(s, 0.5, 3.65, 9.0, 0.85, C.dark);
  text(s, "ADT 最精炼的定义", 0.7, 3.72, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "一种数据的逻辑结构，连同定义在该逻辑结构上的一组抽象操作。", 0.7, 4.0, 8.6, 0.42, { fontSize: 16, bold: true, color: C.white, margin: 0 });
  text(s, "同一个 ADT 可以有多个实现层的版本（顺序 / 链接）；换实现不应该影响调用方——这正是第 2–4 章反复出现的结构。", 0.5, 4.62, 9.0, 0.45, { fontSize: 10.5, color: C.muted });
}

// 16. 1.2 算法：历史与分类
{
  const s = content("1.2", "1 数据结构与算法 · 算法", "算法：从《周髀算经》到图灵机");
  const tl = [
    ["公元前 300 多年", "算法的研究可追溯至此；中文名称出自**《周髀算经》**"],
    ["9 世纪", "英文 algorithm 源于波斯数学家 **al-Khwarizmi**，他首先在数学上提出算法概念"],
    ["1842 年", "**Ada Byron** 为巴贝奇分析机编写求解伯努利方程的程序——被认为是世界第一位程序员；因分析机未完成，该算法始终没能在机器上执行"],
    ["20 世纪", "**图灵**提出图灵论题与图灵机抽象模型，**解决了算法定义的难题**，使大多数算法都能转成程序交给计算机执行"],
    ["20 世纪 70 年代", "**D. E. Knuth**：计算机科学就是研究算法的学问"],
  ];
  tl.forEach((t, i) => {
    const y = 1.05 + i * 0.74;
    numCircle(s, i + 1, 0.5, y + 0.1, 0.42, i === 3 ? C.gold : C.green);
    text(s, t[0], 1.05, y, 1.7, 0.6, { fontSize: 11.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, t[1], 2.8, y, 4.05, 0.68, { fontSize: 11, valign: "middle", margin: 0 });
  });
  callout(s, "算法的分类", [
    "按**应用范围**：数值算法 / 非数值算法",
    "按**工作方式**：串行算法 / 并行算法",
    "本书后面各章几乎都是**非数值的、串行的**算法。",
  ], 7.05, 1.05, 2.45, 1.75, { fontSize: 11 });
  callout(s, "算法与程序", "算法是对特定问题**求解过程的描述**，是指令的有限序列；**程序是算法的一种实现**，计算机按照程序逐步执行算法。", 7.05, 3.0, 2.45, 1.4, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "典型例子：求最大公因子的辗转相除法、求解联立线性方程组的主元素消除法。", 7.05, 4.55, 2.45, 0.55, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// 17. 算法的四条性质
{
  const s = content("1.2.1", "1 数据结构与算法 · 算法的概念", "算法的四条性质");
  const props = [
    ["通用性", "对**任意**符合输入数据类型的输入，都能求解并保证结果正确——**不是只对一组样例成立**。", C.dark],
    ["有效性", "由**有限条**指令组成，每条都能被人或机器**确切执行**，且执行结果具有**确定的数据类型**、是可预期的。", C.green],
    ["确定性", "每执行一步之后，关于**下一步怎么执行**都有明确指示：条件判断、分支、顺序执行，或指示算法结束。不能「被锁住」或含模糊指令。", C.goldText],
    ["有穷性", "执行必须在**有限步内结束**，不能含死循环。", C.bad],
  ];
  props.forEach((p, i) => {
    const x = 0.5 + (i % 2) * 4.65, y = 1.1 + Math.floor(i / 2) * 1.5;
    card(s, x, y, 4.35, 1.35, C.code);
    numCircle(s, i + 1, x + 0.18, y + 0.15, 0.44, p[2]);
    text(s, p[0], x + 0.75, y + 0.15, 2.0, 0.42, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    text(s, p[1], x + 0.18, y + 0.6, 4.0, 0.68, { fontSize: 11, margin: 0, lsm: 1.15 });
  });
  card(s, 0.5, 4.15, 9.0, 0.95, "FDF0EE");
  text(s, "⚠ 一个容易混淆的地方", 0.7, 4.22, 4, 0.3, { fontSize: 11.5, bold: true, color: C.bad, margin: 0 });
  s.addText(runs("**算法由有限条指令组成这一事实本身，并不能保证算法执行的有穷性**——循环条件写错，有限条指令也可以转个没完。设计算法时应该关注**结束条件**。", { color: C.text, boldColor: C.bad }), { x: 0.7, y: 4.5, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 12, margin: 0, isTextBox: true });
}

// 18. 六种算法设计方法
{
  const s = content("1.2.2", "1 数据结构与算法 · 算法设计", "六种常用的算法设计方法");
  table(s, [
    ["方法", "要点", "在哪儿用"],
    [{ t: "**穷举法** enumeration" }, "把问题空间里的求解对象一一列举、逐一分析处理并验证。要求对象有限、有列举规则", { t: "`switch` 就是一种穷举" }],
    [{ t: "**回溯法** backtrack" }, "按某种顺序逐一枚举并检验候选解。当前候选解不可能是解时**回溯**到上一步；还不够规模但其余条件都满足时**向前试探**", "深度优先搜索、背包问题"],
    [{ t: "**分治法** divide and conquer" }, "把大问题分割成规模较小的子问题，各个击破，再合并出整个问题的解。**自顶向下**", "快速排序、归并排序、二分检索"],
    [{ t: "**递归法** recursion" }, "分治产生的子问题往往是原问题的较小模式，反复分治自然导致递归。**分治与递归如同一对孪生兄弟**", "同上"],
    [{ t: "**贪心法** greedy" }, "从初始状态出发，依据某种**贪心标准**做若干次贪心选择。只考虑局部最优，寄望于拼出全局最优", "Prim、Kruskal、Dijkstra"],
    [{ t: "**动态规划** DP" }, "也把问题分解成子问题，但**子问题不相互独立**。用一张表记录已解子问题的答案，避免大量重复计算", "Floyd、最佳二叉搜索树"],
  ], 0.5, 1.02, 9.0, [2.0, 5.1, 1.9], { fontSize: 9.5, rowH: 0.49, tight: true });
  text(s, "可以选择和组合这些基本方法：算法的组合 · 经典算法的变形与推广 · 研究困难问题的特殊情况 · 探索新的算法。", 0.5, 4.8, 9.0, 0.3, { fontSize: 10, color: C.muted });
}

// 19. 三条要点
{
  const s = content("1.2.2", "1 数据结构与算法 · 算法设计", "三条值得记住的要点");
  const items = [
    ["全局穷举费时，局部穷举常常很有效", "对整个问题空间做全局穷举往往效率难以满足要求；但**在问题的局部采用穷举**常常很有效。C/C++ 的 `switch` 就是一种穷举。", C.dark],
    ["贪心法的核心问题：选对度量标准", "贪心只做**局部最优**的选择，寄望于由局部最优构建全局最优。**选择一个真能产生问题最优解的最优度量标准**，是使用贪心法的核心问题。", C.goldText],
    ["动态规划 vs 分治：子问题是否独立", "适合 DP 的问题，分解出的子问题**往往不相互独立**。若仍用分治，同一个子问题会被**重复计算很多次**；把已解子问题的答案填进一张表，就能避免重复计算。", C.green],
  ];
  items.forEach((it, i) => {
    const y = 1.15 + i * 1.3;
    card(s, 0.5, y, 9.0, 1.15, C.code);
    numCircle(s, i + 1, 0.72, y + 0.33, 0.5, it[2]);
    text(s, it[0], 1.45, y + 0.12, 7.8, 0.35, { fontSize: 14.5, bold: true, color: C.dark, margin: 0 });
    text(s, it[1], 1.45, y + 0.5, 7.9, 0.6, { fontSize: 11.5, margin: 0 });
  });
  text(s, "最小生成树的 Prim 与 Kruskal、最短路的 Dijkstra 都是贪心；Floyd 是比较典型的动态规划；最佳二叉搜索树也是动态规划。", 0.5, 4.95, 9.0, 0.3, { fontSize: 10.5, color: C.goldText, bold: true });
}

// ============================ PART 2 ============================
sectionSlide("Part 2", "问题求解", "从现实问题到可运行的程序\n股市的传言 · 相邻矩阵 · Floyd 最短路 · 最小化最大距离 · OJ05443");

// 20. 程序 = 数据结构 + 算法
{
  const s = content("2", "2 问题求解", "程序 = 数据结构 + 算法");
  const defs = [
    ["程序", "指令的组合", C.dark],
    ["算法", "求解过程的逻辑抽象", C.green],
    ["数据结构", "数据及其关系在计算机里的反映", C.goldText],
  ];
  defs.forEach((d, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.1, 2.85, 1.15, C.code);
    pill(s, d[0], x + 0.2, 1.25, 1.45, 0.38, d[2], C.white, 11.5);
    text(s, d[1], x + 0.2, 1.7, 2.5, 0.45, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  });
  text(s, "求解路径", 0.5, 2.5, 3, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const pipe = [["现实问题", "股市的传言"], ["抽象成模型", "有向带权图"], ["选逻辑 + 存储", "相邻矩阵"], ["设计算法", "Floyd + 取最大值"], ["可运行程序", "demo.cpp"]];
  pipe.forEach((p, i) => {
    const x = 0.5 + i * 1.86;
    const dark = i % 2 === 1;
    card(s, x, 2.9, 1.6, 1.05, dark ? C.dark : C.code);
    text(s, p[0], x + 0.05, 2.98, 1.5, 0.35, { fontSize: 11.5, bold: true, color: dark ? C.gold : C.dark, align: "center", margin: 0 });
    text(s, p[1], x + 0.05, 3.35, 1.5, 0.5, { fontSize: 10, color: dark ? C.mint : C.text, align: "center", margin: 0 });
    if (i < 4) s.addShape(pres.shapes.LINE, { x: x + 1.62, y: 3.42, w: 0.22, h: 0, line: { color: C.green, width: 2, endArrowType: "triangle" } });
  });
  callout(s, "Wirth 的那句话说的就是这件事", "本章第 2 节把这条路径**完整走一遍**：从题面到相邻矩阵，到 Floyd 三重循环，再到一个 30 行的 `main`。第 3 节回头评价这条路径选得好不好。", 0.5, 4.15, 9.0, 0.95, { fontSize: 11.5 });
}

// 21. 2.1 问题描述
{
  const s = content("2.1", "2 问题求解 · 问题描述", "股市的传言：从哪个人开始散布，全员知道得最快？");
  card(s, 0.5, 1.05, 4.2, 3.05, C.code);
  image(s, "fig-1-1", 0.6, 1.15, 4.0, 2.85);
  text(s, "顶点 Bᵢ 是第 i 个经纪人，有向边 ⟨Bᵢ, Bⱼ⟩ 表示 i 能把消息直接传给 j，边上的数是所需时间。", 0.5, 4.2, 4.2, 0.55, { fontSize: 9.5, color: C.muted });
  text(s, "若干股票经纪人之间互相传消息。谁能直接传给谁、传一次要花多久，都是已知的。", 4.9, 1.05, 4.6, 0.5, { fontSize: 12.5 });
  card(s, 4.9, 1.6, 4.6, 0.75, C.dark);
  text(s, "问：从哪一个人开始散布消息，能让所有人最快都知道？", 5.05, 1.6, 4.3, 0.75, { fontSize: 14, bold: true, color: C.gold, valign: "middle", margin: 0 });
  callout(s, "⚠ 题面不是「出边最多的人」", "要的是让**最后一个**收到消息的人也尽可能早收到。", 4.9, 2.5, 4.6, 0.85, { fontSize: 11.5, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "方向和权都重要", "同一对人，两个方向的时间不一样：**B₁ → B₅ 是 3，而 B₅ → B₁ 是 5**。所以这是一张**有向**带权图。", 4.9, 3.5, 4.6, 1.15, { fontSize: 11 });
  text(s, "实例：五个经纪人 B₁…B₅，10 条有向边。", 4.9, 4.78, 4.6, 0.3, { fontSize: 10, color: C.muted });
}

// 22. 出边表
{
  const s = content("2.1", "2 问题求解 · 问题描述", "10 条有向边：谁能传给谁，各要多久");
  table(s, [
    ["起点", "出边（终点 / 耗时）"],
    ["B1", { t: "→B2 (8)　→B4 (4)　→B5 (3)", mono: true }],
    ["B2", { t: "→B5 (8)", mono: true }],
    [{ t: "**B3**", fill: C.cream }, { t: "→B1 (6)　→B2 (7)　→B4 (10)　→B5 (2)", mono: true, fill: C.cream }],
    ["B4", { t: "（没有出边）", color: C.bad }],
    ["B5", { t: "→B1 (5)　→B2 (5)", mono: true }],
  ], 0.5, 1.05, 5.3, [1.0, 4.3], { fontSize: 11.5, rowH: 0.45 });
  table(s, [
    ["起点", "终点", "时间"],
    ["B1", "B4", { t: "4", align: "right" }],
    ["B1", "B2", { t: "8", align: "right" }],
    ["B1", "B5", { t: "3", align: "right" }],
    ["B2", "B5", { t: "8", align: "right" }],
    ["B3", "B1", { t: "6", align: "right" }],
    ["B3", "B2", { t: "7", align: "right" }],
    ["B3", "B4", { t: "10", align: "right" }],
    ["B3", "B5", { t: "2", align: "right" }],
    ["B5", "B1", { t: "5", align: "right" }],
    ["B5", "B2", { t: "5", align: "right" }],
  ], 6.1, 1.05, 3.4, [1.15, 1.15, 1.1], { fontSize: 9.5, rowH: 0.3, tight: true });
  callout(s, "B3 指出四条边，是唯一能到达其余所有人的起点", "但「能到达」还**不等于**「最快」——这一步只是把候选缩小，真正的答案要等 Floyd 算完再比。B4 没有出边，消息到它这里就停住了。", 0.5, 3.6, 5.3, 1.45, { fontSize: 11.5 });
}

// 23. 2.2 抽象
{
  const s = content("2.2", "2 问题求解 · 问题分析和抽象", "抽象：有向带权图上的最短路径");
  bullets(s, [
    "五个人 → 五个**顶点**；一条 Bᵢ → Bⱼ 边表示消息能直接传过去，**边权是传播时间**。",
    "没有边就记 **∞**，表示消息永远传不到那里。",
    "于是问题变成：**在有向带权图里找一个顶点，从它出发能以最短时间把消息送到其余所有顶点。**",
  ], 0.5, 1.1, 5.4, 1.5, { fontSize: 12.5, gap: 9 });
  card(s, 0.5, 2.7, 5.4, 1.55, C.code);
  text(s, "两点之间可以绕道", 0.7, 2.78, 3, 0.3, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "B₅ 到 B₄ 没有直接边，要经 B₁ 中转：", 0.7, 3.12, 5.0, 0.3, { fontSize: 11, margin: 0 });
  pill(s, "B₅", 0.8, 3.5, 0.6, 0.38, C.green, C.white, 11);
  s.addShape(pres.shapes.LINE, { x: 1.45, y: 3.69, w: 0.5, h: 0, line: { color: C.green, width: 1.8, endArrowType: "triangle" } });
  text(s, "5", 1.5, 3.3, 0.4, 0.25, { fontSize: 9.5, bold: true, color: C.goldText, margin: 0 });
  pill(s, "B₁", 2.0, 3.5, 0.6, 0.38, C.green, C.white, 11);
  s.addShape(pres.shapes.LINE, { x: 2.65, y: 3.69, w: 0.5, h: 0, line: { color: C.green, width: 1.8, endArrowType: "triangle" } });
  text(s, "4", 2.7, 3.3, 0.4, 0.25, { fontSize: 9.5, bold: true, color: C.goldText, margin: 0 });
  pill(s, "B₄", 3.2, 3.5, 0.6, 0.38, C.green, C.white, 11);
  text(s, "路径长度 = 5 + 4 = 9", 4.05, 3.5, 1.7, 0.38, { fontSize: 11, bold: true, color: C.bad, valign: "middle", margin: 0 });
  text(s, "顶点序列 B₅B₁B₄ 就是一条**路径**，路径长度是各边权之和；两点之间最短的那条路径叫**最短路径**。", 0.7, 3.92, 5.0, 0.3, { fontSize: 10, margin: 0 });
  callout(s, "为什么用相邻矩阵存图", [
    "要算的是**任意两点之间**的最短路径（不是单源），所以用**相邻矩阵**：第 i 行第 j 列是边 ⟨Bᵢ, Bⱼ⟩ 的权，没有边记 ∞。",
    "顶点只有 5 个，矩阵 5 × 5 一目了然；Floyd 正好吃这种输入。",
    "3.4 节会讨论：如果顶点很多、边很少，就该换成邻接表 + Dijkstra。",
  ], 6.1, 1.1, 3.4, 3.15, { fontSize: 11 });
  text(s, "「最短」在这道题里的含义是「传播时间最少」——建模时先把现实量对应到边权，后面的算法才有意义。", 0.5, 4.5, 9.0, 0.5, { fontSize: 10.5, color: C.muted });
}

// 24. 相邻矩阵
{
  const s = content("2.2", "2 问题求解 · 问题分析和抽象", "相邻矩阵：这就是算法的输入");
  const inf = { t: "∞", color: C.bad, bold: true, align: "center" };
  const z = (v) => ({ t: String(v), align: "center" });
  table(s, [
    ["", "B1", "B2", "B3", "B4", "B5"],
    [{ t: "**B1**" }, { t: "0", align: "center", fill: C.mint }, z(8), { ...inf }, z(4), z(3)],
    [{ t: "**B2**" }, { ...inf }, { t: "0", align: "center", fill: C.mint }, { ...inf }, { ...inf }, z(8)],
    [{ t: "**B3**" }, z(6), z(7), { t: "0", align: "center", fill: C.mint }, z(10), z(2)],
    [{ t: "**B4**" }, { ...inf }, { ...inf }, { ...inf }, { t: "0", align: "center", fill: C.mint }, { ...inf }],
    [{ t: "**B5**" }, z(5), z(5), { ...inf }, { ...inf }, { t: "0", align: "center", fill: C.mint }],
  ], 0.5, 1.05, 5.5, [0.9, 0.92, 0.92, 0.92, 0.92, 0.92], { fontSize: 11, rowH: 0.42 });
  callout(s, "读这张矩阵", [
    "**对角线是 0**：一个人到自己不需要传播时间。",
    "**∞ 表示没有直接边**——不是「距离很大」，而是「没有这条路」。",
    "第 4 行全是 ∞（除对角线）：**B4 没有出边**，消息传到它就停。",
    "第 3 列全是 ∞（除对角线）：**没人能传给 B3**，所以除 B3 自己，谁都覆盖不了全员。",
  ], 6.2, 1.05, 3.3, 2.2, { fontSize: 10.5, gap: 4 });
  text(s, "工作可以拆成三步", 0.5, 3.72, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const steps = [["Floyd", "算出任意两人间的最短传播时间"], ["取每行最大", "对每个候选起点，找出「到每个人的最短时间」中**最慢的一项**"], ["取最小", "从这些最大值中选**最小**的一个；某行仍有 ∞ 时该起点不合格"]];
  steps.forEach((t, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.08, 2.85, 1.0, i === 2 ? C.cream : C.code);
    numCircle(s, i + 1, x + 0.12, 4.18, 0.36, C.dark);
    text(s, t[0], x + 0.55, 4.14, 2.2, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, t[1], x + 0.12, 4.46, 2.6, 0.55, { fontSize: 9.5, margin: 0 });
  });
}

// 25. 为什么取最慢的一项
{
  const s = content("2.2", "2 问题求解 · 问题分析和抽象", "为什么要取「最慢的一项」");
  text(s, "假设从 B3 开始，Floyd 算出的最短传播时间是：", 0.5, 1.05, 5.4, 0.3, { fontSize: 12.5 });
  const vals = [["到 B1", 6], ["到 B2", 7], ["到自身", 0], ["到 B4", 10], ["到 B5", 2]];
  vals.forEach((v, i) => {
    const x = 0.5 + i * 1.08;
    card(s, x, 1.45, 1.0, 0.85, i === 3 ? C.gold : C.code);
    text(s, v[0], x, 1.5, 1.0, 0.25, { fontSize: 9.5, color: i === 3 ? C.dark : C.muted, align: "center", margin: 0 });
    text(s, String(v[1]), x, 1.72, 1.0, 0.5, { fontSize: 20, bold: true, color: i === 3 ? C.bad : C.dark, align: "center", margin: 0 });
  });
  bullets(s, [
    "消息要「**传遍所有人**」，就**必须等最慢的 B4 收到**。",
    "所以 B3 的完成时间是这五个数里的**最大值 10**——**不是它们的和（25），也不是最小值（0）**。",
    "这个量有个名字：**离心率**（eccentricity）——某起点到全部顶点的最短距离中的**最大值**。",
  ], 0.5, 2.45, 5.4, 1.5, { fontSize: 12, gap: 8 });
  card(s, 0.5, 4.05, 5.4, 1.0, C.dark);
  text(s, "目标：最小化最大距离", 0.7, 4.13, 4, 0.3, { fontSize: 11.5, bold: true, color: C.gold, margin: 0 });
  text(s, "不是选离某一个人最近的起点，而是选让**最后一个**收到消息的人也尽可能早收到消息的起点。", 0.7, 4.45, 5.0, 0.5, { fontSize: 11.5, color: C.white, margin: 0 });
  callout(s, "三种「聚合」方式，选错就答错题", [
    "取**和** → 「总传播工作量最小」，是另一个问题（近似 MST）。",
    "取**最小** → 「最快让某一个人知道」，选边权最小的那条边就行。",
    "取**最大** → 「让所有人都知道的时刻」，**本题要的就是这个**。",
  ], 6.2, 1.05, 3.3, 2.2, { fontSize: 10.5, gap: 4 });
  callout(s, "∞ 怎么处理", "某行只要还有一个 ∞，该行的最大值就是 ∞：至少有一人永远收不到消息，**这个起点不合格**。", 6.2, 3.45, 3.3, 1.2, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 26. 完成时间表
{
  const s = content("2.2", "2 问题求解 · 问题分析和抽象", "把每个人都当一次起点：答案是 B3");
  const inf = { t: "∞", color: C.bad, bold: true, align: "right" };
  const n = (v) => ({ t: String(v), align: "right" });
  table(s, [
    ["起点", "到 B1", "到 B2", "到 B3", "到 B4", "到 B5", "最慢的最短时间", "是否可选"],
    [{ t: "B1" }, n(0), n(8), { ...inf }, n(4), n(3), { ...inf }, { t: "否", color: C.bad }],
    [{ t: "B2" }, n(13), n(0), { ...inf }, n(17), n(8), { ...inf }, { t: "否", color: C.bad }],
    [{ t: "**B3**", fill: C.cream }, { ...n(6), fill: C.cream }, { ...n(7), fill: C.cream }, { ...n(0), fill: C.cream }, { ...n(10), fill: C.cream }, { ...n(2), fill: C.cream }, { t: "**10**", align: "right", color: C.ok, fill: C.cream }, { t: "**是**", color: C.ok, fill: C.cream }],
    [{ t: "B4" }, { ...inf }, { ...inf }, { ...inf }, n(0), { ...inf }, { ...inf }, { t: "否", color: C.bad }],
    [{ t: "B5" }, n(5), n(5), { ...inf }, n(9), n(0), { ...inf }, { t: "否", color: C.bad }],
  ], 0.5, 1.05, 9.0, [0.75, 0.9, 0.9, 0.9, 0.9, 0.9, 2.1, 1.65], { fontSize: 10.5, rowH: 0.42 });
  text(s, "Floyd 算完之后的结果矩阵。∞ 表示至少有一人永远收不到消息，所以那一行没有可用的完成时间。", 0.5, 3.7, 9.0, 0.3, { fontSize: 10.5, color: C.muted });
  callout(s, "两个绕道出来的数，核对一遍", [
    "**B2 → B4 = 17**：B2→B5 (8) + B5→B1 (5) + B1→B4 (4) = 17，没有直接边。",
    "**B5 → B4 = 9**：B5→B1 (5) + B1→B4 (4) = 9。",
  ], 0.5, 4.05, 5.6, 1.0, { fontSize: 10.5, gap: 3 });
  card(s, 6.3, 4.05, 3.2, 1.0, C.dark);
  text(s, "答案", 6.5, 4.14, 2, 0.28, { fontSize: 10.5, bold: true, color: C.gold, margin: 0 });
  text(s, "B3，完成时间 10", 6.5, 4.42, 2.9, 0.5, { fontSize: 18, bold: true, color: C.white, margin: 0 });
}

// 27. 数据结构和算法设计 + demo.cpp
{
  const s = content("2.2", "2 问题求解 · 数据结构和算法设计", "把「怎么展示」与「怎么算」分开");
  card(s, 0.5, 1.05, 2.9, 0.95, C.code);
  pill(s, "modern.hpp", 0.7, 1.15, 1.7, 0.36, C.dark, C.gold, 10.5);
  text(s, "只有数据和计算，**不含任何输入输出**", 0.7, 1.55, 2.6, 0.4, { fontSize: 10.5, margin: 0 });
  card(s, 3.6, 1.05, 2.9, 0.95, C.code);
  pill(s, "demo.cpp", 3.8, 1.15, 1.7, 0.36, C.green, C.white, 10.5);
  text(s, "只负责**组装输入、打印结果**", 3.8, 1.55, 2.6, 0.4, { fontSize: 10.5, margin: 0 });
  callout(s, "三个公开操作", "构造函数建立距离矩阵；`add_route` 填入直接边；`best_source` 计算答案（内部复制一份矩阵，多次调用不改变原网络）。", 6.7, 1.05, 2.8, 0.95, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  codeBlock(s, `#include "modern.hpp"

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
        std::cout << "最佳传播起点是 B" << *source + 1 << '\\n';
    } else {
        std::cout << "不存在能到达全部经纪人的起点\\n";
    }
}`, 0.5, 2.05, 6.0, 3.05, { fontSize: 7.9 });
  consoleBlock(s, "最佳传播起点是 B3", 6.7, 2.1, 2.8, 0.85);
  callout(s, "改一改再跑一次", [
    "删掉 `network.add_route(2, 1, 7);` → B3 到不了 B2，不存在覆盖全员的起点，`best_source()` 返回空值。",
    "把 `B3 -> B4` 从 10 改成 1 → 答案仍是 B3，只是最慢传播时间从 **10 缩短到 7**。",
  ], 6.7, 3.15, 2.8, 1.95, { fontSize: 9.5, gap: 4 });
}

// 28. 编译命令
{
  const s = content("2.2", "2 问题求解 · 用起来", "编译与运行：命令逐项解释");
  codeBlock(s, `c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch01/adt \\
    code/ch01/adt/demo.cpp -o /tmp/rumor-demo
/tmp/rumor-demo`, 0.5, 1.05, 9.0, 0.85, { fontSize: 10.5, lang: "text" });
  text(s, "第一行是「编译」，第二行是「运行刚刚编译出的程序」。", 0.5, 2.0, 9, 0.3, { fontSize: 11.5 });
  table(s, [
    ["片段", "含义"],
    [{ t: "`c++`" }, "C++ 编译器命令。macOS 上通常指 Clang，Linux 上也可能指 GCC"],
    [{ t: "`-std=c++17`" }, "按 C++17 语言规则编译；本书的 `std::optional` 需要它"],
    [{ t: "`-Wall -Wextra`" }, "打开常见与额外的编译器警告（未使用变量、可疑转换等）"],
    [{ t: "`-Werror`" }, "把警告**当作错误**；学习时可及早发现问题，初学调试可暂时去掉"],
    [{ t: "`-Icode/ch01/adt`" }, "加一个头文件搜索目录，`#include \"modern.hpp\"` 才找得到"],
    [{ t: "`-o /tmp/rumor-demo`" }, "指定输出的可执行文件名"],
  ], 0.5, 2.32, 9.0, [2.3, 6.7], { fontSize: 10, rowH: 0.33 });
  text(s, "**改一改再跑一次**是理解这段代码最快的方式——把边删掉、把权改小，看输出怎么变。", 0.5, 4.72, 9.0, 0.3, { fontSize: 10, color: C.goldText });
}

// 29. 实现导读：头文件与命名空间
{
  const s = content("导读", "2 问题求解 · 实现导读", "头文件、命名空间与 #pragma once");
  callout(s, "#pragma once", "告诉编译器：同一个头文件即使被**间接包含多次**，也只处理一次，避免类定义重复。", 0.5, 1.05, 4.35, 0.95, { fontSize: 11 });
  table(s, [
    ["头文件", "本程序用它做什么"],
    [{ t: "`<cstddef>`" }, "提供 `std::size_t`，表示非负的大小或下标"],
    [{ t: "`<limits>`" }, "提供 `std::numeric_limits<int>::max()`"],
    [{ t: "`<optional>`" }, "提供 `std::optional`，表达「可能没有答案」"],
    [{ t: "`<stdexcept>`" }, "提供 `std::invalid_argument`，报告非法参数"],
    [{ t: "`<vector>`" }, "提供动态数组，这里用它保存二维距离矩阵"],
  ], 0.5, 2.2, 4.35, [1.35, 3.0], { fontSize: 9, rowH: 0.35 });
  callout(s, "命名空间", "`namespace dsa::adt { ... }` 把名字放入 `dsa::adt`。完整类名因此是 `dsa::adt::RumorNetwork`，可避免项目中另一个人也定义 `RumorNetwork` 时发生重名。", 5.15, 1.05, 4.35, 1.3, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "类的两半", "`public:` 以下是**调用者可以使用的接口**；`private:` 以下是**实现细节**，调用者不能直接改写。这正是 1.1.3 节「概念层 vs 实现层」在代码里的样子。", 5.15, 2.5, 4.35, 1.3, { fontSize: 11 });
  text(s, "代码块中的 `// >>> adt` 与 `// <<< adt` 只是同步标记，不参与 C++ 逻辑。", 5.15, 3.95, 4.35, 0.4, { fontSize: 10, color: C.muted });
  text(s, "私有数据成员：`std::vector<std::vector<int>> distance_;` —— 外层 vector 是行，内层是一行中的列，合起来是二维矩阵。末尾下划线是约定，表示私有成员。", 0.5, 4.35, 9.0, 0.7, { fontSize: 10 });
}

// 30. infinity vs unreachable
{
  const s = content("坑", "2 问题求解 · 实现导读", "两个「无穷」：infinity 与 unreachable");
  codeBlock(s, `static constexpr int infinity = std::numeric_limits<int>::max() / 4;

/// 最短时间是若干段之和，可能超过 int；用 64 位，「到不了」另用 unreachable。
using distance_type = std::int64_t;
static constexpr distance_type unreachable = std::numeric_limits<distance_type>::max();`, 0.5, 1.05, 9.0, 1.15, { fontSize: 9.5 });
  card(s, 0.5, 2.35, 4.35, 1.5, C.code);
  pill(s, "infinity（int）", 0.7, 2.48, 1.9, 0.36, C.dark, C.gold, 10.5);
  text(s, "只用来表示**两人之间没有直接路线**，并规定每条路线的时间都必须小于它。`static` 表示属于类本身而非每个对象；`constexpr` 表示编译期常量。", 0.7, 2.9, 4.0, 0.85, { fontSize: 10.5, margin: 0 });
  card(s, 5.15, 2.35, 4.35, 1.5, C.code);
  pill(s, "unreachable（int64）", 5.35, 2.48, 2.2, 0.36, C.green, C.white, 10.5);
  text(s, "求最短路时用的「到不了」。**最短时间是若干段之和，可能超过 int 的范围**，所以另开 64 位的 `distance_type`。", 5.35, 2.9, 4.0, 0.85, { fontSize: 10.5, margin: 0 });
  card(s, 0.5, 4.0, 9.0, 1.1, "FDF0EE");
  text(s, "⚠ 为什么不能共用一个常量", 0.7, 4.08, 5, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  s.addText(runs("如果借用 `infinity` 当「到不了」，那么一条**总长恰好等于 infinity 的合法路径**会被误读成「到不了」。同理 `add_route` 要求 `cost < infinity`：否则 Floyd 会把这条路线当成「没有路线」，**结果静默出错**。", { color: C.text, boldColor: C.bad, codeColor: C.bad }), { x: 0.7, y: 4.4, w: 8.6, h: 0.6, fontFace: FONT, fontSize: 11.5, margin: 0, isTextBox: true });
}

// 31. 构造函数与 add_route
{
  const s = content("导读", "2 问题求解 · 实现导读", "构造函数与 add_route");
  codeBlock(s, `explicit RumorNetwork(std::size_t people)
    : distance_(people, std::vector<int>(people, infinity)) {
    for (std::size_t person = 0; person < people; ++person) {
        distance_[person][person] = 0;      // 到自己不需要时间
    }
}

void add_route(std::size_t from, std::size_t to, int cost) {
    // cost 不小于 infinity 时，Floyd 会把这条路线当成「没有路线」，结果静默出错
    if (from >= distance_.size() || to >= distance_.size()
        || cost < 0 || cost >= infinity) {
        throw std::invalid_argument("route");
    }
    if (cost < distance_[from][to]) {        // 重复添加只保留较小的时间
        distance_[from][to] = cost;
    }
}`, 0.5, 1.05, 6.1, 2.85, { fontSize: 9 });
  callout(s, "成员初始化列表", "冒号后的部分先创建 `distance_`，再进入花括号。它构造一个 **5 行 × 5 列**、初值全为 `infinity` 的整数矩阵；随后循环把**对角线改为 0**。", 6.8, 1.05, 2.7, 1.5, { fontSize: 10 });
  callout(s, "矩阵的含义", "第 `from` 行、第 `to` 列总是表示**从 from 到 to 的当前已知最短时间**。", 6.8, 2.65, 2.7, 1.25, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  card(s, 0.5, 4.05, 9.0, 1.05, C.code);
  text(s, "两段 if 各管一件事", 0.7, 4.12, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "第一段：检查编号是否**越界**、时间是否为**负**或**过大**；不满足题目定义时抛 `std::invalid_argument`，调用者可用 `try/catch` 处理。",
    "第二段：只在新边**更短**时更新矩阵——所以即使重复添加同一方向的边，也保留较小的时间（处理**重边**）。",
  ], 0.7, 4.42, 8.7, 0.65, { fontSize: 10.5, gap: 2 });
}

// 32. Floyd 三重循环
{
  const s = content("算法", "2 问题求解 · Floyd", "三层循环的含义：按中转站逐步扩大可用路径");
  codeBlock(s, `for each via:       允许路径经过 via
  for each from:    固定起点 from
    for each to:    固定终点 to
      比较 原来的 from->to 与 from->via->to`, 0.5, 1.05, 5.4, 1.05, { fontSize: 10.5, lang: "text" });
  bullets(s, [
    "**不是「随便循环三次」**：最外层的 via 是**中转站**，每轮结束后，「只允许经过前 via 个点」的最短路都已算对。",
    "条件 `shortest[from][via] != unreachable && shortest[via][to] != unreachable` 先确认**两段都可达**。",
    "若 `from -> via -> to` 的总时间更小，就更新 `shortest[from][to]`。",
  ], 0.5, 2.25, 5.4, 1.6, { fontSize: 11.5, gap: 8 });
  // B2 -> B4 = 17 的推导
  card(s, 0.5, 3.95, 5.4, 1.15, C.cream);
  text(s, "例：B2 到 B4 没有直接边", 0.7, 4.02, 4, 0.3, { fontSize: 11.5, bold: true, color: C.goldText, margin: 0 });
  const chain = [["B2", 8], ["B5", 5], ["B1", 4], ["B4", null]];
  chain.forEach((c, i) => {
    const x = 0.7 + i * 0.95;
    pill(s, c[0], x, 4.45, 0.6, 0.38, C.dark, C.gold, 11);
    if (c[1] !== null) {
      s.addShape(pres.shapes.LINE, { x: x + 0.63, y: 4.64, w: 0.28, h: 0, line: { color: C.goldText, width: 1.8, endArrowType: "triangle" } });
      text(s, String(c[1]), x + 0.58, 4.22, 0.4, 0.25, { fontSize: 9.5, bold: true, color: C.bad, margin: 0 });
    }
  });
  text(s, "8 + 5 + 4 = 17", 4.3, 4.45, 1.55, 0.38, { fontSize: 11.5, bold: true, color: C.bad, valign: "middle", margin: 0 });
  codeBlock(s, `const std::size_t n = distance_.size();
std::vector<std::vector<distance_type>>
    sh(n, std::vector<distance_type>(
              n, unreachable));
// 抄入直接路线
for (std::size_t i = 0; i < n; ++i) {
  for (std::size_t j = 0; j < n; ++j) {
    if (distance_[i][j] != infinity) {
      sh[i][j] = distance_[i][j];
    }
  }
}
// 按中转站 k 逐步放开
for (std::size_t k = 0; k < n; ++k) {
  for (std::size_t i = 0; i < n; ++i) {
    for (std::size_t j = 0; j < n; ++j) {
      if (sh[i][k] != unreachable &&
          sh[k][j] != unreachable &&
          sh[i][j] > sh[i][k] + sh[k][j]) {
        sh[i][j] = sh[i][k] + sh[k][j];
      }
    }
  }
}`, 6.1, 1.05, 3.4, 4.05, { fontSize: 8.2 });
  text(s, "（为放进这一栏，把 shortest / from / to / via 缩写成 sh / i / j / k，逻辑与书稿一致。）", 6.1, 5.12, 3.4, 0.3, { fontSize: 7.5, color: C.muted, margin: 0 });
}

// 33. 从最短路矩阵选答案
{
  const s = content("算法", "2 问题求解 · Floyd", "从最短路矩阵里挑答案：离心率最小的那一行");
  codeBlock(s, `std::optional<std::size_t> result;                 // 空值 = 还没找到合格起点
distance_type smallest_eccentricity = unreachable; // 目前见过的最小完成时间
for (std::size_t from = 0; from < people; ++from) {
    distance_type largest_distance = 0;
    for (distance_type distance : shortest[from]) {
        // 若新值更大就采用新值，否则保留旧值 —— 取这一行的最大值
        largest_distance = distance > largest_distance ? distance : largest_distance;
    }
    if (largest_distance < smallest_eccentricity) {
        smallest_eccentricity = largest_distance;
        result = from;
    }
}
return result;`, 0.5, 1.05, 6.1, 2.55, { fontSize: 9 });
  callout(s, "eccentricity（离心率）", "某起点到**全部顶点**的最短距离中的**最大值**。外层循环每次处理一行（一个候选起点），内层循环扫描该行取最大值。", 6.8, 1.05, 2.7, 1.3, { fontSize: 10 });
  callout(s, "∞ 自动被排除", "任何一行含 `unreachable` 时，该行最大值也是 `unreachable`，**不会优于有限答案**；若所有行都含它，`result` 保持为空，函数返回 `std::nullopt`。", 6.8, 2.5, 2.7, 1.5, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  card(s, 0.5, 3.75, 6.1, 1.35, C.code);
  text(s, "[[nodiscard]] 与 std::optional", 0.7, 3.82, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "`std::optional<std::size_t>`：**「可能没有答案」**进了类型里——「不存在合格起点」是可预期的结果，不是错误。",
    "`[[nodiscard]]` 提醒编译器：调用者**不应无意丢弃**这个可能为空的重要返回值。",
  ], 0.7, 4.12, 5.8, 0.9, { fontSize: 10.5, gap: 3 });
  callout(s, "多次调用不改变原网络", "`best_source()` 内部**复制**一份矩阵到 `shortest`，`distance_` 始终只存直接边。", 6.8, 4.15, 2.7, 0.95, { fontSize: 10 });
}

// 34. 复杂度与适用场景
{
  const s = content("评价", "2 问题求解 · 复杂度", "这套方案的代价与适用场景");
  card(s, 0.5, 1.1, 4.35, 1.5, C.code);
  text(s, "时间复杂度", 0.7, 1.2, 2, 0.3, { fontSize: 11, color: C.muted, margin: 0 });
  text(s, "O(V³)", 0.7, 1.5, 2.5, 0.75, { fontSize: 40, bold: true, color: C.dark, margin: 0 });
  text(s, "三重循环，每层 V 次", 2.9, 1.75, 1.85, 0.4, { fontSize: 10.5, color: C.muted, margin: 0 });
  card(s, 5.15, 1.1, 4.35, 1.5, C.code);
  text(s, "空间复杂度", 5.35, 1.2, 2, 0.3, { fontSize: 11, color: C.muted, margin: 0 });
  text(s, "O(V²)", 5.35, 1.5, 2.5, 0.75, { fontSize: 40, bold: true, color: C.dark, margin: 0 });
  text(s, "两个 V × V 矩阵", 7.55, 1.75, 1.85, 0.4, { fontSize: 10.5, color: C.muted, margin: 0 });
  card(s, 0.5, 2.75, 4.35, 2.35, "EAF4EF");
  text(s, "✓ 适合这道题", 0.7, 2.85, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "顶点数**很少**（V = 5），5³ = 125 次比较，可以忽略。",
    "要**比较所有起点**，需要的正是**任意两点之间**的最短路——Floyd 一次算完。",
    "实现简单：三重循环 + 一次取最大，没有优先队列、没有邻接表。",
  ], 0.7, 3.3, 4.0, 1.7, { fontSize: 11, gap: 6 });
  card(s, 5.15, 2.75, 4.35, 2.35, "FDF0EE");
  text(s, "✗ 什么时候不该用", 5.35, 2.85, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "**大图**：V = 10⁴ 时 V³ = 10¹² 次操作，不可接受。",
    "顶点很多、边很少，而且**只问单源**最短路 → 换成**邻接表 + Dijkstra**。",
    "大图通常应根据**图的稀疏度**和**查询需求**选择最短路算法——3.4 节再回到这个取舍。",
  ], 5.35, 3.3, 4.0, 1.7, { fontSize: 11, gap: 6 });
}

// 35. OJ05443 题面
{
  const s = content("OJ", "2 问题求解 · 练习", "M05443 兔子与樱花：输出最短路的具体走法");
  callout(s, "题意", [
    "cs101.openjudge.cn/practice/05443",
    "**第一部分**：P 行地点名（P < 30，名字长度 ≤ 20）。",
    "**第二部分**：Q 行「地点 地点 距离」的**无向**道路（Q < 50）。",
    "**第三部分**：R 行查询「起点 终点」（R < 20）。",
    "输出每条查询的最短走法，两点之间用 `->(距离)->` 相隔。",
  ], 0.5, 1.05, 4.5, 2.4, { fontSize: 10.5, gap: 4 });
  codeBlock(s, `6
Ginza
Sensouji
Shinjukugyoen
Uenokouen
Yoyogikouen
Meijishinguu
6
Ginza Sensouji 80
Shinjukugyoen Sensouji 40
Ginza Uenokouen 35
Uenokouen Shinjukugyoen 85
Sensouji Meijishinguu 60
Meijishinguu Yoyogikouen 35
2
Uenokouen Yoyogikouen
Meijishinguu Meijishinguu`, 5.2, 1.05, 4.3, 2.75, { fontSize: 8.2, lang: "text" });
  consoleBlock(s, "Uenokouen->(35)->Ginza->(80)->Sensouji\n    ->(60)->Meijishinguu->(35)->Yoyogikouen\nMeijishinguu", 5.2, 3.95, 4.3, 1.15, 8.5);
  callout(s, "这条答案为什么最短（核对一遍）", [
    "**走 Ginza**：35 + 80 + 60 + 35 = **210** ✓",
    "绕 Shinjukugyoen：85 + 40 + 60 + 35 = 220",
    "起点 = 终点时**只输出地名**，不输出任何箭头。",
  ], 0.5, 3.6, 4.5, 1.5, { fontSize: 10.5, gap: 4 });
}

// 36. Floyd + nxt 路径重构（思路）
{
  const s = content("2.3", "2 问题求解 · 练习 · Floyd", "求最短路只是一半：还要把路径打印出来");
  bullets(s, [
    "`dist[i][j]`：当前已知的最短距离；`direct_weight[i][j]`：**直连边**的权（打印时要用）。",
    "`nxt[i][j]`：从 i 走向 j 的**下一步**是哪个点。初始化 `nxt[u][v] = v`（有直连边）、`nxt[i][i] = i`。",
    "松弛成功时 `nxt[i][j] = nxt[i][k]`——**从 i 到 j 的第一步，改成从 i 到 k 的第一步**。",
    "重构时从起点出发 `curr = nxt[curr][end]`，一步步走到终点，**正向**得到整条路径。",
  ], 0.5, 1.05, 5.4, 2.1, { fontSize: 11.5, gap: 8 });
  codeBlock(s, `// Floyd-Warshall 核心三层循环
for (int k = 0; k < P; ++k)
  for (int i = 0; i < P; ++i)
    for (int j = 0; j < P; ++j)
      if (dist[i][k] != INF && dist[k][j] != INF)
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          // 从 i 到 j 的下一步，改为走从 i 到 k 的下一步
          nxt[i][j] = nxt[i][k];
        }`, 0.5, 3.3, 5.4, 1.8, { fontSize: 8.8, hl: [9] });
  callout(s, "为什么记「下一步」而不是「前一步」", "记 `nxt` 可以**从起点正向**重构，输出顺序与打印顺序一致；记 `prev` 则要从终点回溯再 `reverse`（Dijkstra 版就是这么做的）。两种都对，区别只在重构方向。", 6.1, 1.05, 3.4, 1.55, { fontSize: 10 });
  callout(s, "本题的两个细节", [
    "**无向图**：读入一条边要同时写 `[u][v]` 与 `[v][u]`。",
    "**重边**：只有 `w < dist[u][v]` 时才更新，保留最小权。",
    "打印用 `direct_weight`，不是 `dist`——每一段都是**直连边**的长度。",
  ], 6.1, 2.75, 3.4, 1.85, { fontSize: 10, gap: 4 });
  text(s, "P < 30，所以 O(P³) 只有两万多次操作，Floyd 足够。", 6.1, 4.7, 3.4, 0.35, { fontSize: 9.5, color: C.muted });
}

// 37. Floyd C++ 代码（读入 + 重构）
{
  const s = content("2.3", "2 问题求解 · 练习 · Floyd C++", "读入、初始化与路径输出");
  codeBlock(s, `const int INF = 1e9;
int P; cin >> P;
unordered_map<string, int> name2id;      // 地名 -> 下标
vector<string> id2name(P);
for (int i = 0; i < P; ++i) { cin >> id2name[i]; name2id[id2name[i]] = i; }

vector<vector<int>> dist(P, vector<int>(P, INF));
vector<vector<int>> direct_weight(P, vector<int>(P, INF));
vector<vector<int>> nxt(P, vector<int>(P, -1));
for (int i = 0; i < P; ++i) { dist[i][i] = 0; nxt[i][i] = i; }

int Q; cin >> Q;
for (int i = 0; i < Q; ++i) {
    string u_name, v_name; int w;
    cin >> u_name >> v_name >> w;
    int u = name2id[u_name], v = name2id[v_name];
    if (w < dist[u][v]) {                // 重边只留最小
        dist[u][v] = dist[v][u] = w;
        direct_weight[u][v] = direct_weight[v][u] = w;
        nxt[u][v] = v;                   // 从 u 到 v 的下一步走 v
        nxt[v][u] = u;
    }
}`, 0.5, 1.02, 5.9, 3.05, { fontSize: 7.9 });
  codeBlock(s, `int R; cin >> R;
while (R--) {
    string s_name, e_name;
    cin >> s_name >> e_name;
    int start = name2id[s_name];
    int end = name2id[e_name];
    if (start == end) {   // 起点 = 终点
        cout << s_name << "\\n";
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
    for (size_t i = 0;
         i + 1 < path.size(); ++i) {
        int u = path[i];
        int v = path[i + 1];
        cout << "->("
             << direct_weight[u][v]
             << ")->" << id2name[v];
    }
    cout << "\\n";
}`, 6.6, 1.02, 2.9, 4.08, { fontSize: 7.6 });
  text(s, "`ios::sync_with_stdio(false); cin.tie(nullptr);` 关掉与 C 标准 I/O 的同步，读入更快。", 0.5, 4.18, 5.9, 0.3, { fontSize: 9.5, color: C.muted });
  callout(s, "unordered_map 的作用", "题目给的是**地名字符串**，算法要的是**下标**。两张表 `name2id` / `id2name` 在字符串与整数之间来回翻译——这就是 1.1.2 节「索引」的日常用法。", 0.5, 4.5, 5.9, 0.62, { fontSize: 9, tsize: 10 });
}

// 38. Dijkstra C++
{
  const s = content("2.3", "2 问题求解 · 练习 · Dijkstra C++", "堆优化 + prev 回溯");
  codeBlock(s, `// 邻接矩阵存边权（方便处理重边）
vector<vector<int>> graph(P, vector<int>(P, INF));
for (int i = 0; i < P; ++i) graph[i][i] = 0;
// ... 读入时 if (w < graph[u][v]) graph[u][v] = graph[v][u] = w;

vector<int> dist(P, INF), prev(P, -1);
using P2 = pair<int,int>;                    // (距离, 顶点)
priority_queue<P2, vector<P2>, greater<P2>> pq;   // 小顶堆
dist[start] = 0;
pq.push({0, start});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;       // 过期的堆顶，跳过
    if (u == end) break;             // 终点已定型，可以提前结束
    for (int v = 0; v < P; ++v) {
        if (graph[u][v] != INF &&
            dist[u] + graph[u][v] < dist[v]) {
            dist[v] = dist[u] + graph[u][v];
            prev[v] = u;             // 记「前一步」
            pq.push({dist[v], v});
        }
    }
}
// 从终点向前回溯，再 reverse
vector<int> path;
for (int curr = end; curr != -1; curr = prev[curr])
    path.push_back(curr);
reverse(path.begin(), path.end());`, 0.5, 1.05, 6.1, 4.05, { fontSize: 8 });
  callout(s, "两处「剪枝」", [
    "`if (d > dist[u]) continue;`：堆里可能留着同一个点的旧记录（**懒删除**），过期就跳过。",
    "`if (u == end) break;`：只问单条查询时，终点出堆即可停。",
  ], 6.8, 1.05, 2.7, 1.75, { fontSize: 9.5, gap: 4 });
  callout(s, "Floyd vs Dijkstra", [
    "**Floyd**：一次 O(P³) 算出**全部点对**，R 条查询直接查表。",
    "**Dijkstra**：每条查询 O(P² 或 E log V)，**总共 R 次**。",
    "本题 P < 30、R < 20，两者都轻松过；大图稀疏且查询少时 Dijkstra 更划算。",
  ], 6.8, 2.95, 2.7, 2.15, { fontSize: 9.5, gap: 4 });
}

// 39. Python 版
{
  const s = content("2.3", "2 问题求解 · 练习 · Python", "同一套思路的 Python 版本");
  codeBlock(s, `# Floyd-Warshall：nxt 记「下一步」
INF = float('inf')
dist = [[INF] * p for _ in range(p)]
direct_weight = [[INF] * p for _ in range(p)]
nxt = [[None] * p for _ in range(p)]
for i in range(p):
    dist[i][i] = 0
    nxt[i][i] = i
# 读入：无向边 + 重边取最小
if w < dist[u][v]:
    dist[u][v] = dist[v][u] = w
    direct_weight[u][v] = direct_weight[v][u] = w
    nxt[u][v], nxt[v][u] = v, u

for k in range(p):
    for i in range(p):
        for j in range(p):
            if dist[i][k] + dist[k][j] < dist[i][j]:
                dist[i][j] = dist[i][k] + dist[k][j]
                nxt[i][j] = nxt[i][k]

# 重构：从起点正向走
path = [start]
curr = start
while curr != end:
    curr = nxt[curr][end]
    path.append(curr)`, 0.5, 1.05, 4.6, 4.05, { fontSize: 7.9, lang: "py" });
  codeBlock(s, `# Dijkstra：heapq + 邻接字典
import heapq
graph = [{} for _ in range(p)]
# 读入：if v not in graph[u] or dist < graph[u][v]:
#           graph[u][v] = graph[v][u] = dist

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

path = []
curr = end
while curr != -1:
    path.append(curr)
    curr = prev[curr]
path.reverse()`, 5.3, 1.05, 4.2, 4.05, { fontSize: 7.9, lang: "py" });
  text(s, "Python 版用 `sys.stdin.read().split()` 一次读完再按下标取，避免逐行 `input()` 的开销；`float('inf')` 直接参与加法比较，省掉 C++ 里 `INF` 的溢出判断。", 0.5, 5.15, 9.0, 0.3, { fontSize: 9, color: C.muted });
}

// ============================ PART 3 ============================
sectionSlide("Part 3", "算法分析", "同一个问题有多种算法，凭什么取舍？\n渐进分析 · 大 O / Ω / Θ · 最佳 / 最差 / 平均 · 时空折衷");

// 40. 为什么要算法分析
{
  const s = content("3", "3 算法分析", "算法分析：用数学工具评价效率");
  bullets(s, [
    "同一类问题总存在**多种解决方案**，各有优缺点与适用场景。如何取舍？这就需要算法分析。",
    "任务：对每一个具体算法**讨论其各种复杂度**，以探讨某种算法适用于哪类问题、某类问题宜采用哪种算法。",
    "目的：从解决同一问题的不同算法中**选出比较合适的一种**，或对原有算法进行改造、加工，使其更优。",
  ], 0.5, 1.05, 5.5, 1.85, { fontSize: 12, gap: 8 });
  callout(s, "计算复杂性（computational complexity）", "**Juris Hartmanis** 与 **Richard E. Stearns** 提出，用来度量算法的难度：复杂性的高低体现在**运行该算法所需的计算机资源**的多少上。（这两个人名在原书里印作 “Juris Hartmanishe” 与 “Richars E. Stearns”，此处按学界通行拼法更正。）", 0.5, 3.0, 5.5, 1.35, { fontSize: 10.5 });
  card(s, 0.5, 4.45, 5.5, 0.65, C.code);
  pill(s, "时间复杂性", 0.7, 4.57, 1.7, 0.4, C.dark, C.gold, 11);
  text(s, "处理器", 2.5, 4.57, 0.9, 0.4, { fontSize: 10.5, valign: "middle", margin: 0 });
  pill(s, "空间复杂性", 3.45, 4.57, 1.7, 0.4, C.green, C.white, 11);
  text(s, "存储器", 5.25, 4.57, 0.9, 0.4, { fontSize: 10.5, valign: "middle", margin: 0 });
  card(s, 6.3, 1.05, 3.2, 2.0, C.dark);
  text(s, "首先要明确两个问题", 6.5, 1.15, 2.8, 0.3, { fontSize: 11.5, bold: true, color: C.gold, margin: 0 });
  numCircle(s, 1, 6.5, 1.55, 0.4, C.gold);
  text(s, "怎样**表达**一个算法的复杂性", 7.0, 1.55, 2.3, 0.45, { fontSize: 12, color: C.white, margin: 0 });
  numCircle(s, 2, 6.5, 2.2, 0.4, C.gold);
  text(s, "怎样**计算**一个算法的复杂性", 7.0, 2.2, 2.3, 0.45, { fontSize: 12, color: C.white, margin: 0 });
  callout(s, "复杂性分析的价值", "对任意给定的问题，设计出复杂性尽可能低的算法是重要目标；已有多种算法时，**选择复杂性最低者**也是选用算法的重要准则。", 6.3, 3.25, 3.2, 1.85, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 41. 为什么不能用真实时间
{
  const s = content("3", "3 算法分析", "为什么不能用微秒、纳秒这样的真实时间");
  const facts = [
    ["换机器", "同一个算法放在 Cray 巨型机与 PC 上，快慢差很多；**效率较差的算法跑在 Cray 上，也可能比效率极好的算法跑在 PC 上更快**。", C.bad],
    ["换语言", "同样的算法，编译型语言往往比解释型快很多——原书举的例子：**C 语言写的程序比 LISP 写的快将近 20 倍**。", C.goldText],
    ["换的是什么", "这些都与**算法本身的优劣无关**。所以算法分析要问的不是「几毫秒」，而是**算法与输入规模之间的关系**。", C.green],
  ];
  facts.forEach((f, i) => {
    const y = 1.05 + i * 1.02;
    card(s, 0.5, y, 5.6, 0.9, C.code);
    pill(s, f[0], 0.68, y + 0.25, 1.2, 0.4, f[2], C.white, 11);
    text(s, f[1], 2.0, y + 0.05, 4.0, 0.8, { fontSize: 10.5, valign: "middle", margin: 0 });
  });
  card(s, 0.5, 4.15, 5.6, 0.95, C.dark);
  text(s, "度量方式", 0.7, 4.22, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "用一定**规模（size）**的数据作为输入时，程序运行所需的**基本操作（basic operation）**数来描述时间效率。", 0.7, 4.5, 5.2, 0.55, { fontSize: 11.5, color: C.white, margin: 0 });
  callout(s, "规模翻倍会怎样", [
    "线性 `t = cn`：规模 ×5 → 时间 ×5。",
    "对数 `t = log₂ n`：规模**加倍**只让时间**加 1 个单位**，因为 log₂(2n) = log₂ n + 1。",
  ], 6.4, 1.05, 3.1, 1.85, { fontSize: 10.5, gap: 4 });
  callout(s, "「规模」与「基本操作」视算法而定", "**规模**一般指输入量的数目（排序问题里就是待排序元素个数）；**基本操作**所需时间应与被操作的具体数值无关（两个整数相加的时间与取值无关）。", 6.4, 3.05, 3.1, 2.05, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 42. 3.1 渐进分析
{
  const s = content("3.1", "3 算法分析 · 渐进分析方法", "渐进分析：只看大数据下的主导项");
  text(s, "f(n) = n² + 100n + log₁₀ n + 1000", 0.5, 1.02, 9, 0.45, { fontSize: 20, bold: true, color: C.dark });
  table(s, [
    ["n", "n²", "100n", "log₁₀ n", "1000", "谁在主导"],
    [{ t: "1", align: "right" }, { t: "1", align: "right" }, { t: "100", align: "right" }, { t: "0", align: "right" }, { t: "**1000**", align: "right", color: C.bad }, "常数项贡献最大"],
    [{ t: "10", align: "right" }, { t: "100", align: "right" }, { t: "**1000**", align: "right", color: C.goldText }, { t: "1", align: "right" }, { t: "**1000**", align: "right", color: C.goldText }, "第 2 项与常数项贡献相同"],
    [{ t: "100", align: "right" }, { t: "**10000**", align: "right", color: C.goldText }, { t: "**10000**", align: "right", color: C.goldText }, { t: "2", align: "right" }, { t: "1000", align: "right" }, "前两项贡献相同"],
    [{ t: "> 100", align: "right", fill: C.cream }, { t: "**主导**", align: "right", color: C.ok, fill: C.cream }, { t: "越来越微不足道", align: "right", fill: C.cream }, { t: "—", align: "right", fill: C.cream }, { t: "—", align: "right", fill: C.cream }, { t: "**二次项说话 → O(n²)**", fill: C.cream }],
  ], 0.5, 1.6, 9.0, [0.9, 1.3, 1.5, 1.2, 1.1, 3.0], { fontSize: 10.5, rowH: 0.44 });
  callout(s, "渐进分析是什么", "计算规模与时间关系的函数时，只考虑**大的数据**，把那些**不能显著改变函数量级**的部分忽略掉；结果是原函数的一个**近似值**，在数据规模很大时足够接近原值。", 0.5, 3.75, 4.6, 1.35, { fontSize: 11 });
  callout(s, "⚠ 并非任何情况下都能忽略常数", "当问题**规模很小**时，各项系数和常数项会起到举足轻重的作用。所以：**用于上万个数的排序算法，也许并不适用于仅对 10 个数排序。**", 5.4, 3.75, 4.1, 1.35, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
}

// 43. 大 O 定义
{
  const s = content("3.1", "3 算法分析 · 渐进分析方法", "大 O 表示法：增长率的上限");
  text(s, "由 Paul Bachmann 于 1894 年引入。设 f 和 g 为从自然数到非负实数集的两个函数。", 0.5, 1.02, 9, 0.3, { fontSize: 11.5 });
  card(s, 0.5, 1.45, 9.0, 0.95, C.dark);
  text(s, "定义 1", 0.7, 1.52, 1.5, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "如果存在正数 c 和 N，使得对任意的 n ≥ N，都有 f(n) ≤ c·g(n)，则称 f(n) 在集合 O(g(n)) 中，或简称 f(n) 是 O(g(n)) 的。", 0.7, 1.82, 8.6, 0.5, { fontSize: 14, bold: true, color: C.white, margin: 0 });
  bullets(s, [
    "g(n) 是 f(n) 取值的**上限**（upper bound）；也可以说 f 的增长**最终至多趋同于** g 的增长。",
    "若某算法在 O(g(n)) 中，只是表明该算法**最多会差到何种程度**。",
    "一个函数的上限**可能不止一个**：在 O(n) 中的函数也一定在 O(n²)、O(n³) 中。",
    "**大 O 给出的是所有上限中最小的那个上限**——所以说「O(n²)」而不说「O(n³)」。",
  ], 0.5, 2.55, 5.4, 2.1, { fontSize: 11.5, gap: 8 });
  // 上下限示意
  card(s, 6.1, 2.55, 3.4, 2.55, C.code);
  text(s, "c·g(n) 压在 f(n) 上面", 6.25, 2.62, 3, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  // 坐标轴：原点 (6.5, 4.8)
  s.addShape(pres.shapes.LINE, { x: 6.5, y: 3.0, w: 0, h: 1.8, line: { color: C.muted, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: 6.5, y: 4.8, w: 2.65, h: 0, line: { color: C.muted, width: 1 } });
  // 两条射线：flipV 时盒子的 y 必须取线段的上端
  s.addShape(pres.shapes.LINE, { x: 6.6, y: 3.2, w: 2.35, h: 1.6, flipV: true, line: { color: C.bad, width: 2 } });
  s.addShape(pres.shapes.LINE, { x: 6.6, y: 3.95, w: 2.35, h: 0.85, flipV: true, line: { color: C.green, width: 2 } });
  text(s, "c·g(n)", 8.15, 2.95, 1.2, 0.25, { fontSize: 9.5, bold: true, color: C.bad, margin: 0 });
  text(s, "f(n)", 8.55, 4.28, 0.8, 0.25, { fontSize: 9.5, bold: true, color: C.green, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 7.25, y: 3.35, w: 0, h: 1.45, line: { color: C.goldText, width: 1, dashType: "dash" } });
  text(s, "N", 7.14, 3.12, 0.3, 0.22, { fontSize: 9.5, bold: true, color: C.goldText, margin: 0 });
  text(s, "n ≥ N 之后 f(n) ≤ c·g(n) 一直成立", 6.25, 4.84, 3.1, 0.24, { fontSize: 8.5, color: C.muted, margin: 0 });
}

// 44. 大 O 的六条性质
{
  const s = content("3.1", "3 算法分析 · 渐进分析方法", "大 O 的六条有益特性（a 为不依赖 n 的常数）");
  const props = [
    ["传递性", "f 是 O(g)，g 是 O(h) ⟹ **f 是 O(h)**"],
    ["加法", "f 是 O(h)，g 是 O(h) ⟹ **f + g 是 O(h)**"],
    ["多项式", "**a·nᵏ 是 O(nᵏ)** —— 系数不影响量级"],
    ["常数倍", "f(n) = c·g(n) ⟹ **f 是 O(g)**"],
    ["换底无关", "对任何正数 a、b（b ≠ 1），**logₐ n 是 O(log_b n)**：任何对数函数无论底数为何，都具有相同的增长率"],
    ["本书约定", "对任何正数 a ≠ 1，**logₐ n 是 O(log₂ n)**；本书把 log₂ n 简写为 **log n**"],
  ];
  props.forEach((p, i) => {
    const x = 0.5 + (i % 2) * 4.65, y = 1.1 + Math.floor(i / 2) * 1.06;
    card(s, x, y, 4.35, 0.92, i >= 4 ? C.cream : C.code);
    numCircle(s, i + 1, x + 0.15, y + 0.11, 0.38, i >= 4 ? C.goldText : C.green);
    text(s, p[0], x + 0.62, y + 0.06, 1.6, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, p[1], x + 0.62, y + 0.34, 3.6, 0.55, { fontSize: 10.5, margin: 0 });
  });
  callout(s, "这几条在实际计算里怎么用", "「加法」让我们可以**逐段统计再取最大**：一段 O(n) 加一段 O(n²) 就是 O(n²)。「多项式」「常数倍」让我们**丢掉系数**：2n² + 3n 就写 O(n²)。「换底无关」让我们**不必纠结 log 的底**。", 0.5, 4.35, 9.0, 0.75, { fontSize: 11 });
}

// 45. 常见量级表
{
  const s = content("3.1", "3 算法分析 · 渐进分析方法", "常见的上限 g(n)");
  table(s, [
    ["g(n)", "名称", "原书给的例子"],
    [{ t: "**1**" }, "常数函数", "不依赖于数据规模 n"],
    [{ t: "**log n**" }, "对数函数", "比线性函数 n 增长慢"],
    [{ t: "**n**" }, "线性增长", "rate(n 个 a 相加) = rate(n × a) = O(n)"],
    [{ t: "**n log n**" }, "阶数低于二阶、高于一阶", "rate(∑ᵢ₌₁^{log n} ∑ⱼ₌₁^n a) = O(n log n)，一般出现在**树形结构**的算法中"],
    [{ t: "**n²**" }, "二阶增长", "rate(1 + 2 + ⋯ + n) = rate(n(n+1)/2) = O(n²)"],
    [{ t: "**aⁿ**" }, "指数增长", "往往出现在**递归定义**的函数计算中"],
  ], 0.5, 1.05, 9.0, [1.3, 2.3, 5.4], { fontSize: 10.5, rowH: 0.44 });
  card(s, 0.5, 4.25, 9.0, 0.85, "FDF0EE");
  text(s, "⚠ 指数增长的渐进式比任何高次多项式（n³、n⁴ …）都增长得更快", 0.7, 4.33, 8.6, 0.3, { fontSize: 12.5, bold: true, color: C.bad, margin: 0 });
  text(s, "具有指数增长率的算法简称**指数爆炸型算法**，应用时需要谨慎。", 0.7, 4.66, 8.6, 0.3, { fontSize: 11.5, margin: 0 });
}

// 46. 数量级的现实感
{
  const s = content("3.1", "3 算法分析 · 渐进分析方法", "差一个数量级有多大？令时间单位 1 μs，n = 1000");
  const stats = [["T(n) = n", "1 ms", C.green], ["T(n) = n²", "1 s", C.goldText], ["T(n) = n³", "1000 s", C.bad], ["T(n) = 2ⁿ", "10²⁸⁶ 年", C.bad]];
  stats.forEach((st, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.05, 2.15, 1.3, C.code);
    text(s, st[0], x + 0.1, 1.12, 1.95, 0.3, { fontSize: 11, bold: true, fontFace: MONO, color: C.dark, align: "center", margin: 0 });
    text(s, st[1], x + 0.1, 1.42, 1.95, 0.6, { fontSize: i === 3 ? 20 : 26, bold: true, color: st[2], align: "center", margin: 0 });
    text(s, i === 2 ? "约 16 分钟" : i === 3 ? "地球年龄还不到 10¹⁰ 年" : "", x + 0.1, 2.02, 1.95, 0.28, { fontSize: 8.5, color: C.muted, align: "center", margin: 0 });
  });
  text(s, "表 1.2 　把量级换算成现实世界里的速度，好让「差一个数量级」有一个能感知的尺度（节选）", 0.5, 2.5, 9.0, 0.3, { fontSize: 11, bold: true, color: C.dark });
  table(s, [
    ["m/s", "英制度量衡", "现实世界的例子"],
    [{ t: "10⁻¹¹" }, "1.2 英寸/世纪", "钟乳石的生长速度"],
    [{ t: "10⁻⁹" }, "1.2 英寸/年", "指甲的生长速度"],
    [{ t: "10⁻⁶" }, "3.4 英寸/天", "冰河的流动速度"],
    [{ t: "10⁻³" }, "2 英寸/分", "蜗牛的速度"],
  ], 0.5, 2.9, 4.5, [0.9, 1.7, 1.9], { fontSize: 10, rowH: 0.36, tight: true });
  table(s, [
    ["m/s", "英制度量衡", "现实世界的例子"],
    [{ t: "1" }, "2.2 英里/时", "人类的散步速度"],
    [{ t: "10²" }, "220 英里/时", "螺旋桨飞机的速度"],
    [{ t: "10⁵" }, "3700 英里/分", "流星撞击地球的速度"],
    [{ t: "10⁸" }, "62000 英里/秒", "光速的三分之一"],
  ], 5.0, 2.9, 4.5, [0.9, 1.7, 1.9], { fontSize: 10, rowH: 0.36, tight: true });
  text(s, "从钟乳石到光速，跨了 19 个数量级；而 n = 1000 时 n 与 2ⁿ 之间的差距，比这还夸张得多。", 0.5, 4.75, 9.0, 0.35, { fontSize: 10.5, color: C.goldText });
}

// 47. 增长趋势图 + 数值表
{
  const s = content("3.1", "3 算法分析 · 渐进分析方法", "常用函数的增长趋势");
  card(s, 0.5, 1.05, 4.6, 4.05, C.code);
  image(s, "fig-1-5", 0.6, 1.15, 4.4, 3.85);
  text(s, "n 稍大，曲线之间就拉开天文数字的差距。", 0.5, 5.12, 4.6, 0.3, { fontSize: 9, color: C.muted });
  table(s, [
    ["阶", "n = 16", "n = 256", "直觉"],
    [{ t: "**1**" }, { t: "1", align: "right" }, { t: "1", align: "right" }, "常数"],
    [{ t: "**log n**" }, { t: "4", align: "right" }, { t: "8", align: "right" }, "二分"],
    [{ t: "**n**" }, { t: "16", align: "right" }, { t: "256", align: "right" }, "扫一遍"],
    [{ t: "**n log n**" }, { t: "64", align: "right" }, { t: "2048", align: "right" }, "快排 / 归并"],
    [{ t: "**n²**" }, { t: "256", align: "right" }, { t: "65536", align: "right" }, "双重循环"],
    [{ t: "**2ⁿ**" }, { t: "65536", align: "right" }, { t: "—", align: "right", color: C.bad }, "穷举子集"],
  ], 5.4, 1.05, 4.1, [1.1, 0.9, 1.0, 1.1], { fontSize: 10.5, rowH: 0.44 });
  callout(s, "把这张表记住", "同一组 n 用数字排出来：n = 256 时 log n 只有 8，而 2ⁿ 已经写不下了。**算法选型的第一判断，就是估这一列数字。**", 5.4, 4.15, 4.1, 0.95, { fontSize: 10.5 });
}

// 48. Ω 与 Θ
{
  const s = content("3.1", "3 算法分析 · 渐进分析方法", "Ω 表示法与 Θ 表示法");
  card(s, 0.5, 1.05, 4.35, 1.85, C.code);
  pill(s, "定义 2 · Ω（欧米伽）", 0.7, 1.15, 2.2, 0.38, C.green, C.white, 11);
  text(s, "如果存在正数 c 和 N，使得对所有的 n ≥ N，都有 **f(n) ≥ c·g(n)**，则称 f(n) 是 Ω(g(n)) 的。", 0.7, 1.6, 4.0, 0.6, { fontSize: 11.5, margin: 0 });
  bullets(s, [
    "c·g(n) 是 f(n) 取值的**下限**（lower bound）。",
    "与大 O **唯一的区别是不等式方向**；大 O 取所有上限中最小的，**Ω 取所有下限中最大的**。",
  ], 0.7, 2.2, 4.0, 0.7, { fontSize: 10, gap: 2 });
  card(s, 5.15, 1.05, 4.35, 1.85, C.cream);
  pill(s, "Θ（希塔）：上下限相同", 5.35, 1.15, 2.4, 0.38, C.goldText, C.white, 11);
  text(s, "如果一个函数既在 O(g(n)) 中，又在 Ω(g(n)) 中，则称其为 **Θ(g(n))**：存在正常数 c₁、c₂ 与正整数 N，使得对任意 n > N，", 5.35, 1.6, 4.0, 0.65, { fontSize: 11, margin: 0 });
  text(s, "c₁·g(n) ≤ f(n) ≤ c₂·g(n)", 5.35, 2.3, 4.0, 0.4, { fontSize: 15, bold: true, color: C.dark, align: "center", margin: 0 });
  card(s, 0.5, 3.0, 9.0, 1.05, C.code);
  text(s, "例", 0.7, 3.08, 1, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  text(s, "f(n) = 100 × n² + 5 × n + 500，令 g(n) = n²。取 c₁ = 100、c₂ = 105、N = 10，当 n > N 时上式成立，因此 **f(n) 为 Θ(n²)**。", 1.3, 3.08, 8.0, 0.45, { fontSize: 12, margin: 0 });
  text(s, "核对：n > 10 时 5n + 500 < 5n² ⟹ f(n) < 105n²；同时 f(n) > 100n² 显然成立。", 1.3, 3.55, 8.0, 0.4, { fontSize: 10, color: C.muted, margin: 0 });
  const three = [["O(g)", "至多这么差（上限）", C.bad], ["Ω(g)", "至少这么差（下限）", C.green], ["Θ(g)", "上下限一致，增长率确定", C.goldText]];
  three.forEach((t, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.2, 2.85, 0.9, C.code);
    pill(s, t[0], x + 0.15, 4.32, 1.0, 0.36, t[2], C.white, 11);
    text(s, t[1], x + 1.25, 4.32, 1.5, 0.36, { fontSize: 10.5, valign: "middle", margin: 0 });
  });
}

// 49. 渐进分析实例 1 & 2
{
  const s = content("3.1", "3 算法分析 · 渐进分析的实例", "数赋值操作：两段代码，两个量级");
  text(s, "大多数情况下，时间复杂度是根据算法执行过程中需要实施的**赋值、比较**等基本运算数目来衡量的。", 0.5, 1.02, 9, 0.3, { fontSize: 11.5 });
  card(s, 0.5, 1.42, 4.35, 1.75, C.code);
  text(s, "① 数组求和", 0.7, 1.5, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, `for (i = sum = 0; i < n; i++)
    sum += a[i];`, 0.7, 1.82, 3.95, 0.55, { fontSize: 9.5, lang: "text" });
  text(s, "循环前 2 次赋值（i、sum）；循环 n 次、每次 2 次赋值（sum、i）。", 0.7, 2.45, 4.0, 0.35, { fontSize: 10, margin: 0 });
  text(s, "2 + 2n  →  O(n)", 0.7, 2.78, 4.0, 0.32, { fontSize: 15, bold: true, color: C.ok, margin: 0 });
  card(s, 5.15, 1.42, 4.35, 1.75, C.code);
  text(s, "② 所有前缀子数组求和", 5.35, 1.5, 3.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, `for (i = 0; i < n; i++) {
    for (j = 1, sum = a[0]; j <= i; j++)
        sum += a[j];
    cout << "sum for subarray 0 through "
         << i << " is " << sum << endl;
}`, 5.35, 1.82, 3.95, 1.0, { fontSize: 8.5, lang: "text" });
  text(s, "外层 n 次，每次对 i、j、sum 各赋值；内层第 i 轮执行 i 次、每次 2 个赋值。", 5.35, 2.85, 4.0, 0.3, { fontSize: 9.5, margin: 0 });
  card(s, 0.5, 3.3, 9.0, 0.8, C.dark);
  text(s, "1 + 3n + ∑ᵢ₌₁ⁿ⁻¹ 2i  =  1 + 3n + 2(1 + 2 + ⋯ + n−1)  =  1 + 3n + n(n−1)  =  O(n) + O(n²)  =  O(n²)", 0.7, 3.3, 8.6, 0.8, { fontSize: 13.5, bold: true, color: C.gold, valign: "middle", margin: 0 });
  callout(s, "统计的套路", [
    "**分段**：循环外的常数次 + 每层循环的次数 × 每次的操作数。",
    "**求和**：等差求和 1 + 2 + ⋯ + (n−1) = n(n−1)/2。",
    "**取最大项**：O(n) + O(n²) = O(n²)（大 O 的加法性质）。",
  ], 0.5, 4.2, 9.0, 0.9, { fontSize: 10.5, gap: 3 });
}

// 50. 实例 3：嵌套不必然升阶
{
  const s = content("3.1", "3 算法分析 · 渐进分析的实例", "循环嵌套并不总是增加复杂度");
  text(s, "把上例改成「只对每个子数组的**前 5 个**元素求和」：", 0.5, 1.05, 9, 0.3, { fontSize: 12.5 });
  codeBlock(s, `for (i = 4; i < n; i++)
    for (j = i - 3, sum = a[i - 4]; j <= i; j++)
        sum += a[j];`, 0.5, 1.45, 5.4, 0.85, { fontSize: 10.5, lang: "text" });
  bullets(s, [
    "外层循环进行 **n − 4** 次。",
    "对每个 i，内层循环只执行 **4** 次，每次的操作次数**与 i 的大小无关**：共 8 次赋值操作。",
    "外加对 i 的初始化，整个代码总共 **O(1) + 8(n − 4) = O(n)** 次赋值操作。",
  ], 0.5, 2.45, 5.4, 1.5, { fontSize: 11.5, gap: 8 });
  card(s, 0.5, 4.05, 5.4, 1.05, C.dark);
  text(s, "尽管存在嵌套循环，但算法的整体时间复杂度依然呈线性增长。", 0.7, 4.05, 5.0, 1.05, { fontSize: 14, bold: true, color: C.gold, valign: "middle", margin: 0 });
  callout(s, "判断的关键：内层次数是否随 n 变化", [
    "内层次数是 **i 或 n 的函数** → 相乘，量级升高（例 ②：n × i）。",
    "内层次数是**常数** → 只是乘一个常数因子，量级不变（本例：n × 4）。",
    "所以看到双重循环不要条件反射写 O(n²)，**先问内层跑几次**。",
  ], 6.1, 1.45, 3.4, 1.9, { fontSize: 10.5, gap: 4 });
  callout(s, "排序算法的基本操作不是赋值", "对排序算法而言，主要时间开销体现在**比较和交换（或移动）**等操作上——具体见第 8 章各算法分析。", 6.1, 3.5, 3.4, 1.6, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 51. 3.2 最佳最差平均：最长有序子数组
{
  const s = content("3.2", "3 算法分析 · 最佳、最差和平均情况", "同一规模、不同输入，复杂度可以不一样");
  text(s, "例：求一个数组的所有有序子数组中最长的一个。在 [1, 8, 1, 2, 5, 0, 11, 9] 中，最长有序子数组为 **[1, 2, 5]**，长度 3。", 0.5, 1.02, 9, 0.35, { fontSize: 12 });
  codeBlock(s, `for (i = 0, length = 1; i < n - 1; i++) {
    for (j1 = j2 = k = i;
         k < n - 1 && a[k] < a[k + 1]; k++, j2++);
    if (length < j2 - j1 - 1)
        length = j2 - j1 + 1;
}`, 0.5, 1.42, 5.4, 1.15, { fontSize: 9.5, lang: "text", hl: [4] });
  card(s, 0.5, 2.65, 5.4, 1.2, "FDF0EE");
  text(s, "⚠ 这段是原书印出来的样子，照抄它会算错", 0.7, 2.72, 5, 0.3, { fontSize: 11.5, bold: true, color: C.bad, margin: 0 });
  s.addText(runs("内层循环走完后这一段升序的长度是 `j2 - j1 + 1`，而判断条件写的却是 `length < j2 - j1 - 1`，**两处的常数项差了 2**。用原书自己的例子跑一遍，答案会是 **2 而不是 3**。这里保留原样是为了让读者对照纸书，分析长度时按 `j2 - j1 + 1` 读。", { color: C.text, boldColor: C.bad, codeColor: C.bad }), { x: 0.7, y: 3.02, w: 5.0, h: 0.78, fontFace: FONT, fontSize: 10, margin: 0, isTextBox: true });
  const cases = [
    ["降序输入", "外层 n−1 次，每次内层只执行 1 次", "O(n)", C.ok, "最佳"],
    ["升序输入", "外层 n−1 次，对每个 i 内层执行 (n−1−i) 次", "O(n²)", C.bad, "最差"],
    ["无序输入", "既不升序也不降序——**大多数情况**", "平均情况", C.goldText, "平均"],
  ];
  cases.forEach((c, i) => {
    const y = 3.95 + i * 0.4;
    pill(s, c[4], 0.5, y, 0.75, 0.34, c[3], C.white, 9.5);
    text(s, c[0], 1.35, y, 1.15, 0.34, { fontSize: 10.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, c[1], 2.5, y, 4.4, 0.34, { fontSize: 10, valign: "middle", margin: 0 });
    text(s, c[2], 6.95, y, 1.2, 0.34, { fontSize: 11, bold: true, fontFace: MONO, color: c[3], valign: "middle", margin: 0 });
  });
  callout(s, "为什么会依赖输入", "算法实际执行的操作依赖**分支条件的走向**，而分支走向取决于**输入数据的取值**。所以渐进分析往往**无法独立于输入数据的状态**进行。", 6.1, 1.45, 3.4, 2.35, { fontSize: 10.5 });
}

// 52. 平均情况的算法
{
  const s = content("3.2", "3 算法分析 · 最佳、最差和平均情况", "平均情况怎么算：按概率加权");
  text(s, "一般而言，计算平均情况应考虑算法的**所有输入情况**，确定针对每种输入所需的操作数目。", 0.5, 1.02, 9, 0.3, { fontSize: 12 });
  card(s, 0.5, 1.4, 4.35, 1.0, C.code);
  text(s, "每种输入概率相同", 0.7, 1.48, 3, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  text(s, "把针对每种输入的操作数目**依次相加，再除以输入的总数目**。", 0.7, 1.78, 4.0, 0.5, { fontSize: 11, margin: 0 });
  card(s, 5.15, 1.4, 4.35, 1.0, C.cream);
  text(s, "概率不同：作为权值", 5.35, 1.48, 3, 0.3, { fontSize: 11.5, bold: true, color: C.goldText, margin: 0 });
  text(s, "C_avg = ∑ᵢ p(inputᵢ) · steps(inputᵢ)", 5.35, 1.78, 4.0, 0.5, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "p(inputᵢ) 为第 i 种输入的出现概率，steps(inputᵢ) 为处理该输入所需的操作或步骤数；所有概率非负且 **∑ᵢ p(inputᵢ) = 1**。",
    "此处假设**可以事先得知输入的概率分布**——而这正是难点：平均情况的分析**并不总是可行**，因为需要了解实际输入在所有可能输入集合中的分布状况。",
  ], 0.5, 2.55, 9.0, 1.0, { fontSize: 11.5, gap: 6 });
  // 顺序检索
  text(s, "例：在规模为 n 的数组中找给定的 K（假设有且仅有一个元素等于 K）", 0.5, 3.6, 9, 0.3, { fontSize: 12, bold: true, color: C.dark });
  const three = [
    ["最佳情况", "第 1 个元素就是 K", "1 次比较", C.ok],
    ["最差情况", "K 是最后一个元素", "n 次比较", C.bad],
    ["平均情况", "每个位置概率均为 1/n", "(1+2+⋯+n)/n = (n+1)/2", C.goldText],
  ];
  three.forEach((t, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 3.98, 2.85, 1.1, C.code);
    pill(s, t[0], x + 0.15, 4.08, 1.3, 0.34, t[3], C.white, 10);
    text(s, t[1], x + 0.15, 4.45, 2.6, 0.28, { fontSize: 10, margin: 0 });
    text(s, t[2], x + 0.15, 4.72, 2.6, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  });
}

// 53. 概率不等的例子
{
  const s = content("3.2", "3 算法分析 · 最佳、最差和平均情况", "概率不相等时，结论会明显改变");
  bullets(s, [
    "设出现在第 1 个位置的概率为 **1/2**，第 2 个位置为 **1/4**，其他位置概率相等，即每个为 (1 − 1/2 − 1/4)/(n − 2) = **1/(4(n−2))**。",
  ], 0.5, 1.05, 9.0, 0.6, { fontSize: 12, gap: 4 });
  card(s, 0.5, 1.7, 9.0, 0.95, C.dark);
  text(s, "1/2 + 2/4 + (3 + ⋯ + n)/(4(n−2))  =  1 + (n(n+1) − 6)/(8(n−2))  =  1 + (n+3)/8", 0.7, 1.7, 8.6, 0.95, { fontSize: 15, bold: true, color: C.gold, valign: "middle", margin: 0 });
  text(s, "次比较，比等概率的 (n+1)/2 **快将近 4 倍**。", 0.5, 2.75, 9, 0.3, { fontSize: 12.5 });
  table(s, [
    ["n", "等概率 (n+1)/2", "偏置 1 + (n+3)/8", "倍数"],
    [{ t: "100", align: "right" }, { t: "50.5", align: "right" }, { t: "13.9", align: "right" }, { t: "≈ 3.6×", align: "right", color: C.ok }],
    [{ t: "1000", align: "right" }, { t: "500.5", align: "right" }, { t: "126.4", align: "right" }, { t: "≈ 4.0×", align: "right", color: C.ok }],
  ], 0.5, 3.15, 5.4, [0.9, 1.7, 1.7, 1.1], { fontSize: 10.5, rowH: 0.36 });
  text(s, "（这两行数字按上式代入核对：n = 1000 时 1 + 1003/8 = 126.4，500.5 / 126.4 ≈ 3.96。）", 0.5, 4.3, 5.4, 0.45, { fontSize: 9, color: C.muted });
  callout(s, "结论", "**平均情况不是「输入等概率」的同义词**。分布变了，平均代价就变。所以报一个平均复杂度时，必须交代清楚**假设的是什么分布**。", 6.1, 3.15, 3.4, 1.6, { fontSize: 10.5 });
}

// 54. 该分析哪一种情况
{
  const s = content("3.2", "3 算法分析 · 最佳、最差和平均情况", "分析一种算法时，该研究哪种情况？");
  const items = [
    ["最佳情况", "**发生的概率太小**，并不能作为算法性能的代表；但它可以帮助设计者或使用者了解**某个算法在何种情况下适用**。", C.ok],
    ["最差情况", "可以让人了解一个算法**至少能做多快**，这一点在**实时系统**中尤其重要：空运处理系统里，一个绝大部分情况下能管理 n 架飞机的算法，如果不能在规定时间内管理 n 架飞机，则该算法**不可接受**。", C.bad],
    ["平均情况", "是算法在输入规模为 n 时的**典型表现**；但分析往往需要复杂计算，而且需要知道输入的分布。多数算法的最坏与平均情况公式只差**常数因子或常数项**。", C.goldText],
  ];
  items.forEach((it, i) => {
    const y = 1.05 + i * 1.18;
    card(s, 0.5, y, 9.0, 1.05, C.code);
    pill(s, it[0], 0.7, y + 0.3, 1.3, 0.42, it[2], C.white, 11.5);
    text(s, it[1], 2.15, y + 0.06, 7.2, 0.95, { fontSize: 11, valign: "middle", margin: 0 });
  });
  card(s, 0.5, 4.6, 9.0, 0.5, C.dark);
  s.addText(runs("**只报一个数字、不说针对哪种输入，这个数字就没有意义。** 例如第 8 章的快速排序平均是 O(n log n)，而输入已经有序时退化成 O(n²)。", { color: C.white, boldColor: C.gold }), { x: 0.7, y: 4.6, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 12, valign: "middle", margin: 0, isTextBox: true });
}

// 55. 3.3 时空折衷
{
  const s = content("3.3", "3 算法分析 · 时间和空间的折衷", "空间开销：静态结构好估，动态结构必须分析");
  card(s, 0.5, 1.05, 4.35, 1.85, C.code);
  pill(s, "静态存储结构", 0.7, 1.15, 1.9, 0.38, C.dark, C.gold, 11);
  bullets(s, [
    "算法所用的存储空间在执行过程中**不发生变化**；一旦确定输入数据和问题规模，数据结构大小也就确定。",
    "空间开销估算比较容易：往往**与问题规模成正比**（线性），或**不随规模增大**（常数）。",
    "本书对这类算法一般**仅讨论时间代价**。",
  ], 0.7, 1.6, 4.0, 1.25, { fontSize: 10, gap: 3 });
  card(s, 5.15, 1.05, 4.35, 1.85, C.code);
  pill(s, "动态存储结构", 5.35, 1.15, 1.9, 0.38, C.green, C.white, 11);
  bullets(s, [
    "存储空间是**变化**的，运行过程中有时会有**数量级的增大或缩小**。",
    "对于这种情况，**空间开销的分析和估计是十分必要的**。",
    "例如第 2 章顺序表的翻倍扩容、第 3 章链式结构的按需分配。",
  ], 5.35, 1.6, 4.0, 1.25, { fontSize: 10, gap: 3 });
  card(s, 0.5, 3.05, 9.0, 0.8, C.dark);
  text(s, "时空资源的折衷原理", 0.7, 3.12, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "为了改善一个算法的时间开销，往往可以**增大空间开销**为代价；反之亦然。", 0.7, 3.42, 8.6, 0.35, { fontSize: 13.5, bold: true, color: C.white, margin: 0 });
  // 黄页例子
  text(s, "例：从公司黄页数据表中快速查询公司电话", 0.5, 3.95, 5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const flow = [["逐项比较公司名", "线性增长", C.bad], ["附加散列式索引表", "+ 线性空间", C.goldText], ["散列函数算出索引值", "常数时间", C.ok]];
  flow.forEach((f, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.3, 2.85, 0.8, C.code);
    text(s, f[0], x + 0.12, 4.36, 2.6, 0.3, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
    text(s, f[1], x + 0.12, 4.66, 2.6, 0.3, { fontSize: 11.5, bold: true, color: f[2], margin: 0 });
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 2.87, y: 4.7, w: 0.16, h: 0, line: { color: C.green, width: 2, endArrowType: "triangle" } });
  });
}

// 56. 反向折衷
{
  const s = content("3.3", "3 算法分析 · 时间和空间的折衷", "反过来也成立：用时间换空间");
  bullets(s, [
    "**树的顺序存储**（第 6.3 节）：把一棵树压成一串「带右链」「带度数」的序列，**省下全部指针域**的空间，代价是恢复结构时必须**重新扫描一遍**。",
    "**稀疏矩阵**（第 12 章）：只存非零元素，省空间；随机访问某个元素则要查找。",
    "**Huffman 编码**（第 12 章）：用变长编码压缩存储，代价是编解码的时间。",
  ], 0.5, 1.05, 5.6, 1.9, { fontSize: 11.5, gap: 9 });
  card(s, 0.5, 3.1, 5.6, 0.95, C.dark);
  text(s, "没有免费的加速", 0.7, 3.18, 4, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "空间紧、时间松，和空间松、时间紧，**选的结构会不一样**。", 0.7, 3.48, 5.2, 0.5, { fontSize: 13, bold: true, color: C.white, margin: 0 });
  callout(s, "设计算法时的做法", "经常采用「以空间换时间」：为此就需要**对原有存储结构做出修改**，或者想出**全新的、更适合逻辑数据结构使用的存储方案**。", 0.5, 4.2, 5.6, 0.9, { fontSize: 11 });
  table(s, [
    ["做法", "时间", "空间"],
    [{ t: "黄页 + 散列索引" }, { t: "线性 → 常数", color: C.ok }, { t: "+ 线性", color: C.bad }],
    [{ t: "线性索引表（1.1.2）" }, { t: "扫描 → 二分", color: C.ok }, { t: "+ 一张表", color: C.bad }],
    [{ t: "树的顺序存储" }, { t: "+ 重新扫描", color: C.bad }, { t: "省下全部指针", color: C.ok }],
    [{ t: "稀疏矩阵 / Huffman" }, { t: "+ 查找 / 编解码", color: C.bad }, { t: "省下大量空间", color: C.ok }],
  ], 6.3, 1.05, 3.2, [1.4, 0.95, 0.95], { fontSize: 9.5, rowH: 0.5 });
  text(s, "同一个原理的两个方向：往哪边走，取决于**哪种资源更紧张**。", 6.3, 3.95, 3.2, 0.5, { fontSize: 10, color: C.muted });
}

// 57. 3.4 数据结构的选择和评价
{
  const s = content("3.4", "3 算法分析 · 数据结构的选择和评价", "选择数据结构的四条原则");
  text(s, "利用计算机求解一个给定问题时，一个关键任务是**确立问题模型所采用的数据结构**。一旦确定了数据结构，算法的设计便水到渠成。", 0.5, 1.02, 9, 0.35, { fontSize: 12 });
  const rules = [
    ["仔细分析所要解决的问题", "特别是求解问题所涉及的**数据类型**和**数据间的逻辑关系**。"],
    ["先做数据结构的初步设计", "在算法设计**之前**往往先进行数据结构的初步设计。"],
    ["注意可扩展性", "输入数据的**规模发生改变**时，数据结构是否还能适应？数据结构应该适应求解问题的**演变和扩展**。"],
    ["比较时空开销的优劣", "设计和选择也要**比较算法的时空开销**——这正是 3.1–3.3 节那套工具的用处。"],
  ];
  rules.forEach((r, i) => {
    const x = 0.5 + (i % 2) * 4.65, y = 1.45 + Math.floor(i / 2) * 1.15;
    card(s, x, y, 4.35, 1.0, C.code);
    numCircle(s, i + 1, x + 0.15, y + 0.12, 0.42, i === 2 ? C.gold : C.green);
    text(s, r[0], x + 0.68, y + 0.08, 3.5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, r[1], x + 0.68, y + 0.38, 3.55, 0.55, { fontSize: 10.5, margin: 0 });
  });
  card(s, 0.5, 3.85, 9.0, 1.25, C.dark);
  text(s, "落到本章的例子上", 0.7, 3.93, 4, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText(runs("2.1 节要的是**任意两点之间**的最短路径，并且只有**五个**经纪人，所以**相邻矩阵 + Floyd** 是合适的——实现简单，三重循环在 n = 5 时可以忽略。如果**顶点很多、边很少**，而且**只问单源**最短路，就应该换成**邻接表 + Dijkstra**。", { color: C.white, boldColor: C.gold }), { x: 0.7, y: 4.22, w: 8.6, h: 0.8, fontFace: FONT, fontSize: 12.5, margin: 0, isTextBox: true });
}

// 58. 附录：平台与资源
{
  const s = content("附", "附录", "平台与资源");
  const groups = [
    ["评测与实验平台", [
      "OpenJudge：cs101.openjudge.cn",
      "OJ 提交看不到出错数据 → jensen.taildf6cf3.ts.net",
      "云计算实验平台：clab.pku.edu.cn / xlab.pku.edu.cn",
    ], C.dark],
    ["练习平台", [
      "力扣：leetcode.cn",
      "Codeforces：codeforces.com",
    ], C.green],
    ["语言复健", [
      "C++：《算法笔记》配套题目 —— 晴问 sunnywhy.com（点「算法笔记」）",
      "Python 3：runoob.com/python3/python3-tutorial.html",
    ], C.goldText],
  ];
  groups.forEach((g, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.6, C.code);
    pill(s, g[0], x + 0.2, 1.3, 2.0, 0.4, g[2], C.white, 11);
    bullets(s, g[1], x + 0.15, 1.85, 2.6, 1.8, { fontSize: 10, gap: 6 });
  });
  callout(s, "课程仓库", "github.com/GMyhf/2026fall-cs201 —— 讲义、课件与题目清单都在这里；`DSA_problem_list_at_2026fall.md` 是本学期的题单。", 0.5, 3.95, 9.0, 1.15, { fontSize: 11.5 });
}

  summarySlide("本章小结", [
    ["三件事分开看", "**逻辑结构**（K, r）、**存储结构**（顺序 / 链接 / 索引 / 散列）、**运算**——混在一起谈就会跑偏。"],
    ["ADT = 逻辑结构 + 抽象操作", "`(D, R, P)`；**接口与实现分离**才有数据抽象与信息隐蔽。概念层与实现层不能混淆。"],
    ["建模决定算法", "股市传言 → 有向带权图 → 相邻矩阵 → **Floyd** → 每行取最大、再取最小（**最小化最大距离**），答案 B3。"],
    ["渐进分析", "**O** 是上限中最小的、**Ω** 是下限中最大的、上下限一致则为 **Θ**；忽略常数只在规模大时成立。"],
    ["报复杂度要交代输入", "最佳 / 最差 / **平均**（按概率加权）；再加上**时空折衷**——没有免费的加速。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
