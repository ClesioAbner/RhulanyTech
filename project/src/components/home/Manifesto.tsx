import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import ArrowChip from '../ui/ArrowChip';

const STATEMENT =
  'Tecnologia original, escolhida com cuidado e entregue em todo o país. Smartphones, computadores, consolas e acessórios com a garantia oficial de cada marca, e uma equipa que continua consigo depois da compra.';
// Phones: one sentence, so the statement reads in a glance.
const STATEMENT_PHONE =
  'Tecnologia original, escolhida com cuidado e entregue em todo o país, com a garantia oficial de cada marca.';
const PHOTO = '/images/home/pessoa-auscultadores';

// Each word darkens in turn as its share of the scroll passes, from a pale grey to ink.
const Word = ({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 1.5 / total], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{' '}
    </motion.span>
  );
};

/*
 * After the banner: who Rhulany Tech is. A person listening, in profile, melts into the page on
 * the right (above the copy on phones) and looks towards the statement, which is read word by
 * word as the page scrolls; then the two ways in.
 */
const Manifesto = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isWide = useMediaQuery('(min-width: 640px)');
  const words = (isWide ? STATEMENT : STATEMENT_PHONE).split(' ');
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ['start 85%', 'end 50%'] });
  const { scrollYProgress: passing } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const photoY = useTransform(passing, [0, 1], ['-6%', '6%']);
  const photoScale = useTransform(passing, [0, 0.5], [1.12, 1]);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden" aria-labelledby="manifesto">
      {/* The photo: right half on desktop, fading into the page towards the copy and the bottom */}
      <div className="relative -z-10 h-[62vw] max-h-[520px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[58%] lg:[mask-composite:intersect] lg:[mask-image:linear-gradient(to_right,transparent,black_38%),linear-gradient(to_bottom,black_70%,transparent)]">
        <motion.img
          src={`${PHOTO}-1024.webp`}
          srcSet={`${PHOTO}-640.webp 960w, ${PHOTO}-1024.webp 1536w`}
          sizes="(min-width: 1024px) 58vw, 100vw"
          alt="Jovem de perfil a ouvir música com auscultadores"
          loading="lazy"
          className="h-full w-full object-cover object-[70%_30%]"
          style={{ y: photoY, scale: photoScale }}
        />
      </div>

      <div className="container-site relative pb-24 sm:pb-32 lg:flex lg:min-h-[100svh] lg:items-center lg:py-40">
        <div className="max-sm:-mt-10 lg:w-[56%]">
          <p id="manifesto" className="eyebrow text-ink/45">
            Conheça a Rhulany Tech
          </p>
          <p
            ref={textRef}
            className="mt-6 font-display text-[1.7rem] font-medium leading-[1.22] tracking-tight sm:text-[2.3rem] lg:text-[2.6rem] xl:text-[2.9rem]"
          >
            {words.map((word, index) => (
              <Word key={`${isWide}-${index}`} word={word} index={index} total={words.length} progress={scrollYProgress} />
            ))}
          </p>
          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.2 }}
          >
            <Link
              to="/loja"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-7 pr-3 text-sm font-medium text-paper shadow-[0_18px_40px_-18px_rgba(12,12,13,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Entrar na loja
              <ArrowChip />
            </Link>
            <Link
              to="/loja/acessorios"
              className="inline-flex h-14 items-center rounded-full bg-white/80 px-7 text-sm font-medium text-ink ring-1 ring-ink/10 backdrop-blur transition-colors duration-300 hover:bg-white"
            >
              Ver áudio e acessórios
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
