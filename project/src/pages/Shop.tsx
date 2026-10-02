import { motion } from 'framer-motion';
import { CATALOG, CATEGORIES, productsIn, sortProducts } from '../lib/catalog';
import { unsplash, unsplashSrcSet } from '../lib/images';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import { useShopMenu } from '../components/shop/ShopMenu';
import ProductGrid from '../components/shop/ProductGrid';
import SectionHeading from '../components/ui/SectionHeading';

// Editorial rhythm for the six category tiles: two wide, then four.
const TILE_LAYOUT = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-3'];
const TILE_SHAPE = ['lg:aspect-[16/10]', 'lg:aspect-[5/4]', 'lg:aspect-[3/4]', 'lg:aspect-[3/4]', 'lg:aspect-[3/4]', 'lg:aspect-[3/4]'];

const FEATURED = sortProducts(CATALOG, 'destaque').slice(0, 6);

/** /loja: the shop's front door. Categories are explored visually; each opens its subcategory menu. */
const Shop = () => {
  const { toggle, openCategory } = useShopMenu();

  return (
    <div className="pb-28 lg:pb-40">
      <header className="container-site pt-12 lg:pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45">Loja</p>
        <h1 className="mt-4 max-w-4xl overflow-hidden pb-[0.08em] font-display text-5xl font-medium leading-[1] tracking-tightest [text-wrap:balance] sm:text-6xl lg:text-[5.5rem]">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: easeOutExpo }}
          >
            Escolha por onde começar
          </motion.span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/60">
          Tecnologia original de {CATEGORIES.length} mundos diferentes. Toque numa categoria para ver as marcas e as
          gamas disponíveis.
        </p>
      </header>

      <section aria-label="Categorias" className="container-site mt-14 lg:mt-20">
        <motion.ul
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
        >
          {CATEGORIES.map((category, index) => {
            const count = productsIn(category.slug).length;
            const isOpen = openCategory === category.slug;
            return (
              <motion.li
                key={category.slug}
                className={`${index < 2 ? 'col-span-2' : 'col-span-1'} ${TILE_LAYOUT[index] ?? 'lg:col-span-3'}`}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOutExpo } },
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    // Desktop opens the menu under the category bar, so bring it into view; mobile uses a sheet.
                    if (window.matchMedia('(min-width: 1024px)').matches) window.scrollTo({ top: 0, behavior: 'smooth' });
                    toggle(category.slug);
                  }}
                  aria-expanded={isOpen}
                  className={`group relative block w-full overflow-hidden rounded-2xl bg-ink text-left text-paper ${
                    index < 2 ? 'aspect-[4/3]' : 'aspect-[3/4]'
                  } ${TILE_SHAPE[index] ?? ''}`}
                >
                  <img
                    src={unsplash(category.image, 1400)}
                    srcSet={unsplashSrcSet(category.image)}
                    sizes={index < 2 ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 lg:p-7">
                    <span className="font-display text-2xl font-medium tracking-tight lg:text-3xl">{category.name}</span>
                    <span className="text-sm text-paper/70">
                      <span className="max-sm:hidden">{category.tagline} · </span>
                      {count} produtos
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      <section className="container-site mt-28 lg:mt-40" aria-labelledby="destaques-loja">
        <SectionHeading id="destaques-loja" index="01" eyebrow="Em destaque" title="Os mais procurados" />
        <motion.div
          className="mt-12 lg:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 0.6 }}
        >
          <ProductGrid products={FEATURED} />
        </motion.div>
      </section>
    </div>
  );
};

export default Shop;
