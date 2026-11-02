// Évaluation d'une main de poker de 7 cartes (2 cartes privées + 5 cartes communes).
//
// La main est décrite par 4 masques de 13 bits, un par couleur : le bit n est
// allumé si la carte de rang n de cette couleur est présente. Tout le calcul se
// fait par opérations sur les bits, ce qui permet d'évaluer plusieurs millions
// de mains par seconde dans le navigateur.
//
// Le résultat est un entier : plus il est grand, meilleure est la main.
// valeur = catégorie × 2^26 + rangs principaux × 2^13 + départage

export const CATEGORIES = [
  "Hauteur",
  "Paire",
  "Double paire",
  "Brelan",
  "Quinte",
  "Couleur",
  "Full",
  "Carré",
  "Quinte flush",
];

const HIGH_CARD = 0,
  PAIR = 1,
  TWO_PAIR = 2,
  TRIPS = 3,
  STRAIGHT = 4,
  FLUSH = 5,
  FULL_HOUSE = 6,
  QUADS = 7,
  STRAIGHT_FLUSH = 8;
const CAT = 1 << 26;
const MAIN = 1 << 13;

// Tables précalculées pour les 8192 combinaisons de rangs possibles.
const POPCOUNT = new Uint8Array(8192);
const HIGH_BIT = new Uint16Array(8192); // bit le plus haut, sous forme de masque
const STRAIGHT_HIGH = new Uint16Array(8192); // masque de la plus haute carte d'une quinte, 0 si aucune

for (let m = 1; m < 8192; m++) {
  POPCOUNT[m] = POPCOUNT[m >> 1] + (m & 1);
  let h = 1 << 12;
  while (!(m & h)) h >>= 1;
  HIGH_BIT[m] = h;

  for (let top = 12; top >= 4; top--) {
    const run = 0b11111 << (top - 4);
    if ((m & run) === run) {
      STRAIGHT_HIGH[m] = 1 << top;
      break;
    }
  }
  // La « roue » : As, 2, 3, 4, 5 (l'As compte comme une carte basse).
  if (!STRAIGHT_HIGH[m] && (m & 0b1000000001111) === 0b1000000001111) STRAIGHT_HIGH[m] = 1 << 3;
}

// Garde les n bits les plus hauts d'un masque.
function topBits(mask, n) {
  let out = 0;
  for (let i = 0; i < n && mask; i++) {
    const h = HIGH_BIT[mask];
    out |= h;
    mask ^= h;
  }
  return out;
}

export function evaluate(s0, s1, s2, s3) {
  // Couleur : avec 7 cartes, une couleur exclut carré et full, on peut donc la traiter d'abord.
  let flushMask = 0;
  if (POPCOUNT[s0] >= 5) flushMask = s0;
  else if (POPCOUNT[s1] >= 5) flushMask = s1;
  else if (POPCOUNT[s2] >= 5) flushMask = s2;
  else if (POPCOUNT[s3] >= 5) flushMask = s3;
  if (flushMask) {
    const sf = STRAIGHT_HIGH[flushMask];
    if (sf) return STRAIGHT_FLUSH * CAT + sf * MAIN;
    return FLUSH * CAT + topBits(flushMask, 5) * MAIN;
  }

  // Nombre d'exemplaires de chaque rang, calculé par opérations sur les bits.
  const all = s0 | s1 | s2 | s3;
  const quads = s0 & s1 & s2 & s3;
  const odd = s0 ^ s1 ^ s2 ^ s3; // rangs présents 1 ou 3 fois
  const twoPlus = (s0 & s1) | (s0 & s2) | (s0 & s3) | (s1 & s2) | (s1 & s3) | (s2 & s3);
  const trips = twoPlus & odd;
  const pairs = twoPlus & ~odd & ~quads;
  const singles = all & ~twoPlus;

  if (quads) {
    return QUADS * CAT + quads * MAIN + HIGH_BIT[all & ~quads];
  }
  if (trips && (POPCOUNT[trips] > 1 || pairs)) {
    const t = HIGH_BIT[trips];
    return FULL_HOUSE * CAT + t * MAIN + HIGH_BIT[(trips & ~t) | pairs];
  }
  const straight = STRAIGHT_HIGH[all];
  if (straight) return STRAIGHT * CAT + straight * MAIN;
  if (trips) {
    return TRIPS * CAT + trips * MAIN + topBits(singles, 2);
  }
  if (POPCOUNT[pairs] >= 2) {
    const top2 = topBits(pairs, 2);
    return TWO_PAIR * CAT + top2 * MAIN + HIGH_BIT[(pairs & ~top2) | singles];
  }
  if (pairs) {
    return PAIR * CAT + pairs * MAIN + topBits(singles, 3);
  }
  return HIGH_CARD * CAT + topBits(singles, 5) * MAIN;
}

export function categoryOf(value) {
  return CATEGORIES[Math.floor(value / CAT)];
}

// Évalue une liste de cartes (entiers 0–51), pratique pour les tests.
export function evaluateCards(cards) {
  const masks = [0, 0, 0, 0];
  for (const c of cards) masks[Math.floor(c / 13)] |= 1 << c % 13;
  return evaluate(masks[0], masks[1], masks[2], masks[3]);
}
