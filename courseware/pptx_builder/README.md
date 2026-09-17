# pptx_builder：讲义 Markdown → 讲课 PPTX

把 `202609_DSA_XX_*.md` 讲义整理成课堂用的 `.pptx`。第三章 `202609_DSA_03_Stack_Queue.pptx`（58 页）就是这样生成的。

```
pptx_builder/
├── lib.js                     # 通用库：配色、版式、代码块、表格、图片、保存（含 bug 修正）
├── decks/ch03_stack_queue.js  # 第三章的全部幻灯片内容（新章节照它新建一个文件）
├── qa.sh                      # 渲染成图片 + 2x2 网格，逐页目检
└── package.json               # pptxgenjs 4.0.1 + jszip 3.10.2
```

## 快速开始

```bash
cd courseware/pptx_builder
npm install
node decks/ch03_stack_queue.js ../202609_DSA_03_Stack_Queue.pptx   # 或 npm run ch03
./qa.sh ../202609_DSA_03_Stack_Queue.pptx                          # 输出 qa/<deck>/grid-*.jpg
```

- 讲义里引用的图片会自动下载到 `.cache/<章节>/`（已下载则跳过）。
- `qa.sh` 需要 LibreOffice、poppler（`pdftoppm`）、Python Pillow。沙箱里裸 `soffice` 可能卡住，可用 `SOFFICE="python3 <pptx-skill>/scripts/office/soffice.py" ./qa.sh ...`；再加 `VALIDATE=<pptx-skill>/scripts/office/validate.py` 会先做 OOXML 校验。

## 做一章新的：工作流程

1. **通读讲义**，列出页面清单。经验上一章 50–60 页，结构是：
   封面 → 本章三个问题 → 内容地图 → 「先跑一遍」demo → 每个 Part 一张深色分节页 → 各小节 → 本章小结。
   每个小节通常拆成：概念页（图 + 要点）→ 代码页（代码 + 右侧 callout）→ 关键要点页 → 例题/OJ 页。
2. **复制 `decks/ch03_stack_queue.js`** 为 `decks/chNN_xxx.js`，改 `IMAGES`（name → 讲义中的图片 URL）、`createDeck({title, imgDir})`、封面和小结，然后逐页替换内容。
3. **生成 → `qa.sh` → 看网格图 → 修 → 再生成**，直到没有溢出、重叠。
4. 拷到 `courseware/`，commit。

「尽量详细」时，讲义里的这些都值得单独成页：ADT 运算表、完整教学版代码（长了就拆上/下两页）、手算的逐步 trace 表（原书没有的也可以补，但要自己核对每一步）、实测数据表、易错点（用红色 callout）、OJ 题解代码。

## lib.js 提供的积木

`const D = createDeck({ title, imgDir })`，然后从 `D` 里解构：

| 函数 | 用途 |
| --- | --- |
| `titleSlide({kicker, title, subtitle, topics, footer})` | 深色封面 |
| `sectionSlide(label, title, sub)` | 深色分节页 |
| `content(badge, kicker, title)` → `slide` | 白底内容页：左上圆形徽标（如 `"1.3"`）、小字面包屑、标题、右下页码 |
| `summarySlide(heading, [[标签, 说明], ...])` | 深色小结页（≤ 5 条） |
| `text(slide, str, x, y, w, h, opts)` | 文本；`str` 支持 `**粗体**` 与 `` `代码` `` |
| `bullets(slide, items, x, y, w, h, {fontSize, gap})` | 项目符号列表；item 可为 `{t, plain:true}` 表示不加符号 |
| `callout(slide, title, body, x, y, w, h, {fill, tcolor, fontSize})` | 带标题的提示卡；`body` 为字符串或 bullet 数组。默认奶油色，`fill: C.mint` 绿，`fill: "FDF0EE", tcolor: C.bad` 红 |
| `codeBlock(slide, code, x, y, w, h, {fontSize, lang, hl})` | 代码块，注释自动变灰；`lang: "py"`/`"cpp"`/`"text"`；`hl: [行号]` 高亮行 |
| `consoleBlock(slide, output, x, y, w, h)` | 深色「输出」框 |
| `table(slide, rows, x, y, w, colW, {fontSize, rowH, tight})` | 表格；首行为表头；单元格可写 `{t, mono, bold, color, fill, align}` |
| `image(slide, name, x, y, maxW, maxH)` | 按宽高比缩放进框内并居中 |
| `card` / `pill` / `numCircle` / `cells` / `arrowLabel` | 圆角卡片、胶囊标签、编号圆点、数组格子、带箭头的指针标签，用来画示意图 |
| `save(out)` | 写文件（含下面的 pPr 修正与母版主题修正） |

