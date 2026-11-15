#!/usr/bin/env python3
"""Pick chosen images, resize and copy into public/images with semantic names."""
import os, json, subprocess
from PIL import Image

RAW_DIR = "/home/z/my-project/scripts/imgsearch/raw"
PUB_DIR = "/home/z/my-project/public/images"
os.makedirs(PUB_DIR, exist_ok=True)

# mapping: destination name -> raw key
MAPPING = {
    "hero.jpg": "q1_7",
    "cta.jpg": "q11_5",
    "about.jpg": "q8_7",
    "loc-lekki.jpg": "q11_4",
    "loc-vi.jpg": "q8_6",
    "loc-ikoyi.jpg": "q9_2",
    "loc-ikeja.jpg": "q8_4",
    "loc-ajah.jpg": "q8_1",
}
props = {
    1: ["q9_1", "q6_5", "q4_4", "q5_3"],
    2: ["q11_5", "q2_0", "q4_2", "q3_8"],
    3: ["q9_8", "q2_1", "q4_0", "q5_8"],
    4: ["q6_0", "q2_9", "q4_6", "q5_1"],
    5: ["q11_9", "q6_4", "q2_4", "q3_0"],
    6: ["q1_3", "q1_8", "q2_6", "q3_1"],
    7: ["q1_4", "q7_7", "q2_3", "q3_4"],
    8: ["q7_0", "q11_8", "q10_0", "q4_8"],
    9: ["q7_2", "q7_3", "q2_2", "q5_2"],
    10: ["q7_4", "q3_6", "q2_5", "q5_9"],
    11: ["q11_7", "q6_3", "q4_7", "q10_3"],
    12: ["q9_0", "q6_2", "q4_5", "q5_7"],
}
for pid, keys in props.items():
    for i, k in enumerate(keys, 1):
        MAPPING[f"p{pid:02d}-{i}.jpg"] = k

MAX_W = 1800
results = {}
missing = []
for dest, key in MAPPING.items():
    src = os.path.join(RAW_DIR, key + ".jpg")
    if not os.path.exists(src):
        missing.append((dest, key))
        continue
    img = Image.open(src).convert("RGB")
    w, h = img.size
    if w > MAX_W:
        img = img.resize((MAX_W, int(h * MAX_W / w)), Image.LANCZOS)
    out = os.path.join(PUB_DIR, dest)
    img.save(out, "JPEG", quality=82)
    results[dest] = img.size

print(f"Saved {len(results)} / {len(MAPPING)}")
if missing:
    print("MISSING:", missing)
total = sum(os.path.getsize(os.path.join(PUB_DIR, f)) for f in os.listdir(PUB_DIR))
print(f"Total size: {total/1024/1024:.1f} MB, files: {len(os.listdir(PUB_DIR))}")
