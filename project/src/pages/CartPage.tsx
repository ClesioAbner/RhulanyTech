import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { complementaryProducts, newArrivals, type CatalogProduct } from '../lib/catalog';
import { itemCountLabel, toCartLine, whatsappOrderUrl } from '../lib/cart';
import { easeOutExpo } from '../lib/motion';
import { useCartStore } from '../stores/cartStore';
import CartLineItem from '../components/cart/CartLineItem';
import RollingPrice from '../components/cart/RollingPrice';
import ProductCard from '../components/product/ProductCard';
import Shelf from '../components/shop/Shelf';
import CheckoutProgress from '../components/checkout/CheckoutProgress';

const ASSURANCES = [
  { title: 'Garantia oficial', body: 'Produtos originais, selados, com a garantia do fabricante.' },
  { title: 'Entrega em todo o país', body: 'Maputo e todas as províncias, com acompanhamento até à porta.' },
  { title: 'Ajuda quando precisar', body: 'Uma equipa que conhece os produtos, antes e depois da compra.' },
];

/** /cart: the full review of the order before checkout. */
const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const lines = useMemo(() => items.map(toCartLine), [items]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const suggestions = useMemo(() => {
    const products = lines.map((line) => line.product).filter((p): p is CatalogProduct => Boolean(p));
    return products.length ? complementaryProducts(products, 10) : newArrivals();
  }, [lines]);

  useEffect(() => {
    document.title = 'Carrinho | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, []);

  if (!lines.length) {
    return (
      <div className="pb-28 lg:pb-36">
        <div className="container-site pt-16 text-center lg:pt-24">
          <motion.h1
            className="type-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            O seu carrinho está vazio
          </motion.h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/60">
            Os produtos que juntar ficam guardados aqui, neste dispositivo, até decidir
          </p>
          <Link
            to="/loja"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            Continuar a comprar
          </Link>
        </div>
        <Shelf id="novidades-carrinho" title="As novidades" lead="Comece pelo que acabou de chegar">
          {suggestions.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Shelf>
      </div>
    );
  }

  return (
    <div className="pb-28 lg:pb-36">
      <header className="container-site flex flex-col gap-6 pt-8 lg:flex-row lg:items-end lg:justify-between lg:pt-12">
        <div>
          <h1 className="type-display">Carrinho</h1>
          <p className="type-lead mt-2 text-ink/55">
            {itemCountLabel(count)}, <RollingPrice value={total} className="align-bottom text-ink" />
          </p>
        </div>
        <CheckoutProgress current={0} />
      </header>

      <div className="container-site mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-10">
        <ul className="space-y-3 lg:col-span-7">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.li
                key={line.id}
                layout
                exit={{ opacity: 0, height: 0, transition: { duration: 0.35, ease: easeOutExpo } }}
                className="overflow-hidden rounded-[28px] bg-white"
              >
                <div className="p-5 sm:p-7">
                  <CartLineItem line={line} size="full" />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="lg:col-span-5" aria-label="Resumo da encomenda">
          <div className="rounded-[28px] bg-white p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="type-heading">Resumo</h2>
            <dl className="mt-6 space-y-3 rounded-2xl bg-paper p-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/60">Subtotal, {itemCountLabel(count)}</dt>
                <dd>
                  <RollingPrice value={total} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/60">Entrega</dt>
                <dd className="text-right text-ink/60">Grátis na loja, ou a confirmar</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-2">
                <dt className="text-base font-medium">Total</dt>
                <dd className="text-xl font-medium">
                  <RollingPrice value={total} />
                </dd>
              </div>
            </dl>

            <Link
              to="/checkout"
              className="mt-6 grid h-14 place-items-center rounded-full bg-ink text-sm font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-ink-soft active:scale-[0.98]"
            >
              Finalizar compra
            </Link>
            <a
              href={whatsappOrderUrl(items, total)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 grid h-14 place-items-center rounded-full bg-paper text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              Encomendar pelo WhatsApp
            </a>
            <p className="mt-3 text-center text-xs leading-relaxed text-ink/45">
              A mensagem já leva a lista do carrinho, só tem de a enviar
            </p>

            <p className="mt-6 text-center text-sm text-ink/55">
              Pague com M-Pesa, e-Mola, cartão ou PayPal{' '}
              <Link to="/#pagamentos" className="link-underline text-ink">
                Saber mais
              </Link>
            </p>
          </div>

          <ul className="mt-8 space-y-5 px-2">
            {ASSURANCES.map((item) => (
              <li key={item.title} className="text-sm">
                <p className="font-medium">{item.title}</p>
                <p className="mt-0.5 text-ink/55">{item.body}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Mobile: the summary sits below the list, so the total and checkout stay within reach */}
      <div className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-full border border-ink/10 bg-paper/90 py-2 pl-5 pr-2 shadow-[0_20px_40px_-20px_rgba(12,12,13,0.4)] backdrop-blur-xl lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink/55">Total, {itemCountLabel(count)}</p>
          <RollingPrice value={total} className="text-sm font-medium" />
        </div>
        <Link to="/checkout" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper">
          Finalizar compra
        </Link>
      </div>

      {suggestions.length > 0 && (
        <Shelf id="combina-carrinho" title="Combina bem com" lead="Acessórios que completam a sua encomenda">
          {suggestions.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Shelf>
      )}
    </div>
  );
};

export default CartPage;
