// DSA 讲义 → PPTX 生成库（pptxgenjs）。用法见 README.md。
// 一个 deck 脚本 = createDeck() + 若干 slide 块 + save()。
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

// ---------- 配色与字体（与 202609_DSA_MOOC_Quiz_CH01-02.pptx 同一套） ----------
const C = {
  dark: "1E3D34", green: "3E7C68", gold: "F2B134", goldText: "A06A00", cream: "FFF6E0",
  code: "F1F4F2", text: "2B2B2B", muted: "6B7B74", ok: "2E9E6B", bad: "C0392B", mint: "CFE0D8",
  white: "FFFFFF", comment: "7C8F87", circle: "2F5C4C",
};
const FONT = "Microsoft YaHei";
const MONO = "Courier New";

// PNG / JPEG 像素尺寸，用于保持图片宽高比
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const marker = b[i + 1], len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
  }
  throw new Error("无法读取图片尺寸（仅支持 PNG/JPEG）: " + file);
}

function createDeck({ title = "", author = "Hongfei Yan", imgDir = path.join(__dirname, ".cache") } = {}) {
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 英寸——所有坐标都按这个画布
pres.title = title;
pres.author = author;
let pageNo = 0;
const imageFiles = {};




// ---------- rich text: **bold**, `code` ----------
function runs(str, base = {}) {
  const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/).filter((s) => s.length);
  return parts.map((p) => {
    if (p.startsWith("**")) return { text: p.slice(2, -2), options: { ...base, bold: true, color: base.boldColor || base.color || C.dark } };
    if (p.startsWith("`")) return { text: p.slice(1, -1), options: { ...base, fontFace: MONO, color: base.codeColor || C.green, bold: true } };
    return { text: p, options: { ...base } };
  }).map((r) => { delete r.options.boldColor; delete r.options.codeColor; return r; });
}

function para(items, base = {}) {
  // items: array of strings (or {t, sub:true}); returns runs with paragraph breaks
  const out = [];
  items.forEach((it, idx) => {
    const s = typeof it === "string" ? it : it.t;
    const sub = typeof it === "object" && it.sub;
    const plain = typeof it === "object" && it.plain;
    const rs = runs(s, { color: C.text, ...base });
    rs.forEach((r, j) => {
      if (j === 0) {
        if (!plain && base.bullet !== false) r.options.bullet = { indent: 14 };
        if (sub) r.options.indentLevel = 1;
        r.options.paraSpaceAfter = base.paraSpaceAfter ?? 6;
      }
      if (j === rs.length - 1 && idx < items.length - 1) r.options.breakLine = true;
    });
    out.push(...rs);
  });
  out.forEach((r) => { delete r.options.paraSpaceAfterBase; });
  return out;
}

function text(slide, content, x, y, w, h, opts = {}) {
  const arr = typeof content === "string" ? runs(content, { color: opts.color || C.text }) : content;
  slide.addText(arr, {
    x, y, w, h, fontFace: FONT, fontSize: opts.fontSize || 14, color: opts.color || C.text,
    valign: opts.valign || "top", align: opts.align || "left", margin: opts.margin ?? 0.05,
    bold: opts.bold, italic: opts.italic, isTextBox: true, lineSpacingMultiple: opts.lsm,
  });
}

function bullets(slide, items, x, y, w, h, opts = {}) {
  slide.addText(para(items, { fontSize: opts.fontSize || 14, paraSpaceAfter: opts.gap ?? 6, bullet: opts.bullet }), {
    x, y, w, h, fontFace: FONT, fontSize: opts.fontSize || 14, color: C.text, valign: "top", margin: 0.05, isTextBox: true,
  });
}

// ---------- slides ----------
function darkBg(slide) {
  slide.background = { color: C.dark };
  slide.addShape(pres.shapes.OVAL, { x: 6.9, y: -1.3, w: 4.2, h: 4.2, fill: { color: C.circle }, line: { type: "none" } });
  slide.addShape(pres.shapes.OVAL, { x: 7.9, y: 3.3, w: 2.9, h: 2.9, fill: { color: C.gold, transparency: 55 }, line: { type: "none" } });
}

