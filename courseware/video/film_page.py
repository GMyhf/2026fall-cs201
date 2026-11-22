#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成课件讲解视频的网页播放页（视频 + 逐句字幕 + 按页跳转目录）。

用法:
    python3 film_page.py 07 OUTDIR
    python3 film_page.py --index OUTDIR   # 各章目录页（OUTDIR 为 slides/ 根）
OUTDIR 下生成 index.html 与 chNN.vtt；视频 chNN.mp4（即 chNN-preview.mp4）另行拷入。
1080p 成品只放 GitHub Release（页面链过去），infomall 不再提供。
线上位置：https://infomall.zhengmao.ltd/cs201-anim/slides/chNN/（中转机 /srv/cs201-anim/slides/chNN/）
"""
import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TITLES = {'01': '第一章 ADT 与复杂度', '02': '第二章 线性表', '03': '第三章 栈与队列',
          '04': '第四章 字符串', '05': '第五章 二叉树', '06': '第六章 树',
          '07': '第七章 图', '08': '第八章 内部排序', '09': '第九章 文件管理与外部排序',
          '10': '第十章 检索', '11': '第十一章 索引技术', '12': '第十二章 高级数据结构'}
RELEASE = 'https://github.com/GMyhf/2026fall-cs201/releases/tag/slides-film-2026fall'


def to_sec(t):
    parts = [int(x) for x in t.split(':')]
    s = 0
    for p in parts:
        s = s * 60 + p
    return s


def index_page(out):
    """slides/ 根目录：列出已有时间轴的各章。"""
    rows = []
    for tlp in sorted(HERE.glob('ch*.timeline.json')):
        ch = tlp.name[2:4]
        tl = json.loads(tlp.read_text(encoding='utf-8'))
        rows.append(f'<li><a href="ch{ch}/">{TITLES.get(ch, ch)}</a>'
                    f'<span>{len(tl["sections"])} 页 · {tl["total"]}</span></li>')
    out.mkdir(parents=True, exist_ok=True)
    (out / 'index.html').write_text(f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>数据结构与算法 · 课件讲解视频</title>
<style>
body{{margin:0;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;background:#f4f5f2;color:#1f3a33}}
header{{padding:18px 24px;background:#1f3d35;color:#fff}} h1{{margin:0;font-size:22px}}
header p{{margin:6px 0 0;font-size:13px;opacity:.85}} header a{{color:#ffd88a}}
ul{{list-style:none;margin:20px auto;padding:0;max-width:720px}}
li{{display:flex;justify-content:space-between;background:#fff;margin:8px 0;padding:14px 18px;border-radius:6px;font-size:17px}}
li a{{color:#1f3d35;font-weight:600;text-decoration:none}} li span{{color:#888;font-size:14px}}
</style></head><body>
<header><h1>数据结构与算法 · 课件讲解视频</h1>
<p>课件逐页配音讲解，带逐句字幕，可按页跳转、倍速播放。1080p 成片见 <a href="{RELEASE}">GitHub Release</a>；
知识点动画见 <a href="../">算法动画系列</a>。</p></header>
<ul>
{chr(10).join(rows)}
</ul></body></html>
''', encoding='utf-8')
    print('生成', out / 'index.html')


def main():
    if sys.argv[1] == '--index':
        return index_page(Path(sys.argv[2]))
    ch, out = sys.argv[1].zfill(2), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    tl = json.loads((HERE / f'ch{ch}.timeline.json').read_text(encoding='utf-8'))
    srt = (HERE / f'ch{ch}.srt').read_text(encoding='utf-8')
    vtt = 'WEBVTT\n\n' + re.sub(r'(\d\d:\d\d:\d\d),(\d\d\d)', r'\1.\2', srt)
    (out / f'ch{ch}.vtt').write_text(vtt, encoding='utf-8')
    title = TITLES.get(ch, f'第 {int(ch)} 章')
    items = '\n'.join(
        f'<li data-t="{to_sec(s["start"])}"><span class="t">{s["start"]}</span>'
        f'<span class="p">P{s["page"]}</span>{html.escape(s["title"])}</li>'
        for s in tl['sections'])
    page = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>数据结构与算法 · {title} · 课件讲解</title>
<style>
body{{margin:0;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;background:#f4f5f2;color:#1f3a33}}
header{{padding:14px 20px;background:#1f3d35;color:#fff}}
header h1{{margin:0;font-size:20px}} header p{{margin:4px 0 0;font-size:13px;opacity:.8}}
main{{display:flex;gap:16px;padding:16px;align-items:flex-start}}
.v{{flex:1;min-width:0}} video{{width:100%;background:#000;border-radius:6px}}
.ctl{{margin-top:8px;font-size:14px}} .ctl button{{margin-right:4px;padding:3px 9px;border:1px solid #9bb;border-radius:4px;background:#fff;cursor:pointer}}
.ctl button.on{{background:#1f3d35;color:#fff}}
ol{{list-style:none;margin:0;padding:0;width:330px;max-height:calc(100vh - 110px);overflow:auto;background:#fff;border-radius:6px;font-size:14px}}
li{{padding:6px 10px;border-bottom:1px solid #eee;cursor:pointer}} li:hover{{background:#eef4f1}}
li.cur{{background:#fff4d6;font-weight:600}}
.t{{color:#888;margin-right:6px;font-variant-numeric:tabular-nums}} .p{{color:#2d6b5a;margin-right:6px}}
@media(max-width:900px){{main{{flex-direction:column}} ol{{width:100%;max-height:50vh}}
</style></head><body>
<header><h1>数据结构与算法 · {title} · 课件讲解</h1>
<p><a href="../" style="color:#ffd88a">← 各章目录</a>　{len(tl["sections"])} 页，总时长 {tl["total"]}，配音 {tl["voice"]}。点右侧目录跳到对应页；字幕可在播放器里开关。</p></header>
<main><div class="v">
<video id="v" controls preload="metadata" src="ch{ch}.mp4">
<track kind="subtitles" srclang="zh" label="中文" src="ch{ch}.vtt" default></video>
<div class="ctl">倍速：<span id="r"></span>　下载：<a href="ch{ch}.mp4" download="DSA_ch{ch}_720p.mp4">720p（约 72MB）</a> · <a href="{RELEASE}" target="_blank">1080p（GitHub Release）</a> · <a href="ch{ch}.vtt" download>字幕 VTT</a></div></div>
<ol id="toc">
{items}
</ol></main>
<script>
const v=document.getElementById('v'),lis=[...document.querySelectorAll('#toc li')];
lis.forEach(li=>li.onclick=()=>{{v.currentTime=+li.dataset.t;v.play()}});
v.ontimeupdate=()=>{{let k=0;lis.forEach((li,i)=>{{if(+li.dataset.t<=v.currentTime+0.2)k=i}});
 lis.forEach((li,i)=>li.classList.toggle('cur',i===k))}};
const r=document.getElementById('r');
[1,1.25,1.5,1.75,2].forEach(x=>{{const b=document.createElement('button');b.textContent=x+'×';
 b.onclick=()=>{{v.playbackRate=x;[...r.children].forEach(c=>c.classList.toggle('on',c===b))}};
 if(x===1)b.classList.add('on');r.appendChild(b)}});
</script></body></html>
'''
    (out / 'index.html').write_text(page, encoding='utf-8')
    print('生成', out / 'index.html')


if __name__ == '__main__':
    main()
