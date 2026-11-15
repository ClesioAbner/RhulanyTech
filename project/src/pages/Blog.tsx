import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ARTICLES_BY_DATE, BLOG_PICKS, BLOG_TOPICS, FAQ, topicLabel, type BlogTopic } from '../data/blog';
import { STORE } from '../data/store';
import { unsplash } from '../lib/images';
import { easeOutExpo, inViewOnce, riseOnView } from '../lib/motion';
import { useMediaQuery } from '../lib/useMediaQuery';
import ArticleCard from '../components/content/ArticleCard';
import FaqList from '../components/content/FaqList';
import Picks from '../components/content/BlogPicks';
import BlogSearchHero from '../components/content/BlogSearchHero';
import FaqPhone from '../components/content/chat/FaqPhone';
import HelpPhone from '../components/content/chat/HelpPhone';
import ArrowChip from '../components/ui/ArrowChip';
import PhoneCopy from '../components/ui/PhoneCopy';
import Rail from '../components/ui/Rail';

// Topic tiles use the newest guide's photo of that topic.
const TOPICS = BLOG_TOPICS.map((topic) => {
  const guides = ARTICLES_BY_DATE.filter((article) => article.topic === topic.id);
  return { ...topic, count: guides.length, cover: guides[0]?.cover };
}).filter((topic) => topic.count > 0);

const PHONE_LIST = 5;

