// FicheDéputé.eu — FAQ content, single source of truth.
// Consumed by the client (/api/faq → Méthode page accordion) AND by the server
// (lib/seo.js injects a JSON-LD FAQPage on /methode so crawlers & AI lift the
// "presence not published per member" nuance without running JS).
// Answers may contain <b> for the rendered accordion; the JSON-LD builder strips tags.

const en = [
  {
    q: "Does the “ballot participation” rate mean the MEP was present at Parliament?",
    a: "No. It shows the share of <b>roll-call votes</b> — votes recorded name by name — in which the MEP actually cast a vote (for, against or abstention) since the start of the term. Physical presence in plenary, in committee or in debates <b>is not published per member</b> by the European Parliament, so it cannot be measured honestly — and we do not invent it.",
  },
  {
    q: "Why do attendance and participation show the same figure here, unlike the site on French MPs?",
    a: "European Parliament roll-calls only record four positions: for, against, abstention, and “did not vote” — and “did not vote” means absent. There is no “present but not voting” category (like the “non-voting” members at the French National Assembly), so attendance and participation are identical.",
  },
  {
    q: "Why does the President of the Parliament show a rate close to 0 %?",
    a: "The President chairs the sittings and votes only very rarely; every roll-call where they do not vote is recorded as “did not vote”. Their rate is therefore close to zero — which reflects their role, not absenteeism.",
  },
  {
    q: "Does a high rate mean the MEP is very present or works a lot?",
    a: "Not necessarily. Roll-call votes are grouped into short voting slots: an MEP can show up only for the vote and post a high rate while skipping committee work, debates and the rest of the week. This figure says nothing about committee work or engagement — which the Parliament does not publish per member. It also covers roll-call votes only, not votes taken by show of hands.",
  },
  {
    q: "Where does the data come from?",
    a: "From the roll-call votes of the European Parliament (2024-2029 term), aggregated and published by <b>HowTheyVote.eu</b> (CC-BY licence, based on the Parliament's official data). Each card links to the official vote. The last-updated date appears at the bottom of this page.",
  },
  {
    q: "Is the site politically biased?",
    a: "No. No interpretation, no value judgement: only raw, sourced figures, for everyone to interpret as they see fit.",
  },
];

const fr = [
  {
    q: "Le « taux de participation aux scrutins » veut-il dire que l'eurodéputé était présent au Parlement ?",
    a: "Non. Il indique la part des <b>votes par appel nominal</b> — les votes enregistrés nom par nom — où l'eurodéputé a réellement voté (pour, contre ou abstention) depuis le début du mandat. La présence physique en séance, en commission ou dans les débats <b>n'est pas publiée nominativement</b> par le Parlement européen : elle est donc impossible à mesurer honnêtement, et nous ne l'inventons pas.",
  },
  {
    q: "Pourquoi présence et participation affichent-ils le même chiffre ici, contrairement au site sur les députés français ?",
    a: "Les votes par appel nominal du Parlement européen n'enregistrent que quatre positions : pour, contre, abstention, et « n'a pas voté » — et « n'a pas voté » signifie absent. Il n'existe pas de catégorie « présent mais sans voter » (comme les « non-votants » à l'Assemblée nationale) : présence et participation sont donc identiques.",
  },
  {
    q: "Pourquoi la présidente du Parlement affiche-t-elle un taux proche de 0 % ?",
    a: "La présidente préside les séances et ne vote que très rarement ; chaque appel nominal où elle ne vote pas est enregistré comme « n'a pas voté ». Son taux est donc proche de zéro — ce qui reflète son rôle, pas de l'absentéisme.",
  },
  {
    q: "Un taux élevé signifie-t-il que l'eurodéputé est très présent ou travaille beaucoup ?",
    a: "Pas nécessairement. Les votes par appel nominal sont regroupés en courts créneaux : un eurodéputé peut n'apparaître que pour voter et afficher un taux élevé, tout en séchant les commissions, les débats et le reste de la semaine. Ce chiffre ne dit rien du travail en commission ni de l'engagement — que le Parlement ne publie pas nominativement. Il ne couvre par ailleurs que les votes par appel nominal, pas les votes à main levée.",
  },
  {
    q: "D'où viennent les données ?",
    a: "Des votes par appel nominal du Parlement européen (mandat 2024-2029), agrégés et publiés par <b>HowTheyVote.eu</b> (licence CC-BY, sur la base des données officielles du Parlement). Chaque fiche renvoie au vote officiel. La date de mise à jour figure en bas de cette page.",
  },
  {
    q: "Le site prend-il parti politiquement ?",
    a: "Non. Aucune interprétation, aucun jugement de valeur : uniquement des chiffres bruts et sourcés, à charge pour chacun de les interpréter.",
  },
];

const de = [
  {
    q: "Bedeutet die „Teilnahmequote an Abstimmungen“, dass der/die Abgeordnete im Parlament anwesend war?",
    a: "Nein. Sie gibt den Anteil der <b>namentlichen Abstimmungen</b> an — der Name für Name erfassten Stimmen — bei denen der/die Abgeordnete seit Mandatsbeginn tatsächlich abgestimmt hat (dafür, dagegen oder Enthaltung). Die physische Anwesenheit im Plenum, in Ausschüssen oder in Debatten <b>wird vom Europäischen Parlament nicht namentlich veröffentlicht</b>: Sie lässt sich daher nicht ehrlich messen — und wir erfinden sie nicht.",
  },
  {
    q: "Warum zeigen Präsenz und Teilnahme hier denselben Wert, anders als auf der Seite zu den französischen Abgeordneten?",
    a: "Die namentlichen Abstimmungen des Europäischen Parlaments erfassen nur vier Positionen: dafür, dagegen, Enthaltung und „did not vote“ — und „did not vote“ bedeutet abwesend. Es gibt keine Kategorie „anwesend, aber nicht abgestimmt“ (wie die „non-votants“ in der französischen Nationalversammlung): Präsenz und Teilnahme sind daher identisch.",
  },
  {
    q: "Warum zeigt die Parlamentspräsidentin einen Wert nahe 0 %?",
    a: "Die Präsidentin leitet die Sitzungen und stimmt nur sehr selten ab; jede namentliche Abstimmung, bei der sie nicht abstimmt, wird als „did not vote“ erfasst. Ihr Wert liegt daher nahe null — was ihre Rolle widerspiegelt, nicht Abwesenheit.",
  },
  {
    q: "Bedeutet ein hoher Wert, dass der/die Abgeordnete sehr präsent ist oder viel arbeitet?",
    a: "Nicht unbedingt. Namentliche Abstimmungen werden in kurzen Abstimmungsblöcken zusammengefasst: Ein/e Abgeordnete/r kann nur zum Abstimmen erscheinen und einen hohen Wert erzielen, während er/sie Ausschussarbeit, Debatten und den Rest der Woche auslässt. Dieser Wert sagt nichts über Ausschussarbeit oder Engagement aus — die das Parlament nicht namentlich veröffentlicht. Er umfasst zudem nur namentliche Abstimmungen, nicht Abstimmungen per Handzeichen.",
  },
  {
    q: "Woher stammen die Daten?",
    a: "Aus den namentlichen Abstimmungen des Europäischen Parlaments (Mandat 2024-2029), aggregiert und veröffentlicht von <b>HowTheyVote.eu</b> (Lizenz CC-BY, auf Basis der offiziellen Parlamentsdaten). Jede Karte verlinkt auf die offizielle Abstimmung. Das Aktualisierungsdatum steht am Ende dieser Seite.",
  },
  {
    q: "Ist die Website politisch parteiisch?",
    a: "Nein. Keine Deutung, kein Werturteil: nur rohe, belegte Zahlen, die jede/r selbst interpretieren kann.",
  },
];

