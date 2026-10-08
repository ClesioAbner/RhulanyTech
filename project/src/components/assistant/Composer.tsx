import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUpIcon } from '../ui/Icons';

const MAX_HEIGHT = 128;

/** The message box: grows with the text, Enter sends, Shift+Enter starts a new line. */
const Composer = ({ busy, onSend }: { busy: boolean; onSend: (text: string) => void }) => {
  const id = useId();
  const [text, setText] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const element = field.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT)}px`;
  }, [text]);

  // With a mouse, typing can start straight away; on touch screens the keyboard waits for a tap.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) field.current?.focus();
  }, []);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!text.trim() || busy) return;
    onSend(text);
    setText('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="px-3 pt-2 sm:px-4">
      <div className="flex items-end gap-2 rounded-[24px] bg-white p-1.5 pl-4 ring-1 ring-ink/10 transition-shadow duration-300 focus-within:ring-ink/40">
        <label htmlFor={id} className="sr-only">
          Mensagem para o assistente
        </label>
        <textarea
          id={id}
          ref={field}
          rows={1}
          value={text}
          maxLength={1000}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escreva a sua pergunta"
          className="flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-snug outline-none placeholder:text-ink/40 focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || busy}
          aria-label="Enviar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-[background-color,color,transform] duration-300 hover:bg-ink-soft active:scale-95 disabled:bg-ink/10 disabled:text-ink/35"
        >
          <ArrowUpIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </form>
  );
};

export default Composer;
