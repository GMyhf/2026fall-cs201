// 第七章 图 —— 由 dsa-modernization/book/ch07-graph.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch07_graph.js ../202609_DSA_07_Graph.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_07_Graph.pptx");

// 讲义中引用的图片（name → 本地路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan") + "/";
const IMAGES = {};
["1", "2", "3", "4", "5", "6", "7", "8", "9", "12", "13", "14", "15", "16", "17", "18", "19", "20", "22", "23",
  "24-abc", "24-def", "25-abc", "25-def", "29"].forEach((k) => { IMAGES["fig-7-" + k] = SCAN + "fig-7-" + k + ".png"; });

(async () => {
  const D = createDeck({ title: "DSA 第七章 图", imgDir: path.join(__dirname, "..", ".cache", "ch07") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;

  // ---- 画小图用的两个积木：顶点圆圈、带箭头（或无向）的边 ----
  function gnode(s, label, cx, cy, o = {}) {
    const r = o.r || 0.2;
    s.addShape(pres.shapes.OVAL, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: o.fill || C.white }, line: { color: o.line || C.dark, width: 1.25 } });
    text(s, label, cx - r, cy - r, 2 * r, 2 * r, { fontSize: o.fs || 11, bold: true, color: o.color || C.dark, align: "center", valign: "middle", margin: 0 });
  }
  function gedge(s, a, b, label, o = {}) {
    const r = o.r || 0.2;
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L;
    const x1 = a[0] + ux * r, y1 = a[1] + uy * r, x2 = b[0] - ux * r, y2 = b[1] - uy * r;
    const line = { color: o.color || C.green, width: o.width || 1.5 };
    if (o.directed !== false) line.endArrowType = "triangle";
    if (o.dash) line.dashType = "dash";
    const w = Math.abs(x2 - x1) < 1e-6 ? 0 : x2 - x1, h = Math.abs(y2 - y1) < 1e-6 ? 0 : y2 - y1;
    s.addShape(pres.shapes.LINE, { x: x1, y: y1, w, h, line });
    if (label !== undefined && label !== "") {
      const off = o.off ?? 0.16;
      const mx = (x1 + x2) / 2 - uy * off, my = (y1 + y2) / 2 + ux * off;
      text(s, String(label), mx - 0.22, my - 0.12, 0.44, 0.24, { fontSize: o.fs || 10, bold: true, color: o.lcolor || C.goldText, align: "center", valign: "middle", margin: 0 });
    }
  }
  const RED = "FDF0EE";
  const GREENBG = "EAF4EF";

// ---- slides（顶层不缩进，避免改动模板字符串里的代码缩进）----
// =====================================================================
// 1. Title
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第七章  图",
  subtitle: "Graph：前驱和后继都不加限制的结构",
  topics: "图的定义与术语 · 图 ADT 与接口约定\n相邻矩阵 / 邻接表 / 十字链表 · 实测：存储量差 300 倍\nDFS / BFS 周游 · 拓扑排序与环检测\nDijkstra · Floyd · MST 性质 · Prim · Kruskal",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 2. Three questions
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["同一张图，邻接矩阵和邻接表差在哪里？", "**答案不变，代价全变**：存储量 V² 对 V+E；复杂度由「算法 + 存储结构」一起决定。"],
    ["从一个点能走到哪里？任务按什么顺序做？", "**DFS / BFS** 是树周游的推广；**拓扑排序**排出先修顺序，顺便检测有没有环。"],
    ["「最短的路」和「最省的网」是一回事吗？", "不是：**Dijkstra / Floyd** 让路径总权最小；**Prim / Kruskal** 让连通全部顶点的总权最小。"],
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
    { text: "先分清题目属于哪一种，再选算法；", options: { color: C.white } },
    { text: "换存储方式不该换答案，只该换代价", options: { color: C.gold, bold: true } },
    { text: "。", options: { color: C.white } },
  ], { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 3. Roadmap
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["概念与 ADT", ["7.1 定义：有向 / 无向 / 带权", "度、路径、连通分量、强连通", "生成树、网络、有向树", "选算法之前先分清题目", "7.2 图 ADT 与接口约定"]],
    ["存储与周游", ["7.3.1 相邻矩阵", "7.3.2 邻接表：实测对比", "7.3.3 十字链表", "7.4.1 深度优先 DFS", "7.4.2 广度优先 BFS", "7.4.3 拓扑排序"]],
    ["最短路与 MST", ["7.5.1 Dijkstra（+ pre 取路径）", "7.5.2 Floyd", "7.6 MST 性质", "7.6.1 Prim", "7.6.2 Kruskal", "本章小结"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 0 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 2.5, 0.45, { fontSize: 20, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 2.6, 3.0, { fontSize: 12, gap: 8 });
  });
}

// 4. Run first (1)
{
  const s = content("▶", "先跑一遍 · code/ch07/graph/demo.cpp（上）", "一张 5 个顶点的有向带权图：建图 + DFS / BFS");
  codeBlock(s, `#include "modern.hpp"

#include <iostream>

int main() {
    dsa::Graph graph(5);
    graph.add_edge(0, 1, 2);
    graph.add_edge(0, 2, 7);
    graph.add_edge(1, 2, 1);
    graph.add_edge(1, 3, 5);
    graph.add_edge(2, 3, 1);
    graph.add_edge(3, 4, 3);

    std::cout << "DFS(0):";
    for (std::size_t vertex : graph.dfs(0)) {
        std::cout << ' ' << vertex;
    }
    std::cout << "\\nBFS(0):";
    for (std::size_t vertex : graph.bfs(0)) {
        std::cout << ' ' << vertex;
    }
    // ...`, 0.5, 1.05, 5.3, 4.05, { fontSize: 9.5 });
  card(s, 6.05, 1.05, 3.45, 2.5, C.code);
  const P = { 0: [6.45, 2.25], 1: [7.3, 1.55], 2: [7.3, 2.95], 3: [8.2, 2.25], 4: [9.05, 2.25] };
  gedge(s, P[0], P[1], 2, { off: -0.16 });
  gedge(s, P[0], P[2], 7);
  gedge(s, P[1], P[2], 1, { off: -0.14 });
  gedge(s, P[1], P[3], 5, { off: -0.16 });
  gedge(s, P[2], P[3], 1);
  gedge(s, P[3], P[4], 3, { off: -0.16 });
  Object.entries(P).forEach(([k, p]) => gnode(s, k, p[0], p[1]));
  text(s, "0→1(2) 0→2(7) 1→2(1) 1→3(5) 2→3(1) 3→4(3)", 6.1, 3.2, 3.35, 0.3, { fontSize: 9, color: C.muted, align: "center", margin: 0 });
  callout(s, "先猜一猜", [
    "从 0 出发，DFS 和 BFS 的访问次序各是什么？",
    "0 到 4 最短是多少？是先走那条权 7 的直达边 `0→2` 吗？",
  ], 6.05, 3.7, 3.45, 1.4, { fontSize: 10.5 });
}

// 5. Run first (2)
{
  const s = content("▶", "先跑一遍 · code/ch07/graph/demo.cpp（下）", "拓扑序与 Dijkstra：答案是 7");
  codeBlock(s, `    // ...
    const auto topo = graph.topological_sort();
    std::cout << "\\n拓扑序:";
    if (topo) {
        for (std::size_t vertex : *topo) {
            std::cout << ' ' << vertex;
        }
    } else {
        std::cout << " 无（有环）";
    }

    const auto distance = graph.dijkstra(0);
    std::cout << "\\nDijkstra(0->4) = " << distance[4] << '\\n';
}`, 0.5, 1.05, 5.3, 2.55, { fontSize: 9.5 });
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror -Icode/ch07/graph \\\n    code/ch07/graph/demo.cpp -o /tmp/graph-demo", 0.5, 3.7, 5.3, 0.5, { fontSize: 9, color: C.muted, margin: 0 });
  consoleBlock(s, "DFS(0): 0 1 2 3 4\nBFS(0): 0 1 2 3 4\n拓扑序: 0 1 2 3 4\nDijkstra(0->4) = 7", 6.05, 1.05, 3.45, 1.55);
  callout(s, "看到了什么", [
    "最短路是 `0→1→2→3→4`，总权 **2+1+1+3 = 7**——不是直达边 `0→2`（权 7）再往后走（7+1+3 = 11）。",
    "拓扑序返回 `optional`：再加一条 `4→0` 形成环，`topological_sort()` 返回 `nullopt`（空值）。",
  ], 6.05, 2.75, 3.45, 2.35, { fontSize: 10.5 });
  callout(s, "「短」是边权总和", "最短路不一定是经过的边数最少的那条。", 0.5, 4.3, 5.3, 0.8, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 6. Run first: hand trace of Dijkstra on the demo graph
{
  const s = content("▶", "先跑一遍 · 手算核对", "Dijkstra(0) 在这张图上逐轮走一遍");
  const I = "∞";
  const hot = (t) => ({ t, bold: true, color: C.bad, align: "center" });
  const cc = (t) => ({ t, align: "center", mono: true });
  const done = (t) => ({ t, align: "center", color: C.muted, mono: true });
  table(s, [
    ["轮", "选出 u（D 最小的未确定点）", "D[0]", "D[1]", "D[2]", "D[3]", "D[4]"],
    ["初始", "—", cc("0"), cc(I), cc(I), cc(I), cc(I)],
    ["1", { t: "0（D=0）", bold: true }, done("0"), hot("2"), hot("7"), cc(I), cc(I)],
    ["2", { t: "1（D=2）", bold: true }, done("0"), done("2"), hot("3"), hot("7"), cc(I)],
    ["3", { t: "2（D=3）", bold: true }, done("0"), done("2"), done("3"), hot("4"), cc(I)],
    ["4", { t: "3（D=4）", bold: true }, done("0"), done("2"), done("3"), done("4"), hot("7")],
    ["5", { t: "4（D=7）", bold: true }, done("0"), done("2"), done("3"), done("4"), done("7")],
  ], 0.5, 1.1, 6.0, [0.6, 2.4, 0.6, 0.6, 0.6, 0.6, 0.6], { fontSize: 11, rowH: 0.42 });
  text(s, "红色 = 本轮松弛成功而变小的值；灰色 = 已确定、不会再变。", 0.5, 4.15, 6.0, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  callout(s, "第 2 轮是关键", [
    "选出 1 之后，`D[1] + W(1,2) = 2 + 1 = 3 < 7`：到 2 的距离从 7 **松弛**成 3。",
    "直达边 `0→2` 的 7 就此作废，路径改走 `0→1→2`。",
    "5 轮后 `D = [0, 2, 3, 4, 7]`，与程序输出一致。",
  ], 6.75, 1.1, 2.75, 3.95, { fontSize: 11 });
}

// ============================ PART 1 ============================
sectionSlide("Part 1 · 7.1", "图的定义和基本术语", "有向 / 无向 / 带权 · 度与路径\n连通分量 · 强连通分量 · 生成树 · 网络");

// 7.1 graph is more general
{
  const s = content("7.1", "7.1 图的定义和基本术语", "图比线性结构和树更一般");
  const rows = [["线性结构", "唯一前驱、唯一后继", C.mint], ["树", "唯一前驱、多个后继", C.mint], ["图", "前驱和后继的个数都不加限制", C.gold]];
  rows.forEach((r, i) => {
    const y = 1.15 + i * 0.62;
    pill(s, r[0], 0.5, y, 1.3, 0.44, i === 2 ? C.dark : C.green, C.white, 12);
    text(s, r[1], 1.95, y, 3.6, 0.44, { fontSize: 13, valign: "middle", margin: 0, bold: i === 2 });
  });
  text(s, "按第 1 章的分类：线性结构和树都可以看成**受限的图**。", 0.5, 3.1, 5.2, 0.4, { fontSize: 12.5 });
  callout(s, "一个典型问题：建通信网", "几个城市之间建通信网，使每两个城市都能直接或间接通话，且总造价尽量低。顶点 = 城市，边 = 线路，边旁的数 = 造价 → 在带权图里找一棵**连通全部顶点、边权之和最小**的树：这就是后面的**最小生成树**。", 0.5, 3.55, 5.3, 1.55, { fontSize: 11 });
  card(s, 6.1, 1.15, 3.4, 3.95, C.code);
  image(s, "fig-7-1", 6.3, 1.3, 3.0, 3.1);
  text(s, "图 7.1  用图描述通信网络（5 个城市）", 6.1, 4.55, 3.4, 0.3, { fontSize: 10, color: C.muted, align: "center" });
}

// 7.1 G=<V,E>
{
  const s = content("7.1", "7.1 图的定义和基本术语", "G = ⟨V, E⟩：无向图与有向图");
  card(s, 0.5, 1.05, 9.0, 1.85, C.code);
  image(s, "fig-7-2", 0.7, 1.12, 8.6, 1.5);
  text(s, "图 7.2  (a) 无向图 G₁   (b) 有向图 G₂ —— 本章反复拿这两张图举例", 0.5, 2.6, 9.0, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "V 是顶点的**有穷非空**集合；E 是边的集合，每条边是一对顶点。",
    "**无向图**：无序对 (v₁, v₂)，(v₁, v₂) 与 (v₂, v₁) 是**同一条边**。",
    "**有向图**：有序对 ⟨v₁, v₂⟩，也叫**弧**；v₁ 是弧尾（起点），v₂ 是弧头（终点）。⟨v₁, v₂⟩ 与 ⟨v₂, v₁⟩ 是**两条不同的弧**。",
  ], 0.5, 3.05, 5.0, 2.1, { fontSize: 12, gap: 6 });
  card(s, 5.75, 3.05, 3.75, 2.05, C.cream);
  s.addText([
    { text: "写成集合", options: { bold: true, color: C.goldText, fontSize: 11.5, breakLine: true } },
    { text: "V(G₁) = {v₀, v₁, v₂, v₃, v₄}", options: { breakLine: true } },
    { text: "E(G₁) = {(v₀,v₂), (v₀,v₃), (v₁,v₃),", options: { breakLine: true } },
    { text: "         (v₁,v₄), (v₂,v₃), (v₂,v₄)}", options: { breakLine: true } },
    { text: "V(G₂) = {v₀, v₁, v₂, v₃}", options: { breakLine: true } },
    { text: "E(G₂) = {⟨v₀,v₁⟩, ⟨v₀,v₂⟩, ⟨v₂,v₃⟩, ⟨v₃,v₀⟩}", options: {} },
  ], { x: 5.9, y: 3.12, w: 3.55, h: 1.9, fontFace: FONT, fontSize: 10, color: C.text, margin: 0, isTextBox: true, valign: "top", paraSpaceAfter: 2 });
}

// 7.1 weights, e range, complete graph
{
  const s = content("7.1", "7.1 图的定义和基本术语", "带权图、边数范围、稀疏与稠密、完全图");
  bullets(s, [
    "边或弧上可以附带**权**：距离、时间或代价。每条边都带权的图叫**带权图**。",
    "本书**不考虑**多重边（同一对顶点之间多于一条边）和自环（顶点到自己的边）。",
    "记 n = 顶点数、e = 边数。边相对少的叫**稀疏图**，相对多的叫**稠密图**。",
    "任意两个顶点之间都有边的图叫**完全图**，取到边数的上限。",
  ], 0.5, 1.1, 5.4, 2.6, { fontSize: 12.5, gap: 8 });
  table(s, [
    ["", "边数 e 的范围"],
    ["无向图", { t: "0 ~ n(n−1)/2", mono: true, bold: true }],
    ["有向图", { t: "0 ~ n(n−1)", mono: true, bold: true }],
  ], 6.2, 1.15, 3.3, [1.1, 2.2], { fontSize: 12, rowH: 0.42 });
  callout(s, "为什么差一倍", "无向完全图每对顶点之间**一条边**；有向完全图每对之间**两条方向相反的弧**。", 6.2, 2.6, 3.3, 1.2, { fontSize: 11 });
  card(s, 0.5, 3.95, 9.0, 1.15, C.code);
  image(s, "fig-7-3", 0.7, 4.0, 6.4, 1.05);
  text(s, "图 7.3  (a) 3 个和 4 个顶点的无向完全图  (b) 顶点数相同的有向完全图", 7.2, 4.1, 2.2, 0.9, { fontSize: 9.5, color: C.muted, valign: "middle" });
}

// 7.1 subgraph, adjacency, degree
{
  const s = content("7.1", "7.1 图的定义和基本术语", "子图、邻接、度：入度与出度");
  card(s, 0.5, 1.05, 9.0, 1.75, C.code);
  image(s, "fig-7-4", 0.7, 1.1, 8.6, 1.45);
  text(s, "图 7.4  图 7.2 的若干子图：(a) 取自无向图 G₁，(b) 取自有向图 G₂", 0.5, 2.52, 9.0, 0.26, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "**子图**：V′ ⊆ V，E′ ⊆ E，且 E′ 里的边只连 V′ 里的顶点，则 G′ = ⟨V′, E′⟩ 是 G 的子图。",
    "一条边所连的两个顶点**互为邻接点**，这条边与这两个顶点**相关联**。有向图还要分清「邻接到」和「邻接自」。",
  ], 0.5, 2.95, 5.4, 2.2, { fontSize: 12, gap: 8 });
  card(s, 6.15, 2.95, 3.35, 2.15, C.cream);
  text(s, "度（degree）", 6.3, 3.03, 3.0, 0.3, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  bullets(s, [
    "与顶点相关联的**边数**。",
    "有向图分**入度**（指进来的弧）与**出度**（指出去的弧）。",
    "度为 0 的顶点是**孤立点**。",
  ], 6.25, 3.4, 3.15, 1.65, { fontSize: 11, gap: 5 });
}

// 7.1 path & connected components
{
  const s = content("7.1", "7.1 图的定义和基本术语", "路径、回路与连通分量");
  bullets(s, [
    "**路径**：从 u 出发、沿边走到 v 的顶点序列；边数是**路径长度**。有向图必须**顺着弧走**。",
    "**回路（环）**：起点和终点相同、且至少含一条边的路径。",
    "**简单路径**：除端点外没有重复顶点的路径。",
    "无向图中任意两点之间都有路径 → **连通**；极大的连通子图叫**连通分量**。",
  ], 0.5, 1.1, 9.0, 1.3, { fontSize: 12.5, gap: 6 });
  card(s, 0.5, 2.4, 6.2, 2.7, C.code);
  image(s, "fig-7-5", 0.65, 2.47, 5.9, 2.56);
  callout(s, "「极大」是什么意思", "再添任何一个顶点，子图就不连通了。\n\n图 7.5：(a) 非连通的无向图 G₃；(b) G₃ 的两个连通分量。", 6.95, 2.4, 2.55, 2.7, { fontSize: 11 });
}

// 7.1 strongly connected
{
  const s = content("7.1", "7.1 图的定义和基本术语", "有向图：强连通与弱连通");
  bullets(s, [
    "**强连通**：任意两点 u、v 都存在 u 到 v **和** v 到 u 的有向路径。",
    "**弱连通**：只要求把有向边看成无向边后连通。",
    "极大的强连通子图叫**强连通分量**。",
  ], 0.5, 1.1, 5.0, 1.8, { fontSize: 13, gap: 8 });
  card(s, 5.75, 1.1, 3.75, 2.55, C.code);
  image(s, "fig-7-6", 5.9, 1.2, 3.45, 2.1);
  text(s, "图 7.6  G₂ 的两个强连通分量", 5.75, 3.32, 3.75, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  callout(s, "读图 7.6", [
    "左边 {v₀, v₂, v₃}：`v₀→v₂→v₃→v₀` 成环，彼此可达。",
    "右边只含 v₁：v₁ **只有入弧**，从 v₁ 回不到 v₀。",
    "所以 G₂ 本身**不是强连通的**——但把弧看成无向边后它是连通的，即弱连通。",
  ], 0.5, 3.0, 5.0, 2.1, { fontSize: 11 });
  callout(s, "对照无向图", "连通分量 ↔ 强连通分量；度 ↔ 入度/出度；边 ↔ 弧。", 5.75, 3.85, 3.75, 1.25, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 7.1 spanning tree, free tree, network
{
  const s = content("7.1", "7.1 图的定义和基本术语", "生成树、自由树与网络");
  card(s, 0.5, 1.05, 6.3, 1.85, C.code);
  image(s, "fig-7-7", 0.65, 1.1, 6.0, 1.55);
  text(s, "图 7.7  G₁ 和 G₂ 的一棵生成树", 0.5, 2.62, 6.3, 0.26, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "**生成树**：包含**全部顶点**、有 **n−1 条边**、因而没有环的连通子图。",
    "生成树上再加一条边**必成环**；边数少于 n−1 则**必不连通**。",
    "不带简单回路的连通无向图叫**自由树**，同样有 n−1 条边。",
    "带权的连通图叫**网络**。边权之和最小的生成树就是**最小生成树**。",
    "有向图里：只有一个顶点入度为 0、其余入度均为 1 的叫**有向树**；弧互不相交、顶点合起来是全图的若干棵有向树构成**生成森林**（图 7.9）。",
  ], 0.5, 2.95, 6.3, 2.2, { fontSize: 11, gap: 4 });
  card(s, 7.05, 1.05, 2.45, 2.75, C.code);
  image(s, "fig-7-8", 7.2, 1.12, 2.15, 2.3);
  text(s, "图 7.8  网络实例 G₄", 7.05, 3.45, 2.45, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  callout(s, "别混淆", "最短路的「短」是**边权总和**最小，不一定是边数最少。", 7.05, 3.95, 2.45, 1.15, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}


// 7.1 choose algorithm table
{
  const s = content("7.1", "7.1 · 选算法之前", "先分清题目：前提决定算法");
  table(s, [
    ["题目", "前提", "结果"],
    ["从一个点能走到哪些点", "任意图", "DFS 或 BFS 的访问序列"],
    ["课程或任务的可行顺序", { t: "有向无环图", bold: true }, "拓扑序；**有环则无解**"],
    ["一个源点到各点的最短路", { t: "边权非负", bold: true, color: C.bad }, "Dijkstra 的距离数组"],
    ["任意两点最短路", "顶点数较小", "Floyd 的距离矩阵"],
    ["连通所有点且总权最小", { t: "无向连通图", bold: true }, "Prim 或 Kruskal 的边集"],
  ], 0.5, 1.1, 9.0, [3.2, 2.2, 3.6], { fontSize: 12.5, rowH: 0.46 });
  callout(s, "读这张表", "每一行的**前提**一栏就是算法成立的条件：负权边上 Dijkstra 不成立；有环的图没有拓扑序；非连通图没有生成树。本章实现把这些「不满足前提」的情况都做成了**可预期的返回值**或**拒绝建图**。", 0.5, 4.0, 9.0, 1.1, { fontSize: 11.5 });
}

// ============================ PART 2 ============================
sectionSlide("Part 2 · 7.2", "图的抽象数据类型", "先说清对外提供哪些运算，再谈怎么存\n顶点没有次序 · 边游标 · 接口约定");

// 7.2 no order
{
  const s = content("7.2", "7.2 图的抽象数据类型", "图的顶点之间本来没有次序");
  bullets(s, [
    "逻辑上，**任何一个顶点**都可以当「第一个」；一个顶点的若干邻接点之间也**没有先后**。",
    "一旦按某种存储结构建起来，次序就被**存储结构定死**了：",
    { t: "邻接矩阵里的次序是**列号**；", sub: true },
    { t: "邻接表里的次序是链表的**插入次序**。", sub: true },
    "所以下文的「第一条边」「下一条边」都是存储结构给出的次序，**不是图本身的性质**。",
  ], 0.5, 1.1, 5.6, 3.0, { fontSize: 12.5, gap: 7 });
  card(s, 6.35, 1.1, 3.15, 2.95, C.dark);
  text(s, "推论", 6.55, 1.2, 2.8, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "同一张图换个存法，DFS 的访问序列就可能不同。", 6.55, 1.55, 2.8, 1.2, { fontSize: 16, bold: true, color: C.white, margin: 0 });
  text(s, "序列不同不是算法不同，是边表次序不同。", 6.55, 2.9, 2.8, 0.9, { fontSize: 11, color: C.mint, margin: 0 });
  callout(s, "本书怎么钉死这点不确定性", "7.3 节把两种存储结构**逐项对拍**：同一张图、同样的建图次序，两种实现必须给出**同一个序列**。", 0.5, 4.2, 9.0, 0.9, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 7.2 original ADT
{
  const s = content("7.2", "7.2 · 原书【代码7.1】（修掉 OCR 断字后）", "原书把运算列成一个抽象类");
  codeBlock(s, `class Graph {                       // 图的抽象数据类型
public:
  int VerticesNum();                // 返回图的顶点个数
  int EdgesNum();                   // 返回图的边数
  Edge FirstEdge(int oneVertex);    // 返回依附于顶点 oneVertex 的第一条边
  Edge NextEdge(Edge preEdge);      // 返回与 preEdge 有相同顶点的下一条边
  bool setEdge(int fromVertex, int toVertex, int weight);  // 添加边
  bool delEdge(int fromVertex, int toVertex);              // 删除边
  bool IsEdge(Edge oneEdge);        // oneEdge 是否是边
  int FromVertex(Edge oneEdge);     // 返回 oneEdge 的始点
  int ToVertex(Edge oneEdge);       // 返回 oneEdge 的终点
  int Weight(Edge oneEdge);         // 返回 oneEdge 的权
};`, 0.5, 1.05, 9.0, 2.3, { fontSize: 9.5, lang: "cpp" });
  text(s, "真正的设计决定是 `Edge`：不把邻居整个交出去，而是给一对**游标运算**，上层算法写成——", 0.5, 3.45, 9.0, 0.35, { fontSize: 12 });
  codeBlock(s, `for (Edge e = G.FirstEdge(v); G.IsEdge(e); e = G.NextEdge(e)) { /* 处理 e */ }`, 0.5, 3.85, 9.0, 0.42, { fontSize: 10 });
  card(s, 0.5, 4.4, 4.4, 0.72, GREENBG);
  text(s, "好处：DFS、拓扑、Dijkstra 只依赖这四个运算，**不依赖矩阵还是链表**。", 0.62, 4.4, 4.2, 0.72, { fontSize: 10.5, valign: "middle", margin: 0 });
  card(s, 5.1, 4.4, 4.4, 0.72, RED);
  text(s, "代价：换存法就要重写游标；`IsEdge` 兼任「是不是边」和「游标到头」两种含义。", 5.22, 4.4, 4.2, 0.72, { fontSize: 10.5, valign: "middle", margin: 0 });
}

// 7.2 legacy issues
{
  const s = content("7.2", "7.2 · 原书【代码7.2】的可复核问题", "基类实现为什么不能照抄");
  const issues = [
    ["裸数组没有复制控制", "`Mark`、`Indegree` 在构造里 `new`、只在析构里 `delete[]`，没有拷贝构造和赋值运算符 → 按值传一次图就会**二次释放**。"],
    ["数据成员是 public", "`numVertex`、`numEdge` 谁都能改坏。"],
    ["权为 0 的边「不存在」", "`IsEdge` 用 `oneEdge.weight > 0` 判断边是否存在 → **权为 0 的合法边被判成不存在**。"],
    ["OCR 断字", "标识符被空格切断（`num Vertex = num Vert`），不是可编译的 C++。"],
  ];
  issues.forEach((it, i) => {
    const y = 1.05 + i * 0.74;
    numCircle(s, i + 1, 0.55, y + 0.14, 0.4, i === 2 ? C.bad : C.dark);
    text(s, it[0], 1.1, y, 2.3, 0.7, { fontSize: 12.5, bold: true, color: i === 2 ? C.bad : C.dark, valign: "middle", margin: 0 });
    text(s, it[1], 3.4, y, 6.1, 0.7, { fontSize: 11, valign: "middle", margin: 0 });
  });
  callout(s, "本书的做法", "不复刻这个抽象基类，直接把运算定义在两个可运行的类上：`Graph`（邻接矩阵，code/ch07/graph）和 `GraphList`（邻接表，code/ch07/adjacency_list）。", 0.5, 4.1, 9.0, 1.0, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 7.2 mapping table
{
  const s = content("7.2", "7.2 图的抽象数据类型", "原书运算 → 本书写法");
  table(s, [
    ["原书运算", "干什么", "本书写法"],
    [{ t: "Graph(int numVert)", mono: true }, "指定顶点数建一张空图", "`Graph::Graph`、`GraphList::GraphList`"],
    [{ t: "VerticesNum()", mono: true }, "返回顶点个数", "`Graph::vertices`、`GraphList::vertices`"],
    [{ t: "setEdge(f, t, w)", mono: true }, "添加一条边", "`add_edge`（末参选有向/无向）"],
    [{ t: "IsEdge(e) / Weight(e)", mono: true }, "问某条边在不在、权多少", "矩阵直接读 `adjacency_`；邻接表 `weight` 无边返回空"],
    [{ t: "FirstEdge / NextEdge", mono: true }, "逐条走一个顶点的出边", "矩阵扫一行；邻接表 `neighbors` 返回边表"],
    ["—", "周游、拓扑、最短路、MST", "`dfs` `bfs` `topological_sort` `dijkstra` `floyd` `prim` `kruskal`"],
  ], 0.5, 1.05, 9.0, [2.2, 2.3, 4.5], { fontSize: 10.5, rowH: 0.4 });
  callout(s, "为什么没有 delEdge", "后面七个算法都不删边。凭空加一个没有测试覆盖的运算，只会多一处**无人验证的代码**；需要时按 D-001 的规矩补，**连测试一起补**。", 0.5, 4.05, 9.0, 1.05, { fontSize: 11 });
}

// 7.2 interface conventions
{
  const s = content("7.2", "7.2 · 贯穿全章的接口约定", "「有环」「不连通」不是异常，是可预期的结果");
  table(s, [
    ["情况", "性质", "接口怎么表达"],
    ["图里有环 → 没有拓扑序", { t: "可预期结果", color: C.ok, bold: true }, "`topological_sort` 返回空 `optional`"],
    ["图不连通 → 没有生成树", { t: "可预期结果", color: C.ok, bold: true }, "`prim`、`kruskal` 返回空 `optional`"],
    ["两点之间没有边", { t: "可预期结果", color: C.ok, bold: true }, "`GraphList::weight` 返回空"],
    ["顶点下标越界", { t: "用法错误", color: C.bad, bold: true }, "抛 `std::out_of_range`"],
    ["负权边", { t: "用法错误", color: C.bad, bold: true }, "抛 `std::invalid_argument`"],
    ["权 ≥ infinity", { t: "用法错误", color: C.bad, bold: true }, "抛 `std::invalid_argument`"],
  ], 0.5, 1.05, 5.9, [2.3, 1.2, 2.4], { fontSize: 10.5, rowH: 0.44 });
  callout(s, "⚠ 已知风险", "全部七个算法用**邻接矩阵**实现；DFS 仍是**递归**写法，深图有栈溢出风险。", 0.5, 4.3, 5.9, 0.8, { fontSize: 10, fill: RED, tcolor: C.bad });
  callout(s, "为什么大权也要拒绝", "`infinity` 在矩阵里兼任「无边」。这么大的权若被收下，后面所有算法都会把它当成没有边，而且**一声不吭**。", 6.65, 1.05, 2.85, 2.0, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  callout(s, "原书的做法", "把这些情况打印到 `cout`。容器里做输出，调用者**既拿不到结果也没法测试**。", 6.65, 3.2, 2.85, 1.9, { fontSize: 10.5 });
}

// ============================ PART 3 ============================
sectionSlide("Part 3 · 7.3", "图的存储结构", "相邻矩阵 · 邻接表 · 十字链表\n换存储方式不该换答案，只该换代价");


// 7.3.1 unweighted matrices
{
  const s = content("7.3.1", "7.3.1 相邻矩阵（邻接矩阵）", "不带权：A[i, j] = 1 表示 (vᵢ, vⱼ) ∈ E");
  const one = (t) => (t === "1" ? { t, bold: true, color: C.green, align: "center" } : { t, align: "center", color: C.muted });
  const G1 = [["0", "0", "1", "1", "0"], ["0", "0", "0", "1", "1"], ["1", "0", "0", "1", "1"], ["1", "1", "1", "0", "0"], ["0", "1", "1", "0", "0"]];
  const G2 = [["0", "1", "1", "0"], ["0", "0", "0", "0"], ["0", "0", "0", "1"], ["1", "0", "0", "0"]];
  text(s, "(a) 无向图 G₁", 0.5, 1.05, 4.2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [["A(G₁)", "v₀", "v₁", "v₂", "v₃", "v₄"], ...G1.map((r, i) => [{ t: "v" + "₀₁₂₃₄"[i], bold: true, align: "center" }, ...r.map(one)])],
    0.5, 1.4, 4.2, [0.95, 0.65, 0.65, 0.65, 0.65, 0.65], { fontSize: 12, rowH: 0.38, align: "center" });
  text(s, "(b) 有向图 G₂", 5.15, 1.05, 4.2, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [["A(G₂)", "v₀", "v₁", "v₂", "v₃"], ...G2.map((r, i) => [{ t: "v" + "₀₁₂₃"[i], bold: true, align: "center" }, ...r.map(one)])],
    5.15, 1.4, 3.55, [0.95, 0.65, 0.65, 0.65, 0.65], { fontSize: 12, rowH: 0.38, align: "center" });
  callout(s, "无向图", "矩阵**一定对称**；顶点 vᵢ 的度 = 第 i 行（或第 i 列）之和。", 0.5, 3.85, 4.35, 1.25, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
  callout(s, "有向图", "矩阵**不一定对称**；第 i 行之和是**出度**，第 i 列之和是**入度**。例：v₀ 出度 2、入度 1。", 5.15, 3.85, 4.35, 1.25, { fontSize: 11.5 });
}

// 7.3.1 weighted matrix
{
  const s = content("7.3.1", "7.3.1 相邻矩阵 · 带权图", "带权图把 1 换成权值，无边记 ∞");
  const w = (t) => ({ t, align: "center", mono: true, bold: t !== "∞" && t !== "0", color: t === "∞" ? C.muted : C.text });
  table(s, [
    ["A(G₄)", "v₀", "v₁", "v₂", "v₃"],
    [{ t: "v₀", bold: true, align: "center" }, w("0"), w("3"), w("∞"), w("15")],
    [{ t: "v₁", bold: true, align: "center" }, w("3"), w("0"), w("4"), w("9")],
    [{ t: "v₂", bold: true, align: "center" }, w("∞"), w("4"), w("0"), w("6")],
    [{ t: "v₃", bold: true, align: "center" }, w("15"), w("9"), w("6"), w("0")],
  ], 0.5, 1.1, 3.9, [0.9, 0.75, 0.75, 0.75, 0.75], { fontSize: 13, rowH: 0.42, align: "center" });
  card(s, 4.65, 1.1, 1.7, 2.1, C.code);
  image(s, "fig-7-8", 4.75, 1.15, 1.5, 2.0);
  text(s, "图 7.11  G₄ 及其相邻矩阵：对角线是 0（到自己的距离为 0）", 0.5, 3.3, 5.9, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  callout(s, "⚠ 为什么不用 0 表示无边", "**权为 0 的边是合法的**，用 0 兼任「无边」会把它误判掉——这正是原书 `IsEdge` 的 bug。本书用 `infinity` 表示无边。", 6.6, 1.1, 2.9, 2.5, { fontSize: 11, fill: RED, tcolor: C.bad });
  card(s, 0.5, 3.75, 9.0, 1.35, C.code);
  text(s, "代价", 0.7, 3.83, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  bullets(s, [
    "空间 **O(V²)**，无论实际有多少条边；查询两点是否相邻 **O(1)**。",
    "扫描一个顶点的全部邻居要扫完整行，遍历全图通常 **O(V²)** → 适合稠密图，以及 Floyd、Prim 这类频繁随机访问矩阵元素的算法。",
  ], 0.65, 4.15, 8.7, 0.95, { fontSize: 11.5, gap: 3 });
}

// 7.3.1 Graph build code
{
  const s = content("7.3.1", "7.3.1 · code/ch07/graph/modern.hpp", "Graph：构造与 add_edge");
  codeBlock(s, `class Graph {
public:
    /// 邻接矩阵里的「无边」。边权必须满足 0 <= weight < infinity。
    static constexpr int infinity = std::numeric_limits<int>::max() / 4;
    // ...
    explicit Graph(std::size_t count) : adjacency_(count, std::vector<int>(count, infinity)) {
        for (std::size_t vertex = 0; vertex < count; ++vertex) {
            adjacency_[vertex][vertex] = 0;
        }
    }

    [[nodiscard]] std::size_t vertices() const noexcept { return adjacency_.size(); }

    void add_edge(std::size_t from, std::size_t to, int weight, bool directed = true) {
        check_vertex(from);
        check_vertex(to);
        if (weight < 0) {
            throw std::invalid_argument("negative edge");
        }
        if (weight >= infinity) {  // infinity 表示「无边」，这么大的权存进去就被当成没有边
            throw std::invalid_argument("edge weight must be below Graph::infinity");
        }
        adjacency_[from][to] = weight;
        if (!directed) {
            adjacency_[to][from] = weight;
        }
    }`, 0.5, 1.05, 9.0, 4.05, { fontSize: 9, hl: [8, 22, 24] });
}


// 7.3.2 adjacency list concept
{
  const s = content("7.3.2", "7.3.2 邻接表", "每个顶点挂一张出边表，只存实际存在的边");
  card(s, 0.5, 1.05, 5.2, 2.05, C.code);
  image(s, "fig-7-12", 0.6, 1.1, 5.0, 1.68);
  text(s, "图 7.12  无向图 G₁ 的邻接表表示", 0.5, 2.8, 5.2, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  bullets(s, [
    "顶点数组的每一项挂一条链，链上是它的邻接点。",
    "无向图里**一条边出现两次** → 边表结点共 **2e** 个。",
    "有向图的一条弧只出现一次，vᵢ 的边表长度就是它的**出度**——所以也叫**出边表**。",
  ], 5.9, 1.05, 3.6, 2.1, { fontSize: 11, gap: 5 });
  card(s, 0.5, 3.25, 9.0, 1.85, C.code);
  image(s, "fig-7-14", 0.6, 3.35, 6.3, 1.25);
  text(s, "图 7.14  带权图 G₄ 的邻接表：边表结点多存一个权", 0.6, 4.68, 6.3, 0.3, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  callout(s, "对应代码", "`GraphList::Edge` 里的 `to` 与 `weight` 就是图 7.14 边表结点的两个域。", 7.05, 3.4, 2.3, 1.55, { fontSize: 10.5 });
}

// 7.3.2 reverse adjacency list
{
  const s = content("7.3.2", "7.3.2 邻接表 · 逆邻接表", "想知道入度？把弧记在弧头那一侧");
  card(s, 0.5, 1.05, 9.0, 2.35, C.code);
  image(s, "fig-7-13", 0.7, 1.12, 8.6, 2.0);
  text(s, "图 7.13  有向图 G₂ 的 (a) 邻接表与 (b) 逆邻接表", 0.5, 3.1, 9.0, 0.28, { fontSize: 9.5, color: C.muted, align: "center" });
  callout(s, "邻接表（出边表）", "vᵢ 的边表长度 = **出度**。想知道入度就得**扫遍整张表**。", 0.5, 3.6, 4.35, 1.5, { fontSize: 11.5 });
  callout(s, "逆邻接表（入边表）", "把每条弧记在**弧头**那一侧；vᵢ 的边表长度 = **入度**——7.4.3 节拓扑排序要的正是入度。", 5.15, 3.6, 4.35, 1.5, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 7.3.2 cost table
{
  const s = content("7.3.2", "7.3.2 邻接表 · 代价对照", "代价随之全变：没有哪种表示法总是更好");
  const m = (t) => ({ t, mono: true });
  table(s, [
    ["", "邻接矩阵", "邻接表"],
    ["存储量", m("V²"), { t: "V + E", mono: true, bold: true, color: C.ok }],
    ["遍历某点的邻居", "O(V)，要扫过整行", { t: "O(deg v)", mono: true, bold: true, color: C.ok }],
    [{ t: "问「(u, v) 之间有没有边」", bold: true }, { t: "O(1)", mono: true, bold: true, color: C.ok }, { t: "O(deg u)", mono: true, bold: true, color: C.bad, fill: RED }],
    ["DFS / BFS 全图", m("O(V²)"), { t: "O(V + E)", mono: true, bold: true, color: C.ok }],
    ["Dijkstra", m("O(V²)"), { t: "O((V+E) log V)（配二叉堆）", mono: true }],
  ], 0.5, 1.1, 6.0, [2.4, 1.6, 2.0], { fontSize: 11.5, rowH: 0.48 });
  callout(s, "注意第三行", "**邻接表在这一项上是吃亏的**：要在 u 的边表里一条条找。\n\n这正是本节要比较的东西——稠密图或频繁问「这两点之间有没有边」时，矩阵反而合适。", 6.75, 1.1, 2.75, 2.9, { fontSize: 11, fill: RED, tcolor: C.bad });
  callout(s, "换存储方式不该换答案，只该换代价", "`code/ch07/graph`（矩阵）与 `code/ch07/adjacency_list`（邻接表）**逐项对拍**：同一张图上 DFS/BFS 序列、拓扑序、Dijkstra 距离向量必须完全相同，外加 30 轮随机图对拍。", 0.5, 4.15, 9.0, 0.95, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}


// 7.3.2 GraphList code (2)
{
  const s = content("7.3.2", "7.3.2 · code/ch07/adjacency_list/modern.hpp", "neighbors / weight / 两个教学计数器");
  codeBlock(s, `    /// 某个顶点的边表。邻接表的核心能力：拿到邻居不必扫过不存在的边。
    [[nodiscard]] const std::vector<Edge>& neighbors(std::size_t vertex) const {
        check_vertex(vertex);
        return adjacency_[vertex];
    }

    [[nodiscard]] std::optional<int> weight(std::size_t from, std::size_t to) const {
        check_vertex(from);
        check_vertex(to);
        for (const Edge& edge : adjacency_[from]) {
            ++scanned_;
            if (edge.to == to) {
                return edge.weight;
            }
        }
        return std::nullopt;  // 没有这条边是预期状态，不是错误
    }

    /// 存储量（按「一个整数算一格」计）。对照矩阵的 $V^2$，稀疏图上差距一目了然。
    [[nodiscard]] std::size_t storage_cells() const noexcept {
        return vertices() + edge_entries() * 2;  // 每条边存 to 和 weight
    }`, 0.5, 1.05, 6.4, 4.05, { fontSize: 8.5, hl: [16] });
  callout(s, "weight：O(deg u)", "要在 from 的边表里**逐条找**——代价表第三行那个「吃亏」就在这里。没有这条边返回 `nullopt`。", 7.1, 1.05, 2.4, 1.85, { fontSize: 10.5 });
  callout(s, "量出来，不是推出来", "`scanned_` 统计检查过多少条边；`storage_cells()` 按 V + 2E 计存储量。后面的实测就靠这两个计数器。", 7.1, 3.05, 2.4, 2.05, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 7.3.2 BFS on list vs matrix
{
  const s = content("7.3.2", "7.3.2 邻接表 · 周游", "周游时的差别：矩阵扫整行，邻接表只走边表");
  codeBlock(s, `[[nodiscard]] std::vector<std::size_t> bfs(std::size_t source) const {
    check_vertex(source);
    std::vector<bool> seen(vertices());
    std::queue<std::size_t> pending;
    std::vector<std::size_t> result;
    pending.push(source);
    seen[source] = true;
    while (!pending.empty()) {
        const std::size_t from = pending.front();
        pending.pop();
        result.push_back(from);
        for (const Edge& edge : adjacency_[from]) {  // 矩阵版这里要扫 V 格
            ++scanned_;
            if (!seen[edge.to]) {
                seen[edge.to] = true;
                pending.push(edge.to);
            }
        }
    }
    return result;
}`, 0.5, 1.05, 6.1, 3.6, { fontSize: 9, hl: [12] });
  text(s, "GraphList::bfs（adjacency_list/modern.hpp）", 0.5, 4.7, 6.1, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
  card(s, 6.85, 1.05, 2.65, 1.9, C.code);
  text(s, "矩阵版 Graph::bfs 的内层", 7.0, 1.12, 2.4, 0.3, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, `for (std::size_t to = 0;
     to < vertices(); ++to) {
    if (adjacency_[from][to]
          < infinity && ...`, 6.95, 1.45, 2.45, 1.35, { fontSize: 8.5, lang: "text" });
  callout(s, "其余一模一样", "队列、`seen`、出队顺序都不变——**只有找邻居的方式变了**。每出队一个顶点：矩阵扫 V 格，邻接表走 deg 条边。", 6.85, 3.1, 2.65, 2.0, { fontSize: 10.5 });
}

// 7.3.2 demo output
{
  const s = content("7.3.2", "7.3.2 · 实测 code/ch07/adjacency_list/demo.cpp", "存储差 300 倍，BFS 的检查次数差 1000 倍");
  consoleBlock(s, "稀疏图 V=1000, E=999\n  邻接表存储 2998 格   ← 随 V+E 走\n  邻接矩阵存储 1000000 格 ← V*V\n  BFS 走遍 1000 个顶点，只检查了 999 条边\n  邻接矩阵的 BFS 要扫 1000000 格（每出队一个顶点扫一整行）\n\n从 0 出发的最短距离: 0 7 9 20 20 11\n最小生成树 5 条边，总权 33", 0.5, 1.05, 5.9, 2.45, 10);
  card(s, 0.5, 3.7, 2.85, 1.4, GREENBG);
  text(s, "存储", 0.65, 3.76, 2.6, 0.28, { fontSize: 11, bold: true, color: C.ok, margin: 0 });
  text(s, "2,998 : 1,000,000", 0.65, 4.05, 2.6, 0.45, { fontSize: 15, bold: true, color: C.text, margin: 0 });
  text(s, "≈ 300 倍", 0.65, 4.55, 2.6, 0.4, { fontSize: 16, bold: true, color: C.ok, margin: 0 });
  card(s, 3.55, 3.7, 2.85, 1.4, GREENBG);
  text(s, "BFS 检查次数", 3.7, 3.76, 2.6, 0.28, { fontSize: 11, bold: true, color: C.ok, margin: 0 });
  text(s, "999 : 1,000,000", 3.7, 4.05, 2.6, 0.45, { fontSize: 15, bold: true, color: C.text, margin: 0 });
  text(s, "≈ 1000 倍", 3.7, 4.55, 2.6, 0.4, { fontSize: 16, bold: true, color: C.ok, margin: 0 });
  codeBlock(s, `// V=1000 的链：E = V-1，典型稀疏图
GraphList sparse(n);
for (v = 0; v + 1 < n; ++v)
    sparse.add_edge(v, v + 1, 1);
sparse.reset_scan_steps();
auto order = sparse.bfs(0);
sparse.scan_steps();     // 999
sparse.storage_cells();  // 2998
// 后半段：6 顶点例子 dijkstra/prim`, 6.65, 1.05, 2.85, 2.1, { fontSize: 8 });
  callout(s, "稠密图上差距消失", "E 接近 V² 时，V + E 也就是 V²，而矩阵还省掉了存 `to` 的那一半空间。", 6.65, 3.3, 2.85, 1.8, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// 7.3.2 heap dijkstra
{
  const s = content("7.3.2", "7.3.2 邻接表 · Dijkstra 最小堆版", "差别最大的一处：找最近顶点交给堆");
  codeBlock(s, `[[nodiscard]] std::vector<distance_type> dijkstra(std::size_t source) const {
    check_vertex(source);
    std::vector<distance_type> distance(vertices(), unreachable);
    distance[source] = 0;

    using Item = std::pair<distance_type, std::size_t>;  // (当前距离, 顶点)
    std::priority_queue<Item, std::vector<Item>, std::greater<Item>> heap;
    heap.emplace(0, source);
    while (!heap.empty()) {
        const auto [dist, from] = heap.top();
        heap.pop();
        if (dist > distance[from]) {
            continue;  // 堆里的旧条目，已经被更短的路径取代
        }
        for (const Edge& edge : adjacency_[from]) {
            ++scanned_;
            const distance_type relaxed = dist + edge.weight;
            if (relaxed < distance[edge.to]) {
                distance[edge.to] = relaxed;
                heap.emplace(relaxed, edge.to);
            }
        }
    }
    return distance;
}`, 0.5, 1.05, 6.3, 4.05, { fontSize: 8.5, hl: [12, 13] });
  callout(s, "O((V+E) log V)", "「找最近顶点」由**最小堆**负责，「松弛」只走**实际存在**的边。稀疏图上这才是该用的组合。", 7.0, 1.05, 2.5, 1.75, { fontSize: 10.5 });
  callout(s, "懒删除", "同一顶点可能多次入堆；弹出的距离比已记录的大，说明是**旧条目**，直接跳过。", 7.0, 2.95, 2.5, 1.35, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  card(s, 7.0, 4.45, 2.5, 0.65, C.dark);
  text(s, "矩阵版是 O(V²)：复杂度由「算法 + 存储」一起决定", 7.1, 4.45, 2.35, 0.65, { fontSize: 9.5, bold: true, color: C.white, valign: "middle", margin: 0 });
}


// 7.3.3 orthogonal list concept
{
  const s = content("7.3.3", "7.3.3 十字链表", "一条弧，同时挂在「同尾」和「同头」两条链上");
  bullets(s, [
    "邻接表只沿**出边**组织；还要频繁查「哪些边指向这个顶点」，就得另存一份逆邻接表。",
    "十字链表把两种方向接在**同一个弧结点**上：",
    { t: "`tailnextarc` 串起**同一尾点**的出边；", sub: true },
    { t: "`headnextarc` 串起**同一头点**的入边；", sub: true },
    { t: "顶点同时保存 `firstoutarc` 和 `firstinarc`。", sub: true },
    "每条弧只分配**一个**结点，遍历出边 O(deg⁺(v))、入边 O(deg⁻(v))，空间 O(V + E)。",
  ], 0.5, 1.1, 5.0, 4.0, { fontSize: 12, gap: 6 });
  card(s, 5.75, 1.1, 3.75, 2.6, C.code);
  image(s, "fig-7-15", 5.9, 1.2, 3.45, 2.1);
  text(s, "图 7.15  有向图的十字链表示例", 5.75, 3.35, 3.75, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  callout(s, "适合 / 代价", "适合**同时维护入度和出度**的有向图（拓扑排序、依赖图）。代价：插删必须**同时维护两条链**；只沿出边走的程序用邻接表更简单。", 5.75, 3.9, 3.75, 1.2, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 7.3.3 teaching code
{
  const s = content("7.3.3", "7.3.3 · orthogonal_graph/teaching.hpp", "原书式教学实现：一个结点、两次挂接");
  codeBlock(s, `struct ArcBox {
    std::size_t tailvex;       // 弧尾 u
    std::size_t headvex;       // 弧头 v
    ArcBox* tailnextarc;       // 下一条同尾弧
    ArcBox* headnextarc;       // 下一条同头弧
    int info;                  // 权值或其他边属性
};

struct VexNode {
    ArcBox* firstin = nullptr;   // 第一条指向本顶点的弧
    ArcBox* firstout = nullptr;  // 第一条从本顶点出发的弧
};`, 0.5, 1.05, 5.3, 2.05, { fontSize: 9 });
  codeBlock(s, `void add_edge(std::size_t tail, std::size_t head, int info = 1) {
    check_vertex(tail);
    check_vertex(head);
    auto* arc = new ArcBox{tail, head, vertices_[tail].firstout,
                           vertices_[head].firstin, info};
    vertices_[tail].firstout = arc;  // 接进 tail 的出边链
    vertices_[head].firstin = arc;   // 同一结点接进 head 的入边链
    ++arc_count_;
}`, 0.5, 3.2, 5.35, 1.9, { fontSize: 9, hl: [4, 6, 7] });
  callout(s, "读法", [
    "前两个域说明「**哪条弧**」，后两个域说明它在两条链中**各接向哪里**。",
    "`firstin` 与 `firstout` 指向的可以是**同一个** `ArcBox`，没有第二份边结点。",
    "表头插入：最新插入的弧**先被遍历到**。",
  ], 6.05, 1.05, 3.45, 2.75, { fontSize: 10.5 });
  callout(s, "释放只沿出链", "每条弧恰好属于一个尾点；**绝不能再沿入链释放**。教学版还删除了复制构造与赋值。", 6.05, 3.95, 3.45, 1.15, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// 7.3.3 anatomy tables
{
  const s = content("7.3.3", "7.3.3 十字链表 · 把一条弧拆开看", "读的是同一批弧结点，走的是两条不同的 next 链");
  const m = (t) => ({ t, mono: true, bold: true });
  table(s, [
    ["域", "回答的问题", "沿它走时保持不变的顶点"],
    [m("tailvex"), "这条弧从哪里出发？", "弧尾，即出边表所属顶点"],
    [m("headvex"), "这条弧指向哪里？", "弧头，即入边表所属顶点"],
    [m("tailnextarc"), "同一个尾点还有哪条下一弧？", "`tailvex` 相同"],
    [m("headnextarc"), "同一个头点还有哪条下一弧？", "`headvex` 相同"],
    [m("info"), "权值、容量或其他边属性？", "不参与两条链的连接"],
  ], 0.5, 1.05, 9.0, [2.0, 3.6, 3.4], { fontSize: 11, rowH: 0.34 });
  text(s, "例：依次插入 0→1、0→2、3→2。不管新弧接在表头还是表尾，两个查询的逻辑都是：", 0.5, 3.4, 9.0, 0.3, { fontSize: 11.5, margin: 0 });
  table(s, [
    ["查询", "起点", "读取字段", "下一步", "得到的顶点"],
    ["0 的出边", m("firstoutarc[0]"), "每个结点的 `headvex`", m("tailnextarc"), { t: "1、2", bold: true, color: C.green }],
    ["2 的入边", m("firstinarc[2]"), "每个结点的 `tailvex`", m("headnextarc"), { t: "0、3", bold: true, color: C.green }],
  ], 0.5, 3.8, 9.0, [1.3, 2.0, 2.4, 1.9, 1.4], { fontSize: 11, rowH: 0.38 });
}

// 7.3.3 modern add
{
  const s = content("7.3.3", "7.3.3 · orthogonal_graph/modern.hpp", "现代实现：所有权集中，双链仍显式");
  codeBlock(s, `void add_edge(std::size_t tail, std::size_t head, int info = 1) {
    check_vertex(tail);
    check_vertex(head);
    if (find_arc(tail, head)) {
        throw std::invalid_argument("duplicate edge");
    }

    auto owned = std::make_unique<Arc>(tail, head, info);
    Arc* arc = owned.get();
    arc->tailnextarc = vertices_[tail].firstout;
    vertices_[tail].firstout = arc;
    arc->headnextarc = vertices_[head].firstin;
    vertices_[head].firstin = arc;
    arcs_.push_back(std::move(owned));
}`, 0.5, 1.05, 5.9, 2.75, { fontSize: 9, hl: [10, 11, 12, 13] });
  callout(s, "谁拥有弧结点", "`arcs_`（`unique_ptr<Arc>` 的 vector）**集中拥有**每个弧结点；`firstin`、`firstout`、`tailnextarc`、`headnextarc` 仍是裸的**非拥有**链接——双链的形状没有被智能指针藏掉。", 6.65, 1.05, 2.85, 2.75, { fontSize: 10.5 });
  card(s, 0.5, 3.95, 9.0, 1.15, C.code);
  text(s, "插入仍是与教学版相同的两次挂接", 0.7, 4.02, 5, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "`tailnextarc` 接住旧出链表头，再改 `firstout`；`headnextarc` 接住旧入链表头，再改 `firstin`；最后 `owned` 移入唯一所有者表。重复边抛 `invalid_argument`。", 0.7, 4.35, 8.6, 0.7, { fontSize: 11, margin: 0 });
}

// 7.3.3 modern remove
{
  const s = content("7.3.3", "7.3.3 · orthogonal_graph/modern.hpp", "remove_edge：两条链各摘一次");
  codeBlock(s, `bool remove_edge(std::size_t tail, std::size_t head) {
    check_vertex(tail);
    check_vertex(head);
    Arc** out_link = &vertices_[tail].firstout;
    while (*out_link && (*out_link)->head != head) {
        out_link = &(*out_link)->tailnextarc;
    }
    if (!*out_link) {
        return false;
    }

    Arc* victim = *out_link;
    *out_link = victim->tailnextarc;
    Arc** in_link = &vertices_[head].firstin;
    while (*in_link != victim) {
        in_link = &(*in_link)->headnextarc;
    }
    *in_link = victim->headnextarc;
    arcs_.erase(std::remove_if(arcs_.begin(), arcs_.end(),
                               [victim](const std::unique_ptr<Arc>& owned) {
                                   return owned.get() == victim;
                               }),
                arcs_.end());
    return true;
}`, 0.5, 1.05, 6.1, 4.05, { fontSize: 9, hl: [13, 18] });
  const steps = [["出链", "在尾点出链找到 victim 并摘下"], ["入链", "在头点入链找到同一地址并摘下"], ["释放", "从 arcs_ 移除唯一所有者"]];
  steps.forEach((st, i) => {
    const y = 1.1 + i * 0.62;
    numCircle(s, i + 1, 6.85, y + 0.06, 0.36, C.green);
    text(s, st[0], 7.3, y, 2.2, 0.26, { fontSize: 11.5, bold: true, color: C.dark, margin: 0 });
    text(s, st[1], 7.3, y + 0.25, 2.2, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
  });
  callout(s, "⚠ 只摘一条会怎样", "「从 u 出发」可能仍正确，但统计 v 的入度或反向遍历时会读到**陈旧链接**——访问已释放结点。", 6.85, 3.05, 2.65, 2.05, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}


// ============================ PART 4 ============================
sectionSlide("Part 4 · 7.4", "图的周游", "每个顶点访问且只访问一次：靠 seen 数组防止绕回\n深度优先 DFS · 广度优先 BFS · 拓扑排序（顺便检测环）");

// 7.4.1 DFS concept
{
  const s = content("7.4.1", "7.4.1 深度优先周游", "DFS：树的先根次序周游的推广");
  text(s, "进入一个顶点就**立刻标记**已访问，再沿编号从小到大的出边递归下去；某个顶点的邻接点都访问过了，就**回退**到上一个顶点，换一条没走过的边继续。", 0.5, 1.02, 9.0, 0.65, { fontSize: 12 });
  card(s, 0.5, 1.8, 4.2, 2.3, C.code);
  image(s, "fig-7-16", 0.65, 1.9, 3.9, 1.9);
  text(s, "图 7.16  有向图 G", 0.5, 3.8, 4.2, 0.26, { fontSize: 9.5, color: C.muted, align: "center" });
  const steps = [
    ["访问 v₀", "唯一的邻接点是 v₁"],
    ["访问 v₁", "边表里 v₂ 排在 v₃ 前面"],
    ["访问 v₂", "只有已访问的 v₀ → 回退到 v₁"],
    ["访问 v₃", "邻接点都访问过 → 一路回退到 v₀"],
    ["重新开始", "还有未访问顶点：挑 v₄"],
    ["v₄ → v₅ → v₆", "v₅ 的 v₁、v₆ 的 v₃ 已访问"],
  ];
  steps.forEach((st, i) => {
    const y = 1.8 + i * 0.4;
    numCircle(s, i + 1, 4.95, y + 0.03, 0.3, i === 4 ? C.goldText : C.green);
    text(s, st[0], 5.35, y, 1.6, 0.36, { fontSize: 11, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, st[1], 6.95, y, 2.6, 0.36, { fontSize: 10, color: C.muted, valign: "middle", margin: 0 });
  });
  card(s, 0.5, 4.3, 9.0, 0.8, C.dark);
  text(s, "深度优先序列", 0.7, 4.3, 1.6, 0.8, { fontSize: 11, bold: true, color: C.gold, valign: "middle", margin: 0 });
  text(s, "v₀  v₁  v₂  v₃  |  v₄  v₅  v₆", 2.3, 4.3, 7.0, 0.8, { fontSize: 20, bold: true, color: C.white, valign: "middle", margin: 0 });
}

// 7.4.1 DFS code
{
  const s = content("7.4.1", "7.4.1 · code/ch07/graph", "dfs + visit_depth_first：递归的先根周游");
  codeBlock(s, `[[nodiscard]] std::vector<std::size_t> dfs(std::size_t source) const {
    check_vertex(source);
    std::vector<bool> seen(vertices());
    std::vector<std::size_t> result;
    visit_depth_first(source, seen, result);
    return result;
}
// ...
void visit_depth_first(std::size_t from, std::vector<bool>& seen,
                       std::vector<std::size_t>& result) const {
    seen[from] = true;
    result.push_back(from);
    for (std::size_t to = 0; to < vertices(); ++to) {
        if (adjacency_[from][to] < infinity && !seen[to]) {
            visit_depth_first(to, seen, result);
        }
    }
}`, 0.5, 1.05, 5.75, 3.3, { fontSize: 9, hl: [11, 15] });
  text(s, "modern.hpp（visit_depth_first 是 private 辅助函数）", 0.5, 4.4, 5.4, 0.3, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "对照算法描述", [
    "进入顶点**立刻标记** `seen`，记入序列。",
    "`to` 从 0 扫到 V−1：沿**编号从小到大**的出边递归——这就是「边表次序」。",
    "递归返回 = **回退**到上一个顶点。",
  ], 6.45, 1.05, 3.05, 2.3, { fontSize: 10.5 });
  callout(s, "只走可达的顶点", "`dfs(source)` 只访问**从源点可达**的顶点。图 7.16 上 `dfs(0)` 得 0 1 2 3；要周游全图，外层再对每个未访问顶点重起一次。", 6.45, 3.5, 3.05, 1.6, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "递归写法：深图有栈溢出风险。", 0.5, 4.72, 5.4, 0.3, { fontSize: 10, bold: true, color: C.bad, margin: 0 });
}

// 7.4.1 DFS key points
{
  const s = content("7.4.1", "7.4.1 深度优先周游 · 关键要点", "代价取决于存储结构，而不是取决于算法");
  card(s, 0.5, 1.1, 4.35, 1.9, C.code);
  numCircle(s, 1, 0.7, 1.25, 0.42, C.dark);
  text(s, "不连通时一次走不完", 1.25, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  text(s, "要在外层对每个**未访问顶点**再起一次 DFS。", 0.7, 1.85, 4.0, 1.0, { fontSize: 12, margin: 0 });
  card(s, 5.15, 1.1, 4.35, 1.9, C.code);
  numCircle(s, 2, 5.35, 1.25, 0.42, C.dark);
  text(s, "序列由存储结构决定", 5.9, 1.28, 3.5, 0.38, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  text(s, "存储结构一旦定下、源点一旦定下，深度优先序列就是**唯一的**。", 5.35, 1.85, 4.0, 1.0, { fontSize: 12, margin: 0 });
  table(s, [
    ["存储结构", "找邻接点的代价", "DFS 总时间"],
    ["相邻矩阵", "每个顶点扫一整行，共检查 n² 个元素", { t: "O(n²)", mono: true, bold: true }],
    ["邻接表", "所有边结点检查一遍，O(e)", { t: "O(n + e)", mono: true, bold: true, color: C.ok }],
  ], 0.5, 3.2, 6.0, [1.3, 3.3, 1.4], { fontSize: 11.5, rowH: 0.45 });
  callout(s, "为什么", "周游实质上是**搜索每个顶点的邻接点**；每个顶点至多调用一次 DFS，时间都花在找邻接点上。", 6.75, 3.2, 2.75, 1.9, { fontSize: 10.5 });
}

// 7.4.2 BFS concept + trace
{
  const s = content("7.4.2", "7.4.2 广度优先周游", "BFS：类似树的按层次次序周游，靠 FIFO 队列");
  bullets(s, [
    "访问并标记 v 之后，**横向**搜索 v 的所有邻接点；再从这些邻接点出发，依次访问它们未访问过的邻接点。",
    "先访问的顶点的邻接点，在下一轮被**优先**访问到。",
    "访问到一个顶点就入队；队头出队时把它未访问的邻接点入队——**每个顶点只入队一次**。",
  ], 0.5, 1.05, 4.3, 3.0, { fontSize: 11.5, gap: 6 });
  const rows = [
    ["出队", "新入队", "队列（头→尾）"],
    ["（v₀ 入队）", "v₀", "v₀"],
    ["v₀", "v₁", "v₁"],
    ["v₁", "v₂ v₃", "v₂ v₃"],
    ["v₂", "—（v₀ 已访问）", "v₃"],
    ["v₃", "—", "空"],
    [{ t: "重起 v₄", bold: true, color: C.goldText }, "v₄", "v₄"],
    ["v₄", "v₅ v₆", "v₅ v₆"],
    ["v₅", "—", "v₆"],
    ["v₆", "—", "空"],
  ];
  table(s, rows, 5.0, 1.05, 4.5, [1.2, 1.7, 1.6], { fontSize: 10, rowH: 0.3, tight: true });
  card(s, 5.0, 4.2, 4.5, 0.9, C.dark);
  text(s, "广度优先序列（图 7.16）", 5.15, 4.25, 4.2, 0.28, { fontSize: 10, bold: true, color: C.gold, margin: 0 });
  text(s, "v₀ v₁ v₂ v₃ | v₄ v₅ v₆", 5.15, 4.55, 4.2, 0.45, { fontSize: 17, bold: true, color: C.white, margin: 0 });
  callout(s, "与 DFS 比", "实质相同，只是**访问顺序**不同；二者的**时间复杂度也相同**。", 0.5, 4.1, 4.3, 1.0, { fontSize: 11, fill: C.mint, tcolor: C.dark });
}

// 7.4.2 BFS code
{
  const s = content("7.4.2", "7.4.2 · code/ch07/graph/modern.hpp", "bfs：入队时就标记");
  codeBlock(s, `[[nodiscard]] std::vector<std::size_t> bfs(std::size_t source) const {
    check_vertex(source);
    std::vector<bool> seen(vertices());
    std::queue<std::size_t> queue;
    std::vector<std::size_t> result;
    queue.push(source);
    seen[source] = true;
    while (!queue.empty()) {
        const std::size_t from = queue.front();
        queue.pop();
        result.push_back(from);
        for (std::size_t to = 0; to < vertices(); ++to) {
            if (adjacency_[from][to] < infinity && !seen[to]) {
                seen[to] = true;
                queue.push(to);
            }
        }
    }
    return result;
}`, 0.5, 1.05, 6.1, 3.45, { fontSize: 9, hl: [7, 14] });
  callout(s, "为什么入队时就标记", "如果等到**出队**才标记，同一个顶点可能被好几个邻居各入队一次。入队即标记，保证**每个顶点只入队一次**。", 6.85, 1.05, 2.65, 2.2, { fontSize: 10.5 });
  callout(s, "内层循环", "`for to in 0..V-1`：矩阵版每出队一个顶点扫一整行，全图 O(V²)。换成邻接表只走边表，见 7.3.2。", 6.85, 3.4, 2.65, 1.7, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "图 7.16 上 `bfs(0)` 得 0 1 2 3；`bfs(4)` 得 4 5 6 1 3 2 0——源点不同，序列不同。", 0.5, 4.6, 6.1, 0.5, { fontSize: 10.5, margin: 0 });
}

// 7.4.3 topo concept
{
  const s = content("7.4.3", "7.4.3 拓扑排序", "有向无环图（DAG）与拓扑序列");
  bullets(s, [
    "无环的有向图叫**有向无环图**（DAG），常用来描述一个过程或系统的进行过程。",
    "**拓扑序列**：若存在 vᵢ 到 vⱼ 的路径，则序列中 vᵢ 必在 vⱼ 之前。",
    "拓扑排序可以解决**先决条件问题**：在满足先决条件的前提下逐个完成各项任务。",
  ], 0.5, 1.05, 5.9, 1.9, { fontSize: 12.5, gap: 8 });
  callout(s, "原书例子：课程先修关系", "弧 ⟨cᵢ, cⱼ⟩ 表示 cᵢ 是 cⱼ 的先修课。c₀ 高等数学、c₁ 程序设计基础无先修；c₂ 离散数学 ← c₀ c₁；c₃ 数据结构 ← c₁ c₂；c₄ 算法语言 ← c₁；c₅ 编译原理 ← c₃ c₄；c₆ 操作系统 ← c₃ c₈；c₇ 普通物理 ← c₀；c₈ 计算机原理 ← c₇。", 0.5, 3.0, 5.9, 2.1, { fontSize: 12, lsm: 1.25 });
  card(s, 6.65, 1.05, 2.85, 2.75, C.code);
  image(s, "fig-7-17", 6.8, 1.12, 2.55, 2.6);
  card(s, 6.65, 3.95, 2.85, 1.15, C.dark);
  text(s, "拓扑序不唯一", 6.8, 4.0, 2.6, 0.28, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "c₀ c₁ c₂ c₃ c₄ c₅ c₇ c₈ c₆\nc₀ c₇ c₈ c₁ c₄ c₂ c₃ c₆ c₅", 6.8, 4.3, 2.65, 0.75, { fontSize: 12, color: C.white, margin: 0 });
}

// 7.4.3 method
{
  const s = content("7.4.3", "7.4.3 拓扑排序", "方法：反复摘掉入度为 0 的顶点");
  const steps = [["选", "从有向图中选出一个**没有前驱**（入度为 0）的顶点并输出"], ["删", "删除该顶点和所有**以它为起点**的弧"]];
  steps.forEach((st, i) => {
    const y = 1.1 + i * 0.75;
    numCircle(s, i + 1, 0.5, y + 0.08, 0.46, C.dark);
    text(s, st[0], 1.1, y, 0.5, 0.6, { fontSize: 18, bold: true, color: C.green, valign: "middle", margin: 0 });
    text(s, st[1], 1.65, y, 4.2, 0.6, { fontSize: 12.5, valign: "middle", margin: 0 });
  });
  card(s, 0.5, 2.7, 2.6, 1.15, GREENBG);
  text(s, "全部输出", 0.65, 2.78, 2.3, 0.3, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
  text(s, "完成拓扑排序", 0.65, 3.12, 2.3, 0.6, { fontSize: 11.5, margin: 0 });
  card(s, 3.3, 2.7, 2.6, 1.15, RED);
  text(s, "还有顶点没输出", 3.45, 2.78, 2.3, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  text(s, "但找不到入度为 0 的点 → **图中有环**", 3.45, 3.12, 2.35, 0.7, { fontSize: 11.5, margin: 0 });
  text(s, "拓扑排序可以**顺便检查有向图是否存在环**。", 0.5, 4.0, 5.4, 0.35, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  callout(s, "实现上的两个技巧", [
    "每个顶点加一个**入度域**；「删除以它为尾的弧」= 把所有弧头的入度**减 1**。",
    "把入度为 0 的顶点放进**队列**：每次取队头即可，不必检查整个顶点表；某个顶点入度减到 0 就入队。",
    "若最终取出的点数**少于顶点数**，图里有环。",
  ], 6.15, 1.1, 3.35, 4.0, { fontSize: 11 });
}

// 7.4.3 code
{
  const s = content("7.4.3", "7.4.3 · code/ch07/graph/modern.hpp", "topological_sort：入度表 + 队列");
  codeBlock(s, `[[nodiscard]] std::optional<std::vector<std::size_t>> topological_sort() const {
    std::vector<std::size_t> indegree(vertices());
    for (std::size_t from = 0; from < vertices(); ++from) {
        for (std::size_t to = 0; to < vertices(); ++to) {
            if (from != to && adjacency_[from][to] < infinity) {
                ++indegree[to];
            }
        }
    }
    std::queue<std::size_t> queue;
    for (std::size_t vertex = 0; vertex < vertices(); ++vertex) {
        if (indegree[vertex] == 0) {
            queue.push(vertex);
        }
    }
    std::vector<std::size_t> result;
    while (!queue.empty()) {
        const std::size_t from = queue.front();
        queue.pop();
        result.push_back(from);
        for (std::size_t to = 0; to < vertices(); ++to) {
            if (from != to && adjacency_[from][to] < infinity && --indegree[to] == 0) {
                queue.push(to);
            }
        }
    }
    return result.size() == vertices() ? std::optional<std::vector<std::size_t>>(result)
                                       : std::nullopt;
}`, 0.5, 1.05, 6.55, 4.05, { fontSize: 8.4, hl: [22, 27, 28] });
  callout(s, "from != to", "对角线是 0（到自己距离 0），**不是边**；不排除它，入度全多 1，一个都入不了队。", 7.2, 1.05, 2.3, 1.3, { fontSize: 9.5 });
  callout(s, "--indegree[to] == 0", "先减再判：**最后一条**入弧删掉的那一刻才入队，每个顶点只入队一次。", 7.2, 2.45, 2.3, 1.25, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  callout(s, "有环 → nullopt", "输出不足 V 个：有顶点永远等不到入度归 0。返回空，**不抛异常**。", 7.2, 3.8, 2.3, 1.3, { fontSize: 9.5, fill: RED, tcolor: C.bad });
}


// 7.4.3 trace
{
  const s = content("7.4.3", "7.4.3 拓扑排序 · 手算 trace", "图 7.17 上逐步执行 topological_sort()");
  const rows = [
    ["步", "出队", "入度减 1", "新入队", "队列（头→尾）"],
    ["初", "—", "入度：c₂ c₃ c₅ c₆ 为 2，c₄ c₇ c₈ 为 1", "c₀ c₁", "c₀ c₁"],
    ["1", { t: "c₀", bold: true }, "c₂ 2→1，c₇ 1→0", "c₇", "c₁ c₇"],
    ["2", { t: "c₁", bold: true }, "c₂ 1→0，c₃ 2→1，c₄ 1→0", "c₂ c₄", "c₇ c₂ c₄"],
    ["3", { t: "c₇", bold: true }, "c₈ 1→0", "c₈", "c₂ c₄ c₈"],
    ["4", { t: "c₂", bold: true }, "c₃ 1→0", "c₃", "c₄ c₈ c₃"],
    ["5", { t: "c₄", bold: true }, "c₅ 2→1", "—", "c₈ c₃"],
    ["6", { t: "c₈", bold: true }, "c₆ 2→1", "—", "c₃"],
    ["7", { t: "c₃", bold: true }, "c₅ 1→0，c₆ 1→0", "c₅ c₆", "c₅ c₆"],
    ["8", { t: "c₅", bold: true }, "—", "—", "c₆"],
    ["9", { t: "c₆", bold: true }, "—", "—", "空"],
  ];
  table(s, rows, 0.5, 1.02, 6.4, [0.4, 0.6, 2.9, 1.1, 1.4], { fontSize: 9.5, rowH: 0.3, tight: true });
  card(s, 0.5, 4.5, 6.4, 0.6, C.dark);
  text(s, "输出：c₀ c₁ c₇ c₂ c₄ c₈ c₃ c₅ c₆（9 个全输出 → 无环）", 0.65, 4.5, 6.2, 0.6, { fontSize: 12, bold: true, color: C.white, valign: "middle", margin: 0 });
  callout(s, "读这张表", [
    "同一步里多个顶点入度归 0，按**列号从小到大**入队（矩阵扫一行的次序）。",
    "得到的序列和图注里的两个都不同——**拓扑序不唯一**，逐条核对每条弧都是弧尾在前即可。",
    "若再加一条 ⟨c₆, c₀⟩，c₀ 入度为 1，**整条链都卡住**。",
  ], 7.1, 1.02, 2.4, 4.08, { fontSize: 10 });
}

// ============================ PART 5 ============================
sectionSlide("Part 5 · 7.5", "最短路径", "单源最短路：Dijkstra（贪心）· 用 pre 取出路径\n每对顶点：Floyd（动态规划）");

// 7.5 intro + dijkstra idea
{
  const s = content("7.5.1", "7.5.1 单源最短路径", "Dijkstra：按路径长度递增的次序产生最短路径");
  card(s, 0.5, 1.05, 2.9, 1.9, C.code);
  image(s, "fig-7-18", 0.6, 1.12, 2.7, 1.45);
  text(s, "图 7.18  A→C→B 最短，不是边数最少的那条", 0.5, 2.6, 2.9, 0.32, { fontSize: 9, color: C.muted, align: "center" });
  bullets(s, [
    "给定带权图，每条边的权**非负**；给定源点 s，求 s 到所有其他顶点的最短路径——**单源最短路径**问题。",
    "顶点分成两个集合：**S**（最短距离已确定）和 **V−S**。初始 S = {s}。",
    "**特殊路径**：从 s 到 v、中间**只经过 S 中顶点**的路径；数组 D 记录当前最短特殊路径长度。",
  ], 3.6, 1.05, 5.9, 2.0, { fontSize: 11.5, gap: 5 });
  card(s, 0.5, 3.15, 9.0, 1.95, C.dark);
  text(s, "每一轮做两件事", 0.75, 3.23, 4, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "① 从 V−S 中取出 D 值最小的顶点 u，并入 S；", 0.75, 3.58, 8.6, 0.35, { fontSize: 13, color: C.white, margin: 0 });
  text(s, "② 松弛：若 D[u] + W[u, v] < D[v]，则 D[v] = D[u] + W[u, v]。", 0.75, 3.95, 8.6, 0.35, { fontSize: 13, color: C.white, margin: 0 });
  text(s, "S 包含全部顶点时，D[v] 就是 s 到 v 的最短路径长度。这是一个**贪心**算法。", 0.75, 4.4, 8.6, 0.55, { fontSize: 11.5, color: C.mint, margin: 0 });
}

// 7.5.1 dijkstra trace on fig 7-19
{
  const s = content("7.5.1", "7.5.1 单源最短路径 · 手算 trace", "图 7.19 上从 v₀ 出发逐轮走一遍");
  card(s, 0.5, 1.05, 2.8, 2.7, C.code);
  image(s, "fig-7-19", 0.6, 1.1, 2.6, 2.55);
  const I = "∞";
  const hot = (t) => ({ t, bold: true, color: C.bad, align: "center", mono: true });
  const cc = (t) => ({ t, align: "center", mono: true });
  const dn = (t) => ({ t, align: "center", color: C.muted, mono: true });
  table(s, [
    ["轮", "选出 u", "D[v₀]", "D[v₁]", "D[v₂]", "D[v₃]", "D[v₄]"],
    ["初", "—", cc("0"), cc(I), cc(I), cc(I), cc(I)],
    ["1", { t: "v₀", bold: true }, dn("0"), hot("10"), cc(I), hot("30"), hot("100")],
    ["2", { t: "v₁", bold: true }, dn("0"), dn("10"), hot("60"), cc("30"), cc("100")],
    ["3", { t: "v₃", bold: true }, dn("0"), dn("10"), hot("50"), dn("30"), hot("90")],
    ["4", { t: "v₂", bold: true }, dn("0"), dn("10"), dn("50"), dn("30"), hot("60")],
    ["5", { t: "v₄", bold: true }, dn("0"), dn("10"), dn("50"), dn("30"), dn("60")],
  ], 3.5, 1.05, 6.0, [0.5, 0.9, 0.92, 0.92, 0.92, 0.92, 0.92], { fontSize: 11, rowH: 0.38 });
  text(s, "红 = 本轮松弛成功；灰 = 已并入 S。", 3.5, 3.78, 6.0, 0.28, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "pre（前驱）", "v₁←v₀，v₂←v₃，v₃←v₀，v₄←v₂。\n到 v₄：v₀→v₃→v₂→v₄ = 30+20+10 = **60**。", 0.5, 3.95, 4.35, 1.15, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "第 3 轮", "v₃ 并入后，v₂ 经 v₃ 的 30+20 = 50 < 60，v₄ 经 v₃ 的 30+60 = 90 < 100；第 4 轮 v₂ 又把 v₄ 松弛成 60。", 5.05, 4.1, 4.45, 1.0, { fontSize: 10 });
}

// 7.5.1 non-negative & complexity
{
  const s = content("7.5.1", "7.5.1 单源最短路径", "为什么边权必须非负？代价又取决于什么？");
  card(s, 0.5, 1.1, 4.35, 2.6, RED);
  text(s, "边权必须非负", 0.7, 1.2, 4, 0.35, { fontSize: 15, bold: true, color: C.bad, margin: 0 });
  text(s, "从 V−S 里挑出 D 最小的那个，它的距离**此后不会再变小**——因为任何绕道都要先经过一个距离不更小的顶点，而**边权非负**。\n\n这条论证正是 Dijkstra 要求非负权的地方；本书实现因此在 `add_edge` 就**拒绝负权**。", 0.7, 1.6, 4.0, 2.05, { fontSize: 11.5, margin: 0, lsm: 1.1 });
  table(s, [
    ["怎么挑「最小的那个」", "时间", "适合"],
    ["直接比较 D 数组（矩阵版）", { t: "O(n²)", mono: true, bold: true }, "稠密图"],
    ["最小堆（原书【算法7.8】）", { t: "O((n+e) log e)", mono: true, bold: true }, "稀疏图"],
  ], 5.15, 1.1, 4.35, [1.95, 1.6, 0.8], { fontSize: 10.5, rowH: 0.5 });
  text(s, "任何一条边都可能出现在最短路径中，所以每条边至少都要检查一次。", 5.15, 2.75, 4.35, 0.6, { fontSize: 10.5, color: C.muted, margin: 0 });
  callout(s, "要输出路径本身：pre 域", "记录最短路径上 v 前面经过的那个顶点。只要 D[u] + W[u, v] < D[v] 就设 v 的前一个顶点为 u，否则不改。算法终止时顺着 pre **一路回溯**就得到完整路径。", 0.5, 3.9, 9.0, 1.2, { fontSize: 11.5 });
}

// 7.5.1 dijkstra code
{
  const s = content("7.5.1", "7.5.1 · code/ch07/graph/modern.hpp", "dijkstra：矩阵版 O(V²)");
  codeBlock(s, `[[nodiscard]] std::vector<distance_type> dijkstra(std::size_t source) const {
    check_vertex(source);
    std::vector<distance_type> distance(vertices(), unreachable);
    std::vector<bool> used(vertices());
    distance[source] = 0;
    for (std::size_t count = 0; count < vertices(); ++count) {
        const std::size_t from = nearest_unvisited(distance, used);
        if (from == vertices() || distance[from] == unreachable) {
            break;
        }
        used[from] = true;
        for (std::size_t to = 0; to < vertices(); ++to) {
            if (adjacency_[from][to] < infinity &&
                distance[to] > distance[from] + adjacency_[from][to]) {
                distance[to] = distance[from] + adjacency_[from][to];
            }
        }
    }
    return distance;
}`, 0.5, 1.05, 6.4, 3.4, { fontSize: 9, hl: [7, 11, 15] });
  text(s, "`nearest_unvisited(distance, used)`：扫一遍全部顶点，返回未用过且 distance 最小的那个（全用过则返回 V）。Dijkstra 传 64 位路径距离、Prim 传 int 边权，两者共用这个模板。", 0.5, 4.55, 6.4, 0.55, { fontSize: 10, margin: 0 });
  callout(s, "对照算法描述", [
    "`used` 就是集合 **S**。",
    "`nearest_unvisited`：在 V−S 里挑 D 最小的——扫一遍全部顶点，O(V)。",
    "内层 `for`：**松弛**，扫一整行。",
    "挑出的点是 `unreachable`：剩下的都到不了，提前结束。",
  ], 7.1, 1.05, 2.4, 4.05, { fontSize: 10 });
}

// 7.5.1 dijkstra_tree code
{
  const s = content("7.5.1", "7.5.1 · 把路径本身取出来（上）", "dijkstra_tree：只在松弛成功时改前驱");
  codeBlock(s, `struct ShortestPathTree {
    std::size_t source;
    std::vector<distance_type> distance;
    std::vector<std::optional<std::size_t>> predecessor;
};

[[nodiscard]] ShortestPathTree dijkstra_tree(std::size_t source) const {
    check_vertex(source);
    ShortestPathTree tree{source, std::vector<distance_type>(vertices(), unreachable),
                          std::vector<std::optional<std::size_t>>(vertices())};
    std::vector<bool> used(vertices());
    tree.distance[source] = 0;
    for (std::size_t count = 0; count < vertices(); ++count) {
        const std::size_t from = nearest_unvisited(tree.distance, used);
        if (from == vertices() || tree.distance[from] == unreachable) {
            break;
        }
        used[from] = true;
        for (std::size_t to = 0; to < vertices(); ++to) {
            if (adjacency_[from][to] < infinity &&
                tree.distance[to] > tree.distance[from] + adjacency_[from][to]) {
                tree.distance[to] = tree.distance[from] + adjacency_[from][to];
                tree.predecessor[to] = from;
            }
        }
    }
    return tree;
}`, 0.5, 1.05, 6.6, 4.05, { fontSize: 8.4, hl: [23] });
  callout(s, "原书 Dist 类的两个域", "`length` → `distance`，`pre` → `predecessor`。源点和到不了的顶点**没有前驱**，所以用 `std::optional`。", 7.3, 1.05, 2.2, 2.0, { fontSize: 10 });
  callout(s, "⚠ 只在松弛成功时", "不管松没松弛都去改前驱：距离数组照样正确，但顺着前驱走出来的路径**和距离对不上**，甚至走成环。", 7.3, 3.2, 2.2, 1.9, { fontSize: 10, fill: RED, tcolor: C.bad });
}

// 7.5.1 shortest_path code
{
  const s = content("7.5.1", "7.5.1 · 把路径本身取出来（下）", "shortest_path：从汇点倒着走回源点");
  codeBlock(s, `[[nodiscard]] static std::optional<std::vector<std::size_t>> shortest_path(
    const ShortestPathTree& tree, std::size_t target) {
    const std::size_t count = tree.distance.size();
    if (target >= count || tree.source >= count || tree.predecessor.size() != count) {
        throw std::out_of_range("vertex");
    }
    if (tree.distance[target] == unreachable) {
        return std::nullopt;
    }
    std::vector<std::size_t> path{target};
    for (std::size_t vertex = target; vertex != tree.source;) {
        if (!tree.predecessor[vertex] || path.size() > count) {
            throw std::invalid_argument("broken predecessor chain");
        }
        vertex = *tree.predecessor[vertex];
        path.push_back(vertex);
    }
    std::reverse(path.begin(), path.end());
    return path;
}`, 0.5, 1.05, 6.6, 3.15, { fontSize: 8.4, hl: [8, 13, 18] });
  const cases = [["到不了", "返回 nullopt", C.green], ["汇点 = 源点", "路径只有 {source}", C.green], ["前驱链断了 / 成环", "树已经坏了 → 抛 invalid_argument", C.bad]];
  cases.forEach((c, i) => {
    const y = 1.05 + i * 0.78;
    card(s, 7.3, y, 2.2, 0.68, C.code);
    text(s, c[0], 7.4, y + 0.04, 2.0, 0.28, { fontSize: 10.5, bold: true, color: c[2], margin: 0 });
    text(s, c[1], 7.4, y + 0.32, 2.05, 0.34, { fontSize: 9, margin: 0 });
  });
  callout(s, "测试不断言具体路径", "等长路径有好几条时返回哪条取决于扫描次序。测试只断言**路径合法**：首尾是源点和汇点，每步都是真实的边，边权之和等于 Floyd 算出的最短距离（随机小图，边权 0～4）。", 0.5, 4.3, 9.0, 0.82, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  text(s, "demo 图上：pre = [—, 0, 1, 2, 3]，到 4 的路径 0 1 2 3 4。", 7.3, 3.45, 2.2, 0.75, { fontSize: 9.5, color: C.muted, margin: 0 });
}


// 7.5.2 floyd concept
{
  const s = content("7.5.2", "7.5.2 每对顶点之间的最短路径", "Floyd：典型的动态规划");
  bullets(s, [
    "**所有顶点对之间的最短路径**：对任意有序对 ⟨vᵢ, vⱼ⟩ 求最短路径。",
    "可以以每个顶点为源点重复 Dijkstra n 次，O(n³)；Floyd 也是 **O(n³)**，但形式简单。",
    "从 adj⁽⁰⁾ = 相邻矩阵出发，做 n 次迭代：**adj⁽ᵏ⁾[i, j] = 从 vᵢ 到 vⱼ、中间顶点序号不大于 k 的最短路径长度**。",
  ], 0.5, 1.05, 9.0, 1.7, { fontSize: 13, gap: 8 });
  card(s, 0.5, 2.85, 4.35, 1.1, C.code);
  text(s, "中间不经过 vₖ", 0.7, 2.93, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "adj⁽ᵏ⁾[i, j] = adj⁽ᵏ⁻¹⁾[i, j]", 0.7, 3.3, 4, 0.5, { fontSize: 13, fontFace: MONO, margin: 0 });
  card(s, 5.15, 2.85, 4.35, 1.1, C.code);
  text(s, "中间经过 vₖ：两段拼起来", 5.35, 2.93, 4, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  text(s, "adj⁽ᵏ⁻¹⁾[i, k] + adj⁽ᵏ⁻¹⁾[k, j]", 5.35, 3.3, 4, 0.5, { fontSize: 13, fontFace: MONO, margin: 0 });
  card(s, 0.5, 4.1, 9.0, 1.0, C.dark);
  text(s, "adj⁽ᵏ⁾[i, j] = min{ adj⁽ᵏ⁻¹⁾[i, j],  adj⁽ᵏ⁻¹⁾[i, k] + adj⁽ᵏ⁻¹⁾[k, j] }", 0.7, 4.1, 8.6, 1.0, { fontSize: 16, bold: true, color: C.gold, valign: "middle", align: "center", margin: 0 });
}

// 7.5.2 floyd trace fig 7-20
{
  const s = content("7.5.2", "7.5.2 Floyd · 手算 trace", "图 7.20：每轮多开放一个中转点");
  card(s, 0.5, 1.05, 2.1, 1.9, C.code);
  image(s, "fig-7-20", 0.6, 1.1, 1.9, 1.8);
  text(s, "边：v₀→v₂ 2，v₁→v₀ 5，v₁→v₂ 8，v₂→v₁ 3", 0.5, 3.0, 2.1, 0.7, { fontSize: 9.5, color: C.muted, margin: 0 });
  const mats = [
    ["adj⁽⁰⁾（相邻矩阵）", [["0", "∞", "2"], ["5", "0", "8"], ["∞", "3", "0"]], []],
    ["经 v₀ 之后", [["0", "∞", "2"], ["5", "0", "7"], ["∞", "3", "0"]], ["1,2"]],
    ["经 v₁ 之后", [["0", "∞", "2"], ["5", "0", "7"], ["8", "3", "0"]], ["2,0"]],
    ["经 v₂ 之后（最终）", [["0", "5", "2"], ["5", "0", "7"], ["8", "3", "0"]], ["0,1"]],
  ];
  mats.forEach((m, k) => {
    const x = 2.85 + (k % 2) * 3.35, y = 1.05 + Math.floor(k / 2) * 1.75;
    text(s, m[0], x, y, 3.1, 0.28, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
    const rows = [["", "v₀", "v₁", "v₂"], ...m[1].map((r, i) => [{ t: "v" + "₀₁₂"[i], bold: true, align: "center" },
      ...r.map((c, j) => (m[2].includes(i + "," + j) ? { t: c, bold: true, color: C.bad, fill: RED, align: "center", mono: true } : { t: c, align: "center", mono: true, color: c === "∞" ? C.muted : C.text }))])];
    table(s, rows, x, y + 0.3, 2.6, [0.65, 0.65, 0.65, 0.65], { fontSize: 10.5, rowH: 0.3, tight: true });
  });
  card(s, 0.5, 4.55, 9.0, 0.55, C.mint);
  text(s, "变了的三格：v₁→v₂ = 5+2 = **7** < 8（经 v₀）；v₂→v₀ = 3+5 = **8**（经 v₁）；v₀→v₁ = 2+3 = **5**（经 v₂）。", 0.65, 4.55, 8.7, 0.55, { fontSize: 11, valign: "middle", margin: 0 });
}

// 7.5.2 floyd code
{
  const s = content("7.5.2", "7.5.2 · code/ch07/graph/modern.hpp", "floyd：中转点 via 必须在最外层");
  codeBlock(s, `[[nodiscard]] std::vector<std::vector<distance_type>> floyd() const {
    std::vector<std::vector<distance_type>> distance(
        vertices(), std::vector<distance_type>(vertices(), unreachable));
    for (std::size_t from = 0; from < vertices(); ++from) {
        for (std::size_t to = 0; to < vertices(); ++to) {
            if (adjacency_[from][to] < infinity) {
                distance[from][to] = adjacency_[from][to];
            }
        }
    }
    for (std::size_t via = 0; via < vertices(); ++via) {
        for (std::size_t from = 0; from < vertices(); ++from) {
            for (std::size_t to = 0; to < vertices(); ++to) {
                if (distance[from][via] != unreachable && distance[via][to] != unreachable) {
                    distance[from][to] = std::min(
                        distance[from][to], distance[from][via] + distance[via][to]);
                }
            }
        }
    }
    return distance;
}`, 0.5, 1.05, 9.0, 3.47, { fontSize: 8.8, hl: [11, 14] });
  card(s, 0.5, 4.62, 5.4, 0.5, RED);
  text(s, "⚠ **中转点 via 必须在最外层**，否则 adj⁽ᵏ⁾ 还没算完就被拿去用了。", 0.62, 4.62, 5.2, 0.5, { fontSize: 10.5, color: C.bad, valign: "middle", margin: 0 });
  card(s, 6.1, 4.62, 3.4, 0.5, C.mint);
  text(s, "测试：五个源点的 Dijkstra 与 Floyd 逐项对拍。", 6.22, 4.62, 3.2, 0.5, { fontSize: 10, valign: "middle", margin: 0 });
}

// ============================ PART 6 ============================
sectionSlide("Part 6 · 7.6", "最小生成树", "MST 性质 · Prim：从点出发长一棵树\nKruskal：从边出发合并森林");

// 7.6 MST property
{
  const s = content("7.6", "7.6 最小生成树", "目标：连通全部顶点，选中边的总权最小");
  bullets(s, [
    "n 个城市之间建通信网，联通只需 **n−1 条线路**——怎么选使总花费最小？",
    "所有生成树中代价最小的叫**最小生成树**（minimum-cost spanning tree, MST）。",
    "目标**不是**任意两点最短，而是连通全部顶点且总权最小。",
  ], 0.5, 1.05, 5.6, 1.7, { fontSize: 12, gap: 6 });
  card(s, 0.5, 2.85, 5.6, 1.1, C.dark);
  text(s, "MST 性质", 0.7, 2.9, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "U 是 V 的非空真子集。若 (u, v) 是一端在 U、另一端在 V−U 的边里**权最小**的一条，则一定存在一棵包含 (u, v) 的 MST。", 0.7, 3.2, 5.3, 0.72, { fontSize: 11, color: C.white, margin: 0 });
  callout(s, "反证", "设某棵 MST T 不含 (u, v)。把 (u, v) 加进 T 必成回路，回路上另有一条边 (u′, v′) 也跨在 U 与 V−U 之间。删掉它得到生成树 T′；因 W(u, v) ≤ W(u′, v′)，T′ 代价不比 T 大，也是 MST 且含 (u, v)——矛盾。", 0.5, 4.05, 5.6, 1.05, { fontSize: 9.5, lsm: 1.05 });
  card(s, 6.35, 1.05, 3.15, 2.5, C.code);
  image(s, "fig-7-22", 6.5, 1.12, 2.85, 2.05);
  text(s, "图 7.22  含 (u, v) 的回路", 6.35, 3.2, 3.15, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  callout(s, "这条性质的用处", "Prim 和 Kruskal 都是贪心：每一步都可以**放心地取当前最小的那条跨界边**。", 6.35, 3.7, 3.15, 1.4, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 7.6.1 Prim concept
{
  const s = content("7.6.1", "7.6.1 Prim 算法", "从一个点出发，每次把离树最近的顶点拉进来");
  const steps = [
    ["初始", "U = {u₀}，TE = {}"],
    ["重复", "在所有 u ∈ U、v ∈ V−U 的边中找权最小的 (u₀, v₀)，加进 TE，v₀ 并入 U"],
    ["结束", "U = V 时停止；TE 恰好 n−1 条边，构成一棵 MST"],
  ];
  steps.forEach((st, i) => {
    const y = 1.1 + i * 0.72;
    numCircle(s, i + 1, 0.5, y + 0.1, 0.42, C.dark);
    text(s, st[0], 1.05, y, 0.8, 0.62, { fontSize: 13, bold: true, color: C.green, valign: "middle", margin: 0 });
    text(s, st[1], 1.85, y, 4.2, 0.62, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  callout(s, "Prim 与 Dijkstra：差别只有一处", "两者都反复「从集合外挑一个距离值最小的顶点并入集合」。但 **Prim 的距离值不累积**，直接用「离集合最近的边距」；Dijkstra 累积的是从源点起的**整条路径长度**。\n时间也相同：O(n²)，**适合稠密图**。", 0.5, 3.35, 5.6, 1.75, { fontSize: 10.5 });
  card(s, 6.35, 1.05, 3.15, 3.0, C.code);
  image(s, "fig-7-23", 6.5, 1.12, 2.85, 2.55);
  text(s, "图 7.23  本节两个算法共用的带权图", 6.35, 3.7, 3.15, 0.28, { fontSize: 10, color: C.muted, align: "center" });
  text(s, "实现：从指定源点生长；非连通则返回 `nullopt`。", 6.35, 4.2, 3.15, 0.8, { fontSize: 10.5, margin: 0 });
}

// 7.6.1 Prim figures
{
  const s = content("7.6.1", "7.6.1 Prim 算法 · 图 7.24", "在图 7.23 上的六个步骤：每一步都是一棵连着的树");
  card(s, 0.5, 1.02, 9.0, 1.95, C.code);
  image(s, "fig-7-24-abc", 0.6, 1.06, 8.8, 1.87);
  card(s, 0.5, 3.05, 9.0, 1.95, C.code);
  image(s, "fig-7-24-def", 0.6, 3.09, 8.8, 1.87);
  text(s, "从 v₀ 出发依次加入：(v₀,v₄)1 → (v₄,v₅)15 → (v₅,v₆)10 → (v₆,v₂)2 → (v₂,v₁)6 → (v₁,v₃)4，总权 38", 0.5, 5.02, 8.7, 0.25, { fontSize: 9.5, bold: true, color: C.dark, margin: 0 });
}

// 7.6.1 Prim trace table
{
  const s = content("7.6.1", "7.6.1 Prim 算法 · 手算 trace", "distance[v] = v 到当前树的最近边距");
  const I = "∞", X = "✓";
  const c = (t) => (t === X ? { t, align: "center", color: C.muted } : { t, align: "center", mono: true, color: t === I ? C.muted : C.text });
  const hot = (t) => ({ t, align: "center", mono: true, bold: true, color: C.bad });
  table(s, [
    ["轮", "并入", "树边", "v₀", "v₁", "v₂", "v₃", "v₄", "v₅", "v₆"],
    ["1", { t: "v₀", bold: true }, "—", c(X), hot("20"), c(I), c(I), hot("1"), c(I), c(I)],
    ["2", { t: "v₄", bold: true }, "(v₀,v₄) 1", c(X), c("20"), c(I), c(I), c(X), hot("15"), c(I)],
    ["3", { t: "v₅", bold: true }, "(v₄,v₅) 15", c(X), c("20"), c(I), hot("12"), c(X), c(X), hot("10")],
    ["4", { t: "v₆", bold: true }, "(v₅,v₆) 10", c(X), c("20"), hot("2"), hot("8"), c(X), c(X), c(X)],
    ["5", { t: "v₂", bold: true }, "(v₆,v₂) 2", c(X), hot("6"), c(X), c("8"), c(X), c(X), c(X)],
    ["6", { t: "v₁", bold: true }, "(v₂,v₁) 6", c(X), c(X), c(X), hot("4"), c(X), c(X), c(X)],
    ["7", { t: "v₃", bold: true }, "(v₁,v₃) 4", c(X), c(X), c(X), c(X), c(X), c(X), c(X)],
  ], 0.5, 1.05, 9.0, [0.5, 0.7, 1.35, 0.92, 0.92, 0.92, 0.92, 0.92, 0.92, 0.93], { fontSize: 10.5, rowH: 0.36 });
  text(s, "每轮：先挑 distance 最小的未入树顶点并入（记下树边），再用它更新其余顶点。红 = 本轮变小；✓ = 已在树中。", 0.5, 4.0, 9.0, 0.3, { fontSize: 10, color: C.muted, margin: 0 });
  card(s, 0.5, 4.4, 9.0, 0.7, C.dark);
  text(s, "6 条树边，总权 1 + 15 + 10 + 2 + 6 + 4 = 38", 0.7, 4.4, 8.6, 0.7, { fontSize: 15, bold: true, color: C.white, valign: "middle", margin: 0 });
}

// 7.6.1 Prim code
{
  const s = content("7.6.1", "7.6.1 · code/ch07/graph/modern.hpp", "prim：与 dijkstra 几乎同一段代码");
  codeBlock(s, `[[nodiscard]] std::optional<std::vector<Edge>> prim(std::size_t source) const {
    check_vertex(source);
    std::vector<int> distance(vertices(), infinity);
    std::vector<std::size_t> predecessor(vertices());
    std::vector<bool> used(vertices());
    std::vector<Edge> result;
    distance[source] = 0;
    for (std::size_t count = 0; count < vertices(); ++count) {
        const std::size_t from = nearest_unvisited(distance, used);
        if (from == vertices() || distance[from] == infinity) {
            return std::nullopt;
        }
        used[from] = true;
        if (from != source) {
            result.push_back({predecessor[from], from, distance[from]});
        }
        for (std::size_t to = 0; to < vertices(); ++to) {
            if (!used[to] && adjacency_[from][to] < distance[to]) {
                distance[to] = adjacency_[from][to];
                predecessor[to] = from;
            }
        }
    }
    return result;
}`, 0.5, 1.05, 6.3, 4.05, { fontSize: 8.8, hl: [11, 19] });
  callout(s, "与 dijkstra 对比", [
    "Dijkstra 比较的是 D[from] + 边权：**累积**整条路径。",
    "Prim 比较的只是**一条边**的权 `adjacency_[from][to]`。",
  ], 7.0, 1.05, 2.5, 1.9, { fontSize: 10 });
  callout(s, "非连通 → nullopt", "挑出的最近点距离还是 `infinity`：剩下的顶点**连不上**，没有生成树——可预期结果，返回空。", 7.0, 3.1, 2.5, 2.0, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 7.6.2 Kruskal concept
{
  const s = content("7.6.2", "7.6.2 Kruskal 算法", "从边出发：选不成环的最小边，合并森林");
  bullets(s, [
    "**贪心准则**：从剩下的边中选择**不会产生回路**且权值最小的边，加入生成树的边集。",
    "开始时 n 个顶点是 n 个独立连通分量：有 n 个顶点而无边的森林 T = ⟨V, {}⟩。",
    "按权从小到大看每条边：两端在**不同连通分支**就加入 T，否则舍去。",
    "直到 T 中所有顶点都在同一个连通分量中。",
  ], 0.5, 1.05, 5.6, 2.6, { fontSize: 12, gap: 6 });
  card(s, 6.35, 1.05, 3.15, 2.6, C.dark);
  text(s, "「会不会成环」=", 6.55, 1.15, 2.8, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "两个端点是不是已经在同一棵树里", 6.55, 1.5, 2.8, 1.0, { fontSize: 16, bold: true, color: C.white, margin: 0 });
  text(s, "——这正是第 6 章**并查集**的用处。", 6.55, 2.7, 2.8, 0.8, { fontSize: 11.5, color: C.mint, margin: 0 });
  callout(s, "代价与适用", "排序主导：**O(e log e)**，主要取决于边数 → **适合稀疏图**，正好与适合稠密图的 Prim 互补。连通图上两者得到相同总权、n−1 条边。", 0.5, 3.85, 9.0, 1.25, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 7.6.2 Kruskal figures + trace
{
  const s = content("7.6.2", "7.6.2 Kruskal 算法 · 图 7.25 与手算", "中间过程是一片森林，直到最后才连成一棵树");
  card(s, 0.5, 1.02, 5.6, 1.35, C.code);
  image(s, "fig-7-25-abc", 0.55, 1.05, 5.5, 1.3);
  card(s, 0.5, 2.45, 5.6, 1.35, C.code);
  image(s, "fig-7-25-def", 0.55, 2.48, 5.5, 1.3);
  text(s, "图 7.25  Kruskal 在同一张图 7.23 上的步骤", 0.5, 3.83, 5.6, 0.26, { fontSize: 9.5, color: C.muted, align: "center" });
  const A = (t) => ({ t, bold: true, color: C.ok });
  const R = (t) => ({ t, color: C.bad });
  table(s, [
    ["权", "边", "结果"],
    ["1", "(v₀,v₄)", A("接受")],
    ["2", "(v₂,v₆)", A("接受")],
    ["4", "(v₁,v₃)", A("接受")],
    ["6", "(v₁,v₂)", A("接受")],
    ["8", "(v₃,v₆)", R("舍弃：已同一分量")],
    ["10", "(v₅,v₆)", A("接受")],
    ["12", "(v₃,v₅)", R("舍弃：已同一分量")],
    ["15", "(v₄,v₅)", A("接受 → 连通")],
    ["20", "(v₀,v₁)", R("舍弃")],
  ], 6.35, 1.02, 3.15, [0.45, 1.0, 1.7], { fontSize: 9.5, rowH: 0.3, tight: true });
  card(s, 0.5, 4.2, 9.0, 0.9, C.dark);
  text(s, "总权 1 + 2 + 4 + 6 + 10 + 15 = 38，与 Prim 相同——两个算法走的路不同（Prim 按 1, 15, 10, 2, 6, 4 的次序），得到的总权相同。", 0.7, 4.2, 8.6, 0.9, { fontSize: 11.5, color: C.white, valign: "middle", margin: 0 });
}

// 7.6.2 Kruskal code
{
  const s = content("7.6.2", "7.6.2 · code/ch07/graph/modern.hpp", "kruskal：排序 + 并查集");
  codeBlock(s, `[[nodiscard]] std::optional<std::vector<Edge>> kruskal() const {
    std::vector<Edge> edges;
    for (std::size_t from = 0; from < vertices(); ++from) {
        for (std::size_t to = from + 1; to < vertices(); ++to) {
            if (adjacency_[from][to] < infinity) {
                edges.push_back({from, to, adjacency_[from][to]});
            }
        }
    }
    std::sort(edges.begin(), edges.end());
    std::vector<std::size_t> parent(vertices());
    for (std::size_t vertex = 0; vertex < vertices(); ++vertex) {
        parent[vertex] = vertex;
    }
    std::vector<Edge> result;
    for (const Edge& edge : edges) {
        const std::size_t from_root = find_root(parent, edge.from);
        const std::size_t to_root = find_root(parent, edge.to);
        if (from_root != to_root) {
            parent[from_root] = to_root;
            result.push_back(edge);
        }
    }
    return result.size() + 1 == vertices() ? std::optional<std::vector<Edge>>(result)
                                            : std::nullopt;
}`, 0.5, 1.05, 6.35, 4.05, { fontSize: 8.4, hl: [10, 19, 20] });
  callout(s, "读代码", [
    "`to = from + 1`：无向图只取上三角，每条边收一次。",
    "`Edge::operator<` 按权比较，`std::sort` 直接可用。",
    "`find_root`：递归找根并做**路径压缩**（第 6 章并查集）。",
    "两端根不同才合并、收边；最后边数 ≠ n−1 → 不连通 → `nullopt`。",
  ], 7.0, 1.05, 2.5, 4.05, { fontSize: 10 });
}

// 7.6 Prim vs Kruskal & SPT != MST
{
  const s = content("7.6", "7.6 最小生成树 · 对照", "Prim vs Kruskal；最短路树 ≠ 最小生成树");
  table(s, [
    ["", "Prim", "Kruskal"],
    ["出发点", "从**点**出发", "从**边**出发"],
    ["中间过程", "始终是**一棵树**", "一片**森林**"],
    ["关键操作", "挑离树最近的顶点", "排序 + 并查集判环"],
    ["时间", "O(n²)（矩阵）", "O(e log e)"],
    ["适合", "稠密图", "稀疏图"],
  ], 0.5, 1.05, 5.0, [1.3, 1.85, 1.85], { fontSize: 11, rowH: 0.42 });
  card(s, 5.75, 1.05, 3.75, 2.55, C.code);
  text(s, "三个点：A-B 2，B-C 2，A-C 3", 5.9, 1.1, 3.5, 0.28, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  const L = { A: [6.1, 2.95], B: [6.75, 1.75], C: [7.4, 2.95] };
  gedge(s, L.A, L.B, 2, { directed: false, color: C.bad, width: 2.25, off: -0.16, r: 0.18 });
  gedge(s, L.B, L.C, 2, { directed: false, color: C.muted, dash: true, off: -0.16, r: 0.18 });
  gedge(s, L.A, L.C, 3, { directed: false, color: C.bad, width: 2.25, off: 0.16, r: 0.18 });
  Object.entries(L).forEach(([k, p]) => gnode(s, k, p[0], p[1], { r: 0.18, fs: 10 }));
  const R = { A: [7.95, 2.95], B: [8.6, 1.75], C: [9.25, 2.95] };
  gedge(s, R.A, R.B, 2, { directed: false, color: C.ok, width: 2.25, off: -0.16, r: 0.18 });
  gedge(s, R.B, R.C, 2, { directed: false, color: C.ok, width: 2.25, off: -0.16, r: 0.18 });
  gedge(s, R.A, R.C, 3, { directed: false, color: C.muted, dash: true, off: 0.16, r: 0.18 });
  Object.entries(R).forEach(([k, p]) => gnode(s, k, p[0], p[1], { r: 0.18, fs: 10 }));
  text(s, "Dijkstra(A) 树：5", 5.8, 3.25, 1.9, 0.28, { fontSize: 10, bold: true, color: C.bad, align: "center", margin: 0 });
  text(s, "MST：4", 7.7, 3.25, 1.8, 0.28, { fontSize: 10, bold: true, color: C.ok, align: "center", margin: 0 });
  callout(s, "两个目标不同", "**Dijkstra** 保证每个点到**源点**的距离最短；**MST** 保证**总权**最小。结果自然不同。", 5.75, 3.75, 3.75, 1.35, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  text(s, "两个算法走的路不同，得到的边集可以不同，**总权必须相同**。", 0.5, 3.75, 5.0, 0.6, { fontSize: 11.5, margin: 0 });
  text(s, "以上都依赖同一条 MST 性质。", 0.5, 4.4, 5.0, 0.4, { fontSize: 11, color: C.muted, margin: 0 });
}


// Exercises
{
  const s = content("✎", "习题精选", "课后想一想");
  const qs = [
    ["负权", "为什么不能给所有边统一加一个常数后继续用 Dijkstra？给出负权边反例。"],
    ["最短路树", "Dijkstra 是否给出一棵生成树？是否给出一棵最小生成树？证明你的结论。"],
    ["拓扑序计数", "对图 7.29（原书习题 4）的有向图做拓扑排序，能得到多少个不同的拓扑序列？全部写出。"],
    ["存储取舍", "给 `code/ch07/adjacency_list` 加一个删边接口，说明为什么删边在邻接表上是 O(deg u)、在矩阵上是 O(1)。"],
    ["关键路径", "在 DAG 中设计关键路径算法，计算每个顶点的最早发生时间和工程总工期。"],
  ];
  qs.forEach((q, i) => {
    const y = 1.05 + i * 0.8;
    card(s, 0.5, y, 6.4, 0.7, C.code);
    numCircle(s, i + 1, 0.62, y + 0.15, 0.4, C.dark);
    text(s, q[0], 1.15, y, 1.3, 0.7, { fontSize: 11.5, bold: true, color: C.green, valign: "middle", margin: 0 });
    text(s, q[1], 2.45, y, 4.35, 0.7, { fontSize: 10.5, valign: "middle", margin: 0 });
  });
  card(s, 7.15, 1.05, 2.35, 2.7, C.code);
  image(s, "fig-7-29", 7.25, 1.12, 2.15, 2.3);
  text(s, "图 7.29  习题 4 的图例", 7.15, 3.45, 2.35, 0.26, { fontSize: 9.5, color: C.muted, align: "center" });
  text(s, "参考答案见 book/习题与参考答案.md 的同章小节。", 7.15, 3.95, 2.35, 0.8, { fontSize: 9.5, color: C.muted, margin: 0 });
}

  summarySlide("本章小结", [
    ["概念", "有向 / 无向 / 带权；度与入度出度；**连通分量与强连通分量**；生成树有 n−1 条边。"],
    ["三种存储", "矩阵 V²、O(1) 判边，适合稠密图；邻接表 V+E，适合稀疏图；十字链表合并出边与入边。"],
    ["周游与拓扑", "DFS ≈ 先根周游、BFS ≈ 层次周游（队列）；拓扑排序反复摘入度 0 的点，**顺便查环**。"],
    ["最短路径", "Dijkstra 是**贪心**，要求边权非负；Floyd 是**动态规划**，中转点在最外层。"],
    ["MST", "Prim 从点长树（稠密图），Kruskal 从边合并森林（稀疏图）；复杂度由**算法 + 存储结构**一起决定。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