const es = [
  {
    q: "¿La «tasa de participación en votaciones» significa que el/la eurodiputado/a estaba presente en el Parlamento?",
    a: "No. Indica la proporción de <b>votaciones nominales</b> — los votos registrados nombre por nombre — en las que el/la eurodiputado/a votó realmente (a favor, en contra o abstención) desde el inicio del mandato. La presencia física en el pleno, en comisión o en los debates <b>no la publica el Parlamento Europeo por miembro</b>: por eso no puede medirse con honestidad — y no la inventamos.",
  },
  {
    q: "¿Por qué presencia y participación muestran aquí la misma cifra, a diferencia del sitio sobre los diputados franceses?",
    a: "Las votaciones nominales del Parlamento Europeo solo registran cuatro posiciones: a favor, en contra, abstención y «did not vote» — y «did not vote» significa ausente. No existe una categoría «presente pero sin votar» (como los «non-votants» de la Asamblea Nacional francesa): por eso presencia y participación son idénticas.",
  },
  {
    q: "¿Por qué la Presidenta del Parlamento muestra una tasa cercana al 0 %?",
    a: "La Presidenta preside las sesiones y vota muy pocas veces; cada votación nominal en la que no vota se registra como «did not vote». Su tasa es por tanto cercana a cero — lo que refleja su función, no absentismo.",
  },
  {
    q: "¿Una tasa alta significa que el/la eurodiputado/a está muy presente o trabaja mucho?",
    a: "No necesariamente. Las votaciones nominales se agrupan en franjas cortas: un/a eurodiputado/a puede aparecer solo para votar y mostrar una tasa alta mientras se salta el trabajo en comisión, los debates y el resto de la semana. Esta cifra no dice nada del trabajo en comisión ni del compromiso — que el Parlamento no publica por miembro. Además solo cubre las votaciones nominales, no las votaciones a mano alzada.",
  },
  {
    q: "¿De dónde proceden los datos?",
    a: "De las votaciones nominales del Parlamento Europeo (mandato 2024-2029), agregadas y publicadas por <b>HowTheyVote.eu</b> (licencia CC-BY, a partir de los datos oficiales del Parlamento). Cada ficha enlaza con la votación oficial. La fecha de actualización figura al final de esta página.",
  },
  {
    q: "¿El sitio toma partido políticamente?",
    a: "No. Ninguna interpretación, ningún juicio de valor: solo cifras brutas y con fuentes, para que cada cual las interprete como quiera.",
  },
];

const it = [
  {
    q: "Il «tasso di partecipazione ai voti» significa che l'eurodeputato era presente al Parlamento?",
    a: "No. Indica la quota di <b>voti per appello nominale</b> — i voti registrati nome per nome — in cui l'eurodeputato/a ha effettivamente votato (a favore, contro o astensione) dall'inizio del mandato. La presenza fisica in aula, in commissione o nei dibattiti <b>non è pubblicata dal Parlamento europeo per singolo membro</b>: non può quindi essere misurata onestamente — e noi non la inventiamo.",
  },
  {
    q: "Perché presenza e partecipazione mostrano qui la stessa cifra, a differenza del sito sui deputati francesi?",
    a: "I voti per appello nominale del Parlamento europeo registrano solo quattro posizioni: a favore, contro, astensione e «did not vote» — e «did not vote» significa assente. Non esiste una categoria «presente ma senza votare» (come i «non-votants» all'Assemblea nazionale francese): presenza e partecipazione sono quindi identiche.",
  },
  {
    q: "Perché la Presidente del Parlamento mostra un tasso vicino allo 0 %?",
    a: "La Presidente presiede le sedute e vota molto raramente; ogni appello nominale in cui non vota è registrato come «did not vote». Il suo tasso è quindi vicino a zero — il che riflette il suo ruolo, non l'assenteismo.",
  },
  {
    q: "Un tasso elevato significa che l'eurodeputato è molto presente o lavora molto?",
    a: "Non necessariamente. I voti per appello nominale sono raggruppati in brevi finestre di voto: un/a eurodeputato/a può presentarsi solo per votare e ottenere un tasso elevato pur saltando il lavoro in commissione, i dibattiti e il resto della settimana. Questa cifra non dice nulla sul lavoro in commissione o sull'impegno — che il Parlamento non pubblica per singolo membro. Copre inoltre solo i voti per appello nominale, non i voti per alzata di mano.",
  },
  {
    q: "Da dove provengono i dati?",
    a: "Dai voti per appello nominale del Parlamento europeo (mandato 2024-2029), aggregati e pubblicati da <b>HowTheyVote.eu</b> (licenza CC-BY, sulla base dei dati ufficiali del Parlamento). Ogni scheda rimanda al voto ufficiale. La data di aggiornamento è indicata in fondo a questa pagina.",
  },
  {
    q: "Il sito prende posizione politicamente?",
    a: "No. Nessuna interpretazione, nessun giudizio di valore: solo cifre grezze e con fonti, che ognuno può interpretare come preferisce.",
  },
];

const bg = [
  {
    "q": "Означава ли процентът на „участие в гласуванията“, че евродепутатът е присъствал в Парламента?",
    "a": "Не. Той показва дела на <b>поименните гласувания</b> — гласуванията, регистрирани поименно — при които евродепутатът действително е гласувал (за, против или въздържал се) от началото на мандата. Физическото присъствие в пленарната зала, в комисиите или в дебатите <b>не се публикува поименно</b> от Европейския парламент, така че то не може да се измери честно — и ние не го измисляме."
  },
  {
    "q": "Защо тук присъствието и участието показват една и съща стойност, за разлика от сайта за френските депутати?",
    "a": "Поименните гласувания в Европейския парламент отчитат само четири позиции: за, против, въздържал се и „did not vote“ — а „did not vote“ означава отсъстващ. Няма категория „присъстващ, но негласуващ“ (като „негласуващите“ в Националното събрание на Франция), затова присъствието и участието са еднакви."
  },
  {
    "q": "Защо председателят на Парламента показва процент, близък до 0 %?",
    "a": "Председателят ръководи заседанията и гласува само много рядко; всяко поименно гласуване, при което не гласува, се отчита като „did not vote“. Затова процентът му е близък до нула — което отразява ролята му, а не отсъствие."
  },
  {
    "q": "Означава ли високият процент, че евродепутатът присъства много или работи усилено?",
    "a": "Не непременно. Поименните гласувания са групирани в кратки интервали за гласуване: даден евродепутат може да се появи само за гласуването и да отчете висок процент, като пропуска работата в комисиите, дебатите и останалата част от седмицата. Тази стойност не казва нищо за работата в комисиите или ангажираността — които Парламентът не публикува поименно. Освен това тя обхваща само поименните гласувания, а не гласуванията с вдигане на ръка."
  },
  {
    "q": "Откъде идват данните?",
    "a": "От поименните гласувания на Европейския парламент (мандат 2024-2029), обобщени и публикувани от <b>HowTheyVote.eu</b> (лиценз CC-BY, въз основа на официалните данни на Парламента). Всяка карта води към официалното гласуване. Датата на последната актуализация се намира в долната част на тази страница."
  },
  {
    "q": "Политически пристрастен ли е сайтът?",
    "a": "Не. Никаква интерпретация, никаква оценъчна преценка: само необработени данни с посочен източник, които всеки може да тълкува както намери за добре."
  }
];

const cs = [
  {
    "q": "Znamená míra „účasti na hlasováních“, že europoslanec byl přítomen v Parlamentu?",
    "a": "Ne. Ukazuje podíl <b>jmenovitých hlasování</b> — hlasování zaznamenaných jméno po jménu —, při nichž europoslanec od začátku volebního období skutečně hlasoval (pro, proti nebo se zdržel). Fyzickou přítomnost na plenárním zasedání, ve výboru nebo v rozpravách Evropský parlament <b>u jednotlivých poslanců nezveřejňuje</b>, takže ji nelze poctivě změřit — a my si ji nevymýšlíme."
  },
  {
    "q": "Proč se zde přítomnost a účast shodují, na rozdíl od webu o francouzských poslancích?",
    "a": "Jmenovitá hlasování Evropského parlamentu zaznamenávají jen čtyři pozice: pro, proti, zdržení se a „nehlasoval“ — a „nehlasoval“ znamená nepřítomný. Neexistuje kategorie „přítomen, ale nehlasoval“ (jako „nehlasující“ ve francouzském Národním shromáždění), takže přítomnost a účast jsou totožné."
  },
  {
    "q": "Proč předsedkyně Parlamentu vykazuje míru blízkou 0 %?",
    "a": "Předsedkyně řídí zasedání a hlasuje jen velmi zřídka; každé jmenovité hlasování, v němž nehlasuje, se zaznamenává jako „nehlasoval“. Její míra je proto blízká nule — což odráží její roli, nikoli absentérství."
  },
  {
    "q": "Znamená vysoká míra, že je europoslanec hodně přítomen nebo hodně pracuje?",
    "a": "Ne nutně. Jmenovitá hlasování jsou seskupena do krátkých hlasovacích bloků: europoslanec se může dostavit jen k hlasování a vykázat vysokou míru, přitom vynechat práci ve výborech, rozpravy i zbytek týdne. Toto číslo neříká nic o práci ve výborech ani o zapojení — které Parlament u jednotlivých poslanců nezveřejňuje. Zahrnuje navíc pouze jmenovitá hlasování, nikoli hlasování zvednutím ruky."
  },
  {
    "q": "Odkud data pocházejí?",
    "a": "Z jmenovitých hlasování Evropského parlamentu (volební období 2024-2029), agregovaných a zveřejněných portálem <b>HowTheyVote.eu</b> (licence CC-BY, na základě oficiálních dat Parlamentu). Každá karta odkazuje na oficiální hlasování. Datum poslední aktualizace je uvedeno v dolní části této stránky."
  },
  {
    "q": "Je web politicky zaujatý?",
    "a": "Ne. Žádná interpretace, žádný hodnotový soud: pouze surová, doložená čísla, která si každý může vyložit podle svého."
  }
];

