import { RANKS, SUITS, rankOf, suitOf } from "../lib/cards.js";

// Affichage d'une carte : rang en haut, grande couleur au centre.
export default function PlayingCard({ card, size = "large" }) {
  const suit = SUITS[suitOf(card)];
  return (
    <span className={`playing-card ${size} ${suit.red ? "is-red" : ""}`}>
      <span className="pc-rank">{RANKS[rankOf(card)]}</span>
      <span className="pc-suit">{suit.symbol}</span>
    </span>
  );
}
