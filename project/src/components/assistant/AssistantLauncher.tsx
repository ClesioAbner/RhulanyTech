import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import { useAssistantStore } from '../../stores/assistantStore';
import { ChipIcon } from '../ui/Icons';
import { useBottomControls } from './useBottomControls';

const HINT_KEY = 'rt-assistant-hint';
// How far the button rises to sit above a buy bar (its height plus a gap).
const ABOVE_BAR = -76;

const hintSeen = () => {
  try {
    return Boolean(sessionStorage.getItem(HINT_KEY));
  } catch {
    return true;
  }
};

/** The round button in the corner. Once per session, a quiet line beside it says what it is for. */
const AssistantLauncher = ({ hidden }: { hidden: boolean }) => {
  const open = useAssistantStore((state) => state.open);
  const { raised, stepAside } = useBottomControls();
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (hintSeen()) return;
    const show = window.setTimeout(() => {
      setHint(true);
      try {
        sessionStorage.setItem(HINT_KEY, '1');
      } catch {
        // Without storage the hint may show again next time; nothing else depends on it.
      }
    }, 4000);
    const hide = window.setTimeout(() => setHint(false), 11000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const openChat = () => {
    setHint(false);
    open();
  };

  return (
    <AnimatePresence>
      {!hidden && !stepAside && (
        <motion.div
          key="botao"
          className="assistant-launcher fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] flex items-center gap-3 transition-opacity duration-300 sm:bottom-6 sm:right-6 print:hidden"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: raised ? ABOVE_BAR : 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <AnimatePresence>
            {hint && (
              <motion.button
                type="button"
                onClick={openChat}
                className="hidden rounded-full bg-white px-4 py-2.5 text-sm text-ink shadow-[0_18px_40px_-20px_rgba(12,12,13,0.35)] ring-1 ring-ink/[0.06] sm:block"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
              >
                Precisa de ajuda a escolher?
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            onClick={openChat}
            aria-label="Abrir o assistente"
            aria-haspopup="dialog"
            className="group grid h-12 w-12 place-items-center rounded-full bg-ink text-paper shadow-[0_20px_40px_-16px_rgba(12,12,13,0.55)] sm:h-14 sm:w-14"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <ChipIcon className="h-[22px] w-[22px] transition-transform duration-700 ease-out-expo group-hover:rotate-90 sm:h-6 sm:w-6" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssistantLauncher;
