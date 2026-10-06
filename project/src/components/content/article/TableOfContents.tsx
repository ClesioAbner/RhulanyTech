import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { easeOutExpo } from '../../../lib/motion';
import { sectionNumber, type Heading } from './sections';

/** "Neste guia": numbered section links; the one being read is marked. */
const TableOfContents = ({ headings }: { headings: Heading[] }) => {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
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

export default TableOfContents;
