// SEO layer. From the live data it produces: a full sitemap (every page + all
// fiches, each with hreflang alternates across the 24 locales), robots.txt, and —
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
  bg: {
    "/": [`${B} — Живият профил на вашия евродепутат`, `Участие, гласувания и отсъствия на вашия евродепутат в Европейския парламент — на ясен език и изцяло базирано на официални отворени данни.`],
    "/deputes": [`Всички евродепутати — ${B}`, `Търсете и сравнявайте 719-те членове на Европейския парламент (2024-2029): участие, гласувания, политическа група и държава.`],
    "/classements": [`Класации на евродепутатите — ${B}`, `Най-редовните, най-отсъстващите, най-активните, най-лоялните и най-непокорните в Европейския парламент.`],
    "/groupes": [`Политически групи — ${B}`, `Средно участие и големина на всяка политическа група в Европейския парламент.`],
    "/pays": [`Евродепутати по държава — ${B}`, `719-те евродепутати по държава членка: места, средно участие и лоялност към групата по държава.`],
    "/jeu": [`Познай евродепутата — ${B}`, `Гражданската игра: участие + 3 гласа ЗА и 3 гласа ПРОТИВ — познайте чий е профилът.`],
    "/methode": [`Метод и източници — ${B}`, `Откъде идват цифрите: поименните гласувания на Европейския парламент, обобщени от HowTheyVote.eu (CC-BY).`],
  },
  cs: {
    "/": [`${B} — Živá karta vašeho europoslance`, `Účast, hlasování a absence vašeho europoslance v Evropském parlamentu — srozumitelně a plně doložené z oficiálních otevřených dat.`],
    "/deputes": [`Všichni europoslanci — ${B}`, `Prohledejte a porovnejte 719 poslanců Evropského parlamentu (2024-2029): účast, hlasování, politickou skupinu a zemi.`],
    "/classements": [`Žebříčky europoslanců — ${B}`, `Nejpilnější, nejčastěji nepřítomní, nejaktivnější, nejloajálnější a největší rebelové Evropského parlamentu.`],
    "/groupes": [`Politické skupiny — ${B}`, `Průměrná účast a velikost jednotlivých politických skupin v Evropském parlamentu.`],
    "/pays": [`Europoslanci podle zemí — ${B}`, `719 europoslanců podle členských států: křesla, průměrná účast a loajalita ke skupině podle zemí.`],
    "/jeu": [`Uhodni europoslance — ${B}`, `Občanská hra: účast + 3 hlasy PRO a 3 hlasy PROTI — uhodněte, čí je to karta.`],
    "/methode": [`Metodika a zdroje — ${B}`, `Odkud čísla pocházejí: jmenovitá hlasování Evropského parlamentu, agregovaná portálem HowTheyVote.eu (CC-BY).`],
  },
  da: {
    "/": [`${B} — Den levende profil af din MEP`, `Deltagelse, afstemninger og fravær for din MEP i Europa-Parlamentet — i et klart sprog og med fuld kildeangivelse fra officielle åbne data.`],
    "/deputes": [`Alle MEP'er — ${B}`, `Søg og sammenlign de 719 medlemmer af Europa-Parlamentet (2024-2029): deltagelse, afstemninger, politisk gruppe og land.`],
    "/classements": [`MEP-ranglister — ${B}`, `De mest flittige, de mest fraværende, de mest aktive, de mest loyale og de største oprørere i Europa-Parlamentet.`],
    "/groupes": [`Politiske grupper — ${B}`, `Gennemsnitlig deltagelse og størrelse for hver politisk gruppe i Europa-Parlamentet.`],
    "/pays": [`MEP'er efter land — ${B}`, `De 719 MEP'er efter medlemsstat: mandater, gennemsnitlig deltagelse og gruppeloyalitet pr. land.`],
    "/jeu": [`Gæt MEP'en — ${B}`, `Det civile spil: deltagelse + 3 FOR-stemmer og 3 IMOD-stemmer — gæt, hvis profil det er.`],
    "/methode": [`Metode og kilder — ${B}`, `Hvor tallene stammer fra: Europa-Parlamentets afstemninger ved navneopråb, samlet af HowTheyVote.eu (CC-BY).`],
  },
  el: {
    "/": [`${B} — Η ζωντανή καρτέλα του ευρωβουλευτή σας`, `Συμμετοχή, ψήφοι και απουσίες του ευρωβουλευτή σας στο Ευρωπαϊκό Κοινοβούλιο — με απλά λόγια και πλήρως τεκμηριωμένα από επίσημα ανοικτά δεδομένα.`],
    "/deputes": [`Όλοι οι ευρωβουλευτές — ${B}`, `Αναζητήστε και συγκρίνετε τους 719 βουλευτές του Ευρωπαϊκού Κοινοβουλίου (2024-2029): συμμετοχή, ψήφοι, πολιτική ομάδα και χώρα.`],
    "/classements": [`Κατατάξεις ευρωβουλευτών — ${B}`, `Οι πιο συνεπείς, οι πιο απόντες, οι πιο ενεργοί, οι πιο αφοσιωμένοι και οι πιο ανυπότακτοι του Ευρωπαϊκού Κοινοβουλίου.`],
    "/groupes": [`Πολιτικές ομάδες — ${B}`, `Μέση συμμετοχή και μέγεθος κάθε πολιτικής ομάδας στο Ευρωπαϊκό Κοινοβούλιο.`],
    "/pays": [`Ευρωβουλευτές ανά χώρα — ${B}`, `Οι 719 ευρωβουλευτές ανά κράτος μέλος: έδρες, μέση συμμετοχή και αφοσίωση στην ομάδα ανά χώρα.`],
    "/jeu": [`Μάντεψε τον ευρωβουλευτή — ${B}`, `Το πολιτειακό παιχνίδι: συμμετοχή + 3 ψήφοι ΥΠΕΡ και 3 ψήφοι ΚΑΤΑ — μάντεψε σε ποιον ανήκει η καρτέλα.`],
    "/methode": [`Μέθοδος & πηγές — ${B}`, `Από πού προέρχονται οι αριθμοί: οι ονομαστικές ψηφοφορίες του Ευρωπαϊκού Κοινοβουλίου, συγκεντρωμένες από το HowTheyVote.eu (CC-BY).`],
  },
  et: {
    "/": [`${B} — Teie eurosaadiku elav profiil`, `Teie eurosaadiku osalus, hääletused ja puudumised Euroopa Parlamendis — lihtsas keeles ja täielikult allikaviidatud ametlikest avaandmetest.`],
    "/deputes": [`Kõik eurosaadikud — ${B}`, `Otsi ja võrdle Euroopa Parlamendi 719 liiget (2024-2029): osalus, hääletused, fraktsioon ja riik.`],
    "/classements": [`Eurosaadikute edetabelid — ${B}`, `Euroopa Parlamendi kõige hoolsamad, kõige rohkem puudunud, kõige aktiivsemad, kõige truumad ja suurimad mässajad.`],
    "/groupes": [`Poliitilised fraktsioonid — ${B}`, `Iga Euroopa Parlamendi poliitilise fraktsiooni keskmine osalus ja suurus.`],
    "/pays": [`Eurosaadikud riikide kaupa — ${B}`, `719 eurosaadikut liikmesriikide kaupa: kohad, keskmine osalus ja fraktsioonitruudus riigiti.`],
    "/jeu": [`Arva ära eurosaadik — ${B}`, `Kodanikumäng: osalus + 3 POOLT-häält ja 3 VASTU-häält — arva ära, kelle profiiliga on tegemist.`],
    "/methode": [`Metoodika ja allikad — ${B}`, `Kust arvud pärinevad: Euroopa Parlamendi nimelised hääletused, mille on koondanud HowTheyVote.eu (CC-BY).`],
  },
  fi: {
    "/": [`${B} — Meppisi elävä profiili`, `Meppisi osallistuminen, äänet ja poissaolot Euroopan parlamentissa — selkeästi ja täysin lähteytettynä virallisiin avoimiin tietoihin.`],
    "/deputes": [`Kaikki mepit — ${B}`, `Hae ja vertaile Euroopan parlamentin 719 jäsentä (2024-2029): osallistuminen, äänet, poliittinen ryhmä ja maa.`],
    "/classements": [`Meppien sijoitukset — ${B}`, `Euroopan parlamentin ahkerimmat, eniten poissa olevat, aktiivisimmat, uskollisimmat ja eniten linjasta poikkeavat.`],
    "/groupes": [`Poliittiset ryhmät — ${B}`, `Euroopan parlamentin kunkin poliittisen ryhmän keskimääräinen osallistuminen ja koko.`],
    "/pays": [`Mepit maittain — ${B}`, `719 meppiä jäsenvaltioittain: paikat, keskimääräinen osallistuminen ja ryhmäuskollisuus maittain.`],
    "/jeu": [`Arvaa meppi — ${B}`, `Kansalaispeli: osallistuminen + 3 PUOLESTA-ääntä ja 3 VASTAAN-ääntä — arvaa, kenen profiili se on.`],
    "/methode": [`Menetelmä ja lähteet — ${B}`, `Mistä luvut ovat peräisin: Euroopan parlamentin nimenhuutoäänestykset, jotka HowTheyVote.eu on koonnut (CC-BY).`],
  },
  ga: {
    "/": [`${B} — Taifead beo d'Fheisire`, `Rannpháirtíocht, vótaí agus asláithreachtaí d'Fheisire i bParlaimint na hEorpa — i dteanga shoiléir, foinsithe go hiomlán ó shonraí oscailte oifigiúla.`],
    "/deputes": [`Na Feisirí uile — ${B}`, `Cuardaigh agus déan comparáid idir na 719 Feisire de Pharlaimint na hEorpa (2024-2029): rannpháirtíocht, vótaí, grúpa polaitiúil agus tír.`],
    "/classements": [`Rangúcháin na bhFeisirí — ${B}`, `Na feisirí is dícheallaí, is minice as láthair, is gníomhaí, is dílse agus na ceannairceoirí is mó i bParlaimint na hEorpa.`],
    "/groupes": [`Grúpaí polaitiúla — ${B}`, `Meán-rannpháirtíocht agus méid gach grúpa polaitiúil i bParlaimint na hEorpa.`],
    "/pays": [`Feisirí de réir tíre — ${B}`, `Na 719 Feisire de réir Ballstáit: suíocháin, meán-rannpháirtíocht agus dílseacht don ghrúpa in aghaidh na tíre.`],
    "/jeu": [`Tomhais an Feisire — ${B}`, `An cluiche saoránach: rannpháirtíocht + 3 vóta AR SON agus 3 vóta IN AGHAIDH — tomhais cé leis an taifead.`],
    "/methode": [`Modheolaíocht & foinsí — ${B}`, `Cad as a dtagann na figiúirí: vótaí le glaoch rolla Pharlaimint na hEorpa, arna gcomhbhailiú ag HowTheyVote.eu (CC-BY).`],
  },
  hr: {
    "/": [`${B} — Živi profil vašeg eurozastupnika`, `Sudjelovanje, glasovi i izostanci vašeg eurozastupnika u Europskom parlamentu — jasno i u cijelosti potkrijepljeno službenim otvorenim podacima.`],
    "/deputes": [`Svi eurozastupnici — ${B}`, `Pretražite i usporedite 719 zastupnika u Europskom parlamentu (2024-2029): sudjelovanje, glasovi, klub zastupnika i država.`],
    "/classements": [`Ljestvice eurozastupnika — ${B}`, `Najredovitiji, najčešće odsutni, najaktivniji, najodaniji i najveći buntovnici Europskog parlamenta.`],
    "/groupes": [`Klubovi zastupnika — ${B}`, `Prosječno sudjelovanje i veličina svakog kluba zastupnika u Europskom parlamentu.`],
    "/pays": [`Eurozastupnici po državama — ${B}`, `719 eurozastupnika po državama članicama: broj mjesta, prosječno sudjelovanje i odanost klubu po državi.`],
    "/jeu": [`Pogodi eurozastupnika — ${B}`, `Građanska igra: sudjelovanje + 3 glasa ZA i 3 glasa PROTIV — pogodi čiji je to profil.`],
    "/methode": [`Metodologija i izvori — ${B}`, `Odakle dolaze brojke: poimenična glasovanja Europskog parlamenta, agregirana od HowTheyVote.eu (CC-BY).`],
  },
  hu: {
    "/": [`${B} — Az Ön EP-képviselőjének élő adatlapja`, `Az Ön EP-képviselőjének részvétele, szavazatai és távollétei az Európai Parlamentben — közérthetően, teljes körűen hivatalos nyílt adatokból.`],
    "/deputes": [`Az összes EP-képviselő — ${B}`, `Keresse és hasonlítsa össze az Európai Parlament 719 képviselőjét (2024-2029): részvétel, szavazatok, képviselőcsoport és ország.`],
    "/classements": [`Képviselői rangsorok — ${B}`, `Az Európai Parlament legszorgalmasabb, legtöbbet hiányzó, legaktívabb, leghűségesebb és leglázadóbb képviselői.`],
    "/groupes": [`Képviselőcsoportok — ${B}`, `Az Európai Parlament egyes képviselőcsoportjainak átlagos részvétele és mérete.`],
    "/pays": [`EP-képviselők országonként — ${B}`, `A 719 EP-képviselő tagállamonként: mandátumok, átlagos részvétel és csoporthűség országonként.`],
    "/jeu": [`Találd ki a képviselőt — ${B}`, `A civil játék: részvétel + 3 MELLETTE és 3 ELLENE szavazat — találd ki, kinek az adatlapja.`],
    "/methode": [`Módszertan és források — ${B}`, `Honnan származnak az adatok: az Európai Parlament név szerinti szavazásai, a HowTheyVote.eu összesítésében (CC-BY).`],
  },
  lt: {
    "/": [`${B} — Gyvoji jūsų europarlamentaro (-ės) kortelė`, `Jūsų europarlamentaro dalyvavimas, balsavimai ir neatvykimai Europos Parlamente — aiškia kalba, remiantis oficialiais atviraisiais duomenimis.`],
    "/deputes": [`Visi europarlamentarai — ${B}`, `Ieškokite ir palyginkite 719 Europos Parlamento narių (2024-2029): dalyvavimą, balsavimus, frakciją ir šalį.`],
    "/classements": [`Europarlamentarų reitingai — ${B}`, `Stropiausi, dažniausiai nedalyvaujantys, aktyviausi, lojaliausi ir labiausiai maištaujantys Europos Parlamento nariai.`],
    "/groupes": [`Politinės frakcijos — ${B}`, `Kiekvienos Europos Parlamento politinės frakcijos vidutinis dalyvavimas ir dydis.`],
    "/pays": [`Europarlamentarai pagal šalį — ${B}`, `719 europarlamentarų pagal valstybę narę: vietos, vidutinis dalyvavimas ir lojalumas frakcijai kiekvienoje šalyje.`],
    "/jeu": [`Atspėk europarlamentarą — ${B}`, `Pilietinis žaidimas: dalyvavimas + 3 balsai UŽ ir 3 balsai PRIEŠ — atspėk, kieno tai kortelė.`],
    "/methode": [`Metodika ir šaltiniai — ${B}`, `Iš kur šie skaičiai: Europos Parlamento vardiniai balsavimai, apibendrinti HowTheyVote.eu (CC-BY).`],
  },
  lv: {
    "/": [`${B} — Jūsu Eiropas Parlamenta deputāta dzīvais profils`, `Jūsu deputāta līdzdalība, balsojumi un prombūtne Eiropas Parlamentā — vienkāršā valodā un pilnībā balstīti oficiālajos atvērtajos datos.`],
    "/deputes": [`Visi deputāti — ${B}`, `Meklējiet un salīdziniet 719 Eiropas Parlamenta deputātus (2024–2029): līdzdalība, balsojumi, politiskā grupa un valsts.`],
    "/classements": [`Deputātu reitingi — ${B}`, `Eiropas Parlamenta visčaklākie, visbiežāk prombūtnē esošie, visaktīvākie, vislojālākie un vislielākie dumpinieki.`],
    "/groupes": [`Politiskās grupas — ${B}`, `Katras Eiropas Parlamenta politiskās grupas vidējā līdzdalība un lielums.`],
    "/pays": [`Deputāti pa valstīm — ${B}`, `719 deputāti pa dalībvalstīm: vietas, vidējā līdzdalība un lojalitāte grupai katrā valstī.`],
    "/jeu": [`Uzmini deputātu — ${B}`, `Pilsoniskā spēle: līdzdalība + 3 balsojumi PAR un 3 balsojumi PRET — uzmini, kura deputāta profils tas ir.`],
    "/methode": [`Metodika un avoti — ${B}`, `No kurienes nāk skaitļi: Eiropas Parlamenta balsojumi pēc saraksta, ko apkopojis HowTheyVote.eu (CC-BY).`],
  },
  mt: {
    "/": [`${B} — Il-profil ħaj tal-MPE tiegħek`, `Parteċipazzjoni, voti u assenzi tal-MPE tiegħek fil-Parlament Ewropew — b'lingwaġġ ċar, b'sorsi kompluti mid-data miftuħa uffiċjali.`],
    "/deputes": [`Il-MPE kollha — ${B}`, `Fittex u qabbel is-719-il membru tal-Parlament Ewropew (2024-2029): parteċipazzjoni, voti, grupp politiku u pajjiż.`],
    "/classements": [`Klassifiki tal-MPE — ${B}`, `L-aktar diliġenti, l-aktar assenti, l-aktar attivi, l-aktar leali u l-akbar ribelli tal-Parlament Ewropew.`],
    "/groupes": [`Gruppi politiċi — ${B}`, `Il-parteċipazzjoni medja u d-daqs ta' kull grupp politiku fil-Parlament Ewropew.`],
    "/pays": [`MPE skont il-pajjiż — ${B}`, `Is-719-il MPE skont l-Istat Membru: siġġijiet, parteċipazzjoni medja u lealtà lejn il-grupp għal kull pajjiż.`],
    "/jeu": [`Aqta' min hu l-MPE — ${B}`, `Il-logħba ċivika: parteċipazzjoni + 3 voti FAVUR u 3 voti KONTRA — aqta' ta' min hu l-profil.`],
    "/methode": [`Metodu u sorsi — ${B}`, `Minn fejn ġejjin iċ-ċifri: il-votazzjonijiet b'sejħa tal-ismijiet tal-Parlament Ewropew, miġbura minn HowTheyVote.eu (CC-BY).`],
  },
  nl: {
    "/": [`${B} — Het levende profiel van uw europarlementariër`, `Deelname, stemmingen en afwezigheden van uw europarlementariër in het Europees Parlement — in begrijpelijke taal en volledig met bronnen uit officiële open data.`],
    "/deputes": [`Alle europarlementariërs — ${B}`, `Zoek en vergelijk de 719 leden van het Europees Parlement (2024-2029): deelname, stemmingen, fractie en land.`],
    "/classements": [`Ranglijsten van europarlementariërs — ${B}`, `De meest ijverige, de meest afwezige, de meest actieve, de meest trouwe en de grootste rebellen van het Europees Parlement.`],
    "/groupes": [`Politieke fracties — ${B}`, `Gemiddelde deelname en omvang van elke fractie in het Europees Parlement.`],
    "/pays": [`Europarlementariërs per land — ${B}`, `De 719 europarlementariërs per lidstaat: zetels, gemiddelde deelname en fractietrouw per land.`],
    "/jeu": [`Raad de europarlementariër — ${B}`, `Het burgerspel: deelname + 3 VOOR-stemmen en 3 TEGEN-stemmen — raad om wiens profiel het gaat.`],
    "/methode": [`Methode & bronnen — ${B}`, `Waar de cijfers vandaan komen: de hoofdelijke stemmingen van het Europees Parlement, samengevoegd door HowTheyVote.eu (CC-BY).`],
  },
  pl: {
    "/": [`${B} — Żywa karta Twojego europosła`, `Frekwencja, głosowania i nieobecności Twojego europosła w Parlamencie Europejskim — prostym językiem, w pełni udokumentowane w oparciu o oficjalne otwarte dane.`],
    "/deputes": [`Wszyscy europosłowie — ${B}`, `Przeszukuj i porównuj 719 posłów do Parlamentu Europejskiego (2024-2029): udział w głosowaniach, głosy, grupa polityczna i kraj.`],
    "/classements": [`Rankingi europosłów — ${B}`, `Najbardziej obecni, najbardziej nieobecni, najbardziej aktywni, najbardziej lojalni oraz najwięksi buntownicy Parlamentu Europejskiego.`],
    "/groupes": [`Grupy polityczne — ${B}`, `Średni udział w głosowaniach i liczebność każdej grupy politycznej w Parlamencie Europejskim.`],
    "/pays": [`Europosłowie według kraju — ${B}`, `719 posłów do Parlamentu Europejskiego według państwa członkowskiego: mandaty, średni udział w głosowaniach i lojalność wobec grupy w rozbiciu na kraje.`],
    "/jeu": [`Zgadnij europosła — ${B}`, `Gra obywatelska: udział w głosowaniach + 3 głosy ZA i 3 głosy PRZECIW — zgadnij, czyj to profil.`],
    "/methode": [`Metoda i źródła — ${B}`, `Skąd pochodzą liczby: głosowania imienne Parlamentu Europejskiego, zebrane przez HowTheyVote.eu (CC-BY).`],
  },
  pt: {
    "/": [`${B} — A ficha viva do seu eurodeputado/a`, `Participação, votos e ausências do seu eurodeputado/a no Parlamento Europeu — de forma clara e com fontes nos dados abertos oficiais.`],
    "/deputes": [`Todos os eurodeputados — ${B}`, `Procure e compare os 719 deputados ao Parlamento Europeu (2024-2029): participação, votos, grupo político e país.`],
    "/classements": [`Classificações dos eurodeputados — ${B}`, `Os mais assíduos, os mais ausentes, os mais ativos, os mais fiéis e os mais rebeldes do Parlamento Europeu.`],
    "/groupes": [`Grupos políticos — ${B}`, `Participação média e dimensão de cada grupo político no Parlamento Europeu.`],
    "/pays": [`Eurodeputados por país — ${B}`, `Os 719 eurodeputados por Estado-Membro: lugares, participação média e fidelidade ao grupo por país.`],
    "/jeu": [`Adivinha o eurodeputado — ${B}`, `O jogo cívico: participação + 3 votos A FAVOR e 3 votos CONTRA — adivinha de quem é a ficha.`],
    "/methode": [`Método e fontes — ${B}`, `De onde vêm os números: as votações nominais do Parlamento Europeu, agregadas pela HowTheyVote.eu (CC-BY).`],
  },
  ro: {
    "/": [`${B} — Fișa vie a eurodeputatului dumneavoastră`, `Participarea, voturile și absențele eurodeputatului dumneavoastră la Parlamentul European — pe înțelesul tuturor și integral documentate din datele deschise oficiale.`],
    "/deputes": [`Toți eurodeputații — ${B}`, `Căutați și comparați cei 719 deputați ai Parlamentului European (2024-2029): participare, voturi, grup politic și țară.`],
    "/classements": [`Clasamentele eurodeputaților — ${B}`, `Cei mai asidui, cei mai absenți, cei mai activi, cei mai loiali și cei mai rebeli din Parlamentul European.`],
    "/groupes": [`Grupurile politice — ${B}`, `Participarea medie și dimensiunea fiecărui grup politic din Parlamentul European.`],
    "/pays": [`Eurodeputații pe țări — ${B}`, `Cei 719 eurodeputați pe state membre: locuri, participare medie și loialitate față de grup pe fiecare țară.`],
    "/jeu": [`Ghicește eurodeputatul — ${B}`, `Jocul civic: participare + 3 voturi PENTRU și 3 voturi ÎMPOTRIVĂ — ghicește a cui este fișa.`],
    "/methode": [`Metodă și surse — ${B}`, `De unde provin cifrele: voturile prin apel nominal ale Parlamentului European, agregate de HowTheyVote.eu (CC-BY).`],
  },
  sk: {
    "/": [`${B} — Živá karta vášho europoslanca`, `Účasť, hlasovania a absencie vášho europoslanca v Európskom parlamente — zrozumiteľne a s uvedením oficiálnych otvorených dát.`],
    "/deputes": [`Všetci europoslanci — ${B}`, `Vyhľadajte a porovnajte 719 poslancov Európskeho parlamentu (2024-2029): účasť, hlasovania, politickú skupinu a krajinu.`],
    "/classements": [`Rebríčky europoslancov — ${B}`, `Najusilovnejší, najčastejšie neprítomní, najaktívnejší, najvernejší a najväčší rebeli Európskeho parlamentu.`],
    "/groupes": [`Politické skupiny — ${B}`, `Priemerná účasť a veľkosť každej politickej skupiny v Európskom parlamente.`],
    "/pays": [`Europoslanci podľa krajín — ${B}`, `719 europoslancov podľa členských štátov: kreslá, priemerná účasť a vernosť skupine podľa krajiny.`],
    "/jeu": [`Uhádni europoslanca — ${B}`, `Občianska hra: účasť + 3 hlasy ZA a 3 hlasy PROTI — uhádni, koho karta to je.`],
    "/methode": [`Metodika a zdroje — ${B}`, `Odkiaľ pochádzajú čísla: hlasovania podľa mien Európskeho parlamentu, agregované platformou HowTheyVote.eu (CC-BY).`],
  },
  sl: {
    "/": [`${B} — Živi profil vašega evropskega poslanca/-ke`, `Udeležba, glasovanja in odsotnosti vašega evropskega poslanca v Evropskem parlamentu — razumljivo in v celoti podprto z uradnimi odprtimi podatki.`],
    "/deputes": [`Vsi poslanci — ${B}`, `Iščite in primerjajte 719 poslancev Evropskega parlamenta (2024-2029): udeležba, glasovanja, politična skupina in država.`],
    "/classements": [`Lestvice poslancev — ${B}`, `Najbolj prizadevni, najbolj odsotni, najbolj dejavni, najbolj zvesti in največji uporniki Evropskega parlamenta.`],
    "/groupes": [`Politične skupine — ${B}`, `Povprečna udeležba in velikost vsake politične skupine v Evropskem parlamentu.`],
    "/pays": [`Poslanci po državah — ${B}`, `719 poslancev po državah članicah: sedeži, povprečna udeležba in zvestoba skupini po državah.`],
    "/jeu": [`Ugani poslanca — ${B}`, `Državljanska igra: udeležba + 3 glasovi ZA in 3 glasovi PROTI — ugani, čigav profil je.`],
    "/methode": [`Metoda in viri — ${B}`, `Od kod izhajajo številke: poimenska glasovanja Evropskega parlamenta, ki jih zbira HowTheyVote.eu (CC-BY).`],
  },
  sv: {
    "/": [`${B} — Den levande profilen för din Europaparlamentariker`, `Deltagande, omröstningar och frånvaro för din Europaparlamentariker i Europaparlamentet – i klartext och med fullständiga källor från officiella öppna data.`],
    "/deputes": [`Alla ledamöter — ${B}`, `Sök och jämför de 719 ledamöterna av Europaparlamentet (2024-2029): deltagande, omröstningar, politisk grupp och land.`],
    "/classements": [`Rankningar av ledamöter — ${B}`, `De flitigaste, de mest frånvarande, de mest aktiva, de mest lojala och de största rebellerna i Europaparlamentet.`],
    "/groupes": [`Politiska grupper — ${B}`, `Genomsnittligt deltagande och storlek för varje politisk grupp i Europaparlamentet.`],
    "/pays": [`Ledamöter per land — ${B}`, `De 719 ledamöterna per medlemsstat: mandat, genomsnittligt deltagande och lojalitet mot gruppen per land.`],
    "/jeu": [`Gissa Europaparlamentarikern — ${B}`, `Det medborgerliga spelet: deltagande + 3 FÖR-röster och 3 MOT-röster – gissa vems profil det är.`],
    "/methode": [`Metod och källor — ${B}`, `Varifrån siffrorna kommer: Europaparlamentets omröstningar med namnupprop, sammanställda av HowTheyVote.eu (CC-BY).`],
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
    bg: `${name}, член на Европейския парламент от ${country} (${d.groupe}). ${pres}% участие в поименните гласувания, история на гласуванията и лоялност към групата — изцяло с посочени източници (Европейски парламент).`,
    cs: `${name}, poslanec/poslankyně Evropského parlamentu za ${country} (${d.groupe}). ${pres}% účast na jmenovitých hlasováních, přehled hlasování a loajalita ke skupině — plně doložené (Evropský parlament).`,
    da: `${name}, medlem af Europa-Parlamentet for ${country} (${d.groupe}). ${pres}% deltagelse ved navneopråb, stemmehistorik og gruppeloyalitet — med fuld kildeangivelse (Europa-Parlamentet).`,
    el: `${name}, Βουλευτής του Ευρωπαϊκού Κοινοβουλίου για ${country} (${d.groupe}). ${pres}% συμμετοχή στις ονομαστικές ψηφοφορίες, ιστορικό ψήφων και αφοσίωση στην ομάδα — πλήρως τεκμηριωμένα (Ευρωπαϊκό Κοινοβούλιο).`,
    et: `${name}, Euroopa Parlamendi liige (${country}, ${d.groupe}). Osalus nimelistel hääletustel ${pres}%, hääletuskäitumine ja fraktsioonitruudus — täielikult allikaviidatud (Euroopa Parlament).`,
    fi: `${name}, Euroopan parlamentin jäsen (${country}, ${d.groupe}). Osallistuminen nimenhuutoäänestyksiin ${pres} %, äänestyshistoria ja ryhmäuskollisuus — täysin lähteytetty (Euroopan parlamentti).`,
    ga: `${name}, Feisire de Pharlaimint na hEorpa do ${country} (${d.groupe}). ${pres}% rannpháirtíocht sa vótáil le glaoch rolla, taifead vótála agus dílseacht don ghrúpa — foinsithe go hiomlán (Parlaimint na hEorpa).`,
    hr: `${name}, zastupnik/ca u Europskom parlamentu za ${country} (${d.groupe}). ${pres}% sudjelovanja u poimeničnim glasovanjima, glasačka evidencija i odanost klubu — u cijelosti potkrijepljeno izvorima (Europski parlament).`,
    hu: `${name}, ${country} európai parlamenti képviselője (${d.groupe}). ${pres}% részvétel a név szerinti szavazásokon, szavazatai és csoporthűsége — teljes körű forrásmegjelöléssel (Európai Parlament).`,
    lt: `${name}, Europos Parlamento narys (-ė) iš ${country} (${d.groupe}). ${pres}% dalyvavimas vardiniuose balsavimuose, balsavimų istorija ir lojalumas frakcijai — su nurodytais šaltiniais (Europos Parlamentas).`,
    lv: `${name}, Eiropas Parlamenta deputāts no ${country} (${d.groupe}). ${pres}% līdzdalība balsojumos pēc saraksta, balsojumu vēsture un lojalitāte grupai — pilnībā balstīts avotos (Eiropas Parlaments).`,
    mt: `${name}, Membru tal-Parlament Ewropew għal ${country} (${d.groupe}). ${pres}% parteċipazzjoni fil-votazzjonijiet b'sejħa tal-ismijiet, rekord tal-votazzjonijiet u lealtà lejn il-grupp — b'sorsi sħaħ (Parlament Ewropew).`,
    nl: `${name}, lid van het Europees Parlement voor ${country} (${d.groupe}). ${pres}% deelname aan hoofdelijke stemmingen, stemgedrag en fractietrouw — volledig met bronnen (Europees Parlement).`,
    pl: `${name}, posłanka/poseł do Parlamentu Europejskiego z ${country} (${d.groupe}). ${pres}% udziału w głosowaniach imiennych, historia głosowań i lojalność wobec grupy — w pełni udokumentowane (Parlament Europejski).`,
    pt: `${name}, eurodeputado/a de ${country} (${d.groupe}). ${pres}% de participação nas votações nominais, votos e fidelidade ao grupo — com fontes oficiais (Parlamento Europeu).`,
    ro: `${name}, deputat în Parlamentul European din partea ${country} (${d.groupe}). ${pres}% participare la voturile prin apel nominal, voturi și loialitate față de grup — integral din surse (Parlamentul European).`,
    sk: `${name}, poslanec Európskeho parlamentu za ${country} (${d.groupe}). ${pres} % účasť na hlasovaniach podľa mien, prehľad hlasovaní a vernosť skupine — s uvedením zdrojov (Európsky parlament).`,
    sl: `${name}, poslanec/-ka Evropskega parlamenta za ${country} (${d.groupe}). ${pres} % udeležba na poimenskih glasovanjih, zgodovina glasovanj in zvestoba skupini — v celoti podprto z viri (Evropski parlament).`,
    sv: `${name}, ledamot av Europaparlamentet för ${country} (${d.groupe}). ${pres}% deltagande i omröstningar med namnupprop, röstningsmönster och lojalitet mot gruppen – med fullständiga källor (Europaparlamentet).`,
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
  bg: "Европейски парламент",
  cs: "Evropský parlament",
  da: "Europa-Parlamentet",
  el: "Ευρωπαϊκό Κοινοβούλιο",
  et: "Euroopa Parlament",
  fi: "Euroopan parlamentti",
  ga: "Parlaimint na hEorpa",
  hr: "Europski parlament",
  hu: "Európai Parlament",
  lt: "Europos Parlamentas",
  lv: "Eiropas Parlaments",
  mt: "Parlament Ewropew",
  nl: "Europees Parlement",
  pl: "Parlament Europejski",
  pt: "Parlamento Europeu",
  ro: "Parlamentul European",
  sk: "Európsky parlament",
  sl: "Evropski parlament",
  sv: "Europaparlamentet",
};
const MEP_TITLE = {
  en: "Member of the European Parliament", fr: "Députée / Député au Parlement européen",
  de: "Mitglied des Europäischen Parlaments", es: "Eurodiputada / Eurodiputado",
  it: "Deputata / Deputato al Parlamento europeo",
  bg: "Член на Европейския парламент",
  cs: "Poslankyně / poslanec Evropského parlamentu",
  da: "Medlem af Europa-Parlamentet",
  el: "Βουλευτής του Ευρωπαϊκού Κοινοβουλίου",
  et: "Euroopa Parlamendi liige",
  fi: "Euroopan parlamentin jäsen",
  ga: "Feisire de Pharlaimint na hEorpa",
  hr: "Zastupnica / zastupnik u Europskom parlamentu",
  hu: "Európai parlamenti képviselő",
  lt: "Europos Parlamento narys / narė",
  lv: "Eiropas Parlamenta deputāts / deputāte",
  mt: "Membru tal-Parlament Ewropew",
  nl: "Lid van het Europees Parlement",
  pl: "Posłanka / Poseł do Parlamentu Europejskiego",
  pt: "Deputada / Deputado ao Parlamento Europeu",
  ro: "Deputată / Deputat în Parlamentul European",
  sk: "Poslankyňa/poslanec Európskeho parlamentu",
  sl: "Poslanka / Poslanec Evropskega parlamenta",
  sv: "Ledamot av Europaparlamentet",
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
