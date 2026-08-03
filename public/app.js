// FicheDéputé.fr — SPA core: i18n, routing, data fetching, shared helpers.
const STD = (window.STD = {});

// ── i18n & locale routing (24 official EU languages → language picker, DA rule) ─
// The URL is authoritative: the default locale (EN) owns the bare path, every
// other locale lives under "/<lang>". Resolution order for what to render:
//   path prefix  →  ?lang=  →  (default). A zl-lang cookie only soft-redirects a
// returning visitor from the bare default path to their locale (bots carry no
// cookie, so the canonical stays crawlable).
const LOCALES = ["bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"];
const DEFAULT_LANG = "en";
const LANG_LABEL = { bg: "🇧🇬 Български", cs: "🇨🇿 Čeština", da: "🇩🇰 Dansk", de: "🇩🇪 Deutsch", el: "🇬🇷 Ελληνικά", en: "🇬🇧 English", es: "🇪🇸 Español", et: "🇪🇪 Eesti", fi: "🇫🇮 Suomi", fr: "🇫🇷 Français", ga: "🇮🇪 Gaeilge", hr: "🇭🇷 Hrvatski", hu: "🇭🇺 Magyar", it: "🇮🇹 Italiano", lt: "🇱🇹 Lietuvių", lv: "🇱🇻 Latviešu", mt: "🇲🇹 Malti", nl: "🇳🇱 Nederlands", pl: "🇵🇱 Polski", pt: "🇵🇹 Português", ro: "🇷🇴 Română", sk: "🇸🇰 Slovenčina", sl: "🇸🇮 Slovenščina", sv: "🇸🇪 Svenska" };
STD.LOCALES = LOCALES;
STD.LANG_LABEL = LANG_LABEL;
function cookie(name) {
  const m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return m ? decodeURIComponent(m.pop()) : null;
}
STD.stripLocale = (p) => {
  const m = p.match(/^\/([a-z]{2})(\/.*)?$/);
  return m && LOCALES.includes(m[1]) ? m[2] || "/" : p || "/";
};
STD.localized = (p, lang) => {
  const bare = STD.stripLocale(p);
  const clean = bare === "/" ? "" : bare;
  return lang === DEFAULT_LANG ? clean || "/" : `/${lang}${clean}`;
};
function pathLang() {
  const m = location.pathname.match(/^\/([a-z]{2})(\/|$)/);
  return m && LOCALES.includes(m[1]) ? m[1] : null;
}
function queryLang() {
  const q = new URLSearchParams(location.search).get("lang");
  return LOCALES.includes(q) ? q : null;
}
STD.lang = pathLang() || queryLang() || DEFAULT_LANG;
if (!pathLang() && queryLang()) history.replaceState({}, "", STD.localized(location.pathname, STD.lang));
else if (!pathLang() && !queryLang()) {
  const c = cookie("zl-lang");
  if (c && c !== DEFAULT_LANG && LOCALES.includes(c)) {
    STD.lang = c;
    history.replaceState({}, "", STD.localized(location.pathname, c));
  }
}
document.cookie = `zl-lang=${STD.lang};path=/;domain=.zlef.fr;max-age=31536000`;
document.documentElement.lang = STD.lang;
const DICT = window.STD_I18N;
STD.t = (key, vars) => {
  let s = (DICT[STD.lang] && DICT[STD.lang][key]) || DICT.en[key] || key;
  if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
  return s;
};

// ── helpers ───────────────────────────────────────────────────────────────
STD.esc = (s) => (s == null ? "" : String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c])));
STD.initials = (d) => ((d.prenom || " ")[0] + (d.nom || " ")[0]).toUpperCase();
const cache = {};
STD.getJSON = async (url) => {
  if (cache[url]) return cache[url];
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  const j = await r.json();
  cache[url] = j;
  return j;
};
STD.avatar = (d, cls = "") =>
  `<div class="avatar ${cls}" style="background:${STD.esc(d.groupeColor || d.groupe?.color || "#000091")}">${STD.initials(d)}</div>`;