配色 `C`：`dark` 深绿（标题/深色页）、`green`、`gold` / `goldText`、`cream`（提示卡）、`mint`、`code`（代码底色）、`ok` 绿、`bad` 红、`muted` 灰。字体：正文 Microsoft YaHei，代码 Courier New。

## 坐标与排版约定

- 画布 `LAYOUT_16x9` = **10 × 5.625 英寸**，所有 x/y/w/h 都是英寸。
- 标题区占到 y≈0.9；正文区 **y 1.0–5.15**，左右边距 0.5（x 0.5–9.5）；页码在 y 5.28。
- 常用分栏：两栏各宽 4.35（x = 0.5 / 5.15）；三栏各宽 2.85（x = 0.5 / 3.55 / 6.6）；代码 + 侧栏：代码宽 5.6–6.3，侧栏宽 2.5–3.15。
- 代码字号与容量（高 4.1 的代码块）：9pt ≈ 25 行，8.5pt ≈ 27 行，7.9pt ≈ 32 行。再多就拆成两页，不要再缩字号。
- 表格：13 行以上用 `{fontSize: 9, rowH: 0.29, tight: true}`。

## 踩过的坑（改库前先看）

0. **Mac 版 PowerPoint 打开弹窗要「修复」（标题带 `Repaired`）**：
   - **根因（2026-09-17 在 mac-mini-2 上用 PowerPoint 实测二分）**：形状写成了负尺寸。画从左下到右上的线时传 `h: -0.45`，pptxgenjs 原样写出 `<a:ext cy="-411480"/>`；
     尺寸必须非负，LibreOffice 照画、`validate.py` 也不报，但 PowerPoint 打开就要修复。58 页里只有带这种线的第 12、16 页各自单独就会触发。
   - **修复**：`createDeck` 包装了 `slide.addShape`，负的 `w`/`h` 自动换算成正尺寸 + `flipH`/`flipV`，线的方向不变。deck 里照常写负值即可。
   - 讲义母版单独用 `theme2.xml`、`[Content_Types].xml` 排第一，是照 dsa-modernization T-077（`e30646c`，它自己的 Python 生成器）加的。
     **对 pptxgenjs 产物实测不是触发点**（共用主题的版本同样干净），留着无害。
   - **检查**：`node lib.js check ../*.pptx`（负尺寸形状、母版共用主题，有问题返回非 0）；`node lib.js fix in.pptx out.pptx` 只修主题，不修负尺寸——负尺寸要重新生成。
   - **最终判据只有 PowerPoint**。自动判据：`osascript` 让 PowerPoint `open` 文件，**等 10 秒**再读 `name of active presentation`，带 `Repaired` 即坏；
     每个文件之间要退出 PowerPoint（关掉一份被修复的演示文稿后紧接着再 open 会报 -9074）；等 3 秒不够，大文件会误判为干净。
     先用一份已知干净、一份已知坏的文件定标，再二分：按页范围生成子集（给 `pres.addSlide` 挂个只保留指定页的包装）→ 单页 → 看该页 XML。
1. **pptxgenjs 4.x 多 run 段落丢项目符号**：一个段落里只要有第二个 run（比如带 `**粗体**`），它会在该 run 前再写一个 `<a:pPr><a:buNone/>`，符号消失且 XML 非法。`save()` 里用正则删掉段中多余的 `pPr`。**不要**改成给每个 run 都设 `bullet`——那会让每个 run 自成一段。
2. **表格 margin 的单位随数值变**：`margin[0] >= 1` 按「磅」，`< 1` 按「英寸」。`[0, 4, 0, 4]` 会被当成 4 英寸边距把表格撑爆；紧凑表格用 `[0.01, 0.05, 0.01, 0.05]`。
3. **模板字符串里的代码不要随手缩进**：deck 文件的幻灯片代码块写在顶层，就是为了保证代码块里的缩进原样进入幻灯片。
4. 颜色写 `"1E3D34"`，不能带 `#`、不能 8 位；option 对象会被 pptxgenjs 原地修改，不要在两次 `add*` 之间共用。
5. 图片默认把本地绝对路径写进 alt text，`image()` 已改为用 `name`。
6. LibreOffice 预览里代码中的中文注释用替代字体，宽度与 PowerPoint 略有出入；代码行尾的注释留点余量。
7. 常见需要修的问题：长代码溢出卡片底部、表格超出页面、callout 文字压到下沿、标题过长折行。先看网格图找这些。
