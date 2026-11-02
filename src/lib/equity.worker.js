import { computeEquity } from "./equity.js";

// Le calcul (1,7 million de tableaux) tourne dans un Web Worker, en arrière-plan,
// pour que l'interface reste fluide pendant ce temps.
self.onmessage = (event) => {
  const { id, hand1, hand2 } = event.data;
  try {
    self.postMessage({ id, result: computeEquity(hand1, hand2) });
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
};
