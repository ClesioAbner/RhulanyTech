import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ARTICLES,
  formatArticleDate,
  getArticle,
  readingMinutes,
  topicLabel,
  type Article,
  type ArticleBlock,
} from '../data/blog';
import { getProductById, type CatalogProduct } from '../lib/catalog';
import { unsplash, unsplashSrcSet } from '../lib/images';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import ArticleCard from '../components/content/ArticleCard';
import ProductCard from '../components/product/ProductCard';
import Shelf from '../components/shop/Shelf';

type Heading = Extract<ArticleBlock, { type: 'h2' }>;

const BY_DATE = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
const sectionNumber = (index: number) => String(index + 1).padStart(2, '0');

const Block = ({ block, number }: { block: ArticleBlock; number?: string }) => {
  switch (block.type) {
    case 'h2':
      return (
        <motion.h2
          id={block.id}
          className="mt-16 scroll-mt-32 first:mt-0"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <span className="block font-display text-sm tabular-nums text-ink/35">{number}</span>
          <span className="type-heading mt-2 block">{block.text}</span>
        </motion.h2>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className="mt-6 space-y-3">
          {block.items.map((item, index) => (
            <li key={item} className="flex gap-4 text-[17px] leading-[1.7] text-ink/75">
              {block.ordered ? (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-medium tabular-nums text-ink/70">
                  {index + 1}
                </span>
              ) : (
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/35" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </Tag>
      );
    }
    case 'tip':
      return (
        <aside className="mt-10 rounded-[22px] bg-white p-6 sm:p-7">
          <p className="text-sm font-medium text-[#b34700]">{block.title}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{block.text}</p>
        </aside>
      );
    case 'image':
      return (
        <figure className="mt-12">
          <img src={unsplash(block.src, 1400)} alt={block.alt} loading="lazy" className="aspect-[3/2] w-full rounded-[22px] object-cover" />
          {block.caption && <figcaption className="mt-3 text-sm text-ink/50">{block.caption}</figcaption>}
        </figure>
      );
    default:
      return <p className="mt-6 text-[17px] leading-[1.75] text-ink/75">{block.text}</p>;
  }
};

/** "Neste guia": numbered section links; the one being read is marked. */
const TableOfContents = ({ headings }: { headings: Heading[] }) => {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );
    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="Neste guia">
      <p className="eyebrow text-ink/45">Neste guia</p>
      <ol className="mt-5 space-y-1">
        {headings.map((heading, index) => {
          const isActive = heading.id === active;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`relative flex gap-3 rounded-xl px-3 py-2 text-sm leading-snug transition-colors duration-300 ${
                  isActive ? 'text-ink' : 'text-ink/50 hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="toc-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-white"
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                  />
                )}
                <span className="tabular-nums text-ink/35">{sectionNumber(index)}</span>
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const ShareLinks = ({ article }: { article: Article }) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copiado');
    } catch {
      toast('Não foi possível copiar o link');
    }
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <button type="button" onClick={copy} className="h-9 rounded-full bg-white px-4 text-ink/70 transition-colors hover:text-ink">
        Copiar link
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${window.location.href}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center rounded-full bg-white px-4 text-ink/70 transition-colors hover:text-ink"
      >
        Partilhar no WhatsApp
      </a>
    </div>
  );
};

/** Large card for the guide that follows, so reading carries on naturally. */
const NextGuide = ({ article }: { article: Article }) => (
  <Link to={`/blog/${article.slug}`} className="group relative block h-[420px] overflow-hidden rounded-[32px] bg-ink text-paper">
    <img
      src={unsplash(article.cover.src, 1800)}
      alt={article.cover.alt}
      loading="lazy"
      style={{ objectPosition: article.cover.position }}
      className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
      <p className="eyebrow text-paper/60">Próximo guia</p>
      <h2 className="type-title mt-3 max-w-2xl">{article.title}</h2>
      <p className="type-lead mt-3 max-w-xl text-paper/70">{article.excerpt}</p>
      <span className="mt-7 inline-flex h-12 items-center rounded-full bg-paper px-6 text-sm font-medium text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
        Continuar a ler
      </span>
    </div>
  </Link>
);

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
  const position = BY_DATE.indexOf(article);
  const next = BY_DATE[(position + 1) % BY_DATE.length];
  const more = BY_DATE.filter((item) => item !== article && item !== next)
    .sort((a, b) => Number(b.topic === article.topic) - Number(a.topic === article.topic))
    .slice(0, 3);

  return (
    <>
      <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink" style={{ scaleX: progress }} />

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
        <Shelf id="produtos-guia" title="Produtos neste guia" lead="Equipamentos e acessórios de que falámos" className="mt-24 lg:mt-32">
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

/** /blog/:slug */
const BlogPost = () => {
  const { slug } = useParams();
  const article = getArticle(slug);

  useEffect(() => {
    if (article) document.title = `${article.title} | Rhulany Tech`;
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, [article]);

  if (!article) {
    return (
      <div className="container-site py-32 text-center">
        <p className="eyebrow text-ink/45">Blog</p>
        <h1 className="type-display mt-4">Não encontrámos este guia</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">Pode ter mudado de endereço. Veja todos os guias no blog</p>
        <Link to="/blog" className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
          Ir para o blog
        </Link>
      </div>
    );
  }

  return <ArticleView key={article.slug} article={article} />;
};

export default BlogPost;
