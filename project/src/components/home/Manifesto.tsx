import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const STATEMENT =
  'Tecnologia original, escolhida com cuidado e entregue em todo o país. Smartphones, computadores, consolas e acessórios com a garantia oficial de cada marca, e uma equipa que continua consigo depois da compra.';
const WORDS = STATEMENT.split(' ');

// Each word darkens in turn as its share of the scroll passes, from a pale grey to ink.
const Word = ({ word, index, progress }: { word: string; index: number; progress: MotionValue<number> }) => {
  const start = index / WORDS.length;
  const opacity = useTransform(progress, [start, start + 1.5 / WORDS.length], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{' '}
    </motion.span>
  );
};

/** After the banner: what Rhulany Tech is, read word by word as the page scrolls. */
const Manifesto = () => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });

  return (
    <section className="container-site py-24 sm:py-32 lg:py-44" aria-labelledby="manifesto">
      <p id="manifesto" className="eyebrow text-ink/45">
        Conheça a Rhulany Tech
      </p>
      <p
        ref={ref}
        className="mt-6 max-w-5xl font-display text-[1.75rem] font-medium leading-[1.22] tracking-tight sm:text-[2.4rem] lg:text-[3.1rem]"
      >
        {WORDS.map((word, index) => (
          <Word key={index} word={word} index={index} progress={scrollYProgress} />
        ))}
      </p>
    </section>
  );
};

export default Manifesto;
