import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATALOG, CATEGORIES, categoryFace, categoryPath, productsIn } from '../lib/catalog';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import { STORE } from '../data/store';
import Showroom from '../components/shop/Showroom';
import Catalogue from '../components/shop/catalogue/Catalogue';
import ProductImage from '../components/product/ProductImage';
import { PhoneIcon, WhatsAppIcon } from '../components/ui/Icons';

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
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {CATEGORIES.map((category, index) => {
          const face = categoryFace(category.slug);
          return (
            <motion.li
              key={category.slug}
              custom={index}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={inViewOnce}
            >
              <Link
                to={categoryPath(category.slug)}
                className="group block overflow-hidden rounded-[22px] bg-white ring-1 ring-ink/[0.06] transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(12,12,13,0.32)]"
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
      </ul>
    </section>

    {/* Catalogue */}
    <section id="catalogo" aria-labelledby="catalogo-titulo" className="container-site mt-20 scroll-mt-24 lg:mt-28">
      <div className="mb-8 lg:mb-10">
        <p className="eyebrow text-ink/45">Catálogo</p>
        <h2 id="catalogo-titulo" className="type-title mt-3">
          Todos os produtos
        </h2>
        <p className="type-lead mt-3 max-w-xl text-ink/60">
          Originais, com garantia e entrega em todo o país. Filtre por marca, preço ou disponibilidade.
        </p>
      </div>
      <Catalogue products={CATALOG} />
    </section>

    {/* Services */}
    <section aria-label="Porquê comprar na Rhulany Tech" className="container-site mt-24 lg:mt-32">
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {SERVICES.map((service, index) => (
          <motion.li
            key={service.title}
            custom={index}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            className="rounded-[22px] bg-white p-6 ring-1 ring-ink/[0.06] lg:p-7"
          >
            <h3 className="font-medium">{service.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{service.body}</p>
          </motion.li>
        ))}
      </ul>
    </section>

    {/* Help */}
    <section aria-labelledby="ajuda-compra" className="container-site mt-6">
      <div className="flex flex-col gap-8 rounded-[26px] bg-ink px-6 py-10 text-paper sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12">
        <div className="max-w-xl">
          <h2 id="ajuda-compra" className="type-title text-paper">
            Não sabe qual escolher?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-paper/60">
            Diga-nos para que precisa e quanto quer gastar. Respondemos com duas ou três opções que fazem sentido para si.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={STORE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-paper px-6 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Falar no WhatsApp
          </a>
          <a
            href={STORE.phoneHref}
            className="inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-sm font-medium text-paper ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/10"
          >
            <PhoneIcon className="h-[18px] w-[18px]" />
            {STORE.phone}
          </a>
        </div>
      </div>
    </section>
  </div>
);

export default Shop;
