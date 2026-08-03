// Server-side render of the primary content for crawlers (and no-JS users).
// The SPA overwrites #app on boot, so this HTML is a faithful, indexable
// snapshot of the fiche / home. Localized (24 official EU languages); deliberately lean.
const { store } = require("./data");
const countries = require("./countries");

function esc(s) {
  return s == null ? "" : String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
}

// MEPs represent a country — the label is the localized country name.
function circoLabel(d, lang) {
  return countries.name(d.dep, lang, d.depNom);
}

// "ESN" alone tells a reader nothing: spell the group out in their language when the
// EP's own list gives us that name, else fall back to HowTheyVote's English label.
function groupName(d, lang) {
  const l10n = (store.groupesL10n || {})[d.groupe] || {};
  return l10n[lang] || l10n.en || d.groupeLibelle || d.groupe || "";
}

const T = {
  en: { role: "Member of the European Parliament", group: "Group", party: "National party", presence: "Roll-call turnout", participation: "Participation (votes cast)", loyalty: "Group loyalty", source: "Data: European Parliament (via HowTheyVote.eu, CC-BY)", homeH1: "Your MEP, in figures", homeLead: "Every figure comes from the European Parliament's official open data. No opinions, only facts.", tracked: "MEPs tracked", notFoundH1: "Page not found", notFoundLead: "This page does not exist. Search the %n MEPs of the European Parliament instead.", notFoundCta: "All MEPs" },
  fr: { role: "Eurodéputé·e", group: "Groupe", party: "Parti national", presence: "Participation aux scrutins", participation: "Participation (vote exprimé)", loyalty: "Loyauté au groupe", source: "Données : Parlement européen (via HowTheyVote.eu, CC-BY)", homeH1: "Votre eurodéputé·e, en chiffres", homeLead: "Chaque chiffre vient des données officielles du Parlement européen. Aucun avis, que des faits.", tracked: "eurodéputés suivis", notFoundH1: "Page introuvable", notFoundLead: "Cette page n'existe pas. Cherchez plutôt parmi les %n eurodéputés du Parlement européen.", notFoundCta: "Tous les eurodéputés" },
  de: { role: "Mitglied des Europäischen Parlaments", group: "Fraktion", party: "Nationale Partei", presence: "Teilnahme an Abstimmungen", participation: "Teilnahme (abgegebene Stimmen)", loyalty: "Fraktionstreue", source: "Daten: Europäisches Parlament (über HowTheyVote.eu, CC-BY)", homeH1: "Ihr/e Europaabgeordnete/r in Zahlen", homeLead: "Jede Zahl stammt aus den offiziellen Open Data des Europäischen Parlaments. Keine Meinungen, nur Fakten.", tracked: "erfasste Abgeordnete", notFoundH1: "Seite nicht gefunden", notFoundLead: "Diese Seite existiert nicht. Suchen Sie stattdessen unter den %n Abgeordneten des Europäischen Parlaments.", notFoundCta: "Alle Abgeordneten" },
  es: { role: "Eurodiputado/a", group: "Grupo", party: "Partido nacional", presence: "Participación en votaciones", participation: "Participación (votos emitidos)", loyalty: "Lealtad al grupo", source: "Datos: Parlamento Europeo (vía HowTheyVote.eu, CC-BY)", homeH1: "Tu eurodiputado/a, en cifras", homeLead: "Cada cifra procede de los datos abiertos oficiales del Parlamento Europeo. Sin opiniones, solo hechos.", tracked: "eurodiputados seguidos", notFoundH1: "Página no encontrada", notFoundLead: "Esta página no existe. Busque entre los %n eurodiputados del Parlamento Europeo.", notFoundCta: "Todos los eurodiputados" },
  it: { role: "Eurodeputato/a", group: "Gruppo", party: "Partito nazionale", presence: "Partecipazione ai voti", participation: "Partecipazione (voti espressi)", loyalty: "Fedeltà al gruppo", source: "Dati: Parlamento europeo (via HowTheyVote.eu, CC-BY)", homeH1: "Il tuo eurodeputato, in cifre", homeLead: "Ogni cifra proviene dai dati aperti ufficiali del Parlamento europeo. Nessuna opinione, solo fatti.", tracked: "eurodeputati seguiti", notFoundH1: "Pagina non trovata", notFoundLead: "Questa pagina non esiste. Cerca invece tra i %n eurodeputati del Parlamento europeo.", notFoundCta: "Tutti gli eurodeputati" },
  bg: { role: "Член на Европейския парламент", group: "Група", party: "Национална партия", presence: "Участие в поименните гласувания", participation: "Участие (подадени гласове)", loyalty: "Лоялност към групата", source: "Данни: Европейски парламент (чрез HowTheyVote.eu, CC-BY)", homeH1: "Вашият евродепутат в цифри", homeLead: "Всяка цифра идва от официалните отворени данни на Европейския парламент. Без мнения, само факти.", tracked: "проследявани евродепутати", notFoundH1: "Страницата не е намерена", notFoundLead: "Тази страница не съществува. Потърсете сред %n евродепутати в Европейския парламент.", notFoundCta: "Всички евродепутати" },
  cs: { role: "Poslanec/poslankyně Evropského parlamentu", group: "Skupina", party: "Národní strana", presence: "Účast na jmenovitých hlasováních", participation: "Účast (odevzdané hlasy)", loyalty: "Loajalita ke skupině", source: "Data: Evropský parlament (přes HowTheyVote.eu, CC-BY)", homeH1: "Váš europoslanec v číslech", homeLead: "Každé číslo pochází z oficiálních otevřených dat Evropského parlamentu. Žádné názory, jen fakta.", tracked: "sledovaných europoslanců", notFoundH1: "Stránka nenalezena", notFoundLead: "Tato stránka neexistuje. Hledejte raději mezi %n poslanci Evropského parlamentu.", notFoundCta: "Všichni poslanci" },
  da: { role: "Medlem af Europa-Parlamentet", group: "Gruppe", party: "Nationalt parti", presence: "Deltagelse ved navneopråb", participation: "Deltagelse (afgivne stemmer)", loyalty: "Gruppeloyalitet", source: "Data: Europa-Parlamentet (via HowTheyVote.eu, CC-BY)", homeH1: "Din MEP i tal", homeLead: "Alle tal stammer fra Europa-Parlamentets officielle åbne data. Ingen holdninger, kun fakta.", tracked: "MEP'er der følges", notFoundH1: "Siden blev ikke fundet", notFoundLead: "Denne side findes ikke. Søg i stedet blandt Europa-Parlamentets %n medlemmer.", notFoundCta: "Alle medlemmer" },
  el: { role: "Βουλευτής του Ευρωπαϊκού Κοινοβουλίου", group: "Ομάδα", party: "Εθνικό κόμμα", presence: "Συμμετοχή στις ονομαστικές ψηφοφορίες", participation: "Συμμετοχή (εκφρασμένες ψήφοι)", loyalty: "Αφοσίωση στην ομάδα", source: "Δεδομένα: Ευρωπαϊκό Κοινοβούλιο (μέσω HowTheyVote.eu, CC-BY)", homeH1: "Ο/Η ευρωβουλευτής σας, σε αριθμούς", homeLead: "Κάθε αριθμός προέρχεται από τα επίσημα ανοικτά δεδομένα του Ευρωπαϊκού Κοινοβουλίου. Καμία γνώμη, μόνο γεγονότα.", tracked: "ευρωβουλευτές υπό παρακολούθηση", notFoundH1: "Η σελίδα δεν βρέθηκε", notFoundLead: "Αυτή η σελίδα δεν υπάρχει. Αναζητήστε ανάμεσα στους %n ευρωβουλευτές του Ευρωπαϊκού Κοινοβουλίου.", notFoundCta: "Όλοι οι ευρωβουλευτές" },
  et: { role: "Euroopa Parlamendi liige", group: "Fraktsioon", party: "Riiklik erakond", presence: "Osalus nimelistel hääletustel", participation: "Osalemine (antud hääled)", loyalty: "Fraktsioonitruudus", source: "Andmed: Euroopa Parlament (HowTheyVote.eu kaudu, CC-BY)", homeH1: "Teie eurosaadik arvudes", homeLead: "Iga arv pärineb Euroopa Parlamendi ametlikest avaandmetest. Ei mingeid arvamusi, ainult faktid.", tracked: "jälgitavat eurosaadikut", notFoundH1: "Lehte ei leitud", notFoundLead: "Seda lehte ei ole olemas. Otsige hoopis Euroopa Parlamendi %n saadiku seast.", notFoundCta: "Kõik saadikud" },
  fi: { role: "Euroopan parlamentin jäsen", group: "Ryhmä", party: "Kansallinen puolue", presence: "Osallistuminen nimenhuutoäänestyksiin", participation: "Osallistuminen (annetut äänet)", loyalty: "Ryhmäuskollisuus", source: "Tiedot: Euroopan parlamentti (HowTheyVote.eu:n kautta, CC-BY)", homeH1: "Meppisi lukuina", homeLead: "Jokainen luku perustuu Euroopan parlamentin virallisiin avoimiin tietoihin. Ei mielipiteitä, vain faktoja.", tracked: "seurattua meppiä", notFoundH1: "Sivua ei löytynyt", notFoundLead: "Tätä sivua ei ole olemassa. Etsi sen sijaan Euroopan parlamentin %n mepin joukosta.", notFoundCta: "Kaikki mepit" },
  ga: { role: "Feisire de Pharlaimint na hEorpa", group: "Grúpa", party: "Páirtí náisiúnta", presence: "Rannpháirtíocht sa vótáil le glaoch rolla", participation: "Rannpháirtíocht (vótaí caite)", loyalty: "Dílseacht don ghrúpa", source: "Sonraí: Parlaimint na hEorpa (trí HowTheyVote.eu, CC-BY)", homeH1: "D'Fheisire, i bhfigiúirí", homeLead: "Tagann gach figiúr ó shonraí oscailte oifigiúla Pharlaimint na hEorpa. Gan tuairimí, fíricí amháin.", tracked: "Feisirí á rianú", notFoundH1: "Leathanach gan aimsiú", notFoundLead: "Níl an leathanach seo ann. Cuardaigh i measc %n Feisire de Pharlaimint na hEorpa ina ionad.", notFoundCta: "Gach Feisire" },
  hr: { role: "Zastupnik/ca u Europskom parlamentu", group: "Klub", party: "Nacionalna stranka", presence: "Sudjelovanje u poimeničnim glasovanjima", participation: "Sudjelovanje (dani glasovi)", loyalty: "Odanost klubu", source: "Podaci: Europski parlament (putem HowTheyVote.eu, CC-BY)", homeH1: "Vaš eurozastupnik/ca u brojkama", homeLead: "Svaka brojka dolazi iz službenih otvorenih podataka Europskog parlamenta. Bez mišljenja, samo činjenice.", tracked: "praćenih eurozastupnika", notFoundH1: "Stranica nije pronađena", notFoundLead: "Ova stranica ne postoji. Umjesto toga pretražite %n zastupnika Europskog parlamenta.", notFoundCta: "Svi zastupnici" },
  hu: { role: "Európai parlamenti képviselő", group: "Képviselőcsoport", party: "Nemzeti párt", presence: "Részvétel a név szerinti szavazásokon", participation: "Részvétel (leadott szavazatok)", loyalty: "Csoporthűség", source: "Adatok: Európai Parlament (a HowTheyVote.eu révén, CC-BY)", homeH1: "Az Ön EP-képviselője számokban", homeLead: "Minden adat az Európai Parlament hivatalos nyílt adataiból származik. Semmi vélemény, csak tények.", tracked: "nyomon követett képviselő", notFoundH1: "Az oldal nem található", notFoundLead: "Ez az oldal nem létezik. Keressen inkább az Európai Parlament %n képviselője között.", notFoundCta: "Összes képviselő" },
  lt: { role: "Europos Parlamento narys (-ė)", group: "Frakcija", party: "Nacionalinė partija", presence: "Dalyvavimas vardiniuose balsavimuose", participation: "Dalyvavimas (atiduota balsų)", loyalty: "Lojalumas frakcijai", source: "Duomenys: Europos Parlamentas (per HowTheyVote.eu, CC-BY)", homeH1: "Jūsų europarlamentaras (-ė) skaičiais", homeLead: "Kiekvienas skaičius paimtas iš oficialių Europos Parlamento atvirųjų duomenų. Jokių nuomonių, tik faktai.", tracked: "stebimų europarlamentarų", notFoundH1: "Puslapis nerastas", notFoundLead: "Šio puslapio nėra. Verčiau ieškokite tarp %n Europos Parlamento narių.", notFoundCta: "Visi nariai" },
  lv: { role: "Eiropas Parlamenta deputāts", group: "Grupa", party: "Nacionālā partija", presence: "Līdzdalība balsojumos", participation: "Līdzdalība (nodotie balsojumi)", loyalty: "Lojalitāte grupai", source: "Dati: Eiropas Parlaments (izmantojot HowTheyVote.eu, CC-BY)", homeH1: "Jūsu deputāts skaitļos", homeLead: "Katrs skaitlis nāk no Eiropas Parlamenta oficiālajiem atvērtajiem datiem. Nekādu viedokļu, tikai fakti.", tracked: "Sekotie deputāti", notFoundH1: "Lapa nav atrasta", notFoundLead: "Šī lapa neeksistē. Meklējiet starp %n Eiropas Parlamenta deputātiem.", notFoundCta: "Visi deputāti" },
  mt: { role: "Membru tal-Parlament Ewropew", group: "Grupp", party: "Partit nazzjonali", presence: "Parteċipazzjoni fil-votazzjonijiet b'sejħa tal-ismijiet", participation: "Parteċipazzjoni (voti mixħuta)", loyalty: "Lealtà lejn il-grupp", source: "Data: Parlament Ewropew (permezz ta' HowTheyVote.eu, CC-BY)", homeH1: "Il-MPE tiegħek, f'ċifri", homeLead: "Kull ċifra ġejja mid-data miftuħa uffiċjali tal-Parlament Ewropew. L-ebda opinjoni, fatti biss.", tracked: "MPE segwiti", notFoundH1: "Il-paġna ma nstabitx", notFoundLead: "Din il-paġna ma teżistix. Fittex minflok fost il-%n MPE tal-Parlament Ewropew.", notFoundCta: "Il-MPE kollha" },
  nl: { role: "Lid van het Europees Parlement", group: "Fractie", party: "Nationale partij", presence: "Deelname aan hoofdelijke stemmingen", participation: "Deelname (uitgebrachte stemmen)", loyalty: "Fractietrouw", source: "Gegevens: Europees Parlement (via HowTheyVote.eu, CC-BY)", homeH1: "Uw europarlementariër, in cijfers", homeLead: "Elk cijfer komt uit de officiële open data van het Europees Parlement. Geen meningen, alleen feiten.", tracked: "gevolgde europarlementariërs", notFoundH1: "Pagina niet gevonden", notFoundLead: "Deze pagina bestaat niet. Zoek in plaats daarvan tussen de %n leden van het Europees Parlement.", notFoundCta: "Alle leden" },
  pl: { role: "Poseł do Parlamentu Europejskiego", group: "Grupa", party: "Partia krajowa", presence: "Udział w głosowaniach imiennych", participation: "Udział (oddane głosy)", loyalty: "Lojalność wobec grupy", source: "Dane: Parlament Europejski (za pośrednictwem HowTheyVote.eu, CC-BY)", homeH1: "Twój europoseł w liczbach", homeLead: "Każda liczba pochodzi z oficjalnych otwartych danych Parlamentu Europejskiego. Żadnych opinii, tylko fakty.", tracked: "śledzonych europosłów", notFoundH1: "Nie znaleziono strony", notFoundLead: "Ta strona nie istnieje. Poszukaj wśród %n posłów do Parlamentu Europejskiego.", notFoundCta: "Wszyscy posłowie" },
  pt: { role: "Deputado/a ao Parlamento Europeu", group: "Grupo", party: "Partido nacional", presence: "Participação nas votações", participation: "Participação (votos expressos)", loyalty: "Fidelidade ao grupo", source: "Dados: Parlamento Europeu (via HowTheyVote.eu, CC-BY)", homeH1: "O seu eurodeputado/a, em números", homeLead: "Cada número provém dos dados abertos oficiais do Parlamento Europeu. Sem opiniões, apenas factos.", tracked: "eurodeputados acompanhados", notFoundH1: "Página não encontrada", notFoundLead: "Esta página não existe. Procure entre os %n deputados ao Parlamento Europeu.", notFoundCta: "Todos os deputados" },
  ro: { role: "Deputat/ă în Parlamentul European", group: "Grup", party: "Partid național", presence: "Participare la voturi", participation: "Participare (voturi exprimate)", loyalty: "Loialitate față de grup", source: "Date: Parlamentul European (prin HowTheyVote.eu, CC-BY)", homeH1: "Eurodeputatul/a dumneavoastră, în cifre", homeLead: "Fiecare cifră provine din datele deschise oficiale ale Parlamentului European. Nicio opinie, doar fapte.", tracked: "eurodeputați urmăriți", notFoundH1: "Pagina nu a fost găsită", notFoundLead: "Această pagină nu există. Căutați printre cei %n deputați în Parlamentul European.", notFoundCta: "Toți deputații" },
  sk: { role: "Poslanec Európskeho parlamentu", group: "Skupina", party: "Národná strana", presence: "Účasť na hlasovaniach podľa mien", participation: "Účasť (odovzdané hlasy)", loyalty: "Vernosť skupine", source: "Údaje: Európsky parlament (cez HowTheyVote.eu, CC-BY)", homeH1: "Váš europoslanec v číslach", homeLead: "Každé číslo pochádza z oficiálnych otvorených dát Európskeho parlamentu. Žiadne názory, len fakty.", tracked: "sledovaných europoslancov", notFoundH1: "Stránka sa nenašla", notFoundLead: "Táto stránka neexistuje. Hľadajte radšej medzi %n poslancami Európskeho parlamentu.", notFoundCta: "Všetci poslanci" },
  sl: { role: "Poslanec Evropskega parlamenta", group: "Skupina", party: "Nacionalna stranka", presence: "Udeležba na poimenskih glasovanjih", participation: "Udeležba (oddani glasovi)", loyalty: "Zvestoba skupini", source: "Podatki: Evropski parlament (prek HowTheyVote.eu, CC-BY)", homeH1: "Vaš evropski poslanec/-ka v številkah", homeLead: "Vsaka številka izhaja iz uradnih odprtih podatkov Evropskega parlamenta. Brez mnenj, samo dejstva.", tracked: "spremljanih poslancev", notFoundH1: "Strani ni mogoče najti", notFoundLead: "Ta stran ne obstaja. Raje poiščite med %n poslanci Evropskega parlamenta.", notFoundCta: "Vsi poslanci" },
  sv: { role: "Ledamot av Europaparlamentet", group: "Grupp", party: "Nationellt parti", presence: "Deltagande i omröstningar", participation: "Deltagande (avgivna röster)", loyalty: "Lojalitet mot gruppen", source: "Data: Europaparlamentet (via HowTheyVote.eu, CC-BY)", homeH1: "Din Europaparlamentariker i siffror", homeLead: "Varje siffra kommer från Europaparlamentets officiella öppna data. Inga åsikter, bara fakta.", tracked: "ledamöter som följs", notFoundH1: "Sidan hittades inte", notFoundLead: "Den här sidan finns inte. Sök i stället bland Europaparlamentets %n ledamöter.", notFoundCta: "Alla ledamöter" },
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
  <p class="ssr-sub">${t.role} — ${esc(circoLabel(d, lang))} · ${t.group} : ${esc(groupName(d, lang))} (${esc(d.groupe)})${d.parti ? ` · ${t.party} : ${esc(d.parti)}` : ""}</p>
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

// The body for a route that does not exist. Rendered server-side so a crawler (and a
// no-JS reader) sees a real not-found page, not an empty shell or a home clone.
function notFound(lang) {
  const t = T[lang] || T.en;
  const n = (store.deputes || []).length;
  return `<section class="wrap ssr-home ssr-404">
  <h1>${esc(t.notFoundH1)}</h1>
  <p>${esc(t.notFoundLead.replace("%n", n))}</p>
  <p><a href="/deputes">${esc(t.notFoundCta)}</a></p>
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

// The not-found copy, for the SEO layer to reuse as <title>/description — so the
// 24 translations live in exactly one place.
function notFoundText(lang) {
  const t = T[lang] || T.en;
  return { h1: t.notFoundH1, lead: t.notFoundLead.replace("%n", (store.deputes || []).length) };
}

module.exports = { render, notFound, notFoundText, circoLabel, groupName };
