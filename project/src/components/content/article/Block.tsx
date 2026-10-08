import { motion } from 'framer-motion';
import type { ArticleBlock } from '../../../data/blog';
import { unsplash } from '../../../lib/images';
import { easeOutExpo } from '../../../lib/motion';

/** One block of a guide: paragraph, heading, list, tip, image or products. */

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
          <img
            src={unsplash(block.src, 1400)}
            alt={block.alt}
            loading="lazy"
            className="aspect-[3/2] w-full rounded-[22px] object-cover"
          />
          {block.caption && <figcaption className="mt-3 text-sm text-ink/50">{block.caption}</figcaption>}
        </figure>
      );
    default:
      return <p className="mt-6 text-[17px] leading-[1.75] text-ink/75">{block.text}</p>;
  }
};

export default Block;
