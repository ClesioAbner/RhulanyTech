import { useEffect, type ComponentType, type SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FAQ } from '../data/blog';
import { STORE } from '../data/store';
import { unsplash, unsplashSrcSet } from '../lib/images';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import ContactForm from '../components/content/ContactForm';
import FaqList from '../components/content/FaqList';
import PageHero from '../components/content/PageHero';
import SocialLinks from '../components/ui/SocialLinks';
import { ClockIcon, MailIcon, PhoneIcon, StoreIcon, WhatsAppIcon } from '../components/ui/Icons';

// Maputo at sunset (Unsplash), kept locally so the banner does not wait on their CDN.
const HERO_IMAGE = '/images/contacto/maputo-fim-de-tarde';
const STORE_IMAGE = '1684777238927-1134cca28473';

interface Channel {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

const CHANNELS: Channel[] = [
  { icon: WhatsAppIcon, label: 'WhatsApp', value: STORE.phone, href: STORE.whatsappUrl, external: true },
  { icon: PhoneIcon, label: 'Telefone', value: STORE.phone, href: STORE.phoneHref },
  { icon: MailIcon, label: 'Email', value: STORE.email, href: `mailto:${STORE.email}` },
  { icon: StoreIcon, label: 'Loja', value: STORE.address, href: STORE.mapsUrl, external: true },
  { icon: ClockIcon, label: 'Horário', value: STORE.hours },
];

const heroAction =
  'inline-flex h-11 items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-5 text-sm font-medium backdrop-blur-xl transition-colors duration-300 hover:bg-paper hover:text-ink';

/** One contact line: icon in a soft circle and the value; links fill the circle on hover. */
const ChannelRow = ({ channel }: { channel: Channel }) => {
  const Icon = channel.icon;
  const content = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 break-words text-[17px] font-medium tracking-tight">{channel.value}</span>
    </>
  );
  return channel.href ? (
    <a
      href={channel.href}
      target={channel.external ? '_blank' : undefined}
      rel={channel.external ? 'noopener noreferrer' : undefined}
      aria-label={`${channel.label}: ${channel.value}`}
      className="group flex items-center gap-4 rounded-full transition-transform duration-500 ease-out-expo hover:translate-x-1"
    >
      {content}
    </a>
  ) : (
    <div className="group flex items-center gap-4" aria-label={`${channel.label}: ${channel.value}`}>
      {content}
    </div>
  );
};

/** /contacto */
const Contact = () => {
  useEffect(() => {
    document.title = 'Contacto | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, []);

  const scrollToForm = () => document.getElementById('escreva')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="pb-28 lg:pb-36">
      <PageHero
        image={HERO_IMAGE}
        alt="Maputo ao pôr do sol, com prédios e palmeiras junto à baía"
        eyebrow="Contacto"
        title="Fale connosco"
        lead="Estamos disponíveis antes, durante e depois da compra"
        aside={
          <div className="flex flex-wrap gap-2">
            <a href={STORE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={heroAction}>
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              WhatsApp
            </a>
            <a href={STORE.phoneHref} className={heroAction}>
              <PhoneIcon className="h-[18px] w-[18px]" />
              Ligar
            </a>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-white"
            >
              <MailIcon className="h-[18px] w-[18px]" />
              Escrever
            </button>
          </div>
        }
        nextId="escreva"
      />

      <div id="escreva" className="container-site grid scroll-mt-16 gap-12 pt-20 lg:grid-cols-12 lg:gap-16 lg:pt-28">
        <motion.section
          className="lg:col-span-5 lg:pt-10"
          aria-labelledby="contactos-directos"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          <motion.h2
            id="contactos-directos"
            className="type-title"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
            }}
          >
            Contactos
          </motion.h2>
          <ul className="mt-8 space-y-4">
            {CHANNELS.map((channel) => (
              <motion.li
                key={channel.label}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOutExpo } },
                }}
              >
                <ChannelRow channel={channel} />
              </motion.li>
            ))}
          </ul>
          <motion.div
            className="mt-10"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
            }}
          >
            <SocialLinks labelled />
          </motion.div>
        </motion.section>

        <motion.section
          className="lg:col-span-7"
          aria-label="Formulário de contacto"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          <ContactForm />
        </motion.section>
      </div>

      <section className="container-site pt-24 lg:pt-32" aria-labelledby="visite">
        <motion.div
          className="relative h-[min(64svh,520px)] min-h-[400px] overflow-hidden rounded-[32px] bg-ink text-paper"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          <img
            src={unsplash(STORE_IMAGE, 2000)}
            srcSet={unsplashSrcSet(STORE_IMAGE)}
            sizes="(min-width: 1360px) 1264px, 100vw"
            alt="Prédios de Maputo sob um céu azul"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
          <div className="relative flex h-full max-w-xl flex-col justify-end p-6 sm:p-10 lg:p-14">
            <p className="eyebrow text-paper/60">A loja</p>
            <h2 id="visite" className="type-title mt-3">
              Visite-nos em Maputo
            </h2>
            <p className="type-lead mt-3 text-paper/70">
              {STORE.address}, {STORE.hours.charAt(0).toLowerCase() + STORE.hours.slice(1)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-white"
              >
                <StoreIcon className="h-[18px] w-[18px]" />
                Abrir no Google Maps
              </a>
              <Link
                to="/sobre"
                className="inline-flex h-12 items-center rounded-full border border-paper/25 px-6 text-sm font-medium transition-colors hover:border-paper"
              >
                Conhecer a Rhulany Tech
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container-site pt-24 lg:pt-32" aria-labelledby="duvidas-contacto">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-ink/45">Dúvidas rápidas</p>
            <h2 id="duvidas-contacto" className="type-title mt-3">
              Talvez a resposta já esteja aqui
            </h2>
            <Link to="/blog#duvidas" className="link-underline mt-5 inline-block text-sm font-medium">
              Ver todas as dúvidas
            </Link>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={FAQ.slice(0, 4)} initiallyOpen={null} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
