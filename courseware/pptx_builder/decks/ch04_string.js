// 第四章 字符串 —— 由 dsa-modernization/book/ch04-string.md 整理成的讲课 PPT。
// 生成：cd courseware/pptx_builder && node decks/ch04_string.js ../202609_DSA_04_String.pptx
const path = require("path");
const fs = require("fs");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_04_String.pptx");

// 讲义中引用的图片（name → 本地路径）；幻灯片里用 image(s, name, ...) 引用
const SCAN = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "assets", "scan");
const IMAGES = {
  "fig-4-1": `${SCAN}/fig-4-1.png`,
  "fig-4-2": `${SCAN}/fig-4-2.png`,
  "fig-4-3": `${SCAN}/fig-4-3.png`,
  "fig-4-4": `${SCAN}/fig-4-4.png`,
  "fig-4-6": `${SCAN}/fig-4-6.png`,
  "fig-4-7": `${SCAN}/fig-4-7.png`,
  "fig-4-8": `${SCAN}/fig-4-8.png`,
  "fig-4-9": `${SCAN}/fig-4-9.png`,
  "fig-4-12": `${SCAN}/fig-4-12.png`,
};

// 幻灯片上的代码逐字取自讲义（讲义里的代码又由 check_doc.py R3 与 code/ch04/ 逐字核对）。
// src(a, b)：讲义第 a..b 行（1 起始，含两端）；pre/post 用于拆页时补 "// ..."。
const BOOK = path.join((process.env.DSA_BOOK || path.join(__dirname, "..", "..", "..", "..", "dsa-modernization", "book")), "ch04-string.md");
const BOOK_LINES = fs.readFileSync(BOOK, "utf8").split("\n");
function src(a, b, { pre = "", post = "" } = {}) {
  const lines = BOOK_LINES.slice(a - 1, b);
  if (lines.some((l) => l.startsWith("```"))) throw new Error(`src(${a}, ${b}) 越过了代码块边界`);
  return (pre ? pre + "\n" : "") + lines.join("\n") + (post ? "\n" + post : "");
}

