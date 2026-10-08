import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { useAssistantStore } from '../../stores/assistantStore';
import { ChipIcon, CloseIcon, RestartIcon } from '../ui/Icons';
import ChatMessageView, { AssistantAvatar, Suggestions } from './ChatMessageView';
import Composer from './Composer';
import { useChatContext, whatsappHandoff } from './useChatContext';

const STARTERS = [
  'Procuro um telemóvel',
  'Que formas de pagamento aceitam?',
  'Fazem entregas fora de Maputo?',
  'Onde fica a loja?',
];

/*
 * The conversation. A floating panel in the corner on larger screens, the whole screen on phones.
 * It opens from the button's corner, keeps the newest message in view and closes with Esc.
 */
const AssistantPanel = () => {
  const messages = useAssistantStore((state) => state.messages);
  const { close, reset, send, retry } = useAssistantStore.getState();
  const context = useChatContext();
  const isPhone = useMediaQuery('(max-width: 639px)');
  const scroller = useRef<HTMLDivElement>(null);
  const count = useRef(messages.length);

  const busy = messages.some((message) => message.status === 'streaming');
  const lastQuestion = [...messages].reverse().find((message) => message.role === 'user')?.text;
  const handoffHref = whatsappHandoff(lastQuestion);

  // New messages glide into view; text arriving word by word just keeps the bottom in sight.
  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const added = messages.length !== count.current;
    count.current = messages.length;
    element.scrollTo({ top: element.scrollHeight, behavior: added ? 'smooth' : 'auto' });
  }, [messages]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // On phones the chat covers the page, so the page behind it stays still.
  useEffect(() => {
    if (!isPhone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isPhone]);

  const ask = (text: string) => send(text, context);
  const follow = () => isPhone && close();

  return (
    <motion.section
      role="dialog"
      aria-modal={isPhone}
      aria-label="Assistente da Rhulany Tech"
      className="fixed z-[60] flex flex-col overflow-hidden bg-paper shadow-[0_40px_90px_-30px_rgba(12,12,13,0.45)] ring-1 ring-ink/[0.06] max-sm:inset-0 sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100svh-48px))] sm:w-[400px] sm:rounded-[28px] print:hidden"
      style={{ transformOrigin: '100% 100%' }}
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 16, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
      transition={{ duration: 0.55, ease: easeOutExpo }}
    >
      <header className="flex items-center gap-3 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] sm:px-5 sm:pt-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-paper" aria-hidden="true">
          <ChipIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-base font-medium tracking-tight">Assistente Rhulany</h2>
          <p className="truncate text-xs text-ink/50">Produtos, entregas, pagamentos e encomendas</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label="Nova conversa"
            title="Nova conversa"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink/60 transition-colors duration-300 hover:bg-white hover:text-ink"
          >
            <RestartIcon className="h-[18px] w-[18px]" />
          </button>
        )}
        <button
          type="button"
          onClick={close}
          aria-label="Fechar o assistente"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink ring-1 ring-ink/[0.06] transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          <CloseIcon className="h-[18px] w-[18px]" />
        </button>
      </header>

      <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3 sm:px-5">
        <div className="flex gap-2.5">
          <AssistantAvatar />
          <div className="min-w-0 flex-1 space-y-3">
            <p className="w-fit max-w-[86%] rounded-[22px] rounded-tl-md bg-white px-4 py-2.5 text-[15px] leading-relaxed ring-1 ring-ink/[0.05]">
              Olá. Sou o assistente da Rhulany Tech. Pergunte por um produto, um preço, as entregas ou o estado de uma encomenda.
            </p>
            {messages.length === 0 && <Suggestions items={STARTERS} onPick={ask} />}
          </div>
        </div>

        <div className="mt-4 space-y-4" aria-live="polite">
          {messages.map((message, index) => (
            <ChatMessageView
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              onSuggestion={ask}
              onRetry={() => retry(context)}
              onFollow={follow}
              handoffHref={handoffHref}
            />
          ))}
        </div>
      </div>

      <Composer busy={busy} onSend={ask} />
      <p className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2.5 text-center text-xs text-ink/45">
        Prefere falar com uma pessoa?{' '}
        <a href={handoffHref} target="_blank" rel="noopener noreferrer" className="link-underline text-ink/70">
          WhatsApp
        </a>
      </p>
    </motion.section>
  );
};

export default AssistantPanel;
