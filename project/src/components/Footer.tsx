import { Link } from 'react-router-dom';
import { STORE } from '../data/store';
import { ClockIcon, MailIcon, PhoneIcon, StoreIcon } from './ui/Icons';
import SocialLinks from './ui/SocialLinks';

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
      <div className="md:col-span-5">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          Rhulany<span className="text-ink/40">Tech</span>
        </Link>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/60">
          Tecnologia original para trabalhar, criar e jogar. Loja física em Maputo, entregas em todo o país.
        </p>
      </div>

      {COLUMNS.map((column) => (
        <div key={column.title} className="md:col-span-2">
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

      <div className="md:col-span-3">
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

    <div className="container-site flex flex-col gap-2 border-t border-ink/10 py-6 text-xs text-ink/50 sm:flex-row sm:justify-between">
      <p>© {new Date().getFullYear()} Rhulany Tech. Todos os direitos reservados.</p>
      <p>Todos os preços em Meticais (MT).</p>
    </div>
  </footer>
);

export default Footer;