const da = [
  {
    "q": "Betyder »deltagelsen i afstemninger«, at medlemmet var til stede i Parlamentet?",
    "a": "Nej. Det viser andelen af <b>afstemninger ved navneopråb</b> — afstemninger, der registreres navn for navn — hvor medlemmet faktisk har afgivet en stemme (for, imod eller hverken for eller imod) siden mandatperiodens begyndelse. Den fysiske tilstedeværelse på plenarmøder, i udvalg eller i debatter <b>offentliggøres ikke pr. medlem</b> af Europa-Parlamentet og kan derfor ikke måles ærligt — og vi opfinder den ikke."
  },
  {
    "q": "Hvorfor viser fremmøde og deltagelse det samme tal her, i modsætning til sitet om de franske parlamentsmedlemmer?",
    "a": "Europa-Parlamentets navneopråb registrerer kun fire positioner: for, imod, hverken for eller imod, og »did not vote« — og »did not vote« betyder fraværende. Der findes ingen kategori for »til stede uden at stemme« (som de »ikke-stemmende« medlemmer i den franske nationalforsamling), så fremmøde og deltagelse er identiske."
  },
  {
    "q": "Hvorfor viser Parlamentets formand en andel tæt på 0 %?",
    "a": "Formanden leder møderne og stemmer kun meget sjældent; hvert navneopråb, hvor formanden ikke stemmer, registreres som »did not vote«. Andelen er derfor tæt på nul — hvilket afspejler rollen, ikke fravær."
  },
  {
    "q": "Betyder en høj andel, at medlemmet er meget til stede eller arbejder meget?",
    "a": "Ikke nødvendigvis. Afstemninger ved navneopråb er samlet i korte afstemningsrunder: et medlem kan møde op alene for at stemme og opnå en høj andel, mens vedkommende springer udvalgsarbejde, debatter og resten af ugen over. Dette tal siger intet om udvalgsarbejde eller engagement — hvilket Parlamentet ikke offentliggør pr. medlem. Det omfatter desuden kun afstemninger ved navneopråb, ikke afstemninger ved håndsoprækning."
  },
  {
    "q": "Hvor stammer dataene fra?",
    "a": "Fra Europa-Parlamentets afstemninger ved navneopråb (mandatperioden 2024-2029), samlet og offentliggjort af <b>HowTheyVote.eu</b> (CC-BY-licens, på grundlag af Parlamentets officielle data). Hvert kort linker til den officielle afstemning. Datoen for seneste opdatering vises nederst på denne side."
  },
  {
    "q": "Er sitet politisk forudindtaget?",
    "a": "Nej. Ingen fortolkning, ingen værdidom: kun rå, kildeangivne tal, som enhver kan fortolke, som de finder det rigtigt."
  }
];

const el = [
  {
    "q": "Σημαίνει το ποσοστό «συμμετοχής στις ψηφοφορίες» ότι ο ευρωβουλευτής ήταν παρών στο Κοινοβούλιο;",
    "a": "Όχι. Δείχνει το ποσοστό των <b>ονομαστικών ψηφοφοριών</b> — ψηφοφοριών που καταγράφονται ονομαστικά — στις οποίες ο ευρωβουλευτής ψήφισε πραγματικά (υπέρ, κατά ή αποχή) από την αρχή της κοινοβουλευτικής περιόδου. Η φυσική παρουσία στην ολομέλεια, στις επιτροπές ή στις συζητήσεις <b>δεν δημοσιεύεται ανά βουλευτή</b> από το Ευρωπαϊκό Κοινοβούλιο, επομένως δεν μπορεί να μετρηθεί με ειλικρίνεια — και δεν την επινοούμε."
  },
  {
    "q": "Γιατί η παρουσία και η συμμετοχή εμφανίζουν εδώ τον ίδιο αριθμό, σε αντίθεση με τον ιστότοπο για τους Γάλλους βουλευτές;",
    "a": "Οι ονομαστικές ψηφοφορίες του Ευρωπαϊκού Κοινοβουλίου καταγράφουν μόνο τέσσερις θέσεις: υπέρ, κατά, αποχή και «did not vote» — και το «did not vote» σημαίνει απών. Δεν υπάρχει κατηγορία «παρών αλλά χωρίς να ψηφίζει» (όπως οι «μη ψηφίζοντες» στη γαλλική Εθνοσυνέλευση), επομένως η παρουσία και η συμμετοχή είναι ταυτόσημες."
  },
  {
    "q": "Γιατί ο/η Πρόεδρος του Κοινοβουλίου εμφανίζει ποσοστό κοντά στο 0 %;",
    "a": "Ο/Η Πρόεδρος προεδρεύει των συνεδριάσεων και ψηφίζει πολύ σπάνια· κάθε ονομαστική ψηφοφορία στην οποία δεν ψηφίζει καταγράφεται ως «did not vote». Το ποσοστό του/της είναι επομένως κοντά στο μηδέν — γεγονός που αντικατοπτρίζει τον ρόλο του/της, όχι απουσιασμό."
  },
  {
    "q": "Σημαίνει ένα υψηλό ποσοστό ότι ο ευρωβουλευτής είναι πολύ παρών ή εργάζεται πολύ;",
    "a": "Όχι απαραίτητα. Οι ονομαστικές ψηφοφορίες ομαδοποιούνται σε σύντομα χρονικά διαστήματα ψηφοφορίας: ένας ευρωβουλευτής μπορεί να εμφανιστεί μόνο για την ψηφοφορία και να πετύχει υψηλό ποσοστό, ενώ παραλείπει τις εργασίες των επιτροπών, τις συζητήσεις και την υπόλοιπη εβδομάδα. Αυτός ο αριθμός δεν λέει τίποτα για το έργο στις επιτροπές ή τη συμμετοχικότητα — που το Κοινοβούλιο δεν δημοσιεύει ανά βουλευτή. Επιπλέον, καλύπτει μόνο τις ονομαστικές ψηφοφορίες, όχι τις ψηφοφορίες με ανάταση χειρός."
  },
  {
    "q": "Από πού προέρχονται τα δεδομένα;",
    "a": "Από τις ονομαστικές ψηφοφορίες του Ευρωπαϊκού Κοινοβουλίου (κοινοβουλευτική περίοδος 2024-2029), συγκεντρωμένες και δημοσιευμένες από το <b>HowTheyVote.eu</b> (άδεια CC-BY, βάσει των επίσημων δεδομένων του Κοινοβουλίου). Κάθε καρτέλα παραπέμπει στην επίσημη ψηφοφορία. Η ημερομηνία τελευταίας ενημέρωσης εμφανίζεται στο κάτω μέρος αυτής της σελίδας."
  },
  {
    "q": "Έχει ο ιστότοπος πολιτική μεροληψία;",
    "a": "Όχι. Καμία ερμηνεία, καμία αξιολογική κρίση: μόνο ακατέργαστοι, τεκμηριωμένοι αριθμοί, που ο καθένας μπορεί να ερμηνεύσει όπως κρίνει."
  }
];