// 封面：kicker / 标题 / 副标题 / 知识点（多行字符串）/ 页脚
function titleSlide({ kicker, title, subtitle, topics, footer }) {
  const s = pres.addSlide();
  darkBg(s);
  text(s, kicker, 0.7, 1.05, 6, 0.35, { fontSize: 13, bold: true, color: C.gold });
  text(s, title, 0.7, 1.45, 7, 0.9, { fontSize: 38, bold: true, color: C.white });
  text(s, subtitle, 0.7, 2.3, 7, 0.45, { fontSize: 18, color: C.mint });
  text(s, topics, 0.7, 2.95, 6.6, 1.35, { fontSize: 11, color: C.white, lsm: 1.25 });
  text(s, footer, 0.7, 4.75, 7, 0.3, { fontSize: 10, color: C.mint });
  return s;
}

function sectionSlide(label, title, sub) {
  const s = pres.addSlide();
  darkBg(s);
  pageNo++;
  text(s, label, 0.7, 1.7, 6, 0.35, { fontSize: 13, bold: true, color: C.gold });
  text(s, title, 0.7, 2.05, 7, 0.8, { fontSize: 34, bold: true, color: C.white });
  text(s, sub, 0.7, 2.95, 6.3, 1.0, { fontSize: 13, color: C.mint, lsm: 1.3 });
  return s;
}

function content(badge, kicker, title) {
  const s = pres.addSlide();
  pageNo++;
  s.background = { color: C.white };
  s.addShape(pres.shapes.OVAL, { x: 0.4, y: 0.28, w: 0.52, h: 0.52, fill: { color: C.dark }, line: { type: "none" } });
  text(s, badge, 0.4, 0.28, 0.52, 0.52, { fontSize: badge.length > 3 ? 9 : 11, bold: true, color: C.gold, align: "center", valign: "middle", margin: 0 });
  text(s, kicker, 1.05, 0.24, 7.5, 0.25, { fontSize: 9, bold: true, color: C.green, margin: 0 });
  text(s, title, 1.05, 0.46, 8.5, 0.42, { fontSize: 20, bold: true, color: C.dark, margin: 0 });
  text(s, String(pageNo + 1), 9.3, 5.28, 0.5, 0.25, { fontSize: 9, color: C.muted, align: "right", margin: 0 });
  return s;
}

function card(slide, x, y, w, h, fill = C.cream, border = null) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08, fill: { color: fill },
    line: border ? { color: border, width: 1 } : { type: "none" },
  });
}

