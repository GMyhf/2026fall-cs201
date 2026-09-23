// MOOC 课堂提问 deck（13.33 × 7.5）：每题一页，左侧题面，右侧答案卡。
// 名字以 ANS_ 开头的形状（答案卡、正确选项的绿框）在单击后淡入——与 202609_DSA_MOOC_Quiz_CH01-02.pptx 相同。
// 用法见 decks/quiz_ch03_04.js 与 README 的「MOOC 课堂提问」一节。
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
const { C, FONT, MONO, stripStrayPPr, pack, giveEachMasterItsOwnTheme, normalizeBox, imageSize } = require("./lib");

const INK = "222222", CODE_INK = "1B2B24", OK = C.ok;
const LX = 0.6, LW = 6.9, LTOP = 1.8, LBOTTOM = 7.1;
const CX = 7.95, CY = 0.45, CW = 4.8, CH = 6.6;
const TX = 8.3, TW = 4.1, NX = 8.55, NW = 3.85, NBOTTOM = CY + CH - 0.2;
const IMG_DIR = path.join(__dirname, ".cache", "quiz");

// ---------- 文字宽度估算（英寸），用于自动换行高度与字号选择 ----------
function plain(s) {
  return s.replace(/\*\*/g, "").replace(/`/g, "").replace(/[\^_]\{([^}]*)\}/g, "$1");
}
function units(s, mono = false) {
  let u = 0;
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c < 0x7f) u += mono ? 0.6 : 0.56;
    else if (c < 0x2e80 && !(c >= 0x2460 && c <= 0x24ff) && !(c >= 0x25a0 && c <= 0x27bf)) u += 0.72;
    else u += 1.0;
  }
  return u;
}
function nLines(s, w, pt, mono = false) {
  return plain(s).split("\n").reduce((n, ln) => n + Math.max(1, Math.ceil((units(ln, mono) * pt) / 72 / (w * 0.94))), 0);
}
const lineH = (pt, lsm = 1) => (pt / 72) * 1.32 * lsm;
function textH(s, w, pt, mono = false) {
  return nLines(s, w, pt, mono) * lineH(pt) + 0.06;
}

// ---------- 富文本：**粗体**、`代码`、^{上标}、_{下标}、\n ----------
function rich(str, base = {}) {
  const out = [];
  const inner = (s, o) => {
    s.split(/(`[^`]+`|\^\{[^}]*\}|_\{[^}]*\})/).filter((p) => p.length).forEach((p) => {
      if (p[0] === "`") out.push({ text: p.slice(1, -1), options: { ...o, fontFace: MONO, color: o.codeColor || C.green, bold: true } });
      else if (p.startsWith("^{")) out.push({ text: p.slice(2, -1), options: { ...o, superscript: true } });
      else if (p.startsWith("_{")) out.push({ text: p.slice(2, -1), options: { ...o, subscript: true } });
      else out.push({ text: p, options: { ...o } });
    });
  };
  str.split(/(\*\*(?:[^*]|\*(?!\*))+?\*\*)/).filter((p) => p.length).forEach((p) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) inner(p.slice(2, -2), { ...base, bold: true, color: base.boldColor || base.color });
    else inner(p, base);
  });
  const res = [];
  out.forEach((r) => {
    delete r.options.boldColor; delete r.options.codeColor;
    const pieces = r.text.split("\n");
    pieces.forEach((t, i) => {
      const o = { ...r.options };
      if (i < pieces.length - 1) o.breakLine = true;
      if (t.length || i < pieces.length - 1) res.push({ text: t, options: o });
    });
  });
  return res;
}

