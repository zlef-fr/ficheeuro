// SEO layer. From the live data it produces: a full sitemap (every page + all
// fiches, each with hreflang alternates across the 5 locales), robots.txt, and —
// on every shell response — a localized <head> (title/description/canonical/OG/
// Twitter), hreflang + og:locale link set, JSON-LD (Person on a fiche, FAQPage
// on the method page), and a server-rendered content snapshot so crawlers see
// the numbers without running the SPA.
const { store } = require("./data");
const faq = require("./faq");
const L = require("./locales");
const ssr = require("./ssr");
const countries = require("./countries");

const BASE = L.BASE;
const OG_DEFAULT = `${BASE}/og.png`;

const STATIC = [
  { path: "/", priority: "1.0", freq: "daily" },
  { path: "/deputes", priority: "0.9", freq: "daily" },
  { path: "/classements", priority: "0.8", freq: "weekly" },
  { path: "/groupes", priority: "0.7", freq: "weekly" },
  { path: "/pays", priority: "0.7", freq: "weekly" },
  { path: "/jeu", priority: "0.6", freq: "weekly" },
  { path: "/methode", priority: "0.4", freq: "monthly" },
];

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
}
function attr(s) {
  return String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
}

function alternateLinks(routePath) {
  const links = L.LOCALES.map(
    (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE}${L.localized(routePath, lang)}"/>`
  );
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${L.localized(routePath, L.DEFAULT)}"/>`);
  return links.join("\n");
}

