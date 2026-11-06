// 2026 期中试卷讲评 —— 由 faq/dsa2026_mid/2026DSA_mid.md + 2026DSA_mid_answer.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/midterm_2026.js ../202609_DSA_Midterm_2026_Review.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_Midterm_2026_Review.pptx");

(async () => {
  const D = createDeck({ title: "DSA 2026 期中试卷讲评", imgDir: path.join(__dirname, "..", ".cache", "mid2026") });
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table,
    cells, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

// ---------- 本 deck 用的小积木 ----------
// 题面卡：浅色底 + 左侧金色竖条
function stem(s, str, x, y, w, h, fs = 12) {
  card(s, x, y, w, h, C.code);
  s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.08, w: 0.06, h: h - 0.16, fill: { color: C.gold }, line: { type: "none" } });
  text(s, str, x + 0.18, y + 0.08, w - 0.3, h - 0.16, { fontSize: fs, lsm: 1.15 });
}
// 答案胶囊
function answer(s, str, x, y, w = 1.6, h = 0.42, fs = 15) {
  pill(s, str, x, y, w, h, C.ok, C.white, fs);
}
// 画树：nodes = { id: [cx, cy, label, fill?, color?] }（圆心坐标），edges = [[a, b, opts?]]
function tree(s, nodes, edges, o = {}) {
  const r = o.r || 0.2;
  edges.forEach(([a, b, eo = {}]) => {
    const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
    s.addShape(pres.shapes.LINE, {
      x: x1, y: y1, w: x2 - x1, h: y2 - y1,
      line: { color: eo.color || C.green, width: eo.width || 1.25, dashType: eo.dash ? "dash" : "solid", endArrowType: eo.arrow ? "triangle" : undefined },
    });
    if (eo.label) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 < x1 ? -0.17 : 0.17;
      text(s, eo.label, mx + dx - 0.15, my - 0.16, 0.3, 0.2, { fontSize: 9, bold: true, color: eo.lcolor || C.goldText, align: "center", margin: 0 });
    }
  });
  Object.values(nodes).forEach(([cx, cy, label, fill, color]) => {
    s.addShape(pres.shapes.OVAL, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: fill || C.mint }, line: { color: C.green, width: 1 } });
    text(s, String(label), cx - r - 0.1, cy - r, 2 * r + 0.2, 2 * r, { fontSize: o.fs || 11, bold: true, color: color || C.dark, align: "center", valign: "middle", margin: 0, lsm: 0.85 });
  });
}
// 完全二叉树（堆）：按数组画；hl = { 下标: 填充色 }
function heapTree(s, arr, x0, y0, w, dy = 0.55, hl = {}) {
  const nodes = {}, edges = [];
  arr.forEach((v, i) => {
    const lv = Math.floor(Math.log2(i + 1)), pos = i + 1 - 2 ** lv;
    nodes[i] = [x0 + ((pos + 0.5) * w) / 2 ** lv, y0 + lv * dy, v, hl[i]];
    if (i > 0) edges.push([Math.floor((i - 1) / 2), i]);
  });
  tree(s, nodes, edges, { r: 0.18, fs: 10 });
}
const RED = "F6D5D0", GOLDF = "FBE3A6", GREENF = "BFE3CF";

// =====================================================================
// 1. 封面
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall · 期中讲评",
  title: "2026 期中试卷讲评",
  subtitle: "14 道题 · 100 分：答案、思路与常见失分点",
  topics: "选择：出栈序列 · 循环队列计数 · 朴素匹配 vs KMP · 孩子—兄弟表示\n填空：顺序表删除 · 最小堆插删 · 先序+中序建树 · 森林结点计数\n简答：并查集（路径压缩 + 按大小合并）· Huffman 编码\n算法填空：显式栈做多叉树后序遍历\n设计：链表回文 O(1) 空间 · BST 区间删除（四种解法）· 森林最宽层",
  footer: "Compiled by Hongfei Yan · Updated 2026-11-05 · 参考答案附可运行 Python",
});

// 2. 试卷地图
{
  const s = content("≡", "试卷概览", "14 道题考了什么");
  table(s, [
    ["题号", "题型", "分值", "考点", "对应章节"],
    ["一.1", "选择", "3", "出栈序列的合法性", "第 3 章 栈"],
    ["一.2", "选择", "3", "循环队列 front / rear 与出入队次数", "第 3 章 队列"],
    ["一.3", "选择", "3", "朴素匹配、KMP（next / 优化 next）比较次数", "第 4 章 字符串"],
    ["一.4", "选择", "3", "孩子—兄弟表示法的指针含义", "第 6 章 树"],
    ["二.1", "填空", "3", "顺序表删除的平均移动次数", "第 2 章 线性表"],
    ["二.2", "填空", "3", "最小堆插入（上调）与删除（下沉）", "第 5 章 二叉树"],
    ["二.3", "填空", "3", "先序 + 中序 → 后序", "第 5 章 二叉树"],
    ["二.4", "填空", "3", "森林中结点数与边数的关系", "第 6 章 树"],
    ["三.1", "简答", "10", "并查集：完全路径压缩 + 按大小合并", "第 6 章 树"],
    ["三.2", "简答", "10", "Huffman 树、平均码长、节省比例", "第 5 章 二叉树"],
    ["四", "算法填空", "12", "显式栈实现多叉树后序遍历", "第 3 / 6 章"],
    ["五.1", "设计", "14", "单链表回文，O(n) 时间、O(1) 空间", "第 2 章 线性表"],
    ["五.2", "设计", "14", "BST 删除闭区间 [L, R] 内全部结点", "第 5 章 BST"],
    ["五.3", "设计", "16", "孩子—兄弟森林的最宽层（层次遍历）", "第 6 章 树"],
  ], 0.5, 1.0, 9.0, [0.7, 0.95, 0.65, 4.6, 2.1], { fontSize: 9.5, rowH: 0.27, tight: true });
}

// =====================================================================
sectionSlide("第一部分 · 12 分", "一、选择题", "出栈序列 · 循环队列 · 朴素匹配与 KMP · 孩子—兄弟表示法");

// 一.1 出栈序列
{
  const s = content("一.1", "选择题 · 栈", "哪个出栈序列不可能？");
  stem(s, "元素按 1, 2, 3, 4, 5 的次序入栈，每个元素恰好入栈、出栈一次，允许交替进行。不可能的出栈序列是：\nA. 2, 1, 4, 3, 5　　B. 3, 2, 1, 5, 4　　C. 1, 4, 3, 2, 5　　**D. 3, 1, 2, 4, 5**", 0.5, 1.0, 9.0, 0.85, 12);
  answer(s, "答案  D", 0.5, 2.0);
  table(s, [
    ["选项", "模拟（push 记 +k，pop 记 −k）", "结论"],
    ["A", "+1 +2 −2 −1 +3 +4 −4 −3 +5 −5", { t: "可以", color: C.ok, bold: true }],
    ["B", "+1 +2 +3 −3 −2 −1 +4 +5 −5 −4", { t: "可以", color: C.ok, bold: true }],
    ["C", "+1 −1 +2 +3 +4 −4 −3 −2 +5 −5", { t: "可以", color: C.ok, bold: true }],
    ["D", "+1 +2 +3 −3　此时栈为 [1, 2]，栈顶是 2，要出 1 → 卡住", { t: "不可能", color: C.bad, bold: true }],
  ], 0.5, 2.55, 5.9, [0.6, 4.35, 0.95], { fontSize: 10.5, rowH: 0.34 });
  callout(s, "判定方法：贪心模拟", [
    "按目标序列逐个取数 x：x 还没入栈，就把 ≤ x 的都压进去；然后栈顶必须**恰好**是 x。",
    "等价的「禁止模式」：不存在 i < j < k 使 **k 先出、然后 i、再 j**。",
    "D 的开头 **3, 1, 2** 正是这个模式。",
  ], 6.6, 2.0, 2.9, 3.1, { fontSize: 10.5 });
}

