import { evaluate } from "./evaluator.js";
import { isValidCard } from "./cards.js";

// Calcule exactement les chances de chaque joueur avant le flop, en passant en
// revue tous les tableaux possibles de 5 cartes parmi les 48 cartes restantes
// (1 712 304 tableaux). Pas d'approximation ni de tirage aléatoire.
//
// hand1 et hand2 : tableaux de 2 cartes (entiers 0–51), toutes différentes.
// Retourne { boards, win1, win2, ties }.
export function computeEquity(hand1, hand2) {
  if (hand1?.length !== 2 || hand2?.length !== 2) throw new Error("Chaque joueur doit avoir 2 cartes.");
  if (![...hand1, ...hand2].every(isValidCard)) throw new Error("Carte invalide.");
  const used = new Set([...hand1, ...hand2]);
  if (used.size !== 4) throw new Error("Les 4 cartes doivent être différentes.");

  const deck = [];
  for (let c = 0; c < 52; c++) if (!used.has(c)) deck.push(c);
  const n = deck.length;
  const suit = deck.map((c) => Math.floor(c / 13));
  const bit = deck.map((c) => 1 << c % 13);

  // Masques par couleur des cartes privées de chaque joueur.
  const h1 = [0, 0, 0, 0];
  const h2 = [0, 0, 0, 0];
  for (const c of hand1) h1[Math.floor(c / 13)] |= 1 << c % 13;
  for (const c of hand2) h2[Math.floor(c / 13)] |= 1 << c % 13;

  let win1 = 0,
    win2 = 0,
    ties = 0;
  const b = [0, 0, 0, 0]; // masques du tableau en cours de construction

  // Cinq boucles imbriquées : chaque niveau ajoute une carte au tableau.
  for (let i = 0; i < n - 4; i++) {
    b[suit[i]] ^= bit[i];
    for (let j = i + 1; j < n - 3; j++) {
      b[suit[j]] ^= bit[j];
      for (let k = j + 1; k < n - 2; k++) {
        b[suit[k]] ^= bit[k];
        for (let l = k + 1; l < n - 1; l++) {
          b[suit[l]] ^= bit[l];
          for (let m = l + 1; m < n; m++) {
            b[suit[m]] ^= bit[m];
            const v1 = evaluate(b[0] | h1[0], b[1] | h1[1], b[2] | h1[2], b[3] | h1[3]);
            const v2 = evaluate(b[0] | h2[0], b[1] | h2[1], b[2] | h2[2], b[3] | h2[3]);
            if (v1 > v2) win1++;
            else if (v2 > v1) win2++;
            else ties++;
            b[suit[m]] ^= bit[m];
          }
          b[suit[l]] ^= bit[l];
        }
        b[suit[k]] ^= bit[k];
      }
      b[suit[j]] ^= bit[j];
    }
    b[suit[i]] ^= bit[i];
  }

  return { boards: win1 + win2 + ties, win1, win2, ties };
}

// Transforme les décomptes en pourcentages lisibles.
// L'équité d'un joueur = ses victoires + la moitié des égalités (pot partagé).
export function toPercentages({ boards, win1, win2, ties }) {
  const pct = (x) => (100 * x) / boards;
  return {
    boards,
    p1: { win: pct(win1), tie: pct(ties), lose: pct(win2), equity: pct(win1 + ties / 2) },
    p2: { win: pct(win2), tie: pct(ties), lose: pct(win1), equity: pct(win2 + ties / 2) },
  };
}
