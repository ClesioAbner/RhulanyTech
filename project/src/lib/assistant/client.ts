import type { AssistantEvent, AssistantReply, AssistantRequest } from './types';

// The backend's address. In development a local demo answers on /api/assistant (dev/assistantMock.ts);
// on the published site the chat only appears once VITE_ASSISTANT_URL is set.
const ENDPOINT = import.meta.env.VITE_ASSISTANT_URL || (import.meta.env.DEV ? '/api/assistant' : '');
const TIMEOUT_MS = 45_000;

export const assistantAvailable = Boolean(ENDPOINT);

const replyToEvents = (reply: AssistantReply): AssistantEvent[] => [
  { type: 'text', delta: reply.text },
  ...(reply.products?.length ? [{ type: 'products' as const, ids: reply.products }] : []),
  ...(reply.suggestions?.length ? [{ type: 'suggestions' as const, items: reply.suggestions }] : []),
  ...(reply.actions ?? []).map((action) => ({ type: 'action' as const, ...action })),
  { type: 'done' },
];

/**
 * Sends the visitor's message and hands each piece of the reply to `onEvent` as it arrives.
 * Rejects on network errors, a non-2xx answer or after TIMEOUT_MS; `signal` cancels it.
 */
export const requestReply = async (request: AssistantRequest, onEvent: (event: AssistantEvent) => void, signal?: AbortSignal) => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/x-ndjson, application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`O assistente respondeu ${response.status}`);

    if (!(response.headers.get('Content-Type') ?? '').includes('ndjson') || !response.body) {
      replyToEvents((await response.json()) as AssistantReply).forEach(onEvent);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const flush = (line: string) => line.trim() && onEvent(JSON.parse(line) as AssistantEvent);
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      lines.forEach(flush);
    }
    flush(buffer + decoder.decode());
    onEvent({ type: 'done' });
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
};
