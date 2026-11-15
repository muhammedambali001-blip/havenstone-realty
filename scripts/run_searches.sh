#!/bin/bash
# Run all image searches, capture stdout (JSON) to files
cd /home/z/my-project/scripts/imgsearch
run() {
  local file="$1"; shift
  local query="$*"
  z-ai image-search -q "$query" --gl us --no-rank > "$file.raw" 2>/dev/null
  echo "done: $file ($?)"
}
run q1_exterior.raw "stunning luxury modern mansion exterior with swimming pool"
run q2_living.raw "elegant luxury living room interior with large windows and sofas"
run q3_kitchen.raw "modern luxury kitchen interior with marble island"
run q4_bedroom.raw "luxury master bedroom interior design warm elegant"
run q5_bathroom.raw "modern luxury bathroom with marble and freestanding bathtub"
run q6_penthouse.raw "luxury penthouse apartment living room with city skyline view"
run q7_duplex.raw "modern duplex house exterior white contemporary architecture"
run q8_lagos.raw "Lagos Nigeria city skyline aerial view waterfront"
run q9_building.raw "luxury apartment building exterior residential towers"
run q10_dining.raw "elegant dining room interior luxury home"
run q11_pool.raw "modern villa terrace pool evening lights"
