import { describe, expect, it } from "vitest";
import { EMPTY_HANDS, isComplete, isEmpty, nextEmptySlot, setCard, usedCards } from "./slots.js";
import { parseCard, isValidCard } from "./cards.js";
import { formatPercent, formatInteger } from "./format.js";

describe("emplacements de cartes", () => {
  it("place une carte sans modifier l'état d'origine", () => {
    const next = setCard(EMPTY_HANDS, { player: 1, slot: 0 }, 12);
    expect(next[1][0]).toBe(12);
    expect(EMPTY_HANDS[1][0]).toBeNull();
  });

  it("enchaîne sur l'emplacement vide suivant, en faisant le tour", () => {
    let hands = setCard(EMPTY_HANDS, { player: 0, slot: 0 }, 1);
    expect(nextEmptySlot(hands, { player: 0, slot: 0 })).toEqual({ player: 0, slot: 1 });
    hands = setCard(hands, { player: 1, slot: 1 }, 2);
    expect(nextEmptySlot(hands, { player: 1, slot: 1 })).toEqual({ player: 0, slot: 1 });
  });

  it("ne propose plus d'emplacement quand les 4 cartes sont choisies", () => {
    const full = [
      [1, 2],
      [3, 4],
    ];
    expect(nextEmptySlot(full, { player: 0, slot: 0 })).toBeNull();
    expect(isComplete(full)).toBe(true);
    expect(isEmpty(EMPTY_HANDS)).toBe(true);
    expect(usedCards(setCard(EMPTY_HANDS, { player: 0, slot: 1 }, 7))).toEqual([7]);
  });
});

describe("cartes et formats", () => {
  it("lit la notation anglaise et refuse les entrées invalides", () => {
    expect(parseCard("As")).toBe(12);
    expect(parseCard("2c")).toBe(39);
    expect(() => parseCard("")).toThrow();
    expect(() => parseCard("Ax")).toThrow();
    expect(() => parseCard("10s")).toThrow();
    expect(isValidCard(51)).toBe(true);
    expect(isValidCard(52)).toBe(false);
  });

  it("formate les nombres à la française", () => {
    expect(formatPercent(42.75)).toBe("42,8");
    expect(formatInteger(1712304).replace(/\s/g, " ")).toBe("1 712 304");
  });
});
