#!/usr/bin/env python3
"""
FicheEurodéputé.fr — data pipeline (European Parliament, term 10 · 2024-2029).

Source: HowTheyVote.eu bulk CSV export (built on the EP's official roll-call votes,
CC-BY). Files in raw-euro/: members, groups, group_memberships, countries, votes,
member_votes (position of every MEP on every roll-call vote).

Emits the SAME JSON shape as the deputy pipeline (uid/slug/"depute"/"deputes" keys)
so the shared frontend is untouched; the geographic dimension is the MEP's COUNTRY.
"""
import csv, json, os, sys, re, collections, datetime, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw-euro")
OUT = os.path.abspath(os.path.join(HERE, "..", "data"))
os.makedirs(os.path.join(OUT, "depute"), exist_ok=True)
TERM_START = "2024-07-16"
csv.field_size_limit(10_000_000)

# EP political groups → colour (short_label comes from the data)
GROUP_COLORS = {
    "EPP": "#3399FF", "SD": "#E4002B", "RENEW": "#FFCC00", "GREEN_EFA": "#57B45F",
    "ECR": "#0F4C81", "GUE_NGL": "#8B0000", "PFE": "#2B4B7E", "ESN": "#4A5568",
    "ID": "#1D3F6E", "NI": "#8a8f98",
}

def slugify(a, b):
    s = f"{a}-{b}".lower()
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def flag(iso2):
    if not iso2 or len(iso2) != 2:
        return ""
    return "".join(chr(0x1F1E6 + ord(c) - ord("A")) for c in iso2.upper())

def rd(name):
    return list(csv.DictReader(open(os.path.join(RAW, name), encoding="utf-8")))

# ── reference tables ──────────────────────────────────────────────────────
print("· loading reference tables …", file=sys.stderr)
countries = {r["code"]: (r["label"], r["iso_alpha_2"]) for r in rd("countries.csv")}
groups = {}
for r in rd("groups.csv"):
    groups[r["code"]] = {"sigle": r["short_label"], "libelle": r["label"],
                         "color": GROUP_COLORS.get(r["code"], "#8a8f98")}

# current MEPs = term-10 membership still open (end_date empty)
cur_group, mandate_start = {}, {}
for r in rd("group_memberships.csv"):
    if r["term"] == "10" and not r["end_date"].strip():
        cur_group[r["member_id"]] = r["group_code"]
        mandate_start[r["member_id"]] = r["start_date"]
ACTIVE = set(cur_group)
print("· %d eurodéputés en exercice" % len(ACTIVE), file=sys.stderr)

meps = {}
for r in rd("members.csv"):
    mid = r["id"]
    if mid not in ACTIVE:
        continue
    label, iso2 = countries.get(r["country_code"], (r["country_code"], ""))
    g = groups.get(cur_group[mid], {"sigle": "NI", "libelle": "Non-attached", "color": "#8a8f98"})
    meps[mid] = {
        "uid": mid, "slug": slugify(r["first_name"], r["last_name"]),
        "prenom": r["first_name"], "nom": r["last_name"], "civ": "", "sexe": "H",
        "dateNaissance": r.get("date_of_birth") or None, "profession": None,
        "circo": {"departement": (flag(iso2) + " " + label).strip(), "numDepartement": iso2, "region": None, "numCirco": None},
        "countryCode": r["country_code"], "flag": flag(iso2),
        "groupeSigle": g["sigle"], "groupeLibelle": g["libelle"], "groupeColor": g["color"],
        "hatvp": None, "twitter": (r.get("twitter") or None), "facebook": (r.get("facebook") or None),
        "email": (r.get("email") or None), "website": None,
        "nPour": 0, "nContre": 0, "nAbstention": 0, "nNonVotant": 0,
        "nPresent": 0, "nEligible": 0, "nLoyal": 0, "nGroupExpr": 0, "votes": [],
    }

# ── term-10 votes ─────────────────────────────────────────────────────────
print("· loading term-10 votes …", file=sys.stderr)
POSMAP = {"FOR": "pour", "AGAINST": "contre", "ABSTENTION": "abstention", "DID_NOT_VOTE": "nonVotant"}
votes = {}
for r in rd("votes.csv"):
    if r["timestamp"] >= TERM_START:   # all term-10 roll-call votes (like the AN scrutins)
        result = (r.get("result") or "").upper()
        votes[r["id"]] = {"date": r["timestamp"][:10], "titre": r.get("display_title") or "",
                          "sort": "adopté" if result == "ADOPTED" else ("rejeté" if result == "REJECTED" else None)}
TERM10 = set(votes)
print("· %d scrutins term-10" % len(TERM10), file=sys.stderr)

