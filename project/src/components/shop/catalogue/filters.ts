import { SORT_OPTIONS, slugify, type SortId } from '../../../lib/catalog';

/** Products per page before "Mostrar mais produtos". */
export const PAGE = 12;

/** Brands listed before "Ver todas as marcas". */
export const VISIBLE_BRANDS = 6;

export const PRICES = [
  { id: 'ate-10000', label: 'Até 10 000 MT', test: (p: number) => p <= 10000 },
  { id: '10000-50000', label: '10 000 a 50 000 MT', test: (p: number) => p > 10000 && p <= 50000 },
  { id: '50000-100000', label: '50 000 a 100 000 MT', test: (p: number) => p > 50000 && p <= 100000 },
  { id: '100000-150000', label: '100 000 a 150 000 MT', test: (p: number) => p > 100000 && p <= 150000 },
  { id: 'mais-150000', label: 'Mais de 150 000 MT', test: (p: number) => p > 150000 },
] as const;

export const isSort = (value: string | null): value is SortId => SORT_OPTIONS.some((option) => option.id === value);
/** Lower case without accents or hyphens, for search. */
export const fold = (text: string) => slugify(text).replace(/-/g, ' ');
export const countLabel = (n: number) => `${n} ${n === 1 ? 'produto' : 'produtos'}`;