const normalise = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** /blog: care guides and frequent questions. */
const Blog = () => {
  const [topic, setTopic] = useState<BlogTopic | 'todos'>('todos');
  const [query, setQuery] = useState('');
  // The library opens as a photo grid where there is room, as a reading list on phones; the
  // visitor can switch.
  const isWide = useMediaQuery('(min-width: 640px)');
  const [picked, setPicked] = useState<'lista' | 'grelha' | null>(null);
  const view = picked ?? (isWide ? 'grelha' : 'lista');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'Blog | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, []);

  const search = normalise(query.trim());
  // Unfiltered, the library goes on from the essential guides above instead of repeating them; a
  // topic or a search shows every guide that fits.
  const browsing = topic === 'todos' && !search;
  const articles = useMemo(
    () =>
      ARTICLES_BY_DATE.filter((article) => topic === 'todos' || article.topic === topic)
        .filter(
          (article) => !search || normalise(`${article.title} ${article.excerpt} ${topicLabel(article.topic)}`).includes(search),
        )
        .filter((article) => !browsing || !BLOG_PICKS.includes(article)),
    [topic, search, browsing],
  );
  const faqs = useMemo(() => FAQ.filter((item) => !search || normalise(`${item.q} ${item.a}`).includes(search)), [search]);
  // Every guide that matches the search, whatever topic is selected below.
  const searchResults = useMemo(
    () =>
      search
        ? ARTICLES_BY_DATE.filter((article) =>
            normalise(`${article.title} ${article.excerpt} ${topicLabel(article.topic)}`).includes(search),
          )
        : [],
    [search],
  );
  const phoneFaq = faqs[openFaq ?? 0] ?? FAQ[0];
  // Phones list the newest guides first and fold the rest behind a button; a topic or a search shows all.
  const [showAll, setShowAll] = useState(false);
  const folded = !showAll && topic === 'todos' && !search && articles.length > PHONE_LIST + 1;

  const showAllResults = () => {
    setTopic('todos');
    window.setTimeout(
      () => document.getElementById('todos-os-guias')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      50,
    );
  };

  const chooseTopic = (next: BlogTopic | 'todos') => {
    setTopic(next);
    document.getElementById('todos-os-guias')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pb-28 lg:pb-36">
      <BlogSearchHero query={query} onQueryChange={setQuery} results={searchResults} onShowAll={showAllResults} />

      <Picks />

      <section className="container-site pt-20 sm:pt-24 lg:pt-32" aria-labelledby="temas">
        <motion.div {...riseOnView} transition={{ duration: 0.8, ease: easeOutExpo }}>
          <p className="eyebrow text-ink/45">Temas</p>
          <h2 id="temas" className="type-title mt-3">
            Explore por equipamento
          </h2>
        </motion.div>
        {/* Phones and tablets: a row to swipe; desktop: all seven side by side */}
        <Rail
          label="Temas"
          className="mt-8 lg:mt-12"
          gridClassName="lg:grid lg:grid-cols-7 lg:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {TOPICS.map((item) => (
            <motion.li
              key={item.id}
              className="w-[42%] shrink-0 snap-start sm:w-[26%] lg:w-auto"
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
                    style={{ objectPosition: item.cover.position }}
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
        </Rail>
      </section>

      <section id="todos-os-guias" className="container-site scroll-mt-20 pt-20 sm:pt-24 lg:pt-32" aria-labelledby="guias">
        {/* One search for the whole page, at the top; here the library says what it is showing */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-ink/45">Biblioteca</p>
            <h2 id="guias" className="type-title mt-3">
              {browsing ? 'Mais guias' : 'Todos os guias'}
            </h2>
          </div>
          <p className="shrink-0 pb-1 text-sm tabular-nums text-ink/45" aria-live="polite">
            {search
              ? `${articles.length} para “${query.trim()}”`
              : `${articles.length} ${articles.length === 1 ? 'guia' : 'guias'}`}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filtrar por tema"
            className="-mx-5 flex min-w-0 gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
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
                onClick={() => setPicked(item)}
                className={`relative isolate h-8 rounded-full px-4 text-sm capitalize transition-colors duration-300 ${view === item ? 'text-paper' : 'text-ink/55 hover:text-ink'}`}
              >
                {view === item && (
                  <motion.span
                    layoutId="blog-view"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                  />
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
                    className={folded && index >= PHONE_LIST ? 'max-sm:hidden' : undefined}
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
              {folded && (
                <li className="pt-4 sm:hidden">
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="h-12 w-full rounded-full border border-ink/15 text-sm font-medium transition-colors active:bg-ink active:text-paper"
                  >
                    Ver mais {articles.length - PHONE_LIST} guias
                  </button>
                </li>
              )}
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
              <Link
                to="/contacto"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper"
              >
                Fazer uma pergunta
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="duvidas" className="container-site scroll-mt-20 pt-20 sm:pt-24 lg:pt-32" aria-labelledby="duvidas-titulo">
        {/* The heading spans the section; below it the photo and the questions start on the same line */}
        <motion.div
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          {...riseOnView}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          <div>
            <p className="eyebrow text-ink/45">Dúvidas frequentes</p>
            <h2 id="duvidas-titulo" className="type-title mt-3">
              As perguntas que mais recebemos
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
              Sobre produtos, entregas, pagamentos e cuidados com os equipamentos
            </p>
          </div>
          <Link to="/contacto" className="link-underline inline-block shrink-0 self-start text-sm font-medium lg:self-end">
            Fazer outra pergunta
          </Link>
        </motion.div>
        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-start">
          {/* Desktop: the photo stays beside the questions while the list scrolls */}
          <div className="hidden lg:sticky lg:top-28 lg:col-span-5 lg:block">
            <FaqPhone question={phoneFaq.q} answer={phoneFaq.a} />
          </div>
          <div className="lg:col-span-7">
            {faqs.length > 0 ? (
              <FaqList key={search} items={faqs} open={openFaq} onOpenChange={setOpenFaq} />
            ) : (
              <p className="rounded-[22px] bg-white px-6 py-10 text-sm text-ink/60">Nenhuma dúvida corresponde à pesquisa</p>
            )}
          </div>
        </div>
      </section>

      <section className="container-site pt-20 sm:pt-24 lg:pt-32" aria-labelledby="ajuda-blog">
        <motion.div
          className="relative overflow-hidden rounded-[32px] bg-white"
          {...riseOnView}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          {/* Desktop: the hand and phone fill the right of the card; the copy sits on the empty left */}
          <div className="hidden lg:block">
            <HelpPhone variant="wide" />
          </div>
          <div className="p-8 sm:p-12 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[48%] lg:flex-col lg:justify-center lg:p-16">
            <p className="eyebrow text-ink/45">Ajuda</p>
            <h2 id="ajuda-blog" className="type-title mt-3">
              Precisa de ajuda com um equipamento
            </h2>
            <p className="type-lead mt-4 max-w-md text-ink/60">
              <PhoneCopy phone="Diga-nos o modelo e respondemos pelo WhatsApp">
                Diga-nos o modelo e o que está a acontecer. Respondemos pelo WhatsApp e indicamos o que fazer
              </PhoneCopy>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={STORE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-7 pr-3 text-sm font-medium text-paper shadow-[0_18px_40px_-18px_rgba(12,12,13,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Falar no WhatsApp
                <ArrowChip />
              </a>
              <Link
                to="/contacto"
                className="inline-flex h-14 items-center rounded-full bg-white px-7 text-sm font-medium ring-1 ring-ink/10 transition-colors duration-300 hover:bg-mist"
              >
                Outros contactos
              </Link>
            </div>
          </div>
          <div className="lg:hidden">
            <HelpPhone variant="compact" />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Blog;
