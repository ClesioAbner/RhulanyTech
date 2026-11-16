import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATALOG, CATEGORIES, categoryFace, categoryPath, productsIn } from '../lib/catalog';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import Showroom from '../components/shop/Showroom';
import PocketShop from '../components/shop/PocketShop';
import Catalogue from '../components/shop/catalogue/Catalogue';
import ProductImage from '../components/product/ProductImage';
import PhoneCopy from '../components/ui/PhoneCopy';
import Rail from '../components/ui/Rail';

const SERVICES = [
  { title: 'Garantia oficial', body: 'Produtos originais e selados, com a garantia do fabricante.' },
  { title: 'Entrega em todo o país', body: 'Em Maputo e em todas as províncias, com acompanhamento.' },
  { title: 'Pague como preferir', body: 'M-Pesa, e-Mola, mKesh, cartão ou PayPal, no checkout.' },
  { title: 'Ajuda de quem percebe', body: 'Uma equipa que conhece os produtos e o ajuda a escolher.' },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo, delay: i * 0.06 } }),
};

/** /loja: the showroom, the categories, then the whole catalogue with filters. */
const Shop = () => (
  <div className="pb-24 lg:pb-32">
    <Showroom />

    {/* Categories */}
    <section aria-labelledby="categorias" className="container-site mt-16 lg:mt-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-ink/45">Categorias</p>
          <h2 id="categorias" className="type-title mt-3">
            Compre por categoria
          </h2>
        </div>
      </div>
      {/* Phones and tablets: a row to swipe; desktop: all six side by side */}
      <Rail
        label="Categorias"
        className="mt-8"
        gridClassName="lg:grid lg:grid-cols-6 lg:gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
      >
        {CATEGORIES.map((category, index) => {
          const face = categoryFace(category.slug);
          return (
            <motion.li
              key={category.slug}
              custom={index}
              variants={reveal}
              className="w-[40%] shrink-0 snap-start sm:w-[28%] lg:w-auto"
            >
              <Link
                to={categoryPath(category.slug)}
                className="tap-feedback group block overflow-hidden rounded-[22px] bg-white ring-1 ring-ink/[0.06] transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(12,12,13,0.32)]"
              >
                <div className="stage relative aspect-square">
                  {face && (
                    <span className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5 group-hover:scale-[1.05]">
                      <ProductImage src={face} inset="p-[16%]" loading="lazy" loader />
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2 px-4 pb-4 pt-3">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs tabular-nums text-ink/40">{productsIn(category.slug).length}</span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </Rail>
    </section>

    {/* Catalogue */}
    <section id="catalogo" aria-labelledby="catalogo-titulo" className="container-site mt-20 scroll-mt-24 lg:mt-28">
      <div className="mb-8 lg:mb-10">
        <p className="eyebrow text-ink/45">Catálogo</p>
        <h2 id="catalogo-titulo" className="type-title mt-3">
          Todos os produtos
        </h2>
        <p className="type-lead mt-3 max-w-xl text-ink/60">
          <PhoneCopy phone="Originais, com garantia e entrega">
            Originais, com garantia e entrega em todo o país. Filtre por marca, preço ou disponibilidade.
          </PhoneCopy>
        </p>
      </div>
      <Catalogue products={CATALOG} />
    </section>

    {/* The shop on a phone, in 3D */}
    <PocketShop />

    {/* Services: one panel in four parts, split by hairlines (two by two on phones) */}
    <section aria-label="Porquê comprar na Rhulany Tech" className="container-site mt-24 lg:mt-32">
      <ul className="grid grid-cols-2 overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/[0.06] lg:grid-cols-4">
        {SERVICES.map((service, index) => (
          <motion.li
            key={service.title}
            custom={index}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            className={`flex flex-col border-ink/[0.07] p-6 sm:p-8 lg:p-10 ${index % 2 === 1 ? 'border-l' : ''} ${
              index >= 2 ? 'border-t lg:border-t-0' : ''
            } ${index === 2 ? 'lg:border-l' : ''}`}
          >
            <span className="text-xs tabular-nums text-ink/35">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="mt-8 font-display text-[17px] font-medium leading-snug tracking-tight sm:text-xl lg:mt-14">
              {service.title}
            </h3>
            {/* Phones: the four titles say enough */}
            <p className="mt-2 text-sm leading-relaxed text-ink/55 max-sm:hidden">{service.body}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  </div>
);

export default Shop;
