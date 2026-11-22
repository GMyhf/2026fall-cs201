#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成课件讲解视频的网页播放页（视频 + 逐句字幕 + 按页跳转目录）。

用法:
    python3 film_page.py 07 OUTDIR
OUTDIR 下生成 index.html 与 chNN.vtt；视频 chNN.mp4（即 chNN-preview.mp4）与
chNN-1080p.mp4（.videowork 里的成品）另行拷入。
线上位置：https://infomall.zhengmao.ltd/cs201-anim/slides/chNN/（中转机 /srv/cs201-anim/slides/chNN/）
"""
import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TITLES = {'07': '第七章 图'}


def to_sec(t):
    parts = [int(x) for x in t.split(':')]
    s = 0
    for p in parts:
        s = s * 60 + p
    return s


def main():
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
@media(max-width:900px){{main{{flex-direction:column}} ol{{width:100%;max-height:50vh}}}}
</style></head><body>
<header><h1>数据结构与算法 · {title} · 课件讲解</h1>
<p>{len(tl["sections"])} 页，总时长 {tl["total"]}，配音 {tl["voice"]}。点右侧目录跳到对应页；字幕可在播放器里开关。</p></header>
<main><div class="v">
<video id="v" controls preload="metadata" src="ch{ch}.mp4">
<track kind="subtitles" srclang="zh" label="中文" src="ch{ch}.vtt" default></video>
<div class="ctl">倍速：<span id="r"></span>　下载：<a href="ch{ch}.mp4" download="DSA_ch{ch}_720p.mp4">720p（约 72MB）</a> · <a href="ch{ch}-1080p.mp4" download="DSA_ch{ch}_1080p.mp4">1080p（约 195MB）</a> · <a href="ch{ch}.vtt" download>字幕 VTT</a></div></div>
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
