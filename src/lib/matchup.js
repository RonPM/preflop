import { RANK_NAMES, rankOf, suitOf } from "./cards.js";

// Noms des rangs au pluriel, pour décrire les paires (« paire de Rois »).
const PLURAL = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Valets", "Dames", "Rois", "As"];
const SHORT = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R", "A"];

// Notation courte d'une main : « AA », « AKs » (assortie), « AKo » (dépareillée).
export function handCode(hand) {
  const [a, b] = [...hand].sort((x, y) => rankOf(y) - rankOf(x));
  const ra = rankOf(a), rb = rankOf(b);
  if (ra === rb) return SHORT[ra] + SHORT[rb];
  return SHORT[ra] + SHORT[rb] + (suitOf(a) === suitOf(b) ? "s" : "o");
}

export function describeHand(hand) {
  const [a, b] = [...hand].sort((x, y) => rankOf(y) - rankOf(x));
  if (rankOf(a) === rankOf(b)) return `Paire de ${PLURAL[rankOf(a)]}`;
  const suited = suitOf(a) === suitOf(b) ? ", assortis" : "";
  return `${RANK_NAMES[rankOf(a)]}-${RANK_NAMES[rankOf(b)]}${suited}`;
}

// Type de duel, du point de vue du joueur 1.
export function matchupType(hand1, hand2) {
  const r1 = hand1.map(rankOf).sort((x, y) => y - x);
  const r2 = hand2.map(rankOf).sort((x, y) => y - x);
  const pair1 = r1[0] === r1[1];
  const pair2 = r2[0] === r2[1];

  if (r1[0] === r2[0] && r1[1] === r2[1]) return "Mêmes cartes : partage du pot le plus souvent";
  if (pair1 && pair2) return "Paire contre paire";
  if (pair1 || pair2) {
    const pair = pair1 ? r1[0] : r2[0];
    const other = pair1 ? r2 : r1;
    const above = other.filter((r) => r > pair).length;
    if (other.includes(pair)) return "Paire contre une main qui partage son rang";
    if (above === 2) return "Paire contre deux cartes plus hautes : le fameux « pile ou face »";
    if (above === 1) return "Paire contre une carte plus haute et une plus basse";
    return "Paire contre deux cartes plus basses";
  }
  const shared = r1.filter((r) => r2.includes(r)).length;
  if (shared > 0) return "Main dominée : une carte en commun, le meilleur kicker l'emporte souvent";
  if (Math.min(...r1) > Math.max(...r2) || Math.min(...r2) > Math.max(...r1)) {
    return "Deux cartes hautes contre deux cartes basses";
  }
  if ((r1[0] > r2[0] && r1[1] < r2[1]) || (r2[0] > r1[0] && r2[1] < r1[1])) {
    return "Cartes encadrées : une main contient l'autre";
  }
  return "Cartes entrelacées";
}

// Verdict en clair, à partir de l'équité (en %) d'un joueur.
export function verdict(equity) {
  if (equity >= 80) return "Grand favori";
  if (equity >= 60) return "Favori";
  if (equity > 55) return "Léger favori";
  if (equity >= 45) return "Pile ou face";
  if (equity > 40) return "Léger outsider";
  if (equity > 20) return "Outsider";
  return "Gros outsider";
}
