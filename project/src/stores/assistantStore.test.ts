import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAssistantStore } from './assistantStore';

const context = { path: '/produto/iphone-17-pro', cart: [{ id: '39', name: 'iPhone 17 Pro', price: 165000, quantity: 1 }] };

const ndjson = (lines: object[]) =>
  new Response(lines.map((line) => JSON.stringify(line)).join('\n'), { headers: { 'Content-Type': 'application/x-ndjson' } });

describe('conversa do assistente', () => {
  beforeEach(() => useAssistantStore.setState({ messages: [], isOpen: false }));
  afterEach(() => vi.unstubAllGlobals());

  it('junta a pergunta e a resposta, com produtos e sugestões', async () => {
    const fetchMock = vi.fn(async () =>
      ndjson([
        { type: 'text', delta: 'Temos estes ' },
        { type: 'text', delta: 'modelos.' },
        { type: 'products', ids: ['39'] },
        { type: 'suggestions', items: ['Até 60 000 MT'] },
        { type: 'done' },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    await useAssistantStore.getState().send('  Procuro um telemóvel  ', context);

    const [user, reply] = useAssistantStore.getState().messages;
    expect(user).toMatchObject({ role: 'user', text: 'Procuro um telemóvel' });
    expect(reply).toMatchObject({
      role: 'assistant',
      text: 'Temos estes modelos.',
      products: ['39'],
      suggestions: ['Até 60 000 MT'],
    });
    expect(reply.status).toBeUndefined();

    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.context).toEqual(context);
    expect(body.messages).toEqual([{ role: 'user', text: 'Procuro um telemóvel' }]);
  });

  it('ignora mensagens vazias', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await useAssistantStore.getState().send('   ', context);
    expect(useAssistantStore.getState().messages).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('marca a resposta como falhada e volta a perguntar ao tentar de novo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 503 })),
    );
    await useAssistantStore.getState().send('Onde fica a loja?', context);
    expect(useAssistantStore.getState().messages.at(-1)).toMatchObject({ role: 'assistant', status: 'error' });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ndjson([{ type: 'text', delta: 'Na Urbanização, em Maputo.' }, { type: 'done' }])),
    );
    await useAssistantStore.getState().retry(context);
    const messages = useAssistantStore.getState().messages;
    expect(messages).toHaveLength(2);
    expect(messages[1]).toMatchObject({ text: 'Na Urbanização, em Maputo.' });
    expect(messages[1].status).toBeUndefined();
  });

  it('começa uma conversa nova com outra sessão', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ndjson([{ type: 'done' }])),
    );
    await useAssistantStore.getState().send('Olá', context);
    const before = useAssistantStore.getState().sessionId;
    useAssistantStore.getState().reset();
    expect(useAssistantStore.getState().messages).toHaveLength(0);
    expect(useAssistantStore.getState().sessionId).not.toBe(before);
  });
});
