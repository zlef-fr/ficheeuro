// EU member-state names per UI locale, keyed by the ISO code used in the data
// (note: Greece is "GR" here, not "EL"). Localized names matter for EU SEO — a
// German voter searches "Abgeordnete Finnland", not "Finland".
const NAMES = {
  AT: { en: "Austria", fr: "Autriche", de: "Österreich", es: "Austria", it: "Austria" },
  BE: { en: "Belgium", fr: "Belgique", de: "Belgien", es: "Bélgica", it: "Belgio" },
  BG: { en: "Bulgaria", fr: "Bulgarie", de: "Bulgarien", es: "Bulgaria", it: "Bulgaria" },
  HR: { en: "Croatia", fr: "Croatie", de: "Kroatien", es: "Croacia", it: "Croazia" },
  CY: { en: "Cyprus", fr: "Chypre", de: "Zypern", es: "Chipre", it: "Cipro" },
  CZ: { en: "Czechia", fr: "Tchéquie", de: "Tschechien", es: "Chequia", it: "Cechia" },
  DK: { en: "Denmark", fr: "Danemark", de: "Dänemark", es: "Dinamarca", it: "Danimarca" },
  EE: { en: "Estonia", fr: "Estonie", de: "Estland", es: "Estonia", it: "Estonia" },
  FI: { en: "Finland", fr: "Finlande", de: "Finnland", es: "Finlandia", it: "Finlandia" },
  FR: { en: "France", fr: "France", de: "Frankreich", es: "Francia", it: "Francia" },
  DE: { en: "Germany", fr: "Allemagne", de: "Deutschland", es: "Alemania", it: "Germania" },
  GR: { en: "Greece", fr: "Grèce", de: "Griechenland", es: "Grecia", it: "Grecia" },
  HU: { en: "Hungary", fr: "Hongrie", de: "Ungarn", es: "Hungría", it: "Ungheria" },
  IE: { en: "Ireland", fr: "Irlande", de: "Irland", es: "Irlanda", it: "Irlanda" },
  IT: { en: "Italy", fr: "Italie", de: "Italien", es: "Italia", it: "Italia" },
  LV: { en: "Latvia", fr: "Lettonie", de: "Lettland", es: "Letonia", it: "Lettonia" },
  LT: { en: "Lithuania", fr: "Lituanie", de: "Litauen", es: "Lituania", it: "Lituania" },
  LU: { en: "Luxembourg", fr: "Luxembourg", de: "Luxemburg", es: "Luxemburgo", it: "Lussemburgo" },
  MT: { en: "Malta", fr: "Malte", de: "Malta", es: "Malta", it: "Malta" },
  NL: { en: "Netherlands", fr: "Pays-Bas", de: "Niederlande", es: "Países Bajos", it: "Paesi Bassi" },
  PL: { en: "Poland", fr: "Pologne", de: "Polen", es: "Polonia", it: "Polonia" },
  PT: { en: "Portugal", fr: "Portugal", de: "Portugal", es: "Portugal", it: "Portogallo" },
  RO: { en: "Romania", fr: "Roumanie", de: "Rumänien", es: "Rumanía", it: "Romania" },
  SK: { en: "Slovakia", fr: "Slovaquie", de: "Slowakei", es: "Eslovaquia", it: "Slovacchia" },
  SI: { en: "Slovenia", fr: "Slovénie", de: "Slowenien", es: "Eslovenia", it: "Slovenia" },
  ES: { en: "Spain", fr: "Espagne", de: "Spanien", es: "España", it: "Spagna" },
  SE: { en: "Sweden", fr: "Suède", de: "Schweden", es: "Suecia", it: "Svezia" },
};

// Strip a leading flag emoji + spaces from a raw depNom fallback.
function stripFlag(s) {
  return String(s || "").replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "").trim();
}

// Country name for an ISO code in a locale; falls back to the flag-stripped
// raw depNom (English) when the code is unknown.
function name(iso, lang, fallback) {
  const row = NAMES[iso];
  if (row && row[lang]) return row[lang];
  if (row && row.en) return row.en;
  return stripFlag(fallback) || iso || "";
}

module.exports = { name, stripFlag, NAMES };
