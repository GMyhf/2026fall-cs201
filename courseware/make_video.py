#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把章节课件 + 逐页朗读讲稿合成为带解说的讲解视频（film）。

用法（在 Mac Studio 上跑，见文末「环境」）:
    python3 make_video.py 07                # 合成第 7 章
    python3 make_video.py 07 --audio-only   # 只跑 TTS，看总时长
    python3 make_video.py 07 --check        # 只校验产物是否与课件、讲稿同版
    python3 make_video.py 07 --preview      # 从成品转一份 720p 轻量版（入库的是这一份）

流程沿用 2026fall-cs101/courseware/make_video.py：
画面**从当前 .pptx 现导**（LibreOffice → PDF → PNG），旁白来自
video/chNN_narration.md，一节对应一页；Edge TTS 逐页合成，句级时间戳拼成字幕。

产物:
    .videowork/chNN/<课件名>.mp4    成品 1080p（体积大，不入库；上传到 GitHub Release
                                   slides-film-2026fall，文件名 <课件名>_1080p.mp4）
    video/chNN-preview.mp4         轻量版 720p 单声道（入库）
    video/chNN.srt                 逐句字幕
    video/chNN.timeline.json       每页时间轴 + 课件、讲稿两个来源的摘要
    video/chNN_narration.md        文末「时间控制表」按实测时长重写

环境:
    课件字体是 Microsoft YaHei，Mac 系统里没有，LibreOffice 会把中文全部丢掉。
    这里用一个临时 LibreOffice 配置目录（.videowork/lo_profile），把 PowerPoint
    自带的 msyh*.ttc 放进它的 user/fonts，不改系统字体。
    需要 python-pptx 与 edge-tts：Studio 上直接用 cs101 的虚拟环境
        ~/git/2026fall-cs101/.venv/bin/python make_video.py 07
    以及 /opt/homebrew/bin 下的 soffice、pdftoppm、ffmpeg。

环境变量:
    TTS_VOICE   默认 zh-CN-YunyangNeural
    TTS_RATE    默认 +0%
    VIDEO_WORK  中间产物目录，默认 courseware/.videowork（已 gitignore）

