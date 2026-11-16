import { describe, expect, it } from 'vitest';
import {
  CATALOG,
  CATEGORIES,
  getCategory,
  getProductBySlug,
  getSubcategory,
  priceFrom,
  productsIn,
  slugify,
  sortProducts,
} from './catalog';

// The catalogue is data: these checks keep a new or edited product from breaking the shop.
describe('integridade do catálogo', () => {
  it('não repete ids nem endereços de produto', () => {
    const ids = CATALOG.map((product) => product.id);
    const slugs = CATALOG.map((product) => product.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(CATALOG.map((product) => [product.title, product] as const))(
    '%s tem preço, foto e prateleira válidas',
    (_title, product) => {
      expect(product.price).toBeGreaterThan(0);
      expect(priceFrom(product)).toBeGreaterThan(0);
      expect(product.primaryImage).toBeTruthy();
      expect(product.placements.length).toBeGreaterThan(0);
      for (const placement of product.placements) {
        const category = getCategory(placement.category);
        expect(category, `categoria ${placement.category}`).toBeDefined();
        expect(getSubcategory(category, placement.subcategory), `gama ${placement.subcategory}`).toBeDefined();
      }
      expect(getProductBySlug(product.slug)).toBe(product);
    },
  );

  it('não deixa nenhuma categoria vazia', () => {
    for (const category of CATEGORIES) expect(productsIn(category.slug).length, category.slug).toBeGreaterThan(0);
  });
});

describe('endereços e ordenação', () => {
  it('cria endereços sem acentos nem símbolos', () => {
    expect(slugify('Câmaras & Ação 4K')).toBe('camaras-acao-4k');
    expect(slugify('  iPhone 17 Pro  ')).toBe('iphone-17-pro');
  });

  it('ordena pelo preço mais baixo de cada produto', () => {
    const ascending = sortProducts(CATALOG, 'preco-asc').map(priceFrom);
    const descending = sortProducts(CATALOG, 'preco-desc').map(priceFrom);
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
    expect(descending).toEqual([...descending].sort((a, b) => b - a));
  });

  it('não altera a lista original ao ordenar', () => {
    const before = CATALOG.map((product) => product.id);
    sortProducts(CATALOG, 'preco-asc');
    expect(CATALOG.map((product) => product.id)).toEqual(before);
  });
});
