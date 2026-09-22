// 第12章 高级数据结构 —— 由 dsa-modernization/book/ch12-advanced.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch12_advanced.js ../202609_DSA_12_Advanced.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_12_Advanced.pptx");

// 讲义中引用的图片（name → 本地绝对路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const FIGS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "36-ab", "36-cde", "37",
  "38", "39", "40", "41", "42", "43", "44", "45",
];
const IMAGES = Object.fromEntries(FIGS.map((n) => [`fig-12-${n}`, `${SCAN}/fig-12-${n}.png`]));

(async () => {
  const D = createDeck({ title: "DSA 第12章 高级数据结构", imgDir: path.join(__dirname, "..", ".cache", "ch12") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  // 图卡：浅底卡片 + 图 + 图注
  const figBox = (s, name, x, y, w, h, cap, capSize = 9.5) => {
    card(s, x, y, w, h, C.code);
    const capH = cap ? 0.32 : 0;
    image(s, name, x + 0.1, y + 0.1, w - 0.2, h - 0.2 - capH);
    if (cap) text(s, cap, x + 0.05, y + h - 0.36, w - 0.1, 0.3, { fontSize: capSize, color: C.muted, align: "center", margin: 0 });
  };
  // 画树用：圆结点与连线
  const tnode = (s, label, cx, cy, d = 0.4, fill = C.mint, color = C.dark, fs = 11) => {
    s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: fill }, line: { color: C.green, width: 1 } });
    text(s, label, cx - d / 2, cy - d / 2, d, d, { fontSize: fs, bold: true, color, align: "center", valign: "middle", margin: 0 });
  };
  const edge = (s, x1, y1, x2, y2, color = C.green, arrow = false) => {
    s.addShape(pres.shapes.LINE, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width: 1.5, endArrowType: arrow ? "triangle" : undefined } });
  };

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第12章  高级数据结构",
  subtitle: "把「存储、查找、回收」推到更复杂的对象上",
  topics: "多维数组的地址公式 · 三角 / 对称矩阵压缩 · 稀疏矩阵十字链表\n广义表与共享 · 引用计数 · 可利用空间表 · 三种顺序适配 · 标记–清除\nTrie 与 Patricia：按字符 / 按位分支，公共前缀只存一次\n最佳 BST 的动态规划 · AVL 四种旋转 · 伸展树的均摊平衡",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "每一节都追问三个问题");
  const qs = [
    ["一个逻辑对象落在哪些物理位置？", "多维下标换算成**一个线性地址**；一个非零元同时挂在**行链和列链**上；一个子表可以被**多处共享**。"],
    ["一次更新要同时维护哪些不变量？", "十字链表的**两条链**、Trie 的 `passing` 计数、AVL 的**平衡因子**——旋转前后**中序次序不变**。"],
    ["结构失效或空间不足时怎样收尾？", "句柄池耗尽返回 `nullopt`；变长块要**分裂与合并**；引用计数收不回环，**标记–清除**按可达性回收。"],
  ];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.55, C.code);
    numCircle(s, i + 1, x + 0.2, 1.32, 0.46, C.dark);
    text(s, q[0], x + 0.2, 1.92, 2.5, 0.7, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], x + 0.2, 2.65, 2.5, 0.95, { fontSize: 11, margin: 0, lsm: 1.15 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "一句话概括", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText([
    { text: "读这一章不要只记结构名称：每种结构都要回答", options: { color: C.white } },
    { text: "落在哪、维护什么、怎样收尾", options: { color: C.gold, bold: true } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图：四条独立的线");
  const cols = [
    ["12.1 多维数组", ["多维数组的存储：行优先 / 列优先", "特殊矩阵：三角、对称", "稀疏矩阵：三元组、十字链表"], "sparse_matrix"],
    ["12.2 广义表与存储管理", ["广义表：纯表 / 再入表 / 循环表", "共享与引用计数", "可利用空间表（句柄池）", "变长块：三种适配、合并", "无用单元回收：标记–清除"], "gen_list · optimal_bst\nmemory_allocator\nstorage_recovery"],
    ["12.3 Trie 与 Patricia", ["对象空间 vs 关键码空间", "二叉 Trie、字母 Trie", "最长前缀匹配", "Patricia：按位分支、压缩单孩子结点"], "trie"],
    ["12.4 改进的 BST", ["最佳 BST：扩充二叉树、动态规划", "AVL：平衡因子、四种旋转、高度上界", "伸展树：一字形 / 之字形、半伸展"], "optimal_bst\nbalanced_trees"],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.15, 2.1, 3.9, i % 2 === 0 ? C.cream : C.code);
    text(s, c[0], x + 0.15, 1.28, 1.85, 0.6, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.1, 1.95, 1.95, 2.3, { fontSize: 10.5, gap: 6 });
    text(s, "代码：code/ch12/\n" + c[2], x + 0.15, 4.25, 1.85, 0.75, { fontSize: 8.5, color: C.muted, margin: 0, lsm: 1.1 });
  });
}

// 4. Run first: gen_list
{
  const s = content("▶", "先跑一遍 · 1 / 3", "广义表：头尾分解、三个指标、共享子表");
  codeBlock(s, `#include "modern.hpp"

#include <cstdio>

int main() {
    using dsa::advanced::GenList;
    const GenList list = GenList::parse("(a,(b,c),d)");
    std::printf("表      : %s\\n", list.to_string().c_str());
    std::printf("表头    : %s\\n", list.head()->to_string().c_str());
    std::printf("表尾    : %s\\n", list.tail()->to_string().c_str());
    std::printf("长度 %zu，深度 %zu，原子 %zu 个\\n",
                list.length(), list.depth(), list.atom_count());

    // 再入表：同一个子表挂到两处，靠引用计数而不是拷贝。
    const GenList shared = GenList::parse("(b,c)");
    const GenList host = GenList::cons(shared, GenList::cons(shared, GenList()));
    std::printf("共享后  : %s，被引用 %zu 次\\n", host.to_string().c_str(), shared.use_count());
    return 0;
}`, 0.5, 1.02, 9.0, 2.98, { fontSize: 8 });
  consoleBlock(s, "表      : (a,(b,c),d)\n表头    : a\n表尾    : ((b,c),d)\n长度 3，深度 2，原子 4 个\n共享后  : ((b,c),(b,c))，被引用 3 次", 0.5, 4.08, 3.6, 1.07, 8);
  callout(s, "看到了什么", "表尾仍是**一个表** `((b,c),d)`；长度、深度、原子数是**三个不同的问题**。`(b,c)` 只有**一份**、挂在两处，计数 3：自己一份，两个宿主各一份。", 4.3, 4.08, 5.2, 1.07, { fontSize: 10, tsize: 11, lsm: 1.05 });
}

// 5. Run first: pool + optimal BST
{
  const s = content("▶", "先跑一遍 · 2 / 3", "句柄池复用槽位；最优 BST 算出总成本与根");
  codeBlock(s, `#include "modern.hpp"

#include <iostream>

int main() {
    dsa::advanced::ReusableNodePool<int> pool(2);
    const auto first = pool.acquire(11);
    const auto second = pool.acquire(22);
    std::cout << "申请到槽 " << *first << " 和 " << *second
              << "，剩余 " << pool.available() << '\\n';
    pool.release(*first);
    const auto reused = pool.acquire(44);
    std::cout << "归还后再申请得到槽 " << *reused
              << "，值为 " << *pool.get(*reused) << '\\n';

    const auto tree = dsa::advanced::optimal_bst({1, 5, 4, 3}, {5, 4, 3, 2, 1});
    std::cout << "最优 BST 总成本 " << tree.cost[0][4]
              << "，根为键 " << tree.root[0][4] << '\\n';
}`, 0.5, 1.05, 6.0, 3.45, { fontSize: 8.5 });
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch12/optimal_bst \\\n    code/ch12/optimal_bst/demo.cpp -o /tmp/bst-demo", 0.5, 4.6, 6.0, 0.5, { fontSize: 8.5, color: C.muted });
  consoleBlock(s, "申请到槽 0 和 1，剩余 0\n归还后再申请得到槽 0，值为 44\n最优 BST 总成本 57，根为键 2", 6.7, 1.05, 2.8, 1.35, 9.5);
  callout(s, "看到了什么", [
    "归还的槽 0 **马上被复用**：可利用空间表就是一个空闲栈。",
    "教材样例 `p = {1,5,4,3}`、`q = {5,4,3,2,1}`：总成本 **57**，根是**第 2 个键**。",
    "长度对不上的输入（如 `optimal_bst({1,2}, {3,4})`）抛 `std::invalid_argument`。",
  ], 6.7, 2.55, 2.8, 2.55, { fontSize: 10.5 });
}

// 6. Run first: trie
{
  const s = content("▶", "先跑一遍 · 3 / 3", "Trie 与 Patricia：结点数是程序报的，不是数出来的");
  codeBlock(s, `#include "modern.hpp"

#include <cstdio>

int main() {
    dsa::advanced::Trie trie;
    dsa::advanced::PatriciaTree patricia;
    for (const char* word : {"can", "car", "cat", "do"}) {
        trie.insert(word);
        patricia.insert(word);
    }
    std::printf("Trie     : %zu 个词，%zu 个结点（字符总数 11）\\n",
                trie.size(), trie.node_count());
    std::printf("Patricia : %zu 个词，%zu 个内部结点\\n",
                patricia.size(), patricia.internal_count());
    std::printf("前缀 ca 下有 %zu 个词：", trie.count_with_prefix("ca"));
    for (const auto& word : trie.keys_with_prefix("ca")) {
        std::printf("%s ", word.c_str());
    }
    std::printf("\\n最长前缀匹配 dozen -> %s（走不动就回退到最近词尾）\\n",
                trie.longest_prefix_of("dozen").c_str());
    return 0;
}`, 0.5, 1.05, 5.6, 4.05, { fontSize: 8.5 });
  consoleBlock(s, "Trie     : 4 个词，7 个结点（字符总数 11）\nPatricia : 4 个词，3 个内部结点\n前缀 ca 下有 3 个词：can car cat\n最长前缀匹配 dozen -> do（走不动就回退到最近词尾）", 6.3, 1.05, 3.2, 1.95, 8.5);
  callout(s, "看到了什么", [
    "11 个字符只要 **7 个结点**：`ca` 只存了一次——前缀共享的全部价值。",
    "Patricia 把单孩子结点压掉，只剩 **3 个内部结点**。",
    "`dozen` 走到 `do` 之后走不动，回退到最近的词尾。",
  ], 6.3, 3.15, 3.2, 1.95, { fontSize: 10.5 });
}

// ============================ PART 1 ============================
sectionSlide("12.1", "多维数组", "多个下标 → 一个线性地址\n行优先 / 列优先 · 三角与对称矩阵压缩 · 稀疏矩阵十字链表");

// 12.1.1 storage
{
  const s = content("12.1", "12.1.1 多维数组的存储", "多维数组：按某种周游次序排成一条线");
  bullets(s, [
    "数组的数组就是二维，二维数组再排成一列就是三维。",
    "同一数组里元素类型相同；个数相对固定，生成后通常**只改值、不改相对位置和个数** → 自然采用**顺序存储**。",
    "`a[i][j]` 同时属于第 i 行和第 j 列，最多两个前驱、两个后继；推到 k 维，每个元素属于 k 个向量。",
  ], 0.5, 1.05, 4.6, 2.3, { fontSize: 12, gap: 8 });
  // row-major picture
  card(s, 5.35, 1.1, 4.15, 2.2, C.code);
  text(s, "行优先（C++、Pascal）：先排最右的下标", 5.5, 1.18, 3.9, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  cells(s, 5.55, 1.6, ["a00", "a01", "a02"], { cw: 0.55, ch: 0.38, fs: 10 });
  cells(s, 5.55, 1.98, ["a10", "a11", "a12"], { cw: 0.55, ch: 0.38, fs: 10, fills: ["CDEBD9", "CDEBD9", "CDEBD9"] });
  s.addShape(pres.shapes.LINE, { x: 7.3, y: 1.98, w: 0.45, h: 0, line: { color: C.goldText, width: 1.5, endArrowType: "triangle" } });
  cells(s, 5.55, 2.62, ["a00", "a01", "a02", "a10", "a11", "a12"], { cw: 0.55, ch: 0.38, fs: 10, fills: [null, null, null, "CDEBD9", "CDEBD9", "CDEBD9"], idx: true });
  text(s, "列优先（FORTRAN）：先排最左下标，公式左右对调", 5.5, 3.37, 4.0, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  card(s, 0.5, 3.75, 9.0, 0.75, C.dark);
  text(s, "d₀ × d₁ × ⋯ × dₙ₋₁ 数组中 A[j₀, …, jₙ₋₁] 的偏移", 0.7, 3.8, 4.2, 0.65, { fontSize: 11.5, color: C.mint, valign: "middle", margin: 0 });
  text(s, "d · ( Σᵢ₌₀ⁿ⁻² jᵢ · Πₖ₌ᵢ₊₁ⁿ⁻¹ dₖ  +  jₙ₋₁ )", 4.9, 3.8, 4.5, 0.65, { fontSize: 17, bold: true, color: C.gold, valign: "middle", margin: 0 });
  text(s, "d 是一个元素所占单元数。每个元素的定位时间相同 → **随机存储结构**。定位前仍要逐维检查 `0 <= j_i < d_i`——**公式本身不会替程序发现越界**。", 0.5, 4.6, 9.0, 0.5, { fontSize: 11.5 });
}

// 12.1.1 example
{
  const s = content("12.1", "12.1.1 多维数组的存储 · 例", "int A[2][3][4]：A[1][2][3] 在哪？");
  text(s, "不必真把 24 个元素列出来：最右一维每跨一步跳 1 个，中间一维跳 4 个，最左一维跳 3 × 4 = 12 个。", 0.5, 1.02, 9, 0.35, { fontSize: 12.5 });
  table(s, [
    ["维", "下标", "后续维大小的乘积", "贡献"],
    [{ t: "0", align: "center" }, { t: "1", align: "center" }, { t: "3 × 4 = 12", align: "center" }, { t: "12", align: "center" }],
    [{ t: "1", align: "center" }, { t: "2", align: "center" }, { t: "4", align: "center" }, { t: "8", align: "center" }],
    [{ t: "2", align: "center" }, { t: "3", align: "center" }, { t: "1", align: "center" }, { t: "3", align: "center" }],
    [{ t: "合计", bold: true, align: "center" }, "", "", { t: "**23 个元素**", align: "center" }],
  ], 0.5, 1.5, 4.9, [0.7, 0.8, 2.0, 1.4], { fontSize: 12, rowH: 0.42 });
  card(s, 0.5, 3.8, 4.9, 1.3, C.code);
  text(s, "若 int 占 4 字节，字节偏移是 **92**。从左往右用霍纳法：", 0.65, 3.88, 4.6, 0.35, { fontSize: 11.5, margin: 0 });
  text(s, "((1 * 3 + 2) * 4 + 3) * 4 = 92", 0.65, 4.25, 4.6, 0.4, { fontSize: 15, bold: true, color: C.green, margin: 0 });
  text(s, "一边读下标一边累乘，不必预存每一维的跨度。", 0.65, 4.68, 4.6, 0.35, { fontSize: 10.5, color: C.muted, margin: 0 });
  callout(s, "测试布局：选能区分规则的下标", [
    "列优先把**最左下标**当作变化最快的一维：`[1,2,3]` → 1 + 2×2 + 3×(2×3) = **23**。",
    "这个角落碰巧仍是 23——拿它测，两种布局**都能通过**，什么也没检出来。",
    "换成 `[1,0,0]`：行优先 **12**，列优先 **1**。",
  ], 5.65, 1.5, 3.85, 3.6, { fontSize: 11.5, gap: 8 });
}

// 12.1.2 special matrices
{
  const s = content("12.1", "12.1.2 特殊矩阵", "三角矩阵与对称矩阵：只存有用的一半");
  figBox(s, "fig-12-1", 0.5, 1.05, 4.6, 2.0, "图 12.1  上三角矩阵和下三角矩阵");
  bullets(s, [
    "**三角矩阵**：对角线一侧全是 0 或常数 c，只存另一侧加那个常数，共 **(n² + n) / 2** 个单元。",
    "下三角 `a[i][j]`（i ≥ j）前面有 i 行、共 (i² + i)/2 个元素，再加本行的 j。",
    "**对称矩阵**：`a[i][j] = a[j][i]`，只存下三角（含对角线），另一半用对称关系映射。",
  ], 5.35, 1.05, 4.15, 2.6, { fontSize: 12, gap: 8 });
  card(s, 0.5, 3.3, 9.0, 1.8, C.dark);
  text(s, "一维数组 list[0 .. (n²+n)/2 − 1] 的下标", 0.75, 3.4, 6, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "下三角 / 对称矩阵，i ≥ j：", 0.75, 3.85, 3.2, 0.45, { fontSize: 13, color: C.mint, valign: "middle", margin: 0 });
  text(s, "(i² + i) / 2 + j", 4.0, 3.85, 5, 0.45, { fontSize: 20, bold: true, color: C.white, valign: "middle", margin: 0 });
  text(s, "对称矩阵，i < j：", 0.75, 4.4, 3.2, 0.45, { fontSize: 13, color: C.mint, valign: "middle", margin: 0 });
  text(s, "(j² + j) / 2 + i", 4.0, 4.4, 5, 0.45, { fontSize: 20, bold: true, color: C.white, valign: "middle", margin: 0 });
}

// 12.1.2 example: 4x4 lower triangular
{
  const s = content("12.1", "12.1.2 特殊矩阵 · 例", "4 阶下三角按行压缩：a₃,₁ 落在哪？");
  // matrix
  text(s, "4 阶下三角（格内是压缩后的下标）", 0.5, 1.05, 4.2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const rowFill = ["F9E3B0", "CDEBD9", "D6E4F0", "EBD9EF"];
  let k = 0;
  for (let i = 0; i < 4; i++) {
    const vals = [], fills = [];
    for (let j = 0; j < 4; j++) {
      if (j <= i) { vals.push(String(k++)); fills.push(i === 3 && j === 1 ? "F4B9B0" : rowFill[i]); } else { vals.push(""); fills.push(C.white); }
    }
    cells(s, 1.0, 1.5 + i * 0.5, vals, { cw: 0.6, ch: 0.5, fs: 13, fills });
    text(s, "i=" + i, 0.45, 1.5 + i * 0.5, 0.55, 0.5, { fontSize: 10, color: C.muted, valign: "middle", margin: 0 });
  }
  ["j=0", "j=1", "j=2", "j=3"].forEach((t, j) => text(s, t, 1.0 + j * 0.6, 3.52, 0.6, 0.25, { fontSize: 10, color: C.muted, align: "center", margin: 0 }));
  // 1D
  text(s, "压缩后的一维数组：各行区间 [0]、[1..2]、[3..5]、[6..9]", 0.5, 3.95, 5.5, 0.3, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
  const f1 = [rowFill[0], rowFill[1], rowFill[1], rowFill[2], rowFill[2], rowFill[2], rowFill[3], "F4B9B0", rowFill[3], rowFill[3]];
  cells(s, 0.5, 4.35, ["a00", "a10", "a11", "a20", "a21", "a22", "a30", "a31", "a32", "a33"], { cw: 0.52, ch: 0.42, fs: 9.5, fills: f1, idx: true });
  callout(s, "a₃,₁ → 下标 7", [
    "第 3 行之前有 (9 + 3)/2 = **6** 个元素，再加本行 j = 1 → **6 + 1 = 7**。",
    "上三角位置 a₁,₃：若矩阵对称，先换成 a₃,₁，仍读下标 **7**。",
  ], 5.9, 1.05, 3.6, 2.3, { fontSize: 11.5, gap: 8 });
  callout(s, "核对口诀", "**先判断三角区域、再套公式**，比背两套公式容易核对。", 5.9, 3.5, 3.6, 1.05, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 12.1.3 sparse matrix concept
{
  const s = content("12.1", "12.1.3 稀疏矩阵", "非零元很少、分布又不规则：不要再分配整块二维数组");
  bullets(s, [
    "m × n 矩阵有 t 个非零元，**稀疏因子 δ = t / (mn)**；通常 δ < 0.05 就按稀疏处理。",
    "改存**三元组** `(行, 列, 值)` 的线性表，或用**十字链表**。",
    "十字链表：**每个非零元同时挂在一条行链和一条列链上**，按行、按列遍历都方便。",
  ], 0.5, 1.05, 4.7, 2.3, { fontSize: 12.5, gap: 9 });
  callout(s, "现代视角：COO / CSR / CSC", "十字链表（orthogonal list）适合需要**频繁按行、按列更新**的场合。现代数值计算更常用 COO（三元组）、CSR（压缩稀疏行）、CSC（压缩稀疏列）：连续存储、缓存局部性更好，但**动态插入通常要批量重建**。", 0.5, 3.4, 4.7, 1.7, { fontSize: 11 });
  figBox(s, "fig-12-2", 5.45, 1.05, 4.05, 4.05, "图 12.2  稀疏矩阵的十字链表");
}

// 12.1.3 cost table
{
  const s = content("12.1", "12.1.3 稀疏矩阵", "三种存法的代价");
  table(s, [
    ["", "整块二维数组", "三元组线性表", "十字链表"],
    [{ t: "存储量", bold: true }, "mn", "O(t)", "O(t)，每个元多一个指针"],
    [{ t: "取 a_ij", bold: true }, "O(1)", "O(log t)", { t: "O(该行非零元数)", color: C.bad }],
    [{ t: "按列扫一遍", bold: true }, "O(m)", "O(t)，要滤掉别的列", { t: "**O(该列非零元数)**", color: C.ok }],
    [{ t: "插入一个非零元", bold: true }, "O(1)", "O(t)，要挪动后面的项", { t: "**O(行内 + 列内定位)**", color: C.ok }],
  ], 0.5, 1.1, 9.0, [1.7, 2.0, 2.5, 2.8], { fontSize: 12.5, rowH: 0.5 });
  callout(s, "怎么读这张表", "「取 a_ij」那一行是十字链表**吃亏**的地方；「按列扫」「插入」才是它**存在的理由**。选数据结构不看它哪里最好，看它在**你的负载**上哪几行最重要。", 0.5, 3.8, 5.6, 1.3, { fontSize: 11.5 });
  callout(s, "实测", "200 × 200 的对角线矩阵：扫第 7 列只走过 **3** 个结点，而不是全表的 **202** 个。", 6.35, 3.8, 3.15, 1.3, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 12.1.3 example: cross list update
{
  const s = content("12.1", "12.1.3 稀疏矩阵 · 例", "十字链表：一次更新要同时维护两条链");
  text(s, "4 × 5 矩阵，只列非零元", 0.5, 1.02, 3.4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const M = [["", "8", "", "", "2"], ["", "", "", "", ""], ["", "5", "", "", ""], ["", "", "", "7", ""]];
  M.forEach((row, i) => {
    cells(s, 0.9, 1.45 + i * 0.44, row, { cw: 0.5, ch: 0.44, fs: 13, fills: row.map((v, j) => (i === 2 && j === 1 ? "F4B9B0" : v === "" ? C.white : C.mint)) });
    text(s, String(i), 0.55, 1.45 + i * 0.44, 0.3, 0.44, { fontSize: 10, color: C.muted, valign: "middle", align: "center", margin: 0 });
  });
  [0, 1, 2, 3, 4].forEach((j) => text(s, String(j), 0.9 + j * 0.5, 3.23, 0.5, 0.22, { fontSize: 10, color: C.muted, align: "center", margin: 0 }));
  text(s, "(0,1,8) (0,4,2) (2,1,5) (3,3,7)", 0.5, 3.5, 3.4, 0.3, { fontSize: 11, fontFace: MONO, color: C.green, margin: 0 });
  text(s, "结点 `(2,1,5)` 在第 2 行链里是唯一结点，在第 1 列链里却接在 `(0,1,8)` 后面。删掉它要**摘两次链**：第 2 行头改为空；第 1 列中让 8 的下继越过 5。", 0.5, 3.85, 3.5, 1.25, { fontSize: 11 });
  table(s, [
    ["操作后", "第 0 行链", "第 2 行链", "第 1 列链", "t"],
    ["初始", { t: "(0,1,8) -> (0,4,2)", mono: true }, { t: "(2,1,5)", mono: true }, { t: "(0,1,8) -> (2,1,5)", mono: true }, { t: "4", align: "center" }],
    [{ t: "覆盖 `(0,1,9)`" }, { t: "(0,1,9) -> (0,4,2)", mono: true }, { t: "(2,1,5)", mono: true }, { t: "(0,1,9) -> (2,1,5)", mono: true }, { t: "4", align: "center" }],
    [{ t: "删除 `(2,1)`" }, { t: "(0,1,9) -> (0,4,2)", mono: true }, { t: "空", color: C.bad }, { t: "(0,1,9)", mono: true }, { t: "3", align: "center" }],
  ], 4.2, 1.05, 5.3, [0.95, 1.55, 0.8, 1.6, 0.4], { fontSize: 9, rowH: 0.42, tight: true });
  callout(s, "测试至少查四件事", [
    "新坐标**同时出现在两条链**上。",
    "覆盖同坐标**不增加**非零元数（找到旧结点改值）。",
    "赋值为 0 **等价于删除**。",
    "删除后**两条链都找不到**它。",
  ], 4.2, 2.95, 5.3, 2.15, { fontSize: 11.5, gap: 5 });
}

// 12.1.3 code set part 1
{
  const s = content("12.1", "12.1.3 稀疏矩阵 · code/ch12/sparse_matrix（上）", "set：先在第 row 行链上定位");
  codeBlock(s, `    void set(std::size_t row, std::size_t col, int value) {
        check(row, col);
        Node* row_prev = nullptr;
        Node* cursor = row_heads_[row];
        while (cursor != nullptr && cursor->col < col) {
            ++steps_;
            row_prev = cursor;
            cursor = cursor->right;
        }
        const bool exists = cursor != nullptr && cursor->col == col;

        if (exists && value != 0) {
            cursor->value = value;  // 就地改值，两条链一根都不用动
            return;
        }
        if (exists) {
            unlink(row, col, row_prev, cursor);
            return;
        }
        if (value == 0) {
            return;  // 本来就是零元，什么都不用做
        }
        // ...`, 0.5, 1.05, 6.0, 4.05, { fontSize: 9 });
  text(s, "结点：五个域", 6.75, 1.05, 2.7, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, `struct Node {
    std::size_t row;
    std::size_t col;
    int value;
    Node* right;  // 行链
    Node* down;   // 列链
};`, 6.75, 1.4, 2.75, 1.45, { fontSize: 8.5 });
  callout(s, "三个分支", [
    "已存在、新值非 0 → **就地改值**。",
    "已存在、新值为 0 → 从**两条链**上摘掉。",
    "不存在、新值为 0 → 什么都不做。",
    "剩下的情况才要**插入**（下页）。",
  ], 6.75, 3.0, 2.75, 2.1, { fontSize: 10.5, gap: 3 });
}

// 12.1.3 code set part 2
{
  const s = content("12.1", "12.1.3 稀疏矩阵 · code/ch12/sparse_matrix（下）", "set：再在第 col 列链上定位，两条链同时接上");
  codeBlock(s, `        // ...
        Node* col_prev = nullptr;
        Node* down_cursor = col_heads_[col];
        while (down_cursor != nullptr && down_cursor->row < row) {
            ++steps_;
            col_prev = down_cursor;
            down_cursor = down_cursor->down;
        }

        Node* fresh = new Node{row, col, value, cursor, down_cursor};
        if (row_prev != nullptr) {
            row_prev->right = fresh;
        } else {
            row_heads_[row] = fresh;
        }
        if (col_prev != nullptr) {
            col_prev->down = fresh;
        } else {
            col_heads_[col] = fresh;
        }
        ++count_;
    }`, 0.5, 1.05, 6.0, 4.05, { fontSize: 9 });
  callout(s, "定位是局部的", "只在第 row 行和第 col 列上各走一段，**不碰其他行列**。新结点的 `right` 接行内后继 `cursor`，`down` 接列内后继 `down_cursor`。", 6.75, 1.05, 2.75, 1.9, { fontSize: 10.5 });
  callout(s, "删除：unlink", "行链前驱在 set 里已经找到；**列链的前驱要现找**——结点只存后继，不存前驱。两条链各摘一次，再 `delete`、`--count_`。", 6.75, 3.1, 2.75, 2.0, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 12.1.3 ownership
{
  const s = content("12.1", "12.1.3 稀疏矩阵 · 关键要点", "所有权归容器：两条链都是裸指针，析构迭代释放");
  card(s, 0.5, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 1, 0.7, 1.25, 0.42, C.dark);
  text(s, "为什么不用 unique_ptr 串链", 1.25, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "一个结点在**两条链**上，只能有一个主人——所有权归容器，链上都是观察指针。",
    "用 `unique_ptr` 串行链，析构是**递归**的：一行里非零元一多，就会**压穿栈**。",
    "判据见 2.3.1 节「所有权工具怎么选」；实测数字在该单元的 `legacy.md`。",
  ], 0.7, 1.8, 4.0, 3.1, { fontSize: 12, gap: 8 });
  card(s, 5.15, 1.1, 4.35, 3.95, C.code);
  numCircle(s, 2, 5.35, 1.25, 0.42, C.dark);
  text(s, "clear()：逐行沿 right 迭代", 5.9, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, `    void clear() noexcept {
        for (Node*& head : row_heads_) {
            Node* p = head;
            while (p != nullptr) {
                Node* next = p->right;
                delete p;
                p = next;
            }
            head = nullptr;
        }
        for (Node*& head : col_heads_) {
            head = nullptr;
        }
        count_ = 0;
    }`, 5.3, 1.8, 4.05, 2.55, { fontSize: 8.5 });
  text(s, "每个结点恰在一条行链上 → 沿行链释放**每个只删一次**；列头只需清空。", 5.35, 4.4, 4.0, 0.6, { fontSize: 10.5, margin: 0 });
}

// ============================ PART 2 ============================
sectionSlide("12.2", "广义表和存储管理", "元素可以是表 · 共享与环\n引用计数 · 可利用空间表 · 首次 / 最佳 / 最坏适应 · 标记–清除");

// 12.2.1 definition
{
  const s = content("12.2", "12.2.1 广义表的定义", "广义表：元素可以是原子，也可以是另一个广义表");
  bullets(s, [
    "**表头**是第一个元素，**表尾**是去掉表头后剩下的那个表；空表既没有头也没有尾。",
    "任何非空广义表都能**唯一**拆成「头 + 尾」→ 递归算法写成「先处理头、再处理尾」就和定义对上了。",
  ], 0.5, 1.05, 5.3, 1.3, { fontSize: 12, gap: 8 });
  card(s, 0.5, 2.4, 5.3, 2.7, C.code);
  text(s, "对 L = (a, (b,c), d) 连续拆解", 0.7, 2.5, 5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const rows = [["head(L)", "a"], ["tail(L)", "((b,c),d)"], ["head((b,c))", "b"], ["tail((b,c))", "(c)"]];
  rows.forEach((r, i) => {
    text(s, r[0], 0.8, 2.9 + i * 0.36, 1.6, 0.32, { fontSize: 11.5, fontFace: MONO, color: C.green, bold: true, margin: 0 });
    text(s, "= " + r[1], 2.4, 2.9 + i * 0.36, 2, 0.32, { fontSize: 11.5, fontFace: MONO, margin: 0 });
  });
  [["长度 3", "只数最外层"], ["深度 2", "要进入子表"], ["原子 4", "遍历所有层"]].forEach((p, i) => {
    pill(s, p[0], 0.8 + i * 1.65, 4.4, 1.45, 0.36, C.green, C.white, 11);
    text(s, p[1], 0.8 + i * 1.65, 4.78, 1.45, 0.25, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  });
  callout(s, "现代视角", "「广义表」是教材中的历史名称；今天通常叫**嵌套对象、对象图、共享 DAG 或循环对象图**——编译器 AST、JSON/XML 的嵌套值、内容寻址存储里的共享节点，都能用头尾分解、共享和环来解释。", 6.05, 1.05, 3.45, 2.3, { fontSize: 10.5 });
  callout(s, "为什么这一节只有 C++", "讨论的是**存储图**：结点被多个表共享、释放要避免重复访问、还要处理环。Python 的引用计数 / GC 会替你维护这些，本节就没了。", 6.05, 3.5, 3.45, 1.6, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 12.2.1 levels
{
  const s = content("12.2", "12.2.1 广义表的分类", "按是否共享、是否有环：线性表 → 纯表 → 再入表 → 循环表");
  const figs = [
    ["fig-12-3", "线性表", "元素全是原子"],
    ["fig-12-4", "纯表 ↔ 树", "每个子表只出现一次"],
    ["fig-12-5", "再入表 ↔ DAG", "子表可被共享"],
    ["fig-12-6", "循环表 ↔ 有环图", "子表可以包含自己"],
  ];
  figs.forEach((f, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.05, 2.1, 2.35, C.code);
    text(s, f[1], x + 0.1, 1.1, 1.9, 0.3, { fontSize: 12, bold: true, color: C.dark, align: "center", margin: 0 });
    image(s, f[0], x + 0.1, 1.42, 1.9, 1.6);
    text(s, f[2], x + 0.1, 3.05, 1.9, 0.3, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  });
  card(s, 0.5, 3.52, 9.0, 0.5, C.dark);
  text(s, "图  ⊇  再入表（循环表是带回路的特殊再入表）  ⊇  纯表  ⊇  线性表", 0.7, 3.52, 8.6, 0.5, { fontSize: 13.5, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
  callout(s, "标号", "共享时允许对子表和原子标号，**重复出现的标号代替对应的元素**；写循环表的括号形式必须用标号。", 0.5, 4.15, 4.4, 0.95, { fontSize: 10, tsize: 11 });
  callout(s, "深度 = 展开后括号的层数", "线性表深度 1；图 12.4、12.5 深度 3；**循环表深度为无穷大**。", 5.1, 4.15, 4.4, 0.95, { fontSize: 10, tsize: 11, fill: C.mint, tcolor: C.dark });
}

// 12.2.1 code GenNode + cons
{
  const s = content("12.2", "12.2.1 广义表 · code/ch12/gen_list", "GenNode 与 cons：头 + 尾 → 新表");
  codeBlock(s, `struct GenNode {
    enum class Tag { Atom, List };

    Tag tag = Tag::Atom;
    char value = '\\0';   // tag == Atom 时有效
    GenNode* head = nullptr;  // tag == List 时有效：表头
    GenNode* tail = nullptr;  // tag == List 时有效：表尾，空表用 nullptr
    std::size_t refs = 0;
};

    /// 表头 + 表尾 → 新表。原书的「任何非空广义表都能唯一拆成头和尾」的逆运算。
    static GenList cons(const GenList& head, const GenList& tail) {
        if (tail.node_ != nullptr && tail.node_->tag != GenNode::Tag::List) {
            throw std::invalid_argument("tail must be a list");
        }
        auto* node = new GenNode{GenNode::Tag::List, '\\0', head.node_, tail.node_, 0};
        retain(node->head);
        retain(node->tail);
        return GenList(node);
    }`, 0.5, 1.05, 6.3, 3.3, { fontSize: 8.5 });
  text(s, "表用「头 + 尾」表示：`(a,(b,c),d)` 就是 cons(a, cons((b,c), cons(d, ())))。", 0.5, 4.45, 6.3, 0.6, { fontSize: 11 });
  callout(s, "计数放在结点上", [
    "`refs`：有几处引用这个结点。",
    "句柄 `GenList` 负责加减：拷贝 `retain`，析构 `release`。",
    "`cons` 对头、尾各 `retain` 一次——**共享而不是拷贝**。",
  ], 7.05, 1.05, 2.45, 2.55, { fontSize: 10.5, gap: 4 });
  callout(s, "表尾必须是表", "`tail` 是原子属于**用错接口**，抛异常；空表的 `head()` / `tail()` 则返回 `nullopt`。", 7.05, 3.75, 2.45, 1.35, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 12.2.1 refcount
{
  const s = content("12.2", "12.2.1 广义表 · code/ch12/gen_list", "共享一旦发生，回收就不能再按树递归 delete");
  codeBlock(s, `static void retain(GenNode* node) noexcept {
    if (node != nullptr) {
        ++node->refs;
    }
}

static void release(GenNode* node) noexcept {
    // 计数归零才真正删除；共享的子表因此只会被删一次。
    while (node != nullptr && --node->refs == 0) {
        GenNode* const head = node->head;
        GenNode* const tail = node->tail;
        delete node;
        // 表尾用循环走，长表不会把栈压穿；表头递归，深度由嵌套层数决定。
        release(head);
        node = tail;
    }
}`, 0.5, 1.05, 5.9, 3.0, { fontSize: 9 });
  figBox(s, "fig-12-5", 0.5, 4.15, 5.9, 0.95, "", 9);
  callout(s, "要点", [
    "按树递归 `delete` 会把共享的 `(b,c)` **删两次**。",
    "沿表尾**迭代**、只对表头递归：三万个元素的长表析构不压栈，栈深只跟**嵌套层数**走。",
    "不用 `shared_ptr`：本节要教的就是「谁来回收共享结点」。",
  ], 6.65, 1.05, 2.85, 2.7, { fontSize: 10.5, gap: 4 });
  callout(s, "引用计数收不回环", "本书接口自底向上建表，**造不出循环表**。环交给 12.2.4 的标记–清除。", 6.65, 3.9, 2.85, 1.2, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 12.2.2 free list
{
  const s = content("12.2", "12.2.2 可利用空间表", "等长结点的复用：从全局 avail 链到显式句柄池");
  figBox(s, "fig-12-10", 0.5, 1.05, 5.0, 2.3, "图 12.10  等长结点的可利用空间表");
  card(s, 0.5, 3.5, 2.4, 1.6, "FDF0EE");
  text(s, "原书", 0.65, 3.58, 2.1, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  text(s, "重载 `operator new/delete` + 一条**全局** `avail` 链；所有对象共享隐式全局状态，结束时还要 `::delete` 整条链。", 0.65, 3.9, 2.15, 1.15, { fontSize: 9.5, margin: 0 });
  card(s, 3.1, 3.5, 2.4, 1.6, "EAF4EF");
  text(s, "现代实现", 3.25, 3.58, 2.1, 0.3, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
  text(s, "**显式索引句柄池**：`acquire` 从空闲栈弹下标，`release` 推回；耗尽返回 `nullopt`，重复 / 越界归还返回 `false`。", 3.25, 3.9, 2.15, 1.15, { fontSize: 9.5, margin: 0 });
  bullets(s, [
    "「可利用空间表」（free list）是**固定大小对象池**的历史叫法。",
    "工程中按对象大小用 **arena、pool、slab** allocator——都把分配路径和所有权边界显式化。",
    "释放后的下标失效，`get` 得到**空指针**。",
    "本章的句柄池把「失败」做成返回 `nullopt`，**不劫持全局** `new`。",
  ], 5.75, 1.05, 3.75, 4.0, { fontSize: 11.5, gap: 9 });
}

// 12.2.2 pool trace
{
  const s = content("12.2", "12.2.2 可利用空间表 · 例", "容量为 3 的句柄池：一张账");
  table(s, [
    ["动作", "槽 0", "槽 1", "槽 2", "下一可用"],
    [{ t: "初始" }, { t: "空", color: C.muted }, { t: "空", color: C.muted }, { t: "空", color: C.muted }, { t: "0", align: "center" }],
    [{ t: "acquire(A)", mono: true }, { t: "A", bold: true }, { t: "空", color: C.muted }, { t: "空", color: C.muted }, { t: "1", align: "center" }],
    [{ t: "acquire(B)", mono: true }, "A", { t: "B", bold: true }, { t: "空", color: C.muted }, { t: "2", align: "center" }],
    [{ t: "release(0)", mono: true }, { t: "空", color: C.bad }, "B", { t: "空", color: C.muted }, { t: "0", align: "center" }],
    [{ t: "acquire(C)", mono: true }, { t: "C", bold: true, color: C.ok }, "B", { t: "空", color: C.muted }, { t: "2", align: "center" }],
  ], 0.5, 1.1, 5.2, [1.4, 0.9, 0.9, 0.9, 1.1], { fontSize: 12, rowH: 0.45 });
  text(s, "初始空闲栈顶依次是 0, 1, 2；归还 0 后空闲栈是 0, 2；再申请 C **复用 0**。", 0.5, 3.9, 5.2, 0.6, { fontSize: 11.5 });
  callout(s, "旧句柄 0 已经失效", "数值 0 后来又出现，却代表**新的占用期**。真实系统要识别「拿旧句柄误访问新对象」，还会在句柄里加**代数**（generation）；本节的简化池只保证空闲槽不可读、重复释放会失败。", 5.95, 1.1, 3.55, 2.2, { fontSize: 10.5 });
  callout(s, "release 为什么要先查占用", "若不确认槽位处于占用状态，**重复归还 0** 会让空闲栈出现两个 0，之后两次申请可能拿到**同一个槽**。", 5.95, 3.45, 3.55, 1.65, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 12.2.2 pool code 1
{
  const s = content("12.2", "12.2.2 可利用空间表 · code/ch12/optimal_bst（上）", "ReusableNodePool：构造与 acquire");
  codeBlock(s, `template <typename T>
class ReusableNodePool {
public:
    explicit ReusableNodePool(std::size_t capacity) : slots_(capacity) {
        for (std::size_t index = 0; index < capacity; ++index) {
            free_.push_back(capacity - index - 1);
        }
    }

    [[nodiscard]] std::optional<std::size_t> acquire(const T& value) {
        if (free_.empty()) {
            return std::nullopt;
        }
        const std::size_t index = free_.back();
        free_.pop_back();
        slots_[index] = value;
        return index;
    }
    // ...`, 0.5, 1.05, 6.2, 3.3, { fontSize: 9 });
  card(s, 6.95, 1.05, 2.55, 1.75, C.code);
  text(s, "两个数据成员", 7.1, 1.12, 2.3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  s.addText([
    { text: "vector<optional<T>> slots_", options: { fontFace: MONO, bold: true, color: C.green, breakLine: true } },
    { text: "槽位：有值 = 占用", options: { breakLine: true } },
    { text: "vector<size_t> free_", options: { fontFace: MONO, bold: true, color: C.green, breakLine: true } },
    { text: "空闲栈：存空槽下标", options: {} },
  ], { x: 7.1, y: 1.45, w: 2.35, h: 1.3, fontFace: FONT, fontSize: 9.5, color: C.text, margin: 0, isTextBox: true, valign: "top" });
  callout(s, "下标从大到小入栈", "构造时压入 `capacity-1, …, 1, 0`，栈顶是 0 → **第一次 acquire 拿到 0**，与演示输出「申请到槽 0 和 1」一致。", 6.95, 2.95, 2.55, 2.15, { fontSize: 10.5 });
  text(s, "耗尽返回 `nullopt`——**可预期的状态**，不是异常。", 0.5, 4.5, 6.2, 0.4, { fontSize: 11.5 });
}

// 12.2.2 pool code 2
{
  const s = content("12.2", "12.2.2 可利用空间表 · code/ch12/optimal_bst（下）", "release / get：先确认占用，再归还");
  codeBlock(s, `    // ...
    bool release(std::size_t index) {
        if (index >= slots_.size() || !slots_[index]) {
            return false;
        }
        slots_[index].reset();
        free_.push_back(index);
        return true;
    }

    [[nodiscard]] const T* get(std::size_t index) const noexcept {
        if (index >= slots_.size() || !slots_[index]) {
            return nullptr;
        }
        return &*slots_[index];
    }

    [[nodiscard]] std::size_t available() const noexcept { return free_.size(); }

private:
    std::vector<std::optional<T>> slots_;
    std::vector<std::size_t> free_;
};`, 0.5, 1.05, 6.4, 4.05, { fontSize: 8 });
  callout(s, "release 的两道闸", [
    "**越界**：`index >= slots_.size()` → `false`。",
    "**重复归还**：槽已空 `!slots_[index]` → `false`。",
    "通过后 `reset()` 清空槽，再推回空闲栈。",
  ], 7.1, 1.05, 2.4, 2.4, { fontSize: 10.5, gap: 4 });
  callout(s, "get 对空槽给空指针", "释放后的下标**不可读**：`get` 返回 `nullptr`，而不是读到上一轮留下的旧值。", 7.1, 3.6, 2.4, 1.5, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 12.2.3 three fits
{
  const s = content("12.2", "12.2.3 顺序适配（sequential fit）", "首先 / 最佳 / 最差适配：只在「挑哪一块」这一步不同");
  const fits = [
    ["首先适配 First fit", "从表头顺次搜索，**第一块** ≥ 请求的就分配。", "改进：记住上次搜到的位置，从那里接着搜，到表尾再绕回表头（今天叫 **next fit**）。", "速度快；但可能把大块拆小，后来难以满足大请求。"],
    ["最佳适配 Best fit", "在所有 ≥ 请求的块中挑**最小**的一块。", "实现：扫整个无序表；或把空闲块**从小到大**排成优先队列，只需从表头往后看。", "大请求无法满足的可能性最低；但剩下的碎片**非常小**，外部碎片可能很严重。"],
    ["最差适配 Worst fit", "每次分配当前**最大**的块。", "指望剩下的部分还大到能再用一次。", "剩下的还能再分；但大块很快被拆光。"],
  ];
  text(s, "变长空闲块自带**标记位、块长度、双链指针**，空闲表不再是栈。分配 N 时找一块 K ≥ N：整块给出，多余的浪费在块内（**内部碎片**）；切出 N、剩 K − N 另成空闲块，长期运行留下一堆用不上的小块（**外部碎片**）。", 0.5, 1.0, 9.0, 0.62, { fontSize: 10.5, margin: 0, valign: "middle" });
  fits.forEach((f, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.7, 2.85, 3.4, C.code);
    numCircle(s, i + 1, x + 0.15, 1.8, 0.4, C.dark);
    text(s, f[0], x + 0.65, 1.8, 2.15, 0.4, { fontSize: 12.5, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, f[1], x + 0.18, 2.3, 2.5, 0.65, { fontSize: 11.5, margin: 0 });
    text(s, f[2], x + 0.18, 3.0, 2.5, 1.05, { fontSize: 10, color: C.muted, margin: 0 });
    card(s, x + 0.12, 4.1, 2.61, 0.9, C.cream);
    text(s, f[3], x + 0.22, 4.13, 2.42, 0.84, { fontSize: 10, margin: 0, valign: "middle" });
  });
}

// 12.2.3 fit example
{
  const s = content("12.2", "12.2.3 顺序适配 · 例", "空闲区 500、200、300、600，请求 212 字节");
  // memory strip: free blocks separated by busy blocks
  const strip = [["500", 1.2, true], ["", 0.3, false], ["200", 0.6, true], ["", 0.3, false], ["300", 0.8, true], ["", 0.3, false], ["600", 1.4, true]];
  let x = 0.8;
  strip.forEach(([lab, w, free]) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w, h: 0.5, fill: { color: free ? C.mint : "9AAAA3" }, line: { color: C.green, width: 1 } });
    if (lab) text(s, lab, x, 1.35, w, 0.5, { fontSize: 13, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    x += w;
  });
  text(s, "灰色是已分配块，把空闲区隔开，所以不会合并", 5.9, 1.4, 3.6, 0.4, { fontSize: 10, color: C.muted, valign: "middle", margin: 0 });
  arrowLabel(s, "首次", 1.4, 1.35, C.green);
  arrowLabel(s, "最佳", 3.6, 1.35, C.goldText);
  arrowLabel(s, "最坏", 5.0, 1.35, C.bad);
  table(s, [
    ["策略", "挑中", "剩下的碎片", "代价"],
    [{ t: "首次适应", bold: true, color: C.green }, "500 那块", { t: "288", align: "center" }, "找到就停，扫得最少；小碎片在低地址堆积"],
    [{ t: "最佳适应", bold: true, color: C.goldText }, "300 那块", { t: "**88**", align: "center" }, "大块留住了，但剩下的碎片最碎、最难再用"],
    [{ t: "最坏适应", bold: true, color: C.bad }, "600 那块", { t: "**388**", align: "center" }, "剩下的还大到能再分一次；大块很快被拆光"],
  ], 0.5, 2.15, 9.0, [1.3, 1.2, 1.3, 5.2], { fontSize: 11.5, rowH: 0.42 });
  callout(s, "测试要用多块、大小不同的空闲区", "只在**一块**空闲区上测，三种策略必然挑中同一块——把最佳适应和最坏适应的判据对调，测试照样全绿。`code/ch12/memory_allocator` 的测试用的正是上面这组数字。", 0.5, 4.0, 9.0, 1.1, { fontSize: 11, fill: "FDF0EE", tcolor: C.bad });
}

// 12.2.3 select code
{
  const s = content("12.2", "12.2.3 顺序适配 · code/ch12/memory_allocator", "select：三种策略的唯一分歧点");
  codeBlock(s, `enum class Fit { First, Best, Worst };

    /// 三种策略的唯一分歧点。
    [[nodiscard]] std::optional<std::size_t> select(std::size_t bytes, Fit fit) {
        scanned_ = 0;
        std::optional<std::size_t> chosen;
        for (std::size_t i = 0; i < blocks_.size(); ++i) {
            ++scanned_;
            if (!blocks_[i].free || blocks_[i].size < bytes) {
                continue;
            }
            if (fit == Fit::First) {
                return i;  // 第一块够大的就走，不再往后看
            }
            if (!chosen) {
                chosen = i;
            } else if (fit == Fit::Best && blocks_[i].size < blocks_[*chosen].size) {
                chosen = i;
            } else if (fit == Fit::Worst && blocks_[i].size > blocks_[*chosen].size) {
                chosen = i;
            }
        }
        return chosen;
    }`, 0.5, 1.05, 6.55, 4.05, { fontSize: 8.5 });
  callout(s, "读法", [
    "**First**：命中即 `return`，后面的块不看。",
    "**Best / Worst**：扫完全表，比 `<` 还是 `>`。",
    "`scanned_` 记扫过几块：首次适应通常最小——这是它「快」的全部含义。",
  ], 7.3, 1.05, 2.2, 2.75, { fontSize: 10, gap: 4 });
  callout(s, "块表", "`blocks_` 按**偏移升序**，覆盖整段空间、无空洞。", 7.3, 3.95, 2.2, 1.15, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 12.2.3 coalesce concept
{
  const s = content("12.2", "12.2.3 回收与合并", "释放块 M：与相邻空闲块合并的四种位置关系");
  const cases = [
    ["左右都忙", ["忙", "M", "忙"], "M 单独入空闲表"],
    ["只有左边空闲", ["空", "M", "忙"], "扩大左块"],
    ["只有右边空闲", ["忙", "M", "空"], "右块起点移到 M"],
    ["左右都空闲", ["空", "M", "空"], "三块合成一块"],
  ];
  cases.forEach((c, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.05, 2.1, 1.65, C.code);
    text(s, c[0], x + 0.1, 1.1, 1.9, 0.3, { fontSize: 11.5, bold: true, color: C.dark, align: "center", margin: 0 });
    cells(s, x + 0.3, 1.5, c[1], { cw: 0.5, ch: 0.42, fs: 11, fills: c[1].map((v) => (v === "忙" ? "9AAAA3" : v === "M" ? C.gold : C.mint)) });
    text(s, c[2], x + 0.1, 2.1, 1.9, 0.5, { fontSize: 10.5, align: "center", valign: "middle", margin: 0 });
  });
  figBox(s, "fig-12-13", 0.5, 2.85, 4.35, 1.5, "图 12.13  释放 M 时与相邻空闲块合并", 9);
  text(s, "顺序表实现检查前后项；**边界标记**（块头块尾各记一份大小与忙闲）从 M 的块头、块尾 **O(1)** 找到物理邻居。本书按偏移升序存块表，相邻块就是表里相邻的项——同一个想法，代价是定位要扫表。", 0.5, 4.4, 4.35, 0.75, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "外部碎片可以量出来", [
    "释放出两个**不相邻**的 30 字节空洞：空闲总量 60，最大一块只有 30 → **45 字节的请求失败**。",
    "把中间那块也释放、三块并成一整块 → 同样的请求**立刻能满足**。",
    "装不下一个请求时，看的是 `largest_free_block()`，不是空闲总量。",
  ], 5.1, 2.85, 4.4, 2.25, { fontSize: 10.5, gap: 4 });
}

// 12.2.3 allocate code
{
  const s = content("12.2", "12.2.3 回收与合并 · code/ch12/memory_allocator（上）", "allocate：挑块，够大就分裂");
  codeBlock(s, `    [[nodiscard]] std::optional<std::size_t> allocate(std::size_t bytes, Fit fit) {
        if (bytes == 0) {
            throw std::invalid_argument("BoundaryAllocator: size must be positive");
        }
        const std::optional<std::size_t> chosen = select(bytes, fit);
        if (!chosen) {
            return std::nullopt;
        }
        Block& block = blocks_[*chosen];
        if (block.size > bytes) {
            // 分裂：剩下的那截仍然空闲，作为下一项插进块表。
            const Block rest{block.offset + bytes, block.size - bytes, true};
            block.size = bytes;
            blocks_.insert(blocks_.begin() + static_cast<std::ptrdiff_t>(*chosen) + 1, rest);
        }
        blocks_[*chosen].free = false;
        return blocks_[*chosen].offset;
    }`, 0.5, 1.05, 6.7, 3.0, { fontSize: 8 });
  text(s, "两种失败，两种口径：请求 0 字节是**调用方用错**，抛异常；空间不足是**预期结果**，返回 `nullopt`。", 0.5, 4.2, 6.7, 0.8, { fontSize: 11.5 });
  callout(s, "分裂", [
    "块比请求大：前半截给请求者，**后半截** `rest` 仍空闲，插在块表下一项。",
    "块表始终**按偏移升序、覆盖整段、无空洞**。",
    "返回的是块的**偏移**，释放时凭它找回块。",
  ], 7.45, 1.05, 2.05, 4.05, { fontSize: 10, gap: 5 });
}

// 12.2.3 release + coalesce code
{
  const s = content("12.2", "12.2.3 回收与合并 · code/ch12/memory_allocator（下）", "release + coalesce：先合右，再合左");
  codeBlock(s, `    bool release(std::size_t offset) {
        const std::optional<std::size_t> index = index_of(offset);
        if (!index || blocks_[*index].free) {
            return false;
        }
        blocks_[*index].free = true;
        coalesce(*index);
        return true;
    }
    // ...
    /// 与左右两侧的空闲块合并。**先合右再合左**：先处理右边，左边的下标才不会失效。
    /// 不合并的话，外部碎片只会越积越多——这是本节的正题。
    void coalesce(std::size_t index) {
        if (index + 1 < blocks_.size() && blocks_[index + 1].free) {
            blocks_[index].size += blocks_[index + 1].size;
            blocks_.erase(blocks_.begin() + static_cast<std::ptrdiff_t>(index) + 1);
        }
        if (index > 0 && blocks_[index - 1].free) {
            blocks_[index - 1].size += blocks_[index].size;
            blocks_.erase(blocks_.begin() + static_cast<std::ptrdiff_t>(index));
        }
    }`, 0.5, 1.05, 6.7, 3.6, { fontSize: 8 });
  callout(s, "为什么先合右", "合右删的是 `index + 1`，`index` 本身不动；若先合左，`index` 那一项被 `erase`，再去看右边就用错了下标。", 7.45, 1.05, 2.05, 2.3, { fontSize: 10 });
  callout(s, "重复释放", "偏移上没有块，或块已空闲 → `false`。", 7.45, 3.5, 2.05, 1.15, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  text(s, "四种位置关系在这里只剩两个 `if`：右邻空闲就吞掉右邻，左邻空闲就被左邻吞掉。", 0.5, 4.72, 9.0, 0.4, { fontSize: 11 });
}

// 12.2.4 GC
{
  const s = content("12.2", "12.2.4 失败处理策略和无用单元回收", "分配失败时：拒绝、压缩，或回收够不着的块");
  const opts = [["直接拒绝", C.muted], ["压缩：把已分配块搬到一起", C.green], ["垃圾回收：收回够不着却占着的块", C.dark]];
  opts.forEach((o, i) => pill(s, o[0], 0.5 + i * 3.05, 1.05, 2.85, 0.42, o[1], C.white, 11));
  card(s, 0.5, 1.65, 4.35, 2.4, "FDF0EE");
  text(s, "引用计数", 0.7, 1.75, 3, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "每个对象记有多少指针指着它，减到零就释放。",
    "实现简单；但对象**互相指形成环**时，计数永远掉不到零 → **内存泄漏**。",
  ], 0.65, 2.15, 4.1, 1.85, { fontSize: 11.5, gap: 6 });
  card(s, 5.15, 1.65, 4.35, 2.4, "EAF4EF");
  text(s, "标记–清除", 5.35, 1.75, 3, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "从一组**根**（栈上的指针、全局变量）出发，走遍能碰到的对象并**标记**；再扫一遍堆，**没标记的统统回收**。",
    "能处理环；但要能从根集走到每个活对象，还要区分「指针」和「像地址的整数」。",
  ], 5.3, 2.15, 4.1, 1.85, { fontSize: 11.5, gap: 6 });
  figBox(s, "fig-12-14", 0.5, 4.2, 3.0, 0.9, "", 9);
  text(s, "图 12.14  无根循环引用不会自行消失。**判生死的是可达性，不是入度或引用数**——这正是循环引用能被整组收回的原因。", 3.7, 4.2, 5.8, 0.9, { fontSize: 11, valign: "middle", margin: 0 });
}

// 12.2.4 mark-sweep trace
{
  const s = content("12.2", "12.2.4 无用单元回收 · 例", "标记–清除走一遍：根集只有 R → A → B，另有 C ⇄ D");
  card(s, 0.5, 1.05, 3.6, 2.6, C.code);
  pill(s, "R（根）", 0.7, 1.35, 1.0, 0.4, C.dark, C.gold, 10);
  tnode(s, "A", 2.25, 1.55, 0.45, "CDEBD9");
  tnode(s, "B", 3.4, 1.55, 0.45, "CDEBD9");
  edge(s, 1.7, 1.55, 2.02, 1.55, C.dark, true);
  edge(s, 2.48, 1.55, 3.17, 1.55, C.dark, true);
  tnode(s, "C", 1.6, 2.75, 0.45, "F4B9B0");
  tnode(s, "D", 3.0, 2.75, 0.45, "F4B9B0");
  edge(s, 1.83, 2.65, 2.77, 2.65, C.bad, true);
  edge(s, 2.77, 2.85, 1.83, 2.85, C.bad, true);
  text(s, "C、D 各有一个入边，却从任何根都走不到", 0.6, 3.15, 3.4, 0.45, { fontSize: 9.5, color: C.bad, align: "center", margin: 0 });
  table(s, [
    ["阶段", "待处理栈", "已标记", "动作"],
    ["放入根", { t: "A", mono: true }, "A", "根先标记再入栈"],
    ["弹出 A", { t: "B", mono: true }, "A、B", "沿 A → B 发现 B"],
    ["弹出 B", "空", "A、B", "标记阶段结束"],
    [{ t: "清扫", bold: true }, "空", "A、B", { t: "保留 A、B；**回收 C、D**", color: C.bad }],
  ], 4.35, 1.05, 5.15, [0.95, 1.05, 0.9, 2.25], { fontSize: 11, rowH: 0.42 });
  callout(s, "一定要「先标记、再入栈」", "若等到弹出时才标，环或菱形共享会把同一结点**反复压栈**；结果也许仍对，空间和时间却可能失控。", 4.35, 3.35, 5.15, 1.1, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
  callout(s, "一个被三处引用的对象", "谁都够不着根 → 引用计数收不回，标记–清除**照收**。", 0.5, 3.8, 3.6, 1.3, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "清除阶段顺着堆里所有对象串成的链走一遍：没标记的删掉，有标记的把标记清零，为下一轮复位。", 4.35, 4.55, 5.15, 0.55, { fontSize: 10, color: C.muted, margin: 0 });
}

// 12.2.4 mark code
{
  const s = content("12.2", "12.2.4 无用单元回收 · code/ch12/storage_recovery", "collect = mark + sweep；标记用显式栈");
  codeBlock(s, `    std::size_t collect(const std::vector<Node*>& roots) {
        mark(roots);
        return sweep();
    }
    // ...
    void mark(const std::vector<Node*>& roots) {
        std::vector<Node*> pending;
        for (Node* root : roots) {
            if (root != nullptr && !root->marked) {
                root->marked = true;
                pending.push_back(root);
            }
        }
        while (!pending.empty()) {
            Node* node = pending.back();
            pending.pop_back();
            for (Node* next : node->edges) {
                if (next != nullptr && !next->marked) {
                    next->marked = true;   // 先标记再入栈：环不会让这里转不出来
                    pending.push_back(next);
                }
            }
        }
    }`, 0.5, 1.05, 6.2, 4.05, { fontSize: 8.5 });
  callout(s, "为什么不递归", "GC 恰恰是在**内存吃紧**时跑的，那时最不该再去吃调用栈。测试里有 **20 万个对象的深链**，递归标记必然压穿栈。", 6.95, 1.05, 2.55, 1.95, { fontSize: 10.5 });
  callout(s, "它仍是教学模型", [
    "出边是一张表，`collect()` 接受**一组**根。",
    "没有栈扫描、写屏障、分代，也不区分指针与整数——那恰恰是真实 GC **最难**的部分。",
  ], 6.95, 3.15, 2.55, 1.95, { fontSize: 10, gap: 4, fill: C.mint, tcolor: C.dark });
}

// ============================ PART 3 ============================
sectionSlide("12.3", "Trie 结构和 Patricia 树", "换一种「分解」：按关键码的字符或位分层\n二叉 Trie · 字母 Trie · 最长前缀匹配 · Patricia");

// 12.3 two decompositions
{
  const s = content("12.3", "12.3 Trie 结构", "BST 与 Trie 分属两种「分解」");
  card(s, 0.5, 1.05, 4.35, 2.55, C.code);
  text(s, "对象空间分解（BST）", 0.7, 1.13, 4, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "关键码范围怎么划分，由**存进树里的关键码**决定。",
    "树形与输入顺序关系很大：升序输入退化成线性表，查找 **O(n)**。",
  ], 0.65, 1.55, 4.1, 2.0, { fontSize: 11.5, gap: 6 });
  card(s, 5.15, 1.05, 4.35, 2.55, "EAF4EF");
  text(s, "关键码空间分解（Trie）", 5.35, 1.13, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  bullets(s, [
    "对每个结点**预定义划分位置**，均分关键码范围。",
    "树形**不依赖插入顺序**，深度只受**关键码精度**影响：0～255 的整数精度 8 位，只在最低位不同的两个关键码到第 8 次划分才分开。",
  ], 5.3, 1.55, 4.1, 2.0, { fontSize: 11.5, gap: 6 });
  bullets(s, [
    "「trie」来自 re**trie**val：信息检索；常用于存英文词典。",
    "Trie 基于两个原则：**关键码集合固定；能对结点分层标记**（如 0～9 的数字，根分出 10 个子结点）。",
    "与 B+ 树一样，内部结点只作**占位符**引导检索，数据记录只存在叶结点。",
  ], 0.5, 3.75, 5.9, 1.4, { fontSize: 11, gap: 5 });
  callout(s, "但不保证平衡", "关键码分布不均时，比如都小于根的划分点，右子树就一个元素也没有。", 6.6, 3.75, 2.9, 1.35, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 12.3 binary trie
{
  const s = content("12.3", "12.3 Trie 结构 · 二叉 Trie", "二叉 Trie：按数值区间对半分，左枝 0、右枝 1");
  figBox(s, "fig-12-16", 0.5, 1.05, 5.3, 4.05, "图 12.16  二叉 Trie 树（元素 2、5、9、17、41、45、63）");
  bullets(s, [
    "最大元素 63 → 关键码范围取 **[0, 64)**。",
    "根把范围劈成 [0, 32) 和 [32, 64)：2、5、9、17 进左子树，41、45、63 进右子树。",
    "再往下继续对半分，直到每个元素**单独落在一个叶上**。",
    "同一棵子树下的关键码**共享父结点代表的前缀**。",
  ], 6.05, 1.05, 3.45, 2.9, { fontSize: 11.5, gap: 7 });
  callout(s, "老朋友", "第 5 章的 Huffman 编码树也有「共享前缀」这个性质——**Huffman 树就是一种二叉 Trie**。", 6.05, 4.0, 3.45, 1.1, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 12.3 letter trie
{
  const s = content("12.3", "12.3 Trie 结构 · 字母 Trie", "can、car、cat、do 插进字母 Trie：公共前缀 ca 只存一次");
  codeBlock(s, `        ·
       / \\
      c   d
      |   |
      a   o*
     /|\\
    n* r* t*`, 0.5, 1.05, 2.6, 2.2, { fontSize: 12, lang: "text" });
  text(s, "带 * 的是词尾", 0.5, 3.3, 2.6, 0.3, { fontSize: 10, color: C.muted, align: "center", margin: 0 });
  figBox(s, "fig-12-17", 3.35, 1.05, 6.15, 2.55, "图 12.17  按字符分支存放单词的 Trie（原书例）", 9);
  bullets(s, [
    "第 i 层对应第 i 个字符；查找沿字符走，时间与**关键码长度**成正比，与表里有多少个词关系不大。",
    "查 `car`：c–a–r，三步；查 `cab`：在 b 处没有分支，**失败**。",
    "**最长前缀匹配**（路由）：走到不能再走为止，回退到最近的词尾。",
  ], 0.5, 3.75, 5.6, 1.4, { fontSize: 11, gap: 5 });
  card(s, 6.35, 3.75, 3.15, 1.35, C.dark);
  text(s, "11 个字符 → 7 个结点", 6.5, 3.85, 2.9, 0.4, { fontSize: 15, bold: true, color: C.gold, margin: 0 });
  text(s, "c、a、n、r、t、d、o：`ca` 只存了一次。字典、IP 路由这类「按前缀分类」的问题特别合适。", 6.5, 4.27, 2.9, 0.8, { fontSize: 9.5, color: C.white, margin: 0, lsm: 1.1 });
}

// 12.3 trie insert code
{
  const s = content("12.3", "12.3 Trie 结构 · code/ch12/trie", "Trie::insert：沿途建结点，并维护 passing");
  codeBlock(s, `    bool insert(std::string_view word) {
        validate(word);
        Node* node = &root_;
        for (const char letter : word) {
            const std::size_t slot = index_of(letter);
            if (!node->children[slot]) {
                node->children[slot] = std::make_unique<Node>();
                ++nodes_;
            }
            node = node->children[slot].get();
            ++node->passing;
        }
        if (node->terminal) {
            // 词已存在：把刚才一路加上的 passing 退回去。
            unwind(word);
            return false;
        }
        node->terminal = true;
        ++size_;
        return true;
    }`, 0.5, 1.05, 5.9, 4.05, { fontSize: 9 });
  text(s, "结点", 6.65, 1.05, 2.8, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, `struct Node {
    std::array<std::unique_ptr<Node>,
               kAlphabet> children{};
    bool terminal = false;
    std::size_t passing = 0;
};`, 6.65, 1.38, 2.85, 1.3, { fontSize: 8.5 });
  callout(s, "passing 与 terminal", [
    "`passing`：有多少个词**经过**这里 → `count_with_prefix` 一次问答，不必把子树数一遍。",
    "`terminal`：这里是不是**词尾**。",
    "字母表限 `a..z`，越界字符抛异常。",
  ], 6.65, 2.85, 2.85, 2.25, { fontSize: 10, gap: 4 });
}

// 12.3 Patricia concept
{
  const s = content("12.3", "12.3 Patricia 树", "Patricia：把「只有一个孩子」的结点压缩掉");
  figBox(s, "fig-12-19", 0.5, 1.05, 4.35, 2.75, "图 12.19  x 表示那一位取 0 或 1 都落在同一枝", 9);
  figBox(s, "fig-12-20", 5.15, 1.05, 4.35, 2.75, "图 12.20  压缩后的 PATRICIA Trie", 9);
  bullets(s, [
    "纯 Trie 在单孩子内部结点上仍然分支，路径偏长。`x` 那一位**不需要用来分支**——把这样的层去掉就是 Patricia。",
    "内部结点不再逐位下降，而是各自记住「**该比第几位**」；查找按记下的位取关键码的那一位，决定走左还是走右。",
  ], 0.5, 3.95, 5.9, 1.2, { fontSize: 11, gap: 5 });
  callout(s, "效果", "路径更短、结点更少，仍保持前缀共享——同样四个词，Patricia 只要 **3 个内部结点**。", 6.6, 3.95, 2.9, 1.15, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 12.3 Patricia bits code
{
  const s = content("12.3", "12.3 Patricia 树 · code/ch12/trie", "两块基石：按位取值、第一次不同在第几位");
  codeBlock(s, `static bool bit_of(std::string_view key, std::size_t index) noexcept {
    const std::size_t byte = index / 8;
    if (byte >= key.size()) {
        return false;  // 越过关键码长度，一律读 0
    }
    const auto value = static_cast<unsigned char>(key[byte]);
    return ((value >> (7 - index % 8)) & 1U) != 0;
}

static optional_bit first_differing_bit(std::string_view a, std::string_view b) {
    const std::size_t longest = a.size() > b.size() ? a.size() : b.size();
    const std::size_t bits = (longest + 1) * 8;  // +1 让「一个是另一个的前缀」也能分开
    for (std::size_t i = 0; i < bits; ++i) {
        if (bit_of(a, i) != bit_of(b, i)) {
            return {true, i};
        }
    }
    return {};
}`, 0.5, 1.05, 6.3, 3.3, { fontSize: 8.5 });
  text(s, "关键码按字节的位串看待，**最高位在前**：第 index 位在第 index / 8 个字节里，右移 7 − index % 8 位。", 0.5, 4.45, 6.3, 0.65, { fontSize: 11 });
  callout(s, "越界读 0", "`a` 与 `ab` 这种「一个是另一个的前缀」也能分开；代价是关键码里**不能出现 '\\0'**。", 7.05, 1.05, 2.45, 1.8, { fontSize: 10.5 });
  callout(s, "叶上必须再比一次", "沿位下降到叶后，**必须和叶上的完整关键码再比一次**——路上只看了少数几位，不比就会把 `ca`、`cars` 判成命中。", 7.05, 3.0, 2.45, 2.1, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 12.3 'a' vs 'c'
{
  const s = content("12.3", "12.3 Patricia 树 · 例", "'a' 与 'c'：第一次不同在第 6 位");
  const A = "01100001".split(""), Cc = "01100011".split("");
  const fillsFor = (arr) => arr.map((_, i) => (i === 6 ? "F4B9B0" : i < 6 ? "E3E8E6" : C.mint));
  text(s, "'a' = 0x61", 0.5, 1.3, 1.5, 0.45, { fontSize: 13, bold: true, fontFace: MONO, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 2.1, 1.3, A, { cw: 0.5, ch: 0.45, fs: 14, fills: fillsFor(A) });
  text(s, "'c' = 0x63", 0.5, 1.95, 1.5, 0.45, { fontSize: 13, bold: true, fontFace: MONO, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 2.1, 1.95, Cc, { cw: 0.5, ch: 0.45, fs: 14, fills: fillsFor(Cc), idx: true });
  arrowLabel(s, "第 6 位", 2.1 + 6.5 * 0.5, 1.3, C.bad);
  text(s, "位号（从 0 起，最高位在前）", 2.1, 2.65, 4, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
  card(s, 6.4, 1.05, 3.1, 1.85, C.code);
  text(s, "内部结点只记分歧位", 6.55, 1.12, 2.8, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  tnode(s, "6", 7.95, 1.75, 0.45, C.gold);
  edge(s, 7.8, 1.95, 7.3, 2.4); edge(s, 8.1, 1.95, 8.6, 2.4);
  pill(s, "a", 6.95, 2.4, 0.7, 0.34, C.green, C.white, 11);
  pill(s, "c", 8.25, 2.4, 0.7, 0.34, C.green, C.white, 11);
  text(s, "0", 7.25, 1.95, 0.3, 0.25, { fontSize: 9, color: C.muted, margin: 0 });
  text(s, "1", 8.45, 1.95, 0.3, 0.25, { fontSize: 9, color: C.muted, margin: 0 });
  bullets(s, [
    "ASCII 分别是 `01100001` 和 `01100011`，前六位相同，**第一次不同在从 0 起算的第 6 位**。",
    "Patricia 内部结点只记这个分歧位：该位为 0 走一边，为 1 走另一边；**前面六个相同位不再各占一层**。",
    "插入新键：先走到叶、找出首个不同位，再把新分支插到**位号仍保持递增**的位置——否则查找路径会跳过应比较的位。",
  ], 0.5, 3.1, 9.0, 2.0, { fontSize: 12, gap: 8 });
}

// 12.3 Patricia insert code (1)
{
  const s = content("12.3", "12.3 Patricia 树 · code/ch12/trie（上）", "insert 前半：沿位下降到叶，求首个不同位");
  codeBlock(s, `    bool insert(std::string_view key) {
        validate(key);
        if (root_ == nullptr) {
            root_ = make_leaf(key);
            ++size_;
            return true;
        }
        const Node* leaf = descend(key);
        const optional_bit differing = first_differing_bit(leaf->key, key);
        if (!differing.found) {
            return false;  // 已经在树里
        }
        // ...

    [[nodiscard]] const Node* descend(std::string_view key) const {
        const Node* node = root_.get();
        while (node->is_internal()) {
            node = bit_of(key, node->bit) ? node->right.get() : node->left.get();
        }
        return node;
    }`, 0.5, 1.05, 6.4, 4.05, { fontSize: 8.5 });
  callout(s, "descend", "内部结点记着 `bit`：按关键码的那一位走左（0）或右（1），直到叶。路上**只看了少数几位**。", 7.15, 1.05, 2.35, 1.9, { fontSize: 10 });
  callout(s, "和叶比完整关键码", "没有不同位 → 已在树里；有 → 分歧位就是新内部结点要记的位。`contains` 同理：`descend` 后比 `leaf->key == key`。", 7.15, 3.1, 2.35, 2.0, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 12.3 Patricia insert code (2)
{
  const s = content("12.3", "12.3 Patricia 树 · code/ch12/trie（下）", "insert 后半：从根重走，插到位号递增的位置");
  codeBlock(s, `        // ...
        // 在第 differing.index 位上插入一个新的内部结点。
        std::unique_ptr<Node>* slot = &root_;
        while ((*slot)->is_internal() && (*slot)->bit < differing.index) {
            slot = bit_of(key, (*slot)->bit) ? &(*slot)->right : &(*slot)->left;
        }
        auto node = std::make_unique<Node>();
        node->bit = differing.index;
        auto leaf_node = make_leaf(key);
        if (bit_of(key, differing.index)) {
            node->left = std::move(*slot);
            node->right = std::move(leaf_node);
        } else {
            node->right = std::move(*slot);
            node->left = std::move(leaf_node);
        }
        *slot = std::move(node);
        ++size_;
        ++internal_;
        return true;
    }`, 0.5, 1.05, 6.4, 4.05, { fontSize: 8.5 });
  callout(s, "停在哪", [
    "从根重走，停在第一个位号 **≥ 分歧位** 的地方（或叶）。",
    "新内部结点记分歧位：新键该位为 1 → 新叶在右，原子树在左；反之亦然。",
    "位号沿路径**保持递增**，查找才不会跳过应比较的位。",
  ], 7.15, 1.05, 2.35, 2.85, { fontSize: 10, gap: 4 });
  callout(s, "每插一个键", "恰好多**一个内部结点**、一个叶：4 个词 → 3 个内部结点。", 7.15, 4.05, 2.35, 1.05, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// ============================ PART 4 ============================
sectionSlide("12.4", "改进的二叉搜索树", "按访问权重、严格高度平衡、访问局部性改进查找\n最佳 BST（动态规划） · AVL 树 · 伸展树");

// 12.4.1 shapes
{
  const s = content("12.4", "12.4.1 最佳二叉搜索树", "同一批关键码，插入次序不同，长出的 BST 就不同");
  figBox(s, "fig-12-21", 0.5, 1.05, 4.35, 2.2, "图 12.21  按给定次序插入", 9);
  figBox(s, "fig-12-22", 5.15, 1.05, 4.35, 2.2, "图 12.22  同一批关键码倒着插入", 9);
  bullets(s, [
    "原书 K = { xal, wan, wil, zol, yo, xul, yum, wen, wim, zi, yon, xem, wul, zom }。",
    "n 个关键码有 **n!** 种插入次序，但不同次序可能长出同一棵树；真正不同的形状只有 **C(2n, n) / (n+1)** 棵（**Catalan 数**）。",
    "等价问法：中序是 {1, 2, …, n} 时有多少种前序排列——例如 **{2, 3, 1} 不是任何 BST 的前序排列**。",
  ], 0.5, 3.4, 6.1, 1.75, { fontSize: 11, gap: 5 });
  callout(s, "于是问题变成", "这 C(2n, n)/(n+1) 棵树里，**哪一棵检索效率最好**？", 6.85, 3.4, 2.65, 1.7, { fontSize: 11.5 });
}

// 12.4.1 extended tree + ASL
{
  const s = content("12.4", "12.4.1 最佳二叉搜索树", "扩充二叉树：成功代价落在内部结点，失败代价落在外部结点");
  figBox(s, "fig-12-23", 0.5, 1.05, 4.6, 2.5, "图 12.23  扩充二叉树（小方框是外部结点）", 9);
  bullets(s, [
    "空子树补成**外部结点**，每个外部结点代表**一类检索失败**——如 A 代表落在 wim 与 wul 之间的关键码。",
    "外部路径长度 E、内部路径长度 I 满足 **E = I + 2n**。",
    "根为第 0 层：成功检索比较 **lᵢ + 1** 次；失败检索比较 **l′ᵢ** 次（外部结点的层数）。",
  ], 5.35, 1.05, 4.15, 2.55, { fontSize: 11, gap: 6 });
  card(s, 0.5, 3.7, 9.0, 1.4, C.dark);
  text(s, "平均比较次数（带权）", 0.75, 3.78, 4, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "ASL(n) = [ Σᵢ₌₁ⁿ pᵢ (lᵢ + 1) + Σᵢ₌₀ⁿ qᵢ l′ᵢ ] / W ，  W = Σ pᵢ + Σ qᵢ", 0.75, 4.1, 8.6, 0.45, { fontSize: 16, bold: true, color: C.white, margin: 0 });
  text(s, "pᵢ：检索第 i 个关键码的频率；qᵢ：落在第 i 与第 i+1 个关键码之间的频率。二者叫**权**。ASL 最小的那棵叫**最佳二叉搜索树**。", 0.75, 4.55, 8.6, 0.5, { fontSize: 10.5, color: C.mint, margin: 0 });
}

// 12.4.1 equal weights
{
  const s = content("12.4", "12.4.1 最佳二叉搜索树", "等权时：让内部路径长度 I 最小，即形状尽量平衡");
  figBox(s, "fig-12-24", 0.5, 1.05, 4.35, 1.6, "图 12.24  等权时的最佳 BST", 9);
  figBox(s, "fig-12-25", 0.5, 2.8, 4.35, 2.3, "图 12.25  最坏：退化成链，O(n)", 9);
  bullets(s, [
    "pᵢ / W = qᵢ / W = 1 / (2n+1)，用 E = I + 2n 化简得 **ASL(n) = (2I + 3n) / (2n + 1)**。",
    "路径长度为 0 的结点只有 1 个，为 1 的至多 2 个，为 2 的至多 4 个…… → I 至少是 0, 1, 1, 2, 2, 2, 2, 3, … 的前 n 项和 **Σ⌊log₂k⌋**。",
    "**只有最下面两层结点的度数可以小于 2** 时达到，ASL 为 **Θ(log n)**。构造：排序后用二分法依次插入。",
  ], 5.1, 1.05, 4.4, 2.85, { fontSize: 11, gap: 6 });
  callout(s, "随便插入会怎样", "对全部 C(2n, n)/(n+1) 棵 BST 平均，检索次数仍是 **O(log₂ n)**：大多数 BST 和最佳 BST 差别不大，只有少数情况是 O(n)。", 5.1, 3.95, 4.4, 1.15, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 12.4.1 unequal weights
{
  const s = content("12.4", "12.4.1 最佳二叉搜索树", "不等权时：最佳的形状未必最平衡");
  figBox(s, "fig-12-26", 0.5, 1.05, 5.0, 2.9, "图 12.26  具有不等权结点的二叉搜索树", 9);
  table(s, [
    ["", "成功 Σp(l+1)", "失败 Σq·l′", "ASL"],
    ["左：B 为根", { t: "1 + 10 + 4 = 15", align: "center" }, { t: "9 × 2 = 18", align: "center" }, { t: "**33 / 17**", align: "center" }],
    ["右：A 为根", { t: "5 + 2 + 6 = 13", align: "center" }, { t: "4 + 6 + 6 = 16", align: "center" }, { t: "**29 / 17**", align: "center", color: C.ok }],
  ], 0.5, 4.08, 5.0, [1.1, 1.5, 1.4, 1.0], { fontSize: 10, rowH: 0.34, tight: true });
  bullets(s, [
    "权：A = 5、B = 1、C = 2；四个外部结点 4、3、1、1；**W = 17**。",
    "成功查找按 **层数 + 1** 计，失败查找按外部结点的**层数**计。",
    "权大的 A（5）往根靠，哪怕整棵树因此歪一些，ASL 反而更小。",
  ], 5.75, 1.05, 3.75, 2.6, { fontSize: 11.5, gap: 8 });
  callout(s, "所以要动态规划", "不能简单「取中位数当根」——要在每个区间里**枚举根**。", 5.75, 3.8, 3.75, 1.3, { fontSize: 11.5 });
}

// 12.4.1 DP principle
{
  const s = content("12.4", "12.4.1 最佳二叉搜索树", "动态规划：最佳 BST 的任何子树也是最佳 BST");
  bullets(s, [
    "t(i, j)：以 key₍ᵢ₊₁₎ … keyⱼ 为内部结点、权为 (qᵢ, pᵢ₊₁, qᵢ₊₁, …, pⱼ, qⱼ) 的最佳 BST；根 r(i, j)，开销 C(i, j)。",
    "W(i, j) = pᵢ₊₁ + ⋯ + pⱼ + qᵢ + ⋯ + qⱼ。",
    "先构造 1 个结点的 t(0,1), t(1,2), …；再 2 个结点的 t(0,2), t(1,3), …；直到 t(0, n)。**大树用前面构造的小树当子树。**",
  ], 0.5, 1.05, 5.8, 2.3, { fontSize: 11, gap: 6 });
  card(s, 0.5, 3.4, 5.8, 0.85, C.dark);
  text(s, "C(i, j) = W(i, j) + min₍ᵢ<ₖ≤ⱼ₎ ( C(i, k−1) + C(k, j) )", 0.65, 3.4, 5.5, 0.85, { fontSize: 16, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
  text(s, "以 keyₖ 为根：左子树 t(i, k−1)、右子树 t(k, j) 都已求出。**每换一个根都要再加一次 W(i, j)**——挂到新根下面后，区间内每种查找的深度都加 1。`root[i][j]` 是重建树时的路线图。", 0.5, 4.35, 5.8, 0.8, { fontSize: 10.5 });
  figBox(s, "fig-12-27", 6.55, 1.05, 2.95, 4.05, "图 12.27  按区间由短到长构造", 9);
}

// 12.4.1 code part 1
{
  const s = content("12.4", "12.4.1 最佳 BST · code/ch12/optimal_bst（上）", "optimal_bst：校验权数，初始化空区间");
  codeBlock(s, `struct OptimalBstResult {
    std::vector<std::vector<long long>> cost;
    std::vector<std::vector<std::size_t>> root;
};

inline OptimalBstResult optimal_bst(const std::vector<int>& successful,
                                    const std::vector<int>& unsuccessful) {
    if (unsuccessful.size() != successful.size() + 1) {
        throw std::invalid_argument("weight count");
    }
    const std::size_t count = successful.size();
    OptimalBstResult result{
        std::vector<std::vector<long long>>(count + 1,
                                            std::vector<long long>(count + 1, 0)),
        std::vector<std::vector<std::size_t>>(count + 1,
                                              std::vector<std::size_t>(count + 1, 0))};
    std::vector<std::vector<long long>> weight(
        count + 1, std::vector<long long>(count + 1, 0));

    for (std::size_t index = 0; index <= count; ++index) {
        // The book's c table measures internal-key comparison cost; an empty
        // interval has zero c cost while its unsuccessful weight remains in w.
        result.cost[index][index] = 0;
        weight[index][index] = unsuccessful[index];
    }
    // ...`, 0.5, 1.05, 6.6, 4.05, { fontSize: 8 });
  callout(s, "输入与边界", [
    "成功权 `p[1..n]`，失败权 `q[0..n]` → 必须 `q.size() == p.size() + 1`。",
    "空区间：`cost[i][i] = 0`，`weight[i][i] = q[i]`。",
    "空树：`p = {}`、`q = {某个失败权}`，代价 0。",
  ], 7.35, 1.05, 2.15, 4.05, { fontSize: 10, gap: 6 });
}

// 12.4.1 code part 2
{
  const s = content("12.4", "12.4.1 最佳 BST · code/ch12/optimal_bst（下）", "按区间长度递增，枚举每个根");
  codeBlock(s, `    // ...
    for (std::size_t length = 1; length <= count; ++length) {
        for (std::size_t first = 0; first + length <= count; ++first) {
            const std::size_t last = first + length;
            weight[first][last] = weight[first][last - 1] + successful[last - 1] +
                                  unsuccessful[last];
            result.cost[first][last] = std::numeric_limits<long long>::max() / 4;
            for (std::size_t root = first + 1; root <= last; ++root) {
                const long long candidate = result.cost[first][root - 1] +
                                            result.cost[root][last] + weight[first][last];
                if (candidate < result.cost[first][last]) {
                    result.cost[first][last] = candidate;
                    result.root[first][last] = root;
                }
            }
        }
    }
    return result;
}`, 0.5, 1.05, 6.6, 3.2, { fontSize: 8 });
  text(s, "三重循环：区间长度 × 起点 × 根 → 朴素实现 **O(n³)**。", 0.5, 4.35, 6.6, 0.4, { fontSize: 12 });
  callout(s, "为什么按长度递增", "算 `[i, j]` 选根 r 时，必须已经知道 `[i, r−1]` 和 `[r, j]` 的最优代价——它们**都比当前区间短**。", 7.35, 1.05, 2.15, 2.5, { fontSize: 10 });
  callout(s, "weight 递推", "`w[i][j] = w[i][j−1] + p[j] + q[j]`：每格 O(1)。", 7.35, 3.7, 2.15, 1.4, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 12.4.1 trace
{
  const s = content("12.4", "12.4.1 最佳 BST · 逐层核算", "p = {1,5,4,3}，q = {5,4,3,2,1}：最后一格怎样得到 57");
  const R = (iv, w, c, r, hl) => [{ t: iv, mono: true, align: "center", fill: hl }, { t: String(w), align: "center", fill: hl }, { t: String(c), align: "center", fill: hl, bold: !!hl }, { t: String(r), align: "center", fill: hl, bold: !!hl }];
  table(s, [
    ["区间", "总权 w", "最优代价 c", "根"],
    R("[0,1]", 10, 10, 1), R("[1,2]", 12, 12, 2), R("[2,3]", 9, 9, 3), R("[3,4]", 6, 6, 4),
    R("[0,2]", 18, 28, 2), R("[1,3]", 18, 27, 2), R("[2,4]", 13, 19, 3),
    R("[0,3]", 24, 43, 2), R("[1,4]", 22, 40, 3),
    R("[0,4]", 28, 57, 2, "FCE9C0"),
  ], 0.5, 1.02, 4.0, [1.0, 1.0, 1.1, 0.9], { fontSize: 10, rowH: 0.3, tight: true });
  card(s, 4.75, 1.02, 4.75, 1.95, C.code);
  text(s, "[0,4] 的四个候选：c[0][k−1] + c[k][4] + 28", 4.9, 1.1, 4.5, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  const cand = [["k = 1", "0 + 40 + 28 = 68"], ["k = 2", "10 + 19 + 28 = 57"], ["k = 3", "28 + 6 + 28 = 62"], ["k = 4", "43 + 0 + 28 = 71"]];
  cand.forEach((c, i) => {
    const hl = i === 1;
    text(s, c[0], 4.95, 1.45 + i * 0.36, 0.9, 0.32, { fontSize: 11, fontFace: MONO, bold: hl, color: hl ? C.ok : C.text, margin: 0 });
    text(s, c[1], 5.9, 1.45 + i * 0.36, 3.4, 0.32, { fontSize: 11, fontFace: MONO, bold: hl, color: hl ? C.ok : C.text, margin: 0 });
  });
  // reconstructed tree
  card(s, 4.75, 3.1, 2.3, 2.0, C.code);
  text(s, "按根表重建", 4.85, 3.15, 2.1, 0.28, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  edge(s, 5.9, 3.7, 5.35, 4.2); edge(s, 5.9, 3.7, 6.45, 4.2); edge(s, 6.45, 4.2, 6.8, 4.7);
  tnode(s, "2", 5.9, 3.7, 0.38, C.gold); tnode(s, "1", 5.35, 4.2, 0.38); tnode(s, "3", 6.45, 4.2, 0.38); tnode(s, "4", 6.8, 4.7, 0.38);
  callout(s, "这张表能抓什么错", "复算了演示输出；也能抓住把 `weight` **漏加或多加一次**的实现错误。", 7.2, 3.1, 2.3, 2.0, { fontSize: 10 });
  text(s, "root[0][4] = 2 → 左 [0,1] 根 1；右 [2,4] 根 3 → 其右 [3,4] 根 4。", 0.5, 4.45, 4.1, 0.65, { fontSize: 10, color: C.muted, margin: 0 });
}

// 12.4.2 AVL definition
{
  const s = content("12.4", "12.4.2 平衡的二叉搜索树", "AVL 树：任何结点的左右子树高度最多相差 1");
  figBox(s, "fig-12-15", 0.5, 1.05, 4.35, 2.3, "图 12.15  同一批关键码：接近完全 vs 一条链", 9);
  figBox(s, "fig-12-28", 0.5, 3.5, 4.35, 1.6, "图 12.28  (a) AVL 树  (b) 非 AVL 树的 BST", 9);
  text(s, "BST 最好 O(log n)、最坏 O(n)。Adelson-Velskii 和 Landis 发明的 **AVL 树**让 BST 不受输入影响、始终保持平衡。", 5.1, 1.05, 4.4, 0.95, { fontSize: 11.5 });
  const props = ["空二叉树是 AVL 树。", "n 个结点的 AVL 树高度为 **O(log n)**。", "左右子树 T_L、T_R 也是 AVL 树，且 **|h_L − h_R| ≤ 1**。"];
  props.forEach((p, i) => {
    numCircle(s, i + 1, 5.15, 2.12 + i * 0.58, 0.36, C.green);
    text(s, p, 5.65, 2.07 + i * 0.58, 3.85, 0.48, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  callout(s, "关键问题", "高度 O(log n) → 查找、插入、删除都 O(log n)。难点是：**任何操作之后都保持 AVL 特性**，而且维护本身也要在 O(log n) 内完成。", 5.1, 3.85, 4.4, 1.25, { fontSize: 10.5 });
}

// 12.4.2 balance factor + four cases
{
  const s = content("12.4", "12.4.2 AVL 树", "平衡因子与四种失衡：LL、LR、RR、RL");
  figBox(s, "fig-12-29", 0.5, 1.05, 2.6, 2.1, "图 12.29  带平衡因子", 9);
  text(s, "平衡因子 = **右子树高 − 左子树高**，只允许 −1、0、1。插入使某祖先变成 **±2**：不平衡结点一定在根到新结点的路径上。", 3.3, 1.05, 6.2, 0.75, { fontSize: 11.5 });
  table(s, [
    ["情形", "新结点位置（失衡结点 A）", "做法"],
    [{ t: "LL", bold: true }, "A 的左孩子的左子树", "在 A 上**右旋**一次"],
    [{ t: "RR", bold: true }, "A 的右孩子的右子树", "在 A 上**左旋**一次"],
    [{ t: "LR", bold: true, color: C.bad }, "A 的左孩子的右子树", "先在左孩子上左旋，再在 A 上右旋"],
    [{ t: "RL", bold: true, color: C.bad }, "A 的右孩子的左子树", "先在右孩子上右旋，再在 A 上左旋"],
  ], 3.3, 1.85, 6.2, [0.7, 2.4, 3.1], { fontSize: 10.5, rowH: 0.28, tight: true });
  figBox(s, "fig-12-31", 0.5, 3.4, 5.6, 1.7, "图 12.31  (a) LL  (b) LR  (c) RR  (d) RL", 9);
  callout(s, "插入时子树根的三类变化", [
    "原来平衡 → 变重：父结点状态也变。",
    "原来一边重 → 变平衡：**子树高度未变**，父结点不变。",
    "原来一边重、又加到重的一边 → **危急结点**，要旋转。",
  ], 6.3, 3.45, 3.2, 1.65, { fontSize: 9.5, gap: 2 });
}

// 12.4.2 why rotation is correct
{
  const s = content("12.4", "12.4.2 AVL 树", "旋转为什么一定对：把 7 个部分排成一个数组");
  text(s, "重构：从新结点 u 往上找**最近的不平衡祖先 a**（到根都没有就返回）；a 往 u 方向的第一、二个子结点为 b、c。3 个结点 + 4 棵子树按中序放进数组：", 0.5, 1.02, 9.0, 0.65, { fontSize: 11.5 });
  cells(s, 1.6, 1.8, ["T₀", "a", "T₁", "c", "T₂", "b", "T₃"], { cw: 0.95, ch: 0.5, fs: 14, fills: [C.mint, C.gold, C.mint, C.gold, C.mint, C.gold, C.mint] });
  text(s, "T₀ < a < T₁ < c < T₂ < b < T₃", 1.6, 2.35, 6.65, 0.35, { fontSize: 13, bold: true, color: C.green, align: "center", margin: 0 });
  figBox(s, "fig-12-32", 0.5, 2.8, 4.35, 2.3, "图 12.32  LL 型：单旋转（RR 对称）", 9);
  figBox(s, "fig-12-33", 5.15, 2.8, 2.6, 2.3, "图 12.33  RL 型双旋转", 9);
  callout(s, "结论", [
    "旋转只是把这 7 部分**重新组成 AVL 结构**，中序次序不变。",
    "只改几个指针；新子树高 **h + 2**，与插入前相同 → 更高层不受影响。",
  ], 7.95, 2.8, 1.55, 2.3, { fontSize: 9, gap: 3 });
}

// 12.4.2 minimal inputs
{
  const s = content("12.4", "12.4.2 AVL 树", "四种情形的最小输入：正好当旋转单元测试");
  codeBlock(s, `LL（左左，一次右旋）          RR（右右，一次左旋）
      C                           A
     /                             \\
    B               →               B
   /                                 \\
  A                                   C

LR（左右，先左旋再右旋）      RL（右左，先右旋再左旋）
      C                           A
     /                             \\
    A               →               B
     \\                             / \\
      B                           A   C`, 0.5, 1.05, 5.6, 3.0, { fontSize: 10, lang: "text" });
  text(s, "中序始终保持 A < B < C。", 0.5, 4.1, 5.6, 0.3, { fontSize: 11, color: C.muted });
  table(s, [
    ["插入次序", "情形", "旋转"],
    [{ t: "3, 2, 1", mono: true }, { t: "LL", bold: true }, "在 3 上右旋"],
    [{ t: "1, 2, 3", mono: true }, { t: "RR", bold: true }, "在 1 上左旋"],
    [{ t: "3, 1, 2", mono: true }, { t: "LR", bold: true }, "先在 1 上左旋，再在 3 上右旋"],
    [{ t: "1, 3, 2", mono: true }, { t: "RL", bold: true }, "先在 3 上右旋，再在 1 上左旋"],
  ], 6.35, 1.05, 3.15, [0.85, 0.55, 1.75], { fontSize: 9.5, rowH: 0.36, tight: true });
  callout(s, "只测中序不够", "结果都应**以 2 为根**、中序 `1,2,3`。一条退化链的中序也正确——还要查**根、高度和平衡因子**，才能证明旋转真的发生。", 6.35, 3.0, 3.15, 2.1, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 12.4.2 AVL helper code
{
  const s = content("12.4", "12.4.2 AVL 树 · code/ch12/balanced_trees（上）", "高度、平衡因子与两种单旋转");
  codeBlock(s, `    static int height_of(const std::unique_ptr<Node>& node) { return node ? node->height : 0; }

    static void refresh(Node* node) {
        node->height = 1 + std::max(height_of(node->left), height_of(node->right));
    }

    /// 平衡因子：右子树高 − 左子树高。绝对值超过 1 就要旋转。
    static int balance_factor(const std::unique_ptr<Node>& node) {
        return node ? height_of(node->right) - height_of(node->left) : 0;
    }

    static std::unique_ptr<Node> rotate_left(std::unique_ptr<Node> x) {
        auto y = std::move(x->right);
        x->right = std::move(y->left);
        refresh(x.get());
        y->left = std::move(x);
        refresh(y.get());
        return y;
    }

    static std::unique_ptr<Node> rotate_right(std::unique_ptr<Node> y) {
        auto x = std::move(y->left);
        y->left = std::move(x->right);
        refresh(y.get());
        x->right = std::move(y);
        refresh(x.get());
        return x;
    }`, 0.5, 1.05, 6.75, 4.05, { fontSize: 8 });
  callout(s, "结点", "`key`、`height`（空树 0，叶 1）、`unique_ptr` 的 `left` / `right`。实现里存**高度**，平衡因子现算。", 7.45, 1.05, 2.05, 1.85, { fontSize: 9.5 });
  callout(s, "旋转的顺序", "先 `refresh` **下沉**的那个结点，再 `refresh` 新根——新根的高度依赖下沉结点。", 7.45, 3.05, 2.05, 2.05, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
}

// 12.4.2 AVL insert code
{
  const s = content("12.4", "12.4.2 AVL 树 · code/ch12/balanced_trees（中）", "insert：自底向上回溯，第一个失衡的结点按表选旋转");
  codeBlock(s, `    std::unique_ptr<Node> insert(std::unique_ptr<Node> node, int key) {
        if (!node) {
            ++size_;
            return std::make_unique<Node>(key);
        }
        if (key < node->key) {
            node->left = insert(std::move(node->left), key);
        } else if (key > node->key) {
            node->right = insert(std::move(node->right), key);
        } else {
            return node;  // 重复键不插入
        }
        refresh(node.get());
        const int balance = balance_factor(node);
        if (balance > 1) {                       // 右边高
            if (key < node->right->key) {        // RL：先把右孩子右旋
                node->right = rotate_right(std::move(node->right));
            }
            return rotate_left(std::move(node)); // RR / RL 的第二步
        }
        if (balance < -1) {                      // 左边高
            if (key > node->left->key) {         // LR：先把左孩子左旋
                node->left = rotate_left(std::move(node->left));
            }
            return rotate_right(std::move(node));// LL / LR 的第二步
        }
        return node;
    }`, 0.5, 1.02, 6.3, 4.13, { fontSize: 7.9 });
  callout(s, "读法", [
    "递归返回时**逐层** `refresh` + 判平衡——这就是「向上回溯」。",
    "双旋转 = 先把孩子转一下，变成单旋转的形状，**第二步共用**。",
    "用新键和孩子的键比较，判断是**外侧**还是**内侧**。",
  ], 7.05, 1.05, 2.45, 2.9, { fontSize: 10, gap: 4 });
  callout(s, "插入最多转一次", "转完子树高度恢复原值，上面的祖先不再失衡。", 7.05, 4.1, 2.45, 1.0, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 12.4.2 AVL delete
{
  const s = content("12.4", "12.4.2 AVL 树 · code/ch12/balanced_trees（下）", "删除：可能一路向上每层都要转");
  codeBlock(s, `    // ...
            // 两个孩子都在：用右子树的最小键顶上来，再去右子树删掉那个键。
            const Node* successor = node->right.get();
            while (successor->left) {
                successor = successor->left.get();
            }
            node->key = successor->key;
            node->right = erase(std::move(node->right), node->key);
        }
        refresh(node.get());
        const int balance = balance_factor(node);
        if (balance > 1) {
            if (balance_factor(node->right) < 0) {
                node->right = rotate_right(std::move(node->right));
            }
            return rotate_left(std::move(node));
        }
        if (balance < -1) {
            if (balance_factor(node->left) > 0) {
                node->left = rotate_left(std::move(node->left));
            }
            return rotate_right(std::move(node));
        }
        return node;
    }`, 0.5, 1.05, 5.4, 3.5, { fontSize: 8 });
  card(s, 0.5, 4.62, 5.4, 0.5, "FDF0EE");
  text(s, "注意：图 12.36 用**中序前驱**（左子树最大）顶替，代码用**中序后继**（右子树最小）。两者互为镜像、都正确；用代码复现此图，顶替结点和失衡位置会与图不同。", 0.6, 4.62, 5.2, 0.5, { fontSize: 9, margin: 0, valign: "middle" });
  figBox(s, "fig-12-36-ab", 6.1, 1.05, 3.4, 1.45, "", 9);
  figBox(s, "fig-12-36-cde", 6.1, 2.55, 3.4, 1.7, "", 9);
  text(s, "图 12.36  删 c 用中序前驱 m 顶替 → 删 g 后 m 失衡 → 对 m 作 LL → 回溯到 a 又失衡 → 再作 LL。", 6.1, 4.3, 3.4, 0.8, { fontSize: 9, color: C.muted, margin: 0 });
}

// 12.4.2 AVL delete key point + height proof
{
  const s = content("12.4", "12.4.2 AVL 树 · 高度上界", "最「瘦」的 AVL 树：Fibonacci 递推给出 O(log n)");
  figBox(s, "fig-12-37", 0.5, 1.05, 3.8, 2.6, "图 12.37  临界 AVL 树 T₁ … T₄ 与 Tᵢ", 9);
  bullets(s, [
    "Tᵢ 以 Tᵢ₋₁、Tᵢ₋₂ 为左右子树：既不破坏 AVL，又要**结点最少** → 两棵子树高度差必然为 1。",
    "t(1) = 2、t(2) = 4、**t(i) = t(i−1) + t(i−2) + 1** → t(i) = F(i+3) − 1。",
    "F(i) ≈ φⁱ / √5，φ = (1+√5)/2，log₂φ ≈ 0.694 → **i < 1.5 log₂(t(i)+1) − 1**。",
  ], 4.55, 1.05, 4.95, 2.6, { fontSize: 11, gap: 7 });
  table(s, [
    ["i", "1", "2", "3", "4", "5", "6"],
    [{ t: "t(i)", bold: true }, "2", "4", "7", "12", "20", "33"],
    [{ t: "F(i+3) − 1", bold: true }, "3−1", "5−1", "8−1", "13−1", "21−1", "34−1"],
  ], 0.5, 3.8, 5.0, [1.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6], { fontSize: 10.5, rowH: 0.34, align: "center" });
  card(s, 5.75, 3.8, 3.75, 1.3, C.dark);
  text(s, "n 个结点的 AVL 树高度 ≤ 1.5 log₂(n+1)", 5.9, 3.88, 3.5, 0.6, { fontSize: 13, bold: true, color: C.gold, margin: 0 });
  text(s, "平衡不是完美平衡，但足以保证 O(log n)。查找、插入、删除都是单路径局部运算。", 5.9, 4.48, 3.5, 0.6, { fontSize: 9.5, color: C.white, margin: 0 });
}

// 12.4.3 splay intro
{
  const s = content("12.4", "12.4.3 伸展树", "伸展树：不存平衡信息，每次访问后把结点展开到根");
  bullets(s, [
    "由 **Sleator 与 Tarjan** 提出（论文 Self-Adjusting Binary Search Trees，1985；原书误作 Hopcroft 与 Tarjan），与 10.1 节的线性表调整技术同属**自调整数据结构**。",
    "一次访问**不一定**让树更平衡，也不保证树高平衡；但保证**访问的总代价不高**。",
    "它不是新结构，而是**改进 BST 性能的一组规则**。",
    "每次访问结点 x 都做一次**展开**（splaying）：插入、检索 x 时 x 为当前结点；**删除 x 时 x 的父结点**为当前结点；沿路旋转直到当前结点到根。",
  ], 0.5, 1.05, 5.0, 3.4, { fontSize: 11.5, gap: 7 });
  card(s, 5.75, 1.05, 3.75, 2.35, C.code);
  text(s, "三种旋转", 5.9, 1.12, 3.4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  [["单旋转", "x 是根的孩子；与 AVL 单旋转相同"], ["一字形双旋转", "x、父、祖父同向（zig-zig）"], ["之字形双旋转", "x、父、祖父拐弯（zig-zag）"]].forEach((r, i) => {
    pill(s, r[0], 5.9, 1.5 + i * 0.6, 1.35, 0.36, i === 0 ? C.green : C.dark, C.white, 10);
    text(s, r[1], 7.35, 1.47 + i * 0.6, 2.1, 0.45, { fontSize: 9.5, valign: "middle", margin: 0 });
  });
  figBox(s, "fig-12-38", 5.75, 3.55, 3.75, 1.55, "图 12.38  x 已是根的孩子：单旋转", 9);
  callout(s, "一句话", "最近被用到的键下次更容易先碰到；**均摊 O(log n)**。", 0.5, 4.45, 5.0, 0.65, { fontSize: 10.5, fill: C.mint, tcolor: C.dark, tsize: 11 });
}

// 12.4.3 zig-zig / zig-zag
{
  const s = content("12.4", "12.4.3 伸展树", "一字形先转祖父、再转父；之字形先转父、再转祖父");
  figBox(s, "fig-12-39", 0.5, 1.05, 4.6, 1.75, "图 12.39  一字形旋转", 9);
  figBox(s, "fig-12-40", 5.35, 1.05, 4.15, 1.75, "图 12.40  之字形旋转", 9);
  bullets(s, [
    "**一字形**（连续两次同向）：一般不降低树高，但会把**整条同向长链压短**。",
    "**之字形**（先左后右或先右后左）：倾向于让树更平衡——子树 B、C 上升一层，D 下降一层。",
    "两种双旋都把目标**提升两层**；只差一层到根时，再做一次单旋转。",
  ], 0.5, 2.95, 5.2, 2.15, { fontSize: 11, gap: 6 });
  card(s, 5.95, 2.95, 3.55, 2.15, C.code);
  text(s, "例：链 10 → 20 → 30", 6.1, 3.02, 3.3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "访问 30：右–右**一字形**，先围绕 10 左旋，再围绕 20 左旋，30 到根。", 6.1, 3.35, 3.3, 0.7, { fontSize: 10.5, margin: 0 });
  text(s, "若 10 的右孩子是 30、30 的左孩子是 20：访问 20 是右–左**之字形**，两次旋转方向相反。", 6.1, 4.1, 3.3, 0.9, { fontSize: 10.5, margin: 0 });
}

// 12.4.3 example + insert/delete
{
  const s = content("12.4", "12.4.3 伸展树", "检索之后展开到根：四次旋转，整棵树明显变浅");
  figBox(s, "fig-12-41", 0.5, 1.05, 4.0, 4.05, "图 12.41  检索 a 之后把它展开到根", 9);
  text(s, "先 c、b、a **一字形**，再 d、a、e **之字形**，再 f、a、g **之字形**，最后一次**单旋转**让 a 成为根。（内部结点只是索引代号，记录都在外部叶上，所以字母不必中序有序。）", 4.75, 1.05, 4.75, 1.4, { fontSize: 11 });
  callout(s, "插入与删除怎么接上展开", [
    "插入与 BST 相同，**插入后把新结点展开到根**。",
    "按 BST 策略删除结点后，**被删结点的父结点展开到根**。",
  ], 4.75, 2.55, 4.75, 1.3, { fontSize: 10.5, gap: 4 });
  callout(s, "容易忽略的边界", "记录都存在外部结点、内部结点只作索引时：检索到外部结点，由它的**内部父结点**作为当前结点开始调整——**外部结点不能被旋转到根上**。", 4.75, 4.0, 4.75, 1.1, { fontSize: 10.5, fill: "FDF0EE", tcolor: C.bad });
}

// 12.4.3 splay code
{
  const s = content("12.4", "12.4.3 伸展树 · code/ch12/balanced_trees", "splay：把 key（或最接近它的键）旋到 t 的根");
  codeBlock(s, `    static void splay(std::unique_ptr<Node>& t, int key) {
        if (!t || t->key == key) {
            return;
        }
        if (key < t->key) {
            if (!t->left) {
                return;
            }
            if (key < t->left->key) {          // 左-左，一字形
                splay(t->left->left, key);
                rotate_right(t);
            } else if (key > t->left->key) {   // 左-右，之字形
                splay(t->left->right, key);
                if (t->left->right) {
                    rotate_left(t->left);
                }
            }
            if (t->left) {
                rotate_right(t);
            }
        } else {
            // ...
        }
    }`, 0.5, 1.05, 5.8, 4.05, { fontSize: 9 });
  callout(s, "对照规则读", [
    "**一字形**：先 `rotate_right(t)` 转祖父，再转一次 → 目标升两层。",
    "**之字形**：先 `rotate_left(t->left)` 转父，再 `rotate_right(t)` 转祖父。",
    "`else` 分支是右侧的镜像。",
  ], 6.55, 1.05, 2.95, 2.45, { fontSize: 10, gap: 4 });
  callout(s, "查找会改变树形", "`contains` 命中后该键被旋到根，所以它**不是 const**。无需平衡域；子树用 `unique_ptr` 维护所有权。", 6.55, 3.65, 2.95, 1.45, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 12.4.3 amortized + semi-splay
{
  const s = content("12.4", "12.4.3 伸展树", "均摊不等于每次都快；半伸展是一种折中");
  bullets(s, [
    "访问深链末端的**单次代价仍可达 O(n)**；保证的是一串 m 次操作总成本 **O(m log n)**（另加初始势能）。",
    "适合**热点键反复出现**、又不要求单次延迟上界的场景；实时系统要求每次都在确定高度内结束，更适合 AVL 或红黑树。",
    "**半伸展**：对一字形像 AVL 的 LL、RR 那样处理；下一轮从**父结点位置**开始——不需要把目标移到根，旋转更少。",
  ], 0.5, 1.05, 4.9, 3.0, { fontSize: 11, gap: 7 });
  figBox(s, "fig-12-42", 5.6, 1.05, 3.9, 1.5, "图 12.42  半伸展与全伸展的区别", 9);
  figBox(s, "fig-12-45", 5.6, 2.7, 3.9, 2.4, "图 12.45  在图 12.44 上连续读 a、a、b、g", 9);
  callout(s, "热点会浮上来", "**重复访问的键会一路浮到靠近根的位置**——这正是伸展树占便宜的地方。", 0.5, 4.1, 4.9, 1.0, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 12.4 comparison
{
  const s = content("12.4", "12.4 改进的二叉搜索树 · 对照", "三种改进的 BST，各自改进了什么");
  table(s, [
    ["", "最佳 BST", "AVL 树", "伸展树"],
    [{ t: "依据", bold: true }, "访问权重 p、q", "严格高度平衡", "访问局部性"],
    [{ t: "怎么做", bold: true }, "动态规划按区间选根，O(n³)", "平衡因子 + 四种旋转", "访问后一字形 / 之字形旋至根"],
    [{ t: "保证", bold: true }, "带权 ASL 最小（静态集合）", "高度 ≤ 1.5 log₂(n+1)，最坏 O(log n)", "均摊 O(log n)，单次可能 O(n)"],
    [{ t: "额外信息", bold: true }, "cost / root 两张表", "每结点平衡因子（或高度）", "无"],
  ], 0.5, 1.05, 9.0, [1.3, 2.4, 2.75, 2.55], { fontSize: 11, rowH: 0.48 });
  callout(s, "红黑树（第 11 章）", "平衡要求比 AVL 更低；n 个内部结点的红黑树最大树高 **2 log₂(n+1) + 1**，最坏情况比同规模 AVL 高。AVL、伸展树适合**检索较多**；插入删除频繁常用红黑树。", 0.5, 3.6, 4.4, 1.5, { fontSize: 10.5 });
  callout(s, "内存 vs 外存", "BST（红黑树、AVL、伸展树）适合**内存中小规模**的目录；外存文件若以结点为交换单位，找到关键码前平均要访问外存 log₂n 次——文件索引用 **B 树 / B+ 树**。", 5.1, 3.6, 4.4, 1.5, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// Exercises
{
  const s = content("✎", "课后练习（节选）", "几道代表性的题");
  const ex = [
    ["12.1", "写出 3 × 4 数组按行优先时 a₂,₁ 相对首地址的偏移（元素占 1 个单元）；把 4 阶下三角压成一维，给出 a₃,₁ 的下标。"],
    ["12.2", "说明共享广义表为什么不能简单递归释放，并设计引用计数或访问标记方案。"],
    ["12.2", "空闲块按地址顺序是 900、1500、700。举一个请求，使首次、最佳、最坏适应分别选中三块**不同**的空闲区；为什么「能不能满足」本身分辨不出三种策略？"],
    ["12.3", "把 can、car、cat 插入字母 Trie，画出结果，并写出查找 cab 的失败路径。"],
    ["12.4", "从空 AVL 依次插入 1、2、3，画出每次旋转；再插入 0，需要旋转吗？"],
    ["12.4", "伸展树中，之字形和一字形各升几层？为什么半伸展适合连续访问同一结点？"],
  ];
  ex.forEach((e, i) => {
    const y = 1.05 + i * 0.68;
    card(s, 0.5, y, 9.0, 0.6, i % 2 === 0 ? C.code : C.white, "D5DDD9");
    pill(s, e[0], 0.62, y + 0.14, 0.7, 0.32, C.dark, C.gold, 10);
    text(s, e[1], 1.45, y, 7.95, 0.6, { fontSize: 11, valign: "middle", margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["多维数组与矩阵", "行优先 / 列优先把多个下标换成**一个线性地址**；三角、对称矩阵压一半；稀疏矩阵用**十字链表**，一次更新维护两条链。"],
    ["广义表与回收", "头尾分解对应递归；**共享**后不能按树 delete，靠引用计数；引用计数收不回环，**标记–清除**按可达性回收。"],
    ["存储分配", "定长结点用**句柄池**（空闲栈）；变长块用首次 / 最佳 / 最坏适应，**分裂与合并**对付碎片。"],
    ["Trie / Patricia", "按**关键码空间**分解，公共前缀只存一次；Patricia 只记**分歧位**，叶上必须再比完整关键码。"],
    ["改进的 BST", "最佳 BST 用**动态规划**选根；AVL 用**四种旋转**保证 O(log n)；伸展树访问后上移，**均摊** O(log n)。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
