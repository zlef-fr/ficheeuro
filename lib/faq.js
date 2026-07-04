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

module.exports = { en, fr, de, es, it };
