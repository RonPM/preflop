// Gestion des 4 emplacements de cartes : 2 joueurs × 2 cartes.
// hands = [[carte, carte], [carte, carte]], une case vide vaut null.

export const EMPTY_HANDS = [
  [null, null],
  [null, null],
];

const ORDER = [
  { player: 0, slot: 0 },
  { player: 0, slot: 1 },
  { player: 1, slot: 0 },
  { player: 1, slot: 1 },
];

// Place une carte dans un emplacement, sans modifier le tableau d'origine.
export function setCard(hands, { player, slot }, card) {
  return hands.map((hand, p) => hand.map((c, s) => (p === player && s === slot ? card : c)));
}

// Emplacement vide suivant, en partant de `from` et en faisant le tour.
// Retourne null si les 4 cartes sont choisies.
export function nextEmptySlot(hands, from) {
  const start = ORDER.findIndex((o) => o.player === from.player && o.slot === from.slot);
  for (let i = 1; i <= ORDER.length; i++) {
    const candidate = ORDER[(start + i) % ORDER.length];
    if (hands[candidate.player][candidate.slot] === null) return candidate;
  }
  return null;
}

export function isComplete(hands) {
  return hands.every((hand) => hand.every((c) => c !== null));
}

export function isEmpty(hands) {
  return hands.every((hand) => hand.every((c) => c === null));
}

export function usedCards(hands) {
  return hands.flat().filter((c) => c !== null);
}
