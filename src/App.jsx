import { useState } from "react";
import { parseCard } from "./lib/cards.js";
import { toPercentages } from "./lib/equity.js";
import { EMPTY_HANDS, nextEmptySlot, setCard, usedCards } from "./lib/slots.js";
import { useEquity } from "./hooks/useEquity.js";
import { EXAMPLES } from "./data/examples.js";
import Header from "./components/Header.jsx";
import PlayerPanel from "./components/PlayerPanel.jsx";
import Showdown from "./components/Showdown.jsx";
import CardPicker from "./components/CardPicker.jsx";

export default function App() {
  const [hands, setHands] = useState(EMPTY_HANDS);
  const [picker, setPicker] = useState(null); // emplacement en cours de choix : { player, slot }
  const { status, result } = useEquity(hands);
  const percentages = result ? toPercentages(result) : null;

  function chooseCard(card) {
    const next = setCard(hands, picker, card);
    setHands(next);
    setPicker(nextEmptySlot(next, picker)); // enchaîne sur l'emplacement vide suivant
  }

  function loadExample(example) {
    setHands([example.hand1.map(parseCard), example.hand2.map(parseCard)]);
    setPicker(null);
  }

  function reset() {
    setHands(EMPTY_HANDS);
    setPicker(null);
  }

  const panelProps = (player) => ({
    index: player,
    hand: hands[player],
    stats: percentages?.[player === 0 ? "p1" : "p2"],
    onPick: (slot) => setPicker({ player, slot }),
    onClear: (slot) => setHands((current) => setCard(current, { player, slot }, null)),
  });

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
          {EXAMPLES.map((example) => (
            <button key={example.label} className="chip" onClick={() => loadExample(example)}>
              {example.label}
            </button>
          ))}
        </div>

        <div className="table">
          <PlayerPanel {...panelProps(0)} />
          <Showdown
            status={status}
            hands={hands}
            percentages={percentages}
            ms={result?.ms}
            onReset={reset}
            onSwap={() => setHands(([first, second]) => [second, first])}
          />
          <PlayerPanel {...panelProps(1)} />
        </div>
      </main>

      <footer className="footer">
        Texas Hold&apos;em, deux joueurs, all-in avant le flop. Calcul exact, sans approximation.
      </footer>

      {picker && (
        <CardPicker
          player={picker.player}
          slot={picker.slot}
          used={usedCards(hands)}
          current={hands[picker.player][picker.slot]}
          onChoose={chooseCard}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
