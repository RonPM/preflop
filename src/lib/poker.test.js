import { describe, expect, it } from "vitest";
import { parseCard } from "./cards.js";
import { evaluateCards, categoryOf } from "./evaluator.js";
import { computeEquity, toPercentages } from "./equity.js";
import { handCode, matchupType, verdict } from "./matchup.js";

const cards = (text) => text.split(" ").map(parseCard);
const hand = (text) => [parseCard(text.slice(0, 2)), parseCard(text.slice(2))];
const value = (text) => evaluateCards(cards(text));

describe("évaluation des mains de 7 cartes", () => {
  it.each([
    ["As Ks Qs Js Ts 2d 3c", "Quinte flush"],
    ["9h 9d 9s 9c 2d 3c 5h", "Carré"],
    ["Kh Kd Ks 4c 4d 2s 7h", "Full"],
    ["2h 7h 9h Jh Kh 3c 4d", "Couleur"],
    ["Ah 2d 3c 4s 5h Kd Qc", "Quinte"],
    ["Qh Qd Qs 7c 4d 2s 9h", "Brelan"],
    ["Jh Jd 4c 4d 9s 2h 6c", "Double paire"],
    ["Ah Ad 9c 7d 5s 3h 2c", "Paire"],
    ["Ah Kd 9c 7d 5s 3h 2c", "Hauteur"],
  ])("%s → %s", (text, expected) => {
    expect(categoryOf(value(text))).toBe(expected);
  });

  it("la roue (As-2-3-4-5) est la plus petite quinte", () => {
    expect(value("Ah 2d 3c 4s 5h 9d Jc")).toBeLessThan(value("2h 3d 4c 5s 6h 9d Jc"));
  });

  it("départage au kicker", () => {
    expect(value("Ah Ad Kc 7d 5s 3h 2c")).toBeGreaterThan(value("Ah Ad Qc 7d 5s 3h 2c"));
  });

  it("une main identique sur le tableau donne une égalité", () => {
    expect(value("2c 3d As Ks Qs Js Ts")).toBe(value("4h 5h As Ks Qs Js Ts"));
  });

  it("la troisième paire ne compte pas, mais peut servir de kicker", () => {
    expect(value("Kh Kd Qc Qd 9s 9h Ac")).toBeGreaterThan(value("Kh Kd Qc Qd 9s 9h 8c"));
  });
});

describe("calcul exact des probabilités", () => {
  it("passe en revue les 1 712 304 tableaux possibles", () => {
    const r = computeEquity(hand("AhAs"), hand("KdKc"));
    expect(r.boards).toBe(1712304);
    expect(r.win1 + r.win2 + r.ties).toBe(1712304);
  });

  it("AA contre KK : l'As gagne environ 81 % du temps", () => {
    const { p1, p2 } = toPercentages(computeEquity(hand("AhAs"), hand("KdKc")));
    expect(p1.win).toBeCloseTo(81.06, 1);
    expect(p2.win).toBeCloseTo(18.55, 1);
    expect(p1.equity + p2.equity).toBeCloseTo(100, 6);
  });

  it("AK contre QQ est proche d'un pile ou face, avantage à la paire", () => {
    const { p1 } = toPercentages(computeEquity(hand("AsKd"), hand("QhQc")));
    expect(p1.equity).toBeGreaterThan(42);
    expect(p1.equity).toBeLessThan(45);
  });

  it("deux mains identiques de couleurs différentes sont symétriques", () => {
    const r = computeEquity(hand("AsKs"), hand("AhKh"));
    expect(r.win1).toBe(r.win2);
  });

  it("refuse une carte utilisée deux fois ou une main incomplète", () => {
    expect(() => computeEquity(hand("AsKs"), hand("AsQh"))).toThrow();
    expect(() => computeEquity([parseCard("As")], hand("QhQd"))).toThrow();
    expect(() => computeEquity([12, 60], hand("QhQd"))).toThrow();
  });
});

describe("description du duel", () => {
  it("notation courte", () => {
    expect(handCode(hand("KsAs"))).toBe("AKs");
    expect(handCode(hand("AsKd"))).toBe("AKo");
    expect(handCode(hand("7h7d"))).toBe("77");
  });

  it("types de duel", () => {
    expect(matchupType(hand("2s2h"), hand("AdKd"))).toMatch(/pile ou face/);
    expect(matchupType(hand("AsKd"), hand("AhQc"))).toMatch(/dominée/);
    expect(matchupType(hand("AhAs"), hand("KdKc"))).toBe("Paire contre paire");
    expect(matchupType(hand("AhKs"), hand("7d2c"))).toMatch(/hautes contre/);
  });

  it("verdict", () => {
    expect(verdict(82)).toBe("Grand favori");
    expect(verdict(50)).toBe("Pile ou face");
    expect(verdict(12)).toBe("Gros outsider");
  });
});