// A group sigle means nothing on its own ("ESN"?), so the full name follows it
// everywhere. The EP publishes that name per language; anything it doesn't cover
// falls back to HowTheyVote's English label.
STD.GRP_L10N = {};                       // sigle → { lang: full name }
STD.COUNTRY = {};                        // ISO → country name in THIS locale
// Both labels are baked once in English for all 24 locales, so the SPA fetches the
// names it should be showing. One round trip each, in parallel with the view's own
// data; a view that prints either awaits STD.namesReady before its first render.
STD.groupNamesReady = STD.getJSON("/api/groupes")
  .then(({ groupes }) => groupes.forEach((g) => { if (g.libelleL10n) STD.GRP_L10N[g.sigle] = g.libelleL10n; }))
  .catch(() => {});                      // no localized names → pills keep the English label
STD.countryNamesReady = STD.getJSON("/api/countries?lang=" + encodeURIComponent(STD.lang))
  .then((m) => Object.assign(STD.COUNTRY, m))
  .catch(() => {});                      // → fall back to the baked English label
STD.namesReady = Promise.all([STD.groupNamesReady, STD.countryNamesReady]);
STD.grpName = (libelle, l10n) => {
  const d = l10n || {};
  return d[STD.lang] || d.en || libelle || "";
};
STD.grpPill = (sigle, libelle, color, l10n) =>
  `<span class="grp-pill" style="background:${STD.esc(color)}" title="${STD.esc(STD.grpName(libelle, l10n || STD.GRP_L10N[sigle]))}"><span class="grp-dot" style="background:rgba(255,255,255,.7)"></span>${STD.esc(sigle)}</span>`;
// MEPs are elected by country (no sub-constituency). depNom is baked as "🇫🇷 France"
// in English, so keep its flag and localize the name — a German reader gets
// "🇫🇷 Frankreich", which is also what the SSR of the same page renders.
STD.stripFlag = (s) => String(s || "").replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "").trim();
STD.country = (iso, fallback) => STD.COUNTRY[iso] || STD.stripFlag(fallback) || iso || "";
STD.circoLabel = (d) => {
  const flag = d.flag || (String(d.depNom || "").match(/[\u{1F1E6}-\u{1F1FF}]{2}/u) || [""])[0];
  const name = STD.country(d.dep, d.depNom);
  return [flag, name].filter(Boolean).join(" ");
};
STD.presenceColor = (v) => (v >= 50 ? "#18753c" : v >= 25 ? "#b34000" : "#e1000f");

STD.toast = (msg) => {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
};

// ── ring gauge (SVG) ──────────────────────────────────────────────────────
STD.ring = (value, color, label, sub) => {
  const R = 54, C = 2 * Math.PI * R, dash = (Math.max(0, Math.min(100, value)) / 100) * C;
  return `<div class="gauge"><div class="ring">
    <svg width="132" height="132" viewBox="0 0 132 132">
      <circle cx="66" cy="66" r="${R}" fill="none" stroke="#eef1f8" stroke-width="12"/>
      <circle cx="66" cy="66" r="${R}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
        stroke-dasharray="${dash.toFixed(1)} ${C.toFixed(1)}" style="transition:stroke-dasharray 1s cubic-bezier(.2,.8,.2,1)"/>
    </svg>
    <div class="rv"><b>${value.toFixed(1)}%</b></div>
  </div><div class="gl">${STD.esc(label)}</div><div class="gs">${STD.esc(sub || "")}</div></div>`;
};

