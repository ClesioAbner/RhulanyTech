import { motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import type { ChatMessage } from '../../stores/assistantStore';
import { ChipIcon } from '../ui/Icons';
import TechChip from '../ui/TechChip';
import ProductSuggestion from './ProductSuggestion';

const bubble = 'max-w-[86%] whitespace-pre-wrap break-words px-4 py-2.5 text-[15px] leading-relaxed';
const chip =
  'rounded-full border border-ink/15 bg-paper px-3.5 py-2 text-left text-[13px] leading-tight text-ink/80 transition-colors duration-300 hover:border-ink hover:text-ink';
const action =
  'inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-medium ring-1 ring-ink/10 transition-colors duration-300 hover:bg-ink hover:text-paper';

export const AssistantAvatar = () => (
  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-paper" aria-hidden="true">
    <ChipIcon className="h-3.5 w-3.5" />
  </span>
);

export const Suggestions = ({ items, onPick }: { items: string[]; onPick: (text: string) => void }) => (
  <div className="flex flex-wrap gap-2 pt-1">
    {items.map((item) => (
      <button key={item} type="button" onClick={() => onPick(item)} className={chip}>
        {item}
      </button>
    ))}
  </div>
);

interface ChatMessageViewProps {
  message: ChatMessage;
  /** Quick replies only make sense under the newest message. */
  isLast: boolean;
  onSuggestion: (text: string) => void;
  onRetry: () => void;
  /** Called when a link inside the reply is followed (phones close the chat). */
  onFollow: () => void;
  handoffHref: string;
}

const ChatMessageView = ({ message, isLast, onSuggestion, onRetry, onFollow, handoffHref }: ChatMessageViewProps) => {
  const enter = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: easeOutExpo },
  };

  if (message.role === 'user') {
    return (
      <motion.div className="flex justify-end" {...enter}>
        <p className={`${bubble} rounded-[22px] rounded-br-md bg-ink text-paper`}>{message.text}</p>
      </motion.div>
    );
  }

  const thinking = message.status === 'streaming' && !message.text;
  const streaming = message.status === 'streaming';

  return (
    <motion.div className="flex gap-2.5" {...enter}>
      <AssistantAvatar />
      <div className="min-w-0 flex-1 space-y-3">
        {message.status === 'error' ? (
          <div className={`${bubble} rounded-[22px] rounded-tl-md bg-white text-ink ring-1 ring-ink/[0.05]`}>
            Não consegui responder agora.
            <span className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={onRetry} className={action}>
                Tentar de novo
              </button>
              <a href={handoffHref} target="_blank" rel="noopener noreferrer" className={action}>
                Falar no WhatsApp
              </a>
            </span>
          </div>
        ) : thinking ? (
          <div
            className="inline-flex items-center gap-2.5 rounded-[22px] rounded-tl-md bg-white py-2 pl-2.5 pr-4 ring-1 ring-ink/[0.05]"
            role="status"
          >
            <TechChip size={26} />
            <span className="text-[13px] text-ink/50">A escrever</span>
          </div>
        ) : (
          <p className={`${bubble} w-fit rounded-[22px] rounded-tl-md bg-white text-ink ring-1 ring-ink/[0.05]`}>
            {message.text}
            {streaming && <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.2em] animate-pulse bg-ink/50" />}
          </p>
        )}

        {Boolean(message.products?.length) && (
          <div className="-mr-4 flex snap-x gap-2.5 overflow-x-auto pb-1 pr-4 [scrollbar-width:none] sm:-mr-5 sm:pr-5 [&::-webkit-scrollbar]:hidden">
            {message.products!.map((id) => (
              <ProductSuggestion key={id} id={id} onFollow={onFollow} />
            ))}
          </div>
        )}

        {Boolean(message.actions?.length) && (
          <div className="flex flex-wrap gap-2">
            {message.actions!.map((item) => {
              const external = /^https?:/.test(item.href);
              return (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  onClick={external ? undefined : onFollow}
                  className={action}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        )}

        {isLast && !streaming && Boolean(message.suggestions?.length) && (
          <Suggestions items={message.suggestions!} onPick={onSuggestion} />
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessageView;
