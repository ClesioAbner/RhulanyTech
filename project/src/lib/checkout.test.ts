import { describe, expect, it } from 'vitest';
import type { Order } from '../stores/orderStore';
import {
  cardBrand,
  deliveryLine,
  formatCardNumber,
  formatExpiry,
  formatMobile,
  isMobile,
  isValidCardNumber,
  isValidExpiry,
  isWallet,
  localNumber,
  maskMobile,
  newOrderNumber,
  walletError,
} from './checkout';

describe('telemóveis moçambicanos', () => {
  it('tira o indicativo +258 e formata em 84 123 4567', () => {
    expect(localNumber('+258 84 123 4567')).toBe('841234567');
    expect(formatMobile('841234567')).toBe('84 123 4567');
    expect(formatMobile('+258841234567')).toBe('84 123 4567');
  });

  it('aceita só números de 9 dígitos começados por 82 a 87', () => {
    expect(isMobile('84 123 4567')).toBe(true);
    expect(isMobile('821234567')).toBe(true);
    expect(isMobile('881234567')).toBe(false);
    expect(isMobile('84123456')).toBe(false);
  });

  it('esconde o número no recibo', () => {
    expect(maskMobile('841234567')).toBe('84 ••• 4567');
  });
});

describe('carteiras móveis', () => {
  it.each([
    ['mpesa', '841234567'],
    ['mpesa', '851234567'],
    ['emola', '861234567'],
    ['emola', '871234567'],
    ['mkesh', '821234567'],
    ['mkesh', '831234567'],
  ] as const)('%s aceita %s', (wallet, number) => {
    expect(walletError(wallet, number)).toBeUndefined();
  });

  it('recusa números de outra rede, a explicar qual é a certa', () => {
    expect(walletError('mpesa', '861234567')).toBe('O M-Pesa usa números Vodacom, começados por 84 ou 85');
    expect(walletError('emola', '841234567')).toBe('O e-Mola usa números Movitel, começados por 86 ou 87');
    expect(walletError('mkesh', '841234567')).toBe('O mKesh usa números Tmcel, começados por 82 ou 83');
  });

  it('pede os 9 dígitos quando o número está incompleto', () => {
    expect(walletError('mpesa', '84123')).toBe('Indique os 9 dígitos do número');
  });

  it('distingue carteiras de outros métodos', () => {
    expect(isWallet('mkesh')).toBe(true);
    expect(isWallet('card')).toBe(false);
    expect(isWallet('paypal')).toBe(false);
  });
});

describe('cartões', () => {
  it('valida o número com o algoritmo de Luhn', () => {
    expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true);
    expect(isValidCardNumber('4111111111111111')).toBe(true);
    expect(isValidCardNumber('4242424242424241')).toBe(false);
    expect(isValidCardNumber('4242')).toBe(false);
  });

  it('reconhece a marca pelos primeiros dígitos', () => {
    expect(cardBrand('4242')).toBe('Visa');
    expect(cardBrand('5555')).toBe('Mastercard');
    expect(cardBrand('2221')).toBe('Mastercard');
    expect(cardBrand('3782')).toBeNull();
  });

  it('formata o número em grupos de 4 e a validade em MM/AA', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatExpiry('1228')).toBe('12/28');
  });

  it('aceita a validade até ao último dia do mês', () => {
    const today = new Date(2026, 9, 7);
    expect(isValidExpiry('10/26', today)).toBe(true);
    expect(isValidExpiry('09/26', today)).toBe(false);
    expect(isValidExpiry('13/30', today)).toBe(false);
  });
});

describe('encomendas', () => {
  it('numera as encomendas como RTaammdd-xxxx', () => {
    expect(newOrderNumber(new Date(2026, 9, 7))).toMatch(/^RT261007-\d{4}$/);
  });

  it('descreve a entrega numa linha', () => {
    const base = { delivery: {} } as Order;
    expect(deliveryLine({ ...base, delivery: { method: 'levantamento' } })).toBe('Levantamento na loja, Urbanização, Maputo');
    expect(
      deliveryLine({
        ...base,
        delivery: {
          method: 'entrega',
          street: 'Av. Julius Nyerere, 1234',
          neighbourhood: 'Sommerschield',
          city: 'Maputo',
          province: 'Maputo Cidade',
        },
      }),
    ).toBe('Av. Julius Nyerere, 1234, Sommerschield, Maputo, Maputo Cidade');
  });
});
