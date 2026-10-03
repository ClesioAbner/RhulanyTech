import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ARTICLES, BLOG_TOPICS, FAQ, readingMinutes, topicLabel, type BlogTopic } from '../data/blog';
import { STORE } from '../data/store';
import { unsplash } from '../lib/images';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import ArticleCard from '../components/content/ArticleCard';
import FaqList from '../components/content/FaqList';
import PageHero from '../components/content/PageHero';
import { SearchIcon } from '../components/ui/Icons';

const BY_DATE = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
const FEATURED = BY_DATE[0];
const PICKS = BY_DATE.slice(1, 4);

// Topic tiles use the newest guide's photo of that topic.
const TOPICS = BLOG_TOPICS.map((topic) => {
  const guides = BY_DATE.filter((article) => article.topic === topic.id);
  return { ...topic, count: guides.length, cover: guides[0]?.cover };
}).filter((topic) => topic.count > 0);

const normalise = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: inViewOnce,
};

/** The featured guide as a frosted card over the banner. */
const FeaturedCard = () => (
  <Link
    to={`/blog/${FEATURED.slug}`}
    className="group flex items-center gap-4 rounded-[24px] border border-paper/15 bg-paper/10 p-3 pr-5 backdrop-blur-xl transition-colors duration-500 hover:bg-paper/15"
  >
    <span className="h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-ink">
      <img
        src={unsplash(FEATURED.cover.src, 300)}
        alt=""
        className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
      />
    </span>
    <span className="min-w-0">
      <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-paper/55">Em destaque</span>
      <span className="mt-1.5 block font-display text-lg font-medium leading-snug tracking-tight">{FEATURED.title}</span>
      <span className="mt-1 block text-sm text-paper/60">
        <span className="link-underline">Ler o guia</span>
      </span>
    </span>
  </Link>
);

