# FicheEurodéputé.fr

La **fiche vivante** de chaque eurodéputé·e du Parlement européen (mandat 2024-2029) —
participation aux votes, votes pour/contre/abstention, loyauté au groupe européen — en
clair et 100 % sourcé. Membre de la famille [FicheDéputé.fr](https://fichedepute.fr).

Live : https://eu.fichedepute.fr

## Données
Construit à partir des **votes par appel nominal** du Parlement européen, agrégés et
publiés par **[HowTheyVote.eu](https://howtheyvote.eu)** (CC-BY, sur la base des données
officielles du PE) : membres, groupes politiques, ~5 300 votes, et la position de chaque
eurodéputé sur chaque vote (`member_votes`, ~17 M lignes).

Dimension géographique = le **pays** de l'eurodéputé (720 eurodéputés, 27 pays). « Did not
vote » = absence. La Présidente du Parlement, qui préside, vote très rarement (~0 %).

## Architecture
Réutilise le code de FicheDéputé (serveur Node zéro-dépendance, PWA vanilla, SEO) ;
`pipeline/build_euro.py` parse les CSV HowTheyVote → mêmes JSON (front partagé).
`scripts/refresh-data.sh` retélécharge l'export et reconstruit.

Données : Parlement européen via HowTheyVote.eu (CC-BY). Projet indépendant, réalisé avec patriotisme par zlef.fr.
