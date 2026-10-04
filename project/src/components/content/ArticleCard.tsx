import { Link } from 'react-router-dom';
import { formatArticleDate, readingMinutes, topicLabel, type Article } from '../../data/blog';
import { unsplash } from '../../lib/images';

interface ArticleCardProps {
  article: Article;
  /**
   * stack: photo above the text (grids)
   * row: small photo beside the text (side lists)
   * list: reading-list row, text first and photo on the right (the library)
   */
  layout?: 'stack' | 'row' | 'list';
}

const Underline = ({ children }: { children: string }) => (
  <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
    {children}
  </span>
);

/** Guide card in three layouts. */
const ArticleCard = ({ article, layout = 'stack' }: ArticleCardProps) => {
  const href = `/blog/${article.slug}`;

  if (layout === 'list') {
    return (
      <Link
        to={href}
        className="group -mx-4 grid grid-cols-[1fr_auto] items-center gap-5 rounded-[28px] p-4 transition-colors duration-500 hover:bg-white sm:-mx-6 sm:gap-10 sm:p-6"
      >
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="font-medium uppercase tracking-[0.14em] text-ink/50">{topicLabel(article.topic)}</span>
            <span className="text-ink/40 max-sm:hidden">{formatArticleDate(article.date)}</span>
          </p>
          <h3 className="type-heading mt-3">
            <Underline>{article.title}</Underline>
          </h3>
          <p className="mt-2 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-ink/60 max-sm:hidden">{article.excerpt}</p>
          <p className="mt-4 text-xs tabular-nums text-ink/45">{readingMinutes(article)} min de leitura</p>
        </div>
        <div className="aspect-[4/3] w-28 overflow-hidden rounded-2xl bg-mist sm:w-52 lg:w-64">
          <img
            src={unsplash(article.cover.src, 600)}
            alt={article.cover.alt}
            style={{ objectPosition: article.cover.position }}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.06]"
          />
        </div>
      </Link>
    );
  }

  const row = layout === 'row';
  return (
    <Link to={href} className={`group ${row ? 'flex items-center gap-5' : 'block'}`}>
      <div className={`overflow-hidden bg-mist ${row ? 'aspect-square w-28 shrink-0 rounded-2xl sm:w-36' : 'aspect-[4/3] rounded-[22px]'}`}>
        <img
          src={unsplash(article.cover.src, row ? 400 : 900)}
          alt={article.cover.alt}
          style={{ objectPosition: article.cover.position }}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.05]"
        />
      </div>
      <div className={row ? 'min-w-0' : ''}>
        <p className={`flex items-center justify-between gap-4 text-xs ${row ? '' : 'mt-5'}`}>
          <span className="font-medium uppercase tracking-[0.14em] text-ink/50">{topicLabel(article.topic)}</span>
          <span className="tabular-nums text-ink/40">{readingMinutes(article)} min</span>
        </p>
        <h3 className={`mt-2 font-display font-medium leading-snug tracking-tight [text-wrap:balance] ${row ? 'text-lg' : 'type-heading'}`}>
          <Underline>{article.title}</Underline>
        </h3>
        <p className={`mt-2 text-sm leading-relaxed text-ink/60 ${row ? 'line-clamp-2 max-sm:hidden' : 'line-clamp-2'}`}>{article.excerpt}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;
