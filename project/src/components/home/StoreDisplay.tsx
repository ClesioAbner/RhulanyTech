import { motion } from 'framer-motion';
import { resolveImage } from '../../lib/catalog';
import { easeOutExpo, inViewOnce } from '../../lib/motion';

const P = '/images/produtos/';

// A display table as in the shop: phones standing in a gentle arc, the middle one nearest.
const PHONES = [
  { src: `${P}iphone-17-salva`, alt: 'iPhone 17 em salva', height: 74, rotateY: 26 },
  { src: `${P}iphone-air-azul`, alt: 'iPhone Air em azul-céu', height: 86, rotateY: 14 },
  { src: `${P}iphone-17-pro-laranja`, alt: 'iPhone 17 Pro em laranja cósmico', height: 100, rotateY: 0 },
  { src: `${P}iphone-17-pro-azul`, alt: 'iPhone 17 Pro em azul profundo', height: 86, rotateY: -14 },
  { src: `${P}iphone-17-lavanda`, alt: 'iPhone 17 em lavanda', height: 74, rotateY: -26 },
];

/*
 * The shop's display table: phones on stands under a warm spotlight, each with its reflection on
 * the table top. They rise into place one after another as the section comes into view.
 */
const StoreDisplay = () => (
  <div className="relative mx-auto aspect-[4/3] w-full max-w-[640px]" aria-hidden="true">
    {/* Spotlight */}
    <div className="absolute inset-x-[8%] top-0 h-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,226,180,0.22),transparent)]" />
    {/* Table top */}
    <div className="absolute inset-x-0 bottom-[6%] h-[30%] [perspective:700px]">
      <div className="h-full w-full rounded-[50%] bg-[radial-gradient(70%_80%_at_50%_30%,rgba(255,255,255,0.1),rgba(255,255,255,0.02)_70%)] [transform:rotateX(70deg)]" />
    </div>

    <motion.div
      className="absolute inset-x-0 bottom-[20%] flex h-[62%] items-end justify-center gap-[3%] [perspective:1200px]"
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
    >
      {PHONES.map((phone) => (
        <motion.div
          key={phone.src}
          className="relative flex h-full items-end"
          style={{ rotateY: phone.rotateY }}
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easeOutExpo } },
          }}
        >
          <div className="relative" style={{ height: `${phone.height}%` }}>
            <img
              src={resolveImage(phone.src, 600)}
              alt={phone.alt}
              loading="lazy"
              className="h-full w-auto max-w-none drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)]"
            />
            {/* Reflection on the table */}
            <img
              src={resolveImage(phone.src, 600)}
              alt=""
              loading="lazy"
              className="absolute left-0 top-full h-full w-auto max-w-none -scale-y-100 opacity-25"
              style={{
                maskImage: 'linear-gradient(to top, black, transparent 28%)',
                WebkitMaskImage: 'linear-gradient(to top, black, transparent 28%)',
              }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default StoreDisplay;
