import { useEffect, type ComponentType, type SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FAQ } from '../data/blog';
import { STORE } from '../data/store';
import { easeOutExpo, inViewOnce } from '../lib/motion';
import ContactForm from '../components/content/ContactForm';
import FaqList from '../components/content/FaqList';
import PageHero from '../components/content/PageHero';
import SocialLinks from '../components/ui/SocialLinks';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '../components/ui/Icons';

// Maputo at sunset (Unsplash), kept locally so the banner does not wait on their CDN.
const HERO_IMAGE = '/images/contacto/maputo-fim-de-tarde';
// Google's embed of the neighbourhood: no API key needed, loaded only when the section is near.
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(`${STORE.address}, Moçambique`)}&z=15&output=embed`;

interface Channel {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const CHANNELS: Channel[] = [
  { icon: WhatsAppIcon, label: 'WhatsApp', value: STORE.phone, href: STORE.whatsappUrl, external: true },
  { icon: PhoneIcon, label: 'Telefone', value: STORE.phone, href: STORE.phoneHref },
  { icon: MailIcon, label: 'Email', value: STORE.email, href: `mailto:${STORE.email}` },
];

const heroAction =
  'inline-flex h-11 items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-5 text-sm font-medium backdrop-blur-xl transition-colors duration-300 hover:bg-paper hover:text-ink';

/** One way to reach the team: a white card that turns dark on hover, the channel above its number or address. */
const ChannelCard = ({ channel }: { channel: Channel }) => {
  const Icon = channel.icon;
  return (
    <a
      href={channel.href}
      target={channel.external ? '_blank' : undefined}
      rel={channel.external ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-5 rounded-[24px] bg-white p-5 transition-colors duration-500 ease-out-expo hover:bg-ink hover:text-paper sm:p-6"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper text-ink transition-[background-color,color,transform] duration-500 ease-out-expo group-hover:scale-105 group-hover:bg-paper/10 group-hover:text-paper">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="eyebrow block text-ink/45 transition-colors duration-500 group-hover:text-paper/55">
          {channel.label}
        </span>
        <span className="mt-1.5 block break-words font-display text-lg font-medium tracking-tight sm:text-xl">
          {channel.value}
        </span>
      </span>
    </a>
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
          className="lg:col-span-5 lg:pt-6"
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
            Como prefere falar connosco
          </motion.h2>
          <ul className="mt-8 space-y-3">
            {CHANNELS.map((channel) => (
              <motion.li
                key={channel.label}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOutExpo } },
                }}
              >
                <ChannelCard channel={channel} />
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
            <SocialLinks labelled omit={['whatsapp']} />
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
          className="grid overflow-hidden rounded-[32px] bg-white lg:grid-cols-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          <div className="flex flex-col justify-between gap-10 p-7 sm:p-12 lg:col-span-5 lg:p-14">
            <div>
              <p className="eyebrow text-ink/45">A loja</p>
              <h2 id="visite" className="type-title mt-3">
                Visite-nos em Maputo
              </h2>
              <p className="type-lead mt-4 max-w-sm text-ink/60">
                Veja os equipamentos ao vivo e tire as dúvidas com quem os conhece
              </p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="eyebrow text-ink/40">Morada</dt>
                <dd className="mt-2 font-display text-lg font-medium tracking-tight">{STORE.address}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/40">Horário</dt>
                <dd className="mt-2 font-display text-lg font-medium tracking-tight">{STORE.hours}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ink-soft"
              >
                Como chegar
              </a>
              <Link
                to="/sobre"
                className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-sm font-medium transition-colors duration-300 hover:border-ink"
              >
                Conhecer a Rhulany Tech
              </Link>
            </div>
          </div>
          <div className="relative order-first h-72 overflow-hidden bg-mist sm:h-96 lg:order-last lg:col-span-7 lg:h-auto lg:min-h-[540px]">
            {/* Raised so Google's place card sits above the frame; the credits at the bottom stay visible */}
            <iframe
              title={`Mapa: ${STORE.address}`}
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-x-0 -top-[120px] h-[calc(100%+120px)] w-full border-0 contrast-[1.05] grayscale-[0.9]"
            />
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
