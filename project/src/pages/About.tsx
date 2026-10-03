import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATALOG } from '../lib/catalog';
import { STORE } from '../data/store';
import { unsplash } from '../lib/images';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import PageHero from '../components/content/PageHero';

const HERO_IMAGE = '1650876095496-e01d50a6c874';
const CITY_IMAGE = '1684777310271-22ab048239bd';
const BRANDS = [...new Set(CATALOG.map((product) => product.brand))].sort((a, b) => a.localeCompare(b));

const PRINCIPLES = [
  {
    title: 'Só produtos originais',
    body: 'Tudo o que vendemos chega selado de fábrica, com a garantia oficial do fabricante. Quando não conseguimos confirmar a origem de um equipamento, não o vendemos.',
    image: '1760225529221-841ebb8e7867',
    alt: 'iPhone branco dentro da caixa original, sobre fundo branco',
  },
  {
    title: 'Aconselhamento honesto',
    body: 'Perguntamos para que vai usar o equipamento antes de sugerir um modelo. Muitas vezes a melhor escolha não é a mais cara, e é essa que recomendamos.',
    image: '1639413665566-2f75adf7b7ca',
    alt: 'Secretária clara com monitor, teclado e uma garrafa',
  },
  {
    title: 'Presentes depois da compra',
    body: 'Configuramos o equipamento novo, passamos os dados do aparelho antigo e respondemos às dúvidas que forem surgindo, mesmo meses depois.',
    image: '1550041473-d296a3a8a18a',
    alt: 'Técnico a trabalhar no interior de um telemóvel com uma pinça',
  },
  {
    title: 'Perto de si, em todo o país',
    body: 'Uma loja física em Maputo e entregas em todas as províncias, com pagamento por M-Pesa, e-Mola, cartão ou PayPal.',
    image: '1721403901773-ce6d56b709d2',
    alt: 'Avenida Marginal de Maputo ao fim da tarde, com palmeiras',
  },
];

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: inViewOnce };

