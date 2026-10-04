import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { readingMinutes, topicLabel, type Article } from '../../data/blog';
import { unsplash } from '../../lib/images';
import { easeOutExpo } from '../../lib/motion';
import { SearchIcon } from '../ui/Icons';

/*
 * Blog banner: a photo of someone at a desk with a search bar floating over the keyboard.
 * That bar is the blog's real search: the photo is laid out by hand (not object-cover) so the
 * input can sit exactly on the bar at any screen size, with the bar kept in view on phones.
 */

const PHOTO = { width: 7800, height: 5524, sizes: [960, 1600, 2400] };
const ASPECT = PHOTO.width / PHOTO.height;
// The bar in the photo, as fractions of the photo (measured on the 1600px file: 340–805 × 403–469).
const BAR = { x: 340 / 1600, y: 403 / 1133, w: 465 / 1600, h: 66 / 1133 };

const SUGGESTIONS = ['bateria', 'limpar', 'consola', 'portátil'];

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const layout = (cw: number, ch: number) => {
  let width = cw;
  let height = cw / ASPECT;
  if (height < ch) {
    height = ch;
    width = ch * ASPECT;
  }
  // On narrow screens the bar is centred; on wide ones the photo keeps its natural framing.
  const barCentre = BAR.x + BAR.w / 2;
  const targetX = cw < 900 ? cw / 2 : barCentre * width;
  const left = Math.min(0, Math.max(cw - width, targetX - barCentre * width));
  const top = Math.min(0, Math.max(ch - height, ch * 0.5 - 0.42 * height));
  const photo: Box = { left, top, width, height };
  const bar: Box = { left: left + BAR.x * width, top: top + BAR.y * height, width: BAR.w * width, height: BAR.h * height };
  return { photo, bar, cw, ch };
};

interface BlogSearchHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  /** Guides matching the current query. */
  results: Article[];
  /** Show every result in the library below. */
  onShowAll: () => void;
}

const BlogSearchHero = ({ query, onQueryChange, results, onShowAll }: BlogSearchHeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [geometry, setGeometry] = useState(() => layout(typeof window === 'undefined' ? 1440 : window.innerWidth, typeof window === 'undefined' ? 900 : window.innerHeight));
  const [loaded, setLoaded] = useState(false);
  const [focused, setFocused] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const measure = () => setGeometry(layout(section.clientWidth, section.clientHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const { photo, bar, cw } = geometry;
  const fontSize = Math.max(14, Math.min(19, bar.height * 0.33));
  const titleWidth = Math.min(Math.max(bar.width, 320), cw - bar.left - 20);
  const showResults = focused && query.trim().length > 0;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
    onShowAll();
  };

  return (
    <section ref={sectionRef} className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-ink text-paper" aria-labelledby="blog-titulo">
      <img
        src={`/images/blog/pesquisa-${PHOTO.sizes[0]}.jpg`}
        alt=""
        aria-hidden="true"
        className="absolute max-w-none scale-105 blur-xl"
        style={{ left: photo.left, top: photo.top, width: photo.width, height: photo.height }}
      />
      <motion.img
        src={`/images/blog/pesquisa-${PHOTO.sizes[1]}.jpg`}
        srcSet={PHOTO.sizes.map((w) => `/images/blog/pesquisa-${w}.jpg ${w}w`).join(', ')}
        sizes={`${Math.round(photo.width)}px`}
        alt="Pessoa ao computador a pesquisar, com uma barra de pesquisa sobre o teclado"
        onLoad={() => setLoaded(true)}
        className="absolute max-w-none"
        style={{ left: photo.left, top: photo.top, width: photo.width, height: photo.height }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: easeOutExpo }}
      />
      {/* Darken evenly so the title reads, a little more at the edges */}
      <div className="absolute inset-0 bg-ink/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_40%,transparent_30%,rgba(12,12,13,0.55)_100%)]" />

      <motion.div
        className="absolute"
        style={{ left: bar.left, bottom: geometry.ch - bar.top + 28, width: titleWidth }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.2 }}
      >
        <p className="eyebrow text-paper/65">Blog</p>
        <h1 id="blog-titulo" className="type-display mt-3">
          Cuide da sua tecnologia
        </h1>
        <p className="type-lead mt-2 text-paper/70">Guias práticos e respostas às dúvidas que mais recebemos</p>
      </motion.div>

      <motion.form
        role="search"
        onSubmit={submit}
        className="absolute"
        style={{ left: bar.left, top: bar.top, width: bar.width, height: bar.height }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.45 }}
      >
        <label htmlFor="pesquisa-blog" className="sr-only">
          Pesquisar nos guias
        </label>
        <input
          id="pesquisa-blog"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          onKeyDown={(event) => event.key === 'Escape' && onQueryChange('')}
          placeholder="Pesquisar guias"
          autoComplete="off"
          className="h-full w-full rounded-[0.32em] border border-white/70 bg-white/95 pl-[0.9em] pr-[3.4em] text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] outline-none backdrop-blur transition-shadow placeholder:text-ink/45 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.35),0_20px_50px_-20px_rgba(0,0,0,0.6)] [&::-webkit-search-cancel-button]:hidden"
          style={{ fontSize }}
        />
        <button
          type="submit"
          aria-label="Pesquisar"
          className="absolute inset-y-[12%] right-[2%] grid aspect-square place-items-center rounded-[0.28em] bg-ink text-paper transition-colors hover:bg-ink-soft"
          style={{ fontSize }}
        >
          <SearchIcon className="h-[1.1em] w-[1.1em]" />
        </button>

        {/* Quick ideas under the bar, or live results once typing */}
        <div className="absolute left-0 top-full mt-3" style={{ width: Math.max(bar.width, Math.min(380, cw - bar.left - 16)) }}>
          <AnimatePresence mode="wait" initial={false}>
            {showResults ? (
              <motion.div
                key="resultados"
                className="overflow-hidden rounded-2xl bg-white p-2 text-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)]"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                {results.length > 0 ? (
                  <>
                    <ul>
                      {results.slice(0, 4).map((article) => (
                        <li key={article.slug}>
                          <Link to={`/blog/${article.slug}`} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-paper">
                            <img src={unsplash(article.cover.src, 200)} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">{article.title}</span>
                              <span className="block text-xs text-ink/50">
                                {topicLabel(article.topic)}, {readingMinutes(article)} min
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onMouseDown={onShowAll} className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-paper">
                      Ver {results.length === 1 ? 'o resultado' : `os ${results.length} resultados`} na biblioteca
                    </button>
                  </>
                ) : (
                  <p className="px-3 py-3 text-sm text-ink/60">
                    Ainda não temos um guia sobre isso.{' '}
                    <Link to="/contacto" className="link-underline font-medium text-ink">
                      Pergunte-nos
                    </Link>
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.p
                key="ideias"
                className="flex flex-wrap items-center gap-2 text-sm text-paper/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span>Experimente</span>
                {SUGGESTIONS.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => {
                      onQueryChange(word);
                      document.getElementById('pesquisa-blog')?.focus();
                    }}
                    className="h-8 rounded-full border border-paper/25 bg-paper/10 px-3 text-paper backdrop-blur transition-colors hover:bg-paper hover:text-ink"
                  >
                    {word}
                  </button>
                ))}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.form>
    </section>
  );
};

export default BlogSearchHero;
