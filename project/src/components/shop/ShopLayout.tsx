import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';

// Moving between ranges of one category keeps the page mounted (so the header and catalogue can
// animate in place); any other move (category, product) is a new page with a short crossfade.
const transitionKey = (pathname: string) => {
  const [, section, category] = pathname.split('/');
  return section === 'loja' && category ? `/loja/${category}` : pathname;
};

/** Wraps every shop route with page transitions. */
const ShopLayout = () => {
  const { pathname } = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={transitionKey(pathname)}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
};

export default ShopLayout;
