/*
 * Shop taxonomy: category → subcategories. Adding a brand or a new shelf is a data change only.
 * `image` ids are Unsplash photo ids (see lib/images). Products are attached to subcategories
 * in data/catalog/placements.ts, so one product can live on several shelves.
 */

export interface Subcategory {
  slug: string;
  name: string;
  /** Short line under the name on the subcategory page. */
  tagline: string;
  /** Optional cover; when absent the first product photo is used. */
  image?: string;
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    slug: 'celulares',
    name: 'Celulares',
    tagline: 'A tecnologia que cabe no bolso',
    description: 'Os topos de gama das marcas que importam, com garantia oficial e configuração na loja.',
    image: '1695048133142-1a20484d2569',
    subcategories: [
      { slug: 'iphone', name: 'iPhone', tagline: 'A geração mais recente, em titânio' },
      { slug: 'samsung', name: 'Samsung', tagline: 'Galaxy, com inteligência no ecrã e na câmara' },
      { slug: 'xiaomi', name: 'Xiaomi', tagline: 'Fotografia de topo, preço sensato' },
      { slug: 'google-pixel', name: 'Google Pixel', tagline: 'O Android como a Google o pensou' },
      { slug: 'oneplus', name: 'OnePlus', tagline: 'Rápido em tudo, do ecrã ao carregamento' },
    ],
  },
  {
    slug: 'computadores',
    name: 'Computadores',
    tagline: 'Para trabalhar, criar e jogar',
    description: 'Portáteis, desktops e componentes escolhidos para durar.',
    image: '1603302576837-37561b2e2302',
    subcategories: [
      { slug: 'mac', name: 'Mac', tagline: 'Desempenho Apple silicon' },
      { slug: 'windows', name: 'Windows', tagline: 'Liberdade para configurar' },
      { slug: 'portateis', name: 'Portáteis', tagline: 'Potência que viaja consigo' },
      { slug: 'pcs-gaming', name: 'PCs Gaming', tagline: 'Montados para jogar no máximo' },
      { slug: 'componentes', name: 'Componentes', tagline: 'Placas gráficas, processadores, memória e armazenamento' },
    ],
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    tagline: 'O seu setup, peça a peça',
    description: 'Consolas, PCs e monitores para jogar sem compromissos.',
    image: '1593305841991-05c297ba4575',
    subcategories: [
      { slug: 'playstation', name: 'PlayStation', tagline: 'A nova geração da Sony' },
      { slug: 'xbox', name: 'Xbox', tagline: 'Potência e Game Pass' },
      { slug: 'nintendo', name: 'Nintendo', tagline: 'Jogar em qualquer lugar' },
      { slug: 'portateis-de-jogo', name: 'Portáteis de jogo', tagline: 'A biblioteca do PC na mão' },
      { slug: 'pcs-gaming', name: 'PCs Gaming', tagline: 'Montados para jogar no máximo' },
      { slug: 'monitores-gaming', name: 'Monitores Gaming', tagline: 'Alta frequência, zero atraso' },
    ],
  },
  {
    slug: 'cameras',
    name: 'Câmaras',
    tagline: 'Para quem conta histórias com imagem',
    description: 'Mirrorless full-frame e APS-C, e câmaras de acção para aventura.',
    image: '1552233706-c3ff6a3da279',
    subcategories: [
      { slug: 'sony', name: 'Sony', tagline: 'Alpha, híbridas para foto e vídeo' },
      { slug: 'canon', name: 'Canon', tagline: 'EOS R, velocidade e cor' },
      { slug: 'nikon', name: 'Nikon', tagline: 'Série Z, ópticas de referência' },
      { slug: 'fujifilm', name: 'Fujifilm', tagline: 'Comandos clássicos, cor de filme' },
      { slug: 'camaras-de-accao', name: 'Câmaras de acção', tagline: 'À prova de água e de aventura' },
    ],
  },
  {
    slug: 'casa-inteligente',
    name: 'Casa Inteligente',
    tagline: 'Uma casa que responde',
    description: 'Câmaras, ecrãs, colunas e iluminação que se controlam pela voz ou pelo telemóvel.',
    image: '1650682009477-52fd77302b78',
    subcategories: [
      { slug: 'camaras-inteligentes', name: 'Câmaras inteligentes', tagline: 'Veja a casa de qualquer lugar' },
      { slug: 'ecras-inteligentes', name: 'Ecrãs inteligentes', tagline: 'A agenda e a casa num só ecrã' },
      { slug: 'colunas-inteligentes', name: 'Colunas inteligentes', tagline: 'Música e assistente de voz' },
      { slug: 'dispositivos', name: 'Dispositivos', tagline: 'Iluminação e automação' },
    ],
  },
  {
    slug: 'acessorios',
    name: 'Acessórios',
    tagline: 'Os detalhes que completam o setup',
    description: 'Áudio, teclados, ratos, carregamento e protecção.',
    image: '1572569511254-d8f925fe2cbb',
    subcategories: [
      { slug: 'auscultadores', name: 'Auscultadores', tagline: 'Som sem distracções' },
      { slug: 'teclados', name: 'Teclados', tagline: 'Escrever e jogar com precisão' },
      { slug: 'ratos', name: 'Ratos', tagline: 'Ergonomia e velocidade' },
      { slug: 'webcams', name: 'Webcams', tagline: 'Imagem nítida nas videochamadas' },
      { slug: 'carregadores', name: 'Carregadores', tagline: 'Mais potência, menos cabos' },
      { slug: 'hubs', name: 'Hubs', tagline: 'Todas as portas de que precisa' },
      { slug: 'capas', name: 'Capas', tagline: 'Protecção sem perder o design' },
    ],
  },
];
