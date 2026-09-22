// 第六章 树 —— 由 dsa-modernization/book/ch06-tree.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch06_tree.js ../202609_DSA_06_Tree.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_06_Tree.pptx");

// 讲义中引用的图片（name → 本地路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const IMAGES = {};
for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]) IMAGES[`fig-6-${n}`] = `${SCAN}/fig-6-${n}.png`;

(async () => {
  const D = createDeck({ title: "DSA 第六章 树", imgDir: path.join(__dirname, "..", ".cache", "ch06") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  // 画小树用：圆形结点 + 圆心到圆心（两端各缩进半径）的连线
  const R = 0.17;
  const node = (s, label, cx, cy, fill = C.mint, color = C.dark) => {
    s.addShape(pres.shapes.OVAL, { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, fill: { color: fill }, line: { color: C.green, width: 1 } });
    text(s, label, cx - R, cy - R, 2 * R, 2 * R, { fontSize: 11, bold: true, color, align: "center", valign: "middle", margin: 0 });
  };
  const edge = (s, x1, y1, x2, y2, o = {}) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    const ax = x1 + ux * R, ay = y1 + uy * R, bx = x2 - ux * R, by = y2 - uy * R;
    s.addShape(pres.shapes.LINE, {
      x: ax, y: ay, w: Math.abs(bx - ax) < 1e-6 ? 0 : bx - ax, h: Math.abs(by - ay) < 1e-6 ? 0 : by - ay,
      line: { color: o.color || C.green, width: o.width || 1.3, dashType: o.dash, endArrowType: o.arrow },
    });
  };
  const RED = { fill: "FDF0EE", tcolor: C.bad };
  const MINT = { fill: C.mint, tcolor: C.dark };

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第六章  树",
  subtitle: "Tree & Forest：孩子个数不限的层次结构",
  topics: "树与森林的两种等价定义 · 四种逻辑表示法 · 森林 ⇄ 二叉树「连线、切线、旋转」\n先根 / 后根 / 层次周游 · 子结点表 · 静态与动态「左子/右兄」\n父指针表示法与并查集：重量权衡合并 + 路径压缩 · 连通分量计数\n带右链 / 双标记先根 · 带度数后根 · 双标记层次 · K 叉树",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["孩子个数不固定的树，怎么存？", "四种链式表示；主实现「左子/右兄」二叉链表把任意度压成**两个指针**。"],
    ["为什么一般树没有「中序」？", "结点可能有多于两棵子树，「根排在中间」无从定义——只有**先根、后根、层次**。"],
    ["「在不在同一组」怎么问得快？", "**并查集**：父指针表示法 + 重量权衡合并 + 路径压缩。"],
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
    { text: "树与二叉树、森林与二叉树之间存在", options: { color: C.white } },
    { text: "一一对应", options: { color: C.gold, bold: true } },
    { text: "的关系：一般树的问题几乎都能", options: { color: C.white } },
    { text: "搬到二叉树上去做", options: { color: C.gold, bold: true } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["6.1  定义与周游", ["6.1.1 树和森林：定义、术语、四种表示法", "6.1.2 森林与二叉树的等价转换", "6.1.3 树的抽象数据类型", "6.1.4 先根 / 后根 / 层次周游"]],
    ["6.2  链式存储", ["6.2.1 子结点表", "6.2.2 静态「左子/右兄」", "6.2.3 动态表示法", "6.2.4 动态「左子/右兄」（主实现 GeneralTree）", "6.2.5 父指针表示法与并查集"]],
    ["6.3–6.4", ["6.3.1 带右链的先根次序", "6.3.2 带双标记的先根次序（算法 6.10）", "6.3.3 带度数的后根次序", "6.3.4 带双标记的层次次序", "6.4 K 叉树", "本章小结"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 0 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 2.5, 0.45, { fontSize: 20, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 2.6, 3.0, { fontSize: 12, gap: 8 });
  });
}

// 4. Run first
{
  const s = content("▶", "先跑一遍", "demo.cpp：建一棵一般树，三种周游；再做三次合并");
  codeBlock(s, `#include "modern.hpp"

#include <iostream>

int main() {
    dsa::GeneralTree<char> tree;
    tree.create_root('A');
    auto* b = tree.insert_first(tree.root(), 'B');
    auto* c = tree.insert_next(b, 'C');
    tree.insert_next(c, 'D');
    tree.insert_first(b, 'E');
    tree.insert_next(tree.root()->child->child, 'F');

    std::cout << "先根: ";
    tree.preorder([](char value) { std::cout << value; });
    std::cout << "\\n后根: ";
    tree.postorder([](char value) { std::cout << value; });
    std::cout << "\\n层次: ";
    tree.breadth_first([](char value) { std::cout << value; });
    std::cout << '\\n';

    dsa::DisjointSet sets(5);
    sets.unite(0, 1);
    sets.unite(1, 2);
    sets.unite(3, 4);
    std::cout << "0 与 2 同集合: " << (sets.same(0, 2) ? "是" : "否") << '\\n';
    std::cout << "0 与 3 同集合: " << (sets.same(0, 3) ? "是" : "否") << '\\n';
}`, 0.5, 1.02, 5.75, 4.1, { fontSize: 8.2 });
  consoleBlock(s, "先根: ABEFCD\n后根: EFBCDA\n层次: ABCDEF\n0 与 2 同集合: 是\n0 与 3 同集合: 否", 6.45, 1.02, 3.05, 1.55, 10.5);
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror \\\n  -Icode/ch06/general_tree \\\n  code/ch06/general_tree/demo.cpp", 6.45, 2.65, 3.05, 0.65, { fontSize: 8.5, color: C.muted });
  callout(s, "看到了什么", [
    "同一棵树 `A(B(E,F),C,D)` 的**三种周游**次序各不相同。",
    "`DisjointSet`：0-1、1-2 合并后 0 与 2 **传递地**同集合；3 在另一组。",
  ], 6.45, 3.4, 3.05, 1.72, { fontSize: 10.5 });
}

// 5. Run first: how the tree is built
{
  const s = content("▶", "先跑一遍", "demo 里的树是怎么一步步长出来的");
  const steps = [
    ["`create_root('A')`", "清空旧树，新建根 A"],
    ["`insert_first(root, 'B')`", "B 成为 A 的第一个孩子"],
    ["`insert_next(b, 'C')`", "C 接成 B 的下一个兄弟"],
    ["`insert_next(c, 'D')`", "D 接成 C 的下一个兄弟"],
    ["`insert_first(b, 'E')`", "E 成为 B 的第一个孩子"],
    ["`insert_next(root->child->child, 'F')`", "root→child→child 就是 E"],
  ];
  steps.forEach((st, i) => {
    const y = 1.05 + i * 0.49;
    numCircle(s, i + 1, 0.5, y + 0.05, 0.34, C.green);
    text(s, st[0], 0.95, y, 4.3, 0.26, { fontSize: 10.5, margin: 0 });
    text(s, st[1], 0.95, y + 0.24, 4.3, 0.24, { fontSize: 9.5, color: C.muted, margin: 0 });
  });
  callout(s, "孩子次序", "先插 B，再两次 `insert_next`，孩子从左到右就是 **B、C、D**。若反复 `insert_first`，**后插入的反而在前端**。", 0.5, 4.08, 4.75, 1.04, { fontSize: 10.5 });
  // LC-RS diagram
  card(s, 5.5, 1.1, 4.0, 4.02, C.code);
  text(s, "左孩子 / 右兄弟 的样子", 5.65, 1.18, 3.7, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  node(s, "A", 6.1, 1.9);
  node(s, "B", 6.1, 2.9); node(s, "C", 7.3, 2.9); node(s, "D", 8.5, 2.9);
  node(s, "E", 6.1, 3.95); node(s, "F", 7.3, 3.95);
  edge(s, 6.1, 1.9, 6.1, 2.9, { arrow: "triangle", color: C.dark });
  edge(s, 6.1, 2.9, 7.3, 2.9, { arrow: "triangle", color: C.goldText, dash: "dash" });
  edge(s, 7.3, 2.9, 8.5, 2.9, { arrow: "triangle", color: C.goldText, dash: "dash" });
  edge(s, 6.1, 2.9, 6.1, 3.95, { arrow: "triangle", color: C.dark });
  edge(s, 6.1, 3.95, 7.3, 3.95, { arrow: "triangle", color: C.goldText, dash: "dash" });
  text(s, "child", 6.18, 2.25, 0.6, 0.25, { fontSize: 9, color: C.dark, bold: true, margin: 0 });
  text(s, "child", 6.18, 3.3, 0.6, 0.25, { fontSize: 9, color: C.dark, bold: true, margin: 0 });
  text(s, "sibling", 6.4, 2.58, 0.8, 0.25, { fontSize: 9, color: C.goldText, bold: true, margin: 0 });
  text(s, "sibling", 7.6, 2.58, 0.8, 0.25, { fontSize: 9, color: C.goldText, bold: true, margin: 0 });
  text(s, "sibling", 6.4, 3.63, 0.8, 0.25, { fontSize: 9, color: C.goldText, bold: true, margin: 0 });
  text(s, "每个结点只有两个指针域（外加 parent）。代价：取「第 k 个孩子」要沿兄弟链走 k 步。", 5.65, 4.4, 3.7, 0.65, { fontSize: 10, margin: 0 });
}

// ============================ 6.1 ============================
sectionSlide("6.1", "树的定义和基本术语", "一个结点至多一个前驱，但可以有任意多个后继\n两种等价定义 · 四种表示法 · 森林 ⇄ 二叉树 · 三种周游");

// 6.1.1 two definitions
{
  const s = content("6.1.1", "6.1 定义 · 树和森林", "树的两种等价定义");
  card(s, 0.5, 1.1, 4.35, 3.1, C.code);
  text(s, "① 递归定义", 0.7, 1.2, 4, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "树是包括 n（n ≥ 1）个结点的有限集合 T，使得：", 0.7, 1.6, 4.0, 0.3, { fontSize: 11.5, margin: 0 });
  bullets(s, [
    "有且仅有一个特定的称为**根**（root）的结点；",
    "除根以外的其他结点被分成 m（m ≥ 0）个不相交的有限集合 T₁, …, Tₘ，而每一个集合**又都是树**，称做根的**子树**。",
  ], 0.7, 1.95, 4.0, 1.5, { fontSize: 11.5, gap: 6 });
  text(s, "定义里又用到了树 → **递归**：一棵树分成几个分支，每个分支也是树。", 0.7, 3.45, 4.0, 0.65, { fontSize: 11, color: C.goldText, margin: 0 });
  card(s, 5.15, 1.1, 4.35, 3.1, C.code);
  text(s, "② 二元关系定义", 5.35, 1.2, 4, 0.35, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "有穷集合 K（n > 0）上的二元关系 R = {r}：", 5.35, 1.6, 4.0, 0.3, { fontSize: 11.5, margin: 0 });
  bullets(s, [
    "有且仅有一个结点 k₀ **没有前驱**，称做树的根；",
    "除 k₀ 外，每个结点**有且仅有一个前驱**；",
    "除 k₀ 外任一结点 k，都存在序列 k₀, k₁, …, kₛ = k，其中 ⟨kᵢ₋₁, kᵢ⟩ ∈ r——称为从根到 k 的一条**路径**。",
  ], 5.35, 1.95, 4.0, 2.2, { fontSize: 11.5, gap: 5 });
  callout(s, "两者等价", "除了定义的角度不同，两种描述是**等价的**。第 1 章用二元关系描述逻辑结构的办法，在这里直接用上了。", 0.5, 4.35, 9.0, 0.77, { fontSize: 11.5, ...MINT });
}

// 6.1.1 fig 6.1 + K, r
{
  const s = content("6.1.1", "6.1 定义 · 树和森林", "以图 6.1 为例：结点集合 K 与关系 r");
  card(s, 0.5, 1.1, 3.6, 3.2, C.code);
  image(s, "fig-6-1", 0.7, 1.2, 3.2, 2.8);
  text(s, "图 6.1　一般树的树形表示", 0.5, 4.0, 3.6, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  text(s, "K = {A, B, C, D, E, F, G, H, I, J, K, L}", 4.35, 1.15, 5.15, 0.35, { fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  text(s, "r = { ⟨A,B⟩, ⟨A,C⟩, ⟨B,D⟩, ⟨B,E⟩, ⟨C,F⟩, ⟨C,G⟩, ⟨C,H⟩, ⟨D,I⟩, ⟨D,J⟩, ⟨G,K⟩, ⟨G,L⟩ }", 4.35, 1.55, 5.15, 0.6, { fontSize: 11.5, margin: 0 });
  bullets(s, [
    "A **没有前驱**：它是根。",
    "其余 11 个结点**各恰好一个前驱**：11 条有序对。",
    "C 的度为 3（F、G、H），**树的度 = 3**。",
    "I、J、E、F、K、L、H 没有子结点：**树叶**。",
    "从根 A 到 K 的路径：A → C → G → K；K 在**第 3 层**（根为第 0 层）。",
  ], 4.35, 2.3, 5.15, 2.0, { fontSize: 11.5, gap: 5 });
  callout(s, "和第 5 章二叉树的差别", "一般树的结点**不限制孩子个数**。家谱、机关编制、文件系统目录、编译器的句法树，都是树。", 0.5, 4.45, 9.0, 0.67, { fontSize: 11 });
}

// 6.1.1 terms
{
  const s = content("6.1.1", "6.1 定义 · 基本术语", "术语基本沿用二叉树");
  table(s, [
    ["术语", "含义"],
    [{ t: "父结点 / 子结点", bold: true }, "存在 k 指向 k′ 的连线，则 k 是 k′ 的父结点，k′ 是 k 的子结点；⟨k, k′⟩ 称做**边**"],
    [{ t: "兄弟", bold: true }, "同一个父结点的子结点之间互称兄弟"],
    [{ t: "根 / 树叶", bold: true }, "没有父结点的结点是根；没有子结点的结点是树叶"],
    [{ t: "结点的度", bold: true, color: C.bad }, { t: "结点的**子树数目**", color: C.text }],
    [{ t: "树的度", bold: true, color: C.bad }, "树中各结点度的**最大值**（二叉树的度是 2）"],
    [{ t: "祖先 / 子孙", bold: true }, "有一条由 k 到达 kₛ 的路径，则 k 是 kₛ 的祖先、kₛ 是 k 的子孙"],
    [{ t: "层数", bold: true }, "根结点为**第 0 层**；非根结点的层数是其父结点的层数加 1"],
  ], 0.5, 1.1, 5.9, [1.55, 4.35], { fontSize: 10.5, rowH: 0.44 });
  callout(s, "无序树 vs 有序树", "自然界中子结点次序没必要区别：**无序树**。计算机的存储是有序的，往往把子结点按从左到右编号，当作**有序树**（ordered tree）处理。", 6.65, 1.1, 2.85, 2.05, { fontSize: 10.5 });
  callout(s, "森林", "**零棵或多棵**不相交的树的集合（通常有序）。一个结点的子树组成森林；加一个根，森林就变成一棵树。", 6.65, 3.3, 2.85, 1.82, { fontSize: 10.5, ...MINT });
}

// 6.1.1 ordered tree vs binary tree
{
  const s = content("6.1.1", "6.1 定义 · 基本术语", "注意：度为 2 的有序树并不是二叉树");
  text(s, "有序树里，第一子结点被删除后，第二子结点**自然顶替**成为第一子结点——它只有「第几个孩子」，没有「左、右」。", 0.5, 1.02, 9, 0.6, { fontSize: 12.5 });
  card(s, 0.5, 1.75, 4.35, 2.45, "EAF4EF");
  text(s, "二叉树：这是两棵不同的树", 0.7, 1.83, 4, 0.3, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  node(s, "A", 1.6, 2.5); node(s, "B", 1.05, 3.4); edge(s, 1.6, 2.5, 1.05, 3.4);
  text(s, "左不空、右空", 0.7, 3.75, 1.8, 0.3, { fontSize: 10, color: C.muted, align: "center", margin: 0 });
  node(s, "A", 3.6, 2.5); node(s, "B", 4.15, 3.4); edge(s, 3.6, 2.5, 4.15, 3.4);
  text(s, "左空、右不空", 2.8, 3.75, 1.8, 0.3, { fontSize: 10, color: C.muted, align: "center", margin: 0 });
  card(s, 5.15, 1.75, 4.35, 2.45, "FDF0EE");
  text(s, "有序树：只有一种", 5.35, 1.83, 4, 0.3, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  node(s, "A", 7.3, 2.5); node(s, "B", 7.3, 3.4); edge(s, 7.3, 2.5, 7.3, 3.4);
  text(s, "B 就是 A 的「第一个孩子」，无所谓左右", 5.35, 3.75, 4, 0.3, { fontSize: 10, color: C.muted, align: "center", margin: 0 });
  callout(s, "结论", "**度为 2 并且严格区分左右两个子结点的有序树才是二叉树**——二叉树必须能表示「左空、右不空」这种左右不对称。", 0.5, 4.35, 9.0, 0.77, { fontSize: 12 });
}

// 6.1.1 representations
{
  const s = content("6.1.1", "6.1 定义 · 树的表示法", "同一棵树的四种逻辑表示");
  card(s, 0.5, 1.05, 9.0, 2.35, C.code);
  image(s, "fig-6-2", 0.7, 1.1, 5.0, 2.25);
  text(s, "图 6.2　凹入表适合按层次阅读，文氏图突出包含关系", 5.8, 1.3, 3.55, 0.6, { fontSize: 10, color: C.muted, margin: 0 });
  text(s, "嵌套括号表示（图 6.1 那棵树）：", 5.8, 2.0, 3.6, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  text(s, "A(B(D(I,J),E), C(F,G(K,L),H))", 5.8, 2.35, 3.6, 0.4, { fontSize: 11, bold: true, color: C.green, margin: 0 });
  text(s, "便于作为文本编码或输入", 5.8, 2.8, 3.6, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  const reps = [
    ["树形表示法", "根在上的倒挂树；默认上面的结点是前驱、下面的是后继。"],
    ["凹入表示法", "树根的线条最长，子结点线条更短、置于父结点下方——像图书目录。"],
    ["文氏图表示法", "每棵树对应一个圆；同一根的两棵子树对应的圆互不相交。"],
    ["嵌套括号表示法", "类似广义表：根写在左边，子树森林的表用逗号隔开。"],
  ];
  reps.forEach((r, i) => {
    const x = 0.5 + (i % 2) * 4.6, y = 3.55 + Math.floor(i / 2) * 0.8;
    numCircle(s, i + 1, x, y + 0.05, 0.34, C.dark);
    text(s, r[0], x + 0.45, y, 3.9, 0.28, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, r[1], x + 0.45, y + 0.28, 3.95, 0.45, { fontSize: 10, margin: 0 });
  });
}

// 6.1.2 conversion three steps
{
  const s = content("6.1.2", "6.1 定义 · 森林与二叉树", "连线、切线、旋转：森林变成二叉树");
  card(s, 0.5, 1.05, 9.0, 2.45, C.code);
  image(s, "fig-6-3", 0.65, 1.1, 8.7, 2.35);
  const steps = [["连线", "把兄弟结点用线连起来"], ["切线", "只保留父结点到第一个孩子的连线，砍掉其余"], ["旋转", "以根为轴顺时针转一下，像通常的二叉树"]];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 3.05;
    numCircle(s, i + 1, x, 3.65, 0.38, C.green);
    text(s, st[0], x + 0.48, 3.62, 2.4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
    text(s, st[1], x + 0.48, 3.92, 2.4, 0.45, { fontSize: 10, margin: 0 });
  });
  card(s, 0.5, 4.48, 9.0, 0.64, C.dark);
  s.addText([
    { text: "左枝 = 父子关系（第一个孩子）", options: { color: C.gold, bold: true } },
    { text: "　·　", options: { color: C.white } },
    { text: "右枝 = 兄弟关系（下一个兄弟）", options: { color: C.gold, bold: true } },
    { text: "　·　单棵树转换后根的右孩子为空", options: { color: C.white } },
  ], { x: 0.7, y: 4.48, w: 8.6, h: 0.64, fontFace: FONT, fontSize: 12, margin: 0, isTextBox: true, valign: "middle" });
}

// 6.1.2 formal + inverse
{
  const s = content("6.1.2", "6.1 定义 · 森林与二叉树", "形式定义，以及逆过程：两种转换互逆");
  card(s, 0.5, 1.05, 4.35, 2.05, C.code);
  text(s, "森林 F = {T₁, T₂, …, Tₙ} → 二叉树 B(F)", 0.7, 1.12, 4.0, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "F 空 → B(F) 空；",
    "B(F) 的**根** = T₁ 的根；",
    "B(F) 的**左子树** = T₁ 的**子树森林**转成的二叉树；",
    "B(F) 的**右子树** = {T₂, …, Tₙ} 转成的二叉树。",
  ], 0.7, 1.47, 4.0, 1.6, { fontSize: 11, gap: 3 });
  card(s, 5.15, 1.05, 4.35, 2.05, C.code);
  text(s, "二叉树 B → 森林 F(B)", 5.35, 1.12, 4.0, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "逆时针旋转；",
    "若 x 是 y 的左孩子，把 x **及 x 右链上的所有结点**都补连到 y；",
    "删掉所有到右孩子的边。",
    "形式地：F(B) = 以 B 的根为根、F(B_L) 为子树森林的树，再加上 F(B_R)。",
  ], 5.35, 1.47, 4.0, 1.6, { fontSize: 11, gap: 3 });
  card(s, 0.5, 3.22, 9.0, 1.9, C.code);
  image(s, "fig-6-4", 0.7, 3.27, 6.4, 1.8);
  text(s, "图 6.4　(a) 二叉树；(b) 它对应的森林。\n\nA 的左孩子 B 及其右链 C、D 都成为 A 的孩子。", 7.2, 3.4, 2.2, 1.6, { fontSize: 10, color: C.muted, margin: 0 });
}

// 6.1.2 fig 6.5 mapping table
{
  const s = content("6.1.2", "6.1 定义 · 森林与二叉树", "图 6.5：本章反复用到的那片森林");
  card(s, 0.5, 1.05, 5.4, 2.0, C.code);
  image(s, "fig-6-5", 0.6, 1.1, 5.2, 1.9);
  text(s, "图 6.5　(a) 森林；(b) 森林对应的二叉树", 0.5, 3.08, 5.4, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  const rows = [["结点", "左 = 首孩子", "右 = 下一兄弟"]];
  [["A", "B", "G（下一棵树的根）"], ["B", "—", "C"], ["C", "E", "D"], ["D", "—", "—"], ["E", "—", "F"], ["F", "—", "—"], ["G", "H", "—"], ["H", "J", "I"], ["I", "—", "—"], ["J", "—", "—"]]
    .forEach((r) => rows.push([{ t: r[0], bold: true, align: "center" }, { t: r[1], align: "center" }, { t: r[2], align: "center" }]));
  table(s, rows, 6.1, 1.05, 3.4, [0.6, 1.3, 1.5], { fontSize: 9.5, rowH: 0.29, tight: true });
  callout(s, "读法", [
    "**根的右链**就是森林中每棵树的根：A → G。",
    "单棵树转成的二叉树，根的右孩子一定为空；森林则不然。",
    "这张对应表就是「左子/右兄」存储的全部信息（6.2.2、6.2.4）。",
  ], 0.5, 3.45, 5.4, 1.67, { fontSize: 10.5 });
}

// 6.1.3 ADT
{
  const s = content("6.1.3", "6.1 定义 · 树的抽象数据类型", "树的 ADT：结点类 + 树类，对外一组运算");
  table(s, [
    ["运算", "GeneralTree 接口", "说明"],
    ["用一个值建立根", { t: "create_root(v)", mono: true }, "清空旧树并新建根"],
    ["插入第一个孩子", { t: "insert_first(p, v)", mono: true }, "新结点接到孩子链**最前面**"],
    ["插入下一个兄弟", { t: "insert_next(n, v)", mono: true }, "新结点成为 n 的下一个兄弟"],
    ["查询父结点", { t: "parent_of(n)", mono: true }, "沿 parent 链，O(1)"],
    ["删除一棵子树", { t: "delete_subtree(n)", mono: true }, "先从链上摘下，再递归销毁"],
    ["三种周游", { t: "preorder / postorder\nbreadth_first", mono: true }, "先根、后根、层次；传入 visitor"],
  ], 0.5, 1.1, 6.0, [1.45, 2.3, 2.25], { fontSize: 10.5, rowH: 0.47 });
  callout(s, "结点里存什么", "自身的值，以及指向**最左孩子**、**下一个兄弟**和**父结点**的链接。树类保存根（森林时根还可以沿兄弟链相连）。", 6.75, 1.1, 2.75, 1.75, { fontSize: 10.5 });
  callout(s, "⚠ 三条链一起改", "插入和删除必须**同时维护父链、孩子链和兄弟链**，不能只改其中一条。", 6.75, 3.0, 2.75, 1.2, { fontSize: 10.5, ...RED });
  text(s, "原书【代码6.1】【代码6.2】只给出声明；本书把运算直接写在 `GeneralTree` 上，不再另设空基类。", 6.75, 4.3, 2.75, 0.8, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// 6.1.4 traversal definitions
{
  const s = content("6.1.4", "6.1 定义 · 树的周游", "深度优先：先根次序与后根次序");
  text(s, "一个结点可能有多于两棵子树，**不能像二叉树那样给出中根次序**；但可以仿照前序法、后序法定义两种深度优先周游：", 0.5, 1.02, 9, 0.6, { fontSize: 12.5 });
  const cols = [
    ["先根次序周游森林", ["访问森林中**第一棵树的根**；", "先根次序周游第一棵树根的**子树森林**；", "先根次序周游**其他的树**构成的森林。"], "A B C E F D G H J I"],
    ["后根次序周游森林", ["后根次序周游第一棵树根的**子树森林**；", "访问森林中**第一棵树的根**；", "后根次序周游**其他的树**构成的森林。"], "B E F C D A J H I G"],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.7, 4.35, 2.55, C.code);
    text(s, c[0], x + 0.2, 1.8, 4, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    c[1].forEach((t, j) => {
      numCircle(s, j + 1, x + 0.2, 2.27 + j * 0.47, 0.32, j === (i === 0 ? 0 : 1) ? C.gold : C.green);
      text(s, t, x + 0.62, 2.23 + j * 0.47, 3.6, 0.4, { fontSize: 11, valign: "middle", margin: 0 });
    });
    text(s, "图 6.5(a)：", x + 0.2, 3.75, 1.0, 0.35, { fontSize: 10.5, color: C.muted, valign: "middle", margin: 0 });
    text(s, c[2], x + 1.15, 3.75, 3.1, 0.35, { fontSize: 13, bold: true, color: C.green, valign: "middle", margin: 0 });
  });
  callout(s, "对照代码", "`pre` / `post` 沿兄弟链循环、对孩子链递归——正好是「第一棵树」+「其余的树」这个定义。", 0.5, 4.4, 9.0, 0.72, { fontSize: 11, ...MINT });
}

// 6.1.4 correspondence
{
  const s = content("6.1.4", "6.1 定义 · 树的周游", "与二叉树的对应：先根 = 前序，后根 = 中序");
  card(s, 0.5, 1.05, 4.2, 2.3, C.code);
  image(s, "fig-6-5", 0.6, 1.1, 4.0, 2.2);
  table(s, [
    ["森林的周游", "序列", "= 对应二叉树的"],
    [{ t: "先根次序", bold: true }, { t: "A B C E F D G H J I", mono: true }, { t: "前序", bold: true, color: C.ok }],
    [{ t: "后根次序", bold: true }, { t: "B E F C D A J H I G", mono: true }, { t: "中序", bold: true, color: C.ok }],
  ], 4.9, 1.05, 4.6, [1.05, 2.35, 1.2], { fontSize: 10.5, rowH: 0.42 });
  text(s, "原因就在转换关系里：", 4.9, 2.45, 4.6, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  text(s, "T₁ 的诸子树 {T₁₁, …, T₁ₘ} ↔ B(F) 的**左子树**；其余的树 {T₂, …, Tₙ} ↔ B(F) 的**右子树**。", 4.9, 2.75, 4.6, 0.6, { fontSize: 11, margin: 0 });
  card(s, 0.5, 3.5, 9.0, 1.62, C.cream);
  text(s, "后根次序 = 中序，逐项对上", 0.7, 3.58, 8, 0.3, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  const seg = [["周游 {T₁₁, …, T₁ₘ}", "中序周游左子树"], ["访问 T₁ 的根", "访问根"], ["周游 {T₂, …, Tₙ}", "中序周游右子树"]];
  seg.forEach((g, i) => {
    const x = 0.7 + i * 2.95;
    pill(s, g[0], x, 3.98, 2.65, 0.38, C.green, C.white, 10.5);
    text(s, "↕", x, 4.36, 2.65, 0.26, { fontSize: 11, color: C.muted, align: "center", margin: 0 });
    pill(s, g[1], x, 4.62, 2.65, 0.38, C.dark, C.gold, 10.5);
  });
}

// 6.1.4 breadth first
{
  const s = content("6.1.4", "6.1 定义 · 树的周游", "广度优先（层次）周游：森林与二叉树的层次序不同");
  bullets(s, [
    "从第 0 层（根）开始**自上至下逐层**周游；同一层**从左到右**逐一访问。",
    "图 6.5(a) 森林：**A G B C D H I E F J**。",
    "对应二叉树的层次序却是 A B G C H E D J I F——**两者不同**。",
    "在二叉树上按森林的层次走，是**沿着右链访问**，左指针起「承上启下」的作用。",
  ], 0.5, 1.05, 5.3, 2.4, { fontSize: 12, gap: 7 });
  text(s, "本节的例子（demo 里那棵 A(B(E,F),C,D)）：", 0.5, 3.45, 5.3, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["周游", "顺序", "本例"],
    [{ t: "先根", bold: true }, "结点，再孩子子树", { t: "A B E F C D", mono: true }],
    [{ t: "后根", bold: true }, "孩子子树，再结点", { t: "E F B C D A", mono: true }],
    [{ t: "层次", bold: true }, "按离根的距离", { t: "A B C D E F", mono: true }],
  ], 0.5, 3.8, 5.3, [0.9, 2.2, 2.2], { fontSize: 10.5, rowH: 0.32 });
  card(s, 6.05, 1.05, 3.45, 2.6, C.code);
  image(s, "fig-6-5", 6.15, 1.1, 3.25, 2.1);
  text(s, "(b) 中按层读：A｜B G｜C H｜E D J I｜F", 6.15, 3.2, 3.3, 0.35, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "⚠ 递归的风险", "递归周游和递归销毁在**极深的退化树**上会耗尽调用栈——和第 5 章是同一类风险。", 6.05, 3.8, 3.45, 1.32, { fontSize: 10.5, ...RED });
}

// ============================ 6.2 ============================
sectionSlide("6.2", "树的链式存储结构", "问题的根源在于「度不固定」\n子结点表 · 静态左子/右兄 · 动态表示法 · 动态左子/右兄（主实现）");

// 6.2 overview
{
  const s = content("6.2", "6.2 链式存储", "存储结构的要求，与四种链式表示");
  text(s, "无论采取何种方式，存储结构**不但要存各结点本身的数据**，还要**准确反映结点之间的逻辑关系**。一般树的存储比二叉树麻烦，因为度不固定。", 0.5, 1.02, 9, 0.6, { fontSize: 12.5 });
  const reps = [
    ["6.2.1", "子结点表", "结点数组 + 每个结点一条孩子链表", "顺链找所有孩子；度不固定时要扩容、搬指针"],
    ["6.2.2", "静态「左子/右兄」", "数组，每个结点 4 个域：值、父、最左子、右兄", "空间更省、结点大小固定；两棵树归并只改 3 个链接"],
    ["6.2.3", "动态表示法", "每个结点单独分配：孩子数 + 可变长孩子指针表", "本质同子结点表，但动态分配；适合频繁长出新结点"],
    ["6.2.4", "动态「左子/右兄」", "二叉链表：child、sibling（+ parent）", "应用最广，本章主实现 GeneralTree"],
  ];
  reps.forEach((r, i) => {
    const y = 1.72 + i * 0.85;
    card(s, 0.5, y, 9.0, 0.75, i === 3 ? C.cream : C.code);
    pill(s, r[0], 0.65, y + 0.2, 0.75, 0.34, i === 3 ? C.goldText : C.green, C.white, 10);
    text(s, r[1], 1.55, y, 2.1, 0.75, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, r[2], 3.7, y + 0.06, 5.7, 0.32, { fontSize: 10.5, margin: 0 });
    text(s, r[3], 3.7, y + 0.38, 5.7, 0.32, { fontSize: 10, color: C.muted, margin: 0 });
  });
}

// 6.2.1 list of children
{
  const s = content("6.2.1", "6.2 链式存储 · 子结点表", "「子结点表」：结点数组 + 孩子链表");
  card(s, 0.5, 1.05, 5.1, 3.1, C.code);
  image(s, "fig-6-6", 0.6, 1.1, 4.9, 2.8);
  text(s, "图 6.6　以子结点表实现图 6.1 中的树", 0.5, 3.88, 5.1, 0.25, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "主体是一个**结点数组**；每个元素 3 个域：值、**父结点下标**、指向**子结点表**的指针。",
    "子结点表按**从左到右**串起，表项存孩子下标。",
    "**最左子结点**由子结点表第一个表项直接找到，**顺链**找到所有孩子。",
    "取第 k 个孩子：表用数组 O(1)，用链表要走 k 步。",
  ], 5.8, 1.05, 3.7, 3.1, { fontSize: 11, gap: 6 });
  callout(s, "代价", "度不固定时数组表要**扩容**，孩子序列中间插入还要**搬动后面的指针**；度为 d 的结点留 d 个指针槽，孩子很少时浪费。→ 用「左子/右兄」把每个结点的链接数**固定为两个**。", 0.5, 4.25, 9.0, 0.87, { fontSize: 10.5, tsize: 11 });
}

// 6.2.2 static LCRS
{
  const s = content("6.2.2", "6.2 链式存储 · 静态「左子/右兄」", "静态「左子/右兄」：访问右侧兄弟更方便");
  card(s, 0.5, 1.05, 5.4, 3.5, C.code);
  image(s, "fig-6-7", 0.6, 1.12, 5.2, 3.2);
  text(s, "图 6.7　「左子/右兄」表示两棵树", 0.5, 4.3, 5.4, 0.25, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "仍用**数组**存结点，数组下标代替指针。",
    "每个结点 **4 个域**：值、父结点、最左子结点、右侧兄弟结点。",
    "比子结点表**空间效率更高**，且每个结点的存储空间**大小固定**。",
  ], 6.1, 1.05, 3.4, 2.3, { fontSize: 11.5, gap: 7 });
  callout(s, "对照 6.1.2", "它就是森林 ⇄ 二叉树转换的**静态链表实现**：最左子 = 左孩子，右兄弟 = 右孩子。", 6.1, 3.4, 3.4, 1.15, { fontSize: 10.5, ...MINT });
  text(s, "图中两棵树（A 为根、G 为根）存在同一个数组里——这正是下一页归并的前提。", 0.5, 4.65, 9, 0.4, { fontSize: 11, color: C.goldText, bold: true });
}

// 6.2.2 merge
{
  const s = content("6.2.2", "6.2 链式存储 · 静态「左子/右兄」", "两棵树在同一数组里：归并只改 3 个链接");
  card(s, 0.5, 1.05, 5.4, 3.55, C.code);
  image(s, "fig-6-8", 0.6, 1.12, 5.2, 3.25);
  text(s, "图 6.8　把以 A 为根的树变成 H 的最左子树", 0.5, 4.35, 5.4, 0.25, { fontSize: 9.5, color: C.muted, align: "center" });
  const ops = [["H 的最左子结点", "→ A"], ["A 的父结点", "→ H"], ["A 的右侧兄弟", "→ J（H 原来的最左子）"]];
  text(s, "需要改的链接", 6.1, 1.1, 3.4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  ops.forEach((o, i) => {
    const y = 1.5 + i * 0.66;
    numCircle(s, i + 1, 6.1, y + 0.08, 0.36, C.goldText);
    text(s, o[0], 6.6, y, 2.9, 0.28, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, o[1], 6.6, y + 0.28, 2.9, 0.28, { fontSize: 11, color: C.green, margin: 0 });
  });
  callout(s, "其余不动", "其余结点的值和链接**都不变**。如果两棵树不在同一个数组里，就得先把一棵整体搬过来。", 6.1, 3.55, 3.4, 1.05, { fontSize: 10.5 });
}

// 6.2.3 dynamic
{
  const s = content("6.2.3", "6.2 链式存储 · 动态表示法", "动态表示法：每个结点一块可变大小的空间");
  card(s, 0.5, 1.05, 9.0, 2.2, C.code);
  image(s, "fig-6-9", 0.65, 1.1, 8.7, 2.1);
  card(s, 0.5, 3.4, 4.35, 1.72, "FDF0EE");
  text(s, "✗  限定树的度数", 0.7, 3.48, 4, 0.3, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  text(s, "每个结点分配确定数目的指针域：**度数小的结点浪费空间**，超过限制时增加结点又**非常不方便**。", 0.7, 3.85, 4.0, 1.15, { fontSize: 11, margin: 0 });
  card(s, 5.15, 3.4, 4.35, 1.72, "EAF4EF");
  text(s, "✓  为每个结点分配可变空间", 5.35, 3.48, 4, 0.3, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  text(s, "结点里存**孩子数**和一张**长度可变的孩子指针表**；孩子数变了就重新分配一块合适的空间。本质同子结点表，但**不必把所有结点放在同一个数组里**。", 5.35, 3.85, 4.0, 1.2, { fontSize: 10.5, margin: 0 });
}

// 6.2.4 dynamic LCRS concept
{
  const s = content("6.2.4", "6.2 链式存储 · 动态「左子/右兄」", "二叉链表表示法：本章的主实现");
  bullets(s, [
    "6.2.2 的静态「左子/右兄」是森林⇄二叉树的**静态链表实现**；照第 5 章二叉树链式存储的做法，就得到**动态**版本。",
    "`child` 指向**第一个孩子**，`sibling` 指向**下一个兄弟**；再加一个 `parent` 便于向上走。",
    "**根的右链**（根的 sibling 链）就是森林中每棵树的根。",
    "代价：取第 k 个孩子必须沿兄弟链走 k 步。",
  ], 0.5, 1.05, 5.3, 3.0, { fontSize: 12, gap: 8 });
  codeBlock(s, `A
└─ child → B ── sibling → C ── sibling → D
            └─ child → E ── sibling → F`, 0.5, 4.1, 5.3, 0.95, { fontSize: 10, lang: "text" });
  card(s, 6.05, 1.05, 3.45, 4.0, C.code);
  text(s, "struct Node", 6.2, 1.12, 3.2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const fields = [["value", "T", C.mint], ["child", "第一个孩子", C.cream], ["sibling", "下一个兄弟", C.cream], ["parent", "父结点", "E3E9E6"]];
  fields.forEach((f, i) => {
    const y = 1.55 + i * 0.62;
    s.addShape(pres.shapes.RECTANGLE, { x: 6.25, y, w: 1.3, h: 0.5, fill: { color: f[2] }, line: { color: C.green, width: 1 } });
    text(s, f[0], 6.25, y, 1.3, 0.5, { fontSize: 11, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0, });
    text(s, f[1], 7.7, y, 1.7, 0.5, { fontSize: 11, valign: "middle", margin: 0 });
  });
  text(s, "任意度的树，**只要两个指针域**（parent 是为了向上走）。", 6.2, 4.1, 3.2, 0.85, { fontSize: 10.5, color: C.goldText, margin: 0 });
}

// GeneralTree code 1
{
  const s = content("6.2.4", "6.2 链式存储 · modern.hpp · GeneralTree（1/6）", "Node 与拷贝：递归 clone，copy-and-swap");
  codeBlock(s, `template <typename T>
class GeneralTree {
public:
    struct Node {
        T value;
        Node* child{nullptr};
        Node* sibling{nullptr};
        Node* parent{nullptr};

        explicit Node(const T& value) : value(value) {}
    };

    GeneralTree() = default;

    GeneralTree(const GeneralTree& other) : root_(clone(other.root_, nullptr)) {}

    GeneralTree& operator=(const GeneralTree& other) {
        if (this != &other) {
            GeneralTree copy(other);
            swap(copy);
        }
        return *this;
    }`, 0.5, 1.02, 6.35, 4.1, { fontSize: 8.6 });
  callout(s, "拷贝构造", "`clone(other.root_, nullptr)` **深拷贝**整棵树：每个结点复制一份，parent 指向**新树**里的父结点。", 7.05, 1.02, 2.45, 1.95, { fontSize: 10.5 });
  callout(s, "拷贝赋值", "先拷出一份 `copy`，再 `swap`——出异常时原对象不受影响；旧内容随 `copy` 析构而释放。", 7.05, 3.1, 2.45, 2.02, { fontSize: 10.5, ...MINT });
}

// GeneralTree code 2
{
  const s = content("6.2.4", "6.2 链式存储 · modern.hpp · GeneralTree（2/6）", "移动、析构、create_root");
  codeBlock(s, `    GeneralTree(GeneralTree&& other) noexcept : root_(other.release()) {}

    GeneralTree& operator=(GeneralTree&& other) noexcept {
        if (this != &other) {
            clear();
            root_ = other.release();
        }
        return *this;
    }

    ~GeneralTree() { clear(); }

    void swap(GeneralTree& other) noexcept {
        using std::swap;
        swap(root_, other.root_);
    }

    [[nodiscard]] Node* root() noexcept { return root_; }
    [[nodiscard]] const Node* root() const noexcept { return root_; }

    void create_root(const T& value) {
        clear();
        root_ = new Node(value);
    }`, 0.5, 1.02, 6.0, 4.1, { fontSize: 8.8 });
  callout(s, "移动：接管指针", "`release()` 把对方的 `root_` 拿过来并置空——**O(1)**，不复制任何结点。", 6.7, 1.02, 2.8, 1.55, { fontSize: 10.5 });
  callout(s, "create_root", "先 `clear()` 清空旧树，再新建根。所以 demo 开头调用它是安全的。", 6.7, 2.7, 2.8, 1.25, { fontSize: 10.5, ...MINT });
  callout(s, "析构", "`~GeneralTree()` 调 `clear()`，最终走递归的 `destroy`（见 6/6）。", 6.7, 4.08, 2.8, 1.04, { fontSize: 10.5 });
}

// GeneralTree code 3
{
  const s = content("6.2.4", "6.2 链式存储 · modern.hpp · GeneralTree（3/6）", "insert_first / insert_next：先接新结点，再改旧链");
  codeBlock(s, `    Node* insert_first(Node* parent, const T& value) {
        if (parent == nullptr) {
            throw std::invalid_argument("parent must not be null");
        }
        Node* node = new Node(value);
        node->sibling = parent->child;
        node->parent = parent;
        parent->child = node;
        return node;
    }

    Node* insert_next(Node* node, const T& value) {
        if (node == nullptr) {
            throw std::invalid_argument("node must not be null");
        }
        Node* next = new Node(value);
        next->sibling = node->sibling;
        next->parent = node->parent;
        node->sibling = next;
        return next;
    }

    [[nodiscard]] Node* parent_of(Node* node) const noexcept {
        return node == nullptr ? nullptr : node->parent;
    }`, 0.5, 1.02, 5.3, 4.1, { fontSize: 9, hl: [5, 6, 7, 16, 17, 18, 19] });
  card(s, 6.0, 1.02, 3.5, 2.35, C.code);
  text(s, "insert_first(P, X)", 6.15, 1.08, 3.2, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  node(s, "P", 6.6, 1.75);
  node(s, "X", 6.6, 2.75, C.cream); node(s, "B", 7.6, 2.75); node(s, "C", 8.6, 2.75);
  edge(s, 6.6, 1.75, 6.6, 2.75, { arrow: "triangle", color: C.bad });
  edge(s, 6.6, 1.75, 7.6, 2.75, { color: C.muted, dash: "dash" });
  edge(s, 6.6, 2.75, 7.6, 2.75, { arrow: "triangle", color: C.bad });
  edge(s, 7.6, 2.75, 8.6, 2.75, { arrow: "triangle", color: C.goldText });
  text(s, "原来的第一个孩子 B 退到第二位", 6.9, 1.6, 2.5, 0.45, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "次序为什么不能反", [
    "先写 `node->sibling = parent->child`，再写 `parent->child = node`。",
    "反过来，原孩子链就**丢了**。",
    "`insert_next` 同理：新结点的 parent 与 node 相同。",
    "空指针参数抛 `invalid_argument`。",
  ], 6.0, 3.5, 3.5, 1.62, { fontSize: 9.5, gap: 2 });
}

// GeneralTree code 4
{
  const s = content("6.2.4", "6.2 链式存储 · modern.hpp · GeneralTree（4/6）", "delete_subtree：先脱开，再销毁");
  codeBlock(s, `    void delete_subtree(Node* node) {
        if (node == nullptr) {
            return;
        }

        Node** link = node->parent == nullptr ? &root_ : &node->parent->child;
        while (*link != nullptr && *link != node) {
            link = &(*link)->sibling;
        }
        if (*link != node) {
            throw std::invalid_argument("node is not part of this tree");
        }

        *link = node->sibling;
        node->sibling = nullptr;
        destroy(node);
    }

    void clear() noexcept {
        destroy(root_);
        root_ = nullptr;
    }`, 0.5, 1.02, 6.3, 4.1, { fontSize: 8.6, hl: [6, 8, 14, 15, 16] });
  callout(s, "Node** link 的用法", [
    "父为空 → 从 `root_` 开始（它在森林的根兄弟链上）；否则从 `parent->child` 开始。",
    "沿兄弟链走，直到 `*link == node`。",
    "`*link = node->sibling`：把它**从链上摘下**，前后兄弟接上。",
  ], 6.95, 1.02, 2.55, 2.65, { fontSize: 9.5 });
  callout(s, "⚠ 为什么先置空 sibling", "`destroy` 会顺着 **sibling** 递归释放。不先断开，就会把它**后面的兄弟子树一起删掉**。", 6.95, 3.8, 2.55, 1.32, { fontSize: 9.5, ...RED });
}

// GeneralTree code 5: pre/post
{
  const s = content("6.2.4", "6.2 链式存储 · modern.hpp · GeneralTree（5/6）", "先根与后根：沿兄弟链循环，对孩子链递归");
  codeBlock(s, `    template <class Visitor>
    void preorder(Visitor&& visitor) const {
        pre(root_, visitor);
    }

    template <class Visitor>
    void postorder(Visitor&& visitor) const {
        post(root_, visitor);
    }
    // ...
    template <class Visitor>
    static void pre(Node* node, Visitor& visitor) {
        for (; node != nullptr; node = node->sibling) {
            visitor(node->value);
            pre(node->child, visitor);
        }
    }

    template <class Visitor>
    static void post(Node* node, Visitor& visitor) {
        for (; node != nullptr; node = node->sibling) {
            post(node->child, visitor);
            visitor(node->value);
        }
    }`, 0.5, 1.02, 5.3, 4.1, { fontSize: 9, hl: [15, 16, 23, 24] });
  card(s, 6.0, 1.02, 3.5, 2.15, C.code);
  text(s, "两者只差一行的位置", 6.15, 1.1, 3.2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["", "先访问", "后访问"],
    [{ t: "pre", mono: true, bold: true }, "本结点", "孩子子树"],
    [{ t: "post", mono: true, bold: true }, "孩子子树", "本结点"],
  ], 6.15, 1.5, 3.2, [0.8, 1.2, 1.2], { fontSize: 10.5, rowH: 0.36 });
  text(s, "for 循环 = 「其他的树」；递归 = 「子树森林」。", 6.15, 2.65, 3.25, 0.45, { fontSize: 10, color: C.goldText, margin: 0 });
  callout(s, "visitor", "`preorder` 接受任意可调用对象：demo 里传 lambda `[](char v){ std::cout << v; }`。容器本身**不做 I/O**。", 6.0, 3.3, 3.5, 1.82, { fontSize: 10.5, ...MINT });
}

// GeneralTree code 6a: breadth first + trace
{
  const s = content("6.2.4", "6.2 链式存储 · modern.hpp · GeneralTree（6/6）", "breadth_first：vector 当队列，下标就是队头");
  codeBlock(s, `    template <class Visitor>
    void breadth_first(Visitor&& visitor) const {
        std::vector<Node*> queue;
        for (Node* node = root_; node != nullptr; node = node->sibling) {
            queue.push_back(node);
        }
        for (std::size_t index = 0; index < queue.size(); ++index) {
            visitor(queue[index]->value);
            for (Node* child = queue[index]->child; child != nullptr;
                 child = child->sibling) {
                queue.push_back(child);
            }
        }
    }`, 0.5, 1.02, 5.85, 2.55, { fontSize: 9 });
  bullets(s, [
    "先把**森林所有树根**（根的兄弟链）入队。",
    "`index` 是队头：访问 `queue[index]`，再把它的**孩子链**依次追加到队尾。",
    "元素从不出队，`vector` 只增不减，**不需要真正的队列**。",
  ], 0.5, 3.7, 5.85, 1.4, { fontSize: 10.5, gap: 4 });
  text(s, "demo 树 A(B(E,F),C,D) 的队列", 6.55, 1.02, 2.95, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["index", "访问", "追加孩子", "queue"],
    ["—", "", "", { t: "A", mono: true }],
    ["0", { t: "A", bold: true }, "B C D", { t: "A B C D", mono: true }],
    ["1", { t: "B", bold: true }, "E F", { t: "A B C D E F", mono: true }],
    ["2", { t: "C", bold: true }, "—", { t: "…", mono: true }],
    ["3", { t: "D", bold: true }, "—", { t: "…", mono: true }],
    ["4", { t: "E", bold: true }, "—", { t: "…", mono: true }],
    ["5", { t: "F", bold: true }, "—", { t: "结束", mono: true }],
  ], 6.55, 1.35, 2.95, [0.55, 0.5, 0.75, 1.15], { fontSize: 9.5, rowH: 0.3, tight: true, align: "center" });
  callout(s, "输出", "层次：**ABCDEF**", 6.55, 4.0, 2.95, 1.1, { fontSize: 12, ...MINT });
}

// GeneralTree code: destroy / clone
{
  const s = content("6.2.4", "6.2 链式存储 · modern.hpp · GeneralTree（私有部分）", "destroy 与 clone：递归保留教材写法");
  codeBlock(s, `private:
    // Recursive destruction and traversals preserve the textbook presentation.
    // They have a Stack Overflow Risk for a pathologically deep tree.
    static void destroy(Node* node) noexcept {
        if (node == nullptr) {
            return;
        }
        destroy(node->child);
        destroy(node->sibling);
        delete node;
    }

    static Node* clone(const Node* node, Node* parent) {
        if (node == nullptr) {
            return nullptr;
        }
        Node* copy = new Node(node->value);
        copy->parent = parent;
        try {
            copy->child = clone(node->child, copy);
            copy->sibling = clone(node->sibling, parent);
        } catch (...) {
            destroy(copy);
            throw;
        }
        return copy;
    }`, 0.5, 1.02, 6.1, 4.1, { fontSize: 8.5 });
  callout(s, "destroy", "先孩子链、再兄弟链、最后 `delete` 自己——**后根式**释放，删 node 时它的子孙和后续兄弟都已处理。", 6.8, 1.02, 2.7, 1.55, { fontSize: 10 });
  callout(s, "clone 的异常安全", "复制孩子或兄弟时若抛异常（如 `bad_alloc`），`catch (...)` 先把已建好的 `copy` 整棵销毁再重抛，**不泄漏**。", 6.8, 2.7, 2.7, 1.3, { fontSize: 10, ...MINT });
  callout(s, "⚠ Stack Overflow Risk", "递归深度 = 链长。极深的退化树（例如一条很长的兄弟链）会**耗尽调用栈**。", 6.8, 4.12, 2.7, 1.0, { fontSize: 9.5, ...RED });
}

// 6.2.4 key points
{
  const s = content("6.2.4", "6.2 链式存储 · 关键要点", "GeneralTree 的三条要点");
  const pts = [
    ["三条链一起维护", "插入要同时设 `sibling`、`parent` 和父（或前一个兄弟）的链；删除要沿链找到「指向它的指针」改写成下一个兄弟。", C.dark],
    ["后插入的在前端", "`insert_first` 把新结点插到孩子链**最前面**；要按从左到右建树，先插第一个孩子，再一路 `insert_next`。", C.green],
    ["递归的深度风险", "销毁、拷贝和先根/后根周游都是递归，**深度随链长增长**。退化树上会耗尽调用栈——第 3 章实测过运行栈有多大。", C.bad],
  ];
  pts.forEach((p, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.1, 2.85, 3.95, C.code);
    numCircle(s, i + 1, x + 0.2, 1.25, 0.46, p[2]);
    text(s, p[0], x + 0.2, 1.85, 2.5, 0.4, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, p[1], x + 0.2, 2.35, 2.5, 2.5, { fontSize: 11.5, margin: 0, lsm: 1.2 });
  });
}

// ============================ 6.2.5 ============================
sectionSlide("6.2.5", "父指针表示法与并查集", "若干元素分属哪些互不相交的集合？\n等价类 · 父指针 · 重量权衡合并 · 路径压缩 · 连通分量计数");

// equivalence
{
  const s = content("6.2.5", "6.2.5 并查集 · 等价类", "等价关系把集合划分成互不相交的等价类");
  card(s, 0.5, 1.05, 4.35, 2.4, C.code);
  text(s, "等价关系的三条性质", 0.7, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["性质", "条件"],
    [{ t: "自反性", bold: true }, "对所有 x，(x, x) ∈ R"],
    [{ t: "对称性", bold: true }, "(x, y) ∈ R ⇒ (y, x) ∈ R"],
    [{ t: "传递性", bold: true }, "(x, y), (y, z) ∈ R ⇒ (x, z) ∈ R"],
  ], 0.7, 1.5, 3.95, [1.0, 2.95], { fontSize: 10.5, rowH: 0.35 });
  text(s, "[x]_R = { y ∈ S : (x, y) ∈ R }", 0.7, 2.98, 4, 0.35, { fontSize: 12, bold: true, color: C.green, margin: 0 });
  card(s, 5.15, 1.05, 4.35, 2.4, C.code);
  text(s, "由等价偶对求等价类", 5.35, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  const st = ["从 n 个**单元素集合**开始；", "依次读入偶对 (x, y)，**查找** x、y 所在子集；", "两个根不同，就把两个子集**合并**；", "最后剩下的非空子集就是等价类。"];
  st.forEach((t, i) => {
    numCircle(s, i + 1, 5.35, 1.55 + i * 0.45, 0.3, C.green);
    text(s, t, 5.75, 1.5 + i * 0.45, 3.65, 0.4, { fontSize: 10.5, valign: "middle", margin: 0 });
  });
  callout(s, "并查集（union / find）", "由若干**互不相交子集**组成的集合抽象：`find` 判断两个元素是否属于同一集合，`union` 把两个集合归并为一个。常用来维护「已经连通」「属于同一组」这类关系。", 0.5, 3.6, 9.0, 1.0, { fontSize: 11 });
  text(s, "所有等价类互不相交，它们的并正好是 S——等价关系就是对 S 的一种**划分**。", 0.5, 4.72, 9, 0.35, { fontSize: 11, color: C.goldText, bold: true });
}

// parent pointer
{
  const s = content("6.2.5", "6.2.5 并查集 · 父指针表示法", "每个子集是一棵树，树根就是集合的标识");
  card(s, 0.5, 1.05, 9.0, 1.2, C.code);
  image(s, "fig-6-10", 0.7, 1.1, 5.5, 1.1);
  text(s, "图 6.10　只存父结点下标：图 6.1 那棵树的父指针数组", 6.3, 1.25, 3.1, 0.8, { fontSize: 10, color: C.muted, margin: 0 });
  card(s, 0.5, 2.4, 5.6, 1.85, C.code);
  image(s, "fig-6-11", 0.6, 2.45, 5.4, 1.75);
  bullets(s, [
    "森林中每棵树代表一个子集。",
    "`find`：沿父链走到**根**。",
    "`union`：把一棵树的根**指向**另一棵树的根。",
    "**不必搬动**集合中的所有元素。",
  ], 6.3, 2.4, 3.2, 1.9, { fontSize: 11.5, gap: 5 });
  callout(s, "图 6.11", "(a) S₁、(b) S₂ 各是一棵树；(c) 合并后 **S₁ 的根 1 挂到了 S₂ 的根 2 下**，得到 S₃。", 0.5, 4.4, 9.0, 0.72, { fontSize: 11, ...MINT });
}

// degenerate
{
  const s = content("6.2.5", "6.2.5 并查集 · 退化", "朴素合并：反复把大树挂到小树下，退化成链");
  card(s, 0.5, 1.05, 9.0, 2.3, C.code);
  image(s, "fig-6-12", 0.7, 1.1, 8.6, 2.2);
  text(s, "图 6.12　(a) 起初 n 个单元素集合；(b) 每次都把大树挂到小树下，最后退化成一条长链", 0.5, 3.38, 9, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  card(s, 0.5, 3.8, 4.35, 1.32, "FDF0EE");
  text(s, "树高 n → find 是 O(n)", 0.7, 3.9, 4, 0.35, { fontSize: 15, bold: true, color: C.bad, margin: 0 });
  text(s, "查最底下那个结点，要沿父链一路走到根。", 0.7, 4.35, 4, 0.6, { fontSize: 11, margin: 0 });
  card(s, 5.15, 3.8, 4.35, 1.32, "EAF4EF");
  text(s, "两条改进，本书都实现了", 5.35, 3.9, 4, 0.35, { fontSize: 15, bold: true, color: C.ok, margin: 0 });
  text(s, "① 重量权衡合并规则　② 路径压缩", 5.35, 4.35, 4, 0.6, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
}

// weighted union
{
  const s = content("6.2.5", "6.2.5 并查集 · 改进一", "重量权衡合并规则（weighted union rule）");
  card(s, 0.5, 1.05, 9.0, 0.75, C.dark);
  text(s, "合并时看两个集合的元素个数：「令含元素少的子集的树根指向含元素多的子集的根」", 0.7, 1.05, 8.6, 0.75, { fontSize: 14, bold: true, color: C.gold, valign: "middle", margin: 0 });
  bullets(s, [
    "原书【代码6.8】结点里那个 `int nCount; //子树元素数目` 就是为它准备的，本书对应 `size_`。",
    "深度限制在 **O(log n)**：结点所在的树**每被挂到别的树下一次**，它的深度加 1，而它所在集合的元素个数**至少翻倍**——所以任何结点的深度最多增加 log n 次。",
    "并列时（规模相同），本书让**值大的根挂到值小的根下**——原书没规定，取自课程第 6 章习题 8 的原话。",
  ], 0.5, 1.95, 5.4, 3.1, { fontSize: 11.5, gap: 8 });
  callout(s, "⚠ 别和「按秩合并」混了", [
    "按秩比的是**树高**，按重量比的是**元素个数**。",
    "两者复杂度同阶，但在同一组等价对上会长出**形状不同**的树。",
    "本书按原书口径用重量；习题 8 要求「重量权衡合并规则与路径压缩」并画父指针数组，**换成按秩就对不上答案**。",
  ], 6.1, 1.95, 3.4, 3.17, { fontSize: 10.5, gap: 5, ...RED });
}

// path compression
{
  const s = content("6.2.5", "6.2.5 并查集 · 改进二", "路径压缩：find 顺手把沿途结点直接挂到根下");
  card(s, 0.5, 1.05, 9.0, 2.75, C.code);
  image(s, "fig-6-13", 0.7, 1.1, 8.6, 2.65);
  bullets(s, [
    "`find` 在返回根之前，把沿途**每个结点的父指针都直接改成根**。",
    "图 6.13：对结点 7 调用一次 `find`，路径 **7 → 5 → 2** 上的结点都改挂到根 1 下；而 **9、10 仍留在 7 下面**。",
  ], 0.5, 3.9, 5.6, 1.2, { fontSize: 11, gap: 5 });
  callout(s, "两条合起来", "m 次操作的摊还代价是 O(m α(n))，α 是反 Ackermann 函数——大量操作**接近常数**。", 6.3, 3.9, 3.2, 1.22, { fontSize: 10.5, ...MINT });
}

// DisjointSet code 1
{
  const s = content("6.2.5", "6.2.5 并查集 · modern.hpp · DisjointSet（1/3）", "构造与 find：【算法6.9】路径压缩是一行递归");
  codeBlock(s, `class DisjointSet {
public:
    explicit DisjointSet(std::size_t count) : parent_(count), size_(count, 1) {
        for (std::size_t index = 0; index < count; ++index) {
            parent_[index] = index;
        }
    }

    std::size_t find(std::size_t index) {
        if (index >= parent_.size()) {
            throw std::out_of_range("disjoint-set index");
        }
        if (parent_[index] != index) {
            parent_[index] = find(parent_[index]);  // 【算法6.9】路径压缩
        }
        return parent_[index];
    }`, 0.5, 1.02, 6.3, 3.0, { fontSize: 9, hl: [12, 13, 14] });
  callout(s, "初始", "每个元素 `parent_[i] = i`：自己就是根，n 个单元素集合；`size_` 全为 1。", 7.0, 1.02, 2.5, 1.45, { fontSize: 10.5 });
  callout(s, "越界", "下标越界抛 `out_of_range`——调用方的错误。", 7.0, 2.6, 2.5, 1.42, { fontSize: 10.5, ...RED });
  card(s, 0.5, 4.15, 9.0, 0.97, C.cream);
  text(s, "递归展开：find(7) → find(5) → find(2) → find(1) 返回 1；回溯时依次写 parent_[2] = 1、parent_[5] = 1、parent_[7] = 1——**沿途每个结点一步到根**。", 0.7, 4.2, 8.6, 0.87, { fontSize: 11.5, valign: "middle", margin: 0 });
}

// DisjointSet code 2
{
  const s = content("6.2.5", "6.2.5 并查集 · modern.hpp · DisjointSet（2/3）", "unite：先各自找到根，小树挂到大树下");
  codeBlock(s, `    bool unite(std::size_t left, std::size_t right) {
        left = find(left);
        right = find(right);
        if (left == right) {
            return false;  // 已经同类：幂等的可预期失败（D-001 §3c）
        }
        // 重量权衡：小树挂到大树下。并列时把**值大的根**挂到值小的根下——
        // 原书没有规定并列怎么办，这个口径取自课程第 6 章习题 8 的原话
        // 「当两棵树规模同样大时，使结点值较大的根结点作为值较小的根结点的子结点」，
        // 这样书里的实现能直接用来核对那道题的答案。
        if (size_[left] < size_[right] || (size_[left] == size_[right] && left > right)) {
            std::swap(left, right);
        }
        parent_[right] = left;
        size_[left] += size_[right];
        return true;
    }`, 0.5, 1.02, 9.0, 2.95, { fontSize: 9, hl: [11, 12, 13, 14, 15] });
  const pts = [
    ["先 find", "比较的是**两个根**；两个根相同就是已经同类，返回 `false`（幂等的可预期失败）。"],
    ["swap 保证 left 是「大」的", "规模小，或规模相同但**值更大**的那个，被换到 `right`，挂到 `left` 下。"],
    ["重量加在根上", "`size_[left] += size_[right]`：只有根的 `size_` 有意义。"],
  ];
  pts.forEach((p, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.08, 2.85, 1.04, C.code);
    text(s, p[0], x + 0.12, 4.12, 2.6, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
    text(s, p[1], x + 0.12, 4.4, 2.65, 0.7, { fontSize: 9.5, margin: 0 });
  });
}

// DisjointSet code 3 + demo trace
{
  const s = content("6.2.5", "6.2.5 并查集 · modern.hpp · DisjointSet（3/3）", "same / set_size / parents，以及 demo 的三次合并");
  codeBlock(s, `    [[nodiscard]] bool same(std::size_t left, std::size_t right) {
        return find(left) == find(right);
    }

    /// 某个元素所在集合的大小。原书 \`nCount\` 的对外读法，也让「重量」这件事可测。
    [[nodiscard]] std::size_t set_size(std::size_t index) { return size_[find(index)]; }

    /// 当前的父指针数组——课程习题要求画出的正是它。
    [[nodiscard]] const std::vector<std::size_t>& parents() const noexcept { return parent_; }

private:
    std::vector<std::size_t> parent_;
    std::vector<std::size_t> size_;  // 原书 nCount：子树元素数目
};`, 0.5, 1.02, 9.0, 2.45, { fontSize: 9 });
  text(s, "demo：DisjointSet sets(5)", 0.5, 3.58, 4.4, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["操作", "两个根（规模）", "parent_"],
    [{ t: "初始", bold: true }, "—", { t: "0 1 2 3 4", mono: true }],
    [{ t: "unite(0,1)", mono: true }, "0(1) vs 1(1)，并列 → 1 挂 0", { t: "0 0 2 3 4", mono: true }],
    [{ t: "unite(1,2)", mono: true }, "0(2) vs 2(1) → 2 挂 0", { t: "0 0 0 3 4", mono: true }],
    [{ t: "unite(3,4)", mono: true }, "3(1) vs 4(1)，并列 → 4 挂 3", { t: "0 0 0 3 3", mono: true }],
  ], 0.5, 3.9, 6.0, [1.2, 3.1, 1.7], { fontSize: 9.5, rowH: 0.24, tight: true });
  callout(s, "查询", "`same(0,2)`：根都是 0 → **是**\n`same(0,3)`：0 ≠ 3 → **否**", 6.75, 3.58, 2.75, 1.54, { fontSize: 11, ...MINT });
}

// exercise 8 trace
{
  const s = content("6.2.5", "6.2.5 并查集 · 逐步演算", "课程习题 8：0~15 上的 15 个等价对（重量权衡 + 路径压缩）");
  const T = [
    ["(0,2)", "0(1) · 2(1)", "并列：2 挂 0", ""],
    ["(1,2)", "1(1) · 0(2)", "1 挂 0", ""],
    ["(3,4)", "3(1) · 4(1)", "并列：4 挂 3", ""],
    ["(3,1)", "3(2) · 0(3)", "3 挂 0", ""],
    ["(3,5)", "0(5) · 5(1)", "5 挂 0", ""],
    ["(9,11)", "9(1) · 11(1)", "并列：11 挂 9", ""],
    ["(12,14)", "12(1) · 14(1)", "并列：14 挂 12", ""],
    ["(3,9)", "0(6) · 9(2)", "9 挂 0", ""],
    ["(4,14)", "0(8) · 12(2)", "12 挂 0", "find(4)：4 改挂 0"],
    ["(6,7)", "6(1) · 7(1)", "并列：7 挂 6", ""],
    ["(8,10)", "8(1) · 10(1)", "并列：10 挂 8", ""],
    ["(8,7)", "8(2) · 6(2)", "并列：8 挂 6", ""],
    ["(7,0)", "6(4) · 0(10)", "6 挂 0", ""],
    ["(10,15)", "0(14) · 15(1)", "15 挂 0", "find(10)：10、8 改挂 0"],
    ["(10,13)", "0(15) · 13(1)", "13 挂 0", ""],
  ];
  const rows = [["等价对", "两个根(规模)", "合并", "路径压缩"]];
  T.forEach((r) => rows.push([{ t: r[0], mono: true }, r[1], r[2], r[3] ? { t: r[3], color: C.bad, bold: true } : ""]));
  table(s, rows, 0.5, 0.98, 6.2, [0.85, 1.55, 1.5, 2.3], { fontSize: 9, rowH: 0.255, tight: true });
  text(s, "最终父指针数组（本书实现实测）", 6.9, 1.0, 2.6, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  const par = [0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 9, 0, 0, 12, 0];
  const pr = [["i", "parent"]];
  for (let i = 0; i < 8; i++) pr.push([{ t: `${i}  ·  ${i + 8}`, mono: true, align: "center" }, { t: `${par[i]}  ·  ${par[i + 8]}`, mono: true, bold: true, align: "center" }]);
  table(s, pr, 6.9, 1.33, 2.6, [1.3, 1.3], { fontSize: 9.5, rowH: 0.25, tight: true, align: "center" });
  callout(s, "注意", "7、11、14 **不直接挂在根下**：之后再没有 find 经过它们，路径压缩只改走过的路。", 6.9, 3.72, 2.6, 1.4, { fontSize: 10, ...RED });
}

// component counter concept
{
  const s = content("6.2.5", "6.2.5 并查集 · 应用", "顺带数出连通分量和连通点对");
  text(s, "**动态连通性**：图的边一条条加进来，每加一条就要回答「现在有几个连通分量」「现在有多少对顶点互相连通」。两个数都不必重新数：", 0.5, 1.02, 9, 0.6, { fontSize: 12 });
  card(s, 0.5, 1.75, 4.35, 1.5, C.code);
  text(s, "连通分量数", 0.7, 1.82, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "从 n 开始，每次**成功**合并减 1；两端本来就在同一集合里的**冗余边**不改变它。", 0.7, 2.18, 4.0, 1.0, { fontSize: 11, margin: 0 });
  card(s, 5.15, 1.75, 4.35, 1.5, C.code);
  text(s, "连通点对数", 5.35, 1.82, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "从 0 开始。规模 s₁、s₂ 的两个集合合并，新连通的无序点对恰好 **s₁ · s₂** 对：一边任取一个、另一边任取一个。", 5.35, 2.18, 4.0, 1.0, { fontSize: 11, margin: 0 });
  callout(s, "⚠ s₁、s₂ 从哪里读", [
    "重量记在**根**上，必须先 `find` 到根再读；拿边的端点直接读 `size_`，读到的是某棵子树**当年的旧规模**。",
    "也不能**合并之后**再读——那时两个规模已经加在了一起。",
    "点对数用 **64 位**无符号整数：最多 n(n−1)/2 对，32 位在 n 约 9.3 万时就会溢出。",
  ], 0.5, 3.4, 9.0, 1.72, { fontSize: 10.5, gap: 4, ...RED });
}

// component counter code
{
  const s = content("6.2.5", "6.2.5 并查集 · modern.hpp · ComponentCounter", "组合一个 DisjointSet，而不改动它");
  codeBlock(s, `class ComponentCounter {
public:
    explicit ComponentCounter(std::size_t count) : sets_(count), component_count_(count) {}

    /// 连一条边 (left, right)，返回因此**新**连通的点对数；两端本已连通时返回 0。
    std::uint64_t connect(std::size_t left, std::size_t right) {
        const std::uint64_t pairs =
            static_cast<std::uint64_t>(sets_.set_size(left)) * sets_.set_size(right);
        if (!sets_.unite(left, right)) {
            return 0;  // 冗余边：分量数不变，点对数不变
        }
        --component_count_;
        pair_total_ += pairs;
        return pairs;
    }

    [[nodiscard]] std::size_t components() const noexcept { return component_count_; }
    [[nodiscard]] std::uint64_t connected_pairs() const noexcept { return pair_total_; }

private:
    DisjointSet sets_;
    std::size_t component_count_;
    std::uint64_t pair_total_{0};
};`, 0.5, 1.02, 6.4, 4.1, { fontSize: 8, hl: [7, 8] });
  text(s, "例：n = 6（本书实现实测）", 7.1, 1.02, 2.4, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["边", "新对", "分量", "点对"],
    [{ t: "—", align: "center" }, "", "6", "0"],
    [{ t: "0-1", mono: true }, "1·1=1", "5", "1"],
    [{ t: "2-3", mono: true }, "1·1=1", "4", "2"],
    [{ t: "1-2", mono: true }, { t: "2·2=4", bold: true }, "3", "6"],
    [{ t: "0-3", mono: true }, { t: "冗余 0", color: C.bad }, "3", "6"],
    [{ t: "4-5", mono: true }, "1·1=1", "2", "7"],
  ], 7.1, 1.35, 2.4, [0.5, 0.75, 0.55, 0.6], { fontSize: 9.5, rowH: 0.3, tight: true, align: "center" });
  callout(s, "为什么组合", "内部并查集是**私有**的，调用方没法绕过计数直接合并，两个数不会失真。", 7.1, 3.62, 2.4, 1.5, { fontSize: 10, ...MINT });
}

// ============================ 6.3 ============================
sectionSlide("6.3", "树的顺序存储结构", "把结点按某种周游次序排进数组，再用很少的附加信息还原整棵树\n带右链先根 · 双标记先根 · 带度数后根 · 双标记层次");

// 6.3 overview
{
  const s = content("6.3", "6.3 顺序存储", "为什么要顺序存储，四种表示一览");
  text(s, "链式存储每个结点单独分配，指针占空间，也**不利于整块读写**。顺序存储要求在结点表中包含**足够的结构信息**。下面都以图 6.5(a) 的森林为例：", 0.5, 1.02, 9, 0.6, { fontSize: 12 });
  table(s, [
    ["表示法", "周游序列", "每个结点的附加信息", "还原时用"],
    [{ t: "带右链的先根次序", bold: true }, { t: "A B C E F D G H J I", mono: true }, "ltag + rlink（下标）", "顺序扫描 + 右链"],
    [{ t: "带双标记的先根次序", bold: true }, { t: "A B C E F D G H J I", mono: true }, "ltag + rtag（两位）", { t: "栈", bold: true, color: C.green }],
    [{ t: "带度数的后根次序", bold: true }, { t: "B E F C D A J H I G", mono: true }, "degree", { t: "栈", bold: true, color: C.green }],
    [{ t: "带双标记的层次次序", bold: true }, { t: "A G B C D H I E F J", mono: true }, "ltag + rtag", { t: "队列", bold: true, color: C.goldText }],
  ], 0.5, 1.75, 9.0, [2.1, 2.55, 2.4, 1.95], { fontSize: 10.5, rowH: 0.42 });
  callout(s, "先根序列的关键性质", "**任何结点的子树的所有结点都直接跟在该结点之后**，任何一个分支结点后面紧跟的是它的**第一个子结点**——下面几种表示法共同的基础。", 0.5, 4.0, 5.9, 1.12, { fontSize: 10.5 });
  callout(s, "本书口径", "原书给了四种，思路都对；本章不另写未验证的实现，只把**还原办法**说清楚（双标记先根有实现）。", 6.6, 4.0, 2.9, 1.12, { fontSize: 9.5, ...MINT });
}

// 6.3.1 right link preorder
{
  const s = content("6.3.1", "6.3 顺序存储 · 带右链的先根次序", "[ ltag | info | rlink ]：用 ltag 代替左链");
  card(s, 0.5, 1.05, 4.2, 1.75, C.code);
  image(s, "fig-6-14", 0.65, 1.12, 3.9, 1.5);
  text(s, "图 6.14　先根序列配合右链下标还原树形", 0.5, 2.8, 4.2, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  const idx = ["下标", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const info = ["info", "A", "B", "C", "E", "F", "D", "G", "H", "J", "I"];
  const ltag = ["ltag", "0", "1", "0", "1", "1", "1", "0", "0", "1", "1"];
  const rl = ["rlink", "6", "2", "5", "4", "—", "—", "—", "9", "—", "—"];
  table(s, [idx, info.map((v, i) => (i ? { t: v, bold: true, align: "center" } : { t: v, bold: true })), ltag.map((v, i) => (i ? { t: v, align: "center", mono: true } : { t: v, bold: true })), rl.map((v, i) => (i ? { t: v, align: "center", mono: true, color: v === "—" ? C.muted : C.bad } : { t: v, bold: true }))],
    4.9, 1.05, 4.6, [0.6, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4], { fontSize: 10, rowH: 0.34, tight: true, align: "center" });
  text(s, "rlink = 下一个兄弟的下标（即对应二叉树的右子结点）；ltag = 1 表示叶结点（二叉树中没有左子结点）。", 4.9, 2.5, 4.6, 0.6, { fontSize: 10, color: C.muted, margin: 0 });
  callout(s, "为什么不存 llink？", [
    "`ltag == 0` 的结点有左子结点，它的 llink **一定指向存储区中的下一个结点**（先根序列的性质）；",
    "`ltag == 1` 的结点没有左子结点，llink 为空。",
    "所以顺着数组往下走、再靠右链**跳过整棵子树**，就能还原所有父子和兄弟关系。",
  ], 0.5, 3.2, 9.0, 1.92, { fontSize: 11, gap: 5 });
}

// 6.3.2 dual tag preorder
{
  const s = content("6.3.2", "6.3 顺序存储 · 带双标记的先根次序", "[ ltag | info | rtag ]：右链换成一个布尔标记");
  codeBlock(s, `先根次序   A  B  C  E  F  D  G  H  J  I
ltag       0  1  0  1  1  1  0  0  1  1     0 = 有孩子
rtag       0  0  0  0  1  1  1  0  1  1     0 = 有下一个兄弟`, 0.5, 1.05, 6.0, 0.85, { fontSize: 10.5, lang: "text" });
  card(s, 6.7, 1.05, 2.8, 0.85, C.code);
  image(s, "fig-6-15", 6.8, 1.1, 2.6, 0.75);
  text(s, "ltag：有没有孩子；rtag：有没有下一个兄弟。理论上只需**两位**信息。但普通 C++ `bool` 成员**通常按字节存储**，只有显式位压缩或位域才谈得上这种节省。", 0.5, 2.0, 9.0, 0.62, { fontSize: 11 });
  callout(s, "⚠ 照抄图 6.15 很容易把两行读反", [
    "图 6.15 三行从上到下是 **rtag / info / ltag**——`ltag` 在**最下面**。",
    "按定义核一遍：B 是叶结点 → ltag 必须是 1；B 有兄弟 C → rtag 必须是 0。",
    "两行一旦互换，还原出的是**另一片森林**（C 变成 B 的孩子），而它的**先根序列恰好还是 A B C E F D G H J I**——只对先根查不出来，得同时对后根序列 B E F C D A J H I G。",
  ], 0.5, 2.75, 9.0, 1.85, { fontSize: 10.5, gap: 4, ...RED });
  text(s, "它是早期教材常见的顺序编码，今天主要用于理解树的序列化思想，不是通用工程接口。", 0.5, 4.7, 9, 0.35, { fontSize: 10.5, color: C.muted });
}

// dual tag trace
{
  const s = content("6.3.2", "6.3 顺序存储 · 带双标记的先根次序", "用一把栈还原：逐步演算");
  text(s, "扫到 rtag = 0（**有兄弟**）的结点就压栈；扫到 ltag = 1（**没孩子**，子树到头）的结点，就弹栈顶，把**下一个结点**接成它的右兄弟。", 0.5, 1.0, 9, 0.55, { fontSize: 11.5 });
  const T = [
    ["0", "A", "0", "0", "压 A", "下一个 B 是 A 的孩子", "A"],
    ["1", "B", "1", "0", "压 B", "弹 B → C 是 B 的兄弟", "A"],
    ["2", "C", "0", "0", "压 C", "下一个 E 是 C 的孩子", "A C"],
    ["3", "E", "1", "0", "压 E", "弹 E → F 是 E 的兄弟", "A C"],
    ["4", "F", "1", "1", "—", "弹 C → D 是 C 的兄弟", "A"],
    ["5", "D", "1", "1", "—", "弹 A → G 是 A 的兄弟", "（空）"],
    ["6", "G", "0", "1", "—", "下一个 H 是 G 的孩子", "（空）"],
    ["7", "H", "0", "0", "压 H", "下一个 J 是 H 的孩子", "H"],
    ["8", "J", "1", "1", "—", "弹 H → I 是 H 的兄弟", "（空）"],
    ["9", "I", "1", "1", "收尾检查", "末结点 1,1 且栈空 ✓", "（空）"],
  ];
  const rows = [["i", "结点", "ltag", "rtag", "rtag=0?", "ltag 决定下一个结点接在哪", "处理后栈（底→顶）"]];
  T.forEach((r) => rows.push([
    { t: r[0], align: "center" }, { t: r[1], bold: true, align: "center" }, { t: r[2], mono: true, align: "center" }, { t: r[3], mono: true, align: "center" },
    { t: r[4], color: r[4] === "—" ? C.muted : C.green, bold: r[4] !== "—" },
    { t: r[5], color: r[5].startsWith("弹") ? C.bad : C.text }, { t: r[6], mono: true },
  ]));
  table(s, rows, 0.5, 1.6, 9.0, [0.4, 0.6, 0.6, 0.6, 1.05, 3.55, 2.2], { fontSize: 9.5, rowH: 0.3, tight: true });
  text(s, "结果：A 的孩子 B、C、D；C 的孩子 E、F；A 的兄弟 G；G 的孩子 H、I；H 的孩子 J——正是图 6.5(a)。", 0.5, 4.95, 9, 0.3, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
}

// from_dual_tag code 1
{
  const s = content("6.3.2", "6.3 顺序存储 · modern.hpp · 【算法6.10】（1/3）", "from_dual_tag：结点格式与准备工作");
  codeBlock(s, `struct DualTagNode {
    T value;
    bool has_child;    ///< 原书 ltag == 0
    bool has_sibling;  ///< 原书 rtag == 0
};

[[nodiscard]] static GeneralTree from_dual_tag(const DualTagNode* nodes, std::size_t count) {
    GeneralTree tree;
    if (count == 0) {
        return tree;
    }
    if (nodes == nullptr) {
        throw std::invalid_argument("from_dual_tag: 结点数组是空指针");
    }

    // 原书用 \`stack<TreeNode<T>*> aStack\`，这里用 vector 当栈（见 unit.json 豁免）。
    std::vector<Node*> waiting;  // 已扫到、还等着接右兄弟的结点
    Node* current = new Node(nodes[0].value);
    tree.root_ = current;`, 0.5, 1.02, 9.0, 3.2, { fontSize: 9 });
  const pts = [
    ["has_child", "原书 **ltag == 0**（注意取反）"],
    ["has_sibling", "原书 **rtag == 0**"],
    ["waiting", "已扫到、还等着接右兄弟的结点；vector 当栈"],
  ];
  pts.forEach((p, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.32, 2.85, 0.8, C.code);
    text(s, p[0], x + 0.12, 4.36, 2.6, 0.3, { fontSize: 11, bold: true, fontFace: MONO, color: C.green, margin: 0 });
    text(s, p[1], x + 0.12, 4.66, 2.65, 0.42, { fontSize: 10, margin: 0 });
  });
}

// from_dual_tag code 2
{
  const s = content("6.3.2", "6.3 顺序存储 · modern.hpp · 【算法6.10】（2/3）", "主循环：有孩子就接成 child，否则弹栈接成 sibling");
  codeBlock(s, `    // ...
    for (std::size_t i = 0; i + 1 < count; ++i) {
        if (nodes[i].has_sibling) {
            waiting.push_back(current);
        }
        Node* fresh = new Node(nodes[i + 1].value);
        if (nodes[i].has_child) {
            current->child = fresh;
            fresh->parent = current;
        } else {
            // 子树到头了：刚建的结点属于栈顶那个结点的右兄弟。
            //
            // 原书这里直接 \`aStack.top()\`，**没有判空**。标志位不自洽的输入
            // （例如全是 has_child=false、has_sibling=false）会让它对空栈取顶，
            // 那是未定义行为（证据见 legacy.md 缺陷 4）。这里判空并抛异常。
            if (waiting.empty()) {
                delete fresh;
                throw std::invalid_argument("from_dual_tag: 标志位不自洽，右兄弟无处安放");
            }
            Node* owner = waiting.back();
            waiting.pop_back();
            owner->sibling = fresh;
            fresh->parent = owner->parent;  // 兄弟与它共享同一个父结点
        }
        current = fresh;
    }`, 0.5, 1.02, 9.0, 4.1, { fontSize: 8.8, hl: [4, 9, 10, 20, 21, 22, 23] });
}

// from_dual_tag code 3
{
  const s = content("6.3.2", "6.3 顺序存储 · modern.hpp · 【算法6.10】（3/3）", "收尾检查：不自洽就拒绝，不做「尽量还原」");
  codeBlock(s, `    // ...
    // 先根次序里最后一个结点必是叶子，**而且没有下一个兄弟**——
    // 它的孩子和它的右兄弟都只能排在它后面，而它已经是最后一个了。
    // 按标记的定义，末结点必然 \`ltag == 1 且 rtag == 1\`。
    // 循环只走到 count-2，所以末结点的两个标志位都得在这里单独查。
    //
    // **不自洽就拒绝，不做「尽量还原」**：压栈（有兄弟）与出栈（子树到头）
    // 必须一一配对，配不上的序列不对应任何森林的编码。见 legacy.md 缺陷 4。
    if (nodes[count - 1].has_child || nodes[count - 1].has_sibling || !waiting.empty()) {
        throw std::invalid_argument("from_dual_tag: 标志位不自洽，序列没有正常收尾");
    }
    return tree;
}`, 0.5, 1.02, 9.0, 2.35, { fontSize: 9, hl: [10, 11, 12] });
  callout(s, "原书这段代码有一处会崩", "`ltag == 1` 分支里直接 `pointer = aStack.top();`，**没有判空**。标志位不自洽（比如两个结点都声称「没孩子、也没兄弟」）→ 对空栈取顶，**未定义行为**。本书判空并抛 `std::invalid_argument`；测试里三种不自洽输入各有一条用例。", 0.5, 3.5, 4.4, 1.62, { fontSize: 10, ...RED });
  callout(s, "为什么拒绝而不是还原", [
    "先根序列最后一个结点后面没有结点了，孩子和右兄弟都无处安放，**必然是 1, 1**。",
    "「有兄弟」入栈与「子树到头」出栈**一一配对**；对空栈出栈说明违反了配对。",
    "这类输入**不对应任何森林**——多半是抄错一位或被截断。默默还原只会把错误往后传。",
  ], 5.1, 3.5, 4.4, 1.62, { fontSize: 9.5, gap: 2, ...MINT });
}

// 6.3.3 degree postorder
{
  const s = content("6.3.3", "6.3 顺序存储 · 带度数的后根次序", "[ info | degree ]：不含指针，也能反映结构");
  card(s, 0.5, 1.05, 4.2, 1.1, C.code);
  image(s, "fig-6-16", 0.65, 1.1, 3.9, 1.0);
  bullets(s, [
    "后根序列里，任何一棵子树的所有结点**聚集在一起**，并以该子树的**根作为最后一个结点**。",
    "度数为 0 的是叶子；遇到度数为 k 的结点，排在它之前、离它最近的 **k 棵子树的根**就是它的 k 个孩子。",
  ], 0.5, 2.25, 4.2, 2.1, { fontSize: 11, gap: 6 });
  callout(s, "用栈", "每读到度数为 d 的结点，从栈顶弹出 d 棵子树做孩子（**逆序**接回），再把新树压回；扫完，栈里剩下的就是整棵树（或森林）。", 0.5, 4.2, 4.2, 0.92, { fontSize: 9.5, tsize: 10.5 });
  const T = [
    ["B / 0", "压 B", "B"], ["E / 0", "压 E", "B E"], ["F / 0", "压 F", "B E F"],
    ["C / 2", "弹 F、E → C(E,F)", "B C"], ["D / 0", "压 D", "B C D"],
    ["A / 3", "弹 D、C、B → A(B,C,D)", "A"], ["J / 0", "压 J", "A J"],
    ["H / 1", "弹 J → H(J)", "A H"], ["I / 0", "压 I", "A H I"], ["G / 2", "弹 I、H → G(H,I)", "A G"],
  ];
  const rows = [["结点/度", "动作", "栈（底→顶）"]];
  T.forEach((r) => rows.push([{ t: r[0], mono: true, bold: true, align: "center" }, { t: r[1], color: r[1].startsWith("弹") ? C.bad : C.text, bold: r[1].startsWith("弹") }, { t: r[2], mono: true }]));
  table(s, rows, 4.95, 1.05, 4.55, [0.95, 2.25, 1.35], { fontSize: 9.5, rowH: 0.3, tight: true });
  text(s, "栈里剩两棵树 A、G：正是图 6.5(a) 的森林。", 4.95, 4.45, 4.55, 0.5, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
}

// 6.3.4 level order dual tag
{
  const s = content("6.3.4", "6.3 顺序存储 · 带双标记的层次次序", "层次序 + 双标记：队列「承上启下」");
  card(s, 0.5, 1.05, 3.4, 1.15, C.code);
  image(s, "fig-6-17", 0.6, 1.1, 3.2, 1.05);
  text(s, "ltag = 1：没有左子结点（孩子）\nrtag = 1：没有下一个兄弟", 0.5, 2.25, 3.4, 0.5, { fontSize: 10, color: C.muted, margin: 0 });
  bullets(s, [
    "同一层的结点**聚集在一起**；有右兄弟的结点，右兄弟就排在它后面。",
    "任何结点的孩子都排在它的**所有兄弟之后**。",
    "rlink：rtag = 0 就指向**紧邻的下一个结点**。",
    "llink：ltag = 0 的结点入队；遇到 rtag = 1（一条兄弟链扫完），**下一个结点就是队头的最左子**。",
  ], 0.5, 2.8, 3.4, 2.35, { fontSize: 10, gap: 3 });
  const T = [
    ["A", "0", "0", "入队", "A 的兄弟 = G", "A"],
    ["G", "0", "1", "入队", "出队 A → B 是 A 的最左子", "G"],
    ["B", "1", "0", "", "B 的兄弟 = C", "G"],
    ["C", "0", "0", "入队", "C 的兄弟 = D", "G C"],
    ["D", "1", "1", "", "出队 G → H 是 G 的最左子", "C"],
    ["H", "0", "0", "入队", "H 的兄弟 = I", "C H"],
    ["I", "1", "1", "", "出队 C → E 是 C 的最左子", "H"],
    ["E", "1", "0", "", "E 的兄弟 = F", "H"],
    ["F", "1", "1", "", "出队 H → J 是 H 的最左子", "（空）"],
    ["J", "1", "1", "", "序列结束", "（空）"],
  ];
  const rows = [["结点", "ltag", "rtag", "ltag=0", "rtag 决定的链接", "队列"]];
  T.forEach((r) => rows.push([{ t: r[0], bold: true, align: "center" }, { t: r[1], mono: true, align: "center" }, { t: r[2], mono: true, align: "center" }, { t: r[3], color: C.green, bold: true, align: "center" }, { t: r[4], color: r[4].startsWith("出队") ? C.bad : C.text, bold: r[4].startsWith("出队") }, { t: r[5], mono: true }]));
  table(s, rows, 4.1, 1.05, 5.4, [0.5, 0.45, 0.45, 0.6, 2.55, 0.85], { fontSize: 9, rowH: 0.3, tight: true });
  text(s, "适合需要**按层处理**的外部存储。", 4.1, 4.5, 5.4, 0.3, { fontSize: 10.5, color: C.goldText, bold: true, margin: 0 });
}

// modern view
{
  const s = content("6.3", "6.3 顺序存储 · 现代视角", "紧凑树编码：经典表示法该怎么看");
  card(s, 0.5, 1.1, 4.35, 2.6, C.code);
  text(s, "经典编码（本节）", 0.7, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "右链、双标记、带度数表示。",
    "用来理解「**结构信息如何随周游序列保存**」。",
    "还原靠顺序扫描 + 栈或队列。",
  ], 0.7, 1.65, 4.0, 1.9, { fontSize: 11.5, gap: 6 });
  card(s, 5.15, 1.1, 4.35, 2.6, C.cream);
  text(s, "succinct tree 编码", 5.35, 1.2, 4, 0.35, { fontSize: 14, bold: true, color: C.goldText, margin: 0 });
  bullets(s, [
    "**LOUDS**、平衡括号（balanced parentheses）等。",
    "同样把树压成位串，但**明确规定位级布局**。",
    "支持秩/选择（rank/select）操作，有明确的随机访问边界。",
  ], 5.35, 1.65, 4.0, 1.9, { fontSize: 11.5, gap: 6 });
  callout(s, "结论", "工程中要紧凑存储或高速导航，通常会考虑 LOUDS、平衡括号这类编码，**而不是直接照搬双标记结构**。本节的表示法是经典编码对照。", 0.5, 3.9, 9.0, 1.2, { fontSize: 11.5, ...MINT });
}

// ============================ 6.4 ============================
sectionSlide("6.4", "K 叉树", "每个结点的孩子数有固定上限 K\n满 K 叉树 · 完全 K 叉树 · 数组编号公式");

// K-ary definition
{
  const s = content("6.4", "6.4 K 叉树", "满 K 叉树与完全 K 叉树");
  card(s, 0.5, 1.05, 9.0, 2.05, C.code);
  image(s, "fig-6-18", 0.7, 1.1, 8.6, 1.95);
  bullets(s, [
    "有些应用每个结点的孩子数有固定上限 K：三子棋的博弈树、某些 B 树的内存模拟。不必走「任意度 + 兄弟链」。",
    "**满 K 叉树**：每个结点要么是叶，要么**恰好 K 个孩子**。",
    "**完全 K 叉树**：只有最下两层的度可以小于 K，且最下层**靠左对齐**。",
  ], 0.5, 3.2, 5.6, 1.95, { fontSize: 11, gap: 5 });
  callout(s, "应用", "计算机图形学里的 **4 叉树、8 叉树**；K = 2 就回到二叉树。分支结点孩子数定死，链式和顺序两种存法都好实现。", 6.3, 3.2, 3.2, 1.92, { fontSize: 10.5 });
}

// K-ary formulas
{
  const s = content("6.4", "6.4 K 叉树", "完全 K 叉树按层编号存进数组：父子公式");
  card(s, 0.5, 1.05, 4.35, 2.1, C.code);
  text(s, "从 0 编号（本书正文）", 0.7, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "结点 i 的孩子：Ki+1, …, Ki+K\n结点 i 的父：⌊(i−1)/K⌋", 0.7, 1.5, 4, 0.7, { fontSize: 12.5, bold: true, color: C.green, margin: 0, lsm: 1.3 });
  text(s, "K = 3：结点 4 的父是 ⌊3/3⌋ = 1，孩子是 13、14、15。", 0.7, 2.4, 4, 0.6, { fontSize: 11, margin: 0 });
  card(s, 5.15, 1.05, 4.35, 2.1, C.code);
  text(s, "从 1 编号（原书习题 10）", 5.35, 1.12, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "第 i 个孩子（1 ≤ i ≤ K）：K(N−1)+i+1\n结点 N 的父（N > 1）：⌊(N−2)/K⌋+1", 5.35, 1.5, 4.1, 0.7, { fontSize: 12, bold: true, color: C.green, margin: 0, lsm: 1.3 });
  text(s, "K = 3：结点 4 的父是 1，孩子是 11、12、13。", 5.35, 2.4, 4, 0.6, { fontSize: 11, margin: 0 });
  callout(s, "⚠ 两套编号不能混用", "⌊(N−1)/K⌋ 是 **0 起始**的父公式。和 1 起始的孩子公式混用，会在 N = K+1 附近出错。答题先说清编号从 0 还是 1 起。", 0.5, 3.3, 5.6, 1.82, { fontSize: 11, ...RED });
  callout(s, "本章口径", "主实现仍是任意度的左子 / 右兄，不单独做一份 K 叉数组。需要固定 K、又想顺序存放时，用编号公式即可——和完全二叉树是同一套办法。", 6.3, 3.3, 3.2, 1.82, { fontSize: 10.5, ...MINT });
}

// exercises
{
  const s = content("练", "课堂练习", "几道代表性的题（答案见 book/习题与参考答案.md）");
  const qs = [
    ["对树 `A(B(E,F),C(G),D(H,I,J))` 写出先根、后根、层次序列。", "先根 **ABEFCGDHIJ**；后根 **EFBGCHIJDA**；层次 **ABCDEFGHIJ**。"],
    ["度为 2 的有序树和二叉树差在哪里？举一个例子。", "二叉树还区分左右：根只有右孩子 B、左孩子为空是合法二叉树，却没有对应的度为 2 有序树形态。"],
    ["根 A 有孩子 B、C，C 有孩子 D，写出带度数的后根序列，说明栈如何弹出孩子。", "`B/0, D/0, C/1, A/2`。读到 C/1 弹 1 棵作其孩子再压回 C；读到 A/2 按逆序弹 C、B，接回 B、C 次序。"],
    ["原书习题 8：0~15 的等价对按重量权衡 + 路径压缩归并，给出父指针数组。", "见前面的逐步演算页；并列时**值大的根挂到值小的根下**。"],
  ];
  qs.forEach((q, i) => {
    const y = 1.05 + i * 1.02;
    card(s, 0.5, y, 9.0, 0.92, i % 2 ? C.white : C.code, "D5DDD9");
    numCircle(s, i + 1, 0.65, y + 0.25, 0.4, C.dark);
    text(s, q[0], 1.2, y + 0.06, 8.2, 0.36, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], 1.2, y + 0.44, 8.2, 0.44, { fontSize: 10.5, margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["两种定义", "**递归定义**与**二元关系定义**等价；术语沿用二叉树。度为 2 的有序树**不是**二叉树。"],
    ["一一对应", "左 = **第一个孩子**，右 = **下一个兄弟**。先根 = 前序，后根 = 中序；层次序与对应二叉树不同。"],
    ["左子/右兄", "采用最多的表示法：任意度只要两个指针。`GeneralTree` 插入删除要**三条链一起改**。"],
    ["并查集", "父指针表示；**重量权衡**（小挂大，并列值大挂值小）+ **路径压缩**，操作接近常数。"],
    ["顺序存储", "右链 / 双标记先根、带度数后根、双标记层次：**栈或队列**还原；完全 K 叉树用数组编号。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
