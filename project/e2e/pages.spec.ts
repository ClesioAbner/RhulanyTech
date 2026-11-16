import { expect, test } from '@playwright/test';
import { skipIntro, watchErrors } from './support';

// Every page opens straight from its address (as from a shared link) and runs without errors.
const PAGES: { path: string; check: (page: import('@playwright/test').Page) => Promise<void> }[] = [
  { path: '/', check: (page) => expect(page.getByRole('link', { name: 'Entrar na loja' }).first()).toBeVisible() },
  { path: '/loja', check: (page) => expect(page.getByPlaceholder('Pesquisar na loja')).toBeVisible() },
  { path: '/loja/celulares', check: (page) => expect(page.getByRole('heading', { level: 1, name: 'Celulares' })).toBeVisible() },
  { path: '/produto/iphone-17-pro', check: (page) => expect(page).toHaveTitle('iPhone 17 Pro | Rhulany Tech') },
  { path: '/cart', check: (page) => expect(page.getByText('O seu carrinho está vazio')).toBeVisible() },
  { path: '/blog', check: (page) => expect(page).toHaveTitle('Blog | Rhulany Tech') },
  {
    path: '/blog/como-reconhecer-burlas-por-sms-e-whatsapp',
    check: (page) => expect(page.getByRole('heading', { level: 1 })).toContainText('burlas'),
  },
  {
    path: '/sobre',
    check: (page) =>
      expect(page.getByRole('heading', { level: 1 })).toHaveText('Tecnologia original, de Maputo para todo o país', {
        useInnerText: true,
      }),
  },
  { path: '/contacto', check: (page) => expect(page.getByRole('heading', { level: 1 })).toHaveText('Fale connosco') },
  { path: '/entrar', check: (page) => expect(page.getByText('Bem-vindo de volta')).toBeVisible() },
];

test.beforeEach(({ page }) => skipIntro(page));

for (const { path, check } of PAGES) {
  test(`abre ${path} sem erros`, async ({ page }) => {
    const errors = watchErrors(page);
    // The page itself, not every outside photo and video, which can be slow to arrive.
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await check(page);
    expect(errors).toEqual([]);
  });
}

test('endereços antigos levam à página nova', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveURL(/\/sobre$/);
});
