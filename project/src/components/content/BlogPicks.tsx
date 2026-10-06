import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ARTICLES_BY_DATE, readingMinutes, topicLabel } from '../../data/blog';
import { unsplash } from '../../lib/images';
import { easeOutExpo, riseOnView } from '../../lib/motion';
import ArticleCard from './ArticleCard';

const PICKS = ARTICLES_BY_DATE.slice(0, 3);

/** Editorial opening: one large story and two smaller ones beside it. */
const BlogPicks = () => {
  const [lead, ...rest] = PICKS;
  return (
    <section className="container-site pt-20 lg:pt-28" aria-labelledby="para-comecar">
      <motion.div {...riseOnView} transition={{ duration: 0.8, ease: easeOutExpo }}>
        <p className="eyebrow text-ink/45">Para começar</p>
        <h2 id="para-comecar" className="type-title mt-3">
          Guias essenciais
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
        <motion.div className="lg:col-span-7" {...riseOnView} transition={{ duration: 0.9, ease: easeOutExpo }}>
          <Link to={`/blog/${lead.slug}`} className="group block">
            <div className="aspect-[16/10] overflow-hidden rounded-[28px] bg-mist">
              <img
                src={unsplash(lead.cover.src, 1400)}
                alt={lead.cover.alt}
                style={{ objectPosition: lead.cover.position }}
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
            <motion.li
              key={article.slug}
              {...riseOnView}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 + index * 0.08 }}
            >
              <ArticleCard article={article} layout="row" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BlogPicks;
