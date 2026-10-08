const UNSPLASH = 'https://images.unsplash.com/photo-';
const WIDTHS = [480, 800, 1200, 1600, 2200];

export const unsplash = (id: string, width = 1200) =>
  `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=80`;

export const unsplashSrcSet = (id: string) =>
  WIDTHS.map((w) => `${unsplash(id, w)} ${w}w`).join(', ');