(async () => {
  const D = createDeck({ title: "DSA 第四章 字符串", imgDir: path.join(__dirname, "..", ".cache", "ch04") });
  await D.fetchImages(IMAGES);
  const {
    pres, C, FONT, MONO, runs, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
    cells, arrowLabel, pill, numCircle, titleSlide, sectionSlide, content, summarySlide,
  } = D;
  const RED = "FDF0EE";

// ---- slides（顶层不缩进）----
// =====================================================================
titleSlide({
  kicker: "数据结构与算法 · 2026 Fall",
  title: "第四章  字符串",
  subtitle: "String：元素是字符、操作按整段的线性表",
  topics: "串、子串、真子串 · 字符编码：ASCII → UTF-8 · 编码顺序与字典序\n顺序存储与 '\\0' · 教学版 String：三法则与变长存储管理\nappend / substr / find / compare · 进阶：移动语义与 raw()\n朴素匹配与原书「差 1」 · 特征向量 next · KMP 与线性论证 · 最小循环节",
  footer: "Compiled by Hongfei Yan · Updated 2026-09-21 · github.com/GMyhf/dsa-modernization",
});

// 本章三个问题
{
  const s = content("?", "本章导引", "本章要回答三个问题");
  const qs = [
    ["字符串和普通线性表差在哪？", "元素限定为**字符集**；操作以**串的整体**为对象。而且 `char` 是一个字节，**不等于**一个字符。"],
    ["长度一直在变，缓冲区归谁管？", "顺序存放、交给类去管：构造申请、析构释放、拷贝另开——**容量、复制、下标边界**。"],
    ["在 30 亿个字符里找模式，怎么找得动？", "朴素匹配失配只右移一位；KMP 预先算 `next`，**不重复比较**已知相等的前缀。"],
  ];
  qs.forEach((q, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.6, C.code);
    numCircle(s, i + 1, x + 0.2, 1.32, 0.46, C.dark);
    text(s, q[0], x + 0.2, 1.92, 2.5, 0.7, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, q[1], x + 0.2, 2.65, 2.5, 1.05, { fontSize: 11.5, margin: 0, lsm: 1.2 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "一句话概括", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  s.addText(runs("存串的类管**容量与所有权**；找串的算法管**比较顺序**——KMP 让目标下标**只增不减**。", { color: C.white, boldColor: C.gold }),
    { x: 0.75, y: 4.38, w: 8.6, h: 0.5, fontFace: FONT, fontSize: 15, margin: 0, isTextBox: true, valign: "middle" });
}

// 内容地图
{
  const s = content("≡", "本章导引", "内容地图");
  const cols = [
    ["4.1  基本概念", ["串、长度、空串", "与线性表的两点区别", "子串与真子串", "原书【代码4.1】的三处修改", "4.1.1 字符编码：ASCII → UTF-8", "4.1.2 编码顺序与字典序"]],
    ["4.2  存储与实现", ["4.2.1 顺序存储、'\\0' 与标准串函数", "4.2.2 String 类：教学版完整实现", "构造、三法则、变长管理", "4.2.3 追加 / 子串 / 查找 / 比较", "4.2a 进阶：移动语义与 raw()"]],
    ["4.3  模式匹配", ["问题与记号：都从位置 0 开始", "4.3.1 朴素匹配；原书返回值差 1", "4.3.2 特征向量 next", "4.3.3 KMP 与线性论证", "KMP 的另一个用途：最小循环节", "本章小结"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 3.9, i === 2 ? C.cream : C.code);
    text(s, c[0], x + 0.2, 1.3, 2.5, 0.45, { fontSize: 19, bold: true, color: C.dark, margin: 0 });
    bullets(s, c[1], x + 0.15, 1.9, 2.6, 3.0, { fontSize: 12, gap: 8 });
  });
}

// 先跑一遍：String
{
  const s = content("▶", "先跑一遍", "用教学版 String 走一遍 append / substr / find");
  codeBlock(s, src(19, 38), 0.5, 1.1, 6.45, 4.0, { fontSize: 8.5 });
  consoleBlock(s, "拼接后: Hello C++\n子串: C++\n首次出现 C 的下标: 6", 7.1, 1.1, 2.4, 1.15, 9.5);
  text(s, "c++ -std=c++17 -Wall -Wextra -Werror \\\n  -Icode/ch04/string_class \\\n  code/ch04/string_class/demo.cpp", 7.1, 2.35, 2.4, 0.65, { fontSize: 7.5, color: C.muted });
  callout(s, "看到了什么", [
    "`append` 返回 `String&`，所以能**连着写**。",
    "`substr(6, 3)` 从下标 6 取 3 个字符。",
    "`find` 返回 **optional**：找不到不用 `-1` 和位置 0 抢同一个数字。",
    "缓冲区是手写的 `char*`——换成 `std::string` 这一节就没了。",
  ], 7.1, 3.1, 2.4, 2.0, { fontSize: 9.5, gap: 3 });
}

// 先跑一遍：pattern matching
{
  const s = content("▶", "先跑一遍", "图 4.12 那对串：正确起始下标是 10，原书返回 11");
  codeBlock(s, src(58, 71), 0.5, 1.1, 6.6, 3.0, { fontSize: 8.5 });
  consoleBlock(s, "图4.12 的串，正确起始下标是 10\n朴素: 10\nKMP:  10\n原书返回 11，一律差 1", 7.3, 1.1, 2.2, 1.5, 8.5);
  callout(s, "不是写法问题", "是**算法结果错**：原书两个匹配算法返回的位置**都差 1**。4.3.1 节末专门讲。", 7.3, 2.75, 2.2, 1.35, { fontSize: 9.5, fill: RED, tcolor: C.bad });
  card(s, 0.5, 4.25, 9.0, 0.85, C.code);
  text(s, "T", 0.65, 4.32, 0.3, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  text(s, "abcddabcab**abcdaabcab**cdaabcabaa", 0.95, 4.3, 5.5, 0.32, { fontSize: 13, fontFace: MONO, margin: 0, color: C.text });
  text(s, "P", 0.65, 4.66, 0.3, 0.3, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  s.addText([{ text: "          ", options: {} }, { text: "abcdaabcab", options: { bold: true, color: C.bad } }], { x: 0.95, y: 4.64, w: 5.5, h: 0.32, fontFace: MONO, fontSize: 13, margin: 0, isTextBox: true });
  text(s, "匹配段从下标 **10** 开始（0 起始），而原书的 `j - pLen + 1` 给出 11。", 6.3, 4.32, 3.1, 0.7, { fontSize: 10.5, margin: 0 });
}

// ============================ PART 1 ============================
sectionSlide("Part 1 · 4.1", "字符串的基本概念", "串、长度、子串 · 与线性表的两点区别\n字符编码：ASCII → UNICODE / UTF-8 · 编码顺序与字典序");

// 4.1 定义
{
  const s = content("4.1", "4.1 基本概念", "字符串：元素为单个字符的线性表");
  bullets(s, [
    "**字符串**（string）：组成元素（结点）为**单个字符**的线性表，简称「串」。",
    "可以是一个单词、一个句子、一篇文章，或者一个文件的内容。",
    "串中所含字符个数称为**串的长度**；长度为零的串称为**空串**，不含任何字符。",
  ], 0.5, 1.1, 9.0, 1.3, { fontSize: 13.5, gap: 8 });
  text(s, "与线性表相比，逻辑结构上有两点区别", 0.5, 2.5, 9, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
  const diff = [
    ["数据对象", "约束为**字符集**。", "元素不再是任意类型 T，而是一个个字符。"],
    ["操作对象", "以「**串的整体**」为操作对象。", "线性表的操作大多以「单个元素」为对象；串的拼接、复制、抽取子串、模式匹配，动的都是**一整段**。"],
  ];
  diff.forEach((d, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 2.95, 4.35, 2.1, C.code);
    numCircle(s, i + 1, x + 0.2, 3.1, 0.42, C.dark);
    text(s, d[0], x + 0.75, 3.12, 3.4, 0.38, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
    text(s, d[1], x + 0.2, 3.65, 3.95, 0.4, { fontSize: 13, margin: 0 });
    text(s, d[2], x + 0.2, 4.1, 3.95, 0.85, { fontSize: 11, color: C.muted, margin: 0 });
  });
}

// 子串
{
  const s = content("4.1", "4.1 基本概念", "子串：一个串是不是另一个串的一段");
  card(s, 0.5, 1.1, 9.0, 1.45, C.code);
  text(s, "设 s₁ = a₀a₁⋯aₙ₋₁，s₂ = b₀b₁⋯bₘ₋₁（0 ≤ m ≤ n）。若存在整数 i（0 ≤ i ≤ n − m），使得对任意 j = 0, 1, ⋯, m−1 都有 **bⱼ = aᵢ₊ⱼ**，则称 s₂ 是 s₁ 的**子串**，或称 s₁ 包含 s₂。", 0.7, 1.2, 8.6, 1.25, { fontSize: 13, lsm: 1.2 });
  bullets(s, [
    "**空串**是所有字符串的子串。",
    "任何串都是**其自身**的子串。",
    "非空、且不为 `str` 自身的子串，称为 `str` 的**真子串**。",
  ], 0.5, 2.75, 4.4, 1.5, { fontSize: 13, gap: 8 });
  card(s, 5.15, 2.75, 4.35, 1.5, C.cream);
  text(s, "例：以下都是真子串", 5.3, 2.82, 4, 0.3, { fontSize: 11.5, bold: true, color: C.goldText, margin: 0 });
  s.addText([
    { text: "The ", options: {} }, { text: "quick", options: { bold: true, color: C.bad } },
    { text: " brown dog ", options: {} }, { text: "jump", options: { bold: true, color: C.bad } },
    { text: "s over the lazy ", options: {} }, { text: "fox", options: { bold: true, color: C.bad } },
  ], { x: 5.3, y: 3.2, w: 4.1, h: 0.45, fontFace: MONO, fontSize: 10.5, color: C.text, margin: 0, isTextBox: true });
  text(s, "`\"quick\"`、`\"jump\"`、`\"fox\"`、`\"brown dog\"`", 5.3, 3.7, 4.1, 0.4, { fontSize: 11, margin: 0 });
  callout(s, "伏笔", "4.3 节的**模式匹配**问的就是：一个串是不是另一个串的子串？如果是，**从哪个位置开始**？", 0.5, 4.4, 9.0, 0.7, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 原书代码 4.1 三处修改
{
  const s = content("4.1", "4.1 基本概念 · 抽象数据类型", "原书【代码4.1】有三处今天必须改");
  const items = [
    ["类名是小写的 string", "在任何 `using namespace std;` 的翻译单元里，与 `std::string` **构成歧义**。原书正文随后又改用大写 `String`，同一章两个名字混用。", "类名大写 String"],
    ["int 表达布尔，-1 表示没找到", "`int isEmpty();`、`int find(const char c, const int start);`——`-1` 与「位置 0」只差一个符号，漏判就把「没找到」当成「匹配在开头」。", "bool empty() · optional<size_type> find"],
    ["修改器按值返回", "`string append(const char c);` 返回 `string` 而非引用。只有声明没有函数体，不能断定会丢结果；**能断定的是签名含混**：`s.append('x');` 改没改 `s`？", "修改器返回 String&"],
  ];
  items.forEach((it, i) => {
    const y = 1.1 + i * 1.33;
    card(s, 0.5, y, 9.0, 1.2, C.code);
    numCircle(s, i + 1, 0.7, y + 0.38, 0.45, C.bad);
    text(s, it[0], 1.35, y + 0.08, 5.3, 0.35, { fontSize: 14, bold: true, color: C.dark, margin: 0 });
    text(s, it[1], 1.35, y + 0.45, 5.4, 0.72, { fontSize: 10.5, margin: 0 });
    pill(s, "→ " + it[2], 6.95, y + 0.4, 2.4, 0.42, C.green, C.white, 9.5);
  });
}

// 4.1.1 ASCII
{
  const s = content("4.1.1", "4.1 基本概念 · 字符编码", "逻辑元素是字符，内存里保存的是编码单元");
  text(s, "计算机只认 0、1 组成的字节，字符集的「字符」要用「字节」表示——这就是**字符编码**。C/C++ 的 `char` 是单字节，采用 **ASCII**：每个字符一个字节，低 7 位表示字符，最高位为 0，共 **128** 个字符。", 0.5, 1.05, 9, 0.75, { fontSize: 12.5 });
  table(s, [
    ["编号", "个数", "类别", "举例"],
    ["0～32、127", "34", "控制 / 通信专用字符", "LF、CR、FF、DEL、BEL；SOH、EOT、ACK"],
    ["33～126", "94", "通用字符", "52 个大小写字母、10 个数字、标点与运算符号"],
    [{ t: "48～57", mono: true }, "10", "数字 0–9", { t: "'0' = 48", mono: true }],
    [{ t: "65～90", mono: true }, "26", "大写字母 A–Z", { t: "'A' = 65", mono: true }],
    [{ t: "97～122", mono: true }, "26", "小写字母 a–z", { t: "'a' = 97", mono: true }],
  ], 0.5, 1.9, 9.0, [1.3, 0.7, 2.4, 4.6], { fontSize: 10.5, rowH: 0.34 });
  callout(s, "记住三个区间都是连续递增的", "数字、大写字母、小写字母各自占一段**连续**的编号——4.1.2 节的字符比较就建立在这一点上。", 0.5, 4.4, 9.0, 0.7, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 编码冲突 → Unicode
{
  const s = content("4.1.1", "4.1 基本概念 · 字符编码", "从各自为政到 UNICODE / UTF-8");
  const steps = [
    ["ASCII", "20 世纪 60 年代制定", "没有考虑中文、阿拉伯文等国际文字的统一编码。", C.muted],
    ["各语言各自编码", "GB2312-80 · BIG5 · S-JIS · Wansung", "中文 GB2312-80（简体，6763 个汉字）、BIG5（繁体，13053 个汉字）…… **不同系统可能用相同的编号表示不同的字符**。", C.bad],
    ["UNICODE", "通用文字符号编码标准", "可伸缩：既能容纳多语言的大编码集，也能缩减，用单字节表示常用 ASCII 符号。", C.green],
    ["UTF-8", "今天最常见的落地形式", "以 **1～4 个字节**编码一个 Unicode 码点，且与 ASCII **完全兼容**。", C.ok],
  ];
  steps.forEach((st, i) => {
    const y = 1.1 + i * 0.98;
    pill(s, st[0], 0.5, y + 0.2, 2.0, 0.45, st[3], C.white, 12);
    if (i < 3) s.addShape(pres.shapes.LINE, { x: 1.5, y: y + 0.67, w: 0, h: 0.5, line: { color: C.muted, width: 1.2, endArrowType: "triangle" } });
    text(s, st[1], 2.75, y + 0.05, 6.7, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    text(s, st[2], 2.75, y + 0.37, 6.7, 0.55, { fontSize: 11, margin: 0 });
  });
}

// char ≠ 字符
{
  const s = content("4.1.1", "4.1 基本概念 · 字符编码", "一条 2008 年的书还讲不到的结论：char ≠ 字符");
  card(s, 0.5, 1.1, 9.0, 1.05, C.dark);
  s.addText(runs("C++ 的 `char` 是**一个字节**，不等于一个「人眼看到的字符」。", { color: C.white, boldColor: C.gold, codeColor: C.mint }),
    { x: 0.75, y: 1.1, w: 8.6, h: 1.05, fontFace: FONT, fontSize: 18, margin: 0, isTextBox: true, valign: "middle" });
  bullets(s, [
    "`std::string::size()` 返回的是**字节数**，不能用来数 Unicode 字符。",
    "要数字符，就得**按 UTF-8 解码**，或使用明确的 Unicode 库。",
    "字面量 `u8\"...\"` 表示 **UTF-8 字节序列**。",
  ], 0.5, 2.4, 5.4, 1.8, { fontSize: 13, gap: 10 });
  callout(s, "好消息", "编码本身**不改变**字符串概念和操作的本质：查找、拼接、抽取子串的接口语义与编码无关。\n\n所以本书与原书一样，**以 ASCII 为主**，基本不涉及多国语言混排。", 6.15, 2.4, 3.35, 2.7, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  text(s, "自检：字节数、字符数、显示宽度是三个不同层次，UTF-8 下不能混用。", 0.5, 4.45, 5.4, 0.6, { fontSize: 11, color: C.goldText, bold: true, margin: 0 });
}

// 4.1.2 编码顺序
{
  const s = content("4.1.2", "4.1 基本概念 · 编码顺序", "偏序编码规则：编码顺序与自然次序一致");
  text(s, "令 encode(x) 为符号 x 到其 ASCII 编码的映射，则 10 个数字符号的编码**连续递增**：", 0.5, 1.05, 9, 0.35, { fontSize: 12.5 });
  card(s, 0.5, 1.5, 9.0, 0.6, C.code);
  text(s, "encode('0') + 1 = encode('1'),  encode('1') + 1 = encode('2'),  ⋯,  encode('8') + 1 = encode('9')", 0.6, 1.5, 8.8, 0.6, { fontSize: 12, fontFace: MONO, align: "center", valign: "middle", margin: 0 });
  bullets(s, [
    "字母 A…Z、a…z 遵循同样的偏序规则。",
    "于是任意两个字符 `ch1`、`ch2` 可以**直接用编码值比较大小**；对字母而言，就是字典编目次序。",
    "两个串按构成它们的字符**逐个**比较大小。",
  ], 0.5, 2.3, 5.2, 2.0, { fontSize: 12.5, gap: 8 });
  card(s, 5.95, 2.3, 3.55, 2.0, C.cream);
  text(s, "字典次序", 6.1, 2.38, 3, 0.3, { fontSize: 12, bold: true, color: C.goldText, margin: 0 });
  text(s, "\"monday\" < \"sunday\" < \"tuesday\"\n\"123\" < \"1234\" < \"23\"", 6.1, 2.75, 3.35, 0.7, { fontSize: 11, fontFace: MONO, bold: true, margin: 0, lsm: 1.3 });
  text(s, "星期一在星期二之前，整数 123 比 23 大——**与日常理解的次序不同**。", 6.1, 3.5, 3.3, 0.75, { fontSize: 10.5, margin: 0 });
  callout(s, "比较规则", "先比较**第一个不同的编码单元**；若一个是另一个的**前缀**，较短者更小。", 0.5, 4.38, 9.0, 0.74, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 字节序 ≠ 语言顺序
{
  const s = content("4.1.2", "4.1 基本概念 · 编码顺序", "编码值比较 ≠ 自然语言排序");
  const cards = [
    ["同一区间内可比", "ASCII 保留了 `0`–`9`、大写字母、小写字母**各自连续**的区间，同一区间内可用编码值比较。", C.ok],
    ["不是语言学排序", "编码值比较按码元的字典序；**大小写、重音、中文排序**都可能需要额外的 locale 或排序键。", C.goldText],
    ["不是整数比较", "对 `std::string` 而言 `\"123\" < \"1234\" < \"23\"`，但这不是整数大小比较。", C.bad],
  ];
  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.15, 2.85, 2.55, C.code);
    pill(s, c[0], x + 0.2, 1.3, 2.45, 0.4, c[2], C.white, 11.5);
    text(s, c[1], x + 0.2, 1.85, 2.5, 1.75, { fontSize: 11.5, margin: 0, lsm: 1.2 });
  });
  card(s, 0.5, 3.95, 9.0, 1.1, C.dark);
  text(s, "结论", 0.75, 4.05, 3, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "比较前必须先约定**编码和规范化方式**，不能把「字节序」误当成「自然语言顺序」。本节的比较次序也适合 GB2312 等其他文字的排序需要。", 0.75, 4.35, 8.6, 0.65, { fontSize: 12.5, color: C.white, margin: 0 });
}

// C++ 坑：字面量比较地址
{
  const s = content("4.1.2", "4.1 基本概念 · C++ 特有的坑", "两个字符串字面量之间写 <，比的是地址");
  consoleBlock(s, src(188, 194), 0.5, 1.1, 9.0, 2.1, 9);
  card(s, 0.5, 3.4, 4.35, 1.7, "EAF4EF");
  text(s, "✓  有一边是 std::string", 0.7, 3.5, 4, 0.35, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  text(s, "比的是**内容**：`\"123\" < std::string(\"1234\")` 为 true，`std::string(\"1234\") < \"23\"` 为 true。", 0.7, 3.95, 4.0, 1.05, { fontSize: 11.5, margin: 0 });
  card(s, 5.15, 3.4, 4.35, 1.7, RED);
  text(s, "✗  两边都是裸字面量", 5.35, 3.5, 4, 0.35, { fontSize: 14, bold: true, color: C.bad, margin: 0 });
  text(s, "比的是两个数组的**地址**，由编译器摆放决定：`(\"123\" < \"1234\")` 得到 false——答案反了。", 5.35, 3.95, 4.0, 1.05, { fontSize: 11.5, margin: 0 });
  text(s, "本书凡是比较字符串，一律先落到 `String` / `std::string` 上，再谈编码顺序。", 0.5, 5.12, 9, 0.28, { fontSize: 10, color: C.goldText, bold: true, margin: 0 });
}

// ============================ PART 2 ============================
sectionSlide("Part 2 · 4.2", "字符串的存储结构和实现", "顺序存储与 '\\0' · 标准串函数\n教学版 String：构造、三法则、变长存储管理\nappend / concatenate / substr / find / compare · 进阶：移动语义");

// 变长特点 + 为什么没有 Python 版
{
  const s = content("4.2", "4.2 存储结构和实现", "这一节的正题：变长存储管理");
  bullets(s, [
    "字符串长度变化显著——**短如单词，长为文件**；长度分布的方差很大。",
    "此时用**静态长度的向量**作为存储结构是**不恰当**的。",
    "拼接、查找、置换、模式匹配本身都涉及变长操作，开销大，必须精心设计算法、选择存储结构。",
    "本节重点：程序执行过程中字符串的**变长存储**问题。",
  ], 0.5, 1.1, 5.3, 2.8, { fontSize: 12.5, gap: 9 });
  callout(s, "为什么这一节没有 Python 版", "对象是**自管理的字符缓冲区**：长度、容量、结尾空字符、深复制、移动后源对象的状态都是接口契约。\n\nPython 的 str 不可变，list 也不让你实现分配、释放和强异常保证——会跳过存储布局与所有权问题。\n\n所以 4.3 的模式匹配有 Python 版，4.2 的字符串类**只保留 C++**。", 6.05, 1.1, 3.45, 4.0, { fontSize: 10.5 });
  card(s, 0.5, 4.05, 5.3, 1.05, C.dark);
  s.addText(runs("缓冲区是裸 `char*`——换成 `std::string`，这一节就**没了**。", { color: C.white, boldColor: C.gold, codeColor: C.gold }),
    { x: 0.7, y: 4.05, w: 5.0, h: 1.05, fontFace: FONT, fontSize: 14, margin: 0, isTextBox: true, valign: "middle" });
}

// 4.2.1 顺序存储 + 图 4.1
{
  const s = content("4.2.1", "4.2 存储结构 · 顺序存储", "顺序存储：连续字符数组 + 结尾的 '\\0'");
  card(s, 0.5, 1.05, 4.6, 2.55, C.code);
  image(s, "fig-4-1", 0.65, 1.12, 4.3, 2.2);
  text(s, "图 4.1  C 风格字符串的变量说明", 0.5, 3.33, 4.6, 0.25, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  codeBlock(s, "char s1[12] = \"Hello world\";\nchar s2[8]  = \"2008\";\nchar s3[6];", 0.5, 3.75, 4.6, 0.85, { fontSize: 10.5, lang: "text" });
  text(s, "s3 没给初值，存的就是空串。", 0.5, 4.7, 4.6, 0.3, { fontSize: 10.5, color: C.muted, margin: 0 });
  bullets(s, [
    "末尾保留 `'\\0'` 作结束标志；另记不含终止符的长度 `length`。",
    "容量至少 `length + 1`；`'\\0'` **不计入长度**。`char s[M];` 的串长不能超过 **M − 1**。",
    "适合访问单个字符或连续一组字符：按下标取第 i 个字符 **O(1)**。",
    "插入 / 删除要移动其后所有字符；拼接、抽子串要复制一段连续区域。",
    "容量不足：申请更大数组 → 复制 → 释放旧数组 → 更新指针和长度。",
  ], 5.35, 1.05, 4.15, 3.2, { fontSize: 11.5, gap: 6 });
  callout(s, "静态定长的局限", "数组一旦定长，运行中产生更长的串就会**溢出**——这正是接下来用一个类来解决的问题。", 5.35, 4.2, 4.15, 0.9, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// 表 4.1 标准串函数
{
  const s = content("4.2.1", "4.2 存储结构 · 顺序存储", "表 4.1  标准串函数（<cstring>）");
  table(s, [
    ["函数名", "功能说明"],
    [{ t: "size_t strlen(char* s)", mono: true }, "求 `s` 的当前长度，**不计结束符**；空串长度为 0"],
    [{ t: "char* strcpy(char* s1, const char* s2)", mono: true }, "将 `s2` 复制到 `s1`，返回指向 `s1` 开始的指针"],
    [{ t: "char* strcat(char* s1, const char* s2)", mono: true }, "将 `s2` 拼接到 `s1` 尾部"],
    [{ t: "int strcmp(const char* s1, const char* s2)", mono: true }, "全同返回 0；`s1` 大于 `s2` 返回正数，小于返回负数"],
    [{ t: "char* strchr(char* s, char c)", mono: true }, "定位 `s` 中第一次出现 `c` 的位置，没有则返回空指针"],
    [{ t: "char* strrchr(char* s, char c)", mono: true }, "从尾部逆向定位最后一次出现 `c` 的位置，没有则返回空指针"],
  ], 0.5, 1.1, 9.0, [4.1, 4.9], { fontSize: 10.5, rowH: 0.44 });
  callout(s, "输入 / 输出也属于标准串函数库", "`cin >> s1;` 从标准输入读取字符串到 `s1`；`cout << s1;` 把 `s1` 的内容输出到标准输出。", 0.5, 4.35, 9.0, 0.75, { fontSize: 11.5, fill: C.mint, tcolor: C.dark });
}

// 图 4.2 strchr + s1 = s2 陷阱
{
  const s = content("4.2.1", "4.2 存储结构 · 顺序存储", "strchr / strrchr 返回指针；s1 = s2 不是复制内容");
  card(s, 0.5, 1.05, 9.0, 2.0, C.code);
  image(s, "fig-4-2", 0.8, 1.12, 8.4, 1.65);
  text(s, "图 4.2  在 s1 中定位字符 'o'：strchr 找到下标 4，strrchr 找到下标 7", 0.5, 2.78, 9, 0.25, { fontSize: 9.5, color: C.muted, align: "center", margin: 0 });
  callout(s, "「没找到」怎么表达", "两个函数找不到时返回**空指针**。本书的 `String` 用**下标**加 `std::optional` 表达同一件事——「没找到」不再靠一个特殊指针值。", 0.5, 3.25, 4.35, 1.85, { fontSize: 11 });
  callout(s, "非常容易犯的错误", "C++ 的字符数组用字符指针指向始址，`s1 = s2` **不能**理解为把 `s2` 的内容复制到 `s1`。这正是 `String` 必须自己写拷贝赋值运算符的原因。", 5.15, 3.25, 4.35, 1.85, { fontSize: 11, fill: RED, tcolor: C.bad });
}

// 4.2.2 为什么不用链式
{
  const s = content("4.2.2", "4.2 存储结构 · String 类", "变长存储为什么不走链表？");
  card(s, 0.5, 1.1, 4.35, 2.6, RED);
  text(s, "✗  链式存储：每个结点一个字符", 0.7, 1.2, 4, 0.35, { fontSize: 13.5, bold: true, color: C.bad, margin: 0 });
  ["H", "e", "l"].forEach((v, i) => {
    const x = 0.8 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.85, w: 0.35, h: 0.42, fill: { color: C.mint }, line: { color: C.green, width: 1 } });
    text(s, v, x, 1.85, 0.35, 0.42, { fontSize: 12, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.35, y: 1.85, w: 0.55, h: 0.42, fill: { color: "F9D5D0" }, line: { color: C.bad, width: 1 } });
    text(s, "next", x + 0.35, 1.85, 0.55, 0.42, { fontSize: 8.5, align: "center", valign: "middle", margin: 0 });
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 0.9, y: 2.06, w: 0.4, h: 0, line: { color: C.bad, width: 1.2, endArrowType: "triangle" } });
  });
  text(s, "1 字节的数据配 8 字节的指针（64 位机）：**每一个链指针比一个字符所占的空间还大**。回到 2.4 节那条判据：指针所占比例超过 1:1 就要慎重。", 0.7, 2.5, 4.0, 1.15, { fontSize: 11, margin: 0 });
  card(s, 5.15, 1.1, 4.35, 2.6, "EAF4EF");
  text(s, "✓  仍然顺序存放，交给类去管", 5.35, 1.2, 4, 0.35, { fontSize: 13.5, bold: true, color: C.ok, margin: 0 });
  pill(s, "data_", 5.4, 1.85, 0.8, 0.34, C.dark, C.gold, 10);
  pill(s, "size_ = 5", 5.4, 2.3, 1.1, 0.34, C.dark, C.gold, 10);
  s.addShape(pres.shapes.LINE, { x: 6.2, y: 2.02, w: 0.45, h: 0, line: { color: C.green, width: 1.5, endArrowType: "triangle" } });
  cells(s, 6.7, 1.82, ["H", "e", "l", "l", "o", "\\0"], { cw: 0.44, ch: 0.4, fs: 11, fills: [null, null, null, null, null, C.cream] });
  text(s, "类里只存**一个指针 + 一个长度**；字符本体在堆上。缓冲区的分配与释放由类负责。", 5.35, 2.85, 4.0, 0.8, { fontSize: 11, margin: 0 });
  text(s, "顺序存储只说了「字符放在哪」；包成类之后，「这块内存归谁、什么时候还」才有着落：", 0.5, 3.9, 9, 0.35, { fontSize: 12, margin: 0 });
  const three = [["构造时", "申请"], ["析构时", "释放"], ["拷贝时", "另开一份"]];
  three.forEach((t, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.35, 2.85, 0.7, C.code);
    text(s, t[0], x + 0.2, 4.35, 1.2, 0.7, { fontSize: 13, color: C.text, valign: "middle", margin: 0 });
    pill(s, t[1], x + 1.35, 4.5, 1.3, 0.4, C.green, C.white, 12);
  });
}

// 教学版代码 1：构造
{
  const s = content("4.2.2", "4.2 String 类 · 教学版 teaching.hpp（1/5）", "空串也占 1 个字节；从 C 字符串构造");
  codeBlock(s, src(309, 333), 0.5, 1.05, 6.3, 4.05, { fontSize: 8.5 });
  card(s, 7.0, 1.05, 2.5, 1.55, C.code);
  text(s, "两个数据成员", 7.15, 1.12, 2.3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  s.addText([
    { text: "char* data_", options: { fontFace: MONO, bold: true, color: C.green, breakLine: true } },
    { text: "以 '\\0' 结尾，永远非空", options: { breakLine: true } },
    { text: "size_type size_", options: { fontFace: MONO, bold: true, color: C.green, breakLine: true } },
    { text: "字符个数，不含 '\\0'", options: {} },
  ], { x: 7.15, y: 1.45, w: 2.3, h: 1.1, fontFace: FONT, fontSize: 9.5, color: C.text, margin: 0, isTextBox: true, valign: "top" });
  callout(s, "空串为什么申请 1 字节", "里面放一个 `'\\0'`，于是 `c_str()` **永远返回合法的 C 字符串**，调用方不必先判空指针。", 7.0, 2.75, 2.5, 1.3, { fontSize: 10 });
  callout(s, "故意不加 explicit", "为了保住 `String s1 = \"Hello\";` 这种写法。", 7.0, 4.2, 2.5, 0.9, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 构造与所有权：原书两处问题
{
  const s = content("4.2.2", "4.2 String 类 · 构造与所有权", "原书【算法4.4】的构造函数：两处问题");
  card(s, 0.5, 1.1, 4.35, 3.0, RED);
  numCircle(s, 1, 0.7, 1.22, 0.42, C.bad);
  text(s, "assert(str != '\\0') 编译不过", 1.25, 1.25, 3.5, 0.38, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "`'\\0'` 是 `char`，不是空指针常量；指针与它比较是 ill-formed。",
    "改成 `assert(str != nullptr)` 也无效：`new` 失败抛 `std::bad_alloc`，**从不返回空指针**。",
    "`assert` 在 `NDEBUG` 构建里整个消失。",
  ], 0.65, 1.8, 4.1, 2.2, { fontSize: 11, gap: 6 });
  card(s, 5.15, 1.1, 4.35, 3.0, RED);
  numCircle(s, 2, 5.35, 1.22, 0.42, C.bad);
  text(s, "参数类型是 char*", 5.9, 1.25, 3.5, 0.38, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  bullets(s, [
    "原书自己写：`String s1 = \"Hello\";` 隐含调用 `String::String(char* s)`。",
    "字面量类型是 `const char[6]`，转成 `char*` **从 C++11 起已被移除**。",
    "GCC 默认降级为警告，在本书 `-Werror` 构建下即是错误。",
  ], 5.3, 1.8, 4.1, 2.2, { fontSize: 11, gap: 6 });
  callout(s, "还有一处原书没做的检查", "构造函数对 `s == nullptr` 毫无防备——而 4.2.3 节原书的 `Substr` 恰好会喂给它一个空指针。本书：参数 `const char*`，空指针抛 `std::invalid_argument`。", 0.5, 4.25, 9.0, 0.85, { fontSize: 11 });
}

// 教学版代码 2：三法则
{
  const s = content("4.2.2", "4.2 String 类 · 教学版 teaching.hpp（2/5）", "三法则：拷贝构造与拷贝赋值");
  codeBlock(s, src(335, 352), 0.5, 1.05, 9.0, 2.95, { fontSize: 8.5, hl: [12, 14] });
  const steps = [["备好新的", "new + memcpy", C.green], ["释放旧的", "delete[] data_", C.bad], ["接管", "data_ = fresh", C.green]];
  card(s, 0.5, 4.12, 4.6, 0.98, C.code);
  text(s, "拷贝赋值的三步顺序", 0.62, 4.15, 3, 0.26, { fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
  steps.forEach((st, i) => {
    const x = 0.62 + i * 1.5;
    numCircle(s, i + 1, x, 4.5, 0.32, st[2]);
    text(s, st[0], x + 0.38, 4.44, 1.1, 0.24, { fontSize: 10, bold: true, color: C.dark, margin: 0 });
    text(s, st[1], x + 0.38, 4.7, 1.1, 0.3, { fontSize: 7.5, color: C.muted, fontFace: MONO, margin: 0 });
  });
  callout(s, "顺序反过来 / 只有析构", "`new` 抛异常时对象停在「**指针已释放**」的破碎状态。只有析构没有拷贝：`String b = a;` 即**二次释放**。", 5.3, 4.12, 4.2, 0.98, { fontSize: 9.5, fill: RED, tcolor: C.bad, tsize: 10.5 });
}

// 图 4.3 / 4.4 变长管理
{
  const s = content("4.2.2", "4.2 String 类 · 变长存储管理", "图 4.3 / 4.4：String 按当前串长动态调整空间");
  card(s, 0.5, 1.05, 3.9, 1.6, C.code);
  image(s, "fig-4-3", 0.6, 1.12, 3.7, 1.15);
  text(s, "图 4.3  `String s1 = \"Hello\";`", 0.6, 2.3, 3.7, 0.3, { fontSize: 10, color: C.muted, align: "center", margin: 0 });
  text(s, "在动态存储区开一个长度为 **6** 的字符数组（5 个字符 + 结束符），对象里只有**一个指针和一个长度**，字符本体在堆上。", 0.5, 2.8, 3.9, 1.1, { fontSize: 11.5, margin: 0 });
  card(s, 4.65, 1.05, 4.85, 1.6, C.code);
  image(s, "fig-4-4", 4.75, 1.12, 4.65, 1.15);
  text(s, "图 4.4  `String s2 = \"Hello world\"; s1 = s2;`", 4.75, 2.3, 4.65, 0.3, { fontSize: 10, color: C.muted, align: "center", margin: 0 });
  text(s, "新内容比旧的长，装不下：先**另开一块新数组**、把内容复制过去，旧数组（灰格）**释放**，`str` 改指新数组。", 4.65, 2.8, 4.85, 1.1, { fontSize: 11.5, margin: 0 });
  callout(s, "注意那块灰色的旧空间", "**它必须释放，而且必须在新空间准备好之后再释放。**这就是「变长管理」的全部含义。工程版还多两个**移动**操作，见 4.2a。", 0.5, 4.0, 9.0, 1.1, { fontSize: 11.5 });
}

// 教学版代码 3：访问器
{
  const s = content("4.2.2", "4.2 String 类 · 教学版 teaching.hpp（3/5）", "访问器、clear 与 at：越界抛异常");
  codeBlock(s, src(354, 373), 0.5, 1.05, 5.8, 3.4, { fontSize: 9 });
  callout(s, "size() 与 length()", "两个名字同一个值：字符个数，**不含**结尾的 `'\\0'`。", 6.55, 1.05, 2.95, 1.05, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "clear() 也守不变式", "不是把 `data_` 置空，而是换成一块只装 `'\\0'` 的 1 字节缓冲区——`c_str()` 仍然合法。同样**先备新、再释放**。", 6.55, 2.25, 2.95, 1.5, { fontSize: 10.5 });
  callout(s, "at(index)", "越界抛 `std::out_of_range`，**不是返回一个随便什么值**。", 6.55, 3.9, 2.95, 1.2, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  text(s, "按下标取字符是 O(1)：这是顺序存储的长处。", 0.5, 4.6, 5.8, 0.4, { fontSize: 11.5, bold: true, color: C.goldText, margin: 0 });
}

// 4.2.3 append
{
  const s = content("4.2.3", "4.2 字符串运算 · 教学版 teaching.hpp（4/5）", "追加一个字符：为什么是 O(n)");
  codeBlock(s, src(375, 391), 0.5, 1.05, 5.9, 3.0, { fontSize: 8.5 });
  text(s, "append('!') 的三步", 6.65, 1.05, 2.85, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  const rows = [["① 申请", ["", "", "", "", "", "", ""], null], ["② 拷贝", ["H", "e", "l", "l", "o", "!", "\\0"], [null, null, null, null, null, "CDEBD9", C.cream]], ["③ 释放旧块", ["H", "e", "l", "l", "o", "\\0"], ["DDDDDD", "DDDDDD", "DDDDDD", "DDDDDD", "DDDDDD", "DDDDDD"]]];
  rows.forEach((r, i) => {
    const y = 1.45 + i * 0.72;
    text(s, r[0], 6.65, y, 1.0, 0.36, { fontSize: 10, bold: true, color: i === 2 ? C.bad : C.green, valign: "middle", margin: 0 });
    cells(s, 7.6, y, r[1], { cw: 0.27, ch: 0.36, fs: 9, fills: r[2] || r[1].map(() => C.white) });
  });
  callout(s, "变长存储的代价", "长度一变，就得**重新申请、拷过去、还回去**——追加一个字符要拷 n 个字符。这也是后续章节讨论「**预留容量**」的动机。", 6.65, 3.65, 2.85, 1.45, { fontSize: 10 });
  callout(s, "返回 String&", "`s.append('a').append('b')` 可以连着写；从签名一眼看出**改的是本串**。原书【代码4.1】按值返回，`s.append('x');` 到底改不改 `s`，看不出来。", 0.5, 4.2, 5.9, 0.9, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// concatenate
{
  const s = content("4.2.3", "4.2 字符串运算 · 追加与拼接", "concatenate：同样是「重新申请、拷两段、释放旧的」");
  codeBlock(s, src(393, 406), 0.5, 1.05, 5.9, 2.7, { fontSize: 9 });
  text(s, "拷两段", 6.65, 1.05, 2.85, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  cells(s, 6.65, 1.5, ["H", "i", ",", "C", "+", "+", "\\0"], { cw: 0.38, ch: 0.38, fs: 10, fills: [C.mint, C.mint, C.mint, C.cream, C.cream, C.cream, C.cream] });
  text(s, "memcpy(fresh, data_, size_)", 6.65, 1.95, 2.85, 0.25, { fontSize: 8.5, fontFace: MONO, color: C.green, margin: 0 });
  text(s, "memcpy(fresh + size_, s, extra + 1)", 6.65, 2.2, 2.85, 0.25, { fontSize: 8.5, fontFace: MONO, color: C.goldText, margin: 0 });
  text(s, "第二段的 `extra + 1` 把 `s` 结尾的 `'\\0'` 一起带上。", 6.65, 2.55, 2.85, 0.6, { fontSize: 10.5, margin: 0 });
  table(s, [
    ["运算", "做了什么", "代价"],
    [{ t: "append(c)", mono: true }, "申请 size+2，拷 size 个字符", "O(n)"],
    [{ t: "concatenate(s)", mono: true }, "申请 size+extra+1，拷两段", "O(n + |s|)"],
    [{ t: "at(i)", mono: true }, "直接按下标取", "O(1)"],
  ], 0.5, 3.95, 9.0, [2.0, 5.0, 2.0], { fontSize: 11, rowH: 0.29 });
}

// substr
{
  const s = content("4.2.3", "4.2 字符串运算 · 教学版 teaching.hpp（5/5 上）", "抽取子串【算法4.5】：越界就抛");
  codeBlock(s, src(408, 428), 0.5, 1.05, 9.0, 3.35, { fontSize: 8.5 });
  const rules = [["pos > size()", "抛 std::out_of_range", C.bad], ["pos == size()", "合法，得到空串", C.ok], ["len 超出剩余长度", "截断，不报错", C.green]];
  rules.forEach((r, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 4.55, 2.85, 0.55, C.code);
    text(s, r[0], x + 0.1, 4.55, 1.35, 0.55, { fontSize: 9.5, bold: true, fontFace: MONO, color: r[2], valign: "middle", margin: 0 });
    text(s, r[1], x + 1.45, 4.55, 1.35, 0.55, { fontSize: 9.5, valign: "middle", margin: 0 });
  });
}

// substr: 原书 return NULL
{
  const s = content("4.2.3", "4.2 字符串运算 · 抽取子串", "原书在起始位置越界时 return NULL：能编译，崩在运行期");
  consoleBlock(s, src(522, 526), 0.5, 1.05, 9.0, 1.2, 9);
  const chain = [["return NULL;", "返回类型是 String"], ["NULL → char*", "不是「空串」"], ["String(char*)", "走构造函数"], ["strlen(nullptr)", "段错误"]];
  chain.forEach((c, i) => {
    const x = 0.5 + i * 2.3;
    pill(s, c[0], x, 2.5, 1.9, 0.42, i === 3 ? C.bad : C.dark, i === 3 ? C.white : C.gold, 10);
    text(s, c[1], x, 2.98, 1.9, 0.3, { fontSize: 10, color: C.muted, align: "center", margin: 0 });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: x + 1.93, y: 2.71, w: 0.34, h: 0, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
  });
  callout(s, "本书", "越界抛 `std::out_of_range`，让错误**停在发生的地方**，而不是变成调用方某处的段错误。构造函数也对空指针设防：抛 `std::invalid_argument`。", 0.5, 3.5, 4.35, 1.6, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  callout(s, "两条合法边界", [
    "`pos == size()` 合法，得空串——与「从末尾取 0 个字符」的直觉一致。",
    "`len` 超出剩余长度时**截断**，与原书 `if (n > left) n = left;` 语义一致。",
  ], 5.15, 3.5, 4.35, 1.6, { fontSize: 10.5 });
}

// find
{
  const s = content("4.2.3", "4.2 字符串运算 · 查找与比较", "find【算法4.4】：optional 取代 -1");
  codeBlock(s, src(430, 439), 0.5, 1.05, 9.0, 1.7, { fontSize: 9.5 });
  card(s, 0.5, 2.95, 4.35, 2.15, RED);
  text(s, "✗  原书：int，-1 表示没找到", 0.7, 3.05, 4, 0.35, { fontSize: 13, bold: true, color: C.bad, margin: 0 });
  codeBlock(s, "int k = s.find('x', 0);\nprint(s.at(k));   // 忘了判 -1", 0.7, 3.5, 3.95, 0.65, { fontSize: 9.5 });
  text(s, "`-1` 与「位置 0」只差一个符号，漏判就把「没找到」当成「匹配在开头」。", 0.7, 4.25, 3.95, 0.75, { fontSize: 10.5, margin: 0 });
  card(s, 5.15, 2.95, 4.35, 2.15, "EAF4EF");
  text(s, "✓  本书：optional<size_type>", 5.35, 3.05, 4, 0.35, { fontSize: 13, bold: true, color: C.ok, margin: 0 });
  codeBlock(s, "if (const auto found = text.find('C')) {\n    use(*found);      // 有值才解引用\n}", 5.35, 3.5, 3.95, 0.75, { fontSize: 9.5 });
  text(s, "找到是下标，没找到是空盒子。与 2.2.2 节 `getPos` 是**同一个问题、同一个改法**。", 5.35, 4.3, 3.95, 0.7, { fontSize: 10.5, margin: 0 });
}

// compare
{
  const s = content("4.2.3", "4.2 字符串运算 · 教学版 teaching.hpp（5/5 下）", "compare【算法4.3】：只该看符号");
  codeBlock(s, src(441, 457), 0.5, 1.05, 9.0, 2.75, { fontSize: 8.8 });
  callout(s, "原书的 strcmp", "自己实现了一个，固定返回 −1/0/1，并说「这与 C/C++ 通常的大小比较习惯不一致」——其实**不一致的是原书自己**：标准 `strcmp` 返回的就是差值的符号，调用方只该看符号。", 0.5, 3.95, 4.35, 1.15, { fontSize: 10, fill: RED, tcolor: C.bad });
  callout(s, "本书", "保持标准语义，并据此提供关系运算符 `==` `!=` `<`。另：原书那个与标准库同名同签名的 `strcmp`，**实测能编译也能链接**，不构成冲突（legacy.md 第五节）。", 5.15, 3.95, 4.35, 1.15, { fontSize: 10, fill: C.mint, tcolor: C.dark });
}

// 4.2a 工程版：拷贝
{
  const s = content("4.2a", "4.2a 进阶（选读）· modern.hpp", "工程版的拷贝：读 raw()，copy-and-swap");
  codeBlock(s, src(556, 571), 0.5, 1.05, 9.0, 2.6, { fontSize: 9, hl: [7, 12, 13] });
  callout(s, "为什么读 other.raw()", "源可能是**被移动过**的对象（`data_` 为空）；从空指针 `memcpy` 即便长度为 0 也是**未定义行为**。", 0.5, 3.85, 4.35, 1.25, { fontSize: 10.5 });
  callout(s, "拷贝并交换", "先把 `other` 拷成局部对象再 `swap`：**自赋值安全**，拷贝失败时原对象**不受影响**（强异常保证）。", 5.15, 3.85, 4.35, 1.25, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// 4.2a 工程版：移动
{
  const s = content("4.2a", "4.2a 进阶（选读）· modern.hpp", "移动之后的那个空壳怎么办");
  codeBlock(s, src(573, 592), 0.5, 1.05, 6.1, 4.05, { fontSize: 8.5 });
  callout(s, "移动不分配", "移动声明为 `noexcept`，所以**不能在里面分配**——被移动方的 `data_` 只能置 `nullptr`。", 6.85, 1.05, 2.65, 1.45, { fontSize: 10 });
  callout(s, "可承诺不能作废", "教学版承诺「`c_str()` 永远不是空指针」。工程版加私有 `raw()`：`data_` 为空时返回**静态空串**，读取路径全走它——**不花任何分配**。", 6.85, 2.6, 2.65, 1.65, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  text(s, "其余差别同前几章：`[[nodiscard]]`、`noexcept`、copy-and-swap、`< > <= >=` 全由 `compare()` 派生。", 6.85, 4.35, 2.65, 0.8, { fontSize: 9.5, color: C.muted, margin: 0 });
}

// ============================ PART 3 ============================
sectionSlide("Part 3 · 4.3", "字符串的模式匹配", "朴素匹配与原书「差 1」 · 目标的回溯\n特征向量 next · KMP 与线性论证\nKMP 的另一个用途：最小循环节");

// 4.3 问题
{
  const s = content("4.3", "4.3 模式匹配", "在很大的文本里找一个短小的模式");
  text(s, "**模式匹配**（pattern matching）：在**文本**（text）中寻找给定的**模式**（pattern）。通常文本很大，模式短小。", 0.5, 1.05, 9, 0.5, { fontSize: 13 });
  const apps = [
    ["文本编辑", "「替换」前先要找到被替换的内容", "≈ 一个单词，10 个字符左右", "几百字到上百万字"],
    ["DNA 分析", "信息由 A、C、G、T 四个符号组成", "基因一般几百个字符", "人类染色体长度 30 亿之多"],
  ];
  apps.forEach((a, i) => {
    const x = 0.5 + i * 4.65;
    card(s, x, 1.7, 4.35, 2.15, C.code);
    text(s, a[0], x + 0.2, 1.8, 3.9, 0.4, { fontSize: 16, bold: true, color: C.dark, margin: 0 });
    text(s, a[1], x + 0.2, 2.25, 3.95, 0.35, { fontSize: 11.5, margin: 0 });
    pill(s, "模式  " + a[2], x + 0.2, 2.75, 3.95, 0.38, C.green, C.white, 10.5);
    pill(s, "文本  " + a[3], x + 0.2, 3.25, 3.95, 0.38, i ? C.bad : C.goldText, C.white, 10.5);
  });
  card(s, 0.5, 4.05, 9.0, 1.05, C.dark);
  s.addText(runs("这些应用对匹配算法的**效率要求很高**：在 30 亿个字符里，O(|T|·|P|) 和 O(|T|+|P|) 是两个世界。", { color: C.white, boldColor: C.gold }),
    { x: 0.75, y: 4.05, w: 8.6, h: 1.05, fontFace: FONT, fontSize: 14, margin: 0, isTextBox: true, valign: "middle" });
}

// 精确/近似 + 记号
{
  const s = content("4.3", "4.3 模式匹配", "精确匹配 vs 近似匹配；本节的记号");
  card(s, 0.5, 1.05, 4.35, 1.95, C.code);
  text(s, "精确匹配 exact matching", 0.7, 1.12, 4, 0.32, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "T 中至少一处存在 P 才算成功，差一个字符也算失败。可以是单选（`\"set\"`），也可以多选：`\"s?t\"` 可匹配 `sat`、`set`、`sit`，`?` 叫**通配符**；更复杂的用正则表达式。", 0.7, 1.48, 4.0, 1.45, { fontSize: 10.5, margin: 0 });
  card(s, 5.15, 1.05, 4.35, 1.95, C.code);
  text(s, "近似匹配 approximate matching", 5.35, 1.12, 4, 0.32, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
  text(s, "P 与 T（或其子串）存在某种程度的相似即成功。常用相似度：一个串转换成另一个串所需的**插入、删除、替换**的操作数。", 5.35, 1.48, 4.0, 1.45, { fontSize: 10.5, margin: 0 });
  text(s, "本节与原书一样，只讨论**精确匹配中的单选情况**。给定 T、P，在 T 中找一个 j 使得：", 0.5, 3.15, 9, 0.35, { fontSize: 12.5, margin: 0 });
  card(s, 0.5, 3.55, 9.0, 0.55, C.cream);
  text(s, "P₀ P₁ P₂ ⋯ Pₘ₋₂ Pₘ₋₁  =  Tⱼ Tⱼ₊₁ Tⱼ₊₂ ⋯ Tⱼ₊ₘ₋₂ Tⱼ₊ₘ₋₁", 0.5, 3.55, 9.0, 0.55, { fontSize: 15, bold: true, align: "center", valign: "middle", margin: 0 });
  card(s, 0.5, 4.25, 9.0, 0.85, C.dark);
  s.addText(runs("记住：**P 和 T 的第一个字符都从位置 0 开始**——4.3.1 节会看到，原书自己的两个算法都没有遵守它。实现用 `std::string_view` 接收输入：不拷贝、不拥有。", { color: C.white, boldColor: C.gold, codeColor: C.mint }),
    { x: 0.7, y: 4.25, w: 8.6, h: 0.85, fontFace: FONT, fontSize: 11.5, margin: 0, isTextBox: true, valign: "middle" });
}

// 4.3.1 朴素算法 C++
{
  const s = content("4.3.1", "4.3.1 朴素的模式匹配 · modern.hpp（上）", "naive_search：接口与约定");
  codeBlock(s, src(676, 694), 0.5, 1.05, 9.0, 2.95, { fontSize: 8.8 });
  callout(s, "返回值", "返回**起始下标**；没有则 `std::nullopt`。`optional` 取代原书的 `int` + `-1`。", 0.5, 4.15, 2.85, 0.95, { fontSize: 9.5, fill: C.mint, tcolor: C.dark, tsize: 11 });
  callout(s, "空模式返回 0", "与 `std::string::find(\"\")` 一致；原书 `assert(m>0)` 在 `NDEBUG` 下整个消失。", 3.55, 4.15, 2.9, 0.95, { fontSize: 9.5, tsize: 11 });
  callout(s, "原书差 1", "原书 `return (j - pLen + 1);`，0 起始下标下正确的是 `j - pLen`。", 6.65, 4.15, 2.85, 0.95, { fontSize: 9.5, fill: RED, tcolor: C.bad, tsize: 11 });
}

// 朴素算法 C++ 下
{
  const s = content("4.3.1", "4.3.1 朴素的模式匹配 · modern.hpp（下）", "朴素匹配：失配就右移一位，从头再比");
  codeBlock(s, src(695, 707, { pre: "    // ..." }), 0.5, 1.05, 5.9, 2.75, { fontSize: 9.5, hl: [9, 13] });
  callout(s, "思路", "模式首字符对齐目标的每一个位置，逐字符比较；**失配**时模式对 T 右移一个字符，重新开始下一趟。直到某趟配串成功，或比到目标结束也没配上。", 6.65, 1.05, 2.85, 1.55, { fontSize: 10 });
  callout(s, "j = j - i + 1", "把目标下标退回**本趟起点的下一个**位置——这个 +1 是对的：「换一个起点重来」。", 6.65, 2.72, 2.85, 1.15, { fontSize: 10, fill: C.mint, tcolor: C.dark });
  callout(s, "返回 j - m", "成功时 j 已走到匹配段**末尾之后**，所以起始位置是 `j - m`。", 6.65, 4.0, 2.85, 1.1, { fontSize: 10, fill: RED, tcolor: C.bad });
  text(s, "两个下标", 0.5, 3.92, 3, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["变量", "含义", "相等", "失配"],
    [{ t: "i", mono: true }, "模式下标", { t: "++i", mono: true }, { t: "i = 0", mono: true, color: C.bad }],
    [{ t: "j", mono: true }, "目标下标", { t: "++j", mono: true }, { t: "j = j - i + 1（回溯）", mono: true, color: C.bad }],
  ], 0.5, 4.25, 5.9, [0.7, 1.2, 1.0, 3.0], { fontSize: 10.5, rowH: 0.28 });
}

// 朴素 Python + 空模式约定
{
  const s = content("4.3.1", "4.3.1 朴素的模式匹配 · modern.py", "Python 版：同一个回溯过程");
  codeBlock(s, src(711, 724), 0.5, 1.05, 5.6, 2.8, { fontSize: 10, lang: "py", hl: [12] });
  callout(s, "与 C++ 逐行对应", "空模式返回 0、两个下标、失配时 `j = j - i + 1`、成功返回 `j - len(pattern)`，全都一样；找不到返回 `None`。", 6.35, 1.05, 3.15, 1.6, { fontSize: 10.5 });
  callout(s, "n < m 不必单独判", "C++ 版先判 `n < m` 返回 `nullopt`；Python 版由循环条件自然结束，返回 `None`。", 6.35, 2.8, 3.15, 1.05, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  text(s, "手算一例：T = abababd，P = ababd", 0.5, 4.0, 9, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
  table(s, [
    ["趟", "起点", "比较过程", "比较次数"],
    ["1", "0", "T[0..3] = abab 相等，T[4]='a' ≠ P[4]='d'；j 从 4 退回 1", "5"],
    ["2", "1", "T[1]='b' ≠ P[0]='a'；j 退到 2", "1"],
    ["3", "2", { t: "T[2..6] = ababd 全部相等 → 返回 7 − 5 = 2", color: C.ok, bold: true }, "5"],
  ], 0.5, 4.3, 9.0, [0.5, 0.6, 6.6, 1.3], { fontSize: 9.5, rowH: 0.2, tight: true });
}

// 图 4.6 朴素示例
{
  const s = content("4.3.1", "4.3.1 朴素的模式匹配", "图 4.6：T = abacaabaccabacabaa，P = abacab");
  card(s, 0.5, 1.05, 5.3, 4.05, C.code);
  image(s, "fig-4-6", 0.6, 1.12, 5.1, 3.9);
  bullets(s, [
    "第 1 趟在目标的 `a` 与模式的 `b` 处失配（T₅ ≠ P₅），模式右移一位重来。",
    "加粗带下划线的是当前**失配**的那一对字符。",
    "如此直到**第 11 趟**在子串处配上，返回首位置 **10**。",
  ], 6.05, 1.05, 3.45, 2.4, { fontSize: 11.5, gap: 8 });
  callout(s, "数一数", "目标里有多少字符被**反复比较**过？这些重复比较正是 KMP 要省掉的东西。按本章 `naive_search` 计，这一例共比较 **28** 次。", 6.05, 3.5, 3.45, 1.6, { fontSize: 10.5 });
}

// 三种极端情况
{
  const s = content("4.3.1", "4.3.1 朴素的模式匹配 · 时间效率", "三种极端情况：图 4.7 / 4.8 / 4.9");
  const rows = [
    ["最好", "fig-4-7", "目标开头那一段就是配串，比 |P| 次", "O(|P|)", C.ok, 0.4],
    ["失败中的最好", "fig-4-8", "每趟在模式首字符就不等，共约 |T|−|P|+1 次", "O(|T|−|P|+1)", C.green, 0.98],
    ["最坏", "fig-4-9", "T 形如 aⁿ、P 形如 aᵐ⁻¹b，每趟比到最后一个字符才失配：|P|(|T|−|P|+1) 次", "O(|T|·|P|)", C.bad, 0.98],
  ];
  let y = 1.05;
  rows.forEach((r) => {
    const h = r[5] + 0.15;
    card(s, 0.5, y, 9.0, h, C.code);
    pill(s, r[0], 0.65, y + h / 2 - 0.18, 1.35, 0.36, r[4], C.white, 10.5);
    image(s, r[1], 2.1, y + 0.07, 3.1, r[5]);
    text(s, r[2], 5.35, y + 0.05, 2.6, h - 0.1, { fontSize: 10, valign: "middle", margin: 0 });
    text(s, r[3], 7.95, y, 1.5, h, { fontSize: 12, bold: true, color: r[4], fontFace: MONO, valign: "middle", align: "center", margin: 0 });
    y += h + 0.12;
  });
  callout(s, "最坏情况出现在哪", "此类输入**很少出现在自然语言文本中，却经常出现在 DNA 信息和图像信息中**——这正是需要 KMP 的实际理由。", 0.5, y + 0.02, 9.0, 5.1 - y - 0.02, { fontSize: 10.5, fill: RED, tcolor: C.bad });
}

// 平均情况
{
  const s = content("4.3.1", "4.3.1 朴素的模式匹配 · 时间效率", "平均情况：依赖字符的分布概率");
  text(s, "假设串中只允许 **2 种字符**，每种概率 1/2。对第 j 趟扫描：", 0.5, 1.05, 9, 0.35, { fontSize: 13 });
  table(s, [
    ["本趟比较次数", "1", "2", "3", "⋯", "m"],
    [{ t: "概率", bold: true }, "1/2", "1/4", "1/8", "⋯", "2⁻ᵐ"],
  ], 0.5, 1.5, 6.0, [1.6, 0.88, 0.88, 0.88, 0.88, 0.88], { fontSize: 12, rowH: 0.4, align: "center" });
  card(s, 0.5, 2.5, 6.0, 1.2, C.cream);
  text(s, "每趟平均比较次数  Σₖ₌₁^|P| k / 2ᵏ  <  2", 0.7, 2.58, 5.6, 0.45, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  text(s, "总平均比较次数  2(|T| − |P| + 1)  <  2|T|", 0.7, 3.1, 5.6, 0.45, { fontSize: 15, bold: true, color: C.dark, margin: 0 });
  callout(s, "更精细的估计", [
    "用马尔科夫链理论可估算更好的比较次数 **2^(|P|+1) − 2**。",
    "字符集大小为 |A| 时，平均比较次数为 **(|A|^(|P|+1) − |A|) / (|A| − 1)**。",
  ], 0.5, 3.9, 6.0, 1.2, { fontSize: 11, fill: C.mint, tcolor: C.dark });
  card(s, 6.75, 1.5, 2.75, 3.6, C.dark);
  text(s, "所以", 6.95, 1.62, 2, 0.3, { fontSize: 11, bold: true, color: C.gold, margin: 0 });
  text(s, "平均情况下朴素算法其实不慢；\n\n真正的问题是**最坏情况**——而最坏情况在 DNA、图像里并不罕见。", 6.95, 2.0, 2.4, 2.9, { fontSize: 13, color: C.white, margin: 0, lsm: 1.2 });
}

// 原书差 1
{
  const s = content("4.3.1", "4.3.1 一处必须指出的错误", "原书【算法4.6】【算法4.8】的返回值差 1");
  codeBlock(s, "if (i >= pLen) return (j - pLen + 1);     // 原书，两个算法都这样写", 0.5, 1.05, 9.0, 0.45, { fontSize: 10.5 });
  text(s, "把原书两段代码照抄进程序，拿标准库 `find` 做参照：", 0.5, 1.6, 9, 0.3, { fontSize: 12, margin: 0 });
  table(s, [
    ["T", "P", "原书朴素", "正确答案"],
    [{ t: "abc", mono: true }, { t: "abc", mono: true }, { t: "1", color: C.bad, bold: true }, "0"],
    [{ t: "xabc", mono: true }, { t: "abc", mono: true }, { t: "2", color: C.bad, bold: true }, "1"],
    [{ t: "aaab", mono: true }, { t: "ab", mono: true }, { t: "3", color: C.bad, bold: true }, "2"],
    [{ t: "abcddabcababcdaabcababcdaabcabaa", mono: true }, { t: "abcdaabcab", mono: true }, { t: "11", color: C.bad, bold: true }, "10"],
  ], 0.5, 1.95, 6.0, [3.1, 1.2, 0.85, 0.85], { fontSize: 10, rowH: 0.3 });
  text(s, "**每一组都恰好多 1**；最后一组正是书中图 4.12 自己演示 KMP 的那对串——原书逐趟画了过程，却没给返回值，错误因此没有暴露。", 0.5, 3.6, 6.0, 0.65, { fontSize: 10.5, margin: 0 });
  callout(s, "不是排版 / OCR 错误：三重佐证", [
    "`j - pLen + 1` 在两个算法里**独立印出**、写法一致。",
    "同一段代码里的 `j = j - i + 1` 说明作者用的就是 **0 起始**下标。",
    "4.3 节开头写死了：「P 和 T 的第一个字符都从位置 0 开始」。",
  ], 6.75, 1.6, 2.75, 3.5, { fontSize: 10 });
  callout(s, "测试要有牙", "每条匹配用例都拿 `find` **逐个对拍**，再加 3000 组随机对拍。只断言「找到了」的测试，在原书实现下同样全绿。", 0.5, 4.3, 6.0, 0.8, { fontSize: 9.5, tsize: 10, fill: C.mint, tcolor: C.dark });
}

// 问题出在哪里：目标的回溯
{
  const s = content("4.3.1", "4.3.1 朴素的模式匹配", "问题出在哪里：目标的回溯");
  text(s, "一旦失配，**无论模式的具体情况如何**，都只右移一位——目标 T 中的字符被多次比较，造成**目标的回溯**。", 0.5, 1.05, 9, 0.5, { fontSize: 12.5 });
  card(s, 0.5, 1.65, 5.6, 2.35, C.code);
  text(s, "T", 0.65, 1.95, 0.3, 0.38, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 0.95, 1.95, ["a", "b", "a", "c", "a", "a", "b", "a", "c", "c"], { cw: 0.42, ch: 0.38, fs: 11, idx: true, fills: [null, "CDEBD9", null, null, null, "F9D5D0"] });
  text(s, "第1趟", 0.55, 2.62, 0.5, 0.38, { fontSize: 8, color: C.muted, valign: "middle", margin: 0 });
  cells(s, 0.95, 2.62, ["a", "b", "a", "c", "a", "b"], { cw: 0.42, ch: 0.38, fs: 11, fills: [C.white, "CDEBD9", C.white, C.white, C.white, "F9D5D0"] });
  text(s, "第2趟", 0.55, 3.15, 0.5, 0.38, { fontSize: 8, color: C.muted, valign: "middle", margin: 0 });
  cells(s, 1.37, 3.15, ["a", "b", "a", "c", "a", "b"], { cw: 0.42, ch: 0.38, fs: 11, fills: ["FFE8A8", C.white, C.white, C.white, C.white, C.white] });
  text(s, "P₅ ≠ T₅", 3.55, 2.65, 1.2, 0.3, { fontSize: 10, bold: true, color: C.bad, margin: 0 });
  text(s, "P₀ 对 T₁：多余", 4.0, 3.2, 2.0, 0.3, { fontSize: 10, bold: true, color: C.goldText, margin: 0 });
  callout(s, "为什么用不着比 P₀ 与 T₁", [
    "上一趟 T₁ 已与 P₁ 比较过，**相等**。",
    "模式自身：P₁ ≠ P₀。",
    "两条一合：**P₀ ≠ T₁ 是推得出来的**。",
  ], 6.35, 1.65, 3.15, 2.35, { fontSize: 11 });
  card(s, 0.5, 4.15, 9.0, 0.95, C.dark);
  s.addText(runs("Knuth、Morris、Pratt 发现：每次右移的位数**存在**，且**与目标串无关，仅依赖于模式本身**——可以预先算好（特征向量），改进后就是 **KMP**。", { color: C.white, boldColor: C.gold }),
    { x: 0.7, y: 4.15, w: 8.6, h: 0.95, fontFace: FONT, fontSize: 12.5, margin: 0, isTextBox: true, valign: "middle" });
}

// 4.3.2 特征向量：例子
{
  const s = content("4.3.2", "4.3.2 字符串的特征向量", "已经匹配上的那一段，本身携带了信息");
  text(s, "T = `abababd`，P = `ababd`，从 T 的位置 0 开始比：", 0.5, 1.02, 9, 0.35, { fontSize: 12.5, margin: 0 });
  const T = ["a", "b", "a", "b", "a", "b", "d"];
  const cw = 0.46;
  // 失配
  card(s, 0.5, 1.45, 4.35, 2.2, RED);
  text(s, "T", 0.65, 1.8, 0.3, 0.4, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 0.95, 1.8, T, { cw, ch: 0.4, fs: 12, idx: true, fills: ["CDEBD9", "CDEBD9", "CDEBD9", "CDEBD9", "F9D5D0"] });
  text(s, "P", 0.65, 2.5, 0.3, 0.4, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 0.95, 2.5, ["a", "b", "a", "b", "d"], { cw, ch: 0.4, fs: 12, fills: ["CDEBD9", "CDEBD9", "CDEBD9", "CDEBD9", "F9D5D0"] });
  text(s, "T[4]='a'，P[4]='d' 失配；已匹配 abab。朴素算法：右移 1 位，从 T[1] 重比。", 0.65, 3.05, 4.1, 0.55, { fontSize: 10.5, margin: 0 });
  // 右移 2
  card(s, 5.15, 1.45, 4.35, 2.2, "EAF4EF");
  text(s, "T", 5.3, 1.8, 0.3, 0.4, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 5.6, 1.8, T, { cw, ch: 0.4, fs: 12, idx: true });
  text(s, "P", 5.3, 2.5, 0.3, 0.4, { fontSize: 12, bold: true, color: C.dark, valign: "middle", margin: 0 });
  cells(s, 5.6 + 2 * cw, 2.5, ["a", "b", "a", "b", "d"], { cw, ch: 0.4, fs: 12, fills: ["DDDDDD", "DDDDDD", "CDEBD9", "CDEBD9", "CDEBD9"] });
  text(s, "KMP：一次右移 4 − 2 = 2 位，前两个字符已知相同（灰），从 P[2] 对 T[4] 继续，在位置 2 匹配成功。", 5.3, 3.05, 4.1, 0.55, { fontSize: 10.5, margin: 0 });
  // 前后缀
  card(s, 0.5, 3.8, 5.6, 1.3, C.code);
  text(s, "abab 的前缀：a, ab, aba\nabab 的后缀：b, ab, bab\n最长相同的一段：\"ab\"，长度 2", 0.7, 3.88, 5.3, 1.15, { fontSize: 12, fontFace: MONO, margin: 0, lsm: 1.2 });
  callout(s, "关键", "整个过程中 **T 的下标从来没有往回退过**。", 6.35, 3.8, 3.15, 1.3, { fontSize: 12, fill: C.cream });
}

// next 数组的含义
{
  const s = content("4.3.2", "4.3.2 字符串的特征向量", "特征向量（next 数组）：失配时该退到哪里");
  text(s, "把「每个位置失配时该退到哪里」对模式的**每个位置**预先算出来，就是特征向量。上例用本章实现跑出来：", 0.5, 1.05, 9, 0.5, { fontSize: 12.5 });
  consoleBlock(s, "next(ababd) = -1 0 -1 0 2\nkmp_search(\"abababd\", \"ababd\") = 2\nstd::string::find 对照         = 2", 0.5, 1.65, 5.0, 1.15, 10);
  table(s, [
    ["i", "0", "1", "2", "3", "4"],
    [{ t: "P[i]", bold: true }, "a", "b", "a", "b", "d"],
    [{ t: "next[i]", bold: true }, "−1", "0", "−1", "0", { t: "2", bold: true, color: C.bad, fill: C.cream }],
  ], 5.75, 1.65, 3.75, [1.0, 0.55, 0.55, 0.55, 0.55, 0.55], { fontSize: 12, rowH: 0.38, align: "center" });
  bullets(s, [
    "`next[4] = 2`：在 P[4] 处失配时，模式的比较位置**退到 2**——与手推一致。",
    "`next[i] = −1`：连 P[0] 都不必再比，**模式整体越过**当前目标字符（i 变 −1，下一步 i、j 同时加 1）。",
    "next **只依赖模式**：同一个模式算一次，可在任意多个目标上复用。",
  ], 0.5, 3.0, 5.6, 2.1, { fontSize: 11.5, gap: 8 });
  callout(s, "这里印的是「优化版」", "原书【算法4.7】的**优化版** next，所以中间会出现 −1。未优化版本取值不同，但失配后的落点等价。", 6.35, 3.0, 3.15, 2.1, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// build_next C++ 上
{
  const s = content("4.3.2", "4.3.2 特征向量 · modern.hpp（上）", "build_next：原书【算法4.7】优化版，只改了所有权");
  codeBlock(s, src(840, 856), 0.5, 1.05, 9.0, 2.75, { fontSize: 9 });
  callout(s, "原书：int* findNext(String P)", "用 `new int[m]` 返回裸数组，书中调用它的地方**一次都没有**配对的 `delete[]`——每匹配一个模式就漏一个数组。", 0.5, 3.95, 4.35, 1.15, { fontSize: 10.5, fill: RED, tcolor: C.bad });
  callout(s, "本书：std::vector<next_type>", "返回拥有所有权的容器，**计算过程一字未改**。空模式返回空向量（原书 `assert(m > 0)` 在 release 里是一次越界写）。", 5.15, 3.95, 4.35, 1.15, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// build_next C++ 下
{
  const s = content("4.3.2", "4.3.2 特征向量 · modern.hpp（下）", "用模式串跟自己匹配：沿已算好的特征值回退");
  codeBlock(s, src(857, 872, { pre: "    // ..." }), 0.5, 1.05, 9.0, 3.0, { fontSize: 9, hl: [3, 4, 14] });
  callout(s, "内层 while", "P[i] ≠ P[k] 时 `k = next[k]`：沿**已算好**的特征值回退，直到能延长或 k 退到 −1。", 0.5, 4.2, 4.35, 0.9, { fontSize: 10.5 });
  callout(s, "最后那个三目表达式 = 优化", "若 P[i] == P[k]，退到 k 必然**在同一个字符上再失配一次**，不如直接借用 `next[k]` 一步到位。", 5.15, 4.2, 4.35, 0.9, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// build_next 逐步 trace
{
  const s = content("4.3.2", "4.3.2 特征向量 · 逐步计算", "手算 build_next(\"abcdaabcab\")");
  const rows = [
    ["i", "进入时 k", "回退：比 P[i] 与 P[k]", "++ 后 i, k", "P[i+1] vs P[k]", "写 next[i+1]"],
    ["0", "−1", "k = −1 不比", "1, 0", "b ≠ a", { t: "0", bold: true }],
    ["1", "0", "b≠a → k=next[0]=−1", "2, 0", "c ≠ a", { t: "0", bold: true }],
    ["2", "0", "c≠a → k=−1", "3, 0", "d ≠ a", { t: "0", bold: true }],
    ["3", "0", "d≠a → k=−1", "4, 0", { t: "a = a", color: C.bad }, { t: "next[0] = −1", bold: true, color: C.bad }],
    ["4", "0", "a=a，不退", "5, 1", "a ≠ b", { t: "1", bold: true }],
    ["5", "1", "a≠b → k=next[1]=0；a=a 停", "6, 1", { t: "b = b", color: C.bad }, { t: "next[1] = 0", bold: true, color: C.bad }],
    ["6", "1", "b=b，不退", "7, 2", { t: "c = c", color: C.bad }, { t: "next[2] = 0", bold: true, color: C.bad }],
    ["7", "2", "c=c，不退", "8, 3", "a ≠ d", { t: "3", bold: true }],
    ["8", "3", "a≠d → k=next[3]=0；a=a 停", "9, 1", { t: "b = b", color: C.bad }, { t: "next[1] = 0", bold: true, color: C.bad }],
    ["9", "1", "b=b，不退", "10, 2", "i == m", "break"],
  ];
  table(s, rows, 0.5, 1.0, 6.5, [0.35, 0.75, 2.2, 0.85, 1.0, 1.35], { fontSize: 9, rowH: 0.3, tight: true });
  text(s, "「i」列是本轮开始时的 i；自增后 i 变成 i+1，写的是 next[i+1]。next[0] = −1 在循环前赋好。", 0.5, 4.45, 6.5, 0.6, { fontSize: 9.5, color: C.muted, margin: 0 });
  callout(s, "红色行 = 优化生效", "P[i] 与 P[k] 相等时借用 `next[k]`，而不是写 k。\n\n结果：", 7.2, 1.0, 2.3, 4.1, { fontSize: 10.5, fill: C.cream });
  text(s, "-1 0 0 0 -1\n 1 0 0 3  0", 7.35, 2.4, 2.1, 0.6, { fontSize: 12, bold: true, fontFace: MONO, color: C.dark, margin: 0 });
}

// next 表 + 原书矛盾
{
  const s = content("4.3.2", "4.3.2 字符串的特征向量", "P = \"abcdaabcab\" 的特征向量，与图 4.11 一致");
  table(s, [
    ["i", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    [{ t: "P[i]", bold: true }, "a", "b", "c", "d", "a", "a", "b", "c", "a", "b"],
    [{ t: "next[i]", bold: true }, "−1", "0", "0", "0", "−1", "1", "0", "0", "3", "0"],
  ], 0.5, 1.1, 9.0, [1.3, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77], { fontSize: 12, rowH: 0.36, align: "center" });
  text(s, "Python 版（modern.py）", 0.5, 2.33, 4, 0.28, { fontSize: 11, bold: true, color: C.dark, margin: 0 });
  codeBlock(s, src(876, 891), 0.5, 2.62, 5.9, 2.48, { fontSize: 8, lang: "py", hl: [15] });
  callout(s, "原书正文与图 4.11 不一致", "正文写 `next = {-1,0,0,0,0,-1,1,0,0,3,0}`——**11 个值**，而模式只有 **10 个字符**。图 4.11 的 10 个值与实算相符，正文多出的那个 0 是错的。本书测试逐个比对十个值，并单独断言「模式只有 10 个字符」。", 6.6, 2.33, 2.9, 2.77, { fontSize: 9.5, fill: RED, tcolor: C.bad, tsize: 11 });
}

// 4.3.3 KMP C++ 上
{
  const s = content("4.3.3", "4.3.3 KMP 模式匹配 · modern.hpp（上）", "接口：next 由调用方传入");
  codeBlock(s, src(922, 940), 0.5, 1.05, 9.0, 3.0, { fontSize: 9 });
  callout(s, "为什么 next 作参数", "同一个模式只算一次、**跨多个目标复用**——这正是原书强调的性质，接口把它显式表达出来。", 0.5, 4.2, 4.35, 0.9, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "防御", "`next.size() != m` 抛 `std::invalid_argument`；返回值同样修正了原书【算法4.8】的差一错误。", 5.15, 4.2, 4.35, 0.9, { fontSize: 10.5 });
}

// KMP C++ 下
{
  const s = content("4.3.3", "4.3.3 KMP 模式匹配 · modern.hpp（下）", "与朴素算法只差失配那一步");
  codeBlock(s, src(941, 958, { pre: "    // ..." }), 0.5, 1.05, 9.0, 3.0, { fontSize: 9, hl: [2, 3, 9] });
  table(s, [
    ["", "朴素匹配失配时", "KMP 失配时"],
    [{ t: "模式下标 i", bold: true }, { t: "i = 0", mono: true }, { t: "i = next[i]（可退到 −1）", mono: true, color: C.ok }],
    [{ t: "目标下标 j", bold: true }, { t: "j = j - i + 1（回溯）", mono: true, color: C.bad }, { t: "不动——只增不减", color: C.ok, bold: true }],
  ], 0.5, 4.2, 9.0, [1.8, 3.4, 3.8], { fontSize: 10.5, rowH: 0.29 });
}

// KMP Python
{
  const s = content("4.3.3", "4.3.3 KMP 模式匹配 · modern.py", "Python 版：目标串下标只向前移动");
  codeBlock(s, src(962, 978), 0.5, 1.05, 9.0, 3.05, { fontSize: 9, lang: "py", hl: [12, 16] });
  callout(s, "i == -1 分支", "`next[i] = −1` 表示 P[0] 也不必比：下一步 i、j **同时 +1**——模式整体越过 T[j]。", 0.5, 4.25, 4.35, 0.85, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
  callout(s, "对照朴素版", "循环条件、相等分支、返回值与 `naive_search` 完全一样，**只有 else 分支不同**。", 5.15, 4.25, 4.35, 0.85, { fontSize: 10.5 });
}

// KMP trace abababd
{
  const s = content("4.3.3", "4.3.3 KMP 模式匹配 · 逐步追踪", "kmp_search(\"abababd\", \"ababd\")，next = −1 0 −1 0 2");
  const rows = [
    ["#", "i", "j", "T[j]", "P[i]", "结果", "动作"],
    ["1", "0", "0", "a", "a", "=", "i=1, j=1"],
    ["2", "1", "1", "b", "b", "=", "i=2, j=2"],
    ["3", "2", "2", "a", "a", "=", "i=3, j=3"],
    ["4", "3", "3", "b", "b", "=", "i=4, j=4"],
    [{ t: "5", fill: RED }, { t: "4", fill: RED }, { t: "4", fill: RED }, { t: "a", fill: RED }, { t: "d", fill: RED }, { t: "≠", bold: true, color: C.bad, fill: RED }, { t: "i = next[4] = 2，j 不动", bold: true, color: C.bad, fill: RED }],
    ["6", "2", "4", "a", "a", "=", "i=3, j=5"],
    ["7", "3", "5", "b", "b", "=", "i=4, j=6"],
    ["8", "4", "6", "d", "d", "=", "i=5, j=7"],
    ["", "", "", "", "", "", { t: "i = 5 = m，返回 j − m = 2", bold: true, color: C.ok }],
  ];
  table(s, rows, 0.5, 1.05, 6.2, [0.4, 0.45, 0.45, 0.65, 0.65, 0.65, 2.95], { fontSize: 10, rowH: 0.36, align: "center" });
  card(s, 6.95, 1.05, 2.55, 1.9, "EAF4EF");
  text(s, "KMP", 7.1, 1.12, 2.3, 0.3, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
  text(s, "8", 7.1, 1.4, 2.3, 0.7, { fontSize: 36, bold: true, color: C.ok, margin: 0 });
  text(s, "次比较；j 序列 0,1,2,3,4,4,5,6——从不减小。", 7.1, 2.12, 2.3, 0.75, { fontSize: 10, margin: 0 });
  card(s, 6.95, 3.1, 2.55, 2.0, RED);
  text(s, "朴素", 7.1, 3.17, 2.3, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  text(s, "11", 7.1, 3.45, 2.3, 0.7, { fontSize: 36, bold: true, color: C.bad, margin: 0 });
  text(s, "次比较：第 5 次失配后 j 从 4 退回 1，再在 T[1] 失配一次。", 7.1, 4.17, 2.3, 0.85, { fontSize: 10, margin: 0 });
}

// 线性论证
{
  const s = content("4.3.3", "4.3.3 KMP 模式匹配 · 时间代价", "为什么 KMP 是线性的");
  const steps = [
    ["j 只增不减", "`++j` 至多执行 |T| 次；与它同处一条语句的 `++i` 也不超过 |T| 次。"],
    ["能让 i 减少的只有 i = next[i]", "而 `next[i] < i`，所以每执行一次 i **至少减 1**。"],
    ["减到 −1 之后", "下一步必然进入 `++i, ++j` 分支。"],
    ["合起来", "`i = next[i]` 的执行次数 ≤ `++i, ++j` 的次数 + 1 → 循环体至多执行 **2|T| + 1** 次。"],
  ];
  steps.forEach((st, i) => {
    const y = 1.05 + i * 0.74;
    numCircle(s, i + 1, 0.5, y + 0.12, 0.45, i === 3 ? C.gold : C.green);
    text(s, st[0], 1.1, y, 3.0, 0.7, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, st[1], 4.1, y, 5.4, 0.7, { fontSize: 11.5, valign: "middle", margin: 0 });
  });
  card(s, 0.5, 4.1, 4.35, 1.0, C.dark);
  s.addText(runs("KMP 整体 **O(|P| + |T|)**\n算 next O(|P|) + 匹配 O(|T|)", { color: C.white, boldColor: C.gold }),
    { x: 0.7, y: 4.1, w: 4.0, h: 1.0, fontFace: FONT, fontSize: 13, margin: 0, isTextBox: true, valign: "middle" });
  callout(s, "一条能检出退化的测试", "T = 20 万个 'a'，P = 1999 个 'a' + 'b'：KMP 瞬间完成；不按特征值回退的实现退化成 O(|T|·|P|)，**直接撞上闸门超时**。", 5.15, 4.1, 4.35, 1.0, { fontSize: 9.5, fill: C.mint, tcolor: C.dark, tsize: 11 });
}

// 图 4.12
{
  const s = content("4.3.3", "4.3.3 KMP 模式匹配", "图 4.12：P = abcdaabcab 在 T 中的完整过程");
  card(s, 0.5, 1.05, 9.0, 2.45, C.code);
  image(s, "fig-4-12", 0.6, 1.12, 8.8, 2.3);
  table(s, [
    ["趟", "失配", "特征值", "右移"],
    ["1", "第 5 次比较，P₄ ≠ T₄", "next[4] = −1", "4 − (−1) = 5 位"],
    ["2", "第 9 次比较，P₃ ≠ T₈", "next[3] = 0", "3 − 0 = 3 位"],
    ["3", "第 12 次比较，P₂ ≠ T₁₀", "next[2] = 0", "2 − 0 = 2 位"],
    ["4", { t: "第 22 次比较匹配成功", bold: true, color: C.ok }, "—", { t: "返回 10", bold: true, color: C.ok }],
  ], 0.5, 3.65, 6.0, [0.45, 2.45, 1.4, 1.7], { fontSize: 10, rowH: 0.29 });
  callout(s, "目标下标一次都没回退", "对照图 4.6 被反复比较的字符，省下的就是这些。同一对串，本章 `naive_search` 要比较 **29** 次。", 6.75, 3.65, 2.75, 1.45, { fontSize: 10 });
}

// 朴素 vs KMP
{
  const s = content("4.3.3", "4.3.3 KMP 模式匹配", "朴素与 KMP：代价对照");
  table(s, [
    ["", "朴素匹配", "KMP"],
    [{ t: "预处理", bold: true }, "无", "O(|P|) 建 next"],
    [{ t: "最好", bold: true }, "O(|P|)", "O(|P|)（含建 next）"],
    [{ t: "最坏", bold: true }, { t: "O(|T|·|P|)", color: C.bad, bold: true }, { t: "O(|T| + |P|)", color: C.ok, bold: true }],
    [{ t: "目标下标", bold: true }, "会回溯", { t: "只增不减", bold: true }],
    [{ t: "额外空间", bold: true }, "无", "O(|P|) 的 next 表"],
    [{ t: "next 复用", bold: true }, "—", "同一模式跨多个目标只算一次"],
  ], 0.5, 1.1, 5.8, [1.4, 2.0, 2.4], { fontSize: 12, rowH: 0.45 });
  callout(s, "「刻意没改」的三条", [
    "朴素匹配仍是**回溯式**的；",
    "next 仍是原书的**优化版**（图 4.11 对的是这一版）；",
    "KMP 的 next 仍由调用方传入、可跨目标复用。",
  ], 6.55, 1.1, 2.95, 2.4, { fontSize: 10.5 });
  callout(s, "本书的修正", [
    "返回 `j - m`，不再差 1；",
    "`optional` 取代 `-1`；",
    "next 返回容器，不再泄漏。",
  ], 6.55, 3.65, 2.95, 1.45, { fontSize: 10.5, fill: C.mint, tcolor: C.dark });
}

// ---- KMP 另一个用途：最小循环节 ----
{
  const s = content("4.3+", "KMP 的另一个用途 · 最小循环节", "一个串最短是由多长的一段反复拼成的？");
  text(s, "特征向量算出来的量——前缀里「**最长的相同前缀与后缀**」——还回答另一个问题。上机考试常见的「循环串」「字符串乘方」「前缀中的周期」三类题，核心都是这一件事。", 0.5, 1.02, 9, 0.6, { fontSize: 11.5 });
  card(s, 0.5, 1.75, 4.35, 1.5, C.code);
  text(s, "真边界", 0.7, 1.82, 3, 0.32, { fontSize: 13.5, bold: true, color: C.dark, margin: 0 });
  text(s, "既是 s 的**真前缀**、又是 s 的**真后缀**的子串。`abab` 的真边界有 `ab` 和空串。", 0.7, 2.2, 4.0, 1.0, { fontSize: 11, margin: 0 });
  card(s, 5.15, 1.75, 4.35, 1.5, C.code);
  text(s, "周期", 5.35, 1.82, 3, 0.32, { fontSize: 13.5, bold: true, color: C.dark, margin: 0 });
  text(s, "正整数 p 是 s 的周期，当且仅当对所有 0 ≤ i < n−p 都有 **sᵢ = sᵢ₊ₚ**。", 5.35, 2.2, 4.0, 1.0, { fontSize: 11, margin: 0 });
  card(s, 0.5, 3.35, 9.0, 0.65, C.dark);
  s.addText(runs("定理：s 有长为 b 的真边界 ⇔ n − b 是 s 的周期。所以 **最小周期 = n − 最长真边界的长度**。", { color: C.white, boldColor: C.gold }),
    { x: 0.7, y: 3.35, w: 8.6, h: 0.65, fontFace: FONT, fontSize: 13, margin: 0, isTextBox: true, valign: "middle" });
  callout(s, "证明：同一组等式的两种读法", "长为 b 的真边界：s₀⋯s_(b−1) = s_(n−b)⋯s_(n−1)，即对所有 0 ≤ i < b 有 sᵢ = s_(i+(n−b))；令 p = n − b，恰是「对所有 0 ≤ i < n−p 有 sᵢ = sᵢ₊ₚ」。边界越长周期越短，最长的边界对应最小的周期。", 0.5, 4.12, 9.0, 0.98, { fontSize: 10, tsize: 11 });
}

// 三个例子
{
  const s = content("4.3+", "KMP 的另一个用途 · 最小循环节", "三个例子：周期不一定整除长度");
  const ex = [
    ["abcabcabc", "abcabc", "9 − 6 = 3", "3 整除 9：abc 重复 3 次", C.ok],
    ["ababa", "aba", "5 − 3 = 2", "2 不整除 5：**不是**某个串的整数次重复", C.goldText],
    ["abcd", "（空）", "4 − 0 = 4", "没有非空真边界，最小周期就是 4", C.bad],
  ];
  ex.forEach((e, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.1, 2.85, 2.7, C.code);
    text(s, e[0], x + 0.15, 1.2, 2.55, 0.45, { fontSize: 17, bold: true, fontFace: MONO, color: C.dark, margin: 0 });
    text(s, "最长真边界", x + 0.15, 1.75, 2.5, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
    text(s, e[1], x + 0.15, 2.0, 2.5, 0.35, { fontSize: 13, bold: true, fontFace: MONO, color: C.green, margin: 0 });
    text(s, "最小周期", x + 0.15, 2.4, 2.5, 0.25, { fontSize: 9.5, color: C.muted, margin: 0 });
    text(s, e[2], x + 0.15, 2.65, 2.5, 0.35, { fontSize: 14, bold: true, color: e[4], margin: 0 });
    text(s, e[3], x + 0.15, 3.1, 2.55, 0.65, { fontSize: 10.5, margin: 0 });
  });
  table(s, [
    ["s", "border_lengths(s)", "minimal_period", "is_repetition", "repetition_count"],
    [{ t: "abcabcabc", mono: true }, { t: "0 0 0 1 2 3 4 5 6", mono: true }, "3", "true", "3"],
    [{ t: "ababa", mono: true }, { t: "0 0 1 2 3", mono: true }, "2", "false", "1"],
    [{ t: "abcd", mono: true }, { t: "0 0 0 0", mono: true }, "4", "false", "1"],
    [{ t: "aaaa", mono: true }, { t: "0 1 2 3", mono: true }, "1", "true", "4"],
  ], 0.5, 3.95, 9.0, [1.6, 2.6, 1.6, 1.5, 1.7], { fontSize: 10, rowH: 0.23, tight: true });
}

// border_lengths
{
  const s = content("4.3+", "KMP 的另一个用途 · modern.hpp", "border_lengths：去掉「优化」的失效函数");
  codeBlock(s, src(1022, 1046), 0.5, 1.05, 6.4, 4.05, { fontSize: 8.2 });
  callout(s, "与 build_next 的关系", "回退链一模一样：`k = border[k - 1]` 与 `k = next[k]` 是同一个动作。\n未优化的 `next[i+1] == border[i]`：下标错开一位、没有 −1。", 7.1, 1.05, 2.4, 2.2, { fontSize: 9.5, fill: C.mint, tcolor: C.dark });
  callout(s, "代价", "整个串只算一遍，**O(n)**。", 7.1, 3.4, 2.4, 0.8, { fontSize: 10 });
  text(s, "border[i] = 前缀 s[0..i] 的最长真边界长度。", 7.1, 4.35, 2.4, 0.7, { fontSize: 10, bold: true, color: C.goldText, margin: 0 });
}

// 陷阱一
{
  const s = content("4.3+", "KMP 的另一个用途 · 陷阱一", "原书的优化版 next 不能拿来求周期");
  text(s, "`next[i] = next[k]` 是专为匹配做的：Pᵢ = Pₖ 时退到 k 注定再失配，于是直接跳过这个落点。**对匹配而言那个落点没用，对周期而言它恰恰是答案。**", 0.5, 1.05, 9, 0.75, { fontSize: 12 });
  table(s, [
    ["i", "0", "1", "2", "3"],
    [{ t: "s[i]", bold: true }, "a", "a", "a", "a"],
    [{ t: "优化版 next[i]", bold: true }, { t: "−1", color: C.bad }, { t: "−1", color: C.bad }, { t: "−1", color: C.bad }, { t: "−1", color: C.bad }],
    [{ t: "border[i]", bold: true }, { t: "0", color: C.ok }, { t: "1", color: C.ok }, { t: "2", color: C.ok }, { t: "3", color: C.ok }],
  ], 0.5, 1.95, 5.0, [1.8, 0.8, 0.8, 0.8, 0.8], { fontSize: 12, rowH: 0.42, align: "center" });
  card(s, 5.75, 1.95, 3.75, 1.68, RED);
  text(s, "前缀 aaa 的周期", 5.95, 2.02, 3.4, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
  text(s, "错：3 − (−1) = 4\n比前缀本身还长", 5.95, 2.37, 3.4, 0.6, { fontSize: 12, margin: 0 });
  text(s, "对：3 − 2 = 1", 5.95, 3.05, 3.4, 0.4, { fontSize: 14, bold: true, color: C.ok, margin: 0 });
  callout(s, "这不是个别串的巧合", "在 {a, b} 上长度不超过 10 的全部串、全部前缀上统计过：优化版给出错误周期的前缀**数以千计**。求周期要用 `border_lengths`。", 0.5, 3.85, 9.0, 1.25, { fontSize: 11.5 });
}

// minimal_period + is_repetition
{
  const s = content("4.3+", "KMP 的另一个用途 · modern.hpp", "minimal_period 与 is_repetition");
  codeBlock(s, src(1075, 1097), 0.5, 1.05, 6.4, 4.05, { fontSize: 8.5, hl: [22] });
  callout(s, "陷阱二：整除 ≠ 循环", "判断是否由更短的串重复而成，要同时满足 **n mod p = 0** 与 **p < n**。\n边界为 0 时 p = n，而 n mod n = 0 **恒成立**——只写第一个条件，`abcd` 就被当成了循环串。", 7.1, 1.05, 2.4, 2.75, { fontSize: 9.5, fill: RED, tcolor: C.bad });
  callout(s, "p 不一定整除 n", "`ababa` 最小周期 2，但它不是某个串重复若干次。", 7.1, 3.95, 2.4, 1.15, { fontSize: 9.5 });
}

// repetition_count + 三类题
{
  const s = content("4.3+", "KMP 的另一个用途 · 三类题", "三类上机题怎么落到这组函数上");
  codeBlock(s, src(1099, 1106), 0.5, 1.05, 9.0, 1.45, { fontSize: 9.5 });
  const probs = [
    ["循环串", "s 能否写成更短的串重复至少两次", "is_repetition(s)"],
    ["字符串乘方", "最大的 K，使 s 是某串重复 K 次", "repetition_count(s)"],
    ["前缀中的周期", "逐个前缀报出 K > 1 的那些", "对 border 每个下标 i，长 i+1 的前缀套同一判断"],
  ];
  probs.forEach((p, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 2.65, 2.85, 1.3, C.code);
    text(s, p[0], x + 0.15, 2.72, 2.5, 0.32, { fontSize: 13, bold: true, color: C.dark, margin: 0 });
    text(s, p[1], x + 0.15, 3.05, 2.55, 0.3, { fontSize: 10, margin: 0 });
    text(s, p[2], x + 0.15, 3.38, 2.6, 0.52, { fontSize: 9.5, bold: true, color: C.green, fontFace: i < 2 ? MONO : undefined, margin: 0 });
  });
  callout(s, "测试怎么证伪它", "独立参照物是周期的定义本身：逐个试 p = 1, 2, … 的 O(n²) 暴力解。{a, b} 上长度 0～10 的全部 **2047** 个串逐个对拍，C++ 与 Python 各跑一遍；改用优化版 next 或删掉 `p < n`，测试当场变红。", 0.5, 4.08, 9.0, 1.02, { fontSize: 10, tsize: 11, fill: C.mint, tcolor: C.dark });
}

// 习题选讲
{
  const s = content("练", "习题选讲", "几道有代表性的习题与上机题");
  const ex = [
    ["习题 2", "给出使 s₁ + s₂ = s₂ + s₁ 成立的所有可能条件（+ 为连接）。", "结论很漂亮：当且仅当两者都是**同一个串的重复**。"],
    ["习题 7", "线性时间判断 T 是否是 T′ 的循环反转（如 arc 与 car）。", "长度相同，且 T 是 **T′T′ 的子串**——用 KMP 找。不要先反转再找，拿 arc / car 一试就露馅。"],
    ["习题 9", "求 BAAABBBAA 的特征向量，并与目标 BAAABBBCDDDCCHHHHBBBAAABBBAADD 匹配，画出过程。", "优化版 next：`-1 0 0 0 -1 1 1 0 0`"],
    ["上机 4", "简单行编辑程序：行插入、行删除、改当前行指针、分页显示、查找和替换。", "**查找必须自己实现 KMP**（或其他模式匹配算法），不允许用编程环境提供的查找算法。"],
  ];
  ex.forEach((e, i) => {
    const y = 1.05 + i * 1.02;
    card(s, 0.5, y, 9.0, 0.92, C.code);
    pill(s, e[0], 0.65, y + 0.27, 1.0, 0.38, i === 3 ? C.goldText : C.green, C.white, 11);
    text(s, e[1], 1.85, y + 0.06, 3.6, 0.8, { fontSize: 10.5, valign: "middle", margin: 0 });
    text(s, e[2], 5.6, y + 0.06, 3.8, 0.8, { fontSize: 10.5, valign: "middle", color: C.dark, margin: 0 });
  });
}

  summarySlide("本章小结", [
    ["串与编码", "元素限定为字符、操作按**整段**的线性表。`char` 是字节不是字符；比较按编码单元字典序，两个裸字面量 `<` 比的是地址。"],
    ["变长存储", "顺序存放 + 类管理缓冲区：长度一变就**重新申请、拷贝、释放**，追加一个字符 O(n)；**三法则**第三次出场。"],
    ["接口口径", "`find` 返回 `optional` 不用 `-1`；`substr` 越界抛异常而非 `return NULL`；修改器返回 `String&`。"],
    ["朴素匹配", "失配右移一位，目标回溯，最坏 **O(|T|·|P|)**。原书两个匹配算法返回值**一律差 1**，正确是 `j - m`。"],
    ["KMP", "next 只依赖模式、可复用；目标下标**只增不减**，整体 **O(|T|+|P|)**。求周期要用未优化的 border。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
