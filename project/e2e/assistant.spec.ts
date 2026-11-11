import { expect, test } from '@playwright/test';
import { skipIntro } from './support';

// The chat talks to /api/assistant (switched on by the e2e build); the tests play the backend.
const streamed = (events: object[]) => ({
  status: 200,
  contentType: 'application/x-ndjson',
  body: events.map((event) => JSON.stringify(event)).join('\n'),
});

test.beforeEach(({ page }) => skipIntro(page));

test('pergunta, recebe produtos e continua com uma sugestão', async ({ page }) => {
  const requests: { messages: { text: string }[]; context: { path: string } }[] = [];
  await page.route('**/api/assistant', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill(
      streamed([
        { type: 'text', delta: 'Temos estes ' },
        { type: 'text', delta: 'telemóveis.' },
        { type: 'products', ids: ['39', '46'] },
        { type: 'suggestions', items: ['Até 60 000 MT'] },
        { type: 'done' },
      ]),
    );
  });

  await page.goto('/loja');
  await page.getByRole('button', { name: 'Abrir o assistente' }).click();
  const chat = page.getByRole('dialog', { name: 'Assistente da Rhulany Tech' });
  await chat.getByRole('button', { name: 'Procuro um telemóvel' }).click();

  await expect(chat.getByText('Temos estes telemóveis.')).toBeVisible();
  await expect(chat.getByRole('link', { name: /iPhone 17 Pro/ })).toBeVisible();
  await expect(chat.getByRole('link', { name: /Galaxy S25 Ultra/ })).toBeVisible();
  expect(requests[0].messages.at(-1)?.text).toBe('Procuro um telemóvel');
  expect(requests[0].context.path).toBe('/loja');

  await chat.getByRole('button', { name: 'Até 60 000 MT' }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].messages.map((message) => message.text)).toEqual([
    'Procuro um telemóvel',
    'Temos estes telemóveis.',
    'Até 60 000 MT',
  ]);
});

test('quando o servidor falha, deixa tentar de novo', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/assistant', (route) =>
    ++calls === 1
      ? route.fulfill({ status: 503 })
      : route.fulfill(streamed([{ type: 'text', delta: 'Já estou de volta.' }, { type: 'done' }])),
  );

  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir o assistente' }).click();
  const chat = page.getByRole('dialog', { name: 'Assistente da Rhulany Tech' });
  await chat.getByLabel('Mensagem para o assistente').fill('Onde fica a loja?');
  await chat.getByLabel('Mensagem para o assistente').press('Enter');

  await expect(chat.getByText('Não consegui responder agora.')).toBeVisible();
  await chat.getByRole('button', { name: 'Tentar de novo' }).click();
  await expect(chat.getByText('Já estou de volta.')).toBeVisible();
});

test('a conversa continua ao mudar de página e fecha com Esc', async ({ page }) => {
  await page.route('**/api/assistant', (route) => route.fulfill(streamed([{ type: 'text', delta: 'Olá!' }, { type: 'done' }])));
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir o assistente' }).click();
  const chat = page.getByRole('dialog', { name: 'Assistente da Rhulany Tech' });
  await chat.getByRole('button', { name: 'Onde fica a loja?' }).click();
  await expect(chat.getByText('Olá!')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(chat).toBeHidden();
  await page.getByRole('link', { name: 'Blog' }).first().click();
  await page.getByRole('button', { name: 'Abrir o assistente' }).click();
  await expect(chat.getByText('Olá!')).toBeVisible();
});

test('não aparece no checkout', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.getByRole('button', { name: 'Abrir o assistente' })).toHaveCount(0);
});
