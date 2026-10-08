import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { requestReply } from '../lib/assistant/client';
import type { AssistantAction, AssistantEvent, AssistantRequest } from '../lib/assistant/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  products?: string[];
  suggestions?: string[];
  actions?: AssistantAction[];
  /** Still arriving, or failed (the visitor can try again). */
  status?: 'streaming' | 'error';
}

interface AssistantState {
  isOpen: boolean;
  sessionId: string;
  messages: ChatMessage[];
  open: () => void;
  close: () => void;
  /** Starts a new conversation. */
  reset: () => void;
  send: (text: string, context: AssistantRequest['context']) => Promise<void>;
  /** Asks again after a failed reply. */
  retry: (context: AssistantRequest['context']) => Promise<void>;
}

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// Only one reply is in flight at a time; a new conversation cancels it.
let inFlight: AbortController | null = null;

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => {
      const patch = (id: string, update: (message: ChatMessage) => ChatMessage) =>
        set((state) => ({ messages: state.messages.map((message) => (message.id === id ? update(message) : message)) }));

      const apply = (id: string) => (event: AssistantEvent) => {
        if (event.type === 'text') patch(id, (m) => ({ ...m, text: m.text + event.delta }));
        else if (event.type === 'products') patch(id, (m) => ({ ...m, products: event.ids }));
        else if (event.type === 'suggestions') patch(id, (m) => ({ ...m, suggestions: event.items }));
        else if (event.type === 'action')
          patch(id, (m) => ({ ...m, actions: [...(m.actions ?? []), { label: event.label, href: event.href }] }));
        else patch(id, (m) => ({ ...m, status: undefined }));
      };

      // Asks for a reply to the conversation as it stands (its last message is the visitor's).
      const ask = async (context: AssistantRequest['context']) => {
        const history = get()
          .messages.filter((m) => !m.status && m.text.trim())
          .map(({ role, text }) => ({ role, text }));
        const replyId = newId();
        set((state) => ({ messages: [...state.messages, { id: replyId, role: 'assistant', text: '', status: 'streaming' }] }));

        inFlight?.abort();
        const controller = new AbortController();
        inFlight = controller;
        try {
          await requestReply({ sessionId: get().sessionId, messages: history, context }, apply(replyId), controller.signal);
        } catch {
          if (!controller.signal.aborted) patch(replyId, (m) => ({ ...m, text: '', status: 'error' }));
        } finally {
          if (inFlight === controller) inFlight = null;
        }
      };

      return {
        isOpen: false,
        sessionId: newId(),
        messages: [],
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
        reset: () => {
          inFlight?.abort();
          set({ messages: [], sessionId: newId() });
        },
        send: async (text, context) => {
          const clean = text.trim();
          if (!clean || get().messages.some((m) => m.status === 'streaming')) return;
          set((state) => ({ messages: [...state.messages, { id: newId(), role: 'user', text: clean }] }));
          await ask(context);
        },
        retry: async (context) => {
          set((state) => ({ messages: state.messages.filter((m) => m.status !== 'error') }));
          await ask(context);
        },
      };
    },
    {
      // The conversation survives page changes and reloads, but not closing the tab.
      name: 'rhulany-assistant',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ sessionId: state.sessionId, messages: state.messages }),
      // A reply cut off by a reload can't resume: show it as failed so it can be asked again.
      merge: (persisted, current) => {
        const saved = persisted as Partial<AssistantState>;
        return {
          ...current,
          ...saved,
          messages: (saved.messages ?? []).map((m) =>
            m.status === 'streaming' ? { ...m, text: '', status: 'error' as const } : m,
          ),
        };
      },
    },
  ),
);
