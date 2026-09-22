// 第五章 二叉树 —— 由 dsa-modernization/book/ch05-binary-tree.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch05_binary_tree.js ../202609_DSA_05_Binary_Tree.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_05_Binary_Tree.pptx");

// 讲义中引用的图片（name → 本地路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const IMAGES = {};
["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "23"]
  .forEach((n) => { IMAGES[`fig-5-${n}`] = `${SCAN}/fig-5-${n}.png`; });

(async () => {
  const D = createDeck({ title: "DSA 第五章 二叉树", imgDir: path.join(__dirname, "..", ".cache", "ch05") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  // 画一棵小树：nodes = {id: [label, cx, cy, fill?, textColor?]}，edges = [[父, 子, 颜色?], ...]
  const drawTree = (s, nodes, edges, o = {}) => {
    const r = o.r || 0.17;
    edges.forEach(([p, c, color]) => {
      const [, x1, y1] = nodes[p], [, x2, y2] = nodes[c];
      s.addShape(pres.shapes.LINE, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: color || C.green, width: color ? 2 : 1.2 } });
    });
    Object.values(nodes).forEach(([label, cx, cy, fill, tcolor]) => {
      s.addShape(pres.shapes.OVAL, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: fill || C.mint }, line: { color: C.green, width: 1 } });
      text(s, String(label), cx - r, cy - r, 2 * r, 2 * r, { fontSize: o.fs || 11, bold: true, color: tcolor || C.dark, align: "center", valign: "middle", margin: 0 });
    });
  };
  // 多段文字：pptxgenjs 会让「含换行的 run」之后的 run 另起一行，所以按段拆成不加符号的列表项
  const P = (str) => str.split("\n").map((t) => ({ t: t || " ", plain: true }));
  const HL = "F9D27A";   // 高亮结点（金色）
  const RED = "FDF0EE";  // 红色 callout 底色

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第五章  二叉树",
  subtitle: "Binary Tree：递归定义，递归算法",
  topics: "定义与五种基本形态 · 满 / 完全 / 扩充二叉树 · 三条性质\n前序 / 中序 / 后序 / 层次周游 · 表达式树 · 由周游序列重建\n二叉链表 · 完全二叉树进数组 · 二叉搜索树的查找、插入、删除\n最小堆 · 建堆 O(n) · 优先队列与对顶堆 · Huffman 树与前缀编码",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["二叉树为什么不是「度为 2 的树」？", "子树**有左右之分**，次序不能颠倒：挂左边和挂右边是**两棵不同的**二叉树。"],
    ["一棵树能摊成几种线性序列？", "前序、中序、后序靠**栈**（递归），层次周游靠**队列**。同一个结点，换一种次序就换一批邻居。"],
    ["要多少「序」，才够快？", "全序：**BST** 让增删查都走 O(h)。只要最小值：**堆**只需局部有序，建堆 O(n)；Huffman 反复取两个最小。"],
  ];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.6, C.code);
    numCircle(s, i + 1, x + 0.2, 1.32, 0.46, C.dark);
    text(s, q[0], x + 0.2, 1.92, 2.5, 0.7, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], x + 0.2, 2.62, 2.5, 1.05, { fontSize: 11, margin: 0, lsm: 1.15 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "一句话概括", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "二叉树的定义是", options: { color: C.white } },
    { text: "递归", options: { color: C.gold, bold: true } },
    { text: "的，所以本章算法几乎都是递归的——", options: { color: C.white } },
    { text: "代码的形状和定义的形状一眼对上", options: { color: C.gold, bold: true } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 14, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["概念与周游", ["5.1 定义、术语、五种基本形态", "满 / 完全 / 扩充二叉树；三条性质", "5.2 二叉树 ADT", "前序 / 中序 / 后序（递归）", "表达式树；由周游序列重建", "层次周游：队列"]],
    ["存储与 BST", ["5.3 二叉链表、三叉链表", "完全二叉树的顺序存储", "教学版完整实现：三法则、后序释放", "5.4 二叉搜索树：查找、插入", "删除：中序前驱顶替"]],
    ["堆与 Huffman", ["5.5 最小堆：上浮、下沉", "建堆为什么是 O(n)", "优先队列；对顶堆求中位数", "5.6 Huffman 树与 WPL", "前缀码：编码与译码", "5.6a 进阶：迭代释放与深拷贝"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 0 ? C.cream : C.code);
    numCircle(s, i + 1, x + 0.2, 1.3, 0.42, C.dark);
    text(s, c[0], x + 0.75, 1.3, 2.0, 0.42, { fontSize: 17, bold: true, color: C.dark, margin: 0, valign: "middle" });
    bullets(s, c[1], x + 0.15, 1.95, 2.6, 3.0, { fontSize: 11.5, gap: 8 });
  });
}

