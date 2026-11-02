import { useState } from "react";
import { parseCard } from "./lib/cards.js";
import { toPercentages } from "./lib/equity.js";
import { useEquity } from "./hooks/useEquity.js";
import { EXAMPLES } from "./data/examples.js";
import Header from "./components/Header.jsx";
import PlayerPanel from "./components/PlayerPanel.jsx";
import Showdown from "./components/Showdown.jsx";
import CardPicker from "./components/CardPicker.jsx";

const EMPTY = [
  [null, null],
  [null, null],
];

export default function App() {
  const [hands, setHands] = useState(EMPTY);
  const [picker, setPicker] = useState(null); // { player, slot } en cours de choix
  const { status, result } = useEquity(hands[0], hands[1]);
  const percentages = result ? toPercentages(result) : null;
  const used = hands.flat().filter((c) => c !== null);

  // Après un choix, on ouvre directement l'emplacement vide suivant.
  function nextEmpty(next, from) {
    const order = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const start = order.findIndex(([p, s]) => p === from.player && s === from.slot);
    for (let i = 1; i <= order.length; i++) {
      const [p, s] = order[(start + i) % order.length];
      if (next[p][s] === null) return { player: p, slot: s };
    }
    return null;
  }

  function chooseCard(card) {
    const next = hands.map((h) => [...h]);
    next[picker.player][picker.slot] = card;
    setHands(next);
    setPicker(nextEmpty(next, picker));
  }

  function clearSlot(player, slot) {
    setHands((current) => current.map((h, p) => h.map((c, s) => (p === player && s === slot ? null : c))));
  }

  function loadExample(example) {
    setHands([example.hand1.map(parseCard), example.hand2.map(parseCard)]);
    setPicker(null);
  }

  return (
    <div className="app">
      <Header />

      <main className="main">
        <section className="intro">
          <h1>Vous étiez à tapis. Vous aviez combien de chances ?</h1>
          <p>Entrez les deux mains, Preflop calcule les probabilités exactes de chaque joueur avant le flop.</p>
        </section>

        <div className="examples" aria-label="Exemples de duels">
          <span>Essayer :</span>
          {EXAMPLES.map((ex) => (
            <button key={ex.label} className="chip" onClick={() => loadExample(ex)}>
              {ex.label}
            </button>
          ))}
        </div>

        <div className="table">
          <PlayerPanel
            index={0}
            hand={hands[0]}
            stats={percentages?.p1}
            onPick={(slot) => setPicker({ player: 0, slot })}
            onClear={(slot) => clearSlot(0, slot)}
          />
          <Showdown
            status={status}
            hands={hands}
            percentages={percentages}
            ms={result?.ms}
            onReset={() => {
              setHands(EMPTY);
              setPicker(null);
            }}
            onSwap={() => setHands(([a, b]) => [b, a])}
          />
          <PlayerPanel
            index={1}
            hand={hands[1]}
            stats={percentages?.p2}
            onPick={(slot) => setPicker({ player: 1, slot })}
            onClear={(slot) => clearSlot(1, slot)}
          />
        </div>
      </main>

      <footer className="footer">
        Texas Hold'em, deux joueurs, all-in avant le flop. Calcul exact, sans approximation.
      </footer>

      {picker && (
        <CardPicker
          player={picker.player}
          slot={picker.slot}
          used={used}
          current={hands[picker.player][picker.slot]}
          onChoose={chooseCard}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