const et = [
  {
    "q": "Kas „hääletustel osalemise” määr tähendab, et eurosaadik oli Parlamendis kohal?",
    "a": "Ei. See näitab <b>nimeliste hääletuste</b> — nimeliselt registreeritud hääletuste — osakaalu, kus eurosaadik tegelikult hääletas (poolt, vastu või erapooletu) alates koosseisu ametiaja algusest. Füüsilist kohalolekut täiskogus, komisjonis või aruteludel Euroopa Parlament <b>liikmete kaupa ei avalda</b>, mistõttu seda ei saa ausalt mõõta — ja me ei mõtle seda välja."
  },
  {
    "q": "Miks näitavad kohalolek ja osalus siin sama arvu, erinevalt Prantsuse parlamendiliikmete saidist?",
    "a": "Euroopa Parlamendi nimelised hääletused registreerivad ainult neli seisukohta: poolt, vastu, erapooletu ja „ei hääletanud” — ning „ei hääletanud” tähendab, et isik puudus. Ei ole olemas kategooriat „kohal, kuid ei hääleta” (nagu „mittehääletavad” liikmed Prantsuse Rahvusassamblees), seega on kohalolek ja osalus identsed."
  },
  {
    "q": "Miks on Parlamendi presidendi osalusmäär 0 % lähedal?",
    "a": "President juhatab istungeid ja hääletab väga harva; iga nimeline hääletus, kus ta ei hääleta, registreeritakse kui „ei hääletanud”. Seetõttu on tema määr nulli lähedal — see peegeldab tema rolli, mitte puudumist."
  },
  {
    "q": "Kas kõrge määr tähendab, et eurosaadik on väga kohal või teeb palju tööd?",
    "a": "Mitte tingimata. Nimelised hääletused on koondatud lühikestesse hääletusplokkidesse: eurosaadik võib tulla kohale ainult hääletama ja saada kõrge määra, jättes samal ajal vahele komisjonitöö, arutelud ja ülejäänud nädala. See arv ei ütle midagi komisjonitöö ega pühendumuse kohta — mida Parlament liikmete kaupa ei avalda. Samuti hõlmab see üksnes nimelisi hääletusi, mitte käega hääletamist."
  },
  {
    "q": "Kust andmed pärinevad?",
    "a": "Euroopa Parlamendi nimelistest hääletustest (2024-2029 koosseis), mille on koondanud ja avaldanud <b>HowTheyVote.eu</b> (CC-BY litsents, Parlamendi ametlike andmete põhjal). Iga kaart viitab ametlikule hääletusele. Viimase uuenduse kuupäev on selle lehe allservas."
  },
  {
    "q": "Kas sait on poliitiliselt kallutatud?",
    "a": "Ei. Ei mingit tõlgendust, ei mingit väärtushinnangut: ainult toored, allikaviidatud arvud, mida igaüks võib tõlgendada oma äranägemise järgi."
  }
];

const fi = [
  {
    "q": "Tarkoittaako ”osallistuminen äänestyksiin” -luku, että meppi oli läsnä parlamentissa?",
    "a": "Ei. Se osoittaa niiden <b>nimenhuutoäänestysten</b> — nimi nimeltä kirjattujen äänestysten — osuuden, joissa meppi todella antoi äänen (puolesta, vastaan tai tyhjää) toimikauden alusta lähtien. Euroopan parlamentti <b>ei julkaise jäsenkohtaisesti</b> fyysistä läsnäoloa täysistunnossa, valiokunnassa tai keskusteluissa, joten sitä ei voi mitata rehellisesti — emmekä keksi sitä."
  },
  {
    "q": "Miksi läsnäolo ja osallistuminen näyttävät täällä saman luvun, toisin kuin Ranskan kansanedustajia käsittelevällä sivustolla?",
    "a": "Euroopan parlamentin nimenhuutoäänestyksiin kirjataan vain neljä kantaa: puolesta, vastaan, tyhjää ja ”ei äänestänyt” — ja ”ei äänestänyt” tarkoittaa poissaoloa. Ei ole olemassa ”läsnä mutta ei äänestä” -luokkaa (kuten ”äänestämättömät” Ranskan kansalliskokouksessa), joten läsnäolo ja osallistuminen ovat identtiset."
  },
  {
    "q": "Miksi parlamentin puhemiehen osuus on lähellä 0 %?",
    "a": "Puhemies johtaa istuntoja ja äänestää vain hyvin harvoin; jokainen nimenhuutoäänestys, jossa hän ei äänestä, kirjataan merkinnällä ”ei äänestänyt”. Hänen osuutensa on siksi lähellä nollaa — mikä kuvastaa hänen rooliaan, ei poissaoloja."
  },
  {
    "q": "Tarkoittaako korkea osuus, että meppi on hyvin läsnä tai tekee paljon työtä?",
    "a": "Ei välttämättä. Nimenhuutoäänestykset on koottu lyhyisiin äänestysjaksoihin: meppi voi tulla paikalle vain äänestämään ja saada korkean osuuden, vaikka jättäisi väliin valiokuntatyön, keskustelut ja loppuviikon. Tämä luku ei kerro mitään valiokuntatyöstä tai aktiivisuudesta — mitä parlamentti ei julkaise jäsenkohtaisesti. Se kattaa lisäksi vain nimenhuutoäänestykset, ei kättennostoäänestyksiä."
  },
  {
    "q": "Mistä tiedot ovat peräisin?",
    "a": "Euroopan parlamentin nimenhuutoäänestyksistä (toimikausi 2024-2029), jotka <b>HowTheyVote.eu</b> on koonnut ja julkaissut (CC-BY-lisenssi, parlamentin virallisten tietojen pohjalta). Jokainen kortti linkittää viralliseen äänestykseen. Päivityspäivä näkyy tämän sivun alalaidassa."
  },
  {
    "q": "Onko sivusto poliittisesti puolueellinen?",
    "a": "Ei. Ei tulkintoja, ei arvoarvostelmia: vain raakoja, lähteytettyjä lukuja, jotka jokainen voi tulkita haluamallaan tavalla."
  }
];

const ga = [
  {
    "q": "An gciallaíonn an ráta “rannpháirtíochta sa vótáil” go raibh an Feisire i láthair sa Pharlaimint?",
    "a": "Ní chiallaíonn. Taispeánann sé an sciar de na <b>vótaí le glaoch rolla</b> — vótaí a thaifeadtar ainm ar ainm — inar chaith an Feisire vóta go hiarbhír (ar son, in aghaidh nó staonadh) ó thús an téarma. An láithreacht fhisiciúil sa suí iomlánach, sa choiste nó sna díospóireachtaí, <b>ní fhoilsíonn Parlaimint na hEorpa de réir comhalta í</b>, agus mar sin ní féidir í a thomhas go hionraic — agus ní chumaimid í."
  },
  {
    "q": "Cén fáth a dtaispeánann láithreacht agus rannpháirtíocht an figiúr céanna anseo, murab ionann agus an suíomh faoi theachtaí na Fraince?",
    "a": "Ní thaifeadann glaonna rolla Pharlaimint na hEorpa ach ceithre sheasamh: ar son, in aghaidh, staonadh, agus “did not vote” — agus ciallaíonn “did not vote” as láthair. Níl aon chatagóir “i láthair ach gan vótáil” ann (cosúil leis na comhaltaí “neamhvótála” i dTionól Náisiúnta na Fraince), agus mar sin bíonn láithreacht agus rannpháirtíocht comhionann."
  },
  {
    "q": "Cén fáth a dtaispeánann Uachtarán na Parlaiminte ráta gar do 0 %?",
    "a": "Bíonn an tUachtarán i gceannas ar na suíonna agus ní vótálann ach go hannamh; taifeadtar gach glaoch rolla nach gcaitear vóta ann mar “did not vote”. Tá a ráta gar do náid dá bharr sin — rud a léiríonn a ról, ní asláithreachas."
  },
  {
    "q": "An gciallaíonn ráta ard go mbíonn an Feisire an-láithreach nó go n-oibríonn go crua?",
    "a": "Ní gá. Cuirtear vótaí le glaoch rolla le chéile in sliotáin ghairide vótála: is féidir le Feisire teacht i láthair don vóta amháin agus ráta ard a bhaint amach, agus obair na gcoistí, na díospóireachtaí agus an chuid eile den tseachtain á scipeáil. Ní insíonn an figiúr seo tada faoi obair na gcoistí ná faoin rannpháirtíocht — rud nach bhfoilsíonn an Pharlaimint de réir comhalta. Ní chlúdaíonn sé ach vótaí le glaoch rolla, ní vótaí le lámha in airde."
  },
  {
    "q": "Cad as a dtagann na sonraí?",
    "a": "Ó vótaí le glaoch rolla Pharlaimint na hEorpa (téarma 2024-2029), arna gcomhbhailiú agus arna bhfoilsiú ag <b>HowTheyVote.eu</b> (ceadúnas CC-BY, bunaithe ar shonraí oifigiúla na Parlaiminte). Nascann gach cárta leis an vóta oifigiúil. Tá dáta an nuashonraithe dheireanaigh le feiceáil ag bun an leathanaigh seo."
  },
  {
    "q": "An bhfuil an suíomh claonta ó thaobh na polaitíochta de?",
    "a": "Níl. Gan léirmhíniú ar bith, gan breithiúnas luacha ar bith: figiúirí amha foinsithe amháin, le go ndéanfaidh gach duine a léirmhíniú féin orthu."
  }
];

