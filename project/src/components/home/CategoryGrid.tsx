import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, categoryPath, productsIn } from '../../lib/catalog';
import { unsplash, unsplashSrcSet } from '../../lib/images';
import { inViewOnce, riseIn3d, stagger } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';

interface TileArt {
  image: string;
  alt: string;
  span: string;
  shape: string;
}

// One photo per shop category, each of a product we sell, none repeated elsewhere on the homepage.
// Two tall tiles open the grid, then four portrait tiles.
const ART: Record<string, TileArt> = {
  celulares: {
    image: '1759203302534-c6e71c93e886',
    alt: 'iPhone 17 Pro Max laranja-cósmico na mão',
    span: 'lg:col-span-5',
    shape: 'lg:aspect-auto lg:h-[620px]',
  },
  computadores: {
    image: '1622774161048-863b17ed0d8e',
    alt: 'iMac amarelo numa secretária com teclado e planta',
    span: 'lg:col-span-7',
    shape: 'lg:aspect-auto lg:h-[620px]',
  },
  gaming: {
    image: '1607853202273-797f1c22a38e',
    alt: 'PlayStation 5 Slim com comando DualSense sobre fundo roxo',
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
  },
  cameras: {
    image: '1756334324139-b1e23f33cc03',
    alt: 'Fujifilm X100VI em pormenor',
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
  },
  'casa-inteligente': {
    image: '1586078875290-c22eb791ad5d',
    alt: 'HomePod branco sobre fundo claro',
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
  },
  acessorios: {
    image: '1612116454817-2b0841e30eaf',
    alt: 'AirPods Max prateados sobre fundo claro',
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
  },
};

const CategoryGrid = () => (
  <section id="categorias" className="container-site scroll-mt-24 py-28 lg:py-40" aria-labelledby="categorias-titulo">
    <SectionHeading
      id="categorias-titulo"
      index="01"
      eyebrow="Categorias"
      title="Encontre o que procura"
      action={
        <Link to="/loja" className="link-underline text-sm">
          Ver todos os produtos
        </Link>
      }
    />

    <motion.ul
      className="mt-12 grid gap-4 [perspective:1600px] sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-5"
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      {CATEGORIES.map((category) => {
        const art = ART[category.slug];
        if (!art) return null;
        return (
          <motion.li key={category.slug} variants={riseIn3d} className={`${art.span} [transform-origin:50%_100%]`}>
            <Link
              to={categoryPath(category.slug)}
              className={`group relative block aspect-[4/5] overflow-hidden rounded-sm bg-ink sm:aspect-[4/3] ${art.shape}`}
            >
              <img
                src={unsplash(art.image, 1200)}
                srcSet={unsplashSrcSet(art.image)}
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                alt={art.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-paper lg:p-8">
                <h3 className={`font-display text-2xl font-medium tracking-tight ${art.span === 'lg:col-span-3' ? '' : 'lg:text-3xl'}`}>
                  {category.name}
                </h3>
                <span className="shrink-0 text-sm tabular-nums text-paper/70">{productsIn(category.slug).length} produtos</span>
              </div>
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  </section>
);

export default CategoryGrid;