// ---------- 图片 ----------
async function fetchImage(url) {
  if (!/^https?:\/\//.test(url)) return url;
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const file = path.join(IMG_DIR, path.basename(new URL(url).pathname));
  if (!fs.existsSync(file)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`下载失败 ${res.status}: ${url}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log("fetched", path.basename(file));
  }
  return file;
}

// ---------- 单击淡入（与 CH01-02 相同的 <p:timing>） ----------
function timingXml(targets) {
  let n = 0;
  const id = () => ++n;
  const root = id(), seq = id(), click = id(), grp = id();
  const effects = targets.map((t, i) => {
    const e = id(), set = id(), fade = id();
    return `<p:par><p:cTn id="${e}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold"${t.sp ? ' grpId="0"' : ""} nodeType="${i ? "withEffect" : "clickEffect"}"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>`
      + `<p:set><p:cBhvr><p:cTn id="${set}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${t.id}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>`
      + `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${fade}" dur="400"/><p:tgtEl><p:spTgt spid="${t.id}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par>`;
  }).join("");
  const bld = targets.filter((t) => t.sp).map((t) => `<p:bldP spid="${t.id}" grpId="0" animBg="1"/>`).join("");
  return `<p:timing><p:tnLst><p:par><p:cTn id="${root}" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="${seq}" dur="indefinite" nodeType="mainSeq"><p:childTnLst>`
    + `<p:par><p:cTn id="${click}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${grp}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>`
    + effects
    + `</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn>`
    + `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>`
    + (bld ? `<p:bldLst>${bld}</p:bldLst>` : "") + `</p:timing>`;
}