const hr = [
  {
    "q": "Znači li stopa „sudjelovanja u glasovanjima” da je eurozastupnik bio prisutan u Parlamentu?",
    "a": "Ne. Ona pokazuje udio <b>poimeničnih glasovanja</b> — glasovanja zabilježenih ime po ime — u kojima je eurozastupnik stvarno glasovao (za, protiv ili suzdržan) od početka mandata. Fizičku prisutnost na plenarnoj sjednici, u odboru ili u raspravama Europski parlament <b>ne objavljuje poimenično</b>, pa je nije moguće pošteno izmjeriti — i mi je ne izmišljamo."
  },
  {
    "q": "Zašto ovdje prisutnost i sudjelovanje pokazuju istu brojku, za razliku od stranice o francuskim zastupnicima?",
    "a": "Poimenična glasovanja Europskog parlamenta bilježe samo četiri mogućnosti: za, protiv, suzdržan i „did not vote” (nije glasovao) — a „nije glasovao” znači odsutan. Ne postoji kategorija „prisutan, ali ne glasuje” (poput „nesudjelujućih” zastupnika u francuskoj Nacionalnoj skupštini), pa su prisutnost i sudjelovanje istovjetni."
  },
  {
    "q": "Zašto predsjednica Parlamenta ima stopu blizu 0 %?",
    "a": "Predsjednica predsjeda sjednicama i glasuje tek vrlo rijetko; svako poimenično glasovanje na kojem ne glasuje bilježi se kao „did not vote” (nije glasovala). Njezina je stopa stoga blizu nule — što odražava njezinu ulogu, a ne izostajanje."
  },
  {
    "q": "Znači li visoka stopa da je eurozastupnik vrlo prisutan ili da mnogo radi?",
    "a": "Ne nužno. Poimenična glasovanja grupiraju se u kratke termine glasovanja: eurozastupnik se može pojaviti samo radi glasovanja i postići visoku stopu, a istodobno izostajati s rada u odborima, rasprava i ostatka tjedna. Ova brojka ne govori ništa o radu u odborima ni o angažmanu — što Parlament ne objavljuje poimenično. Osim toga, obuhvaća samo poimenična glasovanja, a ne glasovanja dizanjem ruke."
  },
  {
    "q": "Odakle dolaze podaci?",
    "a": "Iz poimeničnih glasovanja Europskog parlamenta (mandat 2024-2029), koja agregira i objavljuje <b>HowTheyVote.eu</b> (licencija CC-BY, na temelju službenih podataka Parlamenta). Svaka kartica upućuje na službeno glasovanje. Datum posljednjeg ažuriranja nalazi se na dnu ove stranice."
  },
  {
    "q": "Je li stranica politički pristrana?",
    "a": "Ne. Bez interpretacije, bez vrijednosnih sudova: samo sirove, izvorima potkrijepljene brojke koje svatko može tumačiti kako želi."
  }
];

const hu = [
  {
    "q": "Azt jelenti-e a „szavazásokon való részvétel” aránya, hogy a képviselő jelen volt a Parlamentben?",
    "a": "Nem. Azt mutatja meg, hogy a mandátum kezdete óta tartott <b>név szerinti szavazások</b> — a nevenként rögzített szavazások — mekkora hányadában adott le a képviselő ténylegesen szavazatot (mellette, ellene vagy tartózkodás). A plenáris ülésen, a bizottságokban vagy a vitákban való tényleges jelenlétet az Európai Parlament <b>nem teszi közzé képviselőnként</b>, ezért az becsületesen nem mérhető — mi pedig nem találunk ki adatokat."
  },
  {
    "q": "A francia képviselőkről szóló oldallal ellentétben itt miért ugyanaz a szám a jelenlét és a részvétel?",
    "a": "Az Európai Parlament név szerinti szavazásai csak négy álláspontot rögzítenek: mellette, ellene, tartózkodás és „nem szavazott” — a „nem szavazott” pedig távollétet jelent. Nincs „jelen van, de nem szavaz” kategória (mint a francia nemzetgyűlés „nem szavazó” tagjai esetében), ezért a jelenlét és a részvétel megegyezik."
  },
  {
    "q": "Miért mutat a Parlament elnöke 0 %-hoz közeli arányt?",
    "a": "Az elnök vezeti az üléseket, és csak nagyon ritkán szavaz; minden olyan név szerinti szavazás, amelyben nem vesz részt, „nem szavazott”-ként kerül rögzítésre. Az aránya ezért nulla közeli — ami a szerepét tükrözi, nem pedig hiányzást."
  },
  {
    "q": "Azt jelenti-e a magas arány, hogy a képviselő nagyon aktív vagy sokat dolgozik?",
    "a": "Nem feltétlenül. A név szerinti szavazásokat rövid szavazási időblokkokba csoportosítják: egy képviselő megjelenhet pusztán a szavazásra, és magas arányt érhet el, miközben kihagyja a bizottsági munkát, a vitákat és a hét többi részét. Ez a szám semmit sem mond a bizottsági munkáról vagy az elköteleződésről — amelyet a Parlament nem tesz közzé képviselőnként. Ráadásul csak a név szerinti szavazásokra terjed ki, a kézfelemeléssel történő szavazásokra nem."
  },
  {
    "q": "Honnan származnak az adatok?",
    "a": "Az Európai Parlament név szerinti szavazásaiból (2024-2029-es ciklus), amelyeket a <b>HowTheyVote.eu</b> összesít és tesz közzé (CC-BY licenc, a Parlament hivatalos adatai alapján). Minden adatlap a hivatalos szavazásra hivatkozik. A frissítés dátuma az oldal alján látható."
  },
  {
    "q": "Politikailag elfogult-e az oldal?",
    "a": "Nem. Semmilyen értelmezés, semmilyen értékítélet: kizárólag nyers, forrásokkal ellátott adatok, amelyeket mindenki a maga módján értelmezhet."
  }
];

const lt = [
  {
    "q": "Ar „dalyvavimo balsavimuose“ rodiklis reiškia, kad europarlamentaras (-ė) buvo Parlamente?",
    "a": "Ne. Jis rodo <b>vardinių balsavimų</b> — balsavimų, registruojamų vardas po vardo — dalį, kuriuose europarlamentaras (-ė) iš tikrųjų balsavo (už, prieš arba susilaikė) nuo kadencijos pradžios. Fizinio dalyvavimo plenariniuose posėdžiuose, komitetuose ar diskusijose Europos Parlamentas <b>neskelbia atskirai apie kiekvieną narį</b>, todėl jo sąžiningai išmatuoti neįmanoma — ir mes jo neišgalvojame."
  },
  {
    "q": "Kodėl čia buvimas ir dalyvavimas rodo tą patį skaičių, priešingai nei Prancūzijos parlamento narių svetainėje?",
    "a": "Europos Parlamento vardiniai balsavimai registruoja tik keturias pozicijas: už, prieš, susilaikė ir „did not vote“ — o „did not vote“ reiškia neatvykimą. Nėra kategorijos „dalyvauja, bet nebalsuoja“ (kaip „nebalsuojantieji“ Prancūzijos Nacionalinėje Asamblėjoje), todėl buvimas ir dalyvavimas yra tapatūs."
  },
  {
    "q": "Kodėl Parlamento pirmininko (-ės) rodiklis artimas 0 %?",
    "a": "Pirmininkas (-ė) pirmininkauja posėdžiams ir balsuoja tik labai retai; kiekvienas vardinis balsavimas, kuriame jis (ji) nebalsuoja, registruojamas kaip „did not vote“. Todėl jo (jos) rodiklis artimas nuliui — tai atspindi jo (jos) vaidmenį, o ne pravaikštas."
  },
  {
    "q": "Ar aukštas rodiklis reiškia, kad europarlamentaras (-ė) labai dažnai dalyvauja arba daug dirba?",
    "a": "Nebūtinai. Vardiniai balsavimai sugrupuojami į trumpus balsavimo blokus: europarlamentaras (-ė) gali ateiti tik balsuoti ir pasiekti aukštą rodiklį, tačiau praleisti darbą komitetuose, diskusijas ir likusią savaitės dalį. Šis skaičius nieko nesako apie darbą komitetuose ar įsitraukimą — Parlamentas to atskirai apie kiekvieną narį neskelbia. Be to, jis apima tik vardinius balsavimus, o ne balsavimus rankos pakėlimu."
  },
  {
    "q": "Iš kur gaunami duomenys?",
    "a": "Iš Europos Parlamento vardinių balsavimų (2024–2029 m. kadencija), kuriuos apibendrino ir paskelbė <b>HowTheyVote.eu</b> (CC-BY licencija, remiantis oficialiais Parlamento duomenimis). Kiekviena kortelė nurodo oficialų balsavimą. Paskutinio atnaujinimo data pateikiama šio puslapio apačioje."
  },
  {
    "q": "Ar svetainė politiškai šališka?",
    "a": "Ne. Jokios interpretacijos, jokio vertinimo: tik pirminiai, šaltiniais pagrįsti skaičiai, kuriuos kiekvienas gali interpretuoti savo nuožiūra."
  }
];

