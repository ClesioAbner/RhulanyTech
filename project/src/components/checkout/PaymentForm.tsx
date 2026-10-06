import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  PAYMENTS_LIVE,
  PAYMENT_OPTIONS,
  cardBrand,
  formatCardNumber,
  formatExpiry,
  formatMobile,
  isWallet,
  paymentName,
  type PaymentMethodId,
} from '../../lib/checkout';
import { formatPrice } from '../../lib/format';
import { TextField } from '../ui/Field';
import ChoiceCard from './ChoiceCard';
import { primaryButton } from './styles';
import type { CardDetails, FormErrorsProps } from './types';

// An example number on each wallet's own network.
const WALLET_EXAMPLE: Record<string, string> = { mpesa: '84 123 4567', emola: '86 123 4567', mkesh: '82 123 4567' };

interface PaymentFormProps extends FormErrorsProps {
  payment: PaymentMethodId;
  onPaymentChange: (payment: PaymentMethodId) => void;
  wallet: string;
  onWalletChange: (wallet: string) => void;
  card: CardDetails;
  onCardChange: (card: CardDetails) => void;
  amount: number;
  onSubmit: (event: FormEvent) => void;
}

/** Checkout step 3: the payment method and its details. */
const PaymentForm = ({
  payment,
  onPaymentChange,
  wallet,
  onWalletChange,
  card,
  onCardChange,
  amount,
  onSubmit,
  errors,
  clearError,
}: PaymentFormProps) => {
  const setCard = (changes: Partial<CardDetails>, field: string) => {
    onCardChange({ ...card, ...changes });
    clearError(field);
  };
  const brand = cardBrand(card.number);

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div role="radiogroup" aria-label="Método de pagamento" className="grid gap-3 sm:grid-cols-2">
        {PAYMENT_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.id}
            title={option.name}
            note={option.note}
            selected={payment === option.id}
            onSelect={() => onPaymentChange(option.id)}
            layoutId="pagamento-escolha"
          />
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={payment}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {isWallet(payment) && (
            <TextField
              label={`Número ${paymentName(payment)}`}
              type="tel"
              inputMode="tel"
              leading="+258"
              value={wallet}
              onChange={(event) => {
                onWalletChange(formatMobile(event.target.value));
                clearError('wallet');
              }}
              error={errors.wallet}
              hint="Vai receber um pedido de confirmação neste número"
              placeholder={WALLET_EXAMPLE[payment]}
            />
          )}
          {payment === 'card' && (
            <div className="space-y-4">
              <TextField
                label="Nome no cartão"
                autoComplete="cc-name"
                value={card.name}
                onChange={(event) => setCard({ name: event.target.value }, 'cardName')}
                error={errors.cardName}
              />
              <div className="relative">
                <TextField
                  label="Número do cartão"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={card.number}
                  onChange={(event) => setCard({ number: formatCardNumber(event.target.value) }, 'cardNumber')}
                  error={errors.cardNumber}
                  placeholder="0000 0000 0000 0000"
                  className="pr-28 tabular-nums"
                />
                <AnimatePresence>
                  {brand && (
                    <motion.span
                      className="pointer-events-none absolute right-4 top-[42px] text-sm font-semibold tracking-tight text-ink/60"
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {brand}
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
                  onChange={(event) => setCard({ expiry: formatExpiry(event.target.value) }, 'cardExpiry')}
                  error={errors.cardExpiry}
                  placeholder="MM/AA"
                />
                <TextField
                  label="Código de segurança"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={card.cvc}
                  onChange={(event) => setCard({ cvc: event.target.value.replace(/\D/g, '').slice(0, 4) }, 'cardCvc')}
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
        <p className="text-xs leading-relaxed text-ink/45">
          Modo de demonstração: o pagamento é simulado e nenhum valor é cobrado
        </p>
      )}

      <div className="pt-1">
        <button type="submit" className={primaryButton}>
          {payment === 'paypal' ? 'Continuar com PayPal' : `Pagar ${formatPrice(amount)}`}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
