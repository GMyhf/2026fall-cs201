// 讲座：用 Agent 快速做科研、写文章 —— 由 202609_DSA_Talk_Research_with_Agents.md（2026-11-09 课堂录音整理）做成的 PPT。
// 生成：cd courseware/pptx_builder && node decks/talk_research_agents.js ../202609_DSA_Talk_Research_with_Agents.pptx
const path = require("path");
const { createDeck } = require("../lib");

const OUT = process.argv[2] || path.join(__dirname, "..", "out", "202609_DSA_Talk_Research_with_Agents.pptx");

(async () => {
  const D = createDeck({ title: "用 Agent 快速做科研、写文章", imgDir: path.join(__dirname, "..", ".cache", "talk") });
  const { pres, C, text, bullets, card, callout, table, pill, numCircle, codeBlock, consoleBlock, titleSlide, sectionSlide, content, summarySlide } = D;

  // 带编号的步骤卡：n / 标题 / 说明
  function stepCard(s, n, title, body, x, y, w, h, fill = C.code) {
    card(s, x, y, w, h, fill);
    numCircle(s, n, x + 0.15, y + 0.15, 0.4, C.green);
    text(s, title, x + 0.65, y + 0.12, w - 0.8, 0.45, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
    text(s, body, x + 0.15, y + 0.65, w - 0.3, h - 0.75, { fontSize: 11.5, margin: 0, lsm: 1.15 });
  }
  // 引用条：左金色竖条 + 斜体大字
  function quote(s, str, x, y, w, h, fs = 14) {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.07, h, fill: { color: C.gold }, line: { type: "none" } });
    text(s, str, x + 0.2, y, w - 0.2, h, { fontSize: fs, italic: true, color: C.dark, valign: "middle", margin: 0, lsm: 1.2 });
  }
  // 节点（拓扑图用）
  function node(s, label, x, y, w, h, fill = C.mint, fs = 10) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: C.green, width: 1 } });
    text(s, label, x, y, w, h, { fontSize: fs, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0.02, lsm: 1.0 });
  }
  function link(s, x1, y1, x2, y2, o = {}) {
    s.addShape(pres.shapes.LINE, {
      x: x1, y: y1, w: x2 - x1, h: y2 - y1,
      line: { color: o.color || C.green, width: o.width || 1.5, dashType: o.dash ? "dash" : "solid", endArrowType: o.arrow ? "triangle" : undefined },
    });
  }

  // =====================================================================
  // 1. 封面
  titleSlide({
    kicker: "数据结构与算法 · 2026 Fall · 课堂分享",
    title: "用 Agent 快速做科研",
    subtitle: "我最近怎么为一篇 A 类会议论文做准备",
    topics: "积累：GitHub 仓库 → 匹配：CCF 会议 + Agent 查新 → 选 Agent\n资源：闭源 API + 开源模型 GPU → 基础设施：Tailscale · CLab · 中转\n指导：status · thinking · 日志 → 合作：找发过 A 类的人 → 预印本 arXiv\n平时：帮人、维护圈子、积累简历 · 为什么还要学数据结构",
    footer: "Compiled by Hongfei Yan · 2026-11-09 课堂录音整理",
  });

  // 2. 三个问题
  {
    const s = content("?", "开场", "这一讲回答三个问题");
    const qs = [
      ["题目从哪来？", "Agent 很强，但差**最后一公里——想法**。\n想法来自平时 GitHub 上一个个仓库的积累，再让 Agent 和会议主题做**匹配、查新**。"],
      ["实验靠什么跑？", "**订阅的闭源大模型** + 自己能拿到的 **GPU** 跑开源模型。\n机器、网络、服务，都是平时一点点搭、一点点「帮人」换来的。"],
      ["人在里面做什么？", "盯进度、看 thinking、在它犯蠢时**点拨一下**；\n再去找**发过 A 类的人**讨论。——这也是为什么还要学数据结构。"],
    ];
    qs.forEach(([t, b], i) => stepCard(s, i + 1, t, b, 0.5 + i * 3.05, 1.1, 2.9, 2.6));
    pill(s, "积累 × 匹配 × 资源 × 指导 × 合作", 1.5, 4.25, 7, 0.55, C.dark, C.gold, 15);
  }

  // 3. 许愿式编程
  {
    const s = content("0", "为什么讲这个", "现在是「许愿式编程」");
    quote(s, "我虽然在教大家算法和编程，但其实我自己已经很少编程了——因为 Agent 很好用。只要有想法，就去开仓库。", 0.5, 1.1, 9, 0.95, 15);
    bullets(s, [
      "大家都是研究生，对发文章肯定感兴趣：我把**最近几天正在做的事**原样讲一遍——从零为 **CCF A 类会议 ACL** 准备一篇投稿。",
      "「**基本上不需要导师了**」——夸张的说法；意思是：有想法、有资源，大部分体力活和很多脑力活都能交给 Agent。",
      "但后面会看到：**想法、资源、判断、合作**，仍然要靠人。",
    ], 0.5, 2.3, 9, 2.5, { fontSize: 14, gap: 10 });
  }

  // =====================================================================
  sectionSlide("PART 1", "找题目", "积累仓库 → 选会议 → 让 Agent 匹配与查新");

  // 5. GitHub
  {
    const s = content("1", "第一步 · 积累", "有想法就在 GitHub 开一个仓库");
    bullets(s, [
      "往里「灌」东西：**工程项目**、以前随手试的**想法**、甚至**小游戏**——五花八门都行。",
      "**public**：所有人可见；**private**：只有自己。**投稿前的工作一定开 private。**",
      "本地丢了，GitHub 上还在。",
      "日积月累，仓库越来越多——这就是后面「找题目」的**原料**。",
    ], 0.5, 1.1, 5.2, 3.9, { fontSize: 13, gap: 9 });
    callout(s, "让仓库变多：Collaborator", [
      "private 仓库可加合作者的 GitHub 账号——**合作的起点**（这次把学生加进了论文仓库）。",
      "本科课程大作业做不下去？让同学**把我加成 collaborator**，我用最好的 Agent 帮他做。最近又多了 3 个仓库。",
      "不见得马上有用，但**说不定什么时候就有用了**。",
    ], 5.95, 1.1, 3.55, 3.0, { fill: C.mint, tcolor: C.dark, fontSize: 11, gap: 6 });
  }

  // 6. 选会议
  {
    const s = content("2", "第二步 · 匹配", "选会议：看 CCF 推荐列表");
    table(s, [
      ["要点", "说明"],
      ["CCF 推荐列表", "每年发布（2026 版）；分 A / B / C 类"],
      ["毕业要求", "博士生通常要求**至少两篇 A 类**"],
      ["为什么投会议", "审稿周期比期刊短，适合「快速做科研」"],
      ["例：ACL", "自然语言处理（语料相关）方向的 A 类会议，截稿约在 **1 月初**"],
      ["时间", "现在是 11 月——**还来得及**"],
    ], 0.5, 1.1, 9, [2.2, 6.8], { fontSize: 12.5, rowH: 0.42 });
    callout(s, "难点：有时间，但没想法", "Agent 现在特别强，但**差最后一公里：想法从哪来？**——「看起来挺好，想试试，但没想法，就不知道怎么办。」", 0.5, 3.85, 9, 1.15, { fill: "FDF0EE", tcolor: C.bad, fontSize: 12.5 });
  }

  // 7. Agent 做 match
  {
    const s = content("2", "第二步 · 匹配", "把 GitHub 权限交给 Agent：「我想投这个会，能投什么？」");
    const steps = [
      ["扫仓库", "把我**所有仓库**扫一遍：做过哪些项目、手头有哪些**数据集**。"],
      ["做 match", "和会议的**征稿主题**逐一匹配，提出能投的 **topic**。"],
      ["查新", "做相关工作调研：这个想法**是否已有人做完**？A 类要 **novelty**。"],
    ];
    steps.forEach(([t, b], i) => {
      stepCard(s, i + 1, t, b, 0.5 + i * 3.05, 1.1, 2.75, 1.75);
      if (i < 2) link(s, 3.27 + i * 3.05, 1.97, 3.53 + i * 3.05, 1.97, { arrow: true, width: 2 });
    });
    callout(s, "结论", "「还可以做；你手头**恰好有这份语料**，别人好像还没有。」——这三步过去是博士生最累的活（读前沿文献、做 survey），现在交给 Agent。", 0.5, 3.1, 5.4, 1.9, { fill: C.mint, tcolor: C.dark, fontSize: 12 });
    callout(s, "注意：topic 附带前提条件", "它定的 topic 下面列了很多**条件**：先做一批实验，确认都成立才值得投；不成立就投不了。\n所以这几天（正好大家考期中）我一直在**跑实验**。", 6.1, 3.1, 3.4, 1.9, { fontSize: 11 });
  }

  // 8. 选 Agent
  {
    const s = content("3", "第三步 · 工具", "选 Agent：能用第一档就用第一档");
    table(s, [
      ["档位", "工具", "体验"],
      [{ t: "第一档", bold: true, color: C.ok }, "Anthropic **Claude**（Claude Code）", "公认最聪明：「整个学院的老师加起来也赶不上」；国内不在服务地区，要有合规途径；订阅约 200 美元/月"],
      [{ t: "第二档", bold: true, color: C.goldText }, "OpenAI **Codex**", "相对好获得；与第一档差距明显"],
      [{ t: "第三档", bold: true, color: C.bad }, "国产：学校的 **Qoder**（Kimi / GLM / DeepSeek 等）、DeepSeek", "能用但很累：经常做错，要用前面的模型 review 再改；「不指导你，还经常添乱」"],
    ], 0.5, 1.1, 9, [1.0, 2.8, 5.2], { fontSize: 11.5, rowH: 0.62 });
    callout(s, "Top 1 的 Agent 其实在「指导」你", "回答完一个问题，它会**建设性地提几条后续建议**；你从中选、不停地追下去——这就是指导。", 0.5, 3.75, 4.4, 1.25, { fill: C.mint, tcolor: C.dark, fontSize: 11.5 });
    callout(s, "我的组合", "Claude（主力）+ Codex（同学合租分摊）+ 学校 Qoder（备用：每月 3000 credits，**用不到 1/3 可能被收回**）。", 5.1, 3.75, 4.4, 1.25, { fontSize: 11.5 });
  }

  // =====================================================================
  sectionSlide("PART 2", "跑实验", "闭源 API + 开源模型 GPU · 把手头的机器连成网");

  // 10. 两类模型
  {
    const s = content("4", "第四步 · 资源", "顶会实验：两类模型都要跑");
    stepCard(s, "A", "闭源模型（订阅 / API）", "当前最好、大家都在用的模型。\n投顶会，**肯定要用付费模型跑**。", 0.5, 1.1, 4.35, 1.6);
    stepCard(s, "B", "开源模型（要 GPU）", "顶会对实验要求高：**数据集多、角度多、模型多**。\n开源模型要 GPU——学生最大的门槛。", 5.15, 1.1, 4.35, 1.6);
    callout(s, "Apple 统一内存能顶上吗？", [
      "能迁：让 Agent 把任务搬到 64 GB 的 Mac Studio / 128 GB 的 MacBook Pro。",
      "但它估算：4090D 上 **1–2 小时**的小任务，Mac 上要 **1–3 天**。",
      "**有 N 卡还是用 N 卡。**",
    ], 0.5, 2.95, 9, 1.6, { fontSize: 13, gap: 6 });
  }

  // 11. GPU 怎么来的
  {
    const s = content("4", "第四步 · 资源", "GPU 是怎么来的：平时帮人");
    const st = [
      ["7 月", "一位老师有台多卡机器没地方放，我帮他找了地方——然后忘了要账号。"],
      ["最近", "机房路由器坏了，他的学生找来：机器出不了网，也想赶 ACL。"],
      ["借网卡", "我有块闲置两年的 Netgear 无线网卡；Linux 没驱动，同学下源码编译，**当晚弄通**。"],
      ["要账号", "**5 × 4090D，每块 48 GB**；1 块满载会宕，用另外 4 块。"],
    ];
    st.forEach(([t, b], i) => {
      const y = 1.1 + i * 0.8;
      numCircle(s, i + 1, 0.5, y + 0.12, 0.42, C.green);
      text(s, t, 1.05, y, 1.0, 0.66, { fontSize: 13, bold: true, color: C.dark, valign: "middle", margin: 0 });
      text(s, b, 2.05, y, 4.2, 0.66, { fontSize: 11.5, valign: "middle", margin: 0 });
    });
    quote(s, "大家平时能帮忙就尽量帮一下，说不定什么时候就有反馈了。", 6.55, 1.15, 2.95, 1.4, 13);
    callout(s, "机会来了", "目标（ACL）✓\n想法（Agent 匹配）✓\n资源（4 块卡）✓", 6.55, 2.8, 2.95, 1.6, { fill: C.mint, tcolor: C.dark, fontSize: 12.5 });
  }

  // 12. 共享资源分寸
  {
    const s = content("4", "第四步 · 资源", "共享 GPU 的分寸：不跟人抢，用人家 idle 的时候");
    bullets(s, [
      "那台机器别人权限比我高：有天早上 9 点多，**4 块卡全被占**，我的任务跑不了。",
      "等了三小时，发现对方只是起了个 **DeepSeek 推理服务**把卡占住，实际没在算。",
      "写信问了一下——对方确实没跑任务，就撤了下来。",
      "之后：**抓紧在人家 idle 的时候跑**。",
    ], 0.5, 1.1, 5.4, 3.9, { fontSize: 13, gap: 10 });
    callout(s, "原则", ["**不能跟人抢**：公共资源先到先用，别人优先。", "发现**占而不用**，礼貌地问一句。", "把坏卡等问题**告诉管理员**。"], 6.15, 1.1, 3.35, 2.4, { fill: C.mint, tcolor: C.dark, fontSize: 12, gap: 8 });
  }

  // 13. 拓扑图
  {
    const s = content("5", "第五步 · 基础设施", "用 Tailscale 把手头的机器连成一张网");
    const ns = [
      ["美国同学家的机器\n（主力 Agent）", 0.5, 1.0],
      ["成都腾讯云\n（国内中转）", 4.0, 1.0],
      ["北大 CLab 虚拟机\n（Canvas 等服务）", 7.5, 1.0],
      ["办公室 Mac Studio\n（24h 不关）", 0.5, 2.4],
      ["Windows 机\n（24h 不关）", 7.5, 2.4],
      ["课堂 MacBook\n（16 GB）", 0.5, 3.8],
      ["128 GB MacBook Pro", 4.0, 3.8],
      ["同事 / 朋友 / 家人\n的机器", 7.5, 3.8],
    ];
    ns.forEach(([l, x, y]) => link(s, x + 1.0, y + 0.37, 5.0, 2.77, { color: C.muted, width: 1.25 }));
    ns.forEach(([l, x, y]) => node(s, l, x, y, 2.0, 0.75, C.mint, 10.5));
    node(s, "Tailscale\n虚拟内网", 4.0, 2.4, 2.0, 0.75, C.gold, 12.5);
    text(s, "能帮别人就帮：同事机器出问题，就让他加入我的 Tailscale，帮他调好。", 0.5, 4.75, 9, 0.35, { fontSize: 11, color: C.muted, align: "center", margin: 0 });
  }

  // 14. CLab
  {
    const s = content("5", "第五步 · 基础设施", "免费的校内云：北大 CLab");
    table(s, [
      ["项目", "说明"],
      ["是什么", "北大 Linux 俱乐部做、计算中心支持；**凡有校园 ID 都免费给一台云虚拟机**"],
      ["默认配置", "约 4 GB 内存、100 GB SSD"],
      ["老师可申请更多", "读手册 / README 发现的；申请后：**32 GB 内存 + 额外 500 GB SSD**"],
      ["跑了什么", "本课程的 **Canvas 教学系统**、评测题库等——稳定，不用自己维护"],
    ], 0.5, 1.1, 9, [2.0, 7.0], { fontSize: 12, rowH: 0.45 });
    callout(s, "为什么要自己搭教学系统", "新学院还没有教学管理系统；作业发邮箱**不可靠**（学校邮箱会把部分邮件当垃圾邮件），也没法逐个下载批改。", 0.5, 3.6, 4.4, 1.4, { fontSize: 11.5 });
    callout(s, "域名也靠合作", "自己申请有周期、每年交钱；请一位熟悉的老师在他的顶级域名下给我加了几个子域名。**不要单打独斗。**", 5.1, 3.6, 4.4, 1.4, { fill: C.mint, tcolor: C.dark, fontSize: 11.5 });
  }

  // 15. 路径问题（图）
  {
    const s = content("5", "第五步 · 基础设施", "开学初访问 Canvas 为什么慢？——一个「图上的路径」问题");
    // 慢路径
    text(s, "之前：Tailscale 默认路径绕到国外中继", 0.5, 1.05, 4.4, 0.3, { fontSize: 12, bold: true, color: C.bad, margin: 0 });
    node(s, "校外同学", 0.6, 1.55, 1.2, 0.6, C.code);
    node(s, "国外中继", 2.1, 2.45, 1.2, 0.6, "F6D5D0");
    node(s, "CLab\n（校内）", 3.6, 1.55, 1.2, 0.6, C.mint);
    link(s, 1.4, 2.15, 2.45, 2.45, { color: C.bad, width: 2, arrow: true });
    link(s, 2.95, 2.45, 4.0, 2.15, { color: C.bad, width: 2, arrow: true });
    // 快路径
    text(s, "之后：加一台国内小云服务器做中转", 5.15, 1.05, 4.4, 0.3, { fontSize: 12, bold: true, color: C.ok, margin: 0 });
    node(s, "校外同学", 5.25, 1.55, 1.2, 0.6, C.code);
    node(s, "成都腾讯云", 6.75, 2.45, 1.2, 0.6, "BFE3CF");
    node(s, "CLab\n（校内）", 8.25, 1.55, 1.2, 0.6, C.mint);
    link(s, 6.05, 2.15, 7.1, 2.45, { color: C.ok, width: 2, arrow: true });
    link(s, 7.6, 2.45, 8.65, 2.15, { color: C.ok, width: 2, arrow: true });
    bullets(s, [
      "两点要通信，先得找一条**可达路径**——第 7 章「图」讲的就是这个；路径选错了，「能通」但很慢。",
      "中转机：腾讯云成都 **2 核 2 GB、40 GB**，约 **168 元/年**（早付一天，没赶上双十一 99 元）。",
      "它**只转发**，服务不在它上面，所以配置可以很低。",
    ], 0.5, 3.35, 9, 1.7, { fontSize: 12.5, gap: 6 });
  }

  // 16. 24 小时
  {
    const s = content("5", "第五步 · 基础设施", "让 Agent 24 小时跑：不关机的机器 + 断点续传");
    bullets(s, [
      "不关机的机器：办公室 Mac Studio、成都中转机、CLab、Windows 机、美国同学帮忙维护的机器。",
      "主力 Agent 所在的是同学家里一台**旧小主机**（二三十 GB 内存，加块旧机械硬盘凑到约 600 GB）；满载偶尔重启，一个月一两次。",
      "我做了**定时探活监控**，宕了就微信请他处理（有十二三小时时差）——很「费人情」。",
      "走到哪都带电脑：手机屏幕太小；电脑上一直开着一个 terminal 远程连着。",
    ], 0.5, 1.1, 5.6, 3.9, { fontSize: 12, gap: 8 });
    text(s, "重启了也不怕", 6.35, 1.1, 3.15, 0.3, { fontSize: 12, bold: true, color: C.dark, margin: 0 });
    consoleBlock(s, "$ claude\n> /resume\n  列出之前的 session\n  → 选一个继续\n\n相当于「断点续传」", 6.35, 1.5, 3.15, 2.1, 11);
    callout(s, "要点", "任务跑在**远端常开**的机器上，本地只是一个「窗口」。", 6.35, 3.8, 3.15, 1.2, { fill: C.mint, tcolor: C.dark, fontSize: 11.5 });
  }

  // =====================================================================
  sectionSlide("PART 3", "人做什么", "指导 Agent · 找人合作 · 预印本落地");

  // 18. status
  {
    const s = content("6", "第六步 · 指导", "并行任务一多，要常去敲一句 status");
    consoleBlock(s, "> status\n  GPU0  任务 A   预计还要 ~7 h\n  GPU1  任务 B   预计 15:30 完成\n  GPU2  3 个模型  第二节课能跑完\n  API   某闭源模型  已停止：本周额度用完\n\n> gpu idle?", 0.5, 1.1, 4.6, 2.5, 11);
    text(s, "（示意：根据课堂演示整理）", 0.5, 3.65, 4.6, 0.25, { fontSize: 9, color: C.muted, margin: 0 });
    bullets(s, [
      "**不进去看，根本不知道一个模型已经停工**：昨天 Codex 合租那边本周额度用完，要等今天 4:50 自动重置。",
      "公共 GPU 空了，Agent **不会自己随便起新任务**——这是对的。所以：醒着时把任务布满；早上醒来发现卡闲了，让它赶紧找任务。",
      "它会预估完成时间：3 点多的飞机，在机场还能看一眼；飞机上就管不了了。",
    ], 5.35, 1.1, 4.15, 3.9, { fontSize: 11.5, gap: 8 });
    callout(s, "输入不必讲究", "远程切中文输入法麻烦，就**直接蹦英文单词**；拼错几个字母也懂——但别打拼音。", 0.5, 3.95, 4.6, 1.05, { fontSize: 11 });
  }

  // 19. 上下文与日志
  {
    const s = content("6", "第六步 · 指导", "它怎么扛住这么多任务：内存放不下，就放外存");
    const items = [
      ["上下文窗口有限", "订阅里最大的约 **1M token**；并行任务一多就装满。", C.code],
      ["内容污染", "它能读到我 GitHub 上**所有项目**，容易串。", "FDF0EE"],
      ["每个任务一个日志", "看 thinking 发现：每个任务写独立的 **log 文件**，需要时再读。", C.mint],
    ];
    items.forEach(([t, b, f], i) => {
      card(s, 0.5 + i * 3.05, 1.1, 2.85, 1.55, f);
      text(s, t, 0.65 + i * 3.05, 1.2, 2.55, 0.4, { fontSize: 13.5, bold: true, color: C.dark, margin: 0 });
      text(s, b, 0.65 + i * 3.05, 1.65, 2.55, 1.15, { fontSize: 11.5, margin: 0, lsm: 1.15 });
    });
    callout(s, "这就是数据结构", "主存（上下文）放不下 → 放外存（日志文件）→ 按需读取：**外排序**、**索引**（第 9、11 章）的思路。", 0.5, 2.85, 9, 0.95, { fill: C.cream, fontSize: 12.5 });
    callout(s, "随手记录，积累素材", "Agent 最后只给一个 summary，中间过程你可能不知道。看到有价值的输出，**随手丢进微信文件传输**——以后有新想法时回去翻。", 0.5, 3.95, 9, 1.15, { fill: C.mint, tcolor: C.dark, fontSize: 11.5 });
  }

  // 20. 看 thinking
  {
    const s = content("6", "第六步 · 指导", "看 thinking，在它犯蠢时点拨一下");
    quote(s, "我有时间时会盯着它的 thinking 过程——不只看最终结果。有时你会受启发；有时会发现它也很蠢，包括 Claude。这时需要你来点拨它一下。", 0.5, 1.1, 9, 1.25, 14.5);
    stepCard(s, 1, "Agent 做", "扫描、调研、写代码、跑实验、排版、翻译——**体力活和大量脑力活**。", 0.5, 2.65, 4.35, 1.5);
    stepCard(s, 2, "人来做", "给方向、看过程、判断对错、**点拨**；资源闲了来布置；去找人讨论。", 5.15, 2.65, 4.35, 1.5, C.mint);
    pill(s, "这是双方的配合——点拨靠的是你的基础知识", 1.5, 4.4, 7, 0.55, C.dark, C.gold, 14);
  }

  // 21. 找发过 A 类的人
  {
    const s = content("7", "第七步 · 合作", "没中过 A 类？找发过 A 类的人一起做");
    bullets(s, [
      "没中过 A 类，就**没有投稿经验**——找师兄师姐、导师，或任何发过 A 类的人。",
      "坦白说我自己也没以第一作者中过 A 类。这次找的是**我的一位硕士生**：",
    ], 0.5, 1.1, 5.5, 1.3, { fontSize: 12.5, gap: 7 });
    [["研一", "在计算中心当学生助理，接触到 GPU 和大模型"], ["研二", "出去实习，**目标明确：找能指导发论文的 mentor**"], ["研三", "投了一直被拒，今年才开始中，**一中就是两篇 A 类**（我们那博士两篇就能毕业）"]]
      .forEach(([t, b], i) => {
        pill(s, t, 0.8, 2.2 + i * 0.8, 0.8, 0.4, C.green, C.white, 11);
        text(s, b, 1.75, 2.1 + i * 0.8, 4.2, 0.6, { fontSize: 11.5, valign: "middle", margin: 0 });
      });
    callout(s, "讨论 → 再交给 Agent", [
      "把想法和 Agent 跑的东西都给他看，他给反馈。",
      "**看不懂的反馈？再交给 Agent**——它提出新实验，GPU 又有活干了。",
      "GPU 一直在跑，但有时**我也不知道让它跑什么**——这时就要和人讨论。",
    ], 6.2, 1.1, 3.3, 3.4, { fill: C.mint, tcolor: C.dark, fontSize: 11.5, gap: 7 });
  }

  // 22. arXiv
  {
    const s = content("8", "第八步 · 落地", "即使不中，至少落地一篇 arXiv 预印本");
    const st = [
      ["中英双份", "让 Agent 中英文各出一份；我看中文找问题，再让它改英文。"],
      ["标准模板", "会议、arXiv 都有标准格式——**让 Agent 排版**。"],
      ["找人背书", "第一次投 arXiv 要相关领域的人 **endorsement**；我 7 月中旬投，约一个月后才上线。"],
      ["持续迭代", "预印本可以不停改，差不多了再投正式会议。"],
    ];
    st.forEach(([t, b], i) => stepCard(s, i + 1, t, b, 0.5 + (i % 2) * 4.6, 1.1 + Math.floor(i / 2) * 1.55, 4.4, 1.4));
    pill(s, "ACL 2027：中了最好；不中也有一篇预印本 + GitHub 又多一个仓库，继续滚动", 0.5, 4.35, 9, 0.6, C.dark, C.gold, 13);
  }

  // =====================================================================
  sectionSlide("PART 4", "平时", "维护圈子 · 积累简历 · 学好基础");

  // 24. 圈子与简历
  {
    const s = content("9", "平时", "维护圈子、积累简历");
    callout(s, "圈子", [
      "**为人处事包容一点，能帮就帮**——合作者就多了。",
      "这次的 GPU、域名、arXiv 背书、Agent 的使用途径，**全是靠人**。",
      "锻炼身体：学校球馆 24 小时开放。",
      "关注学校门户：常挂**国际交流**项目，看不着就错过了。",
    ], 0.5, 1.1, 4.35, 3.3, { fill: C.mint, tcolor: C.dark, fontSize: 12.5, gap: 9 });
    callout(s, "简历", [
      "研究生阶段就是在积累简历——毕业时不能只有各科成绩。",
      "毕业两条路：**高校**当老师，或去**企业**（公司 / 国企）做研发。",
      "筛简历看**成绩**和**科研**：成绩过了 3.3 左右就差不多；**最被认的是文章**，没有就看实习。",
      "趣事：好几个同学在同一家公司实习——那是他们一位**绩点最低**的同学开的。",
    ], 5.15, 1.1, 4.35, 3.3, { fontSize: 12.5, gap: 9 });
  }

  // 25. 为什么学 DSA
  {
    const s = content("10", "回到这门课", "为什么还要学数据结构");
    table(s, [
      ["今天遇到的事", "背后的数据结构 / 算法", "章节"],
      ["Canvas 访问慢，加国内中转", "图上的**可达路径**与路径选择", "第 7 章 图"],
      ["上下文窗口装不下并行任务", "主存放不下 → **外存 + 日志**，按需读取", "第 9、11 章 外排序 · 索引"],
      ["多块 GPU、多个任务、预估完成时间", "**队列**与**调度**", "第 3 章 队列"],
      ["Agent 扫全部仓库做 match", "**检索**与**匹配**", "第 4、10 章 字符串 · 检索"],
    ], 0.5, 1.1, 9, [3.0, 3.2, 2.8], { fontSize: 12, rowH: 0.5 });
    quote(s, "Agent 很强，但你得给它一点指导。我们平时上课，就是在积累这些「点拨 Agent」用的基础知识。", 0.5, 4.0, 9, 0.95, 14);
  }

  // 26. 小结
  summarySlide("小结", [
    ["积累", "有想法就开 **GitHub 仓库**；投稿前用 private；靠 collaborator 合作。"],
    ["匹配", "CCF 列表选会议 → Agent **扫仓库 + match 主题 + 查新** → topic 与前置实验。"],
    ["资源", "最好的 Agent（Claude > Codex > 国产）；闭源 API + **开源模型 GPU**；帮人换机会。"],
    ["指导", "常看 `status`、看 thinking、点拨；资源闲了人来布置；随手记录。"],
    ["合作", "找**发过 A 类**的人讨论；**预印本**先落地；维护圈子、积累简历。"],
  ]);

  await D.save(OUT);
})().catch((e) => { console.error(e); process.exit(1); });