const lv = [
  {
    "q": "Vai „līdzdalība balsojumos” rādītājs nozīmē, ka deputāts bija klāt Parlamentā?",
    "a": "Nē. Tas rāda to <b>balsojumu pēc saraksta</b> — balsojumu, kas tiek reģistrēti vārdu pa vārdam — īpatsvaru, kuros deputāts kopš sasaukuma sākuma patiešām nobalsoja (par, pret vai atturas). Fizisko klātbūtni plenārsēdēs, komitejās vai debatēs Eiropas Parlaments <b>nepublicē par katru deputātu atsevišķi</b>, tāpēc to nav iespējams godīgi izmērīt — un mēs to neizdomājam."
  },
  {
    "q": "Kāpēc šeit klātbūtne un līdzdalība rāda vienu un to pašu skaitli, atšķirībā no vietnes par Francijas deputātiem?",
    "a": "Eiropas Parlamenta balsojumos pēc saraksta tiek reģistrētas tikai četras nostājas: par, pret, atturas un „did not vote” (nebalsoja) — un „did not vote” nozīmē prombūtni. Nav kategorijas „klāt, bet nebalso” (kā „nebalsojošie” deputāti Francijas Nacionālajā asamblejā), tāpēc klātbūtne un līdzdalība ir identiskas."
  },
  {
    "q": "Kāpēc Parlamenta priekšsēdētājai ir rādītājs, kas ir tuvs 0 %?",
    "a": "Priekšsēdētāja vada sēdes un balso ļoti reti; katrs balsojums pēc saraksta, kurā viņa nebalso, tiek reģistrēts kā „did not vote”. Tāpēc viņas rādītājs ir tuvs nullei — kas atspoguļo viņas lomu, nevis prombūtni."
  },
  {
    "q": "Vai augsts rādītājs nozīmē, ka deputāts bieži ir klāt vai daudz strādā?",
    "a": "Ne vienmēr. Balsojumi pēc saraksta ir sagrupēti īsos balsošanas blokos: deputāts var ierasties tikai uz balsojumu un uzrādīt augstu rādītāju, izlaižot darbu komitejās, debates un pārējo nedēļu. Šis skaitlis neko neizsaka par darbu komitejās vai iesaistīšanos — ko Parlaments nepublicē par katru deputātu. Turklāt tas aptver tikai balsojumus pēc saraksta, nevis balsojumus, paceļot roku."
  },
  {
    "q": "No kurienes nāk dati?",
    "a": "No Eiropas Parlamenta balsojumiem pēc saraksta (2024–2029 sasaukums), ko apkopo un publicē <b>HowTheyVote.eu</b> (CC-BY licence, pamatojoties uz Parlamenta oficiālajiem datiem). Katra kartīte ved uz oficiālo balsojumu. Pēdējās atjaunināšanas datums ir redzams šīs lapas apakšā."
  },
  {
    "q": "Vai vietne ir politiski neobjektīva?",
    "a": "Nē. Nekādas interpretācijas, nekāda vērtējuma: tikai neapstrādāti, ar avotiem pamatoti skaitļi, ko katrs var interpretēt pēc saviem ieskatiem."
  }
];

const mt = [
  {
    "q": "Ir-rata ta' 'parteċipazzjoni fil-votazzjonijiet' tfisser li l-MPE kien preżenti fil-Parlament?",
    "a": "Le. Turi s-sehem tal-<b>votazzjonijiet b'sejħa tal-ismijiet</b> — voti rreġistrati isem b'isem — li fihom il-MPE tabilħaqq ivvota (favur, kontra jew astensjoni) sa mill-bidu tal-mandat. Il-preżenza fiżika fil-plenarja, fil-kumitat jew fid-dibattiti <b>ma tiġix ippubblikata għal kull membru</b> mill-Parlament Ewropew, u għalhekk ma tistax titkejjel b'mod onest — u aħna ma ninventawhiex."
  },
  {
    "q": "Għaliex il-preżenza u l-parteċipazzjoni juru l-istess ċifra hawn, għall-kuntrarju tas-sit dwar id-deputati Franċiżi?",
    "a": "Il-votazzjonijiet b'sejħa tal-ismijiet tal-Parlament Ewropew jirreġistraw biss erba' pożizzjonijiet: favur, kontra, astensjoni, u \"did not vote\" (ma vvotax) — u \"did not vote\" tfisser assenti. Ma teżistix kategorija ta' \"preżenti iżda ma jivvotax\" (bħall-membri \"non-votanti\" fl-Assemblea Nazzjonali Franċiża), u għalhekk il-preżenza u l-parteċipazzjoni huma identiċi."
  },
  {
    "q": "Għaliex il-President tal-Parlament turi rata qrib 0 %?",
    "a": "Il-President tippresiedi s-seduti u tivvota rari ħafna biss; kull sejħa tal-ismijiet fejn ma tivvotax tiġi rreġistrata bħala \"did not vote\". Ir-rata tagħha għalhekk tinsab qrib iż-żero — u dan jirrifletti r-rwol tagħha, mhux assenteiżmu."
  },
  {
    "q": "Rata għolja tfisser li l-MPE huwa preżenti ħafna jew jaħdem ħafna?",
    "a": "Mhux bilfors. Il-votazzjonijiet b'sejħa tal-ismijiet jinġabru f'perjodi qosra ta' votazzjoni: MPE jista' jidher biss għall-vot u jkollu rata għolja filwaqt li jaqbeż ix-xogħol fil-kumitati, id-dibattiti u l-bqija tal-ġimgħa. Din iċ-ċifra ma tgħid xejn dwar ix-xogħol fil-kumitati jew l-impenn — li l-Parlament ma jippubblikax għal kull membru. Barra minn hekk, tkopri biss il-votazzjonijiet b'sejħa tal-ismijiet, mhux il-voti li jittieħdu b'idejn merfugħa."
  },
  {
    "q": "Minn fejn ġejja d-data?",
    "a": "Mill-votazzjonijiet b'sejħa tal-ismijiet tal-Parlament Ewropew (mandat 2024-2029), miġbura u ppubblikati minn <b>HowTheyVote.eu</b> (liċenzja CC-BY, abbażi tad-data uffiċjali tal-Parlament). Kull karta twassal għall-vot uffiċjali. Id-data tal-aħħar aġġornament tidher f'qiegħ din il-paġna."
  },
  {
    "q": "Is-sit huwa politikament preġudikat?",
    "a": "Le. L-ebda interpretazzjoni, l-ebda ġudizzju ta' valur: biss ċifri grezzi u b'sorsi, biex kulħadd jinterpretahom kif jidhirlu."
  }
];

const nl = [
  {
    "q": "Betekent het percentage 'deelname aan stemmingen' dat de europarlementariër aanwezig was in het Parlement?",
    "a": "Nee. Het geeft het aandeel <b>hoofdelijke stemmingen</b> weer — stemmingen die naam voor naam worden geregistreerd — waarbij de europarlementariër sinds het begin van de zittingsperiode daadwerkelijk een stem heeft uitgebracht (voor, tegen of onthouding). De fysieke aanwezigheid in de plenaire vergadering, in de commissie of tijdens debatten <b>wordt niet per lid gepubliceerd</b> door het Europees Parlement en kan dus niet eerlijk worden gemeten — en wij verzinnen die niet."
  },
  {
    "q": "Waarom tonen aanwezigheid en deelname hier hetzelfde cijfer, anders dan op de site over de Franse parlementsleden?",
    "a": "De hoofdelijke stemmingen van het Europees Parlement registreren slechts vier posities: voor, tegen, onthouding en “did not vote” — en “did not vote” betekent afwezig. Er bestaat geen categorie “aanwezig maar niet stemmend” (zoals de “niet-stemmende” leden in de Franse Nationale Vergadering), waardoor aanwezigheid en deelname identiek zijn."
  },
  {
    "q": "Waarom heeft de Voorzitter van het Parlement een percentage dat dicht bij 0 % ligt?",
    "a": "De Voorzitter zit de vergaderingen voor en stemt slechts zeer zelden; elke hoofdelijke stemming waarbij hij of zij niet stemt, wordt geregistreerd als “did not vote”. Het percentage ligt daarom dicht bij nul — wat een weerspiegeling is van de functie, niet van absenteïsme."
  },
  {
    "q": "Betekent een hoog percentage dat de europarlementariër erg aanwezig is of veel werkt?",
    "a": "Niet noodzakelijk. Hoofdelijke stemmingen worden gebundeld in korte stemblokken: een europarlementariër kan alleen voor de stemming komen opdagen en een hoog percentage halen, terwijl hij of zij het commissiewerk, de debatten en de rest van de week overslaat. Dit cijfer zegt niets over het commissiewerk of de betrokkenheid — die het Parlement niet per lid publiceert. Het heeft bovendien alleen betrekking op hoofdelijke stemmingen, niet op stemmingen bij handopsteking."
  },
  {
    "q": "Waar komen de gegevens vandaan?",
    "a": "Uit de hoofdelijke stemmingen van het Europees Parlement (zittingsperiode 2024-2029), samengevoegd en gepubliceerd door <b>HowTheyVote.eu</b> (CC-BY-licentie, op basis van de officiële gegevens van het Parlement). Elke kaart verwijst naar de officiële stemming. De datum van de laatste bijwerking staat onderaan deze pagina."
  },
  {
    "q": "Is de site politiek bevooroordeeld?",
    "a": "Nee. Geen interpretatie, geen waardeoordeel: alleen ruwe cijfers met bronnen, die iedereen naar eigen inzicht kan interpreteren."
  }
];

