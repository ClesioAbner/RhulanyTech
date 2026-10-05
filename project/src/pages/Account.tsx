import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PROVINCES, formatMobile, formatOrderDate, isMobile, localNumber, orderPath, paymentName } from '../lib/checkout';
import { resolveImage } from '../lib/catalog';
import { formatPrice } from '../lib/format';
import { easeOutExpo } from '../lib/motion';
import { useCartStore } from '../stores/cartStore';
import { useCartUi } from '../stores/cartUi';
import { ORDER_STEPS, useOrderStore, type Order } from '../stores/orderStore';
import { useUserStore } from '../stores/userStore';
import { SelectField, TextField } from '../components/ui/Field';
import ProductImage from '../components/product/ProductImage';

type Tab = 'encomendas' | 'dados';

const TABS: { id: Tab; label: string }[] = [
  { id: 'encomendas', label: 'Encomendas' },
  { id: 'dados', label: 'Dados e morada' },
];

const statusLabel = (order: Order) => ORDER_STEPS.find((step) => step.id === order.status)?.label ?? '';

const OrderCard = ({ order, onBuyAgain }: { order: Order; onBuyAgain: (order: Order) => void }) => {
  const count = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  return (
    <article className="rounded-[28px] bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg font-medium tabular-nums tracking-tight">{order.number}</p>
          <p className="mt-1 text-sm text-ink/50">{formatOrderDate(order.createdAt)}</p>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
          {statusLabel(order)}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        {order.lines.slice(0, 4).map((line) => (
          <span key={line.id} className="stage relative h-16 w-16 overflow-hidden rounded-2xl">
            <ProductImage src={resolveImage(line.image, 200)} alt={line.title} inset="p-[9%]" />
          </span>
        ))}
        {order.lines.length > 4 && <span className="text-sm text-ink/45">+{order.lines.length - 4}</span>}
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-ink/55">
          {count} {count === 1 ? 'artigo' : 'artigos'}, {paymentName(order.payment.method)}
          <span className="mt-1 block text-lg font-medium tabular-nums text-ink">{formatPrice(order.subtotal)}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onBuyAgain(order)}
            className="h-11 rounded-full bg-paper px-5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
          >
            Comprar de novo
          </button>
          <Link to={orderPath(order)} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft">
            Ver recibo
          </Link>
        </div>
      </div>
    </article>
  );
};

