import { motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';

/** Animated tick for a confirmed order. */
const CheckMark = () => (
  <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
    <motion.circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="#0C0C0D"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.9, ease: easeOutExpo }}
    />
    <motion.path
      d="M16 27 l7 7 l13 -15"
      fill="none"
      stroke="#0C0C0D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.55 }}
    />
  </svg>
);

export default CheckMark;
