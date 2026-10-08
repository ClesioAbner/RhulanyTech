import type { ArticleBlock } from '../../../data/blog';

/** A section heading of a guide. */
export type Heading = Extract<ArticleBlock, { type: 'h2' }>;

/** 01, 02, 03… for section headings and the table of contents. */
export const sectionNumber = (index: number) => String(index + 1).padStart(2, '0');
