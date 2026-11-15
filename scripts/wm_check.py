#!/usr/bin/env python3
"""Tile bottom corners of suspect images at full res for watermark check."""
import os
from PIL import Image, ImageDraw

PUB = "/home/z/my-project/public/images"
SUSPECTS = [
    "cta.jpg", "loc-ajah.jpg", "loc-vi.jpg", "loc-lekki.jpg",
    "p06-1.jpg", "p07-1.jpg", "p11-1.jpg", "p11-2.jpg", "p05-3.jpg", "hero.jpg",
]
CROP = 260  # square crop size
COLS = 5
rows = (len(SUSPECTS) + COLS - 1) // COLS
CELL = CROP + 30
sheet = Image.new("RGB", (COLS * CELL, rows * CELL), "white")
draw = ImageDraw.Draw(sheet)
for i, name in enumerate(SUSPECTS):
    img = Image.open(os.path.join(PUB, name))
    w, h = img.size
    # bottom-left and bottom-right crops side by side, scaled 2x
    bl = img.crop((0, max(0, h - CROP), CROP, h))
    br = img.crop((max(0, w - CROP), max(0, h - CROP), w, h))
    combo = Image.new("RGB", (CROP * 2 + 4, CROP), (200, 200, 200))
    combo.paste(bl, (0, 0))
    combo.paste(br, (CROP + 4, 0))
    combo = combo.resize((CELL - 10, (CELL - 10) * CROP // (CROP * 2 + 4)))
    x = (i % COLS) * CELL + 5
    y = (i // COLS) * CELL + 5
    sheet.paste(combo, (x, y))
    draw.rectangle([x + 2, y + combo.size[1] + 2, x + 2 + 11 * len(name), y + combo.size[1] + 18], fill="yellow")
    draw.text((x + 4, y + combo.size[1] + 4), name, fill="black")
sheet.save("/tmp/render/wm_corners.jpg", "JPEG", quality=88)
print("saved /tmp/render/wm_corners.jpg", sheet.size)
