import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

/*
 * Demo answers for the chat during `npm run dev`, so the interface can be tried before the backend
 * exists. It is not the assistant: the real one lives on the server and speaks the same contract
 * (src/lib/assistant/types.ts). Only `vite serve` loads this; it is never part of the site build.
 *
 * Write "erro" in the chat to see how a failed reply looks.
 */

interface DemoReply {
  match: RegExp;
  text: string;
  products?: string[];
  suggestions?: string[];
  actions?: { label: string; href: string }[];
}

const NOTE = 'Resposta de demonstração: quando o servidor estiver ligado, quem responde é o assistente real.';

const REPLIES: DemoReply[] = [
  {
    match: /telem|celular|iphone|samsung|pixel|smartphone/i,
    text: 'Estes são alguns dos telemóveis que temos agora. Diga-me o orçamento ou para que o vai usar e eu afino a escolha.',
    products: ['39', '46', '51', '40'],
    suggestions: ['Até 60 000 MT', 'Para fotografia', 'Com a melhor bateria'],
  },
  {
    match: /pag|m-?pesa|e-?mola|mkesh|cart[aã]o|paypal/i,
    text: 'Pode pagar com M-Pesa, e-Mola, mKesh, cartão Visa ou Mastercard e PayPal. Escolhe o método no checkout.',
    suggestions: ['Fazem entregas fora de Maputo?', 'Procuro um telemóvel'],
  },
  {
    match: /entreg|prov[ií]ncia|envio|fora de maputo/i,
    text: 'Entregamos em Maputo e em todas as províncias. O custo e o prazo são calculados no checkout, de acordo com a morada.',
    suggestions: ['Que formas de pagamento aceitam?', 'Onde fica a loja?'],
  },
  {
    match: /loja|morada|onde fica|hor[aá]rio/i,
    text: 'A loja fica na Urbanização, em Maputo, e abre de segunda a sábado, das 8h às 18h.',
    actions: [{ label: 'Ver no mapa', href: '/contacto' }],
  },
];

const FALLBACK: Omit<DemoReply, 'match'> = {
  text: 'Ainda estou em demonstração, por isso só sei mostrar alguns exemplos. Experimente perguntar por um telemóvel, pelos pagamentos ou pelas entregas.',
  suggestions: ['Procuro um telemóvel', 'Que formas de pagamento aceitam?'],
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readBody = (req: IncomingMessage) =>
  new Promise<string>((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });

const handle = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end();
    return;
  }
  const request = JSON.parse((await readBody(req)) || '{}') as { messages?: { text: string }[] };
  const question = request.messages?.at(-1)?.text ?? '';
  await pause(700);

  if (/\berro\b/i.test(question)) {
    res.statusCode = 503;
    res.end();
    return;
  }

  const reply = REPLIES.find((item) => item.match.test(question)) ?? FALLBACK;
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  const send = (event: object) => res.write(`${JSON.stringify(event)}\n`);

  for (const word of `${reply.text}\n\n${NOTE}`.split(/(?<= )/)) {
    send({ type: 'text', delta: word });
    await pause(28);
  }
  if (reply.products) send({ type: 'products', ids: reply.products });
  reply.actions?.forEach((action) => send({ type: 'action', ...action }));
  if (reply.suggestions) send({ type: 'suggestions', items: reply.suggestions });
  send({ type: 'done' });
  res.end();
};

export const assistantMock = (): Plugin => ({
  name: 'rhulany-assistant-mock',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/assistant', (req, res) => {
      handle(req, res).catch(() => {
        res.statusCode = 500;
        res.end();
      });
    });
  },
});
