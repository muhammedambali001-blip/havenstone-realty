#!/usr/bin/env python3
"""Download US location image candidates, build a labeled contact sheet."""
import json
import os
import urllib.request
from PIL import Image, ImageDraw

RAW = "/home/z/my-project/scripts/imgsearch-us/raw"
os.makedirs(RAW, exist_ok=True)

CANDIDATES = {
    "newyork": [
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c56df557ebdf.jpg",
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e703b7d42e34.jpg",
    ],
    "losangeles": [
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e635a6da0039.jpeg",
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c3b1191db246.jpeg",
    ],
    "miami": [
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5b32132fcaa4.jpg",
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1fa5d142cac1.jpg",
    ],
    "palmbeach": [
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/93f462ed20b3.jpg",
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/939e8aaf9084.jpg",
    ],
    "aspen": [
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/42544ba57483.jpg",
        "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d24fecf8a6a8.jpg",
    ],
}

THUMB_W, THUMB_H = 420, 300
COLS = 2

files = []
for name, urls in CANDIDATES.items():
    for i, url in enumerate(urls):
        ext = os.path.splitext(url)[1] or ".jpg"
        dest = os.path.join(RAW, f"{name}_{i}{ext}")
        if not os.path.exists(dest) or os.path.getsize(dest) < 10_000:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
                f.write(r.read())
        im = Image.open(dest).convert("RGB")
        print(f"{name}_{i}: {im.size} <- {dest}")
        files.append((f"{name} [{i}]", im))

cell_w, cell_h = THUMB_W, THUMB_H + 26
rows = (len(files) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * cell_w, rows * cell_h), (24, 30, 36))
draw = ImageDraw.Draw(sheet)
for idx, (label, im) in enumerate(files):
    x = (idx % COLS) * cell_w
    y = (idx // COLS) * cell_h
    thumb = im.copy()
    thumb.thumbnail((THUMB_W - 8, THUMB_H - 8))
    sheet.paste(thumb, (x + 4, y + 4))
    draw.text((x + 8, y + THUMB_H + 4), label, fill=(255, 215, 130))
out = "/home/z/my-project/scripts/imgsearch-us/contact_sheet.jpg"
sheet.save(out, quality=85)
print("sheet:", out, sheet.size)
