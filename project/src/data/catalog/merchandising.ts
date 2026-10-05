/*
 * Presentation data layered on top of data/products.ts (which other features also read).
 * Everything here is optional per product; lib/catalog.ts fills sensible defaults.
 *
 * Photography: `gallery` lists one entry per real angle. Only list angles you actually have a
 * distinct photo for; the gallery hides the rest instead of repeating one image. To swap in
 * professional shots later, replace the `src` values (a full URL or an Unsplash id).
 */

export type GalleryAngle = 'frente' | 'traseira' | 'lateral' | 'tres-quartos' | 'camara' | 'detalhe' | 'ambiente';

export interface GalleryView {
  angle: GalleryAngle;
  /** Unsplash id or full URL. Omit when `model` renders this angle. */
  src?: string;
  alt: string;
}

export interface Finish {
  name: string;
  /** Swatch colour. */
  hex: string;
  /** For 3D models: frame (metal) and back glass tints. */
  model?: { frame: string; back: string };
  /**
   * Photos of this exact colour (Unsplash ids or URLs), hero first. When any finish of a product has
   * photos, the gallery follows the selected colour and colours without photos are not offered.
   */
  images?: string[];
}

export interface OptionChoice {
  label: string;
  /** Added to the base price. */
  priceDelta: number;
}

export interface Highlight {
  title: string;
  body: string;
}

export interface Merchandising {
  summary?: string;
  /** Longer description shown on the product page. */
  overview?: string;
  finishes?: Finish[];
  option?: { name: string; choices: OptionChoice[] };
  gallery?: GalleryView[];
  /** Renders the gallery with the real-time 3D model (angles become camera presets). */
  scene3d?: 'iphone-pro';
  highlights?: Highlight[];
}

// Swatches for colour names used across the catalogue.
export const COLOR_SWATCHES: Record<string, string> = {
  'Titânio Deserto': '#bfa98c',
  'Titânio Natural': '#b8b3aa',
  'Titânio Branco': '#e6e4df',
  'Titânio Preto': '#3a3a3c',
  'Phantom Black': '#26262a',
  'Phantom Silver': '#d8d9dc',
  'Phantom Violet': '#8f83b5',
  Obsidian: '#2b2c2e',
  Porcelain: '#ece6dc',
  Bay: '#8fb5d6',
  'Flowy Emerald': '#2f6b5c',
  'Silky Black': '#1f1f21',
  Black: '#1d1d1f',
  White: '#f2f2f0',
  'Space Gray': '#5b5c60',
  Silver: '#d6d7d9',
  'Platinum Silver': '#d4d5d7',
  Graphite: '#4a4b4f',
  'Lunar Light': '#e7e7e9',
  'Dark Side of the Moon': '#2a2b2e',
  'Matte Black': '#232325',
  'Neon Red/Blue': '#e0475d',
  'Pale Gray': '#c9cacd',
  Rose: '#e2b7b0',
  'Black/Silver': '#2d2e31',
  Preto: '#1d1d1f',
  Prateado: '#cfd0d2',
  Branco: '#f2f2f0',
  'Meia-noite': '#2b2d33',
  Carvão: '#3b3c3f',
  Giz: '#ecebe6',
  'Azul-ardósia': '#53637a',
  Pedra: '#bdb5aa',
};