function sitemap() {
  const lastmod = (store.meta && store.meta.generatedAt) || null;
  const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  const urls = [];
  const entry = (routePath, freq, priority) => {
    urls.push(
      `  <url>\n    <loc>${BASE}${L.localized(routePath, L.DEFAULT)}</loc>${lm}\n` +
        `${alternateLinks(routePath)}\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    );
  };
  for (const r of STATIC) entry(r.path, r.freq, r.priority);
  for (const d of store.deputes || []) entry(`/depute/${xmlEscape(d.slug)}`, "weekly", "0.7");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${urls.join("\n")}\n</urlset>\n`
  );
}

function robots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`;
}

// ── localized <head> meta ─────────────────────────────────────────────────
const B = "FicheDéputé.eu";
const PAGES = {
  en: {
    "/": [`${B} — The living record of your MEP`, "Turnout, votes and absences of your MEP at the European Parliament — in plain language, fully sourced from official open data."],
    "/deputes": [`All MEPs — ${B}`, "Search and compare the 719 members of the European Parliament (2024-2029): turnout, votes, political group and country."],
    "/classements": [`MEP rankings — ${B}`, "The most diligent, the most absent, the most active, the most loyal and the biggest rebels of the European Parliament."],
    "/groupes": [`Political groups — ${B}`, "Average turnout and size of each political group in the European Parliament."],
    "/pays": [`MEPs by country — ${B}`, "The 719 MEPs by member state: seats, average turnout and group loyalty per country."],
    "/jeu": [`Guess the MEP — ${B}`, "The civic game: turnout + 3 FOR votes and 3 AGAINST votes — guess whose record it is."],
    "/methode": [`Method & sources — ${B}`, "Where the figures come from: the European Parliament's roll-call votes, aggregated by HowTheyVote.eu (CC-BY)."],
  },
  fr: {
    "/": [`${B} — La fiche vivante de votre eurodéputé·e`, "Participation, votes et absences de votre eurodéputé au Parlement européen — en clair et 100 % sourcé depuis les données officielles."],
    "/deputes": [`Tous les eurodéputés — ${B}`, "Cherchez et comparez les 719 eurodéputés du Parlement européen (2024-2029) : participation, votes, groupe et pays."],
    "/classements": [`Classements des eurodéputés — ${B}`, "Les plus assidus, les plus absents, les plus actifs, les plus loyaux et les plus frondeurs du Parlement européen."],
    "/groupes": [`Les groupes politiques — ${B}`, "Participation moyenne et effectifs de chaque groupe politique du Parlement européen."],
    "/pays": [`Les eurodéputés par pays — ${B}`, "Les 719 eurodéputés par État membre : sièges, participation moyenne et loyauté au groupe par pays."],
    "/jeu": [`Devine l'eurodéputé — ${B}`, "Le jeu civique : participation + 3 votes POUR et 3 votes CONTRE, à toi de deviner de quelle fiche il s'agit."],
    "/methode": [`Méthode & sources — ${B}`, "D'où viennent les chiffres : les votes par appel nominal du Parlement européen, agrégés par HowTheyVote.eu (CC-BY)."],
  },
  de: {
    "/": [`${B} — Das lebendige Profil Ihres/Ihrer Europaabgeordneten`, "Teilnahme, Abstimmungen und Abwesenheiten Ihres/Ihrer Europaabgeordneten im Europäischen Parlament — verständlich und vollständig belegt."],
    "/deputes": [`Alle Abgeordneten — ${B}`, "Durchsuchen und vergleichen Sie die 719 Mitglieder des Europäischen Parlaments (2024-2029): Teilnahme, Abstimmungen, Fraktion und Land."],
    "/classements": [`Ranglisten der Abgeordneten — ${B}`, "Die fleißigsten, die am häufigsten abwesenden, die aktivsten, die treuesten und die größten Abweichler des Europäischen Parlaments."],
    "/groupes": [`Die Fraktionen — ${B}`, "Durchschnittliche Teilnahme und Größe jeder Fraktion im Europäischen Parlament."],
    "/pays": [`Abgeordnete nach Land — ${B}`, "Die 719 Abgeordneten nach Mitgliedstaat: Sitze, durchschnittliche Teilnahme und Fraktionstreue pro Land."],
    "/jeu": [`Errate die/den Abgeordnete/n — ${B}`, "Das Bürgerspiel: Teilnahme + 3 DAFÜR- und 3 DAGEGEN-Stimmen — errate, um wen es sich handelt."],
    "/methode": [`Methode & Quellen — ${B}`, "Woher die Zahlen stammen: die namentlichen Abstimmungen des Europäischen Parlaments, aggregiert von HowTheyVote.eu (CC-BY)."],
  },
  es: {
    "/": [`${B} — La ficha viva de tu eurodiputado/a`, "Participación, votos y ausencias de tu eurodiputado/a en el Parlamento Europeo — en claro y con fuentes oficiales."],
    "/deputes": [`Todos los eurodiputados — ${B}`, "Busca y compara los 719 miembros del Parlamento Europeo (2024-2029): participación, votos, grupo político y país."],
    "/classements": [`Clasificaciones de eurodiputados — ${B}`, "Los más asiduos, los más ausentes, los más activos, los más leales y los más rebeldes del Parlamento Europeo."],
    "/groupes": [`Los grupos políticos — ${B}`, "Participación media y tamaño de cada grupo político del Parlamento Europeo."],
    "/pays": [`Eurodiputados por país — ${B}`, "Los 719 eurodiputados por Estado miembro: escaños, participación media y lealtad al grupo por país."],
    "/jeu": [`Adivina al eurodiputado — ${B}`, "El juego cívico: participación + 3 votos A FAVOR y 3 EN CONTRA — adivina de quién es la ficha."],
    "/methode": [`Método y fuentes — ${B}`, "De dónde salen las cifras: las votaciones nominales del Parlamento Europeo, agregadas por HowTheyVote.eu (CC-BY)."],
  },
  it: {
    "/": [`${B} — La scheda viva del tuo eurodeputato`, "Partecipazione, voti e assenze del tuo eurodeputato al Parlamento europeo — in chiaro e con fonti ufficiali."],
    "/deputes": [`Tutti gli eurodeputati — ${B}`, "Cerca e confronta i 719 membri del Parlamento europeo (2024-2029): partecipazione, voti, gruppo politico e paese."],
    "/classements": [`Classifiche degli eurodeputati — ${B}`, "I più assidui, i più assenti, i più attivi, i più fedeli e i più ribelli del Parlamento europeo."],
    "/groupes": [`I gruppi politici — ${B}`, "Partecipazione media e dimensione di ogni gruppo politico del Parlamento europeo."],
    "/pays": [`Eurodeputati per paese — ${B}`, "I 719 eurodeputati per Stato membro: seggi, partecipazione media e fedeltà al gruppo per paese."],
    "/jeu": [`Indovina l'eurodeputato — ${B}`, "Il gioco civico: partecipazione + 3 voti A FAVORE e 3 CONTRO — indovina di chi è la scheda."],
    "/methode": [`Metodo e fonti — ${B}`, "Da dove vengono le cifre: i voti per appello nominale del Parlamento europeo, aggregati da HowTheyVote.eu (CC-BY)."],
  },
};

function ficheMeta(d, lang) {
  const name = `${d.prenom} ${d.nom}`;
  const country = countries.name(d.dep, lang, d.depNom);
  const pres = d.presence;
  const T = {
    en: `${name}, Member of the European Parliament for ${country} (${d.groupe}). ${pres}% roll-call turnout, voting record and group loyalty — fully sourced (European Parliament).`,
    fr: `${name}, eurodéputé·e de ${country} (${d.groupe}). ${pres}% de participation aux votes par appel nominal, votes et loyauté au groupe — 100 % sourcé (Parlement européen).`,
    de: `${name}, Mitglied des Europäischen Parlaments für ${country} (${d.groupe}). ${pres}% Teilnahme an namentlichen Abstimmungen, Abstimmungsverhalten und Fraktionstreue — vollständig belegt (Europäisches Parlament).`,
    es: `${name}, eurodiputado/a por ${country} (${d.groupe}). ${pres}% de participación en votaciones nominales, historial de votos y lealtad al grupo — con fuentes oficiales (Parlamento Europeo).`,
    it: `${name}, deputato/a al Parlamento europeo per ${country} (${d.groupe}). ${pres}% di partecipazione ai voti per appello nominale, cronologia dei voti e fedeltà al gruppo — con fonti ufficiali (Parlamento europeo).`,
  };
  return { title: `${name} (${d.groupe}) — ${B}`, desc: T[lang] || T.en };
}

