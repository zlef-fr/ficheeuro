// Locale model shared by the server (URL routing) and the SEO layer. The DEFAULT
// locale owns the bare path; every other locale lives under "/<lang>" so each
// language has its own indexable URL. EN is default here (pan-European audience);
// the 23 other official EU languages are the alternates.
const BASE = "https://fichedepute.eu";
const DEFAULT = "en";
const LOCALES = ["bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"];
const OG_LOCALE = { bg: "bg_BG", cs: "cs_CZ", da: "da_DK", de: "de_DE", el: "el_GR", en: "en_GB", es: "es_ES", et: "et_EE", fi: "fi_FI", fr: "fr_FR", ga: "ga_IE", hr: "hr_HR", hu: "hu_HU", it: "it_IT", lt: "lt_LT", lv: "lv_LV", mt: "mt_MT", nl: "nl_NL", pl: "pl_PL", pt: "pt_PT", ro: "ro_RO", sk: "sk_SK", sl: "sl_SI", sv: "sv_SE" };

function parsePath(pathname) {
  const m = (pathname || "/").match(/^\/([a-z]{2})(\/.*)?$/);
  if (m && LOCALES.includes(m[1])) return { lang: m[1], path: m[2] || "/" };
  return { lang: DEFAULT, path: pathname || "/" };
}

function localized(path, lang) {
  const clean = !path || path === "/" ? "" : path.replace(/\/+$/, "");
  if (lang === DEFAULT) return clean || "/";
  return `/${lang}${clean}`;
}

module.exports = { BASE, DEFAULT, LOCALES, OG_LOCALE, parsePath, localized };
