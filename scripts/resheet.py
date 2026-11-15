#!/usr/bin/env python3
"""Rebuild contact sheet with zero-padded ordering and larger labels."""
import os, math
from PIL import Image, ImageDraw

RAW_DIR = "/home/z/my-project/scripts/imgsearch/raw"
SHEET = "/home/z/my-project/scripts/imgsearch/contact_sheet2.jpg"

files = [f for f in os.listdir(RAW_DIR) if f.endswith(".jpg")]
def order_key(f):
    tag, idx = f[:-4].split("_")
    return (int(tag[1:]), int(idx))
files.sort(key=order_key)

THUMB_W, THUMB_H, COLS, LABEL_H = 300, 200, 8, 30
rows = math.ceil(len(files) / COLS)
sheet = Image.new("RGB", (COLS * THUMB_W, rows * (THUMB_H + LABEL_H)), "white")
draw = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    img = Image.open(os.path.join(RAW_DIR, f))
    img.thumbnail((THUMB_W - 8, THUMB_H - 8))
    x = (i % COLS) * THUMB_W + 4
    y = (i // COLS) * (THUMB_H + LABEL_H) + 4
    sheet.paste(img, (x, y))
    w, h = img.size
    tag, idx = f[:-4].split("_")
    label = f"q{int(tag[1:])}_{idx}"
    draw.rectangle([x + 2, y + THUMB_H - 4, x + 2 + 11 * len(label), y + THUMB_H + 24], fill="yellow")
    draw.text((x + 4, y + THUMB_H - 2), f"{label} {w}x{h}", fill="black")
sheet.save(SHEET, "JPEG", quality=78)
print(f"Contact sheet: {SHEET} ({sheet.size[0]}x{sheet.size[1]}), {len(files)} images")
