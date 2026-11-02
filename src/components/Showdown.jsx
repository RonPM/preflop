import { formatPercent, formatInteger } from "../lib/format.js";
import { isEmpty } from "../lib/slots.js";
import { handCode, matchupType } from "../lib/matchup.js";

// Zone centrale : barre de probabilités, type de duel et actions.
export default function Showdown({ status, hands, percentages, ms, onReset, onSwap }) {
  const empty = isEmpty(hands);

  return (
    <section className="showdown" aria-label="Résultat">
      <div className="vs" aria-hidden="true">
        VS
      </div>

      {status === "computing" && (
        <div className="computing">
          <div className="spinner" aria-hidden="true" />
          <p>Calcul sur 1 712 304 tableaux…</p>
        </div>
      )}

      {status === "done" && percentages && (
        <div className="result">
          <p className="matchup-title">
            <span className="p1-text">{handCode(hands[0])}</span> contre{" "}
            <span className="p2-text">{handCode(hands[1])}</span>
          </p>
          <div
            className="bar"
            role="img"
            aria-label={`Joueur 1 ${formatPercent(percentages.p1.win)} %, égalité ${formatPercent(percentages.p1.tie)} %, joueur 2 ${formatPercent(percentages.p2.win)} %`}
          >
            <span className="bar-p1" style={{ width: `${percentages.p1.win}%` }} />
            <span className="bar-tie" style={{ width: `${percentages.p1.tie}%` }} />
            <span className="bar-p2" style={{ width: `${percentages.p2.win}%` }} />
          </div>
          <div className="bar-legend">
            <span className="p1-text">{formatPercent(percentages.p1.win)} %</span>
            <span className="muted">égalité {formatPercent(percentages.p1.tie)} %</span>
            <span className="p2-text">{formatPercent(percentages.p2.win)} %</span>
          </div>
          <p className="matchup-type">{matchupType(hands[0], hands[1])}</p>
          <p className="proof">
            Calcul exact sur {formatInteger(percentages.boards)} tableaux possibles
            {ms !== undefined ? ` · ${ms} ms` : ""}
          </p>
          <p className="proof">Chances affichées = victoires + moitié des égalités (pot partagé).</p>
        </div>
      )}

      {status === "error" && <p className="muted">Le calcul a échoué. Vérifiez les cartes choisies.</p>}

      {status === "idle" && (
        <p className="hint">Choisissez les 4 cartes pour voir les probabilités, ou essayez un exemple.</p>
      )}

      <div className="actions">
        <button className="btn btn-ghost" onClick={onSwap} disabled={empty}>
          ⇄ Inverser
        </button>
        <button className="btn btn-primary" onClick={onReset} disabled={empty}>
          Nouvelle main
        </button>
      </div>
    </section>
  );
}
