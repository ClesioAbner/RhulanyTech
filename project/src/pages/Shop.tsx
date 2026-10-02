import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CATALOG,
  CATEGORIES,
  categoryPath,
  newArrivals,
  priceFrom,
  productPath,
  productsIn,
  resolveImage,
  sortProducts,
  type CatalogProduct,
} from '../lib/catalog';
import { formatPrice } from '../lib/format';
import { easeOutExpo } from '../lib/motion';
import { STORE } from '../data/store';
import CategoryStrip from '../components/shop/CategoryStrip';
import Shelf from '../components/shop/Shelf';
import ProductCard from '../components/product/ProductCard';

const NEW = newArrivals();
const POPULAR = sortProducts(CATALOG, 'destaque')
  .filter((product) => !NEW.includes(product))
  .slice(0, 10);
const GAMING = sortProducts(productsIn('gaming'), 'destaque').slice(0, 10);
const ACCESSORIES = sortProducts(productsIn('acessorios'), 'destaque').slice(0, 12);

const REASONS = [
  {
    title: 'Garantia oficial',
    body: 'Produtos originais, selados de fábrica, com a garantia do fabricante e assistência especializada.',
  },
  {
    title: 'Entrega em todo o país',
    body: 'Entregamos em Maputo e em todas as províncias, com acompanhamento até à sua porta.',
  },
  {
    title: 'Pague como preferir',
    body: 'M-Pesa, e-Mola, cartão ou PayPal. Escolha no checkout o método que lhe der mais jeito.',
    link: { to: '/#pagamentos', label: 'Ver métodos de pagamento' },
  },
  {
    title: 'Aconselhamento real',
    body: 'Uma equipa que usa o que vende e o ajuda a escolher a configuração certa.',
  },
];

const HELP = [
  {
    title: 'Fale connosco no WhatsApp',
    body: 'Tire dúvidas sobre um produto, peça um modelo que não encontra ou acompanhe a sua encomenda.',
    href: STORE.whatsappUrl,
    action: 'Abrir conversa',
  },
  {
    title: 'Prefere ligar',
    body: `${STORE.hours}. Do outro lado está alguém que conhece os produtos.`,
    href: STORE.phoneHref,
    action: STORE.phone,
  },
];

/** Larger card for launches: copy on top, contained photo below. */
const FeatureCard = ({ product }: { product: CatalogProduct }) => (
  <Link
    to={productPath(product)}
    className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-white transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgba(12,12,13,0.4)]"
  >
    <div className="px-6 pt-6 sm:px-7 sm:pt-7">
      <p className="text-xs font-medium text-[#b34700]">Novo</p>
      <h3 className="mt-2 font-display text-[1.6rem] font-medium leading-[1.05] tracking-tight">{product.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-snug text-ink/60">{product.summary}</p>
      <p className="mt-3 text-sm tabular-nums">
        {product.option && <span className="text-ink/50">Desde </span>}
        {formatPrice(priceFrom(product))}
      </p>
    </div>
    <div className="mt-auto p-3 pt-6">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
        <img
          src={resolveImage(product.primaryImage, 800)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
      </div>
    </div>
  </Link>
);

const TextCard = ({ title, body, children }: { title: string; body: string; children?: ReactNode }) => (
  <div className="flex h-full flex-col rounded-[24px] bg-white p-6 sm:p-7">
    <h3 className="font-display text-xl font-medium leading-snug tracking-tight">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-ink/60">{body}</p>
    {children && <div className="mt-auto pt-6">{children}</div>}
  </div>
);

/** /loja: the shop's front door, organised as a visual index and a sequence of shelves. */
const Shop = () => (
  <div className="pb-28 lg:pb-36">
    <header className="container-site flex flex-col gap-6 pt-12 lg:flex-row lg:items-end lg:justify-between lg:pt-16">
      <h1 className="max-w-4xl overflow-hidden pb-[0.08em] font-display text-[2.5rem] font-medium leading-[1.04] tracking-tightest [text-wrap:balance] sm:text-5xl lg:text-[3.5rem]">
        <motion.span
          className="block"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: easeOutExpo }}
        >
          Loja <span className="text-ink/40">A forma mais simples de comprar tecnologia original</span>
        </motion.span>
      </h1>
      <motion.p
        className="max-w-[17rem] text-sm leading-relaxed text-ink/60 lg:pb-3 lg:text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Precisa de ajuda para escolher?{' '}
        <a href={STORE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-ink">
          Fale com um especialista
        </a>
      </motion.p>
    </header>

    <div className="mt-10 lg:mt-14">
      <CategoryStrip
        label="Categorias"
        items={CATEGORIES.map((category) => ({
          key: category.slug,
          to: categoryPath(category.slug),
          label: category.name,
          image: resolveImage(category.image, 360),
          meta: `${productsIn(category.slug).length} produtos`,
        }))}
      />
    </div>

    <Shelf
      id="novidades"
      className="mt-14 lg:mt-16"
      title="As novidades"
      lead="Os lançamentos mais recentes, já disponíveis na loja"
      itemClassName="w-[78vw] sm:w-[340px]"
    >
      {NEW.map((product) => (
        <FeatureCard key={product.id} product={product} />
      ))}
    </Shelf>

    <Shelf id="mais-procurados" title="Os mais procurados" lead="Os favoritos de quem já comprou connosco">
      {POPULAR.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Shelf>

    <Shelf id="diferenca" title="A diferença Rhulany Tech" lead="Mais razões para comprar connosco" itemClassName="w-[78vw] sm:w-[320px]">
      {REASONS.map((reason) => (
        <TextCard key={reason.title} title={reason.title} body={reason.body}>
          {reason.link && (
            <Link to={reason.link.to} className="link-underline text-sm font-medium">
              {reason.link.label}
            </Link>
          )}
        </TextCard>
      ))}
    </Shelf>

    <Shelf
      id="gaming"
      title="Gaming"
      lead="Consolas, comandos e monitores para jogar sem compromissos"
      link={{ to: categoryPath('gaming'), label: 'Ver tudo em Gaming' }}
    >
      {GAMING.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Shelf>

    <Shelf
      id="acessorios"
      title="Acessórios essenciais"
      lead="Os detalhes que completam o setup"
      link={{ to: categoryPath('acessorios'), label: 'Ver todos os acessórios' }}
    >
      {ACCESSORIES.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Shelf>

    <Shelf id="ajuda" title="Ajuda na compra" lead="Fale com quem percebe do assunto" itemClassName="w-[78vw] sm:w-[380px]">
      {HELP.map((item) => (
        <TextCard key={item.title} title={item.title} body={item.body}>
          <a
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            {item.action}
          </a>
        </TextCard>
      ))}
    </Shelf>
  </div>
);

export default Shop;
