import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SORT_OPTIONS, type SortId } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';

interface SortMenuProps {
  value: SortId;
  onChange: (value: SortId) => void;
}

const CLOSE_DELAY = 180; // ms, lets the cursor travel from the button into the panel

/*
 * "Ordenar por" popover. Opens on hover with a mouse, on click or keyboard everywhere else,
 * and closes on Escape, outside click or when the cursor leaves.
 */
const SortMenu = ({ value, onChange }: SortMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Opened by hovering: a click that follows keeps it open, and focus stays where it was.
  const [openedByHover, setOpenedByHover] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number>();
  const menuId = useId();
  const current = SORT_OPTIONS.find((option) => option.id === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openOnHover = (event: ReactPointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    if (!isOpen) setOpenedByHover(true);
    setIsOpen(true);
  };

  const closeOnLeave = (event: ReactPointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    closeTimer.current = window.setTimeout(() => setIsOpen(false), CLOSE_DELAY);
  };

  const choose = (id: SortId) => {
    onChange(id);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Arrow keys move between options; Escape returns focus to the button.
  const onMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative" onPointerEnter={openOnHover} onPointerLeave={closeOnLeave}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen(openedByHover || !isOpen);
          setOpenedByHover(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpenedByHover(false);
            setIsOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={`flex h-10 items-center gap-2 rounded-full pl-4 pr-3.5 text-sm transition-colors duration-300 ${
          isOpen ? 'bg-ink/[0.08]' : 'bg-ink/[0.04] hover:bg-ink/[0.08]'
        }`}
      >
        <span className="text-ink/50">Ordenar por</span>
        <span className="font-medium">{current.label}</span>
        <motion.span
          aria-hidden="true"
          className="ml-0.5 block h-1.5 w-1.5 border-b-[1.5px] border-r-[1.5px] border-ink/60"
          animate={{ rotate: isOpen ? 225 : 45, y: isOpen ? 1.5 : -1.5 }}
          transition={{ duration: 0.35, ease: easeOutExpo }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={menuId}
            role="menu"
            aria-label="Ordenar produtos"
            onKeyDown={onMenuKeyDown}
            className="absolute right-0 top-full z-30 mt-2 w-[min(19rem,calc(100vw-2.5rem))] origin-top-right rounded-2xl border border-ink/[0.07] bg-white/95 p-1.5 shadow-[0_24px_50px_-20px_rgba(12,12,13,0.35)] backdrop-blur-xl"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
          >
            {SORT_OPTIONS.map((option, index) => {
              const isActive = option.id === value;
              return (
                <motion.li
                  key={option.id}
                  role="none"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.02 * index }}
                >
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    autoFocus={isActive && !openedByHover}
                    onClick={() => choose(option.id)}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-2.5 text-left text-sm outline-none transition-colors duration-200 hover:bg-ink/[0.05] focus-visible:bg-ink/[0.05] ${
                      isActive ? 'font-medium text-ink' : 'text-ink/70'
                    }`}
                  >
                    {option.label}
                    {isActive && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortMenu;
