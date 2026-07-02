// FicheDéputé.eu — FAQ content, single source of truth.
// Consumed by the client (/api/faq → Méthode page accordion) AND by the server
// (lib/seo.js injects a JSON-LD FAQPage on /methode so crawlers & AI lift the
// "présence non publiée nominativement" nuance without running JS).
// Answers may contain <b> for the rendered accordion; the JSON-LD builder strips tags.

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

module.exports = { fr, en };