/** /conta */
const Account = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout } = useUserStore();
  const allOrders = useOrderStore((state) => state.orders);
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartUi((state) => state.open);
  const [tab, setTab] = useState<Tab>('encomendas');

  const [form, setForm] = useState({ name: '', phone: '', province: 'Maputo Cidade', city: 'Maputo', neighbourhood: '', street: '', reference: '' });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    document.title = 'A minha conta | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setForm({
      name: currentUser.name,
      phone: currentUser.phone ? formatMobile(currentUser.phone) : '',
      province: currentUser.savedAddress?.province ?? 'Maputo Cidade',
      city: currentUser.savedAddress?.city ?? 'Maputo',
      neighbourhood: currentUser.savedAddress?.neighbourhood ?? '',
      street: currentUser.savedAddress?.street ?? '',
      reference: currentUser.savedAddress?.reference ?? '',
    });
  }, [currentUser]);

  const orders = useMemo(
    () => allOrders.filter((order) => order.userId === currentUser?.id || order.customer.email.toLowerCase() === currentUser?.email.toLowerCase()),
    [allOrders, currentUser],
  );

  if (!currentUser) return <Navigate to="/entrar?voltar=/conta" replace />;

  const buyAgain = (order: Order) => {
    order.lines.forEach((line) =>
      addToCart({ id: line.id, name: line.name, price: line.price, image: line.image, quantity: line.quantity }),
    );
    openCart(order.lines[0]?.id);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const found = {
      name: form.name.trim().length < 2 ? 'Indique o seu nome' : undefined,
      phone: form.phone && !isMobile(form.phone) ? 'Indique um número de telemóvel moçambicano' : undefined,
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    updateProfile({
      name: form.name.trim(),
      phone: form.phone ? localNumber(form.phone) : '',
      savedAddress: {
        province: form.province,
        city: form.city.trim(),
        neighbourhood: form.neighbourhood.trim(),
        street: form.street.trim(),
        reference: form.reference.trim(),
      },
    });
    toast('Dados guardados');
  };

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container-site pb-28 pt-8 lg:pb-36 lg:pt-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-ink/45">A minha conta</p>
          <h1 className="type-display mt-3">Olá, {currentUser.name.split(' ')[0]}</h1>
          <p className="mt-2 text-sm text-ink/55">{currentUser.email}</p>
        </div>
        <button type="button" onClick={signOut} className="h-11 self-start rounded-full bg-white px-5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper sm:self-auto">
          Terminar sessão
        </button>
      </header>

      <div role="tablist" aria-label="Secções da conta" className="mt-10 inline-flex rounded-full bg-white p-1">
        {TABS.map((item) => {
          const isActive = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={`relative isolate h-10 rounded-full px-5 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-paper' : 'text-ink/55 hover:text-ink'}`}
            >
              {isActive && <motion.span layoutId="conta-tab" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ duration: 0.4, ease: easeOutExpo }} />}
              {item.label}
              {item.id === 'encomendas' && orders.length > 0 && <span className={`ml-2 tabular-nums ${isActive ? 'text-paper/60' : 'text-ink/35'}`}>{orders.length}</span>}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: easeOutExpo }}
        >
          {tab === 'encomendas' ? (
            orders.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {orders.map((order) => (
                  <OrderCard key={order.number} order={order} onBuyAgain={buyAgain} />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] bg-white px-6 py-16 text-center">
                <p className="type-heading">Ainda não tem encomendas</p>
                <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">Quando comprar, as encomendas e os recibos aparecem aqui</p>
                <Link to="/loja" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
                  Ir para a loja
                </Link>
              </div>
            )
          ) : (
            <form noValidate onSubmit={save} className="max-w-3xl space-y-8">
              <section className="rounded-[28px] bg-white p-6 sm:p-8">
                <h2 className="type-heading">Dados pessoais</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <TextField label="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} error={errors.name} autoComplete="name" />
                  <TextField
                    label="Telemóvel"
                    leading="+258"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: formatMobile(event.target.value) })}
                    error={errors.phone}
                    placeholder="84 123 4567"
                  />
                  <TextField label="Email" value={currentUser.email} disabled wrapperClassName="sm:col-span-2" hint="O email identifica a sua conta" />
                </div>
              </section>
              <section className="rounded-[28px] bg-white p-6 sm:p-8">
                <h2 className="type-heading">Morada de entrega</h2>
                <p className="mt-1.5 text-sm text-ink/55">Preenchida automaticamente na próxima compra</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <SelectField label="Província" value={form.province} onChange={(event) => setForm({ ...form, province: event.target.value })}>
                    {PROVINCES.map((province) => (
                      <option key={province}>{province}</option>
                    ))}
                  </SelectField>
                  <TextField label="Cidade ou distrito" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
                  <TextField label="Bairro" value={form.neighbourhood} onChange={(event) => setForm({ ...form, neighbourhood: event.target.value })} />
                  <TextField label="Rua e número" optional value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} />
                  <TextField
                    label="Ponto de referência"
                    wrapperClassName="sm:col-span-2"
                    value={form.reference}
                    onChange={(event) => setForm({ ...form, reference: event.target.value })}
                    placeholder="Perto da escola, prédio azul, segundo andar"
                  />
                </div>
              </section>
              <button type="submit" className="h-14 rounded-full bg-ink px-10 text-sm font-medium text-paper transition-colors hover:bg-ink-soft">
                Guardar alterações
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Account;
