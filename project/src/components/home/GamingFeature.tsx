import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';
import GamingStage from './GamingStage';

const HIGHLIGHTS = [
  { label: 'Consoles', detail: 'PlayStation, Xbox e Nintendo' },
  { label: 'Periféricos', detail: 'Teclados, ratos e headsets de competição' },
  { label: 'Monitores', detail: 'Alta frequência para jogar sem atrasos' },
];

const GamingFeature = () => (
    <section className="overflow-hidden border-t border-ink/10" aria-labelledby="gaming-titulo">
      <div className="container-site grid items-center gap-16 py-28 lg:grid-cols-12 lg:gap-12 lg:py-40">
        <div className="lg:col-span-5">
          <SectionHeading id="gaming-titulo" index="04" eyebrow="Gaming" title="O seu setup, montado peça a peça" />
          <motion.p
            className="mt-6 max-w-md text-base leading-relaxed text-ink/60"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
          >
            Consoles, monitores de alta frequência e periféricos de competição. Ajudamos a escolher cada componente
            para que tudo funcione em conjunto desde o primeiro dia
          </motion.p>

          <motion.ul
            className="mt-10 border-t border-ink/10"
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          >
            {HIGHLIGHTS.map((item) => (
              <motion.li
                key={item.label}
                className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4"
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOutExpo } },
                }}
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-right text-sm text-ink/55">{item.detail}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/loja/gaming"
              className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ink-soft"
            >
              Ver consoles
            </Link>
            <Link
              to="/loja/acessorios"
              className="inline-flex h-12 items-center rounded-full border border-ink/20 px-7 text-sm font-medium transition-colors duration-300 hover:border-ink"
            >
              Ver periféricos
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <GamingStage />
        </div>
      </div>
    </section>
);

export default GamingFeature;
