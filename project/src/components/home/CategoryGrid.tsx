import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, type Product } from '../../data/products';
import { unsplash, unsplashSrcSet } from '../../lib/images';
import { inViewOnce, riseIn3d, stagger } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';

interface CategoryTile {
  id: Product['category'];
  label: string;
  image: string;
  alt: string;
  span: string;
  shape: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    id: 'celulares',
    label: 'Celulares',
    image: '1695048133142-1a20484d2569',
    alt: 'iPhone 15 Pro pousado sobre superfície escura',
    span: 'sm:col-span-2 lg:col-span-7',
    shape: 'lg:aspect-auto lg:h-[620px]',
  },
  {
    id: 'consoles',
    label: 'Consoles',
    image: '1606144042614-b2417e99c4e3',
    alt: 'Consola PlayStation 5 com comando DualSense',
    span: 'lg:col-span-5',
    shape: 'lg:aspect-auto lg:h-[620px]',
  },
  {
    id: 'computadores',
    label: 'Computadores',
    image: '1603302576837-37561b2e2302',
    alt: 'Portátil entreaberto a emitir luz colorida no escuro',
    span: 'lg:col-span-4',
    shape: 'lg:aspect-[4/5]',
  },
  {
    id: 'perifericos',
    label: 'Periféricos',
    image: '1563297007-0686b7003af7',
    alt: 'Rato gaming Logitech sobre fundo escuro',
    span: 'lg:col-span-4',
    shape: 'lg:aspect-[4/5]',
  },
  {
    id: 'componentes',
    label: 'Componentes',
    image: '1591488320449-011701bb6704',
    alt: 'Duas placas gráficas sobre fundo escuro',
    span: 'lg:col-span-4',
    shape: 'lg:aspect-[4/5]',
  },
];

const countByCategory = products.reduce<Record<string, number>>((acc, product) => {
  acc[product.category] = (acc[product.category] ?? 0) + 1;
  return acc;
}, {});

const CategoryGrid = () => (
  <section id="categorias" className="container-site scroll-mt-24 py-28 lg:py-40" aria-labelledby="categorias-titulo">
    <SectionHeading
      id="categorias-titulo"
      index="01"
      eyebrow="Categorias"
      title="Encontre o que procura"
      action={
        <Link to="/products" className="link-underline text-sm">
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
      {CATEGORIES.map((category) => (
        <motion.li
          key={category.id}
          variants={riseIn3d}
          className={`${category.span} [transform-origin:50%_100%]`}
        >
          <Link
            to={`/products?category=${category.id}`}
            className={`group relative block aspect-[4/5] overflow-hidden rounded-sm bg-ink sm:aspect-[4/3] ${category.shape}`}
          >
            <img
              src={unsplash(category.image, 1200)}
              srcSet={unsplashSrcSet(category.image)}
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
              alt={category.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-paper lg:p-8">
              <h3 className="font-display text-2xl font-medium tracking-tight lg:text-3xl">{category.label}</h3>
              <span className="text-sm tabular-nums text-paper/70">
                {countByCategory[category.id] ?? 0} produtos
              </span>
            </div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  </section>
);

export default CategoryGrid;
