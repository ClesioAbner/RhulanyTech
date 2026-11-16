import { afterEach, describe, expect, it, vi } from 'vitest';
import { assistantAvailable, requestReply } from './client';
import type { AssistantEvent, AssistantRequest } from './types';

const request: AssistantRequest = {
  sessionId: 'teste',
  messages: [{ role: 'user', text: 'Procuro um telemóvel' }],
  context: { path: '/loja', cart: [] },
};

// A streamed answer, cut into chunks the way a network delivers it (lines can break mid-way).
const ndjson = (chunks: string[]) =>
  new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        const encoder = new TextEncoder();
        chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
        controller.close();
      },
    }),
    { headers: { 'Content-Type': 'application/x-ndjson' } },
  );

const collect = async () => {
  const events: AssistantEvent[] = [];
  await requestReply(request, (event) => events.push(event));
  return events;
};

describe('cliente do assistente', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('está disponível em desenvolvimento, com as respostas de demonstração', () => {
    expect(assistantAvailable).toBe(true);
  });

  it('envia a conversa e o contexto num POST em JSON', async () => {
    const fetchMock = vi.fn(async () => ndjson(['{"type":"done"}\n']));
    vi.stubGlobal('fetch', fetchMock);
    await collect();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/assistant');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual(request);
  });

  it('lê uma resposta em streaming mesmo com linhas partidas entre pedaços', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        ndjson([
          '{"type":"text","delta":"Olá, "}\n{"type":"te',
          'xt","delta":"aqui tem"}\n{"type":"products","ids":["39","46"]}\n',
          '{"type":"suggestions","items":["Até 60 000 MT"]}\n{"type":"action","label":"Ver loja","href":"/loja"}',
        ]),
      ),
    );
    expect(await collect()).toEqual([
      { type: 'text', delta: 'Olá, ' },
      { type: 'text', delta: 'aqui tem' },
      { type: 'products', ids: ['39', '46'] },
      { type: 'suggestions', items: ['Até 60 000 MT'] },
      { type: 'action', label: 'Ver loja', href: '/loja' },
      { type: 'done' },
    ]);
  });

  it('aceita também uma resposta inteira em JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ text: 'Entregamos em todo o país.', suggestions: ['Formas de pagamento'] })),
    );
    expect(await collect()).toEqual([
      { type: 'text', delta: 'Entregamos em todo o país.' },
      { type: 'suggestions', items: ['Formas de pagamento'] },
      { type: 'done' },
    ]);
  });

  it('falha quando o servidor responde com erro', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 503 })),
    );
    await expect(collect()).rejects.toThrow('503');
  });
});
