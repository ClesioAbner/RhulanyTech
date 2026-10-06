import { Link } from 'react-router-dom';
import { type Article } from '../../../data/blog';
import { unsplash } from '../../../lib/images';

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

export default NextGuide;
