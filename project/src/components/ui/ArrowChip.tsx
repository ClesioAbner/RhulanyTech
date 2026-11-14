/** An arrow in a small round chip, for the main call to action. */
const ArrowChip = ({ tone = 'paper' }: { tone?: 'paper' | 'ink' }) => (
  <span
    aria-hidden="true"
    className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-rotate-45 ${tone === 'paper' ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}
  >
    <span className="relative block h-[1.5px] w-3 bg-current after:absolute after:-right-px after:-top-[3px] after:h-2 after:w-2 after:rotate-45 after:border-r-[1.5px] after:border-t-[1.5px] after:border-current after:content-['']" />
  </span>
);

export default ArrowChip;
