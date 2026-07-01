#!/usr/bin/env bash
# Downloads the latest HowTheyVote.eu bulk export and rebuilds the served JSON.
set -euo pipefail
cd "$(dirname "$0")/.."
REL=$(curl -fsSL "https://api.github.com/repos/HowTheyVote/data/releases/latest" | grep -oE '"tag_name": *"[^"]+"' | cut -d'"' -f4)
B="https://github.com/HowTheyVote/data/releases/download/$REL"
mkdir -p pipeline/raw-euro
for f in members groups group_memberships countries votes member_votes; do
  echo "· $f …"; curl -fsSL "$B/$f.csv.gz" | gunzip > "pipeline/raw-euro/$f.csv"
done
echo "· rebuilding data …"; python3 pipeline/build_euro.py
echo "✓ data refreshed ($REL)"
