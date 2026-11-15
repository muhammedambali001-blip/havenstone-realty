#!/usr/bin/env python3
"""Contact sheets of final public/images at readable size (2 sheets)."""
import os, math
from PIL import Image, ImageDraw

PUB = "/home/z/my-project/public/images"
files = sorted(os.listdir(PUB))
THUMB_W, THUMB_H, COLS, LABEL_H = 380, 250, 5, 28
half = math.ceil(len(files) / 2)
for sheet_no, group in enumerate([files[:half], files[half:]], 1):
    rows = math.ceil(len(group) / COLS)
    sheet = Image.new("RGB", (COLS * THUMB_W, rows * (THUMB_H + LABEL_H)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, f in enumerate(group):
        img = Image.open(os.path.join(PUB, f))
        img.thumbnail((THUMB_W - 10, THUMB_H - 10))
        x = (i % COLS) * THUMB_W + 5
        y = (i // COLS) * (THUMB_H + LABEL_H) + 5
        sheet.paste(img, (x, y))
        draw.rectangle([x + 2, y + THUMB_H - 2, x + 2 + 11 * len(f), y + THUMB_H + 20], fill="yellow")
        draw.text((x + 4, y + THUMB_H), f, fill="black")
    out = f"/tmp/render/final_sheet_{sheet_no}.jpg"
    sheet.save(out, "JPEG", quality=80)
    print(out, sheet.size, len(group))