function codeBlock(slide, code, x, y, w, h, opts = {}) {
  const lang = opts.lang || "cpp";
  const fs = opts.fontSize || 9;
  card(slide, x, y, w, h, C.code);
  const lines = code.replace(/\n$/, "").split("\n");
  const arr = [];
  lines.forEach((ln, i) => {
    const marker = lang === "py" ? ln.search(/#(?![^'"]*['"]\s*[,)\]])/) : ln.indexOf("//");
    let segs;
    if (lang === "text") segs = [[ln, C.text]];
    else if (marker >= 0 && !(lang === "cpp" && ln.trimStart().startsWith("#"))) segs = [[ln.slice(0, marker), C.text], [ln.slice(marker), C.comment]];
    else segs = [[ln, C.text]];
    segs = segs.filter((sg) => sg[0].length > 0);
    if (segs.length === 0) segs = [[" ", C.text]];
    segs.forEach((sg, j) => {
      const o = { fontFace: MONO, fontSize: fs, color: sg[1] };
      if (opts.hl && opts.hl.includes(i + 1)) { o.bold = true; o.color = sg[1] === C.comment ? C.goldText : C.bad; }
      if (j === segs.length - 1 && i < lines.length - 1) o.breakLine = true;
      arr.push({ text: sg[0], options: o });
    });
  });
  slide.addText(arr, { x: x + 0.08, y: y + 0.05, w: w - 0.16, h: h - 0.1, valign: "top", margin: 0.04, fontFace: MONO, fontSize: fs, isTextBox: true, lineSpacingMultiple: 1.0 });
}

function consoleBlock(slide, str, x, y, w, h, fs = 11) {
  card(slide, x, y, w, h, "1B2B24");
  text(slide, "输出", x + 0.12, y + 0.06, 1, 0.22, { fontSize: 8, bold: true, color: C.gold, margin: 0 });
  slide.addText(str, { x: x + 0.12, y: y + 0.28, w: w - 0.24, h: h - 0.34, fontFace: MONO, fontSize: fs, color: C.mint, valign: "top", margin: 0, isTextBox: true });
}

function callout(slide, title, body, x, y, w, h, opts = {}) {
  card(slide, x, y, w, h, opts.fill || C.cream);
  text(slide, title, x + 0.15, y + 0.1, w - 0.3, 0.3, { fontSize: opts.tsize || 12, bold: true, color: opts.tcolor || C.goldText, margin: 0 });
  if (Array.isArray(body)) bullets(slide, body, x + 0.12, y + 0.42, w - 0.24, h - 0.5, { fontSize: opts.fontSize || 11, gap: opts.gap ?? 4 });
  else text(slide, body, x + 0.15, y + 0.42, w - 0.3, h - 0.5, { fontSize: opts.fontSize || 11, margin: 0, lsm: opts.lsm || 1.15 });
}

function table(slide, rows, x, y, w, colW, opts = {}) {
  const fs = opts.fontSize || 11;
  const data = rows.map((r, i) => r.map((cell) => {
    const isHead = i === 0;
    const c = typeof cell === "object" ? cell : { t: String(cell) };
    const o = {
      fontFace: c.mono ? MONO : FONT, fontSize: fs, color: isHead ? C.white : (c.color || C.text), bold: isHead || c.bold,
      fill: { color: isHead ? C.dark : (c.fill || (i % 2 === 0 ? "F7F9F8" : C.white)) }, valign: "middle", align: c.align || opts.align || "left",
      margin: opts.tight ? [0.01, 0.05, 0.01, 0.05] : [2, 5, 2, 5],
    };
    return { text: isHead ? c.t : runs(c.t, { fontFace: c.mono ? MONO : FONT, fontSize: fs, color: c.color || C.text, bold: c.bold }), options: o };
  }));
  slide.addTable(data, { x, y, w, colW, border: { type: "solid", pt: 0.5, color: "D5DDD9" }, rowH: opts.rowH || 0.28, autoPage: false });
}

// 图片：name 对应 fetchImages() 下载到 imgDir 的文件；按原始宽高比缩放进 (maxW, maxH) 框内
function image(slide, name, x, y, maxW, maxH, center = true) {
  const file = imageFiles[name] || path.join(imgDir, name + ".png");
  const [pw, ph] = imageSize(file);
  let w = maxW, h = (maxW * ph) / pw;
  if (h > maxH) { h = maxH; w = (maxH * pw) / ph; }
  const ox = center ? x + (maxW - w) / 2 : x, oy = center ? y + (maxH - h) / 2 : y;
  slide.addImage({ path: file, x: ox, y: oy, w, h, altText: name });
}

// cells drawing: array boxes with labels
function cells(slide, x, y, vals, opts = {}) {
  const cw = opts.cw || 0.5, ch = opts.ch || 0.42;
  vals.forEach((v, i) => {
    const fill = opts.fills?.[i] || (v === "" ? C.white : C.mint);
    slide.addShape(pres.shapes.RECTANGLE, { x: x + i * cw, y, w: cw, h: ch, fill: { color: fill }, line: { color: C.green, width: 1 } });
    if (v !== "") text(slide, String(v), x + i * cw, y, cw, ch, { fontSize: opts.fs || 12, bold: true, color: opts.colors?.[i] || C.dark, align: "center", valign: "middle", margin: 0 });
    if (opts.idx) text(slide, String(i), x + i * cw, y + ch, cw, 0.2, { fontSize: 8, color: C.muted, align: "center", margin: 0 });
  });
}
function arrowLabel(slide, label, x, yTop, color = C.bad, below = false) {
  // small down arrow with label above a cell center x
  if (!below) {
    text(slide, label, x - 0.5, yTop - 0.42, 1.0, 0.22, { fontSize: 9, bold: true, color, align: "center", margin: 0 });
    slide.addShape(pres.shapes.LINE, { x, y: yTop - 0.2, w: 0, h: 0.18, line: { color, width: 1.5, endArrowType: "triangle" } });
  } else {
    slide.addShape(pres.shapes.LINE, { x, y: yTop + 0.22, w: 0, h: 0.18, line: { color, width: 1.5, beginArrowType: "triangle" } });
    text(slide, label, x - 0.5, yTop + 0.42, 1.0, 0.22, { fontSize: 9, bold: true, color, align: "center", margin: 0 });
  }
}
function pill(slide, label, x, y, w, h, fill, color = C.white, fs = 11) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: h / 2, fill: { color: fill }, line: { type: "none" } });
  text(slide, label, x, y, w, h, { fontSize: fs, bold: true, color, align: "center", valign: "middle", margin: 0 });
}
function numCircle(slide, n, x, y, d = 0.36, fill = C.green) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  text(slide, String(n), x, y, d, d, { fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
}

// 本章小结（深色页，最多 5 条）：items = [[标签, 说明（支持 **粗体** 与 `代码`）], ...]
function summarySlide(heading, items) {
  const s = pres.addSlide();
  s.background = { color: C.dark };
  s.addShape(pres.shapes.OVAL, { x: 7.9, y: -2.3, w: 3.4, h: 3.4, fill: { color: C.circle }, line: { type: "none" } });
  text(s, heading, 0.6, 0.4, 6, 0.6, { fontSize: 28, bold: true, color: C.white });
  items.forEach((it, i) => {
    const y = 1.2 + i * 0.83;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 8.8, h: 0.7, rectRadius: 0.08, fill: { color: "25493F" }, line: { type: "none" } });
    numCircle(s, i + 1, 0.78, y + 0.15, 0.4, C.gold);
    text(s, it[0], 1.35, y, 1.8, 0.7, { fontSize: 13.5, bold: true, color: C.gold, valign: "middle", margin: 0 });
    s.addText(runs(it[1], { color: C.white, boldColor: C.gold, codeColor: C.mint }), { x: 3.15, y, w: 6.1, h: 0.7, fontFace: FONT, fontSize: 12, color: C.white, valign: "middle", margin: 0, isTextBox: true });
  });
  return s;
}