// ── router ────────────────────────────────────────────────────────────────
const routes = [
  { re: /^\/$/, view: "home" },
  { re: /^\/deputes\/?$/, view: "list" },
  { re: /^\/depute\/([^/]+)\/?$/, view: "fiche" },
  { re: /^\/classements\/?$/, view: "rankings" },
  { re: /^\/groupes\/?$/, view: "groups" },
  { re: /^\/pays\/?$/, view: "pays" },
  { re: /^\/jeu\/?$/, view: "game" },
  { re: /^\/methode\/?$/, view: "methodo" },
];
STD.go = (path, replace) => {
  const full = STD.localized(path, STD.lang);
  if (replace) history.replaceState({}, "", full);
  else history.pushState({}, "", full);
  render();
};
// Switch locale in place: keep the current route, swap the prefix, re-render.
STD.setLang = (lang) => {
  if (!LOCALES.includes(lang) || lang === STD.lang) return;
  STD.lang = lang;
  document.cookie = `zl-lang=${lang};path=/;domain=.zlef.fr;max-age=31536000`;
  document.documentElement.lang = lang;
  history.replaceState({}, "", STD.localized(location.pathname, lang));
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = STD.t(el.dataset.i18n)));
  const sel = document.querySelector(".zl-langpick");
  if (sel) sel.value = lang;
  render();
};
function highlightNav(view) {
  document.querySelectorAll("nav.main a").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
  document.querySelector("nav.main")?.classList.remove("open");
}
async function render() {
  const path = STD.stripLocale(location.pathname);
  const root = document.getElementById("app");
  // No route matches → the not-found view. Falling back to home here used to make a
  // dead URL look like a working page (the server already answers 404 for it).
  const match = routes.find((r) => r.re.test(path)) || { re: /.*/, view: "notFound" };
  const m = path.match(match.re);
  highlightNav(match.view);
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  root.innerHTML = `<div class="wrap"><div class="spinner"></div></div>`;
  try {
    await STD.views[match.view](root, m);
    STD.track(path);
  } catch (e) {
    // A missing record (the API 404s on an unknown slug) is a not-found page, not an
    // error page — the server already answered 404 for this URL.
    if (String(e.message) === "404") return STD.views.notFound(root);
    console.error(e);
    root.innerHTML = `<div class="wrap block"><div class="prose"><h1>Oups</h1><p>${STD.esc(String(e))}</p><a class="btn btn-primary" href="/" data-link>${STD.t("fiche.back")}</a></div></div>`;
  }
}

// intercept internal links
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-link]");
  if (a && a.getAttribute("href")?.startsWith("/")) {
    e.preventDefault();
    STD.go(a.getAttribute("href"));
  }
});
window.addEventListener("popstate", render);

// ── per-page view counter ─────────────────────────────────────────────────
STD.track = async (path) => {
  try {
    const r = await fetch("/api/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path }),
    });
    const { count } = await r.json();
    // locale-aware plural: fr → 's' when >1, en → 's' when ≠1
    const s = STD.lang === "fr" ? (count > 1 ? "s" : "") : (count === 1 ? "" : "s");
    const label = STD.t("footer.views", { n: count == null ? "" : count.toLocaleString(STD.lang), s });
    document.querySelectorAll("[data-views]").forEach((el) => {
      if (count == null) { el.hidden = true; return; }
      el.textContent = label;
      el.hidden = false;
    });
  } catch {}
};

STD.render = render;
// Build the global language picker (24 official EU languages → dropdown, per DA).
STD.mountLangpick = () => {
  const host = document.querySelector("[data-langpick]");
  if (!host || host.querySelector(".zl-langpick")) return;
  const sel = document.createElement("select");
  sel.className = "zl-langpick";
  sel.setAttribute("aria-label", "Language");
  for (const l of LOCALES) {
    const o = document.createElement("option");
    o.value = l;
    o.textContent = LANG_LABEL[l];
    if (l === STD.lang) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener("change", (e) => STD.setLang(e.target.value));
  host.appendChild(sel);
};

STD.boot = () => {
  // translate static chrome
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = STD.t(el.dataset.i18n)));
  STD.mountLangpick();
  render();
};