# ── member_votes (17M rows) — stream, filter to term-10 + active MEPs ──────
print("· streaming member_votes …", file=sys.stderr)
grp_counts = collections.defaultdict(lambda: collections.Counter())   # (vote,group)->Counter(pos)
sen_votes = collections.defaultdict(list)                             # mid -> [(vote,pos)]
n = 0
with open(os.path.join(RAW, "member_votes.csv"), encoding="utf-8") as fh:
    rdr = csv.reader(fh)
    header = next(rdr)
    vi, mi, pi, gi = header.index("vote_id"), header.index("member_id"), header.index("position"), header.index("group_code")
    for row in rdr:
        if row[vi] not in TERM10:
            continue
        mid = row[mi]
        if mid not in ACTIVE:
            continue
        pos = POSMAP.get(row[pi])
        if pos is None:
            continue
        sen_votes[mid].append((row[vi], pos))
        if pos in ("pour", "contre", "abstention"):
            grp_counts[(row[vi], row[gi])][pos] += 1
        n += 1
        if n % 1_000_000 == 0:
            print("  … %d rows" % n, file=sys.stderr)
print("· %d votes attribués" % n, file=sys.stderr)

majority = {k: c.most_common(1)[0][0] for k, c in grp_counts.items() if c}

# ── aggregate per MEP → shared JSON shape ─────────────────────────────────
def pct(a, b):
    return round(100.0 * a / b, 1) if b else 0.0

for mid, m in meps.items():
    grp = cur_group[mid]
    for vid, pos in sen_votes.get(mid, []):
        m["n" + {"pour": "Pour", "contre": "Contre", "abstention": "Abstention", "nonVotant": "NonVotant"}[pos]] += 1
        # in EP roll-call data DID_NOT_VOTE (=nonVotant) means absent; present = actually cast
        if pos in ("pour", "contre", "abstention"):
            m["nPresent"] += 1
            maj = majority.get((vid, grp))
            if maj:
                m["nGroupExpr"] += 1
                if pos == maj:
                    m["nLoyal"] += 1
        v = votes[vid]
        m["votes"].append({"numero": vid, "date": v["date"], "position": pos,
                           "titre": v["titre"], "sort": v["sort"]})
    # eligible = every term-10 roll-call where the MEP had a row (auto mandate window)
    m["nEligible"] = len(m["votes"])
    m["presenceRate"] = pct(m["nPresent"], m["nEligible"])
    expr = m["nPour"] + m["nContre"] + m["nAbstention"]
    m["participationRate"] = pct(expr, m["nEligible"])
    m["nExprimes"] = expr
    m["loyaltyRate"] = pct(m["nLoyal"], m["nGroupExpr"]) if m["nGroupExpr"] >= 20 else None

total_scrutins = len(TERM10)
light, game_pool = [], []
for m in meps.values():
    g = {"sigle": m["groupeSigle"], "libelle": m["groupeLibelle"], "color": m["groupeColor"]}
    m["votes"].sort(key=lambda v: (v["date"] or "", v["numero"] or ""), reverse=True)
    full = dict(m)
    full["groupe"] = g
    # show recent CAST votes (roll-calls have many DID_NOT_VOTE rows per session)
    full["votesRecents"] = [v for v in m["votes"] if v["position"] != "nonVotant"][:25]
    for k in ("votes", "groupeSigle", "groupeLibelle", "groupeColor"):
        full.pop(k, None)
    json.dump(full, open(os.path.join(OUT, "depute", m["uid"] + ".json"), "w"),
              ensure_ascii=False, separators=(",", ":"))
    light.append({
        "uid": m["uid"], "slug": m["slug"], "prenom": m["prenom"], "nom": m["nom"],
        "civ": "", "sexe": "H", "groupe": g["sigle"], "groupeColor": g["color"],
        "groupeLibelle": g["libelle"], "dep": m["circo"]["numDepartement"],
        "depNom": m["circo"]["departement"], "flag": m["flag"], "region": None, "circo": None,
        "presence": m["presenceRate"], "participation": m["participationRate"],
        "nPresent": m["nPresent"], "nEligible": m["nEligible"], "loyalty": m["loyaltyRate"],
    })
    pour3 = [{"titre": v["titre"], "date": v["date"]} for v in m["votes"] if v["position"] == "pour"][:3]
    contre3 = [{"titre": v["titre"], "date": v["date"]} for v in m["votes"] if v["position"] == "contre"][:3]
    if len(pour3) == 3 and len(contre3) == 3 and m["nPresent"] >= 20:
        game_pool.append({"uid": m["uid"], "slug": m["slug"], "prenom": m["prenom"], "nom": m["nom"],
                          "groupe": g["sigle"], "groupeColor": g["color"], "groupeLibelle": g["libelle"],
                          "dep": m["circo"]["numDepartement"], "depNom": m["circo"]["departement"],
                          "presence": m["presenceRate"], "pour": pour3, "contre": contre3})

