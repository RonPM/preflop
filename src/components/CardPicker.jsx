import { useEffect } from "react";
import { RANKS, SUITS, cardName, makeCard } from "../lib/cards.js";

// Sélecteur des 52 cartes, une ligne par couleur. Les cartes déjà prises sont grisées.
export default function CardPicker({ player, slot, used, current, onChoose, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [onClose]);

  const ranksHighFirst = [...RANKS.keys()].reverse();

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`picker picker-p${player + 1}`} role="dialog" aria-modal="true" aria-label="Choisir une carte">
        <div className="picker-head">
          <h2>
            Joueur {player + 1} · carte {slot + 1}
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="deck">
          {SUITS.map((suit, s) => (
            <div key={suit.name} className="deck-row" role="group" aria-label={suit.name}>
              {ranksHighFirst.map((r) => {
                const card = makeCard(r, s);
                const taken = used.includes(card) && card !== current;
                return (
                  <button
                    key={card}
                    className={`deck-card ${suit.red ? "is-red" : ""} ${card === current ? "is-current" : ""}`}
                    disabled={taken}
                    onClick={() => onChoose(card)}
                    aria-label={taken ? `${cardName(card)}, déjà utilisée` : cardName(card)}
                  >
                    <span>{RANKS[r]}</span>
                    <span>{suit.symbol}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p className="picker-note">V = Valet, D = Dame, R = Roi, A = As</p>
      </div>
    </div>
  );
}
