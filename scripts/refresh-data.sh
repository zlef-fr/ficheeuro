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

# The EP's own list adds what HowTheyVote does not carry: the NATIONAL party of each
# MEP (Knafo sits in the ESN group but her party is Reconquête!), and the group's full
# name in the visitor's language. Optional — a fetch failure must not sink the rebuild.
for lang in en fr; do
  echo "· meps-$lang.xml"
  sluice_get "eu-parliament-meps-$lang" "pipeline/raw-euro/meps-$lang.xml" \
    || echo "  ! meps-$lang.xml unavailable — building without party/localized group labels"
done

echo "· rebuilding data …"
python3 pipeline/build_euro.py
echo "✓ data refreshed"
