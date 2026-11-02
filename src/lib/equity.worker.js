import { computeEquity } from "./equity.js";

// Le calcul (1,7 million de tableaux) tourne dans un Web Worker, en arrière-plan,
// pour que l'interface reste fluide pendant ce temps.
self.onmessage = ({ data }) => {
  const { id, hand1, hand2 } = data;
  const started = performance.now();
  try {
    const result = computeEquity(hand1, hand2);
    self.postMessage({ id, result: { ...result, ms: Math.round(performance.now() - started) } });
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
};
