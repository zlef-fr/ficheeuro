// Dynamic social share cards (1200×630 SVG) — rendered on the fly, localized to
// the viewer's locale (24 official EU languages). `card(d, lang)` builds a
// per-MEP fiche card; `defaultCard(lang)` builds the home/section banner. Both
// are factual, on-brand and screenshot-ready. Labels live in OG_LABELS; the
// country name is resolved through lib/countries so every locale reads natively.
const countries = require("./countries");

function esc(s) {
  return (s || "").toString().replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
}

const noEmoji = (s) => (s || "").replace(/[\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}\u{1F300}-\u{1FAFF}‍️]/gu, "").trim();

// caption = per-fiche bottom line · gauge = ring sub-word · tagline/sub = default banner
const OG_LABELS = {
  "bg": {
    "caption": "Участие в поименните гласувания · Европейски парламент",
    "gauge": "участие",
    "tagline": "Живият профил на вашия евродепутат",
    "sub": "719 евродепутати · Европейски парламент"
  },
  "cs": {
    "caption": "Účast na jmenovitých hlasováních · Evropský parlament",
    "gauge": "účast",
    "tagline": "Živá karta vašeho europoslance",
    "sub": "719 europoslanců · Evropský parlament"
  },
  "da": {
    "caption": "Deltagelse ved navneopråb · Europa-Parlamentet",
    "gauge": "deltagelse",
    "tagline": "Den levende profil af dit medlem af Europa-Parlamentet",
    "sub": "719 MEP'er · Europa-Parlamentet"
  },
  "de": {
    "caption": "Teilnahme an Abstimmungen · Europäisches Parlament",
    "gauge": "teilnahme",
    "tagline": "Das lebendige Profil Ihres/Ihrer Europaabgeordneten",
    "sub": "719 Abgeordnete · Europäisches Parlament"
  },
  "el": {
    "caption": "Συμμετοχή στις ονομαστικές ψηφοφορίες · Ευρωπαϊκό Κοινοβούλιο",
    "gauge": "συμμετοχή",
    "tagline": "Η ζωντανή καρτέλα του/της ευρωβουλευτή σας",
    "sub": "719 ευρωβουλευτές · Ευρωπαϊκό Κοινοβούλιο"
  },
  "en": {
    "caption": "Roll-call turnout · European Parliament",
    "gauge": "turnout",
    "tagline": "The living record of your MEP",
    "sub": "719 MEPs · European Parliament"
  },
  "es": {
    "caption": "Participación en votaciones · Parlamento Europeo",
    "gauge": "participación",
    "tagline": "La ficha viva de tu eurodiputado/a",
    "sub": "719 eurodiputados · Parlamento Europeo"
  },
  "et": {
    "caption": "Osalus nimelistel hääletustel · Euroopa Parlament",
    "gauge": "osalus",
    "tagline": "Teie eurosaadiku elav profiil",
    "sub": "719 eurosaadikut · Euroopa Parlament"
  },
  "fi": {
    "caption": "Osallistuminen nimenhuutoäänestyksiin · Euroopan parlamentti",
    "gauge": "osallistuminen",
    "tagline": "Meppisi elävä profiili",
    "sub": "719 meppiä · Euroopan parlamentti"
  },
  "fr": {
    "caption": "Participation aux scrutins · Parlement européen",
    "gauge": "participation",
    "tagline": "La fiche vivante de votre eurodéputé·e",
    "sub": "719 eurodéputés · Parlement européen"
  },
  "ga": {
    "caption": "Rannpháirtíocht sa vótáil le glaoch rolla · Parlaimint na hEorpa",
    "gauge": "rannpháirtíocht",
    "tagline": "Taifead beo d'Fheisire",
    "sub": "719 Feisire · Parlaimint na hEorpa"
  },
  "hr": {
    "caption": "Sudjelovanje u poimeničnim glasovanjima · Europski parlament",
    "gauge": "sudjelovanje",
    "tagline": "Živi profil vašeg eurozastupnika/ce",
    "sub": "719 eurozastupnika · Europski parlament"
  },
  "hu": {
    "caption": "Részvétel a név szerinti szavazásokon · Európai Parlament",
    "gauge": "részvétel",
    "tagline": "Az Ön EP-képviselőjének élő adatlapja",
    "sub": "719 EP-képviselő · Európai Parlament"
  },
  "it": {
    "caption": "Partecipazione ai voti · Parlamento europeo",
    "gauge": "partecipazione",
    "tagline": "La scheda viva del tuo eurodeputato",
    "sub": "719 eurodeputati · Parlamento europeo"
  },
  "lt": {
    "caption": "Dalyvavimas vardiniuose balsavimuose · Europos Parlamentas",
    "gauge": "dalyvavimas",
    "tagline": "Gyvoji jūsų europarlamentaro (-ės) kortelė",
    "sub": "719 europarlamentarų · Europos Parlamentas"
  },
  "lv": {
    "caption": "Līdzdalība balsojumos · Eiropas Parlaments",
    "gauge": "līdzdalība",
    "tagline": "Jūsu Eiropas Parlamenta deputāta dzīvais profils",
    "sub": "719 deputāti · Eiropas Parlaments"
  },
  "mt": {
    "caption": "Parteċipazzjoni fil-votazzjonijiet b'sejħa tal-ismijiet · Parlament Ewropew",
    "gauge": "parteċipazzjoni",
    "tagline": "Il-profil ħaj tal-MPE tiegħek",
    "sub": "719-il MPE · Parlament Ewropew"
  },
  "nl": {
    "caption": "Deelname aan hoofdelijke stemmingen · Europees Parlement",
    "gauge": "deelname",
    "tagline": "Het levende profiel van uw europarlementariër",
    "sub": "719 europarlementariërs · Europees Parlement"
  },
  "pl": {
    "caption": "Udział w głosowaniach imiennych · Parlament Europejski",
    "gauge": "udział",
    "tagline": "Żywa karta Twojego europosła",
    "sub": "719 europosłów · Parlament Europejski"
  },
  "pt": {
    "caption": "Participação nas votações · Parlamento Europeu",
    "gauge": "participação",
    "tagline": "A ficha viva do seu eurodeputado/a",
    "sub": "719 eurodeputados · Parlamento Europeu"
  },
  "ro": {
    "caption": "Participare la voturi · Parlamentul European",
    "gauge": "participare",
    "tagline": "Fișa vie a eurodeputatului/ei dumneavoastră",
    "sub": "719 eurodeputați · Parlamentul European"
  },
  "sk": {
    "caption": "Účasť na hlasovaniach podľa mien · Európsky parlament",
    "gauge": "účasť",
    "tagline": "Živá karta vášho europoslanca",
    "sub": "719 europoslancov · Európsky parlament"
  },
  "sl": {
    "caption": "Udeležba na poimenskih glasovanjih · Evropski parlament",
    "gauge": "udeležba",
    "tagline": "Živi profil vašega evropskega poslanca/-ke",
    "sub": "719 poslancev · Evropski parlament"
  },
  "sv": {
    "caption": "Deltagande i omröstningar · Europaparlamentet",
    "gauge": "deltagande",
    "tagline": "Den levande profilen för din Europaparlamentariker",
    "sub": "719 ledamöter · Europaparlamentet"
  }
};
const DEFAULT_LANG = "en";
const L = (lang) => OG_LABELS[lang] || OG_LABELS[DEFAULT_LANG];

