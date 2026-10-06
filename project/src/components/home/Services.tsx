import { motion } from 'framer-motion';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';

const REASONS = [
  {
    title: 'Garantia oficial',
    body: 'Produtos originais, selados de fábrica, com garantia do fabricante e assistência técnica especializada.',
  },
  {
    title: 'Entrega em todo o país',
    body: 'Entregamos em Maputo e em todas as províncias, com acompanhamento da encomenda até à sua porta.',
  },
  {
    title: 'Pagamento à sua medida',
    body: 'M-Pesa, e-Mola, mKesh, cartão ou PayPal. Escolha o método que lhe der mais jeito no checkout.',
  },
  {
    title: 'Aconselhamento real',
    body: 'Uma equipa que usa o que vende e o ajuda a escolher a configuração certa para o seu trabalho ou jogo.',
  },
];

const Services = () => (
  <section className="border-t border-ink/10" aria-labelledby="servicos-titulo">
    <div className="container-site grid gap-14 py-28 lg:grid-cols-12 lg:py-40">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <SectionHeading id="servicos-titulo" index="05" eyebrow="Porquê a Rhulany Tech" title="Comprar tecnologia devia ser simples" />
          <p className="mt-6 max-w-sm text-base leading-relaxed text-ink/60">
            Somos uma equipa moçambicana que testa o que vende, explica sem jargão e continua consigo depois da
            compra
          </p>
        </div>
      </div>

      <ol className="lg:col-span-6 lg:col-start-7">
        {REASONS.map((reason, index) => (
          <motion.li
            key={reason.title}
            className="grid grid-cols-[3.5rem_1fr] gap-x-6 border-t border-ink/10 py-10 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] lg:py-12"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.05 }}
          >
            <span className="font-display text-4xl font-medium tabular-nums leading-none tracking-tight text-ink/15 sm:text-5xl">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="type-heading">{reason.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-ink/60">{reason.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

export default Services;
