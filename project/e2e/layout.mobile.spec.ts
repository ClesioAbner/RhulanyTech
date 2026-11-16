import { expect, test } from '@playwright/test';
import { skipIntro, watchErrors } from './support';

test.beforeEach(({ page }) => skipIntro(page));

test('no telemóvel, os botões de compra têm altura cheia e o chat nunca os tapa', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/produto/iphone-17-pro');
  const add = page.getByRole('button', { name: 'Adicionar ao carrinho' });
  await add.scrollIntoViewIfNeeded();

  const box = await add.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(52);
  // While the purchase buttons are on screen, the chat button steps aside.
  await expect(page.getByRole('button', { name: 'Abrir o assistente' })).toHaveCount(0);

  // Further down, the buy bar appears. The chat button stays out of the way while scrolling down,
  // comes back on the way up, and sits above the bar.
  await page.evaluate(() => window.scrollBy(0, 2500));
  const bar = page.locator('[data-buy-bar]');
  await expect(bar).toBeVisible();
  const launcher = page.getByRole('button', { name: 'Abrir o assistente' });
  await expect(launcher).toHaveCount(0);
  await page.evaluate(() => window.scrollBy(0, -150));
  await expect(launcher).toBeVisible();
  await expect
    .poll(async () => {
      const [chat, buy] = await Promise.all([launcher.boundingBox(), bar.boundingBox()]);
      return chat && buy ? chat.y + chat.height <= buy.y : false;
    })
    .toBe(true);
  expect(errors).toEqual([]);
});

test('no telemóvel, o chat ocupa o ecrã inteiro', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir o assistente' }).click();
  const chat = page.getByRole('dialog', { name: 'Assistente da Rhulany Tech' });
  const viewport = page.viewportSize()!;
  await expect.poll(async () => (await chat.boundingBox())?.width).toBe(viewport.width);
  await page.getByRole('button', { name: 'Fechar o assistente' }).click();
  await expect(chat).toBeHidden();
});

test('no telemóvel, o menu fica à esquerda do logo e leva à página escolhida', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Abrir o menu' });
  const logo = page.getByRole('link', { name: 'Rhulany Tech, página inicial' }).first();
  const [menuBox, logoBox] = await Promise.all([button.boundingBox(), logo.boundingBox()]);
  expect(menuBox!.x).toBeLessThan(logoBox!.x);

  await button.click();
  const menu = page.getByRole('navigation', { name: 'Menu móvel' });
  await menu.getByRole('link', { name: 'Blog' }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(menu).toBeHidden();
});
