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

const T = {
  en: { role: "Member of the European Parliament", group: "Group", presence: "Roll-call turnout", participation: "Participation (votes cast)", loyalty: "Group loyalty", source: "Data: European Parliament (via HowTheyVote.eu, CC-BY)", homeH1: "Your MEP, in figures", homeLead: "Every figure comes from the European Parliament's official open data. No opinions, only facts.", tracked: "MEPs tracked" },
  fr: { role: "Eurodéputé·e", group: "Groupe", presence: "Participation aux scrutins", participation: "Participation (vote exprimé)", loyalty: "Loyauté au groupe", source: "Données : Parlement européen (via HowTheyVote.eu, CC-BY)", homeH1: "Votre eurodéputé·e, en chiffres", homeLead: "Chaque chiffre vient des données officielles du Parlement européen. Aucun avis, que des faits.", tracked: "eurodéputés suivis" },
  de: { role: "Mitglied des Europäischen Parlaments", group: "Fraktion", presence: "Teilnahme an Abstimmungen", participation: "Teilnahme (abgegebene Stimmen)", loyalty: "Fraktionstreue", source: "Daten: Europäisches Parlament (über HowTheyVote.eu, CC-BY)", homeH1: "Ihr/e Europaabgeordnete/r in Zahlen", homeLead: "Jede Zahl stammt aus den offiziellen Open Data des Europäischen Parlaments. Keine Meinungen, nur Fakten.", tracked: "erfasste Abgeordnete" },
  es: { role: "Eurodiputado/a", group: "Grupo", presence: "Participación en votaciones", participation: "Participación (votos emitidos)", loyalty: "Lealtad al grupo", source: "Datos: Parlamento Europeo (vía HowTheyVote.eu, CC-BY)", homeH1: "Tu eurodiputado/a, en cifras", homeLead: "Cada cifra procede de los datos abiertos oficiales del Parlamento Europeo. Sin opiniones, solo hechos.", tracked: "eurodiputados seguidos" },
  it: { role: "Eurodeputato/a", group: "Gruppo", presence: "Partecipazione ai voti", participation: "Partecipazione (voti espressi)", loyalty: "Fedeltà al gruppo", source: "Dati: Parlamento europeo (via HowTheyVote.eu, CC-BY)", homeH1: "Il tuo eurodeputato, in cifre", homeLead: "Ogni cifra proviene dai dati aperti ufficiali del Parlamento europeo. Nessuna opinione, solo fatti.", tracked: "eurodeputati seguiti" },
  bg: { role: "Член на Европейския парламент", group: "Група", presence: "Участие в поименните гласувания", participation: "Участие (подадени гласове)", loyalty: "Лоялност към групата", source: "Данни: Европейски парламент (чрез HowTheyVote.eu, CC-BY)", homeH1: "Вашият евродепутат в цифри", homeLead: "Всяка цифра идва от официалните отворени данни на Европейския парламент. Без мнения, само факти.", tracked: "проследявани евродепутати" },
  cs: { role: "Poslanec/poslankyně Evropského parlamentu", group: "Skupina", presence: "Účast na jmenovitých hlasováních", participation: "Účast (odevzdané hlasy)", loyalty: "Loajalita ke skupině", source: "Data: Evropský parlament (přes HowTheyVote.eu, CC-BY)", homeH1: "Váš europoslanec v číslech", homeLead: "Každé číslo pochází z oficiálních otevřených dat Evropského parlamentu. Žádné názory, jen fakta.", tracked: "sledovaných europoslanců" },
  da: { role: "Medlem af Europa-Parlamentet", group: "Gruppe", presence: "Deltagelse ved navneopråb", participation: "Deltagelse (afgivne stemmer)", loyalty: "Gruppeloyalitet", source: "Data: Europa-Parlamentet (via HowTheyVote.eu, CC-BY)", homeH1: "Din MEP i tal", homeLead: "Alle tal stammer fra Europa-Parlamentets officielle åbne data. Ingen holdninger, kun fakta.", tracked: "MEP'er der følges" },
  el: { role: "Βουλευτής του Ευρωπαϊκού Κοινοβουλίου", group: "Ομάδα", presence: "Συμμετοχή στις ονομαστικές ψηφοφορίες", participation: "Συμμετοχή (εκφρασμένες ψήφοι)", loyalty: "Αφοσίωση στην ομάδα", source: "Δεδομένα: Ευρωπαϊκό Κοινοβούλιο (μέσω HowTheyVote.eu, CC-BY)", homeH1: "Ο/Η ευρωβουλευτής σας, σε αριθμούς", homeLead: "Κάθε αριθμός προέρχεται από τα επίσημα ανοικτά δεδομένα του Ευρωπαϊκού Κοινοβουλίου. Καμία γνώμη, μόνο γεγονότα.", tracked: "ευρωβουλευτές υπό παρακολούθηση" },
  et: { role: "Euroopa Parlamendi liige", group: "Fraktsioon", presence: "Osalus nimelistel hääletustel", participation: "Osalemine (antud hääled)", loyalty: "Fraktsioonitruudus", source: "Andmed: Euroopa Parlament (HowTheyVote.eu kaudu, CC-BY)", homeH1: "Teie eurosaadik arvudes", homeLead: "Iga arv pärineb Euroopa Parlamendi ametlikest avaandmetest. Ei mingeid arvamusi, ainult faktid.", tracked: "jälgitavat eurosaadikut" },
  fi: { role: "Euroopan parlamentin jäsen", group: "Ryhmä", presence: "Osallistuminen nimenhuutoäänestyksiin", participation: "Osallistuminen (annetut äänet)", loyalty: "Ryhmäuskollisuus", source: "Tiedot: Euroopan parlamentti (HowTheyVote.eu:n kautta, CC-BY)", homeH1: "Meppisi lukuina", homeLead: "Jokainen luku perustuu Euroopan parlamentin virallisiin avoimiin tietoihin. Ei mielipiteitä, vain faktoja.", tracked: "seurattua meppiä" },
  ga: { role: "Feisire de Pharlaimint na hEorpa", group: "Grúpa", presence: "Rannpháirtíocht sa vótáil le glaoch rolla", participation: "Rannpháirtíocht (vótaí caite)", loyalty: "Dílseacht don ghrúpa", source: "Sonraí: Parlaimint na hEorpa (trí HowTheyVote.eu, CC-BY)", homeH1: "D'Fheisire, i bhfigiúirí", homeLead: "Tagann gach figiúr ó shonraí oscailte oifigiúla Pharlaimint na hEorpa. Gan tuairimí, fíricí amháin.", tracked: "Feisirí á rianú" },
  hr: { role: "Zastupnik/ca u Europskom parlamentu", group: "Klub", presence: "Sudjelovanje u poimeničnim glasovanjima", participation: "Sudjelovanje (dani glasovi)", loyalty: "Odanost klubu", source: "Podaci: Europski parlament (putem HowTheyVote.eu, CC-BY)", homeH1: "Vaš eurozastupnik/ca u brojkama", homeLead: "Svaka brojka dolazi iz službenih otvorenih podataka Europskog parlamenta. Bez mišljenja, samo činjenice.", tracked: "praćenih eurozastupnika" },
  hu: { role: "Európai parlamenti képviselő", group: "Képviselőcsoport", presence: "Részvétel a név szerinti szavazásokon", participation: "Részvétel (leadott szavazatok)", loyalty: "Csoporthűség", source: "Adatok: Európai Parlament (a HowTheyVote.eu révén, CC-BY)", homeH1: "Az Ön EP-képviselője számokban", homeLead: "Minden adat az Európai Parlament hivatalos nyílt adataiból származik. Semmi vélemény, csak tények.", tracked: "nyomon követett képviselő" },
  lt: { role: "Europos Parlamento narys (-ė)", group: "Frakcija", presence: "Dalyvavimas vardiniuose balsavimuose", participation: "Dalyvavimas (atiduota balsų)", loyalty: "Lojalumas frakcijai", source: "Duomenys: Europos Parlamentas (per HowTheyVote.eu, CC-BY)", homeH1: "Jūsų europarlamentaras (-ė) skaičiais", homeLead: "Kiekvienas skaičius paimtas iš oficialių Europos Parlamento atvirųjų duomenų. Jokių nuomonių, tik faktai.", tracked: "stebimų europarlamentarų" },
  lv: { role: "Eiropas Parlamenta deputāts", group: "Grupa", presence: "Līdzdalība balsojumos", participation: "Līdzdalība (nodotie balsojumi)", loyalty: "Lojalitāte grupai", source: "Dati: Eiropas Parlaments (izmantojot HowTheyVote.eu, CC-BY)", homeH1: "Jūsu deputāts skaitļos", homeLead: "Katrs skaitlis nāk no Eiropas Parlamenta oficiālajiem atvērtajiem datiem. Nekādu viedokļu, tikai fakti.", tracked: "Sekotie deputāti" },
  mt: { role: "Membru tal-Parlament Ewropew", group: "Grupp", presence: "Parteċipazzjoni fil-votazzjonijiet b'sejħa tal-ismijiet", participation: "Parteċipazzjoni (voti mixħuta)", loyalty: "Lealtà lejn il-grupp", source: "Data: Parlament Ewropew (permezz ta' HowTheyVote.eu, CC-BY)", homeH1: "Il-MPE tiegħek, f'ċifri", homeLead: "Kull ċifra ġejja mid-data miftuħa uffiċjali tal-Parlament Ewropew. L-ebda opinjoni, fatti biss.", tracked: "MPE segwiti" },
  nl: { role: "Lid van het Europees Parlement", group: "Fractie", presence: "Deelname aan hoofdelijke stemmingen", participation: "Deelname (uitgebrachte stemmen)", loyalty: "Fractietrouw", source: "Gegevens: Europees Parlement (via HowTheyVote.eu, CC-BY)", homeH1: "Uw europarlementariër, in cijfers", homeLead: "Elk cijfer komt uit de officiële open data van het Europees Parlement. Geen meningen, alleen feiten.", tracked: "gevolgde europarlementariërs" },
  pl: { role: "Poseł do Parlamentu Europejskiego", group: "Grupa", presence: "Udział w głosowaniach imiennych", participation: "Udział (oddane głosy)", loyalty: "Lojalność wobec grupy", source: "Dane: Parlament Europejski (za pośrednictwem HowTheyVote.eu, CC-BY)", homeH1: "Twój europoseł w liczbach", homeLead: "Każda liczba pochodzi z oficjalnych otwartych danych Parlamentu Europejskiego. Żadnych opinii, tylko fakty.", tracked: "śledzonych europosłów" },
  pt: { role: "Deputado/a ao Parlamento Europeu", group: "Grupo", presence: "Participação nas votações", participation: "Participação (votos expressos)", loyalty: "Fidelidade ao grupo", source: "Dados: Parlamento Europeu (via HowTheyVote.eu, CC-BY)", homeH1: "O seu eurodeputado/a, em números", homeLead: "Cada número provém dos dados abertos oficiais do Parlamento Europeu. Sem opiniões, apenas factos.", tracked: "eurodeputados acompanhados" },
  ro: { role: "Deputat/ă în Parlamentul European", group: "Grup", presence: "Participare la voturi", participation: "Participare (voturi exprimate)", loyalty: "Loialitate față de grup", source: "Date: Parlamentul European (prin HowTheyVote.eu, CC-BY)", homeH1: "Eurodeputatul/a dumneavoastră, în cifre", homeLead: "Fiecare cifră provine din datele deschise oficiale ale Parlamentului European. Nicio opinie, doar fapte.", tracked: "eurodeputați urmăriți" },
  sk: { role: "Poslanec Európskeho parlamentu", group: "Skupina", presence: "Účasť na hlasovaniach podľa mien", participation: "Účasť (odovzdané hlasy)", loyalty: "Vernosť skupine", source: "Údaje: Európsky parlament (cez HowTheyVote.eu, CC-BY)", homeH1: "Váš europoslanec v číslach", homeLead: "Každé číslo pochádza z oficiálnych otvorených dát Európskeho parlamentu. Žiadne názory, len fakty.", tracked: "sledovaných europoslancov" },
  sl: { role: "Poslanec Evropskega parlamenta", group: "Skupina", presence: "Udeležba na poimenskih glasovanjih", participation: "Udeležba (oddani glasovi)", loyalty: "Zvestoba skupini", source: "Podatki: Evropski parlament (prek HowTheyVote.eu, CC-BY)", homeH1: "Vaš evropski poslanec/-ka v številkah", homeLead: "Vsaka številka izhaja iz uradnih odprtih podatkov Evropskega parlamenta. Brez mnenj, samo dejstva.", tracked: "spremljanih poslancev" },
  sv: { role: "Ledamot av Europaparlamentet", group: "Grupp", presence: "Deltagande i omröstningar", participation: "Deltagande (avgivna röster)", loyalty: "Lojalitet mot gruppen", source: "Data: Europaparlamentet (via HowTheyVote.eu, CC-BY)", homeH1: "Din Europaparlamentariker i siffror", homeLead: "Varje siffra kommer från Europaparlamentets officiella öppna data. Inga åsikter, bara fakta.", tracked: "ledamöter som följs" },
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
