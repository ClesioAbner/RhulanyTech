import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, categoryPath, productsIn, resolveImage } from '../../lib/catalog';
import { easeOutExpo, inViewOnce, riseIn3d, stagger } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';

interface Piece {
  src: string;
  /** Box in % of the tile: left, top, width. */
  left: number;
  top: number;
  width: number;
  rotate: number;
  /** How far it moves out when the tile is pointed at. */
  spread: number;
}

interface TileArt {
  span: string;
  shape: string;
  /** Light tint of the tile's studio background. */
  tint: string;
  pieces: Piece[];
}

const P = '/images/produtos/';

// Each category as a small still life of products we sell, shot on a clean background.
// Two wide tiles open the grid, then four portrait tiles.
const ART: Record<string, TileArt> = {
  celulares: {
    span: 'lg:col-span-5',
    shape: 'lg:aspect-auto lg:h-[600px]',
    tint: '#e6ecf7',
    pieces: [
      { src: `${P}galaxy-s25-ultra-silverblue`, left: 15, top: 30, width: 25, rotate: -10, spread: -14 },
      { src: `${P}pixel-9-pro-porcelain`, left: 60, top: 30, width: 24, rotate: 10, spread: 14 },
      { src: `${P}iphone-17-pro-laranja`, left: 35.5, top: 21, width: 29, rotate: 0, spread: 0 },
    ],
  },
  computadores: {
    span: 'lg:col-span-7',
    shape: 'lg:aspect-auto lg:h-[600px]',
    tint: '#f2eee5',
    pieces: [
      { src: `${P}imac-24-m4-amarelo`, left: 26, top: 19, width: 50, rotate: 0, spread: 0 },
      { src: `${P}macbook-air-13-m4-azul-ceu`, left: 5, top: 53, width: 46, rotate: -4, spread: -14 },
      { src: `${P}mac-mini-m4`, left: 70, top: 61, width: 20, rotate: 3, spread: 12 },
    ],
  },
  gaming: {
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
    tint: '#ebe8f4',
    pieces: [
      { src: `${P}nintendo-switch-2`, left: 8, top: 33, width: 82, rotate: -6, spread: -8 },
      { src: `${P}comando-sem-fios-dualsense-branco`, left: 32, top: 55, width: 56, rotate: 10, spread: 10 },
    ],
  },
  cameras: {
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
    tint: '#f0eee9',
    pieces: [
      { src: `${P}sony-alpha-6700`, left: 44, top: 28, width: 48, rotate: 8, spread: 10 },
      { src: `${P}fujifilm-x100vi-prateado`, left: 7, top: 50, width: 66, rotate: -6, spread: -8 },
    ],
  },
  'casa-inteligente': {
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
    tint: '#ebf0ec',
    pieces: [
      { src: `${P}apple-homepod-branco`, left: 12, top: 28, width: 52, rotate: -3, spread: -8 },
      { src: `${P}amazon-echo-dot`, left: 56, top: 58, width: 36, rotate: 4, spread: 10 },
    ],
  },
  acessorios: {
    span: 'lg:col-span-3',
    shape: 'lg:aspect-[3/4]',
    tint: '#eceef3',
    pieces: [
      { src: `${P}airpods-max-azul`, left: 10, top: 27, width: 70, rotate: -5, spread: -8 },
      { src: `${P}airpods-pro-2-geracao`, left: 56, top: 60, width: 36, rotate: 6, spread: 10 },
    ],
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
        const wide = art.span !== 'lg:col-span-3';
        return (
          <motion.li key={category.slug} variants={riseIn3d} className={`${art.span} [transform-origin:50%_100%]`}>
            <motion.div initial="rest" animate="rest" whileHover="hover" className="h-full">
              <Link
                to={categoryPath(category.slug)}
                className={`group relative block aspect-[4/5] overflow-hidden rounded-[28px] ring-1 ring-ink/[0.05] sm:aspect-[4/3] ${art.shape}`}
                style={{ background: `radial-gradient(120% 80% at 50% 0%, #ffffff 0%, ${art.tint} 72%)` }}
              >
                {/* Still life */}
                {art.pieces.map((piece, index) => (
                  <motion.img
                    key={piece.src}
                    src={resolveImage(piece.src, wide ? 1200 : 600)}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="stage-shadow absolute select-none"
                    style={{ left: `${piece.left}%`, top: `${piece.top}%`, width: `${piece.width}%`, zIndex: index }}
                    variants={{
                      rest: { x: 0, y: 0, rotate: piece.rotate, scale: 1 },
                      hover: { x: piece.spread, y: -10 - index * 3, rotate: piece.rotate * 1.35, scale: 1.03 },
                    }}
                    transition={{ duration: 0.8, ease: easeOutExpo }}
                  />
                ))}

                {/* Name, count and the way in */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6 lg:p-8">
                  <div>
                    <h3
                      className={`font-display font-medium tracking-tight ${wide ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}`}
                    >
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm tabular-nums text-ink/50">{productsIn(category.slug).length} produtos</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-ink/[0.06] backdrop-blur transition-[background-color,color,transform] duration-500 ease-out-expo group-hover:-rotate-45 group-hover:bg-ink group-hover:text-paper"
                  >
                    <span className="relative block h-[1.5px] w-3.5 bg-current after:absolute after:-right-px after:-top-[3px] after:h-2 after:w-2 after:rotate-45 after:border-r-[1.5px] after:border-t-[1.5px] after:border-current after:content-['']" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </motion.li>
        );
      })}
    </motion.ul>
  </section>
);

export default CategoryGrid;
