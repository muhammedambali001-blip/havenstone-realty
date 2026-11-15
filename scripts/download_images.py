#!/usr/bin/env python3
"""Download all searched images, resize, and build a labeled contact sheet."""
import json, os, glob, io, math, subprocess
from PIL import Image

SRC_DIR = "/home/z/my-project/scripts/imgsearch"
RAW_DIR = "/home/z/my-project/scripts/imgsearch/raw"
PUB_DIR = "/home/z/my-project/public/images"
SHEET = "/home/z/my-project/scripts/imgsearch/contact_sheet.jpg"

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PUB_DIR, exist_ok=True)

# Collect all URLs with a stable index (raw stdout files: strip lines before first '{')
entries = []  # list of dicts
for f in sorted(glob.glob(os.path.join(SRC_DIR, "q*.raw.raw"))):
    text = open(f).read()
    start = text.find("{")
    if start < 0:
        print(f"NO JSON in {f}")
        continue
    data = json.loads(text[start:])
    tag = os.path.basename(f).split("_")[0]
    for i, r in enumerate(data.get("results", [])):
        entries.append({
            "key": f"{tag}_{i}",
            "url": r["original_url"],
            "source": r.get("source", ""),
            "w": r.get("original_width", ""),
            "h": r.get("original_height", ""),
        })

print(f"Total images found: {len(entries)}")

manifest = {}
for e in entries:
    fn = e["key"] + ".jpg"
    raw_path = os.path.join(RAW_DIR, fn)
    if not os.path.exists(raw_path):
        try:
            r = subprocess.run(
                ["curl", "-s", "-L", "--max-time", "40", "-o", raw_path, e["url"]],
                capture_output=True, timeout=60,
            )
            if r.returncode != 0 or not os.path.exists(raw_path) or os.path.getsize(raw_path) < 1000:
                print(f"FAIL dl {e['key']}: rc={r.returncode} err={r.stderr[:120]}")
                if os.path.exists(raw_path):
                    os.remove(raw_path)
                continue
        except Exception as ex:
            print(f"FAIL {e['key']}: {ex}")
            continue
    try:
        img = Image.open(raw_path)
        manifest[e["key"]] = {"file": raw_path, "size": img.size, "source": e["source"]}
    except Exception as ex:
        print(f"FAIL open {e['key']}: {ex}")

print(f"Downloaded OK: {len(manifest)}")

# Contact sheet: thumbnails 320px wide with labels
keys = sorted(manifest.keys(), key=lambda k: (k.split("_")[0], int(k.split("_")[1])))
THUMB_W, THUMB_H, COLS, LABEL_H = 300, 200, 8, 26
rows = math.ceil(len(keys) / COLS)
sheet = Image.new("RGB", (COLS * THUMB_W, rows * (THUMB_H + LABEL_H)), "white")
from PIL import ImageDraw
draw = ImageDraw.Draw(sheet)
for i, k in enumerate(keys):
    img = Image.open(manifest[k]["file"])
    img.thumbnail((THUMB_W - 8, THUMB_H - 8))
    x = (i % COLS) * THUMB_W + 4
    y = (i // COLS) * (THUMB_H + LABEL_H) + 4
    sheet.paste(img, (x, y))
    w, h = manifest[k]["size"]
    draw.text((x + 2, y + THUMB_H - 2), f"{k} {w}x{h}", fill="black")
sheet.save(SHEET, "JPEG", quality=80)
print(f"Contact sheet: {SHEET} ({sheet.size[0]}x{sheet.size[1]})")

with open(os.path.join(SRC_DIR, "manifest.json"), "w") as f:
    json.dump({k: {"size": manifest[k]["size"], "source": manifest[k]["source"]} for k in manifest}, f, indent=1)