const pl = [
  {
    "q": "Czy wskaźnik „udziału w głosowaniach” oznacza, że europoseł był obecny w Parlamencie?",
    "a": "Nie. Pokazuje on odsetek <b>głosowań imiennych</b> — głosowań rejestrowanych imiennie — w których europoseł faktycznie oddał głos (za, przeciw lub wstrzymując się) od początku kadencji. Fizyczna obecność na posiedzeniach plenarnych, w komisjach czy podczas debat <b>nie jest publikowana imiennie</b> przez Parlament Europejski, dlatego nie da się jej rzetelnie zmierzyć — a my jej nie wymyślamy."
  },
  {
    "q": "Dlaczego obecność i udział pokazują tu tę samą wartość, inaczej niż w serwisie o francuskich posłach?",
    "a": "Głosowania imienne w Parlamencie Europejskim rejestrują tylko cztery stanowiska: za, przeciw, wstrzymanie się oraz „did not vote” (brak głosu) — a „did not vote” oznacza nieobecność. Nie istnieje kategoria „obecny, ale niegłosujący” (jak posłowie „niegłosujący” we francuskim Zgromadzeniu Narodowym), dlatego obecność i udział są identyczne."
  },
  {
    "q": "Dlaczego Przewodnicząca Parlamentu ma wskaźnik bliski 0 %?",
    "a": "Przewodnicząca prowadzi obrady i głosuje bardzo rzadko; każde głosowanie imienne, w którym nie oddaje głosu, jest rejestrowane jako „did not vote”. Jej wskaźnik jest więc bliski zeru — co odzwierciedla jej rolę, a nie absencję."
  },
  {
    "q": "Czy wysoki wskaźnik oznacza, że europoseł jest bardzo obecny lub dużo pracuje?",
    "a": "Niekoniecznie. Głosowania imienne są grupowane w krótkie sesje głosowań: europoseł może pojawić się tylko na głosowanie i uzyskać wysoki wskaźnik, pomijając prace w komisjach, debaty i resztę tygodnia. Ta liczba nic nie mówi o pracy w komisjach ani o zaangażowaniu — czego Parlament nie publikuje imiennie. Obejmuje ona ponadto wyłącznie głosowania imienne, a nie głosowania przez podniesienie ręki."
  },
  {
    "q": "Skąd pochodzą dane?",
    "a": "Z głosowań imiennych Parlamentu Europejskiego (kadencja 2024-2029), zebranych i opublikowanych przez <b>HowTheyVote.eu</b> (licencja CC-BY, na podstawie oficjalnych danych Parlamentu). Każda karta odsyła do oficjalnego głosowania. Data ostatniej aktualizacji znajduje się na dole tej strony."
  },
  {
    "q": "Czy serwis jest politycznie stronniczy?",
    "a": "Nie. Żadnej interpretacji, żadnych ocen: wyłącznie surowe, udokumentowane liczby, które każdy może interpretować według własnego uznania."
  }
];

const pt = [
  {
    "q": "A taxa de «participação nas votações» significa que o eurodeputado esteve presente no Parlamento?",
    "a": "Não. Indica a percentagem de <b>votações nominais</b> — os votos registados nome a nome — em que o eurodeputado votou efetivamente (a favor, contra ou abstenção) desde o início do mandato. A presença física em sessão plenária, em comissão ou nos debates <b>não é publicada nominalmente</b> pelo Parlamento Europeu: é, por isso, impossível de medir com honestidade — e não a inventamos."
  },
  {
    "q": "Porque é que a presença e a participação apresentam aqui o mesmo número, ao contrário do site sobre os deputados franceses?",
    "a": "As votações nominais do Parlamento Europeu registam apenas quatro posições: a favor, contra, abstenção e «não votou» — e «não votou» significa ausente. Não existe uma categoria «presente mas sem votar» (como os «não votantes» na Assembleia Nacional francesa): a presença e a participação são, por isso, idênticas."
  },
  {
    "q": "Porque é que a Presidente do Parlamento apresenta uma taxa próxima de 0 %?",
    "a": "A Presidente preside às sessões e vota apenas muito raramente; cada votação nominal em que não vota é registada como «não votou». A sua taxa é, por isso, próxima de zero — o que reflete o seu papel, e não absentismo."
  },
  {
    "q": "Uma taxa elevada significa que o eurodeputado está muito presente ou trabalha muito?",
    "a": "Não necessariamente. As votações nominais são agrupadas em curtos períodos de votação: um eurodeputado pode aparecer apenas para votar e apresentar uma taxa elevada, faltando ao trabalho em comissão, aos debates e ao resto da semana. Este número nada diz sobre o trabalho em comissão ou o empenho — que o Parlamento não publica nominalmente. Além disso, abrange apenas as votações nominais, e não as votações por braços levantados."
  },
  {
    "q": "De onde vêm os dados?",
    "a": "Das votações nominais do Parlamento Europeu (mandato 2024-2029), agregadas e publicadas por <b>HowTheyVote.eu</b> (licença CC-BY, com base nos dados oficiais do Parlamento). Cada ficha remete para a votação oficial. A data de atualização figura no fundo desta página."
  },
  {
    "q": "O site toma partido politicamente?",
    "a": "Não. Nenhuma interpretação, nenhum juízo de valor: apenas números brutos e com fontes, cabendo a cada um interpretá-los como entender."
  }
];

const ro = [
  {
    "q": "Rata de „participare la voturi” înseamnă că eurodeputatul a fost prezent în Parlament?",
    "a": "Nu. Ea indică proporția <b>voturilor prin apel nominal</b> — voturile înregistrate nume cu nume — la care eurodeputatul a votat efectiv (pentru, împotrivă sau abținere) de la începutul mandatului. Prezența fizică în plen, în comisie sau la dezbateri <b>nu este publicată nominal</b> de Parlamentul European, așa că nu poate fi măsurată în mod onest — iar noi nu o inventăm."
  },
  {
    "q": "De ce prezența și participarea afișează aceeași cifră aici, spre deosebire de site-ul despre deputații francezi?",
    "a": "Voturile prin apel nominal ale Parlamentului European înregistrează doar patru poziții: pentru, împotrivă, abținere și „nu a votat” — iar „nu a votat” înseamnă absent. Nu există o categorie „prezent, dar fără să voteze” (precum „nevotanții” din Adunarea Națională franceză), astfel încât prezența și participarea sunt identice."
  },
  {
    "q": "De ce președintele Parlamentului afișează o rată apropiată de 0 %?",
    "a": "Președintele conduce ședințele și votează doar foarte rar; fiecare apel nominal la care nu votează este înregistrat ca „nu a votat”. Rata sa este, prin urmare, apropiată de zero — ceea ce reflectă rolul său, nu absenteismul."
  },
  {
    "q": "O rată ridicată înseamnă că eurodeputatul este foarte prezent sau muncește mult?",
    "a": "Nu neapărat. Voturile prin apel nominal sunt grupate în intervale scurte de votare: un eurodeputat poate apărea doar pentru vot și obține o rată ridicată, chiulind în același timp de la comisii, dezbateri și restul săptămânii. Această cifră nu spune nimic despre activitatea din comisii sau despre implicare — pe care Parlamentul nu le publică nominal. În plus, ea acoperă doar voturile prin apel nominal, nu și voturile prin ridicare de mână."
  },
  {
    "q": "De unde provin datele?",
    "a": "Din voturile prin apel nominal ale Parlamentului European (mandatul 2024-2029), agregate și publicate de <b>HowTheyVote.eu</b> (licența CC-BY, pe baza datelor oficiale ale Parlamentului). Fiecare fișă trimite la votul oficial. Data ultimei actualizări apare în josul acestei pagini."
  },
  {
    "q": "Site-ul are părtinire politică?",
    "a": "Nu. Nicio interpretare, nicio judecată de valoare: doar cifre brute, cu surse, pe care fiecare le poate interpreta cum consideră."
  }
];

