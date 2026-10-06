export const PAYMENT_METHODS = [
  {
    name: 'M-Pesa',
    title: 'Pague com o PIN, em segundos',
    body: 'Escolha M-Pesa no checkout, indique o seu número e confirme com o PIN no telemóvel. O pagamento entra na hora e a encomenda segue para preparação.',
  },
  {
    name: 'e-Mola',
    title: 'Directo da sua carteira Movitel',
    body: 'Recebe o pedido de pagamento no telemóvel, aprova e pronto. Sem cartões, sem filas, com o recibo enviado de imediato.',
  },
  {
    name: 'mKesh',
    title: 'A carteira da Tmcel',
    body: 'Escolha mKesh no checkout, indique o seu número Tmcel e aprove o pedido no telemóvel. O pagamento fica feito na hora, sem sair de casa.',
  },
  {
    name: 'Visa e Mastercard',
    title: 'Cartões nacionais e internacionais',
    body: 'Débito ou crédito, com pagamento processado de forma segura. Ideal para compras maiores ou para quem prefere o cartão de sempre.',
  },
  {
    name: 'PayPal',
    title: 'Para quem compra de fora',
    body: 'Família ou amigos no estrangeiro podem pagar com PayPal na própria moeda, e nós entregamos em Moçambique.',
  },
];

/** Index of the card method: the phone hands out a physical card while it is on screen. */
export const CARD_METHOD_INDEX = PAYMENT_METHODS.findIndex((method) => method.name === 'Visa e Mastercard');
