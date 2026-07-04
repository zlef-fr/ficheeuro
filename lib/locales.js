// Locale model shared by the server (URL routing) and the SEO layer. The DEFAULT
// locale owns the bare path; every other locale lives under "/<lang>" so each
// language has its own indexable URL. EN is default here (pan-European audience);
// FR/DE/ES/IT are the alternates.
const BASE = "https://fichedepute.eu";
const DEFAULT = "en";
const LOCALES = ["en", "fr", "de", "es", "it"];
const OG_LOCALE = { en: "en_GB", fr: "fr_FR", de: "de_DE", es: "es_ES", it: "it_IT" };

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