const sk = [
  {
    "q": "Znamená miera „účasti na hlasovaniach“, že europoslanec bol prítomný v Parlamente?",
    "a": "Nie. Ukazuje podiel <b>hlasovaní podľa mien</b> — hlasovaní zaznamenaných po mene — pri ktorých europoslanec od začiatku volebného obdobia skutočne hlasoval (za, proti alebo sa zdržal). Fyzickú prítomnosť na plenárnom zasadnutí, vo výbore alebo v rozpravách Európsky parlament <b>nezverejňuje podľa jednotlivých poslancov</b>, takže sa nedá poctivo zmerať — a my si ju nevymýšľame."
  },
  {
    "q": "Prečo tu prítomnosť a účasť ukazujú rovnaké číslo, na rozdiel od stránky o francúzskych poslancoch?",
    "a": "Hlasovania podľa mien v Európskom parlamente zaznamenávajú len štyri pozície: za, proti, zdržanie sa a „did not vote“ (nehlasoval) — a „did not vote“ znamená neprítomný. Neexistuje kategória „prítomný, ale nehlasujúci“ (ako „nehlasujúci“ poslanci vo francúzskom Národnom zhromaždení), takže prítomnosť a účasť sú totožné."
  },
  {
    "q": "Prečo predsedníčka Parlamentu vykazuje mieru blízku 0 %?",
    "a": "Predsedníčka vedie zasadnutia a hlasuje len veľmi zriedka; každé hlasovanie podľa mien, pri ktorom nehlasuje, sa zaznamená ako „did not vote“. Jej miera je preto blízka nule — čo odráža jej úlohu, nie absentérstvo."
  },
  {
    "q": "Znamená vysoká miera, že europoslanec je veľmi prítomný alebo veľa pracuje?",
    "a": "Nie nevyhnutne. Hlasovania podľa mien sú zoskupené do krátkych hlasovacích okien: europoslanec sa môže dostaviť len na hlasovanie a vykázať vysokú mieru, pričom vynechá prácu vo výboroch, rozpravy a zvyšok týždňa. Toto číslo nehovorí nič o práci vo výboroch ani o angažovanosti — ktoré Parlament nezverejňuje podľa jednotlivých poslancov. Okrem toho zahŕňa len hlasovania podľa mien, nie hlasovania zdvihnutím ruky."
  },
  {
    "q": "Odkiaľ pochádzajú údaje?",
    "a": "Z hlasovaní podľa mien Európskeho parlamentu (volebné obdobie 2024-2029), agregovaných a zverejnených platformou <b>HowTheyVote.eu</b> (licencia CC-BY, na základe oficiálnych údajov Parlamentu). Každá karta odkazuje na oficiálne hlasovanie. Dátum poslednej aktualizácie je uvedený v spodnej časti tejto stránky."
  },
  {
    "q": "Je táto stránka politicky zaujatá?",
    "a": "Nie. Žiadna interpretácia, žiadny hodnotový úsudok: len surové čísla s uvedením zdrojov, ktoré si každý môže vyložiť podľa vlastného uváženia."
  }
];

const sl = [
  {
    "q": "Ali stopnja »udeležbe na glasovanjih« pomeni, da je bil poslanec prisoten v Parlamentu?",
    "a": "Ne. Prikazuje delež <b>poimenskih glasovanj</b> — glasovanj, zabeleženih po imenih — pri katerih je poslanec od začetka mandata dejansko oddal glas (za, proti ali vzdržan). Fizične prisotnosti na plenarnem zasedanju, v odboru ali med razpravami Evropski parlament <b>ne objavlja poimensko</b>, zato je ni mogoče pošteno izmeriti — in je ne izmišljujemo."
  },
  {
    "q": "Zakaj sta prisotnost in udeležba tukaj enaki, drugače kot na strani o francoskih poslancih?",
    "a": "Poimenska glasovanja Evropskega parlamenta beležijo le štiri možnosti: za, proti, vzdržan in »did not vote« — »did not vote« pa pomeni odsoten. Kategorije »prisoten, a brez glasovanja« (kot so »nevoteči« poslanci v francoski narodni skupščini) ni, zato sta prisotnost in udeležba enaki."
  },
  {
    "q": "Zakaj ima predsednica Parlamenta stopnjo blizu 0 %?",
    "a": "Predsednica vodi seje in glasuje le zelo redko; vsako poimensko glasovanje, pri katerem ne glasuje, se zabeleži kot »did not vote«. Njena stopnja je zato blizu nič — kar odraža njeno vlogo, ne odsotnosti."
  },
  {
    "q": "Ali visoka stopnja pomeni, da je poslanec zelo prisoten ali veliko dela?",
    "a": "Ne nujno. Poimenska glasovanja so združena v kratke časovne termine: poslanec se lahko pojavi le za glasovanje in doseže visoko stopnjo, medtem ko izpušča delo v odborih, razprave in preostanek tedna. Ta številka ne pove nič o delu v odborih ali angažiranosti — česar Parlament ne objavlja poimensko. Poleg tega zajema le poimenska glasovanja, ne pa glasovanj z dvigom rok."
  },
  {
    "q": "Od kod izhajajo podatki?",
    "a": "Iz poimenskih glasovanj Evropskega parlamenta (mandat 2024-2029), ki jih zbira in objavlja <b>HowTheyVote.eu</b> (licenca CC-BY, na podlagi uradnih podatkov Parlamenta). Vsaka kartica se povezuje z uradnim glasovanjem. Datum zadnje posodobitve je na dnu te strani."
  },
  {
    "q": "Ali je stran politično pristranska?",
    "a": "Ne. Brez interpretacije, brez vrednostne sodbe: le neobdelane, z viri podprte številke, ki jih vsak razlaga po svoje."
  }
];

const sv = [
  {
    "q": "Betyder andelen ”deltagande i omröstningar” att ledamoten var närvarande i parlamentet?",
    "a": "Nej. Den visar andelen <b>omröstningar med namnupprop</b> – röster som registreras namn för namn – där ledamoten faktiskt avgav en röst (för, mot eller nedlagd röst) sedan mandatperiodens början. Fysisk närvaro i plenum, i utskott eller i debatter <b>offentliggörs inte per ledamot</b> av Europaparlamentet, och kan därför inte mätas på ett hederligt sätt – och vi hittar inte på den."
  },
  {
    "q": "Varför visar närvaro och deltagande samma siffra här, till skillnad från webbplatsen om de franska ledamöterna?",
    "a": "Europaparlamentets omröstningar med namnupprop registrerar bara fyra positioner: för, mot, nedlagd röst och ”did not vote” – och ”did not vote” betyder frånvarande. Det finns ingen kategori ”närvarande men röstar inte” (som de ”icke röstande” ledamöterna i den franska nationalförsamlingen), och därför är närvaro och deltagande identiska."
  },
  {
    "q": "Varför visar parlamentets talman en andel nära 0 %?",
    "a": "Talmannen leder sammanträdena och röstar bara mycket sällan; varje omröstning med namnupprop där talmannen inte röstar registreras som ”did not vote”. Andelen ligger därför nära noll – vilket speglar rollen, inte frånvaro."
  },
  {
    "q": "Betyder en hög andel att ledamoten är mycket närvarande eller arbetar mycket?",
    "a": "Inte nödvändigtvis. Omröstningar med namnupprop samlas i korta omröstningspass: en ledamot kan dyka upp enbart för omröstningen och få en hög andel samtidigt som utskottsarbete, debatter och resten av veckan hoppas över. Den här siffran säger ingenting om utskottsarbete eller engagemang – något som parlamentet inte offentliggör per ledamot. Den omfattar dessutom bara omröstningar med namnupprop, inte omröstningar med handuppräckning."
  },
  {
    "q": "Varifrån kommer uppgifterna?",
    "a": "Från Europaparlamentets omröstningar med namnupprop (mandatperioden 2024-2029), sammanställda och publicerade av <b>HowTheyVote.eu</b> (CC-BY-licens, baserat på parlamentets officiella data). Varje kort länkar till den officiella omröstningen. Datumet för den senaste uppdateringen visas längst ner på den här sidan."
  },
  {
    "q": "Är webbplatsen politiskt partisk?",
    "a": "Nej. Ingen tolkning, ingen värdering: bara rena, källbelagda siffror, som var och en får tolka som de vill."
  }
];

module.exports = { bg, cs, da, de, el, en, es, et, fi, fr, ga, hr, hu, it, lt, lv, mt, nl, pl, pt, ro, sk, sl, sv };