// 下载讲义里引用的图片到 imgDir（已存在则跳过）。map = { name: url }
async function fetchImages(map) {
  fs.mkdirSync(imgDir, { recursive: true });
  for (const [name, url] of Object.entries(map)) {
    const ext = path.extname(new URL(url).pathname) || ".png";
    const file = path.join(imgDir, name + ext);
    imageFiles[name] = file;
    if (fs.existsSync(file)) continue;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`下载失败 ${res.status}: ${url}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log("fetched", name);
  }
}

// 写文件。pptxgenjs 4.x 会在段落里每个非首个 run 前再插一个 <a:pPr>（带 buNone），
// 既让项目符号消失，也不是合法 OOXML。这里只保留段首的 pPr。
async function save(out) {
  const buf = await pres.write({ outputType: "nodebuffer" });
  const zip = await JSZip.loadAsync(buf);
  let fixed = 0;
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
    const xml = await zip.file(name).async("string");
    const outXml = xml.replace(/(<\/a:r>)(?:<a:pPr\b[^>]*\/>|<a:pPr\b[^>]*>(?:(?!<\/a:pPr>).)*<\/a:pPr>)/g, (m, r) => { fixed++; return r; });
    zip.file(name, outXml);
  }
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log(`wrote ${out}  (${pres.slides.length} slides, stripped ${fixed} stray pPr)`);
}

return {
  pres, C, FONT, MONO,
  runs, para, text, bullets, card, codeBlock, consoleBlock, callout, table, image,
  cells, arrowLabel, pill, numCircle,
  darkBg, titleSlide, sectionSlide, content, summarySlide,
  fetchImages, save,
};
}

module.exports = { createDeck, C, FONT, MONO };
