import { Link } from 'react-router-dom';
import { categoryPath, primaryPlacement, relatedProducts, type CatalogProduct } from '../../lib/catalog';
import ProductGrid from '../shop/ProductGrid';
import SectionHeading from '../ui/SectionHeading';

const ProductRecommendations = ({ product }: { product: CatalogProduct }) => {
  const related = relatedProducts(product, 4);
  if (!related.length) return null;
  const placement = primaryPlacement(product);

  return (
    <section className="border-t border-ink/10" aria-labelledby="recomendacoes">
      <div className="container-site py-24 lg:py-32">
        <SectionHeading
          id="recomendacoes"
          index="03"
          eyebrow="Continue a explorar"
          title="Também lhe pode interessar"
          action={
            placement && (
              <Link to={categoryPath(placement.category)} className="link-underline text-sm">
                Ver a categoria
              </Link>
            )
          }
        />
        <div className="mt-12 lg:mt-16">
          <ProductGrid products={related} columns={4} />
        </div>
      </div>
    </section>
  );
};

export default ProductRecommendations;
