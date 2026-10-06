const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
/** Mixes a colour towards black (0) or white (255). */
export const mixColor = (hex: string, target: number, amount: number) =>
  `rgb(${rgb(hex)
    .map((c) => Math.round(c + (target - c) * amount))
    .join(', ')})`;
