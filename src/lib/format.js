// Formate un pourcentage à la française, avec une décimale : 42,8
export function formatPercent(value) {
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Formate un entier avec séparateur de milliers : 1 712 304
export function formatInteger(value) {
  return value.toLocaleString("fr-FR");
}
