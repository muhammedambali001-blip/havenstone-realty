#!/usr/bin/env python3
"""Finalize US location images: crop to 16:10, resize to 1600x1000, save JPEGs."""
import os
from PIL import Image

RAW = "/home/z/my-project/scripts/imgsearch-us/raw"
OUT = "/home/z/my-project/public/images"

PICKS = {
    "loc-newyork.jpg": "newyork_0.jpg",
    "loc-losangeles.jpg": "losangeles_0.jpeg",
    "loc-miami.jpg": "miami_0.jpg",
    "loc-palmbeach.jpg": "palmbeach_0.jpg",
    "loc-aspen.jpg": "aspen_0.jpg",
}

TARGET_W, TARGET_H = 1600, 1000  # 16:10

for dest_name, src_name in PICKS.items():
    src = os.path.join(RAW, src_name)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    target_ratio = TARGET_W / TARGET_H
    ratio = w / h
    if ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    elif ratio < target_ratio:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
    im = im.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    dest = os.path.join(OUT, dest_name)
    im.save(dest, quality=85, optimize=True)
    print(f"{dest_name}: {im.size}, {os.path.getsize(dest) // 1024} KB")

# Remove the old Lagos location images
for old in ["loc-lekki.jpg", "loc-vi.jpg", "loc-ikoyi.jpg", "loc-ikeja.jpg", "loc-ajah.jpg"]:
    p = os.path.join(OUT, old)
    if os.path.exists(p):
        os.remove(p)
        print("removed:", old)
