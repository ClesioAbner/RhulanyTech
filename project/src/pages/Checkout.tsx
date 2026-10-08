import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STORE } from '../data/store';
import { toCartLine } from '../lib/cart';
import {
  cardBrand,
  formatMobile,
  isMobile,
  isValidCardNumber,
  isValidExpiry,
  isWallet,
  localNumber,
  maskMobile,
  newOrderNumber,
  orderPath,
  processPayment,
  walletError,
  type PaymentMethodId,
} from '../lib/checkout';
import { EMAIL_PATTERN } from '../lib/contact';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore, type Order } from '../stores/orderStore';
import { useUserStore } from '../stores/userStore';
import AwaitingConfirmation from '../components/checkout/AwaitingConfirmation';
import Step from '../components/checkout/CheckoutStep';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
import ContactForm from '../components/checkout/ContactForm';
import DeliveryForm from '../components/checkout/DeliveryForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentForm from '../components/checkout/PaymentForm';
import type { CardDetails, ContactDetails, DeliveryDetails, Errors } from '../components/checkout/types';

/** /checkout */
const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);
  const { currentUser, updateProfile } = useUserStore();

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<ContactDetails>({ name: '', email: '', phone: '' });
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    method: 'entrega',
    province: 'Maputo Cidade',
    city: 'Maputo',
    neighbourhood: '',
    street: '',
    reference: '',
    notes: '',
  });
  const [payment, setPayment] = useState<PaymentMethodId>('mpesa');
  const [wallet, setWallet] = useState('');
  const [card, setCard] = useState<CardDetails>({ name: '', number: '', expiry: '', cvc: '' });
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
    if (isWallet(payment)) return { wallet: walletError(payment, wallet) };
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
    window.setTimeout(
      () => document.getElementById(`passo-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      350,
    );
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
    // Signed-in customers get the address filled in next time.
    if (currentUser && delivery.method === 'entrega') {
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
    navigate(orderPath(order), { replace: true });
    clearCart();
  };

  if (!lines.length) {
    return (
      <div className="container-site py-24 text-center lg:py-32">
        <h1 className="type-display">O carrinho está vazio</h1>
        <p className="type-lead mx-auto mt-4 max-w-md text-ink/60">
          Junte os produtos que quer comprar e volte aqui para finalizar
        </p>
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
              lines={lines.map((line) => ({
                id: line.id,
                title: line.title,
                variant: line.variant,
                price: line.price,
                quantity: line.quantity,
                image: line.image,
              }))}
              subtotal={subtotal}
              delivery={deliveryText}
            />
            <p className="mt-4 px-2 text-xs leading-relaxed text-ink/45">
              Produtos originais com garantia oficial.{' '}
              {delivery.method === 'entrega' && 'O custo de entrega é confirmado consigo antes do envio'}
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
            <ContactForm
              contact={contact}
              onChange={setContact}
              onSubmit={proceed(validateContact, 1)}
              signedIn={Boolean(currentUser)}
              errors={errors}
              clearError={clearError}
            />
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
            <DeliveryForm
              delivery={delivery}
              onChange={setDelivery}
              onSubmit={proceed(validateDelivery, 2)}
              errors={errors}
              clearError={clearError}
            />
          </Step>

          <Step index={2} current={step} title="Pagamento" onEdit={() => setStep(2)}>
            {processing ? (
              <AwaitingConfirmation method={payment} phone={wallet} amount={subtotal} />
            ) : (
              <PaymentForm
                payment={payment}
                onPaymentChange={(next: PaymentMethodId) => {
                  setPayment(next);
                  setErrors({});
                }}
                wallet={wallet}
                onWalletChange={setWallet}
                card={card}
                onCardChange={setCard}
                amount={subtotal}
                onSubmit={pay}
                errors={errors}
                clearError={clearError}
              />
            )}
          </Step>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
