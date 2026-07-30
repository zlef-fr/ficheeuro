# FicheEurodéputé.fr

![views](https://assets.zlef.fr/badge/views/zlef-fr/ficheeuro.svg)

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

## Données : rafraîchies chaque jour via Sluice

Les entrées ne sont plus téléchargées par ce dépôt : elles viennent de
**[Sluice](https://sluice.zlef.fr)**, la passerelle open-data de la flotte, qui
revérifie chaque source une fois par jour et garde la version courante *plus ses
précédentes* (sha256 par version). Le catalogue de ce projet est
`scripts/sluice-sources.json` ; `scripts/sluice.sh` fait les `sluice_get` et
retombe sur l'URL upstream si Sluice est injoignable.

```bash
bash scripts/refresh-data.sh              # reconstruit data/ depuis Sluice
sluice_versions fr-an-deputes             # quelles versions sont disponibles
sluice_get fr-an-deputes /tmp/x.zip 20260729T041500Z   # rebuild épinglé
```

Le rebuild quotidien est déclenché côté hôte (`/root/bin/fiche-refresh`, timer
systemd 05:20) : pipeline → `docker compose restart`. Aucune URL datée à mettre à
jour à la main — les ressources data.gouv sont référencées par leur id stable.

⚠ **`data/` n'est pas versionné** (`.gitignore`) : c'est un produit dérivé, entièrement
régénérable par `scripts/refresh-data.sh`. Un clone neuf a donc un `data/` vide — lancez
le script avant de builder l'image. En production, le conteneur le lit depuis l'hôte via
le bind mount `./data` de `docker-compose.yml`.
