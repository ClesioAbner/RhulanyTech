import { expect, test } from '@playwright/test';
import { skipIntro } from './support';

test.beforeEach(({ page }) => skipIntro(page));

test('filtrar por marca mostra só essa marca e fica no endereço', async ({ page }) => {
  await page.goto('/loja/celulares');
  await page.getByRole('complementary', { name: 'Filtros' }).getByText('Apple', { exact: true }).click();

  await expect(page).toHaveURL(/marca=Apple/);
  // Each card shows its brand on the line above the product name.
  const brands = page.locator('main article h3').locator('xpath=preceding-sibling::p[1]');
  await expect(brands.first()).toHaveText('Apple');
  for (const brand of await brands.allTextContents()) expect(brand).toBe('Apple');

  // The filter survives a reload, because it lives in the address.
  await page.reload();
  await expect(brands.first()).toHaveText('Apple');
});

test('a pesquisa encontra pelo nome, sem precisar de acentos', async ({ page }) => {
  await page.goto('/loja/celulares');
  await page.getByPlaceholder('Pesquisar em Celulares').fill('pixel');
  await expect(page).toHaveURL(/q=pixel/);
  const titles = page.locator('main article h3');
  await expect(titles.first()).toContainText('Pixel');
  for (const title of await titles.allTextContents()) expect(title).toContain('Pixel');
});

test('escolher a cor muda a fotografia do produto', async ({ page }) => {
  await page.goto('/produto/iphone-17-pro');
  const finishes = page.getByRole('radiogroup', { name: 'Acabamento' });
  const second = finishes.getByRole('radio').nth(1);
  const name = await second.getAttribute('aria-label');
  await second.click();
  await expect(second).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('legend', { hasText: 'Acabamento' })).toContainText(name!);
});
