/*
 * Blog: care guides for the equipment we sell, plus frequent questions.
 * Bodies are structured blocks so the article page controls the typography.
 * `cover` and image `src` are Unsplash ids; `products` are catalogue ids shown under the article.
 */

export type BlogTopic = 'telemoveis' | 'computadores' | 'gaming' | 'camaras' | 'audio' | 'energia';

export const BLOG_TOPICS: { id: BlogTopic; label: string }[] = [
  { id: 'telemoveis', label: 'Telemóveis' },
  { id: 'computadores', label: 'Computadores' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'camaras', label: 'Câmaras' },
  { id: 'audio', label: 'Áudio' },
  { id: 'energia', label: 'Energia' },
];

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'tip'; title: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  topic: BlogTopic;
  /** ISO date of publication. */
  date: string;
  cover: { src: string; alt: string };
  /** Key points, shown as the article's summary. */
  summary: string[];
  body: ArticleBlock[];
  products?: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'como-cuidar-da-bateria-do-telemovel',
    title: 'Como cuidar da bateria do telemóvel',
    excerpt: 'O que gasta a bateria mais depressa e os hábitos que a fazem durar mais anos',
    topic: 'telemoveis',
    date: '2026-09-24',
    cover: { src: '1557767382-97b28f5488e7', alt: 'Telemóvel a carregar com o cabo ligado, sobre uma superfície escura' },
    summary: [
      'O calor desgasta a bateria mais do que qualquer outro factor.',
      'Cargas entre 20% e 80% são as mais saudáveis. Active o carregamento optimizado.',
      'Use carregadores certificados, de preferência USB-C Power Delivery.',
      'Para guardar o telemóvel durante meses, deixe a bateria nos 50% e o aparelho desligado.',
    ],
    body: [
      {
        type: 'p',
        text: 'As baterias de iões de lítio desgastam-se com o uso: cada ciclo de carga reduz um pouco a capacidade máxima. Não é possível evitar esse desgaste, mas é possível abrandá-lo muito. E em Maputo, onde o calor aperta boa parte do ano, a temperatura é o factor que mais pesa.',
      },
      { type: 'h2', id: 'calor', text: 'O calor é o maior inimigo' },
      {
        type: 'p',
        text: 'A bateria funciona melhor entre os 16 e os 22 °C e, acima dos 35 °C, envelhece de forma acelerada. Deixar o telemóvel ao sol no tablier do carro ou a carregar debaixo da almofada são dois dos hábitos mais prejudiciais.',
      },
      {
        type: 'list',
        items: [
          'Não deixe o telemóvel dentro do carro estacionado ao sol.',
          'Retire capas grossas durante o carregamento rápido, sobretudo se notar que aquece.',
          'Evite jogar ou gravar vídeo em 4K enquanto carrega.',
          'Carregue sobre uma superfície dura e arejada, não na cama nem no sofá.',
        ],
      },
      { type: 'h2', id: 'carga', text: 'Entre 20% e 80%, sempre que possível' },
      {
        type: 'p',
        text: 'Não é preciso esperar que a bateria chegue a zero, nem mantê-la sempre nos 100%. As cargas parciais são as mais saudáveis. Os iPhone recentes e muitos Android têm carregamento optimizado: aprendem a sua rotina e terminam a carga pouco antes da hora a que costuma acordar.',
      },
      {
        type: 'tip',
        title: 'Onde activar',
        text: 'No iPhone, em Definições, Bateria. Nos Samsung, em Definições, Bateria, Protecção da bateria. Noutros Android procure por carregamento adaptável. Os nomes podem variar com a versão do sistema.',
      },
      { type: 'h2', id: 'carregadores', text: 'Use carregadores certificados' },
      {
        type: 'p',
        text: 'Um carregador barato sem certificação pode entregar uma tensão instável, aquecer mais e, nos piores casos, danificar o circuito de carga. Prefira o carregador do fabricante ou marcas reconhecidas com USB-C Power Delivery. A potência a mais não faz mal: o telemóvel só pede a corrente de que precisa.',
      },
      { type: 'h2', id: 'guardar', text: 'Se vai guardar um telemóvel durante meses' },
      {
        type: 'p',
        text: 'Deixe a bateria por volta dos 50%, desligue o aparelho e guarde-o num local fresco e seco. Uma bateria guardada a 0% pode entrar em descarga profunda e deixar de carregar; guardada a 100% perde capacidade mais depressa.',
      },
      { type: 'h2', id: 'trocar', text: 'Quando trocar a bateria' },
      {
        type: 'p',
        text: 'Quando a capacidade máxima desce abaixo dos 80%, a autonomia nota-se e o telemóvel pode ficar mais lento nos momentos de maior esforço. Se a bateria inchar, aquecer de forma anormal ou o ecrã começar a levantar, deixe de usar o aparelho e procure assistência técnica.',
      },
    ],
    products: ['35', '88', '89', '90'],
  },
  {
    slug: 'limpar-o-portatil-sem-o-danificar',
    title: 'Limpar o portátil sem o danificar',
    excerpt: 'Ecrã, teclado e entradas de ar, com os produtos certos e os que nunca deve usar',
    topic: 'computadores',
    date: '2026-09-17',
    cover: { src: '1692645214212-ea7fdb37ca6d', alt: 'Mão a limpar o ecrã de um portátil com um pano de microfibra' },
    summary: [
      'Desligue o portátil por completo e retire o carregador antes de limpar.',
      'Ecrã: pano de microfibra seco ou ligeiramente humedecido, nunca produto directamente no vidro.',
      'Teclado e grelhas: ar comprimido em jactos curtos.',
      'Use-o em superfícies duras para não tapar as entradas de ar.',
    ],
    body: [
      {
        type: 'p',
        text: 'O pó nas entradas de ar obriga a ventoinha a trabalhar mais e o processador a aquecer. A gordura do teclado e do trackpad acaba por se infiltrar. Uma limpeza leve de quinze em quinze dias resolve quase tudo.',
      },
      { type: 'h2', id: 'antes', text: 'Antes de começar' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Desligue o portátil por completo, não apenas em suspensão.',
          'Retire o carregador e todos os acessórios.',
          'Tenha à mão um pano de microfibra limpo, um pincel macio e, se possível, ar comprimido.',
        ],
      },
      { type: 'h2', id: 'ecra', text: 'O ecrã' },
      {
        type: 'p',
        text: 'Passe o pano de microfibra seco em movimentos suaves, sem pressionar. Para marcas persistentes, humedeça ligeiramente o pano com água destilada ou álcool isopropílico a 70%, nunca o ecrã directamente. Evite limpa-vidros, lixívia, acetona e papel de cozinha, que riscam e estragam o revestimento anti-reflexo.',
      },
      { type: 'h2', id: 'teclado', text: 'Teclado e trackpad' },
      {
        type: 'p',
        text: 'Incline o portátil e use ar comprimido em pequenos jactos para soltar migalhas e pó entre as teclas. Depois limpe as teclas com o pano ligeiramente humedecido em álcool isopropílico. No trackpad, o mesmo pano chega.',
      },
      {
        type: 'tip',
        title: 'Atenção aos líquidos',
        text: 'Nunca borrife produto directamente sobre o teclado. O líquido escorre entre as teclas e pode chegar à placa principal.',
      },
      { type: 'h2', id: 'ventilacao', text: 'Entradas de ar e ventoinha' },
      {
        type: 'p',
        text: 'Com o portátil desligado, use ar comprimido nas grelhas em jactos curtos, sem virar a lata ao contrário. Se a ventoinha estiver sempre em esforço ou o portátil aquecer muito em tarefas simples, pode ser altura de uma limpeza interior feita por um técnico.',
      },
      { type: 'h2', id: 'dia-a-dia', text: 'No dia-a-dia' },
      {
        type: 'list',
        items: [
          'Use o portátil em superfícies duras; almofadas e cobertores tapam as entradas de ar.',
          'Não coma por cima do teclado.',
          'Antes de fechar a tampa, confirme que não ficou nada sobre o teclado, como canetas ou auriculares.',
          'Transporte-o numa capa ou mochila acolchoada.',
        ],
      },
    ],
    products: ['83', '85', '36', '14'],
  },
  {
    slug: 'calor-e-po-como-proteger-a-consola',
    title: 'Como proteger a consola do calor e do pó',
    excerpt: 'Onde a colocar, como a limpar e os sinais de que algo não está bem',
    topic: 'gaming',
    date: '2026-09-09',
    cover: { src: '1731405858377-6de0070d8d65', alt: 'PlayStation 5 Slim com comando DualSense numa mesa de madeira' },
    summary: [
      'Deixe pelo menos 10 cm livres à volta da consola e evite móveis fechados.',
      'Uma vez por mês, aspire ou escove as entradas de ar com a consola desligada.',
      'Perto do mar, afaste-a de janelas e de humidade.',
      'Ruído fora do normal ou desligamentos sozinhos pedem uma verificação.',
    ],
    body: [
      {
        type: 'p',
        text: 'Uma consola actual é um computador potente num corpo pequeno. Numa sessão longa aquece bastante, e a ventoinha precisa de espaço para tirar esse calor. Quando o ar não circula, a consola fica mais ruidosa e, com o tempo, os componentes sofrem.',
      },
      { type: 'h2', id: 'espaco', text: 'Dê-lhe espaço' },
      {
        type: 'list',
        items: [
          'Deixe pelo menos 10 cm livres à volta da consola, sobretudo atrás e nos lados por onde sai o ar.',
          'Evite móveis fechados e prateleiras estreitas.',
          'Não a coloque em cima de outros aparelhos que aquecem, como o descodificador ou o amplificador.',
          'Na vertical ou na horizontal, use a base ou os pés indicados pelo fabricante.',
        ],
      },
      { type: 'h2', id: 'po', text: 'O pó acumula-se mais depressa do que pensa' },
      {
        type: 'p',
        text: 'Em casas perto da estrada ou com as janelas abertas, o pó entra rapidamente nas grelhas. Uma vez por mês, com a consola desligada da tomada, passe um pincel macio ou um aspirador em potência baixa pelas entradas de ar. Alguns modelos da PlayStation 5 têm ainda orifícios de recolha de pó, acessíveis ao retirar as tampas laterais.',
      },
      { type: 'h2', id: 'humidade', text: 'Humidade e maresia' },
      {
        type: 'p',
        text: 'Perto do mar, o ar húmido e salgado acelera a corrosão de contactos e conectores. Mantenha a consola longe de janelas abertas e de aparelhos de ar condicionado que pinguem, e não a ligue logo depois de a trazer de um ambiente frio para um quente, para evitar condensação.',
      },
      { type: 'h2', id: 'comandos', text: 'Comandos' },
      {
        type: 'p',
        text: 'Limpe os comandos com um pano ligeiramente humedecido em álcool isopropílico e use ar comprimido à volta dos botões e dos manípulos. Se não os for usar durante semanas, guarde-os com cerca de metade da carga.',
      },
      {
        type: 'tip',
        title: 'Sinal de alerta',
        text: 'Se a ventoinha passar a fazer muito mais barulho do que o normal ou a consola se desligar sozinha, desligue-a e peça uma verificação. Na maioria dos casos é pó acumulado no interior.',
      },
    ],
    products: ['67', '68', '70', '71'],
  },
  {
    slug: 'cortes-de-energia-e-picos-de-tensao',
    title: 'Cortes de energia: como proteger os equipamentos',
    excerpt: 'Protector contra sobretensões, UPS e o que fazer quando a luz volta',
    topic: 'energia',
    date: '2026-08-28',
    cover: { src: '1788497079207-68aab17ff15c', alt: 'Tomada com protecção contra sobretensões numa secretária clara' },
    summary: [
      'O regresso da corrente, com picos de tensão, é o momento de maior risco.',
      'Ligue computador, monitor, consola e router a um protector contra sobretensões.',
      'Uma UPS dá tempo para guardar o trabalho e desligar em segurança.',
      'Em trovoadas fortes, desligue os aparelhos da tomada.',
    ],
    body: [
      {
        type: 'p',
        text: 'Os cortes de energia são incómodos, mas o que mais danifica os equipamentos é muitas vezes o regresso da corrente, acompanhado de picos de tensão. Fontes de alimentação, routers, televisores e computadores de secretária são os mais expostos.',
      },
      { type: 'h2', id: 'protector', text: 'Use um protector contra sobretensões' },
      {
        type: 'p',
        text: 'Uma extensão comum apenas distribui a corrente; um protector contra sobretensões absorve os picos antes de chegarem aos aparelhos. Ligue-lhe o computador, o monitor, a consola e o router. Na embalagem, confirme a capacidade de absorção, indicada em joules: quanto mais alta, melhor.',
      },
      { type: 'h2', id: 'ups', text: 'Quando vale a pena uma UPS' },
      {
        type: 'p',
        text: 'Uma UPS, ou unidade de alimentação ininterrupta, mantém o equipamento ligado durante alguns minutos após um corte, o tempo suficiente para guardar o trabalho e desligar em segurança. É especialmente útil em computadores de secretária, discos de rede e routers, que não têm bateria própria.',
      },
      { type: 'h2', id: 'regresso', text: 'Quando a luz volta' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Durante o corte, desligue da tomada os aparelhos mais sensíveis.',
          'Quando a energia voltar, espere alguns minutos até a tensão estabilizar.',
          'Volte a ligar um aparelho de cada vez.',
        ],
      },
      { type: 'h2', id: 'trovoada', text: 'Em dia de trovoada' },
      {
        type: 'p',
        text: 'Uma descarga eléctrica próxima pode provocar picos que nenhum protector doméstico trava por completo. Durante trovoadas fortes, desligue da tomada o computador, a televisão e o router, incluindo o cabo de antena ou de rede.',
      },
      {
        type: 'tip',
        title: 'Portáteis e telemóveis',
        text: 'Têm bateria e ficam mais protegidos, mas o carregador continua exposto. Ligue-o também ao protector contra sobretensões.',
      },
    ],
    products: ['89', '35'],
  },
  {
    slug: 'guia-de-limpeza-para-a-camara',
    title: 'Como limpar a lente e o sensor da câmara',
    excerpt: 'Os passos certos, pela ordem certa, e como evitar fungos com a humidade',
    topic: 'camaras',
    date: '2026-08-14',
    cover: { src: '1759647516042-7ab902682d9c', alt: 'Mãos a limpar a lente de uma câmara com um pano' },
    summary: [
      'Comece sempre pela pêra de ar, depois o pincel, e só no fim o pano.',
      'A limpeza manual do sensor é delicada; se as manchas persistirem, prefira um técnico.',
      'Em clima húmido, guarde o equipamento com sílica gel para evitar fungos.',
      'Troque de lente em local abrigado, com a câmara virada para baixo.',
    ],
    body: [
      {
        type: 'p',
        text: 'Uma lente suja tira contraste às fotografias e cria reflexos em contraluz. O pó no sensor aparece como pequenas manchas escuras no céu e em fundos lisos, sobretudo com o diafragma fechado. Quase tudo se resolve com três ferramentas simples.',
      },
      { type: 'h2', id: 'kit', text: 'O kit essencial' },
      {
        type: 'list',
        items: [
          'Uma pêra de ar, para soprar o pó sem tocar no vidro.',
          'Um pincel macio próprio para óptica.',
          'Panos de microfibra limpos e líquido de limpeza para lentes.',
        ],
      },
      { type: 'h2', id: 'lente', text: 'Limpar a lente pela ordem certa' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Sopre com a pêra de ar para retirar as partículas soltas.',
          'Passe o pincel suavemente, do centro para as margens.',
          'Só então use o pano com uma ou duas gotas de líquido, em movimentos circulares e sem pressão.',
        ],
      },
      {
        type: 'p',
        text: 'Nunca comece pelo pano: um grão de areia arrastado pelo vidro pode riscar o revestimento da lente.',
      },
      {
        type: 'image',
        src: '1641556965043-5065273ad792',
        alt: 'Objectivas, líquido de limpeza e toalhetes para lentes sobre uma mesa',
        caption: 'Pêra de ar, pincel e panos próprios: o essencial para limpar lentes em segurança',
      },
      { type: 'h2', id: 'sensor', text: 'O sensor exige mais cuidado' },
      {
        type: 'p',
        text: 'Use a função de limpeza do sensor, presente na maioria das câmaras mirrorless, e depois a pêra de ar com a câmara virada para baixo. Se as manchas persistirem, a limpeza com espátulas e líquido próprio é delicada e um erro pode riscar o filtro do sensor. Nesse caso, prefira um técnico.',
      },
      { type: 'h2', id: 'humidade', text: 'Humidade e fungos' },
      {
        type: 'p',
        text: 'Em climas quentes e húmidos, podem crescer fungos no interior das lentes guardadas durante muito tempo. Guarde o equipamento numa mochila ou caixa com saquetas de sílica gel, troque-as regularmente e use as lentes com frequência: a luz e a circulação de ar ajudam a prevenir o problema.',
      },
      {
        type: 'tip',
        title: 'Trocar de lente',
        text: 'Faça-o num local abrigado do vento, com a câmara desligada e virada para baixo, e deixe o corpo sem objectiva o menor tempo possível.',
      },
    ],
    products: ['74', '27', '75', '76'],
  },
  {
    slug: 'auscultadores-higiene-e-cuidados',
    title: 'Como cuidar dos auscultadores',
    excerpt: 'Almofadas, bateria e actualizações para manterem o som e o conforto do primeiro dia',
    topic: 'audio',
    date: '2026-07-30',
    cover: { src: '1755719401938-35c1b24f6d15', alt: 'Auscultadores Sony pretos ao lado de uns óculos sobre fundo claro' },
    summary: [
      'Limpe as almofadas todas as semanas com água e sabão neutro, sem álcool.',
      'Evite descargas completas frequentes e o calor do carro.',
      'Use sempre o estojo para transportar.',
      'Mantenha o firmware actualizado através da aplicação do fabricante.',
    ],
    body: [
      {
        type: 'p',
        text: 'Os auscultadores passam horas encostados à pele e apanham suor, calor e chapas cheias. Com alguns cuidados simples, mantêm o som e o conforto durante anos.',
      },
      { type: 'h2', id: 'almofadas', text: 'Almofadas e arco' },
      {
        type: 'p',
        text: 'Limpe as almofadas uma vez por semana com um pano ligeiramente humedecido em água e sabão neutro e seque com um pano macio. Evite álcool nas almofadas de pele sintética, que acabam por estalar. Muitos modelos, como os AirPods Max e os Sony WH-1000XM5, permitem trocar as almofadas quando ficam gastas.',
      },
      { type: 'h2', id: 'bateria', text: 'Bateria' },
      {
        type: 'list',
        items: [
          'Evite deixá-los descarregar por completo com frequência.',
          'Não os deixe ao sol nem dentro do carro.',
          'Se não os for usar durante semanas, guarde-os com cerca de metade da carga.',
        ],
      },
      { type: 'h2', id: 'transportar', text: 'Guardar e transportar' },
      {
        type: 'p',
        text: 'Use sempre o estojo. Dobrar os auscultadores da forma errada ou levá-los soltos na mochila é a causa mais comum de articulações partidas.',
      },
      { type: 'h2', id: 'firmware', text: 'Mantenha o firmware actualizado' },
      {
        type: 'p',
        text: 'As actualizações corrigem falhas de ligação, melhoram o cancelamento de ruído e, por vezes, a autonomia. Nos AirPods acontecem automaticamente com o iPhone por perto; nas outras marcas, use a aplicação do fabricante.',
      },
      {
        type: 'tip',
        title: 'Auriculares in-ear',
        text: 'Limpe as grelhas com um pincel seco e macio. Nunca use objectos pontiagudos nem água: a cera acumulada é a principal causa de som abafado.',
      },
    ],
    products: ['81', '80', '82', '34'],
  },
  {
    slug: 'pelicula-e-capa-o-que-protege-o-telemovel',
    title: 'Película e capa: o que protege mesmo o telemóvel',
    excerpt: 'Vidro temperado ou plástico, capa fina ou reforçada, e o que evita mesmo um ecrã partido',
    topic: 'telemoveis',
    date: '2026-07-16',
    cover: { src: '1636589150123-6d57c10527ce', alt: 'Telemóvel branco com o canto do ecrã partido sobre fundo branco' },
    summary: [
      'Vidro temperado absorve o impacto; o plástico só evita riscos.',
      'Numa capa, o que mais importa são as quinas reforçadas e a borda elevada.',
      'Com MagSafe, escolha capas com ímanes integrados.',
      'Aplique a película num espaço sem pó nem correntes de ar.',
    ],
    body: [
      {
        type: 'p',
        text: 'O ecrã partido é a reparação que mais vemos e uma das mais caras. Uma boa película e uma boa capa custam muito menos, mas nem todas protegem da mesma forma.',
      },
      { type: 'h2', id: 'pelicula', text: 'Película: vidro temperado' },
      {
        type: 'p',
        text: 'As películas de vidro temperado absorvem o impacto e partem-se no lugar do ecrã. As de plástico evitam riscos, mas pouco fazem numa queda. Prefira vidro temperado com boa cobertura das margens e compatível com a capa que vai usar.',
      },
      { type: 'h2', id: 'capa', text: 'Capa: as quinas são o que importa' },
      {
        type: 'p',
        text: 'A maioria das quedas atinge primeiro uma quina. Uma boa capa tem quinas reforçadas e uma borda ligeiramente elevada à volta do ecrã e das câmaras, para que o vidro não toque no chão quando o telemóvel cai virado para baixo.',
      },
      {
        type: 'list',
        items: [
          'Silicone: agradável ao toque e com boa aderência, protege bem das quedas do dia-a-dia.',
          'Transparente: mostra a cor do telemóvel; escolha uma com tratamento contra o amarelecimento.',
          'Reforçada: para obras, desporto ou trabalho no exterior.',
        ],
      },
      { type: 'h2', id: 'magsafe', text: 'MagSafe e carregamento sem fios' },
      {
        type: 'p',
        text: 'Se usa carregadores MagSafe ou acessórios magnéticos, escolha capas com ímanes integrados. Capas grossas sem ímanes enfraquecem a ligação e fazem o telemóvel aquecer mais durante a carga sem fios.',
      },
      { type: 'h2', id: 'camaras', text: 'Proteger as câmaras' },
      {
        type: 'p',
        text: 'As lentes das câmaras sobressaem cada vez mais. Uma capa com rebordo elevado à volta do módulo resolve a maioria dos casos. Os protectores individuais de lente são úteis, desde que sejam de vidro e fiquem bem alinhados, para não afectarem as fotografias.',
      },
      {
        type: 'tip',
        title: 'Antes de aplicar a película',
        text: 'Limpe o ecrã com o pano incluído, retire o pó com o autocolante próprio e aplique-a num espaço sem correntes de ar, como a casa de banho depois de um duche quente.',
      },
    ],
    products: ['90', '37', '88'],
  },
  {
    slug: 'copias-de-seguranca-sem-complicacoes',
    title: 'Cópias de segurança sem complicações',
    excerpt: 'A regra 3-2-1 aplicada ao telemóvel e ao computador, em dez minutos',
    topic: 'computadores',
    date: '2026-07-02',
    cover: { src: '1518547606470-00ac2ae882af', alt: 'Disco SSD portátil Samsung na palma da mão' },
    summary: [
      'Três cópias, em dois suportes diferentes, uma delas fora de casa.',
      'No telemóvel, active a cópia na nuvem e a sincronização das fotografias.',
      'No computador, Time Machine no Mac ou Histórico de Ficheiros no Windows.',
      'Teste a recuperação de um ficheiro uma vez por mês.',
    ],
    body: [
      {
        type: 'p',
        text: 'Um telemóvel perdido, um disco avariado ou um ficheiro apagado por engano podem levar anos de fotografias e de trabalho. Hoje quase tudo se pode copiar de forma automática, basta configurar uma vez.',
      },
      { type: 'h2', id: 'regra', text: 'A regra 3-2-1' },
      {
        type: 'list',
        items: [
          'Três cópias dos dados importantes: o original e mais duas.',
          'Dois suportes diferentes, por exemplo o computador e um disco externo.',
          'Uma cópia fora de casa, normalmente na nuvem.',
        ],
      },
      { type: 'h2', id: 'telemovel', text: 'No telemóvel' },
      {
        type: 'p',
        text: 'No iPhone, active a cópia em Definições, o seu nome, iCloud, e ligue também a sincronização das Fotografias. No Android, a cópia de segurança do Google e o Google Fotos guardam contactos, definições e imagens. Se o espaço gratuito não chegar, um plano pago de armazenamento costuma resolver para toda a família.',
      },
      { type: 'h2', id: 'computador', text: 'No computador' },
      {
        type: 'p',
        text: 'No Mac, o Time Machine faz cópias automáticas para um disco externo a cada hora. No Windows, use o Histórico de Ficheiros ou a Cópia de Segurança do Windows. Um SSD externo é mais rápido e resiste melhor a quedas do que um disco mecânico.',
      },
      { type: 'h2', id: 'testar', text: 'Teste as suas cópias' },
      {
        type: 'p',
        text: 'Uma cópia que nunca foi testada não garante nada. Uma vez por mês, recupere um ficheiro qualquer: se funcionar, sabe que está protegido.',
      },
      {
        type: 'tip',
        title: 'Antes de trocar de telemóvel',
        text: 'Faça uma cópia completa e confirme que as conversas do WhatsApp também estão incluídas, em Definições, Conversas, Cópia de segurança. Na loja ajudamos a passar tudo para o aparelho novo.',
      },
    ],
    products: ['57', '54', '22'],
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQ: Faq[] = [
  {
    q: 'Os produtos são originais e têm garantia?',
    a: 'Sim. Vendemos apenas produtos originais, selados de fábrica, com a garantia do fabricante. O período de garantia de cada produto está indicado na respectiva página.',
  },
  {
    q: 'Entregam fora de Maputo?',
    a: 'Sim, entregamos em Maputo e em todas as províncias. O custo e o prazo de entrega são calculados no checkout, de acordo com a morada.',
  },
  {
    q: 'Que métodos de pagamento aceitam?',
    a: 'M-Pesa, e-Mola, cartão Visa ou Mastercard e PayPal. Escolhe o método no checkout.',
  },
  {
    q: 'Podem encomendar um produto que não encontro na loja?',
    a: 'Sim. Envie-nos o modelo pelo WhatsApp ou pelo formulário de contacto e indicamos a disponibilidade e o preço.',
  },
  {
    q: 'Ajudam a configurar o equipamento novo?',
    a: 'Sim. Na loja ajudamos a configurar o equipamento e a passar os seus dados do aparelho antigo para o novo.',
  },
  {
    q: 'O telemóvel aquece quando carrega. É normal?',
    a: 'Algum calor é normal, sobretudo no carregamento rápido. Se aquecer ao ponto de incomodar ao toque, retire a capa, carregue numa superfície arejada e use um carregador certificado. Se continuar, fale connosco.',
  },
  {
    q: 'Devo deixar o portátil sempre ligado à corrente?',
    a: 'Os portáteis modernos gerem a carga, mas mantê-la sempre nos 100% desgasta a bateria mais depressa. Active a protecção da bateria do fabricante, que limita a carga quando o portátil passa muito tempo ligado à corrente.',
  },
  {
    q: 'O que faço se o equipamento apanhar água?',
    a: 'Desligue-o de imediato, não o carregue e não use secador. Esqueça o arroz: não retira a humidade do interior. Seque o exterior com um pano e traga-o para avaliação o mais depressa possível.',
  },
];

// ---------- Helpers ----------

const WORDS_PER_MINUTE = 200;

export const readingMinutes = (article: Article) => {
  const words = article.body
    .map((block) => {
      if (block.type === 'list') return block.items.join(' ');
      if (block.type === 'image') return block.caption ?? '';
      if (block.type === 'tip') return `${block.title} ${block.text}`;
      return block.text;
    })
    .join(' ')
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / WORDS_PER_MINUTE));
};

export const getArticle = (slug?: string) => ARTICLES.find((article) => article.slug === slug);
export const topicLabel = (topic: BlogTopic) => BLOG_TOPICS.find((item) => item.id === topic)?.label ?? '';

const dateFormatter = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
export const formatArticleDate = (iso: string) => dateFormatter.format(new Date(`${iso}T12:00:00`));