/** One commitment: photo revealed with a wipe, text beside it; rows alternate sides on desktop. */
const Principle = ({ item, index }: { item: (typeof PRINCIPLES)[number]; index: number }) => {
  const flipped = index % 2 === 1;
  return (
    <li className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
      <motion.div
        className={`overflow-hidden rounded-[28px] bg-mist lg:col-span-7 ${flipped ? 'lg:order-2' : ''}`}
        initial={{ clipPath: 'inset(12% 12% 12% 12% round 28px)', opacity: 0.4 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.1, ease: easeOutExpo }}
      >
        <img src={unsplash(item.image, 1400)} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover lg:aspect-[3/2]" />
      </motion.div>
      <motion.div
        className={`lg:col-span-5 ${flipped ? 'lg:order-1' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
      >
        <p className="font-display text-sm tabular-nums text-ink/35">{String(index + 1).padStart(2, '0')}</p>
        <h3 className="type-title mt-3">{item.title}</h3>
        <p className="type-lead mt-4 max-w-md text-ink/60">{item.body}</p>
      </motion.div>
    </li>
  );
};

/** Brand names drifting slowly across the page, as type rather than logos. */
const BrandMarquee = () => (
  <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
    <motion.ul
      className="flex w-max gap-12 pr-12 font-display text-3xl font-medium tracking-tight text-ink/25 lg:text-[2.75rem]"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
    >
      {[...BRANDS, ...BRANDS].map((brand, index) => (
        <li key={`${brand}-${index}`} aria-hidden={index >= BRANDS.length} className="whitespace-nowrap">
          {brand}
        </li>
      ))}
    </motion.ul>
  </div>
);

/** /sobre */
const About = () => {
  useEffect(() => {
    document.title = 'Sobre | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, []);

  return (
    <div className="pb-28 lg:pb-36">
      <PageHero
        image={HERO_IMAGE}
        alt="Barco à vela na baía de Maputo ao pôr do sol, com a cidade ao fundo"
        eyebrow="Sobre a Rhulany Tech"
        title="Tecnologia original, de Maputo para todo o país"
        nextId="quem-somos"
      />

      <section id="quem-somos" className="container-site scroll-mt-16 pt-24 lg:pt-32" aria-labelledby="quem-somos-titulo">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <h2 id="quem-somos-titulo" className="eyebrow text-ink/45 lg:col-span-3 lg:pt-3">
            Quem somos
          </h2>
          <motion.p
            className="type-title lg:col-span-9"
            {...reveal}
            transition={{ duration: 1, ease: easeOutExpo }}
          >
            Comprar tecnologia em Moçambique devia ser tão seguro como em qualquer parte do mundo.{' '}
            <span className="text-ink/40">
              Por isso vendemos só produtos originais, com preços claros, entrega em todo o país e uma equipa que
              continua disponível depois da compra.
            </span>
          </motion.p>
        </div>
      </section>

      <section className="container-site pt-24 lg:pt-32" aria-labelledby="principios">
        <motion.div className="max-w-3xl" {...reveal} transition={{ duration: 0.8, ease: easeOutExpo }}>
          <p className="eyebrow text-ink/45">Como trabalhamos</p>
          <h2 id="principios" className="type-display mt-3">
            Quatro compromissos com quem compra connosco
          </h2>
        </motion.div>
        <ol className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
          {PRINCIPLES.map((item, index) => (
            <Principle key={item.title} item={item} index={index} />
          ))}
        </ol>
      </section>

      <section className="mt-24 border-y border-ink/10 py-14 lg:mt-32 lg:py-16" aria-labelledby="marcas">
        <div className="container-site">
          <h2 id="marcas" className="eyebrow text-ink/45">
            Marcas que vendemos
          </h2>
        </div>
        <div className="mt-8">
          <BrandMarquee />
        </div>
      </section>

      <section className="container-site pt-24 lg:pt-32" aria-labelledby="loja-fisica">
        <motion.div className="grid overflow-hidden rounded-[32px] bg-white lg:grid-cols-2" {...reveal} transition={{ duration: 0.9, ease: easeOutExpo }}>
          <div className="relative min-h-[320px] overflow-hidden lg:min-h-[540px]">
            <img
              src={unsplash(CITY_IMAGE, 1600)}
              alt="Prédios de Maputo iluminados pelo sol do fim da tarde"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-12 lg:p-14">
            <div>
              <p className="eyebrow text-ink/45">A loja</p>
              <h2 id="loja-fisica" className="type-title mt-3">
                Venha ver os equipamentos de perto
              </h2>
              <p className="type-lead mt-4 max-w-md text-ink/60">
                Experimente antes de decidir, tire dúvidas com calma e saia com tudo configurado
              </p>
            </div>
            <dl className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-ink/50">Morada</dt>
                <dd className="text-right">{STORE.address}</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-ink/50">Horário</dt>
                <dd className="text-right">{STORE.hours}</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-ink/50">Telefone</dt>
                <dd className="text-right">
                  <a href={STORE.phoneHref} className="link-underline tabular-nums">
                    {STORE.phone}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
              >
                Como chegar
              </a>
              <Link
                to="/contacto"
                className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-sm font-medium transition-colors hover:border-ink"
              >
                Falar connosco
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container-site pt-24 text-center lg:pt-32" aria-labelledby="comecar">
        <motion.div {...reveal} transition={{ duration: 0.9, ease: easeOutExpo }}>
          <h2 id="comecar" className="type-display mx-auto max-w-3xl">
            Encontre o equipamento certo para si
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/loja"
              className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
            >
              Ir para a loja
            </Link>
            <Link
              to="/blog"
              className="inline-flex h-12 items-center rounded-full border border-ink/15 px-7 text-sm font-medium transition-colors hover:border-ink"
            >
              Ler os guias
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
