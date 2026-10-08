import { SOCIAL } from '../../data/store';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './Icons';

const ICONS = { whatsapp: WhatsAppIcon, facebook: FacebookIcon, instagram: InstagramIcon };

interface SocialLinksProps {
  className?: string;
  /** Show the network name beside the icon. */
  labelled?: boolean;
  /** Networks already offered elsewhere on the page. */
  omit?: (typeof SOCIAL)[number]['id'][];
}

/** WhatsApp, Facebook and Instagram as quiet round buttons. */
const SocialLinks = ({ className = '', labelled = false, omit = [] }: SocialLinksProps) => (
  <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Redes sociais">
    {SOCIAL.filter((item) => !omit.includes(item.id)).map((item) => {
      const Icon = ICONS[item.id];
      return (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labelled ? undefined : item.label}
            title={item.label}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-full border border-ink/10 text-ink/70 transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper ${
              labelled ? 'px-4 text-sm' : 'w-10'
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {labelled && item.label}
          </a>
        </li>
      );
    })}
  </ul>
);

export default SocialLinks;