export const MERCHANDISING: Record<string, Merchandising> = {
  '1': {
    summary: 'Titânio, chip A18 Pro e o maior ecrã de sempre num iPhone',
    scene3d: 'iphone-pro',
    finishes: [
      { name: 'Titânio Deserto', hex: '#bfa98c', model: { frame: '#bba98f', back: '#cdbca4' }, images: ['/images/produtos/iphone-16-pro-max-deserto'] },
      { name: 'Titânio Natural', hex: '#b8b3aa', model: { frame: '#b5b0a6', back: '#c9c5bd' }, images: ['/images/produtos/iphone-16-pro-max-natural'] },
      { name: 'Titânio Branco', hex: '#e6e4df', model: { frame: '#d9d6d0', back: '#eeece8' }, images: ['/images/produtos/iphone-16-pro-max-branco'] },
      { name: 'Titânio Preto', hex: '#3a3a3c', model: { frame: '#4a4a4d', back: '#2f2f31' }, images: ['/images/produtos/iphone-16-pro-max-preto'] },
    ],
    option: {
      name: 'Armazenamento',
      choices: [
        { label: '256GB', priceDelta: 0 },
        { label: '512GB', priceDelta: 25000 },
        { label: '1TB', priceDelta: 50000 },
      ],
    },
    gallery: [
      { angle: 'frente', alt: 'iPhone 16 Pro Max visto de frente' },
      { angle: 'traseira', alt: 'Traseira do iPhone 16 Pro Max' },
      { angle: 'lateral', alt: 'Lateral em titânio com os botões' },
      { angle: 'tres-quartos', alt: 'iPhone 16 Pro Max em perspectiva de três quartos' },
      { angle: 'camara', alt: 'Detalhe do sistema de câmaras' },
      { angle: 'ambiente', src: '1726587912121-ea21fcc57ff8', alt: 'iPhone 16 Pro em Titânio Deserto, frente e traseira' },
    ],
    highlights: [
      { title: 'Chip A18 Pro', body: 'Mais rápido e mais eficiente, para jogos exigentes, edição de vídeo e o dia inteiro de bateria.' },
      { title: 'Câmara Fusion de 48MP', body: 'Fotografias com detalhe extraordinário e teleobjectiva de 5x para chegar mais perto.' },
      { title: 'Ecrã de 6,9 polegadas', body: 'Super Retina XDR com ProMotion até 120 Hz e margens mais finas do que nunca.' },
      { title: 'Controlo da Câmara', body: 'Um botão dedicado para abrir a câmara, fotografar e ajustar o zoom com um gesto.' },
      { title: 'Design em titânio', body: 'Leve, resistente e com acabamentos que envelhecem bem.' },
      { title: 'USB-C', body: 'Um só cabo para carregar o iPhone, o Mac e os acessórios.' },
    ],
  },
  '2': {
    summary: 'Galaxy AI, caneta S Pen integrada e zoom de 100x',
    finishes: [
      { name: 'Titanium Gray', hex: '#8c8b88', images: ['/images/produtos/galaxy-s24-ultra-gray'] },
      { name: 'Titanium Violet', hex: '#6f6679', images: ['/images/produtos/galaxy-s24-ultra-violet'] },
      { name: 'Titanium Black', hex: '#2e2f31', images: ['/images/produtos/galaxy-s24-ultra-black'] },
      { name: 'Titanium Yellow', hex: '#e2d6a8', images: ['/images/produtos/galaxy-s24-ultra-yellow'] },
    ],
    option: {
      name: 'Armazenamento',
      choices: [
        { label: '512GB', priceDelta: 0 },
        { label: '1TB', priceDelta: 20000 },
      ],
    },
  },
  '3': {
    summary: 'A melhor câmara Pixel com as funcionalidades de IA da Google',
    finishes: [
      { name: 'Obsidian', hex: '#2b2c2e', images: ['/images/produtos/pixel-8-pro-obsidian', '1697355360151-2866de32ad4d', '1706412703794-d944cd3625b3'] },
    ],
  },
  '4': {
    summary: 'Snapdragon 8 Gen 3 e carregamento de 80W',
    finishes: [
      { name: 'Flowy Emerald', hex: '#2f6b5c', images: ['/images/produtos/oneplus-12-emerald', '1655384851782-89b0e119ab55'] },
      { name: 'Silky Black', hex: '#232425', images: ['/images/produtos/oneplus-12-black'] },
    ],
  },
  '5': {
    summary: 'Câmara Leica com sensor de uma polegada',
    finishes: [
      { name: 'Azul', hex: '#5d7fa3', images: ['/images/produtos/xiaomi-14-ultra-azul', '1770274813875-346bfaf0ee11'] },
      { name: 'Preto', hex: '#262729', images: ['/images/produtos/xiaomi-14-ultra-preto'] },
      { name: 'Branco', hex: '#ececea', images: ['/images/produtos/xiaomi-14-ultra-branco'] },
    ],
  },
  '6': {
    summary: 'M3 Max, até 22 horas de bateria e ecrã Liquid Retina XDR',
    finishes: [
      { name: 'Preto sideral', hex: '#2e2f33', images: ['1517336714731-489689fd1ca8'] },
    ],
    option: {
      name: 'Memória unificada',
      choices: [
        { label: '64GB', priceDelta: 0 },
        { label: '128GB', priceDelta: 60000 },
      ],
    },
  },
  '8': {
    summary: 'Ecrã 4K de 17 polegadas para criadores',
    finishes: [
      { name: 'Platinum Silver', hex: '#d4d5d7', images: ['1593642632559-0c6d3fc62b89'] },
    ],
  },
  '9': {
    summary: 'Desktop gaming com refrigeração líquida e RTX',
    finishes: [
      { name: 'Dark Side of the Moon', hex: '#2a2b2e', images: ['1587202372634-32705e3bf49c', '1587831990711-23ca6441447b'] },
    ],
  },
  '10': { summary: 'Mais potência, ray tracing avançado e 2TB de armazenamento' },
  '11': { summary: 'A Xbox mais potente, com 1TB e 4K a 120 fps' },
  '12': {
    summary: 'Ecrã OLED de 7 polegadas, em casa ou fora dela',
    finishes: [
      { name: 'Neon Red/Blue', hex: '#e0475d', images: ['1578303512597-81e6cc155b3e'] },
    ],
  },
  '13': { summary: 'A biblioteca Steam num portátil com ecrã HDR OLED' },
  '24': { summary: 'Full-frame de 33MP para foto e vídeo 4K' },
  '25': { summary: 'Rajadas de 40 fps e excelente com pouca luz' },
  '26': { summary: 'Vídeo 6K interno e visor de referência' },
  '27': {
    summary: '40MP e simulações de filme num corpo clássico',
    finishes: [
      { name: 'Prateado', hex: '#cfd0d2', images: ['1653272540691-4c99012227ae'] },
      { name: 'Preto', hex: '#1d1d1f', images: ['1610825469504-242e3b7069e1'] },
    ],
  },
  '28': { summary: 'Vídeo 5.3K, à prova de água e estabilizada' },
  '29': {
    summary: 'Som espacial e centro de controlo da casa',
    finishes: [
      { name: 'Branco', hex: '#f2f2f0', images: ['1586078875290-c22eb791ad5d'] },
      { name: 'Meia-noite', hex: '#2b2d33', images: ['1529359744902-86b2ab9edaea'] },
    ],
  },
  '30': {
    summary: 'Assistente Google e música, em formato compacto',
    finishes: [
      { name: 'Carvão', hex: '#3b3c3f', images: ['1519558260268-cde7e03a0152'] },
    ],
  },
  '31': {
    summary: 'A agenda, a casa e as fotografias num ecrã de 7"',
    finishes: [
      { name: 'Carvão', hex: '#3b3c3f', images: ['1650682009477-52fd77302b78'] },
    ],
  },
  '32': { summary: 'Câmara 2K de interior com rotação de 360°' },
  '33': { summary: 'Luz branca regulável, controlada pela voz' },
  '34': { summary: 'Cancelamento de ruído activo e caixa USB-C' },
  '35': { summary: '70 W para portátil, telemóvel e auriculares' },
  '36': { summary: 'Sete portas com interruptores individuais' },
  '37': {
    summary: 'Silicone suave com ímanes MagSafe',
    finishes: [
      { name: 'Azul-ardósia', hex: '#53637a', images: ['1711033312367-247626a984d1'] },
    ],
  },
  '14': {
    finishes: [
      { name: 'Graphite', hex: '#4a4b4f', images: ['1647755814392-fd071a3fcb4b', '1625750319971-ee4b61e68df8'] },
      { name: 'Pale Gray', hex: '#c9cacd', images: ['1586349906319-48d20e9d17e5'] },
    ],
  },
  '15': {
    finishes: [
      { name: 'Black', hex: '#1d1d1f', images: ['1615663245857-ac93bb7c39e7'] },
    ],
  },
  '17': {
    finishes: [
      { name: 'Black', hex: '#1d1d1f', images: ['1679533662345-b321cf2d8792', '1548030415-e1eb1c684c9b'] },
    ],
  },
};
