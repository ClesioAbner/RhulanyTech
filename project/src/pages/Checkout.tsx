import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { STORE } from '../data/store';
import { toCartLine } from '../lib/cart';
import {
  PAYMENTS_LIVE,
  PAYMENT_OPTIONS,
  PROVINCES,
  cardBrand,
  formatCardNumber,
  formatExpiry,
  formatMobile,
  isMobile,
  isValidCardNumber,
  isValidExpiry,
  localNumber,
  maskMobile,
  newOrderNumber,
  orderPath,
  paymentName,
  processPayment,
  walletError,
  type DeliveryMethod,
  type PaymentMethodId,
} from '../lib/checkout';
import { EMAIL_PATTERN } from '../lib/contact';
import { formatPrice } from '../lib/format';
import { easeOutExpo } from '../lib/motion';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore, type Order } from '../stores/orderStore';
import { useUserStore } from '../stores/userStore';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
import OrderSummary from '../components/checkout/OrderSummary';
import { SelectField, TextAreaField, TextField } from '../components/ui/Field';
import { PhoneIcon } from '../components/ui/Icons';

type Errors = Record<string, string | undefined>;

interface StepProps {
  index: number;
  current: number;
  title: string;
  summary?: ReactNode;
  onEdit: () => void;
  children: ReactNode;
}

