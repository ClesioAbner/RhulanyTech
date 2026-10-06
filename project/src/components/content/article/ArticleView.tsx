import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ARTICLES_BY_DATE, formatArticleDate, readingMinutes, topicLabel, type Article } from '../../../data/blog';
import { getProductById, type CatalogProduct } from '../../../lib/catalog';
import { unsplash, unsplashSrcSet } from '../../../lib/images';
import { easeOutExpo, inViewOnce } from '../../../lib/motion';
import ArticleCard from '../ArticleCard';
import ProductCard from '../../product/ProductCard';
import Shelf from '../../shop/Shelf';
import Block from './Block';
import NextGuide from './NextGuide';
import ShareLinks from './ShareLinks';
import TableOfContents from './TableOfContents';
import { sectionNumber, type Heading } from './sections';

/** A whole guide: cover, summary, contents, sections, products and what to read next. */

const ArticleView = ({ article }: { article: Article }) => {
  const articleRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ['start 30%', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const { scrollYProgress: coverProgress } = useScroll({ target: coverRef, offset: ['start end', 'end start'] });
  const coverScale = useTransform(coverProgress, [0, 1], [1.1, 1]);

  const headings = useMemo(() => article.body.filter((block): block is Heading => block.type === 'h2'), [article]);
  const numbers = new Map(headings.map((heading, index) => [heading.id, sectionNumber(index)]));
  const products = (article.products ?? [])
    .map((id) => getProductById(id))
    .filter((product): product is CatalogProduct => Boolean(product));
  const position = ARTICLES_BY_DATE.indexOf(article);
  const next = ARTICLES_BY_DATE[(position + 1) % ARTICLES_BY_DATE.length];
  const more = ARTICLES_BY_DATE.filter((item) => item !== article && item !== next)
    .sort((a, b) => Number(b.topic === article.topic) - Number(a.topic === article.topic))
    .slice(0, 3);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink"
        style={{ scaleX: progress }}
      />

      <header className="container-site pt-10 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <nav aria-label="Caminho" className="text-xs text-ink/45">
            <Link to="/blog" className="link-underline">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span>{topicLabel(article.topic)}</span>
          </nav>
          <motion.h1
            className="type-display mt-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo }}
          >
            {article.title}
          </motion.h1>
          <motion.p
            className="type-lead mx-auto mt-5 max-w-xl text-ink/60"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
          >
            {article.excerpt}
          </motion.p>
          <motion.p
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <span className="text-ink">Equipa Rhulany Tech</span>
            <span>{formatArticleDate(article.date)}</span>
            <span>{readingMinutes(article)} min de leitura</span>
          </motion.p>
        </div>
      </header>

      <div ref={coverRef} className="container-site mt-10 lg:mt-14">
        <div className="aspect-[4/3] overflow-hidden rounded-[28px] bg-mist sm:aspect-[21/9]">
          <motion.img
            src={unsplash(article.cover.src, 2000)}
            srcSet={unsplashSrcSet(article.cover.src)}
            sizes="(min-width: 1360px) 1264px, 100vw"
            alt={article.cover.alt}
            className="h-full w-full object-cover"
            style={{ scale: coverScale, objectPosition: article.cover.position }}
          />
        </div>
      </div>

      <div ref={articleRef} className="container-site mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-32">
            <TableOfContents headings={headings} />
          </div>
        </aside>

        <article className="mx-auto w-full max-w-[680px] lg:col-span-7 lg:col-start-5 lg:mx-0">
          <motion.section
            className="rounded-[24px] bg-white p-6 sm:p-8"
            aria-labelledby="resumo"
            {...{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: inViewOnce }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            <h2 id="resumo" className="eyebrow text-ink/45">
              Em resumo
            </h2>
            <ul className="mt-5 space-y-3">
              {article.summary.map((point) => (
                <li key={point} className="flex gap-4 text-[15px] leading-relaxed text-ink/75">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.section>

          <div className="mt-14">
            {article.body.map((block, index) => (
              <Block key={index} block={block} number={block.type === 'h2' ? numbers.get(block.id) : undefined} />
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-5 rounded-[24px] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <p className="text-[15px] text-ink/70">
              Tem uma dúvida sobre o seu equipamento?{' '}
              <Link to="/contacto" className="link-underline font-medium text-ink">
                Fale connosco
              </Link>
            </p>
            <ShareLinks article={article} />
          </div>
        </article>
      </div>

      {products.length > 0 && (
        <Shelf
          id="produtos-guia"
          title="Produtos neste guia"
          lead="Equipamentos e acessórios de que falámos"
          className="mt-24 lg:mt-32"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Shelf>
      )}

      <section className="container-site mt-20 lg:mt-24" aria-label="Próximo guia">
        <NextGuide article={next} />
      </section>

      {more.length > 0 && (
        <section className="container-site mt-20 pb-28 lg:mt-24 lg:pb-36" aria-labelledby="continue">
          <div className="flex items-end justify-between gap-6">
            <h2 id="continue" className="type-title">
              Mais guias
            </h2>
            <Link to="/blog" className="link-underline shrink-0 text-sm text-ink/70 hover:text-ink">
              Ver todos
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {more.map((item) => (
              <li key={item.slug}>
                <ArticleCard article={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default ArticleView;
