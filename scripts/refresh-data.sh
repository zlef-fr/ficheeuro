#!/usr/bin/env bash
# Rebuild the served JSON from the latest HowTheyVote.eu bulk export.
#
# Inputs come from Sluice (the fleet's open-data gateway): it resolves the newest
# GitHub release itself, so an unchanged release tag means nothing is downloaded
# at all. Catalogue in scripts/sluice-sources.json, fallback in scripts/sluice.sh.
set -euo pipefail
cd "$(dirname "$0")/.."
# shellcheck source=scripts/sluice.sh
source scripts/sluice.sh

mkdir -p pipeline/raw-euro
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for f in members groups group_memberships countries votes member_votes; do
  echo "· $f"
  # Sluice stores the upstream .gz byte for byte; the pipeline wants plain CSV.
  sluice_get "eu-howtheyvote-${f//_/-}" "$TMP/$f.csv.gz"
  gunzip -c "$TMP/$f.csv.gz" > "pipeline/raw-euro/$f.csv"
done

echo "· rebuilding data …"
python3 pipeline/build_euro.py
echo "✓ data refreshed"
