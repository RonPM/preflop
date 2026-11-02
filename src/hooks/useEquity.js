import { useEffect, useRef, useState } from "react";
import { isComplete } from "../lib/slots.js";

// Clé unique d'un duel, qui sert aussi d'identifiant de message pour le worker.
const keyOf = (hands) => hands.map((hand) => hand.join(",")).join("|");

// Lance le calcul dans un Web Worker dès que les 4 cartes sont connues.
// Les résultats sont gardés en mémoire : revenir sur un duel déjà calculé est instantané.
// Retourne { status: "idle" | "computing" | "done" | "error", result }.
export function useEquity(hands) {
  const key = isComplete(hands) ? keyOf(hands) : null;
  const workerRef = useRef(null);
  const requestedRef = useRef(new Set()); // duels déjà envoyés au worker
  const [results, setResults] = useState(() => new Map());
  const [errors, setErrors] = useState(() => new Set());

  useEffect(() => {
    const worker = new Worker(new URL("../lib/equity.worker.js", import.meta.url), { type: "module" });
    worker.onmessage = ({ data }) => {
      if (data.result) setResults((current) => new Map(current).set(data.id, data.result));
      else setErrors((current) => new Set(current).add(data.id));
    };
    workerRef.current = worker;
    const requested = requestedRef.current;
    return () => {
      worker.terminate();
      requested.clear(); // un nouveau worker devra recevoir les demandes en attente
    };
  }, []);

  useEffect(() => {
    if (!key || requestedRef.current.has(key)) return;
    requestedRef.current.add(key);
    const [hand1, hand2] = key.split("|").map((part) => part.split(",").map(Number));
    workerRef.current.postMessage({ id: key, hand1, hand2 });
  }, [key]);

  if (!key) return { status: "idle", result: null };
  if (results.has(key)) return { status: "done", result: results.get(key) };
  if (errors.has(key)) return { status: "error", result: null };
  return { status: "computing", result: null };
}
