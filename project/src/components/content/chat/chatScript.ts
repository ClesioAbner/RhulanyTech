import { useEffect, useRef, useState } from 'react';

export type Ticks = 0 | 1 | 2 | 3; // none, sent, delivered, read

export interface Line {
  id: number;
  from: 'cliente' | 'loja';
  text: string;
  time: string;
  ticks: Ticks;
  /** Emoji reaction shown under the bubble. */
  reaction?: string;
}

export interface ChatState {
  lines: Line[];
  composing: string;
  typing: boolean;
}

export type Step =
  | { type: 'compose'; text: string; duration?: number }
  | { type: 'send' }
  | { type: 'ticks'; value: Ticks; after: number }
  | { type: 'typing'; duration: number }
  | { type: 'reply'; text: string }
  | { type: 'react'; emoji: string; after: number }
  | { type: 'wait'; duration: number };

const EMPTY: ChatState = { lines: [], composing: '', typing: false };
export const clock = () => new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

/** Plays a chat script while `active`; with `loop`, starts again after a pause. */
export const useChatScript = (steps: Step[], active: boolean, loop: boolean) => {
  const [state, setState] = useState<ChatState>(EMPTY);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    const run = async () => {
      do {
        setState(EMPTY);
        await sleep(500);
        for (const step of steps) {
          if (cancelled) return;
          if (step.type === 'compose') {
            const perChar = Math.min(45, (step.duration ?? 1600) / step.text.length);
            for (let i = 1; i <= step.text.length && !cancelled; i += 1) {
              setState((s) => ({ ...s, composing: step.text.slice(0, i) }));
              await sleep(perChar);
            }
            await sleep(250);
          } else if (step.type === 'send') {
            idRef.current += 1;
            const id = idRef.current;
            setState((s) => ({
              ...s,
              composing: '',
              lines: [...s.lines, { id, from: 'cliente', text: s.composing, time: clock(), ticks: 1 }],
            }));
          } else if (step.type === 'ticks') {
            await sleep(step.after);
            setState((s) => ({
              ...s,
              lines: s.lines.map((line) => (line.from === 'cliente' ? { ...line, ticks: step.value } : line)),
            }));
          } else if (step.type === 'typing') {
            setState((s) => ({ ...s, typing: true }));
            await sleep(step.duration);
            setState((s) => ({ ...s, typing: false }));
          } else if (step.type === 'react') {
            await sleep(step.after);
            // The store reacts to the customer's latest message.
            setState((s) => {
              const index = s.lines.map((line) => line.from).lastIndexOf('cliente');
              return index < 0
                ? s
                : { ...s, lines: s.lines.map((line, i) => (i === index ? { ...line, reaction: step.emoji } : line)) };
            });
          } else if (step.type === 'reply') {
            idRef.current += 1;
            const id = idRef.current;
            setState((s) => ({ ...s, lines: [...s.lines, { id, from: 'loja', text: step.text, time: clock(), ticks: 0 }] }));
            await sleep(500);
          } else {
            await sleep(step.duration);
          }
        }
      } while (loop && !cancelled);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [steps, active, loop]);

  return state;
};