⚠️ 语音按**朗读文本的哈希**缓存：讲稿改了哪一页，只重新合成那一页。
"""

import argparse
import hashlib
import io
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
WORK = Path(os.environ.get('VIDEO_WORK', HERE / '.videowork'))
VOICE = os.environ.get('TTS_VOICE', 'zh-CN-YunyangNeural')
RATE = os.environ.get('TTS_RATE', '+0%')

HEAD = 0.4       # 每页开始前的静默
TAIL = 1.0       # 每页读完后的留白
BG = '0xFFFFFF'  # 画面补边色

SECTION = re.compile(r'^## P(\d+)｜(.+?)\s*$', re.M)
TIMETABLE_HEAD = '## 附：时间控制表'
FONT_DIRS = [Path('/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts')]
FONT_GLOB = 'msyh*.ttc'

for p in ('/opt/homebrew/bin', '/usr/local/bin'):
    if p not in os.environ.get('PATH', '').split(os.pathsep) and Path(p).is_dir():
        os.environ['PATH'] = p + os.pathsep + os.environ.get('PATH', '')
EDGE_TTS = shutil.which('edge-tts') or str(Path(sys.executable).parent / 'edge-tts')


# ---------------------------------------------------------------- 小工具
def run(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, **kw)
    if r.returncode != 0:
        sys.exit('FAILED: %s\n%s' % (' '.join(map(str, cmd)),
                                     r.stderr.decode('utf-8', 'replace')[-2000:]))
    return r.stdout.decode('utf-8', 'replace')


def find_pptx(ch):
    hits = sorted(HERE.glob(f'2026*_DSA_{ch}_*.pptx'))
    if len(hits) != 1:
        sys.exit(f'第 {ch} 章课件应恰好一份，找到 {len(hits)} 份：{[h.name for h in hits]}')
    return hits[0]


def pptx_digest(path):
    """课件**画面内容**的摘要，不是文件字节的摘要（pptx 的 zip 里带时间戳，
    同一份内容重建两次字节就不同）。取每页每个形状的位置尺寸、文字与字号、
    表格逐格文字，以及图片的内容哈希。"""
    from pptx import Presentation
    h = hashlib.sha256()
    for slide in Presentation(str(path)).slides:
        h.update(b'\x00slide')
        for shape in slide.shapes:
            h.update(('|%s,%s,%s,%s,%s' % (shape.shape_type, shape.left, shape.top,
                                           shape.width, shape.height)).encode())
            if shape.shape_type == 13:            # PICTURE
                h.update(shape.image.blob)
            frames = []
            if shape.has_text_frame:
                frames.append(shape.text_frame)
            elif getattr(shape, 'has_table', False) and shape.has_table:
                frames += [c.text_frame for r in shape.table.rows for c in r.cells]
            for tf in frames:
                for para in tf.paragraphs:
                    for r in para.runs:
                        f = r.font
                        h.update(('|%s;%s;%s;%s' % (r.text, f.size, f.bold, f.name)).encode())
    return h.hexdigest()


def duration(path):
    return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                      '-of', 'default=nw=1:nk=1', path]).strip())


def fmt(seconds):
    s = int(round(seconds))
    return '%d:%02d:%02d' % (s // 3600, s // 60 % 60, s % 60) if s >= 3600 \
        else '%02d:%02d' % (s // 60, s % 60)


def srt_ts(seconds):
    ms = int(round(seconds * 1000))
    return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60,
                                    ms // 1000 % 60, ms % 1000)


def parse_srt_ts(s):
    hh, mm, rest = s.strip().split(':')
    ss, ms = rest.replace('.', ',').split(',')
    return int(hh) * 3600 + int(mm) * 60 + int(ss) + int(ms) / 1000


# ---------------------------------------------------------------- 讲稿
def narration_body(path):
    """讲稿里手写的那一半（时间控制表之前、不含表前分隔线），归一化成可重复的形状。"""
    body = io.open(path, encoding='utf-8').read().split(TIMETABLE_HEAD)[0]
    return re.sub(r'\n+-{3,}\s*$', '', body.rstrip()).rstrip()


def script_digest(path):
    return hashlib.sha256(narration_body(path).encode('utf-8')).hexdigest()


def parse_narration(path, expected_pages):
    parts = SECTION.split(narration_body(path))
    sections = []
    for i in range(1, len(parts), 3):
        page, title, body = int(parts[i]), parts[i + 1].strip(), parts[i + 2]
        lines = []
        for ln in body.split('\n'):
            ln = ln.strip()
            # 标题、引用、表格、列表、分隔线是给读者看的，不朗读
            if not ln or ln.startswith(('#', '>', '|', '-', '*', '<!--')):
                continue
            ln = re.sub(r'【[^】]*】', '', ln).replace('**', '')
            ln = re.sub(r'[ \t　]+', ' ', ln).strip()
            if ln:
                lines.append(ln)
        text = ''.join(lines)
        if not text:
            sys.exit(f'讲稿 P{page}「{title}」没有可朗读的正文')
        sections.append(dict(page=page, title=title, text=text))
    pages = [s['page'] for s in sections]
    if pages != list(range(1, len(pages) + 1)):
        sys.exit(f'讲稿的页号不是从 1 连续到 {len(pages)}：{pages}')
    if len(sections) != expected_pages:
        sys.exit(f'讲稿 {len(sections)} 节，课件 {expected_pages} 页 —— 一页一节，对不上')
    return sections


TTS_REPLACE = [('——', '，'), ('—', '，'), ('…', '。'), ('「', ''), ('」', ''),
               ('《', ''), ('》', ''), ('·', ' '), ('→', '到'), ('≠', '不等于'),
               ('≤', '小于等于'), ('≥', '大于等于'), ('∞', '无穷大'),
               ('Ω', '欧米伽'), ('Θ', '希塔'), ('_', ' ')]


def norm_for_tts(text):
    for a, b in TTS_REPLACE:
        text = text.replace(a, b)
    return text


# ---------------------------------------------------------------- 语音
def synth(sections, audio_dir):
    audio_dir.mkdir(parents=True, exist_ok=True)
    meta = []
    for s in sections:
        pid = '%02d' % s['page']
        spoken = norm_for_tts(s['text'])
        key = hashlib.sha256(('%s|%s|%s' % (VOICE, RATE, spoken)).encode('utf-8')).hexdigest()[:16]
        mp3, sub = audio_dir / f'n-{pid}-{key}.mp3', audio_dir / f'n-{pid}-{key}.srt'
        mark = ''
        if not tts_complete(mp3, sub, spoken):
            for stale in audio_dir.glob(f'n-{pid}-*'):
                stale.unlink()
            for attempt in range(5):
                # Edge TTS 偶尔连接挂住不退出（实测卡过 20 分钟），必须设超时
                try:
                    r = subprocess.run([EDGE_TTS, '--voice', VOICE, '--rate', RATE,
                                        '--text', spoken, '--write-media', str(mp3),
                                        '--write-subtitles', str(sub)],
                                       capture_output=True, timeout=90)
                except subprocess.TimeoutExpired:
                    r = None
                if r is not None and r.returncode == 0 and tts_complete(mp3, sub, spoken):
                    break
                print(f'P{pid} TTS 第 {attempt + 1} 次失败，重试')
            else:
                sys.exit(f'P{pid} TTS 连续失败')
            mark = ' 新'
        d = duration(mp3)
        meta.append(dict(page=s['page'], title=s['title'], chars=len(s['text']),
                         speech=d, clip=HEAD + d + TAIL, audio=str(mp3), subs=str(sub)))
        print('P%s %-24s %4d字  语音%6.1fs%s' % (pid, s['title'][:24], len(s['text']), d, mark))
    return meta


def _plain(text):
    return re.sub(r'[\W_]+', '', text)


def tts_complete(mp3, sub, spoken):
    """Edge TTS 会断流却照常退出，音频和字幕一起停在半句（实测 353 字只读出 42 秒）。
    只比「音频时长 ≥ 字幕末句」查不出来，必须核对字幕文字覆盖了整段朗读文本。"""
    if not (mp3.exists() and sub.exists() and mp3.stat().st_size > 0):
        return False
    cues = read_cues(sub)
    if not cues or duration(mp3) + 0.5 < cues[-1][1]:
        return False
    got, want = _plain(''.join(c[2] for c in cues)), _plain(spoken)
    return len(got) >= 0.97 * len(want) and got[-8:] == want[-8:]


def read_cues(path):
    """读 edge-tts 写出的句级 srt：[(start, end, text), ...]"""
    cues = []
    for block in re.split(r'\n\s*\n', path.read_text(encoding='utf-8').strip()):
        ls = block.strip().split('\n')
        if len(ls) >= 3 and '-->' in ls[1]:
            a, b = ls[1].split('-->')
            cues.append((parse_srt_ts(a), parse_srt_ts(b), ''.join(ls[2:]).strip()))
    return cues


# ---------------------------------------------------------------- 画面
def lo_profile():
    prof = WORK / 'lo_profile'
    fonts = prof / 'user' / 'fonts'
    fonts.mkdir(parents=True, exist_ok=True)
    if not list(fonts.glob(FONT_GLOB)):
        for d in FONT_DIRS:
            for f in d.glob(FONT_GLOB):
                shutil.copy(f, fonts)
    if not list(fonts.glob(FONT_GLOB)):
        sys.exit('找不到 Microsoft YaHei（msyh*.ttc），导出的画面会丢中文')
    return prof


def export_frames(pptx, outdir):
    """从当前 pptx 现导逐页 PNG；课件没变就复用。"""
    digest = pptx_digest(pptx)
    stamp = outdir / 'source.sha256'
    pngs = sorted(outdir.glob('slide-*.png'))
    if stamp.exists() and stamp.read_text().strip() == digest and pngs:
        print('画面：复用已导出的 %d 页（课件未变）' % len(pngs))
        return digest, len(pngs)
    shutil.rmtree(outdir, ignore_errors=True)
    outdir.mkdir(parents=True, exist_ok=True)
    print('画面：从当前课件导出中 …')
    run(['soffice', '-env:UserInstallation=' + lo_profile().resolve().as_uri(),
         '--headless', '--convert-to', 'pdf', '--outdir', outdir, pptx])
    pdfs = list(outdir.glob('*.pdf'))
    if not pdfs:
        sys.exit('LibreOffice 转换失败，导不出画面')
    fonts = run(['pdffonts', pdfs[0]])
    if 'YaHei' not in fonts:
        sys.exit('导出的 PDF 里没有嵌入 Microsoft YaHei，中文会丢字')
    run(['pdftoppm', '-r', '144', '-png', pdfs[0], outdir / 'slide'])
    stamp.write_text(digest)
    n = len(list(outdir.glob('slide-*.png')))
    print('画面：导出 %d 页，来源摘要 %s' % (n, digest[:12]))
    return digest, n


# ---------------------------------------------------------------- 合成
def build_clips(meta, frames, clips):
    clips.mkdir(parents=True, exist_ok=True)
    paths = []
    for m in meta:
        pid = '%02d' % m['page']
        clip = clips / f'c-{pid}-{Path(m["audio"]).stem.split("-")[-1]}.mp4'
        src = frames / f'slide-{pid}.png'
        stamp = clips / f'c-{pid}.src'
        sig = '%s|%s' % (src.stat().st_mtime_ns, clip.name)
        if not (clip.exists() and stamp.exists() and stamp.read_text() == sig):
            for stale in clips.glob(f'c-{pid}-*.mp4'):
                stale.unlink()
            run(['ffmpeg', '-y', '-loop', '1', '-framerate', '30', '-i', src, '-i', m['audio'],
                 '-filter_complex',
                 '[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,'
                 f'pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color={BG},setsar=1[v];'
                 '[1:a]adelay=%d|%d,apad=whole_dur=%.3f,aresample=48000[a]'
                 % (int(HEAD * 1000), int(HEAD * 1000), m['clip']),
                 '-map', '[v]', '-map', '[a]', '-t', '%.3f' % m['clip'],
                 '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-tune', 'stillimage',
                 '-pix_fmt', 'yuv420p',
                 '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k', clip])
            stamp.write_text(sig)
        paths.append(clip)
    print('片段：%d 段就绪' % len(paths))
    return paths


def concat(paths, out):
    lst = WORK / 'concat.txt'
    lst.write_text('\n'.join("file '%s'" % p for p in paths) + '\n', encoding='utf-8')
    # 响度归一化：TTS 原始输出偏轻，教室放映听不清
    run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', lst,
         '-c:v', 'libx264', '-profile:v', 'high', '-level:v', '4.0', '-tune', 'stillimage',
         '-pix_fmt', 'yuv420p', '-r', '30', '-fps_mode', 'cfr', '-crf', '23',
         '-video_track_timescale', '90000',
         '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
         '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k',
         '-movflags', '+faststart', out])


def make_preview(src, dst):
    """720p 单声道轻量版：成品太大，GitHub 单文件上限 100MB，入库与传阅都用这份。
    画面是静态幻灯片，10 fps 足够（第七章 1:44:19，30 fps 时 105.7MB 超限）。"""
    dst.parent.mkdir(parents=True, exist_ok=True)
    run(['ffmpeg', '-y', '-i', src, '-vf', 'scale=1280:720:flags=lanczos',
         '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-tune', 'stillimage',
         '-pix_fmt', 'yuv420p', '-r', '10', '-fps_mode', 'cfr', '-g', '300',
         '-c:a', 'aac', '-ar', '44100', '-ac', '1', '-b:a', '64k',
         '-movflags', '+faststart', dst])


# ---------------------------------------------------------------- 产出
def write_srt(meta, path):
    """逐句字幕：每页 edge-tts 的句级时间戳加上该页在全片中的起点。"""
    out, t, n = [], 0.0, 0
    for m in meta:
        for a, b, text in read_cues(Path(m['subs'])):
            n += 1
            out.append('%d\n%s --> %s\n%s\n' % (n, srt_ts(t + HEAD + a),
                                                srt_ts(t + HEAD + min(b, m['speech'])), text))
        t += m['clip']
    path.write_text('\n'.join(out), encoding='utf-8')


def write_timeline(meta, path, pptx_sha, script_sha, total):
    t, rows = 0.0, []
    for m in meta:
        rows.append(dict(page=m['page'], title=m['title'], start=fmt(t),
                         end=fmt(t + m['clip']), seconds=round(m['clip'], 1), chars=m['chars']))
        t += m['clip']
    path.write_text(json.dumps(
        dict(voice=VOICE, rate=RATE, total=fmt(total),
             source_pptx_sha256=pptx_sha, source_script_sha256=script_sha,
             sections=rows), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def write_timetable(script_path, meta, total):
    """把实测时长写回讲稿文末。手写的是词，机器写的是秒。"""
    head = narration_body(script_path)
    rows = ['%s\n' % TIMETABLE_HEAD,
            '<!-- 由 make_video.py 按实测时长自动生成，不要手改 -->\n',
            '语音 `%s`，语速 `%s`，合计 **%s**（%d 页，共 %d 字）。\n'
            % (VOICE, RATE, fmt(total), len(meta), sum(m['chars'] for m in meta)),
            '| 页 | 标题 | 起 | 止 | 时长 | 字数 |',
            '| ---: | --- | ---: | ---: | ---: | ---: |']
    t = 0.0
    for m in meta:
        rows.append('| %d | %s | %s | %s | %.1fs | %d |'
                    % (m['page'], m['title'], fmt(t), fmt(t + m['clip']), m['clip'], m['chars']))
        t += m['clip']
    io.open(script_path, 'w', encoding='utf-8').write(head + '\n\n---\n\n' + '\n'.join(rows) + '\n')


# ---------------------------------------------------------------- --check
def check(ch, pptx, script, timeline, preview):
    problems, hints = [], []
    for label, path in (('课件', pptx), ('讲稿', script), ('时间轴', timeline)):
        if not path.exists():
            problems.append(f'{label}不存在：{path.name}')
    if problems:
        return problems, hints
    tl = json.loads(timeline.read_text(encoding='utf-8'))
    if tl.get('source_pptx_sha256') != pptx_digest(pptx):
        problems.append(f'第{ch}章视频过期：课件改过而视频没重建')
    if tl.get('source_script_sha256') != script_digest(script):
        problems.append(f'第{ch}章视频过期：讲稿改过而视频没重建')
    if not preview.exists():
        hints.append(f'轻量版不在：`python3 make_video.py {ch} && python3 make_video.py {ch} --preview`')
    return problems, hints


# ---------------------------------------------------------------- 入口
def main():
    global WORK
    ap = argparse.ArgumentParser()
    ap.add_argument('chapter', help='章号，如 07')
    ap.add_argument('--audio-only', action='store_true', help='只跑 TTS 看总时长')
    ap.add_argument('--check', action='store_true', help='只校验产物是否最新')
    ap.add_argument('--preview', action='store_true', help='从成品转 720p 轻量版')
    args = ap.parse_args()

    ch = args.chapter.zfill(2)
    pptx = find_pptx(ch)
    vdir = HERE / 'video'
    script = vdir / f'ch{ch}_narration.md'
    srt = vdir / f'ch{ch}.srt'
    timeline = vdir / f'ch{ch}.timeline.json'
    preview = vdir / f'ch{ch}-preview.mp4'
    WORK = WORK / f'ch{ch}'
    mp4 = WORK / (pptx.stem + '.mp4')

    if args.check:
        problems, hints = check(ch, pptx, script, timeline, preview)
        for p in problems:
            print('❌', p)
        for h in hints:
            print('·', h)
        if not problems:
            tl = json.loads(timeline.read_text(encoding='utf-8'))
            print('✅ 第%s章视频与课件、讲稿同版：%d 页，总时长 %s'
                  % (ch, len(tl['sections']), tl['total']))
        return 1 if problems else 0

    if args.preview:
        if not mp4.exists():
            sys.exit(f'成品不存在：{mp4}。先跑 make_video.py {ch}')
        make_preview(mp4, preview)
        print('输出：%s　%.1f MB（成品 %.1f MB）'
              % (preview.name, preview.stat().st_size / 1e6, mp4.stat().st_size / 1e6))
        return 0

    if not script.exists():
        sys.exit(f'讲稿不存在：{script}')
    from pptx import Presentation
    pages = len(Presentation(str(pptx)).slides)
    sections = parse_narration(script, pages)

    meta = synth(sections, WORK / 'audio')
    total = sum(m['clip'] for m in meta)
    print('\n合计 %s（%.1f 秒），%d 页，共 %d 字，voice=%s rate=%s'
          % (fmt(total), total, len(meta), sum(m['chars'] for m in meta), VOICE, RATE))
    if args.audio_only:
        return 0

    pptx_sha, nframes = export_frames(pptx, WORK / 'frames')
    if nframes != pages:
        sys.exit(f'导出 {nframes} 张画面，课件 {pages} 页 —— 对不上')
    concat(build_clips(meta, WORK / 'frames', WORK / 'clips'), mp4)

    vdir.mkdir(exist_ok=True)
    write_srt(meta, srt)
    write_timeline(meta, timeline, pptx_sha, script_digest(script), total)
    write_timetable(script, meta, total)
    print('\n输出：%s　总时长 %s　%.1f MB' % (mp4, fmt(total), mp4.stat().st_size / 1e6))
    return 0


if __name__ == '__main__':
    sys.exit(main())