// EU flag drawn as SVG (blue field + 12 gold stars) — resvg has no colour-emoji
// font, so a 🇪🇺 glyph renders as tofu; this vector version renders everywhere.
function euStar(cx, cy, r) {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.382 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${p.join(" ")}" fill="#FFCC00"/>`;
}
function euFlag(x, y, w) {
  const h = (w * 2) / 3, cx = x + w / 2, cy = y + h / 2, ring = h * 0.375, sr = h * 0.11;
  let stars = "";
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 6;
    stars += euStar(cx + ring * Math.cos(a), cy + ring * Math.sin(a), sr);
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h.toFixed(1)}" rx="5" fill="#003399"/>${stars}`;
}

function card(d, lang = DEFAULT_LANG) {
  const lab = L(lang);
  const name = esc(`${d.prenom} ${d.nom}`);
  const country = countries.name(d.dep, lang, d.depNom);
  const circo = esc(noEmoji(`${d.dep} · ${country}${d.circo ? " — " + d.circo + "ᵉ circo" : ""}`));
  const grpFull = d.groupeLibelle || d.groupe || "";
  const grp = esc(grpFull.length > 30 ? (d.groupe || grpFull) : grpFull);
  const color = d.groupeColor || "#173a6a";
  const val = d.presence != null ? d.presence : d.participation;
  const part = val != null ? Math.round(val) : "—";
  const arc = Math.max(0, Math.min(100, val || 0));
  const R = 120, C = 2 * Math.PI * R;
  const dash = (arc / 100) * C;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef2f9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="10" y="0" fill="#000091"/>
  <rect width="1200" height="10" y="620" fill="#e1000f"/>
  <g font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <text x="80" y="120" font-size="30" fill="#000091" font-weight="700" letter-spacing="1">fichedepute.eu</text>
    <text x="80" y="250" font-size="66" fill="#161616" font-weight="800">${name}</text>
    <text x="80" y="305" font-size="30" fill="#3a3a3a">${circo}</text>
    <rect x="80" y="345" rx="18" height="52" width="${Math.min(600, 52 + grp.length * 15)}" fill="${color}"/>
    <text x="104" y="380" font-size="26" fill="#ffffff" font-weight="600">${grp}</text>
    <text x="80" y="500" font-size="26" fill="#555">${esc(lab.caption)}</text>

    <g transform="translate(1000,300)">
      <circle r="${R}" fill="none" stroke="#e6e9f0" stroke-width="26"/>
      <circle r="${R}" fill="none" stroke="${color}" stroke-width="26" stroke-linecap="round"
        stroke-dasharray="${dash.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/>
      <text x="0" y="4" font-size="58" fill="#161616" font-weight="800" text-anchor="middle">${part}%</text>
      <text x="0" y="52" font-size="24" fill="#666" text-anchor="middle">${esc(lab.gauge)}</text>
    </g>
  </g>
</svg>`;
}

// Home / section banner — localized wordmark card (replaces the FR-only static og.png).
function defaultCard(lang = DEFAULT_LANG) {
  const lab = L(lang);
  // wrap the tagline onto up to two lines (~26 chars/line at this size)
  const words = String(lab.tagline).split(" ");
  const lines = ["", ""];
  let li = 0;
  for (const w of words) {
    if (li === 0 && (lines[0] + " " + w).trim().length > 26) li = 1;
    lines[li] = (lines[li] ? lines[li] + " " : "") + w;
  }
  const tagline = lines
    .filter(Boolean)
    .map((ln, i) => `<text x="80" y="${360 + i * 56}" font-size="44" fill="#3a3a3a" font-weight="500">${esc(ln)}</text>`)
    .join("\n    ");
  const pillW = Math.min(760, 60 + esc(lab.sub).length * 15);
  const R = 120, C = 2 * Math.PI * R, dash = 0.72 * C;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef2f9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="12" y="0" fill="#000091"/>
  <rect width="1200" height="12" y="618" fill="#e1000f"/>
  ${euFlag(80, 118, 78)}
  <g font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <text x="80" y="285" font-size="86" font-weight="800">
      <tspan fill="#000091">Fiche</tspan><tspan fill="#161616">Député</tspan><tspan fill="#e1000f">.eu</tspan>
    </text>
    ${tagline}
    <rect x="80" y="470" rx="26" height="56" width="${pillW}" fill="#eae9f6"/>
    <circle cx="112" cy="498" r="7" fill="#e1000f"/>
    <text x="132" y="507" font-size="27" fill="#000091" font-weight="700">${esc(lab.sub)}</text>

    <g transform="translate(1010,300)">
      <circle r="${R}" fill="none" stroke="#e6e9f0" stroke-width="30"/>
      <circle r="${R}" fill="none" stroke="#0a4bd4" stroke-width="30" stroke-linecap="round"
        stroke-dasharray="${dash.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/>
    </g>
  </g>
</svg>`;
}

module.exports = { card, defaultCard };