// 4. Run first: tree
{
  const s = content("▶", "先跑一遍 · binary_tree/demo.cpp（后半的 BST 见 5.4 例题）", "建一棵 5 个结点的树，打印四种周游");
  codeBlock(s, `#include "teaching.hpp"

#include <iostream>

int main() {
    // 建一棵样例树：A 的左孩子 B（孩子 D、E），右孩子 C（叶子）
    BinaryTree<char> d, e, b, c, root;
    d.create_leaf('D');
    e.create_leaf('E');
    b.create_tree('B', d, e);      // d、e 的所有权转移给 b，之后两者变空
    c.create_leaf('C');
    root.create_tree('A', b, c);

    std::cout << "先序: ";
    root.preorder([](char value) { std::cout << value; });
    std::cout << "\\n中序: ";
    root.inorder([](char value) { std::cout << value; });
    std::cout << "\\n后序: ";
    root.postorder([](char value) { std::cout << value; });
    std::cout << "\\n层次: ";
    root.level_order([](char value) { std::cout << value; });
    std::cout << '\\n';
    // ...`, 0.5, 1.05, 5.9, 4.05, { fontSize: 9 });
  drawTree(s, { A: ["A", 7.95, 1.3], B: ["B", 7.35, 1.85], C: ["C", 8.55, 1.85], D: ["D", 7.0, 2.4], E: ["E", 7.7, 2.4] },
    [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"]]);
  consoleBlock(s, "先序: ABDEC\n中序: DBEAC\n后序: DEBCA\n层次: ABCDE", 6.6, 2.75, 2.9, 1.2, 10.5);
  callout(s, "create_tree 接管子树", "`d`、`e` 在调用后**变空**，不会和新树抢着析构同一批结点。", 6.6, 4.05, 2.9, 1.05, { fontSize: 10.5 });
}

// 6. Run first: heap & huffman
{
  const s = content("▶", "先跑一遍 · heap_huffman/demo.cpp", "最小堆依次取最小元；权 2、3、4、7 的 Huffman 树");
  codeBlock(s, `#include "teaching.hpp"

#include <iostream>

int main() {
    MinHeap<int> heap;
    for (int value : {5, 1, 4, 2}) {
        heap.insert(value);
    }
    std::cout << "依次取出最小元:";
    while (auto value = heap.remove_min()) {   // 空堆返回 nullopt，循环自然结束
        std::cout << ' ' << *value;
    }
    std::cout << '\\n';

    const int weights[] = {2, 3, 4, 7};
    const HuffmanTree tree(weights, 4);
    std::cout << "权 2,3,4,7 的 Huffman 树根权 = " << tree.total_weight() << '\\n';
    std::cout << "带权路径长度 WPL = " << tree.weighted_path_length() << '\\n';
}`, 0.5, 1.05, 6.05, 4.05, { fontSize: 8.5 });
  consoleBlock(s, "依次取出最小元: 1 2 4 5\n权 2,3,4,7 的 Huffman 树根权 = 16\n带权路径长度 WPL = 30", 6.75, 1.05, 2.75, 1.2, 8.5);
  callout(s, "看到了什么", [
    "堆每次吐出**当前最小**的那个：1 2 4 5。",
    "空堆 `remove_min()` 返回 `nullopt`，`while` 自然结束。",
    "Huffman 根权 = 全部权之和 16；WPL = 30 是**最小**的带权路径长度。",
  ], 6.75, 2.45, 2.75, 2.65, { fontSize: 10.5 });
}

// ============================ PART 1 ============================
sectionSlide("Part 1 · 5.1", "二叉树的概念", "递归定义 · 左右有别 · 五种基本形态\n满二叉树 · 完全二叉树 · 扩充二叉树 · 三条性质");

// 5.1 definition + five forms
{
  const s = content("5.1", "5.1.1 二叉树的定义和基本术语", "递归定义：或者为空，或者是「根 + 左子树 + 右子树」");
  bullets(s, [
    "二叉树由结点的有限集合构成：或者为**空集**，或者由一个**根**及两棵互不相交的**左子树**、**右子树**组成。",
    "左右子树**本身也是二叉树**——这是一个**递归定义**，决定了本章几乎所有算法的形状。",
    "**子树有左、右之分，次序不能颠倒。**",
  ], 0.5, 1.05, 5.6, 1.95, { fontSize: 12.5, gap: 8 });
  callout(s, "(c) 和 (d) 是两棵不同的二叉树", "同样是一个根加一个孩子，挂左边和挂右边不能混为一谈。第 6 章的一般树没有这个区分——所以二叉树**不是**「度为 2 的树」。", 6.35, 1.05, 3.15, 1.95, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  card(s, 0.5, 3.15, 9.0, 1.95, C.code);
  image(s, "fig-5-1", 0.7, 3.25, 8.6, 1.55);
  text(s, "图 5.1　二叉树的 5 种基本形态：(a) 空树 (b) 只有根 (c) 右子树为空 (d) 左子树为空 (e) 左右均非空", 0.5, 4.8, 9.0, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
}

// 5.1 terminology
{
  const s = content("5.1", "5.1.1 二叉树的定义和基本术语", "基本术语");
  table(s, [
    ["术语", "含义"],
    [{ t: "根 / 父结点", bold: true }, "根是唯一没有父结点的结点；其余结点**恰有一个**父结点（双亲）"],
    [{ t: "左 / 右孩子、兄弟", bold: true }, "每个结点至多两个孩子；同一父结点的孩子互为兄弟"],
    [{ t: "度", bold: true }, "结点的子树数目：0、1 或 2"],
    [{ t: "叶 / 内部结点", bold: true }, "度为 0 的是叶（终端结点）；其余是内部结点（分支结点）"],
    [{ t: "边 / 路径 / 路径长度", bold: true }, "父到子的有向连线 ⟨k, k'⟩；首尾相接的边构成路径；长度 = 边数"],
    [{ t: "祖先 / 子孙", bold: true }, "k 到 kₛ 有路径，则 k 是 kₛ 的祖先，kₛ 是 k 的子孙"],
    [{ t: "层数", bold: true }, "根到该结点的路径长度：**根在第 0 层**，孩子 = 父 + 1"],
  ], 0.5, 1.05, 5.9, [1.75, 4.15], { fontSize: 10.5, rowH: 0.47 });
  card(s, 6.65, 1.05, 2.85, 4.05, C.code);
  text(s, "本章示例程序那棵树", 6.8, 1.12, 2.6, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  drawTree(s, { A: ["A", 7.75, 1.75], B: ["B", 7.2, 2.35], C: ["C", 8.3, 2.35, C.cream], D: ["D", 6.9, 2.95, C.cream], E: ["E", 7.5, 2.95, C.cream] },
    [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"]]);
  ["第 0 层", "第 1 层", "第 2 层"].forEach((l, i) => text(s, l, 8.65, 1.63 + i * 0.6, 0.8, 0.25, { fontSize: 8.5, color: C.muted, margin: 0 }));
  bullets(s, [
    "A 是根；B 的度为 2。",
    "D、E、C 是叶（浅黄），A、B 是内部结点。",
    "A → B → E 的路径长度为 2，E 在第 2 层。",
    "D、E 互为兄弟；A 是 E 的祖先。",
  ], 6.75, 3.3, 2.7, 1.75, { fontSize: 10, gap: 4 });
}

// 5.1.2 full & complete
{
  const s = content("5.1", "5.1.2 满二叉树、完全二叉树", "满二叉树与完全二叉树：互不包含");
  card(s, 0.5, 1.02, 5.35, 1.98, C.code);
  image(s, "fig-5-2", 0.6, 1.07, 5.15, 1.62);
  text(s, "图 5.2　(a) 满二叉树；(b) 完全二叉树", 0.5, 2.7, 5.35, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  callout(s, "对照图 5.2", [
    "(a) **满但不完全**：C 没有孩子，第 2 层缺两个位置，下面却还有第 3 层。",
    "(b) **完全但不满**：F 只有一个孩子。",
    "只有**每层都排满**的二叉树（perfect）才既满又完全。",
  ], 6.05, 1.02, 3.45, 1.98, { fontSize: 10.5, gap: 4 });
  card(s, 0.5, 3.15, 4.35, 1.95, C.cream);
  text(s, "满二叉树 full", 0.7, 3.23, 4, 0.3, { fontSize: 13, bold: true, color: C.goldText, margin: 0 });
  bullets(s, [
    "任何结点**或者是叶，或者左右子树都非空**：只要求**没有度为 1 的结点**。",
    "不要求叶在同一层，结点数也不固定：图 (a) 的叶 C 在第 1 层、D 在第 2 层、F、G 在第 3 层。",
    "口径：有些教材的「满」指**每层都排满**（perfect，深度 k 时 2^(k+1) − 1 个结点），它是本书满二叉树的特例。",
  ], 0.65, 3.58, 4.1, 1.5, { fontSize: 11, gap: 4 });
  card(s, 5.15, 3.15, 4.35, 1.95, C.mint);
  text(s, "完全二叉树 complete", 5.35, 3.23, 4, 0.3, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "不要求每个内部结点都有两个孩子，但叶只出现在**最下两层**。",
    "最下层的结点从左到右**连续**排列、没有空洞。",
    "堆正是利用这一条**按层编号存进数组**（编号关系见 5.1.3）。",
  ], 5.3, 3.58, 4.1, 1.5, { fontSize: 11, gap: 6 });
}

// 5.1.2 extended
{
  const s = content("5.1", "5.1.2 扩充二叉树", "扩充二叉树：把每个空子树补成「外部叶」");
  card(s, 0.5, 1.05, 4.6, 2.75, C.code);
  image(s, "fig-5-3", 0.65, 1.12, 4.3, 2.35);
  text(s, "图 5.3　方框是外部叶，圆圈是内部结点", 0.5, 3.47, 4.6, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "原树 n 个内部结点 → 扩充后有 **n + 1** 个外部叶。",
    "补完后每个内部结点都恰有两个孩子 → 扩充二叉树**一定是满二叉树**。",
    "它是 5.6 节 Huffman 树算带权外部路径长度的形状。",
  ], 0.5, 3.9, 4.6, 1.2, { fontSize: 11, gap: 4 });
  card(s, 5.35, 1.05, 4.15, 1.3, C.dark);
  text(s, "内部路径长度 I 与外部路径长度 E", 5.55, 1.13, 3.8, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "E = I + 2n", 5.55, 1.45, 3.8, 0.55, { fontSize: 26, bold: true, color: C.white, margin: 0, fontFace: MONO });
  text(s, "I：根到所有内部结点的边数之和；E：根到所有外部叶的边数之和", 5.55, 1.98, 3.85, 0.35, { fontSize: 9, color: C.mint, margin: 0 });
  // worked example on the A-E tree
  card(s, 5.35, 2.5, 4.15, 2.6, C.cream);
  text(s, "验算：示例树 A(B(D, E), C)，n = 5", 5.5, 2.57, 3.9, 0.3, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
  drawTree(s, { A: ["A", 6.35, 3.1], B: ["B", 5.95, 3.6], C: ["C", 6.75, 3.6], D: ["D", 5.7, 4.1], E: ["E", 6.2, 4.1] },
    [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"]], { r: 0.15, fs: 9.5 });
  bullets(s, [
    "I = 0 + 1 + 1 + 2 + 2 = **6**",
    "外部叶 6 个：D、E 下各 2 个在第 3 层，C 下 2 个在第 2 层",
    "E = 4×3 + 2×2 = **16** = 6 + 2×5 ✓",
  ], 7.0, 2.95, 2.45, 2.1, { fontSize: 9.5, gap: 4 });
}

// 5.1.3 properties overview
{
  const s = content("5.1", "5.1.3 二叉树的主要性质", "性质 1、2 与按层编号：堆全靠这一条");
  const props = [
    ["性质 1", "第 i 层至多 2^i 个结点（根在第 0 层）"],
    ["性质 2", "深度为 k 的二叉树至多 2^(k+1) − 1 个结点"],
    ["编号", "按层从 0 编号：结点 i 的父是 ⌊(i−1)/2⌋，左右孩子是 2i+1 与 2i+2"],
    ["高度", "n 个结点的完全二叉树高度为 ⌈log₂(n+1)⌉"],
  ];
  props.forEach((p, i) => {
    const y = 1.1 + i * 0.95;
    card(s, 0.5, y, 5.4, 0.82, C.code);
    pill(s, p[0], 0.65, y + 0.22, 0.95, 0.38, i === 2 ? C.goldText : C.green, C.white, 11);
    text(s, p[1], 1.75, y, 4.05, 0.82, { fontSize: 12, valign: "middle", margin: 0 });
  });
  text(s, "这些性质原书没错，原样保留。", 0.5, 4.95, 5.4, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
  card(s, 6.15, 1.1, 3.35, 3.95, C.cream);
  text(s, "例：i = 1", 6.3, 1.18, 3, 0.3, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  drawTree(s, {
    0: [0, 7.85, 1.8, HL], 1: [1, 7.05, 2.45, C.bad, C.white], 2: [2, 8.65, 2.45],
    3: [3, 6.6, 3.1, HL], 4: [4, 7.5, 3.1, HL], 5: [5, 8.2, 3.1], 6: [6, 9.1, 3.1],
  }, [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]]);
  bullets(s, [
    "父：⌊(1−1)/2⌋ = **0**",
    "左孩子：2·1+1 = **3**",
    "右孩子：2·1+2 = **4**",
    "一个指针都不用存。",
  ], 6.3, 3.5, 3.1, 1.5, { fontSize: 11, gap: 3 });
}

// properties 3-5
{
  const s = content("5.1", "5.1.3 二叉树的主要性质", "性质 3–5：后面反复要用，都要会证");
  const cols = [
    ["性质 3", "n₀ = n₂ + 1", "非空二叉树的叶结点数 = 度为 2 的结点数 + 1。", [
      "按度数分类：n = n₀ + n₁ + n₂",
      "数边：除根外每个结点恰有一条边进入，e = n − 1",
      "边都从度 1 或 2 的结点射出：e = n₁ + 2n₂",
      "合并得 n₀ = n₂ + 1 ∎",
    ]],
    ["性质 4", "满二叉树定理", "非空满二叉树的树叶数 = 分支结点数 + 1。", [
      "满二叉树里每个结点度非 0 即 2：n₁ = 0",
      "分支结点就是 n₂",
      "由性质 3 直接得 n₀ = n₂ + 1 ∎",
    ]],
    ["性质 5", "推论", "非空二叉树的空子树数目 = 结点数 + 1。", [
      "把所有空子树换成树叶，得扩充树 T′",
      "T′ 是满二叉树，T 的每个结点都成了分支结点",
      "由性质 4：T′ 的叶数 = T 的结点数 + 1",
      "每片新叶恰对应一棵空子树 ∎",
    ]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.05, 2.85, 4.05, C.code);
    pill(s, c[0], x + 0.15, 1.15, 0.9, 0.34, C.dark, C.gold, 11);
    text(s, c[1], x + 1.15, 1.15, 1.65, 0.34, { fontSize: 12.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, c[2], x + 0.15, 1.6, 2.55, 0.65, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
    bullets(s, c[3], x + 0.1, 2.35, 2.65, 2.7, { fontSize: 10.5, gap: 5 });
  });
}

// null pointers & threaded tree
{
  const s = content("5.1", "5.1.3 性质 5 的后果", "n 个结点的二叉链表里有 n + 1 个空指针");
  bullets(s, [
    "性质 5 不是纸面游戏：链式存储时，**n + 1 个空指针**占的空间和结点本身同阶。",
    "线索二叉树、Trie 的压缩、第 12 章 PATRICIA 的动机都从这里来。",
    "**线索二叉树**（threaded binary tree）：复用空指针保存周游的前驱或后继；结点里另加一位标志，区分「孩子」还是「线索」。",
    "有了中序线索，中序遍历**不用栈也不用递归**。",
  ], 0.5, 1.05, 5.3, 2.75, { fontSize: 12, gap: 8 });
  callout(s, "现代的看法", "线索化适合教学和需要低额外空间遍历的专门场景；通用库通常直接用**显式栈、父指针或迭代器**，不应把线索化当作默认的树表示。原书把它放在习题（第 22 题）。", 0.5, 3.85, 5.3, 1.25, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  card(s, 6.05, 1.05, 3.45, 4.05, C.code);
  image(s, "fig-5-23", 6.2, 1.15, 3.15, 3.35);
  text(s, "图 5.23　中序穿线二叉树：虚线是借空指针存下的中序前驱 / 后继", 6.15, 4.5, 3.25, 0.55, { fontSize: 9, color: C.muted, align: "center" });
}

// ============================ PART 2 ============================
sectionSlide("Part 2 · 5.2", "二叉树的周游", "周游 = 把树线性化\n深度优先（栈 / 递归）· 表达式树 · 由序列重建 · 广度优先（队列）");

// 5.2.1 ADT
{
  const s = content("5.2", "5.2.1 二叉树的抽象数据类型", "ADT：建树、判空、取根与子树、四种周游");
  table(s, [
    ["运算", "教学版接口", "含义"],
    ["建树", { t: "create_tree(v, l, r)", mono: true }, "以 v 为根接上两棵子树（接管所有权）"],
    ["建叶", { t: "create_leaf(v)", mono: true }, "只有一个根结点的树"],
    ["判空", { t: "empty()", mono: true }, "树里有没有结点"],
    ["取根", { t: "root()", mono: true }, "返回根结点；由此取左右子树"],
    ["深度优先周游", { t: "preorder / inorder / postorder", mono: true }, "前序 / 中序 / 后序"],
    ["广度优先周游", { t: "level_order", mono: true }, "层次周游"],
    ["规模", { t: "size() / height()", mono: true }, "结点数、高度"],
  ], 0.5, 1.05, 5.9, [1.3, 2.35, 2.25], { fontSize: 10, rowH: 0.44 });
  callout(s, "周游 traversal", P("按一定顺序访问树中所有结点，**每个结点恰好访问一次**。「访问」是操作：输出、修改结点信息……\n周游一棵二叉树，实际上就是**把结点放入一个线性序列**——对二叉树进行线性化。"), 6.65, 1.05, 2.85, 2.55, { fontSize: 10.5 });
  callout(s, "与存储无关", "ADT 不规定存储方式（5.3 再谈）。原书把树类声明为结点类的**友元**；本书把结点当内部细节，只暴露访问器，不需要友元。", 6.65, 3.72, 2.85, 1.38, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
}

// 5.2.2 tLR
{
  const s = content("5.2", "5.2.2 深度优先周游二叉树", "三件事的六种排列，约定先左后右，只剩三种");
  card(s, 0.5, 1.05, 2.6, 2.3, C.code);
  image(s, "fig-5-4", 0.9, 1.15, 1.8, 1.75);
  text(s, "图 5.4　t：访问根；L / R：周游左 / 右子树", 0.55, 2.9, 2.5, 0.42, { fontSize: 9, color: C.muted, align: "center" });
  table(s, [
    ["次序", "名字", "递归定义"],
    [{ t: "tLR", mono: true, bold: true }, "前序 preorder", "访问根 → 前序周游左子树 → 前序周游右子树"],
    [{ t: "LtR", mono: true, bold: true }, "中序 inorder", "中序周游左子树 → 访问根 → 中序周游右子树"],
    [{ t: "LRt", mono: true, bold: true }, "后序 postorder", "后序周游左子树 → 后序周游右子树 → 访问根"],
  ], 3.35, 1.05, 6.15, [0.7, 1.45, 4.0], { fontSize: 11, rowH: 0.55 });
  callout(s, "深度优先的思路：尽量往深处走", P("沿左链一路下降；左子树为空就**退回最近的、右子树尚未访问的**分支结点，转向它的右孩子，再继续尽量往左。重复到没有结点可退为止，每个结点恰好访问一次。\n「退回最近的」——这正是**栈**的行为；写成递归时，这把栈就是运行栈。"), 0.5, 3.55, 9.0, 1.55, { fontSize: 11.5 });
}

// fig 5.5 sequences
{
  const s = content("5.2", "5.2.2 深度优先周游二叉树", "对图 5.5：三种周游，三个序列");
  card(s, 0.5, 1.05, 3.2, 2.75, C.code);
  image(s, "fig-5-5", 0.65, 1.15, 2.9, 2.3);
  text(s, "图 5.5　9 个结点，差别才看得出来", 0.5, 3.47, 3.2, 0.28, { fontSize: 9, color: C.muted, align: "center" });
  table(s, [
    ["周游", "序列"],
    ["前序 tLR", { t: "A B D E G C F H I", mono: true, bold: true }],
    ["中序 LtR", { t: "D B G E A C H F I", mono: true, bold: true }],
    ["后序 LRt", { t: "D G E B H I F C A", mono: true, bold: true }],
  ], 3.95, 1.05, 5.55, [1.5, 4.05], { fontSize: 12.5, rowH: 0.5 });
  text(s, "线性化之后，「前驱」「后继」这类线性结构的说法对树才有了意义——以结点 E 为例：", 3.95, 3.2, 5.55, 0.6, { fontSize: 11 });
  table(s, [
    ["", "前序", "中序", "后序"],
    [{ t: "E 的前驱", bold: true }, { t: "D", align: "center" }, { t: "G", align: "center" }, { t: "G", align: "center" }],
    [{ t: "E 的后继", bold: true }, { t: "G", align: "center" }, { t: "A", align: "center" }, { t: "B", align: "center" }],
  ], 0.5, 3.95, 5.0, [1.4, 1.2, 1.2, 1.2], { fontSize: 12, rowH: 0.36 });
  callout(s, "一句话", "同一个结点，换一种次序就换一批邻居——这正是「周游次序」本身的意义。", 5.75, 3.95, 3.75, 1.15, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// three recursive impls
{
  const s = content("5.2", "5.2.2 深度优先周游 · 教学版【算法5.3】", "三个递归函数只差 visit 那一行的位置");
  const pre = `template <typename Visitor>
static void preorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    visit(node->value);                 // 根
    preorder_impl(node->left, visit);   // 左
    preorder_impl(node->right, visit);  // 右
}`;
  const ino = `template <typename Visitor>
static void inorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    inorder_impl(node->left, visit);    // 左
    visit(node->value);                 // 根
    inorder_impl(node->right, visit);   // 右
}`;
  const post = `template <typename Visitor>
static void postorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    postorder_impl(node->left, visit);  // 左
    postorder_impl(node->right, visit); // 右
    visit(node->value);                 // 根
}`;
  codeBlock(s, pre, 0.5, 1.02, 5.75, 1.3, { fontSize: 8.5, hl: [4] });
  codeBlock(s, ino, 0.5, 2.4, 5.75, 1.3, { fontSize: 8.5, hl: [5] });
  codeBlock(s, post, 0.5, 3.78, 5.75, 1.3, { fontSize: 8.5, hl: [6] });
  callout(s, "访问 ≠ 走进去", "`visit(node->value)` 是**访问**；`preorder_impl(node->left, visit)` 是**走进去**。报错的序列多半来自把这两件事混为一谈。", 6.5, 1.02, 3.0, 1.75, { fontSize: 10.5 });
  callout(s, "代价", [
    "每个结点进出各一次：时间 **O(n)**。",
    "空间 = 递归深度 = **树高**：平衡时约 log₂n，退化成链时是 n。",
    "工程版另给了三个显式栈的迭代版（5.6a），只作补充。",
  ], 6.5, 2.9, 3.0, 2.18, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// expression tree
{
  const s = content("5.2", "5.2.2 表达式树：周游的一个用途", "A + B × (C + D)：三种周游 = 三种表达式写法");
  card(s, 0.5, 1.05, 3.0, 2.85, C.code);
  image(s, "fig-5-6", 0.65, 1.15, 2.7, 2.35);
  text(s, "图 5.6　运算符在内部结点，运算对象在叶", 0.5, 3.52, 3.0, 0.35, { fontSize: 9, color: C.muted, align: "center" });
  table(s, [
    ["周游", "得到", "本例"],
    ["前序", "**前缀**表达式（波兰式）", { t: "+ A × B + C D", mono: true, bold: true }],
    ["中序", "中缀表达式（**缺括号**）", { t: "A + B × C + D", mono: true, bold: true, color: C.bad }],
    ["后序", "**后缀**表达式（逆波兰式）", { t: "A B C D + × +", mono: true, bold: true }],
  ], 3.75, 1.05, 5.75, [0.8, 2.55, 2.4], { fontSize: 11, rowH: 0.5 });
  callout(s, "中序那一行多看一眼", "它长得像原式，但**括号丢了**：照它算的是 A + B × C + D。要印回可读的中缀式，必须在周游时按优先级补括号。前缀、后缀式不需要括号——运算符的位置本身就定死了次序。", 3.75, 3.2, 5.75, 1.25, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  text(s, "第 3 章的后缀求值器吃的正是这棵树的后序序列；「中缀转后缀」= 建出这棵树，再后序周游一遍。", 0.5, 4.55, 9.0, 0.55, { fontSize: 11, bold: true, color: C.goldText });
}

// rebuild: principle
{
  const s = content("5.2", "5.2.2 由周游序列重建二叉树", "前序（或后序）+ 中序 → 唯一一棵树（关键码互不相同）");
  bullets(s, [
    "**一个序列不行**：前序 `A B C` 既可以是一条左链，也可以是一条右链。",
    "后序的**最后一个**（前序的**第一个**）一定是根；在中序里找到根的位置 k，左边是左子树，右边是右子树。",
    "左子树的结点个数一旦知道，后序（前序）里的两段也就切开了；对两段递推，直到区间为空。",
  ], 0.5, 1.02, 9.0, 1.3, { fontSize: 12, gap: 5 });
  const post = ["D", "G", "E", "B", "H", "I", "F", "C", "A"];
  const ino = ["D", "B", "G", "E", "A", "C", "H", "F", "I"];
  const L = "D9EAF7", R = "E8F4EC";
  text(s, "后序", 0.5, 2.45, 0.8, 0.42, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 1.3, 2.45, post, { cw: 0.5, fills: [L, L, L, L, R, R, R, R, HL] });
  text(s, "中序", 0.5, 3.15, 0.8, 0.42, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 1.3, 3.15, ino, { cw: 0.5, fills: [L, L, L, L, HL, R, R, R, R] });
  text(s, "左子树 4 个", 1.3, 3.65, 2.0, 0.25, { fontSize: 9.5, bold: true, color: "2D6A9F", align: "center", margin: 0 });
  text(s, "根", 3.3, 3.65, 0.5, 0.25, { fontSize: 9.5, bold: true, color: C.goldText, align: "center", margin: 0 });
  text(s, "右子树 4 个", 3.8, 3.65, 2.0, 0.25, { fontSize: 9.5, bold: true, color: C.ok, align: "center", margin: 0 });
  text(s, "后序末元素 A 是根 → 中序里 A 左边 4 个 → 后序前 4 个 `D G E B` 是左子树的后序，接下来的 `H I F C` 是右子树的后序。", 0.5, 3.95, 5.7, 0.6, { fontSize: 10.5 });
  callout(s, "前提：关键码互不相同", "否则在中序里找不到根的**唯一**位置。重复键工程版单独报出，好让报错说对原因。", 0.5, 4.5, 5.7, 0.62, { fontSize: 10, tsize: 10.5, fill: C.mint, tcolor: C.dark, lsm: 1.05 });
  callout(s, "前序 + 后序不够", "前序 `A B`、后序 `B A`：说不清 B 是左孩子还是右孩子。（习题：给出最小反例。）", 6.4, 2.45, 3.1, 2.67, { fontSize: 11, fill: RED, tcolor: C.bad });
}

// rebuild trace
{
  const s = content("5.2", "5.2.2 由周游序列重建二叉树", "逐帧推演：后序 DGEBHIFCA + 中序 DBGEACHFI");
  table(s, [
    ["子问题", "后序段", "中序段", "根", "左子树中序", "右子树中序"],
    ["整棵树", { t: "DGEBHIFCA", mono: true }, { t: "DBGEACHFI", mono: true }, { t: "A", bold: true, color: C.bad }, { t: "DBGE", mono: true }, { t: "CHFI", mono: true }],
    ["A 的左", { t: "DGEB", mono: true }, { t: "DBGE", mono: true }, { t: "B", bold: true, color: C.bad }, { t: "D", mono: true }, { t: "GE", mono: true }],
    ["B 的左", { t: "D", mono: true }, { t: "D", mono: true }, { t: "D", bold: true, color: C.bad }, "空", "空"],
    ["B 的右", { t: "GE", mono: true }, { t: "GE", mono: true }, { t: "E", bold: true, color: C.bad }, { t: "G", mono: true }, "空"],
    ["E 的左", { t: "G", mono: true }, { t: "G", mono: true }, { t: "G", bold: true, color: C.bad }, "空", "空"],
    ["A 的右", { t: "HIFC", mono: true }, { t: "CHFI", mono: true }, { t: "C", bold: true, color: C.bad }, "空", { t: "HFI", mono: true }],
    ["C 的右", { t: "HIF", mono: true }, { t: "HFI", mono: true }, { t: "F", bold: true, color: C.bad }, { t: "H", mono: true }, { t: "I", mono: true }],
    ["F 的左 / 右", { t: "H / I", mono: true }, { t: "H / I", mono: true }, { t: "H, I", bold: true, color: C.bad }, "空", "空"],
  ], 0.5, 1.05, 6.1, [1.05, 1.2, 1.2, 0.6, 1.05, 1.0], { fontSize: 10, rowH: 0.36 });
  text(s, "每一帧：取后序段**末元素**为根 → 在中序段里定位 → 按左子树大小切开后序段。", 0.5, 4.4, 6.1, 0.65, { fontSize: 11 });
  card(s, 6.85, 1.05, 2.65, 4.05, C.code);
  text(s, "重建结果 = 图 5.5", 7.0, 1.12, 2.4, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  drawTree(s, {
    A: ["A", 8.1, 1.75], B: ["B", 7.5, 2.4], C: ["C", 8.7, 2.4], D: ["D", 7.15, 3.05], E: ["E", 7.85, 3.05],
    G: ["G", 7.55, 3.7], F: ["F", 9.05, 3.05], H: ["H", 8.75, 3.7], I: ["I", 9.3, 3.7],
  }, [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["E", "G"], ["C", "F"], ["F", "H"], ["F", "I"]]);
  text(s, "再取一遍前序：A B D E G C F H I ✓", 7.0, 4.2, 2.4, 0.7, { fontSize: 10, color: C.ok, bold: true, margin: 0 });
}

// rebuild pitfalls + factories
{
  const s = content("5.2", "5.2.2 由周游序列重建 · 工程版 modern.hpp", "两处常见的坑；工程版做成两个静态工厂");
  codeBlock(s, `/// 由中序 + 后序序列重建二叉树（两个序列各 count 个元素，关键码互不相同）。
///
/// 不自洽的输入一律抛 std::invalid_argument，绝不默默建出一棵错树：
/// 中序里有重复键、后序里出现中序没有的键、某个根落在当前中序区间之外。
/// 能建完就说明两个序列恰好是这棵树的中序与后序（归纳即得），不必再周游核对。
/// 要求 T 支持 operator<（用来排序查位置）。时间 O(n log n)，额外空间 O(n)。
static BinaryTree from_inorder_postorder(const T* inorder, const T* postorder, std::size_t count) {
    return rebuild(inorder, postorder, count, Order::postorder);
}
/// 由前序 + 中序序列重建（本章上机题第 1 题）。契约同上。
static BinaryTree from_preorder_inorder(const T* preorder, const T* inorder, std::size_t count) {
    return rebuild(inorder, preorder, count, Order::preorder);
}`, 0.5, 1.02, 9.0, 2.05, { fontSize: 8 });
  card(s, 0.5, 3.2, 4.35, 1.9, C.code);
  numCircle(s, 1, 0.65, 3.3, 0.36, C.goldText);
  text(s, "每层拷贝子数组 → O(n²)", 1.1, 3.3, 3.6, 0.36, { fontSize: 12.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
  text(s, "只传**下标区间**、在中序里**查位置**就不必拷贝。工程版把中序下标按键排序后二分查位置，总代价 O(n log n)。", 0.7, 3.75, 4.0, 1.3, { fontSize: 10.5, lsm: 1.15 });
  card(s, 5.15, 3.2, 4.35, 1.9, RED);
  numCircle(s, 2, 5.3, 3.3, 0.36, C.bad);
  text(s, "输入不自洽时默默建出一棵树", 5.75, 3.3, 3.7, 0.36, { fontSize: 12.5, bold: true, color: C.bad, valign: "middle", margin: 0 });
  text(s, "中序 `1 2 3`、后序 `3 1 2`：根是 2，左子树只该有 1，后序对应的却是 3。检查只要一条——**每次取出的根必须落在当前中序区间里**。", 5.35, 3.75, 4.05, 1.3, { fontSize: 10.5, lsm: 1.15 });
}

// rebuild impl p1
{
  const s = content("5.2", "5.2.2 由周游序列重建 · rebuild（上）", "不递归：位置查找表 + 重复键检查");
  codeBlock(s, `/// 两种重建共用的主体。不递归：待建的子树用手写链式栈保存为「区间帧」，
/// 退化成链的输入也不会压穿调用栈。每一帧只记下标，不复制子数组。
static BinaryTree rebuild(const T* inorder, const T* other, std::size_t count, Order order) {
    BinaryTree result;
    if (count == 0) return result;
    if (inorder == nullptr || other == nullptr) {
        throw std::invalid_argument("rebuild: non-empty sequence given as null pointer");
    }
    // 位置查找表：中序下标按键排序，之后二分查位置。排好序顺便查出重复键。
    // D-001 §2 的边界：std::sort / std::lower_bound 只用在这张「键 → 中序下标」的查找表上，
    // 树结点、区间帧栈（LinkedStack）和挂接过程仍全部手写——没有拿 STL 容器替代本章要教的结构。
    std::unique_ptr<std::size_t[]> by_key(new std::size_t[count]);
    for (std::size_t i = 0; i < count; ++i) by_key[i] = i;
    const auto key_less = [inorder](std::size_t a, std::size_t b) { return inorder[a] < inorder[b]; };
    std::sort(by_key.get(), by_key.get() + count, key_less);
    for (std::size_t i = 1; i < count; ++i) {
        if (!(inorder[by_key[i - 1]] < inorder[by_key[i]])) {
            throw std::invalid_argument("rebuild: duplicate key in inorder sequence");
        }
    }
    const auto position_in_inorder = [&](const T& key) {
        const std::size_t* hit = std::lower_bound(by_key.get(), by_key.get() + count, key,
            [inorder](std::size_t index, const T& k) { return inorder[index] < k; });
        if (hit == by_key.get() + count || key < inorder[*hit]) {
            throw std::invalid_argument("rebuild: key missing from inorder sequence");
        }
        return *hit;
    };
    // ...`, 0.5, 1.02, 9.0, 4.08, { fontSize: 8 });
}

// rebuild impl p2
{
  const s = content("5.2", "5.2.2 由周游序列重建 · rebuild（下）", "区间帧压进手写链式栈，逐帧挂接");
  codeBlock(s, `    // 一帧 = 「把中序 [in_begin, in_end) 与另一序列 [other_begin, …) 建成子树，挂到 *link」。
    struct Frame { Node** link; std::size_t in_begin, in_end, other_begin; };
    LinkedStack<Frame> pending;
    pending.push(Frame{&result.root_, 0, count, 0});
    while (auto frame = pending.pop()) {
        const std::size_t size = frame->in_end - frame->in_begin;
        if (size == 0) continue;                         // 空子树：*link 已是 nullptr
        // 前序的根在区间最前，后序的根在区间最后。
        const std::size_t root_at = order == Order::preorder ? frame->other_begin
                                                             : frame->other_begin + size - 1;
        const std::size_t k = position_in_inorder(other[root_at]);
        if (k < frame->in_begin || k >= frame->in_end) {
            throw std::invalid_argument("rebuild: root lies outside its inorder range");
        }
        Node* const node = new Node(other[root_at]);
        *frame->link = node;                             // 先挂上：再抛异常时由 result 统一释放
        const std::size_t left_size = k - frame->in_begin;
        // 左子树在另一序列里紧跟根（前序）或从区间头开始（后序），右子树接在左子树后面。
        const std::size_t left_other = order == Order::preorder ? frame->other_begin + 1
                                                                : frame->other_begin;
        pending.push(Frame{&node->right, k + 1, frame->in_end, left_other + left_size});
        pending.push(Frame{&node->left, frame->in_begin, k, left_other});
    }
    return result;
}`, 0.5, 1.02, 9.0, 3.4, { fontSize: 7.9, hl: [12, 13] });
  callout(s, "为什么「能建完就一定对」", "对区间长度归纳：根取自区间末端（后序）或首端（前序），左右两段恰好分走剩下的元素；两段各自一致，拼上根整棵树也一致。测试用 400 棵随机树往返核对。", 0.5, 4.5, 5.6, 0.65, { fontSize: 9, tsize: 10, lsm: 1.0 });
  callout(s, "为什么不递归", "递归深度 = 树高；显式栈在堆上，20 万结点的纯左链照样重建。", 6.3, 4.5, 3.2, 0.65, { fontSize: 9, tsize: 10, fill: C.mint, tcolor: C.dark, lsm: 1.0 });
}

// 5.2.3 level order principle + trace
{
  const s = content("5.2", "5.2.3 广度优先周游二叉树", "层次周游：一层一层，从左到右——靠队列");
  codeBlock(s, `把根入队
只要队列非空:
    出队一个结点, 访问它
    它的左孩子入队
    它的右孩子入队`, 0.5, 1.02, 4.1, 1.35, { fontSize: 10.5, lang: "text" });
  text(s, "上层结点总比下层先入队，队列又先进先出 → 出队次序自然逐层从左到右。", 0.5, 2.45, 4.1, 0.6, { fontSize: 11 });
  callout(s, "为什么不能写成递归？", "递归天生是深度优先的：一层调用只能带着「当前子树」往下走。层次周游要在**兄弟子树之间横向跳**——第 2 层的最后一个和第 3 层的第一个常分属不同子树。这个跨子树的次序只能由**显式队列**记住。", 0.5, 3.1, 4.1, 2.0, { fontSize: 10.5 });
  table(s, [
    ["步", "出队并访问", "入队", "队列（头 → 尾）"],
    ["1", { t: "A", bold: true }, "B C", { t: "B C", mono: true }],
    ["2", { t: "B", bold: true }, "D E", { t: "C D E", mono: true }],
    ["3", { t: "C", bold: true }, "F", { t: "D E F", mono: true }],
    ["4", { t: "D", bold: true }, "—", { t: "E F", mono: true }],
    ["5", { t: "E", bold: true }, "G", { t: "F G", mono: true }],
    ["6", { t: "F", bold: true }, "H I", { t: "G H I", mono: true }],
    ["7", { t: "G", bold: true }, "—", { t: "H I", mono: true }],
    ["8", { t: "H", bold: true }, "—", { t: "I", mono: true }],
    ["9", { t: "I", bold: true }, "—", "（空）"],
  ], 4.85, 1.02, 4.65, [0.5, 1.3, 1.1, 1.75], { fontSize: 10, rowH: 0.31, align: "center" });
  card(s, 4.85, 4.3, 4.65, 0.8, C.dark);
  text(s, "图 5.5 的层次序列：A B C D E F G H I", 5.0, 4.3, 4.4, 0.8, { fontSize: 13, bold: true, color: C.gold, valign: "middle", margin: 0 });
}

// level_order code p1
{
  const s = content("5.2", "5.2.3 层次周游 · 教学版【算法5.7】（上）", "现写一条极简的链式 FIFO，而不是 std::queue");
  codeBlock(s, `// 【算法5.7】层次周游：一层一层从左到右。
// 深度优先靠栈（这里是递归用的运行栈），广度优先靠队列。
template <typename Visitor>
void level_order(Visitor visit) const {
    // 一条极简的链式队列，只在这个函数里用
    struct Pending {
        const Node* node;
        Pending* next;
    };
    Pending* front = nullptr;
    Pending* rear = nullptr;

    if (root_ != nullptr) {
        front = rear = new Pending{root_, nullptr};
    }
    while (front != nullptr) {
        Pending* item = front;               // 出队
        front = front->next;
        if (front == nullptr) {
            rear = nullptr;
        }
        const Node* node = item->node;
        delete item;
        // ...`, 0.5, 1.02, 5.8, 4.08, { fontSize: 9 });
  callout(s, "为什么不用 std::queue", "原书【算法5.7】直接用 `std::queue`。本节要教的就是「**队列在这里起了什么作用**」，一行 `std::queue<Node*>` 会把它藏起来。队列本身第 3.2 节已经讲过，这里只是用它。", 6.55, 1.02, 2.95, 2.3, { fontSize: 10.5 });
  callout(s, "出队的边界", "队列只剩一个时出队，`front` 变空，**`rear` 也必须置空**——否则下一次入队会接到已释放的结点后面。", 6.55, 3.45, 2.95, 1.65, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// level_order code p2
{
  const s = content("5.2", "5.2.3 层次周游 · 教学版【算法5.7】（下）", "访问，然后左右孩子依次入队");
  codeBlock(s, `        visit(node->value);

        if (node->left != nullptr) {         // 左右孩子依次入队
            Pending* fresh = new Pending{node->left, nullptr};
            if (rear == nullptr) { front = rear = fresh; } else { rear->next = fresh; rear = fresh; }
        }
        if (node->right != nullptr) {
            Pending* fresh = new Pending{node->right, nullptr};
            if (rear == nullptr) { front = rear = fresh; } else { rear->next = fresh; rear = fresh; }
        }
    }
}`, 0.5, 1.02, 9.0, 2.0, { fontSize: 9 });
  text(s, "每个结点入队、出队各一次：时间同样是 O(n)。空间代价两者正好互补——", 0.5, 3.15, 9, 0.35, { fontSize: 12.5, bold: true, color: C.dark });
  card(s, 0.5, 3.6, 4.35, 1.5, C.code);
  text(s, "深度优先：∝ 树高", 0.7, 3.68, 4, 0.35, { fontSize: 14, bold: true, color: C.green, margin: 0 });
  text(s, "平衡时约 log₂n；退化成一条链（「藤」）时是 n。**树越平衡越省。**", 0.7, 4.08, 4.0, 0.95, { fontSize: 11.5 });
  card(s, 5.15, 3.6, 4.35, 1.5, C.code);
  text(s, "广度优先：∝ 最宽的一层", 5.35, 3.68, 4, 0.35, { fontSize: 14, bold: true, color: C.goldText, margin: 0 });
  text(s, "最坏是每层都排满的二叉树：队列最长时装着最下面一整层，约 (n+1)/2 个。**树越接近链越省。**", 5.35, 4.08, 4.0, 0.95, { fontSize: 11.5 });
}

// ============================ PART 3 ============================
sectionSlide("Part 3 · 5.3", "二叉树的存储结构", "二叉链表 · 三叉链表 · 完全二叉树的顺序存储\n教学版完整实现：三法则、所有权转移、后序释放");

// linked storage
{
  const s = content("5.3", "5.3 二叉树的存储结构 · 链式", "二叉链表与三叉链表");
  card(s, 0.5, 1.02, 9.0, 1.3, C.code);
  image(s, "fig-5-7", 0.7, 1.1, 8.6, 0.95);
  text(s, "图 5.7　(a) 数据域 + 左右指针 → 二叉链表（left-right 存储法）；(b) 再加 parent → 三叉链表", 0.5, 2.03, 9.0, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  card(s, 0.5, 2.45, 3.9, 2.65, C.code);
  image(s, "fig-5-8", 0.65, 2.52, 3.6, 2.2);
  text(s, "图 5.8　图 5.5 的二叉链表", 0.5, 4.75, 3.9, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "结点随机地存在内存里，关系用指针表示；孩子为空时指针为空。",
    "二叉链表找父结点得**从根重新走一趟**；三叉链表顺着 `parent` **一步就到**——多一根指针买到的就是这件事。",
    "数一数图 5.8 的空指针：9 个结点、**10 个**空链域（性质 5）。",
    "教学版 `create_tree` 先 `new` 出新根，再挪子树的根指针，最后才清空自己原来的树——`new` 抛异常时调用方的两棵子树不动。",
  ], 4.6, 2.45, 4.9, 2.65, { fontSize: 11, gap: 5 });
}

// sequential storage
{
  const s = content("5.3", "5.3 二叉树的存储结构 · 顺序", "完全二叉树：按层编号，编号 i 放在下标 i");
  card(s, 0.5, 1.02, 3.4, 2.95, C.code);
  image(s, "fig-5-9", 0.65, 1.1, 3.1, 2.5);
  text(s, "图 5.9　完全二叉树的结点编号", 0.5, 3.62, 3.4, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  text(s, "图 5.9 的顺序存储（= 层次周游的排列）", 4.15, 1.02, 5.3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  cells(s, 4.2, 1.45, ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"], { cw: 0.43, ch: 0.4, fs: 11, idx: true, fills: [null, HL, null, "CDEBD9", "CDEBD9"] });
  bullets(s, [
    "下标 i 的左右孩子：**2i + 1**、**2i + 2**；父：**⌊(i − 1)/2⌋**。",
    "例：B 在下标 1 → 孩子 D、E 在 3、4。",
    "一个指针都不用存：完全二叉树**最省空间**的存法；5.5 节的堆、8.3.2 节的堆排序都用它。",
  ], 4.15, 2.2, 5.35, 1.8, { fontSize: 11.5, gap: 5 });
  callout(s, "只对完全二叉树划算", "一般情况下「只通过位置不足以刻画整个树形结构」。树一旦有空洞，数组里就要留出同样多的空位。选存储结构时，除了树的形态，还要看时间、空间复杂度和算法的简洁性。", 0.5, 4.1, 9.0, 1.0, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// teaching T1
{
  const s = content("5.3", "5.3 教学版 binary_tree/teaching.hpp（一）", "结点、构造与三法则：拷贝必须是深拷贝");
  codeBlock(s, `template <typename T>
class BinaryTree {
public:
    // 【代码5.1】二叉树结点：一个数据域 + 左右两根链接。
    // 没有孩子就是 nullptr——这比原书用一个"空结点"表示要省事得多。
    struct Node {
        T value;
        Node* left;
        Node* right;
    };

    BinaryTree() : root_(nullptr) {}

    ~BinaryTree() { clear(); }

    // 三法则：树管着一堆 new 出来的结点，拷贝必须自己写（而且必须是深拷贝）。
    BinaryTree(const BinaryTree& other) : root_(clone(other.root_)) {}

    BinaryTree& operator=(const BinaryTree& other) {
        if (this == &other) {
            return *this;
        }
        Node* fresh = clone(other.root_);   // 先把新树建好
        clear();                            // 再拆掉旧树
        root_ = fresh;
        return *this;
    }`, 0.5, 1.02, 6.3, 4.08, { fontSize: 8.4 });
  callout(s, "唯一的数据成员", "`Node* root_`——一棵树就是「指向根的一根指针」，空树就是 `nullptr`。", 7.0, 1.02, 2.5, 1.35, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "先建后拆", P("赋值时先 `clone` 出新树，**再** `clear` 旧树。`clone` 中途抛异常时，旧树还完好无损。\n编译器生成的拷贝只抄 `root_` 这根指针 → 两棵树共享结点 → **二次释放**。"), 7.0, 2.5, 2.5, 2.6, { fontSize: 10.5 });
}

// teaching T2
{
  const s = content("5.3", "5.3 教学版 binary_tree/teaching.hpp（二）", "create_tree：两棵子树的所有权转移给新树");
  codeBlock(s, `    bool empty() const { return root_ == nullptr; }
    const Node* root() const { return root_; }
    Node* root() { return root_; }

    // 造一棵新树：一个根，接上左右两棵子树。
    // 两棵子树的所有权转移给新树——传进来的那两棵随即变空，
    // 否则同一批结点会被两棵树各删一次。
    void create_tree(const T& value, BinaryTree& left, BinaryTree& right) {
        Node* fresh = new Node{value, left.root_, right.root_};
        left.root_ = nullptr;
        right.root_ = nullptr;
        clear();
        root_ = fresh;
    }

    void create_leaf(const T& value) {
        Node* fresh = new Node{value, nullptr, nullptr};
        clear();
        root_ = fresh;
    }`, 0.5, 1.02, 6.0, 3.05, { fontSize: 8.8, hl: [10, 11] });
  callout(s, "顺序有讲究", "先 `new` 新根 → 再挪子树根指针 → 最后 `clear()` 自己原来的树。`new` 抛异常时，调用方的两棵子树**一个都不动**。", 0.5, 4.17, 6.0, 0.95, { fontSize: 10.5, tsize: 11 });
  // diagram: b.create_tree('B', d, e)
  card(s, 6.75, 1.02, 2.75, 4.1, C.code);
  text(s, "b.create_tree('B', d, e)", 6.85, 1.1, 2.6, 0.3, { fontSize: 10, bold: true, color: C.green, margin: 0, fontFace: MONO });
  pill(s, "d.root_", 6.9, 1.55, 1.1, 0.32, C.green, C.white, 9.5);
  pill(s, "e.root_", 8.25, 1.55, 1.1, 0.32, C.green, C.white, 9.5);
  text(s, "调用前：各指向一个叶", 6.85, 1.92, 2.6, 0.25, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
  drawTree(s, { B: ["B", 8.1, 2.65, HL], D: ["D", 7.6, 3.3], E: ["E", 8.6, 3.3] }, [["B", "D"], ["B", "E"]]);
  pill(s, "b.root_", 6.9, 2.5, 0.8, 0.3, C.dark, C.gold, 9);
  text(s, "调用后：d.root_ = e.root_ = nullptr", 6.85, 3.7, 2.6, 0.5, { fontSize: 9.5, bold: true, color: C.bad, align: "center", margin: 0 });
  text(s, "同一批结点只归 b 一个人管，析构只删一次。", 6.85, 4.25, 2.6, 0.75, { fontSize: 10, margin: 0, align: "center" });
}

// teaching T3
{
  const s = content("5.3", "5.3 教学版 binary_tree/teaching.hpp（三）", "后序释放，递归深拷贝");
  codeBlock(s, `    void clear() {
        destroy(root_);
        root_ = nullptr;
    }

private:
    // 【代码5.8】后序释放：必须先删两个孩子，再删自己。
    // 反过来先 delete node，node->left 就成了读已释放内存。
    static void destroy(Node* node) {
        if (node == nullptr) {
            return;
        }
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

    // 深拷贝：形状和 destroy 一样，只是把"删"换成"建"。
    static Node* clone(const Node* node) {
        if (node == nullptr) {
            return nullptr;
        }
        return new Node{node->value, clone(node->left), clone(node->right)};
    }`, 0.5, 1.02, 6.0, 4.08, { fontSize: 8.8, hl: [13, 14, 15] });
  callout(s, "为什么必须后序", [
    "`delete node` 之后，`node->left`、`node->right` 都成了**已释放内存**。",
    "所以先把两个孩子删干净，**最后**删自己——这就是后序 LRt。",
    "ASan 当场报 `heap-use-after-free`。",
  ], 6.75, 1.02, 2.75, 2.35, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  callout(s, "clone 的形状", "和 destroy 一模一样，只是把「删」换成「建」：先建两个孩子的副本，再建自己并接上。", 6.75, 3.5, 2.75, 1.6, { fontSize: 10.5 });
}

// size/height + recursion cost
{
  const s = content("5.3", "5.3 教学版 · 递归的代价", "size / height：先算孩子、再算自己；递归深度 = 树高");
  codeBlock(s, `    static std::size_t count(const Node* node) {
        return node == nullptr ? 0 : 1 + count(node->left) + count(node->right);
    }

    static std::size_t depth(const Node* node) {
        if (node == nullptr) return 0;
        std::size_t l = depth(node->left);
        std::size_t r = depth(node->right);
        return 1 + (l > r ? l : r);
    }`, 0.5, 1.02, 6.5, 1.85, { fontSize: 8.5 });
  card(s, 7.2, 1.02, 2.3, 1.85, C.dark);
  text(s, "图 5.5 那棵树", 7.35, 1.1, 2.1, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "size() = 9\nheight() = 4", 7.35, 1.45, 2.1, 0.75, { fontSize: 17, bold: true, color: C.white, margin: 0, fontFace: MONO });
  text(s, "最长路径 A→B→E→G（4 个结点）", 7.35, 2.25, 2.1, 0.55, { fontSize: 9.5, color: C.mint, margin: 0 });
  card(s, 0.5, 3.05, 4.35, 2.05, C.code);
  text(s, "周游：保留递归为主实现", 0.7, 3.12, 4, 0.35, { fontSize: 13, bold: true, color: C.green, margin: 0 });
  text(s, "它就是本节要教的东西，抹掉递归等于抹掉课程内容。迭代版（D-001 §3d）作为补充并列给出。", 0.7, 3.5, 4.0, 1.5, { fontSize: 11 });
  card(s, 5.15, 3.05, 4.35, 2.05, RED);
  text(s, "析构与深拷贝：工程版改成迭代", 5.35, 3.12, 4, 0.35, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  text(s, "它们**不是教学内容，却会被隐式触发**：作用域结束、一句 `auto copy = tree;`。实测纯左链 50 万结点递归 `clone`、100 万结点递归 `destroy` 即段错误；改成迭代后 500 万都不崩。", 5.35, 3.5, 4.0, 1.55, { fontSize: 10.5 });
}

// ============================ PART 4 ============================
sectionSlide("Part 4 · 5.4", "二叉搜索树", "左小右大 · 中序即升序\n查找 · 插入（指向指针的指针）· 删除（中序前驱顶替）");

// BST definition
{
  const s = content("5.4", "5.4 二叉搜索树 · 定义", "插入、删除、检索都要快：二叉搜索树 BST");
  table(s, [
    ["组织方式", "插入", "检索"],
    ["无序线性表", "放末端，快", "慢：逐个比较"],
    ["有序线性表", "要移动大量元素", "二分查找，快"],
    [{ t: "二叉搜索树", bold: true }, { t: "改一个空指针", bold: true, color: C.ok }, { t: "沿一条路径往下", bold: true, color: C.ok }],
  ], 0.5, 1.02, 5.5, [1.6, 1.95, 1.95], { fontSize: 11, rowH: 0.4 });
  bullets(s, [
    "左子树非空，则左子树上**所有**结点的值 **<** 根的关键码。",
    "右子树非空，则右子树上**所有**结点的值 **>** 根的关键码。",
    "任何结点的左右子树**都是 BST**；可以是空树。",
    "推论：**中序周游得到升序序列**；关键码必须唯一。",
  ], 0.5, 2.8, 5.5, 2.3, { fontSize: 12, gap: 6 });
  card(s, 6.25, 1.02, 3.25, 4.08, C.code);
  image(s, "fig-5-11", 6.4, 1.1, 2.95, 3.2);
  text(s, "图 5.11　K = {50, 19, 35, 55, 20, 5, 100, 52, 88, 53, 92} 依次插入所建的 BST", 6.35, 4.35, 3.05, 0.7, { fontSize: 9, color: C.muted, align: "center" });
}

// contains
{
  const s = content("5.4", "5.4 二叉搜索树 · 查找", "contains：每比较一次，扔掉一整棵子树");
  codeBlock(s, `    // 查找：同样一路往下走。树高是 h，代价就是 O(h)。
    bool contains(const T& value) const {
        const Node* current = root_;
        while (current != nullptr) {
            if (value < current->value) {
                current = current->left;
            } else if (current->value < value) {
                current = current->right;
            } else {
                return true;
            }
        }
        return false;
    }`, 0.5, 1.02, 5.2, 2.65, { fontSize: 9 });
  callout(s, "只用 <", "相等写成「既不小于也不大于」：`T` 只需支持 `operator<`。", 0.5, 3.8, 5.2, 0.8, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "走到空子树还没找到 → key 不在树里。", 0.5, 4.7, 5.2, 0.35, { fontSize: 11, bold: true, color: C.goldText });
  card(s, 5.95, 1.02, 3.55, 4.08, C.code);
  text(s, "在图 5.11 中查 53", 6.1, 1.1, 3.2, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  drawTree(s, {
    a: [50, 7.6, 1.7, HL], b: [19, 6.7, 2.3], c: [55, 8.5, 2.3, HL], d: [5, 6.35, 2.9], e: [35, 7.05, 2.9],
    f: [52, 8.05, 2.9, HL], g: [100, 9.1, 2.9], h: [20, 6.8, 3.5], i: [53, 8.35, 3.5, C.ok, C.white], j: [88, 8.85, 3.5], k: [92, 9.15, 4.1],
  }, [["a", "b"], ["a", "c", C.goldText], ["b", "d"], ["b", "e"], ["e", "h"], ["c", "f", C.goldText], ["c", "g"], ["f", "i", C.goldText], ["g", "j"], ["j", "k"]], { r: 0.18, fs: 9 });
  text(s, "53 > 50 右 → 53 < 55 左 → 53 > 52 右 → 找到（4 次比较）", 6.05, 4.4, 3.4, 0.6, { fontSize: 9.5, margin: 0 });
}

// insert
{
  const s = content("5.4", "5.4 二叉搜索树 · 插入【算法5.9】", "insert：Node** link 指向「新结点该挂在哪根指针上」");
  codeBlock(s, `    // 【算法5.9】插入。一路比较着往下走，走到空位就把新结点挂上去。
    // 键已存在时返回 false——重复键是可预期状态，不是错误，所以不抛异常。
    bool insert(const T& value) {
        Node** link = &root_;               // 指向「新结点该挂在哪根指针上」
        while (*link != nullptr) {
            if (value < (*link)->value) {
                link = &(*link)->left;
            } else if ((*link)->value < value) {
                link = &(*link)->right;
            } else {
                return false;               // 已经有了
            }
        }
        *link = new Node{value, nullptr, nullptr};
        return true;
    }`, 0.5, 1.02, 6.2, 3.0, { fontSize: 8.6, hl: [14] });
  callout(s, "指向指针的指针", "「挂到根」和「挂到某个孩子」写成**同一句** `*link = new Node{...}`——空树不必另开一个分支。第 3 章链式栈 `copy_from` 的 `Node** tail` 是同一个技巧。", 0.5, 4.12, 6.2, 1.0, { fontSize: 10.5 });
  callout(s, "插入 = 查找 + 改一个空指针", [
    "先按检索路径往下找；已存在就**不插入**。",
    "走到空位，新结点成为**新的叶**。",
    "不像有序表那样移动大量数据。",
    "代价 = 根到插入位置的路径长度：**树形平衡时效率很高**。",
  ], 6.95, 1.02, 2.55, 4.1, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// insert trace + remove 3
{
  const s = content("5.4", "5.4 二叉搜索树 · 例题", "demo：插入 8,3,10,1,6,14,4,7，再删除 3");
  card(s, 0.5, 1.02, 4.35, 3.15, C.code);
  text(s, "依次插入后", 0.65, 1.1, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  drawTree(s, {
    a: [8, 2.7, 1.65], b: [3, 1.7, 2.3, C.bad, C.white], c: [10, 3.7, 2.3], d: [1, 1.2, 2.95, HL], e: [6, 2.2, 2.95],
    f: [14, 4.2, 2.95], g: [4, 1.9, 3.6], h: [7, 2.5, 3.6],
  }, [["a", "b"], ["a", "c"], ["b", "d"], ["b", "e"], ["c", "f"], ["e", "g"], ["e", "h"]]);
  text(s, "中序：1 3 4 6 7 8 10 14（升序）", 0.65, 3.85, 4.1, 0.28, { fontSize: 10, bold: true, color: C.ok, margin: 0 });
  card(s, 5.15, 1.02, 4.35, 3.15, C.code);
  text(s, "remove(3) 之后", 5.3, 1.1, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  drawTree(s, {
    a: [8, 7.35, 1.65], b: [1, 6.35, 2.3, HL], c: [10, 8.35, 2.3], e: [6, 6.85, 2.95],
    f: [14, 8.85, 2.95], g: [4, 6.55, 3.6], h: [7, 7.15, 3.6],
  }, [["a", "b"], ["a", "c"], ["b", "e"], ["c", "f"], ["e", "g"], ["e", "h"]]);
  text(s, "中序：1 4 6 7 8 10 14 ✓", 5.3, 3.85, 4.1, 0.28, { fontSize: 10, bold: true, color: C.ok, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 4.9, y: 2.6, w: 0.2, h: 0, line: { color: C.bad, width: 2, endArrowType: "triangle" } });
  callout(s, "删 3：3 有左子树，用中序前驱顶替", "左子树 {1} 里最大的是 **1**（从左孩子一路向右走到底）。1 没有左孩子可接走；1 继承 3 的左（此时已空）和右（6），挂到 8 的左边。1 比左子树其余的都大、比右子树 {4, 6, 7} 都小，左小右大仍然成立。", 0.5, 4.3, 9.0, 0.82, { fontSize: 10, tsize: 11, lsm: 1.05 });
}

// remove: basic vs improved
{
  const s = content("5.4", "5.4 二叉搜索树 · 删除", "两个删除算法：原书【算法5.9】与改进的【算法5.10】");
  card(s, 0.5, 1.02, 5.3, 2.75, C.code);
  image(s, "fig-5-12", 0.65, 1.08, 5.0, 2.35);
  text(s, "图 5.12　(a) 删 52：无左子树，右子树顶上　(b) 删 55：基本方案", 0.5, 3.45, 5.3, 0.3, { fontSize: 9, color: C.muted, align: "center" });
  card(s, 6.05, 1.02, 3.45, 2.75, C.code);
  image(s, "fig-5-13", 6.2, 1.08, 3.15, 2.35);
  text(s, "图 5.13　改进方案：53 顶替 55", 6.05, 3.45, 3.45, 0.3, { fontSize: 9, color: C.muted, align: "center" });
  callout(s, "基本方案（本书不用）", "在左子树里找中序最后一个结点 t，把**被删结点的整棵右子树**挂成 t 的右子树，再让左子树的根顶上。对，但**树可能变高**。", 0.5, 3.9, 4.35, 1.2, { fontSize: 10, fill: RED, tcolor: C.bad });
  callout(s, "改进方案（教学版实现）", "先把左子树最大结点 t（**无右子树**）摘下：用它的左子树代替它；再用 t 顶替被删结点。接上去的是同一层的邻居，高度不会凭空长高。", 5.15, 3.9, 4.35, 1.2, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// remove code p1
{
  const s = content("5.4", "5.4 二叉搜索树 · remove_impl（上）", "Node*& link：找到要删的结点；没有左孩子就让右孩子顶上");
  codeBlock(s, `    // 【算法5.10】删除。键不存在返回 false（幂等，不是错误）。
    //
    // 难点只有一个：被删结点有两个孩子时，谁来顶替它？
    // 答案是中序前驱——左子树里最大的那个。它顶上来之后，
    // 「左小右大」仍然成立，因为它比左子树其余的都大、比右子树全部都小。
    bool remove(const T& value) { return remove_impl(root_, value); }
    // ...
    static bool remove_impl(Node*& link, const T& value) {
        if (link == nullptr) {
            return false;
        }
        if (value < link->value) {
            return remove_impl(link->left, value);
        }
        if (link->value < value) {
            return remove_impl(link->right, value);
        }

        Node* removed = link;
        if (removed->left == nullptr) {          // 没有左孩子：右孩子直接顶上
            link = removed->right;
            delete removed;
            return true;
        }
        // ...`, 0.5, 1.02, 6.2, 4.08, { fontSize: 8.5, hl: [21] });
  callout(s, "link 是引用", "`Node*& link` 就是**父结点里那根指针本身**（或 `root_`）。改 `link` 就是把子树改挂到父结点上，不必另记父结点。", 6.95, 1.02, 2.55, 2.0, { fontSize: 10.5 });
  callout(s, "幂等", "删除不存在的键、插入重复键都是**可预期状态**：返回 `false`，不抛异常。", 6.95, 3.15, 2.55, 1.2, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "叶子也走这条分支：右孩子是 nullptr，link 置空。", 6.95, 4.45, 2.55, 0.65, { fontSize: 10, color: C.goldText, bold: true, margin: 0 });
}

// remove code p2
{
  const s = content("5.4", "5.4 二叉搜索树 · remove_impl（下）", "有左子树：摘下中序前驱，让它继承两棵子树");
  codeBlock(s, `        // 找中序前驱：从左孩子出发，一路向右走到底
        Node** predecessor_link = &removed->left;
        while ((*predecessor_link)->right != nullptr) {
            predecessor_link = &(*predecessor_link)->right;
        }
        Node* replacement = *predecessor_link;
        *predecessor_link = replacement->left;   // 前驱可能还有左孩子，先接走
        replacement->left = removed->left;
        replacement->right = removed->right;
        link = replacement;
        delete removed;
        return true;
    }`, 0.5, 1.02, 6.2, 2.45, { fontSize: 9, hl: [7] });
  const steps = [["摘下", "`*predecessor_link = replacement->left;`", C.bad], ["继承", "`replacement->left/right = removed->...`", C.green], ["顶替", "`link = replacement;`", C.green], ["只删一次", "`delete removed;`", C.dark]];
  steps.forEach((st, i) => {
    const y = 3.62 + i * 0.37;
    numCircle(s, i + 1, 0.5, y, 0.3, st[2]);
    text(s, st[0], 0.9, y, 0.95, 0.3, { fontSize: 11, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, st[1], 1.85, y, 4.85, 0.3, { fontSize: 10, valign: "middle", margin: 0 });
  });
  callout(s, "⚠ 漏了第 7 行会成环", "前驱自己可能还有一个**左孩子**，顶替之前必须先把它接走。漏了这一句：前驱原位置还指着自己，树上出现**环**——教学版测试专门搭了这样一棵树，去掉那句，中序周游立刻无限递归、ASan 报栈溢出。", 6.95, 1.02, 2.55, 2.85, { fontSize: 10, fill: RED, tcolor: C.bad });
  callout(s, "代价", "查找、插入、删除都是 **O(h)**。按升序插入会退化成一条链，h = n。", 6.95, 4.0, 2.55, 1.1, { fontSize: 10.5 });
}

// ============================ PART 5 ============================
sectionSlide("Part 5 · 5.5", "堆与优先队列", "完全二叉树 + 数组 · 局部有序\n上浮 · 下沉 · 建堆 O(n) · 优先队列 · 对顶堆");

// heap definition
{
  const s = content("5.5", "5.5 堆与优先队列 · 最小堆", "最小堆：一棵特殊的完全二叉树");
  card(s, 0.5, 1.02, 5.4, 0.8, C.dark);
  text(s, "Kᵢ ≤ K₂ᵢ₊₁，Kᵢ ≤ K₂ᵢ₊₂　（i = 0, 1, …, ⌊n/2⌋ − 1）", 0.65, 1.02, 5.2, 0.8, { fontSize: 15, bold: true, color: C.gold, valign: "middle", margin: 0 });
  bullets(s, [
    "逻辑上是**完全二叉树**：根对应 K₀，按层次从左至右依次类推 → 可以压进**数组**。",
    "每个内部结点**不大于**它的孩子 → 根（K₀）最小。",
    "**局部有序**：只有父子之间能断定大小；兄弟之间没有必然联系。",
    "最小堆**只适合查最小值**：没有 BST 那样的全序，找任意值只能线性扫描。",
  ], 0.5, 1.95, 5.4, 2.4, { fontSize: 11.5, gap: 6 });
  text(s, "图 5.14 的数组存储", 0.5, 4.35, 3, 0.25, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  cells(s, 0.5, 4.62, [12, 14, 15, 19, 20, 17, 18, 24, 22, 26], { cw: 0.5, ch: 0.3, fs: 10.5, idx: true, fills: [HL] });
  card(s, 6.15, 1.02, 3.35, 4.08, C.code);
  image(s, "fig-5-14", 6.3, 1.1, 3.05, 2.8);
  text(s, "图 5.14　K = {12,14,15,19,20,17,18,24,22,26} 的最小堆。14 与 15、19 与 20 之间没有任何关系——这和 BST 完全不同，也正是建堆能比排序更快的原因。", 6.25, 3.95, 3.15, 1.1, { fontSize: 9, color: C.muted });
}

// insert/remove_min code
{
  const s = content("5.5", "5.5 教学版 heap_huffman/teaching.hpp · MinHeap", "insert 放末尾再上浮；remove_min 搬最后一个上来再下沉");
  codeBlock(s, `    // 插入：先放到数组末尾（也就是完全二叉树的最后一个位置），
    // 再一路和父亲比较、必要时上浮。树高是 log n，所以代价是 O(log n)。
    void insert(const T& value) {
        if (size_ == capacity_) {
            grow();
        }
        data_[size_] = value;
        sift_up(size_);
        ++size_;
    }

    // 取走最小的那个（就是根，下标 0）。空堆返回空 optional。
    //
    // 手法是固定的：把最后一个元素搬到根上，长度减一，然后让它一路下沉。
    // 为什么是最后一个？因为只有拿掉最后一个位置，剩下的才仍然是一棵完全二叉树。
    std::optional<T> remove_min() {
        if (empty()) {
            return std::nullopt;
        }
        T smallest = data_[0];
        --size_;
        if (size_ > 0) {
            data_[0] = data_[size_];
            sift_down(0);
        }
        return smallest;
    }`, 0.5, 1.02, 6.4, 4.08, { fontSize: 8.4, hl: [7, 8, 23, 24] });
  callout(s, "三个数据成员", "数组 `data_`，加上 `capacity_` 与 `size_`：和第 3 章顺序栈一样，三法则、满了翻倍 `grow()`。", 7.1, 1.02, 2.4, 1.6, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "为什么搬「最后一个」", "只有拿掉最后一个位置，剩下的才**仍是完全二叉树**。这是「完全」这个条件在还债。", 7.1, 2.75, 2.4, 1.5, { fontSize: 10.5 });
  text(s, "空堆 → `nullopt`，与第 3 章空栈 `pop()` 同一口径。", 7.1, 4.4, 2.4, 0.7, { fontSize: 10, bold: true, color: C.goldText, margin: 0 });
}

// sift_up + trace
{
  const s = content("5.5", "5.5 最小堆 · 插入", "上浮（筛选）：在图 5.14 的堆里插入 13");
  card(s, 0.5, 1.02, 9.0, 1.65, C.code);
  image(s, "fig-5-15", 0.7, 1.07, 8.6, 1.55);
  codeBlock(s, `    // 上浮：只要比父亲小就换上去。
    void sift_up(size_type index) {
        while (index > 0) {
            size_type parent = (index - 1) / 2;
            if (!(data_[index] < data_[parent])) {
                break;                       // 已经不小于父亲，位置对了
            }
            T tmp = data_[index];
            data_[index] = data_[parent];
            data_[parent] = tmp;
            index = parent;
        }
    }`, 0.5, 2.8, 5.2, 2.3, { fontSize: 8.2 });
  const rows = [
    ["放末尾 i=10", [12, 14, 15, 19, 20, 17, 18, 24, 22, 26, 13], [10], "父 i=4 是 20"],
    ["换 20 → i=4", [12, 14, 15, 19, 13, 17, 18, 24, 22, 26, 20], [4], "父 i=1 是 14"],
    ["换 14 → i=1", [12, 13, 15, 19, 14, 17, 18, 24, 22, 26, 20], [1], "父 12 ≤ 13，停"],
  ];
  rows.forEach((r, i) => {
    const y = 2.85 + i * 0.72;
    text(s, r[0], 5.85, y, 1.6, 0.25, { fontSize: 9.5, bold: true, color: C.dark, margin: 0 });
    text(s, r[3], 7.4, y, 2.1, 0.25, { fontSize: 9, color: C.muted, margin: 0, align: "right" });
    cells(s, 5.85, y + 0.27, r[1], { cw: 0.33, ch: 0.3, fs: 9, fills: r[1].map((_, j) => (r[2].includes(j) ? HL : null)) });
  });
  text(s, "每步只和父亲比：至多走树高 → O(log n)", 5.85, 4.95, 3.65, 0.2, { fontSize: 9.5, bold: true, color: C.goldText, margin: 0 });
}

// sift_down
{
  const s = content("5.5", "5.5 最小堆 · 删除", "下沉：必须和两个孩子里较小的那个交换");
  codeBlock(s, `    // 下沉：和两个孩子里较小的那个比，比它大就换下去。
    // 必须和较小的那个换——跟较大的换会破坏「父亲不大于两个孩子」。
    void sift_down(size_type index) {
        for (;;) {
            size_type left = index * 2 + 1;
            size_type right = left + 1;
            size_type smallest = index;
            if (left < size_ && data_[left] < data_[smallest]) {
                smallest = left;
            }
            if (right < size_ && data_[right] < data_[smallest]) {
                smallest = right;
            }
            if (smallest == index) {
                return;                      // 父亲已经最小，停
            }
            T tmp = data_[index];
            data_[index] = data_[smallest];
            data_[smallest] = tmp;
            index = smallest;
        }
    }`, 0.5, 1.02, 6.1, 4.08, { fontSize: 8.8, hl: [8, 11] });
  card(s, 6.35, 1.02, 3.15, 1.45, C.code);
  image(s, "fig-5-16", 6.45, 1.08, 2.95, 1.0);
  text(s, "图 5.16　在图 5.14 的堆里删除 14", 6.35, 2.12, 3.15, 0.3, { fontSize: 9, color: C.muted, align: "center" });
  callout(s, "图 5.16：删除 14", "末端的 26 填进空位，再与较小的孩子逐层交换（19，再 22），直到不大于自己的孩子。", 6.35, 2.6, 3.15, 1.2, { fontSize: 10 });
  callout(s, "反例：和较大的换", "根 26、孩子 14 与 15：若换 15 上来，15 > 14，父亲比孩子大——**堆序当场破坏**。", 6.35, 3.9, 3.15, 1.2, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// remove_min trace
{
  const s = content("5.5", "5.5 最小堆 · 例题", "逐步推演：对图 5.14 的堆做一次 remove_min");
  const rows = [
    ["初始", [12, 14, 15, 19, 20, 17, 18, 24, 22, 26], [0], "size = 10，最小元 12 在根"],
    ["① 搬末尾", [26, 14, 15, 19, 20, 17, 18, 24, 22], [0], "取走 12，末尾 26 搬到根，size = 9"],
    ["② i = 0", [14, 26, 15, 19, 20, 17, 18, 24, 22], [0, 1], "孩子 14、15 取小的 14，交换"],
    ["③ i = 1", [14, 19, 15, 26, 20, 17, 18, 24, 22], [1, 3], "孩子 19、20 取 19，交换"],
    ["④ i = 3", [14, 19, 15, 22, 20, 17, 18, 24, 26], [3, 8], "孩子 24、22 取 22，交换"],
    ["⑤ i = 8", [14, 19, 15, 22, 20, 17, 18, 24, 26], [8], "2·8+1 = 17 ≥ 9：没有孩子，停"],
  ];
  rows.forEach((r, i) => {
    const y = 1.05 + i * 0.56;
    text(s, r[0], 0.5, y, 1.05, 0.38, { fontSize: 11, bold: true, color: C.dark, valign: "middle", margin: 0 });
    cells(s, 1.6, y, r[1], { cw: 0.42, ch: 0.38, fs: 10.5, fills: r[1].map((_, j) => (r[2].includes(j) ? HL : null)) });
    text(s, r[3], 5.95, y, 3.55, 0.38, { fontSize: 10.5, valign: "middle", margin: 0 });
  });
  text(s, "结果 14 19 15 22 20 17 18 24 26：新根 14 是剩下元素里最小的。", 0.5, 4.5, 5.4, 0.5, { fontSize: 11, bold: true, color: C.ok, margin: 0, valign: "middle" });
  callout(s, "课堂练习", "堆 [2,5,7,9,6] 删根：搬 6 得 [6,5,7,9]；与 5 交换得 [5,6,7,9]；停。", 6.1, 4.35, 3.4, 0.78, { fontSize: 9.5, tsize: 10.5, fill: C.mint, tcolor: C.dark, lsm: 1.05 });
}

// build heap trace
{
  const s = content("5.5", "5.5.1a 建堆（筛选法）", "从最后一个非叶结点起，倒着对每个结点做一次下沉");
  card(s, 0.5, 1.02, 3.3, 4.08, C.code);
  image(s, "fig-5-17", 0.6, 1.07, 3.1, 3.98);
  text(s, "倒着做的理由：对某结点下沉时，它的两棵子树**必须已经是堆**。叶结点本身就是堆——后一半结点一次都不用碰。", 4.05, 1.02, 5.45, 0.6, { fontSize: 11 });
  table(s, [
    ["i", "操作（n = 8，从 ⌊8/2⌋ − 1 = 3 开始）", "数组"],
    ["—", "初始（无序）", { t: "19 8 35 65 40 3 7 45", mono: true }],
    ["3", "65 > 孩子 45，交换", { t: "19 8 35 45 40 3 7 65", mono: true }],
    ["2", "35 > min(3, 7) = 3，交换", { t: "19 8 3 45 40 35 7 65", mono: true }],
    ["1", "8 ≤ 45、8 ≤ 40，不动", { t: "19 8 3 45 40 35 7 65", mono: true }],
    ["0", "19 > 3 交换；下到 i=2，19 > 7 再交换", { t: "3 8 7 45 40 35 19 65", mono: true, bold: true, color: C.ok }],
  ], 4.05, 1.7, 5.45, [0.35, 2.85, 2.25], { fontSize: 9.5, rowH: 0.42 });
  callout(s, "对照图 5.17 (a)–(d)", "结果与图中最终状态一致。教学版 `MinHeap` 没有建堆函数，这里演示筛选法本身。", 4.05, 4.4, 5.45, 0.7, { fontSize: 9.5, tsize: 10.5, fill: C.mint, tcolor: C.dark, lsm: 1.05 });
}

// O(n) proof
{
  const s = content("5.5", "5.5.1a 建堆为什么是 O(n) 而不是 O(n log n)", "越靠底层的结点越多，能沉的距离越短——两者抵消");
  card(s, 0.5, 1.02, 4.35, 1.5, RED);
  text(s, "粗算（原书：只是粗略上界）", 0.7, 1.1, 4, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  text(s, "约 n/2 个非叶结点 × 每次下沉 O(log n)\n= O(n log n)", 0.7, 1.45, 4.0, 1.0, { fontSize: 12 });
  card(s, 5.15, 1.02, 4.35, 1.5, "EAF4EF");
  text(s, "细算：下沉代价 = 离底层还有多远", 5.35, 1.1, 4, 0.3, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
  text(s, "把堆放大成一棵同样高 h、**每层都排满**的二叉树（perfect）：每个结点能沉的距离都不短 → 算出的是**上界**。", 5.35, 1.45, 4.05, 1.0, { fontSize: 10.5 });
  card(s, 0.5, 2.7, 5.6, 1.15, C.dark);
  text(s, "Σ 2^i·(h−i) = 2^h · Σ j/2^j < 2^h · 2 = 2^(h+1) ≤ 2n", 0.65, 2.75, 5.35, 0.55, { fontSize: 14, bold: true, color: C.gold, margin: 0, fontFace: MONO, valign: "middle" });
  text(s, "第 i 层恰有 2^i 个结点、最多下沉 h−i 层；令 j = h−i；用 Σ j/2^j = 2 与 2^h ≤ n。", 0.65, 3.3, 5.35, 0.5, { fontSize: 9.5, color: C.mint, margin: 0 });
  table(s, [
    ["层 i", "结点数", "最多下沉", "小计"],
    ["0", "1", "3", "3"],
    ["1", "2", "2", "4"],
    ["2", "4", "1", "4"],
    ["3", "8", "0", "0"],
    [{ t: "合计", bold: true }, "15", "", { t: "11 < 16 ≤ 30", bold: true, color: C.ok }],
  ], 6.35, 2.98, 3.15, [0.6, 0.75, 0.85, 0.95], { fontSize: 9.5, rowH: 0.27, align: "center", tight: true });
  text(s, "例：h = 3、每层排满（n = 15）", 6.35, 2.7, 3.15, 0.25, { fontSize: 9, color: C.muted, margin: 0, align: "center" });
  callout(s, "实际后果", "堆排序总代价 O(n log n)，但那个 log n **全部来自后面 n 次取最小**，建堆是白送的。反过来一个个 `insert` 建堆是 O(n log n)，就把这份便宜丢掉了。", 0.5, 4.0, 5.6, 1.1, { fontSize: 10.5 });
}

// priority queue
{
  const s = content("5.5", "5.5.2 优先队列", "快速找出并移走最大（最小）值：优先队列");
  bullets(s, [
    "0 个或多个元素的集合，每个元素有一个关键码；主要特点是**快速查找并移出最小（最大）元素**。",
    "操作系统调度：优先级越高值越小，最先获得处理器；打印队列：先打页数少的任务。",
    "本书 `MinHeap<T>` 就是一个最小优先队列：`insert` = 入队，`remove_min` = 取最高优先级，空队列 = `nullopt`。",
  ], 0.5, 1.02, 5.3, 2.6, { fontSize: 11.5, gap: 7 });
  table(s, [
    ["实现", "取最小", "插入"],
    ["无序线性表", "O(n)", "O(1)"],
    ["有序线性表", "O(1)", "要移动元素"],
    [{ t: "堆", bold: true }, { t: "看堆顶 O(1)；移除 O(log n)", bold: true, color: C.ok }, { t: "O(log n)", bold: true, color: C.ok }],
  ], 6.05, 1.02, 3.45, [1.05, 1.5, 0.9], { fontSize: 10, rowH: 0.48 });
  text(s, "建堆 O(n)。", 6.05, 3.05, 3.45, 0.3, { fontSize: 10.5, bold: true, color: C.goldText, margin: 0 });
  callout(s, "需要的是「下一项最优」，不是整队排序", "Huffman 构造反复取两个最小权值；Dijkstra、Prim 反复取当前距离或边权最小的候选。若要求**相同优先级保持到达顺序**，还要把到达序号作为第二关键码显式存入元素。", 0.5, 3.75, 9.0, 1.35, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// running median concept + trace
{
  const s = content("5.5", "5.5.2 对顶堆：动态维护中位数", "较小的一半进最大堆，较大的一半进最小堆");
  bullets(s, [
    "不变式①：最大堆 `lower_` 的每个元素 ≤ 最小堆 `upper_` 的每个元素。",
    "不变式②：两堆一样大，或 `lower_` 多一个 → 中位数 = `lower_` 的堆顶。",
    "新元素 ≤ `lower_` 堆顶就进 `lower_`，否则进 `upper_`；超出规定就把多的那边的堆顶搬过去——**一次一个就够**。",
    "插入 O(log n)，查询 O(1)；偶数个时取**下中位数**。",
  ], 0.5, 1.02, 4.4, 4.05, { fontSize: 11, gap: 7 });
  table(s, [
    ["插入", "放进", "搬堆顶", "lower_", "upper_", "中位数"],
    ["5", "lower_", "—", "{5}", "{}", { t: "5", bold: true, color: C.bad }],
    ["2", "lower_", "5 → upper_", "{2}", "{5}", { t: "2", bold: true, color: C.bad }],
    ["8", "upper_", "5 → lower_", "{2, 5}", "{8}", { t: "5", bold: true, color: C.bad }],
    ["1", "lower_", "5 → upper_", "{1, 2}", "{5, 8}", { t: "2", bold: true, color: C.bad }],
    ["9", "upper_", "5 → lower_", "{1, 2, 5}", "{8, 9}", { t: "5", bold: true, color: C.bad }],
  ], 5.1, 1.02, 4.4, [0.5, 0.75, 1.0, 0.8, 0.75, 0.6], { fontSize: 9.5, rowH: 0.42, align: "center" });
  callout(s, "核对", "排序后：{5}、{2,5}、{2,5,8}、{1,2,5,8}、{1,2,5,8,9}，下中位数依次是 5、2、5、2、5 ✓", 5.1, 3.7, 4.4, 1.4, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// running median code
{
  const s = content("5.5", "5.5.2 对顶堆 · 工程版 heap_huffman/modern.hpp", "RunningMedian：两个堆背靠背，堆顶相对");
  codeBlock(s, `template <typename T>
class RunningMedian {
public:
    void insert(const T& value) {
        if (lower_.empty() || !(*lower_.peek() < value)) lower_.insert(value);
        else upper_.insert(value);
        rebalance();
    }
    /// 空时 std::nullopt。
    [[nodiscard]] std::optional<T> median() const {
        if (const T* top = lower_.peek()) return *top;
        return std::nullopt;
    }
    [[nodiscard]] std::size_t size() const noexcept { return lower_.size() + upper_.size(); }

private:
    /// 每次插入后两堆大小至多差 2，搬一个堆顶就回到不变式。
    void rebalance() {
        if (lower_.size() > upper_.size() + 1) upper_.insert(*lower_.remove_min());
        else if (upper_.size() > lower_.size()) lower_.insert(*upper_.remove_min());
    }
    MinHeap<T, std::greater<T>> lower_;   // 较小的一半，堆顶是其中最大的
    MinHeap<T> upper_;                    // 较大的一半，堆顶是其中最小的
};`, 0.5, 1.02, 6.75, 4.08, { fontSize: 7.9, hl: [22] });
  callout(s, "最大堆从哪来", "不另写一个类：给 `MinHeap` 加比较器模板参数，默认 `std::less<T>`。`MinHeap<T, std::greater<T>>` 的堆顶就是最大元素。上浮、下沉一行没变，只是 `<` 换成了 `compare_`。", 7.45, 1.02, 2.05, 2.75, { fontSize: 9 });
  callout(s, "peek", "只看不拿：返回指针，空堆为 `nullptr`；下一次插入或删除后失效。", 7.45, 3.9, 2.05, 1.2, { fontSize: 9, fill: C.mint, tcolor: C.dark });
}

// ============================ PART 6 ============================
sectionSlide("Part 6 · 5.6", "Huffman 树及其应用", "带权外部路径长度 WPL · 反复合并两个最小\n批量权值只求 WPL · 前缀码 · 编码与译码");

// WPL fig 5.18
{
  const s = content("5.6", "5.6 Huffman 树 · 带权路径长度", "同样四个权 6、2、3、4，形状不同，WPL 不同");
  card(s, 0.5, 1.02, 9.0, 2.3, C.code);
  image(s, "fig-5-18", 0.7, 1.08, 8.6, 2.15);
  const ws = [["(a)", "6×2 + 2×2 + 3×2 + 4×2", "30", C.text], ["(b)", "6×2 + 2×3 + 3×3 + 4×1", "31", C.bad], ["(c)", "6×1 + 2×3 + 3×3 + 4×2", "29", C.ok]];
  ws.forEach((w, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 3.45, 2.85, 0.95, i === 2 ? "EAF4EF" : C.white, "D5DDD9");
    text(s, w[0] + "  " + w[1], x + 0.12, 3.5, 2.65, 0.4, { fontSize: 10.5, margin: 0, valign: "middle" });
    text(s, "= " + w[2], x + 0.12, 3.9, 2.65, 0.45, { fontSize: 18, bold: true, color: w[3], margin: 0, valign: "middle" });
  });
  text(s, "WPL = Σ（叶的权 × 叶的深度）。(c) 最小，它就是这组权值的 Huffman 树——**权越大的叶离根越近**，总长就越小。", 0.5, 4.5, 9.0, 0.6, { fontSize: 12, bold: true, color: C.dark });
}

// construction fig 5.19
{
  const s = content("5.6", "5.6 Huffman 树 · 构造", "反复取出两个最小的，合成它们的和，直到只剩一棵");
  card(s, 0.5, 1.02, 9.0, 2.05, C.code);
  image(s, "fig-5-19", 0.7, 1.08, 8.6, 1.9);
  bullets(s, [
    "n 个权各自成为一棵**单结点树**。",
    "每次挑出根权**最小的两棵**，合成一棵新树，新根的权是两者之和。",
    "重复 **n − 1 次**，集合里只剩一棵；根权 = 全部叶子权之和。",
  ], 0.5, 3.2, 5.3, 1.9, { fontSize: 11.5, gap: 6 });
  card(s, 6.05, 3.2, 3.45, 1.9, C.dark);
  text(s, "为什么用堆", 6.25, 3.28, 3, 0.3, { fontSize: 12, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "每一轮都要「取当前最小的两棵」。", options: { breakLine: true } },
    { text: "数组线性扫：O(n) 一轮，共 " }, { text: "O(n²)", options: { bold: true, color: C.gold, breakLine: true } },
    { text: "最小堆：O(log n) 一轮，共 " }, { text: "O(n log n)", options: { bold: true, color: C.gold } },
  ], { x: 6.25, y: 3.65, w: 3.15, h: 1.35, fontFace: FONT, fontSize: 11, color: C.white, margin: 0, isTextBox: true, valign: "top", lineSpacingMultiple: 1.2 });
}

// ctor p1
{
  const s = content("5.6", "5.6 教学版 HuffmanTree（上）", "先把参数全查一遍，再动手 new");
  codeBlock(s, `    /// 带上每个权重对应的字符，树就能拿来编码和译码了。
    HuffmanTree(const char* symbols, const int* weights, std::size_t count) : root_(nullptr) {
        if (count == 0) {
            return;
        }
        if (weights == nullptr) {
            throw std::invalid_argument("HuffmanTree: 权重数组是空指针");
        }

        // 先把参数全查一遍，再动手 new。 顺序反过来的话，
        // 在第 k 个权重上发现非法值时前 k-1 个结点已经建好了，
        // 抛出去就全漏了——LeakSanitizer 会当场把它报出来（作者第一版正是如此）。
        for (std::size_t i = 0; i < count; ++i) {
            if (weights[i] < 0) {
                throw std::invalid_argument("HuffmanTree: 权重不能为负");
            }
        }
        // ...`, 0.5, 1.02, 6.4, 3.0, { fontSize: 8.4 });
  consoleBlock(s, "==2738715==ERROR: LeakSanitizer: detected memory leaks\nDirect leak of 24 byte(s) in 1 object(s) allocated from:\n    #1 HuffmanTree::HuffmanTree(int const*, unsigned long) teaching.hpp:180", 0.5, 4.12, 6.4, 0.98, 8);
  callout(s, "这不是纸上推演", "本书作者第一版正是**边检查边建**：在第 k 个权重上发现负数时，前 k−1 个结点已经 `new` 好了，一抛就全漏。LeakSanitizer 当场报了出来（左下）。", 7.1, 1.02, 2.4, 2.6, { fontSize: 10, fill: RED, tcolor: C.bad });
  callout(s, "只关心树形与 WPL", "另一个构造函数 `HuffmanTree(weights, count)` 委托给它，`symbols` 传 `nullptr`。", 7.1, 3.75, 2.4, 1.35, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// ctor p2 + wpl
{
  const s = content("5.6", "5.6 教学版 HuffmanTree（下）", "用 MinHeap 反复取两个最小的合并；WPL 递归计算");
  codeBlock(s, `        MinHeap<ByWeight> heap;
        for (std::size_t i = 0; i < count; ++i) {
            char symbol = (symbols == nullptr) ? '\\0' : symbols[i];
            heap.insert(ByWeight{new Node{weights[i], symbol, nullptr, nullptr}});  // 每个权重先做成一棵单结点树
        }

        while (heap.size() > 1) {
            Node* left = heap.remove_min()->node;      // 最小的
            Node* right = heap.remove_min()->node;     // 次小的
            Node* parent = new Node{left->weight + right->weight, '\\0', left, right};
            heap.insert(ByWeight{parent});
        }
        root_ = heap.remove_min()->node;
    }
    // ...
    static int wpl(const Node* node, int depth) {
        if (node == nullptr) return 0;
        if (node->left == nullptr && node->right == nullptr) {
            return node->weight * depth;      // 叶子
        }
        return wpl(node->left, depth + 1) + wpl(node->right, depth + 1);
    }`, 0.5, 1.02, 9.0, 3.1, { fontSize: 7.9, hl: [8, 9, 10] });
  card(s, 0.5, 4.22, 5.7, 0.9, C.dark);
  text(s, "权 2、3、4、7：2+3=5 → 4+5=9 → 7+9=16", 0.65, 4.27, 5.45, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "2、3 落在第 3 层，4 在第 2 层，7 在第 1 层：WPL = 2×3 + 3×3 + 4×2 + 7×1 = 30", 0.65, 4.6, 5.45, 0.45, { fontSize: 10, color: C.white, margin: 0 });
  callout(s, "ByWeight", "堆里放「一棵树的根指针」，按根的 `weight` 比较大小。", 6.4, 4.22, 3.1, 0.9, { fontSize: 9.5, tsize: 10.5, fill: C.mint, tcolor: C.dark, lsm: 1.05 });
}

// batched WPL concept + trace
{
  const s = content("5.6", "5.6 权值成批给出：只求 WPL", "「权 wᵢ 出现 cᵢ 次」，cᵢ 可到 10⁹：结点根本建不出来");
  card(s, 0.5, 1.02, 4.35, 1.85, C.code);
  numCircle(s, 1, 0.65, 1.12, 0.36, C.dark);
  text(s, "WPL = 所有内部结点的权之和", 1.1, 1.12, 3.7, 0.36, { fontSize: 12.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
  text(s, "深度为 d 的叶，它的权在 d 个祖先里各被算一次，合起来恰是「权 × 深度」。例：2、3、4、7 合并出 5、9、16，5 + 9 + 16 = **30** ✓", 0.7, 1.55, 4.05, 1.3, { fontSize: 10.5 });
  card(s, 5.15, 1.02, 4.35, 1.85, C.code);
  numCircle(s, 2, 5.3, 1.12, 0.36, C.dark);
  text(s, "同权的树可以整批合并", 5.75, 1.12, 3.7, 0.36, { fontSize: 12.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
  text(s, "最小权 w 有 c 棵：一步得 c/2（下取整）棵权为 2w 的树，WPL 加上 2w × 棵数。**c 为奇数时余下一棵 w**，要留在堆里和下一小的合并——漏了结果就偏小。", 5.35, 1.55, 4.05, 1.3, { fontSize: 10.5 });
  table(s, [
    ["轮", "取出的组 (权, 棵数)", "动作", "WPL", "堆里剩下"],
    ["1", "(1, 5)", "2 对 → 2 棵权 2；余 1 棵权 1", "0 + 2×2 = 4", "(1,1) (2,2)"],
    ["2", "(1, 1)", "只有 1 棵：和下一小的 (2,…) 合并成 3", "4 + 3 = 7", "(2,1) (3,1)"],
    ["3", "(2, 1)", "和 (3,1) 合并成 5", "7 + 5 = 12", "(5,1)"],
    ["4", "(5, 1)", "堆里没有下一棵：它就是根", { t: "12", bold: true, color: C.ok }, "—"],
  ], 0.5, 3.0, 9.0, [0.45, 1.75, 3.5, 1.45, 1.85], { fontSize: 9.5, rowH: 0.33 });
  text(s, "例：5 个权为 1 的叶。逐个建树核对：1+1=2，1+1=2，1+2=3，2+3=5，2+2+3+5 = 12 ✓；闭式 n⌊log₂n⌋ + 2(n − 2^⌊log₂n⌋) = 10 + 2 = 12 ✓", 0.5, 4.72, 9.0, 0.4, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// prefix codes
{
  const s = content("5.6", "5.6.2 Huffman 编码", "问题从哪来：变长编码必须是前缀码");
  text(s, "要传电文 `abbaaadc`（a×4、b×2、c×1、d×1）", 0.5, 1.02, 9, 0.35, { fontSize: 13, bold: true, color: C.dark });
  const opts = [
    ["定长", "a=00  b=01  c=10  d=11", "16 位", "能译码，但不短", C.text, C.code],
    ["变长（非前缀）", "a=0  b=1  c=01  d=10", "10 位", "收到 011：a b b？还是 c b？", C.bad, RED],
    ["Huffman（前缀码）", "a=0  b=10  c=110  d=111", "14 位", "唯一可译，比定长短", C.ok, "EAF4EF"],
  ];
  opts.forEach((o, i) => {
    const y = 1.5 + i * 0.78;
    card(s, 0.5, y, 9.0, 0.66, o[5]);
    text(s, o[0], 0.65, y, 1.9, 0.66, { fontSize: 12, bold: true, color: o[4], valign: "middle", margin: 0 });
    text(s, o[1], 2.6, y, 3.0, 0.66, { fontSize: 11.5, fontFace: MONO, valign: "middle", margin: 0 });
    text(s, o[2], 5.65, y, 0.9, 0.66, { fontSize: 14, bold: true, color: o[4], valign: "middle", margin: 0 });
    text(s, o[3], 6.6, y, 2.85, 0.66, { fontSize: 11, valign: "middle", margin: 0 });
  });
  callout(s, "症结是「前缀」", "`0` 是 `01` 的前缀，读到 `0` 时无法判断该停还是再读一位。**前缀码**：任何字符的编码都不是另一个字符编码的前缀。", 0.5, 3.95, 4.35, 1.15, { fontSize: 10.5 });
  callout(s, "Huffman 树天然给出前缀码", "左边标 0、右边标 1，根到叶的 0/1 串就是编码。**字符只住在叶子上**，一个叶子不可能在另一个叶子的路径上。", 5.15, 3.95, 4.35, 1.15, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// fig 5.20
{
  const s = content("5.6", "5.6.2 Huffman 编码 · 示例", "左 0 右 1：从根到叶一路读下来就是编码");
  card(s, 0.5, 1.02, 3.6, 4.08, C.code);
  image(s, "fig-5-20", 0.65, 1.1, 3.3, 3.65);
  text(s, "图 5.20　Huffman 编码示例", 0.5, 4.78, 3.6, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  table(s, [
    ["字符", "权", "编码", "码长"],
    ["a", "15", { t: "00", mono: true, bold: true }, "2"],
    ["g", "18", { t: "01", mono: true, bold: true }, "2"],
    ["e", "20", { t: "10", mono: true, bold: true }, "2"],
    ["f", "10", { t: "110", mono: true, bold: true }, "3"],
    ["c", "6", { t: "1110", mono: true, bold: true }, "4"],
    ["b", "2", { t: "11110", mono: true, bold: true }, "5"],
    ["d", "5", { t: "11111", mono: true, bold: true }, "5"],
  ], 4.35, 1.02, 2.9, [0.6, 0.6, 1.0, 0.7], { fontSize: 10.5, rowH: 0.36, align: "center" });
  card(s, 7.45, 1.02, 2.05, 2.9, C.dark);
  text(s, "按图读出", 7.6, 1.1, 1.8, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "权大的 a、g、e 离根近、码短；权小的 b、d 码长 5。\n\n没有一个编码是另一个的前缀。", 7.6, 1.45, 1.8, 2.4, { fontSize: 10, color: C.white, margin: 0 });
  callout(s, "两种算法核对 WPL", P("按深度：15×2+18×2+20×2+10×3+6×4+2×5+5×5 = **195**\n按内部结点权：76+33+43+23+13+7 = **195** ✓"), 4.35, 4.05, 5.15, 1.05, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// encode length = WPL
{
  const s = content("5.6", "5.6.2 Huffman 编码 · 编码总长", "abbaaadc：编码总长恰好等于 WPL");
  table(s, [
    ["字符", "频率", "编码", "位数", "小计"],
    ["a", "4", { t: "0", mono: true, bold: true }, "1", "4"],
    ["b", "2", { t: "10", mono: true, bold: true }, "2", "4"],
    ["c", "1", { t: "110", mono: true, bold: true }, "3", "3"],
    ["d", "1", { t: "111", mono: true, bold: true }, "3", "3"],
    [{ t: "合计", bold: true }, "8", "", "", { t: "14", bold: true, color: C.ok }],
  ], 0.5, 1.02, 4.6, [0.8, 0.8, 1.1, 0.8, 1.1], { fontSize: 11, rowH: 0.38, align: "center" });
  text(s, "编码结果：", 0.5, 3.45, 1.5, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  const bits = ["0", "10", "10", "0", "0", "0", "111", "110"];
  const chars = ["a", "b", "b", "a", "a", "a", "d", "c"];
  let bx = 0.5;
  bits.forEach((b, i) => {
    const w = 0.18 + b.length * 0.15;
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 3.8, w, h: 0.38, fill: { color: i % 2 ? C.mint : "E3EEE9" }, line: { color: C.green, width: 0.8 } });
    text(s, b, bx, 3.8, w, 0.38, { fontSize: 11, bold: true, align: "center", valign: "middle", margin: 0, color: C.dark });
    text(s, chars[i], bx, 4.2, w, 0.22, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
    bx += w;
  });
  text(s, "01010000111110：14 位，比定长的 16 位短", 0.5, 4.5, 4.6, 0.55, { fontSize: 11, bold: true, color: C.ok, margin: 0 });
  callout(s, "14 = 这棵树的 WPL，不是巧合", "WPL = Σ（权 × 深度），权就是出现次数、深度就是码长——两者算的是同一个和。「Huffman 树让 WPL 最小」翻译过来就是：**它让这段电文的编码总长最短**。", 5.35, 1.02, 4.15, 1.9, { fontSize: 10.5 });
  callout(s, "反直觉：等频率一位都省不下", "8 个等权字符建出平衡树，每个字符恰好 3 位——退化成定长编码。压缩的收益**完全来自频率的不均匀**。教学版测试把这条写成了断言。", 5.35, 3.05, 4.15, 1.6, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  text(s, "（压缩文件还要把码表写进输出、处理最后不足一字节的几位——原书上机题。）", 5.35, 4.72, 4.15, 0.4, { fontSize: 9, color: C.muted, margin: 0 });
}

// decode
{
  const s = content("5.6", "5.6.2 Huffman 译码 · 教学版 decode", "用同一棵树：读 0 走左、读 1 走右，到叶子吐一个字符");
  codeBlock(s, `        std::string text;
        const Node* current = root_;
        for (char b : bits) {
            if (b == '0') {
                current = current->left;
            } else if (b == '1') {
                current = current->right;
            } else {
                return std::nullopt;          // 既不是 0 也不是 1
            }
            if (current == nullptr) {
                return std::nullopt;
            }
            if (current->left == nullptr && current->right == nullptr) {
                text.push_back(current->symbol);
                current = root_;              // 吐出一个字符，回到根
            }
        }
        if (current != root_) {
            return std::nullopt;              // 走到一半就没比特了：串不完整
        }
        return text;
    }`, 0.5, 1.02, 5.6, 4.08, { fontSize: 8.8, hl: [16, 20] });
  text(s, "三处边界，测试各有一条用例守着：", 6.35, 1.02, 3.15, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  const bs = [
    ["串走到一半就没了", "传丢了最后一位 → 返回空 optional，不吐半个字符。"],
    ["出现非 0/1 字符", "同样返回空 optional。"],
    ["整棵树只有一个字符", "根到叶的路径是空串，没法传。约定给它一位 \"0\"；译码时每个 0 都译成它。"],
  ];
  bs.forEach((b, i) => {
    const y = 1.42 + i * 1.02;
    card(s, 6.35, y, 3.15, 0.92, C.code);
    numCircle(s, i + 1, 6.45, y + 0.1, 0.3, i === 2 ? C.goldText : C.bad);
    text(s, b[0], 6.85, y + 0.08, 2.6, 0.32, { fontSize: 11, bold: true, color: C.dark, margin: 0, valign: "middle" });
    text(s, b[1], 6.5, y + 0.42, 2.95, 0.48, { fontSize: 9.5, margin: 0 });
  });
  text(s, "前缀码保证这个过程没有歧义。", 6.35, 4.55, 3.15, 0.5, { fontSize: 11, bold: true, color: C.goldText, margin: 0 });
}

// ============================ PART 7 ============================
sectionSlide("Part 7 · 5.6a", "进阶（选读）", "从教学版到工程版：迭代释放（右旋拉直）\n显式栈深拷贝 · 非递归周游");

// iterative destroy
{
  const s = content("5.6a", "5.6a 进阶 · 工程版 binary_tree/modern.hpp", "释放：右旋到没有左孩子，再沿右链逐个删");
  codeBlock(s, `static void destroy(Node* node) noexcept {
    while (node != nullptr) {
        if (node->left != nullptr) {
            Node* const left = node->left;   // 右旋：左孩子成为新的根
            node->left = left->right;
            left->right = node;
            node = left;
        } else {
            Node* const right = node->right;
            delete node;
            node = right;
        }
    }
}`, 0.5, 1.02, 5.5, 2.7, { fontSize: 9, hl: [5, 6, 7] });
  callout(s, "为什么这么写", [
    "每次旋转把左子树提上来，树被逐步**拉直成一条右链**，然后一个一个删。",
    "总代价 O(n)，额外空间 **O(1)**；不分配内存 → 能保持 `noexcept`。",
  ], 0.5, 3.85, 5.5, 1.25, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  card(s, 6.2, 1.02, 3.3, 4.08, C.code);
  text(s, "一次右旋", 6.35, 1.1, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  drawTree(s, { n: ["n", 7.15, 1.75, HL], l: ["l", 6.75, 2.35], x: ["x", 6.5, 2.95], y: ["y", 7.0, 2.95], r: ["r", 7.55, 2.35] },
    [["n", "l"], ["n", "r"], ["l", "x"], ["l", "y"]], { r: 0.16, fs: 10 });
  s.addShape(pres.shapes.LINE, { x: 7.8, y: 2.35, w: 0.3, h: 0, line: { color: C.bad, width: 2, endArrowType: "triangle" } });
  drawTree(s, { l: ["l", 8.6, 1.75], x: ["x", 8.3, 2.35], n: ["n", 9.0, 2.35, HL], y: ["y", 8.7, 2.95], r: ["r", 9.28, 2.95] },
    [["l", "x"], ["l", "n"], ["n", "y"], ["n", "r"]], { r: 0.16, fs: 10 });
  text(s, "l 的右子树 y 改挂到 n 的左边；l 成为新的根。左边每转一次少一个结点，右链多一个。", 6.35, 3.3, 3.05, 0.95, { fontSize: 10, margin: 0 });
  text(s, "实测：纯左链 100 万结点，递归 destroy 段错误；迭代版 500 万也不崩。", 6.35, 4.3, 3.05, 0.75, { fontSize: 10, bold: true, color: C.bad, margin: 0 });
}

// iterative clone
{
  const s = content("5.6a", "5.6a 进阶 · 工程版 binary_tree/modern.hpp", "深拷贝：显式栈代替调用栈，强异常保证");
  codeBlock(s, `    static Node* clone(const Node* node) {
        if (node == nullptr) {
            return nullptr;
        }
        Node* copy_root = new Node(node->value);
        try {
            // 用本章自己那把手写链式栈，与迭代周游同一套零件。
            LinkedStack<std::pair<const Node*, Node*>> pending;
            pending.push({node, copy_root});
            while (auto item = pending.pop()) {
                const Node* const source = item->first;
                Node* const target = item->second;
                if (source->left != nullptr) {
                    target->left = new Node(source->left->value);
                    pending.push({source->left, target->left});
                }
                if (source->right != nullptr) {
                    target->right = new Node(source->right->value);
                    pending.push({source->right, target->right});
                }
            }
        } catch (...) {
            destroy(copy_root);
            throw;
        }
        return copy_root;
    }`, 0.5, 1.02, 6.1, 4.08, { fontSize: 8.4, hl: [23, 24] });
  callout(s, "栈里放「一对」", "(源结点, 它的副本)：弹出一对，就给副本接上两个孩子的副本，再把孩子那一对压回去。结点放在堆上，深度不再受线程栈限制。", 6.85, 1.02, 2.65, 1.9, { fontSize: 10 });
  callout(s, "强异常保证", "中途 `new` 抛异常：`destroy(copy_root)` 回收已建好的部分，再原样抛出——调用方看到的要么是完整副本，要么什么都没发生。", 6.85, 3.05, 2.65, 2.05, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// iterative traversals
{
  const s = content("5.6a", "5.6a 进阶 · 非递归周游【算法5.4–5.6】", "手写栈显式模拟调用栈：只作补充，不替换递归主实现");
  codeBlock(s, `template <typename Visitor>
void preorder_iterative(Visitor&& visit) const {
    LinkedStack<const Node*> pending;
    if (root_ != nullptr) pending.push(root_);
    while (auto node = pending.pop()) {
        visit((*node)->value);
        if ((*node)->right != nullptr) pending.push((*node)->right);
        if ((*node)->left != nullptr) pending.push((*node)->left);
    }
}
template <typename Visitor>
void inorder_iterative(Visitor&& visit) const {
    LinkedStack<const Node*> pending;
    const Node* current = root_;
    while (current != nullptr || !pending.empty()) {
        while (current != nullptr) {
            pending.push(current);
            current = current->left;
        }
        current = *pending.pop();
        visit(current->value);
        current = current->right;
    }
}`, 0.5, 1.02, 5.2, 4.08, { fontSize: 8.4, hl: [7, 8] });
  text(s, "中序迭代版走一遍 A(B(D, E), C)", 5.95, 1.02, 3.55, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["步", "动作", "栈（底→顶）", "输出"],
    ["1", "沿左链压 A、B、D", { t: "A B D", mono: true }, ""],
    ["2", "弹 D 访问；转 D 的右（空）", { t: "A B", mono: true }, "D"],
    ["3", "弹 B 访问；转 E", { t: "A", mono: true }, "DB"],
    ["4", "压 E（无左孩子）", { t: "A E", mono: true }, ""],
    ["5", "弹 E 访问；转空", { t: "A", mono: true }, "DBE"],
    ["6", "弹 A 访问；转 C", "空", "DBEA"],
    ["7", "压 C", { t: "C", mono: true }, ""],
    ["8", "弹 C 访问；栈空，结束", "空", { t: "DBEAC", bold: true, color: C.ok }],
  ], 5.95, 1.38, 3.55, [0.35, 1.75, 0.8, 0.65], { fontSize: 8.5, rowH: 0.33, tight: true });
  text(s, "前序版：先压右再压左，左孩子才会先出栈。后序版给每帧加一个 expanded 标志。", 5.95, 4.55, 3.55, 0.55, { fontSize: 9.5, color: C.goldText, bold: true, margin: 0 });
}

// exercises
{
  const s = content("✎", "课后练习（节选）", "几道代表性习题");
  const ex = [
    ["周游", "先序 ABCDEFG、中序 CBDAFEG，画出这棵树并写出后序。「先序 + 后序总能唯一确定二叉树」是否成立？给出最小反例。"],
    ["性质", "证明：n 个结点的二叉树空指针域个数是 n + 1；完全二叉树按层编号，证明父 / 左孩子 / 右孩子公式。"],
    ["BST", "依次插入 50, 30, 70, 20, 40, 60, 80，画出结果；再删除 50。编写 `IsBST`：判断一棵二叉树是否为 BST。"],
    ["堆", "{E, D, X, K, H, L, M, C, P} 用筛选法建最小堆，写出序列；设计 O(n) 算法检查数组是否为大顶堆。"],
    ["Huffman", "对权 2, 3, 4, 7, 8 构造 Huffman 树，计算 WPL 并给出一组前缀编码。"],
  ];
  ex.forEach((e, i) => {
    const y = 1.05 + i * 0.81;
    card(s, 0.5, y, 9.0, 0.7, i % 2 ? C.white : C.code, i % 2 ? "D5DDD9" : null);
    pill(s, e[0], 0.65, y + 0.17, 1.15, 0.36, C.dark, C.gold, 10.5);
    text(s, e[1], 2.0, y, 7.4, 0.7, { fontSize: 11, valign: "middle", margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["递归定义", "二叉树**左右有别**；定义是递归的，周游、释放、深拷贝都自然是递归。n 个结点有 **n+1 个空指针**。"],
    ["四种周游", "三种深度优先只差 `visit` 那一行（栈）；层次周游必须用**队列**。前/后序 + 中序可重建。"],
    ["两种存储", "二叉链表最常用；**完全**二叉树按层编号进数组，父子关系变下标算术。"],
    ["BST 与堆", "BST 全序、增删查 O(h)，两个孩子时用**中序前驱**顶替；堆只要局部有序，**建堆 O(n)**。"],
    ["Huffman", "反复合并两个最小权，WPL 最小；左 0 右 1 得**前缀码**，编码总长 = WPL。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
