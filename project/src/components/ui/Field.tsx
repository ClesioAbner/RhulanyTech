import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/*
 * Form fields shared by checkout, account and sign-in: label above, soft filled box, error below.
 * Same look as the contact card so every form on the site feels like one product.
 */

const boxClass = (invalid: boolean, extra = '') =>
  `w-full rounded-xl border bg-white px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 disabled:bg-paper disabled:text-ink/50 ${
    invalid
      ? 'border-[#b42318] focus:shadow-[0_0_0_4px_rgba(180,35,24,0.12)]'
      : 'border-ink/[0.14] hover:border-ink/30 focus:border-ink focus:shadow-[0_0_0_4px_rgba(12,12,13,0.07)]'
  } ${extra}`;

interface FrameProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

const Frame = ({ id, label, error, hint, optional, children, className = '' }: FrameProps) => (
  <div className={className}>
    <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm">
      <span className="font-medium text-ink/80">{label}</span>
      {optional && <span className="text-xs text-ink/40">Opcional</span>}
    </label>
    {children}
    <AnimatePresence initial={false} mode="wait">
      {(error || hint) && (
        <motion.p
          key={error ? 'erro' : 'ajuda'}
          id={`${id}-nota`}
          className={`px-1 pt-2 text-xs ${error ? 'text-[#b42318]' : 'text-ink/45'}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {error ?? hint}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

type BaseProps = { label: string; error?: string; hint?: ReactNode; optional?: boolean; wrapperClassName?: string; leading?: ReactNode };

export const TextField = forwardRef<HTMLInputElement, BaseProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, hint, optional, wrapperClassName, leading, className = '', id: givenId, ...props }, ref) => {
    const autoId = useId();
    const id = givenId ?? autoId;
    return (
      <Frame id={id} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
        <div className="relative">
          {leading && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-ink/45">{leading}</span>}
          <input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? `${id}-nota` : undefined}
            className={boxClass(Boolean(error), `h-[52px] ${leading ? 'pl-[4.25rem]' : ''} ${className}`)}
            {...props}
          />
        </div>
      </Frame>
    );
  },
);
TextField.displayName = 'TextField';

export const SelectField = ({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  children,
  id: givenId,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) => {
  const autoId = useId();
  const id = givenId ?? autoId;
  return (
    <Frame id={id} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      <div className="relative">
        <select id={id} aria-invalid={Boolean(error)} className={boxClass(Boolean(error), 'h-[52px] cursor-pointer appearance-none pr-10')} {...props}>
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 h-1.5 w-1.5 -translate-y-[70%] rotate-45 border-b-[1.5px] border-r-[1.5px] border-ink/50"
        />
      </div>
    </Frame>
  );
};

export const TextAreaField = ({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  id: givenId,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const autoId = useId();
  const id = givenId ?? autoId;
  return (
    <Frame id={id} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      <textarea id={id} aria-invalid={Boolean(error)} className={boxClass(Boolean(error), 'block min-h-[96px] resize-none py-3.5')} {...props} />
    </Frame>
  );
};
