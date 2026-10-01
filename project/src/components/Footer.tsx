import { Link } from 'react-router-dom';
import { STORE } from '../data/store';

const COLUMNS = [
  {
    title: 'Loja',
    links: [
      { label: 'Celulares', to: '/products?category=celulares' },
      { label: 'Computadores', to: '/products?category=computadores' },
      { label: 'Consoles', to: '/products?category=consoles' },
      { label: 'Periféricos', to: '/products?category=perifericos' },
      { label: 'Componentes', to: '/products?category=componentes' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', to: '/about' },
      { label: 'Academia', to: '/academy' },
      { label: 'Blog', to: '/blog' },
      { label: 'Pagamentos', to: '/#pagamentos' },
    ],
  },
];

const SOCIAL = [
  { label: 'WhatsApp', href: STORE.whatsappUrl },
  { label: 'Facebook', href: 'https://facebook.com/RhulanyTech' },
  { label: 'Instagram', href: 'https://instagram.com/RhulanyTech' },
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
        <ul className="mt-8 flex gap-6 text-sm">
          {SOCIAL.map((item) => (
            <li key={item.label}>
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
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
          <li>
            <a href={STORE.phoneHref} className="link-underline tabular-nums">
              {STORE.phone}
            </a>
          </li>
          <li className="text-ink/60">{STORE.address}</li>
          <li className="text-ink/60">{STORE.hours}</li>
        </ul>
      </div>
    </div>

    <div className="container-site flex flex-col gap-2 border-t border-ink/10 py-6 text-xs text-ink/50 sm:flex-row sm:justify-between">
      <p>© {new Date().getFullYear()} Rhulany Tech. Todos os direitos reservados.</p>
      <p>Todos os preços em Meticais (MT).</p>
    </div>
  </footer>
);

export default Footer;