function metaFor(routePath, lang) {
  const p = (routePath || "/").replace(/\/+$/, "") || "/";
  const fiche = p.match(/^\/depute\/([^/]+)$/);
  if (fiche) {
    const d = store.bySlug[decodeURIComponent(fiche[1])];
    if (d) {
      const m = ficheMeta(d, lang);
      return { ...m, routePath: `/depute/${d.slug}`, og: `${BASE}/og/${d.slug}.png` };
    }
  }
  const dict = PAGES[lang] || PAGES[L.DEFAULT];
  const entry = dict[p] || PAGES[L.DEFAULT][p];
  if (entry) return { title: entry[0], desc: entry[1], routePath: p, og: OG_DEFAULT };
  const home = dict["/"];
  return { title: home[0], desc: home[1], routePath: "/", og: OG_DEFAULT };
}

// ── JSON-LD ───────────────────────────────────────────────────────────────
const EP_NAME = {
  en: "European Parliament", fr: "Parlement européen", de: "Europäisches Parlament",
  es: "Parlamento Europeo", it: "Parlamento europeo",
};
const MEP_TITLE = {
  en: "Member of the European Parliament", fr: "Députée / Député au Parlement européen",
  de: "Mitglied des Europäischen Parlaments", es: "Eurodiputada / Eurodiputado",
  it: "Deputata / Deputato al Parlamento europeo",
};

function personJsonLd(routePath, lang) {
  const m = routePath.match(/^\/depute\/([^/]+)$/);
  if (!m) return "";
  const d = store.bySlug[decodeURIComponent(m[1])];
  if (!d) return "";
  const url = `${BASE}${L.localized(`/depute/${d.slug}`, lang)}`;
  const ep = EP_NAME[lang] || EP_NAME.en;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${d.prenom} ${d.nom}`,
    jobTitle: MEP_TITLE[lang] || MEP_TITLE.en,
    url,
    memberOf: {
      "@type": "Organization",
      name: d.groupeLibelle || d.groupe,
      memberOf: { "@type": "GovernmentOrganization", name: ep },
    },
    affiliation: { "@type": "GovernmentOrganization", name: ep },
  };
  const country = countries.name(d.dep, lang, d.depNom);
  if (country) ld.workLocation = { "@type": "Country", name: country };
  return `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`;
}

function faqJsonLd(routePath, lang) {
  const p = (routePath || "/").replace(/\/+$/, "") || "/";
  if (p !== "/methode") return "";
  const list = faq[lang] || faq.en || faq.fr;
  const strip = (s) => String(s).replace(/<[^>]+>/g, "");
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: list.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: strip(x.a) } })),
  };
  return `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`;
}

// ── hreflang + og:locale link set ─────────────────────────────────────────
function hreflangTags(routePath) {
  const tags = L.LOCALES.map(
    (lang) => `<link rel="alternate" hreflang="${lang}" href="${attr(BASE + L.localized(routePath, lang))}">`
  );
  tags.push(`<link rel="alternate" hreflang="x-default" href="${attr(BASE + L.localized(routePath, L.DEFAULT))}">`);
  return tags.join("\n");
}
function ogLocaleTags(lang) {
  const cur = `<meta property="og:locale" content="${L.OG_LOCALE[lang] || L.OG_LOCALE[L.DEFAULT]}">`;
  const alt = L.LOCALES.filter((x) => x !== lang).map((x) => `<meta property="og:locale:alternate" content="${L.OG_LOCALE[x]}">`);
  return [cur, ...alt].join("\n");
}

function injectMeta(html, pathname) {
  const { lang, path } = L.parsePath(pathname);
  const m = metaFor(path, lang);
  const canonical = `${BASE}${L.localized(m.routePath, lang)}`;
  const t = attr(m.title), d = attr(m.desc), c = attr(canonical), o = attr(m.og);

  const headExtra = [hreflangTags(m.routePath), ogLocaleTags(lang), personJsonLd(m.routePath, lang), faqJsonLd(m.routePath, lang)]
    .filter(Boolean)
    .join("\n");

  html = html
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace("</head>", `${headExtra}\n</head>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(">)/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${c}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${c}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${o}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(">)/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(">)/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${o}$2`);

  const body = ssr.render(path, lang);
  if (body) html = html.replace(/(<main id="app">)[\s\S]*?(<\/main>)/, `$1${body}$2`);
  return html;
}

module.exports = { sitemap, robots, metaFor, injectMeta, BASE };
