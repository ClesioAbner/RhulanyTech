import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { categoryPath, type Category, type Subcategory } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';

interface CategoryHeroProps {
  category: Category;
  subcategory?: Subcategory;
  image?: string;
  /** Anchor of the product lineup, for the "explore" link. */
  lineupId: string;
}

const CategoryHero = ({ category, subcategory, image, lineupId }: CategoryHeroProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const title = subcategory?.name ?? category.name;
  const tagline = subcategory?.tagline ?? category.tagline;

  return (
    <header className="container-site pt-10 lg:pt-14">
      <nav aria-label="Caminho" className="text-xs text-ink/45">
        <Link to="/loja" className="link-underline">
          Loja
        </Link>
        <span className="mx-2">/</span>
        {subcategory ? (
          <>
            <Link to={categoryPath(category.slug)} className="link-underline">
              {category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink/70">{subcategory.name}</span>
          </>
        ) : (
          <span className="text-ink/70">{category.name}</span>
        )}
      </nav>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="overflow-hidden pb-[0.08em] font-display text-[3.25rem] font-medium leading-[0.98] tracking-tightest sm:text-7xl lg:text-[6.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={title}
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%', transition: { duration: 0.25 } }}
                transition={{ duration: 0.8, ease: easeOutExpo }}
              >
                {title}
              </motion.span>
            </AnimatePresence>
          </h1>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={tagline}
              className="mt-4 max-w-lg text-lg text-ink/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
            >
              {tagline}
            </motion.p>
          </AnimatePresence>
        </div>
        <a
          href={`#${lineupId}`}
          className="inline-flex h-12 shrink-0 items-center self-start rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-ink-soft lg:self-auto"
        >
          Explorar {title}
        </a>
      </div>

      <div
        ref={frameRef}
        className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[24px] bg-ink sm:aspect-[16/9] lg:mt-14 lg:aspect-[21/9]"
      >
        <AnimatePresence initial={false}>
          {image && (
            <motion.img
              key={image}
              src={image}
              alt=""
              className="absolute inset-0 h-[112%] w-full object-cover"
              style={{ y: imageY }}
              initial={{ opacity: 0, scale: 1.06, clipPath: 'inset(8% 6% 8% 6% round 24px)' }}
              animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{ duration: 1.1, ease: easeOutExpo }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
      </div>
    </header>
  );
};

export default CategoryHero;
