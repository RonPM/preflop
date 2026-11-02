// Représentation des cartes.
// Une carte est un entier de 0 à 51 : carte = couleur * 13 + rang.
// Rang : 0 = 2, 1 = 3, … 8 = 10, 9 = Jack, 10 = Queen, 11 = King, 12 = As.
// Couleur : 0 = pique, 1 = cœur, 2 = carreau, 3 = trèfle.

export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
export const RANK_NAMES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "As"];
export const SUITS = [
  { symbol: "♠", name: "pique", red: false },
  { symbol: "♥", name: "cœur", red: true },
  { symbol: "♦", name: "carreau", red: true },
  { symbol: "♣", name: "trèfle", red: false },
];

export const rankOf = (card) => card % 13;
export const suitOf = (card) => Math.floor(card / 13);
export const makeCard = (rank, suit) => suit * 13 + rank;

export function cardLabel(card) {
  return `${RANKS[rankOf(card)]}${SUITS[suitOf(card)].symbol}`;
}

export function cardName(card) {
  return `${RANK_NAMES[rankOf(card)]} de ${SUITS[suitOf(card)].name}`;
}

// Lit une carte écrite à l'anglaise, par exemple « As », « Td », « 9c ».
export function parseCard(text) {
  const ranks = "23456789TJQKA";
  const suits = "shdc";
  const rank = ranks.indexOf(text[0].toUpperCase());
  const suit = suits.indexOf(text[1].toLowerCase());
  if (rank < 0 || suit < 0 || text.length !== 2) throw new Error(`Carte invalide : ${text}`);
  return makeCard(rank, suit);
}
