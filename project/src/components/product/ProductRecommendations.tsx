import {
  categoryPath,
  complementaryProducts,
  getCategory,
  primaryPlacement,
  relatedProducts,
  type CatalogProduct,
} from '../../lib/catalog';
import Shelf from '../shop/Shelf';
import ProductCard from './ProductCard';

/** Two shelves after the specs: accessories that pair with the product, then similar products. */
const ProductRecommendations = ({ product }: { product: CatalogProduct }) => {
  const complements = complementaryProducts([product]);
  const related = relatedProducts(product, 10);
  const category = getCategory(primaryPlacement(product)?.category);
  if (!complements.length && !related.length) return null;

  return (
    <div className="border-t border-ink/10 pb-12 pt-4 lg:pb-20">
      {complements.length > 0 && (
        <Shelf id="combina-com" title="Combina bem com" lead="Acessórios pensados para acompanhar este produto">
          {complements.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </Shelf>
      )}
      {related.length > 0 && (
        <Shelf
          id="recomendacoes"
          title="Também lhe pode interessar"
          lead={category ? `Mais em ${category.name}` : undefined}
          link={category && { to: categoryPath(category.slug), label: `Ver tudo em ${category.name}` }}
        >
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </Shelf>
      )}
    </div>
  );
};

export default ProductRecommendations;
