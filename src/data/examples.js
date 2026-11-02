// Duels célèbres, pour lancer une démo en un clic.
// Notation des cartes : rang (2–9, T, J, Q, K, A) + couleur (s, h, d, c).
export const EXAMPLES = [
  { label: "AA contre KK", hand1: ["Ah", "As"], hand2: ["Kd", "Kc"] },
  { label: "AK contre QQ", hand1: ["As", "Kd"], hand2: ["Qh", "Qc"] },
  { label: "AK contre AQ", hand1: ["As", "Kd"], hand2: ["Ah", "Qc"] },
  { label: "22 contre AKs", hand1: ["2s", "2h"], hand2: ["Ad", "Kd"] },
  { label: "76s contre AA", hand1: ["7h", "6h"], hand2: ["As", "Ac"] },
];
