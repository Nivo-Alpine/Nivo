# Nivo · Mont-Blanc (version de test)

Le point neige et avalanche du jour pour le massif du Mont-Blanc, en langage simple.
Estimation automatique en cours d'évaluation : ne remplace pas le bulletin officiel (BERA, SLF).

## Structure
- `index.html` : la page (onglets Aujourd'hui, Apprendre, Expert, À propos)
- `js/runtime.js` : charge les données de `data/` et prévient la page
- `js/d3.min.js` : bibliothèque de graphiques (d3 7.9.0)
- `img/` : fond de carte (© swisstopo) et photo d'en-tête (A. Buisse, CC BY-SA 3.0)
- `data/*.json` : les 9 jeux de données du bilan quotidien (zones, cristal, rose, faces, forecast, trend, history, learn, status) + `meta.json` (date de mise à jour)

## Mise à jour quotidienne
Le bilan nivologique (tâche planifiée, vers 17 h 36 heure de Paris) réécrit uniquement les fichiers de `data/`.
La page elle-même ne change pas d'un jour à l'autre.
