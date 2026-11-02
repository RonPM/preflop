import { formatPercent } from "../lib/format.js";
import { cardName } from "../lib/cards.js";
import { describeHand, verdict } from "../lib/matchup.js";
import PlayingCard from "./PlayingCard.jsx";

export default function PlayerPanel({ index, hand, stats, onPick, onClear }) {
  const complete = hand.every((c) => c !== null);
  return (
    <section className={`player player-${index + 1}`} aria-label={`Joueur ${index + 1}`}>
      <h2>Joueur {index + 1}</h2>

      <div className="slots">
        {hand.map((card, slot) =>
          card === null ? (
            <button
              key={slot}
              className="slot is-empty"
              onClick={() => onPick(slot)}
              aria-label={`Choisir la carte ${slot + 1} du joueur ${index + 1}`}
            >
              <span aria-hidden="true">+</span>
            </button>
          ) : (
            <div key={slot} className="slot-wrap">
              <button
                className="slot"
                onClick={() => onPick(slot)}
                aria-label={`${cardName(card)}, changer cette carte`}
              >
                <PlayingCard card={card} />
              </button>
              <button className="slot-clear" onClick={() => onClear(slot)} aria-label={`Retirer ${cardName(card)}`}>
                ✕
              </button>
            </div>
          ),
        )}
      </div>

      <p className="hand-name">{complete ? describeHand(hand) : "Choisissez 2 cartes"}</p>

      <div className={`equity ${stats ? "" : "is-empty"}`} aria-live="polite">
        <div className="equity-main">
          <strong>{stats ? `${formatPercent(stats.equity)} %` : "– %"}</strong>
          <span>{stats ? verdict(stats.equity) : "de chances"}</span>
        </div>
        <dl className="equity-detail">
          <div>
            <dt>Victoire</dt>
            <dd>{stats ? `${formatPercent(stats.win)} %` : "–"}</dd>
          </div>
          <div>
            <dt>Égalité</dt>
            <dd>{stats ? `${formatPercent(stats.tie)} %` : "–"}</dd>
          </div>
          <div>
            <dt>Défaite</dt>
            <dd>{stats ? `${formatPercent(stats.lose)} %` : "–"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
