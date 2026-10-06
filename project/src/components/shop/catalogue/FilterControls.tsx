import { useId, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { easeOutExpo } from '../../../lib/motion';
import ProductImage from '../../product/ProductImage';

const Chevron = ({ open }: { open: boolean }) => (
  <motion.span
    aria-hidden="true"
    className="block h-[7px] w-[7px] border-b-[1.5px] border-r-[1.5px] border-current"
    initial={false}
    animate={{ rotate: open ? 225 : 45, y: open ? 2 : -2 }}
    transition={{ duration: 0.35, ease: easeOutExpo }}
  />
);

/** A section of the side panel that opens and closes. */
export const Group = ({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="border-t border-ink/[0.07] first:border-t-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-[13px] font-semibold text-ink/85 transition-colors hover:text-ink"
        >
          {title}
          <Chevron open={open} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <div className="space-y-0.5 px-3 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export const Option = ({
  type,
  checked,
  onChange,
  label,
  count,
}: {
  type: 'checkbox' | 'radio';
  checked: boolean;
  onChange: () => void;
  label: string;
  count: number;
}) => (
  <label
    className={`group/opt flex cursor-pointer items-center gap-3 rounded-xl px-2 py-[7px] text-sm transition-colors hover:bg-ink/[0.04] ${
      count === 0 && !checked ? 'opacity-40' : ''
    }`}
  >
    <input type={type} checked={checked} onChange={onChange} className="peer sr-only" />
    <span
      aria-hidden="true"
      className={`grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${
        type === 'radio' ? 'rounded-full' : 'rounded-[6px]'
      } ${checked ? 'border-ink bg-ink text-paper' : 'border-ink/25 bg-white group-hover/opt:border-ink/50'}`}
    >
      {checked &&
        (type === 'radio' ? (
          <span className="h-1.5 w-1.5 rounded-full bg-paper" />
        ) : (
          <svg
            viewBox="0 0 12 12"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 6.2l2.3 2.3 4.7-5" />
          </svg>
        ))}
    </span>
    <span className={`flex-1 ${checked ? 'font-medium' : 'text-ink/80'}`}>{label}</span>
    <span className="text-xs tabular-nums text-ink/40">{count}</span>
  </label>
);

/** Small studio tile: one product, or four for "everything". */
const Thumb = ({ images }: { images: (string | undefined)[] }) => (
  <span className="stage relative grid h-9 w-9 shrink-0 overflow-hidden rounded-[11px] ring-1 ring-ink/[0.06]">
    {images.length > 1 ? (
      <span className="grid grid-cols-2 p-[3px]">
        {images.slice(0, 4).map((src, i) => (
          <span key={i} className="relative">
            {src && <ProductImage src={src} inset="p-[8%]" />}
          </span>
        ))}
      </span>
    ) : (
      images[0] && <ProductImage src={images[0]} inset="p-[14%]" />
    )}
  </span>
);

export const NavItem = ({
  to,
  label,
  count,
  active,
  images,
  group,
}: {
  to: string;
  label: string;
  count: number;
  active: boolean;
  images: (string | undefined)[];
  group: string;
}) => (
  <Link
    to={to}
    aria-current={active ? 'page' : undefined}
    className="group/nav relative flex items-center gap-3 rounded-2xl px-2 py-1.5 text-sm"
  >
    {active && (
      <motion.span
        layoutId={`${group}-active`}
        className="absolute inset-0 rounded-2xl bg-ink/[0.06]"
        transition={{ duration: 0.45, ease: easeOutExpo }}
      />
    )}
    <span className="relative transition-transform duration-500 ease-out-expo group-hover/nav:scale-[1.06]">
      <Thumb images={images} />
    </span>
    <span className={`relative flex-1 truncate ${active ? 'font-medium text-ink' : 'text-ink/75 group-hover/nav:text-ink'}`}>
      {label}
    </span>
    <span className="relative text-xs tabular-nums text-ink/40">{count}</span>
  </Link>
);
