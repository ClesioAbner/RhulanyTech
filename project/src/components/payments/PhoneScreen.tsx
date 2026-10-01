import { AnimatePresence, motion } from 'framer-motion';
import { products } from '../../data/products';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import LockScreen from './LockScreen';
import { PAYMENT_METHODS } from './methods';
import { CheckoutScreen } from './PaymentScreens';

export const SHOWCASE_PRODUCT = products.find((product) => product.id === '1');

interface PhoneScreenProps {
  activeIndex: number;
  /** Lock-screen stage while the phone is on display or falling; null once the payments section takes over. */
  showcaseStage?: number | null;
}

// Screen content for the 3D phone: lock screen in the shop, then checkout, then one screen per payment method.
const PhoneScreen = ({ activeIndex, showcaseStage = null }: PhoneScreenProps) => {
  const isShowcase = showcaseStage !== null && activeIndex < 0;
  const key = isShowcase ? 'showcase' : activeIndex >= 0 ? `method-${activeIndex}` : 'checkout';
  const Screen = activeIndex >= 0 ? PAYMENT_METHODS[activeIndex].Screen : CheckoutScreen;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        className="absolute inset-0"
        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
      >
        {isShowcase ? (
          <LockScreen
            stage={showcaseStage}
            productName={SHOWCASE_PRODUCT?.model ?? 'iPhone 16 Pro Max'}
            price={formatPrice(SHOWCASE_PRODUCT?.price ?? 180000)}
          />
        ) : (
          <Screen />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PhoneScreen;