/** Editorial opening: one large story and two smaller ones beside it. */
const Picks = () => {
  const [lead, ...rest] = PICKS;
  return (
    <section className="container-site pt-20 lg:pt-28" aria-labelledby="para-comecar">
      <motion.div {...reveal} transition={{ duration: 0.8, ease: easeOutExpo }}>
        <p className="eyebrow text-ink/45">Para começar</p>
        <h2 id="para-comecar" className="type-title mt-3">
          Guias essenciais
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
        <motion.div className="lg:col-span-7" {...reveal} transition={{ duration: 0.9, ease: easeOutExpo }}>
          <Link to={`/blog/${lead.slug}`} className="group block">
            <div className="aspect-[16/10] overflow-hidden rounded-[28px] bg-mist">
              <img
                src={unsplash(lead.cover.src, 1400)}
                alt={lead.cover.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-6 flex items-center gap-4 text-xs">
              <span className="font-medium uppercase tracking-[0.14em] text-ink/50">{topicLabel(lead.topic)}</span>
              <span className="tabular-nums text-ink/40">{readingMinutes(lead)} min de leitura</span>
            </p>
            <h3 className="type-title mt-3">
              <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
                {lead.title}
              </span>
            </h3>
            <p className="type-lead mt-3 max-w-xl text-ink/60">{lead.excerpt}</p>
          </Link>
        </motion.div>

        <ul className="flex flex-col justify-center gap-8 lg:col-span-5 lg:gap-10">
          {rest.map((article, index) => (
            <motion.li key={article.slug} {...reveal} transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 + index * 0.08 }}>
              <ArticleCard article={article} layout="row" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/** /blog: care guides and frequent questions. */
const Blog = () => {
  const [topic, setTopic] = useState<BlogTopic | 'todos'>('todos');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'lista' | 'grelha'>('lista');

  useEffect(() => {
    document.title = 'Blog | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, []);

  const search = normalise(query.trim());
  const articles = useMemo(
    () =>
      BY_DATE.filter((article) => topic === 'todos' || article.topic === topic).filter(
        (article) => !search || normalise(`${article.title} ${article.excerpt} ${topicLabel(article.topic)}`).includes(search),
      ),
    [topic, search],
  );
  const faqs = useMemo(() => FAQ.filter((item) => !search || normalise(`${item.q} ${item.a}`).includes(search)), [search]);

  const chooseTopic = (next: BlogTopic | 'todos') => {
    setTopic(next);
    document.getElementById('todos-os-guias')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pb-28 lg:pb-36">
      <PageHero
        image={FEATURED.cover.src}
        alt={FEATURED.cover.alt}
        eyebrow="Blog"
        title="Cuide da sua tecnologia"
        lead="Guias práticos e respostas às dúvidas que mais recebemos"
        aside={<FeaturedCard />}
        nextId="para-comecar"
      />

      <Picks />

      <section className="container-site pt-24 lg:pt-32" aria-labelledby="temas">
        <motion.div {...reveal} transition={{ duration: 0.8, ease: easeOutExpo }}>
          <p className="eyebrow text-ink/45">Temas</p>
          <h2 id="temas" className="type-title mt-3">
            Explore por equipamento
          </h2>
        </motion.div>
        <motion.ul
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-12 lg:grid-cols-6 lg:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {TOPICS.map((item) => (
            <motion.li
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
              }}
            >
              <button
                type="button"
                onClick={() => chooseTopic(item.id)}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[22px] bg-ink text-left text-paper"
              >
                {item.cover && (
                  <img
                    src={unsplash(item.cover.src, 500)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.07]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                  <span className="block font-display text-lg font-medium tracking-tight">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-paper/65">
                    {item.count} {item.count === 1 ? 'guia' : 'guias'}
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section id="todos-os-guias" className="container-site scroll-mt-20 pt-24 lg:pt-32" aria-labelledby="guias">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-ink/45">Biblioteca</p>
            <h2 id="guias" className="type-title mt-3">
              Todos os guias
            </h2>
          </div>
          <label className="relative block w-full lg:w-80">
            <span className="sr-only">Pesquisar nos guias e nas dúvidas</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar, por exemplo bateria"
              className="h-12 w-full rounded-full bg-white pl-11 pr-5 text-sm outline-none ring-1 ring-ink/[0.08] transition-shadow placeholder:text-ink/40 focus:ring-2 focus:ring-ink"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
        <div role="tablist" aria-label="Filtrar por tema" className="-mx-5 flex min-w-0 gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {[{ id: 'todos' as const, label: 'Todos' }, ...TOPICS].map((item) => {
            const isActive = item.id === topic;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTopic(item.id)}
                className={`relative isolate h-10 shrink-0 rounded-full px-4 text-sm transition-colors duration-300 ${
                  isActive ? 'text-paper' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="blog-topic"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={{ duration: 0.45, ease: easeOutExpo }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>
          {/* Reading list or photo grid, like the reading apps */}
          <div role="radiogroup" aria-label="Vista" className="hidden shrink-0 rounded-full bg-white p-1 sm:flex">
            {(['lista', 'grelha'] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={view === item}
                onClick={() => setView(item)}
                className={`relative isolate h-8 rounded-full px-4 text-sm capitalize transition-colors duration-300 ${view === item ? 'text-paper' : 'text-ink/55 hover:text-ink'}`}
              >
                {view === item && (
                  <motion.span layoutId="blog-view" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ duration: 0.4, ease: easeOutExpo }} />
                )}
                {item}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {articles.length > 0 ? (
            <motion.ul
              key={view}
              layout
              className={
                view === 'lista'
                  ? 'mt-8 max-w-5xl space-y-2 lg:mt-10'
                  : 'mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {articles.map((article, index) => (
                  <motion.li
                    key={article.slug}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.7, ease: easeOutExpo, delay: Math.min(index, 6) * 0.05 }}
                  >
                    <ArticleCard article={article} layout={view === 'lista' ? 'list' : 'stack'} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.div
              key="vazio"
              className="mt-10 rounded-[28px] bg-white px-6 py-16 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="type-heading">Ainda não temos um guia sobre isso</p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
                Diga-nos o que procura e respondemos directamente, ou sugira o tema para um próximo guia
              </p>
              <Link to="/contacto" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
                Fazer uma pergunta
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="duvidas" className="container-site scroll-mt-20 pt-24 lg:pt-32" aria-labelledby="duvidas-titulo">
        <div className="grid gap-10 lg:grid-cols-12">
          <motion.div className="lg:col-span-4" {...reveal} transition={{ duration: 0.8, ease: easeOutExpo }}>
            <p className="eyebrow text-ink/45">Dúvidas frequentes</p>
            <h2 id="duvidas-titulo" className="type-title mt-3">
              As perguntas que mais recebemos
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
              Sobre produtos, entregas, pagamentos e cuidados com os equipamentos
            </p>
            <Link to="/contacto" className="link-underline mt-5 inline-block text-sm font-medium">
              Fazer outra pergunta
            </Link>
          </motion.div>
          <div className="lg:col-span-8">
            {faqs.length > 0 ? (
              <FaqList key={search} items={faqs} initiallyOpen={search ? 0 : null} />
            ) : (
              <p className="rounded-[22px] bg-white px-6 py-10 text-sm text-ink/60">Nenhuma dúvida corresponde à pesquisa</p>
            )}
          </div>
        </div>
      </section>

      <section className="container-site pt-24 lg:pt-32" aria-labelledby="ajuda-blog">
        <motion.div
          className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-14 text-paper sm:px-12 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:px-16 lg:py-16"
          {...reveal}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          <div className="max-w-xl">
            <h2 id="ajuda-blog" className="type-title">
              Precisa de ajuda com um equipamento
            </h2>
            <p className="type-lead mt-4 text-paper/65">
              Diga-nos o modelo e o que está a acontecer, e indicamos o que fazer
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <a
              href={STORE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-white"
            >
              Falar no WhatsApp
            </a>
            <Link
              to="/contacto"
              className="inline-flex h-12 items-center rounded-full border border-paper/25 px-6 text-sm font-medium transition-colors hover:border-paper"
            >
              Outros contactos
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Blog;
