import { motion } from 'framer-motion';

interface ChoiceCardProps {
  title: string;
  note: string;
  selected: boolean;
  onSelect: () => void;
  /** Shared by the cards of one group, so the dot glides between them. */
  layoutId: string;
}

/** A large radio option: delivery method or payment method. */
const ChoiceCard = ({ title, note, selected, onSelect, layoutId }: ChoiceCardProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={`flex items-start gap-3 rounded-xl border p-5 text-left transition-[border-color,box-shadow] duration-300 ${
      selected ? 'border-ink bg-white shadow-[0_0_0_1px_#0C0C0D]' : 'border-ink/[0.14] bg-white hover:border-ink/30'
    }`}
  >
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-ink' : 'border-ink/25'}`}
    >
      {selected && <motion.span layoutId={layoutId} className="h-2.5 w-2.5 rounded-full bg-ink" />}
    </span>
    <span>
      <span className="block text-[15px] font-medium">{title}</span>
      <span className="mt-1 block text-sm leading-snug text-ink/55">{note}</span>
    </span>
  </button>
);

export default ChoiceCard;