// 一.2 循环队列
{
  const s = content("一.2", "选择题 · 循环队列", "front = 3、rear = 2：入队、出队各几次？");
  stem(s, "数组 `Q[0..7]`，空一格区分空满，`front` 指队头、`rear` 指下一个入队位置；初始 front = rear = 0。若干次**成功**的入队 e 次、出队 d 次后 front = 3，rear = 2。可能成立的是：\n**A. e=10, d=3**　　B. e=2, d=3　　C. e=10, d=11　　D. e=18, d=3", 0.5, 1.0, 9.0, 1.0, 12);
  answer(s, "答案  A", 0.5, 2.15);
  bullets(s, [
    "**三个必要条件**",
    { t: "当前元素数 (rear − front + 8) % 8 = (2 − 3 + 8) % 8 = **7** —— 队列已满（容量 7）", sub: true },
    { t: "所以 **e − d = 7**；又 rear = e % 8 = 2，front = d % 8 = 3", sub: true },
    "**A** 的可行顺序：入队 7 次（满，rear=7）→ 出队 3 次（front=3）→ 入队 3 次（rear = 10 % 8 = 2）",
    "**B、C**：e − d = −1，出队比入队还多，不可能",
    "**D**：18 % 8 = 2、3 % 8 = 3 都对得上，但 e − d = 15 > 7，**超过容量**",
  ], 0.5, 2.7, 5.6, 2.4, { fontSize: 11.5, gap: 5 });
  // 队列示意
  const vals = ["c", "d", "", "x", "y", "z", "a", "b"];
  cells(s, 6.25, 2.6, vals, { cw: 0.4, ch: 0.42, idx: true, fills: vals.map((v) => (v ? C.mint : C.white)) });
  text(s, "front", 6.25 + 3 * 0.4 - 0.2, 2.3, 0.8, 0.22, { fontSize: 9, bold: true, color: C.bad, align: "center", margin: 0 });
  text(s, "rear", 6.25 + 2 * 0.4 - 0.2, 3.25, 0.8, 0.22, { fontSize: 9, bold: true, color: C.green, align: "center", margin: 0 });
  callout(s, "易错", [
    "只看模 8 余数而忘了**容量上限**（D）。",
    "题目说「成功的」入队：队满时入队失败**不计入** e。",
  ], 6.25, 3.65, 3.25, 1.45, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 一.3 朴素匹配
{
  const s = content("一.3", "选择题 · 字符串匹配", "T = aaacaaab，P = aaab：朴素匹配比较几次？");
  stem(s, "只计搜索阶段**文本字符与模式字符**的相等性比较（不计建表、整数比较）。三种算法——朴素、普通 `next`、优化 `next`——的比较次数依次为：\n**A. 14, 11, 9**　　B. 14, 9, 7　　C. 16, 11, 9　　D. 14, 11, 11", 0.5, 1.0, 9.0, 0.95, 12);
  answer(s, "答案  A", 0.5, 2.1);
  table(s, [
    ["起点 i", "对齐情况", "比较", "次数"],
    [{ t: "0", mono: true }, { t: "aaac… vs aaab", mono: true }, "a a a 相等，c ≠ b", "4"],
    [{ t: "1", mono: true }, { t: "aac… vs aaa…", mono: true }, "a a 相等，c ≠ a", "3"],
    [{ t: "2", mono: true }, { t: "ac… vs aa…", mono: true }, "a 相等，c ≠ a", "2"],
    [{ t: "3", mono: true }, { t: "c… vs a…", mono: true }, "c ≠ a", "1"],
    [{ t: "4", mono: true }, { t: "aaab vs aaab", mono: true }, "全部相等，匹配成功", "4"],
    [{ t: "", }, { t: "" }, { t: "合计", bold: true }, { t: "14", bold: true, color: C.bad }],
  ], 0.5, 2.65, 5.9, [0.8, 2.0, 2.3, 0.8], { fontSize: 10.5, rowH: 0.33 });
  callout(s, "朴素法的浪费", [
    "起点 1、2、3 都在**同一个 c**（T[3]）上反复失败。",
    "KMP 不回退文本指针 i：遇到 c 时只让模式指针 j 沿 `next` 回跳。",
    "下一页看这次失配，`next` 与优化 `next` 各要比较几次。",
  ], 6.6, 2.1, 2.9, 3.0, { fontSize: 10.5 });
}

// 一.3 KMP
{
  const s = content("一.3", "选择题 · 字符串匹配", "普通 next 比 11 次，优化 next 比 9 次");
  table(s, [
    ["j", "0", "1", "2", "3"],
    ["P[j]", { t: "a", mono: true }, { t: "a", mono: true }, { t: "a", mono: true }, { t: "b", mono: true }],
    ["next[j]", "−1", "0", "1", "2"],
    ["优化 next[j]", { t: "−1", bold: true, color: C.bad }, { t: "−1", bold: true, color: C.bad }, { t: "−1", bold: true, color: C.bad }, "2"],
  ], 0.5, 1.0, 4.3, [1.5, 0.7, 0.7, 0.7, 0.7], { fontSize: 11, rowH: 0.3, align: "center" });
  text(s, "优化：若 P[j] == P[next[j]]，回跳到那里必然再失配，就直接用 next[next[j]]。P[1..2] 都等于 P[0..1]，所以连跳到 −1。", 0.5, 2.3, 4.3, 0.75, { fontSize: 10.5, color: C.muted });
  table(s, [
    ["阶段", "普通 next", "优化 next"],
    ["T[0..2] 与 P[0..2]", "3（相等）", "3（相等）"],
    ["T[3] = c 失配", "与 P[3]、P[2]、P[1]、P[0] 各比 1 次 = 4", "与 P[3]、P[2] = 2，随后 j = −1"],
    ["T[4..7] 与 P[0..3]", "4（相等，匹配）", "4（相等，匹配）"],
    [{ t: "合计", bold: true }, { t: "11", bold: true, color: C.bad }, { t: "9", bold: true, color: C.bad }],
  ], 0.5, 3.1, 9.0, [2.0, 3.9, 3.1], { fontSize: 10.5, rowH: 0.36 });
  callout(s, "要点", [
    "KMP 中**文本指针不回退**，比较次数 ≤ 2n。",
    "优化 next 跳过「必定失败」的比较：这里省掉 c 与 P[1]、P[0] 的两次比较。",
    "数次数时先定好规则：**哨兵 j = −1 不算比较**。",
  ], 5.0, 1.0, 4.5, 1.95, { fontSize: 10.5 });
}

// 一.4 孩子—兄弟
{
  const s = content("一.4", "选择题 · 树的存储", "孩子—兄弟表示法：哪个说法正确？");
  stem(s, "A. `p->nextSibling` 指向 p 的第二个孩子　　B. p 是叶子 ⟺ p 的两个指针都为空\n**C. p 是叶子 ⟺ `p->firstChild` 为空**　　D. `p->firstChild->nextSibling` 非空时一定指向 p 的孙子", 0.5, 1.0, 9.0, 0.7, 11.5);
  answer(s, "答案  C", 0.5, 1.85);
  // 原树
  text(s, "原树", 0.6, 2.45, 1, 0.25, { fontSize: 10, bold: true, color: C.green, margin: 0 });
  tree(s, {
    A: [2.0, 2.75, "A"], B: [1.1, 3.55, "B"], Cc: [2.0, 3.55, "C", GOLDF], Dd: [2.9, 3.55, "D"],
    E: [0.7, 4.35, "E"], F: [1.5, 4.35, "F"],
  }, [["A", "B"], ["A", "Cc"], ["A", "Dd"], ["B", "E"], ["B", "F"]]);
  // 孩子兄弟
  text(s, "孩子—兄弟链：实线 firstChild\n虚线 nextSibling", 3.5, 2.3, 3.0, 0.25, { fontSize: 10, bold: true, color: C.green, margin: 0 });
  tree(s, {
    A: [3.9, 2.85, "A"], B: [3.9, 3.65, "B"], Cc: [4.9, 3.65, "C", GOLDF], Dd: [5.9, 3.65, "D"],
    E: [3.9, 4.45, "E"], F: [4.9, 4.45, "F"],
  }, [["A", "B", {}], ["B", "Cc", { dash: true, color: C.goldText }], ["Cc", "Dd", { dash: true, color: C.goldText }],
    ["B", "E", {}], ["E", "F", { dash: true, color: C.goldText }]]);
  callout(s, "逐项看（p 取 A 或 C）", [
    "A ✗ `A->nextSibling` 是 A 的**兄弟**，与 A 的孩子无关。",
    "B ✗ C 是叶子，但 `C->nextSibling = D` 非空。",
    "**C ✓** 没有孩子 ⟺ `firstChild` 为空。",
    "D ✗ `A->firstChild->nextSibling` 是 C：A 的**第二个孩子**，不是孙子。",
  ], 6.55, 1.85, 2.95, 3.25, { fontSize: 10.5 });
}

// =====================================================================
sectionSlide("第二部分 · 12 分", "二、填空题", "顺序表删除 · 最小堆 · 先序 + 中序建树 · 森林结点计数");

// 二.1 顺序表
{
  const s = content("二.1", "填空题 · 顺序表", "长度 100 的顺序表删除一个元素，平均移动几个？");
  answer(s, "49.5", 0.5, 1.05, 1.6);
  text(s, "删除第 i 个元素（i = 1..n）要把后面 n − i 个元素前移一位；等概率 1/n：", 0.5, 1.65, 9.0, 0.3, { fontSize: 12.5 });
  card(s, 0.5, 2.05, 9.0, 0.75, C.code);
  text(s, "E(删除) = (1/n)·Σ(n − i) = (1/n)·(0 + 1 + … + (n−1)) = (n − 1)/2 = 99/2 = 49.5", 0.7, 2.05, 8.6, 0.75, { fontSize: 13, bold: true, color: C.dark, valign: "middle", fontFace: MONO });
  table(s, [
    ["操作", "位置数", "移动个数", "平均"],
    ["插入", "n + 1 个位置（0..n）", "n − i", { t: "n / 2", bold: true }],
    ["删除", "n 个元素", "n − i", { t: "(n − 1) / 2", bold: true, color: C.bad }],
  ], 0.5, 3.0, 5.5, [0.9, 1.9, 1.3, 1.4], { fontSize: 11, rowH: 0.36 });
  callout(s, "易错", [
    "把删除和插入记混，写成 **50**。",
    "删除最后一个元素移动 **0** 次，所以分子从 0 加到 n − 1。",
  ], 6.25, 3.0, 3.25, 1.6, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
}

// 二.2 堆插入
{
  const s = content("二.2", "填空题 · 最小堆", "(1) 插入 5：放到末尾，逐层上调");
  text(s, "数组 {4, 9, 7, 15, 12, 10, 11}，下标从 0 开始：父 = (i − 1) / 2，孩子 = 2i + 1、2i + 2", 0.5, 1.0, 9.0, 0.3, { fontSize: 11.5, color: C.muted });
  const steps = [
    ["放到末尾 i = 7", [4, 9, 7, 15, 12, 10, 11, 5], { 7: GOLDF, 3: RED }, "父 i=3 是 15 > 5，交换"],
    ["上调到 i = 3", [4, 9, 7, 5, 12, 10, 11, 15], { 3: GOLDF, 1: RED }, "父 i=1 是 9 > 5，交换"],
    ["上调到 i = 1", [4, 5, 7, 9, 12, 10, 11, 15], { 1: GOLDF, 0: GREENF }, "父 i=0 是 4 ≤ 5，停止"],
  ];
  steps.forEach(([lab, arr, hl, note], k) => {
    const y = 1.45 + k * 0.95;
    text(s, lab, 0.5, y, 1.4, 0.42, { fontSize: 10.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    cells(s, 1.9, y, arr, { cw: 0.38, ch: 0.42, idx: true, fs: 11, fills: arr.map((_, i) => hl[i] || C.mint) });
    text(s, note, 1.9, y + 0.62, 3.2, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
  });
  heapTree(s, [4, 5, 7, 9, 12, 10, 11, 15], 5.3, 1.6, 4.2, 0.62, { 1: GOLDF, 3: GOLDF, 7: GOLDF });
  answer(s, "{4, 5, 7, 9, 12, 10, 11, 15}", 5.7, 4.3, 3.6, 0.45, 13);
}

// 二.2 堆删除
{
  const s = content("二.2", "填空题 · 最小堆", "(2) 删除最小值：末尾补到堆顶，逐层下沉");
  text(s, "从 (1) 的结果 {4, 5, 7, 9, 12, 10, 11, 15} 开始；下沉时与**较小**的孩子比较", 0.5, 1.0, 9.0, 0.3, { fontSize: 11.5, color: C.muted });
  const steps = [
    ["15 移到堆顶", [15, 5, 7, 9, 12, 10, 11], { 0: GOLDF, 1: RED }, "孩子 5、7 中较小者 5 < 15，交换"],
    ["下沉到 i = 1", [5, 15, 7, 9, 12, 10, 11], { 1: GOLDF, 3: RED }, "孩子 9、12 中较小者 9 < 15，交换"],
    ["下沉到 i = 3", [5, 9, 7, 15, 12, 10, 11], { 3: GOLDF }, "孩子下标 7、8 越界，停止"],
  ];
  steps.forEach(([lab, arr, hl, note], k) => {
    const y = 1.45 + k * 0.95;
    text(s, lab, 0.5, y, 1.4, 0.42, { fontSize: 10.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    cells(s, 1.9, y, arr, { cw: 0.38, ch: 0.42, idx: true, fs: 11, fills: arr.map((_, i) => hl[i] || C.mint) });
    text(s, note, 1.9, y + 0.62, 3.2, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
  });
  heapTree(s, [5, 9, 7, 15, 12, 10, 11], 5.3, 1.6, 4.2, 0.62, { 0: GOLDF, 1: GOLDF, 3: GOLDF });
  answer(s, "{5, 9, 7, 15, 12, 10, 11}", 5.7, 3.75, 3.6, 0.45, 13);
  callout(s, "易错", "下沉要和**较小**的孩子交换；和左孩子无脑交换会破坏堆序。", 5.3, 4.35, 4.2, 0.75, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 二.3 先序+中序
{
  const s = content("二.3", "填空题 · 二叉树遍历", "先序 A B D E C F G，中序 D B E A F C G → 后序？");
  answer(s, "D E B F G C A", 0.5, 1.05, 2.6);
  bullets(s, [
    "先序第一个 **A** 是根；在中序里切开：左 `D B E`，右 `F C G`",
    "左子树先序 `B D E`：根 **B**，中序 `D | B | E` → 左 D、右 E",
    "右子树先序 `C F G`：根 **C**，中序 `F | C | G` → 左 F、右 G",
    "后序 = 左子树后序 + 右子树后序 + 根 = `D E B` + `F G C` + `A`",
  ], 0.5, 1.7, 5.4, 2.4, { fontSize: 12, gap: 8 });
  tree(s, {
    A: [7.6, 1.5, "A", GOLDF], B: [6.6, 2.4, "B"], Cc: [8.6, 2.4, "C"],
    Dd: [6.05, 3.3, "D"], E: [7.15, 3.3, "E"], F: [8.05, 3.3, "F"], G: [9.15, 3.3, "G"],
  }, [["A", "B"], ["A", "Cc"], ["B", "Dd"], ["B", "E"], ["Cc", "F"], ["Cc", "G"]], { r: 0.24 });
  callout(s, "规律", "先序 / 后序定根，中序分左右。只有先序 + 后序则**不能**唯一确定二叉树（单孩子分不清左右）。", 0.5, 4.2, 9.0, 0.85, { fontSize: 11 });
}

// 二.4 森林计数
{
  const s = content("二.4", "填空题 · 森林", "3 棵树，度 1/2/3 的结点 4/3/2 个：叶子几个？");
  answer(s, "10 个叶子，19 个结点", 0.5, 1.05, 3.2);
  card(s, 0.5, 1.7, 5.4, 2.3, C.code);
  text(s, "**① 按度数数结点**\nn = n₀ + 4 + 3 + 2 = n₀ + 9\n\n**② 两种方式数边**\n按孩子数：边 = 1×4 + 2×3 + 3×2 = 16\n按森林性质：k 棵树有 n − k 条边 → 边 = n − 3\n\n⇒ n = 19，n₀ = 10", 0.7, 1.8, 5.0, 2.15, { fontSize: 12, lsm: 1.1 });
  callout(s, "通用公式", [
    "一棵树：n₀ = 1 + n₂ + 2n₃ + …",
    "k 棵树的森林：n₀ = **k** + n₂ + 2n₃ + …",
    "本题：3 + 0×4 + 1×3 + 2×2 = **10**",
  ], 6.15, 1.7, 3.35, 2.3, { fontSize: 11 });
  callout(s, "易错", "套用单棵树公式 n = 边 + 1，得到 n₀ = 8、n = 17。森林**每多一棵树就少一条边**。", 0.5, 4.2, 9.0, 0.85, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
}

// =====================================================================
sectionSlide("第三部分 · 20 分", "三、辨析与简答", "并查集：完全路径压缩 + 按大小合并 · Huffman 编码树与平均码长");

// 三.1 初始
{
  const s = content("三.1", "简答 · 并查集", "(1) 初始数组表示几个集合？");
  text(s, "根存 −(集合大小)，非根存父下标；Find 做完全路径压缩；Union 先两次 Find，再小挂大，等大取小编号为根。", 0.5, 1.0, 9.0, 0.45, { fontSize: 11.5, color: C.muted });
  const P0 = [-4, 0, 1, 0, -3, 4, 5, -2, 7, -1];
  text(s, "p =", 0.5, 1.55, 0.5, 0.42, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 1.0, 1.55, P0, { cw: 0.5, ch: 0.42, idx: true, fs: 11, fills: P0.map((v) => (v < 0 ? GOLDF : C.mint)) });
  tree(s, {
    a0: [1.3, 2.75, "0", GOLDF], a1: [0.9, 3.5, "1"], a3: [1.7, 3.5, "3"], a2: [0.9, 4.25, "2"],
    b4: [3.0, 2.75, "4", GOLDF], b5: [3.0, 3.5, "5"], b6: [3.0, 4.25, "6"],
    c7: [4.3, 2.75, "7", GOLDF], c8: [4.3, 3.5, "8"],
    d9: [5.5, 2.75, "9", GOLDF],
  }, [["a0", "a1"], ["a0", "a3"], ["a1", "a2"], ["b4", "b5"], ["b5", "b6"], ["c7", "c8"]], { r: 0.2 });
  answer(s, "4 个集合", 6.3, 2.55, 1.6);
  bullets(s, ["{0, 1, 2, 3}　大小 4", "{4, 5, 6}　大小 3", "{7, 8}　大小 2", "{9}　大小 1"], 6.3, 3.15, 3.2, 1.6, { fontSize: 12.5, gap: 4 });
  text(s, "注意 2 → 1 → 0、6 → 5 → 4 都是两层深：这正是后面路径压缩要处理的路径。", 0.5, 4.65, 9.0, 0.4, { fontSize: 11, color: C.goldText, bold: true });
}

// 三.1 Union / Find
{
  const s = content("三.1", "简答 · 并查集", "(2) Union(2, 6)　(3) 再 Find(6)");
  table(s, [
    ["步骤", "做了什么", "数组变化"],
    ["Find(2)", "路径 2 → 1 → 0，压缩为 2 → 0", { t: "p[2] = 0", mono: true }],
    ["Find(6)", "路径 6 → 5 → 4，压缩为 6 → 4", { t: "p[6] = 4", mono: true }],
    ["合并", "大小 3 < 4：根 4 挂到根 0 下", { t: "p[4] = 0, p[0] = −7", mono: true }],
    ["Find(6)", "路径 6 → 4 → 0，压缩为 6 → 0", { t: "p[6] = 0", mono: true }],
  ], 0.5, 1.0, 9.0, [1.1, 4.6, 3.3], { fontSize: 11, rowH: 0.32 });
  const P1 = [-7, 0, 0, 0, 0, 4, 4, -2, 7, -1], P2 = [-7, 0, 0, 0, 0, 4, 0, -2, 7, -1];
  text(s, "(2)", 0.5, 2.85, 0.5, 0.4, { fontSize: 12, bold: true, color: C.ok, valign: "middle", margin: 0 });
  cells(s, 1.0, 2.85, P1, { cw: 0.4, ch: 0.4, idx: true, fs: 10.5, fills: P1.map((_, i) => ([0, 2, 4, 6].includes(i) ? GOLDF : C.mint)) });
  text(s, "(3)", 0.5, 3.75, 0.5, 0.4, { fontSize: 12, bold: true, color: C.ok, valign: "middle", margin: 0 });
  cells(s, 1.0, 3.75, P2, { cw: 0.4, ch: 0.4, idx: true, fs: 10.5, fills: P2.map((_, i) => (i === 6 ? GOLDF : C.mint)) });
  tree(s, {
    r0: [7.3, 2.75, "0", GOLDF], n1: [6.1, 3.5, "1"], n2: [6.7, 3.5, "2"], n3: [7.3, 3.5, "3"], n4: [7.9, 3.5, "4"], n6b: [8.5, 3.5, "6", GOLDF],
    n5: [7.6, 4.3, "5"],
  }, [["r0", "n1"], ["r0", "n2"], ["r0", "n3"], ["r0", "n4"], ["r0", "n6b", { dash: true, color: C.goldText }], ["n4", "n5"]], { r: 0.19, fs: 10 });
  text(s, "(3) 之后的 {0..6}：6 由挂在 4 下改为直接挂到 0", 5.85, 4.6, 3.7, 0.25, { fontSize: 9, color: C.muted, margin: 0 });
  callout(s, "最常见的两个错", [
    "Union 后把 **p[6] 写成 0**：合并只改根，不会顺带压缩 6。",
    "忘了 Union 内两次 Find 的压缩：p[2] 仍写 1、p[6] 仍写 5。",
  ], 0.5, 4.3, 5.1, 0.82, { fontSize: 9.5, fill: "FDF0EE", tcolor: C.bad, tsize: 10.5, gap: 1 });
}

// 三.1 代码
{
  const s = content("三.1", "简答 · 并查集", "按题目规定实现：可运行并断言比对");
  codeBlock(s, `def find(p, x):
    """返回根，并把 x 到根路径上的结点直接挂到根下。"""
    root = x
    while p[root] >= 0:                # 非根存父下标
        root = p[root]
    while p[x] >= 0 and p[x] != root:  # 第二趟：改挂到根
        nxt = p[x]
        p[x] = root
        x = nxt
    return root

def union(p, x, y):
    rx, ry = find(p, x), find(p, y)
    if rx == ry:
        return
    # 根存 -size：size 大者为新根；相等取编号小者
    if (-p[rx], -rx) < (-p[ry], -ry):
        rx, ry = ry, rx                # 保证 rx 是新根
    p[rx] += p[ry]                     # -(size 之和)
    p[ry] = rx

p = [-4, 0, 1, 0, -3, 4, 5, -2, 7, -1]
union(p, 2, 6); print(p)
find(p, 6);     print(p)`, 0.5, 1.0, 5.9, 4.1, { lang: "py", fontSize: 9.5 });
  consoleBlock(s, "[-7, 0, 0, 0, 0, 4, 4, -2, 7, -1]\n[-7, 0, 0, 0, 0, 4, 0, -2, 7, -1]", 6.6, 1.0, 2.9, 0.95, 9);
  callout(s, "两条改进", [
    "**按大小合并**：树高 ≤ log₂ n。",
    "**路径压缩**：查一次，整条路径变扁。",
    "两者合用，m 次操作 O(m·α(n))，α 实际 ≤ 4。",
    "根里存 **−size**：一个数组同时记父亲与大小。",
  ], 6.6, 2.15, 2.9, 2.95, { fontSize: 10.5 });
}

// 三.2 Huffman 构造
{
  const s = content("三.2", "简答 · Huffman 编码", "(1) 每次合并权值最小的两棵树");
  text(s, "A 5%　B 9%　C 12%　D 16%　E 25%　F 33%", 0.5, 1.0, 4.4, 0.3, { fontSize: 12, bold: true, color: C.dark, fontFace: MONO });
  table(s, [
    ["轮", "取出最小两个", "合并为", "剩余"],
    ["1", "5 (A), 9 (B)", "14", "12 14 16 25 33"],
    ["2", "12 (C), 14", "26", "16 25 26 33"],
    ["3", "16 (D), 25 (E)", "41", "26 33 41"],
    ["4", "26, 33 (F)", "59", "41 59"],
    ["5", "41, 59", "100", "100"],
  ], 0.5, 1.45, 4.4, [0.45, 1.5, 0.75, 1.7], { fontSize: 10.5, rowH: 0.32 });
  callout(s, "评分口径", [
    "左右孩子可交换，树**不唯一**；但带权路径长度唯一。",
    "必须标出**内部结点的权值**。",
  ], 0.5, 3.6, 4.4, 1.45, { fontSize: 10.5 });
  tree(s, {
    r: [7.2, 1.3, "100", GOLDF], a41: [6.0, 2.0, "41"], a59: [8.4, 2.0, "59"],
    Dd: [5.4, 2.75, "D\n16"], E: [6.6, 2.75, "E\n25"], a26: [7.8, 2.75, "26"], F: [9.0, 2.75, "F\n33"],
    Cc: [7.2, 3.55, "C\n12"], a14: [8.4, 3.55, "14"],
    A: [7.8, 4.35, "A\n5"], B: [9.0, 4.35, "B\n9"],
  }, [["r", "a41", { label: "0" }], ["r", "a59", { label: "1" }], ["a41", "Dd", { label: "0" }], ["a41", "E", { label: "1" }],
    ["a59", "a26", { label: "0" }], ["a59", "F", { label: "1" }], ["a26", "Cc", { label: "0" }], ["a26", "a14", { label: "1" }],
    ["a14", "A", { label: "0" }], ["a14", "B", { label: "1" }]], { r: 0.27, fs: 9.5 });
}

// 三.2 码长
{
  const s = content("三.2", "简答 · Huffman 编码", "(2) 平均码长 2.4 位　(3) 比定长码节省 20%");
  table(s, [
    ["字符", "频率", "编码（左 0 右 1）", "码长", "频率 × 码长"],
    ["A", "5", { t: "1010", mono: true }, "4", "20"],
    ["B", "9", { t: "1011", mono: true }, "4", "36"],
    ["C", "12", { t: "100", mono: true }, "3", "36"],
    ["D", "16", { t: "00", mono: true }, "2", "32"],
    ["E", "25", { t: "01", mono: true }, "2", "50"],
    ["F", "33", { t: "11", mono: true }, "2", "66"],
    [{ t: "合计", bold: true }, "100", "", "", { t: "240", bold: true, color: C.bad }],
  ], 0.5, 1.0, 5.2, [0.75, 0.8, 1.75, 0.75, 1.15], { fontSize: 11, rowH: 0.34, align: "center" });
  card(s, 5.95, 1.0, 3.55, 1.6, C.code);
  text(s, "(2) L = 240 / 100 = **2.4** 位\n\n(3) 6 种字符定长需 ⌈log₂6⌉ = **3** 位\n节省 (3 − 2.4) / 3 = **20%**", 6.1, 1.1, 3.3, 1.45, { fontSize: 12 });
  callout(s, "易错", [
    "平均码长忘了**按频率加权**，算成 (4+4+3+2+2+2)/6。",
    "节省比例的分母是**定长码 3**，不是 2.4（写成 25%）。",
    "定长码取 ⌈log₂ 6⌉ = 3，不是 6 或 8。",
  ], 5.95, 2.8, 3.55, 2.3, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  text(s, "Huffman 树是**最优前缀码**：任何前缀码的平均码长都 ≥ 2.4。", 0.5, 4.0, 5.2, 0.5, { fontSize: 11, color: C.goldText });
}

// =====================================================================
sectionSlide("第四部分 · 12 分", "四、算法填空", "只用一个栈，做多叉树的后序遍历：栈元素 (u, k) 是「书签」");

// 四 题面
{
  const s = content("四", "算法填空 · 显式栈", "栈元素 (u, k)：u 的前 k 个孩子子树已遍历完");
  codeBlock(s, `PostOrder(root):
    if root == null:
        return
    S = 空栈
    S.push((root, 0))
    while __________(1):
        (u, k) = S.pop()
        if k == __________(2):
            __________(3)
        else:
            S.push(__________(4))
            S.push((__________(5), 0))`, 0.5, 1.0, 4.7, 3.0, { lang: "text", fontSize: 11 });
  text(s, "可用：childCount(u)、child(u, k)（k 从 0 编号）、Visit(u)；栈 push / pop / empty", 0.5, 4.15, 4.7, 0.6, { fontSize: 10.5, color: C.muted });
  callout(s, "先读懂记号：两个 k 不是一回事", [
    "「第 k 个孩子（从 0 编号）」：k 是**下标**。",
    "「前 k 个孩子」：k 是**个数**，即下标 0 … k−1。",
    "所以 (u, k) = 下标 0…k−1 已完成，**下一个要进的是 child(u, k)**。",
    "初始 (root, 0)：一个都没做；k == childCount(u)：全做完，可以访问 u。",
  ], 5.45, 1.0, 4.05, 2.75, { fontSize: 10.5 });
  callout(s, "想一想", "弹出 (u, k) 后，进入孩子前要先把什么压回去？", 5.45, 3.95, 4.05, 1.15, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 四 答案
{
  const s = content("四", "算法填空 · 显式栈", "答案：先压书签 (u, k+1)，再压孩子");
  codeBlock(s, `PostOrder(root):
    if root == null:
        return
    S = 空栈
    S.push((root, 0))
    while not S.empty():              // (1)
        (u, k) = S.pop()
        if k == childCount(u):        // (2) 孩子全做完
            Visit(u)                  // (3)
        else:
            S.push((u, k + 1))        // (4) 书签
            S.push((child(u, k), 0))  // (5) 进入孩子 k`, 0.5, 1.0, 5.6, 3.0, { lang: "cpp", fontSize: 10, hl: [6, 8, 9, 11, 12] });
  callout(s, "为什么是这个顺序", [
    "栈**后进先出**：后压的孩子先处理，整棵孩子子树做完后才轮到书签。",
    "(4)、(5) 顺序颠倒就变成先回到 u，后序被破坏。",
  ], 6.3, 1.0, 3.2, 1.95, { fontSize: 10.5 });
  callout(s, "复杂度", [
    "时间 **O(n)**：每个结点进栈 1 + childCount(u) 次，总计 n + (n − 1)。",
    "辅助空间 **O(h)**：栈里恰是根到当前结点路径上的结点。",
  ], 6.3, 3.1, 3.2, 2.0, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "易错：(4) 写成 (u, k) 会无限循环；(5) 写成 child(u, k+1) 会跳过第 0 个孩子。", 0.5, 4.2, 5.6, 0.6, { fontSize: 11, bold: true, color: C.bad });
}

// 四 trace
{
  const s = content("四", "算法填空 · 显式栈", "在一棵小树上手算：输出 E F B C G D A");
  table(s, [
    ["#", "弹出", "动作", "操作后栈（右端为栈顶）"],
    ["1", "(A,0)", "进孩子 B", "(A,1) (B,0)"],
    ["2", "(B,0)", "进孩子 E", "(A,1) (B,1) (E,0)"],
    ["3", "(E,0)", { t: "Visit E", bold: true, color: C.ok }, "(A,1) (B,1)"],
    ["4", "(B,1)", "进孩子 F", "(A,1) (B,2) (F,0)"],
    ["5", "(F,0)", { t: "Visit F", bold: true, color: C.ok }, "(A,1) (B,2)"],
    ["6", "(B,2)", { t: "Visit B", bold: true, color: C.ok }, "(A,1)"],
    ["7", "(A,1)", "进孩子 C", "(A,2) (C,0)"],
    ["8", "(C,0)", { t: "Visit C", bold: true, color: C.ok }, "(A,2)"],
    ["9", "(A,2)", "进孩子 D", "(A,3) (D,0)"],
    ["10", "(D,0)", "进孩子 G", "(A,3) (D,1) (G,0)"],
    ["11", "(G,0)", { t: "Visit G", bold: true, color: C.ok }, "(A,3) (D,1)"],
    ["12", "(D,1)", { t: "Visit D", bold: true, color: C.ok }, "(A,3)"],
    ["13", "(A,3)", { t: "Visit A", bold: true, color: C.ok }, "空"],
  ], 0.5, 1.0, 6.1, [0.45, 0.9, 1.35, 3.4], { fontSize: 9.5, rowH: 0.29, tight: true });
  tree(s, {
    A: [8.05, 1.4, "A"], B: [7.25, 2.2, "B"], Cc: [8.05, 2.2, "C"], Dd: [8.85, 2.2, "D"],
    E: [6.9, 3.0, "E"], F: [7.6, 3.0, "F"], G: [8.85, 3.0, "G"],
  }, [["A", "B"], ["A", "Cc"], ["A", "Dd"], ["B", "E"], ["B", "F"], ["Dd", "G"]], { r: 0.2 });
  callout(s, "观察", "栈最长 3 = 树高。每个 (u, k) 都是「回到 u 时该做的事」，相当于把递归的返回地址存进了栈。", 6.8, 3.5, 2.7, 1.6, { fontSize: 10.5 });
}

// =====================================================================
sectionSlide("第五部分 · 44 分", "五、算法设计与实现", "链表回文（O(1) 空间）· BST 区间删除（四种解法）· 森林最宽层");

// 五.1 思路
{
  const s = content("五.1", "设计 · 单链表", "判断回文：O(n) 时间、O(1) 空间、结果确定");
  stem(s, "实现 `bool isPalindrome(ListNode* head)`，结点数 [1, 10⁵]，0 ≤ val ≤ 9。**不带头结点**：head 指向第一个数据结点。", 0.5, 1.0, 9.0, 0.55, 11.5);
  const steps = [
    ["快慢指针找中点", "fast 一次两步、slow 一次一步；fast 走到底时 slow 在中间"],
    ["反转后半段", "从 slow 起原地反转，得到 tail"],
    ["两头往中间比", "left 从 head、right 从 tail，以 right 走完为准"],
    ["反转回来", "恢复原链表，不悄悄改坏调用者的数据"],
  ];
  steps.forEach(([t, d], i) => {
    const x = 0.5 + i * 2.28;
    card(s, x, 1.75, 2.1, 1.45, C.cream);
    numCircle(s, i + 1, x + 0.12, 1.87, 0.34, C.dark);
    text(s, t, x + 0.52, 1.85, 1.55, 0.38, { fontSize: 11.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, d, x + 0.12, 2.3, 1.9, 0.85, { fontSize: 10, margin: 0 });
  });
  card(s, 0.5, 3.4, 5.4, 1.7, C.code);
  text(s, "奇数 1 2 3 2 1：slow 停在 3\n  1 → 2 → [3] ← 2 ← 1\n偶数 1 2 2 1：slow 停在第二个 2\n  1 → 2 → [2] ← 1\n后半段不长于前半段：比到 right 为空即可", 0.65, 3.47, 5.2, 1.6, { fontSize: 10.5, fontFace: MONO });
  callout(s, "不能拿满分的做法", [
    "复制到数组 / 栈、递归比较：**O(n) 空间**。",
    "正反两向哈希：会冲突误判，**不确定正确**。",
  ], 6.1, 3.4, 3.4, 1.7, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 五.1 代码
{
  const s = content("五.1", "设计 · 单链表", "参考实现（C++）");
  codeBlock(s, `static ListNode* reverse(ListNode* curr) {
    ListNode* prev = nullptr;
    while (curr != nullptr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}
bool isPalindrome(ListNode* head) {
    if (head == nullptr || head->next == nullptr) return true;
    // (1) 快慢指针：奇数时 slow 在正中，偶数时在后半段第一个
    ListNode *slow = head, *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    ListNode* tail = reverse(slow);          // (2) 反转后半段
    bool result = true;                      // (3) 比较
    for (ListNode *l = head, *r = tail; r != nullptr;
         l = l->next, r = r->next)
        if (l->val != r->val) { result = false; break; }
    reverse(tail);                           // (4) 恢复原链表
    return result;
}`, 0.5, 1.0, 6.1, 4.1, { fontSize: 8.6 });
  callout(s, "细节", [
    "循环条件 `fast && fast->next`：两种长度都不会空指针。",
    "比较以 **right** 为准：前半段在奇数时多出中间结点，不影响。",
    "**break 前**记下结果，最后统一恢复再返回。",
  ], 6.8, 1.0, 2.7, 2.5, { fontSize: 10 });
  callout(s, "评分说明", "按带头结点（从 head->next 开始）处理，只要前后一致、算法正确，不扣分；两种理解混用导致错位按错误处理。", 6.8, 3.65, 2.7, 1.45, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
}

// 五.2 题面 + 例子
{
  const s = content("五.2", "设计 · 二叉搜索树", "DeleteRange(root, L, R)：删除 [L, R] 内全部结点");
  stem(s, "结点关键码互不相同。删除并释放关键码在闭区间 [L, R] 内的结点，返回新根；**保留结点的关键码不变、不新建结点、只调指针**，结果仍是 BST。", 0.5, 1.0, 9.0, 0.6, 11);
  text(s, "例：插入 8 3 10 1 6 14 4 7 13，删除 [4, 10]（红色）", 0.5, 1.75, 5, 0.25, { fontSize: 10.5, bold: true, color: C.green, margin: 0 });
  const x0 = 3.0;
  tree(s, {
    n8: [x0, 2.3, "8", RED], n3: [x0 - 1.2, 2.95, "3"], n10: [x0 + 1.2, 2.95, "10", RED],
    n1: [x0 - 1.8, 3.6, "1"], n6: [x0 - 0.6, 3.6, "6", RED], n14: [x0 + 1.8, 3.6, "14"],
    n4: [x0 - 0.95, 4.25, "4", RED], n7: [x0 - 0.25, 4.25, "7", RED], n13: [x0 + 1.45, 4.25, "13"],
  }, [["n8", "n3"], ["n8", "n10"], ["n3", "n1"], ["n3", "n6"], ["n10", "n14"], ["n6", "n4"], ["n6", "n7"], ["n14", "n13"]], { r: 0.2 });
  s.addShape(pres.shapes.LINE, { x: 5.35, y: 3.3, w: 0.6, h: 0, line: { color: C.green, width: 2, endArrowType: "triangle" } });
  tree(s, {
    m3: [7.0, 2.6, "3"], m1: [6.4, 3.3, "1"], m14: [7.6, 3.3, "14"], m13: [7.1, 4.0, "13"],
  }, [["m3", "m1"], ["m3", "m14"], ["m14", "m13"]], { r: 0.2 });
  text(s, "中序 1 3 13 14", 6.3, 4.4, 1.6, 0.25, { fontSize: 10, color: C.muted, margin: 0 });
  callout(s, "本题不限复杂度", "四种解法都对，复杂度依次改进。记 n 为结点数，h 为树高，d 为被删结点数。", 8.0, 1.8, 1.5, 3.3, { fontSize: 10 });
}

// 五.2 解法一、二
{
  const s = content("五.2", "设计 · 二叉搜索树", "解法一：中序收集重链　解法二：后序 + 合并删除");
  codeBlock(s, `Collect(T, L, R, keep):
  if T == null: return
  Collect(T.left, L, R, keep)
  r = T.right       // 先存，T 可能被释放
  if T.key < L or T.key > R:
      keep.append(T)
  else: free(T)
  Collect(r, L, R, keep)

DeleteRange(root, L, R):
  keep = 空数组
  Collect(root, L, R, keep)
  if keep 为空: return null
  for i = 0 .. len(keep)-1:
      keep[i].left  = null
      keep[i].right = keep[i+1] 或 null
  return keep[0]`, 0.5, 1.0, 4.35, 3.3, { lang: "text", fontSize: 8.8 });
  codeBlock(s, `Join(a, b):     // a 的关键码全小于 b
  if a == null: return b
  if b == null: return a
  p = a
  while p.right != null: p = p.right
  p.right = b
  return a

DeleteRange(T, L, R):
  if T == null: return null
  T.left  = DeleteRange(T.left, L, R)
  T.right = DeleteRange(T.right, L, R)
  if L <= T.key <= R:
      a = T.left; b = T.right
      free(T)
      return Join(a, b)
  return T`, 5.15, 1.0, 4.35, 3.3, { lang: "text", fontSize: 8.8 });
  pill(s, "时间 O(n) · 空间 O(n)", 0.5, 4.45, 2.4, 0.34, C.green, C.white, 10);
  text(s, "结果退化成一条右链（也可取中点重建平衡树）", 0.5, 4.82, 4.35, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
  pill(s, "时间 O(n) · 空间 O(h)", 5.15, 4.45, 2.4, 0.34, C.green, C.white, 10);
  text(s, "左子树的最大结点接管右子树，仍满足 BST", 5.15, 4.82, 4.35, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// 五.2 解法三
{
  const s = content("五.2", "设计 · 二叉搜索树", "解法三：剪枝递归，时间 O(h + d)");
  codeBlock(s, `DeleteRange(T, L, R):
  if T == null: return null
  if T.key < L:                  // T 和左子树全保留
      T.right = DeleteRange(T.right, L, R)
      return T
  if T.key > R:                  // T 和右子树全保留
      T.left = DeleteRange(T.left, L, R)
      return T
  // L <= T.key <= R：删除 T
  a = DeleteRange(T.left, L, R)
  b = DeleteRange(T.right, L, R)
  free(T)
  return Join(a, b)              // Join 同解法二`, 0.5, 1.0, 5.4, 3.0, { lang: "text", fontSize: 9.5, hl: [3, 6] });
  callout(s, "为什么只有一次 Join 真正走右链", [
    "设 X 是区间内**最靠上**的结点。",
    "X 左子树里的区间内结点 Y：L ≤ Y.key < X.key ≤ R，故 **Y 的右子树整棵都在区间内**，递归返回 null，Join 立刻返回。右侧对称。",
    "只有 X 处那次 Join 沿右链走 O(h)。",
    "其余访问：d 个被删结点 + L、R 两条边界路径 O(h)。",
  ], 6.1, 1.0, 3.4, 4.1, { fontSize: 10 });
  pill(s, "时间 O(h + d) · 空间 O(h)", 0.5, 4.2, 2.8, 0.36, C.green, C.white, 10.5);
  text(s, "在例子上：从 8 开始，8 ∈ [4,10] 删；左边 3 < 4 只往右走；右边 10 删、14 > 10 只往左走。", 0.5, 4.62, 5.4, 0.5, { fontSize: 10, color: C.muted });
}

// 五.2 解法四
{
  const s = content("五.2", "设计 · 二叉搜索树", "解法四：切分成 < L、[L, R]、> R 三棵树");
  codeBlock(s, `Split(T, x, eq):   // eq=false: <x | >=x；eq=true: <=x | >x
  if T == null: return (null, null)
  if T.key < x or (eq and T.key == x):
      (A, B) = Split(T.right, x, eq)
      T.right = A
      return (T, B)
  (A, B) = Split(T.left, x, eq)
  T.left = B
  return (A, T)

DeleteRange(root, L, R):
  (A, C) = Split(root, L, false)   // A: <L，C: >=L
  (M, B) = Split(C, R, true)       // M: [L,R]，B: >R
  Destroy(M)                       // 后序释放整棵 M
  return Join(A, B)                // A 中关键码全小于 B`, 0.5, 1.0, 5.9, 3.6, { lang: "text", fontSize: 9.5 });
  callout(s, "复杂度", [
    "Split 每层只沿**一条路径**下行：O(h)。",
    "Split 不增加树高，所以第二次切分仍是 O(h)。",
    "找 A 的最大结点 O(h)，释放 M 共 O(d)。",
    "合计时间 **O(h + d)**，递归深度 ≤ h，空间 **O(h)**。",
  ], 6.6, 1.0, 2.9, 3.6, { fontSize: 10.5 });
  text(s, "Split 是 Treap / 伸展树 / 可并堆中常用的积木；本题用两次 Split + 一次 Join 解决。", 0.5, 4.75, 9.0, 0.35, { fontSize: 10.5, color: C.goldText });
}

// 五.2 对比与评分
{
  const s = content("五.2", "设计 · 二叉搜索树", "四种解法对比与评分要点");
  table(s, [
    ["解法", "思路", "时间", "辅助空间"],
    ["一", "中序收集保留结点，连成右链", "O(n)", "O(n)"],
    ["二", "后序遍历，删结点时 Join 左右子树", "O(n)", "O(h)"],
    ["三", "按 key 与 L、R 的关系剪枝 + Join", { t: "O(h + d)", bold: true, color: C.ok }, "O(h)"],
    ["四", "两次 Split，销毁中间树，Join 两侧", { t: "O(h + d)", bold: true, color: C.ok }, "O(h)"],
    ["逐个删", "对每个区间内结点做 BST 删除", "O(d·h) + 查找", "O(1) ~ O(h)"],
  ], 0.5, 1.0, 9.0, [1.0, 4.6, 1.8, 1.6], { fontSize: 10.5, rowH: 0.32 });
  callout(s, "扣分点", [
    "删除有两个孩子的结点时，把前驱 / 后继的**关键码复制**过来：违反「保留关键码不变」。要让前驱 / 后继**结点本身**顶替。",
    "**先 free(T) 再读 T.right**：悬空指针。",
    "没有释放全部 d 个结点。",
    "复杂度与所写算法不一致（写解法一却答 O(h + d)）。",
  ], 0.5, 3.1, 5.9, 2.0, { fontSize: 10, fill: "FDF0EE", tcolor: C.bad, gap: 2 });
  callout(s, "不扣分", "解法二、三、四合并后树高可能变大（≤ 约 2h）：题目只要求结果仍是 BST。", 6.6, 3.1, 2.9, 2.0, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 五.3 题面 + 例子
{
  const s = content("五.3", "设计 · 森林", "孩子—兄弟森林：哪一层结点最多？");
  stem(s, "head 指向第一棵树的根，各树根由 `nextSibling` 相连，根都在第 1 层。返回（层号，结点数）；并列取**最小层号**；空森林返回 (0, 0)。时间 O(n)，并分析辅助空间。", 0.5, 1.0, 9.0, 0.6, 11);
  text(s, "例：两棵树", 0.5, 1.75, 2, 0.25, { fontSize: 10.5, bold: true, color: C.green, margin: 0 });
  tree(s, {
    A: [1.9, 2.25, "A"], H: [3.9, 2.25, "H"],
    B: [1.1, 3.05, "B"], Cc: [1.9, 3.05, "C"], Dd: [2.7, 3.05, "D"], I: [3.9, 3.05, "I"],
    E: [0.8, 3.85, "E"], F: [1.4, 3.85, "F"], G: [2.7, 3.85, "G"],
  }, [["A", "B"], ["A", "Cc"], ["A", "Dd"], ["H", "I"], ["B", "E"], ["B", "F"], ["Dd", "G"]], { r: 0.2 });
  ["第 1 层：2", "第 2 层：4", "第 3 层：3"].forEach((t, i) => text(s, t, 4.4, 2.13 + i * 0.8, 1.3, 0.25, { fontSize: 10.5, bold: i === 1, color: i === 1 ? C.bad : C.muted, margin: 0 }));
  answer(s, "返回 (2, 4)", 1.4, 4.35, 2.0, 0.42, 13);
  callout(s, "关键：孩子—兄弟链里「同一层」在哪", [
    "u 的全部孩子 = 从 `u.firstChild` 出发沿 `nextSibling` 走到底。",
    "**nextSibling 不换层，firstChild 才下一层。**",
    "所以不能直接对二叉链表做层次遍历再按二叉深度计层。",
    "做法：按层 BFS，每轮先固定 `count = Q.size()`。",
  ], 5.9, 1.75, 3.6, 3.35, { fontSize: 10.5 });
}

// 五.3 伪代码 + trace
{
  const s = content("五.3", "设计 · 森林", "按层 BFS：每轮开始时队列恰是一整层");
  codeBlock(s, `WidestLevel(head):
  if head == null: return (0, 0)
  Q = 空队列
  for p = head; p != null; p = p.nextSibling:
      Q.push(p)                     // 各树根都在第 1 层
  level = 1; bestLevel = 0; bestCount = 0
  while not Q.empty():
      count = Q.size()              // 先固定本层个数
      if count > bestCount:         // 严格大于：并列保留小层号
          bestCount = count; bestLevel = level
      repeat count times:
          u = Q.pop()
          for c = u.firstChild; c != null; c = c.nextSibling:
              Q.push(c)
      level = level + 1
  return (bestLevel, bestCount)`, 0.5, 1.0, 5.6, 3.65, { lang: "text", fontSize: 9, hl: [8, 9] });
  table(s, [
    ["level", "本轮开始时 Q", "count", "best"],
    ["1", "A H", "2", "(1, 2)"],
    ["2", "B C D I", "4", { t: "(2, 4)", bold: true, color: C.ok }],
    ["3", "E F G", "3", "(2, 4)"],
  ], 6.3, 1.0, 3.2, [0.6, 1.2, 0.6, 0.8], { fontSize: 10, rowH: 0.3 });
  callout(s, "复杂度", [
    "每个结点入队、出队各一次，每条 nextSibling 走一次：**O(n)**。",
    "队列至多含相邻两层的部分结点：辅助空间 **O(w)**，w 为最大层宽。",
  ], 6.3, 2.4, 3.2, 2.25, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "易错：用 `while not Q.empty()` 一口气出队、不固定 count，分不出层；用 ≥ 比较，并列时返回了大层号。", 0.5, 4.75, 9.0, 0.38, { fontSize: 10.5, bold: true, color: C.bad });
}

// 五.3 Python
{
  const s = content("五.3", "设计 · 森林", "Python 实现：collections.deque 作队列");
  codeBlock(s, `from collections import deque

def widest_level(head):
    if head is None:
        return 0, 0
    q = deque()
    p = head
    while p is not None:              # 各树根都在第 1 层
        q.append(p)
        p = p.nextSibling
    level, best_level, best_count = 1, 0, 0
    while q:
        count = len(q)                # 此时 q 恰是第 level 层
        if count > best_count:        # 严格大于
            best_count, best_level = count, level
        for _ in range(count):
            u = q.popleft()
            c = u.firstChild
            while c is not None:
                q.append(c)
                c = c.nextSibling
        level += 1
    return best_level, best_count`, 0.5, 1.0, 5.6, 4.1, { lang: "py", fontSize: 9.5 });
  consoleBlock(s, "例子森林      → (2, 4)\n空森林        → (0, 0)\nA(B,C) 与 D   → (1, 2)\nA(B,C)        → (2, 2)", 6.3, 1.0, 3.2, 1.55, 9.5);
  callout(s, "另一种写法", [
    "DFS 递归，带层号 dep，用数组 cnt[dep]++ 统计；最后扫一遍取最大。",
    "时间同样 O(n)；空间 O(h)（栈）+ O(h)（计数数组）。",
    "注意：沿 nextSibling **用循环走**，dep 不变；只对 firstChild 递归，栈才是 O(h)。",
  ], 6.3, 2.75, 3.2, 2.35, { fontSize: 10 });
}

// =====================================================================
summarySlide("讲评小结", [
  ["先定规则再计数", "KMP 比较次数、堆的下标、并查集的「Union 内只压缩两条路径」：题目规定是**判分的唯一依据**。"],
  ["性质给出方程", "循环队列 e − d = 元素数；森林边数 = n − k；平均码长**按频率加权**。"],
  ["显式栈 = 书签", "(u, k) 记下「回来后从第 k 个孩子继续」：先压书签，再压孩子。"],
  ["空间要求看清", "回文要求 O(1) 且**确定正确**：快慢指针 + 反转后半段，用完再反转回来。"],
  ["树结构只调指针", "BST 区间删除不能复制关键码；孩子—兄弟链里 **nextSibling 不换层**。"],
]);

await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
