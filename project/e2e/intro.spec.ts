import { expect, test } from '@playwright/test';

type Opening = { intro: boolean; boot: boolean };

test('a introdução passa na primeira visita e não se repete na mesma sessão', async ({ page }) => {
  // Notes how the page looked as it opened. Looking afterwards would race the intro itself, which
  // can be over before the test gets to it on a busy machine.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as Window & { opening?: Opening }).opening = {
        intro: document.documentElement.classList.contains('rt-intro'),
        boot: Boolean(document.getElementById('boot')),
      };
    });
  });
  const opening = () => page.evaluate(() => (window as Window & { opening?: Opening }).opening);

  await page.goto('/');
  expect(await opening()).toEqual({ intro: true, boot: true });
  await expect(page.locator('#boot')).toHaveCount(0, { timeout: 6_000 });
  await expect(page.locator('html')).not.toHaveClass(/rt-intro/);
  await expect(page.getByRole('link', { name: 'Entrar na loja' }).first()).toBeVisible();

  await page.reload();
  expect(await opening()).toEqual({ intro: false, boot: true });
  await expect(page.locator('#boot')).toHaveCount(0, { timeout: 3_000 });
});