light.sort(key=lambda x: (x["nom"] or "", x["prenom"] or ""))
json.dump({"generatedAt": datetime.date.today().isoformat(), "legislature": "PE 2024-2029",
           "totalScrutins": total_scrutins, "deputes": light},
          open(os.path.join(OUT, "deputes.json"), "w"), ensure_ascii=False, separators=(",", ":"))

gstats = {}
for x in light:
    a = gstats.setdefault(x["groupe"], {"sigle": x["groupe"], "libelle": x["groupeLibelle"],
                                        "color": x["groupeColor"], "n": 0, "sp": 0.0, "pp": 0.0})
    a["n"] += 1; a["sp"] += x["presence"]; a["pp"] += x["participation"]
groupes = []
for a in gstats.values():
    a["presenceMoyenne"] = round(a["sp"] / a["n"], 1); a["participationMoyenne"] = round(a["pp"] / a["n"], 1)
    del a["sp"]; del a["pp"]; groupes.append(a)
groupes.sort(key=lambda a: -a["n"])
json.dump({"groupes": groupes}, open(os.path.join(OUT, "groupes.json"), "w"), ensure_ascii=False, separators=(",", ":"))

# ── per-country stats ─────────────────────────────────────────────────────
pstats = {}
for x in light:
    a = pstats.setdefault(x["dep"], {"code": x["dep"], "label": x["depNom"], "flag": x.get("flag", ""),
                                     "n": 0, "sp": 0.0, "pp": 0.0, "loy": 0.0, "nloy": 0,
                                     "grp": collections.Counter(), "grpColor": {}})
    a["n"] += 1; a["sp"] += x["presence"]; a["pp"] += x["participation"]; a["grp"][x["groupe"]] += 1
    a["grpColor"][x["groupe"]] = x["groupeColor"]
    if x["loyalty"] is not None:
        a["loy"] += x["loyalty"]; a["nloy"] += 1
pays = []
for a in pstats.values():
    a["presenceMoyenne"] = round(a["sp"] / a["n"], 1)
    a["participationMoyenne"] = round(a["pp"] / a["n"], 1)
    a["loyaltyMoyenne"] = round(a["loy"] / a["nloy"], 1) if a["nloy"] else None
    a["topGroupe"] = a["grp"].most_common(1)[0][0] if a["grp"] else None
    a["groupes"] = [{"sigle": g, "n": n, "color": a["grpColor"][g]} for g, n in a["grp"].most_common()]
    for k in ("sp", "pp", "loy", "nloy", "grp", "grpColor"):
        del a[k]
    pays.append(a)
pays.sort(key=lambda a: -a["n"])
json.dump({"pays": pays}, open(os.path.join(OUT, "pays.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print("· %d pays" % len(pays), file=sys.stderr)

def top(k, rev, n=20):
    return sorted(light, key=lambda x: x[k], reverse=rev)[:n]
wl = [x for x in light if x["loyalty"] is not None]
stats = {
    "totalDeputes": len(light), "totalScrutins": total_scrutins,
    "presenceMoyenne": round(sum(x["presence"] for x in light) / len(light), 1),
    "plusAssidus": top("presence", True), "plusAbsents": top("presence", False),
    "plusActifs": top("participation", True),
    "plusLoyaux": sorted(wl, key=lambda x: -x["loyalty"])[:20],
    "plusFrondeurs": sorted(wl, key=lambda x: x["loyalty"])[:20],
    "groupesAbsents": sorted(groupes, key=lambda a: a["presenceMoyenne"]),
}
json.dump(stats, open(os.path.join(OUT, "stats.json"), "w"), ensure_ascii=False, separators=(",", ":"))

recent = sorted(votes.items(), key=lambda kv: kv[1]["date"])[-40:]
json.dump({"scrutins": [{"numero": vid, "date": v["date"], "sort": v["sort"], "titre": v["titre"],
                         "pour": None, "contre": None, "abstention": None} for vid, v in reversed(recent)]},
          open(os.path.join(OUT, "scrutins.json"), "w"), ensure_ascii=False, separators=(",", ":"))
json.dump({"deputes": game_pool}, open(os.path.join(OUT, "game.json"), "w"), ensure_ascii=False, separators=(",", ":"))

print("✓ %d eurodéputés, %d scrutins, %d groupes, %d jouables → %s" %
      (len(light), total_scrutins, len(groupes), len(game_pool), OUT), file=sys.stderr)
