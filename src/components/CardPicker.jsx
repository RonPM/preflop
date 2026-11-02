import { useEffect, useRef } from "react";
import { RANKS, SUITS, cardName, makeCard } from "../lib/cards.js";

const RANKS_HIGH_FIRST = [...RANKS.keys()].reverse();

// Sélecteur des 52 cartes, une ligne par couleur. Les cartes déjà prises sont grisées.
export default function CardPicker({ player, slot, used, current, onChoose, onClose }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // À l'ouverture : bloque le défilement de la page, ferme avec Échap, place le focus
  // dans la fenêtre. À la fermeture : rend le focus à l'élément qui l'avait.
  useEffect(() => {
    const previousFocus = document.activeElement;
    const onKey = (event) => event.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    dialogRef.current?.querySelector(".deck-card:not(:disabled)")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
      previousFocus?.focus?.();
    };
  }, []);

  // Après chaque choix, le focus revient sur la première carte disponible.
  useEffect(() => {
    dialogRef.current?.querySelector(".deck-card:not(:disabled)")?.focus();
  }, [player, slot]);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className={`picker picker-p${player + 1}`}
        role="dialog"
        aria-modal="true"
        aria-label="Choisir une carte"
      >
        <div className="picker-head">
          <h2>
            Joueur {player + 1} · carte {slot + 1}
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <div className="deck">
          {SUITS.map((suit, s) => (
            <div key={suit.name} className="deck-row" role="group" aria-label={suit.name}>
              {RANKS_HIGH_FIRST.map((r) => {
                const card = makeCard(r, s);
                const taken = card !== current && used.includes(card);
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
        <p className="picker-note">J = Jack, Q = Queen, K = King, A = As</p>
      </div>
    </div>
  );
}
