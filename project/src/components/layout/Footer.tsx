import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORE } from '../../data/store';
import { easeOutExpo } from '../../lib/motion';
import { ClockIcon, MailIcon, PhoneIcon, StoreIcon } from '../ui/Icons';
import SocialLinks from '../ui/SocialLinks';

const iconClass = 'mt-0.5 h-4 w-4 shrink-0 text-ink/40';

const COLUMNS = [
  {
    title: 'Loja',
    links: [
      { label: 'Celulares', to: '/loja/celulares' },
      { label: 'Computadores', to: '/loja/computadores' },
      { label: 'Gaming', to: '/loja/gaming' },
      { label: 'Câmaras', to: '/loja/cameras' },
      { label: 'Casa Inteligente', to: '/loja/casa-inteligente' },
      { label: 'Acessórios', to: '/loja/acessorios' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', to: '/sobre' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contacto', to: '/contacto' },
      { label: 'Pagamentos', to: '/#pagamentos' },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-ink/10 bg-paper">
    <div className="container-site grid gap-12 py-20 md:grid-cols-12 lg:py-24">
      <div className="md:col-span-12 lg:col-span-5">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          Rhulany<span className="text-ink/40">Tech</span>
        </Link>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/60">
          Tecnologia original para trabalhar, criar e jogar. Loja física em Maputo, entregas em todo o país.
        </p>
      </div>

      {COLUMNS.map((column) => (
        <div key={column.title} className="md:col-span-4 lg:col-span-2">
          <h2 className="eyebrow text-ink/45">{column.title}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {column.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="md:col-span-4 lg:col-span-3">
        <h2 className="eyebrow text-ink/45">Contacto</h2>
        <ul className="mt-5 space-y-3 text-sm">
          <li className="flex gap-3">
            <PhoneIcon className={iconClass} />
            <a href={STORE.phoneHref} className="link-underline tabular-nums">
              {STORE.phone}
            </a>
          </li>
          <li className="flex gap-3">
            <MailIcon className={iconClass} />
            <a href={`mailto:${STORE.email}`} className="link-underline">
              {STORE.email}
            </a>
          </li>
          <li className="flex gap-3 text-ink/60">
            <StoreIcon className={iconClass} />
            {STORE.address}
          </li>
          <li className="flex gap-3 text-ink/60">
            <ClockIcon className={iconClass} />
            {STORE.hours}
          </li>
        </ul>
        <SocialLinks className="mt-6" />
      </div>
    </div>

    <div className="container-site flex flex-col gap-5 border-t border-ink/10 py-7 text-xs text-ink/50 md:flex-row md:items-center md:justify-between">
      <p>
        © {new Date().getFullYear()} Rhulany Tech. Todos os direitos reservados.
        <span className="mt-1 block sm:ml-1 sm:mt-0 sm:inline">Preços em Meticais (MT).</span>
      </p>
      <Signature />
    </div>
  </footer>
);

/** The developer's credit: a quiet label and the name, crossed once by a sweep of light as it comes into view. */
const Signature = () => (
  <p className="flex items-baseline gap-3">
    <span className="eyebrow text-[10px] text-ink/40">Desenvolvido por</span>
    <motion.span
      className="bg-[linear-gradient(110deg,#0C0C0D_42%,rgba(12,12,13,0.3)_50%,#0C0C0D_58%)] bg-[length:300%_100%] bg-clip-text font-display text-sm font-medium tracking-tight text-transparent"
      initial={{ backgroundPositionX: '100%' }}
      whileInView={{ backgroundPositionX: '0%' }}
      viewport={{ once: true }}
      transition={{ duration: 1.8, ease: easeOutExpo, delay: 0.4 }}
    >
      Eclésio Pembelane
    </motion.span>
  </p>
);

export default Footer;
