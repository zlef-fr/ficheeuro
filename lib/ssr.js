// Server-side render of the primary content for crawlers (and no-JS users).
// The SPA overwrites #app on boot, so this HTML is a faithful, indexable
// snapshot of the fiche / home. Localized (5 locales); deliberately lean.
const { store } = require("./data");
const countries = require("./countries");

function esc(s) {
  return s == null ? "" : String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
}

// MEPs represent a country — the label is the localized country name.
function circoLabel(d, lang) {
  return countries.name(d.dep, lang, d.depNom);
}

const T = {
  en: { role: "Member of the European Parliament", group: "Group", presence: "Roll-call turnout", participation: "Participation (votes cast)", loyalty: "Group loyalty", source: "Data: European Parliament (via HowTheyVote.eu, CC-BY)", homeH1: "Your MEP, in figures", homeLead: "Every figure comes from the European Parliament's official open data. No opinions, only facts.", tracked: "MEPs tracked" },
  fr: { role: "Eurodéputé·e", group: "Groupe", presence: "Participation aux scrutins", participation: "Participation (vote exprimé)", loyalty: "Loyauté au groupe", source: "Données : Parlement européen (via HowTheyVote.eu, CC-BY)", homeH1: "Votre eurodéputé·e, en chiffres", homeLead: "Chaque chiffre vient des données officielles du Parlement européen. Aucun avis, que des faits.", tracked: "eurodéputés suivis" },
  de: { role: "Mitglied des Europäischen Parlaments", group: "Fraktion", presence: "Teilnahme an Abstimmungen", participation: "Teilnahme (abgegebene Stimmen)", loyalty: "Fraktionstreue", source: "Daten: Europäisches Parlament (über HowTheyVote.eu, CC-BY)", homeH1: "Ihr/e Europaabgeordnete/r in Zahlen", homeLead: "Jede Zahl stammt aus den offiziellen Open Data des Europäischen Parlaments. Keine Meinungen, nur Fakten.", tracked: "erfasste Abgeordnete" },
  es: { role: "Eurodiputado/a", group: "Grupo", presence: "Participación en votaciones", participation: "Participación (votos emitidos)", loyalty: "Lealtad al grupo", source: "Datos: Parlamento Europeo (vía HowTheyVote.eu, CC-BY)", homeH1: "Tu eurodiputado/a, en cifras", homeLead: "Cada cifra procede de los datos abiertos oficiales del Parlamento Europeo. Sin opiniones, solo hechos.", tracked: "eurodiputados seguidos" },
  it: { role: "Eurodeputato/a", group: "Gruppo", presence: "Partecipazione ai voti", participation: "Partecipazione (voti espressi)", loyalty: "Fedeltà al gruppo", source: "Dati: Parlamento europeo (via HowTheyVote.eu, CC-BY)", homeH1: "Il tuo eurodeputato, in cifre", homeLead: "Ogni cifra proviene dai dati aperti ufficiali del Parlamento europeo. Nessuna opinione, solo fatti.", tracked: "eurodeputati seguiti" },
};

function fiche(d, lang) {
  const t = T[lang] || T.en;
  const name = esc(`${d.prenom} ${d.nom}`);
  const rows = [
    [t.presence, d.presence != null ? `${d.presence}%` : "—"],
    [t.loyalty, d.loyalty != null ? `${d.loyalty}%` : "—"],
  ];
  return `<article class="wrap ssr-fiche">
  <h1>${name}</h1>
  <p class="ssr-sub">${t.role} — ${esc(circoLabel(d, lang))} · ${t.group} : ${esc(d.groupeLibelle || d.groupe)} (${esc(d.groupe)})</p>
  <dl class="ssr-stats">
    ${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("\n    ")}
  </dl>
  <p class="ssr-src">${esc(t.source)}</p>
</article>`;
}

function home(lang) {
  const t = T[lang] || T.en;
  const n = (store.deputes || []).length;
  return `<section class="wrap ssr-home">
  <h1>${esc(t.homeH1)}</h1>
  <p>${esc(t.homeLead)}</p>
  <p>${n} ${esc(t.tracked)}.</p>
</section>`;
}

function render(path, lang) {
  const p = (path || "/").replace(/\/+$/, "") || "/";
  if (p === "/") return home(lang);
  const m = p.match(/^\/depute\/([^/]+)$/);
  if (m) {
    const d = store.bySlug[decodeURIComponent(m[1])];
    if (d) return fiche(d, lang);
  }
  return "";
}

module.exports = { render, circoLabel };