/** One checkout step: open while active, folded into a summary line once done. */
const Step = ({ index, current, title, summary, onEdit, children }: StepProps) => {
  const active = index === current;
  const done = index < current;
  return (
    <section className={`rounded-[28px] bg-white p-6 transition-opacity duration-500 sm:p-8 ${!active && !done ? 'opacity-55' : ''}`} aria-labelledby={`passo-${index}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium tabular-nums ${
              active || done ? 'bg-ink text-paper' : 'bg-ink/[0.07] text-ink/45'
            }`}
          >
            {done ? (
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                <path d="M2.5 6.2l2.2 2.2 4.8-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              index + 1
            )}
          </span>
          <div className="min-w-0">
            <h2 id={`passo-${index}`} className="type-heading">
              {title}
            </h2>
            {done && summary && <div className="mt-1.5 text-sm leading-relaxed text-ink/55">{summary}</div>}
          </div>
        </div>
        {done && (
          <button type="button" onClick={onEdit} className="link-underline shrink-0 pt-1 text-sm text-ink/60 hover:text-ink">
            Alterar
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <div className="pt-7">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const primaryButton =
  'h-14 w-full rounded-full bg-ink text-sm font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-ink-soft active:scale-[0.99] disabled:cursor-progress disabled:opacity-80 sm:w-auto sm:px-10';

/** Mobile-money confirmation screen shown while the customer approves on the phone. */
const AwaitingConfirmation = ({ method, phone, amount }: { method: PaymentMethodId; phone: string; amount: number }) => {
  const wallet = method === 'mpesa' || method === 'emola';
  return (
    <motion.div
      className="rounded-[24px] bg-paper p-6 text-center sm:p-10"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      role="status"
      aria-live="polite"
    >
      <div className="relative mx-auto grid h-20 w-20 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-ink/10"
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-ink text-paper">
          {wallet ? <PhoneIcon className="h-6 w-6" /> : <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />}
        </span>
      </div>
      <p className="type-heading mt-6">
        {wallet ? 'Confirme no seu telemóvel' : method === 'paypal' ? 'A ligar ao PayPal' : 'A processar o pagamento'}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
        {wallet
          ? `Enviámos um pedido de ${formatPrice(amount)} para ${maskMobile(phone)}. Introduza o PIN ${paymentName(method)} para concluir`
          : 'Não feche esta página, demora apenas alguns segundos'}
      </p>
      <div className="mx-auto mt-6 h-1 max-w-xs overflow-hidden rounded-full bg-ink/10">
        <motion.span
          className="block h-full w-1/3 rounded-full bg-ink"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
};

/** /checkout */
const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);
  const { currentUser, addPurchase, updateProfile } = useUserStore();

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [delivery, setDelivery] = useState({
    method: 'entrega' as DeliveryMethod,
    province: 'Maputo Cidade',
    city: 'Maputo',
    neighbourhood: '',
    street: '',
    reference: '',
    notes: '',
  });
  const [payment, setPayment] = useState<PaymentMethodId>('mpesa');
  const [wallet, setWallet] = useState('');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);

  const lines = useMemo(() => items.map(toCartLine), [items]);

  useEffect(() => {
    document.title = 'Finalizar compra | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, []);

  // Fill in what the account already knows, without overwriting what was typed.
  useEffect(() => {
    if (!currentUser) return;
    setContact((current) => ({
      name: current.name || currentUser.name,
      email: current.email || currentUser.email,
      phone: current.phone || (currentUser.phone ? formatMobile(currentUser.phone) : ''),
    }));
    if (currentUser.savedAddress) {
      const saved = currentUser.savedAddress;
      setDelivery((current) => (current.neighbourhood || current.street ? current : { ...current, ...saved }));
    }
  }, [currentUser]);

  // The wallet number starts as the contact number.
  useEffect(() => {
    if (step === 2 && !wallet && contact.phone) setWallet(contact.phone);
  }, [step, wallet, contact.phone]);

  const clearError = (key: string) => errors[key] && setErrors((current) => ({ ...current, [key]: undefined }));

  const validateContact = (): Errors => ({
    name: contact.name.trim().length < 2 ? 'Indique o nome de quem recebe' : undefined,
    email: !EMAIL_PATTERN.test(contact.email.trim()) ? 'Indique um email válido para o recibo' : undefined,
    phone: !isMobile(contact.phone) ? 'Indique um número de telemóvel, por exemplo 84 123 4567' : undefined,
  });

  const validateDelivery = (): Errors =>
    delivery.method === 'levantamento'
      ? {}
      : {
          city: !delivery.city.trim() ? 'Indique a cidade ou distrito' : undefined,
          neighbourhood: !delivery.neighbourhood.trim() ? 'Indique o bairro' : undefined,
          reference: !delivery.reference.trim() ? 'Um ponto de referência ajuda o estafeta a encontrar a morada' : undefined,
        };

  const validatePayment = (): Errors => {
    if (payment === 'mpesa' || payment === 'emola') return { wallet: walletError(payment, wallet) };
    if (payment === 'card')
      return {
        cardName: card.name.trim().length < 3 ? 'Indique o nome como aparece no cartão' : undefined,
        cardNumber: !isValidCardNumber(card.number) ? 'Confirme o número do cartão' : undefined,
        cardExpiry: !isValidExpiry(card.expiry) ? 'Data inválida ou expirada' : undefined,
        cardCvc: !/^\d{3,4}$/.test(card.cvc) ? '3 dígitos no verso' : undefined,
      };
    return {};
  };

  const proceed = (validator: () => Errors, next: number) => (event: FormEvent) => {
    event.preventDefault();
    const found = validator();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    setStep(next);
    window.setTimeout(() => document.getElementById(`passo-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
  };

  const pay = async (event: FormEvent) => {
    event.preventDefault();
    const found = validatePayment();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setProcessing(true);
    // Bring the confirmation screen into view, especially on phones.
    window.setTimeout(() => document.getElementById('passo-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    const result = await processPayment(payment);
    const order: Order = {
      number: newOrderNumber(),
      createdAt: new Date().toISOString(),
      customer: { name: contact.name.trim(), email: contact.email.trim(), phone: formatMobile(contact.phone) },
      delivery:
        delivery.method === 'levantamento'
          ? { method: 'levantamento', notes: delivery.notes.trim() || undefined }
          : {
              method: 'entrega',
              province: delivery.province,
              city: delivery.city.trim(),
              neighbourhood: delivery.neighbourhood.trim(),
              street: delivery.street.trim() || undefined,
              reference: delivery.reference.trim(),
              notes: delivery.notes.trim() || undefined,
            },
      payment: {
        method: payment,
        detail:
          payment === 'card'
            ? `${cardBrand(card.number) ?? 'Cartão'} terminado em ${card.number.replace(/\D/g, '').slice(-4)}`
            : payment === 'paypal'
              ? undefined
              : maskMobile(wallet),
        reference: result.reference,
      },
      lines: lines.map((line) => ({
        id: line.id,
        name: line.name,
        title: line.title,
        variant: line.variant,
        price: line.price,
        quantity: line.quantity,
        image: line.image,
      })),
      subtotal,
      status: 'confirmada',
      userId: currentUser?.id,
    };

    addOrder(order);
    if (currentUser) {
      addPurchase({
        id: order.number,
        orderNumber: order.number,
        date: new Date(order.createdAt),
        items: order.lines.map((line) => ({ id: line.id, name: line.name, price: line.price, quantity: line.quantity, image: line.image })),
        total: order.subtotal,
        paymentMethod: paymentName(payment),
        status: 'confirmed',
      });
      if (delivery.method === 'entrega') {
        updateProfile({
          phone: currentUser.phone || localNumber(contact.phone),
          savedAddress: {
            province: delivery.province,
            city: delivery.city.trim(),
            neighbourhood: delivery.neighbourhood.trim(),
            street: delivery.street.trim(),
            reference: delivery.reference.trim(),
          },
        });
      }
    }
    navigate(orderPath(order), { replace: true });
    clearCart();
  };

  if (!lines.length) {
    return (
      <div className="container-site py-24 text-center lg:py-32">
        <h1 className="type-display">O carrinho está vazio</h1>
        <p className="type-lead mx-auto mt-4 max-w-md text-ink/60">Junte os produtos que quer comprar e volte aqui para finalizar</p>
        <Link to="/loja" className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper">
          Ir para a loja
        </Link>
      </div>
    );
  }

  const deliveryText = delivery.method === 'levantamento' ? 'Grátis' : 'A confirmar';

  return (
    <div className="pb-28 lg:pb-36">
      <header className="container-site flex flex-col gap-6 pt-8 lg:flex-row lg:items-end lg:justify-between lg:pt-12">
        <h1 className="type-display">Finalizar compra</h1>
        <CheckoutProgress current={step + 1} />
      </header>

      <div className="container-site mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
          <div className="lg:sticky lg:top-28">
            <OrderSummary
              lines={lines.map((line) => ({ id: line.id, title: line.title, variant: line.variant, price: line.price, quantity: line.quantity, image: line.image }))}
              subtotal={subtotal}
              delivery={deliveryText}
            />
            <p className="mt-4 px-2 text-xs leading-relaxed text-ink/45">
              Produtos originais com garantia oficial. {delivery.method === 'entrega' && 'O custo de entrega é confirmado consigo antes do envio'}
            </p>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-7 lg:row-start-1">
          <Step
            index={0}
            current={step}
            title="Contacto"
            onEdit={() => setStep(0)}
            summary={
              <>
                {contact.name}, {contact.email}
                <br />
                {formatMobile(contact.phone)}
              </>
            }
          >
            <form noValidate onSubmit={proceed(validateContact, 1)} className="space-y-4">
              {!currentUser && (
                <p className="rounded-2xl bg-paper px-5 py-4 text-sm text-ink/65">
                  Já tem conta?{' '}
                  <Link to="/entrar?voltar=/checkout" className="link-underline font-medium text-ink">
                    Entre
                  </Link>{' '}
                  para usar os seus dados guardados
                </p>
              )}
              <TextField
                label="Nome completo"
                autoComplete="name"
                value={contact.name}
                onChange={(event) => {
                  setContact({ ...contact, name: event.target.value });
                  clearError('name');
                }}
                error={errors.name}
                placeholder="Nome e apelido"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(event) => {
                    setContact({ ...contact, email: event.target.value });
                    clearError('email');
                  }}
                  error={errors.email}
                  placeholder="nome@exemplo.com"
                />
                <TextField
                  label="Telemóvel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  leading="+258"
                  value={contact.phone}
                  onChange={(event) => {
                    setContact({ ...contact, phone: formatMobile(event.target.value) });
                    clearError('phone');
                  }}
                  error={errors.phone}
                  placeholder="84 123 4567"
                />
              </div>
              <div className="pt-2">
                <button type="submit" className={primaryButton}>
                  Continuar para a entrega
                </button>
              </div>
            </form>
          </Step>

          <Step
            index={1}
            current={step}
            title="Entrega"
            onEdit={() => setStep(1)}
            summary={
              delivery.method === 'levantamento'
                ? `Levantamento na loja, ${STORE.address}`
                : [delivery.street, delivery.neighbourhood, delivery.city, delivery.province].filter(Boolean).join(', ')
            }
          >
            <form noValidate onSubmit={proceed(validateDelivery, 2)} className="space-y-5">
              <div role="radiogroup" aria-label="Forma de entrega" className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: 'entrega', title: 'Entrega ao domicílio', note: 'Em todo o país, com o custo confirmado antes do envio' },
                    { id: 'levantamento', title: 'Levantar na loja', note: `${STORE.address}, grátis` },
                  ] as const
                ).map((option) => {
                  const selected = delivery.method === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setDelivery({ ...delivery, method: option.id })}
                      className={`flex items-start gap-3 rounded-xl border p-5 text-left transition-[border-color,box-shadow] duration-300 ${
                        selected ? 'border-ink bg-white shadow-[0_0_0_1px_#0C0C0D]' : 'border-ink/[0.14] bg-white hover:border-ink/30'
                      }`}
                    >
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-ink' : 'border-ink/25'}`}>
                        {selected && <motion.span layoutId="entrega-escolha" className="h-2.5 w-2.5 rounded-full bg-ink" />}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium">{option.title}</span>
                        <span className="mt-1 block text-sm leading-snug text-ink/55">{option.note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence initial={false} mode="wait">
                {delivery.method === 'entrega' ? (
                  <motion.div
                    key="morada"
                    className="space-y-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField label="Província" value={delivery.province} onChange={(event) => setDelivery({ ...delivery, province: event.target.value })}>
                        {PROVINCES.map((province) => (
                          <option key={province}>{province}</option>
                        ))}
                      </SelectField>
                      <TextField
                        label="Cidade ou distrito"
                        autoComplete="address-level2"
                        value={delivery.city}
                        onChange={(event) => {
                          setDelivery({ ...delivery, city: event.target.value });
                          clearError('city');
                        }}
                        error={errors.city}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField
                        label="Bairro"
                        value={delivery.neighbourhood}
                        onChange={(event) => {
                          setDelivery({ ...delivery, neighbourhood: event.target.value });
                          clearError('neighbourhood');
                        }}
                        error={errors.neighbourhood}
                        placeholder="Por exemplo, Sommerschield"
                      />
                      <TextField
                        label="Rua e número"
                        optional
                        autoComplete="address-line1"
                        value={delivery.street}
                        onChange={(event) => setDelivery({ ...delivery, street: event.target.value })}
                        placeholder="Av. Julius Nyerere, 1234"
                      />
                    </div>
                    <TextField
                      label="Ponto de referência"
                      value={delivery.reference}
                      onChange={(event) => {
                        setDelivery({ ...delivery, reference: event.target.value });
                        clearError('reference');
                      }}
                      error={errors.reference}
                      placeholder="Perto da escola, prédio azul, segundo andar"
                    />
                    <TextAreaField
                      label="Notas para a entrega"
                      optional
                      value={delivery.notes}
                      onChange={(event) => setDelivery({ ...delivery, notes: event.target.value })}
                      placeholder="Horário preferido ou outra indicação"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="loja"
                    className="rounded-2xl bg-paper p-5 text-sm leading-relaxed text-ink/65"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-medium text-ink">{STORE.address}</p>
                    <p className="mt-1">{STORE.hours}. Contactamos consigo quando a encomenda estiver pronta a levantar</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <button type="submit" className={primaryButton}>
                  Continuar para o pagamento
                </button>
              </div>
            </form>
          </Step>

          <Step index={2} current={step} title="Pagamento" onEdit={() => setStep(2)}>
            {processing ? (
              <AwaitingConfirmation method={payment} phone={wallet} amount={subtotal} />
            ) : (
              <form noValidate onSubmit={pay} className="space-y-5">
                <div role="radiogroup" aria-label="Método de pagamento" className="grid gap-3 sm:grid-cols-2">
                  {PAYMENT_OPTIONS.map((option) => {
                    const selected = payment === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setPayment(option.id);
                          setErrors({});
                        }}
                        className={`flex items-start gap-3 rounded-xl border p-5 text-left transition-[border-color,box-shadow] duration-300 ${
                          selected ? 'border-ink bg-white shadow-[0_0_0_1px_#0C0C0D]' : 'border-ink/[0.14] bg-white hover:border-ink/30'
                        }`}
                      >
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-ink' : 'border-ink/25'}`}>
                          {selected && <motion.span layoutId="pagamento-escolha" className="h-2.5 w-2.5 rounded-full bg-ink" />}
                        </span>
                        <span>
                          <span className="block text-[15px] font-medium">{option.name}</span>
                          <span className="mt-1 block text-sm leading-snug text-ink/55">{option.note}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={payment}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(payment === 'mpesa' || payment === 'emola') && (
                      <TextField
                        label={`Número ${paymentName(payment)}`}
                        type="tel"
                        inputMode="tel"
                        leading="+258"
                        value={wallet}
                        onChange={(event) => {
                          setWallet(formatMobile(event.target.value));
                          clearError('wallet');
                        }}
                        error={errors.wallet}
                        hint="Vai receber um pedido de confirmação neste número"
                        placeholder={payment === 'mpesa' ? '84 123 4567' : '86 123 4567'}
                      />
                    )}
                    {payment === 'card' && (
                      <div className="space-y-4">
                        <TextField
                          label="Nome no cartão"
                          autoComplete="cc-name"
                          value={card.name}
                          onChange={(event) => {
                            setCard({ ...card, name: event.target.value });
                            clearError('cardName');
                          }}
                          error={errors.cardName}
                        />
                        <div className="relative">
                          <TextField
                            label="Número do cartão"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            value={card.number}
                            onChange={(event) => {
                              setCard({ ...card, number: formatCardNumber(event.target.value) });
                              clearError('cardNumber');
                            }}
                            error={errors.cardNumber}
                            placeholder="0000 0000 0000 0000"
                            className="pr-28 tabular-nums"
                          />
                          <AnimatePresence>
                            {cardBrand(card.number) && (
                              <motion.span
                                className="pointer-events-none absolute right-4 top-[42px] text-sm font-semibold tracking-tight text-ink/60"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                              >
                                {cardBrand(card.number)}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <TextField
                            label="Validade"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            value={card.expiry}
                            onChange={(event) => {
                              setCard({ ...card, expiry: formatExpiry(event.target.value) });
                              clearError('cardExpiry');
                            }}
                            error={errors.cardExpiry}
                            placeholder="MM/AA"
                          />
                          <TextField
                            label="Código de segurança"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={card.cvc}
                            onChange={(event) => {
                              setCard({ ...card, cvc: event.target.value.replace(/\D/g, '').slice(0, 4) });
                              clearError('cardCvc');
                            }}
                            error={errors.cardCvc}
                            placeholder="CVC"
                          />
                        </div>
                      </div>
                    )}
                    {payment === 'paypal' && (
                      <p className="rounded-2xl bg-paper p-5 text-sm leading-relaxed text-ink/65">
                        Ao continuar, entra na sua conta PayPal para aprovar o pagamento e volta aqui para ver a confirmação
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {!PAYMENTS_LIVE && (
                  <p className="text-xs leading-relaxed text-ink/45">Modo de demonstração: o pagamento é simulado e nenhum valor é cobrado</p>
                )}

                <div className="pt-1">
                  <button type="submit" className={primaryButton}>
                    {payment === 'paypal' ? 'Continuar com PayPal' : `Pagar ${formatPrice(subtotal)}`}
                  </button>
                </div>
              </form>
            )}
          </Step>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