async function injectReveal(zip) {
  let slides = 0;
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
    let xml = await zip.file(name).async("string");
    const targets = [...xml.matchAll(/<p:(sp|pic)>\s*<p:nv(?:Sp|Pic)Pr>\s*<p:cNvPr id="(\d+)" name="ANS_/g)].map((m) => ({ id: m[2], sp: m[1] === "sp" }));
    if (!targets.length) continue;
    xml = xml.replace("</p:sld>", timingXml(targets) + "</p:sld>");
    zip.file(name, xml);
    slides++;
  }
  return slides;
}

// ---------- deck ----------
// spec = { title, kicker, chapters: [{ label, name, questions: [q, ...] }] }
// q = { kind, title, stem, code?, codeLang?, table?, image?: {url, h}, options?, grid?, correct?: ["A"],
//       after?, answer, notes?: [str | {code}] }
async function buildQuiz(spec, out) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = spec.title;
  pres.author = "Hongfei Yan";
  const newSlide = () => {
    const s = pres.addSlide();
    const addShape = s.addShape.bind(s);
    s.addShape = (type, o = {}) => addShape(type, normalizeBox(o));
    return s;
  };
  const txt = (s, str, x, y, w, h, o = {}) => {
    const face = o.fontFace || FONT;
    s.addText(typeof str === "string" ? rich(str, { color: o.color || INK, boldColor: o.boldColor, codeColor: o.codeColor }) : str, {
      x, y, w, h, fontFace: face, fontSize: o.fontSize || 20, color: o.color || INK, bold: o.bold,
      align: o.align || "left", valign: o.valign || "top", margin: 0, isTextBox: true, objectName: o.name,
      lineSpacingMultiple: o.lsm, fit: "none",
    });
  };
  let ans = 0;
  const A = () => `ANS_${ans++}`;

  function darkSlide(k, t, sub) {
    const s = newSlide();
    s.background = { color: C.dark };
    s.addShape(pres.shapes.OVAL, { x: 9.2, y: -1.2, w: 5.5, h: 5.5, fill: { color: C.green, transparency: 55 }, line: { type: "none" } });
    s.addShape(pres.shapes.OVAL, { x: 10.6, y: 4.3, w: 3.2, h: 3.2, fill: { color: C.gold, transparency: 70 }, line: { type: "none" } });
    txt(s, k, 0.8, 1.9, 9.0, 0.6, { fontSize: 20, bold: true, color: C.gold, valign: "middle" });
    txt(s, t, 0.8, 2.6, 10.0, 1.6, { fontSize: 48, bold: true, color: C.white });
    txt(s, sub, 0.8, 4.5, 9.0, 1.2, { fontSize: 18, color: C.mint });
  }

  // 左栏：题干 → 代码/表格/图片 → 选项 → 补充说明；整体按比例 s 缩小直到放得下
  function planLeft(q, s) {
    const blocks = [];
    const stemPt = 20 * s;
    if (q.stem) blocks.push({ type: "stem", h: textH(q.stem, LW, stemPt), pt: stemPt });
    if (q.code) {
      const lines = q.code.replace(/\n$/, "").split("\n");
      const widest = Math.max(...lines.map((l) => units(l, true)));
      const pt = Math.min(16 * s, ((LW - 0.45) * 72) / widest / 1.02);
      blocks.push({ type: "code", pt, h: lines.length * lineH(pt, 1.0) + 0.3, lines });
    }
    if (q.table) {
      const pt = Math.min(15 * s, q.tableFont || 99);
      const rh = Math.max(0.3, lineH(pt) + 0.1);
      blocks.push({ type: "table", pt, rh, h: rh * q.table.length });
    }
    if (q.image) {
      const [pw, ph] = imageSize(q.image.file);
      let h = (q.image.h || 2.6) * s, w = (h * pw) / ph;
      if (w > LW) { w = LW; h = (w * ph) / pw; }
      blocks.push({ type: "image", w, h });
    }
    if (q.options) {
      const n = q.options.length;
      const optPt = 20 * s;
      const cols = q.cols || (n <= 4 ? n : Math.ceil(n / 2));
      const boxW = (LW - (cols - 1) * 0.15) / cols;
      const gridFits = q.grid !== false && q.options.every((o, i) => !o.includes("\n") && (units(plain(`${String.fromCharCode(65 + i)}  ${o}`)) * optPt) / 72 <= boxW - 0.25);
      if (q.grid === true || (q.grid !== false && gridFits && q.options.every((o) => units(plain(o)) <= 12))) {
        const rows = Math.ceil(n / cols), bh = Math.max(0.62, 0.9 * s);
        blocks.push({ type: "grid", pt: optPt, cols, rows, boxW, bh, h: rows * bh + (rows - 1) * 0.15 });
      } else {
        const rows = q.options.map((o) => Math.max(0.5 * s + 0.08, textH(o, 6.3, optPt) + 0.04));
        const gap = 0.14 * s;
        blocks.push({ type: "list", pt: optPt, rows, gap, h: rows.reduce((a, b) => a + b, 0) + gap * (n - 1) });
      }
    }
    if (q.after) blocks.push({ type: "after", h: textH(q.after, LW, 17 * s), pt: 17 * s });
    const gap = 0.28 * s;
    const total = blocks.reduce((a, b) => a + b.h, 0) + gap * Math.max(0, blocks.length - 1);
    return { blocks, gap, total };
  }

  function drawLeft(sl, q) {
    let plan;
    for (const s of [1, 0.92, 0.85, 0.78, 0.72, 0.66, 0.6, 0.55, 0.5]) {
      plan = planLeft(q, s);
      if (LTOP + plan.total <= LBOTTOM) break;
    }
    if (LTOP + plan.total > LBOTTOM + 0.05) console.warn(`  ! 左栏溢出 ${q.title}: ${(LTOP + plan.total).toFixed(2)}`);
    const correct = new Set(q.correct || []);
    let y = LTOP;
    for (const b of plan.blocks) {
      if (b.type === "stem") txt(sl, q.stem, LX, y, LW, b.h, { fontSize: b.pt });
      else if (b.type === "after") txt(sl, q.after, LX, y, LW, b.h, { fontSize: b.pt, color: C.muted });
      else if (b.type === "code") {
        sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: LX, y, w: LW, h: b.h, rectRadius: 0.08, fill: { color: C.code }, line: { type: "none" } });
        sl.addText(b.lines.map((l, i) => ({ text: l.length ? l : " ", options: { breakLine: i < b.lines.length - 1 } })), {
          x: LX + 0.2, y, w: LW - 0.3, h: b.h, fontFace: MONO, fontSize: b.pt, color: CODE_INK, valign: "middle", margin: 0, isTextBox: true, lineSpacingMultiple: 1.0,
        });
      } else if (b.type === "table") {
        const data = q.table.map((r, i) => r.map((cell) => ({
          text: String(cell) === "" ? " " : String(cell),
          options: { fontFace: FONT, fontSize: b.pt, bold: i === 0, color: i === 0 ? C.white : INK, fill: { color: i === 0 ? C.dark : i % 2 ? C.white : "F7F9F8" }, align: "center", valign: "middle", margin: [0.02, 0.05, 0.02, 0.05] },
        })));
        const w = Math.min(LW, (q.tableW || LW));
        sl.addTable(data, { x: LX, y, w, rowH: b.rh, border: { type: "solid", pt: 0.75, color: "D5DDD9" }, autoPage: false });
      } else if (b.type === "image") {
        sl.addImage({ path: q.image.file, x: LX + (LW - b.w) / 2, y, w: b.w, h: b.h, altText: q.title });
      } else if (b.type === "grid") {
        q.options.forEach((o, i) => {
          const L = String.fromCharCode(65 + i);
          const x = LX + (i % b.cols) * (b.boxW + 0.15), yy = y + Math.floor(i / b.cols) * (b.bh + 0.15);
          sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: yy, w: b.boxW, h: b.bh, rectRadius: 0.08, fill: { color: C.code }, line: { type: "none" } });
          sl.addText([{ text: L + "  ", options: { bold: true, color: C.green } }, ...rich(o, { color: INK })], {
            x, y: yy, w: b.boxW, h: b.bh, fontFace: FONT, fontSize: b.pt, color: INK, align: "center", valign: "middle", margin: 0, isTextBox: true,
          });
        });
      } else if (b.type === "list") {
        let yy = y;
        q.options.forEach((o, i) => {
          const L = String.fromCharCode(65 + i), rh = b.rows[i], d = Math.min(0.42, 0.42 * (b.pt / 20) + 0.06);
          sl.addShape(pres.shapes.OVAL, { x: LX, y: yy + (rh - d) / 2, w: d, h: d, fill: { color: C.green }, line: { type: "none" } });
          txt(sl, L, LX, yy + (rh - d) / 2, d, d, { fontSize: 14 * Math.min(1, b.pt / 20 + 0.1), bold: true, color: C.white, align: "center", valign: "middle" });
          txt(sl, o, LX + 0.6, yy, 6.3, rh, { fontSize: b.pt, valign: "middle" });
          b.rows[i] = { y: yy, h: rh };
          yy += rh + b.gap;
        });
      }
      b.y = y;
      y += b.h + plan.gap;
    }
    // 正确选项的绿框（随答案一起淡入）
    for (const b of plan.blocks) {
      if (b.type === "grid") q.options.forEach((o, i) => {
        if (!correct.has(String.fromCharCode(65 + i))) return;
        const x = LX + (i % b.cols) * (b.boxW + 0.15), yy = b.y + Math.floor(i / b.cols) * (b.bh + 0.15);
        sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: yy, w: b.boxW, h: b.bh, rectRadius: 0.1, line: { color: OK, width: 3 }, objectName: A() });
      });
      if (b.type === "list") b.rows.forEach((r, i) => {
        if (!correct.has(String.fromCharCode(65 + i))) return;
        sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: LX - 0.1, y: r.y - 0.04, w: LW + 0.2, h: r.h + 0.08, rectRadius: 0.1, line: { color: OK, width: 3 }, objectName: A() });
      });
    }
  }

  function drawCard(sl, q) {
    sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: CX, y: CY, w: CW, h: CH, rectRadius: 0.15, fill: { color: C.cream }, line: { color: C.gold, width: 1.5 }, objectName: A() });
    txt(sl, "答案", TX, 0.75, 2.0, 0.4, { fontSize: 16, bold: true, color: C.goldText, valign: "middle", name: A() });
    const answer = String(q.answer);
    let apt = 16;
    for (const pt of [44, 36, 30, 26, 22, 20, 18, 16]) {
      // 大号粗体里「、」和中西文间距比估算宽，按 1.3 倍留余量
      const lines = nLines(answer, TW / 1.3, pt);
      const hard = answer.split("\n").length;
      if ((pt >= 30 ? lines === hard && hard <= 2 : lines <= Math.max(3, hard + 1)) && lines * lineH(pt) <= 2.6) { apt = pt; break; }
    }
    const aH = Math.max(0.95, textH(answer, TW, apt));
    txt(sl, answer, TX, 1.2, TW, aH, { fontSize: apt, bold: true, color: C.dark, valign: "middle", name: A() });
    const notes = q.notes || [];
    if (!notes.length) return;
    const ly = 1.2 + aH + 0.25;
    txt(sl, "解析", TX, ly, 2.0, 0.4, { fontSize: 16, bold: true, color: C.goldText, valign: "middle", name: A() });
    const top = ly + 0.5;
    const measure = (pt) => notes.map((n) => typeof n === "string"
      ? textH(n, NW, pt)
      : n.code.split("\n").length * lineH(pt * 0.85, 1.0) + 0.16);
    let pt = 12, hs;
    for (const p of [17, 16, 15, 14, 13, 12, 11]) {
      hs = measure(p);
      const gap = p * 0.009;
      if (top + hs.reduce((a, b) => a + b, 0) + gap * (hs.length - 1) <= NBOTTOM) { pt = p; break; }
    }
    hs = measure(pt);
    const gap = pt * 0.009;
    if (top + hs.reduce((a, b) => a + b, 0) + gap * (hs.length - 1) > NBOTTOM + 0.05) console.warn(`  ! 解析溢出 ${q.title}`);
    let y = top;
    notes.forEach((n, i) => {
      if (typeof n === "string") {
        sl.addShape(pres.shapes.OVAL, { x: 8.33, y: y + lineH(pt) / 2 - 0.05, w: 0.1, h: 0.1, fill: { color: C.gold }, line: { type: "none" }, objectName: A() });
        txt(sl, n, NX, y, NW, hs[i], { fontSize: pt, color: C.text, boldColor: C.dark, name: A() });
      } else {
        const lines = n.code.replace(/\n$/, "").split("\n");
        sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: NX - 0.1, y, w: NW + 0.1, h: hs[i], rectRadius: 0.06, fill: { color: C.white }, line: { type: "none" }, objectName: A() });
        sl.addText(lines.map((l, j) => ({ text: l.length ? l : " ", options: { breakLine: j < lines.length - 1 } })), {
          x: NX, y, w: NW - 0.05, h: hs[i], fontFace: MONO, fontSize: pt * 0.85, color: CODE_INK, valign: "middle", margin: 0, isTextBox: true, objectName: A(),
        });
      }
      y += hs[i] + gap;
    });
  }

  function question(ch, q, no) {
    const sl = newSlide();
    sl.background = { color: C.white };
    sl.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.45, w: 0.95, h: 0.95, fill: { color: C.dark }, line: { type: "none" } });
    txt(sl, `Q${no}`, 0.6, 0.45, 0.95, 0.95, { fontSize: 24, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Arial" });
    txt(sl, `${ch.name}  ·  ${q.kind}`, 1.8, 0.45, 6.0, 0.35, { fontSize: 14, bold: true, color: C.green, valign: "middle" });
    txt(sl, q.title, 1.8, 0.8, 6.0, 0.6, { fontSize: units(q.title) > 13 ? 24 : 28, bold: true, color: C.dark, valign: "middle" });
    drawLeft(sl, q);
    drawCard(sl, q);
  }

  for (const ch of spec.chapters) for (const q of ch.questions) if (q.image) q.image.file = await fetchImage(q.image.url);

  const summary = spec.chapters.map((c) => `${c.name}（${c.questions.length} 题）`).join(" · ");
  darkSlide(spec.kicker || "数据结构与算法 · 2026 Fall", "课堂提问：MOOC 习题", `${summary}\n每页先出题，请同学作答；单击显示答案与解析，再单击进入下一题。`);
  for (const ch of spec.chapters) {
    darkSlide(ch.label, ch.name, `共 ${ch.questions.length} 题 · 准备好了吗？`);
    ch.questions.forEach((q, i) => question(ch, q, i + 1));
  }

  const zip = await JSZip.loadAsync(await pres.write({ outputType: "nodebuffer" }));
  const fixed = await stripStrayPPr(zip);
  const revealed = await injectReveal(zip);
  await giveEachMasterItsOwnTheme(zip);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, await pack(zip));
  console.log(`wrote ${out}  (${pres.slides.length} slides, ${revealed} with click-reveal, stripped ${fixed} stray pPr)`);
}

module.exports = { buildQuiz };

// 命令行：node quiz.js out.pptx ch05 ch06   —— 题目数据在 quiz_data/chNN.js（导出 chapter 数组）
if (require.main === module) {
  const [out, ...ids] = process.argv.slice(2);
  if (!out || !ids.length) { console.log("usage: node quiz.js out.pptx ch03 ch04 ..."); process.exit(2); }
  const chapters = ids.flatMap((id) => require(`./quiz_data/${id}.js`));
  const nums = ids.map((id) => id.replace(/\D/g, "")).join("-");
  buildQuiz({ title: `DSA MOOC Quiz CH${nums}`, chapters }, out).catch((e) => { console.error(e); process.exit(1); });
}
