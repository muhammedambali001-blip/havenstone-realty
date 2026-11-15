#!/usr/bin/env python3
"""Corner check for replacement candidate RAW images."""
import os
from PIL import Image, ImageDraw

RAW = "/home/z/my-project/scripts/imgsearch/raw"
CANDS = ["q8_7", "q11_7", "q9_8", "q9_1", "q9_2", "q6_4", "q6_9", "q6_3", "q7_7", "q1_4"]
CROP = 200
COLS = 5
CELL = CROP * 2 + 6 + 26
rows = (len(CANDS) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * (CROP * 2 + 6), rows * CELL), "white")
draw = ImageDraw.Draw(sheet)
for i, name in enumerate(CANDS):
    img = Image.open(os.path.join(RAW, name + ".jpg"))
    w, h = img.size
    bl = img.crop((0, max(0, h - CROP), CROP, h))
    br = img.crop((max(0, w - CROP), max(0, h - CROP), w, h))
    combo = Image.new("RGB", (CROP * 2 + 4, CROP), (200, 200, 200))
    combo.paste(bl, (0, 0))
    combo.paste(br, (CROP + 4, 0))
    x = (i % COLS) * (CROP * 2 + 6) + 2
    y = (i // COLS) * CELL + 2
    sheet.paste(combo, (x, y))
    draw.rectangle([x + 2, y + CROP + 2, x + 2 + 11 * len(name), y + CROP + 20], fill="yellow")
    draw.text((x + 4, y + CROP + 4), name, fill="black")
sheet.save("/tmp/render/cand_corners.jpg", "JPEG", quality=88)
print("saved", sheet.size)
