# Preflop · vos chances à l'all-in

Application web qui calcule, au poker Texas Hold'em, les probabilités exactes de chaque joueur quand deux mains s'affrontent à tapis avant le flop.

Projet personnel réalisé avec Claude Code.

## Le problème

Après un all-in perdu (ou gagné), un joueur se demande : « J'avais combien de chances, en vrai ? ». Les réponses approximatives (« à peu près 80/20 ») ne disent pas si la décision était bonne, et les outils existants sont souvent pensés pour les experts.

## Ce que fait le prototype

- **Saisie des deux mains** carte par carte, dans un sélecteur des 52 cartes (les cartes déjà prises sont grisées).
- **Probabilités exactes** pour chaque joueur : victoire, égalité, défaite, et chances globales (victoires + moitié des égalités).
- **Verdict en clair** : « Grand favori », « Pile ou face », « Outsider »…, avec le type de duel (paire contre deux cartes plus hautes, main dominée…).
- **Exemples célèbres** en un clic (AA contre KK, AK contre QQ…), bouton pour inverser les joueurs et pour recommencer.
- **Responsive** : utilisable sur ordinateur et sur mobile.

## Choix techniques

- **Calcul exact, pas de simulation** : les 1 712 304 tableaux possibles (5 cartes parmi les 48 restantes) sont tous passés en revue.
- **Évaluateur de mains par opérations sur les bits** (`src/lib/evaluator.js`) : chaque main de 7 cartes est représentée par 4 masques de 13 bits (un par couleur). Le calcul complet prend environ 150 ms.
- **Web Worker** (`src/lib/equity.worker.js`) : le calcul tourne en arrière-plan, l'interface reste fluide. Les résultats déjà calculés sont gardés en mémoire.
- **Tests unitaires** (Vitest) : catégories de mains, départages, roue (As-2-3-4-5), nombre de tableaux, valeurs de référence (AA contre KK), symétrie. L'évaluateur a aussi été comparé à un évaluateur de référence naïf sur 400 000 mains aléatoires, sans aucune différence.
- React 19 + Vite, sans dépendance supplémentaire ni serveur.

## Structure du projet

```
src/
  main.jsx               point d'entrée
  App.jsx                état de l'app (mains, sélecteur, exemples)
  styles.css             styles et responsive
  components/            en-tête, panneau joueur, carte, duel, sélecteur de cartes
  hooks/useEquity.js     lance le calcul dans le Web Worker
  lib/cards.js           représentation des cartes
  lib/evaluator.js       évaluation d'une main de 7 cartes
  lib/equity.js          calcul exact des probabilités
  lib/matchup.js         type de duel et verdict
  lib/poker.test.js      tests
  data/examples.js       duels célèbres
public/                  icône
```

## Lancer le projet

```bash
npm install
npm run dev      # serveur de développement
npm test         # tests unitaires
npm run lint     # vérification du code
npm run build    # version de production dans dist/
```

## Pistes pour la suite

- Ajouter le flop, le turn et la river pour vérifier un all-in joué plus tard dans la main.
- Plus de deux joueurs.
- Un historique de ses all-in, pour mesurer sa chance (ou sa malchance) sur une session.
