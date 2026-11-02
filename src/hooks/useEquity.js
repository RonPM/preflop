import { useEffect, useRef, useState } from "react";

// Lance le calcul dans le Web Worker dès que les 4 cartes sont connues.
// Les résultats sont gardés en mémoire : revenir sur un duel déjà calculé est instantané.
export function useEquity(hand1, hand2) {
  const workerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const [state, setState] = useState({ status: "idle", result: null });

  const complete = hand1.every((c) => c !== null) && hand2.every((c) => c !== null);
  const key = complete ? `${hand1.join(",")}|${hand2.join(",")}` : null;

  useEffect(() => {
    workerRef.current = new Worker(new URL("../lib/equity.worker.js", import.meta.url), { type: "module" });
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!key) {
      setState({ status: "idle", result: null });
      return;
    }
    const cached = cacheRef.current.get(key);
    if (cached) {
      setState({ status: "done", result: cached });
      return;
    }

    const worker = workerRef.current;
    const started = performance.now();
    setState({ status: "computing", result: null });

    const onMessage = (event) => {
      if (event.data.id !== key) return; // réponse à un ancien calcul : ignorée
      if (event.data.error) {
        setState({ status: "error", result: null });
        return;
      }
      const result = { ...event.data.result, ms: Math.round(performance.now() - started) };
      cacheRef.current.set(key, result);
      setState({ status: "done", result });
    };
    worker.addEventListener("message", onMessage);
    worker.postMessage({ id: key, hand1, hand2 });
    return () => worker.removeEventListener("message", onMessage);
    // La clé résume les deux mains : inutile de dépendre des tableaux eux-mêmes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
