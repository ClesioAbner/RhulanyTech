import { expect, test } from '@playwright/test';
import { skipIntro, watchErrors } from './support';

test.beforeEach(({ page }) => skipIntro(page));

test('compra completa com M-Pesa, até ao recibo em PDF', async ({ page }) => {
  const errors = watchErrors(page);

  // Product → cart
  await page.goto('/produto/iphone-17-pro');
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toContainText('iPhone 17 Pro');
  await page.goto('/checkout');

  // 1. Contact
  await page.getByLabel('Nome completo').fill('Ana Machava');
  await page.getByLabel('Email').fill('ana@exemplo.co.mz');
  await page.getByLabel('Telemóvel').fill('841234567');
  await page.getByRole('button', { name: 'Continuar para a entrega' }).click();

  // 2. Delivery: the address is required
  await page.getByRole('button', { name: 'Continuar para o pagamento' }).click();
  await expect(page.getByText('Indique o bairro')).toBeVisible();
  await page.getByLabel('Bairro').fill('Sommerschield');
  await page.getByLabel('Rua e número').fill('Av. Julius Nyerere, 1234');
  await page.getByLabel('Ponto de referência').fill('Perto da escola, prédio azul');
  await page.getByRole('button', { name: 'Continuar para o pagamento' }).click();

  // 3. Payment: a number from another network is refused, with the reason
  const number = page.getByLabel('Número M-Pesa');
  await number.fill('861234567');
  await page.getByRole('button', { name: /^Pagar/ }).click();
  await expect(page.getByText('O M-Pesa usa números Vodacom, começados por 84 ou 85')).toBeVisible();
  await number.fill('841234567');
  await page.getByRole('button', { name: /^Pagar/ }).click();

  // Confirmation, with a receipt to download
  await expect(page).toHaveURL(/\/encomenda\/RT\d{6}-\d{4}$/, { timeout: 15_000 });
  await expect(page.getByRole('heading', { name: /Obrigado, Ana/ })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descarregar recibo em PDF' }).click();
  expect((await download).suggestedFilename()).toMatch(/^Recibo RT\d{6}-\d{4}\.pdf$/);

  // The cart is empty again
  await page.goto('/cart');
  await expect(page.getByText('O seu carrinho está vazio')).toBeVisible();
  expect(errors).toEqual([]);
});

test('o cartão é validado antes de pagar', async ({ page }) => {
  await page.goto('/produto/iphone-17-pro');
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.goto('/checkout');
  await page.getByLabel('Nome completo').fill('Ana Machava');
  await page.getByLabel('Email').fill('ana@exemplo.co.mz');
  await page.getByLabel('Telemóvel').fill('841234567');
  await page.getByRole('button', { name: 'Continuar para a entrega' }).click();
  await page.getByRole('radio', { name: /Levantar na loja/ }).click();
  await page.getByRole('button', { name: 'Continuar para o pagamento' }).click();

  await page.getByRole('radio', { name: /Visa ou Mastercard/ }).click();
  await page.getByLabel('Número do cartão').fill('4242424242424241');
  await page.getByRole('button', { name: /^Pagar/ }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByLabel('Número do cartão')).toHaveAttribute('aria-invalid', 'true');
});
