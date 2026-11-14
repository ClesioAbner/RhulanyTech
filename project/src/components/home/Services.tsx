import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { resolveImage } from '../../lib/catalog';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import DeliveryTruck from '../checkout/DeliveryTruck';
import PaymentMark from '../content/screens/PaymentMarks';
import SectionHeading from '../ui/SectionHeading';

const P = '/images/produtos/';

interface TileProps {
  title: string;
  body: string;
  /** Soft background of the card. */
  tone: string;
  className?: string;
  /** Picture or animation; sits under the copy. */
  art: ReactNode;
  index: number;
}

const Tile = ({ title, body, tone, className = '', art, index }: TileProps) => (
  <motion.li
    className={`relative isolate flex min-h-[340px] flex-col overflow-hidden rounded-[28px] p-7 ring-1 ring-ink/[0.05] sm:min-h-[400px] sm:p-9 ${className}`}
    style={{ background: tone }}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={inViewOnce}
    transition={{ duration: 0.9, ease: easeOutExpo, delay: index * 0.08 }}
  >
    <h3 className="max-w-xs font-display text-[1.7rem] font-medium leading-tight tracking-tight sm:text-[2rem]">{title}</h3>
    <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink/60">{body}</p>
    <div className="relative mt-auto flex flex-1 items-end justify-center pt-8">{art}</div>
  </motion.li>
);

// A product floating gently on its card.
const Float = ({ src, alt, className }: { src: string; alt: string; className: string }) => (
  <motion.img
    src={resolveImage(src, 1200)}
    alt={alt}
    loading="lazy"
    className={`stage-shadow object-contain ${className}`}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/**
 * Why Rhulany Tech, as a bento grid: four cards in soft colours, each with a picture or a small
 * animation instead of a paragraph: the warranty, the ways to pay, delivery and advice.
 */
const Services = () => (
  <section className="border-t border-ink/10" aria-labelledby="servicos-titulo">
    <div className="container-site py-20 sm:py-28 lg:py-40">
      <SectionHeading
        id="servicos-titulo"
        index="03"
        eyebrow="Porquê a Rhulany Tech"
        title="Comprar tecnologia devia ser simples"
      />

      <ul className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-5">
        <Tile
          index={0}
          className="lg:col-span-7"
          tone="radial-gradient(90% 80% at 75% 90%, #cfe0f3 0%, transparent 70%), linear-gradient(160deg, #f6f9fc 0%, #e6eef7 100%)"
          title="Garantia oficial"
          body="Originais e selados de fábrica, com a garantia de cada marca."
          art={<Float src={`${P}iphone-18-pro-glaciar`} alt="iPhone 18 Pro em glaciar" className="h-[240px] sm:h-[300px]" />}
        />
        <Tile
          index={1}
          className="lg:col-span-5"
          tone="linear-gradient(160deg, #ffffff 0%, #f1f1f4 100%)"
          title="Pague como preferir"
          body="M-Pesa, e-Mola, mKesh, cartão ou PayPal."
          art={
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {(['mpesa', 'emola', 'mkesh', 'card', 'paypal'] as const).map((method, index) => (
                <motion.span
                  key={method}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewOnce}
                  transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.25 + index * 0.08 }}
                >
                  <PaymentMark method={method} className="h-12 w-12 drop-shadow-sm sm:h-16 sm:w-16" />
                </motion.span>
              ))}
            </div>
          }
        />
        <Tile
          index={2}
          className="lg:col-span-5"
          tone="radial-gradient(80% 70% at 30% 100%, #d9efe2 0%, transparent 70%), linear-gradient(160deg, #f7fbf8 0%, #e9f3ec 100%)"
          title="Entrega em todo o país"
          body="Em Maputo e em todas as províncias, até à sua porta."
          art={
            <div className="w-full [--rt-truck-bg:#e9f3ec]">
              <DeliveryTruck size="11px" />
            </div>
          }
        />
        <Tile
          index={3}
          className="lg:col-span-7"
          tone="radial-gradient(85% 80% at 80% 85%, #f1dfd2 0%, transparent 70%), linear-gradient(160deg, #fcf9f6 0%, #f3ebe4 100%)"
          title="Aconselhamento real"
          body="Uma equipa que usa o que vende e ajuda a escolher o certo para si."
          art={
            <Float
              src={`${P}airpods-max-luz-das-estrelas`}
              alt="AirPods Max em luz das estrelas"
              className="h-[220px] sm:h-[280px]"
            />
          }
        />
      </ul>
    </div>
  </section>
);

export default Services;
